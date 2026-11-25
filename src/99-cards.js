// 视频 / 图库卡片：同一行里卡片等高，作者那一行（头像 + 昵称 + 时间）固定贴在卡片底部。
//
// 站点的卡片是「缩略图 → 标题（最多两行）→ 作者行」顺着往下排，标题只有一行时作者行就跟着上移，
// 同一行里的头像高低不齐。做法：放列表卡片的那一列（.col-*）改成弹性容器，卡片撑满整列、改成纵向弹性布局，
// 作者行 margin-top:auto 贴底。整行里没有两行标题的话，各卡片本来就一样高，看不出变化。
// 只管列表里的卡片（排除侧栏用的 --wide 横排小卡）。

site.register('cardAlign', {
  css: `
[class*="col-"]:has(> .videoTeaser:not(.videoTeaser--wide)),
[class*="col-"]:has(> .imageTeaser) { display: flex; }
.videoTeaser:not(.videoTeaser--wide), .imageTeaser { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; }
/* 视频卡片的标题和作者行包在 .videoTeaser__content 里，图库卡片没有这层 */
.videoTeaser:not(.videoTeaser--wide) > .videoTeaser__content { flex: 1 1 auto; display: flex; flex-direction: column; }
.videoTeaser:not(.videoTeaser--wide) .videoTeaser__bottom, .imageTeaser > .imageTeaser__bottom { margin-top: auto !important; }
`,
  scan() {},
});

// 卡片间距收紧：站点列表每列左右各 15px 内边距（卡片横向隔 30px）、列下边距 15px 再加卡片下边距 15px（纵向隔 30px），
// 标题上方 7.5px、作者行上方 7.5px。收成横向 16px、纵向 16px、标题上方 6px，只作用于列表里的卡片（不动侧栏的 --wide 小卡）。
site.register('cardSpacing', {
  css: `
.row:has(> [class*="col-"] > .videoTeaser:not(.videoTeaser--wide)),
.row:has(> [class*="col-"] > .imageTeaser) { margin-left: -8px; margin-right: -8px; }
[class*="col-"]:has(> .videoTeaser:not(.videoTeaser--wide)),
[class*="col-"]:has(> .imageTeaser) { padding-left: 8px; padding-right: 8px; margin-bottom: 4px; }
.videoTeaser:not(.videoTeaser--wide), .imageTeaser { margin-bottom: 12px; }
.videoTeaser:not(.videoTeaser--wide) .videoTeaser__title, .imageTeaser > .imageTeaser__title { margin-top: 6px; margin-bottom: 0; }
.videoTeaser:not(.videoTeaser--wide) .videoTeaser__bottom, .imageTeaser > .imageTeaser__bottom { padding-top: 6px; }
`,
  scan() {},
});

// 缩略图加大圆角（站点原来只有 2px），封面上的标签照 LoveIwara 的摆法：
// 全部贴着封面边缘（偏移 0、不悬空），被封面圆角一起裁切，只有朝内的那个角带小圆角。
// 左上播放量、右上点赞、左下分级、右下时长 / 图集数。
site.register('cardRadius', {
  css: `
.videoTeaser__thumbnail, .imageTeaser__thumbnail { border-radius: 10px !important; overflow: hidden; }
.videoTeaser__thumbnail .views, .imageTeaser__thumbnail .views { top: 0 !important; left: 0 !important; margin: 0 !important; border-radius: 0 0 6px 0 !important; }
.videoTeaser__thumbnail .likes, .imageTeaser__thumbnail .likes { top: 0 !important; right: 0 !important; margin: 0 !important; border-radius: 0 0 0 6px !important; }
.videoTeaser__thumbnail .duration, .imageTeaser__thumbnail .gallery { bottom: 0 !important; right: 0 !important; margin: 0 !important; border-radius: 6px 0 0 0 !important; }
.videoTeaser__thumbnail .rating, .imageTeaser__thumbnail .rating { bottom: 0 !important; left: 0 !important; margin: 0 !important; border-radius: 0 6px 0 0 !important; }
`,
  scan() {},
});

// 视频 / 图库详情页右栏「更多来自用户」「更像这样」：站点在这条约 240px 宽的栏里也排两列竖卡，
// 卡宽只有 117px，标题却是 16px 粗体，一行只放得下五六个字，作者行（头像 + 昵称 + 时间）挤成一团。
// 栏窄时改成单列横排：左缩略图（16:9，只留播放量 / 时长 / 图集数三个角标），右边两行标题，下面昵称、时间各一行，不显示头像。
// 用容器查询按这一栏的实际宽度判断：手机上这两块排在正文下面、栏够宽时，保持站点原来的两列竖卡。
site.register('sideList', {
  css: `
.moreFromUser__items, .moreLikeThis__items { container-type: inline-size; }
@container (max-width: 440px) {
  :is(.moreFromUser__item, .moreLikeThis__item) { width: 100% !important; margin: 0 0 12px !important; }
  :is(.moreFromUser__item, .moreLikeThis__item):last-child { margin-bottom: 0 !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) > :is(.videoTeaser, .imageTeaser) {
    display: grid !important; grid-template-columns: 112px minmax(0, 1fr); grid-template-rows: auto 1fr;
    column-gap: 10px; align-items: start; margin: 0 !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.videoTeaser__thumbnail, .imageTeaser__thumbnail) {
    grid-row: 1 / 3; display: block; aspect-ratio: 16 / 9; border-radius: 8px !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.videoTeaser__thumbnail, .imageTeaser__thumbnail) > img {
    width: 100% !important; height: 100% !important; object-fit: cover; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.likes, .rating) { display: none !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.views, .duration, .gallery) { padding: 1px 5px !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.views, .duration, .gallery) .text { font-size: 10px !important; line-height: 14px !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.views, .duration, .gallery) .icon { width: 9px; height: 9px; }
  /* 视频卡片：标题和作者行包在 __content 里，占右边一整格；图库卡片没有这层，标题、作者行分占右边上下两格 */
  :is(.moreFromUser__item, .moreLikeThis__item) .videoTeaser__content { grid-row: 1 / 3; display: flex; flex-direction: column; min-width: 0; align-self: stretch; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.videoTeaser__title, .imageTeaser__title) { display: block; margin: 0 !important; min-width: 0; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.videoTeaser__title, .imageTeaser__title) > .text {
    font-size: 13px !important; line-height: 1.4 !important; font-weight: 600 !important;
    display: -webkit-box !important; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; white-space: normal !important; word-break: break-word; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.videoTeaser__bottom, .imageTeaser__bottom) {
    display: flex !important; align-items: center; min-width: 0; margin-top: auto !important; padding-top: 2px !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) :is(.videoTeaser__bottom, .imageTeaser__bottom) > .avatar { display: none !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) .byline { display: flex !important; flex-direction: column; min-width: 0; flex: 1 1 auto; }
  :is(.moreFromUser__item, .moreLikeThis__item) .byline .text { font-size: 12px !important; line-height: 1.35 !important; }
  :is(.moreFromUser__item, .moreLikeThis__item) .byline > .text { color: var(--muted, #848484); }
  :is(.moreFromUser__item, .moreLikeThis__item) .iwe-pv-more { width: 26px; height: 26px; margin-right: -4px; }
}
`,
  scan() {},
});

// 页面底部页脚（链接 / 公告 / 最近的论坛帖子那一排）：浅色主题下背景换成 #f2f2f2（站点原本是 var(--body-dark)，比页面深一档）。
// 深色主题不动。
site.register('footerBg', {
  css: `body:not(.dark) .footer { background: #f2f2f2 !important; }`,
  scan() {},
});
