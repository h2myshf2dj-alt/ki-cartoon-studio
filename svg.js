function norm(f){
  var d={art:f.typ||'Mensch',geschl:'weiblich',alter:'Erwachsen',haut:'#f1c27d',haar:'#6b4423',haarlaenge:'Mittel',augen:'#5a3a1e',oberteil:'Shirt',kleid:'#3a86ff',rasse:'',fell:'#e0b25a',extra:'Keins',frisur:'Glatt',bart:'Keiner',sommer:'Nein',hose:'#3b5b92'};
  for(var k in f)d[k]=f[k];
  if(!d.rasse&&RASSEN[d.art])d.rasse=RASSEN[d.art][0];
  return d;
}
var ST='stroke="#0004" stroke-width="2"';
var DEFS='<defs><linearGradient id="sh" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient><radialGradient id="hl" cx=".35" cy=".28" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';

function koerper(f,bx,by,bw,bh,haut){
  var k=f.kleid,o=f.oberteil,ah=bh*0.6,ay=by+6,w=bx+bw,R=f.art=='Roboter';
  var lang=(o=='Pulli'||o=='Jacke'||o=='Streifenshirt'),ac=lang?k:haut,d=dk(k,0.7),s='',i;
  if(R)ac='#90a4ae';
  [bx-14,w-2].forEach(function(x){
    s+='<rect x="'+x+'" y="'+ay+'" width="16" height="'+ah+'" rx="8" fill="'+ac+'" '+ST+'/>';
    if(lang&&!R)s+='<rect x="'+x+'" y="'+(ay+ah-9)+'" width="16" height="9" rx="4" fill="'+d+'"/>';
    else if(!R)s+='<rect x="'+(x-1)+'" y="'+(ay-1)+'" width="18" height="19" rx="8" fill="'+k+'" '+ST+'/>';
  });
  if(o=='Kleid')s+='<path d="M'+bx+' '+by+' H'+w+' L'+(w+22)+' 225 H'+(bx-22)+' Z" fill="'+k+'" '+ST+'/><path d="M'+bx+' '+by+' H'+w+' L'+(w+22)+' 225 H'+(bx-22)+' Z" fill="url(#sh)"/>';
  else s+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="26" fill="'+k+'" '+ST+'/><rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="'+bh+'" rx="26" fill="url(#sh)"/>';
  s+='<circle cx="'+(bx-6)+'" cy="'+(ay+ah)+'" r="11" fill="'+haut+'" '+ST+'/><circle cx="'+(w+6)+'" cy="'+(ay+ah)+'" r="11" fill="'+haut+'" '+ST+'/>';
  if(R){
    s+='<rect x="'+(bx+10)+'" y="'+(by+20)+'" width="'+(bw-20)+'" height="'+Math.min(28,bh-30)+'" rx="6" fill="#37474f"/>';
    [0,1,2].forEach(function(j){s+='<circle cx="'+(100-12+j*12)+'" cy="'+(by+20+Math.min(28,bh-30)/2)+'" r="3.5" fill="'+['#e63946','#ffd23f','#06d6a0'][j]+'"/>'});
    return s;
  }
  var y=by+bh;
  if(o=='Shirt'){
    s+='<path d="M'+(bx+8)+' '+(y-9)+' H'+(w-8)+'" stroke="'+d+'" stroke-width="2" stroke-dasharray="4 3"/>';
    if(f.geschl=='männlich')s+='<rect x="'+(w-30)+'" y="'+(by+28)+'" width="17" height="15" rx="3" fill="none" stroke="'+d+'" stroke-width="2"/>';
    else s+='<polygon points="100,'+(by+30)+' 104,'+(by+39)+' 113,'+(by+39)+' 106,'+(by+45)+' 109,'+(by+54)+' 100,'+(by+48)+' 91,'+(by+54)+' 94,'+(by+45)+' 87,'+(by+39)+' 96,'+(by+39)+'" fill="#ffffffaa"/>';
  }
  if(o=='Streifenshirt')for(i=by+20;i<y-6;i+=13)s+='<rect x="'+(bx+3)+'" y="'+i+'" width="'+(bw-6)+'" height="6" fill="#fff" opacity=".65"/>';
  if(o=='Pulli'){
    s+='<rect x="'+bx+'" y="'+(y-12)+'" width="'+bw+'" height="12" rx="6" fill="'+d+'"/>';
    for(i=bx+8;i<w-4;i+=8)s+='<path d="M'+i+' '+(y-10)+' V'+(y-2)+'" stroke="#fff3" stroke-width="2"/>';
    s+='<path d="M'+(bx+10)+' '+(by+30)+' q8 -6 16 0 t16 0 t16 0" stroke="#fff4" stroke-width="3" fill="none"/>';
  }
  if(o=='Jacke'){
    s+='<path d="M100 '+(by+16)+' V'+y+'" stroke="'+d+'" stroke-width="3"/><circle cx="100" cy="'+(by+30)+'" r="4" fill="#ffd23f" '+ST+'/>';
    s+='<rect x="'+(bx+8)+'" y="'+(y-30)+'" width="16" height="14" rx="4" fill="none" stroke="'+d+'" stroke-width="2"/><rect x="'+(w-24)+'" y="'+(y-30)+'" width="16" height="14" rx="4" fill="none" stroke="'+d+'" stroke-width="2"/>';
    s+='<rect x="'+bx+'" y="'+(y-8)+'" width="'+bw+'" height="8" rx="4" fill="'+d+'"/>';
  }
  if(o=='Kleid'){
    var b=by+Math.min(30,bh-20);
    s+='<rect x="'+(bx+1)+'" y="'+b+'" width="'+(bw-2)+'" height="8" fill="'+d+'"/><rect x="94" y="'+(b-1)+'" width="12" height="10" rx="2" fill="#ffd23f" '+ST+'/>';
    s+='<path d="M'+(bx-20)+' 219 H'+(w+20)+'" stroke="#fff" stroke-width="3" stroke-dasharray="5 4" opacity=".75"/>';
    [-0.5,0,0.5].forEach(function(t){s+='<path d="M'+(100+t*bw*0.7)+' '+(b+10)+' L'+(100+t*(bw+34))+' 217" stroke="'+d+'" stroke-width="2" opacity=".5"/>'});
  }
  return s;
}
function beine(f,haut){
  var A=f.art,M=A=='Mensch',R=A=='Roboter',s='',c=M?(f.oberteil=='Kleid'?haut:f.hose):(R?'#78909c':f.fell);
  var d=dk(M?c:(R?'#78909c':f.fell),0.7);
  [[84,88],[102,112]].forEach(function(p,i){
    s+='<rect x="'+p[0]+'" y="212" width="14" height="22" rx="6" fill="'+c+'" '+ST+'/>';
    if(M)s+='<ellipse cx="'+(i?114:86)+'" cy="232" rx="13" ry="6.5" fill="#3a3a3a" '+ST+'/><path d="M'+(i?102:74)+' 235 H'+(i?126:98)+'" stroke="#fff" stroke-width="2" opacity=".6"/>';
    else if(R)s+='<rect x="'+(p[0]-6)+'" y="228" width="26" height="10" rx="4" fill="#455a64" '+ST+'/>';
    else{
      var rx=A=='Hase'?17:13;
      s+='<ellipse cx="'+p[1]+'" cy="231.5" rx="'+rx+'" ry="7" fill="'+c+'" '+ST+'/>';
      if(A!='Hase')s+='<path d="M'+(p[1]-4)+' 231 v5 M'+p[1]+' 230 v6 M'+(p[1]+4)+' 231 v5" stroke="'+d+'" stroke-width="1.6" stroke-linecap="round"/>';
    }
  });
  return s;
}
function schwanz(f){
  var c=f.fell,A=f.art,d=dk(c,0.7);
  function bahn(p,w){return '<path d="'+p+'" stroke="'+d+'" stroke-width="'+(w+3)+'" fill="none" stroke-linecap="round"/><path d="'+p+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>'}
  if(A=='Hund'){
    var r=f.rasse;
    if(r=='Husky'||r=='Corgi'||r=='Pudel')return bahn('M126 206 Q168 200 156 160',16);
    if(r=='Mops')return bahn('M128 208 Q150 214 148 196 Q146 186 156 190',8);
    return bahn('M126 206 Q170 196 160 156',11);
  }
  if(A=='Katze')return bahn('M126 210 Q176 218 170 178 Q166 156 150 160',11);
  if(A=='Hase')return '<circle cx="138" cy="208" r="14" fill="#fff" '+ST+'/>';
  return '';
}
function svg(f){
  f=norm(f);
  var K=f.alter=='Kind',M=f.art=='Mensch',R=f.art=='Roboter';
  var T='<g transform="'+(K?'translate(100 128) scale(1.12) translate(-100 -100)':'')+'">';
  var haut=M?f.haut:f.fell;
  var bw=K?64:(f.geschl=='männlich'?84:74),bx=100-bw/2,by=K?175:140,bh=K?50:85;
  var s='<svg viewBox="0 0 200 240">'+DEFS+'<ellipse cx="100" cy="236" rx="58" ry="5" fill="#000" opacity=".12"/>'+schwanz(f)+beine(f,haut);
  s+=T+(M?haarHinten(f):R?roboterHinten(f):tierHinten(f))+'</g>';
  s+=koerper(f,bx,by,bw,bh,haut);
  s+=T+ohren(f,haut)+kopf(f,haut)+wangen(f)+augen(f)+brauen(f)+sommer(f)+bart(f)+mundSvg(f);
  if(M)s+=haarVorn(f);
  return s+extras(f)+'</g></svg>';
}
