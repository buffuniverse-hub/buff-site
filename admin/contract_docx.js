(function(){
  'use strict';

  function asset(path){
    return fetch(path).then(function(response){
      if(!response.ok)throw new Error('문서 리소스를 불러오지 못했습니다.');
      return response.arrayBuffer();
    }).then(function(data){return new Uint8Array(data)});
  }

  window.buffContractDocx=function(model){
    var D=window.docx;
    return Promise.all([asset('vendor/Paperozi.ttf'),asset('vendor/PaperoziBold.ttf'),asset('vendor/logo_white.png')]).then(function(assets){
      var ink='1D1D1F',black='0A0A0A',gray='6E6E73',white='FFFFFF',width=10106,pageWidth=11906,margin=900;
      function run(text,options){
        options=options||{};
        var family=options.bold?'Paperozi Bold':'Paperozi';
        return new D.TextRun({
          text:text,font:{ascii:family,hAnsi:family,eastAsia:family,cs:family},
          size:options.size||19,sizeComplexScript:options.size||19,color:options.color||ink
        });
      }
      function paragraph(text,options){
        options=options||{};
        return new D.Paragraph({
          heading:options.heading,keepNext:options.keepNext,alignment:options.align,
          children:Array.isArray(text)?text:[run(text,options)],spacing:{before:options.before||0,after:options.after||0,line:options.line||270}
        });
      }
      function cell(text,cols,options){
        options=options||{};
        return new D.TableCell({
          width:{size:cols,type:D.WidthType.DXA},verticalAlign:D.VerticalAlign.CENTER,
          shading:options.fill?{type:D.ShadingType.CLEAR,fill:options.fill,color:'auto'}:undefined,
          margins:{left:140,right:140,top:73,bottom:73},
          children:text.split('\n').map(function(line){return paragraph(line,Object.assign({line:255},options))})
        });
      }
      var line={style:D.BorderStyle.SINGLE,size:4,color:'8E8E93'};
      var rows=[new D.TableRow({tableHeader:true,children:[
        cell('항목  ITEM',2510,{fill:black,color:white,bold:true,size:18}),
        cell('작업확인서  PROJECT DETAILS',width-2510,{fill:black,color:white,bold:true,size:18})
      ]})].concat(model.rows.map(function(row){
        return new D.TableRow({children:[cell(row[0],2510,{bold:true}),cell(row[1],width-2510)]});
      }));
      var table=new D.Table({
        width:{size:width,type:D.WidthType.DXA},columnWidths:[2510,width-2510],layout:D.TableLayoutType.FIXED,
        borders:{top:line,bottom:line,left:line,right:line,insideHorizontal:line,insideVertical:line},rows:rows
      });
      var none={style:D.BorderStyle.NONE,size:0,color:white};
      var invisible={top:none,bottom:none,left:none,right:none,insideHorizontal:none,insideVertical:none};
      var right=D.AlignmentType.RIGHT,partnerWidth=5400;
      function key(ko,en,align){
        return paragraph([run(ko,{size:19,bold:true}),run('  '+en,{size:14,color:gray})],{align:align,line:260,keepNext:true});
      }
      function metaCell(children,columns){
        return new D.TableCell({
          width:{size:columns,type:D.WidthType.DXA},verticalAlign:D.VerticalAlign.TOP,borders:invisible,
          margins:{left:0,right:0,top:0,bottom:0},children:children
        });
      }
      var partner=[key('수행자','SERVICE PROVIDER')].concat(model.partnerDetails.map(function(text){return paragraph(text,{size:19,line:268})}));
      var details=[];
      model.details.forEach(function(entry){
        details.push(key(entry[0],entry[1],right),paragraph(entry[2],{size:19,align:right,after:80,line:260}));
      });
      var header=new D.Table({
        width:{size:width,type:D.WidthType.DXA},columnWidths:[partnerWidth,width-partnerWidth],layout:D.TableLayoutType.FIXED,borders:invisible,
        rows:[new D.TableRow({children:[metaCell(partner,partnerWidth),metaCell(details,width-partnerWidth)]})]
      });
      var children=[
        paragraph([run(model.title,{size:56,bold:true}),run('   '+model.subtitle,{size:27})],
          {heading:D.HeadingLevel.TITLE,line:300,after:340,keepNext:true}),
        header,paragraph(model.intro,{before:160,after:140,keepNext:true}),table
      ];
      model.clauses.forEach(function(clause){
        children.push(paragraph(clause[0],{heading:D.HeadingLevel.HEADING_2,bold:true,size:21,before:160,after:55,keepNext:true}));
        clause[1].split('\n\n').forEach(function(block){children.push(paragraph(block,{after:70}))});
      });
      model.signature.forEach(function(text,index){
        children.push(paragraph(text,{before:index===0?180:85,bold:index===0,keepNext:index<model.signature.length-1}));
      });
      var logo=new D.Paragraph({children:[
        new D.ImageRun({type:'png',data:assets[2],transformation:{width:96,height:30},altText:{title:'BUFF',description:'BUFF 로고',name:'BUFF'}})
      ]});
      var issuer=model.issuer.map(function(text,index){
        return paragraph((index===0?'위탁자 · ':'')+text,{size:index===0?18:15,bold:index===0,color:index===0?white:'E5E5EA',align:right,line:225});
      });
      function footerCell(children,columns,left,rightInset){
        return new D.TableCell({
          width:{size:columns,type:D.WidthType.DXA},verticalAlign:D.VerticalAlign.CENTER,borders:invisible,
          shading:{type:D.ShadingType.CLEAR,fill:black,color:'auto'},
          margins:{left:left,right:rightInset,top:170,bottom:170},children:children
        });
      }
      var footer=new D.Footer({children:[new D.Table({
        width:{size:pageWidth,type:D.WidthType.DXA},columnWidths:[4200,pageWidth-4200],layout:D.TableLayoutType.FIXED,
        indent:{size:-margin,type:D.WidthType.DXA},borders:invisible,
        rows:[new D.TableRow({children:[footerCell([logo],4200,margin,150),footerCell(issuer,pageWidth-4200,150,margin)]})]
      })]});
      var doc=new D.Document({
        creator:'BUFF UNIVERSE',title:'BUFF '+model.subtitle,
        fonts:[{name:'Paperozi',data:assets[0],characterSet:D.CharacterSet.HANGUL},{name:'Paperozi Bold',data:assets[1],characterSet:D.CharacterSet.HANGUL}],
        styles:{default:{document:{run:{font:{ascii:'Paperozi',hAnsi:'Paperozi',eastAsia:'Paperozi',cs:'Paperozi'},color:ink,size:19}},title:{run:{color:black}}}},
        sections:[{properties:{page:{size:{width:pageWidth,height:16838},margin:{left:margin,right:margin,top:840,bottom:1450,footer:0}}},footers:{default:footer},children:children}]
      });
      return D.Packer.toBlob(doc);
    });
  };
})();
