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
      var ink='1D1D1F',black='0A0A0A',gray='6E6E73',white='FFFFFF',width=10106;
      function run(text,options){
        options=options||{};
        var family=options.bold?'Paperozi Bold':'Paperozi';
        return new D.TextRun({
          text:text,font:{ascii:family,hAnsi:family,eastAsia:family,cs:family},
          size:options.size||20,sizeComplexScript:options.size||20,color:options.color||ink
        });
      }
      function paragraph(text,options){
        options=options||{};
        return new D.Paragraph({
          heading:options.heading,keepNext:options.keepNext,
          children:[run(text,options)],spacing:{before:options.before||0,after:options.after||0,line:options.line||292}
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
        cell('작업확인서',2510,{fill:black,color:white,bold:true}),
        cell('PROJECT DETAILS',width-2510,{fill:black,color:white,bold:true,size:18})
      ]})].concat(model.rows.map(function(row){
        return new D.TableRow({children:[cell(row[0],2510,{fill:'F5F5F7',bold:true}),cell(row[1],width-2510)]});
      }));
      var table=new D.Table({
        width:{size:width,type:D.WidthType.DXA},columnWidths:[2510,width-2510],layout:D.TableLayoutType.FIXED,
        borders:{top:line,bottom:line,left:line,right:line,insideHorizontal:line,insideVertical:line},rows:rows
      });
      var children=[
        paragraph(model.title,{heading:D.HeadingLevel.TITLE,size:60,line:315,bold:true,after:60,keepNext:true}),
        paragraph(model.subtitle,{size:29,bold:true,after:80,keepNext:true}),
        paragraph(model.variant,{size:19,color:gray,after:190,keepNext:true}),
        paragraph(model.intro,{after:170,keepNext:true}),table
      ];
      model.clauses.forEach(function(clause){
        children.push(paragraph(clause[0],{heading:D.HeadingLevel.HEADING_2,bold:true,size:23,before:175,after:55,keepNext:true}));
        clause[1].split('\n\n').forEach(function(block){children.push(paragraph(block,{after:70}))});
      });
      model.signature.forEach(function(text,index){
        children.push(paragraph(text,{before:index===0?280:125,bold:index===0,keepNext:index<model.signature.length-1}));
      });
      var footerCell=new D.TableCell({
        width:{size:width,type:D.WidthType.DXA},shading:{type:D.ShadingType.CLEAR,fill:black,color:'auto'},
        margins:{left:180,right:180,top:125,bottom:125},
        children:[new D.Paragraph({children:[
          new D.ImageRun({type:'png',data:assets[2],transformation:{width:96,height:30},altText:{title:'BUFF',description:'BUFF 로고',name:'BUFF'}})
        ]})]
      });
      var footer=new D.Footer({children:[new D.Table({
        width:{size:width,type:D.WidthType.DXA},columnWidths:[width],rows:[new D.TableRow({children:[footerCell]})]
      })]});
      var doc=new D.Document({
        creator:'BUFF UNIVERSE',title:'BUFF '+model.subtitle,
        fonts:[{name:'Paperozi',data:assets[0],characterSet:D.CharacterSet.HANGUL},{name:'Paperozi Bold',data:assets[1],characterSet:D.CharacterSet.HANGUL}],
        styles:{default:{document:{run:{font:{ascii:'Paperozi',hAnsi:'Paperozi',eastAsia:'Paperozi',cs:'Paperozi'},color:ink,size:20}},title:{run:{color:black}}}},
        sections:[{properties:{page:{size:{width:11906,height:16838},margin:{left:900,right:900,top:840,bottom:1260,footer:450}}},footers:{default:footer},children:children}]
      });
      return D.Packer.toBlob(doc);
    });
  };
})();
