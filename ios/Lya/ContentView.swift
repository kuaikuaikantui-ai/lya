import SwiftUI
import WebKit
import AVFoundation
import MediaPlayer
import UIKit

struct OrientationHelper {
    static func forceLandscape() {
        DispatchQueue.main.async {
            AppDelegate.orientationLock = .landscapeRight
            if #available(iOS 16.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes
                    .compactMap({ $0 as? UIWindowScene })
                    .first(where: { $0.activationState == .foregroundActive }) {
                    let preferences = UIWindowScene.GeometryPreferences.iOS(interfaceOrientations: .landscapeRight)
                    windowScene.requestGeometryUpdate(preferences, errorHandler: { error in
                        print("[Lya] requestGeometryUpdate landscape failed: \(error.localizedDescription)")
                    })
                }
            }
            // iOS 15 及以下的传统兜底；iOS 16+ 上该 KVC 无效但无害
            UIDevice.current.setValue(UIInterfaceOrientation.landscapeRight.rawValue, forKey: "orientation")
            UIViewController.attemptRotationToDeviceOrientation()
        }
    }

    static func forcePortrait() {
        DispatchQueue.main.async {
            AppDelegate.orientationLock = .portrait
            if #available(iOS 16.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes
                    .compactMap({ $0 as? UIWindowScene })
                    .first(where: { $0.activationState == .foregroundActive }) {
                    let preferences = UIWindowScene.GeometryPreferences.iOS(interfaceOrientations: .portrait)
                    windowScene.requestGeometryUpdate(preferences, errorHandler: { error in
                        print("[Lya] requestGeometryUpdate portrait failed: \(error.localizedDescription)")
                    })
                }
            }
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
            UIViewController.attemptRotationToDeviceOrientation()
        }
    }
}

struct ContentView: View {
    @AppStorage("lya_server_url") private var serverUrl: String = "https://lya-arr.pages.dev"
    @State private var reloadTrigger = UUID()
    @State private var isOfflineMode = false
    @State private var sharedWebView: WKWebView? = nil
    @State private var loadError: String? = nil
    @State private var sharedKanjuWebView: WKWebView? = nil

    var body: some View {
        ZStack {
            Color(red: 15/255, green: 20/255, blue: 28/255).ignoresSafeArea()

            LyaWebView(
                serverUrl: serverUrl,
                reloadTrigger: reloadTrigger,
                isOfflineMode: isOfflineMode,
                sharedWebView: $sharedWebView,
                loadError: $loadError,
                kanjuWebView: $sharedKanjuWebView
            )
            .ignoresSafeArea()

            // kanju 官方线路解析桥：隐藏 WKWebView 以【用户 IP + 游客 Cookie】调原站 API，
            // 解锁官方字节 CDN（1080P-官方V/S/Z、专享4K 等）就近分发线路
            KanjuBridgeWebView(kanjuWebView: $sharedKanjuWebView)
                .frame(width: 1, height: 1)
                .opacity(0)
                .disabled(true)

            if let errText = loadError {
                networkErrorOverlay(message: errText)
            }
        }
    }

    // 网络加载失败时的原生重试面板（离线 www 包存在时不会走到这里）
    private func networkErrorOverlay(message: String) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "wifi.exclamationmark")
                .font(.system(size: 44, weight: .light))
                .foregroundColor(Color(red: 56/255, green: 189/255, blue: 248/255))
            Text("网络连接失败")
                .font(.system(size: 19, weight: .semibold))
                .foregroundColor(.white)
            Text(message)
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 30)
            Button(action: {
                loadError = nil
                if let webView = sharedWebView {
                    webView.reload()
                } else {
                    reloadTrigger = UUID()
                }
            }) {
                Text("重试")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 44)
                    .padding(.vertical, 11)
                    .background(Color(red: 56/255, green: 189/255, blue: 248/255))
                    .cornerRadius(22)
            }
            .padding(.top, 6)
        }
        .padding(26)
        .background(
            RoundedRectangle(cornerRadius: 22)
                .fill(Color(red: 15/255, green: 20/255, blue: 28/255))
                .shadow(color: .black.opacity(0.5), radius: 22, x: 0, y: 8)
        )
        .padding(.horizontal, 44)
    }
}

// kanju 官方线路解析桥：隐藏 WKWebView 装载原站页面（游客 Cookie 自动建立），
// 主 WebView 的解析请求经原生转发到该上下文内执行（同源、用户 IP、签名注入），
// 解锁官方字节 CDN（1080P-官方V/S/Z、专享4K）就近分发线路。
struct KanjuBridgeWebView: UIViewRepresentable {
    @Binding var kanjuWebView: WKWebView?

    private static let bridgeScript = """
    (function() {
      if (window.__kanjuBridgeReady) return;
      var SECRET = '557d0e4ae929f438da6bd84412374e6086b8af09b3fed54bf22601d5bf8c54a0';
      function toHex(buf) { return Array.from(new Uint8Array(buf), function(b) { return b.toString(16).padStart(2, '0'); }).join(''); }
      window.__kanjuResults = {};
      window.__kanjuBridgeFetch = async function(req) {
        var method = (req.method || 'GET').toUpperCase();
        var ts = String(Date.now());
        var arr = new Uint8Array(16);
        crypto.getRandomValues(arr);
        var nonce = toHex(arr.buffer);
        var payload = method + '\\n' + req.path + (req.search || '') + '\\n' + ts + '\\n' + nonce;
        var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
        var headers = {
          'Accept': 'application/json',
          'x-ai-movie-client-name': 'dianyingtiantang-frontend',
          'x-ai-movie-client-version': '1.0.0',
          'x-ai-movie-timestamp': ts,
          'x-ai-movie-nonce': nonce,
          'x-ai-movie-signature': toHex(sig)
        };
        if (req.bodyObj) headers['Content-Type'] = 'application/json';
        var r = await fetch(req.path + (req.search || ''), {
          method: method,
          headers: headers,
          body: req.bodyObj ? JSON.stringify(req.bodyObj) : undefined,
          credentials: 'include'
        });
        return { status: r.status, text: await r.text() };
      };
      window.__kanjuBridgeReady = true;
    })();
    """

    func makeUIView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        let userContent = WKUserContentController()
        // 每次导航完成自动注入桥函数（atDocumentEnd，页面脚本就绪后可用）
        userContent.addUserScript(WKUserScript(source: Self.bridgeScript, injectionTime: .atDocumentEnd, forMainFrameOnly: true))
        cfg.userContentController = userContent
        let wv = WKWebView(frame: .zero, configuration: cfg)
        wv.isHidden = true
        if let url = URL(string: "https://kanju32.com/") {
            wv.load(URLRequest(url: url))
        }
        DispatchQueue.main.async { self.kanjuWebView = wv }
        return wv
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

struct LyaWebView: UIViewRepresentable {
    let serverUrl: String
    let reloadTrigger: UUID
    let isOfflineMode: Bool
    @Binding var sharedWebView: WKWebView?
    @Binding var loadError: String?
    @Binding var kanjuWebView: WKWebView?

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsPictureInPictureMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = true

        let userContent = WKUserContentController()

        // 注册原生 Bridge：方向同步 / 触感反馈 / 屏幕常亮（播放与阅读期间保持常亮）/ kanju 官方线路解析桥
        userContent.add(context.coordinator, name: "nativeOrientation")
        userContent.add(context.coordinator, name: "nativeHaptic")
        userContent.add(context.coordinator, name: "nativeScreenSleep")
        userContent.add(context.coordinator, name: "kanjuRequest")

        // 广告免疫：CSS 兜底隐藏 + MutationObserver 定向清除（替代原先每 1.2s 全页轮询，
        // 避免长按倍速等手势期间被周期性 DOM 扫描抢占主线程造成卡顿）
        let adBlockScript = WKUserScript(
            source: """
            (function() {
                var style = document.createElement('style');
                style.innerHTML = `
                    [id*="ad_"], [id*="-ad"], [class*="ad-banner"], [class*="ad-wrap"],
                    [class*="video-ad"], [class*="play-ad"], [class*="pause-ad"],
                    iframe[src*="ad"], iframe[src*="union"],
                    #app_download_bar, .download-banner, .float-ad,
                    .movie-app-header-ad, .video-sponsor-card {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        height: 0 !important;
                    }
                `;
                (document.head || document.documentElement).appendChild(style);

                var PURGE_SELECTORS = [
                    '[id*="ad_"]', '[id*="-ad"]', '[class*="ad-banner"]', '[class*="video-ad"]',
                    '.pause-ad', 'iframe[src*="ad"]', '#app_download_bar', '.float-ad'
                ];
                function purgeAds() {
                    for (var i = 0; i < PURGE_SELECTORS.length; i++) {
                        try {
                            var nodes = document.querySelectorAll(PURGE_SELECTORS[i]);
                            for (var j = 0; j < nodes.length; j++) {
                                var el = nodes[j];
                                if (!el.closest('#videoPlayerView') && !el.closest('#dplayerContainer')) {
                                    el.remove();
                                }
                            }
                        } catch(e){}
                    }
                }
                document.addEventListener('DOMContentLoaded', purgeAds);
                // 脚本注入时 DOM 已就绪（atDocumentEnd），DOMContentLoaded 已错过——立即清一次
                setTimeout(purgeAds, 0);
                try {
                    var pending = null;
                    var observer = new MutationObserver(function(muts) {
                        if (pending) return;
                        pending = setTimeout(function() { pending = null; purgeAds(); }, 600);
                    });
                    observer.observe(document.documentElement, { childList: true, subtree: true });
                } catch(e){}
            })();
            """,
            injectionTime: .atDocumentEnd,
            forMainFrameOnly: false
        )
        userContent.addUserScript(adBlockScript)
        config.userContentController = userContent

        let prefs = WKPreferences()
        prefs.javaScriptCanOpenWindowsAutomatically = true
        config.preferences = prefs

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 15/255, green: 20/255, blue: 28/255, alpha: 1)
        webView.scrollView.backgroundColor = UIColor(red: 15/255, green: 20/255, blue: 28/255, alpha: 1)
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator

        // UA 使用真实系统版本号，避免 iOS 15 设备伪装 17.0 造成 JS 特性误判；保留 LyaNativeApp 标识供网页层识别 APP 环境
        let osVersion = UIDevice.current.systemVersion.replacingOccurrences(of: ".", with: "_")
        webView.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS \(osVersion) like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 LyaNativeApp/2.0"

        DispatchQueue.main.async {
            self.sharedWebView = webView
        }

        context.coordinator.loadContent(in: webView, serverUrl: serverUrl, isOffline: isOfflineMode)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if context.coordinator.lastTrigger != reloadTrigger {
            context.coordinator.lastTrigger = reloadTrigger
            context.coordinator.loadContent(in: uiView, serverUrl: serverUrl, isOffline: isOfflineMode)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(parent: self)
    }

    class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        let parent: LyaWebView
        var lastTrigger = UUID()

        init(parent: LyaWebView) {
            self.parent = parent
        }

        func loadContent(in webView: WKWebView, serverUrl: String, isOffline: Bool) {
            let trimmed = serverUrl.trimmingCharacters(in: .whitespacesAndNewlines)

            // 新页面加载前重置屏幕常亮：防止"播放中刷新页面"后常亮卡死整个会话
            UIApplication.shared.isIdleTimerDisabled = false

            if !isOffline && !trimmed.isEmpty, let targetUrl = URL(string: trimmed.hasPrefix("http") ? trimmed : "https://\(trimmed)") {
                let req = URLRequest(url: targetUrl, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 12)
                webView.load(req)
                return
            }

            if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
            } else if let fallbackUrl = Bundle.main.url(forResource: "index", withExtension: "html") {
                webView.loadFileURL(fallbackUrl, allowingReadAccessTo: fallbackUrl.deletingLastPathComponent())
            } else if let defaultTarget = URL(string: "https://lya-arr.pages.dev") {
                webView.load(URLRequest(url: defaultTarget))
            }
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            // 有离线 www 包时静默降级离线模式；没有则给出原生重试面板，而不是无声无息
            let hasOfflineBundle = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") != nil
            if hasOfflineBundle {
                if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                    webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
                }
            } else {
                DispatchQueue.main.async {
                    // parent.loadError 经属性包装器投影后即为 String?（Binding 的 wrappedValue）
                    if self.parent.loadError == nil {
                        self.parent.loadError = "无法连接到服务器：\(error.localizedDescription)"
                    }
                }
            }
        }

        // 注：Xcode 26+ SDK 已将 WKNavigationDelegate 的 didFailNavigation 重命名为 didFail
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: any Error) {
            // 导航中途失败（重定向被断、内容进程崩溃等）同样给出重试面板
            let hasOfflineBundle = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") != nil
            if !hasOfflineBundle {
                DispatchQueue.main.async {
                    if self.parent.loadError == nil {
                        self.parent.loadError = "页面加载中断：\(error.localizedDescription)"
                    }
                }
            }
        }

        // 处理原生消息：横竖屏 / 触感反馈 / 屏幕常亮
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            switch message.name {
            case "nativeOrientation":
                if let mode = message.body as? String {
                    if mode == "landscape" {
                        OrientationHelper.forceLandscape()
                    } else if mode == "portrait" {
                        OrientationHelper.forcePortrait()
                    }
                }
            case "nativeHaptic":
                if let style = message.body as? String {
                    triggerHaptic(style)
                }
            case "nativeScreenSleep":
                if let mode = message.body as? String {
                    DispatchQueue.main.async {
                        UIApplication.shared.isIdleTimerDisabled = (mode == "on")
                    }
                }
            case "kanjuRequest":
                // 主页面请求 kanju 官方线路解析：转发到隐藏 kanju WebView（用户 IP 同源调用）后回传
                if let jsonStr = message.body as? String,
                   let data = jsonStr.data(using: .utf8),
                   let req = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    callKanjuBridge(req: req) { resultJson in
                        guard let mainWv = self.parent.sharedWebView else { return }
                        let payload = resultJson ?? "{\"status\":0,\"text\":\"bridge unavailable\"}"
                        let escaped = payload
                            .replacingOccurrences(of: "\\", with: "\\\\")
                            .replacingOccurrences(of: "'", with: "\\'")
                            .replacingOccurrences(of: "\n", with: "\\n")
                        let script = "if(window.__kanjuOnResponse){window.__kanjuOnResponse('\(req["reqId"] ?? "")','\(escaped)');}"
                        DispatchQueue.main.async {
                            mainWv.evaluateJavaScript(script, completionHandler: nil)
                        }
                    }
                }
            default:
                break
            }
        }

        // 在隐藏 kanju WebView 上下文内执行带签名的同源请求，轮询回传结果
        private func callKanjuBridge(req: [String: Any], completion: @escaping (String?) -> Void) {
            DispatchQueue.main.async {
                guard let kwv = self.parent.kanjuWebView else { completion(nil); return }
                guard let data = try? JSONSerialization.data(withJSONObject: req),
                      let reqJson = String(data: data, encoding: .utf8) else { completion(nil); return }
                let reqId = UUID().uuidString
                let script = """
                (function(){
                  try {
                    var req = \(reqJson);
                    window.__kanjuBridgeFetch(req).then(function(res){
                      window.__kanjuResults['\(reqId)'] = JSON.stringify(res);
                    }).catch(function(e){
                      window.__kanjuResults['\(reqId)'] = JSON.stringify({status:0, text:'bridge error: ' + (e && e.message ? e.message : 'unknown')});
                    });
                  } catch(e) {
                    window.__kanjuResults['\(reqId)'] = JSON.stringify({status:0, text:'bridge sync error'});
                  }
                })();
                """
                kwv.evaluateJavaScript(script, completionHandler: nil)
                var attempts = 0
                Timer.scheduledTimer(withTimeInterval: 0.25, repeats: true) { timer in
                    attempts += 1
                    if attempts > 40 { // 10 秒超时
                        timer.invalidate()
                        completion(nil)
                        return
                    }
                    kwv.evaluateJavaScript("window.__kanjuResults && window.__kanjuResults['\(reqId)'] || null") { result, _ in
                        if let s = result as? String, s != "null", !s.isEmpty {
                            timer.invalidate()
                            completion(s)
                        }
                    }
                }
            }
        }

        private func triggerHaptic(_ style: String) {
            DispatchQueue.main.async {
                switch style {
                case "light":
                    UIImpactFeedbackGenerator(style: .light).impactOccurred()
                case "medium":
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                case "heavy":
                    UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
                case "success":
                    UINotificationFeedbackGenerator().notificationOccurred(.success)
                case "warning":
                    UINotificationFeedbackGenerator().notificationOccurred(.warning)
                case "error":
                    UINotificationFeedbackGenerator().notificationOccurred(.error)
                default:
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                }
            }
        }

        // 支持 JS confirm 对话框 (用于通行证注销/退出登录二次确认)
        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
            let alert = UIAlertController(title: "提示", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "取消", style: .cancel, handler: { _ in
                completionHandler(false)
            }))
            alert.addAction(UIAlertAction(title: "确定", style: .default, handler: { _ in
                completionHandler(true)
            }))
            getTopViewController()?.present(alert, animated: true)
        }

        // 支持 JS alert 提示框
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            let alert = UIAlertController(title: "提示", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "知道了", style: .default, handler: { _ in
                completionHandler()
            }))
            getTopViewController()?.present(alert, animated: true)
        }

        // 支持 JS prompt 输入框（此前缺失会导致网页端 prompt() 静默返回 null）
        func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
            let alert = UIAlertController(title: "输入", message: message, preferredStyle: .alert)
            alert.addTextField { textField in
                textField.placeholder = message
            }
            alert.addAction(UIAlertAction(title: "取消", style: .cancel, handler: { _ in
                completionHandler(nil)
            }))
            alert.addAction(UIAlertAction(title: "确定", style: .default, handler: { _ in
                completionHandler(alert.textFields?.first?.text)
            }))
            getTopViewController()?.present(alert, animated: true)
        }

        private func getTopViewController() -> UIViewController? {
            guard let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
                  let window = windowScene.windows.first(where: { $0.isKeyWindow }) else {
                return nil
            }
            var topController = window.rootViewController
            while let presentedViewController = topController?.presentedViewController {
                topController = presentedViewController
            }
            return topController
        }
    }
}
