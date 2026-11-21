/* =====================================================================
 * Lya 全屏沉浸流框架 (feed.js)
 * ---------------------------------------------------------------------
 * 职责（独立框架层，可独立演进）：
 *   1. LyaFeed —— 抖音式上下滑全屏视频流：
 *      scroll-snap 翻页、IntersectionObserver 自动播放、±1 邻卡预载、
 *      吃瓜文章视频自动提取 + 相邻文章后台预取接力
 *   2. LyaGallery —— 全屏图集查看器："图片放在某个地方，点一下就能看"：
 *      左右滑浏览、计数徽标、吃瓜 AES 加密图按需解密、点按隐藏 UI
 * 依赖：index.html 主脚本（fetchTextWithCorsFallback / _decryptChiguaImageUrl /
 *       hls.min.js）先加载；本文件运行时接管，不侵入主流程。
 * ===================================================================== */
(function() {
    'use strict';
    if (window.__LYA_FEED_FRAMEWORK__) return;
    window.__LYA_FEED_FRAMEWORK__ = true;
    var TAG = '[FeedFW] ';

    var Z = 100000; // 全屏层 z-index（覆盖底部导航与播放器）

    var css = document.createElement('style');
    css.textContent = [
        '.lya-feed-overlay{position:fixed;inset:0;background:#000;z-index:' + Z + ';}',
        '.lya-feed-scroll{height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;}',
        '.lya-feed-scroll::-webkit-scrollbar{display:none;}',
        '.lya-feed-slide{height:100%;scroll-snap-align:start;scroll-snap-stop:always;position:relative;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden;}',
        '.lya-feed-slide video,.lya-feed-slide img{max-width:100%;max-height:100%;object-fit:contain;}',
        '.lya-feed-slide img{width:100%;object-fit:contain;}',
        '.lya-feed-topbar{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:calc(env(safe-area-inset-top, 0px) + 10px) 14px 10px;z-index:5;background:linear-gradient(180deg,rgba(0,0,0,0.55),transparent);}',
        '.lya-feed-close-btn{width:38px;height:38px;border-radius:50%;border:none;background:rgba(15,20,30,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;}',
        '.lya-feed-title-wrap{flex:1;min-width:0;margin:0 10px;color:#fff;}',
        '.lya-feed-title{font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.lya-feed-sub{font-size:11px;color:rgba(255,255,255,0.65);margin-top:2px;}',
        '.lya-feed-progress{position:absolute;left:0;bottom:0;height:3px;background:linear-gradient(90deg,#38bdf8,#f43f5e);width:0%;z-index:5;transition:width 0.2s linear;pointer-events:none;}',
        '.lya-feed-hint{position:absolute;inset:auto 0 46% 0;text-align:center;color:rgba(255,255,255,0.85);font-size:13px;z-index:4;pointer-events:none;}',
        '.lya-gallery-track{display:flex;height:100%;overflow-x:scroll;scroll-snap-type:x mandatory;scrollbar-width:none;}',
        '.lya-gallery-track::-webkit-scrollbar{display:none;}',
        '.lya-gallery-cell{min-width:100%;height:100%;scroll-snap-align:center;display:flex;align-items:center;justify-content:center;background:#000;padding:0;}',
        '.lya-gallery-cell img{max-width:100%;max-height:100%;object-fit:contain;}',
        '.lya-gallery-counter{position:absolute;top:calc(env(safe-area-inset-top, 0px) + 12px);left:50%;transform:translateX(-50%);padding:6px 16px;border-radius:999px;background:rgba(15,20,30,0.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#fff;font-size:13px;font-weight:700;z-index:6;pointer-events:none;}',
        '.lya-fs-spinner{color:rgba(255,255,255,0.75);font-size:13px;display:flex;flex-direction:column;align-items:center;gap:10px;}',
        '.lya-fs-spinner i{font-size:26px;color:#38bdf8;animation:fa-spin 1s linear infinite;}'
    ].join('\n');
    document.head.appendChild(css);

    function buildOverlay() {
        var ov = document.createElement('div');
        ov.className = 'lya-feed-overlay';
        ov.style.display = 'none';
        document.body.appendChild(ov);
        // 关闭时暂停全部媒体
        ov.addEventListener('DOMContentLoaded', function() {});
        return ov;
    }

    // ==================== 通用全屏层管理 ====================
    var _fsState = { active: false, cleanup: null };

    function enterFullScreen(ov, cleanup) {
        _fsState.active = true;
        _fsState.cleanup = function() {
            try { if (typeof cleanup === 'function') cleanup(); } catch (e) {}
            ov.style.display = 'none';
            _fsState.active = false;
            document.body.style.overflow = '';
        };
        document.body.style.overflow = 'hidden';
        ov.style.display = 'block';
    }

    window.LyaCloseFullScreen = function() {
        if (_fsState.cleanup) _fsState.cleanup();
        _fsState.cleanup = null;
    };

    // ==================== 1. 全屏图集查看器 ====================
    var galleryOv = null;
    var galleryBlobCache = new Map(); // url -> blobURL（上限 80 条，超出淘汰最早条目并回收 blob）

    function cacheGalleryBlob(url, objUrl) {
        if (galleryBlobCache.has(url)) return;
        galleryBlobCache.set(url, objUrl);
        if (galleryBlobCache.size > 80) {
            var oldest = galleryBlobCache.keys().next().value;
            var oldBlob = galleryBlobCache.get(oldest);
            galleryBlobCache.delete(oldest);
            try { if (oldBlob && oldBlob.startsWith('blob:')) URL.revokeObjectURL(oldBlob); } catch (e) {}
        }
    }

    function getGalleryImageSrc(url) {
        if (!url) return Promise.resolve('');
        if (galleryBlobCache.has(url)) return Promise.resolve(galleryBlobCache.get(url));
        // 加密图（吃瓜）走主站解密器；明文图直接用
        var p;
        if (typeof window._decryptChiguaImageUrl === 'function') {
            p = window._decryptChiguaImageUrl(url).catch(function() { return url; });
        } else {
            p = Promise.resolve(url);
        }
        return p.then(function(src) {
            cacheGalleryBlob(url, src);
            return src;
        });
    }

    window.LyaGallery = {
        open: function(images, startIndex) {
            var list = (images || []).filter(Boolean);
            if (list.length === 0) return;
            var start = Math.min(Math.max(0, startIndex || 0), list.length - 1);
            if (!galleryOv) {
                galleryOv = buildOverlay();
            }
            galleryOv.innerHTML = '';

            var closeBtn = document.createElement('button');
            closeBtn.className = 'lya-feed-close-btn';
            closeBtn.innerHTML = '<i class="fas fa-xmark"></i>';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = 'calc(env(safe-area-inset-top, 0px) + 10px)';
            closeBtn.style.left = '12px';
            closeBtn.style.zIndex = '7';
            closeBtn.onclick = function() { window.LyaCloseFullScreen(); };
            galleryOv.appendChild(closeBtn);

            var counter = document.createElement('div');
            counter.className = 'lya-gallery-counter';
            galleryOv.appendChild(counter);

            var track = document.createElement('div');
            track.className = 'lya-gallery-track';
            galleryOv.appendChild(track);

            list.forEach(function(url, idx) {
                var cell = document.createElement('div');
                cell.className = 'lya-gallery-cell';
                cell.dataset.idx = idx;
                cell.innerHTML = '<div class="lya-fs-spinner"><i class="fas fa-circle-notch"></i><span>正在解密实拍图 ' + (idx + 1) + '...</span></div>';
                track.appendChild(cell);
                if (Math.abs(idx - start) <= 1) {
                    loadCell(cell, url, idx, counter, list.length);
                } else {
                    // 惰性解密：滑到附近才解
                    var io = new IntersectionObserver(function(entries) {
                        entries.forEach(function(en) {
                            if (en.isIntersecting) {
                                io.unobserve(cell);
                                loadCell(cell, url, idx, counter, list.length);
                            }
                        });
                    }, { root: track, rootMargin: '200%' });
                    io.observe(cell);
                }
            });

            var uiVisible = true;
            // 用 onclick 覆盖式赋值（而非 addEventListener），避免重复打开时监听器累积
            galleryOv.onclick = function(e) {
                if (e.target === closeBtn) return;
                uiVisible = !uiVisible;
                counter.style.display = uiVisible ? 'block' : 'none';
                closeBtn.style.display = uiVisible ? 'flex' : 'none';
            };

            // 计数跟随滚动
            track.addEventListener('scroll', function() {
                var idx = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
                counter.textContent = (idx + 1) + ' / ' + list.length;
            }, { passive: true });

            enterFullScreen(galleryOv, function() {
                track.innerHTML = '';
            });

            // 定位到起始图
            requestAnimationFrame(function() {
                track.scrollLeft = start * Math.max(1, track.clientWidth);
                counter.textContent = (start + 1) + ' / ' + list.length;
            });
        }
    };

    function loadCell(cell, url, idx, counter, total) {
        getGalleryImageSrc(url).then(function(src) {
            if (!cell.isConnected) return;
            cell.innerHTML = '';
            var img = document.createElement('img');
            img.src = src;
            img.alt = '图 ' + (idx + 1);
            img.referrerPolicy = 'no-referrer';
            img.decoding = 'async';
            cell.appendChild(img);
        }).catch(function() {
            if (cell.isConnected) cell.innerHTML = '<div style="color:rgba(255,255,255,0.5);font-size:13px;">本图解密失败</div>';
        });
    }

    // ==================== 2. 抖音式上下滑视频流 ====================
    var feedOv = null;

    // 吃瓜文章视频提取器（feed.js 自带独立解析，不依赖详情页内部逻辑）
    // 返回：视频数组；[] = 文章确实无视频；null = 提取失败（网络异常，允许稍后重试）
    async function extractArticleVideos(articleUrl) {
        var videos = [];
        var failed = false;
        try {
            var rawHtml = '';
            if (typeof window.fetchTextWithCorsFallback === 'function') {
                rawHtml = await window.fetchTextWithCorsFallback(articleUrl);
            }
            if (!rawHtml) return null;
            var seen = new Set();
            var cfgMatches = rawHtml.matchAll(/data-config=(['"])([\s\S]*?)\1/gi);
            for (var m of cfgMatches) {
                try {
                    var rawCfg = m[2].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                    var cfg = JSON.parse(rawCfg);
                    var u = cfg && cfg.video && cfg.video.url;
                    if (u && /\.m3u8|\.mp4/i.test(u) && !seen.has(u)) {
                        seen.add(u);
                        videos.push({ type: 'video', url: u, pic: (cfg.video.pic || ''), title: '' });
                    }
                } catch (e) {}
            }
            if (videos.length === 0) {
                var m3us = rawHtml.matchAll(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/gi);
                for (var mm of m3us) {
                    var mu = mm[0].replace(/\\/g, '');
                    if (!mu.includes('pre_ads') && !mu.includes('post_ads') && !seen.has(mu)) {
                        seen.add(mu);
                        videos.push({ type: 'video', url: mu, pic: '', title: '' });
                    }
                }
            }
        } catch (e) {
            console.warn(TAG + '文章视频提取失败:', e);
            failed = true;
        }
        return failed ? null : videos;
    }

    function attachHls(video, url) {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        var canNative = video.canPlayType('application/vnd.apple.mpegurl');
        if (canNative && isIOS) {
            video.src = url;
            return null;
        }
        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true, maxBufferLength: 18, maxMaxBufferLength: 40, backBufferLength: 20 });
            hls.loadSource(url);
            hls.attachMedia(video);
            return hls;
        }
        video.src = url;
        return null;
    }

    function buildVideoSlide(item) {
        var slide = document.createElement('div');
        slide.className = 'lya-feed-slide';
        // 独立媒体容器：重挂载时只重建 video，保留进度条/提示等外层元素
        var media = document.createElement('div');
        media.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';
        media.innerHTML = '<div class="lya-fs-spinner"><i class="fas fa-circle-notch"></i><span>正在装载视频...</span></div>';
        slide.appendChild(media);
        slide._media = media;
        slide._item = item;
        bindSlideInteractions(slide);
        return slide;
    }

    // 滑块交互只绑定一次（单击立即暂停/继续；静音走顶栏专用按钮，不再做双击判定，消除 290ms 响应延迟）
    function bindSlideInteractions(slide) {
        if (slide._interactionsBound) return;
        slide._interactionsBound = true;
        slide.addEventListener('click', function(e) {
            var v = slide._video;
            if (!v) return;
            if (v.paused) v.play().catch(function() {});
            else v.pause();
        });
    }

    function mountVideo(slide, autoplay) {
        if (slide._mounted) return;
        slide._mounted = true;
        var item = slide._item;
        var media = slide._media;
        if (!media) return;
        media.innerHTML = '';
        var video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x5-playsinline', '');
        video.loop = false;
        video.preload = 'auto';
        video.playsInline = true;
        video.muted = autoplay === 'muted';
        media.appendChild(video);
        slide._video = video;

        var hls = attachHls(video, item.url);
        slide._hls = hls;

        video.addEventListener('timeupdate', function() {
            if (slide._bar && video.duration) {
                slide._bar.style.width = ((video.currentTime / video.duration) * 100).toFixed(1) + '%';
            }
        });
        video.addEventListener('error', function() {
            if (slide._hint) slide._hint.style.display = 'block';
        });

        if (autoplay) {
            var pr = video.play();
            if (pr && pr.catch) pr.catch(function() {
                video.muted = true;
                video.play().catch(function() {});
            });
        }
    }

    // 完全卸载：hls 销毁 + video 摘除 src 并触发 load() 释放解码器/缓冲
    // （iOS 原生 HLS video 元素内存开销大，窗口外不释放连续刷 20 卡会被系统杀掉）
    function unmountPlayback(slide) {
        if (!slide) return;
        slide._mounted = false;
        if (slide._video) {
            try { slide._video.pause(); } catch (e) {}
            try { slide._video.removeAttribute('src'); slide._video.load(); } catch (e) {}
            slide._video = null;
        }
        if (slide._hls) {
            try { slide._hls.destroy(); } catch (e) {}
            slide._hls = null;
        }
        if (slide._media) {
            slide._media.innerHTML = '<div class="lya-fs-spinner"><i class="fas fa-circle-notch"></i><span>正在装载视频...</span></div>';
        }
    }

    window.LyaFeed = {
        // 吃瓜沉浸流：从第 startIdx 篇文章切入，自动提取其视频并后台预取后续文章
        openChigua: async function(startIdx) {
            var items = window._chiguaLatestItems || [];
            if (!items.length) {
                console.warn(TAG + '吃瓜列表为空，无法进入沉浸流');
                return;
            }
            var idx = Math.min(Math.max(0, startIdx || 0), items.length - 1);
            if (!feedOv) feedOv = buildOverlay();
            feedOv.innerHTML = '';

            var scroll = document.createElement('div');
            scroll.className = 'lya-feed-scroll';
            feedOv.appendChild(scroll);

            var topbar = document.createElement('div');
            topbar.className = 'lya-feed-topbar';
            topbar.innerHTML = '<button class="lya-feed-close-btn" id="lyaFeedClose"><i class="fas fa-xmark"></i></button>' +
                '<div class="lya-feed-title-wrap"><div class="lya-feed-title" id="lyaFeedTitle">沉浸刷瓜</div><div class="lya-feed-sub" id="lyaFeedSub"></div></div>' +
                '<button class="lya-feed-close-btn" id="lyaFeedMute" style="background:rgba(244,63,94,0.25);"><i class="fas fa-volume-high"></i></button>';
            feedOv.appendChild(topbar);

            var progress = document.createElement('div');
            progress.className = 'lya-feed-progress';
            feedOv.appendChild(progress);

            var slideMeta = []; // { slide, item, articleIdx }

            function setTitle(item) {
                var t = document.getElementById('lyaFeedTitle');
                var s = document.getElementById('lyaFeedSub');
                var cat = window._chiguaCurrentCatName || '';
                if (t) t.textContent = item.vod_name || '吃瓜爆料';
                if (s) s.textContent = (cat ? '「' + cat + '」 ' : '') + (item.vod_class || '') + (item.vod_remarks ? ' · ' + item.vod_remarks : '');
            }

            // 网络感知预取（danbo"仅 Wi-Fi 预载"模式）：省流模式/2G 直接跳过预取
            function prefetchAllowed() {
                try {
                    var conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
                    if (conn) {
                        if (conn.saveData) return false;
                        if (conn.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;
                    }
                } catch (e) {}
                return true;
            }

            // IntersectionObserver：进入视口自动播放、离开卸载释放、±1 窗口管理
            // 注意必须先于 appendArticleSlides 定义（后者会立即调用 io.observe）
            var io = new IntersectionObserver(function(entries) {
                entries.forEach(function(en) {
                    var slide = en.target;
                    var metaIdx = slideMeta.findIndex(function(m) { return m.slide === slide; });
                    if (en.isIntersecting && en.intersectionRatio > 0.6) {
                        mountVideo(slide, true);
                        if (slide._video) {
                            var pr = slide._video.play();
                            if (pr && pr.catch) pr.catch(function() {
                                slide._video.muted = true;
                                slide._video.play().catch(function() {});
                            });
                        }
                        setTitle({ vod_name: slide._articleTitle, vod_class: '', vod_remarks: '' });
                        var meta = slideMeta[metaIdx];
                        if (meta) prefetchAround(meta.articleIdx);
                        // 窗口外卸载：只保留当前 ±1 的真实加载
                        slideMeta.forEach(function(m, i) {
                            if (Math.abs(i - metaIdx) > 1) unmountPlayback(m.slide);
                        });
                    } else if (en.intersectionRatio <= 0.05) {
                        unmountPlayback(slide);
                    }
                });
            }, { root: scroll, threshold: [0, 0.6] });

            function appendArticleSlides(articleItem, articleIdx, isFirst) {
                return extractArticleVideos(articleItem.article_url).then(function(videos) {
                    if (videos === null) return -1; // 提取失败：允许重试
                    if (!videos.length) return 0;   // 文章确实无视频
                    videos.forEach(function(v, vi) {
                        v.title = articleItem.vod_name + (videos.length > 1 ? (' · 第' + (vi + 1) + '段') : '');
                        v.pic = v.pic || articleItem.vod_pic || '';
                        var slide = buildVideoSlide(v);
                        slide._bar = document.createElement('div');
                        slide._bar.style.cssText = 'position:absolute;bottom:0;left:0;height:3px;background:linear-gradient(90deg,#38bdf8,#f43f5e);width:0%;z-index:5;pointer-events:none;';
                        slide.appendChild(slide._bar);
                        var hint = document.createElement('div');
                        hint.className = 'lya-feed-hint';
                        hint.style.display = 'none';
                        hint.innerHTML = '<i class="fas fa-cloud-arrow-down"></i> 本段视频加载失败，上滑看下一条';
                        slide.appendChild(hint);
                        slide._hint = hint;
                        slide._articleTitle = articleItem.vod_name;
                        scroll.appendChild(slide);
                        slideMeta.push({ slide: slide, item: v, articleIdx: articleIdx });
                        io.observe(slide); // 关键：预取卡也必须被观察，否则永远是死转圈
                    });
                    if (isFirst) {
                        mountVideo(slideMeta[0].slide, true);
                        setTitle(articleItem);
                    }
                    return videos.length;
                });
            }

            // 预取：从当前文章向后扫描，直到凑够 3 篇有视频的文章（无视频的自动跳过）；
            // 网络失败的文章回滚标记允许重试
            async function prefetchAround(centerArticleIdx) {
                if (!prefetchAllowed()) return;
                var withVideos = 0;
                var attempts = 0;
                var scanIdx = centerArticleIdx + 1;
                while (withVideos < 3 && scanIdx < items.length && attempts < 8) {
                    attempts += 1;
                    var it = items[scanIdx];
                    if (!it || it._feedParsed) { scanIdx += 1; continue; }
                    it._feedParsed = true;
                    var count = await appendArticleSlides(it, scanIdx, false);
                    if (count === -1) { it._feedParsed = false; break; } // 网络失败：停止本轮，滑近时重试
                    if (count > 0) withVideos += 1;
                    scanIdx += 1;
                }
            }

            document.getElementById('lyaFeedClose').onclick = function() { window.LyaCloseFullScreen(); };
            var muteBtn = document.getElementById('lyaFeedMute');
            muteBtn.onclick = function() {
                var actives = slideMeta.filter(function(m) { return m.slide._video && !m.slide._video.paused; });
                actives.forEach(function(m) { m.slide._video.muted = !m.slide._video.muted; });
                muteBtn.innerHTML = actives.length && actives[0].slide._video.muted ? '<i class="fas fa-volume-xmark"></i>' : '<i class="fas fa-volume-high"></i>';
            };

            enterFullScreen(feedOv, function() {
                io.disconnect();
                slideMeta.forEach(function(m) { unmountPlayback(m.slide); });
                scroll.innerHTML = '';
                slideMeta = [];
                document.body.style.overflow = '';
            });

            // 装载起始文章的视频；若首篇无视频/失败，自动向后扫描第一篇可刷的作为起点
            items[idx]._feedParsed = true;
            var firstCount = await appendArticleSlides(items[idx], idx, true);
            if (firstCount === -1 || slideMeta.length === 0) {
                if (firstCount === 0) {
                    // 首篇没有视频：向后找第一篇有视频的文章作为起点（最多向后扫 10 篇）
                    var scanIdx = idx + 1;
                    var tries = 0;
                    while (slideMeta.length === 0 && scanIdx < items.length && tries < 10) {
                        tries += 1;
                        var cand = items[scanIdx];
                        if (cand && !cand._feedParsed) {
                            cand._feedParsed = true;
                            var c = await appendArticleSlides(cand, scanIdx, true);
                            if (c === -1) { cand._feedParsed = false; break; }
                            if (c > 0) { idx = scanIdx; }
                        }
                        scanIdx += 1;
                    }
                }
            }
            if (firstCount === -1 && slideMeta.length === 0) {
                items[idx]._feedParsed = false;
                feedOv.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#fff;flex-direction:column;gap:14px;"><i class="fas fa-face-frown" style="font-size:30px;color:#f43f5e;"></i><div style="font-size:14px;">网络异常，暂时无法提取视频，稍后再试</div></div>';
                var netBtn = document.createElement('button');
                netBtn.className = 'lya-feed-close-btn';
                netBtn.innerHTML = '<i class="fas fa-xmark"></i>';
                netBtn.style.cssText = 'position:absolute;top:calc(env(safe-area-inset-top, 0px) + 10px);left:12px;';
                netBtn.onclick = function() { window.LyaCloseFullScreen(); };
                feedOv.appendChild(netBtn);
                return;
            }
            if (slideMeta.length === 0) {
                items[idx]._feedParsed = false;
                feedOv.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#fff;flex-direction:column;gap:14px;"><i class="fas fa-face-frown" style="font-size:30px;color:#f43f5e;"></i><div style="font-size:14px;">这个分类暂时没有可提取的视频，换个分类或直接看图文列表吧</div></div>';
                var backBtn = document.createElement('button');
                backBtn.className = 'lya-feed-close-btn';
                backBtn.innerHTML = '<i class="fas fa-xmark"></i>';
                backBtn.style.cssText = 'position:absolute;top:calc(env(safe-area-inset-top, 0px) + 10px);left:12px;';
                backBtn.onclick = function() { window.LyaCloseFullScreen(); };
                feedOv.appendChild(backBtn);
                return;
            }
            prefetchAround(idx);
        }
    };

    console.log(TAG + 'feed.js 沉浸流框架 v1.0 已就绪（上下滑视频流 + 全屏图集查看器）');
})();
