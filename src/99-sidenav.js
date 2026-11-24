// 侧栏导航增强（登录后）：
// 1. 加一个「订阅」项（放在「主页」下面），进 /subscriptions；
// 2. 「订阅 / 视频 / 图片 / 论坛」的子菜单改成悬停弹出：鼠标移到那一行，右边弹出一个和头像菜单、「创造」悬停菜单同款的小菜单
//    （直接用站点的 .dropdown__content 外观），替代原来点箭头在侧栏里原地展开的写法；
//      订阅 → 视频 / 图像 / 帖子；视频、图片 → 站点的分类（AI生成、Blender、HMV……）；论坛 → 最近、公告。
// 触屏 / 没有悬停的设备：保持站点原来的点箭头展开，不弹菜单。侧栏收起（只剩图标）时同样可以悬停弹出。
//
// 站点侧栏：.page > .menu > ul > li > div.menu__item > a（> .icon + .text）；有子菜单的项后面多一个按钮，点开出现 ul.menu__children。

(() => {
  defineStrings(
    { snSubs: '订阅', snVideos: '视频', snImages: '图像', snPosts: '帖子', snRecent: '最近', snAnnounce: '公告', snForum: '论坛', snSort: '排列方式', snTags: '标签', snNew: '最新', snHot: '流行', snPop: '人气', snViews: '最多人观看', snLikes: '最多赞',
      sn_cat_ai_generated: 'AI生成', sn_cat_blender: 'Blender', sn_cat_hmv: 'HMV', sn_cat_honey_select: '甜心选择', sn_cat_koikatsu: '恋活', sn_cat_mikumikudance: 'MikuMikuDance', sn_cat_sfm: 'SFM', sn_cat_uncategorized: '未分类', sn_cat_virt_a_mate: 'Virt-A-Mate' },
    { snSubs: 'Subscriptions', snVideos: 'Videos', snImages: 'Images', snPosts: 'Posts', snRecent: 'Recent', snAnnounce: 'Announcements', snForum: 'Forum', snSort: 'Sort by', snTags: 'Tags', snNew: 'Latest', snHot: 'Trending', snPop: 'Popular', snViews: 'Most viewed', snLikes: 'Most liked',
      sn_cat_ai_generated: 'AI Generated', sn_cat_blender: 'Blender', sn_cat_hmv: 'HMV', sn_cat_honey_select: 'Honey Select', sn_cat_koikatsu: 'Koikatsu', sn_cat_mikumikudance: 'MikuMikuDance', sn_cat_sfm: 'SFM', sn_cat_uncategorized: 'Uncategorized', sn_cat_virt_a_mate: 'Virt-A-Mate' },
    { snSubs: '購読', snVideos: '動画', snImages: '画像', snPosts: '投稿', snRecent: '最近', snAnnounce: 'お知らせ', snForum: 'フォーラム', snSort: '並び順', snTags: 'タグ', snNew: '最新', snHot: 'トレンド', snPop: '人気', snViews: '閲覧数順', snLikes: 'いいね順',
      sn_cat_ai_generated: 'AI生成', sn_cat_blender: 'Blender', sn_cat_hmv: 'HMV', sn_cat_honey_select: 'ハニーセレクト', sn_cat_koikatsu: 'コイカツ', sn_cat_mikumikudance: 'MikuMikuDance', sn_cat_sfm: 'SFM', sn_cat_uncategorized: '未分類', sn_cat_virt_a_mate: 'Virt-A-Mate' },
  );
  // 图标：Font Awesome Free 6 Solid（CC BY 4.0，https://fontawesome.com/license/free），与站点菜单里的实心图标同一套
  const FA = {
    video: [576, 512, 'M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z'],
    image: [576, 512, 'M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z'],
    post: [512, 512, 'M96 96c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H80c-44.2 0-80-35.8-80-80V128c0-17.7 14.3-32 32-32s32 14.3 32 32V400c0 8.8 7.2 16 16 16s16-7.2 16-16V96zm64 24v80c0 13.3 10.7 24 24 24H296c13.3 0 24-10.7 24-24V120c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24zm208-8c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16s-7.2-16-16-16H384c-8.8 0-16 7.2-16 16zM160 304c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm0 96c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z'],
    comments: [640, 512, 'M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z'],
    clock: [512, 512, 'M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z'],
    tag: [448, 512, 'M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z'],
    bullhorn: [576, 512, 'M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z'],
    flame: [448, 512, 'M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z'],
    crown: [576, 512, 'M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6H426.6c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z'],
    eye: [576, 512, 'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'],
    heart: [512, 512, 'M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z'],
    bookmark: [384, 512, 'M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z'],
  };

  const svgStr = (name) => { const [w, hh, d] = FA[name]; return `<svg viewBox="0 0 ${w} ${hh}" fill="currentColor" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`; };

  // 站点的视频 / 图片分类（侧栏展开子菜单里那几项，按分类标签筛选）
  const CATS = ['ai_generated', 'blender', 'hmv', 'honey_select', 'koikatsu', 'mikumikudance', 'sfm', 'uncategorized', 'virt_a_mate'];
  const cats = (kind) => CATS.map((id) => ({ href: `/${kind}?tags=${id}&page=0`, label: t('sn_cat_' + id), icon: 'tag' }));
  // 视频 / 图片：先给五种排列方式，底部一个「标签」，悬停再弹出第三级（分类标签）
  const sorts = (kind) => [
    { head: t('snSort') },
    { href: `/${kind}?sort=date`, label: t('snNew'), icon: 'clock' },
    { href: `/${kind}?sort=trending`, label: t('snHot'), icon: 'flame', anchor: true },
    { href: `/${kind}?sort=popularity`, label: t('snPop'), icon: 'crown' },
    { href: `/${kind}?sort=views`, label: t('snViews'), icon: 'eye' },
    { href: `/${kind}?sort=likes`, label: t('snLikes'), icon: 'heart' },
    { sep: true },
    { label: t('snTags'), icon: 'tag', sub: cats(kind) },
  ];
  const MODEL = {
    '/subscriptions': () => [
      { href: '/subscriptions/videos', label: t('snVideos'), icon: 'video' },
      { href: '/subscriptions/images', label: t('snImages'), icon: 'image' },
      { href: '/subscriptions/posts', label: t('snPosts'), icon: 'post' },
    ],
    '/videos': () => sorts('videos'),
    '/images': () => sorts('images'),
    iwara: () => iwaraItems(),
    '/forum': () => [
      { href: '/forum', label: t('snForum'), icon: 'comments' },
      { href: '/forum?iwe=recent', label: t('snRecent'), icon: 'clock' },
      { href: '/forum/announcements', label: t('snAnnounce'), icon: 'bullhorn' },
    ],
  };

  // 「Iwara」分组：把「查找 / 链接 / 高级会员 / Wura / 常问问题」这几个站点项收进一个分组（放在论坛下面）。
  // 站点那几行只是藏起来（不搬 React 的节点），分组菜单里的项按它们现成的链接 / 文字 / 图标 / 颜色重新生成。
  const GROUPED = ['/page/links', '/account/premium', '/dashboard', '/page/faq'];
  function iwaraItems() {
    const menu = document.querySelector('.page > .menu');
    const out = [];
    const base = menu && menu.querySelector('.menu__item > a[href="/videos"] .text');
    const baseColor = base ? getComputedStyle(base).color : '';
    for (const href of GROUPED) {
      const a = menu && menu.querySelector(`.menu__item > a[href="${href}"]`);
      if (!a) continue;
      const svg = a.querySelector('.icon svg');
      const label = (a.querySelector('.text') || a).textContent.trim();
      out.push({ href, label, svgHtml: svg ? svg.outerHTML : '', color: (() => { const c = getComputedStyle(a.querySelector('.text') || a).color; return c === baseColor ? '' : c; })() });
    }
    return out;
  }

  const fine = () => matchMedia('(hover:hover) and (pointer:fine)').matches;
  // 点击跳转后站点会重绘侧栏，鼠标原地不动也会在新行上触发 pointerenter，子菜单便跟着「刷新」弹出来：跳转后 0.9 秒内不因悬停开菜单
  let quietUntil = 0;
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.page > .menu, .iwe-nav-pop')) { quietUntil = Date.now() + 900; } }, true);
  function go(href) {
    quietUntil = Date.now() + 900;
    history.pushState({}, '', href);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollTo(0, 0);
    site.schedule();
  }
  const plain = (e) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

  // ── 子菜单：有鼠标时悬停弹出（挂在 body 上用固定定位，不被侧栏的滚动容器裁掉）；触屏时点箭头 / 行右侧按钮弹出底部面板（可上下滑动）──
  let cur = null, curSub = null, timer = 0, back = null;
  const pops = new Set();
  function hideSub() { if (curSub) { curSub.classList.remove('show'); curSub = null; } }
  function hideNow() {
    clearTimeout(timer); hideSub();
    if (cur) { cur.classList.remove('show'); cur = null; }
    if (back) back.classList.remove('show');
  }
  // 延时关闭：到点时若鼠标仍在「侧栏行 / 一级 / 二级」任何一个上就不关（子菜单挂在 body 上，进入下一级时上一级会先触发 leave）
  let curRow = null;
  const hovering = () => [curRow, cur, curSub].some((e) => e && e.isConnected && e.matches(':hover'));
  const hideSoon = () => { clearTimeout(timer); timer = setTimeout(() => { if (hovering()) return; hideNow(); }, 200); };
  const keep = () => clearTimeout(timer);

  function row1(it, onNav) {
    const ico = h('span.icon.ml-3'); ico.innerHTML = it.svgHtml || svgStr(it.icon);
    const a = h('a.userDropdownContent__link', { href: it.href || '#', role: 'menuitem' }, ico, h('span.text.iwe-fly-label', it.label));
    if (it.color) for (const e of [a, ...a.children]) e.style.setProperty('color', it.color, 'important'); // 站点的菜单文字 / 图标各自有颜色，要逐个盖；默认灰就不动（深色模式跟站点）
    if (!it.sub) a.addEventListener('click', (e) => { if (!plain(e)) return; e.preventDefault(); hideNow(); go(it.href); });
    return a;
  }

  /** 一列菜单项。inline=true（触屏面板）时，带下一级的项在原地展开；否则（鼠标）悬停弹出第三级。 */
  function fillList(list, items, inline, parentPop) {
    for (const it of items) {
      if (it.head) { list.append(h('li.iwe-nav-head', it.head)); continue; }
      if (it.sep) { list.append(h('li.iwe-nav-sep')); continue; }
      const a = row1(it);
      const li = h('li', a);
      if (it.anchor) li.dataset.anchor = '1';
      if (it.sub) {
        li.classList.add('iwe-nav-hassub');
        a.append(h('span.iwe-nav-caret2', icon('chevronDown', 14)));
        if (inline) {
          const inner = h('ul.iwe-nav-inline');
          fillList(inner, it.sub, true);
          li.append(inner);
          a.addEventListener('click', (e) => { e.preventDefault(); li.classList.toggle('open'); });
        } else {
          a.addEventListener('click', (e) => e.preventDefault());
          const sp = h('div.dropdown__content.iwe-nav-pop.iwe-nav-subpop', { role: 'menu' });
          const sl = h('ul'); sp.append(sl);
          fillList(sl, it.sub, false);
          sp.addEventListener('pointerenter', keep);
          sp.addEventListener('pointerleave', hideSoon);
          document.body.append(sp); pops.add(sp);
          li.addEventListener('pointerenter', (e) => {
            if (e.pointerType !== 'mouse') return;
            keep();
            if (curSub && curSub !== sp) curSub.classList.remove('show');
            const pr = parentPop.getBoundingClientRect(), r = li.getBoundingClientRect();
            sp.style.display = 'block'; sp.style.visibility = 'hidden';
            const ph = Math.min(sp.offsetHeight, innerHeight - 16);
            sp.style.display = ''; sp.style.visibility = '';
            sp.style.left = Math.round(pr.right) + 'px';
            sp.style.top = Math.round(Math.max(8, Math.min(r.top - 8, innerHeight - 8 - ph))) + 'px';
            sp.style.maxHeight = (innerHeight - 16) + 'px';
            sp.classList.add('show');
            curSub = sp;
          });
        }
      } else if (!inline && parentPop) { // 只有一级菜单的普通项才收起已展开的下一级；下一级自己的项不能把自己收了
        li.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hideSub(); });
      }
      list.append(li);
    }
  }

  function buildPop(href, inline) {
    const list = h('ul');
    const pop = h('div.dropdown__content.iwe-nav-pop', { role: 'menu' }, list);
    fillList(list, MODEL[href](), inline, pop);
    pop.addEventListener('pointerenter', keep);
    pop.addEventListener('pointerleave', hideSoon);
    pop.__href = href;
    document.body.append(pop); pops.add(pop);
    return pop;
  }

  function ensureBack() {
    if (back && back.isConnected) return back;
    back = h('div.iwe-nav-back');
    back.addEventListener('pointerdown', (e) => { e.preventDefault(); hideNow(); });
    document.body.append(back);
    return back;
  }

  function bindRow(li, href) {
    const row = li.querySelector(':scope > .menu__item');
    if (!row) return;
    li.dataset.iweNav = href;
    row.append(h('span.iwe-nav-caret', icon('chevronDown', 14)));
    // 点「视频 / 图片」本身 → 直接进「流行」排序（而不是站点默认的最新）；Ctrl / 中键等仍走链接本身
    if (href === '/videos' || href === '/images') {
      const link = row.querySelector(':scope > a');
      if (link) link.addEventListener('click', (e) => {
        if (!plain(e)) return;
        e.preventDefault(); e.stopPropagation();
        hideNow(); go(`${href}?sort=trending`);
      }, true);
    }
    let pop = null, sheet = null;
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !fine() || Date.now() < quietUntil) return;
      keep(); curRow = row;
      if (!pop || !pop.isConnected) pop = buildPop(href, false);
      if (cur && cur !== pop) { hideSub(); cur.classList.remove('show'); }
      const menu = row.closest('.menu'), mr = menu.getBoundingClientRect(), r = row.getBoundingClientRect();
      pop.style.display = 'block'; pop.style.visibility = 'hidden';
      const ph = Math.min(pop.offsetHeight, innerHeight - 16);
      // 有「锚点项」（视频 / 图片的「流行」）时，让它和被悬停的侧栏行在同一水平线上；没有就顶端对齐
      const anc = pop.querySelector('[data-anchor]');
      let off = 0;
      if (anc) { const ar = anc.getBoundingClientRect(), pr = pop.getBoundingClientRect(); off = ar.top + ar.height / 2 - pr.top - r.height / 2; }
      pop.style.display = ''; pop.style.visibility = '';
      pop.style.left = Math.round(mr.right) + 'px';
      pop.style.top = Math.round(Math.max(8, Math.min(r.top - off, innerHeight - 8 - ph))) + 'px';
      pop.style.maxHeight = (innerHeight - 16) + 'px';
      pop.classList.add('show');
      cur = pop;
    });
    row.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') hideSoon(); });
    // 触屏：站点那个展开按钮（箭头）改为弹出底部面板；点文字仍是进该栏目首页
    row.addEventListener('click', (e) => {
      if (fine()) return;
      const btn = e.target.closest && e.target.closest('button');
      if (href !== 'iwara' && (!btn || !row.contains(btn))) return;
      e.preventDefault(); e.stopPropagation();
      hideNow();
      if (!sheet || !sheet.isConnected) { sheet = buildPop(href, true); sheet.classList.add('iwe-nav-sheet'); }
      ensureBack().classList.add('show');
      sheet.classList.add('show');
      cur = sheet;
    }, true);
  }

  // ── 「订阅」项：照「主页」项的结构造一个，插在它后面 ──
  function ensureSubsItem(menu) {
    const homeA = menu.querySelector('.menu__item > a[href="/"]');
    // 顺序：主页、查找、订阅——「订阅」插在站点的「查找」后面（没有查找就跟在主页后面）
    const searchA = menu.querySelector('.menu__item > a[href="/search"]');
    const homeLi = (searchA || homeA) && (searchA || homeA).closest('li');
    if (!homeLi) return null;
    let li = menu.querySelector('li[data-iwe-nav-subs]');
    if (li && li.isConnected && li.previousElementSibling === homeLi) return li;
    if (li) li.remove();
    const proto = homeA.querySelector('.icon svg');
    const svg = proto ? proto.cloneNode(false) : document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 384 512');
    svg.setAttribute('data-icon', 'bookmark');
    svg.innerHTML = `<path fill="currentColor" d="${FA.bookmark[2]}"/>`;
    const a = h('a', { href: '/subscriptions' }, h('div.icon', svg), h('div.text.text--inline', t('snSubs')));
    a.addEventListener('click', (e) => { if (!plain(e)) return; e.preventDefault(); e.stopPropagation(); go('/subscriptions'); });
    li = h('li', { 'data-iwe-nav-subs': '' }, h('div.menu__item', a));
    homeLi.after(li);
    return li;
  }

  function ensureIwaraItem(menu) {
    const forumA = menu.querySelector('.menu__item > a[href="/forum"]');
    const forumLi = forumA && forumA.closest('li');
    if (!forumLi) return null;
    // 藏起被收进分组的站点项
    for (const href of GROUPED) {
      const li = menu.querySelector(`.menu__item > a[href="${href}"]`);
      const l = li && li.closest('li');
      if (l && !l.hasAttribute('data-iwe-grouped')) l.setAttribute('data-iwe-grouped', '');
    }
    let li = menu.querySelector('li[data-iwe-nav-iwara]');
    if (li && li.isConnected && li.previousElementSibling === forumLi) return li;
    if (li) li.remove();
    const logo = document.querySelector('.header__logo svg');
    const svg = logo ? logo.cloneNode(true) : document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.removeAttribute('class');
    const a = h('a', { href: '/' }, h('div.icon', svg), h('div.text.text--inline', 'Iwara'));
    a.addEventListener('click', (e) => e.preventDefault());
    li = h('li', { 'data-iwe-nav-iwara': '' }, h('div.menu__item', a));
    forumLi.after(li);
    return li;
  }

  site.register('sideNav', {
    css: `
/* 悬停子菜单：外观由站点的 .dropdown__content 给（和头像菜单、「创造」悬停菜单同款），这里只管定位、显隐与图标大小 */
.dropdown__content.iwe-nav-pop{display:block;position:fixed;z-index:10030;top:0;left:0;margin:0;overscroll-behavior:contain;overflow-y:auto;scrollbar-width:thin;opacity:0;transform:translateX(-6px);visibility:hidden;pointer-events:none;transition:opacity .14s ease-in,transform .16s ease-in,visibility 0s linear .16s}
.dropdown__content.iwe-nav-pop.show{opacity:1;transform:none;visibility:visible;pointer-events:auto;transition:opacity .16s ease-out,transform .24s cubic-bezier(.2,.9,.3,1.15),visibility 0s}
.iwe-nav-pop ul{margin:0;padding:0;list-style:none;border-radius:5px}
.iwe-nav-pop li:first-child a{border-radius:5px 5px 0 0}
.iwe-nav-pop li:last-child a{border-radius:0 0 5px 5px}
.iwe-nav-pop .userDropdownContent__link{flex-direction:row!important;justify-content:flex-start!important;gap:12px}
.iwe-nav-pop .icon{display:inline-flex;align-items:center}
.iwe-nav-pop .icon svg{height:1em;width:auto}
.iwe-nav-caret{display:none}
.page > .menu li[data-iwe-grouped]{display:none!important}
/* 上半组只剩 主页 / 查找 / 订阅 后，和下面「视频」之间不再留那条空隙 */
.page > .menu > ul:has(li[data-iwe-nav-subs]){margin-bottom:0!important}
.page > .menu > ul:has(li[data-iwe-nav-subs]) + ul{margin-top:-8px}  /* 每组第一项站点自带 8px 上边距，一并抵掉 */
.page > .menu li[data-iwe-nav-iwara] .icon svg{height:1em;width:auto}
.iwe-nav-pop .iwe-nav-head{padding:12px 16px 6px;font-size:14px;font-weight:600;letter-spacing:-.01em;opacity:.85;pointer-events:none}
.iwe-nav-pop .iwe-nav-sep{height:1px;margin:4px 0;background:rgba(128,128,128,.25)}
.iwe-nav-pop .iwe-nav-hassub>a{padding-right:12px}
.iwe-nav-pop .iwe-nav-caret2{margin-left:auto;display:inline-flex;opacity:.55;transform:rotate(-90deg)}
.iwe-nav-pop .iwe-nav-inline{display:none;margin:0;padding:0 0 0 12px;list-style:none}
.iwe-nav-pop .iwe-nav-hassub.open>.iwe-nav-inline{display:block}
.iwe-nav-pop .iwe-nav-hassub.open>a .iwe-nav-caret2{transform:none}
.iwe-nav-pop{-webkit-overflow-scrolling:touch;touch-action:pan-y}
/* 触屏：底部面板（贴底、左右留边、可上下滑动）+ 半透明遮罩，点遮罩关闭 */
.iwe-nav-back{position:fixed;inset:0;z-index:10029;background:rgba(0,0,0,.35);opacity:0;visibility:hidden;transition:opacity .18s,visibility 0s linear .18s}
.iwe-nav-back.show{opacity:1;visibility:visible;transition:opacity .18s}
.dropdown__content.iwe-nav-pop.iwe-nav-sheet{left:8px!important;right:8px;top:auto!important;bottom:calc(8px + env(safe-area-inset-bottom));width:auto;max-height:72dvh!important;border-radius:14px;transform:translateY(16px)}
.dropdown__content.iwe-nav-pop.iwe-nav-sheet.show{transform:none}
.iwe-nav-sheet .userDropdownContent__link{min-height:44px}
@media (hover:hover) and (pointer:fine){
  /* 有鼠标：原地展开的写法让位给悬停菜单——藏起站点的展开箭头 / 子列表，换一个朝右的小箭头提示「这里有下一级」 */
  .page > .menu li[data-iwe-nav] > .menu__item > button,.page > .menu li[data-iwe-nav] > ul.menu__children,.page > .menu li[data-iwe-nav] .iwe-forum-toggle{display:none!important}
  .page > .menu.menu--open li[data-iwe-nav] > .menu__item{display:flex;align-items:center}
  .page > .menu li[data-iwe-nav] > .menu__item{position:relative}
  .page > .menu.menu--open .iwe-nav-caret{display:inline-flex;align-items:center;justify-content:center;position:absolute;right:14px;top:50%;width:16px;height:16px;margin:-8px 0 0;padding:0;opacity:.55;transform:rotate(-90deg);transition:opacity .15s}
  .page > .menu li[data-iwe-nav] > .menu__item:hover .iwe-nav-caret{opacity:1}
}
@media not all and (hover:hover) and (pointer:fine){
  /* 触屏：论坛和视频 / 图片一样，箭头点开底部面板——不再原地展开「最近」，箭头也不翻转 */
  .page > .menu li[data-iwe-nav] > ul.iwe-forum-children{display:none!important}
  .page > .menu li[data-iwe-nav] .iwe-forum-toggle{transform:none!important}
}
/* 侧栏图标列定宽：站点按各图标自己的宽度排，文字起点参差不齐（主页 63、订阅 55、高级会员 63…）；统一成同宽图标槽，文字对齐 */
.page > .menu .menu__item > a > .icon{box-sizing:content-box;flex:none;width:26px;display:flex;align-items:center;justify-content:center}
.page > .menu .menu__item > a > .icon svg{max-width:100%}
/* 展开 / 收缩：行高两态一致（原来收缩 36px、展开 40px，图标上下间距会跳），宽度走缓动，文字淡入 */
.page > .menu .menu__item > a{box-sizing:border-box;min-height:40px;align-items:center}
.page > .menu{overflow-x:hidden;transition:width .28s cubic-bezier(.22,1,.36,1),box-shadow .28s ease!important}
.page > .menu.iwe-nav-opening .menu__item > a > .text{animation:iwe-nav-fade .3s ease .06s both}
.page > .menu .menu__item > a{white-space:nowrap}
@keyframes iwe-nav-fade{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.page > .menu,.page > .menu .text{transition:none!important;animation:none!important}}
@media (prefers-reduced-motion:reduce){.dropdown__content.iwe-nav-pop{transition:none!important}}
`,
    scan() {
      const menu = document.querySelector('.page > .menu');
      if (!menu) { hideNow(); return; }
      // 文字淡入只在「收缩→展开」那一刻播（换页时站点会重绘菜单项，不该跟着闪）
      if (!menu.__iweOpenWatch) {
        menu.__iweOpenWatch = true;
        let was = menu.classList.contains('menu--open');
        new MutationObserver(() => {
          const on = menu.classList.contains('menu--open');
          if (on && !was) { menu.classList.add('iwe-nav-opening'); setTimeout(() => menu.classList.remove('iwe-nav-opening'), 450); }
          was = on;
        }).observe(menu, { attributes: true, attributeFilter: ['class'] });
      }
      if (localStorage.getItem('token')) ensureSubsItem(menu);
      const iw = ensureIwaraItem(menu);
      if (iw && !iw.dataset.iweNav) bindRow(iw, 'iwara');
      for (const [href] of Object.entries(MODEL)) {
        const a = menu.querySelector(`.menu__item > a[href="${href}"]`);
        const li = a && a.closest('li');
        if (!li || li.dataset.iweNav) continue;
        bindRow(li, href);
      }
      // 当前就在订阅页：「订阅」项高亮（站点自己的项靠 a.active 和 aria-current）
      const sub = menu.querySelector('li[data-iwe-nav-subs] > .menu__item > a');
      if (sub) {
        const on = location.pathname.startsWith('/subscriptions');
        sub.classList.toggle('active', on);
        if (on) sub.setAttribute('aria-current', 'page'); else sub.removeAttribute('aria-current');
      }
      for (const p of pops) if (!p.isConnected) pops.delete(p);
    },
    leave: hideNow,
  });
  // 手机 / 窄屏：侧栏是点开的抽屉，点「主页 / 查找 / 订阅」跳转后顺手收起（站点自己只在点别的项时才收）。
  // 延后一拍，等站点自己的点击处理（跳转、重绘）跑完；收起走站点汉堡钮，保持它内部状态一致
  addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('.page > .menu .menu__item > a');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
    const path = a.getAttribute('href');
    if (path !== '/' && path !== '/search' && path !== '/subscriptions') return;
    if (matchMedia('(min-width:992px)').matches) return;
    setTimeout(() => {
      const menu = document.querySelector('.page > .menu');
      const tgl = document.querySelector('.header__menu');
      if (menu && menu.classList.contains('menu--open') && tgl) tgl.click();
    }, 60);
  }, true); // 捕获阶段：「订阅」项自己的点击处理会 stopPropagation
  addEventListener('scroll', hideNow, { passive: true });
  addEventListener('resize', hideNow);
})();
