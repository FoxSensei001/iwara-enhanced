// 帮助弹窗：左边目录，右边内容。新手指引都收在这里——发布流程、填空（四幕动画）、写简介、快捷键。
// 右上角「?」随时打开；第一次进「内容」这一步时自动打开到「填空」。
// 有动画的页（play）循环播放，切页或关闭时用令牌作废还在跑的那一轮；静态页（build）直接摆出示意。

STYLE.push(`
.sheet.help{width:min(900px,100%);max-height:none;height:min(620px,calc(100vh - 48px));display:grid;grid-template-columns:212px minmax(0,1fr);overflow:hidden}
.help nav{position:relative;display:flex;flex-direction:column;gap:2px;padding:16px 10px;border-right:1px solid var(--line);background:color-mix(in srgb,var(--sunk) 55%,var(--card));overflow:auto}
.help nav h3{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:4px 10px;font-size:15px;font-weight:600;letter-spacing:-.02em}
.help nav .grp{display:flex;align-items:center;gap:8px;margin-top:10px;padding:6px 10px 4px;font-size:11.5px;font-weight:600;color:var(--fg3);letter-spacing:.02em}
.help nav .grp:first-of-type{margin-top:0}
.help nav button.solo{margin-top:10px;gap:8px;padding-left:30px}
.help nav button.solo .ic{position:absolute;left:12px;color:var(--fg3)}
.help nav button.solo.cur .ic{opacity:0}
.help nav button{position:relative;z-index:1;display:flex;align-items:center;width:100%;min-height:32px;padding:5px 10px 5px 30px;border:0;border-radius:8px;background:none;color:var(--fg2);font-size:13px;line-height:1.35;text-align:left;cursor:pointer;transition:color .15s}
.help nav button:hover{color:var(--fg)}
.help nav button.cur{color:var(--fg);font-weight:500}
.help nav .hl{position:absolute;z-index:0;left:10px;right:10px;top:0;height:32px;border-radius:8px;background:var(--card);box-shadow:0 0 0 1px var(--line),0 1px 2px rgba(0,0,0,.05);transition:transform .38s var(--ease),height .38s var(--ease);pointer-events:none}
.help nav .hl::before{content:"";position:absolute;left:12px;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:var(--fg)}
.help .main{position:relative;display:flex;flex-direction:column;min-width:0;min-height:0}
.help .main .g-stage{flex:none;border-radius:0 16px 0 0}
.help .main .g-txt{flex:1;min-height:0;overflow:auto}
.help .x{position:absolute;right:10px;top:10px;z-index:10}
.help .tfoot{border-top:1px solid var(--line)}
.help .pageno{flex:1;font-size:12px;color:var(--fg3)}
.g-static{position:absolute;inset:0;display:grid;place-items:center;padding:24px 36px;opacity:0;transform:translateX(36px);transition:opacity .35s,transform .6s var(--ease);user-select:none}
.g-static.cur{opacity:1;transform:none}
.g-static.prev{transform:translateX(-36px)}
.h-demo{display:grid;gap:14px;width:100%;max-width:600px}
.h-demo .pair{display:grid;grid-template-columns:minmax(0,1fr) 22px minmax(0,1.25fr);align-items:center;gap:10px}
.h-demo .pair>.ic{color:var(--fg3)}
.h-demo .g-field{height:42px;font-size:14px;font-weight:400;overflow:hidden}
.h-demo .g-field>*{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.h-demo .src{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12.5px;color:var(--fg2)}
.h-demo .lk{color:var(--blue);font-weight:500}
.h-demo .lk .ic{display:inline-block;vertical-align:-2px;margin-right:3px}
.h-demo .wait{color:var(--fg3);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--blue) 18%,transparent),transparent) 0 0/200% 100%;animation:lkwait 1.1s linear infinite;border-radius:4px}
.h-doc{flex:1;min-height:0;overflow:auto;padding:22px 26px 18px}
.md-help h4{display:flex;align-items:center;gap:6px;margin:18px 0 8px;font-size:14px;font-weight:600}
.md-help h4:first-child{margin-top:0}
.md-help h4 a{display:inline-flex;align-items:center;gap:5px;color:inherit;text-decoration:none}
.md-help h4 a:hover{text-decoration:underline}
.md-help .row3{display:grid;grid-template-columns:128px minmax(0,1fr) minmax(0,1fr);gap:14px;padding:12px 0;border-top:1px solid var(--line);align-items:start;font-size:13px}
.md-help .c0 .lbl{display:inline-flex;align-items:center;gap:5px;padding:0;border:0;background:none;font-weight:600;color:var(--fg);cursor:pointer;text-align:left}
.md-help .c0 .lbl .ic{opacity:0;color:var(--fg3);transition:opacity .15s}
.md-help .c0 .lbl:hover .ic{opacity:1}
.md-help .c0 small{display:block;margin-top:3px;color:var(--fg3);font-size:11.5px}
.md-help .c1{line-height:2;color:var(--fg2)}
.md-help .c1 kbd{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;margin:0 2px 0 0;border-radius:5px;border:1px solid var(--line2);box-shadow:0 1px 0 var(--line2);background:var(--card);font:600 10.5px "Geist Mono",ui-monospace,monospace;color:var(--fg)}
.md-help .c1 code{font:12px "Geist Mono",ui-monospace,monospace;padding:1px 5px;border-radius:5px;background:var(--sunk);border:1px solid var(--line);margin-right:2px}
.md-help .c2>span{display:flex;flex-wrap:wrap;gap:4px 12px}
.md-help .c2 p{margin:0 0 6px}.md-help .c2 h1{font-size:20px;margin:0 0 4px}.md-help .c2 h2{font-size:16px;margin:0}
.md-help .c2 img{max-width:100%;max-height:160px;border-radius:8px;border:1px solid var(--line)}
.md-help a.fake{display:inline-flex;align-items:center;gap:4px;color:var(--blue);cursor:default}
.md-help .note{display:flex;gap:8px;color:var(--fg3)}
@media (max-width:720px){.md-help .row3{grid-template-columns:1fr}}
.h-keys{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;align-items:center;font-size:13px;color:var(--fg2)}
.h-keys .k{display:flex;gap:4px;justify-content:flex-end}
.h-keys kbd{display:inline-grid;place-items:center;min-width:26px;height:24px;padding:0 7px;border-radius:6px;border:1px solid var(--line2);box-shadow:0 1.5px 0 var(--line2);background:var(--card);font:600 11.5px "Geist Mono",ui-monospace,monospace;color:var(--fg)}
@media (max-width:720px){.sheet.help{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}.help nav{flex-direction:row;flex-wrap:nowrap;overflow-x:auto;border-right:0;border-bottom:1px solid var(--line);padding:10px}.help nav h3,.help nav .grp,.help nav .hl{display:none}.help nav button{flex:none;width:auto;padding:5px 12px;border-radius:999px}.help nav button.cur{background:var(--card);box-shadow:0 0 0 1px var(--line)}.help .main .g-stage{border-radius:0}}
`);

/** 站点官方的格式说明（发布页编辑框旁「格式」弹窗）：结构和示例与站点弹窗一致（siteRules.mdHelp），文案按界面语言取站点原文。 */
function mdHelpDoc(L) {
  const tree = siteRules.mdHelp();
  if (!tree) return h('div.md-help', h('p.note', icon('warn', 14), h('span', L.formatFail)));
  const dark = ui.root.querySelector('.app') && ui.root.querySelector('.app').dataset.theme === 'dark';
  const txtOf = (id) => siteRules.text(id) || id.split('.').pop();
  const ICON = { profile: 'user', video: 'film', image: 'picture', forum: 'chat', playlist: 'list', rule: 'shield', page: 'file' };
  const TAGS = /^(p|strong|em|del|s|h[1-6]|blockquote|ul|ol|li|code|pre|kbd|hr|br|span|b|i)$/;
  function render(n) {
    if (typeof n === 'string') return n;
    if (n.t === 'C') {
      if (n.name) return icon(ICON[n.name] || 'link', 14);
      if (n.to) return h('a', { href: new URL(n.to, location.origin).href, target: '_blank', rel: 'noopener' }, n.k.map(render));
      if (n.id) return h('span', txtOf(n.id));
      return h('span', n.k.map(render));
    }
    if (n.t === 'a') return h('a.fake', n.k.map(render));
    if (n.t === 'img') {
      const src = n.src || (n.srcTpl && n.srcTpl[0] + (dark ? 'dark' : 'light') + n.srcTpl[1]);
      return src && src.startsWith('/') ? h('img', { src: location.origin + src, alt: '' }) : null;
    }
    if (TAGS.test(n.t)) return h(n.t, n.k.map(render));
    return h('span', n.k.map(render));
  }
  const find = (n, fn) => { if (!n || typeof n === 'string') return null; if (fn(n)) return n; for (const k of n.k) { const r = find(k, fn); if (r) return r; } return null; };
  const out = h('div.md-help');
  for (const n of tree.k) {
    if (typeof n === 'string') continue;
    if (n.t === 'C' && n.size === 'h3') continue; // 「格式」大标题：页面已有
    if (n.t === 'C' && (n.id || n.to)) {
      const id = n.id || (find(n, (x) => x.id) || {}).id;
      out.append(h('h4', n.to ? h('a', { href: n.to, target: '_blank', rel: 'noopener' }, txtOf(id), icon('external', 12)) : txtOf(id)));
      continue;
    }
    if (n.className === 'row' && n.k.length >= 3) {
      const [c0, c1, c2] = n.k;
      const labelNode = find(c0, (x) => x.id && !/Description$/.test(x.id));
      const descNode = find(c0, (x) => x.id && /Description$/.test(x.id));
      const copyNode = find(c0, (x) => typeof x.copy === 'string');
      const label = h(copyNode ? 'button.lbl' : 'span.lbl', copyNode ? { type: 'button', onclick: () => { navigator.clipboard.writeText(copyNode.copy).then(() => toast(txtOf('markdownField.help.copiedToClipboard'))); } } : null,
        labelNode ? txtOf(labelNode.id) : '', copyNode && icon('copy', 12));
      out.append(h('div.row3', h('div.c0', label, descNode && h('small', txtOf(descNode.id))), h('div.c1', render(c1)), h('div.c2.prose', render(c2))));
    }
  }
  return out;
}

function helpPages() {
  const zh = env.lang === 'zh';
  const L = zh
    ? {
      title: '帮助', slotNav: ['填空是什么', '做一个填空', '填一个空', '在填空之间切换'], flow: '发布流程', slots: '填空', editor: '写简介', keys: '快捷键',
      flow1: '发布拆成四步：上传 → 内容 → 标签 → 发布。顶部的步骤条可以随时点回去改；每一步都会自动存草稿，关掉页面再回来还在。',
      flow2: '用中文搜标签，站点上的英文标签会自动对上。用过的标签会留在下面，下次一点就加；不想再看到的可以移除。',
      flow3: '把常用的标题格式、简介、标签、分级存成模板，下次右上角「模板」一键套用，只需要填几个空。',
      link: '链接', linkTxt: '打 [文字](网址) 时，打完右括号就变成链接；裸网址后面接一个空格就变成链接。贴进来的 Iwara 站内链接（视频、图片、用户、播放列表、论坛帖）会自动换成作品名。按住 ⌘ / Ctrl 点链接可以打开。',
      mention: '提及', mentionTxt: '打 @ 加用户名会弹出用户列表，↑↓ 选择、回车确认。提及会显示成蓝色，按住 ⌘ / Ctrl 点它可以打开对方主页。',
      format: '格式', formatFail: '这次没能从站点读到官方的格式说明。可以在原版发布页编辑框旁点「格式」查看。',
      keysTxt: '这些按键在发布页里随时可用。弹窗、菜单开着或者输入法正在选词时不响应。还不能进下一步时（比如填空没填完、发布条件没满足），按钮会抖一下并提示卡在哪。',
      keyList: [[['→'], '下一步（没在输入时）'], [['←'], '上一步（没在输入时）'], [['⌘', '↵'], '下一步 / 发布（输入时也能用）'], [['⌘', '⇧', '↵'], '上一步（输入时也能用）'], [['Tab'], '跳到下一个填空'], [['↵'], '这一格填完'], [['⌫'], '空填空里：退出；填空后面：整个删掉'], [['Esc'], '关闭弹窗、菜单'], [['@'], '提及用户']],
      prev: '上一页', next: '下一页', page: (a, b) => `${a} / ${b}`, close: '关闭',
    }
    : {
      title: 'Help', slotNav: ['What blanks are', 'Make a blank', 'Fill a blank', 'Move between blanks'], flow: 'Publishing', slots: 'Blanks', editor: 'Description', keys: 'Shortcuts',
      flow1: 'Publishing takes four steps: upload → content → tags → publish. Click the stepper to go back at any time; drafts save automatically.',
      flow2: 'Search tags in your own language and they map to the site’s tags. Tags you used stay below for one-click reuse; remove the ones you don’t want.',
      flow3: 'Save your usual title pattern, description, tags and rating as a template, then apply it from “Templates” and just fill in the blanks.',
      link: 'Links', linkTxt: 'Typing [text](url) turns into a link as soon as you close the parenthesis; a bare URL becomes a link once you type a space after it. Iwara links (videos, images, users, playlists, forum threads) are replaced with their titles. ⌘/Ctrl-click to open.',
      mention: 'Mentions', mentionTxt: 'Type @ and a name to pick a user — ↑↓ to choose, Enter to confirm. Mentions turn blue; ⌘/Ctrl-click opens their profile.',
      format: 'Formatting', formatFail: 'Couldn’t read the site’s formatting guide this time. Open the original upload page and click “Formatting” next to the editor.',
      keysTxt: 'These keys work anywhere on the publish page, except while a dialog or menu is open or an input method is composing. If you can’t move on yet, the button shakes and tells you what’s missing.',
      keyList: [[['→'], 'Next step (when not typing)'], [['←'], 'Previous step (when not typing)'], [['⌘', '↵'], 'Next / publish (works while typing)'], [['⌘', '⇧', '↵'], 'Previous step (works while typing)'], [['Tab'], 'Next blank'], [['↵'], 'Done with this blank'], [['⌫'], 'Leave an empty blank; delete a blank right before the cursor'], [['Esc'], 'Close dialogs and menus'], [['@'], 'Mention a user']],
      prev: 'Previous', next: 'Next', page: (a, b) => `${a} / ${b}`, close: 'Close',
    };
  if (!navigator.platform.includes('Mac')) for (const row of L.keyList) row[0] = row[0].map((k) => (k === '⌘' ? 'Ctrl' : k));
  const demos = tourDemos();
  const slot = slotGuidePages();
  const pair = (src, out) => h('div.pair', h('div.g-field', src), icon('arrowRight', 18), h('div.g-field', out));
  const iwLink = (name, wait) => h('span.lk' + (wait ? '.wait' : ''), icon('film', 13), name);
  const groups = [
    { key: 'flow', icon: 'layers', title: L.flow, pages: [
      { nav: t('tour1'), title: t('tour1'), text: L.flow1, build: () => demos[0] },
      { nav: t('tour2'), title: t('tour2'), text: L.flow2, build: () => demos[1] },
      { nav: t('tour3'), title: t('tour3'), text: L.flow3, build: () => demos[2] },
    ] },
    { key: 'slots', icon: 'sparkle', title: L.slots, pages: slot.pages.map((p, j) => ({ ...p, nav: L.slotNav[j] })) },
    { key: 'editor', icon: 'pencil', title: L.editor, pages: [
      { nav: L.link, title: L.link, text: L.linkTxt, build: () => h('div.h-demo',
        pair(h('span.src', zh ? '[示例](https://example.com)' : '[Example](https://example.com)'), h('span.lk', zh ? '示例' : 'Example')),
        pair(h('span.src', 'https://www.iwara.tv/video/…␣'), iwLink(zh ? '正在取作品名…' : 'Fetching title…', true)),
        pair(h('span.src', 'https://www.iwara.tv/video/…'), iwLink(zh ? '【MMD】初音未来 - Gimme×Gimme' : 'Miku - Gimme×Gimme'))) },
      { nav: L.mention, title: L.mention, text: L.mentionTxt, build: () => h('div.h-demo',
        pair(h('span.src', '@exam'), h('span', h('span.lk', '@example_user'), ' ', h('span', { style: { color: 'var(--fg3)' } }, zh ? '（⌘ 点击打开主页）' : '(⌘-click to open)')))) },
      { key: 'format', nav: L.format, title: L.format, doc: () => mdHelpDoc(L) },
    ] },
    { key: 'keys', icon: 'grip', title: L.keys, pages: [
      { nav: L.keys, title: L.keys, text: L.keysTxt, build: () => h('div.h-keys', L.keyList.flatMap(([ks, v]) => [h('span.k', ks.map((k) => h('kbd', k))), h('span', v)])) },
    ] },
  ];
  return { L, groups, slot };
}

/** at：从哪一组开始（'flow' | 'slots' | 'editor' | 'keys'），或者直接到某一页（'format'）。onClose：关掉后调用。 */
function showHelp({ at = 'flow', onClose } = {}) {
  const { L, groups, slot } = helpPages();
  const pages = groups.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.key })));
  let token = 0, i = 0, closed = false;

  const views = pages.map((p) => h(p.play ? 'div.g-scene' : 'div.g-static'));
  const replay = ibtn('swap', t('sgReplay'), () => show(i, true));
  replay.classList.add('g-replay');
  const stage = h('div.g-stage', views, replay);
  const txt = h('div.g-txt');
  const docBox = h('div.h-doc', { style: { display: 'none' } });
  const pageno = h('span.pageno');
  const prevBtn = btn(L.prev, { kind: 'ghost', icon: 'arrowLeft', onclick: () => show(i - 1) });
  const nextBtn = btn(L.next, { kind: 'primary', iconRight: 'arrowRight', onclick: () => (i === pages.length - 1 ? close() : show(i + 1)) });
  const foot = h('div.tfoot', pageno, prevBtn, nextBtn);
  const hl = h('div.hl');
  const navBtns = [];
  const nav = h('nav', h('h3', icon('help', 16), L.title), hl, groups.map((g) => [
    g.pages.length > 1 && h('div.grp', icon(g.icon, 13), g.title), // 只有一页的组不另起组名，免得和条目重复
    g.pages.map((p) => { const j = pages.findIndex((x) => x.group === g.key && x.nav === p.nav); const solo = g.pages.length === 1;
      const b = h('button' + (solo ? '.solo' : ''), { type: 'button', onclick: () => show(j) }, solo && icon(g.icon, 13), p.nav); navBtns[j] = b; return b; }),
  ]));
  const main = h('div.main', stage, txt, docBox, foot, ibtn('x', L.close, () => close()));
  main.lastChild.classList.add('x');
  const scrim = h('div.scrim');

  async function loop(n, my) {
    const alive = () => my === token && !closed;
    const root = views[n];
    await sleep(420); // 等换页的过渡走完再量坐标
    while (alive()) {
      clear(root);
      try { await pages[n].play(root, slot.kit(root, alive)); } catch (e) { if (e !== slot.STOP) { console.error('[iwe] help', e); return; } }
      if (!alive()) return;
      root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      await sleep(320);
      if (!alive()) return;
      root.getAnimations().forEach((a) => a.cancel());
    }
  }
  const legend = () => h('div.g-legend',
    h('span', h('kbd', 'Tab'), t('sgKeyTab')), h('span', h('kbd', '↵'), h('kbd', '→'), t('sgKeyDone')), h('span', h('kbd', '⌫'), t('sgKeyBack')));
  function show(n, again) {
    const from = i;
    i = clamp(n, 0, pages.length - 1);
    const my = ++token;
    views.forEach((v, j) => { v.className = (pages[j].play ? 'g-scene' : 'g-static') + (j === i ? ' cur' : j < i ? ' prev' : ''); });
    const p = pages[i];
    // 文档页（官方格式说明）：整块可滚动的正文，不要演示区
    stage.style.display = txt.style.display = p.doc ? 'none' : '';
    docBox.style.display = p.doc ? '' : 'none';
    if (p.doc) { if (!docBox.firstChild || docBox.dataset.page !== String(i)) { clear(docBox).append(p.doc()); docBox.dataset.page = String(i); docBox.scrollTop = 0; } docBox.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }); }
    else if (!p.play && (again || !views[i].firstChild)) clear(views[i]).append(p.build());
    if (p.play) loop(i, my);
    replay.style.visibility = p.play ? '' : 'hidden';
    if (!p.doc && (from !== i || again !== true)) {
      add(clear(txt), [h('b', p.title), h('p', p.text), p.legend && legend()]);
      txt.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    navBtns.forEach((b, j) => b && b.classList.toggle('cur', j === i));
    const b = navBtns[i];
    if (b) { hl.style.transform = `translateY(${b.offsetTop}px)`; hl.style.height = b.offsetHeight + 'px'; b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    pageno.textContent = L.page(i + 1, pages.length);
    prevBtn.disabled = i === 0;
    const last = i === pages.length - 1;
    clear(nextBtn).append(h('span', last ? t('sgDone') : L.next), !last ? icon('arrowRight') : '');
  }
  function close() {
    if (closed) return;
    closed = true;
    token++;
    store.set('slotGuideDone', VERSION);
    unlockScroll();
    scrim.classList.remove('in');
    setTimeout(() => scrim.remove(), 240);
    document.removeEventListener('keydown', onKey, true);
    onClose && onClose();
  }
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); show(i + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); show(i - 1); }
    else if (e.key === 'Enter' && !(e.target && e.target.closest && e.target.closest('button'))) { e.preventDefault(); e.stopPropagation(); i === pages.length - 1 ? close() : show(i + 1); }
    else if (e.key === 'Tab' || e.key.length === 1 || e.key === 'Backspace') { if (e.key !== 'Tab') { e.preventDefault(); e.stopPropagation(); } } // 别让按键漏到身后的标题框里
  };
  document.addEventListener('keydown', onKey, true);
  if (ui.root.activeElement) ui.root.activeElement.blur();
  scrim.append(h('div.sheet.help', { role: 'dialog', 'aria-label': L.title }, nav, main));
  scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
  ui.layer.append(scrim);
  lockScroll();
  const byKey = pages.findIndex((p) => p.key === at);
  const start = byKey >= 0 ? byKey : Math.max(0, pages.findIndex((p) => p.group === at));
  requestAnimationFrame(() => { scrim.classList.add('in'); show(start); });
  return close;
}
