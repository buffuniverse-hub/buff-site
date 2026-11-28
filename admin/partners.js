(function(){
  'use strict';
  var TABLE='partner_profiles',VARIANTS={freelance:'개인 프리랜서',business:'개인사업자',company:'법인사업자'};
  var AREAS=['사진','영상','디자인','마케팅 기획','브랜딩','기타'];
  function fmtPhone(raw){
    var t=String(raw||'').trim();if(!t||t.indexOf('@')>=0)return t;
    var d=t.replace(/\D/g,'');if(d.indexOf('82')===0&&d.length>=11)d='0'+d.slice(2);
    var m;
    if(d.indexOf('02')===0){m=d.length===9?[2,3,4]:d.length===10?[2,4,4]:null}
    else if(d.length===11)m=[3,4,4];else if(d.length===10)m=[3,3,4];else if(d.length===8)m=[4,4];else m=null;
    if(!m)return t;
    var out=[],i=0;m.forEach(function(n){out.push(d.slice(i,i+n));i+=n});return out.join('-');
  }
  window.buffFmtPhone=fmtPhone;
  function el(tag,text,cls){var e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e}
  function req(method,query,body,headers){return window.buffRest(method,TABLE,query,body,headers)}
  var RET={Prefer:'return=representation'};
  window.buffPartners={
    list:function(){return req('GET','select=*&order=is_new.desc,created_at.desc')},
    /* 이름이 같은 파트너가 있으면 갱신, 없으면 새로 저장 */
    upsert:function(info){
      var name=(info.name||'').trim();if(!name)return Promise.reject(new Error('파트너 이름이 필요합니다.'));
      var fields={name:name,phone:fmtPhone(info.phone),email:(info.email||'').trim(),updated_at:new Date().toISOString()};
      if(info.variant)fields.variant=info.variant;
      var add=(info.areas||[]).filter(Boolean);
      return req('GET','select=id,areas&name=eq.'+encodeURIComponent(name)+'&limit=1').then(function(rows){
        if(rows&&rows[0]){
          var merged=(rows[0].areas||[]).slice();add.forEach(function(a){if(merged.indexOf(a)<0)merged.push(a)});fields.areas=merged;
          return req('PATCH','id=eq.'+rows[0].id+'&select=id',fields,RET).then(function(r){return r[0]});
        }
        fields.areas=add;
        return req('POST','select=id',fields,RET).then(function(r){return r[0]});
      });
    }
  };
  function form(row,done){
    var ov=el('div',null,'ov'),panel=el('div',null,'panel'),fe=el('div'),err=el('div',null,'err'),foot=el('div',null,'foot');
    fe.id='fe';panel.append(el('h3',row.id?'파트너 수정':'파트너 추가'),fe,err,foot);ov.append(panel);
    var inputs={};
    [['name','이름 · 상호','text'],['phone','전화번호','text'],['email','이메일','email'],['portfolio','포트폴리오 링크','text']].forEach(function(f){
      var wrap=el('div',null,'f'),label=el('label',f[1]),input=el('input');input.type=f[2];input.value=row[f[0]]||'';
      if(f[0]==='phone')input.inputMode='tel';
      wrap.append(label,input);fe.append(wrap);inputs[f[0]]=input;
    });
    var vw=el('div',null,'f'),vs=el('select');vw.append(el('label','구분'),vs);
    Object.keys(VARIANTS).forEach(function(k){var o=el('option',VARIANTS[k]);o.value=k;vs.append(o)});vs.value=row.variant||'freelance';fe.append(vw);
    var aw=el('div',null,'f'),chosen=(row.areas||[]).slice(),chips=el('div');aw.append(el('label','업무 영역 (여러 개 선택 가능)'),chips);chips.style.cssText='display:flex;flex-wrap:wrap;gap:8px';
    var extra=chosen.filter(function(a){return AREAS.indexOf(a)<0});
    function drawChips(){
      chips.replaceChildren();
      AREAS.concat(extra).forEach(function(a){
        var on=chosen.indexOf(a)>=0,b=el('button',a,on?'btn sm':'btn line sm');b.type='button';
        b.onclick=function(){var i=chosen.indexOf(a);if(i>=0)chosen.splice(i,1);else chosen.push(a);drawChips()};chips.append(b);
      });
      var add=el('button','+ 직접 추가','btn line sm');add.type='button';
      add.onclick=function(){var v=(prompt('업무 영역 이름')||'').trim();if(v&&AREAS.concat(extra).indexOf(v)<0){extra.push(v);chosen.push(v)}drawChips()};chips.append(add);
    }
    drawChips();fe.append(aw);
    var mw=el('div',null,'f'),memo=el('textarea');memo.rows=3;memo.value=row.memo||'';mw.append(el('label','메모'),memo);fe.append(mw);
    var cancel=el('button','취소','btn line'),save=el('button','저장','btn');cancel.type=save.type='button';foot.append(cancel,save);
    cancel.onclick=function(){ov.remove()};
    save.onclick=function(){
      var name=inputs.name.value.trim();if(!name){err.textContent='이름을 입력해 주세요.';return}
      var body={name:name,phone:fmtPhone(inputs.phone.value),email:inputs.email.value.trim(),variant:vs.value,areas:chosen,memo:memo.value,portfolio:inputs.portfolio.value.trim(),is_new:false,updated_at:new Date().toISOString()};
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
        if(r.is_new){var nb=el('span','NEW');nb.style.cssText='margin-left:8px;font-size:11px;font-weight:800;background:#0071e3;color:#fff;border-radius:99px;padding:2px 8px';b.append(nb)}
        if(r.source){var sb=el('span',r.source+' 신청');sb.style.cssText='margin-left:6px;font-size:11px;font-weight:700;background:#fff2d9;color:#8a5a00;border-radius:99px;padding:2px 8px';b.append(sb)}
        t.append(b,sub);
        if(r.portfolio){var pl=el('a',r.portfolio);pl.href=/^https?:/.test(r.portfolio)?r.portfolio:'https://'+r.portfolio;pl.target='_blank';pl.rel='noopener';pl.style.cssText='display:block;margin-top:4px;font-size:12px;word-break:break-all';t.append(pl)}
        var areaRow=el('div');areaRow.style.cssText='margin-top:6px;display:flex;flex-wrap:wrap;gap:6px';(r.areas||[]).forEach(function(a){var c=el('span',a);c.style.cssText='font-size:12px;font-weight:700;background:#eef0f5;border-radius:99px;padding:3px 10px';areaRow.append(c)});t.append(areaRow);
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
