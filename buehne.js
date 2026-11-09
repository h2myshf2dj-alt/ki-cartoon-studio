var HGF={Abenteuer:['#a8e6ff','#5fb35a'],Comedy:['#ffe39b','#f4a259'],'Märchen':['#ffd1e8','#8fd18f'],Fantasy:['#4b2e83','#2e7d5b'],Tiere:['#bfeaff','#7cc576'],Familie:['#cfeeff','#8ccf7e'],Kinderfilm:['#c8f0ff','#9ad46f'],Spannung:['#1d1f3a','#2b2b3b'],'Science-Fiction':['#0b1033','#4a4f6a']};
function hintergrund(k){
  var c=HGF[k]||HGF.Abenteuer,dunkel=(k=='Spannung'||k=='Fantasy'||k=='Science-Fiction');
  var s='<rect width="400" height="300" fill="'+c[0]+'"/>';
  if(dunkel){
    s+='<circle cx="330" cy="50" r="24" fill="#fff6c9"/>';
    [[40,30],[90,70],[150,25],[220,60],[270,20],[370,100],[60,120]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2.5" fill="#fff"/>'});
  }else s+='<circle cx="340" cy="50" r="28" fill="#ffd93b"/>';
  s+='<rect y="215" width="400" height="85" fill="'+c[1]+'"/>';
  if(k=='Abenteuer'||k=='Tiere'||k=='Kinderfilm'||k=='Comedy')
    [[40,200],[350,205]].forEach(function(p){s+='<rect x="'+(p[0]-5)+'" y="'+p[1]+'" width="10" height="32" fill="#7a4a21"/><circle cx="'+p[0]+'" cy="'+(p[1]-8)+'" r="26" fill="#3f9b4a"/>'});
  if(k=='Märchen')s+='<rect x="30" y="130" width="80" height="90" fill="#e8d3b0"/><rect x="30" y="112" width="20" height="30" fill="#d9b98a"/><rect x="90" y="112" width="20" height="30" fill="#d9b98a"/><polygon points="26,112 40,86 54,112" fill="#e63946"/><polygon points="86,112 100,86 114,112" fill="#e63946"/>';
  if(k=='Familie')s+='<rect x="285" y="150" width="90" height="70" fill="#f2c48b"/><polygon points="275,150 330,105 385,150" fill="#c0392b"/><rect x="318" y="180" width="24" height="40" fill="#7a4a21"/>';
  if(k=='Science-Fiction')s+='<circle cx="70" cy="80" r="34" fill="#c0663a"/><ellipse cx="70" cy="80" rx="52" ry="9" fill="none" stroke="#e8c9a0" stroke-width="4"/>';
  if(k=='Fantasy')s+='<polygon points="40,215 90,150 140,215" fill="#6b3fa0"/><polygon points="300,215 350,140 400,215" fill="#6b3fa0"/>';
  return s;
}
var B={A:[],props:[],item:null,spr:-1,lvl:0,fb:false,env:null,szene:-1,sz0:0,satz0:0,cache:{},ein:true,karte:null,tl:0};
var DKE={froh:'✨',verliebt:'💕',muede:'💤',erstaunt:'❗',nachdenklich:'💭'};
var REAG={wuetend:'angst',erstaunt:'erstaunt',froh:'froh',traurig:'traurig',angst:'angst'};
function jetzt(){return Date.now()/1000}
function figInfo(n){
  var f=null;figuren.forEach(function(x){if(x.name==n)f=x});
  return norm(f||{name:n});
}
function leicht(t){var c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}
function reEsc(t){return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
/* Wer ist in Szene si zu sehen: wer bis dahin gesprochen hat oder erwähnt wurde (Name, Art oder Rasse) */
function szeneFig(g,si){
  var s=g.szenen[si],set={};if(!s)return set;
  var txt=s.narr+' '+s.zeilen.map(function(z){return z.text}).join(' ');
  s.zeilen.forEach(function(z){if(z.wer&&z.text.trim())set[z.wer]=1});
  g.figuren.forEach(function(n){
    var f=figInfo(n),w=[n];if(f.art&&f.art!='Mensch')w.push(f.art);if(f.rasse)w.push(f.rasse);
    w.forEach(function(x){try{if(new RegExp('(^|[^\\p{L}])'+reEsc(x)+'([^\\p{L}]|$)','iu').test(txt))set[n]=1}catch(e){}});
  });
  return set;
}
function besetzung(g,si){
  var set={};
  for(var k=0;k<=si&&k<g.szenen.length;k++){var x=szeneFig(g,k);for(var n in x)set[n]=1}
  var r=g.figuren.filter(function(n){return set[n]});
  return r.length?r:g.figuren.slice();
}
/* Figuren auf die Bühne setzen; neue laufen von der Seite herein */
function besetzen(namen,sofort){
  var alt={};B.A.forEach(function(a){alt[a.n]=a});
  var n=namen.length;
  B.A=namen.map(function(nm,i){
    if(alt[nm])return alt[nm];
    var cx=400/n*(i+0.5);
    return {n:nm,f:figInfo(nm),x:sofort?cx:(cx<200?-90:490)};
  });
}
function buehneNeu(){
  var g=GS[gi];
  B.A=[];besetzen(besetzung(g,0),true);
  B.props=[];B.item=null;B.spr=-1;B.lvl=0;B.fb=false;B.env=null;B.szene=-1;B.sz0=jetzt();B.satz0=jetzt();B.ein=true;B.karte=null;B.tl=0;
}
function pose(a,i,sp,m,t,tm,dir){
  var P={dx:0,dy:Math.sin(t*2+i)*1.5,sx:1,sy:1+Math.sin(t*2.2+i)*0.015,tilt:Math.sin(t*1.3+i*2)*1.5,aL:6+5*Math.sin(t*1.7+i),aR:6+5*Math.sin(t*1.9+i+1),hop:0},q=B.lvl/3;
  if(sp){
    P.sy*=1+0.06*q;P.sx*=1-0.03*q;P.dy-=3*q;P.tilt+=dir*3;
    P.aR=18+45*Math.max(0,Math.sin(t*2.6));P.aL=8+35*Math.max(0,Math.sin(t*2.1+2));
    P.dx+=dir*2*Math.sin(t*1.5);
  }else if(B.spr>=0){
    P.tilt+=dir*2.5;P.dy+=Math.max(0,Math.sin(t*3.5+i))*2;
  }
  if(m=='froh'){if(tm<1)P.hop=Math.abs(Math.sin(tm*7))*20*(1-tm);P.aL=P.aR=tm<1.2?140+10*Math.sin(t*14):40+20*Math.sin(t*7)}
  if(m=='erstaunt'){if(tm<0.35)P.hop=34*Math.sin(tm/0.35*Math.PI);var pp=Math.max(0,1-tm*3);P.sx*=1+0.12*pp;P.sy*=1+0.12*pp;P.aL=P.aR=100}
  if(m=='wuetend'){P.dx+=Math.sin(t*38)*2.5;P.tilt=Math.sin(t*22)*2.5;P.aL=P.aR=45+10*Math.sin(t*20)}
  if(m=='angst'){P.dx+=Math.sin(t*48)*1.8;P.sy*=0.97;P.aL=P.aR=15}
  if(m=='traurig'){P.dy+=6;P.sy*=0.96;P.tilt=-3;P.aL=P.aR=3}
  if(m=='verliebt'){P.tilt=Math.sin(t*2)*4;P.dy-=Math.abs(Math.sin(t*3))*4;P.aR=60+20*Math.sin(t*3)}
  if(m=='muede'){P.tilt=Math.sin(t*1.2)*5;P.sy*=0.97;P.aL=P.aR=2}
  if(m=='nachdenklich'){P.tilt=6;P.aR=95}
  return P;
}
function karteSvg(t){
  var k=B.karte;if(!k)return '';
  var a=t-k.t0,al=Math.min(1,a/0.4);if(k.d<900)al=Math.min(al,Math.max(0,(k.t0+k.d-t)/0.4));
  if(al<=0)return '';
  var txt=esc(k.txt),fs=Math.max(22,Math.min(46,640/Math.max(8,k.txt.length))),sc=0.85+0.15*leicht(Math.min(1,a/0.5));
  return '<g opacity="'+al.toFixed(2)+'"><rect width="400" height="300" fill="#000" opacity=".55"/><g transform="translate(200 150) scale('+sc.toFixed(3)+')"><text y="-34" font-size="40" text-anchor="middle">'+(k.emo||'🎬')+'</text><text y="'+(fs*0.55)+'" font-size="'+fs.toFixed(0)+'" font-weight="800" font-family="-apple-system,Helvetica,Arial,sans-serif" text-anchor="middle" fill="#fff" stroke="#2b1a12" stroke-width="5" paint-order="stroke" stroke-linejoin="round">'+txt+'</text></g></g>';
}
function buehneZeichnen(){
  var el=document.getElementById('buehne');if(!el)return;
  var g=GS[gi],n=B.A.length,sc=n<=2?0.84:(n==3?0.66:0.54),t=jetzt(),it=B.item,tm=t-B.satz0,dt=B.tl?Math.min(0.25,t-B.tl):0;B.tl=t;
  var sm=(it&&B.spr>=0)?it.g:'neutral',fig='',emo='',zx=200,zz=1;
  B.A.forEach(function(a,i){
    var sp=(i==B.spr),cx=400/n*(i+0.5),m=sp?sm:(B.spr>=0&&tm>0.3&&REAG[sm]||'neutral');
    if(a.x==null)a.x=cx;
    var weg=cx-a.x,geht=Math.abs(weg)>3;
    a.x+=Math.sign(weg)*Math.min(Math.abs(weg),dt*150);
    var dir=sp?(n>1?(cx<200?1:-1):0):(B.spr>=0?(B.spr>i?1:-1):0);
    var P=pose(a,i,sp,m,t,sp?tm:tm-0.3,dir);
    if(geht){P.dy-=Math.abs(Math.sin(t*9))*5;P.aL=25+20*Math.sin(t*9);P.aR=25-20*Math.sin(t*9);P.tilt=Math.sign(weg)*4}
    var f=Object.assign({},a.f,{mimik:m,mund:sp?B.lvl:0,blink:((t*1000+i*1300)%3200)<140,blick:geht?(weg>0?1:-1):(B.spr<0||sp?0:(B.spr>i?1:-1)),armL:Math.round(P.aL/5)*5,armR:Math.round(P.aR/5)*5});
    var key=JSON.stringify(f),inner=B.cache[key];
    if(!inner){
      if(Object.keys(B.cache).length>500)B.cache={};
      inner=B.cache[key]=svg(f).replace('<svg viewBox="0 0 200 240">','').replace(/<\/svg>\s*$/,'');
    }
    var k=sc*(sp?1.05:1),by=288+P.dy-P.hop,x=a.x+P.dx;
    fig+='<g transform="translate('+x.toFixed(1)+' '+by.toFixed(1)+') rotate('+P.tilt.toFixed(1)+') scale('+(k*P.sx).toFixed(3)+' '+(k*P.sy).toFixed(3)+') translate(-100 -240)">'+inner+'</g>';
    if(sp&&DKE[m])emo+='<text x="'+(x+34*k).toFixed(0)+'" y="'+(by-((f.art=='Mensch')?(f.alter=='Kind'?200:224):205)*k*P.sy+Math.sin(t*4)*3).toFixed(0)+'" font-size="'+Math.round(30*k/0.6)+'" text-anchor="middle">'+DKE[m]+'</text>';
    if(sp&&B.spr>=0&&n>1){zx=200+(cx-200)*0.4;zz=1+(0.04+((m=='erstaunt'||m=='wuetend'||m=='angst')?0.04:0))*leicht(Math.min(1,tm*3))}
  });
  var pr='';
  B.props=B.props.filter(function(p){return t-p.t0<5});
  B.props.forEach(function(p,j,all){
    var age=t-p.t0,al=age<4?1:Math.max(0,1-(age-4)/0.8);
    var sz=60*Math.max(0.01,leicht(Math.min(1,age/0.45))),x=all.length==1?(n%2?(n==1?320:200+400/n/2):200):(j?(n%2?340:270):(n%2?60:130)),y=70+Math.sin(t*3+j)*4;
    pr+='<g opacity="'+al.toFixed(2)+'"><ellipse cx="'+x+'" cy="'+(y+40)+'" rx="'+(sz*0.45)+'" ry="5" fill="#000" opacity=".12"/><text x="'+x+'" y="'+y+'" font-size="'+sz.toFixed(0)+'" text-anchor="middle" dominant-baseline="central">'+p.e+'</text></g>';
  });
  var s='<svg viewBox="0 0 400 300"><g transform="translate('+zx.toFixed(1)+' 200) scale('+zz.toFixed(3)+') translate('+(-zx).toFixed(1)+' -200)">'+hintergrund(g.kat)+pr+fig+emo+'</g>'+karteSvg(t)+'</svg>';
  B.svg=s;el.innerHTML=s;
}
