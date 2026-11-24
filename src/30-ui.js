const STYLE = [];
const ui = { root: null, layer: null };

STYLE.push(`
:host{all:initial;display:block}
.app{--bg:#fafafa;--card:#fff;--sunk:#f4f4f5;--fg:#171717;--fg2:#666;--fg3:#8f8f8f;--line:#eaeaea;--line2:#d9d9d9;--inv:#fff;
  --blue:#0070f3;--red:#e5484d;--amber:#d97706;--green:#16a34a;--violet:#7c3aed;--shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.08);
  --spring:linear(0,.009,.035 2.1%,.141 4.4%,.723 12.9%,.938 16.7%,1.017,1.077 20.4%,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1);
  --ease:cubic-bezier(.22,1,.36,1);
  font:14px/1.5 Geist,Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans","Microsoft YaHei",sans-serif;color:var(--fg);background:var(--bg);
  min-height:calc(100vh - 64px);-webkit-font-smoothing:antialiased;font-feature-settings:"tnum","cv11";letter-spacing:-.006em;position:relative}
.app[data-theme=dark]{--bg:#0a0a0a;--card:#111;--sunk:#1a1a1a;--fg:#ededed;--fg2:#a1a1a1;--fg3:#6f6f6f;--line:#242424;--line2:#333;--inv:#0a0a0a;
  --blue:#3b9eff;--red:#ff6369;--amber:#f5a524;--green:#3dd68c;--violet:#a78bfa;--shadow:0 1px 2px rgba(0,0,0,.4),0 12px 32px rgba(0,0,0,.5)}
*{box-sizing:border-box}
.ic{flex:none;display:block}
button{font:inherit;color:inherit;letter-spacing:inherit}
input,textarea{font:inherit;color:inherit;letter-spacing:inherit}
::selection{background:color-mix(in srgb,var(--blue) 28%,transparent)}
a{color:inherit}
.mono{font-family:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-feature-settings:"tnum"}
.row{display:flex;align-items:center;gap:8px}.grow{flex:1;min-width:0}.col{display:flex;flex-direction:column}
.label{font-size:12px;font-weight:500;color:var(--fg2);letter-spacing:.01em}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 14px;border-radius:8px;border:1px solid var(--line2);background:var(--card);
  font-weight:500;font-size:14px;cursor:pointer;white-space:nowrap;user-select:none;transition:background .15s,border-color .15s,transform .2s var(--ease),opacity .15s,box-shadow .15s}
.btn:hover{background:var(--sunk)}
.btn:active{transform:scale(.97)}
.btn:focus-visible,.seg button:focus-visible,.chip:focus-visible,.ibtn:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.btn.primary{background:var(--fg);color:var(--inv);border-color:var(--fg)}
.btn.primary:hover{opacity:.88}
.btn.ghost{border-color:transparent;background:transparent}
.btn.ghost:hover{background:var(--sunk)}
.btn.danger{color:var(--red)}
.btn.sm{height:30px;padding:0 10px;font-size:13px;border-radius:7px}
.btn[disabled]{opacity:.45;cursor:not-allowed;transform:none}
.ibtn{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:8px;border:0;background:transparent;color:var(--fg2);cursor:pointer;transition:background .15s,color .15s,transform .2s var(--ease)}
.ibtn:hover{background:var(--sunk);color:var(--fg)}
.ibtn:active{transform:scale(.9)}
.ibtn.on{background:var(--sunk);color:var(--fg)}

.seg{position:relative;display:inline-flex;padding:3px;border-radius:10px;background:var(--sunk);border:1px solid var(--line)}
.seg button{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;background:none;border-radius:7px;cursor:pointer;color:var(--fg2);font-weight:500;font-size:13px;transition:color .2s}
.seg button[aria-pressed=true]{color:var(--fg)}
.seg .thumb{position:absolute;top:3px;left:0;height:30px;border-radius:7px;background:var(--card);box-shadow:0 0 0 1px var(--line),0 1px 2px rgba(0,0,0,.06);transition:transform .38s var(--ease),width .38s var(--ease)}
.app[data-theme=dark] .seg .thumb{background:#2b2b2b;box-shadow:0 0 0 1px #3a3a3a}
.seg.wide{display:flex}.seg.wide button{flex:1;justify-content:center}

.chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;border-radius:999px;border:1px solid var(--line2);background:var(--card);font-size:13px;cursor:pointer;white-space:nowrap;
  transition:background .15s,border-color .15s,color .15s,transform .25s var(--ease)}
.chip:hover{border-color:var(--fg3)}
.chip:active{transform:scale(.95)}
.chip.on{background:var(--fg);border-color:var(--fg);color:var(--inv)}
.chip .sub{color:var(--fg3);font-size:11px}
.chip.on .sub{color:color-mix(in srgb,var(--inv) 60%,transparent)}

.field{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border-radius:9px;border:1px solid var(--line2);background:var(--card);transition:border-color .15s,box-shadow .15s}
.field:focus-within{border-color:var(--fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--fg) 9%,transparent)}
.field input{flex:1;min-width:0;border:0;outline:0;background:none;height:100%}
.field input::placeholder,textarea::placeholder{color:var(--fg3)}
.field .ic{color:var(--fg3)}

.card{background:var(--card);border:1px solid var(--line);border-radius:12px}

.layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000}
.layer>*{pointer-events:auto}
.tip{position:fixed;padding:5px 8px;border-radius:6px;background:var(--fg);color:var(--inv);font-size:12px;font-weight:500;white-space:nowrap;pointer-events:none!important;opacity:0;transform:translateY(3px) scale(.96);transition:opacity .12s,transform .2s var(--ease)}
.tip.in{opacity:1;transform:none}
.pop{position:fixed;min-width:180px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);padding:5px;opacity:0;transform:scale(.94) translateY(-4px);transition:opacity .14s,transform .34s var(--spring)}
.pop.in{opacity:1;transform:none}
.pop .item{display:flex;align-items:center;gap:10px;width:100%;height:34px;padding:0 10px;border:0;background:none;border-radius:8px;cursor:pointer;text-align:left;font-size:13.5px}
.pop .item:hover,.pop .item.cur{background:var(--sunk)}
.pop .item .ic{color:var(--fg2)}
.pop .item.danger,.pop .item.danger .ic{color:var(--red)}
.pop hr{border:0;border-top:1px solid var(--line);margin:5px -5px}
.pop .head{padding:6px 10px 4px;font-size:11px;font-weight:600;color:var(--fg3);letter-spacing:.04em;text-transform:uppercase}

.toasts{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px}
.toast{display:flex;align-items:center;gap:10px;height:42px;padding:0 8px 0 14px;border-radius:12px;background:var(--fg);color:var(--inv);font-size:13.5px;font-weight:500;box-shadow:var(--shadow);animation:toastIn .5s var(--spring)}
.toast:not(:has(button)){padding-right:14px}
.toast.out{transition:opacity .2s,transform .2s;opacity:0;transform:translateY(8px) scale(.96)}
.toast button{height:28px;padding:0 10px;border:0;border-radius:8px;background:color-mix(in srgb,var(--inv) 16%,transparent);color:var(--inv);font-weight:600;font-size:13px;cursor:pointer}
.toast.err{background:var(--red);color:#fff}
@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.9)}}

.scrim{position:fixed;inset:0;overscroll-behavior:contain;background:rgba(0,0,0,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:grid;place-items:center;padding:24px;opacity:0;transition:opacity .22s}
.scrim.in{opacity:1}
.sheet{width:min(560px,100%);max-height:min(86vh,760px);overflow:auto;overscroll-behavior:contain;background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);transform:translateY(18px) scale(.96);opacity:0;transition:transform .5s var(--spring),opacity .2s}
.scrim.in .sheet{transform:none;opacity:1}
.sheet>header{display:flex;align-items:center;gap:10px;padding:16px 16px 0 20px;font-weight:600;font-size:16px}
.sheet>.body{padding:16px 20px 20px}
.sheet>footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--line);background:color-mix(in srgb,var(--sunk) 60%,transparent);border-radius:0 0 16px 16px;position:sticky;bottom:0}

.spin{width:16px;height:16px;border-radius:50%;border:2px solid color-mix(in srgb,currentColor 25%,transparent);border-top-color:currentColor;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(1turn)}}
/* 骨架：加载时先摆出内容的形状，比转圈更能看出马上会出现什么 */
.skel{display:block;flex:none;border-radius:6px;background:linear-gradient(100deg,var(--sunk) 40%,var(--line) 50%,var(--sunk) 60%) 0/300% 100%;animation:shimmer 1.4s infinite linear}
.skel.round{border-radius:50%}
@keyframes shimmer{to{background-position:-150% 0}}
.infotip{display:inline-grid;place-items:center;width:20px;height:20px;margin:0 2px;padding:0;border:0;border-radius:50%;background:none;color:var(--fg3);cursor:help;vertical-align:middle;transition:color .15s,background .15s}
.infotip:hover,.infotip:focus-visible{color:var(--fg);background:var(--sunk);outline:0}
.infotext{max-width:320px;padding:6px 8px;font-size:12.5px;line-height:1.65;color:var(--fg2);white-space:normal}
.infolink{display:flex;align-items:center;gap:6px;margin:8px -8px -6px;padding:8px;border-top:1px solid var(--line);color:var(--fg);font-weight:500;text-decoration:none;border-radius:0 0 8px 8px;transition:background .15s}
.infolink span{flex:1}.infolink:hover{background:var(--sunk)}
.clr{display:inline-flex;align-items:center;gap:4px;flex:none;height:26px;padding:0 8px;border:0;border-radius:7px;background:none;color:var(--fg3);font-size:12px;font-weight:500;cursor:pointer;
  transition:opacity .2s,transform .35s var(--spring),background .15s,color .15s}
.clr:hover{background:var(--sunk);color:var(--fg)}
.clr.off{opacity:0;transform:scale(.8);pointer-events:none;transition:opacity .15s,transform .2s ease}
.skrow{display:flex;align-items:center;gap:10px;height:38px;padding:0 10px}
@keyframes pop{from{transform:scale(.6);opacity:0}}
@keyframes rise{from{transform:translateY(10px);opacity:0}}
@keyframes shake{20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
.stagger>*{animation:rise .5s var(--ease) backwards}
.stagger>:nth-child(2){animation-delay:.04s}.stagger>:nth-child(3){animation-delay:.08s}.stagger>:nth-child(4){animation-delay:.12s}.stagger>:nth-child(5){animation-delay:.16s}.stagger>:nth-child(6){animation-delay:.2s}.stagger>:nth-child(n+7){animation-delay:.24s}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`);

// ── 悬停提示：任何带 data-tip 的元素 ──────────────────────────────────────
function installTips(root) {
  const tip = h('div.tip');
  ui.layer.append(tip);
  let cur = null;
  const hide = () => { cur = null; tip.classList.remove('in'); };
  root.addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('[data-tip]');
    if (!el || el === cur) return;
    cur = el;
    tip.textContent = el.dataset.tip;
    const r = el.getBoundingClientRect();
    const w = tip.offsetWidth, hh = tip.offsetHeight;
    const above = r.top > hh + 12;
    tip.style.left = clamp(r.left + r.width / 2 - w / 2, 6, innerWidth - w - 6) + 'px';
    tip.style.top = (above ? r.top - hh - 6 : r.bottom + 6) + 'px';
    tip.classList.add('in');
  });
  root.addEventListener('pointerout', (e) => { if (cur && !cur.contains(e.relatedTarget)) hide(); });
  root.addEventListener('pointerdown', hide, true);
}

function btn(label, opts = {}) {
  const b = h('button.btn' + (opts.kind ? '.' + opts.kind : '') + (opts.sm ? '.sm' : ''), { type: 'button', onclick: opts.onclick, disabled: opts.disabled },
    opts.icon && icon(opts.icon, opts.sm ? 14 : 16), label && h('span', label), opts.iconRight && icon(opts.iconRight, 16));
  if (opts.tip) b.dataset.tip = opts.tip;
  return b;
}
function ibtn(name, tip, onclick, size = 16) {
  return h('button.ibtn', { type: 'button', onclick, data: tip ? { tip } : {} , 'aria-label': tip }, icon(name, size));
}

/** 分段选择：滑块用弹簧曲线跟到当前项。options: [{value,label,icon,tip}] */
function segmented(options, value, onChange, { wide } = {}) {
  const thumb = h('div.thumb');
  const el = h('div.seg' + (wide ? '.wide' : ''), { role: 'group' }, thumb);
  const buttons = options.map((o) => {
    const b = h('button', { type: 'button', onclick: () => { if (value !== o.value) { set(o.value); onChange(o.value); } }, data: o.tip ? { tip: o.tip } : {} }, o.icon && icon(o.icon, 15), o.label);
    el.append(b);
    return b;
  });
  const place = () => {
    const i = options.findIndex((o) => o.value === value);
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    const b = buttons[i];
    if (!b || !b.offsetWidth) return;
    thumb.style.width = b.offsetWidth + 'px';
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  function set(v) { value = v; place(); }
  new ResizeObserver(place).observe(el);
  requestAnimationFrame(place);
  el.set = set;
  return el;
}

/** 浮层：贴着锚点弹出，点外面或 Esc 关闭。返回 close()。 */
function popover(anchor, content, { align = 'start', width, onClose } = {}) {
  const pop = h('div.pop', { style: width ? { width: width + 'px' } : null }, content);
  ui.layer.append(pop);
  const place = () => {
    const r = anchor.getBoundingClientRect();
    const w = pop.offsetWidth, hh = pop.offsetHeight;
    const below = r.bottom + hh + 8 < innerHeight || r.top < hh + 8;
    pop.style.left = clamp(align === 'end' ? r.right - w : align === 'center' ? r.left + r.width / 2 - w / 2 : r.left, 8, innerWidth - w - 8) + 'px';
    pop.style.top = (below ? r.bottom + 6 : r.top - hh - 6) + 'px';
    pop.style.transformOrigin = `${align === 'end' ? 'right' : 'left'} ${below ? 'top' : 'bottom'}`;
  };
  place();
  requestAnimationFrame(() => pop.classList.add('in'));
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    pop.classList.remove('in');
    document.removeEventListener('pointerdown', onDown, true);
    document.removeEventListener('keydown', onKey, true);
    removeEventListener('resize', close);
    setTimeout(() => pop.remove(), 160);
    onClose && onClose();
  };
  const onDown = (e) => { const path = e.composedPath(); if (!path.includes(pop) && !path.includes(anchor)) close(); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  setTimeout(() => {
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey, true);
    addEventListener('resize', close);
  });
  pop.close = close;
  pop.replace = place;
  return pop;
}
/**
 * 一键清空的小按钮：有内容才出现（淡入 + 回弹），清空后给一个可以撤销的提示。
 * what：提示里说清空了什么；read() 取当前值，write(v) 写回（清空时写 empty，撤销时写原值）。
 */
function clearBtn(what, { read, write, empty = '' }) {
  const el = h('button.clr.off', { type: 'button', tabIndex: -1, title: t('clearAll') + ' ' + what, onpointerdown: (e) => e.preventDefault() }, icon('x', 12), t('clearAll'));
  el.addEventListener('click', () => {
    const before = read();
    write(typeof empty === 'function' ? empty() : empty);
    toast(t('cleared', { n: what }), { action: t('undo'), onAction: () => write(before) });
  });
  return { el, show(on) { el.classList.toggle('off', !on); el.tabIndex = on ? 0 : -1; } };
}

/** 骨架块：宽、高（数字是 px，也可以是 CSS 长度）；radius 传 true 是圆形，传数字是圆角。 */
function skel(w, hgt, radius) {
  const v = (x) => (typeof x === 'number' ? x + 'px' : x);
  const el = h('span.skel' + (radius === true ? '.round' : ''), { style: { width: v(w), height: v(hgt) } });
  if (typeof radius === 'number') el.style.borderRadius = radius + 'px';
  return el;
}

/**
 * 悬停面板：鼠标停在 anchor 上就贴着它弹出，移开就收。build() 每次现算内容，返回 null 不弹。
 * 鼠标可以从 anchor 挪到面板上（中间那道缝留了一小段宽限期），停在面板上它就不收，方便细看、选文字。
 */
function hoverPanel(anchor, build) {
  let pop = null, timer = 0;
  const later = () => { clearTimeout(timer); timer = setTimeout(close, 180); };
  const close = () => { clearTimeout(timer); if (!pop) return; const p = pop; pop = null; p.classList.remove('in'); setTimeout(() => p.remove(), 160); };
  const open = () => {
    const content = build();
    if (!content || !anchor.isConnected) return;
    pop = h('div.pop', content);
    pop.addEventListener('pointerenter', () => clearTimeout(timer));
    pop.addEventListener('pointerleave', later);
    ui.layer.append(pop);
    // 对准文字本身：触发区常常是撑满一行的格子（文字后面一大段空白），按它的中心放会离文字很远
    const rg = document.createRange();
    rg.selectNodeContents(anchor);
    const tr = rg.getBoundingClientRect();
    const r = tr.width ? tr : anchor.getBoundingClientRect(), w = pop.offsetWidth, hh = pop.offsetHeight;
    const above = r.top > hh + 12;
    pop.style.left = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8) + 'px';
    pop.style.top = (above ? r.top - hh - 8 : r.bottom + 8) + 'px';
    pop.style.transformOrigin = `center ${above ? 'bottom' : 'top'}`;
    requestAnimationFrame(() => pop && pop.classList.add('in'));
  };
  // 触屏没有悬停：点一下开、再点一下或点别处收（按悬停的写法，按下就收、抬手又离开，面板一闪就没）
  const outside = (e) => { if (!pop || e.composedPath().includes(pop) || e.composedPath().includes(anchor)) return; close(); document.removeEventListener('pointerdown', outside, true); };
  anchor.addEventListener('pointerenter', (e) => { if (e.pointerType === 'touch') return; clearTimeout(timer); if (!pop) timer = setTimeout(open, 120); });
  anchor.addEventListener('pointerleave', (e) => { if (e.pointerType !== 'touch') later(); });
  anchor.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch') { close(); return; }
    clearTimeout(timer);
    document.removeEventListener('pointerdown', outside, true);
    if (pop) { close(); return; }
    open();
    document.addEventListener('pointerdown', outside, true);
  });
  // 键盘：Tab 到触发点上也能看
  anchor.addEventListener('focus', () => { clearTimeout(timer); if (!pop) open(); });
  anchor.addEventListener('blur', later);
}

/** 标题旁的 ⓘ：悬停或 Tab 聚焦时弹出说明文字。 */
/** link = { label, href }：卡片底部再放一个新开页签的链接（卡片鼠标能移进去，点得到）。 */
function infoTip(text, link = null) {
  const el = h('button.infotip', { type: 'button', 'aria-label': text, onclick: (e) => e.preventDefault() }, icon('info', 14));
  hoverPanel(el, () => h('div.infotext', text, link && h('a.infolink', { href: link.href, target: '_blank', rel: 'noopener' }, h('span', link.label), icon('external', 13))));
  return el;
}

/** 菜单：items = [{icon,label,onclick,danger} | '-' | {head}] */
function menu(anchor, items, opts) {
  const box = h('div');
  const pop = popover(anchor, box, { align: 'end', ...opts });
  for (const it of items) {
    if (!it) continue;
    if (it === '-') box.append(h('hr'));
    else if (it.head) box.append(h('div.head', it.head));
    else box.append(h('button.item' + (it.danger ? '.danger' : ''), { type: 'button', onclick: () => { pop.close(); it.onclick(); } }, it.icon && icon(it.icon), h('span.grow', it.label), it.right));
  }
  pop.replace();
  return pop;
}

function toast(message, { action, onAction, error, ms = 3200 } = {}) {
  let box = ui.layer.querySelector('.toasts');
  if (!box) ui.layer.append((box = h('div.toasts')));
  const el = h('div.toast' + (error ? '.err' : ''), error ? icon('warn') : null, h('span', message), action && h('button', { onclick: () => { onAction(); bye(); } }, action));
  box.append(el);
  const bye = () => { el.classList.add('out'); setTimeout(() => el.remove(), 220); };
  setTimeout(bye, action ? ms + 2500 : ms);
  return bye;
}

/** 居中弹层。build(close) 返回 {title, body, footer}。 */
// 弹层打开期间锁住页面滚动：否则在弹层里滚到头，滚动会传给背后的页面（可叠多层，计数）
let scrollLocks = 0, savedOverflow = '';
function lockScroll() { if (!scrollLocks++) { savedOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; } }
function unlockScroll() { if (scrollLocks && !--scrollLocks) document.documentElement.style.overflow = savedOverflow; }
function sheet(build, { width, onClose } = {}) {
  const scrim = h('div.scrim');
  let closed = false;
  const close = () => { if (closed) return; closed = true; scrim.classList.remove('in'); document.removeEventListener('keydown', onKey, true); unlockScroll(); onClose && onClose(); setTimeout(() => scrim.remove(), 240); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const parts = build(close);
  const box = h('div.sheet', { style: width ? { width: `min(${width}px,100%)` } : null },
    parts.title && h('header', h('span.grow', parts.title), ibtn('x', t('close'), close)),
    h('div.body', parts.body), parts.footer && h('footer', parts.footer));
  scrim.append(box);
  scrim.addEventListener('pointerdown', (e) => { if (e.target === scrim) close(); });
  document.addEventListener('keydown', onKey, true);
  ui.layer.append(scrim);
  lockScroll();
  requestAnimationFrame(() => scrim.classList.add('in'));
  return close;
}

/** 数字变化时做一个上下翻动。 */
function ticker(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (!reducedMotion()) el.animate([{ transform: 'translateY(40%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
}
