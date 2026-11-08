function norm(f){
  var d={art:f.typ||'Mensch',geschl:'weiblich',alter:'Erwachsen',haut:'#f1c27d',haar:'#6b4423',haarlaenge:'Mittel',augen:'#5a3a1e',oberteil:'Shirt',kleid:'#3a86ff',rasse:'',fell:'#e0b25a',extra:'Keins'};
  for(var k in f)d[k]=f[k];
  if(!d.rasse&&RASSEN[d.art])d.rasse=RASSEN[d.art][0];
  return d;
}
var ST='stroke="#0004" stroke-width="2"';

function haarHinten(f){
  var p='';
  if(f.haarlaenge=='Lang')p='M44 100 Q40 36 100 36 Q160 36 156 100 L164 180 Q100 195 36 180 Z';
  if(f.haarlaenge=='Mittel')p='M44 100 Q40 36 100 36 Q160 36 156 100 L158 142 L42 142 Z';
  return p?'<path d="'+p+'" fill="'+f.haar+'" '+ST+'/>':'';
}
function haarVorn(f){
  if(f.haarlaenge=='Glatze')return '';
  return '<path d="M44 98 Q42 38 100 38 Q158 38 156 98 Q144 64 100 60 Q56 64 44 98 Z" fill="'+f.haar+'" '+ST+'/>';
}
function roboterHinten(f){
  return '<line x1="100" y1="46" x2="100" y2="20" stroke="#555" stroke-width="5"/><circle cx="100" cy="18" r="9" fill="#e63946"/>';
}
function koerper(f,bx,by,bw,bh,haut){
  var k=f.kleid,o=f.oberteil,ah=bh*0.6,ay=by+6,ac=(o=='Pulli')?k:haut,s='';
  s+='<rect x="'+(bx-14)+'" y="'+ay+'" width="16" height="'+ah+'" rx="8" fill="'+ac+'" '+ST+'/>';
  s+='<rect x="'+(bx+bw-2)+'" y="'+ay+'" width="16" height="'+ah+'" rx="8" fill="'+ac+'" '+ST+'/>';
  if(o=='Kleid')s+='<path d="M'+bx+' '+by+' H'+(bx+bw)+' L'+(bx+bw+22)+' 225 H'+(bx-22)+' Z" fill="'+k+'" '+ST+'/>';
  else s+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="26" fill="'+k+'" '+ST+'/>';
  s+='<circle cx="'+(bx-6)+'" cy="'+(ay+ah)+'" r="11" fill="'+haut+'" '+ST+'/>';
  s+='<circle cx="'+(bx+bw+6)+'" cy="'+(ay+ah)+'" r="11" fill="'+haut+'" '+ST+'/>';
  return s;
}
function kopf(f,haut){
  var s=f.art=='Roboter'?'<rect x="44" y="46" width="112" height="100" rx="20" fill="'+haut+'" '+ST+'/>':'<circle cx="100" cy="100" r="56" fill="'+haut+'" '+ST+'/>';
  if(f.art=='Mensch')s+='<path d="M100 104 Q94 113 101 114" stroke="#0006" stroke-width="3" fill="none" stroke-linecap="round"/>';
  else if(f.art!='Roboter')s+=tierGesicht(f);
  return s;
}
function augen(f){
  var a='';
  [78,122].forEach(function(x){
    a+='<circle cx="'+x+'" cy="95" r="12" fill="#fff"/><circle cx="'+x+'" cy="96" r="7" fill="'+f.augen+'"/><circle cx="'+x+'" cy="96" r="3.5" fill="#111"/><circle cx="'+(x+3)+'" cy="92" r="2" fill="#fff"/>';
  });
  if(f.geschl=='weiblich'&&f.art!='Roboter')a+='<path d="M66 88 L59 84 M70 83 L66 76 M134 88 L141 84 M130 83 L134 76" stroke="#111" stroke-width="3" stroke-linecap="round"/>';
  return a;
}
function extras(f){
  var e=f.extra;
  if(e=='Hut')return '<rect x="68" y="22" width="64" height="26" rx="8" fill="#6d4c41"/><rect x="50" y="44" width="100" height="9" rx="4" fill="#6d4c41"/>';
  if(e=='Brille')return '<circle cx="78" cy="95" r="17" fill="none" stroke="#111" stroke-width="4"/><circle cx="122" cy="95" r="17" fill="none" stroke="#111" stroke-width="4"/><line x1="95" y1="95" x2="105" y2="95" stroke="#111" stroke-width="4"/>';
  if(e=='Schleife')return '<polygon points="140,46 168,32 168,60" fill="#ff4d8d"/><polygon points="140,46 112,32 112,60" fill="#ff4d8d"/><circle cx="140" cy="46" r="7" fill="#c2185b"/>';
  return '';
}
function svg(f){
  f=norm(f);
  var K=f.alter=='Kind',M=f.art=='Mensch',R=f.art=='Roboter';
  var T='<g transform="'+(K?'translate(100 128) scale(1.12) translate(-100 -100)':'')+'">';
  var haut=M?f.haut:f.fell;
  var bw=K?64:(f.geschl=='männlich'?84:74),bx=100-bw/2,by=K?175:140,bh=K?50:85;
  var s='<svg viewBox="0 0 200 240">'+T+(M?haarHinten(f):R?roboterHinten(f):tierHinten(f))+'</g>';
  s+=koerper(f,bx,by,bw,bh,haut);
  s+=T+kopf(f,haut)+augen(f);
  s+='<path d="M82 126 Q100 144 118 126" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>';
  if(M)s+=haarVorn(f);
  return s+extras(f)+'</g></svg>';
}
