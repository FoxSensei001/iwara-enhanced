// 作者页「发布」列表（/profile/xxx/posts）：站点把每条帖子渲染成一段裸文字（标题 + 日期 + 全文），长帖一条就占好几屏，条与条之间没有分隔。
// 这里把每条做成一张卡片：卡片底色沿用站点容器卡片，标题可点、日期当副标题。站点自己把正文截在 200px 高并渐隐（没有任何办法展开，只能点进帖子），
// 这里在被截掉内容的卡片上加「展开全文」，点开去掉截断；没被截的短帖不受影响。

(() => {
  defineStrings(
    { pcMore: '展开全文', pcLess: '收起' },
    { pcMore: 'Show more', pcLess: 'Show less' },
    { pcMore: '全文を表示', pcLess: '折りたたむ' },
  );

  site.register('postCards', {
    match: (path) => /^\/profile\/[^/]+\/posts\/?$/.test(path),
    css: `
.page-profile__content .postTeaser{position:relative;margin:0 0 14px;padding:16px 18px 14px;border-radius:8px;background:var(--body-alt,#ededed);box-shadow:0 1px 3px rgba(0,0,0,.1);transition:box-shadow .18s}
.page-profile__content .postTeaser:hover{box-shadow:0 3px 12px rgba(0,0,0,.14)}
.page-profile__content .postTeaser>a{display:block;text-decoration:none}
.page-profile__content .postTeaser>a .text--h3{font-size:18px;line-height:1.35;letter-spacing:-.01em}
.page-profile__content .postTeaser>a:hover .text--h3{text-decoration:underline;text-underline-offset:3px}
.page-profile__content .postTeaser>.text--muted{margin:6px 0 12px;font-size:12px;opacity:.8}
.page-profile__content .postTeaser__body{position:relative;line-height:1.65}
.page-profile__content .postTeaser__body .markdown{overflow-wrap:anywhere}
.page-profile__content .postTeaser__body img{max-width:100%;height:auto}
/* 站点对每条正文都套了渐隐遮罩，哪怕没被截断，最后几行也会发虚：只在真被截断（有「展开全文」）时才保留遮罩 */
.page-profile__content .postTeaser__body{-webkit-mask:none;mask:none}
.iwe-pc-clamp:not(.iwe-pc-open) .postTeaser__body{mask:url("#gradient-mask")}
/* 展开：去掉站点的 200px 截断和渐隐遮罩 */
.iwe-pc-open .postTeaser__body{max-height:none!important;-webkit-mask:none!important;mask:none!important}
.iwe-pc-toggle{appearance:none;display:inline-flex;align-items:center;gap:6px;margin-top:10px;height:30px;padding:0 12px;border:1px solid var(--primary,#1abc9c);border-radius:5px;background:transparent;color:var(--primary,#1abc9c);font:500 13px/1 inherit;font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.iwe-pc-toggle:hover{background:var(--primary,#1abc9c);color:#fff}
.iwe-pc-toggle svg{transition:transform .18s}
.iwe-pc-open .iwe-pc-toggle svg{transform:rotate(180deg)}
@media (max-width:600px){.page-profile__content .postTeaser{padding:14px 14px 12px;border-radius:10px}.page-profile__content .postTeaser>a .text--h3{font-size:17px}.iwe-pc-toggle{height:36px}}
`,
    scan() {
      for (const card of document.querySelectorAll('.page-profile__content .postTeaser')) {
        const body = card.querySelector('.postTeaser__body');
        if (!body) continue;
        const open = card.classList.contains('iwe-pc-open');
        const need = open || body.scrollHeight > body.clientHeight + 4; // 被站点截掉了内容
        let btn = card.querySelector(':scope > .iwe-pc-toggle');
        if (!need) { card.classList.remove('iwe-pc-clamp'); if (btn) btn.remove(); continue; }
        card.classList.add('iwe-pc-clamp');
        if (!btn) {
          const label = h('span');
          btn = h('button.iwe-pc-toggle', { type: 'button' }, label, icon('chevronDown', 14));
          const sync = () => { label.textContent = card.classList.contains('iwe-pc-open') ? t('pcLess') : t('pcMore'); };
          btn.addEventListener('click', () => { card.classList.toggle('iwe-pc-open'); sync(); });
          sync();
          body.after(btn);
        }
      }
    },
    leave() {
      document.querySelectorAll('.iwe-pc-toggle').forEach((e) => e.remove());
      document.querySelectorAll('.iwe-pc-clamp,.iwe-pc-open').forEach((e) => e.classList.remove('iwe-pc-clamp', 'iwe-pc-open'));
    },
  });
})();
