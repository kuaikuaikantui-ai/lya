# Lya (乐雅) · 沉浸式轻量跨端流媒体与阅读引擎

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-4CAF50" alt="Platform" />
  <img src="https://img.shields.io/badge/Backend-Cloudflare%20Workers-F38020?logo=cloudflare" alt="Cloudflare" />
</p>

**Lya** 是一款高性能、全开源的轻量级跨端流媒体播放与沉浸式小说/漫画阅读 Web 应用程序。专为双端（PC 桌面大屏与手机移动端）自适应打造，融合现代 Web 标准技术、开源中文排版引擎与 Serverless 边缘实时同步架构。

---

## 🌟 核心特性 (Key Features)

### 1. 📖 专业级排版引擎与双模阅读器
- **赫蹏 (Heti) + 霞鹜文楷**：深度集成开源中文网页排版规范与开源书法级文楷字体，呈现媲美实体书的行间距离与字符避头尾。
- **双阅读模式无缝切换**：原生支持左右书页仿真翻页与上下卷轴沉浸式阅读，漫画作品智能自适应卷轴瀑布流。
- **护眼多主题调色板**：极夜黑、羊皮纸、护眼绿、晨曦白、雅致灰一键平滑切换。

### 2. ⚡ 毫秒级多端单调不回退实时云同步
- **严格单调进度原则**：自主研发跨设备阅读进度合并算法，彻底杜绝因本地时钟漂移、设备后台唤醒导致的进度回退现象。
- **SSE (Server-Sent Events) 实时广播**：基于边缘流实时监听，手机端翻页，电脑端无需刷新秒级自动感知并提示对齐。
- **边缘容灾存储**：采用 Cloudflare Workers + KV 与热缓存容灾机制，支持免密通行证即时漫游。

### 3. 🎬 P2P 视听流媒体播放中心
- **超清秒播引擎**：内置 HLS.js、DPlayer 与 WebRTC P2P 视听加速，大幅提升流媒体缓冲速度并降低带宽压力。
- **智能源站聚合与防串扰**：自动过滤解析无效切片与广告，多线路自动备灾故障转移。

---

## 🏗️ 架构概览 (Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    Lya Client (SPA / PWA)                   │
├──────────────────────────────┬──────────────────────────────┤
│  Reader Engine (Heti/LXGW)   │  Media Player (DPlayer/HLS)  │
├──────────────────────────────┴──────────────────────────────┤
│       Strict Monotonic State Manager (Anti-Rollback)        │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
         Fetch / REST                   SSE Stream
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│             Cloudflare Edge Workers (/api/sync)             │
├──────────────────────────────┬──────────────────────────────┤
│      KV Persistent Store     │      Live Broadcast Stream   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速上手 (Quick Start)

### 本地运行
无需安装任何复杂的重型构建工具，纯原生现代技术栈：

```bash
# 1. 克隆代码仓库
git clone https://github.com/kuaikuaikantui-ai/lya.git
cd lya

# 2. 使用任意静态 HTTP 服务启动（如 Python 或 Node）
python3 -m http.server 8080
# 或
npx serve .
```

在浏览器中打开 `http://localhost:8080` 即可开始使用。

### 部署到 Cloudflare Pages
1. 在 Cloudflare 控制台中新建 **Pages** 项目。
2. 绑定本 GitHub 仓库 `kuaikuaikantui-ai/lya`。
3. 构建命令留空，根目录设置为 `/`，点击部署即可直接全球上线。

---

## 📄 开源许可证 (License)

本项目采用 [MIT License](LICENSE) 开源协议，欢迎广大开发者提交 Issue 与 Pull Request 共同完善！
