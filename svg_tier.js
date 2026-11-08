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

function tierHinten(f){
  var c=f.fell,r=f.rasse,d=dk(c,0.8),s='';
  if(r=='Labrador')s=ov(46,92,16,34,15,d)+ov(154,92,16,34,-15,d);
  if(r=='Dackel')s=ov(44,115,17,50,6,d)+ov(156,115,17,50,-6,d);
  if(r=='Schäferhund')s=po('48,72 52,8 94,46',d)+po('152,72 148,8 106,46',d);
  if(r=='Dalmatiner')s=ov(46,92,16,34,15,'#333')+ov(154,92,16,34,-15,'#333');
  if(r=='Pudel')s=ci(38,100,26,c)+ci(162,100,26,c)+ci(100,40,28,c);
  if(r=='Hauskatze')s=po('48,72 54,16 92,48',c)+po('152,72 146,16 108,48',c);
  if(r=='Siamkatze')s=po('48,72 54,16 92,48','#5a3a2e')+po('152,72 146,16 108,48','#5a3a2e');
  if(r=='Perserkatze')s=po('52,68 56,32 86,50',c)+po('148,68 144,32 114,50',c);
  if(r=='Stehohren')s=ov(76,38,13,36,-5,c)+ov(76,40,6,26,-5,'#ffb3c6')+ov(124,38,13,36,5,c)+ov(124,40,6,26,5,'#ffb3c6');
  if(r=='Hängeohren')s=ov(44,115,15,46,10,c)+ov(156,115,15,46,-10,c);
  return s;
}
function tierGesicht(f){
  var c=f.fell,r=f.rasse,s='';
  if(r=='Schäferhund')s+='<ellipse cx="100" cy="112" rx="28" ry="24" fill="'+dk(c,0.55)+'"/>';
  else if(r=='Siamkatze')s+='<ellipse cx="100" cy="116" rx="32" ry="26" fill="#6b4a3a" opacity="0.6"/>';
  else s+='<ellipse cx="100" cy="118" rx="24" ry="17" fill="#fff" opacity="0.5"/>';
  if(r=='Dalmatiner')s+=ci(66,68,7,'#222')+ci(132,72,8,'#222')+ci(100,62,5,'#222')+ci(58,116,5,'#222')+ci(142,122,6,'#222');
  if(r=='Hauskatze')s+='<path d="M100 46 V62 M88 48 L90 62 M112 48 L110 62" stroke="'+dk(c,0.6)+'" stroke-width="4" stroke-linecap="round"/>';
  if(r=='Perserkatze')s+=ci(52,116,18,c)+ci(148,116,18,c);
  if(f.art=='Katze')s+='<polygon points="94,108 106,108 100,116" fill="#ff8fab"/>';
  else if(f.art=='Hase')s+='<ellipse cx="100" cy="110" rx="7" ry="5" fill="#ff8fab"/>';
  else s+='<ellipse cx="100" cy="110" rx="10" ry="7" fill="#333"/>';
  if(f.art!='Hund')s+='<path d="M70 118 L40 112 M70 124 L40 126 M130 118 L160 112 M130 124 L160 126" stroke="#333" stroke-width="2" stroke-linecap="round"/>';
  return s;
}
