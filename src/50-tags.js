// 标签：词库（带四种语言译名）来自 LoveIwara 仓库的公开数据，按当前语言瘦身后缓存在本地。
const TAG_LANGS = ['en', 'zh-CN', 'zh-TW', 'ja']; // 词库里每个标签都有这四种名字；en 是站点原名，其余是 AI 翻译
// 标签词库项目的主页：提示里「有疑问 / 想参与」点进去的地方。以后词库和这个脚本拆成独立项目，改这里和上面的 TAG_DICT_URL
const TAG_PROJECT_URL = 'https://github.com/FoxSensei001/LoveIwara/tree/master/tool/data/iwara_tags';
const TAG_DICT_URL = 'https://cdn.jsdelivr.net/gh/FoxSensei001/LoveIwara@master/tool/data/iwara_tags/iwara_tags.min.json';

const tagDict = (() => {
  const map = new Map(); // id → [译名, 类型, 是否敏感]
  let loading = null;

  function fill(tags) { map.clear(); for (const id in tags) map.set(id, tags[id]); }
  async function refresh() {
    const r = await fetch(TAG_DICT_URL);
    const j = await r.json();
    const slim = {};
    for (const id in j.tags) {
      const e = j.tags[id], n = e.n || {};
      const name = n[env.tagLang] || n.en || '';
      // 别的语言的译名也留着（只用来搜）：用哪种语言都能搜到
      const alts = [...new Set(TAG_LANGS.map((l) => n[l]).filter((x) => x && x !== name).map((x) => x.toLowerCase()))].join('\n');
      slim[id] = [name, e.y, e.s ? 1 : 0, alts];
    }
    fill(slim);
    store.set('dict', { v: 2, rev: j.rev, lang: env.tagLang, at: Date.now(), tags: slim });
  }
  function load() {
    if (loading) return loading;
    const cached = store.get('dict');
    if (cached && cached.v === 2 && cached.lang === env.tagLang) {
      fill(cached.tags);
      if (Date.now() - cached.at > 3 * 86400e3) refresh().catch(() => {});
      return (loading = Promise.resolve());
    }
    return (loading = refresh().catch(() => {}));
  }
  const pretty = (id) => id.replace(/_/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  return {
    load,
    get size() { return map.size; },
    name(id) { const e = map.get(id); return (e && e[0]) || pretty(id); },
    /** 还原成接口要的标签对象（必须带 type，否则服务端 500）。 */
    tag(id) { const e = map.get(id); return e ? { id, type: e[1], sensitive: !!e[2] } : null; },
    ofType(type) { const out = []; for (const [id, e] of map) if (e[1] === type && !e[2]) out.push(id); return out.sort((a, b) => tagDict.name(a).localeCompare(tagDict.name(b), env.tagLang)); },
    /** 译名 / 原始 id 都能搜。排序：完全相等 > id 前缀 > 译名前缀 > 译名包含 > id 包含。 */
    search(query, limit = 40) {
      const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!q) return [];
      const qi = q.replace(/ /g, '_');
      const hit = [];
      for (const [id, e] of map) {
        const name = e[0].toLowerCase(), alts = e[3] ? e[3].split('\n') : [];
        const score = id === qi || name === q || alts.includes(q) ? 0 : id.startsWith(qi) ? 1 : name.startsWith(q) || alts.some((a) => a.startsWith(q)) ? 2
          : name.includes(q) || alts.some((a) => a.includes(q)) ? 3 : id.includes(qi) ? 4 : -1;
        if (score >= 0) hit.push([score, id]);
      }
      hit.sort((a, b) => a[0] - b[0] || a[1].length - b[1].length || (a[1] < b[1] ? -1 : 1));
      return hit.slice(0, limit).map((x) => x[1]);
    },
  };
})();

// ── 用过的标签：选中过的就记下来（不含类别，敏感标签也记），下次发布直接点；可以从这里移除 ──
const tagMemory = {
  used: () => store.get('tagUsed', []),
  /** 记一个标签，返回是否是新记下的。新的排在最前，老的不挪位置（免得点一下整排跳动）。 */
  remember(tg) {
    if (!tg || tg.type === 'category') return false;
    const list = tagMemory.used();
    if (list.some((x) => x.id === tg.id)) return false;
    list.unshift({ id: tg.id, type: tg.type, sensitive: !!tg.sensitive });
    store.set('tagUsed', list.slice(0, 80));
    return true;
  },
  forget(id) { store.set('tagUsed', tagMemory.used().filter((x) => x.id !== id)); },
  restore(list) { store.set('tagUsed', list); },
  /** 发布成功时调用：记下这一次的整组标签（「上次用过」一键加回）。 */
  bump(tags) {
    store.set('lastTags', tags);
    for (const tg of tags) tagMemory.remember(tg);
  },
  last: () => store.get('lastTags', []),
};

STYLE.push(`
.tray{position:relative;display:flex;flex-wrap:wrap;gap:8px;min-height:62px;padding:14px;align-items:center;border-radius:12px;border:1px solid var(--line);background:var(--card);transition:border-color .2s}
.tray.need{border-style:dashed;border-color:var(--line2)}
.tray .ghost{height:30px;border-radius:999px;border:1px dashed var(--line2);opacity:.7}
.tray .count{margin-left:auto;font-size:12px;color:var(--fg3)}
.tg{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 4px 0 12px;border-radius:999px;background:var(--fg);color:var(--inv);font-size:13px;font-weight:500;animation:pop .4s var(--spring)}
.tg.cat{background:none;color:var(--fg);box-shadow:inset 0 0 0 1.5px var(--fg);padding-left:10px}
.tg.sens{background:var(--amber);color:#fff}
.tg button{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:50%;background:none;color:inherit;opacity:.6;cursor:pointer}
.tg button:hover{opacity:1;background:color-mix(in srgb,currentColor 18%,transparent)}
.tg.out{position:absolute;margin:0;pointer-events:none;transition:transform .2s,opacity .2s;transform:scale(.7);opacity:0}
.tsec{margin-top:22px}
.tsec>.label{display:flex;align-items:center;gap:8px;margin-bottom:10px;min-height:30px}
.tsec>.label .dot{width:6px;height:6px;border-radius:50%;background:var(--red);animation:pulse 1.4s infinite}
@keyframes pulse{50%{opacity:.25;transform:scale(.7)}}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.uchip{position:relative;display:inline-flex;animation:pop .4s var(--spring)}
.uchip .rm{position:absolute;top:-6px;right:-6px;width:18px;height:18px;padding:0;border-radius:50%;border:1px solid var(--line2);background:var(--card);color:var(--fg2);display:grid;place-items:center;cursor:pointer;
  opacity:0;transform:scale(.5);transition:opacity .15s,transform .25s var(--spring),color .15s}
.uchip:hover .rm,.uchip .rm:focus-visible{opacity:1;transform:none}
.uchip .rm:hover{color:var(--red);border-color:var(--red)}
@media (hover:none){.uchip .rm{opacity:1;transform:none}}
.chip.sens.on{background:var(--amber);border-color:var(--amber);color:#fff}
.uchip.out{position:absolute;pointer-events:none;transition:transform .2s,opacity .2s;transform:scale(.7);opacity:0}
.tfield{position:relative}
.tfield{position:relative;overflow:hidden}
.tfield::after{content:"";position:absolute;left:0;bottom:0;width:35%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--blue),transparent);opacity:0;transform:translateX(-100%);transition:opacity .2s}
.tfield.busy::after{opacity:1;animation:tsweep 1.1s cubic-bezier(.45,.05,.25,1) infinite}
@keyframes tsweep{from{transform:translateX(-100%)}to{transform:translateX(300%)}}
.tmenu{max-height:min(360px,50vh);overflow:auto;overscroll-behavior:contain;margin:-5px;padding:5px}
.res{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 10px;border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;font-size:13.5px}
.res.cur{background:var(--sunk)}
.res b{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.res small{color:var(--fg3);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.res .kind{margin-left:auto;flex:none;font-size:11px;color:var(--fg3);border:1px solid var(--line);border-radius:5px;padding:1px 6px}
.res .tick{color:var(--green)}
.res .st{display:grid;place-items:center;width:16px;height:16px;flex:none}
.res .ic{flex:none}
.res.none{justify-content:center;gap:8px;color:var(--fg3);cursor:default}
.tmenu hr{border:0;border-top:1px solid var(--line);margin:5px -5px}
.tmenu .head{display:flex;align-items:center;gap:8px;padding:6px 10px 4px;font-size:11px;font-weight:600;color:var(--fg3);letter-spacing:.04em}
`);

/** 先记下 container 里各子元素的位置，执行 mutate 改 DOM，再让留下来的元素从旧位置滑到新位置（不瞬移）。 */
function flip(container, mutate) {
  const before = new Map([...container.children].filter((e) => !e.classList.contains('out')).map((e) => [e, e.getBoundingClientRect()]));
  mutate();
  if (reducedMotion()) return;
  for (const [e, r] of before) {
    if (!e.isConnected || e.classList.contains('out')) continue;
    const n = e.getBoundingClientRect();
    const dx = r.left - n.left, dy = r.top - n.top;
    if (dx || dy) e.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}

const TAG_KIND = { character: 'characters', source: 'series', general: 'general', category: 'category' };

/** 标签这一步。tags 是标签对象数组（原地修改），onChange 在每次变化后调用。 */
/** required：类别是否必选（视频、图库都必选，而且只能选一个，多选会被服务端拒绝）。 */
function tagPicker(tags, onChange, { required = true, kind = 'video' } = {}) {
  const has = (id) => tags.some((x) => x.id === id);
  const category = () => tags.find((x) => x.type === 'category');
  const listeners = [];
  const sync = () => { flip(tray, drawTray); listeners.forEach((fn) => fn()); onChange(); };
  function toggle(tg) {
    const i = tags.findIndex((x) => x.id === tg.id);
    if (i >= 0) tags.splice(i, 1);
    else {
      if (tg.type === 'category') { const c = tags.findIndex((x) => x.type === 'category'); if (c >= 0) tags.splice(c, 1); tags.unshift(tg); } else tags.push(tg);
      if (tagMemory.remember(tg)) drawUsed(tg.id);
    }
    sync();
  }

  // 已选
  const tray = h('div.tray');
  const countEl = h('span.count.mono');
  const tagClr = clearBtn(t('keepTags'), { read: () => tags.slice(), write: (v) => { tags.splice(0, tags.length, ...v); sync(); } });
  function drawTray() {
    const cat = category();
    tray.classList.toggle('need', required && !cat);
    const want = tags.map((x) => x.id);
    // 要走的标签：钉在原地（绝对定位）淡出，让出位置给后面的标签滑过来
    for (const el of [...tray.querySelectorAll('.tg:not(.out)')]) if (!want.includes(el.dataset.id)) {
      const left = el.offsetLeft, top = el.offsetTop;
      el.style.left = left + 'px'; el.style.top = top + 'px';
      el.classList.add('out');
      setTimeout(() => el.remove(), 200);
    }
    tray.querySelectorAll('.ghost').forEach((e) => e.remove());
    for (const tg of tags) {
      if (tray.querySelector(`.tg:not(.out)[data-id="${CSS.escape(tg.id)}"]`)) continue;
      const el = h('span.tg' + (tg.type === 'category' ? '.cat' : tg.sensitive ? '.sens' : ''), { data: { id: tg.id, tip: tg.id } }, tg.type === 'category' && icon('layers', 14), tagDict.name(tg.id), h('button', { type: 'button', onclick: () => toggle(tg) }, icon('x', 12)));
      tg.type === 'category' ? tray.prepend(el) : tray.append(el);
    }
    tagClr.show(tags.length > 0);
    if (!tags.length) setTimeout(() => { if (!tags.length) tagClr.el.remove(); }, 200); // 淡出后再拿掉，不占位置
    if (!tags.length) { countEl.remove(); tray.append(h('span.ghost', { style: { width: '92px' } }), h('span.ghost', { style: { width: '64px' } }), h('span.ghost', { style: { width: '78px' } })); }
    else { countEl.textContent = String(tags.length); tray.append(countEl, tagClr.el); } // 同一个计数节点挪到末尾，不重建
  }

  function section(label, body, extra) {
    return h('div.tsec', h('div.label', label, extra), body);
  }

  // 类别（必选一个）
  const catChips = svc.config.categories.map((c) => {
    const tg = { id: c.id, type: 'category', sensitive: false };
    return [tg, h('button.chip', { type: 'button', data: { tip: tg.id }, onclick: () => toggle(tg) }, tagDict.name(tg.id))];
  });
  const needDot = h('span.dot');
  listeners.push(() => { needDot.style.display = !required || category() ? 'none' : ''; catChips.forEach(([tg, c]) => c.classList.toggle('on', has(tg.id))); });
  // 站点的类别说明不再常驻在下面占地方：标题旁一个 ⓘ，悬停 / 聚焦时显示
  const catInfo = siteRules.text('form.categoriesDescription') && infoTip(siteRules.text('form.categoriesDescription'));
  const cats = section(t('category'), h('div', h('div.chips', catChips.map((x) => x[1]))), [catInfo, needDot]);

  // ── 搜索：结果在输入框下方的浮层菜单里，不挤占页面；本地词库立刻出，站点接口的结果带加载态追加 ──
  const input = h('input', { placeholder: t('searchTags'), spellcheck: false, autocomplete: 'off', role: 'combobox', 'aria-expanded': 'false' });
  const search = h('div.field.tfield', { style: { height: '44px' } }, icon('search'), input);
  // 词库是 AI 翻译的：标题旁一个 ⓘ 讲清楚只有英文是站点原名
  const searchSec = section(t(kind === 'image' ? 'imageTags' : 'videoTags'), search, [infoTip(t('tagSourceTip'), { label: t('tagProject'), href: TAG_PROJECT_URL })]);
  const listbox = h('div.tmenu', { role: 'listbox' });
  let pop = null, cur = 0, local = [], remoteHits = [], loading = false, seq = 0;
  const results = () => local.concat(remoteHits.filter((r) => !local.some((l) => l.id === r.id)));

  function closeMenu() { if (pop) { const p = pop; pop = null; p.close(); } input.setAttribute('aria-expanded', 'false'); }
  const rowIcon = (tg) => (has(tg.id) ? h('span.tick', icon('check')) : icon(tg.sensitive ? 'warn' : 'plus'));
  /** 选中 / 取消后只换每行前面的图标，菜单本身不重建（不闪）。 */
  function markPicked() {
    for (const st of listbox.querySelectorAll('.st')) {
      const on = has(st.dataset.id);
      if (st.dataset.on === String(on)) continue;
      st.dataset.on = String(on);
      const tg = results().find((x) => x.id === st.dataset.id);
      if (!tg) continue;
      st.replaceChildren(rowIcon(tg));
      if (on && !reducedMotion()) st.firstChild.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
  }
  function mark() { [...listbox.querySelectorAll('.res[data-i]')].forEach((el) => el.classList.toggle('cur', +el.dataset.i === cur)); }
  function row(tg, i) {
    return h('button.res' + (i === cur ? '.cur' : ''), { type: 'button', role: 'option', data: { i },
      onpointerdown: (e) => e.preventDefault(), // 点菜单项不让输入框失焦
      onpointermove: () => { if (cur !== i) { cur = i; mark(); } },
      onclick: () => { toggle(tg); markPicked(); } },
    h('span.st', { data: { id: tg.id, on: String(has(tg.id)) } }, rowIcon(tg)), h('b', tagDict.name(tg.id)), h('small.mono', tg.id), h('span.kind', t(TAG_KIND[tg.type] || 'general')));
  }
  function drawMenu() {
    if (!input.value.trim()) { closeMenu(); return; }
    const list = results();
    cur = clamp(cur, 0, Math.max(0, list.length - 1));
    const nLocal = local.length;
    const extra = list.slice(nLocal);
    clear(listbox);
    add(listbox, [
      local.map((tg, i) => row(tg, i)),
      // 站点接口的结果单独一组：加载中显示转圈，回来了才出条目
      (loading || extra.length > 0) && nLocal > 0 && h('hr'),
      (loading || extra.length > 0) && nLocal > 0 && h('div.head', t(loading ? 'searchingSite' : 'fromSite')),
      extra.map((tg, j) => row(tg, nLocal + j)),
      // 站点结果还在路上：先摆几行条目的骨架
      loading && !extra.length && h('div', { 'aria-label': t('searching') }, (nLocal ? [120, 90] : [140, 100, 120]).map((w) => h('div.skrow', skel(16, 16, true), skel(w, 10), h('span', { style: { flex: 1 } }), skel(34, 16)))),
      !list.length && !loading && h('div.res.none', t('noResult')),
    ]);
    if (!pop) {
      pop = popover(search, listbox, { width: search.offsetWidth, onClose: () => { pop = null; input.setAttribute('aria-expanded', 'false'); } });
      input.setAttribute('aria-expanded', 'true');
    }
    pop.style.width = search.offsetWidth + 'px';
    pop.replace();
  }
  const remote = debounce(async (q, my) => {
    const res = await svc.searchTags(q.replace(/\s+/g, '_'));
    if (my !== seq) return; // 期间又输入了：这次的结果作废
    remoteHits = res.map((x) => tagDict.tag(x.id) || { id: x.id, type: x.type, sensitive: !!x.sensitive });
    loading = false;
    search.classList.remove('busy');
    drawMenu();
  }, 250);
  input.addEventListener('input', () => {
    const q = input.value.trim();
    const my = ++seq;
    local = q ? tagDict.search(q).map((id) => tagDict.tag(id)) : [];
    remoteHits = [];
    cur = 0;
    loading = !!q;
    search.classList.toggle('busy', loading);
    if (q) remote(q, my);
    drawMenu();
  });
  input.addEventListener('focus', () => { if (input.value.trim()) drawMenu(); });
  input.addEventListener('keydown', (e) => {
    const list = results();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!pop) { drawMenu(); return; }
      cur = clamp(cur + (e.key === 'ArrowDown' ? 1 : -1), 0, list.length - 1);
      mark();
      const el = listbox.querySelector(`.res[data-i="${cur}"]`);
      el && el.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && pop && list[cur]) { e.preventDefault(); toggle(list[cur]); input.select(); markPicked(); }
    else if (e.key === 'Backspace' && !input.value && tags.length) { const last = tags[tags.length - 1]; if (last.type !== 'category') toggle(last); }
  });
  // 浮层是 fixed 定位：页面滚动时跟着输入框走
  const follow = () => pop && pop.replace();
  addEventListener('scroll', follow, true);

  // ── 用过的标签（没用过就整块不显示）──
  const usedBox = h('div');
  let usedChips = [];
  listeners.push(() => usedChips.forEach(([tg, c]) => c.classList.toggle('on', has(tg.id))));
  function forget(tg, wrap) {
    const before = tagMemory.used();
    tagMemory.forget(tg.id);
    usedChips = usedChips.filter(([x]) => x.id !== tg.id);
    const box = wrap.parentNode;
    if (usedChips.length) flip(box, () => { wrap.style.left = wrap.offsetLeft + 'px'; wrap.style.top = wrap.offsetTop + 'px'; wrap.classList.add('out'); });
    else wrap.classList.add('out');
    setTimeout(() => { wrap.remove(); if (!usedChips.length) clear(usedBox); }, 200);
    toast(t('tagForgotten', { n: tagDict.name(tg.id) }), { action: t('undo'), onAction: () => { tagMemory.restore(before); drawUsed(); } });
  }
  function usedChip(tg, fresh) {
    const c = h('button.chip' + (tg.sensitive ? '.sens' : ''), { type: 'button', data: { tip: tg.id }, onclick: () => toggle(tg) }, tagDict.name(tg.id));
    const wrap = h('span.uchip', { style: fresh ? null : { animation: 'none' } }, c,
      h('button.rm', { type: 'button', 'aria-label': t('remove'), data: { tip: t('forgetTag') }, onclick: () => forget(tg, wrap) }, icon('x', 10)));
    usedChips.push([tg, c]);
    return wrap;
  }
  /** freshId：刚记下的那个——已有整块时只把它插到最前面，其余标签滑开，不整块重建。 */
  function drawUsed(freshId) {
    const box = usedBox.querySelector('.chips');
    if (freshId && box) {
      const tg = tagDict.tag(freshId) || tagMemory.used().find((x) => x.id === freshId);
      if (tg) { flip(box, () => box.prepend(usedChip(tg, true))); listeners.forEach((fn) => fn()); return; }
    }
    const list = tagMemory.used().map((x) => tagDict.tag(x.id) || x).filter((x) => x.type !== 'category');
    usedChips = [];
    clear(usedBox);
    if (!list.length) return;
    const chips = h('div.chips', { style: { position: 'relative' } }, list.map((tg) => usedChip(tg, tg.id === freshId)));
    const last = tagMemory.last().filter((x) => x.type !== 'category');
    const addLast = last.length > 1 && h('button.btn.sm.ghost', { type: 'button', style: { marginLeft: 'auto' }, onclick: () => { for (const tg of tagMemory.last()) if (!has(tg.id)) { if (tg.type === 'category' && category()) continue; tags.push(tg); } sync(); } }, icon('clock', 14), `${t('lastUsed')} · ${last.length}`);
    const sec = section(t('usedTags'), chips, addLast);
    if (freshId && !reducedMotion()) sec.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    usedBox.append(sec);
    listeners.forEach((fn) => fn());
  }

  tagDict.load().then(() => { drawTray(); drawUsed(); });
  drawTray();
  drawUsed();
  listeners.forEach((fn) => fn());
  return {
    el: h('div', tray, cats, searchSec, siteRules.tagRule() && h('div.note', { style: { marginTop: '8px' } }, icon('tag', 14), h('a', { href: siteRules.tagRule(), target: '_blank', rel: 'noopener', style: { color: 'inherit', textUnderlineOffset: '3px' } }, siteRules.text('form.tagsDescription') || t('tagStandard'))), usedBox),
    refresh: () => { drawTray(); listeners.forEach((fn) => fn()); },
    focus: () => input.focus(),
    dispose: () => { closeMenu(); removeEventListener('scroll', follow, true); },
  };
}
