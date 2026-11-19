import SwiftUI
import WebKit
import AVFoundation
import MediaPlayer

struct ContentView: View {
    @AppStorage("lya_server_url") private var serverUrl: String = ""
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

            // 顶部隐藏触发齿轮：弹出服务地址配置
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

        // 注入原生交互 Bridge
        let userContent = WKUserContentController()
        userContent.add(context.coordinator, name: "lyaNativePlayer")
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

        // 自定义 UA 标识为真机原生客户端环境
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

    class Coordinator: NSObject, WKNavigationDelegate, WKScriptMessageHandler {
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

            // 本地内置离线 www 极速秒起
            if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
            } else if let fallbackUrl = Bundle.main.url(forResource: "index", withExtension: "html") {
                webView.loadFileURL(fallbackUrl, allowingReadAccessTo: fallbackUrl.deletingLastPathComponent())
            } else if let defaultTarget = URL(string: "https://lya.pages.dev") {
                webView.load(URLRequest(url: defaultTarget))
            }
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
            }
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            if message.name == "lyaNativePlayer", let dict = message.body as? [String: Any] {
                let action = dict["action"] as? String ?? ""
                if action == "play" {
                    let title = dict["title"] as? String ?? "视频播放"
                    let epTitle = dict["episodeTitle"] as? String ?? ""
                    let url = dict["url"] as? String ?? ""
                    let resumeSec = (dict["resumeSeconds"] as? NSNumber)?.doubleValue ?? 0
                    let curIdx = (dict["currentEpIdx"] as? NSNumber)?.intValue ?? 0
                    let lineName = dict["lineName"] as? String ?? "官方极速"

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

                    DispatchQueue.main.async {
                        self.parent.currentPlayItem = NativePlayItem(
                            title: title,
                            episodeTitle: epTitle,
                            url: url,
                            resumeSeconds: resumeSec,
                            episodes: eps,
                            currentEpIdx: curIdx,
                            lineName: lineName
                        )
                    }
                }
            }
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
                    Label("多倍速调节 (0.5X - 3.0X) 与原生选集抽屉", systemImage: "speedometer")
                    Label("AVFoundation 芯片级硬解 (4K HEVC / HDR)", systemImage: "sparkles.tv")
                    Label("原生画中画 (PiP) 与息屏后台声音常驻", systemImage: "pip.enter")
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
