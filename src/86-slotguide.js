// 填空指引：第一次进「内容」这一步时弹出，四幕会动的演示（假鼠标、假输入框、假输入法候选条、按键提示），
// 讲清楚 填空是什么 → 怎么做一个 → 怎么填 → 多个之间怎么切。每一幕循环播放，可以重播、前后翻。
// 演示全是 DOM + CSS 过渡，脚本按时间线一步步改 DOM；切走或关掉时用令牌作废还在跑的那一轮。

STYLE.push(`
.g-stage{position:relative;height:300px;overflow:hidden;background:var(--sunk);border-bottom:1px solid var(--line);border-radius:16px 16px 0 0}
.g-scene{position:absolute;inset:0;padding:30px 40px;opacity:0;transform:translateX(36px);transition:opacity .35s,transform .6s var(--ease);pointer-events:none;user-select:none}
.g-scene.cur{opacity:1;transform:none}
.g-scene.prev{transform:translateX(-36px)}
.g-lbl{display:flex;align-items:center;gap:6px;margin:0 0 6px;font-size:12px;font-weight:500;color:var(--fg3)}
.g-field{position:relative;display:flex;align-items:center;height:46px;padding:0 14px;border-radius:10px;border:1px solid var(--line2);background:var(--card);font-size:17px;font-weight:500;white-space:pre;transition:border-color .2s,box-shadow .2s}
.g-field.focus{border-color:var(--fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--fg) 9%,transparent)}
.g-field.g-body{height:auto;min-height:58px;align-items:flex-start;padding:12px 14px;font-size:14px;font-weight:400}
.g-ch{border-radius:2px;transition:background .06s}
.g-ch.sel{background:color-mix(in srgb,var(--blue) 26%,transparent)}
.g-slot{display:inline-block;position:relative;padding:0 5px;margin:0 2px;border-radius:6px;line-height:1.5;outline:1px dashed color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent);color:var(--violet);transition:outline-color .25s,background .25s,color .25s,padding .25s,margin .25s}
.g-slot.g-new{animation:gpop .55s var(--spring)}
.g-slot.glow{animation:gglow .9s ease}
.g-slot.act{outline:1.5px solid var(--amber);background:color-mix(in srgb,var(--amber) 16%,transparent);color:var(--fg)}
.g-slot.fin{outline-color:transparent;background:transparent;color:var(--fg);padding:0;margin:0}
.g-slot.fin.flash{animation:gflash .7s ease}
@keyframes gpop{0%{transform:scale(.3);opacity:0}100%{transform:none;opacity:1}}
@keyframes gglow{40%{box-shadow:0 0 0 5px color-mix(in srgb,var(--violet) 22%,transparent)}}
@keyframes gflash{0%{background:color-mix(in srgb,var(--green) 26%,transparent)}100%{background:transparent}}
.g-caret{display:inline-block;width:1.5px;height:1.1em;margin:0 -.75px;background:var(--fg);vertical-align:-.15em;animation:blink 1s steps(2) infinite}
.g-comp{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:4px;color:var(--fg)}
.g-ime{position:absolute;z-index:4;display:flex;align-items:center;gap:2px;padding:4px;border-radius:10px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);font-size:14px;font-weight:400;white-space:nowrap;opacity:0;transform:translateY(-4px) scale(.96);transform-origin:left top;transition:opacity .12s,transform .25s var(--ease)}
.g-ime.in{opacity:1;transform:none}
.g-ime span{padding:3px 9px;border-radius:7px;color:var(--fg)}
.g-ime span small{margin-right:5px;font-size:11px;opacity:.5}
.g-ime span.cur{background:var(--blue);color:#fff}
.g-ime span.cur small{opacity:.8}
.g-ime i{width:1px;height:16px;margin:0 4px;background:var(--line2)}
.g-ime em{font-style:normal;font-size:11px;color:var(--fg3);padding:0 6px 0 2px}
.g-pop{position:absolute;z-index:3;display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;border-radius:10px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);font-size:13px;font-weight:500;white-space:nowrap;opacity:0;transform:translateY(5px) scale(.9);transform-origin:center bottom;transition:opacity .15s,transform .38s var(--spring),width .3s var(--ease)}
.g-pop.in{opacity:1;transform:none}
.g-pop.out{opacity:0;transform:scale(.9);transition-duration:.15s}
.g-pop .g-k{padding:1px 5px;border-radius:4px;background:var(--sunk);border:1px solid var(--line);font:600 10.5px "Geist Mono",ui-monospace,monospace;color:var(--fg3)}
.g-pop .in-box{display:flex;align-items:center;gap:6px;min-width:150px;height:26px;padding:0 8px;border-radius:7px;border:1px solid var(--fg);font-weight:400}
.g-pop .in-box .g-ph{color:var(--fg3)}
.g-tip{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:var(--amber);color:#fff;font-size:12px;font-weight:600;white-space:nowrap;opacity:0;transform:translateY(4px) scale(.9);transition:opacity .14s,transform .3s var(--spring)}
.g-tip::after{content:"";position:absolute;left:50%;bottom:-4px;width:8px;height:8px;margin-left:-4px;background:inherit;transform:rotate(45deg);border-radius:1px}
.g-tip.in{opacity:1;transform:none}
.g-cur{position:absolute;left:0;top:0;z-index:8;width:22px;height:22px;pointer-events:none;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35));opacity:0;transition:opacity .3s}
.g-cur.on{opacity:1}
.g-cur svg{display:block;transform-origin:4px 3px;transition:transform .12s}
.g-cur.down svg{transform:scale(.84)}
.g-rip{position:absolute;z-index:7;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:color-mix(in srgb,var(--blue) 30%,transparent);pointer-events:none;animation:grip .55s ease-out forwards}
@keyframes grip{from{transform:scale(.15);opacity:1}to{transform:scale(1.3);opacity:0}}
.g-keys{position:absolute;right:16px;bottom:14px;z-index:8;display:flex;gap:6px}
.g-kbd{display:inline-grid;place-items:center;min-width:36px;height:30px;padding:0 10px;border-radius:7px;background:var(--card);border:1px solid var(--line2);box-shadow:0 2px 0 var(--line2);font:600 12px "Geist Mono",ui-monospace,monospace;color:var(--fg);animation:gkey 1s var(--ease) forwards}
@keyframes gkey{0%{opacity:0;transform:translateY(10px)}14%{opacity:1;transform:none;box-shadow:0 2px 0 var(--line2)}28%{transform:translateY(2px);box-shadow:0 0 0 var(--line2);background:var(--sunk)}44%{transform:none;box-shadow:0 2px 0 var(--line2);background:var(--card)}80%{opacity:1}100%{opacity:0;transform:translateY(-4px)}}
.g-pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:600;background:color-mix(in srgb,var(--amber) 14%,transparent);color:var(--amber);transition:background .3s,color .3s,opacity .3s,transform .4s var(--spring)}
.g-pill.ok{background:color-mix(in srgb,var(--green) 14%,transparent);color:var(--green)}
.g-pill.hide{opacity:0;transform:scale(.8)}
.g-pill.bump{animation:gbump .35s var(--spring)}
@keyframes gbump{50%{transform:scale(1.12)}}
.g-btn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:8px;background:var(--fg);color:var(--inv);font-size:13px;font-weight:500;opacity:.3;transition:opacity .35s,transform .4s var(--spring)}
.g-btn.on{opacity:1}
.g-btn.press{transform:scale(.95)}
.g-tpl{flex:none;white-space:nowrap;display:inline-flex;flex-direction:column;gap:7px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);box-shadow:0 1px 2px rgba(0,0,0,.04);font-size:13px;transition:transform .3s var(--spring),box-shadow .2s}
.g-tpl.press{transform:scale(.96)}
.g-tpl b{display:flex;align-items:center;gap:6px;font-weight:600}
.g-tpl .g-slot{font-size:12px}
.g-row{display:flex;align-items:center;gap:12px}
.g-arrow{color:var(--fg3);opacity:0;transform:translateX(-6px);transition:opacity .3s,transform .4s var(--ease)}
.g-arrow.in{opacity:1;transform:none}
.g-txt{padding:20px 26px 2px;min-height:146px}
.g-txt b{display:block;font-size:18px;font-weight:600;letter-spacing:-.02em}
.g-txt p{margin:6px 0 0;color:var(--fg2);font-size:13.5px;line-height:1.7}
.g-legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px;font-size:12px;color:var(--fg3)}
.g-legend span{display:inline-flex;align-items:center;gap:5px}
.g-legend kbd{display:inline-grid;place-items:center;min-width:22px;height:20px;padding:0 5px;border-radius:5px;border:1px solid var(--line2);box-shadow:0 1px 0 var(--line2);background:var(--card);font:600 10.5px "Geist Mono",ui-monospace,monospace;color:var(--fg2)}
.g-replay{position:absolute;left:12px;bottom:10px;z-index:9}
`);

/** 演示里那只鼠标的箭头。 */
function guideArrow() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 22 22');
  svg.setAttribute('width', '22');
  svg.setAttribute('height', '22');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', 'M4 3 L4 18 L8 14.2 L10.8 20 L13.4 18.8 L10.7 13.2 L16 13.2 Z');
  p.setAttribute('fill', '#111');
  p.setAttribute('stroke', '#fff');
  p.setAttribute('stroke-width', '1.4');
  p.setAttribute('stroke-linejoin', 'round');
  svg.append(p);
  return svg;
}

/** 填空指引的四页：{ pages: [{ title, text, legend, play(root, kit) }], kit(root, alive), STOP }。播放器在帮助弹窗里（87-help.js）。 */
function slotGuidePages() {
  const zh = env.lang === 'zh';
  const STOP = {};
  let token = 0;

  // ── 每一幕的舞台工具：坐标、鼠标、按键、打字、输入法 ──
  function kit(root, alive) {
    const w = async (ms) => { await sleep(ms); if (!alive()) throw STOP; };
    const scale = () => { const r = root.getBoundingClientRect(); return r.width / (root.offsetWidth || 1) || 1; };
    /** el 相对这一幕的矩形（不受弹层缩放动画影响）。 */
    const box = (el) => {
      const s = root.getBoundingClientRect(), r = el.getBoundingClientRect(), k = scale();
      return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
    };
    const cur = h('div.g-cur', guideArrow());
    const keys = h('div.g-keys');
    root.append(cur, keys);
    let cx = 0, cy = 0;
    const place = (x, y) => { cx = x; cy = y; cur.style.transform = `translate(${x - 4}px,${y - 3}px)`; };
    const api = {
      w, box,
      show(x, y) { cur.style.transition = 'none'; place(x, y); void cur.offsetWidth; cur.classList.add('on'); },
      hideCursor() { cur.classList.remove('on'); },
      async move(x, y, ms = 650) {
        cur.style.transition = `transform ${ms}ms cubic-bezier(.45,.05,.25,1),opacity .3s`;
        place(x, y);
        await w(ms + 40);
      },
      moveTo(el, fx = 0.5, fy = 0.55, ms) { const b = box(el); return api.move(b.x + b.w * fx, b.y + b.h * fy, ms); },
      async click() {
        cur.classList.add('down');
        root.append(h('div.g-rip', { style: { left: cx + 'px', top: cy + 'px' } }));
        await w(130);
        cur.classList.remove('down');
        setTimeout(() => root.querySelectorAll('.g-rip').forEach((r) => r.remove()), 600);
        await w(120);
      },
      async key(label, hold = 260) { keys.append(h('span.g-kbd', label)); setTimeout(() => keys.firstChild && keys.firstChild.remove(), 1000); await w(hold); },
      caret: () => h('span.g-caret'),
      /** 一个字一个字往 node 里打（直接上屏的文字，比如英文、数字）。 */
      async type(node, text, speed = 75) { for (const ch of text) { node.textContent += ch; await w(speed + Math.random() * 40); } },
      /**
       * 中文输入法：在 host 里 before 节点前面出一段带下划线的拼音，下方出候选条；
       * plan = [[拼音前缀, [候选…]], …]，按空格上屏第一个候选。返回上屏的字。
       */
      async ime(host, before, pinyin, plan, field) {
        const comp = h('span.g-comp');
        host.insertBefore(comp, before);
        const bar = h('div.g-ime');
        root.append(bar);
        const draw = (cands) => {
          clear(bar).append(...cands.map((c, i) => h('span' + (i === 0 ? '.cur' : ''), h('small', String(i + 1)), c)), h('i'), h('em', '‹ ›'));
          const b = box(comp), fb = box(field || host);
          bar.style.left = Math.min(b.x, root.offsetWidth - bar.offsetWidth - 10) + 'px';
          bar.style.top = fb.y + fb.h + 6 + 'px';
        };
        let cands = [];
        for (let i = 1; i <= pinyin.length; i++) {
          comp.textContent = pinyin.slice(0, i);
          const hit = plan.filter(([p]) => pinyin.slice(0, i).startsWith(p)).pop();
          if (hit && hit[1] !== cands) { cands = hit[1]; draw(cands); }
          if (i === 1) requestAnimationFrame(() => bar.classList.add('in'));
          await w(95 + Math.random() * 50);
        }
        await w(380);
        await api.key(zh ? '空格' : 'Space', 160);
        const out = cands[0];
        comp.replaceWith(document.createTextNode(out));
        bar.classList.remove('in');
        setTimeout(() => bar.remove(), 200);
        await w(260);
        return out;
      },
      /** 在 slot 上方挂橙色提示。 */
      tip(slotEl, label) {
        const tip = h('div.g-tip', label);
        root.append(tip);
        const follow = () => { const b = box(slotEl); tip.style.left = b.x + b.w / 2 - tip.offsetWidth / 2 + 'px'; tip.style.top = b.y - tip.offsetHeight - 8 + 'px'; };
        follow();
        requestAnimationFrame(() => tip.classList.add('in'));
        return { follow, hide() { tip.classList.remove('in'); setTimeout(() => tip.remove(), 200); } };
      },
    };
    return api;
  }
  const slot = (name, extra = '') => h('span.g-slot' + extra, name);
  const chars = (str) => [...str].map((c) => h('span.g-ch', c));

  // 演示内容
  const D = zh
    ? { tplName: 'MMD 舞蹈', a: '角色', b: '曲名', c: '模型作者', who: '初音ミク', song: 'Gimme×Gimme', who2: '初音未来', author: '某某P', model: '模型：',
      editLbl: '编辑模板 · 标题格式', pubLbl: '发布 · 标题', bodyLbl: '简介', apply: '套用模板', left: (n) => `${n} 处填空未填`, allOk: '填空都已填好', next: '下一步', maker: '设为填空', namePh: '填空名' }
    : { tplName: 'MMD dance', a: 'Character', b: 'Song', c: 'Model by', who: 'Miku', song: 'Gimme×Gimme', who2: 'Hatsune Miku', author: 'SomeoneP', model: 'Model: ',
      editLbl: 'Edit template · Title pattern', pubLbl: 'Publish · Title', bodyLbl: 'Description', apply: 'Use template', left: (n) => `${n} blanks left`, allOk: 'All blanks filled', next: 'Next', maker: t('makeSlot'), namePh: t('slotName') };

  const scenes = [
    // ① 填空是什么：套用模板 → 标题里留下两个空位
    async (root, k) => {
      const card = h('div.g-tpl', h('b', icon('bookmark', 14), D.tplName), h('div', '【MMD】', slot(D.a), ' - ', slot(D.b)));
      const arrow = h('span.g-arrow', icon('arrowRight', 20));
      const field = h('div.g-field', { style: { flex: '1' } });
      const pill = h('span.g-pill.hide', icon('warn', 12), D.left(2));
      root.append(h('div.g-row', { style: { marginTop: '18px' } }, card, arrow, h('div', { style: { flex: 1, minWidth: 0 } }, h('div.g-lbl', D.pubLbl, h('span', { style: { flex: 1 } }), pill), field)));
      await k.w(300);
      k.show(root.offsetWidth - 40, root.offsetHeight - 30);
      await k.moveTo(card, 0.5, 0.45, 800);
      card.classList.add('press'); await k.click(); card.classList.remove('press');
      arrow.classList.add('in');
      await k.w(250);
      field.classList.add('focus');
      field.append(document.createTextNode('【MMD】'));
      await k.w(160);
      const s1 = slot(D.a, '.g-new'); field.append(s1);
      await k.w(140);
      field.append(document.createTextNode(' - '));
      const s2 = slot(D.b, '.g-new'); field.append(s2);
      await k.w(450);
      pill.classList.remove('hide');
      k.hideCursor();
      for (let i = 0; i < 2; i++) {
        for (const s of [s1, s2]) { s.classList.remove('glow'); void s.offsetWidth; s.classList.add('glow'); await k.w(500); }
      }
      await k.w(900);
    },
    // ② 做一个填空：拖选文字 → 浮出「设为填空」→ 起名 → 变成填空
    async (root, k) => {
      const pre = document.createTextNode('【MMD】');
      const sel = chars(D.who), tail = document.createTextNode(' - ' + D.song);
      const field = h('div.g-field.focus', pre, ...sel, tail);
      root.append(h('div', { style: { marginTop: '62px' } }, h('div.g-lbl', icon('pencil', 12), D.editLbl), field));
      await k.w(300);
      k.show(root.offsetWidth - 60, root.offsetHeight - 20);
      // 拖选
      await k.moveTo(sel[0], 0.02, 0.6, 800);
      k.box(sel[0]);
      await k.w(120);
      for (const c of sel) { c.classList.add('sel'); await k.moveTo(c, 1, 0.6, 110); }
      await k.w(250);
      // 浮出「设为填空」
      const fb = k.box(sel[0]), lb = k.box(sel[sel.length - 1]);
      const midX = (fb.x + lb.x + lb.w) / 2;
      const pop = h('div.g-pop', icon('sparkle', 14), h('span', D.maker), h('span.g-k', '↵'));
      root.append(pop);
      const placePop = () => { pop.style.left = midX - pop.offsetWidth / 2 + 'px'; pop.style.top = fb.y - pop.offsetHeight - 10 + 'px'; };
      placePop();
      requestAnimationFrame(() => pop.classList.add('in'));
      await k.w(650);
      await k.moveTo(pop, 0.5, 0.55, 520);
      await k.click();
      // 变成名字输入框
      const ph = h('span.g-ph', D.namePh), caret = k.caret();
      const inBox = h('span.in-box', icon('sparkle', 13), ph, caret);
      clear(pop).append(inBox);
      placePop();
      await k.move(midX + 120, fb.y - 70, 500);
      k.hideCursor();
      await k.w(300);
      ph.remove();
      const text = h('span');
      inBox.insertBefore(text, caret);
      if (zh) await k.ime(text, null, 'jiaose', [['j', ['就', '将', '级']], ['jia', ['家', '加', '价']], ['jiao', ['叫', '教', '角']], ['jiaos', ['角色', '脚色', '叫声']], ['jiaose', ['角色', '脚色', '角', '叫']]], pop);
      else await k.type(text, D.a, 70);
      await k.w(300);
      await k.key('↵', 200);
      pop.classList.add('out');
      // 选中的字换成填空
      const s = slot(D.a, '.g-new');
      sel[0].replaceWith(s);
      sel.slice(1).forEach((c) => c.remove());
      await k.w(700);
      s.classList.add('glow');
      await k.w(1400);
    },
    // ③ 填一个空：点它 → 橙色编辑区 + 上方标签 → 打字替换 → 回车填完
    async (root, k) => {
      const s1 = slot(D.a), s2 = slot(D.b);
      const field = h('div.g-field', '【MMD】', s1, ' - ', s2);
      const pill = h('span.g-pill', icon('warn', 12), D.left(2));
      root.append(h('div', { style: { marginTop: '62px' } }, h('div.g-lbl', D.pubLbl, h('span', { style: { flex: 1 } }), pill), field));
      await k.w(300);
      k.show(root.offsetWidth - 50, root.offsetHeight - 24);
      await k.moveTo(s1, 0.5, 0.6, 800);
      await k.click();
      field.classList.add('focus');
      s1.classList.add('act');
      const label = s1.textContent;
      const selSpan = h('span.g-ch.sel', label);
      clear(s1).append(selSpan);
      const tip = k.tip(s1, label);
      await k.move(k.box(s1).x + 40, k.box(s1).y + 70, 500);
      k.hideCursor();
      await k.w(500);
      // 直接打字：先替换掉选中的原文
      clear(s1);
      const text = h('span'), caret = k.caret();
      s1.append(text, caret);
      tip.follow();
      if (zh) {
        const follow = setInterval(tip.follow, 30);
        try {
          await k.ime(text, null, 'chuyin', [['c', ['从', '才', '此']], ['chu', ['出', '处', '初']], ['chuy', ['出于', '初一']], ['chuyin', ['初音', '出音', '处']]], field);
          await k.ime(text, null, 'weilai', [['w', ['我', '为', '玩']], ['wei', ['为', '未', '位']], ['weil', ['为了', '未来']], ['weilai', ['未来', '为来', '尾']]], field);
        } finally { clearInterval(follow); }
      } else {
        const follow = setInterval(tip.follow, 30);
        try { await k.type(text, D.who2, 70); } finally { clearInterval(follow); }
      }
      tip.follow();
      await k.w(500);
      await k.key('↵', 200);
      caret.remove();
      s1.classList.remove('act');
      s1.classList.add('fin', 'flash');
      tip.hide();
      field.insertBefore(k.caret(), s1.nextSibling);
      pill.textContent = '';
      pill.append(icon('warn', 12), D.left(1));
      pill.classList.add('bump');
      await k.w(1800);
    },
    // ④ 多个填空：Tab 一格一格往下填，填完「下一步」才亮
    async (root, k) => {
      const s1 = slot(D.a), s2 = slot(D.b), s3 = slot(D.c);
      const title = h('div.g-field', '【MMD】', s1, ' - ', s2);
      const body = h('div.g-field.g-body', D.model, s3);
      const pill = h('span.g-pill', icon('warn', 12), D.left(3));
      root.append(h('div', { style: { marginTop: '22px' } },
        h('div.g-lbl', D.pubLbl, h('span', { style: { flex: 1 } }), pill), title,
        h('div.g-lbl', { style: { marginTop: '12px' } }, D.bodyLbl), body));
      let left = 3;
      const tick = () => {
        left -= 1;
        clear(pill).append(icon(left ? 'warn' : 'check', 12), left ? D.left(left) : D.allOk);
        pill.classList.toggle('ok', !left);
        pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
      };
      const fill = async (s, field, value, speed) => {
        s.classList.add('act');
        const label = s.textContent;
        clear(s).append(h('span.g-ch.sel', label));
        const tip = k.tip(s, label);
        await k.w(450);
        clear(s);
        const text = h('span'), caret = k.caret();
        s.append(text, caret);
        const follow = setInterval(tip.follow, 30);
        try { await k.type(text, value, speed); } finally { clearInterval(follow); }
        tip.follow();
        await k.w(280);
        return () => { caret.remove(); s.classList.remove('act'); s.classList.add('fin', 'flash'); tip.hide(); };
      };
      await k.w(500);
      title.classList.add('focus');
      title.insertBefore(k.caret(), title.firstChild);
      await k.w(500);
      await k.key('Tab', 160);
      title.querySelector('.g-caret').remove();
      let done = await fill(s1, title, D.who2, 55);
      await k.key('Tab', 120);
      done(); tick();
      done = await fill(s2, title, D.song, 50);
      await k.key('Tab', 120);
      done(); tick();
      title.classList.remove('focus'); body.classList.add('focus');
      done = await fill(s3, body, D.author, 70);
      await k.key('↵', 160);
      done(); tick();
      await k.w(2200);
    },
  ];
  const copy = [
    { title: t('sg1t'), text: t('sg1s') },
    { title: t('sg2t'), text: t('sg2s') },
    { title: t('sg3t'), text: t('sg3s') },
    { title: t('sg4t'), text: t('sg4s'), legend: true },
  ];
  return { pages: scenes.map((play, i) => ({ ...copy[i], play })), kit, STOP };
}
