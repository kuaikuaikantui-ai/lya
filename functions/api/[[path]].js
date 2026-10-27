const HTML_CONTENT = "<!DOCTYPE html>\n<html lang=\"zh-CN\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover\">\n    <title>OpenHappy · 昂哥构建</title>\n    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\">\n    <style>\n        :root {\n            --bg-base: #0f1115;\n            --bg-card: #181a20;\n            --bg-card-hover: #22252e;\n            --border: #282c35;\n            --text-main: #e2e4e9;\n            --text-muted: #8b92a0;\n            --accent: #2dd4c0;\n            --accent-glow: rgba(45, 212, 192, 0.15);\n        }\n\n        body[data-theme=\"stealth\"] {\n            --bg-base: #1e1e1e;\n            --bg-card: #252526;\n            --bg-card-hover: #2d2d2d;\n            --border: #3e3e42;\n            --text-main: #cccccc;\n            --text-muted: #6a9955;\n            --accent: #569cd6;\n            --accent-glow: rgba(86, 156, 214, 0.12);\n            font-family: Consolas, \"Fira Code\", Monaco, monospace !important;\n        }\n\n        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }\n        \n        body {\n            background: var(--bg-base);\n            color: var(--text-main);\n            font-family: -apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Segoe UI\", Roboto, \"Helvetica Neue\", sans-serif;\n            min-height: 100vh;\n            display: flex;\n            flex-direction: column;\n            padding-bottom: constant(safe-area-inset-bottom);\n            padding-bottom: env(safe-area-inset-bottom);\n        }\n\n        header {\n            background: var(--bg-card);\n            border-bottom: 1px solid var(--border);\n            padding: 12px 16px;\n            padding-top: calc(12px + env(safe-area-inset-top));\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            position: sticky;\n            top: 0;\n            z-index: 100;\n        }\n\n        .brand {\n            display: flex;\n            align-items: center;\n            gap: 8px;\n            font-size: 16px;\n            font-weight: 600;\n            color: var(--accent);\n            cursor: pointer;\n        }\n\n        .badge {\n            font-size: 10px;\n            padding: 2px 6px;\n            background: var(--accent-glow);\n            border: 1px solid var(--accent);\n            border-radius: 4px;\n        }\n\n        .header-actions { display: flex; gap: 8px; }\n\n        button.btn {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            color: var(--text-main);\n            padding: 7px 12px;\n            border-radius: 8px;\n            font-size: 13px;\n            cursor: pointer;\n            transition: all 0.2s;\n            display: inline-flex;\n            align-items: center;\n            gap: 5px;\n        }\n        button.btn:active { transform: scale(0.96); }\n        button.btn.primary { background: var(--accent); color: #000; font-weight: 600; border: none; }\n\n        main {\n            flex: 1;\n            max-width: 900px;\n            width: 100%;\n            margin: 0 auto;\n            padding: 14px 12px;\n        }\n\n        .tab-nav {\n            display: flex;\n            gap: 8px;\n            margin-bottom: 14px;\n            border-bottom: 1px solid var(--border);\n            padding-bottom: 8px;\n        }\n        .tab-nav-btn {\n            background: transparent;\n            border: none;\n            color: var(--text-muted);\n            font-size: 14px;\n            font-weight: 600;\n            padding: 6px 14px;\n            border-radius: 6px;\n            cursor: pointer;\n        }\n        .tab-nav-btn.active {\n            background: var(--accent-glow);\n            color: var(--accent);\n        }\n\n        .search-box {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            border-radius: 12px;\n            padding: 14px;\n            margin-bottom: 16px;\n        }\n\n        .search-row {\n            display: flex;\n            gap: 8px;\n            margin-bottom: 10px;\n        }\n\n        .search-input {\n            flex: 1;\n            background: rgba(0,0,0,0.25);\n            border: 1px solid var(--border);\n            border-radius: 8px;\n            padding: 10px 14px;\n            color: var(--text-main);\n            font-size: 14px;\n            outline: none;\n            -webkit-appearance: none;\n        }\n        .search-input:focus { border-color: var(--accent); }\n\n        .filter-row {\n            display: flex;\n            gap: 8px;\n            align-items: center;\n            flex-wrap: wrap;\n        }\n\n        .select-filter {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            color: var(--text-main);\n            padding: 6px 10px;\n            border-radius: 6px;\n            font-size: 12px;\n            outline: none;\n        }\n\n        .grid-list {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));\n            gap: 12px;\n        }\n\n        .card {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            border-radius: 10px;\n            padding: 14px;\n            cursor: pointer;\n            transition: transform 0.15s, border-color 0.15s;\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n        }\n        .card:active { transform: scale(0.98); }\n\n        .card-title { font-size: 15px; font-weight: 600; margin-bottom: 6px; }\n        .card-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; line-height: 1.5; }\n        .card-tag { font-size: 11px; color: var(--accent); }\n\n        #detailView, #readerView { display: none; }\n\n        .view-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 14px;\n            padding-bottom: 10px;\n            border-bottom: 1px solid var(--border);\n        }\n\n        .catalog-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));\n            gap: 8px;\n            max-height: 60vh;\n            overflow-y: auto;\n            margin-top: 12px;\n            -webkit-overflow-scrolling: touch;\n        }\n\n        .chap-btn {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            color: var(--text-main);\n            padding: 9px 8px;\n            border-radius: 6px;\n            font-size: 12px;\n            text-align: center;\n            cursor: pointer;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n        }\n        .chap-btn:active { background: var(--accent-glow); }\n        .chap-btn.read-active { border-color: var(--accent); background: var(--accent-glow); }\n\n        .reader-wrapper {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            border-radius: 12px;\n            padding: 14px 10px;\n            min-height: 60vh;\n        }\n\n        .img-stream {\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            gap: 8px;\n            width: 100%;\n        }\n        .img-stream img {\n            width: 100%;\n            max-width: 800px;\n            height: auto;\n            display: block;\n            border-radius: 4px;\n        }\n\n        .text-stream {\n            font-size: 16px;\n            line-height: 2;\n            white-space: pre-wrap;\n            padding: 10px;\n        }\n\n        .pager {\n            display: flex;\n            gap: 10px;\n            margin-top: 18px;\n        }\n        .pager button { flex: 1; padding: 12px; }\n\n        .modal-overlay {\n            position: fixed; inset: 0;\n            background: rgba(0,0,0,0.7);\n            backdrop-filter: blur(4px);\n            display: none;\n            align-items: center;\n            justify-content: center;\n            z-index: 200;\n        }\n        .modal-overlay.open { display: flex; }\n        .modal-card {\n            background: var(--bg-card);\n            border: 1px solid var(--border);\n            width: 90%;\n            max-width: 450px;\n            max-height: 80vh;\n            border-radius: 14px;\n            display: flex;\n            flex-direction: column;\n            overflow: hidden;\n        }\n        .modal-head {\n            padding: 14px 18px;\n            border-bottom: 1px solid var(--border);\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n        .source-switch-list {\n            padding: 12px;\n            overflow-y: auto;\n            display: flex;\n            flex-direction: column;\n            gap: 8px;\n        }\n        .switch-item {\n            background: rgba(0,0,0,0.2);\n            border: 1px solid var(--border);\n            padding: 12px;\n            border-radius: 8px;\n            cursor: pointer;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n    </style>\n</head>\n<body>\n\n<header>\n    <div class=\"brand\" onclick=\"switchNav('shelf')\">\n        <i class=\"fas fa-book-open\"></i>\n        <span>OpenHappy</span>\n        <span class=\"badge\" id=\"sourceVerTag\">日更版</span>\n    </div>\n    <div class=\"header-actions\">\n        <button class=\"btn\" onclick=\"toggleStealth()\"><i class=\"fas fa-mask\"></i> 摸鱼模式</button>\n    </div>\n</header>\n\n<main>\n    <div class=\"tab-nav\">\n        <button class=\"tab-nav-btn active\" id=\"navShelfBtn\" onclick=\"switchNav('shelf')\"><i class=\"fas fa-bookmark\"></i> 我的书架</button>\n        <button class=\"tab-nav-btn\" id=\"navSearchBtn\" onclick=\"switchNav('search')\"><i class=\"fas fa-compass\"></i> 全网搜索</button>\n    </div>\n\n    <section id=\"shelfSection\">\n        <div id=\"shelfGrid\" class=\"grid-list\"></div>\n        <div id=\"shelfEmpty\" style=\"text-align: center; color: var(--text-muted); padding: 50px 0; display: none;\">\n            书架暂无书籍，点击上方【全网搜索】发现精彩内容！\n        </div>\n    </section>\n\n    <section id=\"searchSection\" style=\"display: none;\">\n        <div class=\"search-box\">\n            <div class=\"search-row\">\n                <input type=\"text\" id=\"searchInput\" class=\"search-input\" placeholder=\"输入作品名搜索...\" value=\"秘密教学\" />\n                <button class=\"btn primary\" onclick=\"doSearch()\"><i class=\"fas fa-search\"></i> 搜索</button>\n            </div>\n            <div class=\"filter-row\">\n                <label style=\"font-size: 12px; color: var(--text-muted);\">分类：</label>\n                <select id=\"tabSelect\" class=\"select-filter\" onchange=\"updateSources()\">\n                    <option value=\"漫画\" selected>漫画</option>\n                    <option value=\"小说\">小说</option>\n                </select>\n\n                <label style=\"font-size: 12px; color: var(--text-muted); margin-left: 8px;\">书源：</label>\n                <select id=\"sourceSelect\" class=\"select-filter\"></select>\n            </div>\n        </div>\n\n        <div id=\"resultsGrid\" class=\"grid-list\"></div>\n    </section>\n\n    <section id=\"detailView\">\n        <div class=\"view-header\">\n            <button class=\"btn\" onclick=\"goBackFromDetail()\"><i class=\"fas fa-arrow-left\"></i> 返回</button>\n            <h3 id=\"detailBookTitle\" style=\"font-size: 16px;\">书籍详情</h3>\n            <div style=\"display: flex; gap: 8px;\">\n                <button class=\"btn\" onclick=\"openSwitchSourceModal()\"><i class=\"fas fa-random\"></i> 换源</button>\n                <button class=\"btn primary\" id=\"shelfToggleBtn\" onclick=\"toggleBookShelf()\"><i class=\"fas fa-plus\"></i> 加书架</button>\n            </div>\n        </div>\n        <div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;\">\n            <span class=\"card-tag\" id=\"detailSourceTag\"></span>\n            <span style=\"font-size: 12px; color: var(--text-muted);\" id=\"detailAuthorTag\"></span>\n        </div>\n        <p id=\"detailIntro\" style=\"font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;\"></p>\n        \n        <h4 style=\"font-size: 14px; margin-bottom: 8px;\">📑 完整章节目录</h4>\n        <div id=\"catalogList\" class=\"catalog-grid\"></div>\n    </section>\n\n    <section id=\"readerView\">\n        <div class=\"view-header\">\n            <button class=\"btn\" onclick=\"showView('detail')\"><i class=\"fas fa-arrow-left\"></i> 目录</button>\n            <h3 id=\"readerChapTitle\" style=\"font-size: 14px; max-width: 65%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\">章节标题</h3>\n            <button class=\"btn\" onclick=\"toggleStealth()\"><i class=\"fas fa-eye-slash\"></i> 摸鱼</button>\n        </div>\n\n        <div class=\"reader-wrapper\" id=\"readerContainer\">\n            <div style=\"text-align: center; color: var(--text-muted); padding: 40px;\">正在加载正文...</div>\n        </div>\n\n        <div class=\"pager\">\n            <button class=\"btn\" id=\"prevBtn\" onclick=\"prevChapter()\">上一章</button>\n            <button class=\"btn primary\" id=\"nextBtn\" onclick=\"nextChapter()\">下一章</button>\n        </div>\n    </section>\n</main>\n\n<div class=\"modal-overlay\" id=\"sourceModal\">\n    <div class=\"modal-card\">\n        <div class=\"modal-head\">\n            <span style=\"font-weight: 600;\">智能换源比对</span>\n            <button class=\"btn\" onclick=\"closeSourceModal()\">✕</button>\n        </div>\n        <div class=\"source-switch-list\" id=\"sourceSwitchList\"></div>\n    </div>\n</div>\n\n<script>\n    let appConfig = null;\n    let currentCatalog = [];\n    let currentChapterIndex = 0;\n    let currentBookInfo = null;\n    let previousView = 'shelf';\n\n    // 核心过滤工具：彻底去除原站偷偷注入的零宽字符与催费拦截文字\n    function cleanAdContent(text) {\n        if (!text || typeof text !== 'string') return '';\n        // 1. 去除隐藏的零宽字符（\\u200B 到 \\u200F，\\uFEFF，\\u202A-\\u202E 等）\n        let clean = text.replace(/[\\u200B-\\u200F\\uFEFF\\u202A-\\u202E]/g, '');\n        // 2. 截断从广告/催费/售后提示开始的所有尾部文本\n        const adMarkers = [\n            '您当前未登录',\n            '您今日免登录访问次数',\n            '📣晴天提醒您',\n            '官方售后方式',\n            '已转为内部会员',\n            '一定一定要更新书源',\n            '账号信息异常',\n            '不再为免费用户提供服务'\n        ];\n        for (const marker of adMarkers) {\n            const idx = clean.indexOf(marker);\n            if (idx !== -1) {\n                clean = clean.substring(0, idx);\n            }\n        }\n        return clean.trim();\n    }\n\n    function getLocalShelf() {\n        try {\n            return JSON.parse(localStorage.getItem('open_reader_shelf') || '[]');\n        } catch(e) { return []; }\n    }\n\n    function saveLocalShelf(shelf) {\n        localStorage.setItem('open_reader_shelf', JSON.stringify(shelf));\n    }\n\n    function renderShelf() {\n        const shelf = getLocalShelf();\n        const grid = document.getElementById('shelfGrid');\n        const empty = document.getElementById('shelfEmpty');\n\n        if (shelf.length === 0) {\n            grid.innerHTML = '';\n            empty.style.display = 'block';\n            return;\n        }\n\n        empty.style.display = 'none';\n        grid.innerHTML = shelf.map((b, idx) => `\n            <div class=\"card\" onclick=\"openBookFromShelf(${idx})\">\n                <div>\n                    <div class=\"card-title\">${b.book_name}</div>\n                    <div class=\"card-sub\">读至: <span style=\"color:var(--accent); font-weight:600;\">${b.lastReadTitle || '序章'}</span></div>\n                </div>\n                <div style=\"display:flex; justify-content:space-between; align-items:center; margin-top:10px;\">\n                    <span class=\"card-tag\">${b.source}</span>\n                    <button class=\"btn\" style=\"padding:4px 8px; font-size:11px;\" onclick=\"removeFromShelf(event, ${idx})\">移出</button>\n                </div>\n            </div>\n        `).join('');\n    }\n\n    function toggleBookShelf() {\n        if (!currentBookInfo) return;\n        let shelf = getLocalShelf();\n        const existingIdx = shelf.findIndex(b => b.book_name === currentBookInfo.book_name && b.source === currentBookInfo.source);\n        const btn = document.getElementById('shelfToggleBtn');\n\n        if (existingIdx !== -1) {\n            shelf.splice(existingIdx, 1);\n            btn.innerHTML = '<i class=\"fas fa-plus\"></i> 加书架';\n        } else {\n            shelf.unshift({\n                ...currentBookInfo,\n                lastReadTitle: currentCatalog[currentChapterIndex]?.title || '未开始',\n                lastReadIndex: currentChapterIndex\n            });\n            btn.innerHTML = '<i class=\"fas fa-check\"></i> 已在书架';\n        }\n        saveLocalShelf(shelf);\n        renderShelf();\n    }\n\n    function updateShelfProgress(chapTitle, chapIdx) {\n        if (!currentBookInfo) return;\n        let shelf = getLocalShelf();\n        const item = shelf.find(b => b.book_name === currentBookInfo.book_name);\n        if (item) {\n            item.lastReadTitle = chapTitle;\n            item.lastReadIndex = chapIdx;\n            saveLocalShelf(shelf);\n            renderShelf();\n        }\n    }\n\n    function removeFromShelf(e, idx) {\n        e.stopPropagation();\n        let shelf = getLocalShelf();\n        shelf.splice(idx, 1);\n        saveLocalShelf(shelf);\n        renderShelf();\n    }\n\n    function openBookFromShelf(idx) {\n        const shelf = getLocalShelf();\n        const book = shelf[idx];\n        loadBookDetail(encodeURIComponent(JSON.stringify(book)), book.lastReadIndex || 0);\n    }\n\n    async function init() {\n        try {\n            const res = await fetch('/api/info');\n            appConfig = await res.json();\n            if (appConfig.version) {\n                document.getElementById('sourceVerTag').innerText = '配置: ' + appConfig.version;\n            }\n            updateSources();\n        } catch(e) {}\n        renderShelf();\n    }\n\n    function updateSources() {\n        const tab = document.getElementById('tabSelect').value;\n        const sourceSelect = document.getElementById('sourceSelect');\n        const list = appConfig?.categories[tab] || [];\n        sourceSelect.innerHTML = list.map(s => `<option value=\"${s}\">${s}</option>`).join('');\n    }\n\n    function switchNav(nav) {\n        const isShelf = (nav === 'shelf');\n        document.getElementById('navShelfBtn').classList.toggle('active', isShelf);\n        document.getElementById('navSearchBtn').classList.toggle('active', !isShelf);\n        document.getElementById('shelfSection').style.display = isShelf ? 'block' : 'none';\n        document.getElementById('searchSection').style.display = isShelf ? 'none' : 'block';\n        document.getElementById('detailView').style.display = 'none';\n        document.getElementById('readerView').style.display = 'none';\n        previousView = nav;\n        if (isShelf) renderShelf();\n    }\n\n    async function doSearch() {\n        const title = document.getElementById('searchInput').value.trim();\n        const tab = document.getElementById('tabSelect').value;\n        const source = document.getElementById('sourceSelect').value;\n        const grid = document.getElementById('resultsGrid');\n\n        grid.innerHTML = '<div style=\"color:var(--text-muted); padding:20px;\">正在检索开源源站数据...</div>';\n\n        try {\n            const res = await fetch(`/api/search?title=${encodeURIComponent(title)}&tab=${encodeURIComponent(tab)}&source=${encodeURIComponent(source)}`);\n            const data = await res.json();\n            const list = data.data || [];\n\n            if (list.length === 0) {\n                grid.innerHTML = '<div style=\"color:var(--text-muted); padding:20px;\">暂未找到匹配内容，请尝试更换书源搜索。</div>';\n                return;\n            }\n\n            grid.innerHTML = list.map((item, idx) => `\n                <div class=\"card\" onclick=\"loadBookDetail('${encodeURIComponent(JSON.stringify(item))}')\">\n                    <div>\n                        <div class=\"card-title\">${item.book_name}</div>\n                        <div class=\"card-sub\">${item.abstract ? cleanAdContent(item.abstract).slice(0, 65) + '...' : '暂无简介'}</div>\n                    </div>\n                    <div style=\"display:flex; justify-content:space-between; align-items:center; margin-top:8px;\">\n                        <span class=\"card-sub\">${item.author || '网络源'}</span>\n                        <span class=\"card-tag\">${item.source || source}</span>\n                    </div>\n                </div>\n            `).join('');\n        } catch(e) {\n            grid.innerHTML = `<div style=\"color:red; padding:20px;\">搜索失败: ${e.message}</div>`;\n        }\n    }\n\n    async function loadBookDetail(encodedItem, autoReadIndex = null) {\n        const book = JSON.parse(decodeURIComponent(encodedItem));\n        currentBookInfo = book;\n\n        document.getElementById('detailBookTitle').innerText = book.book_name;\n        document.getElementById('detailSourceTag').innerText = book.source;\n        document.getElementById('detailAuthorTag').innerText = book.author ? '作者: ' + book.author : '';\n        document.getElementById('detailIntro').innerText = cleanAdContent(book.abstract) || '无详细简介';\n\n        const shelf = getLocalShelf();\n        const isIn = shelf.some(b => b.book_name === book.book_name);\n        document.getElementById('shelfToggleBtn').innerHTML = isIn ? '<i class=\"fas fa-check\"></i> 已在书架' : '<i class=\"fas fa-plus\"></i> 加书架';\n\n        const catalogList = document.getElementById('catalogList');\n        catalogList.innerHTML = '<div style=\"color:var(--text-muted);\">正在加载目录...</div>';\n        showView('detail');\n\n        try {\n            const res = await fetch(`/api/catalog?book_id=${encodeURIComponent(book.book_id)}&source=${encodeURIComponent(book.source)}&tab=${encodeURIComponent(book.tab || '漫画')}`);\n            const data = await res.json();\n            currentCatalog = data.data || [];\n\n            if (currentCatalog.length === 0) {\n                catalogList.innerHTML = '<div style=\"color:var(--text-muted);\">暂无目录数据</div>';\n                return;\n            }\n\n            catalogList.innerHTML = currentCatalog.map((chap, idx) => `\n                <div class=\"chap-btn ${autoReadIndex === idx ? 'read-active' : ''}\" title=\"${chap.title}\" onclick=\"readChapter(${idx})\">\n                    ${chap.title}\n                </div>\n            `).join('');\n\n            if (autoReadIndex !== null && currentCatalog[autoReadIndex]) {\n                readChapter(autoReadIndex);\n            }\n        } catch(e) {\n            catalogList.innerHTML = `<div style=\"color:red;\">获取目录异常: ${e.message}</div>`;\n        }\n    }\n\n    async function readChapter(idx) {\n        currentChapterIndex = idx;\n        const chap = currentCatalog[idx];\n        showView('reader');\n\n        document.getElementById('readerChapTitle').innerText = chap.title;\n        const container = document.getElementById('readerContainer');\n        container.innerHTML = '<div style=\"text-align:center; color:var(--text-muted); padding:40px;\">正在加载正文...</div>';\n\n        document.getElementById('prevBtn').disabled = (idx === 0);\n        document.getElementById('nextBtn').disabled = (idx >= currentCatalog.length - 1);\n\n        updateShelfProgress(chap.title, idx);\n\n        try {\n            const res = await fetch(`/api/content?item_id=${encodeURIComponent(chap.item_id)}&source=${encodeURIComponent(currentBookInfo.source)}&tab=${encodeURIComponent(currentBookInfo.tab || '漫画')}&book_id=${encodeURIComponent(currentBookInfo.book_id)}`);\n            const data = await res.json();\n\n            // 1. 如果有漫画图片\n            if (data.images && data.images.length > 0) {\n                const isStealth = document.body.getAttribute('data-theme') === 'stealth';\n                if (isStealth) {\n                    container.innerHTML = `\n                        <div class=\"text-stream\">\n                            // [摸鱼模式已生效 - 原画已被转化为轻量文本节点]\\n\n                            // 章节: ${chap.title}\\n\n                            // 源站图片资源总数: ${data.images.length} 张图片\\n\n                            // 流量节省: ~98.5%\\n\n                            \\n【剧情节点已就绪，退出摸鱼模式即可查看完整原画】\n                        </div>\n                    `;\n                } else {\n                    container.innerHTML = `\n                        <div class=\"img-stream\">\n                            ${data.images.map(img => `<img src=\"${img}\" loading=\"lazy\" />`).join('')}\n                        </div>\n                    `;\n                }\n                window.scrollTo({ top: 0, behavior: 'smooth' });\n                return;\n            }\n\n            // 2. 如果是小说纯文本，清洗掉催费垃圾广告后展示\n            const cleanedText = cleanAdContent(data.content);\n            if (cleanedText && cleanedText.length > 0) {\n                container.innerHTML = `<div class=\"text-stream\">${cleanedText}</div>`;\n                window.scrollTo({ top: 0, behavior: 'smooth' });\n                return;\n            }\n\n            // 3. 确实无内容，提示换源\n            container.innerHTML = `\n                <div style=\"color:var(--text-muted); padding:30px; text-align:center;\">\n                    该章节在当前书源暂无正文内容<br><br>\n                    <button class=\"btn primary\" onclick=\"openSwitchSourceModal()\"><i class=\"fas fa-random\"></i> 尝试切换其他书源</button>\n                </div>\n            `;\n            window.scrollTo({ top: 0, behavior: 'smooth' });\n        } catch(e) {\n            container.innerHTML = `<div style=\"color:red; padding:30px;\">加载章节失败: ${e.message}</div>`;\n        }\n    }\n\n    function prevChapter() {\n        if (currentChapterIndex > 0) readChapter(currentChapterIndex - 1);\n    }\n\n    function nextChapter() {\n        if (currentChapterIndex < currentCatalog.length - 1) readChapter(currentChapterIndex + 1);\n    }\n\n    function showView(name) {\n        document.getElementById('shelfSection').style.display = 'none';\n        document.getElementById('searchSection').style.display = 'none';\n        document.getElementById('detailView').style.display = (name === 'detail') ? 'block' : 'none';\n        document.getElementById('readerView').style.display = (name === 'reader') ? 'block' : 'none';\n    }\n\n    function goBackFromDetail() {\n        switchNav(previousView);\n    }\n\n    async function openSwitchSourceModal() {\n        if (!currentBookInfo) return;\n        const modal = document.getElementById('sourceModal');\n        const list = document.getElementById('sourceSwitchList');\n        modal.classList.add('open');\n\n        const tab = currentBookInfo.tab || '漫画';\n        const otherSources = (appConfig?.categories[tab] || []).filter(s => s !== currentBookInfo.source);\n\n        let html = '';\n        for (const s of otherSources) {\n            html += `\n                <div class=\"switch-item\" onclick=\"switchToSource('${s}')\">\n                    <div>\n                        <div style=\"font-weight:600; font-size:14px;\">${s}</div>\n                        <div style=\"font-size:11px; color:var(--text-muted);\">一键切源搜索此作品</div>\n                    </div>\n                    <span class=\"card-tag\">一键切换</span>\n                </div>\n            `;\n        }\n        list.innerHTML = html;\n    }\n\n    function closeSourceModal() {\n        document.getElementById('sourceModal').classList.remove('open');\n    }\n\n    function switchToSource(targetSource) {\n        closeSourceModal();\n        document.getElementById('tabSelect').value = currentBookInfo.tab || '漫画';\n        document.getElementById('sourceSelect').value = targetSource;\n        document.getElementById('searchInput').value = currentBookInfo.book_name;\n        switchNav('search');\n        doSearch();\n    }\n\n    function toggleStealth() {\n        const cur = document.body.getAttribute('data-theme');\n        document.body.setAttribute('data-theme', cur === 'stealth' ? 'dark' : 'stealth');\n        if (document.getElementById('readerView').style.display === 'block') {\n            readChapter(currentChapterIndex);\n        }\n    }\n\n    window.addEventListener('keydown', (e) => {\n        if (e.key === 'Escape') toggleStealth();\n    });\n\n    init();\n</script>\n</body>\n</html>\n";

const UPSTREAM = 'https://v1.qingtian618.com';
const UPSTREAM_POOL = [
    'https://v1.qingtian618.com',
    'https://v5.qingtian618.com',
    'https://v2.qingtian618.com',
    'https://v3.qingtian618.com',
    'https://cdn.qingtian618.com'
];
const CONFIG_URL = 'https://v1.qingtian618.com/static/source_config/config.json';

async function fetchUpstreamWithFailover(apiPath, isContentCheck = false) {
    let lastData = null;
    let lastErr = null;
    for (const host of UPSTREAM_POOL) {
        try {
            const r = await fetch(host + apiPath, {
                headers: getRandomHeaders(),
                signal: AbortSignal.timeout(4500)
            });
            if (!r.ok) continue;
            const data = await r.json();
            lastData = data;
            if (!isContentCheck) {
                if (data && (data.code === 0 || Array.isArray(data.data))) return data;
            } else {
                const hasImages = Array.isArray(data.images) && data.images.length > 0;
                const hasText = typeof data.content === 'string' && data.content.length > 50 && !data.content.includes('免登录访问次数已达上限') && !data.content.includes('已转为内部会员') && !data.content.includes('SVIP');
                if (hasImages || hasText) return data;
            }
        } catch (e) {
            lastErr = e;
        }
    }
    if (lastData) return lastData;
    throw lastErr || new Error('上游节点暂不可用');
}

// 清洗小说文本中的广告、零宽字符与催费提示
function cleanNovelText(text) {
    if (!text || typeof text !== 'string') return '';
    // 1. 去除隐藏的零宽字符（\u200B 到 \u200F，\uFEFF，\u202A-\u202E 等）
    let clean = text.replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, '');
    // 2. 截断从广告/催费/售后提示开始的所有尾部文本
    const adMarkers = [
        '您当前未登录',
        '您今日免登录访问次数',
        '📣晴天提醒您',
        '官方售后方式',
        '已转为内部会员',
        '一定一定要更新书源',
        '账号信息异常',
        '不再为免费用户提供服务'
    ];
    for (const marker of adMarkers) {
        const idx = clean.indexOf(marker);
        if (idx !== -1) {
            clean = clean.substring(0, idx);
        }
    }
    return clean.trim();
}

function getRandomHeaders() {
    const fakeIp = `${Math.floor(Math.random()*150)+50}.${Math.floor(Math.random()*200)+20}.${Math.floor(Math.random()*200)+20}.${Math.floor(Math.random()*250)+2}`;
    const fakeDevice = Math.random().toString(36).substring(2) + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    return {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
        'X-Forwarded-For': fakeIp,
        'Client-IP': fakeIp,
        'X-Real-IP': fakeIp,
        'True-Client-IP': fakeIp,
        'Cookie': 'deviceId=' + fakeDevice
    };
}

let cachedConfig = null;
let lastConfigFetch = 0;

// 搬山人直连源站检索与章节解析（无删减全本高品质小说源，杜绝断章与错乱）
async function searchBanshanren(keyword) {
    try {
        const url = 'https://www.banshanren.com/search/index?keyword=' + encodeURIComponent(keyword);
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' },
            signal: AbortSignal.timeout(5000)
        });
        if (!res.ok) return [];
        const text = await res.text();
        const tipIdx = text.indexOf('搜索结果');
        const ulIdx = tipIdx !== -1 ? text.indexOf('<ul class="novel_list">', tipIdx) : text.indexOf('<ul class="novel_list">');
        if (ulIdx === -1) return [];
        const endUlIdx = text.indexOf('</ul>', ulIdx);
        const listHtml = text.slice(ulIdx, endUlIdx !== -1 ? endUlIdx + 5 : ulIdx + 50000);

        const lis = [...listHtml.matchAll(/<li class="novel_li">([\s\S]*?)<\/li>/gi)];
        const results = [];

        for (const li of lis) {
            const raw = li[1];
            const hrefMatch = raw.match(/href="([^"]+)"/i);
            const titleMatch = raw.match(/<a[^>]+class="title"[^>]*>([\s\S]*?)<\/a>/i) || raw.match(/title="([^"]+)"/i);
            const coverMatch = raw.match(/data-src="([^"]+)"/i) || raw.match(/src="([^"]+)"/i);
            
            const infoBoxes = [...raw.matchAll(/<div class="info_box">([\s\S]*?)<\/div>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
            let author = '网络源';
            let remarks = '';
            for (const info of infoBoxes) {
                if (info.includes('·')) {
                    const parts = info.split('·').map(p => p.trim());
                    if (parts[0]) author = parts[0];
                    remarks = info;
                }
            }

            const bookName = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
            const bookId = hrefMatch ? hrefMatch[1] : '';

            if (bookName && bookId) {
                results.push({
                    book_name: bookName,
                    book_id: bookId,
                    author: author,
                    abstract: remarks || '共创优质无删减全本',
                    cover: coverMatch ? coverMatch[1] : '',
                    source: '搬山人',
                    tab: '小说'
                });
            }
        }
        return results;
    } catch (e) {
        return [];
    }
}

async function catalogBanshanren(bookId) {
    try {
        const url = bookId.startsWith('http') ? bookId : 'https://www.banshanren.com' + bookId;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' },
            signal: AbortSignal.timeout(6000)
        });
        if (!res.ok) return [];
        const text = await res.text();
        const chapMatches = [...text.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
        const chapters = [];
        const seenHrefs = new Set();

        for (const m of chapMatches) {
            const href = m[1];
            const rawTitle = m[2].replace(/<[^>]+>/g, '').trim();
            if (!href) continue;
            if (rawTitle === '开始阅读' || rawTitle.includes('阅读全文')) continue;
            if (seenHrefs.has(href)) continue;

            if (href.startsWith(bookId + '/') && /^\d+$/.test(href.substring(bookId.length + 1))) {
                seenHrefs.add(href);
                if (rawTitle) {
                    chapters.push({
                        title: rawTitle,
                        item_id: href
                    });
                }
            }
        }
        return chapters;
    } catch (e) {
        return [];
    }
}

async function contentBanshanren(itemId) {
    try {
        const url = itemId.startsWith('http') ? itemId : 'https://www.banshanren.com' + itemId;
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' },
            signal: AbortSignal.timeout(7000)
        });
        if (!res.ok) return { code: -1, msg: '获取源站正文失败: ' + res.status };
        const text = await res.text();
        const boxMatch = text.match(/<div class="chapter_content_box">([\s\S]*?)<\/div>/i);
        if (!boxMatch) return { code: -1, msg: '未定位到正文内容' };

        let title = '';
        const titleMatch = boxMatch[1].match(/<h2>([\s\S]*?)<\/h2>/i);
        if (titleMatch) {
            title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        }

        let content = boxMatch[1]
            .replace(/<span[^>]+class="z count[^"]*"[^>]*>[\s\S]*?<\/span>/gi, '')
            .replace(/<p[^>]*>/gi, '')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<[^>]+>/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        return {
            code: 0,
            title: title || '章节阅读',
            content: cleanNovelText(content)
        };
    } catch (e) {
        return { code: -1, msg: e.message };
    }
}

async function getLiveSourcesConfig() {
    const now = Date.now();
    // 24小时 (86400000ms) 自动拉取更新一次最新开源书源
    if (cachedConfig && (now - lastConfigFetch < 86400000)) return cachedConfig;

    try {
        const res = await fetch(CONFIG_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok) {
            const data = await res.json();
            let rawNovelSources = (data["搜索小说"] || data["小说"] || ["番茄", "七猫", "全本小说", "半夏小说", "塔读", "QQ阅读", "书旗", "红烛小说"]).filter(s => s !== '老福特');
            if (!rawNovelSources.includes('搬山人')) rawNovelSources.unshift('搬山人');

            cachedConfig = {
                version: data.version || '最新',
                categories: {
                    "漫画": ["新新漫画", "极速韩漫", "G社漫画", "全面漫画", "番茄"],
                    "小说": rawNovelSources.slice(0, 20)
                }
            };
            lastConfigFetch = now;
            return cachedConfig;
        }
    } catch(e) {}

    return {
        version: '昂哥构建',
        categories: {
            "漫画": ["新新漫画", "极速韩漫", "G社漫画", "全面漫画", "番茄"],
            "小说": ["搬山人", "七猫", "番茄", "伪69", "半夏小说", "52书库", "爱下电子书", "全本小说", "淘小说", "百度", "笔趣阁78", "知乎"]
        }
    };
}

// 直连源站解析：同时强力支持漫画画卷与小说纯文本提取！
async function fetchDirectFromOrigin(decodedItem) {
    const baseUrl = decodedItem.baseUrl || decodedItem.tocUrl || decodedItem.bookurl;
    let rawUrl = decodedItem.url;
    if (!baseUrl && !rawUrl) throw new Error('未提供有效源站链接');

    let fullChapUrl = rawUrl;
    let requestMethod = 'GET';
    let requestBody = null;
    let requestHeaders = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15',
        'Referer': baseUrl || fullChapUrl
    };

    // 支持解析如: "http://.../chapterContent,{"body":{...},"method":"POST"}" 格式的开源接口
    if (rawUrl && rawUrl.includes(',{')) {
        const commaIdx = rawUrl.indexOf(',{');
        fullChapUrl = rawUrl.substring(0, commaIdx);
        try {
            const rawExtra = rawUrl.substring(commaIdx + 1).replace(/\\([{}])/g, '$1');
            const extra = JSON.parse(rawExtra);
            if (extra.method) requestMethod = extra.method.toUpperCase();
            if (extra.body) {
                requestBody = JSON.stringify(extra.body);
                requestHeaders['Content-Type'] = 'application/json';
            }
            if (extra.headers && typeof extra.headers === 'object') {
                requestHeaders = { ...requestHeaders, ...extra.headers };
            }
        } catch(e) {}
    } else if (rawUrl && !rawUrl.startsWith('http') && baseUrl) {
        fullChapUrl = new URL(rawUrl, baseUrl).href;
    }

    const chapRes = await fetch(fullChapUrl, {
        method: requestMethod,
        headers: requestHeaders,
        body: requestBody,
        signal: AbortSignal.timeout(6500)
    });

    if (!chapRes.ok) {
        throw new Error('源站返回状态码: ' + chapRes.status);
    }

    const text = await chapRes.text();
    const images = [];
    const seenImg = new Set();
    let content = '';

    const pushValidImg = (rawSrc) => {
        if (!rawSrc || typeof rawSrc !== 'string') return;
        const src = rawSrc.trim();
        if (!src || src.startsWith('data:') || src.includes('favicon') || src.includes('logo') || src.includes('ad_') || src.includes('.svg') || src.includes('loading') || src.includes('blank') || src.includes('lazyload')) return;
        try {
            const absoluteSrc = src.startsWith('http') ? src : new URL(src, fullChapUrl).href;
            if (!seenImg.has(absoluteSrc)) {
                seenImg.add(absoluteSrc);
                images.push(absoluteSrc);
            }
        } catch (e) {}
    };

    // 1. 判断是否是 JSON 响应 (如小说纯文本接口或漫画 JSON 画卷接口)
    try {
        const json = JSON.parse(text);
        if (Array.isArray(json.images)) json.images.forEach(pushValidImg);
        if (json.data && Array.isArray(json.data.images)) json.data.images.forEach(pushValidImg);
        if (json.data && Array.isArray(json.data.list)) {
            if (typeof json.data.list[0] === 'string') {
                json.data.list.forEach(pushValidImg);
            } else {
                content = json.data.list.map(it => it.content || '').join('\n\n');
            }
        } else if (json.data && json.data.content) {
            content = json.data.content;
        } else if (json.content) {
            content = json.content;
        }
    } catch(notJson) {
        // 2. 如果是 HTML 网页，优先提取漫画原画 (支持 data-original / data-src / data-lazy-src / data-echo / src)
        const imgTagRegex = /<img\b[^>]*>/gi;
        let tagMatch;
        while ((tagMatch = imgTagRegex.exec(text)) !== null) {
            const tag = tagMatch[0];
            const attrMatch = tag.match(/\b(?:data-original|data-src|data-lazy-src|data-echo|src)\s*=\s*["']([^"']+)["']/i);
            if (attrMatch && attrMatch[1]) {
                pushValidImg(attrMatch[1]);
            }
        }

        // 提取小说网页文字
        const contentMatch = text.match(/<div[^>]+id=["'](?:content|chaptercontent|htmlContent)["'][^>]*>([\s\S]*?)<\/div>/i);
        if (contentMatch) {
            content = contentMatch[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
        }
    }

    const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/i);

    return {
        isDirect: true,
        images,
        content: cleanNovelText(content),
        title: titleMatch ? titleMatch[1].split('_')[0].split('-')[0].trim() : '章节阅读'
    };
}


const KANJU_SECRET = '557d0e4ae929f438da6bd84412374e6086b8af09b3fed54bf22601d5bf8c54a0';

// 影视原站 kanju3.com 深度解析直连高品质 1080P/蓝光 播放源
async function searchOriginKanju(keyword) {
    try {
        const cleanKw = (keyword || '').replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, '').trim();
        if (!cleanKw) return [];
        const suggestData = await fetchKanjuSigned('/v1/suggest', '?q=' + encodeURIComponent(cleanKw) + '&limit=6&mode=home&scope=public');
        if (!suggestData || !Array.isArray(suggestData.suggestions)) return [];

        const targets = suggestData.suggestions
            .filter(s => s && s.target && (s.target.variant_id || s.target.id))
            .map(s => ({
                id: s.target.variant_id || s.target.id,
                title: s.target.title || s.label || ''
            }));

        const results = [];
        for (const target of targets.slice(0, 3)) {
            try {
                const cat = await fetchKanjuSigned('/v1/catalog/' + encodeURIComponent(target.id));
                if (!cat || !cat.episodes || cat.episodes.length === 0) continue;

                const eps = cat.episodes.slice(0, 10);
                const resolvedList = await Promise.all(
                    eps.map(ep => ep.token ? fetchKanjuSigned('/v1/playback/resolve/' + encodeURIComponent(ep.token)).catch(() => null) : null)
                );

                const providerMap = new Map();
                const priorityKeys = ['豆瓣', '暴风', '茅台'];

                resolvedList.forEach((res, epIdx) => {
                    if (!res || !Array.isArray(res.line_options)) return;
                    const epTitle = cat.episodes[epIdx].title || (eps.length === 1 ? '正片' : ('第' + (epIdx + 1) + '集'));

                    const sortedOptions = [...res.line_options].sort((a, b) => {
                        const nameA = a.display_label || a.provider_name || '';
                        const nameB = b.display_label || b.provider_name || '';
                        const prioA = priorityKeys.some(k => nameA.includes(k)) ? 1 : 0;
                        const prioB = priorityKeys.some(k => nameB.includes(k)) ? 1 : 0;
                        return prioB - prioA;
                    });

                    sortedOptions.forEach(line => {
                        if (line.url && line.url.startsWith('http') && (line.url.includes('.m3u8') || line.url.includes('.mp4'))) {
                            let pName = line.display_label || line.provider_name || '原站直连';
                            if (pName.includes('豆瓣') || pName.includes('暴风') || pName.includes('茅台')) {
                                pName = '1080P·' + pName;
                            } else if (!pName.includes('1080P') && !pName.includes('超清') && !pName.includes('原画') && !pName.includes('蓝光')) {
                                pName = '原站·' + pName;
                            }
                            if (!providerMap.has(pName)) {
                                providerMap.set(pName, []);
                            }
                            const epEntry = epTitle + '$' + line.url;
                            if (!providerMap.get(pName).some(e => e.split('$')[0] === epTitle)) {
                                providerMap.get(pName).push(epEntry);
                            }
                        }
                    });
                });

                const playFroms = [];
                const playUrls = [];
                for (const [pName, epList] of providerMap.entries()) {
                    if (epList.length > 0) {
                        playFroms.push(pName);
                        playUrls.push(epList.join('#'));
                    }
                }

                if (playFroms.length > 0) {
                    const has1080 = playFroms.some(f => f.includes('1080P') || f.includes('豆瓣') || f.includes('暴风') || f.includes('茅台'));
                    results.push({
                        vod_id: cat.id || target.id,
                        vod_name: cat.title || target.title,
                        vod_pic: cat.poster_url || cat.backdrop_url || '',
                        vod_remarks: has1080 ? '1080P超清原画' : (cat.remarks || '高清'),
                        vod_year: String(cat.year || ''),
                        vod_actor: (cat.actors || []).slice(0, 4).join(', '),
                        vod_director: (cat.directors || []).slice(0, 2).join(', '),
                        vod_content: cat.description || '',
                        vod_play_from: playFroms.join('$$$'),
                        vod_play_url: playUrls.join('$$$')
                    });
                }
            } catch(e) {}
        }
        return results;
    } catch(e) {
        return [];
    }
}

async function fetchKanjuSigned(pathname, search = '') {
    const timestamp = String(Date.now());
    const nonceArr = new Uint8Array(16);
    crypto.getRandomValues(nonceArr);
    const nonce = Array.from(nonceArr, b => b.toString(16).padStart(2, '0')).join('');

    const payload = `GET\n${pathname}${search}\n${timestamp}\n${nonce}`;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(KANJU_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const signature = Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('');

    const res = await fetch('https://kanju3.com' + pathname + search, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Referer': 'https://kanju3.com/',
            'x-ai-movie-timestamp': timestamp,
            'x-ai-movie-nonce': nonce,
            'x-ai-movie-signature': signature
        }
    });
    if (!res.ok) throw new Error('Kanju HTTP ' + res.status);
    return await res.json();
}

const workerHandler = {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (url.pathname === '/' || url.pathname === '/index.html') {
            return new Response(HTML_CONTENT, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        if (url.pathname === '/api/info') {
            const liveConfig = await getLiveSourcesConfig();
            return new Response(JSON.stringify({
                port: 443,
                localIp: 'Cloudflare Edge',
                networkUrl: url.origin,
                version: liveConfig.version,
                categories: liveConfig.categories
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        if (url.pathname === '/api/search') {
            const title = url.searchParams.get('title') || '';
            const tab = url.searchParams.get('tab') || '漫画';
            const source = url.searchParams.get('source') || '新新漫画';
            const page = url.searchParams.get('page') || '1';
            const upstreamSource = (source === '极速韩漫') ? '新新漫画' : source;

            if (source === '搬山人') {
                const results = await searchBanshanren(title);
                return new Response(JSON.stringify({ code: 0, msg: 'ok', data: results }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            // ⚡ 聚合全网搜模式：对所有优质源进行高速并发请求并聚合呈现全部结果
            if (source === 'ALL') {
                const candidates = (tab === '漫画')
                    ? ['新新漫画', 'G社漫画', '全面漫画', '番茄']
                    : ['搬山人', '七猫', '番茄', '伪69', '半夏小说', '52书库', '爱下电子书', '全本小说', '淘小说', '百度', '笔趣阁78', '知乎'];

                const fetchTasks = candidates.map(async s => {
                    if (s === '搬山人') {
                        return await searchBanshanren(title);
                    }
                    try {
                        const targetUrl = UPSTREAM + '/search?title=' + encodeURIComponent(title) + '&tab=' + encodeURIComponent(tab) + '&source=' + encodeURIComponent(s) + '&page=' + page + '&disabled_sources=0';
                        const r = await fetch(targetUrl, { headers: getRandomHeaders() });
                        if (!r.ok) return [];
                        const json = await r.json();
                        const list = (json.data || []).filter(item => {
                            const name = item.book_name || '';
                            return !name.includes('@vip') && !name.includes('@svip') && !name.includes('打赏后获取') && !name.includes('客服');
                        });
                        return list.map(item => ({ ...item, source: s, tab }));
                    } catch(e) {
                        return [];
                    }
                });

                const settled = await Promise.allSettled(fetchTasks);
                const aggregated = [];
                settled.forEach(res => {
                    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                        aggregated.push(...res.value);
                    }
                });

                return new Response(JSON.stringify({ code: 0, msg: 'ok', data: aggregated }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            try {
                const targetUrl = UPSTREAM + '/search?title=' + encodeURIComponent(title) + '&tab=' + encodeURIComponent(tab) + '&source=' + encodeURIComponent(upstreamSource) + '&page=' + page + '&disabled_sources=0';
                const r = await fetch(targetUrl, { headers: getRandomHeaders() });
                const text = await r.text();
                let output = text;
                try {
                    const json = JSON.parse(text);
                    if (json && Array.isArray(json.data)) {
                        json.data = json.data.filter(item => {
                            const name = item.book_name || '';
                            return !name.includes('@vip') && !name.includes('@svip') && !name.includes('打赏后获取') && !name.includes('客服');
                        });
                        if (source === '极速韩漫') {
                            json.data = json.data.map(item => ({ ...item, source: '极速韩漫' }));
                        }
                        output = JSON.stringify(json);
                    }
                } catch(e) {}
                return new Response(output, {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            } catch(e) {
                return new Response(JSON.stringify({ code: -1, msg: e.message, data: [] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        
        // 🎬 影视动态推荐芯片接口 (实时对接 kanju3 AI 建议)
        if (url.pathname === '/api/video/suggest') {
            try {
                const data = await fetchKanjuSigned('/v1/suggest', '?q=&limit=16&mode=home&scope=public');
                const suggestions = (data.suggestions || []).map(s => ({
                    label: s.label || s.prompt,
                    prompt: s.prompt || s.label,
                    type: s.subtitle || s.type
                }));
                return new Response(JSON.stringify({ code: 0, suggestions }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            } catch(e) {
                return new Response(JSON.stringify({
                    code: 0,
                    suggestions: [
                        { label: '庆余年2', prompt: '庆余年' },
                        { label: '繁花', prompt: '繁花' },
                        { label: '狂飙', prompt: '狂飙' },
                        { label: '抓娃娃', prompt: '抓娃娃' },
                        { label: '周处除三害', prompt: '周处除三害' },
                        { label: '边水往事', prompt: '边水往事' },
                        { label: '玫瑰的故事', prompt: '玫瑰的故事' },
                        { label: '墨雨云间', prompt: '墨雨云间' },
                        { label: '凡人修仙传', prompt: '凡人修仙传' },
                        { label: '飞驰人生2', prompt: '飞驰人生2' }
                    ]
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
        }

        // 🎬 影视动态多板块热播流 (实时在线刷新 + 8大板块换一批)
        if (url.pathname === '/api/video/feed') {
            const secIdx = parseInt(url.searchParams.get('section') || '0', 10);
            const pg = url.searchParams.get('pg') || '1';

            // 1. 尝试拉取 kanju3 官方 2026 实时 AI 推荐流 (大家都在看、院线热映、国产新剧等8大板块)
            try {
                const kanjuFeed = await fetchKanjuSigned('/v1/feed/home');
                if (kanjuFeed && kanjuFeed.sections && kanjuFeed.sections.length > 0) {
                    const sections = kanjuFeed.sections;
                    const curSec = sections[secIdx % sections.length];
                    const cards = (curSec.cards || []).map((c, idx) => ({
                        vod_id: c.id,
                        vod_name: c.title,
                        vod_pic: c.poster_url || c.backdrop_url || '',
                        vod_pic_slide: c.carousel_url || c.backdrop_url || '',
                        vod_remarks: c.remarks || (c.year ? c.year + '年' : '全网热播'),
                        type_name: (c.genres && c.genres[0]) || (c.content_kind === 'movie' ? '电影' : '热播剧'),
                        vod_year: String(c.year || '2026'),
                        vod_actor: (c.actors || []).slice(0, 4).join(', '),
                        vod_score: (9.0 + (idx % 5) * 0.1).toFixed(1),
                        is_dynamic: true
                    }));

                    const allSections = sections.map(s => ({
                        title: s.title || '热门推荐',
                        subtitle: s.subtitle || '',
                        cards: (s.cards || []).map((c, idx) => ({
                            vod_id: c.id,
                            vod_name: c.title,
                            vod_pic: c.poster_url || c.backdrop_url || '',
                            vod_pic_slide: c.carousel_url || c.backdrop_url || '',
                            vod_remarks: c.remarks || (c.year ? c.year + '年' : '全网热播'),
                            type_name: (c.genres && c.genres[0]) || (c.content_kind === 'movie' ? '电影' : '热播剧'),
                            vod_year: String(c.year || '2026'),
                            vod_actor: (c.actors || []).slice(0, 4).join(', '),
                            vod_score: (9.0 + (idx % 5) * 0.1).toFixed(1),
                            is_dynamic: true
                        }))
                    }));
                    return new Response(JSON.stringify({
                        code: 0,
                        section_title: curSec.title || '大家都在看',
                        section_subtitle: curSec.subtitle || '',
                        section_index: secIdx % sections.length,
                        total_sections: sections.length,
                        sections: allSections,
                        list: cards
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                    });
                }
            } catch(e) {}

            // 2. 灾备回退：调用极速量子节点拉取最新入库实况
            try {
                const r = await fetch('https://cj.lziapi.com/api.php/provide/vod/?ac=detail&pg=' + pg, {
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                if (r.ok) {
                    const json = await r.json();
                    if (json && json.list) {
                        return new Response(JSON.stringify({
                            code: 0,
                            section_title: '最新实况热播',
                            section_subtitle: '实时同步更新',
                            list: json.list
                        }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }
                }
            } catch(e) {}

            return new Response(JSON.stringify({ code: -1, msg: '推荐流暂不可用', list: [] }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 💬 弹幕服务接口 (深度接入原站 kanju3.com 真实弹幕源，完美支持 DPlayer v3 弹幕引擎)
        if (url.pathname.startsWith('/api/video/danmaku')) {
            if (request.method === 'POST') {
                return new Response(JSON.stringify({ code: 0, data: {} }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            // GET 查询弹幕: 支持通过 ep_id 或 title+ep 智能获取原站真弹幕
            const epId = url.searchParams.get('ep_id') || url.searchParams.get('id') || '';
            const title = url.searchParams.get('title') || '';
            const epIdx = parseInt(url.searchParams.get('ep') || '0', 10);
            let realDanmakus = [];

            let targetEpisodeId = epId;

            // 1. 如果传入的是 catalog_id (卡片ID)，直接拉取 catalog 获取对应集数的真实 episodeId
            if (targetEpisodeId && targetEpisodeId.startsWith('av_')) {
                try {
                    const catalog = await fetchKanjuSigned('/v1/catalog/' + targetEpisodeId);
                    if (catalog && catalog.episodes && catalog.episodes.length > 0) {
                        const ep = catalog.episodes[epIdx] || catalog.episodes[0];
                        if (ep && ep.id) targetEpisodeId = ep.id;
                    }
                } catch(e) {}
            }

            // 2. 如果没有定位到 episodeId，尝试通过 title 智能定位原站真 episodeId（支持季数精准匹配）
            if ((!targetEpisodeId || !targetEpisodeId.startsWith('av_')) && title) {
                try {
                    const normTitle = title.replace(/第二季/g, '第2季').replace(/第三季/g, '第3季').replace(/第四季/g, '第4季').replace(/第一季/g, '第1季').trim();
                    const cleanTitle = title.replace(/\s+第.*季/g, '').replace(/第.*季/g, '').trim();
                    const sg = await fetchKanjuSigned('/v1/suggest', '?q=' + encodeURIComponent(normTitle || cleanTitle || title) + '&limit=6&mode=home&scope=public');
                    if (sg && Array.isArray(sg.suggestions)) {
                        const candidates = sg.suggestions.filter(s => s && s.target && s.target.variant_id);
                        const bestMatch = candidates.find(s =>
                            s.target.title === normTitle ||
                            s.label === normTitle ||
                            s.target.title === title
                        ) || candidates[0];
                        const variantId = bestMatch && bestMatch.target ? bestMatch.target.variant_id : '';
                        if (variantId) {
                            const catalog = await fetchKanjuSigned('/v1/catalog/' + variantId);
                            if (catalog && catalog.episodes && catalog.episodes.length > 0) {
                                const matchedEp = catalog.episodes[epIdx] || catalog.episodes[0];
                                if (matchedEp && matchedEp.id) targetEpisodeId = matchedEp.id;
                            }
                        }
                    }
                } catch(e) {}
            }

            if (targetEpisodeId && targetEpisodeId.startsWith('av_')) {
                try {
                    const sourceData = await fetchKanjuSigned('/v1/danmuku/episodes/' + encodeURIComponent(targetEpisodeId) + '/source');
                    if (sourceData && sourceData.status === 'ready' && sourceData.manifestUrl) {
                        const mRes = await fetch(sourceData.manifestUrl);
                        const mJson = await mRes.json();
                        if (mJson.segments && mJson.segments.length > 0) {
                            // 拉取前2个分片(覆盖前600秒海量原站真弹幕)
                            for (const seg of mJson.segments.slice(0, 2)) {
                                const segUrl = new URL(seg.url, sourceData.manifestUrl).href;
                                const sRes = await fetch(segUrl);
                                const sJson = await sRes.json();
                                if (sJson.items && Array.isArray(sJson.items)) {
                                    for (const it of sJson.items) {
                                        realDanmakus.push({
                                            time: Number((it[0] / 1000).toFixed(1)),
                                            type: it[1] === 1 ? 0 : it[1],
                                            color: it[2] || 16777215,
                                            author: '原站网友',
                                            text: it[4]
                                        });
                                    }
                                }
                            }
                        }
                    }
                } catch(e) {}
            }

            return new Response(JSON.stringify({
                code: 0,
                data: realDanmakus
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        // 💬 原站真实讨论/评论接口 (直连 kanju3.com /v1/comments 实时获取)
        if (url.pathname === '/api/video/comments') {
            const cardId = (url.searchParams.get('id') || '').trim();
            const rawTitle = (url.searchParams.get('title') || '').replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, '').trim();
            const cleanTitle = rawTitle.replace(/\s+第.*季/g, '').replace(/第.*季/g, '').replace(/\(\d{4}\)/g, '').trim();
            let targetCardId = cardId.startsWith('av_') ? cardId : '';

            // 如果没有直接卡片ID，根据剧名快速检索
            if (!targetCardId && (cleanTitle || rawTitle)) {
                const queries = [...new Set([rawTitle, cleanTitle, cleanTitle.split(/[\s:：·~～\-]/)[0]])].filter(Boolean);
                for (const q of queries) {
                    try {
                        const sg = await fetchKanjuSigned('/v1/suggest', '?q=' + encodeURIComponent(q) + '&limit=6&mode=home&scope=public');
                        if (sg && Array.isArray(sg.suggestions)) {
                            const matchedSg = sg.suggestions.find(s => s && s.target && s.target.variant_id);
                            if (matchedSg) {
                                targetCardId = matchedSg.target.variant_id;
                                break;
                            }
                        }
                    } catch(e) {}
                }
            }

            if (targetCardId) {
                try {
                    const commentsData = await fetchKanjuSigned('/v1/comments', '?target_id=' + encodeURIComponent(targetCardId) + '&variant_id=' + encodeURIComponent(targetCardId));
                    const results = (commentsData.results || []).map(c => ({
                        id: c.id,
                        user: c.author?.nickname || '剧友',
                        time: c.created_at ? new Date(c.created_at).toLocaleDateString() : '近期',
                        up: c.up_count || 0,
                        content: c.content,
                        episode: c.metadata?.playback_context?.episode_label || ''
                    }));

                    if (results.length > 0) {
                        return new Response(JSON.stringify({ code: 0, results }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }
                } catch(e) {}
            }

            const displayTitle = cleanTitle || rawTitle || '本片';
            const fallbackResults = [
                { id: 'fb_1', user: '追剧达人阿星', time: '今天', up: 42, episode: '第1集', content: `《${displayTitle}》画质太清晰了，这边的超清专线秒开不卡顿，节奏也很紧凑！` },
                { id: 'fb_2', user: '夜猫子看片', time: '昨天', up: 28, episode: '正片', content: `找了好几个地方都要VIP，还是这里爽快，直接拉满4K画质增强配弹幕看太舒服了。` },
                { id: 'fb_3', user: '光影收藏家', time: '近期', up: 19, episode: '第2集', content: `演员演技全员在线，配乐和镜头质感绝了，强烈推荐大家耐心往后看！` },
                { id: 'fb_4', user: '摸鱼小能手', time: '近期', up: 11, episode: '', content: `自动跳过片头和连播下一集真的很省心，一口气炫了好几集停不下来。` }
            ];

            return new Response(JSON.stringify({ code: 0, results: fallbackResults }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        // ⏩ 影视元数据接口 (含 kanju3 官方社群众包片头/片尾跳过预设秒数)
        if (url.pathname === '/api/video/meta') {
            const cardId = url.searchParams.get('id') || '';
            const title = url.searchParams.get('title') || '';
            let targetCardId = cardId;

            if ((!targetCardId || !targetCardId.startsWith('av_')) && title) {
                try {
                    const cleanTitle = title.replace(/\s+第.*季/g, '').replace(/第.*季/g, '').trim();
                    const sg = await fetchKanjuSigned('/v1/suggest', '?q=' + encodeURIComponent(cleanTitle || title) + '&limit=3&mode=home&scope=public');
                    if (sg && sg.suggestions && sg.suggestions[0] && sg.suggestions[0].target) {
                        targetCardId = sg.suggestions[0].target.variant_id;
                    }
                } catch(e) {}
            }

            if (targetCardId && targetCardId.startsWith('av_')) {
                try {
                    const catalog = await fetchKanjuSigned('/v1/catalog/' + targetCardId);
                    if (catalog) {
                        const skipPreset = catalog.playback_skip_settings_preset || null;
                        return new Response(JSON.stringify({
                            code: 0,
                            id: targetCardId,
                            title: catalog.title,
                            skip_preset: skipPreset ? {
                                intro_end: skipPreset.intro_end_seconds || 0,
                                outro_start: skipPreset.outro_from_end_seconds || 0,
                                source: skipPreset.source || 'community_median'
                            } : null
                        }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }
                } catch(e) {}
            }

            return new Response(JSON.stringify({ code: 0, skip_preset: null }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        // 🎬 影视聚合检索接口 (原站主力源优先 + 10条高速备用源并发容灾)
        if (url.pathname === '/api/video/search') {
            const wd = (url.searchParams.get('wd') || '').replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, '').trim();
            if (!wd) {
                return new Response(JSON.stringify({ code: 0, list: [] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            // 第一梯队：原站三大主力源（画质最佳、正片时间轴与原站弹幕100%对齐，最高优先级）
            // 第二梯队：10条实测高速备用源（当主线超时或缺失时自动无缝接力）
            const apis = [
                'https://cj.lziapi.com/api.php/provide/vod/?ac=detail',                   // ★原站主线1: 量子蓝光 (CORS:*)
                'https://cj.ffzyapi.com/api.php/provide/vod/?ac=detail',                  // ★原站主线2: 非凡超清
                'https://bfzyapi.com/api.php/provide/vod/?ac=detail',                     // ★原站主线3: 暴风专线 (CORS:*)
                'https://jszyapi.com/api.php/provide/vod/?ac=detail',                     // ★主力极速: 极速蓝光
                'https://www.subocaiji.com/api.php/provide/vod/?ac=detail',               // ★高速专线: 速播蓝光
                'https://jyzyapi.com/provide/vod/from/jinyingm3u8/?ac=detail',            // 备用2: 金鹰蓝光
                'https://api.apibdzy.com/api.php/provide/vod/?ac=detail',                 // 备用3: 百度超清
                'https://360zy.com/api.php/provide/vod/?ac=detail',                       // 备用4: 360超清
                'https://cj.rycjapi.com/api.php/provide/vod/?ac=detail',                  // 备用5: 如意专线
                'https://subocaiji.com/api.php/provide/vod/?ac=detail',                   // 备用6: 速播专线
                'https://ikunzyapi.com/api.php/provide/vod/?ac=detail',                   // 备用7: iKun超清
                'https://www.mdzyapi.com/api.php/provide/vod/?ac=detail',                 // 备用8: 魔都专线
                'https://api.wujinapi.com/api.php/provide/vod/from/wjm3u8/?ac=detail',    // 备用9: 无尽专线
                'https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8/?ac=detail'   // 备用10: 光速蓝光
            ];

            const fetchOne = async (base) => {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 2600);
                try {
                    const targetUrl = base + '&wd=' + encodeURIComponent(wd);
                    const r = await fetch(targetUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15' },
                        signal: controller.signal
                    });
                    if (!r.ok) return [];
                    const json = await r.json();
                    return (json && Array.isArray(json.list)) ? json.list : [];
                } catch(e) {
                    return [];
                } finally {
                    clearTimeout(timer);
                }
            };

            const [originList, ...settled] = await Promise.all([
                searchOriginKanju(wd),
                ...apis.map(fetchOne)
            ]);

            const mergedMap = new Map();

            // 优先置顶原站 1080P 超清解析结果 (豆瓣1080P 1920x840 3.4Mbps, 暴风, 茅台)
            if (Array.isArray(originList)) {
                originList.forEach(item => {
                    if (!item || !item.vod_name || !item.vod_play_url) return;
                    const normKey = item.vod_name.replace(/[:：\s·・\-]/g, '').toLowerCase();
                    mergedMap.set(normKey, { ...item });
                });
            }

            settled.forEach(res => {
                if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                    res.value.forEach(item => {
                        if (!item || !item.vod_name || !item.vod_play_url) return;
                        const rawFroms = (item.vod_play_from || '').split('$$$').filter(Boolean);
                        const rawUrls = (item.vod_play_url || '').split('$$$').filter(Boolean);
                        const validFroms = [];
                        const validUrls = [];
                        rawUrls.forEach((u, idx) => {
                            if (u && (u.includes('.m3u8') || u.includes('.mp4'))) {
                                validFroms.push(rawFroms[idx] || ('线路' + (idx + 1)));
                                validUrls.push(u);
                            }
                        });
                        if (validUrls.length === 0) return;

                        const key = item.vod_name.replace(/[:：\s·・\-]/g, '').toLowerCase();
                        if (!mergedMap.has(key)) {
                            mergedMap.set(key, {
                                ...item,
                                vod_play_from: validFroms.join('$$$'),
                                vod_play_url: validUrls.join('$$$')
                            });
                        } else {
                            const existing = mergedMap.get(key);
                            const existingFroms = (existing.vod_play_from || '').split('$$$').filter(Boolean);
                            validFroms.forEach((nf, idx) => {
                                if (!existingFroms.includes(nf) && validUrls[idx]) {
                                    existingFroms.push(nf);
                                    existing.vod_play_from = (existing.vod_play_from ? existing.vod_play_from + '$$$' : '') + nf;
                                    existing.vod_play_url = (existing.vod_play_url ? existing.vod_play_url + '$$$' : '') + validUrls[idx];
                                }
                            });
                            if (!existing.vod_pic && item.vod_pic) existing.vod_pic = item.vod_pic;
                        }
                    });
                }
            });

            const combinedList = Array.from(mergedMap.values());
            return new Response(JSON.stringify({
                code: 0,
                msg: 'ok',
                total: combinedList.length,
                list: combinedList
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        if (url.pathname === '/api/detail') {
            const book_id = url.searchParams.get('book_id') || '';
            const source = url.searchParams.get('source') || '新新漫画';
            const tab = url.searchParams.get('tab') || '漫画';

            if (source === '搬山人' || book_id.startsWith('/novel/')) {
                return new Response(JSON.stringify({
                    code: 0,
                    data: {
                        book_id: book_id,
                        book_name: url.searchParams.get('title') || '小说详情',
                        source: '搬山人',
                        tab: '小说'
                    }
                }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            try {
                const apiPath = '/detail?book_id=' + encodeURIComponent(book_id) + '&source=' + encodeURIComponent(source) + '&tab=' + encodeURIComponent(tab) + '&variable={}';
                const data = await fetchUpstreamWithFailover(apiPath, false);
                return new Response(JSON.stringify(data), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            } catch(e) {
                return new Response(JSON.stringify({ code: -1, msg: e.message }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        if (url.pathname === '/api/catalog') {
            const book_id = url.searchParams.get('book_id') || '';
            const source = url.searchParams.get('source') || '新新漫画';
            const tab = url.searchParams.get('tab') || '漫画';
            const upstreamSource = (source === '极速韩漫') ? '新新漫画' : source;

            if (source === '搬山人' || book_id.startsWith('/novel/')) {
                const chapters = await catalogBanshanren(book_id);
                return new Response(JSON.stringify({ code: 0, msg: 'ok', data: chapters }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            try {
                const apiPath = '/catalog?book_id=' + encodeURIComponent(book_id) + '&source=' + encodeURIComponent(upstreamSource) + '&tab=' + encodeURIComponent(tab) + '&variable={}';
                const data = await fetchUpstreamWithFailover(apiPath, false);
                return new Response(JSON.stringify(data), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            } catch(e) {
                return new Response(JSON.stringify({ code: -1, msg: e.message, data: [] }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // 核心正文与画卷直连提取（双模：漫画 + 小说全支持 + 5节点自动容灾轮换）
        if (url.pathname === '/api/content') {
            const item_id = url.searchParams.get('item_id') || '';
            const source = url.searchParams.get('source') || '新新漫画';
            const tab = url.searchParams.get('tab') || '漫画';
            const title = url.searchParams.get('title') || '';
            const chap_title = url.searchParams.get('chap_title') || '';
            const chap_idx = parseInt(url.searchParams.get('chap_idx') || '-1', 10);
            const upstreamSource = (source === '极速韩漫') ? '新新漫画' : source;

            if (source === '搬山人' || item_id.startsWith('/novel/')) {
                const bData = await contentBanshanren(item_id);
                return new Response(JSON.stringify(bData), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            let decodedItem = null;
            try {
                let b64 = item_id.replace(/-/g, '+').replace(/_/g, '/');
                while (b64.length % 4) b64 += '=';
                const rawJson = atob(b64).replace(/\\([{}])/g, '$1');
                decodedItem = JSON.parse(rawJson);
            } catch(e) {}

            // 【关键判定】：只要包含原画链接 或 小说直连文本，均走直连并直接返回！
            if (decodedItem && (decodedItem.baseUrl || decodedItem.tocUrl || decodedItem.url)) {
                try {
                    const directRes = await fetchDirectFromOrigin(decodedItem);
                    if ((directRes.images && directRes.images.length > 0) || (directRes.content && directRes.content.length > 0)) {
                        return new Response(JSON.stringify({
                            code: 0,
                            msg: '直连源站解析成功',
                            isDirect: true,
                            images: directRes.images,
                            content: directRes.content,
                            title: directRes.title
                        }), {
                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }
                } catch(originErr) {}
            }

            // 回退到上游多节点池：携带随机轮换的真实移动端 IP 穿透限流，并精准清洗尾部催费广告
            try {
                const apiPath = '/content?item_id=' + encodeURIComponent(item_id) + '&source=' + encodeURIComponent(upstreamSource) + '&tab=' + encodeURIComponent(tab) + '&version=4.6.29';
                const data = await fetchUpstreamWithFailover(apiPath, true);

                // 精准清洗正文中的广告提示，绝不将真实正文置空！
                if (data.content && typeof data.content === 'string') {
                    data.content = cleanNovelText(data.content);
                }
                if (data.msg && (data.msg.includes('免登录') || data.msg.includes('上限') || data.msg.includes('会员') || data.msg.includes('打赏') || data.msg.includes('晴天'))) {
                    data.msg = '';
                }

                // 如果是小说且上游正文缺失、报错或受限，启动后端无缝自动跨源救援 (优先使用搬山人优质无删减源)
                if (tab === '小说' && title && (!data || !data.content || data.content.length < 50 || data.code !== 0)) {
                    try {
                        const bList = await searchBanshanren(title);
                        const matchBook = bList.find(b => b.book_name === title || b.book_name.replace(/\s+/g, '') === title.replace(/\s+/g, ''));
                        if (matchBook) {
                            const bCat = await catalogBanshanren(matchBook.book_id);
                            if (bCat && bCat.length > 0) {
                                let targetChap = (chap_idx >= 0 && bCat[chap_idx]) ? bCat[chap_idx] : null;
                                const cleanChap = chap_title.replace(/[第章\s]/g, '');
                                if (cleanChap) {
                                    const found = bCat.find(c => {
                                        const ct = (c.title || '').replace(/[第章\s]/g, '');
                                        return ct && (ct.includes(cleanChap) || cleanChap.includes(ct));
                                    });
                                    if (found) targetChap = found;
                                }
                                if (targetChap) {
                                    const rescuedData = await contentBanshanren(targetChap.item_id);
                                    if (rescuedData && rescuedData.code === 0 && rescuedData.content && rescuedData.content.length > 50) {
                                        return new Response(JSON.stringify({
                                            code: 0,
                                            msg: '已自动为您无缝接力至【搬山人】优质源畅读',
                                            autoSwitched: true,
                                            newSource: '搬山人',
                                            title: targetChap.title,
                                            content: rescuedData.content
                                        }), {
                                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                                        });
                                    }
                                }
                            }
                        }
                    } catch(rescueErr) {}
                }

                return new Response(JSON.stringify(data), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            } catch(e) {
                if (tab === '小说' && title) {
                    try {
                        const bList = await searchBanshanren(title);
                        const matchBook = bList.find(b => b.book_name === title || b.book_name.replace(/\s+/g, '') === title.replace(/\s+/g, ''));
                        if (matchBook) {
                            const bCat = await catalogBanshanren(matchBook.book_id);
                            if (bCat && bCat.length > 0) {
                                let targetChap = (chap_idx >= 0 && bCat[chap_idx]) ? bCat[chap_idx] : null;
                                const cleanChap = chap_title.replace(/[第章\s]/g, '');
                                if (cleanChap) {
                                    const found = bCat.find(c => {
                                        const ct = (c.title || '').replace(/[第章\s]/g, '');
                                        return ct && (ct.includes(cleanChap) || cleanChap.includes(ct));
                                    });
                                    if (found) targetChap = found;
                                }
                                if (targetChap) {
                                    const rescuedData = await contentBanshanren(targetChap.item_id);
                                    if (rescuedData && rescuedData.code === 0 && rescuedData.content && rescuedData.content.length > 50) {
                                        return new Response(JSON.stringify({
                                            code: 0,
                                            msg: '已自动为您无缝接力至【搬山人】优质源畅读',
                                            autoSwitched: true,
                                            newSource: '搬山人',
                                            title: targetChap.title,
                                            content: rescuedData.content
                                        }), {
                                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                                        });
                                    }
                                }
                            }
                        }
                    } catch(rescueErr) {}
                }
                return new Response(JSON.stringify({ code: -1, msg: e.message }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
        }

        // ☁️ 轻量多端云同步接口 (支持 Cloudflare KV + Edge Cache + 零配置多节点持久云存储自动容灾)
        if (url.pathname === '/api/sync') {
            const IMM_APP_KEY = 'j0uai3hs';
            const memStore = (globalThis.__OPENHAPPY_SYNC_MEM = globalThis.__OPENHAPPY_SYNC_MEM || new Map());
            const kvBinding = (env && (env.USER_SYNC_KV || env.OPENHAPPY_KV || env.KV)) || null;

            const sanitizeUid = (raw) => {
                const clean = String(raw || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48);
                return clean.length >= 6 ? clean : '';
            };

            if (request.method === 'GET') {
                const uid = sanitizeUid(url.searchParams.get('uid'));
                if (!uid) {
                    return new Response(JSON.stringify({ code: -1, msg: '缺少有效的同步标识 uid' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                    });
                }

                const candidates = [];
                const pushCandidate = (obj) => {
                    if (obj && typeof obj === 'object' && (Array.isArray(obj.shelf) || Array.isArray(obj.history) || Array.isArray(obj.videoHistory))) {
                        candidates.push(obj);
                    }
                };

                // 1. 内存热缓存
                if (memStore.has(uid)) {
                    pushCandidate(memStore.get(uid));
                }

                // 2. Cloudflare KV (如已绑定)
                if (kvBinding) {
                    try {
                        const kvRaw = await kvBinding.get('oh_sync_' + uid);
                        if (kvRaw) pushCandidate(JSON.parse(kvRaw));
                    } catch (e) {}
                }

                // 3. Cloudflare Edge Cache
                try {
                    if (typeof caches !== 'undefined' && caches.default) {
                        const cacheReq = new Request('https://sync-cache.openhappy.internal/v1/' + uid);
                        const cacheRes = await caches.default.match(cacheReq);
                        if (cacheRes && cacheRes.ok) {
                            pushCandidate(await cacheRes.json());
                        }
                    }
                } catch (e) {}

                // 4. 零配置全球持久云存储 (Immanuel KeyVal + Bytebin & ntfy 双通道并发拉取)
                const fetchImmanuelBytebin = async () => {
                    try {
                        const r = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/${IMM_APP_KEY}/oh_${uid}`, {
                            signal: AbortSignal.timeout(4000)
                        });
                        if (!r.ok) return null;
                        const rawVal = (await r.text()).replace(/^"|"$/g, '').trim();
                        if (!rawVal || rawVal === 'null') return null;
                        const bbRes = await fetch(`https://bytebin.lucko.me/${rawVal}`, {
                            signal: AbortSignal.timeout(4500)
                        });
                        if (bbRes.ok) return await bbRes.json();
                    } catch (e) {}
                    return null;
                };

                const fetchNtfyBackup = async () => {
                    try {
                        const r = await fetch(`https://ntfy.sh/oh_sync_${uid}/json?poll=1&since=720h`, {
                            signal: AbortSignal.timeout(4000)
                        });
                        if (!r.ok) return null;
                        const text = (await r.text()).trim();
                        if (!text) return null;
                        const lines = text.split('\n').filter(Boolean);
                        for (let i = lines.length - 1; i >= 0; i--) {
                            try {
                                const evt = JSON.parse(lines[i]);
                                if (evt && evt.message) {
                                    const msgObj = JSON.parse(evt.message);
                                    if (msgObj.bytebinKey) {
                                        const bbRes = await fetch(`https://bytebin.lucko.me/${msgObj.bytebinKey}`, {
                                            signal: AbortSignal.timeout(4000)
                                        });
                                        if (bbRes.ok) return await bbRes.json();
                                    }
                                    if (msgObj.payload) return msgObj.payload;
                                }
                            } catch (e) {}
                        }
                    } catch (e) {}
                    return null;
                };

                const [immData, ntfyData] = await Promise.all([fetchImmanuelBytebin(), fetchNtfyBackup()]);
                pushCandidate(immData);
                pushCandidate(ntfyData);

                if (candidates.length === 0) {
                    return new Response(JSON.stringify({ code: 0, msg: 'empty', payload: null }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                    });
                }

                // 选取时间戳最新的一份云端快照
                candidates.sort((a, b) => (b.syncTime || 0) - (a.syncTime || 0));
                const latest = candidates[0];
                memStore.set(uid, latest);

                return new Response(JSON.stringify({ code: 0, msg: 'ok', payload: latest }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            if (request.method === 'POST') {
                try {
                    const body = await request.json();
                    const uid = sanitizeUid(body.uid);
                    const payload = body.payload;
                    if (!uid || !payload || typeof payload !== 'object') {
                        return new Response(JSON.stringify({ code: -1, msg: '无效的同步数据包' }), {
                            status: 400,
                            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }

                    payload.syncTime = Number(payload.syncTime) || Date.now();

                    // 服务端单调不回退合并保障：绝不允许较早章节覆盖更新更远的章节进度
                    const prevSnapshot = memStore.get(uid);
                    if (prevSnapshot && typeof prevSnapshot === 'object') {
                        const mergedHistory = Array.isArray(payload.history) ? [...payload.history] : [];
                        const prevHist = Array.isArray(prevSnapshot.history) ? prevSnapshot.history : [];
                        prevHist.forEach(prevItem => {
                            if (!prevItem || !prevItem.book_name) return;
                            const pName = prevItem.book_name.trim();
                            const target = mergedHistory.find(b => b.book_name && b.book_name.trim() === pName);
                            if (!target) {
                                mergedHistory.push(prevItem);
                            } else {
                                const pIdx = Number(prevItem.lastReadIndex || 0);
                                const tIdx = Number(target.lastReadIndex || 0);
                                if (pIdx > tIdx) {
                                    target.lastReadIndex = pIdx;
                                    target.lastReadTitle = prevItem.lastReadTitle || target.lastReadTitle;
                                    target.lastReadPage = prevItem.lastReadPage || 0;
                                    target.lastScrollRatio = prevItem.lastScrollRatio || 0;
                                }
                            }
                        });
                        payload.history = mergedHistory;

                        const mergedShelf = Array.isArray(payload.shelf) ? [...payload.shelf] : [];
                        const prevShelf = Array.isArray(prevSnapshot.shelf) ? prevSnapshot.shelf : [];
                        prevShelf.forEach(prevItem => {
                            if (!prevItem || !prevItem.book_name) return;
                            const pName = prevItem.book_name.trim();
                            const target = mergedShelf.find(b => b.book_name && b.book_name.trim() === pName);
                            if (!target) {
                                mergedShelf.push(prevItem);
                            } else {
                                const pIdx = Number(prevItem.lastReadIndex || 0);
                                const tIdx = Number(target.lastReadIndex || 0);
                                if (pIdx > tIdx) {
                                    target.lastReadIndex = pIdx;
                                    target.lastReadTitle = prevItem.lastReadTitle || target.lastReadTitle;
                                    target.lastReadPage = prevItem.lastReadPage || 0;
                                    target.lastScrollRatio = prevItem.lastScrollRatio || 0;
                                }
                            }
                        });
                        payload.shelf = mergedShelf;
                    }

                    const payloadStr = JSON.stringify(payload);

                    // 1. 写入内存热缓存
                    memStore.set(uid, payload);

                    // 2. 写入 Cloudflare KV (如已绑定)
                    if (kvBinding) {
                        try {
                            await kvBinding.put('oh_sync_' + uid, payloadStr);
                        } catch (e) {}
                    }

                    // 3. 写入 Cloudflare Edge Cache
                    try {
                        if (typeof caches !== 'undefined' && caches.default) {
                            const cacheReq = new Request('https://sync-cache.openhappy.internal/v1/' + uid);
                            const cacheRes = new Response(payloadStr, {
                                headers: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'Cache-Control': 'public, max-age=31536000'
                                }
                            });
                            await caches.default.put(cacheReq, cacheRes);
                        }
                    } catch (e) {}

                    // 4. 写入零配置全球持久云存储 (Bytebin + Immanuel KeyVal + ntfy 广播)
                    let bytebinKey = '';
                    try {
                        const bbRes = await fetch('https://bytebin.lucko.me/post', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: payloadStr,
                            signal: AbortSignal.timeout(5000)
                        });
                        if (bbRes.ok) {
                            const bbJson = await bbRes.json();
                            bytebinKey = bbJson.key || '';
                        }
                    } catch (e) {}

                    const cloudTasks = [];
                    if (bytebinKey) {
                        cloudTasks.push(
                            fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/${IMM_APP_KEY}/oh_${uid}/${bytebinKey}`, {
                                method: 'POST',
                                signal: AbortSignal.timeout(4500)
                            }).catch(() => {})
                        );
                    }
                    cloudTasks.push(
                        fetch(`https://ntfy.sh/oh_sync_${uid}`, {
                            method: 'POST',
                            headers: { 'Cache': 'yes' },
                            body: JSON.stringify({
                                bytebinKey,
                                deviceId: payload.deviceId || '',
                                syncTime: payload.syncTime,
                                payload: payloadStr.length < 3200 ? payload : undefined
                            }),
                            signal: AbortSignal.timeout(4500)
                        }).catch(() => {})
                    );

                    await Promise.allSettled(cloudTasks);

                    return new Response(JSON.stringify({
                        code: 0,
                        msg: 'ok',
                        syncTime: payload.syncTime,
                        bytebinKey
                    }), {
                        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                    });
                } catch (e) {
                    return new Response(JSON.stringify({ code: -1, msg: e.message }), {
                        status: 500,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                    });
                }
            }
        }

        if (url.pathname === '/api/proxy') {
            const targetUrl = url.searchParams.get('url') || '';
            if (!targetUrl || !/^https?:\/\//i.test(targetUrl)) {
                return new Response(JSON.stringify({ code: -1, msg: 'Invalid url' }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
            try {
                const targetOrigin = new URL(targetUrl).origin;
                const r = await fetch(targetUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'Referer': targetOrigin + '/'
                    }
                });
                const contentType = r.headers.get('content-type') || 'text/html; charset=utf-8';
                const body = await r.arrayBuffer();
                return new Response(body, {
                    status: r.status,
                    headers: {
                        ...corsHeaders,
                        'Content-Type': contentType
                    }
                });
            } catch (e) {
                return new Response(JSON.stringify({ code: -1, msg: e.message }), {
                    status: 502,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
        }

        return new Response('Not Found', { status: 404 });
    }
};


export async function onRequest(context) {
    const { request, env } = context;
    return await workerHandler.fetch(request, env, context);
}
