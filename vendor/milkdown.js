// 打进用户脚本的第三方编辑器内核：Milkdown（ProseMirror + remark，所见即所得的 Markdown 编辑）。
// build.mjs 用 esbuild 把这里导出的东西打成一个 IIFE，挂在全局变量 MK 上。
export { Editor, rootCtx, defaultValueCtx, editorViewCtx, editorViewOptionsCtx, remarkStringifyOptionsCtx, serializerCtx, parserCtx } from '@milkdown/kit/core';
export { commonmark, toggleStrongCommand, toggleEmphasisCommand, wrapInHeadingCommand, wrapInBlockquoteCommand, wrapInBulletListCommand, toggleInlineCodeCommand, insertHrCommand, insertImageCommand, toggleLinkCommand, remarkPreserveEmptyLinePlugin } from '@milkdown/kit/preset/commonmark';
export { gfm, toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm';
export { history } from '@milkdown/kit/plugin/history';
export { listener, listenerCtx } from '@milkdown/kit/plugin/listener';
export { clipboard } from '@milkdown/kit/plugin/clipboard';
export { trailing } from '@milkdown/kit/plugin/trailing';
export { callCommand, $prose, replaceAll, getMarkdown, insert } from '@milkdown/kit/utils';
export { Plugin, PluginKey, TextSelection } from '@milkdown/kit/prose/state';
export { Decoration, DecorationSet } from '@milkdown/kit/prose/view';
