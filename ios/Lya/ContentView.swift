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

    var body: some View {
        ZStack {
            Color(red: 15/255, green: 20/255, blue: 28/255).ignoresSafeArea()

            LyaWebView(
                serverUrl: serverUrl,
                reloadTrigger: reloadTrigger,
                isOfflineMode: isOfflineMode,
                sharedWebView: $sharedWebView,
                loadError: $loadError
            )
            .ignoresSafeArea()

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

struct LyaWebView: UIViewRepresentable {
    let serverUrl: String
    let reloadTrigger: UUID
    let isOfflineMode: Bool
    @Binding var sharedWebView: WKWebView?
    @Binding var loadError: String?

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsPictureInPictureMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = true

        let userContent = WKUserContentController()

        // 注册原生 Bridge：方向同步 / 触感反馈 / 屏幕常亮（播放与阅读期间保持常亮）
        userContent.add(context.coordinator, name: "nativeOrientation")
        userContent.add(context.coordinator, name: "nativeHaptic")
        userContent.add(context.coordinator, name: "nativeScreenSleep")

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

        func webView(_ webView: WKWebView, didFailNavigation navigation: WKNavigation!, withError error: Error) {
            // 导航中途失败（重定向被断、内容进程崩溃等）同样给出重试面板
            let hasOfflineBundle = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") != nil
            if !hasOfflineBundle {
                DispatchQueue.main.async {
                    if self.parent.loadError == nil {
                        self.parent.loadError = "页面加载中断：(error.localizedDescription)"
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
            default:
                break
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
