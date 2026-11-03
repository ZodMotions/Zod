/* ZodClip Beta — tarayıcıda çalışan Reels kurgu editörü.
   Her şey kullanıcının cihazında işlenir; dosyalar hiçbir sunucuya yüklenmez. */
(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const now=()=>performance.now()/1000;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtT=t=>{t=Math.max(0,t||0);const m=Math.floor(t/60),s=Math.floor(t%60);return m+':'+String(s).padStart(2,'0')};
const r1=v=>Math.round(v*10)/10;
const up=s=>s.toLocaleUpperCase('tr');
const upName=s=>/[ğüşöçıİĞÜŞÖÇ]/.test(s)?s.toLocaleUpperCase('tr'):s.toUpperCase();
let toastT;function toast(m,ms=2600){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms)}

/* ---------------- giriş ---------------- */
async function gate(){
  const msg=$('#gate-msg'),btn=$('#gate-btn');
  if(!window.ZMA){msg.textContent='Hesap sistemi yüklenemedi. Sayfayı yenile.';return}
  try{await ZMA.ready}catch(e){}
  const u=ZMA.user&&ZMA.user();
  if(!u){msg.textContent='ZodClip Beta’yı kullanmak için ZodMotions hesabınla giriş yap. Hesabın yoksa aynı sayfadan ücretsiz oluşturabilirsin.';btn.hidden=false;return}
  $('#who').textContent=u.email||'';
  $('#gate').hidden=true;$('#app').hidden=false;start();
}
$('#btn-out').addEventListener('click',async()=>{try{await ZMA.signOut()}catch(e){}location.reload()});

/* ---------------- durum ---------------- */
const FORMATS={'9:16':[1080,1920],'4:5':[1080,1350],'1:1':[1080,1080],'16:9':[1920,1080]};
const FILTERS={none:'none',sicak:'saturate(1.12) sepia(.14) contrast(1.05)',soguk:'saturate(1.05) hue-rotate(-10deg) contrast(1.06) brightness(1.02)',canli:'saturate(1.32) contrast(1.1)',sinema:'contrast(1.16) saturate(.82) brightness(.95)',sb:'grayscale(1) contrast(1.12)'};
const PRESETS={
  modern:{filter:'none',cap:'vurgu',font:'d'},
  luks:{filter:'sinema',cap:'zarif',font:'s'},
  enerjik:{filter:'canli',cap:'vurgu',font:'d',size:1.15},
  kurumsal:{filter:'soguk',cap:'kutu',font:'b'}
};
const S={
  sources:[],segs:[],caps:[],logo:null,music:null,
  cfg:{fmt:'9:16',fit:'blur',filter:'none',preset:'modern',font:'d',
    cap:{style:'vurgu',size:1,pos:.7,upper:true},
    hook:{on:true,text:'',dur:2.5},
    end:{on:true,text:'Zodiac Web Design',sub:'@zodiacmedya',dur:2.5},
    wm:{on:false},clipVol:1,music:{vol:.35,duck:true,fade:true}}
};
let uid=0;const nid=()=>++uid;
const srcOf=seg=>S.sources.find(s=>s.id===seg.src);
const len=seg=>Math.max(0,seg.out-seg.in);
let contentDur=0,total=0;
function layout(){
  let t=0,prev=null;
  for(const g of S.segs){
    g.t0=t;t+=len(g);
    const s=srcOf(g);
    if(s&&s.kind==='video')g.el=(prev&&prev.src===g.src&&prev.el===s.els[0])?s.els[1]:s.els[0];else g.el=null;
    prev=g}
  contentDur=t;total=t+(S.cfg.end.on&&S.segs.length?S.cfg.end.dur:0);
}
function segAt(t){for(let i=0;i<S.segs.length;i++){const g=S.segs[i];if(t<g.t0+len(g))return i}return S.segs.length-1}

/* ---------------- tuval ---------------- */
const cv=$('#cv'),ctx=cv.getContext('2d');
let W=1080,H=1920;
const small=document.createElement('canvas'),sctx=small.getContext('2d');
function fitCanvas(){const r=$('#screen').getBoundingClientRect();if(!r.width||!r.height)return;const k=Math.min(r.width/W,r.height/H);cv.style.width=Math.floor(W*k)+'px';cv.style.height=Math.floor(H*k)+'px'}
if(window.ResizeObserver)new ResizeObserver(()=>fitCanvas()).observe(document.getElementById('screen'));else window.addEventListener('resize',()=>fitCanvas());
function setFormat(){const [w,h]=FORMATS[S.cfg.fmt];W=cv.width=w;H=cv.height=h;fitCanvas();small.width=Math.round(w/14);small.height=Math.round(h/14);dirty=true}
let dirty=true;

function mediaOf(g){const s=srcOf(g);if(!s)return null;if(s.kind==='video')return{m:g.el,w:g.el.videoWidth,h:g.el.videoHeight};return{m:s.img,w:s.img.naturalWidth,h:s.img.naturalHeight}}
function drawCover(c,m,mw,mh,cw,ch,z=1){const sc=Math.max(cw/mw,ch/mh)*z,dw=mw*sc,dh=mh*sc;c.drawImage(m,(cw-dw)/2,(ch-dh)/2,dw,dh)}
function drawContain(m,mw,mh,z=1){const sc=Math.min(W/mw,H/mh)*z,dw=mw*sc,dh=mh*sc;ctx.drawImage(m,(W-dw)/2,(H-dh)/2,dw,dh)}
function drawMedia(g,t){
  const md=mediaOf(g);if(!md||!md.w)return;
  const s=srcOf(g);const local=clamp((t-g.t0)/Math.max(.01,len(g)),0,1);
  const z=s.kind==='image'?1+.07*local:1;
  const f=FILTERS[S.cfg.filter]||'none';
  const sameRatio=Math.abs(md.w/md.h-W/H)<.03;
  if(S.cfg.fit==='fill'||sameRatio){ctx.filter=f;drawCover(ctx,md.m,md.w,md.h,W,H,z);ctx.filter='none';return}
  if(S.cfg.fit==='blur'){
    sctx.filter='blur(2px)';drawCover(sctx,md.m,md.w,md.h,small.width,small.height,1.15);sctx.filter='none';
    ctx.imageSmoothingQuality='high';ctx.drawImage(small,0,0,W,H);
    ctx.fillStyle='rgba(0,0,0,.42)';ctx.fillRect(0,0,W,H)}
  ctx.filter=f;drawContain(md.m,md.w,md.h,z);ctx.filter='none';
}
const FONT={d:'"Archivo Narrow"',b:'Inter',s:'"Playfair Display"'};
function wrap(words,font,maxW){ctx.font=font;const lines=[];let cur=[];for(const w of words){const test=[...cur,w].map(x=>x.t).join(' ');if(cur.length&&ctx.measureText(test).width>maxW){lines.push(cur);cur=[w]}else cur.push(w)}if(cur.length)lines.push(cur);return lines}
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
const ease=p=>1-Math.pow(1-clamp(p,0,1),3);

function drawCaption(t){
  const c=S.caps.find(c=>t>=c.s&&t<c.e);if(!c||!c.t.trim())return;
  const st=S.cfg.cap.style,U=S.cfg.cap.upper&&st!=='zarif';
  const base=Math.min(W,H*0.5625)*0.078*S.cfg.cap.size*(st==='vurgu'?1.12:1);
  const family=st==='zarif'?FONT.s:st==='vurgu'?FONT.d:FONT.b;
  const weight=st==='zarif'?'italic 700':st==='vurgu'?'700':'800';
  const pop=.9+.1*ease((t-c.s)/.14);
  const fs=base*pop,font=`${weight} ${fs}px ${family}`;
  const raw=c.t.trim().split(/\s+/);
  let active=-1;
  if(c.w&&c.w.length===raw.length){active=c.w.findIndex(w=>t>=w.s&&t<w.e);if(active<0)active=c.w.reduce((a,w,i)=>t>=w.s?i:a,-1)}
  else active=Math.min(raw.length-1,Math.floor((t-c.s)/Math.max(.01,c.e-c.s)*raw.length));
  const words=raw.map((x,i)=>({t:U?up(x):x,i}));
  const lines=wrap(words,font,W*.84);
  const lh=fs*1.18,y0=H*S.cfg.cap.pos-(lines.length*lh)/2;
  ctx.textBaseline='middle';ctx.lineJoin='round';
  lines.forEach((ln,li)=>{
    const txt=ln.map(w=>w.t).join(' ');ctx.font=font;
    const sp=ctx.measureText(' ').width,tw=ctx.measureText(txt).width;
    let x=(W-tw)/2;const y=y0+li*lh+lh/2;
    if(st==='kutu'){const p=fs*.32;ctx.fillStyle='rgba(255,255,255,.96)';rrect(x-p,y-lh/2+fs*.04,tw+p*2,lh-fs*.08,fs*.22);ctx.fill()}
    for(const w of ln){
      const ww=ctx.measureText(w.t).width,on=w.i===active;
      if(st==='klasik'){ctx.lineWidth=fs*.17;ctx.strokeStyle='#000';ctx.strokeText(w.t,x,y);ctx.fillStyle='#fff';ctx.fillText(w.t,x,y)}
      else if(st==='vurgu'){ctx.lineWidth=fs*.15;ctx.strokeStyle='rgba(0,0,0,.92)';ctx.strokeText(w.t,x,y);ctx.fillStyle=on?'#FFD84D':'#fff';ctx.fillText(w.t,x,y)}
      else if(st==='kutu'){ctx.fillStyle=on?'#0B0C0E':'#3a3d44';ctx.fillText(w.t,x,y)}
      else{ctx.save();ctx.shadowColor='rgba(0,0,0,.75)';ctx.shadowBlur=fs*.35;ctx.globalAlpha=on?1:.82;ctx.fillStyle='#fff';ctx.fillText(w.t,x,y);ctx.restore()}
      x+=ww+sp}
  });
}
function drawHook(t){
  const h=S.cfg.hook;if(!h.on||!h.text.trim()||t>=h.dur)return;
  const a=Math.min(ease(t/.3),clamp((h.dur-t)/.3,0,1));const sc=1.12-.12*ease(t/.45);
  const serif=S.cfg.font==='s';
  const fs=Math.min(W,H*.5625)*(serif?.095:.115);
  const font=serif?`italic 700 ${fs}px ${FONT.s}`:`700 ${fs}px ${FONT.d}`;
  const words=h.text.trim().split(/\s+/).map(x=>({t:serif?x:up(x)}));
  const lines=wrap(words,font,W*.8/sc);
  const lh=fs*1.02;const cy=H*(H>W?.2:.26);
  ctx.save();ctx.globalAlpha=a;ctx.translate(W/2,cy);ctx.scale(sc,sc);
  const g=ctx.createLinearGradient(0,-lines.length*lh/2,0,lines.length*lh/2);g.addColorStop(0,'#FFFFFF');g.addColorStop(.55,'#E3E6EA');g.addColorStop(1,'#A9AFB8');
  ctx.font=font;ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=fs*.45;
  lines.forEach((ln,i)=>{const y=(i-(lines.length-1)/2)*lh;ctx.fillStyle=g;ctx.fillText(ln.map(w=>w.t).join(' '),0,y)});
  ctx.restore();ctx.textAlign='left';
}
function drawEnd(t){
  const e=S.cfg.end,p=(t-contentDur);const a=ease(p/.45);
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#0B0C0E';ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(W/2,H*.42,0,W/2,H*.42,Math.max(W,H)*.6);rg.addColorStop(0,'rgba(220,224,229,.13)');rg.addColorStop(1,'rgba(220,224,229,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);
  const rise=(1-ease(p/.6))*H*.02;let y=H*.42+rise;const m=Math.min(W,H*.5625);
  if(S.logo){const lw=m*.3,lh=lw*S.logo.naturalHeight/S.logo.naturalWidth,lhh=Math.min(lh,m*.3),lww=lhh*S.logo.naturalWidth/S.logo.naturalHeight;ctx.drawImage(S.logo,(W-lww)/2,y-lhh-m*.04,lww,lhh);y+=m*.06}
  ctx.textAlign='center';ctx.textBaseline='middle';
  if(e.text.trim()){const serif=S.cfg.font==='s';const fs=m*(serif?.085:.1);ctx.font=serif?`italic 700 ${fs}px ${FONT.s}`:`700 ${fs}px ${FONT.d}`;
    const g=ctx.createLinearGradient(0,y-fs/2,0,y+fs/2);g.addColorStop(0,'#fff');g.addColorStop(.55,'#E1E4E8');g.addColorStop(1,'#9097A1');ctx.fillStyle=g;
    const tx=serif?e.text.trim():upName(e.text.trim());let f2=fs;while(ctx.measureText(tx).width>W*.86&&f2>fs*.4){f2*=.94;ctx.font=serif?`italic 700 ${f2}px ${FONT.s}`:`700 ${f2}px ${FONT.d}`}ctx.fillText(tx,W/2,y+(S.logo?0:-fs*.2));y+=fs*.95}
  if(e.sub.trim()){const fs=m*.042;ctx.font=`500 ${fs}px Inter`;ctx.fillStyle='#9BA0A8';ctx.fillText(e.sub.trim(),W/2,y+fs*.3)}
  ctx.restore();ctx.textAlign='left';
}
function drawWatermark(){if(!S.cfg.wm.on||!S.logo)return;const m=Math.min(W,H*.5625),lw=m*.15,lh=lw*S.logo.naturalHeight/S.logo.naturalWidth;ctx.save();ctx.globalAlpha=.88;ctx.drawImage(S.logo,W-lw-m*.045,m*.06,lw,Math.min(lh,m*.15));ctx.restore()}

function draw(t){
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  if(!S.segs.length)return;
  const inEnd=t>=contentDur&&S.cfg.end.on;
  const i=P.playing&&!inEnd?P.i:segAt(Math.min(t,contentDur-.001));
  const g=S.segs[i];
  if(g)drawMedia(g,Math.min(t,contentDur));
  if(!inEnd){drawWatermark();drawCaption(t);drawHook(t)}
  else drawEnd(t);
}

/* ---------------- ses ---------------- */
let AC=null,master,clipGain,musicGain,recDest,musicNode=null;
function ensureAudio(){
  if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();
    master=AC.createGain();clipGain=AC.createGain();musicGain=AC.createGain();
    clipGain.connect(master);musicGain.connect(master);master.connect(AC.destination);
    try{recDest=AC.createMediaStreamDestination();master.connect(recDest)}catch(e){recDest=null}}
  for(const s of S.sources)if(s.kind==='video'&&!s.nodes){s.nodes=s.els.map(el=>{const n=AC.createMediaElementSource(el);n.connect(clipGain);return n})}
  clipGain.gain.value=S.cfg.clipVol;
  if(AC.state==='suspended')AC.resume();
}
function duckRegions(){const r=[];for(const c of S.caps.slice().sort((a,b)=>a.s-b.s)){const l=r[r.length-1];if(l&&c.s-l[1]<.7)l[1]=Math.max(l[1],c.e);else r.push([c.s,c.e])}return r}
function musicVol(t,regs){
  const M=S.cfg.music;let v=M.vol;
  if(M.fade){v*=clamp(t/1.2,0,1)*clamp((total-t)/1.6,0,1)}
  if(M.duck){let d=1;for(const [s,e] of regs){if(t>=s&&t<=e){d=.32;break}if(t>=s-.25&&t<s)d=Math.min(d,1-.68*(t-(s-.25))/.25);if(t>e&&t<=e+.4)d=Math.min(d,.32+.68*(t-e)/.4)}v*=d}
  return v}
function startMusic(t0){
  stopMusic();if(!S.music||!AC)return;
  const n=AC.createBufferSource();n.buffer=S.music.buf;n.loop=true;n.connect(musicGain);
  const regs=duckRegions(),T=AC.currentTime+.02,g=musicGain.gain;
  g.cancelScheduledValues(0);g.setValueAtTime(musicVol(t0,regs),T);
  const pts=new Set([1.2,total-1.6,total]);for(const [s,e] of regs){pts.add(s-.25);pts.add(s);pts.add(e);pts.add(e+.4)}
  [...pts].filter(x=>x>t0&&x<=total).sort((a,b)=>a-b).forEach(x=>g.linearRampToValueAtTime(musicVol(x,regs),T+(x-t0)));
  n.start(T,t0%S.music.buf.duration);musicNode=n}
function stopMusic(){if(musicNode){try{musicNode.stop()}catch(e){}musicNode.disconnect();musicNode=null}}

/* ---------------- oynatıcı ---------------- */
const P={playing:false,t:0,i:0,mode:'seg',clock:0,onEnd:null};
function startSeg(i,offset){
  P.i=i;P.mode='seg';const g=S.segs[i];const s=srcOf(g);
  if(s.kind==='video'){const target=g.in+offset;if(Math.abs(g.el.currentTime-target)>.06)g.el.currentTime=target;const pr=g.el.play();if(pr)pr.catch(()=>{})}
  else P.clock=now()-offset;
  const n=S.segs[i+1];if(n&&n.el&&n.el!==g.el){n.el.pause();if(Math.abs(n.el.currentTime-n.in)>.06)n.el.currentTime=n.in}
}
function advance(){
  const g=S.segs[P.i],n=S.segs[P.i+1];
  if(n){if(g.el&&g.el!==n.el)g.el.pause();startSeg(P.i+1,0)}
  else{if(g&&g.el)g.el.pause();if(S.cfg.end.on){P.mode='end';P.clock=now()-(P.t-contentDur)}else finish()}
}
function finish(){pause();P.t=total;dirty=true;const f=P.onEnd;P.onEnd=null;if(f)f()}
function play(){
  if(!S.segs.length)return;ensureAudio();
  if(P.t>=total-.05)P.t=0;
  P.playing=true;$('#btn-play').textContent='❚❚';$('#btn-play').setAttribute('aria-label','Durdur');
  if(P.t>=contentDur){P.mode='end';P.clock=now()-(P.t-contentDur)}
  else{const i=segAt(P.t);startSeg(i,P.t-S.segs[i].t0)}
  startMusic(P.t);
}
function pause(){P.playing=false;for(const s of S.sources)if(s.els)s.els.forEach(e=>e.pause());stopMusic();$('#btn-play').textContent='▶';$('#btn-play').setAttribute('aria-label','Oynat')}
function seek(t){const was=P.playing;if(was)pause();P.t=clamp(t,0,total);showFrame();if(was)play();}
function showFrame(){
  if(!S.segs.length){dirty=true;return}
  if(P.t<contentDur){const i=segAt(P.t),g=S.segs[i];P.i=i;if(g.el){const target=g.in+(P.t-g.t0);g.el.currentTime=Math.min(target,g.el.duration-.05||target);g.el.addEventListener('seeked',()=>{dirty=true},{once:true})}}
  dirty=true}
function tick(){
  if(P.playing){
    if(P.mode==='seg'){const g=S.segs[P.i];
      if(!g){finish()}
      else if(g.el){const ct=g.el.currentTime;P.t=g.t0+Math.max(0,ct-g.in);if(ct>=g.out-.03||g.el.ended)advance()}
      else{P.t=g.t0+(now()-P.clock);if(P.t>=g.t0+len(g))advance()}}
    else{P.t=contentDur+(now()-P.clock);if(P.t>=total)finish()}
    dirty=true}
  if(dirty){draw(P.t);dirty=false;updateClock()}
  requestAnimationFrame(tick);
}
let lastHi=-1,lastCap=-1;
function updateClock(){
  $('#tc').textContent=fmtT(P.t)+' / '+fmtT(total);
  if(!scrubbing)$('#scrub').value=total?Math.round(P.t/total*1000):0;
  if(P.exporting)setExpProgress(P.t/total);
  const i=S.segs.length&&P.t<contentDur?(P.playing?P.i:segAt(P.t)):-1;
  if(i!==lastHi){lastHi=i;$$('#segs .seg').forEach((li,k)=>li.classList.toggle('cur',k===i))}
  const ci=S.caps.findIndex(c=>P.t>=c.s&&P.t<c.e);
  if(ci!==lastCap){lastCap=ci;$$('#caps .cap').forEach((li,k)=>li.classList.toggle('cur',k===ci))}
}

/* ---------------- dosyalar ---------------- */
function mkVid(url){const v=document.createElement('video');v.playsInline=true;v.preload='auto';v.src=url;v.setAttribute('playsinline','');$('#media-pool').appendChild(v);return v}
const once=(el,ev)=>new Promise((res,rej)=>{el.addEventListener(ev,res,{once:true});el.addEventListener('error',()=>rej(new Error('yuklenemedi')),{once:true})});
async function addFiles(files){
  let added=0;
  for(const f of files){
    try{
      if(f.type.startsWith('audio/')){await setMusic(f);continue}
      const url=URL.createObjectURL(f);
      if(f.type.startsWith('image/')){
        const img=new Image();img.src=url;await img.decode();
        const s={id:nid(),kind:'image',name:f.name,file:f,url,img,dur:3,thumb:url};S.sources.push(s);
        S.segs.push({id:nid(),src:s.id,in:0,out:3});added++}
      else{
        const els=[mkVid(url),mkVid(url)];await once(els[0],'loadedmetadata');
        const s={id:nid(),kind:'video',name:f.name,file:f,url,els,dur:els[0].duration,thumb:null};S.sources.push(s);
        S.segs.push({id:nid(),src:s.id,in:0,out:r1(s.dur)});added++;
        makeThumb(s);
        if(AC)ensureAudio()}
    }catch(e){toast('“'+f.name+'” açılamadı. MP4, MOV, JPG veya PNG dene.',4000)}
  }
  if(added){layout();renderSegs();if(P.t>total)P.t=0;showFrame();toast(added+' dosya eklendi')}
}
async function makeThumb(s){
  try{const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.src=s.url;await once(v,'loadeddata');v.currentTime=Math.min(1,s.dur/3);await once(v,'seeked');
    const c=document.createElement('canvas');c.width=128;c.height=128;drawCoverOn(c,v);s.thumb=c.toDataURL('image/jpeg',.7);v.removeAttribute('src');v.load();renderSegs()}catch(e){}
}
function drawCoverOn(c,v){const x=c.getContext('2d');const sc=Math.max(c.width/v.videoWidth,c.height/v.videoHeight);const w=v.videoWidth*sc,h=v.videoHeight*sc;x.drawImage(v,(c.width-w)/2,(c.height-h)/2,w,h)}
async function setMusic(f){
  ensureAudio();
  try{const buf=await AC.decodeAudioData(await f.arrayBuffer());S.music={name:f.name,buf};$('#music-name').textContent=f.name;$('#btn-music-x').hidden=false;toast('Müzik eklendi');if(P.playing){startMusic(P.t)}}
  catch(e){toast('Bu müzik dosyası açılamadı. MP3 veya M4A dene.',4000)}
}
async function setLogo(f){const url=URL.createObjectURL(f);const img=new Image();img.src=url;try{await img.decode()}catch(e){toast('Logo açılamadı');return}S.logo=img;$('#logo-prev').src=url;$('#logo-prev').hidden=false;$('#btn-logo-x').hidden=false;dirty=true}

/* ---------------- parça listesi ---------------- */
function renderSegs(){
  const ol=$('#segs');$('#segs-empty').hidden=!!S.segs.length;$('#drop').hidden=!!S.segs.length;
  ol.innerHTML=S.segs.map((g,i)=>{const s=srcOf(g);const img=s.kind==='image';
    return `<li class="seg" data-i="${i}">
      <div class="th" style="${s.thumb?`background-image:url('${s.thumb}')`:''}"><span>${fmtT(len(g))}</span></div>
      <div><div class="nm" title="${esc(s.name)}">${i+1}. ${esc(s.name)}</div>
        <div class="io">${img?`Süre <input type="number" step="0.1" min="0.5" max="30" data-k="dur" value="${r1(len(g))}"> sn`:`Baş <input type="number" step="0.1" min="0" max="${r1(s.dur)}" data-k="in" value="${r1(g.in)}"> Son <input type="number" step="0.1" min="0" max="${r1(s.dur)}" data-k="out" value="${r1(g.out)}">`}</div></div>
      <div class="acts">${img?'':`<button data-a="setin" title="Oynatma çizgisinin olduğu yerden başlat">Buradan başla</button><button data-a="setout" title="Oynatma çizgisinin olduğu yerde bitir">Burada bitir</button><button data-a="split">Böl</button>`}
        <button data-a="upp" aria-label="Yukarı taşı">▲</button><button data-a="down" aria-label="Aşağı taşı">▼</button><button data-a="del" class="x">Sil</button></div></li>`}).join('');
  lastHi=-1;
}
$('#segs').addEventListener('change',e=>{
  const inp=e.target.closest('input');if(!inp)return;const i=+inp.closest('.seg').dataset.i,g=S.segs[i],s=srcOf(g);let v=parseFloat(inp.value);if(isNaN(v))return;
  if(inp.dataset.k==='dur'){g.out=g.in+clamp(v,.5,30)}
  else if(inp.dataset.k==='in'){g.in=clamp(v,0,g.out-.2)}
  else{g.out=clamp(v,g.in+.2,s.dur)}
  pause();layout();renderSegs();P.t=Math.min(P.t,total);showFrame();
});
$('#segs').addEventListener('click',e=>{
  const b=e.target.closest('button');const li=e.target.closest('.seg');if(!li)return;const i=+li.dataset.i,g=S.segs[i];
  if(!b){if(e.target.closest('input'))return;pause();P.t=g.t0;showFrame();return}
  const a=b.dataset.a;pause();
  const inSeg=P.t>=g.t0&&P.t<g.t0+len(g),local=g.in+(P.t-g.t0);
  if(a==='setin'||a==='setout'||a==='split'){if(!inSeg){toast('Önce oynatma çizgisini bu parçanın içine getir');return}}
  if(a==='setin'){if(g.out-local<.2)return;g.in=r1(local)}
  else if(a==='setout'){if(local-g.in<.2)return;g.out=r1(local)}
  else if(a==='split'){if(local-g.in<.2||g.out-local<.2)return;S.segs.splice(i+1,0,{id:nid(),src:g.src,in:local,out:g.out});g.out=local;toast('Parça ikiye bölündü')}
  else if(a==='upp'&&i>0){[S.segs[i-1],S.segs[i]]=[S.segs[i],S.segs[i-1]]}
  else if(a==='down'&&i<S.segs.length-1){[S.segs[i+1],S.segs[i]]=[S.segs[i],S.segs[i+1]]}
  else if(a==='del'){S.segs.splice(i,1);const used=new Set(S.segs.map(x=>x.src));S.sources=S.sources.filter(s=>{if(used.has(s.id))return true;if(s.els)s.els.forEach(v=>{v.pause();v.remove()});URL.revokeObjectURL(s.url);return false})}
  layout();renderSegs();P.t=clamp(a==='setin'?g.t0:P.t,0,total);showFrame();
});

/* ---------------- ses analizi (sessizlik + altyazı) ---------------- */
async function pcmOf(s){
  if(s.pcm!==undefined)return s.pcm;
  ensureAudio();
  try{const dec=await AC.decodeAudioData(await s.file.arrayBuffer());
    const off=new OfflineAudioContext(1,Math.max(1,Math.ceil(dec.duration*16000)),16000);const n=off.createBufferSource();n.buffer=dec;n.connect(off.destination);n.start();
    const r=await off.startRendering();s.pcm=r.getChannelData(0)}
  catch(e){s.pcm=null}
  return s.pcm}
function speechRanges(pcm,a,b){
  const F=320,i0=Math.floor(a*16000/F),i1=Math.floor(b*16000/F),db=[];
  for(let i=i0;i<i1;i++){let sum=0;const o=i*F;for(let k=0;k<F;k++){const v=pcm[o+k]||0;sum+=v*v}db.push(10*Math.log10(sum/F+1e-10))}
  if(!db.length)return[[a,b]];
  const sorted=db.slice().sort((x,y)=>x-y),p95=sorted[Math.floor(sorted.length*.95)];
  const thr=Math.max(p95-26,-52);
  const out=[];let st=-1,gap=0;const minGap=Math.round(.5/.02);
  db.forEach((d,k)=>{if(d>thr){if(st<0)st=k;gap=0}else if(st>=0){gap++;if(gap>=minGap){out.push([st,k-gap+1]);st=-1;gap=0}}});
  if(st>=0)out.push([st,db.length-gap]);
  return out.map(([x,y])=>[Math.max(a,a+x*.02-.12),Math.min(b,a+y*.02+.15)]).filter(([x,y])=>y-x>=.3)
}
$('#btn-silence').addEventListener('click',async e=>{
  if(!S.segs.some(g=>srcOf(g).kind==='video')){toast('Önce bir video ekle');return}
  const b=e.currentTarget;b.disabled=true;b.textContent='Sesler inceleniyor…';pause();
  const before=contentDur;const next=[];let noAudio=0;
  for(const g of S.segs){const s=srcOf(g);if(s.kind!=='video'){next.push(g);continue}
    const pcm=await pcmOf(s);if(!pcm){noAudio++;next.push(g);continue}
    const rs=speechRanges(pcm,g.in,g.out);
    if(!rs.length){next.push(g);continue}
    rs.forEach(([x,y])=>next.push({id:nid(),src:g.src,in:x,out:y}))}
  S.segs=next;layout();renderSegs();P.t=0;showFrame();
  b.disabled=false;b.textContent='Sessizlikleri kes';
  const cut=before-contentDur;
  toast(cut>.3?`${r1(cut)} sn sessizlik kesildi`:noAudio?'Videoda ses bulunamadı':'Kesilecek uzun sessizlik yok',3500);
});

let worker=null;
function asrProg(p,txt){const el=$('#asr-prog');el.hidden=false;el.querySelector('i').style.width=Math.round(p*100)+'%';el.querySelector('span').textContent=txt}
$('#btn-asr').addEventListener('click',async e=>{
  const vids=S.segs.filter(g=>srcOf(g).kind==='video');if(!vids.length){toast('Önce bir video ekle');return}
  if(S.caps.length&&!confirm('Mevcut altyazılar silinip yeniden oluşturulsun mu?'))return;
  const b=e.currentTarget;b.disabled=true;pause();
  asrProg(0,'Ses hazırlanıyor…');
  const parts=[];let any=false;
  for(const g of S.segs){const s=srcOf(g);const n=Math.round(len(g)*16000);let pcm=s.kind==='video'?await pcmOf(s):null;
    if(pcm){any=true;parts.push(pcm.subarray(Math.round(g.in*16000),Math.round(g.in*16000)+n))}else parts.push(new Float32Array(n))}
  if(!any){toast('Videoda ses bulunamadı');b.disabled=false;$('#asr-prog').hidden=true;return}
  const audio=new Float32Array(parts.reduce((a,p)=>a+p.length,0));let o=0;for(const p of parts){audio.set(p,o);o+=p.length}
  if(!worker)worker=new Worker('zc-asr.js',{type:'module'});
  const files={};
  worker.onmessage=ev=>{const d=ev.data;
    if(d.type==='dl'){files[d.file]=[d.loaded||0,d.total||0];const L=Object.values(files).reduce((a,x)=>a+x[0],0),T=Object.values(files).reduce((a,x)=>a+x[1],0);asrProg(T?L/T*.6:.05,'Yapay zekâ modeli iniyor… '+(T?Math.round(L/T*100)+'%':''))}
    else if(d.type==='status')asrProg(d.p||.65,d.msg);
    else if(d.type==='done'){S.caps=buildCaps(d.chunks,d.text);renderCaps();dirty=true;asrProg(1,S.caps.length+' satır altyazı hazır');b.disabled=false;toast('Altyazı hazır. Hatalı kelimeleri aşağıdan düzeltebilirsin.',4000);setTimeout(()=>$('#asr-prog').hidden=true,2500)}
    else if(d.type==='error'){asrProg(0,'Hata: '+d.msg);b.disabled=false;toast('Altyazı oluşturulamadı. İnternet bağlantını kontrol edip tekrar dene.',5000)}
  };
  worker.postMessage({audio,model:$('#asr-model').value,lang:$('#asr-lang').value},[audio.buffer]);
});
function buildCaps(chunks,text){
  const words=(chunks||[]).map(c=>({t:String(c.text||'').trim(),s:c.timestamp?.[0]??0,e:c.timestamp?.[1]??null})).filter(w=>w.t);
  words.forEach((w,i)=>{if(w.e==null||w.e<=w.s)w.e=(words[i+1]?.s??w.s+.4)});
  const word=words.length&&words.every(w=>!/\s/.test(w.t));
  if(!word){ // cümle bazlı zaman: kelimelere eşit böl
    const out=[];for(const c of words){const ws=c.t.split(/\s+/),d=(c.e-c.s)/ws.length;ws.forEach((x,k)=>out.push({t:x,s:c.s+k*d,e:c.s+(k+1)*d}))}words.splice(0,words.length,...out)}
  const caps=[];let cur=[];
  const flush=()=>{if(!cur.length)return;caps.push({s:cur[0].s,e:cur[cur.length-1].e,t:cur.map(w=>w.t).join(' '),w:cur.map(w=>({s:w.s,e:w.e}))});cur=[]};
  words.forEach((w,i)=>{const prev=cur[cur.length-1];
    if(prev&&(w.s-prev.e>.45||cur.length>=3||(cur.map(x=>x.t).join(' ')+' '+w.t).length>22))flush();
    cur.push(w);if(/[.!?,;:…]$/.test(w.t))flush()});
  flush();
  caps.forEach((c,i)=>{const n=caps[i+1];if(c.e-c.s<.45)c.e=c.s+.45;if(n&&n.s-c.e<.3)c.e=n.s;if(n&&c.e>n.s)c.e=n.s;c.t=c.t.replace(/\s+([.,!?;:])/g,'$1')});
  return caps.filter(c=>c.e>c.s);
}

/* ---------------- altyazı listesi ---------------- */
function renderCaps(){
  $('#caps-empty').hidden=!!S.caps.length;
  $('#caps').innerHTML=S.caps.map((c,i)=>`<li class="cap" data-i="${i}"><div class="top"><input type="number" step="0.1" min="0" data-k="s" value="${r1(c.s)}" aria-label="Başlangıç"> – <input type="number" step="0.1" min="0" data-k="e" value="${r1(c.e)}" aria-label="Bitiş"><span class="acts"><button data-a="go">Git</button><button data-a="del" class="x">Sil</button></span></div><textarea rows="1" data-k="t">${esc(c.t)}</textarea></li>`).join('');lastCap=-1}
$('#caps').addEventListener('input',e=>{const t=e.target;const li=t.closest('.cap');if(!li)return;const c=S.caps[+li.dataset.i];
  if(t.dataset.k==='t'){const n=t.value.trim().split(/\s+/).length;if(c.w&&c.w.length!==n)c.w=null;c.t=t.value}
  else{const v=parseFloat(t.value);if(!isNaN(v)){c[t.dataset.k]=Math.max(0,v);c.w=null}}dirty=true});
$('#caps').addEventListener('change',e=>{if(e.target.dataset.k!=='t'){S.caps.sort((a,b)=>a.s-b.s);renderCaps()}});
$('#caps').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const i=+b.closest('.cap').dataset.i;
  if(b.dataset.a==='del'){S.caps.splice(i,1);renderCaps()}else{pause();P.t=S.caps[i].s+.01;showFrame()}dirty=true});
$('#btn-cap-add').addEventListener('click',()=>{if(!S.segs.length){toast('Önce bir video ekle');return}const s=Math.min(P.t,Math.max(0,contentDur-1));S.caps.push({s,e:Math.min(s+1.6,contentDur),t:'Yeni yazı'});S.caps.sort((a,b)=>a.s-b.s);renderCaps();dirty=true;const i=S.caps.findIndex(c=>c.s===s);const ta=$$('#caps textarea')[i];if(ta){ta.focus();ta.select()}});

/* ---------------- dışa aktarma ---------------- */
function pickMime(){const list=['video/mp4;codecs=avc1.640028,mp4a.40.2','video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];return list.find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m))||''}
let rec=null,cancelled=false;
function setExpProgress(p){$('#exp-bar').style.width=Math.round(clamp(p,0,1)*100)+'%';$('#exp-pct').textContent=Math.round(clamp(p,0,1)*100)+'%'}
$('#btn-export').addEventListener('click',()=>{
  if(!S.segs.length){toast('Önce bir video ekle');return}
  if(!window.MediaRecorder||!cv.captureStream){alert('Bu tarayıcı video kaydetmeyi desteklemiyor. Bilgisayarda Chrome ile dene.');return}
  ensureAudio();pause();
  const mime=pickMime();const vs=cv.captureStream(30);const tracks=[...vs.getVideoTracks()];if(recDest)tracks.push(...recDest.stream.getAudioTracks());
  const chunks=[];cancelled=false;
  try{rec=new MediaRecorder(new MediaStream(tracks),{mimeType:mime||undefined,videoBitsPerSecond:W*H>1.5e6?9e6:6e6,audioBitsPerSecond:192000})}catch(e){rec=new MediaRecorder(new MediaStream(tracks))}
  rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
  rec.onstop=()=>{vs.getTracks().forEach(t=>t.stop());P.exporting=false;if(cancelled){$('#exp').hidden=true;return}
    const type=rec.mimeType||mime||'video/webm';const blob=new Blob(chunks,{type});const ext=type.includes('mp4')?'mp4':'webm';
    const d=new Date();const name=`zodclip-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}.${ext}`;
    const a=$('#exp-dl');a.href=URL.createObjectURL(blob);a.download=name;a.hidden=false;a.click();
    $('#exp-t').textContent='Video hazır';$('#exp-msg').textContent=`${name} · ${(blob.size/1048576).toFixed(1)} MB`+(ext==='webm'?' · WebM biçiminde (Instagram kabul eder; sorun olursa Chrome’un güncel sürümünü kullan).':'');
    $('#exp-cancel').textContent='Kapat';setExpProgress(1)};
  $('#exp-t').textContent='Video hazırlanıyor';$('#exp-msg').textContent='Video baştan sona bir kez oynatılarak kaydediliyor. Bu sekmeden ayrılma.';$('#exp-dl').hidden=true;$('#exp-cancel').textContent='Vazgeç';setExpProgress(0);$('#exp').hidden=false;
  P.t=0;showFrame();P.exporting=true;
  setTimeout(()=>{rec.start(250);P.onEnd=()=>{setTimeout(()=>{if(rec&&rec.state!=='inactive')rec.stop()},200)};play()},350);
});
$('#exp-cancel').addEventListener('click',()=>{if(rec&&rec.state!=='inactive'){cancelled=true;P.onEnd=null;pause();rec.stop()}else{$('#exp').hidden=true}});
$('#btn-cover').addEventListener('click',()=>{if(!S.segs.length){toast('Önce bir video ekle');return}draw(P.t);cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='zodclip-kapak.jpg';a.click()},'image/jpeg',.92)});

/* ---------------- ayar paneli ---------------- */
function chips(sel,get,set){const box=$(sel);const sync=()=>$$(sel+' button').forEach(b=>b.classList.toggle('on',b.dataset.v===get()));box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;set(b.dataset.v);sync();dirty=true});sync();return sync}
function bindInput(sel,get,set,ev='input'){const el=$(sel);const isChk=el.type==='checkbox';const v=get();if(isChk)el.checked=v;else el.value=v;el.addEventListener(ev,()=>{set(isChk?el.checked:(el.type==='range'||el.type==='number'?parseFloat(el.value):el.value));dirty=true})}
let syncCap,syncFilter;
function start(){
  setFormat();layout();renderSegs();renderCaps();requestAnimationFrame(tick);
  if(document.fonts)Promise.all(['700 40px "Archivo Narrow"','800 40px Inter','500 40px Inter','italic 700 40px "Playfair Display"'].map(f=>document.fonts.load(f))).then(()=>dirty=true);
  $$('.tabs button').forEach(b=>b.addEventListener('click',()=>{$$('.tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));$$('.pane').forEach(p=>p.hidden=p.dataset.pane!==b.dataset.tab)}));
  syncCap=chips('#cap-styles',()=>S.cfg.cap.style,v=>S.cfg.cap.style=v);
  chips('#fmts',()=>S.cfg.fmt,v=>{S.cfg.fmt=v;setFormat()});
  chips('#fits',()=>S.cfg.fit,v=>S.cfg.fit=v);
  syncFilter=chips('#filters',()=>S.cfg.filter,v=>S.cfg.filter=v);
  const syncPre=chips('#presets',()=>S.cfg.preset,v=>{const p=PRESETS[v];S.cfg.preset=v;S.cfg.filter=p.filter;S.cfg.cap.style=p.cap;S.cfg.font=p.font;S.cfg.cap.size=p.size||1;$('#cap-size').value=S.cfg.cap.size;syncCap();syncFilter()});
  bindInput('#cap-size',()=>S.cfg.cap.size,v=>S.cfg.cap.size=v);
  bindInput('#cap-pos',()=>S.cfg.cap.pos,v=>S.cfg.cap.pos=v);
  bindInput('#cap-upper',()=>S.cfg.cap.upper,v=>S.cfg.cap.upper=v);
  bindInput('#hook-on',()=>S.cfg.hook.on,v=>S.cfg.hook.on=v);
  bindInput('#hook-text',()=>S.cfg.hook.text,v=>S.cfg.hook.text=v);
  bindInput('#hook-dur',()=>S.cfg.hook.dur,v=>S.cfg.hook.dur=clamp(v||2.5,1,6));
  bindInput('#end-on',()=>S.cfg.end.on,v=>{S.cfg.end.on=v;layout();P.t=Math.min(P.t,total)});
  bindInput('#end-text',()=>S.cfg.end.text,v=>S.cfg.end.text=v);
  bindInput('#end-sub',()=>S.cfg.end.sub,v=>S.cfg.end.sub=v);
  bindInput('#end-dur',()=>S.cfg.end.dur,v=>{S.cfg.end.dur=clamp(v||2.5,1,6);layout()});
  bindInput('#wm-on',()=>S.cfg.wm.on,v=>{S.cfg.wm.on=v;if(v&&!S.logo)toast('Önce logo yükle')});
  bindInput('#clip-vol',()=>S.cfg.clipVol,v=>{S.cfg.clipVol=v;if(clipGain)clipGain.gain.value=v});
  bindInput('#music-vol',()=>S.cfg.music.vol,v=>{S.cfg.music.vol=v;if(P.playing)startMusic(P.t)});
  bindInput('#music-duck',()=>S.cfg.music.duck,v=>S.cfg.music.duck=v);
  bindInput('#music-fade',()=>S.cfg.music.fade,v=>S.cfg.music.fade=v);
  $('#f-media').addEventListener('change',e=>{addFiles([...e.target.files]);e.target.value=''});
  $('#f-music').addEventListener('change',e=>{if(e.target.files[0])setMusic(e.target.files[0]);e.target.value=''});
  $('#f-logo').addEventListener('change',e=>{if(e.target.files[0])setLogo(e.target.files[0]);e.target.value=''});
  $('#btn-logo-x').addEventListener('click',()=>{S.logo=null;$('#logo-prev').hidden=true;$('#btn-logo-x').hidden=true;dirty=true});
  $('#btn-music-x').addEventListener('click',()=>{stopMusic();S.music=null;$('#music-name').textContent='Seçilmedi';$('#btn-music-x').hidden=true});
  $('#btn-play').addEventListener('click',()=>P.playing?pause():play());
  const sc=$('#scrub');sc.addEventListener('pointerdown',()=>scrubbing=true);sc.addEventListener('input',()=>{scrubbing=true;seek(sc.value/1000*total)});sc.addEventListener('change',()=>scrubbing=false);sc.addEventListener('pointerup',()=>scrubbing=false);
  document.addEventListener('keydown',e=>{if(e.code==='Space'&&!/INPUT|TEXTAREA|SELECT|BUTTON/.test(document.activeElement.tagName)){e.preventDefault();P.playing?pause():play()}});
  ['dragenter','dragover'].forEach(ev=>document.addEventListener(ev,e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){e.preventDefault();document.body.classList.add('dragging')}}));
  ['dragleave','drop'].forEach(ev=>document.addEventListener(ev,e=>{if(ev==='dragleave'&&e.relatedTarget)return;document.body.classList.remove('dragging')}));
  document.addEventListener('drop',e=>{if(e.dataTransfer&&e.dataTransfer.files.length){e.preventDefault();addFiles([...e.dataTransfer.files])}});
  window.addEventListener('beforeunload',e=>{if(S.segs.length){e.preventDefault();e.returnValue=''}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&P.exporting)toast('Video kaydı sürerken sekmede kal, yoksa video takılabilir.',5000)});
}
let scrubbing=false;
window.ZC={S,P,addFiles,play,pause,seek,buildCaps,speechRanges,get total(){return total}};
gate();
})();
