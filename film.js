var FI=0,tok=0,fTimer=null,AUD=new Audio(),stimmen=[],laeuft=false;
function kText(w){
  if(w=='m')return Klang.musik?'🎵 Musik: an':'🎵 Musik: aus';
  if(w=='f')return Klang.fx?'🔊 Geräusche: an':'🔊 Geräusche: aus';
  return {hoch:'🗣 Stimme: Thorsten hoch (beste)',normal:'🗣 Stimme: Thorsten normal (schneller)',iphone:'🗣 Stimme: iPhone (nicht für MP4)'}[Sprache.modus];
}
function kSpeichern(){try{localStorage.setItem('klang',JSON.stringify({m:Klang.musik,f:Klang.fx,s:Sprache.an,q:Sprache.modus}))}catch(e){}}
try{var kk=JSON.parse(localStorage.getItem('klang')||'{}');if(kk.m===false)Klang.musik=false;if(kk.f===false)Klang.fx=false;if(kk.q)Sprache.setModus(kk.q);else if(kk.s===false)Sprache.setModus('iphone')}catch(e){}
function kMusik(){Klang.musik=!Klang.musik;kSpeichern();document.getElementById('bm').innerHTML=kText('m');if(!Klang.musik)Klang.stop();else if(laeuft)Klang.start(GS[gi].kat)}
function kFx(){Klang.fx=!Klang.fx;kSpeichern();document.getElementById('bf').innerHTML=kText('f')}
function kStimme(){Sprache.setModus({hoch:'normal',normal:'iphone',iphone:'hoch'}[Sprache.modus]);kSpeichern();document.getElementById('bs').innerHTML=kText('s')}
function filmOeffne(){FI=gi;zeige('film')}
function filmEnde(){filmStop();clearInterval(fTimer);fTimer=null}
SCREENS.film=function(){
  var g=GS[gi];
  setTimeout(function(){buehneNeu();buehneZeichnen();schleife()},0);
  return '<button class="zurueck" onclick="filmEnde();zeige(\'gedit\')">← Zurück</button><h2>🎬 '+esc(g.titel)+'</h2><div id="buehne" class="buehne"></div><div id="untertitel" class="untertitel">Tippe auf „Abspielen“.</div><div id="fstatus" class="fstatus"></div><button class="gross" onclick="filmStart()">▶ Abspielen</button><div style="display:flex;gap:10px"><button id="bm" class="klein" style="flex:1" onclick="kMusik()">'+kText('m')+'</button><button id="bf" class="klein" style="flex:1" onclick="kFx()">'+kText('f')+'</button></div><button id="bs" class="klein" style="width:100%" onclick="kStimme()">'+kText('s')+'</button><button class="gross" style="background:#999" onclick="filmStop()">■ Stopp</button><div style="height:40px"></div>';
};
function schleife(){
  clearInterval(fTimer);
  fTimer=setInterval(function(){
    if(!document.getElementById('buehne')){clearInterval(fTimer);fTimer=null;return}
    if(B.fb)B.lvl=B.spr>=0?(Math.floor(jetzt()*9)%4):0;
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
function spielen(z){
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
  tok++;laeuft=false;B.spr=-1;B.lvl=0;B.fb=false;B.env=null;B.item=null;
  try{AUD.onended=null;AUD.pause()}catch(e){}
  try{speechSynthesis.cancel()}catch(e){}
  Klang.stop();
  var u=document.getElementById('untertitel');if(u)u.innerHTML='Gestoppt.';
  fStatus('');
}
function warten(ms){return new Promise(function(ok){setTimeout(ok,ms)})}
async function filmStart(){
  filmStop();
  var my=tok,g=GS[gi],items=[];
  g.szenen.forEach(function(s,i){
    if(s.narr.trim())items.push({t:s.narr.trim(),wer:'',s:i,g:'neutral'});
    s.zeilen.forEach(function(z){if(z.text.trim())items.push({t:z.text.trim(),wer:z.wer,s:i,g:(z.g&&GEFUEHL_L[z.g])?z.g:gefuehl(z.text)})});
  });
  var ut=document.getElementById('untertitel');
  if(!items.length){ut.innerHTML='Die Geschichte hat noch keinen Text.';return}
  freischalten();Klang.init();
  buehneNeu();schleife();
  var voice=Sprache.an,pro=[];
  if(voice){
    try{
      ut.innerHTML='🗣 Stimme wird geladen …';fStatus('Beim ersten Mal kann das etwas dauern (WLAN empfohlen).');
      await Sprache.laden(function(p){ut.innerHTML='🗣 Stimme wird geladen: '+p+' %'});
      if(my!=tok)return;
      items.forEach(function(it,k){var f=it.wer?figInfo(it.wer):null;pro[k]=Sprache.zeile(it.t,f,it.g);pro[k].catch(function(){})});
    }catch(e){voice=false;Sprache.fehler=String(e&&e.message||e);ut.innerHTML='⚠️ Thorsten ist nicht verfügbar, nehme iPhone-Stimme.';await warten(1500)}
  }
  if(my!=tok)return;
  if(voice){
    for(var j=0;j<items.length;j++){
      ut.innerHTML='🗣 Stimmen werden vorbereitet: '+(j+1)+' von '+items.length;
      try{await pro[j]}catch(e){}
      if(my!=tok)return;
    }
  }
  Klang.start(g.kat);laeuft=true;B.ein=true;
  for(var k=0;k<items.length;k++){
    var it=items[k],f=it.wer?figInfo(it.wer):null,z=null;
    if(voice){
      try{z=await pro[k]}catch(e){z=null;Sprache.fehler=String(e&&e.message||e)}
      if(my!=tok)return;
    }
    if(it.s!=B.szene){B.szene=it.s;B.sz0=jetzt();B.props=[]}
    B.item=it;B.spr=it.wer?Math.max(0,g.figuren.indexOf(it.wer)):-1;B.satz0=jetzt();
    var rq=requisiten(it.t);
    if(rq.length&&rq.join('')!=B.props.map(function(p){return p.e}).join('')){B.props=rq.map(function(e){return {e:e,t0:jetzt()}});Klang.effekt('pop')}
    fStatus('Szene '+(it.s+1)+' von '+g.szenen.length);
    ut.innerHTML=it.wer?'<b>'+esc(it.wer)+':</b> '+esc(it.t):'<i>'+esc(it.t)+'</i>';
    Klang.effekt(Klang.passend(it.t));
    if(z)await spielen(z);else await sprichFB(it.t,f,my);
    if(my!=tok)return;
    B.spr=-1;B.env=null;B.lvl=0;
    await warten(120);
    if(my!=tok)return;
  }
  B.item=null;laeuft=false;Klang.stop();Klang.effekt('ende');ut.innerHTML='🎬 Ende';fStatus('');
}
