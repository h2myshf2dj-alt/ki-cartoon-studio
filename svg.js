function norm(f){
  var d={art:f.typ||'Mensch',geschl:'weiblich',alter:'Erwachsen',haut:'#f1c27d',haar:'#6b4423',haarlaenge:'Mittel',augen:'#5a3a1e',oberteil:'Shirt',kleid:'#3a86ff',rasse:'',fell:'#e0b25a',extra:'Keins',kopf:'Rund',frisur:'Glatt',bart:'Keiner',sommer:'Nein',hose:'#3b5b92'};
  for(var k in f)d[k]=f[k];
  if(!d.rasse&&RASSEN[d.art])d.rasse=RASSEN[d.art][0];
  return d;
}
var ST='stroke="#2b1a12" stroke-opacity=".8" stroke-width="2.6" stroke-linejoin="round"';
var DEFS='<defs><linearGradient id="sh" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient><radialGradient id="hl" cx=".35" cy=".28" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>';

function geo(f){
  var K=f.alter=='Kind',M=f.geschl=='männlich',H=f.art=='Mensch';
  if(H&&K)return {chin:126,hs:0.66,neck:1,top:130,bot:172,tw:28,bw:26,wv:24,armX:33,armL:36,hand:8,legTop:168,legW:11,gap:3,hem:202,sh:10};
  if(H&&M)return {chin:92,hs:0.6,neck:1,top:98,bot:160,tw:44,bw:34,wv:33,armX:50,armL:56,hand:10,legTop:156,legW:17,gap:2,hem:206,sh:14};
  if(H)return {chin:92,hs:0.6,neck:1,top:98,bot:160,tw:28,bw:29,wv:20,armX:35,armL:52,hand:9,legTop:156,legW:12,gap:3,hem:206,sh:12};
  if(K)return {chin:174,hs:1,top:168,bot:202,tw:26,bw:24,wv:24,armX:31,armL:24,hand:9,legTop:198,legW:11,gap:3,hem:214,sh:10};
  if(M)return {chin:148,hs:0.92,top:140,bot:196,tw:46,bw:36,wv:36,armX:52,armL:46,hand:11,legTop:190,legW:16,gap:2,hem:208,sh:14};
  return {chin:148,hs:0.92,top:140,bot:196,tw:33,bw:35,wv:25,armX:39,armL:42,hand:10,legTop:190,legW:13,gap:3,hem:208,sh:12};
}
function rumpfPfad(G,kleid){
  var c=100,t=G.top,b=G.bot,w=(t+b)/2+6;
  if(kleid)return 'M'+(c-G.tw+4)+' '+(t+4)+' Q'+(c-G.tw+4)+' '+t+' '+(c-G.tw+12)+' '+t+' H'+(c+G.tw-12)+' Q'+(c+G.tw-4)+' '+t+' '+(c+G.tw-4)+' '+(t+4)+' L'+(c+G.wv)+' '+w+' L'+(c+G.bw+14)+' '+G.hem+' H'+(c-G.bw-14)+' L'+(c-G.wv)+' '+w+' Z';
  return 'M'+(c-G.tw)+' '+(t+6)+' Q'+(c-G.tw)+' '+t+' '+(c-G.tw+8)+' '+t+' H'+(c+G.tw-8)+' Q'+(c+G.tw)+' '+t+' '+(c+G.tw)+' '+(t+6)+' L'+(c+G.wv)+' '+w+' L'+(c+G.bw)+' '+(b-4)+' Q'+(c+G.bw)+' '+(b+2)+' '+(c+G.bw-5)+' '+(b+2)+' H'+(c-G.bw+5)+' Q'+(c-G.bw)+' '+(b+2)+' '+(c-G.bw)+' '+(b-4)+' L'+(c-G.wv)+' '+w+' Z';
}
function koerper(f,G,haut){
  var k=f.kleid,o=f.oberteil,R=f.art=='Roboter',kl=(o=='Kleid'),lang=(o=='Pulli'||o=='Jacke'||o=='Streifenshirt'),ac=lang?k:haut,d=dk(k,0.7),s='',i;
  var c=100,t=G.top,b=G.bot,ay=t+4,hy=ay+G.armL+3;
  if(R)ac='#90a4ae';
  [-1,1].forEach(function(sg){
    var cx=c+sg*G.armX,x=cx-8,ang=sg<0?(f.armL||0):-(f.armR||0),g='';
    g+='<circle cx="'+(cx+sg*(G.hand*0.7))+'" cy="'+(hy-G.hand*0.5)+'" r="'+(G.hand*0.42)+'" fill="'+haut+'" '+ST+'/>';
    g+='<rect x="'+x+'" y="'+ay+'" width="16" height="'+G.armL+'" rx="8" fill="'+ac+'" '+ST+'/>';
    if(lang&&!R)g+='<rect x="'+x+'" y="'+(ay+G.armL-9)+'" width="16" height="9" rx="4" fill="'+d+'"/>';
    else if(!R)g+='<rect x="'+(x-1)+'" y="'+(ay-1)+'" width="18" height="19" rx="8" fill="'+k+'" '+ST+'/>';
    g+=G.neck?'<ellipse cx="'+cx+'" cy="'+(hy+2)+'" rx="'+(G.hand*0.85)+'" ry="'+(G.hand*1.15)+'" fill="'+haut+'" '+ST+'/>':'<circle cx="'+cx+'" cy="'+hy+'" r="'+G.hand+'" fill="'+haut+'" '+ST+'/>';
    s+=ang?'<g transform="rotate('+ang+' '+cx+' '+(t+10)+')">'+g+'</g>':g;
  });
  if(G.neck)s+='<rect x="93" y="'+(t-14)+'" width="14" height="24" rx="5" fill="'+haut+'" '+ST+'/><path d="M93 '+(t-4)+' Q100 '+(t+6)+' 107 '+(t-4)+'" fill="#000" opacity=".12"/>';
  s+='<path d="'+rumpfPfad(G,kl)+'" fill="'+k+'" '+ST+'/><path d="'+rumpfPfad(G,kl)+'" fill="url(#sh)"/>';
  if(R){
    var ph=Math.min(28,b-t-26);
    s+='<rect x="'+(c-18)+'" y="'+(t+16)+'" width="36" height="'+ph+'" rx="6" fill="#37474f"/>';
    [0,1,2].forEach(function(j){s+='<circle cx="'+(c-12+j*12)+'" cy="'+(t+16+ph/2)+'" r="3.5" fill="'+['#e63946','#ffd23f','#06d6a0'][j]+'"/>'});
    return s;
  }
  var wy=b-13;
  if(!kl){
    if(o=='Rock'){
      s+='<path d="M'+(c-G.bw)+' '+wy+' H'+(c+G.bw)+' L'+(c+G.bw+14)+' '+G.hem+' H'+(c-G.bw-14)+' Z" fill="'+f.hose+'" '+ST+'/><path d="M'+(c-G.bw)+' '+wy+' H'+(c+G.bw)+' L'+(c+G.bw+14)+' '+G.hem+' H'+(c-G.bw-14)+' Z" fill="url(#sh)"/>';
      [-0.6,0,0.6].forEach(function(q){s+='<path d="M'+(c+q*G.bw)+' '+(wy+4)+' L'+(c+q*(G.bw+14))+' '+(G.hem-2)+'" stroke="'+dk(f.hose,0.7)+'" stroke-width="2" opacity=".5"/>'});
      s+='<path d="M'+(c-G.bw-12)+' '+(G.hem-4)+' H'+(c+G.bw+12)+'" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 3" opacity=".7"/>';
    }else{
      s+='<path d="M'+(c-G.bw+1)+' '+wy+' H'+(c+G.bw-1)+' V'+(b+1)+' H'+(c-G.bw+1)+' Z" fill="'+f.hose+'" '+ST+'/>';
      s+='<path d="M'+(c-G.bw+1)+' '+(wy+3)+' H'+(c+G.bw-1)+'" stroke="'+dk(f.hose,0.55)+'" stroke-width="3"/><rect x="'+(c-5)+'" y="'+(wy+0.5)+'" width="10" height="7" rx="1.5" fill="#ffd23f" '+ST+'/>';
    }
  }
  var y=b-13;
  if(o=='Shirt'){
    s+='<path d="M'+(c-G.bw+6)+' '+(y-7)+' H'+(c+G.bw-6)+'" stroke="'+d+'" stroke-width="2" stroke-dasharray="4 3"/>';
    if(f.geschl=='männlich'&&f.alter!='Kind')s+='<rect x="'+(c+G.tw-30)+'" y="'+(t+22)+'" width="16" height="14" rx="3" fill="none" stroke="'+d+'" stroke-width="2"/>';
    else s+='<polygon points="'+c+','+(t+18)+' '+(c+4)+','+(t+27)+' '+(c+13)+','+(t+27)+' '+(c+6)+','+(t+33)+' '+(c+9)+','+(t+42)+' '+c+','+(t+36)+' '+(c-9)+','+(t+42)+' '+(c-6)+','+(t+33)+' '+(c-13)+','+(t+27)+' '+(c-4)+','+(t+27)+'" fill="#ffffffaa"/>';
  }
  if(o=='Streifenshirt')for(i=t+14;i<y-4;i+=11)s+='<rect x="'+(c-G.wv-2)+'" y="'+i+'" width="'+(2*G.wv+4)+'" height="5" fill="#fff" opacity=".65"/>';
  if(o=='Pulli'){
    s+='<rect x="'+(c-G.bw+1)+'" y="'+(y-2)+'" width="'+(2*G.bw-2)+'" height="12" rx="5" fill="'+d+'"/>';
    for(i=c-G.bw+8;i<c+G.bw-4;i+=8)s+='<path d="M'+i+' '+y+' V'+(y+8)+'" stroke="#fff3" stroke-width="2"/>';
    s+='<path d="M'+(c-16)+' '+(t+22)+' q8 -6 16 0 t16 0" stroke="#fff4" stroke-width="3" fill="none"/>';
  }
  if(o=='Jacke'){
    s+='<path d="M'+c+' '+(t+14)+' V'+(y+8)+'" stroke="'+d+'" stroke-width="3"/><circle cx="'+c+'" cy="'+(t+26)+'" r="3.5" fill="#ffd23f" '+ST+'/>';
    s+='<rect x="'+(c-G.bw+6)+'" y="'+(y-22)+'" width="14" height="13" rx="4" fill="none" stroke="'+d+'" stroke-width="2"/><rect x="'+(c+G.bw-20)+'" y="'+(y-22)+'" width="14" height="13" rx="4" fill="none" stroke="'+d+'" stroke-width="2"/>';
    s+='<rect x="'+(c-G.bw+1)+'" y="'+(y+1)+'" width="'+(2*G.bw-2)+'" height="8" rx="4" fill="'+d+'"/>';
  }
  if(kl){
    var bg=t+Math.round((b-t)*0.52);
    s+='<path d="M'+(c-G.wv-1)+' '+bg+' H'+(c+G.wv+1)+'" stroke="'+d+'" stroke-width="7"/><rect x="'+(c-6)+'" y="'+(bg-5)+'" width="12" height="10" rx="2" fill="#ffd23f" '+ST+'/>';
    s+='<path d="M'+(c-G.bw-12)+' '+(G.hem-4)+' H'+(c+G.bw+12)+'" stroke="#fff" stroke-width="3" stroke-dasharray="5 4" opacity=".75"/>';
    [-0.5,0,0.5].forEach(function(q){s+='<path d="M'+(c+q*G.wv*1.2)+' '+(bg+6)+' L'+(c+q*(G.bw+24))+' '+(G.hem-6)+'" stroke="'+d+'" stroke-width="2" opacity=".45"/>'});
  }
  return s;
}
function beine(f,G,haut){
  var A=f.art,M=A=='Mensch',R=A=='Roboter',s='',kl=(f.oberteil=='Kleid'||f.oberteil=='Rock'),pc=f.hose;
  var fur=M?haut:(R?'#78909c':f.fell),top=G.legTop,bot=G.sh?232-6:226;
  var lege=top,fuss=231.5;
  [-1,1].forEach(function(sg){
    var x1=sg<0?100-G.gap-G.legW:100+G.gap,x2=x1+G.legW,xc=(x1+x2)/2,cu=dk(pc,0.7);
    var tw='<path d="M'+x1+' '+top+' H'+x2+' L'+(x2-1)+' '+(fuss-4)+' H'+(x1+1)+' Z" fill="';
    if(M){
      if(kl){
        s+=tw+haut+'" '+ST+'/>';
        s+='<rect x="'+(x1+0.5)+'" y="'+(fuss-12)+'" width="'+(G.legW-1)+'" height="8" fill="#fff" '+ST+'/>';
      }else{
        s+=tw+pc+'" '+ST+'/><rect x="'+(x1+0.5)+'" y="'+(fuss-11)+'" width="'+(G.legW-1)+'" height="7" fill="'+cu+'"/>';
        s+='<path d="M'+xc+' '+(top+8)+' V'+(fuss-14)+'" stroke="'+cu+'" stroke-width="1.5" opacity=".4"/>';
      }
      var sr=G.legW*0.5+7;
      s+='<path d="M'+(xc-sr)+' '+(fuss+5)+' Q'+(xc-sr)+' '+(fuss-5)+' '+xc+' '+(fuss-5)+' Q'+(xc+sr)+' '+(fuss-5)+' '+(xc+sr)+' '+(fuss+5)+' Z" fill="#3a3a3a" '+ST+'/><path d="M'+(xc-sr+1)+' '+(fuss+4)+' H'+(xc+sr-1)+'" stroke="#fff" stroke-width="2" opacity=".55"/><path d="M'+(xc-3)+' '+(fuss-3)+' h6" stroke="#fff" stroke-width="1.5" opacity=".6"/>';
    }else if(R){
      s+=tw+'#78909c" '+ST+'/><rect x="'+(xc-12)+'" y="228" width="24" height="10" rx="4" fill="#455a64" '+ST+'/>';
    }else{
      s+=tw+fur+'" '+ST+'/>';
      if(!kl)s+='<path d="M'+x1+' '+top+' H'+x2+' V'+(top+14)+' H'+x1+' Z" fill="'+pc+'" '+ST+'/><rect x="'+x1+'" y="'+(top+11)+'" width="'+G.legW+'" height="4" fill="'+cu+'"/>';
      var rx=A=='Hase'?16:12;
      s+='<ellipse cx="'+(xc+sg*2)+'" cy="'+fuss+'" rx="'+rx+'" ry="7" fill="'+fur+'" '+ST+'/>';
      if(A!='Hase')s+='<path d="M'+(xc-4+sg*2)+' '+(fuss-1.5)+' v5 M'+(xc+sg*2)+' '+(fuss-2.5)+' v6 M'+(xc+4+sg*2)+' '+(fuss-1.5)+' v5" stroke="'+dk(fur,0.7)+'" stroke-width="1.6" stroke-linecap="round"/>';
    }
  });
  return s;
}
function schwanz(f){
  var c=f.fell,A=f.art,d=dk(c,0.7);
  function bahn(p,w){return '<path d="'+p+'" stroke="'+d+'" stroke-width="'+(w+3)+'" fill="none" stroke-linecap="round"/><path d="'+p+'" stroke="'+c+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>'}
  var up=f.alter=='Kind'?-4:-10;
  return '<g transform="translate(0 '+up+')">'+schwanzR(f,bahn)+'</g>';
}
function schwanzR(f,bahn){
  var c=f.fell,A=f.art;
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
  var K=f.alter=='Kind',M=f.art=='Mensch',R=f.art=='Roboter',G=geo(f);
  var T='<g transform="translate(100 '+G.chin+') scale('+G.hs+') translate(-100 -156)">';
  var haut=M?f.haut:f.fell;
  var s='<svg viewBox="0 0 200 240">'+DEFS+'<ellipse cx="100" cy="236" rx="58" ry="5" fill="#000" opacity=".12"/>'+schwanz(f)+beine(f,G,haut);
  s+=T+(M?haarWrap(f,haarHinten(f)):R?roboterHinten(f):tierHinten(f))+'</g>';
  s+=koerper(f,G,haut);
  s+=T+ohren(f,haut)+kopf(f,haut)+wangen(f)+augen(f)+brauen(f)+sommer(f)+haarWrap(f,bart(f))+mundSvg(f)+deko(f);
  if(M)s+=haarWrap(f,haarVorn(f));
  return s+extras(f)+'</g></svg>';
}
