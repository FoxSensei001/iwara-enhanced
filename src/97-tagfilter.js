// 视频/图库列表页的增强版标签筛选：搜索标签、显示译名、记住常用标签、改 URL 参数刷新列表。
//
// URL 参数 `?tags=a,b` 是「同时包含」：`/videos?tags=mikumikudance,dance` 返回的 32 条全部同时带这两个标签。
// （和搜索框里的 `{tags:[a,b]}` 不一样，那个是「任一」。）

// 增强版标签筛选给别的页面复用（订阅页筛选，见 99-subfilter.js）；在本文件里赋值
let iweTagFilterKit = null;

(() => { // 作用域隔离，防止变量名冲突

defineStrings({
  tagfilter_search: '搜索标签',
  tagfilter_recent: '最近用过',
  tagfilter_common: '常用标签',
  tagfilter_emptyHint: '搜索并点选标签来筛选。用过的标签会留在这里，常用的可以在「管理标签」里收藏。',
  tagfilter_pinnedMark: '已收藏',
  tagfilter_manageTags: '管理标签',
  tagfilter_display: '标签显示',
  tagfilter_displayTranslated: '译名',
  tagfilter_displayOriginal: '原名',
  tagfilter_backToOriginal: '切回原版筛选',
  tagfilter_useEnhanced: '使用增强筛选',
  tagfilter_noResults: '无结果',
  tagfilter_saved: '已保存标签组合',
  tagfilter_saveCurrent: '保存当前组合',
  tagfilter_saveName: '给这组标签起个名字',
  tagfilter_save: '保存',
  tagfilter_cancel: '取消',
  tagfilter_rename: '重命名',
  tagfilter_delete: '删除',
  tagfilter_pinned: '收藏标签',
  tagfilter_done: '完成',
  tagfilter_clearRecent: '清空最近',
  tagfilter_pin: '收藏',
  tagfilter_unpin: '取消收藏',
  tagfilter_forget: '从最近移除',
  tagfilter_defaultName: '标签组合 {n}',
  tagfilter_reset: '重置',
  tagfilter_close: '关闭',
  tagfilter_manageTitle: '管理标签与筛选',
  tagfilter_manageEmpty: '暂无内容',
  tagfilter_renamePrompt: '新的名字',
  tagfilter_tabTags: '标签',
  tagfilter_tabFilters: '筛选',
}, {
  tagfilter_search: 'Search Tags',
  tagfilter_recent: 'Recently Used',
  tagfilter_common: 'Your Tags',
  tagfilter_emptyHint: 'Search and pick tags to filter. Tags you use stay here; star your favorites in Manage Tags.',
  tagfilter_pinnedMark: 'Favorite',
  tagfilter_manageTags: 'Manage Tags',
  tagfilter_display: 'Show tags as',
  tagfilter_displayTranslated: 'Translated',
  tagfilter_displayOriginal: 'Original',
  tagfilter_backToOriginal: 'Back to Original Filter',
  tagfilter_useEnhanced: 'Use Enhanced Filter',
  tagfilter_noResults: 'No Results',
  tagfilter_saved: 'Saved Tag Sets',
  tagfilter_saveCurrent: 'Save current tags',
  tagfilter_saveName: 'Name this tag set',
  tagfilter_save: 'Save',
  tagfilter_cancel: 'Cancel',
  tagfilter_rename: 'Rename',
  tagfilter_delete: 'Delete',
  tagfilter_pinned: 'Favorite Tags',
  tagfilter_done: 'Done',
  tagfilter_clearRecent: 'Clear Recent',
  tagfilter_pin: 'Favorite',
  tagfilter_unpin: 'Unfavorite',
  tagfilter_forget: 'Remove from recent',
  tagfilter_defaultName: 'Tag set {n}',
  tagfilter_reset: 'Reset',
  tagfilter_close: 'Close',
  tagfilter_manageTitle: 'Manage tags & filters',
  tagfilter_manageEmpty: 'Nothing here yet',
  tagfilter_renamePrompt: 'New name',
  tagfilter_tabTags: 'Tags',
  tagfilter_tabFilters: 'Filters',
}, {
  tagfilter_search: 'タグを検索',
  tagfilter_recent: '最近使用',
  tagfilter_common: 'よく使うタグ',
  tagfilter_emptyHint: 'タグを検索して選ぶと絞り込めます。使ったタグはここに残り、「タグを管理」でお気に入りに登録できます。',
  tagfilter_pinnedMark: 'お気に入り',
  tagfilter_manageTags: 'タグを管理',
  tagfilter_display: 'タグの表示',
  tagfilter_displayTranslated: '翻訳',
  tagfilter_displayOriginal: '原文',
  tagfilter_backToOriginal: '標準の絞り込みに戻す',
  tagfilter_useEnhanced: '拡張絞り込みを使う',
  tagfilter_noResults: '結果なし',
  tagfilter_saved: '保存したタグセット',
  tagfilter_saveCurrent: '現在の組み合わせを保存',
  tagfilter_saveName: 'このタグセットに名前を付ける',
  tagfilter_save: '保存',
  tagfilter_cancel: 'キャンセル',
  tagfilter_rename: '名前を変更',
  tagfilter_delete: '削除',
  tagfilter_pinned: 'お気に入りタグ',
  tagfilter_done: '完了',
  tagfilter_clearRecent: '履歴を消去',
  tagfilter_pin: 'お気に入りに追加',
  tagfilter_unpin: 'お気に入りから外す',
  tagfilter_forget: '最近から削除',
  tagfilter_defaultName: 'タグセット {n}',
  tagfilter_reset: 'リセット',
  tagfilter_close: '閉じる',
  tagfilter_manageTitle: 'タグと絞り込みの管理',
  tagfilter_manageEmpty: 'まだありません',
  tagfilter_renamePrompt: '新しい名前',
  tagfilter_tabTags: 'タグ',
  tagfilter_tabFilters: '絞り込み',
});

// 从 URL 读取当前选中的标签
function getSelectedTagsFromUrl() {
  const params = new URLSearchParams(location.search);
  const tags = params.get('tags');
  if (!tags) return [];
  return tags.split(',').map(id => id.trim()).filter(Boolean);
}

// 应用筛选：改 URL 后发 popstate，站点路由会按新参数重新拉列表（已实测，不用整页刷新）。换了标签就回到第一页
function applyTagFilter(tagIds) {
  const url = new URL(location.href);
  if (tagIds.length) url.searchParams.set('tags', tagIds.join(','));
  else url.searchParams.delete('tags');
  url.searchParams.delete('page');
  listNavigate(url);
}

// 最近用过的标签（记在 store 里）
const recentTags = {
  get() { return store.get('tagfilterRecent', []); },
  add(id) {
    const list = recentTags.get();
    const idx = list.indexOf(id);
    if (idx >= 0) list.splice(idx, 1); // 已有就提到最前
    list.unshift(id);
    store.set('tagfilterRecent', list.slice(0, 20));
  },
  remove(id) { store.set('tagfilterRecent', recentTags.get().filter((x) => x !== id)); },
  clear() { store.set('tagfilterRecent', []); },
};

// 收藏标签：手动固定的常用标签，不会被「最近」挤掉
const pinnedTags = {
  get() { return store.get('tagfilterPinned', []); },
  has(id) { return pinnedTags.get().includes(id); },
  toggle(id) { const l = pinnedTags.get(); store.set('tagfilterPinned', l.includes(id) ? l.filter((x) => x !== id) : [...l, id]); },
};

// 已保存标签组合：只存标签（不含排序、日期、评级），所有列表页共用一份（视频 / 图库 / 订阅都能用同一组）。
// 存储键沿用 'tagfilterSaved'：早期版本存的是整条地址参数（query），读的时候只取其中的 tags，没有标签的旧条目不显示
const tagsOfQuery = (q) => (new URLSearchParams(q || '').get('tags') || '').split(',').map((x) => x.trim()).filter(Boolean);
const tagSetKey = (ids) => [...ids].sort().join(',');
const savedFilters = {
  all() { return store.get('tagfilterSaved', []); },
  /** 可用的标签组合（有标签的条目，同一组标签只留第一条） */
  list() {
    const seen = new Set();
    return savedFilters.all().filter((f) => {
      const k = tagSetKey(tagsOfQuery(f.query));
      if (!k || seen.has(k)) return false;
      seen.add(k); return true;
    });
  },
  add(path, name, query) {
    const f = { id: 'sf' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), path, name, query };
    store.set('tagfilterSaved', [...savedFilters.all(), f]);
    return f;
  },
  rename(id, name) { store.set('tagfilterSaved', savedFilters.all().map((f) => (f.id === id ? { ...f, name } : f))); },
  remove(id) {
    const list = savedFilters.all();
    const index = list.findIndex((f) => f.id === id);
    if (index < 0) return null;
    store.set('tagfilterSaved', list.filter((f) => f.id !== id));
    return { f: list[index], index };
  },
  restore({ f, index }) { const list = savedFilters.all().filter((x) => x.id !== f.id); list.splice(Math.min(index, list.length), 0, f); store.set('tagfilterSaved', list); },
};
/** 套用一组标签：只换 tags，排序、日期、评级保持不动 */
function applySaved(f) { applyTagFilter(tagsOfQuery(f.query)); }
/** 给当前标签组合起个默认名字：标签译名相连；太长截断，没有就用序号 */
function suggestName() {
  const name = getSelectedTagsFromUrl().map((id) => tagDict.name(id)).join(' + ');
  return (name || t('tagfilter_defaultName', { n: savedFilters.list().length + 1 })).slice(0, 30);
}

// 标签显示成译名还是原名（站点 id）：所有标签卡共用一个设置，在「管理标签」里切
const showOrig = () => store.get('tagfilterShowOriginal', false) === true;
const tagLabel = (id) => (showOrig() ? id : tagDict.name(id));
const tagAlt = (id) => (showOrig() ? tagDict.name(id) : id);


// ── 「按标签过滤」「按日期过滤」标题右侧的重置按钮：有筛选时弹出（带动画），点一下清掉这一项 ──
// 图标：Font Awesome Free 6 Solid rotate-left（CC BY 4.0，https://fontawesome.com/license/free），与站点菜单图标同一套
const RESET_SVG = '<svg viewBox="0 0 512 512" width="14" height="14" fill="currentColor" aria-hidden="true" focusable="false"><path d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"/></svg>';
function clearUrlParam(key) {
  const url = new URL(location.href);
  url.searchParams.delete(key);
  url.searchParams.delete('page');
  listNavigate(url);
}
function syncResets(original) {
  const sp = new URLSearchParams(location.search);
  const date = (original && original.closest('.modal')) ? document.querySelector('.modal .dateFilter') : document.querySelector('.page .dateFilter');
  const defs = [
    { block: original && original.closest('.block'), active: !!sp.get('tags'), clear: () => applyTagFilter([]) },
    { block: date && date.closest('.block'), active: !!sp.get('date'), clear: () => clearUrlParam('date') },
  ];
  for (const d of defs) {
    const header = d.block && d.block.querySelector(':scope > .block__header');
    if (!header) continue;
    let btn = header.querySelector(':scope > .iwe-block-reset');
    if (!btn) {
      btn = h('button.iwe-block-reset', { type: 'button', title: t('tagfilter_reset'), 'aria-label': t('tagfilter_reset') });
      btn.innerHTML = RESET_SVG;
      header.classList.add('iwe-has-reset');
      header.append(btn);
    }
    btn.onclick = d.clear;
    btn.classList.toggle('show', d.active);
    btn.tabIndex = d.active ? 0 : -1;
  }
}

site.register('tagfilter', {
  match: (p) => p === '/videos' || p === '/images',
  css: `
/* 增强版标签筛选：直接放在站点自己的卡片里，不再套一层卡片；颜色、圆角、字号一律用站点自己的变量，深浅色跟着站点走 */
.iwe-tagfilter { margin: 0; padding: 0; color: var(--text); background: none; border: 0; }
/* 搜索框：图标在左；聚焦时主色描边 + 一圈淡光环（与搜索页一致） */
.iwe-tagfilter-search { position: relative; margin-bottom: 16px; }
.iwe-tagfilter-search input { width: 100%; height: 38px; padding: 0 12px 0 34px; border: 1px solid rgba(128,128,128,.35); border-radius: 8px; font: inherit; font-size: .9rem; background: var(--body); color: var(--text); transition: border-color .15s, box-shadow .15s; }
.iwe-tagfilter-search input::placeholder { color: var(--text); opacity: .5; }
.iwe-tagfilter-search input:hover { border-color: rgba(128,128,128,.6); }
.iwe-tagfilter-search input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-faded); }
.iwe-tagfilter-search-icon { position: absolute; left: 11px; top: 19px; display: flex; transform: translateY(-50%); pointer-events: none; opacity: .55; }
/* 搜索结果：在输入框下方展开、把下面的内容往下推（右栏是自己滚动的容器，浮层会被它裁掉）；四周留 6px，行内左右 10px；上下键选、回车点选 */
.iwe-tagfilter-results { margin-top: 6px; max-height: 300px; overflow-y: auto; overscroll-behavior: contain; padding: 6px; border: 1px solid rgba(128,128,128,.2); border-radius: 10px; background: var(--body); animation: iwe-tf-pop .16s ease-out; }
@keyframes iwe-tf-pop { from { opacity: 0; transform: translateY(-4px); } }
.iwe-tagfilter-result { display: flex; align-items: center; gap: 10px; min-height: 36px; padding: 4px 10px; border-radius: 6px; cursor: pointer; }
.iwe-tagfilter-result > .ic { flex: none; opacity: .5; }
.iwe-tagfilter-result.active { background: rgba(128,128,128,.16); }
.iwe-tagfilter-result.on { color: var(--primary); }
.iwe-tagfilter-result.on > .ic { opacity: 1; }
.iwe-tagfilter-result-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .85rem; }
.iwe-tagfilter-result-id { flex: none; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .72rem; opacity: .55; }
.iwe-tagfilter-no-results { padding: 14px; text-align: center; font-size: .85rem; opacity: .6; }
/* 区块：标题行 = 图标 + 名字（淡）+ 右侧操作 */
.iwe-tagfilter-section { margin-bottom: 16px; }
.iwe-tagfilter-label { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 26px; margin-bottom: 6px; font-size: .8rem; font-weight: 700; color: var(--text); }
.iwe-tf-lt { display: inline-flex; align-items: center; gap: 6px; min-width: 0; white-space: nowrap; opacity: .65; }
.iwe-tf-lt > .ic { flex: none; }
.iwe-tagfilter-hint { margin: 0 0 16px; font-size: .8rem; line-height: 1.6; opacity: .6; }
/* 常用标签：已选 / 收藏 / 最近合成一朵云。点选只换颜色（不换字重、不加图标），位置不跳 */
.iwe-tf-cloud { display: flex; flex-wrap: wrap; gap: 6px; }
.iwe-tag-chip { appearance: none; display: inline-flex; align-items: center; gap: 4px; max-width: 100%; height: 28px; padding: 0 10px; border: 0; border-radius: 6px; background: var(--body-darker); color: var(--text); font: inherit; font-size: .85rem; cursor: pointer; transition: background .15s, color .15s; }
.iwe-tag-chip > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.iwe-tag-chip > .ic { flex: none; margin-left: -2px; color: var(--premium-color, #e5a400); }
.iwe-tag-chip:hover { background: var(--body); }
.iwe-tag-chip.selected { background: var(--primary-dark); }
.iwe-tag-chip.selected:hover { background: var(--primary); }
.iwe-tag-chip.selected > .ic { color: inherit; }
.iwe-tag-chip:focus-visible, .iwe-sv-row:focus-visible, .iwe-sv-head:focus-visible, .iwe-tf-btn:focus-visible, .iwe-tf-ghost:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
@keyframes iwe-tf-in { from { opacity: 0; transform: scale(.85); } }
/* 管理面板：电脑居中小窗，手机贴底抽屉；按钮都按手指的尺寸做，不依赖悬停 */
.iwe-tfm-dlg { position: fixed; inset: 0; z-index: 99000; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: rgba(0,0,0,.4); opacity: 0; transition: opacity .18s ease; }
.iwe-tfm-dlg.open { opacity: 1; }
.iwe-tfm-panel { display: flex; flex-direction: column; width: min(520px, 100%); max-height: 100%; border-radius: 12px; background: var(--body-dark, var(--body)); color: var(--text); box-shadow: 0 8px 40px rgba(0,0,0,.3); transform: translateY(8px) scale(.985); transition: transform .28s cubic-bezier(.22,1,.36,1); }
.iwe-tfm-dlg.open .iwe-tfm-panel { transform: none; }
.iwe-tfm-head { flex: none; display: flex; align-items: center; justify-content: space-between; padding: 12px 12px 12px 20px; border-bottom: 1px solid rgba(128,128,128,.25); font-weight: 700; }
.iwe-tfm-x { appearance: none; display: grid; place-items: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 8px; background: transparent; color: inherit; cursor: pointer; }
.iwe-tfm-x:hover { background: rgba(128,128,128,.2); }
.iwe-tfm-tabs { flex: none; display: flex; gap: 4px; padding: 8px 6px 0; border-bottom: 1px solid rgba(128,128,128,.25); }
.iwe-tfm-tab { appearance: none; position: relative; height: 40px; padding: 0 14px; border: 0; background: transparent; color: var(--text); font: inherit; font-size: .9rem; opacity: .6; cursor: pointer; transition: opacity .15s; }
.iwe-tfm-tab:hover { opacity: .9; }
.iwe-tfm-tab.on { opacity: 1; font-weight: 700; }
.iwe-tfm-tab::after { content: ''; position: absolute; left: 10px; right: 10px; bottom: -1px; height: 2px; border-radius: 2px; background: var(--primary); transform: scaleX(0); transition: transform .2s ease; }
.iwe-tfm-tab.on::after { transform: scaleX(1); }
.iwe-tfm-body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 8px 20px 20px; }
.iwe-tfm-title { display: flex; align-items: center; justify-content: space-between; margin: 14px 0 6px; font-size: .8rem; font-weight: 700; opacity: .65; }
.iwe-tfm-empty { padding: 10px 0; font-size: .85rem; opacity: .5; }
.iwe-tfm-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; border-bottom: 1px solid rgba(128,128,128,.15); }
.iwe-tfm-name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.iwe-tfm-acts { flex: none; display: flex; gap: 6px; }
.iwe-tfm-btn { appearance: none; min-width: 44px; height: 34px; padding: 0 12px; border: 0; border-radius: 6px; background: var(--body-darker); color: var(--text); font: inherit; font-size: .85rem; cursor: pointer; }
.iwe-tfm-btn:hover { background: rgba(128,128,128,.3); }
.iwe-tfm-btn.on { color: var(--premium-color, #e5a400); }
.iwe-tfm-btn.danger { color: #e5484d; }
.iwe-tfm-btn.link { min-width: 0; height: 26px; padding: 0 8px; background: transparent; color: var(--primary); }
.iwe-tfm-seg { display: inline-flex; padding: 3px; border-radius: 8px; background: var(--body-darker); }
.iwe-tfm-seg button { appearance: none; height: 30px; padding: 0 14px; border: 0; border-radius: 6px; background: transparent; color: var(--text); font: inherit; font-size: .85rem; cursor: pointer; transition: background .15s; }
.iwe-tfm-seg button.on { background: var(--body); box-shadow: 0 1px 3px rgba(0,0,0,.15); cursor: default; }
@media (max-width: 600px) {
  .iwe-tfm-dlg { align-items: flex-end; padding: 0; }
  .iwe-tfm-panel { width: 100%; max-height: 86dvh; border-radius: 16px 16px 0 0; transform: translateY(100%); transition: transform .32s cubic-bezier(.22,1,.36,1); }
  .iwe-tfm-body { padding-bottom: calc(20px + env(safe-area-inset-bottom)); }
}
@media (prefers-reduced-motion: reduce) { .iwe-tfm-dlg, .iwe-tfm-panel { transition: none; } }
/* 手机筛选浮窗的关闭钮：sticky 贴在滚动容器右上角，负外边距让它不占高度、浮在内容之上 */
.iwe-modal-x { position: sticky; top: 8px; z-index: 5; display: grid; place-items: center; width: 40px; height: 40px; margin: 8px 8px -48px auto; padding: 0; border: 0; border-radius: 50%; background: var(--body-darker); color: var(--text); box-shadow: 0 1px 6px rgba(0,0,0,.25); cursor: pointer; }
.iwe-modal-x:active { transform: scale(.92); }
/* 底部：「管理标签」按钮 + 右侧淡色的「切回原版筛选」 */
.iwe-tagfilter-footer { display: flex; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid rgba(128,128,128,.25); }
.iwe-tf-btn { appearance: none; display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; border: 0; border-radius: 6px; background: var(--body-darker); color: var(--text); font: inherit; font-size: .8rem; cursor: pointer; transition: background .15s; }
.iwe-tf-btn:hover { background: var(--body); }
.iwe-tf-ghost { appearance: none; margin-left: auto; padding: 4px 2px; border: 0; background: none; color: var(--text); font: inherit; font-size: .78rem; opacity: .55; cursor: pointer; }
.iwe-tf-ghost:hover { opacity: .9; text-decoration: underline; }
.iwe-tagfilter-link { color: var(--primary); text-decoration: none; cursor: pointer; }
.iwe-tagfilter-link:hover { text-decoration: underline; }
.iwe-original-filter { display: none; }
.iwe-tagfilter[hidden], .iwe-tagfilter-switch[hidden] { display: none; }
.iwe-tagfilter-switch { margin: 0 0 10px; font-size: .8rem; }
/* 已保存标签组合：一行一条（名字 + 名字和标签不同时下面一行小字列出标签）；标题可折叠，列表用 grid 行高过渡展开 / 收起 */
.iwe-sv-head { appearance: none; display: inline-flex; align-items: center; gap: 6px; min-width: 0; padding: 0; border: 0; background: none; color: inherit; font: inherit; cursor: pointer; }
.iwe-sv-head:hover .iwe-tf-lt { opacity: 1; }
.iwe-sv-caret { display: inline-flex; transition: transform .2s ease; }
.iwe-sv-sec:not(.open) .iwe-sv-caret { transform: rotate(-90deg); }
.iwe-sv-count { padding: 0 6px; border-radius: 9px; background: var(--body-darker); font-weight: 400; font-size: .72rem; }
.iwe-sv-newwrap { margin: 0 -8px 2px; animation: iwe-tf-in .2s ease-out; }
.iwe-sv-row.iwe-sv-new { color: var(--primary); font-weight: 700; }
.iwe-sv-row.iwe-sv-new > .ic { opacity: 1; }
.iwe-sv-list { display: grid; grid-template-rows: 0fr; margin: 0 -8px; /* 行的图标与标题行图标对齐，悬停底色向两边多出 8px */ transition: grid-template-rows .24s ease, opacity .18s ease; opacity: 0; }
.iwe-sv-sec.open .iwe-sv-list { grid-template-rows: 1fr; opacity: 1; }
.iwe-sv-list-in { min-height: 0; overflow: hidden; }
.iwe-sv-row { appearance: none; display: flex; align-items: center; gap: 8px; width: 100%; min-height: 34px; margin: 0 0 2px; padding: 5px 8px; border: 0; border-radius: 6px; background: transparent; color: var(--text); font: inherit; font-size: .85rem; text-align: left; cursor: pointer; transition: background .15s; }
.iwe-sv-row:hover { background: rgba(128,128,128,.14); }
.iwe-sv-row > .ic { flex: none; opacity: .55; }
.iwe-sv-row.on { background: var(--primary-faded); }
.iwe-sv-row.on > .ic { opacity: 1; color: var(--primary); }
.iwe-sv-txt { display: flex; flex-direction: column; min-width: 0; }
.iwe-sv-name, .iwe-sv-tags { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.iwe-sv-tags { font-size: .72rem; opacity: .6; }
@media (prefers-reduced-motion: reduce) { .iwe-sv-list, .iwe-sv-caret { transition: none; } .iwe-sv-newwrap, .iwe-tagfilter-results { animation: none; } .iwe-tagfilter-saveRow { transition: opacity .12s linear; } }
/* 起名字的输入行（常驻元素，展开 / 收起带高度过渡） */
.iwe-tagfilter-saveRow { display: flex; gap: 8px; max-height: 0; margin: 0; opacity: 0; overflow: hidden; transition: max-height .24s ease, opacity .18s ease, margin .24s ease; }
.iwe-tagfilter-saveRow.open { max-height: 60px; margin: 0 0 16px; opacity: 1; }
.iwe-tagfilter-saveRow input { flex: 1; min-width: 0; height: 34px; padding: 0 10px; border: 1px solid rgba(128,128,128,.35); border-radius: 8px; font: inherit; font-size: .9rem; background: var(--body); color: var(--text); }
.iwe-tagfilter-saveRow input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-faded); }
.iwe-tagfilter-sbtn { padding: 0 12px; border: 0; border-radius: 6px; background: var(--body-darker); color: var(--text); font: inherit; font-size: .85rem; cursor: pointer; white-space: nowrap; }
.iwe-tagfilter-sbtn.primary { background: var(--primary-dark); }
/* 标题右侧的重置按钮：没有筛选时缩小淡出，有筛选时回弹淡入；图标悬停时逆时针转一下 */
.iwe-has-reset { position: relative; }
.iwe-block-reset { position: absolute; right: 0; top: 50%; display: grid; place-items: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: 5px; background: transparent; color: var(--text); cursor: pointer; opacity: 0; transform: translateY(-50%) scale(.6); pointer-events: none; visibility: hidden; transition: opacity .14s ease-in, transform .18s ease-in, background .15s, visibility 0s linear .18s; }
.iwe-block-reset.show { opacity: .75; transform: translateY(-50%); pointer-events: auto; visibility: visible; transition: opacity .18s ease-out, transform .3s cubic-bezier(.34, 1.56, .64, 1), background .15s, visibility 0s; }
.iwe-block-reset.show:hover { opacity: 1; background: rgba(128, 128, 128, .22); }
.iwe-block-reset svg { transition: transform .25s ease; }
.iwe-block-reset.show:hover svg { transform: rotate(-90deg); }
@media (prefers-reduced-motion: reduce) { .iwe-block-reset, .iwe-block-reset.show { transform: translateY(-50%); transition: opacity .12s linear, visibility 0s linear .12s; } .iwe-block-reset.show { transition: opacity .12s linear, visibility 0s; } .iwe-block-reset svg { transition: none; } }
/* 右侧筛选栏整列钉在顶栏下：比视口高时栏内可滚，滚到头带动页面（88-site.js 的 stickySidebar） */
.iwe-filter-sticky { position: sticky; top: 80px; --iwe-sticky: 1; scrollbar-width: thin; align-content: flex-start; }
.iwe-filter-sticky > .block { box-shadow: none !important; }
/* 右栏卡片之间的间距：站点默认 30px，栏里卡片多，收紧到 16px */
.iwe-filter-sticky > .block.block--margin { margin-bottom: 16px; }
`,
  scan() {
    // 站点换页 / 换列表时会把原版筛选节点整个重渲染：每个原版节点配一个实例，节点没了就连同我们加的东西一起清掉。
    for (const el of document.querySelectorAll('.iwe-tagfilter, .iwe-tagfilter-switch')) {
      if (el.__iweOwner && !el.__iweOwner.isConnected) el.remove();
    }
    // 桌面是右栏里的筛选；手机上点「过滤器」会在 .page 之外弹出浮窗（.modal），里面是另一份同样的筛选：两处都要增强
    // 手机浮窗：右上角放一个始终可见的关闭钮（粘在滚动容器顶部，内容怎么滚都在）；关闭 = 点站点自己的遮罩，走站点的关闭逻辑
    for (const content of document.querySelectorAll('.modal.page-videoList__mobileFilters > .modal__content, .modal > .modal__content:has(.tagFilter, .tagPicker)')) {
      if (content.querySelector(':scope > .iwe-modal-x')) continue;
      const x = h('button.iwe-modal-x', { type: 'button', 'aria-label': t('tagfilter_close'), title: t('tagfilter_close'),
        onclick: () => { const bg = content.parentElement.querySelector(':scope > .modal__background'); if (bg) bg.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); } }, icon('x', 20));
      content.prepend(x);
    }
    // 视频 / 图库页的 .tagPicker 在 .tagFilter 里面：只接管最外层那个，否则会建两份实例（切到原版时出现两条「使用增强筛选」）
    const originals = [...document.querySelectorAll('.page .tagFilter, .page .tagPicker, .modal .tagFilter, .modal .tagPicker')]
      .filter((o) => !o.parentElement.closest('.tagFilter, .tagPicker'));
    if (!originals.length) syncResets(null);
    for (const original of originals) {
      syncResets(original);
      if (!original.__iweTf) original.__iweTf = createInstance(original);
      original.__iweTf.sync();
    }
  },
});

// 「增强 / 原版」的选择记在 store 里，换页、重开都沿用
const getMode = () => (store.get('tagfilterMode', 'enhanced') === 'original' ? 'original' : 'enhanced');

// 给没有原版标签筛选的页面（订阅页）用：在 host 里挂一份增强版标签筛选。没有「原版」可切，也不管右栏固定
// 返回实例，调用方在自己的 scan 里调 inst.sync()
iweTagFilterKit = {
  mount(host) {
    const anchor = h('div', { hidden: true });
    host.append(anchor);
    return createInstance(anchor, { standalone: true });
  },
  /** 卡片标题右侧的重置钮（与「按标签过滤」「按日期过滤」同一个样式）；放进带 .iwe-has-reset 的标题行里，用 show 类控制显隐 */
  resetButton(onclick) {
    const btn = h('button.iwe-block-reset', { type: 'button', title: t('tagfilter_reset'), 'aria-label': t('tagfilter_reset'), onclick });
    btn.innerHTML = RESET_SVG;
    return btn;
  },
};
const instances = new Set();
let outsideBound = false;

function createInstance(original, { standalone = false } = {}) {
  let selectedIds = getSelectedTagsFromUrl();
  let searchQuery = '', searchResults = [], composing = false, active = -1;
  let sig = null, editing = null;
  const wrapper = h('div.iwe-tagfilter');
  const switchBar = h('div.iwe-tagfilter-switch',
    h('a.iwe-tagfilter-link', { onclick: () => { store.set('tagfilterMode', 'enhanced'); inst.sync(); } }, t('tagfilter_useEnhanced')));
  wrapper.__iweOwner = switchBar.__iweOwner = original;
  original.parentNode.insertBefore(switchBar, original);
  original.parentNode.insertBefore(wrapper, original);

  const refresh = () => { sig = null; inst.sync(); };
  const apply = (ids) => { applyTagFilter(ids); refresh(); };
  // remember：从搜索结果里新加的标签记进「最近」（会排到最近的最前面）；在常用标签云里点选不记，免得标签换位置
  const toggleSelect = (id, { remember = true } = {}) => {
    if (selectedIds.includes(id)) selectedIds = selectedIds.filter((x) => x !== id);
    else { selectedIds = [...selectedIds, id]; if (remember) recentTags.add(id); }
    apply(selectedIds);
  };

  // ── 搜索框：节点常驻，重画不碰它 ───────────────────────────────────
  // 输入法组词期间（中文、日文）输入框一旦被换掉，组词就被打断、字根本打不进去。
  // 所以输入框和结果容器只在这里建一次，后面的重画只换它下面的区块；组词没结束不搜，结束再搜。
  const searchInput = h('input', { placeholder: t('tagfilter_search'), autocomplete: 'off', spellcheck: 'false', enterKeyHint: 'search' });
  const resultsBox = h('div');
  const searchSection = h('div.iwe-tagfilter-search', h('span.iwe-tagfilter-search-icon', icon('search', 16)), searchInput, resultsBox);
  function closeResults() { searchInput.value = ''; searchQuery = ''; searchResults = []; active = -1; paintResults(); }
  function pick(id) { closeResults(); toggleSelect(id); searchInput.focus(); }
  function setActive(i) {
    active = i;
    const rows = resultsBox.querySelectorAll('.iwe-tagfilter-result');
    rows.forEach((r, k) => r.classList.toggle('active', k === i));
    if (rows[i]) rows[i].scrollIntoView({ block: 'nearest' });
  }
  function paintResults() {
    if (searchResults.length) {
      resultsBox.replaceChildren(h('div.iwe-tagfilter-results', { role: 'listbox' }, searchResults.map((tag, i) => {
        const on = selectedIds.includes(tag.id);
        return h('div.iwe-tagfilter-result' + (i === active ? '.active' : '') + (on ? '.on' : ''), {
          role: 'option', 'aria-selected': String(on),
          onpointerdown: (e) => e.preventDefault(), // 焦点留在输入框里，点完可以接着输
          onpointermove: () => { if (active !== i) setActive(i); },
          onclick: () => pick(tag.id),
        }, icon(on ? 'check' : 'tag', 15), h('span.iwe-tagfilter-result-name', tagLabel(tag.id)), h('span.iwe-tagfilter-result-id', tagAlt(tag.id)));
      })));
    } else if (searchQuery) resultsBox.replaceChildren(h('div.iwe-tagfilter-results', h('div.iwe-tagfilter-no-results', t('tagfilter_noResults'))));
    else resultsBox.replaceChildren();
  }
  function runSearch() {
    searchQuery = searchInput.value.trim();
    searchResults = searchQuery ? tagDict.search(searchQuery, 20).map((id) => tagDict.tag(id)).filter(Boolean) : [];
    active = searchResults.length ? 0 : -1;
    paintResults();
  }
  searchInput.addEventListener('compositionstart', () => { composing = true; });
  searchInput.addEventListener('compositionend', () => { composing = false; runSearch(); });
  searchInput.addEventListener('input', (e) => { if (!composing && !e.isComposing) runSearch(); });
  searchInput.addEventListener('focus', () => { if (searchInput.value.trim() && !searchResults.length) runSearch(); });
  searchInput.addEventListener('keydown', (e) => {
    if (e.isComposing || composing) return;
    const n = searchResults.length;
    if (e.key === 'ArrowDown' && n) { e.preventDefault(); setActive((active + 1) % n); }
    else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setActive((active - 1 + n) % n); }
    else if (e.key === 'Enter' && n) { e.preventDefault(); pick(searchResults[Math.max(0, active)].id); }
    else if (e.key === 'Escape' && (searchQuery || n)) { e.preventDefault(); e.stopPropagation(); closeResults(); }
  });

  // ── 给已保存筛选起名 / 重命名的输入行（同样常驻）────────────────────
  const nameInput = h('input', { placeholder: t('tagfilter_saveName'), maxlength: '30', autocomplete: 'off', spellcheck: 'false' });
  const saveRow = h('form.iwe-tagfilter-saveRow', { onsubmit: (e) => { e.preventDefault(); commitName(); } },
    nameInput,
    h('button.iwe-tagfilter-sbtn.primary', { type: 'submit' }, t('tagfilter_save')),
    h('button.iwe-tagfilter-sbtn', { type: 'button', onclick: () => closeEditor() }, t('tagfilter_cancel')));
  saveRow.inert = true;
  nameInput.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !e.isComposing) { e.preventDefault(); closeEditor(); } });
  function openEditor(mode, id, value) {
    editing = { mode, id };
    nameInput.value = value;
    saveRow.inert = false; saveRow.classList.add('open');
    nameInput.focus(); nameInput.select();
  }
  function closeEditor() { editing = null; saveRow.classList.remove('open'); saveRow.inert = true; }
  function commitName() {
    const name = nameInput.value.trim();
    if (!name || !editing) return;
    if (editing.mode === 'save') savedFilters.add(location.pathname, name, 'tags=' + getSelectedTagsFromUrl().join(','));
    else savedFilters.rename(editing.id, name);
    closeEditor(); refresh();
  }

  const dyn = h('div');
  wrapper.append(searchSection, saveRow, dyn);

  // ── 管理面板：标签显示方式、最近用过 / 收藏标签 / 已保存组合的移除与改名，统一放在一个弹层里（触屏没有悬停，不靠行内小按钮）──
  let manageDlg = null, manageKey = null, manageTab = 'tags';
  function closeManage() {
    if (!manageDlg) return;
    const d = manageDlg; manageDlg = null;
    removeEventListener('keydown', manageKey, true);
    unlockScroll();
    d.classList.remove('open'); setTimeout(() => d.remove(), 200);
    paintResults(); refresh();
  }
  let tabBtns = null;
  function paintManage(body) {
    const row = (label, ...btns) => h('div.iwe-tfm-row', h('span.iwe-tfm-name', label), h('div.iwe-tfm-acts', ...btns));
    const btn = (txt, fn, cls = '') => h('button.iwe-tfm-btn' + cls, { type: 'button', onclick: fn }, txt);
    const group = (title, rows, extra) => h('div.iwe-tfm-group', h('div.iwe-tfm-title', h('span', title), extra || null), rows.length ? rows : h('div.iwe-tfm-empty', t('tagfilter_manageEmpty')));
    const again = () => { paintManage(body); sig = null; };
    const recent = recentTags.get().filter((id) => tagDict.tag(id));
    const pinned = pinnedTags.get();
    const saved = savedFilters.list();
    const display = row(t('tagfilter_display'), h('div.iwe-tfm-seg', { role: 'radiogroup' }, [false, true].map((v) => h('button' + (showOrig() === v ? '.on' : ''), {
      type: 'button', role: 'radio', 'aria-checked': String(showOrig() === v),
      onclick: () => { store.set('tagfilterShowOriginal', v); again(); },
    }, t(v ? 'tagfilter_displayOriginal' : 'tagfilter_displayTranslated')))));
    const pane = manageTab === 'tags'
      ? [h('div.iwe-tfm-group', display),
        group(t('tagfilter_pinned'), pinned.map((id) => row(tagLabel(id), btn(t('tagfilter_unpin'), () => { pinnedTags.toggle(id); again(); }, '.danger')))),
        group(t('tagfilter_recent'), recent.map((id) => row(tagLabel(id),
          btn(pinnedTags.has(id) ? '★' : '☆', () => { pinnedTags.toggle(id); again(); }, pinnedTags.has(id) ? '.on' : ''),
          btn(t('tagfilter_delete'), () => { recentTags.remove(id); again(); }, '.danger'))),
          recent.length ? btn(t('tagfilter_clearRecent'), () => { recentTags.clear(); again(); }, '.link') : null)]
      : [group(t('tagfilter_saved'), saved.map((f) => row(f.name,
          btn(t('tagfilter_rename'), () => { const v = prompt(t('tagfilter_renamePrompt'), f.name); if (v && v.trim()) { savedFilters.rename(f.id, v.trim()); again(); } }),
          btn(t('tagfilter_delete'), () => { savedFilters.remove(f.id); again(); }, '.danger'))))];
    body.replaceChildren(...pane);
    if (tabBtns) for (const [k, b] of Object.entries(tabBtns)) { b.classList.toggle('on', k === manageTab); b.setAttribute('aria-selected', String(k === manageTab)); }
  }
  function openManage() {
    if (manageDlg) return;
    manageTab = 'tags';
    const body = h('div.iwe-tfm-body');
    const x = h('button.iwe-tfm-x', { type: 'button', 'aria-label': t('tagfilter_done'), onclick: closeManage }, icon('x', 18));
    const mkTab = (key, label) => h('button.iwe-tfm-tab', { type: 'button', role: 'tab', onclick: () => { if (manageTab === key) return; manageTab = key; body.scrollTop = 0; paintManage(body); } }, label);
    tabBtns = { tags: mkTab('tags', t('tagfilter_tabTags')), filters: mkTab('filters', t('tagfilter_tabFilters')) };
    const panel = h('div.iwe-tfm-panel', { role: 'dialog', 'aria-modal': 'true' },
      h('div.iwe-tfm-head', h('span', t('tagfilter_manageTitle')), x),
      h('div.iwe-tfm-tabs', { role: 'tablist' }, tabBtns.tags, tabBtns.filters), body);
    manageDlg = h('div.iwe-tfm-dlg', panel);
    manageDlg.addEventListener('pointerdown', (e) => { if (e.target === manageDlg) closeManage(); });
    manageKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeManage(); } };
    addEventListener('keydown', manageKey, true);
    paintManage(body);
    document.body.append(manageDlg);
    lockScroll();
    requestAnimationFrame(() => manageDlg && manageDlg.classList.add('open'));
  }

  const label = (ic, text, ...extra) => h('span.iwe-tf-lt', icon(ic, 14), h('span', text), ...extra);

  // 已保存标签组合：一行一条。名字和标签译名连起来不一样时（用户改过名），下面一行小字列出标签。
  // 当前正在用的那条高亮（对勾），再点一下取消这组标签。标题可折叠（记在 store），「保存当前」在标题行右侧
  function savedSection(savedList, cur, canSave) {
    const open = savedList.length > 0 && store.get('tagfilterSavedOpen', true) !== false;
    const sec = h('div.iwe-tagfilter-section.iwe-sv-sec' + (open ? '.open' : ''));
    const list = h('div.iwe-sv-list', h('div.iwe-sv-list-in', savedList.map((f) => {
      const ids = tagsOfQuery(f.query);
      const on = tagSetKey(ids) === cur;
      const names = ids.map(tagLabel).join(' + ');
      const plain = ids.map((id) => tagDict.name(id)).join(' + ');
      return h('button.iwe-sv-row' + (on ? '.on' : ''), { type: 'button', 'aria-pressed': String(on), title: names, onclick: () => (on ? apply([]) : applySaved(f)) },
        icon(on ? 'check' : 'bookmark', 15),
        h('span.iwe-sv-txt', h('span.iwe-sv-name', f.name), f.name !== plain && f.name !== names ? h('span.iwe-sv-tags', names) : null));
    })));
    list.inert = !open;
    const toggle = () => { const o = !sec.classList.contains('open'); sec.classList.toggle('open', o); head.setAttribute('aria-expanded', String(o)); list.inert = !o; store.set('tagfilterSavedOpen', o); };
    const head = savedList.length
      ? h('button.iwe-sv-head', { type: 'button', 'aria-expanded': String(open), onclick: toggle },
        label('bookmark', t('tagfilter_saved'), h('span.iwe-sv-count', String(savedList.length)), h('span.iwe-sv-caret', icon('chevronDown', 14))))
      : label('bookmark', t('tagfilter_saved'));
    // 「保存当前组合」放在标题下面、列表上面（不跟着折叠）；标题行很窄，放不下第二个按钮
    add(sec, [h('div.iwe-tagfilter-label', head),
      canSave ? h('div.iwe-sv-newwrap', h('button.iwe-sv-row.iwe-sv-new', { type: 'button', onclick: () => openEditor('save', null, suggestName()) }, icon('plus', 15), h('span.iwe-sv-txt', h('span.iwe-sv-name', t('tagfilter_saveCurrent'))))) : null,
      list]);
    return sec;
  }

  // 常用标签：已选（地址栏里有、但不在收藏 / 最近里的）→ 收藏 → 最近（最多 12 个）。
  // 点选只换颜色，顺序不随选中变化；收藏的前面带星
  function cloudSection() {
    const pinned = pinnedTags.get();
    const recent = recentTags.get().filter((id) => tagDict.tag(id) && !pinned.includes(id)).slice(0, 12);
    const extra = selectedIds.filter((id) => !pinned.includes(id) && !recent.includes(id));
    const ids = [...extra, ...pinned, ...recent];
    if (!ids.length) return h('p.iwe-tagfilter-hint', t('tagfilter_emptyHint'));
    return h('div.iwe-tagfilter-section',
      h('div.iwe-tagfilter-label', label('tag', t('tagfilter_common'))),
      h('div.iwe-tf-cloud', ids.map((id) => {
        const on = selectedIds.includes(id), pin = pinned.includes(id);
        return h('button.iwe-tag-chip' + (on ? '.selected' : ''), {
          type: 'button', 'aria-pressed': String(on), title: tagAlt(id) + (pin ? ' · ' + t('tagfilter_pinnedMark') : ''),
          onclick: () => toggleSelect(id, { remember: false }),
        }, pin ? icon('star', 13) : null, h('span', tagLabel(id)));
      })));
  }

  function render() {
    const cur = tagSetKey(selectedIds);
    const savedList = savedFilters.list();
    const canSave = !!cur && !savedList.some((f) => tagSetKey(tagsOfQuery(f.query)) === cur);
    const footer = h('div.iwe-tagfilter-footer',
      h('button.iwe-tf-btn', { type: 'button', onclick: openManage }, icon('pencil', 14), t('tagfilter_manageTags')),
      standalone ? null : h('button.iwe-tf-ghost', { type: 'button', onclick: () => { store.set('tagfilterMode', 'original'); inst.sync(); } }, t('tagfilter_backToOriginal')));
    // 用 add()：区块可能是 null，原生 replaceChildren 会把它当成文字 "null" 插进去
    add(clear(dyn), [savedList.length || canSave ? savedSection(savedList, cur, canSave) : null, cloudSection(), footer]);
  }

  const inst = {
    wrapper,
    sync() {
      const mode = standalone ? 'enhanced' : getMode();
      original.classList.toggle('iwe-original-filter', mode === 'enhanced');
      wrapper.hidden = mode !== 'enhanced';
      switchBar.hidden = mode !== 'original';
      // 筛选栏整列钉在顶栏下：比视口高时栏内可滚，滚到头带动页面
      const col = !standalone && original.closest('.col-lg-3 > .row');
      if (col) { col.classList.add('iwe-filter-sticky'); stickySidebar(col); }
      if (mode !== 'enhanced') return;
      // 输入框和结果容器是常驻的，重画只换 dyn 里的区块，正在输入也不会被打断
      const next = location.search + '|' + tagDict.size + '|' + showOrig(); // 词库加载完也要重画（译名才出来）；在管理面板里切了译名 / 原名，每张卡都要重画
      if (next === sig) return;
      sig = next;
      selectedIds = getSelectedTagsFromUrl();
      render();
    },
    closeSearch() {
      if (composing || (!searchQuery && !searchResults.length)) return;
      searchInput.value = ''; searchQuery = ''; searchResults = [];
      paintResults();
    },
  };
  instances.add(inst);
  if (!outsideBound) {
    outsideBound = true;
    // 点到筛选栏外面：收起搜索结果（只在确实有结果开着时才动）
    document.addEventListener('click', (e) => { for (const i of instances) { if (i.wrapper.isConnected && !i.wrapper.contains(e.target)) i.closeSearch(); } }, true);
  }
  return inst;
}

})(); // 作用域隔离结束
