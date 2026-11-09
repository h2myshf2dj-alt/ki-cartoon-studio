var figuren=[];
try{figuren=JSON.parse(localStorage.getItem('figuren')||'[]')}catch(e){}
var neu,letzte='';
function start(){neu=norm({name:'',art:'Mensch'})}
start();
function sichern(){try{localStorage.setItem('figuren',JSON.stringify(figuren))}catch(e){}}

function chips(titel,liste,key,farbe){
  var h='<h3>'+titel+'</h3><div class="chips">';
  liste.forEach(function(w){
    var an=neu[key]===w?' an':'';
    var c='onclick="setze(\''+key+'\',\''+w+'\')"';
    if(farbe)h+='<span class="dot'+an+'" style="background:'+w+'" '+c+'></span>';
    else h+='<span class="chip'+an+'" '+c+'>'+w+'</span>';
  });
  return h+'</div>';
}
function setze(k,v){
  neu[k]=v;
  if(k=='art'){
    neu.rasse=RASSEN[v]?RASSEN[v][0]:'';
    neu.fell=v=='Roboter'?FARBEN.robo[0]:(RF[neu.rasse]||FARBEN.fell[0]);
  }
  if(k=='rasse'&&RF[v]){neu.fell=RF[v];if(RAUGEN[v])neu.augen=RAUGEN[v]}
  zeige('bauen');
}
function bald(){alert('Kommt bald!')}
function neueFigur(){start();zeige('bauen')}
function fertig(){
  if(!neu.name.trim()){alert('Bitte gib der Figur einen Namen.');return}
  var c={};for(var k in neu)c[k]=neu[k];
  c.name=c.name.trim();
  figuren.push(c);sichern();zeige('figuren');
}
function loeschen(i){
  if(confirm('Diese Figur wirklich löschen?')){figuren.splice(i,1);sichern();zeige('figuren')}
}
function bauen(){
  var a=neu.art,M=a=='Mensch',R=a=='Roboter';
  var h='<button class="zurueck" onclick="zeige(\'figuren\')">← Zurück</button><div class="vorschau">'+svg(neu)+'</div>'+
  '<h3>Name</h3><input value="'+neu.name.replace(/"/g,'&quot;')+'" placeholder="z. B. Bello" oninput="neu.name=this.value">'+
  chips('Art',ARTEN,'art',false);
  if(!R)h+=chips('Geschlecht',['weiblich','männlich'],'geschl',false)+chips('Alter',['Kind','Erwachsen'],'alter',false);
  if(RASSEN[a])h+=chips('Rasse',RASSEN[a],'rasse',false);
  if(M){
    h+=chips('Kopfform',KOPFFORMEN,'kopf',false)+chips('Hautfarbe',FARBEN.haut,'haut',true)+chips('Haarlänge',['Glatze','Kurz','Mittel','Lang'],'haarlaenge',false);
    if(neu.haarlaenge!='Glatze')h+=chips('Frisur',FRISUREN,'frisur',false)+chips('Haarfarbe',FARBEN.haar,'haar',true);
    if(neu.geschl=='männlich'&&neu.alter=='Erwachsen')h+=chips('Bart',BAERTE,'bart',false);
    h+=chips('Sommersprossen',['Nein','Ja'],'sommer',false);
  }else h+=chips(R?'Farbe':'Fellfarbe',R?FARBEN.robo:FARBEN.fell,'fell',true);
  h+=chips('Augenfarbe',FARBEN.augen,'augen',true)+chips('Oberteil',OBERTEILE,'oberteil',false)+
  chips('Kleidungsfarbe',FARBEN.kleid,'kleid',true);
  if(neu.oberteil!='Kleid')h+=chips(neu.oberteil=='Rock'?'Rockfarbe':'Hosenfarbe',FARBEN.hose,'hose',true);
  h+=chips('Extra',EXTRAS,'extra',false);
  return h+'<button class="gross" onclick="fertig()">✅ Figur speichern</button><div style="height:40px"></div>';
}
function zeige(s){
  var h='';
  if(s=='home'){
    h='<h1>🎬 KI Cartoon Studio</h1><p class="sub">Dein eigenes Zeichentrickstudio</p><div class="grid">'+
    '<button class="neu" onclick="bald()">➕ Neuen Film erstellen</button>'+
    '<button class="b1" onclick="bald()">🎞️ Meine Filme</button>'+
    '<button class="b2" onclick="zeige(\'figuren\')">🐶 Meine Figuren</button>'+
    '<button class="b3" onclick="zeige(\'geschichten\')">📖 Meine Geschichten</button>'+
    '<button class="b4" onclick="bald()">⭐ Vorlagen</button>'+
    '<button onclick="bald()">⚙️ Einstellungen</button></div><p class="sub" style="margin-top:24px;font-size:13px">Version '+(window.APPV||'?')+'</p>';
  }
  if(s=='figuren'){
    h='<button class="zurueck" onclick="zeige(\'home\')">← Zurück</button><h2>🐶 Meine Figuren</h2>'+
    '<button class="gross" onclick="neueFigur()">➕ Neue Figur bauen</button>';
    if(!figuren.length)h+='<p class="sub" style="margin-top:20px">Noch keine Figuren. Baue deine erste!</p>';
    figuren.forEach(function(f,i){
      var n=norm(f);
      h+='<div class="karte">'+svg(f)+'<b>'+n.name.replace(/</g,'&lt;')+'<br><small>'+(n.rasse||n.art)+' · '+(n.art=='Roboter'?'':n.alter)+'</small></b><button class="loesch" onclick="loeschen('+i+')">Löschen</button></div>';
    });
  }
  if(s=='bauen')h=bauen();
  if(typeof SCREENS!='undefined'&&SCREENS[s])h=SCREENS[s]();
  document.getElementById('app').innerHTML=h;
  if(s!=letzte)window.scrollTo(0,0);
  letzte=s;
}
zeige('home');
