import SwiftUI
import WebKit
import AVFoundation
import MediaPlayer

struct ContentView: View {
    @AppStorage("lya_server_url") private var serverUrl: String = "https://lya-arr.pages.dev"
    @State private var showSettings = false
    @State private var inputUrl = ""
    @State private var reloadTrigger = UUID()
    @State private var isOfflineMode = false
    @State private var currentPlayItem: NativePlayItem? = nil

    @State private var sharedWebView: WKWebView? = nil

    var body: some View {
        ZStack {
            Color(red: 15/255, green: 20/255, blue: 28/255).ignoresSafeArea()

            LyaWebView(
                serverUrl: serverUrl,
                reloadTrigger: reloadTrigger,
                isOfflineMode: isOfflineMode,
                currentPlayItem: $currentPlayItem,
                sharedWebView: $sharedWebView
            )
            .ignoresSafeArea()

            // 顶部右上角配置齿轮：支持配置或重载
            VStack {
                HStack {
                    Spacer()
                    Button(action: {
                        inputUrl = serverUrl
                        showSettings = true
                    }) {
                        Image(systemName: "gearshape.fill")
                            .font(.system(size: 15))
                            .foregroundColor(.white.opacity(0.18))
                            .padding(12)
                            .background(Color.black.opacity(0.1))
                            .clipShape(Circle())
                    }
                    .padding(.trailing, 16)
                    .padding(.top, 40)
                }
                Spacer()
            }
        }
        .onAppear {
            UIApplication.shared.isIdleTimerDisabled = true
        }
        .fullScreenCover(item: $currentPlayItem) { item in
            LyaNativePlayerView(
                playItem: $currentPlayItem,
                onTimeUpdate: { seconds, epIdx in
                    sharedWebView?.evaluateJavaScript("if (window.onNativePlayerTimeUpdate) window.onNativePlayerTimeUpdate(\(seconds), \(epIdx));", completionHandler: nil)
                },
                onSwitchEpisode: { newIdx in
                    sharedWebView?.evaluateJavaScript("if (window.onNativePlayerSwitchEpisode) window.onNativePlayerSwitchEpisode(\(newIdx));", completionHandler: nil)
                },
                onSwitchLine: { newLineIdx in
                    sharedWebView?.evaluateJavaScript("if (window.onNativePlayerSwitchLine) window.onNativePlayerSwitchLine(\(newLineIdx));", completionHandler: nil)
                },
                onClose: { lastSeconds in
                    sharedWebView?.evaluateJavaScript("if (window.onNativePlayerClose) window.onNativePlayerClose(\(lastSeconds));", completionHandler: nil)
                }
            )
            .ignoresSafeArea()
        }
        .sheet(isPresented: $showSettings) {
            ServerSettingsView(
                serverUrl: $serverUrl,
                inputUrl: $inputUrl,
                isOfflineMode: $isOfflineMode,
                onSave: {
                    reloadTrigger = UUID()
                    showSettings = false
                }
            )
        }
    }
}

struct LyaWebView: UIViewRepresentable {
    let serverUrl: String
    let reloadTrigger: UUID
    let isOfflineMode: Bool
    @Binding var currentPlayItem: NativePlayItem?
    @Binding var sharedWebView: WKWebView?

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsPictureInPictureMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = true

        // 注入原生交互 Bridge & 全局广告拦截脚本
        let userContent = WKUserContentController()
        userContent.add(context.coordinator, name: "lyaNativePlayer")
        userContent.add(context.coordinator, name: "nativeBridge")
        userContent.add(context.coordinator, name: "nativeHlsPlayback")

        // 强大的全网广告免疫脚本 (彻底解决源站恶心广告问题)
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

    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler, WKUIDelegate {
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

            // 本地内置离线包极速秒开 (0ms 启动，无任何广告)
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

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            // 1. 处理 Lya 专用原生全屏播放协议
            if message.name == "lyaNativePlayer", let dict = message.body as? [String: Any] {
                let action = dict["action"] as? String ?? ""
                if action == "play" {
                    let title = dict["title"] as? String ?? "视频播放"
                    let epTitle = dict["episodeTitle"] as? String ?? ""
                    let url = dict["url"] as? String ?? ""
                    let resumeSec = (dict["resumeSeconds"] as? NSNumber)?.doubleValue ?? 0
                    let curIdx = (dict["currentEpIdx"] as? NSNumber)?.intValue ?? 0
                    let lineName = dict["lineName"] as? String ?? "官方极速"
                    let curLineIdx = (dict["currentLineIdx"] as? NSNumber)?.intValue ?? 0

                    var eps: [NativeEpisodeItem] = []
                    if let rawList = dict["episodes"] as? [[String: Any]] {
                        eps = rawList.enumerated().map { (idx, e) in
                            NativeEpisodeItem(
                                id: (e["index"] as? NSNumber)?.intValue ?? idx,
                                title: e["title"] as? String ?? "第\(idx + 1)集",
                                url: e["url"] as? String ?? ""
                            )
                        }
                    }

                    var lines: [NativeLineOption] = []
                    if let rawLines = dict["lines"] as? [[String: Any]] {
                        lines = rawLines.enumerated().map { (lIdx, l) in
                            var lEps: [NativeEpisodeItem] = []
                            if let rawLEps = l["episodes"] as? [[String: Any]] {
                                lEps = rawLEps.enumerated().map { (eIdx, e) in
                                    NativeEpisodeItem(
                                        id: (e["index"] as? NSNumber)?.intValue ?? eIdx,
                                        title: e["title"] as? String ?? "第\(eIdx + 1)集",
                                        url: e["url"] as? String ?? ""
                                    )
                                }
                            }
                            return NativeLineOption(
                                id: (l["id"] as? NSNumber)?.intValue ?? lIdx,
                                name: l["name"] as? String ?? "线路 \(lIdx + 1)",
                                is4K: l["is4K"] as? Bool ?? false,
                                isOfficial: l["isOfficial"] as? Bool ?? false,
                                episodes: lEps
                            )
                        }
                    }

                    DispatchQueue.main.async {
                        self.parent.currentPlayItem = NativePlayItem(
                            title: title,
                            episodeTitle: epTitle,
                            url: url,
                            resumeSeconds: resumeSec,
                            episodes: eps,
                            currentEpIdx: curIdx,
                            lineName: lineName,
                            lines: lines,
                            currentLineIdx: curLineIdx
                        )
                    }
                }
            }
            // 2. 兼容源站 kanju.ai nativeBridge 协议 (无缝接管源站直通流，纯净零广告)
            else if message.name == "nativeBridge", let dict = message.body as? [String: Any] {
                let action = dict["action"] as? String ?? dict["method"] as? String ?? ""
                if action.contains("open") || action.contains("openNativePlayer") {
                    let params = dict["params"] as? [String: Any] ?? dict
                    let url = params["url"] as? String ?? ""
                    let title = params["title"] as? String ?? "影视播放"
                    let epTitle = params["episode_title"] as? String ?? params["episodeTitle"] as? String ?? ""
                    let startSec = (params["startPositionSeconds"] as? NSNumber)?.doubleValue ?? (params["start_position_seconds"] as? NSNumber)?.doubleValue ?? 0
                    let line = params["line_name"] as? String ?? "官方超清"
                    if !url.isEmpty {
                        DispatchQueue.main.async {
                            self.parent.currentPlayItem = NativePlayItem(
                                title: title,
                                episodeTitle: epTitle,
                                url: url,
                                resumeSeconds: startSec,
                                episodes: [NativeEpisodeItem(id: 0, title: epTitle.isEmpty ? "正片" : epTitle, url: url)],
                                currentEpIdx: 0,
                                lineName: line
                            )
                        }
                    }
                }
            }
        }

        // MARK: - WKUIDelegate (支持原生 Alert 与 Confirm 弹窗，解决通行证注销/提示问题)
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
            let alert = UIAlertController(title: "提示", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "确定", style: .default) { _ in completionHandler() })
            findTopViewController()?.present(alert, animated: true)
        }

        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
            let alert = UIAlertController(title: "提示", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "取消", style: .cancel) { _ in completionHandler(false) })
            alert.addAction(UIAlertAction(title: "确定", style: .destructive) { _ in completionHandler(true) })
            findTopViewController()?.present(alert, animated: true)
        }

        private func findTopViewController() -> UIViewController? {
            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                  let window = scene.windows.first(where: { $0.isKeyWindow }) ?? scene.windows.first,
                  var top = window.rootViewController else {
                return nil
            }
            while let presented = top.presentedViewController {
                top = presented
            }
            return top
        }
    }
}

struct ServerSettingsView: View {
    @Binding var serverUrl: String
    @Binding var inputUrl: String
    @Binding var isOfflineMode: Bool
    var onSave: () -> Void

    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("服务连接模式")) {
                    Toggle("纯本地打包离线模式 (Local Bundle)", isOn: $isOfflineMode)
                    if !isOfflineMode {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Cloudflare Pages 部署地址 / 自建域名")
                                .font(.footnote)
                                .foregroundColor(.secondary)
                            TextField("例如 https://xxx.pages.dev", text: $inputUrl)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .keyboardType(.URL)
                        }
                    }
                }

                Section(header: Text("内置腾讯/B站级原生播放器特性")) {
                    Label("沉浸式真·全屏旋转与防误触屏幕锁", systemImage: "arrow.up.left.and.arrow.down.right")
                    Label("长按屏幕任意位置触发 2.0X 极速播放", systemImage: "bolt.fill")
                    Label("左滑调亮度、右滑调音量、水平滑快进", systemImage: "hand.draw")
                    Label("全域广告智能免疫 (无开屏、无插播、无暂停广告)", systemImage: "shield.lefthalf.filled")
                    Label("AVFoundation 芯片级硬解 (4K HEVC / HDR)", systemImage: "sparkles.tv")
                    Label("下一集智能预热缓存 (对标源站秒开机制)", systemImage: "bolt.horizontal.fill")
                }

                Section {
                    Button("保存并刷新生效") {
                        if !isOfflineMode {
                            serverUrl = inputUrl.trimmingCharacters(in: .whitespacesAndNewlines)
                        }
                        onSave()
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                    .foregroundColor(.blue)
                }
            }
            .navigationTitle("Lya 客户端设置")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
