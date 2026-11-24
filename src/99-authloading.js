// 提交按钮的加载态：点下去立刻转圈并禁用（防重复提交），请求结束再恢复。
// 站点自己没有这个状态：点了没反应，网慢时用户会再点、或以为没点上。
//
// 管哪些表单：
// - 登录 / 注册页的表单；
// - 发内容的表单：评论、回复、论坛回复 / 发帖、编辑……认法是表单里有 Markdown 输入框（.markdownField）或「同意规则」勾选框
//   （用户 2026-11-24：「提交按钮没有做 loading 效果」。按机制统一做，不逐个页面补）。
// 站内搜索之类只读的表单不转圈（不发写请求，转了也只会闪一下）。
//
// 结束的判断：提交后 2.5 秒内没有写请求（前端校验没过）立刻恢复；第一个写请求（POST / PUT）结束——失败（非 2xx / 网络错误）马上恢复；
// 登录成功会跳走，保持转圈直到换页（最多 8 秒兜底）；其余成功一结束就恢复（评论发完原地清空，发帖成功站点自己跳走）。
// 只在真正提交时开始转：认 submit 事件（浏览器必填校验过了、没被拦下才会派发）；被「同意规则」拦下的点击不转。
// 可在设置里单独关掉（功能名沿用 authLoading，免得已关掉的人设置失效）。

(() => {
  const AUTH = /^\/(login|register)\b/;
  const loading = new Map(); // 按钮 → { timer, offApi }

  function stop(b) {
    const s = loading.get(b);
    if (!s) return;
    loading.delete(b);
    clearTimeout(s.timer);
    if (s.offApi) s.offApi();
    b.classList.remove('iwe-btn-loading'); b.removeAttribute('aria-busy'); b.disabled = false;
  }
  function start(b) {
    if (loading.has(b)) return;
    const s = { timer: 0, offApi: null };
    loading.set(b, s);
    b.classList.add('iwe-btn-loading'); b.setAttribute('aria-busy', 'true');
    // disabled 要晚一拍：同步设会让浏览器放弃本次表单提交
    setTimeout(() => { if (loading.get(b) === s) b.disabled = true; }, 0);
    const isLogin = location.pathname.startsWith('/login');
    let seen = false;
    s.offApi = siteData.onWrite((url, method, statusP) => {
      if (seen || loading.get(b) !== s) return;
      seen = true;
      clearTimeout(s.timer); s.timer = setTimeout(() => stop(b), 30000); // 请求已发出：等它结束，最多 30 秒
      statusP.then((status) => {
        if (loading.get(b) !== s) return;
        if (status >= 200 && status < 300 && isLogin) { clearTimeout(s.timer); s.timer = setTimeout(() => stop(b), 8000); return; } // 成功：等页面跳走
        stop(b);
      });
    });
    s.timer = setTimeout(() => stop(b), 2500); // 2.5 秒内没发出写请求 = 前端校验没过（站点已就地报错），不用转圈等
  }

  /** 这张表单的提交要不要转圈。 */
  function wants(form) {
    if (!(form instanceof HTMLFormElement) || form.closest('#iwe-host')) return false;
    if (AUTH.test(location.pathname)) return !!form.closest('section.content, .page');
    return !!form.querySelector('.markdownField, input[type=checkbox][name=rulesAgreement]');
  }
  const submitBtn = (form, submitter) => (submitter && submitter.matches('button[type=submit], input[type=submit]') ? submitter : form.querySelector('button[type=submit]'));

  let bound = false;
  site.register('authLoading', {
    css: `
.iwe-btn-loading{position:relative;pointer-events:none;opacity:.85;cursor:progress;color:transparent!important}
.iwe-btn-loading *{visibility:hidden}
.iwe-btn-loading::after{content:"";position:absolute;left:50%;top:50%;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:2px solid rgba(255,255,255,.55);border-top-color:#fff;animation:iwe-btn-spin .7s linear infinite}
@keyframes iwe-btn-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.iwe-btn-loading::after{animation-duration:2s}}
`,
    scan() {
      // 提交过程中站点把按钮换掉了（重渲染）：旧按钮的状态不用留
      for (const b of loading.keys()) if (!b.isConnected) stop(b);
      if (bound) return;
      bound = true;
      // 提交按钮可能被站点重绘，监听放在 document 上；capture 保证站点处理前就转起来
      document.addEventListener('submit', (e) => {
        const f = e.target;
        if (!wants(f)) return;
        const b = submitBtn(f, e.submitter);
        if (b) start(b);
      }, true);
      // 有些按钮不走 submit 事件（站点自己的点击处理函数）：兜底再认一次点击。
      // 等一拍再看：被拦下的点击（「同意规则」没勾、浏览器必填校验没过）不转
      document.addEventListener('click', (e) => {
        const b = e.target.closest && e.target.closest('form button[type=submit]');
        if (!b || b.disabled || !wants(b.form)) return;
        const form = b.form;
        let submitted = false;
        const mark = () => { submitted = true; };
        form.addEventListener('submit', mark, { once: true, capture: true });
        setTimeout(() => {
          form.removeEventListener('submit', mark, true);
          if (!submitted && !e.defaultPrevented && form.checkValidity()) start(b);
        }, 0);
      }, true);
    },
    leave() { [...loading.keys()].forEach(stop); },
  });
})();
