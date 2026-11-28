/* BUFF 인보이스 발급기 — 입력 → 실시간 미리보기 → PDF 저장(인쇄) */
(function(){
var LS='buff_invoice_defaults_v3',LOGO='../assets/de541288e60385660bcdb547a13a3d78.png';
var P={title:['SERVICE INVOICE',''],from:['공급자','FROM'],bill:['공급받는 자','BILL TO'],det:['인보이스 정보','INVOICE DETAILS'],
 fl:[['상호','Company'],['주소','Address'],['이메일/연락처','Email / Tel'],['사업자등록번호','Tax ID / Reg. No.']],
 bl:[['고객명/업체명','Client Name / Company'],['주소','Address'],['이메일/연락처','Email / Tel'],['사업자등록번호','Tax ID / Reg. No.']],
 dl:[['인보이스 번호','Invoice No.'],['발행일','Issue Date'],['결제 기한','Due Date'],['결제 조건','Payment Terms'],['프로젝트 담당자','Project Lead']],
 th:[['No',''],['서비스/용역 내역','Description of Service'],['기간/수량','Period / Qty'],['단가','Unit Price'],['금액','Amount']],
 tot:[['공급가액','Subtotal'],['세액','Tax / VAT'],['총 청구금액','Total Due']],
 pay:['입금 계좌','PAYMENT'],pl:[['은행명','Bank Name'],['예금주','Account Holder'],['계좌번호','Account No.'],['SWIFT 코드','SWIFT Code'],['은행 주소','Bank Address'],['수취인 주소','Beneficiary Address'],['수취인 연락처','Beneficiary Tel']],note:['비고','NOTES']};
function mk(l){var ko=l==='ko',f=function(x){return Array.isArray(x[0])?x.map(f):(ko||!x[1]?[x[0],x[1]]:[x[1],x[0]])};
  var o={};Object.keys(P).forEach(function(k){o[k]=f(P[k])});return o}
var TX={ko:mk('ko'),en:mk('en')};TX.ko.title=TX.en.title=['SERVICE INVOICE','인보이스'];
var DEF={lang:'ko',cur:'KRW',vm:'ex',fCo:'',fAd:'',fAdK:'',fNm:'',fEm:'',fTx:'',bank:'',holder:'',acct:'',swift:'',bAd:'',hAd:'',hTel:'',notes:'',qnotes:''};
var DB=null,KEYS=['lang','cur','vm','fCo','fAd','fAdK','fNm','fEm','fTx','bank','holder','acct','swift','bAd','hAd','hTel','notes','qnotes'];
var S,tmr=null,saving=null,queuedSave=null,view=0,docType='inv';
var rest=function(){return window.buffRest.apply(null,arguments)};
function meaningful(){return S.cCo||S.cNm||S.items.some(function(i){return i.desc||i.price})}
function stamp(t){var e=document.getElementById('ivst');if(e)e.textContent=t}
function hm(){var d=new Date();return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function schedule(){clearTimeout(tmr);tmr=null;if(!meaningful())return;stamp('저장 중…');tmr=setTimeout(saveDraft,1500)}
function saveDraft(){
  clearTimeout(tmr);tmr=null;
  var draft=S;
  if(!draft||!meaningful())return Promise.resolve();
  if(saving){
    if(!queuedSave)queuedSave=saving.then(function(){queuedSave=null;if(S===draft)return saveDraft()});
    return queuedSave;
  }
  var r={doc:draft.doc,no:draft.no,client:draft.cCo||'',total:totals().tot,cur:draft.cur,status:draft.status||'draft',data:JSON.parse(JSON.stringify(draft)),updated_at:new Date().toISOString()};
  var p=draft.id?rest('PATCH','invoices','id=eq.'+draft.id,r,{Prefer:'return=minimal'}):rest('POST','invoices','select=id',r,{Prefer:'return=representation'}).then(function(x){if(x&&x[0])draft.id=x[0].id});
  saving=p.then(function(){if(S===draft)stamp('자동 저장됨 '+hm())}).catch(function(e){
    if(S===draft&&document.getElementById('ivst'))stamp('저장 실패: '+e.message);
    else window.buffToast('문서 저장 실패: '+e.message,true);
  }).finally(function(){saving=null});
  return saving;
}
function amt(n,c){var k=CUR[c]||CUR.KRW;return k[0]+(+n||0).toLocaleString('en-US',{minimumFractionDigits:k[1],maximumFractionDigits:k[1]})}
function showList(){
  var request=++view,type=docType,label=type==='qt'?'견적서':'인보이스',m=document.getElementById('main');
  m.innerHTML='<style>'+CSS+'</style><div class="bar"><h2>'+label+' 목록</h2><button class="btn" id="ivnew" type="button">+ '+label+' 작성</button></div><div id="ivl" class="empty">불러오는 중…</div>';
  var box=document.getElementById('ivl');
  document.getElementById('ivnew').onclick=function(){window.drawInvoice().catch(function(e){window.buffToast(e.message,true)})};
  return rest('GET','invoices','select=id,no,client,total,cur,status,updated_at&doc=eq.'+type+'&order=updated_at.desc&limit=200').then(function(rows){
    if(request!==view||!box.isConnected)return;
    if(!rows||!rows.length){box.textContent='저장된 문서가 없습니다. 작성하면 자동으로 저장됩니다.';return}
    box.className='';box.innerHTML='<table class="ivlt"><thead><tr><th>번호</th><th>고객</th><th>금액</th><th>상태</th><th>수정일</th><th></th></tr></thead><tbody>'+rows.map(function(r){var d=new Date(r.updated_at);
      return '<tr class="r" data-id="'+r.id+'"><td>'+E(r.no)+'</td><td>'+E(r.client||'—')+'</td><td>'+amt(r.total,r.cur)+'</td><td><select class="st'+(r.status==='issued'?' ok':'')+'" data-st="'+r.id+'"><option value="draft"'+(r.status==='issued'?'':' selected')+'>작성 중</option><option value="issued"'+(r.status==='issued'?' selected':'')+'>발행</option></select></td><td>'+today(d)+' '+('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+'</td><td><button class="btn danger sm" data-del="'+r.id+'" type="button">삭제</button></td></tr>'}).join('')+'</tbody></table>';
    [].forEach.call(box.querySelectorAll('select[data-st]'),function(sel){sel.onclick=function(e){e.stopPropagation()};sel.onchange=function(){var v=sel.value;sel.className='st'+(v==='issued'?' ok':'');rest('PATCH','invoices','id=eq.'+sel.getAttribute('data-st'),{status:v},{Prefer:'return=minimal'}).then(function(){window.buffToast('상태 변경: '+(v==='issued'?'발행':'작성 중'))}).catch(function(x){window.buffToast('상태 변경 실패: '+x.message,true)})}});
    [].forEach.call(box.querySelectorAll('tr.r'),function(tr){tr.onclick=function(e){var del=e.target.getAttribute&&e.target.getAttribute('data-del');
      if(del){e.stopPropagation();if(confirm('이 문서를 삭제할까요? 되돌릴 수 없습니다.'))rest('DELETE','invoices','id=eq.'+del).then(function(){if(request===view&&box.isConnected)return showList()}).catch(function(x){window.buffToast('삭제 실패: '+x.message,true)});return}
      rest('GET','invoices','select=id,doc,status,data&doc=eq.'+type+'&id=eq.'+tr.getAttribute('data-id')).then(function(r){
        if(request!==view||!box.isConnected||!r||!r[0])return;
        var row=r[0];
        S=Object.assign({},DEF,DB||{},row.data,{id:row.id,doc:row.doc,status:row.status});
        if(!S.fAdK&&DB&&DB.fAdK)S.fAdK=DB.fAdK;
        return window.drawInvoice(true);
      }).catch(function(e){if(box.isConnected)window.buffToast('문서 불러오기 실패: '+e.message,true)});
    }});
  }).catch(function(e){if(request===view&&box.isConnected)box.textContent='불러오기 실패: '+e.message});
}
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
function fname(){var c=String(S.cCo||'').replace(/\s*[\\/|]\s*/g,'_').replace(/[:*?"<>]/g,'').replace(/\s+/g,' ').trim();return (S.no||('BUFF-'+(qt()?'QUOTATION':'INVOICE')))+(c?'-'+c:'')}
function nt(){return qt()?S.qnotes:S.notes}
function qt(){return S&&S.doc==='qt'}
function nextNo(){var y=new Date().getFullYear(),k=(qt()?'buff_quote_seq_':'buff_invoice_seq_')+y,n=1;try{n=(+localStorage.getItem(k)||0)+1}catch(e){}return 'BUFF-'+(qt()?'QUOTATION-':'INVOICE-')+y+'-'+('00'+n).slice(-3)}
function bump(){var y=new Date().getFullYear(),k=(qt()?'buff_quote_seq_':'buff_invoice_seq_')+y;try{var m=(S.no||'').match(/^BUFF-(?:Q-|INVOICE-|QUOTATION-)?(\d{4})-(\d+)$/i);if(m&&+m[1]===y)localStorage.setItem(k,String(Math.max(+localStorage.getItem(k)||0,+m[2])))}catch(e){}}

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

var CSS='.ivw{display:grid;grid-template-columns:minmax(440px,1fr) var(--pvw,1fr);gap:20px;align-items:start}main{max-width:1560px!important;padding-top:20px!important;padding-bottom:16px!important}.bar.ivbar{margin-bottom:14px}.bar.ivbar h2{font-size:24px}.bar.ivbar .btn{padding:8px 16px;font-size:13.5px}p.hint.ivbar{display:none}.ivlt{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px var(--line)}.ivlt th,.ivlt td{padding:14px 16px;text-align:left;border-bottom:1px solid var(--line);font-size:14px}.ivlt th{font-size:12px;color:var(--mute);background:#fafafa}.ivlt tr.r{cursor:pointer}.ivlt tr.r:hover td{background:#f5f5f7}.ivlt .st{font-size:12px;font-weight:700;padding:3px 22px 3px 10px;border-radius:99px;background:#ececf0 url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%225%22%3E%3Cpath d=%22M0 0l4 5 4-5z%22 fill=%22%23999%22/%3E%3C/svg%3E") no-repeat right 9px center;border:0;height:auto;width:auto;-webkit-appearance:none;appearance:none;cursor:pointer;color:#1d1d1f}.ivlt .st.ok{background-color:#0A0A0A;color:#fff}.ivw .sec{margin-bottom:16px;padding:22px}.ivw label{margin-top:12px}.ivw .sec h3{font-size:17px;margin-bottom:2px}'
+'.ivit{border:1px solid var(--line);border-radius:12px;padding:10px;margin-top:10px;background:#fafafa}.ivit .g{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}.ivit .g label{margin-top:6px;font-size:11px}.ivit input,.ivit select{height:40px;padding:0 10px;font-size:14px;box-sizing:border-box;line-height:1.2}.ivit .h{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--mute);font-weight:600}'
+'.ivs{padding:0!important;margin-bottom:10px!important}.ivs>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:16px 20px;font-size:15px;font-weight:700}.ivs>summary::-webkit-details-marker{display:none}.ivs>summary:after{content:"";margin-left:auto;width:8px;height:8px;border-right:2px solid #8e8e93;border-bottom:2px solid #8e8e93;transform:rotate(45deg);transition:transform .2s}.ivs[open]>summary:after{transform:rotate(-135deg)}.ivs .no{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#1d1d1f;color:#fff;font-size:11px}.ivb{padding:0 20px 18px}.ivw .ivb label{margin-top:10px;font-size:12px}.ivw .ivb input,.ivw .ivb select{height:42px;font-size:14px}.ivw .ivb .grid2{gap:10px}.ivsub2{margin-top:12px;border-top:1px solid var(--line);padding-top:8px}.ivsub2>summary{cursor:pointer;font-size:13px;font-weight:600;padding:6px 0}.ivsub2>summary em{font-style:normal;font-weight:400;color:var(--mute);margin-left:6px}.ivgh{margin:16px 0 0;font-size:12px;font-weight:700;color:var(--mute)}.ivrow{display:flex;gap:8px;margin-top:14px}.ivrow input{flex:1;height:40px!important}.ivit{padding:8px 10px}.ivit .h{margin-bottom:4px}.ivs>summary{padding:12px 16px!important;font-size:14px!important}.ivs .no{width:20px!important;height:20px!important;font-size:10.5px!important}.ivb{padding:0 16px 14px!important}.ivw .ivb label{margin-top:8px!important;font-size:11.5px!important;margin-bottom:4px}.ivw .ivb input,.ivw .ivb select{height:38px!important;font-size:13px!important;padding-left:12px;padding-right:12px}.ivw .ivb textarea{font-size:13px}.ivw .ivb .grid2{gap:8px!important}.ivw .ivit input.ivsubin{height:34px!important;font-size:12.5px!important}.ivs{margin-bottom:8px!important}.ivrow input{height:38px!important;border-radius:12px;font-size:13px}.ivit .g{gap:6px!important}.ivx{border:0;background:none;color:#c0392b;font-size:12px;cursor:pointer;padding:2px 4px}.ivw .ivit input.ivsubin{margin-top:6px;height:36px;font-size:13px}.ivw .ivit .g label{margin-top:8px}'
+'.ivzoom{position:absolute;top:10px;right:10px;z-index:3;border:0;border-radius:99px;background:rgba(29,29,31,.85);color:#fff;font-size:12px;font-weight:600;padding:6px 12px;cursor:pointer}@media print{.ivzoom{display:none!important}}.ivpv{position:sticky;top:112px}@media screen and (min-width:1101px){.ivpv{overflow:hidden!important;position:relative}.ivpv.zoom{overflow-y:auto!important}.ivbox>div{margin:0}.ivform,.ivpv{position:sticky;top:112px;height:var(--ivh,calc(100vh - 128px));overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;-ms-overflow-style:none}.ivform::-webkit-scrollbar,.ivpv::-webkit-scrollbar{display:none}.ivform{padding-right:6px}}@media screen and (max-width:1100px){.ivw{grid-template-columns:1fr}.ivpv{position:static}}'+'.ivbox{background:none;border-radius:0;padding:2px;overflow:hidden}@media screen{.ivpage{box-shadow:0 0 0 1px #e2e2e7,0 6px 24px rgba(0,0,0,.06)}}.ivsc{transform-origin:top left}'
+'.ivpage{width:794px;height:1123px;background:#fff;color:#1D1D1F;font-family:Paperozi,Suit,sans-serif;display:flex;flex-direction:column;position:relative;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact}.ivpage *{box-sizing:border-box}'
+'.ivc{padding:56px 56px 44px;flex:1;min-height:0;overflow:hidden}.ivts{font-size:16.3px;font-weight:400;color:#1D1D1F;letter-spacing:.32em;margin-left:18px;vertical-align:baseline}.ivttl{font-size:36px;font-weight:700;letter-spacing:.01em;line-height:1}.ivsub{font-size:12px;color:#8E8E93;margin-top:8px;letter-spacing:.06em}.ivhead{display:flex;justify-content:space-between;margin-top:34px;font-size:12px;line-height:1.55}'
+'.ivhead .k{font-weight:700;font-size:12px}.ivhead .k small{font-weight:400;color:#8E8E93;font-size:10px;margin-left:5px}.ivhead .g{color:#4a4a4f}.ivhead .rt{text-align:right}.ivhead .rt>div{margin-bottom:10px}.ivhead .rt .g{color:#1D1D1F}'
+'.ivt{width:100%;border-collapse:collapse;margin-top:26px;font-size:12px}.ivt th{background:#0A0A0A;color:#fff;font-size:11px;padding:8px 10px;text-align:left;font-weight:700;border:1px solid #0A0A0A}.ivt th small{font-weight:400;color:#B0B0B8;font-size:9px;margin-left:4px}.ivt td{border:1px solid #1D1D1F;padding:6px 10px;height:40px;vertical-align:middle;color:#3a3a3f}.ivt .c{text-align:center}.ivt .r{text-align:right}.ivt .s{font-size:10px;color:#8E8E93;margin-top:2px}'
+'.ivtot{margin:18px 0 0 auto;width:46%;border-collapse:collapse;font-size:12px}.ivtot td{border:1px solid #1D1D1F;padding:8px 10px}.ivtot td:first-child{color:#4a4a4f;width:52%}.ivtot td:first-child small{font-size:9px;color:#9A9AA0;margin-left:4px}.ivtot td:last-child{text-align:right}.ivtot .T td{background:#0A0A0A;color:#fff;font-weight:700;font-size:14px;border-color:#0A0A0A}.ivtot .T td:first-child{color:#fff}.ivtot .T small{color:#B0B0B8}'
+'.ivn{margin-top:20px;font-size:11.5px;line-height:1.6;color:#4a4a4f}.ivn .k{font-weight:700;color:#1D1D1F}.ivn .k small{font-weight:400;color:#8E8E93;font-size:10px;margin-left:5px}.ivn p{margin:0 0 8px;white-space:pre-wrap}.ivn .ty{font-weight:700;color:#1D1D1F}'
+'.ivfoot{flex-shrink:0;background:#0A0A0A;color:#fff;height:150px;padding:0 56px;display:flex;align-items:center;justify-content:space-between}.ivfoot img{height:40px;width:127px;object-fit:contain}.ivfoot .a{text-align:right;font-size:11px;line-height:1.65;color:#E5E5EA}.ivfoot .a b{font-size:12px;color:#fff}'
+'@media print{@page{size:A4;margin:0}html,body{background:#fff!important;padding:0!important}header.top,nav.tabs,.ivform,.toast,.ivbar{display:none!important}main{padding:0!important;max-width:none!important}.ivw{display:block}.ivpv{position:static}.ivbox{padding:0;background:#fff;border-radius:0;overflow:visible}.ivbox>div{height:auto!important;width:auto!important}.ivsc{transform:none!important;width:auto!important;height:auto!important}.ivpage{width:211mm;height:298mm;break-after:avoid;page-break-after:avoid}.ivpage+*{display:none}html,body{height:297mm!important;overflow:hidden!important}main,.ivw,.ivpv,.ivbox,.ivbox>div,.ivsc{margin:0!important;padding:0!important;height:auto!important}}';

function ph(h){return h[1]?'<small>'+E(h[1])+'</small>':''}
function page(){
  var t=tx(),tt=totals(),rows='',ko=S.lang==='ko';
  var n=Math.max(MINR,S.items.length);
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
  +'<div class="ivn">'+('<p><span class="k">'+E(t.pay[0])+ph(t.pay)+'</span><br>'+[S.bank,S.holder,S.acct,S.swift,S.bAd,S.hAd,S.hTel].map(function(v,i){return v?E(t.pl[i][0])+': '+E(v):''}).filter(Boolean).join('<br>')+'</p>')
  +(nt()?'<p>'+E(nt())+'</p>':'')+'<p class="ty">'+(qt()?'견적서를 검토해 주셔서 감사합니다. Thank you for your consideration.':'감사합니다. Thank you for your business!')+'</p></div></div>'
  +'<div class="ivfoot"><img src="'+LOGO+'" alt="BUFF"><div class="a"><b>'+E(S.fCo)+'</b><br>'+E(S.fAd)+(S.fAdK?'<br>'+E(S.fAdK):'')+'<br>'+E(S.fEm)+'<br>'+E(t.fl[3][0])+' / '+E(t.fl[3][1])+': '+E(S.fTx)+'</div></div></div>';
}
function scale(){var b=document.getElementById('ivbox'),s=document.getElementById('ivsc');if(!b||!s)return;var pv=b.parentNode,iw=document.querySelector('.ivw'),k;if(pv)pv.classList.toggle('zoom',ZOOM);
  if(iw&&window.innerWidth>1100){var tp=iw.getBoundingClientRect().top+window.scrollY,H=Math.max(360,window.innerHeight-tp-16);iw.style.setProperty('--ivh',H+'px');var avail=iw.clientWidth-440-20,h=s.scrollHeight||1123;
    k=ZOOM?Math.min(1,(avail-4)/794):Math.min(1,(avail-4)/794,(H-8)/h);iw.style.setProperty('--pvw',Math.ceil(794*k+4)+'px')}
  else{if(iw)iw.style.removeProperty('--pvw');k=Math.min(1,(b.clientWidth-4)/794)}
  s.parentNode.style.width=(794*k)+'px';s.style.transform='scale('+k+')';s.style.width='794px';s.parentNode.style.height=(s.scrollHeight*k+6)+'px'}
var MINR=5,ZOOM=false;function paint(){var s=document.getElementById('ivsc');if(!s)return;MINR=5;s.innerHTML=page();var c=s.querySelector('.ivc');while(c&&c.scrollHeight>c.clientHeight+1&&MINR>Math.max(1,S.items.length)){MINR--;s.innerHTML=page();c=s.querySelector('.ivc')}scale()}

var ACC=null,AF=['bank','holder','acct','swift','bAd','hAd','hTel'];
function accOpts(){var o='<option value="">선택…</option>';if(DB&&DB.bank)o+='<option value="d">기본 계좌 · '+E(DB.holder||DB.bank)+'</option>';(ACC||[]).forEach(function(a,i){o+='<option value="'+i+'">'+E(a.name)+'</option>'});return o}
function sec(n,t,open,body){return '<details class="sec ivs"'+(open?' open':'')+'><summary><span class="no">'+n+'</span>'+t+'</summary><div class="ivb">'+body+'</div></details>'}
function inp(id,lab,val,type,ph){return '<label>'+lab+'</label><input type="'+(type||'text')+'" data-k="'+id+'" value="'+E(val)+'"'+(ph?' placeholder="'+E(ph)+'"':'')+'>'}
var UNITS=['건 / case','경기 / match','대회 / event','장 / photos','편 / video','시간 / hrs','일 / days','개월 / mo','명 / person','개 / pcs'];
function fmtNum(v){var t=String(v==null?'':v).replace(/[^\d.]/g,'');if(!t)return '';var p=t.split('.'),ip=p[0].replace(/^0+(?=\d)/,''),out=ip?Number(ip).toLocaleString('ko-KR'):'0';return p.length>1?out+'.'+p.slice(1).join(''):out}
function unitCtl(it,i){if(it.custom)return '<input type="text" data-i="'+i+'" data-f="unit" value="'+E(it.unit)+'" placeholder="직접 입력">';return '<select data-i="'+i+'" data-f="unit"><option value="">선택 안 함</option>'+UNITS.map(function(u){return '<option'+(it.unit===u?' selected':'')+'>'+u+'</option>'}).join('')+'<option value="__custom">직접 입력…</option></select>'}
function itemsForm(){return S.items.map(function(it,i){return '<div class="ivit"><div class="h"><span>항목 '+(i+1)+'</span><button class="ivx" data-del="'+i+'" type="button">삭제</button></div>'
 +'<input type="text" data-i="'+i+'" data-f="desc" value="'+E(it.desc)+'" placeholder="서비스/용역 내역">'
 +'<input type="text" class="ivsubin" data-i="'+i+'" data-f="sub" value="'+E(it.sub)+'" placeholder="상세 설명 (선택)">'
 +'<div class="g"><div><label>수량</label><input type="text" inputmode="decimal" autocomplete="off" data-num="1" data-i="'+i+'" data-f="qty" value="'+E(fmtNum(it.qty))+'"></div><div><label>단위</label>'+unitCtl(it,i)+'</div><div><label>단가</label><input type="text" inputmode="decimal" autocomplete="off" data-num="1" placeholder="예: 1,000,000" data-i="'+i+'" data-f="price" value="'+E(fmtNum(it.price))+'"></div></div></div>'}).join('')}

function loadScript(u){return new Promise(function(res,rej){var x=document.createElement('script');x.src=u;x.onload=res;x.onerror=function(){rej(new Error(u+' 로드 실패'))};document.head.appendChild(x)})}
function loadDocx(){var v='?v='+Date.now();return loadScript('vendor/docx.iife.js').then(function(){return loadScript('invoice_docx.js'+v)})}
function draw(keep){
  if(!keep){S=ld();S.doc=docType;S.no=nextNo();S.issue=today();S.due=addDays(qt()?30:14);S.ts='14';S.terms=termText('14');
  S.cCo='';S.cNm='';S.cAd='';S.cEm='';S.cTx='';S.status='draft';delete S.id;S.items=[{desc:'',sub:'',qty:1,unit:'',price:''}];}
  var m=document.getElementById('main');
  m.innerHTML='<style>'+CSS+'</style><div class="bar ivbar"><h2>'+(qt()?'견적서 작성':'인보이스 발급')+'</h2><span id="ivst" class="hint" style="margin:0 8px 0 auto"></span><button class="btn line" id="ivlist" type="button">저장 목록</button><button class="btn line" id="ivreset" type="button">새로 작성</button><button class="btn line" id="ivprint" type="button">PDF로 저장 / 인쇄</button><button class="btn" id="ivdocx" type="button">Word(docx) 저장</button></div>'
  +'<p class="hint ivbar">입력하면 오른쪽 미리보기에 바로 반영되고 자동 저장됩니다.</p>'
  +'<div class="ivw"><div class="ivform">'
  +sec(1,'문서 설정',true,'<label>발행 상태</label><select data-k="status"><option value="draft">작성 중</option><option value="issued">발행</option></select>'
    +'<div class="grid2"><div><label>통화</label><select data-k="cur">'+Object.keys(CUR).map(function(k){return '<option value="'+k+'">'+CUR[k][2]+'</option>'}).join('')+'</select></div><div><label>부가세</label><select data-k="vm"><option value="ex">별도 (+10%)</option><option value="in">포함 (역산)</option><option value="none">없음</option></select></div></div>'
    +'<label>표기 순서 (국·영문 병기)</label><select data-k="lang"><option value="ko">국문 위 · 영문 아래</option><option value="en">영문 위 · 국문 아래</option></select>')
  +sec(2,'번호 · 날짜',true,'<div class="grid2"><div>'+inp('no',qt()?'견적서 번호':'인보이스 번호',S.no)+'</div><div>'+inp('fNm','담당자 (Project Lead)',S.fNm)+'</div></div><div class="grid2"><div>'+inp('issue','발행일',S.issue,'date')+'</div><div>'+inp('due',qt()?'견적 유효기간':'결제 기한',S.due,'date')+'</div></div>'
    +'<label>결제 조건</label><select data-k="ts"><option value="7">Net 7 · 7일 이내</option><option value="14">Net 14 · 14일 이내</option><option value="30">Net 30 · 30일 이내</option><option value="60">Net 60 · 60일 이내</option><option value="0">Due on receipt · 수령 즉시</option><option value="custom">직접 입력</option></select><div id="ivterms" class="hide">'+inp('terms','결제 조건 직접 입력','','text','예: 50% 선금, 50% 납품 후')+'</div>')
  +sec(3,'고객 (공급받는 자)',true,'<div class="grid2"><div>'+inp('cCo','고객명 / 업체명',S.cCo)+'</div><div>'+inp('cNm','담당자 (선택)',S.cNm)+'</div></div>'+inp('cAd','주소',S.cAd)+'<div class="grid2"><div>'+inp('cEm','이메일 / 연락처',S.cEm)+'</div><div>'+inp('cTx','사업자등록번호 (선택)',S.cTx)+'</div></div>')
  +sec(4,'서비스 내역',true,'<div id="ivitems">'+itemsForm()+'</div><button class="btn line sm" id="ivadd" type="button" style="margin-top:10px;width:100%">+ 항목 추가</button>')
  +(sec(5,'입금 계좌',true,'<label>저장된 계좌</label><div class="ivrow" style="margin-top:0"><select id="ivacc" style="flex:1">'+accOpts()+'</select><button class="btn line sm" id="ivaccdel" type="button">삭제</button></div>'
    +'<details class="ivsub2"'+(S.bank?'':' open')+'><summary>계좌 정보 '+(S.bank?'<em>'+E(S.bank)+(S.holder?' · '+E(S.holder):'')+'</em>':'')+'</summary>'
    +'<div class="grid2"><div>'+inp('bank','은행명',S.bank)+'</div><div>'+inp('holder','예금주',S.holder)+'</div></div><div class="grid2"><div>'+inp('acct','계좌번호',S.acct)+'</div><div>'+inp('swift','SWIFT 코드',S.swift)+'</div></div>'
    +'<p class="ivgh">해외에서 입금받을 때</p>'+inp('bAd','은행 영문 주소',S.bAd)+inp('hAd','수취인 영문 주소',S.hAd)+inp('hTel','수취인 연락처',S.hTel,'text','82-10-1234-5678')
    +'<div class="ivrow"><input id="ivaccnm" placeholder="계좌 이름 (예: 김동윤 개인)"><button class="btn line sm" id="ivaccsave" type="button">계좌 목록에 저장</button></div></details>'))
  +sec(6,'비고',true,'<textarea data-k="'+(qt()?'qnotes':'notes')+'" style="min-height:72px">'+E(nt())+'</textarea>')
  +sec(7,'공급자 (BUFF)',false,inp('fCo','상호',S.fCo)+inp('fAd','주소 (영문)',S.fAd)+inp('fAdK','주소 (국문)',S.fAdK)+'<div class="grid2"><div>'+inp('fEm','이메일 / 연락처',S.fEm)+'</div><div>'+inp('fTx','사업자등록번호',S.fTx)+'</div></div>'+'<button class="btn sm" id="ivsave" type="button" style="margin-top:14px;width:100%">공급자·계좌·비고를 기본값으로 저장</button>')
  +'</div>'
  +'<div class="ivpv"><button class="ivzoom" id="ivzoom" type="button">'+(ZOOM?'페이지 전체 보기':'크게 보기')+'</button><div class="ivbox" id="ivbox"><div><div class="ivsc" id="ivsc"></div></div></div></div></div>';
  [].forEach.call(m.querySelectorAll('select[data-k]'),function(s){s.value=S[s.getAttribute('data-k')]});
  if(S.ts==='custom'){document.getElementById('ivterms').classList.remove('hide');m.querySelector('[data-k=terms]').value=S.terms}
  m.querySelector('.ivform').addEventListener('input',function(e){var t=e.target,k=t.getAttribute('data-k');
    if(k){S[k]=t.value;
      var f=m.querySelector('[data-k=due]'),sel=m.querySelector('[data-k=ts]'),tm=document.getElementById('ivterms');
      if(qt()){}else if(k==='ts'){if(t.value==='custom'){m.querySelector('[data-k=terms]').value=S.terms}else{S.terms=termText(t.value);S.due=t.value==='0'?S.issue:addTo(S.issue,+t.value);f.value=S.due}}
      else if(k==='issue'&&S.ts!=='custom'){S.due=S.ts==='0'?S.issue:addTo(S.issue,+S.ts);f.value=S.due}
      else if(k==='due'&&S.ts!=='custom'&&(S.ts==='0'?S.due!==S.issue:S.due!==addTo(S.issue,+S.ts))){S.ts='custom';S.terms=S.terms;sel.value='custom'}
      tm.classList.toggle('hide',S.ts!=='custom');
      if(k==='ts'||k==='due'||k==='issue'){if(S.ts==='custom'&&k!=='terms'&&!S.terms)S.terms=''}
      sv()}
    else if(t.getAttribute('data-f')){var it=S.items[+t.getAttribute('data-i')];if(t.getAttribute('data-f')==='unit'&&t.tagName==='SELECT'&&t.value==='__custom'){it.custom=true;it.unit='';redraw();return}
      if(t.getAttribute('data-num')){var left=t.value.slice(0,t.selectionStart).replace(/[^\d.]/g,'').length,raw=t.value.replace(/[^\d.]/g,'');t.value=fmtNum(raw);it[t.getAttribute('data-f')]=raw.replace(/^0+(?=\d)/,'');var pos=0,seen=0;while(pos<t.value.length&&seen<left){if(/[\d.]/.test(t.value.charAt(pos)))seen++;pos++}try{t.setSelectionRange(pos,pos)}catch(x){}}
      else it[t.getAttribute('data-f')]=t.value}
    paint();schedule()});
  m.querySelector('.ivform').addEventListener('change',function(e){if(/^(lang|cur|vm|ts)$/.test(e.target.getAttribute('data-k')||''))paint()});
  function redraw(){document.getElementById('ivitems').innerHTML=itemsForm();bind();paint();schedule()}
  function bind(){[].forEach.call(document.querySelectorAll('[data-del]'),function(b){b.onclick=function(){S.items.splice(+b.getAttribute('data-del'),1);if(!S.items.length)S.items.push({desc:'',sub:'',qty:1,unit:'',price:''});redraw()}})}
  document.getElementById('ivdocx').onclick=function(){var b=this;b.disabled=true;var o=b.textContent,draft=S,filename=fname();b.textContent='만드는 중…';bump();S.status='issued';saveDraft();(window.buffInvoiceDocx?Promise.resolve():loadDocx()).then(function(){if(S===draft)return window.buffInvoiceDocx(window.buffInv.get());throw new Error('작성 화면이 변경되었습니다. 문서를 다시 열어 저장해 주세요.')}).then(function(blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename+'.docx';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000)}).catch(function(e){alert('docx 생성 실패: '+e.message)}).then(function(){b.disabled=false;b.textContent=o})};
  document.getElementById('ivsave').onclick=function(){var b=this,o={};KEYS.forEach(function(k){o[k]=S[k]});b.disabled=true;window.buffRest('POST','invoice_settings','on_conflict=key',{key:'defaults',value:o,updated_at:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'}).then(function(){DB=o;window.buffToast('기본값을 저장했습니다.')}).catch(function(e){window.buffToast('저장 실패: '+e.message,true)}).then(function(){b.disabled=false})};
  if(document.getElementById('ivacc'))document.getElementById('ivacc').onchange=function(){var v=this.value;if(v==='')return;var src=v==='d'?DB:ACC[+v];AF.forEach(function(k){S[k]=src[k]||'';var el=document.querySelector('.ivform [data-k='+k+']');if(el)el.value=S[k]});if(v!=='d')document.getElementById('ivaccnm').value=src.name||'';paint();schedule()};
  if(document.getElementById('ivaccsave'))document.getElementById('ivaccsave').onclick=function(){var nm=document.getElementById('ivaccnm').value.trim();if(!nm){window.buffToast('계좌 이름을 입력하세요.',true);return}var a={name:nm};AF.forEach(function(k){a[k]=S[k]||''});var L=(ACC||[]).filter(function(x){return x.name!==nm});L.push(a);var b=this;b.disabled=true;window.buffRest('POST','invoice_settings','on_conflict=key',{key:'accounts',value:L,updated_at:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'}).then(function(){ACC=L;document.getElementById('ivacc').innerHTML=accOpts();window.buffToast('계좌 목록에 저장했습니다: '+nm)}).catch(function(e){window.buffToast('저장 실패: '+e.message,true)}).then(function(){b.disabled=false})};
  if(document.getElementById('ivaccdel'))document.getElementById('ivaccdel').onclick=function(){var sel=document.getElementById('ivacc'),v=sel.value;if(v===''||v==='d'){window.buffToast(v==='d'?'기본 계좌는 공급자 칸의 기본값 저장으로 바꿀 수 있어요.':'삭제할 계좌를 먼저 선택하세요.',true);return}var a=ACC[+v];if(!a||!confirm('저장된 계좌 "'+a.name+'"을(를) 목록에서 삭제할까요? 지금 작성 중인 문서의 입력값은 그대로 남습니다.'))return;var L=ACC.filter(function(x,i){return i!==+v}),b=this;b.disabled=true;window.buffRest('POST','invoice_settings','on_conflict=key',{key:'accounts',value:L,updated_at:new Date().toISOString()},{Prefer:'resolution=merge-duplicates,return=minimal'}).then(function(){ACC=L;sel.innerHTML=accOpts();window.buffToast('계좌를 삭제했습니다: '+a.name)}).catch(function(e){window.buffToast('삭제 실패: '+e.message,true)}).then(function(){b.disabled=false})};
  document.getElementById('ivzoom').onclick=function(){ZOOM=!ZOOM;this.textContent=ZOOM?'페이지 전체 보기':'크게 보기';scale()};
  document.getElementById('ivadd').onclick=function(){S.items.push({desc:'',sub:'',qty:1,unit:'',price:''});redraw()};
  document.getElementById('ivlist').onclick=function(){var request=view;saveDraft().then(function(){if(request===view)return showList()})};
  document.getElementById('ivreset').onclick=function(){if(confirm('입력한 내용을 지우고 새로 작성할까요?')){clearTimeout(tmr);tmr=null;window.drawInvoice().catch(function(e){window.buffToast(e.message,true)})}};
  document.getElementById('ivprint').onclick=function(){bump();S.status='issued';saveDraft();var old=document.title;document.title=fname();window.print();setTimeout(function(){document.title=old},500)};
  bind();paint();window.addEventListener('resize',scale);if(S.id)stamp('저장된 문서 · '+(S.status==='issued'?'발행':'작성 중'));
  return Promise.resolve();
}
window.closeInvoiceTab=function(){view++;return tmr!==null?saveDraft():queuedSave||saving||Promise.resolve()};
window.openInvoiceTab=function(type){docType=type;return showList()};
window.drawInvoice=function(keep){
  var request=++view;
  if(DB&&ACC)return draw(keep);
  return rest('GET','invoice_settings','select=key,value&key=in.(defaults,accounts)').then(function(rows){
    if(request!==view)return;
    rows=rows||[];
    var d=rows.filter(function(r){return r.key==='defaults'})[0],a=rows.filter(function(r){return r.key==='accounts'})[0];
    DB=(d&&d.value)||{};ACC=(a&&Array.isArray(a.value))?a.value:[];
    return draw(keep);
  });
};
})();
