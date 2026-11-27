/* BUFF 인보이스 → docx (브라우저에서 생성, Paperozi 폰트 포함) */
(function(){
var D=window.docx;
var INK='1D1D1F',GRAY='6E6E73',BLACK='0A0A0A',PH='8E8E93';
function get(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u+' '+r.status);return r.arrayBuffer()}).then(function(b){return new Uint8Array(b)})}
window.buffInvoiceDocx=function(g){
  var S=g.S,T=g.T||g.TX[S.lang],tt=g.tt,money=g.money,KO=S.lang==='ko';
  return Promise.all([get('vendor/Paperozi.ttf'),get('vendor/PaperoziBold.ttf'),get('vendor/logo_white.png')]).then(function(a){
    var NONE={style:D.BorderStyle.NONE,size:0,color:'FFFFFF'},NB={top:NONE,bottom:NONE,left:NONE,right:NONE};
    var LN={style:D.BorderStyle.SINGLE,size:4,color:INK},GB={top:LN,bottom:LN,left:LN,right:LN};
    var W=10106,M=900;
    var r=function(t,o){o=o||{};return new D.TextRun({text:String(t==null?'':t),font:o.bold?'Paperozi Bold':'Paperozi',size:o.size||19,color:o.color||INK})};
    var p=function(runs,o){o=o||{};return new D.Paragraph({children:Array.isArray(runs)?runs:[runs],alignment:o.align,spacing:{before:o.before||0,after:o.after||0,line:o.line||290}})};
    var cell=function(ch,w,o){o=o||{};return new D.TableCell({children:Array.isArray(ch)?ch:[ch],width:{size:w,type:D.WidthType.DXA},borders:o.borders||NB,shading:o.fill?{type:D.ShadingType.CLEAR,fill:o.fill,color:'auto'}:undefined,margins:{top:o.mt==null?90:o.mt,bottom:o.mb==null?90:o.mb,left:o.ml==null?140:o.ml,right:o.mr==null?140:o.mr},verticalAlign:o.va||D.VerticalAlign.CENTER})};
    var tbl=function(cols,rows,o){o=o||{};return new D.Table({width:{size:cols.reduce(function(x,y){return x+y},0),type:D.WidthType.DXA},columnWidths:cols,layout:D.TableLayoutType.FIXED,alignment:o.alignment,indent:o.indent,rows:rows,borders:{top:NONE,bottom:NONE,left:NONE,right:NONE,insideHorizontal:NONE,insideVertical:NONE}})};
    var gap=function(n){return new D.Paragraph({children:[],spacing:{before:0,after:0,line:n,lineRule:'exact'}})};
    var sub=function(h){return h[1]?[r('  '+h[1],{size:14,color:PH})]:[]};
    var key=function(h){return p([r(h[0],{size:19,bold:true})].concat(sub(h)),{after:20})};
    // head
    var bill=[S.cCo,S.cNm?'담당자 / Attn: '+S.cNm:'',S.cAd,S.cEm,S.cTx].filter(Boolean);
    var left=[key(T.bill)].concat((bill.length?bill:['']).map(function(v){return p(r(v,{size:19,color:'4A4A4F'}))}));
    var dv=[S.no,g.fmtD(S.issue),g.fmtD(S.due),S.terms,S.fNm];
    var right=[];T.dl.forEach(function(h,i){right.push(p([r(h[0],{size:19,bold:true})].concat(sub(h)),{align:D.AlignmentType.RIGHT,after:20}));right.push(p(r(dv[i]||' ',{size:19}),{align:D.AlignmentType.RIGHT,after:150}))});
    var head=tbl([5400,W-5400],[new D.TableRow({children:[cell(left,5400,{va:D.VerticalAlign.TOP,ml:0,mt:0}),cell(right,W-5400,{va:D.VerticalAlign.TOP,mr:0,mt:0})]})]);
    // items
    var cols=[4150,1900,2050,W-4150-1900-2050];
    var al=[D.AlignmentType.LEFT,D.AlignmentType.CENTER,D.AlignmentType.RIGHT,D.AlignmentType.RIGHT];
    var th=T.th.slice(1).map(function(h,i){if(i===2&&g.vmNote())h=[h[0]+' ('+g.vmNote()+')',''];return cell(p([r(h[0],{size:18,bold:true,color:'FFFFFF'})].concat(h[1]?[r('  '+h[1],{size:13,color:'B0B0B8'})]:[]),{align:al[i]}),cols[i],{fill:BLACK,borders:{top:{style:D.BorderStyle.SINGLE,size:4,color:BLACK},bottom:{style:D.BorderStyle.SINGLE,size:4,color:BLACK},left:{style:D.BorderStyle.SINGLE,size:4,color:BLACK},right:{style:D.BorderStyle.SINGLE,size:4,color:BLACK}},mt:110,mb:110})});
    var rows=[new D.TableRow({tableHeader:true,children:th})];
    var n=Math.max(5,S.items.length);
    for(var i=0;i<n;i++){var it=S.items[i],has=it&&(it.desc||it.price||it.qty),amt=has?(+it.qty||0)*(+it.price||0):0;
      rows.push(new D.TableRow({cantSplit:true,height:{value:600,rule:D.HeightRule.ATLEAST},children:[
        cell([p(r(has?it.desc:'',{size:19,color:'3A3A3F'}))].concat(has&&it.sub?[p(r(it.sub,{size:14,color:PH}),{before:20})]:[]),cols[0],{borders:GB}),
        cell(p(r(has?(it.qty+(it.unit?' '+it.unit:'')):'',{size:19,color:'3A3A3F'}),{align:al[1]}),cols[1],{borders:GB}),
        cell(p(r(has?money(it.price):'',{size:19,color:'3A3A3F'}),{align:al[2]}),cols[2],{borders:GB}),
        cell(p(r(has?money(amt):'',{size:19,color:'3A3A3F'}),{align:al[3]}),cols[3],{borders:GB})]}))}
    var items=tbl(cols,rows);
    // totals
    var tw=[2500,2300];
    var trow=function(i,v,strong){var lab=T.tot[i][0]+(i===1?' '+g.vatLabel():'');var bd=strong?{top:{style:D.BorderStyle.SINGLE,size:4,color:BLACK},bottom:{style:D.BorderStyle.SINGLE,size:4,color:BLACK},left:{style:D.BorderStyle.SINGLE,size:4,color:BLACK},right:{style:D.BorderStyle.SINGLE,size:4,color:BLACK}}:GB;
      return new D.TableRow({children:[cell(p([r(lab,{size:strong?20:18,bold:strong,color:strong?'FFFFFF':'4A4A4F'})].concat(T.tot[i][1]?[r('  '+T.tot[i][1],{size:13,color:strong?'B0B0B8':'9A9AA0'})]:[])),tw[0],{fill:strong?BLACK:undefined,borders:bd,mt:100,mb:100}),
        cell(p(r(v,{size:strong?22:19,bold:strong,color:strong?'FFFFFF':INK}),{align:D.AlignmentType.RIGHT}),tw[1],{fill:strong?BLACK:undefined,borders:bd,mt:100,mb:100})]})};
    var totals=tbl(tw,[trow(0,money(tt.sub)),trow(1,money(tt.vat)),trow(2,money(tt.tot),true)],{alignment:D.AlignmentType.RIGHT});
    // notes
    var QT=S.doc==='qt',pay=[];var pls=[S.bank,S.holder,S.acct,S.swift,S.bAd,S.hAd,S.hTel];
    {pay.push(p([r(T.pay[0],{size:18,bold:true})].concat(sub(T.pay)),{after:30}));
    pls.forEach(function(v,i){if(v)pay.push(p(r(T.pl[i][0]+': '+v,{size:18,color:'4A4A4F'})))});}
    if(g.notes)String(g.notes).split('\n').forEach(function(l,i){pay.push(p(r(l,{size:18,color:'4A4A4F'}),{before:i?0:140}))});
    pay.push(p(r(QT?'견적서를 검토해 주셔서 감사합니다. Thank you for your consideration.':'감사합니다. Thank you for your business!',{size:18,bold:true}),{before:140}));
    // footer band
    var FB=11906;
    var fl=[new D.Paragraph({children:[new D.ImageRun({type:'png',data:a[2],transformation:{width:127,height:40},altText:{title:'BUFF',description:'BUFF logo',name:'logo'}})]})];
    var fr=[p(r(S.fCo,{size:19,bold:true,color:'FFFFFF'}),{align:D.AlignmentType.RIGHT}),p(r(S.fAd,{size:16,color:'E5E5EA'}),{align:D.AlignmentType.RIGHT}),].concat(S.fAdK?[p(r(S.fAdK,{size:16,color:'E5E5EA'}),{align:D.AlignmentType.RIGHT})]:[]).concat([p(r(S.fEm,{size:16,color:'E5E5EA'}),{align:D.AlignmentType.RIGHT}),p(r(T.fl[3][0]+' / '+T.fl[3][1]+': '+S.fTx,{size:16,color:'E5E5EA'}),{align:D.AlignmentType.RIGHT})]);
    var band=tbl([4200,FB-4200],[new D.TableRow({height:{value:2250,rule:D.HeightRule.EXACT},children:[cell(fl,4200,{fill:BLACK,ml:M+0,mt:0,mb:0}),cell(fr,FB-4200,{fill:BLACK,mr:M,mt:0,mb:0})]})],{indent:{size:-M,type:D.WidthType.DXA}});
    var foot=new D.Footer({children:[band]});
    var doc=new D.Document({
      fonts:[{name:'Paperozi',data:a[0],characterSet:D.CharacterSet.HANGUL},{name:'Paperozi Bold',data:a[1],characterSet:D.CharacterSet.HANGUL}],
      creator:'BUFF UNIVERSE',title:'BUFF UNIVERSE '+(S.doc==='qt'?'Quotation ':'Invoice ')+(S.no||''),
      styles:{default:{document:{run:{font:'Paperozi',size:19,color:INK}}}},
      sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:840,bottom:3000,left:M,right:M,header:0,footer:0}}},footers:{default:foot},
        children:[p([r(T.title[0],{size:68,bold:true})].concat(T.title[1]?[r('     ',{size:32}),new D.TextRun({text:T.title[1],font:'Paperozi',size:32,color:'1D1D1F',characterSpacing:70})]:[]),{line:300}),gap(360),head,gap(320),items,gap(280),totals,gap(300),].concat(pay)}]});
    return D.Packer.toBlob(doc);
  });
};
})();
