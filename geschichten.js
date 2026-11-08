var GS=[],gn={titel:'',kat:'Abenteuer',laenge:60,fig:[]},gi=0;
try{GS=JSON.parse(localStorage.getItem('geschichten')||'[]')}catch(e){}
function sichG(){try{localStorage.setItem('geschichten',JSON.stringify(GS))}catch(e){}}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function gchip(t,an,c){return '<span class="chip'+(an?' an':'')+'" onclick="'+c+'">'+esc(t)+'</span>'}

SCREENS.geschichten=function(){
  var h='<button class="zurueck" onclick="zeige(\'home\')">← Zurück</button><h2>📖 Meine Geschichten</h2><button class="gross" onclick="gNeu()">➕ Neue Geschichte</button>';
  if(!GS.length)h+='<p class="sub" style="margin-top:20px">Noch keine Geschichten.</p>';
  GS.forEach(function(g,i){
    h+='<div class="karte" onclick="gOeffne('+i+')"><b>'+esc(g.titel)+'<br><small>'+g.kat+' · '+g.laenge+' s · ca. '+dauer(g)+' s</small></b><button class="loesch" onclick="event.stopPropagation();gLoesch('+i+')">Löschen</button></div>';
  });
  return h;
};
function gNeu(){gn={titel:'',kat:'Abenteuer',laenge:60,fig:[]};zeige('gneu')}
function gOeffne(i){gi=i;zeige('gedit')}
function gLoesch(i){if(confirm('Geschichte wirklich löschen?')){GS.splice(i,1);sichG();zeige('geschichten')}}
function gk(k){gn.kat=k;zeige('gneu')}
function gl(s){gn.laenge=s;zeige('gneu')}
function gf(i){var p=gn.fig.indexOf(i);if(p<0)gn.fig.push(i);else gn.fig.splice(p,1);zeige('gneu')}
function gNamen(){return gn.fig.map(function(i){return figuren[i].name})}
function gAuto(){
  if(gn.fig.length<2){alert('Wähle mindestens 2 Figuren aus.');return}
  var g=schreibe(gn.kat,gn.laenge,gNamen());
  if(gn.titel.trim())g.titel=gn.titel.trim();
  GS.push(g);sichG();gi=GS.length-1;zeige('gedit');
}
function gSelbst(){
  if(!gn.fig.length){alert('Wähle mindestens 1 Figur aus.');return}
  var n=gNamen();
  GS.push({id:Date.now(),titel:gn.titel.trim()||'Meine Geschichte',kat:gn.kat,laenge:gn.laenge,figuren:n,szenen:[{narr:'',zeilen:[{wer:n[0],text:''}]}]});
  sichG();gi=GS.length-1;zeige('gedit');
}
SCREENS.gneu=function(){
  var h='<button class="zurueck" onclick="zeige(\'geschichten\')">← Zurück</button><h2>Neue Geschichte</h2>';
  if(!figuren.length)return h+'<p class="sub">Du brauchst zuerst Figuren. Baue sie unter „Meine Figuren“.</p><button class="gross" onclick="zeige(\'figuren\')">🐶 Zu meinen Figuren</button>';
  h+='<h3>Titel (kann leer bleiben)</h3><input value="'+esc(gn.titel)+'" oninput="gn.titel=this.value">';
  h+='<h3>Kategorie</h3><div class="chips">';
  KATS.forEach(function(k){h+=gchip(k,gn.kat==k,"gk('"+k+"')")});
  h+='</div><h3>Länge</h3><div class="chips">';
  [15,30,60,90,120].forEach(function(s){h+=gchip(s+' Sek.',gn.laenge==s,'gl('+s+')')});
  h+='</div><h3>Figuren (die erste ist die Hauptfigur)</h3><div class="chips">';
  figuren.forEach(function(f,i){h+=gchip(f.name,gn.fig.indexOf(i)>=0,'gf('+i+')')});
  return h+'</div><button class="gross" onclick="gAuto()">✨ Automatisch schreiben</button><button class="gross" style="background:#3a86ff" onclick="gSelbst()">✍️ Selbst schreiben</button><div style="height:40px"></div>';
};
