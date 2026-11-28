(function(){
  'use strict';

  var templates={
    freelance:{title:'개인 프리랜서',fields:[['partner','성명'],['contact','연락처']],settlement:['세전 총액 (원천징수 해당 시 공제)','실수령액 (원천징수 해당 시 세전 환산)','원천징수 대상 아님']},
    business:{title:'개인사업자',fields:[['partner','상호'],['representative','대표자'],['registration','사업자등록번호'],['address','사업장 주소'],['contact','연락처']],settlement:['부가세 별도','부가세 포함','부가세 해당 없음','원천징수 대상 (세전 총액)','원천징수 대상 (실수령액)']},
    company:{title:'법인사업자',fields:[['partner','법인 상호'],['representative','대표자'],['registration','사업자등록번호'],['address','본점 주소'],['signer','서명자 성명·직위 (대표자 대리 시)'],['contact','연락처']],settlement:['부가세 별도','부가세 포함','부가세 해당 없음']}
  };
  var groups=[
    ['프로젝트와 작업 범위',[
      ['project','프로젝트명'],['client','지정 고객사'],['role','업무 유형',['사진','영상','디자인','기타 제작']],
      ['contractDate','체결일','date'],['start','계약 시작일','date'],['end','계약 종료일','date'],
      ['workDate','작업일·시간'],['place','작업 장소'],['scope','업무 범위·투입 인력','textarea']
    ]],
    ['납품과 검수',[
      ['deliverables','납품물·수량·형식','textarea'],['due','최종 납품일','date'],['revisions','포함 수정 횟수','number'],
      ['deliveryLink','BUFF 지정 업로드 링크 (선택)','url'],['originals','원본·편집 파일 포함 여부']
    ]],
    ['용역대금과 정산',[
      ['fee','합의 금액 (원)','number'],['payDue','지급일','date'],['payment','지급 방식',['계좌이체','현금 지급']],
      ['expenses','별도 경비·정산 기준','textarea']
    ]],
    ['이용 범위와 특약',[
      ['use','BUFF·고객사 이용 매체 및 지역','textarea'],['buffShare','BUFF 저작재산권 지분 (%)','number'],
      ['credit','파트너 크레딧 이름'],['extras','취소·재촬영·보험·기타 특약 (선택)','textarea']
    ]]
  ];
  var issuer='버프유니버스(BUFF UNIVERSE)\n대표자 김동준 · 사업자등록번호 295-24-02126\n서울특별시 관악구 남부순환로 1921-1, 202-E4호(봉천동, 범산빌딩)';
  var defaults={role:'사진',payment:'계좌이체',revisions:'1',buffShare:'50'};
  var type='freelance',shared=Object.assign({},defaults),parties={};
  var css=[
    '.ct-tools{display:flex;gap:8px;flex-wrap:wrap}',
    '.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.28fr);gap:18px;align-items:start}',
    '.ct-panel,.ct-paper{min-width:0;background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px}',
    '.ct-group{margin:0 0 19px;padding:0 0 15px;border:0;border-bottom:1px solid var(--line);min-width:0}',
    '.ct-group:last-child{border:0;margin:0;padding:0}',
    '.ct-group legend{font-size:16px;font-weight:700;padding:0 0 10px}',
    '.ct-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.ct-field{display:grid;gap:4px;min-width:0}.ct-wide{grid-column:1/-1}',
    '.ct-field label{font-size:13px;font-weight:600}.ct-field input,.ct-field select,.ct-field textarea{width:100%;min-width:0}',
    '.ct-field textarea{min-height:66px;resize:vertical}',
    '.ct-paper{overflow-wrap:anywhere}.ct-paper h2{font-size:24px;margin:0 0 9px}',
    '.ct-paper h3{font-size:16px;margin:14px 0 4px}',
    '.ct-paper p,.ct-paper td,.ct-paper th{font-size:14px;line-height:1.55;white-space:pre-wrap}',
    '.ct-paper p{margin:0 0 6px}.ct-paper table{border-collapse:collapse;width:100%;margin:14px 0}',
    '.ct-paper td,.ct-paper th{padding:7px 8px;border:1px solid var(--line);text-align:left;vertical-align:top}',
    '.ct-paper th{width:27%;background:#f5f5f7}.ct-signature{border-top:1px solid var(--line);padding-top:10px;margin-top:18px}',
    '@media(max-width:900px){.ct-grid{grid-template-columns:minmax(0,1fr)}}',
    '@media(max-width:410px){.ct-fields{grid-template-columns:minmax(0,1fr)}.ct-panel,.ct-paper{padding:15px}}',
    '@media print{@page{size:A4;margin:16mm}body{background:white}header.top,nav.tabs,.ct-screen{display:none!important}main{padding:0!important;max-width:none!important}.ct-grid{display:block}.ct-paper{border:0;padding:0}.ct-paper tr,.ct-paper section,.ct-signature{break-inside:avoid}.ct-paper h2{font-size:20px}.ct-paper p,.ct-paper td,.ct-paper th{font-size:10pt}}'
  ].join('\n');

  function element(tag,text){
    var node=document.createElement(tag);
    if(text!==undefined)node.textContent=text;
    return node;
  }
  function value(data,key){return String(data[key]||'').trim();}
  function label(data,key){return value(data,key)||'________________';}
  function clauses(){
    var payment='BUFF는 고객사 정산 여부와 별개로 작업확인서의 약정 지급일까지 용역대금을 지급하고, 사전에 승인된 별도 실비는 증빙에 따라 정산한다. 현금 지급 시 수령일과 수령 금액을 기록한다.';
    if(type!=='company')payment+=' 원천징수 의무가 있는 건은 지급 방식과 관계없이 관계 법령에 따라 처리한다. 세전 총액 약정 시 법정 원천징수액을 공제하고, 실수령액 약정 시에는 약정 금액을 지급할 수 있도록 세전 금액을 산정한다.';
    if(type!=='freelance')payment+=' 부가가치세와 세금계산서 등 증빙 발급은 작업확인서와 관계 법령에 따른다.';
    return [
      ['제1조 목적과 수행 범위','BUFF는 작업확인서에 명시된 제작 용역을 수행자에게 위탁하고, 수행자는 이를 수행하여 BUFF에 납품한다. BUFF는 작업에 필요한 자료·출입 권한·현장 안내를 제공한다. 업무 범위, 일정, 인력, 비용 또는 추가 작업을 바꿀 때에는 작업 전에 서면으로 합의한다. 수행자는 BUFF의 사전 서면 동의를 받아 업무를 재위탁할 수 있다. 양 당사자는 상호·대표자·연락처 등 계약 이행에 영향을 주는 변경 사항을 지체 없이 서면으로 통지한다.'],
      ['제2조 납품과 검수','수행자는 합의한 납품물 전부를 납품일까지 BUFF가 지정한 링크에 업로드하고 완료를 알린다. BUFF는 필요한 업로드 링크와 권한을 납품 전에 제공한다. 원본과 편집 파일은 작업확인서에 포함된 경우 인도한다.\n\nGoogle Drive로 납품하는 사진 중 수행자가 소유한 개별 파일의 소유권은 BUFF가 지정한 계정에 이전한다. 수행자는 납품일까지 필요한 이전 요청을 보내고, BUFF는 수락이 필요하면 지체 없이 처리한다. 계정 정책상 직접 이전이 제한되면 BUFF가 소유·관리할 수 있는 위치로 인도하는 방식을 합의한다. 결과물의 저작재산권은 제4조에 따른다.\n\nBUFF는 납품물을 받은 날부터 5영업일 안에 승인 또는 합의한 검수 기준에 따른 구체적인 보완 요청을 서면으로 알린다. 관계 법령에 따른 기한이 더 짧으면 그 기한을 적용한다. 그 기간 내 회신이 없으면 검수가 완료된 것으로 본다. 합의 기준에 미달한 부분을 보완하는 작업은 포함 수정 횟수의 적용을 받지 않으며, 범위 밖 추가 작업의 비용과 납기는 사전에 합의한다.'],
      ['제3조 용역대금과 정산',payment],
      ['제4조 저작재산권과 이용 범위','각 당사자는 최종 납품물에 대해 자신이 보유한 저작재산권 중 상대방의 약정 지분을 용역대금 완납 시 상대방에게 양도하여 작업확인서의 비율로 공유한다. 양도 대상에는 2차적저작물작성권이 포함된다. 저작인격권과 기존 자료 및 제3자 자료에 관한 권리는 각각의 권리자에게 귀속된다. 수행자가 다른 창작자를 투입하는 경우 합의한 권리의 이전 및 이용에 필요한 권한을 확보한다.\n\n양 당사자는 BUFF와 지정 고객사가 프로젝트 종료 후에도 작업확인서에 정한 매체와 지역 등 이용 조건에 따라 최종 납품물을 기간 제한 없이 활용하는 데 동의한다. 약정 범위를 벗어나는 광고, 제3자 제공, 재편집, 지분 처분은 사전에 서면으로 합의한다. 각 당사자는 자신이 제공한 음원, 폰트, 스톡 등 제3자 소재의 이용 조건을 확인해 상대방에게 알린다.'],
      ['제5조 포트폴리오와 크레딧','파트너는 BUFF 또는 고객사의 공식 공개 후 비밀유지, 초상 이용 및 고객사와 합의한 공개 조건의 범위에서 최종 납품물을 포트폴리오에 게시할 수 있다. 게시물에는 작업확인서에 적힌 BUFF와 파트너의 크레딧을 함께 표기한다.'],
      ['제6조 현장 안전과 보험','양 당사자는 각자가 통제하는 인력, 장비 및 작업 구역에 관한 안전조치를 이행하고 사고나 위험을 알린다. 현장 위험으로 작업이 어려우면 안전 확보를 위해 중단하고 일정과 비용을 협의한다. 법령상 가입 의무가 있는 보험은 각 의무자가 가입하고, 프로젝트별 추가 보험의 가입 주체와 비용은 작업확인서에 명시한다.'],
      ['제7조 비밀유지와 개인정보','양 당사자는 미공개 결과물, 고객 정보 및 상대방의 비밀정보를 계약 이행 목적으로 사용하고 합의한 경로와 권한 범위에서 관리한다. 법령에 따른 공개 또는 상대방이 승인한 공개는 예외로 한다. 목적 달성 후 법정 보존 자료를 제외하고 합의에 따라 반환 또는 삭제한다. 개인정보 처리 위탁에 해당하면 착수 전에 처리 범위와 보호조치, 재위탁 제한, 감독 및 책임을 별도 서면으로 정한다.'],
      ['제8조 변경·취소·해지 및 책임','중대한 계약 위반이 있으면 상대방은 사유와 합리적인 시정 기한을 서면으로 통지하고, 기한 내 시정이 없거나 시정이 불가능하면 해지할 수 있다. 고객사 또는 BUFF의 사정으로 취소되는 경우 완료된 업무의 대가와 사전 승인된 회수 불가 실비를 정산한다. 우천·대회 취소 등 통제하기 어려운 사유가 발생하면 대체 일정과 정산 기준을 협의한다. 손해는 각자의 귀책과 관계 법령에 따라 부담한다.'],
      ['제9조 계약 체결과 분쟁','양 당사자는 계약서와 작업확인서를 확인한 뒤 서명하고 각자 보관한다. 전자서명으로 체결하기로 합의한 경우 전자서명을 사용할 수 있다. 이 계약에는 대한민국 법령을 적용하며, 분쟁은 협의 후 민사소송법상 관할 법원에서 해결한다. 강행 법령의 기준이 이 계약에 우선한다.']
    ];
  }
  function currentParty(){return parties[type]||(parties[type]={});}
  function addFields(container,title,fields,data){
    var fieldset=element('fieldset'),grid=element('div');
    fieldset.className='ct-group';grid.className='ct-fields';
    fieldset.append(element('legend',title));
    fields.forEach(function(field){
      var key=field[0],kind=field[2],choices=Array.isArray(kind),block=element('div');
      var control=element(choices?'select':kind==='textarea'?'textarea':'input'),name=element('label',field[1]);
      var values=key==='settlement'?currentParty():data;
      block.className='ct-field'+(kind==='textarea'||kind==='url'?' ct-wide':'');
      control.id='ct-'+key;name.htmlFor=control.id;
      if(choices)kind.forEach(function(choice){control.append(element('option',choice))});
      else if(kind!=='textarea')control.type=kind||'text';
      if(kind==='number'){control.min=key==='buffShare'?'1':'0';if(key==='buffShare')control.max='99'}
      if(kind==='url')control.placeholder='https://';
      control.value=value(values,key)||(choices?kind[0]:'');
      if(choices)values[key]=control.value;
      control.addEventListener('input',function(){values[key]=control.value;renderPreview()});
      block.append(name,control);grid.append(block);
    });
    fieldset.append(grid);container.append(fieldset);
  }
  function renderPreview(){
    var paper=document.getElementById('contract-preview');
    if(!paper)return;
    var template=templates[type],partner=currentParty(),s=shared;
    var share=Number(s.buffShare),fee=value(s,'fee'),link=value(s,'deliveryLink');
    var rows=[
      ['위탁자 (BUFF)',issuer],
      ['수행자',template.fields.filter(function(field){return field[0]!=='signer'||value(partner,'signer')}).map(function(field){return field[1]+' '+label(partner,field[0])}).join('\n')],
      ['프로젝트·지정 고객사',label(s,'project')+' / '+label(s,'client')+'\n업무 유형 '+label(s,'role')],
      ['계약 기간·작업',label(s,'start')+' ~ '+label(s,'end')+'\n'+label(s,'workDate')+' / '+label(s,'place')+'\n'+label(s,'scope')],
      ['납품·수정',label(s,'deliverables')+'\n'+label(s,'due')+'까지 · 포함 수정 '+label(s,'revisions')+'회\n원본·편집 파일 '+label(s,'originals')+'\n'+(link||'BUFF 지정 업로드 링크 별도 안내')],
      ['용역대금·지급', (fee?Number(fee).toLocaleString('ko-KR')+'원':'________________원')+' / '+label(partner,'settlement')+'\n'+label(s,'payDue')+' · '+label(s,'payment')+'\n경비 '+label(s,'expenses')],
      ['저작재산권 지분',Number.isInteger(share)&&share>=1&&share<=99?'BUFF '+share+'% / 파트너 '+(100-share)+'%':'공동 지분 기재'],
      ['BUFF·고객사 이용',label(s,'use')+'\n이용 기간 제한 없음'],
      ['포트폴리오 크레딧','제작 BUFF / '+label(s,'role')+' '+label(s,'credit')],
      ['특약',value(s,'extras')||'없음']
    ];
    var table=element('table'),body=element('tbody');
    table.setAttribute('aria-label','프로젝트별 작업확인서');
    rows.forEach(function(row){var tr=element('tr'),th=element('th',row[0]);th.scope='row';tr.append(th,element('td',row[1]));body.append(tr)});
    table.append(body);
    var signature=element('div');signature.className='ct-signature';
    signature.append(element('p','체결일 '+label(s,'contractDate')),element('p','위탁자  버프유니버스 · 김동준  (서명 또는 날인) __________________'),element('p','수행자  '+(value(partner,'signer')||value(partner,'representative')||label(partner,'partner'))+'  (서명 또는 날인) __________________'));
    paper.replaceChildren(element('h2','BUFF 표준 제작 용역 계약서'),element('p','계약 유형 · '+template.title),element('p','BUFF와 수행자는 아래 조건에 따라 제작 용역 계약을 체결합니다. 아래 작업확인서는 계약의 일부입니다.'),table);
    clauses().forEach(function(clause){var section=element('section');section.append(element('h3',clause[0]),element('p',clause[1]));paper.append(section)});
    paper.append(signature);
  }
  function clearDraft(){type='freelance';shared=Object.assign({},defaults);parties={}}
  window.clearContractDraft=clearDraft;
  window.openContractTab=function(){
    var main=document.getElementById('main');
    main.innerHTML='<div class="bar ct-screen"><h2>계약서</h2><div class="ct-tools"><button type="button" class="btn line" id="ct-reset">새로 작성</button><button type="button" class="btn" id="ct-print">인쇄 · PDF 저장</button></div></div>'
      +'<p class="hint ct-screen">거래 상대 유형을 선택하고 작업확인서를 작성하세요. 입력 내용은 이 탭을 이동해도 현재 페이지에 남으며 새로고침하면 초기화됩니다.</p>'
      +'<div class="ct-grid"><form class="ct-panel ct-screen" id="ct-form"><div class="ct-field" style="margin-bottom:16px"><label for="ct-template">계약 유형</label><select id="ct-template"></select></div><div id="ct-fields"></div></form><article class="ct-paper" id="contract-preview"></article></div>';
    main.prepend(element('style',css));
    var chooser=document.getElementById('ct-template'),form=document.getElementById('ct-form'),fields=document.getElementById('ct-fields');
    Object.keys(templates).forEach(function(key){var option=element('option',templates[key].title);option.value=key;chooser.append(option)});
    chooser.value=type;
    function drawFields(){
      var template=templates[type],partner=currentParty();
      fields.replaceChildren();
      addFields(fields,'수행자 정보',template.fields,partner);
      groups.forEach(function(group){
        addFields(fields,group[0],group[0]==='용역대금과 정산'?group[1].concat([['settlement','정산 기준',template.settlement]]):group[1],shared);
      });
      renderPreview();
    }
    chooser.addEventListener('change',function(){
      type=chooser.value;drawFields();
    });
    form.addEventListener('submit',function(event){event.preventDefault()});
    document.getElementById('ct-reset').addEventListener('click',function(){
      if(!confirm('현재 계약서 입력 내용을 지우고 새로 작성할까요?'))return;
      clearDraft();chooser.value=type;drawFields();
    });
    document.getElementById('ct-print').addEventListener('click',function(){
      if(form.reportValidity())window.print();
    });
    drawFields();
    return Promise.resolve();
  };
})();
