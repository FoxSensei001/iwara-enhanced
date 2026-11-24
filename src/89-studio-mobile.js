// 创作工作台（内容管理 / 发布 / 编辑，视频与图库）的手机与触屏适配。
// 单独一段、排在各页样式之后：窄屏规则集中在这里，覆盖前面各段的桌面写法。

STYLE.push(`
/* 任何宽度：分段、步骤、标题都不许被挤成一字一行 */
.seg button,.steps li,.top h1{white-space:nowrap}

/* 触屏没有悬停：只在悬停时出现的操作改为常显，键盘快捷键提示不显示 */
@media (hover:none){
  .work2 .acts{opacity:1;transform:none}
  .work2:hover{transform:none;box-shadow:none}
  .imgc .rm{opacity:1}
  .tpl .ibtn{opacity:1}
  .tpl:hover{transform:none;box-shadow:none}
  .kbd{display:none}
  /* 图库格子长按拿起排序：不弹系统长按菜单、不选中文字；拿起的那格跟着手指，要看得清 */
  .imgc{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none;cursor:default}
  .imgc.drag{opacity:.92;box-shadow:var(--shadow);transition:none}
}

@media (max-width:640px){
  .wrap{padding:14px 16px 0}
  .top{flex-wrap:wrap;gap:8px 8px;margin-bottom:18px}
  .top h1{font-size:19px}
  .top .btn{height:32px;padding:0 10px;font-size:13px}
  .top .seg button{height:28px;padding:0 10px}
  .top .seg .thumb{height:28px}

  /* 内容管理：第一行标题 + 类型 + 帖子/投票，第二行发布与菜单靠右 */
  .wide>.top{row-gap:0}
  .wide>.top .sp{flex-basis:100%;height:0}
  .wide>.top .sp~*{margin-top:8px}
  .wide>.top .btn.primary{margin-left:auto}
  .stats{gap:8px;margin-bottom:16px}
  .stat{padding:10px 12px;border-radius:12px}
  .stat .v{font-size:20px}
  .stat .k{font-size:12px}
  .tools{margin-bottom:12px}
  .tools .field{flex:1;width:auto;min-width:0}
  .tools>.grow{display:none}
  .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .work2{border-radius:12px}
  .work2 .info{padding:8px 10px 10px}
  .work2 .ttl{font-size:13px;min-height:36px}
  .work2 .nums{gap:8px;margin-top:6px;font-size:11.5px;flex-wrap:wrap}
  .work2 .nums span:nth-child(3){display:none}
  .work2 .nums .when{margin-left:0;width:100%}
  .work2 .acts button{height:30px;min-width:30px}
  .empty{padding:48px 0}

  /* 发布：步骤条只留当前步的名字，其余只留圆点 */
  .steps{margin-bottom:20px}
  .steps .bar{margin:0 8px;min-width:12px}
  .steps li:not(.cur)>span:last-child{display:none}
  .titlebox input,.titlebox .back{font-size:20px;padding:6px 12px}
  .titlebox input{padding-right:84px}
  /* 发布步的预览卡：单栏时整宽 16:9 占掉大半屏，改成左图右文的一行 */
  .pcard{position:static;display:grid;grid-template-columns:128px minmax(0,1fr);align-items:start}
  .pcard .shot{border-radius:0 0 10px 0}
  .pcard .info{padding:8px 12px 10px}
  .pcard .ttl{font-size:13px}
  .pcard .shot .badge,.pcard .shot .rate{font-size:10px}
  .drop{min-height:200px}
  .drop .hint{font-size:14px;padding:0 16px;text-align:center}
  .stagebox video,.stagebox img.poster{max-height:240px}
  .imgs{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .fchk .fr{grid-template-columns:28px 52px minmax(0,1fr) auto;padding:8px 12px;gap:8px}
  .film button,.film .sk{width:96px}
  .navbar{margin:auto -16px 0;padding:32px 16px calc(12px + env(safe-area-inset-bottom))}
  .navbar .btn.ghost>span{display:none}
  .navbar .btn.ghost{width:36px;padding:0}
  .done{padding-top:32px}

  /* 弹层：从底部升起，占满宽度 */
  .scrim{place-items:end center;padding:0}
  .sheet{width:100%!important;max-height:90vh;border-radius:16px 16px 0 0;border-bottom:0;transform:translateY(40px)}
  .sheet>header{padding:14px 12px 0 16px}
  .sheet>.body{padding:14px 16px 16px}
  .sheet>footer{padding:12px 16px calc(12px + env(safe-area-inset-bottom));border-radius:0;flex-wrap:wrap}
  .tpls{grid-template-columns:1fr}

  /* 提示条抬到底栏上方，不挡「下一步」 */
  .toasts{bottom:calc(76px + env(safe-area-inset-bottom));width:calc(100% - 32px)}
  .toast{max-width:100%}
  .toast>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
}

/* 触屏填空：键盘上沿的填空条（只在触屏上创建，见 75-wizard.js） */
.sbar{position:fixed;left:8px;right:8px;bottom:0;margin-bottom:8px;display:flex;align-items:center;gap:6px;padding:6px 6px 6px 12px;border-radius:14px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);
  opacity:0;transform:translateY(14px);pointer-events:none!important;transition:opacity .16s,transform .4s var(--spring)}
.sbar.in{opacity:1;transform:none;pointer-events:auto!important}
.sb-txt{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.3}
.sb-name{display:flex;align-items:center;gap:5px;min-width:0;font-weight:600;font-size:13.5px;color:var(--amber)}
.sb-name span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sbar.ok .sb-name{color:var(--green)}
.sb-info{font-size:11.5px;color:var(--fg3)}
.sb-info[hidden]{display:none}
.sb-btn{display:inline-flex;align-items:center;gap:4px;flex:none;height:38px;padding:0 11px;border-radius:10px;border:1px solid var(--line2);background:var(--card);font-size:13.5px;font-weight:500;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .2s var(--ease)}
.sb-btn:active{transform:scale(.94)}
.sb-btn[hidden]{display:none}
.sb-btn.pri{background:var(--fg);border-color:var(--fg);color:var(--inv)}
.sb-btn.del{border-color:transparent;background:none;color:var(--fg2);padding:0 8px}
.navbar.kb{visibility:hidden}
@media (max-width:360px){.sb-btn.del span{display:none}}
/* 很窄的屏（≤380）：发布页顶栏的「模板」只留图标，和标题、类型切换挤在一行 */
@media (max-width:380px){.wrap:not(.wide)>.top .btn:not(.primary){width:32px;padding:0}.wrap:not(.wide)>.top .btn:not(.primary)>span{display:none}.top h1{font-size:18px}}
`);
