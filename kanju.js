/* =====================================================================
 * Lya kanju 原站直连客户端 (kanju.js)
 * ---------------------------------------------------------------------
 * 为什么存在：原站 APP 播放快、有 4K/官方CDN，是因为它以【用户真实 IP】直调
 * kanju 播放解析 API，获得就近 CDN 直连。我们原先经 Cloudflare 后端转发，
 * kanju 看到的是边缘节点 IP，分配的线路对用户侧不友好（慢/失效）。
 * 实测 kanju API 的 CORS 白名单显式允许浏览器携带签名头跨域调用，
 * 因此本模块在前端直调（签名算法与后端一致；secret 本就是原站逆向产物）。
 *
 * 能力：
 *   1. catalog(id)         拉取剧集列表（含每集 resolve token）
 *   2. resolve(token)      解析某集全部可选线路 line_options（4K/官方R/Z/B…）
 *   3. resolveLine(ticket) 二次换取直连 m3u8/mp4
 *   4. enrichVideoGroups() 把官方线路动态追加到播放器线路组（优先置顶）
 * 多镜像竞速：kanju.ai / kanju3.com / souju.ai / kanju1.com / souju7.com
 * 失败静默：任何一步失败都回退到现有后端链路，不影响播放。
 * ===================================================================== */
(function() {
    'use strict';
    if (window.__LYA_KANJU_CLIENT__) return;
    window.__LYA_KANJU_CLIENT__ = true;
    var TAG = '[KanjuClient] ';

    var HOSTS = ['https://kanju.ai', 'https://kanju3.com', 'https://souju.ai', 'https://kanju1.com', 'https://souju7.com'];
    var SECRET = '557d0e4ae929f438da6bd84412374e6086b8af09b3fed54bf22601d5bf8c54a0';
    var TIMEOUT = 6000;

    // ============ iOS 原生桥回调管理（Swift 转发请求后经此回传结果） ============
    window.__kanjuPending = new Map();
    window.__kanjuOnResponse = function(reqId, resultJson) {
        var p = window.__kanjuPending.get(reqId);
        if (!p) return;
        window.__kanjuPending.delete(reqId);
        try { p.resolve(JSON.parse(resultJson)); } catch (e) { p.reject(e); }
    };
    window.kanjuBridgeRequest = function(req) {
        return new Promise(function(resolve, reject) {
            var reqId = 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            window.__kanjuPending.set(reqId, { resolve: resolve, reject: reject });
            setTimeout(function() {
                if (window.__kanjuPending.has(reqId)) {
                    window.__kanjuPending.delete(reqId);
                    reject(new Error('kanju bridge timeout'));
                }
            }, 12000);
            try {
                window.webkit.messageHandlers.kanjuRequest.postMessage(JSON.stringify(Object.assign({ reqId: reqId }, req)));
            } catch (e) {
                window.__kanjuPending.delete(reqId);
                reject(e);
            }
        });
    };

    // 记录最快的镜像，后续请求优先走它
    var preferredHost = null;

    // ============ iOS 原生桥（隐藏 kanju WebView，用户 IP 同源调用，解锁官方CDN/4K） ============
    function bridgeAvailable() {
        return typeof window.kanjuBridgeRequest === 'function' &&
               !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.kanjuRequest);
    }

    function bridgeRequest(method, pathname, search, bodyObj) {
        return window.kanjuBridgeRequest({ method: method, path: pathname, search: search || '', bodyObj: bodyObj || null }).then(function(res) {
            if (!res || !res.status) throw new Error('bridge unavailable');
            if (res.status !== 200 && res.status !== 201) throw new Error('HTTP ' + res.status);
            return JSON.parse(res.text);
        });
    }

    function toHex(buf) {
        return Array.from(new Uint8Array(buf), function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    async function signHeaders(method, pathname, search) {
        var timestamp = String(Date.now());
        var nonceArr = new Uint8Array(16);
        crypto.getRandomValues(nonceArr);
        var nonce = toHex(nonceArr);
        var payload = method + '\n' + pathname + (search || '') + '\n' + timestamp + '\n' + nonce;
        var key = await crypto.subtle.importKey('raw', new TextEncoder().encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        var sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
        return {
            'x-ai-movie-timestamp': timestamp,
            'x-ai-movie-nonce': nonce,
            'x-ai-movie-signature': toHex(sig)
        };
    }

    async function signedFetch(method, pathname, search, bodyObj) {
        // APP 内优先走原生桥（隐藏 kanju WebView：同源 + 用户 IP + Cookie，官方 CDN 解锁）
        if (bridgeAvailable()) {
            return bridgeRequest(method, pathname, search, bodyObj);
        }
        // 非 APP（网页/PWA）：跨域被 kanju CORS 拦截，静默失败——调用方回退后端链路
        var hosts = preferredHost ? [preferredHost].concat(HOSTS.filter(function(h) { return h !== preferredHost; })) : HOSTS;
        var headers = await signHeaders(method, pathname, search);
        var errors = [];
        // 顺序尝试镜像（首个成功即返回；浏览器跨域已实测放行）
        for (var i = 0; i < hosts.length; i++) {
            var host = hosts[i];
            var ctl = new AbortController();
            var timer = setTimeout(function() { ctl.abort(); }, TIMEOUT);
            try {
                var res = await fetch(host + pathname + (search || ''), {
                    method: method,
                    headers: Object.assign({
                        'Accept': 'application/json',
                        'Referer': host + '/'
                    }, headers, bodyObj ? { 'Content-Type': 'application/json' } : {}),
                    body: bodyObj ? JSON.stringify(bodyObj) : undefined,
                    signal: ctl.signal
                });
                clearTimeout(timer);
                if (!res.ok) { errors.push(host + ' HTTP ' + res.status); continue; }
                var json = await res.json();
                preferredHost = host;
                return json;
            } catch (e) {
                clearTimeout(timer);
                errors.push(host + ' ' + (e && e.message ? e.message : 'failed'));
            }
        }
        throw new Error('all mirrors failed: ' + errors.join('; '));
    }

    // ============ 对外能力 ============
    window.KanjuClient = {
        version: '1.0.0',

        // 剧集列表：{ id, episodes: [{ title, token }] }
        catalog: async function(kanjuId) {
            var cat = await signedFetch('GET', '/v1/catalog/' + encodeURIComponent(kanjuId));
            if (!cat || !Array.isArray(cat.episodes)) throw new Error('catalog empty');
            return {
                episodes: cat.episodes.map(function(ep) {
                    return { title: ep.title || '', token: ep.token || '' };
                })
            };
        },

        // 某集全部可选线路：{ lineOptions: [{ display_label, provider_name, url, preference_weight }] }
        resolve: async function(token) {
            var res = await signedFetch('GET', '/v1/playback/resolve/' + encodeURIComponent(token));
            if (!res || !Array.isArray(res.line_options)) throw new Error('resolve empty');
            return { lineOptions: res.line_options };
        },

        // 凭证换直连
        resolveLine: async function(ticket) {
            var clean = String(ticket || '').replace(/^resolve:\/\//, '');
            var res = await signedFetch('POST', '/v1/playback/resolve-line', '?view=compact', { ticket: clean });
            if (res && res.line && res.line.url) return { url: res.line.url, lines: res.lines || null };
            throw new Error('resolve-line empty');
        },

        // ============ 核心：为当前播放的视频追加原站官方直连线路（用户 IP 就近 CDN） ============
        // video: window.currentVideo（需 kanju_id 或 av_ 前缀 vod_id）
        // 返回：追加的线路数量
        enrichVideoGroups: async function(video) {
            if (!video) return 0;
            var kanjuId = video.kanju_id || (String(video.vod_id || '').startsWith('av_') ? String(video.vod_id) : '');
            if (!kanjuId) return 0;
            var t0 = Date.now();
            var cat = await KanjuClient.catalog(kanjuId);
            if (!cat.episodes.length) return 0;

            // 只解析首集全部线路（切集时由 playVideoEpisode 按需再解析对应集）
            var ep0 = cat.episodes[0];
            var res = await KanjuClient.resolve(ep0.token);
            var options = res.lineOptions.filter(function(l) { return l && l.url; });
            if (!options.length) return 0;

            var added = 0;
            options.forEach(function(line) {
                var rawLabel = (line.display_label || line.provider_name || '官方线路').trim();
                var url = line.url;
                var isTicket = url.indexOf('resolve://') === 0;
                var isDirect = /^https?:\/\//.test(url) && (/\.m3u8|\.mp4/.test(url));
                if (!isTicket && !isDirect) return;
                var gName = '原站官方·' + rawLabel;
                if (video.groups.some(function(g) { return g.name === gName; })) return;
                video.groups.push({
                    name: gName,
                    episodes: cat.episodes.map(function(ep, epIdx) {
                        // 首集已有直连/凭证；其他集放 resolve 凭证占位，播放时按需换直连
                        if (epIdx === 0) return { title: ep.title || '第1集', url: url };
                        return { title: ep.title || ('第' + (epIdx + 1) + '集'), url: 'resolve://pending-' + epIdx };
                    }),
                    _lyaKanjuTokens: cat.episodes.map(function(ep) { return ep.token || ''; }),
                    _lyaKanjuOptions: options,
                    _lyaKanjuLabel: rawLabel,
                    _lyaManualOnly: true // 仅抽屉手动可选：不参与自动选源与看门狗换线（未真机验证前防止黑屏循环）
                });
                added += 1;
            });

            if (added > 0) {
                // 官方组追加到列表【末尾】且不参与自动选择（IP锁定的CF解析地址黑屏教训）：
                // 仅作为抽屉里的手动可选项，用户自己点选尝试
                console.log(TAG + '已追加 ' + added + ' 条原站官方线路（用户IP解析，手动可选），耗时 ' + (Date.now() - t0) + 'ms');
            }
            return added;
        },

        // 播放某集时，对 kanju 官方组按需换直连（返回直连 url 或 null）
        ensureEpisodeUrl: async function(group, epIdx) {
            if (!group || !group._lyaKanjuTokens || !group._lyaKanjuOptions) return null;
            var ep = group.episodes[epIdx];
            if (!ep) return null;
            if (/^https?:\/\//.test(ep.url) && (/\.m3u8|\.mp4/.test(ep.url))) return ep.url; // 已是直连
            var token = group._lyaKanjuTokens[epIdx];
            if (!token) return null;
            // 该集在同 label 下的对应线路
            var res = await KanjuClient.resolve(token);
            var match = (res.lineOptions || []).find(function(l) {
                return (l.display_label || l.provider_name || '') === group._lyaKanjuLabel;
            }) || (res.lineOptions || [])[0];
            if (!match || !match.url) return null;
            if (/^https?:\/\//.test(match.url) && (/\.m3u8|\.mp4/.test(match.url))) {
                ep.url = match.url; // 缓存直连，切回时秒开
                return ep.url;
            }
            // 仍是凭证：二次换取
            var rl = await KanjuClient.resolveLine(match.url);
            if (rl && rl.url) { ep.url = rl.url; return ep.url; }
            return null;
        }
    };

    console.log(TAG + 'kanju.js 原站直连客户端 v1.0 已就绪（用户IP就近CDN）');
})();
