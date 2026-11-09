var Sprache={T:null,warte:Promise.resolve(),rohC:{},cache:{},an:true,fehler:'',modus:'super',geladen:'',VID:'de_DE-thorsten-high',
VIDS:{hoch:'de_DE-thorsten-high',normal:'de_DE-thorsten_emotional-medium'},
PRE:{Mann:{st:0,tempo:1,bass:0,mid:0,hoch:0},Frau:{st:3.5,tempo:1,bass:-2,mid:1,hoch:2},Kind:{st:5.5,tempo:1,bass:-3,mid:1,hoch:2},'Erzähler':{st:0,tempo:1,bass:2,mid:0,hoch:0},Roboter:{st:-2,tempo:1,bass:-3,mid:6,hoch:2}},
MOD:{froh:[0.5,1,0],traurig:[-0.5,1,0],wuetend:[0,1,2],erstaunt:[1,1,0],angst:[1,1,0],muede:[-0.5,1,0],verliebt:[0,1,0],nachdenklich:[0,1,0]}};
Sprache.setModus=function(m){
  Sprache.modus=m;Sprache.an=(m!='iphone');
  if(Sprache.VIDS[m]&&Sprache.VIDS[m]!=Sprache.VID){Sprache.VID=Sprache.VIDS[m];Sprache.rohC={};Sprache.cache={}}
};
Sprache.SUPER={Mann:'M1','Erzähler':'M2',Frau:'F1',Kind:'F3',Roboter:'M3'};
Sprache.STEMPO={froh:1.1,traurig:0.92,wuetend:1.12,erstaunt:1.08,angst:1.15,muede:0.88,verliebt:0.98,nachdenklich:0.95};
Sprache.superStimme=function(f){
  var n=!f?'Erzähler':(f.art=='Roboter'?'Roboter':(f.alter=='Kind'?'Kind':(f.geschl=='weiblich'?'Frau':'Mann'))),u={};
  try{u=JSON.parse(localStorage.getItem('superstimmen')||'{}')}catch(e){}
  return u[n]||Sprache.SUPER[n];
};
Sprache.laden=function(prog){
  if(Sprache.modus=='super')return Sprache.superLaden(prog);
  if(Sprache.T&&Sprache.geladen==Sprache.VID)return Promise.resolve();
  var im=window.PiperTest?Promise.resolve(window.PiperTest):import('https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.4/+esm');
  return im.then(function(m){
    Sprache.T=m;Sprache.geladen=Sprache.VID;
    if(m.download)return m.download(Sprache.VID,function(x){if(prog&&x&&x.total)prog(Math.round(x.loaded*100/x.total))});
  });
};
Sprache.preset=function(f){
  var n=!f?'Erzähler':(f.art=='Roboter'?'Roboter':(f.alter=='Kind'?'Kind':(f.geschl=='weiblich'?'Frau':'Mann')));
  var p=Object.assign({},Sprache.PRE[n]),u={};
  try{u=JSON.parse(localStorage.getItem('stimmen')||'{}')}catch(e){}
  if(u[n])p=Object.assign(p,u[n]);
  else if(f){
    if(n=='Kind'&&f.geschl=='weiblich')p.st+=1;
    if(f.art=='Katze'||f.art=='Hase')p.st+=1.5;
  }
  return p;
};
Sprache.mod=function(p,g){
  var m=Sprache.MOD[g],q=Object.assign({},p);
  if(m){if(q.st)q.st+=m[0];q.tempo=(q.tempo||1)*m[1];q.mid=(q.mid||0)+m[2]}
  return q;
};
Sprache.info='';Sprache.geprueft=false;
Sprache.superLaden=async function(prog){
  var P=function(t){if(prog)prog(t)},k=false;
  try{k=localStorage.getItem('superKompat')=='1'}catch(e){}
  await Super.laden(prog,k);
  if(Sprache.geprueft)return;
  P('Stimme wird geprüft …');
  var r=await Super.sprich('Hallo.','M1',{});
  if(Sprache.spitze(r.x)<0.003&&Super.backend!='wasm'){
    Sprache.info='sicherer Modus';
    try{localStorage.setItem('superKompat','1')}catch(e){}
    P('Sicherer Modus wird gestartet …');
    Super.freigeben();
    await Super.laden(prog,true);
    P('Stimme wird geprüft …');
    r=await Super.sprich('Hallo.','M1',{});
  }
  if(Sprache.spitze(r.x)<0.0005)throw new Error('Die Stimme ist stumm ('+(Super.backend||'?')+')');
  Sprache.geprueft=true;
};
Sprache.spitze=function(x){var m=0;for(var i=0;i<x.length;i++){var v=x[i];if(v!==v){x[i]=0;continue}if(v<0)v=-v;if(v>m)m=v}if(m>1)for(var j=0;j<x.length;j++)x[j]=Math.max(-1,Math.min(1,x[j]));return m};
Sprache.saeubern=function(t){return t.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}️]/gu,'').replace(/\s+/g,' ').trim()};
Sprache.roh=function(text){
  if(Sprache.rohC[text])return Sprache.rohC[text];
  var pr=Sprache.warte.then(function(){return Sprache.T.predict({text:text,voiceId:Sprache.VID})}).then(Stimme.dekodiere);
  Sprache.warte=pr.catch(function(){});
  pr.catch(function(){delete Sprache.rohC[text]});
  return Sprache.rohC[text]=pr;
};
Sprache.zeile=function(text,f,g){
  var t=Sprache.saeubern(text);
  if(!t)return Promise.reject(new Error('leer'));
  if(Sprache.modus=='super'){
    var vs=Sprache.superStimme(f),tp=Sprache.STEMPO[g]||1.05,k2='S|'+t+'|'+vs+'|'+tp;
    if(Sprache.cache[k2])return Sprache.cache[k2];
    var p2=Super.sprich(t,vs,{tempo:tp}).then(function(r){return r
    }).then(function(r){
      var pk=Sprache.spitze(r.x);
      if(pk<0.0005)throw new Error('Die Stimme ist stumm ('+(Super.backend||'?')+')');
      if(pk<0.7){var g=0.85/pk;for(var i=0;i<r.x.length;i++)r.x[i]*=g}
      return r;
    }).then(function(r){return {url:URL.createObjectURL(Stimme.wav(r.x,r.rate)),env:Stimme.pegel(r.x,r.rate,24),dauer:r.x.length/r.rate,x:r.x,rate:r.rate}});
    p2.catch(function(){delete Sprache.cache[k2]});
    return Sprache.cache[k2]=p2;
  }
  var p=Sprache.mod(Sprache.preset(f),g),key=t+'|'+JSON.stringify(p);
  if(Sprache.cache[key])return Sprache.cache[key];
  var pr=Sprache.roh(t).then(function(r){
    return Stimme.verarbeiten(r.x,r.rate,p).then(function(z){return {url:URL.createObjectURL(Stimme.wav(z,r.rate)),env:Stimme.pegel(z,r.rate,24),dauer:z.length/r.rate,x:z,rate:r.rate}});
  });
  pr.catch(function(){delete Sprache.cache[key]});
  return Sprache.cache[key]=pr;
};
