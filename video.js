// --- 影视模块独立纯净脚本 (kanju无广模式) ---
(function() {
    window.currentVideoList = [];
    window.currentVideo = null;
    window.currentHls = null;
    window.currentEpisodeIdx = 0;
    window.currentVideoSource = 'liangzi';

    window.loadVideoFeed = async function(source = 'liangzi') {
        window.currentVideoSource = source;
        const grid = document.getElementById('videoGrid');
        const titleBadge = document.getElementById('videoSectionTitle');
        const countBadge = document.getElementById('videoCountBadge');
        if (titleBadge) {
            const srcName = (source === 'liangzi') ? '量子影院' : ((source === 'feifan') ? '非凡影院' : '暴风影院');
            titleBadge.innerHTML = '<i class="fas fa-fire" style="color:#f59e0b;"></i> 热播精选推荐 (' + srcName + ')';
        }
        if (grid) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;"><i class="fas fa-spinner fa-spin"></i> 正在加载热播精选推荐...</div>';
        }

        try {
            const apiBase = (source === 'liangzi') ? 'https://cj.lziapi.com' : ((source === 'feifan') ? 'https://api.ffzyapi.com' : 'https://bfzyapi.com');
            const res = await fetch(apiBase + '/api.php/provide/vod/?ac=detail&pg=1');
            const data = await res.json();
            window.currentVideoList = data.list || [];
            if (countBadge) countBadge.innerText = '共 ' + window.currentVideoList.length + ' 部热片';
            window.renderVideoGrid(window.currentVideoList);
        } catch(e) {
            if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red; padding:30px;">加载推荐失败: ' + e.message + '</div>';
        }
    };

    window.doVideoSearch = async function() {
        const input = document.getElementById('videoSearchInput');
        const wd = input ? input.value.trim() : '';
        if (!wd) return;

        const grid = document.getElementById('videoGrid');
        const titleBadge = document.getElementById('videoSectionTitle');
        const countBadge = document.getElementById('videoCountBadge');
        if (titleBadge) titleBadge.innerHTML = '<i class="fas fa-search" style="color:var(--accent);"></i> 搜索《' + wd + '》结果';
        if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;"><i class="fas fa-spinner fa-spin"></i> 正在全网检索片源...</div>';

        try {
            const apiBase = (window.currentVideoSource === 'liangzi') ? 'https://cj.lziapi.com' : ((window.currentVideoSource === 'feifan') ? 'https://api.ffzyapi.com' : 'https://bfzyapi.com');
            const res = await fetch(apiBase + '/api.php/provide/vod/?ac=detail&wd=' + encodeURIComponent(wd));
            const data = await res.json();
            window.currentVideoList = data.list || [];
            if (countBadge) countBadge.innerText = '检索到 ' + window.currentVideoList.length + ' 个结果';
            if (window.currentVideoList.length === 0) {
                if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂未找到匹配影视，可尝试简短关键词或切换线路。</div>';
                return;
            }
            window.renderVideoGrid(window.currentVideoList);
        } catch(e) {
            if (grid) grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:red; padding:30px;">搜索失败: ' + e.message + '</div>';
        }
    };

    window.renderVideoGrid = function(list) {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        if (!list || list.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:40px;">暂无影视内容</div>';
            return;
        }

        grid.innerHTML = list.map((item, idx) => {
            const pic = item.vod_pic || 'https://api.iconify.design/lucide:film.svg?color=%23555';
            const remark = item.vod_remarks || (item.vod_year || '高清');
            const type = item.type_name || '影视';
            return `
                <div class="video-card" onclick="window.openVideoDetail(${idx})">
                    <div class="video-thumb-wrap">
                        <img src="${pic}" alt="${item.vod_name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.src='https://api.iconify.design/lucide:film.svg?color=%23888'" />
                        <span class="video-badge">${remark}</span>
                    </div>
                    <div class="video-card-body">
                        <div class="video-card-title" title="${item.vod_name}">${item.vod_name}</div>
                        <div class="video-card-sub">${type} · ${item.vod_year || ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    };

    window.openVideoDetail = function(index) {
        const item = window.currentVideoList[index];
        if (!item) return;
        window.currentVideo = item;

        const groups = (item.vod_play_url || '').split('$$$');
        let selectedGroup = groups[0] || '';
        for (const g of groups) {
            if (g.includes('.m3u8')) {
                selectedGroup = g;
                break;
            }
        }

        const episodes = selectedGroup.split('#').filter(Boolean).map(e => {
            const p = e.split('$');
            return {
                title: p[0] || '正片',
                url: p[1] || p[0]
            };
        });

        window.currentVideo.episodes = episodes;

        document.getElementById('videoSection').style.display = 'none';
        document.getElementById('videoPlayerView').style.display = 'block';

        document.getElementById('videoPlayerTitle').innerText = item.vod_name;
        document.getElementById('videoSourceTag').innerText = item.type_name || '高清无广';
        document.getElementById('videoDetailName').innerText = item.vod_name + ' (' + (item.vod_year || '未知') + ')';
        document.getElementById('videoDetailMeta').innerText = (item.vod_area || '') + ' · ' + (item.type_name || '') + ' · 演员: ' + (item.vod_actor ? item.vod_actor.slice(0, 36) + '...' : '暂无');
        document.getElementById('videoDetailDesc').innerText = item.vod_content ? item.vod_content.replace(/<[^>]+>/g, '').slice(0, 140) + '...' : (item.vod_remarks || '暂无详细简介');

        window.renderVideoEpisodes(episodes);
        window.playVideoEpisode(0);
    };

    window.renderVideoEpisodes = function(episodes) {
        const epBox = document.getElementById('videoEpisodesList');
        if (!epBox) return;
        if (!episodes || episodes.length === 0) {
            epBox.innerHTML = '<div style="color:var(--text-muted); font-size:12px; padding:10px;">暂无可播放剧集</div>';
            return;
        }

        epBox.innerHTML = episodes.map((ep, idx) => `
            <button class="chap-btn ${idx === window.currentEpisodeIdx ? 'read-active' : ''}" id="epBtn_${idx}" onclick="window.playVideoEpisode(${idx})">
                ${ep.title}
            </button>
        `).join('');
    };

    window.playVideoEpisode = function(idx) {
        if (!window.currentVideo || !window.currentVideo.episodes || !window.currentVideo.episodes[idx]) return;
        window.currentEpisodeIdx = idx;
        const ep = window.currentVideo.episodes[idx];

        document.querySelectorAll('#videoEpisodesList .chap-btn').forEach(btn => btn.classList.remove('read-active'));
        const activeBtn = document.getElementById('epBtn_' + idx);
        if (activeBtn) activeBtn.classList.add('read-active');

        const badge = document.getElementById('currentEpisodeBadge');
        if (badge) badge.innerText = ep.title;

        const video = document.getElementById('hlsVideoPlayer');
        if (!video) return;

        if (window.currentHls) {
            window.currentHls.destroy();
            window.currentHls = null;
        }

        const videoUrl = ep.url;
        if (videoUrl.includes('.m3u8')) {
            if (window.Hls && window.Hls.isSupported()) {
                window.currentHls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                window.currentHls.loadSource(videoUrl);
                window.currentHls.attachMedia(video);
                window.currentHls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {});
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoUrl;
                video.addEventListener('loadedmetadata', () => {
                    video.play().catch(() => {});
                });
            }
        } else {
            video.src = videoUrl;
            video.play().catch(() => {});
        }
    };

    window.closeVideoPlayer = function() {
        const video = document.getElementById('hlsVideoPlayer');
        if (video) {
            video.pause();
            video.src = '';
        }
        if (window.currentHls) {
            window.currentHls.destroy();
            window.currentHls = null;
        }
        document.getElementById('videoPlayerView').style.display = 'none';
        document.getElementById('videoSection').style.display = 'block';
    };
})();
