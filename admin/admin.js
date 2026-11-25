(function(){
var C=window.BUFF_CONFIG, BUCKET='site-media';
var $=function(s,r){return(r||document).querySelector(s)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};

/* ---------- 인증 (Supabase Auth REST) ---------- */
var S=null; try{S=JSON.parse(localStorage.getItem('buff_admin')||'null')}catch(e){}
function saveSession(j){S={access:j.access_token,refresh:j.refresh_token,exp:Date.now()+(j.expires_in-60)*1000,email:(j.user&&j.user.email)||(S&&S.email)};localStorage.setItem('buff_admin',JSON.stringify(S))}
function auth(path,body){return fetch(C.url+'/auth/v1/'+path,{method:'POST',headers:{apikey:C.key,'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.msg||j.error_description||j.message||'로그인 실패');return j})})}
function token(){
  if(!S)return Promise.reject(new Error('로그인이 필요합니다.'));
  if(Date.now()<S.exp)return Promise.resolve(S.access);
  return auth('token?grant_type=refresh_token',{refresh_token:S.refresh}).then(function(j){saveSession(j);return S.access}).catch(function(){logout();throw new Error('로그인이 만료되었습니다.')});
}
function logout(){S=null;localStorage.removeItem('buff_admin');show(false)}

/* ---------- API ---------- */
function api(method,path,body,extra){
  return token().then(function(t){
    var h=Object.assign({apikey:C.key,Authorization:'Bearer '+t},extra||{});
    if(body!==undefined&&!(body instanceof Blob))h['Content-Type']='application/json';
    return fetch(C.url+path,{method:method,headers:h,body:body===undefined?undefined:(body instanceof Blob?body:JSON.stringify(body))});
  }).then(function(r){
    if(r.status===204)return null;
    return r.text().then(function(t){var j=null;try{j=t?JSON.parse(t):null}catch(e){}
      if(!r.ok){var m=(j&&(j.message||j.error))||t||('오류 '+r.status);
        if(r.status===401||r.status===403||/row-level security/i.test(m))m='권한이 없습니다. 관리자 계정으로 로그인했는지 확인해 주세요.';
        throw new Error(m)}
      return j});
  });
}
var rest=function(m,t,q,b,x){return api(m,'/rest/v1/'+t+(q?'?'+q:''),b,x)};
function toast(msg,bad){var d=document.createElement('div');d.className='toast'+(bad?' bad':'');d.textContent=msg;document.body.appendChild(d);setTimeout(function(){d.remove()},bad?4500:2200)}

/* ---------- 이미지 업로드 ---------- */
function shrink(file){
  return new Promise(function(res){
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.type==='image/png'){res(file);return}
    var img=new Image(),u=URL.createObjectURL(file);
    img.onload=function(){URL.revokeObjectURL(u);var M=2400,w=img.width,h=img.height;
      if(w<=M){res(file);return}
      var c=document.createElement('canvas');c.width=M;c.height=Math.round(h*M/w);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      c.toBlob(function(b){res(b||file)},'image/jpeg',.9)};
    img.onerror=function(){res(file)};img.src=u;
  });
}
function uploadVideo(file){
  if(file.size>50*1024*1024)return Promise.reject(new Error('영상이 50MB를 넘습니다. 용량을 줄여서(mp4, H.264) 올려 주세요.'));
  var ext=(file.name.split('.').pop()||'mp4').toLowerCase().replace(/[^a-z0-9]/g,'');if(ext==='m4v')ext='mp4';
  var name='videos/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
  return api('POST','/storage/v1/object/'+BUCKET+'/'+name,file,{'Content-Type':file.type||'video/mp4','x-upsert':'false'}).then(function(){return C.url+'/storage/v1/object/public/'+BUCKET+'/'+name});
}
function upload(file,folder){
  if(file.size>25*1024*1024)return Promise.reject(new Error('파일이 너무 큽니다. (25MB 이하)'));
  return shrink(file).then(function(b){
    var ext=(b.type==='image/png'?'png':b.type==='image/webp'?'webp':'jpg');
    var name=(folder||'misc')+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
    if(b.size>10*1024*1024)throw new Error('이미지가 10MB를 넘습니다. 크기를 줄여서 올려 주세요.');
    return api('POST','/storage/v1/object/'+BUCKET+'/'+name,b,{'Content-Type':b.type||'image/jpeg','x-upsert':'false'}).then(function(){return C.url+'/storage/v1/object/public/'+BUCKET+'/'+name});
  });
}

/* ---------- 항목 정의 ---------- */
var CAT=[['branding','브랜딩•디자인'],['photo','사진'],['video','영상']];
var T={
 news:{label:'News',title:'뉴스',order:'sort_order.asc,published_at.desc',hint:'카드를 드래그해서 순서를 바꿉니다. 제목은 두 줄로 입력하세요. (1줄: 대회명 / 2줄: 진행 내용)',
  list:function(r){return{img:r.thumbnail_url,title:r.title_line1+(r.title_line2?' · '+r.title_line2:''),sub:r.category+' · '+(r.published_at||'')}},
  fields:[['category','분류','text',{ph:'Photo · Video · Branding · Notice 등',list:['Photo','Video','Branding','Notice']}],['title_line1','제목 1줄 (여기서 줄이 바뀝니다)','text'],['title_line2','제목 2줄 (비우면 한 줄로 이어집니다)','text'],['title_line1_en','[EN] Title line 1','text',{ph:'English version (비우면 한글 표시)'}],['title_line2_en','[EN] Title line 2','text'],['summary_en','[EN] Summary','textarea',{rows:2}],['body_en','[EN] Body','textarea',{rows:9,help:'영문 본문. 비우면 영문 페이지에 한글 본문이 표시됩니다.'}],['source_tags_en','[EN] Source tags (comma separated)','tags'],['summary','목록 요약문','textarea',{rows:2}],['body','본문','textarea',{rows:9,help:'빈 줄을 넣으면 문단이 나뉩니다. ## 로 시작하는 줄은 소제목입니다. 유튜브·인스타그램(게시물/릴스) 주소만 한 줄로 적으면 영상·게시물이 바로 보입니다. 그 외 주소만 적으면 바로가기 버튼이 됩니다. 출처 박스는 아래 “출처 태그”와 “원문 링크” 칸에 입력하세요.'}],['thumbnail_url','대표 이미지','image'],['thumb_zoom','목록 썸네일 확대·위치 (슬라이더)','thumbframe'],['members','참여 인물','members'],['source_tags','출처 태그 (선택, 쉼표로 구분)','tags',{ph:'원문 기사, 스포츠잡알리오, 스포츠Q 김혜림 객원기자, 2026.06.30'}],['source_url','원문 링크 (선택)','text',{ph:'기사 또는 인스타그램·유튜브 등 SNS 주소 (비워 두면 버튼이 나오지 않습니다)'}],['embeds','인스타그램·유튜브 링크 (선택)','lines',{rows:3,help:'칸 하나에 링크 하나씩 넣고, 더 넣으려면 “+ 링크 추가”를 누르세요. 인스타그램 게시물·릴스, 유튜브 영상 주소를 넣으면 뉴스 본문 아래에 바로 재생·표시됩니다.'}],['published_at','게시일','date'],['related_work_ids','연관 프로젝트 (선택)','workrefs',{help:'뉴스 아래에 카드로 보여줄 프로젝트를 고르세요. 여러 개 추가할 수 있습니다.'}],['published','사이트에 공개','bool'],['sort_order','정렬 순서','int']],
  blank:function(){return{category:'Photo',published:true,sort_order:0,published_at:new Date().toISOString().slice(0,10)}}},
 works:{label:'Works',title:'작업물',order:'sort_order.asc,created_at.asc',hint:'카드를 드래그해서 Works 페이지 순서를 바꿉니다. 영상 링크를 넣으면 사이트에 재생 버튼이 생깁니다.',
  list:function(r){return{img:r.thumbnail_url,title:r.title,sub:((r.categories&&r.categories.length?r.categories:[r.category]).join(' · '))}},
  fields:[['categories','분류 (브랜딩과 사진을 함께 한 프로젝트는 둘 다 선택)','cats'],['title','프로젝트명','text'],['title_en','[EN] Project name','text',{ph:'English version (비우면 한글 표시)'}],['client','클라이언트','text',{ph:'예: 포카리스웨트'}],['client_en','[EN] Client','text'],['work_year','기간','text',{ph:'예: 2026 / 2026.09 ~ 2026.10'}],['description','프로젝트 설명','textarea',{rows:6}],['description_en','[EN] Description','textarea',{rows:6}],['thumbnail_url','목록 썸네일 (16:9 권장)','image'],['thumb_zoom','썸네일 확대·위치 (슬라이더)','thumbframe'],['images','상세 이미지','imagelist'],['videos','영상 링크 (YouTube)','videos'],['members','참여 멤버','members'],['template','상세 페이지 템플릿','select',{opts:[['1','템플릿 1 (기본)'],['2','템플릿 2 (상세형 · 마케팅/브랜딩 프로젝트 소개)']]}],['sections','[템플릿 2] 섹션 구성 (JSON · 영문은 _en 항목)','json',{rows:16}],['metrics','[템플릿 2] 성과 수치 (JSON · 영문은 _en 항목)','json',{rows:12}],['pdf_url','포트폴리오 PDF 링크 (구글 드라이브 공유 링크)','text',{ph:'https://drive.google.com/file/d/…/view  ("링크가 있는 모든 사용자"로 공유)'}],['published','사이트에 공개','bool'],['sort_order','정렬 순서','int']],
  blank:function(){return{category:'photo',categories:['photo'],published:true,featured:false,sort_order:0,tags:[],images:[],videos:[],members:[],template:'1',sections:[],metrics:[]}}},
 clients:{label:'Clients',title:'고객사',order:'sort_order.asc',hint:'홈 화면 Our Clients 로고 목록입니다. 배경이 투명한 PNG를 권장합니다.',
  list:function(r){return{img:r.logo_url,title:r.name,sub:r.url||'링크 없음',contain:true}},
  fields:[['name','고객사명','text'],['url','링크 (선택)','text'],['logo_url','로고','image'],['published','사이트에 공개','bool'],['sort_order','정렬 순서','int']],
  blank:function(){return{published:true,sort_order:0}}},
 team_members:{label:'팀 소개',title:'팀 소개',order:'sort_order.asc',hint:'홈과 About Us 화면의 팀 소개입니다.',
  list:function(r){return{img:r.avatar_url,title:r.name,sub:r.role,round:true}},
  fields:[['name','이름','text'],['name_en','[EN] Name','text'],['role','직함','text'],['role_en','영문 직무','text'],['avatar_url','프로필 원형 사진','image'],['photo_url','대표 큰 사진 (4:5 권장)','image'],['lead','대표 문장 (강조)','textarea',{rows:3}],['body','소개','textarea',{rows:3}],['social','SNS 링크 (아이콘으로 표시)','social'],['education','학력','textarea',{rows:2}],['career','경력','textarea',{rows:4}],['published','사이트에 공개','bool'],['sort_order','정렬 순서','int']],
  blank:function(){return{published:true,sort_order:0}}},
 career_positions:{label:'Career 포지션',title:'모집 포지션',order:'sort_order.asc',hint:'Career 페이지의 포지션 카드입니다. “모집 중”을 끄면 사이트에서 숨겨집니다.',
  list:function(r){return{title:r.title,sub:r.description}},
  fields:[['title','포지션명','text'],['description','설명','textarea',{rows:2}],['description_en','[EN] Description','textarea',{rows:2}],['is_open','모집 중','bool'],['sort_order','정렬 순서','int']],
  blank:function(){return{is_open:true,sort_order:0}}}
};
var SETTINGS=[['career_headline','Career 큰 제목','text','“BUFF”로 시작하면 로고 이미지로 표시됩니다.'],['career_subtext','Career 안내 문구','textarea'],['career_team_note','함께 성장 안내문','textarea'],['partner_text','파트너 등록 안내문','textarea'],['contact_email','채용·문의 이메일','text']];
window.buffRest=rest;window.buffToast=toast;
var TABS=['home','news','works','clients','team_members','career_positions','settings','invoice'];
var cur='home', cache={};

/* ---------- 화면 ---------- */
function show(on){$('#login').classList.toggle('hide',on);$('#app').classList.toggle('hide',!on);$('#viewsite').classList.toggle('hide',!on);$('#logout').classList.toggle('hide',!on);if(on)go(cur)}
function drawTabs(){
  $('#tabs').innerHTML=TABS.map(function(k){var l=k==='settings'?'Career 문구':k==='home'?'메인':k==='invoice'?'인보이스•견적서':T[k].label;return '<button data-k="'+k+'" class="'+(k===cur?'on':'')+'">'+esc(l)+'</button>'}).join('');
  [].forEach.call($('#tabs').children,function(b){b.onclick=function(){go(b.getAttribute('data-k'))}});
}
function go(k){cur=k;drawTabs();$('#main').innerHTML='<div class="empty">불러오는 중…</div>';(k==='settings'?drawSettings():k==='home'?drawHome():k==='invoice'?window.openInvoiceTab():drawList(k)).catch(function(e){$('#main').innerHTML='<div class="empty">'+esc(e.message)+'</div>'})}

function drawList(k){
  var d=T[k];
  return rest('GET',k,'select=*&order='+d.order).then(function(rows){
    cache[k]=rows;
    var h='<div class="bar"><h2>'+esc(d.title)+'</h2><button class="btn" id="add">+ 새로 추가</button></div><p class="hint">'+esc(d.hint)+'</p>';
    if(!rows.length)h+='<div class="empty">아직 항목이 없습니다.</div>';
    rows.forEach(function(r,i){
      var v=d.list(r),pub=('published' in r)?r.published:r.is_open;
      h+='<div class="row" draggable="true" data-i="'+i+'"><span class="grip" title="드래그해서 순서 변경">⠿</span>'+(v.img?'<img src="'+esc(srcUrl(v.img))+'" alt="" style="'+(v.contain?'object-fit:contain;padding:6px;background:#fff;border:1px solid #eee;':'')+(v.round?'width:54px;border-radius:50%;':'')+'">':'<div class="ph"></div>')
      +'<div class="t"><b>'+esc(v.title)+'</b><span>'+esc(v.sub||'')+'</span></div>'
      +'<span class="chip '+(pub?'on':'')+'">'+(pub?(k==='career_positions'?'모집 중':'공개'):(k==='career_positions'?'마감':'비공개'))+'</span>'
      +'<div class="acts"><button class="btn line sm" data-a="edit" data-i="'+i+'">수정</button><button class="btn danger sm" data-a="del" data-i="'+i+'">삭제</button></div></div>';
    });
    $('#main').innerHTML=h;
    $('#add').onclick=function(){openForm(k,d.blank())};
    dragList($('#main'),rows,k);
    [].forEach.call($('#main').querySelectorAll('[data-a]'),function(b){b.onclick=function(){
      var i=+b.getAttribute('data-i'),a=b.getAttribute('data-a'),r=rows[i];
      if(a==='edit')openForm(k,JSON.parse(JSON.stringify(r)));
      else if(a==='del'){if(confirm('“'+d.list(r).title+'” 항목을 삭제할까요?\n삭제하면 되돌릴 수 없습니다.'))rest('DELETE',k,'id=eq.'+r.id).then(function(){toast('삭제했습니다.');drawList(k)}).catch(function(e){toast(e.message,1)})}
      else move(k,rows,i,a==='up'?-1:1);
    }});
  });
}
function dragList(root,rows,k){
  var from=null;
  [].forEach.call(root.querySelectorAll('.row[draggable]'),function(el){
    el.ondragstart=function(e){from=+el.getAttribute('data-i');el.classList.add('dragging');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',String(from))}catch(x){}};
    el.ondragend=function(){el.classList.remove('dragging');[].forEach.call(root.querySelectorAll('.over'),function(o){o.classList.remove('over')})};
    el.ondragover=function(e){if(from===null)return;e.preventDefault();el.classList.add('over')};
    el.ondragleave=function(){el.classList.remove('over')};
    el.ondrop=function(e){e.preventDefault();var to=+el.getAttribute('data-i');if(from===null||from===to){from=null;return}
      var arr=rows.slice(),m=arr.splice(from,1)[0];arr.splice(to,0,m);from=null;
      var jobs=[];arr.forEach(function(r,n){if(r.sort_order!==n+1)jobs.push(rest('PATCH',k,'id=eq.'+r.id,{sort_order:n+1}))});
      Promise.all(jobs).then(function(){toast('순서를 바꿨습니다.');drawList(k)}).catch(function(err){toast(err.message,1)})};
  });
}
function move(k,rows,i,dir){
  var a=rows[i],b=rows[i+dir];if(!b)return;
  if(k==='works'){if(a.category!==b.category)return;rows=rows.filter(function(r){return r.category===a.category});i=rows.indexOf(a)}
  /* 순서값이 같을 수 있어 같은 목록 안에서 현재 화면 순서대로 다시 번호 매깁니다 */
  var arr=rows.slice();arr[i]=rows[i+dir];arr[i+dir]=a;
  var jobs=[];arr.forEach(function(r,n){if(r.sort_order!==n+1||r===a||r===b)jobs.push(rest('PATCH',k,'id=eq.'+r.id,{sort_order:n+1}))});
  Promise.all(jobs).then(function(){drawList(k)}).catch(function(e){toast(e.message,1)});
}

/* ---------- 입력 폼 ---------- */
function openForm(k,data){
  var d=T[k],isNew=!data.id,F=data;
  Promise.all([k==='news'?rest('GET','works','select=id,title,category&order=title.asc'):null,(k==='works'||k==='news')?rest('GET','team_members','select=name&order=sort_order.asc'):null]).then(function(ex){
    var works=ex[0]||[],team=ex[1]||[];
    var h='<div class="ov"><div class="panel"><h3>'+esc(d.title)+(isNew?' 추가':' 수정')+'</h3><div id="fe"></div><div class="err" id="ferr"></div><div class="foot"><button class="btn line" id="cancel">취소</button><button class="btn" id="save">저장</button></div></div></div>';
    $('#modal').innerHTML=h;
    var box=$('#fe');
    d.fields.forEach(function(f){box.appendChild(field(f,F,{works:works,team:team}))});
    $('#cancel').onclick=close;
    $('.ov').addEventListener('mousedown',function(e){if(e.target===this&&confirm('작성 중인 내용이 사라집니다. 닫을까요?'))close()});
    $('#save').onclick=function(){
      var btn=this;btn.disabled=true;btn.textContent='저장 중…';$('#ferr').textContent='';
      var body={};d.fields.forEach(function(f){body[f[0]]=F[f[0]]===undefined?null:F[f[0]]});
      ['published_at','work_id','url','thumbnail_url'].forEach(function(n){if(body[n]==='')body[n]=null});
      if('thumb_zoom' in body){body.thumb_x=F.thumb_x==null?50:F.thumb_x;body.thumb_y=F.thumb_y==null?50:F.thumb_y}
      if(k==='works'){var cs0=(body.categories&&body.categories.length)?body.categories:[F.category||'photo'];body.categories=cs0;body.category=cs0[0]}
      if(k==='works'){if(!body.template)body.template='1';if(!Array.isArray(body.sections))body.sections=[];if(!Array.isArray(body.metrics))body.metrics=[]}
      if(body.videos)body.videos=body.videos.filter(function(v){return v.url&&v.url.trim()});
      var req=isNew?rest('POST',k,'',body,{Prefer:'return=minimal'}):rest('PATCH',k,'id=eq.'+F.id,body,{Prefer:'return=minimal'});
      req.then(function(){close();toast('저장했습니다. 사이트에 바로 반영됩니다.');drawList(k)}).catch(function(e){$('#ferr').textContent=e.message;btn.disabled=false;btn.textContent='저장'});
    };
  });
}
function close(){$('#modal').innerHTML=''}
function ytId(u){var m=String(u||'').match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);return m?m[1]:''}
function srcUrl(u){return /^https?:/.test(u)?u:'../'+u}

function field(f,F,ctx){
  var key=f[0],type=f[2],o=f[3]||{},w=document.createElement('div');
  var lab=function(t){var l=document.createElement('label');l.textContent=t;return l};
  if(type==='bool'){w.className='chk';w.innerHTML='<input type="checkbox" '+(F[key]?'checked':'')+'><span>'+esc(f[1])+'</span>';w.firstChild.onchange=function(){F[key]=this.checked};return w}
  w.appendChild(lab(f[1]));
  var inp;
  if(type==='text'||type==='date'||type==='int'){
    inp=document.createElement('input');inp.type=type==='int'?'number':type==='date'?'date':'text';inp.value=F[key]==null?'':F[key];if(o.ph)inp.placeholder=o.ph;
    if(o.list){var dl=document.createElement('datalist');dl.id='dl_'+key;dl.innerHTML=o.list.map(function(x){return '<option value="'+esc(x)+'">'}).join('');w.appendChild(dl);inp.setAttribute('list',dl.id)}
    inp.oninput=function(){F[key]=type==='int'?(this.value===''?0:parseInt(this.value,10)):this.value};w.appendChild(inp);
  }else if(type==='lines'){var box=document.createElement('div');w.appendChild(box);if(!Array.isArray(F[key]))F[key]=[];
    (function draw(){var arr=F[key];if(!arr.length)arr.push('');
      box.innerHTML=arr.map(function(u,i){return '<div style="display:flex;gap:8px;margin-bottom:8px"><input type="text" placeholder="https://www.instagram.com/reel/… 또는 https://youtu.be/…" value="'+esc(u)+'" data-i="'+i+'" style="flex:1;min-width:0"><button type="button" class="btn danger sm" data-r="'+i+'">삭제</button></div>'}).join('')+'<button type="button" class="btn line sm" data-add="1">+ 링크 추가</button>';
      [].forEach.call(box.querySelectorAll('input[data-i]'),function(el){el.oninput=function(){arr[+el.getAttribute('data-i')]=el.value.trim()}});
      [].forEach.call(box.querySelectorAll('[data-r]'),function(b){b.onclick=function(){arr.splice(+b.getAttribute('data-r'),1);draw()}});
      box.querySelector('[data-add]').onclick=function(){arr.push('');draw();var ins=box.querySelectorAll('input[data-i]');ins[ins.length-1].focus()}})()}
  else if(type==='textarea'){inp=document.createElement('textarea');inp.rows=o.rows||4;inp.value=F[key]||'';inp.oninput=function(){F[key]=this.value};w.appendChild(inp)}
  else if(type==='json'){inp=document.createElement('textarea');inp.rows=o.rows||12;inp.spellcheck=false;inp.style.cssText='font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;white-space:pre;overflow:auto';
    inp.value=JSON.stringify(F[key]==null?[]:F[key],null,2);var jm=document.createElement('div');jm.style.cssText='font-size:12px;color:#d33;margin-top:4px;min-height:16px';
    inp.oninput=function(){try{F[key]=JSON.parse(this.value);this.style.borderColor='';jm.textContent=''}catch(e){this.style.borderColor='#d33';jm.textContent='JSON 형식 오류 — 고치기 전까지 이 칸은 저장되지 않습니다 ('+e.message+')'}};w.appendChild(inp);w.appendChild(jm)}
  else if(type==='select'){inp=document.createElement('select');inp.innerHTML=o.opts.map(function(x){return '<option value="'+x[0]+'"'+(F[key]===x[0]?' selected':'')+'>'+esc(x[1])+'</option>'}).join('');inp.onchange=function(){F[key]=this.value};w.appendChild(inp)}
  else if(type==='workrefs'){var wb=document.createElement('div');w.appendChild(wb);if(!Array.isArray(F[key]))F[key]=[];
    (function draw(){var arr=F[key];if(!arr.length)arr.push('');
      wb.innerHTML=arr.map(function(id,i){return '<div style="display:flex;gap:8px;margin-bottom:8px"><select data-i="'+i+'" style="flex:1;min-width:0"><option value="">프로젝트 선택</option>'+ctx.works.map(function(x){return '<option value="'+x.id+'"'+(id===x.id?' selected':'')+'>'+esc(x.title)+'</option>'}).join('')+'</select><button type="button" class="btn danger sm" data-r="'+i+'">삭제</button></div>'}).join('')+'<button type="button" class="btn line sm" data-add="1">+ 프로젝트 추가</button>';
      [].forEach.call(wb.querySelectorAll('select[data-i]'),function(el){el.onchange=function(){arr[+el.getAttribute('data-i')]=el.value}});
      [].forEach.call(wb.querySelectorAll('[data-r]'),function(b){b.onclick=function(){arr.splice(+b.getAttribute('data-r'),1);draw()}});
      wb.querySelector('[data-add]').onclick=function(){arr.push('');draw()}})()}
  else if(type==='workref'){inp=document.createElement('select');inp.innerHTML='<option value="">연결 안 함</option>'+ctx.works.map(function(x){return '<option value="'+x.id+'"'+(F[key]===x.id?' selected':'')+'>'+esc(x.title)+' ('+x.category+')</option>'}).join('');inp.onchange=function(){F[key]=this.value||null};w.appendChild(inp)}
  else if(type==='tagsel'){inp=document.createElement('select');var opts=[['','자동 (첫 분류 기준)'],['Photo','Photo'],['Video','Video'],['Branding','Branding'],['Branding · Photo','Branding · Photo'],['Photo · Video','Photo · Video'],['Branding · Video','Branding · Video'],['Branding · Photo · Video','Branding · Photo · Video']];
    if(F[key]&&!opts.some(function(o){return o[0]===F[key]}))opts.push([F[key],F[key]]);
    inp.innerHTML=opts.map(function(o){return '<option value="'+esc(o[0])+'"'+((F[key]||'')===o[0]?' selected':'')+'>'+esc(o[1])+'</option>'}).join('');
    inp.onchange=function(){F[key]=this.value||null};w.appendChild(inp)}
  else if(type==='cats'){
    var cs=Array.isArray(F[key])&&F[key].length?F[key]:(F[key]=[F.category||'photo']);
    var cw=document.createElement('div');cw.style.cssText='display:flex;flex-wrap:wrap;gap:16px';
    CAT.forEach(function(c){var l=document.createElement('label');l.className='chk';l.style.margin='0';l.innerHTML='<input type="checkbox" '+(cs.indexOf(c[0])>=0?'checked':'')+'><span>'+esc(c[1])+'</span>';
      l.firstChild.onchange=function(){var arr=CAT.map(function(x){return x[0]}).filter(function(x){return x===c[0]?l.firstChild.checked:F[key].indexOf(x)>=0});if(!arr.length){l.firstChild.checked=true;return}F[key]=arr};cw.appendChild(l)});
    w.appendChild(cw);
  }
  else if(type==='tags'){inp=document.createElement('input');inp.type='text';if(o.ph)inp.placeholder=o.ph;inp.value=(F[key]||[]).join(', ');inp.oninput=function(){F[key]=this.value.split(',').map(function(s){return s.trim().replace(/^#/,'')}).filter(Boolean)};w.appendChild(inp)}
  else if(type==='members'){
    var names=ctx.team.map(function(x){return x.name});(F[key]||[]).forEach(function(n){if(names.indexOf(n)<0)names.push(n)});
    var wrap=document.createElement('div');wrap.style.cssText='display:flex;flex-wrap:wrap;gap:16px';
    names.forEach(function(n){var l=document.createElement('label');l.className='chk';l.style.margin='0';l.innerHTML='<input type="checkbox" '+((F[key]||[]).indexOf(n)>=0?'checked':'')+'><span>'+esc(n)+'</span>';
      l.firstChild.onchange=function(){var a=(F[key]||[]).filter(function(x){return x!==n});if(this.checked)a.push(n);F[key]=a};wrap.appendChild(l)});
    w.appendChild(wrap);
  }
  else if(type==='social'){
    var so=F[key]&&typeof F[key]==='object'?F[key]:(F[key]={});
    [['instagram','Instagram','https://instagram.com/계정'],['youtube','YouTube','https://youtube.com/@채널'],['linkedin','LinkedIn','https://linkedin.com/in/계정'],['x','X (트위터)','https://x.com/계정'],['email','이메일','name@example.com']].forEach(function(n){
      var r=document.createElement('div');r.style.cssText='display:grid;grid-template-columns:110px 1fr;gap:10px;align-items:center;margin-bottom:8px';
      r.innerHTML='<span style="font-size:14px;font-weight:600">'+n[1]+'</span>';var i=document.createElement('input');i.type='text';i.placeholder=n[2];i.value=so[n[0]]||'';
      i.oninput=function(){var v=this.value.trim();if(v)so[n[0]]=v;else delete so[n[0]]};r.appendChild(i);w.appendChild(r)});
  }
  else if(type==='image')imageField(w,F,key);
  else if(type==='imagelist')imageList(w,F,key);
  else if(type==='videos')videoList(w,F,key);
  else if(type==='thumbframe')thumbFrame(w,F);
  if(o.help){var s=document.createElement('div');s.className='small';s.textContent=o.help;w.appendChild(s)}
  return w;
}
function thumbFrame(w,F){
  if(F.thumb_zoom==null||F.thumb_zoom<100)F.thumb_zoom=100;if(F.thumb_x==null)F.thumb_x=50;if(F.thumb_y==null)F.thumb_y=50;
  var box=document.createElement('div');w.appendChild(box);
  box.innerHTML='<div class="tfp" style="width:320px;max-width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:var(--bg);border:1px solid var(--line)"><img alt="" style="display:block;width:100%;height:100%;object-fit:cover"></div>'
  +[['thumb_zoom','확대',100,300,'%'],['thumb_x','좌우 위치',0,100,''],['thumb_y','상하 위치',0,100,'']].map(function(r){return '<label style="display:flex;align-items:center;gap:10px;margin-top:10px;font-size:13px"><span style="width:64px">'+r[1]+'</span><input type="range" data-k="'+r[0]+'" min="'+r[2]+'" max="'+r[3]+'" value="'+F[r[0]]+'" style="flex:1;max-width:240px"><b data-v="'+r[0]+'" style="width:48px">'+F[r[0]]+r[4]+'</b></label>'}).join('')
  +'<button type="button" class="btn line sm" id="tfreset" style="margin-top:10px">원래대로</button>';
  var im=box.querySelector('img');
  function show(){var z=F.thumb_zoom/100,o=F.thumb_x+'% '+F.thumb_y+'%';if(F.thumbnail_url)im.src=srcUrl(F.thumbnail_url);im.style.objectPosition=o;im.style.transformOrigin=o;im.style.transform='scale('+z+')';
    [].forEach.call(box.querySelectorAll('input[data-k]'),function(el){el.value=F[el.getAttribute('data-k')];box.querySelector('[data-v="'+el.getAttribute('data-k')+'"]').textContent=F[el.getAttribute('data-k')]+(el.getAttribute('data-k')==='thumb_zoom'?'%':'')})}
  [].forEach.call(box.querySelectorAll('input[data-k]'),function(el){el.oninput=function(){F[el.getAttribute('data-k')]=parseInt(el.value,10);show()}});
  box.querySelector('#tfreset').onclick=function(){F.thumb_zoom=100;F.thumb_x=50;F.thumb_y=50;show()};
  box.onmouseenter=show;show();
}
function pick(multi,cb){var i=document.createElement('input');i.type='file';i.accept='image/png,image/jpeg,image/webp';i.multiple=!!multi;i.onchange=function(){cb([].slice.call(i.files))};i.click()}
function imageField(w,F,key){
  var box=document.createElement('div');box.className='imgbox';w.appendChild(box);
  function draw(){
    box.innerHTML=(F[key]?'<img src="'+esc(srcUrl(F[key]))+'" alt="">':'<div class="noimg">이미지 없음</div>')+'<div><button type="button" class="btn line sm" id="up_'+key+'">'+(F[key]?'이미지 교체':'이미지 올리기')+'</button>'+(F[key]?' <button type="button" class="btn danger sm" id="rm_'+key+'">삭제</button>':'')+'<div class="small" id="st_'+key+'"></div></div>';
    $('#up_'+key,box).onclick=function(){pick(false,function(fs){if(!fs[0])return;var st=$('#st_'+key,box);st.textContent='업로드 중…';
      upload(fs[0],key.indexOf('logo')>=0?'logos':key.indexOf('avatar')>=0||key.indexOf('photo')>=0?'team':'works').then(function(u){F[key]=u;draw()}).catch(function(e){st.textContent=e.message;toast(e.message,1)})})};
    var r=$('#rm_'+key,box);if(r)r.onclick=function(){F[key]=null;draw()};
  }
  draw();
}
function imageList(w,F,key){
  var box=document.createElement('div');w.appendChild(box);F[key]=F[key]||[];
  function draw(){
    var a=F[key];
    box.innerHTML='<div class="imglist">'+a.map(function(u,i){return '<div class="it" draggable="true" data-i="'+i+'"><img src="'+esc(srcUrl(u))+'" alt=""><button type="button" class="x" data-i="'+i+'" data-a="rm">×</button><div class="mv"><button type="button" data-i="'+i+'" data-a="l">←</button><button type="button" data-i="'+i+'" data-a="r">→</button></div></div>'}).join('')+'</div><div style="margin-top:12px"><button type="button" class="btn line sm" id="addimgs">+ 이미지 추가 (여러 장 선택 가능)</button><span class="small" id="stl" style="margin-left:10px"></span></div>';
    [].forEach.call(box.querySelectorAll('[data-a]'),function(b){b.onclick=function(){var i=+b.getAttribute('data-i'),t=b.getAttribute('data-a');
      if(t==='rm')a.splice(i,1);else if(t==='l'&&i>0){var x=a[i];a[i]=a[i-1];a[i-1]=x}else if(t==='r'&&i<a.length-1){var y=a[i];a[i]=a[i+1];a[i+1]=y}draw()}});
    var dfrom=null;[].forEach.call(box.querySelectorAll('.it'),function(el){
      el.ondragstart=function(e){dfrom=+el.getAttribute('data-i');el.classList.add('dragging');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain','i')}catch(x){}};
      el.ondragend=function(){el.classList.remove('dragging')};
      el.ondragover=function(e){if(dfrom===null)return;e.preventDefault();el.classList.add('over')};
      el.ondragleave=function(){el.classList.remove('over')};
      el.ondrop=function(e){e.preventDefault();var to=+el.getAttribute('data-i');if(dfrom===null||dfrom===to){dfrom=null;return}var m=a.splice(dfrom,1)[0];a.splice(to,0,m);dfrom=null;draw()}});
    $('#addimgs',box).onclick=function(){pick(true,function(fs){var st=$('#stl',box),n=0;st.textContent='업로드 중… (0/'+fs.length+')';
      fs.reduce(function(p,f){return p.then(function(){return upload(f,'works').then(function(u){a.push(u);n++;st.textContent='업로드 중… ('+n+'/'+fs.length+')'})})},Promise.resolve()).then(draw).catch(function(e){st.textContent=e.message;toast(e.message,1);draw()})})};
  }
  draw();
}
function isFile(u){return /\.(mp4|mov|webm|m4v)(\?|$)/i.test(String(u||''))}
function videoList(w,F,key){
  var box=document.createElement('div');w.appendChild(box);F[key]=Array.isArray(F[key])?F[key]:[];
  function draw(){
    var a=F[key];
    box.innerHTML=a.map(function(v,i){var id=ytId(v.url),p=v.poster||(id?'https://i.ytimg.com/vi/'+id+'/mqdefault.jpg':'');
      return '<div class="vrow"><input type="text" placeholder="유튜브 링크 (https://youtu.be/…) 또는 아래 ‘영상 파일 올리기’" value="'+esc(v.url)+'" data-i="'+i+'" data-f="url"><input type="text" placeholder="이름 (예: 대구)" value="'+esc(v.label||'')+'" data-i="'+i+'" data-f="label"><button type="button" class="btn danger sm" data-i="'+i+'" data-a="rm">삭제</button>'
      +'<div class="pv">'+(p?'<img src="'+esc(/^https?:/.test(p)?p:'../'+p)+'" alt="">':'')+'<span>'+(v.poster?'직접 올린 썸네일 사용 중':(id?'유튜브 썸네일 자동 사용':isFile(v.url)?'직접 올린 영상 (썸네일은 아래에서 올리면 표시됩니다)':'링크를 입력하면 썸네일이 표시됩니다'))+'</span><button type="button" class="btn line sm" data-i="'+i+'" data-a="poster">썸네일 직접 올리기</button><button type="button" class="btn line sm" data-i="'+i+'" data-a="vfile">영상 파일 올리기</button>'+(v.poster?'<button type="button" class="btn line sm" data-i="'+i+'" data-a="noposter">자동으로 되돌리기</button>':'')+'</div></div>'}).join('')+'<button type="button" class="btn line sm" id="addv">+ 영상 링크 추가</button>';
    [].forEach.call(box.querySelectorAll('input[data-f]'),function(el){el.oninput=function(){a[+el.getAttribute('data-i')][el.getAttribute('data-f')]=el.value};
      if(el.getAttribute('data-f')==='url')el.onchange=draw});
    [].forEach.call(box.querySelectorAll('button[data-a]'),function(b){b.onclick=function(){var i=+b.getAttribute('data-i'),t=b.getAttribute('data-a');
      if(t==='rm'){a.splice(i,1);draw()}else if(t==='noposter'){delete a[i].poster;draw()}
      else if(t==='vfile'){var vi=document.createElement('input');vi.type='file';vi.accept='video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm,.m4v';vi.onchange=function(){var f=vi.files[0];if(!f)return;toast('영상 업로드 중… 잠시만 기다려 주세요');uploadVideo(f).then(function(u){a[i].url=u;if(!a[i].label)a[i].label='';draw();toast('영상을 올렸습니다. 저장을 눌러 주세요')}).catch(function(e){toast(e.message,1)})};vi.click()}
      else pick(false,function(fs){if(!fs[0])return;upload(fs[0],'works').then(function(u){a[i].poster=u;draw()}).catch(function(e){toast(e.message,1)})})}});
    $('#addv',box).onclick=function(){a.push({url:'',label:''});draw()};
  }
  draw();
}


/* ---------- 메인(홈) ---------- */
var HOME=[['home_lead','첫 화면 제목 앞부분','text','로고 앞에 붙는 글자 (예: we)'],['home_tail','첫 화면 제목 뒷부분','text','로고 뒤에 붙는 글자 (예: your moment)'],['home_text','첫 화면 소개 문구','textarea','줄바꿈은 그대로 반영됩니다.'],['home_btn1','첫 번째 버튼 글자','text'],['home_btn2','두 번째 버튼 글자','text']];
function drawHome(){
  return Promise.all([rest('GET','site_settings','select=*'),rest('GET','works','select=id,title,tag,category,thumbnail_url,featured,sort_order,created_at&published=eq.true&order=category.asc,sort_order.asc,created_at.asc')]).then(function(r){
    var cur={};r[0].forEach(function(x){cur[x.key]=x.value});
    var all=r[1],byId={};all.forEach(function(w){byId[w.id]=w});
    var ids=cur.home_featured!=null&&cur.home_featured!==''?String(cur.home_featured).split(',').filter(function(i){return byId[i]}):all.filter(function(w){return w.featured}).slice(0,4).map(function(w){return w.id});
    var orig=JSON.parse(JSON.stringify(byId)),MAX=6;
    $('#main').innerHTML='<div class="bar"><h2>메인</h2><button class="btn" id="saveH">저장</button></div><p class="hint">홈 화면의 문구와 Recent Works(대표 작업물)를 관리합니다. 비워 두면 기본 문구가 표시됩니다.</p>'
      +'<div class="sec"><h3>첫 화면 문구</h3><div id="hf"></div></div>'
      +'<div class="sec"><h3>Recent Works</h3><p class="sub">홈에 보여줄 작업물을 고르고 순서·썸네일·제목을 바꿉니다. 최대 '+MAX+'개.</p><div id="hw"></div><div class="addrow"><select id="hsel"></select><button class="btn line" id="hadd">+ 작업물 추가</button></div></div><div class="err" id="herr"></div>';
    var hf=$('#hf');
    HOME.forEach(function(s){hf.appendChild(field([s[0],s[1],s[2],{rows:3,help:s[3]}],cur,{}))});
    var wt=field(['home_works_title','Recent Works 섹션 제목','text',{ph:'Recent Works'}],cur,{});$('#hw').parentNode.insertBefore(wt,$('#hw'));
    function drawW(){
      $('#hw').innerHTML='';
      if(!ids.length)$('#hw').innerHTML='<div class="empty" style="margin-top:14px;padding:32px">홈에 노출 중인 작업물이 없습니다. 아래에서 추가해 주세요.</div>';
      ids.forEach(function(id,i){
        var w=byId[id],c=document.createElement('div');c.className='hw';
        var th=document.createElement('div');th.className='th';var im=document.createElement('div');th.appendChild(im);imageField(im,w,'thumbnail_url');
        var mid=document.createElement('div');mid.className='mid';mid.appendChild(field(['title','프로젝트명','text'],w,{}));mid.appendChild(field(['tag','목록 표기 (예: Photo, Branding · Photo)','text'],w,{}));
        var mv=document.createElement('div');mv.className='mv';
        mv.innerHTML='<button class="btn line sm" data-a="up"'+(i===0?' disabled':'')+'>↑</button><button class="btn line sm" data-a="dn"'+(i===ids.length-1?' disabled':'')+'>↓</button><button class="btn danger sm" data-a="rm">빼기</button>';
        [].forEach.call(mv.querySelectorAll('button'),function(b){b.onclick=function(){var t=b.getAttribute('data-a');
          if(t==='rm')ids.splice(i,1);else{var j=i+(t==='up'?-1:1),x=ids[i];ids[i]=ids[j];ids[j]=x}drawW();drawSel()}});
        c.appendChild(th);c.appendChild(mid);c.appendChild(mv);$('#hw').appendChild(c);
      });
    }
    function drawSel(){
      var rest_=all.filter(function(w){return ids.indexOf(w.id)<0});
      $('#hsel').innerHTML=rest_.length?rest_.map(function(w){return '<option value="'+w.id+'">'+esc(w.title)+' ('+w.category+')</option>'}).join(''):'<option value="">추가할 작업물이 없습니다</option>';
    }
    $('#hadd').onclick=function(){var v=$('#hsel').value;if(!v)return;if(ids.length>=MAX){toast('최대 '+MAX+'개까지 노출할 수 있습니다.',1);return}ids.push(v);drawW();drawSel()};
    drawW();drawSel();
    $('#saveH').onclick=function(){
      var b=this;b.disabled=true;$('#herr').textContent='';
      var keys=HOME.map(function(s){return s[0]}).concat(['home_works_title']);
      var body=keys.map(function(k){return{key:k,value:cur[k]||''}});body.push({key:'home_featured',value:ids.join(',')});
      var jobs=[rest('POST','site_settings','on_conflict=key',body,{Prefer:'resolution=merge-duplicates,return=minimal'})];
      ids.forEach(function(id){var w=byId[id],o=orig[id];
        if(w.title!==o.title||(w.tag||'')!==(o.tag||'')||(w.thumbnail_url||null)!==(o.thumbnail_url||null))jobs.push(rest('PATCH','works','id=eq.'+id,{title:w.title,tag:w.tag||null,thumbnail_url:w.thumbnail_url||null},{Prefer:'return=minimal'}))});
      Promise.all(jobs).then(function(){toast('저장했습니다. 사이트에 바로 반영됩니다.');b.disabled=false;ids.forEach(function(id){orig[id]=JSON.parse(JSON.stringify(byId[id]))})}).catch(function(e){$('#herr').textContent=e.message;b.disabled=false});
    };
  });
}

/* ---------- Career 문구 ---------- */
function drawSettings(){
  return rest('GET','site_settings','select=*').then(function(rows){
    var cur={};rows.forEach(function(r){cur[r.key]=r.value});
    $('#main').innerHTML='<div class="bar"><h2>Career 문구</h2><button class="btn" id="saveS">저장</button></div><p class="hint">Career 페이지에 보이는 문구입니다. 줄바꿈은 그대로 반영됩니다.</p><div class="card" style="max-width:none;padding:28px" id="sf"></div><div class="err" id="serr"></div>';
    var box=$('#sf');
    SETTINGS.forEach(function(s){box.appendChild(field([s[0],s[1],s[2],{rows:3,help:s[3]}],cur,{}))});
    $('#saveS').onclick=function(){var b=this;b.disabled=true;
      var body=SETTINGS.map(function(s){return{key:s[0],value:cur[s[0]]||''}});
      rest('POST','site_settings','on_conflict=key',body,{Prefer:'resolution=merge-duplicates,return=minimal'}).then(function(){toast('저장했습니다. 사이트에 바로 반영됩니다.');b.disabled=false}).catch(function(e){$('#serr').textContent=e.message;b.disabled=false});
    };
  });
}

/* ---------- 시작 ---------- */
$('#loginForm').onsubmit=function(e){
  e.preventDefault();var b=$('#loginBtn');b.disabled=true;b.textContent='확인 중…';$('#loginErr').textContent='';
  auth('token?grant_type=password',{email:$('#em').value.trim(),password:$('#pw').value}).then(function(j){saveSession(j);$('#pw').value='';
    return rest('GET','admins','select=email').then(function(r){if(!r.length){logout();throw new Error('관리자 권한이 없는 계정입니다.')}show(true)})
  }).catch(function(er){$('#loginErr').textContent=/Invalid login/i.test(er.message)?'이메일 또는 비밀번호가 올바르지 않습니다.':er.message}).then(function(){b.disabled=false;b.textContent='로그인'});
};
$('#logout').onclick=function(e){e.preventDefault();logout()};
if(S)token().then(function(){show(true)}).catch(function(){show(false)});else show(false);
})();
