var Stimme={
resample:function(x,r){
  var n=Math.floor(x.length/r),y=new Float32Array(n);
  for(var i=0;i<n;i++){var p=i*r,k=Math.floor(p),f=p-k,a=x[k],b=k+1<x.length?x[k+1]:a;y[i]=a+(b-a)*f}
  return y;
},
stretch:function(x,f){
  if(Math.abs(f-1)<0.01)return x;
  var N=1024,H=256,tol=230,len=x.length,L=N/2;
  if(len<N*3)return x;
  var Ha=H/f,n=Math.ceil(len*f)+N*2,out=new Float32Array(n),w=new Float32Array(n),win=new Float32Array(N),i,j;
  for(i=0;i<N;i++)win[i]=0.5-0.5*Math.cos(2*Math.PI*i/N);
  var prev=0,end=0;
  for(var k=0;;k++){
    var a=Math.round(k*Ha),op=k*H;
    if(a>len-N||op+N>n)break;
    var s=a;
    if(k>0){
      var c=Math.min(prev+H,len-N),best=-1e30,lo=Math.max(0,a-tol),hi=Math.min(len-N,a+tol),en=1e-9;
      for(var d=lo;d<=hi;d++){var sum=0,e2=1e-9;for(j=0;j<L;j++){var y=x[d+j];sum+=x[c+j]*y;e2+=y*y}var sc=sum/Math.sqrt(e2);if(sc>best){best=sc;s=d}}
    }
    for(j=0;j<N;j++){out[op+j]+=win[j]*x[s+j];w[op+j]+=win[j]}
    prev=s;end=op+N;
  }
  var y2=new Float32Array(end);
  for(i=0;i<end;i++)y2[i]=w[i]>0.02?out[i]/w[i]:0;
  return y2;
},
pitch:function(x,r,treue){
  if(Math.abs(r-1)<0.01)return x;
  var t=treue===undefined?0.5:treue,y=Stimme.resample(x,r);
  return t>0?Stimme.stretch(y,Math.pow(r,t)):y;
},
tempo:function(x,t){return Stimme.stretch(x,1/t)},
wav:function(x,rate){
  var n=x.length,o=new DataView(new ArrayBuffer(44+n*2));
  function t(a,s){for(var i=0;i<s.length;i++)o.setUint8(a+i,s.charCodeAt(i))}
  t(0,'RIFF');o.setUint32(4,36+n*2,true);t(8,'WAVEfmt ');o.setUint32(16,16,true);o.setUint16(20,1,true);o.setUint16(22,1,true);
  o.setUint32(24,rate,true);o.setUint32(28,rate*2,true);o.setUint16(32,2,true);o.setUint16(34,16,true);t(36,'data');o.setUint32(40,n*2,true);
  for(var i=0;i<n;i++){var v=Math.max(-1,Math.min(1,x[i]));o.setInt16(44+i*2,v<0?v*32768:v*32767,true)}
  return new Blob([o],{type:'audio/wav'});
},
dekodiere:function(blob){
  var O=window.OfflineAudioContext||window.webkitOfflineAudioContext;
  return blob.arrayBuffer().then(function(ab){return new Promise(function(ok,no){new O(1,44100,44100).decodeAudioData(ab,ok,no)})}).then(function(b){return {x:b.getChannelData(0).slice(),rate:b.sampleRate}});
},
eq:function(x,rate,p){
  var O=window.OfflineAudioContext||window.webkitOfflineAudioContext,oc=new O(1,x.length+2000,rate),b=oc.createBuffer(1,x.length,rate);
  b.getChannelData(0).set(x);
  var s=oc.createBufferSource();s.buffer=b;
  function f(t,fr,g,q){var n=oc.createBiquadFilter();n.type=t;n.frequency.value=fr;if(g!==undefined)n.gain.value=g;if(q)n.Q.value=q;return n}
  var hp=f('highpass',70),lo=f('lowshelf',220,p.bass||0),mi=f('peaking',1800,p.mid||0,0.9),hi=f('highshelf',4000,p.hoch||0);
  s.connect(hp);hp.connect(lo);lo.connect(mi);mi.connect(hi);hi.connect(oc.destination);s.start();
  return new Promise(function(ok,no){var pr=oc.startRendering();if(pr&&pr.then)pr.then(function(r){ok(r.getChannelData(0))},no);else oc.oncomplete=function(e){ok(e.renderedBuffer.getChannelData(0))}});
},
EFFEKTE:{
  normal:{n:'Normal'},
  piepsig:{n:'🐭 Piepsig (Maus)',st:7,treue:0.85,hoch:2},
  kobold:{n:'🧚 Kobold (frech)',st:4,treue:0.9,mid:3},
  helium:{n:'🎈 Helium (schnell)',st:5,treue:0.45},
  hexe:{n:'🧙 Hexe',st:3,tempo:0.95,mid:6,hoch:3},
  opa:{n:'👴 Opa (zittrig)',st:-2,tempo:0.9,hoch:-3,zitter:1},
  tief:{n:'🐻 Tief (Bär)',st:-5,treue:1,bass:4},
  monster:{n:'👹 Monster',st:-9,treue:1,bass:6,mid:-2},
  roboter:{n:'🤖 Roboter',st:-1,mid:5,ring:1}
},
effekt:function(x,rate,name){
  var e=Stimme.EFFEKTE[name];
  if(!e||name=='normal')return Promise.resolve(x);
  var p={st:e.st||0,treue:e.treue,tempo:e.tempo,bass:e.bass||0,mid:e.mid||0,hoch:e.hoch||0};
  return Stimme.verarbeiten(x,rate,p).then(function(y){
    var i;
    if(e.ring){for(i=0;i<y.length;i++)y[i]=y[i]*(0.45+0.55*Math.sin(2*Math.PI*55*i/rate))}
    if(e.zitter){for(i=0;i<y.length;i++)y[i]=y[i]*(0.85+0.15*Math.sin(2*Math.PI*5.5*i/rate))}
    var m=0;for(i=0;i<y.length;i++)if(Math.abs(y[i])>m)m=Math.abs(y[i]);
    if(m>0){var g=0.9/m;for(i=0;i<y.length;i++)y[i]*=g}
    return y;
  });
},
verarbeiten:function(x,rate,p){
  var y=Math.abs(p.st||0)<0.75?x:Stimme.pitch(x,Math.pow(2,(p.st||0)/12),p.treue);
  if(p.tempo&&Math.abs(p.tempo-1)>0.03)y=Stimme.tempo(y,p.tempo);
  return Stimme.eq(y,rate,p).then(function(z){
    var m=0,i;for(i=0;i<z.length;i++)if(Math.abs(z[i])>m)m=Math.abs(z[i]);
    var g=m>0?0.9/m:1,o=new Float32Array(z.length);for(i=0;i<z.length;i++)o[i]=z[i]*g;
    return o;
  });
},
pegel:function(x,rate,fps){
  var w=Math.floor(rate/fps),n=Math.ceil(x.length/w),e=new Float32Array(n),i,j,mx=0;
  for(i=0;i<n;i++){var s=0,c=0;for(j=i*w;j<Math.min(x.length,(i+1)*w);j++){s+=x[j]*x[j];c++}e[i]=Math.sqrt(s/Math.max(1,c));if(e[i]>mx)mx=e[i]}
  var srt=Array.prototype.slice.call(e).sort(function(a,b){return a-b}),ref=srt[Math.floor(srt.length*0.9)]||mx||1;
  var l=new Uint8Array(n);
  for(i=0;i<n;i++){var v=e[i]/ref;l[i]=v<0.12?0:(v<0.4?1:(v<0.75?2:3))}
  return l;
}
};
