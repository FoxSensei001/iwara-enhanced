// 模板：标题格式（可带 {填空}，{#} 是自动递增的期数）+ 简介 + 标签 + 分级与可见范围。
// 任何一步都能套用；发布前后都能把当前这份存成模板。

// 内置示例模板的文案（defineStrings 是 88-site.js 里的函数声明，会提升，这里加载时就能用）
defineStrings({
  tplMmdName: 'MMD 舞蹈', tplMmdTitle: '【MMD】{角色} - {曲名}',
  tplMmdBody: '## Credits\n\n- **Model**：{模型}\n- **Motion**：{动作}\n- **Music**：{曲名}\n- **Stage**：{场景}',
  tplSeriesName: '系列连载', tplSeriesTitle: '{系列名} #{#} {本期标题}', tplSeriesBody: '上一期：{上一期链接}',
  tplHmvTitle: '{标题} [HMV]', tplHmvBody: '**Music**：{曲名}\n\n**Source**：{素材来源}',
  tplModName: '游戏 MOD', tplModTitle: '【{作品}】{曲名}（{角色}）',
}, {
  tplMmdName: 'MMD dance', tplMmdTitle: '[MMD] {Character} - {Song}',
  tplMmdBody: '## Credits\n\n- **Model**: {Model}\n- **Motion**: {Motion}\n- **Music**: {Song}\n- **Stage**: {Stage}',
  tplSeriesName: 'Series', tplSeriesTitle: '{Series} #{#} {Episode title}', tplSeriesBody: 'Previous: {Previous link}',
  tplHmvTitle: '{Title} [HMV]', tplHmvBody: '**Music**: {Song}\n\n**Source**: {Source}',
  tplModName: 'Game mod', tplModTitle: '[{Game}] {Song} ({Characters})',
}, {
  tplMmdName: 'MMDダンス', tplMmdTitle: '【MMD】{キャラ} - {曲名}',
  tplMmdBody: '## Credits\n\n- **Model**：{モデル}\n- **Motion**：{モーション}\n- **Music**：{曲名}\n- **Stage**：{ステージ}',
  tplSeriesName: 'シリーズ', tplSeriesTitle: '{シリーズ名} #{#} {今回のタイトル}', tplSeriesBody: '前回：{前回のリンク}',
  tplHmvTitle: '{タイトル} [HMV]', tplHmvBody: '**Music**：{曲名}\n\n**Source**：{素材の出典}',
  tplModName: 'ゲームMOD', tplModTitle: '【{作品}】{曲名}（{キャラ}）',
});

const templates = {
  all: () => store.get('templates', []),
  save(list) { store.set('templates', list); },
  upsert(tpl) {
    const list = templates.all();
    const i = list.findIndex((x) => x.id === tpl.id);
    tpl.updatedAt = Date.now();
    i >= 0 ? (list[i] = tpl) : list.unshift(tpl);
    templates.save(list);
  },
  remove(id) { templates.save(templates.all().filter((x) => x.id !== id)); },
  bump(id) {
    const list = templates.all();
    const tpl = list.find((x) => x.id === id);
    if (!tpl) return;
    tpl.uses = (tpl.uses || 0) + 1;
    if (/\{#\}/.test(tpl.title || '') || /\{#\}/.test(tpl.body || '')) tpl.counter = (tpl.counter || 0) + 1;
    templates.save(list);
  },
  /** 内置示例：从常见的投稿规律里归纳出来的四种写法。 */
  samples() {
    const tg = (...ids) => ids.map((id) => tagDict.tag(id) || (svc.config.categories.find((c) => c.id === id) && { id, type: 'category', sensitive: false })).filter(Boolean);
    return [
      { id: 's-mmd', sample: true, name: t('tplMmdName'), title: t('tplMmdTitle'), rating: 'ecchi', body: t('tplMmdBody'), tags: tg('mikumikudance', 'dance') },
      { id: 's-series', sample: true, name: t('tplSeriesName'), title: t('tplSeriesTitle'), counter: 0, body: t('tplSeriesBody'), tags: [] },
      { id: 's-hmv', sample: true, name: 'HMV / PMV', title: t('tplHmvTitle'), rating: 'ecchi', body: t('tplHmvBody'), tags: tg('hmv') },
      { id: 's-mod', sample: true, name: t('tplModName'), title: t('tplModTitle'), rating: 'ecchi', body: '', tags: tg('uncategorized', 'game_mod') },
    ];
  },
  last: (kind) => store.get('last:' + kind),
  /** 套用到草稿上。返回撤销函数。 */
  apply(draft, tpl) {
    const snap = JSON.stringify({ title: draft.title, body: draft.body, tags: draft.tags, rating: draft.rating, private: draft.private, unlisted: draft.unlisted, tplId: draft.tplId, tplTitle: draft.tplTitle || null, tplBody: draft.tplBody || null });
    const n = String((tpl.counter || 0) + 1);
    const fill = (s) => String(s || '').replace(/\{#\}/g, n);
    if (tpl.title != null) { draft.title = fill(tpl.title); draft.tplTitle = tpl.title; }
    if (tpl.body != null) { draft.body = fill(tpl.body); draft.tplBody = tpl.body; }
    if (tpl.tags) draft.tags.splice(0, draft.tags.length, ...tpl.tags.map((x) => ({ ...x })));
    if (tpl.rating) draft.rating = tpl.rating;
    if (draft.kind === 'video' && tpl.private != null) { draft.private = !!tpl.private; draft.unlisted = !!tpl.unlisted; }
    draft.tplId = tpl.sample || tpl.auto ? null : tpl.id;
    return () => { const prev = JSON.parse(snap); const tags = prev.tags; delete prev.tags; Object.assign(draft, prev); draft.tags.splice(0, draft.tags.length, ...tags); };
  },
  export() {
    const blob = new Blob([JSON.stringify({ app: 'iwara-enhanced', version: 1, templates: templates.all() }, null, 2)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'iwara-templates.json' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  import(onDone) {
    const input = h('input', { type: 'file', accept: 'application/json,.json', onchange: async () => {
      try {
        const j = JSON.parse(await input.files[0].text());
        const incoming = (j.templates || []).filter((x) => x && typeof x.name === 'string');
        const list = templates.all();
        for (const tpl of incoming) if (!list.some((x) => x.id === tpl.id)) list.push({ id: tpl.id || uid(), name: tpl.name.slice(0, 60), title: tpl.title, body: tpl.body, rating: tpl.rating, private: tpl.private, unlisted: tpl.unlisted, counter: tpl.counter | 0,
          tags: (tpl.tags || []).filter((x) => x && /^[a-z0-9_()\-.'!:+]+$/i.test(x.id)).map((x) => ({ id: x.id, type: String(x.type), sensitive: !!x.sensitive })) });
        templates.save(list);
        onDone(incoming.length);
      } catch { toast(t('failed'), { error: true }); }
    } });
    input.click();
  },
};

STYLE.push(`
.tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.tpl{position:relative;display:flex;flex-direction:column;gap:8px;min-height:104px;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);cursor:pointer;text-align:left;overflow:hidden;
  transition:border-color .15s,transform .35s var(--ease),box-shadow .2s}
.tpl:hover{border-color:var(--fg3);transform:translateY(-2px);box-shadow:var(--shadow)}
.tpl:active{transform:scale(.98)}
.tpl .name{display:flex;align-items:center;gap:6px;font-weight:600;font-size:13.5px}
.tpl .name .ic{color:var(--fg3)}
.tpl .pat{font-size:12.5px;color:var(--fg2);line-height:1.9;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.tpl .pat .slot{font-size:11.5px;padding:0 5px;cursor:inherit}
.tpl .mini{display:flex;gap:4px;margin-top:auto;overflow:hidden;white-space:nowrap}
.tpl .mini span{font-size:11px;color:var(--fg2);background:var(--sunk);border-radius:5px;padding:1px 6px}
.tpl .ibtn{position:absolute;top:6px;right:6px;opacity:0;width:26px;height:26px}
.tpl:hover .ibtn{opacity:1}
.tpl.blank{align-items:center;justify-content:center;border-style:dashed;color:var(--fg2);font-weight:500}
.tplgroup{margin:18px 0 8px;font-size:11px;font-weight:600;color:var(--fg3);letter-spacing:.05em;text-transform:uppercase}
.tplgroup:first-child{margin-top:0}
.keep{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:12px;border:1px solid var(--line);margin-top:10px;transition:opacity .2s,border-color .2s}
.keep.off{opacity:.45}
.keep.off .kbody{pointer-events:none}
.keep .kbody{flex:1;min-width:0}
.keep .label{margin-bottom:6px}
.keep textarea,.keep input.pat{width:100%;border:1px solid var(--line2);border-radius:8px;background:var(--card);padding:8px 10px;outline:0;resize:vertical;font-size:13.5px}
.keep textarea:focus,.keep input.pat:focus{border-color:var(--fg)}
.sw{position:relative;width:34px;height:20px;border-radius:999px;border:0;background:var(--line2);cursor:pointer;flex:none;transition:background .2s;margin-top:1px}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .4s var(--spring)}
.sw[aria-checked=true]{background:var(--fg)}
.app[data-theme=dark] .sw[aria-checked=true]::after{background:#0a0a0a}
.sw[aria-checked=true]::after{transform:translateX(14px)}
.slotbar{display:flex;gap:6px;align-items:center;margin-top:8px;min-height:30px}
`);

function patternNode(text) {
  const span = h('span');
  let last = 0;
  for (const m of String(text || '').matchAll(/\{([^{}\n]{1,24})\}/g)) {
    span.append(text.slice(last, m.index), h('span.slot', m[1] === '#' ? t('episode') : m[1]));
    last = m.index + m[0].length;
  }
  span.append(String(text || '').slice(last));
  return span;
}
function templateCard(tpl, onPick, onMenu) {
  return h('button.tpl', { type: 'button', onclick: (e) => { if (!e.target.closest('.ibtn')) onPick(tpl); } },
    h('div.name', icon(tpl.auto ? 'clock' : tpl.sample ? 'sparkle' : 'bookmark', 14), tpl.name),
    h('div.pat', tpl.title || tpl.body ? patternNode(tpl.title || (tpl.body || '').split('\n')[0]) : [tpl.rating && t(tpl.rating === 'general' ? 'ratingGeneral' : 'ratingEcchi'), tpl.private ? ' · ' + t('vPrivate') : tpl.unlisted ? ' · ' + t('vUnlisted') : '']),
    h('div.mini', (tpl.tags || []).slice(0, 4).map((x) => h('span', tagDict.name(x.id))), (tpl.tags || []).length > 4 && h('span', '+' + ((tpl.tags || []).length - 4))),
    onMenu && h('span.ibtn', { onclick: (e) => onMenu(tpl, e.currentTarget) }, icon('more')));
}

/** 模板库（弹层）。onPick(tpl) 套用。 */
function templateGallery(kind, onPick) {
  const close = sheet((done) => {
    // 搜索：按名称、标题格式、简介、标签（译名和 id）过滤，多个词都要命中
    const q = h('input', { placeholder: t('searchTpl'), spellcheck: false, oninput: () => draw(true) });
    const body = h('div');
    const wrap = h('div', h('div.field', { style: { marginBottom: '16px' } }, icon('search'), q), body);
    const hit = (tpl) => {
      const terms = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return true;
      const hay = [tpl.name, tpl.title, tpl.body, ...(tpl.tags || []).map((x) => tagDict.name(x.id) + ' ' + x.id)].join(' ').toLowerCase();
      return terms.every((w) => hay.includes(w));
    };
    let lockedHeight = false;
    const draw = (filtering) => {
      clear(body);
      const mine = templates.all().filter(hit);
      const lastRaw = templates.last(kind);
      const last = lastRaw && hit({ ...lastRaw, name: t('lastPublish') }) ? lastRaw : null;
      const samples = templates.samples().filter(hit);
      const grid = (cls) => h('div.tpls' + (filtering ? '' : '.stagger') + (cls || ''));
      const pick = (tpl) => { done(); onPick(tpl); };
      const onMenu = (tpl, anchor) => menu(anchor, [
        { icon: 'pencil', label: t('edit'), onclick: () => { done(); saveTemplateSheet({ kind, title: tpl.title || '', body: tpl.body || '', tags: tpl.tags || [], rating: tpl.rating, private: tpl.private, unlisted: tpl.unlisted, tplId: tpl.id }, { editing: tpl }); } },
        { icon: 'trash', label: t('delete'), danger: true, onclick: () => { templates.remove(tpl.id); draw(); toast(t('deleted'), { action: t('undo'), onAction: () => { templates.upsert(tpl); } }); } },
      ]);
      if (mine.length || last) body.append(h('div.tplgroup', t('myTemplates')), add(grid(), [last && templateCard({ ...last, auto: true, name: t('lastPublish') }, pick), mine.map((tpl) => templateCard(tpl, pick, onMenu))]));
      if (samples.length) body.append(h('div.tplgroup', t('samples')), add(grid(), samples.map((tpl) => templateCard(tpl, pick))));
      if (!body.childNodes.length) body.append(h('div', { style: { padding: '40px 0', textAlign: 'center', color: 'var(--fg3)' } }, t('noResult')));
      // 过滤时弹层高度不跟着结果跳：按第一次的高度撑住
      if (!lockedHeight) requestAnimationFrame(() => { body.style.minHeight = body.offsetHeight + 'px'; lockedHeight = true; });
    };
    // 词库回来之前先摆几张卡片的骨架
    body.append(h('div.skel', { style: { width: '72px', height: '12px', margin: '4px 0 12px' } }), h('div.tpls', [0, 1, 2].map(() => h('div.tpl', { style: { pointerEvents: 'none' } }, skel(90, 14), skel('80%', 12), h('div.row', { style: { gap: '6px' } }, skel(48, 18, 6), skel(36, 18, 6))))));
    tagDict.load().then(() => { draw(false); setTimeout(() => q.focus(), 60); });
    const moreBtn = ibtn('more', '', () => menu(moreBtn, [
      { icon: 'download', label: t('exportTpl'), onclick: templates.export },
      { icon: 'upload', label: t('importTpl'), onclick: () => templates.import((n) => { draw(); toast('+' + n); }) },
    ]));
    return { title: h('span.row', t('templates'), moreBtn), body: wrap };
  }, { width: 720 });
  return close;
}

/** 存为模板。draft 提供当前内容；editing 传入时是修改已有模板。 */
function saveTemplateSheet(draft, { editing, onSaved } = {}) {
  const existing = editing || templates.all().find((x) => x.id === draft.tplId);
  // 套过模板且标题没被改掉填空之外的结构时，优先沿用原来的格式
  // 这份草稿是套模板填出来的：默认沿用原来带填空的格式，而不是这一期填好的具体内容
  const hasSlot = (x) => /\{[^{}\n]{1,24}\}/.test(x || '');
  let titlePattern = editing ? editing.title || '' : hasSlot(draft.tplTitle) ? draft.tplTitle : draft.title || '';
  const bodyPattern = !editing && hasSlot(draft.tplBody) ? draft.tplBody : draft.body || '';
  let counter = existing ? existing.counter | 0 : 0;
  const keep = { title: true, body: !!(draft.body || '').trim(), tags: draft.tags.length > 0, settings: true };

  // 选中的字正好是某个已选标签的译名时，填空名猜成它的类型（角色 / 作品…）
  const guess = (picked) => { const m = draft.tags.find((x) => tagDict.name(x.id) === picked.trim()); return m ? t(TAG_KIND[m.type] || 'general') : ''; };
  let bodyEd = null;
  sheet((done) => {
    const name = h('input', { value: existing ? existing.name : '', placeholder: t('templateName'), maxLength: 40 });
    const titleIn = h('input.pat', { value: titlePattern, spellcheck: false });
    bodyEd = mdEditor({ value: bodyPattern, slotMaker: { guess }, help: true });
    const preview = h('div.pat', { style: { marginTop: '8px', fontSize: '13px', lineHeight: '1.9' } });
    // 标题：选中一段字就在选区上方浮出「设为填空」
    let maker = null, makerKey = '';
    const updateMaker = () => {
      if (maker && maker.asking) return;
      const s = titleIn.selectionStart, e = titleIn.selectionEnd, picked = titleIn.value.slice(s, e);
      const ok = ui.root.activeElement === titleIn && e > s && okSlotText(picked);
      const key = ok ? s + ':' + e : '';
      if (key === makerKey) return;
      makerKey = key;
      if (maker) { const p = maker; maker = null; p.close(); }
      if (!ok) return;
      const a = inputCaretRect(titleIn, s), b = inputCaretRect(titleIn, e);
      const pop = slotMakerPop({ getBoundingClientRect: () => ({ ...a, right: b.right, width: b.right - a.left }) }, picked, guess(picked), (nm) => { titleIn.focus(); titleIn.setRangeText(`{${nm}}`, s, e, 'end'); refresh(); }, () => { if (maker === pop) { maker = null; makerKey = ''; } });
      maker = pop;
    };
    for (const evt of ['select', 'keyup', 'mouseup']) titleIn.addEventListener(evt, updateMaker);
    titleIn.addEventListener('blur', () => setTimeout(() => { if (maker && !maker.asking) updateMaker(); }, 0));
    titleIn.addEventListener('keydown', (e) => { if (e.key === 'Enter' && maker && !maker.asking) { e.preventDefault(); maker.ask(); } });
    const epBtn = btn(t('episode') + ' +1', { sm: true, icon: 'plus', onclick: () => {
      const m = titleIn.value.match(/(\d+)(?!.*\d)/);
      if (!m) return;
      counter = parseInt(m[1], 10);
      titleIn.setRangeText('{#}', m.index, m.index + m[1].length, 'end');
      refresh();
    } });
    const refresh = () => {
      clear(preview).append(patternNode(titleIn.value));
      epBtn.style.display = /\d/.test(titleIn.value.replace(/\{[^}]*\}/g, '')) && !/\{#\}/.test(titleIn.value) ? '' : 'none';
    };
    titleIn.addEventListener('input', refresh);
    const sw = (key, node) => {
      const b = h('button.sw', { type: 'button', role: 'switch', 'aria-checked': String(keep[key]), onclick: () => { keep[key] = !keep[key]; b.setAttribute('aria-checked', String(keep[key])); row.classList.toggle('off', !keep[key]); } });
      const row = h('div.keep' + (keep[key] ? '' : '.off'), b, h('div.kbody', node));
      return row;
    };
    const vis = draft.private ? 'vPrivate' : draft.unlisted ? 'vUnlisted' : 'vPublic';
    const body = h('div',
      h('div.field', icon('bookmark'), name),
      sw('title', [h('div.label', t('keepTitle')), titleIn, preview, h('div.slotbar', h('span.note', icon('sparkle', 14), h('span', t('slotHowTo'))), h('span.sp', { style: { flex: 1 } }), epBtn)]),
      sw('body', [h('div.label', t('keepBody')), bodyEd.el]),
      sw('tags', [h('div.label', t('keepTags')), h('div.chips', draft.tags.map((x) => h('span.chip', { style: { cursor: 'default', height: '26px', fontSize: '12px' } }, tagDict.name(x.id))))]),
      sw('settings', [h('div.label', t('keepSettings')), h('div.chips', h('span.chip', { style: { cursor: 'default', height: '26px', fontSize: '12px' } }, t(draft.rating === 'general' ? 'ratingGeneral' : 'ratingEcchi')), draft.kind === 'video' && h('span.chip', { style: { cursor: 'default', height: '26px', fontSize: '12px' } }, t(vis)))]));
    refresh();
    setTimeout(() => (name.value ? titleIn : name).focus(), 60);

    const build = (id) => ({
      id, name: name.value.trim() || titleIn.value.replace(/\{[^}]*\}/g, '…').slice(0, 24) || t('templates'), counter,
      title: keep.title ? titleIn.value : null, body: keep.body ? bodyEd.value : null, tags: keep.tags ? draft.tags.map((x) => ({ ...x })) : null,
      rating: keep.settings ? draft.rating : null, private: keep.settings && draft.kind === 'video' ? !!draft.private : null, unlisted: keep.settings && draft.kind === 'video' ? !!draft.unlisted : null,
      uses: existing ? existing.uses | 0 : 0,
    });
    const commit = (id) => { const tpl = build(id); templates.upsert(tpl); draft.tplId = tpl.id; done(); toast(t('tplSaved')); onSaved && onSaved(tpl); };
    return {
      title: t(editing ? 'edit' : 'saveAsTemplate'),
      body,
      footer: [btn(t('cancel'), { kind: 'ghost', onclick: done }), existing && !editing && btn(t('saveAsTemplate'), { onclick: () => commit(uid()) }), btn(existing ? t('update') : t('save'), { kind: 'primary', onclick: () => commit(existing ? existing.id : uid()) })],
    };
  }, { width: 600, onClose: () => bodyEd && bodyEd.destroy() });
}
