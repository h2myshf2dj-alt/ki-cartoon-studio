var SCREENS={};
var KATS=['Abenteuer','Comedy','Märchen','Fantasy','Tiere','Familie','Kinderfilm','Spannung','Science-Fiction'];
var KD={
Abenteuer:['im dichten Wald','eine geheimnisvolle Schatzkarte','Ein reißender Fluss versperrt den Weg.','bauen sie eine Brücke aus Ästen','Sie finden den Schatz und teilen ihn.'],
Comedy:['auf dem Marktplatz','einen sprechenden Kürbis','Der Kürbis erzählt den ganzen Tag schlechte Witze.','erfinden sie einen noch schlechteren Witz','Alle lachen, bis ihnen die Bäuche wehtun.'],
'Märchen':['vor einem alten Schloss','eine goldene Krone','Eine böse Hexe hat das Schloss verzaubert.','brechen sie den Zauber mit einem freundlichen Lied','Das Schloss erstrahlt, und alle feiern ein Fest.'],
Fantasy:['im Land der Drachen','einen leuchtenden Zauberstein','Ein kleiner Drache hat sich verirrt.','führen sie ihn mit dem Zauberstein nach Hause','Der Drache dankt ihnen mit einer Flugrunde.'],
Tiere:['auf der Waldwiese','ein verlorenes Vogelnest','Ein kleines Küken ruft nach seiner Mama.','bringen sie das Küken zurück zu seinem Nest','Die Vogelmama zwitschert vor Freude.'],
Familie:['zu Hause im Garten','ein altes Fotoalbum','Das Geburtstagsgeschenk für Oma ist verschwunden.','basteln sie ein neues Geschenk','Oma freut sich riesig, und alle umarmen sich.'],
Kinderfilm:['auf dem Spielplatz','einen bunten Ball','Der Ball hängt hoch oben im Baum fest.','bilden sie eine Räuberleiter und holen ihn herunter','Dann spielen sie fröhlich bis zum Abend.'],
Spannung:['in einem dunklen Keller','einen rätselhaften Schlüssel','Hinter der Tür hört man seltsame Geräusche.','öffnen sie mutig die Tür und finden einen kleinen Kater','Zum Glück war alles harmlos.'],
'Science-Fiction':['auf einem fernen Planeten','einen blinkenden Roboterchip','Dem Raumschiff geht der Strom aus.','setzen sie den Chip ein und starten das Raumschiff neu','Sie fliegen sicher nach Hause zur Erde.']
};
var VL=[
['{A} und {B} sind {ort}.',[0,'Was für ein schöner Tag!'],[1,'Ja, lass uns etwas erleben!']],
['Heute haben die beiden viel vor.',[0,'Hast du Lust auf ein Abenteuer?'],[1,'Aber sicher, ich bin bereit!']],
['Die beiden machen sich auf den Weg.',[1,'Wie weit ist es noch?'],[0,'Nicht mehr lange, versprochen!']],
['Plötzlich entdecken sie {fund}.',[0,'Schau mal, was ich gefunden habe!'],[1,'Wow, das ist ja unglaublich!']],
['{A} und {B} schauen sich staunend an.',[0,'Was machen wir jetzt damit?'],[1,'Wir müssen es genau untersuchen.']],
['{problem}',[0,'Oje, was machen wir jetzt?'],[1,'Keine Sorge, uns fällt bestimmt etwas ein.']],
['Die Sorgen werden größer.',[0,'Ich habe ein bisschen Angst.'],[1,'Ich bin bei dir, wir schaffen das.']],
['{A} hat eine Idee.',[0,'Wenn wir zusammenhalten, schaffen wir das!'],[1,'Du hast recht. Gemeinsam sind wir stark!']],
['Jetzt braucht es Mut.',[0,'Auf drei geht es los!'],[1,'Eins, zwei, drei!']],
['Gemeinsam {loesung}.',[0,'Es klappt!'],[1,'Ich wusste, dass wir das können!']],
['Es ist geschafft!',[0,'Wir haben es wirklich geschafft!'],[1,'Das war ganz schön knapp.']],
['{schluss}',[0,'Das war das schönste Abenteuer.'],[1,'Das machen wir bald wieder!']]
];
function dauer(g){
  var w=0,n=0;
  g.szenen.forEach(function(s){
    if(s.narr.trim()){w+=s.narr.trim().split(/\s+/).length;n++}
    s.zeilen.forEach(function(z){if(z.text.trim()){w+=z.text.trim().split(/\s+/).length;n++}});
  });
  return Math.round(w/2.6+n*0.4);
}
function schreibe(kat,laenge,namen){
  var d=KD[kat],A=namen[0],B=namen[1];
  function f(x){
    return x.split('{A}').join(A).split('{B}').join(B).split('{ort}').join(d[0]).split('{fund}').join(d[1]).split('{problem}').join(d[2]).split('{loesung}').join(d[3]).split('{schluss}').join(d[4]);
  }
  var alle=VL.map(function(t){
    return {narr:f(t[0]),zeilen:[{wer:namen[t[1][0]],text:f(t[1][1])},{wer:namen[t[2][0]],text:f(t[2][1])}]};
  });
  var pick=[],sum=0;
  [3,11,0,5,9,7,1,2,4,6,8,10].forEach(function(i){
    var x=dauer({szenen:[alle[i]]});
    if(sum+x<=laenge){pick.push(i);sum+=x}
  });
  pick.sort(function(a,b){return a-b});
  return {id:Date.now(),titel:A+' und '+B+' – '+kat,kat:kat,laenge:laenge,figuren:namen,szenen:pick.map(function(i){return alle[i]})};
}
