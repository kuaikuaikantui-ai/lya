import SwiftUI
import WebKit
import AVFoundation
import MediaPlayer
import UIKit

struct OrientationHelper {
    static func forceLandscape() {
        DispatchQueue.main.async {
            AppDelegate.orientationLock = .allButUpsideDown
            if #available(iOS 16.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
                    let preferences = UIWindowScene.GeometryPreferences.iOS(interfaceOrientations: .landscapeRight)
                    windowScene.requestGeometryUpdate(preferences) { _ in }
                }
            }
            UIDevice.current.setValue(UIInterfaceOrientation.landscapeRight.rawValue, forKey: "orientation")
            UIViewController.attemptRotationToDeviceOrientation()
        }
    }

    static func forcePortrait() {
        DispatchQueue.main.async {
            AppDelegate.orientationLock = .portrait
            if #available(iOS 16.0, *) {
                if let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene {
                    let preferences = UIWindowScene.GeometryPreferences.iOS(interfaceOrientations: .portrait)
                    windowScene.requestGeometryUpdate(preferences) { _ in }
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

    var body: some View {
        ZStack {
            Color(red: 15/255, green: 20/255, blue: 28/255).ignoresSafeArea()

            LyaWebView(
                serverUrl: serverUrl,
                reloadTrigger: reloadTrigger,
                isOfflineMode: isOfflineMode,
                sharedWebView: $sharedWebView
            )
            .ignoresSafeArea()
        }
        .onAppear {
            UIApplication.shared.isIdleTimerDisabled = true
        }
    }
}

struct LyaWebView: UIViewRepresentable {
    let serverUrl: String
    let reloadTrigger: UUID
    let isOfflineMode: Bool
    @Binding var sharedWebView: WKWebView?

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsPictureInPictureMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = true

        let userContent = WKUserContentController()

        // 注册原生方向同步 Bridge (实现无缝横竖屏切换，不重新缓冲)
        userContent.add(context.coordinator, name: "nativeOrientation")

        // 强力全网广告免疫脚本 (屏蔽所有弹窗/联盟广告，保护视频主容器)
        let adBlockScript = WKUserScript(
            source: """
            (function() {
                var style = document.createElement('style');
                style.innerHTML = `
                    [id*="ad_"], [class*="ad_"], [id*="banner"], [class*="banner"],
                    [class*="popup"], [id*="popup"], iframe[src*="ad"], iframe[src*="union"],
                    div[style*="z-index: 9999"], div[style*="z-index:9999"],
                    .ad-banner, .video-ad, .play-ad, .pause-ad,
                    a[href*="bet"], a[href*="casino"], a[href*="game"], a[href*="app"],
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

                function purgeAds() {
                    var selectors = [
                        '[id*="ad_"]', '[class*="ad_"]', '[id*="banner"]', '[class*="banner"]',
                        '.ad-banner', '.video-ad', '.pause-ad', 'iframe[src*="ad"]', '#app_download_bar'
                    ];
                    selectors.forEach(function(s) {
                        try {
                            document.querySelectorAll(s).forEach(function(el) {
                                if (!el.closest('#videoPlayerView') && !el.closest('#dplayerContainer')) {
                                    el.remove();
                                }
                            });
                        } catch(e){}
                    });
                }
                document.addEventListener('DOMContentLoaded', purgeAds);
                setInterval(purgeAds, 1200);
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

        webView.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 LyaNativeApp/1.0"

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
            if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
            }
        }

        // 处理原生横竖屏旋转消息
        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "nativeOrientation", let mode = message.body as? String {
                if mode == "landscape" {
                    OrientationHelper.forceLandscape()
                } else if mode == "portrait" {
                    OrientationHelper.forcePortrait()
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
            let alert = UIAlertController(title: "提示", message: message, preferredStyle: .default)
            alert.addAction(UIAlertAction(title: "知道了", style: .default, handler: { _ in
                completionHandler()
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
