/* dc-lite: 시안 템플릿({{ }}, sc-for, sc-if)을 일반 브라우저에서 실행하는 경량 런타임 */
(function(){
  class DCLogic{constructor(p){this.props=p||{};this.state={}}
    setState(s){Object.assign(this.state,s);this._render&&this._render()}}
  window.DCLogic=DCLogic;
  const HOLE=/\{\{\s*([\s\S]*?)\s*\}\}/g, WHOLE=/^\s*\{\{\s*([\s\S]*?)\s*\}\}\s*$/;
  function look(path,scope){
    if(path==='true')return true; if(path==='false')return false;
    let v=scope; for(const k of path.split('.')){ if(v==null)return undefined; v=v[k]; } return v;
  }
  function build(node,scope,out){
    if(node.nodeType===3){
      out.appendChild(document.createTextNode(node.data.replace(HOLE,(m,p)=>{const v=look(p,scope);return v==null?'':v})));
      return;
    }
    if(node.nodeType!==1)return;
    const tag=node.tagName.toLowerCase();
    if(tag==='sc-for'){
      const list=look(WHOLE.exec(node.getAttribute('list'))[1],scope)||[], as=node.getAttribute('as');
      list.forEach(item=>{const s=Object.create(scope);s[as]=item;kids(node,s,out)}); return;
    }
    if(tag==='sc-if'){
      const m=WHOLE.exec(node.getAttribute('value')); const v=m?look(m[1],scope):node.getAttribute('value');
      if(v&&v!=='false')kids(node,scope,out); return;
    }
    const el=document.createElementNS(node.namespaceURI,node.localName);
    for(const a of node.attributes){
      const n=a.name; if(n.startsWith('hint-'))continue;
      const w=WHOLE.exec(a.value);
      if(n.startsWith('on')){ if(w){const f=look(w[1],scope); if(typeof f==='function')el['on'+n.slice(2).toLowerCase()]=f;} continue; }
      let val=w?look(w[1],scope):a.value.replace(HOLE,(m,p)=>{const v=look(p,scope);return v==null?'':v});
      if(val===false||val==null)continue;
      el.setAttribute(n,val===true?'':val);
      if(n==='value'&&'value' in el)el.value=val;
    }
    kids(node,scope,el); out.appendChild(el);
  }
  function kids(node,scope,out){for(const c of node.childNodes)build(c,scope,out)}
  function morph(a,b){ // a: 기존 DOM, b: 새 DOM — a를 b에 맞춰 최소 변경
    const A=[...a.childNodes],B=[...b.childNodes];
    for(let i=0;i<B.length;i++){
      const x=A[i],y=B[i];
      if(!x){a.appendChild(y);continue}
      if(x.nodeType!==y.nodeType||x.nodeName!==y.nodeName){a.replaceChild(y,x);continue}
      if(y.nodeType===3){if(x.data!==y.data)x.data=y.data;continue}
      for(const at of [...x.attributes])if(!y.hasAttribute(at.name))x.removeAttribute(at.name);
      for(const at of y.attributes)if(x.getAttribute(at.name)!==at.value)x.setAttribute(at.name,at.value);
      if(x.tagName==='INPUT'||x.tagName==='TEXTAREA'){if(x.value!==y.value&&document.activeElement!==x)x.value=y.value}
      for(const k of ['onclick','oninput','onchange','onsubmit'])x[k]=y[k];
      morph(x,y);
    }
    while(a.childNodes.length>B.length)a.removeChild(a.lastChild);
  }
  window.dcMount=function(Cls){
    const root=document.getElementById('dc-root'),tpl=document.getElementById('dc-tpl').content;
    const inst=new Cls({});
    inst._render=function(){
      const scope=inst.renderVals(), out=document.createElement('div');
      kids(tpl,scope,out); morph(root,out);
    };
    inst._render();
  };
})();
