// 首次引导：三张会动的示意，不靠文字解释。

STYLE.push(`
.tour{width:min(520px,100%)}
.tour .body{padding:0!important}
.tslides{position:relative;height:250px;overflow:hidden;background:var(--sunk);border-bottom:1px solid var(--line);border-radius:16px 16px 0 0}
.tslide{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transform:translateX(40px) scale(.96);transition:opacity .35s,transform .6s var(--ease);pointer-events:none}
.tslide.cur{opacity:1;transform:none}
.tslide.prev{transform:translateX(-40px) scale(.96)}
.tcap{padding:22px 24px 4px;font-size:19px;font-weight:600;letter-spacing:-.03em;text-align:center;min-height:54px}
.tfoot{display:flex;align-items:center;gap:8px;padding:14px 20px 20px}
.tdots{display:flex;gap:6px;flex:1}
.tdots i{width:6px;height:6px;border-radius:3px;background:var(--line2);transition:width .4s var(--ease),background .3s}
.tdots i.cur{width:20px;background:var(--fg)}
.d-steps{display:flex;align-items:center;gap:0;width:340px}
.d-steps b{width:38px;height:38px;border-radius:50%;border:1.5px solid var(--line2);background:var(--card);display:grid;place-items:center;font-size:14px;animation:dstep 4s infinite}
.d-steps b:nth-of-type(2){animation-delay:.7s}.d-steps b:nth-of-type(3){animation-delay:1.4s}.d-steps b:nth-of-type(4){animation-delay:2.1s}
.d-steps u{flex:1;height:2px;background:var(--line2);position:relative;overflow:hidden}
.d-steps u::after{content:"";position:absolute;inset:0;background:var(--fg);transform:scaleX(0);transform-origin:left;animation:dline 4s infinite}
.d-steps u:nth-of-type(2)::after{animation-delay:.7s}.d-steps u:nth-of-type(3)::after{animation-delay:1.4s}
@keyframes dstep{0%,6%{background:var(--card);color:var(--fg);border-color:var(--line2);transform:none}12%{transform:scale(1.18)}18%,82%{background:var(--fg);color:var(--inv);border-color:var(--fg);transform:none}92%,100%{background:var(--card);color:var(--fg);border-color:var(--line2)}}
@keyframes dline{0%,16%{transform:scaleX(0)}32%,82%{transform:scaleX(1)}92%,100%{transform:scaleX(0)}}
.d-tags{width:300px}
.d-tags .f{display:flex;align-items:center;gap:8px;height:42px;padding:0 12px;border-radius:10px;border:1px solid var(--line2);background:var(--card);font-size:15px}
.d-tags .f span{overflow:hidden;white-space:nowrap;width:0;animation:dtype 4.5s steps(4) infinite}
.d-tags .f i{width:1.5px;height:18px;background:var(--fg);animation:blink 1s steps(2) infinite}
@keyframes dtype{0%,8%{width:0}30%,88%{width:4em}96%,100%{width:0}}
@keyframes blink{50%{opacity:0}}
.d-tags .o{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
.d-tags .o em{font-style:normal;height:30px;padding:0 12px;border-radius:999px;background:var(--fg);color:var(--inv);display:inline-flex;align-items:center;font-size:13px;font-weight:500;opacity:0;animation:dchip 4.5s infinite}
.d-tags .o em:nth-child(2){animation-delay:.25s;background:none;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line2)}
.d-tags .o em:nth-child(3){animation-delay:.4s;background:none;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line2)}
@keyframes dchip{0%,34%{opacity:0;transform:scale(.6)}42%,86%{opacity:1;transform:none}94%,100%{opacity:0}}
.d-tpl{font-size:20px;font-weight:600;letter-spacing:-.02em;display:flex;align-items:center;gap:4px;white-space:nowrap}
.d-tpl .s{position:relative;display:inline-grid;height:34px;padding:0 10px;border-radius:8px;place-items:center;border:1px dashed color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent);animation:dslot 5s infinite}
.d-tpl .s span{grid-area:1/1;animation:dswap 5s infinite}
.d-tpl .s span:first-child{color:var(--violet);font-size:14px}
.d-tpl .s span:last-child{animation-name:dswap2}
.d-tpl .s:nth-of-type(2),.d-tpl .s:nth-of-type(2) span{animation-delay:.5s}
@keyframes dslot{0%,30%{border-color:color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent)}40%,88%{border-color:transparent;background:transparent}96%,100%{border-color:color-mix(in srgb,var(--violet) 60%,transparent)}}
@keyframes dswap{0%,30%{opacity:1;transform:none}38%,90%{opacity:0;transform:translateY(-8px)}98%,100%{opacity:1;transform:none}}
@keyframes dswap2{0%,32%{opacity:0;transform:translateY(8px)}42%,88%{opacity:1;transform:none}96%,100%{opacity:0}}
`);

/** 三张示意动画本体（首次引导和帮助弹窗共用）。 */
function tourDemos() {
  const zh = env.lang === 'zh';
  return [
    h('div.d-steps', h('b', icon('upload', 16)), h('u'), h('b', icon('pencil', 16)), h('u'), h('b', icon('tag', 16)), h('u'), h('b', icon('check', 16))),
    h('div.d-tags', h('div.f', icon('search'), h('span', zh ? '初音未来' : 'miku'), h('i')), h('div.o', h('em', zh ? '初音未来' : 'Hatsune Miku'), h('em', zh ? '舞蹈' : 'Dance'), h('em', 'MikuMikuDance'))),
    h('div.d-tpl', '【MMD】', h('span.s', h('span', zh ? '角色' : 'Who'), h('span', zh ? '初音未来' : 'Miku')), ' - ', h('span.s', h('span', zh ? '曲名' : 'Song'), h('span', 'Gimme×Gimme'))),
  ];
}

function showTour({ onTry } = {}) {
  const slides = tourDemos().map((d) => h('div.tslide', d));
  const caps = ['tour1', 'tour2', 'tour3'];
  let i = 0;
  const cap = h('div.tcap');
  const dots = h('div.tdots', slides.map(() => h('i')));
  const foot = h('div.tfoot', dots);
  const scrim = h('div.scrim');
  const close = () => { store.set('tourDone', VERSION); unlockScroll(); scrim.classList.remove('in'); setTimeout(() => scrim.remove(), 240); document.removeEventListener('keydown', onKey, true); };
  const show = (n) => {
    i = clamp(n, 0, slides.length - 1);
    slides.forEach((s, j) => { s.className = 'tslide' + (j === i ? ' cur' : j < i ? ' prev' : ''); });
    [...dots.children].forEach((d, j) => d.classList.toggle('cur', j === i));
    cap.textContent = t(caps[i]);
    cap.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    const last = i === slides.length - 1;
    add(clear(foot), [dots, !last && btn(t('tourSkip'), { kind: 'ghost', onclick: close }), last && onTry && btn(t('tourTry'), { icon: 'sparkle', onclick: () => { close(); onTry(); } }),
      btn(t(last ? 'tourStart' : 'next'), { kind: 'primary', iconRight: last ? null : 'arrowRight', onclick: () => (last ? close() : show(i + 1)) })]);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); i === slides.length - 1 ? close() : show(i + 1); } else if (e.key === 'ArrowLeft') show(i - 1); };
  document.addEventListener('keydown', onKey, true);
  scrim.append(h('div.sheet.tour', h('div.tslides', slides), cap, foot));
  ui.layer.append(scrim);
  lockScroll();
  requestAnimationFrame(() => { scrim.classList.add('in'); show(0); });
}
