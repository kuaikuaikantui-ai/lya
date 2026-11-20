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
    var galleryBlobCache = new Map(); // url -> blobURL

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
            galleryBlobCache.set(url, src);
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
            galleryOv.addEventListener('click', function(e) {
                if (e.target === closeBtn) return;
                uiVisible = !uiVisible;
                counter.style.display = uiVisible ? 'block' : 'none';
                closeBtn.style.display = uiVisible ? 'flex' : 'none';
            });

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
    async function extractArticleVideos(articleUrl) {
        var videos = [];
        try {
            var rawHtml = '';
            if (typeof window.fetchTextWithCorsFallback === 'function') {
                rawHtml = await window.fetchTextWithCorsFallback(articleUrl);
            }
            if (!rawHtml) return videos;
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
        }
        return videos;
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
        slide.innerHTML = '<div class="lya-fs-spinner"><i class="fas fa-circle-notch"></i><span>正在装载视频...</span></div>';
        slide._item = item;
        return slide;
    }

    function mountVideo(slide, autoplay) {
        if (slide._mounted) return;
        slide._mounted = true;
        var item = slide._item;
        slide.innerHTML = '';
        var video = document.createElement('video');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x5-playsinline', '');
        video.loop = false;
        video.preload = 'auto';
        video.playsInline = true;
        video.muted = autoplay === 'muted';
        slide.appendChild(video);
        slide._video = video;

        var hls = attachHls(video, item.url);
        slide._hls = hls;

        // 单击暂停/继续；双击静音切换
        var lastTap = 0;
        slide.addEventListener('click', function() {
            var now = Date.now();
            if (now - lastTap < 280) {
                video.muted = !video.muted;
                lastTap = 0;
                return;
            }
            lastTap = now;
            setTimeout(function() {
                if (lastTap && Date.now() - lastTap >= 260) {
                    if (video.paused) video.play().catch(function() {});
                    else video.pause();
                }
            }, 290);
        });

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

    function unmountPlayback(slide) {
        if (!slide) return;
        if (slide._video) {
            try { slide._video.pause(); } catch (e) {}
            slide._video.preload = 'none';
        }
        if (slide._hls) {
            try { slide._hls.destroy(); } catch (e) {}
            slide._hls = null;
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

            var slideMeta = []; // { slide, item, ready }
            var slideIndex = 0;

            function setTitle(item) {
                var t = document.getElementById('lyaFeedTitle');
                var s = document.getElementById('lyaFeedSub');
                if (t) t.textContent = item.vod_name || '吃瓜爆料';
                if (s) s.textContent = (item.vod_class || '') + (item.vod_remarks ? ' · ' + item.vod_remarks : '');
            }

            function appendArticleSlides(articleItem, isFirst) {
                return extractArticleVideos(articleItem.article_url).then(function(videos) {
                    if (!videos.length) return 0;
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
                        slideMeta.push({ slide: slide, item: v });
                    });
                    // 立即装载当前首个 slide
                    if (isFirst && videos.length > 0) {
                        mountVideo(slideMeta[0].slide, true);
                        setTitle(articleItem);
                    }
                    return videos.length;
                });
            }

            // 预取窗口：当前文章 ±3，后台接力
            function prefetchAround(centerIdx) {
                var jobs = [];
                for (var off = 1; off <= 3; off++) {
                    var nextIdx = centerIdx + off;
                    if (nextIdx < items.length && !items[nextIdx]._feedParsed) {
                        items[nextIdx]._feedParsed = true;
                        jobs.push(appendArticleSlides(items[nextIdx], false));
                    }
                }
                return Promise.all(jobs);
            }

            // IntersectionObserver：进入视口自动播放、离开暂停、±1 预载
            var io = new IntersectionObserver(function(entries) {
                entries.forEach(function(en) {
                    var slide = en.target;
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
                        var metaIdx = slideMeta.findIndex(function(m) { return m.slide === slide; });
                        var itemIdx = idx + Math.floor(metaIdx / 1);
                        prefetchAround(idx);
                    } else {
                        unmountPlayback(slide);
                    }
                });
            }, { root: scroll, threshold: [0, 0.6] });

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

            // 装载起始文章的视频
            items[idx]._feedParsed = true;
            await appendArticleSlides(items[idx], true);
            if (slideMeta.length === 0) {
                feedOv.innerHTML = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#fff;flex-direction:column;gap:14px;"><i class="fas fa-face-frown" style="font-size:30px;color:#f43f5e;"></i><div style="font-size:14px;">该篇没有可提取的视频，直接看详情页图集吧</div></div>';
                var backBtn = document.createElement('button');
                backBtn.className = 'lya-feed-close-btn';
                backBtn.innerHTML = '<i class="fas fa-xmark"></i>';
                backBtn.style.cssText = 'position:absolute;top:calc(env(safe-area-inset-top, 0px) + 10px);left:12px;';
                backBtn.onclick = function() { window.LyaCloseFullScreen(); };
                feedOv.appendChild(backBtn);
                return;
            }
            slideMeta.forEach(function(m) { io.observe(m.slide); });
            prefetchAround(idx);
        }
    };

    console.log(TAG + 'feed.js 沉浸流框架 v1.0 已就绪（上下滑视频流 + 全屏图集查看器）');
})();
