var Klang=(function(){
var K={ctx:null,mg:null,fg:null,out:null,rd:null,musik:true,fx:true};
function hz(m){return 440*Math.pow(2,(m-69)/12)}
function ton(c,d,t,f,dau,typ,vol,att){
  var o=c.createOscillator(),g=c.createGain();o.type=typ;o.frequency.setValueAtTime(f,t);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+(att||0.01));g.gain.exponentialRampToValueAtTime(0.0001,t+dau);
  o.connect(g);g.connect(d);o.start(t);o.stop(t+dau+0.05);return o;
}
function rausch(c,d,t,dau,vol,typ,f1,f2,q){
  var n=Math.max(1,Math.floor(c.sampleRate*dau)),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);
  for(var i=0;i<n;i++)x[i]=Math.random()*2-1;
  var s=c.createBufferSource();s.buffer=b;
  var fl=c.createBiquadFilter();fl.type=typ;fl.Q.value=q||1;fl.frequency.setValueAtTime(f1,t);
  if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+dau);
  var g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+Math.min(0.03,dau/3));g.gain.exponentialRampToValueAtTime(0.0001,t+dau);
  s.connect(fl);fl.connect(g);g.connect(d);s.start(t);s.stop(t+dau);
}
var FX={
  zauber:function(c,d,t){[1200,1500,1900,2400,3000,3800].forEach(function(f,i){ton(c,d,t+i*0.07,f,0.5,'sine',0.25,0.005)});return 1},
  klopf:function(c,d,t){for(var i=0;i<3;i++){ton(c,d,t+i*0.22,150,0.12,'sine',0.7,0.003);rausch(c,d,t+i*0.22,0.05,0.4,'lowpass',800)}return 0.8},
  schritte:function(c,d,t){for(var i=0;i<6;i++)rausch(c,d,t+i*0.3,0.12,1,'lowpass',500);return 1.9},
  donner:function(c,d,t){rausch(c,d,t,2.2,0.9,'lowpass',400,60);return 2.2},
  boing:function(c,d,t){var o=ton(c,d,t,220,0.5,'sine',0.5,0.01);o.frequency.exponentialRampToValueAtTime(700,t+0.15);o.frequency.exponentialRampToValueAtTime(250,t+0.5);return 0.5},
  glocke:function(c,d,t){[1,2.76,5.4].forEach(function(m,i){ton(c,d,t,660*m,1.6/(i+1),'sine',0.35/(i+1),0.005)});return 1.6},
  vogel:function(c,d,t){for(var i=0;i<4;i++){var o=ton(c,d,t+i*0.16,2600,0.1,'sine',0.45,0.01);o.frequency.exponentialRampToValueAtTime(3800,t+i*0.16+0.08)}return 0.7},
  platsch:function(c,d,t){rausch(c,d,t,0.5,1,'bandpass',2500,500,1.5);return 0.5},
  applaus:function(c,d,t){for(var i=0;i<30;i++)rausch(c,d,t+Math.random()*1.8,0.05,0.3,'highpass',1500);return 2},
  pop:function(c,d,t){var o=ton(c,d,t,300,0.18,'sine',0.6,0.005);o.frequency.exponentialRampToValueAtTime(900,t+0.08);return 0.2},
  ende:function(c,d,t){[60,64,67,72].forEach(function(m,i){ton(c,d,t+i*0.16,hz(m),0.9,'triangle',0.35,0.01)});[60,64,67].forEach(function(m){ton(c,d,t+0.7,hz(m),1.6,'triangle',0.25,0.02)});return 2.3}
};
var REGELN=[[/klopf/i,'klopf'],[/zauber|magi|funkel/i,'zauber'],[/donner|gewitter|blitz/i,'donner'],[/vogel|vögel|zwitscher/i,'vogel'],[/glocke|läutet/i,'glocke'],[/springt|hüpf|sprung/i,'boing'],[/wasser|platsch|\bsee\b|fluss|meer/i,'platsch'],[/schleicht|schritt|läuft|rennt|geht /i,'schritte'],[/jubel|applaus|hurra|feier|gewonnen/i,'applaus']];
var STILE={Abenteuer:{b:116,m:0,w:'triangle',r:60},Comedy:{b:136,m:0,w:'square',r:62,st:1},'Märchen':{b:84,m:0,w:'sine',r:67,h:1},Fantasy:{b:78,m:1,w:'triangle',r:62,h:1},Tiere:{b:104,m:0,w:'triangle',r:62},Familie:{b:100,m:0,w:'sine',r:60},Kinderfilm:{b:120,m:0,w:'triangle',r:64},Spannung:{b:68,m:1,w:'sawtooth',r:48,dk:1},'Science-Fiction':{b:100,m:1,w:'square',r:57}};
function musikPlan(c,d,kat,t0,sek){
  var S=STILE[kat]||STILE.Abenteuer,beat=60/S.b,bar=beat*4,bars=Math.ceil(sek/bar);
  var off=S.m?[0,8,3,10]:[0,7,9,5],mol=S.m?[1,0,0,0]:[0,0,1,0];
  for(var k=0;k<bars;k++){
    var t=t0+k*bar,ci=k%4,root=S.r+off[ci],terz=mol[ci]?3:4,ch=[0,terz,7,12];
    if(S.dk){
      var o=ton(c,d,t,hz(root-12),bar,'sawtooth',0.35,0.5);
      for(var h=0;h<4;h++)ton(c,d,t+h*beat,55,0.25,'sine',0.7,0.01);
      continue;
    }
    ton(c,d,t,hz(root-12),beat*1.8,'sine',0.7,0.02);ton(c,d,t+beat*2,hz(root-12+(ci%2?7:0)),beat*1.8,'sine',0.6,0.02);
    var seq=[0,1,2,3,2,1,2,1];
    for(var i=0;i<8;i++){
      var m=root+(S.h?24:12)+ch[seq[i]]-(seq[i]==3?12:0),dur=S.st?beat*0.3:(S.h?beat*1.6:beat*0.7);
      ton(c,d,t+i*beat/2,hz(m),dur,S.w,0.32,0.01);
      if(S.m&&S.w=='square')ton(c,d,t+i*beat/2,hz(m)*1.006,dur,S.w,0.12,0.01);
    }
  }
}
K.hz=hz;K.FX=FX;K.musikPlan=musikPlan;
K.passend=function(text){for(var i=0;i<REGELN.length;i++)if(REGELN[i][0].test(text))return REGELN[i][1];return ''};
K.init=function(){
  try{
    if(!K.ctx){var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;K.ctx=new C();K.out=K.ctx.createGain();K.out.connect(K.ctx.destination);K.fg=K.ctx.createGain();K.fg.gain.value=0.6;K.fg.connect(K.out)}
    if(K.ctx.state=='suspended')K.ctx.resume();return true;
  }catch(e){return false}
};
K.start=function(kat){
  K.stop();if(!K.musik||!K.init())return;
  var c=K.ctx;K.mg=c.createGain();K.mg.gain.setValueAtTime(0.0001,c.currentTime);K.mg.gain.linearRampToValueAtTime(0.12,c.currentTime+1);K.mg.connect(K.out);
  musikPlan(c,K.mg,kat,c.currentTime+0.05,130);
};
K.stop=function(){
  if(!K.mg)return;var g=K.mg,c=K.ctx;K.mg=null;
  try{g.gain.cancelScheduledValues(c.currentTime);g.gain.setValueAtTime(g.gain.value,c.currentTime);g.gain.linearRampToValueAtTime(0.0001,c.currentTime+0.4)}catch(e){}
  setTimeout(function(){try{g.disconnect()}catch(e){}},600);
};
K.effekt=function(n){if(!n||!K.fx||!FX[n]||!K.init())return;try{FX[n](K.ctx,K.fg,K.ctx.currentTime+0.03)}catch(e){}};
K.aufnahme=function(){if(!K.init())return null;if(!K.ctx.createMediaStreamDestination)return null;if(!K.rd)K.rd=K.ctx.createMediaStreamDestination();K.out.connect(K.rd);return K.rd};
K.aufnahmeEnde=function(){try{if(K.rd)K.out.disconnect(K.rd)}catch(e){}};
return K;
})();
