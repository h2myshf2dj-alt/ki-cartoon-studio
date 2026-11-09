function gDauerHtml(g){
  var d=dauer(g),m=Math.min(g.laenge,120);
  return '⏱ ca. '+d+' Sekunden von höchstens '+m+(d<=m?' ✅':' ⚠️ zu lang, bitte kürzen');
}
function gD(){var e=document.getElementById('gd');if(e)e.innerHTML=gDauerHtml(GS[gi])}
function gE(i,j,v){var s=GS[gi].szenen[i];if(j<0)s.narr=v;else s.zeilen[j].text=v;sichG();gD()}
function gG(i,j,v){var z=GS[gi].szenen[i].zeilen[j];if(v)z.g=v;else delete z.g;sichG()}
function gW(i,j,v){GS[gi].szenen[i].zeilen[j].wer=v;sichG()}
function gZDel(i,j){GS[gi].szenen[i].zeilen.splice(j,1);sichG();zeige('gedit')}
function gZAdd(i){var g=GS[gi];g.szenen[i].zeilen.push({wer:g.figuren[0],text:''});sichG();zeige('gedit')}
function gSzDel(i){if(confirm('Szene wirklich löschen?')){GS[gi].szenen.splice(i,1);sichG();zeige('gedit')}}
function gSzAdd(){
  var g=GS[gi];
  if(dauer(g)>=120){alert('Der Film darf höchstens 120 Sekunden lang sein.');return}
  g.szenen.push({narr:'',zeilen:[{wer:g.figuren[0],text:''}]});sichG();zeige('gedit');
}
var STIMMNAMEN={M1:'Mann 1',M2:'Mann 2',M3:'Mann 3',M4:'Mann 4',M5:'Mann 5',F1:'Frau 1',F2:'Frau 2',F3:'Frau 3',F4:'Frau 4',F5:'Frau 5'};
function gSt(n,k,v){var g=GS[gi];g.stimmen=g.stimmen||{};g.stimmen[n]=g.stimmen[n]||{};if(v)g.stimmen[n][k]=v;else delete g.stimmen[n][k];sichG()}
function gStHtml(g){
  var w=g.stimmen||{},h='<div class="szene"><b>🎤 Stimmen</b><div class="fstatus" style="text-align:left">Wähle für jede Figur Stimme und Effekt. „Automatisch“ gibt jeder Figur eine eigene Stimme.</div>';
  ['Erzähler'].concat(g.figuren).forEach(function(n,i){
    var x=w[n]||{},ov='<option value="">Automatisch</option>'+Object.keys(STIMMNAMEN).map(function(k){return '<option value="'+k+'"'+(x.v==k?' selected':'')+'>'+STIMMNAMEN[k]+'</option>'}).join('');
    var of=Object.keys(Stimme.EFFEKTE).map(function(k){return '<option value="'+k+'"'+((x.fx||'normal')==k?' selected':'')+'>'+Stimme.EFFEKTE[k].n+'</option>'}).join('');
    h+='<label>'+(i?'👤 ':'📖 ')+esc(n)+'</label><div style="display:flex;gap:8px"><select style="flex:1" onchange="gSt(\''+esc(n).replace(/'/g,"\\'")+'\',\'v\',this.value)">'+ov+'</select><select style="flex:1" onchange="gSt(\''+esc(n).replace(/'/g,"\\'")+'\',\'fx\',this.value)">'+of+'</select></div><button class="klein" onclick="gProbe('+i+')">▶ Probe anhören</button>';
  });
  return h+'<div id="gprobe" class="fstatus"></div></div>';
}
var gProbeQ=null;
async function gProbe(i){
  var g=GS[gi],n=i?g.figuren[i-1]:'Erzähler',st=document.getElementById('gprobe');
  function S(t){if(st)st.innerHTML=t}
  try{if(gProbeQ){gProbeQ.stop()}}catch(e){}
  Klang.init();
  if(Sprache.modus!='super'){Sprache.setModus('super');kSpeichern()}
  var t0=Date.now(),uhr=setInterval(function(){S('⏳ Stimme wird erzeugt … '+Math.round((Date.now()-t0)/1000)+' s (beim ersten Mal länger)')},1000);
  try{
    await Sprache.laden(function(p){S('⏳ '+(typeof p=='string'?p:'Stimme wird geladen: '+p+' %'))});
    var liste=g.figuren.map(function(x){return figInfo(x)});
    Sprache.verteilen(liste,g.stimmen);
    var f=i?figInfo(n):null,text=i?'Hallo, ich bin '+n+'. Das wird ein toller Film!':'Es war einmal, an einem sonnigen Tag.';
    var z=await Sprache.zeile(text,f,'froh');
    clearInterval(uhr);
    var c=Klang.ctx,b=c.createBuffer(1,z.x.length,z.rate);b.getChannelData(0).set(z.x);
    var q=c.createBufferSource();q.buffer=b;q.connect(Klang.out);if(c.state!='running'&&c.resume)c.resume();q.start();gProbeQ=q;
    S('🔊 '+esc(n)+': '+STIMMNAMEN[Sprache.superStimme(f)]+' · '+Stimme.EFFEKTE[Sprache.FXZ[f?f.name:'__erz']||'normal'].n);
  }catch(e){clearInterval(uhr);S('⚠️ '+esc(String(e&&e.message||e)))}
}
SCREENS.gedit=function(){
  var g=GS[gi];
  var h='<button class="zurueck" onclick="zeige(\'geschichten\')">← Zurück</button><h2>✍️ Geschichte</h2>';
  h+='<input value="'+esc(g.titel)+'" oninput="GS[gi].titel=this.value;sichG()">';
  h+='<div id="gd" class="gdauer">'+gDauerHtml(g)+'</div>';
  h+='<button class="gross" style="background:#8338ec" onclick="filmOeffne()">▶ Film ansehen</button>';
  h+=gStHtml(g);
  g.szenen.forEach(function(s,i){
    h+='<div class="szene"><b>Szene '+(i+1)+'</b> <button class="loesch" onclick="gSzDel('+i+')">Szene löschen</button>';
    h+='<label>Erzähler</label><textarea rows="2" oninput="gE('+i+',-1,this.value)">'+esc(s.narr)+'</textarea>';
    s.zeilen.forEach(function(z,j){
      var o=g.figuren.map(function(n){return '<option'+(n==z.wer?' selected':'')+'>'+esc(n)+'</option>'}).join('');
      var og='<option value="">🎭 Gefühl: automatisch</option>'+MIMIK.map(function(m){return '<option value="'+m+'"'+(z.g==m?' selected':'')+'>'+GEFUEHL_L[m]+'</option>'}).join('');
      h+='<div class="zeile"><select onchange="gW('+i+','+j+',this.value)">'+o+'</select><select onchange="gG('+i+','+j+',this.value)">'+og+'</select><button class="loesch" onclick="gZDel('+i+','+j+')">✖</button><textarea rows="2" oninput="gE('+i+','+j+',this.value)">'+esc(z.text)+'</textarea></div>';
    });
    h+='<button class="klein" onclick="gZAdd('+i+')">➕ Dialogzeile</button></div>';
  });
  return h+'<button class="gross" onclick="gSzAdd()">➕ Szene hinzufügen</button><div style="height:40px"></div>';
};
