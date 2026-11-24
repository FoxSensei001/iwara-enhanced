// 作者页内切换（视频 / 图片 / 发布 / 播放列表 / 关注中 / 粉丝 …）时的滚动位置：
// 站点的路由每次切换都会把页面滚回顶端；这里改成回到「列表顶部」——头部（横幅 + 头像栏）下面（见 88-site.js 的 scrollListTop）。
// 还看得到头部时就停在原处；用户自己滚动 / 点击 / 按键就立刻放手（不和用户抢）。

(() => {
  const who = (path) => { const m = path.match(/^\/profile\/([^/?#]+)/); return m && m[1]; };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="/profile/"]');
    if (!a || a.target === '_blank') return;
    const to = new URL(a.href, location.origin);
    if (!who(location.pathname) || who(location.pathname) !== who(to.pathname)) return;
    if (to.pathname === location.pathname) return;
    if (a.closest('[data-iwe-pager-card]')) return; // 卡片里的作者链接是「去看这个作者」，不是切标签
    scrollListTop();
  }, true);
})();
