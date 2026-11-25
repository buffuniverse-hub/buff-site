/* BUFF 인보이스 발급기 — 입력 → 실시간 미리보기 → PDF 저장(인쇄) */
(function(){
var LS='buff_invoice_defaults_v3',LOGO='../assets/de541288e60385660bcdb547a13a3d78.png';
var P={title:['SERVICE INVOICE',''],from:['공급자','FROM'],bill:['공급받는 자','BILL TO'],det:['인보이스 정보','INVOICE DETAILS'],
 fl:[['상호','Company'],['주소','Address'],['이메일/연락처','Email / Tel'],['사업자등록번호','Tax ID / Reg. No.']],
 bl:[['고객명/업체명','Client Name / Company'],['주소','Address'],['이메일/연락처','Email / Tel'],['사업자등록번호','Tax ID / Reg. No.']],
 dl:[['인보이스 번호','Invoice No.'],['발행일','Issue Date'],['결제 기한','Due Date'],['결제 조건','Payment Terms'],['프로젝트 담당자','Project Lead']],
 th:[['No',''],['서비스/용역 내역','Description of Service'],['기간/수량','Period / Qty'],['단가','Unit Price'],['금액','Amount']],
 tot:[['공급가액','Subtotal'],['세액','Tax / VAT'],['총 청구금액','Total Due']],
 pay:['입금 계좌','PAYMENT'],pl:[['은행명','Bank Name'],['예금주','Account Holder'],['계좌번호/SWIFT','Account No. / SWIFT']],note:['비고','NOTES']};
function mk(l){var ko=l==='ko',f=function(x){return Array.isArray(x[0])?x.map(f):(ko||!x[1]?[x[0],x[1]]:[x[1],x[0]])};
  var o={};Object.keys(P).forEach(function(k){o[k]=f(P[k])});return o}
var TX={ko:mk('ko'),en:mk('en')};TX.ko.title=TX.en.title=['SERVICE INVOICE','인보이스'];
var DEF={lang:'ko',cur:'KRW',vm:'ex',fCo:'',fAd:'',fNm:'',fEm:'',fTx:'',bank:'',holder:'',acct:'',notes:'',qnotes:''};
var DB=null,KEYS=['lang','cur','vm','fCo','fAd','fNm','fEm','fTx','bank','holder','acct','notes','qnotes'];
var S;
function ld(){return Object.assign({},DEF,DB||{})}
function sv(){}
function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function today(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function addDays(n){var d=new Date();d.setDate(d.getDate()+n);return today(d)}
function fmtD(s){return s?s.replace(/-/g,'. ')+'.':''}
var CUR={KRW:['₩',0,'원화 KRW (₩)'],USD:['US$',2,'미국 달러 USD (US$)'],EUR:['€',2,'유로 EUR (€)'],JPY:['JP¥',0,'일본 엔 JPY (JP¥)'],GBP:['£',2,'영국 파운드 GBP (£)'],CNY:['CN¥',2,'중국 위안 CNY (CN¥)'],THB:['฿',2,'태국 바트 THB (฿)'],SGD:['S$',2,'싱가포르 달러 SGD (S$)'],AUD:['A$',2,'호주 달러 AUD (A$)']};
function dec(){return (CUR[S.cur]||CUR.KRW)[1]}
function rnd(x){var m=Math.pow(10,dec());return Math.round(x*m)/m}
function money(n){n=+n||0;var c=CUR[S.cur]||CUR.KRW;return c[0]+n.toLocaleString('en-US',{minimumFractionDigits:c[1],maximumFractionDigits:c[1]})}
function nt(){return qt()?S.qnotes:S.notes}
function qt(){return S&&S.doc==='qt'}
function nextNo(){var y=new Date().getFullYear(),k=(qt()?'buff_quote_seq_':'buff_invoice_seq_')+y,n=1;try{n=(+localStorage.getItem(k)||0)+1}catch(e){}return 'BUFF-'+(qt()?'Q-':'')+y+'-'+('00'+n).slice(-3)}
function bump(){var y=new Date().getFullYear(),k=(qt()?'buff_quote_seq_':'buff_invoice_seq_')+y;try{var m=(S.no||'').match(/^BUFF-(?:Q-)?(\d{4})-(\d+)$/);if(m&&+m[1]===y)localStorage.setItem(k,String(Math.max(+localStorage.getItem(k)||0,+m[2])))}catch(e){}}

function termText(v){return v==='0'?'Due on receipt · 수령 즉시':'Net '+v+' · 발행 후 '+v+'일 이내'}
function addTo(d,n){var x=new Date(d+'T00:00:00');x.setDate(x.getDate()+n);return today(x)}
function totals(){var s=0;S.items.forEach(function(it){s+=(+it.qty||0)*(+it.price||0)});var sub,v,tot;
  if(S.vm==='in'){tot=s;sub=rnd(s/1.1);v=rnd(tot-sub)}
  else if(S.vm==='ex'){sub=s;v=rnd(s*.1);tot=sub+v}
  else{sub=s;v=0;tot=s}
  return{sub:sub,vat:v,tot:tot}}
function vmNote(){var ko=S.lang==='ko';return S.vm==='in'?(ko?'VAT 포함':'incl. VAT'):S.vm==='ex'?(ko?'VAT 별도':'excl. VAT'):''}
function vatLabel(){return S.vm==='none'?'없음/None':'10%'}
function tx(){var t=TX[S.lang];if(!qt())return t;var ko=S.lang==='ko',c=JSON.parse(JSON.stringify(t));
  c.title=['QUOTATION','견적서'];c.dl[0]=ko?['견적서 번호','Quote No.']:['Quote No.','견적서 번호'];c.dl[2]=ko?['견적 유효기간','Valid Until']:['Valid Until','견적 유효기간'];
  c.tot[2]=ko?['총 견적금액','Total']:['Total','총 견적금액'];return c}
window.buffInv={get:function(){return{notes:nt(),S:S,T:tx(),TX:TX,tt:totals(),money:money,fmtD:fmtD,vmNote:vmNote,vatLabel:vatLabel}}};

var CSS='.ivw{display:grid;grid-template-columns:380px 1fr;gap:28px;align-items:start}.ivw .sec{margin-bottom:16px;padding:22px}.ivw label{margin-top:12px}.ivw .sec h3{font-size:17px;margin-bottom:2px}'
+'.ivit{border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:10px;background:#fafafa}.ivit .g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.ivit .g label{margin-top:6px;font-size:11px}.ivit input{padding:8px 10px;font-size:14px}.ivit .h{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mute);font-weight:600}'
+'.ivpv{position:sticky;top:112px}.ivbox{background:#e8e8ed;border-radius:18px;padding:16px;overflow:hidden}.ivsc{transform-origin:top left}'
+'.ivpage{width:794px;height:1123px;background:#fff;color:#1D1D1F;font-family:Paperozi,sans-serif;display:flex;flex-direction:column;position:relative;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}.ivpage *{box-sizing:border-box}'
+'.ivc{padding:56px 56px 0;flex:1}.ivts{font-size:16.3px;font-weight:400;color:#1D1D1F;letter-spacing:.32em;margin-left:18px;vertical-align:baseline}.ivttl{font-size:36px;font-weight:700;letter-spacing:.01em;line-height:1}.ivsub{font-size:12px;color:#8E8E93;margin-top:8px;letter-spacing:.06em}.ivhead{display:flex;justify-content:space-between;margin-top:34px;font-size:12px;line-height:1.55}'
+'.ivhead .k{font-weight:700;font-size:12px}.ivhead .k small{font-weight:400;color:#8E8E93;font-size:10px;margin-left:5px}.ivhead .g{color:#4a4a4f}.ivhead .rt{text-align:right}.ivhead .rt>div{margin-bottom:10px}.ivhead .rt .g{color:#1D1D1F}'
+'.ivt{width:100%;border-collapse:collapse;margin-top:26px;font-size:12px}.ivt th{background:#0A0A0A;color:#fff;font-size:11px;padding:8px 10px;text-align:left;font-weight:700;border:1px solid #0A0A0A}.ivt th small{font-weight:400;color:#B0B0B8;font-size:9px;margin-left:4px}.ivt td{border:1px solid #1D1D1F;padding:6px 10px;height:46px;vertical-align:middle;color:#3a3a3f}.ivt .c{text-align:center}.ivt .r{text-align:right}.ivt .s{font-size:10px;color:#8E8E93;margin-top:2px}'
+'.ivtot{margin:22px 0 0 auto;width:46%;border-collapse:collapse;font-size:12px}.ivtot td{border:1px solid #1D1D1F;padding:8px 10px}.ivtot td:first-child{color:#4a4a4f;width:52%}.ivtot td:first-child small{font-size:9px;color:#9A9AA0;margin-left:4px}.ivtot td:last-child{text-align:right}.ivtot .T td{background:#0A0A0A;color:#fff;font-weight:700;font-size:14px;border-color:#0A0A0A}.ivtot .T td:first-child{color:#fff}.ivtot .T small{color:#B0B0B8}'
+'.ivn{margin-top:26px;font-size:11.5px;line-height:1.6;color:#4a4a4f;max-width:52%}.ivn .k{font-weight:700;color:#1D1D1F}.ivn .k small{font-weight:400;color:#8E8E93;font-size:10px;margin-left:5px}.ivn p{margin:0 0 8px;white-space:pre-wrap}.ivn .ty{font-weight:700;color:#1D1D1F}'
+'.ivfoot{background:#0A0A0A;color:#fff;height:150px;padding:0 56px;display:flex;align-items:center;justify-content:space-between}.ivfoot img{height:40px;width:127px;object-fit:contain}.ivfoot .a{text-align:right;font-size:11px;line-height:1.65;color:#E5E5EA}.ivfoot .a b{font-size:12px;color:#fff}'
+'@media print{@page{size:A4;margin:0}html,body{background:#fff!important;padding:0!important}header.top,nav.tabs,.ivform,.toast,.ivbar{display:none!important}main{padding:0!important;max-width:none!important}.ivw{display:block}.ivpv{position:static}.ivbox{padding:0;background:#fff;border-radius:0;overflow:visible}.ivbox>div{height:auto!important}.ivsc{transform:none!important;width:auto!important;height:auto!important}.ivpage{width:210mm;height:296mm}body{height:auto!important}}';

function ph(h){return h[1]?'<small>'+E(h[1])+'</small>':''}
function page(){
  var t=tx(),tt=totals(),rows='',ko=S.lang==='ko';
  var n=Math.max(5,S.items.length);
  for(var i=0;i<n;i++){var it=S.items[i];
    if(it&&(it.desc||it.price||it.qty)){var amt=(+it.qty||0)*(+it.price||0);
      rows+='<tr><td>'+E(it.desc)+(it.sub?'<div class="s">'+E(it.sub)+'</div>':'')+'</td><td class="c">'+E(it.qty)+(it.unit?' '+E(it.unit):'')+'</td><td class="r">'+money(it.price)+'</td><td class="r">'+money(amt)+'</td></tr>'}
    else rows+='<tr><td></td><td></td><td></td><td></td></tr>'}
  var W=['40%','20%','21%','19%'];
  var th=t.th.slice(1).map(function(h,i){if(i===2&&vmNote())h=[h[0]+' ('+vmNote()+')',''];return '<th style="width:'+W[i]+';text-align:'+(i===0?'left':i===1?'center':'right')+'">'+E(h[0])+(h[1]?'<small>'+E(h[1])+'</small>':'')+'</th>'}).join('');
  var dv=[S.no,fmtD(S.issue),fmtD(S.due),S.terms,S.fNm];
  var bill=[S.cCo,S.cNm?'담당자 / Attn: '+S.cNm:'',S.cAd,S.cEm,S.cTx].filter(Boolean).map(E).join('<br>');
  var tot=function(i,v,c){return '<tr'+(c?' class="T"':'')+'><td>'+E(t.tot[i][0])+(t.tot[i][1]?'<small>'+E(t.tot[i][1])+'</small>':'')+(i===1?' '+vatLabel():'')+'</td><td>'+v+'</td></tr>'};
  return '<div class="ivpage"><div class="ivc"><div class="ivttl">'+E(t.title[0])+(t.title[1]?'<span class="ivts">'+E(t.title[1])+'</span>':'')+'</div>'
  +'<div class="ivhead"><div><div class="k">'+E(t.bill[0])+ph(t.bill)+'</div><div class="g">'+(bill||'&nbsp;')+'</div></div>'
  +'<div class="rt">'+t.dl.map(function(h,i){return '<div><div class="k">'+E(h[0])+ph(h)+'</div><div class="g">'+E(dv[i])+'</div></div>'}).join('')+'</div></div>'
  +'<table class="ivt"><thead><tr>'+th+'</tr></thead><tbody>'+rows+'</tbody></table>'
  +'<table class="ivtot"><tbody>'+tot(0,money(tt.sub))+tot(1,money(tt.vat))+tot(2,money(tt.tot),1)+'</tbody></table>'
  +'<div class="ivn">'+(qt()?'':'<p><span class="k">'+E(t.pay[0])+ph(t.pay)+'</span><br>'+[S.bank,S.holder,S.acct].map(function(v,i){return v?E(t.pl[i][0])+': '+E(v):''}).filter(Boolean).join('<br>')+'</p>')
  +(nt()?'<p>'+E(nt())+'</p>':'')+'<p class="ty">'+(qt()?'견적서를 검토해 주셔서 감사합니다. Thank you for your consideration.':'감사합니다. Thank you for your business!')+'</p></div></div>'
  +'<div class="ivfoot"><img src="'+LOGO+'" alt="BUFF"><div class="a"><b>'+E(S.fCo)+'</b><br>'+E(S.fAd)+'<br>'+E(S.fEm)+'<br>'+E(t.fl[3][0])+' / '+E(t.fl[3][1])+': '+E(S.fTx)+'</div></div></div>';
}
function scale(){var b=document.getElementById('ivbox'),s=document.getElementById('ivsc');if(!b||!s)return;var k=Math.min(1,(b.clientWidth-32)/794);s.style.transform='scale('+k+')';s.style.width='794px';s.parentNode.style.height=(s.scrollHeight*k+32)+'px'}
function paint(){var s=document.getElementById('ivsc');if(!s)return;s.innerHTML=page();scale()}

function inp(id,lab,val,type,ph){return '<label>'+lab+'</label><input type="'+(type||'text')+'" data-k="'+id+'" value="'+E(val)+'"'+(ph?' placeholder="'+E(ph)+'"':'')+'>'}
var UNITS=['건 / case','경기 / match','장 / photos','편 / video','시간 / hrs','일 / days','개월 / mo','명 / person','개 / pcs'];
function unitCtl(it,i){if(it.custom)return '<input type="text" data-i="'+i+'" data-f="unit" value="'+E(it.unit)+'" placeholder="직접 입력">';return '<select data-i="'+i+'" data-f="unit"><option value="">선택 안 함</option>'+UNITS.map(function(u){return '<option'+(it.unit===u?' selected':'')+'>'+u+'</option>'}).join('')+'<option value="__custom">직접 입력…</option></select>'}
function itemsForm(){return S.items.map(function(it,i){return '<div class="ivit"><div class="h"><span>항목 '+(i+1)+'</span><button class="btn danger sm" data-del="'+i+'" type="button">삭제</button></div>'
 +'<label>서비스/용역 내역</label><input type="text" data-i="'+i+'" data-f="desc" value="'+E(it.desc)+'">'
 +'<label>상세 설명 (선택)</label><input type="text" data-i="'+i+'" data-f="sub" value="'+E(it.sub)+'">'
 +'<div class="g"><div><label>수량</label><input type="number" min="0" step="any" data-i="'+i+'" data-f="qty" value="'+E(it.qty)+'"></div><div><label>단위 (선택)</label>'+unitCtl(it,i)+'</div><div><label>단가</label><input type="number" min="0" step="any" data-i="'+i+'" data-f="price" value="'+E(it.price)+'"></div></div></div>'}).join('')}

function loadScript(u){return new Promise(function(res,rej){var x=document.createElement('script');x.src=u;x.onload=res;x.onerror=function(){rej(new Error(u+' 로드 실패'))};document.head.appendChild(x)})}
function loadDocx(){var v='?v='+Date.now();return loadScript('vendor/docx.iife.js').then(function(){return loadScript('invoice_docx.js'+v)})}
function draw(keep){
  if(!keep){S=ld();S.doc='inv';S.no=nextNo();S.issue=today();S.due=addDays(14);S.ts='14';S.terms=termText('14');
  S.cCo='';S.cNm='';S.cAd='';S.cEm='';S.cTx='';S.items=[{desc:'',sub:'',qty:1,unit:'',price:''}];}
  var m=document.getElementById('main');
  m.innerHTML='<style>'+CSS+'</style><div class="bar ivbar"><h2>'+(qt()?'견적서 작성':'인보이스 발급')+'</h2><button class="btn line" id="ivreset" type="button">새로 작성</button><button class="btn line" id="ivprint" type="button">PDF로 저장 / 인쇄</button><button class="btn" id="ivdocx" type="button">Word(docx) 저장</button></div>'
  +'<p class="hint ivbar">입력하면 오른쪽 미리보기가 바로 바뀝니다. “PDF로 저장 / 인쇄”를 누른 뒤 대상(프린터)을 “PDF로 저장”으로 선택하세요. 공급자·계좌 정보는 아래 “기본값으로 저장”을 누르면 데이터베이스(관리자만 열람)에 저장됩니다.</p>'
  +'<div class="ivw"><div class="ivform"><div class="sec"><h3>기본</h3>'
  +'<label>문서 종류</label><select data-k="doc"><option value="inv">인보이스 (Invoice)</option><option value="qt">견적서 (Quotation)</option></select>'
  +'<label>대표 언어 (국·영문 병기)</label><select data-k="lang"><option value="ko">국문 위 · 영문 아래</option><option value="en">영문 위 · 국문 아래</option></select>'
  +'<div class="grid2"><div><label>통화</label><select data-k="cur">'+Object.keys(CUR).map(function(k){return '<option value="'+k+'">'+CUR[k][2]+'</option>'}).join('')+'</select></div><div><label>부가세 · 단가 기준</label><select data-k="vm"><option value="ex">부가세 별도 (+10%)</option><option value="in">부가세 포함 (역산)</option><option value="none">부가세 없음</option></select></div></div>'
  +inp('no',qt()?'견적서 번호':'인보이스 번호',S.no)+inp('fNm','프로젝트 담당자명 (Project Lead)',S.fNm)+'<div class="grid2"><div>'+inp('issue','발행일',S.issue,'date')+'</div><div>'+inp('due',qt()?'견적 유효기간':'결제 기한',S.due,'date')+'</div></div>'+'<label>결제 조건</label><select data-k="ts"><option value="7">Net 7 · 7일 이내</option><option value="14">Net 14 · 14일 이내</option><option value="30">Net 30 · 30일 이내</option><option value="60">Net 60 · 60일 이내</option><option value="0">Due on receipt · 수령 즉시</option><option value="custom">직접 입력</option></select><div id="ivterms" class="hide">'+inp('terms','결제 조건 직접 입력','', 'text','예: 50% 선금, 50% 납품 후')+'</div>'+'</div>'
  +'<div class="sec"><h3>공급받는 자 (고객)</h3>'+inp('cCo','고객명 / 업체명',S.cCo)+inp('cNm','담당자명 (선택)',S.cNm)+inp('cAd','주소',S.cAd)+inp('cEm','이메일 / 연락처',S.cEm)+inp('cTx','사업자등록번호',S.cTx)+'</div>'
  +'<div class="sec"><h3>서비스 내역</h3><div id="ivitems">'+itemsForm()+'</div><button class="btn line sm" id="ivadd" type="button" style="margin-top:12px">+ 항목 추가</button></div>'
  +'<div class="sec"><h3>입금 계좌 · 비고</h3>'+inp('bank','은행명',S.bank)+inp('holder','예금주',S.holder)+inp('acct','계좌번호 / SWIFT',S.acct)+'<label>비고</label><textarea data-k="'+(qt()?'qnotes':'notes')+'" style="min-height:80px">'+E(nt())+'</textarea></div>'
  +'<div class="sec"><h3>공급자 (BUFF)</h3>'+inp('fCo','상호',S.fCo)+inp('fAd','주소',S.fAd)+inp('fEm','이메일 / 연락처',S.fEm)+inp('fTx','사업자등록번호',S.fTx)+'<button class="btn sm" id="ivsave" type="button" style="margin-top:16px;width:100%">공급자·계좌·비고를 기본값으로 저장</button></div></div>'
  +'<div class="ivpv"><div class="ivbox" id="ivbox"><div><div class="ivsc" id="ivsc"></div></div></div></div></div>';
  [].forEach.call(m.querySelectorAll('select[data-k]'),function(s){s.value=S[s.getAttribute('data-k')]});
  if(S.ts==='custom'){document.getElementById('ivterms').classList.remove('hide');m.querySelector('[data-k=terms]').value=S.terms}
  m.querySelector('.ivform').addEventListener('input',function(e){var t=e.target,k=t.getAttribute('data-k');
    if(k==='doc'){S.doc=t.value;S.no=nextNo();S.due=qt()?addTo(S.issue,30):(S.ts==='0'?S.issue:S.ts==='custom'?S.due:addTo(S.issue,+S.ts));window.drawInvoice(true);return}
    if(k){S[k]=t.value;
      var f=m.querySelector('[data-k=due]'),sel=m.querySelector('[data-k=ts]'),tm=document.getElementById('ivterms');
      if(qt()){}else if(k==='ts'){if(t.value==='custom'){m.querySelector('[data-k=terms]').value=S.terms}else{S.terms=termText(t.value);S.due=t.value==='0'?S.issue:addTo(S.issue,+t.value);f.value=S.due}}
      else if(k==='issue'&&S.ts!=='custom'){S.due=S.ts==='0'?S.issue:addTo(S.issue,+S.ts);f.value=S.due}
      else if(k==='due'&&S.ts!=='custom'&&(S.ts==='0'?S.due!==S.issue:S.due!==addTo(S.issue,+S.ts))){S.ts='custom';S.terms=S.terms;sel.value='custom'}
      tm.classList.toggle('hide',S.ts!=='custom');
      if(k==='ts'||k==='due'||k==='issue'){if(S.ts==='custom'&&k!=='terms'&&!S.terms)S.terms=''}
      sv()}
    else if(t.getAttribute('data-f')){var it=S.items[+t.getAttribute('data-i')];if(t.getAttribute('data-f')==='unit'&&t.tagName==='SELECT'&&t.value==='__custom'){it.custom=true;it.unit='';redraw();return}it[t.getAttribute('data-f')]=t.value}
    paint()});
  m.querySelector('.ivform').addEventListener('change',function(e){if(/^(lang|cur|vm|ts)$/.test(e.target.getAttribute('data-k')||''))paint()});
  function redraw(){document.getElementById('ivitems').innerHTML=itemsForm();bind();paint()}
  function bind(){[].forEach.call(document.querySelectorAll('[data-del]'),function(b){b.onclick=function(){S.items.splice(+b.getAttribute('data-del'),1);if(!S.items.length)S.items.push({desc:'',sub:'',qty:1,unit:'',price:''});redraw()}})}
  document.getElementById('ivdocx').onclick=function(){var b=this;b.disabled=true;var o=b.textContent;b.textContent='만드는 중…';bump();(window.buffInvoiceDocx?Promise.resolve():loadDocx()).then(function(){return window.buffInvoiceDocx(window.buffInv.get())}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='BUFF_'+(qt()?'Quote_':'Invoice_')+S.no+(S.cCo?'_'+S.cCo.replace(/[\\/:*?"<>|]/g,''):'')+'.docx';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000)}).catch(function(e){alert('docx 생성 실패: '+e.message)}).then(function(){b.disabled=false;b.textContent=o})};
  document.getElementById('ivsave').onclick=function(){var b=this,o={};KEYS.forEach(function(k){o[k]=S[k]});b.disabled=true;window.buffRest('POST','invoice_settings','on_conflict=key',{key:'defaults',value:o,updated_at:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'}).then(function(){DB=o;window.buffToast('기본값을 저장했습니다.')}).catch(function(e){window.buffToast('저장 실패: '+e.message,true)}).then(function(){b.disabled=false})};
  document.getElementById('ivadd').onclick=function(){S.items.push({desc:'',sub:'',qty:1,unit:'',price:''});redraw()};
  document.getElementById('ivreset').onclick=function(){if(confirm('입력한 내용을 지우고 새로 작성할까요?'))window.drawInvoice()};
  document.getElementById('ivprint').onclick=function(){bump();var old=document.title;document.title='BUFF_'+(qt()?'Quote_':'Invoice_')+S.no+(S.cCo?'_'+S.cCo.replace(/[\\/:*?"<>|]/g,''):'');window.print();setTimeout(function(){document.title=old},500)};
  bind();paint();window.addEventListener('resize',scale);
  return Promise.resolve();
}
window.drawInvoice=function(keep){if(keep||DB)return draw(keep);return window.buffRest('GET','invoice_settings','select=value&key=eq.defaults').then(function(rows){DB=(rows&&rows[0]&&rows[0].value)||{};return draw(keep)})};
})();
