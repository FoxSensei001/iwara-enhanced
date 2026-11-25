const VERSION = '0.1.0';
const NS = 'iwe:';

// ── DOM 小工具 ────────────────────────────────────────────────────────────
/** 建节点：h('div.card', {onclick, style:{}, title}, ...子节点)。子节点可为字符串 / 节点 / 数组 / 假值。 */
function h(spec, props, ...kids) {
  const [tag, ...cls] = spec.split('.');
  const el = document.createElement(tag || 'div');
  if (cls.length) el.className = cls.join(' ');
  if (props && (props.nodeType || typeof props !== 'object' || Array.isArray(props))) {
    kids.unshift(props);
    props = null;
  }
  for (const k in props || {}) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'class') el.className += ' ' + v;
    else if (k === 'data') Object.assign(el.dataset, v);
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k in el && k !== 'list') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  add(el, kids);
  return el;
}
function add(el, kids) {
  for (const k of [].concat(kids)) {
    if (k == null || k === false) continue;
    if (Array.isArray(k)) add(el, k);
    else el.append(k.nodeType ? k : document.createTextNode(String(k)));
  }
  return el;
}
const clear = (el) => { el.replaceChildren(); return el; };
/** 离开工作台的跳转一律新开页签（工作台里的草稿、上传都不受影响）。 */
const openTab = (url) => window.open(new URL(url, location.origin).href, '_blank', 'noopener');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const uid = () => Math.random().toString(36).slice(2, 10);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── 本地存储（都放在站点自己的 localStorage 里，键带前缀）─────────────────
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(NS + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; } catch { return false; }
  },
  del(key) { try { localStorage.removeItem(NS + key); } catch { /* 忽略 */ } },
};

// 旧版本的键以 iwcs: 开头：搬到新前缀下（新键已存在就不覆盖），搬完删掉旧键
(function migrateOldKeys() {
  try {
    const OLD = 'iwcs:';
    for (const area of [localStorage, sessionStorage]) {
      const keys = [];
      for (let i = 0; i < area.length; i++) { const k = area.key(i); if (k && k.startsWith(OLD)) keys.push(k); }
      for (const k of keys) {
        const nk = NS + k.slice(OLD.length);
        if (area.getItem(nk) == null) area.setItem(nk, area.getItem(k));
        area.removeItem(k);
      }
    }
  } catch { /* 存储不可用就算了 */ }
})();

// ── 极简事件总线 ─────────────────────────────────────────────────────────
function emitter() {
  const map = new Map();
  return {
    on(evt, fn) { (map.get(evt) || map.set(evt, new Set()).get(evt)).add(fn); return () => map.get(evt).delete(fn); },
    emit(evt, payload) { for (const fn of map.get(evt) || []) fn(payload); },
  };
}

// ── 文案（界面语言跟随站点：中文 / 其他一律英文）─────────────────────────
const STR = {
  zh: {
    video: '视频', image: '图片', publishVideo: '发布视频', publishImage: '发布图片', editVideo: '编辑视频', editImage: '编辑图片',
    stepUpload: '上传', stepContent: '内容', stepTags: '标签', stepPublish: '发布',
    back: '上一步', next: '下一步', publish: '发布', save: '保存', cancel: '取消', done: '完成', remove: '移除', delete: '删除', edit: '编辑', open: '打开', retry: '重试', undo: '撤销', close: '关闭',
    dropVideo: '拖入视频，或点击选择', dropImage: '拖入图片，或点击选择', dropHere: '松手上传', replace: '更换', file: '文件', embed: '嵌入', embedPh: 'YouTube 链接', embedBad: '认不出这个链接：只支持 YouTube 视频链接（youtu.be/… 或 youtube.com/watch?v=…）', checkEmbed: '视频链接',
    uploading: '上传中', queued: '排队中', processing: '处理中', ready: '就绪', failed: '失败',
    errType: '只支持 MP4', errDuration: '时长不足 20 秒', errResolution: '像素总数低于 960×720', errSize: '文件超过 {n}MB', errImgType: '不支持的图片格式', errImgSize: '单张超过 15MB', errUpload: '上传失败', errProcess: '处理失败', errNetwork: '网络出错', errLogin: '请先登录 Iwara',
    srv_categoryRequired: '必须选一个类别，而且只能选一个', srv_fieldRequired: '必填', srv_invalidTag: '有标签无效（不存在或不允许使用）', srv_invalidValue: '取值不合法', srv_tagLimit: '标签最多 {limit} 个', srv_tooLong: '太长了',
    srv_invalidContent: '内容疑似垃圾信息，被服务端拦下', srv_forbidden: '账号没有权限做这件事', srv_userBanned: '账号被封禁，{timeLeft} 解除', srv_tooManyRequests: '操作太频繁，请稍等再试', srv_serverError: '服务器出错，请稍后再试',
    srv_notFound: '找不到这条内容', srv_gone: '这条内容已经不在了', srv_privateVideo: '私人视频', srv_differentSite: '这条内容属于站点网络里的另一个站', srv_validationError: '校验没通过',
    srv_invalidFile: '文件无效', srv_fileTooLarge: '文件太大', srv_invalidMime: '文件类型不支持', srv_unknown: '未知错误，请重试',
    fld_title: '标题', fld_body: '简介', fld_tags: '标签', fld_rating: '分级', fld_file: '文件', fld_files: '图片', fld_embedUrl: '视频链接', fld_thumbnail: '封面', fld_customThumbnail: '自定义封面', fld_private: '可见范围', fld_unlisted: '可见范围',
    title: '标题', titlePh: '给作品起个名字', bodyPh: '写点什么… 支持 Markdown，输入 @ 提及用户，粘贴站内链接引用作品',
    bold: '粗体', italic: '斜体', strike: '删除线', heading: '标题', quote: '引用', list: '列表', code: '代码', link: '链接', picture: '图片', divider: '分隔线', mention: '提及用户', source: '源码', urlPh: '粘贴链接', searchMine: '搜索我的作品',
    category: '类别', searchTags: '搜索标签：英文、简体中文、繁體中文、日本語都能搜', videoTags: '视频标签', mdFormat: '格式参考', tagProject: '有疑问，或者想一起改进译名？去标签项目看看', imageTags: '图片标签', tagSourceTip: '标签都来自 Iwara 站点，只有英文是站点的原名；简体中文、繁體中文、日本語的译名是 AI 翻译的，可能不准。拿不准时以英文原名为准，发布时提交的也是英文原名。本地词库里没有的标签会再去站点搜，那边只能用英文搜。', frequent: '常用', lastUsed: '上次用过', characters: '角色', series: '作品', general: '通用', noResult: '没有找到', usedTags: '用过的标签', forgetTag: '不再显示', tagForgotten: '已移除「{n}」', searching: '搜索中', searchingUsers: '正在搜索用户', searchingSite: '正在搜索站点标签', fromSite: '站点标签', suggestTag: '在原版页面申请新标签', clearAll: '清空', needCategory: '选一个类别',
    rating: '分级', ratingGeneral: '普通', ratingEcchi: '成人', visibility: '可见范围', vPublic: '公开', vUnlisted: '不列出', vPrivate: '仅好友', sensitive: '敏感内容', cover: '封面', coverCustom: '自定义', coverCustomTip: '上传自己的封面图（高级会员）', coverReplaceTip: '点击更换封面图', coverRemove: '移除自定义封面', coverCustomNote: '自定义封面发布后只能更换，不能再改回视频截帧（服务端不支持）', coverLockedNote: '这个视频已有自定义封面：只能点它换一张图，不能改回视频截帧（服务端不支持）', reach: '谁能看到',
    reachPublic: '会出现在列表和搜索里', reachUnlisted: '不进列表和搜索，只有拿到链接的人能看到', reachPrivate: '只有好友能看到', reachSensitive: '带有「{n}」：站点默认把这类标签加进每个用户的屏蔽列表，只有自己去掉屏蔽的人才看得到', reachEcchi: '成人分级：分级筛选选了「普通」的人看不到',
    rules: '我已阅读并同意', rulesLink: '网站规则', checkTitle: '标题', checkFile: '文件', checkCategory: '类别', checkSlots: '{n} 处填空未填', checkRules: '同意规则',
    cooldown: '冷却中', publishing: '发布中', saving: '保存中', published: '已发布', saved: '已保存', transcoding: '转码中', live: '已上线', viewPage: '查看页面', another: '再发一个', manage: '内容管理',
    templates: '模板', useTemplate: '用模板', saveAsTemplate: '存为模板', templateName: '模板名称', myTemplates: '我的模板', samples: '示例', lastPublish: '上次发布', applied: '已套用「{n}」', tplSaved: '已存为模板', makeSlot: '设为填空', slotName: '填空名称', slotNameTip: '填空名是给自己看的提示，比如「角色」「曲名」', slotHowTo: '在标题或简介里选中一段文字，就能把它设为填空', searchTpl: '搜索模板：名称、标题、标签', keepTitle: '标题格式', keepBody: '简介', keepTags: '标签', keepSettings: '分级与可见范围', exportTpl: '导出模板', importTpl: '导入模板', blank: '空白', update: '更新', episode: '期数',
    original: '原版页面', backToStudio: '回到工作台', draftRestored: '已恢复草稿', discardDraft: '丢弃草稿', unsaved: '有未保存的修改',
    views: '播放', likes: '点赞', comments: '评论', works: '作品', sortNew: '最新', sortViews: '播放最多', sortLikes: '点赞最多', searchWorks: '搜索标题', empty: '还没有作品', confirmDelete: '永久删除？', deleted: '已删除', posts: '帖子', polls: '投票',
    sg1t: '什么是填空：模板里每次要改的内容', sg1s: '模板里写成 {角色} 这种格式。套用模板后，标题和简介里会留下这些紫色的空位，等你填上这一次的内容；其余的字原样保留。',
    sg2t: '怎么设置填空：选中文字，设为填空', sg2s: '在「存为模板」或编辑模板时，选中标题或简介里每次会变的那段字，上方会浮出「设为填空」。点它或按回车，起个名字（比如「角色」），这段字就变成了填空。也可以直接输入 {角色}。',
    sg3t: '怎么填写：点一下填空，直接打字', sg3s: '点一下填空，它会变成橙色的编辑区，上方一直标着原来要填什么。直接输入就会替换掉原文，中文输入法照常用；按回车或 → 就算填完。',
    sg4t: '有多个填空：按 Tab 依次填写', sg4s: '进到这一步时光标已经在第一个填空里。按 Tab 跳到下一个，标题填完会接着跳到简介；最后一格按 Tab 或回车就算填完。还有没填的，「下一步」会拦住你，悬停能看到是哪几处。',
    sgKeyTab: '下一个填空', sgKeyDone: '这一格填完', sgKeyBack: '空着时退出；光标在填空后面时整个删掉', sbDelete: '删掉', sbNext: '下一个', sbDone: '完成', sbStart: '开始填空', sbLeft: '还剩 {n} 个', sbLast: '最后一个', sbHave: '还有 {n} 个填空', sbAllDone: '填空都填好了', sg2sT: '在「存为模板」或编辑模板时，长按选中标题或简介里每次会变的那段字，拖动两端调整范围，上方会浮出「设为填空」。点它，起个名字（比如「角色」），这段字就变成了填空。也可以直接输入 {角色}。', sg3sT: '点一下填空，它会变成橙色的编辑区，上方一直标着原来要填什么。直接输入或粘贴就会替换掉原文，中文输入法照常用；填好点键盘上方的「完成」。', sg4tT: '有多个填空：用键盘上方的填空条', sg4sT: '点一下任意一个填空，键盘上方会出现填空条，写着正在填哪一格、还剩几个。「下一个」跳到下一个空，标题填完接着到简介；用不上的空点「删掉」；最后一格点「完成」收起键盘。还有没填的，「下一步」会拦住你并带你回到那一格。', sgTouchNext: '跳到下一个空', sgTouchDel: '去掉用不上的空', sgTouchDone: '这一格填完，收起键盘', sgReplay: '重播', sgDone: '知道了', slotGuide: '填空怎么用', help: '帮助', cleared: '已清空{n}', notReady: '还不能继续：{n}', keyNextHint: '下一步（→，输入时用 ⌘/Ctrl+↵）', keyPrevHint: '上一步（←，输入时用 ⌘/Ctrl+⇧+↵）',
    tour1: '发布分四步完成', tour2: '用中文搜索标签', tour3: '用模板快速发布', tourStart: '开始', tourSkip: '跳过', tourTry: '用示例模板试试',
    fCodec: '编码', fSize: '大小', fRes: '分辨率', fDur: '时长', fRate: '码率', fFormat: '格式', fCount: '张数', fImgOrder: '拖动图片可以调整顺序', fImgOrderTouch: '长按图片拖动可以调整顺序', fNoAudio: '无音轨', fPremium: '（高级会员 {n} MB）', fDurHint: '≥ {n} 秒', fRateHint: '按分辨率和帧率有上限，悬停看表', fRateHintTouch: '按分辨率和帧率有上限，点按看表', fRateLimit: '{p}p 上限 {n} kb/s（{fps}）', fMaybe: '{n} 帧不重编', fOk: '符合', fReencode: '会被重新编码', fBad: '不符合', fChecking: '检测中', fImgSize: '每张 ≤ {n} MB', fBiggest: '最大一张 {n}', fRejected: '{n} 个文件没传上去：', creatorLinks: '创作者链接',
    tagStandard: '标记标准',
    staleNote: '其他人可能要过一会儿才看到修改',
  },
  en: {
    video: 'Video', image: 'Image', publishVideo: 'New video', publishImage: 'New image post', editVideo: 'Edit video', editImage: 'Edit image post',
    stepUpload: 'Upload', stepContent: 'Content', stepTags: 'Tags', stepPublish: 'Publish',
    back: 'Back', next: 'Next', publish: 'Publish', save: 'Save', cancel: 'Cancel', done: 'Done', remove: 'Remove', delete: 'Delete', edit: 'Edit', open: 'Open', retry: 'Retry', undo: 'Undo', close: 'Close',
    dropVideo: 'Drop a video, or click to choose', dropImage: 'Drop images, or click to choose', dropHere: 'Release to upload', replace: 'Replace', file: 'File', embed: 'Embed', embedPh: 'YouTube link', embedBad: 'Can’t read this link: only YouTube video links are supported (youtu.be/… or youtube.com/watch?v=…)', checkEmbed: 'Video link',
    uploading: 'Uploading', queued: 'Queued', processing: 'Processing', ready: 'Ready', failed: 'Failed',
    errType: 'MP4 only', errDuration: 'Shorter than 20 s', errResolution: 'Fewer pixels than 960×720', errSize: 'Larger than {n} MB', errImgType: 'Unsupported image format', errImgSize: 'Over 15 MB', errUpload: 'Upload failed', errProcess: 'Processing failed', errNetwork: 'Network error', errLogin: 'Sign in to Iwara first',
    srv_categoryRequired: 'Exactly one category tag is required', srv_fieldRequired: 'Required', srv_invalidTag: 'A tag is not valid', srv_invalidValue: 'Invalid value', srv_tagLimit: 'At most {limit} tags', srv_tooLong: 'Too long',
    srv_invalidContent: 'Flagged as possible spam', srv_forbidden: 'Your account is not allowed to do this', srv_userBanned: 'You are banned, expires {timeLeft}', srv_tooManyRequests: 'Too many requests, please wait a bit', srv_serverError: 'Server error, try again later',
    srv_notFound: 'Not found', srv_gone: 'This content is gone', srv_privateVideo: 'Private video', srv_differentSite: 'This content belongs to another site in the network', srv_validationError: 'Validation error',
    srv_invalidFile: 'Invalid file', srv_fileTooLarge: 'File too large', srv_invalidMime: 'Unsupported file type', srv_unknown: 'Unknown error, please try again',
    fld_title: 'Title', fld_body: 'Description', fld_tags: 'Tags', fld_rating: 'Rating', fld_file: 'File', fld_files: 'Images', fld_embedUrl: 'Video link', fld_thumbnail: 'Cover', fld_customThumbnail: 'Custom cover', fld_private: 'Visibility', fld_unlisted: 'Visibility',
    title: 'Title', titlePh: 'Name your work', bodyPh: 'Write something… Markdown works, type @ to mention, paste a site link to reference a work',
    bold: 'Bold', italic: 'Italic', strike: 'Strikethrough', heading: 'Heading', quote: 'Quote', list: 'List', code: 'Code', link: 'Link', picture: 'Image', divider: 'Divider', mention: 'Mention', source: 'Source', urlPh: 'Paste a link', searchMine: 'Search my works',
    category: 'Category', searchTags: 'Search tags in English, 简体中文, 繁體中文 or 日本語', videoTags: 'Video tags', mdFormat: 'Formatting', tagProject: 'Questions, or want to help improve the translations? Visit the tag project', imageTags: 'Image tags', tagSourceTip: 'Tags come from Iwara. Only the English names are the site’s own; the Simplified Chinese, Traditional Chinese and Japanese names are AI translations and may be off. When unsure, go by the English name — that is what gets submitted. Tags missing from the local list are also searched on the site, which only understands English.', frequent: 'Frequent', lastUsed: 'Last used', characters: 'Characters', series: 'Series', general: 'General', noResult: 'Nothing found', usedTags: 'Used tags', forgetTag: 'Remove from here', tagForgotten: 'Removed “{n}”', searching: 'Searching', searchingUsers: 'Searching users', searchingSite: 'Searching site tags', fromSite: 'Site tags', suggestTag: 'Suggest a new tag on the original page', clearAll: 'Clear', needCategory: 'Pick a category', // i18n-ok 语言自称
    rating: 'Rating', ratingGeneral: 'General', ratingEcchi: 'Ecchi', visibility: 'Visibility', vPublic: 'Public', vUnlisted: 'Unlisted', vPrivate: 'Friends', sensitive: 'Sensitive content', cover: 'Cover', coverCustom: 'Custom', coverCustomTip: 'Upload your own cover image (Premium)', coverReplaceTip: 'Click to replace the cover image', coverRemove: 'Remove custom cover', coverCustomNote: 'Once published, a custom cover can only be replaced, not switched back to a video frame (server limitation)', coverLockedNote: 'This video has a custom cover: click it to replace the image; it cannot go back to a video frame (server limitation)', reach: 'Who can see it',
    reachPublic: 'Shows up in lists and search', reachUnlisted: 'Kept out of lists and search; anyone with the link can watch', reachPrivate: 'Only your friends can see it', reachSensitive: 'Tagged “{n}”: the site blocks these tags for everyone by default, so only people who unblocked them will see it', reachEcchi: 'Ecchi rating: hidden from people filtering for General only',
    rules: 'I have read and agree to the', rulesLink: 'site rules', checkTitle: 'Title', checkFile: 'File', checkCategory: 'Category', checkSlots: '{n} blanks left', checkRules: 'Rules',
    cooldown: 'Cooldown', publishing: 'Publishing', saving: 'Saving', published: 'Published', saved: 'Saved', transcoding: 'Transcoding', live: 'Live', viewPage: 'View page', another: 'Publish another', manage: 'Content',
    templates: 'Templates', useTemplate: 'Use template', saveAsTemplate: 'Save as template', templateName: 'Template name', myTemplates: 'My templates', samples: 'Samples', lastPublish: 'Last publish', applied: 'Applied “{n}”', tplSaved: 'Template saved', makeSlot: 'Make it a blank', slotName: 'Blank name', slotNameTip: 'A hint for yourself, like “Character” or “Song”', slotHowTo: 'Select some text in the title or description to turn it into a blank', searchTpl: 'Search templates: name, title, tags', keepTitle: 'Title pattern', keepBody: 'Description', keepTags: 'Tags', keepSettings: 'Rating & visibility', exportTpl: 'Export templates', importTpl: 'Import templates', blank: 'Blank', update: 'Update', episode: 'Episode',
    original: 'Original page', backToStudio: 'Back to studio', draftRestored: 'Draft restored', discardDraft: 'Discard draft', unsaved: 'Unsaved changes',
    views: 'Views', likes: 'Likes', comments: 'Comments', works: 'Works', sortNew: 'Newest', sortViews: 'Most viewed', sortLikes: 'Most liked', searchWorks: 'Search titles', empty: 'Nothing here yet', confirmDelete: 'Delete forever?', deleted: 'Deleted', posts: 'Posts', polls: 'Polls',
    sg1t: 'What a blank is: the parts you change each time', sg1s: 'A template can contain {Character}-style blanks. After you apply it, the title and description keep the rest of the text and leave these purple blanks for this upload.',
    sg2t: 'Set up a blank: select text, make it a blank', sg2s: 'When saving or editing a template, select the part of the title or description that changes each time. “Make it a blank” pops up above it — click it or press Enter and give it a name. You can also just type {Character}.',
    sg3t: 'Fill in a blank: click it and type', sg3s: 'Click a blank and it becomes an orange edit area, with what it stands for shown above. Typing replaces it; press Enter or → when you are done.',
    sg4t: 'Several blanks: press Tab to move through them', sg4s: 'The cursor starts in the first blank. Tab jumps to the next one, from the title on into the description; Tab or Enter on the last one finishes it. “Next” stops you while blanks are left — hover it to see which.',
    sgKeyTab: 'Next blank', sgKeyDone: 'Done with this one', sgKeyBack: 'Leave an empty blank; right after a blank, delete it whole', sbDelete: 'Remove', sbNext: 'Next', sbDone: 'Done', sbStart: 'Start', sbLeft: '{n} more', sbLast: 'Last one', sbHave: '{n} blanks left', sbAllDone: 'All blanks filled', sg2sT: 'When saving or editing a template, long-press the part of the title or description that changes each time and drag the handles to adjust. “Make it a blank” pops up above it — tap it and give it a name. You can also just type {Character}.', sg3sT: 'Tap a blank and it becomes an orange edit area, with what it stands for shown above. Typing or pasting replaces it; tap “Done” above the keyboard when you are finished.', sg4tT: 'Several blanks: use the bar above the keyboard', sg4sT: 'Tap any blank and a bar appears above the keyboard, showing which blank you are in and how many are left. “Next” moves on, from the title into the description; “Remove” drops a blank you don’t need; “Done” on the last one closes the keyboard. “Next step” stops you while blanks are left and takes you back to them.', sgTouchNext: 'Go to the next blank', sgTouchDel: 'Drop a blank you don’t need', sgTouchDone: 'Finish this one, close the keyboard', sgReplay: 'Replay', sgDone: 'Got it', slotGuide: 'How blanks work', help: 'Help', cleared: 'Cleared {n}', notReady: 'Can’t continue yet: {n}', keyNextHint: 'Next (→, or ⌘/Ctrl+↵ while typing)', keyPrevHint: 'Back (←, or ⌘/Ctrl+⇧+↵ while typing)',
    tour1: 'Publish in four steps', tour2: 'Search tags in your language', tour3: 'Publish faster with templates', tourStart: 'Start', tourSkip: 'Skip', tourTry: 'Try a sample template',
    fCodec: 'Codec', fSize: 'Size', fRes: 'Resolution', fDur: 'Length', fRate: 'Bitrate', fFormat: 'Format', fCount: 'Images', fImgOrder: 'Drag images to reorder', fImgOrderTouch: 'Long-press and drag an image to reorder', fNoAudio: 'no audio', fPremium: ' (Premium {n} MB)', fDurHint: '≥ {n} s', fRateHint: 'Capped by resolution and frame rate — hover for the table', fRateHintTouch: 'Capped by resolution and frame rate — tap for the table', fRateLimit: '{p}p cap {n} kb/s ({fps})', fMaybe: 'OK at {n} FPS', fOk: 'OK', fReencode: 'Will be re-encoded', fBad: 'Not allowed', fChecking: 'Checking', fImgSize: '≤ {n} MB each', fBiggest: 'largest {n}', fRejected: '{n} file(s) not uploaded: ', creatorLinks: 'Creator links',
    tagStandard: 'Tagging standard',
    staleNote: 'Others may see the change a little later',
  },
  // 日文：键缺了就退回英文。界面语言和站点支持的语言一致：English / 日本語 / 中文
  ja: {
    video: '動画', image: '画像', publishVideo: '動画を投稿', publishImage: '画像を投稿', editVideo: '動画を編集', editImage: '画像を編集',
    stepUpload: 'アップロード', stepContent: '内容', stepTags: 'タグ', stepPublish: '公開',
    back: '戻る', next: '次へ', publish: '公開', save: '保存', cancel: 'キャンセル', done: '完了', remove: '外す', delete: '削除', edit: '編集', open: '開く', retry: '再試行', undo: '元に戻す', close: '閉じる',
    dropVideo: '動画をドロップ、またはクリックして選択', dropImage: '画像をドロップ、またはクリックして選択', dropHere: '離すとアップロード', replace: '差し替え', file: 'ファイル', embed: '埋め込み', embedPh: 'YouTube のリンク', embedBad: 'このリンクは認識できません：YouTube の動画リンク（youtu.be/… または youtube.com/watch?v=…）のみ対応しています', checkEmbed: '動画リンク',
    uploading: 'アップロード中', queued: '待機中', processing: '処理中', ready: '準備完了', failed: '失敗',
    errType: 'MP4 のみ対応', errDuration: '20 秒未満です', errResolution: '総画素数が 960×720 未満です', errSize: '{n}MB を超えています', errImgType: '非対応の画像形式です', errImgSize: '1 枚が 15MB を超えています', errUpload: 'アップロードに失敗しました', errProcess: '処理に失敗しました', errNetwork: 'ネットワークエラー', errLogin: '先に Iwara にログインしてください',
    srv_categoryRequired: 'カテゴリを 1 つだけ選ぶ必要があります', srv_fieldRequired: '必須項目です', srv_invalidTag: '無効なタグがあります（存在しないか、使用できません）', srv_invalidValue: '値が正しくありません', srv_tagLimit: 'タグは最大 {limit} 個までです', srv_tooLong: '長すぎます',
    srv_invalidContent: 'スパムの疑いがあるため、サーバーに拒否されました', srv_forbidden: 'このアカウントには権限がありません', srv_userBanned: 'アカウントが停止されています（{timeLeft} に解除）', srv_tooManyRequests: '操作が多すぎます。しばらくしてからお試しください', srv_serverError: 'サーバーエラーです。しばらくしてからお試しください',
    srv_notFound: '見つかりません', srv_gone: 'このコンテンツは存在しません', srv_privateVideo: '非公開動画', srv_differentSite: 'このコンテンツは、ネットワーク内の別のサイトのものです', srv_validationError: '検証に失敗しました',
    srv_invalidFile: '無効なファイルです', srv_fileTooLarge: 'ファイルが大きすぎます', srv_invalidMime: '非対応のファイル形式です', srv_unknown: '不明なエラーです。もう一度お試しください',
    fld_title: 'タイトル', fld_body: '説明', fld_tags: 'タグ', fld_rating: 'レーティング', fld_file: 'ファイル', fld_files: '画像', fld_embedUrl: '動画リンク', fld_thumbnail: 'サムネイル', fld_customThumbnail: 'カスタムサムネイル', fld_private: '公開範囲', fld_unlisted: '公開範囲',
    title: 'タイトル', titlePh: '作品に名前を付けましょう', bodyPh: '自由に書いてください… Markdown 対応。@ でユーザーをメンション、サイト内リンクを貼ると作品を引用できます',
    bold: '太字', italic: '斜体', strike: '取り消し線', heading: '見出し', quote: '引用', list: 'リスト', code: 'コード', link: 'リンク', picture: '画像', divider: '区切り線', mention: 'メンション', source: 'ソース', urlPh: 'リンクを貼り付け', searchMine: '自分の作品を検索',
    category: 'カテゴリ', searchTags: 'タグを検索：English、简体中文、繁體中文、日本語で検索できます', videoTags: '動画タグ', mdFormat: '書式の参考', tagProject: '質問や、訳語の改善への協力はこちら：タグプロジェクト', imageTags: '画像タグ', tagSourceTip: 'タグはすべて Iwara のものです。サイト本来の名前は英語のみで、简体中文・繁體中文・日本語の名前は AI 翻訳のため、不正確な場合があります。迷ったときは英語の原名を基準にしてください。公開時に送信されるのも英語の原名です。ローカル辞書にないタグはサイトでも検索しますが、サイト側は英語でしか検索できません。', frequent: 'よく使う', lastUsed: '前回使用', characters: 'キャラクター', series: '作品', general: '一般', noResult: '見つかりません', usedTags: '使用したタグ', forgetTag: '表示しない', tagForgotten: '「{n}」を外しました', searching: '検索中', searchingUsers: 'ユーザーを検索中', searchingSite: 'サイトのタグを検索中', fromSite: 'サイトのタグ', suggestTag: '元のページで新しいタグを申請', clearAll: 'クリア', needCategory: 'カテゴリを選択', // i18n-ok 语言自称
    rating: 'レーティング', ratingGeneral: '一般', ratingEcchi: 'エッチ', visibility: '公開範囲', vPublic: '公開', vUnlisted: '限定公開', vPrivate: 'フレンドのみ', sensitive: 'センシティブな内容', cover: 'サムネイル', coverCustom: 'カスタム', coverCustomTip: '自分のサムネイル画像をアップロード（プレミアム会員）', coverReplaceTip: 'クリックしてサムネイルを差し替え', coverRemove: 'カスタムサムネイルを外す', coverCustomNote: '公開後はカスタムサムネイルの差し替えのみ可能で、動画のフレームには戻せません（サーバーの仕様）', coverLockedNote: 'この動画にはカスタムサムネイルがあります：クリックして別の画像に差し替えられますが、動画のフレームには戻せません（サーバーの仕様）', reach: '見られる人',
    reachPublic: '一覧と検索に表示されます', reachUnlisted: '一覧と検索には表示されず、リンクを知っている人だけが見られます', reachPrivate: 'フレンドだけが見られます', reachSensitive: '「{n}」付き：サイトの初期設定ではこの種のタグが全ユーザーのブロックリストに入っているため、ブロックを外した人だけが見られます', reachEcchi: 'エッチのレーティング：レーティングで「一般」を選んでいる人には表示されません',
    rules: '次の内容を読み、同意します：', rulesLink: 'サイトルール', checkTitle: 'タイトル', checkFile: 'ファイル', checkCategory: 'カテゴリ', checkSlots: '空欄が {n} 箇所未入力', checkRules: 'ルールへの同意',
    cooldown: 'クールダウン中', publishing: '公開処理中', saving: '保存中', published: '公開しました', saved: '保存しました', transcoding: '変換中', live: '公開中', viewPage: 'ページを見る', another: '続けて投稿', manage: 'コンテンツ管理',
    templates: 'テンプレート', useTemplate: 'テンプレートを使う', saveAsTemplate: 'テンプレートとして保存', templateName: 'テンプレート名', myTemplates: 'マイテンプレート', samples: 'サンプル', lastPublish: '前回の投稿', applied: '「{n}」を適用しました', tplSaved: 'テンプレートを保存しました', makeSlot: '空欄にする', slotName: '空欄の名前', slotNameTip: '自分用のヒントです。例：「キャラ」「曲名」', slotHowTo: 'タイトルか説明の文字列を選択すると、空欄にできます', searchTpl: 'テンプレートを検索：名前、タイトル、タグ', keepTitle: 'タイトルの形式', keepBody: '説明', keepTags: 'タグ', keepSettings: 'レーティングと公開範囲', exportTpl: 'テンプレートを書き出し', importTpl: 'テンプレートを読み込み', blank: '空白', update: '更新', episode: '話数',
    original: '元のページ', backToStudio: 'スタジオに戻る', draftRestored: '下書きを復元しました', discardDraft: '下書きを破棄', unsaved: '未保存の変更があります',
    views: '再生数', likes: 'いいね', comments: 'コメント', works: '作品', sortNew: '新着順', sortViews: '再生数順', sortLikes: 'いいね順', searchWorks: 'タイトルを検索', empty: 'まだ作品がありません', confirmDelete: '完全に削除しますか？', deleted: '削除しました', posts: '投稿', polls: '投票',
    sg1t: '空欄とは：テンプレートの中で毎回変える部分', sg1s: 'テンプレートには {キャラ} のような形で空欄を書けます。適用すると、タイトルと説明にはこの紫色の空欄が残り、今回の内容を入力できます。それ以外の文字はそのまま残ります。',
    sg2t: '空欄の作り方：文字を選んで空欄にする', sg2s: '「テンプレートとして保存」またはテンプレートの編集中に、タイトルか説明の中で毎回変わる部分を選択すると、上に「空欄にする」が表示されます。クリックするか Enter キーを押して名前（例：「キャラ」）を付けると、その部分が空欄になります。{キャラ} と直接入力しても作れます。',
    sg3t: '入力の仕方：空欄をクリックして、そのまま入力', sg3s: '空欄をクリックするとオレンジ色の入力欄になり、上に元の用途が表示されます。そのまま入力すると置き換わり、日本語入力（IME）も使えます。Enter キーか → キーで入力完了です。',
    sg4t: '空欄が複数ある場合：Tab キーで順に入力', sg4s: 'この手順に入ると、カーソルは最初の空欄に入っています。Tab キーで次へ進み、タイトルが終わると説明に移ります。最後の空欄で Tab キーか Enter キーを押すと完了です。未入力の空欄があると「次へ」で止められます。カーソルを重ねると場所が分かります。',
    sgKeyTab: '次の空欄', sgKeyDone: 'この空欄を完了', sgKeyBack: '空のときは抜ける。空欄の直後なら丸ごと削除', sbDelete: '削除', sbNext: '次へ', sbDone: '完了', sbStart: '入力開始', sbLeft: '残り {n} 個', sbLast: '最後の 1 個', sbHave: '空欄があと {n} 個', sbAllDone: '空欄をすべて入力しました', sg2sT: '「テンプレートとして保存」またはテンプレートの編集中に、タイトルか説明の中で毎回変わる部分を長押しして選択し、両端をドラッグして範囲を調整すると、上に「空欄にする」が表示されます。タップして名前（例：「キャラ」）を付けると、その部分が空欄になります。{キャラ} と直接入力しても作れます。', sg3sT: '空欄をタップするとオレンジ色の入力欄になり、上に元の用途が表示されます。そのまま入力または貼り付けると置き換わり、日本語入力（IME）も使えます。入力できたら、キーボード上の「完了」をタップしてください。', sg4tT: '空欄が複数ある場合：キーボード上のバーを使う', sg4sT: 'どれか 1 つの空欄をタップすると、キーボードの上にバーが表示され、今どの空欄か、あと何個かが分かります。「次へ」で次の空欄に移り、タイトルが終わると説明に進みます。不要な空欄は「削除」で外せます。最後の空欄では「完了」でキーボードを閉じます。未入力の空欄があると「次へ」で止められ、その空欄まで戻ります。', sgTouchNext: '次の空欄へ移動', sgTouchDel: '不要な空欄を外す', sgTouchDone: 'この空欄を完了してキーボードを閉じる', sgReplay: 'もう一度見る', sgDone: 'わかりました', slotGuide: '空欄の使い方', help: 'ヘルプ', cleared: '{n} をクリアしました', notReady: 'まだ進めません：{n}', keyNextHint: '次へ（→、入力中は ⌘/Ctrl+↵）', keyPrevHint: '戻る（←、入力中は ⌘/Ctrl+⇧+↵）',
    tour1: '公開は 4 ステップで完了', tour2: '日本語でタグを検索', tour3: 'テンプレートですばやく公開', tourStart: '開始', tourSkip: 'スキップ', tourTry: 'サンプルのテンプレートを試す',
    fCodec: 'コーデック', fSize: 'サイズ', fRes: '解像度', fDur: '長さ', fRate: 'ビットレート', fFormat: '形式', fCount: '枚数', fImgOrder: '画像をドラッグして順番を変更', fImgOrderTouch: '画像を長押ししてドラッグすると順番を変更できます', fNoAudio: '音声なし', fPremium: '（プレミアム会員 {n} MB）', fDurHint: '{n} 秒以上', fRateHint: '解像度とフレームレートごとに上限があります。カーソルを重ねると表を表示', fRateHintTouch: '解像度とフレームレートごとに上限があります。タップすると表を表示', fRateLimit: '{p}p の上限 {n} kb/s（{fps}）', fMaybe: '{n} fps なら再エンコード不要', fOk: '問題なし', fReencode: '再エンコードされます', fBad: '対応していません', fChecking: '確認中', fImgSize: '1 枚あたり {n} MB 以下', fBiggest: '最大 {n}', fRejected: '{n} 個のファイルをアップロードできませんでした：', creatorLinks: 'クリエイターリンク',
    tagStandard: 'タグ付けの基準',
    staleNote: '他の人に変更が反映されるまで少し時間がかかることがあります',
  },
};
const env = {
  lang: 'zh', // 界面语言：zh | en | ja（跟站点一致）
  tagLang: 'zh-CN', // 标签词库里的语言键
  user: null,
};
// 和站点取法一致：localStorage.locale → 账号语言 → 英文。站点代码本想退到浏览器语言，但写成了 navigator.languagess（多一个 s），
// 实际永远退到英文；这里跟着站点实际显示的走，不看浏览器语言（否则没登录时站点英文、插件中文。AI 站和主站的 localStorage 不互通，最容易碰上）
const langOf = (userLocale) => { const l = String(userLocale || 'en').toLowerCase(); return l.startsWith('zh') ? 'zh' : l.startsWith('ja') ? 'ja' : 'en'; };
function detectLang(userLocale) {
  const l = String(userLocale || 'en').toLowerCase();
  env.lang = langOf(l);
  const hant = /zh-(tw|hk|mo)|hant/i.test(navigator.language);
  env.tagLang = l.startsWith('zh') ? (hant ? 'zh-TW' : 'zh-CN') : l.startsWith('ja') ? 'ja' : 'en';
}
const t = (key, vars) => {
  let s = (STR[env.lang] || STR.en)[key] ?? STR.en[key] ?? key;
  for (const k in vars || {}) s = s.replace(`{${k}}`, vars[k]);
  return s;
};

// ── 图标（24 网格、描边 1.5）──────────────────────────────────────────────
const ICONS = {
  upload: 'M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3',
  check: 'm5 12.5 4.5 4.5L19 7.5',
  x: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  arrowRight: 'M5 12h14m0 0-5-5m5 5-5 5',
  arrowLeft: 'M19 12H5m0 0 5-5m-5 5 5 5',
  chevronDown: 'm6 9 6 6 6-6',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-8h.01',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.6-11.6a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 4M12 17h.01',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-3.9-3.9',
  tag: 'M3 12.6V5a2 2 0 0 1 2-2h7.6a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.8l-7.6 7.6a2 2 0 0 1-2.8 0L3.6 14a2 2 0 0 1-.6-1.4ZM7.5 7.5h.01',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  bold: 'M7 5h6a3.5 3.5 0 0 1 0 7H7V5Zm0 7h7a3.5 3.5 0 0 1 0 7H7v-7Z',
  italic: 'M10 5h7M7 19h7M14 5l-4 14',
  strike: 'M5 12h14M8 7.5C8 6 9.5 5 12 5s4 1 4 2.5M16 16c0 1.8-1.6 3-4 3s-4-1.2-4-3',
  heading: 'M6 5v14M18 5v14M6 12h12',
  quote: 'M5 8h5v5a3 3 0 0 1-3 3M14 8h5v5a3 3 0 0 1-3 3',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4M13.5 5l-3 14',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  picture: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm0 10 4.5-4.5a1.5 1.5 0 0 1 2 0L16 17m-2-3 1.5-1.5a1.5 1.5 0 0 1 2 0L20 15M15 8.5h.01',
  minus: 'M5 12h14',
  at: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1',
  film: 'M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm4-1v16m8-16v16M4 9h4m8 0h4M4 15h4m8 0h4',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  heart: 'M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z',
  chat: 'M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4.5 3.5V17H6a2 2 0 0 1-2-2V6Z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z',
  eyeOff: 'm4 4 16 16M9.9 5.8A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.6 3.4M6.3 7.6A15.600 15.600 0 0 0 2.500 12S6 18.500 12 18.500a9 9 0 0 0 3.700-.800M10 10a3 3 0 0 0 4.100 4.100',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.500 2.500 3.800 5.500 3.800 9s-1.300 6.500-3.800 9c-2.500-2.500-3.800-5.500-3.800-9S9.500 5.500 12 3Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13.500V12l3 2',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3',
  pencil: 'm4 20 1-4.500L16.500 4a2.100 2.100 0 0 1 3 3L8 18.500 4 20Zm10.500-14 3 3',
  external: 'M14 5h5v5m0-5-8 8M11 6H6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-5',
  warn: 'M12 9v4.500m0 3h.01M10.300 4 2.800 17a2 2 0 0 0 1.700 3h15a2 2 0 0 0 1.700-3L13.700 4a2 2 0 0 0-3.400 0Z',
  sparkle: 'M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800L12 3Zm7 12 .800 2.200L22 18l-2.200.800L19 21l-.800-2.200L16 18l2.200-.800L19 15Z',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  swap: 'M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4m4 4H7',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  bookmark: 'M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z',
  download: 'M12 4v12m0 0-4-4m4 4 4-4M4 20h16',
  play: 'M7 5.500v13a.500.500 0 0 0 .800.400l10-6.500a.500.500 0 0 0 0-.800l-10-6.500a.500.500 0 0 0-.800.400Z',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5',
  maximize: 'M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4',
  gauge: 'M4.5 17.5a8.5 8.5 0 1 1 15 0M12 13.5l3.5-4.5M12 13.5h.01',
  shield: 'M12 3 5 6v5c0 4.5 3 8.3 7 9.5 4-1.2 7-5 7-9.5V6l-7-3Z',
  trendUp: 'M3 17l6-6 4 4 7-7M15 8h5v5',
  star: 'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z',
  flame: 'M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.6-2.6-5.6-4-8.3-.6 1.8-1.6 3-2.8 3.7C11.9 7.8 11 5.4 9 3.5c.2 3.3-3.5 5.6-3.5 11.3C5.5 18.4 8.1 21 12 21Z',
  users: 'M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7Zm-6.500 9a6.500 6.500 0 0 1 13 0M16 4.200a3.500 3.500 0 0 1 0 6.600M18 14.200a6.500 6.500 0 0 1 3.500 5.800',
  translate: 'M3 5.5h9M7.5 3.5v2M5 5.5c.6 3.2 2.7 5.8 6 7.5M10 5.5c-.8 3.6-3 6.3-6.5 7.8M12.5 20.5l4-9.5 4 9.5M13.9 17.3h5.2',
};
function icon(name, size = 16) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', name === 'more' || name === 'grip' ? '2.8' : '1.6');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.classList.add('ic');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', ICONS[name] || '');
  svg.append(p);
  return svg;
}

/** 界面语言对应的 BCP 47 代码（给 Intl / toLocaleString 用）。 */
const uiLocale = () => (env.lang === 'zh' ? (env.tagLang === 'zh-TW' ? 'zh-TW' : 'zh-CN') : env.lang === 'ja' ? 'ja' : 'en');
/** 中日文用全角冒号 / 顿号，英文用半角加空格。 */
const sepColon = () => (env.lang === 'en' ? ': ' : '：'); // i18n-ok
const sepList = () => (env.lang === 'en' ? ', ' : '、');
const fmtCount = (n) => {
  if (!(n >= 1e4)) return String(n ?? 0);
  const cjk = env.lang !== 'en'; // 中文、日文都按「万」进位
  return (n / (cjk ? 1e4 : 1e3)).toFixed(1).replace(/\.0$/, '') + (cjk ? '万' : 'k'); // i18n-ok
};
const fmtSize = (b) => (b >= 1048576 ? (b / 1048576).toFixed(b >= 104857600 ? 0 : 1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
const fmtDuration = (s) => { s = Math.round(s || 0); const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, '0')}`; };
const fmtClock = (s) => { s = Math.max(0, Math.round(s)); const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60); return hh ? `${hh}:${String(mm).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` : `${mm}:${String(s % 60).padStart(2, '0')}`; };
function fmtDate(iso) {
  const d = new Date(iso), diff = (Date.now() - d) / 1000;
  if (diff < 86400 * 30) {
    let rtf; try { rtf = new Intl.RelativeTimeFormat(uiLocale(), { numeric: 'always', style: 'short' }); } catch { rtf = new Intl.RelativeTimeFormat('en'); }
    if (diff < 3600) return rtf.format(-Math.max(1, Math.round(diff / 60)), 'minute');
    if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour');
    return rtf.format(-Math.round(diff / 86400), 'day');
  }
  return d.toLocaleDateString(uiLocale());
}
