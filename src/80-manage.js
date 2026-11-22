// 内容管理：把表格换成带封面的卡片墙，带搜索、排序和合计。

STYLE.push(`
.wrap.wide{max-width:1180px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}
.stat{padding:16px 18px;border-radius:14px;border:1px solid var(--line);background:var(--card)}
.stat .v{font-size:28px;font-weight:600;letter-spacing:-.04em;line-height:1.2;overflow:hidden}
.stat .k{display:flex;align-items:center;gap:6px;color:var(--fg2);font-size:12.5px;font-weight:500}
.tools{display:flex;gap:10px;align-items:center;margin-bottom:16px}
.tools .field{height:36px;width:260px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.work2{position:relative;border-radius:14px;border:1px solid var(--line);background:var(--card);overflow:hidden;animation:rise .5s var(--ease) backwards;transition:transform .4s var(--ease),box-shadow .25s,border-color .2s,opacity .25s}
.work2:hover{transform:translateY(-3px);box-shadow:var(--shadow);border-color:var(--line2)}
.work2.gone{opacity:0;transform:scale(.9)}
.work2 .shot{position:relative;display:block;aspect-ratio:16/9;background:var(--sunk) center/cover}
.work2 .shot .ph{position:absolute;inset:0;display:grid;place-items:center;color:var(--fg3)}
.work2 .flags{position:absolute;left:8px;top:8px;display:flex;gap:4px}
.work2 .flag{display:grid;place-items:center;height:22px;min-width:22px;padding:0 6px;border-radius:6px;background:rgba(0,0,0,.66);color:#fff;font-size:11px;font-weight:700;backdrop-filter:blur(6px)}
.work2 .flag.r{background:var(--red)}
.work2 .dur{position:absolute;right:8px;bottom:8px;padding:1px 6px;border-radius:5px;background:rgba(0,0,0,.72);color:#fff;font-size:11px;font-weight:600}
.work2 .acts{position:absolute;right:8px;top:8px;display:flex;gap:4px;opacity:0;transform:translateY(-4px);transition:opacity .2s,transform .35s var(--ease)}
.work2:hover .acts,.work2 .acts:focus-within{opacity:1;transform:none}
.work2 .acts button{display:inline-flex;align-items:center;gap:5px;height:28px;min-width:28px;justify-content:center;padding:0 6px;border-radius:8px;border:0;background:rgba(0,0,0,.66);color:#fff;cursor:pointer;backdrop-filter:blur(6px);font-size:12px;font-weight:600;transition:background .15s,transform .2s var(--ease)}
.work2 .acts button:hover{background:rgba(0,0,0,.85)}
.work2 .acts button:active{transform:scale(.9)}
.work2 .acts button.sure{background:var(--red);padding:0 9px}
.work2 .info{padding:12px 14px}
.work2 .ttl{font-weight:600;font-size:14px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:39px;text-decoration:none;color:inherit}
.work2 .nums{display:flex;align-items:center;gap:12px;margin-top:10px;color:var(--fg2);font-size:12.5px}
.work2 .nums span{display:inline-flex;align-items:center;gap:4px}
.work2 .nums .when{margin-left:auto;color:var(--fg3)}
.empty{display:flex;flex-direction:column;align-items:center;gap:16px;padding:80px 0;color:var(--fg3)}
.sk2{border-radius:14px;aspect-ratio:1.18;background:linear-gradient(100deg,var(--sunk) 40%,var(--line) 50%,var(--sunk) 60%) 0/300% 100%;animation:shimmer 1.4s infinite linear}
`);

async function mountManage(host, { kind, app }) {
  let items = [], count = 0, page = 0, sort = store.get('manageSort', 'new'), query = '', disposed = false;
  const grid = h('div.grid', Array.from({ length: 8 }, () => h('div.sk2')));
  const statEls = { works: h('div.v', '–'), views: h('div.v', '–'), likes: h('div.v', '–') };
  const moreBox = h('div', { style: { display: 'flex', justifyContent: 'center', marginTop: '24px' } });
  const cool = h('span.pill.amber', { style: { display: 'none' }, data: { tip: t('cooldown') } }, icon('clock', 13), h('span.mono'));

  const SORTS = { new: ['sortNew', (a, b) => new Date(b.createdAt) - new Date(a.createdAt)], views: ['sortViews', (a, b) => b.numViews - a.numViews], likes: ['sortLikes', (a, b) => b.numLikes - a.numLikes] };
  const sortLabel = h('span', t(SORTS[sort][0]));
  const sortBtn = h('button.btn.sm', { type: 'button', onclick: () => menu(sortBtn, Object.keys(SORTS).map((k) => ({ label: t(SORTS[k][0]), icon: k === sort ? 'check' : null, onclick: () => { sort = k; store.set('manageSort', k); sortLabel.textContent = t(SORTS[k][0]); draw(); } }))) }, sortLabel, icon('chevronDown', 14));
  const search = h('input', { placeholder: t('searchWorks'), oninput: () => { query = search.value.trim().toLowerCase(); draw(); } });

  function card(it, i) {
    const src = kind === 'video' ? thumbUrl.video(it) : thumbUrl.file(it.thumbnail);
    const path = `/${kind}/${it.id}`;
    const del = h('button', { type: 'button', data: { tip: t('delete') }, onclick: async () => {
      if (!del.classList.contains('sure')) { del.classList.add('sure'); del.append(h('span', t('confirmDelete'))); delete del.dataset.tip; setTimeout(() => { del.classList.remove('sure'); del.lastChild.nodeType === 1 && del.querySelector('span') && del.querySelector('span').remove(); }, 3500); return; }
      el.classList.add('gone');
      try { await svc.remove(kind, it.id); items = items.filter((x) => x !== it); count--; setTimeout(() => { el.remove(); drawStats(); if (!items.length) draw(); }, 260); toast(t('deleted')); refreshCooldown(); }
      catch (e) { el.classList.remove('gone'); toast(e.text || e.message, { error: true }); }
    } }, icon('trash', 14));
    const el = h('div.work2', { style: { animationDelay: Math.min(i, 12) * 30 + 'ms' } },
      h('a.shot', { href: path, target: '_blank', rel: 'noopener', style: src ? { backgroundImage: `url(${src})` } : null },
        !src && h('div.ph', icon(kind === 'video' ? 'film' : 'picture', 28)),
        h('div.flags', it.rating === 'ecchi' && h('span.flag.r', '18+'), it.private && h('span.flag', { data: { tip: t('vPrivate') } }, icon('lock', 13)), it.unlisted && h('span.flag', { data: { tip: t('vUnlisted') } }, icon('eyeOff', 13)), it.status === 'processing' && h('span.flag', h('span.spin', { style: { width: '11px', height: '11px' } }))),
        kind === 'video' ? it.file && it.file.duration && h('span.dur.mono', fmtDuration(it.file.duration)) : it.numImages && h('span.dur.mono', String(it.numImages))),
      h('div.acts', h('button', { type: 'button', data: { tip: t('edit') }, onclick: () => app.go(`${path}/edit`) }, icon('pencil', 14)), del),
      h('div.info', h('a.ttl', { href: path, target: '_blank', rel: 'noopener' }, it.title),
        h('div.nums', h('span', { data: { tip: t('views') } }, icon('eye', 14), fmtCount(it.numViews)), h('span', { data: { tip: t('likes') } }, icon('heart', 14), fmtCount(it.numLikes)), h('span', { data: { tip: t('comments') } }, icon('chat', 14), fmtCount(it.numComments)), h('span.when', fmtDate(it.createdAt)))));
    return el;
  }
  function drawStats() {
    ticker(statEls.works, String(count));
    ticker(statEls.views, fmtCount(items.reduce((s, x) => s + (x.numViews || 0), 0)) + (items.length < count ? '+' : ''));
    ticker(statEls.likes, fmtCount(items.reduce((s, x) => s + (x.numLikes || 0), 0)) + (items.length < count ? '+' : ''));
  }
  function draw() {
    const list = items.filter((x) => !query || (x.title || '').toLowerCase().includes(query)).sort(SORTS[sort][1]);
    clear(grid);
    if (!list.length) {
      grid.style.display = 'block';
      grid.append(h('div.empty', icon(kind === 'video' ? 'film' : 'picture', 36), h('span', t(query ? 'noResult' : 'empty')), !query && btn(t(kind === 'video' ? 'publishVideo' : 'publishImage'), { kind: 'primary', icon: 'plus', onclick: () => app.go(`/create/${kind}`) })));
    } else { grid.style.display = ''; grid.append(...list.map(card)); }
    drawStats();
    clear(moreBox);
    if (items.length < count) moreBox.append(btn(`${items.length} / ${count}`, { icon: 'chevronDown', onclick: () => load(page + 1) }));
  }
  async function load(p) {
    try {
      const res = await svc.myContent(kind, p);
      if (disposed) return;
      page = p;
      count = res.count;
      items = p ? items.concat(res.results) : res.results;
      draw();
    } catch (e) { if (!disposed) clear(grid).append(h('div.empty', icon('warn', 28), e.text || e.message, btn(t('retry'), { onclick: () => load(p) }))); }
  }
  let coolTimer = null;
  async function refreshCooldown() {
    const c = await svc.cooldown(kind);
    if (disposed) return;
    const at = Date.now();
    clearInterval(coolTimer);
    const tick = () => { const left = c.limited ? c.remaining - (Date.now() - at) / 1000 : 0; cool.style.display = left > 0 ? '' : 'none'; cool.lastChild.textContent = fmtClock(left); };
    tick();
    coolTimer = setInterval(tick, 1000);
  }

  const moreBtn = ibtn('more', '', () => app.menu(moreBtn));
  const seg = segmented([{ value: 'video', label: t('video'), icon: 'film' }, { value: 'image', label: t('image'), icon: 'picture' }], kind, (v) => app.go(`/account/content/${v}s`));
  host.replaceChildren(h('div.wrap.wide',
    h('div.top', h('h1', t('manage')), seg, btn(t('posts'), { kind: 'ghost', sm: true, onclick: () => app.go('/account/content/posts') }), btn(t('polls'), { kind: 'ghost', sm: true, onclick: () => app.go('/account/content/polls') }), h('span.sp'), cool,
      btn(t(kind === 'video' ? 'publishVideo' : 'publishImage'), { kind: 'primary', icon: 'plus', onclick: () => app.go(`/create/${kind}`) }), moreBtn),
    h('div.stats.stagger', h('div.stat', h('div.k', icon('layers', 14), t('works')), statEls.works), h('div.stat', h('div.k', icon('eye', 14), t('views')), statEls.views), h('div.stat', h('div.k', icon('heart', 14), t('likes')), statEls.likes)),
    h('div.tools', h('div.field', icon('search'), search), h('span.grow'), sortBtn),
    grid, moreBox));
  load(0);
  refreshCooldown();
  return () => { disposed = true; clearInterval(coolTimer); };
}
