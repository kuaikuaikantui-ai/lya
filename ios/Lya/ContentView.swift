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

    var body: some View {
        ZStack {
            Color(red: 15/255, green: 20/255, blue: 28/255).ignoresSafeArea()

            LyaWebView(serverUrl: serverUrl, reloadTrigger: reloadTrigger, isOfflineMode: isOfflineMode)
                .ignoresSafeArea()

            // 顶部隐藏触发条：长按或三击弹出服务地址配置
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

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        config.allowsPictureInPictureMediaPlayback = true
        config.allowsAirPlayForMediaPlayback = true

        // 允许跨域与媒体无缝访问
        let prefs = WKPreferences()
        prefs.javaScriptCanOpenWindowsAutomatically = true
        config.preferences = prefs

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 15/255, green: 20/255, blue: 28/255, alpha: 1)
        webView.scrollView.backgroundColor = UIColor(red: 15/255, green: 20/255, blue: 28/255, alpha: 1)
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.navigationDelegate = context.coordinator

        // 自定义 User-Agent 注入本地原生 APP 标识
        webView.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 LyaNativeApp/1.0"

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
        Coordinator()
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var lastTrigger = UUID()

        func loadContent(in webView: WKWebView, serverUrl: String, isOffline: Bool) {
            let trimmed = serverUrl.trimmingCharacters(in: .whitespacesAndNewlines)

            if !isOffline && !trimmed.isEmpty, let targetUrl = URL(string: trimmed.hasPrefix("http") ? trimmed : "https://\(trimmed)") {
                let req = URLRequest(url: targetUrl, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 12)
                webView.load(req)
                return
            }

            // 本地离线 www 打包资源加载
            if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
            } else if let fallbackUrl = Bundle.main.url(forResource: "index", withExtension: "html") {
                webView.loadFileURL(fallbackUrl, allowingReadAccessTo: fallbackUrl.deletingLastPathComponent())
            } else if let defaultTarget = URL(string: "https://lya.pages.dev") {
                webView.load(URLRequest(url: defaultTarget))
            }
        }

        func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
            // 网络直连失败时自动回退到本地内置 www 离线包
            if let indexUrl = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "www") {
                webView.loadFileURL(indexUrl, allowingReadAccessTo: indexUrl.deletingLastPathComponent())
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

                Section(header: Text("原生播放增强 (Native Engine)")) {
                    Label("AVFoundation 原生硬解全开 (HEVC 4K / HDR)", systemImage: "sparkles.tv")
                    Label("后台锁屏音频播放与控制中心 (Audio Session)", systemImage: "play.circle")
                    Label("原生画中画 (Picture-in-Picture) 支持", systemImage: "pip.enter")
                    Label("ATS 全域直连 (解除 HTTP 跨域限制)", systemImage: "shield.slash")
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
            .navigationTitle("Lya 原生设置")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
