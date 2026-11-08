var TYPEN=['Hund','Hase','Katze','Roboter','Mensch'];
var FELL=['#c68642','#ffffff','#9e9e9e','#ffb703','#5a3a1e','#ff8fab'];
var KLEID=['#3a86ff','#e63946','#06a77d','#8338ec','#ffb703','#222222'];
var EXTRA=['Keins','Hut','Brille','Schleife'];

function svg(f){
  var s='<svg viewBox="0 0 200 240">';
  var r='stroke="#0004" stroke-width="2"';
  if(f.typ=='Mensch')s+='<ellipse cx="100" cy="62" rx="62" ry="40" fill="#4a2c17"/>';
  if(f.typ=='Hund'){
    s+='<ellipse cx="46" cy="88" rx="16" ry="34" fill="'+f.fell+'" '+r+' transform="rotate(15 46 88)"/>';
    s+='<ellipse cx="154" cy="88" rx="16" ry="34" fill="'+f.fell+'" '+r+' transform="rotate(-15 154 88)"/>';
  }
  if(f.typ=='Hase'){
    s+='<ellipse cx="75" cy="30" rx="14" ry="42" fill="'+f.fell+'" '+r+'/>';
    s+='<ellipse cx="125" cy="30" rx="14" ry="42" fill="'+f.fell+'" '+r+'/>';
  }
  if(f.typ=='Katze'){
    s+='<polygon points="48,70 56,14 92,48" fill="'+f.fell+'" '+r+'/>';
    s+='<polygon points="152,70 144,14 108,48" fill="'+f.fell+'" '+r+'/>';
  }
  if(f.typ=='Roboter'){
    s+='<line x1="100" y1="52" x2="100" y2="22" stroke="#555" stroke-width="5"/><circle cx="100" cy="20" r="9" fill="#e63946"/>';
  }
  s+='<rect x="60" y="140" width="80" height="85" rx="30" fill="'+f.kleid+'" '+r+'/>';
  s+='<circle cx="52" cy="185" r="13" fill="'+f.fell+'" '+r+'/><circle cx="148" cy="185" r="13" fill="'+f.fell+'" '+r+'/>';
  if(f.typ=='Roboter')s+='<rect x="42" y="50" width="116" height="98" rx="20" fill="#b0bec5" '+r+'/>';
  else s+='<circle cx="100" cy="100" r="58" fill="'+f.fell+'" '+r+'/>';
  s+='<circle cx="78" cy="95" r="12" fill="#fff"/><circle cx="122" cy="95" r="12" fill="#fff"/>';
  s+='<circle cx="80" cy="96" r="6" fill="#111"/><circle cx="120" cy="96" r="6" fill="#111"/>';
  if(f.typ=='Hund'||f.typ=='Hase'||f.typ=='Katze')s+='<ellipse cx="100" cy="113" rx="9" ry="6" fill="#333"/>';
  s+='<path d="M80 126 Q100 146 120 126" stroke="#333" stroke-width="4" fill="none" stroke-linecap="round"/>';
  if(f.extra=='Hut')s+='<rect x="68" y="26" width="64" height="26" rx="8" fill="#6d4c41"/><rect x="50" y="48" width="100" height="9" rx="4" fill="#6d4c41"/>';
  if(f.extra=='Brille')s+='<circle cx="78" cy="95" r="17" fill="none" stroke="#111" stroke-width="4"/><circle cx="122" cy="95" r="17" fill="none" stroke="#111" stroke-width="4"/><line x1="95" y1="95" x2="105" y2="95" stroke="#111" stroke-width="4"/>';
  if(f.extra=='Schleife')s+='<polygon points="140,50 168,36 168,64" fill="#ff4d8d"/><polygon points="140,50 112,36 112,64" fill="#ff4d8d"/><circle cx="140" cy="50" r="7" fill="#c2185b"/>';
  return s+'</svg>';
}
