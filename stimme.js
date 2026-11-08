var Stimme={
resample:function(x,r){
  var n=Math.floor(x.length/r),y=new Float32Array(n);
  for(var i=0;i<n;i++){var p=i*r,k=Math.floor(p),f=p-k,a=x[k],b=k+1<x.length?x[k+1]:a;y[i]=a+(b-a)*f}
  return y;
},
stretch:function(x,f){
  if(Math.abs(f-1)<0.01)return x;
  var N=1024,Hs=512,Ha=Hs/f,tol=256,len=x.length;
  if(len<N*3)return x;
  var n=Math.ceil(len*f)+N*2,out=new Float32Array(n),w=new Float32Array(n),win=new Float32Array(N),i,j;
  for(i=0;i<N;i++)win[i]=0.5-0.5*Math.cos(2*Math.PI*i/N);
  var prev=0,end=0;
  for(var k=0;;k++){
    var a=Math.round(k*Ha),op=k*Hs;
    if(a>len-N||op+N>n)break;
    var s=a;
    if(k>0){
      var c=Math.min(prev+Hs,len-N),best=-1e30,lo=Math.max(0,a-tol),hi=Math.min(len-N,a+tol);
      for(var d=lo;d<=hi;d+=2){var sum=0;for(j=0;j<N;j+=4)sum+=x[c+j]*x[d+j];if(sum>best){best=sum;s=d}}
    }
    for(j=0;j<N;j++){out[op+j]+=win[j]*x[s+j];w[op+j]+=win[j]}
    prev=s;end=op+N;
  }
  var y=new Float32Array(end);
  for(i=0;i<end;i++)y[i]=w[i]>0.02?out[i]/w[i]:0;
  return y;
},
pitch:function(x,r){return Math.abs(r-1)<0.01?x:Stimme.stretch(Stimme.resample(x,r),r)},
tempo:function(x,t){return Stimme.stretch(x,1/t)}
};
