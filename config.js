/* Supabase 공개용 키(publishable)는 브라우저에 노출되어도 안전합니다. 접근 제어는 DB의 RLS 정책이 합니다. */
window.BUFF_CONFIG={
  url:'https://cexwmuhsjfxzemnwtwjc.supabase.co',
  key:'sb_publishable_V8fG5OEfxvqBBuCgDlmQ7w_LhdX_gyd'
};
/* 영문 페이지(<html lang="en">)에서는 *_en 칸에 값이 있으면 그 값을 원래 칸 대신 씁니다. 비어 있으면 한글을 그대로 보여줍니다. */
window.BUFF_EN=document.documentElement.lang==='en';
window.sbGet=function(table,query){
  var c=window.BUFF_CONFIG;
  return fetch(c.url+'/rest/v1/'+table+'?'+(query||''),{headers:{apikey:c.key}}).then(function(r){if(!r.ok)throw new Error(table+' '+r.status);return r.json()}).then(function(rows){
    (function fx(o){if(Array.isArray(o)){for(var i=0;i<o.length;i++){if(typeof o[i]==='string'){if(/^assets\//.test(o[i]))o[i]='/'+o[i]}else fx(o[i])}}else if(o&&typeof o==='object'){for(var k in o){var v=o[k];if(typeof v==='string'){if(/^assets\//.test(v))o[k]='/'+v}else fx(v)}}})(rows);
    if(window.BUFF_EN&&Array.isArray(rows))rows.forEach(function(r){Object.keys(r).forEach(function(k){if(/_en$/.test(k)&&k!=='role_en'){var v=r[k];if(v!=null&&v!==''&&!(Array.isArray(v)&&!v.length)){r['ko_'+k.slice(0,-3)]=r[k.slice(0,-3)];r[k.slice(0,-3)]=v}}})});
    if(window.BUFF_EN&&table==='site_settings'&&Array.isArray(rows)){
      /* 영문 페이지: 설정 문구는 *_en 키만 사용(없으면 페이지에 들어 있는 영문 기본 문구가 그대로 보임) */
      var keep={home_featured:1,contact_email:1,home_works_title:1},out=[];
      rows.forEach(function(r){if(keep[r.key])out.push(r);else if(/_en$/.test(r.key)&&r.value)out.push({key:r.key.slice(0,-3),value:r.value})});
      return out;
    }
    return rows;
  });
};
/* 팀 소개(탭)는 화면이 그려지기 전에 필요해서 미리 불러옵니다. 실패하면 기본 내용을 씁니다. */
window.__teamReady=Promise.race([
  window.sbGet('team_members','select=*&published=eq.true&order=sort_order.asc').then(function(rows){
    if(rows&&rows.length)window.__TEAM=rows.map(function(r){return{name:r.name,role:r.role||'',en:r.role_en||'',av:r.avatar_url,large:r.photo_url||r.avatar_url,lead:r.lead||'',body:r.body||'',edu:r.education||'',career:r.career||'',social:r.social||{}}});
  }).catch(function(){}),
  new Promise(function(r){setTimeout(r,2500)})
]);

/* 팀원 SNS 링크 → 아이콘 목록 */
window.buffLinks=function(p){
  var I={"instagram": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231D1D1F%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%223%22%20width%3D%2218%22%20height%3D%2218%22%20rx%3D%225%22%2F%3E%3Ccircle%20cx%3D%2212%22%20cy%3D%2212%22%20r%3D%224.2%22%2F%3E%3Ccircle%20cx%3D%2217.3%22%20cy%3D%226.7%22%20r%3D%221%22%20fill%3D%22%231D1D1F%22%20stroke%3D%22none%22%2F%3E%3C%2Fsvg%3E", "youtube": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20fill%3D%22%231D1D1F%22%20d%3D%22M22.5%207.2a2.8%202.8%200%200%200-2-2C18.8%204.8%2012%204.8%2012%204.8s-6.8%200-8.5.4a2.8%202.8%200%200%200-2%202C1.1%208.9%201.1%2012%201.1%2012s0%203.1.4%204.8a2.8%202.8%200%200%200%202%202c1.7.4%208.5.4%208.5.4s6.8%200%208.5-.4a2.8%202.8%200%200%200%202-2c.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8z%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M9.8%2015.1V8.9l5.3%203.1z%22%2F%3E%3C%2Fsvg%3E", "linkedin": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%2220%22%20height%3D%2220%22%20rx%3D%224%22%20fill%3D%22%231D1D1F%22%2F%3E%3Ccircle%20cx%3D%227.6%22%20cy%3D%227.7%22%20r%3D%221.5%22%20fill%3D%22%23fff%22%2F%3E%3Crect%20x%3D%226.3%22%20y%3D%2210.2%22%20width%3D%222.6%22%20height%3D%227.6%22%20fill%3D%22%23fff%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M10.8%2010.2h2.5v1.1c.4-.7%201.3-1.3%202.5-1.3%202.4%200%202.9%201.6%202.9%203.6v4.2h-2.6v-3.7c0-.9%200-2-1.2-2s-1.4.9-1.4%201.9v3.8h-2.7z%22%2F%3E%3C%2Fsvg%3E", "x": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%2220%22%20height%3D%2220%22%20rx%3D%224%22%20fill%3D%22%231D1D1F%22%2F%3E%3Cpath%20fill%3D%22%23fff%22%20d%3D%22M13.6%2011.2%2017.7%206.5h-1l-3.6%204.1-2.9-4.1H6.9l4.3%206.2-4.3%204.9h1l3.8-4.4%203.1%204.4h3.3zm-1.3%201.5-.4-.6-3.5-4.9h1.5l2.8%204%20.4.6%203.7%205.2h-1.5z%22%2F%3E%3C%2Fsvg%3E", "email": "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2228%22%20height%3D%2228%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231D1D1F%22%20stroke-width%3D%221.8%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%223%22%20y%3D%225%22%20width%3D%2218%22%20height%3D%2214%22%20rx%3D%223%22%2F%3E%3Cpath%20d%3D%22m4%208%208%206%208-6%22%2F%3E%3C%2Fsvg%3E"},L=[['instagram','Instagram'],['youtube','YouTube'],['linkedin','LinkedIn'],['x','X'],['email','Email']],s=(p&&p.social)||{},out=[];
  L.forEach(function(l){var v=(s[l[0]]||'').trim();if(!v)return;
    var href=l[0]==='email'?(/^mailto:/.test(v)?v:'mailto:'+v):(/^https?:/.test(v)?v:'https://'+v.replace(/^\/\//,''));
    out.push({href:href,label:l[1],icon:I[l[0]]})});
  return Object.assign({},p,{links:out,hasLinks:out.length?'true':''});
};
