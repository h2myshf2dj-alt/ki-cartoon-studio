function dk(h,p){
  var n=parseInt(h.slice(1),16);
  function m(v){return Math.round(v*p)}
  return 'rgb('+m(n>>16)+','+m((n>>8)&255)+','+m(n&255)+')';
}
function ov(cx,cy,rx,ry,rot,fill){
  return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'" '+ST+' transform="rotate('+rot+' '+cx+' '+cy+')"/>';
}
function po(p,fill){return '<polygon points="'+p+'" fill="'+fill+'" '+ST+'/>'}
function ci(cx,cy,r,fill){return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+fill+'" '+ST+'/>'}
function pa(d,fill){return '<path d="'+d+'" fill="'+fill+'" '+ST+'/>'}
function katze(r){return r=='Hauskatze'||r=='Getigerte Katze'||r=='Schwarze Katze'}

function tierHinten(f){
  var c=f.fell,r=f.rasse,d=dk(c,0.8),s='';
  if(r=='Labrador')s=ov(46,92,16,34,15,d)+ov(154,92,16,34,-15,d);
  if(r=='Golden Retriever')s=ov(44,108,18,42,10,d)+ov(156,108,18,42,-10,d)+ov(40,146,10,8,0,d)+ov(160,146,10,8,0,d);
  if(r=='Husky')s=po('50,80 54,10 98,48',c)+po('150,80 146,10 102,48',c)+po('60,70 61,30 84,50','#f1e6e6')+po('140,70 139,30 116,50','#f1e6e6');
  if(r=='Border Collie')s=pa('M46 86 Q34 34 64 18 Q76 40 96 48 Z',c)+pa('M154 86 Q166 34 136 18 Q124 40 104 48 Z',c);
  if(r=='Beagle')s=ov(42,112,16,44,8,'#7a4a21')+ov(158,112,16,44,-8,'#7a4a21');
  if(r=='Dackel')s=ov(44,115,17,50,6,d)+ov(156,115,17,50,-6,d);
  if(r=='Schäferhund')s=po('48,72 52,8 94,46',d)+po('152,72 148,8 106,46',d);
  if(r=='Dalmatiner')s=ov(46,92,16,34,15,'#333')+ov(154,92,16,34,-15,'#333');
  if(r=='Pudel')s=ci(38,100,26,c)+ci(162,100,26,c)+ci(100,40,28,c);
  if(r=='Mops')s=po('50,78 36,44 80,58','#2b2b2b')+po('150,78 164,44 120,58','#2b2b2b');
  if(r=='Corgi')s=ov(58,40,18,32,-14,c)+ov(58,44,9,22,-14,'#ffb3c6')+ov(142,40,18,32,14,c)+ov(142,44,9,22,14,'#ffb3c6');
  if(r=='Bulldogge')s=ov(56,62,15,11,-30,d)+ov(144,62,15,11,30,d);
  if(katze(r))s=po('48,72 54,16 92,48',c)+po('152,72 146,16 108,48',c)+po('58,62 58,32 80,48','#ffb3c6')+po('142,62 142,32 120,48','#ffb3c6');
  if(r=='Siamkatze')s=po('48,72 54,16 92,48','#5a3a2e')+po('152,72 146,16 108,48','#5a3a2e')+po('58,62 58,32 80,48','#ffb3c6')+po('142,62 142,32 120,48','#ffb3c6');
  if(r=='Perserkatze')s=po('52,68 56,32 86,50',c)+po('148,68 144,32 114,50',c);
  if(r=='Stehohren')s=ov(76,38,13,36,-5,c)+ov(76,40,6,26,-5,'#ffb3c6')+ov(124,38,13,36,5,c)+ov(124,40,6,26,5,'#ffb3c6');
  if(r=='Hängeohren')s=ov(44,115,15,46,10,c)+ov(156,115,15,46,-10,c);
  return s;
}
function tierGesicht(f){
  var c=f.fell,r=f.rasse,s='',A=f.art,D=A=='Hund',fn='#ff8fab',nase='#333';
  var blazeW='<path d="M100 48 Q91 48 91 64 L89 104 L111 104 L109 64 Q109 48 100 48Z" fill="#fff"/>';
  if(r=='Husky')s+='<ellipse cx="100" cy="122" rx="40" ry="32" fill="#fff"/><ellipse cx="66" cy="116" rx="16" ry="24" fill="#fff"/><ellipse cx="134" cy="116" rx="16" ry="24" fill="#fff"/><path d="M100 46 L90 80 L110 80Z" fill="#fff"/><ellipse cx="78" cy="76" rx="8" ry="5" fill="#fff"/><ellipse cx="122" cy="76" rx="8" ry="5" fill="#fff"/>';
  else if(r=='Border Collie')s+=blazeW+'<ellipse cx="100" cy="122" rx="28" ry="23" fill="#fff"/>';
  else if(r=='Corgi')s+=blazeW+'<ellipse cx="100" cy="121" rx="32" ry="25" fill="#fff"/>';
  else if(r=='Beagle')s+='<ellipse cx="62" cy="78" rx="24" ry="27" fill="#7a4a21" transform="rotate(-15 62 78)"/><ellipse cx="138" cy="78" rx="24" ry="27" fill="#7a4a21" transform="rotate(15 138 78)"/><ellipse cx="100" cy="120" rx="26" ry="19" fill="#fff" opacity=".6"/>';
  else if(r=='Mops'){s+='<ellipse cx="100" cy="118" rx="35" ry="27" fill="#2b2b2b"/>';nase='#000'}
  else if(r=='Bulldogge'){s+='<ellipse cx="66" cy="134" rx="19" ry="14" fill="'+dk(c,1.08)+'" '+ST+'/><ellipse cx="134" cy="134" rx="19" ry="14" fill="'+dk(c,1.08)+'" '+ST+'/><ellipse cx="100" cy="118" rx="28" ry="20" fill="#fff" opacity=".55"/>'}
  else if(r=='Schäferhund')s+='<ellipse cx="100" cy="112" rx="28" ry="24" fill="'+dk(c,0.55)+'"/>';
  else if(r=='Siamkatze')s+='<ellipse cx="100" cy="116" rx="32" ry="26" fill="#6b4a3a" opacity="0.6"/>';
  else s+='<ellipse cx="100" cy="118" rx="24" ry="17" fill="#fff" opacity="0.5"/>';
  if(r=='Mops'||r=='Bulldogge')s+='<path d="M74 62 Q100 52 126 62 M80 70 Q100 62 120 70" stroke="'+dk(c,0.6)+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  if(r=='Dalmatiner')s+=ci(66,68,7,'#222')+ci(132,72,8,'#222')+ci(100,62,5,'#222')+ci(58,116,5,'#222')+ci(142,122,6,'#222');
  if(r=='Hauskatze'||r=='Getigerte Katze')s+='<path d="M100 46 V62 M88 48 L90 62 M112 48 L110 62" stroke="'+dk(c,0.6)+'" stroke-width="4" stroke-linecap="round"/>';
  if(r=='Getigerte Katze')s+='<path d="M48 100 H64 M50 110 H66 M152 100 H136 M150 110 H134" stroke="'+dk(c,0.6)+'" stroke-width="3.5" stroke-linecap="round"/>';
  if(r=='Perserkatze')s+=ci(52,116,18,c)+ci(148,116,18,c);
  if(katze(r)||r=='Siamkatze'||r=='Perserkatze')s+='<polygon points="94,108 106,108 100,116" fill="'+fn+'"/><path d="M100 116 V122" stroke="#333" stroke-width="2.5"/>';
  else if(A=='Hase')s+='<ellipse cx="100" cy="110" rx="7" ry="5" fill="'+fn+'"/><path d="M100 115 V122" stroke="#333" stroke-width="2.5"/>';
  else{
    var big=(r=='Mops'||r=='Bulldogge');
    s+='<ellipse cx="100" cy="'+(big?112:110)+'" rx="'+(big?13:10)+'" ry="'+(big?9:7)+'" fill="'+nase+'"/><ellipse cx="'+(big?96:97)+'" cy="108" rx="3.5" ry="2" fill="#fff" opacity=".55"/><path d="M100 118 V127" stroke="'+(r=='Mops'?'#fff6':'#333')+'" stroke-width="2.5"/>';
    [[84,117],[80,121],[86,122],[116,117],[120,121],[114,122]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="1.3" fill="#0006"/>'});
  }
  if(A!='Hund')s+='<path d="M70 118 L40 112 M70 124 L40 126 M130 118 L160 112 M130 124 L160 126" stroke="#333" stroke-width="2" stroke-linecap="round"/>';
  return s;
}
