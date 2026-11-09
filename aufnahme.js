// Aufnahme des Films als Video (Bild + Ton + Untertitel)
var Rec={mitUT:false,an:false,mr:null,teile:[],cv:null,cx:null,busy:false,timer:null,ut:'',wer:'',typ:'',datei:null,W:960,H:720};
Rec.format=function(){
  if(typeof MediaRecorder=='undefined')return null;
  var t=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp8,opus','video/webm'];
  for(var i=0;i<t.length;i++){try{if(MediaRecorder.isTypeSupported(t[i]))return t[i]}catch(e){}}
  return '';
};
Rec.grund=function(){
  if(typeof MediaRecorder=='undefined')return 'Dein iPhone kann hier keine Videos aufnehmen. Bitte iOS aktualisieren.';
  if(!document.createElement('canvas').captureStream)return 'Dein iPhone kann hier keine Videos aufnehmen (Bild). Bitte iOS aktualisieren.';
  if(!(window.AudioContext||window.webkitAudioContext))return 'Ton-Aufnahme wird nicht unterstützt.';
  return '';
};
Rec.start=function(){
  var c=document.createElement('canvas');c.width=Rec.W;c.height=Rec.H;
  Rec.cv=c;Rec.cx=c.getContext('2d');Rec.cx.fillStyle='#fff';Rec.cx.fillRect(0,0,Rec.W,Rec.H);
  Rec.ut='';Rec.wer='';Rec.teile=[];Rec.datei=null;
  var vs=c.captureStream(30),ad=Klang.aufnahme();
  if(!ad)throw new Error('Ton-Aufnahme wird nicht unterstützt.');
  var st=new MediaStream(vs.getVideoTracks().concat(ad.stream.getAudioTracks()));
  Rec.typ=Rec.format();
  var opt={videoBitsPerSecond:3000000,audioBitsPerSecond:128000};if(Rec.typ)opt.mimeType=Rec.typ;
  try{Rec.mr=new MediaRecorder(st,opt)}catch(e){Rec.mr=new MediaRecorder(st)}
  Rec.mr.ondataavailable=function(e){if(e.data&&e.data.size)Rec.teile.push(e.data)};
  Rec.mr.start(1000);
  Rec.an=true;Rec.busy=false;
  clearInterval(Rec.timer);Rec.timer=setInterval(Rec.bild,40);Rec.bild();
};
Rec.bild=function(){
  if(!Rec.an||Rec.busy||!B.svg)return;
  Rec.busy=true;
  var s=B.svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="'+Rec.W+'" height="'+Rec.H+'" ');
  var url=URL.createObjectURL(new Blob([s],{type:'image/svg+xml'})),img=new Image();
  img.onload=function(){
    try{
      var x=Rec.cx;x.drawImage(img,0,0,Rec.W,Rec.H);if(Rec.mitUT)Rec.untertitel(x);
    }catch(e){}
    URL.revokeObjectURL(url);Rec.busy=false;
  };
  img.onerror=function(){URL.revokeObjectURL(url);Rec.busy=false};
  img.src=url;
};
Rec.zeilen=function(x,text,max){
  var w=text.split(/\s+/),z=[],a='';
  w.forEach(function(t){var p=a?a+' '+t:t;if(x.measureText(p).width>max&&a){z.push(a);a=t}else a=p});
  if(a)z.push(a);
  if(z.length>3){z=z.slice(0,3);z[2]+=' …'}
  return z;
};
Rec.untertitel=function(x){
  if(!Rec.ut)return;
  var W=Rec.W,H=Rec.H,fs=34,lh=44,pad=18;
  x.font='bold '+fs+'px -apple-system, Helvetica, Arial, sans-serif';
  var text=(Rec.wer?Rec.wer+': ':'')+Rec.ut,z=Rec.zeilen(x,text,W-80-pad*2),h=z.length*lh+pad*2-8,y=H-h-20;
  x.fillStyle='rgba(0,0,0,0.62)';
  var r=18,bx=30,bw=W-60;
  x.beginPath();x.moveTo(bx+r,y);x.lineTo(bx+bw-r,y);x.quadraticCurveTo(bx+bw,y,bx+bw,y+r);x.lineTo(bx+bw,y+h-r);x.quadraticCurveTo(bx+bw,y+h,bx+bw-r,y+h);x.lineTo(bx+r,y+h);x.quadraticCurveTo(bx,y+h,bx,y+h-r);x.lineTo(bx,y+r);x.quadraticCurveTo(bx,y,bx+r,y);x.fill();
  x.textAlign='center';x.textBaseline='top';
  z.forEach(function(l,i){x.lineWidth=5;x.strokeStyle='#000';x.strokeText(l,W/2,y+pad+i*lh);x.fillStyle=Rec.wer?'#fff':'#ffe9a8';x.fillText(l,W/2,y+pad+i*lh)});
};
Rec.stop=function(){
  return new Promise(function(ok,no){
    clearInterval(Rec.timer);Rec.an=false;
    var mr=Rec.mr;if(!mr){no(new Error('keine Aufnahme'));return}
    mr.onstop=function(){
      Klang.aufnahmeEnde();
      var typ=(mr.mimeType||Rec.typ||'video/mp4').split(';')[0],end=/webm/.test(typ)?'webm':'mp4';
      var blob=new Blob(Rec.teile,{type:typ});Rec.teile=[];Rec.mr=null;
      if(!blob.size){no(new Error('Das Video ist leer.'));return}
      var name=('Cartoon-'+(GS[gi]&&GS[gi].titel||'Film')).replace(/[^A-Za-z0-9ÄÖÜäöüß\-]+/g,'-').slice(0,40)+'.'+end;
      try{Rec.datei=new File([blob],name,{type:typ})}catch(e){Rec.datei=blob;Rec.datei.name=name}
      ok(Rec.datei);
    };
    try{mr.stop()}catch(e){no(e)}
  });
};
Rec.abbrechen=function(){
  if(!Rec.mr&&!Rec.an)return;
  clearInterval(Rec.timer);Rec.an=false;
  var mr=Rec.mr;Rec.mr=null;Rec.teile=[];
  if(mr){mr.ondataavailable=null;mr.onstop=null;try{mr.stop()}catch(e){}}
  Klang.aufnahmeEnde();
};
Rec.teilen=function(){
  var f=Rec.datei;if(!f)return;
  if(navigator.canShare&&navigator.share&&navigator.canShare({files:[f]})){
    navigator.share({files:[f],title:f.name}).catch(function(e){if(e&&e.name!='AbortError')Rec.laden()});
  }else Rec.laden();
};
Rec.laden=function(){
  var f=Rec.datei;if(!f)return;
  var a=document.createElement('a');a.href=URL.createObjectURL(f);a.download=f.name||'Cartoon.mp4';document.body.appendChild(a);a.click();
  setTimeout(function(){a.remove()},1000);
};
