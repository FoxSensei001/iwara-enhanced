// 「规则」确认的重做：发帖、发评论、发主题等表单里的「按下提交按钮…即表示我同意…符合网站规则」勾选框。
//
// 站点原样：一整行「规则 ☐ 按下提交按钮并创建帖子，即表示我同意……」，每次打开表单都是空的、必须勾。
// 旧做法（表单一出现就替用户 click 勾上）有副作用：站点把「勾过」算成表单被改过，
// 之后切页面、关标签都弹「确定离开吗」——光是看了一眼带评论区的页面就被拦（用户 2026-11-24 反馈）。
//
// 现在：
// - 站点那一行藏起来（元素还在，站点照常用），提交按钮那一排左边换成一个小开关「☐ 同意 规则」；
// - 开关只记在本机（store 'rulesAgreed'），记住用户上次的选择；从没勾过就是不勾，不替用户做决定（2026-11-24 用户定）；
// - 拨开关不碰站点的表单，所以光看页面不会让表单变「已修改」；
// - 用户按提交时（点击 / 回车触发的隐式提交都会先派发提交按钮的 click），在浏览器做必填校验之前：
//     开关是勾的 → 这时才替站点勾上它自己的勾选框，提交照常进行；
//     开关没勾   → 拦下这次提交，开关闪一下提示先同意（否则浏览器会因为藏起来的必填框静默失败）。
// - 只认站点自己的 `input[name=rulesAgreement]`，不碰别的勾选框；不代发内容，提交键仍由用户自己按。
// - 关闭方式同其他站点增强（siteOff 里加 'autoRules'），关掉后站点原样。

(() => {
  defineStrings(
    { arAgree: '同意', arRules: '规则', arAfter: '', arTip: '提交即表示内容符合网站规则', arNeed: '请先勾选「同意规则」' },
    { arAgree: 'I agree to the', arRules: 'rules', arAfter: '', arTip: 'Submitting confirms the content follows the site rules', arNeed: 'Please agree to the rules first' },
    { arAgree: '', arRules: 'ルール', arAfter: 'に同意する', arTip: '送信すると、内容がサイトのルールに沿っていることを確認したものとみなされます', arNeed: '先にルールへの同意にチェックを入れてください' },
  );
  const KEY = 'rulesAgreed';
  const agreed = () => !!store.get(KEY, false);
  const boxOf = (form) => form && form.querySelector('input[type=checkbox][name=rulesAgreement]');
  let bound = false;

  // 每张表单一个开关：放在提交按钮那一排的最左边（那一排不是 flex 就放在站点原来那一行的位置）
  function mount(form, box) {
    let ui = form.querySelector(':scope [data-iwe-rules]');
    const siteRow = box.closest('label') || box.parentElement;
    siteRow.classList.add('iwe-rules-hide');
    if (ui && ui.isConnected) { sync(ui); return; }
    const cb = h('input', { type: 'checkbox', onchange: () => { store.set(KEY, cb.checked); for (const u of document.querySelectorAll('[data-iwe-rules] input')) u.checked = cb.checked; ui.classList.remove('need'); } });
    ui = h('label.iwe-rules', { 'data-iwe-rules': '', title: t('arTip') },
      cb, t('arAgree') && h('span', t('arAgree')),
      h('a', { href: '/rules', target: '_blank', rel: 'noopener', onclick: (e) => e.stopPropagation() }, t('arRules')),
      t('arAfter') && h('span', { style: { marginLeft: '-6px' } }, t('arAfter'))); // 日文「ルールに同意する」：链接后紧跟，不留间距
    // 开关不属于站点表单：不带 name，表单提交时也不会带上它；change 冒泡上去也不让站点的表单库看到
    ui.addEventListener('change', (e) => e.stopPropagation());
    ui.addEventListener('input', (e) => e.stopPropagation());
    const submit = form.querySelector('button[type=submit]');
    const row = submit && submit.parentElement;
    // 那一排只有按钮（论坛回复是一个单独的块里只放提交键）：改成 flex 行，开关和提交键并排，与评论框一致
    if (row && row !== form && !getComputedStyle(row).display.includes('flex') && [...row.children].every((c) => c.matches('button, input[type=submit]'))) row.classList.add('iwe-rules-flex');
    if (row && row !== form && getComputedStyle(row).display.includes('flex')) { row.classList.add('iwe-rules-row'); row.prepend(ui); }
    else siteRow.after(ui);
    sync(ui);
  }
  const sync = (ui) => { const cb = ui.querySelector('input'); if (cb.checked !== agreed()) cb.checked = agreed(); };

  // 提交按钮的 click（捕获阶段，早于站点和浏览器的必填校验）
  function onClick(e) {
    if (site.isOff('autoRules')) return;
    const btn = e.target.closest && e.target.closest('button[type=submit], input[type=submit]');
    const form = btn && btn.form;
    const box = boxOf(form);
    const ui = form && form.querySelector('[data-iwe-rules]');
    if (!box || !ui || box.disabled) return;
    if (agreed()) { if (!box.checked) box.click(); return; }
    // 没同意：拦下，提示开关
    e.preventDefault(); e.stopImmediatePropagation();
    ui.classList.remove('need'); void ui.offsetWidth; ui.classList.add('need');
    ui.setAttribute('title', t('arNeed'));
    ui.querySelector('input').focus({ preventScroll: true });
  }

  site.register('autoRules', {
    css: `
.iwe-rules-hide{display:none!important}
.iwe-rules-row{gap:12px}
.iwe-rules-flex{display:flex!important;align-items:center;justify-content:flex-end;margin-top:16px}
.iwe-rules-flex>.mt-4{margin-top:0!important}
.iwe-rules{display:inline-flex;align-items:center;gap:6px;margin:0 auto 0 0;padding:4px 8px 4px 4px;border-radius:6px;color:var(--text-muted,var(--muted,#8f8f8f));font-size:13px;line-height:1.2;cursor:pointer;user-select:none;-webkit-user-select:none;white-space:nowrap;transition:background .15s,color .15s}
.iwe-rules:hover{background:rgba(128,128,128,.12);color:var(--text)}
.iwe-rules input{width:16px;height:16px;margin:0;accent-color:var(--primary,#1abc9c);cursor:pointer}
.iwe-rules a{color:var(--primary,#1abc9c)!important;text-decoration:none!important}
.iwe-rules a:hover{text-decoration:underline!important}
.iwe-rules:has(input:focus-visible){outline:2px solid var(--primary,#1abc9c);outline-offset:1px}
label.iwe-rules:not(.iwe-rules-row *){margin:8px 0 0}
.iwe-rules.need{color:var(--red,#e5484d);background:rgba(229,72,77,.12);animation:iwe-rules-shake .36s ease}
@keyframes iwe-rules-shake{20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}
@media (prefers-reduced-motion:reduce){.iwe-rules.need{animation:none}}
`,
    scan() {
      if (!bound) { bound = true; document.addEventListener('click', onClick, true); }
      for (const box of document.querySelectorAll('input[type=checkbox][name=rulesAgreement]')) {
        if (box.form) mount(box.form, box);
      }
    },
    leave() {
      document.querySelectorAll('[data-iwe-rules]').forEach((e) => e.remove());
      document.querySelectorAll('.iwe-rules-hide').forEach((e) => e.classList.remove('iwe-rules-hide'));
      document.querySelectorAll('.iwe-rules-row, .iwe-rules-flex').forEach((e) => e.classList.remove('iwe-rules-row', 'iwe-rules-flex'));
    },
  });
})();
