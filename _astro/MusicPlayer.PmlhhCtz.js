import{o as Ct,b as St,p as $,a as A,f as Bt,s as B,c as Tt}from"./props.C9FVRaJP.js";import{i as Ft}from"./lifecycle.BczfCs6M.js";import{aq as At,al as Nt,bo as Kt,bp as jt,T as Xt,u as Wt,bq as Ot,br as qt,M as Ut,bs as at,bt as Et,X as et,ab as pt,ac as Yt,_ as d,e as o,a0 as k,$ as c,V as P,W as it,Y as bt,Z as T,a5 as ot,a6 as tt,a1 as D,a9 as Y,aa as z,ad as gt,D as Gt,a7 as Zt,bu as Jt,ap as Qt,x as mt}from"./utils.BdkxNK2W.js";import{a as $t,s as W}from"./render.BfUkjfqe.js";import{i as F}from"./if.CPSdqM7E.js";import{I as H}from"./Icon.Bna9hpX5.js";import{m as ft}from"./config.BgDKmF6L.js";import{m as _}from"./musicPlayerStore.BziOxG-5.js";import{S as te,a as ee,b as ie,c as re,d as ne,C as yt,P as ae,e as oe,N as le,s as se}from"./SidebarTrackInfo.C_Frdknl.js";import{I as J}from"./zh_TW.CxLn-SB1.js";import{i as Q}from"./translation.DebbdouC.js";import{a as ue}from"./actions.BTXkBWCA.js";import{e as ce,i as de}from"./each.B58b4BWs.js";const ge=()=>performance.now(),U={tick:i=>requestAnimationFrame(i),now:()=>ge(),tasks:new Set};function Mt(){const i=U.now();U.tasks.forEach(t=>{t.c(i)||(U.tasks.delete(t),t.f())}),U.tasks.size!==0&&U.tick(Mt)}function ve(i){let t;return U.tasks.size===0&&U.tick(Mt),{promise:new Promise(e=>{U.tasks.add(t={c:i,f:e})}),abort(){U.tasks.delete(t)}}}function dt(i,t){Et(()=>{i.dispatchEvent(new CustomEvent(t))})}function me(i){if(i==="float")return"cssFloat";if(i==="offset")return"cssOffset";if(i.startsWith("--"))return i;const t=i.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function wt(i){const t={},e=i.split(";");for(const s of e){const[a,l]=s.split(":");if(!a||l===void 0)break;const m=me(a.trim());t[m]=l.trim()}return t}const fe=i=>i;function Lt(i,t,e,s){var a=(i&Ot)!==0,l="both",m,g=t.inert,w=t.style.overflow,r,u;function v(){return Et(()=>m??=e()(t,s?.()??{},{direction:l}))}var f={is_global:a,in(){t.inert=g,r=ht(t,v(),u,1,()=>{dt(t,"introend"),r?.abort(),r=m=void 0,t.style.overflow=w})},out(S){t.inert=!0,u=ht(t,v(),r,0,()=>{dt(t,"outroend"),S?.()})},stop:()=>{r?.abort(),u?.abort()}},b=At;if((b.nodes.t??=[]).push(f),$t){var p=a;if(!p){for(var n=b.parent;n&&(n.f&Nt)!==0;)for(;(n=n.parent)&&(n.f&Kt)===0;);p=!n||(n.f&jt)!==0}p&&Xt(()=>{Wt(()=>f.in())})}}function ht(i,t,e,s,a){var l=s===1;if(qt(t)){var m,g=!1;return Ut(()=>{if(!g){var S=t({direction:l?"in":"out"});m=ht(i,S,e,s,a)}}),{abort:()=>{g=!0,m?.abort()},deactivate:()=>m.deactivate(),reset:()=>m.reset(),t:()=>m.t()}}if(e?.deactivate(),!t?.duration&&!t?.delay)return dt(i,l?"introstart":"outrostart"),a(),{abort:at,deactivate:at,reset:at,t:()=>s};const{delay:w=0,css:r,tick:u,easing:v=fe}=t;var f=[];if(l&&e===void 0&&(u&&u(0,1),r)){var b=wt(r(0,1));f.push(b,b)}var p=()=>1-s,n=i.animate(f,{duration:w,fill:"forwards"});return n.onfinish=()=>{n.cancel(),dt(i,l?"introstart":"outrostart");var S=e?.t()??1-s;e?.abort();var x=s-S,L=t.duration*Math.abs(x),C=[];if(L>0){var y=!1;if(r)for(var E=Math.ceil(L/16.666666666666668),I=0;I<=E;I+=1){var G=S+x*v(I/E),lt=wt(r(G,1-G));C.push(lt),y||=lt.overflow==="hidden"}y&&(i.style.overflow="hidden"),p=()=>{var rt=n.currentTime;return S+x*v(rt/L)},u&&ve(()=>{if(n.playState!=="running")return!1;var rt=p();return u(rt,1-rt),!0})}n=i.animate(C,{duration:L,fill:"forwards"}),n.onfinish=()=>{p=()=>s,u?.(s,1-s),a()}},{abort:()=>{n&&(n.cancel(),n.effect=null,n.onfinish=at)},deactivate:()=>{a=at},reset:()=>{s===0&&u?.(1,0)},t:()=>p()}}function be(i){const t=i-1;return t*t*t+1}function It(i){const t=i-1;return t*t*t+1}function kt(i){const t=typeof i=="string"&&i.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return t?[parseFloat(t[1]),t[2]||"px"]:[i,"px"]}function ye(i,{delay:t=0,duration:e=400,easing:s=It,x:a=0,y:l=0,opacity:m=0}={}){const g=getComputedStyle(i),w=+g.opacity,r=g.transform==="none"?"":g.transform,u=w*(1-m),[v,f]=kt(a),[b,p]=kt(l);return{delay:t,duration:e,easing:s,css:(n,S)=>`
			transform: ${r} translate(${(1-n)*v}${f}, ${(1-n)*b}${p});
			opacity: ${w-u*S}`}}function he(i,{delay:t=0,duration:e=400,easing:s=It,axis:a="y"}={}){const l=getComputedStyle(i),m=+l.opacity,g=a==="y"?"height":"width",w=parseFloat(l[g]),r=a==="y"?["top","bottom"]:["left","right"],u=r.map(x=>`${x[0].toUpperCase()}${x.slice(1)}`),v=parseFloat(l[`padding${u[0]}`]),f=parseFloat(l[`padding${u[1]}`]),b=parseFloat(l[`margin${u[0]}`]),p=parseFloat(l[`margin${u[1]}`]),n=parseFloat(l[`border${u[0]}Width`]),S=parseFloat(l[`border${u[1]}Width`]);return{delay:t,duration:e,easing:s,css:x=>`overflow: hidden;opacity: ${Math.min(x*20,1)*m};${g}: ${x*w}px;padding-${r[0]}: ${x*v}px;padding-${r[1]}: ${x*f}px;margin-${r[0]}: ${x*b}px;margin-${r[1]}: ${x*p}px;border-${r[0]}-width: ${x*n}px;border-${r[1]}-width: ${x*S}px;min-${g}: 0`}}var xe=T('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function pe(i,t){et(t,!0);let e=pt(Yt(_.getState())),s=pt(!1);function a(E){const I=E;I.detail&&bt(e,I.detail,!0)}Ct(()=>{window.addEventListener("music-sidebar:state",a)}),St(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",a)});function l(){_.toggle()}function m(){_.prev()}function g(){_.next()}function w(){_.toggleMode()}function r(){bt(s,!o(s))}function u(E){_.playIndex(E)}function v(E){_.seek(E)}function f(){_.toggleMute()}function b(E){_.setVolume(E)}var p=xe(),n=d(p),S=d(n);te(S,{get currentSong(){return o(e).currentSong},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading}});var x=k(S,2);ee(x,{get currentSong(){return o(e).currentSong},get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},get volume(){return o(e).volume},get isMuted(){return o(e).isMuted},onToggleMute:f,onSetVolume:b}),c(n);var L=k(n,2);ie(L,{get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},onSeek:v});var C=k(L,2);re(C,{get isPlaying(){return o(e).isPlaying},get isShuffled(){return o(e).isShuffled},get repeatMode(){return o(e).isRepeating},onToggleMode:w,onPrev:m,onNext:g,onTogglePlay:l,onTogglePlaylist:r});var y=k(C,2);ne(y,{get playlist(){return o(e).playlist},get currentIndex(){return o(e).currentIndex},get isPlaying(){return o(e).isPlaying},get show(){return o(s)},onClose:r,onPlaySong:u}),c(p),P(i,p),it()}var we=T('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),ke=T('<div class="text-xs text-30 mt-1"> </div>'),_e=T('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function _t(i,t){et(t,!0);const e=$(t,"showTime",3,!1),s=$(t,"size",3,"mini");function a(r){if(!Number.isFinite(r)||r<0)return"0:00";const u=Math.floor(r/60),v=Math.floor(r%60);return`${u}:${v.toString().padStart(2,"0")}`}var l=ot(),m=tt(l);{var g=r=>{var u=we(),v=d(u),f=d(v,!0);c(v);var b=k(v,2),p=d(b,!0);c(b),c(u),D(()=>{W(f,t.song.title),W(p,t.song.artist)}),P(r,u)},w=r=>{var u=_e(),v=d(u),f=d(v,!0);c(v);var b=k(v,2),p=d(b,!0);c(b);var n=k(b,2);{var S=x=>{var L=ke(),C=d(L);c(L),D((y,E)=>W(C,`${y??""} / ${E??""}`),[()=>a(t.currentTime),()=>a(t.duration)]),P(x,L)};F(n,x=>{e()&&x(S)})}c(u),D(()=>{W(f,t.song.title),W(p,t.song.artist)}),P(r,u)};F(m,r=>{s()==="mini"?r(g):r(w,-1)})}P(i,l),it()}var Pe=T('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),Ce=T('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),Se=T("<!> <!> <!>",1),Te=T("<div><!></div>");function zt(i,t){et(t,!0);const e=$(t,"size",3,"mini"),s=$(t,"showControls",3,!1),a=$(t,"showPlaylist",3,!1);var l=Te(),m=d(l);{var g=r=>{var u=Pe(),v=tt(u);yt(v,{get cover(){return t.song.cover},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"mini",interactive:!0,get onclick(){return t.onCoverClick}});var f=k(v,2),b=d(f);_t(b,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},size:"mini"}),c(f);var p=k(f,2),n=d(p),S=d(n);H(S,{icon:"material-symbols:visibility-off",class:"text-lg"}),c(n);var x=k(n,2),L=d(x);H(L,{icon:"material-symbols:expand-less",class:"text-lg"}),c(x),c(p),D((C,y)=>{B(f,"aria-label",C),B(n,"title",y)},[()=>Q(J.musicPlayerExpand),()=>Q(J.musicPlayerHide)]),z("click",f,function(...C){t.onInfoClick?.apply(this,C)}),z("keydown",f,C=>{(C.key==="Enter"||C.key===" ")&&(C.preventDefault(),t.onInfoClick?.())}),z("click",n,C=>{C.stopPropagation(),t.onHideClick?.()}),z("click",x,C=>{C.stopPropagation(),t.onExpandClick?.()}),P(r,u)},w=r=>{var u=Se(),v=tt(u);yt(v,{get cover(){return t.song.cover},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"expanded"});var f=k(v,2);_t(f,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},showTime:!0,size:"expanded"});var b=k(f,2);{var p=n=>{var S=Ce(),x=d(S),L=d(x);H(L,{icon:"material-symbols:visibility-off",class:"text-lg"}),c(x);var C=k(x,2);let y;var E=d(C);H(E,{icon:"material-symbols:queue-music",class:"text-lg"}),c(C),c(S),D((I,G)=>{B(x,"title",I),y=A(C,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,y,{"text-[var(--primary)]":a()}),B(C,"title",G)},[()=>Q(J.musicPlayerHide),()=>Q(J.musicPlayerPlaylist)]),z("click",x,function(...I){t.onHideClick?.apply(this,I)}),z("click",C,function(...I){t.onPlaylistClick?.apply(this,I)}),P(n,S)};F(b,n=>{s()&&n(p)})}P(r,u)};F(m,r=>{e()==="mini"?r(g):r(w,-1)})}c(l),D(()=>A(l,1,Bt(e()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),P(i,l),it()}Y(["click","keydown"]);var Ee=T("<div><!></div>");function Me(i,t){var e=Ee();let s;var a=d(e);zt(a,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"mini",get onCoverClick(){return t.onCoverClick},get onInfoClick(){return t.onInfoClick},get onHideClick(){return t.onHideClick},get onExpandClick(){return t.onExpandClick}}),c(e),D(()=>s=A(e,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-[17.5rem] svelte-g9ac72",null,s,{"mini-enter":!t.isHidden,"mini-leave":t.isHidden,"pointer-events-none":t.isHidden})),P(i,e)}var Le=T("<button><!></button>"),Ie=T("<button><!></button>");function Pt(i,t){const e=$(t,"repeatMode",3,0),s=$(t,"disabled",3,!1);var a=ot(),l=tt(a);{var m=w=>{var r=Le();let u;var v=d(r);H(v,{icon:"material-symbols:shuffle",class:"text-lg"}),c(r),D(()=>{u=A(r,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":t.isActive,"btn-plain":!t.isActive}),r.disabled=s()}),z("click",r,function(...f){t.onclick?.apply(this,f)}),P(w,r)},g=w=>{var r=Ie();let u;var v=d(r);{var f=n=>{H(n,{icon:"material-symbols:repeat-one",class:"text-lg"})},b=n=>{H(n,{icon:"material-symbols:repeat",class:"text-lg"})},p=n=>{H(n,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};F(v,n=>{e()===1?n(f):e()===2?n(b,1):n(p,-1)})}c(r),D(()=>u=A(r,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":t.isActive,"btn-plain":!t.isActive})),z("click",r,function(...n){t.onclick?.apply(this,n)}),P(w,r)};F(l,w=>{t.mode==="shuffle"?w(m):w(g,-1)})}P(i,a)}Y(["click"]);var ze=T('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function De(i,t){var e=ze(),s=d(e);Pt(s,{mode:"shuffle",get isActive(){return t.isShuffled},get onclick(){return t.onShuffleClick}});var a=k(s,2);ae(a,{get onclick(){return t.onPrevClick},disabled:!1});var l=k(a,2);oe(l,{get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},get onclick(){return t.onPlayClick}});var m=k(l,2);le(m,{get onclick(){return t.onNextClick},disabled:!1});var g=k(m,2);{let w=gt(()=>t.isRepeating>0);Pt(g,{mode:"repeat",get isActive(){return o(w)},get repeatMode(){return t.isRepeating},get onclick(){return t.onRepeatClick}})}c(e),P(i,e)}var Re=T('<div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div>');function He(i,t){et(t,!0);var e=Re(),s=d(e);c(e),D(a=>{B(e,"aria-label",a),B(e,"aria-valuenow",t.duration>0?t.currentTime/t.duration*100:0),Tt(s,`width: ${t.duration>0?t.currentTime/t.duration*100:0}%`)},[()=>Q(J.musicPlayerProgress)]),z("click",e,function(...a){t.onclick?.apply(this,a)}),z("keydown",e,function(...a){t.onkeydown?.apply(this,a)}),P(i,e),it()}Y(["click","keydown"]);var Ve=T('<div class="progress-section mb-4"><!></div>');function Be(i,t){var e=Ve(),s=d(e);He(s,{get currentTime(){return t.currentTime},get duration(){return t.duration},get onclick(){return t.onProgressClick},get onkeydown(){return t.onProgressKeyDown}}),c(e),P(i,e)}var Fe=T('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function Ae(i,t){var e=Fe(),s=d(e);{var a=g=>{H(g,{icon:"material-symbols:volume-off",class:"text-lg"})},l=g=>{H(g,{icon:"material-symbols:volume-down",class:"text-lg"})},m=g=>{H(g,{icon:"material-symbols:volume-up",class:"text-lg"})};F(s,g=>{t.isMuted||t.volume===0?g(a):t.volume<.5?g(l,1):g(m,-1)})}c(e),z("click",e,function(...g){t.onclick?.apply(this,g)}),P(i,e)}Y(["click"]);var Ne=T('<div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function Ke(i,t){var e=Ne(),s=d(e);let a;c(e),ue(e,l=>t.volumeBarRef?.(l)),D(()=>{B(e,"aria-label",t.ariaLabel),B(e,"aria-valuenow",t.volume*100),a=A(s,1,"h-full bg-[var(--primary)] rounded-full transition-all",null,a,{"duration-100":!t.isVolumeDragging,"duration-0":t.isVolumeDragging}),Tt(s,`width: ${t.volume*100}%`)}),z("pointerdown",e,function(...l){t.onpointerdown?.apply(this,l)}),z("keydown",e,function(...l){t.onkeydown?.apply(this,l)}),P(i,e)}Y(["pointerdown","keydown"]);var je=T('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function Xe(i,t){var e=je(),s=d(e);Ae(s,{get volume(){return t.volume},get isMuted(){return t.isMuted},get onclick(){return t.onVolumeButtonClick}});var a=k(s,2);{let m=gt(()=>t.isMuted?0:t.volume);Ke(a,{get volume(){return o(m)},get isVolumeDragging(){return t.isVolumeDragging},get volumeBarRef(){return t.volumeBarRef},get onpointerdown(){return t.onSliderPointerDown},get onkeydown(){return t.onSliderKeyDown},get ariaLabel(){return t.ariaLabel}})}var l=k(a,2);se(l,t,"default",{}),c(e),P(i,e)}var We=T('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),Oe=T("<div><!> <!> <!> <!></div>");function qe(i,t){et(t,!0);var e=Oe();let s;var a=d(e);zt(a,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return t.showPlaylist},get onHideClick(){return t.onHideClick},get onPlaylistClick(){return t.onPlaylistClick}});var l=k(a,2);Be(l,{get currentTime(){return t.currentTime},get duration(){return t.duration},get onProgressClick(){return t.onProgressClick},get onProgressKeyDown(){return t.onProgressKeyDown}});var m=k(l,2);De(m,{get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},get isShuffled(){return t.isShuffled},get isRepeating(){return t.isRepeating},get onPlayClick(){return t.onPlayClick},get onPrevClick(){return t.onPrevClick},get onNextClick(){return t.onNextClick},get onShuffleClick(){return t.onShuffleClick},get onRepeatClick(){return t.onRepeatClick}});var g=k(m,2);{let w=gt(()=>Q(J.musicPlayerVolume));Xe(g,{get volume(){return t.volume},get isMuted(){return t.isMuted},get isVolumeDragging(){return t.isVolumeDragging},get volumeBarRef(){return t.volumeBarRef},get onVolumeButtonClick(){return t.onVolumeButtonClick},get onSliderPointerDown(){return t.onSliderPointerDown},get onSliderKeyDown(){return t.onSliderKeyDown},get ariaLabel(){return o(w)},children:(r,u)=>{var v=We(),f=d(v);H(f,{icon:"material-symbols:expand-more",class:"text-lg"}),c(v),D(b=>B(v,"title",b),[()=>Q(J.musicPlayerCollapse)]),z("click",v,function(...b){t.onCollapseClick?.apply(this,b)}),P(r,v)},$$slots:{default:!0}})}c(e),D(()=>s=A(e,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,s,{"opacity-0":t.isHidden,"scale-95":t.isHidden,"pointer-events-none":t.isHidden})),P(i,e),it()}Y(["click"]);var Ue=T('<span class="text-sm text-[var(--content-meta)]"> </span>'),Ye=T('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function Ge(i,t){et(t,!0);const e=$(t,"lazy",3,!0);function s(y){return y.startsWith("http://")||y.startsWith("https://")||y.startsWith("/")?y:`/${y}`}var a=Ye();let l;var m=d(a),g=d(m);{var w=y=>{H(y,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},r=y=>{H(y,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},u=y=>{var E=Ue(),I=d(E,!0);c(E),D(()=>W(I,t.index+1)),P(y,E)};F(g,y=>{t.isCurrent&&t.isPlaying?y(w):t.isCurrent?y(r,1):y(u,-1)})}c(m);var v=k(m,2),f=d(v);c(v);var b=k(v,2),p=d(b);let n;var S=d(p,!0);c(p);var x=k(p,2);let L;var C=d(x,!0);c(x),c(b),c(a),D(y=>{l=A(a,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,l,{"bg-[var(--btn-plain-bg)]":t.isCurrent,"text-[var(--primary)]":t.isCurrent}),B(a,"aria-label",`播放 ${t.song.title??""} - ${t.song.artist??""}`),B(f,"src",y),B(f,"alt",t.song.title),B(f,"loading",e()?"lazy":"eager"),n=A(p,1,"font-medium truncate",null,n,{"text-[var(--primary)]":t.isCurrent,"text-90":!t.isCurrent}),W(S,t.song.title),L=A(x,1,"text-sm text-[var(--content-meta)] truncate",null,L,{"text-[var(--primary)]":t.isCurrent}),W(C,t.song.artist)},[()=>s(t.song.cover)]),z("click",a,function(...y){t.onclick?.apply(this,y)}),z("keydown",a,y=>{(y.key==="Enter"||y.key===" ")&&(y.preventDefault(),t.onclick())}),P(i,a),it()}Y(["click","keydown"]);var Ze=T('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Je(i,t){et(t,!0);var e=ot(),s=tt(e);{var a=l=>{var m=Ze(),g=d(m),w=d(g),r=d(w,!0);c(w);var u=k(w,2),v=d(u);H(v,{icon:"material-symbols:close",class:"text-lg"}),c(u),c(g);var f=k(g,2);ce(f,21,()=>t.playlist,de,(b,p,n)=>{{let S=gt(()=>n===t.currentIndex);Ge(b,{get song(){return o(p)},index:n,get isCurrent(){return o(S)},get isPlaying(){return t.isPlaying},onclick:()=>t.onPlaySong(n),lazy:n!==0})}}),c(f),c(m),D(b=>W(r,b),[()=>Q(J.musicPlayerPlaylist)]),z("click",u,function(...b){t.onClose?.apply(this,b)}),Lt(3,m,()=>he,()=>({duration:300,axis:"y"})),P(l,m)};F(s,l=>{t.show&&l(a)})}P(i,e),it()}Y(["click"]);var Qe=T('<div class="fixed bottom-20 right-4 z-[60] max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),$e=T('<div class="music-player-fab-anchor fixed z-[55]"><div class="music-player-fab-shell"><!></div></div>'),ti=T("<div><div><!></div> <!> <!> <!></div>"),ei=T(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (max-width: 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (max-width: 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function fi(i,t){et(t,!1);let e=Gt(_.getState());const s=ft.showFloatingPlayer,l=(ft.floatingEntryMode??"default")==="fab",m=s&&ft.enable;let g;function w(){_.toggle()}function r(){_.prev()}function u(){_.next()}function v(){_.toggleShuffle()}function f(){_.toggleRepeat()}function b(h){_.playIndex(h)}function p(h){const R=h.currentTarget;if(!R)return;const O=R.getBoundingClientRect(),j=(h.clientX-O.left)/O.width;_.setProgress(j)}function n(h){(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),_.setProgress(.5))}function S(){_.toggleMute()}function x(h){return h instanceof HTMLElement?h.isContentEditable||h instanceof HTMLInputElement||h instanceof HTMLTextAreaElement||h instanceof HTMLSelectElement:!1}function L(){_.toggleMute()}function C(h){const R=h.currentTarget;if(!R)return;const O=M=>{const N=R.getBoundingClientRect();if(N.width<=0)return;const K=Math.max(0,Math.min(1,(M-N.left)/N.width));_.setVolume(K)};O(h.clientX);const j=h.pointerId;R.setPointerCapture(j);const st=M=>{M.pointerId===j&&O(M.clientX)},ut=()=>{R.removeEventListener("pointermove",st),R.removeEventListener("pointerup",ct),R.removeEventListener("pointercancel",V),R.hasPointerCapture(j)&&R.releasePointerCapture(j)},ct=M=>{M.pointerId===j&&(O(M.clientX),ut())},V=M=>{M.pointerId===j&&ut()};R.addEventListener("pointermove",st),R.addEventListener("pointerup",ct),R.addEventListener("pointercancel",V)}function y(h){if(!x(h.target)){if(h.key==="ArrowLeft"||h.key==="ArrowDown"){h.preventDefault(),_.setVolume(o(e).volume-.05);return}if(h.key==="ArrowRight"||h.key==="ArrowUp"){h.preventDefault(),_.setVolume(o(e).volume+.05);return}(h.key==="Enter"||h.key===" "||h.key==="m"||h.key==="M")&&(h.preventDefault(),S())}}function E(){_.togglePlaylist()}function I(){_.toggleExpanded()}function G(){_.toggleHidden()}function lt(){_.hideError()}function rt(h){}function Dt(){return _.canSkip()}Ct(()=>{g=_.subscribe(h=>{bt(e,h)}),_.initialize()}),St(()=>{g&&g(),_.destroy()}),Ft();var xt=ot();Zt("keydown",Jt,y);var Rt=tt(xt);{var Ht=h=>{var R=ei(),O=tt(R);{var j=V=>{var M=Qe(),N=d(M),K=d(N);H(K,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var q=k(K,2),Z=d(q,!0);c(q);var X=k(q,2),nt=d(X);H(nt,{icon:"material-symbols:close",class:"text-lg"}),c(X),c(N),c(M),D(()=>W(Z,o(e).errorMessage)),z("click",X,lt),P(V,M)};F(O,V=>{o(e).showError&&V(j)})}var st=k(O,2);{var ut=V=>{var M=ot(),N=tt(M);{var K=q=>{var Z=$e(),X=d(Z),nt=d(X);pe(nt,{}),c(X),c(Z),Lt(3,X,()=>ye,()=>({y:16,duration:280,opacity:.12,easing:be})),P(q,Z)};F(N,q=>{o(e).isExpanded&&q(K)})}P(V,M)},ct=V=>{var M=ti();let N;var K=d(M),q=d(K);yt(q,{get cover(){return o(e).currentSong.cover},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading},size:"orb",onclick:G}),c(K);var Z=k(K,2);{let vt=mt(()=>o(e).isExpanded||o(e).isHidden);Me(Z,{get song(){return o(e).currentSong},get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading},get isHidden(){return o(vt)},onCoverClick:w,onInfoClick:I,onHideClick:G,onExpandClick:I})}var X=k(Z,2);{let vt=mt(Dt),Vt=mt(()=>!o(e).isExpanded);qe(X,{get song(){return o(e).currentSong},get currentTime(){return o(e).currentTime},get duration(){return o(e).duration},get isPlaying(){return o(e).isPlaying},get isLoading(){return o(e).isLoading},get isShuffled(){return o(e).isShuffled},get isRepeating(){return o(e).isRepeating},get showPlaylist(){return o(e).showPlaylist},get canSkip(){return o(vt)},get volume(){return o(e).volume},get isMuted(){return o(e).isMuted},isVolumeDragging:!1,get isHidden(){return o(Vt)},volumeBarRef:rt,onPlayClick:w,onPrevClick:r,onNextClick:()=>u(),onShuffleClick:v,onRepeatClick:f,onProgressClick:p,onProgressKeyDown:n,onVolumeButtonClick:L,onSliderPointerDown:C,onSliderKeyDown:y,onHideClick:G,onPlaylistClick:E,onCollapseClick:I})}var nt=k(X,2);Je(nt,{get playlist(){return o(e).playlist},get currentIndex(){return o(e).currentIndex},get isPlaying(){return o(e).isPlaying},get show(){return o(e).showPlaylist},onClose:E,onPlaySong:b}),c(M),D(()=>{N=A(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,N,{expanded:o(e).isExpanded,"hidden-mode":o(e).isHidden}),A(K,1,`orb-player-container ${o(e).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),P(V,M)};F(st,V=>{l?V(ut):V(ct,-1)})}Qt(2),P(h,R)};F(Rt,h=>{m&&h(Ht)})}P(i,xt),it()}Y(["click"]);export{fi as default};
