// 默认标签黑名单提醒（与 App 的 DefaultTagBlacklistReminder 同一套规则）。
//
// 站点会给每个新注册账号自动加上一批标签黑名单，含这些标签的视频 / 图片从所有列表里隐藏，很多人并不知道，
// 只觉得「有些视频搜不到、看不了」。账号的黑名单与站点默认那一套**完全一致**（一个没增、一个没删）时，
// 说明用户从没管理过它：提醒一次，可以直接去设置页管理。
//
// - 数据：站点自己加载时就会请求 GET /user，响应里带 tagBlacklist（[{ id, type, sensitive }]）——旁听它，不额外发请求。
// - 每个用户名只提醒一次（无论点「去管理」还是「暂不处理」），记在 store 'blDefaultSeen'。
// - 「去管理」：站内跳到 /account/account，滚到「列入黑名单的标签」那一块并高亮一下。
// - 桌面：居中卡片；手机（≤575px）：底部抽屉，可下滑关闭。出现与消失都有动画。
// - 可在设置里单独关掉（功能名 defaultBlacklist）。

(() => {
  const FEATURE = 'defaultBlacklist';
  const SEEN = 'blDefaultSeen';
  const DEFAULT_IDS = ['beastiality', 'guro', 'loli', 'pee', 'rape', 'ryona', 'scat', 'shota'];
  const MANAGE = '/account/account';

  defineStrings({
    blTitle: '检测到网站默认的标签黑名单',
    blBody: 'Iwara 会给每个新注册的账号自动加上一批标签黑名单。带有这些标签的视频和图片会从所有列表里隐藏，所以你可能会发现有些作品搜不到、看不了。',
    blTags: '默认屏蔽的 {n} 个标签',
    blNote: '只提醒这一次。之后也可以在「设置 → 账号 → 列入黑名单的标签」里随时调整。',
    blManage: '去管理',
    blLater: '暂不处理',
  }, {
    blTitle: 'Default tag blacklist detected',
    blBody: 'Iwara automatically applies a tag blacklist to every new account. Videos and images with these tags are hidden from all lists, which is why some content may seem missing or unavailable to you.',
    blTags: '{n} tags blocked by default',
    blNote: 'We will only remind you once. You can change this any time under Settings → Account → Blacklisted tags.',
    blManage: 'Manage',
    blLater: 'Not now',
  }, {
    blTitle: 'サイト既定のタグブラックリストを検出しました',
    blBody: 'Iwara は新規登録のアカウントすべてに、タグのブラックリストを自動で設定します。これらのタグが付いた動画や画像はすべての一覧で非表示になるため、一部の作品が検索にも表示にも出てこないことがあります。',
    blTags: '既定でブロックされている {n} 個のタグ',
    blNote: 'お知らせは今回だけです。あとから「設定 → アカウント → ブラックリストに入れたタグ」でいつでも変更できます。',
    blManage: '管理する',
    blLater: 'あとで',
  });

  let pending = null; // 等页面就绪后再弹
  let focusOnArrive = false;

  const isDefault = (list) => {
    const ids = new Set((list || []).map((x) => (x && typeof x === 'object' ? x.id : x)));
    return ids.size === DEFAULT_IDS.length && DEFAULT_IDS.every((id) => ids.has(id));
  };

  siteData.onApi((url, json) => {
    if (site.isOff(FEATURE)) return;
    let path;
    try { path = new URL(url).pathname; } catch { return; }
    if (path !== '/user' || !json || !json.user || !Array.isArray(json.tagBlacklist)) return;
    const name = json.user.username;
    if (!name) return; // 站点一页里会请求好几次 /user：每次都按最新的黑名单判断，弹过一次就记下，不会重复
    if ((store.get(SEEN, []) || []).includes(name)) return;
    if (!isDefault(json.tagBlacklist)) return;
    pending = name;
    site.schedule();
  });

  function markSeen(name) {
    const seen = store.get(SEEN, []) || [];
    if (!seen.includes(name)) { seen.push(name); store.set(SEEN, seen.slice(-50)); }
  }

  // ── 弹层 ──
  function show(name) {
    markSeen(name); // 弹出即算提醒过：和 App 一致，怎么关都只提醒一次
    const mobile = matchMedia('(max-width: 575.98px)').matches;
    const prevFocus = document.activeElement;
    const chips = DEFAULT_IDS.map((id) => {
      const label = tagDict.name(id);
      return h('li.iwe-bl-chip', { title: id }, h('span', label), !label.toLowerCase().includes(id) && h('span.iwe-bl-id', id)); // 译名里已带原名（「猎奇受虐 (Ryona)」）就不重复
    });
    const later = h('button.iwe-bl-btn', { type: 'button', onclick: () => close() }, t('blLater'));
    const go = h('button.iwe-bl-btn.iwe-bl-primary', { type: 'button', onclick: () => close(manage) }, h('span', t('blManage')), icon('arrowRight', 15));
    const card = h('div.iwe-bl-card', { role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'iwe-bl-title', 'aria-describedby': 'iwe-bl-body' },
      mobile && h('div.iwe-bl-grab', { 'aria-hidden': 'true' }),
      h('div.iwe-bl-main',
        h('div.iwe-bl-head', h('div.iwe-bl-mark', icon('eyeOff', 18)), h('h2.iwe-bl-title', { id: 'iwe-bl-title' }, t('blTitle'))),
        h('p.iwe-bl-body', { id: 'iwe-bl-body' }, t('blBody')),
        h('div.iwe-bl-label', t('blTags', { n: DEFAULT_IDS.length })),
        h('ul.iwe-bl-chips', chips),
        h('p.iwe-bl-note', icon('info', 13), h('span', t('blNote')))),
      h('div.iwe-bl-foot', later, go));
    const root = h('div.iwe-bl' + (mobile ? '.iwe-bl-sheet' : ''), h('div.iwe-bl-scrim', { onclick: () => close() }), card);
    document.body.append(root);
    const html = document.documentElement, oldOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('iwe-bl-in')));
    setTimeout(() => go.focus({ preventScroll: true, focusVisible: false }), 60); // 焦点给主按钮，但不画焦点环（键盘操作时才画）

    let closed = false;
    function close(after) {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      root.classList.remove('iwe-bl-in');
      root.classList.add('iwe-bl-out');
      card.style.transform = '';
      setTimeout(() => {
        root.remove();
        html.style.overflow = oldOverflow;
        if (after) after(); else if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true });
      }, 220);
    }
    // Esc 关闭；Tab 只在弹层里转
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key === 'Tab') {
        const f = [later, go];
        const i = f.indexOf(document.activeElement);
        if (i === -1 || (e.shiftKey && i === 0) || (!e.shiftKey && i === f.length - 1)) { e.preventDefault(); f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i + 1) % f.length].focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);

    // 手机抽屉：按住顶部（把手 / 标题区）往下拖，过 90px 或甩得快就关
    if (mobile) {
      let y0 = null, t0 = 0, dy = 0, pid = null;
      const head = card.querySelector('.iwe-bl-grab');
      const startDrag = (e) => { if (e.button) return; pid = e.pointerId; y0 = e.clientY; t0 = performance.now(); dy = 0; card.classList.add('iwe-bl-drag'); card.setPointerCapture(pid); };
      [head, card.querySelector('.iwe-bl-head')].forEach((el) => el.addEventListener('pointerdown', startDrag));
      card.addEventListener('pointermove', (e) => {
        if (y0 == null || e.pointerId !== pid) return;
        dy = Math.max(0, e.clientY - y0);
        card.style.transform = `translateY(${dy}px)`;
      });
      const end = (e) => {
        if (y0 == null || e.pointerId !== pid) return;
        const v = dy / Math.max(1, performance.now() - t0);
        y0 = null;
        card.classList.remove('iwe-bl-drag');
        if (dy > 90 || v > 0.6) close(); else card.style.transform = '';
      };
      card.addEventListener('pointerup', end);
      card.addEventListener('pointercancel', end);
    }
  }

  function manage() {
    focusOnArrive = true;
    if (location.pathname === MANAGE) { site.schedule(); return; }
    history.pushState(null, '', MANAGE);
    dispatchEvent(new PopStateEvent('popstate'));
    scrollTo(0, 0);
  }
  // 设置页「列入黑名单的标签」那一块：第一块标题里带「黑名单」的就是它（标签在用户前面）
  const BL_TITLE = /black\s*-?list|黑名单|黑名單|ブラックリスト/i;
  function focusBlock() {
    const title = [...document.querySelectorAll('section.content .text--h1, section.content .text--h2, section.content .text--bold')]
      .find((e) => BL_TITLE.test(e.textContent || ''));
    if (!title) return false;
    const block = title.closest('.block') || title.parentElement;
    const top = block.getBoundingClientRect().top + scrollY - 96;
    scrollTo({ top: Math.max(0, top), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    block.classList.remove('iwe-bl-flash'); void block.offsetWidth; block.classList.add('iwe-bl-flash');
    setTimeout(() => block.classList.remove('iwe-bl-flash'), 2400);
    return true;
  }

  let focusDeadline = 0;
  site.register(FEATURE, {
    css: `
.iwe-bl{position:fixed;inset:0;z-index:2147482000;display:flex;align-items:center;justify-content:center;padding:16px;
  font:14px/1.5 Geist,Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans","Microsoft YaHei",sans-serif;color:var(--fg);-webkit-font-smoothing:antialiased;letter-spacing:-.006em}
.iwe-bl *{box-sizing:border-box}
.iwe-bl-scrim{position:absolute;inset:0;background:rgba(0,0,0,.42);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);opacity:0;transition:opacity .2s ease}
.iwe-bl-card{position:relative;width:100%;max-width:448px;max-height:calc(100vh - 32px);display:flex;flex-direction:column;overflow:hidden;
  background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:0 1px 1px rgba(0,0,0,.02),0 8px 16px -4px rgba(0,0,0,.08),0 24px 48px -12px rgba(0,0,0,.18);
  opacity:0;transform:translateY(8px) scale(.97);transition:opacity .18s ease,transform .32s var(--ease)}
.iwe-bl-in .iwe-bl-scrim{opacity:1}
.iwe-bl-in .iwe-bl-card{opacity:1;transform:none}
.iwe-bl-out .iwe-bl-card{transition-duration:.15s,.2s;transform:translateY(4px) scale(.98)}
.iwe-bl-main{padding:24px 24px 20px;overflow-y:auto;overscroll-behavior:contain}
.iwe-bl-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.iwe-bl-mark{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--sunk);color:var(--amber)}
.iwe-bl-title{margin:0;font-size:16px;font-weight:600;line-height:1.35;letter-spacing:-.015em;color:var(--fg)}
.iwe-bl-body{margin:0 0 18px;color:var(--fg2);font-size:14px;line-height:1.65}
.iwe-bl-label{margin-bottom:8px;font-size:12px;font-weight:500;color:var(--fg3);letter-spacing:.01em}
.iwe-bl-chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 16px;padding:0;list-style:none}
.iwe-bl-chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;border:1px solid var(--line2);background:var(--sunk);font-size:12.5px;font-weight:500;color:var(--fg)}
.iwe-bl-id{font:11px "Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--fg3)}
.iwe-bl-note{display:flex;gap:6px;margin:0;font-size:12.5px;line-height:1.55;color:var(--fg3)}
.iwe-bl-note svg{flex:none;margin-top:3px}
.iwe-bl-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--line);background:var(--bg)}
.iwe-bl-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 14px;border-radius:8px;border:1px solid var(--line2);background:var(--card);color:var(--fg);
  font:inherit;font-size:14px;font-weight:500;cursor:pointer;white-space:nowrap;transition:background .15s,opacity .15s,transform .2s var(--ease)}
.iwe-bl-btn:hover{background:var(--sunk)}
.iwe-bl-btn:active{transform:scale(.97)}
.iwe-bl-btn:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.iwe-bl-primary{background:var(--fg);border-color:var(--fg);color:var(--inv)}
.iwe-bl-primary:hover{background:var(--fg);opacity:.86}
.iwe-bl-primary svg{transition:transform .2s var(--ease)}
.iwe-bl-primary:hover svg{transform:translateX(2px)}
/* 手机：底部抽屉 */
.iwe-bl-sheet{align-items:flex-end;padding:0}
.iwe-bl-sheet .iwe-bl-card{max-width:none;max-height:88vh;border-radius:16px 16px 0 0;border-bottom:0;transform:translateY(100%);opacity:1;transition:transform .36s var(--ease)}
.iwe-bl-sheet.iwe-bl-in .iwe-bl-card{transform:none}
.iwe-bl-sheet.iwe-bl-out .iwe-bl-card{transform:translateY(100%);transition-duration:.22s}
.iwe-bl-sheet .iwe-bl-card.iwe-bl-drag{transition:none}
.iwe-bl-grab{flex:none;width:36px;height:4px;margin:8px auto 0;border-radius:2px;background:var(--line2);touch-action:none;cursor:grab}
.iwe-bl-sheet .iwe-bl-grab{box-shadow:0 0 0 14px transparent}
.iwe-bl-sheet .iwe-bl-head{touch-action:none}
.iwe-bl-sheet .iwe-bl-main{padding:16px 20px 16px}
.iwe-bl-sheet .iwe-bl-foot{flex-direction:column-reverse;padding:12px 16px calc(12px + env(safe-area-inset-bottom))}
.iwe-bl-sheet .iwe-bl-btn{width:100%;height:44px;font-size:15px}
/* 管理页上那一块：到达时描一圈 */
.iwe-bl-flash{animation:iwe-bl-flash 2.2s var(--ease,ease)}
@keyframes iwe-bl-flash{0%,60%{box-shadow:0 0 0 2px var(--primary,#1abc9c),0 0 0 8px color-mix(in srgb,var(--primary,#1abc9c) 22%,transparent)}100%{box-shadow:0 0 0 2px transparent,0 0 0 8px transparent}}
@media (prefers-reduced-motion:reduce){.iwe-bl-card,.iwe-bl-scrim{transition-duration:.01s!important}.iwe-bl-flash{animation-duration:.01s}}
`,
    scan(ctx) {
      // 站点刚加载完别马上弹：等页面稳定一下；登录 / 注册页、正在管理黑名单时不弹
      if (pending && !/^\/(login|register)\b/.test(ctx.path) && ctx.path !== MANAGE && document.querySelector('section.content')) {
        const name = pending;
        pending = null;
        setTimeout(() => { if (!site.isOff(FEATURE)) show(name); }, 900);
      }
      if (focusOnArrive && ctx.path === MANAGE) {
        if (!focusDeadline) focusDeadline = Date.now() + 6000;
        if (focusBlock() || Date.now() > focusDeadline) { focusOnArrive = false; focusDeadline = 0; }
      }
    },
  });
})();
