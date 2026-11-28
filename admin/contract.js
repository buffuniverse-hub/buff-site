(function(){
  'use strict';

  var templates={
    freelance:{title:'개인 프리랜서',fields:[['partner','성명'],['contact','전화번호'],['email','이메일']],settlement:['세전 총액 (원천징수 해당 시 공제)','실수령액 (원천징수 해당 시 세전 환산)','원천징수 대상 아님']},
    business:{title:'개인사업자',fields:[['partner','상호'],['representative','대표자'],['registration','사업자등록번호'],['address','사업장 주소'],['contact','전화번호'],['email','이메일']],settlement:['부가세 별도','부가세 포함','부가세 해당 없음','원천징수 대상 (세전 총액)','원천징수 대상 (실수령액)']},
    company:{title:'법인사업자',fields:[['partner','법인 상호'],['representative','대표자'],['registration','사업자등록번호'],['address','본점 주소'],['signer','서명자 성명·직위 (대표자 대리 시)'],['contact','전화번호'],['email','이메일']],settlement:['부가세 별도','부가세 포함','부가세 해당 없음']}
  };
  var groups=[
    ['프로젝트 정보',[
      ['project','프로젝트명'],['client','고객사'],['role','작업 유형',['사진','영상','디자인','기타 제작']],['contractDate','체결일','date']
    ]],
    ['계약 기간·업무',[
      ['start','계약 시작일 (비우면 첫 일정)','date'],['end','계약 종료일 (비우면 마지막 일정·납품일)','date'],['scope','작업 범위','textarea']
    ]],
    ['납품·수정',[
      ['deliverables','납품물·수량·형식','textarea'],['due','납품일','date'],['revisions','포함 수정 횟수','number'],
      ['originals','원본·편집 파일 포함 여부'],['deliveryLink','업로드 링크','url']
    ]],
    ['용역대금·지급',[
      ['fee','보수 (원)','number'],['settlement','정산 기준'],['payDue','지급일','date'],
      ['payment','지급 방식',['계좌이체','현금 지급']],['expenses','별도 경비','textarea']
    ]],
    ['저작재산권·이용·크레딧',[
      ['buffShare','BUFF 저작재산권 지분 (%)','number'],
      ['use','BUFF·고객사 이용 매체·지역','textarea',{preset:['BUFF·고객사 홍보·광고·보도 전 매체 (국내외)','BUFF 포트폴리오·공식 SNS·웹사이트 (국내외)','고객사 홍보·광고·보도 자료 (국내)','비상업적 포트폴리오·SNS 한정 (국내외)']}],
      ['credit','파트너 크레딧','text',{preset:function(){return [value(currentParty(),'partner'),'표기하지 않음'].filter(Boolean)}}]
    ]],
    ['특약',[
      ['extras','취소·재촬영·보험 등 특약','textarea']
    ]]
  ];
  var issuer='버프유니버스(BUFF UNIVERSE)\n대표자 김동준 · 사업자등록번호 295-24-02126\n서울특별시 관악구 남부순환로 1921-1, 202-E4호(봉천동, 범산빌딩)';
  var defaults={role:'사진',payment:'계좌이체',revisions:'1',buffShare:'50',contractDate:todayIso()};
  var keepExtra={},type='freelance',shared=Object.assign({},defaults),parties={},record=null,editing=false,saving=false,docxLoad=null,archivedList=false,dirty=false;
  var css=[
    '@font-face{font-family:ContractPaper;src:url(vendor/Paperozi.ttf) format("truetype");font-weight:400;font-display:swap}',
    '@font-face{font-family:ContractPaper;src:url(vendor/PaperoziBold.ttf) format("truetype");font-weight:700;font-display:swap}',
    '.ct-tools{display:flex;gap:8px;flex-wrap:wrap}',
    '.ct-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.28fr);gap:18px;align-items:start}',
    '.ct-panel,.ct-paper{min-width:0;background:#fff;border:1px solid var(--line);border-radius:12px;padding:22px}',
    '.ct-group{margin:0 0 19px;padding:0 0 15px;border:0;border-bottom:1px solid var(--line);min-width:0}',
    '.ct-group:last-child{border:0;margin:0;padding:0}',
    '.ct-group legend{font-size:16px;font-weight:700;padding:0 0 10px}',
    '.ct-details{margin-top:12px}.ct-details summary{cursor:pointer;font-size:15px;font-weight:700;padding:12px 0}.ct-details .ct-group{border:0;margin:0}',
    '.ct-schedule{border:1px solid var(--line);border-radius:8px;padding:10px;margin-bottom:8px}.ct-schedule .ct-group{margin:0;padding:0;border:0}.ct-schedule .ct-tools{margin-top:8px}',
    '.ct-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
    '.ct-field{display:grid;gap:4px;min-width:0}.ct-wide{grid-column:1/-1}',
    '.ct-field label{font-size:13px;font-weight:600}.ct-field input,.ct-field select,.ct-field textarea{width:100%;min-width:0}',
    '.ct-field textarea{min-height:66px;resize:vertical}',
    '.ct-doc-head{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:16px;margin:0 0 19px}.ct-doc-head section:last-child{text-align:right}',
    '.ct-paper .ct-doc-head p{margin:0 0 2px}.ct-paper .ct-doc-head .ct-meta{margin-bottom:8px}',
    '.ct-doc-head small,.ct-paper thead small{font-size:.72em;color:#6e6e73;font-weight:400}.ct-paper thead small{color:#b0b0b8}',
    '.ct-paper .ct-intro{margin-bottom:15px}',
    '.ct-list{display:grid;gap:8px}.ct-list-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#fff;border:1px solid var(--line);border-radius:9px;padding:13px 15px}.ct-list-row b,.ct-list-row small{display:block}.ct-list-row small{color:var(--mute);margin-top:3px}.ct-tools label{display:flex;align-items:center;gap:6px;font-size:14px}',
    '.ct-paper.ct-sheets{display:grid;justify-items:center;gap:14px;padding:14px;background:#ececf0;overflow:auto}',
    '.ct-page{position:relative;flex:none;width:210mm;height:297mm;box-sizing:border-box;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.16);overflow:hidden;overflow-wrap:anywhere;padding:14mm 14mm 0 15mm;font-family:ContractPaper,Paperozi,sans-serif;color:#1d1d1f;-webkit-print-color-adjust:exact;print-color-adjust:exact}',
    '.ct-page-body{height:243mm;overflow:hidden}',
    '.ct-cover .ct-page-body{display:flex;flex-direction:column;padding-top:6mm}.ct-cover h2{font-size:34pt;margin:0 0 15mm}.ct-cover .ct-doc-head{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-bottom:12mm}.ct-cover .ct-doc-head p{font-size:10pt}.ct-cover .ct-intro{font-size:10pt;margin-bottom:10mm}.ct-cover .ct-tablewrap{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;padding-bottom:12mm}.ct-cover table{margin:0;flex:1 1 auto;height:100%}.ct-cover td,.ct-cover th{padding:9px 11px;font-size:9.5pt;vertical-align:middle}',
    '.ct-page h2{display:flex;align-items:baseline;gap:7px 13px;flex-wrap:wrap;font-size:27pt;line-height:1.05;letter-spacing:-.035em;margin:0 0 24px}',
    '.ct-page .ct-subtitle{font-size:.445em;font-weight:400;letter-spacing:.075em;white-space:nowrap}',
    '.ct-page h3{font-size:10pt;margin:20pt 0 6pt;break-after:avoid}.ct-page-body>section:first-child h3{margin-top:0}',
    '.ct-page p,.ct-page td,.ct-page th{font-size:9pt;line-height:1.55;white-space:pre-wrap}',
    '.ct-page p{margin:0 0 6px}.ct-page section>p{margin:0 0 10px}.ct-page table{border-collapse:collapse;width:100%;margin:14px 0}',
    '.ct-page td,.ct-page th{padding:7px 8px;border:1px solid var(--line);text-align:left;vertical-align:top}',
    '.ct-page th{width:27%;background:#f5f5f7}.ct-page thead th{background:#0a0a0a;color:#fff;border-color:#0a0a0a;font-size:8.25pt}',
    '.ct-signature{border-top:1px solid var(--line);padding-top:14px;margin-top:26px}.ct-page .ct-signature>p{font-size:13pt;font-weight:700;margin:0 0 16px}.ct-sign-grid{display:grid;grid-template-columns:1fr 1fr;gap:10mm}.ct-sign-grid b{display:block;font-size:12pt;margin-bottom:8px}.ct-page .ct-sign-grid p{font-size:10.5pt;line-height:1.6;margin:0 0 3px}.ct-page .ct-sign-grid .ct-sign-line{margin-top:20px;padding-top:6px;border-top:1px solid #1d1d1f;text-align:right;color:#6e6e73;font-size:9.5pt}',
    '.ct-brand{position:absolute;left:0;right:0;bottom:0;height:34mm;display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center;box-sizing:border-box;background:#0a0a0a;color:#fff;padding:0 14mm 0 15mm}',
    '.ct-brand img{display:block;width:125px;height:auto}.ct-brand div{text-align:right}.ct-page .ct-brand p{font-size:8pt;margin:0;line-height:1.45}',
    '@media(max-width:410px){.ct-fields{grid-template-columns:minmax(0,1fr)}.ct-panel{padding:15px}}',
    '@media print{@page{size:A4;margin:0}html,body{background:#fff;margin:0!important;padding:0!important}header.top,nav.tabs,.ct-screen{display:none!important}main{padding:0!important;max-width:none!important}.ct-grid{display:block}.ct-paper.ct-sheets{display:block;padding:0;border:0;border-radius:0;background:none;overflow:visible}.ct-page{zoom:1!important;margin:0;box-shadow:none;break-after:page;page-break-after:always}.ct-page:last-child{break-after:auto;page-break-after:auto}.ct-page{height:296mm!important}.ct-paper tr,.ct-paper section{break-inside:avoid}}',
    '@media(max-width:900px){.ct-grid{grid-template-columns:minmax(0,1fr)}}',
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
  function pad(n){return ('0'+n).slice(-2)}
  function todayIso(){var d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  function parseDate(raw){
    var t=String(raw||'').trim();if(!t)return '';
    var parts=t.split(/[^0-9]+/).filter(Boolean),y=new Date().getFullYear(),m,d;
    if(parts.length===1){var n=parts[0];
      if(n.length===4){m=n.slice(0,2);d=n.slice(2)}else if(n.length===6){y=2000+Number(n.slice(0,2));m=n.slice(2,4);d=n.slice(4)}else if(n.length===8){y=Number(n.slice(0,4));m=n.slice(4,6);d=n.slice(6)}else if(n.length<=2){m=new Date().getMonth()+1;d=n}else return null}
    else if(parts.length===2){m=parts[0];d=parts[1]}
    else{y=Number(parts[0]);if(y<100)y+=2000;m=parts[1];d=parts[2]}
    m=Number(m);d=Number(d);
    if(!(m>=1&&m<=12&&d>=1&&d<=31))return null;
    return y+'-'+pad(m)+'-'+pad(d);
  }
  function parseTime(raw){
    var t=String(raw||'').trim();if(!t)return '';
    var parts=t.split(/[^0-9]+/).filter(Boolean),h,m=0;
    if(parts.length>=2){h=Number(parts[0]);m=Number(parts[1])}
    else{var n=parts[0]||'';if(n.length<=2)h=Number(n);else{h=Number(n.slice(0,n.length-2));m=Number(n.slice(-2))}}
    if(!(h>=0&&h<=24&&m>=0&&m<60))return null;
    return pad(h)+':'+pad(m);
  }
  function addFields(container,title,fields,data,collapsed,prefix){
    var fieldset=element('fieldset'),grid=element('div');
    fieldset.className='ct-group';grid.className='ct-fields';
    if(!collapsed)fieldset.append(element('legend',title));
    fields.forEach(function(field){
      var key=field[0],kind=field[2],choices=Array.isArray(kind),block=element('div');
      if(field[3]&&field[3].preset){
        var pre=field[3].preset,opts=typeof pre==='function'?pre():pre,vals=data,cur=value(vals,key);
        var sel=element('select'),custom=element(kind==='textarea'?'textarea':'input'),lab=element('label',field[1]);
        block.className='ct-field ct-wide';sel.id='ct-'+(prefix||'')+key;lab.htmlFor=sel.id;
        function build(){
          var keepVal=sel.value;sel.replaceChildren();opts=typeof pre==='function'?pre():pre;
          var first=element('option','선택해 주세요');first.value='';sel.append(first);
          opts.forEach(function(o){var op=element('option',o);op.value=o;sel.append(op)});
          var other=element('option','직접 입력…');other.value='__custom';sel.append(other);
          if(keepVal)sel.value=keepVal;
        }
        build();sel._rebuild=function(){
          if(sel.value==='__custom')return;var now=value(vals,key);build();if(typeof pre==='function'&&sel._auto&&opts[0]&&now!==opts[0]){vals[key]=now=opts[0];renderPreview()}
          if(now&&opts.indexOf(now)<0){sel.value='__custom';custom.hidden=false;custom.value=now}else sel.value=now||'';
        };
        if(kind==='textarea')custom.rows=2;else custom.type='text';
        custom.placeholder='직접 입력';custom.style.marginTop='6px';
        if(cur&&opts.indexOf(cur)<0){sel.value='__custom';custom.value=cur}else{sel.value=cur||'';custom.hidden=true;sel._auto=typeof pre==='function'&&sel.selectedIndex===1}
        sel.addEventListener('change',function(){
          sel._auto=typeof pre==='function'&&sel.selectedIndex===1;
          if(sel.value==='__custom'){custom.hidden=false;vals[key]=custom.value;custom.focus()}
          else{custom.hidden=true;vals[key]=sel.value}
          renderPreview();
        });
        custom.addEventListener('input',function(){vals[key]=custom.value;renderPreview()});
        block.append(lab,sel,custom);grid.append(block);return;
      }
      var control=element(choices?'select':kind==='textarea'?'textarea':'input'),name=element('label',field[1]);
      var values=key==='settlement'?currentParty():data;
      block.className='ct-field'+(kind==='textarea'||kind==='url'?' ct-wide':'');
      control.id='ct-'+(prefix||'')+key;name.htmlFor=control.id;
      if(choices)kind.forEach(function(choice){control.append(element('option',choice))});
      else if(kind==='date'||kind==='time'){control.type='text';control.inputMode='numeric';control.autocomplete='off';control.placeholder=kind==='date'?'1201 또는 2026-12-01':'1430';control.addEventListener('change',function(){var v=kind==='date'?parseDate(control.value):parseTime(control.value);if(v!==null){control.value=v;values[key]=v;renderPreview()}})}
      else if(kind!=='textarea')control.type=kind||'text';
      if(kind==='number'){control.min=key==='buffShare'?'1':'0';if(key==='buffShare')control.max='99'}
      if(kind==='url')control.placeholder='https://';
      if(key==='place')control.placeholder='예: 조천체육관 또는 원격';
      control.value=value(values,key)||(choices?kind[0]:'');
      if(choices)values[key]=control.value;
      control.addEventListener('input',function(){values[key]=control.value;renderPreview()});
      block.append(name,control);grid.append(block);
    });
    fieldset.append(grid);
    if(collapsed){
      var details=element('details');details.className='ct-details';
      details.append(element('summary',title),fieldset);container.append(details);
    }else container.append(fieldset);
  }
  function scheduleLabel(){return shared.role==='사진'?'촬영 일정':'작업 일정'}
  function schedules(){
    if(!Array.isArray(shared.schedule))shared.schedule=[{}];
    return shared.schedule;
  }
  function addSchedules(container){
    var block=element('fieldset'),list=element('div'),add=element('button','+ 일정 추가');
    block.className='ct-group';add.type='button';add.className='btn line sm';
    var legend=element('legend',scheduleLabel());legend.id='ct-sched-legend';block.append(legend,list,add);container.append(block);
    function draw(){
      var items=schedules();list.replaceChildren();
      items.forEach(function(item,index){
        var row=element('div');row.className='ct-schedule';
        var fields=[['date','날짜','date'],['startTime','시작 시간','time'],['endTime','종료 시간','time'],['place','장소 (또는 원격)']];
        addFields(row,'일정 '+(index+1),fields,item,false,'schedule-'+index+'-');
        if(items.length>1){
          var actions=element('div'),remove=element('button','일정 삭제');
          actions.className='ct-tools';remove.type='button';remove.className='btn line sm';
          remove.onclick=function(){items.splice(index,1);draw();document.getElementById('ct-form').dispatchEvent(new Event('input'));renderPreview();add.focus()};
          actions.append(remove);row.append(actions);
        }
        list.append(row);
      });
    }
    add.onclick=function(){schedules().push({});draw();list.lastElementChild.querySelector('input').focus()};
    draw();
  }
  function scheduleText(){
    return schedules().filter(function(row){return row.date||row.place||row.startTime||row.endTime}).map(function(row){
      var start=value(row,'startTime'),end=value(row,'endTime');
      var time=start?(end?start+'–'+(end<start?'익일 ':'')+end:start+' 시작'):(end?end+' 종료':'');
      return [value(row,'date'),time,value(row,'place')].filter(Boolean).join(' · ');
    }).join('\n')||'________________';
  }
  function contractModel(){
    var template=templates[type],partner=currentParty(),s=Object.assign({},shared);
    var dates=schedules().map(function(row){return row.date}).filter(Boolean).sort();
    s.contractDate=s.contractDate||todayIso();s.start=s.start||dates[0]||s.contractDate;s.end=s.end||[dates[dates.length-1],s.due].filter(Boolean).sort().pop()||'';
    var share=Number(s.buffShare),fee=value(s,'fee'),link=value(s,'deliveryLink');
    var partnerDetails=template.fields.filter(function(field){return field[0]!=='signer'||value(partner,'signer')}).map(function(field){return field[1]+' '+label(partner,field[0])});
    var details=[
      ['프로젝트명','Project',label(s,'project')],
      ['고객사','Client',label(s,'client')],
      ['계약 유형','Contract Type',template.title+' · '+label(s,'role')],
      ['체결일','Agreement Date',label(s,'contractDate')]
    ];
    var rows=[
      ['계약 기간·업무',label(s,'start')+' ~ '+label(s,'end')+'\n'+label(s,'scope')],
      [scheduleLabel(),scheduleText()],
      ['납품·수정',label(s,'deliverables')+'\n'+label(s,'due')+'까지 · 포함 수정 '+label(s,'revisions')+'회\n원본·편집 파일 '+label(s,'originals')+'\n'+(link||'BUFF 지정 업로드 링크 별도 안내')],
      ['용역대금·지급', (fee?Number(fee).toLocaleString('ko-KR')+'원':'________________원')+' / '+label(partner,'settlement')+'\n'+label(s,'payDue')+' · '+label(s,'payment')+'\n경비 '+label(s,'expenses')],
      ['저작재산권 지분',Number.isInteger(share)&&share>=1&&share<=99?'BUFF '+share+'% / 파트너 '+(100-share)+'%':'공동 지분 기재'],
      ['BUFF·고객사 이용',label(s,'use')+'\n이용 기간 제한 없음'],
      ['포트폴리오 크레딧','제작 BUFF / '+label(s,'role')+' '+label(s,'credit')],
      ['특약',value(s,'extras')||'없음']
    ];
    return {
      title:'SERVICE AGREEMENT',subtitle:'용역 계약서',partnerDetails:partnerDetails,details:details,issuer:issuer.split('\n'),
      intro:'하단에 표시한 위탁자 BUFF와 위 수행자는 아래 조건에 따라 제작 용역 계약을 체결합니다. 작업확인서는 계약의 일부입니다.',
      rows:rows,clauses:clauses(),project:value(s,'project'),
      signature:['체결일 '+label(s,'contractDate')],
      signParties:[
        {role:'위탁자 (갑)',lines:['버프유니버스(BUFF UNIVERSE)','대표자 김동준','사업자등록번호 295-24-02126','서울특별시 관악구 남부순환로 1921-1, 202-E4호(봉천동, 범산빌딩)'],sign:'서명 또는 날인'},
        {role:'수행자 (을)',lines:partnerDetails.concat(value(partner,'signer')||value(partner,'representative')?[]:[]),sign:'서명 또는 날인'}
      ]
    };
  }

  var fontsChecked=false,resizeBound=false;
  function fitPages(paper){
    var pageWidth=210*96/25.4,available=paper.clientWidth-28,zoom=available>0?Math.min(1,available/pageWidth):1;
    paper.querySelectorAll('.ct-page').forEach(function(page){page.style.zoom=zoom});
    if(!resizeBound){resizeBound=true;window.addEventListener('resize',function(){var el=document.getElementById('contract-preview');if(el)fitPages(el)})}
  }
  function renderPreview(){
    var lg=document.getElementById('ct-sched-legend');if(lg)lg.textContent=scheduleLabel();
    var paper=document.getElementById('contract-preview');
    if(!paper)return;
    var model=contractModel();
    var table=element('table'),head=element('thead'),headRow=element('tr'),body=element('tbody');
    table.setAttribute('aria-label','프로젝트별 작업확인서');
    var itemHead=element('th','항목 '),detailHead=element('th','작업확인서 ');
    itemHead.scope=detailHead.scope='col';
    itemHead.append(element('small','ITEM'));detailHead.append(element('small','PROJECT DETAILS'));
    headRow.append(itemHead,detailHead);
    head.append(headRow);
    model.rows.forEach(function(row){var tr=element('tr'),th=element('th',row[0]);th.scope='row';tr.append(th,element('td',row[1]));body.append(tr)});
    table.append(head,body);
    var signature=element('div');signature.className='ct-signature';
    signature.append(element('p',model.signature[0]));
    var parties=element('div');parties.className='ct-sign-grid';
    model.signParties.forEach(function(party){var box=element('div'),head=element('b',party.role);box.append(head);party.lines.forEach(function(line){box.append(element('p',line))});var sig=element('p','(서명 또는 날인)');sig.className='ct-sign-line';box.append(sig);parties.append(box)});
    signature.append(parties);
    var title=element('h2',model.title),subtitle=element('span',model.subtitle);
    subtitle.className='ct-subtitle';title.append(subtitle);
    var info=element('div'),party=element('section'),details=element('section'),partyHeading=element('p');
    info.className='ct-doc-head';
    partyHeading.append(element('b','수행자 '),element('small','SERVICE PROVIDER'));party.append(partyHeading);
    model.partnerDetails.forEach(function(line){party.append(element('p',line))});
    model.details.forEach(function(entry){
      var paragraph=element('p'),value=element('p',entry[2]);value.className='ct-meta';
      paragraph.append(element('b',entry[0]+' '),element('small',entry[1]));details.append(paragraph,value);
    });
    info.append(party,details);
    var intro=element('p',model.intro);intro.className='ct-intro';
    paper.className='ct-paper ct-sheets';paper.replaceChildren();
    function makeBrand(){
      var brand=element('div'),logo=element('img'),business=element('div');
      brand.className='ct-brand';logo.src='vendor/logo_white.png';logo.alt='BUFF';
      model.issuer.forEach(function(line,index){business.append(element('p',(index===0?'위탁자 · ':'')+line))});
      brand.append(logo,business);return brand;
    }
    var body;
    function addPage(){
      var page=element('div');page.className='ct-page';
      body=element('div');body.className='ct-page-body';
      page.append(body,makeBrand());paper.append(page);return body;
    }
    function place(node){
      body.append(node);
      if(body.children.length>1&&body.scrollHeight>body.clientHeight+1){node.remove();addPage();body.append(node)}
    }
    addPage();body.parentNode.classList.add('ct-cover');var wrap=element('div');wrap.className='ct-tablewrap';wrap.append(table);body.append(title,info,intro,wrap);
    addPage();
    model.clauses.forEach(function(clause){
      var section=element('section');
      section.append(element('h3',clause[0]),element('p',clause[1]));
      place(section);
    });
    place(signature);
    fitPages(paper);
    if(!fontsChecked&&document.fonts&&document.fonts.load){
      fontsChecked=true;
      Promise.all([document.fonts.load('400 12px ContractPaper'),document.fonts.load('700 12px ContractPaper')]).then(renderPreview).catch(function(){});
    }
  }


  var SIGN_BASE='https://buffuniverse.co.kr/sign.html?t=';
  function sha256(text){
    return crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)).then(function(buf){
      return Array.prototype.map.call(new Uint8Array(buf),function(b){return ('0'+b.toString(16)).slice(-2)}).join('');
    });
  }
  function copyText(text,okMsg){
    var p=navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject();
    p.then(function(){window.buffToast(okMsg)}).catch(function(){window.prompt('복사해 주세요',text)});
  }
  function inviteText(model){
    var who=value(currentParty(),'partner');
    return '[BUFF UNIVERSE]\n\n'+(who?who+'님, 안녕하세요.\n':'안녕하세요.\n')+(model.project||'프로젝트')+' 용역 계약서 전자서명을 요청드립니다.\n\n아래 링크에서 계약 내용을 확인하시고\n서명 부탁드립니다. 감사합니다.';
  }
  function openSendDialog(button){
    var model=contractModel(),partner=currentParty(),name=value(partner,'partner');
    if(!name||!model.project){window.buffToast('프로젝트명과 수행자 이름 또는 상호를 먼저 입력해 주세요.',true);return}
    var ov=element('div'),panel=element('div'),box=element('div'),foot=element('div'),err=element('div'),close=element('button','닫기');
    ov.className='ov';panel.className='panel';box.id='fe';foot.className='foot';err.className='err';close.type='button';close.className='btn line';
    panel.append(element('h3','전자서명 요청'),box,err,foot);foot.append(close);ov.append(panel);document.body.append(ov);
    close.onclick=function(){ov.remove()};
    var summary=element('div');summary.style.cssText='background:#f5f5f7;border-radius:12px;padding:14px 16px;margin-bottom:16px';
    var sb=element('b',model.project),ss=element('div',name+' · '+(templates[type]||{}).title);ss.style.cssText='font-size:14px;color:#6e6e73;margin-top:2px';
    summary.append(sb,ss);box.append(summary);
    var out=element('div');out.append(element('p','링크를 만드는 중…'));box.append(out);
    function row(){var r=element('div');r.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';return r}
    function btn(parent,t,fn,primary){var x=element('button',t);x.type='button';x.className=primary?'btn sm':'btn line sm';x.onclick=fn;parent.append(x);return x}
    function show(token,signedRow){
      var link=SIGN_BASE+token;out.replaceChildren();
      if(signedRow){
        var ok=element('div','✓ 서명 완료 · '+signedRow.signer_name+' · '+new Date(signedRow.signed_at).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'}));
        ok.style.cssText='background:#e4f6e9;color:#0a6b2a;border-radius:12px;padding:14px 16px;font-weight:700';out.append(ok);
        var r0=row();btn(r0,'서명본 보기',function(){window.open(link,'_blank')},true);out.append(r0);return;
      }
      var lab=element('label','서명 링크'),input=element('input');input.type='text';input.readOnly=true;input.value=link;input.onfocus=function(){input.select()};
      out.append(lab,input);
      var text=inviteText(model),email=value(partner,'email'),r=row();
      btn(r,'링크 복사',function(){copyText(link,'링크를 복사했어요.')},true);
      btn(r,'안내 문구 복사',function(){copyText(text,'문구를 복사했어요. 링크는 따로 붙여넣어 주세요.')});
      btn(r,'이메일로 보내기',function(){location.href='mailto:'+encodeURIComponent(email||'')+'?subject='+encodeURIComponent('[BUFF UNIVERSE] '+model.project+' 용역 계약서 전자서명 요청')+'&body='+encodeURIComponent(text.replace(/\n/g,'\r\n')+'\r\n\r\n'+link)});
      out.append(r);
      var hint=element('p','같은 계약서는 링크가 하나로 유지돼요. 여러 번 보내도 한 번만 서명하면 완료됩니다. 내용을 고친 뒤에 다시 열면 새 링크가 만들어지고, 이전 링크는 취소돼요.');
      hint.style.cssText='font-size:13px;color:#6e6e73;margin-top:14px';out.append(hint);
    }
    sha256(JSON.stringify(model)).then(function(hash){
      var q='select=id,token,status,doc_hash,signer_name,signed_at,expires_at&project=eq.'+encodeURIComponent(model.project)+'&partner=eq.'+encodeURIComponent(name)+'&status=in.(sent,signed)&order=created_at.desc&limit=20';
      return window.buffRest('GET','contract_signings',q).then(function(rows){
        rows=rows||[];
        var same=rows.filter(function(x){return x.doc_hash===hash});
        var signed=same.filter(function(x){return x.status==='signed'})[0];
        if(signed){show(signed.token,signed);return}
        var live=same.filter(function(x){return x.status==='sent'&&new Date(x.expires_at)>new Date()})[0];
        if(live){show(live.token);return}
        var bytes=new Uint8Array(24);crypto.getRandomValues(bytes);
        var token=Array.prototype.map.call(bytes,function(b){return ('0'+b.toString(16)).slice(-2)}).join('');
        var stale=rows.filter(function(x){return x.status==='sent'});
        return window.buffRest('POST','contract_signings','select=id',{token:token,contract_id:record?record.id:null,project:model.project,partner:name,snapshot:model,doc_hash:hash},RETURN_ROW).then(function(){
          show(token);
          stale.forEach(function(x){window.buffRest('PATCH','contract_signings','id=eq.'+x.id,{status:'canceled'}).catch(function(){})});
        });
      });
    }).catch(function(e){out.replaceChildren();err.textContent=e.message});
  }

  function loadScript(path){
    return new Promise(function(resolve,reject){
      var script=element('script');script.src=path;script.onload=resolve;
      script.onerror=function(){script.remove();reject(new Error('문서 모듈을 불러오지 못했습니다.'))};
      document.head.append(script);
    });
  }
  function exportDocx(model,button){
    var old=button.textContent;
    button.disabled=true;button.textContent='만드는 중…';
    if(!docxLoad)docxLoad=(window.docx?Promise.resolve():loadScript('vendor/docx.iife.js'))
      .then(function(){return loadScript('contract_docx.js?v=pdf-reference-5')})
      .catch(function(error){docxLoad=null;throw error});
    return docxLoad.then(function(){return window.buffContractDocx(model)}).then(function(blob){
      var project=model.project.replace(/[\\/:*?"<>|]/g,'_').slice(0,90);
      var url=URL.createObjectURL(blob),link=element('a');
      link.href=url;link.download='BUFF_용역계약서'+(project?'_'+project:'')+'.docx';
      document.body.append(link);link.click();link.remove();
      setTimeout(function(){URL.revokeObjectURL(url)},1000);
    }).catch(function(error){window.buffToast('Word 저장 실패: '+error.message,true)}).finally(function(){
      button.disabled=false;button.textContent=old;
    });
  }

  var TABLE='partner_contracts',RETURN_ROW={Prefer:'return=representation'};
  function request(method,query,body,headers){return window.buffRest(method,TABLE,query,body,headers)}
  function clearDraft(){keepExtra={};type='freelance';shared=Object.assign({},defaults);parties={};record=null;editing=false;archivedList=false;dirty=false}
  window.clearContractDraft=clearDraft;

  function patch(row,changes){
    return request('PATCH','id=eq.'+encodeURIComponent(row.id)+'&revision=eq.'+row.revision+'&select=id,revision',
      Object.assign({revision:row.revision+1,updated_at:new Date().toISOString()},changes),RETURN_ROW)
      .then(function(rows){if(!rows||!rows.length)throw new Error('다른 관리자가 변경했습니다. 목록에서 다시 열어 주세요.');return rows[0]});
  }
  function openSaved(row,button){
    button.disabled=true;
    return request('GET','id=eq.'+encodeURIComponent(row.id)+'&select=id,revision,variant,data,archived').then(function(rows){
      if(!button.isConnected)return;
      var found=rows&&rows[0];
      if(!found)throw new Error('계약서를 찾을 수 없습니다.');
      type=found.variant;shared=Object.assign({},defaults,found.data.fields);parties={};
      parties[type]=found.data.partner||{};record=found;keepExtra={manualSign:found.data.manualSign,manualSignAt:found.data.manualSignAt};editing=true;dirty=false;
      return drawEditor();
    }).catch(function(error){if(button.isConnected)window.buffToast(error.message,true)}).finally(function(){button.disabled=false});
  }
  function drawList(offset){
    var main=document.getElementById('main'),title=element('h2','계약서 목록'),toolbar=element('div'),actions=element('div');
    var header=element('div'),create=element('button','+ 계약서 작성'),toggle=element('button',archivedList?'작성 목록':'보관함');
    var list=element('div'),loading=element('p','불러오는 중…');
    header.className='bar';actions.className='ct-tools';toolbar.className='ct-tools';list.className='ct-list';loading.className='muted';
    create.type=toggle.type='button';create.className='btn';toggle.className='btn line';actions.append(toggle,create);header.append(title,actions);
    main.replaceChildren(element('style',css),header,list,toolbar);list.append(loading);
    create.onclick=function(){var wasArchived=archivedList;clearDraft();archivedList=wasArchived;editing=true;drawEditor()};
    toggle.onclick=function(){archivedList=!archivedList;drawList(0)};
    var signingsReq=window.buffRest('GET','contract_signings','select=project,partner,status,signed_at,expires_at,created_at&order=created_at.desc&limit=300').catch(function(){return []});
    return Promise.all([request('GET','select=id,project,partner,variant,revision,updated_at,manual:data->>manualSign&archived=eq.'+archivedList+'&order=updated_at.desc,id.asc&limit=51&offset='+offset),signingsReq]).then(function(res){
      var rows=res[0],latest={};(res[1]||[]).forEach(function(sg){var k=sg.project+'\u0000'+sg.partner;if(!latest[k])latest[k]=sg});
      if(!list.isConnected)return;
      rows=rows||[];list.replaceChildren();
      if(!rows.length)list.append(element('p',archivedList?'보관한 계약서가 없습니다.':'저장된 계약서가 없습니다.'));
      rows.slice(0,50).forEach(function(row){
        var item=element('div'),info=element('div'),buttons=element('div');
        var open=element('button','열기'),archive=element('button',archivedList?'복원':'보관');
        item.className='ct-list-row';buttons.className='ct-tools';open.type=archive.type='button';
        open.className='btn line sm';archive.className='btn line sm';
        info.append(element('b',row.project),element('small',row.partner+' · '+templates[row.variant].title+' · '+new Date(row.updated_at).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})));
        var sg=latest[row.project+'\u0000'+row.partner],manual=row.manual||'',chip=element('span'),stateSel=element('select');
        var shown=sg&&sg.status==='signed'?['전자서명 완료','ok']:manual==='stamped'?['서명·날인 완료','ok']:manual==='signed'?['서명 완료','ok']:
          sg&&sg.status==='sent'&&new Date(sg.expires_at)>new Date()?['서명 대기 (전자)','wait']:manual==='pending'?['서명 대기','wait']:
          manual==='canceled'||(sg&&sg.status==='canceled')?['취소','cancel']:['진행 전','none'];
        chip.textContent=shown[0];chip.style.cssText='display:inline-block;margin-left:8px;padding:2px 9px;border-radius:99px;font-size:12px;font-weight:700;background:'+({ok:'#e4f6e9',wait:'#fff2d9',cancel:'#fde7e7',none:'#eee'}[shown[1]])+';color:'+({ok:'#0a6b2a',wait:'#8a5a00',cancel:'#b3261e',none:'#6e6e73'}[shown[1]]);
        info.firstChild.append(chip);
        [['','상태 변경'],['none','진행 전'],['pending','서명 대기'],['signed','서명 완료'],['stamped','서명·날인 완료'],['canceled','취소']].forEach(function(o){var op=element('option',o[1]);op.value=o[0];stateSel.append(op)});
        stateSel.className='btn line sm';stateSel.title='전자서명 외에 직접 서명·날인한 경우 여기서 상태를 기록하세요';
        stateSel.onchange=function(){
          var v=stateSel.value;if(!v)return;stateSel.disabled=true;
          request('GET','id=eq.'+encodeURIComponent(row.id)+'&select=id,revision,data').then(function(r){
            var cur=r&&r[0];if(!cur)throw new Error('계약서를 찾을 수 없습니다.');
            var data=cur.data||{};if(v==='none')delete data.manualSign;else data.manualSign=v;data.manualSignAt=new Date().toISOString();
            return patch(cur,{data:data});
          }).then(function(){return drawList(offset)}).catch(function(error){window.buffToast(error.message,true);stateSel.disabled=false;stateSel.value=''});
        };
        buttons.append(stateSel,open,archive);item.append(info,buttons);list.append(item);
        open.onclick=function(){openSaved(row,open)};
        archive.onclick=function(){
          archive.disabled=true;
          patch(row,{archived:!archivedList}).then(function(){if(list.isConnected)return drawList(offset&&rows.length===1?offset-50:offset)})
            .catch(function(error){window.buffToast(error.message,true);archive.disabled=false});
        };
      });
      if(offset>0){
        var prev=element('button','이전');prev.className='btn line sm';prev.onclick=function(){drawList(offset-50)};toolbar.append(prev);
      }
      if(rows.length>50){
        var next=element('button','다음');next.className='btn line sm';next.onclick=function(){drawList(offset+50)};toolbar.append(next);
      }
    }).catch(function(error){if(list.isConnected)loading.textContent='목록을 불러오지 못했습니다. '+error.message});
  }
  function saveDraft(form,button,status){
    if(saving||!form.reportValidity())return;
    var partner=currentParty(),project=value(shared,'project'),name=value(partner,'partner');
    if(window.buffFmtPhone&&partner.contact)partner.contact=window.buffFmtPhone(partner.contact);
    if(!project||!name){window.buffToast('프로젝트명과 수행자 이름 또는 상호를 입력해 주세요.',true);return;}
    var data=shared,selected=type,previous=record;
    var body={project:project,partner:name,variant:selected,data:Object.assign(JSON.parse(JSON.stringify({fields:shared,partner:partner})),keepExtra.manualSign?{manualSign:keepExtra.manualSign,manualSignAt:keepExtra.manualSignAt}:{})};
    var baseJson=JSON.stringify({fields:shared,partner:partner});
    saving=true;button.disabled=true;status.textContent='저장 중…';
    var operation=previous?patch(previous,body):request('POST','select=id,revision',body,RETURN_ROW).then(function(rows){return rows&&rows[0]});
    return operation.then(function(row){
      if(!row)throw new Error('저장 결과를 확인하지 못했습니다.');
      if(window.buffPartners&&name)window.buffPartners.upsert({name:name,phone:partner.contact,email:partner.email,variant:selected}).catch(function(){});
      if(shared===data){
        record=row;
        dirty=baseJson!==JSON.stringify({fields:shared,partner:currentParty()})||type!==selected;
        if(status.isConnected)status.textContent=dirty?'저장하지 않은 변경사항이 있어요.':'저장됨';
      }
    }).catch(function(error){
      if(status.isConnected)status.textContent='저장 실패';
      window.buffToast(error.message,true);
    }).finally(function(){
      saving=false;
      var current=document.getElementById('ct-save');
      if(current)current.disabled=false;
    });
  }

  function drawEditor(){
    var main=document.getElementById('main');
    main.innerHTML='<div class="bar ct-screen"><h2>계약서 작성</h2><div class="ct-tools"><button type="button" class="btn line" id="ct-list">저장 목록</button><button type="button" class="btn line" id="ct-print">인쇄 · PDF</button><button type="button" class="btn line" id="ct-docx">Word (DOCX)</button><button type="button" class="btn line" id="ct-send">전자서명 요청</button><button type="button" class="btn" id="ct-save">저장</button></div></div>'
      +'<p class="hint ct-screen" id="ct-status" role="status"></p><div class="ct-grid"><form class="ct-panel ct-screen" id="ct-form"><div class="ct-field" style="margin-bottom:16px"><label for="ct-template">계약 유형</label><select id="ct-template"></select></div><div id="ct-fields"></div></form><article class="ct-paper" id="contract-preview"></article></div>';
    main.prepend(element('style',css));
    var chooser=document.getElementById('ct-template'),form=document.getElementById('ct-form'),fields=document.getElementById('ct-fields');
    var status=document.getElementById('ct-status'),save=document.getElementById('ct-save');
    status.textContent=dirty?'저장하지 않은 변경사항이 있어요.':record?'저장된 계약서':'작성한 계약서를 보관하려면 저장을 눌러 주세요.';
    save.disabled=saving;
    Object.keys(templates).forEach(function(key){var option=element('option',templates[key].title);option.value=key;chooser.append(option)});
    chooser.value=type;
    function drawFields(){
      var template=templates[type],partner=currentParty();
      fields.replaceChildren();
      var pick=element('div'),pickSel=element('select'),pickLabel=element('label','저장된 파트너 불러오기');
      pick.className='ct-field';pickLabel.htmlFor='ct-pick';pickSel.id='ct-pick';pickSel.append(element('option','선택 안 함'));
      pick.append(pickLabel,pickSel);fields.append(pick);
      if(window.buffPartners)window.buffPartners.list().then(function(rows){
        if(!pickSel.isConnected)return;
        rows.forEach(function(r,i){var o=element('option',r.name+(r.phone?' · '+r.phone:''));o.value=i;pickSel.append(o)});
        pickSel.onchange=function(){
          var r=rows[pickSel.value];if(!r)return;
          if(r.variant&&templates[r.variant])type=r.variant;
          var p=currentParty();p.partner=r.name;p.contact=r.phone||'';p.email=r.email||'';
          chooser.value=type;dirty=true;drawFields();
        };
      }).catch(function(){});
      addFields(fields,'수행자',template.fields,partner);
      var group=fields.lastElementChild,gridEl=group.querySelector('.ct-fields');
      pick.style.marginBottom='14px';group.insertBefore(pick,gridEl);
      var phoneBox=group.querySelector('#ct-contact'),mailBox=group.querySelector('#ct-email');
      if(phoneBox){phoneBox.inputMode='tel';phoneBox.placeholder='010-0000-0000';phoneBox.addEventListener('change',function(){
        if(window.buffFmtPhone&&phoneBox.value.indexOf('@')<0){var f=window.buffFmtPhone(phoneBox.value);if(f!==phoneBox.value){phoneBox.value=f;partner.contact=f;renderPreview()}}
        if(phoneBox.value.indexOf('@')>=0&&mailBox&&!mailBox.value){mailBox.value=phoneBox.value.trim();phoneBox.value='';partner.email=mailBox.value;partner.contact='';mailBox.dispatchEvent(new Event('input',{bubbles:true}));phoneBox.dispatchEvent(new Event('input',{bubbles:true}));window.buffToast('이메일 주소라서 이메일 칸으로 옮겼어요.')}
      })}
      if(mailBox){mailBox.type='email';mailBox.placeholder='name@example.com';mailBox.parentNode.classList.add('ct-wide')}
      var keep=element('button','＋ 이 수행자를 파트너로 등록');keep.type='button';keep.className='btn sm';keep.style.marginTop='14px';
      keep.onclick=function(){
        var p=currentParty();
        if(!value(p,'partner')){window.buffToast('수행자 이름 또는 상호를 먼저 입력해 주세요.',true);return}
        keep.disabled=true;
        window.buffPartners.upsert({name:p.partner,phone:p.contact,email:p.email,variant:type}).then(function(){keep.textContent='✓ 파트너로 등록됨 (다시 누르면 정보 갱신)';window.buffToast('파트너 관리에 등록했어요.')})
          .catch(function(e){window.buffToast(e.message,true)}).finally(function(){keep.disabled=false});
      };
      group.append(keep);
      groups.forEach(function(group,index){
        var inputs=group[1].map(function(field){return field[0]==='settlement'?['settlement','정산 기준',template.settlement]:field});
        addFields(fields,group[0],inputs,shared,group[2]);
        if(index===1)addSchedules(fields);
      });
      renderPreview();
    }
    chooser.addEventListener('change',function(){type=chooser.value;drawFields()});
    form.addEventListener('submit',function(event){event.preventDefault()});
    form.addEventListener('input',function(ev){[].forEach.call(form.querySelectorAll('select'),function(x){if(x._rebuild&&x!==ev.target&&ev.target.tagName!=='SELECT')x._rebuild()});dirty=true;status.textContent='저장하지 않은 변경사항이 있어요.'});
    document.getElementById('ct-list').onclick=function(){
      if(dirty&&!confirm('저장하지 않은 변경사항이 있습니다. 목록으로 돌아갈까요?'))return;
      editing=false;drawList(0);
    };
    document.getElementById('ct-print').onclick=function(){if(form.reportValidity())window.print()};
    document.getElementById('ct-docx').onclick=function(){if(form.reportValidity())exportDocx(contractModel(),this)};
    document.getElementById('ct-send').onclick=function(){if(form.reportValidity())openSendDialog(this)};
    save.onclick=function(){saveDraft(form,save,status)};
    drawFields();
    return Promise.resolve();
  }
  window.openContractTab=function(){return editing?drawEditor():drawList(0)};
})();
