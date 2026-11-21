# Lya 项目完整交接文档（供 AI 检查与继续开发）

> **文档目的**：完整交接 2026-11-20 晚 ~ 2026-11-21 全部改动的技术细节、已知问题、未完成事项与验证方法。
> **交接对象**：后续接手开发/审查的 AI 助手。
> **代码位置**：`C:\Users\ROG\Desktop\lya`（Git 仓库，分支 main，最后提交 `a84a7b3`，工作树干净）。
> **基础提交**：所有优化始于基线提交 `343319b`（交接前的最后稳定版）。

---

## 一、项目架构速览

| 层 | 位置 | 说明 |
|---|---|---|
| Web 前端 | `index.html`（~12000 行内联）+ `video.js` + `novel.js` + `manga.js` + `feed.js` + `kanju.js` | 纯 vanilla JS SPA，无构建 |
| 后端 | `functions/api/[[path]].js`（Cloudflare Pages Function，~4300 行） | catch-all 路由，聚合搜索/播放解析/吃瓜代理/云同步 |
| iOS 壳 | `ios/Lya/`（ContentView.swift ~400 行 + LyaApp.swift） | WKWebView 壳，UA 标识 `LyaNativeApp`，XcodeGen 构建 |
| CI | `.github/workflows/build-ipa.yml` | push main 自动：Cloudflare Pages 部署（~30s）+ GitHub Actions IPA 构建（~70-90s）|
| 发布 | GitHub Release `v1.0.0-ipa` | 下载地址恒定：`https://lya-arr.pages.dev/api/ipa`（CF 边缘缓存 24h 镜像）+ GitHub 直链 |

**关键机制**：推 main 自动部署网页 + 构建 IPA。workflow paths 过滤器：`ios/**`、`index.html`、`video.js`、`novel.js`、`manga.js`、`feed.js`、`kanju.js`、workflow 本身。空提交不触发。

---

## 二、改动全景（按模块）

### 2.1 视频播放器（video.js）

**长按 2X 倍速（用户痛点，三轮迭代至 v3）**：
- 位置：`video.js` 中 `injectBottomRightPlayerControls` 内的「3. 移动端/触屏长按 2.0X」块（搜索 `engageSpeedBoost`）
- 最终实现：touchstart 第一帧只做 HUD 淡入（纯 opacity/transform 合成器动画，零布局）→ 260ms 后只切 `playbackRate = 2.0`（该帧零 DOM 操作）；engage 时 `preservesPitch = false`（跳过 WebKit 音频重采样器重配，是 WKWebView 倍速卡顿的最大开销项），松手恢复 true；HUD 文案极简「2X」（用户点名要求）；屏幕左右 24px 内不启动（iOS 系统边缘手势冲突）；松手 rate 恢复与 HUD 淡出分帧（100ms）；短按（<260ms 松手）HUD 立即收回不残留；松手后 400ms 内捕获阶段屏蔽合成 click（**只拦截 `.dplayer-video, .dplayer-mask, .dplayer-bezel, .dplayer-danmaku`**，控制条不拦）
- 松手锁定模式：设置面板开关 `lya_longpress_lock`（`window.isLockBoostEnabled`），锁定态点画面恢复
- 长按期间 `window._lyaSpeedBoostActive = true` → `triggerAutoSwitchRoute` 直接 return（抑制自动换线看门狗打断手势）
- 播放器重建（`switchPlayGroup`）时 `window._lyaSpeedBoostActive = false` + `_lyaLockedBoost = false` 重置
- **已知残余**：WKWebView 原生 HLS 的 playbackRate 切换仍有 WebKit 管线级开销，web 层已是极限；彻底零卡顿需纯原生播放器（backlog）

**线路系统重构**：
- 横条改为 3 元素：`⚡智能选源 | 当前线路胶囊 | 全部线路(N)`，全部线路进底部抽屉（`window.openLineDrawer` / `closeLineDrawer` / `renderLineDrawerContent`，搜索 `lyaLineDrawer`）
- 抽屉分组：推荐优选 / 原站官方源 / 采集聚合源；每条带 `formatFriendlyLineName` 友好名 + 当前/失败标记 + `.lya-probe` 测速结果槽位
- **一键测速**：`window.probeAllLines()`（5 路并发，m3u8 主清单 fetch，resolve:// 凭证走后端探测，3.5s 超时）
- epoch 令牌：`window._channelEpoch` 防旧筛选条件的在途响应污染（切频道/分类时 ++）
- 注册表：`window._channelItemRegistry`（频道卡片对象，`setVideoChannel` 时清空）
- **清晰度面板**：`window.renderQualityPanel(hls)` / `markQualityActive` / `setQualityLevel`（hls.levels 热切零重载；levels < 2 时不渲染；iOS 原生 HLS 无 levels 自动隐藏；每集开始时清理旧面板）
- **搜索/频道互斥**：`doVideoSearch` 退出频道模式（`_videoChannelMode = false` + 隐藏 browse）；`setVideoChannel` 隐藏搜索结果块；`clearVideoSearch` 尊重频道模式

**官方线路接入（kanju 官方 CDN，见 §三 深度机制）**：
- `video.js` openVideoDetail 内：kanju 卡（`kanju_id` 或 `vod_id` 前缀 `av_`）打开时懒加载 `kanju.js` → `window.KanjuClient.enrichVideoGroups(window.currentVideo)`
- `KanjuClient.enrichVideoGroups`：catalog(kanjuId) → resolve(ep0.token) → line_options 里 `resolve://` 凭证线路追加为组（命名 `原站官方·{display_label}`，`_lyaKanjuTokens`/`_lyaKanjuOptions`/`_lyaKanjuLabel` 挂组上），**官方组移到 groups 最前**
- 追加后自动切换：当前第三方线路 `currentTime < 3`（黑屏中）时 `switchPlayGroup` 到官方首组（kanju.js 尾部逻辑）
- `playVideoEpisode` 内：当前组带 `_lyaKanjuTokens` 时走 `KanjuClient.ensureEpisodeUrl(group, idx)`（按集 token 换直连并缓存到 ep.url）；失败/`resolve://pending` → `triggerAutoSwitchRoute`；真实 `resolve://` ticket → 后端 `/api/video/resolve-line`（401 时后端自动重登重试一次，见 §2.4）
- 换集清理：`playVideoEpisode` 开头过滤 `g._lyaResolvedEp`（后端 resolve-line 多线路透传的临时组，仅单集有效）

**后台静默测速优选**：
- `playVideoEpisode` 内 `autoProbeAndSwitch(idx, videoUrl)`（800ms 后异步）：当前 m3u8 线路 5.5s 探测（主清单 + 首分片 read），受阻则前 6 条备选竞速，自动 `switchPlayGroup` 到最快
- 起播看门狗 10s → **6s**

**记录/其他**：
- `saveVideoHistory`：隐私开关 `window.isVideoHistoryEnabled`（`lya_video_history_enabled`）+ 200 条 LRU（**不要改回 1000**：localStorage 含 vod_play_url 大字段会爆仓）
- 记忆倍速：持久化挂在**倍速菜单点击**（`speedItems` click 里写 `lya_playback_rate`）——**不要挂 ratechange**：播放器销毁时 WebKit 重置速率会触发 ratechange 把 '1' 误写；恢复在 playVideoEpisode 的 DPlayer 创建后
- `toggleLockBoost` / `toggleVideoHistory` / `toggleAutoNext` 同款模式
- `formatPlaySecondsLabel`：≥1h 显示 h:mm:ss
- `window.toggleLyaFullscreen(action)`：全屏统一调度（'exit'/'enter'/自动），避坑红线四要求

### 2.2 Web 主页面（index.html）

**五栏导航**（本轮重构）：
- 桌面 `mainTabNav`：navHomeBtn/navVideoBtn/navBookBtn/navHistoryBtn/navChiguaBtn(隐藏)；移动 `mobileBottomNav`：mNavHome/mNavVideo/mNavBook/mNavHistory/mNavChigua(隐藏)
- **旧 ID（navNovelBtn/navMangaBtn/mNavNovel/mNavManga）已全部移除**，switchNav 映射 `'novel'/'manga'` → `'book'` + `_bookSegment`
- `window.previousView` 在 switchNav 维护（video.js closeVideoPlayer 回退依赖）
- 书城壳 `bookShell` 包裹 novelSection + mangaSection + 分段胶囊（`setBookSegment`/`updateBookSegmentGlider`）
- **结构红线**：`bookShell`/`chiguaSection`/`homeSection` 必须在 `switchNav` 的 sections 数组、`showView` 的隐藏列表、`openVideoDetail` 的隐藏列表**三处同步**——漏一处就会出现"视图叠加/返回错乱"（本轮踩过的坑）

**聚合首页**（homeSection，默认落地 Tab）：
- `renderAggregateHome()` = renderHomeContinueHero（getVideoHistory()[0] 大卡，onclick `resumeWatchVideo(0, ep_idx)`）+ renderHomeContinueRead（getRecentHistory 横滑）+ renderHomeRecommend（猜你喜欢 `fetchHomeGuessRow`（观看历史 type_name → `/api/video/channel`，三级回退）+ KANJU 种子 + 小说/漫画种子行）
- 卡片点击：`openHomeVideoCard(payload)`（**必须传原始 CMS/kanju 对象并规范化 vod_name/vod_pic**——曾因传映射形状缺 vod_name 被拒）/ `openHomeBookCard(payload)` → `loadBookDetail(JSON.stringify(b))`

**吃瓜区（当前状态）**：
- **抖音模式已全部移除**（弹窗/常驻按钮/详情按钮/openChiguaModeSheet/enterChiguaFeedCurrentCategory/LyaEnterChiguaFeedFromDetail/chiguaFeedModeBtn 全删；feed.js 文件保留——LyaGallery 在用）
- **合集视频标记**：`parseGenericHtmlArticles` 内标题启发式 `hasVideo`（`/视频|流出/i`）→ items 加 `has_video`；详情解析出 videoConfigs 后回写 `localStorage.chigua_video_index`（article_url → 段数）；卡片渲染读 `item.has_video || getChiguaVideoIndex()[item.article_url]` 显示 `.kanju-video-badge` 角标
- **结构红线（血泪教训）**：吃瓜区 markup 曾因批量删除丢失 `chiguaGrid`/`chiguaFeedTitle`/`chiguaCountBadge`/`chiguaLoadMoreWrap` 和 hero-box 闭合 `</div>`（后者导致 chiguaDetailView 被卷进 chiguaListView 内部——列表隐藏时详情一起隐藏=整页塌陷）。**已全部修复**。检查手段：区间 div 开闭计数（见 §五）
- `searchOriginKanju`/`resolve-line` 后端已接 kanju session（见 §2.4），吃瓜搜索的视频卡（无 article_url）走 `window.openVideoPlayer(encodedItem)`（已定义，转 openVideoDetail）

**登录/设置（我的页）**：
- 原站账号卡片 `myKanjuAccountCard` + 表单 `kanjuLoginFormWrap`（`toggleKanjuLoginForm`/`doKanjuLogin` → POST `/api/kanju/login`）——登录一次全站解锁官方线路
- 观看记录隐私开关 `toggleVideoHistory`（`lya_video_history_enabled`）
- `onclick` 内联 JSON payload 统一走 `window._lyaOnclickPayload(obj)`（encodeURIComponent + `'`→`%27`，单引号书名防死卡）

**搜索/阅读**：
- 小说/漫画搜索默认源 ALL + 标题"⚡聚合全网源"徽标 + 关键词转义（自 XSS）
- 小说聚合后端软超时 3.2s + edgeCache 60s + 单源限量 24
- 目录 /api/catalog edgeCache 600s
- `formatPlaySecondsLabel` h:mm:ss

### 2.3 后端（functions/api/[[path]].js）

**源健康分系统**：
- `VOD_API_BASES`（17 源，含候选闪电/海外看/雨燕）、`VOD_SOURCE_HEALTH` Map、`recordVodSourceHealth`（EMA 延迟 + 失败连击）、`isVodSourceBlocked`（连击≥2 熔断 10 分钟）、`pickHealthyVodSources`（www. 归一去重）
- `fetchVodJson(url, params, timeout)`：统一拉取器，自动记录健康分
- **/api/video/search** 与 **/api/video/channel**、**/api/video/classes** 均基于此

**频道系统**：
- `/api/video/classes`：聚合各源 ac=list → `classifyVodTypeName`（剧场版→动漫、解说/资讯丢弃、纪录→电影）→ `normalizeVodClassChip`（后缀剥离 + `VOD_CHIP_NOISE` 黑名单）
- `/api/video/channel`：`pickChannelTypeTasks`（同 host 去重、空 chip 不命中、每源≤2 任务、总量≤18）
- 两者均有 edgeCache（classes 1h / channel 5min）

**kanju session 管理（官方线路解锁核心）**：
- `KANJU_SESSION`（模块级）：cookies Map + loggedIn + lastMe
- `kanjuCookieHeader()` / `kanjuCaptureCookies(res)`（getSetCookie）
- `kanjuLogin(env, account, password)`：清 cookie → GET 首页建游客 session → POST `/v1/users/password/login`（**body 字段是 `account` 不是 email**，**需要先有游客 Cookie**，**签名 payload = `POST\n{path}\n{ts}\n{nonce}`**）→ 成功后 GET /v1/users/me 存 `KANJU_SESSION.lastMe` → cookies 持久化 KV（kanju_session_cookies/kanju_session_account）
- `ensureKanjuLogin(env, force)`：内存 → KV 恢复（kanju_session_cookies）→ KV 凭证（kanju_credentials）自动登录
- `fetchKanjuSigned`/`fetchKanjuSignedPost`：自动携带 Cookie（kanjuCookieHeader）+ 捕获 Set-Cookie
- **POST /api/kanju/login**：接收凭证 → kanjuLogin → 凭证存 KV（kanju_credentials）→ 全站共享
- **/api/kanju/session**：session 状态查询
- **resolve-line 路由**：开头 `ensureKanjuLogin(env)`；catch 里 401 → `ensureKanjuLogin(env, true)` 强制重登 → 重试一次
- `globalThis.__LYA_ENV` 在 onRequest 顶部缓存（模块级函数的 KV 访问依赖）

**实测签名协议（kanju）**：
```
payload = "{METHOD}\n{pathname}{search}\n{timestamp}\n{nonce}"
signature = HMAC-SHA256(secret='557d0e4ae929f438da6bd84412374e6086b8af09b3fed54bf22601d5bf8c54a0', payload)
headers = { x-ai-movie-timestamp, x-ai-movie-nonce, x-ai-movie-signature, Referer: {host}/, [可选] x-ai-movie-client-name: dianyingtiantang-frontend }
```
- **登录端点**：POST /v1/users/password/login，body `{account, password}`（**字段名 account 不是 email**），**前置要求**：先 GET 首页/feed 建立游客 Cookie（Set-Cookie），否则 401 "Missing request signature"
- **登录态**：Cookie session（credentials include），session 有效期一年（expires_at）
- **官方线路**：line_options 中 `resolve://` 凭证 → POST /v1/playback/resolve-line {ticket} → {line:{url}}；**部分内容（如综艺《现在就出发》）官方线路需要 VIP**（401 playback_user_session_required），剧集类（《主角》）普通账号可解析

**源池现状**（详见 docs/02_源体检报告.md）：
- 视频 17 源注册（本地可达 7 + CF 侧大库 + 候选 3 交健康分甄别）
- 无尽/光速 URL 格式 `/api.php/provide/vod/from/wjm3u8/`（已实测正确）
- **kanju 官方线路 401 的真相**：kanju 按来源 IP 区分——CF 数据中心 IP 解析官方凭证被拒（playback_user_session_required），**用户住宅 IP 解析成功**（Node 直调验证）。因此 iOS 桥（用户 IP）是官方线路唯一可行路径；后端 session 仅在 kanju 不做 IP 校验时有效（当前实测 CF IP 官方凭证仍 401——**这是 kanju 后端侧的限制，前端已尽力**）

### 2.4 iOS 壳（ios/Lya/ContentView.swift）

- **Xcode 26.6 SDK 适配**：`WKNavigationDelegate` 的 `didFailNavigation` **已被更名为 `didFail`**（error: any Error）——新写 delegate 方法前先对照 SDK 26 签名；`didFailProvisionalNavigation` 未改名
- **kanju 解析桥**（本轮核心）：
  - `KanjuBridgeWebView` struct：隐藏 WKWebView（1x1，opacity 0）加载 `https://kanju32.com/`（游客 Cookie 自动建立），WKUserScript atDocumentEnd 注入 `window.__kanjuBridgeFetch`（**同源 fetch + HMAC 签名**，secret 内置）+ `window.__kanjuResults`
  - `LyaWebView` 注册 messageHandler `kanjuRequest`；Coordinator `callKanjuBridge(req, completion)`：**waitReady 轮询**（`window.__kanjuBridgeReady === true`，0.3s×50 次）→ executeKanjuFetch → 轮询 `__kanjuResults[reqId]`（0.25s×40）→ 结果经 `sharedWebView.evaluateJavaScript("window.__kanjuOnResponse(reqId, json)")` 回传
  - **Binding 链**：ContentView.sharedKanjuWebView → LyaWebView.kanjuWebView → Coordinator.parent
  - **踩坑记录**：static 成员实例引用报错（用 `Self.bridgeScript`）；ContentView 曾出现重复 binding 声明（git diff 自查）；`static let bridgeScript` 引用必须 `Self.`
- 原生桥 handlers：nativeOrientation / nativeHaptic（UIImpactFeedbackGenerator）/ nativeScreenSleep（loadContent 时重置 false 防常亮卡死）/ kanjuRequest
- 广告免疫：CSS + MutationObserver（600ms 去抖）+ 启动即清一次（`setTimeout(purgeAds, 0)`）
- didFailProvisionalNavigation + didFailNavigation → 原生重试面板（无离线包时）；loadContent 重置常亮
- `prompt()` 支持（runJavaScriptTextInputPanelWithPrompt）
- UA：真实系统版本 + `LyaNativeApp/2.0`（网页层据此激活 app-mode 液态玻璃）
- **已删除**：SeekFrames 死资源（28 张）、旧版 UIAlertController 修正、didFailNavigation 旧签名

### 2.5 Service Worker（sw.js）

- CACHE_VERSION `lya-shell-v20261121-6`；预缓存 6 库；同源静态 SWR；页面 network-first **1500ms** 超时回退；/api/* 不缓存
- **已知现象**：改了 video.js 等同 URL 文件后，SWR 会先交付旧缓存（后台更新），**本地测试必须先清 SW/缓存**（unregister + caches.delete）；生产用户会看到一次旧版随后自愈——**重要文件改动时同步 bump index.html 里的版本参数与 CACHE_VERSION**

---

## 三、深度机制与边界（接手必读）

1. **kanju 官方线路 IP 限制**：官方凭证解析（resolve-line）在数据中心 IP（CF 后端）被拒（401 playback_user_session_required），**用户住宅 IP（浏览器/WebView 内）成功**。iOS 原生桥是唯一可行路径。**网页端 PWA 无法解锁官方线路**（CORS + 无原生桥）——继续走第三方线路 + 自动测速。
2. **kanju 游客即可解析官方线路**（普通注册账号更稳）——无需 VIP。部分综艺官方线路需要 VIP（401 playback_user_session_required）——此类自动回退第三方。
3. **签名协议**（前后端一致）：HMAC-SHA256，payload `{METHOD}\n{path}{search}\n{ts}\n{nonce}`，secret 硬编码（原站逆向产物）。网页版客户端额外带 client-name 三件套（后端已补齐）。
4. **kanju 多镜像**：kanju.ai/kanju3.com/souju.ai/kanju1.com/souju7.com（签名协议一致）；前端 KanjuClient 记录 preferredHost。
5. **长按倍速的物理极限**：WKWebView 原生 HLS 的 playbackRate 切换有管线开销，preservesPitch=false 已是 web 层最优。零卡顿需纯原生播放器（AVPlayer setRate time:atHostTime:）——backlog。
6. **吃瓜视频帖无专有标记**：原站列表 HTML 只能从标题"视频/流出"启发式识别；精确数据靠详情回写索引（渐进式）。
7. **danbo 书源**：云端 Supabase `public.reading_sources` 表 anon 无权限（需其会员体系），无法直接取——已转开源书源试点（docs/04 A5）。
8. **开源书源普遍反爬**：XIU2/Yuedu 22 源中 13 个标注"人机验证/梯子"；规则引擎（Legado-lite）接入需 HTMLRewriter，见 docs/04 A5。

---

## 四、已知未修复问题

1. **《主角》官方线路在 APP 内的实际播放**：桥已实现并构建进 IPA（08:33 版），但**未经真机验证**——需用户装 IPA 后确认线路抽屉出现"原站官方·"组且播放正常。若桥不生效，排查：kanju32 页面加载（可能有反爬跳转）、Cookie 建立、waitReady 超时。
2. **部分内容官方线路需 VIP**：kanju 侧限制（401 playback_user_session_required），无解，自动回退第三方。
3. **第三方 CDN 用户侧速度波动**：自动测速优选已缓解，但 CDN 分发质量本身不可控。
4. **feed.js 的 LyaFeed 代码保留但无入口**（抖音模式移除后）：文件继续被加载（LyaGallery 在用），如需彻底瘦身可拆分 LyaGallery 独立。
5. **搜索软超时 3.2s 的代价**：极慢源的結果被丢弃（下一轮可做"后台补全+前端增量刷新"）。
6. **refreshVideoFeed（"换一批"按钮）实际无效果**：renderAllVideoSections 总是渲染全部 8 板块（历史遗留，未修）。

## 五、诊断手段（复用指南）

1. **全站错误收集**：`window.__errs`（head 注入，含 message+file:line）——浏览器 evaluate 读 `window.__errs`。
2. **CI 日志回传**：IPA 构建失败时 Report 步骤自动把 `ios/build_failure.log` 提交回仓库（git pull 即读）；诊断后 CI 自动从仓库移除。
3. **后端单元测试**：`C:\Users\ROG\.zcode\workspace\default\scripts\test_backend.mjs`——Node 直调 Pages Function 模块（`mod.onRequest({request, env, ctx})`），支持 classes/channel/search/novelsearch 参数。
4. **本地 dev server**：`scripts/dev_server.mjs 8788`——静态文件 + 直接调 Functions 模块（绕过 workerd 的本机网络问题）。
5. **嵌套损坏检查**：区间 div 开闭计数（`seg.match(/<div/g).length vs seg.match(/<\/div>/g).length`）——本轮吃瓜塌陷的定位手段。
6. **源探测脚本**：`scripts/probe*.sh`（curl 连通性+数据校验）。
7. **⚠️ 语法检查陷阱**：`html.match(/<script>.../)` 只抓第一个 inline script（head 小脚本）——**必须用 matchAll 检查全部块**（曾因此假阳性放过 body 大脚本错误）。
8. **⚠️ PowerShell $_ 陷阱**：Bash 内联调用 PowerShell 时 `$_` 会被 Bash 吞掉——复杂 PS 逻辑写 .ps1 文件执行。
9. **⚠️ 本机环境**：无 Python（商店占位符）、无 gh CLI；Node v24 可用；raw.githubusercontent 被墙（用自家 /api/proxy 拉）。

## 六、待办（优先级序）

**P0（用户已反馈待验证）**：
- [ ] 用户装 08:33 IPA 后验证《主角》官方线路（kanju 桥真机首测）
- [ ] 吃瓜详情真机复验（容器恢复后）

**P1（下轮建议）**：
- [ ] Legado-lite 规则书源引擎（试点清单见 docs/04 A5：速读谷/铅笔小说等 9 源）——HTMLRewriter 子集 @css:+@json:+replaceRegex+域名 allowlist
- [ ] 官方线路的 AES-128 HLS 在 DPlayer/hls.js 的解密播放验证（第三方线路也有 AES——若黑屏需检查 key 跨域）
- [ ] 搜索"后台补全"：软超时丢弃的慢源结果后台继续算，前端增量刷新
- [ ] feed.js 拆分：LyaGallery 独立（LyaFeed 无入口可删）

**P2（backlog，详见 docs/04）**：
豆瓣榜单频道 / 跳过片头片尾自动化 / 线路测速面板 pin / 短剧上下滑 / M3U8 离线下载 / TTS 听书 / IPTV / 音乐 / 观看统计图表 / douban SuperWebView 注入桥 / iOS 后台播放+原生亮度手势

## 七、关键文件地图

```
index.html              五栏导航/聚合首页/书城壳/吃瓜区/登录表单/全部 CSS
video.js                播放器(长按/频道/抽屉/测速/清晰度/官方线路接入/记忆倍速)
novel.js                小说分页引擎框架(字体就绪补偿/旋转去抖)
manga.js                漫画捏合缩放/焦点保持(0 0 origin)/智能预载
feed.js                 LyaFeed上下滑(保留未接入口) + LyaGallery图集查看器(入口保留)
kanju.js                KanjuClient(前端直调/原生桥优先/镜像竞速)
sw.js                   应用壳缓存(v20261121-6)
functions/api/[[path]].js  全部后端(健康分/频道/classes/session/登录/edgeCache)
ios/Lya/ContentView.swift  壳(4 handler/kanju桥/重试UI/常亮管理)
docs/01~04              竞品参考/源体检/优化日志/路线图
scripts/(workspace)     test_backend.mjs / dev_server.mjs / probe*.sh / kanju_diag*
```

---

## 八、交接检查清单（AI 接手第一小时）

1. `git pull` 后确认 HEAD ≥ `a84a7b3`；`node --check` 跑 video.js/novel.js/manga.js/feed.js/kanju.js/sw.js；用 **matchAll** 方式检查 index.html 全部 inline script。
2. 读本文档 §三（深度机制）与 §四（已知问题）——避免重复踩坑。
3. 本地起 `scripts/dev_server.mjs 8788`，浏览器清 SW/缓存后 reload 再测（SWR 陈旧陷阱见 §2.5）。
4. 生产验证用**未缓存关键词**（edgeCache 120s/60s 命中会误导）。
5. 修改 index.html 结构后**必须**：区间 div 开闭计数 + 全 inline script 语法检查 + 浏览器实际走查。
6. 推送后监控：Cloudflare Pages 部署（改 web）、GitHub Actions IPA 构建（改 ios/workflow）、`ios/build_failure.log`（CI 失败自动回传）。
