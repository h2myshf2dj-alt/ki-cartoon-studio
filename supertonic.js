/* Supertonic 3 (Supertone Inc., Code MIT, Modell OpenRAIL-M) im Browser.
   Nachbau der offiziellen web/helper.js ohne Build-Werkzeug. Läuft komplett auf dem Gerät. */
var Super={
  ORT:'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/ort.webgpu.min.mjs',
  BASE:'https://huggingface.co/supertone-oss-archive/supertonic-3/resolve/aafc6e32416a594460b32413efc49d7fe4ce6d46/',
  ort:null,cfg:null,idx:null,S:{},stil:{},ok:false,laden_p:null,backend:'',kompat:false,warte:Promise.resolve(),
  STIMMEN:['M1','M2','M3','M4','M5','F1','F2','F3','F4','F5']
};
/* Datei holen, mit Fortschritt, und im Cache-Speicher des Browsers ablegen (kein erneuter Download) */
Super.hole=async function(pfad,prog,bin){
  var url=Super.BASE+pfad,c=null;
  try{c=await caches.open('supertonic-v3')}catch(e){}
  if(c){var h=await c.match(url);if(h){var b0=bin?new Uint8Array(await h.arrayBuffer()):await h.json();if(prog)prog(1,1);return b0}}
  var r=await fetch(url);
  if(!r.ok)throw new Error('Download '+pfad+': HTTP '+r.status);
  var tot=+r.headers.get('content-length')||0,rd=r.body&&r.body.getReader?r.body.getReader():null,teile=[],ges=0;
  if(rd){for(;;){var x=await rd.read();if(x.done)break;teile.push(x.value);ges+=x.value.length;if(prog)prog(ges,tot)}}
  else{var ab=await r.arrayBuffer();teile=[new Uint8Array(ab)];ges=ab.byteLength}
  var all=new Uint8Array(ges),o=0;teile.forEach(function(t){all.set(t,o);o+=t.length});
  if(c){try{await c.put(url,new Response(all,{headers:{'content-type':bin?'application/octet-stream':'application/json'}}))}catch(e){}}
  return bin?all:JSON.parse(new TextDecoder().decode(all));
};
Super.laden=function(prog,kompat){
  if(Super.ok)return Promise.resolve();
  if(Super.laden_p)return Super.laden_p;
  Super.kompat=!!kompat;
  Super.laden_p=(async function(){
    var P=function(t){if(prog)prog(t)};
    P('Programm wird geladen …');
    Super.ort=await import(Super.ORT);
    var ort=Super.ort;
    try{ort.env.wasm.numThreads=1;ort.env.wasm.proxy=false}catch(e){}
    Super.cfg=await Super.hole('onnx/tts.json');
    Super.idx=await Super.hole('onnx/unicode_indexer.json');
    var namen=[['dp','duration_predictor','Satzlänge'],['te','text_encoder','Texte'],['ve','vector_estimator','Stimme (groß)'],['vo','vocoder','Klang']];
    var prov=(!Super.kompat&&navigator.gpu)?['webgpu','wasm']:['wasm'];
    for(var i=0;i<namen.length;i++){
      var n=namen[i];
      var buf=await Super.hole('onnx/'+n[1]+'.onnx',function(a,t){P('Stimme laden ('+(i+1)+'/4 '+n[2]+'): '+(t?Math.round(a*100/t)+' %':Math.round(a/1048576)+' MB'))},true);
      P('Stimme wird gestartet ('+(i+1)+'/4) …');
      try{Super.S[n[0]]=await ort.InferenceSession.create(buf,{executionProviders:prov,graphOptimizationLevel:'all'});Super.backend=prov[0]}
      catch(e){
        if(prov[0]=='webgpu'){prov=['wasm'];Super.backend='wasm';Super.S[n[0]]=await ort.InferenceSession.create(buf,{executionProviders:prov,graphOptimizationLevel:'all'})}
        else throw e;
      }
    }
    Super.ok=true;
  })();
  Super.laden_p.catch(function(){Super.laden_p=null;Super.ok=false});
  return Super.laden_p;
};
/* Neu starten, z. B. im sicheren Modus (nur WASM), wenn die schnelle Version nur Stille liefert */
Super.freigeben=function(){
  Object.keys(Super.S).forEach(function(k){try{if(Super.S[k]&&Super.S[k].release)Super.S[k].release()}catch(e){}});
  Super.S={};Super.ok=false;Super.laden_p=null;
};
Super.stilLaden=async function(name){
  if(Super.stil[name])return Super.stil[name];
  var j=await Super.hole('voice_styles/'+name+'.json'),ort=Super.ort;
  var t=j.style_ttl,d=j.style_dp;
  var s={ttl:new ort.Tensor('float32',Float32Array.from(t.data.flat(Infinity)),t.dims),dp:new ort.Tensor('float32',Float32Array.from(d.data.flat(Infinity)),d.dims)};
  return Super.stil[name]=s;
};
Super.vorbereiten=function(text,lang){
  text=text.normalize('NFKD');
  text=text.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]+/gu,'');
  var ers={'–':'-','‑':'-','—':'-','_':' ','“':'"','”':'"','‘':"'",'’':"'",'´':"'",'`':"'",'[':' ',']':' ','|':' ','/':' ','#':' ','→':' ','←':' '};
  Object.keys(ers).forEach(function(k){text=text.split(k).join(ers[k])});
  text=text.replace(/[♥☆♡©\\]/g,'');
  text=text.replace(/ ,/g,',').replace(/ \./g,'.').replace(/ !/g,'!').replace(/ \?/g,'?').replace(/ ;/g,';').replace(/ :/g,':').replace(/ '/g,"'");
  while(text.indexOf('""')>=0)text=text.replace('""','"');
  while(text.indexOf("''")>=0)text=text.replace("''","'");
  text=text.replace(/\s+/g,' ').trim();
  if(!/[.!?;:,'"')\]}…。」』】〉》›»]$/.test(text))text+='.';
  return '<'+lang+'>'+text+'</'+lang+'>';
};
Super.teilen=function(t,max){
  var sat=t.trim().split(/(?<=[.!?])\s+/),out=[],cur='';
  sat.forEach(function(s){if((cur+' '+s).trim().length<=max)cur=(cur?cur+' ':'')+s;else{if(cur)out.push(cur);cur=s}});
  if(cur)out.push(cur);return out;
};
Super.einzel=async function(text,stil,schritte,tempo){
  var ort=Super.ort,S=Super.S,c=Super.cfg,T=Super.vorbereiten(text,'de');
  var n=T.length,ids=new BigInt64Array(n),i;
  for(i=0;i<n;i++){var cp=T.codePointAt(i);ids[i]=BigInt(cp<Super.idx.length?Super.idx[cp]:-1)}
  var ti=new ort.Tensor('int64',ids,[1,n]),tm=new ort.Tensor('float32',new Float32Array(n).fill(1),[1,1,n]);
  var dp=await S.dp.run({text_ids:ti,style_dp:stil.dp,text_mask:tm});
  var dur=dp.duration.data[0]/tempo;
  var te=await S.te.run({text_ids:ti,style_ttl:stil.ttl,text_mask:tm});
  var sr=c.ae.sample_rate,chunk=c.ae.base_chunk_size*c.ttl.chunk_compress_factor,wl=Math.floor(dur*sr);
  var ll=Math.floor((wl+chunk-1)/chunk),ld=c.ttl.latent_dim*c.ttl.chunk_compress_factor;
  var xt=new Float32Array(ld*ll);
  for(i=0;i<xt.length;i+=1){var u1=Math.max(0.0001,Math.random()),u2=Math.random();xt[i]=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2)}
  var lm=new ort.Tensor('float32',new Float32Array(ll).fill(1),[1,1,ll]);
  var tot=new ort.Tensor('float32',new Float32Array([schritte]),[1]);
  for(var s=0;s<schritte;s++){
    var o=await S.ve.run({noisy_latent:new ort.Tensor('float32',xt,[1,ld,ll]),text_emb:te.text_emb,style_ttl:stil.ttl,latent_mask:lm,text_mask:tm,current_step:new ort.Tensor('float32',new Float32Array([s]),[1]),total_step:tot});
    xt=Float32Array.from(o.denoised_latent.data);
  }
  var v=await S.vo.run({latent:new ort.Tensor('float32',xt,[1,ld,ll])});
  var w=v.wav_tts.data;
  return {x:Float32Array.from(w.subarray?w.subarray(0,Math.min(w.length,wl)):w),rate:sr};
};
/* Ein Text (auch lang), eine Stimme. Gibt {x:Float32Array,rate} zurück. Aufrufe laufen nacheinander. */
Super.sprich=function(text,stimme,opt){
  opt=opt||{};
  var pr=Super.warte.then(async function(){
    await Super.laden();
    var st=await Super.stilLaden(stimme),teile=Super.teilen(text,300),res=[],ges=0;
    for(var i=0;i<teile.length;i++){var r=await Super.einzel(teile[i],st,opt.schritte||8,opt.tempo||1.05);res.push(r.x);ges+=r.x.length;if(i<teile.length-1)ges+=Math.floor(0.25*r.rate)}
    var sr=Super.cfg.ae.sample_rate,out=new Float32Array(ges),o=0;
    res.forEach(function(a,i){out.set(a,o);o+=a.length;if(i<res.length-1)o+=Math.floor(0.25*sr)});
    return {x:out,rate:sr};
  });
  Super.warte=pr.catch(function(){});
  return pr;
};
