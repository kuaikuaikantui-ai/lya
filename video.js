// --- 影视模块 (深度还原 kanju.ai 高级流媒体UI模式) ---
(function() {
    window.currentVideoList = [];
    window.currentVideo = null;
    window.currentEpisodeIdx = 0;
    window.currentGroupIdx = 0;
    window.currentCategory = 'all'; // all | movie | tv | anime | variety
    window.dpInstance = null;

    // 切换分类标签 (全部推荐 / 电影 / 电视剧 / 动漫 / 综艺)
    window.switchVideoCategory = function(cat) {
        window.currentCategory = cat;
        document.querySelectorAll('#videoCategoryTabs .category-pill').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById('catBtn_' + cat);
        if (activeBtn) activeBtn.classList.add('active');

        const input = document.getElementById('videoSearchInput');
        const wd = input ? input.value.trim() : '';
        if (wd) {
            window.doVideoSearch();
        } else {
            window.loadVideoFeed(cat);
        }
    };

    window.loadVideoFeed = async function(cat = 'all') {
        const grid = document.getElementById('videoGrid');
        const countBadge = document.getElementById('videoCountBadge');
        if (grid) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:50px;"><i class="fas fa-spinner fa-spin"></i> 正在加载精选热播片单...</div>';
        }

        try {
            // 根据分类映射 type_id (13国产剧/6动作片/4动漫/3综艺)
            let typeParam = '';
            if (cat === 'movie') typeParam = '&t=6';
            if (cat === 'tv') typeParam = '&t=13';
            if (cat === 'anime') typeParam = '&t=4';
            if (cat === 'variety') typeParam = '&t=3';

            const res = await fetch('/api/video/feed?source=feifan&pg=1' + typeParam);
            const data = await res.json();
            window.currentVideoList = data.list || [];
            if (countBadge) countBadge.innerText = '精选 ' + window.currentVideoList.length + ' 部大片';
            window.renderKanjuUI(window.currentVideoList);
        } catch(e) {
            if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red; padding:30px;">加载片单失败: ' + e.message + '</div>';
        }
    };

    window.doVideoSearch = async function() {
        const input = document.getElementById('videoSearchInput');
        const wd = input ? input.value.trim() : '';
        if (!wd) return;

        const grid = document.getElementById('videoGrid');
        const banner = document.getElementById('videoBannerSection');
        if (banner) banner.style.display = 'none';

        const countBadge = document.getElementById('videoCountBadge');
        const titleBadge = document.getElementById('videoFeedTitle');
        if (titleBadge) titleBadge.innerHTML = '<i class="fas fa-search" style="color:var(--accent);"></i> 搜索《' + wd + '》结果';
        if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;"><i class="fas fa-spinner fa-spin"></i> 正在全网检索片源...</div>';

        try {
            const res = await fetch('/api/video/search?source=feifan&wd=' + encodeURIComponent(wd));
            const data = await res.json();
            window.currentVideoList = data.list || [];
            if (countBadge) countBadge.innerText = '检索到 ' + window.currentVideoList.length + ' 个资源';
            if (window.currentVideoList.length === 0) {
                if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂未找到匹配影片，可尝试简化搜索词。</div>';
                return;
            }
            window.renderVideoGridOnly(window.currentVideoList);
        } catch(e) {
            if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red; padding:30px;">搜索失败: ' + e.message + '</div>';
        }
    };

    // 渲染带有 kanju 风格的首页推荐 (顶部精选大 Banner + 精美海报卡片)
    window.renderKanjuUI = function(list) {
        const grid = document.getElementById('videoGrid');
        const bannerBox = document.getElementById('videoBannerSection');
        const titleBadge = document.getElementById('videoFeedTitle');
        if (titleBadge) titleBadge.innerHTML = '<i class="fas fa-fire" style="color:#f59e0b;"></i> 热播影视榜';

        if (!list || list.length === 0) {
            if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂无影视内容</div>';
            return;
        }

        // 1. 顶部大画幅精选焦点图 Banner (如第 1 部高分推荐)
        if (bannerBox && list.length > 0) {
            const topItem = list[0];
            bannerBox.style.display = 'block';
            bannerBox.innerHTML = `
                <div class="kanju-hero-banner" onclick="window.openVideoDetail(0)">
                    <img class="hero-bg" src="${topItem.vod_pic}" alt="${topItem.vod_name}" referrerpolicy="no-referrer" />
                    <div class="hero-overlay"></div>
                    <div class="hero-content">
                        <span class="hero-tag"><i class="fas fa-crown" style="color:#fbbf24;"></i> 强档推荐 · ${topItem.type_name || '大片'}</span>
                        <h2 class="hero-title">${topItem.vod_name}</h2>
                        <p class="hero-desc">${topItem.vod_remarks || ''} · ${topItem.vod_year || '热门'} · ${topItem.vod_area || '全网同步'}</p>
                        <button class="hero-play-btn"><i class="fas fa-play"></i> 立即免广告播放</button>
                    </div>
                </div>
            `;
        }

        // 2. 随后的海报卡片网格
        const restItems = list.slice(1);
        window.renderVideoGridOnly(restItems, 1);
    };

    window.renderVideoGridOnly = function(list, startIndexOffset = 0) {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        if (!list || list.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂无影视内容</div>';
            return;
        }

        grid.innerHTML = list.map((item, idx) => {
            const realIdx = idx + startIndexOffset;
            const pic = item.vod_pic || 'https://api.iconify.design/lucide:film.svg?color=%23555';
            const remark = item.vod_remarks || (item.vod_year || '高清');
            const type = item.type_name || '影视';
            return `
                <div class="kanju-poster-card" onclick="window.openVideoDetail(${realIdx})">
                    <div class="kanju-poster-wrap">
                        <img src="${pic}" alt="${item.vod_name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://api.iconify.design/lucide:film.svg?color=%23888'" />
                        <span class="kanju-poster-badge">${remark}</span>
                        <div class="kanju-play-hover"><i class="fas fa-play"></i></div>
                    </div>
                    <div class="kanju-poster-info">
                        <div class="kanju-poster-title" title="${item.vod_name}">${item.vod_name}</div>
                        <div class="kanju-poster-meta">
                            <span class="meta-tag">${type}</span>
                            <span>${item.vod_year || ''}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    };

    window.openVideoDetail = function(index) {
        const item = window.currentVideoList[index];
        if (!item) return;
        window.currentVideo = item;
        window.currentGroupIdx = 0;

        const playFroms = (item.vod_play_from || '默认线路').split('$$$');
        const playGroups = (item.vod_play_url || '').split('$$$');

        const parsedGroups = [];
        playGroups.forEach((groupStr, gIdx) => {
            const fromName = playFroms[gIdx] || ('线路' + (gIdx + 1));
            const episodes = groupStr.split('#').filter(Boolean).map(e => {
                const pair = e.split('$');
                return {
                    title: pair[0] || '正片',
                    url: pair[1] || pair[0]
                };
            });
            if (episodes.length > 0) {
                parsedGroups.push({
                    name: fromName,
                    episodes: episodes
                });
            }
        });

        parsedGroups.sort((a, b) => {
            const aHas = a.episodes.some(e => e.url.includes('.m3u8')) ? 1 : 0;
            const bHas = b.episodes.some(e => e.url.includes('.m3u8')) ? 1 : 0;
            return bHas - aHas;
        });

        window.currentVideo.groups = parsedGroups;

        document.getElementById('videoSection').style.display = 'none';
        document.getElementById('videoPlayerView').style.display = 'block';

        document.getElementById('videoPlayerTitle').innerText = item.vod_name;
        document.getElementById('videoSourceTag').innerText = item.type_name || '全网高清';
        document.getElementById('videoDetailName').innerText = item.vod_name + ' (' + (item.vod_year || '未知年份') + ')';
        document.getElementById('videoDetailMeta').innerText = (item.vod_area || '') + ' · ' + (item.type_name || '') + ' · 演员: ' + (item.vod_actor ? item.vod_actor.slice(0, 36) + '...' : '暂无');
        document.getElementById('videoDetailDesc').innerText = item.vod_content ? item.vod_content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : (item.vod_remarks || '暂无详细简介');

        window.renderVideoSourceTabs(parsedGroups);
        window.renderVideoEpisodes(0);
        window.playVideoEpisode(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.renderVideoSourceTabs = function(groups) {
        const tabsBox = document.getElementById('videoPlaySourceTabs');
        if (!tabsBox) return;
        if (!groups || groups.length === 0) {
            tabsBox.innerHTML = '';
            return;
        }

        tabsBox.innerHTML = groups.map((g, idx) => `
            <button class="btn ${idx === window.currentGroupIdx ? 'primary' : ''}" style="padding:4px 10px; font-size:11px;" onclick="window.switchPlayGroup(${idx})">
                <i class="fas fa-play-circle"></i> ${g.name.toUpperCase()}
            </button>
        `).join('');
    };

    window.switchPlayGroup = function(groupIdx) {
        window.currentGroupIdx = groupIdx;
        document.querySelectorAll('#videoPlaySourceTabs button').forEach(b => b.classList.remove('primary'));
        const tabsBox = document.getElementById('videoPlaySourceTabs');
        if (tabsBox && tabsBox.children[groupIdx]) {
            tabsBox.children[groupIdx].classList.add('primary');
        }
        window.renderVideoEpisodes(groupIdx);
        window.playVideoEpisode(0);
    };

    window.renderVideoEpisodes = function(groupIdx) {
        const epBox = document.getElementById('videoEpisodesList');
        if (!epBox || !window.currentVideo || !window.currentVideo.groups) return;

        const group = window.currentVideo.groups[groupIdx] || window.currentVideo.groups[0];
        if (!group || !group.episodes || group.episodes.length === 0) {
            epBox.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:10px;">该线路暂无集数</div>';
            return;
        }

        epBox.innerHTML = group.episodes.map((ep, idx) => `
            <button class="chap-btn ${idx === window.currentEpisodeIdx ? 'read-active' : ''}" id="epBtn_${idx}" onclick="window.playVideoEpisode(${idx})">
                ${ep.title}
            </button>
        `).join('');
    };

    window.playVideoEpisode = function(idx) {
        if (!window.currentVideo || !window.currentVideo.groups) return;
        const group = window.currentVideo.groups[window.currentGroupIdx] || window.currentVideo.groups[0];
        if (!group || !group.episodes || !group.episodes[idx]) return;

        window.currentEpisodeIdx = idx;
        const ep = group.episodes[idx];

        document.querySelectorAll('#videoEpisodesList .chap-btn').forEach(btn => btn.classList.remove('read-active'));
        const activeBtn = document.getElementById('epBtn_' + idx);
        if (activeBtn) activeBtn.classList.add('read-active');

        const badge = document.getElementById('currentEpisodeBadge');
        if (badge) badge.innerText = group.name + ' · ' + ep.title;

        const container = document.getElementById('dplayerContainer');
        if (!container) return;

        if (window.dpInstance) {
            try { window.dpInstance.destroy(); } catch(e){}
            window.dpInstance = null;
        }

        const videoUrl = ep.url;
        const isHls = videoUrl.includes('.m3u8');
        const danmakuId = 'vod_' + (window.currentVideo.vod_id || window.currentVideo.id || 'common') + '_ep_' + idx;

        window.dpInstance = new DPlayer({
            container: container,
            autoplay: true,
            theme: '#2dd4c0',
            loop: false,
            lang: 'zh-cn',
            screenshot: true,
            hotkey: true,
            preload: 'auto',
            volume: 0.8,
            playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
            video: {
                url: videoUrl,
                type: isHls ? 'customHls' : 'auto',
                customType: {
                    customHls: function (video, player) {
                        if (window.Hls && window.Hls.isSupported()) {
                            const hls = new window.Hls({
                                enableWorker: true,
                                lowLatencyMode: true
                            });
                            hls.loadSource(video.src);
                            hls.attachMedia(video);
                        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                            video.src = videoUrl;
                        }
                    }
                }
            },
            danmaku: {
                id: danmakuId,
                api: 'https://dplayer.bilibili.com/v3/bili/',
                user: 'OpenReader_Guest',
                bottom: '15%',
                unlimited: true
            }
        });
    };

    window.closeVideoPlayer = function() {
        if (window.dpInstance) {
            try {
                window.dpInstance.pause();
                window.dpInstance.destroy();
            } catch(e){}
            window.dpInstance = null;
        }
        document.getElementById('videoPlayerView').style.display = 'none';
        document.getElementById('videoSection').style.display = 'block';
    };
})();
