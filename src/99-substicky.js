// 订阅页（/subscriptions/*）右侧的「视频 / 图像 / 帖子」菜单：列表很长时随滚动钉在顶栏下面（宽屏左右分栏时才生效；窄屏它在列表上方，不钉）。
// 包住它的列（col-lg-3）是 position:relative、和左边列表等高，所以 sticky 能一直跟到列表末尾。

site.register('subSticky', {
  match: (path) => /^\/subscriptions(\/|$)/.test(path),
  css: `
@media (min-width:992px){
  .page-subscriptions__menu{position:relative}
  .col-lg-3:has(>.block .page-subscriptions__menu)>.block:not(.iwe-pager-after){position:sticky;top:80px;z-index:2}
}
`,
});
