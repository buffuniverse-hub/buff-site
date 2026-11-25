/* BUFF 인보이스 발급기 — 입력 → 실시간 미리보기 → PDF 저장(인쇄) */
(function(){
var LS='buff_invoice_defaults_v1',LOGO='../assets/de541288e60385660bcdb547a13a3d78.png';
var TX={
 ko:{title:'SERVICE INVOICE',from:['공급자','FROM'],bill:['공급받는 자','BILL TO'],det:['인보이스 정보','INVOICE DETAILS'],
  fl:[['상호','Company'],['주소','Address'],['이메일/연락처','Email / Tel'],['사업자등록번호','Tax ID / Reg. No.']],
  bl:[['고객명/업체명','Client Name / Company'],['주소','Address'],['이메일/연락처','Email / Tel'],['사업자등록번호','Tax ID / Reg. No.']],
  dl:[['인보이스 번호','Invoice No.'],['발행일','Issue Date'],['결제 기한','Due Date'],['결제 조건','Payment Terms']],
  th:[['No',''],['서비스/용역 내역','DESCRIPTION OF SERVICE'],['기간/수량','QTY'],['단가','UNIT PRICE'],['금액','AMOUNT']],
  tot:[['공급가액','SUBTOTAL'],['세액 (VAT)','TAX / VAT'],['총 청구금액','TOTAL DUE']],
  pay:['입금 계좌','PAYMENT'],pl:[['은행명','Bank Name'],['예금주','Account Holder'],['계좌번호/SWIFT','Account No. / SWIFT']],note:['비고','NOTES']},
 en:{title:'SERVICE INVOICE',from:['FROM',''],bill:['BILL TO',''],det:['INVOICE DETAILS',''],
  fl:[['Company',''],['Address',''],['Email / Tel',''],['Tax ID / Reg. No.','']],
  bl:[['Client Name / Company',''],['Address',''],['Email / Tel',''],['Tax ID / Reg. No.','']],
  dl:[['Invoice No.',''],['Issue Date',''],['Due Date',''],['Payment Terms','']],
  th:[['No',''],['Description of Service',''],['Period / Qty',''],['Unit Price',''],['Amount','']],
  tot:[['Subtotal',''],['Tax / VAT',''],['Total Due','']],
  pay:['PAYMENT',''],pl:[['Bank Name',''],['Account Holder',''],['Account No. / SWIFT','']],note:['NOTES','']}
};
var DEF={lang:'ko',cur:'KRW',vat:10,
 fCo:'BUFF UNIVERSE (버프유니버스)',fAd:'서울 관악구 남부순환로 1921-1 (봉천동, 범산빌딩) 202-E4호',fEm:'buff.universe@gmail.com',fTx:'295-24-02126',
 bank:'',holder:'김동준 (BUFF UNIVERSE)',acct:'',notes:'결제 기한 내에 위 계좌로 입금해 주세요.'};
var S;
function ld(){try{return Object.assign({},DEF,JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){return Object.assign({},DEF)}}
function sv(){try{var o={};['lang','cur','vat','fCo','fAd','fEm','fTx','bank','holder','acct','notes'].forEach(function(k){o[k]=S[k]});localStorage.setItem(LS,JSON.stringify(o))}catch(e){}}
function E(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function today(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function addDays(n){var d=new Date();d.setDate(d.getDate()+n);return today(d)}
function fmtD(s){return s?s.replace(/-/g,'. ')+'.':''}
function money(n){n=+n||0;return S.cur==='KRW'?'₩'+Math.round(n).toLocaleString('en-US'):'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function nextNo(){var y=new Date().getFullYear(),k='buff_invoice_seq_'+y,n=1;try{n=(+localStorage.getItem(k)||0)+1}catch(e){}return 'BUFF-'+y+'-'+('00'+n).slice(-3)}
function bump(){var y=new Date().getFullYear(),k='buff_invoice_seq_'+y;try{var m=(S.no||'').match(/^BUFF-(\d{4})-(\d+)$/);if(m&&+m[1]===y)localStorage.setItem(k,String(Math.max(+localStorage.getItem(k)||0,+m[2])))}catch(e){}}

function totals(){var sub=0;S.items.forEach(function(it){sub+=(+it.qty||0)*(+it.price||0)});var v=sub*(+S.vat||0)/100;return{sub:sub,vat:v,tot:sub+v}}

var CSS='.ivw{display:grid;grid-template-columns:380px 1fr;gap:28px;align-items:start}.ivw .sec{margin-bottom:16px;padding:22px}.ivw label{margin-top:12px}.ivw .sec h3{font-size:17px;margin-bottom:2px}'
+'.ivit{border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:10px;background:#fafafa}.ivit .g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.ivit .g label{margin-top:6px;font-size:11px}.ivit input{padding:8px 10px;font-size:14px}.ivit .h{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mute);font-weight:600}'
+'.ivpv{position:sticky;top:112px}.ivbox{background:#e8e8ed;border-radius:18px;padding:16px;overflow:hidden}.ivsc{transform-origin:top left}'
+'.ivpage{width:794px;min-height:1123px;background:#fff;color:#1D1D1F;font-family:Paperozi,sans-serif;display:flex;flex-direction:column;position:relative;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
+'.ivpage *{box-sizing:border-box}.ivb{background:#0A0A0A;height:96px;padding:0 52px;display:flex;align-items:center;justify-content:space-between}.ivb img{height:36px;width:114px;object-fit:contain}.ivb b{color:#fff;font-size:26px;letter-spacing:.14em;font-weight:700}'
+'.ivc{padding:30px 52px 0;flex:1}.ivtwo{display:grid;grid-template-columns:1fr 1fr;gap:28px}.ivh{font-size:11px;font-weight:700;color:#6E6E73;letter-spacing:.06em;margin-bottom:4px}.ivh i{font-style:normal;font-weight:400;color:#9A9AA0;margin-left:6px;font-size:10px}'
+'.ivf{display:grid;grid-template-columns:104px 1fr;border-bottom:1px solid #D2D2D7;padding:6px 0;font-size:12.5px;align-items:center;min-height:34px}.ivf .l{font-size:11px;color:#6E6E73;line-height:1.2}.ivf .l small{display:block;font-size:8.5px;color:#9A9AA0}.ivf .v{word-break:break-word;line-height:1.35}'
+'.ivd{display:grid;grid-template-columns:repeat(4,1fr);background:#F5F5F7;padding:11px 14px;margin-top:20px;gap:10px}.ivd .k{font-size:9.5px;font-weight:700;color:#8E8E93}.ivd .k small{font-weight:400;color:#9A9AA0}.ivd .v{font-size:13px;margin-top:3px}'
+'.ivt{width:100%;border-collapse:collapse;margin-top:22px;font-size:12.5px}.ivt th{background:#0A0A0A;color:#fff;font-size:11px;padding:9px 8px;font-weight:700}.ivt th small{font-weight:400;color:#B0B0B8;font-size:8.5px;margin-left:4px}.ivt td{border-bottom:1px solid #D2D2D7;padding:8px;height:52px;vertical-align:middle}.ivt .n{text-align:center;color:#6E6E73;width:36px}.ivt .c{text-align:center}.ivt .r{text-align:right}.ivt .s{font-size:10px;color:#6E6E73;margin-top:2px}'
+'.ivtot{margin:14px 0 0 auto;width:52%;font-size:12.5px}.ivtot div{display:flex;justify-content:space-between;padding:7px 4px;border-bottom:1px solid #D2D2D7}.ivtot .k{color:#6E6E73}.ivtot .k small{font-size:8.5px;color:#9A9AA0;margin-left:4px}.ivtot .T{background:#0A0A0A;color:#fff;border:0;padding:10px 12px;font-weight:700;font-size:15px}.ivtot .T .k{color:#fff;font-size:13px}.ivtot .T .k small{color:#B0B0B8}'
+'.ivp{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:22px;background:#fff}.ivp>div{background:#F5F5F7;padding:16px 18px;font-size:12px}.ivp .r{display:flex;gap:10px;margin-top:5px}.ivp .r span{font-size:9.5px;color:#8E8E93;font-weight:700;min-width:70px;padding-top:2px}.ivp p{margin:5px 0 0;line-height:1.5;white-space:pre-wrap}'
+'.ivfoot{margin:0 52px;padding:10px 0 24px;border-top:1px solid #D2D2D7;font-size:9.5px;color:#6E6E73}.ivfoot b{color:#1D1D1F;margin-right:8px}'
+'@media print{@page{size:A4;margin:0}html,body{background:#fff!important;padding:0!important}header.top,nav.tabs,.ivform,.toast,.ivbar{display:none!important}main{padding:0!important;max-width:none!important}.ivw{display:block}.ivpv{position:static}.ivbox{padding:0;background:#fff;border-radius:0;overflow:visible}.ivbox>div{height:auto!important}.ivsc{transform:none!important;width:auto!important;height:auto!important}.ivpage{width:210mm;min-height:295mm}body{height:auto!important}}';

function ph(h){return h[1]?'<i>'+E(h[1])+'</i>':''}
function fld(h,v){return '<div class="ivf"><div class="l">'+E(h[0])+(h[1]?'<small>'+E(h[1])+'</small>':'')+'</div><div class="v">'+E(v)+'</div></div>'}
function page(){
  var t=TX[S.lang],tt=totals(),rows='';
  var n=Math.max(5,S.items.length);
  for(var i=0;i<n;i++){var it=S.items[i];
    if(it&&(it.desc||it.price||it.qty)){var amt=(+it.qty||0)*(+it.price||0);
      rows+='<tr><td class="n">'+(i+1)+'</td><td>'+E(it.desc)+(it.sub?'<div class="s">'+E(it.sub)+'</div>':'')+'</td><td class="c">'+E(it.qty)+(it.unit?' '+E(it.unit):'')+'</td><td class="r">'+money(it.price)+'</td><td class="r">'+money(amt)+'</td></tr>'}
    else rows+='<tr><td class="n">'+(i+1)+'</td><td></td><td></td><td></td><td></td></tr>'}
  var th=t.th.map(function(h,i){return '<th style="text-align:'+(i===0||i===2?'center':i===1?'left':'right')+'">'+E(h[0])+(h[1]?'<small>'+E(h[1])+'</small>':'')+'</th>'}).join('');
  var dv=[S.no,fmtD(S.issue),fmtD(S.due),S.terms];
  return '<div class="ivpage"><div class="ivb"><img src="'+LOGO+'" alt="BUFF"><b>'+t.title+'</b></div><div class="ivc">'
  +'<div class="ivtwo"><div><div class="ivh">'+E(t.from[0])+ph(t.from)+'</div>'+[S.fCo,S.fAd,S.fEm,S.fTx].map(function(v,i){return fld(t.fl[i],v)}).join('')+'</div>'
  +'<div><div class="ivh">'+E(t.bill[0])+ph(t.bill)+'</div>'+[S.cCo,S.cAd,S.cEm,S.cTx].map(function(v,i){return fld(t.bl[i],v)}).join('')+'</div></div>'
  +'<div class="ivd">'+t.dl.map(function(h,i){return '<div><div class="k">'+E(h[0])+(h[1]?' · <small>'+E(h[1])+'</small>':'')+'</div><div class="v">'+E(dv[i])+'</div></div>'}).join('')+'</div>'
  +'<table class="ivt"><thead><tr>'+th+'</tr></thead><tbody>'+rows+'</tbody></table>'
  +'<div class="ivtot"><div><span class="k">'+E(t.tot[0][0])+(t.tot[0][1]?'<small>'+t.tot[0][1]+'</small>':'')+'</span><span>'+money(tt.sub)+'</span></div>'
  +'<div><span class="k">'+E(t.tot[1][0])+(t.tot[1][1]?'<small>'+t.tot[1][1]+'</small>':'')+(+S.vat?' '+(+S.vat)+'%':'')+'</span><span>'+money(tt.vat)+'</span></div>'
  +'<div class="T"><span class="k">'+E(t.tot[2][0])+(t.tot[2][1]?'<small>'+t.tot[2][1]+'</small>':'')+'</span><span>'+money(tt.tot)+'</span></div></div>'
  +'<div class="ivp"><div><div class="ivh">'+E(t.pay[0])+ph(t.pay)+'</div>'+[S.bank,S.holder,S.acct].map(function(v,i){return '<div class="r"><span>'+E(t.pl[i][0])+'</span><div>'+E(v)+'</div></div>'}).join('')+'</div>'
  +'<div><div class="ivh">'+E(t.note[0])+ph(t.note)+'</div><p>'+E(S.notes)+'</p></div></div></div>'
  +'<div class="ivfoot"><b>BUFF UNIVERSE</b>buffuniverse.co.kr · buff.universe@gmail.com</div></div>';
}
function scale(){var b=document.getElementById('ivbox'),s=document.getElementById('ivsc');if(!b||!s)return;var k=Math.min(1,(b.clientWidth-32)/794);s.style.transform='scale('+k+')';s.style.width='794px';s.parentNode.style.height=(s.scrollHeight*k+32)+'px'}
function paint(){var s=document.getElementById('ivsc');if(!s)return;s.innerHTML=page();scale()}

function inp(id,lab,val,type,ph){return '<label>'+lab+'</label><input type="'+(type||'text')+'" data-k="'+id+'" value="'+E(val)+'"'+(ph?' placeholder="'+E(ph)+'"':'')+'>'}
function itemsForm(){return S.items.map(function(it,i){return '<div class="ivit"><div class="h"><span>항목 '+(i+1)+'</span><button class="btn danger sm" data-del="'+i+'" type="button">삭제</button></div>'
 +'<label>서비스/용역 내역</label><input type="text" data-i="'+i+'" data-f="desc" value="'+E(it.desc)+'">'
 +'<label>상세 설명 (선택)</label><input type="text" data-i="'+i+'" data-f="sub" value="'+E(it.sub)+'">'
 +'<div class="g"><div><label>수량</label><input type="number" min="0" step="any" data-i="'+i+'" data-f="qty" value="'+E(it.qty)+'"></div><div><label>단위 (선택)</label><input type="text" data-i="'+i+'" data-f="unit" value="'+E(it.unit)+'" placeholder="식 / hrs"></div><div><label>단가</label><input type="number" min="0" step="any" data-i="'+i+'" data-f="price" value="'+E(it.price)+'"></div></div></div>'}).join('')}

window.drawInvoice=function(){
  S=ld();S.no=nextNo();S.issue=today();S.due=addDays(14);S.terms='Net 14';
  S.cCo='';S.cAd='';S.cEm='';S.cTx='';S.items=[{desc:'',sub:'',qty:1,unit:'',price:''}];
  var m=document.getElementById('main');
  m.innerHTML='<style>'+CSS+'</style><div class="bar ivbar"><h2>인보이스 발급</h2><button class="btn line" id="ivreset" type="button">새로 작성</button><button class="btn" id="ivprint" type="button">PDF로 저장 / 인쇄</button></div>'
  +'<p class="hint ivbar">입력하면 오른쪽 미리보기가 바로 바뀝니다. “PDF로 저장 / 인쇄”를 누른 뒤 대상(프린터)을 “PDF로 저장”으로 선택하세요. 공급자·계좌 정보는 이 브라우저에 저장됩니다.</p>'
  +'<div class="ivw"><div class="ivform"><div class="sec"><h3>기본</h3>'
  +'<label>언어</label><select data-k="lang"><option value="ko">국문 (영문 병기)</option><option value="en">English</option></select>'
  +'<div class="grid2"><div><label>통화</label><select data-k="cur"><option value="KRW">KRW (₩)</option><option value="USD">USD ($)</option></select></div><div><label>부가세</label><select data-k="vat"><option value="10">10% 포함 계산</option><option value="0">없음 (0%)</option></select></div></div>'
  +inp('no','인보이스 번호',S.no)+'<div class="grid2"><div>'+inp('issue','발행일',S.issue,'date')+'</div><div>'+inp('due','결제 기한',S.due,'date')+'</div></div>'+inp('terms','결제 조건',S.terms,'text','예: Net 14 / 수령 즉시')+'</div>'
  +'<div class="sec"><h3>공급받는 자 (고객)</h3>'+inp('cCo','고객명 / 업체명',S.cCo)+inp('cAd','주소',S.cAd)+inp('cEm','이메일 / 연락처',S.cEm)+inp('cTx','사업자등록번호',S.cTx)+'</div>'
  +'<div class="sec"><h3>서비스 내역</h3><div id="ivitems">'+itemsForm()+'</div><button class="btn line sm" id="ivadd" type="button" style="margin-top:12px">+ 항목 추가</button></div>'
  +'<div class="sec"><h3>입금 계좌 · 비고</h3>'+inp('bank','은행명',S.bank)+inp('holder','예금주',S.holder)+inp('acct','계좌번호 / SWIFT',S.acct)+'<label>비고</label><textarea data-k="notes" style="min-height:80px">'+E(S.notes)+'</textarea></div>'
  +'<div class="sec"><h3>공급자 (BUFF)</h3>'+inp('fCo','상호',S.fCo)+inp('fAd','주소',S.fAd)+inp('fEm','이메일 / 연락처',S.fEm)+inp('fTx','사업자등록번호',S.fTx)+'</div></div>'
  +'<div class="ivpv"><div class="ivbox" id="ivbox"><div><div class="ivsc" id="ivsc"></div></div></div></div></div>';
  [].forEach.call(m.querySelectorAll('select[data-k]'),function(s){s.value=S[s.getAttribute('data-k')]});
  m.querySelector('.ivform').addEventListener('input',function(e){var t=e.target,k=t.getAttribute('data-k');
    if(k){S[k]=t.tagName==='SELECT'&&k==='vat'?+t.value:t.value;sv()}
    else if(t.getAttribute('data-f')){S.items[+t.getAttribute('data-i')][t.getAttribute('data-f')]=t.value}
    paint()});
  m.querySelector('.ivform').addEventListener('change',function(e){if(e.target.getAttribute('data-k')==='lang'||e.target.getAttribute('data-k')==='cur')paint()});
  function redraw(){document.getElementById('ivitems').innerHTML=itemsForm();bind();paint()}
  function bind(){[].forEach.call(document.querySelectorAll('[data-del]'),function(b){b.onclick=function(){S.items.splice(+b.getAttribute('data-del'),1);if(!S.items.length)S.items.push({desc:'',sub:'',qty:1,unit:'',price:''});redraw()}})}
  document.getElementById('ivadd').onclick=function(){S.items.push({desc:'',sub:'',qty:1,unit:'',price:''});redraw()};
  document.getElementById('ivreset').onclick=function(){if(confirm('입력한 내용을 지우고 새로 작성할까요?'))window.drawInvoice()};
  document.getElementById('ivprint').onclick=function(){bump();var old=document.title;document.title='BUFF_Invoice_'+S.no+(S.cCo?'_'+S.cCo.replace(/[\\/:*?"<>|]/g,''):'');window.print();setTimeout(function(){document.title=old},500)};
  bind();paint();window.addEventListener('resize',scale);
  return Promise.resolve();
};
})();
