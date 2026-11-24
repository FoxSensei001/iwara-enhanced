// 全站的 Markdown 输入框换成发布页那套编辑器（mdEditor，40-markdown.js）。
//
// 站点上评论、回复、发帖、编辑帖子……所有写 Markdown 的地方用的都是同一个组件 `.markdownField`：
// 一个 textarea.textField，下面一排「0/100000 字 · 预览 · 格式」。所以只接管这一个组件，全站就都换掉了。
//
// 做法：
// - 站点的 textarea 只藏不删，它仍是表单里的那个字段；编辑器改动后用原生 setter 写回去并派发 input，
//   站点（React 受控）的表单状态跟着变，提交走站点自己的逻辑，我们不代发。
// - 站点那排「字数 / 预览 / 格式」藏掉：编辑器自己显示字数，所见即所得不需要预览，「格式」换成编辑器左下角的格式说明。
// - 反过来，站点自己改 textarea（提交后清空、论坛「引用」往里塞内容、打开编辑时填原文）：轮询发现值变了就整篇换进编辑器。
// - 点提交按钮时（pointerdown / click 捕获阶段）先把编辑器防抖里的修改立刻写回，站点拿到的一定是最新内容。
// - 编辑器在影子 DOM 里，样式与工作台共用 STYLE（构造样式表，所有输入框共用一份）；@ 联想等浮层挂在页面级的浮层宿主里。
// - 键盘事件不往外冒：站点（视频页播放器等）的全局快捷键看不出焦点在我们的影子 DOM 里，会把打字当成快捷键。
// - 填空（`{名字}`）不启用：评论里的花括号就是普通文字。
// - 关掉（siteOff 里加 'mdField'）后站点原样。

(() => {
  const FEATURE = 'mdField';
  const fields = new Set(); // { box, ta, host, ed, last, timer }
  let sheet = null, layerHost = null, layerApp = null, bound = false;

  // 影子 DOM 里的样式：工作台的整套 STYLE + 这里的小改动（不铺满整页、背景透明、编辑区矮一点）
  const LITE_CSS = `
:host{display:block!important}
.app.lite{min-height:0;background:none}
.app.lite .md-doc .ProseMirror{min-height:120px;font-size:14px;padding:12px 14px 14px}
.app.lite .md-foot{margin-top:-6px}
`;
  function styleSheet() {
    if (!sheet) { sheet = new CSSStyleSheet(); sheet.replaceSync(STYLE.join('\n') + LITE_CSS); }
    return sheet;
  }
  const dark = () => document.body.classList.contains('dark');
  const shadowApp = (host) => {
    const root = host.attachShadow({ mode: 'open' });
    root.adoptedStyleSheets = [styleSheet()];
    const app = h('div.app.lite', { data: { theme: dark() ? 'dark' : 'light' } });
    root.append(app);
    return { root, app };
  };

  /** 浮层（@ 联想、格式说明、撤销提示）挂的地方。工作台开着时它自己有一层，就用它的。 */
  function ensureLayer() {
    if (ui.layer && ui.layer.isConnected) return;
    if (!layerHost || !layerHost.isConnected) {
      layerHost = h('div.iwe-mdf-layer');
      const { root, app } = shadowApp(layerHost);
      layerApp = app;
      ui.layer = h('div.layer');
      app.append(ui.layer);
      ui.root = root;
      document.body.append(layerHost);
    } else {
      ui.layer = layerApp.querySelector('.layer');
      ui.root = layerHost.shadowRoot;
    }
  }

  const setNative = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
  function writeBack(f, text) {
    if (f.ta.value === text) { f.last = text; return; }
    setNative.call(f.ta, text);
    f.last = text;
    f.ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  /** 站点给这个输入框显示的上限（「0/100000 字」那一格，或 textarea 的 maxlength）；没有返回 null，编辑器就只显示字数。 */
  function maxLenOf(box, ta) {
    if (ta.maxLength > 0) return ta.maxLength;
    const m = (box.querySelector('.markdownField__actions__length') || {}).textContent?.match(/\/\s*([\d,.\s]+)/);
    const n = m ? Number(m[1].replace(/\D/g, '')) : 0;
    return n > 0 ? n : null;
  }

  function mount(box, ta) {
    ensureLayer();
    const host = h('div.iwe-mdf');
    const { app } = shadowApp(host);
    const f = { box, ta, host, app, last: ta.value, ed: null, timer: 0 };
    f.ed = mdEditor({
      value: ta.value,
      placeholder: ta.placeholder || '',
      maxLength: maxLenOf(box, ta) || 100000,
      limit: !!maxLenOf(box, ta),
      help: true,
      slots: false,
      scrollMargin: { top: 84, bottom: 24 },
      onChange: (text) => writeBack(f, text),
    });
    app.append(f.ed.el);
    // 站点的全局快捷键（播放器的空格 / 方向键等）在 document 上听：别让打字冒出去
    for (const type of ['keydown', 'keypress', 'keyup']) host.addEventListener(type, (e) => e.stopPropagation());
    host.addEventListener('focusin', ensureLayer);
    ta.before(host);
    // 不用 class：站点（React）每次重渲染都会整串改写 className（空 / 非空切换 markdownField--empty），我们加的会被冲掉
    box.setAttribute('data-iwe-mdf', '');
    // 站点自己改了 textarea（提交后清空、引用、填原文）：整篇换进编辑器
    f.timer = setInterval(() => {
      if (!ta.isConnected || !host.isConnected) { unmount(f); return; }
      if (ta.value !== f.last) { f.last = ta.value; f.ed.set(ta.value); }
    }, 300);
    fields.add(f);
    // 站点把焦点给了这个输入框（点「回复」后自动聚焦）：交给编辑器
    if (document.activeElement === ta || ta.autofocus) f.ed.focus();
    return f;
  }
  function unmount(f) {
    clearInterval(f.timer);
    fields.delete(f);
    try { f.ed.destroy(); } catch { /* 忽略 */ }
    f.host.remove();
    if (f.box.isConnected) f.box.removeAttribute('data-iwe-mdf');
  }

  // 提交前把防抖里的修改交出去：按下提交键那一刻（早于站点的 click / submit 处理）
  function flush(e) {
    const form = e.target.closest && e.target.closest('form');
    if (!form) return;
    for (const f of fields) if (form.contains(f.box)) f.ed.commit();
  }
  function onSubmitPress(e) {
    const btn = e.target.closest && e.target.closest('button[type=submit], input[type=submit]');
    if (btn) flush(e);
  }

  site.register(FEATURE, {
    css: `
[data-iwe-mdf]>textarea.textField,[data-iwe-mdf]>.markdownField__actions{display:none!important}
.iwe-mdf{display:block;width:100%}
.iwe-mdf-layer{position:fixed;inset:0;width:0;height:0;z-index:2147483000}
`,
    scan(ctx) {
      if (!bound) {
        bound = true;
        document.addEventListener('pointerdown', onSubmitPress, true);
        document.addEventListener('click', onSubmitPress, true);
        document.addEventListener('submit', flush, true);
      }
      for (const box of document.querySelectorAll('.markdownField')) {
        if (box.closest('#iwe-host')) continue;
        const ta = box.querySelector(':scope > textarea');
        if (!ta) continue;
        const cur = [...fields].find((f) => f.box === box);
        if (cur && cur.ta === ta && cur.host.isConnected) continue;
        if (cur) unmount(cur); // 站点换了一个新的 textarea：重新接
        mount(box, ta);
      }
      for (const f of fields) {
        if (!f.ta.isConnected) { unmount(f); continue; }
        const th = ctx.dark ? 'dark' : 'light';
        if (f.app.dataset.theme !== th) f.app.dataset.theme = th;
      }
      if (layerApp) layerApp.dataset.theme = ctx.dark ? 'dark' : 'light';
    },
    leave() { [...fields].forEach(unmount); },
  });
})();
