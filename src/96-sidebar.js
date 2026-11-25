// 侧栏增强：
// A. 展开态侧栏里「语言 / 评级 / 主题」三组单选占了大半屏：收进侧栏底部一排图标按钮，点开小菜单切换；主题多一个「跟随系统」。
//    切换一律去点站点自己藏起来的单选（让站点自己保存、自己生效），不直接改它的存储。
//    收起态站点本来就只显示三个小图标，点了会展开侧栏，展开后看到的就是这排按钮，所以收起态不动。
// B. 侧栏「论坛」像「视频」「图片」一样加一个子菜单，里面是「最近」：全站最新的帖子列表。
//
// 站点侧栏结构：.page > .menu（展开时多 menu--open，点 .header__menu 切换）。
// 展开态三组单选各在一个 .menu > form.menu__form 里：input[name=locale|rating|theme]。
// 「视频」项：li > div.menu__item > (a + button)，点 button 后 li 里出现 ul.menu__children。

(() => {
  defineStrings(
    {
      sb_lang: '语言', sb_rating: '评级', sb_theme: '主题',
      sb_rating_all: '全部', sb_rating_general: '普通', sb_rating_ecchi: '成人',
      sb_theme_system: '跟随系统', sb_theme_light: '白天', sb_theme_dark: '夜晚', sb_theme_auto_short: '自动',
      sb_recent: '最近', sb_recent_title: '最近', sb_recent_empty: '暂无帖子', sb_recent_failed: '加载失败',
      sb_col_thread: '主题', sb_col_posts: '发布', sb_col_views: '观看人数', sb_col_last: '最新发布', sb_by: '由', sb_last_page: '查看最后一页',
    },
    {
      sb_lang: 'Language', sb_rating: 'Rating', sb_theme: 'Theme',
      sb_rating_all: 'All', sb_rating_general: 'General', sb_rating_ecchi: 'Ecchi',
      sb_theme_system: 'System', sb_theme_light: 'Light', sb_theme_dark: 'Dark', sb_theme_auto_short: 'Auto',
      sb_recent: 'Recent', sb_recent_title: 'Recent', sb_recent_empty: 'No threads yet', sb_recent_failed: 'Failed to load',
      sb_col_thread: 'Thread', sb_col_posts: 'Posts', sb_col_views: 'Views', sb_col_last: 'Last post', sb_by: 'by', sb_last_page: 'Last page',
    },
    {
      sb_lang: '言語', sb_rating: 'レーティング', sb_theme: 'テーマ',
      sb_rating_all: 'すべて', sb_rating_general: '一般', sb_rating_ecchi: '成人向け',
      sb_theme_system: 'システム', sb_theme_light: 'ライト', sb_theme_dark: 'ダーク', sb_theme_auto_short: '自動',
      sb_recent: '最近', sb_recent_title: '最近', sb_recent_empty: 'まだ投稿がありません', sb_recent_failed: '読み込みに失敗しました',
      sb_col_thread: 'スレッド', sb_col_posts: '投稿', sb_col_views: '閲覧数', sb_col_last: '最新の投稿', sb_by: '投稿者：', sb_last_page: '最後のページを見る',
    }
  );

  const LANGS = [['en', 'English'], ['ja', '日本語'], ['zh', '中文']];
  const RATINGS = ['all', 'general', 'ecchi'];
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');

  // ── 主题「跟随系统」──────────────────────────────────────────────
  // 这段在 document-start 执行：站点还没读自己的主题设置，先把它改成系统当前的明暗，打开页面就是对的，不会闪一下。
  const themeMode = () => store.get('themeMode', 'system'); // system：跟随系统（默认）；site：照站点自己的设置（用户手选白天 / 夜晚后写入）
  if (themeMode() === 'system') {
    try { localStorage.setItem('theme', darkQuery.matches ? 'dark' : 'light'); } catch { /* 忽略 */ }
  }
  // 页面开着时系统切了明暗：去点站点的主题单选（收起态时单选不在页面上，临时展开一下）
  darkQuery.addEventListener('change', () => { if (themeMode() === 'system') pickRadio('theme', darkQuery.matches ? 'dark' : 'light'); });

  const menuEl = () => document.querySelector('.page > .menu');
  const radio = (name, value) => document.querySelector(`.menu input[type=radio][name="${name}"][value="${value}"]`);
  const current = (name) => (document.querySelector(`.menu input[type=radio][name="${name}"]:checked`) || {}).value || localStorage.getItem(name);

  function pickRadio(name, value) {
    const el = radio(name, value);
    if (el) { if (!el.checked) el.click(); return; }
    // 收起态单选不在页面上：临时展开、点选、再收起，让站点自己保存。期间关掉过渡并藏起侧栏，免得闪一下
    const toggle = document.querySelector('.header__menu');
    if (!toggle) return;
    const root = document.documentElement;
    root.classList.add('iwe-sb-quiet');
    toggle.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const r = radio(name, value);
      if (r && !r.checked) r.click();
      toggle.click();
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('iwe-sb-quiet')));
    }));
  }

  // ── 小菜单 ─────────────────────────────────────────────────────────
  let popover = null;
  let hoverTimer = 0;
  // 有鼠标的设备：悬停就开菜单、移开收起；触屏：点一下开、再点收起
  const canHover = () => matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduced = () => matchMedia('(prefers-reduced-motion:reduce)').matches;
  function closePopover(instant) {
    clearTimeout(hoverTimer);
    if (!popover) return;
    const p = popover;
    popover = null;
    removeEventListener('pointerdown', onOutside, true);
    removeEventListener('keydown', onKey, true);
    if (instant === true || reduced()) { p.remove(); return; }
    p.classList.add('out'); // 收起也有动画，播完再摘
    p.addEventListener('animationend', () => p.remove(), { once: true });
    setTimeout(() => p.remove(), 300);
  }
  const holdPopover = () => clearTimeout(hoverTimer);
  const releasePopover = () => { clearTimeout(hoverTimer); hoverTimer = setTimeout(closePopover, 200); };
  const onOutside = (e) => { if (popover && !popover.contains(e.target) && !e.target.closest('.iwe-sb-btn')) closePopover(); };
  const onKey = (e) => { if (e.key === 'Escape') closePopover(); };

  function openPopover(anchor, items, toggle) {
    const again = popover && popover.dataset.for === anchor.dataset.kind;
    if (again) { if (toggle) closePopover(); else holdPopover(); return; } // 点同一个按钮 = 收起；悬停时已经开着就不动
    closePopover(true);
    document.querySelectorAll('.iwe-sb-pop.out').forEach((e) => e.remove());
    popover = h('div.iwe-sb-pop', { role: 'menu', onpointerenter: holdPopover, onpointerleave: (e) => { if (e.pointerType === 'mouse') releasePopover(); } }, items.map((it) =>
      h('button.iwe-sb-item' + (it.on ? '.on' : ''), { type: 'button', role: 'menuitemradio', 'aria-checked': String(!!it.on), onclick: () => { closePopover(); it.pick(); } },
        h('span.iwe-sb-ico', it.icon), h('span.iwe-sb-label', it.label), h('span.iwe-sb-check', it.on ? icon('check', 14) : null))));
    popover.dataset.for = anchor.dataset.kind;
    popover.dataset.open = String(!anchor.closest('.menu:not(.menu--open)'));
    document.body.append(popover);
    // 展开态按钮在侧栏底部：菜单往上开、左边与按钮对齐；收起态按钮是窄窄一列图标：菜单开在它右边。放不下就换方向，并夹在视口内
    const r = anchor.getBoundingClientRect(), pr = popover.getBoundingClientRect();
    const side = !!anchor.closest('.menu:not(.menu--open)');
    let top, left;
    if (side) { top = Math.min(r.top, innerHeight - pr.height - 8); left = r.right + 8; }
    else {
      top = r.top - pr.height - 6;
      if (top < 8) top = Math.min(r.bottom + 6, innerHeight - pr.height - 8);
      left = Math.max(8, Math.min(r.left, innerWidth - pr.width - 8));
    }
    popover.style.top = Math.max(8, top) + 'px';
    popover.style.left = left + 'px';
    addEventListener('pointerdown', onOutside, true);
    addEventListener('keydown', onKey, true);
  }

  const svg = (s) => { const t = document.createElement('template'); t.innerHTML = s; return t.content.firstChild; };
  // 实心图标：与站点自己侧栏的图标同一套（Font Awesome Free 6 · Solid，CC BY 4.0，https://fontawesome.com/license/free），大小与笔画粗细才会一致
  const FA = {
    clock: [512, 512, 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z'],
    globe: [512, 512, 'M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z'],
    layers: [576, 512, 'M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z'],
    half: [512, 512, 'M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z'],
    sun: [24, 24, '<circle cx="12" cy="12" r="5.2"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(0 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(45 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(90 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(135 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(180 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(225 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(270 12 12)"/><path d="M12 1.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-2.8 0V3A1.4 1.4 0 0 1 12 1.6Z" transform="rotate(315 12 12)"/>'], // 自画的实心太阳：Font Awesome 的 sun 缩小后像齿轮，会被当成「设置」
    moon: [384, 512, 'M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z'],
    eye: [576, 512, 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'],
    flame: [448, 512, 'M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z'],
  };
  const fa = (name, n) => { const [w, h, d] = FA[name]; return svg(`<svg viewBox="0 0 ${w} ${h}" width="${n}" height="${n}" fill="currentColor" aria-hidden="true" focusable="false">${d[0] === '<' ? d : `<path d="${d}"/>`}</svg>`); };
  const THEME_ICON = { system: 'half', light: 'sun', dark: 'moon' };
  const RATING_ICON = { all: 'layers', general: 'eye', ecchi: 'flame' };

  function langLabel(v) { return (LANGS.find((x) => x[0] === v) || [v, v])[1]; }

  function buildBar() {
    const bar = h('div.iwe-sb-bar');
    const btn = (kind, title, build) => {
      const b = h('button.iwe-sb-btn', { type: 'button', title, 'aria-label': title, 'aria-haspopup': 'menu',
        onclick: (e) => openPopover(e.currentTarget, build(), !canHover()),
        onpointerenter: (e) => { if (e.pointerType === 'mouse') { holdPopover(); openPopover(e.currentTarget, build(), false); } },
        onpointerleave: (e) => { if (e.pointerType === 'mouse') releasePopover(); } });
      b.dataset.kind = kind;
      return b;
    };
    const lang = btn('lang', t('sb_lang'), () => (LANGS.map(([v, label]) => ({ label, icon: fa('globe', 16), on: current('locale') === v, pick: () => pickRadio('locale', v) }))));
    const rating = btn('rating', t('sb_rating'), () => (RATINGS.map((v) => ({ label: t('sb_rating_' + v), icon: fa(RATING_ICON[v], 16), on: current('rating') === v, pick: () => pickRadio('rating', v) }))));
    const theme = btn('theme', t('sb_theme'), () => {
      const mode = themeMode();
      return ([
        { label: t('sb_theme_system'), icon: fa('half', 16), on: mode === 'system', pick: () => { store.set('themeMode', 'system'); pickRadio('theme', darkQuery.matches ? 'dark' : 'light'); refresh(); } },
        { label: t('sb_theme_light'), icon: fa('sun', 16), on: mode !== 'system' && current('theme') === 'light', pick: () => { store.set('themeMode', 'site'); pickRadio('theme', 'light'); } },
        { label: t('sb_theme_dark'), icon: fa('moon', 16), on: mode !== 'system' && current('theme') === 'dark', pick: () => { store.set('themeMode', 'site'); pickRadio('theme', 'dark'); } },
      ]);
    });
    bar.append(lang, rating, theme);
    // 按钮上显示当前值，扫一眼就知道现在是什么设置
    function refresh() {
      const lv = current('locale'), rv = current('rating'), tv = current('theme'), sys = themeMode() === 'system';
      const tk = sys ? 'system' : tv === 'dark' ? 'dark' : 'light';
      lang.replaceChildren(fa('globe', 18), h('span', langLabel(lv)));
      rating.replaceChildren(fa(RATING_ICON[RATINGS.includes(rv) ? rv : 'all'], 18), h('span', t('sb_rating_' + (RATINGS.includes(rv) ? rv : 'all'))));
      theme.replaceChildren(fa(THEME_ICON[tk], 18), h('span', t(sys ? 'sb_theme_auto_short' : 'sb_theme_' + tk)));
      bar.dataset.sig = [lv, rv, tv, sys].join('|');
    }
    refresh();
    bar.refresh = refresh;
    return bar;
  }

  // 收起态没有单选，站点只放三个会展开侧栏的图标钮；这里换成我们的竖排图标（站点那三个只用样式藏起来）。
  // 收起态下选完一项要借「展开→点单选→收起」才能让站点自己保存：这一瞬间用 iwe-sb-quiet 关掉过渡并藏起侧栏，免得闪一下
  site.register('sidebar', {
    css: `
.page > .menu.menu--open > form.menu__form,.page > .menu:not(.menu--open) > ul.menu__option__toggle{display:none!important}
html.iwe-sb-quiet .page > .menu,html.iwe-sb-quiet .page > .menu *{transition:none!important;animation:none!important}
html.iwe-sb-quiet .page > .menu.menu--open{visibility:hidden}
/* 侧栏是固定定位的滚动容器：改成纵向弹性布局，底栏 margin-top:auto 贴底；内容比屏幕长时靠 sticky 仍钉在可视区底部。
   只在站点自己显示侧栏的时候改（≥992px，或手机上点开后 menu--open）：站点在窄屏默认 display:none，不能被我们盖掉 */
@media (min-width:992px){.page > .menu{display:flex;flex-direction:column}}
.page > .menu.menu--open{display:flex;flex-direction:column}
.page > .menu > *{flex:none}
.iwe-sb-bar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;padding:8px 8px 16px;margin-top:auto;position:sticky;bottom:0;background:inherit;border-top:1px solid rgba(128,128,128,.28)}
.iwe-sb-btn{appearance:none;display:flex;align-items:center;justify-content:center;gap:5px;min-width:0;height:40px;padding:0 4px;border:0;border-radius:5px;background:transparent;color:inherit;font:13px/1 Roboto,Arial,sans-serif;cursor:pointer;transition:background .15s}
.iwe-sb-btn:hover,.iwe-sb-btn[aria-expanded=true]{background:rgba(128,128,128,.22)}
.iwe-sb-btn:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}
.iwe-sb-btn span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.iwe-sb-btn svg{flex:none}
.page > .menu:not(.menu--open) .iwe-sb-bar{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0 16px;border-top:0}
.page > .menu:not(.menu--open) .iwe-sb-btn{width:44px;padding:0}
.page > .menu:not(.menu--open) .iwe-sb-btn span{display:none}
.iwe-sb-pop{position:fixed;z-index:10050;min-width:164px;padding:4px;border-radius:10px;background:var(--card);color:var(--fg);border:1px solid var(--line);box-shadow:var(--shadow);font-size:14px;animation:iwe-sb-in .14s var(--ease)}
@keyframes iwe-sb-in{from{opacity:0;transform:translateY(4px) scale(.98)}}
@keyframes iwe-sb-out{to{opacity:0;transform:translateY(4px) scale(.98)}}
.iwe-sb-pop.out{animation:iwe-sb-out .12s var(--ease) forwards;pointer-events:none}
@media (prefers-reduced-motion:reduce){.iwe-sb-pop,.iwe-sb-pop.out{animation:none}}
.iwe-sb-item{appearance:none;display:flex;align-items:center;gap:10px;width:100%;height:36px;padding:0 10px;border:0;border-radius:5px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}
.iwe-sb-item:hover{background:var(--sunk)}
.iwe-sb-item.on{font-weight:600}
.iwe-sb-ico{display:inline-flex;flex:none;color:var(--fg2)}
.iwe-sb-label{flex:1;white-space:nowrap}
.iwe-sb-check{display:inline-flex;flex:none;width:14px;color:var(--blue)}
.page > .menu:not(.menu--open) .iwe-forum-toggle,.page > .menu:not(.menu--open) .iwe-forum-children{display:none}
.iwe-forum-toggle{cursor:pointer}
`,
    scan() {
      const menu = menuEl();
      if (!menu) { closePopover(); return; }
      // 侧栏展开 / 收起时按钮挪了位置：开着的弹层跟不上，直接关掉
      if (popover && popover.dataset.open !== String(menu.classList.contains('menu--open'))) closePopover();
      let bar = menu.querySelector(':scope > .iwe-sb-bar');
      if (!bar) { bar = buildBar(); menu.append(bar); }
      // 站点把单选的值改了（包括我们点的）：按钮上的文字跟着变。收起态单选不在页面上，取本地存的值
      const sig = [current('locale'), current('rating'), current('theme'), themeMode() === 'system'].join('|');
      if (bar.dataset.sig !== sig) bar.refresh();
      if (menu.lastElementChild !== bar) menu.append(bar); // 站点重渲染后可能在后面又插了东西：保持在最底下
    },
    leave: () => closePopover(true),
  });

  // ── 论坛子菜单 ───────────────────────────────────────────────────
  const RECENT_HREF = '/forum?iwe=recent';
  const isRecent = () => location.pathname === '/forum' && new URLSearchParams(location.search).get('iwe') === 'recent';
  const recentPage = () => Math.max(0, parseInt(new URLSearchParams(location.search).get('page') || '0', 10) || 0);
  const recentHref = (page) => RECENT_HREF + (page > 0 ? '&page=' + page : '');
  function go(href) {
    history.pushState({}, '', href);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollTo(0, 0);
    site.schedule();
  }

  // ── 页脚「最近的论坛帖子」：标题变成链接，点了进我们的「最近」页 ────────────────
  // 站点页脚结构：卡片里依次是 图标(.icon)、标题(.text，加粗)、ul.footer__threads。标题不是 <a>，
  // 所以这里不换节点（站点以后还要在上面更新文字），只加样式、点击和键盘处理；Ctrl / Cmd / 中键仍在新标签打开。
  site.register('footerRecent', {
    css: `
.iwe-footer-recent{cursor:pointer;color:var(--primary,#1ab394)!important}
.iwe-footer-recent:hover,.iwe-footer-recent:focus-visible{text-decoration:underline}
.iwe-footer-recent:focus-visible{outline:2px solid currentColor;outline-offset:2px;border-radius:3px}
`,
    scan() {
      const ul = document.querySelector('.footer ul.footer__threads');
      const title = ul && ul.previousElementSibling;
      if (!title || title.dataset.iweRecent) return;
      title.dataset.iweRecent = '1';
      const icon = title.previousElementSibling && title.previousElementSibling.classList.contains('icon') ? title.previousElementSibling : null;
      const open = (e) => {
        if (e.type === 'auxclick' ? e.button !== 1 : e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.type === 'auxclick') { window.open(RECENT_HREF, '_blank'); return; }
        e.preventDefault(); e.stopPropagation();
        go(RECENT_HREF);
      };
      for (const el of [title, icon].filter(Boolean)) {
        el.classList.add('iwe-footer-recent');
        el.setAttribute('role', 'link'); el.tabIndex = 0;
        el.addEventListener('click', open);
        el.addEventListener('auxclick', open);
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(RECENT_HREF); } });
      }
    },
  });

  site.register('forumMenu', {
    // 子项缩进：站点自己「视频」下的子项和上一级同样从 24px 起（只有一个空图标位撑出 8px），看不出层级。
    // 「最近」让图标对齐到上一级文字的起点（24px 内边距 + 25px 图标列 + 16px 间距 = 65px），一眼就是下一层。
    css: `
.page > .menu ul.iwe-forum-children > li > a{padding-left:65px}
.iwe-forum-children .icon{display:inline-flex;align-items:center;justify-content:center;width:16px;opacity:.8}
`,
    scan() {
      const menu = menuEl();
      const link = menu && menu.querySelector('.menu__item > a[href="/forum"]');
      if (!link || !menu.classList.contains('menu--open')) return;
      const item = link.parentElement, li = item.parentElement;
      if (!item.querySelector(':scope > .iwe-forum-toggle')) {
        // 箭头照抄「视频」项那个按钮的图标，样式由站点的 .menu__item > button 规则管
        const videoBtn = menu.querySelector('.menu__item > a[href="/videos"] + button');
        const btn = h('button.iwe-forum-toggle', { type: 'button', 'aria-label': t('sb_recent'), onclick: (e) => { e.preventDefault(); store.set('forumSubOpen', !store.get('forumSubOpen', false)); site.schedule(); } });
        if (videoBtn) btn.innerHTML = videoBtn.innerHTML; else btn.append(icon('chevronDown', 16));
        item.append(btn);
      }
      const open = store.get('forumSubOpen', false) || isRecent();
      let sub = li.querySelector(':scope > .iwe-forum-children');
      if (open && !sub) {
        const a = h('a', { href: RECENT_HREF, onclick: (e) => { e.preventDefault(); go(RECENT_HREF); } },
          h('div.icon.mr-2', fa('clock', 20)), h('div.text.text--inline', t('sb_recent')));
        sub = h('ul.menu__children.iwe-forum-children', h('li', a));
        li.append(sub);
      } else if (!open && sub) sub.remove();
      const btn = item.querySelector(':scope > .iwe-forum-toggle');
      if (btn) btn.style.transform = open ? 'rotate(180deg)' : '';
      // 在「最近」页时，子项高亮、论坛项不再显示为当前页
      if (sub) sub.querySelector('a').classList.toggle('active', isRecent());
    },
  });

  // ── 「最近」页 ─────────────────────────────────────────────────────
  // 地址是 /forum?iwe=recent[&page=N]（N 从 0 起，和站点其余列表的 page 一致）：
  // 站点照常渲染论坛首页，我们把内容区里站点的东西藏起来（只藏不删），换上自己的整页：
  // 面包屑 + 标题 + 与板块页同款的表头和行 + 分页条。分页条、模式切换、模式设置全部来自 92-pager.js 的 iwePagerKit。
  // 接口 /forum/threads?page=N&limit=20 里的 count 是全站帖子总数（page=571 只剩 12 条，count=11432），可以算出总页数。
  const PAGE_LIMIT = 20;
  let recent = null; // 当前页面的状态，见 build()
  const rtf = () => new Intl.RelativeTimeFormat(uiLocale(), { numeric: 'auto' });
  function ago(iso) {
    const s = (new Date(iso).getTime() - Date.now()) / 1000;
    const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [u, sec] of units) if (Math.abs(s) >= sec) return rtf().format(Math.round(s / sec), u);
    return rtf().format(Math.round(s), 'second');
  }
  const kNum = (n) => { n = +n || 0; return n < 1000 ? String(n) : n < 1e6 ? (n / 1e3).toFixed(1) + 'K' : (n / 1e6).toFixed(1) + 'M'; };
  const threadHref = (th) => `/forum/${th.section}/${th.id}/${th.slug || ''}`;
  const userLink = (u) => (u ? h('a.username.d-inline', { href: '/profile/' + u.username, title: u.name }, h('div.text.text--inline.text--small', u.name || u.username)) : null);

  function row(th) {
    const last = th.lastPost;
    const lastPage = Math.max(1, Math.ceil((th.numPosts || 1) / 20));
    return h('div.row.page-forumSection__thread',
      h('div.col-6.col-sm-5',
        h('div.text.text--bold', th.locked ? h('div.icon.mr-2', icon('lock', 14)) : null, h('a', { href: threadHref(th) }, th.title)),
        h('div.page-forumSection__thread__bottom',
          h('div.text.text--small', h('a', { href: '/forum/' + th.section }, th.section)),
          h('div.text.text--small.ml-2', ago(th.createdAt)),
          lastPage > 1 && h('a.ml-2', { href: threadHref(th) + '?page=' + (lastPage - 1) }, h('div.text.text--small', t('sb_last_page'))))),
      h('div.col-3.col-sm-2', String(th.numPosts ?? 0)),
      h('div.col-3.col-sm-2', kNum(th.numViews)),
      h('div.col-3.d-none.d-sm-block', last ? h('div',
        h('div.text.text--muted.text--small', ago(last.createdAt || th.updatedAt)),
        h('div.text.text--small', t('sb_by') + ' ', userLink(last.user))) : null));
  }

  const fetchPage = (page) => api.call(`/forum/threads?page=${page}&limit=${PAGE_LIMIT}`, { auth: 'auto' });
  // 加载中的骨架：与帖子行同样的版式，两条灰条带高光流动；整块淡入。加载完成后被真实行替换（真实行再依次淡入上移）
  const skeleton = () => h('div.iwe-skel-list', { 'aria-busy': 'true', role: 'status' },
    Array.from({ length: 8 }, (_, i) => h('div.iwe-skel-row', h('div.iwe-skel-line.w1', { style: { maxWidth: (46 + ((i * 17) % 30)) + '%' } }), h('div.iwe-skel-line.w2'))));
  const rowsIn = (list) => list.map((x, i) => { const e = row(x); e.style.setProperty('--i', String(Math.min(i, 12))); return e; });
  const noteRow = (text) => h('div.text.text--muted', { style: { padding: '24px 12px' } }, text);

  // 传统分页：一次只显示一页，翻页走地址栏（浏览器前进 / 后退可用）
  async function loadPage(r, page) {
    r.rows.classList.add('iwe-recent__loading');
    const seq = r.seq;
    try {
      const j = await fetchPage(page);
      if (recent !== r || r.seq !== seq) return;
      const list = j.results || [];
      r.total = Math.max(1, Math.ceil((j.count || 0) / (j.limit || PAGE_LIMIT)));
      r.rows.replaceChildren(...(list.length ? rowsIn(list) : [noteRow(t('sb_recent_empty'))]));
    } catch (e) {
      if (recent !== r || r.seq !== seq) return;
      r.rows.replaceChildren(noteRow(t('sb_recent_failed') + (e && e.text ? sepColon() + e.text : '')));
    } finally {
      if (recent === r && r.seq === seq) {
        r.rows.classList.remove('iwe-recent__loading');
        iwePagerKit.fillBar(r.bar, { cur: page + 1, total: r.total, hasNext: r.total ? page + 1 < r.total : null, go: (n) => go(recentHref(n - 1)), canWaterfall: true });
      }
    }
  }

  // 瀑布流：从地址栏的页码起往后接，滚到底自动再拉
  function paintMore(r) {
    const w = r.wf;
    const text = w.failed ? t('pager_failed') : w.loading ? t('pager_loading') : w.done ? t('pager_noMore')
      : w.total ? t('pager_loadedOf', { cur: w.next, total: w.total }) : t('pager_loaded', { cur: w.next });
    iwePagerKit.fillMore(r.bar, { loading: w.loading, failed: w.failed, text, retry: () => loadMore(r) });
  }
  async function loadMore(r) {
    const w = r.wf;
    if (recent !== r || w.loading || w.done) return;
    w.loading = true; w.failed = false; paintMore(r);
    const seq = r.seq;
    try {
      const j = await fetchPage(w.next);
      if (recent !== r || r.seq !== seq) return;
      const list = j.results || [];
      r.rows.querySelector(':scope > .iwe-skel-list')?.remove();
      r.rows.append(...rowsIn(list));
      w.total = Math.max(1, Math.ceil((j.count || 0) / (j.limit || PAGE_LIMIT)));
      w.next++;
      w.done = !list.length || w.next >= w.total;
      if (!r.rows.children.length) r.rows.append(noteRow(t('sb_recent_empty')));
    } catch (e) {
      if (recent === r && r.seq === seq) { w.failed = true; r.rows.querySelector(':scope > .iwe-skel-list')?.remove(); console.error('[iwe] recent', e); }
    } finally {
      if (recent === r && r.seq === seq) {
        w.loading = false; paintMore(r);
        // 一屏没填满时哨兵还在视口里，观察器不会再触发：主动再拉
        if (!w.done && !w.failed) requestAnimationFrame(() => { if (r.bar.isConnected && r.bar.getBoundingClientRect().top < innerHeight + 600) loadMore(r); });
      }
    }
  }

  function teardown() {
    if (!recent) return;
    if (recent.io) recent.io.disconnect();
    recent.el.remove();
    document.querySelectorAll('.iwe-recent-on').forEach((el) => el.classList.remove('iwe-recent-on'));
    recent = null;
  }

  /** 按当前模式和地址栏页码（重新）加载。模式或页码变了才会走到这里。 */
  function reload(r) {
    r.seq++;
    r.mode = iwePagerKit.mode(); r.page = recentPage();
    r.rows.replaceChildren(skeleton()); // 一开始就显示骨架，不留空白页
    r.wf = { next: r.page, loading: false, done: false, failed: false, total: null };
    if (r.io) { r.io.disconnect(); r.io = null; }
    r.top.replaceChildren();
    if (r.mode === 'waterfall') {
      r.top.append(iwePagerKit.modeSwitch());
      paintMore(r);
      r.io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) loadMore(r); }, { rootMargin: '600px 0px' });
      r.io.observe(r.bar);
      loadMore(r);
    } else {
      loadPage(r, r.page);
    }
  }

  function build(section) {
    const forumLink = menuEl() && menuEl().querySelector('.menu__item > a[href="/forum"] .text');
    const rows = h('div.page-forumSection__threads.iwe-recent__rows');
    const bar = h('nav.iwe-pager', { 'aria-label': t('pager_traditional') }); // 不带 data-iwe-pager-bar：那个标记是 92 里「接管站点分页」的栏，会被它清理
    const top = h('div.iwe-pager-top');
    const el = h('div.iwe-recent.container-fluid',
      h('ul.breadcrumbs', h('li', h('a', { href: '/forum' }, (forumLink && forumLink.textContent.trim()) || 'Forum'))),
      h('div.text.text--h1.text--bold', t('sb_recent_title')),
      top,
      h('div.row.page-forumSection__header',
        h('div.col-6.col-sm-5', h('div.text.text--bold', t('sb_col_thread'))), h('div.col-3.col-sm-2', h('div.text.text--bold', t('sb_col_posts'))),
        h('div.col-3.col-sm-2', h('div.text.text--bold', t('sb_col_views'))), h('div.col-sm-3.d-none.d-sm-block', h('div.text.text--bold', t('sb_col_last')))),
      rows, bar);
    section.classList.add('iwe-recent-on');
    section.append(el);
    recent = { el, rows, bar, top, seq: 0, mode: null, page: -1, total: null, io: null, wf: null };
  }

  // 站内链接交给站点路由，不整页刷新（这些行是我们自己建的，没有站点的点击处理）
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('.iwe-recent .page-forumSection__thread a[href^="/"], .iwe-recent .breadcrumbs a[href^="/"]');
    if (!a) return;
    e.preventDefault();
    go(a.getAttribute('href'));
  }, true);

  // 模式在别处（顶部 / 底部的切换钮）改了：这一页按新模式重来
  if (iwePagerKit) iwePagerKit.onMode(() => { if (recent) { recent.mode = null; site.schedule(); } });

  site.register('forumRecent', {
    match: () => isRecent(),
    css: `
section.content.iwe-recent-on > :not(.iwe-recent){display:none!important}
.iwe-recent{padding-bottom:40px}
/* 板块页的样式随路由按需加载，从论坛首页进来时还没有：这里补上同款（取站点自己的配色变量） */
.iwe-recent .breadcrumbs{list-style:none;padding:0;margin:0 0 15px}
.iwe-recent .breadcrumbs li{display:inline-block}
.iwe-recent .breadcrumbs li::after{display:inline-block;padding:0 8px;content:"»"}
.iwe-recent .breadcrumbs li:last-child::after{content:none}
.iwe-recent .page-forumSection__header{background:var(--body-dark,rgba(128,128,128,.14));padding:8px;margin-top:15px}
.iwe-recent .page-forumSection__thread{display:flex;align-items:center;padding:8px;background:var(--body-alt,transparent)}
.iwe-recent .page-forumSection__thread:nth-child(2n){background:var(--body-dark,rgba(128,128,128,.14))}
.iwe-recent .page-forumSection__thread__bottom{display:flex;align-items:center}
.iwe-recent .iwe-pager-top{margin:12px 0 8px}
.iwe-recent__rows{transition:opacity .15s}
.iwe-recent__loading{pointer-events:none}
/* 加载骨架 + 行进场 */
.iwe-skel-list{animation:iwe-skel-in .22s ease-out}
.iwe-skel-row{display:flex;align-items:center;gap:16px;padding:14px 8px}
.iwe-skel-row:nth-child(2n){background:var(--body-dark,rgba(128,128,128,.14))}
.iwe-skel-line{height:12px;border-radius:6px;background:linear-gradient(90deg,rgba(128,128,128,.16) 25%,rgba(128,128,128,.34) 50%,rgba(128,128,128,.16) 75%);background-size:200% 100%;animation:iwe-skel-shimmer 1.3s ease-in-out infinite}
.iwe-skel-line.w1{flex:1 1 auto}
.iwe-skel-line.w2{flex:0 0 18%}
.iwe-recent__rows > .page-forumSection__thread{animation:iwe-row-in .28s ease-out both;animation-delay:calc(var(--i,0) * 20ms)}
@keyframes iwe-skel-shimmer{to{background-position:-200% 0}}
@keyframes iwe-skel-in{from{opacity:0}}
@keyframes iwe-row-in{from{opacity:0;transform:translateY(8px)}}
@media (prefers-reduced-motion:reduce){.iwe-skel-line{animation:none}.iwe-recent__rows > .page-forumSection__thread{animation:none}}
`,
    scan() {
      const section = document.querySelector('section.content');
      if (!section || !iwePagerKit) return;
      if (!recent || !section.contains(recent.el)) { teardown(); build(section); }
      section.classList.add('iwe-recent-on'); // 侧栏展开 / 收起时站点会重设 section 的 class，把我们的标记冲掉：每次都补上
      if (recent.mode !== iwePagerKit.mode() || recent.page !== recentPage()) reload(recent);
    },
    leave: teardown,
  });
})();
