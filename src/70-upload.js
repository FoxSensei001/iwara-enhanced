// 第一步：上传。视频一选中就开始传，用户可以直接去填后面的步骤，不用等。

// 格式 / 大小限制都取自站点规则（25-siterules.js）；读不到时不在本地拦，交给服务端。
const fileExt = (name) => ((name || '').match(/\.[^.]+$/) || [''])[0].toLowerCase();
const imageTypeOk = (f) => { const r = siteRules.image(); if (!r || !r.exts.length) return true; const e = fileExt(f.name); return r.exts.includes(e) || (e === '.jpeg' && r.exts.includes('.jpg')); };
const imageSizeOk = (f) => { const r = siteRules.image(); return !r || !r.sizeMB || f.size <= r.sizeMB * MB; };
/**
 * 本地图片预览地址。站点 CSP 的 img-src 不放行 blob:（<img> 和 CSS 背景都会被拦，<video> 不受影响），只能用 data:；
 * 先缩到 max 再转 JPEG，免得十几 MB 的原图整份塞进 DOM。解不了码（webm 等）返回 null。
 */
async function previewDataUrl(file, max = 640) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    return c.toDataURL('image/jpeg', 0.85);
  } catch { return null; }
}
/** 封面只收静态图：从图库允许的扩展名里去掉视频 / 动图格式。 */
const coverAccept = () => { const r = siteRules.image(); const ex = r && r.exts.length ? r.exts.filter((e) => !['.webm', '.mp4', '.gif'].includes(e)) : []; return ex.length ? [...ex, ex.includes('.jpg') ? '.jpeg' : null].filter(Boolean).join(',') : 'image/jpeg,image/png,image/webp'; };
const imageAccept = () => { const r = siteRules.image(); return r && r.exts.length ? [...r.exts, r.exts.includes('.jpg') ? '.jpeg' : null].filter(Boolean).join(',') : 'image/*,video/webm'; };
const videoAccept = () => { const r = siteRules.video(); return r && r.containers.length ? r.containers.join(',') : 'video/*'; };

function probeVideo(file) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    const url = URL.createObjectURL(file);
    v.preload = 'metadata';
    v.muted = true;
    v.onloadedmetadata = () => resolve({ url, duration: v.duration, width: v.videoWidth, height: v.videoHeight });
    v.onerror = () => resolve({ url, duration: 0, width: 0, height: 0, broken: true });
    v.src = url;
  });
}
/** 从 MP4 头尾各读一段，找编码标识（moov 可能在开头也可能在末尾）。只做提示用，读不到就返回 null。 */
async function detectCodecs(file) {
  try {
    const n = 4 * MB;
    const parts = [file.slice(0, n), file.size > n ? file.slice(Math.max(n, file.size - n)) : null].filter(Boolean);
    const text = (await Promise.all(parts.map((b) => b.arrayBuffer()))).map((buf) => new TextDecoder('latin1').decode(new Uint8Array(buf))).join('');
    const pick = (list) => { for (const [tag, name] of list) if (text.includes(tag)) return name; return null; };
    return {
      video: pick([['avc1', 'H.264'], ['avc3', 'H.264'], ['hvc1', 'H.265'], ['hev1', 'H.265'], ['av01', 'AV1'], ['vp09', 'VP9'], ['mp4v', 'MPEG-4']]),
      audio: pick([['mp4a', 'AAC'], ['Opus', 'Opus'], ['ac-3', 'AC-3'], ['ec-3', 'E-AC-3'], ['fLaC', 'FLAC'], ['.mp3', 'MP3']]),
    };
  } catch { return null; }
}
/** 实际播一小段数帧数，估帧率；浏览器不支持或放不出来就返回 null。 */
function measureFps(url) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    if (!('requestVideoFrameCallback' in v)) return resolve(null);
    v.muted = true; v.playsInline = true; v.src = url;
    const times = [];
    const done = (val) => { v.pause(); v.removeAttribute('src'); v.load(); resolve(val); };
    const tick = (_, m) => {
      times.push(m.mediaTime);
      if (times.length >= 24) {
        const d = times.slice(1).map((x, i) => x - times[i]).filter((x) => x > 0).sort((a, b) => a - b);
        const med = d[Math.floor(d.length / 2)];
        return done(med ? Math.round(1 / med) : null);
      }
      v.requestVideoFrameCallback(tick);
    };
    v.requestVideoFrameCallback(tick);
    v.play().catch(() => done(null));
    setTimeout(() => done(null), 4000);
  });
}

/** 从本地文件里均匀截 n 帧，给封面选择和预览卡在服务端缩略图出来之前用。 */
async function captureFrames(url, duration, n = 16) {
  const v = document.createElement('video');
  v.muted = true;
  v.src = url;
  await new Promise((r) => { v.onloadeddata = r; v.onerror = r; });
  if (!v.videoWidth) return [];
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = Math.round((320 * v.videoHeight) / v.videoWidth);
  const ctx = c.getContext('2d');
  const out = [];
  for (let i = 0; i < n; i++) {
    v.currentTime = (duration * (i + 0.5)) / n;
    await new Promise((r) => { v.onseeked = r; setTimeout(r, 1500); });
    try { ctx.drawImage(v, 0, 0, c.width, c.height); out.push(c.toDataURL('image/jpeg', 0.7)); } catch { break; }
  }
  return out;
}

STYLE.push(`
.drop{position:relative;display:grid;place-items:center;min-height:320px;border-radius:16px;border:1.5px dashed var(--line2);background:var(--card);cursor:pointer;overflow:hidden;
  transition:border-color .2s,background .2s,transform .5s var(--spring)}
.drop:hover{border-color:var(--fg3)}
.drop.over{border-color:var(--fg);border-style:solid;transform:scale(1.012);background:var(--sunk)}
.drop.bad{animation:shake .4s}
.drop .hint{display:flex;flex-direction:column;align-items:center;gap:14px;font-weight:500;font-size:15px}
.drop .orb{width:56px;height:56px;border-radius:16px;display:grid;place-items:center;border:1px solid var(--line);background:var(--bg);box-shadow:0 1px 2px rgba(0,0,0,.05);animation:float 3.2s ease-in-out infinite}
.drop.over .orb{animation:none;transform:translateY(-6px) scale(1.1);transition:transform .4s var(--spring)}
@keyframes float{50%{transform:translateY(-5px)}}
.specs{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.spec{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px;border-radius:999px;border:1px solid var(--line);font-size:12px;color:var(--fg2);font-weight:500;transition:all .25s}
.spec.ok{color:var(--green);border-color:color-mix(in srgb,var(--green) 40%,transparent)}
.spec.no{color:var(--red);border-color:var(--red);background:color-mix(in srgb,var(--red) 8%,transparent)}
.stagebox{position:relative;border-radius:16px;overflow:hidden;background:#000;border:1px solid var(--line);animation:rise .5s var(--ease)}
.stagebox video,.stagebox img.poster{display:block;width:100%;max-height:380px;aspect-ratio:16/9;object-fit:contain;background:#000}
.upbar{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);margin-top:12px}
.upbar .name{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.upbar .meta{color:var(--fg3);font-size:12.5px;white-space:nowrap}
.ring{position:relative;width:34px;height:34px;flex:none}
.ring>svg{transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:3;stroke:var(--line)}
.ring circle.v{stroke:var(--fg);stroke-linecap:round;transition:stroke-dashoffset .35s var(--ease),stroke .3s}
.ring.spin2>svg{animation:spin 1.1s linear infinite}
.ring.done circle.v{stroke:var(--green)}
.ring.err circle.v{stroke:var(--red)}
.ring .mid{position:absolute;inset:0;display:grid;place-items:center;font-size:10px;font-weight:600}
.ring.done .mid{color:var(--green);animation:pop .45s var(--spring)}
.srcsw{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:12px}
.imgc{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:var(--sunk) center/cover;cursor:grab;animation:pop .4s var(--spring);transition:transform .3s var(--ease),opacity .2s,box-shadow .2s}
.imgc.drag{opacity:.35}
.imgc.target{box-shadow:0 0 0 2px var(--fg);transform:scale(.96)}
.imgc .no{position:absolute;left:8px;top:8px;min-width:22px;height:22px;padding:0 6px;border-radius:7px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:600;display:grid;place-items:center;backdrop-filter:blur(6px)}
.imgc .rm{position:absolute;right:6px;top:6px;width:26px;height:26px;border-radius:8px;border:0;background:rgba(0,0,0,.6);color:#fff;display:grid;place-items:center;cursor:pointer;opacity:0;transition:opacity .15s;backdrop-filter:blur(6px)}
.imgc:hover .rm{opacity:1}
.imgc .veil{position:absolute;inset:0;background:rgba(0,0,0,.5);display:grid;place-items:center;color:#fff;transition:opacity .3s}
.imgc .veil i{position:absolute;left:0;bottom:0;height:3px;background:#fff;transition:width .2s}
.imgc.err{border-color:var(--red)}
.drop.slim{min-height:88px}.drop.slim .hint{flex-direction:row;flex-wrap:wrap;justify-content:center;gap:12px;padding:16px}
.drop.slim .orb{width:40px;height:40px;border-radius:12px}
`);

function progressRing() {
  const C = 2 * Math.PI * 14;
  const el = h('div.ring');
  el.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14"/><circle class="v" cx="17" cy="17" r="14" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
  const mid = h('div.mid.mono');
  el.append(mid);
  const v = el.querySelector('.v');
  return {
    el,
    set(state, p = 0) {
      el.className = 'ring' + (state === 'spin' ? ' spin2' : state === 'done' ? ' done' : state === 'err' ? ' err' : '');
      v.style.strokeDashoffset = C * (1 - (state === 'spin' ? 0.28 : state === 'done' || state === 'err' ? 1 : p));
      clear(mid);
      if (state === 'done') mid.append(icon('check', 16));
      else if (state === 'err') mid.append(icon('x', 14));
      else if (state === 'progress') mid.textContent = Math.round(p * 100);
    },
  };
}

/**
 * 视频上传控制器：负责校验、上传、等服务端处理，状态变化时通知界面。
 * state: { phase: idle|uploading|waiting|active|done|error, progress, loaded, elapsed, error, name, size, localUrl, meta, frames }
 */
/** YouTube 链接 → 视频 id。带不带 https://、www / m / music、watch?v= / youtu.be / shorts / embed / live 都认；认不出返回 null。 */
function youtubeId(input) {
  let s = String(input || '').trim();
  if (!s) return null;
  if (!/^[a-z]+:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { return null; }
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, '');
  const ok = (id) => (/^[\w-]{11}$/.test(id || '') ? id : null);
  if (host === 'youtu.be') return ok(u.pathname.split('/')[1]);
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null;
  if (u.searchParams.get('v')) return ok(u.searchParams.get('v'));
  const [, a, b] = u.pathname.split('/');
  return ['shorts', 'embed', 'live', 'v'].includes(a) ? ok(b) : null;
}
/** 提交给站点用的写法：站点只认 www.youtube.com / youtu.be，缩略图也按 ?v= 取 id。 */
const youtubeUrl = (id) => 'https://www.youtube.com/watch?v=' + id;

function videoUploader(draft, notify) {
  const state = { phase: draft.file ? 'done' : 'idle', progress: 0, frames: [] };
  let job = null, token = 0;
  const set = (patch) => { Object.assign(state, patch); notify(state); };

  async function check(file) {
    const meta = await probeVideo(file);
    const fails = [];
    const R = siteRules.video();
    if (R && R.containers.length && !R.containers.includes(fileExt(file.name))) fails.push('type');
    if (!meta.broken && R) {
      if (!svc.isStaff && R.minDur && meta.duration < R.minDur) fails.push('duration');
      if (R.minW && R.minH && meta.width * meta.height < R.minW * R.minH) fails.push('resolution');
    }
    if (svc.sizeLimit && file.size > svc.sizeLimit) fails.push('size');
    return { meta, fails };
  }

  async function start(file) {
    const my = ++token;
    if (job) job.abort();
    const { meta, fails } = await check(file);
    if (fails.length) { URL.revokeObjectURL(meta.url); set({ probe: { name: file.name, size: file.size, meta, fails } }); detectCodecs(file).then((codec) => { if (my === token && state.probe) set({ probe: { ...state.probe, meta: { ...meta, codec } } }); }); return fails; }
    draft.file = null;
    draft.fileName = file.name;
    set({ phase: 'uploading', progress: 0, loaded: 0, error: null, name: file.name, size: file.size, localUrl: meta.url, meta, frames: [], probe: null });
    // 编码、帧率只用来提示会不会被重新编码，不挡上传
    detectCodecs(file).then((codec) => { if (my === token) set({ meta: { ...state.meta, codec } }); });
    measureFps(meta.url).then((fps) => { if (my === token) set({ meta: { ...state.meta, fps } }); });
    captureFrames(meta.url, meta.duration).then((frames) => { if (my === token) set({ frames }); });
    try {
      job = svc.uploadVideo(file, (p, loaded) => my === token && set({ progress: p, loaded }));
      const { id, key } = await job.promise;
      if (my !== token) return [];
      set({ phase: 'waiting', elapsed: 0 });
      const data = await svc.waitProcessed(id, key, (s) => my === token && set({ phase: s.status === 'active' ? 'active' : 'waiting', elapsed: s.elapsed }), () => my !== token);
      if (my !== token || !data) return [];
      draft.file = data;
      set({ phase: 'done' });
    } catch (e) {
      if (my !== token || e.status === -1) return [];
      // 上传失败体：{ message, reason:'fileTooLarge'|'invalidMime'|'unknown' } 或校验错 { errors:[{ field:'file.mimetype' }] }
      const d = e.data || {}, f0 = (d.errors || [])[0];
      const reason = d.reason === 'invalidMime' || (f0 && f0.field === 'file.mimetype') ? 'errType' : d.reason === 'fileTooLarge' ? 'srv_fileTooLarge' : e.status === 0 ? 'errNetwork' : e.status === 422 ? 'errProcess' : e.status === 401 ? 'errLogin' : 'errUpload';
      const other = f0 && f0.field !== 'file.mimetype';
      set({ phase: 'error', error: reason, errorText: other ? e.text : null, retry: () => start(file) });
    }
    return [];
  }
  function reset() { token++; if (job) job.abort(); draft.file = null; draft.fileName = null; set({ phase: 'idle', progress: 0, localUrl: null, frames: [], error: null, probe: null, meta: null, size: 0 }); }
  return { state, start, reset, get busy() { return ['uploading', 'waiting', 'active'].includes(state.phase); } };
}

/** 图片上传控制器：多张并行上传，支持排序和移除。items: [{key, url, file(服务端文件对象), progress, error}] */
function imageUploader(draft, notify) {
  const items = (draft.files || []).map((f) => ({ key: f.id, url: thumbUrl.file(f), file: f, progress: 1 }));
  const sync = () => { draft.files = items.filter((x) => x.file).map((x) => x.file); notify(); };
  function add(fileList) {
    const bad = [];
    for (const file of fileList) {
      if (!imageTypeOk(file)) { bad.push('errImgType'); continue; }
      if (!imageSizeOk(file)) { bad.push('errImgSize'); continue; }
      if (items.length >= 100) break;
      const item = { key: uid(), url: null, name: file.name, size: file.size, mime: file.type, progress: 0 };
      items.push(item);
      if (file.type.startsWith('image')) previewDataUrl(file).then((u) => { if (u && items.includes(item)) { item.url = u; notify(item); } });
      const job = svc.uploadImage(file, (p) => { item.progress = p; notify(item); });
      item.abort = job.abort;
      job.promise.then((res) => { item.file = res.id && res.name ? res : { id: res.id, type: 'image', name: file.name, mime: file.type, size: file.size }; item.progress = 1; sync(); }, (e) => { if (e.status !== -1) { item.error = true; item.errorText = e.text; notify(); } });
    }
    notify();
    return bad;
  }
  function remove(item) { item.abort && !item.file && item.abort(); items.splice(items.indexOf(item), 1); sync(); }
  function move(from, to) { const [it] = items.splice(from, 1); items.splice(to, 0, it); sync(); }
  return { items, add, remove, move, get busy() { return items.some((x) => !x.file && !x.error); } };
}

function dropzone({ accept, multiple, label, specs, onFiles, slim }) {
  const input = h('input', { type: 'file', accept, multiple, style: { display: 'none' }, onchange: () => { if (input.files.length) onFiles([...input.files]); input.value = ''; } });
  const text = h('span', label);
  const specEls = {};
  const el = h('div.drop' + (slim ? '.slim' : ''), { tabIndex: 0, role: 'button', onclick: () => input.click(), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } } },
    h('div.hint', h('div.orb', icon('upload', slim ? 18 : 24)), text, specs && h('div.specs', specs.map(([key, lbl]) => (specEls[key] = h('span.spec', lbl))))), input);
  let depth = 0;
  el.addEventListener('dragenter', (e) => { e.preventDefault(); depth++; el.classList.add('over'); text.textContent = t('dropHere'); });
  el.addEventListener('dragover', (e) => e.preventDefault());
  el.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; el.classList.remove('over'); text.textContent = label; } });
  el.addEventListener('drop', (e) => { e.preventDefault(); depth = 0; el.classList.remove('over'); text.textContent = label; const files = [...e.dataTransfer.files]; if (files.length) onFiles(multiple ? files : files.slice(0, 1)); });
  el.flag = (fails) => {
    for (const k in specEls) specEls[k].className = 'spec' + (fails.includes(k) ? ' no' : '');
    if (fails.length) { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
  };
  el.pick = () => input.click();
  return el;
}

function uploadStepVideo(ctx) {
  const { draft, uploader } = ctx;
  const box = h('div');
  const ring = progressRing();
  const statusName = h('div.name'), statusMeta = h('div.meta.mono');
  const specs = null;
  const panel = checkPanel();
  const facts = (s) => {
    if (s.probe) return { size: s.probe.size, ...s.probe.meta, fails: s.probe.fails };
    if (s.meta && s.size) return { size: s.size, ...s.meta };
    const f = draft.file;
    return f ? { size: f.size, width: f.width, height: f.height, duration: f.duration, codec: null } : null;
  };
  const onFiles = async ([file]) => { const fails = await uploader.start(file); if (fails.length) { ensureZone(); zone.flag(fails); } };
  let zone = null, stage = null, mode = null;
  const ensureZone = () => { if (mode === 'zone') return; mode = 'zone'; zone = dropzone({ accept: videoAccept(), label: t('dropVideo'), specs, onFiles }); clear(box).append(zone); };
  const drawPanel = (s) => { panel.el.style.display = draft.source === 'embed' ? 'none' : ''; if (draft.source !== 'embed') panel.update(videoCheckRows(facts(s))); };
  const embedIn = h('input', { value: draft.embedUrl || '', placeholder: t('embedPh'), spellcheck: false, oninput: () => { draft.embedUrl = embedIn.value.trim(); drawEmbed(); ctx.changed(); } });
  const embedPrev = h('div');
  const embedNote = h('div.note', { style: { marginTop: '8px' } });
  let shownId = null;
  const drawEmbed = () => {
    const id = youtubeId(draft.embedUrl);
    const bad = !!draft.embedUrl && !id;
    clear(embedNote).append(icon(bad ? 'warn' : 'link', 14), h('span', bad ? t('embedBad') : siteRules.text('videoForm.embedUrlDescription') || t('embedPh')));
    embedNote.style.color = bad ? 'var(--red)' : '';
    if (id === shownId) return;
    shownId = id;
    clear(embedPrev);
    if (id) embedPrev.append(h('div.stagebox', { style: { marginTop: '12px' } }, h('img.poster', { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, referrerPolicy: 'no-referrer' })));
  };

  function draw(s) {
    drawPanel(s);
    if (draft.source === 'embed') {
      if (mode !== 'embed') { mode = 'embed'; clear(box).append(h('div.field', { style: { height: '48px' } }, icon('link'), embedIn), embedNote, embedPrev); drawEmbed(); setTimeout(() => embedIn.focus(), 60); }
      return;
    }
    if (s.phase === 'idle') return ensureZone();
    if (mode !== 'stage') {
      mode = 'stage';
      const media = s.localUrl ? h('video', { src: s.localUrl, controls: true, muted: true, playsInline: true, preload: 'metadata' })
        : h('img.poster', { src: thumbUrl.video(draft, draft.thumbnail) || '', referrerPolicy: 'no-referrer' });
      stage = h('div.stagebox', media);
      const pick = h('input', { type: 'file', accept: videoAccept(), style: { display: 'none' }, onchange: () => pick.files[0] && onFiles([pick.files[0]]) });
      clear(box).append(stage, h('div.upbar', ring.el, h('div.grow', statusName, statusMeta), pick,
        btn(t('replace'), { sm: true, icon: 'swap', onclick: () => pick.click() }), ibtn('trash', t('remove'), () => uploader.reset())));
    }
    statusName.textContent = s.name || draft.fileName || (draft.file && draft.file.name) || '';
    const f = draft.file;
    if (s.phase === 'uploading') { ring.set('progress', s.progress); statusMeta.textContent = `${t('uploading')} · ${fmtSize(s.loaded || 0)} / ${fmtSize(s.size)}`; }
    else if (s.phase === 'waiting') { ring.set('spin'); statusMeta.textContent = `${t('queued')} · ${fmtClock(s.elapsed || 0)}`; }
    else if (s.phase === 'active') { ring.set('spin'); statusMeta.textContent = `${t('processing')} · ${fmtClock(s.elapsed || 0)}`; }
    else if (s.phase === 'done') { ring.set('done'); statusMeta.textContent = f ? [f.width && `${f.width}×${f.height}`, f.duration && fmtDuration(f.duration), f.size && fmtSize(f.size)].filter(Boolean).join(' · ') : t('ready'); }
    else if (s.phase === 'error') { ring.set('err'); clear(statusMeta).append(s.errorText || t(s.error), ' · ', h('a', { href: '#', style: { color: 'var(--fg)' }, onclick: (e) => { e.preventDefault(); s.retry(); } }, t('retry'))); }
  }
  const off = ctx.bus.on('upload', draw);
  const source = ctx.mode === 'create' && segmented([{ value: 'file', label: t('file'), icon: 'upload' }, { value: 'embed', label: t('embed'), icon: 'link' }], draft.source, (v) => { draft.source = v; mode = null; draw(uploader.state); ctx.changed(); });
  draw(uploader.state);
  return { el: h('div', source && h('div.srcsw', source, ctx.cooldownChip()), box, panel.el, creatorLinks()), dispose: off };
}

function uploadStepImage(ctx) {
  const { images } = ctx;
  const grid = h('div.imgs');
  const zoneBox = h('div');
  const cells = new Map();
  let dragging = null, slim = null;
  function draw(changed) {
    // 快路径只更新进度；预览图刚生成（url 变了）要走下面的完整绘制去换图
    if (changed && cells.has(changed.key) && cells.get(changed.key).url === (changed.url || null)) { const c = cells.get(changed.key); c.bar.style.width = changed.progress * 100 + '%'; return; }
    const wantSlim = images.items.length > 0;
    if (wantSlim !== slim) {
      slim = wantSlim;
      const zone = dropzone({ accept: imageAccept(), multiple: true, slim, label: t('dropImage'), onFiles: (files) => {
        rejected = files.filter((f) => !imageTypeOk(f) || !imageSizeOk(f)).map((f) => ({ name: f.name, type: !imageTypeOk(f) }));
        const bad = images.add(files);
        if (bad.length) { zone.flag([]); toast(t(bad[0]), { error: true }); }
        drawPanel();
      } });
      clear(zoneBox).append(zone);
    }
    for (const [key, c] of cells) if (!images.items.some((x) => x.key === key)) { c.el.remove(); cells.delete(key); }
    images.items.forEach((item, i) => {
      let c = cells.get(item.key);
      if (!c) {
        const bar = h('i');
        const veil = h('div.veil', h('div.spin'), bar);
        const no = h('span.no.mono');
        const ph = h('div.veil', { style: { background: 'none', color: 'var(--fg3)' } }, icon('film', 28));
        const el = h('div.imgc', { draggable: true }, ph, no, veil,
          h('button.rm', { type: 'button', onclick: () => images.remove(item) }, icon('x', 14)));
        el.addEventListener('dragstart', (e) => { dragging = item; el.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; });
        el.addEventListener('dragend', () => { dragging = null; el.classList.remove('drag'); grid.querySelectorAll('.target').forEach((x) => x.classList.remove('target')); });
        el.addEventListener('dragover', (e) => { if (dragging && dragging !== item) { e.preventDefault(); el.classList.add('target'); } });
        el.addEventListener('dragleave', () => el.classList.remove('target'));
        el.addEventListener('drop', (e) => { e.preventDefault(); if (dragging && dragging !== item) flip(() => images.move(images.items.indexOf(dragging), images.items.indexOf(item))); });
        c = { el, bar, veil, no, ph, url: null };
        cells.set(item.key, c);
      }
      // 预览图是异步生成的（见 previewDataUrl），格子先建好，图到了再换上
      if (item.url && c.url !== item.url) { c.url = item.url; c.el.style.backgroundImage = `url(${item.url})`; c.ph.remove(); }
      c.no.textContent = i + 1;
      c.bar.style.width = item.progress * 100 + '%';
      c.veil.style.opacity = item.file ? 0 : 1;
      c.veil.style.pointerEvents = 'none';
      c.el.classList.toggle('err', !!item.error);
      c.el.title = item.error ? t('errUpload') + (item.errorText ? (env.lang === 'zh' ? '：' : ': ') + item.errorText : '') : '';
      if (item.error) clear(c.veil).append(icon('warn', 22));
      if (grid.children[i] !== c.el) grid.insertBefore(c.el, grid.children[i] || null);
    });
  }
  /** 排序时让其余格子滑到新位置。 */
  function flip(mutate) {
    const before = new Map([...cells].map(([k, c]) => [k, c.el.getBoundingClientRect()]));
    mutate();
    for (const [k, c] of cells) {
      const a = before.get(k), b = c.el.getBoundingClientRect();
      if (a && (a.left !== b.left || a.top !== b.top)) c.el.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
  // 检查面板：每张的格式、最大一张的大小、被拒的文件
  const panel = checkPanel();
  let rejected = [];
  const ext = (it) => (it.mime || (it.file && it.file.mime) || '').split('/')[1] || (it.name || '').split('.').pop();
  const imgFmtHint = () => { const r = siteRules.image(); return r ? r.exts.map((x) => x.replace('.', '').toUpperCase()).join(' · ') : ''; };
  const imgSizeHint = () => { const r = siteRules.image(); return r && r.sizeMB ? t('fImgSize', { n: r.sizeMB }) : ''; };
  function drawPanel() {
    const items = images.items.filter((x) => !x.error);
    const has = items.length > 0;
    const counts = {};
    for (const it of items) { const e = String(ext(it) || '?').replace('jpeg', 'jpg').toUpperCase(); counts[e] = (counts[e] || 0) + 1; }
    const sizes = items.map((it) => (it.file && it.file.size) || it.size || 0);
    const biggest = Math.max(0, ...sizes);
    const badType = rejected.filter((x) => x.type), badSize = rejected.filter((x) => !x.type);
    panel.update([
      { key: 'fmt', icon: 'picture', label: t('fFormat'), value: has ? Object.entries(counts).map(([k, n]) => `${k} ×${n}`).join(' · ') : null, hint: imgFmtHint() + (badType.length ? ' — ' + t('fRejected', { n: badType.length }) + badType.map((x) => x.name).join('、') : ''), status: badType.length ? 'no' : has ? 'ok' : null },
      { key: 'size', icon: 'file', label: t('fSize'), value: has && biggest ? t('fBiggest', { n: fmtSize(biggest) }) : null, hint: imgSizeHint() + (badSize.length ? ' — ' + t('fRejected', { n: badSize.length }) + badSize.map((x) => x.name).join('、') : ''), status: badSize.length ? 'no' : has ? 'ok' : null },
      { key: 'count', icon: 'layers', label: t('fCount'), value: has ? String(items.length) : null, hint: t('fImgOrder'), status: null },
    ]);
  }
  const off = ctx.bus.on('images', (it) => { draw(it); if (!it) drawPanel(); });
  draw();
  drawPanel();
  return { el: h('div', ctx.mode === 'create' && h('div.srcsw', h('span', { style: { flex: 1 } }), ctx.cooldownChip()), zoneBox, grid, panel.el, creatorLinks()), dispose: off };
}


// ── 文件检查面板：上传前列出每条要求，选了文件后逐条对上实际值 ──────────────
// 规则抄自原版发布页「创作者须知」：编码不符或码率超限不会被拒，但会被 Iwara 重新编码（琥珀色）；硬性要求不符（红色）。
const LINK_ICON = { faq: 'chat', compression: 'film', tutorial: 'bookmark' };
STYLE.push(`
.fchk{margin-top:14px;border:1px solid var(--line);border-radius:14px;background:var(--card);overflow:hidden}
.fchk .fr{display:grid;grid-template-columns:30px 76px minmax(0,1fr) auto;align-items:center;gap:10px;min-height:46px;padding:8px 14px;border-top:1px solid var(--line)}
.fchk .fr:first-child{border-top:0}
.fchk .fi{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--sunk);color:var(--fg2);transition:background .3s,color .3s}
.fchk .fl{font-size:13px;font-weight:500}
.fchk .fv{display:flex;flex-direction:column;min-width:0}
.fchk .fv b{font-weight:600;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fchk .fv small{font-size:12px;color:var(--fg3);line-height:1.45}
.fchk .fs{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap;animation:pop .4s var(--spring)}
.fchk .fr.ok .fi{background:color-mix(in srgb,var(--green) 12%,transparent);color:var(--green)}
.fchk .fr.ok .fs{color:var(--green);background:color-mix(in srgb,var(--green) 10%,transparent)}
.fchk .fr.warn .fi{background:color-mix(in srgb,var(--amber) 14%,transparent);color:var(--amber)}
.fchk .fr.warn .fs{color:var(--amber);background:color-mix(in srgb,var(--amber) 12%,transparent)}
.fchk .fr.no .fi{background:color-mix(in srgb,var(--red) 12%,transparent);color:var(--red)}
.fchk .fr.no .fs{color:var(--red);background:color-mix(in srgb,var(--red) 10%,transparent)}
.fchk .fr.wait .fs{color:var(--fg3)}
.fchk .fr.wait .fs .spin{width:11px;height:11px}
.fchk .more{justify-self:start;cursor:help;text-decoration:underline dotted;text-underline-offset:3px}
.btable{width:100%;border-collapse:collapse;font-size:12.5px}
.btable th,.btable td{padding:5px 12px;text-align:right;white-space:nowrap}
.btable th{font-weight:600;color:var(--fg3);font-size:11.5px}
.btable td:first-child,.btable th:first-child{text-align:left;font-weight:600}
.btable tr.cur td{background:color-mix(in srgb,var(--amber) 12%,transparent)}
.btable tr+tr td{border-top:1px solid var(--line)}
.clinks{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:12px}
.clinks .label{margin-right:4px}
.clinks a{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;color:var(--fg2);font-size:12.5px;font-weight:500;text-decoration:none;transition:background .15s,color .15s}
.clinks a:hover{background:var(--sunk);color:var(--fg)}
.clinks a .ic{color:var(--fg3)}
`);

/** 创作者链接：地址和文案都取自站点（发布页代码块里的链接 + 对应语言的文案）。 */
function creatorLinks() {
  const links = siteRules.links();
  if (!links.length) return null;
  return h('div.clinks', h('span.label', siteRules.text('videoForm.creatorInformation.creatorLinks') || t('creatorLinks')),
    links.map(({ href, key }) => h('a', { href, target: '_blank', rel: 'noopener' }, icon(LINK_ICON[key.split('.').pop()] || 'external', 14), siteRules.text(key) || key.split('.').pop(), icon('external', 12))));
}

/** rows: [{ key, icon, label, value?, hint, status? ('ok'|'warn'|'no'|'wait'), statusText?, more? }]，按 key 原地更新，不整块重建。 */
function checkPanel() {
  const el = h('div.fchk');
  const rows = new Map();
  function update(list) {
    const keep = new Set(list.map((r) => r.key));
    for (const [k, r] of rows) if (!keep.has(k)) { r.el.remove(); rows.delete(k); }
    list.forEach((r, i) => {
      let row = rows.get(r.key);
      if (!row) {
        row = { el: h('div.fr'), sig: '' };
        rows.set(r.key, row);
      }
      if (el.children[i] !== row.el) el.insertBefore(row.el, el.children[i] || null);
      const sig = JSON.stringify([r.status, r.value, r.hint, r.statusText]);
      if (sig === row.sig) return;
      row.sig = sig;
      row.el.className = 'fr' + (r.status ? '.' + r.status : '').replace('.', ' ');
      const hint = h('small', r.hint);
      if (r.more) { hint.classList.add('more'); hoverPanel(hint, r.more); }
      // 还在测（码率、编码）：值和结论都先摆骨架
      const waiting = r.status === 'wait';
      const badge = waiting ? h('span.fs', { 'aria-label': t('fChecking') }, skel(58, 18, 999)) : r.status && h('span.fs', icon(r.status === 'ok' ? 'check' : 'warn', 12), r.statusText || t(r.status === 'ok' ? 'fOk' : r.status === 'warn' ? 'fReencode' : r.status === 'no' ? 'fBad' : 'fChecking'));
      add(clear(row.el), [h('span.fi', icon(r.icon, 16)), h('span.fl', r.label), h('div.fv', waiting && !r.value ? skel(96, 12) : r.value && h('b', r.value), hint), badge || h('span')]);
    });
  }
  return { el, update };
}

function bitrateTable(B, tier) {
  return () => h('div', { style: { width: '300px', padding: '2px' } }, h('table.btable', h('tr', h('th', ''), B.fps.map((f) => h('th', f + ' FPS'))),
    B.rows.map(([p, ...caps]) => h('tr' + (p === tier ? '.cur' : ''), h('td', p + 'p'), caps.map((c) => h('td.mono', c))))),
    siteRules.text('videoForm.creatorInformation.bitrate.over') && h('div', { style: { padding: '8px 12px 4px', fontSize: '12px', lineHeight: '1.55', color: 'var(--fg3)' } }, siteRules.text('videoForm.creatorInformation.bitrate.over')));
}

/** 视频要求 + 实际值。规则全部取自站点（siteRules）；某条规则读不到，那一行只显示实际值、不判状态。
 *  facts: { size, width, height, duration, codec:{video,audio}, fps, fails:[] } 或 null（还没选文件）。 */
function videoCheckRows(facts) {
  const f = facts || {};
  const has = !!facts, fails = f.fails || [];
  const R = siteRules.video() || {}, B = siteRules.bitrate();
  const st = (rule, bad, warn, unknown) => (!has || !rule ? null : bad ? 'no' : unknown ? 'wait' : warn ? 'warn' : 'ok');
  // 码率：按短边落到哪一档；帧率测出来就取不超过它的那一列，测不出来就看是否落在最低列和最高列之间
  const short = Math.min(f.width || 0, f.height || 0);
  const row = B && (B.rows.find(([p]) => short <= p) || B.rows[B.rows.length - 1]);
  const caps = row ? row.slice(1) : [];
  const col = B && f.fps ? Math.max(0, B.fps.reduce((k, x, i) => (f.fps >= x - 5 ? i : k), 0)) : null;
  const kbps = f.size && f.duration ? Math.round((f.size * 8) / f.duration / 1000) : null;
  const cap = col != null ? caps[col] : null;
  const over = kbps != null && caps.length && (cap != null ? kbps > cap : kbps > caps[caps.length - 1]);
  const maybe = kbps != null && cap == null && caps.length > 1 && kbps > caps[0] && kbps <= caps[caps.length - 1];
  const codecs = R.codecs || [];
  const codecOk = f.codec && codecs.length ? codecs.includes(f.codec.video) && (!f.codec.audio || codecs.includes(f.codec.audio)) : null;
  const sizeMB = svc.sizeLimit ? svc.sizeLimit / MB : null;
  return [
    { key: 'codec', icon: 'film', label: t('fCodec'), value: has && f.codec ? [f.codec.video || '?', f.codec.audio || t('fNoAudio')].join(' · ') : null,
      hint: codecOk === false ? siteRules.text('videoForm.creatorInformation.restrictions.wrongFormat') : [...(R.containers || []).map((x) => x.replace('.', '').toUpperCase()), ...codecs].join(' · '),
      status: fails.includes('type') ? 'no' : f.codec === null ? null : st(codecs.length, false, codecOk === false, f.codec === undefined), statusText: fails.includes('type') ? t('errType') : null },
    { key: 'size', icon: 'file', label: t('fSize'), value: has && f.size ? fmtSize(f.size) : null,
      hint: sizeMB ? `≤ ${sizeMB} MB` + (!svc.isPremium && R.premiumMB ? t('fPremium', { n: R.premiumMB }) : '') : '', status: st(sizeMB, fails.includes('size')) },
    { key: 'res', icon: 'maximize', label: t('fRes'), value: has && f.width ? `${f.width}×${f.height}` : null, hint: R.minW ? `≥ ${R.minW}×${R.minH}` : '', status: st(R.minW, fails.includes('resolution')) },
    { key: 'dur', icon: 'clock', label: t('fDur'), value: has && f.duration ? fmtDuration(f.duration) : null, hint: R.minDur ? t('fDurHint', { n: R.minDur }) : '', status: st(R.minDur, fails.includes('duration')) },
    { key: 'rate', icon: 'gauge', label: t('fRate'), value: kbps != null ? `${kbps} kb/s` + (f.fps ? ` · ${f.fps} FPS` : '') : null,
      hint: !B ? '' : has && row && kbps != null ? t('fRateLimit', { p: row[0], n: cap != null ? cap : caps.join(' / '), fps: cap != null ? B.fps[col] + ' FPS' : B.fps.map((x) => x + '').join(' / ') + ' FPS' }) : t('fRateHint'),
      more: B ? bitrateTable(B, has && row ? row[0] : null) : null,
      status: !B ? null : has && kbps != null ? (over || maybe ? 'warn' : 'ok') : has ? 'wait' : null, statusText: maybe ? t('fMaybe', { n: B.fps[B.fps.length - 1] }) : null },
  ];
}
