const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-DeBJh6Gk.js","assets/@vue-D9bH4lrz.js","assets/vuetify-LsV7B-xS.js","assets/vuetify-B4_NCUnQ.css","assets/@mdi-DKC2W5MC.js","assets/pinia-B-uPeou1.js","assets/@ffmpeg-B1ncfXmI.js","assets/vue-virtual-scroll-grid-DSIWnnUt.js","assets/vite-ssg-CQCaBNHx.js","assets/vue-router-Y811DZoV.js","assets/@unhead-DsvcCsHo.js","assets/unhead-CpyiRjm1.js","assets/hookable-B7_1qfUG.js","assets/protobufjs-CgPuVhCO.js","assets/@protobufjs-f4nnaicZ.js","assets/opencc-js-D2OnpAg6.js","assets/index-uKSosJuT.css"])))=>i.map(i=>d[i]);
var k=Object.defineProperty;var L=(i,n,r)=>n in i?k(i,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[n]=r;var O=(i,n,r)=>L(i,typeof n!="symbol"?n+"":n,r);import{V as C}from"./vite-ssg-CQCaBNHx.js";import{d as S,c as U}from"./pinia-B-uPeou1.js";import{m}from"./protobufjs-CgPuVhCO.js";import{r as p,U as P,c as b,w as D,k as M,l as j,E as R,a6 as V,D as N,F as v,X as E}from"./@vue-D9bH4lrz.js";import{C as J,f as _}from"./opencc-js-D2OnpAg6.js";import{V as q,a as B,c as $,m as G,b as Y,d as W}from"./vuetify-LsV7B-xS.js";import"./vue-router-Y811DZoV.js";import"./@unhead-DsvcCsHo.js";import"./unhead-CpyiRjm1.js";import"./hookable-B7_1qfUG.js";import"./@protobufjs-f4nnaicZ.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&e(a)}).observe(document,{childList:!0,subtree:!0});function r(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(t){if(t.ep)return;t.ep=!0;const o=r(t);fetch(t.href,o)}})();const u=m.Reader,I=m.Writer,d=m.util,c=m.roots.default||(m.roots.default={}),z=c.data=(()=>{const i={};return i.Info=function(){function n(r){if(r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return n.prototype.text="",n.prototype.season=0,n.prototype.episode=0,n.prototype.frameStart=0,n.prototype.framePrefer=0,n.prototype.frameEnd=0,n.prototype.segmentId=0,n.create=function(e){return new n(e)},n.encode=function(e,t){return t||(t=I.create()),e.text!=null&&Object.hasOwnProperty.call(e,"text")&&t.uint32(10).string(e.text),e.season!=null&&Object.hasOwnProperty.call(e,"season")&&t.uint32(16).int32(e.season),e.episode!=null&&Object.hasOwnProperty.call(e,"episode")&&t.uint32(24).int32(e.episode),e.frameStart!=null&&Object.hasOwnProperty.call(e,"frameStart")&&t.uint32(32).int32(e.frameStart),e.framePrefer!=null&&Object.hasOwnProperty.call(e,"framePrefer")&&t.uint32(40).int32(e.framePrefer),e.frameEnd!=null&&Object.hasOwnProperty.call(e,"frameEnd")&&t.uint32(48).int32(e.frameEnd),e.segmentId!=null&&Object.hasOwnProperty.call(e,"segmentId")&&t.uint32(56).int32(e.segmentId),t},n.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},n.decode=function(e,t){e instanceof u||(e=u.create(e));let o=t===void 0?e.len:e.pos+t,a=new c.data.Info;for(;e.pos<o;){let s=e.uint32();switch(s>>>3){case 1:{a.text=e.string();break}case 2:{a.season=e.int32();break}case 3:{a.episode=e.int32();break}case 4:{a.frameStart=e.int32();break}case 5:{a.framePrefer=e.int32();break}case 6:{a.frameEnd=e.int32();break}case 7:{a.segmentId=e.int32();break}default:e.skipType(s&7);break}}return a},n.decodeDelimited=function(e){return e instanceof u||(e=new u(e)),this.decode(e,e.uint32())},n.verify=function(e){return typeof e!="object"||e===null?"object expected":e.text!=null&&e.hasOwnProperty("text")&&!d.isString(e.text)?"text: string expected":e.season!=null&&e.hasOwnProperty("season")&&!d.isInteger(e.season)?"season: integer expected":e.episode!=null&&e.hasOwnProperty("episode")&&!d.isInteger(e.episode)?"episode: integer expected":e.frameStart!=null&&e.hasOwnProperty("frameStart")&&!d.isInteger(e.frameStart)?"frameStart: integer expected":e.framePrefer!=null&&e.hasOwnProperty("framePrefer")&&!d.isInteger(e.framePrefer)?"framePrefer: integer expected":e.frameEnd!=null&&e.hasOwnProperty("frameEnd")&&!d.isInteger(e.frameEnd)?"frameEnd: integer expected":e.segmentId!=null&&e.hasOwnProperty("segmentId")&&!d.isInteger(e.segmentId)?"segmentId: integer expected":null},n.fromObject=function(e){if(e instanceof c.data.Info)return e;let t=new c.data.Info;return e.text!=null&&(t.text=String(e.text)),e.season!=null&&(t.season=e.season|0),e.episode!=null&&(t.episode=e.episode|0),e.frameStart!=null&&(t.frameStart=e.frameStart|0),e.framePrefer!=null&&(t.framePrefer=e.framePrefer|0),e.frameEnd!=null&&(t.frameEnd=e.frameEnd|0),e.segmentId!=null&&(t.segmentId=e.segmentId|0),t},n.toObject=function(e,t){t||(t={});let o={};return t.defaults&&(o.text="",o.season=0,o.episode=0,o.frameStart=0,o.framePrefer=0,o.frameEnd=0,o.segmentId=0),e.text!=null&&e.hasOwnProperty("text")&&(o.text=e.text),e.season!=null&&e.hasOwnProperty("season")&&(o.season=e.season),e.episode!=null&&e.hasOwnProperty("episode")&&(o.episode=e.episode),e.frameStart!=null&&e.hasOwnProperty("frameStart")&&(o.frameStart=e.frameStart),e.framePrefer!=null&&e.hasOwnProperty("framePrefer")&&(o.framePrefer=e.framePrefer),e.frameEnd!=null&&e.hasOwnProperty("frameEnd")&&(o.frameEnd=e.frameEnd),e.segmentId!=null&&e.hasOwnProperty("segmentId")&&(o.segmentId=e.segmentId),o},n.prototype.toJSON=function(){return this.constructor.toObject(this,m.util.toJSONOptions)},n.getTypeUrl=function(e){return e===void 0&&(e="type.googleapis.com"),e+"/data.Info"},n}(),i.Data=function(){function n(r){if(this.info=[],r)for(let e=Object.keys(r),t=0;t<e.length;++t)r[e[t]]!=null&&(this[e[t]]=r[e[t]])}return n.prototype.info=d.emptyArray,n.create=function(e){return new n(e)},n.encode=function(e,t){if(t||(t=I.create()),e.info!=null&&e.info.length)for(let o=0;o<e.info.length;++o)c.data.Info.encode(e.info[o],t.uint32(10).fork()).ldelim();return t},n.encodeDelimited=function(e,t){return this.encode(e,t).ldelim()},n.decode=function(e,t){e instanceof u||(e=u.create(e));let o=t===void 0?e.len:e.pos+t,a=new c.data.Data;for(;e.pos<o;){let s=e.uint32();switch(s>>>3){case 1:{a.info&&a.info.length||(a.info=[]),a.info.push(c.data.Info.decode(e,e.uint32()));break}default:e.skipType(s&7);break}}return a},n.decodeDelimited=function(e){return e instanceof u||(e=new u(e)),this.decode(e,e.uint32())},n.verify=function(e){if(typeof e!="object"||e===null)return"object expected";if(e.info!=null&&e.hasOwnProperty("info")){if(!Array.isArray(e.info))return"info: array expected";for(let t=0;t<e.info.length;++t){let o=c.data.Info.verify(e.info[t]);if(o)return"info."+o}}return null},n.fromObject=function(e){if(e instanceof c.data.Data)return e;let t=new c.data.Data;if(e.info){if(!Array.isArray(e.info))throw TypeError(".data.Data.info: array expected");t.info=[];for(let o=0;o<e.info.length;++o){if(typeof e.info[o]!="object")throw TypeError(".data.Data.info: object expected");t.info[o]=c.data.Info.fromObject(e.info[o])}}return t},n.toObject=function(e,t){t||(t={});let o={};if((t.arrays||t.defaults)&&(o.info=[]),e.info&&e.info.length){o.info=[];for(let a=0;a<e.info.length;++a)o.info[a]=c.data.Info.toObject(e.info[a],t)}return o},n.prototype.toJSON=function(){return this.constructor.toObject(this,m.util.toJSONOptions)},n.getTypeUrl=function(e){return e===void 0&&(e="type.googleapis.com"),e+"/data.Data"},n}(),i})(),Q=S("data",()=>{const i=p([]),n=p(!1),r=p(null),e=async()=>{if(!(i.value.length>0)){n.value=!0,r.value=null;try{const o=await(await fetch("/data/data.bin")).arrayBuffer(),a=z.Data.decode(new Uint8Array(o));i.value=a.info}catch(t){r.value=t instanceof Error?t:new Error("Failed to fetch cards"),i.value=[]}finally{n.value=!1}}};return{cards:P(i),isLoading:P(n),error:P(r),fetchCards:e}});function T(i,n){let r;return function(...e){clearTimeout(r),r=setTimeout(()=>i(...e),n)}}var w=(i=>(i[i.MYGO=1]="MYGO",i[i.AVE_MUJICA=2]="AVE_MUJICA",i))(w||{});const _e={1:"MyGO",2:"Ave Mujica"},g={1:Array.from({length:13},(i,n)=>n+1),2:Array.from({length:12},(i,n)=>n+1)},Ie=23.976,ge=[0,0,0,34288,68333,0,0,0,0,0,0,0,0,0],K=S("filter",()=>{const i=p([]),n=p([]),r=p(0),e=b(()=>({mygo:new Set(i.value),avemujica:new Set(n.value),character:r.value})),t=()=>{const a=new URL(window.location.href);let s=0;i.value.forEach(l=>{s|=1<<l-1}),n.value.forEach(l=>{s|=1<<l+12}),s===0?a.searchParams.delete("ep"):a.searchParams.set("ep",s.toString()),window.history.pushState({},"",a.toString())},o=()=>{const s=new URLSearchParams(window.location.search).get("ep");if(s){const l=parseInt(s),h=g[w.MYGO].filter(f=>(l&1<<f-1)!==0),y=g[w.AVE_MUJICA].filter(f=>(l&1<<f+12)!==0);i.value=h,n.value=y}};return D([i,n],T(()=>t(),300)),{mygoEpisodes:i,avemujicaEpisodes:n,characterId:r,activeFilters:e,initFromUrl:o}}),X=[["你","妳"],["啊","阿"]],H=J(_.cn,_.tw.concat([X]));function Z(i){return H(i.trim()).toLowerCase()}const ee=S("search",()=>{const i=p(""),n=b(()=>i.value?Z(i.value):""),r=()=>{const t=new URL(window.location.href);i.value===""?t.searchParams.delete("q"):t.searchParams.set("q",i.value),window.history.pushState({},"",t.toString())},e=()=>{const o=new URLSearchParams(window.location.search).get("q");o&&(i.value=o)};return D(i,T(()=>r(),300)),{query:i,normalizedQuery:n,initFromUrl:e}}),te=M({__name:"App",setup(i){const n=Q(),r=K(),e=ee();return j(async()=>{r.initFromUrl(),e.initFromUrl(),await n.fetchCards()}),(t,o)=>{const a=V("router-view");return N(),R(B,null,{default:v(()=>[E(q,null,{default:v(()=>[E(a)]),_:1})]),_:1})}}});class ne{constructor(n,r,e=1300){O(this,"element");this.element=n,this.element._longPressCallBack=r,this.element._longPressStart=this.start,this.element._longPressStop=this.stop,this.element._longPressMove=this.move,this.element._longPressDelay=e,this.element._longPressDestroy=this.destroy(this.element),this.element._longPressIsStart=!1,this.element._longPressTimer=null,this.element.addEventListener("pointerdown",this.element._longPressStart),this.element.addEventListener("pointerup",this.element._longPressStop),this.element.addEventListener("pointermove",this.element._longPressMove)}start(n){const r=this;r._longPressTimer===null&&!r._longPressIsStart&&(r._longPressIsStart=!0,r._longPressTimer=window.setTimeout(()=>{r._longPressCallBack(n),r._longPressStop(n)},r._longPressDelay))}stop(){const n=this;n._longPressTimer&&clearTimeout(n._longPressTimer),n._longPressTimer=null,n._longPressIsStart=!1}move(n){const r=this;r._longPressIsStart&&(r._longPressTimer&&clearTimeout(r._longPressTimer),r._longPressTimer=window.setTimeout(()=>{r._longPressCallBack(n),r._longPressStop(n)},r._longPressDelay))}destroy(n){return()=>{n.removeEventListener("pointerdown",this.start),n.removeEventListener("pinterup",this.stop),n.removeEventListener("pointermove",this.move)}}}function re(i,n){new ne(i,n.value,150)}function oe(i){i._longPressDestroy()}const ie={mounted:re,beforeUnmount:oe},ae=$({blueprint:G,icons:{defaultSet:"mdi",aliases:Y,sets:{mdi:W}},theme:{defaultTheme:"dark",themes:{light:{colors:{primary:"#1976D2",secondary:"#424242",accent:"#82B1FF",error:"#FF5252",info:"#2196F3",success:"#4CAF50",warning:"#FFC107"}},dark:{colors:{primary:"#2196F3",secondary:"#424242",accent:"#FF4081",error:"#FF5252",info:"#2196F3",success:"#4CAF50",warning:"#FFC107"}}}}}),se="modulepreload",le=function(i){return"/"+i},F={},fe=function(n,r,e){let t=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),s=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));t=Promise.allSettled(r.map(l=>{if(l=le(l),l in F)return;F[l]=!0;const h=l.endsWith(".css"),y=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${y}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":se,h||(f.as="script"),f.crossOrigin="",f.href=l,s&&f.setAttribute("nonce",s),document.head.appendChild(f),h)return new Promise((x,A)=>{f.addEventListener("load",x),f.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(a){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=a,window.dispatchEvent(s),!s.defaultPrevented)throw a}return t.then(a=>{for(const s of a||[])s.status==="rejected"&&o(s.reason);return n().catch(o)})},ce=[{path:"/",name:"/",component:()=>fe(()=>import("./index-DeBJh6Gk.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]))}];C(te,{routes:ce},i=>{i.app.use(ae),i.app.use(U()),i.app.directive("longPress",ie)});export{g as E,Ie as F,ge as M,w as S,K as a,ee as b,_e as c,T as d,Z as n,Q as u};
