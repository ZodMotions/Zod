/* ZodClip — tarayıcıda çalışan Reels kurgu stüdyosu.
   Her şey kullanıcının cihazında işlenir; dosyalar hiçbir sunucuya yüklenmez. */
(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const now=()=>performance.now()/1000;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtT=t=>{t=Math.max(0,t||0);const m=Math.floor(t/60),s=Math.floor(t%60);return m+':'+String(s).padStart(2,'0')};
const fmtT1=t=>{t=Math.max(0,t||0);return fmtT(t)+'.'+Math.floor((t%1)*10)};
const r1=v=>Math.round(v*10)/10, r2=v=>Math.round(v*100)/100;
const up=s=>s.toLocaleUpperCase('tr');
const upName=s=>/[ğüşöçıİĞÜŞÖÇ]/.test(s)?s.toLocaleUpperCase('tr'):s.toUpperCase();
const ease=p=>1-Math.pow(1-clamp(p,0,1),3);
const eback=x=>{x=clamp(x,0,1);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
let toastT;function toast(m,ms=2600){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms)}
const ZM=window.ZM||null;
const TPL=new Map();if(ZM)ZM.TEMPLATES.forEach(t=>TPL.set(t.id,t));

/* ================= giriş + abonelik ================= */
const ACCESS={motionWm:false};
async function gate(){
  const msg=$('#gate-msg');
  if(!window.ZMA){msg.textContent='Hesap sistemi yüklenemedi. Sayfayı yenile.';return}
  try{await ZMA.ready}catch(e){}
  const u=ZMA.user&&ZMA.user();
  if(!u){msg.textContent='ZodClip, ZodMotions aboneliğine dahildir. Devam etmek için hesabınla giriş yap.';$('#gate-login').hidden=false;return}
  const a=await ZMA.zodclipAccess();
  if(!a||!a.ok){msg.textContent='ZodClip aktif abonelikle açılır (Başlangıç, Pro veya Ajans). Aboneliğin yoksa ya da süresi dolduysa bir paket seç; motionları filigranlı kullanmaya ZodMotions’ta devam edebilirsin.';$('#gate-plans').hidden=false;$('#gate-acct').hidden=false;return}
  const p=u.profile||{};const owner=String(u.email||'').toLowerCase()==='info@zodiacwebdesign.com';
  ACCESS.motionWm=!owner&&!(p.motion_left===null||p.motion_left===undefined||p.motion_left>0);
  ACCESS.firma=(p.firma||'').trim();if(ACCESS.firma){S.cfg.end.text=ACCESS.firma;S.cfg.end.on=true}
  $('#gate').hidden=true;$('#app').hidden=false;start();
}
$('#btn-out').addEventListener('click',async()=>{if(!confirm('Çıkış yapılsın mı? Projen bu cihazda kayıtlı kalır.'))return;try{await ZMA.signOut()}catch(e){}location.reload()});

/* ================= durum ================= */
const FORMATS={'9:16':[1080,1920],'4:5':[1080,1350],'1:1':[1080,1080],'16:9':[1920,1080]};
const FILTERS={none:'none',sicak:'saturate(1.12) sepia(.14) contrast(1.05)',soguk:'saturate(1.05) hue-rotate(-10deg) contrast(1.06) brightness(1.02)',canli:'saturate(1.32) contrast(1.1)',sinema:'contrast(1.16) saturate(.82) brightness(.95)',sb:'grayscale(1) contrast(1.12)'};
const PRESETS={modern:{filter:'none',cap:'vurgu'},luks:{filter:'sinema',cap:'zarif'},enerjik:{filter:'canli',cap:'neon',size:1.1},kurumsal:{filter:'soguk',cap:'kutu'}};
const TRANS=[['none','Yok'],['fade','Geçiş'],['black','Karartma'],['slide','Kaydır'],['zoom','Yakınlaş'],['wipe','Sil']];
const FONTS={d:['"Archivo Narrow"','700','Archivo'],b:['Inter','800','Inter'],s:['"Playfair Display"','italic 700','Zarif'],u:['Unbounded','700','Unbounded'],c:['"Big Shoulders Display"','900','Kalın'],m:['"JetBrains Mono"','500','Daktilo']};
const COLORS=['#FFFFFF','#0B0C0E','#FFD84D','#FF5C7A','#5EEAD4','#7C5CFF','#F2A33A','#9BE15D'];
const S={
  sources:[],items:[],ovs:[],texts:[],caps:[],logo:null,music:null,
  cfg:{fmt:'9:16',fit:'blur',filter:'none',preset:'modern',
    cap:{style:'vurgu',size:1,pos:.7,upper:true},
    end:{on:false,text:'',sub:'',dur:2.5},
    wm:{on:false},clipVol:1,music:{vol:.35,duck:true,fade:true,start:0}}
};
let uid=0;const nid=()=>++uid;
const srcById=id=>S.sources.find(s=>s.id===id);
const idur=it=>it.type==='video'?Math.max(.05,(it.out-it.in)/(it.speed||1)):Math.max(.2,it.dur);
let contentDur=0,total=0;
function layout(){
  let t=0,prev=null;
  for(const it of S.items){
    it.t0=t;t+=idur(it);
    const s=it.type==='video'?srcById(it.src):null;
    it.el=s?((prev&&prev.src===it.src&&prev.el===s.els[0])?s.els[1]:s.els[0]):null;
    prev=it}
  contentDur=t;total=t+(S.cfg.end.on&&S.items.length?S.cfg.end.dur:0);
}
function idxAt(t){for(let i=0;i<S.items.length;i++){const it=S.items[i];if(t<it.t0+idur(it))return i}return S.items.length-1}

/* ================= tuval ================= */
const cv=$('#cv'),ctx=cv.getContext('2d');
let W=1080,H=1920;
const small=document.createElement('canvas'),sctx=small.getContext('2d');
const mcv=document.createElement('canvas');mcv.width=1080;mcv.height=1920;const mctx=mcv.getContext('2d');
function fitCanvas(){const r=$('#screen').getBoundingClientRect();if(!r.width||!r.height)return;const k=Math.min((r.width-24)/W,(r.height-24)/H);cv.style.width=Math.floor(W*k)+'px';cv.style.height=Math.floor(H*k)+'px'}
if(window.ResizeObserver)new ResizeObserver(()=>fitCanvas()).observe($('#screen'));else window.addEventListener('resize',fitCanvas);
let dirty=true;
function setFormat(){const [w,h]=FORMATS[S.cfg.fmt];W=cv.width=w;H=cv.height=h;fitCanvas();const fc=$('#fmtchip');if(fc)fc.textContent=`${S.cfg.fmt} · ${w}×${h}`;small.width=Math.round(w/14);small.height=Math.round(h/14);dirty=true}
const M=()=>Math.min(W,H*.5625);

function drawCover(c,m,mw,mh,cw,ch,z=1){const sc=Math.max(cw/mw,ch/mh)*z,dw=mw*sc,dh=mh*sc;c.drawImage(m,(cw-dw)/2,(ch-dh)/2,dw,dh)}
function drawContain(m,mw,mh,z=1){const sc=Math.min(W/mw,H/mh)*z,dw=mw*sc,dh=mh*sc;ctx.drawImage(m,(W-dw)/2,(H-dh)/2,dw,dh)}
function mediaOf(it,local){
  if(it.type==='video'){if(FO){const f=FO.get(it.id);return f?{m:f.m,w:f.w,h:f.h}:null}const e=it.el;return e&&e.videoWidth?{m:e,w:e.videoWidth,h:e.videoHeight}:null}
  if(it.type==='image'){const s=srcById(it.src);return s&&s.img?{m:s.img,w:s.img.naturalWidth,h:s.img.naturalHeight}:null}
  if(it.type==='motion'){const tpl0=TPL.get(it.tpl);if(!tpl0||!ZM)return null;const ph=it.photo?srcById(it.photo):null;
    const tpl=it.st&&tpl0.st?Object.assign(Object.create(tpl0),{st:Object.assign({},tpl0.st,it.st)}):tpl0;
    const lt=clamp((it.off||0)+local*(it.ms||1),0,tpl.dur-.001);
    try{ZM.renderFrame(mctx,tpl,lt,it.f,{photo:ph?ph.img:null,logo:S.logo},P.exporting?!!it._wm:ACCESS.motionWm)}catch(e){}
    return{m:mcv,w:1080,h:1920,motion:true}}
  return null}
function drawItem(it,local){
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const md=mediaOf(it,local);if(!md||!md.w)return;
  const mv=moveOf(it,clamp(local/idur(it),0,1));const z=mv.z;
  const f=md.motion?'none':filterOf(it);
  const same=Math.abs(md.w/md.h-W/H)<.03;
  ctx.save();if(mv.px||mv.py)ctx.translate(mv.px*W,mv.py*H);
  if(S.cfg.fit==='fill'||same){ctx.filter=f;drawCover(ctx,md.m,md.w,md.h,W,H,z);ctx.filter='none';ctx.restore();return}
  if(S.cfg.fit==='blur'){sctx.filter='blur(2px)';drawCover(sctx,md.m,md.w,md.h,small.width,small.height,1.15);sctx.filter='none';ctx.imageSmoothingQuality='low';ctx.drawImage(small,-W*.05,-H*.05,W*1.1,H*1.1);ctx.fillStyle='rgba(0,0,0,.42)';ctx.fillRect(-W,-H,W*3,H*3)}
  ctx.filter=f;drawContain(md.m,md.w,md.h,z);ctx.filter='none';ctx.restore();
}
// hareket (başlangıç → bitiş anahtar kareleri): yakınlaş, uzaklaş, kaydır
const MOVES=[['none','Yok'],['in','Yakınlaş'],['out','Uzaklaş'],['left','Sola kay'],['right','Sağa kay'],['up','Yukarı kay'],['down','Aşağı kay']];
function moveOf(it,p){let mvk=it.mv;if(mvk===undefined)mvk=it.type==='image'&&it.kb!==false?'in':'none';const a=it.mva??.12,e=p<0?0:p>1?1:p*p*(3-2*p);
  if(mvk==='in')return{z:1+a*e,px:0,py:0};if(mvk==='out')return{z:1+a*(1-e),px:0,py:0};
  const z=1+a,d=a/2;if(mvk==='left')return{z,px:d*(1-2*e),py:0};if(mvk==='right')return{z,px:-d*(1-2*e),py:0};if(mvk==='up')return{z,px:0,py:d*(1-2*e)};if(mvk==='down')return{z,px:0,py:-d*(1-2*e)};return{z:1,px:0,py:0}}
// renk ayarı: parlaklık, kontrast, doygunluk, sıcaklık (parça başına) + genel filtre
function filterOf(it){const g=FILTERS[S.cfg.filter]||'none';const a=it.adj;if(!a||(!a.b&&!a.c&&!a.s&&!a.w))return g;
  let f=`brightness(${1+a.b*.5}) contrast(${1+a.c*.5}) saturate(${1+a.s})`;if(a.w>0)f+=` sepia(${a.w*.35})`;else if(a.w<0)f+=` hue-rotate(${a.w*18}deg) saturate(${1-a.w*.1})`;return (g==='none'?'':g+' ')+f}
function drawMain(t){
  const i=P.playing&&P.mode==='seg'?P.i:idxAt(t);const it=S.items[i];if(!it)return;
  const local=t-it.t0;const tr=it.tr||{type:'none'};
  if(i>0&&tr.type!=='none'&&local<tr.d){
    const pv=S.items[i-1],p=ease(local/tr.d),pl=idur(pv);
    if(tr.type==='fade'){drawItem(pv,pl);ctx.save();ctx.globalAlpha=p;drawItem(it,local);ctx.restore()}
    else if(tr.type==='black'){if(p<.5){drawItem(pv,pl);ctx.fillStyle=`rgba(0,0,0,${p*2})`;ctx.fillRect(0,0,W,H)}else{drawItem(it,local);ctx.fillStyle=`rgba(0,0,0,${(1-p)*2})`;ctx.fillRect(0,0,W,H)}}
    else if(tr.type==='slide'){ctx.save();ctx.translate(-W*p,0);drawItem(pv,pl);ctx.restore();ctx.save();ctx.translate(W*(1-p),0);drawItem(it,local);ctx.restore()}
    else if(tr.type==='zoom'){drawItem(pv,pl);ctx.save();ctx.globalAlpha=p;const z=1.25-.25*p;ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);drawItem(it,local);ctx.restore()}
    else if(tr.type==='wipe'){drawItem(pv,pl);ctx.save();ctx.beginPath();ctx.rect(0,0,W*p,H);ctx.clip();drawItem(it,local);ctx.restore()}
    else drawItem(it,local)}
  else drawItem(it,local);
}
function wrapWords(words,font,maxW){ctx.font=font;const lines=[];let cur=[];for(const w of words){const test=[...cur,w].map(x=>x.t).join(' ');if(cur.length&&ctx.measureText(test).width>maxW){lines.push(cur);cur=[w]}else cur.push(w)}if(cur.length)lines.push(cur);return lines}
function rrect(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
const onColor=h=>{const n=parseInt(String(h).slice(1),16);const r=n>>16&255,g=n>>8&255,b=n&255;return (r*299+g*587+b*114)/1000>150?'#0B0C0E':'#FFFFFF'};

function drawCaption(t){
  const c=S.caps.find(c=>t>=c.s&&t<c.e);if(!c||!c.t.trim())return;
  const st=S.cfg.cap.style,U=S.cfg.cap.upper&&st!=='zarif',big=st==='vurgu'||st==='neon';
  const base=M()*.078*S.cfg.cap.size*(big?1.12:1);
  const family=st==='zarif'?FONTS.s[0]:big?FONTS.d[0]:FONTS.b[0];
  const weight=st==='zarif'?'italic 700':big?'700':'800';
  const fs=base*(.9+.1*ease((t-c.s)/.14)),font=`${weight} ${fs}px ${family}`;
  const raw=c.t.trim().split(/\s+/);
  let active=-1;
  if(c.w&&c.w.length===raw.length){active=c.w.findIndex(w=>t>=w.s&&t<w.e);if(active<0)active=c.w.reduce((a,w,i)=>t>=w.s?i:a,-1)}
  else active=Math.min(raw.length-1,Math.floor((t-c.s)/Math.max(.01,c.e-c.s)*raw.length));
  const words=raw.map((x,i)=>({t:U?up(x):x,i}));
  const lines=wrapWords(words,font,W*.84);
  const lh=fs*1.18,y0=H*S.cfg.cap.pos-(lines.length*lh)/2;
  ctx.save();ctx.textBaseline='middle';ctx.lineJoin='round';
  lines.forEach((ln,li)=>{
    const txt=ln.map(w=>w.t).join(' ');ctx.font=font;
    const sp=ctx.measureText(' ').width,tw=ctx.measureText(txt).width;
    let x=(W-tw)/2;const y=y0+li*lh+lh/2;
    if(st==='kutu'){const p=fs*.32;ctx.fillStyle='rgba(255,255,255,.96)';rrect(ctx,x-p,y-lh/2+fs*.04,tw+p*2,lh-fs*.08,fs*.22);ctx.fill()}
    for(const w of ln){
      const ww=ctx.measureText(w.t).width,on=w.i===active;
      if(st==='klasik'){ctx.lineWidth=fs*.17;ctx.strokeStyle='#000';ctx.strokeText(w.t,x,y);ctx.fillStyle='#fff';ctx.fillText(w.t,x,y)}
      else if(st==='vurgu'){ctx.lineWidth=fs*.15;ctx.strokeStyle='rgba(0,0,0,.92)';ctx.strokeText(w.t,x,y);ctx.fillStyle=on?'#FFD84D':'#fff';ctx.fillText(w.t,x,y)}
      else if(st==='neon'){if(on){ctx.fillStyle='#FF2E88';rrect(ctx,x-fs*.12,y-fs*.55,ww+fs*.24,fs*1.1,fs*.18);ctx.fill()}ctx.save();ctx.shadowColor=on?'rgba(255,46,136,.9)':'rgba(0,0,0,.8)';ctx.shadowBlur=fs*.4;ctx.fillStyle='#fff';ctx.fillText(w.t,x,y);ctx.restore()}
      else if(st==='kutu'){ctx.fillStyle=on?'#0B0C0E':'#3a3d44';ctx.fillText(w.t,x,y)}
      else{ctx.save();ctx.shadowColor='rgba(0,0,0,.75)';ctx.shadowBlur=fs*.35;ctx.globalAlpha=on?1:.82;ctx.fillStyle='#fff';ctx.fillText(w.t,x,y);ctx.restore()}
      x+=ww+sp}
  });
  ctx.restore();
}
function drawText(L,t){
  const local=t-L.t0;if(local<0||local>L.dur){L._bb=null;return}
  const F=FONTS[L.font]||FONTS.d;const fs=M()*.085*L.size;
  const font=`${F[1]} ${fs}px ${F[0]}`;
  let txt=L.upper?up(L.text):L.text;
  if(L.anim==='type'){const n=Math.floor(clamp(local/Math.max(.4,Math.min(1.6,txt.length*.05)),0,1)*txt.length);txt=txt.slice(0,n)}
  const ain=(L.anim==='none'||L.anim==='type')?1:ease(local/.35),aout=clamp((L.dur-local)/.25,0,1);
  let sc=1,dy=0;if(L.anim==='pop')sc=.6+.4*eback(local/.4);if(L.anim==='slide')dy=(1-ease(local/.45))*M()*.06;
  ctx.save();ctx.font=font;ctx.textBaseline='middle';ctx.textAlign='center';ctx.lineJoin='round';
  const lines=[];for(const p of txt.split('\n')){const ws=p.split(/\s+/).filter(Boolean).map(t=>({t}));if(!ws.length){lines.push('');continue}wrapWords(ws,font,W*.86).forEach(l=>lines.push(l.map(w=>w.t).join(' ')))}
  ctx.font=font;const lh=fs*1.15;const wmax=Math.max(fs,...lines.map(l=>ctx.measureText(l).width));const hh=Math.max(1,lines.length)*lh;
  const cx=L.x*W,cy=L.y*H+dy;
  L._bb={x:cx-wmax/2-fs*.4,y:cy-hh/2-fs*.3,w:wmax+fs*.8,h:hh+fs*.6};
  ctx.globalAlpha=ain*aout;
  ctx.translate(cx,cy);ctx.scale(sc,sc);ctx.translate(-cx,-cy);
  const boxed=L.bg==='box'||L.bg==='pill';
  if(boxed){ctx.fillStyle=L.bgc||'#FFFFFF';const p=fs*.38;
    if(L.bg==='pill'){rrect(ctx,cx-wmax/2-p,cy-hh/2-p*.55,wmax+p*2,hh+p*1.1,(hh+p*1.1)/2);ctx.fill()}
    else lines.forEach((l,i)=>{const w=ctx.measureText(l).width;rrect(ctx,cx-w/2-p*.7,cy-hh/2+i*lh+fs*.02,w+p*1.4,lh-fs*.04,fs*.2);ctx.fill()})}
  lines.forEach((l,i)=>{const y=cy-hh/2+i*lh+lh/2;
    if(L.bg==='outline'){ctx.lineWidth=fs*.16;ctx.strokeStyle=onColor(L.color)==='#FFFFFF'?'#FFFFFF':'#000000';ctx.strokeText(l,cx,y)}
    if(L.bg==='shadow'){ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=fs*.45;ctx.shadowOffsetY=fs*.05}
    ctx.fillStyle=boxed?onColor(L.bgc||'#FFFFFF'):L.color;ctx.fillText(l,cx,y);ctx.shadowColor='transparent'});
  ctx.restore();
  if(SEL&&SEL.kind==='text'&&SEL.id===L.id&&!P.exporting&&!P.playing){ctx.save();ctx.setLineDash([12,8]);ctx.lineWidth=3;ctx.strokeStyle='rgba(255,255,255,.9)';ctx.strokeRect(L._bb.x,L._bb.y,L._bb.w,L._bb.h);ctx.restore()}
}
function drawEnd(t){
  const e=S.cfg.end,p=t-contentDur,a=ease(p/.45);
  ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#0B0C0E';ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(W/2,H*.42,0,W/2,H*.42,Math.max(W,H)*.6);rg.addColorStop(0,'rgba(220,224,229,.13)');rg.addColorStop(1,'rgba(220,224,229,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,W,H);
  let y=H*.42+(1-ease(p/.6))*H*.02;const m=M();
  if(S.logo){const r=Math.min(m*.3/S.logo.naturalWidth,m*.3/S.logo.naturalHeight),lw=S.logo.naturalWidth*r,lh=S.logo.naturalHeight*r;ctx.drawImage(S.logo,(W-lw)/2,y-lh-m*.04,lw,lh);y+=m*.06}
  ctx.textAlign='center';ctx.textBaseline='middle';
  if(e.text.trim()){const fs=m*.1;const tx=upName(e.text.trim());let f2=fs;ctx.font=`700 ${f2}px ${FONTS.d[0]}`;while(ctx.measureText(tx).width>W*.86&&f2>fs*.4){f2*=.94;ctx.font=`700 ${f2}px ${FONTS.d[0]}`}
    const g=ctx.createLinearGradient(0,y-fs/2,0,y+fs/2);g.addColorStop(0,'#fff');g.addColorStop(.55,'#E1E4E8');g.addColorStop(1,'#9097A1');ctx.fillStyle=g;ctx.fillText(tx,W/2,y+(S.logo?0:-fs*.2));y+=fs*.95}
  if(e.sub.trim()){const fs=m*.042;ctx.font=`500 ${fs}px Inter`;ctx.fillStyle='#9BA0A8';ctx.fillText(e.sub.trim(),W/2,y+fs*.3)}
  ctx.restore();
}
// V2 üst katman: logo, ürün fotoğrafı, PNG
function drawOverlay(O,t){const local=t-O.t0;if(local<0||local>O.dur){O._bb=null;return}const s=srcById(O.src);if(!s||!s.img||!s.img.naturalWidth)return;
  const iw=s.img.naturalWidth,ih=s.img.naturalHeight,w=O.w*W,h=w*ih/iw,cx=O.x*W,cy=O.y*H;
  const ain=O.anim==='none'?1:ease(local/.35),aout=O.anim==='none'?1:clamp((O.dur-local)/.3,0,1);let sc=1,dy=0;
  if(O.anim==='pop')sc=.6+.4*eback(local/.4);if(O.anim==='slide')dy=(1-ease(local/.45))*H*.05;
  const mv=moveOf({mv:O.mv||'none',mva:O.mva,type:'ov'},clamp(local/O.dur,0,1));sc*=mv.z;
  O._bb={x:cx-w/2,y:cy-h/2,w,h};
  ctx.save();ctx.globalAlpha=(O.op??1)*ain*aout;ctx.translate(cx,cy+dy);ctx.scale(sc,sc);
  if(O.shadow!==false){ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=w*.06;ctx.shadowOffsetY=w*.015}
  if(O.round){rrect(ctx,-w/2,-h/2,w,h,Math.min(w,h)*.08);ctx.clip()}
  ctx.drawImage(s.img,-w/2,-h/2,w,h);ctx.restore();
  if(SEL&&SEL.kind==='ov'&&SEL.id===O.id&&!P.exporting&&!P.playing){ctx.save();ctx.setLineDash([12,8]);ctx.lineWidth=3;ctx.strokeStyle='rgba(75,163,255,.95)';ctx.strokeRect(O._bb.x,O._bb.y,O._bb.w,O._bb.h);ctx.restore()}}
function drawWatermark(){if(!S.cfg.wm.on||!S.logo)return;const m=M(),lw=m*.15,r=lw/S.logo.naturalWidth;ctx.save();ctx.globalAlpha=.88;ctx.drawImage(S.logo,W-lw-m*.045,m*.06,lw,Math.min(S.logo.naturalHeight*r,m*.15));ctx.restore()}
function draw(t){
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  if(!S.items.length)return;
  const inEnd=t>=contentDur&&S.cfg.end.on;
  drawMain(Math.min(t,contentDur-.001));
  if(inEnd){drawEnd(t);return}
  for(const O of S.ovs)drawOverlay(O,t);drawWatermark();for(const L of S.texts)drawText(L,t);drawCaption(t);
}

/* ================= ses ================= */
let AC=null,master,clipGain,musicGain,recDest,musicNode=null;
function ensureAudio(){
  if(!AC){AC=new (window.AudioContext||window.webkitAudioContext)();
    master=AC.createGain();clipGain=AC.createGain();musicGain=AC.createGain();
    clipGain.connect(master);musicGain.connect(master);master.connect(AC.destination);
    try{recDest=AC.createMediaStreamDestination();master.connect(recDest)}catch(e){recDest=null}}
  for(const s of S.sources)if(s.kind==='video'&&!s.nodes){s.nodes=s.els.map(el=>{const n=AC.createMediaElementSource(el);const g=AC.createGain();n.connect(g);g.connect(clipGain);el._g=g;return n})}
  clipGain.gain.value=S.cfg.clipVol;
  if(AC.state==='suspended')AC.resume();
}
function duckRegions(){const r=[];for(const c of S.caps.slice().sort((a,b)=>a.s-b.s)){const l=r[r.length-1];if(l&&c.s-l[1]<.7)l[1]=Math.max(l[1],c.e);else r.push([c.s,c.e])}return r}
function musicVol(t,regs){
  const Mu=S.cfg.music;let v=Mu.vol;
  if(Mu.fade)v*=clamp(t/1.2,0,1)*clamp((total-t)/1.6,0,1);
  if(Mu.duck){let d=1;for(const [s,e] of regs){if(t>=s&&t<=e){d=.32;break}if(t>=s-.25&&t<s)d=Math.min(d,1-.68*(t-(s-.25))/.25);if(t>e&&t<=e+.4)d=Math.min(d,.32+.68*(t-e)/.4)}v*=d}
  return v}
function startMusic(t0){
  stopMusic();if(!S.music||!AC)return;
  const n=AC.createBufferSource();n.buffer=S.music.buf;n.loop=true;n.connect(musicGain);
  const regs=duckRegions(),T=AC.currentTime+.02,g=musicGain.gain;
  g.cancelScheduledValues(0);g.setValueAtTime(musicVol(t0,regs),T);
  const pts=new Set([1.2,total-1.6,total]);for(const [s,e] of regs){pts.add(s-.25);pts.add(s);pts.add(e);pts.add(e+.4)}
  [...pts].filter(x=>x>t0&&x<=total).sort((a,b)=>a-b).forEach(x=>g.linearRampToValueAtTime(musicVol(x,regs),T+(x-t0)));
  n.start(T,(S.cfg.music.start+t0)%S.music.buf.duration);musicNode=n}
function stopMusic(){if(musicNode){try{musicNode.stop()}catch(e){}musicNode.disconnect();musicNode=null}}

/* ================= oynatıcı ================= */
const P={playing:false,t:0,i:0,mode:'seg',clock:0,onEnd:null,exporting:false};
function startItem(i,offset){
  P.i=i;P.mode='seg';const it=S.items[i];
  if(it.type==='video'){const el=it.el;el.playbackRate=it.speed||1;if(el._g)el._g.gain.value=it.vol??1;const target=it.in+offset*(it.speed||1);if(Math.abs(el.currentTime-target)>.06)el.currentTime=target;const pr=el.play();if(pr)pr.catch(()=>{})}
  else P.clock=now()-offset;
  const n=S.items[i+1];if(n&&n.el&&n.el!==it.el){n.el.pause();if(Math.abs(n.el.currentTime-n.in)>.06)n.el.currentTime=n.in}
}
function advance(){
  const it=S.items[P.i],n=S.items[P.i+1];
  if(n){if(it.el&&it.el!==n.el)it.el.pause();startItem(P.i+1,0)}
  else{if(it&&it.el)it.el.pause();if(total>contentDur+.05){P.mode='end';P.clock=now()-(P.t-contentDur)}else finish()}
}
function finish(){pause();P.t=total;dirty=true;const f=P.onEnd;P.onEnd=null;if(f)f()}
function play(){
  if(!S.items.length)return;ensureAudio();
  if(P.t>=total-.05)P.t=0;
  P.playing=true;$('#btn-play').innerHTML='<svg><use href="#i-pause"/></svg>';$('#btn-play').setAttribute('aria-label','Durdur');
  if(P.t>=contentDur){P.mode='end';P.clock=now()-(P.t-contentDur)}
  else{const i=idxAt(P.t);startItem(i,P.t-S.items[i].t0)}
  startMusic(P.t);
}
function pause(){P.playing=false;for(const s of S.sources)if(s.els)s.els.forEach(e=>e.pause());stopMusic();$('#btn-play').innerHTML='<svg><use href="#i-play"/></svg>';$('#btn-play').setAttribute('aria-label','Oynat');dirty=true}
function seek(t){const was=P.playing;if(was)pause();P.t=clamp(t,0,total);showFrame();if(was)play()}
function seekEl(it,local){if(!it||!it.el)return;const target=Math.max(0,Math.min(it.in+local*(it.speed||1),it.out-.03));if(Math.abs(it.el.currentTime-target)>.02){it.el.currentTime=target;it.el.addEventListener('seeked',()=>{dirty=true},{once:true})}}
function showFrame(){
  if(S.items.length&&P.t<contentDur){const i=idxAt(P.t),it=S.items[i];P.i=i;seekEl(it,P.t-it.t0);
    if(i>0&&it.tr&&it.tr.type!=='none'&&P.t-it.t0<it.tr.d){const pv=S.items[i-1];if(pv.el!==it.el)seekEl(pv,idur(pv))}}
  dirty=true}
function tick(){
  if(P.playing){
    if(P.mode==='seg'){const it=S.items[P.i];
      if(!it)finish();
      else if(it.type==='video'){const ct=it.el.currentTime;P.t=it.t0+Math.max(0,ct-it.in)/(it.speed||1);if(ct>=it.out-.03*(it.speed||1)||it.el.ended)advance()}
      else{P.t=it.t0+(now()-P.clock);if(P.t>=it.t0+idur(it))advance()}}
    else{P.t=contentDur+(now()-P.clock);if(P.t>=total)finish()}
    dirty=true}
  if(dirty){dirty=false;draw(P.t);updateClock()}
  requestAnimationFrame(tick);
}
let lastCap=-1;
function updateClock(){
  $('#tc').textContent=tc(P.t);$('#tcd').textContent=tc(total);
  if(P.exporting)setExpProgress(P.t/total);
  placeHead();
  const ci=S.caps.findIndex(c=>P.t>=c.s&&P.t<c.e);
  if(ci!==lastCap){lastCap=ci;$$('#caps .cap').forEach((li,k)=>li.classList.toggle('cur',k===ci))}
}

/* ================= dosyalar ================= */
function mkVid(url){const v=document.createElement('video');v.playsInline=true;v.preload='auto';v.src=url;v.setAttribute('playsinline','');['loadeddata','seeked','canplay'].forEach(ev=>v.addEventListener(ev,()=>{dirty=true}));$('#media-pool').appendChild(v);return v}
const once=(el,ev)=>new Promise((res,rej)=>{el.addEventListener(ev,res,{once:true});el.addEventListener('error',()=>rej(new Error('yuklenemedi')),{once:true})});
async function makeSource(rec){ // rec: {id?, kind, name, blob? | url?}
  const url=rec.blob?URL.createObjectURL(rec.blob):rec.url;
  const id=rec.id||nid();uid=Math.max(uid,id);
  let s;
  if(rec.kind==='image'){const img=new Image();img.src=url;await img.decode();s={id,kind:'image',name:rec.name,blob:rec.blob||null,url,remote:!rec.blob,img,dur:3,thumb:url,hidden:!!rec.hidden}}
  else{const els=[mkVid(url),mkVid(url)];await once(els[0],'loadedmetadata');s={id,kind:'video',name:rec.name,blob:rec.blob||null,url,remote:!rec.blob,els,dur:els[0].duration,thumb:rec.thumb||null,hidden:!!rec.hidden}}
  S.sources.push(s);
  if(s.kind==='video'&&!s.thumb)makeThumb(s);
  if(AC)ensureAudio();if(!rec.restoring)dbPutSource(s);return s}
async function addFiles(files){
  let added=0;const before=snap();
  for(const f of files){
    try{
      if(f.type.startsWith('audio/')||/\.(mp3|m4a|wav|aac|ogg)$/i.test(f.name)){await setMusic(f);continue}
      const kind=f.type.startsWith('image/')?'image':'video';
      const s=await makeSource({kind,name:f.name,blob:f});
      insertItem(kind==='image'?{type:'image',src:s.id,dur:3}:{type:'video',src:s.id,in:0,out:r2(s.dur)},S.items.length);added++;
    }catch(e){toast('“'+f.name+'” açılamadı. MP4, MOV, JPG veya PNG dene.',4000)}
  }
  if(added){pushUndo(before);afterChange();if(S.items.length===added)fitTL();showFrame();toast(added+' dosya eklendi')}
}
function insertItem(o,at){const it=Object.assign({id:nid(),speed:1,vol:1,tr:{type:'none',d:.5}},o);S.items.splice(at,0,it);return it}
async function makeThumb(s){
  try{const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';v.src=s.url;await once(v,'loadeddata');v.currentTime=Math.min(1,s.dur/3);await once(v,'seeked');
    const c=document.createElement('canvas');c.width=96;c.height=96;const x=c.getContext('2d');const sc=Math.max(96/v.videoWidth,96/v.videoHeight);x.drawImage(v,(96-v.videoWidth*sc)/2,(96-v.videoHeight*sc)/2,v.videoWidth*sc,v.videoHeight*sc);
    s.thumb=c.toDataURL('image/jpeg',.7);v.removeAttribute('src');v.load();renderLib();renderTL();dbPutSource(s)}catch(e){}
}
async function setMusic(f,start){
  ensureAudio();
  try{const buf=await AC.decodeAudioData(await f.arrayBuffer());S.music={name:f.name,buf};S.cfg.music.start=start||0;$('#music-name').textContent=f.name;$('#btn-music-x').hidden=false;$('#music-part').hidden=false;computePeaks();drawWave();
    if(start===undefined){dbPut('music',{blob:f,name:f.name});toast('Müzik eklendi')}if(P.playing)startMusic(P.t);renderTL();scheduleSave()}
  catch(e){toast('Bu müzik dosyası açılamadı. MP3 veya M4A dene.',4000)}
}
async function setLogo(blob,quiet){const url=URL.createObjectURL(blob);const img=new Image();img.src=url;try{await img.decode()}catch(e){toast('Logo açılamadı');return}S.logo=img;$('#logo-prev').src=url;$('#logo-prev').hidden=false;$('#btn-logo-x').hidden=false;dirty=true;mThumbsDirty();if(!quiet)dbPut('logo',{blob})}
const KICON={video:'i-cam',image:'i-image'};
function renderLib(){
  const vis=S.sources.filter(s=>!s.hidden);$('#lib-empty').hidden=!!vis.length;$('#drop').hidden=!!S.items.length;$('#lib-count').textContent=vis.length?vis.length+' dosya':'';
  $('#lib').innerHTML=vis.map(s=>`<button type="button" data-id="${s.id}" title="${esc(s.name)} · zaman çizgisine ekle" style="${s.thumb?`background-image:url('${s.thumb}')`:''}"><i><svg><use href="#${KICON[s.kind]}"/></svg></i>${s.kind==='image'?'<em class="v2" data-v2 title="Üst katman (V2) olarak ekle">+V2</em>':''}<b>${s.kind==='image'?'Foto':fmtT(s.dur)}</b><span>${esc(s.name)}</span></button>`).join('');
}
$('#lib').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const s=srcById(+b.dataset.id);if(!s)return;
  if(e.target.closest('[data-v2]')){addOverlay(s);return}
  hist();const it=insertItem(s.kind==='image'?{type:'image',src:s.id,dur:3}:{type:'video',src:s.id,in:0,out:r2(s.dur)},insertAt());afterChange();select('item',it.id);seek(it.t0);toast('Zaman çizgisine eklendi')});
function addOverlay(s){if(!S.items.length){toast('Önce ana videoyu ekle');return}hist();const t0=Math.min(P.t,Math.max(0,contentDur-.5));const iw=s.img.naturalWidth,ih=s.img.naturalHeight;
  const O={id:nid(),src:s.id,t0,dur:Math.min(4,Math.max(1,contentDur-t0)),x:.5,y:.5,w:iw<ih?.45:.6,op:1,anim:'fade',shadow:true};S.ovs.push(O);afterChange();select('ov',O.id);seek(t0+.5);toast('Üst katman eklendi; önizlemede sürükleyerek yerleştir')}
function insertAt(){if(!S.items.length)return 0;if(P.t>=contentDur)return S.items.length;const i=idxAt(P.t),it=S.items[i];return P.t-it.t0<idur(it)/2?i:i+1}

/* ================= seçim ================= */
let SEL=null; // {kind:'item'|'text'|'cap', id}
const listOf=k=>k==='item'?S.items:k==='text'?S.texts:k==='ov'?S.ovs:S.caps;
function selObj(){if(!SEL)return null;return listOf(SEL.kind).find(x=>x.id===SEL.id)||null}
function select(kind,id){SEL=kind?{kind,id}:null;if(SEL&&!selObj())SEL=null;$('.props').classList.toggle('open',!!SEL);renderInsp();renderTL();dirty=true;updTools()}
function openTab(name){$$('#tabs button').forEach(x=>x.setAttribute('aria-selected',String(x.dataset.tab===name)));$$('.pane').forEach(p=>p.hidden=p.dataset.pane!==name);if(name==='motion')mEnsure();if(name==='klip')renderClipSrc()}

/* ================= zaman çizgisi ================= */
let pps=40,tool='sel',snapOn=true;
const tlIn=$('#tl-in'),tlScroll=$('#tl-scroll');
const PPS_MIN=4,PPS_MAX=240;
const zv2pps=v=>PPS_MIN*Math.pow(PPS_MAX/PPS_MIN,v/100),pps2zv=p=>Math.log(p/PPS_MIN)/Math.log(PPS_MAX/PPS_MIN)*100;
function setPps(p,keepT){const old=pps;pps=clamp(p,PPS_MIN,PPS_MAX);$('#tl-zoom').value=pps2zv(pps);const ref=keepT??P.t;const x=ref*old-tlScroll.scrollLeft;renderTL();tlScroll.scrollLeft=Math.max(0,ref*pps-x)}
function fitTL(){const w=tlScroll.clientWidth-30;setPps(w/Math.max(4,total||4));tlScroll.scrollLeft=0}
const tc=t=>{t=Math.max(0,t||0);const f=Math.floor(t*30+1e-6),h=Math.floor(f/108000),m=Math.floor(f/1800)%60,s=Math.floor(f/30)%60,fr=f%30,z=n=>String(n).padStart(2,'0');return `${z(h)}:${z(m)}:${z(s)}:${z(fr)}`};
async function ensurePeaks(s){if(s.peaks||s._pk||s.kind!=='video')return;s._pk=true;const pcm=await pcmOf(s);if(!pcm){s.peaks=null;return}const step=800,n=Math.ceil(pcm.length/step);const p=new Float32Array(n);let mx=.001;for(let i=0;i<n;i++){let m=0;for(let k=i*step;k<Math.min(pcm.length,(i+1)*step);k+=4){const v=Math.abs(pcm[k]);if(v>m)m=v}p[i]=m;if(m>mx)mx=m}for(let i=0;i<n;i++)p[i]/=mx;s.peaks=p;renderTL()}
function drawWF(c,it){const s=srcById(it.src);if(!s||!s.peaks)return;const w=c.width=Math.min(4000,Math.max(1,Math.round(c.clientWidth||idur(it)*pps))),h=c.height=18;const x=c.getContext('2d');x.fillStyle='rgba(255,255,255,.55)';const sp=it.speed||1;
  for(let px=0;px<w;px+=2){const st=it.in+px/pps*sp;const v=s.peaks[Math.floor(st*20)]||0;const bh=Math.max(1,v*h);x.fillRect(px,h-bh,1.4,bh)}}
function renderTL(){
  const span=Math.max(total+6,10);tlIn.style.width=(span*pps)+'px';
  const step=pps>=150?.5:pps>=70?1:pps>=30?2:pps>=14?5:pps>=7?10:20;const minor=step/5;let r='';
  for(let t=0;t<=span+1e-6;t+=step)r+=`<i style="left:${t*pps}px">${Math.abs(t-Math.round(t))<1e-6?tc(t).slice(3,8):''}</i>`;
  if(minor*pps>=6)for(let t=minor;t<=span;t+=minor)if(Math.abs(t/step-Math.round(t/step))>.01)r+=`<u style="left:${t*pps}px"></u>`;
  $('#ruler').innerHTML=r;
  $('#lane-main').innerHTML=S.items.map((it,i)=>{const s=it.src?srcById(it.src):null;const tpl=it.type==='motion'?TPL.get(it.tpl):null;
    const name=it.type==='motion'?(tpl?tpl.name:'Motion'):(s?s.name:'');const bg=it.type==='motion'?(tpl?tplThumbURL(tpl):''):(s&&s.thumb)||'';
    const sp=(it.speed||1)!==1?` ${it.speed}x`:'';const trw=i>0&&it.tr&&it.tr.type!=='none'?Math.min(idur(it),it.tr.d)*pps:0;
    return `<div class="blk ${it.type}${SEL&&SEL.kind==='item'&&SEL.id===it.id?' sel':''}" data-k="item" data-id="${it.id}" style="left:${it.t0*pps}px;width:${Math.max(4,idur(it)*pps-1)}px">${bg?`<div class="film" style="background-image:url('${bg}');${it.type==='video'?'bottom:18px':''}"></div>`:''}${trw?`<b class="tr" style="width:${trw}px"></b>`:''}<span>${esc(name)}</span><em>${r1(idur(it))}s${sp}</em>${it.type==='video'?'<canvas class="wf"></canvas>':''}<b class="h l"></b><b class="h r"></b></div>`}).join('');
  $$('#lane-main .blk').forEach((b,i)=>{const it=S.items[i],c=b.querySelector('canvas.wf');if(c&&it){const s=srcById(it.src);if(s&&s.peaks)drawWF(c,it);else if(s)ensurePeaks(s)}});
  const lanes=[];const pos=S.texts.slice().sort((a,b)=>a.t0-b.t0).map(L=>{let k=lanes.findIndex(end=>end<=L.t0+.01);if(k<0){k=lanes.length;lanes.push(0)}lanes[k]=L.t0+L.dur;return[L,k]});
  const nl=Math.max(1,lanes.length),lh=nl===1?44:22,th=nl===1?44:nl*(lh+2);$('#lane-text').parentElement.style.height=th+'px';$('.th[data-tr=text]').style.height=th+'px';
  $('#lane-text').innerHTML=pos.map(([L,k])=>`<div class="blk text${SEL&&SEL.kind==='text'&&SEL.id===L.id?' sel':''}" data-k="text" data-id="${L.id}" style="left:${L.t0*pps}px;width:${Math.max(8,L.dur*pps-1)}px;top:${k*(lh+2)}px;height:${lh}px"><span>${esc(L.text.replace(/\n/g,' '))}</span><b class="h l"></b><b class="h r"></b></div>`).join('');
  const ol=[];const opos=S.ovs.slice().sort((a,b)=>a.t0-b.t0).map(O=>{let k=ol.findIndex(end=>end<=O.t0+.01);if(k<0){k=ol.length;ol.push(0)}ol[k]=O.t0+O.dur;return[O,k]});
  const onl=Math.max(1,ol.length),olh=onl===1?44:22,oth=onl===1?44:onl*(olh+2);$('#lane-ov').parentElement.style.height=oth+'px';$('.th[data-tr=ov]').style.height=oth+'px';
  $('#lane-ov').innerHTML=opos.map(([O,k])=>{const s=srcById(O.src);return `<div class="blk ov${SEL&&SEL.kind==='ov'&&SEL.id===O.id?' sel':''}" data-k="ov" data-id="${O.id}" style="left:${O.t0*pps}px;width:${Math.max(8,O.dur*pps-1)}px;top:${k*(olh+2)}px;height:${olh}px">${s&&s.thumb?`<div class="film" style="top:0;background-image:url('${s.thumb}');opacity:.35"></div>`:''}<span>${esc(s?s.name:'Katman')}</span><b class="h l"></b><b class="h r"></b></div>`}).join('');
  $('#lane-cap').innerHTML=S.caps.map(c=>`<div class="blk cap${SEL&&SEL.kind==='cap'&&SEL.id===c.id?' sel':''}" data-k="cap" data-id="${c.id}" style="left:${c.s*pps}px;width:${Math.max(4,(c.e-c.s)*pps-1)}px"><span>${esc(c.t)}</span></div>`).join('');
  $('#lane-music').innerHTML=S.music?`<div class="blk music" data-k="music" style="left:0;width:${Math.max(4,total*pps)}px"><span>${esc(S.music.name)}</span></div>`:'';
  const hs=$('#tl-heads');if(hs)hs.scrollTop=tlScroll.scrollTop;
  $('#mon-info').textContent=S.items.length?`${S.items.length} parça · ${fmtT(total)}`:'';
  placeHead();updTools();
}
tlScroll.addEventListener('scroll',()=>{$('#tl-heads').scrollTop=tlScroll.scrollTop});
function placeHead(){const x=P.t*pps;$('#phead').style.left=x+'px';
  if(P.playing){const sl=tlScroll.scrollLeft,w=tlScroll.clientWidth;if(x<sl||x>sl+w-40)tlScroll.scrollLeft=Math.max(0,x-40)}}
function tAtX(clientX){const r=tlIn.getBoundingClientRect();return clamp((clientX-r.left)/pps,0,total)}
// mıknatıs: yakındaki kenara yapıştır
function snapPoints(skip){const pts=[0,P.t];for(const it of S.items){if(it===skip)continue;pts.push(it.t0,it.t0+idur(it))}for(const L of S.texts.concat(S.ovs)){if(L===skip)continue;pts.push(L.t0,L.t0+L.dur)}for(const c of S.caps){if(c===skip)continue;pts.push(c.s,c.e)}return pts}
function snapT(t,skip,pts){const sl=$('#snapline');if(!snapOn){sl.hidden=true;return t}pts=pts||snapPoints(skip);let best=t,bd=8/pps;for(const p of pts){const d=Math.abs(p-t);if(d<bd){bd=d;best=p}}if(best!==t){sl.hidden=false;sl.style.left=best*pps+'px'}else sl.hidden=true;return best}
let drag=null;
tlIn.addEventListener('pointerdown',e=>{
  if(e.button>0)return;
  const blk=e.target.closest('.blk');
  if(!blk||blk.dataset.k==='music'){
    if(blk)openTab('ses');else if(!e.target.closest('.ruler'))select(null);
    seek(snapOn&&!P.playing?snapT(tAtX(e.clientX),null):tAtX(e.clientX));$('#snapline').hidden=true;drag={mode:'scrub'};tlIn.setPointerCapture(e.pointerId);return}
  const k=blk.dataset.k,id=+blk.dataset.id;const h=e.target.closest('.h');
  const list=listOf(k);const obj=list.find(x=>x.id===id);if(!obj)return;
  if(tool==='razor'&&(k==='item'||k==='text')){pause();P.t=tAtX(e.clientX);SEL={kind:k,id};doSplit();return}
  const {el,_bb,...plain}=obj;
  drag={mode:h?(h.classList.contains('l')?'trimL':'trimR'):'move',k,id,obj,x0:e.clientX,orig:JSON.parse(JSON.stringify(plain)),moved:false,blk,snap:snap(),pts:snapPoints(obj)};
  tlIn.setPointerCapture(e.pointerId);e.preventDefault();
});
tlIn.addEventListener('pointermove',e=>{
  if(!drag)return;
  if(drag.mode==='scrub'){seek(tAtX(e.clientX));return}
  const dx=e.clientX-drag.x0;if(!drag.moved&&Math.abs(dx)<4)return;
  if(!drag.moved){drag.moved=true;pause()}
  let dt=dx/pps;const o=drag.orig,it=drag.obj;
  if(drag.k==='item'){
    if(drag.mode==='move'){drag.blk.classList.add('dragging');drag.blk.style.transform=`translateX(${dx}px)`;
      const cx=o.t0+idur(it)/2+dt;let at=S.items.length;for(let i=0;i<S.items.length;i++){const x=S.items[i];if(cx<x.t0+idur(x)/2){at=i;break}}drag.at=at;
      let mk=$('.drop-mark');if(!mk){mk=document.createElement('div');mk.className='drop-mark';$('#lane-main').appendChild(mk)}const ref=S.items[at];mk.style.left=((ref?ref.t0:contentDur)*pps-2)+'px';return}
    const oe=o.t0+(it.type==='video'?(o.out-o.in)/(o.speed||1):o.dur);
    if(drag.mode==='trimR')dt=snapT(oe+dt,it,drag.pts)-oe;else dt=snapT(o.t0+dt,it,drag.pts)-o.t0;
    if(it.type==='video'){const s=srcById(it.src),sp=it.speed||1;
      if(drag.mode==='trimL')it.in=clamp(o.in+dt*sp,0,it.out-.2*sp);else it.out=clamp(o.out+dt*sp,it.in+.2*sp,s.dur)}
    else{const tdur=it.type==='motion'?(TPL.get(it.tpl)?.dur||8):60;
      if(drag.mode==='trimL'){const maxD=it.type==='motion'?o.dur+(o.off||0):60;const nd=clamp(o.dur-dt,.4,maxD);if(it.type==='motion')it.off=Math.max(0,(o.off||0)+(o.dur-nd));it.dur=nd}
      else it.dur=clamp(o.dur+dt,.4,it.type==='motion'?tdur-(it.off||0):60)}
    layout();positionMain();P.t=clamp(drag.mode==='trimL'?it.t0+.01:it.t0+idur(it)-.04,0,total);showFrame();return}
  if(drag.k==='text'||drag.k==='ov'){
    if(drag.mode==='move'){let nt=Math.max(0,o.t0+dt);const s1=snapT(nt,it,drag.pts);if(s1!==nt)nt=s1;else{const s2=snapT(nt+o.dur,it,drag.pts);nt=s2-o.dur}it.t0=Math.max(0,nt)}
    else if(drag.mode==='trimL'){const e2=o.t0+o.dur;it.t0=clamp(snapT(o.t0+dt,it,drag.pts),0,e2-.3);it.dur=e2-it.t0}
    else it.dur=Math.max(.3,snapT(o.t0+o.dur+dt,it,drag.pts)-o.t0);
    drag.blk.style.left=it.t0*pps+'px';drag.blk.style.width=Math.max(8,it.dur*pps-1)+'px';P.t=clamp(drag.mode==='trimR'?it.t0+it.dur-.05:it.t0+.05,0,total);dirty=true;return}
  if(drag.k==='cap'){const d=o.e-o.s;it.s=Math.max(0,snapT(o.s+dt,it,drag.pts));it.e=it.s+d;drag.blk.style.left=it.s*pps+'px';dirty=true}
});
function endDrag(){
  if(!drag)return;const d=drag;drag=null;const mk=$('.drop-mark');if(mk)mk.remove();$('#snapline').hidden=true;
  if(d.mode==='scrub')return;
  if(!d.moved){select(d.k,d.id);const o=d.obj;
    if(d.k==='cap')seek(o.s+.01);else if(d.k==='text'||d.k==='ov'){if(P.t<o.t0||P.t>o.t0+o.dur)seek(o.t0+.05)}else if(P.t<o.t0||P.t>=o.t0+idur(o))seek(o.t0+.01);return}
  pushUndo(d.snap);
  if(d.k==='item'&&d.mode==='move'&&d.at!==undefined){const from=S.items.indexOf(d.obj);let to=d.at;if(to>from)to--;if(to!==from){S.items.splice(from,1);S.items.splice(to,0,d.obj)}}
  if(d.k==='cap')S.caps.sort((a,b)=>a.s-b.s);
  afterChange();renderInsp();showFrame();
}
tlIn.addEventListener('pointerup',endDrag);tlIn.addEventListener('pointercancel',endDrag);
function positionMain(){const kids=$('#lane-main').children;S.items.forEach((it,i)=>{const b=kids[i];if(!b)return;b.style.left=it.t0*pps+'px';b.style.width=Math.max(4,idur(it)*pps-1)+'px';const em=b.querySelector('em');if(em)em.textContent=r1(idur(it))+'s'})}
$('#tl-zin').addEventListener('click',()=>setPps(pps*1.4));
$('#tl-zout').addEventListener('click',()=>setPps(pps/1.4));
$('#tl-zoom').addEventListener('input',e=>setPps(zv2pps(+e.target.value)));
$('#tl-fit').addEventListener('click',fitTL);
function setTool(t){tool=t;$('#tool-sel').classList.toggle('on',t==='sel');$('#tool-razor').classList.toggle('on',t==='razor');$('.tl').classList.toggle('razor',t==='razor')}
$('#tool-sel').addEventListener('click',()=>setTool('sel'));$('#tool-razor').addEventListener('click',()=>setTool('razor'));
$('#tl-snap').addEventListener('click',()=>{snapOn=!snapOn;$('#tl-snap').classList.toggle('on',snapOn);toast(snapOn?'Mıknatıs açık':'Mıknatıs kapalı',1200)});
(()=>{const h=$('#tl-resize');let y0=0,h0=0,on=false;h.addEventListener('pointerdown',e=>{on=true;y0=e.clientY;h0=$('.tl').getBoundingClientRect().height;h.setPointerCapture(e.pointerId)});
  h.addEventListener('pointermove',e=>{if(!on)return;const v=clamp(h0+(y0-e.clientY),160,Math.round(innerHeight*.6));$('#app').style.setProperty('--tlh',v+'px');fitCanvas()});
  h.addEventListener('pointerup',()=>{on=false;try{localStorage.setItem('zc_tlh',$('#app').style.getPropertyValue('--tlh'))}catch(e){}})})();
tlScroll.addEventListener('wheel',e=>{if(e.ctrlKey){e.preventDefault();pps=clamp(pps*(e.deltaY<0?1.15:1/1.15),4,240);renderTL()}},{passive:false});
function splitTarget(){
  if(SEL&&SEL.kind==='text'){const L=selObj();if(L&&P.t>L.t0+.15&&P.t<L.t0+L.dur-.15)return{kind:'text',o:L}}
  if(!S.items.length||P.t>=contentDur)return null;const i=idxAt(P.t),it=S.items[i];const local=P.t-it.t0;if(local<.15||idur(it)-local<.15)return null;return{kind:'item',o:it,local}}
function updTools(){const o=selObj();$('#tl-split').disabled=!splitTarget();$('#tl-dup').disabled=!o||SEL.kind==='cap';$('#tl-del').disabled=!o;$('#btn-undo').disabled=!undo.length;$('#btn-redo').disabled=!redo.length}
function doSplit(){const st=splitTarget();if(!st){toast('Oynatma çizgisini bir parçanın ortasına getir');return}hist();
  if(st.kind==='text'){const L=st.o,cut=P.t-L.t0;const n={...L,id:nid(),t0:P.t,dur:L.dur-cut};delete n._bb;L.dur=cut;S.texts.push(n)}
  else{const it=st.o,i=S.items.indexOf(it),{el,...plain}=it,n={...JSON.parse(JSON.stringify(plain)),id:nid(),tr:{type:'none',d:.5}};
    if(it.type==='video'){const cut=it.in+st.local*(it.speed||1);n.in=cut;it.out=cut}else{n.off=(it.off||0)+st.local;n.dur=it.dur-st.local;it.dur=st.local}
    S.items.splice(i+1,0,n);SEL={kind:'item',id:n.id}}
  afterChange();renderInsp();showFrame();toast('Bölündü')}
function doDup(){const o=selObj();if(!o||SEL.kind==='cap')return;hist();
  if(SEL.kind==='item'){const i=S.items.indexOf(o);const {el,...plain}=o;const n={...JSON.parse(JSON.stringify(plain)),id:nid()};S.items.splice(i+1,0,n);afterChange();select('item',n.id,false)}
  else{const k=SEL.kind;const {_bb,...plain}=o;const n={...plain,id:nid(),t0:o.t0+o.dur};listOf(k).push(n);afterChange();select(k,n.id,false)}
  toast('Kopyalandı')}
function doDel(){const o=selObj();if(!o)return;hist();
  const L=listOf(SEL.kind);L.splice(L.indexOf(o),1);
  if(SEL.kind==='item'&&S.items[0]&&S.items[0].tr)S.items[0].tr.type='none';
  select(null);afterChange();P.t=Math.min(P.t,total);showFrame()}
$('#tl-split').addEventListener('click',doSplit);$('#tl-dup').addEventListener('click',doDup);$('#tl-del').addEventListener('click',doDel);

/* ================= tuvalde yazı sürükleme ================= */
let cdrag=null;
cv.addEventListener('pointerdown',e=>{
  const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  const inBB=L=>L._bb&&P.t>=L.t0&&P.t<=L.t0+L.dur&&x>=L._bb.x&&x<=L._bb.x+L._bb.w&&y>=L._bb.y&&y<=L._bb.y+L._bb.h;
  let hk='text',hit=S.texts.slice().reverse().find(inBB);if(!hit){hk='ov';hit=S.ovs.slice().reverse().find(inBB)}
  if(!hit){if(SEL&&(SEL.kind==='text'||SEL.kind==='ov'))select(null);return}
  if(P.playing)pause();select(hk,hit.id);
  cdrag={L:hit,x0:x,y0:y,ox:hit.x,oy:hit.y,snap:snap(),moved:false};cv.setPointerCapture(e.pointerId);e.preventDefault()});
cv.addEventListener('pointermove',e=>{if(!cdrag)return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  let nx=clamp(cdrag.ox+(x-cdrag.x0)/W,.05,.95),ny=clamp(cdrag.oy+(y-cdrag.y0)/H,.04,.96);if(Math.abs(nx-.5)<.015)nx=.5;cdrag.L.x=nx;cdrag.L.y=ny;cdrag.moved=true;dirty=true});
const cend=()=>{if(cdrag&&cdrag.moved){pushUndo(cdrag.snap);scheduleSave()}cdrag=null};
cv.addEventListener('pointerup',cend);
cv.addEventListener('wheel',e=>{const o=selObj();if(!o||!(SEL.kind==='ov'||SEL.kind==='text'))return;e.preventDefault();if(SEL.kind==='ov')o.w=clamp(o.w*(e.deltaY<0?1.06:1/1.06),.05,1.2);else o.size=clamp(o.size*(e.deltaY<0?1.05:1/1.05),.3,2.5);dirty=true;clearTimeout(cv._wt);cv._wt=setTimeout(()=>{renderInsp();scheduleSave()},300)},{passive:false});cv.addEventListener('pointercancel',cend);

/* ================= düzenle paneli ================= */
const ST_OPT={bg:[['mesh','Ağ'],['split','Bölünmüş'],['rings','Halkalar'],['photo','Fotoğraf'],['solid','Düz'],['dots','Noktalı'],['stripes','Çizgili'],['grid','Izgara']],
  anim:[['mask','Maske'],['slide','Kay'],['scale','Büyü'],['letter','Harf harf'],['blur','Netleş'],['type','Daktilo']],align:[['left','Sola'],['center','Ortaya']],
  deco:[[-1,'Yok'],[1,'Süs 1'],[2,'Süs 2'],[4,'Süs 3']],pair:[[0,'Yazı tipi 1'],[1,'Yazı tipi 2'],[2,'Yazı tipi 3'],[3,'Yazı tipi 4']],card:[['false','Tam ekran'],['true','Kart']]};
let PALS=null;function palettes(){if(PALS)return PALS;const seen=new Set();PALS=[];if(ZM)for(const sc of ZM.SECTORS){const k=sc.p.join();if(!seen.has(k)){seen.add(k);PALS.push(sc.p)}}return PALS}
function motionDesignHTML(it,tpl){
  const sib=ZM?ZM.TEMPLATES.filter(t=>t.grp&&t.grp===tpl.grp):[];const st=Object.assign({},tpl.st||{},it.st||{});let h='';
  if(sib.length>1)h+=`<h3>Stil</h3>${chipsHTML('tplv',sib.map(t=>[t.id,t.style||t.name]),it.tpl)}`;
  h+=`<h3>Renk paleti</h3><div class="pals">${palettes().slice(0,24).map(([a,b])=>`<button type="button" data-pal="${a}|${b}" title="${a} · ${b}" style="background:linear-gradient(135deg,${a} 50%,${b} 50%)"></button>`).join('')}</div>`;
  h+=`<h3>Hız</h3>${chipsHTML('ms',[[.5,'0.5x'],[.75,'0.75x'],[1,'1x'],[1.25,'1.25x'],[1.5,'1.5x'],[2,'2x']],it.ms||1)}`;
  if(tpl.st){h+=`</div><div class="sect"><h3>Tasarım</h3><label>Arka plan</label>${chipsHTML('st-bg',ST_OPT.bg,st.bg)}<label>Yazı animasyonu</label>${chipsHTML('st-anim',ST_OPT.anim,st.anim)}
    <label>Hizalama</label>${chipsHTML('st-align',ST_OPT.align,st.align)}<label>Süsleme</label>${chipsHTML('st-deco',ST_OPT.deco,st.deco)}<label>Yazı tipi</label>${chipsHTML('st-pair',ST_OPT.pair,st.pair)}<label>Yerleşim</label>${chipsHTML('st-card',ST_OPT.card,String(!!st.card))}
    ${it.st&&Object.keys(it.st).length?'<button class="lnk" data-a="streset" type="button" style="margin-top:8px">Tasarımı sıfırla</button>':''}${st.bg==='photo'&&!it.photo?'<p class="note">Fotoğraflı arka plan için aşağıdan bir fotoğraf seç.</p>':''}`}
  return h}
const chipsHTML=(k,list,cur)=>`<div class="chips" data-chips="${k}">${list.map(([v,n])=>`<button type="button" data-v="${v}" class="${String(v)===String(cur)?'on':''}">${n}</button>`).join('')}</div>`;
const swHTML=(k,cur)=>`<div class="sw" data-sw="${k}">${COLORS.map(c=>`<button type="button" data-v="${c}" class="${c.toLowerCase()===String(cur).toLowerCase()?'on':''}" style="background:${c}" aria-label="${c}"></button>`).join('')}<input type="color" data-k="${k}" value="${cur||'#ffffff'}" aria-label="Özel renk"></div>`;
function renderInsp(){
  const box=$('#insp');const o=selObj();if(!o){box.innerHTML='<div class="insp-empty"><svg><use href="#i-sliders"/></svg><b>Seçili öğe yok</b><span>Zaman çizgisinden bir video, yazı ya da altyazı seç; ayarları burada görünür.</span></div>';return}
  let h='';
  if(SEL.kind==='item'){const it=o;const s=it.src?srcById(it.src):null;const tpl=it.type==='motion'?TPL.get(it.tpl):null;const first=S.items.indexOf(it)===0;
    h+=`<div class="insp-h"><span class="sw2" style="background:var(--c-${it.type==='video'?'vid':it.type==='image'?'img':'mot'})"></span><div><b ${it.type==='motion'?'lang="en"':''}>${it.type==='video'?'Video':it.type==='image'?'Fotoğraf':'Motion'}</b><small>${esc(tpl?tpl.name:s?s.name:'')}</small></div><span class="d">${tc(idur(it))}</span></div><div class="sect"><h3>Zamanlama</h3>`;
    if(it.type==='video')h+=`<div class="grid2"><label>Başlangıç (sn)<input type="number" step="0.1" min="0" data-k="in" value="${r2(it.in)}"></label><label>Bitiş (sn)<input type="number" step="0.1" min="0" data-k="out" value="${r2(it.out)}"></label></div>
      <h3>Hız</h3>${chipsHTML('speed',[[.5,'0.5x'],[.75,'0.75x'],[1,'1x'],[1.5,'1.5x'],[2,'2x'],[3,'3x']],it.speed||1)}
      <label>Ses seviyesi<input type="range" min="0" max="2" step="0.05" data-k="vol" value="${it.vol??1}"></label>`;
    else h+=`<label>Süre (sn)<input type="number" step="0.1" min="0.4" data-k="dur" value="${r2(it.dur)}"></label>`;
    if(it.type!=='motion'){const mvk=it.mv===undefined?(it.type==='image'&&it.kb!==false?'in':'none'):it.mv,a=it.adj||{b:0,c:0,s:0,w:0};
      h+=`</div><div class="sect"><h3>Hareket</h3>${chipsHTML('mv',MOVES,mvk)}<label>Hareket miktarı<input type="range" min="0.04" max="0.4" step="0.01" data-k="mva" value="${it.mva??.12}"></label>
      </div><div class="sect"><div class="ph" style="margin:16px 0 4px"><h3 style="margin:0">Renk</h3><button class="lnk" data-a="adjreset" type="button">Sıfırla</button></div>
      <label>Parlaklık<input type="range" min="-1" max="1" step="0.05" data-k="adj-b" value="${a.b||0}"></label><label>Kontrast<input type="range" min="-1" max="1" step="0.05" data-k="adj-c" value="${a.c||0}"></label>
      <label>Doygunluk<input type="range" min="-1" max="1" step="0.05" data-k="adj-s" value="${a.s||0}"></label><label>Sıcaklık<input type="range" min="-1" max="1" step="0.05" data-k="adj-w" value="${a.w||0}"></label>`}
    if(it.type==='motion'&&tpl){const lb=tpl.labels||{};
      h+=`</div><div class="sect"><h3><span lang="en">Motion</span> yazıları</h3><div class="fields">${Object.keys(lb).map(k=>`<label>${esc(lb[k])}<input type="text" data-f="${k}" value="${esc(it.f[k]||'')}"></label>`).join('')}</div>
      <div class="grid2"><label>Ana renk<input type="color" data-f="p" value="${it.f.p||'#111111'}"></label><label>Vurgu rengi<input type="color" data-f="a" value="${it.f.a||'#ffcc00'}"></label></div>
      ${motionDesignHTML(it,tpl)}
      <label>Fotoğraf<select data-k="photo"><option value="">Yok</option>${S.sources.filter(x=>x.kind==='image').map(x=>`<option value="${x.id}" ${it.photo===x.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>
      <p class="note">Logoyu Görünüm sekmesinden yüklersen motionda da görünür.${ACCESS.motionWm?' Bu ayki filigransız motion hakkın bittiği için motionlar filigranlı çıkar.':''}</p>`}
    h+=`</div><div class="sect"><h3>Girişteki geçiş</h3>${first?'<p class="note">İlk parçada geçiş olmaz.</p>':chipsHTML('tr',TRANS,(it.tr||{}).type||'none')+`<label>Geçiş süresi<input type="range" min="0.2" max="1.5" step="0.1" data-k="trd" value="${(it.tr||{}).d||.5}"></label>`}`;
    h+=`</div><div class="acts2"><button class="btn sm" data-a="split" type="button"><svg><use href="#i-cut"/></svg>Böl</button><button class="btn sm" data-a="dup" type="button"><svg><use href="#i-copy"/></svg>Kopyala</button><button class="btn sm" data-a="left" type="button">Başa al</button><button class="btn sm" data-a="right" type="button">Sona al</button><button class="btn ghost sm" data-a="del" type="button" style="color:#ff8a8a;grid-column:1/-1"><svg><use href="#i-trash"/></svg>Sil</button></div>`}
  else if(SEL.kind==='text'){const L=o;
    h+=`<div class="insp-h"><span class="sw2" style="background:var(--c-txt)"></span><div><b>Yazı</b><small>${esc(L.text.slice(0,40))}</small></div><span class="d">${tc(L.dur)}</span></div><div class="sect"><h3>Metin</h3>
      <textarea rows="2" data-k="text">${esc(L.text)}</textarea>
      <h3>Yazı tipi</h3>${chipsHTML('font',Object.entries(FONTS).map(([k,v])=>[k,v[2]]),L.font)}
      <label>Boyut<input type="range" min="0.3" max="2.5" step="0.05" data-k="size" value="${L.size}"></label>
      <label class="chk"><input type="checkbox" data-k="upper" ${L.upper?'checked':''}> BÜYÜK HARF</label>
      <h3>Renk</h3>${swHTML('color',L.color)}
      <h3>Arka plan</h3>${chipsHTML('bg',[['none','Yok'],['shadow','Gölge'],['outline','Kontur'],['box','Kutu'],['pill','Etiket']],L.bg)}
      ${L.bg==='box'||L.bg==='pill'?`<h3>Kutu rengi</h3>${swHTML('bgc',L.bgc||'#FFFFFF')}`:''}
      <h3>Animasyon</h3>${chipsHTML('anim',[['pop','Zıpla'],['fade','Belir'],['slide','Kay'],['type','Daktilo'],['none','Yok']],L.anim)}
      <div class="grid2"><label>Başlangıç (sn)<input type="number" step="0.1" min="0" data-k="t0" value="${r2(L.t0)}"></label><label>Süre (sn)<input type="number" step="0.1" min="0.3" data-k="dur" value="${r2(L.dur)}"></label></div>
      <p class="note">Önizlemede yazıyı sürükleyerek yerini değiştir.</p>
      </div><div class="acts2"><button class="btn sm" data-a="center" type="button">Ortala</button><button class="btn sm" data-a="dup" type="button"><svg><use href="#i-copy"/></svg>Kopyala</button><button class="btn ghost sm" data-a="del" type="button" style="color:#ff8a8a;grid-column:1/-1"><svg><use href="#i-trash"/></svg>Sil</button></div>`}
  else if(SEL.kind==='ov'){const O=o;const sr=srcById(O.src);
    h+=`<div class="insp-h"><span class="sw2" style="background:var(--c-ov)"></span><div><b>Üst katman (V2)</b><small>${esc(sr?sr.name:'')}</small></div><span class="d">${tc(O.dur)}</span></div>
      <div class="sect"><h3>Boyut ve görünüm</h3><label>Boyut<input type="range" min="0.05" max="1.2" step="0.01" data-k="w" value="${O.w}"></label><label>Saydamlık<input type="range" min="0.1" max="1" step="0.05" data-k="op" value="${O.op??1}"></label>
      <label class="chk"><input type="checkbox" data-k="shadow" ${O.shadow!==false?'checked':''}> Gölge</label><label class="chk"><input type="checkbox" data-k="round" ${O.round?'checked':''}> Yuvarlak köşe</label>
      <h3>Giriş animasyonu</h3>${chipsHTML('anim',[['fade','Belir'],['pop','Zıpla'],['slide','Kay'],['none','Yok']],O.anim||'fade')}
      <h3>Hareket</h3>${chipsHTML('mv',MOVES.filter(m=>['none','in','out'].includes(m[0])),O.mv||'none')}
      <div class="grid2"><label>Başlangıç (sn)<input type="number" step="0.1" min="0" data-k="t0" value="${r2(O.t0)}"></label><label>Süre (sn)<input type="number" step="0.1" min="0.3" data-k="dur" value="${r2(O.dur)}"></label></div>
      <p class="note">Önizlemede sürükleyerek yerini değiştir; fare tekerleğiyle büyüt/küçült.</p>
      </div><div class="acts2"><button class="btn sm" data-a="center" type="button">Ortala</button><button class="btn sm" data-a="dup" type="button"><svg><use href="#i-copy"/></svg>Kopyala</button><button class="btn ghost sm" data-a="del" type="button" style="color:#ff8a8a;grid-column:1/-1"><svg><use href="#i-trash"/></svg>Sil</button></div>`}
  else{const c=o;h+=`<div class="insp-h"><span class="sw2" style="background:var(--c-cap)"></span><div><b>Altyazı satırı</b><small>${tc(c.s)}</small></div></div><textarea rows="2" data-k="t">${esc(c.t)}</textarea><div class="grid2"><label>Başlangıç<input type="number" step="0.1" min="0" data-k="s" value="${r2(c.s)}"></label><label>Bitiş<input type="number" step="0.1" min="0" data-k="e" value="${r2(c.e)}"></label></div><p class="note">Stil ayarları Altyazı sekmesinde.</p><div class="row"><button class="btn ghost sm" data-a="del" type="button" style="color:#ff8a8a">Sil</button></div>`}
  box.innerHTML=h;
}
let inspSnap=null;
$('#insp').addEventListener('focusin',()=>{inspSnap=snap()});
function inspApply(el,val){
  const o=selObj();if(!o)return;const k=el.dataset.k,f=el.dataset.f;
  if(inspSnap){pushUndo(inspSnap);inspSnap=null}
  if(f!==undefined){o.f[f]=val;dirty=true;scheduleSave();return}
  if(SEL.kind==='item'){const it=o;
    if(k==='in'){const v=parseFloat(val);if(!isNaN(v))it.in=clamp(v,0,it.out-.2)}
    else if(k==='out'){const v=parseFloat(val),s=srcById(it.src);if(!isNaN(v))it.out=clamp(v,it.in+.2,s.dur)}
    else if(k==='dur'){const v=parseFloat(val);if(!isNaN(v)){const max=it.type==='motion'?((TPL.get(it.tpl)?.dur||8)-(it.off||0))/(it.ms||1):60;it.dur=clamp(v,.4,max)}}
    else if(k==='vol'){it.vol=parseFloat(val);if(it.el&&it.el._g)it.el._g.gain.value=it.vol}
    else if(k==='trd'){it.tr=it.tr||{type:'fade'};it.tr.d=parseFloat(val)}
    else if(k==='kb')it.kb=val;
    else if(k==='mva')it.mva=parseFloat(val);
    else if(k&&k.startsWith('adj-')){it.adj=it.adj||{b:0,c:0,s:0,w:0};it.adj[k.slice(4)]=parseFloat(val)}
    else if(k==='photo')it.photo=val?+val:null;
    layout();renderTL();if(k!=='vol')showFrame()}
  else if(SEL.kind==='ov'){const O=o;
    if(k==='w')O.w=parseFloat(val);else if(k==='op')O.op=parseFloat(val);else if(k==='shadow')O.shadow=val;else if(k==='round')O.round=val;
    else if(k==='t0'){const v=parseFloat(val);if(!isNaN(v))O.t0=Math.max(0,v)}else if(k==='dur'){const v=parseFloat(val);if(!isNaN(v))O.dur=Math.max(.3,v)}
    if(k==='t0'||k==='dur')renderTL()}
  else if(SEL.kind==='text'){const L=o;
    if(k==='text'){L.text=val;const sm=$('#insp .insp-h small');if(sm)sm.textContent=val.slice(0,40)}else if(k==='size')L.size=parseFloat(val);else if(k==='upper')L.upper=val;else if(k==='color'||k==='bgc')L[k]=val;
    else if(k==='t0'){const v=parseFloat(val);if(!isNaN(v))L.t0=Math.max(0,v)}else if(k==='dur'){const v=parseFloat(val);if(!isNaN(v))L.dur=Math.max(.3,v)}
    if(k==='t0'||k==='dur'||k==='text'){renderTL();renderTList()}}
  else{const c=o;if(k==='t'){const n=val.trim().split(/\s+/).length;if(c.w&&c.w.length!==n)c.w=null;c.t=val;renderCaps()}else{const v=parseFloat(val);if(!isNaN(v)){c[k]=Math.max(0,v);c.w=null}}renderTL()}
  dirty=true;scheduleSave();
}
$('#insp').addEventListener('input',e=>{const el=e.target;if(el.dataset.k===undefined&&el.dataset.f===undefined)return;if(el.type==='number')return;inspApply(el,el.type==='checkbox'?el.checked:el.value)});
$('#insp').addEventListener('change',e=>{const el=e.target;if(el.type==='number'){inspApply(el,el.value);renderInsp()}else if(el.tagName==='SELECT')inspApply(el,el.value)});
$('#insp').addEventListener('click',e=>{
  const o=selObj();if(!o)return;
  const chip=e.target.closest('[data-chips] button'),sw=e.target.closest('[data-sw] button'),act=e.target.closest('[data-a]');
  if(chip){hist();const k=chip.parentElement.dataset.chips,v=chip.dataset.v;
    if(k==='speed')o.speed=parseFloat(v);else if(k==='tr')o.tr={type:v,d:(o.tr&&o.tr.d)||.5};
    else if(k==='ms'){o.ms=parseFloat(v);const tp=TPL.get(o.tpl);if(tp)o.dur=Math.min(o.dur,(tp.dur-(o.off||0))/o.ms)}
    else if(k==='tplv'){o.tpl=v;mThumbsDirty()}
    else if(k.startsWith('st-')){const key=k.slice(3);o.st=o.st||{};o.st[key]=key==='deco'||key==='pair'?parseInt(v):key==='card'?v==='true':v}
    else o[k]=v;
    afterChange();renderInsp();showFrame();if(k==='tr'&&v!=='none')seek(o.t0);return}
  if(sw){hist();o[sw.parentElement.dataset.sw]=sw.dataset.v;dirty=true;renderInsp();scheduleSave();return}
  const pal=e.target.closest('[data-pal]');if(pal&&o.f){hist();const [a,b]=pal.dataset.pal.split('|');o.f.p=a;o.f.a=b;dirty=true;renderInsp();scheduleSave();return}
  if(act){const a=act.dataset.a;
    if(a==='del')doDel();else if(a==='dup')doDup();
    else if(a==='split'){if(SEL.kind==='item')P.t=clamp(P.t,o.t0+.2,o.t0+idur(o)-.2);doSplit()}
    else if(a==='center'){hist();o.x=.5;if(SEL.kind==='ov')o.y=.5;dirty=true;scheduleSave()}
    else if(a==='streset'){hist();o.st={};dirty=true;renderInsp();scheduleSave()}
    else if(a==='adjreset'){hist();o.adj={b:0,c:0,s:0,w:0};dirty=true;renderInsp();scheduleSave()}
    else if(a==='left'||a==='right'){hist();const i=S.items.indexOf(o);S.items.splice(i,1);if(a==='left')S.items.unshift(o);else S.items.push(o);S.items[0].tr={type:'none',d:.5};afterChange();renderInsp();seek(o.t0)}}
});

/* ================= motion kütüphanesi ================= */
const mThumbCache=new Map();let mList=[],mShown=0,mReady=false,mObs=null;
function mThumbsDirty(){mThumbCache.clear();if(mReady)$$('#m-grid canvas').forEach(c=>{c.dataset.done='';if(mObs){mObs.unobserve(c);mObs.observe(c)}})}
function mEnsure(){
  if(mReady||!ZM)return;mReady=true;
  const secs=[...new Set(ZM.TEMPLATES.map(t=>ZM.secOf(t)))].sort((a,b)=>a.localeCompare(b,'tr'));
  $('#m-sector').innerHTML='<option value="">Tüm sektörler</option>'+secs.map(s=>`<option>${esc(s)}</option>`).join('');
  const cats=[...new Set(ZM.TEMPLATES.map(t=>t.cat))].sort((a,b)=>a.localeCompare(b,'tr'));
  $('#m-cat').innerHTML='<option value="">Tüm türler</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
  $('#m-clips').innerHTML=ZM.MOT.map(m=>`<button class="mcard" type="button" data-mot="${m.k}"><img src="/zodmotionsBeta/m/${m.k}.jpg" alt="" loading="lazy"><span>${esc(m.ad)}</span></button>`).join('');
  mObs=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)mThumb(en.target)}),{rootMargin:'200px'});
  mFilter();
}
function mFilter(){
  const q=$('#m-q').value.trim().toLocaleLowerCase('tr'),sec=$('#m-sector').value,cat=$('#m-cat').value;
  mList=ZM.TEMPLATES.filter(t=>(!sec||ZM.secOf(t)===sec)&&(!cat||t.cat===cat)&&(!q||(t.name+' '+t.cat+' '+ZM.secOf(t)+' '+(t.def.title||'')).toLocaleLowerCase('tr').includes(q)));
  $('#m-info').textContent=mList.length.toLocaleString('tr-TR')+' şablon. Dokun, oynatma çizgisinin olduğu yere eklensin.'+(ACCESS.motionWm?' Bu ayki filigransız hakkın bitti; motionlar filigranlı çıkar.':'');
  $('#m-grid').innerHTML='';mShown=0;mMore();
}
function mMore(){const part=mList.slice(mShown,mShown+30);mShown+=part.length;
  const frag=document.createDocumentFragment();part.forEach(t=>{const b=document.createElement('button');b.className='mcard';b.type='button';b.dataset.tpl=t.id;b.innerHTML=`<canvas width="135" height="240"></canvas><span>${esc(t.name)}</span>`;frag.appendChild(b);mObs.observe(b.querySelector('canvas'))});
  $('#m-grid').appendChild(frag);$('#m-more').hidden=mShown>=mList.length}
function mThumb(c){if(c.dataset.done)return;c.dataset.done='1';const t=TPL.get(c.parentElement.dataset.tpl);if(!t)return;try{ZM.renderFrame(c.getContext('2d'),t,Math.min(t.dur*.55,t.dur-.6),t.def,{photo:null,logo:S.logo},false)}catch(e){}}
function tplThumbURL(t){if(mThumbCache.has(t.id))return mThumbCache.get(t.id);const c=document.createElement('canvas');c.width=54;c.height=96;try{ZM.renderFrame(c.getContext('2d'),t,Math.min(t.dur*.55,t.dur-.6),t.def,{photo:null,logo:S.logo},false)}catch(e){}const u=c.toDataURL('image/jpeg',.6);mThumbCache.set(t.id,u);return u}
$('#m-q').addEventListener('input',()=>{clearTimeout(mFilter.t);mFilter.t=setTimeout(mFilter,250)});
$('#m-sector').addEventListener('change',mFilter);$('#m-cat').addEventListener('change',mFilter);$('#m-more').addEventListener('click',mMore);
$('#m-grid').addEventListener('click',e=>{const b=e.target.closest('.mcard');if(!b)return;const t=TPL.get(b.dataset.tpl);if(!t)return;
  hist();const at=insertAt();const it=insertItem({type:'motion',tpl:t.id,f:{...t.def},dur:t.dur,off:0,photo:null,tr:{type:at?'fade':'none',d:.4}},at);afterChange();select('item',it.id,false);seek(it.t0+.6);toast('Motion eklendi: '+t.name+'. Yazılarını sağdaki panelden değiştir.',3500)});
$('#m-clips').addEventListener('click',e=>{const b=e.target.closest('.mcard');if(b)addMotClip(b.dataset.mot)});
async function addMotClip(k){const m=ZM.MOT.find(x=>x.k===k);if(!m)return;const url=`/zodmotionsBeta/m/${k}.mp4`;
  let s=S.sources.find(x=>x.url===url);
  try{if(!s)s=await makeSource({kind:'video',name:'Motion · '+m.ad,url,thumb:`/zodmotionsBeta/m/${k}.jpg`,hidden:true});
    hist();const at=insertAt();const it=insertItem({type:'video',src:s.id,in:0,out:r2(s.dur),tr:{type:at?'fade':'none',d:.3}},at);afterChange();select('item',it.id,false);seek(it.t0+.01);toast('Motion klibi eklendi')}
  catch(err){toast('Motion klibi yüklenemedi')}}

/* ================= yazı ================= */
const TPRE=[
  {n:'Başlık',o:{text:'BAŞLIK YAZ',font:'d',size:1.35,color:'#FFFFFF',bg:'shadow',anim:'pop',y:.22,upper:true}},
  {n:'Kanca',o:{text:'BUNU KİMSE SÖYLEMİYOR',font:'c',size:1.25,color:'#FFD84D',bg:'outline',anim:'pop',y:.18,upper:true}},
  {n:'Alt başlık',o:{text:'Kısa açıklama yaz',font:'b',size:.72,color:'#0B0C0E',bg:'box',bgc:'#FFFFFF',anim:'slide',y:.3}},
  {n:'Etiket',o:{text:'%30 İNDİRİM',font:'b',size:.7,color:'#0B0C0E',bg:'pill',bgc:'#FFD84D',anim:'pop',y:.78,upper:true}},
  {n:'Zarif',o:{text:'Hayalinizdeki ev',font:'s',size:1.05,color:'#FFFFFF',bg:'shadow',anim:'fade',y:.25}},
  {n:'Daktilo',o:{text:'Yeni sezon başladı…',font:'m',size:.7,color:'#FFFFFF',bg:'box',bgc:'#0B0C0E',anim:'type',y:.32}},
  {n:'Modern',o:{text:'MODERN YAŞAM',font:'u',size:.9,color:'#FFFFFF',bg:'none',anim:'slide',y:.2,upper:true}},
  {n:'Fiyat',o:{text:'₺4.250.000',font:'d',size:1.2,color:'#0B0C0E',bg:'pill',bgc:'#FFFFFF',anim:'pop',y:.72}}];
function renderTPresets(){$('#t-presets').innerHTML=TPRE.map((p,i)=>{const F=FONTS[p.o.font];const box=p.o.bg==='box'||p.o.bg==='pill';const ital=F[1].includes('italic');
  return `<button type="button" data-i="${i}" title="${p.n}"><span style="font-family:${F[0].replace(/"/g,"'")};font-weight:${F[1].replace('italic ','')};${ital?'font-style:italic;':''}font-size:${Math.min(17,11+p.o.size*4)}px;color:${box?onColor(p.o.bgc):p.o.color};${box?`background:${p.o.bgc};padding:3px 9px;border-radius:${p.o.bg==='pill'?'99px':'5px'};`:''}${p.o.bg==='outline'?'-webkit-text-stroke:.6px #000;':''}${p.o.bg==='shadow'?'text-shadow:0 2px 6px #000;':''}white-space:nowrap">${esc(p.n)}</span></button>`}).join('')}
$('#t-presets').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(!S.items.length){toast('Önce bir video ekle');return}const p=TPRE[+b.dataset.i];hist();
  const t0=Math.min(P.t,Math.max(0,contentDur-.5));const L={id:nid(),t0,dur:Math.min(3,Math.max(1,contentDur-t0)),x:.5,bgc:'#FFFFFF',upper:false,...p.o};S.texts.push(L);afterChange();select('text',L.id);seek(t0+.6);toast('Yazı eklendi; metni sağdaki panelden değiştir')});
function renderTList(){$('#t-empty').hidden=!!S.texts.length;$('#t-list').innerHTML=S.texts.slice().sort((a,b)=>a.t0-b.t0).map(L=>`<li class="cap" data-id="${L.id}"><div class="top">${fmtT1(L.t0)} · ${r1(L.dur)} sn<span class="acts"><button data-a="edit" type="button">Düzenle</button><button data-a="del" class="x" type="button">Sil</button></span></div><div style="margin-top:4px">${esc(L.text)}</div></li>`).join('')}
$('#t-list').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=+b.closest('.cap').dataset.id;if(b.dataset.a==='del'){SEL={kind:'text',id};doDel()}else{const L=S.texts.find(x=>x.id===id);select('text',id);seek(L.t0+.05)}});

/* ================= ses analizi ================= */
// Büyük dosyalar için: sesi parça parça okuyup 16 kHz tek kanala indirir (dosyanın tamamı belleğe alınmaz)
const mbInput=(mb,s)=>new mb.Input({source:s.blob?new mb.BlobSource(s.blob):new mb.UrlSource(s.url),formats:mb.ALL_FORMATS});
async function pcmStream(s){
  const mb=await loadMB();const input=mbInput(mb,s);
  try{const tr=await input.getPrimaryAudioTrack();if(!tr)return null;if(!(await tr.canDecode()))throw new Error('cozulemiyor');
    const dur=await input.computeDuration();const out=new Float32Array(Math.ceil(dur*16000)+1600);let maxK=0;
    const sink=new mb.AudioSampleSink(tr);
    for await(const sm of sink.samples()){const n=sm.numberOfFrames,ch=Math.min(2,sm.numberOfChannels),sr=sm.sampleRate,ts=sm.timestamp;
      const a=new Float32Array(n),b=ch>1?new Float32Array(n):null;sm.copyTo(a,{planeIndex:0,format:'f32-planar'});if(b)sm.copyTo(b,{planeIndex:1,format:'f32-planar'});sm.close();
      const r=sr/16000,k0=Math.max(0,Math.ceil(ts*16000)),k1=Math.min(out.length-1,Math.floor((ts+n/sr)*16000));
      for(let k=k0;k<=k1;k++){const c=(k/16000-ts)*sr,i0=Math.max(0,Math.floor(c-r/2)),i1=Math.min(n-1,Math.ceil(c+r/2));let sum=0,cnt=0;for(let i=i0;i<=i1;i++){sum+=b?(a[i]+b[i])*.5:a[i];cnt++}out[k]=cnt?sum/cnt:0}
      if(k1>maxK)maxK=k1}
    return out.subarray(0,maxK+1)}
  finally{try{input.dispose&&input.dispose()}catch(e){}}}
async function pcmOf(s){
  if(s.pcm!==undefined)return s.pcm;
  if(s._pcmP)return s._pcmP;
  s._pcmP=(async()=>{try{s.pcm=await pcmStream(s);return s.pcm}catch(e){console.warn('ses akışla okunamadı, klasik yönteme geçiliyor',e)}
  ensureAudio();
  if(s.blob&&s.blob.size>400*1048576){s.pcm=null;return null}
  try{const ab=s.blob?await s.blob.arrayBuffer():await (await fetch(s.url)).arrayBuffer();const dec=await AC.decodeAudioData(ab);
    const off=new OfflineAudioContext(1,Math.max(1,Math.ceil(dec.duration*16000)),16000);const n=off.createBufferSource();n.buffer=dec;n.connect(off.destination);n.start();
    s.pcm=(await off.startRendering()).getChannelData(0)}
  catch(e){s.pcm=null}
  return s.pcm})();return s._pcmP}
function frameDB(pcm,a,b,F=320){const i0=Math.floor(a*16000/F),i1=Math.floor(b*16000/F),db=[];for(let i=i0;i<i1;i++){let sum=0;const o=i*F;for(let k=0;k<F;k++){const v=pcm[o+k]||0;sum+=v*v}db.push(10*Math.log10(sum/F+1e-10))}return db}
function speechRanges(pcm,a,b){
  const db=frameDB(pcm,a,b);if(!db.length)return[[a,b]];
  const sorted=db.slice().sort((x,y)=>x-y),p95=sorted[Math.floor(sorted.length*.95)];
  const thr=Math.max(p95-26,-52);
  const out=[];let st=-1,gap=0;const minGap=Math.round(.5/.02);
  db.forEach((d,k)=>{if(d>thr){if(st<0)st=k;gap=0}else if(st>=0){gap++;if(gap>=minGap){out.push([st,k-gap+1]);st=-1;gap=0}}});
  if(st>=0)out.push([st,db.length-gap]);
  return out.map(([x,y])=>[Math.max(a,a+x*.02-.12),Math.min(b,a+y*.02+.15)]).filter(([x,y])=>y-x>=.3)
}
$('#btn-silence').addEventListener('click',async e=>{
  if(!S.items.some(it=>it.type==='video')){toast('Önce bir video ekle');return}
  const b=e.currentTarget;b.disabled=true;const bt=b.querySelector('b');if(bt)bt.textContent='Sesler inceleniyor…';pause();const before=snap(),bd=contentDur;
  const next=[];let noAudio=0;
  for(const it of S.items){if(it.type!=='video'){next.push(it);continue}const s=srcById(it.src);
    const pcm=await pcmOf(s);if(!pcm){noAudio++;next.push(it);continue}
    const rs=speechRanges(pcm,it.in,it.out);
    if(!rs.length){next.push(it);continue}
    rs.forEach(([x,y],k)=>{const {el,...plain}=it;next.push({...plain,id:k?nid():it.id,in:x,out:y,tr:k?{type:'none',d:.5}:it.tr})})}
  S.items=next;layout();const cut=bd-contentDur;if(cut>.3)pushUndo(before);afterChange();P.t=0;showFrame();
  b.disabled=false;if(bt)bt.textContent='Sessizlikleri kes';
  toast(cut>.3?`${r1(cut)} sn sessizlik kesildi`:noAudio?'Videoda ses bulunamadı':'Kesilecek uzun sessizlik yok',3500);
});

/* ---- konuşmayı yazıya çevirme (Whisper) ---- */
let worker=null,asrBusy=false;
function progUI(sel,p,txt){const el=$(sel);el.hidden=false;el.querySelector('i').style.width=Math.round(p*100)+'%';el.querySelector('span').textContent=txt}
function runASR(audio,onProg){
  return new Promise((res,rej)=>{
    if(asrBusy){rej(new Error('Başka bir yazıya çevirme işi sürüyor'));return}
    asrBusy=true;if(!worker)worker=new Worker('zc-asr.js',{type:'module'});
    const files={};
    worker.onmessage=ev=>{const d=ev.data;
      if(d.type==='dl'){files[d.file]=[d.loaded||0,d.total||0];const L=Object.values(files).reduce((a,x)=>a+x[0],0),T=Object.values(files).reduce((a,x)=>a+x[1],0);onProg(T?L/T*.6:.05,'Yapay zekâ modeli iniyor… '+(T?Math.round(L/T*100)+'%':''))}
      else if(d.type==='status')onProg(d.p||.65,d.msg);
      else if(d.type==='done'){asrBusy=false;res(d)}
      else if(d.type==='error'){asrBusy=false;rej(new Error(d.msg))}};
    worker.onerror=e=>{asrBusy=false;rej(new Error(e.message||'İşçi başlatılamadı'))};
    worker.postMessage({audio,model:$('#asr-model').value,lang:$('#asr-lang').value},[audio.buffer]);
  })}
function chunksToWords(chunks){
  const words=(chunks||[]).map(c=>({t:String(c.text||'').trim(),s:c.timestamp?.[0]??0,e:c.timestamp?.[1]??null})).filter(w=>w.t);
  words.forEach((w,i)=>{if(w.e==null||w.e<=w.s)w.e=(words[i+1]?.s??w.s+.4)});
  if(words.some(w=>/\s/.test(w.t))){const out=[];for(const c of words){const ws=c.t.split(/\s+/),d=(c.e-c.s)/ws.length;ws.forEach((x,k)=>out.push({t:x,s:c.s+k*d,e:c.s+(k+1)*d}))}return out}
  return words}
function capsFromWords(words){
  const caps=[];let cur=[];
  const flush=()=>{if(!cur.length)return;caps.push({id:nid(),s:cur[0].s,e:cur[cur.length-1].e,t:cur.map(w=>w.t).join(' '),w:cur.map(w=>({s:w.s,e:w.e}))});cur=[]};
  words.forEach(w=>{const prev=cur[cur.length-1];
    if(prev&&(w.s-prev.e>.45||cur.length>=3||(cur.map(x=>x.t).join(' ')+' '+w.t).length>22))flush();
    cur.push(w);if(/[.!?,;:…]$/.test(w.t))flush()});
  flush();
  caps.forEach((c,i)=>{const n=caps[i+1];if(c.e-c.s<.45)c.e=c.s+.45;if(n&&n.s-c.e<.3)c.e=n.s;if(n&&c.e>n.s)c.e=n.s;c.t=c.t.replace(/\s+([.,!?;:])/g,'$1')});
  return caps.filter(c=>c.e>c.s);
}
async function timelineAudio(){
  const parts=[];let any=false;
  for(const it of S.items){const n=Math.round(idur(it)*16000);const s=it.type==='video'?srcById(it.src):null;const pcm=s?await pcmOf(s):null;const p=new Float32Array(n);
    if(pcm){any=true;const sp=it.speed||1,a=it.in*16000;for(let k=0;k<n;k++)p[k]=pcm[Math.round(a+k*sp)]||0}
    parts.push(p)}
  if(!any)return null;const audio=new Float32Array(parts.reduce((a,p)=>a+p.length,0));let o=0;for(const p of parts){audio.set(p,o);o+=p.length}return audio}
$('#btn-asr').addEventListener('click',async e=>{
  if(!S.items.some(it=>it.type==='video')){toast('Önce bir video ekle');return}
  if(S.caps.length&&!confirm('Mevcut altyazılar silinip yeniden oluşturulsun mu?'))return;
  const b=e.currentTarget;b.disabled=true;pause();
  const pr=(p,t)=>progUI('#asr-prog',p,t);pr(0,'Ses hazırlanıyor…');
  const audio=await timelineAudio();
  if(!audio){toast('Videoda ses bulunamadı');b.disabled=false;$('#asr-prog').hidden=true;return}
  try{const d=await runASR(audio,pr);hist();
    S.caps=capsFromWords(chunksToWords(d.chunks));afterChange();pr(1,S.caps.length+' satır altyazı hazır');toast('Altyazı hazır. Hatalı kelimeleri aşağıdan düzeltebilirsin.',4000);setTimeout(()=>$('#asr-prog').hidden=true,2500)}
  catch(err){pr(0,'Hata: '+err.message);toast('Altyazı oluşturulamadı. İnternet bağlantını kontrol edip tekrar dene.',5000)}
  b.disabled=false;
});
function renderCaps(){
  $('#caps-empty').hidden=!!S.caps.length;
  $('#caps').innerHTML=S.caps.map((c,i)=>`<li class="cap" data-i="${i}"><div class="top"><input type="number" step="0.1" min="0" data-k="s" value="${r1(c.s)}" aria-label="Başlangıç"> – <input type="number" step="0.1" min="0" data-k="e" value="${r1(c.e)}" aria-label="Bitiş"><span class="acts"><button data-a="go" type="button">Git</button><button data-a="del" class="x" type="button">Sil</button></span></div><textarea rows="1" data-k="t">${esc(c.t)}</textarea></li>`).join('');lastCap=-1}
let capSnap=null;
$('#caps').addEventListener('focusin',()=>{capSnap=snap()});
$('#caps').addEventListener('input',e=>{const t=e.target;const li=t.closest('.cap');if(!li)return;const c=S.caps[+li.dataset.i];if(capSnap){pushUndo(capSnap);capSnap=null}
  if(t.dataset.k==='t'){const n=t.value.trim().split(/\s+/).length;if(c.w&&c.w.length!==n)c.w=null;c.t=t.value}
  else{const v=parseFloat(t.value);if(!isNaN(v)){c[t.dataset.k]=Math.max(0,v);c.w=null}}dirty=true;scheduleSave()});
$('#caps').addEventListener('change',e=>{if(e.target.dataset.k!=='t'){S.caps.sort((a,b)=>a.s-b.s);renderCaps()}renderTL()});
$('#caps').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const i=+b.closest('.cap').dataset.i;
  if(b.dataset.a==='del'){hist();S.caps.splice(i,1);afterChange()}else seek(S.caps[i].s+.01)});
$('#btn-cap-add').addEventListener('click',()=>{if(!S.items.length){toast('Önce bir video ekle');return}hist();const s=Math.min(P.t,Math.max(0,contentDur-1));const c={id:nid(),s,e:Math.min(s+1.6,contentDur),t:'Yeni yazı'};S.caps.push(c);S.caps.sort((a,b)=>a.s-b.s);afterChange();const ta=$$('#caps textarea')[S.caps.indexOf(c)];if(ta){ta.focus();ta.select()}});

/* ================= klip çıkar ================= */
const clipCfg={len:30,count:5};let clipRes=[],clipSrcId=null;
function renderClipSrc(){const vs=S.sources.filter(s=>s.kind==='video'&&!s.hidden);$('#clip-src').innerHTML=vs.length?vs.map(s=>`<option value="${s.id}">${esc(s.name)} · ${fmtT(s.dur)}</option>`).join(''):'<option value="">Önce Medya’dan video ekle</option>';if(clipSrcId&&vs.some(s=>s.id===clipSrcId))$('#clip-src').value=clipSrcId}
async function sampleMotion(s,step,onP){
  const v=document.createElement('video');v.muted=true;v.preload='auto';v.playsInline=true;v.src=s.url;await once(v,'loadeddata');
  const c=document.createElement('canvas');c.width=32;c.height=18;const x=c.getContext('2d',{willReadFrequently:true});let prev=null;const out=[];
  const n=Math.floor(s.dur/step);
  for(let k=0;k<=n;k++){v.currentTime=Math.min(s.dur-.05,k*step);await new Promise(r=>{let done=false;const f=()=>{if(done)return;done=true;v.removeEventListener('seeked',f);r()};v.addEventListener('seeked',f);setTimeout(f,1500)});
    x.drawImage(v,0,0,32,18);const d=x.getImageData(0,0,32,18).data;let diff=0;if(prev){for(let i=0;i<d.length;i+=4)diff+=Math.abs(d[i]-prev[i])+Math.abs(d[i+1]-prev[i+1])+Math.abs(d[i+2]-prev[i+2])}
    out.push(prev?diff/(32*18*3*255):0);prev=d.slice();if(k%5===0)onP(k/Math.max(1,n))}
  v.removeAttribute('src');v.load();return out}
async function frameThumb(s,t){const v=document.createElement('video');v.muted=true;v.preload='auto';v.src=s.url;await once(v,'loadeddata');v.currentTime=t;await once(v,'seeked');const c=document.createElement('canvas');c.width=72;c.height=128;const x=c.getContext('2d');const sc=Math.max(72/v.videoWidth,128/v.videoHeight);x.drawImage(v,(72-v.videoWidth*sc)/2,(128-v.videoHeight*sc)/2,v.videoWidth*sc,v.videoHeight*sc);v.removeAttribute('src');v.load();return c.toDataURL('image/jpeg',.7)}
const HOOKS=/(\?|nasıl|neden|niye|sır|hata|dikkat|kimse|asla|mutlaka|en iyi|ücretsiz|bedava|indirim|yeni|şok|inanılmaz|bilmiyor|fark|\d)/i;
$('#btn-clips').addEventListener('click',async e=>{
  const s=srcById(+$('#clip-src').value);if(!s){toast('Önce Medya’dan uzun bir video ekle');return}
  const L=clipCfg.len,N=clipCfg.count;if(s.dur<L*1.2){toast('Bu video bu klip süresi için kısa. Daha kısa bir klip süresi seç.',4000);return}
  clipSrcId=s.id;const b=e.currentTarget;b.disabled=true;pause();const pr=(p,t)=>progUI('#clip-prog',p,t);
  try{
    pr(.02,'Ses inceleniyor…');const pcm=await pcmOf(s);
    const step=Math.max(.5,s.dur/360);
    const mot=await sampleMotion(s,step,p=>pr(.06+p*.3,'Görüntü hareketi inceleniyor… %'+Math.round(p*100)));
    let words=s.words||null;
    if(!words&&pcm&&$('#clip-asr').checked){try{const d=await runASR(pcm.slice(),(p,t)=>pr(.36+p*.5,t));words=chunksToWords(d.chunks);s.words=words}catch(err){toast('Konuşma analizi yapılamadı; ses ve görüntüye göre seçiyorum.',4000)}}
    pr(.9,'En iyi anlar seçiliyor…');
    const db=pcm?frameDB(pcm,0,s.dur,8000):[];
    const dbAt=t=>db[Math.floor(t*2)]??-80;
    const sorted=db.slice().sort((a,b)=>a-b),p95=sorted[Math.floor(sorted.length*.95)]??-20,thr=Math.max(p95-26,-52);
    const avg=(a,b,f,st=.5)=>{let s2=0,n=0;for(let t=a;t<b;t+=st){s2+=f(t);n++}return n?s2/n:0};
    const motAt=t=>mot[Math.min(mot.length-1,Math.floor(t/step))]||0;const motMax=Math.max(.001,...mot);
    const sents=[];let starts=[];
    if(words&&words.length){let cur=null;words.forEach((w,i)=>{const pv=words[i-1];if(!cur||(pv&&(/[.!?…]$/.test(pv.t)||w.s-pv.e>.6))){if(cur)sents.push(cur);cur={s:w.s,e:w.e}}else cur.e=w.e});if(cur)sents.push(cur);starts=sents.map(x=>Math.max(0,x.s-.15))}
    else for(let t=0;t<s.dur-L*.7;t+=1)starts.push(t);
    const cands=[];
    for(const st of starts){if(st>s.dur-L*.6)continue;let en=Math.min(s.dur,st+L),endsSent=false;
      if(sents.length){const ok=sents.filter(x=>x.e>st+L*.7&&x.e<st+L*1.2);if(ok.length){const best=ok.reduce((a,b)=>Math.abs(b.e-(st+L))<Math.abs(a.e-(st+L))?b:a);en=Math.min(s.dur,best.e+.25);endsSent=true}}
      else if(pcm){let bt=en,bv=99;for(let t=Math.max(st+L*.8,en-3);t<=Math.min(s.dur,en+3);t+=.5){const v=dbAt(t);if(v<bv){bv=v;bt=t}}en=bt}
      const speech=pcm?avg(st,en,t=>dbAt(t)>thr?1:0):0,energy=pcm?clamp((avg(st,en,dbAt)-thr)/26,0,1):0,move=clamp(avg(st,en,motAt,step)/motMax*1.6,0,1);
      const firstTxt=words?words.filter(w=>w.s>=st&&w.s<st+3.5).map(w=>w.t).join(' '):'';const hook=firstTxt&&HOOKS.test(firstTxt)?1:0;
      const silentStart=pcm&&dbAt(st+.3)<thr?1:0;
      const score=speech*30+energy*20+move*20+hook*15+(endsSent?10:0)-silentStart*8;
      const tags=[];if(speech>.6)tags.push('Konuşma %'+Math.round(speech*100));if(move>.55)tags.push('Hareketli');if(hook)tags.push('Güçlü giriş');if(endsSent)tags.push('Cümle sonunda biter');
      cands.push({st,en,score,tags,text:words?words.filter(w=>w.s>=st&&w.e<=en).map(w=>w.t).join(' '):''})}
    cands.sort((a,b)=>b.score-a.score);const pick=[];
    for(const c of cands){if(pick.length>=N)break;if(pick.every(p=>c.en<=p.st-1||c.st>=p.en+1))pick.push(c)}
    const mx=Math.max(1,...pick.map(p=>p.score));
    for(const p of pick){p.pct=Math.round(55+45*p.score/mx);try{p.thumb=await frameThumb(s,Math.min(s.dur-.1,p.st+1))}catch(err){p.thumb=''}}
    clipRes=pick;renderClips();pr(1,pick.length+' klip bulundu');setTimeout(()=>$('#clip-prog').hidden=true,2500);
  }catch(err){pr(0,'Hata: '+(err.message||err))}
  b.disabled=false;
});
function renderClips(){
  $('#clips').innerHTML=clipRes.map((c,i)=>`<li class="clipc" data-i="${i}"><div class="th" style="background-image:url('${c.thumb||''}')"></div><div><div class="hd"><span>Klip ${i+1} · ${fmtT(c.st)}–${fmtT(c.en)}</span><span class="sc">${c.pct}</span></div>${c.text?`<p class="tx">“${esc(c.text.slice(0,140))}”</p>`:''}<div class="tags">${c.tags.map(t=>`<span>${esc(t)}</span>`).join('')}<span>${Math.round(c.en-c.st)} sn</span></div></div><div class="acts"><button class="btn pri sm" data-a="use" type="button">Kullan</button><button class="btn sm" data-a="dl" type="button">İndir</button></div></li>`).join('');
  $('#clips-all').hidden=clipRes.length<2}
function useClip(i,quiet){
  const c=clipRes[i],s=srcById(clipSrcId);if(!c||!s)return;hist();
  S.items=[];insertItem({type:'video',src:s.id,in:r2(c.st),out:r2(c.en)},0);
  S.caps=[];S.texts=[];
  if(s.words){const ws=s.words.filter(w=>w.s>=c.st&&w.e<=c.en+.1).map(w=>({t:w.t,s:w.s-c.st,e:w.e-c.st}));S.caps=capsFromWords(ws);
    const first=ws.slice(0,12).map(w=>w.t).join(' ').split(/(?<=[.!?…])\s/)[0].split(/\s+/).slice(0,7).join(' ').replace(/[.,;:]$/,'');
    if(first)S.texts.push({id:nid(),t0:0,dur:Math.min(3,c.en-c.st),text:first,font:'c',size:1.15,color:'#FFFFFF',bg:'outline',bgc:'#FFFFFF',anim:'pop',x:.5,y:.18,upper:true})}
  afterChange();select(null);P.t=0;showFrame();fitTL();$$('#clips .clipc').forEach((li,k)=>li.classList.toggle('on',k===i));
  if(!quiet)toast('Klip zaman çizgisine yüklendi'+(s.words?'; altyazı ve kanca yazısı hazır':''),3500)}
$('#clips').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const i=+b.closest('.clipc').dataset.i;useClip(i);if(b.dataset.a==='dl'&&canExport())await exportVideo({suffix:'-klip'+(i+1)})});
let batchStop=false;
$('#btn-clips-dl').addEventListener('click',async()=>{if(!canExport())return;batchStop=false;for(let i=0;i<clipRes.length&&!batchStop;i++){useClip(i,true);const r=await exportVideo({suffix:'-klip'+(i+1),title:`Klip ${i+1} / ${clipRes.length} hazırlanıyor`,last:i===clipRes.length-1});if(!r)break;await new Promise(r=>setTimeout(r,600))}});

/* ================= müzik parçası ================= */
let peaks=null;
function computePeaks(){const d=S.music.buf.getChannelData(0),n=400,step=Math.max(1,Math.floor(d.length/n));peaks=new Float32Array(n);for(let i=0;i<n;i++){let m=0;for(let k=i*step;k<(i+1)*step;k+=8){const v=Math.abs(d[k]||0);if(v>m)m=v}peaks[i]=m}}
function drawWave(){const c=$('#wave');if(!peaks||!S.music)return;const x=c.getContext('2d'),w=c.width,h=c.height,dur=S.music.buf.duration;x.clearRect(0,0,w,h);
  const a=S.cfg.music.start/dur*w,b=Math.min(w,(S.cfg.music.start+Math.max(total,1))/dur*w);
  x.fillStyle='rgba(220,224,229,.12)';x.fillRect(a,0,b-a,h);
  const bw=w/peaks.length;for(let i=0;i<peaks.length;i++){const px=i*bw,ph=Math.max(2,peaks[i]*h*.9);x.fillStyle=px>=a&&px<=b?'#DCE0E5':'#4a4e56';x.fillRect(px,(h-ph)/2,Math.max(1,bw-1),ph)}
  x.fillStyle='#FFD84D';x.fillRect(a,0,3,h);$('#music-start').value=r1(S.cfg.music.start)}
function setMusicStart(v){if(!S.music)return;S.cfg.music.start=clamp(v,0,Math.max(0,S.music.buf.duration-1));drawWave();if(P.playing)startMusic(P.t);scheduleSave()}
(()=>{const c=$('#wave');let down=false;const at=e=>{const r=c.getBoundingClientRect();return clamp((e.clientX-r.left)/r.width,0,1)*S.music.buf.duration};
  c.addEventListener('pointerdown',e=>{if(!S.music)return;down=true;c.setPointerCapture(e.pointerId);setMusicStart(at(e))});c.addEventListener('pointermove',e=>{if(down)setMusicStart(at(e))});c.addEventListener('pointerup',()=>down=false)})();
$('#music-start').addEventListener('change',e=>setMusicStart(parseFloat(e.target.value)||0));
function bestMusicStart(){const d=S.music.buf.getChannelData(0),sr=S.music.buf.sampleRate,F=Math.floor(sr*.25),n=Math.floor(d.length/F);const e=new Float32Array(n);
  for(let i=0;i<n;i++){let s=0;for(let k=i*F;k<(i+1)*F;k+=4)s+=d[k]*d[k];e[i]=Math.sqrt(s/(F/4))}
  const win=Math.max(4,Math.round(Math.min(Math.max(total,8),S.music.buf.duration-1)/.25));if(win>=n)return 0;let best=0,bv=-1,sum=0;for(let i=0;i<win;i++)sum+=e[i];
  for(let i=0;i+win<=n;i++){if(i>0)sum+=e[i+win-1]-e[i-1];if(sum>bv){bv=sum;best=i}}
  let st=best;for(let i=best;i>Math.max(0,best-8);i--)if(e[i]<e[st])st=i;return st*.25}
$('#btn-music-best').addEventListener('click',()=>{if(!S.music)return;setMusicStart(bestMusicStart());toast('Müziğin en hareketli kısmı seçildi')});
let listenNode=null;$('#btn-music-listen').addEventListener('click',()=>{if(!S.music)return;ensureAudio();if(listenNode){try{listenNode.stop()}catch(e){}return}
  pause();const n=AC.createBufferSource();n.buffer=S.music.buf;const g=AC.createGain();g.gain.value=Math.min(1,S.cfg.music.vol*1.6);n.connect(g);g.connect(master);n.start(0,S.cfg.music.start,8);listenNode=n;$('#btn-music-listen').textContent='Durdur';n.onended=()=>{listenNode=null;$('#btn-music-listen').textContent='Dinle'}});

/* ================= dışa aktarma ================= */
function pickMime(){const list=['video/mp4;codecs=avc1.640028,mp4a.40.2','video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];return list.find(m=>window.MediaRecorder&&MediaRecorder.isTypeSupported(m))||''}
let rec=null,cancelled=false;
function setExpProgress(p){$('#exp-bar').style.width=Math.round(clamp(p,0,1)*100)+'%';$('#exp-pct').textContent=Math.round(clamp(p,0,1)*100)+'%'}
const stamp=()=>{const d=new Date(),z=n=>String(n).padStart(2,'0');return `${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}`};
/* ---- hızlı dışa aktarma (Mediabunny + WebCodecs): video, süresinden çok daha kısa sürede hazırlanır ---- */
let MB=null,FO=null,fastCancel=false,fastRunning=false;
async function loadMB(){if(!MB)MB=await import('./vendor/mediabunny.min.mjs');return MB}
async function fullAudioOf(s){if(s.abuf!==undefined)return s.abuf;ensureAudio();if(s.blob&&s.blob.size>400*1048576){s.abuf=null;return null}try{const ab=s.blob?await s.blob.arrayBuffer():await (await fetch(s.url)).arrayBuffer();s.abuf=await AC.decodeAudioData(ab)}catch(e){s.abuf=null}return s.abuf}
async function mixAudio(){
  const SR=48000,len=Math.max(1,Math.ceil(total*SR));const oac=new OfflineAudioContext(2,len,SR);
  const mb=await loadMB();
  for(const it of S.items){if(it.type!=='video')continue;const s=srcById(it.src);const sp=it.speed||1;
    const g=oac.createGain();g.gain.value=(it.vol??1)*S.cfg.clipVol;g.connect(oac.destination);
    let ok=false;const input=mbInput(mb,s);
    try{const tr=await input.getPrimaryAudioTrack();if(tr&&await tr.canDecode()){const sink=new mb.AudioBufferSink(tr);
      for await(const wb of sink.buffers(Math.max(0,it.in-.1),it.out)){const st=Math.max(it.in,wb.timestamp),en=Math.min(it.out,wb.timestamp+wb.duration);if(en<=st)continue;
        const n=oac.createBufferSource();n.buffer=wb.buffer;n.playbackRate.value=sp;n.connect(g);n.start(it.t0+(st-it.in)/sp,st-wb.timestamp,en-st)}ok=true}else if(!tr)ok=true}
    catch(e){console.warn('ses aralığı okunamadı',e)}finally{try{input.dispose&&input.dispose()}catch(e){}}
    if(!ok){const ab=await fullAudioOf(s);if(ab){const n=oac.createBufferSource();n.buffer=ab;n.playbackRate.value=sp;n.connect(g);n.start(it.t0,it.in,Math.max(.01,it.out-it.in))}}}
  if(S.music){const n=oac.createBufferSource();n.buffer=S.music.buf;n.loop=true;const g=oac.createGain();n.connect(g);g.connect(oac.destination);
    const regs=duckRegions();g.gain.setValueAtTime(musicVol(0,regs),0);const pts=new Set([1.2,total-1.6,total]);for(const [a,b] of regs){pts.add(a-.25);pts.add(a);pts.add(b);pts.add(b+.4)}
    [...pts].filter(x=>x>0&&x<=total).sort((a,b)=>a-b).forEach(x=>g.gain.linearRampToValueAtTime(musicVol(x,regs),x));
    n.start(0,S.cfg.music.start%S.music.buf.duration);n.stop(total)}
  return oac.startRendering()}
async function exportFast(opt,onP){
  const mb=await loadMB();
  if(!('VideoEncoder' in window))throw new Error('webcodecs-yok');
  const vcodec=await mb.getFirstEncodableVideoCodec(['avc','vp9','av1'],{width:W,height:H});if(!vcodec)throw new Error('codec-yok');
  if(!(await mb.canEncodeAudio('aac',{numberOfChannels:2,sampleRate:48000}))){try{const aac=await import('./vendor/mediabunny-aac-encoder.min.mjs');aac.registerAacEncoder()}catch(e){console.warn('AAC kodlayıcı yüklenemedi',e)}}
  const acodec=await mb.getFirstEncodableAudioCodec(['aac','opus'],{numberOfChannels:2,sampleRate:48000});
  const output=new mb.Output({format:new mb.Mp4OutputFormat({fastStart:'in-memory'}),target:new mb.BufferTarget()});
  const vsrc=new mb.CanvasSource(cv,{codec:vcodec,bitrate:mb.QUALITY_HIGH,keyFrameInterval:2});output.addVideoTrack(vsrc,{frameRate:30});
  let asrc=null;if(acodec){asrc=new mb.AudioBufferSource({codec:acodec,bitrate:192000});output.addAudioTrack(asrc)}
  await output.start();
  if(asrc){onP(.02,'Ses karıştırılıyor…');const buf=await mixAudio();await asrc.add(buf);asrc.close()}
  const inputs=new Map();const frames=new Map();FO=frames;
  const sinkFor=async s=>{if(!inputs.has(s.id)){const input=new mb.Input({source:s.blob?new mb.BlobSource(s.blob):new mb.UrlSource(s.url),formats:mb.ALL_FORMATS});const tr=await input.getPrimaryVideoTrack();inputs.set(s.id,{input,sink:tr?new mb.VideoSampleSink(tr):null})}return inputs.get(s.id)};
  const N=Math.max(1,Math.ceil(total*30));let curI=-1,gen=null;const tStart=performance.now();
  const drop=id=>{const f=frames.get(id);if(f){try{f.smp.close()}catch(e){}frames.delete(id)}};
  try{
    for(let f=0;f<N;f++){
      if(fastCancel){await output.cancel();return null}
      const t=f/30;
      if(t<contentDur){const i=idxAt(t),it=S.items[i];
        if(i!==curI){if(gen){try{await gen.return()}catch(e){}}gen=null;curI=i;
          for(const [id] of frames){const k=S.items.findIndex(x=>x.id===id);if(k<i-1||k>i)drop(id)}
          if(it.type==='video'){const ts=[];for(let g=f;g<N&&g/30<it.t0+idur(it);g++)ts.push(Math.min(it.out-.001,it.in+(g/30-it.t0)*(it.speed||1)));const {sink}=await sinkFor(srcById(it.src));gen=sink?sink.samplesAtTimestamps(ts):null}}
        if(gen){const r=await gen.next();const smp=r.value;if(smp){drop(it.id);frames.set(it.id,{smp,m:smp.toCanvasImageSource(),w:smp.displayWidth,h:smp.displayHeight})}}}
      draw(t);
      await vsrc.add(t,1/30);
      if(f%6===0){const el=(performance.now()-tStart)/1000,rem=f>15?el/f*(N-f):0;onP(.05+.9*f/N,`Kareler işleniyor… ${Math.round(f/N*100)}%`+(rem>1?` · yaklaşık ${rem<60?Math.ceil(rem)+' sn':Math.ceil(rem/60)+' dk'} kaldı`:''));P.t=t;updateClock();await new Promise(r=>setTimeout(r,0))}
    }
    vsrc.close();onP(.97,'Dosya yazılıyor…');await output.finalize();
  }finally{if(gen){try{await gen.return()}catch(e){}}for(const [id] of frames)drop(id);FO=null;for(const v of inputs.values()){try{v.input.dispose&&v.input.dispose()}catch(e){}}}
  return new Blob([output.target.buffer],{type:'video/mp4'})}

function finishExport(blob,opt){const ext=blob.type.includes('mp4')?'mp4':'webm';const base=(S.cfg.name||'zodclip').trim().replace(/[^\wğüşöçıİĞÜŞÖÇ -]+/g,'').replace(/\s+/g,'-').slice(0,40)||'zodclip';
  const name=`${base}-${stamp()}${opt.suffix||''}.${ext}`;const a=$('#exp-dl');a.href=URL.createObjectURL(blob);a.download=name;a.hidden=false;a.click();
  $('#exp-t').textContent=opt.last===false?'Sıradaki klip hazırlanıyor':'Video hazır';$('#exp-msg').textContent=`${name} · ${(blob.size/1048576).toFixed(1)} MB`;$('#exp-cancel').textContent='Kapat';setExpProgress(1);return name}
async function exportVideo(opt={}){
  ensureAudio();pause();if(SEL)select(null);
  const mots=S.items.filter(it=>it.type==='motion');
  for(const it of mots){try{const r=await ZMA.useMotion();it._wm=!r.ok||!!r.wm}catch(e){it._wm=true}}
  if(mots.some(it=>it._wm))toast('Bazı motionlar filigranlı çıkacak: filigransız motion hakkın bitti.',4500);
  $('#exp-t').textContent=opt.title||'Dışa aktarılıyor';$('#exp-msg').textContent=`MP4 · ${W}×${H} · 30 fps · ${fmtT(total)} — video hazırlanıyor…`;$('#exp-dl').hidden=true;$('#exp-cancel').textContent='Vazgeç';setExpProgress(0);$('#exp').hidden=false;
  fastCancel=false;fastRunning=true;P.exporting=true;const t0=performance.now();
  try{const blob=await exportFast(opt,(p,m)=>{setExpProgress(p);$('#exp-msg').textContent=m});fastRunning=false;P.exporting=false;dirty=true;
    if(!blob){$('#exp').hidden=true;return null}
    console.log('hızlı dışa aktarma',((performance.now()-t0)/1000).toFixed(1)+' sn');return finishExport(blob,opt)}
  catch(err){fastRunning=false;P.exporting=false;FO=null;console.warn('Hızlı dışa aktarma olmadı, gerçek zamanlıya geçiliyor',err);if(fastCancel){$('#exp').hidden=true;return null}}
  return new Promise(resolve=>{
    const mime=pickMime();const vs=cv.captureStream(30);const tracks=[...vs.getVideoTracks()];if(recDest)tracks.push(...recDest.stream.getAudioTracks());
    const chunks=[];cancelled=false;
    try{rec=new MediaRecorder(new MediaStream(tracks),{mimeType:mime||undefined,videoBitsPerSecond:W*H>1.5e6?9e6:6e6,audioBitsPerSecond:192000})}catch(e){rec=new MediaRecorder(new MediaStream(tracks))}
    rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
    rec.onstop=()=>{vs.getTracks().forEach(t=>t.stop());P.exporting=false;dirty=true;if(cancelled){$('#exp').hidden=true;resolve(null);return}
      const type=rec.mimeType||mime||'video/webm';const blob=new Blob(chunks,{type});const ext=type.includes('mp4')?'mp4':'webm';
      const name=`zodclip-${stamp()}${opt.suffix||''}.${ext}`;
      const a=$('#exp-dl');a.href=URL.createObjectURL(blob);a.download=name;a.hidden=false;a.click();
      $('#exp-t').textContent=opt.last===false?'Sıradaki klip hazırlanıyor':'Video hazır';$('#exp-msg').textContent=`${name} · ${(blob.size/1048576).toFixed(1)} MB`+(ext==='webm'?' · WebM biçiminde (Instagram kabul eder).':'');
      $('#exp-cancel').textContent='Kapat';setExpProgress(1);resolve(name)};
    $('#exp-t').textContent=opt.title||'Video hazırlanıyor';$('#exp-msg').textContent='Video baştan sona bir kez oynatılarak kaydediliyor. Bu sekmeden ayrılma.';$('#exp-dl').hidden=true;$('#exp-cancel').textContent='Vazgeç';setExpProgress(0);$('#exp').hidden=false;
    P.t=0;showFrame();P.exporting=true;
    setTimeout(()=>{rec.start(250);P.onEnd=()=>{setTimeout(()=>{if(rec&&rec.state!=='inactive')rec.stop()},200)};play()},500);
  })}
function canExport(){if(!S.items.length){toast('Önce bir video ekle');return false}if(!window.MediaRecorder||!cv.captureStream){alert('Bu tarayıcı video kaydetmeyi desteklemiyor. Bilgisayarda Chrome ile dene.');return false}return true}
$('#btn-export').addEventListener('click',()=>{if(canExport())exportVideo()});
$('#exp-cancel').addEventListener('click',()=>{if(fastRunning){fastCancel=true;batchStop=true;return}if(rec&&rec.state!=='inactive'){cancelled=true;batchStop=true;P.onEnd=null;pause();rec.stop()}else $('#exp').hidden=true});
$('#btn-cover').addEventListener('click',()=>{if(!S.items.length){toast('Önce bir video ekle');return}const s=SEL;SEL=null;draw(P.t);cv.toBlob(b=>{const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='zodclip-kapak.jpg';a.click()},'image/jpeg',.92);SEL=s;dirty=true});

/* ================= geri al / yinele ================= */
const undo=[],redo=[];
function snap(){return JSON.stringify({items:S.items.map(({el,t0,_wm,...r})=>r),ovs:S.ovs.map(({_bb,...r})=>r),texts:S.texts.map(({_bb,...r})=>r),caps:S.caps,cfg:S.cfg})}
let syncAll=()=>{};
function restore(j){const o=JSON.parse(j);S.items=o.items;S.ovs=o.ovs||[];S.texts=o.texts;S.caps=o.caps;Object.assign(S.cfg,o.cfg);try{$('#pname').value=S.cfg.name||'Yeni proje'}catch(e){}
  for(const x of [...S.items,...S.ovs,...S.texts,...S.caps]){if(!x.id)x.id=nid();uid=Math.max(uid,x.id)}
  setFormat();syncAll();afterChange(true);if(SEL&&!selObj())select(null);else renderInsp();P.t=Math.min(P.t,total);showFrame()}
function pushUndo(s){undo.push(s);if(undo.length>80)undo.shift();redo.length=0;updTools()}
function hist(){pushUndo(snap())}
function doUndo(){if(!undo.length)return;pause();redo.push(snap());restore(undo.pop());updTools();scheduleSave();toast('Geri alındı',1200)}
function doRedo(){if(!redo.length)return;pause();undo.push(snap());restore(redo.pop());updTools();scheduleSave();toast('Yinelendi',1200)}
$('#btn-undo').addEventListener('click',doUndo);$('#btn-redo').addEventListener('click',doRedo);
function afterChange(noSave){layout();renderTL();renderLib();renderCaps();renderTList();if(S.music)drawWave();dirty=true;if(!noSave)scheduleSave()}

/* ================= otomatik kayıt (IndexedDB) ================= */
let db=null;
function dbOpen(){return new Promise(res=>{try{const r=indexedDB.open('zodclip',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{db=r.result;res(db)};r.onerror=()=>res(null)}catch(e){res(null)}})}
function dbPut(k,v){if(!db)return Promise.resolve();return new Promise(res=>{try{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=()=>res();tx.onerror=()=>res()}catch(e){res()}})}
function dbGet(k){if(!db)return Promise.resolve(null);return new Promise(res=>{try{const r=db.transaction('kv').objectStore('kv').get(k);r.onsuccess=()=>res(r.result||null);r.onerror=()=>res(null)}catch(e){res(null)}})}
function dbClear(){if(!db)return Promise.resolve();return new Promise(res=>{try{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').clear();tx.oncomplete=()=>res();tx.onerror=()=>res()}catch(e){res()}})}
function dbPutSource(s){return dbPut('src:'+s.id,{id:s.id,kind:s.kind,name:s.name,blob:s.blob||null,url:s.remote?s.url:null,thumb:s.thumb&&s.thumb.startsWith('data:')?s.thumb:null,hidden:!!s.hidden})}
let saveT=null,resumeOpen=false;
function scheduleSave(){if(resumeOpen)return;clearTimeout(saveT);$('#saved').textContent='Kaydediliyor…';saveT=setTimeout(async()=>{
  await dbPut('project',{snap:snap(),srcIds:S.sources.map(s=>s.id),savedAt:Date.now()});$('#saved').textContent='Kaydedildi ✓'},1000)}
async function tryResume(){
  const p=await dbGet('project');if(!p||!p.snap)return;const o=JSON.parse(p.snap);if(!o.items||!o.items.length)return;
  resumeOpen=true;
  $('#resume-t').textContent=`Son projen kayıtlı: ${o.items.length} parça · ${new Date(p.savedAt).toLocaleString('tr-TR',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}`;$('#resume').hidden=false;
  $('#resume-yes').onclick=async()=>{$('#resume').hidden=true;toast('Proje açılıyor…');
    for(const id of p.srcIds){const r=await dbGet('src:'+id);if(!r||(!r.blob&&!r.url))continue;try{await makeSource({...r,restoring:true})}catch(e){}}
    const lg=await dbGet('logo');if(lg&&lg.blob)await setLogo(lg.blob,true);
    const mu=await dbGet('music');if(mu&&mu.blob)await setMusic(new File([mu.blob],mu.name||'muzik',{type:mu.blob.type}),o.cfg.music.start||0);
    const ids=new Set(S.sources.map(s=>s.id));o.items=o.items.filter(it=>!it.src||ids.has(it.src));o.ovs=(o.ovs||[]).filter(O=>ids.has(O.src));
    resumeOpen=false;restore(JSON.stringify(o));undo.length=0;redo.length=0;updTools();fitTL();toast('Proje açıldı')};
  $('#resume-no').onclick=async()=>{$('#resume').hidden=true;await dbClear();resumeOpen=false;for(const s of S.sources)dbPutSource(s);scheduleSave()};
}
$('#btn-new').addEventListener('click',async()=>{if(S.items.length&&!confirm('Yeni proje açılsın mı? Mevcut proje silinir.'))return;await dbClear();location.reload()});

/* ================= ayarlar ================= */
function chipBind(sel,get,set){const sync=()=>$$(sel+' button').forEach(b=>b.classList.toggle('on',b.dataset.v===String(get())));$(sel).addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;set(b.dataset.v);sync();dirty=true});sync();return sync}
function bindInput(sel,get,set){const el=$(sel);const isChk=el.type==='checkbox';const put=()=>{const v=get();if(isChk)el.checked=v;else el.value=v};put();el.addEventListener('input',()=>{set(isChk?el.checked:(el.type==='range'||el.type==='number'?parseFloat(el.value):el.value));dirty=true;scheduleSave()});return put}
function start(){
  setFormat();layout();renderTL();renderLib();renderCaps();renderTList();renderTPresets();renderInsp();requestAnimationFrame(tick);
  if(document.fonts)Promise.all(['700 40px "Archivo Narrow"','800 40px Inter','500 40px Inter','italic 700 40px "Playfair Display"','700 40px Unbounded','900 40px "Big Shoulders Display"','500 40px "JetBrains Mono"','700 40px Manrope','700 40px Anybody','700 40px "Hanken Grotesk"'].map(f=>document.fonts.load(f).catch(()=>{}))).then(()=>{dirty=true;renderTPresets()});
  $$('#tabs button').forEach(b=>b.addEventListener('click',()=>openTab(b.dataset.tab)));
  const sy=[];
  sy.push(chipBind('#cap-styles',()=>S.cfg.cap.style,v=>{hist();S.cfg.cap.style=v;scheduleSave()}));
  sy.push(chipBind('#fmts',()=>S.cfg.fmt,v=>{hist();S.cfg.fmt=v;setFormat();scheduleSave()}));
  sy.push(chipBind('#fits',()=>S.cfg.fit,v=>{hist();S.cfg.fit=v;scheduleSave()}));
  sy.push(chipBind('#filters',()=>S.cfg.filter,v=>{hist();S.cfg.filter=v;scheduleSave()}));
  sy.push(chipBind('#presets',()=>S.cfg.preset,v=>{hist();const p=PRESETS[v];S.cfg.preset=v;S.cfg.filter=p.filter;S.cfg.cap.style=p.cap;S.cfg.cap.size=p.size||1;syncAll();scheduleSave()}));
  sy.push(chipBind('#clip-lens',()=>clipCfg.len,v=>clipCfg.len=+v));
  sy.push(chipBind('#clip-counts',()=>clipCfg.count,v=>clipCfg.count=+v));
  sy.push(bindInput('#cap-size',()=>S.cfg.cap.size,v=>S.cfg.cap.size=v));
  sy.push(bindInput('#cap-pos',()=>S.cfg.cap.pos,v=>S.cfg.cap.pos=v));
  sy.push(bindInput('#cap-upper',()=>S.cfg.cap.upper,v=>S.cfg.cap.upper=v));
  sy.push(bindInput('#end-on',()=>S.cfg.end.on,v=>{S.cfg.end.on=v;layout();renderTL();P.t=Math.min(P.t,total)}));
  sy.push(bindInput('#end-text',()=>S.cfg.end.text,v=>S.cfg.end.text=v));
  sy.push(bindInput('#end-sub',()=>S.cfg.end.sub,v=>S.cfg.end.sub=v));
  sy.push(bindInput('#end-dur',()=>S.cfg.end.dur,v=>{S.cfg.end.dur=clamp(v||2.5,1,6);layout();renderTL()}));
  sy.push(bindInput('#wm-on',()=>S.cfg.wm.on,v=>{S.cfg.wm.on=v;if(v&&!S.logo)toast('Önce logo yükle')}));
  sy.push(bindInput('#clip-vol',()=>S.cfg.clipVol,v=>{S.cfg.clipVol=v;if(clipGain)clipGain.gain.value=v}));
  sy.push(bindInput('#music-vol',()=>S.cfg.music.vol,v=>{S.cfg.music.vol=v;if(P.playing)startMusic(P.t)}));
  sy.push(bindInput('#music-duck',()=>S.cfg.music.duck,v=>S.cfg.music.duck=v));
  sy.push(bindInput('#music-fade',()=>S.cfg.music.fade,v=>S.cfg.music.fade=v));
  syncAll=()=>sy.forEach(f=>f());
  $('#f-media').addEventListener('change',e=>{addFiles([...e.target.files]);e.target.value=''});
  $('#f-music').addEventListener('change',e=>{if(e.target.files[0])setMusic(e.target.files[0]);e.target.value=''});
  $('#f-logo').addEventListener('change',e=>{if(e.target.files[0])setLogo(e.target.files[0]);e.target.value=''});
  $('#btn-logo-x').addEventListener('click',()=>{S.logo=null;$('#logo-prev').hidden=true;$('#btn-logo-x').hidden=true;dirty=true;dbPut('logo',null);mThumbsDirty()});
  $('#btn-music-x').addEventListener('click',()=>{stopMusic();S.music=null;$('#music-name').textContent='Seçilmedi';$('#btn-music-x').hidden=true;$('#music-part').hidden=true;dbPut('music',null);renderTL();scheduleSave()});
  $('#btn-play').addEventListener('click',()=>P.playing?pause():play());
  $('#btn-back').addEventListener('click',()=>seek(0));
  $('#btn-endk').addEventListener('click',()=>seek(total));
  $('#btn-help').addEventListener('click',()=>$('#help').hidden=false);$('#help-x').addEventListener('click',()=>$('#help').hidden=true);$('#help').addEventListener('click',e=>{if(e.target.id==='help')$('#help').hidden=true});
  $('#btn-fprev').addEventListener('click',()=>seek(P.t-1/30));
  $('#btn-fnext').addEventListener('click',()=>seek(P.t+1/30));
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>openTab(b.dataset.go)));
  const pn=$('#pname');pn.value=S.cfg.name||'Yeni proje';pn.addEventListener('input',()=>{S.cfg.name=pn.value;scheduleSave()});pn.addEventListener('keydown',e=>{if(e.key==='Enter')pn.blur()});
  try{const th=localStorage.getItem('zc_tlh');if(th&&innerWidth>760)$('#app').style.setProperty('--tlh',th)}catch(e){}
  $('#btn-full').addEventListener('click',()=>{$('.stage').classList.toggle('full');setTimeout(fitCanvas,30)});
  document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
    const k=e.key.toLowerCase();
    if(e.code==='Space'){e.preventDefault();P.playing?pause():play()}
    else if((e.ctrlKey||e.metaKey)&&k==='z'){e.preventDefault();e.shiftKey?doRedo():doUndo()}
    else if((e.ctrlKey||e.metaKey)&&k==='y'){e.preventDefault();doRedo()}
    else if(e.key==='Delete'||e.key==='Backspace'){if(SEL){e.preventDefault();doDel()}}
    else if(k==='s'&&!e.ctrlKey&&!e.metaKey)doSplit();
    else if((e.ctrlKey||e.metaKey)&&k==='d'){e.preventDefault();doDup()}
    else if(k==='v'&&!e.ctrlKey&&!e.metaKey)setTool('sel');else if(k==='c'&&!e.ctrlKey&&!e.metaKey)setTool('razor');
    else if(k==='n'&&!e.ctrlKey&&!e.metaKey)$('#tl-snap').click();
    else if(e.key==='?'){$('#help').hidden=!$('#help').hidden}
    else if(e.key==='Home')seek(0);else if(e.key==='End')seek(total);
    else if(k==='='||k==='+')setPps(pps*1.4);else if(k==='-')setPps(pps/1.4);
    else if(e.key==='ArrowLeft')seek(P.t-(e.shiftKey?1:1/30));else if(e.key==='ArrowRight')seek(P.t+(e.shiftKey?1:1/30));
    else if(e.key==='Escape'&&!$('#help').hidden){$('#help').hidden=true}
    else if(e.key==='Escape'){if($('.stage').classList.contains('full')){$('.stage').classList.remove('full');setTimeout(fitCanvas,30)}else select(null)}});
  ['dragenter','dragover'].forEach(ev=>document.addEventListener(ev,e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')){e.preventDefault();document.body.classList.add('dragging')}}));
  ['dragleave','drop'].forEach(ev=>document.addEventListener(ev,e=>{if(ev==='dragleave'&&e.relatedTarget)return;document.body.classList.remove('dragging')}));
  document.addEventListener('drop',e=>{if(e.dataTransfer&&e.dataTransfer.files.length){e.preventDefault();addFiles([...e.dataTransfer.files])}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&P.exporting)toast('Video kaydı sürerken sekmede kal, yoksa video takılabilir.',5000)});
  fitTL();updTools();
  dbOpen().then(tryResume);
  // uygulama (ZodMotions masaüstü) içinden gelen komutlar
  const TABS=['medya','motion','yazi','altyazi','ses','klip','gorunum'];
  const route=h=>{h=String(h||'').replace('#','');if(TABS.includes(h))openTab(h)};route(location.hash);
  window.addEventListener('hashchange',()=>route(location.hash));
  window.addEventListener('message',e=>{if(e.origin!==location.origin||!e.data||!e.data.zc)return;const d=e.data;if(d.zc==='tab')route(d.name);else if(d.zc==='mot'){openTab('motion');addMotClip(d.k)}else if(d.zc==='fmt'&&FORMATS[d.v]){if(S.cfg.fmt!==d.v){hist();S.cfg.fmt=d.v;setFormat();syncAll();scheduleSave()}}});
  try{if(window.self!==window.top&&window.top.location.pathname.startsWith('/app'))document.documentElement.classList.add('in-app')}catch(e){}
}
window.ZC={S,P,draw,addFiles,play,pause,seek,speechRanges,capsFromWords,select,doSplit,doUndo,doRedo,useClip,layout,afterChange,get total(){return total},get contentDur(){return contentDur},get clipRes(){return clipRes},get sel(){return SEL}};
gate();
})();
