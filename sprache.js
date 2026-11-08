var Sprache={T:null,warte:Promise.resolve(),rohC:{},cache:{},an:true,fehler:'',VID:'de_DE-thorsten_emotional-medium',
PRE:{Mann:{st:0,tempo:1,bass:0,mid:0,hoch:0},Frau:{st:4.5,tempo:1,bass:-4,mid:1,hoch:3},Kind:{st:7,tempo:1.05,bass:-6,mid:2,hoch:4},'Erzähler':{st:-1,tempo:0.97,bass:3,mid:0,hoch:-1},Roboter:{st:-2,tempo:1,bass:-3,mid:6,hoch:2}},
MOD:{froh:[1,1.05,0],traurig:[-1,0.92,0],wuetend:[-0.5,1.06,2],erstaunt:[2,1,0],angst:[1.5,1.1,0],muede:[-1,0.85,0],verliebt:[0.5,0.95,0],nachdenklich:[0,0.93,0]}};
Sprache.laden=function(prog){
  if(Sprache.T)return Promise.resolve();
  var im=window.PiperTest?Promise.resolve(window.PiperTest):import('https://cdn.jsdelivr.net/npm/@mintplex-labs/piper-tts-web@1.0.4/+esm');
  return im.then(function(m){
    Sprache.T=m;
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
  if(m){q.st=(q.st||0)+m[0];q.tempo=(q.tempo||1)*m[1];q.mid=(q.mid||0)+m[2]}
  return q;
};
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
  var p=Sprache.mod(Sprache.preset(f),g),key=t+'|'+JSON.stringify(p);
  if(Sprache.cache[key])return Sprache.cache[key];
  var pr=Sprache.roh(t).then(function(r){
    return Stimme.verarbeiten(r.x,r.rate,p).then(function(z){return {url:URL.createObjectURL(Stimme.wav(z,r.rate)),env:Stimme.pegel(z,r.rate,24),dauer:z.length/r.rate}});
  });
  pr.catch(function(){delete Sprache.cache[key]});
  return Sprache.cache[key]=pr;
};
