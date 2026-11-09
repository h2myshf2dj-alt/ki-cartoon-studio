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
Sprache.ZUT={};
Sprache.POOL={Mann:['M1','M4','M5','M3'],Frau:['F1','F2','F4','F5','F3'],Kind:['F3','F5','F4','F2'],Roboter:['M3','M5','M4']};
Sprache.rolle=function(f){return f.art=='Roboter'?'Roboter':(f.alter=='Kind'?'Kind':(f.geschl=='weiblich'?'Frau':'Mann'))};
/* Jede Figur eines Films bekommt eine eigene Stimme (Erzähler M2 bleibt frei) */
Sprache.FXZ={};
Sprache.verteilen=function(liste,wunsch){
  wunsch=wunsch||{};
  var benutzt={},z={},fx={},we=wunsch['Erzähler']||{};
  z.__erz=we.v||'M2';benutzt[z.__erz]=1;fx.__erz=we.fx||'normal';
  liste.forEach(function(f){var w=f&&wunsch[f.name];if(f)fx[f.name]=(w&&w.fx)||'normal';if(w&&w.v){z[f.name]=w.v;benutzt[w.v]=1}else if(f&&f.stimme){z[f.name]=f.stimme;benutzt[f.stimme]=1}});
  liste.forEach(function(f){
    if(!f||z[f.name])return;
    var pool=Sprache.POOL[Sprache.rolle(f)]||Sprache.POOL.Mann,v=null;
    pool.forEach(function(x){if(!v&&!benutzt[x])v=x});
    if(!v)['M1','F1','M4','F2','M5','F4','M3','F5','F3'].forEach(function(x){if(!v&&!benutzt[x])v=x});
    v=v||pool[0];z[f.name]=v;benutzt[v]=1;
  });
  Sprache.ZUT=z;Sprache.FXZ=fx;
};
Sprache.superStimme=function(f){
  if(f&&f.name&&Sprache.ZUT[f.name])return Sprache.ZUT[f.name];
  if(!f&&Sprache.ZUT.__erz)return Sprache.ZUT.__erz;
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
  var P=function(t){if(prog)prog(t)},k=true;
  try{if(localStorage.getItem('superSchnell')=='1')k=false}catch(e){}
  if(Super.ok&&k&&Super.backend!='wasm')Super.freigeben();
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
  var pk=Sprache.spitze(r.x);
  if(pk<0.0005)throw new Error('Die Stimme ist stumm ('+(Super.backend||'?')+')');
  Sprache.info=(Sprache.info?Sprache.info+', ':'')+'Probe ok';
  Sprache.geprueft=true;
};
Sprache.spitze=function(x){var m=0;for(var i=0;i<x.length;i++){var v=x[i];if(v!==v){x[i]=0;continue}if(v<0)v=-v;if(v>m)m=v}if(m>1)for(var j=0;j<x.length;j++)x[j]=Math.max(-1,Math.min(1,x[j]));return m};
Sprache.AUSSPRACHE={'wow':'Wau','koffein':'Koffe ihn','koffeins':'Koffe ihns','museum':'Muse um','museen':'Muse en','theater':'Teh ahter','kakao':'Kakau','pizza':'Pitsa','pizzen':'Pitsen','cool':'kuhl','coole':'kuhle','cooler':'kuhler','coolen':'kuhlen','okay':'okeh','ok':'okeh','handy':'Händi','handys':'Händis','baby':'Bebi','babys':'Bebis','hey':'hei','hi':'hai','yeah':'jäh','sorry':'sorri','party':'Parti','partys':'Partis','team':'Tiem','computer':'Kompjuter','laptop':'Läptop','email':'Imeil','e-mail':'Imeil','video':'Wideo','videos':'Wideos','app':'Äpp','apps':'Äpps','croissant':'Kroassong','restaurant':'Restorang','garage':'Garasche','orange':'Oronsche','chance':'Schangse','jeans':'Dschiens','job':'Dschopp','jogging':'Dschogging','chef':'Scheff','genie':'Schenie','ingenieur':'Inschenjöhr','toilette':'Toalette','zoo':'Tso','hobby':'Hobbi','smartphone':'Smahtfohn','cartoon':'Kartuhn','popcorn':'Popkorn','burger':'Börger','ketchup':'Ketschapp','familie':'Familje','familien':'Familjen','linie':'Linje','ferien':'Ferjen','ozean':'Oze ahn','ballon':'Ballong','koala':'Ko ahla','leopard':'Le opard','chamäleon':'Kamäle on','pinguin':'Pinggu ihn','pinguine':'Pinggu ihne','ups':'upps','yippie':'jippi','bye':'bai','ciao':'tschau','tablet':'Täblet','wlan':'Weh lahn','tv':'Teh fau','show':'Schoh','fan':'Fänn','fans':'Fänns','star':'Stahr','stars':'Stahrs','clown':'Klaun','clowns':'Klauns','comic':'Kommick','comics':'Kommicks','detektiv':'Detektief','roboter':'Robotter','region':'Regjohn','nation':'Natsjohn','station':'Statsjohn','lektion':'Lektsjohn','polizei':'Politsei','mission':'Missjohn','aktion':'Aktsjohn','situation':'Situatsjohn'};
Sprache.STAMM=[['koffein','koffe ihn '],['museum','muse um '],['theater','teh ahter'],['kakao','kakau'],['pizza','pitsa'],['pinguin','pinggu ihn '],['familie','familje'],['ozean','oze ahn '],['handy','händi'],['computer','kompjuter'],['restaurant','restorang'],['polizei','politsei'],['garage','garasche'],['clown','klaun'],['zoo','tso'],['party','parti'],['baby','bebi']];
/* Schwierige Wörter vor dem Sprechen gegen Lautschrift tauschen (nur für die Stimme, Text bleibt) */
Sprache.aussprache=function(t){
  return t.replace(/[\p{L}][\p{L}-]*/gu,function(w){
    var lw=w.toLowerCase(),r=Sprache.AUSSPRACHE[lw];
    if(!r)Sprache.STAMM.forEach(function(st){if(!r&&lw.indexOf(st[0])==0&&lw.length>st[0].length+2)r=st[1]+lw.slice(st[0].length)});
    if(!r)return w;
    return w[0]!==w[0].toLowerCase()?r[0].toUpperCase()+r.slice(1):r;
  });
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
  var t=Sprache.aussprache(Sprache.saeubern(text));
  if(!t)return Promise.reject(new Error('leer'));
  if(Sprache.modus=='super'){
    var vs=Sprache.superStimme(f),tp=Sprache.STEMPO[g]||1.05,fxn=Sprache.FXZ[f&&f.name?f.name:'__erz']||'normal',k2='S|'+t+'|'+vs+'|'+tp+'|'+fxn;
    if(Sprache.cache[k2])return Sprache.cache[k2];
    var p2=Super.sprich(t,vs,{tempo:tp}).then(function(r){return r
    }).then(function(r){
      var pk=Sprache.spitze(r.x);
      if(pk<0.0005)throw new Error('Die Stimme ist stumm ('+(Super.backend||'?')+')');
      if(pk<0.7&&pk>0.1){var g=0.85/pk;for(var i=0;i<r.x.length;i++)r.x[i]*=g}
      if(fxn=='normal')return r;
      return Stimme.effekt(r.x,r.rate,fxn).then(function(y){return {x:y,rate:r.rate}});
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
