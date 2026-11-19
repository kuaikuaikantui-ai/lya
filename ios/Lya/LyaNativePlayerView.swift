import SwiftUI
import AVFoundation
import AVKit
import MediaPlayer

// MARK: - 数据模型
struct NativePlayItem: Identifiable, Equatable {
    let id = UUID()
    var title: String
    var episodeTitle: String
    var url: String
    var resumeSeconds: Double
    var episodes: [NativeEpisodeItem]
    var currentEpIdx: Int
    var lineName: String
    var lines: [NativeLineOption] = []
    var currentLineIdx: Int = 0
}

struct NativeLineOption: Identifiable, Equatable {
    let id: Int
    let name: String
    let is4K: Bool
    let isOfficial: Bool
    let episodes: [NativeEpisodeItem]
}

struct NativeEpisodeItem: Identifiable, Equatable {
    let id: Int
    let title: String
    let url: String
}

// MARK: - 原生腾讯/B站风格超清播放器 (对标源站底层架构，零广告，更纯净)
struct LyaNativePlayerView: View {
    @Binding var playItem: NativePlayItem?
    var onTimeUpdate: ((Double, Int) -> Void)?
    var onSwitchEpisode: ((Int) -> Void)?
    var onSwitchLine: ((Int) -> Void)?
    var onClose: ((Double) -> Void)?

    @StateObject private var playerModel = PlayerModel()
    @State private var showControls = true
    @State private var isLocked = false
    @State private var isLongPressing = false
    @State private var previousRate: Float = 1.0
    @State private var showSpeedMenu = false
    @State private var showEpisodeSheet = false
    @State private var showLineSheet = false
    @State private var controlsTimer: Timer?

    // 手势状态
    @State private var panType: PanType = .none
    @State private var panBrightness: CGFloat = 0.5
    @State private var panVolume: Float = 0.5
    @State private var panSeekTime: Double = 0
    @State private var seekFrameTick: Int = 0
    @State private var isDraggingSlider = false
    @State private var sliderValue: Double = 0

    enum PanType { case none, brightness, volume, seek }

    var body: some View {
        ZStack {
            Color.black.ignoresSafeArea()

            // 1. 底层视频图层
            CustomVideoPlayerLayerView(player: playerModel.player)
                .ignoresSafeArea()

            // 2. 原生手势响应层 (完美支持长按 2.0X 极速播放、松手立即恢复、单双击与全手势)
            PlayerGestureOverlayView(
                isLocked: isLocked,
                onSingleTap: {
                    if isLocked {
                        withAnimation(.easeInOut(duration: 0.2)) { showControls.toggle() }
                    } else {
                        withAnimation(.easeInOut(duration: 0.2)) {
                            showControls.toggle()
                            if showControls { resetControlsTimer() }
                        }
                    }
                },
                onDoubleTap: {
                    playerModel.togglePlay()
                    triggerHaptic(.medium)
                    resetControlsTimer()
                },
                onLongPressBegan: {
                    guard playerModel.isPlaying else { return }
                    isLongPressing = true
                    previousRate = playerModel.playbackRate
                    playerModel.setRate(2.0)
                    triggerHaptic(.heavy)
                },
                onLongPressEnded: {
                    if isLongPressing {
                        isLongPressing = false
                        playerModel.setRate(previousRate)
                        triggerHaptic(.medium)
                    }
                },
                onPanChanged: { translation, location in
                    guard !isLongPressing else { return }
                    handlePanChanged(translation: translation, startLocation: location)
                },
                onPanEnded: {
                    handlePanEnded()
                }
            )
            .ignoresSafeArea()

            // 2. 长按 2.0X 极速播放 HUD 浮窗
            if isLongPressing {
                VStack {
                    HStack(spacing: 8) {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.cyan)
                        Text("2.0X 极速播放中...")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .background(Capsule().fill(Color.black.opacity(0.75)))
                    .overlay(Capsule().stroke(Color.cyan.opacity(0.8), lineWidth: 1.5))
                    .padding(.top, 40)
                    Spacer()
                }
                .transition(.opacity)
            }

            // 3. 手势调节 HUD 提示层
            if panType == .brightness {
                BrightnessVolumeHUD(icon: "sun.max.fill", value: panBrightness, label: "亮度")
            } else if panType == .volume {
                BrightnessVolumeHUD(icon: "speaker.wave.3.fill", value: CGFloat(panVolume), label: "音量")
            } else if panType == .seek {
                SeekHUD(seekTime: panSeekTime, duration: playerModel.duration, frameTick: seekFrameTick)
            }

            // 3.5 极速缓冲指示器
            if playerModel.isBuffering {
                VStack(spacing: 12) {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .cyan))
                        .scaleEffect(1.4)
                    Text("极速加载中...")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.white.opacity(0.85))
                }
                .padding(20)
                .background(RoundedRectangle(cornerRadius: 14).fill(Color.black.opacity(0.65)))
            }

            // 4. 屏幕左侧防误触锁屏按钮
            if showControls {
                HStack {
                    Button(action: {
                        isLocked.toggle()
                        triggerHaptic(.medium)
                        resetControlsTimer()
                    }) {
                        Image(systemName: isLocked ? "lock.fill" : "lock.open.fill")
                            .font(.system(size: 18))
                            .foregroundColor(isLocked ? .yellow : .white)
                            .padding(12)
                            .background(Circle().fill(Color.black.opacity(0.65)))
                            .overlay(Circle().stroke(Color.white.opacity(0.2), lineWidth: 1))
                    }
                    .padding(.leading, 24)
                    Spacer()
                }
            }

            // 5. 定制顶部与底部控制栏 (腾讯视频风格)
            if showControls && !isLocked {
                VStack {
                    topControlBar
                    Spacer()
                    bottomControlBar
                }
                .transition(.opacity)
            }
        }
        .onAppear {
            OrientationHelper.forceLandscape()
            if let item = playItem {
                playerModel.loadVideo(item: item)
                resetControlsTimer()
            }
            NotificationCenter.default.addObserver(
                forName: UIDevice.orientationDidChangeNotification,
                object: nil,
                queue: .main
            ) { _ in
                resetControlsTimer()
            }
        }
        .onDisappear {
            controlsTimer?.invalidate()
            controlsTimer = nil
            playerModel.cleanup()
            OrientationHelper.forcePortrait()
        }
        .sheet(isPresented: $showEpisodeSheet) {
            episodeSelectionSheet
        }
        .sheet(isPresented: $showLineSheet) {
            lineSelectionSheet
        }
    }

    // MARK: - 顶部控制栏
    private var topControlBar: some View {
        HStack(spacing: 14) {
            Button(action: {
                OrientationHelper.forcePortrait()
                onClose?(playerModel.currentTime)
                playItem = nil
            }) {
                Image(systemName: "chevron.left")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(8)
            }

            VStack(alignment: .leading, spacing: 2) {
                Text(playItem?.title ?? "")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                HStack(spacing: 6) {
                    Text(playItem?.episodeTitle ?? "")
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                    Text(playItem?.lineName ?? "")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.cyan)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Capsule().fill(Color.cyan.opacity(0.18)))
                }
            }

            Spacer()

            // 系统原生画中画与投屏按钮
            CustomAirPlayButton()
                .frame(width: 32, height: 32)

            Button(action: {
                playerModel.togglePiP()
            }) {
                Image(systemName: "pip.enter")
                    .font(.system(size: 18))
                    .foregroundColor(.white)
                    .padding(6)
            }
        }
        .padding(.horizontal, 40)
        .padding(.top, 16)
        .padding(.bottom, 14)
        .background(
            LinearGradient(colors: [Color.black.opacity(0.85), Color.clear], startPoint: .top, endPoint: .bottom)
        )
    }

    // MARK: - 底部控制栏
    private var bottomControlBar: some View {
        VStack(spacing: 8) {
            // 进度滑块
            HStack(spacing: 12) {
                Text(formatTime(isDraggingSlider ? sliderValue : playerModel.currentTime))
                    .font(.system(size: 12, weight: .medium).monospacedDigit())
                    .foregroundColor(.white)

                CustomProgressSlider(
                    value: isDraggingSlider ? $sliderValue : .constant(playerModel.currentTime),
                    duration: playerModel.duration,
                    onEditingChanged: { editing in
                        isDraggingSlider = editing
                        if editing {
                            sliderValue = playerModel.currentTime
                            controlsTimer?.invalidate()
                        } else {
                            playerModel.seek(to: sliderValue)
                            resetControlsTimer()
                        }
                    }
                )

                Text(formatTime(playerModel.duration))
                    .font(.system(size: 12, weight: .medium).monospacedDigit())
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 40)

            // 控制按钮排布
            HStack(spacing: 22) {
                // 播放 / 暂停
                Button(action: {
                    playerModel.togglePlay()
                    triggerHaptic(.light)
                    resetControlsTimer()
                }) {
                    Image(systemName: playerModel.isPlaying ? "pause.fill" : "play.fill")
                        .font(.system(size: 22))
                        .foregroundColor(.white)
                }

                // 下一集
                if let item = playItem, item.currentEpIdx + 1 < item.episodes.count {
                    Button(action: {
                        switchToEpisode(index: item.currentEpIdx + 1)
                    }) {
                        Image(systemName: "forward.end.fill")
                            .font(.system(size: 18))
                            .foregroundColor(.white)
                    }
                }

                Spacer()

                // 倍速按钮
                Menu {
                    ForEach([0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 3.0], id: \.self) { rate in
                        Button("\(String(format: "%.2g", rate))X") {
                            playerModel.setRate(Float(rate))
                            resetControlsTimer()
                        }
                    }
                } label: {
                    Text("\(String(format: "%.2g", playerModel.playbackRate))X")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Capsule().fill(Color.white.opacity(0.18)))
                }

                // 线路选择抽屉 (无缝热切换)
                if let item = playItem, item.lines.count > 1 {
                    Button(action: {
                        showLineSheet = true
                        controlsTimer?.invalidate()
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "point.3.filled.connected.trianglepath.dotted")
                                .font(.system(size: 11))
                            Text(item.lines.indices.contains(item.currentLineIdx) ? item.lines[item.currentLineIdx].name : "换源")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Capsule().fill(Color.white.opacity(0.18)))
                    }
                }

                // 选集抽屉
                if let item = playItem, item.episodes.count > 1 {
                    Button(action: {
                        showEpisodeSheet = true
                        controlsTimer?.invalidate()
                    }) {
                        Text("选集")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Capsule().fill(Color.white.opacity(0.18)))
                    }
                }

                // 全屏横竖屏旋转
                Button(action: {
                    toggleOrientation()
                    resetControlsTimer()
                }) {
                    Image(systemName: "arrow.up.left.and.arrow.down.right")
                        .font(.system(size: 16))
                        .foregroundColor(.white)
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 24)
        }
        .background(
            LinearGradient(colors: [Color.clear, Color.black.opacity(0.9)], startPoint: .top, endPoint: .bottom)
        )
    }

    // MARK: - 选集抽屉面板
    private var episodeSelectionSheet: some View {
        NavigationView {
            ScrollView {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 70))], spacing: 12) {
                    if let item = playItem {
                        ForEach(item.episodes) { ep in
                            Button(action: {
                                switchToEpisode(index: ep.id)
                                showEpisodeSheet = false
                            }) {
                                Text(ep.title)
                                    .font(.system(size: 14, weight: ep.id == item.currentEpIdx ? .bold : .regular))
                                    .frame(maxWidth: .infinity, minHeight: 44)
                                    .foregroundColor(ep.id == item.currentEpIdx ? .black : .white)
                                    .background(ep.id == item.currentEpIdx ? Color.cyan : Color.white.opacity(0.12))
                                    .cornerRadius(8)
                            }
                        }
                    }
                }
                .padding()
            }
            .background(Color(red: 20/255, green: 24/255, blue: 33/255).ignoresSafeArea())
            .navigationTitle("剧集选择")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("关闭") { showEpisodeSheet = false; resetControlsTimer() }
                }
            }
        }
    }

    // MARK: - 线路选择抽屉面板 (无缝热切换)
    private var lineSelectionSheet: some View {
        NavigationView {
            List {
                if let item = playItem {
                    Section(header: Text("可用播放源 (点击秒切，无需退出全屏)").font(.system(size: 12)).foregroundColor(.gray)) {
                        ForEach(item.lines) { line in
                            Button(action: {
                                switchToLine(index: line.id)
                                showLineSheet = false
                            }) {
                                HStack(spacing: 12) {
                                    VStack(alignment: .leading, spacing: 4) {
                                        HStack(spacing: 6) {
                                            Text(line.name)
                                                .font(.system(size: 15, weight: .bold))
                                                .foregroundColor(.white)

                                            if line.is4K {
                                                Text("4K 专享")
                                                    .font(.system(size: 10, weight: .bold))
                                                    .foregroundColor(.yellow)
                                                    .padding(.horizontal, 6)
                                                    .padding(.vertical, 2)
                                                    .background(Capsule().fill(Color.yellow.opacity(0.2)))
                                            } else if line.isOfficial {
                                                Text("官方极速")
                                                    .font(.system(size: 10, weight: .bold))
                                                    .foregroundColor(.cyan)
                                                    .padding(.horizontal, 6)
                                                    .padding(.vertical, 2)
                                                    .background(Capsule().fill(Color.cyan.opacity(0.2)))
                                            }
                                        }

                                        Text(line.episodes.indices.contains(item.currentEpIdx) ? "同步至：\(line.episodes[item.currentEpIdx].title)" : "共 \(line.episodes.count) 集")
                                            .font(.system(size: 12))
                                            .foregroundColor(.gray)
                                    }

                                    Spacer()

                                    if line.id == item.currentLineIdx {
                                        Image(systemName: "checkmark.circle.fill")
                                            .foregroundColor(.cyan)
                                            .font(.system(size: 18))
                                    }
                                }
                                .padding(.vertical, 4)
                            }
                            .listRowBackground(line.id == item.currentLineIdx ? Color.white.opacity(0.08) : Color.clear)
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .background(Color(red: 20/255, green: 24/255, blue: 33/255).ignoresSafeArea())
            .navigationTitle("切换播放线路")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("关闭") { showLineSheet = false; resetControlsTimer() }
                }
            }
        }
    }

    // MARK: - 手势处理逻辑
    private func handlePanChanged(translation: CGPoint, startLocation: CGPoint) {
        let screenWidth = UIScreen.main.bounds.width

        if panType == .none {
            if abs(translation.x) > abs(translation.y) && abs(translation.x) > 12 {
                panType = .seek
                panSeekTime = playerModel.currentTime
            } else if abs(translation.y) > 12 {
                if startLocation.x < screenWidth * 0.45 {
                    panType = .brightness
                    panBrightness = UIScreen.main.brightness
                } else {
                    panType = .volume
                    panVolume = playerModel.getSystemVolume()
                }
            }
        }

        switch panType {
        case .brightness:
            let delta = -translation.y / 280.0
            let target = max(0, min(1, panBrightness + delta))
            UIScreen.main.brightness = target
        case .volume:
            let delta = Float(-translation.y / 280.0)
            let target = max(0, min(1, panVolume + delta))
            playerModel.setSystemVolume(target)
        case .seek:
            let delta = Double(translation.x) * (playerModel.duration > 3600 ? 1.5 : 0.6)
            panSeekTime = max(0, min(playerModel.duration, playerModel.currentTime + delta))
            seekFrameTick = (seekFrameTick + 1) % 28
        case .none:
            break
        }
    }

    private func handlePanEnded() {
        if panType == .seek {
            playerModel.seek(to: panSeekTime)
        }
        panType = .none
        resetControlsTimer()
    }

    private func switchToEpisode(index: Int) {
        guard var item = playItem, index < item.episodes.count else { return }
        item.currentEpIdx = index
        item.episodeTitle = item.episodes[index].title
        item.url = item.episodes[index].url
        item.resumeSeconds = 0
        playItem = item
        playerModel.loadVideo(item: item)
        onSwitchEpisode?(index)
        resetControlsTimer()
    }

    private func switchToLine(index: Int) {
        guard var item = playItem, index < item.lines.count else { return }
        let targetLine = item.lines[index]
        guard item.currentEpIdx < targetLine.episodes.count else { return }
        let targetEp = targetLine.episodes[item.currentEpIdx]
        guard !targetEp.url.isEmpty else { return }

        item.currentLineIdx = index
        item.lineName = targetLine.name
        item.url = targetEp.url
        item.episodes = targetLine.episodes
        playItem = item

        // 无缝热切换：保持当前播放秒数和播放倍速，完全不退出全屏、不黑屏重新初始化！
        playerModel.switchSource(newUrl: targetEp.url)
        onSwitchLine?(index)
        resetControlsTimer()
    }

    private func toggleOrientation() {
        OrientationHelper.toggleLandscape()
        resetControlsTimer()
    }

    private func resetControlsTimer() {
        controlsTimer?.invalidate()
        controlsTimer = Timer.scheduledTimer(withTimeInterval: 4.5, repeats: false) { _ in
            if playerModel.isPlaying && !isLocked {
                withAnimation(.easeInOut(duration: 0.25)) { showControls = false }
            }
        }
    }

    private func triggerHaptic(_ style: UIImpactFeedbackGenerator.FeedbackStyle) {
        let generator = UIImpactFeedbackGenerator(style: style)
        generator.prepare()
        generator.impactOccurred()
    }

    private func formatTime(_ seconds: Double) -> String {
        let s = max(0, Int(seconds))
        let m = s / 60
        let h = m / 60
        if h > 0 {
            return String(format: "%02d:%02d:%02d", h, m % 60, s % 60)
        }
        return String(format: "%02d:%02d", m % 60, s % 60)
    }
}

// MARK: - 播放器底层状态机与 AVPlayer 控制
class PlayerModel: NSObject, ObservableObject, AVPictureInPictureControllerDelegate {
    @Published var isPlaying = false
    @Published var currentTime: Double = 0
    @Published var duration: Double = 0
    @Published var playbackRate: Float = 1.0
    @Published var isBuffering: Bool = true

    let player = AVPlayer()
    private var timeObserver: Any?
    private var pipController: AVPictureInPictureController?
    private var volumeView = MPVolumeView(frame: .zero)

    override init() {
        super.init()
        setupAudioSession()
        setupTimeObserver()
    }

    func loadVideo(item: NativePlayItem) {
        guard let url = URL(string: item.url) else { return }
        isBuffering = true
        let asset = AVURLAsset(url: url)
        let playerItem = AVPlayerItem(asset: asset)
        // 极速起播优化（借鉴源站秒开机制）
        playerItem.preferredForwardBufferDuration = 15.0
        player.automaticallyWaitsToMinimizeStalling = true

        player.replaceCurrentItem(with: playerItem)

        if item.resumeSeconds > 3 {
            player.seek(to: CMTime(seconds: item.resumeSeconds, preferredTimescale: 600))
        }

        player.play()
        isPlaying = true
        playbackRate = 1.0

        // 下一集智能预热 (对标源站 NativePlaybackNextEpisodePrewarmer 机制)
        if item.currentEpIdx + 1 < item.episodes.count {
            let nextEpUrl = item.episodes[item.currentEpIdx + 1].url
            prewarmNextEpisode(urlStr: nextEpUrl)
        }

        // 监听播完
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: playerItem,
            queue: .main
        ) { [weak self] _ in
            self?.isPlaying = false
        }
    }

    /// 无缝热切换播放源 (保持当前进度、播放倍速，不黑屏不重置播放器)
    func switchSource(newUrl: String) {
        guard let url = URL(string: newUrl) else { return }
        isBuffering = true
        let asset = AVURLAsset(url: url)
        let newItem = AVPlayerItem(asset: asset)
        newItem.preferredForwardBufferDuration = 15.0

        let curTime = currentTime
        let rate = playbackRate
        let wasPlaying = isPlaying

        player.replaceCurrentItem(with: newItem)
        if curTime > 0 {
            player.seek(to: CMTime(seconds: curTime, preferredTimescale: 600), toleranceBefore: .zero, toleranceAfter: .zero)
        }

        if wasPlaying {
            player.play()
            player.rate = rate
            isPlaying = true
        }

        // 监听新视频流播完
        NotificationCenter.default.addObserver(
            forName: .AVPlayerItemDidPlayToEndTime,
            object: newItem,
            queue: .main
        ) { [weak self] _ in
            self?.isPlaying = false
        }
    }

    func togglePlay() {
        if isPlaying {
            player.pause()
            isPlaying = false
        } else {
            player.play()
            player.rate = playbackRate
            isPlaying = true
        }
    }

    func setRate(_ rate: Float) {
        playbackRate = rate
        if isPlaying {
            player.rate = rate
        }
    }

    func seek(to seconds: Double) {
        let time = CMTime(seconds: seconds, preferredTimescale: 600)
        player.seek(to: time, toleranceBefore: .zero, toleranceAfter: .zero)
    }

    func togglePiP() {
        if pipController == nil {
            if let layer = (UIApplication.shared.windows.first?.rootViewController?.view.layer.sublayers?.first { $0 is AVPlayerLayer }) as? AVPlayerLayer {
                pipController = AVPictureInPictureController(playerLayer: layer)
                pipController?.delegate = self
            }
        }
        if let pip = pipController {
            if pip.isPictureInPictureActive {
                pip.stopPictureInPicture()
            } else {
                pip.startPictureInPicture()
            }
        }
    }

    func getSystemVolume() -> Float {
        AVAudioSession.sharedInstance().outputVolume
    }

    func setSystemVolume(_ val: Float) {
        if let slider = volumeView.subviews.first(where: { $0 is UISlider }) as? UISlider {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.01) {
                slider.value = val
            }
        }
    }

    private func prewarmNextEpisode(urlStr: String) {
        guard let url = URL(string: urlStr) else { return }
        var req = URLRequest(url: url)
        req.setValue("bytes=0-1048576", forHTTPHeaderField: "Range") // 预取首兆数据进系统缓存
        let session = URLSession(configuration: .default)
        session.dataTask(with: req).resume()
    }

    private func setupTimeObserver() {
        timeObserver = player.addPeriodicTimeObserver(
            forInterval: CMTime(seconds: 0.5, preferredTimescale: 600),
            queue: .main
        ) { [weak self] time in
            guard let self = self else { return }
            self.currentTime = time.seconds
            if self.player.timeControlStatus == .playing {
                self.isBuffering = false
            }
            if let item = self.player.currentItem {
                let d = item.duration.seconds
                if !d.isNaN && d > 0 { self.duration = d }
                if item.isPlaybackLikelyToKeepUp {
                    self.isBuffering = false
                } else if item.isPlaybackBufferEmpty {
                    self.isBuffering = true
                }
            }
        }
    }

    private func setupAudioSession() {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .moviePlayback, options: [.mixWithOthers, .allowAirPlay])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {}
    }

    func cleanup() {
        player.pause()
        if let observer = timeObserver {
            player.removeTimeObserver(observer)
            timeObserver = nil
        }
        player.replaceCurrentItem(with: nil)
    }
}

// MARK: - 原生 AVPlayerLayer 渲染视图
struct CustomVideoPlayerLayerView: UIViewRepresentable {
    let player: AVPlayer

    func makeUIView(context: Context) -> PlayerView {
        let view = PlayerView()
        view.player = player
        return view
    }

    func updateUIView(_ uiView: PlayerView, context: Context) {
        uiView.player = player
    }

    class PlayerView: UIView {
        var player: AVPlayer? {
            get { playerLayer.player }
            set { playerLayer.player = newValue }
        }

        var playerLayer: AVPlayerLayer {
            layer as! AVPlayerLayer
        }

        override static var layerClass: AnyClass {
            AVPlayerLayer.self
        }

        override init(frame: CGRect) {
            super.init(frame: frame)
            playerLayer.videoGravity = .resizeAspect
            backgroundColor = .black
        }

        required init?(coder: NSCoder) {
            fatalError("init(coder:) has not been implemented")
        }
    }
}

// MARK: - 屏幕旋转与方向锁定管理器 (保障退出播放器时 100% 恢复竖屏)
struct OrientationHelper {
    static func allowRotation() {
        AppDelegate.orientationLock = .allButUpsideDown
    }

    static func forceLandscape() {
        AppDelegate.orientationLock = .allButUpsideDown
        if #available(iOS 16.0, *) {
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                windowScene.requestGeometryUpdate(.iOS(interfaceOrientations: .landscapeRight)) { _ in }
            }
        } else {
            UIDevice.current.setValue(UIInterfaceOrientation.landscapeRight.rawValue, forKey: "orientation")
        }
        UIViewController.attemptRotationToDeviceOrientation()
    }

    static func forcePortrait() {
        AppDelegate.orientationLock = .portrait
        if #available(iOS 16.0, *) {
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                windowScene.requestGeometryUpdate(.iOS(interfaceOrientations: .portrait)) { _ in }
            }
        } else {
            UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
        }
        UIViewController.attemptRotationToDeviceOrientation()
    }

    static func toggleLandscape() {
        if #available(iOS 16.0, *) {
            guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene else { return }
            let isLandscape = windowScene.interfaceOrientation.isLandscape
            let target: UIInterfaceOrientationMask = isLandscape ? .portrait : .landscapeRight
            windowScene.requestGeometryUpdate(.iOS(interfaceOrientations: target)) { _ in }
        } else {
            let isLandscape = UIDevice.current.orientation.isLandscape
            let target = isLandscape ? UIInterfaceOrientation.portrait.rawValue : UIInterfaceOrientation.landscapeRight.rawValue
            UIDevice.current.setValue(target, forKey: "orientation")
        }
        UIViewController.attemptRotationToDeviceOrientation()
    }
}

// MARK: - 原生手势响应覆盖层 (高灵敏长按 2.0X 极速播放、松手立即恢复、单双击与全手势)
struct PlayerGestureOverlayView: UIViewRepresentable {
    var isLocked: Bool
    var onSingleTap: () -> Void
    var onDoubleTap: () -> Void
    var onLongPressBegan: () -> Void
    var onLongPressEnded: () -> Void
    var onPanChanged: (CGPoint, CGPoint) -> Void
    var onPanEnded: () -> Void

    func makeUIView(context: Context) -> UIView {
        let view = UIView()
        view.backgroundColor = .clear

        let doubleTap = UITapGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handleDoubleTap))
        doubleTap.numberOfTapsRequired = 2

        let singleTap = UITapGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handleSingleTap))
        singleTap.numberOfTapsRequired = 1
        singleTap.require(toFail: doubleTap)

        let longPress = UILongPressGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handleLongPress(_:)))
        longPress.minimumPressDuration = 0.28
        longPress.allowableMovement = 35
        longPress.delegate = context.coordinator

        let pan = UIPanGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handlePan(_:)))
        pan.maximumNumberOfTouches = 1
        pan.delegate = context.coordinator

        context.coordinator.singleTap = singleTap
        context.coordinator.doubleTap = doubleTap
        context.coordinator.longPress = longPress
        context.coordinator.pan = pan

        view.addGestureRecognizer(doubleTap)
        view.addGestureRecognizer(singleTap)
        view.addGestureRecognizer(longPress)
        view.addGestureRecognizer(pan)

        return view
    }

    func updateUIView(_ uiView: UIView, context: Context) {
        context.coordinator.parent = self
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UIGestureRecognizerDelegate {
        var parent: PlayerGestureOverlayView
        weak var singleTap: UITapGestureRecognizer?
        weak var doubleTap: UITapGestureRecognizer?
        weak var longPress: UILongPressGestureRecognizer?
        weak var pan: UIPanGestureRecognizer?

        init(_ parent: PlayerGestureOverlayView) {
            self.parent = parent
        }

        @objc func handleSingleTap() {
            parent.onSingleTap()
        }

        @objc func handleDoubleTap() {
            if !parent.isLocked {
                parent.onDoubleTap()
            }
        }

        @objc func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
            if parent.isLocked { return }
            switch gesture.state {
            case .began:
                parent.onLongPressBegan()
            case .ended, .cancelled, .failed:
                parent.onLongPressEnded()
            default:
                break
            }
        }

        @objc func handlePan(_ gesture: UIPanGestureRecognizer) {
            if parent.isLocked { return }
            guard let view = gesture.view else { return }
            let translation = gesture.translation(in: view)
            let location = gesture.location(in: view)

            switch gesture.state {
            case .changed:
                parent.onPanChanged(translation, location)
            case .ended, .cancelled, .failed:
                parent.onPanEnded()
            default:
                break
            }
        }

        func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
            return true
        }
    }
}

// MARK: - 自定义进度滑块
struct CustomProgressSlider: View {
    @Binding var value: Double
    let duration: Double
    let onEditingChanged: (Bool) -> Void

    var body: some View {
        GeometryReader { geo in
            let total = max(1, duration)
            let progress = max(0, min(1, value / total))
            let width = geo.size.width

            ZStack(alignment: .leading) {
                // 底槽
                Capsule()
                    .fill(Color.white.opacity(0.25))
                    .frame(height: 3.5)

                // 进度条
                Capsule()
                    .fill(Color.cyan)
                    .frame(width: max(0, width * progress), height: 3.5)

                // 拖拽手柄
                Circle()
                    .fill(Color.white)
                    .frame(width: 14, height: 14)
                    .shadow(radius: 2)
                    .offset(x: max(0, min(width - 14, width * progress - 7)))
            }
            .frame(height: geo.size.height)
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { g in
                        onEditingChanged(true)
                        let newProgress = max(0, min(1, g.location.x / width))
                        value = newProgress * total
                    }
                    .onEnded { _ in
                        onEditingChanged(false)
                    }
            )
        }
        .frame(height: 24)
    }
}

// MARK: - HUD 提示视图
struct BrightnessVolumeHUD: View {
    let icon: String
    let value: CGFloat
    let label: String

    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 26))
                .foregroundColor(.white)
            ZStack(alignment: .bottom) {
                Capsule()
                    .fill(Color.white.opacity(0.2))
                    .frame(width: 6, height: 80)
                Capsule()
                    .fill(Color.white)
                    .frame(width: 6, height: 80 * max(0, min(1, value)))
            }
            Text("\(Int(value * 100))%")
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.white)
        }
        .padding(16)
        .background(RoundedRectangle(cornerRadius: 14).fill(Color.black.opacity(0.75)))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.white.opacity(0.15), lineWidth: 1))
    }
}

struct SeekHUD: View {
    let seekTime: Double
    let duration: Double
    let frameTick: Int

    var body: some View {
        VStack(spacing: 6) {
            // 源站同款平滑动画帧或火箭快进图标
            if let frameImg = loadFrameImage(index: frameTick) {
                Image(uiImage: frameImg)
                    .resizable()
                    .frame(width: 44, height: 44)
            } else {
                Image(systemName: "goforward")
                    .font(.system(size: 28))
                    .foregroundColor(.cyan)
            }
            Text(formatTime(seekTime))
                .font(.system(size: 20, weight: .bold).monospacedDigit())
                .foregroundColor(.white)
            Text("/ \(formatTime(duration))")
                .font(.system(size: 13))
                .foregroundColor(.gray)
        }
        .padding(20)
        .background(RoundedRectangle(cornerRadius: 16).fill(Color.black.opacity(0.8)))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color.cyan.opacity(0.4), lineWidth: 1))
    }

    private func loadFrameImage(index: Int) -> UIImage? {
        let name = String(format: "icon_fast_%05d", index % 28)
        if let path = Bundle.main.path(forResource: name, ofType: "png", inDirectory: "SeekFrames") {
            return UIImage(contentsOfFile: path)
        }
        return UIImage(named: name)
    }

    private func formatTime(_ seconds: Double) -> String {
        let s = max(0, Int(seconds))
        let m = s / 60
        let h = m / 60
        if h > 0 { return String(format: "%02d:%02d:%02d", h, m % 60, s % 60) }
        return String(format: "%02d:%02d", m % 60, s % 60)
    }
}

// MARK: - AirPlay 按钮
struct CustomAirPlayButton: UIViewRepresentable {
    func makeUIView(context: Context) -> AVRoutePickerView {
        let picker = AVRoutePickerView()
        picker.tintColor = .white
        picker.activeTintColor = .cyan
        return picker
    }
    func updateUIView(_ uiView: AVRoutePickerView, context: Context) {}
}
