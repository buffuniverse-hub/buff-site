(function(){
var __M={};function getData(t,q){var k=t+'?'+q;return __M[k]||(__M[k]=window.sbGet(t,q).catch(function(e){delete __M[k];throw e}))}
var $=function(s,r){return(r||document).querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var br=function(s){return esc(s).replace(/\n/g,'<br>')};
var CAT={photo:['Photo','Photo.html'],video:['Video','Video.html'],branding:['Branding','Branding.html']};
function ytId(u){var m=String(u||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);return m?m[1]:''}

function workCard(w){
  return '<a href="work.html?id='+esc(w.id)+'" style="flex: 1 1 480px; min-width: 0; text-decoration: none; display: flex; flex-direction: column; align-items: stretch; text-align: center; gap: 8px; cursor: pointer">'
  +'<img draggable="false" src="'+esc(w.thumbnail_url)+'" alt="'+esc(w.title)+'" style="pointer-events: none; display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 18px; background: #F5F5F7; margin-bottom: 16px">'
  +'<span style="pointer-events: none; font-size: 24px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; color: #1D1D1F">'+esc(w.title)+'</span>'
  +'<span style="pointer-events: none; font-size: 17px; font-weight: 400; line-height: 1.47; color: #6E6E73">'+esc(w.tag||CAT[w.category][0])+'</span></a>';
}
function newsRow(n){
  var yr=n.published_at?String(n.published_at).slice(0,4):'';
  return '<a href="news-view.html?id='+esc(n.id)+'" style="border-bottom: 1px solid #D2D2D7; display: flex; flex-wrap: wrap; align-items: center; gap: 24px 40px; padding: 40px 0; text-decoration: none; color: #1D1D1F">'
  +(n.thumbnail_url?'<img src="'+esc(n.thumbnail_url)+'" alt="'+esc(n.title_line1)+'" draggable="false" style="flex: 0 0 360px; max-width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 18px; background: #F5F5F7; display: block">':'')
  +'<div style="flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 12px; text-align: left">'
  +'<span style="font-size: 17px; font-weight: 600; color: #6E6E73">'+esc(n.category)+(yr?' · '+yr:'')+'</span>'
  +'<span style="font-size: 28px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em; word-break: keep-all">'+esc(n.title_line1)+(n.title_line2?'<br>'+esc(n.title_line2):'')+'</span>'
  +(n.summary?'<span style="font-size: 17px; line-height: 1.6; color: #424245; word-break: keep-all">'+esc(n.summary)+'</span>':'')
  +'</div></a>';
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
    jobs.push(getData('works','select=*&published=eq.true&category=eq.'+cat+'&order=sort_order.asc,created_at.asc').then(function(r){if(r.length)wl.innerHTML=r.map(workCard).join('')}))}
  var wf=$('[data-sb="works-featured"]');
  if(wf)jobs.push(getData('site_settings','select=*&key=eq.home_featured').catch(function(){return[]}).then(function(rows){
    var ids=rows[0]&&rows[0].value?String(rows[0].value).split(',').filter(Boolean):[];
    var q=ids.length?getData('works','select=*&published=eq.true&id=in.('+ids.join(',')+')').then(function(r){return ids.map(function(i){return r.filter(function(w){return w.id===i})[0]}).filter(Boolean)}):getData('works','select=*&published=eq.true&featured=eq.true&order=sort_order.asc,created_at.asc&limit=4');
    return q}).then(function(r){if(r.length)wf.innerHTML=r.map(workCard).join('')}));
  if($('[data-sb="home-lead"]'))jobs.push(getData('site_settings','select=*').then(function(rows){
    var s={};rows.forEach(function(x){s[x.key]=x.value});
    function t(k,sel,html){var e=$(sel);if(e&&s[k])e.innerHTML=html?br(s[k]):esc(s[k])}
    t('home_lead','[data-sb="home-lead"]');t('home_tail','[data-sb="home-tail"]');t('home_text','[data-sb="home-text"]',1);t('home_btn1','[data-sb="home-btn1"]');t('home_btn2','[data-sb="home-btn2"]');t('home_works_title','[data-sb="home-works-title"]');
  }));
  var nl=$('[data-sb="news-list"]');
  if(nl)jobs.push(getData('news','select=*&published=eq.true&order=sort_order.asc,published_at.desc').then(function(r){nl.innerHTML=r.length?r.map(newsRow).join(''):'<p style="text-align:center;color:#6E6E73;font-size:19px;padding:80px 0">등록된 소식이 없습니다.</p>'}));
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
  return jobs.map(function(j){return j.catch(function(){})});
}

function pill(t){return '<span style="padding: 8px 14px; border-radius: 999px; background: #F5F5F7; font-size: 15px; font-weight: 500; color: #1D1D1F">#'+esc(t)+'</span>'}

var WK_CSS='.wk-sec{background:#FFFFFF;padding:32px 0 96px}.wk-wrap{max-width:1200px;margin:0 auto;padding:0 40px;box-sizing:border-box;display:flex;flex-wrap:wrap;gap:48px;align-items:flex-start}.wk-side{flex:0 0 340px;max-width:100%;min-width:0;display:flex;flex-direction:column;gap:24px;word-break:keep-all}.wk-mwrap{flex:1 1 480px;min-width:0;position:relative}.wk-media{min-width:0;display:flex;flex-direction:column;gap:24px}.wk-media>*{flex:none}.wk-more{display:none}.wk-titlerow{max-width:1200px;margin:0 auto;padding:0 40px 28px;box-sizing:border-box;display:flex;align-items:center;gap:16px}.wk-pdf{flex:0 0 auto;display:block;line-height:0;transition:transform .15s}.wk-pdf:hover{transform:translateY(-2px)}.wk-h1{flex:1 1 auto;min-width:0;margin:0;font-size:40px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;color:#1D1D1F;white-space:nowrap;overflow:hidden}@media(max-width:640px){.wk-titlerow{padding:0 20px 20px}.wk-h1{font-size:26px}.wk-pdf svg{width:26px;height:32px}}'
 +'@media (min-width:900px){.wk-sec{padding:24px 0 56px}.wk-wrap{flex-wrap:nowrap;height:calc(100vh - 150px);min-height:520px}.wk-side{height:100%;overflow-y:auto;scrollbar-width:none}.wk-side::-webkit-scrollbar{display:none}.wk-mwrap{height:100%}.wk-media{height:100%;overflow-y:auto;overscroll-behavior:auto;scrollbar-width:none;-ms-overflow-style:none}.wk-more{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:48px;height:48px;border-radius:50%;border:0;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:opacity .25s;animation:wkbob 1.6s ease-in-out infinite;backdrop-filter:blur(6px)}.wk-more.off{opacity:0;pointer-events:none}.wk-more:hover{background:rgba(0,0,0,.9)}@keyframes wkbob{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,5px)}}.wk-media::-webkit-scrollbar{display:none}}';
var PLAY='<span style="position: absolute; left: 50%; top: 50%; width: 88px; height: 88px; margin: -44px 0 0 -44px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center"><svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path fill="#1D1D1F" d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"></path></svg></span>';

function wireMore(app){
  var m=app.querySelector('.wk-media'),b=app.querySelector('.wk-more');if(!m||!b)return;
  function upd(){var more=m.scrollHeight-m.clientHeight>8&&m.scrollTop+m.clientHeight<m.scrollHeight-8;b.classList.toggle('off',!more)}
  m.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);
  [].forEach.call(m.querySelectorAll('img'),function(i){if(!i.complete)i.addEventListener('load',upd)});
  b.onclick=function(){m.scrollBy({top:Math.round(m.clientHeight*.8),behavior:'smooth'})};
  upd();setTimeout(upd,600);
}
function pdfUrl(u){u=String(u||'').trim();if(!u)return '';var m=u.match(/drive\.google\.com\/file\/d\/([^\/?#]+)/)||u.match(/[?&]id=([^&#]+)/);if(/drive\.google\.com|docs\.google\.com/.test(u)&&m)return 'https://drive.google.com/uc?export=download&id='+m[1];return u}
function fitTitle(app){var h=app.querySelector('.wk-h1');if(!h)return;function f(){h.style.fontSize='';var fs=parseFloat(getComputedStyle(h).fontSize);while(h.scrollWidth>h.clientWidth&&fs>14){fs-=1;h.style.fontSize=fs+'px'}}f();window.addEventListener('resize',f);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(f)}
function workDetail(app){
  var st=document.createElement('style');st.textContent=WK_CSS;document.head.appendChild(st);
  var id=new URLSearchParams(location.search).get('id');
  if(!id){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">이 작업물은 준비 중입니다</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">자체 화면으로 준비하고 있어요.<br>조금만 기다려 주세요.</p><a href="index.html" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">홈으로 돌아가기</a></div>';return}
  Promise.all([getData('works','select=*&id=eq.'+encodeURIComponent(id)),getData('team_members','select=name,role_en,avatar_url&published=eq.true')]).then(function(res){
    var w=res[0][0],team=res[1];
    if(!w){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">이 작업물은 준비 중입니다</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">자체 화면으로 준비하고 있어요.<br>조금만 기다려 주세요.</p><a href="index.html" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">홈으로 돌아가기</a></div>';return}
    document.title='BUFF UNIVERSE — '+w.title;
    var c=CAT[w.category]||CAT.photo;
    var mem=(w.members||[]).map(function(n){var t=team.filter(function(x){return x.name===n})[0]||{};
      return '<div style="display: flex; align-items: center; gap: 12px">'+(t.avatar_url?'<img src="'+esc(t.avatar_url)+'" alt="'+esc(n)+'" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; object-position: top center; background: #F5F5F7">':'')+'<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 700; color: #1D1D1F">'+esc(n)+'</span>'+(t.role_en?'<span style="font-size: 14px; color: #6E6E73">'+esc(t.role_en)+'</span>':'')+'</div></div>'}).join('');
    var media='';
    (Array.isArray(w.videos)?w.videos:[]).forEach(function(v){var i=ytId(v.url);if(!v.url)return;
      var poster=v.poster||(i?'https://i.ytimg.com/vi/'+i+'/maxresdefault.jpg':'');
      media+='<a href="'+esc(v.url)+'" target="_blank" rel="noopener" aria-label="'+esc((w.title+' '+(v.label||''))+' 영상 재생')+'" style="position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; flex: none; border-radius: 18px; overflow: hidden; background: #000000; text-decoration: none">'+(poster?'<img src="'+esc(poster)+'" alt="'+esc(w.title+' '+(v.label||''))+'" draggable="false" style="display: block; width: 100%; height: 100%; object-fit: contain; background: #000">':'')+PLAY+'</a>'});
    (w.images||[]).forEach(function(u){media+='<img src="'+esc(u)+'" alt="'+esc(w.title)+'" style="display: block; width: 100%; border-radius: 18px; '+(w.category==='photo'?'aspect-ratio: 3 / 2; object-fit: cover;':'height: auto;')+' background: #F5F5F7">'});
    app.innerHTML='<section style="background: #FFFFFF; padding: 40px 0 0"><div style="max-width: 1200px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box"><a href="'+c[1]+'" style="font-size: 17px; font-weight: 500; color: #6E6E73; text-decoration: none">‹ '+c[0]+'</a></div></section>'
    +'<section class="wk-sec"><div class="wk-titlerow"><h1 class="wk-h1">'+esc(w.title)+'</h1>'+(pdfUrl(w.pdf_url)?'<a class="wk-pdf" href="'+esc(pdfUrl(w.pdf_url))+'" target="_blank" rel="noopener" title="포트폴리오 PDF 다운로드" aria-label="포트폴리오 PDF 다운로드"><svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true"><path d="M4 0h19l13 13v27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#E5322D"/><path d="M23 0l13 13H27a4 4 0 0 1-4-4z" fill="#F5A3A0"/><text x="18" y="35" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11" fill="#fff">PDF</text></svg></a>':'')+'</div><div class="wk-wrap">'
    +'<aside class="wk-side">'
    +((w.tags||[]).length?'<div style="display: flex; flex-wrap: wrap; gap: 8px">'+w.tags.map(pill).join('')+'</div>':'')
    +(w.description?'<div style="border-top: 1px solid #D2D2D7; padding-top: 24px"><div style="font-size: 17px; font-weight: 700; margin-bottom: 16px; color: #1D1D1F">프로젝트 설명</div><div style="font-size: 16px; line-height: 1.75; color: #424245; white-space: pre-line">'+esc(w.description)+'</div></div>':'')
    +(mem?'<div style="border-top: 1px solid #D2D2D7; padding-top: 24px; display: flex; flex-direction: column; gap: 16px"><div style="font-size: 17px; font-weight: 700; color: #1D1D1F">참여 멤버</div>'+mem+'</div>':'')
    +'</aside><div class="wk-mwrap"><div class="wk-media">'+media+'</div><button type="button" class="wk-more off" aria-label="아래로 더 보기"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button></div></div></section>';
    wireMore(app);fitTitle(app);
  }).catch(function(){app.innerHTML='<p style="padding:120px 40px;text-align:center">불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
}
function newsDetail(app){
  var id=new URLSearchParams(location.search).get('id');
  if(!id){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">이 소식은 준비 중입니다</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">자체 화면으로 준비하고 있어요.<br>조금만 기다려 주세요.</p><a href="index.html" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">홈으로 돌아가기</a></div>';return}
  getData('news','select=*,works(id,category)&id=eq.'+encodeURIComponent(id)).then(function(r){
    var n=r[0];if(!n){app.innerHTML='<div style="padding:140px 24px 160px;text-align:center;word-break:keep-all"><p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#1D1D1F">이 소식은 준비 중입니다</p><p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#6E6E73">자체 화면으로 준비하고 있어요.<br>조금만 기다려 주세요.</p><a href="index.html" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#1D1D1F;color:#fff;text-decoration:none;font-size:15px">홈으로 돌아가기</a></div>';return}
    document.title='BUFF UNIVERSE — '+n.title_line1;
    var yr=n.published_at?String(n.published_at).slice(0,4):'';
    var paras=String(n.body||'').split(/\n{2,}/).filter(Boolean).map(function(p){return '<p style="margin: 0 0 24px; font-size: 19px; line-height: 1.8; color: #1D1D1F; word-break: keep-all">'+br(p)+'</p>'}).join('');
    app.innerHTML='<section style="background: #FFFFFF; padding: 96px 0 0"><div style="max-width: 1040px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center"><span style="font-size: 19px; font-weight: 600; color: #6E6E73">'+esc(n.category)+(yr?' · '+yr:'')+'</span><h1 style="margin: 0; font-size: 40px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: #1D1D1F; word-break: keep-all">'+esc(n.title_line1)+(n.title_line2?'<br>'+esc(n.title_line2):'')+'</h1></div></section>'
    +'<section style="background: #FFFFFF; padding: 56px 0 120px"><div style="max-width: 900px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box">'
    +(n.thumbnail_url?'<img src="'+esc(n.thumbnail_url)+'" alt="'+esc(n.title_line1)+'" style="display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 18px; background: #F5F5F7; margin-bottom: 48px">':'')
    +paras+'<div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #D2D2D7; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px"><a href="News.html" style="font-size: 19px; font-weight: 600; color: #1D1D1F; text-decoration: none">‹ 목록으로</a>'
    +(n.work_id?'<a href="work.html?id='+esc(n.work_id)+'" style="font-size: 19px; font-weight: 600; color: #1D1D1F; text-decoration: none">프로젝트 보기 ›</a>':'')+'</div></div></section>';
  }).catch(function(){app.innerHTML='<p style="padding:120px 40px;text-align:center">불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
}
/* 모바일: 줄바꿈(<br>)으로 나눈 문장은 글자를 줄여서 한 줄씩 들어가게 맞춥니다 (너무 작아지면 원래대로 줄바꿈) */
function fitAll(){
  var mob=window.matchMedia('(max-width:640px)').matches;
  [].forEach.call(document.querySelectorAll('p br,h1 br,h2 br,h3 br,div br,span br'),function(b){
    var el=b.parentElement;if(!el||el._fit===1||el.closest('header,nav,button'))return;
    el._fit=1;
  });
  [].forEach.call(document.querySelectorAll('p,h1,h2,h3,div,span'),function(el){
    if(el._fit!==1)return;
    el.style.fontSize='';el.style.whiteSpace='';el.style.letterSpacing='';
    if(!mob)return;
    var par=el.parentElement,pc=getComputedStyle(par);
    var avail=Math.min(par.clientWidth-parseFloat(pc.paddingLeft)-parseFloat(pc.paddingRight),window.innerWidth-40);
    var base=parseFloat(getComputedStyle(el).fontSize);
    el.style.whiteSpace='nowrap';
    var w=el.scrollWidth,mw=0;
    /* 가장 긴 줄의 실제 폭 */
    var rg=document.createRange();rg.selectNodeContents(el);[].forEach.call(rg.getClientRects(),function(r){if(r.width>mw)mw=r.width});
    w=Math.max(mw,0)||w;
    if(w<=avail){el.style.whiteSpace='';return}
    var fs=base*avail/w*0.985;
    if(fs>=10){el.style.fontSize=fs+'px'}else{el.style.whiteSpace=''}
  });
}
var _ft;window.addEventListener('resize',function(){clearTimeout(_ft);_ft=setTimeout(fitAll,150)});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){fitAll()});
function init(){
  var app=$('#app');
  if(app){var k=app.getAttribute('data-page');if(k==='work')workDetail(app);else if(k==='news')newsDetail(app)}
  var r=$('#dc-root');
  if(!r){var pp=bindLists();Promise.all(pp||[]).then(fitAll,fitAll);setTimeout(fitAll,400);return}
  /* 홈·Career 등은 화면이 나중에 그려지고, 탭 클릭 등으로 다시 그려지면 바인딩이 지워지므로 다시 적용합니다 */
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
  function run(){obs.disconnect();vids();mqs();setTimeout(mqs,500);setTimeout(vids,600);var p=bindLists();Promise.all(p||[]).then(function(){},function(){}).then(function(){fitAll();obs.takeRecords();obs.observe(r,{childList:true,subtree:true})})}
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
    el.innerHTML='<div class="cd" role="dialog" aria-modal="true" aria-label="문의하기"><button class="x" aria-label="닫기">×</button><h3>문의하기</h3><p>남겨주시면 메일로 이어집니다. 확인 후 빠르게 답변드릴게요.</p><label>이름 / 소속</label><input id="cm-n" placeholder="홍길동 / 팀·단체명"><label>연락처 (이메일 또는 전화)</label><input id="cm-c" placeholder="example@email.com"><label>문의 내용</label><textarea id="cm-m" placeholder="어떤 종목, 어떤 작업이 필요하신가요?"></textarea><a class="go" id="cm-g" target="_blank" rel="noopener">메일로 문의 보내기</a></div>';
    document.body.appendChild(el);document.body.style.overflow='hidden';
    var n=el.querySelector('#cm-n'),c=el.querySelector('#cm-c'),m=el.querySelector('#cm-m'),g=el.querySelector('#cm-g');
    function upd(){var ok=n.value.trim()&&c.value.trim()&&m.value.trim();g.classList.toggle('on',!!ok);
      var body='이름/소속: '+n.value.trim()+'\n연락처: '+c.value.trim()+'\n\n'+m.value.trim();
      g.href='https://mail.google.com/mail/?view=cm&fs=1&to='+TO+'&su='+encodeURIComponent('[BUFF 문의] '+n.value.trim())+'&body='+encodeURIComponent(body)}
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
