// 用户身份标识：头像发光/描边（高级会员、管理员、版主等），用户详情页标签
//
// 用到的字段：
// - user.premium (bool): 高级会员，紫蓝粉渐变背景
// - user.role (string):
//   - 'admin': 管理员，红色边框
//   - 'officer': 官员，绿色边框
//   - 'moderator': 版主，绿色边框
//   - 'limited': 受限用户，灰色环（与应用一致）
// - user.creatorProgram (bool): 创作者

(() => {
  defineStrings(
    {
      // 用户标签
      userBadgePremium: '高级会员',
      userBadgeCreator: '创作者',
      userBadgeAdmin: '管理员',
      userBadgeModerator: '版主',
      userBadgeOfficer: '官员',
      userBadgeLimited: '受限用户',
      userTipPremium: 'Iwara 高级会员',
      userTipCreator: '已加入 Iwara 创作者计划',
      userTipAdmin: '站点管理员',
      userTipModerator: '站点版主',
      userTipOfficer: '站点官员',
      userTipLimited: '受限用户：账号的部分功能受到限制',
      userCopyHint: '点击复制',
      userCopied: '已复制',
      userCopyFail: '复制失败',
    },
    {
      // User badges
      userBadgePremium: 'Premium',
      userBadgeCreator: 'Creator',
      userBadgeAdmin: 'Admin',
      userBadgeModerator: 'Moderator',
      userBadgeOfficer: 'Officer',
      userBadgeLimited: 'Limited',
      userTipPremium: 'Iwara Premium member',
      userTipCreator: 'Joined the Iwara Creator Program',
      userTipAdmin: 'Site administrator',
      userTipModerator: 'Site moderator',
      userTipOfficer: 'Site officer',
      userTipLimited: 'Restricted user: some account features are limited',
      userCopyHint: 'Click to copy',
      userCopied: 'Copied',
      userCopyFail: 'Copy failed',
    },
    {
      // ユーザーバッジ
      userBadgePremium: 'プレミアム会員',
      userBadgeCreator: 'クリエイター',
      userBadgeAdmin: '管理者',
      userBadgeModerator: 'モデレーター',
      userBadgeOfficer: 'オフィサー',
      userBadgeLimited: '制限中',
      userTipPremium: 'Iwara プレミアム会員',
      userTipCreator: 'Iwara クリエイタープログラムに参加中',
      userTipAdmin: 'サイト管理者',
      userTipModerator: 'サイトモデレーター',
      userTipOfficer: 'サイトオフィサー',
      userTipLimited: '制限付きユーザー：アカウントの一部機能が制限されています',
      userCopyHint: 'クリックでコピー',
      userCopied: 'コピーしました',
      userCopyFail: 'コピーに失敗しました',
    }
  );

  // 用户数据缓存：{ userId: { data, timestamp } }
  const userDataCache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // 5分钟

  // 并发控制
  const MAX_CONCURRENT = 2; // 最多同时2个API请求
  let activeRequests = 0;
  const requestQueue = []; // { userId, username, resolve, reject }

  /**
   * 获取用户数据（先查siteData，再调接口兜底）
   * @param {string} userId - 用户ID
   * @param {string} username - 用户名（可选）
   * @returns {Promise<Object|null>} 用户数据
   */
  async function getUserData(userId, username) {
    const key = userId || username;
    if (!key) return null;

    // 检查缓存
    const cached = userDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    // 先查siteData
    const siteUser = siteData.user(key);
    if (siteUser) {
      userDataCache.set(key, { data: siteUser, timestamp: Date.now() });
      return siteUser;
    }

    // 兜底：调接口
    return fetchUserFromApi(userId, username);
  }

  /**
   * 从API获取用户数据（带并发控制）
   */
  function fetchUserFromApi(userId, username) {
    return new Promise((resolve, reject) => {
      const key = userId || username;

      // 检查缓存（可能在排队期间被其他请求填上了）
      const cached = userDataCache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        resolve(cached.data);
        return;
      }

      // 加入队列
      requestQueue.push({ userId, username, resolve, reject });
      processQueue();
    });
  }

  /**
   * 处理请求队列
   */
  async function processQueue() {
    if (activeRequests >= MAX_CONCURRENT || requestQueue.length === 0) return;

    const req = requestQueue.shift();
    if (!req) return;

    activeRequests++;

    try {
      const key = req.userId || req.username;

      // 再次检查缓存（排队期间可能已被填充）
      const cached = userDataCache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        req.resolve(cached.data);
        return;
      }

      let userData = null;

      // /profile/{username} 返回 { user, header, body }，/user/{id} 返回 user 本身：统一取出 user
      const res = req.userId ? await api.call(`/user/${req.userId}`) : req.username ? await api.call(`/profile/${req.username}`) : null;
      userData = res && res.user ? res.user : res;
      if (userData) siteData.remember(userData);

      if (userData) {
        userDataCache.set(key, { data: userData, timestamp: Date.now() });
        req.resolve(userData);
      } else {
        req.resolve(null);
      }
    } catch (e) {
      // 静默失败
      req.resolve(null);
    } finally {
      activeRequests--;
      // 处理下一个
      setTimeout(processQueue, 0);
    }
  }

  /**
   * 从页面元素中提取用户信息
   * @param {Element} avatarEl - 头像元素
   * @returns {Object|null} { userId, username, userLink }
   */
  function extractUserInfo(avatarEl) {
    // 尝试从父链接获取用户信息
    let link = avatarEl.closest('a[href*="/profile/"]');
    if (link) {
      const match = link.href.match(/\/profile\/([^/?#]+)/);
      if (match) {
        return {
          username: match[1],
          userLink: link
        };
      }
    }

    // 用户页头部的大头像外面没有链接：用户就是路由里的那位
    if (avatarEl.closest('.page-profile__header__avatar')) {
      const m = location.pathname.match(/^\/profile\/([^/?#]+)/);
      if (m) return { username: decodeURIComponent(m[1]) };
    }

    // 尝试从data属性获取
    const userId = avatarEl.dataset.userId || avatarEl.closest('[data-user-id]')?.dataset.userId;
    if (userId) {
      return { userId };
    }

    return null;
  }

  /**
   * 根据用户数据确定头像样式：
   * 高级会员 = 紫蓝粉渐变环（这里再加一圈柔和的光）；管理员红环；版主/官员绿环；受限用户灰环。
   */
  function getAvatarStyle(userData) {
    if (!userData) return null;
    if (userData.premium === true) return 'premium';
    if (userData.role === 'admin' || userData.isAdmin) return 'admin';
    if (userData.role === 'officer' || userData.role === 'moderator') return 'mod';
    if (userData.role === 'limited') return 'limited';
    return null;
  }

  const AVATAR_CLASSES = ['iwe-av-premium', 'iwe-av-admin', 'iwe-av-mod', 'iwe-av-limited'];
  /**
   * 样式直接挂在站点的 img 上：不包新节点、不挪动站点的节点（站点重渲染/卸载时会按原父子关系删节点，挪过就会报错）。
   */
  function applyAvatarStyle(avatarEl, style) {
    avatarEl.classList.remove(...AVATAR_CLASSES);
    if (style) avatarEl.classList.add('iwe-av-' + style);
  }

  // ── 悬停提示 / 点击复制 ────────────────────────────────────────────
  // 站点页面上自己的一个小气泡（应用 UI 的那套提示只在应用层里能用）：挂在 body、固定定位，淡入淡出 + 轻微缩放。
  // 鼠标悬停 / 键盘聚焦显示；触屏没有悬停，点一下显示 2.5 秒。
  let utip = null, utipTimer = 0, utipFor = null;
  function tipEl() {
    if (!utip || !utip.isConnected) { utip = h('div', { class: 'iwe-utip', role: 'tooltip' }); document.body.append(utip); }
    return utip;
  }
  function showTip(el, text) {
    clearTimeout(utipTimer);
    const tip = tipEl();
    utipFor = el;
    tip.textContent = text;
    const r = el.getBoundingClientRect(), w = tip.offsetWidth, hh = tip.offsetHeight;
    const above = r.top > hh + 14;
    tip.style.left = Math.max(6, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 6)) + 'px';
    tip.style.top = (above ? r.top - hh - 8 : r.bottom + 8) + 'px';
    tip.classList.add('in');
  }
  function hideTip(el) {
    if (el && utipFor !== el) return;
    clearTimeout(utipTimer);
    utipFor = null;
    if (utip) utip.classList.remove('in');
  }
  /** 给元素绑悬停提示。getText 每次显示时取，文字可以变 */
  function bindTip(el, getText) {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') showTip(el, getText()); });
    el.addEventListener('pointerleave', () => hideTip(el));
    el.addEventListener('focus', () => showTip(el, getText()));
    el.addEventListener('blur', () => hideTip(el));
    el.addEventListener('click', (e) => { // 触屏：点一下显示几秒
      if (e.pointerType === 'mouse' || (e.detail !== 0 && matchMedia('(hover:hover)').matches)) return;
      showTip(el, getText());
      utipTimer = setTimeout(() => hideTip(el), 2500);
    });
  }
  async function copyText(text) {
    // 页面没有焦点 / 没有权限时 writeText 可能一直不返回：最多等 600ms，之后走老办法
    try { await Promise.race([navigator.clipboard.writeText(text), new Promise((_, no) => setTimeout(no, 600))]); return true; } catch (e) { /* fall through */ }
    const ta = h('textarea', { value: text, style: { position: 'fixed', opacity: '0', top: '0' } });
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  /** 点一下复制元素上的文字；悬停提示「点击复制」，复制后气泡变成「已复制」停 1.2 秒。拖选文字时不触发复制 */
  function bindCopy(el, getText) {
    if (el.dataset.iweCopy) return;
    el.dataset.iweCopy = '1';
    el.style.cursor = 'copy';
    el.removeAttribute('title'); // 站点给名字加了原生 title，和我们的气泡重复
    bindTip(el, () => t('userCopyHint'));
    el.addEventListener('click', async () => {
      if (String(getSelection()).trim()) return;
      const ok = await copyText(getText());
      showTip(el, t(ok ? 'userCopied' : 'userCopyFail'));
      utipTimer = setTimeout(() => hideTip(el), 1200);
    });
  }

  /**
   * 创建用户标签元素
   * @param {Object} userData - 用户数据
   * @returns {Element|null} 标签容器元素
   */
  function createUserBadges(userData, opts = {}) {
    if (!userData) return null;

    const badges = [];

    // 高级会员
    if (userData.premium === true && !opts.skipPremium) { // 站点已经在 @用户名 旁边显示高级会员标签时不重复出
      badges.push({
        text: t('userBadgePremium'),
        class: 'iwe-badge-premium',
        tip: t('userTipPremium'),
        icon: icon('star', 14)
      });
    }

    // 创作者
    if (userData.creatorProgram === true) {
      badges.push({
        text: t('userBadgeCreator'),
        class: 'iwe-badge-creator',
        tip: t('userTipCreator'),
        icon: icon('film', 14)
      });
    }

    // 角色标签
    if (userData.role === 'admin') {
      badges.push({
        text: t('userBadgeAdmin'),
        class: 'iwe-badge-admin',
        tip: t('userTipAdmin'),
        icon: icon('shield', 14)
      });
    } else if (userData.role === 'moderator') {
      badges.push({
        text: t('userBadgeModerator'),
        class: 'iwe-badge-moderator',
        tip: t('userTipModerator'),
        icon: icon('shield', 14)
      });
    } else if (userData.role === 'officer') {
      badges.push({
        text: t('userBadgeOfficer'),
        class: 'iwe-badge-officer',
        tip: t('userTipOfficer'),
        icon: icon('shield', 14)
      });
    } else if (userData.role === 'limited') {
      badges.push({
        text: t('userBadgeLimited'),
        class: 'iwe-badge-limited',
        tip: t('userTipLimited'),
        icon: icon('warn', 14)
      });
    }

    if (badges.length === 0) return null;

    // 创建标签容器
    const container = h('div', { class: 'iwe-user-badges' });

    for (const badge of badges) {
      const badgeEl = h('span', { class: `iwe-badge ${badge.class}`, tabindex: 0 }, [
        badge.icon ? h('span', { class: 'iwe-badge-icon' }, badge.icon) : null, // icon() 返回的是 SVG 元素，不是 HTML 字符串
        h('span', { class: 'iwe-badge-text' }, badge.text)
      ].filter(Boolean));
      bindTip(badgeEl, () => badge.tip);
      container.appendChild(badgeEl);
    }

    return container;
  }

  site.register('user', {
    css: `
      /* 头像身份环：直接画在站点的 img 上（padding 露出背景当作环）。不做无限动画：列表页几十个头像常驻转圈会让页面空闲也一直重绘 */
      img.iwe-av-premium, img.iwe-av-admin, img.iwe-av-mod, img.iwe-av-limited {
        box-sizing: border-box; border-radius: 50%; padding: 2px; object-fit: cover;
      }
      img.iwe-av-premium {
        background: linear-gradient(135deg, #ce93d8, #64b5f6, #f48fb1);
        box-shadow: 0 0 8px rgba(186, 104, 200, .55);
      }
      body.dark img.iwe-av-premium { box-shadow: 0 0 10px rgba(206, 147, 216, .6); }
      img.iwe-av-admin { background: #f44336; }
      img.iwe-av-mod { background: #66bb6a; }
      img.iwe-av-limited { background: #bdbdbd; }

      /* 悬停提示 / 复制反馈气泡 */
      .iwe-utip {
        position: fixed; z-index: 10060; padding: 5px 9px; border-radius: 6px;
        background: rgba(30, 30, 30, .92); color: #fff; font-size: 12px; font-weight: 500; line-height: 1.4;
        white-space: nowrap; pointer-events: none;
        opacity: 0; transform: translateY(3px) scale(.96);
        transition: opacity .12s, transform .2s cubic-bezier(.2, .8, .2, 1);
      }
      .iwe-utip.in { opacity: 1; transform: none; }
      @media (prefers-reduced-motion: reduce) { .iwe-utip { transition: none; transform: none; } }
      .iwe-badge { cursor: help; }
      .iwe-badge:focus-visible { outline: 2px solid var(--primary, #1ab795); outline-offset: 2px; }

      /* 用户标签容器：放在 @用户名 那一行、站点自己的标签（高级会员等）后面，和站点标签同一套尺寸。
         名字很长会换行，所以不能再和名字挤在同一个横排里 */
      .iwe-user-badges { display: inline; }

      /* 单个标签：和站点的 .badge 同一套结构（行内块、8px 左外边距、基线对齐），尺寸、圆角、字号一致（11.2px、2px 4px 内边距、2px 圆角），
         这样和站点标签的中线、高度逐像素对齐；用弹性布局的话会差 1~2px */
      .iwe-badge {
        display: inline-block;
        margin-left: 8px;
        padding: 2px 4px;
        border-radius: 2px;
        font-size: 11.2px;
        font-weight: 500;
        line-height: 14.4px;
        white-space: nowrap;
      }

      .iwe-badge-icon {
        display: inline-block;
        width: 11px;
        height: 11px;
        margin-right: 3px;
        vertical-align: -1px;
      }

      .iwe-badge-icon svg {
        display: block;
        width: 100%;
        height: 100%;
      }

      /* 高级会员标签（站点没显示高级会员标签时才会出现）：用站点的高级会员色 */
      .iwe-badge-premium {
        background: var(--premium-color, rgb(255, 98, 205));
        color: white;
      }

      /* 创作者标签 */
      .iwe-badge-creator {
        background: rgb(96, 165, 250);
        color: white;
      }

      body.dark .iwe-badge-creator {
        background: rgb(59, 130, 246);
      }

      /* 管理员标签 */
      .iwe-badge-admin {
        background: rgb(239, 68, 68);
        color: white;
      }

      body.dark .iwe-badge-admin {
        background: rgb(220, 38, 38);
      }

      /* 版主标签 */
      .iwe-badge-moderator {
        background: rgb(74, 222, 128);
        color: white;
      }

      body.dark .iwe-badge-moderator {
        background: rgb(34, 197, 94);
      }

      /* 官员标签 */
      .iwe-badge-officer {
        background: rgb(74, 222, 128);
        color: white;
      }

      body.dark .iwe-badge-officer {
        background: rgb(34, 197, 94);
      }

      /* 受限用户标签 */
      .iwe-badge-limited {
        background: rgb(156, 163, 175);
        color: white;
      }

      body.dark .iwe-badge-limited {
        background: rgb(107, 114, 128);
      }
    `,

    scan(ctx) {
      // 处理头像发光/描边
      scanAvatars();

      // 在用户详情页添加标签
      if (ctx.path.startsWith('/profile/')) {
        scanProfilePage(ctx);
      }
    }
  });

  // 只处理可见的头像；观察器全局共用一个（scan 会被反复调用，每次新建会越攒越多）
  const observed = new WeakSet();
  const avatarObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        avatarObserver.unobserve(entry.target);
        observed.delete(entry.target);
        if (entry.target.isConnected && !entry.target.dataset.iweUser) processAvatar(entry.target);
      }
    }
  }, { rootMargin: '50px' });

  /**
   * 扫描并处理页面上的所有头像
   */
  function scanAvatars() {
    // 查找所有头像图片（包括i.iwara.tv和默认头像）
    const avatars = document.querySelectorAll('img[src*="/image/avatar/"], img[src*="/images/default-avatar.jpg"]');
    // 过滤掉已处理的
    for (const avatar of avatars) {
      if (!avatar.dataset.iweUser && !observed.has(avatar)) { observed.add(avatar); avatarObserver.observe(avatar); }
    }
  }

  /**
   * 处理单个头像
   * @param {Element} avatarEl - 头像元素
   */
  async function processAvatar(avatarEl) {
    // 标记为已处理
    avatarEl.dataset.iweUser = 'processing';

    // 提取用户信息
    const userInfo = extractUserInfo(avatarEl);
    if (!userInfo) {
      avatarEl.dataset.iweUser = 'no-info';
      return;
    }

    try {
      // 获取用户数据
      const userData = await getUserData(userInfo.userId, userInfo.username);
      if (!userData) {
        avatarEl.dataset.iweUser = 'no-data';
        return;
      }

      // 确定并应用头像样式
      const style = getAvatarStyle(userData);
      applyAvatarStyle(avatarEl, style);

      avatarEl.dataset.iweUser = 'done';
    } catch (e) {
      avatarEl.dataset.iweUser = 'error';
    }
  }

  /**
   * 扫描并处理用户详情页
   * @param {Object} ctx - 上下文
   */
  async function scanProfilePage(ctx) {
    // 查找用户名区域
    const usernameEl = document.querySelector('.page-profile .profile__username, .page-profile .username, .page-profile h1');
    if (!usernameEl) return;
    // 名字和 @用户名：点击复制（不依赖用户数据，先绑）
    const nameText = usernameEl.querySelector('.text') || usernameEl;
    usernameEl.removeAttribute('title'); // 站点的原生 title 在外层 .username 上，会和我们的气泡重复
    bindCopy(nameText, () => nameText.textContent.trim());
    const handleEl = [...document.querySelectorAll('.page-profile__header__middle .text--muted')].find((e) => e.textContent.trim().startsWith('@'));
    if (handleEl) bindCopy(handleEl, () => handleEl.textContent.trim());
    if (usernameEl.dataset.iweUserBadges) return;

    usernameEl.dataset.iweUserBadges = 'processing';

    // 从URL提取用户名
    const match = ctx.path.match(/\/profile\/([^/?#]+)/);
    if (!match) return;

    const username = match[1];

    try {
      // 获取用户数据
      const userData = await getUserData(null, username);
      if (!userData) {
        usernameEl.dataset.iweUserBadges = 'no-data';
        return;
      }

      // 创建标签
      const mid = usernameEl.closest('.page-profile__header__middle') || usernameEl.parentElement;
      const badges = createUserBadges(userData, { skipPremium: !!mid.querySelector('.badge--premium') });
      if (!badges) {
        usernameEl.dataset.iweUserBadges = 'no-badges';
        return;
      }

      // 插到 @用户名 那一行的末尾（跟在站点自己的标签后面），不再挤进名字那一行
      mid.append(badges);

      usernameEl.dataset.iweUserBadges = 'done';
    } catch (e) {
      usernameEl.dataset.iweUserBadges = 'error';
    }
  }
})();
