var MIMIK=['neutral','froh','traurig','wuetend','erstaunt','angst','verliebt','muede','nachdenklich'];
var KO='#2b1a12';
function mk(f){return f.mimik||'neutral'}
function hautF(f){return f.art=='Mensch'?f.haut:f.fell}
function wangen(f){
  var m=mk(f),o=0;
  if(f.art=='Roboter')return '';
  if(f.geschl=='weiblich'||f.alter=='Kind')o=0.3;
  if(m=='verliebt'||m=='froh')o=0.45;
  var c='#ff5c8a';if(m=='wuetend'){o=0.5;c='#e63946'}
  return o?'<circle cx="64" cy="114" r="9" fill="'+c+'" opacity="'+o+'"/><circle cx="136" cy="114" r="9" fill="'+c+'" opacity="'+o+'"/>':'';
}
function augen(f){
  var m=mk(f),a='',R=f.art=='Roboter',hc=hautF(f),bl=f.blick||0;
  [78,122].forEach(function(x,i){
    var L=i==0;
    if(f.blink&&m!='verliebt'){a+='<path d="M'+(x-12)+' 97 Q'+x+' 106 '+(x+12)+' 97" stroke="'+KO+'" stroke-width="4" fill="none" stroke-linecap="round"/>';return}
    if(m=='verliebt'){a+='<path transform="translate('+x+' 96) scale(1.35)" d="M0 8 C-18 -4 -9 -17 0 -7 C9 -17 18 -4 0 8Z" fill="#ff3860" stroke="#b0123a" stroke-width="1.5"/><circle cx="'+(x-4)+'" cy="91" r="2" fill="#fff"/>';return}
    var rw=m=='erstaunt'?15:12,ri=m=='erstaunt'?5.5:7.5,rp=(m=='erstaunt'||m=='angst')?2.6:3.8;
    var ox=bl*3+(m=='nachdenklich'?3:0),oy=m=='nachdenklich'?-3:0;
    a+='<circle cx="'+x+'" cy="95" r="'+rw+'" fill="#fff" stroke="'+KO+'" stroke-opacity=".6" stroke-width="1.8"/>';
    a+='<circle cx="'+(x+ox)+'" cy="'+(96+oy)+'" r="'+ri+'" fill="'+f.augen+'"/><circle cx="'+(x+ox)+'" cy="'+(96+oy)+'" r="'+rp+'" fill="#111"/><circle cx="'+(x+ox+3)+'" cy="'+(92+oy)+'" r="2.2" fill="#fff"/>';
    if(m=='wuetend'){
      a+='<polygon points="'+(L?(x-14)+',77 '+(x+14)+',77 '+(x+14)+',93':(x+14)+',77 '+(x-14)+',77 '+(x-14)+',93')+'" fill="'+hc+'"/><line x1="'+(L?x-13:x+13)+'" y1="78" x2="'+(L?x+13:x-13)+'" y2="93" stroke="'+KO+'" stroke-width="3.5" stroke-linecap="round"/>';
    }
    if(m=='traurig'){
      a+='<polygon points="'+(L?(x-14)+',78 '+(x+14)+',78 '+(x-14)+',94':(x+14)+',78 '+(x-14)+',78 '+(x+14)+',94')+'" fill="'+hc+'"/><line x1="'+(L?x+13:x-13)+'" y1="78" x2="'+(L?x-13:x+13)+'" y2="94" stroke="'+KO+'" stroke-width="3.5" stroke-linecap="round"/>';
    }
    if(m=='muede')a+='<path d="M'+(x-13)+' 95 A13 13 0 0 1 '+(x+13)+' 95 Z" fill="'+hc+'"/><line x1="'+(x-13)+'" y1="95" x2="'+(x+13)+'" y2="95" stroke="'+KO+'" stroke-width="3.5" stroke-linecap="round"/>';
  });
  if(f.geschl=='weiblich'&&!R&&!f.blink)a+='<path d="M66 88 L59 84 M70 83 L66 76 M134 88 L141 84 M130 83 L134 76" stroke="#111" stroke-width="3" stroke-linecap="round"/>';
  return a;
}
var BRAUEN={neutral:['M65 79 Q78 71 91 78','M109 78 Q122 71 135 79'],froh:['M65 74 Q78 65 91 73','M109 73 Q122 65 135 74'],traurig:['M65 83 Q78 79 91 71','M109 71 Q122 79 135 83'],wuetend:['M65 72 L91 84','M109 84 L135 72'],erstaunt:['M64 68 Q78 58 92 66','M108 66 Q122 58 136 68'],angst:['M65 78 Q78 68 91 64','M109 64 Q122 68 135 78'],verliebt:['M65 74 Q78 66 91 73','M109 73 Q122 66 135 74'],muede:['M65 84 Q78 87 91 85','M109 85 Q122 87 135 84'],nachdenklich:['M65 72 Q78 63 91 70','M109 80 Q122 77 135 80']};
function brauen(f){
  var m=mk(f),A=f.art;
  if(A=='Roboter'||(A!='Mensch'&&m=='neutral'))return '';
  var c=A=='Mensch'?dk(f.haar,0.7):dk(f.fell,0.5),w=(A=='Mensch'&&f.geschl=='männlich')?5.5:(A=='Mensch'?3.5:4);
  if(m=='wuetend')w+=1.5;
  var b=BRAUEN[m]||BRAUEN.neutral;
  return '<path d="'+b[0]+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/><path d="'+b[1]+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>';
}
function offen(cx,cy,rx,ry){
  return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#7a1f2b" stroke="'+KO+'" stroke-width="3"/><ellipse cx="'+cx+'" cy="'+(cy+ry*0.5)+'" rx="'+(rx*0.55)+'" ry="'+(ry*0.4)+'" fill="#ff8fab"/>';
}
function mundSvg(f){
  var m=mk(f),L=f.mund===true?2:(+f.mund||0),D=f.art=='Hund',s='',i;
  if(f.art=='Roboter'){
    s='<rect x="76" y="120" width="48" height="20" rx="6" fill="#37474f" '+ST+'/>';
    for(i=0;i<5;i++){var a=L&&i%2;s+='<rect x="'+(81+i*9)+'" y="'+(a?123:125)+'" width="5" height="'+(a?14:10)+'" rx="2" fill="'+(L?'#ffe066':'#90a4ae')+'"/>'}
    return s;
  }
  var rx=[0,9,11,13][L],ry=[0,5,9,13][L];
  if(m=='erstaunt')return offen(100,137,7+L*1.5,9+L*2.5);
  if(L>0){
    if(m=='wuetend')return offen(100,134,rx+1,ry*0.8)+'<path d="M'+(99-rx)+' '+(134-ry*0.55)+' H'+(101+rx)+'" stroke="#fff" stroke-width="4"/>';
    if(m=='traurig')return offen(100,138,rx*0.8,ry*0.8);
    if(m=='angst')return offen(100,136,rx*0.85,ry*0.9);
    if(m=='muede')return offen(100,136,rx*0.7,ry*1.2);
    if(m=='froh')return '<path d="M76 124 Q100 '+(150+L*4)+' 124 124 Z" fill="#7a1f2b" stroke="'+KO+'" stroke-width="3.5" stroke-linejoin="round"/><path d="M80 125 Q100 133 120 125 L119 129 Q100 137 81 129Z" fill="#fff"/><ellipse cx="100" cy="'+(140+L)+'" rx="10" ry="5" fill="#ff8fab"/>';
    return offen(100,134,rx,ry);
  }
  if(D&&(m=='neutral'||m=='froh'||m=='verliebt'))s+='<ellipse cx="100" cy="141" rx="6" ry="7" fill="#ff6b8b" '+ST+'/>';
  var P={neutral:'M82 126 Q100 144 118 126',verliebt:'M84 128 Q100 144 116 128',traurig:'M84 139 Q100 124 116 139',wuetend:'M82 133 H118',angst:'M80 134 q5 -7 10 0 t10 0 t10 0 t10 0',muede:'M91 133 H109',nachdenklich:'M86 134 Q100 127 114 132'};
  if(m=='froh')return s+'<path d="M76 124 Q100 156 124 124 Z" fill="#7a1f2b" stroke="'+KO+'" stroke-width="3.5" stroke-linejoin="round"/><path d="M80 125 Q100 133 120 125 L119 129 Q100 137 81 129Z" fill="#fff"/>';
  if(m=='wuetend')s+='<path d="M84 133 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5" stroke="#fff" stroke-width="3" fill="none" stroke-linejoin="round"/>';
  return s+'<path d="'+(P[m]||P.neutral)+'" stroke="'+KO+'" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
}
function deko(f){
  var m=mk(f),s='';
  if(m=='traurig')s+='<path d="M68 106 q-6 10 0 13 q6 -3 0 -13z M132 106 q-6 10 0 13 q6 -3 0 -13z" fill="#6ec6ff" stroke="#2b8fd6" stroke-width="1.5"/>';
  if(m=='angst')s+='<path d="M152 62 q-8 14 0 18 q8 -4 0 -18z" fill="#6ec6ff" stroke="#2b8fd6" stroke-width="1.5"/>';
  if(m=='wuetend')s+='<path d="M136 50 q6 2 8 8 M150 50 q-6 2 -8 8 M136 70 q6 -2 8 -8 M150 70 q-6 -2 -8 -8" stroke="#e63946" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  if(m=='muede')s+='<path d="M66 108 Q78 114 90 108 M110 108 Q122 114 134 108" stroke="#0004" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
  return s;
}
