var FI=0,tok=0,sprecher='',mund=false,tick=0,fTimer=null,stimmen=[];
var HGF={Abenteuer:['#a8e6ff','#5fb35a'],Comedy:['#ffe39b','#f4a259'],'Märchen':['#ffd1e8','#8fd18f'],Fantasy:['#4b2e83','#2e7d5b'],Tiere:['#bfeaff','#7cc576'],Familie:['#cfeeff','#8ccf7e'],Kinderfilm:['#c8f0ff','#9ad46f'],Spannung:['#1d1f3a','#2b2b3b'],'Science-Fiction':['#0b1033','#4a4f6a']};
function hintergrund(k){
  var c=HGF[k]||HGF.Abenteuer,dunkel=(k=='Spannung'||k=='Fantasy'||k=='Science-Fiction');
  var s='<rect width="400" height="300" fill="'+c[0]+'"/>';
  if(dunkel){
    s+='<circle cx="330" cy="50" r="24" fill="#fff6c9"/>';
    [[40,30],[90,70],[150,25],[220,60],[270,20],[370,100],[60,120]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.5" fill="#fff"/>'});
  }else s+='<circle cx="340" cy="50" r="28" fill="#ffd93b"/>';
  s+='<rect y="215" width="400" height="85" fill="'+c[1]+'"/>';
  if(k=='Abenteuer'||k=='Tiere'||k=='Kinderfilm'||k=='Comedy')
    [[40,200],[350,205]].forEach(function(p){s+='<rect x="'+(p[0]-5)+'" y="'+p[1]+'" width="10" height="32" fill="#7a4a21"/><circle cx="'+p[0]+'" cy="'+(p[1]-8)+'" r="26" fill="#3f9b4a"/>'});
  if(k=='Märchen')s+='<rect x="30" y="130" width="80" height="90" fill="#e8d3b0"/><rect x="30" y="112" width="20" height="30" fill="#d9b98a"/><rect x="90" y="112" width="20" height="30" fill="#d9b98a"/><polygon points="26,112 40,86 54,112" fill="#e63946"/><polygon points="86,112 100,86 114,112" fill="#e63946"/>';
  if(k=='Familie')s+='<rect x="285" y="150" width="90" height="70" fill="#f2c48b"/><polygon points="275,150 330,105 385,150" fill="#c0392b"/><rect x="318" y="180" width="24" height="40" fill="#7a4a21"/>';
  if(k=='Science-Fiction')s+='<circle cx="70" cy="80" r="34" fill="#c0663a"/><ellipse cx="70" cy="80" rx="52" ry="9" fill="none" stroke="#e8c9a0" stroke-width="4"/>';
  if(k=='Fantasy')s+='<polygon points="40,215 90,150 140,215" fill="#6b3fa0"/><polygon points="300,215 350,140 400,215" fill="#6b3fa0"/>';
  return s;
}
function figInfo(n){
  var f=null;figuren.forEach(function(x){if(x.name==n)f=x});
  return norm(f||{name:n});
}
function buehneZeichnen(){
  var el=document.getElementById('buehne');if(!el)return;
  var g=GS[gi],n=g.figuren.length,sc=n<=2?0.62:(n==3?0.55:0.46),s='<svg viewBox="0 0 400 300">'+hintergrund(g.kat);
  g.figuren.forEach(function(name,i){
    var f=figInfo(name),cx=400/n*(i+0.5),sp=(sprecher==name),dy=sp?(mund?-5:0):Math.sin(tick/3+i)*1.5;
    f.mund=sp&&mund;
    var inner=svg(f).replace('<svg viewBox="0 0 200 240">','').replace(/<\/svg>\s*$/,'');
    var k=sc*(sp?1.07:1);
    s+='<g opacity="'+(sprecher&&!sp?0.8:1)+'" transform="translate('+(cx-100*k)+' '+(300-240*k-12+dy)+') scale('+k+')">'+inner+'</g>';
  });
  el.innerHTML=s+'</svg>';
}
function kText(w){return w=='m'?(Klang.musik?'🎵 Musik: an':'🎵 Musik: aus'):(Klang.fx?'🔊 Geräusche: an':'🔊 Geräusche: aus')}
function kSpeichern(){try{localStorage.setItem('klang',JSON.stringify({m:Klang.musik,f:Klang.fx}))}catch(e){}}
try{var kk=JSON.parse(localStorage.getItem('klang')||'{}');if(kk.m===false)Klang.musik=false;if(kk.f===false)Klang.fx=false}catch(e){}
function kMusik(){Klang.musik=!Klang.musik;kSpeichern();document.getElementById('bm').innerHTML=kText('m');if(!Klang.musik)Klang.stop();else if(fTimer)Klang.start(GS[gi].kat)}
function kFx(){Klang.fx=!Klang.fx;kSpeichern();document.getElementById('bf').innerHTML=kText('f')}
function filmOeffne(){FI=gi;zeige('film')}
SCREENS.film=function(){
  var g=GS[gi];
  setTimeout(buehneZeichnen,0);
  return '<button class="zurueck" onclick="filmStop();zeige(\'gedit\')">← Zurück</button><h2>🎬 '+esc(g.titel)+'</h2><div id="buehne" class="buehne"></div><div id="untertitel" class="untertitel">Tippe auf „Abspielen“.</div><div id="fstatus" class="fstatus"></div><button class="gross" onclick="filmStart()">▶ Abspielen</button><div style="display:flex;gap:10px"><button id="bm" class="klein" style="flex:1" onclick="kMusik()">'+kText('m')+'</button><button id="bf" class="klein" style="flex:1" onclick="kFx()">'+kText('f')+'</button></div><button class="gross" style="background:#999" onclick="filmStop()">■ Stopp</button><div style="height:40px"></div>';
};
function ladeStimmen(){try{stimmen=speechSynthesis.getVoices().filter(function(v){return /^de/i.test(v.lang)})}catch(e){}}
try{ladeStimmen();speechSynthesis.onvoiceschanged=ladeStimmen}catch(e){}
function wahl(f){
  if(!stimmen.length)return null;
  var re=f&&f.geschl=='männlich'?/markus|martin|yannick|viktor|jonas|stefan/i:/anna|petra|helena|marlene|sandy|shelley|ela/i,v=null;
  stimmen.forEach(function(x){if(!v&&re.test(x.name))v=x});
  return v||stimmen[0];
}
function sprich(text,f,fertig){
  var done=false,t,w=text.trim().split(/\s+/).length,est=(w/2.4+0.8)*1000;
  function ende(){if(done)return;done=true;clearTimeout(t);fertig()}
  if(typeof speechSynthesis=='undefined'||typeof SpeechSynthesisUtterance=='undefined'){t=setTimeout(ende,est);return}
  try{
    var u=new SpeechSynthesisUtterance(text);u.lang='de-DE';
    var v=wahl(f);if(v)u.voice=v;
    if(f){u.pitch=Math.min(2,(f.geschl=='weiblich'?1.3:0.8)*(f.alter=='Kind'?1.25:1));u.rate=0.95}
    else{u.pitch=1;u.rate=0.92}
    u.onend=ende;u.onerror=ende;
    speechSynthesis.speak(u);
    t=setTimeout(ende,est+5000);
  }catch(e){t=setTimeout(ende,est)}
}
function filmStop(){
  tok++;sprecher='';clearInterval(fTimer);fTimer=null;Klang.stop();
  try{speechSynthesis.cancel()}catch(e){}
  var u=document.getElementById('untertitel');if(u)u.innerHTML='Gestoppt.';
  buehneZeichnen();
}
function filmStart(){
  filmStop();
  var my=tok,g=GS[gi],items=[];
  g.szenen.forEach(function(s,i){
    if(s.narr.trim())items.push({t:s.narr.trim(),wer:'',s:i});
    s.zeilen.forEach(function(z){if(z.text.trim())items.push({t:z.text.trim(),wer:z.wer,s:i})});
  });
  if(!items.length){document.getElementById('untertitel').innerHTML='Die Geschichte hat noch keinen Text.';return}
  Klang.init();Klang.start(g.kat);
  fTimer=setInterval(function(){tick++;if(sprecher)mund=!mund;else mund=false;buehneZeichnen()},170);
  function schritt(k){
    if(my!=tok)return;
    if(k>=items.length){
      sprecher='';clearInterval(fTimer);fTimer=null;buehneZeichnen();
      Klang.stop();Klang.effekt('ende');document.getElementById('untertitel').innerHTML='🎬 Ende';document.getElementById('fstatus').innerHTML='';return;
    }
    var it=items[k];sprecher=it.wer;
    document.getElementById('fstatus').innerHTML='Szene '+(it.s+1)+' von '+g.szenen.length;
    document.getElementById('untertitel').innerHTML=it.wer?'<b>'+esc(it.wer)+':</b> '+esc(it.t):'<i>'+esc(it.t)+'</i>';
    Klang.effekt(Klang.passend(it.t));
    sprich(it.t,it.wer?figInfo(it.wer):null,function(){sprecher='';setTimeout(function(){schritt(k+1)},250)});
  }
  schritt(0);
}
