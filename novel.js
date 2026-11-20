/* =====================================================================
 * Lya 小说阅读器独立框架 (novel.js)
 * ---------------------------------------------------------------------
 * 职责（独立于主站 index.html 的小说框架层，可独立演进）：
 *   1. 分页排版引擎接管：突发重排请求合并（去抖）+ Web 字体就绪自动补偿
 *      重排 + 旋转/视口变更去抖重排（修复横竖屏旋转后分页错位）
 *   2. 阅读器进入/退出生命周期钩子（为原生壳联动预留）
 *   3. 对外暴露 window.NovelReader 统一 API（原生桥 / 调试 / 扩展入口）
 * 依赖：index.html 主脚本先加载（本文件在其后执行，运行时接管）。
 * ===================================================================== */
(function() {
    'use strict';
    if (window.__LYA_NOVEL_FRAMEWORK__) return;
    window.__LYA_NOVEL_FRAMEWORK__ = true;
    var TAG = '[NovelFW] ';

    // ============ 1. 分页排版引擎接管 ============
    var origRecalc = window.recalcPaginatedLayout;
    if (typeof origRecalc !== 'function') {
        console.warn(TAG + '主脚本分页引擎未就绪，框架延迟生效');
        return;
    }

    var _recalcQueued = false;
    var _lastRecalcAt = 0;

    // 合并同帧/突发（resize 风暴、旋转连发）内的重复重排，全部收敛到下一帧执行一次
    function queueRecalc() {
        if (_recalcQueued) return;
        _recalcQueued = true;
        requestAnimationFrame(function() {
            _recalcQueued = false;
            _lastRecalcAt = Date.now();
            try { origRecalc(); } catch (e) { console.warn(TAG + 'recalc 异常:', e); }
        });
    }

    window.recalcPaginatedLayout = function() {
        // 分页模式才需要重排（与原实现判断一致）
        var stream = document.getElementById('novelArticleStream');
        if (!stream) return;
        queueRecalc();
    };

    // Web 字体（霞鹜文楷/思源书宋等）就绪后精确补偿一次重排——
    // 字体替换会导致字符宽度变化，原实现只能靠盲目的 120ms 重试碰运气
    if (document.fonts && typeof document.fonts.ready === 'object' && document.fonts.ready.then) {
        document.fonts.ready.then(function() {
            if (document.body.classList.contains('reading-mode')) {
                queueRecalc();
            }
        });
    }

    // 旋转 / 视口尺寸变化：去抖 180ms 后重排（原实现逐事件同步重排，旋转时连发卡顿）
    var _resizeTimer = null;
    function onViewportChange() {
        if (!document.body.classList.contains('reading-mode')) return;
        if (!document.getElementById('novelArticleStream')) return;
        if (_resizeTimer) clearTimeout(_resizeTimer);
        _resizeTimer = setTimeout(queueRecalc, 180);
    }
    window.addEventListener('resize', onViewportChange, { passive: true });
    window.addEventListener('orientationchange', onViewportChange, { passive: true });

    // ============ 2. 阅读器生命周期钩子 ============
    // 进入分页阅读（章节渲染完成后由框架触发重排校准）
    var origRenderNovel = window.renderNovelIntoContainer;
    if (typeof origRenderNovel === 'function') {
        window.renderNovelIntoContainer = function(formatted, chapTitle, idx, initialPage) {
            var result = origRenderNovel.apply(this, arguments);
            // 字体晚于首章渲染完成时补偿重排（Web 字体首次加载场景）
            if (document.fonts && document.fonts.status === 'loading' && document.fonts.ready) {
                document.fonts.ready.then(function() { queueRecalc(); });
            }
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeHaptic) {
                try { window.webkit.messageHandlers.nativeHaptic.postMessage('light'); } catch (e) {}
            }
            return result;
        };
    }

    // ============ 3. 统一 API（扩展/原生桥入口） ============
    window.NovelReader = {
        version: '1.0.0',
        recalc: queueRecalc,
        turnPage: function(delta) {
            if (typeof window.turnPaginatedPage === 'function') window.turnPaginatedPage(delta);
        },
        isPaginated: function() {
            var c = document.getElementById('readerContainer');
            return !!(c && c.classList.contains('mode-paginated'));
        },
        info: function() {
            return {
                mode: window.novelReaderMode || 'paginated',
                theme: window.currentNovelTheme || 'parchment',
                fontSize: window.readerFontSize || null,
                book: window.currentBookInfo ? (window.currentBookInfo.book_name || '') : ''
            };
        }
    };

    console.log(TAG + 'novel.js 小说阅读器框架 v1.0 已接管分页排版引擎');
})();
