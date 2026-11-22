// ==UserScript==
// @name         Iwara Enhanced
// @name:zh-CN   Iwara 增强
// @namespace    iwara-enhanced
// @version      0.1.0
// @description  Makes the official Iwara site more convenient. Includes a creator studio: step-by-step publishing, live Markdown editor, localized tag picker, reusable templates, and a cleaner content manager.
// @description:zh-CN  让 Iwara 官方网站用起来更顺手。目前包含创作工作台：分步发布、所见即所得的简介编辑、中文标签选择、可复用的模板，以及更清爽的内容管理页。
// @match        https://www.iwara.tv/*
// @match        https://iwara.tv/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
'use strict';
if (window.__iweLoaded) return;
window.__iweLoaded = true;

// ── vendor: Milkdown (MIT) ───────────────────────────────────────
var MK=(()=>{var Qx=Object.create;var As=Object.defineProperty;var Yx=Object.getOwnPropertyDescriptor;var Xx=Object.getOwnPropertyNames;var Zx=Object.getPrototypeOf,eb=Object.prototype.hasOwnProperty;var Mh=t=>{throw TypeError(t)};var tb=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}},Nh=(t,e)=>{for(var n in e)As(t,n,{get:e[n],enumerable:!0})},Ih=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of Xx(e))!eb.call(t,i)&&i!==n&&As(t,i,{get:()=>e[i],enumerable:!(r=Yx(e,i))||r.enumerable});return t};var nb=(t,e,n)=>(n=t!=null?Qx(Zx(t)):{},Ih(e||!t||!t.__esModule?As(n,"default",{value:t,enumerable:!0}):n,t)),rb=t=>Ih(As({},"__esModule",{value:!0}),t);var Th=(t,e,n)=>e.has(t)||Mh("Cannot "+n);var b=(t,e,n)=>(Th(t,e,"read from private field"),n?n.call(t):e.get(t)),z=(t,e,n)=>e.has(t)?Mh("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,n),v=(t,e,n,r)=>(Th(t,e,"write to private field"),r?r.call(t,n):e.set(t,n),n);var ad=tb((pP,ld)=>{"use strict";var el=Object.prototype.hasOwnProperty,sd=Object.prototype.toString,ed=Object.defineProperty,td=Object.getOwnPropertyDescriptor,nd=function(e){return typeof Array.isArray=="function"?Array.isArray(e):sd.call(e)==="[object Array]"},rd=function(e){if(!e||sd.call(e)!=="[object Object]")return!1;var n=el.call(e,"constructor"),r=e.constructor&&e.constructor.prototype&&el.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!n&&!r)return!1;var i;for(i in e);return typeof i>"u"||el.call(e,i)},id=function(e,n){ed&&n.name==="__proto__"?ed(e,n.name,{enumerable:!0,configurable:!0,value:n.newValue,writable:!0}):e[n.name]=n.newValue},od=function(e,n){if(n==="__proto__")if(el.call(e,n)){if(td)return td(e,n).value}else return;return e[n]};ld.exports=function t(){var e,n,r,i,o,s,l=arguments[0],a=1,u=arguments.length,c=!1;for(typeof l=="boolean"&&(c=l,l=arguments[1]||{},a=2),(l==null||typeof l!="object"&&typeof l!="function")&&(l={});a<u;++a)if(e=arguments[a],e!=null)for(n in e)r=od(l,n),i=od(e,n),l!==i&&(c&&i&&(rd(i)||(o=nd(i)))?(o?(o=!1,s=r&&nd(r)?r:[]):s=r&&rd(r)?r:{},id(l,{name:n,newValue:t(c,s,i)})):typeof i<"u"&&id(l,{name:n,newValue:i}));return l}});var FT={};Nh(FT,{$prose:()=>ke,Decoration:()=>ye,DecorationSet:()=>ae,Editor:()=>my,Plugin:()=>te,PluginKey:()=>ne,TextSelection:()=>j,callCommand:()=>xy,clipboard:()=>gh,commonmark:()=>Qy,defaultValueCtx:()=>Zo,editorViewCtx:()=>Je,editorViewOptionsCtx:()=>yr,getMarkdown:()=>by,gfm:()=>bx,history:()=>Ix,insert:()=>wy,insertHrCommand:()=>ea,insertImageCommand:()=>Zl,listener:()=>dh,listenerCtx:()=>ga,parserCtx:()=>Ct,remarkStringifyOptionsCtx:()=>Dn,replaceAll:()=>Cy,rootCtx:()=>ns,serializerCtx:()=>St,toggleEmphasisCommand:()=>us,toggleInlineCodeCommand:()=>hs,toggleLinkCommand:()=>Ql,toggleStrikethroughCommand:()=>bs,toggleStrongCommand:()=>fs,trailing:()=>Vx,wrapInBlockquoteCommand:()=>ds,wrapInBulletListCommand:()=>ks,wrapInHeadingCommand:()=>Dt});var Xe=(function(t){return t.docTypeError="docTypeError",t.contextNotFound="contextNotFound",t.timerNotFound="timerNotFound",t.ctxCallOutOfScope="ctxCallOutOfScope",t.createNodeInParserFail="createNodeInParserFail",t.stackOverFlow="stackOverFlow",t.parserMatchError="parserMatchError",t.serializerMatchError="serializerMatchError",t.getAtomFromSchemaFail="getAtomFromSchemaFail",t.expectDomTypeError="expectDomTypeError",t.callCommandBeforeEditorView="callCommandBeforeEditorView",t.missingRootElement="missingRootElement",t.missingNodeInSchema="missingNodeInSchema",t.missingMarkInSchema="missingMarkInSchema",t.ctxNotBind="ctxNotBind",t.missingYjsDoc="missingYjsDoc",t.aiProviderError="aiProviderError",t.aiBuildContextError="aiBuildContextError",t})({}),Ze=class extends Error{constructor(t,e,n){super(e,n),this.name="MilkdownError",this.code=t,n?.cause!==void 0&&(this.cause=n.cause)}},ib=(t,e)=>typeof e=="function"?"[Function]":e,vs=t=>JSON.stringify(t,ib);function Ah(t){return new Ze(Xe.docTypeError,`Doc type error, unsupported type: ${vs(t)}`)}function vh(t){return new Ze(Xe.contextNotFound,`Context "${t}" not found, do you forget to inject it?`)}function Eh(t){return new Ze(Xe.timerNotFound,`Timer "${t}" not found, do you forget to record it?`)}function Tr(){return new Ze(Xe.ctxCallOutOfScope,"Should not call a context out of the plugin.")}function Oh(t,e,n){let r=`Cannot create node for ${"name"in t?t.name:t}`,i=s=>{if(s==null)return"null";if(Array.isArray(s))return`[${s.map(i).join(", ")}]`;if(typeof s=="object")return"toJSON"in s&&typeof s.toJSON=="function"?JSON.stringify(s.toJSON()):"spec"in s?JSON.stringify(s.spec):JSON.stringify(s);if(typeof s=="string"||typeof s=="number"||typeof s=="boolean")return JSON.stringify(s);if(typeof s=="function")return`[Function: ${s.name||"anonymous"}]`;try{return String(s)}catch{return"[Unserializable]"}},o=[["[Description]",r],["[Attributes]",e],["[Content]",(n??[]).map(s=>s?typeof s=="object"&&"type"in s?`${s}`:i(s):"null")]].reduce((s,[l,a])=>{let u=`${l}: ${i(a)}.`;return s.concat(u)},[]);return new Ze(Xe.createNodeInParserFail,o.join(`
`))}function xa(){return new Ze(Xe.stackOverFlow,"Stack over flow, cannot pop on an empty stack.")}function Rh(t){return new Ze(Xe.parserMatchError,`Cannot match target parser for node: ${vs(t)}.`)}function Dh(t){return new Ze(Xe.serializerMatchError,`Cannot match target serializer for node: ${vs(t)}.`)}function Ph(t,e){return new Ze(Xe.getAtomFromSchemaFail,`Cannot get ${t}: ${e} from schema.`)}function et(t){return new Ze(Xe.expectDomTypeError,`Expect to be a dom, but get: ${vs(t)}.`)}function Es(){return new Ze(Xe.callCommandBeforeEditorView,"You're trying to call a command before editor view initialized, make sure to get commandManager from ctx after editor view has been initialized")}function Lh(t){return new Ze(Xe.missingNodeInSchema,`Missing node in schema, milkdown cannot find "${t}" in schema.`)}function zh(t){return new Ze(Xe.missingMarkInSchema,`Missing mark in schema, milkdown cannot find "${t}" in schema.`)}var ba=class{constructor(){this.sliceMap=new Map,this.get=t=>{let e=typeof t=="string"?[...this.sliceMap.values()].find(n=>n.type.name===t):this.sliceMap.get(t.id);if(!e){let n=typeof t=="string"?t:t.name;throw vh(n)}return e},this.remove=t=>{let e=typeof t=="string"?[...this.sliceMap.values()].find(n=>n.type.name===t):this.sliceMap.get(t.id);e&&this.sliceMap.delete(e.type.id)},this.has=t=>typeof t=="string"?[...this.sliceMap.values()].some(e=>e.type.name===t):this.sliceMap.has(t.id)}},gt,Vt,Ar,Bh,ob=(Bh=class{constructor(t,e,n){z(this,gt);z(this,Vt);z(this,Ar);v(this,gt,[]),v(this,Ar,()=>{b(this,gt).forEach(r=>r(b(this,Vt)))}),this.set=r=>{v(this,Vt,r),b(this,Ar).call(this)},this.get=()=>b(this,Vt),this.update=r=>{v(this,Vt,r(b(this,Vt))),b(this,Ar).call(this)},this.type=n,v(this,Vt,e),t.set(n.id,this)}on(t){return b(this,gt).push(t),()=>{v(this,gt,b(this,gt).filter(e=>e!==t))}}once(t){let e=this.on(n=>{t(n),e()});return e}off(t){v(this,gt,b(this,gt).filter(e=>e!==t))}offAll(){v(this,gt,[])}},gt=new WeakMap,Vt=new WeakMap,Ar=new WeakMap,Bh),sb=class{constructor(t,e){this.id=Symbol(`Context-${e}`),this.name=e,this._defaultValue=t,this._typeInfo=()=>{throw Tr()}}create(t,e=this._defaultValue){return new ob(t,e,this)}},Q=(t,e)=>new sb(t,e),Gi,Qi,Yi,Fn,vr,fn,Er,Or,Rr,Fh,lb=(Fh=class{constructor(t,e,n){z(this,Gi);z(this,Qi);z(this,Yi);z(this,Fn);z(this,vr);z(this,fn);z(this,Er);z(this,Or);z(this,Rr);v(this,Fn,new Set),v(this,vr,new Set),v(this,fn,new Map),v(this,Er,new Map),this.read=()=>({metadata:b(this,Gi),injectedSlices:[...b(this,Fn)].map(r=>({name:typeof r=="string"?r:r.name,value:b(this,Or).call(this,r)})),consumedSlices:[...b(this,vr)].map(r=>({name:typeof r=="string"?r:r.name,value:b(this,Or).call(this,r)})),recordedTimers:[...b(this,fn)].map(([r,{duration:i}])=>({name:r.name,duration:i,status:b(this,Rr).call(this,r)})),waitTimers:[...b(this,Er)].map(([r,{duration:i}])=>({name:r.name,duration:i,status:b(this,Rr).call(this,r)}))}),this.onRecord=r=>{b(this,fn).set(r,{start:Date.now(),duration:0})},this.onClear=r=>{b(this,fn).delete(r)},this.onDone=r=>{let i=b(this,fn).get(r);i&&(i.duration=Date.now()-i.start)},this.onWait=(r,i)=>{let o=Date.now();i.finally(()=>{b(this,Er).set(r,{duration:Date.now()-o})}).catch(console.error)},this.onInject=r=>{b(this,Fn).add(r)},this.onRemove=r=>{b(this,Fn).delete(r)},this.onUse=r=>{b(this,vr).add(r)},v(this,Or,r=>b(this,Qi).get(r).get()),v(this,Rr,r=>b(this,Yi).get(r).status),v(this,Qi,t),v(this,Yi,e),v(this,Gi,n)}},Gi=new WeakMap,Qi=new WeakMap,Yi=new WeakMap,Fn=new WeakMap,vr=new WeakMap,fn=new WeakMap,Er=new WeakMap,Or=new WeakMap,Rr=new WeakMap,Fh),jt,Ht,Xi,at,Dr,$h=(Dr=class{constructor(e,n,r){z(this,jt);z(this,Ht);z(this,Xi);z(this,at);this.produce=i=>i&&Object.keys(i).length?new Dr(b(this,jt),b(this,Ht),{...i}):this,this.inject=(i,o)=>{let s=i.create(b(this,jt).sliceMap);return o!=null&&s.set(o),b(this,at)?.onInject(i),this},this.remove=i=>(b(this,jt).remove(i),b(this,at)?.onRemove(i),this),this.record=i=>(i.create(b(this,Ht).store),b(this,at)?.onRecord(i),this),this.clearTimer=i=>(b(this,Ht).remove(i),b(this,at)?.onClear(i),this),this.isInjected=i=>b(this,jt).has(i),this.isRecorded=i=>b(this,Ht).has(i),this.use=i=>(b(this,at)?.onUse(i),b(this,jt).get(i)),this.get=i=>this.use(i).get(),this.set=(i,o)=>this.use(i).set(o),this.update=(i,o)=>this.use(i).update(o),this.timer=i=>b(this,Ht).get(i),this.done=i=>{this.timer(i).done(),b(this,at)?.onDone(i)},this.wait=i=>{let o=this.timer(i).start();return b(this,at)?.onWait(i,o),o},this.waitTimers=async i=>{await Promise.all(this.get(i).map(o=>this.wait(o)))},v(this,jt,e),v(this,Ht,n),v(this,Xi,r),r&&v(this,at,new lb(e,n,r))}get meta(){return b(this,Xi)}get inspector(){return b(this,at)}},jt=new WeakMap,Ht=new WeakMap,Xi=new WeakMap,at=new WeakMap,Dr),Vh=class{constructor(){this.store=new Map,this.get=t=>{let e=this.store.get(t.id);if(!e)throw Eh(t.name);return e},this.remove=t=>{this.store.delete(t.id)},this.has=t=>this.store.has(t.id)}},Pr,hn,Lr,Wt,qt,zr,Zi,_h,ab=(_h=class{constructor(t,e){z(this,Pr);z(this,hn);z(this,Lr);z(this,Wt);z(this,qt);z(this,zr);z(this,Zi);v(this,Pr,null),v(this,hn,null),v(this,Wt,"pending"),v(this,qt,null),this.start=()=>(b(this,Pr)??v(this,Pr,new Promise((n,r)=>{v(this,hn,i=>{i instanceof CustomEvent&&i.detail.id===b(this,Lr)&&(v(this,Wt,"resolved"),b(this,zr).call(this),i.stopImmediatePropagation(),n())}),b(this,Zi).call(this,()=>{b(this,Wt)==="pending"&&v(this,Wt,"rejected"),b(this,zr).call(this),r(new Error(`Timing ${this.type.name} timeout.`))}),v(this,Wt,"pending"),addEventListener(this.type.name,b(this,hn))})),b(this,Pr)),this.done=()=>{let n=new CustomEvent(this.type.name,{detail:{id:b(this,Lr)}});dispatchEvent(n)},v(this,zr,()=>{b(this,qt)!==null&&(clearTimeout(b(this,qt)),v(this,qt,null)),b(this,hn)&&removeEventListener(this.type.name,b(this,hn))}),v(this,Zi,n=>{v(this,qt,setTimeout(()=>{v(this,qt,null),n()},this.type.timeout))}),v(this,Lr,Symbol(e.name)),this.type=e,t.set(e.id,this)}get status(){return b(this,Wt)}},Pr=new WeakMap,hn=new WeakMap,Lr=new WeakMap,Wt=new WeakMap,qt=new WeakMap,zr=new WeakMap,Zi=new WeakMap,_h),ub=class{constructor(t,e=3e3){this.create=n=>new ab(n,this),this.id=Symbol(`Timer-${t}`),this.name=t,this.timeout=e}},ut=(t,e=3e3)=>new ub(t,e);var cb={};function Kt(t,e){let n=e||cb,r=typeof n.includeImageAlt=="boolean"?n.includeImageAlt:!0,i=typeof n.includeHtml=="boolean"?n.includeHtml:!0;return Hh(t,r,i)}function Hh(t,e,n){if(fb(t)){if("value"in t)return t.type==="html"&&!n?"":t.value;if(e&&"alt"in t&&t.alt)return t.alt;if("children"in t)return jh(t.children,e,n)}return Array.isArray(t)?jh(t,e,n):""}function jh(t,e,n){let r=[],i=-1;for(;++i<t.length;)r[i]=Hh(t[i],e,n);return r.join("")}function fb(t){return!!(t&&typeof t=="object")}var Wh=document.createElement("i");function Br(t){let e="&"+t+";";Wh.innerHTML=e;let n=Wh.textContent;return n.charCodeAt(n.length-1)===59&&t!=="semi"||n===e?!1:n}function xe(t,e,n,r){let i=t.length,o=0,s;if(e<0?e=-e>i?0:i+e:e=e>i?i:e,n=n>0?n:0,r.length<1e4)s=Array.from(r),s.unshift(e,n),t.splice(...s);else for(n&&t.splice(e,n);o<r.length;)s=r.slice(o,o+1e4),s.unshift(e,0),t.splice(...s),o+=1e4,e+=1e4}function Pe(t,e){return t.length>0?(xe(t,t.length,0,e),t):e}var qh={}.hasOwnProperty;function Os(t){let e={},n=-1;for(;++n<t.length;)hb(e,t[n]);return e}function hb(t,e){let n;for(n in e){let i=(qh.call(t,n)?t[n]:void 0)||(t[n]={}),o=e[n],s;if(o)for(s in o){qh.call(i,s)||(i[s]=[]);let l=o[s];pb(i[s],Array.isArray(l)?l:l?[l]:[])}}}function pb(t,e){let n=-1,r=[];for(;++n<e.length;)(e[n].add==="after"?t:r).push(e[n]);xe(t,0,0,r)}function Rs(t,e){let n=Number.parseInt(t,e);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)===65535||(n&65535)===65534||n>1114111?"\uFFFD":String.fromCodePoint(n)}function Ae(t){return t.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}var ce=dn(/[A-Za-z]/),fe=dn(/[\dA-Za-z]/),Kh=dn(/[#-'*+\--9=?A-Z^-~]/);function _n(t){return t!==null&&(t<32||t===127)}var eo=dn(/\d/),Jh=dn(/[\dA-Fa-f]/),Ds=dn(/[!-/:-@[-`{-~]/);function D(t){return t!==null&&t<-2}function Y(t){return t!==null&&(t<0||t===32)}function F(t){return t===-2||t===-1||t===32}var pn=dn(/\p{P}|\p{S}/u),At=dn(/\s/);function dn(t){return e;function e(n){return n!==null&&n>-1&&t.test(String.fromCharCode(n))}}function V(t,e,n,r){let i=r?r-1:1/0,o=0;return s;function s(a){return F(a)?(t.enter(n),l(a)):e(a)}function l(a){return F(a)&&o++<i?(t.consume(a),l):(t.exit(n),e(a))}}function wa(t,e,n,r,i,o){let s=0;return l;function l(c){return o>0&&F(c)?(t.enter(r),a(c)):u(c)}function a(c){return F(c)&&s<o?(t.consume(c),s++,a):(t.exit(r),u(c))}function u(c){return s>=i?e(c):n(c)}}var Uh={tokenize:db};function db(t){let e=t.attempt(this.parser.constructs.contentInitial,r,i),n;return e;function r(l){if(l===null){t.consume(l);return}return t.enter("lineEnding"),t.consume(l),t.exit("lineEnding"),V(t,e,"linePrefix")}function i(l){return t.enter("paragraph"),o(l)}function o(l){let a=t.enter("chunkText",{contentType:"text",previous:n});return n&&(n.next=a),n=a,s(l)}function s(l){if(l===null){t.exit("chunkText"),t.exit("paragraph"),t.consume(l);return}return D(l)?(t.consume(l),t.exit("chunkText"),o):(t.consume(l),s)}}var Jt=class{constructor(){this.index=new Map,this.map=[]}add(e,n,r){Gh(this,e,n,r,!1)}addBefore(e,n,r){Gh(this,e,n,r,!0)}consume(e){if(this.map.sort(function(o,s){return o[0]-s[0]}),this.map.length===0)return;let n=this.map.length,r=[];for(;n>0;)n-=1,r.push(e.slice(this.map[n][0]+this.map[n][1]),this.map[n][2]),e.length=this.map[n][0];r.push(e.slice()),e.length=0;let i=r.pop();for(;i;){for(let o of i)e.push(o);i=r.pop()}this.map.length=0,this.index.clear()}};function Gh(t,e,n,r,i){if(n===0&&r.length===0)return;let o=t.index.get(e);if(o){o[1]+=n,i?(r.push(...o[2]),o[2]=r):o[2].push(...r);return}let s=[e,n,r];t.map.push(s),t.index.set(e,s)}var Yh={tokenize:mb},Qh={tokenize:gb};function mb(t){let e=this,n=[],r=0,i,o,s;return l;function l(w){if(r<n.length){let T=n[r];return e.containerState=T[1],t.attempt(T[0].continuation,a,u)(w)}return u(w)}function a(w){if(r++,e.containerState._closeFlow){e.containerState._closeFlow=void 0,i&&M();let T=e.events.length,R=T,C;for(;R--;)if(e.events[R][0]==="exit"&&e.events[R][1].type==="chunkFlow"){C=e.events[R][1].end;break}g(r);let L=T;for(;L<e.events.length;)e.events[L][1].end={...C},L++;let P=new Jt;return P.add(R+1,0,e.events.slice(T)),P.add(T,L-T,[]),P.consume(e.events),u(w)}return l(w)}function u(w){if(r===n.length){if(!i)return h(w);if(i.currentConstruct&&i.currentConstruct.concrete)return d(w);e.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return e.containerState={},t.check(Qh,c,f)(w)}function c(w){return i&&M(),g(r),h(w)}function f(w){return e.parser.lazy[e.now().line]=r!==n.length,s=e.now().offset,d(w)}function h(w){return e.containerState={},t.attempt(Qh,p,d)(w)}function p(w){return r++,n.push([e.currentConstruct,e.containerState]),h(w)}function d(w){if(w===null){i&&M(),g(0),t.consume(w);return}return i=i||e.parser.flow(e.now()),t.enter("chunkFlow",{_tokenizer:i,contentType:"flow",previous:o}),m(w)}function m(w){if(w===null){y(t.exit("chunkFlow"),!0),g(0),t.consume(w);return}return D(w)?(t.consume(w),y(t.exit("chunkFlow")),r=0,e.interrupt=void 0,l):(t.consume(w),m)}function y(w,T){let R=e.sliceStream(w);if(T&&R.push(null),w.previous=o,o&&(o.next=w),o=w,i.defineSkip(w.start),i.write(R),e.parser.lazy[w.start.line]){let C=i.events.length;for(;C--;)if(i.events[C][1].start.offset<s&&(!i.events[C][1].end||i.events[C][1].end.offset>s))return;let L=e.events.length,P=L,K,S;for(;P--;)if(e.events[P][0]==="exit"&&e.events[P][1].type==="chunkFlow"){if(K){S=e.events[P][1].end;break}K=!0}for(g(r),C=L;C<e.events.length;)e.events[C][1].end={...S},C++;let ie=new Jt;ie.add(P+1,0,e.events.slice(L)),ie.add(L,C-L,[]),ie.consume(e.events)}}function g(w){let T=n.length;for(;T-- >w;){let R=n[T];e.containerState=R[1],R[0].exit.call(e,t)}n.length=w}function M(){i.write([null]),o=void 0,i=void 0,e.containerState._closeFlow=void 0}}function gb(t,e,n){return V(t,t.attempt(this.parser.constructs.document,e,n),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}function Le(t){if(t===null||Y(t)||At(t))return 1;if(pn(t))return 2}function mn(t,e,n){let r=[],i=-1;for(;++i<t.length;){let o=t[i].resolveAll;o&&!r.includes(o)&&(e=o(e,n),r.push(o))}return e}var to={name:"attention",resolveAll:yb,tokenize:kb};function yb(t,e){let n=-1,r;for(;++n<t.length;)if(t[n][0]==="enter"&&t[n][1].type==="attentionSequence"&&t[n][1]._close){let i=n;for(;i--;)if(t[i][0]==="exit"&&t[i][1].type==="attentionSequence"&&t[i][1]._open&&e.sliceSerialize(t[i][1]).charCodeAt(0)===e.sliceSerialize(t[n][1]).charCodeAt(0)){if((t[i][1]._close||t[n][1]._open)&&(t[n][1].end.offset-t[n][1].start.offset)%3&&!((t[i][1].end.offset-t[i][1].start.offset+t[n][1].end.offset-t[n][1].start.offset)%3))continue;let o=t[i][1].end.offset-t[i][1].start.offset>1&&t[n][1].end.offset-t[n][1].start.offset>1?2:1,s={...t[i][1].end},l={...t[n][1].start};Xh(s,-o),Xh(l,o);let a={type:o>1?"strongSequence":"emphasisSequence",start:s,end:{...t[i][1].end}},u={type:o>1?"strongSequence":"emphasisSequence",start:{...t[n][1].start},end:l},c={type:o>1?"strongText":"emphasisText",start:{...t[i][1].end},end:{...t[n][1].start}},f={type:o>1?"strong":"emphasis",start:{...a.start},end:{...u.end}};t[i][1].end={...a.start},t[n][1].start={...u.end},r=[],t[i][1].end.offset-t[i][1].start.offset&&(r=Pe(r,[["enter",t[i][1],e],["exit",t[i][1],e]])),r=Pe(r,[["enter",f,e],["enter",a,e],["exit",a,e],["enter",c,e]]),r=Pe(r,mn(e.parser.constructs.insideSpan.null,t.slice(i+1,n),e)),r=Pe(r,[["exit",c,e],["enter",u,e],["exit",u,e],["exit",f,e]]);let h=0;t[n][1].end.offset-t[n][1].start.offset&&(h=2,r=Pe(r,[["enter",t[n][1],e],["exit",t[n][1],e]])),xe(t,i-1,n-i+3,r),n=i+r.length-h-2;break}}for(n=-1;++n<t.length;)t[n][1].type==="attentionSequence"&&(t[n][1].type="data");return t}function kb(t,e){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=Le(r),o;return s;function s(a){return o=a,t.enter("attentionSequence"),l(a)}function l(a){if(a===o)return t.consume(a),l;let u=t.exit("attentionSequence"),c=Le(a),f=!c||c===2&&i||n.includes(a)&&a!==42&&a!==95,h=!i||i===2&&c||n.includes(r)&&r!==42&&r!==95;return u._open=!!(o===42?f:f&&(i||!h)),u._close=!!(o===42?h:h&&(c||!f)),e(a)}}function Xh(t,e){t.column+=e,t.offset+=e,t._bufferIndex+=e}var Ca={name:"autolink",tokenize:xb};function xb(t,e,n){let r=0;return i;function i(p){return t.enter("autolink"),t.enter("autolinkMarker"),t.consume(p),t.exit("autolinkMarker"),t.enter("autolinkProtocol"),o}function o(p){return ce(p)?(t.consume(p),s):p===64?n(p):u(p)}function s(p){return p===43||p===45||p===46||fe(p)?(r=1,l(p)):u(p)}function l(p){return p===58?(t.consume(p),r=0,a):(p===43||p===45||p===46||fe(p))&&r++<32?(t.consume(p),l):(r=0,u(p))}function a(p){return p===62?(t.exit("autolinkProtocol"),t.enter("autolinkMarker"),t.consume(p),t.exit("autolinkMarker"),t.exit("autolink"),e):p===null||p===32||p===60||_n(p)?n(p):(t.consume(p),a)}function u(p){return p===64?(t.consume(p),c):Kh(p)?(t.consume(p),u):n(p)}function c(p){return fe(p)?f(p):n(p)}function f(p){return p===46?(t.consume(p),r=0,c):p===62?(t.exit("autolinkProtocol").type="autolinkEmail",t.enter("autolinkMarker"),t.consume(p),t.exit("autolinkMarker"),t.exit("autolink"),e):h(p)}function h(p){if((p===45||fe(p))&&r++<63){let d=p===45?h:f;return t.consume(p),d}return n(p)}}var vt={partial:!0,tokenize:bb};function bb(t,e,n){return r;function r(o){return F(o)?V(t,i,"linePrefix")(o):i(o)}function i(o){return o===null||D(o)?e(o):n(o)}}var Ps={continuation:{tokenize:Cb},exit:Sb,name:"blockQuote",tokenize:wb};function wb(t,e,n){let r=this;return i;function i(s){if(s===62){let l=r.containerState;return l.open||(t.enter("blockQuote",{_container:!0}),l.open=!0),t.enter("blockQuotePrefix"),t.enter("blockQuoteMarker"),t.consume(s),t.exit("blockQuoteMarker"),o}return n(s)}function o(s){return F(s)?(t.enter("blockQuotePrefixWhitespace"),t.consume(s),t.exit("blockQuotePrefixWhitespace"),t.exit("blockQuotePrefix"),e):(t.exit("blockQuotePrefix"),e(s))}}function Cb(t,e,n){let r=this;return i;function i(s){return F(s)?V(t,o,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(s):o(s)}function o(s){return t.attempt(Ps,e,n)(s)}}function Sb(t){t.exit("blockQuote")}var Ls={name:"characterEscape",tokenize:Mb};function Mb(t,e,n){return r;function r(o){return t.enter("characterEscape"),t.enter("escapeMarker"),t.consume(o),t.exit("escapeMarker"),i}function i(o){return Ds(o)?(t.enter("characterEscapeValue"),t.consume(o),t.exit("characterEscapeValue"),t.exit("characterEscape"),e):n(o)}}var zs={name:"characterReference",tokenize:Nb};function Nb(t,e,n){let r=this,i=0,o,s;return l;function l(f){return t.enter("characterReference"),t.enter("characterReferenceMarker"),t.consume(f),t.exit("characterReferenceMarker"),a}function a(f){return f===35?(t.enter("characterReferenceMarkerNumeric"),t.consume(f),t.exit("characterReferenceMarkerNumeric"),u):(t.enter("characterReferenceValue"),o=31,s=fe,c(f))}function u(f){return f===88||f===120?(t.enter("characterReferenceMarkerHexadecimal"),t.consume(f),t.exit("characterReferenceMarkerHexadecimal"),t.enter("characterReferenceValue"),o=6,s=Jh,c):(t.enter("characterReferenceValue"),o=7,s=eo,c(f))}function c(f){if(f===59&&i){let h=t.exit("characterReferenceValue");return s===fe&&!Br(r.sliceSerialize(h))?n(f):(t.enter("characterReferenceMarker"),t.consume(f),t.exit("characterReferenceMarker"),t.exit("characterReference"),e)}return s(f)&&i++<o?(t.consume(f),c):n(f)}}var no={partial:!0,tokenize:Ib};function Ib(t,e,n){let r=this;return i;function i(s){return s===null?n(s):(t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),o)}function o(s){return r.parser.lazy[r.now().line]?n(s):e(s)}}var Bs={concrete:!0,name:"codeFenced",tokenize:Tb};function Tb(t,e,n){let r=this,i={partial:!0,tokenize:R},o=0,s=0,l;return a;function a(C){return u(C)}function u(C){let L=r.events[r.events.length-1];return o=L&&L[1].type==="linePrefix"?L[2].sliceSerialize(L[1],!0).length:0,l=C,t.enter("codeFenced"),t.enter("codeFencedFence"),t.enter("codeFencedFenceSequence"),c(C)}function c(C){return C===l?(s++,t.consume(C),c):s<3?n(C):(t.exit("codeFencedFenceSequence"),F(C)?V(t,f,"whitespace")(C):f(C))}function f(C){return C===null||D(C)?(t.exit("codeFencedFence"),r.interrupt?e(C):t.check(no,m,T)(C)):(t.enter("codeFencedFenceInfo"),t.enter("chunkString",{contentType:"string"}),h(C))}function h(C){return C===null||D(C)?(t.exit("chunkString"),t.exit("codeFencedFenceInfo"),f(C)):F(C)?(t.exit("chunkString"),t.exit("codeFencedFenceInfo"),V(t,p,"whitespace")(C)):C===96&&C===l?n(C):(t.consume(C),h)}function p(C){return C===null||D(C)?f(C):(t.enter("codeFencedFenceMeta"),t.enter("chunkString",{contentType:"string"}),d(C))}function d(C){return C===null||D(C)?(t.exit("chunkString"),t.exit("codeFencedFenceMeta"),f(C)):C===96&&C===l?n(C):(t.consume(C),d)}function m(C){return t.attempt(i,T,y)(C)}function y(C){return t.enter("lineEnding"),t.consume(C),t.exit("lineEnding"),g}function g(C){return o>0&&F(C)?V(t,M,"linePrefix",o+1)(C):M(C)}function M(C){return C===null||D(C)?t.check(no,m,T)(C):(t.enter("codeFlowValue"),w(C))}function w(C){return C===null||D(C)?(t.exit("codeFlowValue"),M(C)):(t.consume(C),w)}function T(C){return t.exit("codeFenced"),e(C)}function R(C,L,P){let K=0;return S;function S(G){return C.enter("lineEnding"),C.consume(G),C.exit("lineEnding"),ie}function ie(G){return C.enter("codeFencedFence"),F(G)?V(C,oe,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(G):oe(G)}function oe(G){return G===l?(C.enter("codeFencedFenceSequence"),B(G)):P(G)}function B(G){return G===l?(K++,C.consume(G),B):K>=s?(C.exit("codeFencedFenceSequence"),F(G)?V(C,X,"whitespace")(G):X(G)):P(G)}function X(G){return G===null||D(G)?(C.exit("codeFencedFence"),L(G)):P(G)}}}var ro={name:"codeIndented",tokenize:vb},Ab={partial:!0,tokenize:Eb};function vb(t,e,n){return r;function r(l){return t.enter("codeIndented"),wa(t,i,n,"linePrefix",4,4)(l)}function i(l){return l===null?s(l):D(l)?t.attempt(Ab,i,s)(l):(t.enter("codeFlowValue"),o(l))}function o(l){return l===null||D(l)?(t.exit("codeFlowValue"),i(l)):(t.consume(l),o)}function s(l){return t.exit("codeIndented"),e(l)}}function Eb(t,e,n){let r=this;return i;function i(s){return r.parser.lazy[r.now().line]?n(s):D(s)?(t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),i):wa(t,e,o,"linePrefix",4,4)(s)}function o(s){return D(s)?i(s):n(s)}}var Sa={name:"codeText",previous:Rb,resolve:Ob,tokenize:Db};function Ob(t){let e=t.length-4,n=3,r,i;if((t[n][1].type==="lineEnding"||t[n][1].type==="space")&&(t[e][1].type==="lineEnding"||t[e][1].type==="space")){for(r=n;++r<e;)if(t[r][1].type==="codeTextData"){t[n][1].type="codeTextPadding",t[e][1].type="codeTextPadding",n+=2,e-=2;break}}for(r=n-1,e++;++r<=e;)i===void 0?r!==e&&t[r][1].type!=="lineEnding"&&(i=r):(r===e||t[r][1].type==="lineEnding")&&(t[i][1].type="codeTextData",r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),e-=r-i-2,r=i+2),i=void 0);return t}function Rb(t){return t!==96||this.events[this.events.length-1][1].type==="characterEscape"}function Db(t,e,n){let r=this,i=0,o,s;return l;function l(h){return t.enter("codeText"),t.enter("codeTextSequence"),a(h)}function a(h){return h===96?(t.consume(h),i++,a):(t.exit("codeTextSequence"),u(h))}function u(h){return h===null?n(h):h===32?(t.enter("space"),t.consume(h),t.exit("space"),u):h===96?(s=t.enter("codeTextSequence"),o=0,f(h)):D(h)?(t.enter("lineEnding"),t.consume(h),t.exit("lineEnding"),u):(t.enter("codeTextData"),c(h))}function c(h){return h===null||h===32||h===96||D(h)?(t.exit("codeTextData"),u(h)):(t.consume(h),c)}function f(h){return h===96?(t.consume(h),o++,f):o===i?(t.exit("codeTextSequence"),t.exit("codeText"),e(h)):(s.type="codeTextData",c(h))}}var Fs=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw new RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,n){let r=n??Number.POSITIVE_INFINITY;return r<this.left.length?this.left.slice(e,r):e>this.left.length?this.right.slice(this.right.length-r+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-r+this.left.length).reverse())}splice(e,n,r){let i=n||0;this.setCursor(Math.trunc(e));let o=this.right.splice(this.right.length-i,Number.POSITIVE_INFINITY);return r&&io(this.left,r),o.reverse()}pop(){return this.setCursor(Number.POSITIVE_INFINITY),this.left.pop()}push(e){this.setCursor(Number.POSITIVE_INFINITY),this.left.push(e)}pushMany(e){this.setCursor(Number.POSITIVE_INFINITY),io(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),io(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0))if(e<this.left.length){let n=this.left.splice(e,Number.POSITIVE_INFINITY);io(this.right,n.reverse())}else{let n=this.right.splice(this.left.length+this.right.length-e,Number.POSITIVE_INFINITY);io(this.left,n.reverse())}}};function io(t,e){let n=0;if(e.length<1e4)t.push(...e);else for(;n<e.length;)t.push(...e.slice(n,n+1e4)),n+=1e4}function _s(t){let e={},n=-1,r,i,o,s,l,a,u,c=new Fs(t);for(;++n<c.length;){for(;n in e;)n=e[n];if(r=c.get(n),n&&r[1].type==="chunkFlow"&&c.get(n-1)[1].type==="listItemPrefix"&&(a=r[1]._tokenizer.events,o=0,o<a.length&&a[o][1].type==="lineEndingBlank"&&(o+=2),o<a.length&&a[o][1].type==="content"))for(;++o<a.length&&a[o][1].type!=="content";)a[o][1].type==="chunkText"&&(a[o][1]._isInFirstContentOfListItem=!0,o++);if(r[0]==="enter")r[1].contentType&&(Object.assign(e,Pb(c,n)),n=e[n],u=!0);else if(r[1]._container){for(o=n,i=void 0;o--;)if(s=c.get(o),s[1].type==="lineEnding"||s[1].type==="lineEndingBlank")s[0]==="enter"&&(i&&(c.get(i)[1].type="lineEndingBlank"),s[1].type="lineEnding",i=o);else if(!(s[1].type==="linePrefix"||s[1].type==="listItemIndent"))break;i&&(r[1].end={...c.get(i)[1].start},l=c.slice(i,n),l.unshift(r),c.splice(i,n-i+1,l))}}return xe(t,0,Number.POSITIVE_INFINITY,c.slice(0)),!u}function Pb(t,e){let n=t.get(e)[1],r=t.get(e)[2],i=e-1,o=[],s=n._tokenizer;s||(s=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(s._contentTypeTextTrailing=!0));let l=s.events,a=[],u={},c,f,h=-1,p=n,d=0,m=0,y=[m];for(;p;){for(;t.get(++i)[1]!==p;);o.push(i),p._tokenizer||(c=r.sliceStream(p),p.next||c.push(null),f&&s.defineSkip(p.start),p._isInFirstContentOfListItem&&(s._gfmTasklistFirstContentOfListItem=!0),s.write(c),p._isInFirstContentOfListItem&&(s._gfmTasklistFirstContentOfListItem=void 0)),f=p,p=p.next}for(p=n;++h<l.length;)l[h][0]==="exit"&&l[h-1][0]==="enter"&&l[h][1].type===l[h-1][1].type&&l[h][1].start.line!==l[h][1].end.line&&(m=h+1,y.push(m),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(s.events=[],p?(p._tokenizer=void 0,p.previous=void 0):y.pop(),h=y.length;h--;){let g=l.slice(y[h],y[h+1]),M=o.pop();a.push([M,M+g.length-1]),t.splice(M,2,g)}for(a.reverse(),h=-1;++h<a.length;)u[d+a[h][0]]=d+a[h][1],d+=a[h][1]-a[h][0]-1;return u}var Ma={resolve:zb,tokenize:Bb},Lb={partial:!0,tokenize:Fb};function zb(t){return _s(t),t}function Bb(t,e){let n;return r;function r(l){return t.enter("content"),n=t.enter("chunkContent",{contentType:"content"}),i(l)}function i(l){return l===null?o(l):D(l)?t.check(Lb,s,o)(l):(t.consume(l),i)}function o(l){return t.exit("chunkContent"),t.exit("content"),e(l)}function s(l){return t.consume(l),t.exit("chunkContent"),n.next=t.enter("chunkContent",{contentType:"content",previous:n}),n=n.next,i}}function Fb(t,e,n){let r=this;return i;function i(s){return t.exit("chunkContent"),t.enter("lineEnding"),t.consume(s),t.exit("lineEnding"),V(t,o,"linePrefix")}function o(s){if(s===null||D(s))return n(s);let l=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes("codeIndented")&&l&&l[1].type==="linePrefix"&&l[2].sliceSerialize(l[1],!0).length>=4?e(s):t.interrupt(r.parser.constructs.flow,n,e)(s)}}function $s(t,e,n,r,i,o,s,l,a){let u=a||Number.POSITIVE_INFINITY,c=0;return f;function f(g){return g===60?(t.enter(r),t.enter(i),t.enter(o),t.consume(g),t.exit(o),h):g===null||g===32||g===41||_n(g)?n(g):(t.enter(r),t.enter(s),t.enter(l),t.enter("chunkString",{contentType:"string"}),m(g))}function h(g){return g===62?(t.enter(o),t.consume(g),t.exit(o),t.exit(i),t.exit(r),e):(t.enter(l),t.enter("chunkString",{contentType:"string"}),p(g))}function p(g){return g===62?(t.exit("chunkString"),t.exit(l),h(g)):g===null||g===60||D(g)?n(g):(t.consume(g),g===92?d:p)}function d(g){return g===60||g===62||g===92?(t.consume(g),p):p(g)}function m(g){return!c&&(g===null||g===41||Y(g))?(t.exit("chunkString"),t.exit(l),t.exit(s),t.exit(r),e(g)):c<u&&g===40?(t.consume(g),c++,m):g===41?(t.consume(g),c--,m):g===null||g===32||g===40||_n(g)?n(g):(t.consume(g),g===92?y:m)}function y(g){return g===40||g===41||g===92?(t.consume(g),m):m(g)}}function Vs(t,e,n,r,i,o){let s=this,l=0,a;return u;function u(p){return t.enter(r),t.enter(i),t.consume(p),t.exit(i),t.enter(o),c}function c(p){return l>999||p===null||p===91||p===93&&!a||p===94&&!l&&"_hiddenFootnoteSupport"in s.parser.constructs?n(p):p===93?(t.exit(o),t.enter(i),t.consume(p),t.exit(i),t.exit(r),e):D(p)?(t.enter("lineEnding"),t.consume(p),t.exit("lineEnding"),c):(t.enter("chunkString",{contentType:"string"}),f(p))}function f(p){return p===null||p===91||p===93||D(p)||l++>999?(t.exit("chunkString"),c(p)):(t.consume(p),a||(a=!F(p)),p===92?h:f)}function h(p){return p===91||p===92||p===93?(t.consume(p),l++,f):f(p)}}function js(t,e,n,r,i,o){let s;return l;function l(h){return h===34||h===39||h===40?(t.enter(r),t.enter(i),t.consume(h),t.exit(i),s=h===40?41:h,a):n(h)}function a(h){return h===s?(t.enter(i),t.consume(h),t.exit(i),t.exit(r),e):(t.enter(o),u(h))}function u(h){return h===s?(t.exit(o),a(s)):h===null?n(h):D(h)?(t.enter("lineEnding"),t.consume(h),t.exit("lineEnding"),V(t,u,"linePrefix")):(t.enter("chunkString",{contentType:"string"}),c(h))}function c(h){return h===s||h===null||D(h)?(t.exit("chunkString"),u(h)):(t.consume(h),h===92?f:c)}function f(h){return h===s||h===92?(t.consume(h),c):c(h)}}function $n(t,e){let n;return r;function r(i){return D(i)?(t.enter("lineEnding"),t.consume(i),t.exit("lineEnding"),n=!0,r):F(i)?V(t,r,n?"linePrefix":"lineSuffix")(i):e(i)}}var Na={name:"definition",tokenize:$b},_b={partial:!0,tokenize:Vb};function $b(t,e,n){let r=this,i;return o;function o(p){return t.enter("definition"),s(p)}function s(p){return Vs.call(r,t,l,n,"definitionLabel","definitionLabelMarker","definitionLabelString")(p)}function l(p){return i=Ae(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),p===58?(t.enter("definitionMarker"),t.consume(p),t.exit("definitionMarker"),a):n(p)}function a(p){return Y(p)?$n(t,u)(p):u(p)}function u(p){return $s(t,c,n,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(p)}function c(p){return t.attempt(_b,f,f)(p)}function f(p){return F(p)?V(t,h,"whitespace")(p):h(p)}function h(p){return p===null||D(p)?(t.exit("definition"),r.parser.defined.push(i),e(p)):n(p)}}function Vb(t,e,n){return r;function r(l){return Y(l)?$n(t,i)(l):n(l)}function i(l){return js(t,o,n,"definitionTitle","definitionTitleMarker","definitionTitleString")(l)}function o(l){return F(l)?V(t,s,"whitespace")(l):s(l)}function s(l){return l===null||D(l)?e(l):n(l)}}var Ia={name:"hardBreakEscape",tokenize:jb};function jb(t,e,n){return r;function r(o){return t.enter("hardBreakEscape"),t.consume(o),i}function i(o){return D(o)?(t.exit("hardBreakEscape"),e(o)):n(o)}}var Ta={name:"headingAtx",resolve:Hb,tokenize:Wb};function Hb(t,e){let n=t.length-2,r=3;if(t[r][1].type==="whitespace"&&(r+=2),n-2>r&&t[n][1].type==="whitespace"&&(n-=2),t[n][1].type==="atxHeadingSequence"&&(r===n-1||n-4>r&&t[n-2][1].type==="whitespace")&&(n-=r+1===n?2:4),n>r){let i={type:"atxHeadingText",start:t[r][1].start,end:t[n][1].end},o={type:"chunkText",start:t[r][1].start,end:t[n][1].end,contentType:"text"};xe(t,r,n-r+1,[["enter",i,e],["enter",o,e],["exit",o,e],["exit",i,e]])}return t}function Wb(t,e,n){let r=0;return i;function i(c){return t.enter("atxHeading"),o(c)}function o(c){return t.enter("atxHeadingSequence"),s(c)}function s(c){return c===35&&r++<6?(t.consume(c),s):c===null||Y(c)?(t.exit("atxHeadingSequence"),l(c)):n(c)}function l(c){return c===35?(t.enter("atxHeadingSequence"),a(c)):c===null||D(c)?(t.exit("atxHeading"),e(c)):F(c)?V(t,l,"whitespace")(c):(t.enter("atxHeadingText"),u(c))}function a(c){return c===35?(t.consume(c),a):(t.exit("atxHeadingSequence"),l(c))}function u(c){return c===null||c===35||Y(c)?(t.exit("atxHeadingText"),l(c)):(t.consume(c),u)}}var Hs=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],oo=["pre","script","style","textarea"];var Aa={concrete:!0,name:"htmlFlow",resolveTo:Kb,tokenize:Jb},qb={partial:!0,tokenize:Ub};function Kb(t){let e=t.length;for(;e--&&!(t[e][0]==="enter"&&t[e][1].type==="htmlFlow"););return e>1&&t[e-2][1].type==="linePrefix"&&(t[e][1].start=t[e-2][1].start,t[e+1][1].start=t[e-2][1].start,t.splice(e-2,2)),t}function Jb(t,e,n){let r=this,i,o,s,l,a;return u;function u(x){return c(x)}function c(x){return t.enter("htmlFlow"),t.enter("htmlFlowData"),t.consume(x),f}function f(x){return x===33?(t.consume(x),h):x===47?(t.consume(x),o=!0,m):x===63?(t.consume(x),i=3,r.interrupt?e:k):ce(x)?(t.consume(x),s=String.fromCharCode(x),y):n(x)}function h(x){return x===45?(t.consume(x),i=2,p):x===91?(t.consume(x),i=5,l=0,d):ce(x)?(t.consume(x),i=4,r.interrupt?e:k):n(x)}function p(x){return x===45?(t.consume(x),r.interrupt?e:k):n(x)}function d(x){let Qe="CDATA[";return x===Qe.charCodeAt(l++)?(t.consume(x),l===Qe.length?r.interrupt?e:oe:d):n(x)}function m(x){return ce(x)?(t.consume(x),s=String.fromCharCode(x),y):n(x)}function y(x){if(x===null||x===47||x===62||Y(x)){let Qe=x===47,Mr=s.toLowerCase();return!Qe&&!o&&oo.includes(Mr)?(i=1,r.interrupt?e(x):oe(x)):Hs.includes(s.toLowerCase())?(i=6,Qe?(t.consume(x),g):r.interrupt?e(x):oe(x)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(x):o?M(x):w(x))}return x===45||fe(x)?(t.consume(x),s+=String.fromCharCode(x),y):n(x)}function g(x){return x===62?(t.consume(x),r.interrupt?e:oe):n(x)}function M(x){return F(x)?(t.consume(x),M):S(x)}function w(x){return x===47?(t.consume(x),S):x===58||x===95||ce(x)?(t.consume(x),T):F(x)?(t.consume(x),w):S(x)}function T(x){return x===45||x===46||x===58||x===95||fe(x)?(t.consume(x),T):R(x)}function R(x){return x===61?(t.consume(x),C):F(x)?(t.consume(x),R):w(x)}function C(x){return x===null||x===60||x===61||x===62||x===96?n(x):x===34||x===39?(t.consume(x),a=x,L):F(x)?(t.consume(x),C):P(x)}function L(x){return x===a?(t.consume(x),a=null,K):x===null||D(x)?n(x):(t.consume(x),L)}function P(x){return x===null||x===34||x===39||x===47||x===60||x===61||x===62||x===96||Y(x)?R(x):(t.consume(x),P)}function K(x){return x===47||x===62||F(x)?w(x):n(x)}function S(x){return x===62?(t.consume(x),ie):n(x)}function ie(x){return x===null||D(x)?oe(x):F(x)?(t.consume(x),ie):n(x)}function oe(x){return x===45&&i===2?(t.consume(x),ue):x===60&&i===1?(t.consume(x),me):x===62&&i===4?(t.consume(x),lt):x===63&&i===3?(t.consume(x),k):x===93&&i===5?(t.consume(x),It):D(x)&&(i===6||i===7)?(t.exit("htmlFlowData"),t.check(qb,Ft,B)(x)):x===null||D(x)?(t.exit("htmlFlowData"),B(x)):(t.consume(x),oe)}function B(x){return t.check(no,X,Ft)(x)}function X(x){return t.enter("lineEnding"),t.consume(x),t.exit("lineEnding"),G}function G(x){return x===null||D(x)?B(x):(t.enter("htmlFlowData"),oe(x))}function ue(x){return x===45?(t.consume(x),k):oe(x)}function me(x){return x===47?(t.consume(x),s="",mt):oe(x)}function mt(x){if(x===62){let Qe=s.toLowerCase();return oo.includes(Qe)?(t.consume(x),lt):oe(x)}return ce(x)&&s.length<8?(t.consume(x),s+=String.fromCharCode(x),mt):oe(x)}function It(x){return x===93?(t.consume(x),k):oe(x)}function k(x){return x===62?(t.consume(x),lt):x===45&&i===2?(t.consume(x),k):oe(x)}function lt(x){return x===null||D(x)?(t.exit("htmlFlowData"),Ft(x)):(t.consume(x),lt)}function Ft(x){return t.exit("htmlFlow"),e(x)}}function Ub(t,e,n){return r;function r(i){return t.enter("lineEnding"),t.consume(i),t.exit("lineEnding"),t.attempt(vt,e,n)}}var va={name:"htmlText",tokenize:Gb};function Gb(t,e,n){let r=this,i,o,s;return l;function l(k){return t.enter("htmlText"),t.enter("htmlTextData"),t.consume(k),a}function a(k){return k===33?(t.consume(k),u):k===47?(t.consume(k),R):k===63?(t.consume(k),w):ce(k)?(t.consume(k),P):n(k)}function u(k){return k===45?(t.consume(k),c):k===91?(t.consume(k),o=0,d):ce(k)?(t.consume(k),M):n(k)}function c(k){return k===45?(t.consume(k),p):n(k)}function f(k){return k===null?n(k):k===45?(t.consume(k),h):D(k)?(s=f,me(k)):(t.consume(k),f)}function h(k){return k===45?(t.consume(k),p):f(k)}function p(k){return k===62?ue(k):k===45?h(k):f(k)}function d(k){let lt="CDATA[";return k===lt.charCodeAt(o++)?(t.consume(k),o===lt.length?m:d):n(k)}function m(k){return k===null?n(k):k===93?(t.consume(k),y):D(k)?(s=m,me(k)):(t.consume(k),m)}function y(k){return k===93?(t.consume(k),g):m(k)}function g(k){return k===62?ue(k):k===93?(t.consume(k),g):m(k)}function M(k){return k===null||k===62?ue(k):D(k)?(s=M,me(k)):(t.consume(k),M)}function w(k){return k===null?n(k):k===63?(t.consume(k),T):D(k)?(s=w,me(k)):(t.consume(k),w)}function T(k){return k===62?ue(k):w(k)}function R(k){return ce(k)?(t.consume(k),C):n(k)}function C(k){return k===45||fe(k)?(t.consume(k),C):L(k)}function L(k){return D(k)?(s=L,me(k)):F(k)?(t.consume(k),L):ue(k)}function P(k){return k===45||fe(k)?(t.consume(k),P):k===47||k===62||Y(k)?K(k):n(k)}function K(k){return k===47?(t.consume(k),ue):k===58||k===95||ce(k)?(t.consume(k),S):D(k)?(s=K,me(k)):F(k)?(t.consume(k),K):ue(k)}function S(k){return k===45||k===46||k===58||k===95||fe(k)?(t.consume(k),S):ie(k)}function ie(k){return k===61?(t.consume(k),oe):D(k)?(s=ie,me(k)):F(k)?(t.consume(k),ie):K(k)}function oe(k){return k===null||k===60||k===61||k===62||k===96?n(k):k===34||k===39?(t.consume(k),i=k,B):D(k)?(s=oe,me(k)):F(k)?(t.consume(k),oe):(t.consume(k),X)}function B(k){return k===i?(t.consume(k),i=void 0,G):k===null?n(k):D(k)?(s=B,me(k)):(t.consume(k),B)}function X(k){return k===null||k===34||k===39||k===60||k===61||k===96?n(k):k===47||k===62||Y(k)?K(k):(t.consume(k),X)}function G(k){return k===47||k===62||Y(k)?K(k):n(k)}function ue(k){return k===62?(t.consume(k),t.exit("htmlTextData"),t.exit("htmlText"),e):n(k)}function me(k){return t.exit("htmlTextData"),t.enter("lineEnding"),t.consume(k),t.exit("lineEnding"),mt}function mt(k){return F(k)?V(t,It,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(k):It(k)}function It(k){return t.enter("htmlTextData"),s(k)}}var Vn={name:"labelEnd",resolveAll:Zb,resolveTo:ew,tokenize:tw},Qb={tokenize:nw},Yb={tokenize:rw},Xb={tokenize:iw};function Zb(t){let e=-1,n=[];for(;++e<t.length;){let r=t[e][1];if(n.push(t[e]),r.type==="labelImage"||r.type==="labelLink"||r.type==="labelEnd"){let i=r.type==="labelImage"?4:2;r.type="data",e+=i}}return t.length!==n.length&&xe(t,0,t.length,n),t}function ew(t,e){let n=t.length,r=0,i,o,s;for(;n--;){let c=t[n][1];if(i){if(c.type==="link"||c.type==="labelLink"&&c._inactive)break;t[n][0]==="enter"&&c.type==="labelLink"&&(c._inactive=!0)}else if(o){if(t[n][0]==="enter"&&(c.type==="labelImage"||c.type==="labelLink")&&!c._balanced&&(i=n,c.type!=="labelLink")){r=2;break}}else c.type==="labelEnd"&&(o=n)}let l={type:t[i][1].type==="labelLink"?"link":"image",start:{...t[i][1].start},end:{...t[t.length-1][1].end}},a={type:"label",start:{...t[i][1].start},end:{...t[o][1].end}},u={type:"labelText",start:{...t[i+r+2][1].end},end:{...t[o-2][1].start}};return s=[["enter",l,e],["enter",a,e]],s=Pe(s,t.slice(i+1,i+r+3)),s=Pe(s,[["enter",u,e]]),s=Pe(s,mn(e.parser.constructs.insideSpan.null,t.slice(i+r+4,o-3),e)),s=Pe(s,[["exit",u,e],t[o-2],t[o-1],["exit",a,e]]),s=Pe(s,t.slice(o+1)),s=Pe(s,[["exit",l,e]]),xe(t,i,t.length,s),t}function tw(t,e,n){let r=this,i=r._labelStarts,o,s;if(i){for(;i.length>0&&i[i.length-1]._balanced;)i.pop();o=i[i.length-1]}return l;function l(h){return o?o._inactive?f(h):(s=r.parser.defined.includes(Ae(r.sliceSerialize({start:o.end,end:r.now()}))),t.enter("labelEnd"),t.enter("labelMarker"),t.consume(h),t.exit("labelMarker"),t.exit("labelEnd"),a):n(h)}function a(h){return h===40?t.attempt(Qb,c,s?c:f)(h):h===91?t.attempt(Yb,c,s?u:f)(h):s?c(h):f(h)}function u(h){return t.attempt(Xb,c,f)(h)}function c(h){return i.pop(),e(h)}function f(h){return o._balanced=!0,n(h)}}function nw(t,e,n){return r;function r(f){return t.enter("resource"),t.enter("resourceMarker"),t.consume(f),t.exit("resourceMarker"),i}function i(f){return Y(f)?$n(t,o)(f):o(f)}function o(f){return f===41?c(f):$s(t,s,l,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(f)}function s(f){return Y(f)?$n(t,a)(f):c(f)}function l(f){return n(f)}function a(f){return f===34||f===39||f===40?js(t,u,n,"resourceTitle","resourceTitleMarker","resourceTitleString")(f):c(f)}function u(f){return Y(f)?$n(t,c)(f):c(f)}function c(f){return f===41?(t.enter("resourceMarker"),t.consume(f),t.exit("resourceMarker"),t.exit("resource"),e):n(f)}}function rw(t,e,n){let r=this;return i;function i(l){return Vs.call(r,t,o,s,"reference","referenceMarker","referenceString")(l)}function o(l){return r.parser.defined.includes(Ae(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?e(l):n(l)}function s(l){return n(l)}}function iw(t,e,n){return r;function r(o){return t.enter("reference"),t.enter("referenceMarker"),t.consume(o),t.exit("referenceMarker"),i}function i(o){return o===93?(t.enter("referenceMarker"),t.consume(o),t.exit("referenceMarker"),t.exit("reference"),e):n(o)}}var Ea={name:"labelStartImage",resolveAll:Vn.resolveAll,tokenize:ow};function ow(t,e,n){let r=this,i;return o;function o(a){return t.enter("labelImage"),t.enter("labelImageMarker"),t.consume(a),t.exit("labelImageMarker"),s}function s(a){return a===91?(t.enter("labelMarker"),t.consume(a),t.exit("labelMarker"),i=t.exit("labelImage"),l):n(a)}function l(a){return a===94&&"_hiddenFootnoteSupport"in r.parser.constructs?n(a):(r._labelStarts=r._labelStarts||[],r._labelStarts.push(i),e(a))}}var Oa={name:"labelStartLink",resolveAll:Vn.resolveAll,tokenize:sw};function sw(t,e,n){let r=this,i;return o;function o(l){return t.enter("labelLink"),t.enter("labelMarker"),t.consume(l),t.exit("labelMarker"),i=t.exit("labelLink"),s}function s(l){return l===94&&"_hiddenFootnoteSupport"in r.parser.constructs?n(l):(r._labelStarts=r._labelStarts||[],r._labelStarts.push(i),e(l))}}var so={name:"lineEnding",tokenize:lw};function lw(t,e){return n;function n(r){return t.enter("lineEnding"),t.consume(r),t.exit("lineEnding"),V(t,e,"linePrefix")}}var jn={name:"thematicBreak",tokenize:aw};function aw(t,e,n){let r=0,i;return o;function o(u){return t.enter("thematicBreak"),s(u)}function s(u){return i=u,l(u)}function l(u){return u===i?(t.enter("thematicBreakSequence"),a(u)):r>=3&&(u===null||D(u))?(t.exit("thematicBreak"),e(u)):n(u)}function a(u){return u===i?(t.consume(u),r++,a):(t.exit("thematicBreakSequence"),F(u)?V(t,l,"whitespace")(u):l(u))}}var ve={continuation:{tokenize:hw},exit:dw,name:"list",tokenize:fw},uw={partial:!0,tokenize:mw},cw={partial:!0,tokenize:pw};function fw(t,e,n){let r=this,i=r.events[r.events.length-1],o=i&&i[1].type==="linePrefix"?i[2].sliceSerialize(i[1],!0).length:0,s=0;return l;function l(p){let d=r.containerState.type||(p===42||p===43||p===45?"listUnordered":"listOrdered");if(d==="listUnordered"?!r.containerState.marker||p===r.containerState.marker:eo(p)){if(r.containerState.type||(r.containerState.type=d,t.enter(d,{_container:!0})),d==="listUnordered")return t.enter("listItemPrefix"),p===42||p===45?t.check(jn,n,u)(p):u(p);if(!r.interrupt||p===49)return t.enter("listItemPrefix"),t.enter("listItemValue"),a(p)}return n(p)}function a(p){return eo(p)&&++s<10?(t.consume(p),a):(!r.interrupt||s<2)&&(r.containerState.marker?p===r.containerState.marker:p===41||p===46)?(t.exit("listItemValue"),u(p)):n(p)}function u(p){return t.enter("listItemMarker"),t.consume(p),t.exit("listItemMarker"),r.containerState.marker=r.containerState.marker||p,t.check(vt,r.interrupt?n:c,t.attempt(uw,h,f))}function c(p){return r.containerState.initialBlankLine=!0,o++,h(p)}function f(p){return F(p)?(t.enter("listItemPrefixWhitespace"),t.consume(p),t.exit("listItemPrefixWhitespace"),h):n(p)}function h(p){return r.containerState.size=o+r.sliceSerialize(t.exit("listItemPrefix"),!0).length,e(p)}}function hw(t,e,n){let r=this;return r.containerState._closeFlow=void 0,t.check(vt,i,o);function i(l){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,V(t,e,"listItemIndent",r.containerState.size+1)(l)}function o(l){return r.containerState.furtherBlankLines||!F(l)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,s(l)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,t.attempt(cw,e,s)(l))}function s(l){return r.containerState._closeFlow=!0,r.interrupt=void 0,V(t,t.attempt(ve,e,n),"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(l)}}function pw(t,e,n){let r=this;return V(t,i,"listItemIndent",r.containerState.size+1);function i(o){let s=r.events[r.events.length-1];return s&&s[1].type==="listItemIndent"&&s[2].sliceSerialize(s[1],!0).length===r.containerState.size?e(o):n(o)}}function dw(t){t.exit(this.containerState.type)}function mw(t,e,n){let r=this;return V(t,i,"listItemPrefixWhitespace",r.parser.constructs.disable.null.includes("codeIndented")?void 0:5);function i(o){let s=r.events[r.events.length-1];return!F(o)&&s&&s[1].type==="listItemPrefixWhitespace"?e(o):n(o)}}var Ws={name:"setextUnderline",resolveTo:gw,tokenize:yw};function gw(t,e){let n=new Jt,r=t.length,i,o,s;for(;r--;)if(t[r][0]==="enter"){if(t[r][1].type==="content"){i=r;break}t[r][1].type==="paragraph"&&(o=r)}else t[r][1].type==="content"&&n.add(r,1,[]),!s&&t[r][1].type==="definition"&&(s=r);let l={type:"setextHeading",start:{...t[i][1].start},end:{...t[t.length-1][1].end}};return t[o][1].type="setextHeadingText",s?(n.add(o,0,[["enter",l,e]]),n.add(s+1,0,[["exit",t[i][1],e]]),t[i][1].end={...t[s][1].end}):t[i][1]=l,n.add(t.length,0,[["exit",l,e]]),n.consume(t),t}function yw(t,e,n){let r=this,i;return o;function o(u){let c=r.events.length,f;for(;c--;)if(r.events[c][1].type!=="lineEnding"&&r.events[c][1].type!=="linePrefix"&&r.events[c][1].type!=="content"){f=r.events[c][1].type==="paragraph";break}return!r.parser.lazy[r.now().line]&&(r.interrupt||f)?(t.enter("setextHeadingLine"),i=u,s(u)):n(u)}function s(u){return t.enter("setextHeadingLineSequence"),l(u)}function l(u){return u===i?(t.consume(u),l):(t.exit("setextHeadingLineSequence"),F(u)?V(t,a,"lineSuffix")(u):a(u))}function a(u){return u===null||D(u)?(t.exit("setextHeadingLine"),e(u)):n(u)}}var Zh={tokenize:kw};function kw(t){let e=this,n=t.attempt(vt,r,t.attempt(this.parser.constructs.flowInitial,i,V(t,t.attempt(this.parser.constructs.flow,i,t.attempt(Ma,i)),"linePrefix")));return n;function r(o){if(o===null){t.consume(o);return}return t.enter("lineEndingBlank"),t.consume(o),t.exit("lineEndingBlank"),e.currentConstruct=void 0,n}function i(o){if(o===null){t.consume(o);return}return t.enter("lineEnding"),t.consume(o),t.exit("lineEnding"),e.currentConstruct=void 0,n}}var ep={resolveAll:ip()},tp=rp("string"),np=rp("text");function rp(t){return{resolveAll:ip(t==="text"?xw:void 0),tokenize:e};function e(n){let r=this,i=this.parser.constructs[t],o=n.attempt(i,s,l);return s;function s(c){return u(c)?o(c):l(c)}function l(c){if(c===null){n.consume(c);return}return n.enter("data"),n.consume(c),a}function a(c){return u(c)?(n.exit("data"),o(c)):(n.consume(c),a)}function u(c){if(c===null)return!0;let f=i[c],h=-1;if(f)for(;++h<f.length;){let p=f[h];if(!p.previous||p.previous.call(r,r.previous))return!0}return!1}}}function ip(t){return e;function e(n,r){let i=-1,o;for(;++i<=n.length;)o===void 0?n[i]&&n[i][1].type==="data"&&(o=i,i++):(!n[i]||n[i][1].type!=="data")&&(i!==o+2&&(n[o][1].end=n[i-1][1].end,n.splice(o+2,i-o-2),i=o+2),o=void 0);return t?t(n,r):n}}function xw(t,e){let n=new Jt,r=0;for(;++r<=t.length;)if((r===t.length||t[r][1].type==="lineEnding")&&t[r-1][1].type==="data"){let i=t[r-1][1],o=e.sliceStream(i),s=o.length,l=-1,a=0,u;for(;s--;){let c=o[s];if(typeof c=="string"){for(l=c.length;c.charCodeAt(l-1)===32;)a++,l--;if(l)break;l=-1}else if(c===-2)u=!0,a++;else if(c!==-1){s++;break}}if(e._contentTypeTextTrailing&&r===t.length&&(a=0),a){let c={type:r===t.length||u||a<2?"lineSuffix":"hardBreakTrailing",start:{_bufferIndex:s?l:i.start._bufferIndex+l,_index:i.start._index+s,line:i.end.line,column:i.end.column-a,offset:i.end.offset-a},end:{...i.end}};i.end={...c.start},i.start.offset===i.end.offset?Object.assign(i,c):n.add(r,0,[["enter",c,e],["exit",c,e]])}r++}return n.consume(t),t}var Ra={};Nh(Ra,{attentionMarkers:()=>Tw,contentInitial:()=>ww,disable:()=>Aw,document:()=>bw,flow:()=>Sw,flowInitial:()=>Cw,insideSpan:()=>Iw,string:()=>Mw,text:()=>Nw});var bw={42:ve,43:ve,45:ve,48:ve,49:ve,50:ve,51:ve,52:ve,53:ve,54:ve,55:ve,56:ve,57:ve,62:Ps},ww={91:Na},Cw={[-2]:ro,[-1]:ro,32:ro},Sw={35:Ta,42:jn,45:[Ws,jn],60:Aa,61:Ws,95:jn,96:Bs,126:Bs},Mw={38:zs,92:Ls},Nw={[-5]:so,[-4]:so,[-3]:so,33:Ea,38:zs,42:to,60:[Ca,va],91:Oa,92:[Ia,Ls],93:Vn,95:to,96:Sa},Iw={null:[to,ep]},Tw={null:[42,95]},Aw={null:[]};function op(t,e,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},o=[],s=[],l=[],a=!0,u={attempt:K(L),check:K(P),consume:T,enter:R,exit:C,interrupt:K(P,{interrupt:!0})},c={code:null,containerState:{},defineSkip:g,events:[],now:y,parser:t,previous:null,sliceSerialize:d,sliceStream:m,write:p},f=e.tokenize.call(c,u),h;return e.resolveAll&&o.push(e),c;function p(B){return s=Pe(s,B),M(),s[s.length-1]!==null?[]:(S(e,0),c.events=mn(o,c.events,c),c.events)}function d(B,X){return Ew(m(B),X)}function m(B){return vw(s,B)}function y(){let{_bufferIndex:B,_index:X,line:G,column:ue,offset:me}=r;return{_bufferIndex:B,_index:X,line:G,column:ue,offset:me}}function g(B){i[B.line]=B.column,oe()}function M(){for(;r._index<s.length;){let B=s[r._index];if(typeof B=="string"){let X=r._index;for(r._bufferIndex<0&&(r._bufferIndex=0);r._index===X&&r._bufferIndex<B.length;)w(B.charCodeAt(r._bufferIndex))}else w(B)}}function w(B){a=void 0,h=B,f=f(B)}function T(B){D(B)?(r.line++,r.column=1,r.offset+=B===-3?2:1,oe()):B!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===s[r._index].length&&(r._bufferIndex=-1,r._index++)),c.previous=B,a=!0}function R(B,X){let G=X||{};return G.type=B,G.start=y(),c.events.push(["enter",G,c]),l.push(G),G}function C(B){let X=l.pop();return X.end=y(),c.events.push(["exit",X,c]),X}function L(B,X){S(B,X.from)}function P(B,X){X.restore()}function K(B,X){return G;function G(ue,me,mt){let It,k,lt,Ft;return Array.isArray(ue)?Qe(ue):"tokenize"in ue?Qe([ue]):x(ue);function x(Ce){return qi;function qi(_t){let Nr=_t!==null&&Ce[_t],Bn=_t!==null&&Ce.null,ya=[...Array.isArray(Nr)?Nr:Nr?[Nr]:[],...Array.isArray(Bn)?Bn:Bn?[Bn]:[]];return Qe(ya)(_t)}}function Qe(Ce){return It=Ce,k=0,Ce.length===0?mt:Mr(Ce[k])}function Mr(Ce){return qi;function qi(_t){return Ft=ie(),lt=Ce,Ce.partial||(c.currentConstruct=Ce),Ce.name&&c.parser.constructs.disable.null.includes(Ce.name)?Ts(_t):Ce.tokenize.call(X?Object.assign(Object.create(c),X):c,u,Is,Ts)(_t)}}function Is(Ce){return a=!0,B(lt,Ft),me}function Ts(Ce){return a=!0,Ft.restore(),++k<It.length?Mr(It[k]):mt}}}function S(B,X){B.resolveAll&&!o.includes(B)&&o.push(B),B.resolve&&xe(c.events,X,c.events.length-X,B.resolve(c.events.slice(X),c)),B.resolveTo&&(c.events=B.resolveTo(c.events,c))}function ie(){let B=y(),X=c.previous,G=c.currentConstruct,ue=c.events.length,me=Array.from(l);return{from:ue,restore:mt};function mt(){r=B,c.previous=X,c.currentConstruct=G,c.events.length=ue,l=me,oe()}}function oe(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function vw(t,e){let n=e.start._index,r=e.start._bufferIndex,i=e.end._index,o=e.end._bufferIndex,s;if(n===i)s=[t[n].slice(r,o)];else{if(s=t.slice(n,i),r>-1){let l=s[0];typeof l=="string"?s[0]=l.slice(r):s.shift()}o>0&&s.push(t[i].slice(0,o))}return s}function Ew(t,e){let n=-1,r=[],i;for(;++n<t.length;){let o=t[n],s;if(typeof o=="string")s=o;else switch(o){case-5:{s="\r";break}case-4:{s=`
`;break}case-3:{s=`\r
`;break}case-2:{s=e?" ":"	";break}case-1:{if(!e&&i)continue;s=" ";break}default:s=String.fromCharCode(o)}i=o===-2,r.push(s)}return r.join("")}function Da(t){let r={constructs:Os([Ra,...(t||{}).extensions||[]]),content:i(Uh),defined:[],document:i(Yh),flow:i(Zh),lazy:{},string:i(tp),text:i(np)};return r;function i(o){return s;function s(l){return op(r,o,l)}}}function Pa(t){for(;!_s(t););return t}var sp=/[\0\t\n\r]/g;function La(){let t=1,e="",n=!0,r;return i;function i(o,s,l){o=e+(typeof o=="string"?o.toString():new TextDecoder(s||void 0).decode(o));let a=[],u=0;for(e="",n&&(o.charCodeAt(0)===65279&&u++,n=void 0);u<o.length;){sp.lastIndex=u;let c=sp.exec(o),f=c&&c.index!==void 0?c.index:o.length,h=o.charCodeAt(f);if(!c){e=o.slice(u);break}if(h===10&&u===f&&r)a.push(-3),r=void 0;else switch(r&&(a.push(-5),r=void 0),u<f&&(a.push(o.slice(u,f)),t+=f-u),h){case 0:{a.push(65533),t++;break}case 9:{let p=Math.ceil(t/4)*4;for(a.push(-2);t++<p;)a.push(-1);break}case 10:{a.push(-4),t=1;break}default:r=!0,t=1}u=f+1}return l&&(r&&a.push(-5),e&&a.push(e),a.push(null)),a}}var Ow=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function qs(t){return t.replace(Ow,Rw)}function Rw(t,e,n){if(e)return e;if(n.charCodeAt(0)===35){let i=n.charCodeAt(1),o=i===120||i===88;return Rs(n.slice(o?2:1),o?16:10)}return Br(n)||t}function gn(t){return!t||typeof t!="object"?"":"position"in t||"type"in t?lp(t.position):"start"in t||"end"in t?lp(t):"line"in t||"column"in t?za(t):""}function za(t){return ap(t&&t.line)+":"+ap(t&&t.column)}function lp(t){return za(t&&t.start)+"-"+za(t&&t.end)}function ap(t){return t&&typeof t=="number"?t:1}var cp={}.hasOwnProperty;function Ba(t,e,n){return e&&typeof e=="object"&&(n=e,e=void 0),Dw(n)(Pa(Da(n).document().write(La()(t,e,!0))))}function Dw(t){let e={afterExit:[],beforeEnter:[],transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:s(wh),autolinkProtocol:S,autolinkEmail:S,atxHeading:s(kh),blockQuote:s(Nr),characterEscape:S,characterReference:S,codeFenced:s(Bn),codeFencedFenceInfo:l,codeFencedFenceMeta:l,codeIndented:s(Bn,l),codeText:s(ya,l),codeTextData:S,data:S,codeFlowValue:S,definition:s(jx),definitionDestinationString:l,definitionLabelString:l,definitionTitleString:l,emphasis:s(Hx),hardBreakEscape:s(xh),hardBreakTrailing:s(xh),htmlFlow:s(bh,l),htmlFlowData:S,htmlText:s(bh,l),htmlTextData:S,image:s(Wx),label:l,link:s(wh),listItem:s(qx),listItemValue:p,listOrdered:s(Ch,h),listUnordered:s(Ch),paragraph:s(Kx),reference:Qe,referenceString:l,resourceDestinationString:l,resourceTitleString:l,setextHeading:s(kh),strong:s(Jx),thematicBreak:s(Gx)},exit:{atxHeading:u(),atxHeadingSequence:C,autolink:u(),autolinkEmail:_t,autolinkProtocol:qi,blockQuote:u(),characterEscapeValue:ie,characterReferenceMarkerHexadecimal:Is,characterReferenceMarkerNumeric:Is,characterReferenceValue:Ts,characterReference:Ce,codeFenced:u(g),codeFencedFence:y,codeFencedFenceInfo:d,codeFencedFenceMeta:m,codeFlowValue:ie,codeIndented:u(M),codeText:u(ue),codeTextData:ie,data:ie,definition:u(),definitionDestinationString:R,definitionLabelString:w,definitionTitleString:T,emphasis:u(),hardBreakEscape:u(B),hardBreakTrailing:u(B),htmlFlow:u(X),htmlFlowData:ie,htmlText:u(G),htmlTextData:ie,image:u(mt),label:k,labelText:It,lineEnding:oe,link:u(me),listItem:u(),listOrdered:u(),listUnordered:u(),paragraph:u(),referenceString:Mr,resourceDestinationString:lt,resourceTitleString:Ft,resource:x,setextHeading:u(K),setextHeadingLineSequence:P,setextHeadingText:L,strong:u(),thematicBreak:u()}};fp(e,(t||{}).mdastExtensions||[]);let n={};return r;function r(N){let O={type:"root",children:[],position:void 0},J={stack:[O],tokenStack:[],config:e,enter:a,exit:c,buffer:l,resume:f,data:n},U=[],je=[],le=-1;for(;++le<N.length;)if(je.push(N[le]),N[le][1].type==="listOrdered"||N[le][1].type==="listUnordered")if(N[le][0]==="enter")U.push(je.length-1);else{let He=U.pop();o(je,He)}for(N=je,le=-1;++le<N.length;){let He=e[N[le][0]];N[le][0]==="enter"&&e.beforeEnter.length>0&&i(e.beforeEnter,{...J,sliceSerialize:N[le][2].sliceSerialize},N[le][1]),cp.call(He,N[le][1].type)&&He[N[le][1].type].call({...J,sliceSerialize:N[le][2].sliceSerialize},N[le][1]),N[le][0]==="exit"&&e.afterExit.length>0&&i(e.afterExit,{...J,sliceSerialize:N[le][2].sliceSerialize},N[le][1])}if(J.tokenStack.length>0){let He=J.tokenStack[J.tokenStack.length-1];(He[1]||up).call(J,void 0,He[0])}for(O.position={start:yn(N.length>0?N[0][1].start:{line:1,column:1,offset:0}),end:yn(N.length>0?N[N.length-2][1].end:{line:1,column:1,offset:0})},le=-1;++le<e.transforms.length;)O=e.transforms[le](O)||O;return O}function i(N,O,J){let U=-1;for(;++U<N.length;)N[U].call(O,J)}function o(N,O){let J=N.length-1,U=O-1,je=-1,le=!1,He,Tt,Ki,Ji,Ui=[];for(;++U<=J;){let Ye=N[U];switch(Ye[1].type){case"listUnordered":case"listOrdered":case"blockQuote":{Ye[0]==="enter"?je++:je--,Ji=void 0;break}case"lineEndingBlank":{Ye[0]==="enter"&&(He&&!Ji&&!je&&!Ki&&(Ki=U),Ji=void 0);break}case"linePrefix":case"listItemValue":case"listItemMarker":case"listItemPrefix":case"listItemPrefixWhitespace":break;default:Ji=void 0}if(!je&&Ye[0]==="enter"&&Ye[1].type==="listItemPrefix"||je===-1&&Ye[0]==="exit"&&(Ye[1].type==="listUnordered"||Ye[1].type==="listOrdered")){if(He){let Ir=U;for(Tt=void 0;Ir--;){let $t=N[Ir];if($t[1].type==="lineEnding"||$t[1].type==="lineEndingBlank"){if($t[0]==="exit")continue;Tt&&(N[Tt][1].type="lineEndingBlank",le=!0),$t[1].type="lineEnding",Tt=Ir}else if(!($t[1].type==="linePrefix"||$t[1].type==="blockQuotePrefix"||$t[1].type==="blockQuotePrefixWhitespace"||$t[1].type==="blockQuoteMarker"||$t[1].type==="listItemIndent"))break}Ki&&(!Tt||Ki<Tt)&&(He._spread=!0),He.end=Object.assign({},Tt?N[Tt][1].start:Ye[1].end),Ui.push({at:Tt||U,event:["exit",He,Ye[2]]})}if(Ye[1].type==="listItemPrefix"){let Ir={type:"listItem",_spread:!1,start:Object.assign({},Ye[1].start),end:void 0};He=Ir,Ui.push({at:U,event:["enter",Ir,Ye[2]]}),Ki=void 0,Ji=!0}}}let Sh=N.splice(O),ka=0;for(U=-1;++U<Sh.length;){for(;ka<Ui.length&&Ui[ka].at===O+U;)N.push(Ui[ka++].event);N.push(Sh[U])}N[O][1]._spread=le}function s(N,O){return J;function J(U){a.call(this,N(U),U),O&&O.call(this,U)}}function l(){this.stack.push({type:"fragment",children:[]})}function a(N,O,J){this.stack[this.stack.length-1].children.push(N),this.stack.push(N),this.tokenStack.push([O,J||void 0]),N.position={start:yn(O.start),end:void 0}}function u(N){return O;function O(J){N&&N.call(this,J),c.call(this,J)}}function c(N,O){let J=this.stack.pop(),U=this.tokenStack.pop();if(!U)throw new Error("Cannot close `"+N.type+"` ("+gn({start:N.start,end:N.end})+"): it\u2019s not open");U[0].type!==N.type&&(O?O.call(this,N,U[0]):(U[1]||up).call(this,N,U[0])),J.position.end=yn(N.end)}function f(){return Kt(this.stack.pop())}function h(){this.data.expectingFirstListItemValue=!0}function p(N){if(this.data.expectingFirstListItemValue){let O=this.stack[this.stack.length-2];O.start=Number.parseInt(this.sliceSerialize(N),10),this.data.expectingFirstListItemValue=void 0}}function d(){let N=this.resume(),O=this.stack[this.stack.length-1];O.lang=N}function m(){let N=this.resume(),O=this.stack[this.stack.length-1];O.meta=N}function y(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function g(){let N=this.resume(),O=this.stack[this.stack.length-1];O.value=N.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),this.data.flowCodeInside=void 0}function M(){let N=this.resume(),O=this.stack[this.stack.length-1];O.value=N.replace(/(\r?\n|\r)$/g,"")}function w(N){let O=this.resume(),J=this.stack[this.stack.length-1];J.label=O,J.identifier=Ae(this.sliceSerialize(N)).toLowerCase()}function T(){let N=this.resume(),O=this.stack[this.stack.length-1];O.title=N}function R(){let N=this.resume(),O=this.stack[this.stack.length-1];O.url=N}function C(N){let O=this.stack[this.stack.length-1];if(!O.depth){let J=this.sliceSerialize(N).length;O.depth=J}}function L(){this.data.setextHeadingSlurpLineEnding=!0}function P(N){let O=this.stack[this.stack.length-1];O.depth=this.sliceSerialize(N).codePointAt(0)===61?1:2}function K(){this.data.setextHeadingSlurpLineEnding=void 0}function S(N){let J=this.stack[this.stack.length-1].children,U=J[J.length-1];(!U||U.type!=="text")&&(U=Ux(),U.position={start:yn(N.start),end:void 0},J.push(U)),this.stack.push(U)}function ie(N){let O=this.stack.pop();O.value+=this.sliceSerialize(N),O.position.end=yn(N.end)}function oe(N){let O=this.stack[this.stack.length-1];if(this.data.atHardBreak){let J=O.children[O.children.length-1];J.position.end=yn(N.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&e.canContainEols.includes(O.type)&&(S.call(this,N),ie.call(this,N))}function B(){this.data.atHardBreak=!0}function X(){let N=this.resume(),O=this.stack[this.stack.length-1];O.value=N}function G(){let N=this.resume(),O=this.stack[this.stack.length-1];O.value=N}function ue(){let N=this.resume(),O=this.stack[this.stack.length-1];O.value=N}function me(){let N=this.stack[this.stack.length-1];if(this.data.inReference){let O=this.data.referenceType||"shortcut";N.type+="Reference",N.referenceType=O,delete N.url,delete N.title}else delete N.identifier,delete N.label;this.data.referenceType=void 0}function mt(){let N=this.stack[this.stack.length-1];if(this.data.inReference){let O=this.data.referenceType||"shortcut";N.type+="Reference",N.referenceType=O,delete N.url,delete N.title}else delete N.identifier,delete N.label;this.data.referenceType=void 0}function It(N){let O=this.sliceSerialize(N),J=this.stack[this.stack.length-2];J.label=qs(O),J.identifier=Ae(O).toLowerCase()}function k(){let N=this.stack[this.stack.length-1],O=this.resume(),J=this.stack[this.stack.length-1];if(this.data.inReference=!0,J.type==="link"){let U=N.children;J.children=U}else J.alt=O}function lt(){let N=this.resume(),O=this.stack[this.stack.length-1];O.url=N}function Ft(){let N=this.resume(),O=this.stack[this.stack.length-1];O.title=N}function x(){this.data.inReference=void 0}function Qe(){this.data.referenceType="collapsed"}function Mr(N){let O=this.resume(),J=this.stack[this.stack.length-1];J.label=O,J.identifier=Ae(this.sliceSerialize(N)).toLowerCase(),this.data.referenceType="full"}function Is(N){this.data.characterReferenceType=N.type}function Ts(N){let O=this.sliceSerialize(N),J=this.data.characterReferenceType,U;J?(U=Rs(O,J==="characterReferenceMarkerNumeric"?10:16),this.data.characterReferenceType=void 0):U=Br(O);let je=this.stack[this.stack.length-1];je.value+=U}function Ce(N){let O=this.stack.pop();O.position.end=yn(N.end)}function qi(N){ie.call(this,N);let O=this.stack[this.stack.length-1];O.url=this.sliceSerialize(N)}function _t(N){ie.call(this,N);let O=this.stack[this.stack.length-1];O.url="mailto:"+this.sliceSerialize(N)}function Nr(){return{type:"blockquote",children:[],position:void 0}}function Bn(){return{type:"code",lang:null,meta:null,value:"",position:void 0}}function ya(){return{type:"inlineCode",value:"",position:void 0}}function jx(){return{type:"definition",identifier:"",label:null,title:null,url:"",position:void 0}}function Hx(){return{type:"emphasis",children:[],position:void 0}}function kh(){return{type:"heading",depth:0,children:[],position:void 0}}function xh(){return{type:"break",position:void 0}}function bh(){return{type:"html",value:"",position:void 0}}function Wx(){return{type:"image",title:null,url:"",alt:null,position:void 0}}function wh(){return{type:"link",title:null,url:"",children:[],position:void 0}}function Ch(N){return{type:"list",ordered:N.type==="listOrdered",start:null,spread:N._spread,children:[],position:void 0}}function qx(N){return{type:"listItem",spread:N._spread,checked:null,children:[],position:void 0}}function Kx(){return{type:"paragraph",children:[],position:void 0}}function Jx(){return{type:"strong",children:[],position:void 0}}function Ux(){return{type:"text",value:"",position:void 0}}function Gx(){return{type:"thematicBreak",position:void 0}}}function yn(t){return{line:t.line,column:t.column,offset:t.offset}}function fp(t,e){let n=-1;for(;++n<e.length;){let r=e[n];Array.isArray(r)?fp(t,r):Pw(t,r)}}function Pw(t,e){let n;for(n in e)if(cp.call(e,n))switch(n){case"canContainEols":{let r=e[n];r&&t[n].push(...r);break}case"transforms":{let r=e[n];r&&t[n].push(...r);break}case"afterExit":case"beforeEnter":{let r=e[n];r&&t[n].push(r);break}case"enter":case"exit":{let r=e[n];r&&Object.assign(t[n],r);break}}}function up(t,e){throw t?new Error("Cannot close `"+t.type+"` ("+gn({start:t.start,end:t.end})+"): a different token (`"+e.type+"`, "+gn({start:e.start,end:e.end})+") is open"):new Error("Cannot close document, a token (`"+e.type+"`, "+gn({start:e.start,end:e.end})+") is still open")}function Fr(t){let e=this;e.parser=n;function n(r){return Ba(r,{...e.data("settings"),...t,extensions:e.data("micromarkExtensions")||[],mdastExtensions:e.data("fromMarkdownExtensions")||[]})}}var kn=(function(t){if(t==null)return Fw;if(typeof t=="function")return Ks(t);if(typeof t=="object")return Array.isArray(t)?Lw(t):zw(t);if(typeof t=="string")return Bw(t);throw new Error("Expected function, string, or object as test")});function Lw(t){let e=[],n=-1;for(;++n<t.length;)e[n]=kn(t[n]);return Ks(r);function r(...i){let o=-1;for(;++o<e.length;)if(e[o].apply(this,i))return!0;return!1}}function zw(t){let e=t;return Ks(n);function n(r){let i=r,o;for(o in t)if(i[o]!==e[o])return!1;return!0}}function Bw(t){return Ks(e);function e(n){return n&&n.type===t}}function Ks(t){return e;function e(n,r,i){return!!(_w(n)&&t.call(this,n,typeof r=="number"?r:void 0,i||void 0))}}function Fw(){return!0}function _w(t){return t!==null&&typeof t=="object"&&"type"in t}var lo=kn(["break","delete","emphasis","footnote","footnoteReference","image","imageReference","inlineCode","inlineMath","link","linkReference","mdxJsxTextElement","mdxTextExpression","strong","text","textDirective"]);var hp={}.hasOwnProperty;function pp(t,e){let n=e||{};function r(i,...o){let s=r.invalid,l=r.handlers;if(i&&hp.call(i,t)){let a=String(i[t]);s=hp.call(l,a)?l[a]:r.unknown}if(s)return s.call(this,i,...o)}return r.handlers=n.handlers||{},r.invalid=n.invalid,r.unknown=n.unknown,r}var $w={}.hasOwnProperty;function Fa(t,e){let n=-1,r;if(e.extensions)for(;++n<e.extensions.length;)Fa(t,e.extensions[n]);for(r in e)if($w.call(e,r))switch(r){case"extensions":break;case"unsafe":{dp(t[r],e[r]);break}case"join":{dp(t[r],e[r]);break}case"handlers":{Vw(t[r],e[r]);break}default:t.options[r]=e[r]}return t}function dp(t,e){e&&t.push(...e)}function Vw(t,e){e&&Object.assign(t,e)}function mp(t,e,n,r){let i=n.enter("blockquote"),o=n.createTracker(r);o.move("> "),o.shift(2);let s=n.indentLines(n.containerFlow(t,o.current()),jw);return i(),s}function jw(t,e,n){return">"+(n?"":" ")+t}function Js(t,e){return gp(t,e.inConstruct,!0)&&!gp(t,e.notInConstruct,!1)}function gp(t,e,n){if(typeof e=="string"&&(e=[e]),!e||e.length===0)return n;let r=-1;for(;++r<e.length;)if(t.includes(e[r]))return!0;return!1}function _a(t,e,n,r){let i=-1;for(;++i<n.unsafe.length;){let o=n.unsafe[i];if(o.character===`
`&&!o.before&&!o.after&&Js(n.stack,o))return/[\t ]/.test(r.before)?"":" "}return`\\
`}function yp(t,e){let n=String(t),r=n.indexOf(e),i=r,o=0,s=0;if(typeof e!="string")throw new TypeError("Expected substring");for(;r!==-1;)r===i?++o>s&&(s=o):o=1,i=r+e.length,r=n.indexOf(e,i);return s}function _r(t,e){return!!(e.options.fences===!1&&t.value&&!t.lang&&/[^\n\r ]/.test(t.value)&&!/^[\t ]*(?:[\n\r]|$)|(?:^|[\n\r])[\t ]*$/.test(t.value))}function kp(t){let e=t.options.fence||"`";if(e!=="`"&&e!=="~")throw new Error("Cannot serialize code with `"+e+"` for `options.fence`, expected `` ` `` or `~`");return e}function xp(t,e,n,r){let i=kp(n),o=t.value||"";if(_r(t,n)){let f=n.enter("codeIndented"),h=n.indentLines(o,Hw);return f(),h}let s=n.createTracker(r),l=i.repeat(Math.max(yp(o,i)+1,3)),a=n.enter("codeFenced"),u=i==="`"?"GraveAccent":"Tilde",c=s.move(l);if(t.lang){let f=n.enter(`codeFencedLang${u}`);c+=s.move(n.safe(t.lang,{before:c,after:" ",encode:["`"],...s.current()})),f()}if(t.lang&&t.meta){let f=n.enter(`codeFencedMeta${u}`);c+=s.move(" "),c+=s.move(n.safe(t.meta,{before:c,after:`
`,encode:["`"],...s.current()})),f()}return c+=s.move(`
`),o&&(c+=s.move(o+`
`)),c+=s.move(l),a(),c}function Hw(t,e,n){return(n?"":"    ")+t}function $r(t){let e=t.options.quote||'"';if(e!=='"'&&e!=="'")throw new Error("Cannot serialize title with `"+e+"` for `options.quote`, expected `\"`, or `'`");return e}function bp(t,e,n,r){let i=$r(n),o=i==='"'?"Quote":"Apostrophe",s=n.enter("definition"),l=n.enter("label"),a=n.createTracker(r),u=a.move("[");return u+=a.move(n.safe(n.associationId(t),{before:u,after:"]",...a.current()})),u+=a.move("]: "),l(),!t.url||/^<|[\0- \u007F]/.test(t.url)?(l=n.enter("destinationLiteral"),u+=a.move("<"),u+=a.move(n.safe(t.url,{before:u,after:">",...a.current()})),u+=a.move(">")):(l=n.enter("destinationRaw"),u+=a.move(n.safe(t.url,{before:u,after:t.title?" ":`
`,...a.current()}))),l(),t.title&&(l=n.enter(`title${o}`),u+=a.move(" "+i),u+=a.move(n.safe(t.title,{before:u,after:i,...a.current()})),u+=a.move(i),l()),s(),u}function wp(t){let e=t.options.emphasis||"*";if(e!=="*"&&e!=="_")throw new Error("Cannot serialize emphasis with `"+e+"` for `options.emphasis`, expected `*`, or `_`");return e}function ao(t){let e=t.codePointAt(0);return e===void 0?"":String.fromCodePoint(e)}function Hn(t){let e=t.codePointAt(t.length-2);return e!==void 0&&e>65535?t.slice(-2):t.slice(-1)}function Vr(t){return"&#x"+t.toString(16).toUpperCase()+";"}function $a(t,e,n){let r=Le(t),i=Le(e);return r===void 0?i===void 0?n==="_"?{inside:!0,outside:!0}:{inside:!1,outside:!1}:i===1?{inside:!0,outside:!0}:{inside:!1,outside:!0}:r===1?i===void 0?{inside:!1,outside:!1}:i===1?{inside:!0,outside:!0}:{inside:!1,outside:!1}:i===void 0?{inside:!1,outside:!1}:i===1?{inside:!0,outside:!1}:{inside:!1,outside:!1}}function uo(t){if(t.charCodeAt(0)!==60)return;let e=t.charCodeAt(1);if(e===33){let l=t.charCodeAt(2);return l===45?2:l===91?5:ce(l)?4:void 0}if(e===63)return 3;let n=e===47,r=n?2:1,i=r,o=t.charCodeAt(i);if(!ce(o))return;for(;o===45||fe(o);)o=t.charCodeAt(++i);let s=t.slice(r,i).toLowerCase();return!n&&o!==47&&oo.includes(s)?1:Hs.includes(s)?6:7}var Sp=new Map([["*",!1],["_",!0]]);function Ww(t,e,n){let r=new Set;for(let o of t){let s=n.get(o);if(s&&o.attention&&e.some(l=>l.attention===o.attention))for(let l of s.tokens)r.add(l.attention)}let i=[];for(let o of t)o.attention&&r.delete(o.attention)&&i.push(o.attention);return i.reverse(),i}function Mp(t,e,n){let r=[],i=new Map,o=new Map,s=0;for(;s<t.length;){if(!t[s].attention){s++;continue}let l=t[s].value.charAt(0),a=Sp.get(l),u=s+1;for(;u<t.length&&t[u].attention&&t[u].value.charAt(0)===l;)u++;let c=s?t[s-1].value:e,f=Le(c.charCodeAt(c.length-1)),h=Le((u<t.length?t[u].value:n).charCodeAt(0)),p=!h||h===2&&!!f,d=!f||f===2&&!!h,m={tokens:t.slice(s,u),markers:[],start:0,end:0,open:a?p&&(!!f||!d):p,close:a?d&&(!!h||!p):d,split:a!==void 0};for(let y of m.tokens){i.set(y,[...m.tokens]),o.set(y,m);let g=y.value.length;for(;g--;)m.markers.push(y)}m.end=m.markers.length,r.push(m),s=u}for(Kw(r,i),s=-1;++s<t.length;){let l=i.get(t[s]);if(l)return{attention:Ww(t,l,o),index:s}}}function Np(t,e,n){return Wn(Ip(t,e,n),n.before,n.after)}function Us(t,e){let n=t[e?0:t.length-1];if(!n||n.attention)return;let r=e?ao(n.value):Hn(n.value),i=Vr(r.codePointAt(0));if(e)n.value=i+n.value.slice(r.length);else{let o=n.value.slice(0,n.value.length-r.length),s=0;for(;o.charCodeAt(o.length-1-s)===92;)s++;s%2&&(o+="\\"),n.value=o+i}}function qw(t,e,n,r,i){for(let o of n.attention){let s=e.get(o)||o.sequences[0];for(let l of o.sequences){if(l===s)continue;let a=new Map(e);a.set(o,l);let u=Gs(t,a,r,i),c=Mp(u,r,i);if(!c||c.index>n.index)return{chosen:a,mistake:c,tokens:u}}}}function Kw(t,e){let n=new Map;for(let r of t){let i=r.tokens[0].value.charAt(0),o=n.get(i);o||(o=[],n.set(i,o));let s=r.close?o.length:0;for(;s--&&r.start<r.end;){let l=o[s],a=l.end-l.start,u=r.end-r.start;if(r.split?(l.close||r.open)&&u%3&&!((a+u)%3):a!==l.markers.length||a!==u)continue;let c=r.split?a>1&&u>1?2:1:u,f=l.markers.slice(l.end-c,l.end),h=r.markers.slice(r.start,r.start+c),p=f[0],d=h[0];if(p===f[c-1]&&p.value.length===c&&d===h[c-1]&&d.value.length===c&&p.attention===d.attention)e.delete(p),e.delete(d);else{let m=[...new Set([...f,...h])];for(let y of m){let g=e.get(y);g&&g.push(...m)}}l.end-=c,r.start+=c,l.start===l.end&&o.splice(s,1),s=o.length}r.open&&r.start<r.end&&o.push(r)}}function Jw(t,e,n){if(e.length===0)throw new Error("Cannot serialize `"+t+"` as attention without markers, expected one or more markers");if(n.length===0)throw new Error("Cannot serialize `"+t+"` as attention without sizes, expected one or more sizes");for(let i of n)if(!Number.isSafeInteger(i)||i<1)throw new Error("Cannot serialize `"+t+"` as attention with `"+i+"` as size, expected positive integer");let r=[];for(let i of e){if(i.length!==1)throw new Error("Cannot serialize `"+t+"` as attention with `"+i+"` as marker, expected a single ascii character");if(!Ds(i.charCodeAt(0)))throw new Error("Cannot serialize `"+t+"` as attention with `"+i+"` as marker, expected ascii punctuation");for(let o of n)r.push(i.repeat(o))}return r}function Ip(t,e,n){let r=e.indexStack,i=t.children||[],o=[],s=-1,l=n.before;r.push(-1);let a=e.createTracker(n);for(;++s<i.length;){let u=i[s],c;if(r[r.length-1]=s,s+1<i.length){let p=e.handle.handlers[i[s+1].type];p&&p.peek&&(p=p.peek),c=p?ao(p(i[s+1],t,e,{before:"",after:"",...a.current()})):""}else c=n.after;let f=o[o.length-1];typeof f=="string"&&(l==="\r"||l===`
`)&&u.type==="html"&&uo(u.value)!==7&&(o[o.length-1]=f.replace(/(\r?\n|\r)$/," "),l=" ",a=e.createTracker(n),a.move(Wn(o,n.before,n.after)));let h=e.handle.handlers[u.type];if(h&&h.attention){let p=co(u,h.attention,e,a);if(!p)continue;o.push(p),l=Hn(p.sequences[0])}else{let p=e.handle(u,t,e,{...a.current(),after:c,before:l});if(!p)continue;a.move(p),o.push(p),l=Hn(p)}}return r.pop(),o}function co(t,e,n,r){let{construct:i,markers:o,sizes:s}=e(t,n),l=Jw(t.type,o,s),a=l[0],u=n.enter(i),c=n.createTracker(r.current());c.move(a);let f=Ip(t,n,{...c.current(),before:a,after:a});if(u(),f.length!==0)return r.move(a),r.move(Wn(f,a,a)),r.move(a),{children:f,sequences:l}}function Cp(t,e,n,r){let i=Gs(t,e,n,r),o=Mp(i,n,r);for(;o;){let s=qw(t,e,o,n,r);if(!s)return;e=s.chosen,i=s.tokens,o=s.mistake}return i}function Tp(t,e,n,r){let i=n,o=-1;for(;++o<t.length;){let s=t[o];if(typeof s=="string"){i="";continue}let l=o===t.length-1?r:"",a=s.sequences.find(function(u){let c=u.charAt(0);return c!==i.charAt(0)&&c!==l.charAt(0)||t.length===1&&Sp.has(c)&&u.length>n.length})||s.sequences[0];a!==s.sequences[0]&&e.set(s,a),Tp(s.children,e,a,a),i=a}}function Gs(t,e,n,r){let i=[],o,s=Hn(n),l=-1;for(;++l<t.length;){let a=t[l];if(typeof a=="string"){let w={value:a,attention:void 0};o&&o===ao(a)&&Us([w],!0),o=void 0,i.push(w),w.value&&(s=Hn(w.value));continue}let u=e.get(a)||a.sequences[0],c=u.charAt(0),f=t[l+1],h=s,p=ao(f===void 0?r:typeof f=="string"?f:e.get(f)||f.sequences[0]),d=Gs(a.children,e,u,u),m=d[0].value,y=$a(h.charCodeAt(h.length-1),m.charCodeAt(0),c);y.inside&&Us(d,!0);let g=Hn(d[d.length-1].value),M=$a(p.charCodeAt(0),g.charCodeAt(g.length-1),c);M.inside&&Us(d,!1),y.outside&&h!==`
`&&h!=="\r"&&Us(i,!1),M.outside&&(o=p),i.push({value:u,attention:a},...d,{value:u,attention:a}),s=u.charAt(u.length-1)}return i}function Wn(t,e,n){let r=new Map;Tp(t,r,e,n);let i=(r.size>0?Cp(t,r,e,n):void 0)||Cp(t,new Map,e,n)||Gs(t,new Map,e,n),o="";for(let s of i)o+=s.value;return o}Qs.attention=Ap;Qs.peek=Uw;function Qs(t,e,n,r){let i=n.enter("phrasing"),o=co(t,Ap,n,n.createTracker(r)),s=o?Wn([o],r.before,r.after):"";return i(),s}function Ap(t,e){return{construct:"emphasis",markers:wp(e)==="*"?["*","_"]:["_","*"],sizes:[1]}}function Uw(t,e,n){return n.options.emphasis||"*"}var Ep=[],Ys=!0,Et=!1,ct="skip";function xn(t,e,n,r){if(!t||typeof t!="object")throw new Error("Unexpected value `"+t+"` for `tree`, expected node");let i=!0,o,s,l,a;if(typeof n=="function"||n&&typeof n=="object"?(o=e,s=n,r&&(i=!1)):(s=e,n&&(i=!1)),typeof s=="function")l=s;else if(s&&typeof s=="object"){if(!(s.enter===null||s.enter===void 0))if(typeof s.enter=="function")l=s.enter;else throw new Error("Unexpected value `"+s.enter+"` for `visitors.enter`, expected optional visitor");if(typeof s.exit=="function")a=s.exit;else throw new Error("Unexpected value `"+s.exit+"` for `visitors.exit`, expected visitor (pass a visitor directly if you only want an enter visitor)")}else throw new Error("Unexpected value `"+s+"` for `enter` or `visitors`, expected visitor or object with visitors");let u=kn(o),c=i?1:-1;f(t,void 0,[])();function f(h,p,d){let m=h&&typeof h=="object"?h:{};if(typeof m.type=="string"){let g=typeof m.tagName=="string"?m.tagName:typeof m.name=="string"?m.name:void 0;Object.defineProperty(y,"name",{value:"node ("+(h.type+(g?"<"+g+">":""))+")"})}return y;function y(){let g=!o||u(h,p,d[d.length-1]||void 0),M=Ep;if(l&&g&&(M=vp(l(h,d,p)),M[0]===Et))return M;if("children"in h&&h.children){let w=h;if(w.children&&M[0]!==ct){let T=(i?-1:w.children.length)+c,R=[...d,w];for(;T>-1&&T<w.children.length;){let C=w.children[T],L=f(C,T,R)();if(L[0]===Et)return L;T=typeof L[1]=="number"?L[1]:T+c}}}if(a&&g){let w=vp(a(h,d,p));if(w[0]===ct)throw new Error("Unexpected value `"+w[0]+"` from `exit`, expected `CONTINUE`, `EXIT`, index, or nothing");if(w[0]===Et||typeof w[1]=="number")return w}return M}}}function vp(t){return Array.isArray(t)?t:typeof t=="number"?[Ys,t]:t==null?Ep:[t]}function tt(t,e,n,r){let i,o,s;typeof n=="function"||n&&typeof n=="object"?(i=e,o=n,s=r):(o=e,s=n),typeof o=="function"?xn(t,i,Va(o),s):xn(t,i,Gw(o),s)}function Gw(t){return!t||typeof t!="object"?t:{enter:typeof t.enter=="function"?Va(t.enter):t.enter,exit:typeof t.exit=="function"?Va(t.exit):t.exit}}function Va(t){return e;function e(n,r,i){return t(n,i,r[r.length-1])}}function Xs(t,e){let n=!1;return tt(t,function(r){if("value"in r&&/\r?\n|\r/.test(r.value)||r.type==="break")return n=!0,Et}),!!((!t.depth||t.depth<3)&&Kt(t)&&(e.options.setext||n))}function Op(t,e,n,r){let i=Math.max(Math.min(6,t.depth||1),1),o=n.createTracker(r);if(Xs(t,n)){let f=n.enter("headingSetext"),h=n.enter("phrasing"),p=n.containerPhrasing(t,{...o.current(),before:`
`,after:`
`});return h(),f(),p+`
`+(i===1?"=":"-").repeat(p.length-(Math.max(p.lastIndexOf("\r"),p.lastIndexOf(`
`))+1))}let s="#".repeat(i),l=n.enter("headingAtx"),a=n.enter("phrasing");o.move(s+" ");let u=n.containerPhrasing(t,{before:"# ",after:`
`,...o.current()}),c=u.charCodeAt(0);return(c===9||c===32)&&(u=Vr(c)+u.slice(1)),u=u?s+" "+u:s,n.options.closeAtx&&(u+=" "+s),a(),l(),u}ja.peek=Qw;function ja(t){return t.value||""}function Qw(){return"<"}Ha.peek=Yw;function Ha(t,e,n,r){let i=$r(n),o=i==='"'?"Quote":"Apostrophe",s=n.enter("image"),l=n.enter("label"),a=n.createTracker(r),u=a.move("![");return u+=a.move(n.safe(t.alt,{before:u,after:"]",...a.current()})),u+=a.move("]("),l(),!t.url&&t.title||/^<|[\0- \u007F]/.test(t.url)?(l=n.enter("destinationLiteral"),u+=a.move("<"),u+=a.move(n.safe(t.url,{before:u,after:">",...a.current()})),u+=a.move(">")):(l=n.enter("destinationRaw"),u+=a.move(n.safe(t.url,{before:u,after:t.title?" ":")",...a.current()}))),l(),t.title&&(l=n.enter(`title${o}`),u+=a.move(" "+i),u+=a.move(n.safe(t.title,{before:u,after:i,...a.current()})),u+=a.move(i),l()),u+=a.move(")"),s(),u}function Yw(){return"!"}Wa.peek=Xw;function Wa(t,e,n,r){let i=t.referenceType,o=n.enter("imageReference"),s=n.enter("label"),l=n.createTracker(r),a=l.move("!["),u=n.safe(t.alt,{before:a,after:"]",...l.current()});a+=l.move(u+"]["),s();let c=n.stack;n.stack=c.filter(function(h){return h!=="phrasing"}),s=n.enter("reference");let f=n.safe(n.associationId(t),{before:a,after:"]",...l.current()});return s(),n.stack=c,o(),i==="full"||!u||u!==f?a+=l.move(f+"]"):i==="shortcut"?a=a.slice(0,-1):a+=l.move("]"),a}function Xw(){return"!"}qa.peek=Zw;function qa(t,e,n){let r=t.value||"",i="`",o=-1;for(;new RegExp("(^|[^`])"+i+"([^`]|$)").test(r);)i+="`";for(/[^\n\r ]/.test(r)&&(/^[\n\r ]/.test(r)&&/[\n\r ]$/.test(r)||/^`|`$/.test(r))&&(r=" "+r+" ");++o<n.unsafe.length;){let s=n.unsafe[o],l=n.compilePattern(s);if(!s.atBreak)continue;let a;for(;a=l.exec(r);){let u=a.index;r.charCodeAt(u)===10&&r.charCodeAt(u-1)===13&&u--,r=r.slice(0,u)+" "+r.slice(a.index+1)}}return i+r+i}function Zw(){return"`"}function Ka(t,e){let n=Kt(t);return!!(!e.options.resourceLink&&t.url&&!t.title&&t.children&&t.children.length===1&&t.children[0].type==="text"&&(n===t.url||"mailto:"+n===t.url)&&/^[a-z][+\-.a-z]+:/i.test(t.url)&&!/[\0- <>\u007F]/.test(t.url))}Ja.peek=e0;function Ja(t,e,n,r){let i=$r(n),o=i==='"'?"Quote":"Apostrophe",s=n.createTracker(r);if(Ka(t,n)){let d=n.stack;n.stack=d.filter(function(g){return g!=="phrasing"});let m=n.enter("autolink"),y=s.move("<");return y+=s.move(n.containerPhrasing(t,{before:y,after:">",...s.current()})),y+=s.move(">"),m(),n.stack=d,y}let l=n.enter("link"),a=n.enter("label"),u=s.move("["),c=n.containerPhrasing(t,{before:u,after:"](",...s.current()});u+=s.move(c),a(),u+=s.move("](");let f=/^<|[\0- \u007F]/.test(t.url),h=r.before.charAt(r.before.length-1),p=t.title||void 0;if(!p&&!f&&(h===`
`||h==="\r")){let d=0;for(;d<c.length&&c.charCodeAt(d)!==93;)d+=c.charCodeAt(d)===92?2:1;c.charCodeAt(d+1)===58&&(p="")}return!t.url&&typeof p=="string"||f?(a=n.enter("destinationLiteral"),u+=s.move("<"),u+=s.move(n.safe(t.url,{before:u,after:">",...s.current()})),u+=s.move(">")):(a=n.enter("destinationRaw"),u+=s.move(n.safe(t.url,{before:u,after:typeof p=="string"?" ":")",...s.current()}))),a(),typeof p=="string"&&(a=n.enter(`title${o}`),u+=s.move(" "+i),u+=s.move(n.safe(p,{before:u,after:i,...s.current()})),u+=s.move(i),a()),u+=s.move(")"),l(),u}function e0(t,e,n){return Ka(t,n)?"<":"["}Ua.peek=t0;function Ua(t,e,n,r){let i=t.referenceType,o=n.enter("linkReference"),s=n.enter("label"),l=n.createTracker(r),a=l.move("["),u=n.containerPhrasing(t,{before:a,after:"]",...l.current()});a+=l.move(u+"]["),s();let c=n.stack;n.stack=c.filter(function(h){return h!=="phrasing"}),s=n.enter("reference");let f=n.safe(n.associationId(t),{before:a,after:"]",...l.current()});return s(),n.stack=c,o(),i==="full"||!u||u!==f?a+=l.move(f+"]"):i==="shortcut"?a=a.slice(0,-1):a+=l.move("]"),a}function t0(){return"["}function jr(t){let e=t.options.bullet||"*";if(e!=="*"&&e!=="+"&&e!=="-")throw new Error("Cannot serialize items with `"+e+"` for `options.bullet`, expected `*`, `+`, or `-`");return e}function Rp(t){let e=jr(t),n=t.options.bulletOther;if(!n)return e==="*"?"-":"*";if(n!=="*"&&n!=="+"&&n!=="-")throw new Error("Cannot serialize items with `"+n+"` for `options.bulletOther`, expected `*`, `+`, or `-`");if(n===e)throw new Error("Expected `bullet` (`"+e+"`) and `bulletOther` (`"+n+"`) to be different");return n}function Dp(t){let e=t.options.bulletOrdered||".";if(e!=="."&&e!==")")throw new Error("Cannot serialize items with `"+e+"` for `options.bulletOrdered`, expected `.` or `)`");return e}function Hr(t){let e=t.options.rule||"*";if(e!=="*"&&e!=="-"&&e!=="_")throw new Error("Cannot serialize rules with `"+e+"` for `options.rule`, expected `*`, `-`, or `_`");return e}function Pp(t,e,n,r){let i=n.enter("list"),o=n.bulletCurrent,s=t.ordered?Dp(n):jr(n),l=t.ordered?s==="."?")":".":Rp(n),a=e&&n.bulletLastUsed?s===n.bulletLastUsed:!1;if(!t.ordered){let c=t.children?t.children[0]:void 0;if((s==="*"||s==="-")&&c&&(!c.children||!c.children[0])&&n.stack[n.stack.length-1]==="list"&&n.stack[n.stack.length-2]==="listItem"&&n.stack[n.stack.length-3]==="list"&&n.stack[n.stack.length-4]==="listItem"&&n.indexStack[n.indexStack.length-1]===0&&n.indexStack[n.indexStack.length-2]===0&&n.indexStack[n.indexStack.length-3]===0&&(a=!0),Hr(n)===s&&c){let f=-1;for(;++f<t.children.length;){let h=t.children[f];if(h&&h.type==="listItem"&&h.children&&h.children[0]&&h.children[0].type==="thematicBreak"){a=!0;break}}}}a&&(s=l),n.bulletCurrent=s;let u=n.containerFlow(t,r);return n.bulletLastUsed=s,n.bulletCurrent=o,i(),u}function Lp(t){let e=t.options.listItemIndent||"one";if(e!=="tab"&&e!=="one"&&e!=="mixed")throw new Error("Cannot serialize items with `"+e+"` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`");return e}function zp(t,e,n,r){let i=Lp(n),o=n.bulletCurrent||jr(n);e&&e.type==="list"&&e.ordered&&(o=(typeof e.start=="number"&&e.start>-1?e.start:1)+(n.options.incrementListMarker===!1?0:e.children.indexOf(t))+o);let s=o.length+1;(i==="tab"||i==="mixed"&&(e&&e.type==="list"&&e.spread||t.spread))&&(s=Math.ceil(s/4)*4);let l=n.createTracker(r);l.move(o+" ".repeat(s-o.length)),l.shift(s);let a=n.enter("listItem"),u=n.indentLines(n.containerFlow(t,l.current()),c);return a(),u;function c(f,h,p){return h?(p?"":" ".repeat(s))+f:(p?o:o+" ".repeat(s-o.length))+f}}function Bp(t,e,n,r){let i=n.enter("paragraph"),o=n.enter("phrasing"),s=n.containerPhrasing(t,r);return o(),i(),s}function Fp(t,e,n,r){if(!t.children.some(function(l){return lo(l)}))return n.containerFlow(t,r);let o=n.enter("phrasing"),s=n.containerPhrasing(t,r);return o(),s}function _p(t){let e=t.options.strong||"*";if(e!=="*"&&e!=="_")throw new Error("Cannot serialize strong with `"+e+"` for `options.strong`, expected `*`, or `_`");return e}Zs.attention=$p;Zs.peek=n0;function Zs(t,e,n,r){let i=n.enter("phrasing"),o=co(t,$p,n,n.createTracker(r)),s=o?Wn([o],r.before,r.after):"";return i(),s}function $p(t,e){return{construct:"strong",markers:_p(e)==="*"?["*","_"]:["_","*"],sizes:[2]}}function n0(t,e,n){return n.options.strong||"*"}function Vp(t,e,n,r){let i=e?e.children:[],o=n.indexStack[n.indexStack.length-1];return n.safe(t.value,{...r,afterNode:i[o+1],beforeNode:i[o-1]})}function jp(t){let e=t.options.ruleRepetition||3;if(e<3)throw new Error("Cannot serialize rules with repetition `"+e+"` for `options.ruleRepetition`, expected `3` or more");return e}function Hp(t,e,n){let r=(Hr(n)+(n.options.ruleSpaces?" ":"")).repeat(jp(n));return n.options.ruleSpaces?r.slice(0,-1):r}var bn={blockquote:mp,break:_a,code:xp,definition:bp,emphasis:Qs,hardBreak:_a,heading:Op,html:ja,image:Ha,imageReference:Wa,inlineCode:qa,link:Ja,linkReference:Ua,list:Pp,listItem:zp,paragraph:Bp,root:Fp,strong:Zs,text:Vp,thematicBreak:Hp};var Wp=[r0];function r0(t,e,n,r){if(e.type==="code"&&_r(e,r)&&(t.type==="list"||t.type===e.type&&_r(t,r)))return!1;if("spread"in n&&typeof n.spread=="boolean"){if(n.spread)return 1;if(t.type==="html"){let o=uo(t.value);if(o===void 0||o===6||o===7)return 1}if(t.type==="blockquote"&&e.type==="blockquote"||(t.type==="definition"||t.type==="paragraph")&&e.type==="list"&&(e.ordered&&typeof e.start=="number"&&e.start!==1||e.children.length>0&&e.children[0].children.length===0)||t.type==="paragraph"&&e.type==="thematicBreak"&&Hr(r)==="-"&&!r.options.ruleSpaces)return 1;let i=t;for(;(i.type==="blockquote"||i.type==="list"||i.type==="listItem")&&i.children.length>0;)i=i.children[i.children.length-1];if(i.type!=="definition"&&i.type!=="paragraph")return 0;if(e.type==="code"&&_r(e,r))return 1;if(e.type==="html"){let o=uo(e.value);if(o===void 0||o===7)return 1}return(t.type==="paragraph"||t!==i)&&(e.type==="definition"||e.type==="heading"&&Xs(e,r)||e.type==="paragraph")?1:0}}var qn=["autolink","destinationLiteral","destinationRaw","reference","titleQuote","titleApostrophe"],Ga=[{character:"	",after:"[\\r\\n]",inConstruct:"phrasing"},{character:"	",before:"[\\r\\n]",inConstruct:"phrasing"},{character:"	",inConstruct:["codeFencedLangGraveAccent","codeFencedLangTilde"]},{character:"\r",inConstruct:["codeFencedLangGraveAccent","codeFencedLangTilde","codeFencedMetaGraveAccent","codeFencedMetaTilde","destinationLiteral","headingAtx"]},{character:`
`,inConstruct:["codeFencedLangGraveAccent","codeFencedLangTilde","codeFencedMetaGraveAccent","codeFencedMetaTilde","destinationLiteral","headingAtx"]},{character:"\r",before:"[\\r\\n]",inConstruct:"phrasing"},{character:"\r",after:"\\r",inConstruct:"phrasing"},{character:`
`,before:"\\n",inConstruct:"phrasing"},{character:`
`,after:"[\\r\\n]",inConstruct:"phrasing"},{character:" ",after:"[\\r\\n]",inConstruct:"phrasing"},{character:" ",before:"[\\r\\n]",inConstruct:"phrasing"},{character:" ",inConstruct:["codeFencedLangGraveAccent","codeFencedLangTilde"]},{character:"!",after:"\\[",inConstruct:"phrasing",notInConstruct:qn},{character:'"',inConstruct:"titleQuote"},{atBreak:!0,character:"#"},{character:"#",inConstruct:"headingAtx",after:`(?:[\r
]|$)`},{character:"&",after:"[#A-Za-z]",inConstruct:["codeFencedLangGraveAccent","codeFencedLangTilde","codeFencedMetaGraveAccent","codeFencedMetaTilde","destinationLiteral","destinationRaw","phrasing","titleApostrophe","titleQuote"]},{character:"'",inConstruct:"titleApostrophe"},{character:"(",inConstruct:"destinationRaw"},{before:"\\]",character:"(",inConstruct:"phrasing",notInConstruct:qn},{atBreak:!0,before:"\\d+",character:")"},{character:")",inConstruct:"destinationRaw"},{atBreak:!0,character:"*",after:`(?:[ 	\r
*])`},{character:"*",inConstruct:"phrasing",notInConstruct:qn},{atBreak:!0,character:"+",after:`(?:[ 	\r
])`},{atBreak:!0,character:"-",after:`(?:[ 	\r
-])`},{atBreak:!0,before:"\\d+",character:".",after:`(?:[ 	\r
]|$)`},{atBreak:!0,character:"<",after:"[!/?A-Za-z]"},{character:"<",after:"[!/?A-Za-z]",inConstruct:"phrasing",notInConstruct:qn},{character:"<",inConstruct:"destinationLiteral"},{character:"<",before:"[( ]",inConstruct:"destinationRaw"},{atBreak:!0,character:"="},{atBreak:!0,character:">"},{character:">",inConstruct:"destinationLiteral"},{atBreak:!0,character:"["},{character:"[",inConstruct:"phrasing",notInConstruct:qn},{character:"[",inConstruct:["label","reference"]},{character:"\\",after:"[\\r\\n]",inConstruct:"phrasing"},{character:"]",inConstruct:["label","reference"]},{atBreak:!0,character:"_"},{character:"_",inConstruct:"phrasing",notInConstruct:qn},{atBreak:!0,character:"`"},{character:"`",inConstruct:["codeFencedLangGraveAccent","codeFencedMetaGraveAccent"]},{character:"`",inConstruct:"phrasing",notInConstruct:qn},{atBreak:!0,character:"~"},{character:"<",inConstruct:"autolink"},{character:">",inConstruct:"autolink"},{character:"\x7F",inConstruct:"autolink"}],qp=-1;for(;++qp<33;)Ga.push({character:String.fromCharCode(qp),inConstruct:"autolink"});function Kp(t){return t.label||!t.identifier?t.label||"":qs(t.identifier)}function Jp(t){if(!t._compiled){let e=(t.atBreak?"[\\r\\n][\\t ]*":"")+(t.before?"(?:"+t.before+")":"");t._compiled=new RegExp((t.beforeNode?"^":e?"("+e+")":"")+(/[$()*+.?[\\\]^{|}]/.test(t.character)?"\\":"")+t.character+(t.afterNode?"$":t.after?"(?:"+t.after+")":""),t.unicode?"gu":"g")}return t._compiled}function Up(t,e,n){let r=e.indexStack,i=t.children||[],o=e.createTracker(n),s=[],l=-1;for(r.push(-1);++l<i.length;){let a=i[l];r[r.length-1]=l,s.push(o.move(e.handle(a,t,e,{before:`
`,after:`
`,...o.current()}))),a.type!=="list"&&(e.bulletLastUsed=void 0),l<i.length-1&&s.push(o.move(i0(a,i[l+1],t,e)))}return r.pop(),s.join("")}function i0(t,e,n,r){let i=r.join.length;for(;i--;){let o=r.join[i](t,e,n,r);if(o===!0||o===1)break;if(typeof o=="number")return`
`.repeat(1+o);if(o===!1)return`

<!---->

`}return`

`}var o0=/\r?\n|\r/g;function Gp(t,e){let n=[],r=0,i=0,o;for(;o=o0.exec(t);)s(t.slice(r,o.index)),n.push(o[0]),r=o.index+o[0].length,i++;return s(t.slice(r)),n.join("");function s(l){n.push(e(l,i,!l))}}var Qa={}.hasOwnProperty;function Xp(t,e,n){let r=(n.before||"")+(e||"")+(n.after||""),i=[],o=[],s={},l=t.stack.includes("autolink"),a=n.before?n.before.length:0,u=r.length-(n.after?n.after.length:0),c=-1;for(;++c<t.unsafe.length;){let p=t.unsafe[c];if(!Js(t.stack,p)||!Qp(p.beforeNode,n.beforeNode)||!Qp(p.afterNode,n.afterNode))continue;let d=t.compilePattern(p),m=p.beforeNode?a:0,y=r.slice(m,p.afterNode?u:void 0),g;for(;g=d.exec(y);){let M=!!(p.before||p.atBreak),w=!!p.after,T=m+g.index+(M?g[1].length:0);Qa.call(s,T)?(s[T].before&&!M&&(s[T].before=!1),s[T].after&&!w&&(s[T].after=!1)):(i.push(T),s[T]={before:M,after:w})}}i.sort(s0);let f=a;for(c=-1;++c<i.length;){let p=i[c];if(!(p<f||p>=u)){if(r.charAt(p)==="_"&&p>0&&Le(r.charCodeAt(p-1))===void 0&&!Qa.call(s,p-1)&&!(p-1===a&&/[*_]/.test(r.charAt(a-1)))){let d=p+1;for(;d<u&&r.charAt(d)==="_";)d++;let m=d-p-1;if(i[c+m]===d-1&&d<r.length&&Le(r.charCodeAt(d))===void 0&&!Qa.call(s,d)&&!(d===u-1&&/[*_]/.test(r.charAt(u)))){c+=m;continue}}if(!(p+1<u&&i[c+1]===p+1&&s[p].after&&!s[p+1].before&&!s[p+1].after||p-1>=a&&i[c-1]===p-1&&s[p].before&&!s[p-1].before&&!s[p-1].after)){if(f!==p){let d=r.slice(f,p);o.push(l?d:Yp(d,"\\"))}f=p+1,l?o.push("%"+r.charCodeAt(p).toString(16).toUpperCase().padStart(2,"0")):/[!-/:-@[-`{-~]/.test(r.charAt(p))&&(!n.encode||!n.encode.includes(r.charAt(p)))?o.push("\\"+r.charAt(p)):o.push(Vr(r.charCodeAt(p)))}}}let h=r.slice(f,u);return o.push(l?h:Yp(h,n.after)),o.join("")}function Qp(t,e){return t?e?typeof t=="string"?t===e.type:t.includes(e.type):!1:!0}function s0(t,e){return t-e}function Yp(t,e){let n=/\\(?=[!-/:-@[-`{-~])/g,r=[],i=[],o=t+e,s=-1,l=0,a;for(;a=n.exec(o);)r.push(a.index);for(;++s<r.length;)l!==r[s]&&i.push(t.slice(l,r[s])),i.push("\\"),l=r[s];return i.push(t.slice(l)),i.join("")}function Zp(t){let e=t||{},n=e.now||{},r=e.lineShift||0,i=n.line||1,o=n.column||1;return{move:a,current:s,shift:l};function s(){return{now:{line:i,column:o},lineShift:r}}function l(u){r+=u}function a(u){let c=u||"",f=c.split(/\r?\n|\r/g),h=f[f.length-1];return i+=f.length-1,o=f.length===1?o+h.length:1+h.length+r,c}}function Ya(t,e){let n=e||{},r={associationId:Kp,bulletCurrent:void 0,bulletLastUsed:void 0,containerPhrasing:c0,containerFlow:f0,createTracker:Zp,compilePattern:Jp,enter:o,handlers:{...bn},handle:void 0,indentLines:Gp,indexStack:[],join:[...Wp],options:{},safe:h0,stack:[],unsafe:[...Ga]};Fa(r,n),r.options.tightDefinitions&&r.join.push(u0),r.handle=pp("type",{invalid:l0,unknown:a0,handlers:r.handlers});let i=r.handle(lo(t)?{type:"root",children:[t]}:t,void 0,r,{before:`
`,after:`
`,now:{line:1,column:1},lineShift:0});return i&&i.charCodeAt(i.length-1)!==10&&i.charCodeAt(i.length-1)!==13&&(i+=`
`),i;function o(s){return r.stack.push(s),l;function l(){r.stack.pop()}}}function l0(t){throw new Error("Cannot handle value `"+t+"`, expected node")}function a0(t){let e=t;throw new Error("Cannot handle unknown node `"+e.type+"`")}function u0(t,e){if(t.type==="definition"&&t.type===e.type)return 0}function c0(t,e){return Np(t,this,e)}function f0(t,e){return Up(t,this,e)}function h0(t,e){return Xp(this,t,e)}function Wr(t){let e=this;e.compiler=n;function n(r){return Ya(r,{...e.data("settings"),...t,extensions:e.data("toMarkdownExtensions")||[]})}}function Xa(t){if(t)throw t}var nl=nb(ad(),1);function fo(t){if(typeof t!="object"||t===null)return!1;let e=Object.getPrototypeOf(t);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in t)&&!(Symbol.iterator in t)}function Za(){let t=[],e={run:n,use:r};return e;function n(...i){let o=-1,s=i.pop();if(typeof s!="function")throw new TypeError("Expected function as last argument, not "+s);l(null,...i);function l(a,...u){let c=t[++o],f=-1;if(a){s(a);return}for(;++f<i.length;)(u[f]===null||u[f]===void 0)&&(u[f]=i[f]);i=u,c?ud(c,l)(...u):s(null,...u)}}function r(i){if(typeof i!="function")throw new TypeError("Expected `middelware` to be a function, not "+i);return t.push(i),e}}function ud(t,e){let n;return r;function r(...s){let l=t.length>s.length,a;l&&s.push(i);try{a=t.apply(this,s)}catch(u){let c=u;if(l&&n)throw c;return i(c)}l||(a&&a.then&&typeof a.then=="function"?a.then(o,i):a instanceof Error?i(a):o(a))}function i(s,...l){n||(n=!0,e(s,...l))}function o(s){i(null,s)}}var qr=class extends Error{constructor(e,n,r){super(),typeof n=="string"&&(r=n,n=void 0);let i="",o={},s=!1;if(n&&("line"in n&&"column"in n?o={place:n}:"start"in n&&"end"in n?o={place:n}:"type"in n?o={ancestors:[n],place:n.position}:o={...n}),typeof e=="string"?i=e:!o.cause&&e&&(s=!0,i=e.message,o.cause=e),!o.ruleId&&!o.source&&typeof r=="string"){let a=r.indexOf(":");a===-1?o.ruleId=r:(o.source=r.slice(0,a),o.ruleId=r.slice(a+1))}if(!o.place&&o.ancestors){let a=o.ancestors[o.ancestors.length-1];a&&(o.place=a.position)}let l=o.place&&"start"in o.place?o.place.start:o.place;this.ancestors=o.ancestors||void 0,this.cause=o.cause||void 0,this.column=l?l.column:void 0,this.fatal=void 0,this.file="",this.message=i,this.line=l?l.line:void 0,this.name=gn(o.place)||"1:1",this.place=o.place||void 0,this.reason=this.message,this.ruleId=o.ruleId||void 0,this.source=o.source||void 0,this.stack=s&&o.cause&&typeof o.cause.stack=="string"?o.cause.stack:"",this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};Object.defineProperties(qr.prototype,{file:{configurable:!0,enumerable:!0,value:"",writable:!0},name:{configurable:!0,enumerable:!0,value:"",writable:!0},reason:{configurable:!0,enumerable:!0,value:"",writable:!0},message:{configurable:!0,enumerable:!0,value:"",writable:!0},stack:{configurable:!0,enumerable:!0,value:"",writable:!0},column:{configurable:!0,enumerable:!0,writable:!0},line:{configurable:!0,enumerable:!0,writable:!0},ancestors:{configurable:!0,enumerable:!0,writable:!0},cause:{configurable:!0,enumerable:!0,writable:!0},fatal:{configurable:!0,enumerable:!0,writable:!0},place:{configurable:!0,enumerable:!0,writable:!0},ruleId:{configurable:!0,enumerable:!0,writable:!0},source:{configurable:!0,enumerable:!0,writable:!0}});var yt={basename:p0,dirname:d0,extname:m0,join:g0,sep:"/"};function p0(t,e){if(e!==void 0&&typeof e!="string")throw new TypeError('"ext" argument must be a string');ho(t);let n=0,r=-1,i=t.length,o;if(e===void 0||e.length===0||e.length>t.length){for(;i--;)if(t.codePointAt(i)===47){if(o){n=i+1;break}}else r<0&&(o=!0,r=i+1);return r<0?"":t.slice(n,r)}if(e===t)return"";let s=-1,l=e.length-1;for(;i--;)if(t.codePointAt(i)===47){if(o){n=i+1;break}}else s<0&&(o=!0,s=i+1),l>-1&&(t.codePointAt(i)===e.codePointAt(l--)?l<0&&(r=i):(l=-1,r=s));return n===r?r=s:r<0&&(r=t.length),t.slice(n,r)}function d0(t){if(ho(t),t.length===0)return".";let e=-1,n=t.length,r;for(;--n;)if(t.codePointAt(n)===47){if(r){e=n;break}}else r||(r=!0);return e<0?t.codePointAt(0)===47?"/":".":e===1&&t.codePointAt(0)===47?"//":t.slice(0,e)}function m0(t){ho(t);let e=t.length,n=-1,r=0,i=-1,o=0,s;for(;e--;){let l=t.codePointAt(e);if(l===47){if(s){r=e+1;break}continue}n<0&&(s=!0,n=e+1),l===46?i<0?i=e:o!==1&&(o=1):i>-1&&(o=-1)}return i<0||n<0||o===0||o===1&&i===n-1&&i===r+1?"":t.slice(i,n)}function g0(...t){let e=-1,n;for(;++e<t.length;)ho(t[e]),t[e]&&(n=n===void 0?t[e]:n+"/"+t[e]);return n===void 0?".":y0(n)}function y0(t){ho(t);let e=t.codePointAt(0)===47,n=k0(t,!e);return n.length===0&&!e&&(n="."),n.length>0&&t.codePointAt(t.length-1)===47&&(n+="/"),e?"/"+n:n}function k0(t,e){let n="",r=0,i=-1,o=0,s=-1,l,a;for(;++s<=t.length;){if(s<t.length)l=t.codePointAt(s);else{if(l===47)break;l=47}if(l===47){if(!(i===s-1||o===1))if(i!==s-1&&o===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(a=n.lastIndexOf("/"),a!==n.length-1){a<0?(n="",r=0):(n=n.slice(0,a),r=n.length-1-n.lastIndexOf("/")),i=s,o=0;continue}}else if(n.length>0){n="",r=0,i=s,o=0;continue}}e&&(n=n.length>0?n+"/..":"..",r=2)}else n.length>0?n+="/"+t.slice(i+1,s):n=t.slice(i+1,s),r=s-i-1;i=s,o=0}else l===46&&o>-1?o++:o=-1}return n}function ho(t){if(typeof t!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(t))}var cd={cwd:x0};function x0(){return"/"}function Kr(t){return!!(t!==null&&typeof t=="object"&&"href"in t&&t.href&&"protocol"in t&&t.protocol&&t.auth===void 0)}function fd(t){if(typeof t=="string")t=new URL(t);else if(!Kr(t)){let e=new TypeError('The "path" argument must be of type string or an instance of URL. Received `'+t+"`");throw e.code="ERR_INVALID_ARG_TYPE",e}if(t.protocol!=="file:"){let e=new TypeError("The URL must be of scheme file");throw e.code="ERR_INVALID_URL_SCHEME",e}return b0(t)}function b0(t){if(t.hostname!==""){let r=new TypeError('File URL host must be "localhost" or empty on darwin');throw r.code="ERR_INVALID_FILE_URL_HOST",r}let e=t.pathname,n=-1;for(;++n<e.length;)if(e.codePointAt(n)===37&&e.codePointAt(n+1)===50){let r=e.codePointAt(n+2);if(r===70||r===102){let i=new TypeError("File URL path must not include encoded / characters");throw i.code="ERR_INVALID_FILE_URL_PATH",i}}return decodeURIComponent(e)}var eu=["history","path","basename","stem","extname","dirname"],po=class{constructor(e){let n;e?Kr(e)?n={path:e}:typeof e=="string"||w0(e)?n={value:e}:n=e:n={},this.cwd="cwd"in n?"":cd.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let r=-1;for(;++r<eu.length;){let o=eu[r];o in n&&n[o]!==void 0&&n[o]!==null&&(this[o]=o==="history"?[...n[o]]:n[o])}let i;for(i in n)eu.includes(i)||(this[i]=n[i])}get basename(){return typeof this.path=="string"?yt.basename(this.path):void 0}set basename(e){nu(e,"basename"),tu(e,"basename"),this.path=yt.join(this.dirname||"",e)}get dirname(){return typeof this.path=="string"?yt.dirname(this.path):void 0}set dirname(e){hd(this.basename,"dirname"),this.path=yt.join(e||"",this.basename)}get extname(){return typeof this.path=="string"?yt.extname(this.path):void 0}set extname(e){if(tu(e,"extname"),hd(this.dirname,"extname"),e){if(e.codePointAt(0)!==46)throw new Error("`extname` must start with `.`");if(e.includes(".",1))throw new Error("`extname` cannot contain multiple dots")}this.path=yt.join(this.dirname,this.stem+(e||""))}get path(){return this.history[this.history.length-1]}set path(e){Kr(e)&&(e=fd(e)),nu(e,"path"),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path=="string"?yt.basename(this.path,this.extname):void 0}set stem(e){nu(e,"stem"),tu(e,"stem"),this.path=yt.join(this.dirname||"",e+(this.extname||""))}fail(e,n,r){let i=this.message(e,n,r);throw i.fatal=!0,i}info(e,n,r){let i=this.message(e,n,r);return i.fatal=void 0,i}message(e,n,r){let i=new qr(e,n,r);return this.path&&(i.name=this.path+":"+i.name,i.file=this.path),i.fatal=!1,this.messages.push(i),i}toString(e){return this.value===void 0?"":typeof this.value=="string"?this.value:new TextDecoder(e||void 0).decode(this.value)}};function tu(t,e){if(t&&t.includes(yt.sep))throw new Error("`"+e+"` cannot be a path: did not expect `"+yt.sep+"`")}function nu(t,e){if(!t)throw new Error("`"+e+"` cannot be empty")}function hd(t,e){if(!t)throw new Error("Setting `"+e+"` requires `path` to be set too")}function w0(t){return!!(t&&typeof t=="object"&&"byteLength"in t&&"byteOffset"in t)}var pd=(function(t){let r=this.constructor.prototype,i=r[t],o=function(){return i.apply(o,arguments)};return Object.setPrototypeOf(o,r),o});var C0={}.hasOwnProperty,su=class t extends pd{constructor(){super("copy"),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=Za()}copy(){let e=new t,n=-1;for(;++n<this.attachers.length;){let r=this.attachers[n];e.use(...r)}return e.data((0,nl.default)(!0,{},this.namespace)),e}data(e,n){return typeof e=="string"?arguments.length===2?(ou("data",this.frozen),this.namespace[e]=n,this):C0.call(this.namespace,e)&&this.namespace[e]||void 0:e?(ou("data",this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[n,...r]=this.attachers[this.freezeIndex];if(r[0]===!1)continue;r[0]===!0&&(r[0]=void 0);let i=n.call(e,...r);typeof i=="function"&&this.transformers.use(i)}return this.frozen=!0,this.freezeIndex=Number.POSITIVE_INFINITY,this}parse(e){this.freeze();let n=tl(e),r=this.parser||this.Parser;return ru("parse",r),r(String(n),n)}process(e,n){let r=this;return this.freeze(),ru("process",this.parser||this.Parser),iu("process",this.compiler||this.Compiler),n?i(void 0,n):new Promise(i);function i(o,s){let l=tl(e),a=r.parse(l);r.run(a,l,function(c,f,h){if(c||!f||!h)return u(c);let p=f,d=r.stringify(p,h);M0(d)?h.value=d:h.result=d,u(c,h)});function u(c,f){c||!f?s(c):o?o(f):n(void 0,f)}}}processSync(e){let n=!1,r;return this.freeze(),ru("processSync",this.parser||this.Parser),iu("processSync",this.compiler||this.Compiler),this.process(e,i),md("processSync","process",n),r;function i(o,s){n=!0,Xa(o),r=s}}run(e,n,r){dd(e),this.freeze();let i=this.transformers;return!r&&typeof n=="function"&&(r=n,n=void 0),r?o(void 0,r):new Promise(o);function o(s,l){let a=tl(n);i.run(e,a,u);function u(c,f,h){let p=f||e;c?l(c):s?s(p):r(void 0,p,h)}}}runSync(e,n){let r=!1,i;return this.run(e,n,o),md("runSync","run",r),i;function o(s,l){Xa(s),i=l,r=!0}}stringify(e,n){this.freeze();let r=tl(n),i=this.compiler||this.Compiler;return iu("stringify",i),dd(e),i(e,r)}use(e,...n){let r=this.attachers,i=this.namespace;if(ou("use",this.frozen),e!=null)if(typeof e=="function")a(e,n);else if(typeof e=="object")Array.isArray(e)?l(e):s(e);else throw new TypeError("Expected usable value, not `"+e+"`");return this;function o(u){if(typeof u=="function")a(u,[]);else if(typeof u=="object")if(Array.isArray(u)){let[c,...f]=u;a(c,f)}else s(u);else throw new TypeError("Expected usable value, not `"+u+"`")}function s(u){if(!("plugins"in u)&&!("settings"in u))throw new Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");l(u.plugins),u.settings&&(i.settings=(0,nl.default)(!0,i.settings,u.settings))}function l(u){let c=-1;if(u!=null)if(Array.isArray(u))for(;++c<u.length;){let f=u[c];o(f)}else throw new TypeError("Expected a list of plugins, not `"+u+"`")}function a(u,c){let f=-1,h=-1;for(;++f<r.length;)if(r[f][0]===u){h=f;break}if(h===-1)r.push([u,...c]);else if(c.length>0){let[p,...d]=c,m=r[h][1];fo(m)&&fo(p)&&(p=(0,nl.default)(!0,m,p)),r[h]=[u,p,...d]}}}},mo=new su().freeze();function ru(t,e){if(typeof e!="function")throw new TypeError("Cannot `"+t+"` without `parser`")}function iu(t,e){if(typeof e!="function")throw new TypeError("Cannot `"+t+"` without `compiler`")}function ou(t,e){if(e)throw new Error("Cannot call `"+t+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function dd(t){if(!fo(t)||typeof t.type!="string")throw new TypeError("Expected node, got `"+t+"`")}function md(t,e,n){if(!n)throw new Error("`"+t+"` finished async. Use `"+e+"` instead")}function tl(t){return S0(t)?t:new po(t)}function S0(t){return!!(t&&typeof t=="object"&&"message"in t&&"messages"in t)}function M0(t){return typeof t=="string"||N0(t)}function N0(t){return!!(t&&typeof t=="object"&&"byteLength"in t&&"byteOffset"in t)}function Ee(t){this.content=t}Ee.prototype={constructor:Ee,find:function(t){for(var e=0;e<this.content.length;e+=2)if(this.content[e]===t)return e;return-1},get:function(t){var e=this.find(t);return e==-1?void 0:this.content[e+1]},update:function(t,e,n){var r=n&&n!=t?this.remove(n):this,i=r.find(t),o=r.content.slice();return i==-1?o.push(n||t,e):(o[i+1]=e,n&&(o[i]=n)),new Ee(o)},remove:function(t){var e=this.find(t);if(e==-1)return this;var n=this.content.slice();return n.splice(e,2),new Ee(n)},addToStart:function(t,e){return new Ee([t,e].concat(this.remove(t).content))},addToEnd:function(t,e){var n=this.remove(t).content.slice();return n.push(t,e),new Ee(n)},addBefore:function(t,e,n){var r=this.remove(e),i=r.content.slice(),o=r.find(t);return i.splice(o==-1?i.length:o,0,e,n),new Ee(i)},forEach:function(t){for(var e=0;e<this.content.length;e+=2)t(this.content[e],this.content[e+1])},prepend:function(t){return t=Ee.from(t),t.size?new Ee(t.content.concat(this.subtract(t).content)):this},append:function(t){return t=Ee.from(t),t.size?new Ee(this.subtract(t).content.concat(t.content)):this},subtract:function(t){var e=this;t=Ee.from(t);for(var n=0;n<t.content.length;n+=2)e=e.remove(t.content[n]);return e},toObject:function(){var t={};return this.forEach(function(e,n){t[e]=n}),t},get size(){return this.content.length>>1}};Ee.from=function(t){if(t instanceof Ee)return t;var e=[];if(t)for(var n in t)e.push(n,t[n]);return new Ee(e)};var lu=Ee;function Td(t,e,n){for(let r=0;;r++){if(r==t.childCount||r==e.childCount)return t.childCount==e.childCount?null:n;let i=t.child(r),o=e.child(r);if(i==o){n+=i.nodeSize;continue}if(!i.sameMarkup(o))return n;if(i.isText&&i.text!=o.text){let s=i.text,l=o.text,a=0;for(;s[a]==l[a];a++)n++;return a&&a<s.length&&a<l.length&&Ed(s.charCodeAt(a-1))&&vd(s.charCodeAt(a))&&n--,n}if(i.content.size||o.content.size){let s=Td(i.content,o.content,n+1);if(s!=null)return s}n+=i.nodeSize}}function Ad(t,e,n,r){for(let i=t.childCount,o=e.childCount;;){if(i==0||o==0)return i==o?null:{a:n,b:r};let s=t.child(--i),l=e.child(--o),a=s.nodeSize;if(s==l){n-=a,r-=a;continue}if(!s.sameMarkup(l))return{a:n,b:r};if(s.isText&&s.text!=l.text){let u=s.text,c=l.text,f=u.length,h=c.length;for(;f>0&&h>0&&u[f-1]==c[h-1];)f--,h--,n--,r--;return f&&h&&f<u.length&&Ed(u.charCodeAt(f-1))&&vd(u.charCodeAt(f))&&(n++,r++),{a:n,b:r}}if(s.content.size||l.content.size){let u=Ad(s.content,l.content,n-1,r-1);if(u)return u}n-=a,r-=a}}function vd(t){return t>=56320&&t<57344}function Ed(t){return t>=55296&&t<56320}var A=class t{constructor(e,n){if(this.content=e,this.size=n||0,n==null)for(let r=0;r<e.length;r++)this.size+=e[r].nodeSize}nodesBetween(e,n,r,i=0,o){for(let s=0,l=0;l<n;s++){let a=this.content[s],u=l+a.nodeSize;if(u>e&&r(a,i+l,o||null,s)!==!1&&a.content.size){let c=l+1;a.nodesBetween(Math.max(0,e-c),Math.min(a.content.size,n-c),r,i+c)}l=u}}descendants(e){this.nodesBetween(0,this.size,e)}textBetween(e,n,r,i){let o="",s=!0;return this.nodesBetween(e,n,(l,a)=>{let u=l.isText?l.text.slice(Math.max(e,a)-a,n-a):l.isLeaf?i?typeof i=="function"?i(l):i:l.type.spec.leafText?l.type.spec.leafText(l):"":"";l.isBlock&&(l.isLeaf&&u||l.isTextblock)&&r&&(s?s=!1:o+=r),o+=u},0),o}append(e){if(!e.size)return this;if(!this.size)return e;let n=this.lastChild,r=e.firstChild,i=this.content.slice(),o=0;for(n.isText&&n.sameMarkup(r)&&(i[i.length-1]=n.withText(n.text+r.text),o=1);o<e.content.length;o++)i.push(e.content[o]);return new t(i,this.size+e.size)}cut(e,n=this.size){if(e==0&&n==this.size)return this;let r=[],i=0;if(n>e)for(let o=0,s=0;s<n;o++){let l=this.content[o],a=s+l.nodeSize;a>e&&((s<e||a>n)&&(l.isText?l=l.cut(Math.max(0,e-s),Math.min(l.text.length,n-s)):l=l.cut(Math.max(0,e-s-1),Math.min(l.content.size,n-s-1))),r.push(l),i+=l.nodeSize),s=a}return new t(r,i)}cutByIndex(e,n){return e==n?t.empty:e==0&&n==this.content.length?this:new t(this.content.slice(e,n))}replaceChild(e,n){let r=this.content[e];if(r==n)return this;let i=this.content.slice(),o=this.size+n.nodeSize-r.nodeSize;return i[e]=n,new t(i,o)}addToStart(e){return new t([e].concat(this.content),this.size+e.nodeSize)}addToEnd(e){return new t(this.content.concat(e),this.size+e.nodeSize)}eq(e){if(this.content.length!=e.content.length)return!1;for(let n=0;n<this.content.length;n++)if(!this.content[n].eq(e.content[n]))return!1;return!0}get firstChild(){return this.content.length?this.content[0]:null}get lastChild(){return this.content.length?this.content[this.content.length-1]:null}get childCount(){return this.content.length}child(e){let n=this.content[e];if(!n)throw new RangeError("Index "+e+" out of range for "+this);return n}maybeChild(e){return this.content[e]||null}forEach(e){for(let n=0,r=0;n<this.content.length;n++){let i=this.content[n];e(i,r,n),r+=i.nodeSize}}findDiffStart(e,n=0){return Td(this,e,n)}findDiffEnd(e,n=this.size,r=e.size){return Ad(this,e,n,r)}findIndex(e){if(e==0)return rl(0,e);if(e==this.size)return rl(this.content.length,e);if(e>this.size||e<0)throw new RangeError(`Position ${e} outside of fragment (${this})`);for(let n=0,r=0;;n++){let i=this.child(n),o=r+i.nodeSize;if(o>=e)return o==e?rl(n+1,o):rl(n,r);r=o}}toString(){return"<"+this.toStringInner()+">"}toStringInner(){return this.content.join(", ")}toJSON(){return this.content.length?this.content.map(e=>e.toJSON()):null}static fromJSON(e,n){if(!n)return t.empty;if(!Array.isArray(n))throw new RangeError("Invalid input for Fragment.fromJSON");return t.fromArray(n.map(e.nodeFromJSON))}static fromArray(e){if(!e.length)return t.empty;let n,r=0;for(let i=0;i<e.length;i++){let o=e[i];r+=o.nodeSize,i&&o.isText&&e[i-1].sameMarkup(o)?(n||(n=e.slice(0,i)),n[n.length-1]=o.withText(n[n.length-1].text+o.text)):n&&n.push(o)}return new t(n||e,r)}static from(e){if(!e)return t.empty;if(e instanceof t)return e;if(Array.isArray(e))return this.fromArray(e);if(e.attrs)return new t([e],e.nodeSize);throw new RangeError("Can not convert "+e+" to a Fragment"+(e.nodesBetween?" (looks like multiple versions of prosemirror-model were loaded)":""))}};A.empty=new A([],0);var au={index:0,offset:0};function rl(t,e){return au.index=t,au.offset=e,au}function sl(t,e){if(t===e)return!0;if(!(t&&typeof t=="object")||!(e&&typeof e=="object"))return!1;let n=Array.isArray(t);if(Array.isArray(e)!=n)return!1;if(n){if(t.length!=e.length)return!1;for(let r=0;r<t.length;r++)if(!sl(t[r],e[r]))return!1}else{for(let r in t)if(!(r in e)||!sl(t[r],e[r]))return!1;for(let r in e)if(!(r in t))return!1}return!0}var Z=class t{constructor(e,n){this.type=e,this.attrs=n}addToSet(e){let n,r=!1;for(let i=0;i<e.length;i++){let o=e[i];if(this.eq(o))return e;if(this.type.excludes(o.type))n||(n=e.slice(0,i));else{if(o.type.excludes(this.type))return e;!r&&o.type.rank>this.type.rank&&(n||(n=e.slice(0,i)),n.push(this),r=!0),n&&n.push(o)}}return n||(n=e.slice()),r||n.push(this),n}removeFromSet(e){for(let n=0;n<e.length;n++)if(this.eq(e[n]))return e.slice(0,n).concat(e.slice(n+1));return e}isInSet(e){for(let n=0;n<e.length;n++)if(this.eq(e[n]))return!0;return!1}eq(e){return this==e||this.type==e.type&&sl(this.attrs,e.attrs)}toJSON(){let e={type:this.type.name};for(let n in this.attrs){e.attrs=this.attrs;break}return e}static fromJSON(e,n){if(!n)throw new RangeError("Invalid input for Mark.fromJSON");let r=e.marks[n.type];if(!r)throw new RangeError(`There is no mark type ${n.type} in this schema`);return r.create(n.attrs)}static sameSet(e,n){if(e==n)return!0;if(e.length!=n.length)return!1;for(let r=0;r<e.length;r++)if(!e[r].eq(n[r]))return!1;return!0}static setFrom(e){if(!e||Array.isArray(e)&&e.length==0)return t.none;if(e instanceof t)return[e];let n=e.slice();return n.sort((r,i)=>r.type.rank-i.type.rank),n}};Z.none=[];var wn=class extends Error{},E=class t{constructor(e,n,r){this.content=e,this.openStart=n,this.openEnd=r}get size(){return this.content.size-this.openStart-this.openEnd}insertAt(e,n){let r=Rd(this.content,e+this.openStart,n,this.openStart+1,this.openEnd+1);return r&&new t(r,this.openStart,this.openEnd)}removeBetween(e,n){return new t(Od(this.content,e+this.openStart,n+this.openStart),this.openStart,this.openEnd)}eq(e){return this.content.eq(e.content)&&this.openStart==e.openStart&&this.openEnd==e.openEnd}toString(){return this.content+"("+this.openStart+","+this.openEnd+")"}toJSON(){if(!this.content.size)return null;let e={content:this.content.toJSON()};return this.openStart>0&&(e.openStart=this.openStart),this.openEnd>0&&(e.openEnd=this.openEnd),e}static fromJSON(e,n){if(!n)return t.empty;let r=n.openStart||0,i=n.openEnd||0;if(typeof r!="number"||typeof i!="number")throw new RangeError("Invalid input for Slice.fromJSON");return new t(A.fromJSON(e,n.content),r,i)}static maxOpen(e,n=!0){let r=0,i=0;for(let o=e.firstChild;o&&!o.isLeaf&&(n||!o.type.spec.isolating);o=o.firstChild)r++;for(let o=e.lastChild;o&&!o.isLeaf&&(n||!o.type.spec.isolating);o=o.lastChild)i++;return new t(e,r,i)}};E.empty=new E(A.empty,0,0);function Od(t,e,n){let{index:r,offset:i}=t.findIndex(e),o=t.maybeChild(r),{index:s,offset:l}=t.findIndex(n);if(i==e||o.isText){if(l!=n&&!t.child(s).isText)throw new RangeError("Removing non-flat range");return t.cut(0,e).append(t.cut(n))}if(r!=s)throw new RangeError("Removing non-flat range");return t.replaceChild(r,o.copy(Od(o.content,e-i-1,n-i-1)))}function Rd(t,e,n,r,i,o){let{index:s,offset:l}=t.findIndex(e),a=t.maybeChild(s);if(l==e||a.isText)return o&&r<=0&&i<=0&&!o.canReplace(s,s,n)?null:t.cut(0,e).append(n).append(t.cut(e));let u=Rd(a.content,e-l-1,n,s==0?r-1:0,s==t.childCount-1?i-1:0,a);return u&&t.replaceChild(s,a.copy(u))}function I0(t,e,n){if(n.openStart>t.depth)throw new wn("Inserted content deeper than insertion position");if(t.depth-n.openStart!=e.depth-n.openEnd)throw new wn("Inconsistent open depths");return Dd(t,e,n,0)}function Dd(t,e,n,r){let i=t.index(r),o=t.node(r);if(i==e.index(r)&&r<t.depth-n.openStart){let s=Dd(t,e,n,r+1);return o.copy(o.content.replaceChild(i,s))}else if(n.content.size)if(!n.openStart&&!n.openEnd&&t.depth==r&&e.depth==r){let s=t.parent,l=s.content;return Jn(s,l.cut(0,t.parentOffset).append(n.content).append(l.cut(e.parentOffset)))}else{let{start:s,end:l}=T0(n,t);return Jn(o,Ld(t,s,l,e,r))}else return Jn(o,ll(t,e,r))}function Pd(t,e){if(!e.type.compatibleContent(t.type))throw new wn("Cannot join "+e.type.name+" onto "+t.type.name)}function uu(t,e,n){let r=t.node(n);return Pd(r,e.node(n)),r}function Kn(t,e){let n=e.length-1;n>=0&&t.isText&&t.sameMarkup(e[n])?e[n]=t.withText(e[n].text+t.text):e.push(t)}function go(t,e,n,r){let i=(e||t).node(n),o=0,s=e?e.index(n):i.childCount;t&&(o=t.index(n),t.depth>n?o++:t.textOffset&&(Kn(t.nodeAfter,r),o++));for(let l=o;l<s;l++)Kn(i.child(l),r);e&&e.depth==n&&e.textOffset&&Kn(e.nodeBefore,r)}function Jn(t,e){if(!t.type.validContent(e))throw new wn("Invalid content for node "+t.type.name);return t.copy(e)}function Ld(t,e,n,r,i){let o=t.depth>i&&uu(t,e,i+1),s=r.depth>i&&uu(n,r,i+1),l=[];return go(null,t,i,l),o&&s&&e.index(i)==n.index(i)?(Pd(o,s),Kn(Jn(o,Ld(t,e,n,r,i+1)),l)):(o&&Kn(Jn(o,ll(t,e,i+1)),l),go(e,n,i,l),s&&Kn(Jn(s,ll(n,r,i+1)),l)),go(r,null,i,l),new A(l)}function ll(t,e,n){let r=[];if(go(null,t,n,r),t.depth>n){let i=uu(t,e,n+1);Kn(Jn(i,ll(t,e,n+1)),r)}return go(e,null,n,r),new A(r)}function T0(t,e){let n=e.depth-t.openStart,i=e.node(n).copy(t.content);for(let o=n-1;o>=0;o--)i=e.node(o).copy(A.from(i));return{start:i.resolveNoCache(t.openStart+n),end:i.resolveNoCache(i.content.size-t.openEnd-n)}}var al=class t{constructor(e,n,r){this.pos=e,this.path=n,this.parentOffset=r,this.depth=n.length/3-1}resolveDepth(e){return e==null?this.depth:e<0?this.depth+e:e}get parent(){return this.node(this.depth)}get doc(){return this.node(0)}node(e){return this.path[this.resolveDepth(e)*3]}index(e){return this.path[this.resolveDepth(e)*3+1]}indexAfter(e){return e=this.resolveDepth(e),this.index(e)+(e==this.depth&&!this.textOffset?0:1)}start(e){return e=this.resolveDepth(e),e==0?0:this.path[e*3-1]+1}end(e){return e=this.resolveDepth(e),this.start(e)+this.node(e).content.size}before(e){if(e=this.resolveDepth(e),!e)throw new RangeError("There is no position before the top-level node");return e==this.depth+1?this.pos:this.path[e*3-1]}after(e){if(e=this.resolveDepth(e),!e)throw new RangeError("There is no position after the top-level node");return e==this.depth+1?this.pos:this.path[e*3-1]+this.path[e*3].nodeSize}get textOffset(){return this.pos-this.path[this.path.length-1]}get nodeAfter(){let e=this.parent,n=this.index(this.depth);if(n==e.childCount)return null;let r=this.pos-this.path[this.path.length-1],i=e.child(n);return r?e.child(n).cut(r):i}get nodeBefore(){let e=this.index(this.depth),n=this.pos-this.path[this.path.length-1];return n?this.parent.child(e).cut(0,n):e==0?null:this.parent.child(e-1)}posAtIndex(e,n){n=this.resolveDepth(n);let r=this.path[n*3],i=n==0?0:this.path[n*3-1]+1;for(let o=0;o<e;o++)i+=r.child(o).nodeSize;return i}marks(){let e=this.parent,n=this.index();if(e.content.size==0)return Z.none;if(this.textOffset)return e.child(n).marks;let r=e.maybeChild(n-1),i=e.maybeChild(n);if(!r){let l=r;r=i,i=l}let o=r.marks;for(var s=0;s<o.length;s++)o[s].type.spec.inclusive===!1&&(!i||!o[s].isInSet(i.marks))&&(o=o[s--].removeFromSet(o));return o}marksAcross(e){let n=this.parent.maybeChild(this.index());if(!n||!n.isInline)return null;let r=n.marks,i=e.parent.maybeChild(e.index());for(var o=0;o<r.length;o++)r[o].type.spec.inclusive===!1&&(!i||!r[o].isInSet(i.marks))&&(r=r[o--].removeFromSet(r));return r}sharedDepth(e){for(let n=this.depth;n>0;n--)if(this.start(n)<=e&&this.end(n)>=e)return n;return 0}blockRange(e=this,n){if(e.pos<this.pos)return e.blockRange(this);for(let r=this.depth-(this.parent.inlineContent||this.pos==e.pos?1:0);r>=0;r--)if(e.pos<=this.end(r)&&(!n||n(this.node(r))))return new ko(this,e,r);return null}sameParent(e){return this.pos-this.parentOffset==e.pos-e.parentOffset}max(e){return e.pos>this.pos?e:this}min(e){return e.pos<this.pos?e:this}toString(){let e="";for(let n=1;n<=this.depth;n++)e+=(e?"/":"")+this.node(n).type.name+"_"+this.index(n-1);return e+":"+this.parentOffset}static resolve(e,n){if(!(n>=0&&n<=e.content.size))throw new RangeError("Position "+n+" out of range");let r=[],i=0,o=n;for(let s=e;;){let{index:l,offset:a}=s.content.findIndex(o),u=o-a;if(r.push(s,l,i+a),!u||(s=s.child(l),s.isText))break;o=u-1,i+=a+1}return new t(n,r,o)}static resolveCached(e,n){let r=gd.get(e);if(r)for(let o=0;o<r.elts.length;o++){let s=r.elts[o];if(s.pos==n)return s}else gd.set(e,r=new cu);let i=r.elts[r.i]=t.resolve(e,n);return r.i=(r.i+1)%A0,i}},cu=class{constructor(){this.elts=[],this.i=0}},A0=12,gd=new WeakMap,ko=class{constructor(e,n,r){this.$from=e,this.$to=n,this.depth=r}get start(){return this.$from.before(this.depth+1)}get end(){return this.$to.after(this.depth+1)}get parent(){return this.$from.node(this.depth)}get startIndex(){return this.$from.index(this.depth)}get endIndex(){return this.$to.indexAfter(this.depth)}},v0=Object.create(null),We=class t{constructor(e,n,r,i=Z.none){this.type=e,this.attrs=n,this.marks=i,this.content=r||A.empty}get children(){return this.content.content}get nodeSize(){return this.isLeaf?1:2+this.content.size}get childCount(){return this.content.childCount}child(e){return this.content.child(e)}maybeChild(e){return this.content.maybeChild(e)}forEach(e){this.content.forEach(e)}nodesBetween(e,n,r,i=0){this.content.nodesBetween(e,n,r,i,this)}descendants(e){this.nodesBetween(0,this.content.size,e)}get textContent(){return this.isLeaf&&this.type.spec.leafText?this.type.spec.leafText(this):this.textBetween(0,this.content.size,"")}textBetween(e,n,r,i){return this.content.textBetween(e,n,r,i)}get firstChild(){return this.content.firstChild}get lastChild(){return this.content.lastChild}eq(e){return this==e||this.sameMarkup(e)&&this.content.eq(e.content)}sameMarkup(e){return this.hasMarkup(e.type,e.attrs,e.marks)}hasMarkup(e,n,r){return this.type==e&&sl(this.attrs,n||e.defaultAttrs||v0)&&Z.sameSet(this.marks,r||Z.none)}copy(e=null){return e==this.content?this:new t(this.type,this.attrs,e,this.marks)}mark(e){return e==this.marks?this:new t(this.type,this.attrs,this.content,e)}cut(e,n=this.content.size){return e==0&&n==this.content.size?this:this.copy(this.content.cut(e,n))}slice(e,n=this.content.size,r=!1){if(e==n)return E.empty;let i=this.resolve(e),o=this.resolve(n),s=r?0:i.sharedDepth(n),l=i.start(s),u=i.node(s).content.cut(i.pos-l,o.pos-l);return new E(u,i.depth-s,o.depth-s)}replace(e,n,r){return I0(this.resolve(e),this.resolve(n),r)}nodeAt(e){for(let n=this;;){let{index:r,offset:i}=n.content.findIndex(e);if(n=n.maybeChild(r),!n)return null;if(i==e||n.isText)return n;e-=i+1}}childAfter(e){let{index:n,offset:r}=this.content.findIndex(e);return{node:this.content.maybeChild(n),index:n,offset:r}}childBefore(e){if(e==0)return{node:null,index:0,offset:0};let{index:n,offset:r}=this.content.findIndex(e);if(r<e)return{node:this.content.child(n),index:n,offset:r};let i=this.content.child(n-1);return{node:i,index:n-1,offset:r-i.nodeSize}}resolve(e){return al.resolveCached(this,e)}resolveNoCache(e){return al.resolve(this,e)}rangeHasMark(e,n,r){let i=!1;return n>e&&this.nodesBetween(e,n,o=>(r.isInSet(o.marks)&&(i=!0),!i)),i}get isBlock(){return this.type.isBlock}get isTextblock(){return this.type.isTextblock}get inlineContent(){return this.type.inlineContent}get isInline(){return this.type.isInline}get isText(){return this.type.isText}get isLeaf(){return this.type.isLeaf}get isAtom(){return this.type.isAtom}toString(){if(this.type.spec.toDebugString)return this.type.spec.toDebugString(this);let e=this.type.name;return this.content.size&&(e+="("+this.content.toStringInner()+")"),zd(this.marks,e)}contentMatchAt(e){let n=this.type.contentMatch.matchFragment(this.content,0,e);if(!n)throw new Error("Called contentMatchAt on a node with invalid content");return n}canReplace(e,n,r=A.empty,i=0,o=r.childCount){let s=this.contentMatchAt(e).matchFragment(r,i,o),l=s&&s.matchFragment(this.content,n);if(!l||!l.validEnd)return!1;for(let a=i;a<o;a++)if(!this.type.allowsMarks(r.child(a).marks))return!1;return!0}canReplaceWith(e,n,r,i){if(i&&!this.type.allowsMarks(i))return!1;let o=this.contentMatchAt(e).matchType(r),s=o&&o.matchFragment(this.content,n);return s?s.validEnd:!1}canAppend(e){return e.content.size?this.canReplace(this.childCount,this.childCount,e.content):this.type.compatibleContent(e.type)}check(){this.type.checkContent(this.content),kd(this.type.attrs,this.attrs,"node",this.type.name);let e=Z.none;for(let n=0;n<this.marks.length;n++){let r=this.marks[n];kd(r.type.attrs,r.attrs,"mark",r.type.name),e=r.addToSet(e)}if(!Z.sameSet(e,this.marks))throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map(n=>n.type.name)}`);this.content.forEach(n=>n.check())}toJSON(){let e={type:this.type.name};for(let n in this.attrs){e.attrs=this.attrs;break}return this.content.size&&(e.content=this.content.toJSON()),this.marks.length&&(e.marks=this.marks.map(n=>n.toJSON())),e}static fromJSON(e,n){if(!n)throw new RangeError("Invalid input for Node.fromJSON");let r;if(n.marks){if(!Array.isArray(n.marks))throw new RangeError("Invalid mark data for Node.fromJSON");r=n.marks.map(e.markFromJSON)}if(n.type=="text"){if(typeof n.text!="string")throw new RangeError("Invalid text node in JSON");return e.text(n.text,r)}let i=A.fromJSON(e,n.content);return e.nodeType(n.type).create(n.attrs,i,r)}};We.prototype.text=void 0;var yd=(()=>{let{stack:t}=new Error("/");if(!t||!/\n\s*at\s/.test(t))return n=>n;let e=Object.create(null);return n=>(e[n],n)})(),fu=class t extends We{constructor(e,n,r,i){if(super(e,n,null,i),!r)throw new RangeError("Empty text nodes are not allowed");this.text=r}toString(){return this.type.spec.toDebugString?this.type.spec.toDebugString(this):zd(this.marks,JSON.stringify(this.text))}get textContent(){return this.text}textBetween(e,n){return yd(this.text.slice(e,n))}get nodeSize(){return this.text.length}mark(e){return e==this.marks?this:new t(this.type,this.attrs,this.text,e)}withText(e){return e==this.text?this:new t(this.type,this.attrs,e,this.marks)}cut(e=0,n=this.text.length){return e==0&&n==this.text.length?this:this.withText(yd(this.text.slice(e,n)))}eq(e){return this.sameMarkup(e)&&this.text==e.text}toJSON(){let e=super.toJSON();return e.text=this.text,e}};function zd(t,e){for(let n=t.length-1;n>=0;n--)e=t[n].type.name+"("+e+")";return e}function kd(t,e,n,r){for(let i in e)if(!(i in t))throw new RangeError(`Unsupported attribute ${i} for ${n} of type ${r}`);for(let i in t)t[i].validate&&t[i].validate(e[i])}var Un=class t{constructor(e){this.validEnd=e,this.next=[],this.wrapCache=[]}static parse(e,n){let r=new hu(e,n);if(r.next==null)return t.empty;let i=Bd(r);r.next&&r.err("Unexpected trailing text");let o=z0(L0(i));return B0(o,r),o}matchType(e){for(let n=0;n<this.next.length;n++)if(this.next[n].type==e)return this.next[n].next;return null}matchFragment(e,n=0,r=e.childCount){let i=this;for(let o=n;i&&o<r;o++)i=i.matchType(e.child(o).type);return i}get inlineContent(){return this.next.length!=0&&this.next[0].type.isInline}get defaultType(){for(let e=0;e<this.next.length;e++){let{type:n}=this.next[e];if(!(n.isText||n.hasRequiredAttrs()))return n}return null}compatible(e){for(let n=0;n<this.next.length;n++)for(let r=0;r<e.next.length;r++)if(this.next[n].type==e.next[r].type)return!0;return!1}fillBefore(e,n=!1,r=0){let i=[this];function o(s,l){let a=s.matchFragment(e,r);if(a&&(!n||a.validEnd))return A.from(l.map(u=>u.createAndFill()));for(let u=0;u<s.next.length;u++){let{type:c,next:f}=s.next[u];if(!(c.isText||c.hasRequiredAttrs())&&i.indexOf(f)==-1){i.push(f);let h=o(f,l.concat(c));if(h)return h}}return null}return o(this,[])}findWrapping(e){for(let r=0;r<this.wrapCache.length;r+=2)if(this.wrapCache[r]==e)return this.wrapCache[r+1];let n=this.computeWrapping(e);return this.wrapCache.push(e,n),n}computeWrapping(e){let n=Object.create(null),r=[{match:this,type:null,via:null}];for(;r.length;){let i=r.shift(),o=i.match;if(o.matchType(e)){let s=[];for(let l=i;l.type;l=l.via)s.push(l.type);return s.reverse()}for(let s=0;s<o.next.length;s++){let{type:l,next:a}=o.next[s];!l.isLeaf&&!l.hasRequiredAttrs()&&!(l.name in n)&&(!i.type||a.validEnd)&&(r.push({match:l.contentMatch,type:l,via:i}),n[l.name]=!0)}}return null}get edgeCount(){return this.next.length}edge(e){if(e>=this.next.length)throw new RangeError(`There's no ${e}th edge in this content match`);return this.next[e]}toString(){let e=[];function n(r){e.push(r);for(let i=0;i<r.next.length;i++)e.indexOf(r.next[i].next)==-1&&n(r.next[i].next)}return n(this),e.map((r,i)=>{let o=i+(r.validEnd?"*":" ")+" ";for(let s=0;s<r.next.length;s++)o+=(s?", ":"")+r.next[s].type.name+"->"+e.indexOf(r.next[s].next);return o}).join(`
`)}};Un.empty=new Un(!0);var hu=class{constructor(e,n){this.string=e,this.nodeTypes=n,this.inline=null,this.pos=0,this.tokens=e.split(/\s*(?=\b|\W|$)/),this.tokens[this.tokens.length-1]==""&&this.tokens.pop(),this.tokens[0]==""&&this.tokens.shift()}get next(){return this.tokens[this.pos]}eat(e){return this.next==e&&(this.pos++||!0)}err(e){throw new SyntaxError(e+" (in content expression '"+this.string+"')")}};function Bd(t){let e=[];do e.push(E0(t));while(t.eat("|"));return e.length==1?e[0]:{type:"choice",exprs:e}}function E0(t){let e=[];do e.push(O0(t));while(t.next&&t.next!=")"&&t.next!="|");return e.length==1?e[0]:{type:"seq",exprs:e}}function O0(t){let e=P0(t);for(;;)if(t.eat("+"))e={type:"plus",expr:e};else if(t.eat("*"))e={type:"star",expr:e};else if(t.eat("?"))e={type:"opt",expr:e};else if(t.eat("{"))e=R0(t,e);else break;return e}function xd(t){/\D/.test(t.next)&&t.err("Expected number, got '"+t.next+"'");let e=Number(t.next);return t.pos++,e}function R0(t,e){let n=xd(t),r=n;return t.eat(",")&&(t.next!="}"?r=xd(t):r=-1),t.eat("}")||t.err("Unclosed braced range"),{type:"range",min:n,max:r,expr:e}}function D0(t,e){let n=t.nodeTypes,r=n[e];if(r)return[r];let i=[];for(let o in n){let s=n[o];s.isInGroup(e)&&i.push(s)}return i.length==0&&t.err("No node type or group '"+e+"' found"),i}function P0(t){if(t.eat("(")){let e=Bd(t);return t.eat(")")||t.err("Missing closing paren"),e}else if(/\W/.test(t.next))t.err("Unexpected token '"+t.next+"'");else{let e=D0(t,t.next).map(n=>(t.inline==null?t.inline=n.isInline:t.inline!=n.isInline&&t.err("Mixing inline and block content"),{type:"name",value:n}));return t.pos++,e.length==1?e[0]:{type:"choice",exprs:e}}}function L0(t){let e=[[]];return i(o(t,0),n()),e;function n(){return e.push([])-1}function r(s,l,a){let u={term:a,to:l};return e[s].push(u),u}function i(s,l){s.forEach(a=>a.to=l)}function o(s,l){if(s.type=="choice")return s.exprs.reduce((a,u)=>a.concat(o(u,l)),[]);if(s.type=="seq")for(let a=0;;a++){let u=o(s.exprs[a],l);if(a==s.exprs.length-1)return u;i(u,l=n())}else if(s.type=="star"){let a=n();return r(l,a),i(o(s.expr,a),a),[r(a)]}else if(s.type=="plus"){let a=n();return i(o(s.expr,l),a),i(o(s.expr,a),a),[r(a)]}else{if(s.type=="opt")return[r(l)].concat(o(s.expr,l));if(s.type=="range"){let a=l;for(let u=0;u<s.min;u++){let c=n();i(o(s.expr,a),c),a=c}if(s.max==-1)i(o(s.expr,a),a);else for(let u=s.min;u<s.max;u++){let c=n();r(a,c),i(o(s.expr,a),c),a=c}return[r(a)]}else{if(s.type=="name")return[r(l,void 0,s.value)];throw new Error("Unknown expr type")}}}}function Fd(t,e){return e-t}function bd(t,e){let n=[];return r(e),n.sort(Fd);function r(i){let o=t[i];if(o.length==1&&!o[0].term)return r(o[0].to);n.push(i);for(let s=0;s<o.length;s++){let{term:l,to:a}=o[s];!l&&n.indexOf(a)==-1&&r(a)}}}function z0(t){let e=Object.create(null);return n(bd(t,0));function n(r){let i=[];r.forEach(s=>{t[s].forEach(({term:l,to:a})=>{if(!l)return;let u;for(let c=0;c<i.length;c++)i[c][0]==l&&(u=i[c][1]);bd(t,a).forEach(c=>{u||i.push([l,u=[]]),u.indexOf(c)==-1&&u.push(c)})})});let o=e[r.join(",")]=new Un(r.indexOf(t.length-1)>-1);for(let s=0;s<i.length;s++){let l=i[s][1].sort(Fd);o.next.push({type:i[s][0],next:e[l.join(",")]||n(l)})}return o}}function B0(t,e){for(let n=0,r=[t];n<r.length;n++){let i=r[n],o=!i.validEnd,s=[];for(let l=0;l<i.next.length;l++){let{type:a,next:u}=i.next[l];s.push(a.name),o&&!(a.isText||a.hasRequiredAttrs())&&(o=!1),r.indexOf(u)==-1&&r.push(u)}o&&e.err("Only non-generatable nodes ("+s.join(", ")+") in a required position (see https://prosemirror.net/docs/guide/#generatable)")}}function _d(t){let e=Object.create(null);for(let n in t){let r=t[n];if(!r.hasDefault)return null;e[n]=r.default}return e}function $d(t,e){let n=Object.create(null);for(let r in t){let i=t[r],o=e&&e[r];if(o===void 0)if(i.hasDefault)o=i.default;else throw new RangeError("No value supplied for attribute "+r);else i.validate&&i.validate(o);n[r]=o}return n}function Vd(t,e){let n=Object.create(null);if(e)for(let r in e)n[r]=new pu(t,r,e[r]);return n}var Ot=class t{constructor(e,n,r){this.name=e,this.schema=n,this.spec=r,this.markSet=null,this.groups=r.group?r.group.split(" "):[],this.attrs=Vd(e,r.attrs),this.defaultAttrs=_d(this.attrs),this.contentMatch=null,this.inlineContent=null,this.isBlock=!(r.inline||e=="text"),this.isText=e=="text"}get isInline(){return!this.isBlock}get isTextblock(){return this.isBlock&&this.inlineContent}get isLeaf(){return this.contentMatch==Un.empty}get isAtom(){return this.isLeaf||!!this.spec.atom}isInGroup(e){return this.groups.indexOf(e)>-1}get whitespace(){return this.spec.whitespace||(this.spec.code?"pre":"normal")}hasRequiredAttrs(){for(let e in this.attrs)if(this.attrs[e].isRequired)return!0;return!1}compatibleContent(e){return this==e||this.contentMatch.compatible(e.contentMatch)}computeAttrs(e){return!e&&this.defaultAttrs?this.defaultAttrs:$d(this.attrs,e)}create(e=null,n,r){if(this.isText)throw new Error("NodeType.create can't construct text nodes");return new We(this,this.computeAttrs(e),A.from(n),Z.setFrom(r))}createChecked(e=null,n,r){return n=A.from(n),this.checkContent(n),new We(this,this.computeAttrs(e),n,Z.setFrom(r))}createAndFill(e=null,n,r){if(e=this.computeAttrs(e),n=A.from(n),n.size){let s=this.contentMatch.fillBefore(n);if(!s)return null;n=s.append(n)}let i=this.contentMatch.matchFragment(n),o=i&&i.fillBefore(A.empty,!0);return o?new We(this,e,n.append(o),Z.setFrom(r)):null}validContent(e){let n=this.contentMatch.matchFragment(e);if(!n||!n.validEnd)return!1;for(let r=0;r<e.childCount;r++)if(!this.allowsMarks(e.child(r).marks))return!1;return!0}checkContent(e){if(!this.validContent(e))throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0,50)}`)}checkAttrs(e){}allowsMarkType(e){return this.markSet==null||this.markSet.indexOf(e)>-1}allowsMarks(e){if(this.markSet==null)return!0;for(let n=0;n<e.length;n++)if(!this.allowsMarkType(e[n].type))return!1;return!0}allowedMarks(e){if(this.markSet==null)return e;let n;for(let r=0;r<e.length;r++)this.allowsMarkType(e[r].type)?n&&n.push(e[r]):n||(n=e.slice(0,r));return n?n.length?n:Z.none:e}static compile(e,n){let r=Object.create(null);e.forEach((o,s)=>r[o]=new t(o,n,s));let i=n.spec.topNode||"doc";if(!r[i])throw new RangeError("Schema is missing its top node type ('"+i+"')");if(!r.text)throw new RangeError("Every schema needs a 'text' type");for(let o in r.text.attrs)throw new RangeError("The text node type should not have attributes");return r}};function F0(t,e,n){let r=n.split("|");return i=>{let o=i===null?"null":typeof i;if(r.indexOf(o)<0)throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${t}, got ${o}`)}}var pu=class{constructor(e,n,r){this.hasDefault=Object.prototype.hasOwnProperty.call(r,"default"),this.default=r.default,this.validate=typeof r.validate=="string"?F0(e,n,r.validate):r.validate}get isRequired(){return!this.hasDefault}},xo=class t{constructor(e,n,r,i){this.name=e,this.rank=n,this.schema=r,this.spec=i,this.attrs=Vd(e,i.attrs),this.excluded=null;let o=_d(this.attrs);this.instance=o?new Z(this,o):null}create(e=null){return!e&&this.instance?this.instance:new Z(this,$d(this.attrs,e))}static compile(e,n){let r=Object.create(null),i=0;return e.forEach((o,s)=>r[o]=new t(o,i++,n,s)),r}removeFromSet(e){for(var n=0;n<e.length;n++)e[n].type==this&&(e=e.slice(0,n).concat(e.slice(n+1)),n--);return e}isInSet(e){for(let n=0;n<e.length;n++)if(e[n].type==this)return e[n]}excludes(e){return this.excluded.indexOf(e)>-1}},ul=class{constructor(e){this.linebreakReplacement=null,this.cached=Object.create(null);let n=this.spec={};for(let i in e)n[i]=e[i];n.nodes=lu.from(e.nodes),n.marks=lu.from(e.marks||{}),this.nodes=Ot.compile(this.spec.nodes,this),this.marks=xo.compile(this.spec.marks,this);let r=Object.create(null);for(let i in this.nodes){if(i in this.marks)throw new RangeError(i+" can not be both a node and a mark");let o=this.nodes[i],s=o.spec.content||"",l=o.spec.marks;if(o.contentMatch=r[s]||(r[s]=Un.parse(s,this.nodes)),o.inlineContent=o.contentMatch.inlineContent,o.spec.linebreakReplacement){if(this.linebreakReplacement)throw new RangeError("Multiple linebreak nodes defined");if(!o.isInline||!o.isLeaf)throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");this.linebreakReplacement=o}o.markSet=l=="_"?null:l?wd(this,l.split(" ")):l==""||!o.inlineContent?[]:null}for(let i in this.marks){let o=this.marks[i],s=o.spec.excludes;o.excluded=s==null?[o]:s==""?[]:wd(this,s.split(" "))}this.nodeFromJSON=i=>We.fromJSON(this,i),this.markFromJSON=i=>Z.fromJSON(this,i),this.topNodeType=this.nodes[this.spec.topNode||"doc"],this.cached.wrappings=Object.create(null)}node(e,n=null,r,i){if(typeof e=="string")e=this.nodeType(e);else if(e instanceof Ot){if(e.schema!=this)throw new RangeError("Node type from different schema used ("+e.name+")")}else throw new RangeError("Invalid node type: "+e);return e.createChecked(n,r,i)}text(e,n){let r=this.nodes.text;return new fu(r,r.defaultAttrs,e,Z.setFrom(n))}mark(e,n){return typeof e=="string"&&(e=this.marks[e]),e.create(n)}nodeType(e){let n=this.nodes[e];if(!n)throw new RangeError("Unknown node type: "+e);return n}};function wd(t,e){let n=[];for(let r=0;r<e.length;r++){let i=e[r],o=t.marks[i],s=o;if(o)n.push(o);else for(let l in t.marks){let a=t.marks[l];(i=="_"||a.spec.group&&a.spec.group.split(" ").indexOf(i)>-1)&&n.push(s=a)}if(!s)throw new SyntaxError("Unknown mark type: '"+e[r]+"'")}return n}function _0(t){return t.tag!=null}function $0(t){return t.style!=null}var kt=class t{constructor(e,n){this.schema=e,this.rules=n,this.tags=[],this.styles=[];let r=this.matchedStyles=[];n.forEach(i=>{if(_0(i))this.tags.push(i);else if($0(i)){let o=/[^=]*/.exec(i.style)[0];r.indexOf(o)<0&&r.push(o),this.styles.push(i)}}),this.normalizeLists=!this.tags.some(i=>{if(!/^(ul|ol)\b/.test(i.tag)||!i.node)return!1;let o=e.nodes[i.node];return o.contentMatch.matchType(o)})}parse(e,n={}){let r=new cl(this,n,!1);return r.addAll(e,Z.none,n.from,n.to),r.finish()}parseSlice(e,n={}){let r=new cl(this,n,!0);return r.addAll(e,Z.none,n.from,n.to),E.maxOpen(r.finish())}matchTag(e,n,r){for(let i=r?this.tags.indexOf(r)+1:0;i<this.tags.length;i++){let o=this.tags[i];if(H0(e,o.tag)&&(o.namespace===void 0||e.namespaceURI==o.namespace)&&(!o.context||n.matchesContext(o.context))){if(o.getAttrs){let s=o.getAttrs(e);if(s===!1)continue;o.attrs=s||void 0}return o}}}matchStyle(e,n,r,i){for(let o=i?this.styles.indexOf(i)+1:0;o<this.styles.length;o++){let s=this.styles[o],l=s.style;if(!(l.indexOf(e)!=0||s.context&&!r.matchesContext(s.context)||l.length>e.length&&(l.charCodeAt(e.length)!=61||l.slice(e.length+1)!=n))){if(s.getAttrs){let a=s.getAttrs(n);if(a===!1)continue;s.attrs=a||void 0}return s}}}static schemaRules(e){let n=[];function r(i){let o=i.priority==null?50:i.priority,s=0;for(;s<n.length;s++){let l=n[s];if((l.priority==null?50:l.priority)<o)break}n.splice(s,0,i)}for(let i in e.marks){let o=e.marks[i].spec.parseDOM;o&&o.forEach(s=>{r(s=Sd(s)),s.mark||s.ignore||s.clearMark||(s.mark=i)})}for(let i in e.nodes){let o=e.nodes[i].spec.parseDOM;o&&o.forEach(s=>{r(s=Sd(s)),s.node||s.ignore||s.mark||(s.node=i)})}return n}static fromSchema(e){return e.cached.domParser||(e.cached.domParser=new t(e,t.schemaRules(e)))}},jd={address:!0,article:!0,aside:!0,blockquote:!0,body:!0,canvas:!0,dd:!0,div:!0,dl:!0,fieldset:!0,figcaption:!0,figure:!0,footer:!0,form:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,header:!0,hgroup:!0,hr:!0,li:!0,noscript:!0,ol:!0,output:!0,p:!0,pre:!0,section:!0,table:!0,tfoot:!0,ul:!0},V0={head:!0,noscript:!0,object:!0,script:!0,style:!0,title:!0},Hd={ol:!0,ul:!0},bo=1,du=2,yo=4;function Cd(t,e,n){return e!=null?(e?bo:0)|(e==="full"?du:0):t&&t.whitespace=="pre"?bo|du:n&~yo}var Jr=class{constructor(e,n,r,i,o,s){this.type=e,this.attrs=n,this.marks=r,this.solid=i,this.options=s,this.content=[],this.activeMarks=Z.none,this.match=o||(s&yo?null:e.contentMatch)}findWrapping(e){if(!this.match){if(!this.type)return[];let n=this.type.contentMatch.fillBefore(A.from(e));if(n)this.match=this.type.contentMatch.matchFragment(n);else{let r=this.type.contentMatch,i;return(i=r.findWrapping(e.type))?(this.match=r,i):null}}return this.match.findWrapping(e.type)}finish(e){if(!(this.options&bo)){let r=this.content[this.content.length-1],i;if(r&&r.isText&&(i=/[ \t\r\n\u000c]+$/.exec(r.text))){let o=r;r.text.length==i[0].length?this.content.pop():this.content[this.content.length-1]=o.withText(o.text.slice(0,o.text.length-i[0].length))}}let n=A.from(this.content);return!e&&this.match&&(n=n.append(this.match.fillBefore(A.empty,!0))),this.type?this.type.create(this.attrs,n,this.marks):n}inlineContext(e){return this.type?this.type.inlineContent:this.content.length?this.content[0].isInline:e.parentNode&&!jd.hasOwnProperty(e.parentNode.nodeName.toLowerCase())}},cl=class{constructor(e,n,r){this.parser=e,this.options=n,this.isOpen=r,this.open=0,this.localPreserveWS=!1;let i=n.topNode,o,s=Cd(null,n.preserveWhitespace,0)|(r?yo:0);i?o=new Jr(i.type,i.attrs,Z.none,!0,n.topMatch||i.type.contentMatch,s):r?o=new Jr(null,null,Z.none,!0,null,s):o=new Jr(e.schema.topNodeType,null,Z.none,!0,null,s),this.nodes=[o],this.find=n.findPositions,this.needsBlock=!1}get top(){return this.nodes[this.open]}addDOM(e,n){e.nodeType==3?this.addTextNode(e,n):e.nodeType==1&&this.addElement(e,n)}addTextNode(e,n){let r=e.nodeValue,i=this.top,o=i.options&du?"full":this.localPreserveWS||(i.options&bo)>0,{schema:s}=this.parser;if(o==="full"||i.inlineContext(e)||/[^ \t\r\n\u000c]/.test(r)){if(o)if(o==="full")r=r.replace(/\r\n?/g,`
`);else if(s.linebreakReplacement&&/[\r\n]/.test(r)&&this.top.findWrapping(s.linebreakReplacement.create())){let l=r.split(/\r?\n|\r/);for(let a=0;a<l.length;a++)a&&this.insertNode(s.linebreakReplacement.create(),n,!0),l[a]&&this.insertNode(s.text(l[a]),n,!/\S/.test(l[a]));r=""}else r=r.replace(/\r?\n|\r/g," ");else if(r=r.replace(/[ \t\r\n\u000c]+/g," "),/^[ \t\r\n\u000c]/.test(r)&&this.open==this.nodes.length-1){let l=i.content[i.content.length-1],a=e.previousSibling;(!l||a&&a.nodeName=="BR"||l.isText&&/[ \t\r\n\u000c]$/.test(l.text))&&(r=r.slice(1))}r&&this.insertNode(s.text(r),n,!/\S/.test(r)),this.findInText(e)}else this.findInside(e)}addElement(e,n,r){let i=this.localPreserveWS,o=this.top;(e.tagName=="PRE"||/pre/.test(e.style&&e.style.whiteSpace))&&(this.localPreserveWS=!0);let s=e.nodeName.toLowerCase(),l;Hd.hasOwnProperty(s)&&this.parser.normalizeLists&&j0(e);let a=this.options.ruleFromNode&&this.options.ruleFromNode(e)||(l=this.parser.matchTag(e,this,r));e:if(a?a.ignore:V0.hasOwnProperty(s))this.findInside(e),this.ignoreFallback(e,n);else if(!a||a.skip||a.closeParent){a&&a.closeParent?this.open=Math.max(0,this.open-1):a&&a.skip.nodeType&&(e=a.skip);let u,c=this.needsBlock;if(jd.hasOwnProperty(s))o.content.length&&o.content[0].isInline&&this.open&&(this.open--,o=this.top),u=!0,o.type||(this.needsBlock=!0);else if(!e.firstChild){this.leafFallback(e,n);break e}let f=a&&a.skip?n:this.readStyles(e,n);f&&this.addAll(e,f),u&&this.sync(o),this.needsBlock=c}else{let u=this.readStyles(e,n);u&&this.addElementByRule(e,a,u,a.consuming===!1?l:void 0)}this.localPreserveWS=i}leafFallback(e,n){e.nodeName=="BR"&&this.top.type&&this.top.type.inlineContent&&this.addTextNode(e.ownerDocument.createTextNode(`
`),n)}ignoreFallback(e,n){e.nodeName=="BR"&&(!this.top.type||!this.top.type.inlineContent)&&this.findPlace(this.parser.schema.text("-"),n,!0)}readStyles(e,n){let r=e.style;if(r&&r.length)for(let i=0;i<this.parser.matchedStyles.length;i++){let o=this.parser.matchedStyles[i],s=r.getPropertyValue(o);if(s)for(let l=void 0;;){let a=this.parser.matchStyle(o,s,this,l);if(!a)break;if(a.ignore)return null;if(a.clearMark?n=n.filter(u=>!a.clearMark(u)):n=n.concat(this.parser.schema.marks[a.mark].create(a.attrs)),a.consuming===!1)l=a;else break}}return n}addElementByRule(e,n,r,i){let o,s;if(n.node)if(s=this.parser.schema.nodes[n.node],s.isLeaf)this.insertNode(s.create(n.attrs),r,e.nodeName=="BR")||this.leafFallback(e,r);else{let a=this.enter(s,n.attrs||null,r,n.preserveWhitespace);a&&(o=!0,r=a)}else{let a=this.parser.schema.marks[n.mark];r=r.concat(a.create(n.attrs))}let l=this.top;if(s&&s.isLeaf)this.findInside(e);else if(i)this.addElement(e,r,i);else if(n.getContent)this.findInside(e),n.getContent(e,this.parser.schema).forEach(a=>this.insertNode(a,r,!1));else{let a=e;typeof n.contentElement=="string"?a=e.querySelector(n.contentElement):typeof n.contentElement=="function"?a=n.contentElement(e):n.contentElement&&(a=n.contentElement),this.findAround(e,a,!0),this.addAll(a,r),this.findAround(e,a,!1)}o&&this.sync(l)&&this.open--}addAll(e,n,r,i){let o=r||0;for(let s=r?e.childNodes[r]:e.firstChild,l=i==null?null:e.childNodes[i];s!=l;s=s.nextSibling,++o)this.findAtPoint(e,o),this.addDOM(s,n);this.findAtPoint(e,o)}findPlace(e,n,r){let i,o;for(let s=this.open,l=0;s>=0;s--){let a=this.nodes[s],u=a.findWrapping(e);if(u&&(!i||i.length>u.length+l)&&(i=u,o=a,!u.length))break;if(a.solid){if(r)break;l+=2}}if(!i)return null;this.sync(o);for(let s=0;s<i.length;s++)n=this.enterInner(i[s],null,n,!1);return n}insertNode(e,n,r){if(e.isInline&&this.needsBlock&&!this.top.type){let o=this.textblockFromContext();o&&(n=this.enterInner(o,null,n))}let i=this.findPlace(e,n,r);if(i){this.closeExtra();let o=this.top;o.match&&(o.match=o.match.matchType(e.type));let s=Z.none;for(let l of i.concat(e.marks))(o.type?o.type.allowsMarkType(l.type):Md(l.type,e.type))&&(s=l.addToSet(s));return o.content.push(e.mark(s)),!0}return!1}enter(e,n,r,i){let o=this.findPlace(e.create(n),r,!1);return o&&(o=this.enterInner(e,n,r,!0,i)),o}enterInner(e,n,r,i=!1,o){this.closeExtra();let s=this.top;s.match=s.match&&s.match.matchType(e);let l=Cd(e,o,s.options);s.options&yo&&s.content.length==0&&(l|=yo);let a=Z.none;return r=r.filter(u=>(s.type?s.type.allowsMarkType(u.type):Md(u.type,e))?(a=u.addToSet(a),!1):!0),this.nodes.push(new Jr(e,n,a,i,null,l)),this.open++,r}closeExtra(e=!1){let n=this.nodes.length-1;if(n>this.open){for(;n>this.open;n--)this.nodes[n-1].content.push(this.nodes[n].finish(e));this.nodes.length=this.open+1}}finish(){return this.open=0,this.closeExtra(this.isOpen),this.nodes[0].finish(!!(this.isOpen||this.options.topOpen))}sync(e){for(let n=this.open;n>=0;n--){if(this.nodes[n]==e)return this.open=n,!0;this.localPreserveWS&&(this.nodes[n].options|=bo)}return!1}get currentPos(){this.closeExtra();let e=0;for(let n=this.open;n>=0;n--){let r=this.nodes[n].content;for(let i=r.length-1;i>=0;i--)e+=r[i].nodeSize;n&&e++}return e}findAtPoint(e,n){if(this.find)for(let r=0;r<this.find.length;r++)this.find[r].node==e&&this.find[r].offset==n&&(this.find[r].pos=this.currentPos)}findInside(e){if(this.find)for(let n=0;n<this.find.length;n++)this.find[n].pos==null&&e.nodeType==1&&e.contains(this.find[n].node)&&(this.find[n].pos=this.currentPos)}findAround(e,n,r){if(e!=n&&this.find)for(let i=0;i<this.find.length;i++)this.find[i].pos==null&&e.nodeType==1&&e.contains(this.find[i].node)&&n.compareDocumentPosition(this.find[i].node)&(r?2:4)&&(this.find[i].pos=this.currentPos)}findInText(e){if(this.find)for(let n=0;n<this.find.length;n++)this.find[n].node==e&&(this.find[n].pos=this.currentPos-(e.nodeValue.length-this.find[n].offset))}matchesContext(e){if(e.indexOf("|")>-1)return e.split(/\s*\|\s*/).some(this.matchesContext,this);let n=e.split("/"),r=this.options.context,i=!this.isOpen&&(!r||r.parent.type==this.nodes[0].type),o=-(r?r.depth+1:0)+(i?0:1),s=(l,a)=>{for(;l>=0;l--){let u=n[l];if(u==""){if(l==n.length-1||l==0)continue;for(;a>=o;a--)if(s(l-1,a))return!0;return!1}else{let c=a>0||a==0&&i?this.nodes[a].type:r&&a>=o?r.node(a-o).type:null;if(!c||c.name!=u&&!c.isInGroup(u))return!1;a--}}return!0};return s(n.length-1,this.open)}textblockFromContext(){let e=this.options.context;if(e)for(let n=e.depth;n>=0;n--){let r=e.node(n).contentMatchAt(e.indexAfter(n)).defaultType;if(r&&r.isTextblock&&r.defaultAttrs)return r}for(let n in this.parser.schema.nodes){let r=this.parser.schema.nodes[n];if(r.isTextblock&&r.defaultAttrs)return r}}};function j0(t){for(let e=t.firstChild,n=null;e;e=e.nextSibling){let r=e.nodeType==1?e.nodeName.toLowerCase():null;r&&Hd.hasOwnProperty(r)&&n?(n.appendChild(e),e=n):r=="li"?n=e:r&&(n=null)}}function H0(t,e){return(t.matches||t.msMatchesSelector||t.webkitMatchesSelector||t.mozMatchesSelector).call(t,e)}function Sd(t){let e={};for(let n in t)e[n]=t[n];return e}function Md(t,e){let n=e.schema.nodes;for(let r in n){let i=n[r];if(!i.allowsMarkType(t))continue;let o=[],s=l=>{o.push(l);for(let a=0;a<l.edgeCount;a++){let{type:u,next:c}=l.edge(a);if(u==e||o.indexOf(c)<0&&s(c))return!0}};if(s(i.contentMatch))return!0}}var xt=class t{constructor(e,n){this.nodes=e,this.marks=n}serializeFragment(e,n={},r){r||(r=il(n).createDocumentFragment());let i=r,o=[];return e.forEach(s=>{if(o.length||s.marks.length){let l=0,a=0;for(;l<o.length&&a<s.marks.length;){let u=s.marks[a];if(!this.marks[u.type.name]){a++;continue}if(!u.eq(o[l][0])||u.type.spec.spanning===!1)break;l++,a++}for(;l<o.length;)i=o.pop()[1];for(;a<s.marks.length;){let u=s.marks[a++],c=this.serializeMark(u,s.isInline,n);c&&(o.push([u,i]),i.appendChild(c.dom),i=c.contentDOM||c.dom)}}i.appendChild(this.serializeNodeInner(s,n))}),r}serializeNodeInner(e,n){if(e.isText)return il(n).createTextNode(e.text);let{dom:r,contentDOM:i}=ol(il(n),this.nodes[e.type.name](e),null,e.attrs);if(i){if(e.isLeaf)throw new RangeError("Content hole not allowed in a leaf node spec");this.serializeFragment(e.content,n,i)}return r}serializeNode(e,n={}){let r=this.serializeNodeInner(e,n);for(let i=e.marks.length-1;i>=0;i--){let o=this.serializeMark(e.marks[i],e.isInline,n);o&&((o.contentDOM||o.dom).appendChild(r),r=o.dom)}return r}serializeMark(e,n,r={}){let i=this.marks[e.type.name];return i&&ol(il(r),i(e,n),null,e.attrs)}static renderSpec(e,n,r=null,i){return typeof n=="string"?{dom:e.createTextNode(n)}:ol(e,n,r,i)}static fromSchema(e){return e.cached.domSerializer||(e.cached.domSerializer=new t(this.nodesFromSchema(e),this.marksFromSchema(e)))}static nodesFromSchema(e){let n=Nd(e.nodes);return n.text||(n.text=r=>r.text),n}static marksFromSchema(e){return Nd(e.marks)}};function Nd(t){let e={};for(let n in t){let r=t[n].spec.toDOM;r&&(e[n]=r)}return e}function il(t){return t.document||window.document}var Id=new WeakMap;function W0(t){let e=Id.get(t);return e===void 0&&Id.set(t,e=q0(t)),e}function q0(t){let e=null;function n(r){if(r&&typeof r=="object")if(Array.isArray(r))if(typeof r[0]=="string")e||(e=[]),e.push(r);else for(let i=0;i<r.length;i++)n(r[i]);else for(let i in r)n(r[i])}return n(t),e}function ol(t,e,n,r){if(e.nodeType==1)return{dom:e};if(e.dom&&e.dom.nodeType==1)return e;let i=e[0],o;if(typeof i!="string")throw new RangeError("Invalid array passed to renderSpec");if(r&&(o=W0(r))&&o.indexOf(e)>-1)throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");let s=i.indexOf(" ");s>0&&(n=i.slice(0,s),i=i.slice(s+1));let l,a=n?t.createElementNS(n,i):t.createElement(i),u=e[1],c=1;if(u&&typeof u=="object"&&u.nodeType==null&&!Array.isArray(u)){c=2;for(let f in u)if(u[f]!=null){let h=f.indexOf(" ");h>0?a.setAttributeNS(f.slice(0,h),f.slice(h+1),u[f]):f=="style"&&a.style?a.style.cssText=u[f]:a.setAttribute(f,u[f])}}for(let f=c;f<e.length;f++){let h=e[f];if(h===0){if(f<e.length-1||f>c)throw new RangeError("Content hole must be the only child of its parent node");return{dom:a,contentDOM:a}}else if(typeof h=="string")a.appendChild(t.createTextNode(h));else{let{dom:p,contentDOM:d}=ol(t,h,n,r);if(a.appendChild(p),d){if(l)throw new RangeError("Multiple content holes");l=d}}}return{dom:a,contentDOM:l}}var Ud=65535,Gd=Math.pow(2,16);function K0(t,e){return t+e*Gd}function Wd(t){return t&Ud}function J0(t){return(t-(t&Ud))/Gd}var Qd=1,Yd=2,fl=4,Xd=8,So=class{constructor(e,n,r){this.pos=e,this.delInfo=n,this.recover=r}get deleted(){return(this.delInfo&Xd)>0}get deletedBefore(){return(this.delInfo&(Qd|fl))>0}get deletedAfter(){return(this.delInfo&(Yd|fl))>0}get deletedAcross(){return(this.delInfo&fl)>0}},Ut=class t{constructor(e,n=!1){if(this.ranges=e,this.inverted=n,!e.length&&t.empty)return t.empty}recover(e){let n=0,r=Wd(e);if(!this.inverted)for(let i=0;i<r;i++)n+=this.ranges[i*3+2]-this.ranges[i*3+1];return this.ranges[r*3]+n+J0(e)}mapResult(e,n=1){return this._map(e,n,!1)}map(e,n=1){return this._map(e,n,!0)}_map(e,n,r){let i=0,o=this.inverted?2:1,s=this.inverted?1:2;for(let l=0;l<this.ranges.length;l+=3){let a=this.ranges[l]-(this.inverted?i:0);if(a>e)break;let u=this.ranges[l+o],c=this.ranges[l+s],f=a+u;if(e<=f){let h=u?e==a?-1:e==f?1:n:n,p=a+i+(h<0?0:c);if(r)return p;let d=e==(n<0?a:f)?null:K0(l/3,e-a),m=0;return u&&(m|=e==a?Yd:e==f?Qd:fl,(n<0?e!=a:e!=f)&&(m|=Xd)),new So(p,m,d)}i+=c-u}return r?e+i:new So(e+i,0,null)}touches(e,n){let r=0,i=Wd(n),o=this.inverted?2:1,s=this.inverted?1:2;for(let l=0;l<this.ranges.length;l+=3){let a=this.ranges[l]-(this.inverted?r:0);if(a>e)break;let u=this.ranges[l+o],c=a+u;if(e<=c&&l==i*3)return!0;r+=this.ranges[l+s]-u}return!1}forEach(e){let n=this.inverted?2:1,r=this.inverted?1:2;for(let i=0,o=0;i<this.ranges.length;i+=3){let s=this.ranges[i],l=s-(this.inverted?o:0),a=s+(this.inverted?0:o),u=this.ranges[i+n],c=this.ranges[i+r];e(l,l+u,a,a+c),o+=c-u}}invert(){return new t(this.ranges,!this.inverted)}toString(){return(this.inverted?"-":"")+JSON.stringify(this.ranges)}static offset(e){return e==0?t.empty:new t(e<0?[0,-e,0]:[0,0,e])}};Ut.empty=new Ut([]);var Mo=class t{constructor(e,n,r=0,i=e?e.length:0){this.mirror=n,this.from=r,this.to=i,this._maps=e||[],this.ownData=!(e||n)}get maps(){return this._maps}slice(e=0,n=this.maps.length){return new t(this._maps,this.mirror,e,n)}appendMap(e,n){this.ownData||(this._maps=this._maps.slice(),this.mirror=this.mirror&&this.mirror.slice(),this.ownData=!0),this.to=this._maps.push(e),n!=null&&this.setMirror(this._maps.length-1,n)}appendMapping(e){for(let n=e.from,r=this._maps.length;n<e.to;n++){let i=e.getMirror(n);i!=null&&(i=i<n&&i>=e.from?r+(i-e.from):void 0),this.appendMap(e._maps[n],i)}}getMirror(e){if(this.mirror){for(let n=0;n<this.mirror.length;n++)if(this.mirror[n]==e)return this.mirror[n+(n%2?-1:1)]}}setMirror(e,n){this.mirror||(this.mirror=[]),this.mirror.push(e,n)}appendMappingInverted(e){for(let n=e.to-1,r=this._maps.length+e._maps.length;n>=e.from;n--){let i=e.getMirror(n);i!=null&&(i=i>n&&i<e.to?r-(i-e.from)-1:void 0),this.appendMap(e._maps[n].invert(),i)}}invert(){let e=new t;return e.appendMappingInverted(this),e}map(e,n=1){if(this.mirror)return this._map(e,n,!0);for(let r=this.from;r<this.to;r++)e=this._maps[r].map(e,n);return e}mapResult(e,n=1){return this._map(e,n,!1)}_map(e,n,r){let i=0;for(let o=this.from;o<this.to;o++){let s=this._maps[o],l=s.mapResult(e,n);if(l.recover!=null){let a=this.getMirror(o);if(a!=null&&a>o&&a<this.to){o=a,e=this._maps[a].recover(l.recover);continue}}i|=l.delInfo,e=l.pos}return r?e:new So(e,i,null)}},mu=Object.create(null),he=class{getMap(){return Ut.empty}merge(e){return null}static fromJSON(e,n){if(!n||!n.stepType)throw new RangeError("Invalid input for Step.fromJSON");let r=mu[n.stepType];if(!r)throw new RangeError(`No step type ${n.stepType} defined`);return r.fromJSON(e,n)}static jsonID(e,n){if(e in mu)throw new RangeError("Duplicate use of step JSON ID "+e);return mu[e]=n,n.prototype.jsonID=e,n}},be=class t{constructor(e,n){this.doc=e,this.failed=n}static ok(e){return new t(e,null)}static fail(e){return new t(null,e)}static fromReplace(e,n,r,i){try{return t.ok(e.replace(n,r,i))}catch(o){if(o instanceof wn)return t.fail(o.message);throw o}}};function xu(t,e,n){let r=[];for(let i=0;i<t.childCount;i++){let o=t.child(i);o.content.size&&(o=o.copy(xu(o.content,e,o))),o.isInline&&(o=e(o,n,i)),r.push(o)}return A.fromArray(r)}var Gt=class t extends he{constructor(e,n,r){super(),this.from=e,this.to=n,this.mark=r}apply(e){let n=e.slice(this.from,this.to),r=e.resolve(this.from),i=r.node(r.sharedDepth(this.to)),o=new E(xu(n.content,(s,l)=>!s.isAtom||!l.type.allowsMarkType(this.mark.type)?s:s.mark(this.mark.addToSet(s.marks)),i),n.openStart,n.openEnd);return be.fromReplace(e,this.from,this.to,o)}invert(e){let n=[];return e.nodesBetween(this.from,this.to,(r,i)=>{if(r.isInline&&r.isAtom){let o=this.mark.addToSet(r.marks);if(!Z.sameSet(o,r.marks)){let s=Math.max(this.from,i),l=Math.min(this.to,i+r.nodeSize);hl(Cn,s,l,this.mark,n);for(let a of r.marks)a.isInSet(o)||hl(t,s,l,a,n)}}}),n.length==1?n[0]:new No(n)}map(e){let n=e.map(this.from,1),r=e.map(this.to,-1);return n>=r?null:new t(n,r,this.mark)}merge(e){return e instanceof t&&e.mark.eq(this.mark)&&this.from<=e.to&&this.to>=e.from?new t(Math.min(this.from,e.from),Math.max(this.to,e.to),this.mark):null}toJSON(){return{stepType:"addMark",mark:this.mark.toJSON(),from:this.from,to:this.to}}static fromJSON(e,n){if(typeof n.from!="number"||typeof n.to!="number")throw new RangeError("Invalid input for AddMarkStep.fromJSON");return new t(n.from,n.to,e.markFromJSON(n.mark))}};he.jsonID("addMark",Gt);var Cn=class t extends he{constructor(e,n,r){super(),this.from=e,this.to=n,this.mark=r}apply(e){let n=e.slice(this.from,this.to),r=new E(xu(n.content,i=>i.mark(this.mark.removeFromSet(i.marks)),e),n.openStart,n.openEnd);return be.fromReplace(e,this.from,this.to,r)}invert(e){let n=[];return e.nodesBetween(this.from,this.to,(r,i)=>{r.isInline&&r.isAtom&&this.mark.isInSet(r.marks)&&hl(Gt,Math.max(this.from,i),Math.min(this.to,i+r.nodeSize),this.mark,n)}),n.length==1?n[0]:new No(n)}map(e){let n=e.map(this.from,1),r=e.map(this.to,-1);return n>=r?null:new t(n,r,this.mark)}merge(e){return e instanceof t&&e.mark.eq(this.mark)&&this.from<=e.to&&this.to>=e.from?new t(Math.min(this.from,e.from),Math.max(this.to,e.to),this.mark):null}toJSON(){return{stepType:"removeMark",mark:this.mark.toJSON(),from:this.from,to:this.to}}static fromJSON(e,n){if(typeof n.from!="number"||typeof n.to!="number")throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");return new t(n.from,n.to,e.markFromJSON(n.mark))}};he.jsonID("removeMark",Cn);function hl(t,e,n,r,i){let o=i.length?i[i.length-1]:null;o&&o instanceof t&&o.to==e&&o.mark.eq(r)?i[i.length-1]=new t(o.from,n,r):i.push(new t(e,n,r))}var No=class t extends he{constructor(e){super(),this.steps=e}apply(e){for(let n of this.steps){let r=n.apply(e);if(!r.doc)return r;e=r.doc}return new be(e,null)}invert(e){return new t(this.steps.map(n=>n.invert(e)))}map(e){let n=[];for(let r of this.steps){let i=r.map(e);i&&n.push(i)}return n.length?new t(n):null}toJSON(){return{stepType:"markSet",steps:this.steps.map(e=>e.toJSON())}}static fromJSON(e,n){if(!Array.isArray(n.steps)||!n.steps.every(r=>r.stepType=="addMark"||r.stepType=="removeMark"))throw new RangeError("Invalid JSON for MarkSetStep");return new t(n.steps.map(r=>he.fromJSON(e,r)))}};he.jsonID("markSet",No);var Io=class t extends he{constructor(e,n){super(),this.pos=e,this.mark=n}apply(e){let n=e.nodeAt(this.pos);if(!n)return be.fail("No node at mark step's position");let r=n.type.create(n.attrs,null,this.mark.addToSet(n.marks));return be.fromReplace(e,this.pos,this.pos+1,new E(A.from(r),0,n.isLeaf?0:1))}invert(e){let n=e.nodeAt(this.pos);if(n){let r=this.mark.addToSet(n.marks);if(r.length==n.marks.length){for(let i=0;i<n.marks.length;i++)if(!n.marks[i].isInSet(r))return new t(this.pos,n.marks[i]);return new t(this.pos,this.mark)}}return new Ur(this.pos,this.mark)}map(e){let n=e.mapResult(this.pos,1);return n.deletedAfter?null:new t(n.pos,this.mark)}toJSON(){return{stepType:"addNodeMark",pos:this.pos,mark:this.mark.toJSON()}}static fromJSON(e,n){if(typeof n.pos!="number")throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");return new t(n.pos,e.markFromJSON(n.mark))}};he.jsonID("addNodeMark",Io);var Ur=class t extends he{constructor(e,n){super(),this.pos=e,this.mark=n}apply(e){let n=e.nodeAt(this.pos);if(!n)return be.fail("No node at mark step's position");let r=n.type.create(n.attrs,null,this.mark.removeFromSet(n.marks));return be.fromReplace(e,this.pos,this.pos+1,new E(A.from(r),0,n.isLeaf?0:1))}invert(e){let n=e.nodeAt(this.pos);return!n||!this.mark.isInSet(n.marks)?this:new Io(this.pos,this.mark)}map(e){let n=e.mapResult(this.pos,1);return n.deletedAfter?null:new t(n.pos,this.mark)}toJSON(){return{stepType:"removeNodeMark",pos:this.pos,mark:this.mark.toJSON()}}static fromJSON(e,n){if(typeof n.pos!="number")throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");return new t(n.pos,e.markFromJSON(n.mark))}};he.jsonID("removeNodeMark",Ur);var Se=class t extends he{constructor(e,n,r,i=!1){super(),this.from=e,this.to=n,this.slice=r,this.structure=i}apply(e){return this.structure&&yu(e,this.from,this.to)?be.fail("Structure replace would overwrite content"):be.fromReplace(e,this.from,this.to,this.slice)}getMap(){return new Ut([this.from,this.to-this.from,this.slice.size])}invert(e){return new t(this.from,this.from+this.slice.size,e.slice(this.from,this.to))}map(e){let n=e.mapResult(this.to,-1),r=this.from==this.to&&t.MAP_BIAS<0?n:e.mapResult(this.from,1);return r.deletedAcross&&n.deletedAcross?null:new t(r.pos,Math.max(r.pos,n.pos),this.slice,this.structure)}merge(e){if(!(e instanceof t)||e.structure||this.structure)return null;if(this.from+this.slice.size==e.from&&!this.slice.openEnd&&!e.slice.openStart){let n=this.slice.size+e.slice.size==0?E.empty:new E(this.slice.content.append(e.slice.content),this.slice.openStart,e.slice.openEnd);return new t(this.from,this.to+(e.to-e.from),n,this.structure)}else if(e.to==this.from&&!this.slice.openStart&&!e.slice.openEnd){let n=this.slice.size+e.slice.size==0?E.empty:new E(e.slice.content.append(this.slice.content),e.slice.openStart,this.slice.openEnd);return new t(e.from,this.to,n,this.structure)}else return null}toJSON(){let e={stepType:"replace",from:this.from,to:this.to};return this.slice.size&&(e.slice=this.slice.toJSON()),this.structure&&(e.structure=!0),e}static fromJSON(e,n){if(typeof n.from!="number"||typeof n.to!="number")throw new RangeError("Invalid input for ReplaceStep.fromJSON");return new t(n.from,n.to,E.fromJSON(e,n.slice),!!n.structure)}};Se.MAP_BIAS=1;he.jsonID("replace",Se);var Me=class t extends he{constructor(e,n,r,i,o,s,l=!1){super(),this.from=e,this.to=n,this.gapFrom=r,this.gapTo=i,this.slice=o,this.insert=s,this.structure=l}apply(e){if(this.structure&&(yu(e,this.from,this.gapFrom)||yu(e,this.gapTo,this.to)))return be.fail("Structure gap-replace would overwrite content");let n=e.slice(this.gapFrom,this.gapTo);if(n.openStart||n.openEnd)return be.fail("Gap is not a flat range");let r=this.slice.insertAt(this.insert,n.content);return r?be.fromReplace(e,this.from,this.to,r):be.fail("Content does not fit in gap")}getMap(){return new Ut([this.from,this.gapFrom-this.from,this.insert,this.gapTo,this.to-this.gapTo,this.slice.size-this.insert])}invert(e){let n=this.gapTo-this.gapFrom;return new t(this.from,this.from+this.slice.size+n,this.from+this.insert,this.from+this.insert+n,e.slice(this.from,this.to).removeBetween(this.gapFrom-this.from,this.gapTo-this.from),this.gapFrom-this.from,this.structure)}map(e){let n=e.mapResult(this.from,1),r=e.mapResult(this.to,-1),i=this.from==this.gapFrom?n.pos:e.map(this.gapFrom,-1),o=this.to==this.gapTo?r.pos:e.map(this.gapTo,1);return n.deletedAcross&&r.deletedAcross||i<n.pos||o>r.pos||i>o?null:new t(n.pos,r.pos,i,o,this.slice,this.insert,this.structure)}toJSON(){let e={stepType:"replaceAround",from:this.from,to:this.to,gapFrom:this.gapFrom,gapTo:this.gapTo,insert:this.insert};return this.slice.size&&(e.slice=this.slice.toJSON()),this.structure&&(e.structure=!0),e}static fromJSON(e,n){if(typeof n.from!="number"||typeof n.to!="number"||typeof n.gapFrom!="number"||typeof n.gapTo!="number"||typeof n.insert!="number")throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");return new t(n.from,n.to,n.gapFrom,n.gapTo,E.fromJSON(e,n.slice),n.insert,!!n.structure)}};he.jsonID("replaceAround",Me);function yu(t,e,n){let r=t.resolve(e),i=n-e,o=r.depth;for(;i>0&&o>0&&r.indexAfter(o)==r.node(o).childCount;)o--,i--;if(i>0){let s=r.node(o).maybeChild(r.indexAfter(o));for(;i>0;){if(!s||s.isLeaf)return!0;s=s.firstChild,i--}}return!1}function U0(t,e,n,r){let i=[];t.doc.nodesBetween(e,n,(o,s,l)=>{if(!o.isInline)return;let a=o.marks;if(!r.isInSet(a)&&l.type.allowsMarkType(r.type)){let u=Math.max(s,e),c=Math.min(s+o.nodeSize,n);hl(Gt,u,c,r,i)}}),i.forEach(o=>t.step(o))}function G0(t,e,n,r){let i=[],o=0;t.doc.nodesBetween(e,n,(s,l)=>{if(!s.isInline||!s.isAtom)return;o++;let a=null;if(r instanceof xo){let u=s.marks,c;for(;c=r.isInSet(u);)(a||(a=[])).push(c),u=c.removeFromSet(u)}else r?r.isInSet(s.marks)&&(a=[r]):a=s.marks;if(a&&a.length){let u=Math.min(l+s.nodeSize,n);for(let c=0;c<a.length;c++){let f=a[c],h;for(let p=0;p<i.length;p++){let d=i[p];d.step==o-1&&f.eq(i[p].style)&&(h=d)}h?(h.to=u,h.step=o):i.push({style:f,from:Math.max(l,e),to:u,step:o})}}}),i.forEach(s=>t.step(new Cn(s.from,s.to,s.style)))}function bu(t,e,n,r=n.contentMatch,i=!0){let o=t.doc.nodeAt(e),s=[],l=e+1;for(let a=0;a<o.childCount;a++){let u=o.child(a),c=l+u.nodeSize,f=r.matchType(u.type);if(!f)s.push(new Se(l,c,E.empty));else{r=f;for(let h=0;h<u.marks.length;h++)n.allowsMarkType(u.marks[h].type)||t.step(new Cn(l,c,u.marks[h]));if(i&&u.isText&&n.whitespace!="pre"){let h,p=/\r?\n|\r/g,d;for(;h=p.exec(u.text);)d||(d=new E(A.from(n.schema.text(" ",n.allowedMarks(u.marks))),0,0)),s.push(new Se(l+h.index,l+h.index+h[0].length,d))}}l=c}if(!r.validEnd){let a=r.fillBefore(A.empty,!0);t.replace(l,l,new E(a,0,0))}for(let a=s.length-1;a>=0;a--)t.step(s[a])}function Q0(t,e,n){return(e==0||t.canReplace(e,t.childCount))&&(n==t.childCount||t.canReplace(0,n))}function Yr(t){let n=t.parent.content.cutByIndex(t.startIndex,t.endIndex);for(let r=t.depth,i=0,o=0;;--r){let s=t.$from.node(r),l=t.$from.index(r)+i,a=t.$to.indexAfter(r)-o;if(r<t.depth&&s.canReplace(l,a,n))return r;if(r==0||s.type.spec.isolating||!Q0(s,l,a))break;l&&(i=1),a<s.childCount&&(o=1)}return null}function Y0(t,e,n){let{$from:r,$to:i,depth:o}=e,s=r.before(o+1),l=i.after(o+1),a=s,u=l,c=A.empty,f=0;for(let d=o,m=!1;d>n;d--)m||r.index(d)>0?(m=!0,c=A.from(r.node(d).copy(c)),f++):a--;let h=A.empty,p=0;for(let d=o,m=!1;d>n;d--)m||i.after(d+1)<i.end(d)?(m=!0,h=A.from(i.node(d).copy(h)),p++):u++;t.step(new Me(a,u,s,l,new E(c.append(h),f,p),c.size-f,!0))}function Gn(t,e,n=null,r=t){let i=X0(t,e),o=i&&Z0(r,e);return o?i.map(qd).concat({type:e,attrs:n}).concat(o.map(qd)):null}function qd(t){return{type:t,attrs:null}}function X0(t,e){let{parent:n,startIndex:r,endIndex:i}=t,o=n.contentMatchAt(r).findWrapping(e);if(!o)return null;let s=o.length?o[0]:e;return n.canReplaceWith(r,i,s)?o:null}function Z0(t,e){let{parent:n,startIndex:r,endIndex:i}=t,o=n.child(r),s=e.contentMatch.findWrapping(o.type);if(!s)return null;let a=(s.length?s[s.length-1]:e).contentMatch;for(let u=r;a&&u<i;u++)a=a.matchType(n.child(u).type);return!a||!a.validEnd?null:s}function e1(t,e,n){let r=A.empty;for(let s=n.length-1;s>=0;s--){if(r.size){let l=n[s].type.contentMatch.matchFragment(r);if(!l||!l.validEnd)throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper")}r=A.from(n[s].type.create(n[s].attrs,r))}let i=e.start,o=e.end;t.step(new Me(i,o,i,o,new E(r,0,0),n.length,!0))}function t1(t,e,n,r,i){if(!r.isTextblock)throw new RangeError("Type given to setBlockType should be a textblock");let o=t.steps.length;t.doc.nodesBetween(e,n,(s,l)=>{let a=typeof i=="function"?i(s):i;if(s.isTextblock&&!s.hasMarkup(r,a)&&n1(t.doc,t.mapping.slice(o).map(l),r)){let u=null;if(r.schema.linebreakReplacement){let p=r.whitespace=="pre",d=!!r.contentMatch.matchType(r.schema.linebreakReplacement);p&&!d?u=!1:!p&&d&&(u=!0)}u===!1&&em(t,s,l,o),bu(t,t.mapping.slice(o).map(l,1),r,void 0,u===null);let c=t.mapping.slice(o),f=c.map(l,1),h=c.map(l+s.nodeSize,1);return t.step(new Me(f,h,f+1,h-1,new E(A.from(r.create(a,null,s.marks)),0,0),1,!0)),u===!0&&Zd(t,s,l,o),!1}})}function Zd(t,e,n,r){e.forEach((i,o)=>{if(i.isText){let s,l=/\r?\n|\r/g;for(;s=l.exec(i.text);){let a=t.mapping.slice(r).map(n+1+o+s.index);t.replaceWith(a,a+1,e.type.schema.linebreakReplacement.create())}}})}function em(t,e,n,r){e.forEach((i,o)=>{if(i.type==i.type.schema.linebreakReplacement){let s=t.mapping.slice(r).map(n+1+o);t.replaceWith(s,s+1,e.type.schema.text(`
`))}})}function n1(t,e,n){let r=t.resolve(e),i=r.index();return r.parent.canReplaceWith(i,i+1,n)}function r1(t,e,n,r,i){let o=t.doc.nodeAt(e);if(!o)throw new RangeError("No node at given position");n||(n=o.type);let s=n.create(r,null,i||o.marks);if(o.isLeaf)return t.replaceWith(e,e+o.nodeSize,s);if(!n.validContent(o.content))throw new RangeError("Invalid content for node type "+n.name);t.step(new Me(e,e+o.nodeSize,e+1,e+o.nodeSize-1,new E(A.from(s),0,0),1,!0))}function Qn(t,e,n=1,r){let i=t.resolve(e),o=i.depth-n,s=r&&r[r.length-1]||i.parent;if(o<0||i.parent.type.spec.isolating||!i.parent.canReplace(i.index(),i.parent.childCount)||!s.type.validContent(i.parent.content.cutByIndex(i.index(),i.parent.childCount)))return!1;for(let u=i.depth-1,c=n-2;u>o;u--,c--){let f=i.node(u),h=i.index(u);if(f.type.spec.isolating)return!1;let p=f.content.cutByIndex(h,f.childCount),d=r&&r[c+1];d&&(p=p.replaceChild(0,d.type.create(d.attrs)));let m=r&&r[c]||f;if(!f.canReplace(h+1,f.childCount)||!m.type.validContent(p))return!1}let l=i.indexAfter(o),a=r&&r[0];return i.node(o).canReplaceWith(l,l,a?a.type:i.node(o+1).type)}function i1(t,e,n=1,r){let i=t.doc.resolve(e),o=A.empty,s=A.empty;for(let l=i.depth,a=i.depth-n,u=n-1;l>a;l--,u--){o=A.from(i.node(l).copy(o));let c=r&&r[u];s=A.from(c?c.type.create(c.attrs,s):i.node(l).copy(s))}t.step(new Se(e,e,new E(o.append(s),n,n),!0))}function Yn(t,e){let n=t.resolve(e),r=n.index();return s1(n.nodeBefore,n.nodeAfter)&&n.parent.canReplace(r,r+1)}function o1(t,e){e.content.size||t.type.compatibleContent(e.type);let n=t.contentMatchAt(t.childCount),{linebreakReplacement:r}=t.type.schema;for(let i=0;i<e.childCount;i++){let o=e.child(i),s=o.type==r?t.type.schema.nodes.text:o.type;if(n=n.matchType(s),!n||!t.type.allowsMarks(o.marks))return!1}return n.validEnd}function s1(t,e){return!!(t&&e&&!t.isLeaf&&o1(t,e))}function l1(t,e,n){let r=null,{linebreakReplacement:i}=t.doc.type.schema,o=t.doc.resolve(e-n),s=o.node().type;if(i&&s.inlineContent){let c=s.whitespace=="pre",f=!!s.contentMatch.matchType(i);c&&!f?r=!1:!c&&f&&(r=!0)}let l=t.steps.length;if(r===!1){let c=t.doc.resolve(e+n);em(t,c.node(),c.before(),l)}s.inlineContent&&bu(t,e+n-1,s,o.node().contentMatchAt(o.index()),r==null);let a=t.mapping.slice(l),u=a.map(e-n);if(t.step(new Se(u,a.map(e+n,-1),E.empty,!0)),r===!0){let c=t.doc.resolve(u);Zd(t,c.node(),c.before(),t.steps.length)}return t}function a1(t,e,n){let r=t.resolve(e);if(r.parent.canReplaceWith(r.index(),r.index(),n))return e;if(r.parentOffset==0)for(let i=r.depth-1;i>=0;i--){let o=r.index(i);if(r.node(i).canReplaceWith(o,o,n))return r.before(i+1);if(o>0)return null}if(r.parentOffset==r.parent.content.size)for(let i=r.depth-1;i>=0;i--){let o=r.indexAfter(i);if(r.node(i).canReplaceWith(o,o,n))return r.after(i+1);if(o<r.node(i).childCount)return null}return null}function tm(t,e,n){let r=t.resolve(e);if(!n.content.size)return e;let i=n.content;for(let o=0;o<n.openStart;o++)i=i.firstChild.content;for(let o=1;o<=(n.openStart==0&&n.size?2:1);o++)for(let s=r.depth;s>=0;s--){let l=s==r.depth?0:r.pos<=(r.start(s+1)+r.end(s+1))/2?-1:1;for(let a=0;a<2;a++){if(a){if(!l)break;l=-l}let u=r.index(s)+(l>0?1:0),c=r.node(s),f=!1;if(o==1)f=c.canReplace(u,u,i);else{let h=c.contentMatchAt(u).findWrapping(i.firstChild.type);f=h&&c.canReplaceWith(u,u,h[0])}if(f)return l==0?r.pos:l<0?r.before(s+1):r.after(s+1)}}return null}function To(t,e,n=e,r=E.empty){if(e==n&&!r.size)return null;let i=t.resolve(e),o=t.resolve(n);return nm(i,o,r)?new Se(e,n,r):new ku(i,o,r).fit()}function nm(t,e,n){return!n.openStart&&!n.openEnd&&t.start()==e.start()&&t.parent.canReplace(t.index(),e.index(),n.content)}var ku=class{constructor(e,n,r){this.$from=e,this.$to=n,this.unplaced=r,this.frontier=[],this.placed=A.empty;for(let i=0;i<=e.depth;i++){let o=e.node(i);this.frontier.push({type:o.type,match:o.contentMatchAt(e.indexAfter(i))})}for(let i=e.depth;i>0;i--)this.placed=A.from(e.node(i).copy(this.placed))}get depth(){return this.frontier.length-1}fit(){for(;this.unplaced.size;){let u=this.findFittable();u?this.placeNodes(u):this.openMore()||this.dropNode()}let e=this.mustMoveInline(),n=this.placed.size-this.depth-this.$from.depth,r=this.$from,i=this.close(e<0?this.$to:r.doc.resolve(e));if(!i)return null;let o=this.placed,s=r.depth,l=i.depth;for(;s&&l&&o.childCount==1;)o=o.firstChild.content,s--,l--;let a=new E(o,s,l);return e>-1?new Me(r.pos,e,this.$to.pos,this.$to.end(),a,n):a.size||r.pos!=this.$to.pos?new Se(r.pos,i.pos,a):null}findFittable(){let e=this.unplaced.openStart;for(let n=this.unplaced.content,r=0,i=this.unplaced.openEnd;r<e;r++){let o=n.firstChild;if(n.childCount>1&&(i=0),o.type.spec.isolating&&i<=r){e=r;break}n=o.content}for(let n=1;n<=2;n++)for(let r=n==1?e:this.unplaced.openStart;r>=0;r--){let i,o=null;r?(o=Kd(this.unplaced.content,r-1).firstChild,i=o.content):i=this.unplaced.content;let s=i.firstChild;for(let l=this.depth;l>=0;l--){let{type:a,match:u}=this.frontier[l],c,f=null;if(n==1&&(s?u.matchType(s.type)||(f=u.fillBefore(A.from(s),!1)):o&&a.compatibleContent(o.type)))return{sliceDepth:r,frontierDepth:l,parent:o,inject:f};if(n==2&&s&&(c=u.findWrapping(s.type)))return{sliceDepth:r,frontierDepth:l,parent:o,wrap:c};if(o&&u.matchType(o.type))break}}}openMore(){let{content:e,openStart:n,openEnd:r}=this.unplaced;return Jd(e,-1)<=n?!1:(this.unplaced.size>1&&Jd(e,1)>r&&r++,this.unplaced=new E(e,n+1,r),!0)}dropNode(){let{content:e,openStart:n,openEnd:r}=this.unplaced,i=Kd(e,n);if(i.childCount<=1&&n>0){let o=e.size-n<=n+i.size;this.unplaced=new E(wo(e,n-1,1),n-1,o?n-1:r)}else this.unplaced=new E(wo(e,n,1),n,r)}placeNodes({sliceDepth:e,frontierDepth:n,parent:r,inject:i,wrap:o}){for(;this.depth>n;)this.closeFrontierNode();if(o)for(let m=0;m<o.length;m++)this.openFrontierNode(o[m]);let s=this.unplaced,l=r?r.content:s.content,a=s.openStart-e,u=0,c=[],{match:f,type:h}=this.frontier[n];if(i){for(let m=0;m<i.childCount;m++)c.push(i.child(m));f=f.matchFragment(i)}let p=l.size+e-(s.content.size-s.openEnd);for(;u<l.childCount;){let m=l.child(u),y=f.matchType(m.type);if(!y)break;u++,(u>1||a==0||m.content.size)&&(f=y,c.push(rm(m.mark(h.allowedMarks(m.marks)),u==1?a:0,u==l.childCount?p:-1)))}let d=u==l.childCount;d||(p=-1),this.placed=Co(this.placed,n,A.from(c)),this.frontier[n].match=f,d&&p<0&&r&&r.type==this.frontier[this.depth].type&&this.frontier.length>1&&this.closeFrontierNode();for(let m=0,y=c[c.length-1];y&&m<p;m++)this.frontier.push({type:y.type,match:y.contentMatchAt(y.childCount)}),y=y.lastChild;this.unplaced=d?e==0?E.empty:new E(wo(s.content,e-1,1),e-1,p<0?s.openEnd:e-1):new E(wo(s.content,e,u),e,s.openEnd)}mustMoveInline(){if(!this.$to.parent.isTextblock)return-1;let e=this.frontier[this.depth],n;if(!e.type.isTextblock||!gu(this.$to,this.$to.depth,e.type,e.match,!1)||this.$to.depth==this.depth&&(n=this.findCloseLevel(this.$to))&&n.depth==this.depth)return-1;let{depth:r}=this.$to,i=this.$to.after(r);for(;r>1&&i==this.$to.end(--r);)++i;return i}findCloseLevel(e){e:for(let n=Math.min(this.depth,e.depth);n>=0;n--){let{match:r,type:i}=this.frontier[n],o=n<e.depth&&e.end(n+1)==e.pos+(e.depth-(n+1)),s=gu(e,n,i,r,o);if(s){for(let l=n-1;l>=0;l--){let{match:a,type:u}=this.frontier[l],c=gu(e,l,u,a,!0);if(!c||c.childCount)continue e}return{depth:n,fit:s,move:o?e.doc.resolve(e.after(n+1)):e}}}}close(e){let n=this.findCloseLevel(e);if(!n)return null;for(;this.depth>n.depth;)this.closeFrontierNode();n.fit.childCount&&(this.placed=Co(this.placed,n.depth,n.fit)),e=n.move;for(let r=n.depth+1;r<=e.depth;r++){let i=e.node(r),o=i.type.contentMatch.fillBefore(i.content,!0,e.index(r));this.openFrontierNode(i.type,i.attrs,o)}return e}openFrontierNode(e,n=null,r){let i=this.frontier[this.depth];i.match=i.match.matchType(e),this.placed=Co(this.placed,this.depth,A.from(e.create(n,r))),this.frontier.push({type:e,match:e.contentMatch})}closeFrontierNode(){let n=this.frontier.pop().match.fillBefore(A.empty,!0);n.childCount&&(this.placed=Co(this.placed,this.frontier.length,n))}};function wo(t,e,n){return e==0?t.cutByIndex(n,t.childCount):t.replaceChild(0,t.firstChild.copy(wo(t.firstChild.content,e-1,n)))}function Co(t,e,n){return e==0?t.append(n):t.replaceChild(t.childCount-1,t.lastChild.copy(Co(t.lastChild.content,e-1,n)))}function Kd(t,e){for(let n=0;n<e;n++)t=t.firstChild.content;return t}function rm(t,e,n){if(e<=0)return t;let r=t.content;return e>1&&(r=r.replaceChild(0,rm(r.firstChild,e-1,r.childCount==1?n-1:0))),e>0&&(r=t.type.contentMatch.fillBefore(r).append(r),n<=0&&(r=r.append(t.type.contentMatch.matchFragment(r).fillBefore(A.empty,!0)))),t.copy(r)}function gu(t,e,n,r,i){let o=t.node(e),s=i?t.indexAfter(e):t.index(e);if(s==o.childCount&&!n.compatibleContent(o.type))return null;let l=r.fillBefore(o.content,!0,s);return l&&!u1(n,o.content,s)?l:null}function u1(t,e,n){for(let r=n;r<e.childCount;r++)if(!t.allowsMarks(e.child(r).marks))return!0;return!1}function c1(t){return t.spec.defining||t.spec.definingForContent}function Jd(t,e){for(let n=0;;n++){let r=e<0?t.firstChild:t.lastChild;if(!r||r.isAtom)return n;t=r.content}}function f1(t,e,n,r){if(!r.size)return t.deleteRange(e,n);let i=t.doc.resolve(e),o=t.doc.resolve(n);if(nm(i,o,r))return t.step(new Se(e,n,r));let s=om(i,o);s[s.length-1]==0&&s.pop();let l=-(i.depth+1);s.unshift(l);for(let h=i.depth,p=i.pos-1;h>0;h--,p--){let d=i.node(h).type.spec;if(d.defining||d.definingAsContext||d.isolating)break;s.indexOf(h)>-1?l=h:i.before(h)==p&&s.splice(1,0,-h)}let a=s.indexOf(l),u=[],c=r.openStart;for(let h=r.content,p=0;;p++){let d=h.firstChild;if(u.push(d),p==r.openStart)break;h=d.content}for(let h=c-1;h>=0;h--){let p=u[h],d=c1(p.type);if(d&&!p.sameMarkup(i.node(Math.abs(l)-1)))c=h;else if(d||!p.type.isTextblock)break}for(let h=r.openStart;h>=0;h--){let p=(h+c+1)%(r.openStart+1),d=u[p];if(d)for(let m=0;m<s.length;m++){let y=s[(m+a)%s.length],g=!0;y<0&&(g=!1,y=-y);let M=i.node(y-1),w=i.index(y-1);if(M.canReplaceWith(w,w,d.type,d.marks))return t.replace(i.before(y),g?o.after(y):n,new E(im(r.content,0,r.openStart,p),p,r.openEnd))}}let f=t.steps.length;for(let h=s.length-1;h>=0&&(t.replace(e,n,r),!(t.steps.length>f));h--){let p=s[h];p<0||(e=i.before(p),n=o.after(p))}}function im(t,e,n,r,i){if(e<n){let o=t.firstChild;t=t.replaceChild(0,o.copy(im(o.content,e+1,n,r,o)))}if(e>r){let o=i.contentMatchAt(0),s=o.fillBefore(t).append(t);t=s.append(o.matchFragment(s).fillBefore(A.empty,!0))}return t}function h1(t,e,n,r){if(!r.isInline&&e==n&&t.doc.resolve(e).parent.content.size){let i=a1(t.doc,e,r.type);i!=null&&(e=n=i)}t.replaceRange(e,n,new E(A.from(r),0,0))}function p1(t,e,n){let r=t.doc.resolve(e),i=t.doc.resolve(n);if(r.parent.isTextblock&&i.parent.isTextblock&&r.start()!=i.start()&&r.parentOffset==0&&i.parentOffset==0){let s=r.sharedDepth(n),l=!1;for(let a=r.depth;a>s;a--)r.node(a).type.spec.isolating&&(l=!0);for(let a=i.depth;a>s;a--)i.node(a).type.spec.isolating&&(l=!0);if(!l){for(let a=r.depth;a>0&&e==r.start(a);a--)e=r.before(a);for(let a=i.depth;a>0&&n==i.start(a);a--)n=i.before(a);r=t.doc.resolve(e),i=t.doc.resolve(n)}}let o=om(r,i);for(let s=0;s<o.length;s++){let l=o[s],a=s==o.length-1;if(a&&l==0||r.node(l).type.contentMatch.validEnd)return t.delete(r.start(l),i.end(l));if(l>0&&(a||r.node(l-1).canReplace(r.index(l-1),i.indexAfter(l-1))))return t.delete(r.before(l),i.after(l))}for(let s=1;s<=r.depth&&s<=i.depth;s++)if(e-r.start(s)==r.depth-s&&n>r.end(s)&&i.end(s)-n!=i.depth-s&&r.start(s-1)==i.start(s-1)&&r.node(s-1).canReplace(r.index(s-1),i.index(s-1)))return t.delete(r.before(s),n);t.delete(e,n)}function om(t,e){let n=[],r=Math.min(t.depth,e.depth);for(let i=r;i>=0;i--){let o=t.start(i);if(o<t.pos-(t.depth-i)||e.end(i)>e.pos+(e.depth-i)||t.node(i).type.spec.isolating||e.node(i).type.spec.isolating)break;(o==e.start(i)||i==t.depth&&i==e.depth&&t.parent.inlineContent&&e.parent.inlineContent&&i&&e.start(i-1)==o-1)&&n.push(i)}return n}var pl=class t extends he{constructor(e,n,r){super(),this.pos=e,this.attr=n,this.value=r}apply(e){let n=e.nodeAt(this.pos);if(!n)return be.fail("No node at attribute step's position");let r=Object.create(null);for(let o in n.attrs)r[o]=n.attrs[o];r[this.attr]=this.value;let i=n.type.create(r,null,n.marks);return be.fromReplace(e,this.pos,this.pos+1,new E(A.from(i),0,n.isLeaf?0:1))}getMap(){return Ut.empty}invert(e){return new t(this.pos,this.attr,e.nodeAt(this.pos).attrs[this.attr])}map(e){let n=e.mapResult(this.pos,1);return n.deletedAfter?null:new t(n.pos,this.attr,this.value)}toJSON(){return{stepType:"attr",pos:this.pos,attr:this.attr,value:this.value}}static fromJSON(e,n){if(typeof n.pos!="number"||typeof n.attr!="string")throw new RangeError("Invalid input for AttrStep.fromJSON");return new t(n.pos,n.attr,n.value)}};he.jsonID("attr",pl);var dl=class t extends he{constructor(e,n){super(),this.attr=e,this.value=n}apply(e){let n=Object.create(null);for(let i in e.attrs)n[i]=e.attrs[i];n[this.attr]=this.value;let r=e.type.create(n,e.content,e.marks);return be.ok(r)}getMap(){return Ut.empty}invert(e){return new t(this.attr,e.attrs[this.attr])}map(e){return this}toJSON(){return{stepType:"docAttr",attr:this.attr,value:this.value}}static fromJSON(e,n){if(typeof n.attr!="string")throw new RangeError("Invalid input for DocAttrStep.fromJSON");return new t(n.attr,n.value)}};he.jsonID("docAttr",dl);var Gr=class extends Error{};Gr=function t(e){let n=Error.call(this,e);return n.__proto__=t.prototype,n};Gr.prototype=Object.create(Error.prototype);Gr.prototype.constructor=Gr;Gr.prototype.name="TransformError";var Qr=class{constructor(e){this.doc=e,this.steps=[],this.docs=[],this.mapping=new Mo}get before(){return this.docs.length?this.docs[0]:this.doc}step(e){let n=this.maybeStep(e);if(n.failed)throw new Gr(n.failed);return this}maybeStep(e){let n=e.apply(this.doc);return n.failed||this.addStep(e,n.doc),n}get docChanged(){return this.steps.length>0}changedRange(){let e=1e9,n=-1e9;for(let r=0;r<this.mapping.maps.length;r++){let i=this.mapping.maps[r];r&&(e=i.map(e,1),n=i.map(n,-1)),i.forEach((o,s,l,a)=>{e=Math.min(e,l),n=Math.max(n,a)})}return e==1e9?null:{from:e,to:n}}addStep(e,n){this.docs.push(this.doc),this.steps.push(e),this.mapping.appendMap(e.getMap()),this.doc=n}replace(e,n=e,r=E.empty){let i=To(this.doc,e,n,r);return i&&this.step(i),this}replaceWith(e,n,r){return this.replace(e,n,new E(A.from(r),0,0))}delete(e,n){return this.replace(e,n,E.empty)}insert(e,n){return this.replaceWith(e,e,n)}replaceRange(e,n,r){return f1(this,e,n,r),this}replaceRangeWith(e,n,r){return h1(this,e,n,r),this}deleteRange(e,n){return p1(this,e,n),this}lift(e,n){return Y0(this,e,n),this}join(e,n=1){return l1(this,e,n),this}wrap(e,n){return e1(this,e,n),this}setBlockType(e,n=e,r,i=null){return t1(this,e,n,r,i),this}setNodeMarkup(e,n,r=null,i){return r1(this,e,n,r,i),this}setNodeAttribute(e,n,r){return this.step(new pl(e,n,r)),this}setDocAttribute(e,n){return this.step(new dl(e,n)),this}addNodeMark(e,n){return this.step(new Io(e,n)),this}removeNodeMark(e,n){let r=this.doc.nodeAt(e);if(!r)throw new RangeError("No node at position "+e);if(n instanceof Z)n.isInSet(r.marks)&&this.step(new Ur(e,n));else{let i=r.marks,o,s=[];for(;o=n.isInSet(i);)s.push(new Ur(e,o)),i=o.removeFromSet(i);for(let l=s.length-1;l>=0;l--)this.step(s[l])}return this}split(e,n=1,r){return i1(this,e,n,r),this}addMark(e,n,r){return U0(this,e,n,r),this}removeMark(e,n,r){return G0(this,e,n,r),this}clearIncompatible(e,n,r){return bu(this,e,n,r),this}};var wu=Object.create(null),_=class{constructor(e,n,r){this.$anchor=e,this.$head=n,this.ranges=r||[new Sn(e.min(n),e.max(n))]}get anchor(){return this.$anchor.pos}get head(){return this.$head.pos}get from(){return this.$from.pos}get to(){return this.$to.pos}get $from(){return this.ranges[0].$from}get $to(){return this.ranges[0].$to}get empty(){let e=this.ranges;for(let n=0;n<e.length;n++)if(e[n].$from.pos!=e[n].$to.pos)return!1;return!0}content(){return this.$from.doc.slice(this.from,this.to,!0)}replace(e,n=E.empty){let r=n.content.lastChild,i=null;for(let l=0;l<n.openEnd;l++)i=r,r=r.lastChild;let o=e.steps.length,s=this.ranges;for(let l=0;l<s.length;l++){let{$from:a,$to:u}=s[l],c=e.mapping.slice(o);e.replaceRange(c.map(a.pos),c.map(u.pos),l?E.empty:n),l==0&&am(e,o,(r?r.isInline:i&&i.isTextblock)?-1:1)}}replaceWith(e,n){let r=e.steps.length,i=this.ranges;for(let o=0;o<i.length;o++){let{$from:s,$to:l}=i[o],a=e.mapping.slice(r),u=a.map(s.pos),c=a.map(l.pos);o?e.deleteRange(u,c):(e.replaceRangeWith(u,c,n),am(e,r,n.isInline?-1:1))}}static findFrom(e,n,r=!1){let i=e.parent.inlineContent?new j(e):Xr(e.node(0),e.parent,e.pos,e.index(),n,r);if(i)return i;for(let o=e.depth-1;o>=0;o--){let s=n<0?Xr(e.node(0),e.node(o),e.before(o+1),e.index(o),n,r):Xr(e.node(0),e.node(o),e.after(o+1),e.index(o)+1,n,r);if(s)return s}return null}static near(e,n=1){return this.findFrom(e,n)||this.findFrom(e,-n)||new nt(e.node(0))}static atStart(e){return Xr(e,e,0,0,1)||new nt(e)}static atEnd(e){return Xr(e,e,e.content.size,e.childCount,-1)||new nt(e)}static fromJSON(e,n){if(!n||!n.type)throw new RangeError("Invalid input for Selection.fromJSON");let r=wu[n.type];if(!r)throw new RangeError(`No selection type ${n.type} defined`);return r.fromJSON(e,n)}static jsonID(e,n){if(e in wu)throw new RangeError("Duplicate use of selection JSON ID "+e);return wu[e]=n,n.prototype.jsonID=e,n}getBookmark(){return j.between(this.$anchor,this.$head).getBookmark()}};_.prototype.visible=!0;var Sn=class{constructor(e,n){this.$from=e,this.$to=n}},sm=!1;function lm(t){!sm&&!t.parent.inlineContent&&(sm=!0,console.warn("TextSelection endpoint not pointing into a node with inline content ("+t.parent.type.name+")"))}var j=class t extends _{constructor(e,n=e){lm(e),lm(n),super(e,n)}get $cursor(){return this.$anchor.pos==this.$head.pos?this.$head:null}map(e,n){let r=e.resolve(n.map(this.head));if(!r.parent.inlineContent)return _.near(r);let i=e.resolve(n.map(this.anchor));return new t(i.parent.inlineContent?i:r,r)}replace(e,n=E.empty){if(super.replace(e,n),n==E.empty){let r=this.$from.marksAcross(this.$to);r&&e.ensureMarks(r)}}eq(e){return e instanceof t&&e.anchor==this.anchor&&e.head==this.head}getBookmark(){return new gl(this.anchor,this.head)}toJSON(){return{type:"text",anchor:this.anchor,head:this.head}}static fromJSON(e,n){if(typeof n.anchor!="number"||typeof n.head!="number")throw new RangeError("Invalid input for TextSelection.fromJSON");return new t(e.resolve(n.anchor),e.resolve(n.head))}static create(e,n,r=n){let i=e.resolve(n);return new this(i,r==n?i:e.resolve(r))}static between(e,n,r){let i=e.pos-n.pos;if((!r||i)&&(r=i>=0?1:-1),!n.parent.inlineContent){let o=_.findFrom(n,r,!0)||_.findFrom(n,-r,!0);if(o)n=o.$head;else return _.near(n,r)}return e.parent.inlineContent||(i==0?e=n:(e=(_.findFrom(e,-r,!0)||_.findFrom(e,r,!0)).$anchor,e.pos<n.pos!=i<0&&(e=n))),new t(e,n)}};_.jsonID("text",j);var gl=class t{constructor(e,n){this.anchor=e,this.head=n}map(e){return new t(e.map(this.anchor),e.map(this.head))}resolve(e){return j.between(e.resolve(this.anchor),e.resolve(this.head))}},H=class t extends _{constructor(e){let n=e.nodeAfter,r=e.node(0).resolve(e.pos+n.nodeSize);super(e,r),this.node=n}map(e,n){let{deleted:r,pos:i}=n.mapResult(this.anchor),o=e.resolve(i);return r?_.near(o):new t(o)}content(){return new E(A.from(this.node),0,0)}eq(e){return e instanceof t&&e.anchor==this.anchor}toJSON(){return{type:"node",anchor:this.anchor}}getBookmark(){return new Su(this.anchor)}static fromJSON(e,n){if(typeof n.anchor!="number")throw new RangeError("Invalid input for NodeSelection.fromJSON");return new t(e.resolve(n.anchor))}static create(e,n){return new t(e.resolve(n))}static isSelectable(e){return!e.isText&&e.type.spec.selectable!==!1}};H.prototype.visible=!1;_.jsonID("node",H);var Su=class t{constructor(e){this.anchor=e}map(e){let{deleted:n,pos:r}=e.mapResult(this.anchor);return n?new gl(r,r):new t(r)}resolve(e){let n=e.resolve(this.anchor),r=n.nodeAfter;return r&&H.isSelectable(r)?new H(n):_.near(n)}},nt=class t extends _{constructor(e){super(e.resolve(0),e.resolve(e.content.size))}replace(e,n=E.empty){if(n==E.empty){e.delete(0,e.doc.content.size);let r=_.atStart(e.doc);r.eq(e.selection)||e.setSelection(r)}else super.replace(e,n)}toJSON(){return{type:"all"}}static fromJSON(e){return new t(e)}map(e){return new t(e)}eq(e){return e instanceof t}getBookmark(){return d1}};_.jsonID("all",nt);var d1={map(){return this},resolve(t){return new nt(t)}};function Xr(t,e,n,r,i,o=!1){if(e.inlineContent)return j.create(t,n);for(let s=r-(i>0?0:1);i>0?s<e.childCount:s>=0;s+=i){let l=e.child(s);if(l.isAtom){if(!o&&H.isSelectable(l))return H.create(t,n-(i<0?l.nodeSize:0))}else{let a=Xr(t,l,n+i,i<0?l.childCount:0,i,o);if(a)return a}n+=l.nodeSize*i}return null}function am(t,e,n){let r=t.steps.length-1;if(r<e)return;let i=t.steps[r];if(!(i instanceof Se||i instanceof Me))return;let o=t.mapping.maps[r],s;o.forEach((l,a,u,c)=>{s==null&&(s=c)}),t.setSelection(_.near(t.doc.resolve(s),n))}var um=1,ml=2,cm=4,Mu=class extends Qr{constructor(e){super(e.doc),this.curSelectionFor=0,this.updated=0,this.meta=Object.create(null),this.time=Date.now(),this.curSelection=e.selection,this.storedMarks=e.storedMarks}get selection(){return this.curSelectionFor<this.steps.length&&(this.curSelection=this.curSelection.map(this.doc,this.mapping.slice(this.curSelectionFor)),this.curSelectionFor=this.steps.length),this.curSelection}setSelection(e){if(e.$from.doc!=this.doc)throw new RangeError("Selection passed to setSelection must point at the current document");return this.curSelection=e,this.curSelectionFor=this.steps.length,this.updated=(this.updated|um)&~ml,this.storedMarks=null,this}get selectionSet(){return(this.updated&um)>0}setStoredMarks(e){return this.storedMarks=e,this.updated|=ml,this}ensureMarks(e){return Z.sameSet(this.storedMarks||this.selection.$from.marks(),e)||this.setStoredMarks(e),this}addStoredMark(e){return this.ensureMarks(e.addToSet(this.storedMarks||this.selection.$head.marks()))}removeStoredMark(e){return this.ensureMarks(e.removeFromSet(this.storedMarks||this.selection.$head.marks()))}get storedMarksSet(){return(this.updated&ml)>0}addStep(e,n){super.addStep(e,n),this.updated=this.updated&~ml,this.storedMarks=null}setTime(e){return this.time=e,this}replaceSelection(e){return this.selection.replace(this,e),this}replaceSelectionWith(e,n=!0){let r=this.selection;return n&&(e=e.mark(this.storedMarks||(r.empty?r.$from.marks():r.$from.marksAcross(r.$to)||Z.none))),r.replaceWith(this,e),this}deleteSelection(){return this.selection.replace(this),this}insertText(e,n,r){let i=this.doc.type.schema;if(n==null)return e?this.replaceSelectionWith(i.text(e),!0):this.deleteSelection();{if(r==null&&(r=n),!e)return this.deleteRange(n,r);let o=this.storedMarks;if(!o){let s=this.doc.resolve(n);o=r==n?s.marks():s.marksAcross(this.doc.resolve(r))}return this.replaceRangeWith(n,r,i.text(e,o)),!this.selection.empty&&this.selection.to==n+e.length&&this.setSelection(_.near(this.selection.$to)),this}}setMeta(e,n){return this.meta[typeof e=="string"?e:e.key]=n,this}getMeta(e){return this.meta[typeof e=="string"?e:e.key]}get isGeneric(){for(let e in this.meta)return!1;return!0}scrollIntoView(){return this.updated|=cm,this}get scrolledIntoView(){return(this.updated&cm)>0}};function fm(t,e){return!e||!t?t:t.bind(e)}var Xn=class{constructor(e,n,r){this.name=e,this.init=fm(n.init,r),this.apply=fm(n.apply,r)}},m1=[new Xn("doc",{init(t){return t.doc||t.schema.topNodeType.createAndFill()},apply(t){return t.doc}}),new Xn("selection",{init(t,e){return t.selection||_.atStart(e.doc)},apply(t){return t.selection}}),new Xn("storedMarks",{init(t){return t.storedMarks||null},apply(t,e,n,r){return r.selection.$cursor?t.storedMarks:null}}),new Xn("scrollToSelection",{init(){return 0},apply(t,e){return t.scrolledIntoView?e+1:e}})],Ao=class{constructor(e,n){this.schema=e,this.plugins=[],this.pluginsByKey=Object.create(null),this.fields=m1.slice(),n&&n.forEach(r=>{if(this.pluginsByKey[r.key])throw new RangeError("Adding different instances of a keyed plugin ("+r.key+")");this.plugins.push(r),this.pluginsByKey[r.key]=r,r.spec.state&&this.fields.push(new Xn(r.key,r.spec.state,r))})}},Zr=class t{constructor(e){this.config=e}get schema(){return this.config.schema}get plugins(){return this.config.plugins}apply(e){return this.applyTransaction(e).state}filterTransaction(e,n=-1){for(let r=0;r<this.config.plugins.length;r++)if(r!=n){let i=this.config.plugins[r];if(i.spec.filterTransaction&&!i.spec.filterTransaction.call(i,e,this))return!1}return!0}applyTransaction(e){if(!this.filterTransaction(e))return{state:this,transactions:[]};let n=[e],r=this.applyInner(e),i=null;for(;;){let o=!1;for(let s=0;s<this.config.plugins.length;s++){let l=this.config.plugins[s];if(l.spec.appendTransaction){let a=i?i[s].n:0,u=i?i[s].state:this,c=a<n.length&&l.spec.appendTransaction.call(l,a?n.slice(a):n,u,r);if(c&&r.filterTransaction(c,s)){if(c.setMeta("appendedTransaction",e),!i){i=[];for(let f=0;f<this.config.plugins.length;f++)i.push(f<s?{state:r,n:n.length}:{state:this,n:0})}n.push(c),r=r.applyInner(c),o=!0}i&&(i[s]={state:r,n:n.length})}}if(!o)return{state:r,transactions:n}}}applyInner(e){if(!e.before.eq(this.doc))throw new RangeError("Applying a mismatched transaction");let n=new t(this.config),r=this.config.fields;for(let i=0;i<r.length;i++){let o=r[i];n[o.name]=o.apply(e,this[o.name],this,n)}return n}get tr(){return new Mu(this)}static create(e){let n=new Ao(e.doc?e.doc.type.schema:e.schema,e.plugins),r=new t(n);for(let i=0;i<n.fields.length;i++)r[n.fields[i].name]=n.fields[i].init(e,r);return r}reconfigure(e){let n=new Ao(this.schema,e.plugins),r=n.fields,i=new t(n);for(let o=0;o<r.length;o++){let s=r[o].name;i[s]=this.hasOwnProperty(s)?this[s]:r[o].init(e,i)}return i}toJSON(e){let n={doc:this.doc.toJSON(),selection:this.selection.toJSON()};if(this.storedMarks&&(n.storedMarks=this.storedMarks.map(r=>r.toJSON())),e&&typeof e=="object")for(let r in e){if(r=="doc"||r=="selection")throw new RangeError("The JSON fields `doc` and `selection` are reserved");let i=e[r],o=i.spec.state;o&&o.toJSON&&(n[r]=o.toJSON.call(i,this[i.key]))}return n}static fromJSON(e,n,r){if(!n)throw new RangeError("Invalid input for EditorState.fromJSON");if(!e.schema)throw new RangeError("Required config field 'schema' missing");let i=new Ao(e.schema,e.plugins),o=new t(i);return i.fields.forEach(s=>{if(s.name=="doc")o.doc=We.fromJSON(e.schema,n.doc);else if(s.name=="selection")o.selection=_.fromJSON(o.doc,n.selection);else if(s.name=="storedMarks")n.storedMarks&&(o.storedMarks=n.storedMarks.map(e.schema.markFromJSON));else{if(r)for(let l in r){let a=r[l],u=a.spec.state;if(a.key==s.name&&u&&u.fromJSON&&Object.prototype.hasOwnProperty.call(n,l)){o[s.name]=u.fromJSON.call(a,e,n[l],o);return}}o[s.name]=s.init(e,o)}}),o}};function hm(t,e,n){for(let r in t){let i=t[r];i instanceof Function?i=i.bind(e):r=="handleDOMEvents"&&(i=hm(i,e,{})),n[r]=i}return n}var te=class{constructor(e){this.spec=e,this.props={},e.props&&hm(e.props,this,this.props),this.key=e.key?e.key.key:pm("plugin")}getState(e){return e[this.key]}},Cu=Object.create(null);function pm(t){return t in Cu?t+"$"+ ++Cu[t]:(Cu[t]=0,t+"$")}var ne=class{constructor(e="key"){this.key=pm(e)}get(e){return e.config.pluginsByKey[this.key]}getState(e){return e[this.key]}};var yl=(t,e)=>t.selection.empty?!1:(e&&e(t.tr.deleteSelection().scrollIntoView()),!0);function mm(t,e){let{$cursor:n}=t.selection;return!n||(e?!e.endOfTextblock("backward",t):n.parentOffset>0)?null:n}var Iu=(t,e,n)=>{let r=mm(t,n);if(!r)return!1;let i=Au(r);if(!i){let s=r.blockRange(),l=s&&Yr(s);return l==null?!1:(e&&e(t.tr.lift(s,l).scrollIntoView()),!0)}let o=i.nodeBefore;if(km(t,i,e,-1))return!0;if(r.parent.content.size==0&&(ei(o,"end")||H.isSelectable(o)))for(let s=r.depth;;s--){let l=To(t.doc,r.before(s),r.after(s),E.empty);if(l&&l.slice.size<l.to-l.from){if(e){let a=t.tr.step(l);a.setSelection(ei(o,"end")?_.findFrom(a.doc.resolve(a.mapping.map(i.pos,-1)),-1):H.create(a.doc,i.pos-o.nodeSize)),e(a.scrollIntoView())}return!0}if(s==1||r.node(s-1).childCount>1)break}return o.isAtom&&i.depth==r.depth-1?(e&&e(t.tr.delete(i.pos-o.nodeSize,i.pos).scrollIntoView()),!0):!1},gm=(t,e,n)=>{let r=mm(t,n);if(!r)return!1;let i=Au(r);return i?g1(t,i,e):!1};function g1(t,e,n){let r=e.nodeBefore,i=r,o=e.pos-1;for(;!i.isTextblock;o--){if(i.type.spec.isolating)return!1;let c=i.lastChild;if(!c)return!1;i=c}let s=e.nodeAfter,l=s,a=e.pos+1;for(;!l.isTextblock;a++){if(l.type.spec.isolating)return!1;let c=l.firstChild;if(!c)return!1;l=c}let u=To(t.doc,o,a,E.empty);if(!u||u.from!=o||u instanceof Se&&u.slice.size>=a-o)return!1;if(n){let c=t.tr.step(u);c.setSelection(j.create(c.doc,o)),n(c.scrollIntoView())}return!0}function ei(t,e,n=!1){for(let r=t;r;r=e=="start"?r.firstChild:r.lastChild){if(r.isTextblock)return!0;if(n&&r.childCount!=1)return!1}return!1}var Tu=(t,e,n)=>{let{$head:r,empty:i}=t.selection,o=r;if(!i)return!1;if(r.parent.isTextblock){if(n?!n.endOfTextblock("backward",t):r.parentOffset>0)return!1;o=Au(r)}let s=o&&o.nodeBefore;return!s||!H.isSelectable(s)?!1:(e&&e(t.tr.setSelection(H.create(t.doc,o.pos-s.nodeSize)).scrollIntoView()),!0)};function Au(t){if(!t.parent.type.spec.isolating)for(let e=t.depth-1;e>=0;e--){if(t.index(e)>0)return t.doc.resolve(t.before(e+1));if(t.node(e).type.spec.isolating)break}return null}function y1(t,e){let{$cursor:n}=t.selection;return!n||(e?!e.endOfTextblock("forward",t):n.parentOffset<n.parent.content.size)?null:n}var k1=(t,e,n)=>{let r=y1(t,n);if(!r)return!1;let i=ym(r);if(!i)return!1;let o=i.nodeAfter;if(km(t,i,e,1))return!0;if(r.parent.content.size==0&&(ei(o,"start")||H.isSelectable(o))){let s=To(t.doc,r.before(),r.after(),E.empty);if(s&&s.slice.size<s.to-s.from){if(e){let l=t.tr.step(s);l.setSelection(ei(o,"start")?_.findFrom(l.doc.resolve(l.mapping.map(i.pos)),1):H.create(l.doc,l.mapping.map(i.pos))),e(l.scrollIntoView())}return!0}}return o.isAtom&&i.depth==r.depth-1?(e&&e(t.tr.delete(i.pos,i.pos+o.nodeSize).scrollIntoView()),!0):!1},x1=(t,e,n)=>{let{$head:r,empty:i}=t.selection,o=r;if(!i)return!1;if(r.parent.isTextblock){if(n?!n.endOfTextblock("forward",t):r.parentOffset<r.parent.content.size)return!1;o=ym(r)}let s=o&&o.nodeAfter;return!s||!H.isSelectable(s)?!1:(e&&e(t.tr.setSelection(H.create(t.doc,o.pos)).scrollIntoView()),!0)};function ym(t){if(!t.parent.type.spec.isolating)for(let e=t.depth-1;e>=0;e--){let n=t.node(e);if(t.index(e)+1<n.childCount)return t.doc.resolve(t.after(e+1));if(n.type.spec.isolating)break}return null}var b1=(t,e)=>{let{$head:n,$anchor:r}=t.selection;return!n.parent.type.spec.code||!n.sameParent(r)?!1:(e&&e(t.tr.insertText(`
`).scrollIntoView()),!0)};function vu(t){for(let e=0;e<t.edgeCount;e++){let{type:n}=t.edge(e);if(n.isTextblock&&!n.hasRequiredAttrs())return n}return null}var w1=(t,e)=>{let{$head:n,$anchor:r}=t.selection;if(!n.parent.type.spec.code||!n.sameParent(r))return!1;let i=n.node(-1),o=n.indexAfter(-1),s=vu(i.contentMatchAt(o));if(!s||!i.canReplaceWith(o,o,s))return!1;if(e){let l=n.after(),a=t.tr.replaceWith(l,l,s.createAndFill());a.setSelection(_.near(a.doc.resolve(l),1)),e(a.scrollIntoView())}return!0},C1=(t,e)=>{let n=t.selection,{$from:r,$to:i}=n;if(n instanceof nt||r.parent.inlineContent||i.parent.inlineContent)return!1;let o=vu(i.parent.contentMatchAt(i.indexAfter()));if(!o||!o.isTextblock)return!1;if(e){let s=(!r.parentOffset&&i.index()<i.parent.childCount?r:i).pos,l=t.tr.insert(s,o.createAndFill());l.setSelection(j.create(l.doc,s+1)),e(l.scrollIntoView())}return!0},S1=(t,e)=>{let{$cursor:n}=t.selection;if(!n||n.parent.content.size)return!1;if(n.depth>1&&n.after()!=n.end(-1)){let o=n.before();if(Qn(t.doc,o))return e&&e(t.tr.split(o).scrollIntoView()),!0}let r=n.blockRange(),i=r&&Yr(r);return i==null?!1:(e&&e(t.tr.lift(r,i).scrollIntoView()),!0)};function M1(t){return(e,n)=>{if(e.selection instanceof H&&e.selection.node.isBlock){let{$from:p}=e.selection;return!p.parentOffset||!Qn(e.doc,p.pos)?!1:(n&&n(e.tr.split(p.pos).scrollIntoView()),!0)}if(!e.selection.$from.depth)return!1;let r=e.tr;!e.selection.empty&&(e.selection instanceof j||e.selection instanceof nt)&&r.deleteSelection();let{$from:i}=r.selection,o=r.steps.length,s=[],l,a,u=!1,c=!1;for(let p=i.depth;;p--)if(i.node(p).isBlock){u=i.end(p)==i.pos+(i.depth-p),c=i.start(p)==i.pos-(i.depth-p),a=vu(i.node(p-1).contentMatchAt(i.indexAfter(p-1)));let m=t&&t(i.parent,u,i);s.unshift(m||(u&&a?{type:a}:null)),l=p;break}else{if(p==1)return!1;s.unshift(null)}let f=i.pos,h=Qn(r.doc,f,s.length,s);if(h||(s[0]=a?{type:a}:null,h=Qn(r.doc,f,s.length,s)),!h)return!1;if(r.split(f,s.length,s),!u&&c&&i.node(l).type!=a){let p=r.mapping.slice(o),d=p.map(i.before(l)),m=r.doc.resolve(d);a&&i.node(l-1).canReplaceWith(m.index(),m.index()+1,a)&&r.setNodeMarkup(p.map(i.before(l)),a)}return n&&n(r.scrollIntoView()),!0}}var N1=M1();var I1=(t,e)=>(e&&e(t.tr.setSelection(new nt(t.doc))),!0);function T1(t,e,n){let r=e.nodeBefore,i=e.nodeAfter,o=e.index();return!r||!i||!r.type.compatibleContent(i.type)?!1:!r.content.size&&e.parent.canReplace(o-1,o)?(n&&n(t.tr.delete(e.pos-r.nodeSize,e.pos).scrollIntoView()),!0):!e.parent.canReplace(o,o+1)||!(i.isTextblock||Yn(t.doc,e.pos))?!1:(n&&n(t.tr.join(e.pos).scrollIntoView()),!0)}function km(t,e,n,r){let i=e.nodeBefore,o=e.nodeAfter,s,l,a=i.type.spec.isolating||o.type.spec.isolating;if(!a&&T1(t,e,n))return!0;let u=!a&&e.parent.canReplace(e.index(),e.index()+1);if(u&&(s=(l=i.contentMatchAt(i.childCount)).findWrapping(o.type))&&l.matchType(s[0]||o.type).validEnd){if(n){let p=e.pos+o.nodeSize,d=A.empty;for(let g=s.length-1;g>=0;g--)d=A.from(s[g].create(null,d));d=A.from(i.copy(d));let m=t.tr.step(new Me(e.pos-1,p,e.pos,p,new E(d,1,0),s.length,!0)),y=m.doc.resolve(p+2*s.length);y.nodeAfter&&y.nodeAfter.type==i.type&&Yn(m.doc,y.pos)&&m.join(y.pos),n(m.scrollIntoView())}return!0}let c=o.type.spec.isolating||r>0&&a?null:_.findFrom(e,1),f=c&&c.$from.blockRange(c.$to),h=f&&Yr(f);if(h!=null&&h>=e.depth)return n&&n(t.tr.lift(f,h).scrollIntoView()),!0;if(u&&ei(o,"start",!0)&&ei(i,"end")){let p=i,d=[];for(;d.push(p),!p.isTextblock;)p=p.lastChild;let m=o,y=1;for(;!m.isTextblock;m=m.firstChild)y++;if(p.canReplace(p.childCount,p.childCount,m.content)){if(n){let g=A.empty;for(let w=d.length-1;w>=0;w--)g=A.from(d[w].copy(g));let M=t.tr.step(new Me(e.pos-d.length,e.pos+o.nodeSize,e.pos+y,e.pos+o.nodeSize-y,new E(g,d.length,0),0,!0));n(M.scrollIntoView())}return!0}}return!1}function xm(t){return function(e,n){let r=e.selection,i=t<0?r.$from:r.$to,o=i.depth;for(;i.node(o).isInline;){if(!o)return!1;o--}return i.node(o).isTextblock?(n&&n(e.tr.setSelection(j.create(e.doc,t<0?i.start(o):i.end(o)))),!0):!1}}var A1=xm(-1),v1=xm(1);function kl(t,e=null){return function(n,r){let{$from:i,$to:o}=n.selection,s=i.blockRange(o),l=s&&Gn(s,t,e);return l?(r&&r(n.tr.wrap(s,l).scrollIntoView()),!0):!1}}function ti(t,e=null){return function(n,r){let i=!1;for(let o=0;o<n.selection.ranges.length&&!i;o++){let{$from:{pos:s},$to:{pos:l}}=n.selection.ranges[o];n.doc.nodesBetween(s,l,(a,u)=>{if(i)return!1;if(!(!a.isTextblock||a.hasMarkup(t,e)))if(a.type==t)i=!0;else{let c=n.doc.resolve(u),f=c.index();i=c.parent.canReplaceWith(f,f+1,t)}})}if(!i)return!1;if(r){let o=n.tr;for(let s=0;s<n.selection.ranges.length;s++){let{$from:{pos:l},$to:{pos:a}}=n.selection.ranges[s];o.setBlockType(l,a,t,e)}r(o.scrollIntoView())}return!0}}function E1(t,e,n,r){for(let i=0;i<e.length;i++){let{$from:o,$to:s}=e[i],l=o.depth==0?t.inlineContent&&t.type.allowsMarkType(n):!1;if(t.nodesBetween(o.pos,s.pos,(a,u)=>{if(l||!r&&a.isAtom&&a.isInline&&u>=o.pos&&u+a.nodeSize<=s.pos)return!1;l=a.inlineContent&&a.type.allowsMarkType(n)}),l)return!0}return!1}function O1(t){let e=[];for(let n=0;n<t.length;n++){let{$from:r,$to:i}=t[n];r.doc.nodesBetween(r.pos,i.pos,(o,s)=>{if(o.isAtom&&o.content.size&&o.isInline&&s>=r.pos&&s+o.nodeSize<=i.pos)return s+1>r.pos&&e.push(new Sn(r,r.doc.resolve(s+1))),r=r.doc.resolve(s+1+o.content.size),!1}),r.pos<i.pos&&e.push(new Sn(r,i))}return e}function ni(t,e=null,n){let r=(n&&n.removeWhenPresent)!==!1,i=(n&&n.enterInlineAtoms)!==!1,o=!(n&&n.includeWhitespace);return function(s,l){let{empty:a,$cursor:u,ranges:c}=s.selection;if(a&&!u||!E1(s.doc,c,t,i))return!1;if(l)if(u)t.isInSet(s.storedMarks||u.marks())?l(s.tr.removeStoredMark(t)):l(s.tr.addStoredMark(t.create(e)));else{let f,h=s.tr;i||(c=O1(c)),r?f=!c.some(p=>s.doc.rangeHasMark(p.$from.pos,p.$to.pos,t)):f=!c.every(p=>{let d=!1;return h.doc.nodesBetween(p.$from.pos,p.$to.pos,(m,y,g)=>{if(d)return!1;d=!t.isInSet(m.marks)&&!!g&&g.type.allowsMarkType(t)&&!(m.isText&&/^\s*$/.test(m.textBetween(Math.max(0,p.$from.pos-y),Math.min(m.nodeSize,p.$to.pos-y))))}),!d});for(let p=0;p<c.length;p++){let{$from:d,$to:m}=c[p];if(!f)h.removeMark(d.pos,m.pos,t);else{let y=d.pos,g=m.pos,M=d.nodeAfter,w=m.nodeBefore,T=o&&M&&M.isText?/^\s*/.exec(M.text)[0].length:0,R=o&&w&&w.isText?/\s*$/.exec(w.text)[0].length:0;y+T<g&&(y+=T,g-=R),h.addMark(y,g,t.create(e))}}l(h.scrollIntoView())}return!0}}function Zn(...t){return function(e,n,r){for(let i=0;i<t.length;i++)if(t[i](e,n,r))return!0;return!1}}var Nu=Zn(yl,Iu,Tu),dm=Zn(yl,k1,x1),Qt={Enter:Zn(b1,C1,S1,N1),"Mod-Enter":w1,Backspace:Nu,"Mod-Backspace":Nu,"Shift-Backspace":Nu,Delete:dm,"Mod-Delete":dm,"Mod-a":I1},bm={"Ctrl-h":Qt.Backspace,"Alt-Backspace":Qt["Mod-Backspace"],"Ctrl-d":Qt.Delete,"Ctrl-Alt-Backspace":Qt["Mod-Delete"],"Alt-Delete":Qt["Mod-Delete"],"Alt-d":Qt["Mod-Delete"],"Ctrl-a":A1,"Ctrl-e":v1};for(let t in Qt)bm[t]=Qt[t];var R1=typeof navigator<"u"?/Mac|iP(hone|[oa]d)/.test(navigator.platform):typeof os<"u"&&os.platform?os.platform()=="darwin":!1,wm=R1?bm:Qt;var we=class{constructor(e,n,r={}){this.match=e,this.match=e,this.handler=typeof n=="string"?D1(n):n,this.undoable=r.undoable!==!1,this.inCode=r.inCode||!1,this.inCodeMark=r.inCodeMark!==!1}};function D1(t){return function(e,n,r,i){let o=t;if(n[1]){let s=n[0].lastIndexOf(n[1]);o+=n[0].slice(s+n[1].length),r+=s;let l=r-i;l>0&&(o=n[0].slice(s-l,s)+o,r=i)}return e.tr.insertText(o,r,i)}}var Cm=(t,e)=>{let n=t.plugins;for(let r=0;r<n.length;r++){let i=n[r],o;if(i.spec.isInputRules&&(o=i.getState(t))){if(e){let s=t.tr,l=o.transform;for(let a=l.steps.length-1;a>=0;a--)s.step(l.steps[a].invert(l.docs[a]));if(o.text){let a=s.doc.resolve(o.from).marks();s.replaceWith(o.from,o.to,t.schema.text(o.text,a))}else s.delete(o.from,o.to);e(s)}return!0}}return!1},sL=new we(/--$/,"\u2014",{inCodeMark:!1}),lL=new we(/\.\.\.$/,"\u2026",{inCodeMark:!1}),aL=new we(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/,"\u201C",{inCodeMark:!1}),uL=new we(/"$/,"\u201D",{inCodeMark:!1}),cL=new we(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/,"\u2018",{inCodeMark:!1}),fL=new we(/'$/,"\u2019",{inCodeMark:!1});function xl(t,e,n,r){let i,o;return e instanceof Ot?o=e:(i=e,o=e.nodeType,n=e.getAttrs,r=e.joinPredicate),new we(t,(s,l,a,u)=>{let c=n instanceof Function?n(l):n,f=s.tr.delete(a,u),h=f.doc.resolve(a),p=h.blockRange(),d=p&&Gn(p,o,c);if(!d)return null;f.wrap(p,d);let m=f.doc.resolve(a-1).nodeBefore;return m&&m.type==o&&Yn(f.doc,a-1)&&(!r||r(l,m))&&f.join(a-1),f},i)}function Eu(t,e,n){let r,i;return e instanceof Ot?i=e:(r=e,i=e.nodeType,n=e.getAttrs),new we(t,(o,s,l,a)=>{let u=o.doc.resolve(l),c=n instanceof Function?n(s):n;return u.node(-1).canReplaceWith(u.index(-1),u.indexAfter(-1),i)?o.tr.delete(l,a).setBlockType(l,l,i,c):null},r)}var Mn=typeof navigator<"u"?navigator:null,Sm=typeof document<"u"?document:null,Nn=Mn&&Mn.userAgent||"",Ru=/Edge\/(\d+)/.exec(Nn),Nm=/MSIE \d/.exec(Nn),Du=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Nn),Lu=!!(Nm||Du||Ru),yL=Nm?document.documentMode:Du?+Du[1]:Ru?+Ru[1]:0,P1=!Lu&&/gecko\/(\d+)/i.test(Nn),kL=P1&&+(/Firefox\/(\d+)/.exec(Nn)||[0,0])[1],Pu=!Lu&&/Chrome\/(\d+)/.exec(Nn),L1=!!Pu,xL=Pu?+Pu[1]:0,z1=!Lu&&!!Mn&&/Apple Computer/.test(Mn.vendor),B1=z1&&(/Mobile\/\w+/.test(Nn)||!!Mn&&Mn.maxTouchPoints>2),bL=B1||(Mn?/Mac/.test(Mn.platform):!1),F1=/Android \d/.test(Nn),_1=!!Sm&&"webkitFontSmoothing"in Sm.documentElement.style,wL=_1?+(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent)||[0,0])[1]:0;function Ou(t,e,n,r,i,o){if(t.composing)return!1;let s=t.state,l=s.doc.resolve(e);if(l.parent.type.spec.code)return!1;let a=l.parent.textBetween(Math.max(0,l.parentOffset-500),l.parentOffset,void 0,"\uFFFC")+r;for(let u of i){let c=u,f=c.match.exec(a),h=f&&f[0]&&c.handler(s,f,e-(f[0].length-r.length),n);if(h)return c.undoable!==!1&&h.setMeta(o,{transform:h,from:e,to:n,text:r}),t.dispatch(h),!0}return!1}var $1=new ne("MILKDOWN_CUSTOM_INPUTRULES");function Im({rules:t}){let e=new te({key:$1,isInputRules:!0,state:{init(){return null},apply(n,r){let i=n.getMeta(this);return i||(n.selectionSet||n.docChanged?null:r)}},props:{handleTextInput(n,r,i,o){return Ou(n,r,i,o,t,e)},handleDOMEvents:{compositionend:n=>(setTimeout(()=>{let{$cursor:r}=n.state.selection;r&&Ou(n,r.pos,r.pos,"",t,e)}),!1),keydown:(n,r)=>!(F1&&L1&&r.key==="Enter")||n.composing?!1:n.someProp("handleKeyDown",i=>i(n,r))?(r.preventDefault(),!0):!1},handleKeyDown(n,r){if(r.key!=="Enter")return!1;let{$cursor:i}=n.state.selection;return i?Ou(n,i.pos,i.pos,`
`,t,e):!1}}});return e}function Tm(t){return t.some(e=>e.type.spec.code)}function Mm(t,e,n){if(e>=n)return!1;let r=!1;return t.doc.nodesBetween(e,n,i=>(i.isInline&&Tm(i.marks)&&(r=!0),!r)),r}function V1(t,e){var n;return Tm((n=t.storedMarks)!=null?n:t.doc.resolve(e).marks())}function er(t,e,n={}){return new we(t,(r,i,o,s)=>{var l,a,u,c;let{tr:f}=r,h=i.length,p=i[h-1],d=i[0],m=[],y,g={group:p,fullMatch:d,start:o,end:s},M=(l=n.updateCaptured)==null?void 0:l.call(n,g);if(Object.assign(g,M),{group:p,fullMatch:d,start:o,end:s}=g,d===null||p?.trim()==="")return null;if(p){let w=d.search(/\S/),T=o+d.indexOf(p),R=T+p.length,C=Mm(r,o+w,T),L=R<s&&Mm(r,R,s);if(C||L||V1(r,s))return null;m=(a=f.storedMarks)!=null?a:[],R<s&&f.delete(R,s),T>o&&f.delete(o+w,T),y=o+w+p.length;let P=(u=n.getAttr)==null?void 0:u.call(n,i);f.addMark(o,y,e.create(P)),f.setStoredMarks(m),(c=n.beforeDispatch)==null||c.call(n,{match:i,start:o,end:s,tr:f})}return f})}function zu(t){return Object.assign(Object.create(t),t).setTime(Date.now())}function j1(t,e){return Array.isArray(t)&&t.includes(e.type)||e.type===t}function bl(t){if(t.content.childCount===1){let e=t.content.firstChild;if(e?.type.name==="text"&&e.marks.length===0)return e;if(e?.type.name==="paragraph"&&e.childCount===1){let n=e.firstChild;if(n?.type.name==="text"&&n.marks.length===0)return n}}return!1}function H1(t){return e=>{for(let n=e.depth;n>0;n-=1){let r=e.node(n);if(t(r)){let i=e.before(n),o=e.after(n);return{from:i,to:o,node:r}}}}}function Am(t,e){return H1(n=>n.type===e)(t)}function vm(t,e){let n=e.nodes[t];if(!n)throw Ph("node",t);return n}function Em(t){return e=>{for(let n=e.depth;n>0;n--){let r=e.node(n);if(t(r))return{pos:e.before(n),start:e.start(n),depth:n,node:r}}}}function Om(t,e){if(!(t instanceof H))return;let{node:n,$from:r}=t;if(j1(e,n))return{node:n,pos:r.pos,start:r.start(r.depth),depth:r.depth}}var Rm=(t,e)=>{let{selection:n,doc:r}=t;if(n instanceof H)return{hasNode:n.node.type===e,pos:n.from,target:n.node};let{from:i,to:o}=n,s=!1,l=-1,a=null;return r.nodesBetween(i,o,(u,c)=>a?!1:u.type===e?(s=!0,l=c,a=u,!1):!0),{hasNode:s,pos:l,target:a}};var Yt={8:"Backspace",9:"Tab",10:"Enter",12:"NumLock",13:"Enter",16:"Shift",17:"Control",18:"Alt",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",44:"PrintScreen",45:"Insert",46:"Delete",59:";",61:"=",91:"Meta",92:"Meta",106:"*",107:"+",108:",",109:"-",110:".",111:"/",144:"NumLock",145:"ScrollLock",160:"Shift",161:"Shift",162:"Control",163:"Control",164:"Alt",165:"Alt",173:"-",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},Cl={48:")",49:"!",50:"@",51:"#",52:"$",53:"%",54:"^",55:"&",56:"*",57:"(",59:":",61:"+",173:"_",186:":",187:"+",188:"<",189:"_",190:">",191:"?",192:"~",219:"{",220:"|",221:"}",222:'"'},W1=typeof navigator<"u"&&/Mac/.test(navigator.platform),q1=typeof navigator<"u"&&/MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);for(de=0;de<10;de++)Yt[48+de]=Yt[96+de]=String(de);var de;for(de=1;de<=24;de++)Yt[de+111]="F"+de;var de;for(de=65;de<=90;de++)Yt[de]=String.fromCharCode(de+32),Cl[de]=String.fromCharCode(de);var de;for(wl in Yt)Cl.hasOwnProperty(wl)||(Cl[wl]=Yt[wl]);var wl;function Dm(t){var e=W1&&t.metaKey&&t.shiftKey&&!t.ctrlKey&&!t.altKey||q1&&t.shiftKey&&t.key&&t.key.length==1||t.key=="Unidentified",n=!e&&t.key||(t.shiftKey?Cl:Yt)[t.keyCode]||t.key||"Unidentified";return n=="Esc"&&(n="Escape"),n=="Del"&&(n="Delete"),n=="Left"&&(n="ArrowLeft"),n=="Up"&&(n="ArrowUp"),n=="Right"&&(n="ArrowRight"),n=="Down"&&(n="ArrowDown"),n}var K1=typeof navigator<"u"&&/Mac|iP(hone|[oa]d)/.test(navigator.platform),J1=typeof navigator<"u"&&/Win/.test(navigator.platform);function U1(t){let e=t.split(/-(?!$)/),n=e[e.length-1];n=="Space"&&(n=" ");let r,i,o,s;for(let l=0;l<e.length-1;l++){let a=e[l];if(/^(cmd|meta|m)$/i.test(a))s=!0;else if(/^a(lt)?$/i.test(a))r=!0;else if(/^(c|ctrl|control)$/i.test(a))i=!0;else if(/^s(hift)?$/i.test(a))o=!0;else if(/^mod$/i.test(a))K1?s=!0:i=!0;else throw new Error("Unrecognized modifier name: "+a)}return r&&(n="Alt-"+n),i&&(n="Ctrl-"+n),s&&(n="Meta-"+n),o&&(n="Shift-"+n),n}function G1(t){let e=Object.create(null);for(let n in t)e[U1(n)]=t[n];return e}function Bu(t,e,n=!0){return e.altKey&&(t="Alt-"+t),e.ctrlKey&&(t="Ctrl-"+t),e.metaKey&&(t="Meta-"+t),n&&e.shiftKey&&(t="Shift-"+t),t}function Pm(t){return new te({props:{handleKeyDown:Fu(t)}})}function Fu(t){let e=G1(t);return function(n,r){let i=Dm(r),o,s=e[Bu(i,r)];if(s&&s(n.state,n.dispatch,n))return!0;if(i.length==1&&i!=" "){if(r.shiftKey){let l=e[Bu(i,r,!1)];if(l&&l(n.state,n.dispatch,n))return!0}if((r.altKey||r.metaKey||r.ctrlKey)&&!(J1&&r.ctrlKey&&r.altKey)&&(o=Yt[r.keyCode])&&o!=i){let l=e[Bu(o,r)];if(l&&l(n.state,n.dispatch,n))return!0}}return!1}}var zm=class{},Bm=class{constructor(){this.elements=[],this.size=()=>this.elements.length,this.top=()=>this.elements.at(-1),this.push=t=>{this.top()?.push(t)},this.open=t=>{this.elements.push(t)},this.close=()=>{let t=this.elements.pop();if(!t)throw xa();return t}}},Q1=class Fm extends zm{constructor(e,n,r){super(),this.type=e,this.content=n,this.attrs=r}push(e,...n){this.content.push(e,...n)}pop(){return this.content.pop()}static create(e,n,r){return new Fm(e,n,r)}},bt,ri,vo,Eo,Oo,ii,oi,nr,_m=(nr=class extends Bm{constructor(n){super();z(this,bt);z(this,ri);z(this,vo);z(this,Eo);z(this,Oo);z(this,ii);z(this,oi);v(this,bt,Z.none),v(this,ri,r=>r.isText),v(this,vo,(r,i)=>{if(b(this,ri).call(this,r)&&b(this,ri).call(this,i)&&Z.sameSet(r.marks,i.marks))return this.schema.text(r.text+i.text,r.marks)}),v(this,Eo,r=>{let i=Object.values({...this.schema.nodes,...this.schema.marks}).find(o=>o.spec.parseMarkdown.match(r));if(!i)throw Rh(r);return i}),v(this,Oo,r=>{let i=b(this,Eo).call(this,r);i.spec.parseMarkdown.runner(this,r,i)}),this.injectRoot=(r,i,o)=>(this.openNode(i,o),this.next(r.children),this),this.openNode=(r,i)=>(this.open(Q1.create(r,[],i)),this),v(this,ii,()=>{v(this,bt,Z.none);let r=this.close();return b(this,oi).call(this,r.type,r.attrs,r.content)}),this.closeNode=()=>{try{b(this,ii).call(this)}catch(r){console.error(r)}return this},v(this,oi,(r,i,o)=>{let s=r.createAndFill(i,o,b(this,bt));if(!s)throw Oh(r,i,o);return this.push(s),s}),this.addNode=(r,i,o)=>{try{b(this,oi).call(this,r,i,o)}catch(s){console.error(s)}return this},this.openMark=(r,i)=>{let o=r.create(i);return v(this,bt,o.addToSet(b(this,bt))),this},this.closeMark=r=>(v(this,bt,r.removeFromSet(b(this,bt))),this),this.addText=r=>{try{let i=this.top();if(!i)throw xa();let o=i.pop(),s=this.schema.text(r,b(this,bt));if(!o)return i.push(s),this;let l=b(this,vo).call(this,o,s);return l?(i.push(l),this):(i.push(o,s),this)}catch(i){return console.error(i),this}},this.build=()=>{let r;do r=b(this,ii).call(this);while(this.size());return r},this.next=(r=[])=>([r].flat().forEach(i=>b(this,Oo).call(this,i)),this),this.toDoc=()=>this.build(),this.run=(r,i)=>{let o=r.runSync(r.parse(i),i);return this.next(o),this},this.schema=n}},bt=new WeakMap,ri=new WeakMap,vo=new WeakMap,Eo=new WeakMap,Oo=new WeakMap,ii=new WeakMap,oi=new WeakMap,nr.create=(n,r)=>{let i=new nr(n);return o=>(i.run(r,o),i.toDoc())},nr),rr,Lm=(rr=class extends zm{constructor(e,n,r,i={}){super(),this.type=e,this.children=n,this.value=r,this.props=i,this.push=(o,...s)=>{this.children||(this.children=[]),this.children.push(o,...s)},this.pop=()=>this.children?.pop()}},rr.create=(e,n,r,i={})=>new rr(e,n,r,i),rr),Y1=t=>Object.prototype.hasOwnProperty.call(t,"size"),ze,si,Ro,Do,Po,Lo,li,ai,zo,Bo,tr,In,Fo,ui,ir,$m=(ir=class extends Bm{constructor(n){super();z(this,ze);z(this,si);z(this,Ro);z(this,Do);z(this,Po);z(this,Lo);z(this,li);z(this,ai);z(this,zo);z(this,Bo);z(this,tr);z(this,In);z(this,Fo);z(this,ui);v(this,ze,[]),v(this,si,r=>{let i=Object.values({...this.schema.nodes,...this.schema.marks}).find(o=>o.spec.toMarkdown.match(r));if(!i)throw Dh(r.type);return i}),v(this,Ro,r=>b(this,si).call(this,r).spec.toMarkdown.runner(this,r)),v(this,Do,(r,i)=>b(this,si).call(this,r).spec.toMarkdown.runner(this,r,i)),v(this,Po,r=>{let i=l=>l.type.spec.priority??50,o=[...r].sort((l,a)=>i(l)-i(a)),s=[];return b(this,ze).forEach(({mark:l})=>{let a=o.findIndex(u=>u.eq(l));a>=0&&s.push(...o.splice(a,1))}),s.concat(o)}),v(this,Lo,r=>{let i=r?.marks,o=0;for(;o<b(this,ze).length;){let{mark:s,spanning:l}=b(this,ze)[o];if(l&&i?.some(a=>a.eq(s)))o++;else break}for(let s=b(this,ze).length-1;s>=o;s--)b(this,ui).call(this,b(this,ze)[s].mark)}),v(this,li,(r,i)=>{b(this,Po).call(this,r.marks).every(o=>!b(this,Do).call(this,o,r))&&b(this,Ro).call(this,r),b(this,Lo).call(this,i)}),v(this,ai,r=>{let{children:i}=r;return i&&(r.children=i.reduce((o,s,l)=>{if(l===0)return[s];let a=o.at(-1);if(a&&a.isMark&&s.isMark){let{children:u,...c}=s,{children:f,...h}=a;if(s.type===a.type&&u&&f&&JSON.stringify(c)===JSON.stringify(h)){let p={...h,children:[...f,...u]};return o.slice(0,-1).concat(b(this,ai).call(this,p))}}return o.concat(s)},[])),r}),v(this,zo,r=>{let i={...r.props,type:r.type};return r.children&&(i.children=r.children),r.value&&(i.value=r.value),i}),this.openNode=(r,i,o)=>(this.open(Lm.create(r,void 0,i,o)),this),v(this,Bo,(r,i)=>{let o="",s="",l=r.children;if(l){let u=l[0],c=l.at(-1);if(c&&c.type==="text"&&c.value.endsWith(" ")){let f=c.value,h=f.trimEnd();s=f.slice(h.length),c.value=h}if(u&&u.type==="text"&&u.value.startsWith(" ")){let f=u.value,h=f.trimStart();o=f.slice(0,f.length-h.length),u.value=h}}o.length&&b(this,In).call(this,"text",void 0,o);let a=i();return s.length&&b(this,In).call(this,"text",void 0,s),a}),v(this,tr,(r=!1)=>{let i=this.close(),o=()=>b(this,In).call(this,i.type,i.children,i.value,i.props);return r?b(this,Bo).call(this,i,o):o()}),this.closeNode=()=>(b(this,tr).call(this),this),v(this,In,(r,i,o,s)=>{let l=Lm.create(r,i,o,s),a=b(this,ai).call(this,b(this,zo).call(this,l));return this.push(a),a}),this.addNode=(r,i,o,s)=>(b(this,In).call(this,r,i,o,s),this),v(this,Fo,(r,i,o,s)=>b(this,ze).some(l=>l.mark.eq(r))?this:(b(this,ze).push({mark:r,spanning:o==null}),this.openNode(i,o,{...s,isMark:!0}))),v(this,ui,r=>{let i=-1;for(let o=b(this,ze).length-1;o>=0;o--)if(b(this,ze)[o].mark.eq(r)){i=o;break}i<0||(b(this,ze).splice(i,1),b(this,tr).call(this,!0))}),this.withMark=(r,i,o,s)=>(b(this,Fo).call(this,r,i,o,s),this),this.closeMark=r=>(b(this,ui).call(this,r),this),this.build=()=>{let r=null;do r=b(this,tr).call(this);while(this.size());return r.children||(r.children=[]),r},this.next=r=>Y1(r)?(r.forEach((i,o,s)=>{b(this,li).call(this,i,r.maybeChild(s+1)??void 0)}),this):(b(this,li).call(this,r),this),this.toString=r=>r.stringify(this.build()),this.run=r=>(v(this,ze,[]),this.next(r),this),this.schema=n}},ze=new WeakMap,si=new WeakMap,Ro=new WeakMap,Do=new WeakMap,Po=new WeakMap,Lo=new WeakMap,li=new WeakMap,ai=new WeakMap,zo=new WeakMap,Bo=new WeakMap,tr=new WeakMap,In=new WeakMap,Fo=new WeakMap,ui=new WeakMap,ir.create=(n,r)=>{let i=new ir(n);return o=>(i.run(o),i.toString(r))},ir);var Ne=function(t){for(var e=0;;e++)if(t=t.previousSibling,!t)return e};function pi(t){let e=t.assignedSlot||t.parentNode;return e&&e.nodeType==11?e.host:e}var Hu=null;function Zt(t,e,n){let r=Hu||(Hu=document.createRange());return r.setEnd(t,n??t.nodeValue.length),r.setStart(t,e||0),r}function X1(){Hu=null}function Sl(t,e,n,r){return n&&(Vm(t,e,n,r,-1)||Vm(t,e,n,r,1))}var Z1=/^(img|br|input|textarea|hr)$/i;function Vm(t,e,n,r,i){for(var o;;){if(t==n&&e==r)return!0;if(e==(i<0?0:Re(t))){let s=t.parentNode;if(!s||!$(s)||Yo(t)||Z1.test(t.nodeName)||t.contentEditable=="false")return!1;e=Ne(t)+(i<0?0:1),t=s}else if($(t)){let s=t.childNodes[e+(i<0?-1:0)];if($(s)&&s.contentEditable=="false")if(!((o=s.pmViewDesc)===null||o===void 0)&&o.ignoreForSelection)e+=i;else return!1;else t=s,e=i<0?Re(t):0}else return!1}}function Re(t){return t.nodeType==3?t.nodeValue.length:t.childNodes.length}function $(t){return t.nodeType==1}function ge(t){return t.nodeType==3}function di(t,e){return e?t.contains($(e)?e:e.parentNode):!1}function eC(t,e){for(;;){if(ge(t)&&e)return t;if($(t)&&e>0){if(t.contentEditable=="false")return null;t=t.childNodes[e-1],e=Re(t)}else if(t.parentNode&&!Yo(t))e=Ne(t),t=t.parentNode;else return null}}function tC(t,e){for(;;){if(ge(t)&&e<t.nodeValue.length)return t;if($(t)&&e<t.childNodes.length){if(t.contentEditable=="false")return null;t=t.childNodes[e],e=0}else if(t.parentNode&&!Yo(t))e=Ne(t)+1,t=t.parentNode;else return null}}function nC(t,e,n){for(let r=e==0,i=e==Re(t);r||i;){if(t==n)return!0;let o=Ne(t);if(t=t.parentNode,!t)return!1;r=r&&o==0,i=i&&o==Re(t)}}function Yo(t){let e;for(let n=t;n&&!(e=n.pmViewDesc);n=n.parentNode);return e&&e.node&&e.node.isBlock&&(e.dom==t||e.contentDOM==t)}function Rl(t){return t.focusNode&&Sl(t.focusNode,t.focusOffset,t.anchorNode,t.anchorOffset)}function xg(t,e){t.collapse(e.anchorNode,e.anchorOffset),(e.focusNode!=e.anchorNode||e.focusOffset!=e.anchorOffset)&&t.extend(e.focusNode,e.focusOffset)}function rC(t,e){let n=document.createEvent("Event");return n.initEvent("keydown",!0,!0),n.keyCode=t,n.key=n.code=e,n}function iC(t){let e=t.activeElement;for(;e&&e.shadowRoot;)e=e.shadowRoot.activeElement;return e}function oC(t,e,n){if(t.caretPositionFromPoint)try{let r=t.caretPositionFromPoint(e,n);if(r)return{node:r.offsetNode,offset:Math.min(Re(r.offsetNode),r.offset)}}catch{}if(t.caretRangeFromPoint){let r=t.caretRangeFromPoint(e,n);if(r)return{node:r.startContainer,offset:Math.min(Re(r.startContainer),r.startOffset)}}}var Rt=typeof navigator<"u"?navigator:null,jm=typeof document<"u"?document:null,mi=Rt&&Rt.userAgent||"",wt=/gecko\/(\d+)/i.test(mi)&&!/edge?\//i.test(mi);wt&&+(/Firefox\/(\d+)/.exec(mi)||[0,0])[1];var Wu=/Chrome\/(\d+)/.exec(mi),Be=!!Wu,bg=Wu?+Wu[1]:0,Fe=!!Rt&&/Apple Computer/.test(Rt.vendor),gi=Fe&&(/Mobile\/\w+/.test(mi)||!!Rt&&Rt.maxTouchPoints>2),ft=gi||(Rt?/Mac/.test(Rt.platform):!1),wg=Rt?/Win/.test(Rt.platform):!1,en=/Android \d/.test(mi),Dl=!!jm&&"webkitFontSmoothing"in jm.documentElement.style,sC=Dl?+(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent)||[0,0])[1]:0;function lC(t){let e=t.defaultView&&t.defaultView.visualViewport;return e?{left:0,right:e.width,top:0,bottom:e.height}:{left:0,right:t.documentElement.clientWidth,top:0,bottom:t.documentElement.clientHeight}}function Xt(t,e){return typeof t=="number"?t:t[e]}function aC(t){let e=t.getBoundingClientRect(),n=e.width/t.offsetWidth||1,r=e.height/t.offsetHeight||1;return{left:e.left,right:e.left+t.clientWidth*n,top:e.top,bottom:e.top+t.clientHeight*r}}function Hm(t,e,n){if(!qu(e)&&e.left==0)return;let r=t.someProp("scrollThreshold")||0,i=t.someProp("scrollMargin")||5,o=t.dom.ownerDocument;for(let s=n||t.dom;s;){if(!$(s)){s=pi(s);continue}let l=s==o.body,a=l?lC(o):aC(s),u=0,c=0;if(e.top<a.top+Xt(r,"top")?c=-(a.top-e.top+Xt(i,"top")):e.bottom>a.bottom-Xt(r,"bottom")&&(c=e.bottom-e.top>a.bottom-a.top?e.top+Xt(i,"top")-a.top:e.bottom-a.bottom+Xt(i,"bottom")),e.left<a.left+Xt(r,"left")?u=-(a.left-e.left+Xt(i,"left")):e.right>a.right-Xt(r,"right")&&(u=e.right-a.right+Xt(i,"right")),u||c)if(l)o.defaultView.scrollBy(u,c);else{let h=s.scrollLeft,p=s.scrollTop;c&&(s.scrollTop+=c),u&&(s.scrollLeft+=u);let d=s.scrollLeft-h,m=s.scrollTop-p;e={left:e.left-d,top:e.top-m,right:e.right-d,bottom:e.bottom-m}}let f=l?"fixed":getComputedStyle(s).position;if(/^(fixed|sticky)$/.test(f))break;s=f=="absolute"?s.offsetParent:pi(s)}}function uC(t){let e=t.dom.getBoundingClientRect(),n=Math.max(0,e.top),r,i;for(let o=(e.left+e.right)/2,s=n+1;s<Math.min(innerHeight,e.bottom);s+=5){let l=t.root.elementFromPoint(o,s);if(!l||l==t.dom||!t.dom.contains(l))continue;let a=l.getBoundingClientRect();if(a.top>=n-20){r=l,i=a.top;break}}return{refDOM:r,refTop:i,stack:Cg(t.dom)}}function Cg(t){let e=[],n=t.ownerDocument;for(let r=t;r&&(e.push({dom:r,top:r.scrollTop,left:r.scrollLeft}),t!=n);r=pi(r));return e}function cC({refDOM:t,refTop:e,stack:n}){let r=t?t.getBoundingClientRect().top:0;Sg(n,r==0?0:r-e)}function Sg(t,e){for(let n=0;n<t.length;n++){let{dom:r,top:i,left:o}=t[n];r.scrollTop!=i+e&&(r.scrollTop=i+e),r.scrollLeft!=o&&(r.scrollLeft=o)}}var ci=null;function Mg(t){if(t.setActive)return t.setActive();if(ci)return t.focus(ci);let e=Cg(t);t.focus(ci==null?{get preventScroll(){return ci={preventScroll:!0},!0}}:void 0),ci||(ci=!1,Sg(e,0))}function Ng(t,e){let n,r=2e8,i,o=0,s=e.top,l=e.top,a,u;for(let c=t.firstChild,f=0;c;c=c.nextSibling,f++){let h;if($(c))h=c.getClientRects();else if(ge(c))h=Zt(c).getClientRects();else continue;for(let p=0;p<h.length;p++){let d=h[p];if(d.top<=s&&d.bottom>=l){s=Math.max(d.bottom,s),l=Math.min(d.top,l);let m=d.left>e.left?d.left-e.left:d.right<e.left?e.left-d.right:0;if(m<r){n=c,r=m,i=m&&ge(n)?{left:d.right<e.left?d.right:d.left,top:e.top}:e,$(c)&&m&&(o=f+(e.left>=(d.left+d.right)/2?1:0));continue}}else d.top>e.top&&!a&&d.left<=e.left&&d.right>=e.left&&(a=c,u={left:Math.max(d.left,Math.min(d.right,e.left)),top:d.top});!n&&(e.left>=d.right&&e.top>=d.top||e.left>=d.left&&e.top>=d.bottom)&&(o=f+1)}}return!n&&a&&(n=a,i=u,r=0),n&&ge(n)?fC(n,i):!n||r?{node:t,offset:o}:Ng(n,i)}function fC(t,e){let n=t.nodeValue.length,r=document.createRange(),i;for(let o=0;o<n;o++){r.setEnd(t,o+1),r.setStart(t,o);let s=Tn(r,1);if(s.top!=s.bottom&&oc(e,s)){i={node:t,offset:o+(e.left>=(s.left+s.right)/2?1:0)};break}}return r.detach(),i||{node:t,offset:0}}function oc(t,e){return t.left>=e.left-1&&t.left<=e.right+1&&t.top>=e.top-1&&t.top<=e.bottom+1}function hC(t,e){let n=t.parentNode;return n&&/^li$/i.test(n.nodeName)&&e.left<t.getBoundingClientRect().left?n:t}function pC(t,e,n){let{node:r,offset:i}=Ng(e,n),o=-1;if($(r)&&!r.firstChild){let s=r.getBoundingClientRect();o=s.left!=s.right&&n.left>(s.left+s.right)/2?1:-1}return t.docView.posFromDOM(r,i,o)}function dC(t,e,n,r){let i=-1;for(let o=e,s=!1;o!=t.dom;){let l=t.docView.nearestDesc(o,!0),a;if(!l)return null;if($(l.dom)&&(l.node.isBlock&&l.parent||!l.contentDOM)&&((a=l.dom.getBoundingClientRect()).width||a.height)&&(l.node.isBlock&&l.parent&&!/^T(R|BODY|HEAD|FOOT)$/.test(l.dom.nodeName)&&(!s&&a.left>r.left||a.top>r.top?i=l.posBefore:(!s&&a.right<r.left||a.bottom<r.top)&&(i=l.posAfter),s=!0),!l.contentDOM&&i<0&&!l.node.isText))return(l.node.isBlock?r.top<(a.top+a.bottom)/2:r.left<(a.left+a.right)/2)?l.posBefore:l.posAfter;o=l.dom.parentNode}return i>-1?i:t.docView.posFromDOM(e,n,-1)}function Ig(t,e,n){let r=t.childNodes.length;if(r&&n.top<n.bottom)for(let i=Math.max(0,Math.min(r-1,Math.floor(r*(e.top-n.top)/(n.bottom-n.top))-2)),o=i;;){let s=t.childNodes[o];if($(s)){let l=s.getClientRects();for(let a=0;a<l.length;a++){let u=l[a];if(oc(e,u))return Ig(s,e,u)}}if((o=(o+1)%r)==i)break}return t}function mC(t,e){let n=t.dom.ownerDocument,r,i=0,o=oC(n,e.left,e.top);o&&({node:r,offset:i}=o);let s=(t.root.elementFromPoint?t.root:n).elementFromPoint(e.left,e.top),l;if(!s||!t.dom.contains(s)){let u=t.dom.getBoundingClientRect();if(!oc(e,u)||(s=Ig(t.dom,e,u),!s))return null}if(Fe)for(let u=s;r&&u;u=pi(u))u.draggable&&(r=void 0);if(s=hC(s,e),r){if(wt&&$(r)&&(i=Math.min(i,r.childNodes.length),i<r.childNodes.length)){let c=r.childNodes[i],f;c.nodeName=="IMG"&&(f=c.getBoundingClientRect()).right<=e.left&&f.bottom>e.top&&i++}let u;Dl&&i&&$(r)&&$(u=r.childNodes[i-1])&&u.contentEditable=="false"&&u.getBoundingClientRect().top>=e.top&&i--,r==t.dom&&i==r.childNodes.length-1&&$(r.lastChild)&&e.top>r.lastChild.getBoundingClientRect().bottom?l=t.state.doc.content.size:(i==0||!$(r)||r.childNodes[i-1].nodeName!="BR")&&(l=dC(t,r,i,e))}l==null&&(l=pC(t,s,e));let a=t.docView.nearestDesc(s,!0);return{pos:l,inside:a?a.posAtStart-a.border:-1}}function qu(t){return t.top<t.bottom||t.left<t.right}function Tn(t,e){let n=t.getClientRects();if(n.length){let r=n[e<0?0:n.length-1];if(qu(r))return r}return Array.prototype.find.call(n,qu)||t.getBoundingClientRect()}var gC=/[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;function Tg(t,e,n){let{node:r,offset:i,atom:o}=t.docView.domFromPos(e,n<0?-1:1),s=Dl||wt;if(ge(r))if(s&&(gC.test(r.nodeValue)||(n<0?!i:i==r.nodeValue.length))){let a=Tn(Zt(r,i,i),n);if(wt&&i&&/\s/.test(r.nodeValue[i-1])&&i<r.nodeValue.length){let u=Tn(Zt(r,i-1,i-1),-1);if(u.top==a.top){let c=Tn(Zt(r,i,i+1),-1);if(c.top!=a.top)return _o(c,c.left<u.left)}}return a}else{let a=i,u=i,c=n<0?1:-1;return n<0&&!i?(u++,c=-1):n>=0&&i==r.nodeValue.length?(a--,c=1):n<0?a--:u++,_o(Tn(Zt(r,a,u),c),c<0)}if(!t.state.doc.resolve(e-(o||0)).parent.inlineContent){if(o==null&&i&&(n<0||i==Re(r))){let a=r.childNodes[i-1];if($(a))return _u(a.getBoundingClientRect(),!1)}if(o==null&&i<Re(r)){let a=r.childNodes[i];if($(a))return _u(a.getBoundingClientRect(),!0)}return _u(r.getBoundingClientRect(),n>=0)}if(o==null&&i&&(n<0||i==Re(r))){let a=r.childNodes[i-1],u=ge(a)?Zt(a,Re(a)-(s?0:1)):$(a)&&(a.nodeName!="BR"||!a.nextSibling)?a:null;if(u)return _o(Tn(u,1),!1)}if(o==null&&i<Re(r)){let a=r.childNodes[i];for(;a.pmViewDesc&&a.pmViewDesc.ignoreForCoords;)a=a.nextSibling;let u=a?ge(a)?Zt(a,0,s?0:1):$(a)?a:null:null;if(u)return _o(Tn(u,-1),!0)}return _o(Tn(ge(r)?Zt(r):r,-n),n>=0)}function _o(t,e){if(t.width==0)return t;let n=e?t.left:t.right;return{top:t.top,bottom:t.bottom,left:n,right:n}}function _u(t,e){if(t.height==0)return t;let n=e?t.top:t.bottom;return{top:n,bottom:n,left:t.left,right:t.right}}function Ag(t,e,n){let r=t.state,i=t.root.activeElement;r!=e&&t.updateState(e),i!=t.dom&&t.focus();try{return n()}finally{r!=e&&t.updateState(r),i!=t.dom&&i&&i.focus()}}function yC(t,e,n){let r=e.selection,i=n=="up"?r.$from:r.$to;return Ag(t,e,()=>{let{node:o}=t.docView.domFromPos(i.pos,n=="up"?-1:1);for(;;){let l=t.docView.nearestDesc(o,!0);if(!l)break;if(l.node.isBlock){o=l.contentDOM||l.dom;break}o=l.dom.parentNode}let s=Tg(t,i.pos,1);for(let l=o.firstChild;l;l=l.nextSibling){let a;if($(l))a=l.getClientRects();else if(ge(l))a=Zt(l,0,l.nodeValue.length).getClientRects();else continue;for(let u=0;u<a.length;u++){let c=a[u];if(c.bottom>c.top+1&&(n=="up"?s.top-c.top>(c.bottom-s.top)*2:c.bottom-s.bottom>(s.bottom-c.top)*2))return!1}}return!0})}var kC=/[\u0590-\u08ac]/;function xC(t,e,n){let{$head:r}=e.selection;if(!r.parent.isTextblock)return!1;let i=r.parentOffset,o=!i,s=i==r.parent.content.size,l=t.domSelection();return l?!kC.test(r.parent.textContent)||!l.modify?n=="left"||n=="backward"?o:s:Ag(t,e,()=>{let a=t.domSel.readRange(),u=l.caretBidiLevel;l.modify("move",n,"character");let c=r.depth?t.docView.domAfterPos(r.before()):t.dom,{focusNode:f,focusOffset:h}=t.domSel.readRange(),p=f&&!di(c,f)||a.focusNode==f&&a.focusOffset==h;return xg(l,a),u!=null&&(l.caretBidiLevel=u),p}):r.pos==r.start()||r.pos==r.end()}var Wm=null,qm=null,Km=!1;function bC(t,e,n){return Wm==e&&qm==n?Km:(Wm=e,qm=n,Km=n=="up"||n=="down"?yC(t,e,n):xC(t,e,n))}var ur=class{constructor(e,n,r,i){this.parent=e,this.children=n,this.dom=r,this.contentDOM=i,this.damage=0,r.pmViewDesc=this}matchesWidget(e){return!1}matchesMark(e){return!1}matchesNode(e,n,r){return!1}matchesHack(e){return!1}parseRule(e){return null}stopEvent(e){return!1}get size(){let e=0;for(let n=0;n<this.children.length;n++)e+=this.children[n].size;return e}get border(){return 0}destroy(){this.parent=void 0,this.dom.pmViewDesc==this&&(this.dom.pmViewDesc=void 0);for(let e=0;e<this.children.length;e++)this.children[e].destroy()}posBeforeChild(e){for(let n=0,r=this.posAtStart;;n++){let i=this.children[n];if(i==e)return r;r+=i.size}}get posBefore(){return this.parent.posBeforeChild(this)}get posAtStart(){return this.parent?this.parent.posBeforeChild(this)+this.border:0}get posAfter(){return this.posBefore+this.size}get posAtEnd(){return this.posAtStart+this.size-2*this.border}localPosFromDOM(e,n,r){if(this.contentDOM&&di(this.contentDOM,e))if(r<0){let o,s;if(e==this.contentDOM)o=e.childNodes[n-1];else{for(;e.parentNode!=this.contentDOM;)e=e.parentNode;o=e.previousSibling}for(;o&&!((s=o.pmViewDesc)&&s.parent==this);)o=o.previousSibling;return o?this.posBeforeChild(s)+s.size:this.posAtStart}else{let o,s;if(e==this.contentDOM)o=e.childNodes[n];else{for(;e.parentNode!=this.contentDOM;)e=e.parentNode;o=e.nextSibling}for(;o&&!((s=o.pmViewDesc)&&s.parent==this);)o=o.nextSibling;return o?this.posBeforeChild(s):this.posAtEnd}let i;if(e==this.dom&&this.contentDOM)i=n>Ne(this.contentDOM);else if(this.contentDOM&&this.contentDOM!=this.dom&&this.dom.contains(this.contentDOM)){let o=e.compareDocumentPosition(this.contentDOM);o&16?i=n>Array.from(e.childNodes).findIndex(s=>s.contains(this.contentDOM)):i=!(o&4)}else if(this.dom.firstChild){if(n==0)for(let o=e;;o=o.parentNode){if(o==this.dom){i=!1;break}if(o.previousSibling)break}if(i==null&&n==e.childNodes.length)for(let o=e;;o=o.parentNode){if(o==this.dom){i=!0;break}if(o.nextSibling)break}}return i??r>0?this.posAtEnd:this.posAtStart}nearestDesc(e,n=!1){for(let r=!0,i=e;i;i=i.parentNode){let o=this.getDesc(i),s;if(o&&(!n||o.node))if(r&&(s=o.nodeDOM)&&!($(s)?di(s,e):s==e))r=!1;else return o}}getDesc(e){let n=e.pmViewDesc;for(let r=n;r;r=r.parent)if(r==this)return n}posFromDOM(e,n,r){for(let i=e;i;i=i.parentNode){let o=this.getDesc(i);if(o)return o.localPosFromDOM(e,n,r)}return-1}descAt(e){for(let n=0,r=0;n<this.children.length;n++){let i=this.children[n],o=r+i.size;if(r==e&&o!=r){for(;!i.border&&i.children.length;)for(let s=0;s<i.children.length;s++){let l=i.children[s];if(l.size){i=l;break}}return i}if(e<o)return i.descAt(e-r-i.border);r=o}}domFromPos(e,n){if(!this.contentDOM)return{node:this.dom,offset:0,atom:e+1};let r=0,i=0;for(let o=0;r<this.children.length;r++){let s=this.children[r],l=o+s.size;if(l>e){i=e-o;break}o=l}if(i)return this.children[r].domFromPos(i-this.children[r].border,n);for(;r>0;r--){let o=this.children[r-1];if(o.size||!(o instanceof Nl||o instanceof Ml&&o.side>=0))break}if(n<=0){let o,s=!0;for(;o=r?this.children[r-1]:null,!(!o||o.dom.parentNode==this.contentDOM);r--,s=!1);return o&&n&&s&&!o.border&&!o.domAtom?o.domFromPos(o.size,n):{node:this.contentDOM,offset:o?Ne(o.dom)+1:0}}else{let o,s=!0;for(;o=r<this.children.length?this.children[r]:null,!(!o||o.dom.parentNode==this.contentDOM);r++,s=!1);return o&&s&&!o.border&&!o.domAtom?o.domFromPos(0,n):{node:this.contentDOM,offset:o?Ne(o.dom):this.contentDOM.childNodes.length}}}parseRange(e,n,r=0){if(this.children.length==0)return{node:this.contentDOM,from:e,to:n,fromOffset:0,toOffset:this.contentDOM.childNodes.length};let i=-1,o=-1;for(let s=r,l=0;;l++){let a=this.children[l],u=s+a.size;if(i==-1&&e<=u){let c=s+a.border;if(e>=c&&n<=u-a.border&&a.node&&a.contentDOM&&this.contentDOM.contains(a.contentDOM))return a.parseRange(e,n,c);e=s;for(let f=l;f>0;f--){let h=this.children[f-1];if(h.size&&h.dom.parentNode==this.contentDOM&&!h.emptyChildAt(1)){i=Ne(h.dom)+1;break}e-=h.size}i==-1&&(i=0)}if(i>-1&&(u>n||l==this.children.length-1)){n=u;for(let c=l+1;c<this.children.length;c++){let f=this.children[c];if(f.size&&f.dom.parentNode==this.contentDOM&&!f.emptyChildAt(-1)){o=Ne(f.dom);break}n+=f.size}o==-1&&(o=this.contentDOM.childNodes.length);break}s=u}return{node:this.contentDOM,from:e,to:n,fromOffset:i,toOffset:o}}emptyChildAt(e){if(this.border||!this.contentDOM||!this.children.length)return!1;let n=this.children[e<0?0:this.children.length-1];return n.size==0||n.emptyChildAt(e)}domAfterPos(e){let{node:n,offset:r}=this.domFromPos(e,0);if(!$(n)||r==n.childNodes.length)throw new RangeError("No node after pos "+e);return n.childNodes[r]}ignoreMutation(e){return!this.contentDOM&&e.type!="selection"}get contentLost(){return this.contentDOM&&this.contentDOM!=this.dom&&!this.dom.contains(this.contentDOM)}markDamage(e){e&&(this.damage|=e,this.markParentDamage())}markParentDamage(){for(let e=this;;){let{parent:n}=e;if(!n||n.damage&1)break;n.damage|=1,e=n}}get domAtom(){return!1}get ignoreForCoords(){return!1}get ignoreForSelection(){return!1}isText(e){return!1}},Ml=class extends ur{constructor(e,n,r,i){let o,s=n.type.toDOM;if(typeof s=="function"&&(s=s(r,()=>{if(!o)return i;if(o.parent)return o.parent.posBeforeChild(o)})),!n.type.spec.raw){let l=$(s)?s:document.createElement("span");l!=s&&(l.appendChild(s),s=l),l.hasAttribute("contenteditable")||(l.contentEditable="false"),l.classList.add("ProseMirror-widget")}super(e,[],s,null),this.widget=n,this.widget=n,o=this}matchesWidget(e){return!this.damage&&e.type.eq(this.widget.type)}parseRule(){return{ignore:!0}}stopEvent(e){let n=this.widget.spec.stopEvent;return n?n(e):!1}ignoreMutation(e){return e.type!="selection"||this.widget.spec.ignoreSelection}destroy(){this.widget.type.destroy(this.dom),super.destroy()}get domAtom(){return!0}get ignoreForSelection(){return!!this.widget.type.spec.relaxedSide}get side(){return this.widget.type.side}},Ku=class extends ur{constructor(e,n,r,i){super(e,[],n,null),this.textDOM=r,this.text=i}get size(){return this.text.length}localPosFromDOM(e,n){return e!=this.textDOM?this.posAtStart+(n?this.size:0):this.posAtStart+n}domFromPos(e){return{node:this.textDOM,offset:e}}ignoreMutation(e){return e.type==="characterData"&&e.target.nodeValue==e.oldValue}},sr=class t extends ur{constructor(e,n,r,i,o){super(e,[],r,i),this.mark=n,this.spec=o}static create(e,n,r,i){let o=i.nodeViews[n.type.name],s=o&&o(n,i,r);return(!s||!s.dom)&&(s=xt.renderSpec(document,n.type.spec.toDOM(n,r),null,n.attrs)),new t(e,n,s.dom,s.contentDOM||s.dom,s)}parseRule(){return this.damage&4||this.mark.type.spec.reparseInView?null:{mark:this.mark.type.name,attrs:this.mark.attrs,contentElement:this.contentDOM}}matchesMark(e){return!(this.damage&4)&&this.mark.eq(e)}markDamage(e){var n;this.damage|=e,(n=this.parent)===null||n===void 0||n.markDamage(2)}slice(e,n,r){let i=t.create(this.parent,this.mark,!0,r),o=this.children,s=this.size;n<s&&(o=Uu(o,n,s,r)),e>0&&(o=Uu(o,0,e,r));for(let l=0;l<o.length;l++)o[l].parent=i;return i.children=o,i}ignoreMutation(e){return this.spec.ignoreMutation?this.spec.ignoreMutation(e):super.ignoreMutation(e)}destroy(){this.spec.destroy&&this.spec.destroy(),super.destroy()}},On=class t extends ur{constructor(e,n,r,i,o,s,l){super(e,[],o,s),this.node=n,this.outerDeco=r,this.innerDeco=i,this.nodeDOM=l}static create(e,n,r,i,o,s){let l=o.nodeViews[n.type.name],a,u=l&&l(n,o,()=>{if(!a)return s;if(a.parent)return a.parent.posBeforeChild(a)},r,i),c=u&&u.dom,f=u&&u.contentDOM;if(n.isText){if(!c)c=document.createTextNode(n.text);else if(!ge(c))throw new RangeError("Text must be rendered as a DOM text node")}else c||({dom:c,contentDOM:f}=xt.renderSpec(document,n.type.spec.toDOM(n),null,n.attrs));!f&&!n.isText&&c.nodeName!="BR"&&(c.hasAttribute("contenteditable")||(c.contentEditable="false"),n.type.spec.draggable&&(c.draggable=!0));let h=c;return c=Eg(c,r,n),u?a=new Il(e,n,r,i,c,f||null,h,u):n.isText?new Ho(e,n,r,i,c,h):new t(e,n,r,i,c,f||null,h)}parseRule(e){if(this.node.type.spec.reparseInView)return null;let n={node:this.node.type.name,attrs:this.node.attrs};if(this.node.type.whitespace=="pre"&&(n.preserveWhitespace="full"),!this.contentDOM)n.getContent=()=>this.node.content;else if(!this.contentLost)n.contentElement=this.contentDOM;else{for(let r=this.children.length-1;r>=0;r--){let i=this.children[r];if(this.dom.contains(i.dom.parentNode)){n.contentElement=i.dom.parentNode;break}}if(!n.contentElement){let r=e&&e.find(i=>$(i)&&e.indexOf(i.parentNode)<0&&this.dom.contains(i));r?n.contentElement=r:n.getContent=()=>A.empty}}return n}matchesNode(e,n,r){return!this.damage&&e.eq(this.node)&&Tl(n,this.outerDeco)&&r.eq(this.innerDeco)}get size(){return this.node.nodeSize}get border(){return this.node.isLeaf?0:1}updateChildren(e,n){let r=this.node.inlineContent,i=n,o=e.composing?this.localCompositionInfo(e,n):null,s=o&&o.pos>-1?o:null,l=o&&o.pos<0,a=new Ju(this,s&&s.node,e),u=this.node.inlineContent,c=u&&this.node.isBlock;MC(this.node,this.innerDeco,(f,h,p)=>{f.spec.marks?a.syncToMarks(f.spec.marks,r,e,h):f.type.side>=0&&!p&&a.syncToMarks(h==this.node.childCount?Z.none:this.node.child(h).marks,r,e,h),a.placeWidget(f,e,i)},(f,h,p,d)=>{a.syncToMarks(f.marks,r,e,d),c&&f.isAtom&&!f.isText&&a.addHackNode("IMG",a.top);let m;a.findNodeMatch(f,h,p,d)||l&&e.state.selection.from>i&&e.state.selection.to<i+f.nodeSize&&(m=a.findIndexWithChild(o.node))>-1&&a.updateNodeAt(f,h,p,m,e,i)||a.updateNextNode(f,h,p,e,d,i)||a.addNode(f,h,p,e,i),i+=f.nodeSize,u&&(c=f.isAtom&&!f.isText)}),a.syncToMarks([],r,e,0),this.node.isTextblock&&a.addTextblockHacks(),a.destroyRest(),(a.changed||this.damage&2)&&(s&&this.protectLocalComposition(e,s),vg(this.contentDOM,this.children,e),gi&&NC(this.dom))}localCompositionInfo(e,n){let{from:r,to:i}=e.state.selection;if(!(e.state.selection instanceof j)||r<n||i>n+this.node.content.size)return null;let o=e.input.compositionNode;if(!o||!this.dom.contains(o.parentNode))return null;if(this.node.inlineContent){let s=o.nodeValue,l=IC(this.node.content,s,r-n,i-n);return l<0?null:{node:o,pos:l,text:s}}else return{node:o,pos:-1,text:""}}protectLocalComposition(e,{node:n,pos:r,text:i}){if(this.getDesc(n))return;let o=n;for(;o.parentNode!=this.contentDOM;o=o.parentNode){for(;o.previousSibling;)o.parentNode.removeChild(o.previousSibling);for(;o.nextSibling;)o.parentNode.removeChild(o.nextSibling);o.pmViewDesc&&(o.pmViewDesc=void 0)}let s=new Ku(this,o,n,i);e.input.compositionNodes.push(s),this.children=Uu(this.children,r,r+i.length,e,s)}update(e,n,r,i,o){return this.damage&4||!e.sameMarkup(this.node)?!1:(this.updateInner(e,n,r,i,o),!0)}updateInner(e,n,r,i,o){this.updateOuterDeco(n),this.node=e,this.innerDeco=r,this.contentDOM&&this.updateChildren(i,o+1),this.damage=0}updateOuterDeco(e){if(Tl(e,this.outerDeco))return;let n=!$(this.nodeDOM),r=this.dom;this.dom=sc(this.dom,this.nodeDOM,Wo(this.outerDeco,this.node,n),Wo(e,this.node,n)),this.dom!=r&&(r.pmViewDesc=void 0,this.dom.pmViewDesc=this),this.outerDeco=e}selectNode(){$(this.nodeDOM)&&(this.nodeDOM.classList.add("ProseMirror-selectednode"),(this.contentDOM||!this.node.type.spec.draggable)&&(this.nodeDOM.draggable=!0))}deselectNode(){$(this.nodeDOM)&&(this.nodeDOM.classList.remove("ProseMirror-selectednode"),(this.contentDOM||!this.node.type.spec.draggable)&&this.nodeDOM.removeAttribute("draggable"))}get domAtom(){return this.node.isAtom}};function Jm(t,e,n,r,i,o){o?sc(r,r,Wo(o,t,!1),Wo(e,t,!1)):Eg(r,e,t);let s=new On(void 0,t,e,n,r,r,r);return s.contentDOM&&s.updateChildren(i,0),s}var Ho=class t extends On{constructor(e,n,r,i,o,s){super(e,n,r,i,o,null,s)}parseRule(){let e=this.nodeDOM.parentNode;for(;e&&e!=this.dom&&!e.pmIsDeco;)e=e.parentNode;return{skip:e||!0}}update(e,n,r,i){return this.damage&4||this.damage&&!this.inParent()||!e.sameMarkup(this.node)?!1:(this.updateOuterDeco(n),(this.damage&8||e.text!=this.node.text)&&e.text!=this.nodeDOM.nodeValue&&(this.nodeDOM.nodeValue=e.text,i.trackWrites==this.nodeDOM&&(i.trackWrites=null)),this.node=e,this.damage=0,!0)}inParent(){let e=this.parent.contentDOM;for(let n=this.nodeDOM;n;n=n.parentNode)if(n==e)return!0;return!1}domFromPos(e){return{node:this.nodeDOM,offset:e}}localPosFromDOM(e,n,r){return e==this.nodeDOM?this.posAtStart+Math.min(n,this.node.text.length):super.localPosFromDOM(e,n,r)}ignoreMutation(e){return!1}slice(e,n,r){let i=this.node.cut(e,n),o=document.createTextNode(i.text);return new t(this.parent,i,this.outerDeco,this.innerDeco,o,o)}get domAtom(){return!1}isText(e){return this.node.text==e}},Nl=class extends ur{parseRule(){return{ignore:!0}}matchesHack(e){return!this.damage&&this.dom.nodeName==e}get domAtom(){return!0}get ignoreForCoords(){return this.dom.nodeName=="IMG"}},Il=class extends On{constructor(e,n,r,i,o,s,l,a){super(e,n,r,i,o,s,l),this.spec=a}update(e,n,r,i,o){if(this.damage&4)return!1;if(this.spec.update&&(this.node.type==e.type||this.spec.multiType)){let s=this.spec.update(e,n,r);return s&&this.updateInner(e,n,r,i,o),s}else return!this.contentDOM&&!e.isLeaf?!1:super.update(e,n,r,i,o)}selectNode(){this.spec.selectNode?this.spec.selectNode():super.selectNode()}deselectNode(){this.spec.deselectNode?this.spec.deselectNode():super.deselectNode()}destroy(){this.spec.destroy&&this.spec.destroy(),super.destroy()}stopEvent(e){return this.spec.stopEvent?this.spec.stopEvent(e):!1}ignoreMutation(e){return this.spec.ignoreMutation?this.spec.ignoreMutation(e):super.ignoreMutation(e)}};function vg(t,e,n){let r=t.firstChild,i=!1;for(let o=0;o<e.length;o++){let s=e[o],l=s.dom;if(l.parentNode==t){for(;l!=r;)r=Um(r),i=!0;r=r.nextSibling}else i=!0,t.insertBefore(l,r);if(s instanceof sr){let a=r?r.previousSibling:t.lastChild;vg(s.contentDOM,s.children,n),r=a?a.nextSibling:t.firstChild}}for(;r;)r=Um(r),i=!0;i&&n.trackWrites==t&&(n.trackWrites=null)}var Vo=function(t){t&&(this.nodeName=t)};Vo.prototype=Object.create(null);var or=[new Vo];function Wo(t,e,n){if(t.length==0)return or;let r=n?or[0]:new Vo,i=[r];for(let o=0;o<t.length;o++){let s=t[o].type.attrs;if(s){s.nodeName&&i.push(r=new Vo(s.nodeName));for(let l in s){let a=s[l];a!=null&&(n&&i.length==1&&i.push(r=new Vo(e.isInline?"span":"div")),l=="class"?r.class=(r.class?r.class+" ":"")+a:l=="style"?r.style=(r.style?r.style+";":"")+a:l!="nodeName"&&(r[l]=a))}}}return i}function sc(t,e,n,r){if(n==or&&r==or)return e;let i=e;for(let o=0;o<r.length;o++){let s=r[o],l=n[o];if(o){let a;l&&l.nodeName==s.nodeName&&i!=t&&(a=i.parentNode)&&a.nodeName.toLowerCase()==s.nodeName||(a=document.createElement(s.nodeName),a.pmIsDeco=!0,a.appendChild(i),l=or[0]),i=a}wC(i,l||or[0],s)}return i}function wC(t,e,n){for(let r in e)r!="class"&&r!="style"&&r!="nodeName"&&!(r in n)&&t.removeAttribute(r);for(let r in n)r!="class"&&r!="style"&&r!="nodeName"&&n[r]!=e[r]&&t.setAttribute(r,n[r]);if(e.class!=n.class){let r=e.class?e.class.split(" ").filter(Boolean):[],i=n.class?n.class.split(" ").filter(Boolean):[];for(let o=0;o<r.length;o++)i.indexOf(r[o])==-1&&t.classList.remove(r[o]);for(let o=0;o<i.length;o++)r.indexOf(i[o])==-1&&t.classList.add(i[o]);t.classList.length==0&&t.removeAttribute("class")}if(e.style!=n.style){if(e.style){let r=/\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g,i;for(;i=r.exec(e.style);)t.style.removeProperty(i[1])}n.style&&(t.style.cssText+=n.style)}}function Eg(t,e,n){return sc(t,t,or,Wo(e,n,!$(t)))}function Tl(t,e){if(t.length!=e.length)return!1;for(let n=0;n<t.length;n++)if(!t[n].type.eq(e[n].type))return!1;return!0}function Um(t){let e=t.nextSibling;return t.parentNode.removeChild(t),e}var Ju=class{constructor(e,n,r){this.lock=n,this.view=r,this.index=0,this.stack=[],this.changed=!1,this.top=e,this.preMatch=CC(e.node.content,e)}destroyBetween(e,n){if(e!=n){for(let r=e;r<n;r++)this.top.children[r].destroy();this.top.children.splice(e,n-e),this.changed=!0}}destroyRest(){this.destroyBetween(this.index,this.top.children.length)}syncToMarks(e,n,r,i){let o=0,s=this.stack.length>>1,l=Math.min(s,e.length);for(;o<l&&(o==s-1?this.top:this.stack[o+1<<1]).matchesMark(e[o])&&e[o].type.spec.spanning!==!1;)o++;for(;o<s;)this.destroyRest(),this.top.damage=0,this.index=this.stack.pop(),this.top=this.stack.pop(),s--;for(;s<e.length;){this.stack.push(this.top,this.index+1);let a=-1,u=this.top.children.length;i<this.preMatch.index&&(u=Math.min(this.index+3,u));for(let c=this.index;c<u;c++){let f=this.top.children[c];if(f.matchesMark(e[s])&&!this.isLocked(f.dom)){a=c;break}}if(a<0&&this.index<this.top.children.length){let c=this.top.children[this.index];c instanceof sr&&!(c.damage&4)&&c.mark.type==e[s].type&&c.spec.update&&!this.isLocked(c.dom)&&c.spec.update(e[s])&&(c.mark=e[s],a=this.index,this.changed=!0)}if(a>-1)a>this.index&&(this.changed=!0,this.destroyBetween(this.index,a)),this.top=this.top.children[this.index];else{let c=sr.create(this.top,e[s],n,r);this.top.children.splice(this.index,0,c),this.top=c,this.changed=!0}this.index=0,s++}}findNodeMatch(e,n,r,i){let o=-1,s;if(i>=this.preMatch.index&&(s=this.preMatch.matches[i-this.preMatch.index]).parent==this.top&&s.matchesNode(e,n,r))o=this.top.children.indexOf(s,this.index);else for(let l=this.index,a=Math.min(this.top.children.length,l+5);l<a;l++){let u=this.top.children[l];if(u.matchesNode(e,n,r)&&!this.preMatch.matched.has(u)){o=l;break}}return o<0?!1:(this.destroyBetween(this.index,o),this.index++,!0)}updateNodeAt(e,n,r,i,o,s){let l=this.top.children[i];return l.damage&4&&l.dom==l.contentDOM&&(l.damage=2),l.update(e,n,r,o,s)?(this.destroyBetween(this.index,i),this.index++,!0):!1}findIndexWithChild(e){for(;;){let n=e.parentNode;if(!n)return-1;if(n==this.top.contentDOM){let r=e.pmViewDesc;if(r){for(let i=this.index;i<this.top.children.length;i++)if(this.top.children[i]==r)return i}return-1}e=n}}updateNextNode(e,n,r,i,o,s){for(let l=this.index;l<this.top.children.length;l++){let a=this.top.children[l];if(a instanceof On){let u=this.preMatch.matched.get(a);if(u!=null&&u!=o)return!1;let c=a.dom,f,h=this.isLocked(c)&&!(e.isText&&a.node&&a.node.isText&&a.nodeDOM.nodeValue==e.text&&!(a.damage&4)&&Tl(n,a.outerDeco));if(!h&&a.update(e,n,r,i,s))return this.destroyBetween(this.index,l),a.dom!=c&&(this.changed=!0),this.index++,!0;if(!h&&(f=this.recreateWrapper(a,e,n,r,i,s)))return this.destroyBetween(this.index,l),this.top.children[this.index]=f,f.contentDOM&&(f.damage|=2,f.updateChildren(i,s+1),f.damage=0),this.changed=!0,this.index++,!0;break}}return!1}recreateWrapper(e,n,r,i,o,s){if(e.damage&3||n.isAtom||!e.children.length||!e.node.content.eq(n.content)||!Tl(r,e.outerDeco)||!i.eq(e.innerDeco))return null;let l=On.create(this.top,n,r,i,o,s);if(l.contentDOM){l.children=e.children,e.children=[];for(let a of l.children)a.parent=l}return e.destroy(),l}addNode(e,n,r,i,o){let s=On.create(this.top,e,n,r,i,o);s.contentDOM&&s.updateChildren(i,o+1),this.top.children.splice(this.index++,0,s),this.changed=!0}placeWidget(e,n,r){let i=this.index<this.top.children.length?this.top.children[this.index]:null;if(i&&i.matchesWidget(e)&&(e==i.widget||!i.widget.type.toDOM.parentNode))this.index++;else{let o=new Ml(this.top,e,n,r);this.top.children.splice(this.index++,0,o),this.changed=!0}}addTextblockHacks(){let e=this.top.children[this.index-1],n=this.top;for(;e instanceof sr;)n=e,e=n.children[n.children.length-1];(!e||!(e instanceof Ho)||/\n$/.test(e.node.text)||this.view.requiresGeckoHackNode&&/\s$/.test(e.node.text))&&((Fe||Be)&&e&&e.dom.contentEditable=="false"&&this.addHackNode("IMG",n),this.addHackNode("BR",this.top))}addHackNode(e,n){if(n==this.top&&this.index<n.children.length&&n.children[this.index].matchesHack(e))this.index++;else{let r=document.createElement(e);e=="IMG"&&(r.className="ProseMirror-separator",r.alt=""),e=="BR"&&(r.className="ProseMirror-trailingBreak");let i=new Nl(this.top,[],r,null);n!=this.top?n.children.push(i):n.children.splice(this.index++,0,i),this.changed=!0}}isLocked(e){return this.lock&&(e==this.lock||$(e)&&e.contains(this.lock.parentNode))}};function CC(t,e){let n=e,r=n.children.length,i=[],o=t.childCount,s=new Map,l=[];e:for(;o>0;){let a;for(;;)if(r){let c=n.children[r-1];if(c instanceof sr)i.push(r-1),n=c,r=c.children.length;else{a=c,r--;break}}else{if(n==e)break e;r=i.pop(),n=n.parent}let u=a.node;if(u){if(u!=t.child(o-1))break;--o,s.set(a,o),l.push(a)}}return{index:o,matched:s,matches:l.reverse()}}function SC(t,e){return t.type.side-e.type.side}function MC(t,e,n,r){let i=e.locals(t),o=0;if(i.length==0){for(let u=0;u<t.childCount;u++){let c=t.child(u);r(c,i,e.forChild(o,c),u),o+=c.nodeSize}return}let s=0,l=[],a=null;for(let u=0;;){let c,f;for(;s<i.length&&i[s].to==o;){let y=i[s++];y.widget&&(c?(f||(f=[c])).push(y):c=y)}if(c)if(f){f.sort(SC);for(let y=0;y<f.length;y++)n(f[y],u,!!a)}else n(c,u,!!a);let h,p;if(a)p=-1,h=a,a=null;else if(u<t.childCount)p=u,h=t.child(u++);else break;for(let y=0;y<l.length;y++)l[y].to<=o&&l.splice(y--,1);for(;s<i.length&&i[s].from<=o&&i[s].to>o;)l.push(i[s++]);let d=o+h.nodeSize;if(h.isText){let y=d;s<i.length&&i[s].from<y&&(y=i[s].from);for(let g=0;g<l.length;g++)l[g].to<y&&(y=l[g].to);y<d&&(a=h.cut(y-o),h=h.cut(0,y-o),d=y,p=-1)}else for(;s<i.length&&i[s].to<d;)s++;let m=h.isInline&&!h.isLeaf?l.filter(y=>!y.inline):l.slice();r(h,m,e.forChild(o,h),p),o=d}}function NC(t){if(t.nodeName=="UL"||t.nodeName=="OL"){let e=t.style.cssText;t.style.cssText=e+"; list-style: square !important",window.getComputedStyle(t).listStyle,t.style.cssText=e}}function IC(t,e,n,r){for(let i=0,o=0;i<t.childCount&&o<=r;){let s=t.child(i++),l=o;if(o+=s.nodeSize,!s.isText)continue;let a=s.text;for(;i<t.childCount;){let u=t.child(i++);if(o+=u.nodeSize,!u.isText)break;a+=u.text}if(o>=n){if(o>=r&&a.slice(r-e.length-l,r-l)==e)return r-e.length;let u=l<r?a.lastIndexOf(e,r-l-1):-1;if(u>=0&&u+e.length+l>=n)return l+u;if(n==r&&a.length>=r+e.length-l&&a.slice(r-l,r-l+e.length)==e)return r}}return-1}function Uu(t,e,n,r,i){let o=[];for(let s=0,l=0;s<t.length;s++){let a=t[s],u=l,c=l+=a.size;u>=n||c<=e?o.push(a):(u<e&&o.push(a.slice(0,e-u,r)),i&&(o.push(i),i=void 0),c>n&&o.push(a.slice(n-u,a.size,r)))}return o}function Gu(t,e){let{$anchor:n,$head:r}=t.selection,i=e>0?n.max(r):n.min(r),o=i.parent.inlineContent?i.depth?t.doc.resolve(e>0?i.after():i.before()):null:i;return o&&_.findFrom(o,e)}function An(t,e){return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()),!0}function Gm(t,e,n){let r=t.state.selection;if(r instanceof j)if(n.indexOf("s")>-1){let{$head:i}=r,o=i.textOffset?null:e<0?i.nodeBefore:i.nodeAfter;if(!o||o.isText||!o.isLeaf)return!1;let s=t.state.doc.resolve(i.pos+o.nodeSize*(e<0?-1:1));return An(t,new j(r.$anchor,s))}else if(r.empty){if(t.endOfTextblock(e>0?"forward":"backward")){let i=Gu(t.state,e);return i&&i instanceof H?An(t,i):!1}else if(!ft||n.indexOf("m")<0){let i=r.$head,o=i.textOffset?null:e<0?i.nodeBefore:i.nodeAfter,s;if(!o||o.isText)return!1;let l=e<0?i.pos-o.nodeSize:i.pos;return o.isAtom||(s=t.docView.descAt(l))&&!s.contentDOM?H.isSelectable(o)?An(t,new H(e<0?t.state.doc.resolve(i.pos-o.nodeSize):i)):An(t,new j(t.state.doc.resolve(e<0?l:l+o.nodeSize))):!1}}else return!1;else{if(r instanceof H&&r.node.isInline)return An(t,new j(e>0?r.$to:r.$from));{let i=Gu(t.state,e);return i?An(t,i):!1}}}function jo(t,e){let n=t.pmViewDesc;return n?n.size==0&&(e<0||t.nextSibling||t.nodeName!="BR"):$(t)&&t.contentEditable=="false"}function fi(t,e){return e<0?TC(t):AC(t)}function TC(t){let e=t.domSel.readRange(),n=e.focusNode,r=e.focusOffset;if(!n)return;let i,o,s=!1;for(wt&&$(n)&&r<Re(n)&&jo(n.childNodes[r],-1)&&(s=!0);;)if(r>0){if(!$(n))break;let l=n.childNodes[r-1];if(jo(l,-1))i=n,o=--r;else if(ge(l))n=l,r=n.nodeValue.length;else break}else{if(Og(n))break;{let l=n.previousSibling;for(;l&&jo(l,-1);)i=n.parentNode,o=Ne(l),l=l.previousSibling;if(l)n=l,r=Re(n);else{if(n=n.parentNode,n==t.dom)break;r=0}}}s?Qu(t,n,r):i&&Qu(t,i,o)}function AC(t){let e=t.domSel.readRange(),n=e.focusNode,r=e.focusOffset;if(!n)return;let i=Re(n),o,s;for(;;)if(r<i){if(!$(n))break;let l=n.childNodes[r];if(jo(l,1))o=n,s=++r;else break}else{if(Og(n))break;{let l=n.nextSibling;for(;l&&jo(l,1);)o=l.parentNode,s=Ne(l)+1,l=l.nextSibling;if(l)n=l,r=0,i=Re(n);else{if(n=n.parentNode,n==t.dom)break;r=i=0}}}o&&Qu(t,o,s)}function Og(t){for(let e=t;e;e=e.parentNode){let n=e.pmViewDesc;if(n)return n.node?n.node.isBlock:!1}return!1}function vC(t,e){for(;t&&e==t.childNodes.length&&!Yo(t);)e=Ne(t)+1,t=t.parentNode;for(;t&&e<t.childNodes.length;){let n=t.childNodes[e];if(ge(n))return n;if($(n)&&n.contentEditable=="false")break;t=n,e=0}}function EC(t,e){for(;t&&!e&&!Yo(t);)e=Ne(t),t=t.parentNode;for(;t&&e;){let n=t.childNodes[e-1];if(ge(n))return n;if($(n)&&n.contentEditable=="false")break;t=n,e=t.childNodes.length}}function Qu(t,e,n){if(!ge(e)){let s,l;(l=vC(e,n))?(e=l,n=0):(s=EC(e,n))&&(e=s,n=s.nodeValue.length)}let r=t.domSelection(),i=t.domSel.readRange();if(!r)return;Rl(i)?r.collapse(e,n):r.extend&&(r.collapse(i.anchorNode,i.anchorOffset),r.extend(e,n)),t.domSel.ignore();let{state:o}=t;setTimeout(()=>{t.state==o&&t.domSel.sync()},50)}function Qm(t,e){let n=t.state.doc.resolve(e);if(!(Be||wg)&&n.parent.inlineContent){let o=t.coordsAtPos(e);if(e>n.start()){let s=t.coordsAtPos(e-1),l=(s.top+s.bottom)/2;if(l>o.top&&l<o.bottom&&Math.abs(s.left-o.left)>1)return s.left<o.left?"ltr":"rtl"}if(e<n.end()){let s=t.coordsAtPos(e+1),l=(s.top+s.bottom)/2;if(l>o.top&&l<o.bottom&&Math.abs(s.left-o.left)>1)return s.left>o.left?"ltr":"rtl"}}let r=t.dom;for(let o=n.depth;o>0;o--)if(n.node(o).isBlock){r=t.nodeDOM(n.before(o))||r;break}return getComputedStyle(r).direction=="rtl"?"rtl":"ltr"}function Ym(t,e,n){let r=t.state.selection;if(r instanceof j&&!r.empty||n.indexOf("s")>-1||ft&&n.indexOf("m")>-1)return!1;let{$from:i,$to:o}=r;if(!i.parent.inlineContent||t.endOfTextblock(e<0?"up":"down")){let s=Gu(t.state,e);if(s&&s instanceof H)return An(t,s)}if(!i.parent.inlineContent){let s=e<0?i:o,l=r instanceof nt?_.near(s,e):_.findFrom(s,e);return l?An(t,l):!1}return!1}function Xm(t,e){if(!(t.state.selection instanceof j))return!0;let{$head:n,$anchor:r,empty:i}=t.state.selection;if(!n.sameParent(r))return!0;if(!i)return!1;if(t.endOfTextblock(e>0?"forward":"backward"))return!0;let o=!n.textOffset&&(e<0?n.nodeBefore:n.nodeAfter);if(o&&!o.isText){let s=t.state.tr;return e<0?s.delete(n.pos-o.nodeSize,n.pos):s.delete(n.pos,n.pos+o.nodeSize),t.dispatch(s),!0}return!1}function Zm(t,e,n){t.domObserver.stopped(()=>e.contentEditable=n)}function OC(t){if(!Fe||t.state.selection.$head.parentOffset>0)return!1;let{focusNode:e,focusOffset:n}=t.domSel.readRange();if(e&&$(e)&&n==0&&e.firstChild&&$(e.firstChild)&&e.firstChild.contentEditable=="false"){let r=e.firstChild;Zm(t,r,"true"),setTimeout(()=>Zm(t,r,"false"),20)}return!1}function RC(t){let e="";return t.ctrlKey&&(e+="c"),t.metaKey&&(e+="m"),t.altKey&&(e+="a"),t.shiftKey&&(e+="s"),e}function DC(t,e){let n=e.keyCode,r=RC(e);if(n==8||ft&&n==72&&r=="c")return Xm(t,-1)||fi(t,-1);if(n==46&&!e.shiftKey||ft&&n==68&&r=="c")return Xm(t,1)||fi(t,1);if(n==13||n==27)return!0;if(n==37||ft&&n==66&&r=="c"){let i=n==37?Qm(t,t.state.selection.from)=="ltr"?-1:1:-1;return Gm(t,i,r)||fi(t,i)}else if(n==39||ft&&n==70&&r=="c"){let i=n==39?Qm(t,t.state.selection.from)=="ltr"?1:-1:1;return Gm(t,i,r)||fi(t,i)}else{if(n==38||ft&&n==80&&r=="c")return Ym(t,-1,r)||fi(t,-1);if(n==40||ft&&n==78&&r=="c")return OC(t)||Ym(t,1,r)||fi(t,1);if(r==(ft?"m":"c")&&(n==66||n==73||n==89||n==90))return!0}return!1}function lc(t,e){t.someProp("transformCopied",p=>{e=p(e,t)});let n=[],{content:r,openStart:i,openEnd:o}=e;for(;i>1&&o>1&&r.childCount==1&&r.firstChild.childCount==1;){i--,o--;let p=r.firstChild;n.push(p.type.name,p.attrs!=p.type.defaultAttrs?p.attrs:null),r=p.content}let s=t.someProp("clipboardSerializer")||xt.fromSchema(t.state.schema),l=Bg(),a=l.createElement("div");a.appendChild(s.serializeFragment(r,{document:l}));let u=a.firstChild,c,f=0;for(;u&&$(u)&&(c=zg[u.nodeName.toLowerCase()]);){for(let p=c.length-1;p>=0;p--){let d=l.createElement(c[p]);for(;a.firstChild;)d.appendChild(a.firstChild);a.appendChild(d),f++}u=a.firstChild}u&&$(u)&&u.setAttribute("data-pm-slice",`${i} ${o}${f?` -${f}`:""} ${JSON.stringify(n)}`);let h=t.someProp("clipboardTextSerializer",p=>p(e,t))||e.content.textBetween(0,e.content.size,`

`);return{dom:a,text:h,slice:e}}function Rg(t,e,n,r,i){let o=i.parent.type.spec.code,s,l;if(!n&&!e)return null;let a=!!e&&(r||o||!n);if(a){if(t.someProp("transformPastedText",h=>{e=h(e,o||r,t)}),o)return l=new E(A.from(t.state.schema.text(e.replace(/\r\n?/g,`
`))),0,0),t.someProp("transformPasted",h=>{l=h(l,t,!0)}),l;let f=t.someProp("clipboardTextParser",h=>h(e,i,r,t));if(f)l=f;else{let h=i.marks(),{schema:p}=t.state,d=xt.fromSchema(p);s=document.createElement("div"),e.split(/(?:\r\n?|\n)+/).forEach(m=>{let y=s.appendChild(document.createElement("p"));m&&y.appendChild(d.serializeNode(p.text(m,h)))})}}else t.someProp("transformPastedHTML",f=>{n=f(n,t)}),s=BC(n),Dl&&FC(s);let u=s&&s.querySelector("[data-pm-slice]"),c=u&&/^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(u.getAttribute("data-pm-slice")||"");if(c&&c[3])for(let f=+c[3];f>0;f--){let h=s.firstChild;for(;h&&!$(h);)h=h.nextSibling;if(!h)break;s=h}if(l||(l=(t.someProp("clipboardParser")||t.someProp("domParser")||kt.fromSchema(t.state.schema)).parseSlice(s,{preserveWhitespace:!!(a||c),context:i,ruleFromNode(h){return h.nodeName=="BR"&&!h.nextSibling&&h.parentNode&&!PC.test(h.parentNode.nodeName)?{ignore:!0}:null}})),c)l=_C(eg(l,+c[1],+c[2]),c[4]);else if(l=E.maxOpen(LC(l.content,i),!0),l.openStart||l.openEnd){let f=0,h=0;for(let p=l.content.firstChild;f<l.openStart&&!p.type.spec.isolating;f++,p=p.firstChild);for(let p=l.content.lastChild;h<l.openEnd&&!p.type.spec.isolating;h++,p=p.lastChild);l=eg(l,f,h)}return t.someProp("transformPasted",f=>{l=f(l,t,r)}),l}var PC=/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;function LC(t,e){if(t.childCount<2)return t;for(let n=e.depth;n>=0;n--){let i=e.node(n).contentMatchAt(e.index(n)),o,s=[];if(t.forEach(l=>{if(!s)return;let a=i.findWrapping(l.type),u;if(!a)return s=null;if(u=s.length&&o.length&&Pg(a,o,l,s[s.length-1],0))s[s.length-1]=u;else{s.length&&(s[s.length-1]=Lg(s[s.length-1],o.length));let c=Dg(l,a);s.push(c),i=i.matchType(c.type),o=a}}),s)return A.from(s)}return t}function Dg(t,e,n=0){for(let r=e.length-1;r>=n;r--)t=e[r].create(null,A.from(t));return t}function Pg(t,e,n,r,i){if(i<t.length&&i<e.length&&t[i]==e[i]){let o=Pg(t,e,n,r.lastChild,i+1);if(o)return r.copy(r.content.replaceChild(r.childCount-1,o));if(r.contentMatchAt(r.childCount).matchType(i==t.length-1?n.type:t[i+1]))return r.copy(r.content.append(A.from(Dg(n,t,i+1))))}}function Lg(t,e){if(e==0)return t;let n=t.content.replaceChild(t.childCount-1,Lg(t.lastChild,e-1)),r=t.contentMatchAt(t.childCount).fillBefore(A.empty,!0);return t.copy(n.append(r))}function Yu(t,e,n,r,i,o){let s=e<0?t.firstChild:t.lastChild,l=s.content;return t.childCount>1&&(o=0),i<r-1&&(l=Yu(l,e,n,r,i+1,o)),i>=n&&(l=e<0?s.contentMatchAt(0).fillBefore(l,o<=i).append(l):l.append(s.contentMatchAt(s.childCount).fillBefore(A.empty,!0))),t.replaceChild(e<0?0:t.childCount-1,s.copy(l))}function eg(t,e,n){return e<t.openStart&&(t=new E(Yu(t.content,-1,e,t.openStart,0,t.openEnd),e,t.openEnd)),n<t.openEnd&&(t=new E(Yu(t.content,1,n,t.openEnd,0,0),t.openStart,n)),t}var zg={thead:["table"],tbody:["table"],tfoot:["table"],caption:["table"],colgroup:["table"],col:["table","colgroup"],tr:["table","tbody"],td:["table","tbody","tr"],th:["table","tbody","tr"]};function Bg(){return document.implementation.createHTMLDocument("title")}var $o=null;function zC(t){let e=window.trustedTypes;if(!e)return t;if(!$o){if($o=e.defaultPolicy)try{return $o.createHTML(t)}catch{}$o=e.createPolicy("ProseMirrorClipboard",{createHTML:n=>n})}return $o.createHTML(t)}function BC(t){let e=/^(\s*<meta [^>]*>)*/.exec(t);e&&(t=t.slice(e[0].length));let n=Bg(),r=n.body,i=/<([a-z][^>\s]+)/i.exec(t),o;if((o=i&&zg[i[1].toLowerCase()])&&(t=o.map(s=>"<"+s+">").join("")+t+o.map(s=>"</"+s+">").reverse().join("")),r.innerHTML=zC(t),o)for(let s=0;s<o.length;s++)r=r.querySelector(o[s])||r;for(let s=0;s<n.styleSheets.length;s++){let l=n.styleSheets[s];for(let a=0;a<l.rules.length;a++){let u=l.rules[a];if(u instanceof CSSStyleRule){let c=r.querySelectorAll(u.selectorText);for(let f=0;f<c.length;f++)c[f].style.cssText+=u.style.cssText}}}return r}function FC(t){let e=t.querySelectorAll(Be?"span:not([class]):not([style])":"span.Apple-converted-space");for(let n=0;n<e.length;n++){let r=e[n];r.childNodes.length==1&&r.textContent=="\xA0"&&r.parentNode&&r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "),r)}}function _C(t,e){if(!t.size)return t;let n=t.content.firstChild.type.schema,r;try{r=JSON.parse(e)}catch{return t}let{content:i,openStart:o,openEnd:s}=t;for(let l=r.length-2;l>=0;l-=2){let a=n.nodes[r[l]];if(!a||a.hasRequiredAttrs()||!a.createAndFill(null,i))break;try{i=A.from(a.create(r[l+1],i))}catch{break}o++,s++}return new E(i,o,s)}var rt=class t{constructor(e,n,r,i){this.anchorNode=e,this.anchorOffset=n,this.focusNode=r,this.focusOffset=i}static from(e){return e instanceof t?e:new t(e.anchorNode,e.anchorOffset,e.focusNode,e.focusOffset)}eq(e){return e.anchorNode==this.anchorNode&&e.anchorOffset==this.anchorOffset&&e.focusNode==this.focusNode&&e.focusOffset==this.focusOffset}};rt.null=new rt(null,0,null,0);var Xu=class{constructor(e){this.view=e,this.range=rt.null,this.active=!1,this.synced=!1,this.suppress=!1,this.currentDocument=null,this.onSelectionChange=this.onSelectionChange.bind(this)}ensureListener(){let e=this.view.dom.ownerDocument;e!=this.currentDocument&&(this.currentDocument&&this.currentDocument.removeEventListener("selectionchange",this.onSelectionChange),this.currentDocument=e,e.addEventListener("selectionchange",this.onSelectionChange))}destroy(){this.currentDocument&&(this.currentDocument.removeEventListener("selectionchange",this.onSelectionChange),this.currentDocument=null),this.active=!1,this.range=rt.null}suppressChanges(){this.suppress=!0,setTimeout(()=>this.suppress=!1,50)}onSelectionChange(){if(this.suppress&&this.view.hasFocus())return this.sync();this.read()&&this.view.domObserver.flush(!1)}readRange(){let{view:e}=this,n=e.dom.isConnected!==!1&&e.domSelection();return n?Fe&&e.root.nodeType===11&&iC(e.dom.ownerDocument)==e.dom?rt.from($C(e,n)||n):rt.from(n):rt.null}read(){this.ensureListener();let e=$g(this.view);if(!e){this.active=!1,this.range=rt.null;return}return this.active=!0,this.range.eq(e)?!1:(this.range=e,this.synced=!1,!0)}sync(e=!1){let{view:n}=this;n.docView&&(this.ensureListener(),n.domObserver.stopped(()=>{qC(n,n.state.selection);let r=n.state.selection;if(Fg(n)){let{desc:i,start:o}=_g(n.docView,r.from,r.to,0);n.cursorWrapper?WC(n):i instanceof Il&&i.spec.setSelection?i.spec.setSelection(r.anchor-o,r.head-o,n.root):VC(n,e,i,o),this.synced=this.active=!0}r.visible==n.dom.classList.contains("ProseMirror-hideselection")&&(r.visible?n.dom.classList.remove("ProseMirror-hideselection"):(n.dom.classList.add("ProseMirror-hideselection"),HC(n))),this.range=this.readRange()}))}ignore(e=this.readRange()){this.range=rt.from(e),this.synced=!0}deactivate(){this.range=rt.null,this.active=this.synced=!1}};function $C(t,e){if(e.getComposedRanges){let i=e.getComposedRanges(t.root)[0];if(i)return tg(t,i)}let n;function r(i){i.preventDefault(),i.stopImmediatePropagation(),n=i.getTargetRanges()[0]}return t.dom.addEventListener("beforeinput",r,!0),document.execCommand("indent"),t.dom.removeEventListener("beforeinput",r,!0),n?tg(t,n):null}function tg(t,e){let n=e.startContainer,r=e.startOffset,i=e.endContainer,o=e.endOffset,s=t.domAtPos(t.state.selection.anchor);return Sl(s.node,s.offset,i,o)&&([n,r,i,o]=[i,o,n,r]),new rt(n,r,i,o)}function ac(t,e,n=null){let r=t.state.doc;if(!e.focusNode)return null;let i=t.docView.nearestDesc(e.focusNode),o=i&&i.size==0,s=t.docView.posFromDOM(e.focusNode,e.focusOffset,1);if(s<0)return null;let l=r.resolve(s),a,u;if(Rl(e)){for(a=s;i&&!i.node;)i=i.parent;if(i&&i.node.isAtom&&H.isSelectable(i.node)&&i.parent&&!(i.node.isInline&&nC(e.focusNode,e.focusOffset,i.dom))){let f=i.posBefore;u=new H(s==f?l:r.resolve(f))}else if(wt&&n=="key"&&s>t.state.selection.to&&$(e.focusNode)&&e.focusOffset==e.focusNode.childNodes.length&&i&&i.posAtStart>t.state.selection.to)for(let f=e.focusNode;;f=f.parentNode){if(getComputedStyle(f).overflow!="visible"){u=_.findFrom(r.resolve(i.posAtStart),1);break}if(f==i.dom||f.nextSibling||!f.parentNode||!$(f.parentNode))break}}else{if(e instanceof t.dom.ownerDocument.defaultView.Selection&&e.rangeCount>1){let f=s,h=s;for(let p=0;p<e.rangeCount;p++){let d=e.getRangeAt(p);f=Math.min(f,t.docView.posFromDOM(d.startContainer,d.startOffset,1)),h=Math.max(h,t.docView.posFromDOM(d.endContainer,d.endOffset,-1))}if(f<0)return null;[a,s]=h==t.state.selection.anchor?[h,f]:[f,h],l=r.resolve(s)}else a=t.docView.posFromDOM(e.anchorNode,e.anchorOffset,1);if(a<0)return null}let c=r.resolve(a);if(!u){let f=n=="pointer"||t.state.selection.head<l.pos&&!o?1:-1;u=yi(t,c,l,f)}return u}function Fg(t){return t.editable?t.hasFocus():Vg(t,t.domSel.readRange())&&(!document.activeElement||document.activeElement.contains(t.dom))}function VC(t,e,n,r){let i=t.state.selection,{anchor:o,head:s}=i,l,a;ng&&!(i instanceof j)&&(i.$from.parent.inlineContent||(l=rg(t,i.from)),!i.empty&&!i.$from.parent.inlineContent&&(a=rg(t,i.to)));let u=n.domFromPos(o-r,o>r?-1:1),c=s==o?u:n.domFromPos(s-r,s>r?-1:1);jC(o,s,u,c,t,e),ng&&(l&&ig(l),a&&ig(a))}function _g(t,e,n,r=0){for(let i=0,o=r;i<t.children.length;i++){let s=t.children[i],l=o+s.size;if(e>o&&n<l)return _g(s,e,n,o+s.border);o=l}return{desc:t,start:r}}function jC(t,e,n,r,i,o){let s=!1;if((wt||Fe)&&t==e){let{node:a,offset:u}=n;if(ge(a)){if(s=!!(u&&a.nodeValue[u-1]==`
`),s&&u==a.nodeValue.length)for(let c=a,f;c;c=c.parentNode){if(f=c.nextSibling){f.nodeName=="BR"&&(n=r={node:f.parentNode,offset:Ne(f)+1});break}let h=c.pmViewDesc;if(h&&h.node&&h.node.isBlock)break}}else{let c=a.childNodes[u-1];s=c&&(c.nodeName=="BR"||c.contentEditable=="false")}}let l=i.domSel.readRange();if(wt&&l.focusNode&&l.focusNode!=r.node&&$(l.focusNode)){let a=l.focusNode.childNodes[l.focusOffset];a&&a.contentEditable=="false"&&(o=!0)}!(o||s&&Fe)&&Sl(n.node,n.offset,l.anchorNode,l.anchorOffset)&&Sl(r.node,r.offset,l.focusNode,l.focusOffset)||xg(i.domSelection(),{focusNode:r.node,focusOffset:r.offset,anchorNode:n.node,anchorOffset:n.offset})}var ng=Fe||Be&&bg<63;function rg(t,e){let{node:n,offset:r}=t.docView.domFromPos(e,0),i=r<n.childNodes.length?n.childNodes[r]:null,o=r?n.childNodes[r-1]:null;if(Fe&&i&&i.contentEditable=="false")return $u(i);if((!i||i.contentEditable=="false")&&(!o||o.contentEditable=="false")){if(i)return $u(i);if(o)return $u(o)}}function $u(t){return t.contentEditable="true",Fe&&t.draggable&&(t.draggable=!1,t.wasDraggable=!0),t}function ig(t){t.contentEditable="false",t.wasDraggable&&(t.draggable=!0,t.wasDraggable=null)}function HC(t){let e=t.dom.ownerDocument;e.removeEventListener("selectionchange",t.input.hideSelectionGuard);let n=t.domSel.readRange(),r=n.anchorNode,i=n.anchorOffset;e.addEventListener("selectionchange",t.input.hideSelectionGuard=()=>{(n.anchorNode!=r||n.anchorOffset!=i)&&(e.removeEventListener("selectionchange",t.input.hideSelectionGuard),setTimeout(()=>{(!Fg(t)||t.state.selection.visible)&&t.dom.classList.remove("ProseMirror-hideselection")},20))})}function WC(t){let e=t.domSelection();if(!e)return;let n=t.cursorWrapper.dom;n.nodeName=="IMG"?e.collapse(n.parentNode,Ne(n)+1):e.collapse(n,0)}function qC(t,e){if(e instanceof H){let n=t.docView.descAt(e.from);n!=t.lastSelectedViewDesc&&(og(t),n&&n.selectNode(),t.lastSelectedViewDesc=n)}else og(t)}function og(t){t.lastSelectedViewDesc&&(t.lastSelectedViewDesc.parent&&t.lastSelectedViewDesc.deselectNode(),t.lastSelectedViewDesc=void 0)}function yi(t,e,n,r){let i=t.someProp("createSelectionBetween",o=>o(t,e,n))||j.between(e,n,r);return t.someProp("adjustSelectionFromDOM",o=>{i=o(t,i)}),i}function $g(t){if(t.editable&&!t.hasFocus())return null;let e=t.domSel.readRange();return e&&Vg(t,e)?e:null}function Vg(t,e){if(!e.anchorNode)return!1;try{return di(t.dom,e.anchorNode)&&(t.editable||di(t.dom,e.focusNode))}catch{return!1}}var _e={},$e={},KC={touchstart:!0,touchmove:!0},Zu=class{constructor(){this.shiftKey=!1,this.mouseDown=null,this.lastKeyCode=null,this.lastKeyCodeTime=0,this.lastKeyDispatched=!1,this.lastClick={time:0,x:0,y:0,type:"",button:0},this.lastSelectionOrigin=null,this.lastSelectionTime=0,this.lastIOSEnter=0,this.lastIOSEnterFallbackTimeout=-1,this.lastFocus=0,this.lastTouch=0,this.lastChromeDelete=0,this.composing=!1,this.compositionNode=null,this.composingTimeout=-1,this.compositionNodes=[],this.compositionEndedAt=-2e8,this.compositionID=1,this.badSafariComposition=!1,this.compositionPendingChanges=0,this.domChangeCount=0,this.eventHandlers=Object.create(null),this.hideSelectionGuard=null}};function JC(t){for(let e in _e){let n=_e[e];t.dom.addEventListener(e,t.input.eventHandlers[e]=r=>{GC(t,r)&&(t.input.composing&&(r.type=="keydown"||r.type=="beforeinput")&&r.isComposing===!1&&Wg(t,!0),!uc(t,r)&&(t.editable||!(r.type in $e))&&n(t,r))},KC[e]?{passive:!0}:void 0)}Fe&&t.dom.addEventListener("input",()=>null),ec(t)}function Pl(t,e){t.input.lastSelectionOrigin=e,t.input.lastSelectionTime=Date.now()}function UC(t){t.input.mouseDown&&t.input.mouseDown.done(),t.domObserver.stop();for(let e in t.input.eventHandlers)t.dom.removeEventListener(e,t.input.eventHandlers[e]);clearTimeout(t.input.composingTimeout),clearTimeout(t.input.lastIOSEnterFallbackTimeout)}function ec(t){t.someProp("handleDOMEvents",e=>{for(let n in e)t.input.eventHandlers[n]||t.dom.addEventListener(n,t.input.eventHandlers[n]=r=>uc(t,r))})}function uc(t,e){return t.someProp("handleDOMEvents",n=>{let r=n[e.type];return r?r(t,e)||e.defaultPrevented:!1})}function GC(t,e){if(!e.bubbles)return!0;if(e.defaultPrevented)return!1;for(let n=e.target;n!=t.dom;n=n.parentNode)if(!n||n.nodeType==11||n.pmViewDesc&&n.pmViewDesc.stopEvent(e))return!1;return!0}function QC(t,e){!uc(t,e)&&_e[e.type]&&(t.editable||!(e.type in $e))&&_e[e.type](t,e)}function vn(t,e){let{input:n}=t;return n.lastKeyDispatched||t.composing?!1:(n.lastKeyDispatched=!0,typeof e=="string"&&(e=rC(e=="Backspace"?8:13,e)),t.someProp("handleKeyDown",r=>r(t,e)))}$e.keydown=(t,e)=>{let n=e;if(t.input.shiftKey=n.keyCode==16||n.shiftKey,t.input.lastKeyCode=n.keyCode,t.input.lastKeyCodeTime=Date.now(),t.input.lastKeyDispatched=!1,!(en&&Be&&n.keyCode==13)){if(gi&&n.keyCode==13&&!n.ctrlKey&&!n.altKey&&!n.metaKey){let r=Date.now();t.input.lastIOSEnter=r,t.input.lastIOSEnterFallbackTimeout=setTimeout(()=>{t.input.lastIOSEnter==r&&(vn(t,"Enter"),t.input.lastIOSEnter=0)},200);return}n.keyCode!=229&&t.domObserver.forceFlush(!0),vn(t,n)||DC(t,n)?n.preventDefault():Pl(t,"key")}};$e.keyup=(t,e)=>{e.keyCode==16&&(t.input.shiftKey=!1)};$e.keypress=(t,e)=>{let n=e;if(iS(t)||!n.charCode||n.ctrlKey&&!n.altKey||ft&&n.metaKey)return;if(t.someProp("handleKeyPress",i=>i(t,n))){n.preventDefault();return}let r=t.state.selection;if(!(r instanceof j)||!r.$from.sameParent(r.$to)){let i=String.fromCharCode(n.charCode),o=()=>t.state.tr.insertText(i).scrollIntoView();!/[\r\n]/.test(i)&&!t.someProp("handleTextInput",s=>s(t,r.$from.pos,r.$to.pos,i,o))&&t.dispatch(o()),n.preventDefault()}};function qo(t){return{left:t.clientX,top:t.clientY}}function YC(t,e){let n=e.x-t.clientX,r=e.y-t.clientY;return n*n+r*r<100}function cc(t,e,n,r,i){if(r==-1)return!1;let o=t.state.doc.resolve(r);for(let s=o.depth+1;s>0;s--)if(t.someProp(e,l=>s>o.depth?l(t,n,o.nodeAfter,o.before(s),i,!0):l(t,n,o.node(s),o.before(s),i,!1)))return!0;return!1}function jg(t,e,n){if(t.focused||t.focus(),t.state.selection.eq(e))return;let r=t.state.tr.setSelection(e);r.setMeta("pointer",!0),t.dispatch(r)}function XC(t,e){if(e==-1)return!1;let n=t.state.doc.resolve(e),r=n.nodeAfter;return r&&r.isAtom&&H.isSelectable(r)?(jg(t,new H(n)),!0):!1}function ZC(t,e){if(e==-1)return!1;let n=t.state.selection,r,i;n instanceof H&&(r=n.node);let o=t.state.doc.resolve(e);for(let s=o.depth+1;s>0;s--){let l=s>o.depth?o.nodeAfter:o.node(s);if(H.isSelectable(l)){r&&n.$from.depth>0&&s>=n.$from.depth&&o.before(n.$from.depth+1)==n.$from.pos?i=o.before(n.$from.depth):i=o.before(s);break}}return i!=null?(jg(t,H.create(t.state.doc,i)),!0):!1}function eS(t,e,n,r,i){return cc(t,"handleClickOn",e,n,r)||t.someProp("handleClick",o=>o(t,e,r))||(i?ZC(t,n):XC(t,n))}function tS(t,e,n,r){return cc(t,"handleDoubleClickOn",e,n,r)||t.someProp("handleDoubleClick",i=>i(t,e,r))}function nS(t,e,n,r){return cc(t,"handleTripleClickOn",e,n,r)||t.someProp("handleTripleClick",i=>i(t,e,r))}function sg(t,e,n){if(e==-1)return t.inlineContent?j.create(t,0,t.content.size):null;let r=t.resolve(e);for(let i=r.depth+1;i>0;i--){let o=i>r.depth?r.nodeAfter:r.node(i),s=r.before(i);if(o.inlineContent)return j.create(t,s+1,s+1+o.content.size);if(n&&H.isSelectable(o))return H.create(t,s)}return null}var tc=/[\w_\u00a1-\uffff]+/g;try{tc=new RegExp("[\\p{L}\\p{N}_]+","gu")}catch{}function lg(t,e){let n=t.resolve(e),r=n.node(),i="",o=e,s=e;for(let m=n.indexAfter(),y=!1;m>0;m--){let g=r.child(m-1);if(!g.text)break;let M=o==e?e-n.posAtIndex(m-1):g.text.length,w=M;for(;w>0;w--)if(/\S/.test(g.text[w-1]))y=!0;else if(y)break;if(i=g.text.slice(w,M)+i,o-=M-w,w||o<e-50)break}for(let m=n.index(),y=!1;m<r.childCount;m++){let g=r.child(m);if(!g.text)break;let M=s==e?e-n.posAtIndex(m):0,w=M;for(;w<g.text.length;w++)if(/\S/.test(g.text[w]))y=!0;else if(y)break;if(i+=g.text.slice(M,w),s+=w-M,w<g.text.length||s>e+50)break}let l=o,a=s;if(Intl.Segmenter){for(let m of new Intl.Segmenter(void 0,{granularity:"word"}).segment(i))if(m.isWordLike){let y=m.index+o,g=y+m.segment.length;if(g<e)l=g;else if(y>e){a=y;break}else return j.create(t,y,g)}}else{tc.lastIndex=0;for(let m;m=tc.exec(i);){let y=m.index+o,g=y+m[0].length;if(g<e)l=g;else if(y>e){a=y;break}else return j.create(t,y,g)}}let u=i.slice(l-o,e-o),c=i.slice(e-o,a-o),f=/\S*$/.exec(u)[0].length,h=/^\S*/.exec(c)[0].length;if(f||h)return j.create(t,e-f,e+h);let p=/\s*$/.exec(u)[0].length,d=/^\s*/.exec(c)[0].length;return j.create(t,e-p,e+d)}var Hg=ft?"metaKey":"ctrlKey";_e.mousedown=(t,e)=>{let n=e,r=Date.now();if(t.input.shiftKey=n.shiftKey,t.input.lastTouch>r-500)return!1;cr(t);let i="singleClick";r-t.input.lastClick.time<500&&YC(n,t.input.lastClick)&&!n[Hg]&&t.input.lastClick.button==n.button&&(t.input.lastClick.type=="singleClick"?i="doubleClick":t.input.lastClick.type=="doubleClick"&&(i="tripleClick")),t.input.lastClick={time:r,x:n.clientX,y:n.clientY,type:i,button:n.button},t.input.mouseDown&&t.input.mouseDown.done();let o=t.posAtCoords(qo(n));if(o)if(n.button==0){if(!t.hasFocus()){Mg(t.dom);let l=t.root.activeElement;l&&!l.contains(t.dom)&&l.blur()}(t.input.mouseDown=new nc(t,o,n,i)).mightDrag||n.preventDefault()}else Pl(t,"pointer")};var nc=class{constructor(e,n,r,i){var o;this.view=e,this.startPos=n,this.event=r,this.type=i,this.didMove=!1,this.lastPos=-1,this.anchorRange=null,this.startDoc=e.state.doc,this.selectNode=!!r[Hg],this.extend=r.shiftKey,this.anchorDoc=this.startDoc;let s=ag(e);if(this.extend){let l=e.state.selection;this.anchorRange=l instanceof H?{from:l.from,to:l.to}:{from:l.anchor,to:l.anchor};let a=l instanceof H?e.nodeDOM(l.from).getBoundingClientRect():e.coordsAtPos(l.anchor);this.anchorOffset={x:(a.left+a.right)/2-s.x,y:(a.top+a.bottom)/2-s.y}}else this.anchorOffset={x:r.clientX-s.x,y:r.clientY-s.y};if(i=="singleClick"){let{selection:l}=e.state,a,u,c=!1;if(l instanceof H&&l.from<=n.pos&&l.to>=n.pos)u=l.from,a=l.node,c=!0;else if(n.inside>-1)a=e.state.doc.nodeAt(n.inside),u=n.inside;else{let f=e.state.doc.resolve(n.pos);a=f.parent,u=f.depth?f.before():-1}if(c||u>-1&&a.type.spec.draggable&&a.type.spec.selectable!==!1){let f=(o=e.docView.descAt(u))===null||o===void 0?void 0:o.nodeDOM;this.mightDrag={node:a,elt:f,pos:u,addAttr:!1},f&&!f.draggable&&(this.mightDrag.addAttr=!0,e.domObserver.stopped(()=>f.draggable=!0))}else this.mightDrag=rS(e,r)}else this.mightDrag=!1;e.root.addEventListener("mouseup",this.up=this.up.bind(this)),e.root.addEventListener("mousemove",this.move=this.move.bind(this)),this.mightDrag||this.select(this.startPos,!0)}done(){this.view.root.removeEventListener("mouseup",this.up),this.view.root.removeEventListener("mousemove",this.move),this.view.input.mouseDown==this&&(this.view.input.mouseDown=null),typeof this.mightDrag=="object"&&this.mightDrag.addAttr&&this.view.domObserver.stopped(()=>this.mightDrag.elt.removeAttribute("draggable"))}maybeRunHandler(e,n){return(this.type=="singleClick"?eS:this.type=="doubleClick"?tS:nS)(this.view,e.pos,e.inside,n,this.selectNode)}up(e){if(this.done(),!this.view.dom.contains(e.target))return;let n=this.startPos;this.view.state.doc!=this.startDoc&&(n=this.view.posAtCoords(qo(e))),n&&(this.didMove||this.maybeRunHandler(n,e)||this.select(n,!0),e.preventDefault())}move(e){if(e.buttons==0){this.done();return}if(!this.didMove&&(Math.abs(this.event.x-e.clientX)>8||Math.abs(this.event.y-e.clientY)>8)&&(this.didMove=!0,this.mightDrag=!1),!this.mightDrag){let n=this.view.posAtCoords(qo(e));n&&this.select(n,!1)}e.preventDefault()}select(e,n){if(e.pos==this.lastPos)return;this.lastPos=e.pos;let{view:r}=this,{doc:i}=r.state,o=this.type=="singleClick"?ug(r,i,e):this.type=="doubleClick"?lg(i,e.pos):sg(i,e.inside,n);o&&(n&&!this.extend?this.anchorRange=o:(!n||this.extend)&&(i.eq(this.anchorDoc)||this.restoreAnchor(),this.anchorRange&&this.anchorRange.from<o.from?o=yi(r,i.resolve(this.anchorRange.from),i.resolve(o.to)):this.anchorRange&&this.anchorRange.to>o.to&&(o=yi(r,i.resolve(this.anchorRange.to),i.resolve(o.from)))),o.eq(r.state.selection)||r.dispatch(r.state.tr.setSelection(o).setMeta("pointer",!0).scrollIntoView()))}restoreAnchor(){let e=ag(this.view),n=this.view.posAtCoords({left:this.anchorOffset.x+e.x,top:this.anchorOffset.y+e.y});if(!n)this.anchorRange=null;else{let{doc:r}=this.view.state;this.anchorRange=this.type=="singleClick"?ug(this.view,r,n):this.type=="doubleClick"?lg(r,n.pos):sg(r,n.inside,!1),this.anchorDoc=this.view.state.doc}}};function ag(t){let e=t.dom.getBoundingClientRect();return{x:e.left-t.dom.scrollLeft,y:e.top-t.dom.scrollTop}}function ug(t,e,n){if(n.inside>-1){let i=e.nodeAt(n.inside);if(i.isAtom&&H.isSelectable(i))return H.create(e,n.inside)}let r=e.resolve(n.pos);return yi(t,r,r)}function rS(t,e){let{selection:n}=t.state;if(n.empty)return!1;let r=t.domSelection();if(!r||r.rangeCount==0)return!0;let i=r.getRangeAt(0).getClientRects();for(let o=0;o<i.length;o++){let s=i[o];if(s.left<=e.clientX&&s.right>=e.clientX&&s.top<=e.clientY&&s.bottom>=e.clientY)return!0}return!1}_e.touchstart=t=>{t.input.lastTouch=Date.now(),cr(t),Pl(t,"pointer")};_e.touchmove=t=>{t.input.lastTouch=Date.now(),Pl(t,"pointer")};_e.contextmenu=t=>cr(t);function iS(t,e){return t.composing?!0:Fe&&Math.abs(Date.now()-t.input.compositionEndedAt)<500?(t.input.compositionEndedAt=-2e8,!0):!1}var oS=en?5e3:-1;$e.compositionstart=$e.compositionupdate=t=>{if(!t.composing){t.domObserver.flush();let{state:e}=t,n=e.selection.$to;if(e.selection instanceof j&&e.selection.empty&&(e.storedMarks||!n.textOffset&&n.parentOffset&&n.nodeBefore.marks.some(r=>r.type.spec.inclusive===!1)||Be&&wg&&sS(t)))t.markCursor=t.state.storedMarks||n.marks(),cr(t,!0),t.markCursor=null;else if(cr(t,!e.selection.empty),wt&&t.domSel.active&&e.selection.empty&&n.parentOffset&&!n.textOffset&&n.nodeBefore.marks.length)for(let{focusNode:r,focusOffset:i}=t.domSel.range;r&&$(r)&&i!=0;){let o=i<0?r.lastChild:r.childNodes[i-1];if(!o)break;if(ge(o)){let s=t.domSelection();s&&s.collapse(o,o.nodeValue.length);break}else r=o,i=-1}t.input.composing=!0}qg(t,oS)};function sS(t){let{focusNode:e,focusOffset:n}=t.domSel.range;if(!e||!$(e)||n>=e.childNodes.length)return!1;let r=e.childNodes[n];return $(r)&&r.contentEditable=="false"}$e.compositionend=(t,e)=>{t.composing&&Wg(t)};function Wg(t,e=!1){t.input.composing=!1,t.input.compositionEndedAt=Date.now(),t.input.compositionPendingChanges=t.domObserver.pendingRecords().length?t.input.compositionID:0,t.input.compositionNode=null,t.input.badSafariComposition?t.domObserver.forceFlush():t.input.compositionPendingChanges&&Promise.resolve().then(()=>t.domObserver.flush()),t.input.compositionID++,e?cr(t):qg(t,20)}function qg(t,e){clearTimeout(t.input.composingTimeout),e>-1&&(t.input.composingTimeout=setTimeout(()=>cr(t),e))}function Kg(t){t.composing&&(t.input.composing=!1,t.input.compositionEndedAt=Date.now());for(let e;e=t.input.compositionNodes.pop();)e.markParentDamage()}function lS(t){let e=t.domSel.range;if(!t.domSel.active||!e.focusNode)return null;let n=eC(e.focusNode,e.focusOffset),r=tC(e.focusNode,e.focusOffset);if(n&&r&&n!=r){let i=r.pmViewDesc,o=t.domObserver.lastChangedTextNode;if(n==o||r==o)return o;if(!i||!i.isText(r.nodeValue))return r;if(t.input.compositionNode==r){let s=n.pmViewDesc;if(!(!s||!s.isText(n.nodeValue)))return r}}return n||r}function cr(t,e=!1){if(!(en&&t.domObserver.flushingSoon>=0)&&(t.domObserver.forceFlush(),Kg(t),e||t.docView&&t.docView.damage)){let n=ac(t,t.domSel.readRange()),r=t.state.selection;n&&!n.eq(r)?t.dispatch(t.state.tr.setSelection(n)):(t.markCursor||e)&&!r.$from.node(r.$from.sharedDepth(r.to)).inlineContent?t.dispatch(t.state.tr.deleteSelection()):t.updateState(t.state)}}function aS(t,e){if(!t.dom.parentNode)return;let n=t.dom.parentNode.appendChild(document.createElement("div"));n.appendChild(e),n.style.cssText="position: fixed; left: -10000px; top: 10px";let r=getSelection(),i=document.createRange();i.selectNodeContents(e),t.dom.blur(),r.removeAllRanges(),r.addRange(i),setTimeout(()=>{n.parentNode&&n.parentNode.removeChild(n),t.focus()},50)}var Ko=gi&&sC<604;_e.copy=$e.cut=(t,e)=>{let n=e,r=t.state.selection,i=n.type=="cut";if(r.empty)return;let o=Ko?null:n.clipboardData,s=r.content(),{dom:l,text:a}=lc(t,s);o?(n.preventDefault(),o.clearData(),o.setData("text/html",l.innerHTML),o.setData("text/plain",a)):aS(t,l),i&&t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent","cut"))};function uS(t){return t.openStart==0&&t.openEnd==0&&t.content.childCount==1?t.content.firstChild:null}function cS(t,e){if(!t.dom.parentNode)return;let n=t.input.shiftKey||t.state.selection.$from.parent.type.spec.code,r=t.dom.parentNode.appendChild(document.createElement(n?"textarea":"div"));n||(r.contentEditable="true"),r.style.cssText="position: fixed; left: -10000px; top: 10px",r.focus();let i=t.input.shiftKey&&t.input.lastKeyCode!=45;setTimeout(()=>{t.focus(),r.parentNode&&r.parentNode.removeChild(r),n?Jo(t,r.value,null,i,e):Jo(t,r.textContent,r.innerHTML,i,e)},50)}function Jo(t,e,n,r,i){let o=Rg(t,e,n,r,t.state.selection.$from);if(t.someProp("handlePaste",a=>a(t,i,o||E.empty)))return!0;if(!o)return!1;let s=uS(o),l=s?t.state.tr.replaceSelectionWith(s,r):t.state.tr.replaceSelection(o);return t.dispatch(l.scrollIntoView().setMeta("paste",!0).setMeta("uiEvent","paste")),!0}function Jg(t){let e=t.getData("text/plain")||t.getData("Text");if(e)return e;let n=t.getData("text/uri-list");return n?n.replace(/\r?\n/g," "):""}$e.paste=(t,e)=>{let n=e;if(t.composing&&!en)return;let r=Ko?null:n.clipboardData,i=t.input.shiftKey&&t.input.lastKeyCode!=45;r&&Jo(t,Jg(r),r.getData("text/html"),i,n)?n.preventDefault():cS(t,n)};var Al=class{constructor(e,n,r){this.slice=e,this.move=n,this.node=r}},fS=ft?"altKey":"ctrlKey";function Ug(t,e){let n;return t.someProp("dragCopies",r=>{n=n||r(e)}),n!=null?!n:!e[fS]}_e.dragstart=(t,e)=>{let n=e,r=t.input.mouseDown;if(r&&r.done(),!n.dataTransfer)return;let i=t.state.selection,o=i.empty?null:t.posAtCoords(qo(n)),s;if(!(o&&o.pos>=i.from&&o.pos<=(i instanceof H?i.to-1:i.to))){if(r&&typeof r.mightDrag=="object")s=H.create(t.state.doc,r.mightDrag.pos);else if(n.target&&$(n.target)){let f=t.docView.nearestDesc(n.target,!0);f&&f.node.type.spec.draggable&&f!=t.docView&&(s=H.create(t.state.doc,f.posBefore))}}let l=(s||t.state.selection).content(),{dom:a,text:u,slice:c}=lc(t,l);(!n.dataTransfer.files.length||!Be||bg>120)&&n.dataTransfer.clearData(),n.dataTransfer.setData(Ko?"Text":"text/html",a.innerHTML),n.dataTransfer.effectAllowed="copyMove",Ko||n.dataTransfer.setData("text/plain",u),t.dragging=new Al(c,Ug(t,n),s)};_e.dragend=t=>{let e=t.dragging;window.setTimeout(()=>{t.dragging==e&&(t.dragging=null)},50)};$e.dragover=$e.dragenter=(t,e)=>e.preventDefault();$e.drop=(t,e)=>{try{hS(t,e,t.dragging)}finally{t.dragging=null}};function hS(t,e,n){if(!e.dataTransfer)return;let r=t.posAtCoords(qo(e));if(!r)return;let i=t.state.doc.resolve(r.pos),o=n&&n.slice;o?t.someProp("transformPasted",p=>{o=p(o,t,!1)}):o=Rg(t,Jg(e.dataTransfer),Ko?null:e.dataTransfer.getData("text/html"),!1,i);let s=!!(n&&Ug(t,e));if(t.someProp("handleDrop",p=>p(t,e,o||E.empty,s))){e.preventDefault();return}if(!o)return;e.preventDefault();let l=o?tm(t.state.doc,i.pos,o):i.pos;l==null&&(l=i.pos);let a=t.state.tr;if(s){let{node:p}=n;p?p.replace(a):a.deleteSelection()}let u=a.mapping.map(l),c=o.openStart==0&&o.openEnd==0&&o.content.childCount==1,f=a.doc;if(c?a.replaceRangeWith(u,u,o.content.firstChild):a.replaceRange(u,u,o),a.doc.eq(f))return;let h=a.doc.resolve(u);if(c&&H.isSelectable(o.content.firstChild)&&h.nodeAfter&&h.nodeAfter.sameMarkup(o.content.firstChild))a.setSelection(new H(h));else{let p=a.mapping.map(l);a.mapping.maps[a.mapping.maps.length-1].forEach((d,m,y,g)=>p=g),a.setSelection(yi(t,h,a.doc.resolve(p)))}t.focus(),t.dispatch(a.setMeta("uiEvent","drop"))}_e.focus=t=>{if(t.input.lastFocus=Date.now(),!t.focused&&(t.domObserver.stopped(()=>t.dom.classList.add("ProseMirror-focused")),t.focused=!0,t.domSel.read(),!t.domSel.synced)){let e=t.domSel.range;setTimeout(()=>{let n=t.domSel.readRange();n&&e.eq(n)&&t.domSel.sync()},20)}};_e.blur=(t,e)=>{let n=e;t.focused&&(t.domObserver.stopped(()=>t.dom.classList.remove("ProseMirror-focused")),n.relatedTarget&&t.dom.contains(n.relatedTarget)&&t.domSel.deactivate(),t.focused=!1)};_e.beforeinput=(t,e)=>{if(en&&e.inputType=="deleteContentBackward"){t.domObserver.flushSoon();let{domChangeCount:r}=t.input;setTimeout(()=>{if(t.input.domChangeCount!=r||t.domObserver.pendingRecords().length||(t.dom.blur(),t.focus(),vn(t,"Backspace")))return;let{$cursor:i}=t.state.selection;i&&i.pos>0&&t.dispatch(t.state.tr.delete(i.pos-1,i.pos).scrollIntoView())},50)}};for(let t in $e)_e[t]=$e[t];function Uo(t,e){if(t==e)return!0;for(let n in t)if(t[n]!==e[n])return!1;for(let n in e)if(!(n in t))return!1;return!0}var Go=class{constructor(e){this.frag=e,this.index=0,this.off=0}nodeAt(e){for(;this.off<=e&&this.index<this.frag.childCount;){let n=this.frag.child(this.index);if(this.off==e)return n;this.off+=n.nodeSize,this.index++}return null}},vl=class t{constructor(e,n){this.toDOM=e,this.spec=n||ar,this.side=this.spec.side||0}map(e,n,r,i){let{pos:o,deleted:s}=e.mapResult(n.from+i,this.side<0?-1:1);return s?null:new ye(o-r,o-r,this)}valid(){return!0}eq(e){return this==e||e instanceof t&&(this.spec.key&&this.spec.key==e.spec.key||this.toDOM==e.toDOM&&Uo(this.spec,e.spec))}destroy(e){this.spec.destroy&&this.spec.destroy(e)}},lr=class t{constructor(e,n){this.attrs=e,this.spec=n||ar}map(e,n,r,i){let o=e.map(n.from+i,this.spec.inclusiveStart?-1:1)-r,s=e.map(n.to+i,this.spec.inclusiveEnd?1:-1)-r;return o>=s?null:new ye(o,s,this)}valid(e,n){return n.from<n.to}eq(e){return this==e||e instanceof t&&Uo(this.attrs,e.attrs)&&Uo(this.spec,e.spec)}static is(e){return e.type instanceof t}destroy(){}},rc=class t{constructor(e,n){this.attrs=e,this.spec=n||ar}map(e,n,r,i){let o=e.mapResult(n.from+i,1);if(o.deleted)return null;let s=e.mapResult(n.to+i,-1);return s.deleted||s.pos<=o.pos?null:new ye(o.pos-r,s.pos-r,this)}valid(e,n,r){let i=r.nodeAt(n.from);return!!i&&!i.isText&&n.from+i.nodeSize==n.to}eq(e){return this==e||e instanceof t&&Uo(this.attrs,e.attrs)&&Uo(this.spec,e.spec)}destroy(){}},ye=class t{constructor(e,n,r){this.from=e,this.to=n,this.type=r}copy(e,n){return new t(e,n,this.type)}eq(e,n=0){return this.type.eq(e.type)&&this.from+n==e.from&&this.to+n==e.to}map(e,n,r){return this.type.map(e,this,n,r)}static widget(e,n,r){return new t(e,e,new vl(n,r))}static inline(e,n,r,i){return new t(e,n,new lr(r,i))}static node(e,n,r,i){return new t(e,n,new rc(r,i))}get spec(){return this.type.spec}get inline(){return this.type instanceof lr}get widget(){return this.type instanceof vl}},hi=[],ar={},ae=class t{constructor(e,n){this.local=e.length?e:hi,this.children=n.length?n:hi}static create(e,n){return n.length?Ol(n,e,0,ar):Oe}find(e,n,r){let i=[];return this.findInner(e??0,n??1e9,i,0,r),i}findInner(e,n,r,i,o){for(let s=0;s<this.local.length;s++){let l=this.local[s];if(l.from>n)break;l.to>=e&&(!o||o(l.spec))&&r.push(l.copy(l.from+i,l.to+i))}for(let s=0;s<this.children.length&&!(this.children[s]>=n);s+=3)if(this.children[s+1]>e){let l=this.children[s]+1;this.children[s+2].findInner(e-l,n-l,r,i+l,o)}}map(e,n,r){return this==Oe||e.maps.length==0?this:this.mapInner(e,n,0,0,r||ar)}mapInner(e,n,r,i,o){let s;if(this.local.length){let l=new Go(n.content);for(let a=0;a<this.local.length;a++){let u=this.local[a].map(e,r,i);u&&u.type.valid(n,u,l)?(s||(s=[])).push(u):o.onRemove&&o.onRemove(this.local[a].spec)}}return this.children.length?pS(this.children,s||[],e,n,r,i,o):s?new t(s.sort(En),hi):Oe}add(e,n){return n.length?this==Oe?t.create(e,n):this.addInner(e,n,0):this}addInner(e,n,r){let i,o=0;e.forEach((l,a)=>{let u=a+r,c;if(c=Qg(n,l,u)){for(i||(i=this.children.slice());o<i.length&&i[o]<a;)o+=3;i[o]==a?i[o+2]=i[o+2].addInner(l,c,u+1):i.splice(o,0,a,a+l.nodeSize,Ol(c,l,u+1,ar)),o+=3}});let s=Gg(o?Yg(n):n,-r).sort(En);if(s.length){let l=new Go(e.content);for(let a=0;a<s.length;a++)s[a].type.valid(e,s[a],l)||s.splice(a--,1)}return new t(s.length?this.local.concat(s).sort(En):this.local,i||this.children)}remove(e){return e.length==0||this==Oe?this:this.removeInner(e,0)}removeInner(e,n){let r=this.children,i=this.local;for(let o=0;o<r.length;o+=3){let s,l=r[o]+n,a=r[o+1]+n;for(let c=0,f;c<e.length;c++)(f=e[c])&&f.from>l&&f.to<a&&(e[c]=null,(s||(s=[])).push(f));if(!s)continue;r==this.children&&(r=this.children.slice());let u=r[o+2].removeInner(s,l+1);u!=Oe?r[o+2]=u:(r.splice(o,3),o-=3)}if(i.length){for(let o=0,s;o<e.length;o++)if(s=e[o])for(let l=0;l<i.length;l++)i[l].eq(s,n)&&(i==this.local&&(i=this.local.slice()),i.splice(l--,1))}return r==this.children&&i==this.local?this:i.length||r.length?new t(i,r):Oe}forChild(e,n){if(this==Oe)return this;if(n.isLeaf)return t.empty;let r,i,o=0,s=this.children.length/3;for(;o<s;){let u=o+s>>>1,c=u*3,f=this.children[c];if(f<e)o=u+1;else if(f>e)s=u;else{r=this.children[c+2];break}}let l=e+1,a=l+n.content.size;for(let u=0;u<this.local.length;u++){let c=this.local[u];if(c.from<a&&c.to>l&&c.type instanceof lr){let f=Math.max(l,c.from)-l,h=Math.min(a,c.to)-l;f<h&&(i||(i=[])).push(c.copy(f,h))}}if(i){let u=new t(i.sort(En),hi);return r?new El([u,r]):u}return r||Oe}eq(e){if(this==e)return!0;if(!(e instanceof t)||this.local.length!=e.local.length||this.children.length!=e.children.length)return!1;for(let n=0;n<this.local.length;n++)if(!this.local[n].eq(e.local[n]))return!1;for(let n=0;n<this.children.length;n+=3)if(this.children[n]!=e.children[n]||this.children[n+1]!=e.children[n+1]||!this.children[n+2].eq(e.children[n+2]))return!1;return!0}locals(e){return fc(this.localsInner(e))}localsInner(e){if(this==Oe)return hi;if(e.inlineContent||!this.local.some(lr.is))return this.local;let n=[];for(let r=0;r<this.local.length;r++)this.local[r].type instanceof lr||n.push(this.local[r]);return n}forEachSet(e){e(this)}};ae.empty=new ae([],[]);ae.removeOverlap=fc;var Oe=ae.empty,El=class t{constructor(e){this.members=e}map(e,n){let r=this.members.map(i=>i.map(e,n,ar));return t.from(r)}forChild(e,n){if(n.isLeaf)return ae.empty;let r=[];for(let i=0;i<this.members.length;i++){let o=this.members[i].forChild(e,n);o!=Oe&&(o instanceof t?r=r.concat(o.members):r.push(o))}return t.from(r)}eq(e){if(!(e instanceof t)||e.members.length!=this.members.length)return!1;for(let n=0;n<this.members.length;n++)if(!this.members[n].eq(e.members[n]))return!1;return!0}locals(e){let n,r=!0;for(let i=0;i<this.members.length;i++){let o=this.members[i].localsInner(e);if(o.length)if(!n)n=o;else{r&&(n=n.slice(),r=!1);for(let s=0;s<o.length;s++)n.push(o[s])}}return n?fc(r?n:n.sort(En)):hi}static from(e){switch(e.length){case 0:return Oe;case 1:return e[0];default:return new t(e.every(n=>n instanceof ae)?e:e.reduce((n,r)=>n.concat(r instanceof ae?r:r.members),[]))}}forEachSet(e){for(let n=0;n<this.members.length;n++)this.members[n].forEachSet(e)}};function pS(t,e,n,r,i,o,s){let l=t.slice();for(let u=0,c=o;u<n.maps.length;u++){let f=0;n.maps[u].forEach((h,p,d,m)=>{let y=m-d-(p-h);for(let g=0;g<l.length;g+=3){let M=l[g+1];if(M<0||h>M+c-f)continue;let w=l[g]+c-f;p>=w?l[g+1]=h<=w?-2:-1:h>=c&&y&&(l[g]+=y,l[g+1]+=y)}f+=y}),c=n.maps[u].map(c,-1)}let a=!1;for(let u=0;u<l.length;u+=3)if(l[u+1]<0){if(l[u+1]==-2){a=!0,l[u+1]=-1;continue}let c=n.map(t[u]+o),f=c-i;if(f<0||f>=r.content.size){a=!0;continue}let h=n.map(t[u+1]+o,-1),p=h-i,{index:d,offset:m}=r.content.findIndex(f),y=r.maybeChild(d);if(y&&m==f&&m+y.nodeSize==p){let g=l[u+2].mapInner(n,y,c+1,t[u]+o+1,s);g!=Oe?(l[u]=f,l[u+1]=p,l[u+2]=g):(l[u+1]=-2,a=!0)}else a=!0}if(a){let u=dS(l,t,e,n,i,o,s),c=Ol(u,r,0,s);e=c.local;for(let f=0;f<l.length;f+=3)l[f+1]<0&&(l.splice(f,3),f-=3);for(let f=0,h=0;f<c.children.length;f+=3){let p=c.children[f];for(;h<l.length&&l[h]<p;)h+=3;l.splice(h,0,c.children[f],c.children[f+1],c.children[f+2])}}return new ae(e.sort(En),l)}function Gg(t,e){if(!e||!t.length)return t;let n=[];for(let r=0;r<t.length;r++){let i=t[r];n.push(new ye(i.from+e,i.to+e,i.type))}return n}function dS(t,e,n,r,i,o,s){function l(a,u){for(let c=0;c<a.local.length;c++){let f=a.local[c].map(r,i,u);f?n.push(f):s.onRemove&&s.onRemove(a.local[c].spec)}for(let c=0;c<a.children.length;c+=3)l(a.children[c+2],a.children[c]+u+1)}for(let a=0;a<t.length;a+=3)t[a+1]==-1&&l(t[a+2],e[a]+o+1);return n}function Qg(t,e,n){if(e.isLeaf)return null;let r=n+e.nodeSize,i=null;for(let o=0,s;o<t.length;o++)(s=t[o])&&s.from>n&&s.to<r&&((i||(i=[])).push(s),t[o]=null);return i}function Yg(t){let e=[];for(let n=0;n<t.length;n++)t[n]!=null&&e.push(t[n]);return e}function Ol(t,e,n,r){let i=[],o=!1;e.forEach((l,a)=>{let u=Qg(t,l,a+n);if(u){o=!0;let c=Ol(u,l,n+a+1,r);c!=Oe&&i.push(a,a+l.nodeSize,c)}});let s=Gg(o?Yg(t):t,-n).sort(En);if(s.length){let l=new Go(e.content);for(let a=0;a<s.length;a++)s[a].type.valid(e,s[a],l)||(r.onRemove&&r.onRemove(s[a].spec),s.splice(a--,1))}return s.length||i.length?new ae(s,i):Oe}function En(t,e){return t.from-e.from||t.to-e.to}function fc(t){let e=t;for(let n=0;n<e.length-1;n++){let r=e[n];if(r.from!=r.to)for(let i=n+1;i<e.length;i++){let o=e[i];if(o.from==r.from){o.to!=r.to&&(e==t&&(e=t.slice()),e[i]=o.copy(o.from,r.to),cg(e,i+1,o.copy(r.to,o.to)));continue}else{o.from<r.to&&(e==t&&(e=t.slice()),e[n]=r.copy(r.from,o.from),cg(e,i,r.copy(o.from,r.to)));break}}}return e}function cg(t,e,n){for(;e<t.length&&En(n,t[e])>0;)e++;t.splice(e,0,n)}function Vu(t){let e=[];return t.someProp("decorations",n=>{let r=n(t.state);r&&r!=Oe&&e.push(r)}),t.cursorWrapper&&e.push(ae.create(t.state.doc,[t.cursorWrapper.deco])),El.from(e)}function mS(t,e,n,r){let{node:i,fromOffset:o,toOffset:s,from:l,to:a}=t.docView.parseRange(e,n),u=t.domSel.range,c,f=u.anchorNode;if(f&&di(t.dom,f)&&(c=[{node:f,offset:u.anchorOffset}],Rl(u)||c.push({node:u.focusNode,offset:u.focusOffset})),Be&&t.input.lastKeyCode===8)for(let g=s;g>o;g--){let M=i.childNodes[g-1],w=M.pmViewDesc;if(M.nodeName=="BR"&&!w){s=g;break}if(!w||w.size)break}let h=t.state.doc,p=t.someProp("domParser")||kt.fromSchema(t.state.schema),d=h.resolve(l),m=null,y=p.parse(i,{topNode:d.parent,topMatch:d.parent.contentMatchAt(d.index()),topOpen:!0,from:o,to:s,preserveWhitespace:d.parent.type.whitespace=="pre"?"full":!0,findPositions:c,ruleFromNode:gS(r),context:d});if(c&&c[0].pos!=null){let g=c[0].pos,M=c[1]&&c[1].pos;M==null&&(M=g),m={anchor:g+l,head:M+l}}return{doc:y,sel:m,from:l,to:a}}var gS=t=>e=>{let n=e.pmViewDesc;if(n)return n.parseRule(t);if(e.nodeName=="BR"&&e.parentNode){if(Fe&&/^(ul|ol)$/i.test(e.parentNode.nodeName)){let r=document.createElement("div");return r.appendChild(document.createElement("li")),{skip:r}}else if(e.parentNode.lastChild==e||Fe&&/^(tr|table)$/i.test(e.parentNode.nodeName))return{ignore:!0}}else if(e.nodeName=="IMG"&&e.getAttribute("mark-placeholder"))return{ignore:!0};return null},yS=/^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;function kS(t,e,n,r,i,o){let s=t.input.compositionPendingChanges||(t.composing?t.input.compositionID:0);if(t.input.compositionPendingChanges=0,e<0){let P=t.input.lastSelectionTime>Date.now()-50?t.input.lastSelectionOrigin:null,K=ac(t,t.domSel.range,P);if(K&&!t.state.selection.eq(K)&&t.domSel.active){if(Be&&en&&t.input.lastKeyCode===13&&Date.now()-100<t.input.lastKeyCodeTime&&vn(t,"Enter"))return;let S=t.state.tr.setSelection(K);P=="pointer"?S.setMeta("pointer",!0):P=="key"&&S.scrollIntoView(),s&&S.setMeta("composition",s),t.dispatch(S)}return}let l=t.state.doc.resolve(e),a=l.sharedDepth(n);e=l.before(a+1),n=t.state.doc.resolve(n).after(a+1);let u=t.state.selection,c=mS(t,e,n,o),f=t.state.doc,h=f.slice(c.from,c.to),p,d;t.input.lastKeyCode===8&&Date.now()-100<t.input.lastKeyCodeTime?(p=t.state.selection.to,d="end"):(p=t.state.selection.from,d="start"),t.input.lastKeyCode=null;let m=CS(h.content,c.doc.content,c.from,p,d);if(m&&t.input.domChangeCount++,(gi&&t.input.lastIOSEnter>Date.now()-225||en)&&o.some(P=>$(P)&&!yS.test(P.nodeName))&&(!m||m.endA>=m.endB)&&vn(t,"Enter")){t.input.lastIOSEnter=0;return}if(!m)if(i&&u instanceof j&&!u.empty&&u.$head.sameParent(u.$anchor)&&!t.composing&&!(c.sel&&c.sel.anchor!=c.sel.head))m={start:u.from,endA:u.to,endB:u.to};else{if(c.sel){let P=fg(t,t.state.doc,c.sel);if(P&&!P.eq(t.state.selection)){let K=t.state.tr.setSelection(P);s&&K.setMeta("composition",s),t.dispatch(K)}}return}t.state.selection.from<t.state.selection.to&&m.start==m.endB&&t.state.selection instanceof j&&(m.start>t.state.selection.from&&m.start<=t.state.selection.from+2&&t.state.selection.from>=c.from?m.start=t.state.selection.from:m.endA<t.state.selection.to&&m.endA>=t.state.selection.to-2&&t.state.selection.to<=c.to&&(m.endB+=t.state.selection.to-m.endA,m.endA=t.state.selection.to));let y=c.doc.resolveNoCache(m.start-c.from),g=c.doc.resolveNoCache(m.endB-c.from),M=f.resolve(m.start),w=y.sameParent(g)&&y.parent.inlineContent&&M.end()>=m.endA;if((gi&&t.input.lastIOSEnter>Date.now()-225&&(!w||o.some(P=>P.nodeName=="DIV"||P.nodeName=="P"))||!w&&wS(c.doc,y.pos,g.pos))&&vn(t,"Enter")){t.input.lastIOSEnter=0;return}if(t.state.selection.anchor>m.start&&(w?m.endA>m.start&&m.endB==m.start:bS(f,m.start,m.endA,y,g))&&vn(t,"Backspace")){en&&Be&&t.domSel.suppressChanges();return}Be&&m.endB==m.start&&(t.input.lastChromeDelete=Date.now()),en&&!w&&y.start()!=g.start()&&g.parentOffset==0&&y.depth==g.depth&&c.sel&&c.sel.anchor==c.sel.head&&c.sel.head==m.endA&&(m.endB-=2,g=c.doc.resolveNoCache(m.endB-c.from),setTimeout(()=>vn(t,"Enter"),20));let T=m.start,R=m.endA,C=P=>{let K=P||t.state.tr.replace(T,R,c.doc.slice(m.start-c.from,m.endB-c.from));if(c.sel){let S=fg(t,K.doc,c.sel);S&&!(Be&&t.composing&&S.empty&&(m.start!=m.endB||t.input.lastChromeDelete<Date.now()-100)&&(S.head==T||S.head==K.mapping.map(R)-1))&&K.setSelection(S)}return s&&K.setMeta("composition",s),K.scrollIntoView()},L;if(w)if(y.pos==g.pos){let P=C(t.state.tr.delete(T,R)),K=f.resolve(m.start).marksAcross(f.resolve(m.endA));K&&P.ensureMarks(K),t.dispatch(P)}else if(m.endA==m.endB&&(L=xS(y.parent.content.cut(y.parentOffset,g.parentOffset),M.parent.content.cut(M.parentOffset,m.endA-M.start())))){let P=C(t.state.tr);L.type=="add"?P.addMark(T,R,L.mark):P.removeMark(T,R,L.mark),t.dispatch(P)}else if(y.parent.child(y.index()).isText&&y.index()==g.index()-(g.textOffset?0:1)){let P=y.parent.textBetween(y.parentOffset,g.parentOffset),K=()=>C(t.state.tr.insertText(P,T,R));t.someProp("handleTextInput",S=>S(t,T,R,P,K))||t.dispatch(K())}else t.dispatch(C());else t.dispatch(C())}function fg(t,e,n){return Math.max(n.anchor,n.head)>e.content.size?null:yi(t,e.resolve(n.anchor),e.resolve(n.head))}function xS(t,e){let n=t.firstChild.marks,r=e.firstChild.marks,i=n,o=r,s,l,a;for(let c=0;c<r.length;c++)i=r[c].removeFromSet(i);for(let c=0;c<n.length;c++)o=n[c].removeFromSet(o);if(i.length==1&&o.length==0)l=i[0],s="add",a=c=>c.mark(l.addToSet(c.marks));else if(i.length==0&&o.length==1)l=o[0],s="remove",a=c=>c.mark(l.removeFromSet(c.marks));else return null;let u=[];for(let c=0;c<e.childCount;c++)u.push(a(e.child(c)));if(A.from(u).eq(t))return{mark:l,type:s}}function bS(t,e,n,r,i){if(n-e<=i.pos-r.pos||ju(r,!0,!1)<i.pos)return!1;let o=t.resolve(e);if(!r.parent.inlineContent){let l=o.nodeAfter;return l!=null&&n==e+l.nodeSize}if(o.parentOffset<o.parent.content.size||!o.parent.isTextblock)return!1;let s=t.resolve(ju(o,!0,!0));return!s.parent.isTextblock||s.pos>n||ju(s,!0,!1)<n?!1:r.parent.content.cut(r.parentOffset).eq(s.parent.content)}function wS(t,e,n){let r=0,i=0;return t.nodesBetween(e,n,(o,s)=>{o.isTextblock&&s>=e&&s<n?r++:(o.isText?/\S/.test(o.text.slice(Math.max(0,e-s),Math.min(o.nodeSize,n-s))):o.isLeaf)&&i++}),i==0&&r==1}function ju(t,e,n){let r=t.depth,i=e?t.end():t.pos;for(;r>0&&(e||t.indexAfter(r)==t.node(r).childCount);)r--,i++,e=!1;if(n){let o=t.node(r).maybeChild(t.indexAfter(r));for(;o&&!o.isLeaf;)o=o.firstChild,i++}return i}function CS(t,e,n,r,i){let o=t.findDiffStart(e,n),s=n+t.size,l=n+e.size;if(o==null)return null;let{a,b:u}=t.findDiffEnd(e,s,l);if(i=="end"){let c=Math.max(0,o-Math.min(a,u));r-=a+c-o}if(a<o&&s<l){let c=r<=o&&r>=a?o-r:0;o-=c,u=o+(u-a),a=o}else if(u<o){let c=r<=o&&r>=u?o-r:0;o-=c,a=o+(a-u),u=o}return{start:o,endA:a,endB:u}}var SS={childList:!0,characterData:!0,characterDataOldValue:!0,attributes:!0,attributeOldValue:!0,subtree:!0},ic=class{constructor(e){this.view=e,this.queue=[],this.flushingSoon=-1,this.suppressingSelectionUpdates=!1,this.lastChangedTextNode=null,this.started=!1,this.observer=new window.MutationObserver(n=>{for(let r=0;r<n.length;r++)this.queue.push(n[r]);Fe&&e.composing&&n.some(r=>r.type=="childList"&&r.target.nodeName=="TR")?(e.input.badSafariComposition=!0,this.flushSoon()):this.flush()})}flushSoon(){this.flushingSoon<0&&(this.flushingSoon=window.setTimeout(()=>{this.flushingSoon=-1,this.flush()},20))}forceFlush(e=!1){this.flushingSoon>-1?(window.clearTimeout(this.flushingSoon),this.flushingSoon=-1,this.flush(!0)):e&&this.flush(!0)}start(){this.observer.takeRecords(),this.observer.observe(this.view.dom,SS),this.started=!0}stop(){let e=this.observer.takeRecords();if(e.length){for(let n=0;n<e.length;n++)this.queue.push(e[n]);window.setTimeout(()=>this.flush(),20)}this.observer.disconnect(),this.started=!1}stopped(e){if(!this.started)return e();this.stop();try{return e()}finally{this.start()}}ignoreSelectionChange(e){if(!e.focusNode)return!0;let n=new Set,r;for(let o=e.focusNode;o;o=pi(o))n.add(o);for(let o=e.anchorNode;o;o=pi(o))if(n.has(o)){r=o;break}let i=r&&this.view.docView.nearestDesc(r);if(i&&i.ignoreMutation({type:"selection",target:ge(r)?r.parentNode:r}))return this.view.domSel.ignore(e),!0}pendingRecords(){for(let e of this.observer.takeRecords())this.queue.push(e);return this.queue}flush(e=!0){let{view:n}=this;if(!n.docView||this.flushingSoon>-1)return;let r=this.pendingRecords();r.length&&(this.queue=[]),e&&n.domSel.read();let i=!n.domSel.suppress&&!n.domSel.synced&&!!$g(n)&&!this.ignoreSelectionChange(n.domSel.range),o=-1,s=-1,l=!1,a=[];if(n.editable)for(let c=0;c<r.length;c++){let f=this.registerMutation(r[c],a);f&&(o=o<0?f.from:Math.min(f.from,o),s=s<0?f.to:Math.max(f.to,s),f.typeOver&&(l=!0))}if(a.some(c=>c.nodeName=="BR")&&(n.input.lastKeyCode==8||n.input.lastKeyCode==46||Be&&(n.composing||n.input.compositionEndedAt>Date.now()-50)&&r.some(c=>c.type=="childList"&&c.removedNodes.length))){for(let c of a)if(c.nodeName=="BR"&&c.parentNode){let f=c.nextSibling;for(;f&&$(f);){if(f.contentEditable=="false"){c.parentNode.removeChild(c);break}f=f.firstChild}}}else if(wt&&a.length){let c=a.filter(f=>f.nodeName=="BR");if(c.length==2){let[f,h]=c;f.parentNode&&f.parentNode.parentNode==h.parentNode?h.remove():f.remove()}else{let{focusNode:f}=n.domSel.range;for(let h of c){let p=h.parentNode;p&&p.nodeName=="LI"&&(!f||NS(n,f)!=p)&&h.remove()}}}let u=null;o<0&&i&&n.domSel.active&&n.input.lastFocus>Date.now()-200&&Math.max(n.input.lastTouch,n.input.lastClick.time)<Date.now()-300&&Rl(n.domSel.range)&&(u=ac(n,n.domSel.range))&&u.eq(_.near(n.state.doc.resolve(0),1))?(n.input.lastFocus=0,n.domSel.sync(),n.scrollToSelection()):(o>-1||i)&&(o>-1&&MS(n),n.input.badSafariComposition&&(n.input.badSafariComposition=!1,IS(n,a)),kS(this.view,o,s,i,l,a),n.docView&&n.docView.damage?n.updateState(n.state):i&&n.domSel.sync())}registerMutation(e,n){var r;if(n.indexOf(e.target)>-1)return null;let i;for(let o=e.target;o&&!(i=this.view.docView.getDesc(o));o=o.parentNode);if(e.type=="attributes"&&(i==this.view.docView||e.attributeName=="contenteditable"||e.attributeName=="style"&&!e.oldValue&&!e.target.getAttribute("style"))||!i||i.ignoreMutation(e))return null;if(e.type=="childList"){for(let f=0;f<e.addedNodes.length;f++){let h=e.addedNodes[f];n.push(h),ge(h)&&(this.lastChangedTextNode=h)}if(i.contentDOM&&i.contentDOM!=i.dom&&!i.contentDOM.contains(e.target))return i.markDamage(4),{from:i.posBefore,to:i.posAfter};let o=e.previousSibling,s=e.nextSibling,l=o&&o.parentNode==e.target?Ne(o)+1:0,a=i.localPosFromDOM(e.target,l,-1),u=s&&s.parentNode==e.target?Ne(s):e.target.childNodes.length,c=i.localPosFromDOM(e.target,u,1);return i.markDamage(!((r=i.contentDOM)===null||r===void 0)&&r.contains(e.target)?2:4),{from:a,to:c}}else return e.type=="attributes"?(i.markDamage(4),{from:i.posAtStart-i.border,to:i.posAtEnd+i.border}):(this.lastChangedTextNode=e.target,i.markDamage(i instanceof Ho&&e.target==i.nodeDOM?8:4),{from:i.posAtStart,to:i.posAtEnd,typeOver:e.target.nodeValue==e.oldValue})}},hg=new WeakMap,pg=!1;function MS(t){if(!hg.has(t)&&(hg.set(t,null),["normal","nowrap","pre-line"].indexOf(getComputedStyle(t.dom).whiteSpace)!==-1)){if(t.requiresGeckoHackNode=wt,pg)return;console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."),pg=!0}}function NS(t,e){for(let n=e.parentNode;n&&n!=t.dom;n=n.parentNode){let r=t.docView.nearestDesc(n,!0);if(r&&r.node.isBlock)return n}return null}function IS(t,e){var n;let{focusNode:r,focusOffset:i}=t.domSel.range;for(let o of e)if(((n=o.parentNode)===null||n===void 0?void 0:n.nodeName)=="TR"){let s=o.nextSibling;for(;s&&s.nodeName!="TD"&&s.nodeName!="TH";)s=s.nextSibling;if(s){let l=s;for(;;){let a=l.firstChild;if(!a||!$(a)||a.contentEditable=="false"||/^(BR|IMG)$/.test(a.nodeName))break;l=a}l.insertBefore(o,l.firstChild),r==o&&t.domSelection().collapse(o,i)}else o.parentNode.removeChild(o)}}var Qo=class{constructor(e,n){this._root=null,this.focused=!1,this.trackWrites=null,this.mounted=!1,this.markCursor=null,this.cursorWrapper=null,this.lastSelectedViewDesc=void 0,this.input=new Zu,this.prevDirectPlugins=[],this.pluginViews=[],this.requiresGeckoHackNode=!1,this.dragging=null,this._props=n,this.state=n.state,this.directPlugins=n.plugins||[],this.directPlugins.forEach(kg),this.dispatch=this.dispatch.bind(this),this.dom=e&&e.mount||document.createElement("div"),e&&(e.appendChild?e.appendChild(this.dom):typeof e=="function"?e(this.dom):e.mount&&(this.mounted=!0)),this.editable=gg(this),mg(this),this.nodeViews=yg(this),this.docView=Jm(this.state.doc,dg(this),Vu(this),this.dom,this),this.domObserver=new ic(this),this.domSel=new Xu(this),this.domObserver.start(),this.domSel.read(),JC(this),this.updatePluginViews()}get composing(){return this.input.composing}get props(){if(this._props.state!=this.state){let e=this._props;this._props={};for(let n in e)this._props[n]=e[n];this._props.state=this.state}return this._props}update(e){e.handleDOMEvents!=this._props.handleDOMEvents&&ec(this);let n=this._props;this._props=e,e.plugins&&(e.plugins.forEach(kg),this.directPlugins=e.plugins),this.updateStateInner(e.state,n)}setProps(e){let n={};for(let r in this._props)n[r]=this._props[r];n.state=this.state;for(let r in e)n[r]=e[r];this.update(n)}updateState(e){this.updateStateInner(e,this._props)}updateStateInner(e,n){var r;let i=this.state,o=!1,s=!1;e.storedMarks&&this.composing&&(Kg(this),s=!0),this.state=e;let l=i.plugins!=e.plugins||this._props.plugins!=n.plugins;if(l||this._props.plugins!=n.plugins||this._props.nodeViews!=n.nodeViews){let p=yg(this);AS(p,this.nodeViews)&&(this.nodeViews=p,o=!0)}(l||n.handleDOMEvents!=this._props.handleDOMEvents)&&ec(this),this.editable=gg(this),mg(this);let a=Vu(this),u=dg(this),c=i.plugins!=e.plugins&&!i.doc.eq(e.doc)?"reset":e.scrollToSelection>i.scrollToSelection?"to selection":"preserve",f=o||!this.docView.matchesNode(e.doc,u,a);(f||!e.selection.eq(i.selection))&&(s=!0);let h=c=="preserve"&&s&&this.dom.style.overflowAnchor==null&&uC(this);s&&this.domObserver.stopped(()=>{let p=f&&Be&&!this.composing&&!i.selection.empty&&!e.selection.empty&&TS(i.selection,e.selection);if(f){let d=Be?this.trackWrites=this.domSel.range.focusNode:null;if(this.composing&&(this.input.compositionNode=lS(this)),o||!this.docView.update(e.doc,u,a,this,-1)){let m=this.docView.outerDeco;this.docView.destroy(),this.docView=Jm(e.doc,u,a,this.dom,this,m)}d&&(!this.trackWrites||!this.dom.contains(this.trackWrites))&&(p=!0)}this.domSel.sync(p)}),this.updatePluginViews(i),!((r=this.dragging)===null||r===void 0)&&r.node&&!i.doc.eq(e.doc)&&this.updateDraggedNode(this.dragging,i),c=="reset"?this.dom.scrollTop=0:c=="to selection"?this.scrollToSelection():h&&cC(h)}scrollToSelection(){let e=this.domSel.range.focusNode;if(!(!e||!this.domSel.active)){if(!this.someProp("handleScrollToSelection",n=>n(this)))if(this.state.selection instanceof H){let n=this.docView.domAfterPos(this.state.selection.from);$(n)&&Hm(this,n.getBoundingClientRect(),e)}else Hm(this,this.coordsAtPos(this.state.selection.head,1),e)}}destroyPluginViews(){let e;for(;e=this.pluginViews.pop();)e.destroy&&e.destroy()}updatePluginViews(e){if(!e||e.plugins!=this.state.plugins||this.directPlugins!=this.prevDirectPlugins){this.prevDirectPlugins=this.directPlugins,this.destroyPluginViews();for(let n=0;n<this.directPlugins.length;n++){let r=this.directPlugins[n];r.spec.view&&this.pluginViews.push(r.spec.view(this))}for(let n=0;n<this.state.plugins.length;n++){let r=this.state.plugins[n];r.spec.view&&this.pluginViews.push(r.spec.view(this))}}else for(let n=0;n<this.pluginViews.length;n++){let r=this.pluginViews[n];r.update&&r.update(this,e)}}updateDraggedNode(e,n){let r=e.node,i=-1;if(r.from<this.state.doc.content.size&&this.state.doc.nodeAt(r.from)==r.node)i=r.from;else{let o=r.from+(this.state.doc.content.size-n.doc.content.size);(o>0&&o<this.state.doc.content.size&&this.state.doc.nodeAt(o))==r.node&&(i=o)}this.dragging=new Al(e.slice,e.move,i<0?void 0:H.create(this.state.doc,i))}someProp(e,n){let r=this._props&&this._props[e],i;if(r!=null&&(i=n?n(r):r))return i;for(let s=0;s<this.directPlugins.length;s++){let l=this.directPlugins[s].props[e];if(l!=null&&(i=n?n(l):l))return i}let o=this.state.plugins;if(o)for(let s=0;s<o.length;s++){let l=o[s].props[e];if(l!=null&&(i=n?n(l):l))return i}}hasFocus(){return this.root.activeElement==this.dom}focus(){this.editable&&Mg(this.dom),this.domSel.sync()}get root(){let e=this.dom.isConnected!==!1;e||(this._root=null);let n=this._root;if(n==null&&e){for(let r=this.dom.parentNode;r;r=r.parentNode)if(r.nodeType==9||r.nodeType==11&&r.host)return r.getSelection||(Object.getPrototypeOf(r).getSelection=()=>r.ownerDocument.getSelection()),this._root=r}return n||document}updateRoot(){this._root=null}posAtCoords(e){return mC(this,e)}coordsAtPos(e,n=1){return Tg(this,e,n)}domAtPos(e,n=0){return this.docView.domFromPos(e,n)}nodeDOM(e){let n=this.docView.descAt(e);return n?n.nodeDOM:null}posAtDOM(e,n,r=-1){let i=this.docView.posFromDOM(e,n,r);if(i==null)throw new RangeError("DOM position not inside the editor");return i}endOfTextblock(e,n){return bC(this,n||this.state,e)}pasteHTML(e,n){return Jo(this,"",e,!1,n||new ClipboardEvent("paste"))}pasteText(e,n){return Jo(this,e,null,!0,n||new ClipboardEvent("paste"))}serializeForClipboard(e){return lc(this,e)}destroy(){this.docView&&(UC(this),this.domSel.destroy(),this.destroyPluginViews(),this.mounted?(this.docView.update(this.state.doc,[],Vu(this),this,-1),this.dom.textContent=""):this.dom.parentNode&&this.dom.parentNode.removeChild(this.dom),this.docView.destroy(),this.docView=null,X1())}get isDestroyed(){return this.docView==null}dispatchEvent(e){return QC(this,e)}domSelection(){return this.root.getSelection()}};Qo.prototype.dispatch=function(t){let e=this._props.dispatchTransaction;e?e.call(this,t):this.updateState(this.state.apply(t))};function dg(t){let e=Object.create(null);return e.class="ProseMirror",e.contenteditable=String(t.editable),t.someProp("attributes",n=>{if(typeof n=="function"&&(n=n(t.state)),n)for(let r in n)r=="class"?e.class+=" "+n[r]:r=="style"?e.style=(e.style?e.style+";":"")+n[r]:!e[r]&&r!="contenteditable"&&r!="nodeName"&&(e[r]=String(n[r]))}),e.translate||(e.translate="no"),[ye.node(0,t.state.doc.content.size,e)]}function mg(t){if(t.markCursor){let e=document.createElement("img");e.className="ProseMirror-separator",e.setAttribute("mark-placeholder","true"),e.setAttribute("alt",""),t.cursorWrapper={dom:e,deco:ye.widget(t.state.selection.from,e,{raw:!0,marks:t.markCursor})}}else t.cursorWrapper=null}function gg(t){return!t.someProp("editable",e=>e(t.state)===!1)}function TS(t,e){let n=Math.min(t.$anchor.sharedDepth(t.head),e.$anchor.sharedDepth(e.head));return t.$anchor.start(n)!=e.$anchor.start(n)}function yg(t){let e=Object.create(null);function n(r){for(let i in r)Object.prototype.hasOwnProperty.call(e,i)||(e[i]=r[i])}return t.someProp("nodeViews",n),t.someProp("markViews",n),e}function AS(t,e){let n=0,r=0;for(let i in t){if(t[i]!=e[i])return!0;n++}for(let i in e)r++;return n!=r}function kg(t){if(t.spec.state||t.spec.filterTransaction||t.spec.appendTransaction)throw new RangeError("Plugins passed directly to the view must not have a state component")}function on(t,e){return t.meta={package:"@milkdown/core",group:"System",...e},t}var ny={text:(t,e,n,r)=>{let i=t.value;return/^[^*_\\]*\s+$/.test(i)?i:n.safe(i,{...r,encode:[]})},strong:(t,e,n,r)=>{let i=t.marker||n.options.strong||"*",o=n.enter("strong"),s=n.createTracker(r),l=s.move(i+i);return l+=s.move(n.containerPhrasing(t,{before:l,after:i,...s.current()})),l+=s.move(i+i),o(),l},emphasis:(t,e,n,r)=>{let i=t.marker||n.options.emphasis||"*",o=n.enter("emphasis"),s=n.createTracker(r),l=s.move(i);return l+=s.move(n.containerPhrasing(t,{before:l,after:i,...s.current()})),l+=s.move(i),o(),l}},Je=Q({},"editorView"),Xo=Q({},"editorState"),hc=Q([],"initTimer"),Xg=Q({},"editor"),Ti=Q([],"inputRules"),Mt=Q([],"prosePlugins"),Ai=Q([],"remarkPlugins"),Wl=Q([],"nodeView"),ql=Q([],"markView"),gr=Q(mo().use(Fr).use(Wr),"remark"),Dn=Q({handlers:ny,encode:[]},"remarkStringifyOptions"),Ll=ut("ConfigReady");function vS(t){let e=n=>(n.record(Ll),async()=>(await t(n),n.done(Ll),()=>{n.clearTimer(Ll)}));return on(e,{displayName:"Config"}),e}var rn=ut("InitReady");function ES(t){let e=n=>(n.inject(Xg,t).inject(Mt,[]).inject(Ai,[]).inject(Ti,[]).inject(Wl,[]).inject(ql,[]).inject(Dn,{handlers:ny,encode:[]}).inject(gr,mo().use(Fr).use(Wr)).inject(hc,[Ll]).record(rn),async()=>{await n.waitTimers(hc);let r=n.get(Dn);return n.set(gr,mo().use(Fr).use(Wr,r)),n.done(rn),()=>{n.remove(Xg).remove(Mt).remove(Ai).remove(Ti).remove(Wl).remove(ql).remove(Dn).remove(gr).remove(hc).clearTimer(rn)}});return on(e,{displayName:"Init"}),e}var Ve=ut("SchemaReady"),zl=Q([],"schemaTimer"),Ue=Q({},"schema"),ki=Q([],"nodes"),xi=Q([],"marks");function Zg(t){return{...t,parseDOM:t.parseDOM?.map(e=>({priority:t.priority,...e}))}}var ry=t=>(t.inject(Ue,{}).inject(ki,[]).inject(xi,[]).inject(zl,[rn]).record(Ve),async()=>{await t.waitTimers(zl);let e=t.get(gr),n=t.get(Ai).reduce((s,l)=>s.use(l.plugin,l.options),e);t.set(gr,n);let r=Object.fromEntries(t.get(ki).map(([s,l])=>[s,Zg(l)])),i=Object.fromEntries(t.get(xi).map(([s,l])=>[s,Zg(l)])),o=new ul({nodes:r,marks:i});return t.set(Ue,o),t.done(Ve),()=>{t.remove(Ue).remove(ki).remove(xi).remove(zl).clearTimer(Ve)}});on(ry,{displayName:"Schema"});var fr,ht,ey,iy=(ey=class{constructor(){z(this,fr);z(this,ht);v(this,fr,new ba),v(this,ht,null),this.setCtx=t=>{v(this,ht,t)},this.chain=()=>{if(b(this,ht)==null)throw Es();let t=b(this,ht),e=[],n=this.get.bind(this),r={run:()=>{let o=Zn(...e),s=t.get(Je);return o(s.state,s.dispatch,s)},inline:o=>(e.push(o),r),pipe:i.bind(this)};function i(o,s){let l=n(o);return e.push(l(s)),r}return r}}get ctx(){return b(this,ht)}create(t,e){let n=t.create(b(this,fr).sliceMap);return n.set(e),n}get(t){return b(this,fr).get(t).get()}remove(t){return b(this,fr).remove(t)}call(t,e){if(b(this,ht)==null)throw Es();let n=this.get(t)(e),r=b(this,ht).get(Je);return n(r.state,r.dispatch,r)}inline(t){if(b(this,ht)==null)throw Es();let e=b(this,ht).get(Je);return t(e.state,e.dispatch,e)}},fr=new WeakMap,ht=new WeakMap,ey);function oy(t="cmdKey"){return Q((()=>()=>!1),t)}var ee=Q(new iy,"commands"),Bl=Q([Ve],"commandsTimer"),bi=ut("CommandsReady"),sy=t=>{let e=new iy;return e.setCtx(t),t.inject(ee,e).inject(Bl,[Ve]).record(bi),async()=>(await t.waitTimers(Bl),t.done(bi),()=>{t.remove(ee).remove(Bl).clearTimer(bi)})};on(sy,{displayName:"Commands"});function OS(t){return t.Backspace=Zn(Cm,yl,gm,Tu),t}var hr,qe,ty,ly=(ty=class{constructor(){z(this,hr);z(this,qe);v(this,hr,null),v(this,qe,[]),this.setCtx=t=>{v(this,hr,t)},this.add=t=>(b(this,qe).push(t),()=>{v(this,qe,b(this,qe).filter(e=>e!==t))}),this.addObjectKeymap=t=>{let e=[];return Object.entries(t).forEach(([n,r])=>{if(typeof r=="function"){let i={key:n,onRun:()=>r};b(this,qe).push(i),e.push(()=>{v(this,qe,b(this,qe).filter(o=>o!==i))})}else b(this,qe).push(r),e.push(()=>{v(this,qe,b(this,qe).filter(i=>i!==r))})}),()=>{e.forEach(n=>n())}},this.addBaseKeymap=()=>{let t=OS(wm);return this.addObjectKeymap(t)},this.build=()=>{let t={};return b(this,qe).forEach(e=>{t[e.key]=[...t[e.key]||[],e]}),Object.fromEntries(Object.entries(t).map(([e,n])=>{let r=n.sort((o,s)=>(s.priority??50)-(o.priority??50));return[e,(o,s,l)=>{let a=b(this,hr);if(a==null)throw Tr();let u=r.map(c=>c.onRun(a));return Zn(...u)(o,s,l)}]}))}}get ctx(){return b(this,hr)}},hr=new WeakMap,qe=new WeakMap,ty),rs=Q(new ly,"keymap"),pc=Q([Ve],"keymapTimer"),wi=ut("KeymapReady"),RS=t=>{let e=new ly;return e.setCtx(t),t.inject(rs,e).inject(pc,[Ve]).record(wi),async()=>(await t.waitTimers(pc),t.done(wi),()=>{t.remove(rs).remove(pc).clearTimer(wi)})},Fl=ut("ParserReady"),ay=(()=>{throw Tr()}),Ct=Q(ay,"parser"),dc=Q([],"parserTimer"),uy=t=>(t.inject(Ct,ay).inject(dc,[Ve]).record(Fl),async()=>{await t.waitTimers(dc);let e=t.get(gr),n=t.get(Ue);return t.set(Ct,_m.create(n,e)),t.done(Fl),()=>{t.remove(Ct).remove(dc).clearTimer(Fl)}});on(uy,{displayName:"Parser"});var Ci=ut("SerializerReady"),mc=Q([],"serializerTimer"),cy=(()=>{throw Tr()}),St=Q(cy,"serializer"),fy=t=>(t.inject(St,cy).inject(mc,[Ve]).record(Ci),async()=>{await t.waitTimers(mc);let e=t.get(gr),n=t.get(Ue);return t.set(St,$m.create(n,e)),t.done(Ci),()=>{t.remove(St).remove(mc).clearTimer(Ci)}});on(fy,{displayName:"Serializer"});var Zo=Q("","defaultValue"),es=Q(t=>t,"stateOptions"),_l=Q([],"editorStateTimer"),$l=ut("EditorStateReady");function DS(t,e,n){if(typeof t=="string")return e(t);if(t.type==="html")return kt.fromSchema(n).parse(t.dom);if(t.type==="json")return We.fromJSON(n,t.value);throw Ah(t)}var PS=new ne("MILKDOWN_STATE_TRACKER"),hy=t=>(t.inject(Zo,"").inject(Xo,{}).inject(es,e=>e).inject(_l,[Fl,Ci,bi,wi]).record($l),async()=>{await t.waitTimers(_l);let e=t.get(Ue),n=t.get(Ct),r=t.get(Ti),i=t.get(es),o=t.get(Mt),s=DS(t.get(Zo),n,e),l=t.get(rs),a=l.addBaseKeymap(),u=[...o,new te({key:PS,state:{init:()=>{},apply:(h,p,d,m)=>{t.set(Xo,m)}}}),Im({rules:r}),Pm(l.build())];t.set(Mt,u);let c=i({schema:e,doc:s,plugins:u}),f=Zr.create(c);return t.set(Xo,f),t.done($l),()=>{a(),t.remove(Zo).remove(Xo).remove(es).remove(_l).clearTimer($l)}});on(hy,{displayName:"EditorState"});var vi=Q([],"pasteRule"),Vl=Q([Ve],"pasteRuleTimer"),jl=ut("PasteRuleReady"),py=t=>(t.inject(vi,[]).inject(Vl,[Ve]).record(jl),async()=>(await t.waitTimers(Vl),t.done(jl),()=>{t.remove(vi).remove(Vl).clearTimer(jl)}));on(py,{displayName:"PasteRule"});var ts=ut("EditorViewReady"),Hl=Q([],"editorViewTimer"),yr=Q({},"editorViewOptions"),ns=Q(null,"root"),gc=Q(null,"rootDOM"),yc=Q({},"rootAttrs");function LS(t,e){let n=document.createElement("div");n.className="milkdown",t.appendChild(n),e.set(gc,n);let r=e.get(yc);return Object.entries(r).forEach(([i,o])=>n.setAttribute(i,o)),n}function zS(t){t.classList.add("editor"),t.setAttribute("role","textbox")}var BS=new ne("MILKDOWN_VIEW_CLEAR"),dy=t=>(t.inject(ns,document.body).inject(Je,{}).inject(yr,{}).inject(gc,null).inject(yc,{}).inject(Hl,[$l,jl]).record(ts),async()=>{await t.wait(rn);let e=t.get(ns)||document.body,n=typeof e=="string"?document.querySelector(e):e;t.update(Mt,a=>[new te({key:BS,view:u=>{let c=n?LS(n,t):void 0;return(()=>{if(c&&n){let h=u.dom;n.replaceChild(c,h),c.appendChild(h)}})(),{destroy:()=>{c?.parentNode&&c?.parentNode.replaceChild(u.dom,c),c?.remove()}}}}),...a]),await t.waitTimers(Hl);let r=t.get(Xo),i=t.get(yr),o=Object.fromEntries(t.get(Wl)),s=Object.fromEntries(t.get(ql)),l=new Qo(n,{state:r,nodeViews:o,markViews:s,transformPasted:(a,u,c)=>(t.get(vi).sort((f,h)=>(h.priority??50)-(f.priority??50)).map(f=>f.run).forEach(f=>{a=f(a,u,c)}),a),...i});return zS(l.dom),t.set(Je,l),t.done(ts),()=>{l?.destroy(),t.remove(ns).remove(Je).remove(yr).remove(gc).remove(yc).remove(Hl).clearTimer(ts)}});on(dy,{displayName:"EditorView"});var pr,it,tn,Si,is,ss,Ke,nn,dr,ls,mr,Mi,as,Rn,Ni,Ii,my=(Ii=class{constructor(){z(this,pr);z(this,it);z(this,tn);z(this,Si);z(this,is);z(this,ss);z(this,Ke);z(this,nn);z(this,dr);z(this,ls);z(this,mr);z(this,Mi);z(this,as);z(this,Rn);z(this,Ni);v(this,pr,!1),v(this,it,"Idle"),v(this,tn,[]),v(this,Si,()=>{}),v(this,is,new ba),v(this,ss,new Vh),v(this,Ke,new Map),v(this,nn,new Map),v(this,dr,new $h(b(this,is),b(this,ss))),v(this,ls,()=>{let e=vS(async r=>{await Promise.all(b(this,tn).map(i=>Promise.resolve(i(r))))}),n=[ry,uy,fy,sy,RS,py,hy,dy,ES(this),e];b(this,mr).call(this,n,b(this,nn))}),v(this,mr,(e,n)=>{e.forEach(r=>{let i=b(this,dr).produce(b(this,pr)?r.meta:void 0),o=r(i);n.set(r,{ctx:i,handler:o,cleanup:void 0})})}),v(this,Mi,(e,n=!1)=>Promise.all([e].flat().map(async r=>{let i=b(this,Ke).get(r)?.cleanup;return n?b(this,Ke).delete(r):b(this,Ke).set(r,{ctx:void 0,handler:void 0,cleanup:void 0}),typeof i=="function"?i():i}))),v(this,as,async()=>{await Promise.all([...b(this,nn).entries()].map(async([e,{cleanup:n}])=>typeof n=="function"?n():n)),b(this,nn).clear()}),v(this,Rn,e=>{v(this,it,e),b(this,Si).call(this,e)}),v(this,Ni,e=>[...e.entries()].map(async([n,r])=>{let{ctx:i,handler:o}=r;if(!o)return;let s=await o();e.set(n,{ctx:i,handler:o,cleanup:s})})),this.enableInspector=(e=!0)=>(v(this,pr,e),this),this.onStatusChange=e=>(v(this,Si,e),this),this.config=e=>(b(this,tn).push(e),this),this.removeConfig=e=>(v(this,tn,b(this,tn).filter(n=>n!==e)),this),this.use=e=>{let n=[e].flat();return n.flat().forEach(r=>{b(this,Ke).set(r,{ctx:void 0,handler:void 0,cleanup:void 0})}),b(this,it)==="Created"&&b(this,mr).call(this,n,b(this,Ke)),this},this.remove=async e=>b(this,it)==="OnCreate"?(console.warn("[Milkdown]: You are trying to remove plugins when the editor is creating, this is not recommended, please check your code."),new Promise(n=>{setTimeout(()=>{n(this.remove(e))},50)})):(await b(this,Mi).call(this,[e].flat(),!0),this),this.create=async()=>b(this,it)==="OnCreate"?this:(b(this,it)==="Created"&&await this.destroy(),b(this,Rn).call(this,"OnCreate"),b(this,ls).call(this),b(this,mr).call(this,[...b(this,Ke).keys()],b(this,Ke)),await Promise.all([b(this,Ni).call(this,b(this,nn)),b(this,Ni).call(this,b(this,Ke))].flat()),b(this,Rn).call(this,"Created"),this),this.destroy=async(e=!1)=>b(this,it)==="Destroyed"||b(this,it)==="OnDestroy"?this:b(this,it)==="OnCreate"?new Promise(n=>{setTimeout(()=>{n(this.destroy(e))},50)}):(e&&v(this,tn,[]),b(this,Rn).call(this,"OnDestroy"),await b(this,Mi).call(this,[...b(this,Ke).keys()],e),await b(this,as).call(this),b(this,Rn).call(this,"Destroyed"),this),this.action=e=>e(b(this,dr)),this.inspect=()=>b(this,pr)?[...b(this,nn).values(),...b(this,Ke).values()].map(({ctx:e})=>e?.inspector?.read()).filter(e=>!!e):(console.warn("[Milkdown]: You are trying to collect inspection when inspector is disabled, please enable inspector by `editor.enableInspector()` first."),[])}static make(){return new Ii}get ctx(){return b(this,dr)}get status(){return b(this,it)}},pr=new WeakMap,it=new WeakMap,tn=new WeakMap,Si=new WeakMap,is=new WeakMap,ss=new WeakMap,Ke=new WeakMap,nn=new WeakMap,dr=new WeakMap,ls=new WeakMap,mr=new WeakMap,Mi=new WeakMap,as=new WeakMap,Rn=new WeakMap,Ni=new WeakMap,Ii);var FS=t=>crypto.getRandomValues(new Uint8Array(t)),_S=(t,e,n)=>{let r=256-256%t.length;if(r===256){let i=t.length-1;return(o=e)=>{if(!o)return"";let s="";for(;;){let l=n(o),a=o|=0;for(;a--;)if(s+=t[l[a]&i],s.length>=o)return s}}}return(i=e)=>{if(!i)return"";let o="",s=Math.ceil(1.6*256*i/r);for(;;){let l=n(s),a=s;for(;a--;)if(l[a]<r&&(o+=t[l[a]%t.length],o.length>=i))return o}}},gy=(t,e=21)=>_S(t,e|0,FS);var az=gy("abcedfghicklmn",10);function yy(t,e,n){let r=t.findIndex(([o])=>o===e);if(r===-1)return[...t,n];let i=t.slice();return i[r]=n,i}function W(t,e){let n=oy(t),r=i=>async()=>{r.key=n,await i.wait(bi);let o=e(i);return i.get(ee).create(n,o),r.run=s=>i.get(ee).call(t,s),()=>{i.get(ee).remove(n)}};return r}function De(t){let e=n=>async()=>{await n.wait(Ve);let r=t(n);return n.update(Ti,i=>[...i,r]),e.inputRule=r,()=>{n.update(Ti,i=>i.filter(o=>o!==r))}};return e}function ky(t){let e=n=>async()=>{await n.wait(Ve);let r=t(n);return n.update(vi,i=>[...i,r]),e.pasteRule=r,()=>{n.update(vi,i=>i.filter(o=>o!==r))}};return e}function $S(t,e){let n=r=>async()=>{let i=e(r);return r.update(xi,o=>yy(o,t,[t,i])),n.id=t,n.schema=i,()=>{r.update(xi,o=>o.filter(([s])=>s!==t))}};return n.type=r=>{let i=r.get(Ue).marks[t];if(!i)throw zh(t);return i},n}function Kl(t,e){let n=r=>async()=>{let i=e(r);return r.update(ki,o=>yy(o,t,[t,i])),n.id=t,n.schema=i,()=>{r.update(ki,o=>o.filter(([s])=>s!==t))}};return n.type=r=>{let i=r.get(Ue).nodes[t];if(!i)throw Lh(t);return i},n}function ke(t){let e,n=r=>async()=>(await r.wait(Ve),e=t(r),r.update(Mt,i=>[...i,e]),()=>{r.update(Mt,i=>i.filter(o=>o!==e))});return n.plugin=()=>e,n.key=()=>e.spec.key,n}function VS(t){let e=n=>async()=>{await n.wait(wi);let r=n.get(rs),i=t(n),o=r.addObjectKeymap(i);return e.keymap=i,()=>{o()}};return e}function Ge(t,e){let n=Q(t,e),r=i=>(i.inject(n),()=>()=>{i.remove(n)});return r.key=n,r}function pe(t,e){let n=Ge(e,t),r=Kl(t,o=>o.get(n.key)(o)),i=[n,r];return i.id=r.id,i.node=r,i.type=o=>r.type(o),i.ctx=n,i.key=n.key,i.extendSchema=o=>pe(t,o(e)),i}function Pn(t,e){let n=Ge(e,t),r=$S(t,o=>o.get(n.key)(o)),i=[n,r];return i.id=r.id,i.mark=r,i.type=o=>r.type(o),i.ctx=n,i.key=n.key,i.extendSchema=o=>Pn(t,o(e)),i}function Ie(t,e){let n=Ge(Object.fromEntries(Object.entries(e).map(([o,{shortcuts:s,priority:l}])=>[o,{shortcuts:s,priority:l}])),`${t}Keymap`),r=VS(o=>{let s=o.get(n.key),l=Object.entries(e).flatMap(([a,{command:u}])=>{let c=s[a],f=[c.shortcuts].flat(),h=c.priority;return f.map(p=>[p,{key:p,onRun:u,priority:h}])});return Object.fromEntries(l)}),i=[n,r];return i.ctx=n,i.shortcuts=r,i.key=n.key,i.keymap=r.keymap,i}var pt=(t,e=()=>({}))=>Ge(e,`${t}Attr`),kr=(t,e=()=>({}))=>Ge(e,`${t}Attr`);function sn(t,e,n){let r=Ge(n??{},t),i=s=>async()=>{await s.wait(rn);let l={plugin:e(s),options:s.get(r.key)};return s.update(Ai,a=>[...a,l]),()=>{s.update(Ai,a=>a.filter(u=>u!==l))}},o=[r,i];return o.id=t,o.plugin=i,o.options=r,o}function xy(t,e){return n=>n.get(ee).call(t,e)}function by(t){return e=>{let n=e.get(Je),r=e.get(Ue),i=e.get(St);if(!t)return i(n.state.doc);let o=n.state.doc.slice(t.from,t.to,!0),s=r.topNodeType.createAndFill(null,o.content);return s?i(s):(console.error("No document found"),"")}}function wy(t,e=!1){return n=>{let r=n.get(Je),i=n.get(Ct)(t);if(!i)return;if(!e){let u=r.state.selection.content();return r.dispatch(r.state.tr.replaceSelection(new E(i.content,u.openStart,u.openEnd)).scrollIntoView())}let o=n.get(Ue),s=xt.fromSchema(o).serializeFragment(i.content),l=kt.fromSchema(o).parseSlice(s),a=bl(l);if(a){r.dispatch(r.state.tr.replaceSelectionWith(a,!0));return}r.dispatch(r.state.tr.replaceSelection(l))}}function Cy(t,e=!1){return n=>{let r=n.get(Je),i=n.get(Ct)(t);if(!i)return;if(!e){let{state:a}=r;return r.dispatch(a.tr.replace(0,a.doc.content.size,new E(i.content,0,0)))}let o=n.get(Ue),s=n.get(es)({schema:o,doc:i,plugins:n.get(Mt)}),l=Zr.create(s);r.updateState(l)}}function Ei(t,e){return t instanceof Ot?e==t:t.indexOf(e)>-1}function Sy(t,e){return function(n,r){let{$from:i,$to:o,node:s}=n.selection;if(s&&s.isBlock||i.depth<2||!i.sameParent(o))return!1;let l=i.node(-1);if(!Ei(t,l.type))return!1;if(i.parent.content.size==0&&i.node(-1).childCount==i.indexAfter(-1)){if(i.depth==3||!Ei(t,i.node(-3).type)||i.index(-2)!=i.node(-2).childCount-1)return!1;if(r){let f=A.empty,h=i.index(-1)?1:i.index(-2)?2:3;for(let g=i.depth-h;g>=i.depth-3;g--)f=A.from(i.node(g).copy(f));let p=i.indexAfter(-1)<i.node(-2).childCount?1:i.indexAfter(-2)<i.node(-3).childCount?2:3;f=f.append(A.from(i.node(-3).type.createAndFill()));let d=i.before(i.depth-(h-1)),m=n.tr.replace(d,i.after(-p),new E(f,4-h,0)),y=-1;m.doc.nodesBetween(d,m.doc.content.size,(g,M)=>{if(y>-1)return!1;g.isTextblock&&g.content.size==0&&(y=M+1)}),y>-1&&m.setSelection(_.near(m.doc.resolve(y))),r(m.scrollIntoView())}return!0}let a=o.pos==i.end()?l.contentMatchAt(0).defaultType:null,u=n.tr.delete(i.pos,o.pos),c=a||e?[e?{type:l.type,attrs:e}:null,a?{type:a}:null]:void 0;return Qn(u.doc,i.pos,2,c)?(r&&r(u.split(i.pos,2,c).scrollIntoView()),!0):!1}}function My(t){return function(e,n){let{$from:r,$to:i}=e.selection,o=r.blockRange(i,s=>s.childCount>0&&Ei(t,s.firstChild.type));return o?n?Ei(t,r.node(o.depth-1).type)?jS(e,n,o):HS(e,n,o):!0:!1}}function jS(t,e,n){let r=t.tr,i=n.end,o=n.$to.end(n.depth),s=n.parent.child(n.endIndex-1).type;i<o&&(r.step(new Me(i-1,o,i,o,new E(A.from(s.create(null,n.parent.copy())),1,0),1,!0)),n=new ko(r.doc.resolve(n.$from.pos),r.doc.resolve(o),n.depth));let l=Yr(n);if(l==null)return!1;r.lift(n,l);let a=r.doc.resolve(r.mapping.map(i,-1)-1);return Yn(r.doc,a.pos)&&a.nodeBefore.type==a.nodeAfter.type&&r.join(a.pos),e(r.scrollIntoView()),!0}function HS(t,e,n){let r=t.tr,i=n.parent;for(let p=n.end,d=n.endIndex-1,m=n.startIndex;d>m;d--)p-=i.child(d).nodeSize,r.delete(p-1,p+1);let o=r.doc.resolve(n.start),s=o.nodeAfter;if(r.mapping.map(n.end)!=n.start+o.nodeAfter.nodeSize)return!1;let l=n.startIndex==0,a=n.endIndex==i.childCount,u=o.node(-1),c=o.index(-1);if(!u.canReplace(c+(l?0:1),c+1,s.content.append(a?A.empty:A.from(i))))return!1;let f=o.pos,h=f+s.nodeSize;return r.step(new Me(f-(l?1:0),h+(a?1:0),f+1,h-1,new E((l?A.empty:A.from(i.copy(A.empty))).append(a?A.empty:A.from(i.copy(A.empty))),l?0:1,a?0:1),l?0:1)),e(r.scrollIntoView()),!0}function Ny(t){return function(e,n){let{$from:r,$to:i}=e.selection,o=r.blockRange(i,u=>u.childCount>0&&Ei(t,u.firstChild.type));if(!o)return!1;let s=o.startIndex;if(s==0)return!1;let l=o.parent,a=l.child(s-1);if(!Ei(t,a.type))return!1;if(n){let u=a.lastChild&&a.lastChild.type==l.type,c=A.from(u?a.lastChild.lastChild.type.create():null),f=new E(A.from(a.type.create(null,A.from(l.type.create(null,c)))),u?3:1,0),h=o.start,p=o.end;n(e.tr.step(new Me(h-(u?3:1),p,h,p,f,1,!0)).scrollIntoView())}return!0}}function kc(t){let e=new Map;if(!t||!t.type)throw new Error("mdast-util-definitions expected node");return tt(t,"definition",function(r){let i=Iy(r.identifier);i&&!e.get(i)&&e.set(i,r)}),n;function n(r){let i=Iy(r);return e.get(i)}}function Iy(t){return String(t||"").toUpperCase()}function Jl(){return function(t){let e=kc(t);tt(t,function(n,r,i){if(n.type==="definition"&&i!==void 0&&typeof r=="number")return i.children.splice(r,1),[ct,r];if(n.type==="imageReference"||n.type==="linkReference"){let o=e(n.identifier);if(o&&i&&typeof r=="number")return i.children[r]=n.type==="imageReference"?{type:"image",url:o.url,title:o.title,alt:n.alt}:{type:"link",url:o.url,title:o.title,children:n.children},[ct,r]}})}}function WS(t){let e={...t};return e.position&&(e.position={start:{...e.position.start},end:{...e.position.end}}),delete e.children,e}var qS="<br />",KS=/^<br\s*\/?\s*>$/i,JS=t=>typeof t=="string"&&KS.test(t.trim());function Ay(t,e){if(!(e.childCount>=1&&e.lastChild?.type.name==="hardbreak")){t.next(e.content);return}let n=[];e.content.forEach((r,i,o)=>{o!==e.childCount-1&&n.push(r)}),t.next(A.fromArray(n))}function I(t,e){return Object.assign(t,{meta:{package:"@milkdown/preset-commonmark",...e}}),t}var xc=kr("emphasis");I(xc,{displayName:"Attr<emphasis>",group:"Emphasis"});var Ri=Pn("emphasis",t=>({attrs:{marker:{default:t.get(Dn).emphasis||"*",validate:"string"}},parseDOM:[{tag:"i"},{tag:"em"},{style:"font-style",getAttrs:e=>e==="italic"}],toDOM:e=>["em",t.get(xc.key)(e)],parseMarkdown:{match:e=>e.type==="emphasis",runner:(e,n,r)=>{e.openMark(r,{marker:n.marker}),e.next(n.children),e.closeMark(r)}},toMarkdown:{match:e=>e.type.name==="emphasis",runner:(e,n)=>{e.withMark(n,"emphasis",void 0,{marker:n.attrs.marker})}}}));I(Ri.mark,{displayName:"MarkSchema<emphasis>",group:"Emphasis"});I(Ri.ctx,{displayName:"MarkSchemaCtx<emphasis>",group:"Emphasis"});var us=W("ToggleEmphasis",t=>()=>ni(Ri.type(t)));I(us,{displayName:"Command<toggleEmphasisCommand>",group:"Emphasis"});var vy=De(t=>er(/(?:^|[^*])\*([^*]+)\*$/,Ri.type(t),{getAttr:()=>({marker:"*"}),updateCaptured:({fullMatch:e,start:n})=>e.startsWith("*")?{}:{fullMatch:e.slice(1),start:n+1}}));I(vy,{displayName:"InputRule<emphasis>|Star",group:"Emphasis"});var Ey=De(t=>er(/\b_(?![_\s])(.*?[^_\s])_$/,Ri.type(t),{getAttr:()=>({marker:"_"}),updateCaptured:({fullMatch:e,start:n})=>e.startsWith("_")?{}:{fullMatch:e.slice(1),start:n+1}}));I(Ey,{displayName:"InputRule<emphasis>|Underscore",group:"Emphasis"});var bc=Ie("emphasisKeymap",{ToggleEmphasis:{shortcuts:"Mod-i",command:t=>{let e=t.get(ee);return()=>e.call(us.key)}}});I(bc.ctx,{displayName:"KeymapCtx<emphasis>",group:"Emphasis"});I(bc.shortcuts,{displayName:"Keymap<emphasis>",group:"Emphasis"});var wc=kr("strong");I(wc,{displayName:"Attr<strong>",group:"Strong"});var cs=Pn("strong",t=>({attrs:{marker:{default:t.get(Dn).strong||"*",validate:"string"}},parseDOM:[{tag:"b",getAttrs:e=>e.style.fontWeight!="normal"&&null},{tag:"strong"},{style:"font-style",getAttrs:e=>e==="bold"},{style:"font-weight=400",clearMark:e=>e.type.name=="strong"},{style:"font-weight",getAttrs:e=>/^(bold(er)?|[5-9]\d{2,})$/.test(e)&&null}],toDOM:e=>["strong",t.get(wc.key)(e)],parseMarkdown:{match:e=>e.type==="strong",runner:(e,n,r)=>{e.openMark(r,{marker:n.marker}),e.next(n.children),e.closeMark(r)}},toMarkdown:{match:e=>e.type.name==="strong",runner:(e,n)=>{e.withMark(n,"strong",void 0,{marker:n.attrs.marker})}}}));I(cs.mark,{displayName:"MarkSchema<strong>",group:"Strong"});I(cs.ctx,{displayName:"MarkSchemaCtx<strong>",group:"Strong"});var fs=W("ToggleStrong",t=>()=>ni(cs.type(t)));I(fs,{displayName:"Command<toggleStrongCommand>",group:"Strong"});var Oy=De(t=>er(/(?<![\w:/])(?:\*\*|__)([^*_]+?)(?:\*\*|__)(?![\w/])$/,cs.type(t),{getAttr:e=>({marker:e[0].startsWith("*")?"*":"_"})}));I(Oy,{displayName:"InputRule<strong>",group:"Strong"});var Cc=Ie("strongKeymap",{ToggleBold:{shortcuts:["Mod-b"],command:t=>{let e=t.get(ee);return()=>e.call(fs.key)}}});I(Cc.ctx,{displayName:"KeymapCtx<strong>",group:"Strong"});I(Cc.shortcuts,{displayName:"Keymap<strong>",group:"Strong"});var Sc=kr("inlineCode");I(Sc,{displayName:"Attr<inlineCode>",group:"InlineCode"});var Ln=Pn("inlineCode",t=>({priority:100,code:!0,inclusive:!1,parseDOM:[{tag:"code"}],toDOM:e=>["code",t.get(Sc.key)(e)],parseMarkdown:{match:e=>e.type==="inlineCode",runner:(e,n,r)=>{e.openMark(r),e.addText(n.value),e.closeMark(r)}},toMarkdown:{match:e=>e.type.name==="inlineCode",runner:(e,n,r)=>(e.withMark(n,"inlineCode",r.text||""),!0)}}));I(Ln.mark,{displayName:"MarkSchema<inlineCode>",group:"InlineCode"});I(Ln.ctx,{displayName:"MarkSchemaCtx<inlineCode>",group:"InlineCode"});var hs=W("ToggleInlineCode",t=>()=>(e,n)=>{let{selection:r,tr:i}=e;if(r.empty)return!1;let{from:o,to:s}=r;return e.doc.rangeHasMark(o,s,Ln.type(t))?(n?.(i.removeMark(o,s,Ln.type(t))),!0):(Object.keys(e.schema.marks).filter(l=>l!==Ln.type.name).map(l=>e.schema.marks[l]).forEach(l=>{i.removeMark(o,s,l)}),n?.(i.addMark(o,s,Ln.type(t).create())),!0)});I(hs,{displayName:"Command<toggleInlineCodeCommand>",group:"InlineCode"});var Ry=De(t=>er(/(?:`)([^`]+)(?:`)$/,Ln.type(t)));I(Ry,{displayName:"InputRule<inlineCodeInputRule>",group:"InlineCode"});var Mc=Ie("inlineCodeKeymap",{ToggleInlineCode:{shortcuts:"Mod-e",command:t=>{let e=t.get(ee);return()=>e.call(hs.key)}}});I(Mc.ctx,{displayName:"KeymapCtx<inlineCode>",group:"InlineCode"});I(Mc.shortcuts,{displayName:"Keymap<inlineCode>",group:"InlineCode"});var US=new Set(["http:","https:","mailto:","tel:","ftp:"]);function GS(t){return t<=32||t>=127&&t<=160||t>=8203&&t<=8205||t===8232||t===8233||t===65279}function QS(t){let e="";for(let n of t)GS(n.codePointAt(0)??0)||(e+=n);return e}function YS(t){if(typeof t!="string")return"";let e=t.trim();if(!e)return"";let n=QS(e),r=/^([a-z][a-z0-9+.-]*):/i.exec(n)?.[1];return!r||US.has(`${r.toLowerCase()}:`)?e:""}var Nc=kr("link");I(Nc,{displayName:"Attr<link>",group:"Link"});var Oi=Pn("link",t=>({attrs:{href:{validate:"string"},title:{default:null,validate:"string|null"}},parseDOM:[{tag:"a[href]",getAttrs:e=>{if(!(e instanceof HTMLElement))throw et(e);return{href:e.getAttribute("href"),title:e.getAttribute("title")}}}],toDOM:e=>["a",{...t.get(Nc.key)(e),...e.attrs,href:YS(e.attrs.href)}],parseMarkdown:{match:e=>e.type==="link",runner:(e,n,r)=>{let i=n.url,o=n.title;e.openMark(r,{href:i,title:o}),e.next(n.children),e.closeMark(r)}},toMarkdown:{match:e=>e.type.name==="link",runner:(e,n)=>{e.withMark(n,"link",void 0,{title:n.attrs.title,url:n.attrs.href})}}}));I(Oi.mark,{displayName:"MarkSchema<link>",group:"Link"});var Ql=W("ToggleLink",t=>(e={})=>ni(Oi.type(t),e));I(Ql,{displayName:"Command<toggleLinkCommand>",group:"Link"});var Dy=W("UpdateLink",t=>(e={})=>(n,r)=>{if(!r)return!1;let i,o=-1,{selection:s}=n,{from:l,to:a}=s;if(n.doc.nodesBetween(l,l===a?a+1:a,(d,m)=>{if(Oi.type(t).isInSet(d.marks))return i=d,o=m,!1}),!i)return!1;let u=i.marks.find(({type:d})=>d===Oi.type(t));if(!u)return!1;let c=o,f=o+i.nodeSize,{tr:h}=n,p=Oi.type(t).create({...u.attrs,...e});return p?(r(h.removeMark(c,f,u).addMark(c,f,p).setSelection(new j(h.selection.$anchor)).scrollIntoView()),!0):!1});I(Dy,{displayName:"Command<updateLinkCommand>",group:"Link"});var Py=Kl("doc",()=>({content:"block+",parseMarkdown:{match:({type:t})=>t==="root",runner:(t,e,n)=>{t.injectRoot(e,n)}},toMarkdown:{match:t=>t.type.name==="doc",runner:(t,e)=>{t.openNode("root");let n=e.childCount>0?e.child(e.childCount-1):null,r=n?.type.name==="paragraph"&&n.content.size===0?e.content.cut(0,e.content.size-n.nodeSize):e.content;t.next(r)}}}));I(Py,{displayName:"NodeSchema<doc>",group:"Doc"});var Ly=Object.freeze(["root","blockquote","listItem","footnoteDefinition"]),XS=new Set(["paragraph","heading","tableCell","link","linkReference","emphasis","strong","delete","footnote"]),Ul=Ge(Ly,"blockContainerTypes");I(Ul,{displayName:"Ctx<blockContainerTypes>",group:"Remark"});var Ty=new Set;function zy(t){let e=t.isInjected(Ul.key)?t.get(Ul.key):Ly,n=new Set;for(let r of e){if(XS.has(r)){Ty.has(r)||(Ty.add(r),console.warn(`[milkdown/preset-commonmark] "${r}" holds phrasing content and cannot be a block container; it is ignored in blockContainerTypes.`));continue}n.add(r)}return n}var ZS=new Set(["paragraph","tableCell"]);function eM(t,e){return xn(t,n=>n.type==="html"&&JS(n.value),(n,r)=>{let i=r[r.length-1];if(i){if(ZS.has(i.type)){i.children.length===1&&(i.children=[]);return}if(e.has(i.type)){let o=n;return o.children=[],delete o.value,o.type="paragraph",ct}}})}var Yl=sn("remark-preserve-empty-line",t=>()=>e=>eM(e,zy(t)));I(Yl.plugin,{displayName:"Remark<remarkPreserveEmptyLine>",group:"Remark"});I(Yl.options,{displayName:"RemarkConfig<remarkPreserveEmptyLine>",group:"Remark"});var Ic=pt("paragraph");I(Ic,{displayName:"Attr<paragraph>",group:"Paragraph"});var Nt=pe("paragraph",t=>({content:"inline*",group:"block",parseDOM:[{tag:"p"}],toDOM:e=>["p",t.get(Ic.key)(e),0],parseMarkdown:{match:e=>e.type==="paragraph",runner:(e,n,r)=>{e.openNode(r),n.children?e.next(n.children):e.addText(n.value||""),e.closeNode()}},toMarkdown:{match:e=>e.type.name==="paragraph",runner:(e,n)=>{e.openNode("paragraph"),(!n.content||n.content.size===0)&&tM(t)?e.addNode("html",void 0,qS):Ay(e,n),e.closeNode()}}}));function tM(t){return t.isInjected(Yl.options.key)}I(Nt.node,{displayName:"NodeSchema<paragraph>",group:"Paragraph"});I(Nt.ctx,{displayName:"NodeSchemaCtx<paragraph>",group:"Paragraph"});var Tc=W("TurnIntoText",t=>()=>ti(Nt.type(t)));I(Tc,{displayName:"Command<turnIntoTextCommand>",group:"Paragraph"});var Ac=Ie("paragraphKeymap",{TurnIntoText:{shortcuts:"Mod-Alt-0",command:t=>{let e=t.get(ee);return()=>e.call(Tc.key)}}});I(Ac.ctx,{displayName:"KeymapCtx<paragraph>",group:"Paragraph"});I(Ac.shortcuts,{displayName:"Keymap<paragraph>",group:"Paragraph"});var nM=Array(6).fill(0).map((t,e)=>e+1);function rM(t){return t.textContent.toLowerCase().trim().replace(/\s+/g,"-")}var Xl=Ge(rM,"headingIdGenerator");I(Xl,{displayName:"Ctx<HeadingIdGenerator>",group:"Heading"});var vc=pt("heading");I(vc,{displayName:"Attr<heading>",group:"Heading"});var xr=pe("heading",t=>{let e=t.get(Xl.key);return{content:"inline*",group:"block",defining:!0,attrs:{id:{default:"",validate:"string"},level:{default:1,validate:"number"}},parseDOM:nM.map(n=>({tag:`h${n}`,getAttrs:r=>{if(!(r instanceof HTMLElement))throw et(r);return{level:n,id:r.id}}})),toDOM:n=>[`h${n.attrs.level}`,{...t.get(vc.key)(n),id:n.attrs.id||e(n)},0],parseMarkdown:{match:({type:n})=>n==="heading",runner:(n,r,i)=>{let o=r.depth;n.openNode(i,{level:o}),n.next(r.children),n.closeNode()}},toMarkdown:{match:n=>n.type.name==="heading",runner:(n,r)=>{n.openNode("heading",void 0,{depth:r.attrs.level}),Ay(n,r),n.closeNode()}}}});I(xr.node,{displayName:"NodeSchema<heading>",group:"Heading"});I(xr.ctx,{displayName:"NodeSchemaCtx<heading>",group:"Heading"});var By=De(t=>Eu(/^(?<hashes>#+)\s$/,xr.type(t),e=>{let n=e.groups?.hashes?.length||0,{$from:r}=t.get(Je).state.selection,i=r.node();if(i.type.name==="heading"){let o=Number(i.attrs.level)+Number(n);return o>6&&(o=6),{level:o}}return{level:n}}));I(By,{displayName:"InputRule<wrapInHeadingInputRule>",group:"Heading"});var Dt=W("WrapInHeading",t=>e=>(e??(e=1),e<1?ti(Nt.type(t)):ti(xr.type(t),{level:e})));I(Dt,{displayName:"Command<wrapInHeadingCommand>",group:"Heading"});var Ec=W("DowngradeHeading",t=>()=>(e,n,r)=>{let{$from:i}=e.selection,o=i.node();if(o.type!==xr.type(t)||!e.selection.empty||i.parentOffset!==0)return!1;let s=o.attrs.level-1;return s?(n?.(e.tr.setNodeMarkup(e.selection.$from.before(),void 0,{...o.attrs,level:s})),!0):ti(Nt.type(t))(e,n,r)});I(Ec,{displayName:"Command<downgradeHeadingCommand>",group:"Heading"});var Oc=Ie("headingKeymap",{TurnIntoH1:{shortcuts:"Mod-Alt-1",command:t=>{let e=t.get(ee);return()=>e.call(Dt.key,1)}},TurnIntoH2:{shortcuts:"Mod-Alt-2",command:t=>{let e=t.get(ee);return()=>e.call(Dt.key,2)}},TurnIntoH3:{shortcuts:"Mod-Alt-3",command:t=>{let e=t.get(ee);return()=>e.call(Dt.key,3)}},TurnIntoH4:{shortcuts:"Mod-Alt-4",command:t=>{let e=t.get(ee);return()=>e.call(Dt.key,4)}},TurnIntoH5:{shortcuts:"Mod-Alt-5",command:t=>{let e=t.get(ee);return()=>e.call(Dt.key,5)}},TurnIntoH6:{shortcuts:"Mod-Alt-6",command:t=>{let e=t.get(ee);return()=>e.call(Dt.key,6)}},DowngradeHeading:{shortcuts:["Delete","Backspace"],command:t=>{let e=t.get(ee);return()=>e.call(Ec.key)}}});I(Oc.ctx,{displayName:"KeymapCtx<heading>",group:"Heading"});I(Oc.shortcuts,{displayName:"Keymap<heading>",group:"Heading"});var Rc=pt("blockquote");I(Rc,{displayName:"Attr<blockquote>",group:"Blockquote"});var ps=pe("blockquote",t=>({content:"block+",group:"block",defining:!0,parseDOM:[{tag:"blockquote"}],toDOM:e=>["blockquote",t.get(Rc.key)(e),0],parseMarkdown:{match:({type:e})=>e==="blockquote",runner:(e,n,r)=>{e.openNode(r).next(n.children).closeNode()}},toMarkdown:{match:e=>e.type.name==="blockquote",runner:(e,n)=>{e.openNode("blockquote").next(n.content).closeNode()}}}));I(ps.node,{displayName:"NodeSchema<blockquote>",group:"Blockquote"});I(ps.ctx,{displayName:"NodeSchemaCtx<blockquote>",group:"Blockquote"});var Fy=De(t=>xl(/^\s*>\s$/,ps.type(t)));I(Fy,{displayName:"InputRule<wrapInBlockquoteInputRule>",group:"Blockquote"});var ds=W("WrapInBlockquote",t=>()=>kl(ps.type(t)));I(ds,{displayName:"Command<wrapInBlockquoteCommand>",group:"Blockquote"});var Dc=Ie("blockquoteKeymap",{WrapInBlockquote:{shortcuts:"Mod-Shift-b",command:t=>{let e=t.get(ee);return()=>e.call(ds.key)}}});I(Dc.ctx,{displayName:"KeymapCtx<blockquote>",group:"Blockquote"});I(Dc.shortcuts,{displayName:"Keymap<blockquote>",group:"Blockquote"});var Pc=pt("codeBlock",()=>({pre:{},code:{}}));I(Pc,{displayName:"Attr<codeBlock>",group:"CodeBlock"});var ms=pe("code_block",t=>({content:"text*",group:"block",marks:"",defining:!0,code:!0,attrs:{language:{default:"",validate:"string"}},parseDOM:[{tag:"pre",preserveWhitespace:"full",getAttrs:e=>{if(!(e instanceof HTMLElement))throw et(e);return{language:e.dataset.language}}}],toDOM:e=>{let n=t.get(Pc.key)(e),r=e.attrs.language,i=r&&r.length>0?{"data-language":r}:void 0;return["pre",{...n.pre,...i},["code",n.code,0]]},parseMarkdown:{match:({type:e})=>e==="code",runner:(e,n,r)=>{let i=n.lang??"",o=n.value;e.openNode(r,{language:i}),o&&e.addText(o),e.closeNode()}},toMarkdown:{match:e=>e.type.name==="code_block",runner:(e,n)=>{e.addNode("code",void 0,n.content.firstChild?.text||"",{lang:n.attrs.language})}}}));I(ms.node,{displayName:"NodeSchema<codeBlock>",group:"CodeBlock"});I(ms.ctx,{displayName:"NodeSchemaCtx<codeBlock>",group:"CodeBlock"});var _y=De(t=>Eu(/^```(?<language>[a-z]*)?[\s\n]$/,ms.type(t),e=>({language:e.groups?.language??""})));I(_y,{displayName:"InputRule<createCodeBlockInputRule>",group:"CodeBlock"});var Lc=W("CreateCodeBlock",t=>(e="")=>ti(ms.type(t),{language:e}));I(Lc,{displayName:"Command<createCodeBlockCommand>",group:"CodeBlock"});var iM=W("UpdateCodeBlockLanguage",()=>({pos:t,language:e}={pos:-1,language:""})=>(n,r)=>t>=0?(r?.(n.tr.setNodeAttribute(t,"language",e)),!0):!1);I(iM,{displayName:"Command<updateCodeBlockLanguageCommand>",group:"CodeBlock"});var zc=Ie("codeBlockKeymap",{CreateCodeBlock:{shortcuts:"Mod-Alt-c",command:t=>{let e=t.get(ee);return()=>e.call(Lc.key)}}});I(zc.ctx,{displayName:"KeymapCtx<codeBlock>",group:"CodeBlock"});I(zc.shortcuts,{displayName:"Keymap<codeBlock>",group:"CodeBlock"});var Bc=pt("image");I(Bc,{displayName:"Attr<image>",group:"Image"});var Di=pe("image",t=>({inline:!0,group:"inline",selectable:!0,draggable:!0,marks:"",atom:!0,defining:!0,isolating:!0,attrs:{src:{default:"",validate:"string"},alt:{default:"",validate:"string"},title:{default:"",validate:"string"}},parseDOM:[{tag:"img[src]",getAttrs:e=>{if(!(e instanceof HTMLElement))throw et(e);return{src:e.getAttribute("src")||"",alt:e.getAttribute("alt")||"",title:e.getAttribute("title")||e.getAttribute("alt")||""}}}],toDOM:e=>["img",{...t.get(Bc.key)(e),...e.attrs}],parseMarkdown:{match:({type:e})=>e==="image",runner:(e,n,r)=>{let i=n.url,o=n.alt??"",s=n.title??"";e.addNode(r,{src:i,alt:o,title:s})}},toMarkdown:{match:e=>e.type.name==="image",runner:(e,n)=>{e.addNode("image",void 0,void 0,{title:n.attrs.title,url:n.attrs.src,alt:n.attrs.alt})}}}));I(Di.node,{displayName:"NodeSchema<image>",group:"Image"});I(Di.ctx,{displayName:"NodeSchemaCtx<image>",group:"Image"});var Zl=W("InsertImage",t=>(e={})=>(n,r)=>{if(!r)return!0;let{src:i="",alt:o="",title:s=""}=e,l=Di.type(t).create({src:i,alt:o,title:s});return l&&r(n.tr.replaceSelectionWith(l).scrollIntoView()),!0});I(Zl,{displayName:"Command<insertImageCommand>",group:"Image"});var $y=W("UpdateImage",t=>(e={})=>(n,r)=>{let i=Om(n.selection,Di.type(t));if(!i)return!1;let{node:o,pos:s}=i,l={...o.attrs},{src:a,alt:u,title:c}=e;return a!==void 0&&(l.src=a),u!==void 0&&(l.alt=u),c!==void 0&&(l.title=c),r?.(n.tr.setNodeMarkup(s,void 0,l).scrollIntoView()),!0});I($y,{displayName:"Command<updateImageCommand>",group:"Image"});var oM=De(t=>new we(/!\[(?<alt>.*?)]\((?<filename>.*?)\s*(?="|\))"?(?<title>[^"]+)?"?\)/,(e,n,r,i)=>{let[o,s,l="",a]=n;return o?e.tr.replaceWith(r,i,Di.type(t).create({src:l,alt:s,title:a})):null}));I(oM,{displayName:"InputRule<insertImageInputRule>",group:"Image"});var Gl=pt("hardbreak",t=>({"data-type":"hardbreak","data-is-inline":t.attrs.isInline}));I(Gl,{displayName:"Attr<hardbreak>",group:"Hardbreak"});var gs=pe("hardbreak",t=>({inline:!0,group:"inline",attrs:{isInline:{default:!1,validate:"boolean"}},selectable:!1,parseDOM:[{tag:"br"},{tag:'span[data-type="hardbreak"]',getAttrs:()=>({isInline:!0})}],toDOM:e=>e.attrs.isInline?["span",t.get(Gl.key)(e)," "]:["br",t.get(Gl.key)(e)],parseMarkdown:{match:({type:e})=>e==="break",runner:(e,n,r)=>{e.addNode(r,{isInline:!!n.data?.isInline})}},leafText:()=>`
`,toMarkdown:{match:e=>e.type.name==="hardbreak",runner:(e,n)=>{n.attrs.isInline?e.addNode("text",void 0,`
`):e.addNode("break")}}}));I(gs.node,{displayName:"NodeSchema<hardbreak>",group:"Hardbreak"});I(gs.ctx,{displayName:"NodeSchemaCtx<hardbreak>",group:"Hardbreak"});var Fc=W("InsertHardbreak",t=>()=>(e,n)=>{let{selection:r,tr:i}=e;if(!(r instanceof j))return!1;if(r.empty){let o=r.$from.node();if(o.childCount>0&&o.lastChild?.type.name==="hardbreak")return n?.(i.replaceRangeWith(r.to-1,r.to,e.schema.node("paragraph")).setSelection(_.near(i.doc.resolve(r.to))).scrollIntoView()),!0}return n?.(i.setMeta("hardbreak",!0).replaceSelectionWith(gs.type(t).create(),!1).scrollIntoView()),!0});I(Fc,{displayName:"Command<insertHardbreakCommand>",group:"Hardbreak"});var _c=Ie("hardbreakKeymap",{InsertHardbreak:{shortcuts:"Shift-Enter",command:t=>{let e=t.get(ee);return()=>e.call(Fc.key)}}});I(_c.ctx,{displayName:"KeymapCtx<hardbreak>",group:"Hardbreak"});I(_c.shortcuts,{displayName:"Keymap<hardbreak>",group:"Hardbreak"});var $c=pt("hr");I($c,{displayName:"Attr<hr>",group:"Hr"});var ys=pe("hr",t=>({group:"block",parseDOM:[{tag:"hr"}],toDOM:e=>["hr",t.get($c.key)(e)],parseMarkdown:{match:({type:e})=>e==="thematicBreak",runner:(e,n,r)=>{e.addNode(r)}},toMarkdown:{match:e=>e.type.name==="hr",runner:e=>{e.addNode("thematicBreak")}}}));I(ys.node,{displayName:"NodeSchema<hr>",group:"Hr"});I(ys.ctx,{displayName:"NodeSchemaCtx<hr>",group:"Hr"});var Vy=De(t=>new we(/^(?:---|___\s|\*\*\*\s)$/,(e,n,r,i)=>{let{tr:o}=e;return n[0]&&o.replaceWith(r-1,i,ys.type(t).create()),o}));I(Vy,{displayName:"InputRule<insertHrInputRule>",group:"Hr"});var ea=W("InsertHr",t=>()=>(e,n)=>{if(!n)return!0;let r=Nt.node.type(t).create(),{tr:i,selection:o}=e,{from:s}=o,l=ys.type(t).create();if(!l)return!0;let a=i.replaceSelectionWith(l).insert(s,r),u=_.findFrom(a.doc.resolve(s),1,!0);return u&&n(a.setSelection(u).scrollIntoView()),!0});I(ea,{displayName:"Command<insertHrCommand>",group:"Hr"});var Vc=pt("bulletList");I(Vc,{displayName:"Attr<bulletList>",group:"BulletList"});var Pi=pe("bullet_list",t=>({content:"listItem+",group:"block",attrs:{spread:{default:!1,validate:"boolean"}},parseDOM:[{tag:"ul",getAttrs:e=>{if(!(e instanceof HTMLElement))throw et(e);return{spread:e.dataset.spread==="true"}}}],toDOM:e=>["ul",{...t.get(Vc.key)(e),"data-spread":e.attrs.spread},0],parseMarkdown:{match:({type:e,ordered:n})=>e==="list"&&!n,runner:(e,n,r)=>{let i=n.spread??!1;e.openNode(r,{spread:i}).next(n.children).closeNode()}},toMarkdown:{match:e=>e.type.name==="bullet_list",runner:(e,n)=>{e.openNode("list",void 0,{ordered:!1,spread:n.attrs.spread}).next(n.content).closeNode()}}}));I(Pi.node,{displayName:"NodeSchema<bulletList>",group:"BulletList"});I(Pi.ctx,{displayName:"NodeSchemaCtx<bulletList>",group:"BulletList"});var jy=De(t=>xl(/^\s*([-+*])\s$/,Pi.type(t)));I(jy,{displayName:"InputRule<wrapInBulletListInputRule>",group:"BulletList"});var ks=W("WrapInBulletList",t=>()=>kl(Pi.type(t)));I(ks,{displayName:"Command<wrapInBulletListCommand>",group:"BulletList"});var jc=Ie("bulletListKeymap",{WrapInBulletList:{shortcuts:"Mod-Alt-8",command:t=>{let e=t.get(ee);return()=>e.call(ks.key)}}});I(jc.ctx,{displayName:"KeymapCtx<bulletListKeymap>",group:"BulletList"});I(jc.shortcuts,{displayName:"Keymap<bulletListKeymap>",group:"BulletList"});var Hc=pt("orderedList");I(Hc,{displayName:"Attr<orderedList>",group:"OrderedList"});var Li=pe("ordered_list",t=>({content:"listItem+",group:"block",attrs:{order:{default:1,validate:"number"},spread:{default:!1,validate:"boolean"}},parseDOM:[{tag:"ol",getAttrs:e=>{if(!(e instanceof HTMLElement))throw et(e);return{spread:e.dataset.spread==="true",order:e.hasAttribute("start")?Number(e.getAttribute("start")):1}}}],toDOM:e=>["ol",{...t.get(Hc.key)(e),...e.attrs.order===1?{}:{start:e.attrs.order},"data-spread":e.attrs.spread},0],parseMarkdown:{match:({type:e,ordered:n})=>e==="list"&&!!n,runner:(e,n,r)=>{let i=n.spread??!0;e.openNode(r,{spread:i,order:n.start??1}).next(n.children).closeNode()}},toMarkdown:{match:e=>e.type.name==="ordered_list",runner:(e,n)=>{e.openNode("list",void 0,{ordered:!0,start:n.attrs.order??1,spread:n.attrs.spread}),e.next(n.content),e.closeNode()}}}));I(Li.node,{displayName:"NodeSchema<orderedList>",group:"OrderedList"});I(Li.ctx,{displayName:"NodeSchemaCtx<orderedList>",group:"OrderedList"});var Hy=De(t=>xl(/^\s*(\d+)\.\s$/,Li.type(t),e=>({order:Number(e[1])}),(e,n)=>n.childCount+n.attrs.order===Number(e[1])));I(Hy,{displayName:"InputRule<wrapInOrderedListInputRule>",group:"OrderedList"});var Wc=W("WrapInOrderedList",t=>()=>kl(Li.type(t)));I(Wc,{displayName:"Command<wrapInOrderedListCommand>",group:"OrderedList"});var qc=Ie("orderedListKeymap",{WrapInOrderedList:{shortcuts:"Mod-Alt-7",command:t=>{let e=t.get(ee);return()=>e.call(Wc.key)}}});I(qc.ctx,{displayName:"KeymapCtx<orderedList>",group:"OrderedList"});I(qc.shortcuts,{displayName:"Keymap<orderedList>",group:"OrderedList"});var Kc=pt("listItem");I(Kc,{displayName:"Attr<listItem>",group:"ListItem"});var Pt=pe("list_item",t=>({group:"listItem",content:"paragraph block*",attrs:{label:{default:"\u2022",validate:"string"},listType:{default:"bullet",validate:"string"},spread:{default:!0,validate:"boolean"}},defining:!0,parseDOM:[{tag:"li",getAttrs:e=>{if(!(e instanceof HTMLElement))throw et(e);return{label:e.dataset.label,listType:e.dataset.listType,spread:e.dataset.spread==="true"}}}],toDOM:e=>["li",{...t.get(Kc.key)(e),"data-label":e.attrs.label,"data-list-type":e.attrs.listType,"data-spread":e.attrs.spread},0],parseMarkdown:{match:({type:e})=>e==="listItem",runner:(e,n,r)=>{let i=n.label!=null?`${n.label}.`:"\u2022",o=n.label!=null?"ordered":"bullet",s=n.spread??!0;e.openNode(r,{label:i,listType:o,spread:s}),e.next(n.children),e.closeNode()}},toMarkdown:{match:e=>e.type.name==="list_item",runner:(e,n)=>{e.openNode("listItem",void 0,{spread:n.attrs.spread}),e.next(n.content),e.closeNode()}}}));I(Pt.node,{displayName:"NodeSchema<listItem>",group:"ListItem"});I(Pt.ctx,{displayName:"NodeSchemaCtx<listItem>",group:"ListItem"});var Jc=W("SinkListItem",t=>()=>Ny(Pt.type(t)));I(Jc,{displayName:"Command<sinkListItemCommand>",group:"ListItem"});var Uc=W("LiftListItem",t=>()=>My(Pt.type(t)));I(Uc,{displayName:"Command<liftListItemCommand>",group:"ListItem"});var Gc=W("SplitListItem",t=>()=>(e,n,r)=>Sy(Pt.type(t))(e,n&&(i=>{let{$from:o}=e.selection;if(o.parent.content.size===0&&o.node(-1).childCount===o.indexAfter(-1)){let{$from:s}=i.selection;i.setNodeMarkup(s.before(-1),void 0,o.node(-3).attrs)}n(i)}),r));I(Gc,{displayName:"Command<splitListItemCommand>",group:"ListItem"});function sM(t){return(e,n,r)=>{let{selection:i}=e;if(!(i instanceof j))return!1;let{empty:o,$from:s}=i;return!o||s.parentOffset!==0||s.node(-1).type!==Pt.type(t)?!1:Iu(e,n,r)}}var Qc=W("LiftFirstListItem",t=>()=>sM(t));I(Qc,{displayName:"Command<liftFirstListItemCommand>",group:"ListItem"});var Yc=Ie("listItemKeymap",{NextListItem:{shortcuts:"Enter",command:t=>{let e=t.get(ee);return()=>e.call(Gc.key)}},SinkListItem:{shortcuts:["Tab","Mod-]"],command:t=>{let e=t.get(ee);return()=>e.call(Jc.key)}},LiftListItem:{shortcuts:["Shift-Tab","Mod-["],command:t=>{let e=t.get(ee);return()=>e.call(Uc.key)}},LiftFirstListItem:{shortcuts:["Backspace","Delete"],command:t=>{let e=t.get(ee);return()=>e.call(Qc.key)}}});I(Yc.ctx,{displayName:"KeymapCtx<listItem>",group:"ListItem"});I(Yc.shortcuts,{displayName:"Keymap<listItem>",group:"ListItem"});var Wy=Kl("text",()=>({group:"inline",parseMarkdown:{match:({type:t})=>t==="text",runner:(t,e)=>{t.addText(e.value)}},toMarkdown:{match:t=>t.type.name==="text",runner:(t,e)=>{t.addNode("text",void 0,e.text)}}}));I(Wy,{displayName:"NodeSchema<text>",group:"Text"});var Xc=pt("html");I(Xc,{displayName:"Attr<html>",group:"Html"});var Zc=pe("html",t=>({atom:!0,group:"inline",inline:!0,attrs:{value:{default:"",validate:"string"}},toDOM:e=>{let n=document.createElement("span"),r={...t.get(Xc.key)(e),"data-value":e.attrs.value,"data-type":"html"};return n.textContent=e.attrs.value,["span",r,e.attrs.value]},parseDOM:[{tag:'span[data-type="html"]',getAttrs:e=>({value:e.dataset.value??""})}],parseMarkdown:{match:({type:e})=>e==="html",runner:(e,n,r)=>{e.addNode(r,{value:n.value})}},toMarkdown:{match:e=>e.type.name==="html",runner:(e,n)=>{e.addNode("html",void 0,n.attrs.value)}}}));I(Zc.node,{displayName:"NodeSchema<html>",group:"Html"});I(Zc.ctx,{displayName:"NodeSchemaCtx<html>",group:"Html"});var lM=[Py,Ic,Nt,Xl,vc,xr,Gl,gs,Rc,ps,Pc,ms,$c,ys,Bc,Di,Vc,Pi,Hc,Li,Kc,Pt,xc,Ri,wc,cs,Sc,Ln,Nc,Oi,Xc,Zc,Wy].flat(),aM=[Fy,jy,Hy,_y,Vy,By].flat(),uM=[vy,Ey,Ry,Oy],cM=W("IsMarkSelected",()=>t=>e=>{if(!t)return!1;let{doc:n,selection:r}=e;return n.rangeHasMark(r.from,r.to,t)}),fM=W("IsNoteSelected",()=>t=>e=>t?Rm(e,t).hasNode:!1),hM=W("ClearTextInCurrentBlock",()=>()=>(t,e)=>{let n=t.tr,{$from:r,$to:i}=n.selection,{pos:o}=r,{pos:s}=i,l=o-r.node().content.size;return l<0?!1:(n=n.deleteRange(l,s),e?.(n),!0)}),pM=W("SetBlockType",()=>t=>(e,n)=>{let{nodeType:r,attrs:i=null}=t??{};if(!r)return!1;let o=e.tr,{from:s,to:l}=o.selection;try{o.setBlockType(s,l,r,i)}catch{return!1}return n?.(o),!0}),dM=W("WrapInBlockType",()=>t=>(e,n)=>{let{nodeType:r,attrs:i=null}=t??{};if(!r)return!1;let o=e.tr;try{let{$from:s,$to:l}=o.selection,a=s.blockRange(l),u=a&&Gn(a,r,i);if(!u)return!1;o=o.wrap(a,u)}catch{return!1}return n?.(o),!0}),mM=W("AddBlockType",()=>t=>(e,n)=>{let{nodeType:r,attrs:i=null}=t??{};if(!r)return!1;let o=e.tr;try{let s=r instanceof We?r:r.createAndFill(i);if(!s)return!1;o.replaceSelectionWith(s)}catch{return!1}return n?.(o),!0}),gM=W("SelectTextNearPos",()=>t=>(e,n)=>{let{pos:r}=t??{};if(r==null)return!1;let i=(s,l,a)=>Math.min(Math.max(s,l),a),o=e.tr;try{let s=e.doc.resolve(i(r,0,e.doc.content.size));o.setSelection(j.near(s))}catch{return!1}return n?.(o.scrollIntoView()),!0}),yM=[Tc,ds,Dt,Ec,Lc,Fc,ea,Zl,$y,Wc,ks,Jc,Gc,Uc,Qc,us,hs,fs,Ql,Dy,cM,fM,hM,pM,dM,mM,gM],kM=[Dc,zc,_c,Oc,Yc,qc,jc,Ac,bc,Mc,Cc].flat(),ef=sn("remarkAddOrderInList",()=>()=>t=>{tt(t,"list",e=>{if(e.ordered){let n=e.start??1;e.children.forEach((r,i)=>{r.label=i+n})}})});I(ef.plugin,{displayName:"Remark<remarkAddOrderInListPlugin>",group:"Remark"});I(ef.options,{displayName:"RemarkConfig<remarkAddOrderInListPlugin>",group:"Remark"});var tf=sn("remarkLineBreak",()=>()=>t=>{let e=/(?<![\t ])[\t ]*(?:\r?\n|\r)/g;tt(t,"text",(n,r,i)=>{if(!n.value||typeof n.value!="string")return;let o=[],s=0;e.lastIndex=0;let l=e.exec(n.value);for(;l;){let a=l.index;s!==a&&o.push({type:"text",value:n.value.slice(s,a)}),o.push({type:"break",data:{isInline:!0}}),s=a+l[0].length,l=e.exec(n.value)}if(o.length>0&&i&&typeof r=="number")return s<n.value.length&&o.push({type:"text",value:n.value.slice(s)}),i.children.splice(r,1,...o),r+o.length})});I(tf.plugin,{displayName:"Remark<remarkLineBreak>",group:"Remark"});I(tf.options,{displayName:"RemarkConfig<remarkLineBreak>",group:"Remark"});var nf=sn("remarkInlineLink",()=>Jl);I(nf.plugin,{displayName:"Remark<remarkInlineLinkPlugin>",group:"Remark"});I(nf.options,{displayName:"RemarkConfig<remarkInlineLinkPlugin>",group:"Remark"});var xM=t=>!!t.children,bM=t=>t.type==="html";function wM(t,e){return n(t,0,null)[0];function n(r,i,o){if(xM(r)){let s=[];for(let l=0,a=r.children.length;l<a;l++){let u=r.children[l];if(u){let c=n(u,l,r);if(c)for(let f=0,h=c.length;f<h;f++){let p=c[f];p&&s.push(p)}}}r.children=s}return e(r,i,o)}}var rf=sn("remarkHTMLTransformer",t=>()=>e=>{let n=zy(t);wM(e,(r,i,o)=>bM(r)?(o&&n.has(o.type)&&(r.children=[WS(r)],delete r.value,r.type="paragraph"),[r]):[r])});I(rf.plugin,{displayName:"Remark<remarkHtmlTransformer>",group:"Remark"});I(rf.options,{displayName:"RemarkConfig<remarkHtmlTransformer>",group:"Remark"});var of=sn("remarkMarker",()=>()=>(t,e)=>{let n=r=>e.value.charAt(r.position.start.offset);tt(t,r=>["strong","emphasis"].includes(r.type),r=>{r.marker=n(r)})});I(of.plugin,{displayName:"Remark<remarkMarker>",group:"Remark"});I(of.options,{displayName:"RemarkConfig<remarkMarker>",group:"Remark"});var qy=ke(()=>{let t=!1,e=new ne("MILKDOWN_INLINE_NODES_CURSOR"),n=new te({key:e,state:{init(){return!1},apply(r){if(!r.selection.empty)return!1;let i=r.selection.$from,o=i.nodeBefore,s=i.nodeAfter;return!!(o&&s&&o.isInline&&!o.isText&&s.isInline&&!s.isText)}},props:{handleDOMEvents:{compositionend:(r,i)=>t?(t=!1,requestAnimationFrame(()=>{if(n.getState(r.state)){let o=r.state.selection.from;i.preventDefault(),r.dispatch(r.state.tr.insertText(i.data||"",o))}}),!0):!1,compositionstart:r=>(n.getState(r.state)&&(t=!0),!1),beforeinput:(r,i)=>{if(n.getState(r.state)&&i instanceof InputEvent&&i.data&&!t){let o=r.state.selection.from;return i.preventDefault(),r.dispatch(r.state.tr.insertText(i.data||"",o)),!0}return!1}},decorations(r){if(n.getState(r)){let i=r.selection.$from.pos,o=document.createElement("span"),s=ye.widget(i,o,{side:-1}),l=document.createElement("span"),a=ye.widget(i,l);return setTimeout(()=>{o.contentEditable="true",l.contentEditable="true"}),ae.create(r.doc,[s,a])}return ae.empty}}});return n});I(qy,{displayName:"Prose<inlineNodesCursorPlugin>",group:"Prose"});var Ky=ke(t=>new te({key:new ne("MILKDOWN_HARDBREAK_MARKS"),appendTransaction:(e,n,r)=>{if(!e.length)return;let i=gs.type(t),o;return e.forEach((s,l)=>{s.steps.forEach((a,u)=>{if(!(a instanceof Gt))return;let c=(p,d)=>e.slice(l).reduce((m,y,g)=>(g===0?y.mapping.slice(u+1):y.mapping).map(m,d),p),f=c(a.from,-1),h=c(a.to,1);r.doc.nodesBetween(f,h,(p,d)=>{p.type!==i||p.attrs.isInline||p.marks.length&&(o??(o=r.tr),o.setNodeMarkup(d,i,p.attrs,[]))})})}),o}}));I(Ky,{displayName:"Prose<hardbreakClearMarkPlugin>",group:"Prose"});var sf=Ge(["table","code_block"],"hardbreakFilterNodes");I(sf,{displayName:"Ctx<hardbreakFilterNodes>",group:"Prose"});var Jy=ke(t=>{let e=t.get(sf.key);return new te({key:new ne("MILKDOWN_HARDBREAK_FILTER"),filterTransaction:(n,r)=>{let i=n.getMeta("hardbreak"),[o]=n.steps;if(i&&o instanceof Se){let s=r.doc.resolve(o.from),l=s.depth,a=!0;for(;l>0;)e.includes(s.node(l).type.name)&&(a=!1),l--;return a}return!0}})});I(Jy,{displayName:"Prose<hardbreakFilterPlugin>",group:"Prose"});var Uy=ke(t=>{let e=new ne("MILKDOWN_HEADING_ID"),n=r=>{if(r.composing)return;let i=t.get(Xl.key),o=r.state.tr.setMeta("addToHistory",!1),s=!1,l={};r.state.doc.descendants((a,u)=>{if(a.type===xr.type(t)){if(a.textContent.trim().length===0)return;let c=a.attrs,f=i(a);l[f]?(l[f]+=1,f+=`-#${l[f]}`):l[f]=1,c.id!==f&&(s=!0,o.setMeta(e,!0).setNodeMarkup(u,void 0,{...c,id:f}))}}),s&&r.dispatch(o)};return new te({key:e,view:r=>(n(r),{update:(i,o)=>{i.state.doc.eq(o.doc)||n(i)}})})});I(Uy,{displayName:"Prose<syncHeadingIdPlugin>",group:"Prose"});var Gy=ke(t=>{let e=(n,r,i)=>{if(!i.selection||n.some(f=>f.getMeta("addToHistory")===!1||!f.isGeneric))return null;let o=Li.type(t),s=Pi.type(t),l=Pt.type(t),a=(f,h,p=1)=>{let d=!1,m=`${h+p}.`;return f.label!==m&&(f.label=m,d=!0),d},u=i.tr,c=!1;return i.doc.descendants((f,h,p,d)=>{if(f.type===s){let m=f.maybeChild(0);m?.type===l&&m.attrs.listType==="ordered"&&(c=!0,u.setNodeMarkup(h,o,{spread:!0}),f.descendants((y,g,M,w)=>{if(y.type===l){let T={...y.attrs};a(T,w)&&(u=u.setNodeMarkup(g,void 0,T))}return!1}))}else if(f.type===l&&p?.type===o){let m={...f.attrs},y=!1;m.listType!=="ordered"&&(m.listType="ordered",y=!0),p?.maybeChild(0)&&(y=a(m,d,p?.attrs.order??1)),y&&(u=u.setNodeMarkup(h,void 0,m),c=!0)}}),c?u.setMeta("addToHistory",!1):null};return new te({key:new ne("MILKDOWN_KEEP_LIST_ORDER"),appendTransaction:e})});I(Gy,{displayName:"Prose<syncListOrderPlugin>",group:"Prose"});var CM=[Ky,sf,Jy,qy,Ul,ef,nf,tf,rf,of,Yl,Uy,Gy].flat(),Qy=[lM,aM,uM,yM,kM,CM].flat();var af,uf;if(typeof WeakMap<"u"){let t=new WeakMap;af=e=>t.get(e),uf=(e,n)=>(t.set(e,n),n)}else{let t=[],n=0;af=r=>{for(let i=0;i<t.length;i+=2)if(t[i]==r)return t[i+1]},uf=(r,i)=>(n==10&&(n=0),t[n++]=r,t[n++]=i)}var re=class{constructor(t,e,n,r){this.width=t,this.height=e,this.map=n,this.problems=r}findCell(t){for(let e=0;e<this.map.length;e++){let n=this.map[e];if(n!=t)continue;let r=e%this.width,i=e/this.width|0,o=r+1,s=i+1;for(let l=1;o<this.width&&this.map[e+l]==n;l++)o++;for(let l=1;s<this.height&&this.map[e+this.width*l]==n;l++)s++;return{left:r,top:i,right:o,bottom:s}}throw new RangeError(`No cell with offset ${t} found`)}colCount(t){for(let e=0;e<this.map.length;e++)if(this.map[e]==t)return e%this.width;throw new RangeError(`No cell with offset ${t} found`)}nextCell(t,e,n){let{left:r,right:i,top:o,bottom:s}=this.findCell(t);return e=="horiz"?(n<0?r==0:i==this.width)?null:this.map[o*this.width+(n<0?r-1:i)]:(n<0?o==0:s==this.height)?null:this.map[r+this.width*(n<0?o-1:s)]}rectBetween(t,e){let{left:n,right:r,top:i,bottom:o}=this.findCell(t),{left:s,right:l,top:a,bottom:u}=this.findCell(e);return{left:Math.min(n,s),top:Math.min(i,a),right:Math.max(r,l),bottom:Math.max(o,u)}}cellsInRect(t){let e=[],n={};for(let r=t.top;r<t.bottom;r++)for(let i=t.left;i<t.right;i++){let o=r*this.width+i,s=this.map[o];n[s]||(n[s]=!0,!(i==t.left&&i&&this.map[o-1]==s||r==t.top&&r&&this.map[o-this.width]==s)&&e.push(s))}return e}positionAt(t,e,n){for(let r=0,i=0;;r++){let o=i+n.child(r).nodeSize;if(r==t){let s=e+t*this.width,l=(t+1)*this.width;for(;s<l&&this.map[s]<i;)s++;return s==l?o-1:this.map[s]}i=o}}static get(t){return af(t)||uf(t,SM(t))}};function SM(t){if(t.type.spec.tableRole!="table")throw new RangeError("Not a table node: "+t.type.name);let e=MM(t),n=t.childCount,r=[],i=0,o=null,s=[];for(let u=0,c=e*n;u<c;u++)r[u]=0;for(let u=0,c=0;u<n;u++){let f=t.child(u);c++;for(let d=0;;d++){for(;i<r.length&&r[i]!=0;)i++;if(d==f.childCount)break;let m=f.child(d),{colspan:y,rowspan:g,colwidth:M}=m.attrs;for(let w=0;w<g;w++){if(w+u>=n){(o||(o=[])).push({type:"overlong_rowspan",pos:c,n:g-w});break}let T=i+w*e;for(let R=0;R<y;R++){r[T+R]==0?r[T+R]=c:(o||(o=[])).push({type:"collision",row:u,pos:c,n:y-R});let C=M&&M[R];if(C){let L=(T+R)%e*2,P=s[L];P==null||P!=C&&s[L+1]==1?(s[L]=C,s[L+1]=1):P==C&&s[L+1]++}}}i+=y,c+=m.nodeSize}let h=(u+1)*e,p=0;for(;i<h;)r[i++]==0&&p++;p&&(o||(o=[])).push({type:"missing",row:u,n:p}),c++}(e===0||n===0)&&(o||(o=[])).push({type:"zero_sized"});let l=new re(e,n,r,o),a=!1;for(let u=0;!a&&u<s.length;u+=2)s[u]!=null&&s[u+1]<n&&(a=!0);return a&&NM(l,s,t),l}function MM(t){let e=-1,n=!1;for(let r=0;r<t.childCount;r++){let i=t.child(r),o=0;if(n)for(let s=0;s<r;s++){let l=t.child(s);for(let a=0;a<l.childCount;a++){let u=l.child(a);s+u.attrs.rowspan>r&&(o+=u.attrs.colspan)}}for(let s=0;s<i.childCount;s++){let l=i.child(s);o+=l.attrs.colspan,l.attrs.rowspan>1&&(n=!0)}e==-1?e=o:e!=o&&(e=Math.max(e,o))}return e}function NM(t,e,n){t.problems||(t.problems=[]);let r={};for(let i=0;i<t.map.length;i++){let o=t.map[i];if(r[o])continue;r[o]=!0;let s=n.nodeAt(o);if(!s)throw new RangeError(`No cell with offset ${o} found`);let l=null,a=s.attrs;for(let u=0;u<a.colspan;u++){let c=e[(i+u)%t.width*2];c!=null&&(!a.colwidth||a.colwidth[u]!=c)&&((l||(l=IM(a)))[u]=c)}l&&t.problems.unshift({type:"colwidth mismatch",pos:o,colwidth:l})}}function IM(t){if(t.colwidth)return t.colwidth.slice();let e=[];for(let n=0;n<t.colspan;n++)e.push(0);return e}function Yy(t,e){if(typeof t=="string")return{};let n=t.getAttribute("data-colwidth"),r=n&&/^\d+(,\d+)*$/.test(n)?n.split(",").map(s=>Number(s)):null,i=Number(t.getAttribute("colspan")||1),o={colspan:i,rowspan:Number(t.getAttribute("rowspan")||1),colwidth:r&&r.length==i?r:null};for(let s in e){let l=e[s].getFromDOM,a=l&&l(t);a!=null&&(o[s]=a)}return o}function Xy(t,e){let n={};t.attrs.colspan!=1&&(n.colspan=t.attrs.colspan),t.attrs.rowspan!=1&&(n.rowspan=t.attrs.rowspan),t.attrs.colwidth&&(n["data-colwidth"]=t.attrs.colwidth.join(","));for(let r in e){let i=e[r].setDOMAttr;i&&i(t.attrs[r],n)}return n}function TM(t){if(t!==null){if(!Array.isArray(t))throw new TypeError("colwidth must be null or an array");for(let e of t)if(typeof e!="number")throw new TypeError("colwidth must be null or an array of numbers")}}function ck(t){let e=t.cellAttributes||{},n={colspan:{default:1,validate:"number"},rowspan:{default:1,validate:"number"},colwidth:{default:null,validate:TM}};for(let r in e)n[r]={default:e[r].default,validate:e[r].validate};return{table:{content:"table_row+",tableRole:"table",isolating:!0,group:t.tableGroup,parseDOM:[{tag:"table"}],toDOM(){return["table",["tbody",0]]}},table_row:{content:"(table_cell | table_header)*",tableRole:"row",parseDOM:[{tag:"tr"}],toDOM(){return["tr",0]}},table_cell:{content:t.cellContent,attrs:n,tableRole:"cell",isolating:!0,parseDOM:[{tag:"td",getAttrs:r=>Yy(r,e)}],toDOM(r){return["td",Xy(r,e),0]}},table_header:{content:t.cellContent,attrs:n,tableRole:"header_cell",isolating:!0,parseDOM:[{tag:"th",getAttrs:r=>Yy(r,e)}],toDOM(r){return["th",Xy(r,e),0]}}}}function dt(t){let e=t.cached.tableNodeTypes;if(!e){e=t.cached.tableNodeTypes={};for(let n in t.nodes){let r=t.nodes[n],i=r.spec.tableRole;i&&(e[i]=r)}}return e}var zn=new ne("selectingCells");function Fi(t){for(let e=t.depth-1;e>0;e--)if(t.node(e).type.spec.tableRole=="row")return t.node(0).resolve(t.before(e+1));return null}function st(t){let e=t.selection.$head;for(let n=e.depth;n>0;n--)if(e.node(n).type.spec.tableRole=="row")return!0;return!1}function sa(t){let e=t.selection;if("$anchorCell"in e&&e.$anchorCell)return e.$anchorCell.pos>e.$headCell.pos?e.$anchorCell:e.$headCell;if("node"in e&&e.node&&e.node.type.spec.tableRole=="cell")return e.$anchor;let n=Fi(e.$head)||AM(e.$head);if(n)return n;throw new RangeError(`No cell found around position ${e.head}`)}function AM(t){for(let e=t.nodeAfter,n=t.pos;e;e=e.firstChild,n++){let r=e.type.spec.tableRole;if(r=="cell"||r=="header_cell")return t.doc.resolve(n)}for(let e=t.nodeBefore,n=t.pos;e;e=e.lastChild,n--){let r=e.type.spec.tableRole;if(r=="cell"||r=="header_cell")return t.doc.resolve(n-e.nodeSize)}}function cf(t){return t.parent.type.spec.tableRole=="row"&&!!t.nodeAfter}function vM(t){return t.node(0).resolve(t.pos+t.nodeAfter.nodeSize)}function pf(t,e){return t.depth==e.depth&&t.pos>=e.start(-1)&&t.pos<=e.end(-1)}function fk(t,e,n){let r=t.node(-1),i=re.get(r),o=t.start(-1),s=i.nextCell(t.pos-o,e,n);return s==null?null:t.node(0).resolve(o+s)}function br(t,e,n=1){let r={...t,colspan:t.colspan-n};return r.colwidth&&(r.colwidth=r.colwidth.slice(),r.colwidth.splice(e,n),r.colwidth.some(i=>i>0)||(r.colwidth=null)),r}function EM(t,e,n=1){let r={...t,colspan:t.colspan+n};if(r.colwidth){r.colwidth=r.colwidth.slice();for(let i=0;i<n;i++)r.colwidth.splice(e,0,0)}return r}function OM(t,e,n){let r=dt(e.type.schema).header_cell;for(let i=0;i<t.height;i++)if(e.nodeAt(t.map[n+i*t.width]).type!=r)return!1;return!0}var se=class ln extends _{constructor(e,n=e){let r=e.node(-1),i=re.get(r),o=e.start(-1),s=i.rectBetween(e.pos-o,n.pos-o),l=e.node(0),a=i.cellsInRect(s).filter(c=>c!=n.pos-o);a.unshift(n.pos-o);let u=a.map(c=>{let f=r.nodeAt(c);if(!f)throw new RangeError(`No cell with offset ${c} found`);let h=o+c+1;return new Sn(l.resolve(h),l.resolve(h+f.content.size))});super(u[0].$from,u[0].$to,u),this.$anchorCell=e,this.$headCell=n}map(e,n){let r=e.resolve(n.map(this.$anchorCell.pos)),i=e.resolve(n.map(this.$headCell.pos));if(cf(r)&&cf(i)&&pf(r,i)){let o=this.$anchorCell.node(-1)!=r.node(-1);return o&&this.isRowSelection()?ln.rowSelection(r,i):o&&this.isColSelection()?ln.colSelection(r,i):new ln(r,i)}return j.between(r,i)}content(){let e=this.$anchorCell.node(-1),n=re.get(e),r=this.$anchorCell.start(-1),i=n.rectBetween(this.$anchorCell.pos-r,this.$headCell.pos-r),o={},s=[];for(let a=i.top;a<i.bottom;a++){let u=[];for(let c=a*n.width+i.left,f=i.left;f<i.right;f++,c++){let h=n.map[c];if(o[h])continue;o[h]=!0;let p=n.findCell(h),d=e.nodeAt(h);if(!d)throw new RangeError(`No cell with offset ${h} found`);let m=i.left-p.left,y=p.right-i.right;if(m>0||y>0){let g=d.attrs;if(m>0&&(g=br(g,0,m)),y>0&&(g=br(g,g.colspan-y,y)),p.left<i.left){if(d=d.type.createAndFill(g),!d)throw new RangeError(`Could not create cell with attrs ${JSON.stringify(g)}`)}else d=d.type.create(g,d.content)}if(p.top<i.top||p.bottom>i.bottom){let g={...d.attrs,rowspan:Math.min(p.bottom,i.bottom)-Math.max(p.top,i.top)};p.top<i.top?d=d.type.createAndFill(g):d=d.type.create(g,d.content)}u.push(d)}s.push(e.child(a).copy(A.from(u)))}let l=this.isColSelection()&&this.isRowSelection()?e:s;return new E(A.from(l),1,1)}replace(e,n=E.empty){let r=e.steps.length,i=this.ranges;for(let s=0;s<i.length;s++){let{$from:l,$to:a}=i[s],u=e.mapping.slice(r);e.replace(u.map(l.pos),u.map(a.pos),s?E.empty:n)}let o=_.findFrom(e.doc.resolve(e.mapping.slice(r).map(this.to)),-1);o&&e.setSelection(o)}replaceWith(e,n){this.replace(e,new E(A.from(n),0,0))}forEachCell(e){let n=this.$anchorCell.node(-1),r=re.get(n),i=this.$anchorCell.start(-1),o=r.cellsInRect(r.rectBetween(this.$anchorCell.pos-i,this.$headCell.pos-i));for(let s=0;s<o.length;s++)e(n.nodeAt(o[s]),i+o[s])}isColSelection(){let e=this.$anchorCell.index(-1),n=this.$headCell.index(-1);if(Math.min(e,n)>0)return!1;let r=e+this.$anchorCell.nodeAfter.attrs.rowspan,i=n+this.$headCell.nodeAfter.attrs.rowspan;return Math.max(r,i)==this.$headCell.node(-1).childCount}static colSelection(e,n=e){let r=e.node(-1),i=re.get(r),o=e.start(-1),s=i.findCell(e.pos-o),l=i.findCell(n.pos-o),a=e.node(0);return s.top<=l.top?(s.top>0&&(e=a.resolve(o+i.map[s.left])),l.bottom<i.height&&(n=a.resolve(o+i.map[i.width*(i.height-1)+l.right-1]))):(l.top>0&&(n=a.resolve(o+i.map[l.left])),s.bottom<i.height&&(e=a.resolve(o+i.map[i.width*(i.height-1)+s.right-1]))),new ln(e,n)}isRowSelection(){let e=this.$anchorCell.node(-1),n=re.get(e),r=this.$anchorCell.start(-1),i=n.colCount(this.$anchorCell.pos-r),o=n.colCount(this.$headCell.pos-r);if(Math.min(i,o)>0)return!1;let s=i+this.$anchorCell.nodeAfter.attrs.colspan,l=o+this.$headCell.nodeAfter.attrs.colspan;return Math.max(s,l)==n.width}eq(e){return e instanceof ln&&e.$anchorCell.pos==this.$anchorCell.pos&&e.$headCell.pos==this.$headCell.pos}static rowSelection(e,n=e){let r=e.node(-1),i=re.get(r),o=e.start(-1),s=i.findCell(e.pos-o),l=i.findCell(n.pos-o),a=e.node(0);return s.left<=l.left?(s.left>0&&(e=a.resolve(o+i.map[s.top*i.width])),l.right<i.width&&(n=a.resolve(o+i.map[i.width*(l.top+1)-1]))):(l.left>0&&(n=a.resolve(o+i.map[l.top*i.width])),s.right<i.width&&(e=a.resolve(o+i.map[i.width*(s.top+1)-1]))),new ln(e,n)}toJSON(){return{type:"cell",anchor:this.$anchorCell.pos,head:this.$headCell.pos}}static fromJSON(e,n){return new ln(e.resolve(n.anchor),e.resolve(n.head))}static create(e,n,r=n){return new ln(e.resolve(n),e.resolve(r))}getBookmark(){return new RM(this.$anchorCell.pos,this.$headCell.pos)}};se.prototype.visible=!1;_.jsonID("cell",se);var RM=class hk{constructor(e,n){this.anchor=e,this.head=n}map(e){return new hk(e.map(this.anchor),e.map(this.head))}resolve(e){let n=e.resolve(this.anchor),r=e.resolve(this.head);return n.parent.type.spec.tableRole=="row"&&r.parent.type.spec.tableRole=="row"&&n.index()<n.parent.childCount&&r.index()<r.parent.childCount&&pf(n,r)?new se(n,r):_.near(r,1)}};function DM(t){if(!(t.selection instanceof se))return null;let e=[];return t.selection.forEachCell((n,r)=>{e.push(ye.node(r,r+n.nodeSize,{class:"selectedCell"}))}),ae.create(t.doc,e)}function PM({$from:t,$to:e}){if(t.pos==e.pos||t.pos<e.pos-6)return!1;let n=t.pos,r=e.pos,i=t.depth;for(;i>=0&&!(t.after(i+1)<t.end(i));i--,n++);for(let o=e.depth;o>=0&&!(e.before(o+1)>e.start(o));o--,r--);return n==r&&/row|table/.test(t.node(i).type.spec.tableRole)}function LM({$from:t,$to:e}){let n,r;for(let i=t.depth;i>0;i--){let o=t.node(i);if(o.type.spec.tableRole==="cell"||o.type.spec.tableRole==="header_cell"){n=o;break}}for(let i=e.depth;i>0;i--){let o=e.node(i);if(o.type.spec.tableRole==="cell"||o.type.spec.tableRole==="header_cell"){r=o;break}}return n!==r&&e.parentOffset===0}function zM(t,e,n){let r=(e||t).selection,i=(e||t).doc,o,s;if(r instanceof H&&(s=r.node.type.spec.tableRole)){if(s=="cell"||s=="header_cell")o=se.create(i,r.from);else if(s=="row"){let l=i.resolve(r.from+1);o=se.rowSelection(l,l)}else if(!n){let l=re.get(r.node),a=r.from+1,u=a+l.map[l.width*l.height-1];o=se.create(i,a+1,u)}}else r instanceof j&&PM(r)?o=j.create(i,r.from):r instanceof j&&LM(r)&&(o=j.create(i,r.$from.start(),r.$from.end()));return o&&(e||(e=t.tr)).setSelection(o),e}var BM=new ne("fix-tables");function pk(t,e,n,r){let i=t.childCount,o=e.childCount;e:for(let s=0,l=0;s<o;s++){let a=e.child(s);for(let u=l,c=Math.min(i,s+3);u<c;u++)if(t.child(u)==a){l=u+1,n+=a.nodeSize;continue e}r(a,n),l<i&&t.child(l).sameMarkup(a)?pk(t.child(l),a,n+1,r):a.nodesBetween(0,a.content.size,r,n+1),n+=a.nodeSize}}function FM(t,e){let n,r=(i,o)=>{i.type.spec.tableRole=="table"&&(n=_M(t,i,o,n))};return e?e.doc!=t.doc&&pk(e.doc,t.doc,0,r):t.doc.descendants(r),n}function _M(t,e,n,r){let i=re.get(e);if(!i.problems)return r;r||(r=t.tr);let o=[];for(let a=0;a<i.height;a++)o.push(0);for(let a=0;a<i.problems.length;a++){let u=i.problems[a];if(u.type=="collision"){let c=e.nodeAt(u.pos);if(!c)continue;let f=c.attrs;for(let h=0;h<f.rowspan;h++)o[u.row+h]+=u.n;r.setNodeMarkup(r.mapping.map(n+1+u.pos),null,br(f,f.colspan-u.n,u.n))}else if(u.type=="missing")o[u.row]+=u.n;else if(u.type=="overlong_rowspan"){let c=e.nodeAt(u.pos);if(!c)continue;r.setNodeMarkup(r.mapping.map(n+1+u.pos),null,{...c.attrs,rowspan:c.attrs.rowspan-u.n})}else if(u.type=="colwidth mismatch"){let c=e.nodeAt(u.pos);if(!c)continue;r.setNodeMarkup(r.mapping.map(n+1+u.pos),null,{...c.attrs,colwidth:u.colwidth})}else if(u.type=="zero_sized"){let c=r.mapping.map(n);r.delete(c,c+e.nodeSize)}}let s,l;for(let a=0;a<o.length;a++)o[a]&&(s==null&&(s=a),l=a);for(let a=0,u=n+1;a<i.height;a++){let c=e.child(a),f=u+c.nodeSize,h=o[a];if(h>0){let p="cell";c.firstChild&&(p=c.firstChild.type.spec.tableRole);let d=[];for(let y=0;y<h;y++){let g=dt(t.schema)[p].createAndFill();g&&d.push(g)}let m=(a==0||s==a-1)&&l==a?u+1:f-1;r.insert(r.mapping.map(m),d)}u=f}return r.setMeta(BM,{fixTables:!0})}function dk(t){let e=re.get(t),n=[],r=e.height,i=e.width;for(let o=0;o<r;o++){let s=[];for(let l=0;l<i;l++){let a=o*i+l,u=e.map[a];if(o>0){let c=a-i;if(u===e.map[c]){s.push(null);continue}}if(l>0){let c=a-1;if(u===e.map[c]){s.push(null);continue}}s.push(t.nodeAt(u))}n.push(s)}return n}function mk(t,e){let n=[],r=re.get(t),i=r.height,o=r.width;for(let s=0;s<i;s++){let l=t.child(s),a=[];for(let c=0;c<o;c++){let f=e[s][c];if(!f)continue;let h=r.map[s*r.width+c],p=t.nodeAt(h);if(!p)continue;let d=p.type.createChecked(f.attrs,f.content,f.marks);a.push(d)}let u=l.type.createChecked(l.attrs,a,l.marks);n.push(u)}return t.type.createChecked(t.attrs,n,t.marks)}function gk(t,e,n,r){let i=e[0]>n[0]?-1:1,o=t.splice(e[0],e.length),s=o.length%2===0?1:0,l;return r===-1&&i===1?l=n[0]-1:r===1&&i===-1?l=n[n.length-1]-s+1:l=i===-1?n[0]:n[n.length-1]-s,t.splice(l,0,...o),t}function _i(t){return $M(e=>e.type.spec.tableRole==="table",t)}function $M(t,e){for(let n=e.depth;n>=0;n-=1){let r=e.node(n);if(t(r))return{node:r,pos:n===0?0:e.before(n),start:e.start(n),depth:n}}return null}function zi(t,e){let n=_i(e.$from);if(!n)return;let r=re.get(n.node);if(!(t<0||t>r.width-1))return r.cellsInRect({left:t,right:t+1,top:0,bottom:r.height}).map(i=>{let o=n.node.nodeAt(i),s=i+n.start;return{pos:s,start:s+1,node:o,depth:n.depth+2}})}function Bi(t,e){let n=_i(e.$from);if(!n)return;let r=re.get(n.node);if(!(t<0||t>r.height-1))return r.cellsInRect({left:0,right:r.width,top:t,bottom:t+1}).map(i=>{let o=n.node.nodeAt(i),s=i+n.start;return{pos:s,start:s+1,node:o,depth:n.depth+2}})}function Zy(t,e,n=e){let r=e,i=n;for(let c=e;c>=0;c--){let f=zi(c,t.selection);f&&f.forEach(h=>{let p=h.node.attrs.colspan+c-1;p>=r&&(r=c),p>i&&(i=p)})}for(let c=e;c<=i;c++){let f=zi(c,t.selection);f&&f.forEach(h=>{let p=h.node.attrs.colspan+c-1;h.node.attrs.colspan>1&&p>i&&(i=p)})}let o=[];for(let c=r;c<=i;c++){let f=zi(c,t.selection);f&&f.length>0&&o.push(c)}r=o[0],i=o[o.length-1];let s=zi(r,t.selection),l=Bi(0,t.selection);if(!s||!l)return;let a=t.doc.resolve(s[s.length-1].pos),u;for(let c=i;c>=r;c--){let f=zi(c,t.selection);if(f&&f.length>0){for(let h=l.length-1;h>=0;h--)if(l[h].pos===f[0].pos){u=f[0];break}if(u)break}}if(u)return{$anchor:a,$head:t.doc.resolve(u.pos),indexes:o}}function ek(t,e,n=e){let r=e,i=n;for(let c=e;c>=0;c--){let f=Bi(c,t.selection);f&&f.forEach(h=>{let p=h.node.attrs.rowspan+c-1;p>=r&&(r=c),p>i&&(i=p)})}for(let c=e;c<=i;c++){let f=Bi(c,t.selection);f&&f.forEach(h=>{let p=h.node.attrs.rowspan+c-1;h.node.attrs.rowspan>1&&p>i&&(i=p)})}let o=[];for(let c=r;c<=i;c++){let f=Bi(c,t.selection);f&&f.length>0&&o.push(c)}r=o[0],i=o[o.length-1];let s=Bi(r,t.selection),l=zi(0,t.selection);if(!s||!l)return;let a=t.doc.resolve(s[s.length-1].pos),u;for(let c=i;c>=r;c--){let f=Bi(c,t.selection);if(f&&f.length>0){for(let h=l.length-1;h>=0;h--)if(l[h].pos===f[0].pos){u=f[0];break}if(u)break}}if(u)return{$anchor:a,$head:t.doc.resolve(u.pos),indexes:o}}function tk(t){return t[0].map((e,n)=>t.map(r=>r[n]))}function VM(t){var e,n;let{tr:r,originIndex:i,targetIndex:o,select:s,pos:l}=t,a=_i(r.doc.resolve(l));if(!a)return!1;let u=(e=Zy(r,i))===null||e===void 0?void 0:e.indexes,c=(n=Zy(r,o))===null||n===void 0?void 0:n.indexes;if(!u||!c||u.includes(o))return!1;let f=jM(a.node,u,c,0);if(r.replaceWith(a.pos,a.pos+a.node.nodeSize,f),!s)return!0;let h=re.get(f),p=a.start,d=o,m=h.positionAt(h.height-1,d,f),y=r.doc.resolve(p+m),g=h.positionAt(0,d,f),M=r.doc.resolve(p+g);return r.setSelection(se.colSelection(y,M)),!0}function jM(t,e,n,r){let i=tk(dk(t));return i=gk(i,e,n,r),i=tk(i),mk(t,i)}function HM(t){var e,n;let{tr:r,originIndex:i,targetIndex:o,select:s,pos:l}=t,a=_i(r.doc.resolve(l));if(!a)return!1;let u=(e=ek(r,i))===null||e===void 0?void 0:e.indexes,c=(n=ek(r,o))===null||n===void 0?void 0:n.indexes;if(!u||!c||u.includes(o))return!1;let f=WM(a.node,u,c,0);if(r.replaceWith(a.pos,a.pos+a.node.nodeSize,f),!s)return!0;let h=re.get(f),p=a.start,d=o,m=h.positionAt(d,h.width-1,f),y=r.doc.resolve(p+m),g=h.positionAt(d,0,f),M=r.doc.resolve(p+g);return r.setSelection(se.rowSelection(y,M)),!0}function WM(t,e,n,r){let i=dk(t);return i=gk(i,e,n,r),mk(t,i)}function an(t){let e=t.selection,n=sa(t),r=n.node(-1),i=n.start(-1),o=re.get(r);return{...e instanceof se?o.rectBetween(e.$anchorCell.pos-i,e.$headCell.pos-i):o.findCell(n.pos-i),tableStart:i,map:o,table:r}}function yk(t,{map:e,tableStart:n,table:r},i){let o=i>0?-1:0;OM(e,r,i+o)&&(o=i==0||i==e.width?null:0);for(let s=0;s<e.height;s++){let l=s*e.width+i;if(i>0&&i<e.width&&e.map[l-1]==e.map[l]){let a=e.map[l],u=r.nodeAt(a);t.setNodeMarkup(t.mapping.map(n+a),null,EM(u.attrs,i-e.colCount(a))),s+=u.attrs.rowspan-1}else{let a=o==null?dt(r.type.schema).cell:r.nodeAt(e.map[l+o]).type,u=e.positionAt(s,i,r);t.insert(t.mapping.map(n+u),a.createAndFill())}}return t}function kk(t,e){if(!st(t))return!1;if(e){let n=an(t);e(yk(t.tr,n,n.left))}return!0}function xk(t,e){if(!st(t))return!1;if(e){let n=an(t);e(yk(t.tr,n,n.right))}return!0}function qM(t,{map:e,table:n,tableStart:r},i){let o=t.mapping.maps.length;for(let s=0;s<e.height;){let l=s*e.width+i,a=e.map[l],u=n.nodeAt(a),c=u.attrs;if(i>0&&e.map[l-1]==a||i<e.width-1&&e.map[l+1]==a)t.setNodeMarkup(t.mapping.slice(o).map(r+a),null,br(c,i-e.colCount(a)));else{let f=t.mapping.slice(o).map(r+a);t.delete(f,f+u.nodeSize)}s+=c.rowspan}}function bk(t,e){if(!st(t))return!1;if(e){let n=an(t),r=t.tr;if(n.left==0&&n.right==n.map.width)return!1;for(let i=n.right-1;qM(r,n,i),i!=n.left;i--){let o=n.tableStart?r.doc.nodeAt(n.tableStart-1):r.doc;if(!o)throw new RangeError("No table found");n.table=o,n.map=re.get(o)}e(r)}return!0}function KM(t,{map:e,table:n,tableStart:r},i){let o=0;for(let u=0;u<i;u++)o+=n.child(u).nodeSize;let s=o+n.child(i).nodeSize,l=t.mapping.maps.length;t.delete(o+r,s+r);let a=new Set;for(let u=0,c=i*e.width;u<e.width;u++,c++){let f=e.map[c];if(!a.has(f)){if(a.add(f),i>0&&f==e.map[c-e.width]){let h=n.nodeAt(f).attrs;t.setNodeMarkup(t.mapping.slice(l).map(f+r),null,{...h,rowspan:h.rowspan-1}),u+=h.colspan-1}else if(i<e.height&&f==e.map[c+e.width]){let h=n.nodeAt(f),p=h.attrs,d=h.type.create({...p,rowspan:h.attrs.rowspan-1},h.content),m=e.positionAt(i+1,u,n);t.insert(t.mapping.slice(l).map(r+m),d),u+=p.colspan-1}}}}function wk(t,e){if(!st(t))return!1;if(e){let n=an(t),r=t.tr;if(n.top==0&&n.bottom==n.map.height)return!1;for(let i=n.bottom-1;KM(r,n,i),i!=n.top;i--){let o=n.tableStart?r.doc.nodeAt(n.tableStart-1):r.doc;if(!o)throw new RangeError("No table found");n.table=o,n.map=re.get(n.table)}e(r)}return!0}function Ck(t,e){return function(n,r){if(!st(n))return!1;let i=sa(n);if(i.nodeAfter.attrs[t]===e)return!1;if(r){let o=n.tr;n.selection instanceof se?n.selection.forEachCell((s,l)=>{s.attrs[t]!==e&&o.setNodeMarkup(l,null,{...s.attrs,[t]:e})}):o.setNodeMarkup(i.pos,null,{...i.nodeAfter.attrs,[t]:e}),r(o)}return!0}}function JM(t){return function(e,n){if(!st(e))return!1;if(n){let r=dt(e.schema),i=an(e),o=e.tr,s=i.map.cellsInRect(t=="column"?{left:i.left,top:0,right:i.right,bottom:i.map.height}:t=="row"?{left:0,top:i.top,right:i.map.width,bottom:i.bottom}:i),l=s.map(a=>i.table.nodeAt(a));for(let a=0;a<s.length;a++)l[a].type==r.header_cell&&o.setNodeMarkup(i.tableStart+s[a],r.cell,l[a].attrs);if(o.steps.length===0)for(let a=0;a<s.length;a++)o.setNodeMarkup(i.tableStart+s[a],r.header_cell,l[a].attrs);n(o)}return!0}}function nk(t,e,n){let r=e.map.cellsInRect({left:0,top:0,right:t=="row"?e.map.width:1,bottom:t=="column"?e.map.height:1});for(let i=0;i<r.length;i++){let o=e.table.nodeAt(r[i]);if(o&&o.type!==n.header_cell)return!1}return!0}function df(t,e){return e=e||{useDeprecatedLogic:!1},e.useDeprecatedLogic?JM(t):function(n,r){if(!st(n))return!1;if(r){let i=dt(n.schema),o=an(n),s=n.tr,l=nk("row",o,i),a=nk("column",o,i),u=(t==="column"?l:t==="row"&&a)?1:0,c=t=="column"?{left:0,top:u,right:1,bottom:o.map.height}:t=="row"?{left:u,top:0,right:o.map.width,bottom:1}:o,f=t=="column"?a?i.cell:i.header_cell:t=="row"?l?i.cell:i.header_cell:i.cell;o.map.cellsInRect(c).forEach(h=>{let p=h+o.tableStart,d=s.doc.nodeAt(p);d&&s.setNodeMarkup(p,f,d.attrs)}),r(s)}return!0}}var Hz=df("row",{useDeprecatedLogic:!0}),Wz=df("column",{useDeprecatedLogic:!0}),qz=df("cell",{useDeprecatedLogic:!0});function UM(t,e){if(e<0){let n=t.nodeBefore;if(n)return t.pos-n.nodeSize;for(let r=t.index(-1)-1,i=t.before();r>=0;r--){let o=t.node(-1).child(r),s=o.lastChild;if(s)return i-1-s.nodeSize;i-=o.nodeSize}}else{if(t.index()<t.parent.childCount-1)return t.pos+t.nodeAfter.nodeSize;let n=t.node(-1);for(let r=t.indexAfter(-1),i=t.after();r<n.childCount;r++){let o=n.child(r);if(o.childCount)return i+1;i+=o.nodeSize}}return null}function mf(t){return function(e,n){if(!st(e))return!1;let r=UM(sa(e),t);if(r==null)return!1;if(n){let i=e.doc.resolve(r);n(e.tr.setSelection(j.between(i,vM(i))).scrollIntoView())}return!0}}function Sk(t,e){let n=t.selection.$anchor;for(let r=n.depth;r>0;r--)if(n.node(r).type.spec.tableRole=="table")return e&&e(t.tr.delete(n.before(r),n.after(r)).scrollIntoView()),!0;return!1}function ta(t,e){let n=t.selection;if(!(n instanceof se))return!1;if(e){let r=t.tr,i=dt(t.schema).cell.createAndFill().content;n.forEachCell((o,s)=>{o.content.eq(i)||r.replace(r.mapping.map(s+1),r.mapping.map(s+o.nodeSize-1),new E(i,0,0))}),r.docChanged&&e(r)}return!0}function Mk(t){return(e,n)=>{let{from:r,to:i,select:o=!0,pos:s=e.selection.from}=t,l=e.tr;return HM({tr:l,originIndex:r,targetIndex:i,select:o,pos:s})?(n?.(l),!0):!1}}function Nk(t){return(e,n)=>{let{from:r,to:i,select:o=!0,pos:s=e.selection.from}=t,l=e.tr;return VM({tr:l,originIndex:r,targetIndex:i,select:o,pos:s})?(n?.(l),!0):!1}}function GM(t){if(t.size===0)return null;let{content:e,openStart:n,openEnd:r}=t;for(;e.childCount==1&&(n>0&&r>0||e.child(0).type.spec.tableRole=="table");)n--,r--,e=e.child(0).content;let i=e.child(0),o=i.type.spec.tableRole,s=i.type.schema,l=[];if(o=="row")for(let a=0;a<e.childCount;a++){let u=e.child(a).content,c=a?0:Math.max(0,n-1),f=a<e.childCount-1?0:Math.max(0,r-1);(c||f)&&(u=ff(dt(s).row,new E(u,c,f)).content),l.push(u)}else if(o=="cell"||o=="header_cell")l.push(n||r?ff(dt(s).row,new E(e,n,r)).content:e);else return null;return QM(s,l)}function QM(t,e){let n=[];for(let i=0;i<e.length;i++){let o=e[i];for(let s=o.childCount-1;s>=0;s--){let{rowspan:l,colspan:a}=o.child(s).attrs;for(let u=i;u<i+l;u++)n[u]=(n[u]||0)+a}}let r=0;for(let i=0;i<n.length;i++)r=Math.max(r,n[i]);for(let i=0;i<n.length;i++)if(i>=e.length&&e.push(A.empty),n[i]<r){let o=dt(t).cell.createAndFill(),s=[];for(let l=n[i];l<r;l++)s.push(o);e[i]=e[i].append(A.from(s))}return{height:e.length,width:r,rows:e}}function ff(t,e){let n=t.createAndFill();return new Qr(n).replace(0,n.content.size,e).doc}function YM({width:t,height:e,rows:n},r,i){if(t!=r){let o=[],s=[];for(let l=0;l<n.length;l++){let a=n[l],u=[];for(let c=o[l]||0,f=0;c<r;f++){let h=a.child(f%a.childCount);c+h.attrs.colspan>r&&(h=h.type.createChecked(br(h.attrs,h.attrs.colspan,c+h.attrs.colspan-r),h.content)),u.push(h),c+=h.attrs.colspan;for(let p=1;p<h.attrs.rowspan;p++)o[l+p]=(o[l+p]||0)+h.attrs.colspan}s.push(A.from(u))}n=s,t=r}if(e!=i){let o=[];for(let s=0,l=0;s<i;s++,l++){let a=[],u=n[l%e];for(let c=0;c<u.childCount;c++){let f=u.child(c);s+f.attrs.rowspan>i&&(f=f.type.create({...f.attrs,rowspan:Math.max(1,i-f.attrs.rowspan)},f.content)),a.push(f)}o.push(A.from(a))}n=o,e=i}return{width:t,height:e,rows:n}}function XM(t,e,n,r,i,o,s){let l=t.doc.type.schema,a=dt(l),u,c;if(i>e.width)for(let f=0,h=0;f<e.height;f++){let p=n.child(f);h+=p.nodeSize;let d=[],m;p.lastChild==null||p.lastChild.type==a.cell?m=u||(u=a.cell.createAndFill()):m=c||(c=a.header_cell.createAndFill());for(let y=e.width;y<i;y++)d.push(m);t.insert(t.mapping.slice(s).map(h-1+r),d)}if(o>e.height){let f=[];for(let d=0,m=(e.height-1)*e.width;d<Math.max(e.width,i);d++){let y=d>=e.width?!1:n.nodeAt(e.map[m+d]).type==a.header_cell;f.push(y?c||(c=a.header_cell.createAndFill()):u||(u=a.cell.createAndFill()))}let h=a.row.create(null,A.from(f)),p=[];for(let d=e.height;d<o;d++)p.push(h);t.insert(t.mapping.slice(s).map(r+n.nodeSize-2),p)}return!!(u||c)}function rk(t,e,n,r,i,o,s,l){if(s==0||s==e.height)return!1;let a=!1;for(let u=i;u<o;u++){let c=s*e.width+u,f=e.map[c];if(e.map[c-e.width]==f){a=!0;let h=n.nodeAt(f),{top:p,left:d}=e.findCell(f);t.setNodeMarkup(t.mapping.slice(l).map(f+r),null,{...h.attrs,rowspan:s-p}),t.insert(t.mapping.slice(l).map(e.positionAt(s,d,n)),h.type.createAndFill({...h.attrs,rowspan:p+h.attrs.rowspan-s})),u+=h.attrs.colspan-1}}return a}function ik(t,e,n,r,i,o,s,l){if(s==0||s==e.width)return!1;let a=!1;for(let u=i;u<o;u++){let c=u*e.width+s,f=e.map[c];if(e.map[c-1]==f){a=!0;let h=n.nodeAt(f),p=e.colCount(f),d=t.mapping.slice(l).map(f+r);t.setNodeMarkup(d,null,br(h.attrs,s-p,h.attrs.colspan-(s-p))),t.insert(d+h.nodeSize,h.type.createAndFill(br(h.attrs,0,s-p))),u+=h.attrs.rowspan-1}}return a}function ok(t,e,n,r,i){let o=n?t.doc.nodeAt(n-1):t.doc;if(!o)throw new Error("No table found");let s=re.get(o),{top:l,left:a}=r,u=a+i.width,c=l+i.height,f=t.tr,h=0;function p(){if(o=n?f.doc.nodeAt(n-1):f.doc,!o)throw new Error("No table found");s=re.get(o),h=f.mapping.maps.length}XM(f,s,o,n,u,c,h)&&p(),rk(f,s,o,n,a,u,l,h)&&p(),rk(f,s,o,n,a,u,c,h)&&p(),ik(f,s,o,n,l,c,a,h)&&p(),ik(f,s,o,n,l,c,u,h)&&p();for(let d=l;d<c;d++){let m=s.positionAt(d,a,o),y=s.positionAt(d,u,o);f.replace(f.mapping.slice(h).map(m+n),f.mapping.slice(h).map(y+n),new E(i.rows[d-l],0,0))}p(),f.setSelection(new se(f.doc.resolve(n+s.positionAt(l,a,o)),f.doc.resolve(n+s.positionAt(c-1,u-1,o)))),e(f)}var ZM=Fu({ArrowLeft:na("horiz",-1),ArrowRight:na("horiz",1),ArrowUp:na("vert",-1),ArrowDown:na("vert",1),"Shift-ArrowLeft":ra("horiz",-1),"Shift-ArrowRight":ra("horiz",1),"Shift-ArrowUp":ra("vert",-1),"Shift-ArrowDown":ra("vert",1),Backspace:ta,"Mod-Backspace":ta,Delete:ta,"Mod-Delete":ta});function ia(t,e,n){return n.eq(t.selection)?!1:(e&&e(t.tr.setSelection(n).scrollIntoView()),!0)}function na(t,e){return(n,r,i)=>{if(!i)return!1;let o=n.selection;if(o instanceof se)return ia(n,r,_.near(o.$headCell,e));if(t!="horiz"&&!o.empty)return!1;let s=Ik(i,t,e);if(s==null)return!1;if(t=="horiz")return ia(n,r,_.near(n.doc.resolve(o.head+e),e));{let l=n.doc.resolve(s),a=fk(l,t,e),u;return a?u=_.near(a,1):e<0?u=_.near(n.doc.resolve(l.before(-1)),-1):u=_.near(n.doc.resolve(l.after(-1)),1),ia(n,r,u)}}}function ra(t,e){return(n,r,i)=>{if(!i)return!1;let o=n.selection,s;if(o instanceof se)s=o;else{let a=Ik(i,t,e);if(a==null)return!1;s=new se(n.doc.resolve(a))}let l=fk(s.$headCell,t,e);return l?ia(n,r,new se(s.$anchorCell,l)):!1}}function eN(t,e){let n=t.state.doc,r=Fi(n.resolve(e));return r?(t.dispatch(t.state.tr.setSelection(new se(r))),!0):!1}function tN(t,e,n){if(!st(t.state))return!1;let r=GM(n),i=t.state.selection;if(i instanceof se){r||(r={width:1,height:1,rows:[A.from(ff(dt(t.state.schema).cell,n))]});let o=i.$anchorCell.node(-1),s=i.$anchorCell.start(-1),l=re.get(o).rectBetween(i.$anchorCell.pos-s,i.$headCell.pos-s);return r=YM(r,l.right-l.left,l.bottom-l.top),ok(t.state,t.dispatch,s,l,r),!0}else if(r){let o=sa(t.state),s=o.start(-1);return ok(t.state,t.dispatch,s,re.get(o.node(-1)).findCell(o.pos-s),r),!0}else return!1}function nN(t,e){var n;if(e.button!=0||e.ctrlKey||e.metaKey)return;let r=sk(t,e.target),i;if(e.shiftKey&&t.state.selection instanceof se)o(t.state.selection.$anchorCell,e),e.preventDefault();else if(e.shiftKey&&r&&(i=Fi(t.state.selection.$anchor))!=null&&((n=lf(t,e))===null||n===void 0?void 0:n.pos)!=i.pos)o(i,e),e.preventDefault();else if(!r)return;function o(a,u){let c=lf(t,u),f=zn.getState(t.state)==null;if(!c||!pf(a,c))if(f)c=a;else return;let h=new se(a,c);if(f||!t.state.selection.eq(h)){let p=t.state.tr.setSelection(h);f&&p.setMeta(zn,a.pos),t.dispatch(p)}}function s(){t.root.removeEventListener("mouseup",s),t.root.removeEventListener("dragstart",s),t.root.removeEventListener("mousemove",l),zn.getState(t.state)!=null&&t.dispatch(t.state.tr.setMeta(zn,-1))}function l(a){let u=a,c=zn.getState(t.state),f;if(c!=null)f=t.state.doc.resolve(c);else if(sk(t,u.target)!=r&&(f=lf(t,e),!f))return s();f&&o(f,u)}t.root.addEventListener("mouseup",s),t.root.addEventListener("dragstart",s),t.root.addEventListener("mousemove",l)}function Ik(t,e,n){if(!(t.state.selection instanceof j))return null;let{$head:r}=t.state.selection;for(let i=r.depth-1;i>=0;i--){let o=r.node(i);if((n<0?r.index(i):r.indexAfter(i))!=(n<0?0:o.childCount))return null;if(o.type.spec.tableRole=="cell"||o.type.spec.tableRole=="header_cell"){let s=r.before(i),l=e=="vert"?n>0?"down":"up":n>0?"right":"left";return t.endOfTextblock(l)?s:null}}return null}function sk(t,e){for(;e&&e!=t.dom;e=e.parentNode)if(e.nodeName=="TD"||e.nodeName=="TH")return e;return null}function lf(t,e){let n=t.posAtCoords({left:e.clientX,top:e.clientY});if(!n)return null;let{inside:r,pos:i}=n;return r>=0&&Fi(t.state.doc.resolve(r))||Fi(t.state.doc.resolve(i))}var rN=class{constructor(t,e){this.node=t,this.defaultCellMinWidth=e,this.dom=document.createElement("div"),this.dom.className="tableWrapper",this.table=this.dom.appendChild(document.createElement("table")),this.table.style.setProperty("--default-cell-min-width",`${e}px`),this.colgroup=this.table.appendChild(document.createElement("colgroup")),hf(t,this.colgroup,this.table,e),this.contentDOM=this.table.appendChild(document.createElement("tbody"))}update(t){return t.type!=this.node.type?!1:(this.node=t,hf(t,this.colgroup,this.table,this.defaultCellMinWidth),!0)}ignoreMutation(t){return t.type=="attributes"&&(t.target==this.table||this.colgroup.contains(t.target))}};function hf(t,e,n,r,i,o){let s=0,l=!0,a=e.firstChild,u=t.firstChild;if(u){for(let f=0,h=0;f<u.childCount;f++){let{colspan:p,colwidth:d}=u.child(f).attrs;for(let m=0;m<p;m++,h++){let y=i==h?o:d&&d[m],g=y?y+"px":"";if(s+=y||r,y||(l=!1),a)a.style.width!=g&&(a.style.width=g),a=a.nextSibling;else{let M=document.createElement("col");M.style.width=g,e.appendChild(M)}}}for(;a;){var c;let f=a.nextSibling;(c=a.parentNode)===null||c===void 0||c.removeChild(a),a=f}l?(n.style.width=s+"px",n.style.minWidth=""):(n.style.width="",n.style.minWidth=s+"px")}}var ot=new ne("tableColumnResizing");function Tk({handleWidth:t=5,cellMinWidth:e=25,defaultCellMinWidth:n=100,View:r=rN,lastColumnResizable:i=!0}={}){let o=new te({key:ot,state:{init(s,l){var a;let u=(a=o.spec)===null||a===void 0||(a=a.props)===null||a===void 0?void 0:a.nodeViews,c=dt(l.schema).table.name;return r&&u&&(u[c]=(f,h)=>new r(f,n,h)),new iN(-1,!1)},apply(s,l){return l.apply(s)}},props:{attributes:s=>{let l=ot.getState(s);return l&&l.activeHandle>-1?{class:"resize-cursor"}:{}},handleDOMEvents:{mousemove:(s,l)=>{oN(s,l,t,i)},mouseleave:s=>{sN(s)},mousedown:(s,l)=>{lN(s,l,e,n)}},decorations:s=>{let l=ot.getState(s);if(l&&l.activeHandle>-1)return hN(s,l.activeHandle)},nodeViews:{}}});return o}var iN=class oa{constructor(e,n){this.activeHandle=e,this.dragging=n}apply(e){let n=this,r=e.getMeta(ot);if(r&&r.setHandle!=null)return new oa(r.setHandle,!1);if(r&&r.setDragging!==void 0)return new oa(n.activeHandle,r.setDragging);if(n.activeHandle>-1&&e.docChanged){let i=e.mapping.map(n.activeHandle,-1);return cf(e.doc.resolve(i))||(i=-1),new oa(i,n.dragging)}return n}};function oN(t,e,n,r){if(!t.editable)return;let i=ot.getState(t.state);if(i&&!i.dragging){let o=uN(e.target),s=-1;if(o){let{left:l,right:a}=o.getBoundingClientRect();e.clientX-l<=n?s=lk(t,e,"left",n):a-e.clientX<=n&&(s=lk(t,e,"right",n))}if(s!=i.activeHandle){if(!r&&s!==-1){let l=t.state.doc.resolve(s),a=l.node(-1),u=re.get(a),c=l.start(-1);if(u.colCount(l.pos-c)+l.nodeAfter.attrs.colspan-1==u.width-1)return}Ak(t,s)}}}function sN(t){if(!t.editable)return;let e=ot.getState(t.state);e&&e.activeHandle>-1&&!e.dragging&&Ak(t,-1)}function lN(t,e,n,r){var i;if(!t.editable)return!1;let o=(i=t.dom.ownerDocument.defaultView)!==null&&i!==void 0?i:window,s=ot.getState(t.state);if(!s||s.activeHandle==-1||s.dragging)return!1;let l=t.state.doc.nodeAt(s.activeHandle),a=aN(t,s.activeHandle,l.attrs);t.dispatch(t.state.tr.setMeta(ot,{setDragging:{startX:e.clientX,startWidth:a}}));function u(f){o.removeEventListener("mouseup",u),o.removeEventListener("mousemove",c);let h=ot.getState(t.state);h?.dragging&&(cN(t,h.activeHandle,ak(h.dragging,f,n)),t.dispatch(t.state.tr.setMeta(ot,{setDragging:null})))}function c(f){if(!f.which)return u(f);let h=ot.getState(t.state);if(h&&h.dragging){let p=ak(h.dragging,f,n);uk(t,h.activeHandle,p,r)}}return uk(t,s.activeHandle,a,r),o.addEventListener("mouseup",u),o.addEventListener("mousemove",c),e.preventDefault(),!0}function aN(t,e,{colspan:n,colwidth:r}){let i=r&&r[r.length-1];if(i)return i;let o=t.domAtPos(e),s=o.node.childNodes[o.offset].offsetWidth,l=n;if(r)for(let a=0;a<n;a++)r[a]&&(s-=r[a],l--);return s/l}function uN(t){for(;t&&t.nodeName!="TD"&&t.nodeName!="TH";)t=t.classList&&t.classList.contains("ProseMirror")?null:t.parentNode;return t}function lk(t,e,n,r){let i=n=="right"?-r:r,o=t.posAtCoords({left:e.clientX+i,top:e.clientY});if(!o)return-1;let{pos:s}=o,l=Fi(t.state.doc.resolve(s));if(!l)return-1;if(n=="right")return l.pos;let a=re.get(l.node(-1)),u=l.start(-1),c=a.map.indexOf(l.pos-u);return c%a.width==0?-1:u+a.map[c-1]}function ak(t,e,n){let r=e.clientX-t.startX;return Math.max(n,t.startWidth+r)}function Ak(t,e){t.dispatch(t.state.tr.setMeta(ot,{setHandle:e}))}function cN(t,e,n){let r=t.state.doc.resolve(e),i=r.node(-1),o=re.get(i),s=r.start(-1),l=o.colCount(r.pos-s)+r.nodeAfter.attrs.colspan-1,a=t.state.tr;for(let u=0;u<o.height;u++){let c=u*o.width+l;if(u&&o.map[c]==o.map[c-o.width])continue;let f=o.map[c],h=i.nodeAt(f).attrs,p=h.colspan==1?0:l-o.colCount(f);if(h.colwidth&&h.colwidth[p]==n)continue;let d=h.colwidth?h.colwidth.slice():fN(h.colspan);d[p]=n,a.setNodeMarkup(s+f,null,{...h,colwidth:d})}a.docChanged&&t.dispatch(a)}function uk(t,e,n,r){let i=t.state.doc.resolve(e),o=i.node(-1),s=i.start(-1),l=re.get(o).colCount(i.pos-s)+i.nodeAfter.attrs.colspan-1,a=t.domAtPos(i.start(-1)).node;for(;a&&a.nodeName!="TABLE";)a=a.parentNode;a&&hf(o,a.firstChild,a,r,l,n)}function fN(t){return Array(t).fill(0)}function hN(t,e){let n=[],r=t.doc.resolve(e),i=r.node(-1);if(!i)return ae.empty;let o=re.get(i),s=r.start(-1),l=o.colCount(r.pos-s)+r.nodeAfter.attrs.colspan-1;for(let u=0;u<o.height;u++){let c=l+u*o.width;if((l==o.width-1||o.map[c]!=o.map[c+1])&&(u==0||o.map[c]!=o.map[c-o.width])){var a;let f=o.map[c],h=s+f+i.nodeAt(f).nodeSize-1,p=document.createElement("div");p.className="column-resize-handle",!((a=ot.getState(t))===null||a===void 0)&&a.dragging&&n.push(ye.node(s+f,s+f+i.nodeAt(f).nodeSize,{class:"column-resize-dragging"})),n.push(ye.widget(h,p))}}return ae.create(t.doc,n)}function vk({allowTableNodeSelection:t=!1}={}){return new te({key:zn,state:{init(){return null},apply(e,n){let r=e.getMeta(zn);if(r!=null)return r==-1?null:r;if(n==null||!e.docChanged)return n;let{deleted:i,pos:o}=e.mapping.mapResult(n);return i?null:o}},props:{decorations:DM,handleDOMEvents:{mousedown:nN},createSelectionBetween(e){return zn.getState(e.state)!=null?e.state.selection:null},handleTripleClick:eN,handleKeyDown:ZM,handlePaste:tN},appendTransaction(e,n,r){return zM(r,FM(r,n),t)}})}var la=typeof navigator<"u"?navigator:null,yf=la&&la.userAgent||"",pN=/Edge\/(\d+)/.exec(yf),dN=/MSIE \d/.exec(yf),mN=/Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(yf),gN=!!(dN||mN||pN),yN=!gN&&!!la&&/Apple Computer/.test(la.vendor),Ek=new ne("safari-ime-span"),gf=!1,kN={key:Ek,props:{decorations:xN,handleDOMEvents:{compositionstart:()=>{gf=!0},compositionend:()=>{gf=!1}}}};function xN(t){let{$from:e,$to:n,to:r}=t.selection;if(gf&&e.sameParent(n)){let i=ye.widget(r,bN,{ignoreSelection:!0,key:"safari-ime-span"});return ae.create(t.doc,[i])}}function bN(t){let e=t.dom.ownerDocument.createElement("span");return e.className="ProseMirror-safari-ime-span",e}var Ok=new te(yN?kN:{key:Ek});function kf(t,e){let n=String(t);if(typeof e!="string")throw new TypeError("Expected character");let r=0,i=n.indexOf(e);for(;i!==-1;)r++,i=n.indexOf(e,i+e.length);return r}function xf(t){if(typeof t!="string")throw new TypeError("Expected a string");return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function bf(t,e,n){let i=kn((n||{}).ignore||[]),o=wN(e),s=-1;for(;++s<o.length;)xn(t,l);function l(u,c,f){if(u.type==="text"&&typeof f=="number")return a(u,c,f);if(i(u,f,c[c.length-1]))return ct}function a(u,c,f){let h=c[c.length-1],p=o[s][0],d=o[s][1],m=0,y=!1,g=[];p.lastIndex=0;let M=p.exec(u.value);for(;M;){let T=M.index,R={index:M.index,input:M.input,stack:[...c,u]},C=d(...M,R);if(typeof C=="string"&&(C=C.length>0?{type:"text",value:C}:void 0),C!==!1){if(m!==T&&w({type:"text",value:u.value.slice(m,T)}),Array.isArray(C))for(let L of C)w(L);else C&&w(C);m=T+M[0].length,y=!0}if(C===!1||M[0].length===0){let L=u.value.codePointAt(T)||0;p.lastIndex=T+(/[uv]/.test(p.flags)&&L>65535?2:1)}if(!p.global)break;M=p.exec(u.value)}return y?(m<u.value.length&&w({type:"text",value:u.value.slice(m)}),h.children.splice(f,1,...g)):g=[u],f+g.length;function w(T){let R=g[g.length-1];R&&R.type==="text"&&T.type==="text"?R.value+=T.value:g.push(T)}}}function wN(t){if(!Array.isArray(t))throw new TypeError("Expected find and replace tuple or list of tuples");let e=[],n=!t[0]||Array.isArray(t[0])?t:[t],r=-1;for(;++r<n.length;){let i=n[r];e.push([CN(i[0]),SN(i[1])])}return e}function CN(t){return typeof t=="string"?new RegExp(xf(t),"g"):t}function SN(t){return typeof t=="function"?t:function(){return t}}var wf="phrasing",Cf=["autolink","link","image","label"];function Mf(){return{transforms:[vN],enter:{literalAutolink:MN,literalAutolinkEmail:Sf,literalAutolinkHttp:Sf,literalAutolinkWww:Sf},exit:{literalAutolink:AN,literalAutolinkEmail:TN,literalAutolinkHttp:NN,literalAutolinkWww:IN}}}function Nf(){return{unsafe:[{character:"@",before:"[+\\-.\\w]",after:"[\\-.\\w]",inConstruct:wf,notInConstruct:Cf},{character:".",before:"[Ww]{3}",inConstruct:wf,notInConstruct:Cf},{character:":",before:"[PSps]",after:"\\/",inConstruct:wf,notInConstruct:Cf}]}}function MN(t){this.enter({type:"link",title:null,url:"",children:[],position:void 0},t)}function Sf(t){this.config.enter.autolinkProtocol.call(this,t)}function NN(t){this.config.exit.autolinkProtocol.call(this,t)}function IN(t){this.config.exit.data.call(this,t);let e=this.stack[this.stack.length-1];e.type,e.url="http://"+this.sliceSerialize(t)}function TN(t){this.config.exit.autolinkEmail.call(this,t)}function AN(t){this.exit(t)}function vN(t){bf(t,[[/(?<![\da-z])(https?:\/\/|www(?=\.))([\w-]*\.[\w\-.]*)([^\t\n\r ]*)/gi,EN],[/(?<![\w+\-.@])xmpp:([\w+\-.]+)@([\w-]+(?:\.[\w-]+)+)(\/(?:[\w\-/]|\.(?=[\dA-Za-z]))*)?/g,DN],[/(?<![\w+\-.@])mailto:([\w+\-.]+)@([\w-]+(?:\.[\w-]+)+)/g,RN],[/(?<![\w+\-.]|(?:^|[^\d@A-Za-z])(?:mailto|xmpp):)([\w+\-.]+)@([\w-]+(?:\.[\w-]+)+)/g,ON]],{ignore:["link","linkReference"]})}function EN(t,e,n,r,i){if(!zN(i))return!1;let o="";if(/^w/i.test(e)&&(n=e+n,e="",o="http://"),pn(n.charCodeAt(0))||!PN(n))return!1;let s=LN(n+r),l={type:"link",title:null,url:o+e+s[0],children:[{type:"text",value:e+s[0],position:void 0}],position:void 0};return s[1]?[l,{type:"text",value:s[1],position:void 0}]:l}function ON(t,e,n){return/[\d\-_]$/.test(n)?!1:{type:"link",title:null,url:"mailto:"+e+"@"+n,children:[{type:"text",value:e+"@"+n,position:void 0}],position:void 0}}function RN(t,e,n){if(/[\d\-_]$/.test(n))return!1;let r="mailto:"+e+"@"+n;return{type:"link",title:null,url:r,children:[{type:"text",value:r,position:void 0}],position:void 0}}function DN(t,e,n,r,i){if(/[\d\-_]$/.test(n)||r&&(!/[A-Za-z]$/.test(r)||i.input.charAt(i.index+t.length)==="@"))return!1;let o="xmpp:"+e+"@"+n+(r||"");return{type:"link",title:null,url:o,children:[{type:"text",value:o,position:void 0}],position:void 0}}function PN(t){let e=t.split(".");return!(e.length<2||e[e.length-1]&&(/_/.test(e[e.length-1])||!/[\dA-Za-z]/.test(e[e.length-1]))||e[e.length-2]&&(/_/.test(e[e.length-2])||!/[\dA-Za-z]/.test(e[e.length-2])))}function LN(t){let e=t.length;for(;e>0;){let s=t.charCodeAt(e-1);if(s===33||s===34||s===38||s===39||s===41||s===44||s===46||s===58||s===59||s===60||s===62||s===63||s===93||s===125)e--;else break}if(e===t.length)return[t,void 0];let n=t.slice(e);t=t.slice(0,e);let r=n.indexOf(")"),i=kf(t,"("),o=kf(t,")");for(;r!==-1&&i>o;)t+=n.slice(0,r+1),n=n.slice(r+1),r=n.indexOf(")"),o++;return[t,n]}function zN(t){let e=t.input.charCodeAt(t.index-1);return t.index===0||At(e)||pn(e)}Rk.peek=qN;function BN(){this.buffer()}function FN(t){this.enter({type:"footnoteReference",identifier:"",label:""},t)}function _N(){this.buffer()}function $N(t){this.enter({type:"footnoteDefinition",identifier:"",label:"",children:[]},t)}function VN(t){let e=this.resume(),n=this.stack[this.stack.length-1];n.type,n.identifier=Ae(this.sliceSerialize(t)).toLowerCase(),n.label=e}function jN(t){this.exit(t)}function HN(t){let e=this.resume(),n=this.stack[this.stack.length-1];n.type,n.identifier=Ae(this.sliceSerialize(t)).toLowerCase(),n.label=e}function WN(t){this.exit(t)}function qN(){return"["}function Rk(t,e,n,r){let i=n.createTracker(r),o=i.move("[^"),s=n.enter("footnoteReference"),l=n.enter("reference");return o+=i.move(n.safe(n.associationId(t),{after:"]",before:o})),l(),s(),o+=i.move("]"),o}function If(){return{enter:{gfmFootnoteCallString:BN,gfmFootnoteCall:FN,gfmFootnoteDefinitionLabelString:_N,gfmFootnoteDefinition:$N},exit:{gfmFootnoteCallString:VN,gfmFootnoteCall:jN,gfmFootnoteDefinitionLabelString:HN,gfmFootnoteDefinition:WN}}}function Tf(t){let e=!1;return t&&t.firstLineBlank&&(e=!0),{handlers:{footnoteDefinition:n,footnoteReference:Rk},unsafe:[{character:"[",inConstruct:["label","phrasing","reference"]}]};function n(r,i,o,s){let l=o.createTracker(s),a=l.move("[^"),u=o.enter("footnoteDefinition"),c=o.enter("label");return a+=l.move(o.safe(o.associationId(r),{before:a,after:"]"})),c(),a+=l.move("]:"),r.children&&r.children.length>0&&(l.shift(4),a+=l.move((e?`
`:" ")+o.indentLines(o.containerFlow(r,l.current()),e?Dk:KN))),u(),a}}function KN(t,e,n){return e===0?t:Dk(t,e,n)}function Dk(t,e,n){return(n?"":"    ")+t}var JN=["autolink","destinationLiteral","destinationRaw","reference","titleQuote","titleApostrophe"];Ef.attention=QN;Ef.peek=YN;function Af(){return{canContainEols:["delete"],enter:{strikethrough:UN},exit:{strikethrough:GN}}}function vf(){return{handlers:{delete:Ef},unsafe:[{character:"~",inConstruct:"phrasing",notInConstruct:JN}]}}function UN(t){this.enter({type:"delete",children:[],position:void 0},t)}function GN(t){this.exit(t)}function Ef(t,e,n,r){let i=n.createTracker(r),o=n.stack.includes("strikethrough")?"~":"~~",s=n.enter("strikethrough"),l=i.move(o);return l+=n.containerPhrasing(t,{...i.current(),before:l,after:"~"}),l+=i.move(o),s(),l}function QN(){return{construct:"strikethrough",markers:["~"],sizes:[2,1]}}function YN(){return"~"}function XN(t){return t.length}function Lk(t,e){let n=e||{},r=(n.align||[]).concat(),i=n.stringLength||XN,o=[],s=[],l=[],a=[],u=0,c=-1;for(;++c<t.length;){let m=[],y=[],g=-1;for(t[c].length>u&&(u=t[c].length);++g<t[c].length;){let M=ZN(t[c][g]);if(n.alignDelimiters!==!1){let w=i(M);y[g]=w,(a[g]===void 0||w>a[g])&&(a[g]=w)}m.push(M)}s[c]=m,l[c]=y}let f=-1;if(typeof r=="object"&&"length"in r)for(;++f<u;)o[f]=Pk(r[f]);else{let m=Pk(r);for(;++f<u;)o[f]=m}f=-1;let h=[],p=[];for(;++f<u;){let m=o[f],y="",g="";m===99?(y=":",g=":"):m===108?y=":":m===114&&(g=":");let M=n.alignDelimiters===!1?1:Math.max(1,a[f]-y.length-g.length),w=y+"-".repeat(M)+g;n.alignDelimiters!==!1&&(M=y.length+M+g.length,M>a[f]&&(a[f]=M),p[f]=M),h[f]=w}s.splice(1,0,h),l.splice(1,0,p),c=-1;let d=[];for(;++c<s.length;){let m=s[c],y=l[c],g=n.fillRows===!1?Math.max(1,s[c===1?0:c].length):u;f=-1;let M=[];for(;++f<g;){let w=m[f]||"",T="",R="";if(n.alignDelimiters!==!1){let C=a[f]-(y[f]||0),L=o[f];if(L===114)T=" ".repeat(C);else if(L===99){let P=C/2;C%2?(T=" ".repeat(P+.5),R=" ".repeat(P-.5)):(T=" ".repeat(P),R=T)}else R=" ".repeat(C)}n.delimiterStart!==!1&&!f&&M.push("|"),n.padding!==!1&&!(n.alignDelimiters===!1&&w==="")&&(n.delimiterStart!==!1||f)&&M.push(" "),n.alignDelimiters!==!1&&M.push(T),M.push(w),n.alignDelimiters!==!1&&M.push(R),n.padding!==!1&&M.push(" "),(n.delimiterEnd!==!1||f!==g-1)&&M.push("|")}d.push(n.delimiterEnd===!1?M.join("").replace(/ +$/,""):M.join(""))}return d.join(`
`)}function ZN(t){return t==null?"":String(t)}function Pk(t){let e=typeof t=="string"?t.codePointAt(0):0;return e===67||e===99?99:e===76||e===108?108:e===82||e===114?114:0}function Rf(){return{enter:{table:eI,tableData:zk,tableHeader:zk,tableRow:nI},exit:{codeText:rI,table:tI,tableData:Of,tableHeader:Of,tableRow:Of}}}function eI(t){let e=t._align;this.enter({type:"table",align:e.map(function(n){return n==="none"?null:n}),children:[],position:void 0},t),this.data.inTable=!0}function tI(t){this.exit(t),this.data.inTable=void 0}function nI(t){this.enter({type:"tableRow",children:[],position:void 0},t)}function Of(t){this.exit(t)}function zk(t){this.enter({type:"tableCell",children:[],position:void 0},t)}function rI(t){let e=this.resume();this.data.inTable&&(e=e.replace(/\\([\\|])/g,iI));let n=this.stack[this.stack.length-1];n.type,n.value=e,this.exit(t)}function iI(t,e){return e==="|"?e:t}function Df(t){let e=t||{},{tableCellPadding:n,tablePipeAlign:r,stringLength:i}=e,o=n?" ":"|";return{handlers:{inlineCode:h,table:s,tableCell:a,tableRow:l},join:[oI],unsafe:[{character:"\r",inConstruct:"tableCell"},{character:`
`,inConstruct:"tableCell"},{atBreak:!0,character:"|",after:"[	 :-]"},{character:"|",inConstruct:"tableCell"},{atBreak:!0,character:":",after:"-"},{atBreak:!0,character:"-",after:"[:|-]"}]};function s(p,d,m,y){let g=c(p,m,y),M=g[0];if(M){let w=p.align?p.align.length:0,T=-1;if(!w)for(;++T<g.length;)g[T].length>w&&(w=g[T].length);for(;M.length<w;)M.push("")}return u(g,p.align)}function l(p,d,m,y){let g=f(p,m,y),M=u([g]);return M.slice(0,M.indexOf(`
`))}function a(p,d,m,y){let g=m.enter("tableCell"),M=m.enter("phrasing"),w=m.containerPhrasing(p,{...y,before:o,after:o});return M(),g(),w}function u(p,d){return Lk(p,{align:d,alignDelimiters:r,fillRows:!1,padding:n,stringLength:i})}function c(p,d,m){let{children:y}=p,g=-1,M=[],w=d.enter("table");for(;++g<y.length;)M[g]=f(y[g],d,m);return w(),M}function f(p,d,m){let{children:y}=p,g=-1,M=[],w=d.enter("tableRow");for(;++g<y.length;)M[g]=a(y[g],p,d,m);return w(),M}function h(p,d,m){let y=bn.inlineCode(p,d,m);if(!m.stack.includes("tableCell"))return y;let g=[],M=0,w=y.indexOf("|");for(;w!==-1;){let T=w;for(;T>M&&y.charCodeAt(T-1)===92;)T--;g.push(y.slice(M,w)),(w-T)%2===0&&g.push("\\"),M=w,w=y.indexOf("|",w+1)}return g.push(y.slice(M)),g.join("")}}function oI(t,e,n,r){if(t.type==="table"&&n.type==="listItem"&&n.spread===!1&&(e.type==="definition"||e.type==="heading"&&sI(e,r)||e.type==="paragraph"||e.type==="table"))return 1}function sI(t,e){let n=!1;return tt(t,function(r){if(r.type==="break"||"value"in r&&/\r?\n|\r/.test(r.value))return n=!0,Et}),!!((!t.depth||t.depth<3)&&Kt(t)&&(e.options.setext||n))}function Pf(){return{exit:{taskListCheckValueChecked:Bk,taskListCheckValueUnchecked:Bk,paragraph:lI}}}function Lf(){return{handlers:{paragraph:aI},join:[uI]}}function Bk(t){let e=this.stack[this.stack.length-2];e.type,e.checked=t.type==="taskListCheckValueChecked"}function lI(t){let e=this.stack[this.stack.length-2];if(e&&e.type==="listItem"&&typeof e.checked=="boolean"){let n=this.stack[this.stack.length-1];n.type;let r=n.children[0];if(r&&r.type==="text"){let i=e.children,o=-1,s;for(;++o<i.length;){let l=i[o];if(l.type==="paragraph"){s=l;break}}s===n&&(r.value=r.value.slice(1),r.value.length===0?n.children.shift():n.position&&r.position&&typeof r.position.start.offset=="number"&&(r.position.start.column++,r.position.start.offset++,n.position.start={...r.position.start}))}}this.exit(t)}function aI(t,e,n,r){if(!e||e.type!=="listItem"||Fk(e)!==t)return bn.paragraph(t,e,n,r);let i="["+(e.checked?"x":" ")+"] ",o=n.createTracker(r);o.move(i);let s=bn.paragraph(t.children.length>0?t:{type:"paragraph",children:[{type:"text",value:" "}]},e,n,{...r,...o.current()});return i+s}function uI(t,e,n){if(!(t.type==="definition"&&n.type==="listItem"))return;let r=Fk(n);if(r&&n.children.indexOf(t)<n.children.indexOf(r))return 0}function Fk(t){if(typeof t.checked=="boolean")for(let e of t.children){if(e.type==="paragraph")return e;if(e.type!=="definition")return}}function zf(){return[Mf(),If(),Af(),Rf(),Pf()]}function Bf(t){return{extensions:[Nf(),Tf(t),vf(),Df(t),Lf()]}}var cI={tokenize:mI,partial:!0},_k={tokenize:gI,partial:!0},$k={tokenize:yI,partial:!0},Vk={tokenize:kI,partial:!0},fI={tokenize:xI,partial:!0},jk={name:"wwwAutolink",tokenize:pI,previous:Wk},Hk={name:"protocolAutolink",tokenize:dI,previous:qk},un={name:"emailAutolink",tokenize:hI,previous:Kk},Lt={};function _f(){return{text:Lt}}var wr=48;for(;wr<123;)Lt[wr]=un,wr++,wr===58?wr=65:wr===91&&(wr=97);Lt[43]=un;Lt[45]=un;Lt[46]=un;Lt[95]=un;Lt[72]=[un,Hk];Lt[104]=[un,Hk];Lt[87]=[un,jk];Lt[119]=[un,jk];function hI(t,e,n){let r=this,i,o;return s;function s(f){return!Ff(f)||!Kk.call(r,r.previous)||$f(r.events)?n(f):(t.enter("literalAutolink"),t.enter("literalAutolinkEmail"),l(f))}function l(f){return Ff(f)?(t.consume(f),l):f===64?(t.consume(f),a):n(f)}function a(f){return f===46?t.check(fI,c,u)(f):f===45||f===95||fe(f)?(o=!0,t.consume(f),a):c(f)}function u(f){return t.consume(f),i=!0,a}function c(f){return o&&i&&ce(r.previous)?(t.exit("literalAutolinkEmail"),t.exit("literalAutolink"),e(f)):n(f)}}function pI(t,e,n){let r=this;return i;function i(s){return s!==87&&s!==119||!Wk.call(r,r.previous)||$f(r.events)?n(s):(t.enter("literalAutolink"),t.enter("literalAutolinkWww"),t.check(cI,t.attempt(_k,t.attempt($k,o),n),n)(s))}function o(s){return t.exit("literalAutolinkWww"),t.exit("literalAutolink"),e(s)}}function dI(t,e,n){let r=this,i="",o=!1;return s;function s(f){return(f===72||f===104)&&qk.call(r,r.previous)&&!$f(r.events)?(t.enter("literalAutolink"),t.enter("literalAutolinkHttp"),i+=String.fromCodePoint(f),t.consume(f),l):n(f)}function l(f){if(ce(f)&&i.length<5)return i+=String.fromCodePoint(f),t.consume(f),l;if(f===58){let h=i.toLowerCase();if(h==="http"||h==="https")return t.consume(f),a}return n(f)}function a(f){return f===47?(t.consume(f),o?u:(o=!0,a)):n(f)}function u(f){return f===null||_n(f)||Y(f)||At(f)||pn(f)?n(f):t.attempt(_k,t.attempt($k,c),n)(f)}function c(f){return t.exit("literalAutolinkHttp"),t.exit("literalAutolink"),e(f)}}function mI(t,e,n){let r=0;return i;function i(s){return(s===87||s===119)&&r<3?(r++,t.consume(s),i):s===46&&r===3?(t.consume(s),o):n(s)}function o(s){return s===null?n(s):e(s)}}function gI(t,e,n){let r,i,o;return s;function s(u){return u===46||u===95?t.check(Vk,a,l)(u):u===null||Y(u)||At(u)||u!==45&&pn(u)?a(u):(o=!0,t.consume(u),s)}function l(u){return u===95?r=!0:(i=r,r=void 0),t.consume(u),s}function a(u){return i||r||!o?n(u):e(u)}}function yI(t,e){let n=0,r=0;return i;function i(s){return s===40?(n++,t.consume(s),i):s===41&&r<n?o(s):s===33||s===34||s===38||s===39||s===41||s===42||s===44||s===46||s===58||s===59||s===60||s===63||s===93||s===95||s===126?t.check(Vk,e,o)(s):s===null||Y(s)||At(s)?e(s):(t.consume(s),i)}function o(s){return s===41&&r++,t.consume(s),i}}function kI(t,e,n){return r;function r(l){return l===33||l===34||l===39||l===41||l===42||l===44||l===46||l===58||l===59||l===63||l===95||l===126?(t.consume(l),r):l===38?(t.consume(l),o):l===93?(t.consume(l),i):l===60||l===null||Y(l)||At(l)?e(l):n(l)}function i(l){return l===null||l===40||l===91||Y(l)||At(l)?e(l):r(l)}function o(l){return ce(l)?s(l):n(l)}function s(l){return l===59?(t.consume(l),r):ce(l)?(t.consume(l),s):n(l)}}function xI(t,e,n){return r;function r(o){return t.consume(o),i}function i(o){return fe(o)?n(o):e(o)}}function Wk(t){return t===null||t===40||t===42||t===95||t===91||t===93||t===126||Y(t)}function qk(t){return!ce(t)}function Kk(t){return!(t===47||Ff(t))}function Ff(t){return t===43||t===45||t===46||t===95||fe(t)}function $f(t){let e=t.length,n=!1;for(;e--;){let r=t[e][1];if((r.type==="labelLink"||r.type==="labelImage")&&!r._balanced){n=!0;break}if(r._gfmAutolinkLiteralWalkedInto){n=!1;break}}return t.length>0&&!n&&(t[t.length-1][1]._gfmAutolinkLiteralWalkedInto=!0),n}var bI={tokenize:TI,partial:!0};function Vf(){return{document:{91:{name:"gfmFootnoteDefinition",tokenize:MI,continuation:{tokenize:NI},exit:II}},text:{91:{name:"gfmFootnoteCall",tokenize:SI},93:{name:"gfmPotentialFootnoteCall",add:"after",tokenize:wI,resolveTo:CI}}}}function wI(t,e,n){let r=this,i=r.events.length,o=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),s;for(;i--;){let a=r.events[i][1];if(a.type==="labelImage"){s=a;break}if(a.type==="gfmFootnoteCall"||a.type==="labelLink"||a.type==="label"||a.type==="image"||a.type==="link")break}return l;function l(a){if(!s||!s._balanced)return n(a);let u=Ae(r.sliceSerialize({start:s.end,end:r.now()}));return u.codePointAt(0)!==94||!o.includes(u.slice(1))?n(a):(t.enter("gfmFootnoteCallLabelMarker"),t.consume(a),t.exit("gfmFootnoteCallLabelMarker"),e(a))}}function CI(t,e){let n=t.length,r;for(;n--;)if(t[n][1].type==="labelImage"&&t[n][0]==="enter"){r=t[n][1];break}t[n+1][1].type="data",t[n+3][1].type="gfmFootnoteCallLabelMarker";let i={type:"gfmFootnoteCall",start:Object.assign({},t[n+3][1].start),end:Object.assign({},t[t.length-1][1].end)},o={type:"gfmFootnoteCallMarker",start:Object.assign({},t[n+3][1].end),end:Object.assign({},t[n+3][1].end)};o.end.column++,o.end.offset++,o.end._bufferIndex++;let s={type:"gfmFootnoteCallString",start:Object.assign({},o.end),end:Object.assign({},t[t.length-1][1].start)},l={type:"chunkString",contentType:"string",start:Object.assign({},s.start),end:Object.assign({},s.end)},a=[t[n+1],t[n+2],["enter",i,e],t[n+3],t[n+4],["enter",o,e],["exit",o,e],["enter",s,e],["enter",l,e],["exit",l,e],["exit",s,e],t[t.length-2],t[t.length-1],["exit",i,e]];return t.splice(n,t.length-n+1,...a),t}function SI(t,e,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),o=0,s;return l;function l(f){return t.enter("gfmFootnoteCall"),t.enter("gfmFootnoteCallLabelMarker"),t.consume(f),t.exit("gfmFootnoteCallLabelMarker"),a}function a(f){return f!==94?n(f):(t.enter("gfmFootnoteCallMarker"),t.consume(f),t.exit("gfmFootnoteCallMarker"),t.enter("gfmFootnoteCallString"),t.enter("chunkString").contentType="string",u)}function u(f){if(o>999||f===93&&!s||f===null||f===91||Y(f))return n(f);if(f===93){t.exit("chunkString");let h=t.exit("gfmFootnoteCallString");return i.includes(Ae(r.sliceSerialize(h)))?(t.enter("gfmFootnoteCallLabelMarker"),t.consume(f),t.exit("gfmFootnoteCallLabelMarker"),t.exit("gfmFootnoteCall"),e):n(f)}return Y(f)||(s=!0),o++,t.consume(f),f===92?c:u}function c(f){return f===91||f===92||f===93?(t.consume(f),o++,u):u(f)}}function MI(t,e,n){let r=this,i=r.parser.gfmFootnotes||(r.parser.gfmFootnotes=[]),o,s=0,l;return a;function a(d){return t.enter("gfmFootnoteDefinition")._container=!0,t.enter("gfmFootnoteDefinitionLabel"),t.enter("gfmFootnoteDefinitionLabelMarker"),t.consume(d),t.exit("gfmFootnoteDefinitionLabelMarker"),u}function u(d){return d===94?(t.enter("gfmFootnoteDefinitionMarker"),t.consume(d),t.exit("gfmFootnoteDefinitionMarker"),t.enter("gfmFootnoteDefinitionLabelString"),t.enter("chunkString").contentType="string",c):n(d)}function c(d){if(s>999||d===93&&!l||d===null||d===91||Y(d))return n(d);if(d===93){t.exit("chunkString");let m=t.exit("gfmFootnoteDefinitionLabelString");return o=Ae(r.sliceSerialize(m)),t.enter("gfmFootnoteDefinitionLabelMarker"),t.consume(d),t.exit("gfmFootnoteDefinitionLabelMarker"),t.exit("gfmFootnoteDefinitionLabel"),h}return Y(d)||(l=!0),s++,t.consume(d),d===92?f:c}function f(d){return d===91||d===92||d===93?(t.consume(d),s++,c):c(d)}function h(d){return d===58?(t.enter("definitionMarker"),t.consume(d),t.exit("definitionMarker"),i.includes(o)||i.push(o),V(t,p,"gfmFootnoteDefinitionWhitespace")):n(d)}function p(d){return e(d)}}function NI(t,e,n){return t.check(vt,e,t.attempt(bI,e,n))}function II(t){t.exit("gfmFootnoteDefinition")}function TI(t,e,n){let r=this;return V(t,i,"gfmFootnoteDefinitionIndent",5);function i(o){let s=r.events[r.events.length-1];return s&&s[1].type==="gfmFootnoteDefinitionIndent"&&s[2].sliceSerialize(s[1],!0).length===4?e(o):n(o)}}function jf(t){let n=(t||{}).singleTilde,r={name:"strikethrough",tokenize:o,resolveAll:i};return n==null&&(n=!0),{text:{126:r},insideSpan:{null:[r]},attentionMarkers:{null:[126]}};function i(s,l){let a=-1;for(;++a<s.length;)if(s[a][0]==="enter"&&s[a][1].type==="strikethroughSequenceTemporary"&&s[a][1]._close){let u=a;for(;u--;)if(s[u][0]==="exit"&&s[u][1].type==="strikethroughSequenceTemporary"&&s[u][1]._open&&s[a][1].end.offset-s[a][1].start.offset===s[u][1].end.offset-s[u][1].start.offset){s[a][1].type="strikethroughSequence",s[u][1].type="strikethroughSequence";let c={type:"strikethrough",start:Object.assign({},s[u][1].start),end:Object.assign({},s[a][1].end)},f={type:"strikethroughText",start:Object.assign({},s[u][1].end),end:Object.assign({},s[a][1].start)},h=[["enter",c,l],["enter",s[u][1],l],["exit",s[u][1],l],["enter",f,l]],p=l.parser.constructs.insideSpan.null;p&&xe(h,h.length,0,mn(p,s.slice(u+1,a),l)),xe(h,h.length,0,[["exit",f,l],["enter",s[a][1],l],["exit",s[a][1],l],["exit",c,l]]),xe(s,u-1,a-u+3,h),a=u+h.length-2;break}}for(a=-1;++a<s.length;)s[a][1].type==="strikethroughSequenceTemporary"&&(s[a][1].type="data");return s}function o(s,l,a){let u=this.previous,c=this.events,f=0;return h;function h(d){return u===126&&c[c.length-1][1].type!=="characterEscape"?a(d):(s.enter("strikethroughSequenceTemporary"),p(d))}function p(d){let m=Le(u);if(d===126)return f>1?a(d):(s.consume(d),f++,p);if(f<2&&!n)return a(d);let y=s.exit("strikethroughSequenceTemporary"),g=Le(d);return y._open=!g||g===2&&!!m,y._close=!m||m===2&&!!g,l(d)}}}var aa=class{constructor(){this.map=[],this.index=new Map}add(e,n,r){AI(this,e,n,r)}consume(e){if(this.map.sort(function(o,s){return o[0]-s[0]}),this.map.length===0)return;let n=this.map.length,r=[];for(;n>0;)n-=1,r.push(e.slice(this.map[n][0]+this.map[n][1]),this.map[n][2]),e.length=this.map[n][0];r.push(e.slice()),e.length=0;let i=r.pop();for(;i;){for(let o of i)e.push(o);i=r.pop()}this.map.length=0,this.index.clear()}};function AI(t,e,n,r){if(n===0&&r.length===0)return;let i=t.index.get(e);if(i){i[1]+=n,i[2].push(...r);return}let o=[e,n,r];t.map.push(o),t.index.set(e,o)}function Jk(t,e){let n=!1,r=[];for(;e<t.length;){let i=t[e];if(n){if(i[0]==="enter")i[1].type==="tableContent"&&r.push(t[e+1][1].type==="tableDelimiterMarker"?"left":"none");else if(i[1].type==="tableContent"){if(t[e-1][1].type==="tableDelimiterMarker"){let o=r.length-1;r[o]=r[o]==="left"?"center":"right"}}else if(i[1].type==="tableDelimiterRow")break}else i[0]==="enter"&&i[1].type==="tableDelimiterRow"&&(n=!0);e+=1}return r}function Hf(){return{flow:{null:{name:"table",tokenize:vI,resolveAll:EI}}}}function vI(t,e,n){let r=this,i=0,o=0,s;return l;function l(S){let ie=r.events.length-1;for(;ie>-1;){let{type:X}=r.events[ie][1];if(X==="lineEnding"||X==="linePrefix")ie--;else break}let oe=ie>-1?r.events[ie][1].type:null,B=oe==="tableHead"||oe==="tableRow"?C:a;return B===C&&r.parser.lazy[r.now().line]?n(S):B(S)}function a(S){return t.enter("tableHead"),t.enter("tableRow"),u(S)}function u(S){return S===124||(s=!0,o+=1),c(S)}function c(S){return S===null?n(S):D(S)?o>1?(o=0,r.interrupt=!0,t.exit("tableRow"),t.enter("lineEnding"),t.consume(S),t.exit("lineEnding"),p):n(S):F(S)?V(t,c,"whitespace")(S):(o+=1,s&&(s=!1,i+=1),S===124?(t.enter("tableCellDivider"),t.consume(S),t.exit("tableCellDivider"),s=!0,c):(t.enter("data"),f(S)))}function f(S){return S===null||S===124||Y(S)?(t.exit("data"),c(S)):(t.consume(S),S===92?h:f)}function h(S){return S===92||S===124?(t.consume(S),f):f(S)}function p(S){return r.interrupt=!1,r.parser.lazy[r.now().line]?n(S):(t.enter("tableDelimiterRow"),s=!1,F(S)?V(t,d,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(S):d(S))}function d(S){return S===45||S===58?y(S):S===124?(s=!0,t.enter("tableCellDivider"),t.consume(S),t.exit("tableCellDivider"),m):R(S)}function m(S){return F(S)?V(t,y,"whitespace")(S):y(S)}function y(S){return S===58?(o+=1,s=!0,t.enter("tableDelimiterMarker"),t.consume(S),t.exit("tableDelimiterMarker"),g):S===45?(o+=1,g(S)):S===null||D(S)?T(S):R(S)}function g(S){return S===45?(t.enter("tableDelimiterFiller"),M(S)):R(S)}function M(S){return S===45?(t.consume(S),M):S===58?(s=!0,t.exit("tableDelimiterFiller"),t.enter("tableDelimiterMarker"),t.consume(S),t.exit("tableDelimiterMarker"),w):(t.exit("tableDelimiterFiller"),w(S))}function w(S){return F(S)?V(t,T,"whitespace")(S):T(S)}function T(S){return S===124?d(S):S===null||D(S)?!s||i!==o?R(S):(t.exit("tableDelimiterRow"),t.exit("tableHead"),e(S)):R(S)}function R(S){return n(S)}function C(S){return t.enter("tableRow"),L(S)}function L(S){return S===124?(t.enter("tableCellDivider"),t.consume(S),t.exit("tableCellDivider"),L):S===null||D(S)?(t.exit("tableRow"),e(S)):F(S)?V(t,L,"whitespace")(S):(t.enter("data"),P(S))}function P(S){return S===null||S===124||Y(S)?(t.exit("data"),L(S)):(t.consume(S),S===92?K:P)}function K(S){return S===92||S===124?(t.consume(S),P):P(S)}}function EI(t,e){let n=-1,r=!0,i=0,o=[0,0,0,0],s=[0,0,0,0],l=!1,a=0,u,c,f,h=new aa;for(;++n<t.length;){let p=t[n],d=p[1];p[0]==="enter"?d.type==="tableHead"?(l=!1,a!==0&&(Uk(h,e,a,u,c),c=void 0,a=0),u={type:"table",start:Object.assign({},d.start),end:Object.assign({},d.end)},h.add(n,0,[["enter",u,e]])):d.type==="tableRow"||d.type==="tableDelimiterRow"?(r=!0,f=void 0,o=[0,0,0,0],s=[0,n+1,0,0],l&&(l=!1,c={type:"tableBody",start:Object.assign({},d.start),end:Object.assign({},d.end)},h.add(n,0,[["enter",c,e]])),i=d.type==="tableDelimiterRow"?2:c?3:1):i&&(d.type==="data"||d.type==="tableDelimiterMarker"||d.type==="tableDelimiterFiller")?(r=!1,s[2]===0&&(o[1]!==0&&(s[0]=s[1],f=ua(h,e,o,i,void 0,f),o=[0,0,0,0]),s[2]=n)):d.type==="tableCellDivider"&&(r?r=!1:(o[1]!==0&&(s[0]=s[1],f=ua(h,e,o,i,void 0,f)),o=s,s=[o[1],n,0,0])):d.type==="tableHead"?(l=!0,a=n):d.type==="tableRow"||d.type==="tableDelimiterRow"?(a=n,o[1]!==0?(s[0]=s[1],f=ua(h,e,o,i,n,f)):s[1]!==0&&(f=ua(h,e,s,i,n,f)),i=0):i&&(d.type==="data"||d.type==="tableDelimiterMarker"||d.type==="tableDelimiterFiller")&&(s[3]=n)}for(a!==0&&Uk(h,e,a,u,c),h.consume(e.events),n=-1;++n<e.events.length;){let p=e.events[n];p[0]==="enter"&&p[1].type==="table"&&(p[1]._align=Jk(e.events,n))}return t}function ua(t,e,n,r,i,o){let s=r===1?"tableHeader":r===2?"tableDelimiter":"tableData",l="tableContent";n[0]!==0&&(o.end=Object.assign({},$i(e.events,n[0])),t.add(n[0],0,[["exit",o,e]]));let a=$i(e.events,n[1]);if(o={type:s,start:Object.assign({},a),end:Object.assign({},a)},t.add(n[1],0,[["enter",o,e]]),n[2]!==0){let u=$i(e.events,n[2]),c=$i(e.events,n[3]),f={type:l,start:Object.assign({},u),end:Object.assign({},c)};if(t.add(n[2],0,[["enter",f,e]]),r!==2){let h=e.events[n[2]],p=e.events[n[3]];if(h[1].end=Object.assign({},p[1].end),h[1].type="chunkText",h[1].contentType="text",n[3]>n[2]+1){let d=n[2]+1,m=n[3]-n[2]-1;t.add(d,m,[])}}t.add(n[3]+1,0,[["exit",f,e]])}return i!==void 0&&(o.end=Object.assign({},$i(e.events,i)),t.add(i,0,[["exit",o,e]]),o=void 0),o}function Uk(t,e,n,r,i){let o=[],s=$i(e.events,n);i&&(i.end=Object.assign({},s),o.push(["exit",i,e])),r.end=Object.assign({},s),o.push(["exit",r,e]),t.add(n+1,0,o)}function $i(t,e){let n=t[e],r=n[0]==="enter"?"start":"end";return n[1][r]}var OI={name:"tasklistCheck",tokenize:RI};function Wf(){return{text:{91:OI}}}function RI(t,e,n){let r=this;return i;function i(a){return r.previous!==null||!r._gfmTasklistFirstContentOfListItem?n(a):(t.enter("taskListCheck"),t.enter("taskListCheckMarker"),t.consume(a),t.exit("taskListCheckMarker"),o)}function o(a){return Y(a)?(t.enter("taskListCheckValueUnchecked"),t.consume(a),t.exit("taskListCheckValueUnchecked"),s):a===88||a===120?(t.enter("taskListCheckValueChecked"),t.consume(a),t.exit("taskListCheckValueChecked"),s):n(a)}function s(a){return a===93?(t.enter("taskListCheckMarker"),t.consume(a),t.exit("taskListCheckMarker"),t.exit("taskListCheck"),l):n(a)}function l(a){return D(a)?e(a):F(a)?t.check({tokenize:DI},e,n)(a):n(a)}}function DI(t,e,n){return V(t,r,"whitespace");function r(i){return i===null?n(i):e(i)}}function Gk(t){return Os([_f(),Vf(),jf(t),Hf(),Wf()])}var PI={};function ca(t){let e=this,n=t||PI,r=e.data(),i=r.micromarkExtensions||(r.micromarkExtensions=[]),o=r.fromMarkdownExtensions||(r.fromMarkdownExtensions=[]),s=r.toMarkdownExtensions||(r.toMarkdownExtensions=[]);i.push(Gk(n)),o.push(zf()),s.push(Bf(n))}function q(t,e){return Object.assign(t,{meta:{package:"@milkdown/preset-gfm",...e}}),t}var Jf=kr("strike_through");q(Jf,{displayName:"Attr<strikethrough>",group:"Strikethrough"});var xs=Pn("strike_through",t=>({parseDOM:[{tag:"del"},{style:"text-decoration",getAttrs:e=>e==="line-through"}],toDOM:e=>["del",t.get(Jf.key)(e)],parseMarkdown:{match:e=>e.type==="delete",runner:(e,n,r)=>{e.openMark(r),e.next(n.children),e.closeMark(r)}},toMarkdown:{match:e=>e.type.name==="strike_through",runner:(e,n)=>{e.withMark(n,"delete")}}}));q(xs.mark,{displayName:"MarkSchema<strikethrough>",group:"Strikethrough"});q(xs.ctx,{displayName:"MarkSchemaCtx<strikethrough>",group:"Strikethrough"});var bs=W("ToggleStrikeThrough",t=>()=>ni(xs.type(t)));q(bs,{displayName:"Command<ToggleStrikethrough>",group:"Strikethrough"});var Yk=De(t=>er(/(?<![\w:/])(~{1,2})(.+?)\1(?!\w|\/)$/,xs.type(t)));q(Yk,{displayName:"InputRule<strikethrough>",group:"Strikethrough"});var Uf=Ie("strikeThroughKeymap",{ToggleStrikethrough:{shortcuts:"Mod-Alt-x",command:t=>{let e=t.get(ee);return()=>e.call(bs.key)}}});q(Uf.ctx,{displayName:"KeymapCtx<strikethrough>",group:"Strikethrough"});q(Uf.shortcuts,{displayName:"Keymap<strikethrough>",group:"Strikethrough"});function Xk(t,e){let n=e.content.firstChild;if(e.childCount!==1||n?.type.name!=="paragraph"){t.next(e.content);return}let r=n.lastChild,i=r?.type.name==="hardbreak"?n.content.cut(0,n.content.size-r.nodeSize):n.content;t.next(i)}var ws=ck({tableGroup:"block",cellContent:"paragraph",cellAttributes:{alignment:{default:"left",getFromDOM:t=>t.style.textAlign||"left",setDOMAttr:(t,e)=>{e.style=`text-align: ${t||"left"}`}}}}),cn=pe("table",()=>({...ws.table,content:"table_header_row table_row+",disableDropCursor:!0,parseMarkdown:{match:t=>t.type==="table",runner:(t,e,n)=>{let r=e.align,i=e.children.map((o,s)=>({...o,align:r,isHeader:s===0}));t.openNode(n),t.next(i),t.closeNode()}},toMarkdown:{match:t=>t.type.name==="table",runner:(t,e)=>{let n=e.content.firstChild?.content;if(!n)return;let r=[];n.forEach(i=>{r.push(i.attrs.alignment)}),t.openNode("table",void 0,{align:r}),t.next(e.content),t.closeNode()}}}));q(cn.node,{displayName:"NodeSchema<table>",group:"Table"});q(cn.ctx,{displayName:"NodeSchemaCtx<table>",group:"Table"});var Cs=pe("table_header_row",()=>({...ws.table_row,disableDropCursor:!0,content:"(table_header)*",parseDOM:[{tag:"tr[data-is-header]"},{tag:"tr",getAttrs:t=>t instanceof HTMLElement&&t.querySelector("th")?{}:!1}],toDOM(){return["tr",{"data-is-header":!0},0]},parseMarkdown:{match:t=>!!(t.type==="tableRow"&&t.isHeader),runner:(t,e,n)=>{let r=e.align,i=e.children.map((o,s)=>({...o,align:r[s],isHeader:e.isHeader}));t.openNode(n),t.next(i),t.closeNode()}},toMarkdown:{match:t=>t.type.name==="table_header_row",runner:(t,e)=>{e.content.size!==0&&(t.openNode("tableRow",void 0,{isHeader:!0}),t.next(e.content),t.closeNode())}}}));q(Cs.node,{displayName:"NodeSchema<tableHeaderRow>",group:"Table"});q(Cs.ctx,{displayName:"NodeSchemaCtx<tableHeaderRow>",group:"Table"});var ji=pe("table_row",()=>({...ws.table_row,disableDropCursor:!0,content:"(table_cell)*",parseMarkdown:{match:t=>t.type==="tableRow",runner:(t,e,n)=>{let r=e.align,i=e.children.map((o,s)=>({...o,align:r[s]}));t.openNode(n),t.next(i),t.closeNode()}},toMarkdown:{match:t=>t.type.name==="table_row",runner:(t,e)=>{e.content.size!==0&&(t.openNode("tableRow"),t.next(e.content),t.closeNode())}}}));q(ji.node,{displayName:"NodeSchema<tableRow>",group:"Table"});q(ji.ctx,{displayName:"NodeSchemaCtx<tableRow>",group:"Table"});var Ss=pe("table_cell",()=>({...ws.table_cell,disableDropCursor:!0,parseMarkdown:{match:t=>t.type==="tableCell"&&!t.isHeader,runner:(t,e,n)=>{let r=e.align;t.openNode(n,{alignment:r}).openNode(t.schema.nodes.paragraph).next(e.children).closeNode().closeNode()}},toMarkdown:{match:t=>t.type.name==="table_cell",runner:(t,e)=>{t.openNode("tableCell"),Xk(t,e),t.closeNode()}}}));q(Ss.node,{displayName:"NodeSchema<tableCell>",group:"Table"});q(Ss.ctx,{displayName:"NodeSchemaCtx<tableCell>",group:"Table"});var Vi=pe("table_header",()=>({...ws.table_header,disableDropCursor:!0,parseMarkdown:{match:t=>t.type==="tableCell"&&!!t.isHeader,runner:(t,e,n)=>{let r=e.align;t.openNode(n,{alignment:r}),t.openNode(t.schema.nodes.paragraph),t.next(e.children),t.closeNode(),t.closeNode()}},toMarkdown:{match:t=>t.type.name==="table_header",runner:(t,e)=>{t.openNode("tableCell"),Xk(t,e),t.closeNode()}}}));q(Vi.node,{displayName:"NodeSchema<tableHeader>",group:"Table"});q(Vi.ctx,{displayName:"NodeSchemaCtx<tableHeader>",group:"Table"});function Zk(t,e=3,n=3){let r=Array(n).fill(0).map(()=>Ss.type(t).createAndFill()),i=Array(n).fill(0).map(()=>Vi.type(t).createAndFill()),o=Array(e).fill(0).map((s,l)=>l===0?Cs.type(t).create(null,i):ji.type(t).create(null,r));return cn.type(t).create(null,o)}function ex(t){return(e,n)=>r=>{n=n??r.selection.from;let i=r.doc.resolve(n),o=Em(a=>a.type.name==="table")(i),s=o?{node:o.node,from:o.start}:void 0,l=t==="row";if(s){let a=re.get(s.node);if(e>=0&&e<(l?a.height:a.width)){let u=a.positionAt(l?e:a.height-1,l?a.width-1:e,s.node),c=r.doc.resolve(s.from+u),f=l?se.rowSelection:se.colSelection,h=a.positionAt(l?e:0,l?0:e,s.node),p=r.doc.resolve(s.from+h);return zu(r.setSelection(f(c,p)))}}return r}}var LI=ex("row"),zI=ex("col");function tx(t,e,{map:n,tableStart:r,table:i},o){let s=Array(o).fill(0).reduce((a,u,c)=>a+i.child(c).nodeSize,r),l=Array(n.width).fill(0).map((a,u)=>{let c=i.nodeAt(n.map[u]);return Ss.type(t).createAndFill({alignment:c?.attrs.alignment})});return e.insert(s,ji.type(t).create(null,l)),e}function BI(t){let e=_i(t.$from);if(!e)return;let n=re.get(e.node);return n.cellsInRect({left:0,right:n.width,top:0,bottom:n.height}).map(r=>{let i=e.node.nodeAt(r),o=r+e.start;return{pos:o,start:o+1,node:i}})}function FI(t){let e=BI(t.selection);if(e&&e[0]){let n=t.doc.resolve(e[0].pos),r=e[e.length-1];if(r){let i=t.doc.resolve(r.pos);return zu(t.setSelection(new se(i,n)))}}return t}var Gf=W("GoToPrevTableCell",()=>()=>mf(-1));q(Gf,{displayName:"Command<goToPrevTableCellCommand>",group:"Table"});var Qf=W("GoToNextTableCell",()=>()=>mf(1));q(Qf,{displayName:"Command<goToNextTableCellCommand>",group:"Table"});var Yf=W("ExitTable",t=>()=>(e,n)=>{if(!st(e))return!1;let{$head:r}=e.selection,i=Am(r,cn.type(t));if(!i)return!1;let{to:o}=i,s=e.tr.replaceWith(o,o,Nt.type(t).createAndFill());return s.setSelection(_.near(s.doc.resolve(o),1)).scrollIntoView(),n?.(s),!0});q(Yf,{displayName:"Command<breakTableCommand>",group:"Table"});var nx=W("InsertTable",t=>({row:e,col:n}={})=>(r,i)=>{let{selection:o,tr:s}=r,{from:l}=o,a=Zk(t,e,n),u=s.replaceSelectionWith(a),c=_.findFrom(u.doc.resolve(l),1,!0);return c&&u.setSelection(c),i?.(u),!0});q(nx,{displayName:"Command<insertTableCommand>",group:"Table"});var rx=W("MoveRow",()=>({from:t,to:e,pos:n}={})=>Mk({from:t??0,to:e??0,pos:n}));q(rx,{displayName:"Command<moveRowCommand>",group:"Table"});var ix=W("MoveCol",()=>({from:t,to:e,pos:n}={})=>Nk({from:t??0,to:e??0,pos:n}));q(ix,{displayName:"Command<moveColCommand>",group:"Table"});var ox=W("SelectRow",()=>(t={index:0})=>(e,n)=>{let{tr:r}=e;return!!n?.(LI(t.index,t.pos)(r))});q(ox,{displayName:"Command<selectRowCommand>",group:"Table"});var sx=W("SelectCol",()=>(t={index:0})=>(e,n)=>{let{tr:r}=e;return!!n?.(zI(t.index,t.pos)(r))});q(sx,{displayName:"Command<selectColCommand>",group:"Table"});var lx=W("SelectTable",()=>()=>(t,e)=>{let{tr:n}=t;return!!e?.(FI(n))});q(lx,{displayName:"Command<selectTableCommand>",group:"Table"});var ax=W("DeleteSelectedCells",()=>()=>(t,e)=>{let{selection:n}=t;if(!(n instanceof se))return!1;let r=n.isRowSelection(),i=n.isColSelection();return r&&i?Sk(t,e):i?bk(t,e):wk(t,e)});q(ax,{displayName:"Command<deleteSelectedCellsCommand>",group:"Table"});var ux=W("AddColBefore",()=>()=>kk);q(ux,{displayName:"Command<addColBeforeCommand>",group:"Table"});var cx=W("AddColAfter",()=>()=>xk);q(cx,{displayName:"Command<addColAfterCommand>",group:"Table"});var fx=W("AddRowBefore",t=>()=>(e,n)=>{if(!st(e))return!1;if(n){let r=an(e);n(tx(t,e.tr,r,r.top))}return!0});q(fx,{displayName:"Command<addRowBeforeCommand>",group:"Table"});var hx=W("AddRowAfter",t=>()=>(e,n)=>{if(!st(e))return!1;if(n){let r=an(e);n(tx(t,e.tr,r,r.bottom))}return!0});q(hx,{displayName:"Command<addRowAfterCommand>",group:"Table"});var px=W("SetAlign",()=>(t="left")=>Ck("alignment",t));q(px,{displayName:"Command<setAlignCommand>",group:"Table"});var dx=De(t=>new we(/^\|(?<col>\d+)[xX](?<row>\d+)\|\s$/,(e,n,r,i)=>{let o=e.doc.resolve(r);if(!o.node(-1).canReplaceWith(o.index(-1),o.indexAfter(-1),cn.type(t)))return null;let s=Zk(t,Math.max(Number(n.groups?.row??0),2),Number(n.groups?.col)),l=e.tr.replaceRangeWith(r,i,s);return l.setSelection(j.create(l.doc,r+3)).scrollIntoView()}));q(dx,{displayName:"InputRule<insertTableInputRule>",group:"Table"});var mx=ky(t=>({run:(e,n,r)=>{if(r)return e;function i(u){let c=u.childCount,f=u.lastChild?.childCount??0;if(c===0||f===0)return Nt.type(t).create();let h=u.firstChild;if(!(f>0&&h&&h.childCount===0))return u;if(c>=3){let y=u.child(1),g=[];for(let T=0;T<y.childCount;T++){let R=y.child(T);g.push(Vi.type(t).create(R.attrs,R.content,R.marks))}let M=h.type.create(h.attrs,g),w=[];for(let T=2;T<c;T++)w.push(u.child(T));return u.type.create(u.attrs,[M,...w])}let p=Array(f).fill(0).map(()=>Vi.type(t).createAndFill()),d=new E(A.from(p),0,0),m=h.replace(0,0,d);return u.replace(0,h.nodeSize,new E(A.from(m),0,0))}function o(u){let c=ji.type(t),f=[],h=[],p=!1;function d(){if(h.length===0)return;let m=Cs.type(t).createAndFill(),y=cn.type(t).create(null,[m,...h]);f.push(i(y)),h=[]}return u.forEach(m=>{m.type===c?(p=!0,h.push(m)):(d(),f.push(m))}),d(),p?A.from(f):u}function s(u){let c=o(u),f=c!==u,h=[];return c.forEach(p=>{if(p.type===cn.type(t)){let d=i(p);d!==p&&(f=!0),h.push(d)}else if(p.childCount>0){let d=s(p.content);d!==p.content?(f=!0,h.push(p.copy(d))):h.push(p)}else h.push(p)}),f?A.from(h):u}function l(u){let c=[],f=[];u.forEach(h=>f.push(h));for(let h=0;h<f.length;h++){let p=f[h],d=f[h+1];p.type===Nt.type(t)&&p.content.size===0&&d&&d.type===cn.type(t)||c.push(p)}return c.length<f.length?A.from(c):u}let a=s(e.content);return a=l(a),new E(A.from(a),e.openStart,e.openEnd)}}));q(mx,{displayName:"PasteRule<table>",group:"Table"});var Xf=Ie("tableKeymap",{NextCell:{priority:100,shortcuts:["Mod-]","Tab"],command:t=>{let e=t.get(ee);return()=>e.call(Qf.key)}},PrevCell:{shortcuts:["Mod-[","Shift-Tab"],command:t=>{let e=t.get(ee);return()=>e.call(Gf.key)}},ExitTable:{shortcuts:["Mod-Enter","Enter"],command:t=>{let e=t.get(ee);return()=>e.call(Yf.key)}}});q(Xf.ctx,{displayName:"KeymapCtx<table>",group:"Table"});q(Xf.shortcuts,{displayName:"Keymap<table>",group:"Table"});var qf="footnote_definition",Qk="footnoteDefinition",Zf=pe("footnote_definition",()=>({group:"block",content:"block+",defining:!0,attrs:{label:{default:"",validate:"string"}},parseDOM:[{tag:`dl[data-type="${qf}"]`,getAttrs:t=>{if(!(t instanceof HTMLElement))throw et(t);return{label:t.dataset.label}},contentElement:"dd"}],toDOM:t=>{let e=t.attrs.label;return["dl",{"data-label":e,"data-type":qf},["dt",e],["dd",0]]},parseMarkdown:{match:({type:t})=>t===Qk,runner:(t,e,n)=>{t.openNode(n,{label:e.label}).next(e.children).closeNode()}},toMarkdown:{match:t=>t.type.name===qf,runner:(t,e)=>{t.openNode(Qk,void 0,{label:e.attrs.label,identifier:e.attrs.label}).next(e.content).closeNode()}}}));q(Zf.ctx,{displayName:"NodeSchemaCtx<footnodeDef>",group:"footnote"});q(Zf.node,{displayName:"NodeSchema<footnodeDef>",group:"footnote"});var Kf="footnote_reference",eh=pe("footnote_reference",()=>({group:"inline",inline:!0,atom:!0,attrs:{label:{default:"",validate:"string"}},parseDOM:[{tag:`sup[data-type="${Kf}"]`,getAttrs:t=>{if(!(t instanceof HTMLElement))throw et(t);return{label:t.dataset.label}}}],toDOM:t=>{let e=t.attrs.label;return["sup",{"data-label":e,"data-type":Kf},e]},parseMarkdown:{match:({type:t})=>t==="footnoteReference",runner:(t,e,n)=>{t.addNode(n,{label:e.label})}},toMarkdown:{match:t=>t.type.name===Kf,runner:(t,e)=>{t.addNode("footnoteReference",void 0,void 0,{label:e.attrs.label,identifier:e.attrs.label})}}}));q(eh.ctx,{displayName:"NodeSchemaCtx<footnodeRef>",group:"footnote"});q(eh.node,{displayName:"NodeSchema<footnodeRef>",group:"footnote"});var th=Pt.extendSchema(t=>e=>{let n=t(e);return{...n,attrs:{...n.attrs,checked:{default:null,validate:"boolean|null"}},parseDOM:[{tag:'li[data-item-type="task"]',getAttrs:r=>{if(!(r instanceof HTMLElement))throw et(r);return{label:r.dataset.label,listType:r.dataset.listType,spread:r.dataset.spread==="true",checked:r.dataset.checked?r.dataset.checked==="true":null}}},...n?.parseDOM||[]],toDOM:r=>n.toDOM&&r.attrs.checked==null?n.toDOM(r):["li",{"data-item-type":"task","data-label":r.attrs.label,"data-list-type":r.attrs.listType,"data-spread":r.attrs.spread,"data-checked":r.attrs.checked},0],parseMarkdown:{match:({type:r})=>r==="listItem",runner:(r,i,o)=>{if(i.checked==null){n.parseMarkdown.runner(r,i,o);return}let s=i.label!=null?`${i.label}.`:"\u2022",l=i.checked!=null?!!i.checked:null,a=i.label!=null?"ordered":"bullet",u=i.spread??!0;r.openNode(o,{label:s,listType:a,spread:u,checked:l}),r.next(i.children),r.closeNode()}},toMarkdown:{match:r=>r.type.name==="list_item",runner:(r,i)=>{if(i.attrs.checked==null){n.toMarkdown.runner(r,i);return}let o=i.attrs.label,s=i.attrs.listType,l=i.attrs.spread,a=i.attrs.checked;r.openNode("listItem",void 0,{label:o,listType:s,spread:l,checked:a}),r.next(i.content),r.closeNode()}}}});q(th.node,{displayName:"NodeSchema<taskListItem>",group:"ListItem"});q(th.ctx,{displayName:"NodeSchemaCtx<taskListItem>",group:"ListItem"});var gx=De(()=>new we(/^\[(?<checked>\s|x)\]\s$/,(t,e,n,r)=>{let i=t.doc.resolve(n),o=0,s=i.node(o);for(;s&&s.type.name!=="list_item";)o--,s=i.node(o);if(!s||s.attrs.checked!=null)return null;let l=e.groups?.checked==="x",a=i.before(o),u=t.tr;return u.deleteRange(n,r).setNodeMarkup(a,void 0,{...s.attrs,checked:l}),u}));q(gx,{displayName:"InputRule<wrapInTaskListInputRule>",group:"ListItem"});var _I=[Uf,Xf].flat(),$I=[dx,gx],VI=[Yk],jI=[mx],yx=ke(()=>Ok);q(yx,{displayName:"Prose<autoInsertSpanPlugin>",group:"Prose"});var HI=ke(()=>Tk({}));q(HI,{displayName:"Prose<columnResizingPlugin>",group:"Prose"});var kx=ke(()=>vk({allowTableNodeSelection:!0}));q(kx,{displayName:"Prose<tableEditingPlugin>",group:"Prose"});var nh=sn("remarkGFM",()=>ca);q(nh.plugin,{displayName:"Remark<remarkGFMPlugin>",group:"Remark"});q(nh.options,{displayName:"RemarkConfig<remarkGFMPlugin>",group:"Remark"});var WI=new ne("MILKDOWN_KEEP_TABLE_ALIGN_PLUGIN");function qI(t,e){let n=0;return e.forEach((r,i,o)=>{r===t&&(n=o)}),n}function KI(t,e){let n=t.content.findDiffStart(e.content);if(n==null)return null;let r=t.content.findDiffEnd(e.content);return r?{from:n,to:Math.max(r.b,n)}:null}var xx=ke(()=>new te({key:WI,appendTransaction:(t,e,n)=>{if(e.doc===n.doc)return;let r=KI(e.doc,n.doc);if(!r)return;let i,o=(s,l)=>{if(s.type.name!=="table_cell")return;let a=n.doc.resolve(l),u=a.node(a.depth),c=a.node(a.depth-1).firstChild;if(!c)return;let f=qI(s,u),h=c.maybeChild(f);if(!h)return;let p=h.attrs.alignment;p!==s.attrs.alignment&&(i||(i=n.tr),i.setNodeMarkup(l,void 0,{...s.attrs,alignment:p}))};return n.doc.nodesBetween(r.from,r.to,(s,l)=>s.type.name!=="table"?!0:(n.doc.nodesBetween(l,l+s.nodeSize,o),!1)),i}}));q(xx,{displayName:"Prose<keepTableAlignPlugin>",group:"Prose"});var JI=[xx,yx,nh,kx].flat(),UI=[th,cn,Cs,ji,Vi,Ss,Zf,eh,Jf,xs].flat(),GI=[Qf,Gf,Yf,nx,rx,ix,ox,sx,lx,ax,fx,hx,ux,cx,px,bs],bx=[UI,$I,jI,VI,_I,GI,JI].flat();var fa=200,Te=function(){};Te.prototype.append=function(e){return e.length?(e=Te.from(e),!this.length&&e||e.length<fa&&this.leafAppend(e)||this.length<fa&&e.leafPrepend(this)||this.appendInner(e)):this};Te.prototype.prepend=function(e){return e.length?Te.from(e).append(this):this};Te.prototype.appendInner=function(e){return new QI(this,e)};Te.prototype.slice=function(e,n){return e===void 0&&(e=0),n===void 0&&(n=this.length),e>=n?Te.empty:this.sliceInner(Math.max(0,e),Math.min(this.length,n))};Te.prototype.get=function(e){if(!(e<0||e>=this.length))return this.getInner(e)};Te.prototype.forEach=function(e,n,r){n===void 0&&(n=0),r===void 0&&(r=this.length),n<=r?this.forEachInner(e,n,r,0):this.forEachInvertedInner(e,n,r,0)};Te.prototype.map=function(e,n,r){n===void 0&&(n=0),r===void 0&&(r=this.length);var i=[];return this.forEach(function(o,s){return i.push(e(o,s))},n,r),i};Te.from=function(e){return e instanceof Te?e:e&&e.length?new wx(e):Te.empty};var wx=(function(t){function e(r){t.call(this),this.values=r}t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e;var n={length:{configurable:!0},depth:{configurable:!0}};return e.prototype.flatten=function(){return this.values},e.prototype.sliceInner=function(i,o){return i==0&&o==this.length?this:new e(this.values.slice(i,o))},e.prototype.getInner=function(i){return this.values[i]},e.prototype.forEachInner=function(i,o,s,l){for(var a=o;a<s;a++)if(i(this.values[a],l+a)===!1)return!1},e.prototype.forEachInvertedInner=function(i,o,s,l){for(var a=o-1;a>=s;a--)if(i(this.values[a],l+a)===!1)return!1},e.prototype.leafAppend=function(i){if(this.length+i.length<=fa)return new e(this.values.concat(i.flatten()))},e.prototype.leafPrepend=function(i){if(this.length+i.length<=fa)return new e(i.flatten().concat(this.values))},n.length.get=function(){return this.values.length},n.depth.get=function(){return 0},Object.defineProperties(e.prototype,n),e})(Te);Te.empty=new wx([]);var QI=(function(t){function e(n,r){t.call(this),this.left=n,this.right=r,this.length=n.length+r.length,this.depth=Math.max(n.depth,r.depth)+1}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.flatten=function(){return this.left.flatten().concat(this.right.flatten())},e.prototype.getInner=function(r){return r<this.left.length?this.left.get(r):this.right.get(r-this.left.length)},e.prototype.forEachInner=function(r,i,o,s){var l=this.left.length;if(i<l&&this.left.forEachInner(r,i,Math.min(o,l),s)===!1||o>l&&this.right.forEachInner(r,Math.max(i-l,0),Math.min(this.length,o)-l,s+l)===!1)return!1},e.prototype.forEachInvertedInner=function(r,i,o,s){var l=this.left.length;if(i>l&&this.right.forEachInvertedInner(r,i-l,Math.max(o,l)-l,s+l)===!1||o<l&&this.left.forEachInvertedInner(r,Math.min(i,l),o,s)===!1)return!1},e.prototype.sliceInner=function(r,i){if(r==0&&i==this.length)return this;var o=this.left.length;return i<=o?this.left.slice(r,i):r>=o?this.right.slice(r-o,i-o):this.left.slice(r,o).append(this.right.slice(0,i-o))},e.prototype.leafAppend=function(r){var i=this.right.leafAppend(r);if(i)return new e(this.left,i)},e.prototype.leafPrepend=function(r){var i=this.left.leafPrepend(r);if(i)return new e(i,this.right)},e.prototype.appendInner=function(r){return this.left.depth>=Math.max(this.right.depth,r.depth)+1?new e(this.left,new e(this.right,r)):new e(this,r)},e})(Te),rh=Te;var YI=500,Sr=class t{constructor(e,n){this.items=e,this.eventCount=n}popEvent(e,n){if(this.eventCount==0)return null;let r=this.items.length;for(;;r--)if(this.items.get(r-1).selection){--r;break}let i,o;n&&(i=this.remapping(r,this.items.length),o=i.maps.length);let s=e.tr,l,a,u=[],c=[];return this.items.forEach((f,h)=>{if(!f.step){i||(i=this.remapping(r,h+1),o=i.maps.length),o--,c.push(f);return}if(i){c.push(new zt(f.map));let p=f.step.map(i.slice(o)),d;p&&s.maybeStep(p).doc&&(d=s.mapping.maps[s.mapping.maps.length-1],u.push(new zt(d,void 0,void 0,u.length+c.length))),o--,d&&i.appendMap(d,o)}else s.maybeStep(f.step);if(f.selection)return l=i?f.selection.map(i.slice(o)):f.selection,a=new t(this.items.slice(0,r).append(c.reverse().concat(u)),this.eventCount-1),!1},this.items.length,0),{remaining:a,transform:s,selection:l}}addTransform(e,n,r,i){let o=[],s=this.eventCount,l=this.items,a=!i&&l.length?l.get(l.length-1):null;for(let c=0;c<e.steps.length;c++){let f=e.steps[c].invert(e.docs[c]),h=new zt(e.mapping.maps[c],f,n),p;(p=a&&a.merge(h))&&(h=p,c?o.pop():l=l.slice(0,l.length-1)),o.push(h),n&&(s++,n=void 0),i||(a=h)}let u=s-r.depth;return u>ZI&&(l=XI(l,u),s-=u),new t(l.append(o),s)}remapping(e,n){let r=new Mo;return this.items.forEach((i,o)=>{let s=i.mirrorOffset!=null&&o-i.mirrorOffset>=e?r.maps.length-i.mirrorOffset:void 0;r.appendMap(i.map,s)},e,n),r}addMaps(e){return this.eventCount==0?this:new t(this.items.append(e.map(n=>new zt(n))),this.eventCount)}rebased(e,n){if(!this.eventCount)return this;n=Math.min(this.items.length,n);let r=[],i=this.items.length-n,o=e.mapping,s=e.steps.length,l=this.eventCount;this.items.forEach(h=>{h.selection&&l--},i);let a=n;this.items.forEach(h=>{let p=o.getMirror(--a);if(p==null)return;s=Math.min(s,p);let d=o.maps[p];if(h.step){let m=e.steps[p].invert(e.docs[p]),y=h.selection&&h.selection.map(o.slice(a+1,p));y&&l++,r.push(new zt(d,m,y))}else r.push(new zt(d))},i);let u=[];for(let h=n;h<s;h++)u.push(new zt(o.maps[h]));let c=this.items.slice(0,i).append(u).append(r),f=new t(c,l);return f.emptyItemCount()>YI&&(f=f.compress(this.items.length-r.length)),f}emptyItemCount(){let e=0;return this.items.forEach(n=>{n.step||e++}),e}compress(e=this.items.length){let n=this.remapping(0,e),r=n.maps.length,i=[],o=0;return this.items.forEach((s,l)=>{if(l>=e)i.push(s),s.selection&&o++;else if(s.step){let a=s.step.map(n.slice(r)),u=a&&a.getMap();if(r--,u&&n.appendMap(u,r),a){let c=s.selection&&s.selection.map(n.slice(r));c&&o++;let f=new zt(u.invert(),a,c),h,p=i.length-1;(h=i.length&&i[p].merge(f))?i[p]=h:i.push(f)}}else s.map&&r--},this.items.length,0),new t(rh.from(i.reverse()),o)}};Sr.empty=new Sr(rh.empty,0);function XI(t,e){let n;return t.forEach((r,i)=>{if(r.selection&&e--==0)return n=i,!1}),t.slice(n)}var zt=class t{constructor(e,n,r,i){this.map=e,this.step=n,this.selection=r,this.mirrorOffset=i}merge(e){if(this.step&&e.step&&!e.selection){let n=e.step.merge(this.step);if(n)return new t(n.getMap().invert(),n,this.selection)}}},Bt=class{constructor(e,n,r,i,o){this.done=e,this.undone=n,this.prevRanges=r,this.prevTime=i,this.prevComposition=o}},ZI=20;function eT(t,e,n,r){let i=n.getMeta(Cr),o;if(i)return i.historyState;n.getMeta(iT)&&(t=new Bt(t.done,t.undone,null,0,-1));let s=n.getMeta("appendedTransaction");if(n.steps.length==0)return t;if(s&&s.getMeta(Cr))return s.getMeta(Cr).redo?new Bt(t.done.addTransform(n,void 0,r,ha(e)),t.undone,Cx(n.mapping.maps),t.prevTime,t.prevComposition):new Bt(t.done,t.undone.addTransform(n,void 0,r,ha(e)),null,t.prevTime,t.prevComposition);if(n.getMeta("addToHistory")!==!1&&!(s&&s.getMeta("addToHistory")===!1)){let l=n.getMeta("composition"),a=t.prevTime==0||!s&&t.prevComposition!=l&&(t.prevTime<(n.time||0)-r.newGroupDelay||!tT(n,t.prevRanges)),u=s?ih(t.prevRanges,n.mapping):Cx(n.mapping.maps);return new Bt(t.done.addTransform(n,a?e.selection.getBookmark():void 0,r,ha(e)),Sr.empty,u,n.time,l??t.prevComposition)}else return(o=n.getMeta("rebased"))?new Bt(t.done.rebased(n,o),t.undone.rebased(n,o),ih(t.prevRanges,n.mapping),t.prevTime,t.prevComposition):new Bt(t.done.addMaps(n.mapping.maps),t.undone.addMaps(n.mapping.maps),ih(t.prevRanges,n.mapping),t.prevTime,t.prevComposition)}function tT(t,e){if(!e)return!1;if(!t.docChanged)return!0;let n=!1;return t.mapping.maps[0].forEach((r,i)=>{for(let o=0;o<e.length;o+=2)r<=e[o+1]&&i>=e[o]&&(n=!0)}),n}function Cx(t){let e=[];for(let n=t.length-1;n>=0&&e.length==0;n--)t[n].forEach((r,i,o,s)=>e.push(o,s));return e}function ih(t,e){if(!t)return null;let n=[];for(let r=0;r<t.length;r+=2){let i=e.map(t[r],1),o=e.map(t[r+1],-1);i<=o&&n.push(i,o)}return n}function nT(t,e){for(let n=0;n<e.steps.length;n++){let r=e.mapping.maps[n],i=-1;if(r.forEach((o,s)=>i=s),i<0){let o=e.steps[n];(o instanceof Gt||o instanceof Cn)&&(i=o.to)}if(i>-1)return _.near(t.doc.resolve(i))}return t.selection}function rT(t,e,n){let r=ha(e),i=Cr.get(e).spec.config,o=(n?t.undone:t.done).popEvent(e,r);if(!o)return null;let s=o.selection.resolve(o.transform.doc),l=(n?t.done:t.undone).addTransform(o.transform,nT(e,o.transform).getBookmark(),i,r),a=new Bt(n?l:o.remaining,n?o.remaining:l,null,0,-1);return o.transform.setSelection(s).setMeta(Cr,{redo:n,historyState:a})}var oh=!1,Sx=null;function ha(t){let e=t.plugins;if(Sx!=e){oh=!1,Sx=e;for(let n=0;n<e.length;n++)if(e[n].spec.historyPreserveItems){oh=!0;break}}return oh}var Cr=new ne("history"),iT=new ne("closeHistory");function Mx(t={}){return t={depth:t.depth||100,newGroupDelay:t.newGroupDelay||500},new te({key:Cr,state:{init(){return new Bt(Sr.empty,Sr.empty,null,0,-1)},apply(e,n,r){return eT(n,r,e,t)}},config:t,props:{handleDOMEvents:{beforeinput(e,n){let r=n.inputType,i=r=="historyUndo"?sh:r=="historyRedo"?lh:null;return!i||!e.editable?!1:(n.preventDefault(),i(e.state,e.dispatch))}}}})}function pa(t,e){return(n,r)=>{let i=Cr.getState(n);if(!i||(t?i.undone:i.done).eventCount==0)return!1;if(r){let o=rT(i,n,t);o&&r(e?o.scrollIntoView():o)}return!0}}var sh=pa(!1,!0),lh=pa(!0,!0),YF=pa(!1,!1),XF=pa(!0,!1);function Hi(t,e){return Object.assign(t,{meta:{package:"@milkdown/plugin-history",...e}}),t}var ah=W("Undo",()=>()=>sh);Hi(ah,{displayName:"Command<undo>"});var uh=W("Redo",()=>()=>lh);Hi(uh,{displayName:"Command<redo>"});var ch=Ge({},"historyProviderConfig");Hi(ch,{displayName:"Ctx<historyProviderConfig>"});var Nx=ke(t=>Mx(t.get(ch.key)));Hi(Nx,{displayName:"Ctx<historyProviderPlugin>"});var fh=Ie("historyKeymap",{Undo:{shortcuts:"Mod-z",command:t=>{let e=t.get(ee);return()=>e.call(ah.key)}},Redo:{shortcuts:["Mod-y","Shift-Mod-z"],command:t=>{let e=t.get(ee);return()=>e.call(uh.key)}}});Hi(fh.ctx,{displayName:"KeymapCtx<history>"});Hi(fh.shortcuts,{displayName:"Keymap<history>"});var Ix=[ch,Nx,fh,ah,uh].flat();var oT=typeof global=="object"&&global&&global.Object===Object&&global,Tx=oT;var sT=typeof self=="object"&&self&&self.Object===Object&&self,lT=Tx||sT||Function("return this")(),da=lT;var aT=da.Symbol,Wi=aT;var Ax=Object.prototype,uT=Ax.hasOwnProperty,cT=Ax.toString,Ms=Wi?Wi.toStringTag:void 0;function fT(t){var e=uT.call(t,Ms),n=t[Ms];try{t[Ms]=void 0;var r=!0}catch{}var i=cT.call(t);return r&&(e?t[Ms]=n:delete t[Ms]),i}var vx=fT;var hT=Object.prototype,pT=hT.toString;function dT(t){return pT.call(t)}var Ex=dT;var mT="[object Null]",gT="[object Undefined]",Ox=Wi?Wi.toStringTag:void 0;function yT(t){return t==null?t===void 0?gT:mT:Ox&&Ox in Object(t)?vx(t):Ex(t)}var Rx=yT;function kT(t){return t!=null&&typeof t=="object"}var Dx=kT;var xT="[object Symbol]";function bT(t){return typeof t=="symbol"||Dx(t)&&Rx(t)==xT}var Px=bT;var wT=/\s/;function CT(t){for(var e=t.length;e--&&wT.test(t.charAt(e)););return e}var Lx=CT;var ST=/^\s+/;function MT(t){return t&&t.slice(0,Lx(t)+1).replace(ST,"")}var zx=MT;function NT(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var Ns=NT;var Bx=NaN,IT=/^[-+]0x[0-9a-f]+$/i,TT=/^0b[01]+$/i,AT=/^0o[0-7]+$/i,vT=parseInt;function ET(t){if(typeof t=="number")return t;if(Px(t))return Bx;if(Ns(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=Ns(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=zx(t);var n=TT.test(t);return n||AT.test(t)?vT(t.slice(2),n?2:8):IT.test(t)?Bx:+t}var hh=ET;var OT=function(){return da.Date.now()},ma=OT;var RT="Expected a function",DT=Math.max,PT=Math.min;function LT(t,e,n){var r,i,o,s,l,a,u=0,c=!1,f=!1,h=!0;if(typeof t!="function")throw new TypeError(RT);e=hh(e)||0,Ns(n)&&(c=!!n.leading,f="maxWait"in n,o=f?DT(hh(n.maxWait)||0,e):o,h="trailing"in n?!!n.trailing:h);function p(C){var L=r,P=i;return r=i=void 0,u=C,s=t.apply(P,L),s}function d(C){return u=C,l=setTimeout(g,e),c?p(C):s}function m(C){var L=C-a,P=C-u,K=e-L;return f?PT(K,o-P):K}function y(C){var L=C-a,P=C-u;return a===void 0||L>=e||L<0||f&&P>=o}function g(){var C=ma();if(y(C))return M(C);l=setTimeout(g,m(C))}function M(C){return l=void 0,h&&r?p(C):(r=i=void 0,s)}function w(){l!==void 0&&clearTimeout(l),u=0,r=a=i=l=void 0}function T(){return l===void 0?s:M(ma())}function R(){var C=ma(),L=y(C);if(r=arguments,i=this,a=C,L){if(l===void 0)return d(a);if(f)return clearTimeout(l),l=setTimeout(g,e),p(a)}return l===void 0&&(l=setTimeout(g,e)),s}return R.cancel=w,R.flush=T,R}var ph=LT;/**
 * @license
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="es" --repo lodash/lodash#4.18.1 -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */var Fx=class{constructor(){this.beforeMountedListeners=[],this.mountedListeners=[],this.updatedListeners=[],this.selectionUpdatedListeners=[],this.markdownUpdatedListeners=[],this.blurListeners=[],this.focusListeners=[],this.destroyListeners=[],this.beforeMount=t=>(this.beforeMountedListeners.push(t),this),this.mounted=t=>(this.mountedListeners.push(t),this),this.updated=t=>(this.updatedListeners.push(t),this)}get listeners(){return{beforeMount:this.beforeMountedListeners,mounted:this.mountedListeners,updated:this.updatedListeners,markdownUpdated:this.markdownUpdatedListeners,blur:this.blurListeners,focus:this.focusListeners,destroy:this.destroyListeners,selectionUpdated:this.selectionUpdatedListeners}}markdownUpdated(t){return this.markdownUpdatedListeners.push(t),this}blur(t){return this.blurListeners.push(t),this}focus(t){return this.focusListeners.push(t),this}destroy(t){return this.destroyListeners.push(t),this}selectionUpdated(t){return this.selectionUpdatedListeners.push(t),this}},ga=Q(new Fx,"listener"),zT=new ne("MILKDOWN_LISTENER"),dh=t=>(t.inject(ga,new Fx),async()=>{await t.wait(rn);let{listeners:e}=t.get(ga);e.beforeMount.forEach(u=>u(t)),await t.wait(Ci);let n=t.get(St),r=null,i=null,o=null,s=null,l=ph(()=>{if(!s)return;let{doc:u}=s;if(e.updated.length>0&&r&&!r.eq(u)&&e.updated.forEach(c=>{c(t,u,r)}),e.markdownUpdated.length>0&&r&&!r.eq(u)){let c=n(u);e.markdownUpdated.forEach(f=>{f(t,c,i)}),i=c}r=u,s=null},200),a=new te({key:zT,view:()=>({destroy:()=>{l.cancel(),e.destroy.forEach(u=>u(t))}}),props:{handleDOMEvents:{focus:()=>(e.focus.forEach(u=>u(t)),!1),blur:()=>(e.blur.forEach(u=>u(t)),!1)}},state:{init:(u,c)=>{r=c.doc,i=n(c.doc)},apply:u=>{let c=u.selection;(!o&&c||o&&!c.eq(o))&&(e.selectionUpdated.forEach(f=>{f(t,c,o)}),o=c),!(!(u.docChanged||u.storedMarksSet)||u.getMeta("addToHistory")===!1)&&(s=u,l())}}});t.update(Mt,u=>u.concat(a)),await t.wait(ts),e.mounted.forEach(u=>u(t))});dh.meta={package:"@milkdown/plugin-listener",displayName:"Listener"};function mh(t){if(!t)return!1;if(Array.isArray(t))return t.length>1?!1:mh(t[0]);let e=t.content;return e?mh(e):t.type==="text"}function BT(t,e){return Object.assign(t,{meta:{package:"@milkdown/plugin-clipboard",...e}}),t}function _x(t,e){let n=bl(e);if(n)return t.dispatch(t.state.tr.replaceSelectionWith(n,!0)),!0;try{return t.dispatch(t.state.tr.replaceSelection(e)),!0}catch{return!1}}var gh=ke(t=>{let e=t.get(Ue);t.update(yr,r=>({...r,editable:r.editable??(()=>!0),transformPastedHTML:(i,o)=>{let s=r.transformPastedHTML;return s&&(i=s(i,o)),i.includes("docs-internal-guid")&&(i=i.replace(/<b[^>]*id="docs-internal-guid[^"]*"[^>]*>([\s\S]*)<\/b>/,"$1"),i=i.replace(/<div[^>]*>(<table[\s\S]*?<\/table>)<\/div>/g,"$1")),i}}));let n=new ne("MILKDOWN_CLIPBOARD");return new te({key:n,props:{handlePaste:(r,i,o)=>{let s=t.get(Ct),l=r.props.editable?.(r.state),{clipboardData:a}=i;if(!l||!a||r.state.selection.$from.node().type.spec.code)return!1;let u=a.getData("text/plain"),c=a.getData("vscode-editor-data");if(c){let d=JSON.parse(c)?.mode;if(u&&d){let{tr:m}=r.state,y=vm("code_block",e);return m.replaceSelectionWith(y.create({language:d})).setSelection(j.near(m.doc.resolve(Math.max(0,m.selection.from-2)))).insertText(u.replace(/\r\n?/g,`
`)),r.dispatch(m),!0}}let f=a.getData("text/html");if(f.length===0&&u.length===0)return!1;if(f.length>0&&o)return _x(r,o);let h=kt.fromSchema(e),p;if(f.length===0){let d=s(u);if(!d||typeof d=="string")return!1;p=xt.fromSchema(e).serializeFragment(d.content)}else{let d=document.createElement("template");d.innerHTML=f,p=d.content.cloneNode(!0),d.remove()}return _x(r,h.parseSlice(p))},clipboardTextSerializer:r=>{let i=t.get(St);if(mh(r.content.toJSON()))return r.content.textBetween(0,r.content.size,`

`);let o=e.topNodeType.createAndFill(void 0,r.content);return o?i(o):""}}})});BT(gh,{displayName:"Prose<clipboard>"});var yh=Ge({shouldAppend:t=>!(!t||["heading","paragraph"].includes(t.type.name)),getNode:t=>t.schema.nodes.paragraph.create()},"trailingConfig");yh.meta={package:"@milkdown/plugin-trailing",displayName:"Ctx<trailingConfig>"};var $x=ke(t=>{let e=new ne("MILKDOWN_TRAILING"),{shouldAppend:n,getNode:r}=t.get(yh.key),i=new te({key:e,state:{init:(o,s)=>{let l=s.tr.doc.lastChild;return n(l,s)},apply:(o,s,l,a)=>{if(!o.docChanged)return s;let u=o.doc.lastChild;return n(u,a)}},appendTransaction:(o,s,l)=>{let{doc:a,tr:u}=l,c=r?.(l),f=i.getState(l),h=a.content.size;if(!(!f||!c))return u.insert(h,c)}});return i});$x.meta={package:"@milkdown/plugin-trailing",displayName:"Prose<trailing>"};var Vx=[yh,$x];return rb(FT);})();

// ── 10-core.js ──────────────────────────────────────────────────
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
    sg1t: '填空：每次都要换的那几个词', sg1s: '模板里写成 {角色} 这种格式。套用模板后，标题和简介里会留下这些紫色的空位，等你填上这一次的内容；其余的字原样保留。',
    sg2t: '做一个填空：选中文字，设为填空', sg2s: '在「存为模板」或编辑模板时，选中标题或简介里每次会变的那段字，上方会浮出「设为填空」。点它或按回车，起个名字（比如「角色」），这段字就变成了填空。也可以直接输入 {角色}。',
    sg3t: '填一个空：点它，直接打字', sg3s: '点一下填空，它会变成橙色的编辑区，上方一直标着原来要填什么。直接输入就会替换掉原文，中文输入法照常用；按回车或 → 就算填完。',
    sg4t: '多个填空：按 Tab 一格一格往下填', sg4s: '进到这一步时光标已经在第一个填空里。按 Tab 跳到下一个，标题填完会接着跳到简介；最后一格按 Tab 或回车就算填完。还有没填的，「下一步」会拦住你，悬停能看到是哪几处。',
    sgKeyTab: '下一个填空', sgKeyDone: '这一格填完', sgKeyBack: '空着时退出；光标在填空后面时整个删掉', sgReplay: '重播', sgDone: '知道了', slotGuide: '填空怎么用', help: '帮助', cleared: '已清空{n}', notReady: '还不能继续：{n}', keyNextHint: '下一步（→，输入时用 ⌘/Ctrl+↵）', keyPrevHint: '上一步（←，输入时用 ⌘/Ctrl+⇧+↵）',
    tour1: '发布拆成四步', tour2: '用中文挑标签', tour3: '一次配置，次次复用', tourStart: '开始', tourSkip: '跳过', tourTry: '用示例模板试试',
    fCodec: '编码', fSize: '大小', fRes: '分辨率', fDur: '时长', fRate: '码率', fFormat: '格式', fCount: '张数', fImgOrder: '拖动图片可以调整顺序', fNoAudio: '无音轨', fPremium: '（高级会员 {n} MB）', fDurHint: '≥ {n} 秒', fRateHint: '按分辨率和帧率有上限，悬停看表', fRateLimit: '{p}p 上限 {n} kb/s（{fps}）', fMaybe: '{n} 帧不重编', fOk: '符合', fReencode: '会被重新编码', fBad: '不符合', fChecking: '检测中', fImgSize: '每张 ≤ {n} MB', fBiggest: '最大一张 {n}', fRejected: '{n} 个文件没传上去：', creatorLinks: '创作者链接',
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
    category: 'Category', searchTags: 'Search tags in English, 简体中文, 繁體中文 or 日本語', videoTags: 'Video tags', mdFormat: 'Formatting', tagProject: 'Questions, or want to help improve the translations? Visit the tag project', imageTags: 'Image tags', tagSourceTip: 'Tags come from Iwara. Only the English names are the site’s own; the Simplified Chinese, Traditional Chinese and Japanese names are AI translations and may be off. When unsure, go by the English name — that is what gets submitted. Tags missing from the local list are also searched on the site, which only understands English.', frequent: 'Frequent', lastUsed: 'Last used', characters: 'Characters', series: 'Series', general: 'General', noResult: 'Nothing found', usedTags: 'Used tags', forgetTag: 'Remove from here', tagForgotten: 'Removed “{n}”', searching: 'Searching', searchingUsers: 'Searching users', searchingSite: 'Searching site tags', fromSite: 'Site tags', suggestTag: 'Suggest a new tag on the original page', clearAll: 'Clear', needCategory: 'Pick a category',
    rating: 'Rating', ratingGeneral: 'General', ratingEcchi: 'Ecchi', visibility: 'Visibility', vPublic: 'Public', vUnlisted: 'Unlisted', vPrivate: 'Friends', sensitive: 'Sensitive content', cover: 'Cover', coverCustom: 'Custom', coverCustomTip: 'Upload your own cover image (Premium)', coverReplaceTip: 'Click to replace the cover image', coverRemove: 'Remove custom cover', coverCustomNote: 'Once published, a custom cover can only be replaced, not switched back to a video frame (server limitation)', coverLockedNote: 'This video has a custom cover: click it to replace the image; it cannot go back to a video frame (server limitation)', reach: 'Who can see it',
    reachPublic: 'Shows up in lists and search', reachUnlisted: 'Kept out of lists and search; anyone with the link can watch', reachPrivate: 'Only your friends can see it', reachSensitive: 'Tagged “{n}”: the site blocks these tags for everyone by default, so only people who unblocked them will see it', reachEcchi: 'Ecchi rating: hidden from people filtering for General only',
    rules: 'I have read and agree to the', rulesLink: 'site rules', checkTitle: 'Title', checkFile: 'File', checkCategory: 'Category', checkSlots: '{n} blanks left', checkRules: 'Rules',
    cooldown: 'Cooldown', publishing: 'Publishing', saving: 'Saving', published: 'Published', saved: 'Saved', transcoding: 'Transcoding', live: 'Live', viewPage: 'View page', another: 'Publish another', manage: 'Content',
    templates: 'Templates', useTemplate: 'Use template', saveAsTemplate: 'Save as template', templateName: 'Template name', myTemplates: 'My templates', samples: 'Samples', lastPublish: 'Last publish', applied: 'Applied “{n}”', tplSaved: 'Template saved', makeSlot: 'Make it a blank', slotName: 'Blank name', slotNameTip: 'A hint for yourself, like “Character” or “Song”', slotHowTo: 'Select some text in the title or description to turn it into a blank', searchTpl: 'Search templates: name, title, tags', keepTitle: 'Title pattern', keepBody: 'Description', keepTags: 'Tags', keepSettings: 'Rating & visibility', exportTpl: 'Export templates', importTpl: 'Import templates', blank: 'Blank', update: 'Update', episode: 'Episode',
    original: 'Original page', backToStudio: 'Back to studio', draftRestored: 'Draft restored', discardDraft: 'Discard draft', unsaved: 'Unsaved changes',
    views: 'Views', likes: 'Likes', comments: 'Comments', works: 'Works', sortNew: 'Newest', sortViews: 'Most viewed', sortLikes: 'Most liked', searchWorks: 'Search titles', empty: 'Nothing here yet', confirmDelete: 'Delete forever?', deleted: 'Deleted', posts: 'Posts', polls: 'Polls',
    sg1t: 'Blanks: the words that change every time', sg1s: 'A template can contain {Character}-style blanks. After you apply it, the title and description keep the rest of the text and leave these purple blanks for this upload.',
    sg2t: 'Make a blank: select text, turn it into a blank', sg2s: 'When saving or editing a template, select the part of the title or description that changes each time. “Make it a blank” pops up above it — click it or press Enter and give it a name. You can also just type {Character}.',
    sg3t: 'Fill a blank: click it and type', sg3s: 'Click a blank and it becomes an orange edit area, with what it stands for shown above. Typing replaces it; press Enter or → when you are done.',
    sg4t: 'Several blanks: Tab through them', sg4s: 'The cursor starts in the first blank. Tab jumps to the next one, from the title on into the description; Tab or Enter on the last one finishes it. “Next” stops you while blanks are left — hover it to see which.',
    sgKeyTab: 'Next blank', sgKeyDone: 'Done with this one', sgKeyBack: 'Leave an empty blank; right after a blank, delete it whole', sgReplay: 'Replay', sgDone: 'Got it', slotGuide: 'How blanks work', help: 'Help', cleared: 'Cleared {n}', notReady: 'Can’t continue yet: {n}', keyNextHint: 'Next (→, or ⌘/Ctrl+↵ while typing)', keyPrevHint: 'Back (←, or ⌘/Ctrl+⇧+↵ while typing)',
    tour1: 'Publishing in four steps', tour2: 'Pick tags in your language', tour3: 'Set it up once, reuse it', tourStart: 'Start', tourSkip: 'Skip', tourTry: 'Try a sample template',
    fCodec: 'Codec', fSize: 'Size', fRes: 'Resolution', fDur: 'Length', fRate: 'Bitrate', fFormat: 'Format', fCount: 'Images', fImgOrder: 'Drag images to reorder', fNoAudio: 'no audio', fPremium: ' (Premium {n} MB)', fDurHint: '≥ {n} s', fRateHint: 'Capped by resolution and frame rate — hover for the table', fRateLimit: '{p}p cap {n} kb/s ({fps})', fMaybe: 'OK at {n} FPS', fOk: 'OK', fReencode: 'Will be re-encoded', fBad: 'Not allowed', fChecking: 'Checking', fImgSize: '≤ {n} MB each', fBiggest: 'largest {n}', fRejected: '{n} file(s) not uploaded: ', creatorLinks: 'Creator links',
    tagStandard: 'Tagging standard',
    staleNote: 'Others may see the change a little later',
  },
};
const env = {
  lang: 'zh', // 界面语言：zh | en
  tagLang: 'zh-CN', // 标签词库里的语言键
  user: null,
};
function detectLang(userLocale) {
  const l = String(userLocale || navigator.language || 'en').toLowerCase();
  env.lang = l.startsWith('zh') ? 'zh' : 'en';
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
  flame: 'M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.6-2.6-5.6-4-8.3-.6 1.8-1.6 3-2.8 3.7C11.9 7.8 11 5.4 9 3.5c.2 3.3-3.5 5.6-3.5 11.3C5.5 18.4 8.1 21 12 21Z',
  users: 'M9 11a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7Zm-6.500 9a6.500 6.500 0 0 1 13 0M16 4.200a3.500 3.500 0 0 1 0 6.600M18 14.200a6.500 6.500 0 0 1 3.500 5.800',
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

const fmtCount = (n) => (n >= 1e4 ? (n / (env.lang === 'zh' ? 1e4 : 1e3)).toFixed(1).replace(/\.0$/, '') + (env.lang === 'zh' ? '万' : 'k') : String(n ?? 0));
const fmtSize = (b) => (b >= 1048576 ? (b / 1048576).toFixed(b >= 104857600 ? 0 : 1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
const fmtDuration = (s) => { s = Math.round(s || 0); const m = Math.floor(s / 60); return `${m}:${String(s % 60).padStart(2, '0')}`; };
const fmtClock = (s) => { s = Math.max(0, Math.round(s)); const hh = Math.floor(s / 3600), mm = Math.floor((s % 3600) / 60); return hh ? `${hh}:${String(mm).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` : `${mm}:${String(s % 60).padStart(2, '0')}`; };
function fmtDate(iso) {
  const d = new Date(iso), diff = (Date.now() - d) / 1000;
  const zh = env.lang === 'zh';
  if (diff < 3600) return Math.max(1, Math.round(diff / 60)) + (zh ? ' 分钟前' : ' min ago');
  if (diff < 86400) return Math.round(diff / 3600) + (zh ? ' 小时前' : ' h ago');
  if (diff < 86400 * 30) return Math.round(diff / 86400) + (zh ? ' 天前' : ' d ago');
  return d.toLocaleDateString();
}

// ── 20-api.js ───────────────────────────────────────────────────
const API = 'https://api.iwara.tv';
const FILES = 'https://files.iwara.tv';
const IMG = 'https://i.iwara.tv/image';
const STAFF = ['janitor', 'moderator', 'officer', 'admin'];
const MB = 1048576;

class ApiError extends Error {
  constructor(status, data) {
    super((data && data.message) || `HTTP ${status}`);
    this.status = status;
    this.data = data || {};
  }
  /** 服务端按字段给的错误：{ tags: 'errors.categoryRequired' } */
  get fields() {
    const out = {};
    for (const e of this.data.errors || []) out[e.field] = e.message;
    return out;
  }
  /**
   * 给人看的错误说明。服务端错误体有三种形状：
   * - 接口：{ message:'errors.validationError', errors:[{ field, message, values? }] }，values 是文案里的占位数字（如 tagLimit 的 limit）
   * - 接口：{ message:'errors.tooManyRequests' } 之类，没有 errors
   * - 上传：{ message, reason:'fileTooLarge'|'invalidMime'|'unknown', data }
   */
  get text() {
    const e0 = (this.data.errors || [])[0];
    if (e0) {
      const lbl = t('fld_' + e0.field);
      return (lbl !== 'fld_' + e0.field ? lbl + (env.lang === 'zh' ? '：' : ': ') : '') + srvText(e0.message, e0.values);
    }
    if (this.status === 0) return t('errNetwork');
    if (this.status === 401) return t('errLogin');
    return srvText(this.data.reason || this.data.message || this.message);
  }
}
/** 'errors.tagLimit' / 'error.serverError' / 'form.videoField.error.fileTooLarge' / 'fileTooLarge' → 本地化文案；没收录的原样返回。 */
function srvText(key, values) {
  const k = 'srv_' + String(key || '').replace(/^(errors?|form\.(video|image)Field\.error)\./, '');
  const s = t(k, values);
  return s === k ? String(key || '') : s;
}

const api = (() => {
  let access = null;
  let accessExp = 0;
  let pending = null;

  async function token() {
    if (access && Date.now() < accessExp) return access;
    if (pending) return pending;
    const refresh = localStorage.getItem('token');
    if (!refresh) throw new ApiError(401, { message: 'login' });
    pending = (async () => {
      const r = await fetch(API + '/user/token', { method: 'POST', headers: { Authorization: 'Bearer ' + refresh } });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.accessToken) throw new ApiError(r.status || 401, { message: 'login' });
      access = j.accessToken;
      try {
        accessExp = JSON.parse(atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000 - 60000;
      } catch {
        accessExp = Date.now() + 10 * 60000;
      }
      return access;
    })();
    try { return await pending; } finally { pending = null; }
  }

  async function call(path, { method = 'GET', body, host = API, auth = true } = {}) {
    // 与当前页面域名一致（www.iwara.tv 或 iwara.tv）
    const headers = { 'X-Site': location.hostname };
    if (auth) headers.Authorization = 'Bearer ' + (await token());
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (host !== API) delete headers['X-Site'];
    const r = await fetch(host + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' });
    const data = r.status === 204 ? null : await r.json().catch(() => null);
    if (!r.ok) throw new ApiError(r.status, data);
    return data;
  }

  /** XHR 上传，带进度与取消。返回 { promise, abort }。 */
  function upload(kind, file, onProgress) {
    const xhr = new XMLHttpRequest();
    const promise = (async () => {
      const tk = await token();
      return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append('file', file);
        xhr.open('POST', `${FILES}/upload/${kind}`);
        xhr.setRequestHeader('Authorization', 'Bearer ' + tk);
        xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total, e.loaded);
        xhr.onload = () => {
          let data = null;
          try { data = JSON.parse(xhr.responseText); } catch { /* 非 JSON */ }
          xhr.status === 201 ? resolve(data) : reject(new ApiError(xhr.status, data));
        };
        xhr.onerror = () => reject(new ApiError(0, { message: 'network' }));
        xhr.onabort = () => reject(new ApiError(-1, { message: 'aborted' }));
        xhr.send(form);
      });
    })();
    return { promise, abort: () => xhr.abort() };
  }

  return { call, upload, token };
})();

// ── 业务接口 ─────────────────────────────────────────────────────────────
const svc = {
  config: null,
  async boot() {
    const [me, config] = await Promise.all([api.call('/user'), api.call('/config').catch(() => null)]);
    env.user = me.user;
    detectLang(me.user.locale);
    svc.config = config || { categories: [], blacklist: [] };
    return me.user;
  },
  get isPremium() { const u = env.user || {}; return !!(u.premium || STAFF.includes(u.role)); },
  /** 视频大小上限（字节），取自站点规则；读不到返回 null（不在本地拦）。 */
  get sizeLimit() { const r = siteRules.video(); const mbv = r && (svc.isPremium ? r.premiumMB || r.sizeMB : r.sizeMB); return mbv ? mbv * MB : null; },
  get isStaff() { return STAFF.includes((env.user || {}).role); },
  get canCustomThumb() { return !!(env.user && (env.user.premium || svc.isStaff)); },

  /** 发布冷却：按类型分开算，GET /user/{video|image}/cooldown → { limited, remaining(秒) }。 */
  async cooldown(kind = 'video') {
    try { return await api.call(`/user/${kind}/cooldown`); } catch { return { limited: false, remaining: 0 }; }
  },

  uploadVideo(file, onProgress) { return api.upload('video', file, onProgress); },
  uploadImage(file, onProgress) { return api.upload('image', file, onProgress); },

  /** 轮询服务端处理进度，直到 completed / failed。onState({status, elapsed}) */
  async waitProcessed(id, key, onState, isCancelled) {
    const started = Date.now();
    for (;;) {
      if (isCancelled()) return null;
      let s = null;
      try { s = await api.call(`/upload/video/${id}/${key}`, { host: FILES, auth: false }); } catch (e) { if (e.status >= 400 && e.status < 500) throw e; }
      if (s) {
        // 处理进度：{ state: 'waiting' | 'active' | 'completed' | 'failed', progress, data }；status 留作兼容
        const st = s.state || s.status;
        if (st === 'completed') return s.data;
        if (st === 'failed') throw new ApiError(422, { message: 'process' });
        onState({ status: st, elapsed: (Date.now() - started) / 1000 });
      }
      await sleep(1000);
    }
  },

  async create(kind, payload) {
    return api.call(kind === 'video' ? '/videos' : '/images', { method: 'POST', body: payload });
  },
  async update(kind, id, payload) {
    const res = await api.call(`/${kind}/${id}`, { method: 'PUT', body: payload });
    // 详情接口有服务端缓存，保存后一段时间内读到的还是旧值：把这次的结果记下来，下次编辑以它为准。
    store.set('fresh:' + id, { at: Date.now(), data: res });
    return res;
  },
  /** 取详情用于编辑预填：本地记着更新的一份就用本地的。 */
  async detail(kind, id) {
    const remote = await api.call(`/${kind}/${id}`);
    const local = store.get('fresh:' + id);
    if (local && local.data && new Date(local.data.updatedAt || 0) > new Date(remote.updatedAt || 0)) return local.data;
    return remote;
  },
  remove(kind, id) { return api.call(`/${kind}/${id}`, { method: 'DELETE' }); },

  /** 我的作品：管理列表（实时、字段少）+ 公开列表（带封面和标签）按 id 合并。 */
  async myContent(kind, page = 0) {
    const uidv = env.user.id;
    const [list, rich] = await Promise.all([
      api.call(`/user/${uidv}/content/${kind}s?page=${page}`),
      api.call(`/${kind}s?user=${uidv}&sort=date&rating=all&limit=32&page=${page}`).catch(() => ({ results: [] })),
    ]);
    const byId = new Map(rich.results.map((r) => [r.id, r]));
    return { count: list.count, limit: list.limit, results: list.results.map((r) => ({ ...(byId.get(r.id) || {}), ...r, __rich: byId.has(r.id) })) };
  },
  myRecent(kind = 'video', limit = 32) {
    return api.call(`/${kind}s?user=${env.user.id}&sort=date&rating=all&limit=${limit}`).then((r) => r.results, () => []);
  },
  searchUsers: (q) => api.call('/autocomplete/users?query=' + encodeURIComponent(q)).then((r) => r.results || [], () => []),
  searchTags: (q) => api.call('/autocomplete/tags?query=' + encodeURIComponent(q)).then((r) => r.results || [], () => []),
};

const thumbUrl = {
  video(v, index) {
    if (!v) return null;
    if (v.customThumbnail) return thumbUrl.file(v.customThumbnail);
    if (!v.file) return null;
    return `${IMG}/thumbnail/${v.file.id}/thumbnail-${String(index ?? v.thumbnail ?? 0).padStart(2, '0')}.jpg`;
  },
  // 站点除 original 以外的尺寸一律是 jpg：x.png 的缩略图地址是 /thumbnail/{id}/x.jpg
  file: (f, size = 'thumbnail') => (f ? `${IMG}/${size}/${f.id}/${size === 'original' ? f.name : f.name.replace(/\.[^.]+$/, '') + '.jpg'}` : null),
  avatar: (u) => (u && u.avatar ? thumbUrl.file(u.avatar, 'avatar') : null),
};

// ── 25-siterules.js ─────────────────────────────────────────────
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
      const code = env.lang === 'zh' ? 'zh' : env.lang === 'ja' ? 'ja' : 'en';
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

// ── 30-ui.js ────────────────────────────────────────────────────
const STYLE = [];
const ui = { root: null, layer: null };

STYLE.push(`
:host{all:initial;display:block}
.app{--bg:#fafafa;--card:#fff;--sunk:#f4f4f5;--fg:#171717;--fg2:#666;--fg3:#8f8f8f;--line:#eaeaea;--line2:#d9d9d9;--inv:#fff;
  --blue:#0070f3;--red:#e5484d;--amber:#d97706;--green:#16a34a;--violet:#7c3aed;--shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.08);
  --spring:linear(0,.009,.035 2.1%,.141 4.4%,.723 12.9%,.938 16.7%,1.017,1.077 20.4%,1.121,1.149 24.3%,1.159,1.163,1.161,1.154 29.9%,1.129 32.8%,1.051 39.6%,1.017 43.1%,.991,.977 51%,.974 53.8%,.975 57.1%,.997 69.8%,1.003 76.9%,1);
  --ease:cubic-bezier(.22,1,.36,1);
  font:14px/1.5 Geist,Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans","Microsoft YaHei",sans-serif;color:var(--fg);background:var(--bg);
  min-height:calc(100vh - 64px);-webkit-font-smoothing:antialiased;font-feature-settings:"tnum","cv11";letter-spacing:-.006em;position:relative}
.app[data-theme=dark]{--bg:#0a0a0a;--card:#111;--sunk:#1a1a1a;--fg:#ededed;--fg2:#a1a1a1;--fg3:#6f6f6f;--line:#242424;--line2:#333;--inv:#0a0a0a;
  --blue:#3b9eff;--red:#ff6369;--amber:#f5a524;--green:#3dd68c;--violet:#a78bfa;--shadow:0 1px 2px rgba(0,0,0,.4),0 12px 32px rgba(0,0,0,.5)}
*{box-sizing:border-box}
.ic{flex:none;display:block}
button{font:inherit;color:inherit;letter-spacing:inherit}
input,textarea{font:inherit;color:inherit;letter-spacing:inherit}
::selection{background:color-mix(in srgb,var(--blue) 28%,transparent)}
a{color:inherit}
.mono{font-family:"Geist Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-feature-settings:"tnum"}
.row{display:flex;align-items:center;gap:8px}.grow{flex:1;min-width:0}.col{display:flex;flex-direction:column}
.label{font-size:12px;font-weight:500;color:var(--fg2);letter-spacing:.01em}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 14px;border-radius:8px;border:1px solid var(--line2);background:var(--card);
  font-weight:500;font-size:14px;cursor:pointer;white-space:nowrap;user-select:none;transition:background .15s,border-color .15s,transform .2s var(--ease),opacity .15s,box-shadow .15s}
.btn:hover{background:var(--sunk)}
.btn:active{transform:scale(.97)}
.btn:focus-visible,.seg button:focus-visible,.chip:focus-visible,.ibtn:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.btn.primary{background:var(--fg);color:var(--inv);border-color:var(--fg)}
.btn.primary:hover{opacity:.88}
.btn.ghost{border-color:transparent;background:transparent}
.btn.ghost:hover{background:var(--sunk)}
.btn.danger{color:var(--red)}
.btn.sm{height:30px;padding:0 10px;font-size:13px;border-radius:7px}
.btn[disabled]{opacity:.45;cursor:not-allowed;transform:none}
.ibtn{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:8px;border:0;background:transparent;color:var(--fg2);cursor:pointer;transition:background .15s,color .15s,transform .2s var(--ease)}
.ibtn:hover{background:var(--sunk);color:var(--fg)}
.ibtn:active{transform:scale(.9)}
.ibtn.on{background:var(--sunk);color:var(--fg)}

.seg{position:relative;display:inline-flex;padding:3px;border-radius:10px;background:var(--sunk);border:1px solid var(--line)}
.seg button{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:0;background:none;border-radius:7px;cursor:pointer;color:var(--fg2);font-weight:500;font-size:13px;transition:color .2s}
.seg button[aria-pressed=true]{color:var(--fg)}
.seg .thumb{position:absolute;top:3px;left:0;height:30px;border-radius:7px;background:var(--card);box-shadow:0 0 0 1px var(--line),0 1px 2px rgba(0,0,0,.06);transition:transform .38s var(--ease),width .38s var(--ease)}
.app[data-theme=dark] .seg .thumb{background:#2b2b2b;box-shadow:0 0 0 1px #3a3a3a}
.seg.wide{display:flex}.seg.wide button{flex:1;justify-content:center}

.chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px;border-radius:999px;border:1px solid var(--line2);background:var(--card);font-size:13px;cursor:pointer;white-space:nowrap;
  transition:background .15s,border-color .15s,color .15s,transform .25s var(--ease)}
.chip:hover{border-color:var(--fg3)}
.chip:active{transform:scale(.95)}
.chip.on{background:var(--fg);border-color:var(--fg);color:var(--inv)}
.chip .sub{color:var(--fg3);font-size:11px}
.chip.on .sub{color:color-mix(in srgb,var(--inv) 60%,transparent)}

.field{display:flex;align-items:center;gap:8px;height:40px;padding:0 12px;border-radius:9px;border:1px solid var(--line2);background:var(--card);transition:border-color .15s,box-shadow .15s}
.field:focus-within{border-color:var(--fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--fg) 9%,transparent)}
.field input{flex:1;min-width:0;border:0;outline:0;background:none;height:100%}
.field input::placeholder,textarea::placeholder{color:var(--fg3)}
.field .ic{color:var(--fg3)}

.card{background:var(--card);border:1px solid var(--line);border-radius:12px}

.layer{position:fixed;inset:0;pointer-events:none;z-index:2147483000}
.layer>*{pointer-events:auto}
.tip{position:fixed;padding:5px 8px;border-radius:6px;background:var(--fg);color:var(--inv);font-size:12px;font-weight:500;white-space:nowrap;pointer-events:none!important;opacity:0;transform:translateY(3px) scale(.96);transition:opacity .12s,transform .2s var(--ease)}
.tip.in{opacity:1;transform:none}
.pop{position:fixed;min-width:180px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);padding:5px;opacity:0;transform:scale(.94) translateY(-4px);transition:opacity .14s,transform .34s var(--spring)}
.pop.in{opacity:1;transform:none}
.pop .item{display:flex;align-items:center;gap:10px;width:100%;height:34px;padding:0 10px;border:0;background:none;border-radius:8px;cursor:pointer;text-align:left;font-size:13.5px}
.pop .item:hover,.pop .item.cur{background:var(--sunk)}
.pop .item .ic{color:var(--fg2)}
.pop .item.danger,.pop .item.danger .ic{color:var(--red)}
.pop hr{border:0;border-top:1px solid var(--line);margin:5px -5px}
.pop .head{padding:6px 10px 4px;font-size:11px;font-weight:600;color:var(--fg3);letter-spacing:.04em;text-transform:uppercase}

.toasts{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px}
.toast{display:flex;align-items:center;gap:10px;height:42px;padding:0 8px 0 14px;border-radius:12px;background:var(--fg);color:var(--inv);font-size:13.5px;font-weight:500;box-shadow:var(--shadow);animation:toastIn .5s var(--spring)}
.toast:not(:has(button)){padding-right:14px}
.toast.out{transition:opacity .2s,transform .2s;opacity:0;transform:translateY(8px) scale(.96)}
.toast button{height:28px;padding:0 10px;border:0;border-radius:8px;background:color-mix(in srgb,var(--inv) 16%,transparent);color:var(--inv);font-weight:600;font-size:13px;cursor:pointer}
.toast.err{background:var(--red);color:#fff}
@keyframes toastIn{from{opacity:0;transform:translateY(16px) scale(.9)}}

.scrim{position:fixed;inset:0;overscroll-behavior:contain;background:rgba(0,0,0,.42);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:grid;place-items:center;padding:24px;opacity:0;transition:opacity .22s}
.scrim.in{opacity:1}
.sheet{width:min(560px,100%);max-height:min(86vh,760px);overflow:auto;overscroll-behavior:contain;background:var(--card);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);transform:translateY(18px) scale(.96);opacity:0;transition:transform .5s var(--spring),opacity .2s}
.scrim.in .sheet{transform:none;opacity:1}
.sheet>header{display:flex;align-items:center;gap:10px;padding:16px 16px 0 20px;font-weight:600;font-size:16px}
.sheet>.body{padding:16px 20px 20px}
.sheet>footer{display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid var(--line);background:color-mix(in srgb,var(--sunk) 60%,transparent);border-radius:0 0 16px 16px;position:sticky;bottom:0}

.spin{width:16px;height:16px;border-radius:50%;border:2px solid color-mix(in srgb,currentColor 25%,transparent);border-top-color:currentColor;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(1turn)}}
/* 骨架：加载时先摆出内容的形状，比转圈更能看出马上会出现什么 */
.skel{display:block;flex:none;border-radius:6px;background:linear-gradient(100deg,var(--sunk) 40%,var(--line) 50%,var(--sunk) 60%) 0/300% 100%;animation:shimmer 1.4s infinite linear}
.skel.round{border-radius:50%}
@keyframes shimmer{to{background-position:-150% 0}}
.infotip{display:inline-grid;place-items:center;width:20px;height:20px;margin:0 2px;padding:0;border:0;border-radius:50%;background:none;color:var(--fg3);cursor:help;vertical-align:middle;transition:color .15s,background .15s}
.infotip:hover,.infotip:focus-visible{color:var(--fg);background:var(--sunk);outline:0}
.infotext{max-width:320px;padding:6px 8px;font-size:12.5px;line-height:1.65;color:var(--fg2);white-space:normal}
.infolink{display:flex;align-items:center;gap:6px;margin:8px -8px -6px;padding:8px;border-top:1px solid var(--line);color:var(--fg);font-weight:500;text-decoration:none;border-radius:0 0 8px 8px;transition:background .15s}
.infolink span{flex:1}.infolink:hover{background:var(--sunk)}
.clr{display:inline-flex;align-items:center;gap:4px;flex:none;height:26px;padding:0 8px;border:0;border-radius:7px;background:none;color:var(--fg3);font-size:12px;font-weight:500;cursor:pointer;
  transition:opacity .2s,transform .35s var(--spring),background .15s,color .15s}
.clr:hover{background:var(--sunk);color:var(--fg)}
.clr.off{opacity:0;transform:scale(.8);pointer-events:none;transition:opacity .15s,transform .2s ease}
.skrow{display:flex;align-items:center;gap:10px;height:38px;padding:0 10px}
@keyframes pop{from{transform:scale(.6);opacity:0}}
@keyframes rise{from{transform:translateY(10px);opacity:0}}
@keyframes shake{20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
.stagger>*{animation:rise .5s var(--ease) backwards}
.stagger>:nth-child(2){animation-delay:.04s}.stagger>:nth-child(3){animation-delay:.08s}.stagger>:nth-child(4){animation-delay:.12s}.stagger>:nth-child(5){animation-delay:.16s}.stagger>:nth-child(6){animation-delay:.2s}.stagger>:nth-child(n+7){animation-delay:.24s}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
`);

// ── 悬停提示：任何带 data-tip 的元素 ──────────────────────────────────────
function installTips(root) {
  const tip = h('div.tip');
  ui.layer.append(tip);
  let cur = null;
  const hide = () => { cur = null; tip.classList.remove('in'); };
  root.addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('[data-tip]');
    if (!el || el === cur) return;
    cur = el;
    tip.textContent = el.dataset.tip;
    const r = el.getBoundingClientRect();
    const w = tip.offsetWidth, hh = tip.offsetHeight;
    const above = r.top > hh + 12;
    tip.style.left = clamp(r.left + r.width / 2 - w / 2, 6, innerWidth - w - 6) + 'px';
    tip.style.top = (above ? r.top - hh - 6 : r.bottom + 6) + 'px';
    tip.classList.add('in');
  });
  root.addEventListener('pointerout', (e) => { if (cur && !cur.contains(e.relatedTarget)) hide(); });
  root.addEventListener('pointerdown', hide, true);
}

function btn(label, opts = {}) {
  const b = h('button.btn' + (opts.kind ? '.' + opts.kind : '') + (opts.sm ? '.sm' : ''), { type: 'button', onclick: opts.onclick, disabled: opts.disabled },
    opts.icon && icon(opts.icon, opts.sm ? 14 : 16), label && h('span', label), opts.iconRight && icon(opts.iconRight, 16));
  if (opts.tip) b.dataset.tip = opts.tip;
  return b;
}
function ibtn(name, tip, onclick, size = 16) {
  return h('button.ibtn', { type: 'button', onclick, data: tip ? { tip } : {} , 'aria-label': tip }, icon(name, size));
}

/** 分段选择：滑块用弹簧曲线跟到当前项。options: [{value,label,icon,tip}] */
function segmented(options, value, onChange, { wide } = {}) {
  const thumb = h('div.thumb');
  const el = h('div.seg' + (wide ? '.wide' : ''), { role: 'group' }, thumb);
  const buttons = options.map((o) => {
    const b = h('button', { type: 'button', onclick: () => { if (value !== o.value) { set(o.value); onChange(o.value); } }, data: o.tip ? { tip: o.tip } : {} }, o.icon && icon(o.icon, 15), o.label);
    el.append(b);
    return b;
  });
  const place = () => {
    const i = options.findIndex((o) => o.value === value);
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    const b = buttons[i];
    if (!b || !b.offsetWidth) return;
    thumb.style.width = b.offsetWidth + 'px';
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
  };
  function set(v) { value = v; place(); }
  new ResizeObserver(place).observe(el);
  requestAnimationFrame(place);
  el.set = set;
  return el;
}

/** 浮层：贴着锚点弹出，点外面或 Esc 关闭。返回 close()。 */
function popover(anchor, content, { align = 'start', width, onClose } = {}) {
  const pop = h('div.pop', { style: width ? { width: width + 'px' } : null }, content);
  ui.layer.append(pop);
  const place = () => {
    const r = anchor.getBoundingClientRect();
    const w = pop.offsetWidth, hh = pop.offsetHeight;
    const below = r.bottom + hh + 8 < innerHeight || r.top < hh + 8;
    pop.style.left = clamp(align === 'end' ? r.right - w : align === 'center' ? r.left + r.width / 2 - w / 2 : r.left, 8, innerWidth - w - 8) + 'px';
    pop.style.top = (below ? r.bottom + 6 : r.top - hh - 6) + 'px';
    pop.style.transformOrigin = `${align === 'end' ? 'right' : 'left'} ${below ? 'top' : 'bottom'}`;
  };
  place();
  requestAnimationFrame(() => pop.classList.add('in'));
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    pop.classList.remove('in');
    document.removeEventListener('pointerdown', onDown, true);
    document.removeEventListener('keydown', onKey, true);
    removeEventListener('resize', close);
    setTimeout(() => pop.remove(), 160);
    onClose && onClose();
  };
  const onDown = (e) => { const path = e.composedPath(); if (!path.includes(pop) && !path.includes(anchor)) close(); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  setTimeout(() => {
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('keydown', onKey, true);
    addEventListener('resize', close);
  });
  pop.close = close;
  pop.replace = place;
  return pop;
}
/**
 * 一键清空的小按钮：有内容才出现（淡入 + 回弹），清空后给一个可以撤销的提示。
 * what：提示里说清空了什么；read() 取当前值，write(v) 写回（清空时写 empty，撤销时写原值）。
 */
function clearBtn(what, { read, write, empty = '' }) {
  const el = h('button.clr.off', { type: 'button', tabIndex: -1, title: t('clearAll') + ' ' + what, onpointerdown: (e) => e.preventDefault() }, icon('x', 12), t('clearAll'));
  el.addEventListener('click', () => {
    const before = read();
    write(typeof empty === 'function' ? empty() : empty);
    toast(t('cleared', { n: what }), { action: t('undo'), onAction: () => write(before) });
  });
  return { el, show(on) { el.classList.toggle('off', !on); el.tabIndex = on ? 0 : -1; } };
}

/** 骨架块：宽、高（数字是 px，也可以是 CSS 长度）；radius 传 true 是圆形，传数字是圆角。 */
function skel(w, hgt, radius) {
  const v = (x) => (typeof x === 'number' ? x + 'px' : x);
  const el = h('span.skel' + (radius === true ? '.round' : ''), { style: { width: v(w), height: v(hgt) } });
  if (typeof radius === 'number') el.style.borderRadius = radius + 'px';
  return el;
}

/**
 * 悬停面板：鼠标停在 anchor 上就贴着它弹出，移开就收。build() 每次现算内容，返回 null 不弹。
 * 鼠标可以从 anchor 挪到面板上（中间那道缝留了一小段宽限期），停在面板上它就不收，方便细看、选文字。
 */
function hoverPanel(anchor, build) {
  let pop = null, timer = 0;
  const later = () => { clearTimeout(timer); timer = setTimeout(close, 180); };
  const close = () => { clearTimeout(timer); if (!pop) return; const p = pop; pop = null; p.classList.remove('in'); setTimeout(() => p.remove(), 160); };
  const open = () => {
    const content = build();
    if (!content || !anchor.isConnected) return;
    pop = h('div.pop', content);
    pop.addEventListener('pointerenter', () => clearTimeout(timer));
    pop.addEventListener('pointerleave', later);
    ui.layer.append(pop);
    // 对准文字本身：触发区常常是撑满一行的格子（文字后面一大段空白），按它的中心放会离文字很远
    const rg = document.createRange();
    rg.selectNodeContents(anchor);
    const tr = rg.getBoundingClientRect();
    const r = tr.width ? tr : anchor.getBoundingClientRect(), w = pop.offsetWidth, hh = pop.offsetHeight;
    const above = r.top > hh + 12;
    pop.style.left = clamp(r.left + r.width / 2 - w / 2, 8, innerWidth - w - 8) + 'px';
    pop.style.top = (above ? r.top - hh - 8 : r.bottom + 8) + 'px';
    pop.style.transformOrigin = `center ${above ? 'bottom' : 'top'}`;
    requestAnimationFrame(() => pop && pop.classList.add('in'));
  };
  anchor.addEventListener('pointerenter', () => { clearTimeout(timer); if (!pop) timer = setTimeout(open, 120); });
  anchor.addEventListener('pointerleave', later);
  anchor.addEventListener('pointerdown', close);
  // 键盘：Tab 到触发点上也能看
  anchor.addEventListener('focus', () => { clearTimeout(timer); if (!pop) open(); });
  anchor.addEventListener('blur', later);
}

/** 标题旁的 ⓘ：悬停或 Tab 聚焦时弹出说明文字。 */
/** link = { label, href }：卡片底部再放一个新开页签的链接（卡片鼠标能移进去，点得到）。 */
function infoTip(text, link = null) {
  const el = h('button.infotip', { type: 'button', 'aria-label': text, onclick: (e) => e.preventDefault() }, icon('info', 14));
  hoverPanel(el, () => h('div.infotext', text, link && h('a.infolink', { href: link.href, target: '_blank', rel: 'noopener' }, h('span', link.label), icon('external', 13))));
  return el;
}

/** 菜单：items = [{icon,label,onclick,danger} | '-' | {head}] */
function menu(anchor, items, opts) {
  const box = h('div');
  const pop = popover(anchor, box, { align: 'end', ...opts });
  for (const it of items) {
    if (!it) continue;
    if (it === '-') box.append(h('hr'));
    else if (it.head) box.append(h('div.head', it.head));
    else box.append(h('button.item' + (it.danger ? '.danger' : ''), { type: 'button', onclick: () => { pop.close(); it.onclick(); } }, it.icon && icon(it.icon), h('span.grow', it.label), it.right));
  }
  pop.replace();
  return pop;
}

function toast(message, { action, onAction, error, ms = 3200 } = {}) {
  let box = ui.layer.querySelector('.toasts');
  if (!box) ui.layer.append((box = h('div.toasts')));
  const el = h('div.toast' + (error ? '.err' : ''), error ? icon('warn') : null, h('span', message), action && h('button', { onclick: () => { onAction(); bye(); } }, action));
  box.append(el);
  const bye = () => { el.classList.add('out'); setTimeout(() => el.remove(), 220); };
  setTimeout(bye, action ? ms + 2500 : ms);
  return bye;
}

/** 居中弹层。build(close) 返回 {title, body, footer}。 */
// 弹层打开期间锁住页面滚动：否则在弹层里滚到头，滚动会传给背后的页面（可叠多层，计数）
let scrollLocks = 0, savedOverflow = '';
function lockScroll() { if (!scrollLocks++) { savedOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; } }
function unlockScroll() { if (scrollLocks && !--scrollLocks) document.documentElement.style.overflow = savedOverflow; }
function sheet(build, { width, onClose } = {}) {
  const scrim = h('div.scrim');
  let closed = false;
  const close = () => { if (closed) return; closed = true; scrim.classList.remove('in'); document.removeEventListener('keydown', onKey, true); unlockScroll(); onClose && onClose(); setTimeout(() => scrim.remove(), 240); };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const parts = build(close);
  const box = h('div.sheet', { style: width ? { width: `min(${width}px,100%)` } : null },
    parts.title && h('header', h('span.grow', parts.title), ibtn('x', t('close'), close)),
    h('div.body', parts.body), parts.footer && h('footer', parts.footer));
  scrim.append(box);
  scrim.addEventListener('pointerdown', (e) => { if (e.target === scrim) close(); });
  document.addEventListener('keydown', onKey, true);
  ui.layer.append(scrim);
  lockScroll();
  requestAnimationFrame(() => scrim.classList.add('in'));
  return close;
}

/** 数字变化时做一个上下翻动。 */
function ticker(el, text) {
  if (el.textContent === text) return;
  el.textContent = text;
  if (!reducedMotion()) el.animate([{ transform: 'translateY(40%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
}

// ── 40-markdown.js ──────────────────────────────────────────────
// 简介编辑器：所见即所得的 Markdown 编辑。内核是开源的 Milkdown（ProseMirror + remark），
// 由 build.mjs 用 esbuild 打进脚本（全局 MK，见 vendor/milkdown.js）。
// 输入规则：打 `## `、`> `、`- `、`**字**` 当场变样式。
// 回车 = 新段落（Markdown 里空一行）；Shift+回车 = 段内换行，输出成行尾两个空格——站点只认这种换行。

const SLOT_RE = /\{([^{}\n]{1,24})\}/g;

const md = {
  slots: (text) => [...String(text || '').matchAll(SLOT_RE)].map((m) => m[1]),
  /** 编辑器吐出的 Markdown 收个尾：裸链接别包尖括号（站点按原文显示链接），去掉末尾空行。 */
  tidy: (text) => String(text || '').replace(/<(https?:\/\/[^\s<>]+)>/g, '$1').trimEnd(),
};

STYLE.push(`
.md{border:1px solid var(--line2);border-radius:12px;background:var(--card);transition:border-color .15s,box-shadow .15s}
.md:focus-within{border-color:var(--fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--fg) 9%,transparent)}
.md{display:flex;flex-direction:column}
.md-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;min-height:30px;padding:0 10px 8px;margin-top:-10px}
.md-foot .count{font-size:12px;color:var(--fg3)}
.mdfmt{margin-right:auto;display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 8px 0 6px;margin-left:-6px;border:0;border-radius:6px;background:none;color:var(--fg3);font:inherit;font-size:12px;cursor:pointer;transition:color .15s,background .15s}
.mdfmt:hover{color:var(--fg);background:var(--sunk)}
.md-doc{cursor:text}
.md-doc .ProseMirror{position:relative;outline:0;min-height:240px;padding:14px 18px 18px;font-size:15px;line-height:1.7;word-wrap:break-word;white-space:pre-wrap;white-space:break-spaces;font-variant-ligatures:none}
.md-doc .ProseMirror>:first-child{margin-top:0}
.md-doc .ProseMirror pre{white-space:pre-wrap}
.md-doc .ProseMirror li{position:relative}
.md-doc .ProseMirror li>p{margin:0}
.md-doc .ProseMirror-hideselection *::selection{background:transparent}
.md-doc .ProseMirror-selectednode{outline:2px solid var(--blue);outline-offset:2px}
.md-doc img.ProseMirror-separator{display:inline!important;border:none!important;margin:0!important}
.md-doc .ProseMirror .ph::before{content:attr(data-ph);float:left;height:0;pointer-events:none;color:var(--fg3)}
.prose p{margin:.45em 0}.prose h1,.prose h2,.prose h3,.prose h4,.prose h5,.prose h6{margin:.7em 0 .3em;line-height:1.3;letter-spacing:-.02em}
.prose h1{font-size:1.6em}.prose h2{font-size:1.35em}.prose h3{font-size:1.15em}.prose h4,.prose h5,.prose h6{font-size:1em}
.prose ul,.prose ol{margin:.45em 0;padding-left:1.4em}.prose li{margin:.15em 0}
.prose blockquote{margin:.5em 0;padding:.1em 0 .1em 14px;border-left:3px solid var(--line2);color:var(--fg2)}
.prose hr{border:0;border-top:1px solid var(--line2);margin:1em 0}
.prose code{font:.88em "Geist Mono",ui-monospace,Menlo,monospace;background:var(--sunk);border:1px solid var(--line);border-radius:5px;padding:.1em .35em}
.prose pre{margin:.5em 0;padding:12px 14px;background:var(--sunk);border:1px solid var(--line);border-radius:10px;overflow:auto}
.prose pre code{background:none;border:0;padding:0}
.prose img{max-width:100%;max-height:420px;border-radius:10px;display:block;margin:.4em 0;border:1px solid var(--line)}
.prose a{color:var(--blue);text-decoration:none}.prose a:hover{text-decoration:underline}
.prose table{border-collapse:collapse;margin:.5em 0}.prose th,.prose td{border:1px solid var(--line2);padding:4px 10px}
.slot-edit{border-radius:5px;background:color-mix(in srgb,var(--amber) 16%,transparent);box-shadow:0 0 0 1.5px var(--amber);color:var(--fg)}
.slot-edit.empty{display:inline-block;min-width:1.6em;height:1.25em;vertical-align:-.25em;margin:0 1px}
.slot-tip{position:fixed;padding:3px 8px;border-radius:6px;background:var(--amber);color:#fff;font-size:12px;font-weight:600;white-space:nowrap;pointer-events:none!important;opacity:0;transform:translateY(4px) scale(.92);transition:opacity .14s,transform .3s var(--spring)}
.slot-tip::after{content:"";position:absolute;left:50%;bottom:-4px;width:8px;height:8px;margin-left:-4px;background:inherit;transform:rotate(45deg);border-radius:1px}
.slot-tip.in{opacity:1;transform:none}
.slot{padding:0 3px;border-radius:5px;outline:1px dashed color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent);color:var(--violet)}
.md-doc .mention{color:var(--blue);font-weight:500;border-radius:4px;transition:background .15s}
/* 站内链接：前面一个类型小图标；正在换作品名时网址闪一闪 */
.md-doc .lk-ic{display:inline-flex;vertical-align:-2px;margin:0 3px 0 1px;color:var(--blue);user-select:none}
.md-doc .lk-wait{color:var(--fg3)!important;background:linear-gradient(90deg,transparent 0,color-mix(in srgb,var(--blue) 18%,transparent) 50%,transparent 100%) 0 0/200% 100%;animation:lkwait 1.1s linear infinite;border-radius:4px}
@keyframes lkwait{from{background-position:150% 0}to{background-position:-50% 0}}
.md-doc .mention:hover{background:color-mix(in srgb,var(--blue) 10%,transparent)}
.md-doc .mention-chip{color:var(--blue);font-weight:500;border-radius:4px;padding:0 1px;cursor:default;user-select:none}
.md-doc .mention-raw{font-size:0;letter-spacing:0}
.mbox{min-width:220px}
.smk-tip{padding:0 12px 8px;font-size:11.5px;color:var(--fg3);max-width:240px}
.keep .md-doc .ProseMirror{min-height:110px;font-size:14px}
.mstate{display:flex;align-items:center;gap:8px;height:34px;padding:0 10px;font-size:13px;color:var(--fg3)}
.mlist{transition:opacity .15s}.mlist.stale{opacity:.5}
.who{display:flex;align-items:center;gap:10px}
.who .av{width:24px;height:24px;border-radius:50%;background:var(--sunk) center/cover;display:grid;place-items:center;font-size:11px;font-weight:600;color:var(--fg2);flex:none}
.who small{color:var(--fg3);font-size:12px}
`);

/** 填空位的常驻提示：挂在编辑区上方，写着这里原来要填什么。标题和简介共用这套样子。 */
function slotTip() {
  const el = h('div.slot-tip');
  let shown = false;
  return {
    show(rect, label) {
      if (!el.isConnected) ui.layer.append(el);
      if (el.textContent !== label) el.textContent = label;
      const w = el.offsetWidth, hh = el.offsetHeight;
      el.style.left = clamp((rect.left + rect.right) / 2 - w / 2, 6, innerWidth - w - 6) + 'px';
      el.style.top = Math.max(6, rect.top - hh - 8) + 'px';
      if (!shown) { shown = true; requestAnimationFrame(() => el.classList.add('in')); }
    },
    hide() { shown = false; el.classList.remove('in'); },
    remove() { el.remove(); },
  };
}

/** 选中文字后浮出的「设为填空」：先是一个按钮，点了变成起名输入框，回车把选中的字换成 {名字}。
 *  anchor 只需要 getBoundingClientRect；按钮不抢焦点，选区保持不动。 */
function slotMakerPop(anchor, picked, guess, onApply, onClose) {
  const box = h('div');
  const pop = popover(anchor, box, { onClose });
  const ask = () => {
    pop.asking = true;
    const input = h('input', { value: guess || picked.trim(), placeholder: t('slotName'), maxLength: 24, onkeydown: (e) => {
      if (e.key !== 'Enter' || e.isComposing || !input.value.trim()) return;
      e.preventDefault();
      const name = input.value.trim().replace(/[{}]/g, '');
      pop.close();
      onApply(name);
    } });
    clear(box).append(h('div.field', { style: { border: 0, boxShadow: 'none', width: '240px' } }, icon('sparkle'), input), h('div.smk-tip', t('slotNameTip')));
    pop.replace();
    setTimeout(() => { input.focus(); input.select(); }, 30);
  };
  box.append(h('button.item', { type: 'button', onpointerdown: (e) => e.preventDefault(), onclick: ask }, icon('sparkle'), h('span.grow', t('makeSlot')), h('span.kbd', '↵')));
  pop.ask = ask;
  return pop;
}
/** 原生输入框里某个字符位置的屏幕坐标（量同字体的隐藏文字宽度）。 */
function inputCaretRect(input, pos) {
  const cs = getComputedStyle(input);
  const span = h('span', { style: { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', font: cs.font, letterSpacing: cs.letterSpacing } }, input.value.slice(0, pos));
  ui.layer.append(span);
  const w = span.offsetWidth;
  span.remove();
  const r = input.getBoundingClientRect();
  const x = r.left + parseFloat(cs.paddingLeft) + w - input.scrollLeft;
  return { left: x, right: x + 1, top: r.top, bottom: r.bottom, width: 1, height: r.height };
}
const okSlotText = (s) => !!s.trim() && s.length <= 24 && !/[{}\n]/.test(s);

/** 文档里已经输完的 @用户名（光标还贴在末尾、正在输入的那个不算；代码里的不算）。 */
const MENTION_RE = /(?<![\w@/.])@([A-Za-z0-9_.-]{2,40})/g;
function findMentions(state, withCaret = false) {
  const out = [];
  const { empty, from: caret } = state.selection;
  state.doc.descendants((node, pos, parent) => {
    if (!node.isText || (parent && parent.type.spec.code) || node.marks.some((m) => m.type.name === 'inlineCode' || m.type.name === 'link')) return;
    for (const m of node.text.matchAll(MENTION_RE)) {
      const name = m[1].replace(/[.-]+$/, '');
      const from = pos + m.index, to = from + 1 + name.length;
      if (!withCaret && empty && caret === to) continue;
      out.push({ from, to, name });
    }
  });
  return out;
}
// @用户名 显示成昵称：昵称和站内链接的作品名共用一份缓存（键是个人页网址，走同一个轻量接口）
const profileHref = (name) => 'https://www.iwara.tv/profile/' + name;
function mentionNick(name) { const e = linkTitles.get(profileHref(name)); return e && e.state === 'ok' ? e.title : null; }
/** 显示成昵称的 @提及：原文还是 @用户名（站点只认这个），编辑区里藏起来、前面放一个昵称块，整块进退、整块删。 */
const findChips = (state) => findMentions(state, true).filter((m) => mentionNick(m.name));

/** 在文档里找所有 {填空}，返回 [{from,to}]（ProseMirror 位置）。 */
function findSlots(doc) {
  const out = [];
  doc.descendants((node, pos) => {
    if (!node.isText) return;
    for (const m of node.text.matchAll(SLOT_RE)) out.push({ from: pos + m.index, to: pos + m.index + m[0].length });
  });
  return out;
}

// ── 链接 ──
// 站内链接（视频 / 图片 / 用户 / 播放列表 / 论坛帖）用站点的轻量接口换成作品名，和 App 里正文的显示一致。
const IWARA_LINK_RE = /^https?:\/\/(?:www\.)?iwara\.tv\/(video|image|profile|playlist|forum)\/([^/\s?#]+)(?:\/([^/\s?#]+))?/i;
const LINK_TYPE_ICON = { video: 'film', image: 'picture', profile: 'user', playlist: 'list', forum: 'chat' };
function iwaraLink(href) {
  const m = String(href || '').match(IWARA_LINK_RE);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const id = type === 'forum' ? m[3] : m[2];
  return id ? { type, id } : null;
}
/** href → { state: 'loading' | 'ok' | 'fail', title } */
const linkTitles = new Map();
function fetchLinkTitle(href, done) {
  const info = iwaraLink(href);
  if (!info) return;
  const hit = linkTitles.get(href);
  if (hit) { if (hit.state !== 'loading') done(hit); else (hit.waiters || (hit.waiters = [])).push(done); return; }
  const entry = { state: 'loading', waiters: [done] };
  linkTitles.set(href, entry);
  api.call(`/light/${info.type}/${encodeURIComponent(info.id)}`, { auth: false })
    .then((d) => { const title = String((info.type === 'profile' ? d && d.name : d && d.title) || '').replace(/[[\]()]/g, '').trim(); Object.assign(entry, title ? { state: 'ok', title } : { state: 'fail' }); })
    .catch(() => { entry.state = 'fail'; })
    .finally(() => { const ws = entry.waiters || []; entry.waiters = null; ws.forEach((fn) => fn(entry)); });
}
/** 文档里所有链接段（同一 href 相邻的文本合成一段）。 */
function findLinks(doc) {
  const out = [];
  doc.descendants((node, pos) => {
    if (!node.isText) return;
    const mk = node.marks.find((m) => m.type.name === 'link');
    if (!mk) return;
    const last = out[out.length - 1];
    if (last && last.to === pos && last.href === mk.attrs.href) { last.to += node.nodeSize; last.text += node.text; }
    else out.push({ from: pos, to: pos + node.nodeSize, href: mk.attrs.href, text: node.text });
  });
  return out;
}
/** 链接（转换出来的、或者光标停在它末尾接着打字）后面紧挨着文字/数字时，补一个空格，不然看着像连成了一个词。标点不补。 */
const WORDY = /^[\p{L}\p{N}]/u;
function spaceAfter(tr, end) {
  const $e = tr.doc.resolve(end);
  const next = $e.parent.textBetween($e.parentOffset, Math.min($e.parentOffset + 1, $e.parent.content.size), null, '\ufffc');
  if (WORDY.test(next)) tr.insert(end, tr.doc.type.schema.text(' '));
}
const MD_LINK_RE = /\[([^[\]\n]+)\]\(((?:https?:\/\/|\/)[^\s()]+)\)/g;
const BARE_URL_RE = /(^|[^\w(\[/"'=])(https?:\/\/[^\s<>()[\]]+)/g;

/** slotMaker：传 { guess(text) } 时，选中一小段文字会浮出「设为填空」（模板编辑用）。 */
/** help：传了就在左下角放「格式」入口，点开站点官方的格式说明（帮助窗口的格式页）。 */
function mdEditor({ value = '', placeholder = '', maxLength = 50000, onChange, slotMaker = null, clearLabel = null, help = false }) {
  let ed = null, view = null, destroyed = false, current = md.tidy(value), mentionPop = null;
  let quiet = false; // set() 整篇替换时不做链接转换：打开已有简介不该被改写
  const fresh = new Set(); // 这次编辑里新写进来的站内链接：只有它们会换成作品名
  const queue = [];
  const run = (fn) => (view ? fn(view) : queue.push(fn));

  const mount = h('div.md-doc');
  const count = h('span.count.mono');
  // 一键清空（发布页的简介用）：有内容才出现，撤销写回原文
  const clr = clearLabel && clearBtn(clearLabel, { read: () => api.value, write: (v) => { api.set(v); api.focus(); } });
  const emit = (text) => {
    text = md.tidy(text);
    if (clr) clr.show(!!text.trim());
    count.textContent = text.length ? String(text.length) : '';
    count.style.color = text.length > maxLength ? 'var(--red)' : '';
    if (text === current) return;
    current = text;
    onChange && onChange(text);
  };
  emit(current);

  // 不放格式工具栏：Markdown 照打就会变样式（见文件头），按钮只会让简介越写越花
  const fmtBtn = help && h('button.mdfmt', { type: 'button', onpointerdown: (e) => e.preventDefault(), onclick: () => showHelp({ at: 'format', onClose: () => api.focus() }) }, icon('help', 13), h('span', t('mdFormat')));
  const foot = h('div.md-foot', fmtBtn, count, clr && clr.el);
  const el = h('div.md', mount, foot);
  // 点编辑区下方空白处：光标放到末尾
  mount.addEventListener('pointerdown', (e) => { if (e.target === mount) { e.preventDefault(); api.focus(); } });

  /** 整块删除的单位：昵称块，和文字不是网址本身的站内链接（作品名、或者 `[视频1](…)` 里自己写的字）。 */
  const atoms = (state) => [...findChips(state), ...findLinks(state.doc).filter((l) => l.text !== l.href && iwaraLink(l.href))];
  // ── @ 联想：光标前是 @xxx 就查用户，浮层贴着光标 ──
  const caretAnchor = (v) => ({
    getBoundingClientRect() { const c = v.coordsAtPos(v.state.selection.from); return { left: c.left, right: c.left + 1, top: c.top, bottom: c.bottom, width: 1, height: c.bottom - c.top }; },
  });
  const mentionQuery = (v) => {
    const { $from, empty } = v.state.selection;
    if (!empty || $from.parent.type.spec.code) return null;
    const before = $from.parent.textBetween(0, $from.parentOffset, null, '￼');
    const m = before.match(/(?:^|[^\w@/.])@([\w.-]{1,30})$/);
    return m ? m[1] : null;
  };
  // 浮层一出现就挂着：先显示「搜索用户」转圈，请求回来再换成结果；同一个查询不重复发。
  let mention = null; // { q, users, cur, loading, box, pop, v }
  function closeMention() { if (mentionPop) { const p = mentionPop; mentionPop = null; mention = null; p.close(); } }
  function pickMention(u) {
    const v = mention && mention.v;
    if (!v) return;
    const query = mentionQuery(v);
    if (query == null) return closeMention();
    const to = v.state.selection.from;
    closeMention();
    linkTitles.set(profileHref(u.username), { state: 'ok', title: String(u.name || u.username).replace(/[[\]()]/g, '').trim() || u.username });
    v.dispatch(v.state.tr.insertText('@' + u.username + ' ', to - query.length - 1, to));
    v.focus();
  }
  function drawMention() {
    const m = mention;
    if (!m) return;
    const rows = m.users.slice(0, 7).map((u, i) => h('button.item' + (i === m.cur ? '.cur' : ''), { type: 'button', onpointerdown: (e) => { e.preventDefault(); pickMention(u); } },
      h('div.who', h('div.av', { style: thumbUrl.avatar(u) ? { backgroundImage: `url(${thumbUrl.avatar(u)})` } : null }, thumbUrl.avatar(u) ? '' : u.name.slice(0, 1).toUpperCase()), h('span', u.name), h('small', '@' + u.username))));
    clear(m.box);
    add(m.box, [
      // 第一次查、手里还没有结果：摆三行用户的骨架（头像 + 名字 + @id）
      m.loading && !rows.length && h('div', { 'aria-label': t('searchingUsers') }, [96, 72, 84].map((w) => h('div.skrow', skel(24, 24, true), skel(w, 10), skel(w * 0.6, 8)))),
      !m.loading && !rows.length && h('div.mstate', t('noResult')),
      h('div.mlist' + (m.loading && rows.length ? '.stale' : ''), rows),
    ]);
    m.pop.replace();
  }
  function showMention(v, q) {
    if (!mention) {
      const box = h('div.mbox');
      mention = { q: null, users: [], cur: 0, loading: false, box, v };
      mentionPop = mention.pop = popover(caretAnchor(v), box, { onClose: () => { mentionPop = null; mention = null; } });
      mentionPop.onKey = (e) => {
        const m = mention;
        if (!m || !m.users.length) return false;
        const n = Math.min(7, m.users.length);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { m.cur = (m.cur + (e.key === 'ArrowDown' ? 1 : -1) + n) % n; drawMention(); return true; }
        if (e.key === 'Enter' || e.key === 'Tab') { pickMention(m.users[m.cur]); return true; }
        return false; // Esc 由浮层自己关
      };
    }
    mention.v = v;
    if (mention.q === q) { mention.pop.replace(); return; }
    mention.q = q;
    mention.loading = true;
    drawMention();
    lookup(q);
  }
  const lookup = debounce(async (q) => {
    const users = (await svc.searchUsers(q)).filter((u) => u.status !== 'banned');
    if (destroyed || !mention || mention.q !== q) return; // 期间又改了查询：作废
    const ql = q.toLowerCase();
    const rank = (u) => (u.username.toLowerCase() === ql ? 0 : u.username.toLowerCase().startsWith(ql) || u.name.toLowerCase().startsWith(ql) ? 1 : 2);
    users.sort((a, b) => rank(a) - rank(b));
    Object.assign(mention, { users, cur: 0, loading: false });
    drawMention();
  }, 260);

  // ── 链接转换 ──
  // 打出 `[文字](网址)`（打完右括号那一刻）→ 变成链接；打出裸网址、后面接着打了空格或别的字 → 变成链接。
  // 链接文字就是网址本身的站内链接 → 换成作品名（只换这次新写进来的，旧简介不动）。
  function convertLinks(trs, oldState, state) {
    if (quiet || !trs.some((tr) => tr.docChanged) || trs.some((tr) => tr.getMeta('iwe-link'))) return null;
    const ranges = [];
    trs.forEach((tr, i) => {
      tr.steps.forEach((step, j) => step.getMap().forEach((a, b, from, to) => {
        let f = from, e = to;
        for (let k = j + 1; k < tr.steps.length; k++) { f = tr.steps[k].getMap().map(f, -1); e = tr.steps[k].getMap().map(e, 1); }
        for (let k = i + 1; k < trs.length; k++) { f = trs[k].mapping.map(f, -1); e = trs[k].mapping.map(e, 1); }
        ranges.push([f, e]);
      }));
    });
    const size = state.doc.content.size, head = state.selection.head;
    const linkType = state.schema.marks.link;
    const edits = [];
    const seen = new Set();
    for (const [f, e] of ranges) {
      state.doc.nodesBetween(Math.max(0, Math.min(f, size)), Math.max(0, Math.min(e, size)), (node, pos) => {
        if (!node.isTextblock) return true;
        if (node.type.spec.code || seen.has(pos)) return false;
        seen.add(pos);
        const end = pos + 1 + node.content.size;
        node.forEach((child, offset) => {
          if (!child.isText) return;
          const at = pos + 1 + offset;
          const mk = child.marks.find((m) => m.type === linkType);
          if (mk) { if (child.text === mk.attrs.href && iwaraLink(mk.attrs.href)) fresh.add(mk.attrs.href); return; }
          if (child.marks.some((m) => m.type.name === 'inlineCode')) return;
          const taken = [];
          for (const m of child.text.matchAll(MD_LINK_RE)) {
            if (m.index > 0 && child.text[m.index - 1] === '!') continue; // 图片语法留给编辑器自己
            taken.push([m.index, m.index + m[0].length]);
            edits.push({ from: at + m.index, to: at + m.index + m[0].length, text: m[1], href: m[2], marks: child.marks });
          }
          for (const m of child.text.matchAll(BARE_URL_RE)) {
            const s0 = m.index + m[1].length;
            const rawEnd = s0 + m[2].length;
            // 网址后面接了空白才算打完；停在段尾时，要等光标离开它
            if (rawEnd < child.text.length ? !/\s/.test(child.text[rawEnd]) : at + rawEnd === end ? head === at + rawEnd : true) continue;
            const url = m[2].replace(/[.,;:!?。，；：！？、」』）]+$/, '');
            const e0 = s0 + url.length;
            if (taken.some(([a, b]) => s0 < b && e0 > a)) continue;
            edits.push({ from: at + s0, to: at + e0, text: url, href: url, marks: child.marks });
          }
        });
        return false;
      });
    }
    if (!edits.length) return null;
    const tr = state.tr.setMeta('iwe-link', true);
    edits.sort((a, b) => b.from - a.from);
    for (const x of edits) {
      tr.replaceWith(x.from, x.to, state.schema.text(x.text, linkType.create({ href: x.href }).addToSet(x.marks)));
      spaceAfter(tr, x.from + x.text.length);
      if (x.text === x.href && iwaraLink(x.href)) fresh.add(x.href);
    }
    tr.setStoredMarks(tr.selection.$from.marks().filter((m) => m.type !== linkType)); // 接着打的字不算进链接
    return tr;
  }
  /** 新写进来的站内链接去要作品名；回来后把「文字 = 网址」的那几段换成作品名。 */
  function resolveTitles(v) {
    for (const href of fresh) {
      fetchLinkTitle(href, (res) => {
        if (destroyed || !view || res.state !== 'ok') { fresh.delete(href); if (view && !destroyed) view.dispatch(view.state.tr.setMeta('iwe-link', true)); return; }
        const st = view.state;
        const hits = findLinks(st.doc).filter((l) => l.href === href && l.text === href).sort((a, b) => b.from - a.from);
        fresh.delete(href);
        const tr = st.tr.setMeta('iwe-link', true);
        for (const l of hits) {
          const marks = st.doc.resolve(l.from + 1).marks();
          tr.replaceWith(l.from, l.to, st.schema.text(res.title, marks.length ? marks : [st.schema.marks.link.create({ href })]));
          spaceAfter(tr, l.from + res.title.length);
        }
        view.dispatch(tr);
      });
    }
  }

  // ── 选中文字 → 设为填空（只在模板编辑里开）──
  let makerPop = null, makerKey = '';
  function updateMaker(v) {
    if (!slotMaker || (makerPop && makerPop.asking)) return;
    const { from, to, empty, $from, $to } = v.state.selection;
    const text = empty ? '' : v.state.doc.textBetween(from, to, '\n');
    const ok = !empty && v.hasFocus() && $from.sameParent($to) && okSlotText(text);
    const key = ok ? from + ':' + to : '';
    if (key === makerKey) return;
    makerKey = key;
    if (makerPop) { const p = makerPop; makerPop = null; p.close(); }
    if (!ok) return;
    const anchor = { getBoundingClientRect() { const a = v.coordsAtPos(from), b = v.coordsAtPos(to); return { left: a.left, right: b.right, top: Math.min(a.top, b.top), bottom: Math.max(a.bottom, b.bottom), width: b.right - a.left, height: b.bottom - a.top }; } };
    const pop = slotMakerPop(anchor, text, slotMaker.guess && slotMaker.guess(text), (name) => { v.dispatch(v.state.tr.insertText(`{${name}}`, from, to)); v.focus(); }, () => { if (makerPop === pop) { makerPop = null; makerKey = ''; } });
    makerPop = pop;
  }

  // ── 填空位 ──
  // 点一下 / Tab 跳到填空位：这段变成橙色编辑区（选中原文，直接打字替换），上方一直挂着原来要填什么。
  // 回车、→、↑、↓、Esc 视为填完；编辑区空着时按退格也视为填完。光标停在填空位后面按退格：整个删掉。
  const slotKey = new MK.PluginKey('iwe-slot');
  const tip = slotTip();
  function activate(v, slot) {
    const label = v.state.doc.textBetween(slot.from + 1, slot.to - 1);
    v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, slot.from, slot.to)).setMeta(slotKey, { from: slot.from, to: slot.to, label }).scrollIntoView());
    v.focus();
  }
  function finish(v, toEnd) {
    const act = slotKey.getState(v.state);
    if (!act) return;
    const tr = v.state.tr.setMeta(slotKey, null);
    if (toEnd) tr.setSelection(MK.TextSelection.create(v.state.doc, act.to));
    v.dispatch(tr);
  }
  const helper = MK.$prose(() => new MK.Plugin({
    key: slotKey,
    appendTransaction: convertLinks,
    state: {
      init: () => null,
      apply(tr, act) {
        const meta = tr.getMeta(slotKey);
        if (meta !== undefined) return meta;
        if (!act) return null;
        // 编辑区两端向外吸附：在边上打字，字算进编辑区
        const from = tr.mapping.map(act.from, -1), to = Math.max(from, tr.mapping.map(act.to, 1));
        const sel = tr.selection;
        if (sel.from < from || sel.to > to) return null; // 光标离开编辑区：结束
        return { from, to, label: act.label };
      },
    },
    view: (v0) => {
      const place = (v) => {
        const act = slotKey.getState(v.state);
        if (!act || !v.hasFocus()) { tip.hide(); return; }
        const a = v.coordsAtPos(act.from), b = v.coordsAtPos(act.to);
        tip.show({ left: a.left, right: Math.max(a.left, b.right), top: Math.min(a.top, b.top) }, act.label);
      };
      const onScroll = () => place(v0);
      addEventListener('scroll', onScroll, true);
      const onBlur = () => tip.hide();
      v0.dom.addEventListener('blur', onBlur);
      return {
        update(v) {
          const q = mentionQuery(v);
          if (q && !mentionNick(q)) showMention(v, q); else closeMention();
          place(v); updateMaker(v); if (fresh.size) resolveTitles(v);
          for (const m of findMentions(v.state)) {
            if (linkTitles.has(profileHref(m.name))) continue;
            fetchLinkTitle(profileHref(m.name), (res) => { if (res.state === 'ok' && view && !destroyed) view.dispatch(view.state.tr.setMeta('iwe-link', true)); });
          }
        },
        destroy() { removeEventListener('scroll', onScroll, true); v0.dom.removeEventListener('blur', onBlur); tip.hide(); },
      };
    },
    props: {
      // 光标停在链接末尾打字：字不并进链接（不然 `[dd](…)` 后面打的话都会变成链接文字）
      handleTextInput(v, from, to, text) {
        const lk = v.state.schema.marks.link, $f = v.state.doc.resolve(from);
        if (from !== to || !lk.isInSet($f.marks()) || ($f.nodeAfter && lk.isInSet($f.nodeAfter.marks))) return false;
        const t2 = WORDY.test(text) ? ' ' + text : text; // 紧贴链接打字：先隔一个空格
        v.dispatch(v.state.tr.insertText(t2, from, to).removeMark(from, from + t2.length, lk));
        return true;
      },
      // 粘贴单独一条网址：自己插，不交给 Milkdown（它按 Markdown 解析，粘在一段中间会把这段拆成两段；还会先把网址变成链接，
      // `[文字](` 后面贴的就再也凑不成 `[文字](网址)`）。走 DOM 事件这一层，因为 Milkdown 的剪贴板插件排在前面，handlePaste 轮不到。
      handleDOMEvents: { paste: (v, e) => {
        const txt = (e.clipboardData && e.clipboardData.getData('text/plain')) || '';
        if (!/^\s*https?:\/\/\S+\s*$/.test(txt)) return false;
        const { from, to, $from } = v.state.selection;
        if ($from.parent.type.spec.code) return false;
        e.preventDefault();
        const url = txt.trim(), lk = v.state.schema.marks.link;
        const tr = v.state.tr.insertText(url, from, to).removeMark(from, from + url.length, lk);
        // `[文字](` 后面：先按原文放着，打出右括号再整体变成链接
        if (!/\($/.test($from.parent.textBetween(0, $from.parentOffset, null, '\ufffc'))) {
          tr.addMark(from, from + url.length, lk.create({ href: url })).setMeta('iwe-link', true);
          if (iwaraLink(url)) fresh.add(url); else spaceAfter(tr, from + url.length);
          tr.setStoredMarks(tr.selection.$from.marks().filter((m) => m.type !== lk));
        }
        v.dispatch(tr.scrollIntoView());
        return true;
      } },
      handleKeyDown(v, e) {
        if (mentionPop && mentionPop.onKey(e)) { e.preventDefault(); return true; }
        if (e.isComposing) return false;
        if (makerPop && !makerPop.asking && e.key === 'Enter') { e.preventDefault(); makerPop.ask(); return true; }
        const act = slotKey.getState(v.state);
        const { from, to, empty } = v.state.selection;
        if (e.key === 'Tab' && !e.shiftKey) {
          const all = findSlots(v.state.doc);
          const next = all.find((s) => s.from >= (act ? act.to : to)) || all.find((s) => s.from !== from);
          if (next) { e.preventDefault(); activate(v, next); return true; }
          // 已经是最后一格：这一格算填完，光标停在它后面，不让 Tab 把焦点带到别的控件上
          if (act) { e.preventDefault(); finish(v, true); return true; }
          return false;
        }
        if (act) {
          if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'Escape') { e.preventDefault(); finish(v, true); return true; }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { finish(v, false); return false; }
          if (e.key === 'Backspace' && act.from === act.to) { e.preventDefault(); finish(v, false); return true; }
          return false;
        }
        if (e.key === 'Backspace' && empty) {
          const slot = findSlots(v.state.doc).find((s) => s.to === from);
          if (slot) { e.preventDefault(); v.dispatch(v.state.tr.delete(slot.from, slot.to)); return true; }
        }
        // 转换过的东西是一整块：显示成昵称的 @提及、显示成作品名 / 自定文字的站内链接，退格 / Delete 一下删整块，不会一个字一个字地删
        if ((e.key === 'Backspace' || e.key === 'Delete') && empty && !e.altKey && !e.metaKey) {
          const back = e.key === 'Backspace';
          const atom = atoms(v.state).find((x) => (back ? x.to === from : x.from === from));
          if (atom) { e.preventDefault(); v.dispatch(v.state.tr.delete(atom.from, atom.to).scrollIntoView()); return true; }
        }
        // 昵称块里藏着的原文不让光标走进去
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && empty && !e.shiftKey && !e.altKey && !e.metaKey) {
          const left = e.key === 'ArrowLeft';
          const chip = findChips(v.state).find((m) => (left ? from > m.from && from <= m.to : from >= m.from && from < m.to));
          if (chip) { e.preventDefault(); v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, left ? chip.from : chip.to))); return true; }
        }
        return false;
      },
      handleClick(v, pos, e) {
        if (e.metaKey || e.ctrlKey) {
          const m = findMentions(v.state).find((x) => pos >= x.from && pos <= x.to);
          if (m) { window.open('https://www.iwara.tv/profile/' + m.name, '_blank', 'noopener'); return true; }
          const l = findLinks(v.state.doc).find((x) => pos >= x.from && pos <= x.to);
          if (l && /^https?:/.test(l.href)) { window.open(l.href, '_blank', 'noopener'); return true; }
        }
        const chip = findChips(v.state).find((m) => pos > m.from && pos < m.to);
        if (chip) { v.dispatch(v.state.tr.setSelection(MK.TextSelection.create(v.state.doc, chip.to))); return true; }
        const slot = findSlots(v.state.doc).find((s) => pos >= s.from && pos < s.to);
        if (!slot) return false;
        const act = slotKey.getState(v.state);
        if (act && act.from === slot.from) return false;
        activate(v, slot);
        return true;
      },
      decorations(state) {
        const act = slotKey.getState(state);
        const chips = findChips(state);
        const decos = findMentions(state).filter((m) => !chips.some((c) => c.from === m.from)).map((m) => MK.Decoration.inline(m.from, m.to, { class: 'mention' }));
        for (const c of chips) {
          const nick = mentionNick(c.name);
          decos.push(MK.Decoration.widget(c.from, () => h('span.mention-chip', { contentEditable: 'false', title: '@' + c.name }, '@' + nick), { side: 1, key: 'mn:' + c.name + ':' + nick }));
          decos.push(MK.Decoration.inline(c.from, c.to, { class: 'mention-raw' }));
        }
        for (const l of findLinks(state.doc)) {
          const info = iwaraLink(l.href);
          if (!info) continue;
          const loading = fresh.has(l.href) && l.text === l.href;
          decos.push(MK.Decoration.widget(l.from, () => h('span.lk-ic', { title: '' }, icon(LINK_TYPE_ICON[info.type], 13)), { side: -1, key: 'lk:' + info.type + (loading ? ':w' : '') }));
          if (loading) decos.push(MK.Decoration.inline(l.from, l.to, { class: 'lk-wait' }));
        }
        decos.push(...findSlots(state.doc).filter((s) => !act || s.to <= act.from || s.from >= act.to).map((s) => MK.Decoration.inline(s.from, s.to, { class: 'slot' })));
        if (act) decos.push(act.from < act.to ? MK.Decoration.inline(act.from, act.to, { class: 'slot-edit' }) : MK.Decoration.widget(act.from, () => h('span.slot-edit.empty'), { side: 1 }));
        const first = state.doc.firstChild;
        if (placeholder && state.doc.childCount === 1 && first && first.type.name === 'paragraph' && !first.content.size) {
          decos.push(MK.Decoration.node(0, first.nodeSize, { class: 'ph', 'data-ph': placeholder }));
        }
        return MK.DecorationSet.create(state.doc, decos);
      },
    },
  }));

  MK.Editor.make()
    .config((ctx) => {
      ctx.set(MK.rootCtx, mount);
      ctx.set(MK.defaultValueCtx, current);
      ctx.update(MK.editorViewOptionsCtx, (o) => ({ ...o, attributes: { class: 'prose', spellcheck: 'false' },
        // 页面顶上有站点的固定头、底下有吸底的步骤栏：光标滚进视口时要让开它们，不然换行换到底栏后面就看不见了
        scrollMargin: { top: 84, bottom: 112, left: 5, right: 5 }, scrollThreshold: { top: 84, bottom: 112, left: 0, right: 0 } }));
      ctx.update(MK.remarkStringifyOptionsCtx, (o) => ({ ...o, bullet: '-', handlers: { ...(o.handlers || {}), break: () => '  \n' } }));
      ctx.get(MK.listenerCtx).markdownUpdated((_, text) => emit(text));
    })
    .use(MK.commonmark).use(MK.gfm).use(MK.history).use(MK.listener).use(MK.clipboard).use(MK.trailing).use(helper)
    .create()
    .then((editor) => {
      if (destroyed) { editor.destroy(); return; }
      ed = editor;
      view = ed.ctx.get(MK.editorViewCtx);
      queue.splice(0).forEach((fn) => fn(view));
    });

  const api = {
    el,
    get value() { if (ed) emit(ed.action(MK.getMarkdown())); return current; },
    set(v) { run(() => { quiet = true; try { ed.action(MK.replaceAll(v)); } finally { quiet = false; } emit(ed.action(MK.getMarkdown())); }); },
    focus() { run((v) => { v.dispatch(v.state.tr.setSelection(MK.TextSelection.atEnd(v.state.doc))); v.focus(); }); },
    /** 进入第一个填空位；没有填空（或编辑器还没起来）返回 false。 */
    focusFirstSlot() {
      if (!view) return false;
      const first = findSlots(view.state.doc)[0];
      if (first) activate(view, first);
      return !!first;
    },
    /** 把还在防抖里的修改立刻交出去。 */
    commit() { if (ed) emit(ed.action(MK.getMarkdown())); },
    destroy() { api.commit(); destroyed = true; closeMention(); tip.remove(); if (makerPop) makerPop.close(); if (ed) ed.destroy(); ed = view = null; },
  };
  return api;
}

// ── 50-tags.js ──────────────────────────────────────────────────
// 标签：词库（带四种语言译名）来自 LoveIwara 仓库的公开数据，按当前语言瘦身后缓存在本地。
const TAG_LANGS = ['en', 'zh-CN', 'zh-TW', 'ja']; // 词库里每个标签都有这四种名字；en 是站点原名，其余是 AI 翻译
// 标签词库项目的主页：提示里「有疑问 / 想参与」点进去的地方。以后词库和这个脚本拆成独立项目，改这里和上面的 TAG_DICT_URL
const TAG_PROJECT_URL = 'https://github.com/FoxSensei001/LoveIwara/tree/master/tool/data/iwara_tags';
const TAG_DICT_URL = 'https://cdn.jsdelivr.net/gh/FoxSensei001/LoveIwara@master/tool/data/iwara_tags/iwara_tags.min.json';

const tagDict = (() => {
  const map = new Map(); // id → [译名, 类型, 是否敏感]
  let loading = null;

  function fill(tags) { map.clear(); for (const id in tags) map.set(id, tags[id]); }
  async function refresh() {
    const r = await fetch(TAG_DICT_URL);
    const j = await r.json();
    const slim = {};
    for (const id in j.tags) {
      const e = j.tags[id], n = e.n || {};
      const name = n[env.tagLang] || n.en || '';
      // 别的语言的译名也留着（只用来搜）：用哪种语言都能搜到
      const alts = [...new Set(TAG_LANGS.map((l) => n[l]).filter((x) => x && x !== name).map((x) => x.toLowerCase()))].join('\n');
      slim[id] = [name, e.y, e.s ? 1 : 0, alts];
    }
    fill(slim);
    store.set('dict', { v: 2, rev: j.rev, lang: env.tagLang, at: Date.now(), tags: slim });
  }
  function load() {
    if (loading) return loading;
    const cached = store.get('dict');
    if (cached && cached.v === 2 && cached.lang === env.tagLang) {
      fill(cached.tags);
      if (Date.now() - cached.at > 3 * 86400e3) refresh().catch(() => {});
      return (loading = Promise.resolve());
    }
    return (loading = refresh().catch(() => {}));
  }
  const pretty = (id) => id.replace(/_/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase());
  return {
    load,
    get size() { return map.size; },
    name(id) { const e = map.get(id); return (e && e[0]) || pretty(id); },
    /** 还原成接口要的标签对象（必须带 type，否则服务端 500）。 */
    tag(id) { const e = map.get(id); return e ? { id, type: e[1], sensitive: !!e[2] } : null; },
    ofType(type) { const out = []; for (const [id, e] of map) if (e[1] === type && !e[2]) out.push(id); return out.sort((a, b) => tagDict.name(a).localeCompare(tagDict.name(b), env.tagLang)); },
    /** 译名 / 原始 id 都能搜。排序：完全相等 > id 前缀 > 译名前缀 > 译名包含 > id 包含。 */
    search(query, limit = 40) {
      const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!q) return [];
      const qi = q.replace(/ /g, '_');
      const hit = [];
      for (const [id, e] of map) {
        const name = e[0].toLowerCase(), alts = e[3] ? e[3].split('\n') : [];
        const score = id === qi || name === q || alts.includes(q) ? 0 : id.startsWith(qi) ? 1 : name.startsWith(q) || alts.some((a) => a.startsWith(q)) ? 2
          : name.includes(q) || alts.some((a) => a.includes(q)) ? 3 : id.includes(qi) ? 4 : -1;
        if (score >= 0) hit.push([score, id]);
      }
      hit.sort((a, b) => a[0] - b[0] || a[1].length - b[1].length || (a[1] < b[1] ? -1 : 1));
      return hit.slice(0, limit).map((x) => x[1]);
    },
  };
})();

// ── 用过的标签：选中过的就记下来（不含类别，敏感标签也记），下次发布直接点；可以从这里移除 ──
const tagMemory = {
  used: () => store.get('tagUsed', []),
  /** 记一个标签，返回是否是新记下的。新的排在最前，老的不挪位置（免得点一下整排跳动）。 */
  remember(tg) {
    if (!tg || tg.type === 'category') return false;
    const list = tagMemory.used();
    if (list.some((x) => x.id === tg.id)) return false;
    list.unshift({ id: tg.id, type: tg.type, sensitive: !!tg.sensitive });
    store.set('tagUsed', list.slice(0, 80));
    return true;
  },
  forget(id) { store.set('tagUsed', tagMemory.used().filter((x) => x.id !== id)); },
  restore(list) { store.set('tagUsed', list); },
  /** 发布成功时调用：记下这一次的整组标签（「上次用过」一键加回）。 */
  bump(tags) {
    store.set('lastTags', tags);
    for (const tg of tags) tagMemory.remember(tg);
  },
  last: () => store.get('lastTags', []),
};

STYLE.push(`
.tray{position:relative;display:flex;flex-wrap:wrap;gap:8px;min-height:62px;padding:14px;align-items:center;border-radius:12px;border:1px solid var(--line);background:var(--card);transition:border-color .2s}
.tray.need{border-style:dashed;border-color:var(--line2)}
.tray .ghost{height:30px;border-radius:999px;border:1px dashed var(--line2);opacity:.7}
.tray .count{margin-left:auto;font-size:12px;color:var(--fg3)}
.tg{display:inline-flex;align-items:center;gap:4px;height:30px;padding:0 4px 0 12px;border-radius:999px;background:var(--fg);color:var(--inv);font-size:13px;font-weight:500;animation:pop .4s var(--spring)}
.tg.cat{background:none;color:var(--fg);box-shadow:inset 0 0 0 1.5px var(--fg);padding-left:10px}
.tg.sens{background:var(--amber);color:#fff}
.tg button{display:grid;place-items:center;width:22px;height:22px;border:0;border-radius:50%;background:none;color:inherit;opacity:.6;cursor:pointer}
.tg button:hover{opacity:1;background:color-mix(in srgb,currentColor 18%,transparent)}
.tg.out{position:absolute;margin:0;pointer-events:none;transition:transform .2s,opacity .2s;transform:scale(.7);opacity:0}
.tsec{margin-top:22px}
.tsec>.label{display:flex;align-items:center;gap:8px;margin-bottom:10px;min-height:30px}
.tsec>.label .dot{width:6px;height:6px;border-radius:50%;background:var(--red);animation:pulse 1.4s infinite}
@keyframes pulse{50%{opacity:.25;transform:scale(.7)}}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.uchip{position:relative;display:inline-flex;animation:pop .4s var(--spring)}
.uchip .rm{position:absolute;top:-6px;right:-6px;width:18px;height:18px;padding:0;border-radius:50%;border:1px solid var(--line2);background:var(--card);color:var(--fg2);display:grid;place-items:center;cursor:pointer;
  opacity:0;transform:scale(.5);transition:opacity .15s,transform .25s var(--spring),color .15s}
.uchip:hover .rm,.uchip .rm:focus-visible{opacity:1;transform:none}
.uchip .rm:hover{color:var(--red);border-color:var(--red)}
@media (hover:none){.uchip .rm{opacity:1;transform:none}}
.chip.sens.on{background:var(--amber);border-color:var(--amber);color:#fff}
.uchip.out{position:absolute;pointer-events:none;transition:transform .2s,opacity .2s;transform:scale(.7);opacity:0}
.tfield{position:relative}
.tfield{position:relative;overflow:hidden}
.tfield::after{content:"";position:absolute;left:0;bottom:0;width:35%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--blue),transparent);opacity:0;transform:translateX(-100%);transition:opacity .2s}
.tfield.busy::after{opacity:1;animation:tsweep 1.1s cubic-bezier(.45,.05,.25,1) infinite}
@keyframes tsweep{from{transform:translateX(-100%)}to{transform:translateX(300%)}}
.tmenu{max-height:min(360px,50vh);overflow:auto;overscroll-behavior:contain;margin:-5px;padding:5px}
.res{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 10px;border:0;border-radius:8px;background:none;cursor:pointer;text-align:left;font-size:13.5px}
.res.cur{background:var(--sunk)}
.res b{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.res small{color:var(--fg3);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.res .kind{margin-left:auto;flex:none;font-size:11px;color:var(--fg3);border:1px solid var(--line);border-radius:5px;padding:1px 6px}
.res .tick{color:var(--green)}
.res .st{display:grid;place-items:center;width:16px;height:16px;flex:none}
.res .ic{flex:none}
.res.none{justify-content:center;gap:8px;color:var(--fg3);cursor:default}
.tmenu hr{border:0;border-top:1px solid var(--line);margin:5px -5px}
.tmenu .head{display:flex;align-items:center;gap:8px;padding:6px 10px 4px;font-size:11px;font-weight:600;color:var(--fg3);letter-spacing:.04em}
`);

/** 先记下 container 里各子元素的位置，执行 mutate 改 DOM，再让留下来的元素从旧位置滑到新位置（不瞬移）。 */
function flip(container, mutate) {
  const before = new Map([...container.children].filter((e) => !e.classList.contains('out')).map((e) => [e, e.getBoundingClientRect()]));
  mutate();
  if (reducedMotion()) return;
  for (const [e, r] of before) {
    if (!e.isConnected || e.classList.contains('out')) continue;
    const n = e.getBoundingClientRect();
    const dx = r.left - n.left, dy = r.top - n.top;
    if (dx || dy) e.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}

const TAG_KIND = { character: 'characters', source: 'series', general: 'general', category: 'category' };

/** 标签这一步。tags 是标签对象数组（原地修改），onChange 在每次变化后调用。 */
/** required：类别是否必选（视频、图库都必选，而且只能选一个，多选会被服务端拒绝）。 */
function tagPicker(tags, onChange, { required = true, kind = 'video' } = {}) {
  const has = (id) => tags.some((x) => x.id === id);
  const category = () => tags.find((x) => x.type === 'category');
  const listeners = [];
  const sync = () => { flip(tray, drawTray); listeners.forEach((fn) => fn()); onChange(); };
  function toggle(tg) {
    const i = tags.findIndex((x) => x.id === tg.id);
    if (i >= 0) tags.splice(i, 1);
    else {
      if (tg.type === 'category') { const c = tags.findIndex((x) => x.type === 'category'); if (c >= 0) tags.splice(c, 1); tags.unshift(tg); } else tags.push(tg);
      if (tagMemory.remember(tg)) drawUsed(tg.id);
    }
    sync();
  }

  // 已选
  const tray = h('div.tray');
  const countEl = h('span.count.mono');
  const tagClr = clearBtn(t('keepTags'), { read: () => tags.slice(), write: (v) => { tags.splice(0, tags.length, ...v); sync(); } });
  function drawTray() {
    const cat = category();
    tray.classList.toggle('need', required && !cat);
    const want = tags.map((x) => x.id);
    // 要走的标签：钉在原地（绝对定位）淡出，让出位置给后面的标签滑过来
    for (const el of [...tray.querySelectorAll('.tg:not(.out)')]) if (!want.includes(el.dataset.id)) {
      const left = el.offsetLeft, top = el.offsetTop;
      el.style.left = left + 'px'; el.style.top = top + 'px';
      el.classList.add('out');
      setTimeout(() => el.remove(), 200);
    }
    tray.querySelectorAll('.ghost').forEach((e) => e.remove());
    for (const tg of tags) {
      if (tray.querySelector(`.tg:not(.out)[data-id="${CSS.escape(tg.id)}"]`)) continue;
      const el = h('span.tg' + (tg.type === 'category' ? '.cat' : tg.sensitive ? '.sens' : ''), { data: { id: tg.id, tip: tg.id } }, tg.type === 'category' && icon('layers', 14), tagDict.name(tg.id), h('button', { type: 'button', onclick: () => toggle(tg) }, icon('x', 12)));
      tg.type === 'category' ? tray.prepend(el) : tray.append(el);
    }
    tagClr.show(tags.length > 0);
    if (!tags.length) setTimeout(() => { if (!tags.length) tagClr.el.remove(); }, 200); // 淡出后再拿掉，不占位置
    if (!tags.length) { countEl.remove(); tray.append(h('span.ghost', { style: { width: '92px' } }), h('span.ghost', { style: { width: '64px' } }), h('span.ghost', { style: { width: '78px' } })); }
    else { countEl.textContent = String(tags.length); tray.append(countEl, tagClr.el); } // 同一个计数节点挪到末尾，不重建
  }

  function section(label, body, extra) {
    return h('div.tsec', h('div.label', label, extra), body);
  }

  // 类别（必选一个）
  const catChips = svc.config.categories.map((c) => {
    const tg = { id: c.id, type: 'category', sensitive: false };
    return [tg, h('button.chip', { type: 'button', data: { tip: tg.id }, onclick: () => toggle(tg) }, tagDict.name(tg.id))];
  });
  const needDot = h('span.dot');
  listeners.push(() => { needDot.style.display = !required || category() ? 'none' : ''; catChips.forEach(([tg, c]) => c.classList.toggle('on', has(tg.id))); });
  // 站点的类别说明不再常驻在下面占地方：标题旁一个 ⓘ，悬停 / 聚焦时显示
  const catInfo = siteRules.text('form.categoriesDescription') && infoTip(siteRules.text('form.categoriesDescription'));
  const cats = section(t('category'), h('div', h('div.chips', catChips.map((x) => x[1]))), [catInfo, needDot]);

  // ── 搜索：结果在输入框下方的浮层菜单里，不挤占页面；本地词库立刻出，站点接口的结果带加载态追加 ──
  const input = h('input', { placeholder: t('searchTags'), spellcheck: false, autocomplete: 'off', role: 'combobox', 'aria-expanded': 'false' });
  const search = h('div.field.tfield', { style: { height: '44px' } }, icon('search'), input);
  // 词库是 AI 翻译的：标题旁一个 ⓘ 讲清楚只有英文是站点原名
  const searchSec = section(t(kind === 'image' ? 'imageTags' : 'videoTags'), search, [infoTip(t('tagSourceTip'), { label: t('tagProject'), href: TAG_PROJECT_URL })]);
  const listbox = h('div.tmenu', { role: 'listbox' });
  let pop = null, cur = 0, local = [], remoteHits = [], loading = false, seq = 0;
  const results = () => local.concat(remoteHits.filter((r) => !local.some((l) => l.id === r.id)));

  function closeMenu() { if (pop) { const p = pop; pop = null; p.close(); } input.setAttribute('aria-expanded', 'false'); }
  const rowIcon = (tg) => (has(tg.id) ? h('span.tick', icon('check')) : icon(tg.sensitive ? 'warn' : 'plus'));
  /** 选中 / 取消后只换每行前面的图标，菜单本身不重建（不闪）。 */
  function markPicked() {
    for (const st of listbox.querySelectorAll('.st')) {
      const on = has(st.dataset.id);
      if (st.dataset.on === String(on)) continue;
      st.dataset.on = String(on);
      const tg = results().find((x) => x.id === st.dataset.id);
      if (!tg) continue;
      st.replaceChildren(rowIcon(tg));
      if (on && !reducedMotion()) st.firstChild.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
  }
  function mark() { [...listbox.querySelectorAll('.res[data-i]')].forEach((el) => el.classList.toggle('cur', +el.dataset.i === cur)); }
  function row(tg, i) {
    return h('button.res' + (i === cur ? '.cur' : ''), { type: 'button', role: 'option', data: { i },
      onpointerdown: (e) => e.preventDefault(), // 点菜单项不让输入框失焦
      onpointermove: () => { if (cur !== i) { cur = i; mark(); } },
      onclick: () => { toggle(tg); markPicked(); } },
    h('span.st', { data: { id: tg.id, on: String(has(tg.id)) } }, rowIcon(tg)), h('b', tagDict.name(tg.id)), h('small.mono', tg.id), h('span.kind', t(TAG_KIND[tg.type] || 'general')));
  }
  function drawMenu() {
    if (!input.value.trim()) { closeMenu(); return; }
    const list = results();
    cur = clamp(cur, 0, Math.max(0, list.length - 1));
    const nLocal = local.length;
    const extra = list.slice(nLocal);
    clear(listbox);
    add(listbox, [
      local.map((tg, i) => row(tg, i)),
      // 站点接口的结果单独一组：加载中显示转圈，回来了才出条目
      (loading || extra.length > 0) && nLocal > 0 && h('hr'),
      (loading || extra.length > 0) && nLocal > 0 && h('div.head', t(loading ? 'searchingSite' : 'fromSite')),
      extra.map((tg, j) => row(tg, nLocal + j)),
      // 站点结果还在路上：先摆几行条目的骨架
      loading && !extra.length && h('div', { 'aria-label': t('searching') }, (nLocal ? [120, 90] : [140, 100, 120]).map((w) => h('div.skrow', skel(16, 16, true), skel(w, 10), h('span', { style: { flex: 1 } }), skel(34, 16)))),
      !list.length && !loading && h('div.res.none', t('noResult')),
    ]);
    if (!pop) {
      pop = popover(search, listbox, { width: search.offsetWidth, onClose: () => { pop = null; input.setAttribute('aria-expanded', 'false'); } });
      input.setAttribute('aria-expanded', 'true');
    }
    pop.style.width = search.offsetWidth + 'px';
    pop.replace();
  }
  const remote = debounce(async (q, my) => {
    const res = await svc.searchTags(q.replace(/\s+/g, '_'));
    if (my !== seq) return; // 期间又输入了：这次的结果作废
    remoteHits = res.map((x) => tagDict.tag(x.id) || { id: x.id, type: x.type, sensitive: !!x.sensitive });
    loading = false;
    search.classList.remove('busy');
    drawMenu();
  }, 250);
  input.addEventListener('input', () => {
    const q = input.value.trim();
    const my = ++seq;
    local = q ? tagDict.search(q).map((id) => tagDict.tag(id)) : [];
    remoteHits = [];
    cur = 0;
    loading = !!q;
    search.classList.toggle('busy', loading);
    if (q) remote(q, my);
    drawMenu();
  });
  input.addEventListener('focus', () => { if (input.value.trim()) drawMenu(); });
  input.addEventListener('keydown', (e) => {
    const list = results();
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!pop) { drawMenu(); return; }
      cur = clamp(cur + (e.key === 'ArrowDown' ? 1 : -1), 0, list.length - 1);
      mark();
      const el = listbox.querySelector(`.res[data-i="${cur}"]`);
      el && el.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && pop && list[cur]) { e.preventDefault(); toggle(list[cur]); input.select(); markPicked(); }
    else if (e.key === 'Backspace' && !input.value && tags.length) { const last = tags[tags.length - 1]; if (last.type !== 'category') toggle(last); }
  });
  // 浮层是 fixed 定位：页面滚动时跟着输入框走
  const follow = () => pop && pop.replace();
  addEventListener('scroll', follow, true);

  // ── 用过的标签（没用过就整块不显示）──
  const usedBox = h('div');
  let usedChips = [];
  listeners.push(() => usedChips.forEach(([tg, c]) => c.classList.toggle('on', has(tg.id))));
  function forget(tg, wrap) {
    const before = tagMemory.used();
    tagMemory.forget(tg.id);
    usedChips = usedChips.filter(([x]) => x.id !== tg.id);
    const box = wrap.parentNode;
    if (usedChips.length) flip(box, () => { wrap.style.left = wrap.offsetLeft + 'px'; wrap.style.top = wrap.offsetTop + 'px'; wrap.classList.add('out'); });
    else wrap.classList.add('out');
    setTimeout(() => { wrap.remove(); if (!usedChips.length) clear(usedBox); }, 200);
    toast(t('tagForgotten', { n: tagDict.name(tg.id) }), { action: t('undo'), onAction: () => { tagMemory.restore(before); drawUsed(); } });
  }
  function usedChip(tg, fresh) {
    const c = h('button.chip' + (tg.sensitive ? '.sens' : ''), { type: 'button', data: { tip: tg.id }, onclick: () => toggle(tg) }, tagDict.name(tg.id));
    const wrap = h('span.uchip', { style: fresh ? null : { animation: 'none' } }, c,
      h('button.rm', { type: 'button', 'aria-label': t('remove'), data: { tip: t('forgetTag') }, onclick: () => forget(tg, wrap) }, icon('x', 10)));
    usedChips.push([tg, c]);
    return wrap;
  }
  /** freshId：刚记下的那个——已有整块时只把它插到最前面，其余标签滑开，不整块重建。 */
  function drawUsed(freshId) {
    const box = usedBox.querySelector('.chips');
    if (freshId && box) {
      const tg = tagDict.tag(freshId) || tagMemory.used().find((x) => x.id === freshId);
      if (tg) { flip(box, () => box.prepend(usedChip(tg, true))); listeners.forEach((fn) => fn()); return; }
    }
    const list = tagMemory.used().map((x) => tagDict.tag(x.id) || x).filter((x) => x.type !== 'category');
    usedChips = [];
    clear(usedBox);
    if (!list.length) return;
    const chips = h('div.chips', { style: { position: 'relative' } }, list.map((tg) => usedChip(tg, tg.id === freshId)));
    const last = tagMemory.last().filter((x) => x.type !== 'category');
    const addLast = last.length > 1 && h('button.btn.sm.ghost', { type: 'button', style: { marginLeft: 'auto' }, onclick: () => { for (const tg of tagMemory.last()) if (!has(tg.id)) { if (tg.type === 'category' && category()) continue; tags.push(tg); } sync(); } }, icon('clock', 14), `${t('lastUsed')} · ${last.length}`);
    const sec = section(t('usedTags'), chips, addLast);
    if (freshId && !reducedMotion()) sec.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)' });
    usedBox.append(sec);
    listeners.forEach((fn) => fn());
  }

  tagDict.load().then(() => { drawTray(); drawUsed(); });
  drawTray();
  drawUsed();
  listeners.forEach((fn) => fn());
  return {
    el: h('div', tray, cats, searchSec, siteRules.tagRule() && h('div.note', { style: { marginTop: '8px' } }, icon('tag', 14), h('a', { href: siteRules.tagRule(), target: '_blank', rel: 'noopener', style: { color: 'inherit', textUnderlineOffset: '3px' } }, siteRules.text('form.tagsDescription') || t('tagStandard'))), usedBox),
    refresh: () => { drawTray(); listeners.forEach((fn) => fn()); },
    focus: () => input.focus(),
    dispose: () => { closeMenu(); removeEventListener('scroll', follow, true); },
  };
}

// ── 60-templates.js ─────────────────────────────────────────────
// 模板：标题格式（可带 {填空}，{#} 是自动递增的期数）+ 简介 + 标签 + 分级与可见范围。
// 任何一步都能套用；发布前后都能把当前这份存成模板。

const templates = {
  all: () => store.get('templates', []),
  save(list) { store.set('templates', list); },
  upsert(tpl) {
    const list = templates.all();
    const i = list.findIndex((x) => x.id === tpl.id);
    tpl.updatedAt = Date.now();
    i >= 0 ? (list[i] = tpl) : list.unshift(tpl);
    templates.save(list);
  },
  remove(id) { templates.save(templates.all().filter((x) => x.id !== id)); },
  bump(id) {
    const list = templates.all();
    const tpl = list.find((x) => x.id === id);
    if (!tpl) return;
    tpl.uses = (tpl.uses || 0) + 1;
    if (/\{#\}/.test(tpl.title || '') || /\{#\}/.test(tpl.body || '')) tpl.counter = (tpl.counter || 0) + 1;
    templates.save(list);
  },
  /** 内置示例：从常见的投稿规律里归纳出来的四种写法。 */
  samples() {
    const zh = env.lang === 'zh';
    const tg = (...ids) => ids.map((id) => tagDict.tag(id) || (svc.config.categories.find((c) => c.id === id) && { id, type: 'category', sensitive: false })).filter(Boolean);
    return [
      { id: 's-mmd', sample: true, name: zh ? 'MMD 舞蹈' : 'MMD dance', title: zh ? '【MMD】{角色} - {曲名}' : '[MMD] {Character} - {Song}', rating: 'ecchi',
        body: zh ? '## Credits\n\n- **Model**：{模型}\n- **Motion**：{动作}\n- **Music**：{曲名}\n- **Stage**：{场景}' : '## Credits\n\n- **Model**: {Model}\n- **Motion**: {Motion}\n- **Music**: {Song}\n- **Stage**: {Stage}', tags: tg('mikumikudance', 'dance') },
      { id: 's-series', sample: true, name: zh ? '系列连载' : 'Series', title: zh ? '{系列名} #{#} {本期标题}' : '{Series} #{#} {Episode title}', counter: 0,
        body: zh ? '上一期：{上一期链接}' : 'Previous: {Previous link}', tags: [] },
      { id: 's-hmv', sample: true, name: 'HMV / PMV', title: zh ? '{标题} [HMV]' : '{Title} [HMV]', rating: 'ecchi',
        body: zh ? '**Music**：{曲名}\n\n**Source**：{素材来源}' : '**Music**: {Song}\n\n**Source**: {Source}', tags: tg('hmv') },
      { id: 's-mod', sample: true, name: zh ? '游戏 MOD' : 'Game mod', title: zh ? '【{作品}】{曲名}（{角色}）' : '[{Game}] {Song} ({Characters})', rating: 'ecchi', body: '', tags: tg('uncategorized', 'game_mod') },
    ];
  },
  last: (kind) => store.get('last:' + kind),
  /** 套用到草稿上。返回撤销函数。 */
  apply(draft, tpl) {
    const snap = JSON.stringify({ title: draft.title, body: draft.body, tags: draft.tags, rating: draft.rating, private: draft.private, unlisted: draft.unlisted, tplId: draft.tplId, tplTitle: draft.tplTitle || null, tplBody: draft.tplBody || null });
    const n = String((tpl.counter || 0) + 1);
    const fill = (s) => String(s || '').replace(/\{#\}/g, n);
    if (tpl.title != null) { draft.title = fill(tpl.title); draft.tplTitle = tpl.title; }
    if (tpl.body != null) { draft.body = fill(tpl.body); draft.tplBody = tpl.body; }
    if (tpl.tags) draft.tags.splice(0, draft.tags.length, ...tpl.tags.map((x) => ({ ...x })));
    if (tpl.rating) draft.rating = tpl.rating;
    if (draft.kind === 'video' && tpl.private != null) { draft.private = !!tpl.private; draft.unlisted = !!tpl.unlisted; }
    draft.tplId = tpl.sample || tpl.auto ? null : tpl.id;
    return () => { const prev = JSON.parse(snap); const tags = prev.tags; delete prev.tags; Object.assign(draft, prev); draft.tags.splice(0, draft.tags.length, ...tags); };
  },
  export() {
    const blob = new Blob([JSON.stringify({ app: 'iwara-enhanced', version: 1, templates: templates.all() }, null, 2)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'iwara-templates.json' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  import(onDone) {
    const input = h('input', { type: 'file', accept: 'application/json,.json', onchange: async () => {
      try {
        const j = JSON.parse(await input.files[0].text());
        const incoming = (j.templates || []).filter((x) => x && typeof x.name === 'string');
        const list = templates.all();
        for (const tpl of incoming) if (!list.some((x) => x.id === tpl.id)) list.push({ id: tpl.id || uid(), name: tpl.name.slice(0, 60), title: tpl.title, body: tpl.body, rating: tpl.rating, private: tpl.private, unlisted: tpl.unlisted, counter: tpl.counter | 0,
          tags: (tpl.tags || []).filter((x) => x && /^[a-z0-9_()\-.'!:+]+$/i.test(x.id)).map((x) => ({ id: x.id, type: String(x.type), sensitive: !!x.sensitive })) });
        templates.save(list);
        onDone(incoming.length);
      } catch { toast(t('failed'), { error: true }); }
    } });
    input.click();
  },
};

STYLE.push(`
.tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}
.tpl{position:relative;display:flex;flex-direction:column;gap:8px;min-height:104px;padding:12px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);cursor:pointer;text-align:left;overflow:hidden;
  transition:border-color .15s,transform .35s var(--ease),box-shadow .2s}
.tpl:hover{border-color:var(--fg3);transform:translateY(-2px);box-shadow:var(--shadow)}
.tpl:active{transform:scale(.98)}
.tpl .name{display:flex;align-items:center;gap:6px;font-weight:600;font-size:13.5px}
.tpl .name .ic{color:var(--fg3)}
.tpl .pat{font-size:12.5px;color:var(--fg2);line-height:1.9;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.tpl .pat .slot{font-size:11.5px;padding:0 5px;cursor:inherit}
.tpl .mini{display:flex;gap:4px;margin-top:auto;overflow:hidden;white-space:nowrap}
.tpl .mini span{font-size:11px;color:var(--fg2);background:var(--sunk);border-radius:5px;padding:1px 6px}
.tpl .ibtn{position:absolute;top:6px;right:6px;opacity:0;width:26px;height:26px}
.tpl:hover .ibtn{opacity:1}
.tpl.blank{align-items:center;justify-content:center;border-style:dashed;color:var(--fg2);font-weight:500}
.tplgroup{margin:18px 0 8px;font-size:11px;font-weight:600;color:var(--fg3);letter-spacing:.05em;text-transform:uppercase}
.tplgroup:first-child{margin-top:0}
.keep{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:12px;border:1px solid var(--line);margin-top:10px;transition:opacity .2s,border-color .2s}
.keep.off{opacity:.45}
.keep.off .kbody{pointer-events:none}
.keep .kbody{flex:1;min-width:0}
.keep .label{margin-bottom:6px}
.keep textarea,.keep input.pat{width:100%;border:1px solid var(--line2);border-radius:8px;background:var(--card);padding:8px 10px;outline:0;resize:vertical;font-size:13.5px}
.keep textarea:focus,.keep input.pat:focus{border-color:var(--fg)}
.sw{position:relative;width:34px;height:20px;border-radius:999px;border:0;background:var(--line2);cursor:pointer;flex:none;transition:background .2s;margin-top:1px}
.sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .4s var(--spring)}
.sw[aria-checked=true]{background:var(--fg)}
.app[data-theme=dark] .sw[aria-checked=true]::after{background:#0a0a0a}
.sw[aria-checked=true]::after{transform:translateX(14px)}
.slotbar{display:flex;gap:6px;align-items:center;margin-top:8px;min-height:30px}
`);

function patternNode(text) {
  const span = h('span');
  let last = 0;
  for (const m of String(text || '').matchAll(/\{([^{}\n]{1,24})\}/g)) {
    span.append(text.slice(last, m.index), h('span.slot', m[1] === '#' ? t('episode') : m[1]));
    last = m.index + m[0].length;
  }
  span.append(String(text || '').slice(last));
  return span;
}
function templateCard(tpl, onPick, onMenu) {
  return h('button.tpl', { type: 'button', onclick: (e) => { if (!e.target.closest('.ibtn')) onPick(tpl); } },
    h('div.name', icon(tpl.auto ? 'clock' : tpl.sample ? 'sparkle' : 'bookmark', 14), tpl.name),
    h('div.pat', tpl.title || tpl.body ? patternNode(tpl.title || (tpl.body || '').split('\n')[0]) : [tpl.rating && t(tpl.rating === 'general' ? 'ratingGeneral' : 'ratingEcchi'), tpl.private ? ' · ' + t('vPrivate') : tpl.unlisted ? ' · ' + t('vUnlisted') : '']),
    h('div.mini', (tpl.tags || []).slice(0, 4).map((x) => h('span', tagDict.name(x.id))), (tpl.tags || []).length > 4 && h('span', '+' + ((tpl.tags || []).length - 4))),
    onMenu && h('span.ibtn', { onclick: (e) => onMenu(tpl, e.currentTarget) }, icon('more')));
}

/** 模板库（弹层）。onPick(tpl) 套用。 */
function templateGallery(kind, onPick) {
  const close = sheet((done) => {
    // 搜索：按名称、标题格式、简介、标签（译名和 id）过滤，多个词都要命中
    const q = h('input', { placeholder: t('searchTpl'), spellcheck: false, oninput: () => draw(true) });
    const body = h('div');
    const wrap = h('div', h('div.field', { style: { marginBottom: '16px' } }, icon('search'), q), body);
    const hit = (tpl) => {
      const terms = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) return true;
      const hay = [tpl.name, tpl.title, tpl.body, ...(tpl.tags || []).map((x) => tagDict.name(x.id) + ' ' + x.id)].join(' ').toLowerCase();
      return terms.every((w) => hay.includes(w));
    };
    let lockedHeight = false;
    const draw = (filtering) => {
      clear(body);
      const mine = templates.all().filter(hit);
      const lastRaw = templates.last(kind);
      const last = lastRaw && hit({ ...lastRaw, name: t('lastPublish') }) ? lastRaw : null;
      const samples = templates.samples().filter(hit);
      const grid = (cls) => h('div.tpls' + (filtering ? '' : '.stagger') + (cls || ''));
      const pick = (tpl) => { done(); onPick(tpl); };
      const onMenu = (tpl, anchor) => menu(anchor, [
        { icon: 'pencil', label: t('edit'), onclick: () => { done(); saveTemplateSheet({ kind, title: tpl.title || '', body: tpl.body || '', tags: tpl.tags || [], rating: tpl.rating, private: tpl.private, unlisted: tpl.unlisted, tplId: tpl.id }, { editing: tpl }); } },
        { icon: 'trash', label: t('delete'), danger: true, onclick: () => { templates.remove(tpl.id); draw(); toast(t('deleted'), { action: t('undo'), onAction: () => { templates.upsert(tpl); } }); } },
      ]);
      if (mine.length || last) body.append(h('div.tplgroup', t('myTemplates')), add(grid(), [last && templateCard({ ...last, auto: true, name: t('lastPublish') }, pick), mine.map((tpl) => templateCard(tpl, pick, onMenu))]));
      if (samples.length) body.append(h('div.tplgroup', t('samples')), add(grid(), samples.map((tpl) => templateCard(tpl, pick))));
      if (!body.childNodes.length) body.append(h('div', { style: { padding: '40px 0', textAlign: 'center', color: 'var(--fg3)' } }, t('noResult')));
      // 过滤时弹层高度不跟着结果跳：按第一次的高度撑住
      if (!lockedHeight) requestAnimationFrame(() => { body.style.minHeight = body.offsetHeight + 'px'; lockedHeight = true; });
    };
    // 词库回来之前先摆几张卡片的骨架
    body.append(h('div.skel', { style: { width: '72px', height: '12px', margin: '4px 0 12px' } }), h('div.tpls', [0, 1, 2].map(() => h('div.tpl', { style: { pointerEvents: 'none' } }, skel(90, 14), skel('80%', 12), h('div.row', { style: { gap: '6px' } }, skel(48, 18, 6), skel(36, 18, 6))))));
    tagDict.load().then(() => { draw(false); setTimeout(() => q.focus(), 60); });
    const moreBtn = ibtn('more', '', () => menu(moreBtn, [
      { icon: 'download', label: t('exportTpl'), onclick: templates.export },
      { icon: 'upload', label: t('importTpl'), onclick: () => templates.import((n) => { draw(); toast('+' + n); }) },
    ]));
    return { title: h('span.row', t('templates'), moreBtn), body: wrap };
  }, { width: 720 });
  return close;
}

/** 存为模板。draft 提供当前内容；editing 传入时是修改已有模板。 */
function saveTemplateSheet(draft, { editing, onSaved } = {}) {
  const existing = editing || templates.all().find((x) => x.id === draft.tplId);
  // 套过模板且标题没被改掉填空之外的结构时，优先沿用原来的格式
  // 这份草稿是套模板填出来的：默认沿用原来带填空的格式，而不是这一期填好的具体内容
  const hasSlot = (x) => /\{[^{}\n]{1,24}\}/.test(x || '');
  let titlePattern = editing ? editing.title || '' : hasSlot(draft.tplTitle) ? draft.tplTitle : draft.title || '';
  const bodyPattern = !editing && hasSlot(draft.tplBody) ? draft.tplBody : draft.body || '';
  let counter = existing ? existing.counter | 0 : 0;
  const keep = { title: true, body: !!(draft.body || '').trim(), tags: draft.tags.length > 0, settings: true };

  // 选中的字正好是某个已选标签的译名时，填空名猜成它的类型（角色 / 作品…）
  const guess = (picked) => { const m = draft.tags.find((x) => tagDict.name(x.id) === picked.trim()); return m ? t(TAG_KIND[m.type] || 'general') : ''; };
  let bodyEd = null;
  sheet((done) => {
    const name = h('input', { value: existing ? existing.name : '', placeholder: t('templateName'), maxLength: 40 });
    const titleIn = h('input.pat', { value: titlePattern, spellcheck: false });
    bodyEd = mdEditor({ value: bodyPattern, slotMaker: { guess }, help: true });
    const preview = h('div.pat', { style: { marginTop: '8px', fontSize: '13px', lineHeight: '1.9' } });
    // 标题：选中一段字就在选区上方浮出「设为填空」
    let maker = null, makerKey = '';
    const updateMaker = () => {
      if (maker && maker.asking) return;
      const s = titleIn.selectionStart, e = titleIn.selectionEnd, picked = titleIn.value.slice(s, e);
      const ok = ui.root.activeElement === titleIn && e > s && okSlotText(picked);
      const key = ok ? s + ':' + e : '';
      if (key === makerKey) return;
      makerKey = key;
      if (maker) { const p = maker; maker = null; p.close(); }
      if (!ok) return;
      const a = inputCaretRect(titleIn, s), b = inputCaretRect(titleIn, e);
      const pop = slotMakerPop({ getBoundingClientRect: () => ({ ...a, right: b.right, width: b.right - a.left }) }, picked, guess(picked), (nm) => { titleIn.focus(); titleIn.setRangeText(`{${nm}}`, s, e, 'end'); refresh(); }, () => { if (maker === pop) { maker = null; makerKey = ''; } });
      maker = pop;
    };
    for (const evt of ['select', 'keyup', 'mouseup']) titleIn.addEventListener(evt, updateMaker);
    titleIn.addEventListener('blur', () => setTimeout(() => { if (maker && !maker.asking) updateMaker(); }, 0));
    titleIn.addEventListener('keydown', (e) => { if (e.key === 'Enter' && maker && !maker.asking) { e.preventDefault(); maker.ask(); } });
    const epBtn = btn(t('episode') + ' +1', { sm: true, icon: 'plus', onclick: () => {
      const m = titleIn.value.match(/(\d+)(?!.*\d)/);
      if (!m) return;
      counter = parseInt(m[1], 10);
      titleIn.setRangeText('{#}', m.index, m.index + m[1].length, 'end');
      refresh();
    } });
    const refresh = () => {
      clear(preview).append(patternNode(titleIn.value));
      epBtn.style.display = /\d/.test(titleIn.value.replace(/\{[^}]*\}/g, '')) && !/\{#\}/.test(titleIn.value) ? '' : 'none';
    };
    titleIn.addEventListener('input', refresh);
    const sw = (key, node) => {
      const b = h('button.sw', { type: 'button', role: 'switch', 'aria-checked': String(keep[key]), onclick: () => { keep[key] = !keep[key]; b.setAttribute('aria-checked', String(keep[key])); row.classList.toggle('off', !keep[key]); } });
      const row = h('div.keep' + (keep[key] ? '' : '.off'), b, h('div.kbody', node));
      return row;
    };
    const vis = draft.private ? 'vPrivate' : draft.unlisted ? 'vUnlisted' : 'vPublic';
    const body = h('div',
      h('div.field', icon('bookmark'), name),
      sw('title', [h('div.label', t('keepTitle')), titleIn, preview, h('div.slotbar', h('span.note', icon('sparkle', 14), h('span', t('slotHowTo'))), h('span.sp', { style: { flex: 1 } }), epBtn)]),
      sw('body', [h('div.label', t('keepBody')), bodyEd.el]),
      sw('tags', [h('div.label', t('keepTags')), h('div.chips', draft.tags.map((x) => h('span.chip', { style: { cursor: 'default', height: '26px', fontSize: '12px' } }, tagDict.name(x.id))))]),
      sw('settings', [h('div.label', t('keepSettings')), h('div.chips', h('span.chip', { style: { cursor: 'default', height: '26px', fontSize: '12px' } }, t(draft.rating === 'general' ? 'ratingGeneral' : 'ratingEcchi')), draft.kind === 'video' && h('span.chip', { style: { cursor: 'default', height: '26px', fontSize: '12px' } }, t(vis)))]));
    refresh();
    setTimeout(() => (name.value ? titleIn : name).focus(), 60);

    const build = (id) => ({
      id, name: name.value.trim() || titleIn.value.replace(/\{[^}]*\}/g, '…').slice(0, 24) || t('templates'), counter,
      title: keep.title ? titleIn.value : null, body: keep.body ? bodyEd.value : null, tags: keep.tags ? draft.tags.map((x) => ({ ...x })) : null,
      rating: keep.settings ? draft.rating : null, private: keep.settings && draft.kind === 'video' ? !!draft.private : null, unlisted: keep.settings && draft.kind === 'video' ? !!draft.unlisted : null,
      uses: existing ? existing.uses | 0 : 0,
    });
    const commit = (id) => { const tpl = build(id); templates.upsert(tpl); draft.tplId = tpl.id; done(); toast(t('tplSaved')); onSaved && onSaved(tpl); };
    return {
      title: t(editing ? 'edit' : 'saveAsTemplate'),
      body,
      footer: [btn(t('cancel'), { kind: 'ghost', onclick: done }), existing && !editing && btn(t('saveAsTemplate'), { onclick: () => commit(uid()) }), btn(existing ? t('update') : t('save'), { kind: 'primary', onclick: () => commit(existing ? existing.id : uid()) })],
    };
  }, { width: 600, onClose: () => bodyEd && bodyEd.destroy() });
}

// ── 70-upload.js ────────────────────────────────────────────────
// 第一步：上传。视频一选中就开始传，用户可以直接去填后面的步骤，不用等。

// 格式 / 大小限制都取自站点规则（25-siterules.js）；读不到时不在本地拦，交给服务端。
const fileExt = (name) => ((name || '').match(/\.[^.]+$/) || [''])[0].toLowerCase();
const imageTypeOk = (f) => { const r = siteRules.image(); if (!r || !r.exts.length) return true; const e = fileExt(f.name); return r.exts.includes(e) || (e === '.jpeg' && r.exts.includes('.jpg')); };
const imageSizeOk = (f) => { const r = siteRules.image(); return !r || !r.sizeMB || f.size <= r.sizeMB * MB; };
/**
 * 本地图片预览地址。站点 CSP 的 img-src 不放行 blob:（<img> 和 CSS 背景都会被拦，<video> 不受影响），只能用 data:；
 * 先缩到 max 再转 JPEG，免得十几 MB 的原图整份塞进 DOM。解不了码（webm 等）返回 null。
 */
async function previewDataUrl(file, max = 640) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * k)); c.height = Math.max(1, Math.round(bmp.height * k));
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    return c.toDataURL('image/jpeg', 0.85);
  } catch { return null; }
}
/** 封面只收静态图：从图库允许的扩展名里去掉视频 / 动图格式。 */
const coverAccept = () => { const r = siteRules.image(); const ex = r && r.exts.length ? r.exts.filter((e) => !['.webm', '.mp4', '.gif'].includes(e)) : []; return ex.length ? [...ex, ex.includes('.jpg') ? '.jpeg' : null].filter(Boolean).join(',') : 'image/jpeg,image/png,image/webp'; };
const imageAccept = () => { const r = siteRules.image(); return r && r.exts.length ? [...r.exts, r.exts.includes('.jpg') ? '.jpeg' : null].filter(Boolean).join(',') : 'image/*,video/webm'; };
const videoAccept = () => { const r = siteRules.video(); return r && r.containers.length ? r.containers.join(',') : 'video/*'; };

function probeVideo(file) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    const url = URL.createObjectURL(file);
    v.preload = 'metadata';
    v.muted = true;
    v.onloadedmetadata = () => resolve({ url, duration: v.duration, width: v.videoWidth, height: v.videoHeight });
    v.onerror = () => resolve({ url, duration: 0, width: 0, height: 0, broken: true });
    v.src = url;
  });
}
/** 从 MP4 头尾各读一段，找编码标识（moov 可能在开头也可能在末尾）。只做提示用，读不到就返回 null。 */
async function detectCodecs(file) {
  try {
    const n = 4 * MB;
    const parts = [file.slice(0, n), file.size > n ? file.slice(Math.max(n, file.size - n)) : null].filter(Boolean);
    const text = (await Promise.all(parts.map((b) => b.arrayBuffer()))).map((buf) => new TextDecoder('latin1').decode(new Uint8Array(buf))).join('');
    const pick = (list) => { for (const [tag, name] of list) if (text.includes(tag)) return name; return null; };
    return {
      video: pick([['avc1', 'H.264'], ['avc3', 'H.264'], ['hvc1', 'H.265'], ['hev1', 'H.265'], ['av01', 'AV1'], ['vp09', 'VP9'], ['mp4v', 'MPEG-4']]),
      audio: pick([['mp4a', 'AAC'], ['Opus', 'Opus'], ['ac-3', 'AC-3'], ['ec-3', 'E-AC-3'], ['fLaC', 'FLAC'], ['.mp3', 'MP3']]),
    };
  } catch { return null; }
}
/** 实际播一小段数帧数，估帧率；浏览器不支持或放不出来就返回 null。 */
function measureFps(url) {
  return new Promise((resolve) => {
    const v = document.createElement('video');
    if (!('requestVideoFrameCallback' in v)) return resolve(null);
    v.muted = true; v.playsInline = true; v.src = url;
    const times = [];
    const done = (val) => { v.pause(); v.removeAttribute('src'); v.load(); resolve(val); };
    const tick = (_, m) => {
      times.push(m.mediaTime);
      if (times.length >= 24) {
        const d = times.slice(1).map((x, i) => x - times[i]).filter((x) => x > 0).sort((a, b) => a - b);
        const med = d[Math.floor(d.length / 2)];
        return done(med ? Math.round(1 / med) : null);
      }
      v.requestVideoFrameCallback(tick);
    };
    v.requestVideoFrameCallback(tick);
    v.play().catch(() => done(null));
    setTimeout(() => done(null), 4000);
  });
}

/** 从本地文件里均匀截 n 帧，给封面选择和预览卡在服务端缩略图出来之前用。 */
async function captureFrames(url, duration, n = 16) {
  const v = document.createElement('video');
  v.muted = true;
  v.src = url;
  await new Promise((r) => { v.onloadeddata = r; v.onerror = r; });
  if (!v.videoWidth) return [];
  const c = document.createElement('canvas');
  c.width = 320;
  c.height = Math.round((320 * v.videoHeight) / v.videoWidth);
  const ctx = c.getContext('2d');
  const out = [];
  for (let i = 0; i < n; i++) {
    v.currentTime = (duration * (i + 0.5)) / n;
    await new Promise((r) => { v.onseeked = r; setTimeout(r, 1500); });
    try { ctx.drawImage(v, 0, 0, c.width, c.height); out.push(c.toDataURL('image/jpeg', 0.7)); } catch { break; }
  }
  return out;
}

STYLE.push(`
.drop{position:relative;display:grid;place-items:center;min-height:320px;border-radius:16px;border:1.5px dashed var(--line2);background:var(--card);cursor:pointer;overflow:hidden;
  transition:border-color .2s,background .2s,transform .5s var(--spring)}
.drop:hover{border-color:var(--fg3)}
.drop.over{border-color:var(--fg);border-style:solid;transform:scale(1.012);background:var(--sunk)}
.drop.bad{animation:shake .4s}
.drop .hint{display:flex;flex-direction:column;align-items:center;gap:14px;font-weight:500;font-size:15px}
.drop .orb{width:56px;height:56px;border-radius:16px;display:grid;place-items:center;border:1px solid var(--line);background:var(--bg);box-shadow:0 1px 2px rgba(0,0,0,.05);animation:float 3.2s ease-in-out infinite}
.drop.over .orb{animation:none;transform:translateY(-6px) scale(1.1);transition:transform .4s var(--spring)}
@keyframes float{50%{transform:translateY(-5px)}}
.specs{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.spec{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px;border-radius:999px;border:1px solid var(--line);font-size:12px;color:var(--fg2);font-weight:500;transition:all .25s}
.spec.ok{color:var(--green);border-color:color-mix(in srgb,var(--green) 40%,transparent)}
.spec.no{color:var(--red);border-color:var(--red);background:color-mix(in srgb,var(--red) 8%,transparent)}
.stagebox{position:relative;border-radius:16px;overflow:hidden;background:#000;border:1px solid var(--line);animation:rise .5s var(--ease)}
.stagebox video,.stagebox img.poster{display:block;width:100%;max-height:380px;aspect-ratio:16/9;object-fit:contain;background:#000}
.upbar{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);margin-top:12px}
.upbar .name{font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.upbar .meta{color:var(--fg3);font-size:12.5px;white-space:nowrap}
.ring{position:relative;width:34px;height:34px;flex:none}
.ring>svg{transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:3;stroke:var(--line)}
.ring circle.v{stroke:var(--fg);stroke-linecap:round;transition:stroke-dashoffset .35s var(--ease),stroke .3s}
.ring.spin2>svg{animation:spin 1.1s linear infinite}
.ring.done circle.v{stroke:var(--green)}
.ring.err circle.v{stroke:var(--red)}
.ring .mid{position:absolute;inset:0;display:grid;place-items:center;font-size:10px;font-weight:600}
.ring.done .mid{color:var(--green);animation:pop .45s var(--spring)}
.srcsw{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.imgs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:12px}
.imgc{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;border:1px solid var(--line);background:var(--sunk) center/cover;cursor:grab;animation:pop .4s var(--spring);transition:transform .3s var(--ease),opacity .2s,box-shadow .2s}
.imgc.drag{opacity:.35}
.imgc.target{box-shadow:0 0 0 2px var(--fg);transform:scale(.96)}
.imgc .no{position:absolute;left:8px;top:8px;min-width:22px;height:22px;padding:0 6px;border-radius:7px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:600;display:grid;place-items:center;backdrop-filter:blur(6px)}
.imgc .rm{position:absolute;right:6px;top:6px;width:26px;height:26px;border-radius:8px;border:0;background:rgba(0,0,0,.6);color:#fff;display:grid;place-items:center;cursor:pointer;opacity:0;transition:opacity .15s;backdrop-filter:blur(6px)}
.imgc:hover .rm{opacity:1}
.imgc .veil{position:absolute;inset:0;background:rgba(0,0,0,.5);display:grid;place-items:center;color:#fff;transition:opacity .3s}
.imgc .veil i{position:absolute;left:0;bottom:0;height:3px;background:#fff;transition:width .2s}
.imgc.err{border-color:var(--red)}
.drop.slim{min-height:88px}.drop.slim .hint{flex-direction:row;flex-wrap:wrap;justify-content:center;gap:12px;padding:16px}
.drop.slim .orb{width:40px;height:40px;border-radius:12px}
`);

function progressRing() {
  const C = 2 * Math.PI * 14;
  const el = h('div.ring');
  el.innerHTML = `<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="14"/><circle class="v" cx="17" cy="17" r="14" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
  const mid = h('div.mid.mono');
  el.append(mid);
  const v = el.querySelector('.v');
  return {
    el,
    set(state, p = 0) {
      el.className = 'ring' + (state === 'spin' ? ' spin2' : state === 'done' ? ' done' : state === 'err' ? ' err' : '');
      v.style.strokeDashoffset = C * (1 - (state === 'spin' ? 0.28 : state === 'done' || state === 'err' ? 1 : p));
      clear(mid);
      if (state === 'done') mid.append(icon('check', 16));
      else if (state === 'err') mid.append(icon('x', 14));
      else if (state === 'progress') mid.textContent = Math.round(p * 100);
    },
  };
}

/**
 * 视频上传控制器：负责校验、上传、等服务端处理，状态变化时通知界面。
 * state: { phase: idle|uploading|waiting|active|done|error, progress, loaded, elapsed, error, name, size, localUrl, meta, frames }
 */
/** YouTube 链接 → 视频 id。带不带 https://、www / m / music、watch?v= / youtu.be / shorts / embed / live 都认；认不出返回 null。 */
function youtubeId(input) {
  let s = String(input || '').trim();
  if (!s) return null;
  if (!/^[a-z]+:\/\//i.test(s)) s = 'https://' + s;
  let u;
  try { u = new URL(s); } catch { return null; }
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, '');
  const ok = (id) => (/^[\w-]{11}$/.test(id || '') ? id : null);
  if (host === 'youtu.be') return ok(u.pathname.split('/')[1]);
  if (host !== 'youtube.com' && host !== 'youtube-nocookie.com') return null;
  if (u.searchParams.get('v')) return ok(u.searchParams.get('v'));
  const [, a, b] = u.pathname.split('/');
  return ['shorts', 'embed', 'live', 'v'].includes(a) ? ok(b) : null;
}
/** 提交给站点用的写法：站点只认 www.youtube.com / youtu.be，缩略图也按 ?v= 取 id。 */
const youtubeUrl = (id) => 'https://www.youtube.com/watch?v=' + id;

function videoUploader(draft, notify) {
  const state = { phase: draft.file ? 'done' : 'idle', progress: 0, frames: [] };
  let job = null, token = 0;
  const set = (patch) => { Object.assign(state, patch); notify(state); };

  async function check(file) {
    const meta = await probeVideo(file);
    const fails = [];
    const R = siteRules.video();
    if (R && R.containers.length && !R.containers.includes(fileExt(file.name))) fails.push('type');
    if (!meta.broken && R) {
      if (!svc.isStaff && R.minDur && meta.duration < R.minDur) fails.push('duration');
      if (R.minW && R.minH && meta.width * meta.height < R.minW * R.minH) fails.push('resolution');
    }
    if (svc.sizeLimit && file.size > svc.sizeLimit) fails.push('size');
    return { meta, fails };
  }

  async function start(file) {
    const my = ++token;
    if (job) job.abort();
    const { meta, fails } = await check(file);
    if (fails.length) { URL.revokeObjectURL(meta.url); set({ probe: { name: file.name, size: file.size, meta, fails } }); detectCodecs(file).then((codec) => { if (my === token && state.probe) set({ probe: { ...state.probe, meta: { ...meta, codec } } }); }); return fails; }
    draft.file = null;
    draft.fileName = file.name;
    set({ phase: 'uploading', progress: 0, loaded: 0, error: null, name: file.name, size: file.size, localUrl: meta.url, meta, frames: [], probe: null });
    // 编码、帧率只用来提示会不会被重新编码，不挡上传
    detectCodecs(file).then((codec) => { if (my === token) set({ meta: { ...state.meta, codec } }); });
    measureFps(meta.url).then((fps) => { if (my === token) set({ meta: { ...state.meta, fps } }); });
    captureFrames(meta.url, meta.duration).then((frames) => { if (my === token) set({ frames }); });
    try {
      job = svc.uploadVideo(file, (p, loaded) => my === token && set({ progress: p, loaded }));
      const { id, key } = await job.promise;
      if (my !== token) return [];
      set({ phase: 'waiting', elapsed: 0 });
      const data = await svc.waitProcessed(id, key, (s) => my === token && set({ phase: s.status === 'active' ? 'active' : 'waiting', elapsed: s.elapsed }), () => my !== token);
      if (my !== token || !data) return [];
      draft.file = data;
      set({ phase: 'done' });
    } catch (e) {
      if (my !== token || e.status === -1) return [];
      // 上传失败体：{ message, reason:'fileTooLarge'|'invalidMime'|'unknown' } 或校验错 { errors:[{ field:'file.mimetype' }] }
      const d = e.data || {}, f0 = (d.errors || [])[0];
      const reason = d.reason === 'invalidMime' || (f0 && f0.field === 'file.mimetype') ? 'errType' : d.reason === 'fileTooLarge' ? 'srv_fileTooLarge' : e.status === 0 ? 'errNetwork' : e.status === 422 ? 'errProcess' : e.status === 401 ? 'errLogin' : 'errUpload';
      const other = f0 && f0.field !== 'file.mimetype';
      set({ phase: 'error', error: reason, errorText: other ? e.text : null, retry: () => start(file) });
    }
    return [];
  }
  function reset() { token++; if (job) job.abort(); draft.file = null; draft.fileName = null; set({ phase: 'idle', progress: 0, localUrl: null, frames: [], error: null, probe: null, meta: null, size: 0 }); }
  return { state, start, reset, get busy() { return ['uploading', 'waiting', 'active'].includes(state.phase); } };
}

/** 图片上传控制器：多张并行上传，支持排序和移除。items: [{key, url, file(服务端文件对象), progress, error}] */
function imageUploader(draft, notify) {
  const items = (draft.files || []).map((f) => ({ key: f.id, url: thumbUrl.file(f), file: f, progress: 1 }));
  const sync = () => { draft.files = items.filter((x) => x.file).map((x) => x.file); notify(); };
  function add(fileList) {
    const bad = [];
    for (const file of fileList) {
      if (!imageTypeOk(file)) { bad.push('errImgType'); continue; }
      if (!imageSizeOk(file)) { bad.push('errImgSize'); continue; }
      if (items.length >= 100) break;
      const item = { key: uid(), url: null, name: file.name, size: file.size, mime: file.type, progress: 0 };
      items.push(item);
      if (file.type.startsWith('image')) previewDataUrl(file).then((u) => { if (u && items.includes(item)) { item.url = u; notify(item); } });
      const job = svc.uploadImage(file, (p) => { item.progress = p; notify(item); });
      item.abort = job.abort;
      job.promise.then((res) => { item.file = res.id && res.name ? res : { id: res.id, type: 'image', name: file.name, mime: file.type, size: file.size }; item.progress = 1; sync(); }, (e) => { if (e.status !== -1) { item.error = true; item.errorText = e.text; notify(); } });
    }
    notify();
    return bad;
  }
  function remove(item) { item.abort && !item.file && item.abort(); items.splice(items.indexOf(item), 1); sync(); }
  function move(from, to) { const [it] = items.splice(from, 1); items.splice(to, 0, it); sync(); }
  return { items, add, remove, move, get busy() { return items.some((x) => !x.file && !x.error); } };
}

function dropzone({ accept, multiple, label, specs, onFiles, slim }) {
  const input = h('input', { type: 'file', accept, multiple, style: { display: 'none' }, onchange: () => { if (input.files.length) onFiles([...input.files]); input.value = ''; } });
  const text = h('span', label);
  const specEls = {};
  const el = h('div.drop' + (slim ? '.slim' : ''), { tabIndex: 0, role: 'button', onclick: () => input.click(), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } } },
    h('div.hint', h('div.orb', icon('upload', slim ? 18 : 24)), text, specs && h('div.specs', specs.map(([key, lbl]) => (specEls[key] = h('span.spec', lbl))))), input);
  let depth = 0;
  el.addEventListener('dragenter', (e) => { e.preventDefault(); depth++; el.classList.add('over'); text.textContent = t('dropHere'); });
  el.addEventListener('dragover', (e) => e.preventDefault());
  el.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; el.classList.remove('over'); text.textContent = label; } });
  el.addEventListener('drop', (e) => { e.preventDefault(); depth = 0; el.classList.remove('over'); text.textContent = label; const files = [...e.dataTransfer.files]; if (files.length) onFiles(multiple ? files : files.slice(0, 1)); });
  el.flag = (fails) => {
    for (const k in specEls) specEls[k].className = 'spec' + (fails.includes(k) ? ' no' : '');
    if (fails.length) { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
  };
  el.pick = () => input.click();
  return el;
}

function uploadStepVideo(ctx) {
  const { draft, uploader } = ctx;
  const box = h('div');
  const ring = progressRing();
  const statusName = h('div.name'), statusMeta = h('div.meta.mono');
  const specs = null;
  const panel = checkPanel();
  const facts = (s) => {
    if (s.probe) return { size: s.probe.size, ...s.probe.meta, fails: s.probe.fails };
    if (s.meta && s.size) return { size: s.size, ...s.meta };
    const f = draft.file;
    return f ? { size: f.size, width: f.width, height: f.height, duration: f.duration, codec: null } : null;
  };
  const onFiles = async ([file]) => { const fails = await uploader.start(file); if (fails.length) { ensureZone(); zone.flag(fails); } };
  let zone = null, stage = null, mode = null;
  const ensureZone = () => { if (mode === 'zone') return; mode = 'zone'; zone = dropzone({ accept: videoAccept(), label: t('dropVideo'), specs, onFiles }); clear(box).append(zone); };
  const drawPanel = (s) => { panel.el.style.display = draft.source === 'embed' ? 'none' : ''; if (draft.source !== 'embed') panel.update(videoCheckRows(facts(s))); };
  const embedIn = h('input', { value: draft.embedUrl || '', placeholder: t('embedPh'), spellcheck: false, oninput: () => { draft.embedUrl = embedIn.value.trim(); drawEmbed(); ctx.changed(); } });
  const embedPrev = h('div');
  const embedNote = h('div.note', { style: { marginTop: '8px' } });
  let shownId = null;
  const drawEmbed = () => {
    const id = youtubeId(draft.embedUrl);
    const bad = !!draft.embedUrl && !id;
    clear(embedNote).append(icon(bad ? 'warn' : 'link', 14), h('span', bad ? t('embedBad') : siteRules.text('videoForm.embedUrlDescription') || t('embedPh')));
    embedNote.style.color = bad ? 'var(--red)' : '';
    if (id === shownId) return;
    shownId = id;
    clear(embedPrev);
    if (id) embedPrev.append(h('div.stagebox', { style: { marginTop: '12px' } }, h('img.poster', { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, referrerPolicy: 'no-referrer' })));
  };

  function draw(s) {
    drawPanel(s);
    if (draft.source === 'embed') {
      if (mode !== 'embed') { mode = 'embed'; clear(box).append(h('div.field', { style: { height: '48px' } }, icon('link'), embedIn), embedNote, embedPrev); drawEmbed(); setTimeout(() => embedIn.focus(), 60); }
      return;
    }
    if (s.phase === 'idle') return ensureZone();
    if (mode !== 'stage') {
      mode = 'stage';
      const media = s.localUrl ? h('video', { src: s.localUrl, controls: true, muted: true, playsInline: true, preload: 'metadata' })
        : h('img.poster', { src: thumbUrl.video(draft, draft.thumbnail) || '', referrerPolicy: 'no-referrer' });
      stage = h('div.stagebox', media);
      const pick = h('input', { type: 'file', accept: videoAccept(), style: { display: 'none' }, onchange: () => pick.files[0] && onFiles([pick.files[0]]) });
      clear(box).append(stage, h('div.upbar', ring.el, h('div.grow', statusName, statusMeta), pick,
        btn(t('replace'), { sm: true, icon: 'swap', onclick: () => pick.click() }), ibtn('trash', t('remove'), () => uploader.reset())));
    }
    statusName.textContent = s.name || draft.fileName || (draft.file && draft.file.name) || '';
    const f = draft.file;
    if (s.phase === 'uploading') { ring.set('progress', s.progress); statusMeta.textContent = `${t('uploading')} · ${fmtSize(s.loaded || 0)} / ${fmtSize(s.size)}`; }
    else if (s.phase === 'waiting') { ring.set('spin'); statusMeta.textContent = `${t('queued')} · ${fmtClock(s.elapsed || 0)}`; }
    else if (s.phase === 'active') { ring.set('spin'); statusMeta.textContent = `${t('processing')} · ${fmtClock(s.elapsed || 0)}`; }
    else if (s.phase === 'done') { ring.set('done'); statusMeta.textContent = f ? [f.width && `${f.width}×${f.height}`, f.duration && fmtDuration(f.duration), f.size && fmtSize(f.size)].filter(Boolean).join(' · ') : t('ready'); }
    else if (s.phase === 'error') { ring.set('err'); clear(statusMeta).append(s.errorText || t(s.error), ' · ', h('a', { href: '#', style: { color: 'var(--fg)' }, onclick: (e) => { e.preventDefault(); s.retry(); } }, t('retry'))); }
  }
  const off = ctx.bus.on('upload', draw);
  const source = ctx.mode === 'create' && segmented([{ value: 'file', label: t('file'), icon: 'upload' }, { value: 'embed', label: t('embed'), icon: 'link' }], draft.source, (v) => { draft.source = v; mode = null; draw(uploader.state); ctx.changed(); });
  draw(uploader.state);
  return { el: h('div', source && h('div.srcsw', source, ctx.cooldownChip()), box, panel.el, creatorLinks()), dispose: off };
}

function uploadStepImage(ctx) {
  const { images } = ctx;
  const grid = h('div.imgs');
  const zoneBox = h('div');
  const cells = new Map();
  let dragging = null, slim = null;
  function draw(changed) {
    // 快路径只更新进度；预览图刚生成（url 变了）要走下面的完整绘制去换图
    if (changed && cells.has(changed.key) && cells.get(changed.key).url === (changed.url || null)) { const c = cells.get(changed.key); c.bar.style.width = changed.progress * 100 + '%'; return; }
    const wantSlim = images.items.length > 0;
    if (wantSlim !== slim) {
      slim = wantSlim;
      const zone = dropzone({ accept: imageAccept(), multiple: true, slim, label: t('dropImage'), onFiles: (files) => {
        rejected = files.filter((f) => !imageTypeOk(f) || !imageSizeOk(f)).map((f) => ({ name: f.name, type: !imageTypeOk(f) }));
        const bad = images.add(files);
        if (bad.length) { zone.flag([]); toast(t(bad[0]), { error: true }); }
        drawPanel();
      } });
      clear(zoneBox).append(zone);
    }
    for (const [key, c] of cells) if (!images.items.some((x) => x.key === key)) { c.el.remove(); cells.delete(key); }
    images.items.forEach((item, i) => {
      let c = cells.get(item.key);
      if (!c) {
        const bar = h('i');
        const veil = h('div.veil', h('div.spin'), bar);
        const no = h('span.no.mono');
        const ph = h('div.veil', { style: { background: 'none', color: 'var(--fg3)' } }, icon('film', 28));
        const el = h('div.imgc', { draggable: true }, ph, no, veil,
          h('button.rm', { type: 'button', onclick: () => images.remove(item) }, icon('x', 14)));
        el.addEventListener('dragstart', (e) => { dragging = item; el.classList.add('drag'); e.dataTransfer.effectAllowed = 'move'; });
        el.addEventListener('dragend', () => { dragging = null; el.classList.remove('drag'); grid.querySelectorAll('.target').forEach((x) => x.classList.remove('target')); });
        el.addEventListener('dragover', (e) => { if (dragging && dragging !== item) { e.preventDefault(); el.classList.add('target'); } });
        el.addEventListener('dragleave', () => el.classList.remove('target'));
        el.addEventListener('drop', (e) => { e.preventDefault(); if (dragging && dragging !== item) flip(() => images.move(images.items.indexOf(dragging), images.items.indexOf(item))); });
        c = { el, bar, veil, no, ph, url: null };
        cells.set(item.key, c);
      }
      // 预览图是异步生成的（见 previewDataUrl），格子先建好，图到了再换上
      if (item.url && c.url !== item.url) { c.url = item.url; c.el.style.backgroundImage = `url(${item.url})`; c.ph.remove(); }
      c.no.textContent = i + 1;
      c.bar.style.width = item.progress * 100 + '%';
      c.veil.style.opacity = item.file ? 0 : 1;
      c.veil.style.pointerEvents = 'none';
      c.el.classList.toggle('err', !!item.error);
      c.el.title = item.error ? t('errUpload') + (item.errorText ? (env.lang === 'zh' ? '：' : ': ') + item.errorText : '') : '';
      if (item.error) clear(c.veil).append(icon('warn', 22));
      if (grid.children[i] !== c.el) grid.insertBefore(c.el, grid.children[i] || null);
    });
  }
  /** 排序时让其余格子滑到新位置。 */
  function flip(mutate) {
    const before = new Map([...cells].map(([k, c]) => [k, c.el.getBoundingClientRect()]));
    mutate();
    for (const [k, c] of cells) {
      const a = before.get(k), b = c.el.getBoundingClientRect();
      if (a && (a.left !== b.left || a.top !== b.top)) c.el.animate([{ transform: `translate(${a.left - b.left}px,${a.top - b.top}px)` }, { transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }
  // 检查面板：每张的格式、最大一张的大小、被拒的文件
  const panel = checkPanel();
  let rejected = [];
  const ext = (it) => (it.mime || (it.file && it.file.mime) || '').split('/')[1] || (it.name || '').split('.').pop();
  const imgFmtHint = () => { const r = siteRules.image(); return r ? r.exts.map((x) => x.replace('.', '').toUpperCase()).join(' · ') : ''; };
  const imgSizeHint = () => { const r = siteRules.image(); return r && r.sizeMB ? t('fImgSize', { n: r.sizeMB }) : ''; };
  function drawPanel() {
    const items = images.items.filter((x) => !x.error);
    const has = items.length > 0;
    const counts = {};
    for (const it of items) { const e = String(ext(it) || '?').replace('jpeg', 'jpg').toUpperCase(); counts[e] = (counts[e] || 0) + 1; }
    const sizes = items.map((it) => (it.file && it.file.size) || it.size || 0);
    const biggest = Math.max(0, ...sizes);
    const badType = rejected.filter((x) => x.type), badSize = rejected.filter((x) => !x.type);
    panel.update([
      { key: 'fmt', icon: 'picture', label: t('fFormat'), value: has ? Object.entries(counts).map(([k, n]) => `${k} ×${n}`).join(' · ') : null, hint: imgFmtHint() + (badType.length ? ' — ' + t('fRejected', { n: badType.length }) + badType.map((x) => x.name).join('、') : ''), status: badType.length ? 'no' : has ? 'ok' : null },
      { key: 'size', icon: 'file', label: t('fSize'), value: has && biggest ? t('fBiggest', { n: fmtSize(biggest) }) : null, hint: imgSizeHint() + (badSize.length ? ' — ' + t('fRejected', { n: badSize.length }) + badSize.map((x) => x.name).join('、') : ''), status: badSize.length ? 'no' : has ? 'ok' : null },
      { key: 'count', icon: 'layers', label: t('fCount'), value: has ? String(items.length) : null, hint: t('fImgOrder'), status: null },
    ]);
  }
  const off = ctx.bus.on('images', (it) => { draw(it); if (!it) drawPanel(); });
  draw();
  drawPanel();
  return { el: h('div', ctx.mode === 'create' && h('div.srcsw', h('span', { style: { flex: 1 } }), ctx.cooldownChip()), zoneBox, grid, panel.el, creatorLinks()), dispose: off };
}


// ── 文件检查面板：上传前列出每条要求，选了文件后逐条对上实际值 ──────────────
// 规则抄自原版发布页「创作者须知」：编码不符或码率超限不会被拒，但会被 Iwara 重新编码（琥珀色）；硬性要求不符（红色）。
const LINK_ICON = { faq: 'chat', compression: 'film', tutorial: 'bookmark' };
STYLE.push(`
.fchk{margin-top:14px;border:1px solid var(--line);border-radius:14px;background:var(--card);overflow:hidden}
.fchk .fr{display:grid;grid-template-columns:30px 76px minmax(0,1fr) auto;align-items:center;gap:10px;min-height:46px;padding:8px 14px;border-top:1px solid var(--line)}
.fchk .fr:first-child{border-top:0}
.fchk .fi{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;background:var(--sunk);color:var(--fg2);transition:background .3s,color .3s}
.fchk .fl{font-size:13px;font-weight:500}
.fchk .fv{display:flex;flex-direction:column;min-width:0}
.fchk .fv b{font-weight:600;font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.fchk .fv small{font-size:12px;color:var(--fg3);line-height:1.45}
.fchk .fs{display:inline-flex;align-items:center;gap:4px;height:24px;padding:0 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap;animation:pop .4s var(--spring)}
.fchk .fr.ok .fi{background:color-mix(in srgb,var(--green) 12%,transparent);color:var(--green)}
.fchk .fr.ok .fs{color:var(--green);background:color-mix(in srgb,var(--green) 10%,transparent)}
.fchk .fr.warn .fi{background:color-mix(in srgb,var(--amber) 14%,transparent);color:var(--amber)}
.fchk .fr.warn .fs{color:var(--amber);background:color-mix(in srgb,var(--amber) 12%,transparent)}
.fchk .fr.no .fi{background:color-mix(in srgb,var(--red) 12%,transparent);color:var(--red)}
.fchk .fr.no .fs{color:var(--red);background:color-mix(in srgb,var(--red) 10%,transparent)}
.fchk .fr.wait .fs{color:var(--fg3)}
.fchk .fr.wait .fs .spin{width:11px;height:11px}
.fchk .more{justify-self:start;cursor:help;text-decoration:underline dotted;text-underline-offset:3px}
.btable{width:100%;border-collapse:collapse;font-size:12.5px}
.btable th,.btable td{padding:5px 12px;text-align:right;white-space:nowrap}
.btable th{font-weight:600;color:var(--fg3);font-size:11.5px}
.btable td:first-child,.btable th:first-child{text-align:left;font-weight:600}
.btable tr.cur td{background:color-mix(in srgb,var(--amber) 12%,transparent)}
.btable tr+tr td{border-top:1px solid var(--line)}
.clinks{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:12px}
.clinks .label{margin-right:4px}
.clinks a{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border-radius:8px;color:var(--fg2);font-size:12.5px;font-weight:500;text-decoration:none;transition:background .15s,color .15s}
.clinks a:hover{background:var(--sunk);color:var(--fg)}
.clinks a .ic{color:var(--fg3)}
`);

/** 创作者链接：地址和文案都取自站点（发布页代码块里的链接 + 对应语言的文案）。 */
function creatorLinks() {
  const links = siteRules.links();
  if (!links.length) return null;
  return h('div.clinks', h('span.label', siteRules.text('videoForm.creatorInformation.creatorLinks') || t('creatorLinks')),
    links.map(({ href, key }) => h('a', { href, target: '_blank', rel: 'noopener' }, icon(LINK_ICON[key.split('.').pop()] || 'external', 14), siteRules.text(key) || key.split('.').pop(), icon('external', 12))));
}

/** rows: [{ key, icon, label, value?, hint, status? ('ok'|'warn'|'no'|'wait'), statusText?, more? }]，按 key 原地更新，不整块重建。 */
function checkPanel() {
  const el = h('div.fchk');
  const rows = new Map();
  function update(list) {
    const keep = new Set(list.map((r) => r.key));
    for (const [k, r] of rows) if (!keep.has(k)) { r.el.remove(); rows.delete(k); }
    list.forEach((r, i) => {
      let row = rows.get(r.key);
      if (!row) {
        row = { el: h('div.fr'), sig: '' };
        rows.set(r.key, row);
      }
      if (el.children[i] !== row.el) el.insertBefore(row.el, el.children[i] || null);
      const sig = JSON.stringify([r.status, r.value, r.hint, r.statusText]);
      if (sig === row.sig) return;
      row.sig = sig;
      row.el.className = 'fr' + (r.status ? '.' + r.status : '').replace('.', ' ');
      const hint = h('small', r.hint);
      if (r.more) { hint.classList.add('more'); hoverPanel(hint, r.more); }
      // 还在测（码率、编码）：值和结论都先摆骨架
      const waiting = r.status === 'wait';
      const badge = waiting ? h('span.fs', { 'aria-label': t('fChecking') }, skel(58, 18, 999)) : r.status && h('span.fs', icon(r.status === 'ok' ? 'check' : 'warn', 12), r.statusText || t(r.status === 'ok' ? 'fOk' : r.status === 'warn' ? 'fReencode' : r.status === 'no' ? 'fBad' : 'fChecking'));
      add(clear(row.el), [h('span.fi', icon(r.icon, 16)), h('span.fl', r.label), h('div.fv', waiting && !r.value ? skel(96, 12) : r.value && h('b', r.value), hint), badge || h('span')]);
    });
  }
  return { el, update };
}

function bitrateTable(B, tier) {
  return () => h('div', { style: { width: '300px', padding: '2px' } }, h('table.btable', h('tr', h('th', ''), B.fps.map((f) => h('th', f + ' FPS'))),
    B.rows.map(([p, ...caps]) => h('tr' + (p === tier ? '.cur' : ''), h('td', p + 'p'), caps.map((c) => h('td.mono', c))))),
    siteRules.text('videoForm.creatorInformation.bitrate.over') && h('div', { style: { padding: '8px 12px 4px', fontSize: '12px', lineHeight: '1.55', color: 'var(--fg3)' } }, siteRules.text('videoForm.creatorInformation.bitrate.over')));
}

/** 视频要求 + 实际值。规则全部取自站点（siteRules）；某条规则读不到，那一行只显示实际值、不判状态。
 *  facts: { size, width, height, duration, codec:{video,audio}, fps, fails:[] } 或 null（还没选文件）。 */
function videoCheckRows(facts) {
  const f = facts || {};
  const has = !!facts, fails = f.fails || [];
  const R = siteRules.video() || {}, B = siteRules.bitrate();
  const st = (rule, bad, warn, unknown) => (!has || !rule ? null : bad ? 'no' : unknown ? 'wait' : warn ? 'warn' : 'ok');
  // 码率：按短边落到哪一档；帧率测出来就取不超过它的那一列，测不出来就看是否落在最低列和最高列之间
  const short = Math.min(f.width || 0, f.height || 0);
  const row = B && (B.rows.find(([p]) => short <= p) || B.rows[B.rows.length - 1]);
  const caps = row ? row.slice(1) : [];
  const col = B && f.fps ? Math.max(0, B.fps.reduce((k, x, i) => (f.fps >= x - 5 ? i : k), 0)) : null;
  const kbps = f.size && f.duration ? Math.round((f.size * 8) / f.duration / 1000) : null;
  const cap = col != null ? caps[col] : null;
  const over = kbps != null && caps.length && (cap != null ? kbps > cap : kbps > caps[caps.length - 1]);
  const maybe = kbps != null && cap == null && caps.length > 1 && kbps > caps[0] && kbps <= caps[caps.length - 1];
  const codecs = R.codecs || [];
  const codecOk = f.codec && codecs.length ? codecs.includes(f.codec.video) && (!f.codec.audio || codecs.includes(f.codec.audio)) : null;
  const sizeMB = svc.sizeLimit ? svc.sizeLimit / MB : null;
  return [
    { key: 'codec', icon: 'film', label: t('fCodec'), value: has && f.codec ? [f.codec.video || '?', f.codec.audio || t('fNoAudio')].join(' · ') : null,
      hint: codecOk === false ? siteRules.text('videoForm.creatorInformation.restrictions.wrongFormat') : [...(R.containers || []).map((x) => x.replace('.', '').toUpperCase()), ...codecs].join(' · '),
      status: fails.includes('type') ? 'no' : f.codec === null ? null : st(codecs.length, false, codecOk === false, f.codec === undefined), statusText: fails.includes('type') ? t('errType') : null },
    { key: 'size', icon: 'file', label: t('fSize'), value: has && f.size ? fmtSize(f.size) : null,
      hint: sizeMB ? `≤ ${sizeMB} MB` + (!svc.isPremium && R.premiumMB ? t('fPremium', { n: R.premiumMB }) : '') : '', status: st(sizeMB, fails.includes('size')) },
    { key: 'res', icon: 'maximize', label: t('fRes'), value: has && f.width ? `${f.width}×${f.height}` : null, hint: R.minW ? `≥ ${R.minW}×${R.minH}` : '', status: st(R.minW, fails.includes('resolution')) },
    { key: 'dur', icon: 'clock', label: t('fDur'), value: has && f.duration ? fmtDuration(f.duration) : null, hint: R.minDur ? t('fDurHint', { n: R.minDur }) : '', status: st(R.minDur, fails.includes('duration')) },
    { key: 'rate', icon: 'gauge', label: t('fRate'), value: kbps != null ? `${kbps} kb/s` + (f.fps ? ` · ${f.fps} FPS` : '') : null,
      hint: !B ? '' : has && row && kbps != null ? t('fRateLimit', { p: row[0], n: cap != null ? cap : caps.join(' / '), fps: cap != null ? B.fps[col] + ' FPS' : B.fps.map((x) => x + '').join(' / ') + ' FPS' }) : t('fRateHint'),
      more: B ? bitrateTable(B, has && row ? row[0] : null) : null,
      status: !B ? null : has && kbps != null ? (over || maybe ? 'warn' : 'ok') : has ? 'wait' : null, statusText: maybe ? t('fMaybe', { n: B.fps[B.fps.length - 1] }) : null },
  ];
}

// ── 75-wizard.js ────────────────────────────────────────────────
// 分步发布 / 编辑：上传 → 内容 → 标签 → 发布。步骤之间可以随意跳，缺什么在最后一步的清单里点一下就回去补。

STYLE.push(`
.wrap{max-width:920px;margin:0 auto;padding:28px 24px 0;min-height:calc(100vh - 64px);display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:12px;margin-bottom:26px}
.top h1{margin:0;font-size:22px;font-weight:600;letter-spacing:-.03em}
.top .sp{flex:1}
.pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:500;border:1px solid var(--line);color:var(--fg2)}
.pill.amber{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 45%,transparent);background:color-mix(in srgb,var(--amber) 9%,transparent)}
.pill.violet{color:var(--violet);border-color:color-mix(in srgb,var(--violet) 45%,transparent);background:color-mix(in srgb,var(--violet) 9%,transparent)}
.pill.green{color:var(--green);border-color:color-mix(in srgb,var(--green) 45%,transparent);background:color-mix(in srgb,var(--green) 9%,transparent)}
.steps{display:flex;align-items:center;margin:0 0 28px;padding:0;list-style:none}
.steps li{display:flex;align-items:center;gap:10px;cursor:pointer;color:var(--fg3);font-weight:500;font-size:13.5px;transition:color .25s;user-select:none}
.steps li:hover{color:var(--fg2)}
.steps li.cur{color:var(--fg)}
.steps .n{position:relative;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:600;border:1.5px solid var(--line2);background:var(--bg);transition:all .35s var(--ease)}
.steps li.cur .n{border-color:var(--fg);background:var(--fg);color:var(--inv);transform:scale(1.08)}
.steps li.ok:not(.cur) .n{border-color:var(--fg);color:var(--fg)}
.steps li.ok .n .ic{animation:pop .4s var(--spring)}
.steps .n .mini{position:absolute;inset:-4px;border-radius:50%;border:2px solid transparent;border-top-color:var(--blue);animation:spin .9s linear infinite}
.steps .bar{flex:1;height:1.5px;margin:0 14px;background:var(--line2);border-radius:2px;overflow:hidden;min-width:20px}
.steps .bar i{display:block;height:100%;width:100%;background:var(--fg);transform:scaleX(0);transform-origin:left;transition:transform .6s var(--ease)}
.steps .bar.on i{transform:scaleX(1)}
.stage{position:relative;padding-bottom:14px}
.navbar{position:sticky;bottom:0;z-index:5;margin:auto -24px 0;padding:40px 24px 14px;display:flex;align-items:center;gap:10px;isolation:isolate}
.navbar::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);-webkit-mask-image:linear-gradient(to top,#000 0%,#000 38%,transparent 62%);mask-image:linear-gradient(to top,#000 0%,#000 38%,transparent 62%)}
.navbar .sp{flex:1}
.kbd{font:11px "Geist Mono",ui-monospace,Menlo,monospace;padding:1px 5px;border-radius:5px;border:1px solid color-mix(in srgb,currentColor 30%,transparent);opacity:.7}
.titlebox{position:relative;margin-bottom:16px}
.titlebox input,.titlebox .back{font-size:26px;font-weight:600;letter-spacing:-.03em;line-height:1.3;padding:6px 19px;width:100%;border:0;outline:0;background:none;white-space:pre}
.titlebox .back{position:absolute;inset:0;color:transparent;pointer-events:none;overflow:hidden}
.titlebox .back mark{background:color-mix(in srgb,var(--violet) 16%,transparent);color:transparent;border-radius:6px;box-shadow:0 0 0 1px color-mix(in srgb,var(--violet) 45%,transparent)}
.titlebox .back mark.edit{background:color-mix(in srgb,var(--amber) 16%,transparent);box-shadow:0 0 0 1.5px var(--amber);}
.titlebox .back mark.edit.empty{display:inline-block;width:.7em;margin-right:-.7em;vertical-align:-.15em;height:1.1em}
.titlebox input{position:relative;border-bottom:1px solid var(--line);padding-right:96px}
.titlebox .clr{position:absolute;right:11px;top:50%;margin-top:-13px;z-index:1}
.titlebox input:focus{border-color:var(--fg)}
.pub{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:28px;align-items:start}
@media (max-width:820px){.pub{grid-template-columns:1fr}}
.set{padding:16px 0;border-top:1px solid var(--line)}
.set:first-child{border-top:0;padding-top:0}
.set>.label{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.film{display:flex;gap:6px;overflow-x:auto;padding:3px;margin:-3px;scrollbar-width:thin}
.film button{flex:none;width:112px;aspect-ratio:16/9;border-radius:8px;border:0;padding:0;background:var(--sunk) center/cover;cursor:pointer;opacity:.55;transition:opacity .2s,transform .35s var(--spring),box-shadow .2s}
.film button:hover{opacity:.9}
.film button.on{opacity:1;box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--fg);transform:scale(.94)}
.film .custom{position:relative;overflow:hidden;opacity:1;box-shadow:inset 0 0 0 1.5px var(--line);display:grid;place-items:center;color:var(--mute)}
.film .custom:not(.has){background:transparent;box-shadow:none;outline:1.5px dashed var(--line);outline-offset:-1.5px}
.film .custom:not(.has):hover{color:var(--fg)}
.film .custom .cimg{position:absolute;inset:0;background:center/cover no-repeat}
.film .custom.has:not(.on) .cimg{opacity:.55}
.film .custom.has:not(.on):hover .cimg{opacity:.9}
.film .custom .clbl{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:11px}
.film .custom.has .clbl{display:none}
.film .custom .cbar{position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--fg);transform-origin:left;transform:scaleX(0);transition:transform .2s}
.film .custom:not(.up) .cbar{display:none}
.film .custom .crm{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;display:none;place-items:center;background:rgba(0,0,0,.55);color:#fff}
.film .custom.has .crm{display:grid}
.film .custom.on{box-shadow:0 0 0 2px var(--bg),0 0 0 4px var(--fg)}
.film button:disabled{cursor:not-allowed;opacity:.3}
.film button:disabled:hover{opacity:.3}
.covernote{margin-top:8px;font-size:12px;color:var(--mute);line-height:1.5}
.film .sk{flex:none;width:112px;aspect-ratio:16/9;border-radius:8px;background:linear-gradient(100deg,var(--sunk) 40%,var(--line) 50%,var(--sunk) 60%) 0/300% 100%;animation:shimmer 1.4s infinite linear}
@keyframes shimmer{to{background-position:-150% 0}}
.notes{display:flex;flex-direction:column;gap:7px}
.note{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;line-height:1.55;color:var(--fg2);animation:rise .35s var(--ease)}
.note .ic{flex:none;margin-top:2px;color:var(--fg3)}
.note.warn,.note.warn .ic{color:var(--amber)}
.note b{font-weight:600}
.slotlist{display:flex;flex-direction:column;gap:10px;padding:6px 6px 4px;max-width:300px}
.slotlist .sgh{display:flex;align-items:center;gap:6px;font-size:11.5px;font-weight:600;color:var(--fg3);margin-bottom:6px}
.slotlist .sgl{display:flex;flex-wrap:wrap;gap:5px}
.slotlist .slot{font-size:12.5px;padding:1px 7px;outline:0;border:1px dashed color-mix(in srgb,var(--amber) 70%,transparent);background:color-mix(in srgb,var(--amber) 10%,transparent);color:var(--amber);border-radius:6px}
.pcard{border-radius:14px;border:1px solid var(--line);background:var(--card);overflow:hidden;position:sticky;top:16px}
.pcard .shot{position:relative;aspect-ratio:16/9;background:var(--sunk) center/cover;transition:background-image .3s}
.pcard .shot .badge{position:absolute;right:8px;bottom:8px;padding:1px 6px;border-radius:5px;background:rgba(0,0,0,.72);color:#fff;font-size:11px;font-weight:600}
.pcard .shot .rate{position:absolute;left:8px;top:8px;padding:1px 7px;border-radius:5px;background:var(--red);color:#fff;font-size:11px;font-weight:700;animation:pop .4s var(--spring)}
.pcard .shot .vis{position:absolute;right:8px;top:8px;width:24px;height:24px;border-radius:7px;background:rgba(0,0,0,.6);color:#fff;display:grid;place-items:center;animation:pop .4s var(--spring)}
.pcard .info{padding:12px 14px 14px}
.pcard .ttl{font-weight:600;font-size:14px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:20px}
.pcard .ttl:empty::before{content:"";display:block;height:12px;width:70%;border-radius:4px;background:var(--sunk);margin-top:4px}
.pcard .by{color:var(--fg3);font-size:12px;margin-top:4px}
.pcard .tgs{display:flex;flex-wrap:wrap;gap:4px;margin-top:10px}
.pcard .tgs span{font-size:11px;padding:1px 7px;border-radius:999px;background:var(--sunk);color:var(--fg2)}
.checks{margin-top:14px;border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden}
.chk{display:flex;align-items:center;gap:10px;width:100%;height:38px;padding:0 12px;border:0;border-top:1px solid var(--line);background:none;cursor:pointer;font-size:13px;text-align:left}
.chk:first-child{border-top:0}
.chk:hover{background:var(--sunk)}
.chk .st{width:18px;height:18px;border-radius:50%;display:grid;place-items:center;border:1.5px solid var(--line2);color:transparent;transition:all .3s var(--ease);flex:none}
.chk.ok .st{background:var(--green);border-color:var(--green);color:#fff}
.chk.wait .st{border-color:var(--blue);border-top-color:transparent;animation:spin .8s linear infinite}
.chk small{margin-left:auto;color:var(--fg3);font-size:12px}
.agree{display:flex;align-items:center;gap:10px;margin-top:14px;padding-left:13px;font-size:13px;cursor:pointer;user-select:none}
.box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--line2);display:grid;place-items:center;color:transparent;transition:all .25s var(--ease);flex:none}
.agree.on .box{background:var(--fg);border-color:var(--fg);color:var(--inv)}
.agree.nudge{animation:shake .4s}
.sens .chip.on{background:var(--amber);border-color:var(--amber);color:#fff}
.done{display:flex;flex-direction:column;align-items:center;text-align:center;padding:56px 0 20px}
.done .tickc{width:84px;height:84px;border-radius:50%;background:var(--fg);color:var(--inv);display:grid;place-items:center;animation:pop .7s var(--spring)}
.done .tickc path{stroke-dasharray:30;stroke-dashoffset:30;animation:draw .5s .25s var(--ease) forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.done h2{margin:22px 0 6px;font-size:22px;letter-spacing:-.03em;animation:rise .5s .15s var(--ease) backwards}
.done .ttl{color:var(--fg2);max-width:520px;animation:rise .5s .2s var(--ease) backwards}
.done .acts{display:flex;gap:8px;margin-top:26px;flex-wrap:wrap;justify-content:center;animation:rise .5s .3s var(--ease) backwards}
.done .pill{margin-top:16px;height:30px;animation:rise .5s .25s var(--ease) backwards}
.loading{display:grid;place-items:center;min-height:50vh;color:var(--fg3)}
.wsk .wsk-steps{display:flex;align-items:center;gap:10px;margin:0 0 28px}
.wsk .wsk-line{flex:1;height:1px;background:var(--line)}
`);

const DRAFT_FIELDS = ['kind', 'source', 'file', 'files', 'embedUrl', 'thumbnail', 'title', 'body', 'rating', 'private', 'unlisted', 'tags', 'tplId', 'tplTitle', 'tplBody', 'customThumbnail', 'customUpload', 'fileName'];

function newDraft(kind) {
  const last = store.get('last:' + kind) || {};
  return { kind, source: 'file', file: null, files: [], embedUrl: '', thumbnail: 0, title: '', body: '', rating: last.rating || 'ecchi', private: false, unlisted: false, tags: [], tplId: null, tplTitle: null, agreed: false, customThumbnail: null, customUpload: null };
}
function draftFromRemote(kind, d) {
  return { kind, source: d.embedUrl ? 'embed' : 'file', file: d.file || null, files: d.files || [], embedUrl: d.embedUrl || '', thumbnail: typeof d.thumbnail === 'number' ? d.thumbnail : 0, title: d.title || '', body: d.body || '',
    rating: d.rating, private: !!d.private, unlisted: !!d.unlisted, tags: (d.tags || []).map((x) => ({ id: x.id, type: x.type, sensitive: !!x.sensitive })), tplId: null, tplTitle: null, agreed: false, customThumbnail: d.customThumbnail || null, customUpload: d.customThumbnail || null };
}

async function mountWizard(host, { kind, editId, app }) {
  const mode = editId ? 'edit' : 'create';
  // 首屏骨架：页头、四步、上传区的形状先摆出来，数据回来后原位换成真的
  clear(host).append(h('div.wrap.wsk', { 'aria-busy': 'true' },
    h('div.top', skel(120, 28), skel(150, 36, 10), h('span.sp', { style: { flex: 1 } }), skel(86, 36, 8), skel(32, 32, 8)),
    h('div.wsk-steps', [0, 1, 2, 3].map((i) => [i > 0 && h('span.wsk-line'), skel(28, 28, true), skel(36, 12)])),
    skel('100%', 240, 14),
    h('div', { style: { marginTop: '20px', display: 'grid', gap: '10px' } }, [70, 55, 62].map((w) => h('div.row', skel(28, 28, 8), skel(70, 12), skel(w * 3, 12))))));
  let original = null, draft;
  // 站点规则（限制、说明、链接）和标签词库一起取；规则最多等 6 秒，取不到就用上次缓存的
  await Promise.all([tagDict.load(), Promise.race([siteRules.load(), sleep(6000)])]);
  if (editId) {
    try { original = await svc.detail(kind, editId); } catch (e) { clear(host).append(h('div.loading', icon('warn', 24), e.text || e.message)); return () => {}; }
    draft = draftFromRemote(kind, original);
  } else {
    const saved = store.get('draft:' + kind);
    draft = Object.assign(newDraft(kind), saved || {});
    if (saved && (saved.title || saved.body || saved.file || (saved.files || []).length || (saved.tags || []).length)) {
      setTimeout(() => toast(t('draftRestored'), { action: t('discardDraft'), onAction: () => { store.del('draft:' + kind); app.reload(); } }), 500);
    }
  }
  const baseline = JSON.stringify(DRAFT_FIELDS.map((k) => draft[k]));

  const bus = emitter();
  // 上传 / 处理完成会改 draft.file(s)：也要落草稿，否则传完一刷新文件对象就丢了（只能重传）
  const uploader = kind === 'video' ? videoUploader(draft, (s) => { bus.emit('upload', s); bus.emit('change'); persist(); }) : null;
  const images = kind === 'image' ? imageUploader(draft, (item) => { bus.emit('images', item); if (!item) { bus.emit('change'); persist(); } }) : null;
  const order = mode === 'edit' && kind === 'video' ? ['content', 'tags', 'publish'] : ['upload', 'content', 'tags', 'publish'];
  let cur = 0, stepView = null, cooldown = { limited: false, remaining: 0 }, cooldownAt = Date.now(), disposed = false;
  const timers = [];
  // 自定义封面（高级会员 / staff）：上传中的那张，{ url(本地预览), progress, abort }；传完的服务端文件对象进 draft.customUpload，选中时同时进 draft.customThumbnail
  let coverUp = null;
  const coverLocal = new Map(); // 服务端文件 id → 本地预览地址，刚传完的图缩略图可能还没生成，先用本地的

  const persist = debounce(() => { if (mode === 'create' && !disposed) { const out = {}; for (const k of DRAFT_FIELDS) out[k] = draft[k]; store.set('draft:' + kind, out); } }, 400);
  const changed = () => { persist(); bus.emit('change'); };
  const dirty = () => JSON.stringify(DRAFT_FIELDS.map((k) => draft[k])) !== baseline;

  // ── 完成度 ──
  const fileState = () => {
    if (kind === 'image') return images.busy ? 'wait' : draft.files.length ? 'ok' : 'no';
    if (draft.source === 'embed') return youtubeId(draft.embedUrl) ? 'ok' : 'no';
    if (coverUp) return 'wait';
    return draft.file ? 'ok' : uploader.busy ? 'wait' : 'no';
  };
  const slotCount = () => md.slots(draft.title).length + md.slots(draft.body).length;
  const checks = () => ({ file: fileState(), title: draft.title.trim() ? 'ok' : 'no', category: draft.tags.some((x) => x.type === 'category') ? 'ok' : 'no', slots: slotCount() ? 'no' : 'ok', rating: draft.rating ? 'ok' : 'no', rules: svc.isStaff || draft.agreed ? 'ok' : 'no' });
  const stepOk = (name) => { const c = checks(); return name === 'upload' ? c.file === 'ok' : name === 'content' ? c.title === 'ok' && c.slots === 'ok' : name === 'tags' ? c.category === 'ok' : false; };
  const coolLeft = () => (cooldown.limited ? Math.max(0, cooldown.remaining - (Date.now() - cooldownAt) / 1000) : 0);

  // ── 页头 ──
  const kindSeg = mode === 'create' && segmented([{ value: 'video', label: t('video'), icon: 'film' }, { value: 'image', label: t('image'), icon: 'picture' }], kind, (v) => app.go(`/create/${v}`));
  const tplBtn = btn(t('templates'), { icon: 'bookmark', onclick: () => templateGallery(kind, applyTemplate) });
  // 帮助：在内容步打开时直接翻到「填空」，关掉后光标回到填空；别的步骤从「发布流程」开始
  const openHelp = () => (stepView && stepView.guide ? stepView.guide() : showHelp({ at: 'flow' }));
  const moreBtn = ibtn('more', '', () => app.menu(moreBtn, [{ icon: 'help', label: t('help'), onclick: openHelp }]));
  const header = h('div.top', h('h1', t(mode === 'edit' ? (kind === 'video' ? 'editVideo' : 'editImage') : kind === 'video' ? 'publishVideo' : 'publishImage')), kindSeg, h('span.sp'), tplBtn, moreBtn);

  function applyTemplate(tpl) {
    const undo = templates.apply(draft, tpl);
    changed();
    go(order.indexOf('content'), true);
    toast(t('applied', { n: tpl.name }), { action: t('undo'), onAction: () => { undo(); changed(); go(cur, true); } });
  }

  // ── 步骤条 ──
  const stepEls = order.map((name, i) => {
    const n = h('span.n', String(i + 1));
    const li = h('li', { onclick: () => go(i) }, n, h('span', t('step' + name[0].toUpperCase() + name.slice(1))));
    return { name, li, n };
  });
  const bars = [];
  const stepper = h('ol.steps', stepEls.map((s, i) => { if (!i) return s.li; const bar = h('span.bar', h('i')); bars.push(bar); return [bar, s.li]; }));
  function drawStepper() {
    stepEls.forEach((s, i) => {
      const ok = stepOk(s.name);
      const waiting = s.name === 'upload' && fileState() === 'wait';
      s.li.className = (i === cur ? 'cur ' : '') + (ok ? 'ok' : '');
      const want = ok && i !== cur ? 'check' : waiting ? 'wait' : 'num';
      if (s.n.dataset.s !== want) {
        s.n.dataset.s = want;
        add(clear(s.n), [want === 'check' ? icon('check', 14) : String(i + 1), want === 'wait' && h('span.mini')]);
      }
    });
    bars.forEach((b, i) => b.classList.toggle('on', i < cur));
  }

  // ── 步骤内容 ──
  const stage = h('div.stage');
  const ctx = {
    draft, mode, bus, uploader, images, changed,
    cooldownChip() {
      const chip = h('span.pill.amber', { style: { display: 'none' }, data: { tip: t('cooldown') } }, icon('clock', 13), h('span.mono'));
      const tick = () => { const left = coolLeft(); chip.style.display = left > 0 ? '' : 'none'; chip.lastChild.textContent = fmtClock(left); };
      tick();
      timers.push(setInterval(tick, 1000));
      return chip;
    },
  };

  const builders = {
    upload: () => (kind === 'video' ? uploadStepVideo(ctx) : uploadStepImage(ctx)),
    content() {
      // 标题里的填空位规则和简介一致：点 / Tab 进入橙色编辑区，回车、→、↑、↓、Esc 填完，空着按退格也算填完；
      // 光标停在填空位后面按退格整个删掉。编辑区 = [start, 总长 - tail]：区外的文字不会变，用尾长定位右端。
      const back = h('div.back');
      const input = h('input', { value: draft.title, placeholder: t('titlePh'), maxLength: 255, spellcheck: false });
      const tip = slotTip();
      let act = null; // { start, tail, label }
      const region = () => [act.start, input.value.length - act.tail];
      const segment = (text) => {
        let last = 0;
        for (const m of text.matchAll(SLOT_RE)) { back.append(text.slice(last, m.index), h('mark', m[0])); last = m.index + m[0].length; }
        back.append(text.slice(last));
      };
      const paint = () => {
        clear(back);
        const v = input.value;
        if (act) {
          const [s0, e0] = region();
          segment(v.slice(0, s0));
          const edit = h('mark.edit' + (s0 === e0 ? '.empty' : ''), v.slice(s0, e0));
          back.append(edit);
          segment(v.slice(e0));
          back.scrollLeft = input.scrollLeft;
          if (ui.root.activeElement === input) tip.show(edit.getBoundingClientRect(), act.label); else tip.hide();
        } else { segment(v); back.scrollLeft = input.scrollLeft; tip.hide(); }
      };
      const nextSlot = (from) => [...input.value.matchAll(SLOT_RE)].find((m) => m.index >= from);
      function enter(m) {
        input.focus();
        input.setSelectionRange(m.index, m.index + m[0].length);
        act = { start: m.index, tail: input.value.length - (m.index + m[0].length), label: m[1] };
        paint();
      }
      function finish(toEnd) {
        if (!act) return;
        const [, e0] = region();
        act = null;
        if (toEnd) input.setSelectionRange(e0, e0);
        paint();
      }
      // 光标离开编辑区就结束
      const watch = () => {
        if (!act) return;
        const [s0, e0] = region();
        if (e0 < s0 || input.selectionStart < s0 || input.selectionEnd > e0) finish(false); else paint();
      };
      const titleClr = clearBtn(t('checkTitle'), { read: () => input.value, write: (v) => { act = null; input.value = v; input.dispatchEvent(new Event('input')); input.focus(); } });
      input.addEventListener('input', () => { draft.title = input.value; watch(); paint(); changed(); titleClr.show(!!input.value); });
      input.addEventListener('scroll', () => { back.scrollLeft = input.scrollLeft; });
      input.addEventListener('keyup', watch);
      input.addEventListener('blur', () => tip.hide());
      input.addEventListener('focus', () => act && paint());
      input.addEventListener('mouseup', () => {
        if (input.selectionStart !== input.selectionEnd) return watch();
        const pos = input.selectionStart;
        const m = [...input.value.matchAll(SLOT_RE)].find((x) => pos >= x.index && pos < x.index + x[0].length);
        if (m && !(act && act.start === m.index)) enter(m); else watch();
      });
      input.addEventListener('keydown', (e) => {
        if (e.isComposing) return;
        if (e.key === 'Tab' && !e.shiftKey) {
          const m = nextSlot(act ? region()[1] : input.selectionEnd);
          // 没有下一个填空：正在填的这一格算填完，焦点留在原地，不让 Tab 跑到别的控件上
          if (m) { e.preventDefault(); enter(m); } else if (act) { e.preventDefault(); if (editor.focusFirstSlot()) finish(false); else finish(true); } else if (editor.focusFirstSlot()) e.preventDefault();
          return;
        }
        if (act) {
          if (['Enter', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); finish(true); return; }
          if (e.key === 'Backspace') { const [s0, e0] = region(); if (s0 === e0) { e.preventDefault(); finish(false); } }
          return;
        }
        if (e.key === 'Backspace' && input.selectionStart === input.selectionEnd) {
          const pos = input.selectionStart;
          const m = [...input.value.matchAll(SLOT_RE)].find((x) => x.index + x[0].length === pos);
          if (m) { e.preventDefault(); input.setRangeText('', m.index, pos, 'end'); input.dispatchEvent(new Event('input')); }
        } else if (e.key === 'Enter') { e.preventDefault(); editor.focusFirstSlot() || editor.focus(); }
      });
      const editor = mdEditor({ help: true, clearLabel: t('keepBody'), value: draft.body, placeholder: t('bodyPh'), onChange: (v) => { if (v !== draft.body) { draft.body = v; changed(); } } });
      paint();
      titleClr.show(!!input.value);
      const focusStart = () => { if (disposed) return; const m = nextSlot(0); if (m) enter(m); else if (!editor.focusFirstSlot()) input.focus(); };
      const guide = () => showHelp({ at: 'slots', onClose: () => setTimeout(focusStart, 60) });
      // 第一次进这一步：先放填空指引，关掉后再把光标放进第一个填空
      setTimeout(() => { if (disposed) return; if (!store.get('slotGuideDone')) guide(); else focusStart(); }, 80);
      return {
        el: h('div', h('div.titlebox', back, input, titleClr.el), editor.el),
        guide,
        dispose: () => { tip.remove(); editor.destroy(); },
        /** 进入第一个还没填的填空位（标题优先），没有返回 false。 */
        firstSlot: () => { const m = nextSlot(0); if (m) { enter(m); return true; } return editor.focusFirstSlot(); },
      };
    },
    tags() {
      const picker = tagPicker(draft.tags, changed, { required: true, kind }); // 视频、图库都必须恰好一个类别
      setTimeout(() => !disposed && picker.focus(), 80);
      return { el: picker.el, dispose: picker.dispose };
    },
    publish: () => publishStep(),
  };

  function publishStep() {
    const sensitive = svc.config.blacklist || [];
    const hasSens = () => draft.tags.some((x) => x.sensitive);
    // 封面
    const film = h('div.film');
    let frameSrc = [];
    const shot = h('div.shot');
    const rate = h('span.rate', '18+');
    const vis = h('span.vis');
    const badge = h('span.badge.mono');
    shot.append(rate, vis, badge);
    const ttl = h('div.ttl'), tgs = h('div.tgs');
    function frames() {
      if (kind !== 'video' || draft.source === 'embed') return [];
      if (draft.file) return Array.from({ length: draft.file.numThumbnails || 16 }, (_, i) => thumbUrl.video({ file: draft.file }, i));
      return uploader.state.frames || [];
    }
    // 自定义封面保存后不能移除，只能更换（站点本身也只提供「上传 / 更换」）。所以已带自定义封面的视频：候选帧锁住，只能换图。
    const coverLocked = mode === 'edit' && !!(original && original.customThumbnail);
    const coverNote = h('div.covernote');
    // 自定义封面块：排在候选帧最前面。没传过：虚线框「自定义」；传过：显示那张图，点它选中，右上角 × 丢掉
    const customOk = svc.canCustomThumb || !!draft.customUpload;
    const coverInput = h('input', { type: 'file', accept: coverAccept(), style: { display: 'none' }, onchange: () => { const f = coverInput.files[0]; coverInput.value = ''; if (f) pickCover(f); } });
    const cImg = h('span.cimg'), cBar = h('i.cbar');
    const cRm = !coverLocked && h('span.crm', { role: 'button', title: t('coverRemove'), onclick: (e) => { e.stopPropagation(); if (coverUp) { coverUp.abort(); coverUp = null; } draft.customUpload = draft.customThumbnail = null; changed(); } }, icon('x', 12));
    const cLbl = h('span.clbl', icon('upload', 16), h('span', t('coverCustom')));
    const customBtn = customOk && h('button.custom', { type: 'button', title: t('coverCustomTip'), onclick: () => {
      if (coverUp) return;
      if (draft.customUpload && !draft.customThumbnail) { draft.customThumbnail = draft.customUpload; changed(); } else coverInput.click();
    } }, ...[cImg, cLbl, cBar, cRm, coverInput].filter(Boolean));
    const coverSrc = (f) => (f ? coverLocal.get(f.id) || thumbUrl.video({ customThumbnail: f }) : null);
    function drawCustom() {
      if (!customBtn) return;
      const src = coverUp ? coverUp.url : coverSrc(draft.customUpload);
      cImg.style.backgroundImage = src ? `url(${src})` : '';
      customBtn.className = 'custom' + (src ? ' has' : '') + (draft.customThumbnail ? ' on' : '') + (coverUp ? ' up' : '');
      customBtn.title = draft.customUpload && draft.customThumbnail ? t('coverReplaceTip') : t('coverCustomTip');
      coverNote.textContent = coverLocked ? t('coverLockedNote') : draft.customThumbnail || coverUp ? t('coverCustomNote') : '';
      coverNote.style.display = coverNote.textContent ? '' : 'none';
      cBar.style.transform = `scaleX(${coverUp ? coverUp.progress : 0})`;
    }
    function pickCover(f) {
      if (!f.type.startsWith('image/') || !imageTypeOk(f)) return toast(t('errImgType'), { error: true });
      if (!imageSizeOk(f)) return toast(t('errImgSize'), { error: true });
      if (coverUp) coverUp.abort();
      const me = coverUp = { url: null, progress: 0, abort: () => {} };
      previewDataUrl(f, 960).then((u) => { me.url = u; if (coverUp === me) changed(); else if (u && me.fileId) { coverLocal.set(me.fileId, u); changed(); } });
      const job = svc.uploadImage(f, (p) => { if (coverUp === me) { me.progress = p; drawCustom(); } });
      me.abort = job.abort;
      changed();
      job.promise.then((res) => {
        if (coverUp !== me) return;
        const file = res && res.id && res.name ? res : { id: res.id, type: 'image', name: f.name, mime: f.type, size: f.size };
        me.fileId = file.id;
        if (me.url) coverLocal.set(file.id, me.url);
        coverUp = null;
        draft.customUpload = draft.customThumbnail = file;
        changed();
      }, (e) => {
        if (coverUp !== me) return;
        coverUp = null;
        if (e.status !== -1) toast(t('errUpload') + (env.lang === 'zh' ? '：' : ': ') + e.text, { error: true });
        changed();
      });
    }
    let frameBtns = [], shownPick = null;
    function drawFilm() {
      if (kind !== 'video' || draft.source === 'embed') return;
      drawCustom();
      const pick = draft.customThumbnail ? -1 : draft.thumbnail;
      const next = frames();
      if (film.firstChild && next.length === frameSrc.length && next[0] === frameSrc[0]) frameBtns.forEach((b, i) => b.classList.toggle('on', i === pick));
      else {
        frameSrc = next;
        frameBtns = next.map((src, i) => h('button' + (i === pick ? '.on' : ''), { type: 'button', disabled: coverLocked, title: coverLocked ? t('coverLockedNote') : null, style: { backgroundImage: `url(${src})` }, onclick: () => { draft.thumbnail = i; draft.customThumbnail = null; changed(); } }));
        clear(film).append(...[customBtn, ...(next.length ? frameBtns : Array.from({ length: 6 }, () => h('div.sk')))].filter(Boolean));
        shownPick = null;
      }
      // 选中项变了（含首次渲染）才滚过去，用户自己拖动候选条时不跟着跳
      if (pick === shownPick) return;
      shownPick = pick;
      const on = film.querySelector('.on');
      if (on) requestAnimationFrame(() => { film.scrollLeft = Math.max(0, on.offsetLeft - film.clientWidth / 2 + on.offsetWidth / 2); });
    }
    function cover() {
      if (kind === 'image') { const f = draft.files[0]; return f ? thumbUrl.file(f) : null; }
      if (draft.source === 'embed') { const id = youtubeId(draft.embedUrl); return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null; }
      if (coverUp) return coverUp.url;
      // 预览卡比候选块大，用 large 档（870 宽）；thumbnail 档只有 220×160
      if (draft.customThumbnail) return coverLocal.get(draft.customThumbnail.id) || thumbUrl.file(draft.customThumbnail, 'large');
      return frames()[draft.thumbnail] || null;
    }
    // 分级 / 可见范围
    const ratingSeg = segmented([{ value: 'general', label: t('ratingGeneral'), icon: 'shield' }, { value: 'ecchi', label: t('ratingEcchi'), icon: 'flame' }], draft.rating, (v) => { draft.rating = v; changed(); }, { wide: true });
    const visValue = () => (draft.private ? 'private' : draft.unlisted ? 'unlisted' : 'public');
    const visSeg = kind === 'video' && segmented([{ value: 'public', label: t('vPublic'), icon: 'globe' }, { value: 'unlisted', label: t('vUnlisted'), icon: 'eyeOff' }, { value: 'private', label: t('vPrivate'), icon: 'lock' }], visValue(),
      (v) => { draft.private = v === 'private'; draft.unlisted = v === 'unlisted'; changed(); }, { wide: true });
    const sensChips = sensitive.map((s) => {
      const c = h('button.chip', { type: 'button', data: { tip: s.id }, onclick: () => { const i = draft.tags.findIndex((x) => x.id === s.id); i >= 0 ? draft.tags.splice(i, 1) : draft.tags.push({ id: s.id, type: s.type, sensitive: true }); changed(); } }, tagDict.name(s.id));
      return [s.id, c];
    });
    // 谁能看到：不可点，只用小字 + 图标说明当前设置会让谁看不到
    const notes = h('div.notes');
    let notesKey = '';
    function drawNotes() {
      const sens = draft.tags.filter((x) => x.sensitive).map((x) => tagDict.name(x.id));
      const lines = [];
      if (draft.private) lines.push(['lock', t('reachPrivate')]);
      else {
        lines.push(draft.unlisted ? ['eyeOff', t('reachUnlisted')] : ['globe', t('reachPublic')]);
        if (sens.length) lines.push(['warn', t('reachSensitive', { n: sens.slice(0, 3).join(env.lang === 'zh' ? '、' : ', ') + (sens.length > 3 ? '…' : '') }), true]);
        if (draft.rating === 'ecchi') lines.push(['eyeOff', t('reachEcchi')]);
      }
      const key = JSON.stringify(lines);
      if (key === notesKey) return;
      notesKey = key;
      clear(notes).append(...lines.map(([ic, text, warn]) => h('div.note' + (warn ? '.warn' : ''), icon(ic, 14), h('span', text))));
    }
    // 「N 处填空未填」悬停：按标题 / 简介列出还没填的空
    const slotPanel = () => {
      const groups = [['heading', t('title'), md.slots(draft.title)], ['pencil', t('keepBody'), md.slots(draft.body)]].filter((g) => g[2].length);
      return groups.length ? h('div.slotlist', groups.map(([ic, name, list]) => h('div', h('div.sgh', icon(ic, 13), name), h('div.sgl', list.map((x) => h('span.slot', x)))))) : null;
    };
    // 清单
    const rows = [['file', kind === 'video' && draft.source === 'embed' ? 'checkEmbed' : 'checkFile', 'upload'], ['title', 'checkTitle', 'content'], ['slots', null, 'content'], ['category', 'checkCategory', 'tags'], ['rating', 'rating', null]]
      .map(([key, label, step]) => {
        const small = h('small'); const text = h('span', label ? t(label) : '');
        const row = h('button.chk', { type: 'button', onclick: () => {
          if (!step || !order.includes(step)) return ratingSeg.scrollIntoView({ behavior: 'smooth', block: 'center' });
          go(order.indexOf(step));
          if (key === 'slots') setTimeout(() => stepView.firstSlot && stepView.firstSlot(), 120);
        } }, h('span.st', icon('check', 12)), text, small);
        if (key === 'slots') hoverPanel(row, slotPanel);
        return [key, row, small, text];
      });
    const agree = !svc.isStaff && h('label.agree', { onclick: (e) => { if (e.target.closest('a')) return; e.preventDefault(); draft.agreed = !draft.agreed; changed(); } },
      h('span.box', icon('check', 13)), h('span', t('rules'), ' ', h('a', { href: 'https://www.iwara.tv/rules', target: '_blank', rel: 'noopener', style: { textDecoration: 'underline', textUnderlineOffset: '3px' } }, t('rulesLink'))));

    function draw() {
      const c = checks();
      drawFilm();
      const cv = cover();
      shot.style.backgroundImage = cv ? `url(${cv})` : '';
      rate.style.display = draft.rating === 'ecchi' ? '' : 'none';
      vis.style.display = draft.private || draft.unlisted ? '' : 'none';
      clear(vis).append(icon(draft.private ? 'lock' : 'eyeOff', 14));
      const dur = kind === 'video' ? (draft.file && draft.file.duration) || (uploader.state.meta && uploader.state.meta.duration) : null;
      badge.style.display = dur || kind === 'image' ? '' : 'none';
      badge.textContent = kind === 'image' ? String(draft.files.length) : fmtDuration(dur);
      ttl.textContent = draft.title;
      clear(tgs).append(...draft.tags.slice(0, 6).map((x) => h('span', tagDict.name(x.id))));
      sensChips.forEach(([id, chip]) => chip.classList.toggle('on', draft.tags.some((x) => x.id === id)));
      drawNotes();
      rows.forEach(([key, row, small, text]) => {
        row.className = 'chk ' + (c[key] === 'ok' ? 'ok' : c[key] === 'wait' ? 'wait' : '');
        if (key === 'slots') { row.style.display = c.slots === 'ok' ? 'none' : ''; text.textContent = t('checkSlots', { n: slotCount() }); }
        if (key === 'file' && kind === 'video' && draft.source === 'file') { const s = uploader.state; small.textContent = s.phase === 'uploading' ? Math.round(s.progress * 100) + '%' : s.phase === 'waiting' ? t('queued') : s.phase === 'active' ? t('processing') : ''; }
        if (key === 'rating') row.style.display = c.rating === 'ok' ? 'none' : '';
      });
      if (agree) agree.classList.toggle('on', !!draft.agreed);
    }
    const off = bus.on('change', draw);
    const offUp = bus.on('upload', draw);
    draw();
    const left = h('div',
      kind === 'video' && draft.source !== 'embed' && h('div.set', h('div.label', t('cover')), film, coverNote),
      h('div.set', h('div.label', t('rating')), ratingSeg),
      visSeg && h('div.set', h('div.label', t('visibility')), visSeg),
      sensChips.length > 0 && h('div.set.sens', h('div.label', icon('warn', 14), t('sensitive')), h('div.chips', sensChips.map((x) => x[1]))),
      h('div.set', h('div.label', t('reach')), notes));
    const right = h('div', h('div.pcard', shot, h('div.info', ttl, h('div.by', env.user.name), tgs)), h('div.checks', rows.map((r) => r[1])), agree);
    return { el: h('div.pub', left, right), dispose: () => { off(); offUp(); }, nudge: () => { if (agree && !draft.agreed) { agree.classList.remove('nudge'); void agree.offsetWidth; agree.classList.add('nudge'); } } };
  }

  // ── 底部导航 ──
  const backBtn = btn(t('back'), { kind: 'ghost', icon: 'arrowLeft', onclick: () => go(cur - 1) });
  backBtn.title = t('keyPrevHint');
  const saveTplBtn = btn(t('saveAsTemplate'), { kind: 'ghost', icon: 'bookmark', onclick: () => saveTemplateSheet(draft) });
  const nextLabel = h('span');
  const nextBtn = h('button.btn.primary', { type: 'button', title: t('keyNextHint'), onclick: () => (cur === order.length - 1 ? submit() : leaveContent() && go(cur + 1)) }, nextLabel);
  /** 在内容这一步按下一步：还有没改的填空位就不走，直接带到第一个。 */
  function leaveContent() {
    const n = slotCount();
    if (order[cur] !== 'content' || !n) return true;
    stepView.firstSlot && stepView.firstSlot();
    toast(t('checkSlots', { n }), { error: true });
    return false;
  }
  const navbar = h('div.navbar', backBtn, h('span.sp'), saveTplBtn, nextBtn);
  let busy = false;
  function drawNav() {
    const last = cur === order.length - 1;
    backBtn.style.visibility = cur ? '' : 'hidden';
    saveTplBtn.style.display = last ? '' : 'none';
    const c = checks();
    const left = mode === 'create' ? coolLeft() : 0;
    const ready = Object.values(c).every((v) => v === 'ok') && left <= 0;
    nextBtn.disabled = busy || (last && !ready && !(c.rules !== 'ok' && Object.entries(c).every(([k, v]) => k === 'rules' || v === 'ok') && left <= 0));
    const label = busy ? t(mode === 'edit' ? 'saving' : 'publishing') : !last ? t('next') : left > 0 ? `${t('cooldown')} ${fmtClock(left)}` : c.file === 'wait' ? t(uploader && uploader.state.phase === 'uploading' ? 'uploading' : 'processing') : t(mode === 'edit' ? 'save' : 'publish');
    add(clear(nextBtn), [busy || (last && c.file === 'wait') ? h('span.spin') : null, h('span', label), !last && icon('arrowRight'), last && !busy && ready && h('span.kbd', navigator.platform.includes('Mac') ? '⌘↵' : 'Ctrl ↵')]);
  }
  timers.push(setInterval(() => { if (cooldown.limited && cur === order.length - 1) drawNav(); }, 1000));

  function go(i, force) {
    i = clamp(i, 0, order.length - 1);
    if (i === cur && stepView && !force) return;
    const dir = i >= cur ? 1 : -1;
    cur = i;
    if (stepView && stepView.dispose) stepView.dispose();
    stepView = builders[order[cur]]();
    const old = stage.firstElementChild;
    stage.replaceChildren(stepView.el);
    if (old && !reducedMotion()) stepView.el.animate([{ opacity: 0, transform: `translateX(${dir * 28}px)`, filter: 'blur(6px)' }, { opacity: 1, transform: 'none', filter: 'none' }], { duration: 520, easing: 'cubic-bezier(.22,1,.36,1)' });
    drawStepper();
    drawNav();
    if (old && scrollY > 80) scrollTo({ top: 0 });
  }

  // ── 提交 ──
  async function submit() {
    if (busy) return;
    const c = checks();
    if (c.rules !== 'ok') { stepView.nudge && stepView.nudge(); return; }
    if (!Object.values(c).every((v) => v === 'ok')) return;
    busy = true;
    drawNav();
    try {
      let res;
      const fields = { title: draft.title.trim(), body: draft.body, rating: draft.rating, tags: draft.tags };
      if (mode === 'edit') {
        const payload = { ...original, ...fields };
        if (kind === 'video') Object.assign(payload, { private: draft.private, unlisted: draft.unlisted, thumbnail: draft.thumbnail, customThumbnail: draft.customThumbnail || null });
        else payload.files = draft.files;
        res = await svc.update(kind, editId, payload);
      } else {
        const payload = { ...fields, rulesAgreement: true };
        if (kind === 'video') {
          if (draft.source === 'embed') payload.embedUrl = youtubeUrl(youtubeId(draft.embedUrl)); else { payload.file = draft.file; payload.thumbnail = draft.thumbnail; if (draft.customThumbnail) payload.customThumbnail = draft.customThumbnail; }
          if (draft.private) payload.private = true;
          if (draft.unlisted) payload.unlisted = true;
        } else payload.files = draft.files;
        res = await svc.create(kind, payload);
        tagMemory.bump(draft.tags);
        store.set('last:' + kind, { tags: draft.tags.filter((x) => !x.sensitive), rating: draft.rating, private: draft.private, unlisted: draft.unlisted });
        if (draft.tplId) templates.bump(draft.tplId);
        store.del('draft:' + kind);
      }
      showDone(res);
    } catch (e) {
      busy = false;
      if (e.status === 429) { cooldown = await svc.cooldown(kind); cooldownAt = Date.now(); if (!cooldown.limited) toast(e.text, { error: true }); }
      else {
        const key = Object.keys(e.fields || {})[0];
        toast(e.text || t('errNetwork'), { error: true, ms: 6000 });
        if (key === 'tags') go(order.indexOf('tags')); else if (key === 'title' || key === 'body') go(order.indexOf('content'));
      }
      drawNav();
    }
  }

  function showDone(res) {
    disposed = true;
    timers.forEach(clearInterval);
    const id = res.id || editId;
    const path = `/${kind}/${id}`;
    const status = h('span.pill', { style: { display: 'none' } });
    let stop = false;
    if (mode === 'create' && kind === 'video' && res.status === 'processing') {
      const started = Date.now();
      const clock = h('span.mono');
      status.className = 'pill amber';
      status.style.display = '';
      status.append(h('span.spin', { style: { width: '12px', height: '12px' } }), t('transcoding'), clock);
      const tick = setInterval(() => { clock.textContent = fmtClock((Date.now() - started) / 1000); }, 1000);
      (async () => {
        while (!stop) {
          await sleep(8000);
          const live = await api.call(path).catch(() => null);
          if (live && live.status === 'active') break;
        }
        clearInterval(tick);
        if (stop) return;
        status.className = 'pill green';
        clear(status).append(icon('check', 13), t('live'));
        status.animate([{ transform: 'scale(.8)' }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
      })();
    }
    const tick = h('div.tickc');
    tick.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
    const view = h('div.done', tick, h('h2', t(mode === 'edit' ? 'saved' : 'published')), h('div.ttl', draft.title), status,
      mode === 'edit' && h('span.pill', { style: { display: 'inline-flex' } }, icon('clock', 13), t('staleNote')),
      h('div.acts', btn(t('viewPage'), { kind: 'primary', icon: 'external', onclick: () => openTab(path) }),
        btn(t('saveAsTemplate'), { icon: 'bookmark', onclick: () => saveTemplateSheet(draft) }),
        mode === 'create' && btn(t('another'), { icon: 'plus', onclick: () => app.reload() }),
        btn(t('manage'), { kind: 'ghost', icon: 'layers', onclick: () => app.go(`/account/content/${kind}s`) })));
    host.replaceChildren(h('div.wrap', view));
    cleanup.extra = () => { stop = true; };
  }

  // ── 装配 ──
  const offChange = bus.on('change', () => { drawStepper(); drawNav(); });
  // ── 步骤快捷键 ──
  // 没在输入时：→ 下一步、← 上一步（焦点在按钮、分段、复选框上也算没在输入，但按钮自己的回车不抢）。
  // 任何时候（包括正在输入）：⌘/Ctrl+↵ 下一步，⌘/Ctrl+⇧+↵ 上一步。输入法选词中、弹窗/菜单/浮层开着时都不响应。
  // 下一步走和按钮完全相同的闸门：按钮禁用（发布条件没满足、冷却中）或者内容步还有填空没填，就抖一下按钮并说清卡在哪。
  const typing = (el) => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !/^(checkbox|radio|button|submit|range)$/.test(el.type || ''));
  const overlayOpen = () => !!ui.layer.querySelector('.scrim, .pop.in');
  function blockedReason() {
    if (busy) return null;
    const c = checks(), left = mode === 'create' ? coolLeft() : 0;
    if (left > 0) return `${t('cooldown')} ${fmtClock(left)}`;
    const names = { file: kind === 'video' && draft.source === 'embed' ? t('checkEmbed') : t('checkFile'), title: t('checkTitle'), category: t('checkCategory'), slots: t('checkSlots', { n: slotCount() }), rating: t('rating'), rules: t('checkRules') };
    const miss = Object.entries(c).filter(([, v]) => v !== 'ok').map(([k, v]) => names[k] + (v === 'wait' ? ` (${t('fChecking')})` : ''));
    return miss.length ? t('notReady', { n: miss.join('、') }) : null;
  }
  function shakeNext() { nextBtn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 380, easing: 'ease-out' }); }
  function stepNext() {
    if (busy) return;
    if (nextBtn.disabled) { shakeNext(); const why = blockedReason(); if (why) toast(why, { error: true }); if (stepView && stepView.nudge) stepView.nudge(); return; }
    if (cur < order.length - 1 && order[cur] === 'content' && slotCount()) shakeNext();
    nextBtn.click();
  }
  function stepPrev() { if (!busy && cur > 0) go(cur - 1); }
  // 捕获阶段监听：简介编辑器自己绑了 ⌘↵（ProseMirror 的 exitCode），冒泡阶段根本收不到
  const onKey = (e) => {
    if (disposed || e.isComposing || e.keyCode === 229 || overlayOpen()) return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); e.shiftKey ? stepPrev() : stepNext(); return; }
    if (mod || e.altKey || e.shiftKey) return;
    if (typing(ui.root.activeElement) || typing(document.activeElement)) return; // 影子 DOM 里的输入框，或站点自己的搜索框
    if (e.key === 'ArrowRight') { e.preventDefault(); stepNext(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); stepPrev(); }
  };
  document.addEventListener('keydown', onKey, true);
  const onLeave = (e) => { if (!disposed && ((uploader && uploader.busy) || (images && images.busy) || (mode === 'edit' && dirty()))) { e.preventDefault(); e.returnValue = ''; } };
  addEventListener('beforeunload', onLeave);
  if (mode === 'create') svc.cooldown(kind).then((c) => { cooldown = c; cooldownAt = Date.now(); drawNav(); });

  host.replaceChildren(h('div.wrap', header, stepper, stage, navbar));
  go(0, true);

  function cleanup() {
    disposed = true;
    timers.forEach(clearInterval);
    offChange();
    document.removeEventListener('keydown', onKey, true);
    removeEventListener('beforeunload', onLeave);
    if (stepView && stepView.dispose) stepView.dispose();
    if (uploader && uploader.busy) uploader.reset();
    cleanup.extra && cleanup.extra();
  }
  cleanup.applyTemplate = applyTemplate;
  return cleanup;
}

// ── 80-manage.js ────────────────────────────────────────────────
// 内容管理：把表格换成带封面的卡片墙，带搜索、排序和合计。

STYLE.push(`
.wrap.wide{max-width:1180px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}
.stat{padding:16px 18px;border-radius:14px;border:1px solid var(--line);background:var(--card)}
.stat .v{font-size:28px;font-weight:600;letter-spacing:-.04em;line-height:1.2;overflow:hidden}
.stat .k{display:flex;align-items:center;gap:6px;color:var(--fg2);font-size:12.5px;font-weight:500}
.tools{display:flex;gap:10px;align-items:center;margin-bottom:16px}
.tools .field{height:36px;width:260px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}
.work2{position:relative;border-radius:14px;border:1px solid var(--line);background:var(--card);overflow:hidden;animation:rise .5s var(--ease) backwards;transition:transform .4s var(--ease),box-shadow .25s,border-color .2s,opacity .25s}
.work2:hover{transform:translateY(-3px);box-shadow:var(--shadow);border-color:var(--line2)}
.work2.gone{opacity:0;transform:scale(.9)}
.work2 .shot{position:relative;display:block;aspect-ratio:16/9;background:var(--sunk) center/cover}
.work2 .shot .ph{position:absolute;inset:0;display:grid;place-items:center;color:var(--fg3)}
.work2 .flags{position:absolute;left:8px;top:8px;display:flex;gap:4px}
.work2 .flag{display:grid;place-items:center;height:22px;min-width:22px;padding:0 6px;border-radius:6px;background:rgba(0,0,0,.66);color:#fff;font-size:11px;font-weight:700;backdrop-filter:blur(6px)}
.work2 .flag.r{background:var(--red)}
.work2 .dur{position:absolute;right:8px;bottom:8px;padding:1px 6px;border-radius:5px;background:rgba(0,0,0,.72);color:#fff;font-size:11px;font-weight:600}
.work2 .acts{position:absolute;right:8px;top:8px;display:flex;gap:4px;opacity:0;transform:translateY(-4px);transition:opacity .2s,transform .35s var(--ease)}
.work2:hover .acts,.work2 .acts:focus-within{opacity:1;transform:none}
.work2 .acts button{display:inline-flex;align-items:center;gap:5px;height:28px;min-width:28px;justify-content:center;padding:0 6px;border-radius:8px;border:0;background:rgba(0,0,0,.66);color:#fff;cursor:pointer;backdrop-filter:blur(6px);font-size:12px;font-weight:600;transition:background .15s,transform .2s var(--ease)}
.work2 .acts button:hover{background:rgba(0,0,0,.85)}
.work2 .acts button:active{transform:scale(.9)}
.work2 .acts button.sure{background:var(--red);padding:0 9px}
.work2 .info{padding:12px 14px}
.work2 .ttl{font-weight:600;font-size:14px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:39px;text-decoration:none;color:inherit}
.work2 .nums{display:flex;align-items:center;gap:12px;margin-top:10px;color:var(--fg2);font-size:12.5px}
.work2 .nums span{display:inline-flex;align-items:center;gap:4px}
.work2 .nums .when{margin-left:auto;color:var(--fg3)}
.empty{display:flex;flex-direction:column;align-items:center;gap:16px;padding:80px 0;color:var(--fg3)}
.sk2{border-radius:14px;aspect-ratio:1.18;background:linear-gradient(100deg,var(--sunk) 40%,var(--line) 50%,var(--sunk) 60%) 0/300% 100%;animation:shimmer 1.4s infinite linear}
`);

async function mountManage(host, { kind, app }) {
  let items = [], count = 0, page = 0, sort = store.get('manageSort', 'new'), query = '', disposed = false;
  const grid = h('div.grid', Array.from({ length: 8 }, () => h('div.sk2')));
  const statEls = { works: h('div.v', '–'), views: h('div.v', '–'), likes: h('div.v', '–') };
  const moreBox = h('div', { style: { display: 'flex', justifyContent: 'center', marginTop: '24px' } });
  const cool = h('span.pill.amber', { style: { display: 'none' }, data: { tip: t('cooldown') } }, icon('clock', 13), h('span.mono'));

  const SORTS = { new: ['sortNew', (a, b) => new Date(b.createdAt) - new Date(a.createdAt)], views: ['sortViews', (a, b) => b.numViews - a.numViews], likes: ['sortLikes', (a, b) => b.numLikes - a.numLikes] };
  const sortLabel = h('span', t(SORTS[sort][0]));
  const sortBtn = h('button.btn.sm', { type: 'button', onclick: () => menu(sortBtn, Object.keys(SORTS).map((k) => ({ label: t(SORTS[k][0]), icon: k === sort ? 'check' : null, onclick: () => { sort = k; store.set('manageSort', k); sortLabel.textContent = t(SORTS[k][0]); draw(); } }))) }, sortLabel, icon('chevronDown', 14));
  const search = h('input', { placeholder: t('searchWorks'), oninput: () => { query = search.value.trim().toLowerCase(); draw(); } });

  function card(it, i) {
    const src = kind === 'video' ? thumbUrl.video(it) : thumbUrl.file(it.thumbnail);
    const path = `/${kind}/${it.id}`;
    const del = h('button', { type: 'button', data: { tip: t('delete') }, onclick: async () => {
      if (!del.classList.contains('sure')) { del.classList.add('sure'); del.append(h('span', t('confirmDelete'))); delete del.dataset.tip; setTimeout(() => { del.classList.remove('sure'); del.lastChild.nodeType === 1 && del.querySelector('span') && del.querySelector('span').remove(); }, 3500); return; }
      el.classList.add('gone');
      try { await svc.remove(kind, it.id); items = items.filter((x) => x !== it); count--; setTimeout(() => { el.remove(); drawStats(); if (!items.length) draw(); }, 260); toast(t('deleted')); refreshCooldown(); }
      catch (e) { el.classList.remove('gone'); toast(e.text || e.message, { error: true }); }
    } }, icon('trash', 14));
    const el = h('div.work2', { style: { animationDelay: Math.min(i, 12) * 30 + 'ms' } },
      h('a.shot', { href: path, target: '_blank', rel: 'noopener', style: src ? { backgroundImage: `url(${src})` } : null },
        !src && h('div.ph', icon(kind === 'video' ? 'film' : 'picture', 28)),
        h('div.flags', it.rating === 'ecchi' && h('span.flag.r', '18+'), it.private && h('span.flag', { data: { tip: t('vPrivate') } }, icon('lock', 13)), it.unlisted && h('span.flag', { data: { tip: t('vUnlisted') } }, icon('eyeOff', 13)), it.status === 'processing' && h('span.flag', h('span.spin', { style: { width: '11px', height: '11px' } }))),
        kind === 'video' ? it.file && it.file.duration && h('span.dur.mono', fmtDuration(it.file.duration)) : it.numImages && h('span.dur.mono', String(it.numImages))),
      h('div.acts', h('button', { type: 'button', data: { tip: t('edit') }, onclick: () => app.go(`${path}/edit`) }, icon('pencil', 14)), del),
      h('div.info', h('a.ttl', { href: path, target: '_blank', rel: 'noopener' }, it.title),
        h('div.nums', h('span', { data: { tip: t('views') } }, icon('eye', 14), fmtCount(it.numViews)), h('span', { data: { tip: t('likes') } }, icon('heart', 14), fmtCount(it.numLikes)), h('span', { data: { tip: t('comments') } }, icon('chat', 14), fmtCount(it.numComments)), h('span.when', fmtDate(it.createdAt)))));
    return el;
  }
  function drawStats() {
    ticker(statEls.works, String(count));
    ticker(statEls.views, fmtCount(items.reduce((s, x) => s + (x.numViews || 0), 0)) + (items.length < count ? '+' : ''));
    ticker(statEls.likes, fmtCount(items.reduce((s, x) => s + (x.numLikes || 0), 0)) + (items.length < count ? '+' : ''));
  }
  function draw() {
    const list = items.filter((x) => !query || (x.title || '').toLowerCase().includes(query)).sort(SORTS[sort][1]);
    clear(grid);
    if (!list.length) {
      grid.style.display = 'block';
      grid.append(h('div.empty', icon(kind === 'video' ? 'film' : 'picture', 36), h('span', t(query ? 'noResult' : 'empty')), !query && btn(t(kind === 'video' ? 'publishVideo' : 'publishImage'), { kind: 'primary', icon: 'plus', onclick: () => app.go(`/create/${kind}`) })));
    } else { grid.style.display = ''; grid.append(...list.map(card)); }
    drawStats();
    clear(moreBox);
    if (items.length < count) moreBox.append(btn(`${items.length} / ${count}`, { icon: 'chevronDown', onclick: () => load(page + 1) }));
  }
  async function load(p) {
    try {
      const res = await svc.myContent(kind, p);
      if (disposed) return;
      page = p;
      count = res.count;
      items = p ? items.concat(res.results) : res.results;
      draw();
    } catch (e) { if (!disposed) clear(grid).append(h('div.empty', icon('warn', 28), e.text || e.message, btn(t('retry'), { onclick: () => load(p) }))); }
  }
  let coolTimer = null;
  async function refreshCooldown() {
    const c = await svc.cooldown(kind);
    if (disposed) return;
    const at = Date.now();
    clearInterval(coolTimer);
    const tick = () => { const left = c.limited ? c.remaining - (Date.now() - at) / 1000 : 0; cool.style.display = left > 0 ? '' : 'none'; cool.lastChild.textContent = fmtClock(left); };
    tick();
    coolTimer = setInterval(tick, 1000);
  }

  const moreBtn = ibtn('more', '', () => app.menu(moreBtn));
  const seg = segmented([{ value: 'video', label: t('video'), icon: 'film' }, { value: 'image', label: t('image'), icon: 'picture' }], kind, (v) => app.go(`/account/content/${v}s`));
  host.replaceChildren(h('div.wrap.wide',
    h('div.top', h('h1', t('manage')), seg, btn(t('posts'), { kind: 'ghost', sm: true, onclick: () => app.go('/account/content/posts') }), btn(t('polls'), { kind: 'ghost', sm: true, onclick: () => app.go('/account/content/polls') }), h('span.sp'), cool,
      btn(t(kind === 'video' ? 'publishVideo' : 'publishImage'), { kind: 'primary', icon: 'plus', onclick: () => app.go(`/create/${kind}`) }), moreBtn),
    h('div.stats.stagger', h('div.stat', h('div.k', icon('layers', 14), t('works')), statEls.works), h('div.stat', h('div.k', icon('eye', 14), t('views')), statEls.views), h('div.stat', h('div.k', icon('heart', 14), t('likes')), statEls.likes)),
    h('div.tools', h('div.field', icon('search'), search), h('span.grow'), sortBtn),
    grid, moreBox));
  load(0);
  refreshCooldown();
  return () => { disposed = true; clearInterval(coolTimer); };
}

// ── 85-tour.js ──────────────────────────────────────────────────
// 首次引导：三张会动的示意，不靠文字解释。

STYLE.push(`
.tour{width:min(520px,100%)}
.tour .body{padding:0!important}
.tslides{position:relative;height:250px;overflow:hidden;background:var(--sunk);border-bottom:1px solid var(--line);border-radius:16px 16px 0 0}
.tslide{position:absolute;inset:0;display:grid;place-items:center;opacity:0;transform:translateX(40px) scale(.96);transition:opacity .35s,transform .6s var(--ease);pointer-events:none}
.tslide.cur{opacity:1;transform:none}
.tslide.prev{transform:translateX(-40px) scale(.96)}
.tcap{padding:22px 24px 4px;font-size:19px;font-weight:600;letter-spacing:-.03em;text-align:center;min-height:54px}
.tfoot{display:flex;align-items:center;gap:8px;padding:14px 20px 20px}
.tdots{display:flex;gap:6px;flex:1}
.tdots i{width:6px;height:6px;border-radius:3px;background:var(--line2);transition:width .4s var(--ease),background .3s}
.tdots i.cur{width:20px;background:var(--fg)}
.d-steps{display:flex;align-items:center;gap:0;width:340px}
.d-steps b{width:38px;height:38px;border-radius:50%;border:1.5px solid var(--line2);background:var(--card);display:grid;place-items:center;font-size:14px;animation:dstep 4s infinite}
.d-steps b:nth-of-type(2){animation-delay:.7s}.d-steps b:nth-of-type(3){animation-delay:1.4s}.d-steps b:nth-of-type(4){animation-delay:2.1s}
.d-steps u{flex:1;height:2px;background:var(--line2);position:relative;overflow:hidden}
.d-steps u::after{content:"";position:absolute;inset:0;background:var(--fg);transform:scaleX(0);transform-origin:left;animation:dline 4s infinite}
.d-steps u:nth-of-type(2)::after{animation-delay:.7s}.d-steps u:nth-of-type(3)::after{animation-delay:1.4s}
@keyframes dstep{0%,6%{background:var(--card);color:var(--fg);border-color:var(--line2);transform:none}12%{transform:scale(1.18)}18%,82%{background:var(--fg);color:var(--inv);border-color:var(--fg);transform:none}92%,100%{background:var(--card);color:var(--fg);border-color:var(--line2)}}
@keyframes dline{0%,16%{transform:scaleX(0)}32%,82%{transform:scaleX(1)}92%,100%{transform:scaleX(0)}}
.d-tags{width:300px}
.d-tags .f{display:flex;align-items:center;gap:8px;height:42px;padding:0 12px;border-radius:10px;border:1px solid var(--line2);background:var(--card);font-size:15px}
.d-tags .f span{overflow:hidden;white-space:nowrap;width:0;animation:dtype 4.5s steps(4) infinite}
.d-tags .f i{width:1.5px;height:18px;background:var(--fg);animation:blink 1s steps(2) infinite}
@keyframes dtype{0%,8%{width:0}30%,88%{width:4em}96%,100%{width:0}}
@keyframes blink{50%{opacity:0}}
.d-tags .o{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap}
.d-tags .o em{font-style:normal;height:30px;padding:0 12px;border-radius:999px;background:var(--fg);color:var(--inv);display:inline-flex;align-items:center;font-size:13px;font-weight:500;opacity:0;animation:dchip 4.5s infinite}
.d-tags .o em:nth-child(2){animation-delay:.25s;background:none;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line2)}
.d-tags .o em:nth-child(3){animation-delay:.4s;background:none;color:var(--fg);box-shadow:inset 0 0 0 1px var(--line2)}
@keyframes dchip{0%,34%{opacity:0;transform:scale(.6)}42%,86%{opacity:1;transform:none}94%,100%{opacity:0}}
.d-tpl{font-size:20px;font-weight:600;letter-spacing:-.02em;display:flex;align-items:center;gap:4px;white-space:nowrap}
.d-tpl .s{position:relative;display:inline-grid;height:34px;padding:0 10px;border-radius:8px;place-items:center;border:1px dashed color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent);animation:dslot 5s infinite}
.d-tpl .s span{grid-area:1/1;animation:dswap 5s infinite}
.d-tpl .s span:first-child{color:var(--violet);font-size:14px}
.d-tpl .s span:last-child{animation-name:dswap2}
.d-tpl .s:nth-of-type(2),.d-tpl .s:nth-of-type(2) span{animation-delay:.5s}
@keyframes dslot{0%,30%{border-color:color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent)}40%,88%{border-color:transparent;background:transparent}96%,100%{border-color:color-mix(in srgb,var(--violet) 60%,transparent)}}
@keyframes dswap{0%,30%{opacity:1;transform:none}38%,90%{opacity:0;transform:translateY(-8px)}98%,100%{opacity:1;transform:none}}
@keyframes dswap2{0%,32%{opacity:0;transform:translateY(8px)}42%,88%{opacity:1;transform:none}96%,100%{opacity:0}}
`);

/** 三张示意动画本体（首次引导和帮助弹窗共用）。 */
function tourDemos() {
  const zh = env.lang === 'zh';
  return [
    h('div.d-steps', h('b', icon('upload', 16)), h('u'), h('b', icon('pencil', 16)), h('u'), h('b', icon('tag', 16)), h('u'), h('b', icon('check', 16))),
    h('div.d-tags', h('div.f', icon('search'), h('span', zh ? '初音未来' : 'miku'), h('i')), h('div.o', h('em', zh ? '初音未来' : 'Hatsune Miku'), h('em', zh ? '舞蹈' : 'Dance'), h('em', 'MikuMikuDance'))),
    h('div.d-tpl', '【MMD】', h('span.s', h('span', zh ? '角色' : 'Who'), h('span', zh ? '初音未来' : 'Miku')), ' - ', h('span.s', h('span', zh ? '曲名' : 'Song'), h('span', 'Gimme×Gimme'))),
  ];
}

function showTour({ onTry } = {}) {
  const slides = tourDemos().map((d) => h('div.tslide', d));
  const caps = ['tour1', 'tour2', 'tour3'];
  let i = 0;
  const cap = h('div.tcap');
  const dots = h('div.tdots', slides.map(() => h('i')));
  const foot = h('div.tfoot', dots);
  const scrim = h('div.scrim');
  const close = () => { store.set('tourDone', VERSION); unlockScroll(); scrim.classList.remove('in'); setTimeout(() => scrim.remove(), 240); document.removeEventListener('keydown', onKey, true); };
  const show = (n) => {
    i = clamp(n, 0, slides.length - 1);
    slides.forEach((s, j) => { s.className = 'tslide' + (j === i ? ' cur' : j < i ? ' prev' : ''); });
    [...dots.children].forEach((d, j) => d.classList.toggle('cur', j === i));
    cap.textContent = t(caps[i]);
    cap.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    const last = i === slides.length - 1;
    add(clear(foot), [dots, !last && btn(t('tourSkip'), { kind: 'ghost', onclick: close }), last && onTry && btn(t('tourTry'), { icon: 'sparkle', onclick: () => { close(); onTry(); } }),
      btn(t(last ? 'tourStart' : 'next'), { kind: 'primary', iconRight: last ? null : 'arrowRight', onclick: () => (last ? close() : show(i + 1)) })]);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); i === slides.length - 1 ? close() : show(i + 1); } else if (e.key === 'ArrowLeft') show(i - 1); };
  document.addEventListener('keydown', onKey, true);
  scrim.append(h('div.sheet.tour', h('div.tslides', slides), cap, foot));
  ui.layer.append(scrim);
  lockScroll();
  requestAnimationFrame(() => { scrim.classList.add('in'); show(0); });
}

// ── 86-slotguide.js ─────────────────────────────────────────────
// 填空指引：第一次进「内容」这一步时弹出，四幕会动的演示（假鼠标、假输入框、假输入法候选条、按键提示），
// 讲清楚 填空是什么 → 怎么做一个 → 怎么填 → 多个之间怎么切。每一幕循环播放，可以重播、前后翻。
// 演示全是 DOM + CSS 过渡，脚本按时间线一步步改 DOM；切走或关掉时用令牌作废还在跑的那一轮。

STYLE.push(`
.g-stage{position:relative;height:300px;overflow:hidden;background:var(--sunk);border-bottom:1px solid var(--line);border-radius:16px 16px 0 0}
.g-scene{position:absolute;inset:0;padding:30px 40px;opacity:0;transform:translateX(36px);transition:opacity .35s,transform .6s var(--ease);pointer-events:none;user-select:none}
.g-scene.cur{opacity:1;transform:none}
.g-scene.prev{transform:translateX(-36px)}
.g-lbl{display:flex;align-items:center;gap:6px;margin:0 0 6px;font-size:12px;font-weight:500;color:var(--fg3)}
.g-field{position:relative;display:flex;align-items:center;height:46px;padding:0 14px;border-radius:10px;border:1px solid var(--line2);background:var(--card);font-size:17px;font-weight:500;white-space:pre;transition:border-color .2s,box-shadow .2s}
.g-field.focus{border-color:var(--fg);box-shadow:0 0 0 3px color-mix(in srgb,var(--fg) 9%,transparent)}
.g-field.g-body{height:auto;min-height:58px;align-items:flex-start;padding:12px 14px;font-size:14px;font-weight:400}
.g-ch{border-radius:2px;transition:background .06s}
.g-ch.sel{background:color-mix(in srgb,var(--blue) 26%,transparent)}
.g-slot{display:inline-block;position:relative;padding:0 5px;margin:0 2px;border-radius:6px;line-height:1.5;outline:1px dashed color-mix(in srgb,var(--violet) 60%,transparent);background:color-mix(in srgb,var(--violet) 10%,transparent);color:var(--violet);transition:outline-color .25s,background .25s,color .25s,padding .25s,margin .25s}
.g-slot.g-new{animation:gpop .55s var(--spring)}
.g-slot.glow{animation:gglow .9s ease}
.g-slot.act{outline:1.5px solid var(--amber);background:color-mix(in srgb,var(--amber) 16%,transparent);color:var(--fg)}
.g-slot.fin{outline-color:transparent;background:transparent;color:var(--fg);padding:0;margin:0}
.g-slot.fin.flash{animation:gflash .7s ease}
@keyframes gpop{0%{transform:scale(.3);opacity:0}100%{transform:none;opacity:1}}
@keyframes gglow{40%{box-shadow:0 0 0 5px color-mix(in srgb,var(--violet) 22%,transparent)}}
@keyframes gflash{0%{background:color-mix(in srgb,var(--green) 26%,transparent)}100%{background:transparent}}
.g-caret{display:inline-block;width:1.5px;height:1.1em;margin:0 -.75px;background:var(--fg);vertical-align:-.15em;animation:blink 1s steps(2) infinite}
.g-comp{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:4px;color:var(--fg)}
.g-ime{position:absolute;z-index:4;display:flex;align-items:center;gap:2px;padding:4px;border-radius:10px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);font-size:14px;font-weight:400;white-space:nowrap;opacity:0;transform:translateY(-4px) scale(.96);transform-origin:left top;transition:opacity .12s,transform .25s var(--ease)}
.g-ime.in{opacity:1;transform:none}
.g-ime span{padding:3px 9px;border-radius:7px;color:var(--fg)}
.g-ime span small{margin-right:5px;font-size:11px;opacity:.5}
.g-ime span.cur{background:var(--blue);color:#fff}
.g-ime span.cur small{opacity:.8}
.g-ime i{width:1px;height:16px;margin:0 4px;background:var(--line2)}
.g-ime em{font-style:normal;font-size:11px;color:var(--fg3);padding:0 6px 0 2px}
.g-pop{position:absolute;z-index:3;display:flex;align-items:center;gap:6px;height:34px;padding:0 10px;border-radius:10px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);font-size:13px;font-weight:500;white-space:nowrap;opacity:0;transform:translateY(5px) scale(.9);transform-origin:center bottom;transition:opacity .15s,transform .38s var(--spring),width .3s var(--ease)}
.g-pop.in{opacity:1;transform:none}
.g-pop.out{opacity:0;transform:scale(.9);transition-duration:.15s}
.g-pop .g-k{padding:1px 5px;border-radius:4px;background:var(--sunk);border:1px solid var(--line);font:600 10.5px "Geist Mono",ui-monospace,monospace;color:var(--fg3)}
.g-pop .in-box{display:flex;align-items:center;gap:6px;min-width:150px;height:26px;padding:0 8px;border-radius:7px;border:1px solid var(--fg);font-weight:400}
.g-pop .in-box .g-ph{color:var(--fg3)}
.g-tip{position:absolute;z-index:3;padding:3px 8px;border-radius:6px;background:var(--amber);color:#fff;font-size:12px;font-weight:600;white-space:nowrap;opacity:0;transform:translateY(4px) scale(.9);transition:opacity .14s,transform .3s var(--spring)}
.g-tip::after{content:"";position:absolute;left:50%;bottom:-4px;width:8px;height:8px;margin-left:-4px;background:inherit;transform:rotate(45deg);border-radius:1px}
.g-tip.in{opacity:1;transform:none}
.g-cur{position:absolute;left:0;top:0;z-index:8;width:22px;height:22px;pointer-events:none;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35));opacity:0;transition:opacity .3s}
.g-cur.on{opacity:1}
.g-cur svg{display:block;transform-origin:4px 3px;transition:transform .12s}
.g-cur.down svg{transform:scale(.84)}
.g-rip{position:absolute;z-index:7;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:color-mix(in srgb,var(--blue) 30%,transparent);pointer-events:none;animation:grip .55s ease-out forwards}
@keyframes grip{from{transform:scale(.15);opacity:1}to{transform:scale(1.3);opacity:0}}
.g-keys{position:absolute;right:16px;bottom:14px;z-index:8;display:flex;gap:6px}
.g-kbd{display:inline-grid;place-items:center;min-width:36px;height:30px;padding:0 10px;border-radius:7px;background:var(--card);border:1px solid var(--line2);box-shadow:0 2px 0 var(--line2);font:600 12px "Geist Mono",ui-monospace,monospace;color:var(--fg);animation:gkey 1s var(--ease) forwards}
@keyframes gkey{0%{opacity:0;transform:translateY(10px)}14%{opacity:1;transform:none;box-shadow:0 2px 0 var(--line2)}28%{transform:translateY(2px);box-shadow:0 0 0 var(--line2);background:var(--sunk)}44%{transform:none;box-shadow:0 2px 0 var(--line2);background:var(--card)}80%{opacity:1}100%{opacity:0;transform:translateY(-4px)}}
.g-pill{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:600;background:color-mix(in srgb,var(--amber) 14%,transparent);color:var(--amber);transition:background .3s,color .3s,opacity .3s,transform .4s var(--spring)}
.g-pill.ok{background:color-mix(in srgb,var(--green) 14%,transparent);color:var(--green)}
.g-pill.hide{opacity:0;transform:scale(.8)}
.g-pill.bump{animation:gbump .35s var(--spring)}
@keyframes gbump{50%{transform:scale(1.12)}}
.g-btn{display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border-radius:8px;background:var(--fg);color:var(--inv);font-size:13px;font-weight:500;opacity:.3;transition:opacity .35s,transform .4s var(--spring)}
.g-btn.on{opacity:1}
.g-btn.press{transform:scale(.95)}
.g-tpl{flex:none;white-space:nowrap;display:inline-flex;flex-direction:column;gap:7px;padding:12px 14px;border:1px solid var(--line);border-radius:12px;background:var(--card);box-shadow:0 1px 2px rgba(0,0,0,.04);font-size:13px;transition:transform .3s var(--spring),box-shadow .2s}
.g-tpl.press{transform:scale(.96)}
.g-tpl b{display:flex;align-items:center;gap:6px;font-weight:600}
.g-tpl .g-slot{font-size:12px}
.g-row{display:flex;align-items:center;gap:12px}
.g-arrow{color:var(--fg3);opacity:0;transform:translateX(-6px);transition:opacity .3s,transform .4s var(--ease)}
.g-arrow.in{opacity:1;transform:none}
.g-txt{padding:20px 26px 2px;min-height:146px}
.g-txt b{display:block;font-size:18px;font-weight:600;letter-spacing:-.02em}
.g-txt p{margin:6px 0 0;color:var(--fg2);font-size:13.5px;line-height:1.7}
.g-legend{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px;font-size:12px;color:var(--fg3)}
.g-legend span{display:inline-flex;align-items:center;gap:5px}
.g-legend kbd{display:inline-grid;place-items:center;min-width:22px;height:20px;padding:0 5px;border-radius:5px;border:1px solid var(--line2);box-shadow:0 1px 0 var(--line2);background:var(--card);font:600 10.5px "Geist Mono",ui-monospace,monospace;color:var(--fg2)}
.g-replay{position:absolute;left:12px;bottom:10px;z-index:9}
`);

/** 演示里那只鼠标的箭头。 */
function guideArrow() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 22 22');
  svg.setAttribute('width', '22');
  svg.setAttribute('height', '22');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', 'M4 3 L4 18 L8 14.2 L10.8 20 L13.4 18.8 L10.7 13.2 L16 13.2 Z');
  p.setAttribute('fill', '#111');
  p.setAttribute('stroke', '#fff');
  p.setAttribute('stroke-width', '1.4');
  p.setAttribute('stroke-linejoin', 'round');
  svg.append(p);
  return svg;
}

/** 填空指引的四页：{ pages: [{ title, text, legend, play(root, kit) }], kit(root, alive), STOP }。播放器在帮助弹窗里（87-help.js）。 */
function slotGuidePages() {
  const zh = env.lang === 'zh';
  const STOP = {};
  let token = 0;

  // ── 每一幕的舞台工具：坐标、鼠标、按键、打字、输入法 ──
  function kit(root, alive) {
    const w = async (ms) => { await sleep(ms); if (!alive()) throw STOP; };
    const scale = () => { const r = root.getBoundingClientRect(); return r.width / (root.offsetWidth || 1) || 1; };
    /** el 相对这一幕的矩形（不受弹层缩放动画影响）。 */
    const box = (el) => {
      const s = root.getBoundingClientRect(), r = el.getBoundingClientRect(), k = scale();
      return { x: (r.left - s.left) / k, y: (r.top - s.top) / k, w: r.width / k, h: r.height / k };
    };
    const cur = h('div.g-cur', guideArrow());
    const keys = h('div.g-keys');
    root.append(cur, keys);
    let cx = 0, cy = 0;
    const place = (x, y) => { cx = x; cy = y; cur.style.transform = `translate(${x - 4}px,${y - 3}px)`; };
    const api = {
      w, box,
      show(x, y) { cur.style.transition = 'none'; place(x, y); void cur.offsetWidth; cur.classList.add('on'); },
      hideCursor() { cur.classList.remove('on'); },
      async move(x, y, ms = 650) {
        cur.style.transition = `transform ${ms}ms cubic-bezier(.45,.05,.25,1),opacity .3s`;
        place(x, y);
        await w(ms + 40);
      },
      moveTo(el, fx = 0.5, fy = 0.55, ms) { const b = box(el); return api.move(b.x + b.w * fx, b.y + b.h * fy, ms); },
      async click() {
        cur.classList.add('down');
        root.append(h('div.g-rip', { style: { left: cx + 'px', top: cy + 'px' } }));
        await w(130);
        cur.classList.remove('down');
        setTimeout(() => root.querySelectorAll('.g-rip').forEach((r) => r.remove()), 600);
        await w(120);
      },
      async key(label, hold = 260) { keys.append(h('span.g-kbd', label)); setTimeout(() => keys.firstChild && keys.firstChild.remove(), 1000); await w(hold); },
      caret: () => h('span.g-caret'),
      /** 一个字一个字往 node 里打（直接上屏的文字，比如英文、数字）。 */
      async type(node, text, speed = 75) { for (const ch of text) { node.textContent += ch; await w(speed + Math.random() * 40); } },
      /**
       * 中文输入法：在 host 里 before 节点前面出一段带下划线的拼音，下方出候选条；
       * plan = [[拼音前缀, [候选…]], …]，按空格上屏第一个候选。返回上屏的字。
       */
      async ime(host, before, pinyin, plan, field) {
        const comp = h('span.g-comp');
        host.insertBefore(comp, before);
        const bar = h('div.g-ime');
        root.append(bar);
        const draw = (cands) => {
          clear(bar).append(...cands.map((c, i) => h('span' + (i === 0 ? '.cur' : ''), h('small', String(i + 1)), c)), h('i'), h('em', '‹ ›'));
          const b = box(comp), fb = box(field || host);
          bar.style.left = Math.min(b.x, root.offsetWidth - bar.offsetWidth - 10) + 'px';
          bar.style.top = fb.y + fb.h + 6 + 'px';
        };
        let cands = [];
        for (let i = 1; i <= pinyin.length; i++) {
          comp.textContent = pinyin.slice(0, i);
          const hit = plan.filter(([p]) => pinyin.slice(0, i).startsWith(p)).pop();
          if (hit && hit[1] !== cands) { cands = hit[1]; draw(cands); }
          if (i === 1) requestAnimationFrame(() => bar.classList.add('in'));
          await w(95 + Math.random() * 50);
        }
        await w(380);
        await api.key(zh ? '空格' : 'Space', 160);
        const out = cands[0];
        comp.replaceWith(document.createTextNode(out));
        bar.classList.remove('in');
        setTimeout(() => bar.remove(), 200);
        await w(260);
        return out;
      },
      /** 在 slot 上方挂橙色提示。 */
      tip(slotEl, label) {
        const tip = h('div.g-tip', label);
        root.append(tip);
        const follow = () => { const b = box(slotEl); tip.style.left = b.x + b.w / 2 - tip.offsetWidth / 2 + 'px'; tip.style.top = b.y - tip.offsetHeight - 8 + 'px'; };
        follow();
        requestAnimationFrame(() => tip.classList.add('in'));
        return { follow, hide() { tip.classList.remove('in'); setTimeout(() => tip.remove(), 200); } };
      },
    };
    return api;
  }
  const slot = (name, extra = '') => h('span.g-slot' + extra, name);
  const chars = (str) => [...str].map((c) => h('span.g-ch', c));

  // 演示内容
  const D = zh
    ? { tplName: 'MMD 舞蹈', a: '角色', b: '曲名', c: '模型作者', who: '初音ミク', song: 'Gimme×Gimme', who2: '初音未来', author: '某某P', model: '模型：',
      editLbl: '编辑模板 · 标题格式', pubLbl: '发布 · 标题', bodyLbl: '简介', apply: '套用模板', left: (n) => `${n} 处填空未填`, allOk: '填空都已填好', next: '下一步', maker: '设为填空', namePh: '填空名' }
    : { tplName: 'MMD dance', a: 'Character', b: 'Song', c: 'Model by', who: 'Miku', song: 'Gimme×Gimme', who2: 'Hatsune Miku', author: 'SomeoneP', model: 'Model: ',
      editLbl: 'Edit template · Title pattern', pubLbl: 'Publish · Title', bodyLbl: 'Description', apply: 'Use template', left: (n) => `${n} blanks left`, allOk: 'All blanks filled', next: 'Next', maker: t('makeSlot'), namePh: t('slotName') };

  const scenes = [
    // ① 填空是什么：套用模板 → 标题里留下两个空位
    async (root, k) => {
      const card = h('div.g-tpl', h('b', icon('bookmark', 14), D.tplName), h('div', '【MMD】', slot(D.a), ' - ', slot(D.b)));
      const arrow = h('span.g-arrow', icon('arrowRight', 20));
      const field = h('div.g-field', { style: { flex: '1' } });
      const pill = h('span.g-pill.hide', icon('warn', 12), D.left(2));
      root.append(h('div.g-row', { style: { marginTop: '18px' } }, card, arrow, h('div', { style: { flex: 1, minWidth: 0 } }, h('div.g-lbl', D.pubLbl, h('span', { style: { flex: 1 } }), pill), field)));
      await k.w(300);
      k.show(root.offsetWidth - 40, root.offsetHeight - 30);
      await k.moveTo(card, 0.5, 0.45, 800);
      card.classList.add('press'); await k.click(); card.classList.remove('press');
      arrow.classList.add('in');
      await k.w(250);
      field.classList.add('focus');
      field.append(document.createTextNode('【MMD】'));
      await k.w(160);
      const s1 = slot(D.a, '.g-new'); field.append(s1);
      await k.w(140);
      field.append(document.createTextNode(' - '));
      const s2 = slot(D.b, '.g-new'); field.append(s2);
      await k.w(450);
      pill.classList.remove('hide');
      k.hideCursor();
      for (let i = 0; i < 2; i++) {
        for (const s of [s1, s2]) { s.classList.remove('glow'); void s.offsetWidth; s.classList.add('glow'); await k.w(500); }
      }
      await k.w(900);
    },
    // ② 做一个填空：拖选文字 → 浮出「设为填空」→ 起名 → 变成填空
    async (root, k) => {
      const pre = document.createTextNode('【MMD】');
      const sel = chars(D.who), tail = document.createTextNode(' - ' + D.song);
      const field = h('div.g-field.focus', pre, ...sel, tail);
      root.append(h('div', { style: { marginTop: '62px' } }, h('div.g-lbl', icon('pencil', 12), D.editLbl), field));
      await k.w(300);
      k.show(root.offsetWidth - 60, root.offsetHeight - 20);
      // 拖选
      await k.moveTo(sel[0], 0.02, 0.6, 800);
      k.box(sel[0]);
      await k.w(120);
      for (const c of sel) { c.classList.add('sel'); await k.moveTo(c, 1, 0.6, 110); }
      await k.w(250);
      // 浮出「设为填空」
      const fb = k.box(sel[0]), lb = k.box(sel[sel.length - 1]);
      const midX = (fb.x + lb.x + lb.w) / 2;
      const pop = h('div.g-pop', icon('sparkle', 14), h('span', D.maker), h('span.g-k', '↵'));
      root.append(pop);
      const placePop = () => { pop.style.left = midX - pop.offsetWidth / 2 + 'px'; pop.style.top = fb.y - pop.offsetHeight - 10 + 'px'; };
      placePop();
      requestAnimationFrame(() => pop.classList.add('in'));
      await k.w(650);
      await k.moveTo(pop, 0.5, 0.55, 520);
      await k.click();
      // 变成名字输入框
      const ph = h('span.g-ph', D.namePh), caret = k.caret();
      const inBox = h('span.in-box', icon('sparkle', 13), ph, caret);
      clear(pop).append(inBox);
      placePop();
      await k.move(midX + 120, fb.y - 70, 500);
      k.hideCursor();
      await k.w(300);
      ph.remove();
      const text = h('span');
      inBox.insertBefore(text, caret);
      if (zh) await k.ime(text, null, 'jiaose', [['j', ['就', '将', '级']], ['jia', ['家', '加', '价']], ['jiao', ['叫', '教', '角']], ['jiaos', ['角色', '脚色', '叫声']], ['jiaose', ['角色', '脚色', '角', '叫']]], pop);
      else await k.type(text, D.a, 70);
      await k.w(300);
      await k.key('↵', 200);
      pop.classList.add('out');
      // 选中的字换成填空
      const s = slot(D.a, '.g-new');
      sel[0].replaceWith(s);
      sel.slice(1).forEach((c) => c.remove());
      await k.w(700);
      s.classList.add('glow');
      await k.w(1400);
    },
    // ③ 填一个空：点它 → 橙色编辑区 + 上方标签 → 打字替换 → 回车填完
    async (root, k) => {
      const s1 = slot(D.a), s2 = slot(D.b);
      const field = h('div.g-field', '【MMD】', s1, ' - ', s2);
      const pill = h('span.g-pill', icon('warn', 12), D.left(2));
      root.append(h('div', { style: { marginTop: '62px' } }, h('div.g-lbl', D.pubLbl, h('span', { style: { flex: 1 } }), pill), field));
      await k.w(300);
      k.show(root.offsetWidth - 50, root.offsetHeight - 24);
      await k.moveTo(s1, 0.5, 0.6, 800);
      await k.click();
      field.classList.add('focus');
      s1.classList.add('act');
      const label = s1.textContent;
      const selSpan = h('span.g-ch.sel', label);
      clear(s1).append(selSpan);
      const tip = k.tip(s1, label);
      await k.move(k.box(s1).x + 40, k.box(s1).y + 70, 500);
      k.hideCursor();
      await k.w(500);
      // 直接打字：先替换掉选中的原文
      clear(s1);
      const text = h('span'), caret = k.caret();
      s1.append(text, caret);
      tip.follow();
      if (zh) {
        const follow = setInterval(tip.follow, 30);
        try {
          await k.ime(text, null, 'chuyin', [['c', ['从', '才', '此']], ['chu', ['出', '处', '初']], ['chuy', ['出于', '初一']], ['chuyin', ['初音', '出音', '处']]], field);
          await k.ime(text, null, 'weilai', [['w', ['我', '为', '玩']], ['wei', ['为', '未', '位']], ['weil', ['为了', '未来']], ['weilai', ['未来', '为来', '尾']]], field);
        } finally { clearInterval(follow); }
      } else {
        const follow = setInterval(tip.follow, 30);
        try { await k.type(text, D.who2, 70); } finally { clearInterval(follow); }
      }
      tip.follow();
      await k.w(500);
      await k.key('↵', 200);
      caret.remove();
      s1.classList.remove('act');
      s1.classList.add('fin', 'flash');
      tip.hide();
      field.insertBefore(k.caret(), s1.nextSibling);
      pill.textContent = '';
      pill.append(icon('warn', 12), D.left(1));
      pill.classList.add('bump');
      await k.w(1800);
    },
    // ④ 多个填空：Tab 一格一格往下填，填完「下一步」才亮
    async (root, k) => {
      const s1 = slot(D.a), s2 = slot(D.b), s3 = slot(D.c);
      const title = h('div.g-field', '【MMD】', s1, ' - ', s2);
      const body = h('div.g-field.g-body', D.model, s3);
      const pill = h('span.g-pill', icon('warn', 12), D.left(3));
      root.append(h('div', { style: { marginTop: '22px' } },
        h('div.g-lbl', D.pubLbl, h('span', { style: { flex: 1 } }), pill), title,
        h('div.g-lbl', { style: { marginTop: '12px' } }, D.bodyLbl), body));
      let left = 3;
      const tick = () => {
        left -= 1;
        clear(pill).append(icon(left ? 'warn' : 'check', 12), left ? D.left(left) : D.allOk);
        pill.classList.toggle('ok', !left);
        pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
      };
      const fill = async (s, field, value, speed) => {
        s.classList.add('act');
        const label = s.textContent;
        clear(s).append(h('span.g-ch.sel', label));
        const tip = k.tip(s, label);
        await k.w(450);
        clear(s);
        const text = h('span'), caret = k.caret();
        s.append(text, caret);
        const follow = setInterval(tip.follow, 30);
        try { await k.type(text, value, speed); } finally { clearInterval(follow); }
        tip.follow();
        await k.w(280);
        return () => { caret.remove(); s.classList.remove('act'); s.classList.add('fin', 'flash'); tip.hide(); };
      };
      await k.w(500);
      title.classList.add('focus');
      title.insertBefore(k.caret(), title.firstChild);
      await k.w(500);
      await k.key('Tab', 160);
      title.querySelector('.g-caret').remove();
      let done = await fill(s1, title, D.who2, 55);
      await k.key('Tab', 120);
      done(); tick();
      done = await fill(s2, title, D.song, 50);
      await k.key('Tab', 120);
      done(); tick();
      title.classList.remove('focus'); body.classList.add('focus');
      done = await fill(s3, body, D.author, 70);
      await k.key('↵', 160);
      done(); tick();
      await k.w(2200);
    },
  ];
  const copy = [
    { title: t('sg1t'), text: t('sg1s') },
    { title: t('sg2t'), text: t('sg2s') },
    { title: t('sg3t'), text: t('sg3s') },
    { title: t('sg4t'), text: t('sg4s'), legend: true },
  ];
  return { pages: scenes.map((play, i) => ({ ...copy[i], play })), kit, STOP };
}

// ── 87-help.js ──────────────────────────────────────────────────
// 帮助弹窗：左边目录，右边内容。新手指引都收在这里——发布流程、填空（四幕动画）、写简介、快捷键。
// 右上角「?」随时打开；第一次进「内容」这一步时自动打开到「填空」。
// 有动画的页（play）循环播放，切页或关闭时用令牌作废还在跑的那一轮；静态页（build）直接摆出示意。

STYLE.push(`
.sheet.help{width:min(900px,100%);max-height:none;height:min(620px,calc(100vh - 48px));display:grid;grid-template-columns:212px minmax(0,1fr);overflow:hidden}
.help nav{position:relative;display:flex;flex-direction:column;gap:2px;padding:16px 10px;border-right:1px solid var(--line);background:color-mix(in srgb,var(--sunk) 55%,var(--card));overflow:auto}
.help nav h3{display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:4px 10px;font-size:15px;font-weight:600;letter-spacing:-.02em}
.help nav .grp{display:flex;align-items:center;gap:8px;margin-top:10px;padding:6px 10px 4px;font-size:11.5px;font-weight:600;color:var(--fg3);letter-spacing:.02em}
.help nav .grp:first-of-type{margin-top:0}
.help nav button.solo{margin-top:10px;gap:8px;padding-left:30px}
.help nav button.solo .ic{position:absolute;left:12px;color:var(--fg3)}
.help nav button.solo.cur .ic{opacity:0}
.help nav button{position:relative;z-index:1;display:flex;align-items:center;width:100%;min-height:32px;padding:5px 10px 5px 30px;border:0;border-radius:8px;background:none;color:var(--fg2);font-size:13px;line-height:1.35;text-align:left;cursor:pointer;transition:color .15s}
.help nav button:hover{color:var(--fg)}
.help nav button.cur{color:var(--fg);font-weight:500}
.help nav .hl{position:absolute;z-index:0;left:10px;right:10px;top:0;height:32px;border-radius:8px;background:var(--card);box-shadow:0 0 0 1px var(--line),0 1px 2px rgba(0,0,0,.05);transition:transform .38s var(--ease),height .38s var(--ease);pointer-events:none}
.help nav .hl::before{content:"";position:absolute;left:12px;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:var(--fg)}
.help .main{position:relative;display:flex;flex-direction:column;min-width:0;min-height:0}
.help .main .g-stage{flex:none;border-radius:0 16px 0 0}
.help .main .g-txt{flex:1;min-height:0;overflow:auto}
.help .x{position:absolute;right:10px;top:10px;z-index:10}
.help .tfoot{border-top:1px solid var(--line)}
.help .pageno{flex:1;font-size:12px;color:var(--fg3)}
.g-static{position:absolute;inset:0;display:grid;place-items:center;padding:24px 36px;opacity:0;transform:translateX(36px);transition:opacity .35s,transform .6s var(--ease);user-select:none}
.g-static.cur{opacity:1;transform:none}
.g-static.prev{transform:translateX(-36px)}
.h-demo{display:grid;gap:14px;width:100%;max-width:600px}
.h-demo .pair{display:grid;grid-template-columns:minmax(0,1fr) 22px minmax(0,1.25fr);align-items:center;gap:10px}
.h-demo .pair>.ic{color:var(--fg3)}
.h-demo .g-field{height:42px;font-size:14px;font-weight:400;overflow:hidden}
.h-demo .g-field>*{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.h-demo .src{font-family:"Geist Mono",ui-monospace,Menlo,monospace;font-size:12.5px;color:var(--fg2)}
.h-demo .lk{color:var(--blue);font-weight:500}
.h-demo .lk .ic{display:inline-block;vertical-align:-2px;margin-right:3px}
.h-demo .wait{color:var(--fg3);background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--blue) 18%,transparent),transparent) 0 0/200% 100%;animation:lkwait 1.1s linear infinite;border-radius:4px}
.h-doc{flex:1;min-height:0;overflow:auto;padding:22px 26px 18px}
.md-help h4{display:flex;align-items:center;gap:6px;margin:18px 0 8px;font-size:14px;font-weight:600}
.md-help h4:first-child{margin-top:0}
.md-help h4 a{display:inline-flex;align-items:center;gap:5px;color:inherit;text-decoration:none}
.md-help h4 a:hover{text-decoration:underline}
.md-help .row3{display:grid;grid-template-columns:128px minmax(0,1fr) minmax(0,1fr);gap:14px;padding:12px 0;border-top:1px solid var(--line);align-items:start;font-size:13px}
.md-help .c0 .lbl{display:inline-flex;align-items:center;gap:5px;padding:0;border:0;background:none;font-weight:600;color:var(--fg);cursor:pointer;text-align:left}
.md-help .c0 .lbl .ic{opacity:0;color:var(--fg3);transition:opacity .15s}
.md-help .c0 .lbl:hover .ic{opacity:1}
.md-help .c0 small{display:block;margin-top:3px;color:var(--fg3);font-size:11.5px}
.md-help .c1{line-height:2;color:var(--fg2)}
.md-help .c1 kbd{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;margin:0 2px 0 0;border-radius:5px;border:1px solid var(--line2);box-shadow:0 1px 0 var(--line2);background:var(--card);font:600 10.5px "Geist Mono",ui-monospace,monospace;color:var(--fg)}
.md-help .c1 code{font:12px "Geist Mono",ui-monospace,monospace;padding:1px 5px;border-radius:5px;background:var(--sunk);border:1px solid var(--line);margin-right:2px}
.md-help .c2>span{display:flex;flex-wrap:wrap;gap:4px 12px}
.md-help .c2 p{margin:0 0 6px}.md-help .c2 h1{font-size:20px;margin:0 0 4px}.md-help .c2 h2{font-size:16px;margin:0}
.md-help .c2 img{max-width:100%;max-height:160px;border-radius:8px;border:1px solid var(--line)}
.md-help a.fake{display:inline-flex;align-items:center;gap:4px;color:var(--blue);cursor:default}
.md-help .note{display:flex;gap:8px;color:var(--fg3)}
@media (max-width:720px){.md-help .row3{grid-template-columns:1fr}}
.h-keys{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;align-items:center;font-size:13px;color:var(--fg2)}
.h-keys .k{display:flex;gap:4px;justify-content:flex-end}
.h-keys kbd{display:inline-grid;place-items:center;min-width:26px;height:24px;padding:0 7px;border-radius:6px;border:1px solid var(--line2);box-shadow:0 1.5px 0 var(--line2);background:var(--card);font:600 11.5px "Geist Mono",ui-monospace,monospace;color:var(--fg)}
@media (max-width:720px){.sheet.help{grid-template-columns:1fr;grid-template-rows:auto minmax(0,1fr)}.help nav{flex-direction:row;flex-wrap:nowrap;overflow-x:auto;border-right:0;border-bottom:1px solid var(--line);padding:10px}.help nav h3,.help nav .grp,.help nav .hl{display:none}.help nav button{flex:none;width:auto;padding:5px 12px;border-radius:999px}.help nav button.cur{background:var(--card);box-shadow:0 0 0 1px var(--line)}.help .main .g-stage{border-radius:0}}
`);

/** 站点官方的格式说明（发布页编辑框旁「格式」弹窗）：结构和示例与站点弹窗一致（siteRules.mdHelp），文案按界面语言取站点原文。 */
function mdHelpDoc(L) {
  const tree = siteRules.mdHelp();
  if (!tree) return h('div.md-help', h('p.note', icon('warn', 14), h('span', L.formatFail)));
  const dark = ui.root.querySelector('.app') && ui.root.querySelector('.app').dataset.theme === 'dark';
  const txtOf = (id) => siteRules.text(id) || id.split('.').pop();
  const ICON = { profile: 'user', video: 'film', image: 'picture', forum: 'chat', playlist: 'list', rule: 'shield', page: 'file' };
  const TAGS = /^(p|strong|em|del|s|h[1-6]|blockquote|ul|ol|li|code|pre|kbd|hr|br|span|b|i)$/;
  function render(n) {
    if (typeof n === 'string') return n;
    if (n.t === 'C') {
      if (n.name) return icon(ICON[n.name] || 'link', 14);
      if (n.to) return h('a', { href: new URL(n.to, location.origin).href, target: '_blank', rel: 'noopener' }, n.k.map(render));
      if (n.id) return h('span', txtOf(n.id));
      return h('span', n.k.map(render));
    }
    if (n.t === 'a') return h('a.fake', n.k.map(render));
    if (n.t === 'img') {
      const src = n.src || (n.srcTpl && n.srcTpl[0] + (dark ? 'dark' : 'light') + n.srcTpl[1]);
      return src && src.startsWith('/') ? h('img', { src: location.origin + src, alt: '' }) : null;
    }
    if (TAGS.test(n.t)) return h(n.t, n.k.map(render));
    return h('span', n.k.map(render));
  }
  const find = (n, fn) => { if (!n || typeof n === 'string') return null; if (fn(n)) return n; for (const k of n.k) { const r = find(k, fn); if (r) return r; } return null; };
  const out = h('div.md-help');
  for (const n of tree.k) {
    if (typeof n === 'string') continue;
    if (n.t === 'C' && n.size === 'h3') continue; // 「格式」大标题：页面已有
    if (n.t === 'C' && (n.id || n.to)) {
      const id = n.id || (find(n, (x) => x.id) || {}).id;
      out.append(h('h4', n.to ? h('a', { href: n.to, target: '_blank', rel: 'noopener' }, txtOf(id), icon('external', 12)) : txtOf(id)));
      continue;
    }
    if (n.className === 'row' && n.k.length >= 3) {
      const [c0, c1, c2] = n.k;
      const labelNode = find(c0, (x) => x.id && !/Description$/.test(x.id));
      const descNode = find(c0, (x) => x.id && /Description$/.test(x.id));
      const copyNode = find(c0, (x) => typeof x.copy === 'string');
      const label = h(copyNode ? 'button.lbl' : 'span.lbl', copyNode ? { type: 'button', onclick: () => { navigator.clipboard.writeText(copyNode.copy).then(() => toast(txtOf('markdownField.help.copiedToClipboard'))); } } : null,
        labelNode ? txtOf(labelNode.id) : '', copyNode && icon('copy', 12));
      out.append(h('div.row3', h('div.c0', label, descNode && h('small', txtOf(descNode.id))), h('div.c1', render(c1)), h('div.c2.prose', render(c2))));
    }
  }
  return out;
}

function helpPages() {
  const zh = env.lang === 'zh';
  const L = zh
    ? {
      title: '帮助', slotNav: ['填空是什么', '做一个填空', '填一个空', '在填空之间切换'], flow: '发布流程', slots: '填空', editor: '写简介', keys: '快捷键',
      flow1: '发布拆成四步：上传 → 内容 → 标签 → 发布。顶部的步骤条可以随时点回去改；每一步都会自动存草稿，关掉页面再回来还在。',
      flow2: '用中文搜标签，站点上的英文标签会自动对上。用过的标签会留在下面，下次一点就加；不想再看到的可以移除。',
      flow3: '把常用的标题格式、简介、标签、分级存成模板，下次右上角「模板」一键套用，只需要填几个空。',
      link: '链接', linkTxt: '打 [文字](网址) 时，打完右括号就变成链接；裸网址后面接一个空格就变成链接。贴进来的 Iwara 站内链接（视频、图片、用户、播放列表、论坛帖）会自动换成作品名。按住 ⌘ / Ctrl 点链接可以打开。',
      mention: '提及', mentionTxt: '打 @ 加用户名会弹出用户列表，↑↓ 选择、回车确认。提及会显示成蓝色，按住 ⌘ / Ctrl 点它可以打开对方主页。',
      format: '格式', formatFail: '这次没能从站点读到官方的格式说明。可以在原版发布页编辑框旁点「格式」查看。',
      keysTxt: '这些按键在发布页里随时可用。弹窗、菜单开着或者输入法正在选词时不响应。还不能进下一步时（比如填空没填完、发布条件没满足），按钮会抖一下并提示卡在哪。',
      keyList: [[['→'], '下一步（没在输入时）'], [['←'], '上一步（没在输入时）'], [['⌘', '↵'], '下一步 / 发布（输入时也能用）'], [['⌘', '⇧', '↵'], '上一步（输入时也能用）'], [['Tab'], '跳到下一个填空'], [['↵'], '这一格填完'], [['⌫'], '空填空里：退出；填空后面：整个删掉'], [['Esc'], '关闭弹窗、菜单'], [['@'], '提及用户']],
      prev: '上一页', next: '下一页', page: (a, b) => `${a} / ${b}`, close: '关闭',
    }
    : {
      title: 'Help', slotNav: ['What blanks are', 'Make a blank', 'Fill a blank', 'Move between blanks'], flow: 'Publishing', slots: 'Blanks', editor: 'Description', keys: 'Shortcuts',
      flow1: 'Publishing takes four steps: upload → content → tags → publish. Click the stepper to go back at any time; drafts save automatically.',
      flow2: 'Search tags in your own language and they map to the site’s tags. Tags you used stay below for one-click reuse; remove the ones you don’t want.',
      flow3: 'Save your usual title pattern, description, tags and rating as a template, then apply it from “Templates” and just fill in the blanks.',
      link: 'Links', linkTxt: 'Typing [text](url) turns into a link as soon as you close the parenthesis; a bare URL becomes a link once you type a space after it. Iwara links (videos, images, users, playlists, forum threads) are replaced with their titles. ⌘/Ctrl-click to open.',
      mention: 'Mentions', mentionTxt: 'Type @ and a name to pick a user — ↑↓ to choose, Enter to confirm. Mentions turn blue; ⌘/Ctrl-click opens their profile.',
      format: 'Formatting', formatFail: 'Couldn’t read the site’s formatting guide this time. Open the original upload page and click “Formatting” next to the editor.',
      keysTxt: 'These keys work anywhere on the publish page, except while a dialog or menu is open or an input method is composing. If you can’t move on yet, the button shakes and tells you what’s missing.',
      keyList: [[['→'], 'Next step (when not typing)'], [['←'], 'Previous step (when not typing)'], [['⌘', '↵'], 'Next / publish (works while typing)'], [['⌘', '⇧', '↵'], 'Previous step (works while typing)'], [['Tab'], 'Next blank'], [['↵'], 'Done with this blank'], [['⌫'], 'Leave an empty blank; delete a blank right before the cursor'], [['Esc'], 'Close dialogs and menus'], [['@'], 'Mention a user']],
      prev: 'Previous', next: 'Next', page: (a, b) => `${a} / ${b}`, close: 'Close',
    };
  if (!navigator.platform.includes('Mac')) for (const row of L.keyList) row[0] = row[0].map((k) => (k === '⌘' ? 'Ctrl' : k));
  const demos = tourDemos();
  const slot = slotGuidePages();
  const pair = (src, out) => h('div.pair', h('div.g-field', src), icon('arrowRight', 18), h('div.g-field', out));
  const iwLink = (name, wait) => h('span.lk' + (wait ? '.wait' : ''), icon('film', 13), name);
  const groups = [
    { key: 'flow', icon: 'layers', title: L.flow, pages: [
      { nav: t('tour1'), title: t('tour1'), text: L.flow1, build: () => demos[0] },
      { nav: t('tour2'), title: t('tour2'), text: L.flow2, build: () => demos[1] },
      { nav: t('tour3'), title: t('tour3'), text: L.flow3, build: () => demos[2] },
    ] },
    { key: 'slots', icon: 'sparkle', title: L.slots, pages: slot.pages.map((p, j) => ({ ...p, nav: L.slotNav[j] })) },
    { key: 'editor', icon: 'pencil', title: L.editor, pages: [
      { nav: L.link, title: L.link, text: L.linkTxt, build: () => h('div.h-demo',
        pair(h('span.src', zh ? '[示例](https://example.com)' : '[Example](https://example.com)'), h('span.lk', zh ? '示例' : 'Example')),
        pair(h('span.src', 'https://www.iwara.tv/video/…␣'), iwLink(zh ? '正在取作品名…' : 'Fetching title…', true)),
        pair(h('span.src', 'https://www.iwara.tv/video/…'), iwLink(zh ? '【MMD】初音未来 - Gimme×Gimme' : 'Miku - Gimme×Gimme'))) },
      { nav: L.mention, title: L.mention, text: L.mentionTxt, build: () => h('div.h-demo',
        pair(h('span.src', '@exam'), h('span', h('span.lk', '@example_user'), ' ', h('span', { style: { color: 'var(--fg3)' } }, zh ? '（⌘ 点击打开主页）' : '(⌘-click to open)')))) },
      { key: 'format', nav: L.format, title: L.format, doc: () => mdHelpDoc(L) },
    ] },
    { key: 'keys', icon: 'grip', title: L.keys, pages: [
      { nav: L.keys, title: L.keys, text: L.keysTxt, build: () => h('div.h-keys', L.keyList.flatMap(([ks, v]) => [h('span.k', ks.map((k) => h('kbd', k))), h('span', v)])) },
    ] },
  ];
  return { L, groups, slot };
}

/** at：从哪一组开始（'flow' | 'slots' | 'editor' | 'keys'），或者直接到某一页（'format'）。onClose：关掉后调用。 */
function showHelp({ at = 'flow', onClose } = {}) {
  const { L, groups, slot } = helpPages();
  const pages = groups.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.key })));
  let token = 0, i = 0, closed = false;

  const views = pages.map((p) => h(p.play ? 'div.g-scene' : 'div.g-static'));
  const replay = ibtn('swap', t('sgReplay'), () => show(i, true));
  replay.classList.add('g-replay');
  const stage = h('div.g-stage', views, replay);
  const txt = h('div.g-txt');
  const docBox = h('div.h-doc', { style: { display: 'none' } });
  const pageno = h('span.pageno');
  const prevBtn = btn(L.prev, { kind: 'ghost', icon: 'arrowLeft', onclick: () => show(i - 1) });
  const nextBtn = btn(L.next, { kind: 'primary', iconRight: 'arrowRight', onclick: () => (i === pages.length - 1 ? close() : show(i + 1)) });
  const foot = h('div.tfoot', pageno, prevBtn, nextBtn);
  const hl = h('div.hl');
  const navBtns = [];
  const nav = h('nav', h('h3', icon('help', 16), L.title), hl, groups.map((g) => [
    g.pages.length > 1 && h('div.grp', icon(g.icon, 13), g.title), // 只有一页的组不另起组名，免得和条目重复
    g.pages.map((p) => { const j = pages.findIndex((x) => x.group === g.key && x.nav === p.nav); const solo = g.pages.length === 1;
      const b = h('button' + (solo ? '.solo' : ''), { type: 'button', onclick: () => show(j) }, solo && icon(g.icon, 13), p.nav); navBtns[j] = b; return b; }),
  ]));
  const main = h('div.main', stage, txt, docBox, foot, ibtn('x', L.close, () => close()));
  main.lastChild.classList.add('x');
  const scrim = h('div.scrim');

  async function loop(n, my) {
    const alive = () => my === token && !closed;
    const root = views[n];
    await sleep(420); // 等换页的过渡走完再量坐标
    while (alive()) {
      clear(root);
      try { await pages[n].play(root, slot.kit(root, alive)); } catch (e) { if (e !== slot.STOP) { console.error('[iwe] help', e); return; } }
      if (!alive()) return;
      root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      await sleep(320);
      if (!alive()) return;
      root.getAnimations().forEach((a) => a.cancel());
    }
  }
  const legend = () => h('div.g-legend',
    h('span', h('kbd', 'Tab'), t('sgKeyTab')), h('span', h('kbd', '↵'), h('kbd', '→'), t('sgKeyDone')), h('span', h('kbd', '⌫'), t('sgKeyBack')));
  function show(n, again) {
    const from = i;
    i = clamp(n, 0, pages.length - 1);
    const my = ++token;
    views.forEach((v, j) => { v.className = (pages[j].play ? 'g-scene' : 'g-static') + (j === i ? ' cur' : j < i ? ' prev' : ''); });
    const p = pages[i];
    // 文档页（官方格式说明）：整块可滚动的正文，不要演示区
    stage.style.display = txt.style.display = p.doc ? 'none' : '';
    docBox.style.display = p.doc ? '' : 'none';
    if (p.doc) { if (!docBox.firstChild || docBox.dataset.page !== String(i)) { clear(docBox).append(p.doc()); docBox.dataset.page = String(i); docBox.scrollTop = 0; } docBox.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }); }
    else if (!p.play && (again || !views[i].firstChild)) clear(views[i]).append(p.build());
    if (p.play) loop(i, my);
    replay.style.visibility = p.play ? '' : 'hidden';
    if (!p.doc && (from !== i || again !== true)) {
      add(clear(txt), [h('b', p.title), h('p', p.text), p.legend && legend()]);
      txt.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    navBtns.forEach((b, j) => b && b.classList.toggle('cur', j === i));
    const b = navBtns[i];
    if (b) { hl.style.transform = `translateY(${b.offsetTop}px)`; hl.style.height = b.offsetHeight + 'px'; b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    pageno.textContent = L.page(i + 1, pages.length);
    prevBtn.disabled = i === 0;
    const last = i === pages.length - 1;
    clear(nextBtn).append(h('span', last ? t('sgDone') : L.next), !last ? icon('arrowRight') : '');
  }
  function close() {
    if (closed) return;
    closed = true;
    token++;
    store.set('slotGuideDone', VERSION);
    unlockScroll();
    scrim.classList.remove('in');
    setTimeout(() => scrim.remove(), 240);
    document.removeEventListener('keydown', onKey, true);
    onClose && onClose();
  }
  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); show(i + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); show(i - 1); }
    else if (e.key === 'Enter' && !(e.target && e.target.closest && e.target.closest('button'))) { e.preventDefault(); e.stopPropagation(); i === pages.length - 1 ? close() : show(i + 1); }
    else if (e.key === 'Tab' || e.key.length === 1 || e.key === 'Backspace') { if (e.key !== 'Tab') { e.preventDefault(); e.stopPropagation(); } } // 别让按键漏到身后的标题框里
  };
  document.addEventListener('keydown', onKey, true);
  if (ui.root.activeElement) ui.root.activeElement.blur();
  scrim.append(h('div.sheet.help', { role: 'dialog', 'aria-label': L.title }, nav, main));
  scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });
  ui.layer.append(scrim);
  lockScroll();
  const byKey = pages.findIndex((p) => p.key === at);
  const start = byKey >= 0 ? byKey : Math.max(0, pages.findIndex((p) => p.group === at));
  requestAnimationFrame(() => { scrim.classList.add('in'); show(start); });
  return close;
}

// ── 90-main.js ──────────────────────────────────────────────────
// 入口：盯着站内路由，在发布 / 编辑 / 内容管理这几页把原内容藏起来，换上工作台。
// 只藏不删：原页面的节点一个都不动，随时能切回去。

const HOST_ID = 'iwe-host';

function matchRoute(path) {
  let m;
  if ((m = path.match(/^\/create\/(video|image)\/?$/))) return { view: 'wizard', kind: m[1] };
  if ((m = path.match(/^\/(video|image)\/([^/]+)(?:\/[^/]+)?\/edit\/?$/))) return { view: 'wizard', kind: m[1], editId: m[2] };
  if ((m = path.match(/^\/account\/content\/(video|image)s\/?$/))) return { view: 'manage', kind: m[1] };
  return null;
}

const studio = (() => {
  // gen：每次挂载加一。sync() 里有 await，期间可能又被触发一次（站点刷新时会重渲染内容区）；
  // 旧的那次醒来时路由 key 跟新的一样，只比 key 会让两次都把界面插进去——必须比代次。
  let host = null, appEl = null, cleanup = null, currentKey = null, booted = null, backPill = null, retryAt = 0, gen = 0;
  const off = () => sessionStorage.getItem(NS + 'off') === '1';

  function ensureGlobalStyle() {
    if (document.getElementById('iwe-global')) return;
    document.head.append(h('style', { id: 'iwe-global' }, `section.content.iwe-on>:not(#${HOST_ID}){display:none!important}section.content.iwe-on{padding:0!important;margin-bottom:0!important;display:block!important}#${HOST_ID}{display:block;width:100%}.page.iwe-page>footer.footer{display:none!important}
#iwe-back{position:fixed;right:20px;bottom:20px;z-index:99999;height:36px;padding:0 14px;border-radius:999px;border:1px solid rgba(128,128,128,.4);background:#111;color:#fff;font:500 13px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25)}`));
  }

  function mountHost(section) {
    host = h('div', { id: HOST_ID });
    const root = host.attachShadow({ mode: 'open' });
    appEl = h('div.app');
    ui.layer = h('div.layer');
    appEl.append(ui.layer);
    root.append(h('style', STYLE.join('\n')), appEl);
    ui.root = root;
    installTips(appEl);
    section.append(host);
    section.classList.add('iwe-on');
    section.closest('.page') && section.closest('.page').classList.add('iwe-page');
    theme();
  }
  function theme() {
    if (!appEl) return;
    appEl.dataset.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    // 站点左侧菜单是浮在内容上的：给它让出位置
    const side = document.querySelector('.page > .menu');
    const r = side && getComputedStyle(side).position === 'fixed' ? side.getBoundingClientRect() : null;
    const pad = r && r.width < innerWidth * 0.5 && r.right > 0 ? Math.round(r.right) : 0;
    if (appEl.dataset.pad !== String(pad)) { appEl.dataset.pad = pad; appEl.style.paddingLeft = pad + 'px'; }
    // 站点顶栏也是固定浮着的：有的页面（发布页）站点自己留了顶部空间，有的（内容管理页）没留，内容会压在顶栏底下。
    // 按顶栏底边和我们在文档里的起点算差多少补多少
    const hdr = document.querySelector('header.header, .page > header, header');
    const hb = hdr && getComputedStyle(hdr).position === 'fixed' ? hdr.getBoundingClientRect().bottom : 0;
    const padTop = host ? Math.max(0, Math.round(hb - (host.getBoundingClientRect().top + scrollY))) : 0;
    if (appEl.dataset.padTop !== String(padTop)) { appEl.dataset.padTop = padTop; appEl.style.paddingTop = padTop + 'px'; }
  }
  function unmount() {
    gen++; // 让还在 await 的那次 sync 醒来后作废
    if (cleanup) { try { cleanup(); } catch { /* 忽略 */ } cleanup = null; }
    document.querySelectorAll('.iwe-on').forEach((el) => el.classList.remove('iwe-on'));
    document.querySelectorAll('.iwe-page').forEach((el) => el.classList.remove('iwe-page'));
    if (host) host.remove();
    host = appEl = null;
    currentKey = null;
  }

  const app = {
    go(path) {
      // 离开工作台的链接（站外，或站内不归工作台管的页面，比如帖子）一律新开页签
      if (/^https?:/.test(path) || !matchRoute(new URL(path, location.origin).pathname)) { openTab(path); return; }
      history.pushState({}, '', path);
      dispatchEvent(new PopStateEvent('popstate'));
      scrollTo(0, 0);
      sync();
    },
    reload() { currentKey = null; sync(); },
    /** 右上角「…」菜单；extra 是当前页面自己的条目，放在最前面。 */
    menu(anchor, extra = []) {
      menu(anchor, [
        ...extra,
        extra.length && '-',
        { icon: 'swap', label: t('original'), onclick: () => { sessionStorage.setItem(NS + 'off', '1'); sync(); } },
      ]);
    },
  };

  async function sync() {
    ensureGlobalStyle();
    const route = matchRoute(location.pathname);
    const key = route ? JSON.stringify(route) : null;
    // 「原版页面」开着时：不接管，只留一个回来的按钮
    if (route && off()) {
      if (host) unmount();
      if (!backPill) { backPill = h('button', { id: 'iwe-back', onclick: () => { sessionStorage.removeItem(NS + 'off'); sync(); } }, '← ' + t('backToStudio')); document.body.append(backPill); }
      return;
    }
    if (backPill) { backPill.remove(); backPill = null; }
    if (!route) { if (host) unmount(); return; }
    if (!localStorage.getItem('token')) return; // 未登录：交给原页面处理
    const section = document.querySelector('section.content');
    if (!section) return;
    if (key === currentKey && host && host.isConnected && section.contains(host)) return;
    unmount();
    currentKey = key;
    const my = ++gen;
    mountHost(section);
    try {
      await (booted || (booted = svc.boot()));
    } catch (e) {
      booted = null;
      retryAt = Date.now() + 5000; // 取用户信息失败：过几秒再试，别连着打接口
      if (my === gen) unmount();
      return;
    }
    if (my !== gen || !appEl) return;
    const stageEl = h('div');
    appEl.insertBefore(stageEl, ui.layer);
    const mounted = route.view === 'manage' ? await mountManage(stageEl, { kind: route.kind, app }) : await mountWizard(stageEl, { kind: route.kind, editId: route.editId, app });
    if (my !== gen) { mounted && mounted(); return; }
    cleanup = mounted;
    if (route.view === 'wizard' && !route.editId && !store.get('tourDone')) {
      setTimeout(() => my === gen && showTour({ onTry: () => cleanup && cleanup.applyTemplate && cleanup.applyTemplate(templates.samples()[0]) }), 500);
    }
  }

  function start() {
    let last = location.pathname;
    const tick = () => {
      const section = document.querySelector('section.content');
      const lost = currentKey && (!host || !host.isConnected || !section || !section.contains(host));
      // 脚本启动时站点可能还没把页面渲染出来（没有内容区可挂）：只要该接管而还没接管，就一直重试
      const pending = !currentKey && !off() && Date.now() >= retryAt && section && matchRoute(location.pathname) && localStorage.getItem('token');
      if (location.pathname !== last || lost || pending) { last = location.pathname; if (lost) currentKey = null; sync(); }
      theme();
    };
    addEventListener('popstate', () => setTimeout(tick, 0));
    setInterval(tick, 300);
    sync();
  }
  return { start, app };
})();

studio.start();
})();
