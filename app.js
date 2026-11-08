var figuren=[];
try{figuren=JSON.parse(localStorage.getItem('figuren')||'[]')}catch(e){}
var neu={name:'',typ:'Hund',fell:'#c68642',kleid:'#3a86ff',extra:'Keins'};
function sichern(){try{localStorage.setItem('figuren',JSON.stringify(figuren))}catch(e){}}

function chips(titel,liste,key,farbe){
  var h='<h3>'+titel+'</h3><div class="chips">';
  liste.forEach(function(w){
    var an=neu[key]===w?' an':'';
    if(farbe)h+='<span class="dot'+an+'" style="background:'+w+'" onclick="setze(\''+key+'\',\''+w+'\')"></span>';
    else h+='<span class="chip'+an+'" onclick="setze(\''+key+'\',\''+w+'\')">'+w+'</span>';
  });
  return h+'</div>';
}
function setze(k,v){neu[k]=v;zeige('bauen')}
function bald(){alert('Kommt bald!')}
function neueFigur(){neu={name:'',typ:'Hund',fell:'#c68642',kleid:'#3a86ff',extra:'Keins'};zeige('bauen')}
function fertig(){
  if(!neu.name.trim()){alert('Bitte gib der Figur einen Namen.');return}
  figuren.push({name:neu.name.trim(),typ:neu.typ,fell:neu.fell,kleid:neu.kleid,extra:neu.extra});
  sichern();zeige('figuren');
}
function loeschen(i){
  if(confirm('Diese Figur wirklich löschen?')){figuren.splice(i,1);sichern();zeige('figuren')}
}

function zeige(s){
  var h='';
  if(s=='home'){
    h='<h1>🎬 KI Cartoon Studio</h1><p class="sub">Dein eigenes Zeichentrickstudio</p><div class="grid">'+
    '<button class="neu" onclick="bald()">➕ Neuen Film erstellen</button>'+
    '<button class="b1" onclick="bald()">🎞️ Meine Filme</button>'+
    '<button class="b2" onclick="zeige(\'figuren\')">🐶 Meine Figuren</button>'+
    '<button class="b3" onclick="bald()">📖 Meine Geschichten</button>'+
    '<button class="b4" onclick="bald()">⭐ Vorlagen</button>'+
    '<button onclick="bald()">⚙️ Einstellungen</button></div>';
  }
  if(s=='figuren'){
    h='<button class="zurueck" onclick="zeige(\'home\')">← Zurück</button><h2>🐶 Meine Figuren</h2>'+
    '<button class="gross" onclick="neueFigur()">➕ Neue Figur bauen</button>';
    if(!figuren.length)h+='<p class="sub" style="margin-top:20px">Noch keine Figuren. Baue deine erste!</p>';
    figuren.forEach(function(f,i){
      h+='<div class="karte">'+svg(f)+'<b>'+f.name.replace(/</g,'&lt;')+'</b><button class="loesch" onclick="loeschen('+i+')">Löschen</button></div>';
    });
  }
  if(s=='bauen'){
    h='<button class="zurueck" onclick="zeige(\'figuren\')">← Zurück</button><h2>Neue Figur</h2>'+
    '<div class="vorschau">'+svg(neu)+'</div>'+
    '<h3>Name</h3><input id="n" value="'+neu.name.replace(/"/g,'&quot;')+'" placeholder="z. B. Bello" oninput="neu.name=this.value">'+
    chips('Art',TYPEN,'typ',false)+chips('Fell- oder Hautfarbe',FELL,'fell',true)+
    chips('Kleidung',KLEID,'kleid',true)+chips('Extra',EXTRA,'extra',false)+
    '<button class="gross" onclick="fertig()">✅ Figur speichern</button><div style="height:40px"></div>';
  }
  document.getElementById('app').innerHTML=h;
  window.scrollTo(0,0);
}
zeige('home');
