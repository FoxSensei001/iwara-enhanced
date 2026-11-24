// 标签国际化：站点页面上的标签链接显示成用户语言的译名，原 id 放在悬浮提示里。
//
// 站点的标签链接是它自己渲染、会被复用的节点（详情页换一个作品时，同一个 <a> 会被改成别的标签）：
// - 只改链接里的文字节点的内容，不换节点、不动结构（站点之后还要在同一个文字节点上写新标签）；
// - 标记记的是标签 id，同时核对当前文字：站点把文字写回原样、或把节点换成别的标签时，都会重新处理；
// - 换成词库里没有的标签时，把我们加过的悬浮提示撤掉，免得留着上一个标签的 id。

(() => {

// 词库里的译名；没有译名（或译名就是 id 本身）就当没有，保持站点原文
function localName(id) {
  if (!tagDict.tag(id)) return null;
  const name = tagDict.name(id);
  if (!name || name === id) return null;
  return name;
}

function setLinkText(link, text) {
  const node = [...link.childNodes].find((n) => n.nodeType === 3);
  if (node) { if (node.nodeValue !== text) node.nodeValue = text; } else link.append(text);
}

site.register('tagi18n', {
  match: (path) => /^\/(video|image|videos|images|search|profile)/.test(path),

  scan() {
    if (env.tagLang === 'en') return;
    // 词库没加载好就先不动：框架在词库加载完后会再扫一遍（这里别自己排队重扫，加载失败时会空转）
    if (!tagDict.size) return;

    for (const link of document.querySelectorAll('a[href*="?tags="], a[href*="&tags="]')) {
      if (link.closest('.iwe-nav-pop')) continue; // 侧栏悬停菜单自己带译名
      let id;
      try { id = new URL(link.href, location.origin).searchParams.get('tags'); } catch { continue; }
      if (!id) continue;
      // 只处理词库里认识的单个标签（多个标签的链接、未知标签保持原样）
      const name = localName(id);
      if (!name) {
        if (link.dataset.iweTagi18n) { delete link.dataset.iweTagi18n; if (link.dataset.iweTagTitle) { link.removeAttribute('title'); delete link.dataset.iweTagTitle; } }
        continue;
      }
      if (link.dataset.iweTagi18n === id && link.textContent === name) continue;
      link.dataset.iweTagi18n = id;
      link.title = id; link.dataset.iweTagTitle = '1';
      setLinkText(link, name);
    }
  },
});

// 侧栏「视频 / 图片」下的分类链接（/videos?tags=xxx&page=0）：站点用 tag.<id> 去查自己的译文，查不到就把 "tag.ai_generated"
// 这样的键名原样显示出来，其余的只有英文名。这里换成词库里的译名。
// 这些链接在每个页面的侧栏里都有，所以不限路径；文字在链接里的 .text--inline 里（旁边还有图标，不能当成整个链接的文字）。
site.register('tagi18nMenu', {
  scan() {
    if (env.tagLang === 'en') return;
    if (!tagDict.size) return;
    for (const link of document.querySelectorAll('.page > .menu a[href*="?tags="]')) {
      const label = link.querySelector('.text--inline') || link.querySelector('.text');
      const node = label && [...label.childNodes].find((n) => n.nodeType === 3);
      if (!node) continue;
      let id;
      try { id = new URL(link.href, location.origin).searchParams.get('tags'); } catch { continue; }
      const name = id && localName(id);
      if (!name) continue; // 词库里没有：保持站点原文
      if (link.dataset.iweTagi18n === id && node.nodeValue === name) continue;
      link.dataset.iweTagi18n = id;
      link.title = id;
      node.nodeValue = name;
    }
  },
});

})();
