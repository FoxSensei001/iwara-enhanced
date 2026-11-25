// 分步发布 / 编辑：上传 → 内容 → 标签 → 发布。步骤之间可以随意跳，缺什么在最后一步的清单里点一下就回去补。

STYLE.push(`
.wrap{max-width:920px;margin:0 auto;padding:28px 24px 0;min-height:calc(100vh - 64px);display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:12px;margin-bottom:26px}
.top h1{margin:0;font-size:22px;font-weight:600;letter-spacing:-.03em}
.top .sp{flex:1}
.pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:500;border:1px solid var(--line);color:var(--fg2)}
.pill.amber{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 45%,transparent);background:color-mix(in srgb,var(--amber) 9%,transparent)}
.pill.violet{color:var(--violet);border-color:color-mix(in srgb,var(--violet) 45%,transparent);background:color-mix(in srgb,var(--violet) 9%,transparent)}
.pill.green{color:var(--green);border-color:color-mix(in srgb,var(--green) 45%,transparent);background:color-mix(in srgb,var(--green) 9%,transparent)}
.steps{display:flex;align-items:center;margin:0 0 28px;padding:0;list-style:none}
.steps li{display:flex;align-items:center;gap:10px;cursor:pointer;color:var(--fg3);font-weight:500;font-size:13.5px;transition:color .25s;user-select:none}
.steps li:hover{color:var(--fg2)}
.steps li.cur{color:var(--fg)}
.steps .n{position:relative;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:600;border:1.5px solid var(--line2);background:var(--bg);transition:all .35s var(--ease)}
.steps li.cur .n{border-color:var(--fg);background:var(--fg);color:var(--inv);transform:scale(1.08)}
.steps li.ok:not(.cur) .n{border-color:var(--fg);color:var(--fg)}
.steps li.ok .n .ic{animation:pop .4s var(--spring)}
.steps .n .mini{position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--blue);animation:spin .9s linear infinite}
.steps .bar{flex:1;height:1.5px;margin:0 14px;background:var(--line2);border-radius:2px;overflow:hidden;min-width:20px}
.steps .bar i{display:block;height:100%;width:100%;background:var(--fg);transform:scaleX(0);transform-origin:left;transition:transform .6s var(--ease)}
.steps .bar.on i{transform:scaleX(1)}
.stage{position:relative;padding-bottom:14px}
.navbar{position:sticky;bottom:0;z-index:5;margin:auto -24px 0;padding:40px 24px 14px;display:flex;align-items:center;gap:10px;isolation:isolate}
.navbar::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);-webkit-mask-image:linear-gradient(to top,#000 0%,#000 38%,transparent 62%);mask-image:linear-gradient(to top,#000 0%,#000 38%,transparent 62%)}
.navbar .sp{flex:1}
.kbd{font:11px "Geist Mono",ui-monospace,Menlo,monospace;padding:1px 5px;border-radius:5px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);opacity:.7}
.titlebox{position:relative;margin-bottom:16px}
.titlebox input,.titlebox .back{font-size:26px;font-weight:600;letter-spacing:-.03em;line-height:1.3;padding:6px 19px;width:100%;border:0;outline:0;background:none;white-space:pre}
.titlebox .back{position:absolute;inset:0;color:transparent;pointer-events:none;overflow:hidden}
.titlebox .back mark{background:color-mix(in srgb,var(--violet) 16%,transparent);color:transparent;border-radius:6px;box-shadow:0 0 0 1px color-mix(in srgb,var(--violet) 45%,transparent)}
.titlebox .back mark.edit{background:color-mix(in srgb,var(--amber) 16%,transparent);box-shadow:0 0 0 1.5px var(--amber);}
.titlebox .back mark.edit.empty{display:inline-block;width:.7em;margin-right:-.7em;vertical-align:-.15em;height:1.1em}
.titlebox input{position:relative;border-bottom:1px solid var(--line);padding-right:96px}
.titlebox .clr{position:absolute;right:11px;top:50%;margin-top:-13px;z-index:1}
.titlebox input:focus{border-color:var(--fg)}
.pub{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:28px;align-items:start}
@media (max-width:820px){.pub{grid-template-columns:minmax(0,1fr)}}
.set{padding:16px 0;border-top:1px solid var(--line)}
.set:first-child{border-top:0;padding-top:0}
.set>.label{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.film{display:flex;gap:6px;overflow-x:auto;padding:3px;margin:-3px;scrollbar-width:thin}
.film button{flex:none;width:112px;aspect-ratio:16/9;border-radius:8px;border:0;padding:0;background:var(--sunk) center/cover;cursor:pointer;opacity:.55;transition:opacity .2s,transform .35s var(--spring),box-shadow .2s}
.film button:hover{opacity:.9}
.film button.on{opacity:1;box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--fg);transform:scale(.94)}
.film .custom{position:relative;overflow:hidden;opacity:1;box-shadow:inset 0 0 0 1.5px var(--line);display:grid;place-items:center;color:var(--mute)}
.film .custom:not(.has){background:transparent;box-shadow:none;outline:1.5px dashed var(--line);outline-offset:-1.5px}
.film .custom:not(.has):hover{color:var(--fg)}
.film .custom .cimg{position:absolute;inset:0;background:center/cover no-repeat}
.film .custom.has:not(.on) .cimg{opacity:.55}
.film .custom.has:not(.on):hover .cimg{opacity:.9}
.film .custom .clbl{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px}
.film .custom.has .clbl{display:none}
.film .custom .cbar{position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--fg);transform-origin:left;transform:scaleX(0);transition:transform .2s}
.film .custom:not(.up) .cbar{display:none}
.film .custom .crm{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;display:none;place-items:center;background:rgba(0,0,0,.55);color:#fff}
.film .custom.has .crm{display:grid}
.film .custom.on{box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--fg)}
.film button:disabled{cursor:not-allowed;opacity:.3}
.film button:disabled:hover{opacity:.3}
.covernote{margin-top:8px;font-size:12px;color:var(--mute);line-height:1.5}
.film .sk{flex:none;width:112px;aspect-ratio:16/9;border-radius:8px;background:linear-gradient(100deg,var(--sunk) 40%,var(--line) 50%,var(--sunk) 60%) 0/300% 100%;animation:shimmer 1.4s infinite linear}
@keyframes shimmer{to{background-position:-150% 0}}
.notes{display:flex;flex-direction:column;gap:7px}
.note{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;line-height:1.55;color:var(--fg2);animation:rise .35s var(--ease)}
.note .ic{flex:none;margin-top:2px;color:var(--fg3)}
.note.warn,.note.warn .ic{color:var(--amber)}
.note b{font-weight:600}
.slotlist{display:flex;flex-direction:column;gap:10px;padding:6px 6px 4px;max-width:300px}
.slotlist .sgh{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:var(--fg3);margin-bottom:6px}
.slotlist .sgl{display:flex;flex-wrap:wrap;gap:5px}
.slotlist .slot{font-size:12.5px;padding:1px 7px;outline:0;border:1px dashed color-mix(in srgb,var(--amber) 70%,transparent);background:color-mix(in srgb,var(--amber) 10%,transparent);color:var(--amber);border-radius:6px}
.pcard{border-radius:14px;border:1px solid var(--line);background:var(--card);overflow:hidden;position:sticky;top:16px}
.pcard .shot{position:relative;aspect-ratio:16/9;background:var(--sunk) center/cover;transition:background-image .3s}
.pcard .shot .badge{position:absolute;right:8px;bottom:8px;padding:1px 6px;border-radius:5px;background:rgba(0,0,0,.72);color:#fff;font-size:11px;font-weight:600}
.pcard .shot .rate{position:absolute;left:8px;top:8px;padding:1px 7px;border-radius:5px;background:var(--red);color:#fff;font-size:11px;font-weight:700;animation:pop .4s var(--spring)}
.pcard .shot .vis{position:absolute;right:8px;top:8px;width:24px;height:24px;border-radius:7px;background:rgba(0,0,0,.6);color:#fff;display:grid;place-items:center;animation:pop .4s var(--spring)}
.pcard .info{padding:12px 14px 14px}
.pcard .ttl{font-weight:600;font-size:14px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:20px}
.pcard .ttl:empty::before{content:"";display:block;height:12px;width:70%;border-radius:4px;background:var(--sunk);margin-top:4px}
.pcard .by{color:var(--fg3);font-size:12px;margin-top:4px}
.pcard .tgs{display:flex;flex-wrap:wrap;gap:4px;margin-top:10px}
.pcard .tgs span{font-size:11px;padding:1px 7px;border-radius:999px;background:var(--sunk);color:var(--fg2)}
.checks{margin-top:14px;border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden}
.chk{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 12px;border:0;border-top:1px solid var(--line);background:none;cursor:pointer;font-size:13px;text-align:left}
.chk:first-child{border-top:0}
.chk:hover{background:var(--sunk)}
.chk .st{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;border:1.5px solid var(--line2);color:transparent;transition:all .3s var(--ease);flex:none}
.chk.ok .st{background:var(--green);border-color:var(--green);color:#fff}
.chk.wait .st{border-color:var(--blue);border-top-color:transparent;animation:spin .8s linear infinite}
.chk small{margin-left:auto;color:var(--fg3);font-size:12px}
.agree{display:flex;align-items:center;gap:10px;margin-top:14px;padding-left:13px;font-size:13px;cursor:pointer;user-select:none}
.box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--line2);display:grid;place-items:center;color:transparent;transition:all .25s var(--ease);flex:none}
.agree.on .box{background:var(--fg);border-color:var(--fg);color:var(--inv)}
.agree.nudge{animation:shake .4s}
.sens .chip.on{background:var(--amber);border-color:var(--amber);color:#fff}
.done{display:flex;flex-direction:column;align-items:center;text-align:center;padding:56px 0 20px}
.done .tickc{width:84px;height:84px;border-radius:50%;background:var(--fg);color:var(--inv);display:grid;place-items:center;animation:pop .7s var(--spring)}
.done .tickc path{stroke-dasharray:30;stroke-dashoffset:30;animation:draw .5s .25s var(--ease) forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.done h2{margin:22px 0 6px;font-size:22px;letter-spacing:-.03em;animation:rise .5s .15s var(--ease) backwards}
.done .ttl{color:var(--fg2);max-width:520px;animation:rise .5s .2s var(--ease) backwards}
.done .acts{display:flex;gap:8px;margin-top:26px;flex-wrap:wrap;justify-content:center;animation:rise .5s .3s var(--ease) backwards}
.done .pill{margin-top:16px;height:30px;animation:rise .5s .25s var(--ease) backwards}
.loading{display:grid;place-items:center;min-height:50vh;color:var(--fg3)}
.wsk .wsk-steps{display:flex;align-items:center;gap:10px;margin:0 0 28px}
.wsk .wsk-line{flex:1;height:1px;background:var(--line)}
`);

const DRAFT_FIELDS = ['kind', 'source', 'file', 'files', 'embedUrl', 'thumbnail', 'title', 'body', 'rating', 'private', 'unlisted', 'tags', 'tplId', 'tplTitle', 'tplBody', 'customThumbnail', 'customUpload', 'fileName'];

function newDraft(kind) {
  const last = store.get('last:' + kind) || {};
  return { kind, source: 'file', file: null, files: [], embedUrl: '', thumbnail: 0, title: '', body: '', rating: last.rating || 'ecchi', private: false, unlisted: false, tags: [], tplId: null, tplTitle: null, agreed: false, customThumbnail: null, customUpload: null };
}
function draftFromRemote(kind, d) {
  return { kind, source: d.embedUrl ? 'embed' : 'file', file: d.file || null, files: d.files || [], embedUrl: d.embedUrl || '', thumbnail: typeof d.thumbnail === 'number' ? d.thumbnail : 0, title: d.title || '', body: d.body || '',
    rating: d.rating, private: !!d.private, unlisted: !!d.unlisted, tags: (d.tags || []).map((x) => ({ id: x.id, type: x.type, sensitive: !!x.sensitive })), tplId: null, tplTitle: null, agreed: false, customThumbnail: d.customThumbnail || null, customUpload: d.customThumbnail || null };
}

async function mountWizard(host, { kind, editId, app }) {
  const mode = editId ? 'edit' : 'create';
  // 首屏骨架：页头、四步、上传区的形状先摆出来，数据回来后原位换成真的
  clear(host).append(h('div.wrap.wsk', { 'aria-busy': 'true' },
    h('div.top', skel(120, 28), skel(150, 36, 10), h('span.sp', { style: { flex: 1 } }), skel(86, 36, 8), skel(32, 32, 8)),
    h('div.wsk-steps', [0, 1, 2, 3].map((i) => [i > 0 && h('span.wsk-line'), skel(28, 28, true), skel(36, 12)])),
    skel('100%', 240, 14),
    h('div', { style: { marginTop: '20px', display: 'grid', gap: '10px' } }, [70, 55, 62].map((w) => h('div.row', skel(28, 28, 8), skel(70, 12), skel(w * 3, 12))))));
  let original = null, draft;
  // 站点规则（限制、说明、链接）和标签词库一起取；规则最多等 6 秒，取不到就用上次缓存的
  await Promise.all([tagDict.load(), Promise.race([siteRules.load(), sleep(6000)])]);
  if (editId) {
    try { original = await svc.detail(kind, editId); } catch (e) { clear(host).append(h('div.loading', icon('warn', 24), e.text || e.message)); return () => {}; }
    draft = draftFromRemote(kind, original);
  } else {
    const saved = store.get('draft:' + kind);
    draft = Object.assign(newDraft(kind), saved || {});
    if (saved && (saved.title || saved.body || saved.file || (saved.files || []).length || (saved.tags || []).length)) {
      setTimeout(() => toast(t('draftRestored'), { action: t('discardDraft'), onAction: () => { store.del('draft:' + kind); app.reload(); } }), 500);
    }
  }
  const baseline = JSON.stringify(DRAFT_FIELDS.map((k) => draft[k]));

  const bus = emitter();
  // 上传 / 处理完成会改 draft.file(s)：也要落草稿，否则传完一刷新文件对象就丢了（只能重传）
  const uploader = kind === 'video' ? videoUploader(draft, (s) => { bus.emit('upload', s); bus.emit('change'); persist(); }) : null;
  const images = kind === 'image' ? imageUploader(draft, (item) => { bus.emit('images', item); if (!item) { bus.emit('change'); persist(); } }) : null;
  const order = mode === 'edit' && kind === 'video' ? ['content', 'tags', 'publish'] : ['upload', 'content', 'tags', 'publish'];
  let cur = 0, stepView = null, cooldown = { limited: false, remaining: 0 }, cooldownAt = Date.now(), disposed = false;
  const timers = [];
  // 自定义封面（高级会员 / staff）：上传中的那张，{ url(本地预览), progress, abort }；传完的服务端文件对象进 draft.customUpload，选中时同时进 draft.customThumbnail
  let coverUp = null;
  const coverLocal = new Map(); // 服务端文件 id → 本地预览地址，刚传完的图缩略图可能还没生成，先用本地的

  const persist = debounce(() => { if (mode === 'create' && !disposed) { const out = {}; for (const k of DRAFT_FIELDS) out[k] = draft[k]; store.set('draft:' + kind, out); } }, 400);
  const changed = () => { persist(); bus.emit('change'); };
  const dirty = () => JSON.stringify(DRAFT_FIELDS.map((k) => draft[k])) !== baseline;

  // ── 完成度 ──
  const fileState = () => {
    if (kind === 'image') return images.busy ? 'wait' : draft.files.length ? 'ok' : 'no';
    if (draft.source === 'embed') return youtubeId(draft.embedUrl) ? 'ok' : 'no';
    if (coverUp) return 'wait';
    return draft.file ? 'ok' : uploader.busy ? 'wait' : 'no';
  };
  const slotCount = () => md.slots(draft.title).length + md.slots(draft.body).length;
  const checks = () => ({ file: fileState(), title: draft.title.trim() ? 'ok' : 'no', category: draft.tags.some((x) => x.type === 'category') ? 'ok' : 'no', slots: slotCount() ? 'no' : 'ok', rating: draft.rating ? 'ok' : 'no', rules: svc.isStaff || draft.agreed ? 'ok' : 'no' });
  const stepOk = (name) => { const c = checks(); return name === 'upload' ? c.file === 'ok' : name === 'content' ? c.title === 'ok' && c.slots === 'ok' : name === 'tags' ? c.category === 'ok' : false; };
  const coolLeft = () => (cooldown.limited ? Math.max(0, cooldown.remaining - (Date.now() - cooldownAt) / 1000) : 0);

  // ── 页头 ──
  const kindSeg = mode === 'create' && segmented([{ value: 'video', label: t('video'), icon: 'film' }, { value: 'image', label: t('image'), icon: 'picture' }], kind, (v) => app.go(`/create/${v}`));
  const tplBtn = btn(t('templates'), { icon: 'bookmark', onclick: () => templateGallery(kind, applyTemplate) });
  // 帮助：在内容步打开时直接翻到「填空」，关掉后光标回到填空；别的步骤从「发布流程」开始
  const openHelp = () => (stepView && stepView.guide ? stepView.guide() : showHelp({ at: 'flow' }));
  const moreBtn = ibtn('more', '', () => app.menu(moreBtn, [{ icon: 'help', label: t('help'), onclick: openHelp }]));
  const header = h('div.top', h('h1', t(mode === 'edit' ? (kind === 'video' ? 'editVideo' : 'editImage') : kind === 'video' ? 'publishVideo' : 'publishImage')), kindSeg, h('span.sp'), tplBtn, moreBtn);

  function applyTemplate(tpl) {
    const undo = templates.apply(draft, tpl);
    changed();
    go(order.indexOf('content'), true);
    toast(t('applied', { n: tpl.name }), { action: t('undo'), onAction: () => { undo(); changed(); go(cur, true); } });
  }

  // ── 步骤条 ──
  const stepEls = order.map((name, i) => {
    const n = h('span.n', String(i + 1));
    const li = h('li', { onclick: () => go(i) }, n, h('span', t('step' + name[0].toUpperCase() + name.slice(1))));
    return { name, li, n };
  });
  const bars = [];
  const stepper = h('ol.steps', stepEls.map((s, i) => { if (!i) return s.li; const bar = h('span.bar', h('i')); bars.push(bar); return [bar, s.li]; }));
  function drawStepper() {
    stepEls.forEach((s, i) => {
      const ok = stepOk(s.name);
      const waiting = s.name === 'upload' && fileState() === 'wait';
      s.li.className = (i === cur ? 'cur ' : '') + (ok ? 'ok' : '');
      const want = ok && i !== cur ? 'check' : waiting ? 'wait' : 'num';
      if (s.n.dataset.s !== want) {
        s.n.dataset.s = want;
        add(clear(s.n), [want === 'check' ? icon('check', 14) : String(i + 1), want === 'wait' && h('span.mini')]);
      }
    });
    bars.forEach((b, i) => b.classList.toggle('on', i < cur));
  }

  // ── 步骤内容 ──
  const stage = h('div.stage');
  const ctx = {
    draft, mode, bus, uploader, images, changed,
    cooldownChip() {
      const chip = h('span.pill.amber', { style: { display: 'none' }, data: { tip: t('cooldown') } }, icon('clock', 13), h('span.mono'));
      const tick = () => { const left = coolLeft(); chip.style.display = left > 0 ? '' : 'none'; chip.lastChild.textContent = fmtClock(left); };
      tick();
      timers.push(setInterval(tick, 1000));
      return chip;
    },
  };

  const builders = {
    upload: () => (kind === 'video' ? uploadStepVideo(ctx) : uploadStepImage(ctx)),
    content() {
      // 标题里的填空位规则和简介一致：点 / Tab 进入橙色编辑区，回车、→、↑、↓、Esc 填完，空着按退格也算填完；
      // 光标停在填空位后面按退格整个删掉。编辑区 = [start, 总长 - tail]：区外的文字不会变，用尾长定位右端。
      const back = h('div.back');
      const input = h('input', { value: draft.title, placeholder: t('titlePh'), maxLength: 255, spellcheck: false });
      const tip = slotTip();
      let act = null; // { start, tail, label }
      const region = () => [act.start, input.value.length - act.tail];
      const segment = (text) => {
        let last = 0;
        for (const m of text.matchAll(SLOT_RE)) { back.append(text.slice(last, m.index), h('mark', m[0])); last = m.index + m[0].length; }
        back.append(text.slice(last));
      };
      const paint = () => {
        clear(back);
        const v = input.value;
        if (act) {
          const [s0, e0] = region();
          segment(v.slice(0, s0));
          const edit = h('mark.edit' + (s0 === e0 ? '.empty' : ''), v.slice(s0, e0));
          back.append(edit);
          segment(v.slice(e0));
          back.scrollLeft = input.scrollLeft;
          if (ui.root.activeElement === input) tip.show(edit.getBoundingClientRect(), act.label); else tip.hide();
        } else { segment(v); back.scrollLeft = input.scrollLeft; tip.hide(); }
        schedBar();
      };
      const nextSlot = (from) => [...input.value.matchAll(SLOT_RE)].find((m) => m.index >= from);
      function enter(m) {
        input.focus();
        input.setSelectionRange(m.index, m.index + m[0].length);
        // p：这一格还是原样的占位符，第一次输入整格替换（见 fixPending），不管光标落在格子里哪儿
        act = { start: m.index, tail: input.value.length - (m.index + m[0].length), label: m[1], p: true };
        paint();
        // 触屏：点按之后系统还会再摆一次光标，把整格选中盖掉；稍后补选一次（补不上有 fixPending 兜底）
        if (matchMedia('(hover:none)').matches) {
          const mine = act;
          setTimeout(() => { if (act === mine && act.p && ui.root.activeElement === input) { const [s0, e0] = region(); if (input.selectionStart !== s0 || input.selectionEnd !== e0) input.setSelectionRange(s0, e0); } }, 80);
        }
      }
      /** 还没改过的占位符被输入改动了（手机上光标常落在 {…} 中间，字插进占位符里）：整格换成这次输入的内容。组字期间不动。 */
      function fixPending() {
        if (!act || !act.p) return;
        const [s0, e0] = region();
        if (e0 < s0) return;
        const P = `{${act.label}}`, X = input.value.slice(s0, e0);
        if (X === P) return;
        act.p = false;
        input.setRangeText(slotEdit(P, X), s0, e0, 'end');
      }
      function finish(toEnd) {
        if (!act) return;
        const [, e0] = region();
        act = null;
        if (toEnd) input.setSelectionRange(e0, e0);
        paint();
      }
      // 光标离开编辑区就结束
      const watch = () => {
        if (!act) return;
        const [s0, e0] = region();
        if (e0 < s0 || input.selectionStart < s0 || input.selectionEnd > e0) finish(false); else paint();
      };
      const titleClr = clearBtn(t('checkTitle'), { read: () => input.value, write: (v) => { act = null; input.value = v; input.dispatchEvent(new Event('input')); input.focus(); } });
      input.addEventListener('input', (e) => { if (!e.isComposing) fixPending(); draft.title = input.value; watch(); paint(); changed(); titleClr.show(!!input.value); });
      // 组字结束后 Chrome 不再补发 input：在这里修占位符，再走一遍 input 的更新
      input.addEventListener('compositionend', () => { if (act && act.p) { fixPending(); input.dispatchEvent(new Event('input')); } });
      input.addEventListener('scroll', () => { back.scrollLeft = input.scrollLeft; });
      input.addEventListener('keyup', watch);
      input.addEventListener('blur', () => tip.hide());
      input.addEventListener('focus', () => act && paint());
      input.addEventListener('mouseup', () => {
        if (input.selectionStart !== input.selectionEnd) return watch();
        const pos = input.selectionStart;
        const m = [...input.value.matchAll(SLOT_RE)].find((x) => pos >= x.index && pos < x.index + x[0].length);
        if (m && !(act && act.start === m.index)) enter(m); else watch();
      });
      input.addEventListener('keydown', (e) => {
        if (e.isComposing) return;
        if (e.key === 'Tab' && !e.shiftKey) {
          const m = nextSlot(act ? region()[1] : input.selectionEnd);
          // 没有下一个填空：正在填的这一格算填完，焦点留在原地，不让 Tab 跑到别的控件上
          if (m) { e.preventDefault(); enter(m); } else if (act) { e.preventDefault(); if (editor.focusFirstSlot()) finish(false); else finish(true); } else if (editor.focusFirstSlot()) e.preventDefault();
          return;
        }
        if (act) {
          if (['Enter', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); finish(true); return; }
          if (e.key === 'Backspace') { const [s0, e0] = region(); if (s0 === e0) { e.preventDefault(); finish(false); } }
          return;
        }
        if (e.key === 'Backspace' && input.selectionStart === input.selectionEnd) {
          const pos = input.selectionStart;
          const m = [...input.value.matchAll(SLOT_RE)].find((x) => x.index + x[0].length === pos);
          if (m) { e.preventDefault(); input.setRangeText('', m.index, pos, 'end'); input.dispatchEvent(new Event('input')); }
        } else if (e.key === 'Enter') { e.preventDefault(); editor.focusFirstSlot() || editor.focus(); }
      });
      // ── 手机：键盘上方的填空条 ──
      // 软键盘没有 Tab；安卓输入法的退格、回车常常只给 keyCode 229，按键判断收不到。桌面那套按键在手机上走不通，
      // 触屏改成：进这一步不自动弹键盘，点哪个填空就从哪个开始；
      // 填的时候键盘上沿挂一条：正在填哪一格、还剩几个，「删掉 / 下一个 / 完成」替代退格、Tab、回车。
      const touch = matchMedia('(hover:none)').matches;
      const FULL_SLOT = /^\{[^{}\n]{1,24}\}$/;
      const slotsLeft = () => md.slots(input.value).length + editor.slotCount();
      const curSlot = () => {
        if (act) { const [s0, e0] = region(); return { label: act.label, pending: FULL_SLOT.test(input.value.slice(s0, e0)) }; }
        return editor.activeSlot();
      };
      /** 下一个没填的空：标题往后 → 简介 → 回到标题开头（跳过的空还会轮到）。 */
      function nextAny() {
        fixPending();
        if (act) {
          const m = nextSlot(region()[1]);
          if (m) return enter(m);
          finish(true);
          if (editor.focusFirstSlot()) return;
          const m0 = nextSlot(0);
          if (m0) enter(m0);
          return;
        }
        if (editor.activeSlot()) {
          if (editor.nextSlot()) return;
          editor.finishSlot();
          const m = nextSlot(0);
          if (m) return enter(m);
          editor.focusFirstSlot();
          return;
        }
        focusStart();
      }
      /** 删掉这一格（不需要的空），还有别的就接着去下一个。 */
      function dropCur() {
        if (act) {
          const [s0, e0] = region();
          act = null;
          input.setRangeText('', s0, e0, 'end');
          input.dispatchEvent(new Event('input'));
          paint();
        } else editor.clearSlot();
        if (slotsLeft()) nextAny();
      }
      /** 这一格算填完，收起键盘。 */
      function doneCur() {
        if (act) { fixPending(); finish(true); input.blur(); } else { editor.finishSlot(); editor.blur(); }
        if (ui.root.activeElement && ui.root.activeElement.blur) ui.root.activeElement.blur();
      }
      const keep = { onpointerdown: (e) => e.preventDefault(), onmousedown: (e) => e.preventDefault() }; // 点按钮不抢焦点，键盘不收
      const sbName = h('span.sb-name'), sbInfo = h('span.sb-info');
      const sbDel = h('button.sb-btn.del', { type: 'button', ...keep, onclick: dropCur }, icon('trash', 15), h('span', t('sbDelete')));
      const sbNextLbl = h('span');
      const sbNext = h('button.sb-btn.pri', { type: 'button', ...keep, onclick: nextAny }, sbNextLbl, icon('arrowRight', 15));
      const sbDone = h('button.sb-btn', { type: 'button', ...keep, onclick: doneCur }, icon('check', 15), h('span', t('sbDone')));
      const sbar = touch ? h('div.sbar', { role: 'toolbar' }, h('div.sb-txt', sbName, sbInfo), sbDel, sbNext, sbDone) : null;
      let focused = false, barRaf = 0, lastLeft = -1, okUntil = 0;
      function schedBar() { if (touch && !barRaf) barRaf = requestAnimationFrame(drawBar); }
      function drawBar() {
        barRaf = 0;
        if (disposed || !sbar) return;
        const n = slotsLeft(), c = curSlot();
        if (lastLeft > 0 && n === 0) { okUntil = Date.now() + 1800; setTimeout(schedBar, 1850); }
        lastLeft = n;
        const show = focused && (n > 0 || !!c || Date.now() < okUntil);
        if (!sbar.isConnected) ui.layer.append(sbar);
        sbar.classList.toggle('in', show);
        const nav = ui.root.querySelector('.navbar');
        if (nav) nav.classList.toggle('kb', show);
        if (!show) return;
        const others = n - (c && c.pending ? 1 : 0);
        const ok = !n && !c;
        sbar.classList.toggle('ok', ok);
        clear(sbName).append(icon(ok ? 'check' : 'sparkle', 14), h('span', c ? c.label : ok ? t('sbAllDone') : t('sbHave', { n })));
        sbInfo.textContent = c ? (others ? t('sbLeft', { n: others }) : t('sbLast')) : '';
        sbInfo.hidden = !sbInfo.textContent;
        sbDel.hidden = !c;
        sbNext.hidden = c ? others <= 0 : !n;
        sbNextLbl.textContent = c ? t('sbNext') : t('sbStart');
      }
      const vv = window.visualViewport;
      const fitBar = () => { if (sbar) sbar.style.bottom = (vv ? Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop)) : 0) + 'px'; };
      if (touch && vv) { vv.addEventListener('resize', fitBar); vv.addEventListener('scroll', fitBar); fitBar(); }
      const editor = mdEditor({ help: true, clearLabel: t('keepBody'), value: draft.body, placeholder: t('bodyPh'), onSlot: schedBar, onChange: (v) => { if (v !== draft.body) { draft.body = v; changed(); } } });
      paint();
      titleClr.show(!!input.value);
      const focusStart = () => { if (disposed) return; const m = nextSlot(0); if (m) enter(m); else if (!editor.focusFirstSlot()) input.focus(); };
      // 触屏不自动进填空：程序里 focus 会突然弹出键盘（iOS 干脆不弹，光标停着却没键盘），由用户点填空进入
      const guide = () => showHelp({ at: 'slots', onClose: () => { if (!touch) setTimeout(focusStart, 60); } });
      // 第一次进这一步：先放填空指引，关掉后再把光标放进第一个填空
      setTimeout(() => { if (disposed) return; if (!store.get('slotGuideDone')) guide(); else if (!touch) focusStart(); }, 80);
      const rootEl = h('div', h('div.titlebox', back, input, titleClr.el), editor.el);
      if (touch) {
        rootEl.addEventListener('focusin', () => { focused = true; schedBar(); });
        rootEl.addEventListener('focusout', () => setTimeout(() => { const a = ui.root.activeElement; focused = !!a && rootEl.contains(a); schedBar(); }, 0));
        schedBar();
      }
      return {
        el: rootEl,
        guide,
        dispose: () => {
          tip.remove(); editor.destroy();
          if (sbar) { sbar.remove(); cancelAnimationFrame(barRaf); const nav = ui.root.querySelector('.navbar'); if (nav) nav.classList.remove('kb'); }
          if (touch && vv) { vv.removeEventListener('resize', fitBar); vv.removeEventListener('scroll', fitBar); }
        },
        /** 进入第一个还没填的填空位（标题优先），没有返回 false。 */
        firstSlot: () => { const m = nextSlot(0); if (m) { enter(m); return true; } return editor.focusFirstSlot(); },
      };
    },
    tags() {
      const picker = tagPicker(draft.tags, changed, { required: true, kind }); // 视频、图库都必须恰好一个类别
      setTimeout(() => !disposed && picker.focus(), 80);
      return { el: picker.el, dispose: picker.dispose };
    },
    publish: () => publishStep(),
  };

  function publishStep() {
    const sensitive = svc.config.blacklist || [];
    const hasSens = () => draft.tags.some((x) => x.sensitive);
    // 封面
    const film = h('div.film');
    let frameSrc = [];
    const shot = h('div.shot');
    const rate = h('span.rate', '18+');
    const vis = h('span.vis');
    const badge = h('span.badge.mono');
    shot.append(rate, vis, badge);
    const ttl = h('div.ttl'), tgs = h('div.tgs');
    function frames() {
      if (kind !== 'video' || draft.source === 'embed') return [];
      if (draft.file) return Array.from({ length: draft.file.numThumbnails || 16 }, (_, i) => thumbUrl.video({ file: draft.file }, i));
      return uploader.state.frames || [];
    }
    // 自定义封面保存后不能移除，只能更换（站点本身也只提供「上传 / 更换」）。所以已带自定义封面的视频：候选帧锁住，只能换图。
    const coverLocked = mode === 'edit' && !!(original && original.customThumbnail);
    const coverNote = h('div.covernote');
    // 自定义封面块：排在候选帧最前面。没传过：虚线框「自定义」；传过：显示那张图，点它选中，右上角 × 丢掉
    const customOk = svc.canCustomThumb || !!draft.customUpload;
    const coverInput = h('input', { type: 'file', accept: coverAccept(), style: { display: 'none' }, onchange: () => { const f = coverInput.files[0]; coverInput.value = ''; if (f) pickCover(f); } });
    const cImg = h('span.cimg'), cBar = h('i.cbar');
    const cRm = !coverLocked && h('span.crm', { role: 'button', title: t('coverRemove'), onclick: (e) => { e.stopPropagation(); if (coverUp) { coverUp.abort(); coverUp = null; } draft.customUpload = draft.customThumbnail = null; changed(); } }, icon('x', 12));
    const cLbl = h('span.clbl', icon('upload', 16), h('span', t('coverCustom')));
    const customBtn = customOk && h('button.custom', { type: 'button', title: t('coverCustomTip'), onclick: () => {
      if (coverUp) return;
      if (draft.customUpload && !draft.customThumbnail) { draft.customThumbnail = draft.customUpload; changed(); } else coverInput.click();
    } }, ...[cImg, cLbl, cBar, cRm, coverInput].filter(Boolean));
    const coverSrc = (f) => (f ? coverLocal.get(f.id) || thumbUrl.video({ customThumbnail: f }) : null);
    function drawCustom() {
      if (!customBtn) return;
      const src = coverUp ? coverUp.url : coverSrc(draft.customUpload);
      cImg.style.backgroundImage = src ? `url(${src})` : '';
      customBtn.className = 'custom' + (src ? ' has' : '') + (draft.customThumbnail ? ' on' : '') + (coverUp ? ' up' : '');
      customBtn.title = draft.customUpload && draft.customThumbnail ? t('coverReplaceTip') : t('coverCustomTip');
      coverNote.textContent = coverLocked ? t('coverLockedNote') : draft.customThumbnail || coverUp ? t('coverCustomNote') : '';
      coverNote.style.display = coverNote.textContent ? '' : 'none';
      cBar.style.transform = `scaleX(${coverUp ? coverUp.progress : 0})`;
    }
    function pickCover(f) {
      if (!f.type.startsWith('image/') || !imageTypeOk(f)) return toast(t('errImgType'), { error: true });
      if (!imageSizeOk(f)) return toast(t('errImgSize'), { error: true });
      if (coverUp) coverUp.abort();
      const me = coverUp = { url: null, progress: 0, abort: () => {} };
      previewDataUrl(f, 960).then((u) => { me.url = u; if (coverUp === me) changed(); else if (u && me.fileId) { coverLocal.set(me.fileId, u); changed(); } });
      const job = svc.uploadImage(f, (p) => { if (coverUp === me) { me.progress = p; drawCustom(); } });
      me.abort = job.abort;
      changed();
      job.promise.then((res) => {
        if (coverUp !== me) return;
        const file = res && res.id && res.name ? res : { id: res.id, type: 'image', name: f.name, mime: f.type, size: f.size };
        me.fileId = file.id;
        if (me.url) coverLocal.set(file.id, me.url);
        coverUp = null;
        draft.customUpload = draft.customThumbnail = file;
        changed();
      }, (e) => {
        if (coverUp !== me) return;
        coverUp = null;
        if (e.status !== -1) toast(t('errUpload') + sepColon() + e.text, { error: true });
        changed();
      });
    }
    let frameBtns = [], shownPick = null;
    function drawFilm() {
      if (kind !== 'video' || draft.source === 'embed') return;
      drawCustom();
      const pick = draft.customThumbnail ? -1 : draft.thumbnail;
      const next = frames();
      if (film.firstChild && next.length === frameSrc.length && next[0] === frameSrc[0]) frameBtns.forEach((b, i) => b.classList.toggle('on', i === pick));
      else {
        frameSrc = next;
        frameBtns = next.map((src, i) => h('button' + (i === pick ? '.on' : ''), { type: 'button', disabled: coverLocked, title: coverLocked ? t('coverLockedNote') : null, style: { backgroundImage: `url(${src})` }, onclick: () => { draft.thumbnail = i; draft.customThumbnail = null; changed(); } }));
        clear(film).append(...[customBtn, ...(next.length ? frameBtns : Array.from({ length: 6 }, () => h('div.sk')))].filter(Boolean));
        shownPick = null;
      }
      // 选中项变了（含首次渲染）才滚过去，用户自己拖动候选条时不跟着跳
      if (pick === shownPick) return;
      shownPick = pick;
      const on = film.querySelector('.on');
      if (on) requestAnimationFrame(() => { film.scrollLeft = Math.max(0, on.offsetLeft - film.clientWidth / 2 + on.offsetWidth / 2); });
    }
    function cover() {
      if (kind === 'image') { const f = draft.files[0]; return f ? thumbUrl.file(f) : null; }
      if (draft.source === 'embed') { const id = youtubeId(draft.embedUrl); return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null; }
      if (coverUp) return coverUp.url;
      // 预览卡比候选块大，用 large 档（870 宽）；thumbnail 档只有 220×160
      if (draft.customThumbnail) return coverLocal.get(draft.customThumbnail.id) || thumbUrl.file(draft.customThumbnail, 'large');
      return frames()[draft.thumbnail] || null;
    }
    // 分级 / 可见范围
    const ratingSeg = segmented([{ value: 'general', label: t('ratingGeneral'), icon: 'shield' }, { value: 'ecchi', label: t('ratingEcchi'), icon: 'flame' }], draft.rating, (v) => { draft.rating = v; changed(); }, { wide: true });
    const visValue = () => (draft.private ? 'private' : draft.unlisted ? 'unlisted' : 'public');
    const visSeg = kind === 'video' && segmented([{ value: 'public', label: t('vPublic'), icon: 'globe' }, { value: 'unlisted', label: t('vUnlisted'), icon: 'eyeOff' }, { value: 'private', label: t('vPrivate'), icon: 'lock' }], visValue(),
      (v) => { draft.private = v === 'private'; draft.unlisted = v === 'unlisted'; changed(); }, { wide: true });
    const sensChips = sensitive.map((s) => {
      const c = h('button.chip', { type: 'button', data: { tip: s.id }, onclick: () => { const i = draft.tags.findIndex((x) => x.id === s.id); i >= 0 ? draft.tags.splice(i, 1) : draft.tags.push({ id: s.id, type: s.type, sensitive: true }); changed(); } }, tagDict.name(s.id));
      return [s.id, c];
    });
    // 谁能看到：不可点，只用小字 + 图标说明当前设置会让谁看不到
    const notes = h('div.notes');
    let notesKey = '';
    function drawNotes() {
      const sens = draft.tags.filter((x) => x.sensitive).map((x) => tagDict.name(x.id));
      const lines = [];
      if (draft.private) lines.push(['lock', t('reachPrivate')]);
      else {
        lines.push(draft.unlisted ? ['eyeOff', t('reachUnlisted')] : ['globe', t('reachPublic')]);
        if (sens.length) lines.push(['warn', t('reachSensitive', { n: sens.slice(0, 3).join(sepList()) + (sens.length > 3 ? '…' : '') }), true]);
        if (draft.rating === 'ecchi') lines.push(['eyeOff', t('reachEcchi')]);
      }
      const key = JSON.stringify(lines);
      if (key === notesKey) return;
      notesKey = key;
      clear(notes).append(...lines.map(([ic, text, warn]) => h('div.note' + (warn ? '.warn' : ''), icon(ic, 14), h('span', text))));
    }
    // 「N 处填空未填」悬停：按标题 / 简介列出还没填的空
    const slotPanel = () => {
      const groups = [['heading', t('title'), md.slots(draft.title)], ['pencil', t('keepBody'), md.slots(draft.body)]].filter((g) => g[2].length);
      return groups.length ? h('div.slotlist', groups.map(([ic, name, list]) => h('div', h('div.sgh', icon(ic, 13), name), h('div.sgl', list.map((x) => h('span.slot', x)))))) : null;
    };
    // 清单
    const rows = [['file', kind === 'video' && draft.source === 'embed' ? 'checkEmbed' : 'checkFile', 'upload'], ['title', 'checkTitle', 'content'], ['slots', null, 'content'], ['category', 'checkCategory', 'tags'], ['rating', 'rating', null]]
      .map(([key, label, step]) => {
        const small = h('small'); const text = h('span', label ? t(label) : '');
        const row = h('button.chk', { type: 'button', onclick: () => {
          if (!step || !order.includes(step)) return ratingSeg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          go(order.indexOf(step));
          if (key === 'slots') setTimeout(() => stepView.firstSlot && stepView.firstSlot(), 120);
        } }, h('span.st', icon('check', 12)), text, small);
        if (key === 'slots') hoverPanel(row, slotPanel);
        return [key, row, small, text];
      });
    const agree = !svc.isStaff && h('label.agree', { onclick: (e) => { if (e.target.closest('a')) return; e.preventDefault(); draft.agreed = !draft.agreed; changed(); } },
      h('span.box', icon('check', 13)), h('span', t('rules'), ' ', h('a', { href: location.origin + '/rules', target: '_blank', rel: 'noopener', style: { textDecoration: 'underline', textUnderlineOffset: '3px' } }, t('rulesLink'))));

    function draw() {
      const c = checks();
      drawFilm();
      const cv = cover();
      shot.style.backgroundImage = cv ? `url(${cv})` : '';
      rate.style.display = draft.rating === 'ecchi' ? '' : 'none';
      vis.style.display = draft.private || draft.unlisted ? '' : 'none';
      clear(vis).append(icon(draft.private ? 'lock' : 'eyeOff', 14));
      const dur = kind === 'video' ? (draft.file && draft.file.duration) || (uploader.state.meta && uploader.state.meta.duration) : null;
      badge.style.display = dur || kind === 'image' ? '' : 'none';
      badge.textContent = kind === 'image' ? String(draft.files.length) : fmtDuration(dur);
      ttl.textContent = draft.title;
      clear(tgs).append(...draft.tags.slice(0, 6).map((x) => h('span', tagDict.name(x.id))));
      sensChips.forEach(([id, chip]) => chip.classList.toggle('on', draft.tags.some((x) => x.id === id)));
      drawNotes();
      rows.forEach(([key, row, small, text]) => {
        row.className = 'chk ' + (c[key] === 'ok' ? 'ok' : c[key] === 'wait' ? 'wait' : '');
        if (key === 'slots') { row.style.display = c.slots === 'ok' ? 'none' : ''; text.textContent = t('checkSlots', { n: slotCount() }); }
        if (key === 'file' && kind === 'video' && draft.source === 'file') { const s = uploader.state; small.textContent = s.phase === 'uploading' ? Math.round(s.progress * 100) + '%' : s.phase === 'waiting' ? t('queued') : s.phase === 'active' ? t('processing') : ''; }
        if (key === 'rating') row.style.display = c.rating === 'ok' ? 'none' : '';
      });
      if (agree) agree.classList.toggle('on', !!draft.agreed);
    }
    const off = bus.on('change', draw);
    const offUp = bus.on('upload', draw);
    draw();
    const left = h('div',
      kind === 'video' && draft.source !== 'embed' && h('div.set', h('div.label', t('cover')), film, coverNote),
      h('div.set', h('div.label', t('rating')), ratingSeg),
      visSeg && h('div.set', h('div.label', t('visibility')), visSeg),
      sensChips.length > 0 && h('div.set.sens', h('div.label', icon('warn', 14), t('sensitive')), h('div.chips', sensChips.map((x) => x[1]))),
      h('div.set', h('div.label', t('reach')), notes));
    const right = h('div', h('div.pcard', shot, h('div.info', ttl, h('div.by', env.user.name), tgs)), h('div.checks', rows.map((r) => r[1])), agree);
    return { el: h('div.pub', left, right), dispose: () => { off(); offUp(); }, nudge: () => { if (agree && !draft.agreed) { agree.classList.remove('nudge'); void agree.offsetWidth; agree.classList.add('nudge'); } } };
  }

  // ── 底部导航 ──
  const backBtn = btn(t('back'), { kind: 'ghost', icon: 'arrowLeft', onclick: () => go(cur - 1) });
  backBtn.title = t('keyPrevHint');
  const saveTplBtn = btn(t('saveAsTemplate'), { kind: 'ghost', icon: 'bookmark', onclick: () => saveTemplateSheet(draft) });
  const nextLabel = h('span');
  const nextBtn = h('button.btn.primary', { type: 'button', title: t('keyNextHint'), onclick: () => (cur === order.length - 1 ? submit() : leaveContent() && go(cur + 1)) }, nextLabel);
  /** 在内容这一步按下一步：还有没改的填空位就不走，直接带到第一个。 */
  function leaveContent() {
    const n = slotCount();
    if (order[cur] !== 'content' || !n) return true;
    stepView.firstSlot && stepView.firstSlot();
    toast(t('checkSlots', { n }), { error: true });
    return false;
  }
  const navbar = h('div.navbar', backBtn, h('span.sp'), saveTplBtn, nextBtn);
  let busy = false;
  function drawNav() {
    const last = cur === order.length - 1;
    backBtn.style.visibility = cur ? '' : 'hidden';
    saveTplBtn.style.display = last ? '' : 'none';
    const c = checks();
    const left = mode === 'create' ? coolLeft() : 0;
    const ready = Object.values(c).every((v) => v === 'ok') && left <= 0;
    nextBtn.disabled = busy || (last && !ready && !(c.rules !== 'ok' && Object.entries(c).every(([k, v]) => k === 'rules' || v === 'ok') && left <= 0));
    const label = busy ? t(mode === 'edit' ? 'saving' : 'publishing') : !last ? t('next') : left > 0 ? `${t('cooldown')} ${fmtClock(left)}` : c.file === 'wait' ? t(uploader && uploader.state.phase === 'uploading' ? 'uploading' : 'processing') : t(mode === 'edit' ? 'save' : 'publish');
    add(clear(nextBtn), [busy || (last && c.file === 'wait') ? h('span.spin') : null, h('span', label), !last && icon('arrowRight'), last && !busy && ready && h('span.kbd', navigator.platform.includes('Mac') ? '⌘↵' : 'Ctrl ↵')]);
  }
  timers.push(setInterval(() => { if (cooldown.limited && cur === order.length - 1) drawNav(); }, 1000));

  function go(i, force) {
    i = clamp(i, 0, order.length - 1);
    if (i === cur && stepView && !force) return;
    const dir = i >= cur ? 1 : -1;
    cur = i;
    if (stepView && stepView.dispose) stepView.dispose();
    stepView = builders[order[cur]]();
    const old = stage.firstElementChild;
    stage.replaceChildren(stepView.el);
    if (old && !reducedMotion()) stepView.el.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)`, filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
    drawStepper();
    drawNav();
    if (old && scrollY > 80) scrollTo({ top: 0 });
  }

  // ── 提交 ──
  async function submit() {
    if (busy) return;
    const c = checks();
    if (c.rules !== 'ok') { stepView.nudge && stepView.nudge(); return; }
    if (!Object.values(c).every((v) => v === 'ok')) return;
    busy = true;
    drawNav();
    try {
      let res;
      const fields = { title: draft.title.trim(), body: draft.body, rating: draft.rating, tags: draft.tags };
      if (mode === 'edit') {
        const payload = { ...original, ...fields };
        if (kind === 'video') Object.assign(payload, { private: draft.private, unlisted: draft.unlisted, thumbnail: draft.thumbnail, customThumbnail: draft.customThumbnail || null });
        else payload.files = draft.files;
        res = await svc.update(kind, editId, payload);
      } else {
        const payload = { ...fields, rulesAgreement: true };
        if (kind === 'video') {
          if (draft.source === 'embed') payload.embedUrl = youtubeUrl(youtubeId(draft.embedUrl)); else { payload.file = draft.file; payload.thumbnail = draft.thumbnail; if (draft.customThumbnail) payload.customThumbnail = draft.customThumbnail; }
          if (draft.private) payload.private = true;
          if (draft.unlisted) payload.unlisted = true;
        } else payload.files = draft.files;
        res = await svc.create(kind, payload);
        tagMemory.bump(draft.tags);
        store.set('last:' + kind, { tags: draft.tags.filter((x) => !x.sensitive), rating: draft.rating, private: draft.private, unlisted: draft.unlisted });
        if (draft.tplId) templates.bump(draft.tplId);
        store.del('draft:' + kind);
      }
      showDone(res);
    } catch (e) {
      busy = false;
      if (e.status === 429) { cooldown = await svc.cooldown(kind); cooldownAt = Date.now(); if (!cooldown.limited) toast(e.text, { error: true }); }
      else {
        const key = Object.keys(e.fields || {})[0];
        toast(e.text || t('errNetwork'), { error: true, ms: 6000 });
        if (key === 'tags') go(order.indexOf('tags')); else if (key === 'title' || key === 'body') go(order.indexOf('content'));
      }
      drawNav();
    }
  }

  function showDone(res) {
    disposed = true;
    timers.forEach(clearInterval);
    const id = res.id || editId;
    const path = `/${kind}/${id}`;
    const status = h('span.pill', { style: { display: 'none' } });
    let stop = false;
    if (mode === 'create' && kind === 'video' && res.status === 'processing') {
      const started = Date.now();
      const clock = h('span.mono');
      status.className = 'pill amber';
      status.style.display = '';
      status.append(h('span.spin', { style: { width: '12px', height: '12px' } }), t('transcoding'), clock);
      const tick = setInterval(() => { clock.textContent = fmtClock((Date.now() - started) / 1000); }, 1000);
      (async () => {
        while (!stop) {
          await sleep(8000);
          const live = await api.call(path).catch(() => null);
          if (live && live.status === 'active') break;
        }
        clearInterval(tick);
        if (stop) return;
        status.className = 'pill green';
        clear(status).append(icon('check', 13), t('live'));
        status.animate([{ transform: 'scale(.8)' }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
      })();
    }
    const tick = h('div.tickc');
    tick.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
    const view = h('div.done', tick, h('h2', t(mode === 'edit' ? 'saved' : 'published')), h('div.ttl', draft.title), status,
      mode === 'edit' && h('span.pill', { style: { display: 'inline-flex' } }, icon('clock', 13), t('staleNote')),
      h('div.acts', btn(t('viewPage'), { kind: 'primary', icon: 'external', onclick: () => openTab(path) }),
        btn(t('saveAsTemplate'), { icon: 'bookmark', onclick: () => saveTemplateSheet(draft) }),
        mode === 'create' && btn(t('another'), { icon: 'plus', onclick: () => app.reload() }),
        btn(t('manage'), { kind: 'ghost', icon: 'layers', onclick: () => app.go(`/account/content/${kind}s`) })));
    host.replaceChildren(h('div.wrap', view));
    cleanup.extra = () => { stop = true; };
  }

  // ── 装配 ──
  const offChange = bus.on('change', () => { drawStepper(); drawNav(); });
  // ── 步骤快捷键 ──
  // 没在输入时：→ 下一步、← 上一步（焦点在按钮、分段、复选框上也算没在输入，但按钮自己的回车不抢）。
  // 任何时候（包括正在输入）：⌘/Ctrl+↵ 下一步，⌘/Ctrl+⇧+↵ 上一步。输入法选词中、弹窗/菜单/浮层开着时都不响应。
  // 下一步走和按钮完全相同的闸门：按钮禁用（发布条件没满足、冷却中）或者内容步还有填空没填，就抖一下按钮并说清卡在哪。
  const typing = (el) => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !/^(checkbox|radio|button|submit|range)$/.test(el.type || ''));
  const overlayOpen = () => !!ui.layer.querySelector('.scrim, .pop.in');
  function blockedReason() {
    if (busy) return null;
    const c = checks(), left = mode === 'create' ? coolLeft() : 0;
    if (left > 0) return `${t('cooldown')} ${fmtClock(left)}`;
    const names = { file: kind === 'video' && draft.source === 'embed' ? t('checkEmbed') : t('checkFile'), title: t('checkTitle'), category: t('checkCategory'), slots: t('checkSlots', { n: slotCount() }), rating: t('rating'), rules: t('checkRules') };
    const miss = Object.entries(c).filter(([, v]) => v !== 'ok').map(([k, v]) => names[k] + (v === 'wait' ? ` (${t('fChecking')})` : ''));
    return miss.length ? t('notReady', { n: miss.join('、') }) : null;
  }
  function shakeNext() { nextBtn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 380, easing: 'ease-out' }); }
  function stepNext() {
    if (busy) return;
    if (nextBtn.disabled) { shakeNext(); const why = blockedReason(); if (why) toast(why, { error: true }); if (stepView && stepView.nudge) stepView.nudge(); return; }
    if (cur < order.length - 1 && order[cur] === 'content' && slotCount()) shakeNext();
    nextBtn.click();
  }
  function stepPrev() { if (!busy && cur > 0) go(cur - 1); }
  // 捕获阶段监听：简介编辑器自己绑了 ⌘↵（ProseMirror 的 exitCode），冒泡阶段根本收不到
  const onKey = (e) => {
    if (disposed || e.isComposing || e.keyCode === 229 || overlayOpen()) return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); e.shiftKey ? stepPrev() : stepNext(); return; }
    if (mod || e.altKey || e.shiftKey) return;
    if (typing(ui.root.activeElement) || typing(document.activeElement)) return; // 影子 DOM 里的输入框，或站点自己的搜索框
    if (e.key === 'ArrowRight') { e.preventDefault(); stepNext(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepPrev(); }
  };
  document.addEventListener('keydown', onKey, true);
  const onLeave = (e) => { if (!disposed && ((uploader && uploader.busy) || (images && images.busy) || (mode === 'edit' && dirty()))) { e.preventDefault(); e.returnValue = ''; } };
  addEventListener('beforeunload', onLeave);
  if (mode === 'create') svc.cooldown(kind).then((c) => { cooldown = c; cooldownAt = Date.now(); drawNav(); });

  host.replaceChildren(h('div.wrap', header, stepper, stage, navbar));
  go(0, true);

  function cleanup() {
    disposed = true;
    timers.forEach(clearInterval);
    offChange();
    document.removeEventListener('keydown', onKey, true);
    removeEventListener('beforeunload', onLeave);
    if (stepView && stepView.dispose) stepView.dispose();
    if (uploader && uploader.busy) uploader.reset();
    cleanup.extra && cleanup.extra();
  }
  cleanup.applyTemplate = applyTemplate;
  return cleanup;
}
