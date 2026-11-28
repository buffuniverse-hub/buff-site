(function(){
  'use strict';
  var TABLE='partner_profiles',VARIANTS={freelance:'개인 프리랜서',business:'개인사업자',company:'법인사업자'};
  function el(tag,text,cls){var e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e}
  function req(method,query,body,headers){return window.buffRest(method,TABLE,query,body,headers)}
  var RET={Prefer:'return=representation'};
  window.buffPartners={
    list:function(){return req('GET','select=*&order=name.asc')},
    /* 이름이 같은 파트너가 있으면 갱신, 없으면 새로 저장 */
    upsert:function(info){
      var name=(info.name||'').trim();if(!name)return Promise.reject(new Error('파트너 이름이 필요합니다.'));
      var fields={name:name,phone:(info.phone||'').trim(),email:(info.email||'').trim(),updated_at:new Date().toISOString()};
      if(info.variant)fields.variant=info.variant;
      return req('GET','select=id&name=eq.'+encodeURIComponent(name)+'&limit=1').then(function(rows){
        if(rows&&rows[0])return req('PATCH','id=eq.'+rows[0].id+'&select=id',fields,RET).then(function(r){return r[0]});
        return req('POST','select=id',fields,RET).then(function(r){return r[0]});
      });
    }
  };
  function form(row,done){
    var ov=el('div',null,'ov'),panel=el('div',null,'panel'),fe=el('div'),err=el('div',null,'err'),foot=el('div',null,'foot');
    fe.id='fe';panel.append(el('h3',row.id?'파트너 수정':'파트너 추가'),fe,err,foot);ov.append(panel);
    var inputs={};
    [['name','이름 · 상호','text'],['phone','전화번호','text'],['email','이메일','email']].forEach(function(f){
      var wrap=el('div',null,'f'),label=el('label',f[1]),input=el('input');input.type=f[2];input.value=row[f[0]]||'';
      if(f[0]==='phone')input.inputMode='tel';
      wrap.append(label,input);fe.append(wrap);inputs[f[0]]=input;
    });
    var vw=el('div',null,'f'),vs=el('select');vw.append(el('label','구분'),vs);
    Object.keys(VARIANTS).forEach(function(k){var o=el('option',VARIANTS[k]);o.value=k;vs.append(o)});vs.value=row.variant||'freelance';fe.append(vw);
    var mw=el('div',null,'f'),memo=el('textarea');memo.rows=3;memo.value=row.memo||'';mw.append(el('label','메모'),memo);fe.append(mw);
    var cancel=el('button','취소','btn line'),save=el('button','저장','btn');cancel.type=save.type='button';foot.append(cancel,save);
    cancel.onclick=function(){ov.remove()};
    save.onclick=function(){
      var name=inputs.name.value.trim();if(!name){err.textContent='이름을 입력해 주세요.';return}
      var body={name:name,phone:inputs.phone.value.trim(),email:inputs.email.value.trim(),variant:vs.value,memo:memo.value,updated_at:new Date().toISOString()};
      save.disabled=true;
      (row.id?req('PATCH','id=eq.'+row.id+'&select=id',body,RET):req('POST','select=id',body,RET)).then(function(){ov.remove();done()})
        .catch(function(e){err.textContent=e.message;save.disabled=false});
    };
    document.body.append(ov);inputs.name.focus();
  }
  function copy(text,label){
    if(!text)return;
    (navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).then(function(){window.buffToast(label+' 복사됨')}).catch(function(){window.buffToast(text)});
  }
  window.openPartnersTab=function(){
    var main=document.getElementById('main');
    return window.buffPartners.list().then(function(rows){
      var bar=el('div',null,'bar'),add=el('button','+ 파트너 추가','btn');
      bar.append(el('h2','파트너 관리'),add);
      var hint=el('p','계약서 작성 화면에서 “파트너 정보 저장”을 누르면 여기에 쌓입니다. 전화번호·이메일을 누르면 복사돼요.','hint');
      main.replaceChildren(bar,hint);
      add.onclick=function(){form({},window.openPartnersTab)};
      if(!rows.length){main.append(el('div','아직 저장된 파트너가 없습니다.','empty'));return}
      rows.forEach(function(r){
        var row=el('div',null,'row'),t=el('div',null,'t'),b=el('b',r.name),sub=el('span',(VARIANTS[r.variant]||'')+(r.memo?' · '+r.memo:''));
        t.append(b,sub);
        var contact=el('div',null,'t');contact.style.flex='1.4';
        var ph=el('button',r.phone||'전화번호 없음','btn line sm'),em=el('button',r.email||'이메일 없음','btn line sm');
        ph.type=em.type='button';ph.style.marginRight='8px';ph.onclick=function(){copy(r.phone,'전화번호')};em.onclick=function(){copy(r.email,'이메일')};
        contact.append(ph,em);
        var acts=el('div',null,'acts'),ed=el('button','수정','btn line sm'),del=el('button','삭제','btn danger sm');ed.type=del.type='button';
        ed.onclick=function(){form(r,window.openPartnersTab)};
        del.onclick=function(){if(confirm(r.name+' 파트너를 삭제할까요?'))req('DELETE','id=eq.'+r.id).then(window.openPartnersTab).catch(function(e){window.buffToast(e.message,true)})};
        acts.append(ed,del);row.append(t,contact,acts);main.append(row);
      });
    });
  };
})();
