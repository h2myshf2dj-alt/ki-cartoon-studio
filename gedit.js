function gDauerHtml(g){
  var d=dauer(g),m=Math.min(g.laenge,120);
  return '⏱ ca. '+d+' Sekunden von höchstens '+m+(d<=m?' ✅':' ⚠️ zu lang, bitte kürzen');
}
function gD(){var e=document.getElementById('gd');if(e)e.innerHTML=gDauerHtml(GS[gi])}
function gE(i,j,v){var s=GS[gi].szenen[i];if(j<0)s.narr=v;else s.zeilen[j].text=v;sichG();gD()}
function gW(i,j,v){GS[gi].szenen[i].zeilen[j].wer=v;sichG()}
function gZDel(i,j){GS[gi].szenen[i].zeilen.splice(j,1);sichG();zeige('gedit')}
function gZAdd(i){var g=GS[gi];g.szenen[i].zeilen.push({wer:g.figuren[0],text:''});sichG();zeige('gedit')}
function gSzDel(i){if(confirm('Szene wirklich löschen?')){GS[gi].szenen.splice(i,1);sichG();zeige('gedit')}}
function gSzAdd(){
  var g=GS[gi];
  if(dauer(g)>=120){alert('Der Film darf höchstens 120 Sekunden lang sein.');return}
  g.szenen.push({narr:'',zeilen:[{wer:g.figuren[0],text:''}]});sichG();zeige('gedit');
}
SCREENS.gedit=function(){
  var g=GS[gi];
  var h='<button class="zurueck" onclick="zeige(\'geschichten\')">← Zurück</button><h2>✍️ Geschichte</h2>';
  h+='<input value="'+esc(g.titel)+'" oninput="GS[gi].titel=this.value;sichG()">';
  h+='<div id="gd" class="gdauer">'+gDauerHtml(g)+'</div>';
  g.szenen.forEach(function(s,i){
    h+='<div class="szene"><b>Szene '+(i+1)+'</b> <button class="loesch" onclick="gSzDel('+i+')">Szene löschen</button>';
    h+='<label>Erzähler</label><textarea rows="2" oninput="gE('+i+',-1,this.value)">'+esc(s.narr)+'</textarea>';
    s.zeilen.forEach(function(z,j){
      var o=g.figuren.map(function(n){return '<option'+(n==z.wer?' selected':'')+'>'+esc(n)+'</option>'}).join('');
      h+='<div class="zeile"><select onchange="gW('+i+','+j+',this.value)">'+o+'</select><button class="loesch" onclick="gZDel('+i+','+j+')">✖</button><textarea rows="2" oninput="gE('+i+','+j+',this.value)">'+esc(z.text)+'</textarea></div>';
    });
    h+='<button class="klein" onclick="gZAdd('+i+')">➕ Dialogzeile</button></div>';
  });
  return h+'<button class="gross" onclick="gSzAdd()">➕ Szene hinzufügen</button><div style="height:40px"></div>';
};
