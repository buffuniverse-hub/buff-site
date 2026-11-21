(function(){
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
  var img='<img src="'+esc(c.logo_url)+'" alt="'+esc(c.name)+'" style="display: block; width: auto; max-width: 62%; max-height: 56%; object-fit: contain">';
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
    jobs.push(sbGet('works','select=*&published=eq.true&category=eq.'+cat+'&order=sort_order.asc,created_at.asc').then(function(r){if(r.length)wl.innerHTML=r.map(workCard).join('')}))}
  var wf=$('[data-sb="works-featured"]');
  if(wf)jobs.push(sbGet('works','select=*&published=eq.true&featured=eq.true&order=sort_order.asc,created_at.asc&limit=4').then(function(r){if(r.length)wf.innerHTML=r.map(workCard).join('')}));
  var nl=$('[data-sb="news-list"]');
  if(nl)jobs.push(sbGet('news','select=*&published=eq.true&order=sort_order.asc,published_at.desc').then(function(r){nl.innerHTML=r.length?r.map(newsRow).join(''):'<p style="text-align:center;color:#6E6E73;font-size:19px;padding:80px 0">등록된 소식이 없습니다.</p>'}));
  var cl=$('[data-sb="clients"]');
  if(cl)jobs.push(sbGet('clients','select=*&published=eq.true&order=sort_order.asc').then(function(r){r=r.filter(function(c){return c.logo_url});if(r.length)cl.innerHTML=r.map(function(c){return clientItem(c)}).join('')+r.map(function(c){return clientItem(c,1)}).join('')}));
  var ps=$('[data-sb="positions"]');
  if(ps)jobs.push(sbGet('career_positions','select=*&is_open=eq.true&order=sort_order.asc').then(function(r){if(r.length)ps.innerHTML=r.map(positionCard).join('')}));
  if($('[data-sb="career-headline"]'))jobs.push(sbGet('site_settings','select=*').then(function(rows){
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
}

function pill(t){return '<span style="padding: 8px 14px; border-radius: 999px; background: #F5F5F7; font-size: 15px; font-weight: 500; color: #1D1D1F">#'+esc(t)+'</span>'}
var PLAY='<span style="position: absolute; left: 50%; top: 50%; width: 88px; height: 88px; margin: -44px 0 0 -44px; border-radius: 50%; background: rgba(255,255,255,0.92); display: flex; align-items: center; justify-content: center"><svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path fill="#1D1D1F" d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"></path></svg></span>';
function workDetail(app){
  var id=new URLSearchParams(location.search).get('id');
  if(!id){app.innerHTML='<p style="padding:120px 40px;text-align:center">작업물을 찾을 수 없습니다.</p>';return}
  Promise.all([sbGet('works','select=*&id=eq.'+encodeURIComponent(id)),sbGet('team_members','select=name,role_en,avatar_url&published=eq.true')]).then(function(res){
    var w=res[0][0],team=res[1];
    if(!w){app.innerHTML='<p style="padding:120px 40px;text-align:center">작업물을 찾을 수 없습니다.</p>';return}
    document.title='BUFF UNIVERSE — '+w.title;
    var c=CAT[w.category]||CAT.photo;
    var mem=(w.members||[]).map(function(n){var t=team.filter(function(x){return x.name===n})[0]||{};
      return '<div style="display: flex; align-items: center; gap: 12px">'+(t.avatar_url?'<img src="'+esc(t.avatar_url)+'" alt="'+esc(n)+'" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; object-position: top center; background: #F5F5F7">':'')+'<div style="display: flex; flex-direction: column; gap: 2px"><span style="font-size: 16px; font-weight: 700; color: #1D1D1F">'+esc(n)+'</span>'+(t.role_en?'<span style="font-size: 14px; color: #6E6E73">'+esc(t.role_en)+'</span>':'')+'</div></div>'}).join('');
    var media='';
    (Array.isArray(w.videos)?w.videos:[]).forEach(function(v){var i=ytId(v.url);if(!v.url)return;
      var poster=v.poster||(i?'https://i.ytimg.com/vi/'+i+'/maxresdefault.jpg':'');
      media+='<a href="'+esc(v.url)+'" target="_blank" rel="noopener" aria-label="'+esc((w.title+' '+(v.label||''))+' 영상 재생')+'" style="position: relative; display: block; width: 100%; aspect-ratio: 16 / 9; border-radius: 18px; overflow: hidden; background: #000000; text-decoration: none">'+(poster?'<img src="'+esc(poster)+'" alt="'+esc(w.title+' '+(v.label||''))+'" draggable="false" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover">':'')+PLAY+'</a>'});
    (w.images||[]).forEach(function(u){media+='<img src="'+esc(u)+'" alt="'+esc(w.title)+'" style="display: block; width: 100%; border-radius: 18px; '+(w.category==='photo'?'aspect-ratio: 3 / 2; object-fit: cover;':'height: auto;')+' background: #F5F5F7">'});
    app.innerHTML='<section style="background: #FFFFFF; padding: 40px 0 0"><div style="max-width: 1200px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box"><a href="'+c[1]+'" style="font-size: 17px; font-weight: 500; color: #6E6E73; text-decoration: none">‹ '+c[0]+'</a></div></section>'
    +'<section style="background: #FFFFFF; padding: 32px 0 96px"><div style="max-width: 1200px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box; display: flex; flex-wrap: wrap; gap: 48px; align-items: flex-start">'
    +'<aside style="flex: 0 0 340px; max-width: 100%; min-width: 0; position: sticky; top: 96px; align-self: flex-start; display: flex; flex-direction: column; gap: 24px; word-break: keep-all"><h1 style="margin: 0; font-size: 28px; font-weight: 700; line-height: 1.35; letter-spacing: -0.01em; color: #1D1D1F">'+esc(w.title)+'</h1>'
    +((w.tags||[]).length?'<div style="display: flex; flex-wrap: wrap; gap: 8px">'+w.tags.map(pill).join('')+'</div>':'')
    +(w.description?'<div style="border-top: 1px solid #D2D2D7; padding-top: 24px"><div style="font-size: 17px; font-weight: 700; margin-bottom: 16px; color: #1D1D1F">프로젝트 설명</div><div style="font-size: 16px; line-height: 1.75; color: #424245; white-space: pre-line">'+esc(w.description)+'</div></div>':'')
    +(mem?'<div style="border-top: 1px solid #D2D2D7; padding-top: 24px; display: flex; flex-direction: column; gap: 16px"><div style="font-size: 17px; font-weight: 700; color: #1D1D1F">참여 멤버</div>'+mem+'</div>':'')
    +'</aside><div style="flex: 1 1 480px; min-width: 0; display: flex; flex-direction: column; gap: 24px">'+media+'</div></div></section>';
  }).catch(function(){app.innerHTML='<p style="padding:120px 40px;text-align:center">불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
}
function newsDetail(app){
  var id=new URLSearchParams(location.search).get('id');
  if(!id){app.innerHTML='<p style="padding:120px 40px;text-align:center">소식을 찾을 수 없습니다.</p>';return}
  sbGet('news','select=*,works(id,category)&id=eq.'+encodeURIComponent(id)).then(function(r){
    var n=r[0];if(!n){app.innerHTML='<p style="padding:120px 40px;text-align:center">소식을 찾을 수 없습니다.</p>';return}
    document.title='BUFF UNIVERSE — '+n.title_line1;
    var yr=n.published_at?String(n.published_at).slice(0,4):'';
    var paras=String(n.body||'').split(/\n{2,}/).filter(Boolean).map(function(p){return '<p style="margin: 0 0 24px; font-size: 19px; line-height: 1.8; color: #1D1D1F; word-break: keep-all">'+br(p)+'</p>'}).join('');
    app.innerHTML='<section style="background: #FFFFFF; padding: 96px 0 0"><div style="max-width: 1040px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center"><span style="font-size: 19px; font-weight: 600; color: #6E6E73">'+esc(n.category)+(yr?' · '+yr:'')+'</span><h1 style="margin: 0; font-size: 40px; font-weight: 700; line-height: 1.3; letter-spacing: -0.02em; color: #1D1D1F; word-break: keep-all">'+esc(n.title_line1)+(n.title_line2?'<br>'+esc(n.title_line2):'')+'</h1></div></section>'
    +'<section style="background: #FFFFFF; padding: 56px 0 120px"><div style="max-width: 900px; margin: 0 auto; padding-left: 40px; padding-right: 40px; box-sizing: border-box">'
    +(n.thumbnail_url?'<img src="'+esc(n.thumbnail_url)+'" alt="'+esc(n.title_line1)+'" style="display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 18px; background: #F5F5F7; margin-bottom: 48px">':'')
    +paras+'<div style="margin-top: 48px; padding-top: 32px; border-top: 1px solid #D2D2D7; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 16px"><a href="News.html" style="font-size: 19px; font-weight: 600; color: #1D1D1F; text-decoration: none">‹ 목록으로</a>'
    +(n.work_id?'<a href="work.html?id='+esc(n.work_id)+'" style="font-size: 19px; font-weight: 600; color: #C2412F; text-decoration: none">프로젝트 보기 ›</a>':'')+'</div></div></section>';
  }).catch(function(){app.innerHTML='<p style="padding:120px 40px;text-align:center">불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>'});
}
function init(){
  var app=$('#app');
  if(app){var k=app.getAttribute('data-page');if(k==='work')workDetail(app);else if(k==='news')newsDetail(app)}
  bindLists();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
