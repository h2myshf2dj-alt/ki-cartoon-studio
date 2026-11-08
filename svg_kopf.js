function locken(f,pts,r){
  return pts.map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'" fill="'+f.haar+'" '+ST+'/>'}).join('');
}
function bogen(R,r0,r1,n){
  var a=[],i,t;
  for(i=0;i<n;i++){t=(r0+(r1-r0)*i/(n-1))*Math.PI/180;a.push([+(100+R*Math.cos(t)).toFixed(1),+(90+R*Math.sin(t)).toFixed(1)])}
  return a;
}
function haarHinten(f){
  var p='',s='',fr=f.frisur,L=f.haarlaenge;
  if(L=='Glatze')return '';
  if(fr!='Zöpfe'){
    if(L=='Lang')p='M44 100 Q40 36 100 36 Q160 36 156 100 L164 180 Q100 195 36 180 Z';
    if(L=='Mittel')p='M44 100 Q40 36 100 36 Q160 36 156 100 L158 142 L42 142 Z';
  }
  if(p)s+='<path d="'+p+'" fill="'+f.haar+'" '+ST+'/>';
  if(fr=='Locken'){
    if(L=='Lang')s+=locken(f,[[44,128],[38,150],[48,170],[156,128],[162,150],[152,170]],14);
    if(L=='Mittel')s+=locken(f,[[44,124],[48,142],[156,124],[152,142]],13);
  }
  if(fr=='Zöpfe')s+='<ellipse cx="36" cy="136" rx="13" ry="30" fill="'+f.haar+'" '+ST+' transform="rotate(18 36 136)"/><ellipse cx="164" cy="136" rx="13" ry="30" fill="'+f.haar+'" '+ST+' transform="rotate(-18 164 136)"/><circle cx="46" cy="108" r="6" fill="#e63946" '+ST+'/><circle cx="154" cy="108" r="6" fill="#e63946" '+ST+'/>';
  if(fr=='Dutt')s+='<circle cx="100" cy="30" r="20" fill="'+f.haar+'" '+ST+'/><rect x="88" y="44" width="24" height="7" rx="3" fill="#e63946"/>';
  return s;
}
function haarVorn(f){
  var L=f.haarlaenge,fr=f.frisur,h=f.haar;
  if(L=='Glatze')return '';
  var s='';
  if(fr=='Stachelig')s='<path d="M44 98 L38 62 L56 56 L58 30 L78 46 L100 20 L122 46 L142 30 L144 56 L162 62 L156 98 Q144 64 100 60 Q56 64 44 98 Z" fill="'+h+'" '+ST+'/>';
  else s='<path d="M44 98 Q42 38 100 38 Q158 38 156 98 Q144 64 100 60 Q56 64 44 98 Z" fill="'+h+'" '+ST+'/>';
  if(fr=='Locken')s+=locken(f,bogen(54,190,350,9),12);
  s+='<path d="M62 66 Q78 50 102 50" stroke="#fff" stroke-opacity=".4" stroke-width="5" fill="none" stroke-linecap="round"/>';
  return s;
}
function roboterHinten(f){
  return '<line x1="100" y1="46" x2="100" y2="20" stroke="#555" stroke-width="5"/><circle cx="100" cy="18" r="9" fill="#e63946" '+ST+'/><circle cx="97" cy="15" r="2.5" fill="#fff" opacity=".7"/>';
}
function ohren(f,haut){
  if(f.art=='Mensch')return '<ellipse cx="44" cy="104" rx="9" ry="13" fill="'+haut+'" '+ST+'/><ellipse cx="45" cy="105" rx="4" ry="7" fill="'+dk(haut,0.85)+'"/><ellipse cx="156" cy="104" rx="9" ry="13" fill="'+haut+'" '+ST+'/><ellipse cx="155" cy="105" rx="4" ry="7" fill="'+dk(haut,0.85)+'"/>';
  if(f.art=='Roboter')return '<rect x="32" y="86" width="16" height="30" rx="5" fill="#78909c" '+ST+'/><rect x="152" y="86" width="16" height="30" rx="5" fill="#78909c" '+ST+'/><circle cx="40" cy="101" r="3" fill="#455a64"/><circle cx="160" cy="101" r="3" fill="#455a64"/>';
  return '';
}
function kopf(f,haut){
  var R=f.art=='Roboter',s;
  if(R)s='<rect x="44" y="46" width="112" height="100" rx="20" fill="'+haut+'" '+ST+'/><rect x="44" y="46" width="112" height="100" rx="20" fill="url(#hl)"/><rect x="82" y="54" width="36" height="8" rx="4" fill="#37474f"/><circle cx="90" cy="58" r="2" fill="#ff6b6b"/><circle cx="100" cy="58" r="2" fill="#ffd23f"/><circle cx="110" cy="58" r="2" fill="#06d6a0"/>';
  else s='<circle cx="100" cy="100" r="56" fill="'+haut+'" '+ST+'/>';
  if(f.art=='Mensch')s+='<circle cx="100" cy="100" r="56" fill="url(#hl)"/><path d="M100 104 Q94 113 101 114" stroke="#0006" stroke-width="3" fill="none" stroke-linecap="round"/>';
  else if(!R)s+=tierGesicht(f)+'<circle cx="100" cy="100" r="56" fill="url(#hl)"/>';
  return s;
}
function sommer(f){
  if(f.art!='Mensch'||f.sommer!='Ja')return '';
  var p=[[70,108],[76,113],[84,110],[116,110],[124,113],[130,108],[90,114],[110,114]],s='';
  p.forEach(function(q){s+='<circle cx="'+q[0]+'" cy="'+q[1]+'" r="1.8" fill="#8d5524" opacity=".7"/>'});
  return s;
}
function bart(f){
  if(f.art!='Mensch'||f.bart=='Keiner'||f.alter=='Kind')return '';
  var h=f.haar;
  if(f.bart=='Schnurrbart')return '<path d="M100 118 Q88 112 76 120 Q86 128 100 122 Q114 128 124 120 Q112 112 100 118Z" fill="'+h+'" '+ST+'/>';
  return '<path d="M46 108 Q46 160 100 164 Q154 160 154 108 Q146 138 128 140 Q114 132 100 134 Q86 132 72 140 Q54 138 46 108Z" fill="'+h+'" '+ST+'/><path d="M100 118 Q88 112 76 120 Q86 128 100 122 Q114 128 124 120 Q112 112 100 118Z" fill="'+h+'" '+ST+'/>';
}
function extras(f){
  var e=f.extra;
  if(e=='Hut')return '<rect x="68" y="22" width="64" height="26" rx="8" fill="#6d4c41" '+ST+'/><rect x="50" y="44" width="100" height="9" rx="4" fill="#6d4c41" '+ST+'/><rect x="68" y="38" width="64" height="6" fill="#e63946"/>';
  if(e=='Mütze')return '<path d="M46 84 Q44 30 100 28 Q156 30 154 84 Z" fill="#e63946" '+ST+'/><rect x="43" y="74" width="114" height="15" rx="7" fill="#fff" '+ST+'/><circle cx="100" cy="26" r="10" fill="#fff" '+ST+'/>';
  if(e=='Krone')return '<polygon points="64,50 68,20 85,38 100,14 115,38 132,20 136,50" fill="#ffd23f" '+ST+'/><circle cx="100" cy="36" r="4" fill="#e63946"/><circle cx="80" cy="42" r="3" fill="#3a86ff"/><circle cx="120" cy="42" r="3" fill="#06d6a0"/>';
  if(e=='Brille')return '<circle cx="78" cy="95" r="17" fill="#cfe9ff" fill-opacity=".25" stroke="#111" stroke-width="4"/><circle cx="122" cy="95" r="17" fill="#cfe9ff" fill-opacity=".25" stroke="#111" stroke-width="4"/><line x1="95" y1="95" x2="105" y2="95" stroke="#111" stroke-width="4"/>';
  if(e=='Sonnenbrille')return '<ellipse cx="78" cy="95" rx="18" ry="13" fill="#111"/><ellipse cx="122" cy="95" rx="18" ry="13" fill="#111"/><line x1="95" y1="93" x2="105" y2="93" stroke="#111" stroke-width="4"/><path d="M68 90 l8 -4 M72 96 l10 -5" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>';
  if(e=='Schleife')return '<polygon points="140,46 168,32 168,60" fill="#ff4d8d" '+ST+'/><polygon points="140,46 112,32 112,60" fill="#ff4d8d" '+ST+'/><circle cx="140" cy="46" r="7" fill="#c2185b"/>';
  if(e=='Halsband')return '<path d="M60 140 Q100 176 140 140" stroke="#e63946" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="100" cy="162" r="7" fill="#ffd23f" '+ST+'/>';
  if(e=='Kopfhörer')return '<path d="M46 100 Q46 28 100 28 Q154 28 154 100" stroke="#333" stroke-width="8" fill="none"/><rect x="34" y="86" width="17" height="32" rx="7" fill="#e63946" '+ST+'/><rect x="149" y="86" width="17" height="32" rx="7" fill="#e63946" '+ST+'/>';
  return '';
}
