/* Supabase 공개용 키(publishable)는 브라우저에 노출되어도 안전합니다. 접근 제어는 DB의 RLS 정책이 합니다. */
window.BUFF_CONFIG={
  url:'https://cexwmuhsjfxzemnwtwjc.supabase.co',
  key:'sb_publishable_V8fG5OEfxvqBBuCgDlmQ7w_LhdX_gyd'
};
window.sbGet=function(table,query){
  var c=window.BUFF_CONFIG;
  return fetch(c.url+'/rest/v1/'+table+'?'+(query||''),{headers:{apikey:c.key}}).then(function(r){if(!r.ok)throw new Error(table+' '+r.status);return r.json()});
};
/* 팀 소개(탭)는 화면이 그려지기 전에 필요해서 미리 불러옵니다. 실패하면 기본 내용을 씁니다. */
window.__teamReady=Promise.race([
  window.sbGet('team_members','select=*&published=eq.true&order=sort_order.asc').then(function(rows){
    if(rows&&rows.length)window.__TEAM=rows.map(function(r){return{name:r.name,role:r.role||'',en:r.role_en||'',av:r.avatar_url,large:r.photo_url||r.avatar_url,lead:r.lead||'',body:r.body||'',edu:r.education||'',career:r.career||''}});
  }).catch(function(){}),
  new Promise(function(r){setTimeout(r,2500)})
]);
