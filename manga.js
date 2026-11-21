/* =====================================================================
 * Lya 漫画阅读器独立框架 (manga.js)
 * ---------------------------------------------------------------------
 * 职责（独立于主站 index.html 的漫画框架层，可独立演进）：
 *   1. 双指捏合缩放 + 缩放后拖拽平移 + 双击复位（原生漫画 App 手感）
 *   2. IntersectionObserver 智能预加载：临近视口的图片提前解码，
 *      连续下滑不卡白屏；远离视口的缩放态自动复位回收
 *   3. 对外暴露 window.MangaReader 统一 API
 * 依赖：index.html 主脚本先加载（本文件在其后执行，运行时接管 .img-stream）。
 * ===================================================================== */
(function() {
    'use strict';
    if (window.__LYA_MANGA_FRAMEWORK__) return;
    window.__LYA_MANGA_FRAMEWORK__ = true;
    var TAG = '[MangaFW] ';

    var MAX_SCALE = 3.0;
    var MIN_SCALE = 1.0;
    var DBL_TAP_SCALE = 2.2;

    // ============ 1. 捏合缩放引擎（Pointer Events，滚动模式可用） ============
    var pointers = new Map();
    var pinch = { active: false, startDist: 0, startScale: 1, scale: 1, tx: 0, ty: 0, lastX: 0, lastY: 0, panning: false };
    var streamEl = null;

    function applyTransform() {
        if (!streamEl) return;
        // 原点取 0 0：屏幕坐标 = T + s·p（p 为元素坐标），
        // 焦点保持公式 T_new = f − k(f − T_old)（k = s_new/s_old）在此原点下精确成立
        streamEl.style.transformOrigin = '0 0';
        streamEl.style.transform = 'scale(' + pinch.scale + ') translate(' + (pinch.tx / pinch.scale) + 'px,' + (pinch.ty / pinch.scale) + 'px)';
    }

    function resetZoom() {
        pinch.scale = 1;
        pinch.tx = 0;
        pinch.ty = 0;
        pinch.panning = false;
        if (streamEl) {
            streamEl.style.transition = 'transform 0.22s ease-out';
            applyTransform();
            setTimeout(function() { if (streamEl) streamEl.style.transition = ''; }, 240);
        }
    }

    function getDist() {
        var pts = Array.from(pointers.values());
        if (pts.length < 2) return 0;
        var dx = pts[0].clientX - pts[1].clientX;
        var dy = pts[0].clientY - pts[1].clientY;
        return Math.hypot(dx, dy);
    }

    function bindStream(el) {
        if (!el || el._mangaFwBound) return;
        el._mangaFwBound = true;
        streamEl = el;
        el.style.touchAction = 'pan-y';
        el.style.willChange = 'transform';

        el.addEventListener('pointerdown', function(e) {
            if (e.pointerType === 'mouse') return; // 桌面端不劫持
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size === 2) {
                pinch.active = true;
                pinch.panning = false;
                pinch.startDist = getDist() || 1;
                pinch.startScale = pinch.scale;
                el.style.touchAction = 'none';
                e.preventDefault();
            } else if (pointers.size === 1 && pinch.scale > 1.01) {
                pinch.panning = true;
                pinch.lastX = e.clientX;
                pinch.lastY = e.clientY;
                el.style.touchAction = 'none';
            }
        }, { passive: false });

        el.addEventListener('pointermove', function(e) {
            if (!pointers.has(e.pointerId)) return;
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pinch.active && pointers.size >= 2) {
                var d = getDist();
                if (d > 0) {
                    var next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinch.startScale * (d / pinch.startDist)));
                    // 双指中心为缩放焦点，让放大对准手指捏的位置
                    var pts = Array.from(pointers.values());
                    var cx = (pts[0].clientX + pts[1].clientX) / 2;
                    var cy = (pts[0].clientY + pts[1].clientY) / 2;
                    var rect = el.getBoundingClientRect();
                    var fx = cx - rect.left;
                    var fy = cy - rect.top;
                    var prev = pinch.scale;
                    var k = next / prev;
                    // 保持焦点不动：平移补偿
                    pinch.tx = fx - k * (fx - pinch.tx);
                    pinch.ty = fy - k * (fy - pinch.ty);
                    pinch.scale = next;
                    applyTransform();
                }
                e.preventDefault();
            } else if (pinch.panning && pointers.size === 1) {
                var dx = e.clientX - pinch.lastX;
                var dy = e.clientY - pinch.lastY;
                pinch.lastX = e.clientX;
                pinch.lastY = e.clientY;
                pinch.tx += dx;
                pinch.ty += dy;
                applyTransform();
                e.preventDefault();
            }
        }, { passive: false });

        function releasePointer(e) {
            pointers.delete(e.pointerId);
            if (pointers.size < 2 && pinch.active) {
                // 双指捏合结束、剩余单指：无缝转为拖拽平移（抬起一根手指继续拖是自然手势）
                pinch.active = false;
                var rest = Array.from(pointers.values())[0];
                if (rest && pinch.scale > 1.01) {
                    pinch.panning = true;
                    pinch.lastX = rest.x;
                    pinch.lastY = rest.y;
                }
            }
            if (pointers.size === 0) {
                pinch.panning = false;
                if (pinch.scale <= 1.01) resetZoom();
                el.style.touchAction = pinch.scale > 1.01 ? 'none' : 'pan-y';
            }
        }
        el.addEventListener('pointerup', releasePointer, { passive: true });
        el.addEventListener('pointercancel', releasePointer, { passive: true });

        // 双击：在 1x 与双击缩放档之间切换
        var lastTap = 0;
        el.addEventListener('touchend', function(e) {
            var now = Date.now();
            if (now - lastTap < 280) {
                if (pinch.scale > 1.05) {
                    resetZoom();
                } else {
                    pinch.scale = DBL_TAP_SCALE;
                    // 以点击点为焦点放大
                    var t = e.changedTouches && e.changedTouches[0];
                    if (t) {
                        var rect = el.getBoundingClientRect();
                        var fx = t.clientX - rect.left;
                        var fy = t.clientY - rect.top;
                        var k = DBL_TAP_SCALE;
                        pinch.tx = fx - k * (fx - pinch.tx);
                        pinch.ty = fy - k * (fy - pinch.ty);
                    }
                    el.style.transition = 'transform 0.22s ease-out';
                    applyTransform();
                    setTimeout(function() { if (streamEl) streamEl.style.transition = ''; }, 240);
                    if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHaptic) {
                        try { window.webkit.messageHandlers.nativeHaptic.postMessage('light'); } catch (err) {}
                    }
                }
                lastTap = 0;
            } else {
                lastTap = now;
            }
        }, { passive: true });
    }

    // ============ 2. 智能预加载：临近视口图片提前解码 ============
    var preloadObserver = null;
    function ensurePreloadObserver() {
        if (preloadObserver || !('IntersectionObserver' in window)) return null;
        preloadObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(en) {
                var img = en.target;
                if (!en.isIntersecting) return;
                preloadObserver.unobserve(img);
                if (img.dataset.fwLoaded) return;
                img.dataset.fwLoaded = '1';
                // 临近视口：提升解码优先级并触发提前解码
                try {
                    img.loading = 'eager';
                    if (typeof img.decode === 'function') img.decode().catch(function() {});
                } catch (e) {}
            });
        }, { rootMargin: '1600px 0px' }); // 提前约 2 屏开始解码
        return preloadObserver;
    }

    // ============ 3. 接管漫画容器渲染生命周期 ============
    // readChapter 每次渲染 .img-stream 后，框架自动重新绑定（MutationObserver 监听）
    function hookStream() {
        var container = document.getElementById('readerContainer');
        if (!container) return;
        var stream = container.querySelector('.img-stream');
        if (stream) {
            bindStream(stream);
            if (pinch.scale > 1.01) resetZoom();
            var ob = ensurePreloadObserver();
            if (ob) {
                stream.querySelectorAll('img[data-orig-src]').forEach(function(img) {
                    if (!img.dataset.fwLoaded) ob.observe(img);
                });
            }
        }
    }

    var _streamHookTimer = null;
    var streamMo = new MutationObserver(function() {
        if (_streamHookTimer) return;
        _streamHookTimer = setTimeout(function() {
            _streamHookTimer = null;
            var container = document.getElementById('readerContainer');
            if (container && container.classList.contains('manga-reader-mode')) hookStream();
        }, 160);
    });

    function startWatcher() {
        var container = document.getElementById('readerContainer');
        if (!container || container._mangaFwWatch) return;
        container._mangaFwWatch = true;
        streamMo.observe(container, { childList: true, subtree: false });
        hookStream(); // 框架加载时若 .img-stream 已存在（懒加载晚于章节渲染），立即挂接
    }

    // 主脚本进入漫画阅读器后启动监听（轮询兜底，幂等）
    var bootTries = 0;
    var bootTimer = setInterval(function() {
        bootTries += 1;
        var container = document.getElementById('readerContainer');
        if (container) {
            clearInterval(bootTimer);
            startWatcher();
        } else if (bootTries > 100) {
            clearInterval(bootTimer);
        }
    }, 300);

    // ============ 4. 统一 API ============
    window.MangaReader = {
        version: '1.0.0',
        zoomIn: function() { pinch.scale = Math.min(MAX_SCALE, pinch.scale + 0.4); applyTransform(); },
        zoomOut: function() { pinch.scale = Math.max(MIN_SCALE, pinch.scale - 0.4); if (pinch.scale <= 1.01) resetZoom(); else applyTransform(); },
        resetZoom: resetZoom,
        scale: function() { return pinch.scale; }
    };

    console.log(TAG + 'manga.js 漫画阅读器框架 v1.0 已就绪（捏合缩放/双击放大/智能预载）');
})();
