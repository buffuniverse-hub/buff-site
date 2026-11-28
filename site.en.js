(function(){if(/^\/admin/.test(location.pathname)||document.getElementById('pl-all'))return;var s=document.createElement('style');s.id='pl-all';s.textContent="@font-face{font-family:'Paperlogy';src:url(/assets/paperlogy-400.woff2) format('woff2');font-weight:400;font-display:swap;unicode-range:U+0000-024F,U+2000-206F,U+20A0-20CF}@font-face{font-family:'Paperlogy';src:url(/assets/paperlogy-500.woff2) format('woff2');font-weight:500;font-display:swap;unicode-range:U+0000-024F,U+2000-206F,U+20A0-20CF}@font-face{font-family:'Paperlogy';src:url(/assets/paperlogy-700.woff2) format('woff2');font-weight:700;font-display:swap;unicode-range:U+0000-024F,U+2000-206F,U+20A0-20CF}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Thin.woff2) format('woff2');font-weight:100;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-ExtraLight.woff2) format('woff2');font-weight:200;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Light.woff2) format('woff2');font-weight:300;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Regular.woff2) format('woff2'),url(/assets/68732d2c1892b6a9ec57d9dd4142c5a6.woff2) format('woff2');font-weight:400;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Medium.woff2) format('woff2'),url(/assets/eb2e8ae66e3f3493094ce21b4dd93845.woff2) format('woff2');font-weight:500;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-SemiBold.woff2) format('woff2'),url(/assets/e8b5cd933e203d0f2bf3803089a3ad5d.woff2) format('woff2');font-weight:600;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Bold.woff2) format('woff2'),url(/assets/a62b30b0b1071ca3641460274423ca85.woff2) format('woff2');font-weight:700;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-ExtraBold.woff2) format('woff2'),url(/assets/e86c3ec1a10c4de088901f0e5198d28d.woff2) format('woff2');font-weight:800;font-display:swap}@font-face{font-family:'SuitKo';src:url(https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_suit@1.0/SUIT-Heavy.woff2) format('woff2');font-weight:900;font-display:swap}body,body *:not([style*=Jost]):not([style*=Jost] *){font-family:Paperlogy,SuitKo,Paperozi,sans-serif!important}";document.head.appendChild(s)})();
(function(){
var __M={};function getData(t,q){var k=t+'?'+q;return __M[k]||(__M[k]=window.sbGet(t,q).catch(function(e){delete __M[k];throw e}))}
var $=function(s,r){return(r||document).querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var br=function(s){return esc(s).replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:#0066CC;text-decoration:underline;word-break:break-all">$1</a>').replace(/\n/g,'<br> ')};
function tagOf(w){var c=Array.isArray(w.categories)&&w.categories.length?w.categories:[w.category],n={marketing:'Marketing',branding:'Branding',photo:'Photo',video:'Video'};return ['marketing','branding','photo','video'].filter(function(k){return c.indexOf(k)>-1}).map(function(k){return n[k]}).join(' · ')||(CAT[w.category]||[''])[0]}
var CAT={marketing:['Marketing','/en/Works?cat=marketing'],photo:['Photo','/en/Works?cat=photo'],video:['Video','/en/Works?cat=video'],branding:['Branding','/en/Works?cat=branding']};
function ytId(u){var m=String(u||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);return m?m[1]:''}
/* 썸네일이 없으면 첫 번째 유튜브 영상의 썸네일을 자동으로 사용 */
function thumbOf(w){if(w&&w.thumbnail_url)return w.thumbnail_url;var v=(w&&w.videos)||[];for(var k=0;k<v.length;k++){var id=ytId(v[k]&&(v[k].url||v[k]));if(id)return 'https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg'}return ''}
function ytFix(im){if(/ytimg\.com\/vi\/.+\/maxresdefault/.test(im.src)&&im.naturalWidth&&im.naturalWidth<=120)im.src=im.src.replace('maxresdefault','hqdefault')}
document.addEventListener('load',function(e){var im=e.target;if(im&&im.tagName==='IMG')ytFix(im)},true);
document.addEventListener('error',function(e){var im=e.target;if(im&&im.tagName==='IMG'&&/maxresdefault/.test(im.src))im.src=im.src.replace('maxresdefault','hqdefault')},true);

function tz(w){var v=+w.thumb_zoom;return v>=100&&v<=400?v:100}
function tx(w){var v=+w.thumb_x;return v>=0&&v<=100&&w.thumb_x!=null?v:50}
function ty(w){var v=+w.thumb_y;return v>=0&&v<=100&&w.thumb_y!=null?v:50}
function wYear(w){var m=String(w.work_year||'').match(/20\d\d/)||String(w.title||'').match(/20\d\d/);return m?m[0]:''}
function wHref(w){return w&&w.slug?'work/'+w.slug:'work?id='+(w&&w.id)}
function nHref(n){return 'news-view?'+(n&&n.slug?n.slug:'id='+(n&&n.id))}
function qKey(){var pm=location.pathname.match(/\/work\/([a-z0-9-]+?)(?:\.html)?\/?$/);if(pm)return {f:'slug',v:pm[1]};var q=location.search.replace(/^\?/,''),id=new URLSearchParams(q).get('id');if(id)return {f:'id',v:id};var k=q.split('&')[0];return k&&k.indexOf('=')<0&&/^[a-z0-9-]+$/.test(k)?{f:'slug',v:k}:null}
/* 주소창을 /work/<slug> 형태로 정리: 이 주소를 복사해 메신저로 보내면 작품 제목·썸네일 카드가 만들어짐 */
function toSlugUrl(r){try{if(r&&r.slug&&/\/work(\.html)?$/.test(location.pathname))history.replaceState(null,'',location.pathname.replace(/\.html$/,'')+'/'+r.slug+location.hash)}catch(e){}}
function wsCss(){if(document.getElementById('ws-css'))return;var s=document.createElement('style');s.id='ws-css';s.textContent=".plf,.plf *{font-family:Paperlogy,SuitKo,Paperozi,sans-serif!important}.wl{display:grid;grid-template-columns:220px minmax(0,1fr);gap:48px;align-items:start}.ws{position:sticky;top:76px;max-height:calc(100vh - 92px);overflow:auto;scrollbar-width:none}.ws::-webkit-scrollbar{display:none}.wsh,.wscrim,.wfb{display:none}.wg{margin:0 0 20px}.wg h3{margin:0 0 6px;padding:0 10px;font-size:13px;font-weight:600;line-height:1.4;color:#6E6E73}.wo{display:flex;align-items:center;justify-content:space-between;width:100%;height:38px;padding:0 12px;border:1px solid #E1E1E6;border-radius:10px;background:#fff;font-size:13px;font-weight:400;color:#1D1D1F;cursor:pointer;text-align:left;transition:background .15s,border-color .15s}.wo+.wo{margin-top:6px}.wo:hover{background:#F5F5F7;border-color:#C7C7CC}.wo .c{font-size:13px;color:#8E8E93;font-variant-numeric:tabular-nums}.wo[aria-pressed=true]{background:#000;border-color:#000;color:#fff;font-weight:700}.wo[aria-pressed=true] .c{color:#fff}.wo.big{letter-spacing:.03em}.wo:focus-visible,.wsl select:focus-visible,.wrs:focus-visible{outline:2px solid #0A84FF;outline-offset:1px}.wsl{display:grid;grid-template-columns:minmax(0,1fr);gap:10px;padding:0 2px}.wsl label{display:block;font-size:13px;font-weight:600;color:#6E6E73}.wsl select{display:block;width:100%;height:38px;margin-top:6px;padding:0 30px 0 12px;font-size:13px;font-weight:400;color:#1D1D1F;background:#fff url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27%3E%3Cpath d=%27M1 1.5l5 5 5-5%27 fill=%27none%27 stroke=%27%231D1D1F%27 stroke-width=%271.5%27/%3E%3C/svg%3E\") no-repeat right 12px center;border:1px solid #D2D2D7;border-radius:8px;cursor:pointer;-webkit-appearance:none;appearance:none}.wsl select:hover{border-color:#1D1D1F}.wsl select.on{background-color:#000;color:#fff;font-weight:700;border-color:#000;background-image:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%278%27%3E%3Cpath d=%27M1 1.5l5 5 5-5%27 fill=%27none%27 stroke=%27%23fff%27 stroke-width=%271.5%27/%3E%3C/svg%3E\")}.wsl select option{color:#1D1D1F;background:#fff;font-weight:400}.wtop{display:flex;align-items:center;justify-content:space-between;height:28px;margin:0 0 8px;padding:0 10px}.wtop b{font-size:13px;font-weight:700}.wrs{border:0;background:none;font-size:13px;color:#6E6E73;cursor:pointer;padding:4px 0;visibility:hidden}.wrs.on{visibility:visible}.wrs:hover{color:#1D1D1F;text-decoration:underline;text-underline-offset:3px}.wt{display:none}.wtt{font-size:18px;font-weight:700;letter-spacing:.06em}.wcnt{font-size:13px;color:#6E6E73}.wc{display:flex;gap:8px;flex-wrap:wrap}.wc:not(:empty){margin:0 0 20px}.wchip{border:1px solid #E5E5EA;background:#F5F5F7;border-radius:99px;font-size:13px;padding:5px 12px;cursor:pointer;color:#1D1D1F}.wchip::after{content:' ×';color:#6E6E73}.wl #works-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:36px 20px}.wl #works-grid>a{text-align:left!important;gap:4px!important}.wl #works-grid>a>img,.wl #works-grid>a>div{border-radius:12px!important;margin-bottom:10px!important;aspect-ratio:16/9!important}.wl #works-grid>a>span:nth-of-type(1){font-size:17px!important;line-height:1.35!important}.wl #works-grid>a>span:nth-of-type(n+2){font-size:13.5px!important}.wl #works-grid>a:has(.wm)>span:nth-of-type(2){display:none!important}.wm{display:none}.wl .wm{display:block!important}.wsec{grid-column:1/-1;display:flex;align-items:baseline;gap:10px;margin:8px 0 -8px}.wsec:first-child{margin-top:0}.wsec h2{margin:0;font-size:18px;font-weight:700;line-height:1;letter-spacing:.06em;color:#1D1D1F}.wsec .wn{font-size:13px;color:#6E6E73}.wsec::after{content:'';flex:1;height:1px;background:#E5E5EA;transform:translateY(-3px)}.wsec,.wc{display:none!important}@media(max-width:1000px){.wl #works-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:820px){.wl{display:block}.wfb{display:inline-flex;align-items:center;gap:8px;height:40px;border:1px solid #D2D2D7;background:#fff;border-radius:99px;padding:0 16px;font-size:14px;font-weight:700;line-height:1;cursor:pointer;color:#1D1D1F}.wfb:before{content:'';width:16px;height:16px;background:url(\"data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%231D1D1F%27 stroke-width=%272%27 stroke-linecap=%27round%27%3E%3Cpath d=%27M4 6h16M7 12h10M10 18h4%27/%3E%3C/svg%3E\") center/contain no-repeat}.wfb i{font-style:normal;background:#1D1D1F;color:#fff;border-radius:99px;font-size:11px;padding:2px 7px}.wt{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 18px;min-height:0}.wtt{display:none}.wt .wcnt{font-size:14px;color:#6E6E73;font-variant-numeric:tabular-nums}.ws{position:fixed;left:0;right:0;bottom:0;top:auto;max-height:80vh;overflow:auto;background:#fff;border-radius:20px 20px 0 0;padding:20px 24px 28px;z-index:80;transform:translateY(105%);transition:transform .28s;box-shadow:0 -10px 40px rgba(0,0,0,.18)}.ws.open{transform:none}.ws.open{display:flex;flex-direction:column}.wsh{display:block;order:99;position:sticky;bottom:-28px;margin:8px -24px -28px;padding:12px 24px 20px;background:#fff;border-top:1px solid #E5E5EA}.wtop b{font-size:17px}.wsh button{display:block;width:100%;height:46px;border:0;background:#1D1D1F;color:#fff;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer}.wscrim.open{display:block;position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:79}.wl #works-grid{grid-template-columns:minmax(0,1fr)!important}}@media(min-width:821px){.wl{grid-template-columns:204px minmax(0,1fr);gap:40px}.wpg>section:first-child{position:sticky;top:52px;z-index:20;box-shadow:0 20px 0 #fff}.ws{top:289px;max-height:calc(100vh - 305px)}.ws{box-sizing:border-box;padding:12px 12px;border:1px solid #E5E5EA;border-radius:16px;background:#fff}.wg{margin:0 0 10px}.wg h3{margin:0 0 3px;padding:0 8px;font-size:12px;line-height:1.3}.wo{height:28px;padding:0 10px;font-size:12px;border-radius:8px}.wo+.wo{margin-top:3px}.wo .c{font-size:12px}.wtop{position:absolute;top:11px;right:14px;height:auto;margin:0;padding:0;z-index:1}.wtop b{display:none}.wrs{padding:0}.wtop b,.wrs{font-size:12px}.wsl{gap:6px 8px;padding:0}.wsl label{font-size:12px;line-height:1.3}.wsl select{height:30px;margin-top:3px;padding:0 24px 0 10px;font-size:12px;border-radius:8px}}";document.head.appendChild(s)}
var SPN={lacrosse:'Lacrosse',basketball:'Basketball',tabletennis:'Table Tennis',futsal:'Futsal',baseball:'Baseball',football:'Football',flagfootball:'Flag Football',rugby:'Rugby',other:'Other'},CTN={performance:'Performance',event:'Event',product:'Product',other:'Other'};function metaOf(w){var a=(w.sports||[]).map(function(k){return SPN[k]||k});if(!a.length&&w.culture_type)a=[CTN[w.culture_type]||w.culture_type];var y=wYear(w);return a.concat(y?[y]:[]).join(' · ')}
function worksHtml(r,cat){return r.map(workCard).join('')}
function workCard(w){
  return '<a href="/en/'+esc(wHref(w))+'" data-cat="'+esc((w.categories&&w.categories.length?w.categories:[w.category]).join(' '))+'" data-field="'+esc(w.field||'sports')+'" data-ctype="'+esc(w.culture_type||'')+'" data-sport="'+esc((w.sports||[]).join(' '))+'" data-year="'+esc(wYear(w))+'" data-mem="'+esc((w.members||[]).join('|'))+'" style="flex: 1 1 480px; min-width: 0; text-decoration: none; display: flex; flex-direction: column; align-items: stretch; text-align: center; gap: 8px; cursor: pointer">'
  +'<div style="position: relative; overflow: hidden; border-radius: 18px; background: #F5F5F7; margin-bottom: 16px; aspect-ratio: 16 / 9; width: 100%"><img draggable="false" src="'+esc(thumbOf(w))+'" alt="'+esc(w.title)+'" style="pointer-events: none; display: block; width: 100%; height: 100%; object-fit: cover; object-position: '+tx(w)+'% '+ty(w)+'%; transform: scale('+tz(w)/100+'); transform-origin: '+tx(w)+'% '+ty(w)+'%"></div>'
  +'<span title="'+esc(w.title)+'" style="pointer-events: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; font-size: 24px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: #1D1D1F">'+esc(w.title)+'</span>'
  +'<span style="pointer-events: none; font-size: 17px; font-weight: 400; line-height: 1.47; color: #6E6E73">'+esc(tagOf(w))+'</span>'
  +'<span class="wm" style="display: none; pointer-events: none">'+esc(metaOf(w))+'</span></a>';
}
function newsCard(n){
  var d=n.published_at?String(n.published_at).slice(0,10).replace(/-/g,'.'):'';
  return '<a class="nc" href="/en/'+esc(nHref(n))+'">'
  +'<div class="nc-img">'+(n.thumbnail_url?'<img src="'+esc(n.thumbnail_url)+'" alt="'+esc(n.title_line1)+'" draggable="false" loading="lazy" style="object-position: '+tx(n)+'% '+ty(n)+'%; transform-origin: '+tx(n)+'% '+ty(n)+'%; scale: '+tz(n)/100+'">':'')+'</div>'
  +'<span class="nc-meta">'+esc(n.category)+(d?'<i></i>'+d:'')+'</span>'
  +'<b class="nc-t">'+esc(n.title_line1)+(n.title_line2?'<br>  '+esc(n.title_line2):'')+'</b>'
  +(n.summary?'<span class="nc-s">'+esc(n.summary)+'</span>':'')
  +'</a>';
}
function renderNews(box,rows){
  if(!document.getElementById('nc-css')){var st=document.createElement('style');st.id='nc-css';st.textContent='[data-sb="news-list"]{max-width:1200px!important}.nf{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 40px}.nf button{font:inherit;font-size:16px;font-weight:600;padding:10px 22px;border-radius:999px;border:1px solid #D2D2D7;background:#fff;color:#1D1D1F;cursor:pointer;transition:background-color .2s,color .2s,border-color .2s}.nf button:hover{border-color:#1D1D1F}.nf button[aria-pressed=true]{background:#1D1D1F;color:#fff;border-color:#1D1D1F}.ng{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:48px 24px}.nc{display:flex;flex-direction:column;gap:10px;text-decoration:none;color:#1D1D1F}.nc-img{aspect-ratio:16/9;border-radius:14px;background:#F5F5F7;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,.06);margin-bottom:6px}.nc-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s}.nc:hover .nc-img img{transform:scale(1.04)}.nc-meta{font-size:14px;font-weight:600;color:#6E6E73;display:flex;align-items:center;gap:8px}.nc-meta i{width:3px;height:3px;border-radius:50%;background:#A1A1A6}.nc-t{font-size:21px;font-weight:700;line-height:1.4;letter-spacing:-.01em;word-break:normal;text-wrap:balance;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.nc-s{font-size:14px;line-height:1.6;color:#6E6E73;word-break:normal;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.np{display:flex;justify-content:center;align-items:center;gap:6px;margin:72px 0 0}.np button{font:inherit;font-size:15px;font-weight:600;min-width:38px;height:38px;border-radius:50%;border:0;background:transparent;color:#6E6E73;cursor:pointer}.np button:hover{color:#1D1D1F}.np button[aria-current=true]{background:#1D1D1F;color:#fff}.np button:disabled{opacity:.3;cursor:default}@media(max-width:1000px){.ng{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.ng{grid-template-columns:1fr;gap:36px}.nf button{padding:9px 18px;font-size:15px}.nc-t{font-size:16.5px;letter-spacing:-.025em;-webkit-line-clamp:unset;display:block}.nc-t br.mb{display:inline}.nc-s{font-size:13px}}';document.head.appendChild(st)}
  if(!rows.length){box.innerHTML='<p style="text-align:center;color:#6E6E73;font-size:19px;padding:80px 0">No news yet.</p>';return}
  var cats=[];rows.forEach(function(r){if(r.category&&cats.indexOf(r.category)<0)cats.push(r.category)});
  var cur='all',pg=1,PER=9;
  box.innerHTML=(cats.length>1?'<div class="nf"></div>':'')+'<div class="ng"></div><div class="np"></div>';
  var bar=box.querySelector('.nf'),grid=box.querySelector('.ng'),pn=box.querySelector('.np');
  function draw(){
    var list=cur==='all'?rows:rows.filter(function(r){return r.category===cur});
    var pages=Math.max(1,Math.ceil(list.length/PER));if(pg>pages)pg=pages;
    grid.innerHTML=list.slice((pg-1)*PER,pg*PER).map(newsCard).join('');
    if(bar)bar.innerHTML=['all'].concat(cats).map(function(c){return '<button type="button" data-c="'+esc(c)+'" aria-pressed="'+(c===cur)+'">'+(c==='all'?'All':esc(c))+'</button>'}).join('');
    var h='';if(pages>1){h+='<button type="button" data-p="'+(pg-1)+'"'+(pg<=1?' disabled':'')+' aria-label="Previous">‹</button>';for(var i=1;i<=pages;i++)h+='<button type="button" data-p="'+i+'"'+(i===pg?' aria-current="true"':'')+'>'+i+'</button>';h+='<button type="button" data-p="'+(pg+1)+'"'+(pg>=pages?' disabled':'')+' aria-label="Next">›</button>'}
    pn.innerHTML=h;
  }
  box.onclick=function(e){var b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-c')){cur=b.getAttribute('data-c');pg=1;draw()}else if(b.hasAttribute('data-p')){pg=+b.getAttribute('data-p');draw();box.scrollIntoView({behavior:'smooth',block:'start'})}};
  draw();
}
function clientItem(c,clone){
  var img='<img src="'+esc(c.logo_url)+'" alt="'+esc(c.name)+'" style="display: block; width: auto; max-width: '+(/포카리|pocari/i.test(c.name||'')?'44%':'62%')+'; max-height: '+(/포카리|pocari/i.test(c.name||'')?'40%':'56%')+'; object-fit: contain">';
  return '<a class="client-item" href="'+esc(c.url||'#clients')+'"'+(c.url?' target="_blank" rel="noopener"':'')+' aria-label="'+esc(c.name)+'"'+(clone?' aria-hidden="true" tabindex="-1"':'')+' style="flex: 0 0 auto; width: 240px; aspect-ratio: 4 / 3; background: #FFFFFF; border-radius: 18px; display: flex; align-items: center; justify-content: center">'+img+'</a>';
}
function positionCard(p){
  return '<div style="flex: 1 1 300px; max-width: 380px; min-width: 0; box-sizing: border-box; padding: 32px 28px; border-radius: 18px; background: #F5F5F7; text-align: left"><div style="font-size: 24px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: #1D1D1F">'+esc(p.title)+'</div><div style="margin-top: 10px; font-size: 17px; line-height: 1.5; color: #424245; word-break: keep-all">'+esc(p.description)+'</div></div>';
}
function set(sel,html){var e=$(sel);if(e)e.innerHTML=html}

function bindLists(){
  var jobs=[];
  var wl=$('[data-sb="works-list"]');
  if(wl){var cat=wl.getAttribute('data-cat');
    jobs.push(getData('works','select=*&published=eq.true'+(cat==='all'?'':'&category=eq.'+cat)+'&order=sort_order.asc,created_at.asc').then(function(r){if(r.length)wl.innerHTML=worksHtml(r,cat);if(window.__wfApply)window.__wfApply()}))}
  var wf=$('[data-sb="works-featured"]');
  if(wf)jobs.push(getData('site_settings','select=*&key=eq.home_featured').catch(function(){return[]}).then(function(rows){
    var ids=rows[0]&&rows[0].value?String(rows[0].value).split(',').filter(Boolean):[];
    var q=ids.length?getData('works','select=*&published=eq.true&id=in.('+ids.join(',')+')').then(function(r){return ids.map(function(i){return r.filter(function(w){return w.id===i})[0]}).filter(Boolean)}):getData('works','select=*&published=eq.true&featured=eq.true&order=sort_order.asc,created_at.asc&limit=4');
    return q}).then(function(r){if(r.length)wf.innerHTML=r.map(workCard).join('')}));
  if($('[data-sb="home-lead"]'))jobs.push(getData('site_settings','select=*').then(function(rows){
    var s={};rows.forEach(function(x){s[x.key]=x.value});
    function t(k,sel,html){var e=$(sel);if(e&&s[k])e.innerHTML=html?br(s[k]):esc(s[k])}
    t('home_lead','[data-sb="home-lead"]');t('home_tail','[data-sb="home-tail"]');t('home_text','[data-sb="home-text"]',1);(function(e){if(e&&!e.querySelector('br.mb'))e.innerHTML=e.innerHTML.replace(/(전하고,)\s*/,'$1<br class="mb"> ')})($('[data-sb="home-text"]'));t('home_btn1','[data-sb="home-btn1"]');t('home_btn2','[data-sb="home-btn2"]');t('home_works_title','[data-sb="home-works-title"]');
  }));
  var nl=$('[data-sb="news-list"]');
  if(nl)jobs.push(getData('news','select=*&published=eq.true&order=sort_order.asc,published_at.desc').then(function(r){renderNews(nl,r)}));
  var cl=$('[data-sb="clients"]');
  if(cl)jobs.push(getData('clients','select=*&published=eq.true&order=sort_order.asc').then(function(r){r=r.filter(function(c){return c.logo_url});if(r.length)cl.innerHTML=r.map(function(c){return clientItem(c)}).join('')+r.map(function(c){return clientItem(c,1)}).join('')}));
  var ps=$('[data-sb="positions"]');
  if(ps)jobs.push(getData('career_positions','select=*&is_open=eq.true&order=sort_order.asc').then(function(r){if(r.length)ps.innerHTML=r.map(positionCard).join('')}));
  if($('[data-sb="career-headline"]'))jobs.push(getData('site_settings','select=*').then(function(rows){
    var s={};rows.forEach(function(x){s[x.key]=x.value});
    var h=$('[data-sb="career-headline"]');
    if(s.career_headline){var m=s.career_headline.match(/^BUFF\s*(.*)$/);
      if(m){var img=h.querySelector('img');h.querySelector('span').innerHTML=(img?img.outerHTML:'BUFF')+esc(m[1])}else h.querySelector('span').textContent=s.career_headline}
    if(s.career_subtext)set('[data-sb="career-sub"]',br(s.career_subtext));
    if(s.career_team_note)set('[data-sb="career-note"]',br(s.career_team_note));
    if(s.partner_text)set('[data-sb="partner-text"]',br(s.partner_text));
    if(s.contact_email){var a=$('[data-sb="career-email"]');if(a){a.textContent=s.contact_email;a.href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(s.contact_email)+'&su='+encodeURIComponent('[BUFF 지원] 포트폴리오')}}
  }));
  jobs.forEach(function(j){j.catch(function(e){console.warn('[BUFF]',e)})});
  var reveal=function(){[].forEach.call(document.querySelectorAll('[data-sb]'),function(e){e.classList.add('sb-ready')})};setTimeout(reveal,3000);
  var res=jobs.map(function(j){return j.catch(function(){})});Promise.all(res).then(reveal);
  return res;
}

function pill(t){return '<span style="padding: 8px 14px; border-radius: 999px; background: #F5F5F7; font-size: 15px; font-weight: 500; color: #1D1D1F">#'+esc(t)+'</span>'}

var WK_CSS='.wk-sec{background:#FFFFFF;padding:0 0 96px}.wk-wrap{max-width:1200px;margin:0 auto;padding:0 40px;box-sizing:border-box;display:flex;flex-wrap:wrap;gap:48px;align-items:flex-start}.wk-side{flex:0 0 340px;max-width:100%;min-width:0;display:flex;flex-direction:column;gap:24px;word-break:keep-all}.wk-mwrap{flex:1 1 480px;min-width:0;position:relative}.wk-media{min-width:0;display:flex;flex-direction:column;gap:24px}.wk-media>*{flex:none}.wk-more{display:none}.wk-titlerow{max-width:1200px;margin:0 auto;padding:0 40px 8px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:16px}.wk-pdf{flex:0 0 auto;display:block;line-height:0;transition:transform .15s}.wk-pdf:hover{transform:translateY(-2px)}.wk-h1{flex:0 1 auto;min-width:0;max-width:100%;text-align:center;margin:0;font-size:32px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;color:#1D1D1F;white-space:nowrap;overflow:hidden}@media(max-width:640px){.wk-grid .wk-play span{transform:scale(.6)}.wk-meta{padding-left:20px;padding-right:20px}.wk-top{padding:0 20px 20px;grid-template-columns:1fr auto 1fr}.wk-meta{gap:6px 16px;font-size:13px}.wk-desc{font-size:13.5px}.wk-h1{font-size:24px}.wk-titlerow{padding:0 20px 14px}.wk-h1{font-size:26px}}'
 +'.wk-top{max-width:1200px;margin:0 auto;padding:0 40px 28px;box-sizing:border-box;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.wk-credit{max-width:1120px;margin:56px auto 0;padding:0 40px;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:18px}.wk-credit em{font-style:normal;font-size:13px;color:#6E6E73;letter-spacing:.04em}.wk-people{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 24px}.wk-meta{max-width:1200px;margin:0 auto;padding:4px 40px 0;box-sizing:border-box;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px 24px;font-size:14px;line-height:1.6;color:#1D1D1F}.wk-meta em{font-style:normal;color:#6E6E73;margin-right:6px}.wk-meta .wk-pdf{display:inline-block;line-height:0;vertical-align:middle}.wk-meta span{display:inline-flex;align-items:center}.wk-desc{max-width:720px;margin:20px auto 0;padding:0 24px;box-sizing:border-box;text-align:center;font-size:14px;line-height:1.75;color:#6E6E73;word-break:keep-all}.wk-desc p{margin:0 0 10px;text-wrap:balance}.wk-desc p:last-child{margin-bottom:0}.wk-tags{max-width:720px;margin:24px auto 0;padding:0 24px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px}.wk-wrap{margin-top:36px}.wk-media{width:100%}.wk-single{width:min(100%,max(480px,calc((100vh - 360px)*16/9)));margin:0 auto}.wk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}.wk-lb{position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center}.wk-lb img{max-width:92vw;max-height:88vh;object-fit:contain;border-radius:8px}.wk-lb button{position:absolute;border:0;background:rgba(255,255,255,.14);color:#fff;width:48px;height:48px;border-radius:50%;font-size:30px;line-height:1;cursor:pointer}.wk-lb button:hover{background:rgba(255,255,255,.28)}.wk-lb .x{top:20px;right:20px}.wk-lb .p{left:20px;top:50%;margin-top:-24px}.wk-lb .nx{right:20px;top:50%;margin-top:-24px}.wk-lb .n{position:absolute;bottom:20px;left:0;right:0;text-align:center;color:#D2D2D7;font-size:14px}'
 +'@media (min-width:900px){.wk-sec{padding:0 0 80px}.wk-wrap{flex-wrap:nowrap}.wk-side{position:sticky;top:76px;max-height:calc(100vh - 96px);overflow-y:auto;scrollbar-width:none}.wk-side::-webkit-scrollbar{display:none}}';

var PLAY='<span style="position: absolute; left: 50%; top: 50%; width: 88px; height: 88px; margin: -44px 0 0 -44px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center"><svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path fill="#1D1D1F" d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"></path></svg></span>';


var CATKO={marketing:'Marketing',branding:'Branding • Design',photo:'Photo',video:'Video'};
function metaLine(w){
  var cs=(w.categories&&w.categories.length?w.categories:[w.category]).filter(function(c){return CATKO[c]});
  var sc=String(w.scope||'').split(/\n/).map(function(x){return x.replace(/^[\s\-•·*]+/,'').trim()}).filter(Boolean);
  var it=[];
  if(w.client)it.push(['Client',esc(w.client)]);
  if(w.work_year)it.push(['Period',esc(w.work_year)]);
  if(cs.length)it.push(['Category',cs.map(function(c){return '<a href="/en/Works?cat='+c+'" style="color: inherit; text-decoration: none; border-bottom: 1px solid #D2D2D7">'+CATKO[c]+'</a>'}).join(' · ')]);
  var pdf=w.pdf_url?(pdfUrl(w.pdf_url)?'<span><em>Download</em>'+'<a class="wk-pdf" href="'+esc(pdfUrl(w.pdf_url))+'" target="_blank" rel="noopener" title="Download" aria-label="Download">'+(/photos\.google\.com|photos\.app\.goo\.gl|photos\.fife/.test(w.pdf_url)?'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0a5 5 0 0 1 5 5v5h-5a5 5 0 0 1 0-10z" fill="#EA4335"/><path d="M20 10a5 5 0 0 1-5 5h-5v-5a5 5 0 0 1 5-5 5 5 0 0 1 5 5z" fill="#4285F4"/><path d="M10 20a5 5 0 0 1-5-5v-5h5a5 5 0 0 1 0 10z" fill="#34A853"/><path d="M0 10a5 5 0 0 1 5-5h5v5a5 5 0 0 1-5 5 5 5 0 0 1-5-5z" fill="#FBBC04"/></svg>':'<svg width="16" height="20" viewBox="0 0 36 44" aria-hidden="true"><path d="M4 0h19l13 13v27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#E5322D"/><path d="M23 0l13 13H27a4 4 0 0 1-4-4z" fill="#F5A3A0"/><text x="18" y="35" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11" fill="#fff">PDF</text></svg>')+'</a>'+'</span>':''):'';
  if(!it.length&&!pdf)return '';
  return '<div class="wk-meta">'+it.map(function(r){return '<span><em>'+r[0]+'</em>'+r[1]+'</span>'}).join('')+pdf+'</div>';
}
/* 영상: 페이지 안에서 바로 재생 / 사진: 크게 보기 */
function justify(app){
  var box=app.querySelector('.wk-just');if(!box)return;
  if(!document.getElementById('jg-css')){var st=document.createElement('style');st.id='jg-css';st.textContent='.wk-just{display:flex;flex-direction:column;width:100%}.wk-row{display:flex;justify-content:center}.wk-row img{flex:none;display:block;object-fit:cover}';document.head.appendChild(st)}
  var imgs=[].slice.call(box.querySelectorAll('img.wk-ph'));
  function layout(){
    var W=box.clientWidth;if(!W)return;
    var mob=W<640,dg=+box.getAttribute('data-gap'),dt=+box.getAttribute('data-t'),gap=dg?(mob?Math.min(dg,8):dg):(mob?10:16),target=dt?(mob?Math.min(dt,150):Math.min(dt,W/4.2)):(mob?210:Math.min(360,W/3.1));
    var rs=imgs.map(function(im){return im.naturalWidth&&im.naturalHeight?im.naturalWidth/im.naturalHeight:1.5});
    var rows=[],cur=[],sum=0,per=+box.getAttribute('data-per');
    if(per&&!mob){for(var q=0;q<imgs.length;q+=per){var rr=[];for(var z=q;z<Math.min(q+per,imgs.length);z++)rr.push(z);rows.push(rr)}}
    else for(var i=0;i<imgs.length;i++){
      cur.push(i);sum+=rs[i];
      if(sum*target+gap*(cur.length-1)>=W){rows.push(cur);cur=[];sum=0}
    }
    if(cur.length)rows.push(cur);
    box.textContent='';
    rows.forEach(function(row,ri){
      var s=0;row.forEach(function(k){s+=rs[k]});
      var h=(W-gap*(row.length-1))/s;
      if(!per&&ri===rows.length-1&&h>target*1.3)h=target;
      var d=document.createElement('div');d.className='wk-row';d.style.cssText='gap:'+gap+'px;margin-bottom:'+(ri<rows.length-1?gap:0)+'px';
      row.forEach(function(k){var im=imgs[k];im.style.width=(rs[k]*h)+'px';im.style.height=h+'px';im.style.maxWidth='none';d.appendChild(im)});
      box.appendChild(d);
    });
  }
  var t=null;function re(){clearTimeout(t);t=setTimeout(layout,60)}
  imgs.forEach(function(im){if(!im.complete)im.addEventListener('load',re)});
  layout();window.addEventListener('resize',re);
}
function wireMedia(app){
  [].forEach.call(app.querySelectorAll('.wk-play'),function(a){
    a.addEventListener('click',function(ev){
      var id=a.getAttribute('data-yt');if(!id)return;ev.preventDefault();
      var f=document.createElement('iframe');f.src='https://www.youtube.com/embed/'+id+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.title=a.getAttribute('aria-label')||'Video';
      f.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0';a.replaceWith(Object.assign(document.createElement('div'),{className:'wk-frame',style:'position: relative; width: 100%; aspect-ratio: 16 / 9; flex: none; border-radius: 18px; overflow: hidden; background: #000'}));
      var host=app.querySelector('.wk-frame:not([data-d])');host.setAttribute('data-d','1');host.appendChild(f);
    });
  });
  var ph=[].slice.call(app.querySelectorAll('img.wk-ph'));if(!ph.length)return;
  var lb=null,ix=0;
  function show(n){ix=(n+ph.length)%ph.length;lb.querySelector('img').src=ph[ix].src;lb.querySelector('.n').textContent=(ix+1)+' / '+ph.length}
  function close(){if(!lb)return;document.removeEventListener('keydown',key);lb.remove();lb=null;document.body.style.overflow=''}
  function key(e){if(e.key==='Escape')close();else if(e.key==='ArrowRight')show(ix+1);else if(e.key==='ArrowLeft')show(ix-1)}
  function open(n){
    lb=document.createElement('div');lb.className='wk-lb';
    lb.innerHTML='<img alt=""><button type="button" class="x" aria-label="Close">×</button>'+(ph.length>1?'<button type="button" class="p" aria-label="Previous">‹</button><button type="button" class="nx" aria-label="Next">›</button><span class="n"></span>':'<span class="n"></span>');
    document.body.appendChild(lb);document.body.style.overflow='hidden';show(n);document.addEventListener('keydown',key);
    lb.addEventListener('click',function(e){var t=e.target;if(t.classList.contains('p'))show(ix-1);else if(t.classList.contains('nx'))show(ix+1);else if(t.tagName!=='IMG')close()});
    var x0=null;lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){if(x0==null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)show(ix+(d<0?1:-1));x0=null});
  }
  ph.forEach(function(p,n){p.addEventListener('click',function(){open(n)})});
}
function wireMore(app){
  var m=app.querySelector('.wk-media'),b=app.querySelector('.wk-more');if(!m||!b)return;
  function upd(){var more=m.scrollHeight-m.clientHeight>8&&m.scrollTop+m.clientHeight<m.scrollHeight-8;b.classList.toggle('off',!more)}
  m.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);
  [].forEach.call(m.querySelectorAll('img'),function(i){if(!i.complete)i.addEventListener('load',upd)});
  b.onclick=function(){m.scrollBy({top:Math.round(m.clientHeight*.8),behavior:'smooth'})};
  upd();setTimeout(upd,600);
}
function setMeta(t,d,img){
  function m(sel,attr,val){var e=document.querySelector(sel);if(e&&val)e.setAttribute(attr,val)}
  d=String(d||'').replace(/\s+/g,' ').trim().slice(0,150);
  var url=location.origin+location.pathname+location.search;
  m('meta[name="description"]','content',d);m('link[rel="canonical"]','href',url);
  m('meta[property="og:title"]','content','BUFF UNIVERSE — '+t);m('meta[property="og:description"]','content',d);m('meta[property="og:url"]','content',url);
  if(img&&/^https?:/.test(img)){m('meta[property="og:image"]','content',img);m('meta[name="twitter:image"]','content',img)}
}
function pdfUrl(u){u=String(u||'').trim();if(!u)return '';var m=u.match(/drive\.google\.com\/file\/d\/([^\/?#]+)/)||u.match(/[?&]id=([^&#]+)/);if(/drive\.google\.com|docs\.google\.com/.test(u)&&m)return 'https://drive.google.com/uc?export=download&id='+m[1];return u}
function fitTitle(app){var h=app.querySelector('.wk-h1');if(!h)return;function f(){h.style.fontSize='';var fs=parseFloat(getComputedStyle(h).fontSize);while(h.scrollWidth>h.clientWidth&&fs>14){fs-=1;h.style.fontSize=fs+'px'}}f();window.addEventListener('resize',f);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(f)}
function loadW2(cb){if(window.renderWork2)return cb(true);var s=document.createElement('script');s.src='/work2.js?v=1795716188';s.onload=function(){cb(true)};s.onerror=function(){cb(false)};document.head.appendChild(s)}
/* 관련 보도: 관리자에서 넣은 기사·보도자료 링크를 메신저 미리보기 같은 카드로 표시 */
function addPress(app,w){try{
  var ps=(w.press||[]).filter(function(p){return p&&p.url});if(!ps.length)return;
  if(!document.getElementById('wk-press-css')){var s=document.createElement('style');s.id='wk-press-css';s.textContent=".wk-press{max-width:960px;margin:56px auto 0;padding:0 20px;box-sizing:border-box}.wk-press h2{margin:0 0 14px;font-size:15px;font-weight:700;color:#6E6E73}.wk-pc{display:grid;grid-template-columns:240px minmax(0,1fr);border:1px solid #E5E5EA;border-radius:14px;overflow:hidden;text-decoration:none;color:#1D1D1F;background:#fff;transition:border-color .15s,box-shadow .15s}.wk-pc+.wk-pc{margin-top:12px}.wk-pc:hover{border-color:#C7C7CC;box-shadow:0 6px 20px rgba(0,0,0,.06);opacity:1}.wk-pc .im{background:#F5F5F7 center/cover no-repeat;min-height:140px}.wk-pc .tx{padding:18px 22px;display:flex;flex-direction:column;gap:6px;min-width:0;justify-content:center}.wk-pc .st{font-size:12.5px;color:#8E8E93}.wk-pc b{font-size:16px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.wk-pc p{margin:0;font-size:13.5px;line-height:1.5;color:#6E6E73;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.wk-pc.noimg{grid-template-columns:1fr}.wk-web{border:1px solid #D2D2D7;border-radius:14px;overflow:hidden;background:#fff}.wk-web+.wk-web,.wk-web+.wk-pc,.wk-pc+.wk-web{margin-top:16px}.wk-web .bar{display:flex;align-items:center;gap:10px;height:42px;padding:0 12px 0 14px;background:#F5F5F7;border-bottom:1px solid #E5E5EA}.wk-web .dots{display:flex;gap:6px;flex:none}.wk-web .dots i{width:10px;height:10px;border-radius:50%;background:#D2D2D7}.wk-web .u{flex:1;min-width:0;height:26px;display:flex;align-items:center;padding:0 12px;border-radius:7px;background:#fff;font-size:12.5px;color:#6E6E73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wk-web .op{flex:none;font-size:12.5px;font-weight:600;color:#1D1D1F;text-decoration:none;white-space:nowrap}.wk-web .op:hover{text-decoration:underline;text-underline-offset:3px;opacity:1}.wk-web iframe{display:block;width:100%;height:640px;border:0;background:#fff}@media(max-width:640px){.wk-web .dots{display:none}.wk-web iframe{height:520px}}@media(max-width:640px){.wk-press{margin-top:40px}.wk-pc{grid-template-columns:1fr}.wk-pc .im{aspect-ratio:1.91/1;min-height:0}.wk-pc .tx{padding:14px 16px}}";document.head.appendChild(s)}
  function host(u){try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}}
  var html='<section class="wk-press"><h2>Press</h2>'+ps.map(function(p){
    var h=host(p.url),t=String(p.title||h||p.url),sn=String(p.site||'');
    if(sn&&t.length>sn.length+3){t=t.replace(new RegExp('\\s*[-|·–—]\\s*'+sn.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$'),'')}
    var d=p.desc&&p.desc!==t&&p.desc.indexOf(t)!==0?p.desc:'';
    if(p.embeddable==='1')return '<div class="wk-web"><div class="bar"><span class="dots"><i></i><i></i><i></i></span><span class="u">'+esc(h+(function(){try{var x=new URL(p.url);return decodeURIComponent(x.pathname).slice(0,80)}catch(e){return ''}})())+'</span><a class="op" href="'+esc(p.url)+'" target="_blank" rel="noopener">Open in new tab ↗</a></div><iframe src="'+esc(p.url)+'" title="'+esc(t)+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe></div>';
    return '<a class="wk-pc'+(p.image?'':' noimg')+'" href="'+esc(p.url)+'" target="_blank" rel="noopener">'+(p.image?'<span class="im" style="background-image:url(\''+esc(p.image).replace(/'/g,'%27')+'\')"></span>':'')+'<span class="tx"><span class="st">'+esc(h)+'</span><b>'+esc(t)+'</b>'+(d?'<p>'+esc(d)+'</p>':'')+'</span></a>'}).join('')+'</section>';
  var box=document.createElement('div');box.innerHTML=html;var sec=box.firstChild;
  var cr=app.querySelector('.wk-credit');
  if(cr&&cr.parentNode)cr.parentNode.insertBefore(sec,cr);
  else{var wrap=app.querySelector('.t2 .wrap')||app.querySelector('.wk-sec')||app;wrap.appendChild(sec)}
}catch(e){}}
/* 작품 페이지 공유 버튼: 휴대폰은 기본 공유 창(카톡·메시지 등), PC는 링크 복사 */
function addShare(app,w){try{
  if(!document.getElementById('wk-share-css')){var s=document.createElement('style');s.id='wk-share-css';s.textContent=".wk-share{justify-self:end;display:inline-flex;align-items:center;gap:6px;height:34px;padding:0 14px;border:1px solid #D2D2D7;border-radius:99px;background:#fff;color:#1D1D1F;font:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:border-color .15s,background .15s;white-space:nowrap}.wk-share:hover{border-color:#1D1D1F}.wk-share svg{width:15px;height:15px}.wk-share-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:28px 0 0}@media(min-width:641px){.wk-share-row{margin-top:32px}}.wk-share-row .back{margin:0!important}.wk-toast{position:fixed;left:50%;bottom:32px;transform:translate(-50%,20px);background:#1D1D1F;color:#fff;font-size:14px;font-weight:600;padding:11px 18px;border-radius:99px;opacity:0;transition:opacity .2s,transform .2s;z-index:200;pointer-events:none}.wk-toast.on{opacity:1;transform:translate(-50%,0)}";document.head.appendChild(s)}
  var b=document.createElement('button');b.type='button';b.className='wk-share';b.setAttribute('aria-label','Share');
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg><span>Share</span>';
  var slot=app.querySelector('.wk-top>span:last-child'),back=app.querySelector('.t2 .back');
  if(slot)slot.parentNode.replaceChild(b,slot);
  else if(back){var row=document.createElement('div');row.className='wk-share-row';back.parentNode.insertBefore(row,back);row.appendChild(back);row.appendChild(b)}
  else return;
  function toast(m){var t=document.createElement('div');t.className='wk-toast';t.textContent=m;document.body.appendChild(t);requestAnimationFrame(function(){t.classList.add('on')});setTimeout(function(){t.classList.remove('on');setTimeout(function(){t.remove()},250)},1800)}
  b.addEventListener('click',function(){
    var url=location.origin+location.pathname+(/\/work(\.html)?$/.test(location.pathname)?location.search:''),title=(window.BUFF_EN&&w.title_en)||w.title;
    var touch=window.matchMedia('(pointer:coarse)').matches;
    if(navigator.share&&touch){navigator.share({title:title,url:url}).catch(function(){});return}
    var done=function(){toast('Link copied')};
    if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(url).then(done,function(){window.prompt('Copy this link',url)});
    else window.prompt('Copy this link',url);
  });
}catch(e){}}
function workDetail(app){
  var st=document.createElement('style');st.textContent=WK_CSS;document.head.appendChild(st);
  var qk=qKey(),id=qk&&qk.v;
  if(!id){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">This project is being prepared</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">We are preparing this page.<br> Please check back soon.</p><a href="/en/" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">Back to home</a></div>';return}
  Promise.all([getData('works','select=*&'+qk.f+'=eq.'+encodeURIComponent(id)),getData('team_members','select=name,name_en,role_en,avatar_url&published=eq.true')]).then(function(res){
    var w=res[0][0],team=res[1];toSlugUrl(w);
    if(!w){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">This project is being prepared</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">We are preparing this page.<br> Please check back soon.</p><a href="/en/" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">Back to home</a></div>';return}
    document.title='BUFF UNIVERSE — '+w.title;
    setMeta(w.title,w.description||'',thumbOf(w)||(w.images||[])[0]||'');
    var c=CAT[w.category]||CAT.photo;
    var mem=(w.members||[]).map(function(n){var t=team.filter(function(x){return x.name===n||x.ko_name===n})[0]||{};
      return '<div style="display: flex; align-items: center; gap: 10px">'+(t.avatar_url?'<img src="'+esc(t.avatar_url)+'" alt="'+esc(t.name||n)+'" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; object-position: top center; background: #F5F5F7">':'')+'<span style="font-size: 14px; font-weight: 700; color: #1D1D1F">'+esc(t.name||n)+'</span></div>'}).join('');
    if(String(w.template)==='2'){loadW2(function(ok){if(ok){window.renderWork2(app,w,c[1],mem?'<div class="wk-credit"><em>Contributors</em><div class="wk-people">'+mem+'</div></div>':'');addShare(app,w);addPress(app,w);justify(app);wireMedia(app)}else app.innerHTML='<p style="padding:120px 40px;text-align:center">'+(window.BUFF_EN?'Could not load the page. Please try again later.':'불러오지 못했습니다. 잠시 후 다시 시도해 주세요.')+'</p>'});return}
    var media='';
    var vids='';
    (Array.isArray(w.videos)?w.videos:[]).forEach(function(v){var i=ytId(v.url);if(!v.url)return;var igm=String(v.url).match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/);if(igm){vids+='<figure class="wk-vid wk-ig" style="margin: 0"><div style="border-radius: 16px; overflow: hidden; border: 1px solid #D2D2D7; background: #fff"><iframe src="https://www.instagram.com/'+(igm[1]==='p'?'p':'reel')+'/'+igm[2]+'/embed/" title="Instagram" loading="lazy" scrolling="no" allowtransparency="true" allowfullscreen style="display: block; width: 100%; height: 600px; border: 0"></iframe></div></figure>';return}
      var poster=v.poster||(i?'https://i.ytimg.com/vi/'+i+'/maxresdefault.jpg':'');
      if(/\.(mp4|mov|webm|m4v)(\?|$)/i.test(v.url)){vids+='<figure class="wk-vid" style="margin: 0; display: flex; flex-direction: column; gap: 12px"><video controls playsinline preload="metadata" '+(v.poster?'poster="'+esc(v.poster)+'" ':'')+'src="'+esc(v.url)+(v.poster?'':'#t=0.1')+'" style="display: block; width: 100%; aspect-ratio: 16 / 9; border-radius: 18px; background: #000; object-fit: contain"></video>'+(v.label?'<figcaption style="text-align: center; font-size: 17px; font-weight: 600; color: #1D1D1F">'+esc(v.label)+'</figcaption>':'')+'</figure>';return}
      vids+='<figure class="wk-vid" style="margin: 0; display: flex; flex-direction: column; gap: 12px"><a class="wk-play" data-yt="'+esc(i)+'" href="'+esc(v.url)+'" target="_blank" rel="noopener" aria-label="'+esc((w.title+' '+(v.label||''))+' video play')+'" style="position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; flex: none; border-radius: 18px; overflow: hidden; background: #000000; text-decoration: none">'+(poster?'<img src="'+esc(poster)+'" alt="'+esc(w.title+' '+(v.label||''))+'" draggable="false" style="display: block; width: 100%; height: 100%; object-fit: contain; background: #000">':'')+PLAY+'</a>'+(v.label?'<figcaption style="text-align: center; font-size: 17px; font-weight: 600; color: #1D1D1F">'+esc(v.label)+'</figcaption>':'')+'</figure>'});
    var nv=(Array.isArray(w.videos)?w.videos:[]).filter(function(v){return v&&v.url}).length;
    if(vids)media+=nv>1?'<div class="wk-grid">'+vids+'</div>':'<div class="wk-single">'+vids+'</div>';
    var onlyPhoto=(w.categories&&w.categories.length?w.categories:[w.category]).every(function(c){return c==='photo'});
    var imgs=(w.images||[]).map(function(u){return '<img class="wk-ph" src="'+esc(u)+'" alt="'+esc(w.title)+'" style="cursor: zoom-in; display: block; width: 100%; border-radius: 18px; '+'height: auto;'+' background: #F5F5F7">'});
    if(imgs.length)media+='<div class="wk-just">'+imgs.join('')+'</div>';
    app.innerHTML='<section style="background: #FFFFFF; padding: 32px 0 0"><div class="wk-top"><a href="'+c[1]+'" style="font-size: 15px; font-weight: 500; color: #6E6E73; text-decoration: none; justify-self: start; white-space: nowrap">‹ Works</a>'+'<span></span><span></span></div></section>'
    +'<section class="wk-sec">'
    +'<div class="wk-titlerow"><h1 class="wk-h1">'+esc(w.title)+'</h1>'+''+'</div>'
    +metaLine(w)
    +(w.description?'<div class="wk-desc">'+(/\n/.test(w.description)?w.description:w.description.replace(/([.!?。]|다\.)\s+/g,function(m,a){return a+'\n'})).trim().split(/\n\s*\n/).map(function(b){return '<p>'+b.split(/\n/).map(function(l){return esc(l.trim())}).join('<br> ')+'</p>'}).join('')+'</div>':'')
    +'<div class="wk-wrap"><div class="wk-media">'+media+'</div></div>'+(mem?'<div class="wk-credit"><em>Contributors</em><div class="wk-people">'+mem+'</div></div>':'')+'</section>';
    wireMedia(app);justify(app);fitTitle(app);addShare(app,w);addPress(app,w);
  }).catch(function(){app.innerHTML='<p style="padding:120px 40px;text-align:center">We could not load this page. Please try again in a moment.</p>'});
}
function srcLabel(u){u=String(u||'');return /instagram\.com/.test(u)?'View on Instagram':/youtu\.?be/.test(u)?'View on YouTube':/threads\.(net|com)/.test(u)?'View on Threads':/facebook\.com|fb\.watch/.test(u)?'View on Facebook':/(twitter|x)\.com/.test(u)?'X에서 보기':'View original'}
/* 뉴스 원문 링크를 사이트 안에서 그대로 보여주는 창 (원문 사이트가 허용할 때만) */
function newsFrame(n){
  if(!n||!n.source_url||n.source_embed!=='1')return '';
  if(!document.getElementById('wk-press-css')&&!document.getElementById('nf-css')){var s=document.createElement('style');s.id='nf-css';s.textContent=".wk-web{border:1px solid #D2D2D7;border-radius:14px;overflow:hidden;background:#fff}.wk-web .bar{display:flex;align-items:center;gap:10px;height:42px;padding:0 12px 0 14px;background:#F5F5F7;border-bottom:1px solid #E5E5EA}.wk-web .dots{display:flex;gap:6px;flex:none}.wk-web .dots i{width:10px;height:10px;border-radius:50%;background:#D2D2D7}.wk-web .u{flex:1;min-width:0;height:26px;display:flex;align-items:center;padding:0 12px;border-radius:7px;background:#fff;font-size:12.5px;color:#6E6E73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wk-web .op{flex:none;font-size:12.5px;font-weight:600;color:#1D1D1F;text-decoration:none;white-space:nowrap}.wk-web .op:hover{text-decoration:underline;text-underline-offset:3px;opacity:1}.wk-web iframe{display:block;width:100%;height:640px;border:0;background:#fff}@media(max-width:640px){.wk-web .dots{display:none}.wk-web iframe{height:520px}}";document.head.appendChild(s)}
  var u=n.source_url,h='';try{var x=new URL(u);h=x.hostname.replace(/^www\./,'')+decodeURIComponent(x.pathname+x.search).slice(0,80)}catch(e){h=u}
  return '<div class="nf-wrap" style="margin: 72px 0 0"><h2 style="margin: 0 0 14px; font-size: 15px; font-weight: 700; color: #6E6E73">Original article</h2><div class="wk-web"><div class="bar"><span class="dots"><i></i><i></i><i></i></span><span class="u">'+esc(h)+'</span><a class="op" href="'+esc(u)+'" target="_blank" rel="noopener">Open in new tab ↗</a></div><iframe src="'+esc(u)+'" title="Original article" loading="lazy" referrerpolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe></div></div>';
}
function srcBox(tags,url){
  var chips=(tags||[]).filter(Boolean).map(function(t){return '<span class="src-chip" style="display: inline-block; padding: 6px 14px; border-radius: 999px; border: 1px solid #D2D2D7; background: #fff; font-size: 14px; font-weight: 600; color: #1D1D1F">'+esc(t)+'</span>'}).join('');
  var btn=url?'<a class="src-btn" href="'+esc(url)+'" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; padding: 12px 22px; border-radius: 999px; background: #1D1D1F; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; white-space: nowrap">'+srcLabel(url)+' <span aria-hidden="true">↗</span></a>':'';
  if(!chips&&!btn)return '';
  return '<style>@media(max-width:640px){.src-box{margin-top:40px!important;padding:18px 18px 20px!important;border-radius:18px!important;gap:12px!important}.src-chip{font-size:12px!important;padding:4px 10px!important}.src-btn{font-size:13px!important;padding:9px 16px!important}.src-row{gap:12px!important}}</style><div class="src-box" style="margin: 64px 0 0; padding: 28px 32px; background: #F5F5F7; border-radius: 22px; display: flex; flex-direction: column; gap: 16px"><span style="font-size: 13px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #6E6E73">Source</span><div class="src-row" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 20px"><div style="display: flex; flex-wrap: wrap; gap: 8px">'+chips+'</div>'+btn+'</div></div>';
}
function newsDetail(app){
  var qk=qKey(),id=qk&&qk.v;
  if(!id){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">This story is being prepared</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">We are preparing this page.<br> Please check back soon.</p><a href="/en/" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">Back to home</a></div>';return}
  Promise.all([getData('news','select=*,works(id,slug,category)&'+qk.f+'=eq.'+encodeURIComponent(id)),getData('team_members','select=name,name_en,avatar_url&published=eq.true').catch(function(){return[]})]).then(function(rr){
    var r=rr[0],team=rr[1]||[];
    var n=r[0];toSlugUrl(n);if(!n){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">This story is being prepared</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">We are preparing this page.<br> Please check back soon.</p><a href="/en/" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">Back to home</a></div>';return}
    document.title='BUFF UNIVERSE — '+n.title_line1;
    var yr=n.published_at?String(n.published_at).slice(0,4):'';
    var LOGO='<img src="assets/a87a0a50cb72c77fedb5b0091e922cf3.png" alt="BUFF" style="display:inline-block;height:0.78em;width:auto;vertical-align:baseline;transform:translateY(0.02em)">';
    var bparts=String(n.body||'').split(/\n{2,}/).filter(Boolean),emb=(Array.isArray(n.embeds)?n.embeds:[]).map(function(u){return String(u||'').trim()}).filter(function(u){return /^https?:\/\/\S+$/.test(u)}),si=bparts.findIndex(function(p){return /^출처\s*:/.test(p.trim())});
    var mem=(Array.isArray(n.members)?n.members:[]);
    if(emb.length||mem.length){if(si<0)si=bparts.length;bparts=bparts.slice(0,si).concat(mem.length?['\u0002MEM']:[],emb,bparts.slice(si))}
    var paras=bparts.map(function(p){
      if(p==='\u0002MEM')return '\u0003<div style="margin: 40px 0 0; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center"><span style="font-size: 13px; font-weight: 600; letter-spacing: 0.18em; color: #6E6E73">Contributors</span><div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px 28px">'+mem.map(function(nm){var t=team.filter(function(x){return x.name===nm||x.ko_name===nm})[0]||{};return '<div style="display: flex; align-items: center; gap: 10px">'+(t.avatar_url?'<img src="'+esc(t.avatar_url)+'" alt="'+esc(t.name||nm)+'" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; object-position: top center; background: #F5F5F7">':'')+'<span style="font-size: 16px; font-weight: 700; color: #1D1D1F">'+esc(t.name||nm)+'</span></div>'}).join('')+'</div></div>';
      var lines=p.split('\n'),src=lines.filter(function(l){return /^https?:\/\/\S+$/.test(l.trim())||/^출처\s*:/.test(l.trim())}).length===lines.length;
      var u1=p.trim(),ym=u1.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^\s#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})[^\s]*$/),im=u1.match(/^https?:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)[^\s]*$/);
      if(ym){var sh=/shorts\//.test(u1);return '<div style="margin: 40px auto 56px; width: 100%; '+(sh?'max-width: 360px; aspect-ratio: 9 / 16':'aspect-ratio: 16 / 9')+'; border-radius: 18px; overflow: hidden; background: #000"><iframe src="https://www.youtube-nocookie.com/embed/'+ym[1]+'?rel=0" title="YouTube" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen style="display: block; width: 100%; height: 100%; border: 0"></iframe></div>'}
      if(im){var kind=im[1]==='p'?'p':'reel';return '\u0001<div class="ig-wrap" style="position: relative; width: 100%; aspect-ratio: 400 / 633; overflow: hidden; border-radius: 16px; border: 1px solid #D2D2D7; background: #fff"><iframe src="https://www.instagram.com/'+kind+'/'+im[2]+'/embed/" title="Instagram" loading="lazy" scrolling="no" allowtransparency="true" allowfullscreen data-h="740" style="position: absolute; left: 0; top: 0; display: block; width: 400px; height: 740px; border: 0; transform-origin: 0 0"></iframe></div>'}
      if(/^https?:\/\/\S+$/.test(u1))return '<div style="margin: 32px 0 48px"><a href="'+esc(u1)+'" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; padding: 12px 22px; border-radius: 999px; background: #1D1D1F; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none">Open <span aria-hidden="true">↗</span></a></div>';
      if(/^Q\.\s/.test(p))return '<h3 style="margin: 44px 0 14px; padding-left: 16px; border-left: 3px solid #1D1D1F; font-size: 20px; font-weight: 700; line-height: 1.5; letter-spacing: -0.01em; color: #1D1D1F; word-break: keep-all">'+br(p.replace(/^Q\.\s*/,''))+'</h3>';
      if(/^##\s/.test(p))return '<h2 style="margin: 44px 0 14px; font-size: 24px; font-weight: 700; line-height: 1.4; letter-spacing: -0.01em; color: #1D1D1F; word-break: keep-all">'+br(p.replace(/^##\s*/,''))+'</h2>';
      if(src){var chips='',btn='';lines.forEach(function(l){l=l.trim();if(/^https?:/.test(l)){btn='<a class="src-btn" href="'+esc(l)+'" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; gap: 6px; padding: 12px 22px; border-radius: 999px; background: #1D1D1F; color: #fff; font-size: 15px; font-weight: 600; text-decoration: none; white-space: nowrap">원문 보기 <span aria-hidden="true">↗</span></a>'}else{l.replace(/^출처\s*:\s*/,'').split('|').forEach(function(t){t=t.trim();if(t)chips+='<span class="src-chip" style="display: inline-block; padding: 6px 14px; border-radius: 999px; border: 1px solid #D2D2D7; background: #fff; font-size: 14px; font-weight: 600; color: #1D1D1F">'+esc(t)+'</span>'})}});
        return '<style>@media(max-width:640px){.src-box{margin-top:40px!important;padding:18px 18px 20px!important;border-radius:18px!important;gap:12px!important}.src-chip{font-size:12px!important;padding:4px 10px!important}.src-btn{font-size:13px!important;padding:9px 16px!important}.src-row{gap:12px!important}}</style><div class="src-box" style="margin: 64px 0 0; padding: 28px 32px; background: #F5F5F7; border-radius: 22px; display: flex; flex-direction: column; gap: 16px"><span style="font-size: 13px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #6E6E73">Source</span><div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 20px" class="src-row"><div style="display: flex; flex-wrap: wrap; gap: 8px">'+chips+'</div>'+btn+'</div></div>'}
      return '<p class="nb" style="margin: 0 0 24px; font-size: 19px; line-height: 1.8; color: #1D1D1F; word-break: keep-all; text-align: justify; text-justify: inter-word; text-align-last: left; overflow-wrap: break-word">'+br(p.split('\n').map(function(l){return l.trim()}).join('\n'))+'</p>'});
    var memHtml='';paras=paras.filter(function(h){if(h.charAt(0)==='\u0003'){memHtml=h.slice(1);return false}return true});
    paras=(function(a){var out='',run=[];function flush(){if(run.length===1){out+='<div class="ig-grid" style="width: 100%; max-width: 480px; margin: 48px auto 64px">'+run[0]+'</div>';run=[]}else if(run.length){out+='<div class="ig-grid" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: start; width: 100%; margin: 48px 0 64px">'+run.join('')+'</div>';run=[]}}a.forEach(function(h){if(h.charAt(0)==='\u0001')run.push(h.slice(1));else{flush();out+=h}});flush();return out})(paras);
    
    app.innerHTML='<section style="background: #FFFFFF; padding: 32px 0 0"><div style="max-width: 900px; margin: 0 auto; padding: 0 40px; box-sizing: border-box"><a href="/en/News" style="font-size: 15px; font-weight: 500; color: #6E6E73; text-decoration: none; white-space: nowrap">‹ News</a></div></section>'
    +'<section style="background: #FFFFFF; padding: 40px 0 0"><div style="max-width: 900px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-start; gap: 16px; text-align: left"><span style="font-size: 19px; font-weight: 600; color: #6E6E73">'+esc(n.category)+(yr?' · '+yr:'')+'</span><h1 style="margin: 0; font-size: 40px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: #1D1D1F; word-break: keep-all">'+esc(n.title_line1)+(n.title_line2?'<br> '+esc(n.title_line2):'')+'</h1></div></section>'
    +'<section style="background: #FFFFFF; padding: 32px 0 120px"><div style="max-width: 900px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box">'
    
    +(function(ps,fr){var i=ps.indexOf('<div class="ig-grid"');if(i<0)return ps+fr;return ps.slice(0,i)+fr+'<style>.ig-h+.ig-grid{margin-top:0!important}</style><h2 class="ig-h" style="margin: 72px 0 14px; font-size: 15px; font-weight: 700; color: #6E6E73">Instagram</h2>'+ps.slice(i)})(paras,newsFrame(n))+srcBox(Array.isArray(n.source_tags)?n.source_tags:[],n.source_url)+memHtml+'<div id="news-rel"></div>'
    +'</div></div></section>';
    if(!document.getElementById('ig-css')){var igs=document.createElement('style');igs.id='ig-css';igs.textContent='@media(max-width:900px){.ig-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:520px){.ig-grid{grid-template-columns:1fr!important}}';document.head.appendChild(igs)}
    function fitIg(){[].forEach.call(document.querySelectorAll('.ig-wrap'),function(w){var f=w.firstChild;if(f&&w.clientWidth)f.style.transform='scale('+(w.clientWidth/400)+')'})}
    fitIg();setTimeout(fitIg,300);window.addEventListener('resize',fitIg);
    var rel=(Array.isArray(n.related_work_ids)?n.related_work_ids:[]).concat(n.work_id?[n.work_id]:[]).filter(function(x,i,a){return /^[0-9a-f-]{36}$/i.test(x||'')&&a.indexOf(x)===i});
    if(rel.length)getData('works','select=*&published=eq.true&id=in.('+rel.join(',')+')').then(function(ws){var box=document.getElementById('news-rel');if(!box||!ws.length)return;ws=rel.map(function(i){return ws.filter(function(w){return w.id===i})[0]}).filter(Boolean);box.innerHTML='<style>.rel-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:28px 20px}.rel-grid>a>img{border-radius:14px!important;margin-bottom:6px!important;box-shadow:0 6px 18px rgba(0,0,0,.08)}.rel-grid>a>span:nth-of-type(1){font-size:18px!important}.rel-grid>a>span:nth-of-type(2){font-size:14px!important}</style><div style="margin-top: 72px"><div style="font-size: 13px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: #6E6E73; margin-bottom: 24px">Related Projects</div><div class="rel-grid">'+ws.map(workCard).join('')+'</div></div>'}).catch(function(){});
  }).catch(function(){app.innerHTML='<p style="padding:120px 40px;text-align:center">We could not load this page. Please try again in a moment.</p>'});
}
/* 모바일: 줄바꿈(<br> )으로 나눈 문장은 글자를 줄여서 한 줄씩 들어가게 맞춥니다 (너무 작아지면 원래대로 줄바꿈) */
function fitAll(){if(window.BUFF_EN)return;
  var mob=window.matchMedia('(max-width:640px)').matches;
  [].forEach.call(document.querySelectorAll('p br,h1 br,h2 br,h3 br,div br,span br'),function(b){
    var el=b.parentElement;if(!el||el._fit===1||el.closest('header,nav,button,#top,.nb'))return;
    el._fit=1;
  });
  [].forEach.call(document.querySelectorAll('p,h1,h2,h3,div,span'),function(el){
    if(el._fit!==1)return;
    if(el._of===undefined){el._of=el.style.fontSize;el._ow=el.style.whiteSpace;el._ol=el.style.letterSpacing}
    el.style.fontSize=el._of;el.style.whiteSpace=el._ow;el.style.letterSpacing=el._ol;
    if(!mob)return;
    var par=el.parentElement,pc=getComputedStyle(par);
    var avail=Math.min(par.clientWidth-parseFloat(pc.paddingLeft)-parseFloat(pc.paddingRight),window.innerWidth-40);
    var base=parseFloat(getComputedStyle(el).fontSize);
    el.style.whiteSpace='nowrap';
    var w=el.scrollWidth,mw=0;
    /* 가장 긴 줄의 실제 폭 */
    var rg=document.createRange();rg.selectNodeContents(el);[].forEach.call(rg.getClientRects(),function(r){if(r.width>mw)mw=r.width});
    w=Math.max(mw,0)||w;
    if(w<=avail){el.style.whiteSpace=el._ow;return}
    var fs=base*avail/w*0.985;
    if(fs>=10){el.style.fontSize=fs+'px'}else{el.style.whiteSpace=el._ow}
  });
}
var _ft;window.addEventListener('resize',function(){clearTimeout(_ft);_ft=setTimeout(fitAll,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){fitAll()});

/* Works 좌측 필터 (분야 / 분류 / 종목·유형 / 연도 / 인물) */
(function(){
  function setup(){
    var g=document.getElementById('works-grid'),bar=document.querySelector('.wf');if(!g||!bar||bar._w)return;bar._w=1;
    wsCss();
    var T={"filter": "Filters", "done": "View results", "svc": "Category", "sport": "Sport", "type": "Type", "year": "Year", "who": "People", "sel": "Select", "all": "All", "en": true,"field":"Field","kind":"Sport · Type","reset":"Reset","gsp":"SPORTS · Sport","gcu":"LIFESTYLE · Type"},SP=SPN,CT={performance:'Performance',event:'Event',product:'Product',other:'Other'},NM={},FN={all:'ALL',sports:'SPORTS',culture:'LIFESTYLE'};
    var SVC=[].map.call(bar.querySelectorAll('button[data-f]'),function(b){return [b.getAttribute('data-f'),b.textContent.trim()]}).filter(function(s){return s[0]!=='all'});
    var q=new URLSearchParams(location.search);
    var fq0=q.get('field')==='lifestyle'?'culture':q.get('field');var st={f:FN[fq0]?fq0:'all',svc:'',sp:q.get('sport')||'',cu:q.get('ctype')||'',y:q.get('year')||'',m:q.get('who')||''};
    var c0=q.get('cat');SVC.forEach(function(s){if(s[0]===c0)st.svc=c0});
    if(st.f==='all'){if(st.sp)st.f='sports';else if(st.cu)st.f='culture'}
    function mk(t,c,h){var e=document.createElement(t);e.className=c;if(h)e.innerHTML=h;return e}
    var wl=mk('div','wl'),side=mk('aside','ws'),main=mk('div','wm'),top=mk('div','wt'),chips=mk('div','wc'),fb=mk('button','wfb'),scrim=mk('div','wscrim');fb.type='button';
    bar.parentNode.insertBefore(wl,bar);bar.style.display='none';
    var em=document.getElementById('works-empty');
    top.appendChild(fb);var tt=mk('span','wtt'),tc=mk('span','wcnt');top.appendChild(tt);top.appendChild(tc);
    main.appendChild(top);main.appendChild(chips);main.appendChild(g);if(em)main.appendChild(em);
    wl.appendChild(side);wl.appendChild(main);document.body.appendChild(scrim);
    var sec=wl.closest('section');[sec,sec&&sec.previousElementSibling].forEach(function(s){if(s)s.classList.add('plf')});
    function cards(){return [].filter.call(g.children,function(c){return !c.classList.contains('wsec')})}
    function fld(c){return c.getAttribute('data-field')||'sports'}
    function has(c,a,v,sp){return (sp+(c.getAttribute(a)||'')+sp).indexOf(sp+v+sp)>=0}
    function pass(c,skip){
      return (skip==='f'||st.f==='all'||fld(c)===st.f)
        &&(skip==='svc'||!st.svc||has(c,'data-cat',st.svc,' '))
        &&(skip==='sp'||!st.sp||has(c,'data-sport',st.sp,' '))
        &&(skip==='cu'||!st.cu||c.getAttribute('data-ctype')===st.cu)
        &&(skip==='y'||!st.y||c.getAttribute('data-year')===st.y)
        &&(skip==='m'||!st.m||has(c,'data-mem',st.m,'|'))}
    function n(skip,fn){return cards().filter(function(c){return pass(c,skip)&&(!fn||fn(c))}).length}
    function esc2(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
    function opt(k,v,label,cnt,big){return '<button type="button" class="wo'+(big?' big':'')+'" data-k="'+k+'" data-v="'+esc2(v)+'" aria-pressed="'+((st[k]||'')===v)+'"><span>'+esc2(label)+'</span><span class="c">'+cnt+'</span></button>'}
    function grp(t,h){return '<div class="wg"><h3>'+t+'</h3>'+h+'</div>'}
    function sels(k,label,vals,fmt){
      return '<label>'+label+'<select data-sk="'+k+'" class="'+(st[k]?'on':'')+'"><option value="">'+T.sel+'</option>'+vals.map(function(v){return '<option value="'+esc2(v)+'"'+(st[k]===v?' selected':'')+'>'+esc2(fmt(v))+' ('+n(k,function(c){return k==='y'?c.getAttribute('data-year')===v:has(c,'data-mem',v,'|')})+')</option>'}).join('')+'</select></label>'}
    function uniq(attr,sep,inF){var a={};cards().forEach(function(c){if(inF&&!inF(c))return;(c.getAttribute(attr)||'').split(sep).forEach(function(x){if(x)a[x]=1})});return Object.keys(a)}
    function inField(c){return st.f==='all'||fld(c)===st.f}
    function build(){
      var act=st.f!=='all'||st.svc||st.sp||st.cu||st.y||st.m;
      var h='<div class="wsh"><button type="button" id="wdone">'+T.done+'</button></div><div class="wtop"><b>'+T.filter+'</b><button type="button" class="wrs'+(act?' on':'')+'" id="wrs">'+T.reset+'</button></div>';
      var keep=[st.sp,st.cu];st.sp='';st.cu='';var fc={};['all','sports','culture'].forEach(function(k){fc[k]=n('f',function(c){return k==='all'||fld(c)===k})});st.sp=keep[0];st.cu=keep[1];
      h+=grp(T.field,['all','sports','culture'].map(function(k){return opt('f',k,FN[k],fc[k],1)}).join(''));
      h+=grp(T.svc,opt('svc','',T.all,n('svc'))+SVC.map(function(s){return opt('svc',s[0],s[1],n('svc',function(c){return has(c,'data-cat',s[0],' ')}))}).join(''));
      var cur=st.sp?'sp:'+st.sp:st.cu?'cu:'+st.cu:'',kl=st.f==='sports'?T.sport:st.f==='culture'?T.type:T.kind,ko='<option value="">'+T.sel+'</option>';
      function kop(k,v,lab,cnt){var val=k+':'+v;return '<option value="'+esc2(val)+'"'+(cur===val?' selected':'')+'>'+esc2(lab)+' ('+cnt+')</option>'}
      if(st.f!=='culture'){var su=uniq('data-sport',' ',inField),sv=Object.keys(SP).filter(function(k){return su.indexOf(k)>=0});su.forEach(function(k){if(sv.indexOf(k)<0)sv.push(k)});
        var so=sv.map(function(k){return kop('sp',k,SP[k]||k,n('sp',function(c){return has(c,'data-sport',k,' ')}))}).join('');ko+=st.f==='all'?(so?'<optgroup label="'+T.gsp+'">'+so+'</optgroup>':''):so}
      if(st.f!=='sports'){var cu=uniq('data-ctype','|',inField),cv=Object.keys(CT).filter(function(k){return cu.indexOf(k)>=0});
        var co=cv.map(function(k){return kop('cu',k,CT[k],n('cu',function(c){return c.getAttribute('data-ctype')===k}))}).join('');ko+=st.f==='all'?(co?'<optgroup label="'+T.gcu+'">'+co+'</optgroup>':''):co}
      var kindSel='<label>'+kl+'<select data-kind="1" class="'+(cur?'on':'')+'">'+ko+'</select></label>';
      h+='<div class="wg"><div class="wsl">'+kindSel+sels('y',T.year,uniq('data-year','|',inField).sort().reverse(),function(v){return v})+sels('m',T.who,uniq('data-mem','|',inField).sort(),function(v){return NM[v]||v})+'</div></div>';
      side.innerHTML=h}
    function sync(){try{var u=new URLSearchParams();if(st.f!=='all')u.set('field',st.f);if(st.svc)u.set('cat',st.svc);if(st.sp)u.set('sport',st.sp);if(st.cu)u.set('ctype',st.cu);if(st.y)u.set('year',st.y);if(st.m)u.set('who',st.m);var t=u.toString();history.replaceState(null,'',location.pathname+(t?'?'+t:''))}catch(e){}}
    function render(){
      build();var shown=0,cnt={};
      cards().forEach(function(c){var s=pass(c);c.style.display=s?'flex':'none';if(s){shown++;cnt[fld(c)]=(cnt[fld(c)]||0)+1}});
      [].forEach.call(g.querySelectorAll('.wsec'),function(h){var v=cnt[h.getAttribute('data-f')]||0,on=st.f==='all'&&v>0;h.style.display=on?'flex':'none';var w=h.querySelector('.wn');if(w)w.textContent=v});
      tt.textContent=FN[st.f];tc.textContent=shown+' works';
      var ch='',na=st.f!=='all'?1:0,lab={svc:function(v){return (SVC.filter(function(s){return s[0]===v})[0]||[])[1]},sp:function(v){return SP[v]||v},cu:function(v){return CT[v]||v},y:function(v){return v},m:function(v){return NM[v]||v}};
      ['svc','sp','cu','y','m'].forEach(function(k){if(st[k]){na++;ch+='<button type="button" class="wchip" data-x="'+k+'">'+esc2(lab[k](st[k])||st[k])+'</button>'}});
      chips.innerHTML=ch;fb.innerHTML=T.filter+(na?' <i>'+na+'</i>':'');
      if(em)em.style.display=shown?'none':'block';sync()}
    function openS(o){side.classList.toggle('open',o);scrim.classList.toggle('open',o)}
    side.addEventListener('click',function(ev){
      var o=ev.target.closest('.wo');if(o){var k=o.getAttribute('data-k');st[k]=o.getAttribute('data-v');if(k==='f'){st.sp='';st.cu=''}render();return}
      if(ev.target.closest('#wrs')){st={f:'all',svc:'',sp:'',cu:'',y:'',m:''};render();return}
      if(ev.target.closest('#wdone'))openS(false)});
    side.addEventListener('change',function(ev){var kd=ev.target.closest('select[data-kind]');if(kd){var v=kd.value;st.sp=v.indexOf('sp:')===0?v.slice(3):'';st.cu=v.indexOf('cu:')===0?v.slice(3):'';render();return}var x=ev.target.closest('select[data-sk]');if(x){st[x.getAttribute('data-sk')]=x.value;render()}});
    chips.addEventListener('click',function(ev){var x=ev.target.closest('.wchip');if(x){st[x.getAttribute('data-x')]='';render()}});
    fb.addEventListener('click',function(){openS(true)});scrim.addEventListener('click',function(){openS(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')openS(false)});
    try{getData('team_members','select=ko:name,en:name_en&published=eq.true').then(function(t){(t||[]).forEach(function(m){if(T.en&&m.en)NM[m.ko]=m.en});render()}).catch(function(){})}catch(e){}
    window.__wfApply=render;render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
function reel(){
  [].forEach.call(document.querySelectorAll('#reel'),function(sec){
    if(sec._r)return;var row=sec.querySelector('.reel-row');if(!row)return;sec._r=1;
    /* 속도: 다른 롤링과 같은 px/초 (PC 46.6, 모바일 180) */
    function speed(){
      var half=row.scrollWidth/2;if(!half)return;
      var v=window.matchMedia('(max-width:640px)').matches?180:46.6;
      row.style.animationDuration=(half/v)+'s';
    }
    function slide(w,hid){
      var cat=tagOf(w).toUpperCase();
      return '<a class="reel-slide" href="/en/'+esc(wHref(w))+'"><img src="'+esc(thumbOf(w))+'" alt="'+(hid?'':esc(w.title))+'"'+(hid?' aria-hidden="true"':'')+' style="object-position: '+tx(w)+'% '+ty(w)+'%; transform: scale('+tz(w)/100+'); transform-origin: '+tx(w)+'% '+ty(w)+'%"><div class="reel-cap"><small>'+cat+'</small><b>'+esc(w.title)+'</b></div></a>';
    }
    /* 관리자 페이지의 작업물·썸네일과 연동 */
    if(window.sbGet)window.sbGet('works','select=*&published=eq.true&field=neq.culture&order=sort_order.asc').then(function(rows){
      rows=(rows||[]).filter(function(w){return thumbOf(w)});
      if(rows.length){row.innerHTML=rows.map(function(w){return slide(w,0)}).join('')+rows.map(function(w){return slide(w,1)}).join('');row.style.animation='none';void row.offsetWidth;row.style.animation='';}
    }).catch(function(){}).then(function(){setTimeout(speed,50);var im=row.querySelectorAll('img'),n=im.length;[].forEach.call(im,function(i){i.addEventListener('load',speed)})});
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(speed,150)});
    speed();
    /* 모바일: iOS·안드로이드 모두 같은 속도가 되도록 CSS 대신 시간 기준(px/초)으로 직접 굴립니다. 다른 롤링(.mq)과 같은 32px/초 */
    var mm=window.matchMedia('(max-width:640px)'),last=performance.now();
    function mtick(t){
      var dt=Math.min(t-last,64);last=t;
      if(mm.matches){
        row._js=1;if(row.style.animationName!=='none')row.style.animation='none';
        var gap=parseFloat(getComputedStyle(row).columnGap||getComputedStyle(row).gap)||0,half=(row.scrollWidth+gap)/2;
        if(half>gap){row._x=((row._x||0)+0.032*dt)%half;row.style.transform='translate3d('+(-row._x).toFixed(2)+'px,0,0)';}
      }else if(row._js){row._js=0;row._x=0;row.style.animation='';row.style.transform='';}
      requestAnimationFrame(mtick);
    }
    requestAnimationFrame(mtick);
  });
}
function init(){
  var app=$('#app');
  if(app){var k=app.getAttribute('data-page');if(k==='work')workDetail(app);else if(k==='news')newsDetail(app)}
  var r=$('#dc-root');
  if(!r){var pp=bindLists();Promise.all(pp||[]).then(fitAll,fitAll);setTimeout(fitAll,400);return}
  /* 홈·Careers 등은 화면이 나중에 그려지고, 탭 클릭 등으로 다시 그려지면 바인딩이 지워지므로 다시 적용합니다 */
  var obs=new MutationObserver(function(){clearTimeout(obs.t);obs.t=setTimeout(run,60)});
  function vids(){[].forEach.call(r.querySelectorAll('video'),function(v){v.muted=true;v.defaultMuted=true;v.setAttribute('playsinline','');if(v.paused){var q=v.play();if(q&&q.catch)q.catch(function(){})}})}
  ['touchstart','click','scroll'].forEach(function(e){window.addEventListener(e,vids,{once:true,passive:true})});
  /* 모바일: 자동 롤링은 유지하면서 손으로 잡고 밀어볼 수 있게 합니다 */
  var mqOn=false;
  function mqs(){
    if(mqOn||!window.matchMedia('(max-width:640px)').matches)return;
    if(!r.querySelector('.mq'))return;mqOn=true;
    var last=performance.now();
    function tick(t){
      var dt=Math.min(t-last,64);last=t;
      [].forEach.call(document.querySelectorAll('.mq'),function(m,i){
        var it=m.querySelectorAll('.mq-item');if(it.length<8)return;
        var set=0;for(var k=1;k<it.length;k++){if(it[k].textContent===it[0].textContent){set=it[k].offsetLeft-it[0].offsetLeft;break}}if(!set)return;
        var rev=m.classList.contains('rev');
        if(m._x==null){m._x=rev?set:0;m.scrollLeft=m._x;m.addEventListener('scroll',function(){if(m._self){m._self=false;return}m._hold=performance.now()+1600;m._x=m.scrollLeft},{passive:true});['touchstart','pointerdown'].forEach(function(e){m.addEventListener(e,function(){m._hold=performance.now()+1e9},{passive:true})});['touchend','touchcancel','pointerup'].forEach(function(e){m.addEventListener(e,function(){m._hold=performance.now()+1600},{passive:true})})}
        if(m._hold&&t<m._hold)return;
        m._x+=(rev?-1:1)*0.032*dt*(rev?0.8:1)*1;
        if(m._x>=set)m._x-=set;if(m._x<=0)m._x+=set;
        m._self=true;m.scrollLeft=m._x;
      });
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function run(){obs.disconnect();vids();reel();mqs();setTimeout(mqs,500);setTimeout(vids,600);var p=bindLists();Promise.all(p||[]).then(function(){},function(){}).then(function(){fitAll();obs.takeRecords();obs.observe(r,{childList:true,subtree:true})})}
  if(r.firstElementChild)run();else{var n=0,t=setInterval(function(){if(r.firstElementChild||++n>80){clearInterval(t);run()}},100)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* contact popup */
(function(){
  var TO='buff.universe@gmail.com',el=null;
  function css(){if(document.getElementById('cm-css'))return;var st=document.createElement('style');st.id='cm-css';
  st.textContent='#cm{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}#cm .cd{position:relative;background:#fff;border-radius:24px;max-width:560px;width:100%;padding:40px 36px 36px;box-sizing:border-box;color:#1D1D1F;font-family:inherit}#cm h3{margin:0 0 6px;font-size:26px;letter-spacing:-.02em}#cm p{margin:0 0 22px;font-size:15px;color:#6E6E73}#cm label{display:block;font-size:13px;font-weight:600;margin:14px 0 6px}#cm input,#cm textarea{width:100%;box-sizing:border-box;font:inherit;font-size:17px;border:1px solid #D2D2D7;border-radius:12px;padding:12px 14px;outline:none;background:#fff}#cm input:focus,#cm textarea:focus{border-color:#1D1D1F}#cm textarea{min-height:120px;resize:vertical}#cm .x{position:absolute;top:14px;right:16px;width:36px;height:36px;border:0;background:none;font-size:26px;line-height:1;cursor:pointer;color:#6E6E73}#cm .go{display:block;margin-top:22px;text-align:center;background:#1D1D1F;color:#fff;border-radius:980px;padding:14px 20px;font-size:16px;font-weight:600;text-decoration:none;opacity:.35;pointer-events:none}#cm .go.on{opacity:1;pointer-events:auto}@media(max-width:640px){#cm .cd{padding:32px 20px 24px;border-radius:20px}#cm h3{font-size:22px}}';
  document.head.appendChild(st)}
  function close(){if(el){el.remove();el=null;document.body.style.overflow=''}}
  function open(){
    if(el)return;css();
    el=document.createElement('div');el.id='cm';
    el.innerHTML='<div class="cd" role="dialog" aria-modal="true" aria-label="Contact us via Gmail"><button class="x" aria-label="Close">×</button><h3>Contact us via Gmail</h3><p>Your details are automatically filled in a new Gmail message. Review the message in Gmail, then send it.</p><label>Name / Organization</label><input id="cm-n" placeholder="Jane Doe / Team or organization"><label>Contact (email or phone)</label><input id="cm-c" placeholder="example@email.com"><label>Message</label><textarea id="cm-m" placeholder="Which sport, and what kind of work do you need?"></textarea><a class="go" id="cm-g" target="_blank" rel="noopener">Open Gmail to compose</a></div>';
    document.body.appendChild(el);document.body.style.overflow='hidden';
    var n=el.querySelector('#cm-n'),c=el.querySelector('#cm-c'),m=el.querySelector('#cm-m'),g=el.querySelector('#cm-g');
    function upd(){var ok=n.value.trim()&&c.value.trim()&&m.value.trim();g.classList.toggle('on',!!ok);
      var body='Name/Organization: '+n.value.trim()+'\nContact: '+c.value.trim()+'\n\n'+m.value.trim();
      g.href='https://mail.google.com/mail/?view=cm&fs=1&to='+TO+'&su='+encodeURIComponent('[BUFF Inquiry] '+n.value.trim())+'&body='+encodeURIComponent(body)}
    [n,c,m].forEach(function(i){i.addEventListener('input',upd)});upd();
    el.addEventListener('click',function(e){if(e.target===el||e.target.className==='x')close()});
    setTimeout(function(){n.focus()},50);
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href="#contact"]');
    if(a){e.preventDefault();open()}
  },true);
})();

/* clean home URL */
(function(){
  try{if(/\.html$/.test(location.pathname)){history.replaceState(null,'',location.pathname.replace(/\/index\.html$/,'/').replace(/\.html$/,'')+location.search)}}catch(e){}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href="/"]');
    if(a&&location.pathname==='/'&&!e.metaKey&&!e.ctrlKey){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});if(location.hash)history.replaceState(null,'','/')}
  });
})();

/* KO / EN 전환 링크: 지금 보고 있는 같은 페이지의 다른 언어 주소로 연결 */
(function(){
  function sync(){
    var a=document.querySelector('header nav a.lang');if(!a)return;
    var p=location.pathname,en=/^\/en(\/|$)/.test(p);
    var t=en?(p.replace(/^\/en/,'')||'/'):('/en'+(p==='/'?'/':p));
    a.href=t+location.search+location.hash;
  }
  sync();document.addEventListener('DOMContentLoaded',sync);window.addEventListener('load',sync);setTimeout(sync,600);
})();
(function(){
  /* 모바일 상단 헤더: KO | EN 대신 지구본 아이콘 (인라인 !important 스타일을 덮어써야 해서 JS로 처리) */
  var mq=window.matchMedia('(max-width:640px)'),SVG='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" style="display:block"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.8 2.7 4.2 5.9 4.2 9.5s-1.4 6.8-4.2 9.5c-2.8-2.7-4.2-5.9-4.2-9.5s1.4-6.8 4.2-9.5z"/></svg>';
  function apply(){
    var a=document.querySelector('header nav a.lang');if(!a)return;
    var st=['border','padding','margin-left','display','height','width','align-items'];
    if(mq.matches){
      if(a.dataset.orig!=null&&a.querySelector('svg'))return;
      if(a.dataset.orig==null){a.dataset.orig=a.innerHTML;a.dataset.style=a.getAttribute('style')||''}
      a.innerHTML=SVG;a.setAttribute('aria-label',/^\/en(\/|$)/.test(location.pathname)?'한국어':'English');
      a.style.setProperty('border','0','important');a.style.setProperty('padding','4px 2px 4px 6px','important');a.style.setProperty('margin-left','2px','important');
      a.style.setProperty('display','inline-flex','important');a.style.setProperty('align-items','center','important');
    }else if(a.dataset.orig!=null){
      a.innerHTML=a.dataset.orig;a.setAttribute('style',a.dataset.style);a.removeAttribute('aria-label');delete a.dataset.orig;delete a.dataset.style;
    }
  }
  apply();document.addEventListener('DOMContentLoaded',apply);window.addEventListener('load',apply);setTimeout(apply,600);
  (mq.addEventListener?mq.addEventListener('change',apply):mq.addListener(apply));
  try{var t=null;new MutationObserver(function(){clearTimeout(t);t=setTimeout(apply,50)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();
