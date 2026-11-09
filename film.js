var FI=0,tok=0,WAQ=null,fTimer=null,AUD=new Audio(),stimmen=[],laeuft=false;
function kText(w){
  if(w=='m')return Klang.musik?'🎵 Musik: an':'🎵 Musik: aus';
  if(w=='f')return Klang.fx?'🔊 Geräusche: an':'🔊 Geräusche: aus';
  if(w=='u')return UTAN?'💬 Text: an':'💬 Text: aus';
  return {super:'🗣 Stimme: Supertonic (neu)',hoch:'🗣 Stimme: Thorsten hoch',normal:'🗣 Stimme: Thorsten normal (schneller)',iphone:'🗣 Stimme: iPhone (nicht für MP4)'}[Sprache.modus];
}
var UTAN=false;
function kSpeichern(){try{localStorage.setItem('klang',JSON.stringify({m:Klang.musik,f:Klang.fx,s:Sprache.an,q:Sprache.modus,u:UTAN,v:2}))}catch(e){}}
function kUT(){UTAN=!UTAN;kSpeichern();document.getElementById('bu').innerHTML=kText('u');var u=document.getElementById('untertitel');if(u&&laeuft)u.style.display=UTAN?'':'none'}
try{var kk=JSON.parse(localStorage.getItem('klang')||'{}');if(kk.m===false)Klang.musik=false;if(kk.f===false)Klang.fx=false;if(kk.v==2&&kk.q)Sprache.setModus(kk.q);if(kk.u===true)UTAN=true}catch(e){}
function kMusik(){Klang.musik=!Klang.musik;kSpeichern();document.getElementById('bm').innerHTML=kText('m');if(!Klang.musik)Klang.stop();else if(laeuft)Klang.start(GS[gi].kat)}
function kFx(){Klang.fx=!Klang.fx;kSpeichern();document.getElementById('bf').innerHTML=kText('f')}
function kStimme(){Sprache.setModus({super:'hoch',hoch:'normal',normal:'iphone',iphone:'super'}[Sprache.modus]);kSpeichern();document.getElementById('bs').innerHTML=kText('s')}
function filmOeffne(){FI=gi;zeige('film')}
function filmEnde(){filmStop();clearInterval(fTimer);fTimer=null}
SCREENS.film=function(){
  var g=GS[gi];
  setTimeout(function(){buehneNeu();buehneZeichnen();schleife()},0);
  return '<button class="zurueck" onclick="filmEnde();zeige(\'gedit\')">← Zurück</button><h2>🎬 '+esc(g.titel)+'</h2><div id="buehne" class="buehne"></div><div id="untertitel" class="untertitel">Tippe auf „Abspielen“.</div><div id="fstatus" class="fstatus"></div><button class="gross" onclick="filmStart()">▶ Abspielen</button><button class="gross" style="background:#06a77d" onclick="filmStart(true)">🎥 Als Video speichern</button><div id="fvideo"></div><div style="display:flex;gap:10px"><button id="bm" class="klein" style="flex:1" onclick="kMusik()">'+kText('m')+'</button><button id="bf" class="klein" style="flex:1" onclick="kFx()">'+kText('f')+'</button></div><button id="bs" class="klein" style="width:100%" onclick="kStimme()">'+kText('s')+'</button><button id="bu" class="klein" style="width:100%" onclick="kUT()">'+kText('u')+'</button><button class="gross" style="background:#999" onclick="filmStop()">■ Stopp</button><p class="sub" style="margin-top:14px;font-size:13px">Version '+(window.APPV||'?')+'</p><div style="height:30px"></div>';
};
function schleife(){
  clearInterval(fTimer);
  fTimer=setInterval(function(){
    if(!document.getElementById('buehne')){clearInterval(fTimer);fTimer=null;return}
    if(B.fb)B.lvl=B.spr>=0?(Math.floor(jetzt()*9)%4):0;
    else if(B.env&&B.envT0&&B.spr>=0)B.lvl=B.env[Math.floor((jetzt()-B.envT0)*24)]||0;
    else if(B.env&&!AUD.paused&&B.spr>=0)B.lvl=B.env[Math.floor(AUD.currentTime*24)]||0;
    else if(!B.fb)B.lvl=0;
    buehneZeichnen();
  },62);
}
function ladeStimmen(){try{stimmen=speechSynthesis.getVoices().filter(function(v){return /^de/i.test(v.lang)})}catch(e){}}
try{ladeStimmen();speechSynthesis.onvoiceschanged=ladeStimmen}catch(e){}
function wahl(f){
  if(!stimmen.length)return null;
  var re=f&&f.geschl=='männlich'?/markus|martin|yannick|viktor|jonas|stefan/i:/anna|petra|helena|marlene|sandy|shelley|ela/i,v=null,gut=/premium|enhanced|erweitert|verbessert/i;
  var gs=stimmen.slice().sort(function(a,b){return (gut.test(b.name+' '+(b.voiceURI||'')))-(gut.test(a.name+' '+(a.voiceURI||'')))});
  gs.forEach(function(x){if(!v&&re.test(x.name))v=x});
  return v||gs[0];
}
function sprichFB(text,f,my){
  return new Promise(function(ok){
    var done=false,t,w=text.trim().split(/\s+/).length,est=(w/2.4+0.8)*1000;
    function ende(){if(done)return;done=true;clearTimeout(t);B.fb=false;ok()}
    B.fb=true;
    if(typeof speechSynthesis=='undefined'||typeof SpeechSynthesisUtterance=='undefined'){t=setTimeout(ende,est);return}
    try{
      var u=new SpeechSynthesisUtterance(Sprache.saeubern(text)||text);u.lang='de-DE';
      var v=wahl(f);if(v)u.voice=v;
      if(f){u.pitch=Math.min(2,(f.geschl=='weiblich'?1.3:0.8)*(f.alter=='Kind'?1.25:1));u.rate=0.95}else{u.pitch=1;u.rate=0.92}
      u.onend=ende;u.onerror=ende;speechSynthesis.speak(u);t=setTimeout(ende,est+5000);
    }catch(e){t=setTimeout(ende,est)}
  });
}
function spielenWA(z){
  return new Promise(function(ok){
    var c=Klang.ctx,t=setTimeout(fertig,(z.dauer+3)*1000),q;
    function fertig(){clearTimeout(t);B.envT0=0;WAQ=null;ok()}
    try{
      var b=c.createBuffer(1,z.x.length,z.rate);b.getChannelData(0).set(z.x);
      q=c.createBufferSource();q.buffer=b;q.connect(Klang.out);q.onended=fertig;
      B.env=z.env;B.envT0=jetzt();WAQ=q;q.start();
      if(c.state!='running'&&c.resume)c.resume();
    }catch(e){Sprache.fehler='Abspielen: '+String(e&&e.message||e);REC_FEHL++;fertig()}
  });
}
var REC_FEHL=0;
function spielen(z){
  if(z.x&&Klang.init())return spielenWA(z);
  return new Promise(function(ok){
    var t=setTimeout(ok,(z.dauer+3)*1000);
    function fertig(){clearTimeout(t);ok()}
    AUD.onended=fertig;AUD.onerror=fertig;AUD.src=z.url;B.env=z.env;
    var pr=AUD.play();if(pr&&pr.catch)pr.catch(fertig);
  });
}
function freischalten(){try{AUD.pause();AUD.src=URL.createObjectURL(Stimme.wav(new Float32Array(2205),22050));AUD.play().catch(function(){})}catch(e){}}
function fStatus(s){var e=document.getElementById('fstatus');if(e)e.innerHTML=s}
function filmStop(){
  tok++;laeuft=false;B.spr=-1;B.lvl=0;B.fb=false;B.env=null;B.envT0=0;B.item=null;
  if(WAQ){try{WAQ.onended=null;WAQ.stop()}catch(e){}WAQ=null}
  Rec.abbrechen();
  try{AUD.onended=null;AUD.pause()}catch(e){}
  try{speechSynthesis.cancel()}catch(e){}
  Klang.stop();
  var u=document.getElementById('untertitel');if(u){u.style.display='';u.innerHTML='Gestoppt.'}
  fStatus('');
}
function warten(ms){return new Promise(function(ok){setTimeout(ok,ms)})}
async function filmStart(rec){
  filmStop();
  var my=tok,g=GS[gi],items=[],fv=document.getElementById('fvideo');
  if(fv)fv.innerHTML='';
  if(rec){
    var gr=Rec.grund();if(gr){alert(gr);return}
    if(Sprache.modus=='iphone'){Sprache.setModus('super');kSpeichern();var bs=document.getElementById('bs');if(bs)bs.innerHTML=kText('s')}
  }
  g.szenen.forEach(function(s,i){
    if(s.narr.trim())items.push({t:s.narr.trim(),wer:'',s:i,g:'neutral'});
    s.zeilen.forEach(function(z){if(z.text.trim())items.push({t:z.text.trim(),wer:z.wer,s:i,g:(z.g&&GEFUEHL_L[z.g])?z.g:gefuehl(z.text)})});
  });
  var ut=document.getElementById('untertitel');
  if(!items.length){ut.innerHTML='Die Geschichte hat noch keinen Text.';return}
  freischalten();Klang.init();
  Sprache.verteilen(g.figuren.map(function(n){return figInfo(n)}),g.stimmen);
  ut.style.display='';
  buehneNeu();schleife();
  var voice=Sprache.an,pro=[];
  if(voice){
    try{
      ut.innerHTML='🗣 Stimme wird geladen …';fStatus('Beim ersten Mal kann das etwas dauern (WLAN empfohlen).');var tl=Date.now();
      await Sprache.laden(function(p){ut.innerHTML='🗣 '+(typeof p=='string'?p:'Stimme wird geladen: '+p+' %');fStatus('⏱ '+Math.round((Date.now()-tl)/1000)+' s'+(Sprache.info?' · '+Sprache.info:''))});
      if(my!=tok)return;
      items.forEach(function(it,k){var f=it.wer?figInfo(it.wer):null;pro[k]=Sprache.zeile(it.t,f,it.g);pro[k].catch(function(){})});
    }catch(e){
      voice=false;Sprache.fehler=String(e&&e.message||e);
      if(rec){ut.innerHTML='⚠️ Die Stimme konnte nicht geladen werden. Bitte WLAN prüfen und nochmal versuchen.';fStatus('');return}
      ut.innerHTML='⚠️ Die Stimme ist nicht verfügbar, nehme iPhone-Stimme.';await warten(1500);
    }
  }
  if(my!=tok)return;
  if(voice){
    var t0=Date.now(),tz=Date.now(),jj=0,uhr=setInterval(function(){
      if(my!=tok){clearInterval(uhr);return}
      fStatus('⏱ '+Math.round((Date.now()-t0)/1000)+' s · Satz '+(jj+1)+' seit '+Math.round((Date.now()-tz)/1000)+' s · Technik: '+(Sprache.modus=='super'?(Super.backend||'?'):Sprache.modus)+(Sprache.info?' · '+Sprache.info:''));
    },1000);
    for(var j=0;j<items.length;j++){
      jj=j;tz=Date.now();
      ut.innerHTML='🗣 Stimmen werden vorbereitet: '+(j+1)+' von '+items.length;
      try{await Promise.race([pro[j],warten(180000).then(function(){throw new Error('Satz dauert zu lange (über 3 Minuten)')})])}
      catch(e){Sprache.fehler=String(e&&e.message||e);pro[j]=Promise.reject(e);pro[j].catch(function(){})}
      if(my!=tok){clearInterval(uhr);return}
    }
    clearInterval(uhr);fStatus('');
  }
  if(rec){
    REC_FEHL=0;
    try{Klang.init();Rec.start()}catch(e){ut.innerHTML='⚠️ Aufnahme geht nicht: '+esc(String(e&&e.message||e));return}
    buehneNeu();ut.innerHTML='🔴 Aufnahme läuft …';fStatus('🔴 Aufnahme – Bildschirm bitte anlassen');
    await warten(700);if(my!=tok)return;
  }
  Klang.start(g.kat);laeuft=true;B.ein=true;
  if(!UTAN)ut.style.display='none';
  for(var k=0;k<items.length;k++){
    var it=items[k],f=it.wer?figInfo(it.wer):null,z=null;
    if(voice){
      try{z=await pro[k]}catch(e){z=null;Sprache.fehler=String(e&&e.message||e)}
      if(my!=tok)return;
      if(rec&&!z){
        try{delete Sprache.cache;Sprache.cache={};z=await Sprache.zeile(it.t,f,it.g)}catch(e){z=null;Sprache.fehler=String(e&&e.message||e)}
        if(my!=tok)return;
        if(!z)REC_FEHL++;
      }
      if(rec&&z&&!z.x){REC_FEHL++;Sprache.fehler='Stimmdaten fehlen'}
    }
    if(it.s!=B.szene){B.szene=it.s;B.sz0=jetzt();B.props=[]}
    B.item=it;B.spr=it.wer?Math.max(0,g.figuren.indexOf(it.wer)):-1;B.satz0=jetzt();
    var rq=requisiten(it.t);
    if(rq.length&&rq.join('')!=B.props.map(function(p){return p.e}).join('')){B.props=rq.map(function(e){return {e:e,t0:jetzt()}});Klang.effekt('pop')}
    var wq=z?(Sprache.modus=='super'?'Supertonic '+Sprache.superStimme(f)+((Sprache.FXZ[f?f.name:'__erz']||'normal')!='normal'?' · '+Stimme.EFFEKTE[Sprache.FXZ[f?f.name:'__erz']].n:'')+' · '+(Super.backend||'?'):'Thorsten'):'⚠️ iPhone-Ersatzstimme'+(Sprache.fehler?' ('+esc(Sprache.fehler)+')':'');
    fStatus((rec?'🔴 Aufnahme – ':'')+'Szene '+(it.s+1)+' von '+g.szenen.length+'<br><small>🗣 '+wq+'</small>');
    Rec.wer=it.wer||'';Rec.ut=it.t;
    ut.innerHTML=it.wer?'<b>'+esc(it.wer)+':</b> '+esc(it.t):'<i>'+esc(it.t)+'</i>';
    Klang.effekt(Klang.passend(it.t));
    if(z)await spielen(z);else if(rec)await warten(Math.max(1500,it.t.split(/\s+/).length*400));else await sprichFB(it.t,f,my);
    if(my!=tok)return;
    B.spr=-1;B.env=null;B.lvl=0;
    await warten(120);
    if(my!=tok)return;
  }
  B.item=null;laeuft=false;Klang.stop();Klang.effekt('ende');ut.style.display='';ut.innerHTML='🎬 Ende';fStatus('');
  Rec.wer='';Rec.ut='';
  if(rec){
    fStatus('🔴 Aufnahme wird abgeschlossen …');
    await warten(2600);if(my!=tok)return;
    try{
      var datei=await Rec.stop();if(my!=tok)return;
      fStatus('');
      var mb=(datei.size/1048576).toFixed(1).replace('.',',');
      var fv2=document.getElementById('fvideo');
      var warn=REC_FEHL?'<div class="gdauer" style="background:#ffe3d6">⚠️ Bei '+REC_FEHL+' von '+items.length+' Sätzen fehlt die Stimme.<br><small>Grund: '+esc(Sprache.fehler||'unbekannt')+'</small></div>':'<div class="fstatus">Alle '+items.length+' Sätze mit Stimme aufgenommen ('+esc(Sprache.modus+' '+(Super.backend||'')+(Sprache.info?' – '+Sprache.info:''))+', '+esc(Rec.typ||'?')+').</div>';
      if(fv2)fv2.innerHTML=warn+'<div class="gdauer" style="text-align:center">✅ Video fertig ('+mb+' MB)</div><button class="gross" style="background:#3a86ff" onclick="Rec.teilen()">📤 Video sichern oder teilen</button><div class="fstatus">Tippe dann auf „Video sichern“, um es in Fotos zu speichern.</div>';
    }catch(e){fStatus('⚠️ Video konnte nicht erstellt werden: '+esc(String(e&&e.message||e)))}
  }
}
