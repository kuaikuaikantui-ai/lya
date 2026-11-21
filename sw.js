/* =====================================================================
 * Lya 应用壳 Service Worker (sw.js)
 * ---------------------------------------------------------------------
 * 策略（对标竞品"本地缓存优先"+ 开源 SWR 共识）：
 *  - index.html 导航：network-first（400ms 超时回退缓存副本）→ 内容永远尽量最新
 *  - 同源静态 JS/CSS：stale-while-revalidate（缓存秒回 + 后台静默更新）
 *  - 跨域图标/排版字体 CDN：stale-while-revalidate（弱网/冷启动不阻塞渲染）
 *  - /api/*  一律不缓存（数据实时性优先）
 * 版本号变更即整体换仓，旧缓存自动清理。
 * ===================================================================== */
const CACHE_VERSION = 'lya-shell-v20261121-6';
const SHELL_PRECACHE = [
    'video.js?v=20261121d',
    'recommend_data.js',
    'dplayer.min.js',
    'hls.min.js',
    'p2p-engine.min.js',
    'kanju.js?v=20261121'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            // 预缓存核心库（单个失败不阻断安装，下次访问再补）
            return Promise.allSettled(SHELL_PRECACHE.map((u) =>
                cache.add(new Request(u, { cache: 'reload' }))
            ));
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

function isStaticAsset(url) {
    return /\.(js|css|woff2?|png|jpg|jpeg|webp|svg|ico)($|\?)/i.test(url.pathname);
}

// stale-while-revalidate：缓存秒回，后台静默更新
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const network = fetch(request).then((response) => {
        if (response && (response.ok || response.type === 'opaque')) {
            cache.put(request, response.clone()).catch(() => {});
        }
        return response;
    }).catch(() => null);
    if (cached) {
        network.catch(() => {});
        return cached;
    }
    const fresh = await network;
    return fresh || new Response('', { status: 504, statusText: 'offline' });
}

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // API 实时数据一律直连，绝不缓存
    if (url.pathname.startsWith('/api/')) return;

    // 页面导航：network-first，1.5s 超时回退缓存副本（短超时易在弱网回退陈旧副本）
    if (req.mode === 'navigate' || (url.pathname === '/' || url.pathname === '/index.html')) {
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_VERSION);
            try {
                const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
                const fresh = await Promise.race([
                    fetch(req).then((r) => { if (r && r.ok) cache.put('index.html', r.clone()).catch(() => {}); return r; }),
                    timeout
                ]);
                if (fresh) return fresh;
            } catch (e) {}
            const cached = await cache.match('index.html');
            if (cached) return cached;
            try { return await fetch(req); } catch (e) {
                return new Response('offline', { status: 503, statusText: 'offline' });
            }
        })());
        return;
    }

    // 静态资源（同源 JS/CSS + 跨域 CDN 字体/图标）：stale-while-revalidate
    if (url.origin === self.location.origin && isStaticAsset(url)) {
        event.respondWith(staleWhileRevalidate(req, CACHE_VERSION));
        return;
    }
    if (url.origin !== self.location.origin && /cdnjs\.cloudflare\.com|unpkg\.com|cdn\.jsdelivr\.net/.test(url.hostname)) {
        event.respondWith(staleWhileRevalidate(req, CACHE_VERSION));
        return;
    }
});
