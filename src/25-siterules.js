// 站点规则：上传限制、码率上限、说明文案、创作者链接与发布页显示的保持一致，跟随页面读取，脚本里不写死。
// - 多语言文案按 en / ja / zh 分组读取，语言代码按分组取，不靠文案内容猜。
// - 数值只从 en 那份解析（"300MB (Premium 600MB)"、"960 * 720"、"20 seconds"），跟站点 / 界面显示什么语言无关；
//   要显示的说明按界面语言取同一个键，没有就退回 en。
// - 码率表和链接按发布页上的表格与链接读取，不随语言变。
// 读到的结果按页面资源地址缓存；站点更新（地址变了）就重读。都读不到时返回 null，调用方不做本地拦截、只显示实际值。

const SITE_TEXT_KEYS = [
  'form.categoriesDescription', 'form.tagsDescription', 'videoForm.embedUrlDescription',
  'videoForm.creatorInformation.restrictions', 'videoForm.creatorInformation.restrictions.wrongFormat',
  'videoForm.creatorInformation.restrictions.fileFormats.value', 'videoForm.creatorInformation.restrictions.fileSize.value',
  'videoForm.creatorInformation.restrictions.fileResolution.value', 'videoForm.creatorInformation.restrictions.fileDuration.value',
  'videoForm.creatorInformation.bitrate.limits', 'videoForm.creatorInformation.bitrate.over',
  'videoForm.creatorInformation.creatorLinks', 'videoForm.creatorInformation.faq', 'videoForm.creatorInformation.compression', 'videoForm.creatorInformation.tutorial',
  'imageForm.creatorInformation.restrictions', 'imageForm.creatorInformation.restrictions.fileFormats.value', 'imageForm.creatorInformation.restrictions.fileSize.value',
];

const siteRules = (() => {
  let data = store.get('siteRules') || null;
  let loading = null;

  /** 还原 JS 单引号字符串字面量里的转义（`JSON.parse('…')` 的参数）。 */
  const unescapeJs = (str) => str.replace(/\\(u[0-9a-fA-F]{4}|x[0-9a-fA-F]{2}|[\s\S])/g, (_, e) =>
    (e[0] === 'u' || e[0] === 'x') && e.length > 1 ? String.fromCharCode(parseInt(e.slice(1), 16)) : ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', 0: '\0' })[e] ?? e);
  /** 从 `<name>=JSON.parse('` 开始读到未转义的 `'` 为止。 */
  function readJsonParse(src, name) {
    const re = new RegExp('[,;\\s{(]' + name.replace(/\$/g, '\\$') + "=JSON\\.parse\\('", 'g');
    const m = re.exec(src);
    if (!m) return null;
    let i = m.index + m[0].length, out = '';
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '\\') { out += c + src[i + 1]; i++; continue; }
      if (c === "'") break;
      out += c;
    }
    try { return JSON.parse(unescapeJs(out)); } catch { return null; }
  }
  /** 多语言文案：按语言分组，把要用的键挑出来。 */
  function parseTexts(src) {
    for (const m of src.matchAll(/[\w$]+=\{((?:[a-z]{2}(?:[-_][A-Za-z]{2,4})?:[\w$]+,)+[a-z]{2}(?:[-_][A-Za-z]{2,4})?:[\w$]+)\}/g)) {
      const pairs = m[1].split(',').map((p) => p.split(':'));
      if (!pairs.some(([code]) => code === 'en')) continue;
      const texts = {};
      for (const [code, name] of pairs) {
        const obj = readJsonParse(src, name);
        if (!obj || !obj['videoForm.creatorInformation.restrictions.fileSize.value']) continue;
        texts[code] = {};
        for (const k of SITE_TEXT_KEYS) if (obj[k] != null) texts[code][k] = obj[k];
        for (const k in obj) if (k.startsWith('markdownField.')) texts[code][k] = obj[k]; // 官方格式说明的标签
      }
      if (texts.en) return texts;
    }
    return null;
  }
  /** 发布页代码块：码率表（表头 FPS、行 720p…）、创作者链接、标记标准链接。 */
  function parseForm(src) {
    const out = {};
    const at = src.indexOf('creatorInformation.bitrate.limits');
    if (at >= 0) {
      const seg = src.slice(at, at + 6000);
      const fps = [...seg.matchAll(/children:"(\d+)\s*FPS"/g)].map((x) => +x[1]);
      const rows = [...seg.matchAll(/children:"(\d{3,4})p[^"]*"\}\)((?:,\(0,[\w$]+\.jsx\)\("td",\{children:"\d+"\}\))+)/g)].map((x) => [+x[1], ...[...x[2].matchAll(/"(\d+)"/g)].map((y) => +y[1])]);
      if (fps.length && rows.length) out.bitrate = { fps, rows };
    }
    out.links = [...src.matchAll(/to:"([^"]+)",children:\(0,[\w$]+\.jsx\)\([\w$]+\.Z,\{[^{}]*?id:"(videoForm\.creatorInformation\.[\w.]+)"/g)]
      .map((x) => ({ href: new URL(x[1], location.origin).href, key: x[2] })).filter((x, i, a) => a.findIndex((y) => y.key === x.key) === i);
    const tr = src.match(/to:"([^"]+)",children:\(0,[\w$]+\.jsx\)\([\w$]+\.Z,\{id:"form\.tagsDescription"/);
    if (tr) out.tagRule = new URL(tr[1], location.origin).href;
    return out;
  }
  /**
   * 官方「格式」说明弹窗（编辑框旁的「格式」按钮）在发布页代码块里是一段 JSX：
   * `(0,p.jsx)("div",{className:"markdownField__help",children:[…]})`。按语法读成一棵树，只留渲染要用的字段：
   * 标签名、文案键 id、图标 name、链接 to/href、图片 src、点标签时复制的示例（onClick 里 `return r("…")` 的参数）。
   * 组件名是压缩后的变量（h.Z、x.Z…），不认名字，只看属性。
   */
  function parseMdHelp(src) {
    const at = src.indexOf('className:"markdownField__help"');
    if (at < 0) return null;
    let pos = src.lastIndexOf('(0,', at);
    const ws = () => { while (/\s/.test(src[pos])) pos++; };
    const str = () => { const q = src[pos++]; let out = ''; while (pos < src.length && src[pos] !== q) { if (src[pos] === '\\') { out += src[pos] + src[pos + 1]; pos += 2; } else out += src[pos++]; } pos++; return unescapeJs(out); };
    const skip = () => {
      const start = pos;
      let d = 0;
      while (pos < src.length) {
        const c = src[pos];
        if (c === '"' || c === "'" || c === '`') { str(); continue; }
        if ('([{'.includes(c)) d++;
        else if (')]}'.includes(c)) { if (!d) break; d--; } else if (c === ',' && !d) break;
        pos++;
      }
      return { raw: src.slice(start, pos) };
    };
    let guard = 0;
    function expr() {
      if (++guard > 20000) throw new Error('mdhelp parse');
      ws();
      const c = src[pos];
      if (src.startsWith('(0,', pos)) return call();
      if (c === '"' || c === "'") {
        // 字符串后面还跟着东西（比如 "…".concat(…)）：整段当原文
        const start = pos, v = str();
        ws();
        if (!',}])'.includes(src[pos])) { pos = start; return skip(); }
        return v;
      }
      if (c === '[') { pos++; const arr = []; ws(); while (src[pos] !== ']') { arr.push(expr()); ws(); if (src[pos] === ',') pos++; ws(); } pos++; return arr; }
      if (c === '{') return obj();
      if (src.startsWith('!0', pos)) { pos += 2; return true; }
      if (src.startsWith('!1', pos)) { pos += 2; return false; }
      return skip();
    }
    function obj() {
      pos++;
      const o = {};
      ws();
      while (src[pos] !== '}') {
        let key;
        if (src[pos] === '"' || src[pos] === "'") key = str();
        else { key = /^[\w$]+/.exec(src.slice(pos, pos + 80))[0]; pos += key.length; }
        ws(); pos++; // :
        o[key] = expr();
        ws(); if (src[pos] === ',') pos++; ws();
      }
      pos++;
      return o;
    }
    function call() {
      pos = src.indexOf(')', pos) + 1; ws(); pos++; ws(); // (0,p.jsx)(
      const tag = src[pos] === '"' ? str() : skip().raw;
      ws(); pos++; // ,
      const props = expr();
      ws();
      while (src[pos] === ',') { pos++; expr(); ws(); }
      pos++; // )
      return { tag, props };
    }
    function simplify(n) {
      if (typeof n === 'string') return n;
      if (!n || !n.tag) return null;
      const p = n.props && typeof n.props === 'object' ? n.props : {};
      const out = { t: /^[a-z][a-z0-9]*$/.test(n.tag) ? n.tag : 'C', k: [].concat(p.children == null ? [] : p.children).map(simplify).filter((x) => x != null) };
      for (const key of ['id', 'name', 'to', 'href', 'className', 'size']) if (typeof p[key] === 'string') out[key] = p[key];
      if (typeof p.src === 'string') out.src = p.src;
      else if (p.src && p.src.raw) { const m = p.src.raw.match(/"([^"]+)"\.concat\([\s\S]*?,"([^"]+)"\)/); if (m) out.srcTpl = [m[1], m[2]]; }
      if (p.onClick && p.onClick.raw) { const m = p.onClick.raw.match(/return [\w$]+\(("(?:[^"\\]|\\.)*")\)/); if (m) { try { out.copy = JSON.parse(m[1]); } catch { /* 不是标准字符串就算了 */ } } }
      return out;
    }
    try { return simplify(expr()); } catch { return null; }
  }
  function scriptUrls() {
    const urls = new Set();
    for (const s of document.scripts) if (s.src) urls.add(s.src);
    for (const e of performance.getEntriesByType('resource')) if (/\.js(\?|$)/.test(e.name)) urls.add(e.name);
    return [...urls].filter((u) => u.startsWith(location.origin + '/'));
  }
  async function refresh() {
    const urls = scriptUrls();
    const main = urls.find((u) => /\/main\.[\w]+\.js/.test(u));
    const keys = SITE_TEXT_KEYS.join() + '|md2';
    if (data && data.main === main && data.keys === keys && data.texts && data.bitrate && data.mdHelp && Date.now() - data.at < 86400e3) return data;
    const next = { main, keys, at: Date.now(), texts: null, bitrate: null, links: [], tagRule: null, mdHelp: null };
    for (const u of urls) {
      let src;
      try { src = await (await fetch(u)).text(); } catch { continue; }
      if (!next.texts && src.includes('videoForm.creatorInformation.restrictions')) next.texts = parseTexts(src);
      if (src.includes('creatorInformation.bitrate.limits') && src.includes('"td"')) Object.assign(next, parseForm(src));
      if (!next.mdHelp && src.includes('markdownField__help')) next.mdHelp = parseMdHelp(src);
      if (next.texts && next.bitrate && next.mdHelp) break;
    }
    // 这次没读全（比如在编辑页、发布页代码块没加载）：缺的部分沿用上次缓存的
    if (data) for (const k of ['texts', 'bitrate', 'tagRule', 'mdHelp']) if (!next[k] && data[k]) next[k] = data[k];
    if (data && !next.links.length) next.links = data.links || [];
    if (next.texts || next.bitrate) { data = next; store.set('siteRules', data); }
    return data;
  }

  const en = (k) => (data && data.texts && data.texts.en && data.texts.en[k]) || '';
  const mb = (s) => [...String(s).matchAll(/(\d+(?:\.\d+)?)\s*(GB|MB)/gi)].map((m) => +m[1] * (m[2].toUpperCase() === 'GB' ? 1024 : 1));
  const formats = (s) => String(s).split('|').map((x) => x.trim()).filter(Boolean);
  function seconds(s) {
    const m = String(s).match(/(\d+(?:\.\d+)?)\s*(second|sec|s\b|minute|min|hour|h\b)?/i);
    if (!m) return null;
    const u = (m[2] || 's').toLowerCase();
    return +m[1] * (u.startsWith('h') ? 3600 : u.startsWith('m') ? 60 : 1);
  }
  return {
    load() { return loading || (loading = refresh().catch(() => data).finally(() => { loading = null; })); },
    /** 界面语言对应的站点文案；没有就退回英文；都没有返回空串。 */
    text(key) {
      const texts = (data && data.texts) || {};
      const code = env.lang;
      return (texts[code] && texts[code][key]) || (texts.en && texts.en[key]) || '';
    },
    /** 视频限制：{ containers:['.mp4'], codecs:['H.264','AAC'], sizeMB, premiumMB, minW, minH, minDur }，读不到的项为 null。 */
    video() {
      if (!data || !data.texts) return null;
      const f = formats(en('videoForm.creatorInformation.restrictions.fileFormats.value'));
      const size = mb(en('videoForm.creatorInformation.restrictions.fileSize.value'));
      const res = en('videoForm.creatorInformation.restrictions.fileResolution.value').match(/(\d+)\s*[*×x]\s*(\d+)/);
      return { containers: f.filter((x) => x.startsWith('.')).map((x) => x.toLowerCase()), codecs: f.filter((x) => !x.startsWith('.')), sizeMB: size[0] || null, premiumMB: size[1] || null,
        minW: res ? +res[1] : null, minH: res ? +res[2] : null, minDur: seconds(en('videoForm.creatorInformation.restrictions.fileDuration.value')) };
    },
    /** 图片限制：{ exts:['.jpg',…], sizeMB }。 */
    image() {
      if (!data || !data.texts) return null;
      return { exts: formats(en('imageForm.creatorInformation.restrictions.fileFormats.value')).map((x) => x.toLowerCase()), sizeMB: mb(en('imageForm.creatorInformation.restrictions.fileSize.value'))[0] || null };
    },
    /** 码率上限：{ fps:[30,60], rows:[[720,4500,6300],…] } 或 null。 */
    bitrate: () => (data && data.bitrate) || null,
    links: () => (data && data.links) || [],
    tagRule: () => (data && data.tagRule) || null,
    /** 官方格式说明的 JSX 树（见 parseMdHelp），读不到为 null。 */
    mdHelp: () => (data && data.mdHelp) || null,
  };
})();
