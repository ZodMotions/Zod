/* ZodMotions şablon motoru — tüm sayfalar ortak kullanır */
(()=>{
const W=1080,H=1920;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const eo=x=>1-Math.pow(1-x,3);
const eio=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const eback=x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
const DISP='"Unbounded","Arial Black",sans-serif',BODY='"Manrope","Segoe UI",sans-serif',MONO='"JetBrains Mono",monospace',COND='"Big Shoulders Display","Impact",sans-serif';
const font=(w,s,f=DISP)=>`${w} ${s}px ${f}`;
function rgb(h){h=String(h).replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16)||0;return[n>>16&255,n>>8&255,n&255]}
function mix(a,b,k){const A=rgb(a),B=rgb(b);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')})`}
function lum(h){const[r,g,b]=rgb(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
const onColor=h=>lum(h)>.45?'#111418':'#FFFFFF';
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function wrap(c,text,maxW,maxL=3){const words=String(text||'').split(/\s+/).filter(Boolean);const lines=[];let cur='';for(const w of words){const t=cur?cur+' '+w:w;if(c.measureText(t).width>maxW&&cur){lines.push(cur);cur=w}else cur=t}if(cur)lines.push(cur);return lines.slice(0,maxL)}
function cover(c,img,zoom=1,alpha=1){const iw=img.videoWidth||img.naturalWidth||img.width,ih=img.videoHeight||img.naturalHeight||img.height;if(!iw||!ih)return;const r=Math.max(W/iw,H/ih)*zoom;const w=iw*r,h=ih*r;c.globalAlpha=alpha;c.drawImage(img,(W-w)/2,(H-h)/2,w,h);c.globalAlpha=1}
function setLS(c,px){if('letterSpacing' in c)c.letterSpacing=px+'px'}
function fitLogo(c,img,cx,cy,box,alpha=1,scale=1){const r=Math.min(box/img.width,box/img.height)*scale;const w=img.width*r,h=img.height*r;c.globalAlpha=clamp(alpha);c.drawImage(img,cx-w/2,cy-h/2,w,h);c.globalAlpha=1}
function scene(c,p,a,t,grey){
  const sky=c.createLinearGradient(0,0,0,H);
  if(grey){sky.addColorStop(0,'#8a8f96');sky.addColorStop(1,'#3d4146')}else{sky.addColorStop(0,mix(p,'#ffffff',.35));sky.addColorStop(.55,mix(p,a,.35));sky.addColorStop(1,mix(p,'#000000',.55))}
  c.fillStyle=sky;c.fillRect(0,0,W,H);
  const sx=W*.72,sy=H*.46;const g=c.createRadialGradient(sx,sy,10,sx,sy,520);g.addColorStop(0,grey?'rgba(255,255,255,.35)':mix(a,'#ffffff',.4));g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  const d=Math.sin(t*.4)*14;const dark=grey?'#2b2e32':mix(p,'#000000',.72),mid=grey?'#3a3e43':mix(p,'#000000',.6);
  c.fillStyle=mid;c.fillRect(-20+d,1080,640,420);c.fillRect(520+d,980,520,520);c.fillStyle=dark;c.fillRect(-20+d,1040,700,46);c.fillRect(480+d,940,600,46);
  c.fillStyle=grey?'rgba(220,220,220,.5)':mix(a,'#ffffff',.25);c.fillRect(90+d,1150,220,250);c.fillRect(620+d,1060,320,300);
  c.fillStyle=dark;c.fillRect(0,1500,W,H-1500);c.fillStyle=grey?'rgba(160,170,180,.25)':'rgba(120,200,255,.22)';c.fillRect(0,1500,W,70);
}
function bg(c,f,A,t,dur,grey){if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.02+.06*t/dur)}else scene(c,f.p,f.a,t,grey)}
function titleReveal(c,text,x,y,size,maxW,t0,t,color,align='left',maxL=3){
  c.font=font(700,size);c.fillStyle=color;c.textAlign=align;c.textBaseline='alphabetic';
  const lines=wrap(c,text,maxW,maxL);const lh=size*1.14;
  lines.forEach((ln,i)=>{const p=eo(prog(t,t0+i*.14,t0+.7+i*.14));const yy=y+i*lh;c.save();c.beginPath();c.rect(0,yy-size*1.05,W,size*1.35);c.clip();c.fillText(ln,x,yy+(1-p)*size*1.2);c.restore()});
  c.textAlign='left';return y+lines.length*lh;
}
function star(c,cx,cy,r){c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5;const rr2=i%2?r*.45:r;c.lineTo(cx+Math.cos(a)*rr2,cy+Math.sin(a)*rr2)}c.closePath()}

const TEMPLATES=[
{id:'villa',name:'Satılık Villa',cat:'Emlak',dur:8,isNew:false,
 def:{title:'Deniz Manzaralı Villa',sub:'Bodrum · Yalıkavak',d1:'4+1',d2:'320 m²',d3:'Özel havuz',cta:'₺ 38.500.000',p:'#1F3A5F',a:'#F2A33A'},
 labels:{title:'Başlık',sub:'Konum',d1:'Oda sayısı',d2:'Alan',d3:'Öne çıkan özellik',cta:'Fiyat'},
 tracks:[['Arka plan',0,8,1],['Logo',.2,.8],['Konum',.4,1],['Başlık',.6,1.6],['Detaylar',2,2.8],['Fiyat',3,3.6]],
 draw(c,t,f,A){
  bg(c,f,A,t,8);const g=c.createLinearGradient(0,760,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.82)');c.fillStyle=g;c.fillRect(0,0,W,H);
  if(A.logo)fitLogo(c,A.logo,190,170,200,prog(t,.2,.8));
  let e=eo(prog(t,.4,1));c.globalAlpha=e;c.font=font(700,38,BODY);setLS(c,6);c.fillStyle=f.a;c.fillText(String(f.sub).toUpperCase(),80-(1-e)*60,1140);setLS(c,0);c.globalAlpha=1;
  let y=titleReveal(c,f.title,80,1260,96,920,.6,t,'#fff');c.fillStyle=f.a;c.fillRect(80,y-40,230*eo(prog(t,1.3,1.9)),10);
  c.font=font(600,40,BODY);let x=80,cy=y+20;
  [f.d1,f.d2,f.d3].filter(Boolean).forEach((s,i)=>{const w=c.measureText(s).width+56;if(x+w>W-80){x=80;cy+=96}const p=clamp(eback(prog(t,2+i*.15,2.5+i*.15)),0,1.2);
    if(p>0){c.save();c.translate(x+w/2,cy+38);c.scale(p,p);rr(c,-w/2,-38,w,76,38);c.fillStyle='rgba(255,255,255,.14)';c.fill();c.strokeStyle='rgba(255,255,255,.4)';c.lineWidth=2;c.stroke();c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(s,0,2);c.restore()}x+=w+20});
  c.textAlign='left';c.textBaseline='alphabetic';
  e=eo(prog(t,3,3.6));c.font=font(700,62);const pw=c.measureText(f.cta).width+80;c.globalAlpha=e;rr(c,80,H-300+(1-e)*80,pw,124,20);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textBaseline='middle';c.fillText(f.cta,120,H-238+(1-e)*80);c.textBaseline='alphabetic';c.globalAlpha=1;
 }},
{id:'proje',name:'Proje Lansmanı',cat:'İnşaat',dur:8,
 def:{title:'Mavi Vadi Konutları',sub:'PROJE · 2027 TESLİM',d1:'240 daire',d2:'%60 yeşil alan',d3:'',cta:'Ön satış başladı',p:'#163A63',a:'#F2A33A'},
 labels:{title:'Proje adı',sub:'Üst etiket',d1:'Bilgi 1',d2:'Bilgi 2',cta:'Çağrı metni'},
 tracks:[['Plan ızgarası',0,1.4,1],['Binalar',.8,2.4],['Etiket',1.8,2.3],['Proje adı',2.1,3.1],['Bilgiler',3,3.8],['Çağrı',3.8,8]],
 draw(c,t,f,A){
  c.fillStyle=mix(f.p,'#000000',.35);c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.22);
  const g=eio(prog(t,0,1.4));c.strokeStyle='rgba(255,255,255,.13)';c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=90){c.moveTo(x,0);c.lineTo(x,H*g)}for(let y=0;y<=H;y+=90){c.moveTo(0,y);c.lineTo(W*g,y)}c.stroke();
  const base=1480;[[110,190,440],[320,230,800],[570,200,580],[790,180,360]].forEach(([x,w,h],i)=>{const p=eo(prog(t,.8+i*.18,1.9+i*.18));const hh=h*p;if(hh<=1)return;
    c.fillStyle='rgba(255,255,255,.07)';c.fillRect(x,base-hh,w,hh);c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=4;c.strokeRect(x,base-hh,w,hh);
    if(p>.98){c.fillStyle=mix(f.a,'#ffffff',.2);for(let yy=base-h+40;yy<base-40;yy+=70)for(let xx=x+30;xx<x+w-30;xx+=56){if(((xx+yy)/7|0)%3)c.fillRect(xx,yy,22,30)}}});
  c.fillStyle=f.a;c.fillRect(60,base,(W-120)*eo(prog(t,.6,1.6)),8);
  c.font=font(500,34,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,1.8,2.3));c.fillText(f.sub,80,230);c.globalAlpha=1;
  titleReveal(c,f.title,80,340,90,920,2.1,t,'#fff');
  c.font=font(600,44,BODY);[f.d1,f.d2].filter(Boolean).forEach((s,i)=>{const e=eo(prog(t,3+i*.2,3.6+i*.2));c.globalAlpha=e;c.fillStyle='#fff';c.fillRect(80,1588+i*84,24,4);c.fillText(s,124+(1-e)*40,1604+i*84)});c.globalAlpha=1;
  const e=eo(prog(t,3.8,4.4));const pulse=t>4.4?1+.025*Math.sin(t*5):1;c.font=font(700,48);const pw=c.measureText(f.cta).width+90;
  c.save();c.globalAlpha=e;c.translate(W/2,H-170);c.scale(pulse,pulse);rr(c,-pw/2,-56,pw,112,56);c.strokeStyle=f.a;c.lineWidth=5;c.stroke();c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(f.cta,0,3);c.restore();
 }},
{id:'plan',name:'Kat Planı',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Daire Tip B',sub:'MAVİ VADİ · 3. ETAP',d1:'Salon · 32 m²',d2:'Yatak odası · 16 m²',d3:'Mutfak · 12 m²',cta:'3+1 · 145 m² · Güney cephe',p:'#0E2A47',a:'#7DD3FC'},
 labels:{title:'Plan adı',sub:'Üst etiket',d1:'Oda 1',d2:'Oda 2',d3:'Oda 3',cta:'Alt bilgi'},
 tracks:[['Arka plan',0,8,1],['Etiket',.1,.6],['Başlık',.3,1.2],['Duvarlar',.6,3],['Oda adları',2.8,3.8],['Ölçü',3.4,4],['Alt bilgi',4,4.6]],
 draw(c,t,f,A){
  c.fillStyle=mix(f.p,'#000000',.25);c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.12);
  c.strokeStyle='rgba(255,255,255,.06)';c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=60){c.moveTo(x,0);c.lineTo(x,H)}for(let y=0;y<=H;y+=60){c.moveTo(0,y);c.lineTo(W,y)}c.stroke();
  c.font=font(500,32,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub,80,200);c.globalAlpha=1;
  titleReveal(c,f.title,80,310,96,920,.3,t,'#fff');
  const ox=140,oy=540;const segs=[[0,0,800,0],[800,0,800,900],[800,900,0,900],[0,900,0,0],[460,0,460,520],[0,520,300,520],[380,520,800,520],[520,520,520,900],[520,700,800,700]];
  segs.forEach(([x1,y1,x2,y2],i)=>{const s=.6+i*(2.1/segs.length);const p=eio(prog(t,s,s+.45));if(p<=0)return;c.strokeStyle=i<4?'#fff':'rgba(255,255,255,.85)';c.lineWidth=i<4?12:7;c.lineCap='square';
    c.beginPath();c.moveTo(ox+x1,oy+y1);c.lineTo(ox+x1+(x2-x1)*p,oy+y1+(y2-y1)*p);c.stroke()});
  const p2=prog(t,2.6,3.2);if(p2>0){c.save();c.globalAlpha=p2;c.strokeStyle=f.a;c.lineWidth=4;c.beginPath();c.arc(ox+300,oy+520,80,-Math.PI/2,0);c.stroke();c.restore()}
  c.font=font(600,34,BODY);c.textAlign='center';
  [[f.d1,230,270],[f.d3,630,270],[f.d2,260,720],['Banyo',660,620]].forEach(([s,x,y],i)=>{if(!s)return;const e=eo(prog(t,2.8+i*.15,3.3+i*.15));c.globalAlpha=e;c.fillStyle='#fff';
    const parts=String(s).split('·');c.fillText(parts[0].trim(),ox+x,oy+y+(1-e)*20);if(parts[1]){c.font=font(500,28,MONO);c.fillStyle=f.a;c.fillText(parts[1].trim(),ox+x,oy+y+44+(1-e)*20);c.font=font(600,34,BODY)}});
  c.globalAlpha=1;
  const e3=eo(prog(t,3.4,4));c.globalAlpha=e3;c.strokeStyle=f.a;c.lineWidth=3;const dy=oy+960;c.beginPath();c.moveTo(ox,dy);c.lineTo(ox+800*e3,dy);c.moveTo(ox,dy-16);c.lineTo(ox,dy+16);c.moveTo(ox+800,dy-16);c.lineTo(ox+800,dy+16);c.stroke();
  c.font=font(500,30,MONO);c.fillStyle=f.a;c.fillText('12,40 m',ox+400,dy+50);c.globalAlpha=1;
  const e4=eo(prog(t,4,4.6));c.globalAlpha=e4;c.font=font(700,40,BODY);c.fillStyle='#fff';c.fillText(f.cta,W/2,H-150+(1-e4)*30);c.globalAlpha=1;c.textAlign='left';
  if(A.logo)fitLogo(c,A.logo,W-170,190,150,prog(t,.3,.9));
 }},
{id:'oncesonra',name:'Önce / Sonra',cat:'Mimari',dur:8,
 def:{title:'Salon renovasyonu',sub:'Lumen Mimarlık · 6 haftada',d1:'ÖNCE',d2:'SONRA',d3:'',cta:'',p:'#2E4A3F',a:'#E8B04B'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Sol etiket',d2:'Sağ etiket'},
 tracks:[['Önce görüntü',0,1.2,1],['Kaydırma',1.2,4.2],['Sonra görüntü',1.2,8,1],['Başlık',4.4,5.3],['Alt başlık',5,5.6]],
 draw(c,t,f,A){
  const before=()=>{if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);if('filter' in c){c.filter='grayscale(1) contrast(.85) brightness(.85)';cover(c,A.photo,1.03);c.filter='none'}else{cover(c,A.photo,1.03);c.globalCompositeOperation='saturation';c.fillStyle='#888';c.fillRect(0,0,W,H);c.globalCompositeOperation='source-over'}}else scene(c,f.p,f.a,0,true)};
  const after=()=>{if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.03)}else scene(c,f.p,f.a,0,false)};
  const x=W-W*eio(prog(t,1.2,4.2));before();c.save();c.beginPath();c.rect(x,0,W-x,H);c.clip();after();c.restore();
  if(x>4&&x<W-4){c.fillStyle='#fff';c.fillRect(x-3,0,6,H);c.beginPath();c.arc(x,H*.42,48,0,Math.PI*2);c.fill();c.fillStyle='#111';c.font=font(700,40,BODY);c.textAlign='center';c.textBaseline='middle';c.fillText('‹ ›',x,H*.42+2);c.textAlign='left';c.textBaseline='alphabetic'}
  c.font=font(700,34,BODY);setLS(c,4);const lab=(s,show,right)=>{if(!show||!s)return;const w=c.measureText(s).width+48;const xx=right?W-80-w:80;rr(c,xx,140,w,72,36);c.fillStyle='rgba(0,0,0,.55)';c.fill();c.fillStyle='#fff';c.textBaseline='middle';c.fillText(s,xx+24,178);c.textBaseline='alphabetic'};
  lab(f.d1,x>420&&t<4.3,false);lab(f.d2,x<W-420,true);setLS(c,0);
  const g=c.createLinearGradient(0,1300,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.8)');c.globalAlpha=prog(t,4.2,4.8);c.fillStyle=g;c.fillRect(0,1300,W,H-1300);c.globalAlpha=1;
  const y=titleReveal(c,f.title,80,1620,84,920,4.4,t,'#fff');c.font=font(600,40,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,5,5.6));c.fillText(f.sub,80,y+10);c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W-170,H-150,150,prog(t,5.2,5.8));
 }},
{id:'acikev',name:'Açık Ev Günü',cat:'Emlak',dur:8,isNew:true,
 def:{title:'Açık Ev Günü',sub:'Kalamış Park Rezidans, Kadıköy',d1:'26',d2:'EKİM · PAZAR',d3:'14:00 – 17:00',cta:'Yerinizi ayırtın',p:'#3B2F2A',a:'#E8A85B'},
 labels:{title:'Başlık',sub:'Adres',d1:'Gün',d2:'Ay / gün adı',d3:'Saat',cta:'Çağrı metni'},
 tracks:[['Arka plan',0,8,1],['Takvim kartı',.4,1.2],['Tarih',1,1.8],['Başlık',1.8,2.8],['Adres',2.6,3.2],['Çağrı',3.4,8]],
 draw(c,t,f,A){
  bg(c,f,A,t,8);c.fillStyle='rgba(0,0,0,.45)';c.fillRect(0,0,W,H);
  const s=clamp(eback(prog(t,.4,1.1)),0,1.2);const cx=W/2,cy=860,cw=640,ch=700;
  if(s>0){c.save();c.translate(cx,cy);c.rotate((1-clamp(s))*-.12);c.scale(s,s);
    c.fillStyle='rgba(0,0,0,.35)';rr(c,-cw/2+18,-ch/2+26,cw,ch,44);c.fill();
    rr(c,-cw/2,-ch/2,cw,ch,44);c.fillStyle='#FBF8F2';c.fill();
    c.save();rr(c,-cw/2,-ch/2,cw,ch,44);c.clip();c.fillStyle=f.a;c.fillRect(-cw/2,-ch/2,cw,150);c.restore();
    c.fillStyle='#FBF8F2';[-160,160].forEach(x=>{c.beginPath();c.arc(x,-ch/2,22,0,Math.PI*2);c.fill()});
    c.textAlign='center';c.textBaseline='middle';c.font=font(500,40,MONO);c.fillStyle=onColor(f.a);c.fillText(f.d2,0,-ch/2+80);
    const e=eo(prog(t,1,1.6));c.globalAlpha=e;c.font=font(900,360,COND);c.fillStyle='#16110E';c.fillText(f.d1,0,40+(1-e)*40);
    c.font=font(700,46,BODY);c.fillStyle=mix(f.a,'#000000',.35);c.fillText(f.d3,0,ch/2-80);c.restore()}
  c.textAlign='center';titleReveal(c,f.title,W/2,1430,88,940,1.8,t,'#fff','center',2);c.textAlign='center';
  c.font=font(600,42,BODY);c.fillStyle='rgba(255,255,255,.85)';c.globalAlpha=eo(prog(t,2.6,3.2));const al=wrap(c,f.sub,900,2);al.forEach((l,i)=>c.fillText(l,W/2,1540+i*54));c.globalAlpha=1;
  const e=eo(prog(t,3.4,4));const pulse=t>4?1+.025*Math.sin(t*5):1;c.font=font(700,46,BODY);const bw=c.measureText(f.cta).width+110;
  c.save();c.globalAlpha=e;c.translate(W/2,H-200+(1-e)*50);c.scale(pulse,pulse);rr(c,-bw/2,-60,bw,120,60);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textBaseline='middle';c.fillText(f.cta,0,3);c.restore();
  if(A.logo)fitLogo(c,A.logo,W/2,200,170,prog(t,.2,.8));c.textAlign='left';c.textBaseline='alphabetic';
 }},
{id:'kampanya',name:'Kampanya',cat:'Kampanya',dur:8,
 def:{title:'Lansmana özel',sub:'Peşinat indirimi',d1:'%20',d2:"31 Ekim'e kadar",d3:'',cta:'Hemen ara: 0 212 000 00 00',p:'#C2410C',a:'#111827'},
 labels:{title:'Üst başlık',sub:'Alt metin',d1:'Büyük rakam',d2:'Tarih',cta:'Buton metni'},
 tracks:[['Çizgili zemin',0,8,1],['Başlık',.2,1.1],['Büyük rakam',.4,1.2],['Alt metin',1.3,1.9],['Tarih',1.8,2.4],['Buton',2.4,8]],
 draw(c,t,f,A){
  c.fillStyle=f.p;c.fillRect(0,0,W,H);c.save();c.translate(W/2,H/2);c.rotate(-Math.PI/6);c.fillStyle=mix(f.p,'#ffffff',.09);const off=(t*90)%240;for(let x=-2000+off;x<2000;x+=240)c.fillRect(x,-1600,110,3200);c.restore();
  if(A.photo)cover(c,A.photo,1.05,.18);
  c.save();c.translate(W/2,880);c.rotate(t*.5);c.setLineDash([26,22]);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=6;c.beginPath();c.arc(0,0,400*eo(prog(t,.1,1)),0,Math.PI*2);c.stroke();c.restore();c.setLineDash([]);
  c.textAlign='center';titleReveal(c,f.title,W/2,400,76,900,.2,t,'#fff','center');c.textAlign='center';
  const s=clamp(eback(prog(t,.4,1.2)),0,1.3);c.save();c.translate(W/2,1040);c.scale(s,s);c.font=font(900,String(f.d1).length>4?340:460,COND);c.fillStyle=f.a;c.fillText(f.d1,16,16);c.fillStyle='#fff';c.fillText(f.d1,0,0);c.restore();
  c.font=font(700,54,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,1.3,1.9));c.fillText(f.sub,W/2,1200);c.globalAlpha=1;
  if(f.d2){const e=eo(prog(t,1.8,2.4));c.font=font(600,40,BODY);const w=c.measureText(f.d2).width+60;c.globalAlpha=e;rr(c,W/2-w/2,1270,w,76,38);c.fillStyle='rgba(0,0,0,.25)';c.fill();c.fillStyle='#fff';c.textBaseline='middle';c.fillText(f.d2,W/2,1310);c.textBaseline='alphabetic';c.globalAlpha=1}
  const e=eo(prog(t,2.4,3));const pulse=t>3?1+.03*Math.sin(t*6):1;c.font=font(700,42,BODY);const bw=Math.min(940,c.measureText(f.cta).width+100);
  c.save();c.globalAlpha=e;c.translate(W/2,H-300+(1-e)*60);c.scale(pulse,pulse);rr(c,-bw/2,-62,bw,124,62);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textBaseline='middle';c.fillText(f.cta,0,3);c.restore();
  if(A.logo)fitLogo(c,A.logo,W/2,170,160,prog(t,.2,.8));c.textAlign='left';c.textBaseline='alphabetic';
 }},
{id:'rakam',name:'Rakamlarla Biz',cat:'Kurumsal',dur:8,
 def:{title:'Rakamlarla Lumen Yapı',sub:"1998'DEN BERİ",d1:'1200+ teslim edilen konut',d2:'48 tamamlanan proje',d3:'26 yıllık tecrübe',cta:'lumenyapi.com',p:'#0F2A44',a:'#38BDF8'},
 labels:{title:'Başlık',sub:'Üst etiket',d1:'Rakam 1 (sayı + açıklama)',d2:'Rakam 2',d3:'Rakam 3',cta:'Web adresi'},
 tracks:[['Arka plan',0,8,1],['Başlık',.3,1.2],['Rakam 1',1,2.6],['Rakam 2',1.3,2.9],['Rakam 3',1.6,3.2],['Web adresi',3.6,4.2]],
 draw(c,t,f,A){
  c.fillStyle=mix(f.p,'#000000',.4);c.fillRect(0,0,W,H);const g=c.createRadialGradient(W*.85,H*.15,40,W*.85,H*.15,900);g.addColorStop(0,mix(f.a,f.p,.55));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  if(A.photo)cover(c,A.photo,1.04,.16);
  c.font=font(500,32,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub,80,250);c.globalAlpha=1;titleReveal(c,f.title,80,350,80,920,.3,t,'#fff');
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const m=String(s).match(/^([^\d]*)([\d.,]+)(\+?)\s*(.*)$/);const y0=780+i*340;const p=eo(prog(t,1+i*.3,2.6+i*.3));c.fillStyle=f.a;c.fillRect(80,y0-150,10,220*p);
    if(m){const n=parseInt(m[2].replace(/[.,]/g,''),10)||0;const v=Math.round(n*p).toLocaleString('tr-TR');c.font=font(900,190,COND);c.fillStyle='#fff';c.globalAlpha=clamp(p*3);c.fillText(m[1]+v+m[3],130,y0);c.font=font(600,42,BODY);c.fillStyle='rgba(255,255,255,.72)';c.fillText(m[4],134,y0+64);c.globalAlpha=1}
    else{c.font=font(700,80);c.fillStyle='#fff';c.globalAlpha=p;c.fillText(s,130,y0);c.globalAlpha=1}});
  c.font=font(500,36,MONO);c.fillStyle='rgba(255,255,255,.8)';c.globalAlpha=eo(prog(t,3.6,4.2));c.fillText(f.cta,80,H-150);c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-180,H-165,150,prog(t,3.6,4.2));
 }},
{id:'yorum',name:'Müşteri Yorumu',cat:'Kurumsal',dur:8,isNew:true,
 def:{title:'Teslim tarihinden iki ay önce anahtarımızı aldık. Her aşamada bizi bilgilendirdiler.',sub:'Ayşe K.',d1:'Mavi Vadi sakini',d2:'',d3:'',cta:'',p:'#1B2B26',a:'#F5C451'},
 labels:{title:'Yorum (örnek metin)',sub:'İsim',d1:'Unvan / proje'},max:{title:140},
 tracks:[['Arka plan',0,8,1],['Tırnak',.2,.9],['Yorum',.6,3.6],['Yıldızlar',3.6,4.4],['İsim',4.2,4.8]],
 draw(c,t,f,A){
  c.fillStyle=mix(f.p,'#000000',.2);c.fillRect(0,0,W,H);const g=c.createRadialGradient(W*.2,H*.2,40,W*.2,H*.2,1000);g.addColorStop(0,mix(f.p,f.a,.25));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  if(A.photo)cover(c,A.photo,1.04,.14);
  const q=clamp(eback(prog(t,.2,.9)),0,1.2);c.save();c.translate(170,520);c.scale(q,q);c.font=font(700,520);c.fillStyle=f.a;c.fillText('“',-120,220);c.restore();
  c.font=font(700,70,BODY);const lines=wrap(c,f.title,900,6);let wi=0;const total=String(f.title).split(/\s+/).filter(Boolean).length||1;
  lines.forEach((ln,li)=>{let x=90;ln.split(' ').forEach(w=>{const p=eo(prog(t,.6+(wi/total)*2.6,.6+(wi/total)*2.6+.35));c.globalAlpha=p;c.fillStyle='#fff';c.fillText(w,x,800+li*92+(1-p)*24);x+=c.measureText(w+' ').width;wi++})});c.globalAlpha=1;
  const sy=800+lines.length*92+70;for(let i=0;i<5;i++){const p=eback(prog(t,3.6+i*.12,4+i*.12));if(p<=0)continue;c.save();c.translate(122+i*84,sy);c.scale(clamp(p,0,1.2),clamp(p,0,1.2));star(c,0,0,34);c.fillStyle=f.a;c.fill();c.restore()}
  const e=eo(prog(t,4.2,4.8));c.globalAlpha=e;const ny=H-300;c.beginPath();c.arc(150,ny,62,0,Math.PI*2);c.fillStyle=f.a;c.fill();
  if(A.logo){c.save();c.beginPath();c.arc(150,ny,62,0,Math.PI*2);c.clip();fitLogo(c,A.logo,150,ny,124,e);c.restore()}else{c.fillStyle=onColor(f.a);c.font=font(700,56);c.textAlign='center';c.textBaseline='middle';c.fillText(String(f.sub||'A').trim().charAt(0),150,ny+4);c.textAlign='left';c.textBaseline='alphabetic'}
  c.globalAlpha=e;c.font=font(700,48,BODY);c.fillStyle='#fff';c.fillText(f.sub,250,ny-6);c.font=font(500,32,MONO);c.fillStyle='rgba(255,255,255,.65)';c.fillText(f.d1,250,ny+44);c.globalAlpha=1;
 }},
{id:'logo',name:'Logo Açılışı',cat:'Açılış',dur:6,
 def:{title:'LUMEN MİMARLIK',sub:'Mekânı birlikte tasarlayalım',d1:'',d2:'',d3:'',cta:'lumenmimarlik.com',p:'#1E1B4B',a:'#F59E0B'},
 labels:{title:'Marka adı',sub:'Slogan',cta:'Web adresi'},
 tracks:[['Halkalar',.1,1.6],['Logo',.5,1.3],['Marka adı',1.3,2.2],['Slogan',1.9,2.5],['Web adresi',2.4,3]],
 draw(c,t,f,A){
  const g=c.createRadialGradient(W/2,H*.42,40,W/2,H*.42,1100);g.addColorStop(0,mix(f.p,'#ffffff',.18));g.addColorStop(1,mix(f.p,'#000000',.6));c.fillStyle=g;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.14);
  const cx=W/2,cy=H*.4;[[300,1.1,f.a,8],[360,-.7,'rgba(255,255,255,.55)',4],[430,.45,'rgba(255,255,255,.25)',3]].forEach(([r,sp,col,lw],i)=>{const p=eio(prog(t,.1+i*.12,1.3+i*.12));c.strokeStyle=col;c.lineWidth=lw;c.beginPath();const st=t*sp;c.arc(cx,cy,r,st,st+Math.PI*1.6*p);c.stroke()});
  const s=clamp(eback(prog(t,.5,1.3)),0,1.3);
  if(A.logo)fitLogo(c,A.logo,cx,cy,360,clamp(s),s);else if(s>0){c.save();c.translate(cx,cy);c.scale(s,s);c.beginPath();c.arc(0,0,190,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.font=font(700,220);c.textAlign='center';c.textBaseline='middle';c.fillText((f.title||'Z').trim().charAt(0),0,12);c.restore();c.textAlign='left';c.textBaseline='alphabetic'}
  c.textAlign='center';c.font=font(700,66);setLS(c,6+20*(1-eo(prog(t,1.3,2.2))));c.fillStyle='#fff';c.globalAlpha=eo(prog(t,1.3,2));c.fillText(f.title,cx,H*.4+560);setLS(c,0);
  c.font=font(600,42,BODY);c.fillStyle='rgba(255,255,255,.75)';c.globalAlpha=eo(prog(t,1.9,2.5));c.fillText(f.sub,cx,H*.4+640);c.font=font(500,34,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,2.4,3));c.fillText(f.cta,cx,H-140);c.globalAlpha=1;c.textAlign='left';
 }}
];

const sr=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const SERIF='"Playfair Display",Georgia,serif';
const darkBg=(c,f,A,t,dur,k=.45)=>{c.fillStyle=mix(f.p,'#000000',k);c.fillRect(0,0,W,H);const g=c.createRadialGradient(W*.5,H*.3,40,W*.5,H*.3,1200);g.addColorStop(0,mix(f.p,f.a,.22));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.03+.04*t/dur,.18)};
const pill=(c,txt,x,y,fill,col,size=40,align='center',padX=46,h=104)=>{c.font=font(700,size,BODY);const w=c.measureText(txt).width+padX*2;const x0=align==='center'?x-w/2:x;rr(c,x0,y-h/2,w,h,h/2);c.fillStyle=fill;c.fill();c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.fillText(txt,x0+w/2,y+2);c.textAlign='left';c.textBaseline='alphabetic';return w};
const numOf=s=>{const m=String(s).match(/[\d.,]+/);return m?parseInt(m[0].replace(/[.,]/g,''),10)||0:0};
const fmtLike=(s,v)=>String(s).replace(/[\d.,]+/,v.toLocaleString('tr-TR'));
const MORE=[
{id:'satildi',name:'Satıldı Damgası',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Kalamış Rezidans 3+1',sub:'Kadıköy · İstanbul',d1:'SATILDI',d2:'',d3:'',cta:'Sıradaki ilan için takipte kalın',p:'#1F2A37',a:'#E23D3D'},
 labels:{title:'İlan başlığı',sub:'Konum',d1:'Damga yazısı',cta:'Alt mesaj'},
 tracks:[['Arka plan',0,7,1],['Başlık',.3,1.2],['Konum',.8,1.4],['Damga',2,2.6],['Alt mesaj',3.1,3.7]],
 draw(c,t,f,A){const sh=t>2.25&&t<2.7?(1-prog(t,2.25,2.7))*22:0;c.save();c.translate(Math.sin(t*90)*sh,Math.cos(t*70)*sh);
  bg(c,f,A,t,7);c.fillStyle='rgba(0,0,0,.42)';c.fillRect(-40,-40,W+80,H+80);
  const y=titleReveal(c,f.title,80,300,84,920,.3,t,'#fff');c.font=font(600,42,BODY);c.fillStyle='rgba(255,255,255,.8)';c.globalAlpha=eo(prog(t,.8,1.4));c.fillText(f.sub,80,y+10);c.globalAlpha=1;
  const s=t<2?0:t<2.25?2.6-1.6*eio(prog(t,2,2.25)):1;if(s>0){c.save();c.translate(W/2,H*.52);c.rotate(-.21);c.scale(s,s);c.globalAlpha=clamp(prog(t,2,2.12))*.94;
   c.font=font(900,230,COND);const tw=c.measureText(f.d1).width+120;c.strokeStyle=f.a;c.lineWidth=16;rr(c,-tw/2,-150,tw,300,26);c.stroke();c.lineWidth=5;rr(c,-tw/2+26,-124,tw-52,248,16);c.stroke();
   c.fillStyle=f.a;c.textAlign='center';c.textBaseline='middle';c.fillText(f.d1,0,12);c.restore()}
  const e=eo(prog(t,3.1,3.7));c.globalAlpha=e;pill(c,f.cta,W/2,H-240+(1-e)*40,'rgba(255,255,255,.14)','#fff',38);c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W-170,H-120,140,prog(t,3.2,3.8));c.restore()}},
{id:'kiralik',name:'Kiralık Daire',cat:'Emlak',dur:8,isNew:true,
 def:{title:'Moda\'da deniz manzaralı daire',sub:'Moda · Kadıköy',d1:'₺ 45.000',d2:'2+1 · 110 m²',d3:'Eşyalı',cta:'Hemen randevu al',p:'#24324A',a:'#F2A33A'},
 labels:{title:'Başlık',sub:'Konum',d1:'Kira bedeli',d2:'Oda / alan',d3:'Özellik',cta:'Çağrı metni'},
 tracks:[['Fotoğraf',0,8,1],['Kart',.3,1],['Başlık',.8,1.7],['Kira',1.5,2.2],['Özellikler',2.2,2.9],['Çağrı',3.2,8]],
 draw(c,t,f,A){c.save();c.beginPath();c.rect(0,0,W,1240);c.clip();bg(c,f,A,t,8);c.restore();
  const e=eo(prog(t,.3,1));const top=1040+(1-e)*900;c.fillStyle='#FBF8F2';rr(c,0,top,W,H-top+60,60);c.fill();
  pill(c,'KİRALIK',150,top+96,f.a,onColor(f.a),32,'center',34,68);
  c.save();c.beginPath();c.rect(0,top+140,W,H);c.clip();titleReveal(c,f.title,80,top+250,62,920,.8,t,'#16110E',undefined,2);c.restore();
  c.font=font(600,38,BODY);c.fillStyle='#6B635A';c.globalAlpha=eo(prog(t,1.2,1.7));c.fillText(f.sub,80,top+420);c.globalAlpha=1;
  const p2=eo(prog(t,1.5,2.2));c.globalAlpha=p2;c.font=font(700,100);c.fillStyle='#16110E';c.fillText(f.d1,80,top+560+(1-p2)*30);const pw=c.measureText(f.d1).width;c.font=font(600,40,BODY);c.fillStyle='#6B635A';c.fillText('/ ay',100+pw,top+560+(1-p2)*30);c.globalAlpha=1;
  let x=80;[f.d2,f.d3].filter(Boolean).forEach((s,i)=>{const q=eo(prog(t,2.2+i*.15,2.7+i*.15));c.globalAlpha=q;c.font=font(600,36,BODY);const w=c.measureText(s).width+56;rr(c,x,top+620,w,72,36);c.strokeStyle='rgba(22,17,14,.25)';c.lineWidth=2;c.stroke();c.fillStyle='#16110E';c.textBaseline='middle';c.fillText(s,x+28,top+658);c.textBaseline='alphabetic';x+=w+16});c.globalAlpha=1;
  const q=eo(prog(t,3.2,3.8));c.globalAlpha=q;c.fillStyle=f.p;rr(c,80,H-210,W-160,120,60);c.fill();c.font=font(700,42,BODY);c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(f.cta+'  →',W/2,H-148);c.textAlign='left';c.textBaseline='alphabetic';c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W-160,140,140,prog(t,.2,.8))}},
{id:'fiyatdus',name:'Fiyat Düştü',cat:'Kampanya',dur:7,isNew:true,
 def:{title:'Fiyat güncellendi',sub:'Sınırlı sayıda daire',d1:'₺ 12.900.000',d2:'₺ 11.450.000',d3:'-%11',cta:'Detaylar için DM',p:'#151B2B',a:'#FF5C5C'},
 labels:{title:'Başlık',sub:'Alt metin',d1:'Eski fiyat',d2:'Yeni fiyat',d3:'İndirim rozeti',cta:'Çağrı metni'},
 tracks:[['Arka plan',0,7,1],['Başlık',.2,1],['Eski fiyat',.6,1.1],['Çizgi',1,1.5],['Yeni fiyat',1.8,2.4],['Rozet',2.4,3],['Çağrı',3.2,7]],
 draw(c,t,f,A){darkBg(c,f,A,t,7,.2);c.textAlign='center';titleReveal(c,f.title,W/2,420,84,940,.2,t,'#fff','center');c.textAlign='center';
  c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.7)';c.globalAlpha=eo(prog(t,.6,1.1));c.fillText(f.sub,W/2,520);
  c.font=font(700,96);c.fillStyle='rgba(255,255,255,.55)';c.fillText(f.d1,W/2,800);c.globalAlpha=1;const ow=c.measureText(f.d1).width;
  const sp=eio(prog(t,1,1.5));if(sp>0){c.strokeStyle=f.a;c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(W/2-ow/2-20,790);c.lineTo(W/2-ow/2-20+(ow+40)*sp,760);c.stroke();c.lineCap='butt'}
  const b=prog(t,1.8,2.4);if(b>0){const y=1030-(1-eback(b))*260;c.globalAlpha=clamp(b*3);c.font=font(700,126);c.fillStyle='#fff';c.fillText(f.d2,W/2,y);const nw=c.measureText(f.d2).width;c.fillStyle=f.a;c.fillRect(W/2-nw/2,y+36,nw*eo(prog(t,2.2,2.8)),10);c.globalAlpha=1}
  const r=clamp(eback(prog(t,2.4,3)),0,1.2);if(r>0&&f.d3){c.save();c.translate(W/2+330,640);c.rotate((1-r)*-1.4+.18);c.scale(r,r);c.beginPath();c.arc(0,0,120,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(900,84,COND);c.fillStyle=onColor(f.a);c.textBaseline='middle';c.fillText(f.d3,0,6);c.restore()}
  c.textBaseline='alphabetic';const e=eo(prog(t,3.2,3.8));c.globalAlpha=e;pill(c,f.cta,W/2,H-300+(1-e)*40,'#fff','#151B2B',42);c.globalAlpha=1;c.textAlign='left';
  if(A.logo)fitLogo(c,A.logo,W/2,190,150,prog(t,.2,.8))}},
{id:'harita',name:'Konum Haritası',cat:'Emlak',dur:8,isNew:true,
 def:{title:'Her yere yakın',sub:'Ataşehir · İstanbul',d1:'Metro · 5 dk',d2:'Okul · 3 dk',d3:'AVM · 8 dk',cta:'',p:'#14213D',a:'#FCA311'},
 labels:{title:'Başlık',sub:'Konum',d1:'Yakın yer 1',d2:'Yakın yer 2',d3:'Yakın yer 3'},
 tracks:[['Arka plan',0,8,1],['Başlık',.2,1.1],['Sokaklar',.3,1.8],['Pin',1.3,2],['Liste',2.4,3.4]],
 draw(c,t,f,A){darkBg(c,f,A,t,8,.35);titleReveal(c,f.title,80,250,88,920,.2,t,'#fff');c.font=font(500,32,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.5,1));c.fillText(f.sub.toUpperCase(),84,320);c.globalAlpha=1;
  const mx=60,my=400,mw=W-120,mh=860;c.save();rr(c,mx,my,mw,mh,40);c.clip();c.fillStyle=mix(f.p,'#ffffff',.06);c.fillRect(mx,my,mw,mh);
  const g=eio(prog(t,.3,1.8));c.strokeStyle='rgba(255,255,255,.22)';c.lineCap='round';
  for(let i=0;i<14;i++){const ang=sr(i)*.5-.25+(i%2?Math.PI/2:0);const cx=mx+sr(i+3)*mw,cy=my+sr(i+7)*mh;const L=1400*g;c.lineWidth=i%4===0?14:6;c.beginPath();c.moveTo(cx-Math.cos(ang)*L/2,cy-Math.sin(ang)*L/2);c.lineTo(cx+Math.cos(ang)*L/2,cy+Math.sin(ang)*L/2);c.stroke()}
  c.strokeStyle='rgba(90,170,255,.55)';c.lineWidth=40;c.beginPath();c.moveTo(mx,my+mh*.8);c.bezierCurveTo(mx+mw*.3,my+mh*.6,mx+mw*.6,my+mh*(1-.2*g),mx+mw,my+mh*.7);c.globalAlpha=g;c.stroke();c.globalAlpha=1;c.lineCap='butt';
  const px=W/2,py=my+mh*.45;for(let k=0;k<3;k++){const rp=((t-2+k*.6)%1.8)/1.8;if(t>2&&rp>0){c.strokeStyle=f.a;c.globalAlpha=(1-rp)*.7;c.lineWidth=5;c.beginPath();c.ellipse(px,py,40+rp*220,(40+rp*220)*.45,0,0,Math.PI*2);c.stroke();c.globalAlpha=1}}
  c.restore();const pb=prog(t,1.3,2);if(pb>0){const yy=py-(1-eback(pb))*500;c.save();c.translate(px,yy);c.fillStyle=f.a;c.beginPath();c.arc(0,-110,64,Math.PI*.82,Math.PI*2.18);c.lineTo(0,0);c.closePath();c.fill();c.fillStyle=mix(f.p,'#000000',.3);c.beginPath();c.arc(0,-110,26,0,Math.PI*2);c.fill();c.restore()}
  [f.d1,f.d2,f.d3].filter(Boolean).forEach((s,i)=>{const e=eo(prog(t,2.4+i*.2,3+i*.2));c.globalAlpha=e;const y=1360+i*120;rr(c,80+(1-e)*-60,y-48,W-160,96,24);c.fillStyle='rgba(255,255,255,.07)';c.fill();c.beginPath();c.arc(140+(1-e)*-60,y,14,0,Math.PI*2);c.fillStyle=f.a;c.fill();
   const pr=String(s).split('·');c.font=font(600,42,BODY);c.fillStyle='#fff';c.fillText(pr[0].trim(),180+(1-e)*-60,y+14);if(pr[1]){c.font=font(500,36,MONO);c.fillStyle=f.a;c.textAlign='right';c.fillText(pr[1].trim(),W-120,y+12);c.textAlign='left'}});c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W-160,H-110,130,prog(t,3,3.6))}},
{id:'ilerleme',name:'İnşaat İlerlemesi',cat:'İnşaat',dur:8,isNew:true,
 def:{title:'Mavi Vadi · 3. Etap',sub:'İNŞAAT DURUMU',d1:'%72',d2:'Teslim: Haziran 2027',d3:'',cta:'',p:'#1B2A3A',a:'#F5B841'},
 labels:{title:'Proje adı',sub:'Üst etiket',d1:'Tamamlanma yüzdesi',d2:'Teslim bilgisi'},
 tracks:[['Arka plan',0,8,1],['Başlık',.2,1.1],['Yüzde',.8,2.8],['Çubuk',.8,2.8],['Aşamalar',1.4,3],['Teslim',3,3.6]],
 draw(c,t,f,A){bg(c,f,A,t,8);c.fillStyle='rgba(8,12,18,.62)';c.fillRect(0,0,W,H);c.font=font(500,32,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub,80,250);c.globalAlpha=1;titleReveal(c,f.title,80,350,84,920,.2,t,'#fff');
  const target=Math.min(100,numOf(f.d1));const p=eio(prog(t,.8,2.8));c.font=font(900,330,COND);c.fillStyle='#fff';c.fillText('%'+Math.round(target*p),70,900);
  const bx=80,bw=W-160,by=1020;rr(c,bx,by,bw,36,18);c.fillStyle='rgba(255,255,255,.12)';c.fill();if(p>0){rr(c,bx,by,Math.max(36,bw*target/100*p),36,18);c.fillStyle=f.a;c.fill()}
  ['Temel','Kaba inşaat','İnce işler','Teslim'].forEach((s,i)=>{const x=bx+bw*(i/3);const done=(i/3)*100<=target*p;const e=eo(prog(t,1.4+i*.2,2+i*.2));c.globalAlpha=e;c.beginPath();c.arc(x,by+18,22,0,Math.PI*2);c.fillStyle=done?f.a:'#2A3442';c.fill();c.strokeStyle='#fff';c.lineWidth=4;c.stroke();
   c.font=font(600,32,BODY);c.fillStyle=done?'#fff':'rgba(255,255,255,.55)';c.textAlign=i===0?'left':i===3?'right':'center';c.fillText(s,x,by+110);c.textAlign='left'});c.globalAlpha=1;
  const e=eo(prog(t,3,3.6));c.globalAlpha=e;pill(c,f.d2,80,H-260,'rgba(255,255,255,.12)','#fff',40,'left');c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-160,H-260,130,e)}},
{id:'vinc',name:'Şantiye Günlüğü',cat:'İnşaat',dur:8,isNew:true,
 def:{title:'Şantiye günlüğü',sub:'Bugün 7. kat betonu döküldü',d1:'128',d2:'',d3:'',cta:'',p:'#233044',a:'#F7B538'},
 labels:{title:'Başlık',sub:'Günün notu',d1:'Gün sayısı'},
 tracks:[['Gökyüzü',0,8,1],['Vinç',0,1.6],['Bina',.6,2.4],['Gün sayacı',1,2.6],['Not',2.6,3.4]],
 draw(c,t,f,A){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(f.p,'#000000',.3));g.addColorStop(.7,mix(f.p,f.a,.45));g.addColorStop(1,mix(f.a,'#ffffff',.2));c.fillStyle=g;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);
  const ink=mix(f.p,'#000000',.6);const k=eo(prog(t,0,1.6));c.strokeStyle=ink;c.fillStyle=ink;c.lineWidth=14;const mxp=300,top=470,base=1640;c.beginPath();c.moveTo(mxp,base);c.lineTo(mxp,base-(base-top)*k);c.stroke();
  for(let y=base;y>base-(base-top)*k;y-=60){c.lineWidth=4;c.beginPath();c.moveTo(mxp-24,y);c.lineTo(mxp+24,y-60);c.stroke()}
  if(k>.95){c.save();c.translate(mxp,top);c.rotate(Math.sin(t*.8)*.03);c.lineWidth=12;c.beginPath();c.moveTo(-160,0);c.lineTo(700,0);c.stroke();c.fillRect(-180,-10,120,60);const hx=420+Math.sin(t*.9)*120;c.lineWidth=3;c.beginPath();c.moveTo(hx,0);c.lineTo(hx,360+Math.sin(t*1.3)*30);c.stroke();c.fillRect(hx-40,360+Math.sin(t*1.3)*30,80,50);c.restore()}
  [[560,240,620],[820,200,440]].forEach(([x,w,h],i)=>{const p=eo(prog(t,.6+i*.3,2.2+i*.3));c.fillStyle=ink;c.fillRect(x,base-h*p,w,h*p);c.fillStyle=mix(f.a,'#ffffff',.3);for(let yy=base-h*p+30;yy<base-20;yy+=64)for(let xx=x+26;xx<x+w-30;xx+=58)if(sr(xx+yy)>.4)c.fillRect(xx,yy,24,30)});
  c.fillStyle=ink;c.fillRect(0,base,W,H-base);
  c.font=font(500,34,MONO);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,.8,1.3));c.fillText('GÜN',80,230);c.globalAlpha=1;const n=numOf(f.d1);c.font=font(900,250,COND);c.fillStyle='#fff';c.fillText(Math.round(n*eio(prog(t,1,2.6))),76,440);
  titleReveal(c,f.title,80,1760,70,920,2.2,t,'#fff');c.font=font(600,38,BODY);c.fillStyle='rgba(255,255,255,.8)';c.globalAlpha=eo(prog(t,2.6,3.2));c.fillText(f.sub,80,1840);c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W-150,180,140,prog(t,1,1.6))}},
{id:'malzeme',name:'Malzeme Paleti',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Malzeme paletimiz',sub:'Salon · Proje B',d1:'Calacatta mermer',d2:'Meşe parke',d3:'Brüt beton',cta:'',p:'#2B2622',a:'#B08D57'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Malzeme 1',d2:'Malzeme 2',d3:'Malzeme 3'},
 tracks:[['Kâğıt zemin',0,8,1],['Başlık',.2,1.1],['Mermer',1,1.8],['Ahşap',1.3,2.1],['Beton',1.6,2.4],['Etiketler',2.2,3]],
 draw(c,t,f,A){c.fillStyle='#EFE9DD';c.fillRect(0,0,W,H);c.strokeStyle='rgba(21,18,12,.06)';c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=60){c.moveTo(x,0);c.lineTo(x,H)}for(let y=0;y<=H;y+=60){c.moveTo(0,y);c.lineTo(W,y)}c.stroke();
  c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub.toUpperCase(),80,250);c.globalAlpha=1;titleReveal(c,f.title,80,350,84,920,.2,t,f.p);
  const cw=290,ch=560,y0=600;[f.d1,f.d2,f.d3].forEach((lab,i)=>{const x=70+i*(cw+20);const e=eo(prog(t,1+i*.3,1.8+i*.3));if(e<=0)return;c.save();c.translate(0,(1-e)*260);c.globalAlpha=e;
   c.fillStyle='rgba(0,0,0,.12)';rr(c,x+10,y0+16,cw,ch,24);c.fill();c.save();rr(c,x,y0,cw,ch,24);c.clip();
   if(i===0){c.fillStyle='#F2F0EC';c.fillRect(x,y0,cw,ch);c.strokeStyle='rgba(120,115,110,.45)';for(let k=0;k<9;k++){c.lineWidth=1+sr(k)*3;c.beginPath();c.moveTo(x-20,y0+sr(k+1)*ch);c.bezierCurveTo(x+cw*.3,y0+sr(k+2)*ch,x+cw*.7,y0+sr(k+3)*ch,x+cw+20,y0+sr(k+4)*ch);c.stroke()}}
   else if(i===1){for(let k=0;k<12;k++){c.fillStyle=k%2?'#B9864F':'#A87442';c.fillRect(x+k*(cw/12),y0,cw/12+1,ch)}c.strokeStyle='rgba(70,40,20,.25)';c.lineWidth=2;for(let k=0;k<30;k++){const xx=x+sr(k)*cw;c.beginPath();c.moveTo(xx,y0);c.bezierCurveTo(xx+10,y0+ch*.3,xx-10,y0+ch*.6,xx+6,y0+ch);c.stroke()}}
   else{c.fillStyle='#9C9A95';c.fillRect(x,y0,cw,ch);for(let k=0;k<420;k++){c.fillStyle=k%2?'rgba(60,60,60,.25)':'rgba(255,255,255,.18)';c.fillRect(x+sr(k)*cw,y0+sr(k+999)*ch,3+sr(k+5)*4,3+sr(k+7)*4)}c.fillStyle='rgba(60,60,60,.35)';[[.25,.2],[.75,.2],[.25,.8],[.75,.8]].forEach(([a,b])=>{c.beginPath();c.arc(x+cw*a,y0+ch*b,10,0,Math.PI*2);c.fill()})}
   c.restore();const q=eo(prog(t,2.2+i*.15,2.8+i*.15));c.globalAlpha=e*q;c.font=font(500,26,MONO);c.fillStyle=f.a;c.fillText('0'+(i+1),x,y0+ch+56);c.font=font(700,34,BODY);c.fillStyle=f.p;const ln=wrap(c,lab,cw,2);ln.forEach((l,j)=>c.fillText(l,x,y0+ch+104+j*42));c.restore()});c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W/2,H-140,140,prog(t,3,3.6))}},
{id:'ekip',name:'Ekibimiz',cat:'Kurumsal',dur:8,isNew:true,
 def:{title:'Ekibimizle tanışın',sub:'LUMEN MİMARLIK',d1:'Ayşe Demir · Kurucu mimar',d2:'Can Yılmaz · Proje müdürü',d3:'Elif Kaya · İç mimar',cta:'',p:'#1A1F2E',a:'#E9B44C'},
 labels:{title:'Başlık',sub:'Üst etiket',d1:'Kişi 1 (isim · görev)',d2:'Kişi 2',d3:'Kişi 3'},
 tracks:[['Arka plan',0,8,1],['Başlık',.2,1.1],['Kişi 1',1,1.7],['Kişi 2',1.3,2],['Kişi 3',1.6,2.3]],
 draw(c,t,f,A){darkBg(c,f,A,t,8);c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub,80,280);c.globalAlpha=1;titleReveal(c,f.title,80,380,84,920,.2,t,'#fff');
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const e=eo(prog(t,1+i*.3,1.7+i*.3));const y=760+i*330;const dx=(1-e)*500;c.globalAlpha=e;const pr=String(s).split('·');const nm=pr[0].trim(),rl=(pr[1]||'').trim();
   rr(c,60+dx,y-130,W-120,260,40);c.fillStyle='rgba(255,255,255,.06)';c.fill();c.strokeStyle='rgba(255,255,255,.1)';c.lineWidth=2;c.stroke();
   const g=c.createLinearGradient(110+dx,y-90,290+dx,y+90);g.addColorStop(0,f.a);g.addColorStop(1,mix(f.a,f.p,.5));c.beginPath();c.arc(200+dx,y,92,0,Math.PI*2);c.fillStyle=g;c.fill();
   c.font=font(700,70);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(nm.split(' ').map(w=>w[0]).join('').slice(0,2),200+dx,y+4);c.textAlign='left';c.textBaseline='alphabetic';
   c.font=font(700,50,BODY);c.fillStyle='#fff';c.fillText(nm,330+dx,y-4);c.font=font(500,30,MONO);c.fillStyle=f.a;c.fillText(rl.toUpperCase(),332+dx,y+50)});c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W/2,H-140,140,prog(t,2.6,3.2))}},
{id:'surec',name:'4 Adımda Süreç',cat:'Kurumsal',dur:8,isNew:true,
 def:{title:'4 adımda anahtar teslim',sub:'NASIL ÇALIŞIYORUZ',d1:'Keşif ve ölçüm',d2:'Proje ve 3B tasarım',d3:'Uygulama',cta:'Anahtar teslim',p:'#162238',a:'#4FD1C5'},
 labels:{title:'Başlık',sub:'Üst etiket',d1:'Adım 1',d2:'Adım 2',d3:'Adım 3',cta:'Adım 4'},
 tracks:[['Arka plan',0,8,1],['Başlık',.2,1.1],['Çizgi',.9,3.4],['Adım 1',1,1.6],['Adım 2',1.6,2.2],['Adım 3',2.2,2.8],['Adım 4',2.8,3.4]],
 draw(c,t,f,A){darkBg(c,f,A,t,8);c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub,80,280);c.globalAlpha=1;titleReveal(c,f.title,80,380,82,920,.2,t,'#fff',undefined,2);
  const x=160,y0=700,y1=1660;const L=eio(prog(t,.9,3.4));c.fillStyle='rgba(255,255,255,.15)';c.fillRect(x-3,y0,6,y1-y0);c.fillStyle=f.a;c.fillRect(x-3,y0,6,(y1-y0)*L);
  [f.d1,f.d2,f.d3,f.cta].forEach((s,i)=>{const y=y0+i*((y1-y0)/3);const e=clamp(eback(prog(t,1+i*.6,1.5+i*.6)),0,1.2);if(e<=0)return;c.save();c.translate(x,y);c.scale(e,e);c.beginPath();c.arc(0,0,50,0,Math.PI*2);c.fillStyle=i===3?f.a:mix(f.p,'#000000',.3);c.fill();c.strokeStyle=f.a;c.lineWidth=5;c.stroke();
   c.font=font(500,34,MONO);c.fillStyle=i===3?onColor(f.a):f.a;c.textAlign='center';c.textBaseline='middle';c.fillText('0'+(i+1),0,2);c.restore();c.textBaseline='alphabetic';
   const q=eo(prog(t,1.1+i*.6,1.7+i*.6));c.globalAlpha=q;c.font=font(700,54,BODY);c.fillStyle='#fff';c.fillText(s,250+(1-q)*40,y+18);c.globalAlpha=1});
  if(A.logo)fitLogo(c,A.logo,W-150,H-120,130,prog(t,3.4,4))}},
{id:'soru',name:'Sık Sorulan Soru',cat:'Kurumsal',dur:8,isNew:true,
 def:{title:'Teslim tarihi ne zaman?',sub:"Haziran 2027'de anahtarlarınızı teslim ediyoruz.",d1:'SİZ SORDUNUZ',d2:'',d3:'',cta:'Sorunu yorumlara yaz',p:'#1E2433',a:'#F2A33A'},
 labels:{title:'Soru',sub:'Cevap',d1:'Üst etiket',cta:'Alt çağrı'},max:{sub:90},
 tracks:[['Arka plan',0,8,1],['Etiket',.1,.6],['Soru yazılıyor',.4,2],['Yazıyor…',2,2.6],['Cevap',2.6,3.4],['Çağrı',3.8,4.4]],
 draw(c,t,f,A){darkBg(c,f,A,t,8);c.font=font(500,32,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.d1,80,300);c.globalAlpha=1;
  const q=String(f.title);const n=Math.floor(q.length*prog(t,.4,2));c.font=font(700,62,BODY);const ql=wrap(c,q.slice(0,Math.max(1,n)),780,3);const qh=ql.length*78+80;const qa=eo(prog(t,.3,.6));c.globalAlpha=qa;
  rr(c,80,420,860,qh,46);c.fillStyle='#fff';c.fill();c.beginPath();c.moveTo(130,420+qh);c.lineTo(110,420+qh+50);c.lineTo(200,420+qh);c.fill();c.fillStyle='#16110E';ql.forEach((l,i)=>c.fillText(l,130,500+i*78));
  if(n<q.length&&t>.4&&Math.floor(t*3)%2===0){const lw=c.measureText(ql[ql.length-1]).width;c.fillRect(134+lw,454+(ql.length-1)*78,5,60)}c.globalAlpha=1;
  const ay=420+qh+130;if(t>2&&t<2.7){const w=200;rr(c,W-80-w,ay,w,110,55);c.fillStyle=f.a;c.fill();for(let k=0;k<3;k++){c.beginPath();c.arc(W-80-w+60+k*40,ay+55-Math.abs(Math.sin(t*8+k))*12,10,0,Math.PI*2);c.fillStyle=onColor(f.a);c.fill()}}
  if(t>=2.6){const e=eo(prog(t,2.6,3.2));c.font=font(700,54,BODY);const al=wrap(c,f.sub,760,4);const ah=al.length*70+70;c.globalAlpha=e;c.save();c.translate((1-e)*80,0);rr(c,W-80-860,ay,860,ah,46);c.fillStyle=f.a;c.fill();c.beginPath();c.moveTo(W-130,ay+ah);c.lineTo(W-110,ay+ah+50);c.lineTo(W-200,ay+ah);c.fill();c.fillStyle=onColor(f.a);al.forEach((l,i)=>c.fillText(l,W-80-860+50,ay+76+i*70));c.restore();c.globalAlpha=1}
  const e=eo(prog(t,3.8,4.4));c.globalAlpha=e;pill(c,f.cta,W/2,H-220,'rgba(255,255,255,.12)','#fff',38);c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-150,180,130,prog(t,.2,.8))}},
{id:'geri',name:'Geri Sayım',cat:'Kampanya',dur:7,isNew:true,
 def:{title:'Yeni proje lansmanı',sub:'1 Kasım · 19:00',d1:'CANLI YAYINDA',d2:'',d3:'',cta:'Hatırlatıcı kur',p:'#0F0F14',a:'#FF4D6D'},
 labels:{title:'Başlık',sub:'Tarih / saat',d1:'Rozet',cta:'Çağrı metni'},
 tracks:[['3',0,.7],['2',.7,1.4],['1',1.4,2.1],['Başlık',2.2,3],['Tarih',2.8,3.3],['Rozet',3.2,3.7],['Çağrı',3.6,7]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);const g=c.createRadialGradient(W/2,H*.45,20,W/2,H*.45,900);g.addColorStop(0,mix(f.a,f.p,.6));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.18);
  c.textAlign='center';c.textBaseline='middle';if(t<2.1){const k=Math.floor(t/.7),lt=(t%.7)/.7;const s=1.6-.6*eo(clamp(lt*2));c.save();c.translate(W/2,H*.45);c.scale(s,s);c.globalAlpha=lt<.8?1:1-(lt-.8)/.2;c.font=font(900,560,COND);c.fillStyle='#fff';c.fillText(String(3-k),0,30);c.restore();c.globalAlpha=1;
   c.strokeStyle=f.a;c.lineWidth=14;c.beginPath();c.arc(W/2,H*.45,400,-Math.PI/2,-Math.PI/2+Math.PI*2*lt);c.stroke()}
  else{c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=6;c.beginPath();c.arc(W/2,H*.42,400*eo(prog(t,2.1,2.6)),0,Math.PI*2);c.stroke();c.textBaseline='alphabetic';titleReveal(c,f.title,W/2,H*.42-20,96,940,2.2,t,'#fff','center',2);c.textAlign='center';
   c.font=font(600,50,BODY);c.fillStyle='rgba(255,255,255,.85)';c.globalAlpha=eo(prog(t,2.8,3.3));c.fillText(f.sub,W/2,H*.42+190);c.globalAlpha=1;
   const e=eo(prog(t,3.2,3.7));if(e>0){c.globalAlpha=e;c.font=font(700,36,BODY);const w=c.measureText(f.d1).width+110;rr(c,W/2-w/2,H*.42-330,w,80,40);c.fillStyle='rgba(255,255,255,.1)';c.fill();c.beginPath();c.arc(W/2-w/2+42,H*.42-290,12,0,Math.PI*2);c.fillStyle=Math.floor(t*2)%2?f.a:mix(f.a,'#000000',.5);c.fill();c.fillStyle='#fff';c.textBaseline='middle';c.fillText(f.d1,W/2+18,H*.42-288);c.textBaseline='alphabetic';c.globalAlpha=1}
   const q=eo(prog(t,3.6,4.2));c.globalAlpha=q;pill(c,f.cta,W/2,H-260,f.a,onColor(f.a),44);c.globalAlpha=1}
  c.textAlign='left';c.textBaseline='alphabetic';if(A.logo)fitLogo(c,A.logo,W/2,180,150,1)}},
{id:'ozellik',name:'Özellik Listesi',cat:'Emlak',dur:8,isNew:true,
 def:{title:'Sitede neler var?',sub:'Mavi Vadi Konutları',d1:'Akıllı ev sistemi',d2:'Kapalı otopark',d3:'7/24 güvenlik',cta:'Spor salonu ve havuz',p:'#16302B',a:'#7BD389'},
 labels:{title:'Başlık',sub:'Proje adı',d1:'Özellik 1',d2:'Özellik 2',d3:'Özellik 3',cta:'Özellik 4'},
 tracks:[['Fotoğraf',0,8,1],['Başlık',.2,1.1],['Özellik 1',1,1.6],['Özellik 2',1.4,2],['Özellik 3',1.8,2.4],['Özellik 4',2.2,2.8]],
 draw(c,t,f,A){bg(c,f,A,t,8);const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(0,0,0,.85)');g.addColorStop(1,'rgba(0,0,0,.25)');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText(f.sub.toUpperCase(),80,420);c.globalAlpha=1;titleReveal(c,f.title,80,530,88,920,.2,t,'#fff',undefined,2);
  [f.d1,f.d2,f.d3,f.cta].filter(Boolean).forEach((s,i)=>{const y=880+i*170;const e=eo(prog(t,1+i*.4,1.5+i*.4));c.globalAlpha=e;rr(c,80,y-50,100,100,26);c.strokeStyle=f.a;c.lineWidth=5;c.stroke();
   const k=eio(prog(t,1.2+i*.4,1.6+i*.4));if(k>0){c.fillStyle=f.a;rr(c,80,y-50,100,100,26);c.globalAlpha=e*k;c.fill();c.globalAlpha=e;c.strokeStyle=onColor(f.a);c.lineWidth=10;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(106,y+2);const p1=clamp(k*2),p2=clamp(k*2-1);c.lineTo(106+20*p1,y+2+20*p1);if(p2>0)c.lineTo(126+30*p2,y+22-48*p2);c.stroke();c.lineCap='butt'}
   c.font=font(700,54,BODY);c.fillStyle='#fff';c.fillText(s,220+(1-e)*40,y+18)});c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-160,H-140,140,prog(t,3,3.6))}},
{id:'tasarim',name:'Eskizden Gerçeğe',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Eskizden gerçeğe',sub:'Bodrum Villa · Konsept',d1:'',d2:'',d3:'',cta:'',p:'#2F4858',a:'#F6AE2D'},
 labels:{title:'Başlık',sub:'Proje adı'},
 tracks:[['Kâğıt',0,8,1],['Kalem çizimi',.2,2.6],['Renk',2.6,3.8],['Başlık',3.6,4.4],['Proje adı',4.2,4.8]],
 draw(c,t,f,A){c.fillStyle='#F4F0E8';c.fillRect(0,0,W,H);
  const vols=[[140,860,500,420],[520,720,440,560],[80,1280,920,40]];const segs=[];vols.forEach(([x,y,w,h])=>{segs.push([x,y,x+w,y],[x+w,y,x+w,y+h],[x+w,y+h,x,y+h],[x,y+h,x,y])});segs.push([600,820,880,820],[600,900,880,900],[220,960,420,960]);
  const fillP=eio(prog(t,2.6,3.8));if(fillP>0){c.save();c.beginPath();c.rect(0,0,W*fillP,H);c.clip();if(A.photo){c.save();c.beginPath();vols.slice(0,2).forEach(([x,y,w,h])=>c.rect(x,y,w,h));c.clip();cover(c,A.photo,1.02);c.restore()}else{c.fillStyle=mix(f.p,'#ffffff',.15);c.fillRect(140,860,500,420);c.fillStyle=f.p;c.fillRect(520,720,440,560);c.fillStyle=mix(f.a,'#ffffff',.25);c.fillRect(600,820,280,80);c.fillRect(220,960,200,180);c.fillStyle='#3A3A3A';c.fillRect(80,1280,920,40)}c.restore()}
  segs.forEach(([a,b,cc,d],i)=>{const p=eio(prog(t,.2+i*.12,.6+i*.12));if(p<=0)return;for(let k=0;k<2;k++){const j=(sr(i*7+k)-.5)*8;c.strokeStyle=`rgba(40,40,40,${.75-k*.35})`;c.lineWidth=3-k;c.beginPath();c.moveTo(a+j-14,b-j);c.lineTo(a+(cc-a)*p*1.04+j,b+(d-b)*p*1.04-j);c.stroke()}});
  c.font=font(500,30,MONO);c.fillStyle='rgba(40,40,40,.6)';c.globalAlpha=eo(prog(t,.4,1));c.fillText('ÖN CEPHE · 1:100',80,640);c.globalAlpha=1;
  titleReveal(c,f.title,80,1520,92,920,3.6,t,f.p);c.font=font(600,42,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,4.2,4.8));c.fillText(f.sub,80,1640);c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-160,200,140,prog(t,3.6,4.2))}},
{id:'oda',name:'Oda Turu Başlığı',cat:'Emlak',dur:6,isNew:true,
 def:{title:'SALON',sub:'42 m² · Güney cephe',d1:'01',d2:'',d3:'',cta:'',p:'#202A36',a:'#F4B860'},
 labels:{title:'Oda adı',sub:'Bilgi',d1:'Sıra numarası'},
 tracks:[['Fotoğraf',0,6,1],['Hikâye çubukları',0,.6],['Numara',.3,.9],['Oda adı',.6,1.4],['Bilgi',1.2,1.8]],
 draw(c,t,f,A){bg(c,f,A,t,6);const g=c.createLinearGradient(0,H*.5,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=g;c.fillRect(0,0,W,H);
  const cur=Math.max(1,Math.min(5,parseInt(f.d1,10)||1));for(let i=0;i<5;i++){const x=60+i*((W-120)/5);const w=(W-120)/5-14;rr(c,x,90,w,8,4);c.fillStyle='rgba(255,255,255,.3)';c.fill();const fl=i<cur-1?1:i===cur-1?prog(t,0,6):0;if(fl>0){rr(c,x,90,w*fl,8,4);c.fillStyle='#fff';c.fill()}}
  const e=eo(prog(t,.3,.9));c.save();c.beginPath();c.rect(0,1100,W,330);c.clip();c.font=font(900,300,COND);c.fillStyle=f.a;c.fillText(f.d1,70,1400+(1-e)*320);c.restore();
  c.fillStyle='#fff';c.fillRect(80,1460,600*eo(prog(t,.6,1.2)),5);c.save();c.font=font(700,120);const tw=c.measureText(f.title).width;c.beginPath();c.rect(76,1490,tw*eio(prog(t,.6,1.4))+10,160);c.clip();c.fillStyle='#fff';c.fillText(f.title,80,1620);c.restore();
  c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.82)';c.globalAlpha=eo(prog(t,1.2,1.8));c.fillText(f.sub,80,1720);c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-150,190,130,prog(t,.4,1))}},
{id:'citat',name:'Mimar Sözü',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Mimarlık, ışığın mekânla buluştuğu yerdir.',sub:'Ayşe Demir',d1:'KURUCU MİMAR',d2:'',d3:'',cta:'',p:'#1C1A17',a:'#C9A05A'},
 labels:{title:'Söz',sub:'İsim',d1:'Unvan'},max:{title:120},
 tracks:[['Arka plan',0,8,1],['Tırnak',.2,.9],['Söz',.6,3.2],['İsim',3.2,3.8],['Unvan',3.5,4.1]],
 draw(c,t,f,A){darkBg(c,f,A,t,8,.2);c.font=font(500,520,SERIF);c.fillStyle=f.a;c.globalAlpha=.9*eo(prog(t,.2,.9));c.fillText('“',60,720);c.globalAlpha=1;
  c.font=font(500,80,SERIF).replace('500','italic 500');const ln=wrap(c,f.title,900,6);const words=ln.flatMap((l,li)=>l.split(' ').map(w=>[w,li]));let x=90,last=-1,wi=0;
  ln.forEach((l,li)=>{x=90;l.split(' ').forEach(w=>{const p=eo(prog(t,.6+(wi/words.length)*2.4,1+(wi/words.length)*2.4));c.globalAlpha=p;c.fillStyle='#F3EEE4';c.fillText(w,x,820+li*108+(1-p)*16);x+=c.measureText(w+' ').width;wi++})});c.globalAlpha=1;
  const y=820+ln.length*108+90;const e=eo(prog(t,3.2,3.8));c.fillStyle=f.a;c.fillRect(90,y-14,120*e,4);c.globalAlpha=e;c.font=font(700,50,BODY);c.fillStyle='#fff';c.fillText(f.sub,240,y);c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,3.5,4.1));c.fillText(f.d1,242,y+56);c.globalAlpha=1;
  if(A.logo)fitLogo(c,A.logo,W/2,H-150,140,prog(t,3.8,4.4))}},
{id:'kredi',name:'Aylık Taksit',cat:'Kampanya',dur:8,isNew:true,
 def:{title:'Aylık taksitlerle ev sahibi olun',sub:"'den başlayan taksitler",d1:'48500',d2:'120 ay vade',d3:'%25 peşinat',cta:'Ödeme planını iste',p:'#13293D',a:'#3FD0A8'},
 labels:{title:'Başlık',sub:'Rakam sonrası metin',d1:'Aylık tutar (₺)',d2:'Vade',d3:'Peşinat',cta:'Çağrı metni'},
 tracks:[['Arka plan',0,8,1],['Başlık',.2,1.1],['Tutar',.9,2.4],['Grafik',1,2.8],['Bilgiler',2.6,3.2],['Çağrı',3.4,8]],
 draw(c,t,f,A){darkBg(c,f,A,t,8,.3);titleReveal(c,f.title,80,300,78,920,.2,t,'#fff',undefined,2);const n=numOf(f.d1);const p=eio(prog(t,.9,2.4));c.font=font(900,240,COND);c.fillStyle='#fff';const v='₺'+Math.round(n*p).toLocaleString('tr-TR');c.fillText(v,70,700);
  c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.75)';c.globalAlpha=eo(prog(t,1.6,2.2));c.fillText(f.sub,80,780);c.globalAlpha=1;
  const bx=80,bw=W-160,base=1380,N=24;for(let i=0;i<N;i++){const q=eo(prog(t,1+i*.06,1.6+i*.06));const h=(160+i*14)*q;const x=bx+i*(bw/N);rr(c,x,base-h,bw/N-10,h,6);c.fillStyle=i===N-1?f.a:mix(f.a,f.p,.55);c.fill()}
  c.fillStyle='rgba(255,255,255,.2)';c.fillRect(bx,base+8,bw,3);
  [f.d2,f.d3].filter(Boolean).forEach((s,i)=>{const e=eo(prog(t,2.6+i*.15,3.1+i*.15));c.globalAlpha=e;pill(c,s,80+i*420,1500,'rgba(255,255,255,.1)','#fff',38,'left',36,90)});c.globalAlpha=1;
  const e=eo(prog(t,3.4,4));c.globalAlpha=e;pill(c,f.cta,W/2,H-210,f.a,onColor(f.a),44);c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-150,170,130,prog(t,.2,.8))}},
{id:'tesekkur',name:'Takipçi Teşekkürü',cat:'Kurumsal',dur:7,isNew:true,
 def:{title:'TEŞEKKÜRLER',sub:'takipçi',d1:'10000',d2:'',d3:'',cta:'Birlikte daha nice projeye',p:'#1D1335',a:'#FFC857'},
 labels:{title:'Başlık',sub:'Rakam altı',d1:'Sayı',cta:'Alt mesaj'},
 tracks:[['Arka plan',0,7,1],['Sayaç',.3,1.8],['Konfeti',1.7,7],['Başlık',1.8,2.6],['Alt mesaj',2.6,3.2]],
 draw(c,t,f,A){darkBg(c,f,A,t,7,.25);if(t>1.7){for(let i=0;i<120;i++){const lt=t-1.7;const x=sr(i)*W+Math.sin(lt*2+i)*40;const y=-60+((sr(i+50)*400+lt*(380+sr(i+9)*420))%(H+120));c.save();c.translate(x,y);c.rotate(lt*3+i);c.fillStyle=[f.a,'#FF6B8B','#7CC6FE','#ffffff'][i%4];c.globalAlpha=Math.min(1,lt*2);c.fillRect(-10,-5,20,10);c.restore()}c.globalAlpha=1}
  const n=numOf(f.d1);const p=eio(prog(t,.3,1.8));c.textAlign='center';c.font=font(900,320,COND);c.fillStyle='#fff';const s=1+.06*Math.max(0,1-Math.abs(t-1.85)*6);c.save();c.translate(W/2,H*.46);c.scale(s,s);c.fillText(Math.round(n*p).toLocaleString('tr-TR'),0,0);c.restore();
  c.font=font(600,52,BODY);c.fillStyle=f.a;c.fillText(f.sub,W/2,H*.46+90);c.textBaseline='alphabetic';titleReveal(c,f.title,W/2,H*.46-300,110,960,1.8,t,'#fff','center',1);c.textAlign='center';
  c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.85)';c.globalAlpha=eo(prog(t,2.6,3.2));c.fillText(f.cta,W/2,H*.46+260);c.globalAlpha=1;c.textAlign='left';if(A.logo)fitLogo(c,A.logo,W/2,H-170,150,prog(t,2.8,3.4))}},
{id:'sonkart',name:'Takip Et Kartı',cat:'Kapanış',dur:6,isNew:true,
 def:{title:'@lumenemlak',sub:'Yeni ilanlar her hafta',d1:'Takip et',d2:'Takip ediliyor ✓',d3:'',cta:'',p:'#121826',a:'#F7B538'},
 labels:{title:'Kullanıcı adı',sub:'Alt metin',d1:'Buton',d2:'Tıklandıktan sonra'},
 tracks:[['Arka plan',0,6,1],['Logo',.1,.7],['Kullanıcı adı',.5,1.2],['Alt metin',1,1.5],['İmleç ve tık',1.4,2.6]],
 draw(c,t,f,A){darkBg(c,f,A,t,6);const cy=H*.36;const s=clamp(eback(prog(t,.1,.7)),0,1.2);c.save();c.translate(W/2,cy);c.scale(s,s);c.beginPath();c.arc(0,0,150,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=10;c.beginPath();c.arc(0,0,176,0,Math.PI*2*eio(prog(t,.2,1.2)));c.stroke();
  if(A.logo){c.save();c.beginPath();c.arc(0,0,150,0,Math.PI*2);c.clip();fitLogo(c,A.logo,0,0,240,1);c.restore()}else{c.font=font(700,150);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(String(f.title).replace('@','').charAt(0).toUpperCase(),0,8)}c.restore();
  c.textAlign='center';c.textBaseline='alphabetic';c.font=font(700,72);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,.5,1.2));c.fillText(f.title,W/2,cy+300);c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.7)';c.globalAlpha=eo(prog(t,1,1.5));c.fillText(f.sub,W/2,cy+380);c.globalAlpha=1;
  const clicked=t>2.25;const bs=t>2.15&&t<2.4?.94:1;c.save();c.translate(W/2,cy+560);c.scale(bs,bs);c.globalAlpha=eo(prog(t,1,1.5));pill(c,clicked?f.d2:f.d1,0,0,clicked?'rgba(255,255,255,.14)':f.a,clicked?'#fff':onColor(f.a),48,'center',70,124);c.restore();c.globalAlpha=1;
  const cp=eio(prog(t,1.4,2.15));if(t>1.4){const x=W/2+380-300*cp,y=cy+800-210*cp;c.save();c.translate(x,y);c.scale(t>2.15&&t<2.4?.9:1,t>2.15&&t<2.4?.9:1);c.fillStyle='#fff';c.strokeStyle='#111';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(0,74);c.lineTo(20,56);c.lineTo(36,90);c.lineTo(50,84);c.lineTo(34,50);c.lineTo(60,50);c.closePath();c.fill();c.stroke();c.restore()}
  if(t>2.2&&t<2.9){const r=prog(t,2.2,2.9);c.strokeStyle=f.a;c.globalAlpha=1-r;c.lineWidth=6;c.beginPath();c.arc(W/2+80,cy+590,30+r*90,0,Math.PI*2);c.stroke();c.globalAlpha=1}c.textAlign='left'}},
{id:'drone',name:'Sinematik Başlık',cat:'Açılış',dur:7,isNew:true,
 def:{title:'BODRUM',sub:'Yalıkavak koyu',d1:'37.1047° N · 27.2877° E',d2:'',d3:'',cta:'',p:'#1F3A5F',a:'#F2A33A'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Koordinat'},
 tracks:[['Görüntü',0,7,1],['Sinema bantları',0,.8],['Başlık',.8,2.2],['Çizgi',1.6,2.2],['Alt başlık',1.9,2.5],['Koordinat',2.3,2.9]],
 draw(c,t,f,A){if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.12-.1*t/7)}else scene(c,f.p,f.a,t*2,false);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,0,W,H);
  const b=230*eio(prog(t,0,.8));c.fillStyle='#000';c.fillRect(0,0,W,b);c.fillRect(0,H-b,W,b);
  c.textAlign='center';c.font=font(700,120);const ls=60-40*eo(prog(t,.8,2.2));setLS(c,ls);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,.8,1.6));c.fillText(f.title,W/2+ls/2,H/2);setLS(c,0);c.globalAlpha=1;
  c.fillStyle=f.a;const lw=300*eo(prog(t,1.6,2.2));c.fillRect(W/2-lw/2,H/2+50,lw,4);c.font=font(600,48,BODY);c.fillStyle='rgba(255,255,255,.9)';c.globalAlpha=eo(prog(t,1.9,2.5));c.fillText(f.sub,W/2,H/2+130);
  c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,2.3,2.9));c.fillText(f.d1,W/2,H-b-60);c.globalAlpha=1;c.textAlign='left';if(A.logo)fitLogo(c,A.logo,W/2,b+110,140,prog(t,2.3,2.9))}},
{id:'kat',name:'Kat Seçimi',cat:'İnşaat',dur:8,isNew:true,
 def:{title:'Hangi kat size göre?',sub:'Deniz manzarası',d1:'12',d2:'Brüt 145 m²',d3:'',cta:'Kat planını gör',p:'#172A3A',a:'#FFB703'},
 labels:{title:'Başlık',sub:'Kat özelliği',d1:'Kat numarası',d2:'Alan',cta:'Çağrı metni'},
 tracks:[['Arka plan',0,8,1],['Başlık',.2,1.1],['Bina',.3,1.2],['Kat seçimi',1,2.6],['Bilgi kartı',2.6,3.2],['Çağrı',3.4,8]],
 draw(c,t,f,A){darkBg(c,f,A,t,8,.3);titleReveal(c,f.title,80,260,78,920,.2,t,'#fff',undefined,2);const F=16,bx=150,bw=360,top=560,fh=68;const target=Math.max(1,Math.min(F,parseInt(f.d1,10)||1));
  for(let i=0;i<F;i++){const e=eo(prog(t,.3+i*.04,.7+i*.04));const y=top+(F-1-i)*fh;c.globalAlpha=e;c.fillStyle=mix(f.p,'#ffffff',.12);c.fillRect(bx,y,bw,fh-8);c.fillStyle='rgba(255,255,255,.25)';for(let k=0;k<5;k++)c.fillRect(bx+20+k*68,y+14,40,fh-36)}c.globalAlpha=1;
  const cur=1+(target-1)*eio(prog(t,1,2.6));const hy=top+(F-cur)*fh;c.fillStyle=f.a;c.globalAlpha=.85;c.fillRect(bx-14,hy-4,bw+28,fh);c.globalAlpha=1;c.font=font(700,40);c.fillStyle=onColor(f.a);c.fillText(Math.round(cur)+'',bx+bw/2-20,hy+fh/2+14);
  const e=eo(prog(t,2.6,3.2));if(e>0){c.globalAlpha=e;c.strokeStyle=f.a;c.lineWidth=4;c.beginPath();c.moveTo(bx+bw+14,hy+fh/2-4);c.lineTo(bx+bw+90,hy+fh/2-4);c.stroke();rr(c,bx+bw+90,hy-80,410,220,28);c.fillStyle='rgba(255,255,255,.08)';c.fill();c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=2;c.stroke();
   c.font=font(700,56);c.fillStyle='#fff';c.fillText(target+'. kat',bx+bw+124,hy);c.font=font(600,36,BODY);c.fillStyle=f.a;c.fillText(f.sub,bx+bw+124,hy+56);c.fillStyle='rgba(255,255,255,.7)';c.fillText(f.d2,bx+bw+124,hy+106);c.globalAlpha=1}
  const q=eo(prog(t,3.4,4));c.globalAlpha=q;pill(c,f.cta,W/2,H-190,f.a,onColor(f.a),44);c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-150,H-330,120,q)}},
{id:'enerji',name:'Enerji Sınıfı',cat:'Mimari',dur:7,isNew:true,
 def:{title:'Enerji sınıfı',sub:'Yıllık %40 daha az tüketim',d1:'A',d2:'',d3:'',cta:'Yeşil bina sertifikalı',p:'#1B3A2F',a:'#2BB673'},
 labels:{title:'Başlık',sub:'Açıklama',d1:'Sınıf harfi (A–G)',cta:'Alt rozet'},
 tracks:[['Kâğıt',0,7,1],['Başlık',.2,1.1],['Çubuklar',.8,2],['İşaretçi',2,2.8],['Açıklama',2.8,3.4],['Rozet',3.4,4]],
 draw(c,t,f,A){c.fillStyle='#F2F1EC';c.fillRect(0,0,W,H);titleReveal(c,f.title,80,320,92,920,.2,t,f.p);const L='ABCDEFG',cols=['#1A9850','#66BD63','#A6D96A','#FEE08B','#FDAE61','#F46D43','#D73027'];const idx=Math.max(0,L.indexOf(String(f.d1).toUpperCase()[0]));
  for(let i=0;i<7;i++){const e=eo(prog(t,.8+i*.12,1.3+i*.12));const y=520+i*130;const w=(340+i*70)*e;c.fillStyle=cols[i];c.beginPath();c.moveTo(80,y);c.lineTo(80+w,y);c.lineTo(80+w+50*e,y+50);c.lineTo(80+w,y+100);c.lineTo(80,y+100);c.closePath();c.fill();c.globalAlpha=e;c.font=font(900,80,COND);c.fillStyle='#fff';c.fillText(L[i],110,y+82);c.globalAlpha=1}
  const p=eback(prog(t,2,2.8));if(prog(t,2,2.8)>0){const y=520+idx*130;const x=W-80-260+(1-clamp(p))*400;c.fillStyle=f.p;c.beginPath();c.moveTo(x-50,y+50);c.lineTo(x,y);c.lineTo(x+260,y);c.lineTo(x+260,y+100);c.lineTo(x,y+100);c.closePath();c.fill();c.font=font(900,86,COND);c.fillStyle='#fff';c.textAlign='center';c.fillText(L[idx],x+130,y+84);c.textAlign='left'}
  c.font=font(700,50,BODY);c.fillStyle=f.p;c.globalAlpha=eo(prog(t,2.8,3.4));c.fillText(f.sub,80,1530);c.globalAlpha=1;const e=eo(prog(t,3.4,4));c.globalAlpha=e;pill(c,'✓ '+f.cta,80,1660,f.a,onColor(f.a),40,'left');c.globalAlpha=1;if(A.logo)fitLogo(c,A.logo,W-160,H-160,140,e)}}
];
TEMPLATES.push(...MORE);
// ===== ZodMotions şablon paketi 3 (50 şablon) — ortak yardımcılar =====
const ICO={ev:'M6 22 L24 8 L42 22 M10 19 V40 H38 V19 M20 40 V28 H28 V40',anahtar:'M30 18 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M24 24 L8 40 M12 36 L16 40 M15 33 L19 37',
 konum:'M24 42 C16 32 10 26 10 18 A14 14 0 0 1 38 18 C38 26 32 32 24 42 Z M19 18 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',tel:'M15 6 L22 7 L25 15 L20 19 C22 25 24 27 30 29 L34 24 L42 27 L42 34 C42 39 38 42 34 41 C19 38 9 28 7 14 C6 10 10 6 15 6 Z',
 ampul:'M24 6 A12 12 0 0 1 31 28 V33 H17 V28 A12 12 0 0 1 24 6 Z M18 38 H30 M20 43 H28',baret:'M6 34 H42 V38 H6 Z M10 34 C10 22 16 14 24 14 C32 14 38 22 38 34 M24 14 V24',
 metre:'M6 18 H42 V30 H6 Z M12 18 V24 M18 18 V26 M24 18 V24 M30 18 V26 M36 18 V24',kat:'M24 6 L42 16 L24 26 L6 16 Z M6 24 L24 34 L42 24 M6 32 L24 42 L42 32',
 takvim:'M8 12 H40 V42 H8 Z M8 20 H40 M16 6 V14 M32 6 V14',check:'M10 25 L20 35 L38 14',mesaj:'M8 10 H40 V32 H22 L14 40 V32 H8 Z',
 insta:'M10 10 H38 V38 H10 Z M17 24 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M33 15 L34 15',web:'M24 6 A18 18 0 1 0 24 42 A18 18 0 1 0 24 6 M6 24 H42 M24 6 C16 14 16 34 24 42 M24 6 C32 14 32 34 24 42',
 oda:'M8 40 V18 L24 8 L40 18 V40 Z M8 28 H40 M24 28 V40',yas:'M24 6 A18 18 0 1 0 24 42 A18 18 0 1 0 24 6 M24 14 V24 L31 29',gunes:'M24 16 a8 8 0 1 0 0.1 0 M24 4 V9 M24 39 V44 M4 24 H9 M39 24 H44 M10 10 L13 13 M35 35 L38 38 M10 38 L13 35 M35 13 L38 10'};
const PATHS={};const ipath=n=>PATHS[n]||(PATHS[n]=new Path2D(ICO[n]));
function icon(c,n,x,y,size,col,lw=3,p=1){if(p<=0)return;c.save();c.translate(x-size/2,y-size/2);c.scale(size/48,size/48);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.lineJoin='round';if(p<1){c.setLineDash([240,240]);c.lineDashOffset=240*(1-p)}c.stroke(ipath(n));c.restore();c.setLineDash([])}
function glass(c,x,y,w,h,r=32,a=.07){rr(c,x,y,w,h,r);c.fillStyle=`rgba(255,255,255,${a})`;c.fill();c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=2;c.stroke()}
function kick(c,txt,x,y,col,t,t0=.1,align='left'){c.font=font(500,30,MONO);setLS(c,5);c.fillStyle=col;c.textAlign=align;c.globalAlpha=eo(prog(t,t0,t0+.5));c.fillText(String(txt).toUpperCase(),x,y);c.globalAlpha=1;setLS(c,0);c.textAlign='left'}
function fitFont(c,txt,w,max,min,weight=900,fam=COND){let s=max;c.font=font(weight,s,fam);while(s>min&&c.measureText(txt).width>w){s-=4;c.font=font(weight,s,fam)}return s}
function grain(c,t,a=.05){for(let i=0;i<220;i++){c.fillStyle=i%2?`rgba(255,255,255,${a})`:`rgba(0,0,0,${a})`;c.fillRect(sr(i+Math.floor(t*12)*7)*W,sr(i*3+Math.floor(t*12))*H,3,3)}}
function vign(c,k=.5){const g=c.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.78);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${k})`);c.fillStyle=g;c.fillRect(0,0,W,H)}
function photoDark(c,f,A,t,dur,k=.5){bg(c,f,A,t,dur);c.fillStyle=`rgba(0,0,0,${k})`;c.fillRect(0,0,W,H)}
function logoCorner(c,A,t,t0=.3,x=W-150,y=170,s=130){if(A.logo)fitLogo(c,A.logo,x,y,s,prog(t,t0,t0+.6))}
const lerp=(a,b,k)=>a+(b-a)*k;

const PACK3=[
// ---------------- YAZI (kinetik tipografi) ----------------
{id:'k_maske',name:'Şerit Vurgu',cat:'Yazı',dur:6,isNew:true,
 def:{title:'Hayalindeki ev',sub:'şimdi',d1:'gerçek oluyor.',d2:'',d3:'',cta:'',p:'#111318',a:'#FFB547'},
 labels:{title:'Satır 1',sub:'Satır 2 (vurgulu)',d1:'Satır 3'},
 tracks:[['Zemin',0,6,1],['Satır 1',.2,.9],['Vurgu şeridi',.7,1.3],['Satır 2',.9,1.5],['Satır 3',1.3,2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04+.04*t/6,.35);vign(c,.6);
  const L=[f.title,f.sub,f.d1];const y0=H*.42;const sz=fitFont(c,L.reduce((a,b)=>String(b).length>String(a).length?b:a,''),940,150,70,900,COND);
  L.forEach((s,i)=>{const y=y0+i*sz*.98;const p=eo(prog(t,.2+i*.35,.85+i*.35));c.font=font(900,sz,COND);const w=c.measureText(String(s).toUpperCase()).width;
   if(i===1){const k=eio(prog(t,.7,1.3));c.fillStyle=f.a;c.fillRect(70,y-sz*.82,(w+40)*k,sz*.95)}
   c.save();c.beginPath();c.rect(0,y-sz*.9,W,sz*1.02);c.clip();c.fillStyle=i===1?onColor(f.a):'#fff';c.fillText(String(s).toUpperCase(),90+(i===2?(1-p)*-200:0),y+(i===2?0:(1-p)*sz));c.restore()});
  logoCorner(c,A,t,1.6,W/2,H-180,150)}},
{id:'k_kelime',name:'Kelime Vuruşu',cat:'Yazı',dur:6,isNew:true,
 def:{title:'Her yapı bir hikâye anlatır',sub:'',d1:'',d2:'',d3:'',cta:'',p:'#0E0F13',a:'#FF5C7A'},
 labels:{title:'Cümle'},max:{title:60},
 tracks:[['Zemin',0,6,1],['Kelimeler',.2,3.6],['Son kelime',3,3.8]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.06,.25);const w=String(f.title).split(/\s+/).filter(Boolean);const per=3.2/Math.max(1,w.length);
  const i=Math.min(w.length-1,Math.floor(Math.max(0,t-.2)/per));const lt=(t-.2-i*per)/per;const last=i===w.length-1;const word=w[i]||'';
  const g=c.createRadialGradient(W/2,H/2,20,W/2,H/2,700);g.addColorStop(0,mix(f.a,f.p,.7));g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=last?1:.5;c.fillStyle=g;c.fillRect(0,0,W,H);c.globalAlpha=1;
  const sz=fitFont(c,word.toUpperCase(),940,last?300:240,80);const s=t<.2?0:last?1+.06*(1-eo(clamp(lt*3)))+.02*Math.sin(t*4):1.35-.35*eo(clamp(lt*4));
  c.save();c.translate(W/2,H/2+sz*.32);c.scale(s,s);c.font=font(900,sz,COND);c.textAlign='center';if(last){c.fillStyle=f.a;c.fillText(word.toUpperCase(),10,10)}c.fillStyle='#fff';c.globalAlpha=t<.2?0:clamp(lt*6);c.fillText(word.toUpperCase(),0,0);c.restore();c.globalAlpha=1;
  c.font=font(500,28,MONO);c.fillStyle='rgba(255,255,255,.4)';c.textAlign='center';c.fillText(`${String(i+1).padStart(2,'0')} / ${String(w.length).padStart(2,'0')}`,W/2,H-180);c.textAlign='left';logoCorner(c,A,t,3.4,W/2,220,140)}},
{id:'k_dev',name:'Dev Kelime',cat:'Yazı',dur:6,isNew:true,
 def:{title:'VİLLA',sub:'Doğayla iç içe 12 müstakil yaşam',d1:'YENİ PROJE',d2:'',d3:'',cta:'',p:'#14161C',a:'#E8C07D'},
 labels:{title:'Dev kelime',sub:'Alt metin',d1:'Üst etiket'},
 tracks:[['Görüntü',0,6,1],['Dev kelime',0,1.6],['Etiket',1.2,1.7],['Alt metin',1.5,2.2]],
 draw(c,t,f,A){photoDark(c,f,A,t,6,.35);const z=lerp(3.2,1,eio(prog(t,0,1.6)));const sz=fitFont(c,String(f.title),980,520,120);
  c.save();c.translate(W/2,H*.5);c.scale(z,z);c.font=font(900,sz,COND);c.textAlign='center';c.textBaseline='middle';c.globalCompositeOperation='overlay';c.fillStyle='#fff';c.fillText(f.title,0,0);c.globalCompositeOperation='source-over';
  c.lineWidth=3/z;c.strokeStyle=f.a;c.strokeText(f.title,0,0);c.restore();c.textAlign='left';c.textBaseline='alphabetic';
  kick(c,f.d1,W/2,H*.5-sz*.62,f.a,t,1.2,'center');c.textAlign='center';c.font=font(600,46,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,1.5,2.2));wrap(c,f.sub,860,2).forEach((l,i)=>c.fillText(l,W/2,H*.5+sz*.66+i*58));c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,1.8,W/2,H-170,150)}},
{id:'k_daktilo',name:'Daktilo Notu',cat:'Yazı',dur:7,isNew:true,
 def:{title:'Not: Bu dairenin balkonundan her sabah denize karşı kahve içeceksiniz.',sub:'— Danışmanınız',d1:'İLAN NOTU',d2:'',d3:'',cta:'',p:'#F1EBDD',a:'#C2410C'},
 labels:{title:'Metin',sub:'İmza',d1:'Üst etiket'},max:{title:130},
 tracks:[['Kâğıt',0,7,1],['Etiket',.1,.6],['Yazım',.4,4.4],['İmza',4.4,5]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);for(let i=0;i<46;i++){c.fillStyle='rgba(60,40,20,.05)';c.fillRect(0,300+i*44,W,2)}c.fillStyle=f.a;c.fillRect(150,0,4,H);
  kick(c,f.d1,200,250,f.a,t,.1);const txt=String(f.title);const n=Math.floor(txt.length*prog(t,.4,4.4));c.font=font(500,54,MONO);const lines=wrap(c,txt.slice(0,Math.max(0,n)),780,9);
  c.fillStyle='#2A2018';lines.forEach((l,i)=>c.fillText(l,200,420+i*88));const last=lines[lines.length-1]||'';if(Math.floor(t*2.5)%2===0||n<txt.length){c.fillStyle=f.a;c.fillRect(204+c.measureText(last).width,380+(Math.max(1,lines.length)-1)*88,26,52)}
  c.font=font(500,48,SERIF).replace('500','italic 500');c.fillStyle='#2A2018';c.globalAlpha=eo(prog(t,4.4,5));c.fillText(f.sub,200,420+Math.max(1,lines.length)*88+80);c.globalAlpha=1;logoCorner(c,A,t,4.4,W-170,H-170,140)}},
{id:'k_kontur',name:'Kontur Çizimi',cat:'Yazı',dur:6,isNew:true,
 def:{title:'MODERN',sub:'YAŞAM',d1:'Kadıköy · 2027',d2:'',d3:'',cta:'',p:'#0B0C10',a:'#7C93FF'},
 labels:{title:'Kelime 1',sub:'Kelime 2',d1:'Alt bilgi'},
 tracks:[['Zemin',0,6,1],['Kontur çizimi',.2,2],['Dolgu',1.8,2.6],['Alt bilgi',2.4,3]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.05,.3);[f.title,f.sub].forEach((s,i)=>{const sz=fitFont(c,String(s),960,330,120);const y=H*.44+i*sz*.92;c.font=font(900,sz,COND);c.textAlign='center';
  const p=prog(t,.2+i*.3,1.8+i*.3);c.setLineDash([60,40]);c.lineDashOffset=(1-p)*1600;c.lineWidth=4;c.strokeStyle=i?f.a:'#fff';c.globalAlpha=clamp(p*4);c.strokeText(s,W/2,y);c.setLineDash([]);
  const fl=eio(prog(t,1.8+i*.2,2.6+i*.2));if(fl>0){c.save();c.beginPath();c.rect(0,y-sz,W,sz*1.1*fl);c.clip();c.fillStyle=i?f.a:'#fff';c.fillText(s,W/2,y);c.restore()}c.globalAlpha=1});
  c.font=font(500,34,MONO);c.fillStyle='rgba(255,255,255,.7)';c.globalAlpha=eo(prog(t,2.4,3));c.fillText(f.d1,W/2,H*.75);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.4,W/2,220,140)}},
{id:'k_yanki',name:'Yankı Yığını',cat:'Yazı',dur:6,isNew:true,
 def:{title:'SATIŞTA',sub:'Son 4 daire',d1:'',d2:'',d3:'',cta:'',p:'#130F1A',a:'#FFB547'},
 labels:{title:'Kelime',sub:'Alt metin'},
 tracks:[['Zemin',0,6,1],['Yankılar',.1,1.6],['Ana kelime',.9,1.5],['Alt metin',1.6,2.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.05,.28);const sz=fitFont(c,String(f.title),960,250,90);c.textAlign='center';c.font=font(900,sz,COND);
  for(let i=6;i>=1;i--){const p=eo(prog(t,.1+i*.08,.9+i*.08));const off=i*sz*.62*p;c.globalAlpha=(.55-i*.07)*p;c.lineWidth=2.5;c.strokeStyle=f.a;[-1,1].forEach(s=>c.strokeText(f.title,W/2,H/2+sz*.3+s*off+Math.sin(t*1.4+i)*6))}c.globalAlpha=1;
  const m=eback(prog(t,.9,1.5));c.save();c.translate(W/2,H/2+sz*.3);c.scale(clamp(m,0,1.2),clamp(m,0,1.2));c.fillStyle='#fff';c.fillText(f.title,0,0);c.restore();
  c.font=font(700,50,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,1.6,2.2));c.fillText(f.sub,W/2,H-260);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,1.8,W/2,200,140)}},
{id:'k_bolunmus',name:'Bölünmüş Başlık',cat:'Yazı',dur:6,isNew:true,
 def:{title:'İLK GÜNDEN',sub:'Projenin ilk taşından anahtar teslimine',d1:'',d2:'',d3:'',cta:'',p:'#0F1115',a:'#FF5C7A'},
 labels:{title:'Başlık',sub:'Alt metin'},
 tracks:[['Zemin',0,6,1],['Üst yarım',.2,1.2],['Alt yarım',.2,1.2],['Çizgi',1,1.6],['Alt metin',1.4,2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.05,.3);const sz=fitFont(c,String(f.title),960,240,90);const y=H*.46;c.font=font(900,sz,COND);c.textAlign='center';const p=eio(prog(t,.2,1.2));
  c.save();c.beginPath();c.rect(0,0,W,y-sz*.34);c.clip();c.fillStyle='#fff';c.fillText(f.title,W/2-(1-p)*700,y);c.restore();
  c.save();c.beginPath();c.rect(0,y-sz*.34,W,H);c.clip();c.fillStyle=f.a;c.fillText(f.title,W/2+(1-p)*700,y);c.restore();
  const l=eo(prog(t,1,1.6));c.fillStyle='#fff';c.fillRect(W/2-300*l,y+60,600*l,4);c.font=font(600,46,BODY);c.fillStyle='rgba(255,255,255,.85)';c.globalAlpha=eo(prog(t,1.4,2));wrap(c,f.sub,880,2).forEach((s,i)=>c.fillText(s,W/2,y+150+i*58));c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,1.6,W/2,H-180,150)}},
{id:'k_neon',name:'Neon Tabela',cat:'Yazı',dur:6,isNew:true,
 def:{title:'AÇIK EV',sub:'Bu pazar 12:00 – 17:00',d1:'',d2:'',d3:'',cta:'',p:'#07070C',a:'#FF4FD8'},
 labels:{title:'Neon yazı',sub:'Alt metin'},
 tracks:[['Tuğla duvar',0,6,1],['Titreme',.3,1.4],['Neon',1.4,6],['Alt metin',1.8,2.4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);for(let r=0;r<40;r++)for(let k=0;k<9;k++){c.fillStyle=`rgba(255,255,255,${.018+sr(r*9+k)*.02})`;c.fillRect(k*130+(r%2)*65-60,r*52,122,46)}
  const fl=t<.3?0:t<1.4?(sr(Math.floor(t*22))>.45?1:.15):1+.04*Math.sin(t*9);const sz=fitFont(c,String(f.title),900,260,90,700,DISP);c.textAlign='center';c.font=font(700,sz,DISP);
  c.shadowColor=f.a;c.shadowBlur=60*fl;c.strokeStyle=mix(f.a,'#ffffff',.55);c.lineWidth=6;c.globalAlpha=clamp(fl);c.strokeText(f.title,W/2,H*.47);c.shadowBlur=24*fl;c.strokeText(f.title,W/2,H*.47);c.shadowBlur=0;c.globalAlpha=1;
  const g=c.createRadialGradient(W/2,H*.45,10,W/2,H*.45,700);g.addColorStop(0,f.a);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=.18*clamp(fl);c.fillStyle=g;c.fillRect(0,0,W,H);c.globalAlpha=1;
  c.font=font(600,48,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,1.8,2.4));c.fillText(f.sub,W/2,H*.47+180);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2,W/2,H-180,140)}},
{id:'k_kayan',name:'Kayan Satırlar',cat:'Yazı',dur:7,isNew:true,
 def:{title:'MİMARİ',sub:'İÇ MEKÂN',d1:'PEYZAJ',d2:'RESTORASYON',d3:'',cta:'Hepsi tek çatı altında',p:'#0D0E12',a:'#F2C14E'},
 labels:{title:'Satır 1',sub:'Satır 2',d1:'Satır 3 (vurgulu)',d2:'Satır 4',cta:'Alt mesaj'},
 tracks:[['Zemin',0,7,1],['Kayan satırlar',0,7],['Vurgu',1,1.6],['Alt mesaj',2.4,3]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.22);const rows=[f.title,f.sub,f.d1,f.d2];const sz=200;c.font=font(900,sz,COND);
  rows.forEach((s,i)=>{const y=700+i*230;const word=String(s).toUpperCase()+'  ·  ';const ww=c.measureText(word).width;const dir=i%2?1:-1;const off=((t*(180+i*40))*dir%ww+ww)%ww;const hi=i===2;const e=eo(prog(t,.1+i*.1,.7+i*.1));c.globalAlpha=e;
   if(hi){const k=eio(prog(t,1,1.6));c.fillStyle=f.a;c.fillRect(0,y-sz*.82,W*k,sz*.95)}for(let x=-ww+off-ww;x<W+ww;x+=ww){c.fillStyle=hi?onColor(f.a):'rgba(255,255,255,.9)';if(!hi){c.lineWidth=3;c.strokeStyle='rgba(255,255,255,.85)';if(i%2){c.strokeText(word,x,y)}else c.fillText(word,x,y)}else c.fillText(word,x,y)}});c.globalAlpha=1;
  c.textAlign='center';c.font=font(700,50,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,2.4,3));c.fillText(f.cta,W/2,H-200);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.6,W/2,240,140)}},
{id:'k_vurgu',name:'Fosforlu Vurgu',cat:'Yazı',dur:6,isNew:true,
 def:{title:'Metrobüse 4 dakika, sahile 8 dakika mesafede.',sub:'4 dakika',d1:'KONUM',d2:'',d3:'',cta:'',p:'#F4F1EA',a:'#FFE14D'},
 labels:{title:'Cümle',sub:'Vurgulanacak kısım',d1:'Üst etiket'},max:{title:90},
 tracks:[['Kâğıt',0,6,1],['Cümle',.2,1.4],['Fosforlu kalem',1.4,2.2],['Daire',2.2,2.9]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);kick(c,f.d1,90,520,'#8A7F70',t,.1);c.font=font(700,88,BODY);const lines=wrap(c,f.title,900,5);const key=String(f.sub);
  lines.forEach((l,i)=>{const y=680+i*112;const idx=key?l.indexOf(key):-1;if(idx>=0){const x0=90+c.measureText(l.slice(0,idx)).width;const kw=c.measureText(key).width;const k=eio(prog(t,1.4,2.2));c.fillStyle=f.a;c.globalAlpha=.85;c.beginPath();c.moveTo(x0-10,y-62);c.lineTo(x0-10+(kw+20)*k,y-70);c.lineTo(x0-6+(kw+16)*k,y+18);c.lineTo(x0-12,y+22);c.closePath();c.fill();c.globalAlpha=1;
    const r=prog(t,2.2,2.9);if(r>0){c.strokeStyle='#D7263D';c.lineWidth=6;c.lineCap='round';c.beginPath();c.ellipse(x0+kw/2,y-24,kw/2+40,74,-.05,-1.7,-1.7+Math.PI*2.1*eio(r));c.stroke();c.lineCap='butt'}}
   const p=eo(prog(t,.2+i*.15,.8+i*.15));c.globalAlpha=p;c.fillStyle='#1A1714';c.fillText(l,90,y+(1-p)*30);c.globalAlpha=1});logoCorner(c,A,t,2.6,W-170,H-180,140)}},
// ---------------- SOSYAL ----------------
{id:'s_hook',name:'3 Hata Kancası',cat:'Sosyal',dur:8,isNew:true,
 def:{title:'Ev alırken yapılan 3 hata',sub:'Tapu durumunu kontrol etmemek',d1:'Sadece fiyata bakmak',d2:'Aidatı sormamak',d3:'',cta:'Kaydet, sonra lazım olur',p:'#101217',a:'#FF5C5C'},
 labels:{title:'Kanca başlık',sub:'Madde 1',d1:'Madde 2',d2:'Madde 3',cta:'Alt çağrı'},
 tracks:[['Zemin',0,8,1],['Dev 3',.1,.8],['Başlık',.5,1.4],['Madde 1',1.8,2.4],['Madde 2',2.4,3],['Madde 3',3,3.6],['Çağrı',4,4.6]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);const n=numOf(f.title)||3;const s=clamp(eback(prog(t,.1,.8)),0,1.15);c.save();c.translate(W-260,520);c.rotate(-.08);c.scale(s,s);c.font=font(900,620,COND);c.textAlign='center';c.fillStyle=f.a;c.fillText(String(n),0,200);c.restore();
  titleReveal(c,f.title,80,330,92,640,.5,t,'#fff',undefined,3);
  [f.sub,f.d1,f.d2].filter(Boolean).forEach((s2,i)=>{const e=eo(prog(t,1.8+i*.6,2.4+i*.6));const y=1020+i*220;c.globalAlpha=e;c.save();c.translate((1-e)*-120,0);glass(c,70,y-80,W-140,170,30,.06);c.fillStyle=f.a;rr(c,100,y-50,110,110,24);c.fill();c.font=font(900,80,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(String(i+1),155,y+30);c.textAlign='left';
   c.font=font(700,46,BODY);c.fillStyle='#fff';const wl=wrap(c,s2,700,2);wl.forEach((l,j)=>c.fillText(l,250,wl.length>1?y-10+j*56:y+18));c.restore()});c.globalAlpha=1;
  const q=eo(prog(t,4,4.6));c.globalAlpha=q;pill(c,'↓ '+f.cta,W/2,H-150,'rgba(255,255,255,.12)','#fff',38);c.globalAlpha=1;logoCorner(c,A,t,.4,150,170)}},
{id:'s_ipucu',name:'Uzman İpucu',cat:'Sosyal',dur:7,isNew:true,
 def:{title:'Daire bakarken öğle saatinde gidin.',sub:'Gün ışığının hangi odaya ne kadar girdiğini ancak o zaman görürsünüz.',d1:'İPUCU #07',d2:'',d3:'',cta:'',p:'#14202B',a:'#FFD166'},
 labels:{title:'İpucu',sub:'Açıklama',d1:'Etiket'},max:{title:70,sub:120},
 tracks:[['Zemin',0,7,1],['Ampul',.2,1.2],['Işık',1,1.4],['İpucu',1.2,2.2],['Açıklama',2.2,3]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.18);const on=prog(t,1,1.4);if(on>0){const g=c.createRadialGradient(W/2,520,20,W/2,520,620);g.addColorStop(0,mix(f.a,'#ffffff',.3));g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=.55*on*(1+.05*Math.sin(t*6));c.fillStyle=g;c.fillRect(0,0,W,H);c.globalAlpha=1}
  icon(c,'ampul',W/2,520,300,on>0?f.a:'#fff',2.6,eio(prog(t,.2,1.2)));kick(c,f.d1,W/2,830,f.a,t,1,'center');c.textAlign='center';c.font=font(700,74,BODY);
  wrap(c,f.title,920,3).forEach((l,i)=>{const p=eo(prog(t,1.2+i*.15,1.8+i*.15));c.globalAlpha=p;c.fillStyle='#fff';c.fillText(l,W/2,960+i*90+(1-p)*30)});c.globalAlpha=1;
  c.font=font(500,44,BODY);c.fillStyle='rgba(255,255,255,.75)';c.globalAlpha=eo(prog(t,2.2,3));wrap(c,f.sub,880,4).forEach((l,i)=>c.fillText(l,W/2,1300+i*60));c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.6,W/2,H-170,140)}},
{id:'s_anket',name:'Anket',cat:'Sosyal',dur:7,isNew:true,
 def:{title:'Hangisini seçerdiniz?',sub:'Deniz manzarası',d1:'Bahçe katı',d2:'64',d3:'36',cta:'Yorumlara yaz',p:'#151826',a:'#7C93FF'},
 labels:{title:'Soru',sub:'Seçenek A',d1:'Seçenek B',d2:'A yüzdesi',d3:'B yüzdesi',cta:'Alt çağrı'},
 tracks:[['Zemin',0,7,1],['Soru',.2,1.1],['Seçenekler',1,1.6],['Oylar',1.8,3.4],['Çağrı',3.6,4.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);kick(c,'ANKET',W/2,380,f.a,t,.1,'center');c.textAlign='center';titleReveal(c,f.title,W/2,500,86,920,.2,t,'#fff','center',2);c.textAlign='left';
  const opts=[[f.sub,numOf(f.d2)],[f.d1,numOf(f.d3)]];const win=opts[0][1]>=opts[1][1]?0:1;opts.forEach(([lab,v],i)=>{const y=820+i*260;const e=eo(prog(t,1+i*.2,1.6+i*.2));c.globalAlpha=e;glass(c,80,y,W-160,190,40,.06);
   const k=eio(prog(t,1.8,3.4));rr(c,80,y,Math.max(80,(W-160)*v/100*k),190,40);c.fillStyle=i===win?f.a:'rgba(255,255,255,.14)';c.fill();
   c.font=font(700,52,BODY);c.fillStyle=i===win&&k>.4?onColor(f.a):'#fff';c.fillText(lab,130,y+112);c.font=font(900,90,COND);c.textAlign='right';c.fillStyle='#fff';c.fillText('%'+Math.round(v*k),W-120,y+126);c.textAlign='left'});c.globalAlpha=1;
  const q=eo(prog(t,3.6,4.2));c.globalAlpha=q;pill(c,f.cta,W/2,H-260,'rgba(255,255,255,.12)','#fff',40);c.globalAlpha=1;logoCorner(c,A,t,.4,W/2,220,120)}},
{id:'s_yorum',name:'Yoruma Cevap',cat:'Sosyal',dur:7,isNew:true,
 def:{title:'Bu dairenin aidatı ne kadar?',sub:'@emlakseven',d1:'Aylık 2.400 ₺, ısınma dahil.',d2:'',d3:'',cta:'',p:'#0F1218',a:'#F5A623'},
 labels:{title:'Gelen yorum',sub:'Kullanıcı adı',d1:'Cevabın'},max:{title:80,d1:90},
 tracks:[['Görüntü',0,7,1],['Yorum etiketi',.2,.9],['Cevap',1.4,2.4]],
 draw(c,t,f,A){photoDark(c,f,A,t,7,.45);const s=clamp(eback(prog(t,.2,.9)),0,1.1);c.save();c.translate(W/2,600);c.rotate(-.04);c.scale(s,s);c.font=font(700,52,BODY);const ql=wrap(c,f.title,720,3);const h=170+ql.length*64;
  rr(c,-430,-h/2,860,h,40);c.fillStyle='#fff';c.fill();c.beginPath();c.arc(-360,-h/2+70,34,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(700,36,BODY);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(String(f.sub).replace('@','').charAt(0).toUpperCase(),-360,-h/2+72);c.textBaseline='alphabetic';c.textAlign='left';
  c.font=font(600,30,BODY);c.fillStyle='#6B6F78';c.fillText(f.sub+' adlı kullanıcının yorumu yanıtlanıyor',-306,-h/2+82);c.font=font(700,52,BODY);c.fillStyle='#14161C';ql.forEach((l,i)=>c.fillText(l,-370,-h/2+170+i*64));c.restore();
  c.font=font(800,96,BODY);const al=wrap(c,f.d1,900,4);al.forEach((l,i)=>{const p=eo(prog(t,1.4+i*.2,2+i*.2));c.globalAlpha=p;c.fillStyle='#fff';c.fillText(l,80,1100+i*112+(1-p)*30)});c.globalAlpha=1;
  c.fillStyle=f.a;c.fillRect(80,1100+al.length*112-40,220*eo(prog(t,2.2,2.8)),10);logoCorner(c,A,t,2.4,W-170,H-180,140)}},
{id:'s_vs',name:'Karşılaştırma',cat:'Sosyal',dur:8,isNew:true,
 def:{title:'Kiralamak mı, almak mı?',sub:'KİRALAMAK',d1:'ALMAK',d2:'Esneklik · Düşük başlangıç',d3:'Değer kazanır · Kira ödemezsin',cta:'Senin tercihin hangisi?',p:'#101218',a:'#5EEAD4'},
 labels:{title:'Soru',sub:'Sol seçenek',d1:'Sağ seçenek',d2:'Sol artılar (· ile ayır)',d3:'Sağ artılar (· ile ayır)',cta:'Alt çağrı'},
 tracks:[['Zemin',0,8,1],['Soru',.2,1.1],['Bölünme',.8,1.4],['VS',1.3,1.8],['Artılar',1.8,3.2],['Çağrı',3.6,4.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.18);c.textAlign='center';titleReveal(c,f.title,W/2,330,80,940,.2,t,'#fff','center',2);c.textAlign='left';
  const k=eio(prog(t,.8,1.4));c.fillStyle='rgba(255,255,255,.05)';c.fillRect(0,560,W/2-6,1100*k);c.fillStyle=mix(f.a,f.p,.82);c.fillRect(W/2+6,560,W/2,1100*k);
  [[f.sub,f.d2,W/4,'#fff'],[f.d1,f.d3,W*.75,f.a]].forEach(([h,list,x,col],i)=>{const e=eo(prog(t,1+i*.15,1.5+i*.15));c.globalAlpha=e;c.textAlign='center';c.font=font(900,96,COND);c.fillStyle=col;c.fillText(h,x,720);
   String(list).split('·').map(s=>s.trim()).filter(Boolean).forEach((s,j)=>{const q=eo(prog(t,1.8+j*.25+i*.12,2.3+j*.25+i*.12));c.globalAlpha=q;icon(c,'check',x,860+j*230,70,col,4,q);c.font=font(600,40,BODY);c.fillStyle='#fff';wrap(c,s,440,2).forEach((l,m)=>c.fillText(l,x,960+j*230+m*48))});c.textAlign='left'});c.globalAlpha=1;
  const v=clamp(eback(prog(t,1.3,1.8)),0,1.2);if(v>0){c.save();c.translate(W/2,1110);c.scale(v,v);c.beginPath();c.arc(0,0,82,0,Math.PI*2);c.fillStyle='#fff';c.fill();c.font=font(900,74,COND);c.fillStyle=f.p;c.textAlign='center';c.textBaseline='middle';c.fillText('VS',0,6);c.restore();c.textBaseline='alphabetic';c.textAlign='left'}
  const q=eo(prog(t,3.6,4.2));c.globalAlpha=q;pill(c,f.cta,W/2,H-150,'#fff',f.p,40);c.globalAlpha=1}},
{id:'s_bilgi',name:'Biliyor muydun?',cat:'Sosyal',dur:7,isNew:true,
 def:{title:'Güney cephe daireler kışın %30 daha az ısınma gideri çıkarır.',sub:'BİLİYOR MUYDUN?',d1:'Kaynak: örnek veri',d2:'',d3:'',cta:'',p:'#0F1B2D',a:'#FFB547'},
 labels:{title:'Bilgi',sub:'Üst etiket',d1:'Alt not'},max:{title:110},
 tracks:[['Zemin',0,7,1],['Soru işareti',.1,1],['Etiket',.6,1.1],['Bilgi',1,2.4],['Not',2.6,3.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);const s=clamp(eback(prog(t,.1,1)),0,1.15);c.save();c.translate(W-230,560);c.rotate(.12+Math.sin(t*1.5)*.03);c.scale(s,s);c.font=font(900,700,COND);c.textAlign='center';c.fillStyle=mix(f.a,f.p,.25);c.globalAlpha=.9;c.fillText('?',0,240);c.restore();c.globalAlpha=1;
  kick(c,f.sub,80,700,f.a,t,.6);c.font=font(800,84,BODY);wrap(c,f.title,900,6).forEach((l,i)=>{const p=eo(prog(t,1+i*.2,1.6+i*.2));c.globalAlpha=p;c.fillStyle='#fff';c.fillText(l,80,820+i*104+(1-p)*30)});c.globalAlpha=1;
  c.font=font(500,30,MONO);c.fillStyle='rgba(255,255,255,.5)';c.globalAlpha=eo(prog(t,2.6,3.2));c.fillText(f.d1,80,H-200);c.globalAlpha=1;logoCorner(c,A,t,2.6,W-160,H-210,130)}},
{id:'s_story',name:'Hikâye Kaydır',cat:'Sosyal',dur:6,isNew:true,
 def:{title:'Yeni ilanımızı gördünüz mü?',sub:'Detaylar için yukarı kaydırın',d1:'',d2:'',d3:'',cta:'',p:'#1F2A37',a:'#FFD166'},
 labels:{title:'Başlık',sub:'Kaydırma yazısı'},
 tracks:[['Görüntü',0,6,1],['Hikâye çubuğu',0,6],['Başlık',.4,1.3],['Ok',1.4,6]],
 draw(c,t,f,A){bg(c,f,A,t,6);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(.35,'rgba(0,0,0,0)');g.addColorStop(.65,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.75)');c.fillStyle=g;c.fillRect(0,0,W,H);
  [0,1,2].forEach(i=>{const x=40+i*((W-80)/3),w=(W-80)/3-12;rr(c,x,70,w,8,4);c.fillStyle='rgba(255,255,255,.35)';c.fill();const fl=i===0?1:i===1?prog(t,0,6):0;if(fl>0){rr(c,x,70,w*fl,8,4);c.fillStyle='#fff';c.fill()}});
  c.beginPath();c.arc(90,140,34,0,Math.PI*2);c.fillStyle='#fff';c.fill();if(A.logo){c.save();c.beginPath();c.arc(90,140,30,0,Math.PI*2);c.clip();fitLogo(c,A.logo,90,140,60,1);c.restore()}c.font=font(700,34,BODY);c.fillStyle='#fff';c.fillText('Sponsorlu değil · şimdi',140,152);
  titleReveal(c,f.title,80,1300,90,920,.4,t,'#fff',undefined,3);const b=Math.sin(t*4)*16;const e=eo(prog(t,1.4,2));c.globalAlpha=e;c.textAlign='center';c.strokeStyle=f.a;c.lineWidth=8;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(W/2-46,1680+b);c.lineTo(W/2,1636+b);c.lineTo(W/2+46,1680+b);c.stroke();c.lineCap='butt';
  c.font=font(700,40,BODY);c.fillStyle='#fff';c.fillText(f.sub,W/2,1760);c.globalAlpha=1;c.textAlign='left'}},
{id:'s_canli',name:'Canlı Yayın',cat:'Sosyal',dur:6,isNew:true,
 def:{title:'Şantiyeden canlı yayın',sub:'Perşembe · 20:00',d1:'CANLI',d2:'',d3:'',cta:'Bildirimleri aç',p:'#0B0B10',a:'#FF3B5C'},
 labels:{title:'Başlık',sub:'Zaman',d1:'Rozet',cta:'Çağrı'},
 tracks:[['Zemin',0,6,1],['Rozet',.2,.8],['Ses dalgası',.4,6],['Başlık',.8,1.7],['Zaman',1.5,2],['Çağrı',2.2,2.8]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.3);const e=eo(prog(t,.2,.8));c.globalAlpha=e;pill(c,'●  '+f.d1,W/2,480,f.a,'#fff',44);c.globalAlpha=1;
  const N=34;for(let i=0;i<N;i++){const x=80+i*((W-160)/N);const h=(40+Math.abs(Math.sin(t*5+i*.7)*Math.cos(t*2.3+i*.3))*220)*eo(prog(t,.4,1));c.fillStyle=i%3?mix(f.a,'#ffffff',.3):f.a;rr(c,x,820-h/2,(W-160)/N-8,h,10);c.fill()}
  c.textAlign='center';titleReveal(c,f.title,W/2,1120,92,940,.8,t,'#fff','center',2);c.textAlign='center';c.font=font(500,40,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,1.5,2));c.fillText(f.sub,W/2,1340);c.globalAlpha=1;
  const q=eo(prog(t,2.2,2.8));c.globalAlpha=q;pill(c,f.cta,W/2,H-260,'rgba(255,255,255,.12)','#fff',40);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,.4,W/2,220,130)}},
];

PACK3.push(
// ---------------- BİLGİ GRAFİKLERİ ----------------
{id:'b_pasta',name:'Halka Grafik',cat:'Bilgi',dur:7,isNew:true,
 def:{title:'Proje alan dağılımı',sub:'Yeşil alan · 60',d1:'Konut · 25',d2:'Sosyal tesis · 10',d3:'Yol · 5',cta:'',p:'#11161F',a:'#4ADE80'},
 labels:{title:'Başlık',sub:'Dilim 1 (ad · değer)',d1:'Dilim 2',d2:'Dilim 3',d3:'Dilim 4'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Halka',.8,2.6],['Toplam',1.6,2.6],['Açıklama',2.2,3.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);titleReveal(c,f.title,80,300,84,920,.2,t,'#fff',undefined,2);const items=[f.sub,f.d1,f.d2,f.d3].filter(Boolean).map(s=>{const p=String(s).split('·');return[p[0].trim(),numOf(p[1]||0)]});
  const tot=items.reduce((a,b)=>a+b[1],0)||1;const cols=[f.a,mix(f.a,'#ffffff',.45),mix(f.a,f.p,.45),'rgba(255,255,255,.35)'];const cx=W/2,cy=820,R=300;const k=eio(prog(t,.8,2.6));let a0=-Math.PI/2;
  c.lineWidth=110;c.lineCap='butt';items.forEach(([n,v],i)=>{const sw=Math.PI*2*v/tot;const end=Math.min(a0+sw,-Math.PI/2+Math.PI*2*k);if(end>a0){c.strokeStyle=cols[i%4];c.beginPath();c.arc(cx,cy,R,a0,end-.02);c.stroke()}a0+=sw});
  c.textAlign='center';c.font=font(900,170,COND);c.fillStyle='#fff';c.fillText('%'+Math.round(items[0][1]/tot*100*eio(prog(t,1.6,2.6))),cx,cy+50);c.font=font(600,36,BODY);c.fillStyle='rgba(255,255,255,.65)';c.fillText(items[0][0],cx,cy+110);c.textAlign='left';
  items.forEach(([n,v],i)=>{const e=eo(prog(t,2.2+i*.15,2.7+i*.15));c.globalAlpha=e;const y=1320+i*104;rr(c,90,y-28,44,44,12);c.fillStyle=cols[i%4];c.fill();c.font=font(600,44,BODY);c.fillStyle='#fff';c.fillText(n,160,y+8);c.font=font(500,40,MONO);c.textAlign='right';c.fillStyle='rgba(255,255,255,.7)';c.fillText('%'+Math.round(v/tot*100),W-90,y+8);c.textAlign='left'});c.globalAlpha=1;logoCorner(c,A,t,2.4,W-150,170)}},
{id:'b_cubuk',name:'Yatay Çubuklar',cat:'Bilgi',dur:7,isNew:true,
 def:{title:'Bölgede m² fiyatları',sub:'Kadıköy · 98',d1:'Ataşehir · 74',d2:'Üsküdar · 81',d3:'Maltepe · 62',cta:'Bin ₺ / m² · örnek veri',p:'#141824',a:'#FF8A3D'},
 labels:{title:'Başlık',sub:'Satır 1 (ad · değer)',d1:'Satır 2',d2:'Satır 3',d3:'Satır 4',cta:'Alt not'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Çubuklar',1,2.8],['Değerler',1,2.8],['Not',3,3.5]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);titleReveal(c,f.title,80,320,84,920,.2,t,'#fff',undefined,2);const it=[f.sub,f.d1,f.d2,f.d3].filter(Boolean).map(s=>{const p=String(s).split('·');return[p[0].trim(),numOf(p[1]||0)]});const mx=Math.max(...it.map(x=>x[1]),1);
  it.forEach(([n,v],i)=>{const y=640+i*250;const k=eio(prog(t,1+i*.2,2.2+i*.2));c.font=font(700,46,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,.8+i*.2,1.3+i*.2));c.fillText(n,80,y);c.globalAlpha=1;
   rr(c,80,y+30,W-160,70,35);c.fillStyle='rgba(255,255,255,.08)';c.fill();const w=Math.max(70,(W-160)*v/mx*k);rr(c,80,y+30,w,70,35);const top=v===mx;c.fillStyle=top?f.a:mix(f.a,f.p,.5);c.fill();
   c.font=font(900,56,COND);c.fillStyle=top?onColor(f.a):'#fff';c.textAlign='right';if(w>200)c.fillText(Math.round(v*k),80+w-30,y+86);c.textAlign='left'});
  c.font=font(500,30,MONO);c.fillStyle='rgba(255,255,255,.5)';c.globalAlpha=eo(prog(t,3,3.5));c.fillText(f.cta,80,H-180);c.globalAlpha=1;logoCorner(c,A,t,2.4,W-150,H-200,120)}},
{id:'b_cizgi',name:'Değer Grafiği',cat:'Bilgi',dur:8,isNew:true,
 def:{title:'5 yılda değer artışı',sub:'%148',d1:'2021,2022,2023,2024,2025,2026',d2:'40,52,61,78,90,99',d3:'',cta:'Örnek veri',p:'#0E1A1F',a:'#34D399'},
 labels:{title:'Başlık',sub:'Büyük rakam',d1:'Yıllar (virgülle)',d2:'Değerler (virgülle)',cta:'Alt not'},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1.1],['Izgara',.6,1.2],['Çizgi',1,3],['Noktalar',1,3],['Rakam',2.8,3.4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);titleReveal(c,f.title,80,300,84,920,.2,t,'#fff',undefined,2);const ys=String(f.d1).split(',').map(s=>s.trim());const vs=String(f.d2).split(',').map(Number).filter(x=>!isNaN(x));const n=Math.min(ys.length,vs.length);if(n<2)return;
  const gx=90,gy=620,gw=W-180,gh=760;const mn=Math.min(...vs)*.8,mxv=Math.max(...vs)*1.05;const P=vs.slice(0,n).map((v,i)=>[gx+gw*i/(n-1),gy+gh-(v-mn)/(mxv-mn)*gh]);
  c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=2;const ge=eo(prog(t,.6,1.2));for(let i=0;i<=4;i++){c.beginPath();c.moveTo(gx,gy+gh*i/4);c.lineTo(gx+gw*ge,gy+gh*i/4);c.stroke()}
  const k=eio(prog(t,1,3))*(n-1);const seg=Math.floor(k),fr=k-seg;const pts=P.slice(0,seg+1);if(seg<n-1)pts.push([lerp(P[seg][0],P[seg+1][0],fr),lerp(P[seg][1],P[seg+1][1],fr)]);
  const ag=c.createLinearGradient(0,gy,0,gy+gh);ag.addColorStop(0,mix(f.a,f.p,.4));ag.addColorStop(1,'rgba(0,0,0,0)');c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.lineTo(pts[pts.length-1][0],gy+gh);c.lineTo(gx,gy+gh);c.closePath();c.fillStyle=ag;c.globalAlpha=.6;c.fill();c.globalAlpha=1;
  c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=f.a;c.lineWidth=10;c.lineJoin='round';c.stroke();
  P.forEach(([x,y],i)=>{if(i>k+.01)return;c.beginPath();c.arc(x,y,16,0,Math.PI*2);c.fillStyle=f.p;c.fill();c.lineWidth=6;c.strokeStyle=f.a;c.stroke();c.font=font(500,28,MONO);c.fillStyle='rgba(255,255,255,.6)';c.textAlign='center';c.fillText(ys[i],x,gy+gh+60);c.textAlign='left'});
  const e=eback(prog(t,2.8,3.4));if(e>0){c.save();c.translate(W-90,560);c.scale(clamp(e,0,1.1),clamp(e,0,1.1));c.font=font(900,150,COND);c.textAlign='right';c.fillStyle=f.a;c.fillText(f.sub,0,0);c.restore();c.textAlign='left'}
  c.font=font(500,28,MONO);c.fillStyle='rgba(255,255,255,.45)';c.fillText(f.cta,80,H-150);logoCorner(c,A,t,3,W-150,H-170,120)}},
{id:'b_gauge',name:'Üçlü Gösterge',cat:'Bilgi',dur:7,isNew:true,
 def:{title:'Rakamlarla proje',sub:'Satıldı · 82',d1:'Tamamlandı · 64',d2:'Yeşil alan · 60',d3:'',cta:'',p:'#12141C',a:'#FFB547'},
 labels:{title:'Başlık',sub:'Gösterge 1 (ad · %)',d1:'Gösterge 2',d2:'Gösterge 3'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Gösterge 1',.9,2.4],['Gösterge 2',1.1,2.6],['Gösterge 3',1.3,2.8]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);c.textAlign='center';titleReveal(c,f.title,W/2,320,88,940,.2,t,'#fff','center',2);c.textAlign='left';
  [f.sub,f.d1,f.d2].filter(Boolean).forEach((s,i)=>{const p=String(s).split('·');const n=p[0].trim(),v=Math.min(100,numOf(p[1]||0));const cx=W/2,cy=640+i*430,R=150;const k=eio(prog(t,.9+i*.2,2.4+i*.2));
   c.lineWidth=34;c.lineCap='round';c.strokeStyle='rgba(255,255,255,.08)';c.beginPath();c.arc(cx-200,cy,R,Math.PI*.75,Math.PI*2.25);c.stroke();c.strokeStyle=i===0?f.a:mix(f.a,'#ffffff',.35*i);c.beginPath();c.arc(cx-200,cy,R,Math.PI*.75,Math.PI*.75+Math.PI*1.5*v/100*k+.001);c.stroke();c.lineCap='butt';
   c.font=font(900,110,COND);c.textAlign='center';c.fillStyle='#fff';c.fillText(Math.round(v*k),cx-200,cy+38);c.textAlign='left';c.font=font(700,56,BODY);c.globalAlpha=eo(prog(t,1.2+i*.2,1.8+i*.2));c.fillText(n,cx-10,cy-6);c.font=font(500,32,MONO);c.fillStyle=f.a;c.fillText('YÜZDE',cx-8,cy+46);c.globalAlpha=1});logoCorner(c,A,t,2.6,W/2,H-140,120)}},
{id:'b_zaman',name:'Yıllar Zaman Çizelgesi',cat:'Bilgi',dur:8,isNew:true,
 def:{title:'Yolculuğumuz',sub:'2008 · İlk proje',d1:'2014 · 1.000. daire',d2:'2020 · Mimarlık ofisi',d3:'2026 · ZodMotions',cta:'',p:'#121019',a:'#C084FC'},
 labels:{title:'Başlık',sub:'Durak 1 (yıl · olay)',d1:'Durak 2',d2:'Durak 3',d3:'Durak 4'},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1.1],['Çizgi',.8,3.6],['Duraklar',1,3.6]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);titleReveal(c,f.title,80,300,96,920,.2,t,'#fff');const it=[f.sub,f.d1,f.d2,f.d3].filter(Boolean).map(s=>{const p=String(s).split('·');return[p[0].trim(),(p[1]||'').trim()]});
  const x=W/2,y0=520,y1=1720;const k=eio(prog(t,.8,3.6));c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x-3,y0,6,y1-y0);const g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,f.a);g.addColorStop(1,mix(f.a,'#ffffff',.5));c.fillStyle=g;c.fillRect(x-3,y0,6,(y1-y0)*k);
  it.forEach(([yr,ev],i)=>{const y=y0+60+i*((y1-y0-120)/Math.max(1,it.length-1));const on=k*(y1-y0)>=y-y0-10;const e=eo(prog(t,1+i*.65,1.6+i*.65));const left=i%2===0;
   c.beginPath();c.arc(x,y,on?22:14,0,Math.PI*2);c.fillStyle=on?f.a:'#2B2836';c.fill();c.globalAlpha=e;c.textAlign=left?'right':'left';const tx=left?x-60:x+60;c.font=font(900,130,COND);c.fillStyle='#fff';c.fillText(yr,tx+(left?-1:1)*(1-e)*-60,y+20);
   c.font=font(600,40,BODY);c.fillStyle=f.a;wrap(c,ev,420,2).forEach((l,j)=>c.fillText(l,tx,y+80+j*48));c.textAlign='left';c.globalAlpha=1});logoCorner(c,A,t,3.4,W-150,170,120)}},
{id:'b_mesafe',name:'Mesafe Halkaları',cat:'Bilgi',dur:7,isNew:true,
 def:{title:'Merkezde yaşam',sub:'Metro · 400 m',d1:'Okul · 900 m',d2:'Hastane · 2 km',d3:'Havalimanı · 18 km',cta:'',p:'#0D1620',a:'#38BDF8'},
 labels:{title:'Başlık',sub:'Halka 1 (yer · mesafe)',d1:'Halka 2',d2:'Halka 3',d3:'Halka 4'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Merkez',.6,1.1],['Halkalar',.9,2.8],['Etiketler',1.2,3]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);c.textAlign='center';titleReveal(c,f.title,W/2,300,90,940,.2,t,'#fff','center',2);c.textAlign='left';
  const cx=W/2,cy=1040;const it=[f.sub,f.d1,f.d2,f.d3].filter(Boolean);it.forEach((s,i)=>{const R=140+i*120;const k=eio(prog(t,.9+i*.35,1.6+i*.35));c.strokeStyle=i===0?f.a:'rgba(255,255,255,.22)';c.lineWidth=i===0?5:3;c.setLineDash(i?[14,12]:[]);c.beginPath();c.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*k);c.stroke();c.setLineDash([]);
   const ang=-Math.PI/2+.7+i*1.25;const e=eo(prog(t,1.2+i*.35,1.8+i*.35));if(e>0){const px=cx+Math.cos(ang)*R,py=cy+Math.sin(ang)*R;c.beginPath();c.arc(px,py,14,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.globalAlpha=e;const p=String(s).split('·');c.font=font(700,36,BODY);const w=Math.max(c.measureText(p[0].trim()).width,180)+50;
    const bx=Math.min(W-60-w,Math.max(60,px+(Math.cos(ang)>0?30:-w-30)));glass(c,bx,py-64,w,128,24,.12);c.fillStyle='#fff';c.fillText(p[0].trim(),bx+24,py-12);c.font=font(500,30,MONO);c.fillStyle=f.a;c.fillText((p[1]||'').trim(),bx+24,py+36);c.globalAlpha=1}});
  const pe=clamp(eback(prog(t,.6,1.1)),0,1.2);c.save();c.translate(cx,cy);c.scale(pe,pe);c.beginPath();c.arc(0,0,64,0,Math.PI*2);c.fillStyle='#fff';c.fill();icon(c,'ev',0,-2,70,f.p,4);c.restore();logoCorner(c,A,t,2.6,W/2,H-150,120)}},
{id:'b_tablo',name:'Karşılaştırma Tablosu',cat:'Bilgi',dur:8,isNew:true,
 def:{title:'Tip A mı, Tip B mi?',sub:'Alan · 95 m² · 140 m²',d1:'Oda · 2+1 · 3+1',d2:'Balkon · 1 · 2',d3:'Cephe · Doğu · Güney',cta:'Size uygun olanı seçin',p:'#13161E',a:'#FACC15'},
 labels:{title:'Başlık',sub:'Satır 1 (özellik · A · B)',d1:'Satır 2',d2:'Satır 3',d3:'Satır 4',cta:'Alt çağrı'},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1.1],['Başlıklar',.9,1.4],['Satırlar',1.2,3.2],['Çağrı',3.6,4.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);titleReveal(c,f.title,80,320,90,920,.2,t,'#fff',undefined,2);const X=[80,520,800];
  const he=eo(prog(t,.9,1.4));c.globalAlpha=he;rr(c,X[2]-60,560,300,1000,36);c.fillStyle=mix(f.a,f.p,.85);c.fill();c.font=font(900,80,COND);c.textAlign='center';c.fillStyle='rgba(255,255,255,.7)';c.fillText('TİP A',X[1]+60,650);c.fillStyle=f.a;c.fillText('TİP B',X[2]+90,650);c.textAlign='left';c.globalAlpha=1;
  [f.sub,f.d1,f.d2,f.d3].filter(Boolean).forEach((s,i)=>{const p=String(s).split('·').map(x=>x.trim());const y=800+i*190;const e=eo(prog(t,1.2+i*.4,1.7+i*.4));c.globalAlpha=e;c.fillStyle='rgba(255,255,255,.1)';c.fillRect(80,y+60,W-160,2);
   c.font=font(500,32,MONO);c.fillStyle='rgba(255,255,255,.6)';c.fillText((p[0]||'').toUpperCase(),X[0],y);c.textAlign='center';c.font=font(700,52,BODY);c.fillStyle='#fff';c.fillText(p[1]||'',X[1]+60,y+6);c.fillStyle=f.a;c.font=font(800,56,BODY);c.fillText(p[2]||'',X[2]+90,y+6);c.textAlign='left'});c.globalAlpha=1;
  const q=eo(prog(t,3.6,4.2));c.globalAlpha=q;pill(c,f.cta,W/2,H-190,f.a,onColor(f.a),42);c.globalAlpha=1;logoCorner(c,A,t,.4,W-150,170,120)}},
{id:'b_dalga',name:'Dolan Yüzde',cat:'Bilgi',dur:7,isNew:true,
 def:{title:'Satışların',sub:'tamamlandı',d1:'87',d2:'',d3:'',cta:'Son daireler için acele edin',p:'#0B1626',a:'#38BDF8'},
 labels:{title:'Üst metin',sub:'Alt metin',d1:'Yüzde',cta:'Çağrı'},
 tracks:[['Zemin',0,7,1],['Daire',.2,.8],['Su dolumu',.6,3],['Yüzde',.6,3],['Çağrı',3.2,3.8]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);const v=Math.min(100,numOf(f.d1));const k=eio(prog(t,.6,3));const cx=W/2,cy=900,R=360;const s=eo(prog(t,.2,.8));
  c.textAlign='center';c.font=font(700,60,BODY);c.fillStyle='#fff';c.globalAlpha=s;c.fillText(f.title,cx,420);c.globalAlpha=1;c.save();c.beginPath();c.arc(cx,cy,R*s,0,Math.PI*2);c.clip();c.fillStyle='rgba(255,255,255,.06)';c.fillRect(0,0,W,H);
  const lvl=cy+R-2*R*v/100*k;[0,1].forEach(j=>{c.beginPath();c.moveTo(cx-R,H);for(let x=-R;x<=R;x+=10){c.lineTo(cx+x,lvl+Math.sin(x/60+t*3+j*2)*18*(1-j*.4))}c.lineTo(cx+R,H);c.closePath();c.fillStyle=j?f.a:mix(f.a,f.p,.45);c.fill()});
  c.font=font(900,250,COND);c.fillStyle='#fff';c.fillText('%'+Math.round(v*k),cx,cy+90);c.restore();c.strokeStyle=f.a;c.lineWidth=6;c.beginPath();c.arc(cx,cy,R*s+18,0,Math.PI*2);c.stroke();
  c.font=font(700,60,BODY);c.fillStyle='#fff';c.globalAlpha=s;c.fillText(f.sub,cx,cy+R+130);c.globalAlpha=1;const q=eo(prog(t,3.2,3.8));c.globalAlpha=q;pill(c,f.cta,W/2,H-200,'#fff',f.p,40);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,.4,W/2,200,120)}},
// ---------------- EMLAK ----------------
{id:'e_vitrin',name:'Fotoğraf Vitrini',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Göl Evleri',sub:'Sapanca · 3+1 müstakil',d1:'₺ 18.900.000',d2:'',d3:'',cta:'',p:'#1E2A22',a:'#E9C46A'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Fiyat'},
 tracks:[['Zemin',0,7,1],['Kart 1',.2,.9],['Kart 2',.4,1.1],['Kart 3',.6,1.3],['Başlık',1.4,2.2],['Fiyat',2.2,2.8]],
 draw(c,t,f,A){c.fillStyle=mix(f.p,'#000000',.35);c.fillRect(0,0,W,H);const cards=[[-.16,-250,40],[.14,250,60],[0,0,0]];cards.forEach(([rot,dx,dy],i)=>{const e=eback(prog(t,.2+i*.2,.9+i*.2));if(e<=0)return;c.save();c.translate(W/2+dx*clamp(e),780+dy);c.rotate(rot*clamp(e));c.scale(clamp(e,0,1.05),clamp(e,0,1.05));
   c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=60;c.shadowOffsetY=30;rr(c,-280,-380,560,760,28);c.fillStyle='#fff';c.fill();c.shadowColor='transparent';c.save();rr(c,-256,-356,512,712,18);c.clip();c.translate(-256,-356);c.scale(512/W,712/H);
   if(A.photo){const z=[1.6,1.3,1.05][i];c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,z+.05*t/7)}else scene(c,i===2?f.p:mix(f.p,f.a,.25*i),f.a,t+i*2,false);c.restore();c.restore()});
  titleReveal(c,f.title,80,1400,110,920,1.4,t,'#fff');c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.8)';c.globalAlpha=eo(prog(t,1.8,2.4));c.fillText(f.sub,80,1490);c.globalAlpha=1;
  const q=eo(prog(t,2.2,2.8));c.globalAlpha=q;pill(c,f.d1,80,1620,f.a,onColor(f.a),52,'left',44,118);c.globalAlpha=1;logoCorner(c,A,t,2.4,W-150,170,130)}},
{id:'e_etiket',name:'Sallanan Fiyat Etiketi',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Deniz manzaralı 2+1',sub:'Kuşadası · Sahile 200 m',d1:'₺ 7.250.000',d2:'',d3:'',cta:'',p:'#123047',a:'#FF7A59'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Fiyat'},
 tracks:[['Görüntü',0,7,1],['Etiket düşer',.3,1.4],['Sallanma',1.4,7],['Başlık',1.2,2],['Alt başlık',1.8,2.4]],
 draw(c,t,f,A){photoDark(c,f,A,t,7,.3);const drop=eback(prog(t,.3,1.4));const sw=Math.sin(t*2.6)*.18*Math.exp(-Math.max(0,t-1.2)*.55);const ax=W/2,ay=-20;c.save();c.translate(ax,ay+120*clamp(drop));c.rotate(sw);
  c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.moveTo(0,-200);c.lineTo(0,460);c.stroke();c.translate(0,460);c.font=font(700,92);const w=Math.max(620,c.measureText(f.d1).width+140);
  c.beginPath();c.moveTo(-w/2,40);c.lineTo(0,-50);c.lineTo(w/2,40);c.lineTo(w/2,340);c.lineTo(-w/2,340);c.closePath();c.fillStyle=f.a;c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=40;c.shadowOffsetY=20;c.fill();c.shadowColor='transparent';
  c.beginPath();c.arc(0,20,22,0,Math.PI*2);c.fillStyle=mix(f.a,'#000000',.4);c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.font=font(500,30,MONO);c.fillText('SATILIK',0,140);c.font=font(700,92);c.fillText(f.d1,0,260);c.restore();c.textAlign='left';
  titleReveal(c,f.title,80,1520,92,920,1.2,t,'#fff',undefined,2);c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.85)';c.globalAlpha=eo(prog(t,1.8,2.4));c.fillText(f.sub,80,1720);c.globalAlpha=1;logoCorner(c,A,t,2,W-150,H-180,130)}},
{id:'e_yeni',name:'Yeni İlan Kurdelesi',cat:'Emlak',dur:6,isNew:true,
 def:{title:'Nişantaşı\'nda tarihi bina',sub:'Restore edilmiş 4+1 · 220 m²',d1:'YENİ İLAN',d2:'',d3:'',cta:'',p:'#2A1E1A',a:'#E63946'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Kurdele yazısı'},
 tracks:[['Görüntü',0,6,1],['Kurdele',.2,1],['Başlık',1,1.8],['Alt başlık',1.6,2.2]],
 draw(c,t,f,A){photoDark(c,f,A,t,6,.15);const g=c.createLinearGradient(0,H*.55,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=g;c.fillRect(0,0,W,H);
  const k=eio(prog(t,.2,1));c.save();c.translate(W/2,560);c.rotate(-.32);c.fillStyle=f.a;c.fillRect(-1300+1300*k-650,-80,1300,160);c.font=font(900,110,COND);c.fillStyle='#fff';c.textAlign='center';setLS(c,6);const word=(String(f.d1)+'  ✦  ').repeat(4);c.save();c.beginPath();c.rect(-1300+1300*k-650,-80,1300,160);c.clip();c.fillText(word,-((t*120)%600),40);c.restore();setLS(c,0);c.restore();c.textAlign='left';
  titleReveal(c,f.title,80,1560,88,920,1,t,'#fff',undefined,2);c.font=font(600,44,BODY);c.fillStyle=mix(f.a,'#ffffff',.5);c.globalAlpha=eo(prog(t,1.6,2.2));c.fillText(f.sub,80,1760);c.globalAlpha=1;logoCorner(c,A,t,1.8,W-150,170,130)}},
{id:'e_ozet',name:'İlan Özeti',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Bahçeli dubleks',sub:'4+1',d1:'210 m²',d2:'Bahçe katı',d3:'2 yaşında',cta:'₺ 15.400.000',p:'#152620',a:'#9AE6B4'},
 labels:{title:'Başlık',sub:'Oda',d1:'Alan',d2:'Kat',d3:'Bina yaşı',cta:'Fiyat'},
 tracks:[['Görüntü',0,7,1],['Başlık',.2,1.1],['Bilgi kutuları',1,2.4],['Fiyat',2.6,3.2]],
 draw(c,t,f,A){bg(c,f,A,t,7);const g=c.createLinearGradient(0,H*.3,0,H);g.addColorStop(0,'rgba(0,0,0,.1)');g.addColorStop(1,'rgba(0,0,0,.9)');c.fillStyle=g;c.fillRect(0,0,W,H);titleReveal(c,f.title,80,900,96,920,.2,t,'#fff',undefined,2);
  [['oda',f.sub,'ODA'],['metre',f.d1,'ALAN'],['kat',f.d2,'KAT'],['yas',f.d3,'BİNA YAŞI']].forEach(([ic,v,l],i)=>{const col=i%2,row=Math.floor(i/2);const x=80+col*470,y=1060+row*250;const e=eback(prog(t,1+i*.18,1.6+i*.18));if(e<=0)return;c.save();c.translate(x+215,y+105);c.scale(clamp(e,0,1.05),clamp(e,0,1.05));c.translate(-215,-105);
   glass(c,0,0,430,210,30,.1);icon(c,ic,80,105,80,f.a,3.4);c.font=font(500,26,MONO);c.fillStyle='rgba(255,255,255,.6)';c.fillText(l,150,80);c.font=font(800,52,BODY);c.fillStyle='#fff';c.fillText(v,150,145);c.restore()});
  const q=eo(prog(t,2.6,3.2));c.globalAlpha=q;rr(c,80,1600,W-160,130,65);c.fillStyle=f.a;c.fill();c.font=font(800,66,BODY);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.cta,W/2,1690);c.textAlign='left';c.globalAlpha=1;logoCorner(c,A,t,.4,W-150,170,130)}},
{id:'e_anahtar',name:'Anahtar Teslim',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Anahtar teslim',sub:'Taşınmaya hazır, eşyasız 3+1',d1:'HEMEN OTURUMA',d2:'',d3:'',cta:'',p:'#1A1712',a:'#E0B860'},
 labels:{title:'Başlık',sub:'Alt başlık',d1:'Üst etiket'},
 tracks:[['Zemin',0,7,1],['Anahtar çizimi',.2,1.6],['Dönüş',1.6,2.4],['Işık',2.3,3],['Başlık',2.4,3.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.05,.22);const lt=prog(t,2.3,3);if(lt>0){const g=c.createRadialGradient(W/2,760,20,W/2,760,700);g.addColorStop(0,mix(f.a,'#ffffff',.35));g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=.5*lt;c.fillStyle=g;c.fillRect(0,0,W,H);c.globalAlpha=1}
  const r=eio(prog(t,1.6,2.4))*Math.PI/2;c.save();c.translate(W/2,760);c.rotate(-Math.PI/4+r);icon(c,'anahtar',0,0,520,f.a,2.4,eio(prog(t,.2,1.6)));c.restore();
  kick(c,f.d1,W/2,1180,f.a,t,2.2,'center');c.textAlign='center';const ay=titleReveal(c,f.title,W/2,1330,110,940,2.4,t,'#fff','center',2);c.textAlign='center';c.font=font(600,46,BODY);c.fillStyle='rgba(255,255,255,.8)';c.globalAlpha=eo(prog(t,3,3.6));c.fillText(f.sub,W/2,ay+20);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,3,W/2,H-170,140)}},
{id:'e_iletisim',name:'Danışman Kartı',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Deniz Kaya',sub:'Gayrimenkul danışmanı',d1:'0 532 000 00 00',d2:'info@lumenemlak.com',d3:'@lumenemlak',cta:'Size özel portföy için arayın',p:'#121621',a:'#F6C453'},
 labels:{title:'İsim',sub:'Unvan',d1:'Telefon',d2:'E-posta',d3:'Sosyal medya',cta:'Alt mesaj'},
 tracks:[['Zemin',0,7,1],['Portre',.1,.8],['İsim',.6,1.4],['Unvan',1.2,1.7],['İletişim',1.6,3],['Mesaj',3.2,3.8]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);const g=c.createRadialGradient(W/2,520,20,W/2,520,700);g.addColorStop(0,mix(f.a,f.p,.7));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  const s=clamp(eback(prog(t,.1,.8)),0,1.1);c.save();c.translate(W/2,520);c.scale(s,s);c.beginPath();c.arc(0,0,190,0,Math.PI*2);c.fillStyle=f.a;c.fill();if(A.photo){c.save();c.beginPath();c.arc(0,0,180,0,Math.PI*2);c.clip();c.translate(-180,-180-(H*360/W-360)/2);c.scale(360/W,360/W);cover(c,A.photo,1);c.restore()}else{c.font=font(700,150);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(String(f.title).split(' ').map(w=>w[0]).join('').slice(0,2),0,8)}c.restore();c.textAlign='left';c.textBaseline='alphabetic';
  c.textAlign='center';titleReveal(c,f.title,W/2,860,88,940,.6,t,'#fff','center',1);c.textAlign='center';c.font=font(500,32,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,1.2,1.7));c.fillText(String(f.sub).toUpperCase(),W/2,930);c.globalAlpha=1;c.textAlign='left';
  [['tel',f.d1],['mesaj',f.d2],['insta',f.d3]].filter(x=>x[1]).forEach(([ic,v],i)=>{const e=eo(prog(t,1.6+i*.3,2.2+i*.3));const y=1080+i*170;c.globalAlpha=e;c.save();c.translate((1-e)*80,0);glass(c,100,y,W-200,130,65,.07);c.beginPath();c.arc(170,y+65,44,0,Math.PI*2);c.fillStyle=f.a;c.fill();icon(c,ic,170,y+65,52,onColor(f.a),3.2);c.font=font(700,44,BODY);c.fillStyle='#fff';c.fillText(v,240,y+80);c.restore()});c.globalAlpha=1;
  c.textAlign='center';c.font=font(600,42,BODY);c.fillStyle='rgba(255,255,255,.75)';c.globalAlpha=eo(prog(t,3.2,3.8));c.fillText(f.cta,W/2,H-180);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,3.2,W-150,170,120)}},
{id:'e_gece',name:'Gece Işıkları',cat:'Emlak',dur:8,isNew:true,
 def:{title:'Geceleri bambaşka',sub:'Bodrum · Gündoğan villaları',d1:'',d2:'',d3:'',cta:'',p:'#0B1324',a:'#FFC46B'},
 labels:{title:'Başlık',sub:'Alt başlık'},
 tracks:[['Gece göğü',0,8,1],['Villa',0,1],['Işıklar',1,3.2],['Havuz yansıması',2.8,8],['Başlık',3.2,4]],
 draw(c,t,f,A){const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#04060D');g.addColorStop(.6,f.p);g.addColorStop(1,'#020308');c.fillStyle=g;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.25);for(let i=0;i<90;i++){c.globalAlpha=.3+.5*Math.abs(Math.sin(t+i));c.fillStyle='#fff';c.fillRect(sr(i)*W,sr(i+40)*H*.45,2.5,2.5)}c.globalAlpha=1;
  c.beginPath();c.arc(W*.8,620,70,0,Math.PI*2);c.fillStyle='#F3EFE2';c.fill();c.beginPath();c.arc(W*.8+26,604,64,0,Math.PI*2);c.fillStyle=g;c.fill();
  const body='#0A0E18';c.fillStyle=body;c.fillRect(120,1020,860,360);c.fillRect(380,840,600,200);c.fillRect(90,1010,920,18);c.fillRect(350,828,660,16);
  const W8=[[160,1080,180,240],[380,1080,240,240],[660,1080,280,240],[420,880,240,140],[700,880,240,140]];W8.forEach(([x,y,w,h],i)=>{const on=prog(t,1+i*.4,1.25+i*.4);if(on<=0)return;const gg=c.createLinearGradient(x,y,x,y+h);gg.addColorStop(0,mix(f.a,'#ffffff',.25));gg.addColorStop(1,f.a);c.globalAlpha=on*(.9+.1*Math.sin(t*3+i));c.fillStyle=gg;c.fillRect(x,y,w,h);
   const sp=c.createRadialGradient(x+w/2,y+h,10,x+w/2,y+h,360);sp.addColorStop(0,'rgba(255,190,110,.35)');sp.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sp;c.fillRect(x-300,y,w+600,500);c.globalAlpha=1});
  c.fillStyle='#071226';c.fillRect(0,1400,W,260);const pr=prog(t,2.8,3.6);if(pr>0){for(let k=0;k<14;k++){c.globalAlpha=pr*.25;c.fillStyle=f.a;c.fillRect(160+sr(k)*700+Math.sin(t*2+k)*20,1420+k*16,120+sr(k+3)*200,4)}c.globalAlpha=1}c.fillStyle='#03050A';c.fillRect(0,1660,W,H-1660);
  titleReveal(c,f.title,80,330,92,700,3.2,t,'#fff',undefined,2);c.font=font(600,40,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,3.8,4.4));c.fillText(f.sub,80,1780);c.globalAlpha=1;logoCorner(c,A,t,3.8,W-150,H-150,120)}},
{id:'e_kapi',name:'Kapı Açılışı',cat:'Emlak',dur:7,isNew:true,
 def:{title:'Hoş geldiniz',sub:'Yeni evinizin kapısı açılıyor',d1:'',d2:'',d3:'',cta:'',p:'#3B2A1E',a:'#E8C07D'},
 labels:{title:'Başlık',sub:'Alt başlık'},
 tracks:[['İç mekân',0,7,1],['Kapı kanatları',.6,2.2],['Işık',.9,2.4],['Başlık',2.2,3]],
 draw(c,t,f,A){bg(c,f,A,t,7);const k=eio(prog(t,.6,2.2));const lt=prog(t,.9,2.4);c.fillStyle=`rgba(255,220,160,${.35*(1-lt)})`;c.fillRect(0,0,W,H);
  const wood=c.createLinearGradient(0,0,W/2,0);wood.addColorStop(0,mix(f.p,'#000000',.2));wood.addColorStop(1,mix(f.p,'#ffffff',.08));[0,1].forEach(s=>{c.save();const pw=W/2*(1-k*.92);c.translate(s?W:0,0);c.fillStyle=wood;const x=s?-pw:0;c.fillRect(x,0,pw,H);
   c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=6;c.strokeRect(x+50*(1-k),180,pw-100*(1-k),640);c.strokeRect(x+50*(1-k),900,pw-100*(1-k),820);c.fillStyle=f.a;c.beginPath();c.arc(s?x+40:x+pw-40,H/2,16,0,Math.PI*2);c.fill();c.restore()});
  c.textAlign='center';titleReveal(c,f.title,W/2,H*.5,120,940,2.2,t,'#fff','center',2);c.textAlign='center';c.font=font(600,46,BODY);c.fillStyle='rgba(255,255,255,.9)';c.globalAlpha=eo(prog(t,2.8,3.4));c.fillText(f.sub,W/2,H*.5+110);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,3,W/2,H-170,140)}}
);

PACK3.push(
// ---------------- İNŞAAT ----------------
{id:'i_blok',name:'Kat Kat Yükselen',cat:'İnşaat',dur:8,isNew:true,
 def:{title:'Kat kat yükseliyoruz',sub:'Mavi Vadi · B Blok',d1:'14',d2:'',d3:'',cta:'',p:'#141B2A',a:'#FFB347'},
 labels:{title:'Başlık',sub:'Proje',d1:'Kat sayısı'},
 tracks:[['Zemin',0,8,1],['Temel',.2,.8],['Katlar',.6,3.4],['Sayaç',.6,3.4],['Başlık',3.2,4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);const n=Math.max(3,Math.min(22,numOf(f.d1)||14));const cx=W/2+120,base=1560;const tw=300,th=172,fh=58;
  const P=(x,y,h)=>[cx+x,base+y-h];const k=prog(t,.6,3.4)*n;
  c.globalAlpha=eo(prog(t,.2,.8));c.fillStyle='rgba(255,255,255,.08)';c.beginPath();c.moveTo(...P(0,-th/2-20,0));c.lineTo(...P(tw/2+40,0,0));c.lineTo(...P(0,th/2+20,0));c.lineTo(...P(-tw/2-40,0,0));c.closePath();c.fill();c.globalAlpha=1;
  for(let i=0;i<n;i++){const p=clamp(k-i);if(p<=0)break;const e=eback(p);const h=i*fh+(1-clamp(e,0,1.2))*-220;const yy=-h;const al=clamp(p*3);c.globalAlpha=al;
   const T=[cx,base-th/2+yy-fh],R=[cx+tw/2,base+yy-fh],B=[cx,base+th/2+yy-fh],L=[cx-tw/2,base+yy-fh];const poly=(pts,col)=>{c.beginPath();pts.forEach(([x,y],j)=>j?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=col;c.fill()};
   poly([L,B,[B[0],B[1]+fh],[L[0],L[1]+fh]],mix(f.p,'#ffffff',.2));poly([B,R,[R[0],R[1]+fh],[B[0],B[1]+fh]],mix(f.p,'#ffffff',.1));poly([T,R,B,L],mix(f.p,'#ffffff',.32));
   for(let w=0;w<4;w++){const fx=.12+w*.22;c.fillStyle=sr(i*4+w)>.35?f.a:'rgba(255,255,255,.12)';const ax=L[0]+(B[0]-L[0])*fx,ay=L[1]+(B[1]-L[1])*fx+16;c.beginPath();c.moveTo(ax,ay);c.lineTo(ax+22,ay+13);c.lineTo(ax+22,ay+40);c.lineTo(ax,ay+27);c.closePath();c.fill()}}c.globalAlpha=1;
  c.font=font(500,30,MONO);c.fillStyle=f.a;c.fillText('KAT',80,420);c.font=font(900,300,COND);c.fillStyle='#fff';c.fillText(String(Math.min(n,Math.floor(k))),70,700);
  titleReveal(c,f.title,80,1740,74,920,3.2,t,'#fff');c.font=font(600,38,BODY);c.fillStyle='rgba(255,255,255,.7)';c.globalAlpha=eo(prog(t,3.6,4.2));c.fillText(f.sub,80,1810);c.globalAlpha=1;logoCorner(c,A,t,.4,W-150,170,120)}},
{id:'i_iskele',name:'İskele Çizimi',cat:'İnşaat',dur:7,isNew:true,
 def:{title:'Cephe yenileme başladı',sub:'Moda Apartmanı · 6 hafta',d1:'',d2:'',d3:'',cta:'',p:'#1C1F26',a:'#FACC15'},
 labels:{title:'Başlık',sub:'Alt başlık'},
 tracks:[['Bina',0,7,1],['Dikmeler',.2,1.6],['Yataylar',.8,2.4],['Çaprazlar',1.6,3],['Başlık',3,3.8]],
 draw(c,t,f,A){c.fillStyle='#2A2E36';c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.5);else{c.fillStyle='#3A3F4A';c.fillRect(180,360,720,1300);for(let r=0;r<9;r++)for(let k=0;k<4;k++){c.fillStyle='#232730';c.fillRect(230+k*170,420+r*136,110,90)}}
  c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,0,W,H);const X=[140,320,500,680,860,940],Y=[];for(let y=1660;y>=320;y-=140)Y.push(y);c.lineCap='round';
  X.forEach((x,i)=>{const p=eio(prog(t,.2+i*.12,1.2+i*.12));c.strokeStyle=f.a;c.lineWidth=12;c.beginPath();c.moveTo(x,1700);c.lineTo(x,1700-1400*p);c.stroke()});
  Y.forEach((y,i)=>{const p=eio(prog(t,.8+i*.12,1.4+i*.12));c.strokeStyle=mix(f.a,'#ffffff',.25);c.lineWidth=8;c.beginPath();c.moveTo(140,y);c.lineTo(140+800*p,y);c.stroke();
   if(i<Y.length-1){const q=eio(prog(t,1.6+i*.1,2.2+i*.1));c.strokeStyle='rgba(250,204,21,.55)';c.lineWidth=5;for(let j=0;j<X.length-2;j++){const x0=X[j],x1=X[j+1];c.beginPath();c.moveTo(x0,y);c.lineTo(lerp(x0,x1,q),lerp(y,Y[i+1],q));c.stroke()}}});c.lineCap='butt';
  const g=c.createLinearGradient(0,H*.6,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=g;c.fillRect(0,H*.6,W,H*.4);titleReveal(c,f.title,80,1680,86,920,3,t,'#fff',undefined,2);c.font=font(600,40,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,3.6,4.2));c.fillText(f.sub,80,1820);c.globalAlpha=1;logoCorner(c,A,t,3.4,W-150,170,120)}},
{id:'i_guvenlik',name:'İş Güvenliği',cat:'İnşaat',dur:7,isNew:true,
 def:{title:'kazasız gün',sub:'Güvenlik bizim için öncelik',d1:'365',d2:'',d3:'',cta:'',p:'#1A1A12',a:'#FFD60A'},
 labels:{title:'Sayaç altı',sub:'Alt mesaj',d1:'Gün sayısı'},
 tracks:[['Zemin',0,7,1],['Şeritler',0,1],['Baret',.4,1.4],['Sayaç',.8,2.8],['Mesaj',2.6,3.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);const sk=eio(prog(t,0,1));[[0,140],[H-140,H]].forEach(([y0])=>{c.save();c.beginPath();c.rect(0,y0,W*sk,140);c.clip();c.fillStyle=f.a;c.fillRect(0,y0,W,140);c.fillStyle='#111';for(let x=-200+(t*80%160);x<W+200;x+=160){c.beginPath();c.moveTo(x,y0);c.lineTo(x+80,y0);c.lineTo(x,y0+140);c.lineTo(x-80,y0+140);c.closePath();c.fill()}c.restore()});
  const s=clamp(eback(prog(t,.4,1.4)),0,1.15);c.save();c.translate(W/2,600);c.scale(s,s);c.rotate(Math.sin(t*2)*.04);c.beginPath();c.moveTo(-230,90);c.bezierCurveTo(-230,-170,230,-170,230,90);c.closePath();c.fillStyle=f.a;c.fill();c.fillRect(-290,80,580,50);c.fillStyle='rgba(0,0,0,.18)';c.fillRect(-30,-150,60,230);c.restore();
  const n=numOf(f.d1);c.textAlign='center';c.font=font(900,330,COND);c.fillStyle='#fff';c.fillText(Math.round(n*eio(prog(t,.8,2.8))),W/2,1140);c.font=font(700,66,BODY);c.fillStyle=f.a;c.fillText(f.title,W/2,1240);
  c.font=font(600,46,BODY);c.fillStyle='rgba(255,255,255,.85)';c.globalAlpha=eo(prog(t,2.6,3.2));c.fillText(f.sub,W/2,1420);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.8,W/2,1600,140)}},
{id:'i_beton',name:'Beton Dökümü',cat:'İnşaat',dur:7,isNew:true,
 def:{title:'Temel betonu döküldü',sub:'C35 · 420 m³',d1:'100',d2:'',d3:'',cta:'',p:'#1F232B',a:'#A3A9B5'},
 labels:{title:'Başlık',sub:'Teknik bilgi',d1:'Yüzde'},
 tracks:[['Zemin',0,7,1],['Kalıp',.2,.8],['Döküm',.6,3],['Başlık',3,3.8]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);const x=120,y=460,w=W-240,h=900;c.globalAlpha=eo(prog(t,.2,.8));c.strokeStyle='#C2843A';c.lineWidth=24;c.strokeRect(x,y,w,h);for(let k=0;k<6;k++){c.fillStyle='#C2843A';c.fillRect(x-30,y+k*170,30,40)}c.globalAlpha=1;
  const v=Math.min(100,numOf(f.d1)||100);const k=eio(prog(t,.6,3))*v/100;const lvl=y+h-h*k;c.save();c.beginPath();c.rect(x+12,y+12,w-24,h-24);c.clip();c.beginPath();c.moveTo(x,y+h);for(let xx=x;xx<=x+w;xx+=12)c.lineTo(xx,lvl+Math.sin(xx/50+t*4)*10*(1-k*.6));c.lineTo(x+w,y+h);c.closePath();
  const g=c.createLinearGradient(0,lvl,0,y+h);g.addColorStop(0,mix(f.a,'#ffffff',.2));g.addColorStop(1,mix(f.a,'#000000',.35));c.fillStyle=g;c.fill();for(let i=0;i<160;i++){const py=lvl+sr(i)*(y+h-lvl);if(py<lvl)continue;c.fillStyle='rgba(0,0,0,.15)';c.fillRect(x+sr(i+9)*w,py,4,4)}c.restore();
  const sp=t>.6&&t<3?1:0;if(sp){c.fillStyle=mix(f.a,'#ffffff',.1);c.fillRect(W/2-30,0,60,lvl);}
  c.font=font(900,200,COND);c.textAlign='center';c.fillStyle='#fff';c.fillText('%'+Math.round(k*100),W/2,y+h/2+70);c.textAlign='left';titleReveal(c,f.title,80,1520,84,920,3,t,'#fff',undefined,2);c.font=font(500,36,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,3.6,4.2));c.fillText(f.sub,80,1720);c.globalAlpha=1;logoCorner(c,A,t,3.4,W-150,170,120)}},
{id:'i_gantt',name:'İş Programı',cat:'İnşaat',dur:8,isNew:true,
 def:{title:'İş programı',sub:'Kazı · 1 · 3',d1:'Kaba inşaat · 3 · 9',d2:'Cephe · 8 · 12',d3:'İnce işler · 10 · 15',cta:'Teslim: 15. ay',p:'#11151F',a:'#60A5FA'},
 labels:{title:'Başlık',sub:'İş 1 (ad · başlangıç ay · bitiş ay)',d1:'İş 2',d2:'İş 3',d3:'İş 4',cta:'Alt bilgi'},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1.1],['Takvim',.6,1.2],['Çubuklar',1,3.2],['Bugün çizgisi',3,3.6],['Alt bilgi',3.6,4.2]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.15);titleReveal(c,f.title,80,320,96,920,.2,t,'#fff');const it=[f.sub,f.d1,f.d2,f.d3].filter(Boolean).map(s=>{const p=String(s).split('·').map(x=>x.trim());return[p[0],numOf(p[1]),numOf(p[2])]});
  const mx=Math.max(...it.map(x=>x[2]),1);const gx=80,gw=W-160,gy=560;c.globalAlpha=eo(prog(t,.6,1.2));for(let m=0;m<=mx;m+=3){const x=gx+gw*m/mx;c.fillStyle='rgba(255,255,255,.08)';c.fillRect(x,gy,2,1000);c.font=font(500,26,MONO);c.fillStyle='rgba(255,255,255,.45)';c.fillText(m+'. ay',x+6,gy-16)}c.globalAlpha=1;
  it.forEach(([n,a,b],i)=>{const y=gy+60+i*240;const k=eio(prog(t,1+i*.4,1.8+i*.4));const x0=gx+gw*(a-0)/mx,x1=gx+gw*b/mx;c.font=font(700,44,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,.9+i*.4,1.4+i*.4));c.fillText(n,gx,y);c.globalAlpha=1;
   rr(c,x0,y+30,Math.max(40,(x1-x0)*k),80,40);c.fillStyle=i%2?mix(f.a,'#ffffff',.3):f.a;c.fill();if(k>.9){c.font=font(500,26,MONO);c.fillStyle=onColor(f.a);c.fillText(`${b-a} AY`,x0+24,y+82)}});
  const tl=eo(prog(t,3,3.6));if(tl>0){const x=gx+gw*.42;c.strokeStyle='#FF5C7A';c.lineWidth=4;c.setLineDash([12,10]);c.beginPath();c.moveTo(x,gy);c.lineTo(x,gy+1000*tl);c.stroke();c.setLineDash([]);pill(c,'BUGÜN',x,gy-60,'#FF5C7A','#fff',26,'center',22,52)}
  c.font=font(700,50,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,3.6,4.2));c.fillText(f.cta,80,H-160);c.globalAlpha=1;logoCorner(c,A,t,3.6,W-150,H-180,120)}},
{id:'i_teslim',name:'Teslim Edildi',cat:'İnşaat',dur:7,isNew:true,
 def:{title:'Mavi Vadi Konutları',sub:'240 aile yeni evine kavuştu',d1:'TESLİM EDİLDİ',d2:'24.10.2026',d3:'',cta:'',p:'#13241D',a:'#4ADE80'},
 labels:{title:'Proje',sub:'Alt mesaj',d1:'Mühür yazısı',d2:'Tarih'},
 tracks:[['Görüntü',0,7,1],['Başlık',.2,1.1],['Onay',1.1,1.8],['Mühür',1.6,2.3],['Mesaj',2.4,3]],
 draw(c,t,f,A){photoDark(c,f,A,t,7,.45);titleReveal(c,f.title,80,330,92,920,.2,t,'#fff',undefined,2);const s=clamp(eback(prog(t,1.1,1.8)),0,1.15);c.save();c.translate(W/2,850);c.scale(s,s);c.beginPath();c.arc(0,0,220,0,Math.PI*2);c.fillStyle=f.a;c.fill();icon(c,'check',0,0,300,onColor(f.a),5,eio(prog(t,1.4,2)));c.restore();
  const m=prog(t,1.6,2.3);if(m>0){c.save();c.translate(W/2,850);c.rotate(-t*.3);const R=300;c.font=font(700,40,BODY);c.fillStyle=f.a;c.globalAlpha=clamp(m*2);const txt=(String(f.d1)+' · '+String(f.d2)+' · ').repeat(2);for(let i=0;i<txt.length;i++){const a=i/txt.length*Math.PI*2*eio(m);c.save();c.rotate(a);c.translate(0,-R);c.fillText(txt[i],0,0);c.restore()}c.restore();c.globalAlpha=1}
  c.textAlign='center';c.font=font(700,56,BODY);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,2.4,3));wrap(c,f.sub,900,2).forEach((l,i)=>c.fillText(l,W/2,1340+i*70));c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.6,W/2,H-170,140)}},
// ---------------- MİMARİ ----------------
{id:'m_kesit',name:'Bina Kesiti',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Kesit A–A',sub:'Teras · +12.40',d1:'Yaşam katı · +6.20',d2:'Giriş · ±0.00',d3:'Otopark · -3.50',cta:'',p:'#0F1E2E',a:'#7DD3FC'},
 labels:{title:'Başlık',sub:'Kat 1 (ad · kot)',d1:'Kat 2',d2:'Kat 3',d3:'Kat 4'},
 tracks:[['Pafta',0,8,1],['Başlık',.2,1.1],['Döşemeler',.6,2.4],['Kot etiketleri',1.6,3.4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);c.strokeStyle='rgba(125,211,252,.06)';c.lineWidth=2;c.beginPath();for(let x=0;x<=W;x+=40){c.moveTo(x,0);c.lineTo(x,H)}for(let y=0;y<=H;y+=40){c.moveTo(0,y);c.lineTo(W,y)}c.stroke();
  titleReveal(c,f.title,80,300,90,920,.2,t,'#fff');const lv=[f.sub,f.d1,f.d2,f.d3].filter(Boolean);const ys=[520,820,1120,1460];const x0=120,x1=700;
  lv.forEach((s,i)=>{const y=ys[i];const p=eio(prog(t,.6+i*.35,1.2+i*.35));c.fillStyle=i===3?'rgba(125,211,252,.12)':'rgba(255,255,255,.06)';if(i<3)c.fillRect(x0,y,(x1-x0)*p,ys[i+1]-y);
   c.fillStyle='#fff';c.fillRect(x0,y,(x1-x0)*p,i===2?18:12);if(i<3){c.fillRect(x0,y,10,(ys[i+1]-y)*p);c.fillRect(x1-10,y,10,(ys[i+1]-y)*p)}
   if(i===2){c.strokeStyle='rgba(255,255,255,.4)';c.setLineDash([10,10]);c.beginPath();c.moveTo(60,y+18);c.lineTo(W-60,y+18);c.stroke();c.setLineDash([])}
   const e=eo(prog(t,1.6+i*.35,2.2+i*.35));c.globalAlpha=e;const pr=String(s).split('·');c.strokeStyle=f.a;c.lineWidth=3;c.beginPath();c.moveTo(x1+20,y);c.lineTo(x1+60,y);c.stroke();c.beginPath();c.moveTo(x1+40,y);c.lineTo(x1+28,y-18);c.lineTo(x1+52,y-18);c.closePath();c.fillStyle=f.a;c.fill();
   c.font=font(500,34,MONO);c.fillStyle=f.a;c.fillText((pr[1]||'').trim(),x1+80,y+12);c.font=font(600,34,BODY);c.fillStyle='#fff';c.fillText(pr[0].trim(),x1+80,y+60);c.globalAlpha=1});logoCorner(c,A,t,3,W-150,H-170,120)}},
{id:'m_gunes',name:'Güneş Analizi',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Gün boyu güneş',sub:'Güney cephe · yıllık 2.800 saat',d1:'',d2:'',d3:'',cta:'',p:'#16243A',a:'#FDBA4D'},
 labels:{title:'Başlık',sub:'Alt başlık'},
 tracks:[['Gökyüzü',0,8,1],['Güneş yolu',.4,1.4],['Güneş',1,5],['Gölge',1,5],['Başlık',.2,1.1]],
 draw(c,t,f,A){const k=eio(prog(t,1,5));const sky=c.createLinearGradient(0,0,0,H);sky.addColorStop(0,mix(f.p,'#7FB3E6',.5*Math.sin(Math.PI*k)));sky.addColorStop(1,f.p);c.fillStyle=sky;c.fillRect(0,0,W,H);
  const cx=W/2,cy=1320,R=440;c.strokeStyle='rgba(255,255,255,.3)';c.setLineDash([12,14]);c.lineWidth=3;c.beginPath();c.arc(cx,cy,R,Math.PI,Math.PI+Math.PI*eio(prog(t,.4,1.4)));c.stroke();c.setLineDash([]);
  const a=Math.PI+Math.PI*k;const sx=cx+Math.cos(a)*R,sy=cy+Math.sin(a)*R;const g=c.createRadialGradient(sx,sy,10,sx,sy,200);g.addColorStop(0,'rgba(253,186,77,.8)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);icon(c,'gunes',sx,sy,120,f.a,4);
  const hx=cx-140,hw=280,hy=1320;const len=200/Math.max(.25,Math.sin(Math.PI*k))-120;const dir=Math.cos(a)>0?-1:1;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.moveTo(hx+(dir<0?0:hw),hy);c.lineTo(hx+(dir<0?0:hw)+dir*Math.min(500,len),hy+30);c.lineTo(hx+(dir<0?hw:0)+dir*Math.min(500,len)*.2,hy+30);c.lineTo(hx+(dir<0?hw:0),hy);c.closePath();c.fill();
  c.fillStyle='#E8E4DA';c.fillRect(hx,hy-220,hw,220);c.beginPath();c.moveTo(hx-20,hy-220);c.lineTo(hx+hw/2,hy-330);c.lineTo(hx+hw+20,hy-220);c.closePath();c.fillStyle=f.a;c.fill();c.fillStyle=f.p;c.fillRect(hx+40,hy-160,80,80);c.fillRect(hx+170,hy-140,60,140);
  c.fillStyle='rgba(0,0,0,.4)';c.fillRect(0,hy,W,H-hy);c.font=font(500,30,MONO);c.fillStyle=f.a;c.textAlign='center';const hr=Math.round(6+12*k);c.fillText(String(hr).padStart(2,'0')+':00',W/2,hy+90);c.textAlign='left';
  const gy2=titleReveal(c,f.title,80,300,92,920,.2,t,'#fff');c.font=font(600,40,BODY);c.fillStyle='rgba(255,255,255,.8)';c.globalAlpha=eo(prog(t,.8,1.4));c.fillText(f.sub,80,gy2+10);c.globalAlpha=1;logoCorner(c,A,t,1,W-150,H-170,120)}},
{id:'m_tel',name:'Tel Kafes Bina',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Tasarımdan uygulamaya',sub:'3B modelleme · BIM',d1:'',d2:'',d3:'',cta:'',p:'#0A0F1A',a:'#5EEAD4'},
 labels:{title:'Başlık',sub:'Alt başlık'},
 tracks:[['Zemin',0,8,1],['Kenarlar',.2,2],['Dönüş',0,8],['Katlar',1.6,3],['Başlık',2.6,3.4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.12);const ang=t*.35+.4,cx=W/2,cy=980,s=300,hh=700;const pr=(x,y,z)=>{const X=x*Math.cos(ang)-z*Math.sin(ang),Z=x*Math.sin(ang)+z*Math.cos(ang);const d=1+Z/2400;return[cx+X/d,cy+y*.9/d+Z*.25]};
  const P=[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1]].map(([x,y,z])=>[x*s,y,z*s]);const E=[];[0,1,2,3].forEach(i=>{const a=P[i],b=P[(i+1)%4];E.push([a,b,0],[[...a.slice(0,1),-hh,a[2]],[...b.slice(0,1),-hh,b[2]],1],[a,[a[0],-hh,a[2]],2])});
  E.forEach(([a,b,kind],i)=>{const p=eio(prog(t,.2+i*.12,.8+i*.12));if(p<=0)return;const A0=pr(a[0],a[1],a[2]),B0=pr(lerp(a[0],b[0],p),lerp(a[1],b[1],p),lerp(a[2],b[2],p));c.strokeStyle=f.a;c.lineWidth=kind===2?4:5;c.shadowColor=f.a;c.shadowBlur=18;c.beginPath();c.moveTo(...A0);c.lineTo(...B0);c.stroke()});c.shadowBlur=0;
  const fl=eio(prog(t,1.6,3));for(let k=1;k<10;k++){if(k/10>fl)break;const y=-hh*k/10;c.strokeStyle='rgba(94,234,212,.3)';c.lineWidth=2;c.beginPath();P.forEach((q,i)=>{const pt=pr(q[0],y,q[2]);i?c.lineTo(...pt):c.moveTo(...pt)});c.closePath();c.stroke()}
  c.strokeStyle='rgba(94,234,212,.15)';for(let g=-3;g<=3;g++){let a=pr(g*s*.6,0,-3*s*.6),b=pr(g*s*.6,0,3*s*.6);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();a=pr(-3*s*.6,0,g*s*.6);b=pr(3*s*.6,0,g*s*.6);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()}
  titleReveal(c,f.title,80,1640,86,920,2.6,t,'#fff',undefined,2);c.font=font(500,34,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,3.2,3.8));c.fillText(String(f.sub).toUpperCase(),84,300);c.globalAlpha=1;logoCorner(c,A,t,3,W-150,H-170,120)}},
{id:'m_palet',name:'Renk Paleti',cat:'Mimari',dur:7,isNew:true,
 def:{title:'Projenin renkleri',sub:'#E9E4DA · Kireç beyazı',d1:'#B9A48A · Kum taşı',d2:'#6B7B6E · Adaçayı',d3:'#2E3A3F · Antrasit',cta:'',p:'#F5F2EC',a:'#2E3A3F'},
 labels:{title:'Başlık',sub:'Renk 1 (#kod · ad)',d1:'Renk 2',d2:'Renk 3',d3:'Renk 4'},
 tracks:[['Kâğıt',0,7,1],['Başlık',.2,1.1],['Renkler',.8,2.6],['Kodlar',1.6,3]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);titleReveal(c,f.title,80,320,92,920,.2,t,f.a);const it=[f.sub,f.d1,f.d2,f.d3].filter(Boolean).map(s=>{const p=String(s).split('·');return[p[0].trim(),(p[1]||'').trim()]});
  it.forEach(([hex,n],i)=>{const col=/^#[0-9a-f]{3,6}$/i.test(hex)?hex:'#999999';const y=500+i*330;const k=eio(prog(t,.8+i*.3,1.5+i*.3));const r=150;c.beginPath();c.arc(260,y+150,r*k,0,Math.PI*2);c.fillStyle=col;c.fill();c.strokeStyle='rgba(0,0,0,.08)';c.lineWidth=2;c.stroke();
   const e=eo(prog(t,1.6+i*.25,2.2+i*.25));c.globalAlpha=e;c.font=font(700,56,BODY);c.fillStyle=f.a;c.fillText(n,470+(1-e)*40,y+140);c.font=font(500,34,MONO);c.fillStyle='rgba(0,0,0,.5)';c.fillText(hex.toUpperCase(),472+(1-e)*40,y+196);c.globalAlpha=1});logoCorner(c,A,t,2.8,W-150,H-150,120)}},
{id:'m_not',name:'Mimar Notları',cat:'Mimari',dur:8,isNew:true,
 def:{title:'Neden bu cephe?',sub:'Gün ışığı',d1:'Doğal havalandırma',d2:'Mahremiyet',d3:'',cta:'',p:'#1B1F24',a:'#FF5A4E'},
 labels:{title:'Başlık',sub:'Not 1',d1:'Not 2',d2:'Not 3'},
 tracks:[['Fotoğraf',0,8,1],['Başlık',.2,1.1],['Daire 1',1,1.6],['Ok 1',1.4,2],['Daire 2',2,2.6],['Ok 2',2.4,3],['Daire 3',3,3.6]],
 draw(c,t,f,A){bg(c,f,A,t,8);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,0,W,H);titleReveal(c,f.title,80,260,90,920,.2,t,'#fff');const spots=[[300,820,150],[760,1060,130],[420,1360,140]];const notes=[f.sub,f.d1,f.d2];
  spots.forEach(([x,y,r],i)=>{if(!notes[i])return;const p=prog(t,1+i,1.6+i);if(p<=0)return;c.strokeStyle=f.a;c.lineWidth=8;c.lineCap='round';c.beginPath();c.ellipse(x,y,r,r*.8,-.2,-1.4,-1.4+Math.PI*2.1*eio(p));c.stroke();
   const q=eio(prog(t,1.4+i,2+i));const tx=i===1?170:Math.min(W-120,x+r+90),ty=y-r-80;c.beginPath();c.moveTo(x+(i===1?-r*.7:r*.7),y-r*.6);c.quadraticCurveTo((x+tx)/2,ty+30,lerp(x,tx,q),lerp(y-r*.6,ty+20,q));c.stroke();c.lineCap='butt';
   if(q>.8){c.save();c.translate(i===1?tx-20:tx-120,ty-30);c.rotate(-.04);c.font=font(700,52,DISP);c.fillStyle='#fff';c.shadowColor='rgba(0,0,0,.6)';c.shadowBlur=14;c.fillText(notes[i],0,0);c.restore()}});logoCorner(c,A,t,3.6,W-150,H-170,120)}},
{id:'m_modul',name:'Modüler Cephe',cat:'Mimari',dur:7,isNew:true,
 def:{title:'Modüler cephe sistemi',sub:'Cephe · Proje C',d1:'',d2:'',d3:'',cta:'',p:'#14161A',a:'#D6A35C'},
 labels:{title:'Başlık',sub:'Alt başlık'},
 tracks:[['Zemin',0,7,1],['Modüller',.2,2.6],['Vurgu',2.4,3],['Başlık',2.8,3.6]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);const cols=6,rows=10,gx=90,gy=260,cw=(W-180)/cols,ch=110;for(let r=0;r<rows;r++)for(let k=0;k<cols;k++){const i=r*cols+k;const d=sr(i)*1.6+r*.06;const p=eback(prog(t,.2+d,.7+d));if(p<=0)continue;const x=gx+k*cw,y=gy+r*ch;const type=Math.floor(sr(i+77)*4);
   c.save();c.translate(x+cw/2,y+ch/2);c.scale(clamp(p,0,1.1),clamp(p,0,1.1));c.fillStyle=type===0?f.a:type===1?mix(f.a,'#ffffff',.35):type===2?'#2A2E35':'#3C424B';rr(c,-cw/2+6,-ch/2+6,cw-12,ch-12,6);c.fill();
   if(type>1){c.fillStyle=`rgba(255,220,160,${.25+.2*Math.sin(t*2+i)})`;c.fillRect(-cw/2+20,-ch/2+18,cw-40,ch-36)}c.restore()}
  const g=c.createLinearGradient(0,H*.62,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,f.p);c.fillStyle=g;c.fillRect(0,H*.62,W,H*.38);titleReveal(c,f.title,80,1580,92,920,2.8,t,'#fff',undefined,2);kick(c,f.sub,84,1790,f.a,t,3.2);logoCorner(c,A,t,3,W-150,170,120)}},
// ---------------- AÇILIŞ / KAPANIŞ ----------------
{id:'a_parlama',name:'Parlayan Logo',cat:'Açılış',dur:6,isNew:true,
 def:{title:'MARKANIZ',sub:'SLOGANINIZ BURADA',d1:'',d2:'',d3:'',cta:'',p:'#0A0A0D',a:'#E8C07D'},
 labels:{title:'Marka',sub:'Alt satır'},
 tracks:[['Zemin',0,6,1],['Logo',.2,1.2],['Işık süpürmesi',1.2,2.2],['Alt satır',1.8,2.6]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);const g=c.createRadialGradient(W/2,H/2,20,W/2,H/2,700);g.addColorStop(0,mix(f.a,f.p,.82));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);const e=eo(prog(t,.2,1.2));
  const cy=H*.46;if(A.logo)fitLogo(c,A.logo,W/2,cy-120,320,e,.9+.1*e);const sz=fitFont(c,String(f.title),900,230,90,900,COND);c.font=font(900,sz,COND);c.textAlign='center';setLS(c,20*(1-e)+8);const ty=A.logo?cy+200:cy+sz*.3;
  const tg=c.createLinearGradient(W/2-450,0,W/2+450,0);tg.addColorStop(0,mix(f.a,'#000000',.3));tg.addColorStop(.5,mix(f.a,'#ffffff',.45));tg.addColorStop(1,mix(f.a,'#000000',.3));c.globalAlpha=e;c.fillStyle=tg;c.fillText(f.title,W/2,ty);
  const sw=prog(t,1.2,2.2);if(sw>0&&sw<1){const oc=this._oc||(this._oc=document.createElement('canvas'));oc.width=W;oc.height=H;const o=oc.getContext('2d');o.font=c.font;o.textAlign='center';if('letterSpacing' in o)o.letterSpacing=c.letterSpacing;o.fillStyle='#fff';o.fillText(f.title,W/2,ty);o.globalCompositeOperation='source-in';const x=lerp(-200,W+200,eio(sw));const sg=o.createLinearGradient(x-140,0,x+140,0);sg.addColorStop(0,'rgba(255,255,255,0)');sg.addColorStop(.5,'rgba(255,255,255,.95)');sg.addColorStop(1,'rgba(255,255,255,0)');o.fillStyle=sg;o.fillRect(0,0,W,H);c.save();c.setTransform(1,0,0,1,0,0);c.drawImage(oc,0,0,c.canvas.width,c.canvas.height);c.restore()}
  setLS(c,18);c.font=font(500,40,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,1.8,2.6));c.fillText(f.sub,W/2+9,ty+110);setLS(c,0);c.globalAlpha=1;c.textAlign='left'}},
{id:'a_parcacik',name:'Parçacık Toplanma',cat:'Açılış',dur:6,isNew:true,
 def:{title:'Z',sub:'ZodMotions',d1:'',d2:'',d3:'',cta:'',p:'#08090D',a:'#FFB547'},
 labels:{title:'Harf / kısa marka',sub:'Marka adı'},
 tracks:[['Zemin',0,6,1],['Parçacıklar',0,2.2],['Harf',1.8,2.6],['Marka adı',2.4,3]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(!this._pts||this._key!==f.title){const oc=document.createElement('canvas');oc.width=270;oc.height=480;const o=oc.getContext('2d');o.fillStyle='#fff';o.font=font(900,f.title.length>2?90:300,COND);o.textAlign='center';o.textBaseline='middle';o.fillText(f.title,135,220);const d=o.getImageData(0,0,270,480).data;const pts=[];for(let y=0;y<480;y+=5)for(let x=0;x<270;x+=5)if(d[(y*270+x)*4+3]>128)pts.push([x*4,y*4]);this._pts=pts.slice(0,900);this._key=f.title}
  const k=eio(prog(t,0,2.2));this._pts.forEach(([x,y],i)=>{const sx=sr(i)*W,sy=sr(i+500)*H;const px=lerp(sx,x,k)+Math.sin(t*2+i)*(1-k)*30,py=lerp(sy,y,k);c.fillStyle=i%5?f.a:'#fff';c.globalAlpha=.4+.6*k;c.beginPath();c.arc(px,py,k>.98?6:4,0,Math.PI*2);c.fill()});c.globalAlpha=1;
  const s=eo(prog(t,1.8,2.6));if(s>0){c.globalAlpha=s*.9;c.font=font(900,f.title.length>2?360:1200,COND);c.textAlign='center';c.textBaseline='middle';c.fillStyle=f.a;c.fillText(f.title,W/2,880);c.textBaseline='alphabetic';c.globalAlpha=1}
  c.textAlign='center';c.font=font(700,80);c.fillStyle='#fff';c.globalAlpha=eo(prog(t,2.4,3));c.fillText(f.sub,W/2,1520);c.globalAlpha=1;c.textAlign='left';if(A.logo)fitLogo(c,A.logo,W/2,1680,140,prog(t,2.6,3.2))}},
{id:'k_imza',name:'İmzalı Kapanış',cat:'Kapanış',dur:6,isNew:true,
 def:{title:'Adınız Soyadınız',sub:'Markanız',d1:'Teşekkürler.',d2:'',d3:'',cta:'',p:'#F3EFE7',a:'#1F2A44'},
 labels:{title:'İsim',sub:'Firma',d1:'Üst mesaj'},
 tracks:[['Kâğıt',0,6,1],['Mesaj',.2,.9],['İmza',.8,2.6],['Çizgi',2.4,3],['İsim ve firma',2.6,3.4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);c.textAlign='center';c.font=font(500,96,SERIF).replace('500','italic 500');c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.2,.9));c.fillText(f.d1,W/2,620);c.globalAlpha=1;
  const p=prog(t,.8,2.6);c.save();c.beginPath();c.rect(0,0,lerp(120,W-120,eio(p)),H);c.clip();c.font=font(500,150,SERIF).replace('500','italic 500');c.fillStyle=f.a;c.save();c.translate(W/2,980);c.rotate(-.06);c.fillText(f.title,0,0);c.restore();c.restore();
  c.fillStyle=f.a;const lw=eo(prog(t,2.4,3));c.fillRect(W/2-300*lw,1060,600*lw,3);c.font=font(700,46,BODY);c.globalAlpha=eo(prog(t,2.6,3.2));c.fillText(f.title,W/2,1160);c.font=font(500,32,MONO);c.fillStyle='rgba(31,42,68,.6)';c.fillText(String(f.sub).toUpperCase(),W/2,1220);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,3,W/2,1420,160)}},
{id:'k_kart',name:'İletişim Son Kartı',cat:'Kapanış',dur:6,isNew:true,
 def:{title:'Projeniz için konuşalım',sub:'markaniz.com',d1:'0 532 000 00 00',d2:'@markaniz',d3:'',cta:'',p:'#0E1016',a:'#FF8A5B'},
 labels:{title:'Başlık',sub:'Web sitesi',d1:'Telefon',d2:'Sosyal medya'},
 tracks:[['Zemin',0,6,1],['Logo',.1,.7],['Başlık',.5,1.4],['Satırlar',1.2,2.4]],
 draw(c,t,f,A){c.fillStyle=f.p;c.fillRect(0,0,W,H);if(A.photo)cover(c,A.photo,1.04,.2);const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,mix(f.a,f.p,.75));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H);
  if(A.logo)fitLogo(c,A.logo,W/2,420,220,prog(t,.1,.7));else{const s=clamp(eback(prog(t,.1,.7)),0,1.1);c.save();c.translate(W/2,420);c.scale(s,s);rr(c,-100,-100,200,200,52);c.fillStyle=f.a;c.fill();icon(c,'mesaj',0,0,120,onColor(f.a),4);c.restore()}
  c.textAlign='center';titleReveal(c,f.title,W/2,740,92,940,.5,t,'#fff','center',2);c.textAlign='left';[['web',f.sub],['tel',f.d1],['insta',f.d2]].filter(x=>x[1]).forEach(([ic,v],i)=>{const e=eo(prog(t,1.2+i*.3,1.8+i*.3));const y=1080+i*180;c.globalAlpha=e;
   c.save();c.translate(0,(1-e)*40);c.fillStyle='rgba(255,255,255,.1)';c.fillRect(140,y+70,W-280,2);icon(c,ic,190,y+10,64,f.a,3.4);c.font=font(700,52,BODY);c.fillStyle='#fff';c.fillText(v,260,y+28);c.restore()});c.globalAlpha=1}}
);
TEMPLATES.push(...PACK3);
// ===== Sektör içerikleri (örnek metinler; kullanıcı editörde değiştirir) =====
const SECTORS=[
{n:'Restoran & Kafe',p:['#2B1A12','#F4A259'],c:{
 duyuru:['YENİ MENÜ','Sonbahar menümüz hazır','Mevsimin en taze lezzetleri sofranızda','Rezervasyon için DM'],
 indirim:['%30','Öğle menüsünde indirim','Hafta içi 12:00 – 15:00','Hemen yer ayırt'],
 urun:['Trüflü Mantarlı Risotto','Taze parmesan ve tereyağıyla','₺ 420','Glutensiz','Şefin önerisi'],
 liste:['Bu hafta neler var?','Canlı caz akşamı','Brunch tabağı yenilendi','Ev yapımı limonata'],
 menu:['Kahve menüsü','Espresso · ₺ 75','Flat white · ₺ 110','Cold brew · ₺ 125'],
 yorum:['Kahveleri şehirdeki en iyisi, ortam da çok sıcak.','Selin A.','Müdavim'],
 rakam:['Rakamlarla mutfağımız','12000+ mutlu misafir','48 menü çeşidi','4.9 Google puanı'],
 etkinlik:['Şarap & Peynir Gecesi','15','KASIM','Moda şubesi · 20:00','Yerini ayırt'],
 kanca:['Bu tatlıyı hiç denediniz mi?','Fıstıklı katmer, sadece hafta sonu.'],
 geri:['Yeni şubemiz açılıyor','Kadıköy · 1 Aralık','YAKINDA'],
 marka:['CAFE LUNA','Her yudumda bir hikâye'],
 kapanis:['Afiyet olsun!','cafeluna.com','0 216 000 00 00','@cafeluna']}},
{n:'Güzellik & Kuaför',p:['#2A1622','#F2A7C3'],c:{
 duyuru:['YENİ HİZMET','Keratin bakım artık salonumuzda','Saçlarınıza ipeksi parlaklık','Randevu al'],
 indirim:['%25','İlk randevuya özel','Bu ay sonuna kadar','Hemen randevu al'],
 urun:['Profesyonel Cilt Bakımı','60 dakikalık ritüel','₺ 1.250','Kişiye özel','Doğal içerik'],
 liste:['Saçınız için 3 öneri','Sıcak suyla yıkamayın','Isı koruyucu kullanın','6 haftada bir uç kesimi'],
 menu:['Fiyat listesi','Fön · ₺ 350','Boya · ₺ 1.400','Manikür · ₺ 450'],
 yorum:['İlk kez saçımdan bu kadar memnun ayrıldım.','Deniz K.','Müşterimiz'],
 rakam:['Salonumuz','8000+ mutlu müşteri','15 uzman','10 yıllık tecrübe'],
 etkinlik:['Gelin Saçı Günleri','08','MART','Nişantaşı salon · 10:00','Ön kayıt yap'],
 kanca:['Saç boyanız neden çabuk soluyor?','Cevabı ürününüzde değil, suyunuzda olabilir.'],
 geri:['Yeni salonumuz açılıyor','Bebek · 20 Kasım','ÇOK YAKINDA'],
 marka:['STUDIO ROSE','Güzelliğiniz bizim işimiz'],
 kapanis:['Randevunuz bir mesaj uzağınızda','studiorose.com','0 212 000 00 00','@studiorose']}},
{n:'Moda & E-ticaret',p:['#111111','#E9D8A6'],c:{
 duyuru:['YENİ SEZON','Kış koleksiyonu yayında','Sınırlı stok, hızlı kargo','Hemen keşfet'],
 indirim:['%50','Efsane cuma başladı','Sadece 72 saat','Alışverişe başla'],
 urun:['Oversize Yün Kaban','Saf yün, astarlı','₺ 3.490','Ücretsiz kargo','30 gün iade'],
 liste:['Kombin önerisi','Krem triko kazak','Geniş paça pantolon','Deri loafer'],
 menu:['Haftanın fırsatları','Triko · ₺ 799','Jean · ₺ 1.099','Sneaker · ₺ 1.899'],
 yorum:['Kumaş kalitesi fotoğraftakinden bile güzel.','Ece T.','Doğrulanmış alıcı'],
 rakam:['Rakamlarla biz','50000+ sipariş','24 saatte kargo','%98 memnuniyet'],
 etkinlik:['Pop-up Mağaza','02','ARALIK','Zorlu Center · 11:00','Davetiyeni al'],
 kanca:['Bu kaban neden 3 günde tükendi?','Çünkü bu fiyata saf yün bir daha yok.'],
 geri:['Yeni koleksiyon','Cuma 20:00\'de yayında','GERİ SAYIM'],
 marka:['NORDE','Sade. Kaliteli. Senin.'],
 kapanis:['Alışveriş bir tık uzakta','norde.com.tr','0 850 000 00 00','@nordewear']}},
{n:'Spor & Fitness',p:['#0C1418','#C6FF3D'],c:{
 duyuru:['YENİ DERS','Sabah HIIT dersleri başladı','Her gün 07:00\'de, 45 dakika','Ücretsiz deneme'],
 indirim:['%40','Yıllık üyelikte indirim','Kampanya 30 Kasım\'da bitiyor','Hemen kaydol'],
 urun:['Kişisel Antrenör Paketi','12 seans, kişiye özel program','₺ 6.900','Beslenme planı','Ölçüm takibi'],
 liste:['Antrenmandan önce','Isınmayı atlamayın','Su için','Hedefinizi yazın'],
 menu:['Üyelik planları','Aylık · ₺ 1.900','3 aylık · ₺ 4.900','Yıllık · ₺ 14.900'],
 yorum:['Üç ayda hem güçlendim hem de spor alışkanlığı kazandım.','Burak Y.','Üyemiz'],
 rakam:['Salonumuz','1200+ aktif üye','35 grup dersi','7/24 açık'],
 etkinlik:['Açık Hava Koşusu','12','EKİM','Caddebostan sahil · 08:00','Ücretsiz katıl'],
 kanca:['Neden kilo veremiyorsun?','Belki sorun antrenman değil, uyku.'],
 geri:['Yeni şube açılıyor','Ataşehir · 1 Kasım','ÖN KAYIT'],
 marka:['PULSE GYM','Gücünü keşfet'],
 kapanis:['Bugün başla','pulsegym.com','0 216 000 00 00','@pulsegym']}},
{n:'Eğitim & Kurs',p:['#132036','#FFC857'],c:{
 duyuru:['KAYITLAR AÇILDI','İngilizce konuşma kulübü','Haftada 2 akşam, 8 kişilik gruplar','Seviye testine gir'],
 indirim:['%20','Erken kayıt indirimi','15 Kasım\'a kadar','Yerini ayırt'],
 urun:['Veri Analizi Eğitimi','8 hafta · canlı ders','₺ 7.500','Sertifikalı','Proje odaklı'],
 liste:['Verimli çalışmanın 3 yolu','25 dakika odak, 5 dakika mola','Telefonu başka odaya koy','Konuyu birine anlat'],
 menu:['Kurs programı','Başlangıç · 8 hafta','Orta · 10 hafta','İleri · 12 hafta'],
 yorum:['Altı ayda iş görüşmesini İngilizce yapabilir hale geldim.','Merve D.','Mezunumuz'],
 rakam:['Akademimiz','3000+ mezun','40 eğitmen','%92 memnuniyet'],
 etkinlik:['Ücretsiz Tanışma Dersi','09','KASIM','Online · 19:00','Kayıt ol'],
 kanca:['Kelime ezberlemek neden işe yaramıyor?','Çünkü kelimeyi cümlesiz öğreniyorsunuz.'],
 geri:['Yeni dönem başlıyor','Kayıtlar 1 Ocak\'ta','SON GÜNLER'],
 marka:['AKADEMİ PLUS','Öğrenmenin en kısa yolu'],
 kapanis:['Geleceğine yatırım yap','akademiplus.com','0 312 000 00 00','@akademiplus']}},
{n:'Otomotiv',p:['#101114','#FF3B30'],c:{
 duyuru:['YENİ GELDİ','2025 model SUV showroomda','Test sürüşü için randevu alın','Randevu al'],
 indirim:['%0','Faiz fırsatı','12 ay vade · Kasım sonuna kadar','Teklif al'],
 urun:['Kompakt SUV · Hibrit','Düşük yakıt, geniş bagaj','₺ 1.890.000','Hibrit motor','5 yıl garanti'],
 liste:['Kışa hazırlık','Lastik kontrolü','Antifriz seviyesi','Akü testi'],
 menu:['Servis fiyatları','Yağ bakımı · ₺ 2.900','Lastik değişimi · ₺ 650','Detaylı yıkama · ₺ 1.200'],
 yorum:['Satıştan servise kadar her şey çok profesyoneldi.','Kerem B.','Müşterimiz'],
 rakam:['Bayimiz','15000+ teslimat','25 yıl','4.8 müşteri puanı'],
 etkinlik:['Test Sürüşü Günleri','23','KASIM','Showroom · 10:00 – 18:00','Yerini ayırt'],
 kanca:['Kışın lastik basıncı neden düşer?','Soğuk havada hava büzüşür; ayda bir kontrol edin.'],
 geri:['Yeni model tanıtımı','Cumartesi 14:00','LANSMAN'],
 marka:['ROTA OTO','Yolun her anı'],
 kapanis:['Yol arkadaşınız burada','rotaoto.com','0 850 000 00 00','@rotaoto']}},
{n:'Sağlık & Klinik',p:['#0E2230','#5EEAD4'],c:{
 duyuru:['YENİ','Online randevu sistemi açıldı','Birkaç adımda randevunuzu alın','Randevu al'],
 indirim:['%15','Check-up paketlerinde','Kasım ayı boyunca','Bilgi al'],
 urun:['Diş Beyazlatma','Uzman hekim kontrolünde','₺ 3.500','Tek seans','Randevulu'],
 liste:['Randevuya gelirken','Kimliğinizi getirin','Önceki raporlarınızı alın','10 dakika erken gelin'],
 menu:['Çalışma saatleri','Hafta içi · 09:00 – 19:00','Cumartesi · 09:00 – 15:00','Pazar · Kapalı'],
 yorum:['Ekip çok ilgili, bekleme süresi neredeyse yoktu.','Ayşe M.','Danışanımız'],
 rakam:['Kliniğimiz','20+ uzman hekim','12 branş','7/24 iletişim'],
 etkinlik:['Ücretsiz Bilgilendirme Semineri','18','KASIM','Klinik salonu · 18:30','Katılım için yazın'],
 kanca:['Diş fırçanızı en son ne zaman değiştirdiniz?','Diş hekimleri 3 ayda bir öneriyor.'],
 geri:['Yeni şubemiz açılıyor','Beşiktaş · Aralık','YAKINDA'],
 marka:['MEDİKA KLİNİK','Sağlığınız için yanınızdayız'],
 kapanis:['Randevunuzu şimdi alın','medikaklinik.com','0 212 000 00 00','@medikaklinik']}},
{n:'Teknoloji & Uygulama',p:['#0B0F1F','#7C5CFF'],c:{
 duyuru:['YENİ ÖZELLİK','Uygulamamıza karanlık mod geldi','Hemen güncelleyin','Uygulamayı indir'],
 indirim:['%60','Pro plan yıllık indirimde','Sadece bu hafta','Pro\'ya geç'],
 urun:['Akıllı Bütçe Uygulaması','Harcamalarınızı otomatik takip edin','Ücretsiz','Banka entegrasyonu','Grafik raporlar'],
 liste:['3 adımda başla','Uygulamayı indir','Hesabını bağla','Hedefini belirle'],
 menu:['Planlar','Temel · Ücretsiz','Pro · ₺ 99 / ay','Takım · ₺ 299 / ay'],
 yorum:['Aylık harcamalarımı ilk kez gerçekten anlıyorum.','Can Ö.','Kullanıcımız'],
 rakam:['Uygulamamız','250000+ indirme','4.8 mağaza puanı','12 dil'],
 etkinlik:['Ürün Lansmanı','28','KASIM','Canlı yayın · 20:00','Hatırlatıcı kur'],
 kanca:['Paran ayın 20\'sinde neden bitiyor?','Çünkü küçük harcamaları kimse saymıyor.'],
 geri:['Yeni sürüm geliyor','v3.0 · 1 Aralık','BETA'],
 marka:['FLUXA','Akıllı yaşamın uygulaması'],
 kapanis:['Hemen ücretsiz dene','fluxa.app','App Store · Google Play','@fluxaapp']}},
{n:'Etkinlik & Düğün',p:['#1E1626','#E9C46A'],c:{
 duyuru:['2026 TARİHLERİ','Düğün sezonu rezervasyonları açıldı','Hayalinizdeki gün için yerinizi ayırtın','Tarih sor'],
 indirim:['%20','Kış düğünlerine özel','Ocak – Mart tarihleri','Teklif iste'],
 urun:['Kır Düğünü Paketi','200 kişiye kadar','₺ 450.000','Süsleme dahil','DJ ve ışık'],
 liste:['Düğün planlarken','Tarihi erken belirleyin','Bütçeyi baştan yazın','Plan B hazırlayın'],
 menu:['Paketler','Nikâh · ₺ 120.000','Kına · ₺ 180.000','Düğün · ₺ 450.000'],
 yorum:['Her detayı düşünmüşlerdi, biz sadece anın tadını çıkardık.','Zeynep & Emre','Çiftimiz'],
 rakam:['Bugüne kadar','600+ düğün','12 mekân','15 yıllık deneyim'],
 etkinlik:['Düğün Fuarı','07','ŞUBAT','Lütfi Kırdar · 11:00','Davetiyeni al'],
 kanca:['Düğün bütçesi neden hep aşılır?','Çünkü küçük kalemler en sona bırakılır.'],
 geri:['Büyük gün yaklaşıyor','Nikâh · 14 Şubat','SAVE THE DATE'],
 marka:['ATELİER EVENTS','Unutulmaz anlar tasarlıyoruz'],
 kapanis:['Hayalinizi konuşalım','atelierevents.com','0 532 000 00 00','@atelierevents']}},
{n:'Turizm & Otel',p:['#0C2A3A','#FFB703'],c:{
 duyuru:['ERKEN REZERVASYON','2026 yaz sezonu açıldı','Denize sıfır, her şey dahil','Hemen rezervasyon yap'],
 indirim:['%35','Erken rezervasyon indirimi','31 Ocak\'a kadar','Yerini ayırt'],
 urun:['Deniz Manzaralı Suit','2 yetişkin · kahvaltı dahil','₺ 8.900 / gece','Özel balkon','Spa erişimi'],
 liste:['Tatil öncesi kontrol','Pasaport tarihini kontrol edin','Transferi önceden ayarlayın','Güneş kremini unutmayın'],
 menu:['Oda tipleri','Standart · ₺ 4.200','Deluxe · ₺ 6.100','Suit · ₺ 8.900'],
 yorum:['Personel inanılmaz ilgiliydi, seneye yine geleceğiz.','Ahmet & Elif','Misafirimiz'],
 rakam:['Otelimiz','180 oda','3 restoran','400 m plaj'],
 etkinlik:['Yılbaşı Galası','31','ARALIK','Ana salon · 21:00','Yerini ayırt'],
 kanca:['Bodrum\'un en sakin koyu neresi?','Cevap, otelimizin tam önünde.'],
 geri:['Sezon açılıyor','1 Mayıs 2026','SON ODALAR'],
 marka:['AZURE BAY','Denizin en mavi hali'],
 kapanis:['Tatilinizi planlayalım','azurebay.com','0 252 000 00 00','@azurebayhotel']}},
{n:'Emlak & İnşaat',p:['#16202C','#F2A33A'],c:{
 duyuru:['YENİ PROJE','Ön satışlar başladı','Lansmana özel fiyatlar','Bilgi al'],
 indirim:['%10','Peşin alımlarda indirim','Sınırlı sayıda daire','Hemen ara'],
 urun:['Bahçeli 3+1 Daire','145 m² · güney cephe','₺ 9.750.000','Kapalı otopark','Akıllı ev'],
 liste:['Ev alırken sorun','Tapu durumu','Aidat tutarı','Teslim tarihi'],
 menu:['Daire tipleri','1+1 · 65 m²','2+1 · 95 m²','3+1 · 145 m²'],
 yorum:['Teslim tarihinden önce anahtarımızı aldık.','Murat & Aylin','Ev sahibi'],
 rakam:['Projemiz','240 daire','%60 yeşil alan','2027 teslim'],
 etkinlik:['Açık Ev Günü','26','EKİM','Örnek daire · 12:00 – 17:00','Yerini ayırt'],
 kanca:['Kira öder gibi ev sahibi olmak mümkün mü?','Uzun vadeli ödeme planıyla evet.'],
 geri:['Lansman günü','Cumartesi · 14:00','ÖN SATIŞ'],
 marka:['MAVİ VADİ','Doğayla iç içe yaşam'],
 kapanis:['Yeni evinizi konuşalım','mavivadi.com','0 216 000 00 00','@mavivadi']}},
{n:'Ajans & Kurumsal',p:['#0D0E12','#FF5C7A'],c:{
 duyuru:['YENİ HİZMET','Sosyal medya yönetimi','Strateji, içerik ve reklam tek elden','Teklif al'],
 indirim:['%20','İlk ay hizmet indirimi','Yeni müşterilere özel','Görüşme ayarla'],
 urun:['Marka Kimliği Paketi','Logo, renk ve yazı sistemi','₺ 45.000','3 konsept','Kullanım kılavuzu'],
 liste:['Markanız için 3 adım','Kime konuştuğunuzu bilin','Tek bir mesaj seçin','Tutarlı görünün'],
 menu:['Hizmetlerimiz','Sosyal medya · Aylık','Reklam yönetimi · Aylık','Video prodüksiyon · Proje'],
 yorum:['Takipçimiz değil, müşterimiz arttı. Fark bu.','Okan T.','Pazarlama müdürü'],
 rakam:['Ajansımız','120+ marka','2M+ aylık erişim','9 yıl'],
 etkinlik:['Ücretsiz Dijital Pazarlama Atölyesi','21','KASIM','Ofisimiz · 14:00','Kayıt ol'],
 kanca:['Reklamınız neden satış getirmiyor?','Çünkü ilk 3 saniyede kimse durmuyor.'],
 geri:['Yeni web sitemiz','Pazartesi yayında','YAKINDA'],
 marka:['KUZEY KREATİF','Markanızı harekete geçiriyoruz'],
 kapanis:['Projenizi konuşalım','kuzeykreatif.com','info@kuzeykreatif.com','@kuzeykreatif']}}
];

// ===== ZodMotions sektör motoru: 12 reklam kurgusu × stil kombinasyonları =====
const GPAL=[['Gece','#0D0E12','#FF5C7A'],['Altın','#14110B','#E8C07D'],['Okyanus','#0B1E2D','#38BDF8'],['Orman','#0F1F17','#7BD389'],['Lila','#17122A','#B794F4'],['Mercan','#1A1012','#FF7A59'],['Limon','#121410','#D4FF3D'],['Bordo','#2A0E14','#F6C1C7'],
 ['Kâğıt','#F2EEE6','#1F2A44'],['Krem','#F6F0E4','#C2410C'],['Buz','#EEF3F8','#2563EB'],['Pudra','#FCE7EF','#BE185D'],['Kum','#EFE6D8','#7C5A3A'],['Kar','#FAFAF7','#111111'],['Lacivert','#0F1B3D','#FFC857'],['Grafit','#1C1D21','#F5F5F0'],['Turkuaz','#06282A','#2DD4BF'],['Portakal','#FF6B1A','#111111'],['Güneş','#FFD60A','#111111'],['Kırmızı','#D7263D','#FFFFFF']];
const GBG=['solid','mesh','grid','stripes','rings','dots','photo','split'];
const GBGN={solid:'Düz',mesh:'Işık',grid:'Izgara',stripes:'Çizgili',rings:'Halka',dots:'Nokta',photo:'Fotoğraflı',split:'İki ton'};
const GANIM=['mask','slide','scale','blur','letter','type'];
const fgOf=bgc=>lum(bgc)>.45?'#15120C':'#F6F3EE';
const fgA=(bgc,a)=>lum(bgc)>.45?`rgba(21,18,12,${a})`:`rgba(246,243,238,${a})`;
function absScene(c,f,t){const p=f.p,a=f.a;const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,mix(p,a,.35));g.addColorStop(.6,mix(p,'#000000',.2));g.addColorStop(1,mix(p,'#000000',.5));c.fillStyle=g;c.fillRect(0,0,W,H);
 for(let i=0;i<12;i++){const x=sr(i)*W+Math.sin(t*.5+i)*40,y=sr(i+20)*H+Math.cos(t*.4+i)*40,r=80+sr(i+40)*260;const b=c.createRadialGradient(x,y,1,x,y,r);b.addColorStop(0,i%3?mix(a,'#ffffff',.3):a);b.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=.22+sr(i+60)*.2;c.fillStyle=b;c.fillRect(x-r,y-r,r*2,r*2)}c.globalAlpha=1;
 const L=c.createLinearGradient(0,0,W,H*.6);L.addColorStop(0,'rgba(255,255,255,0)');L.addColorStop(.5,'rgba(255,255,255,.08)');L.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=L;c.fillRect(0,0,W,H)}
function gBg(c,t,f,A,kind,dur,emlak){const p=f.p,a=f.a;c.fillStyle=p;c.fillRect(0,0,W,H);
 if(kind==='photo'){if(A.photo||emlak)bg(c,f,A,t,dur);else absScene(c,f,t);const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,.35)');g.addColorStop(.45,'rgba(0,0,0,.15)');g.addColorStop(1,'rgba(0,0,0,.85)');c.fillStyle=g;c.fillRect(0,0,W,H);return}
 if(A.photo)cover(c,A.photo,1.04+.04*t/dur,.2);
 if(kind==='mesh'){[[.2,.25,a,.5],[.85,.55,mix(a,'#ffffff',.3),.35],[.4,.85,mix(a,p,.4),.45]].forEach(([x,y,col,al],i)=>{const cx=W*x+Math.sin(t*.6+i*2)*90,cy=H*y+Math.cos(t*.5+i)*120;const g=c.createRadialGradient(cx,cy,10,cx,cy,620);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.globalAlpha=al;c.fillStyle=g;c.fillRect(0,0,W,H)});c.globalAlpha=1}
 else if(kind==='grid'){c.strokeStyle=fgA(p,.07);c.lineWidth=2;const o=(t*12)%60;c.beginPath();for(let x=-60+o;x<=W;x+=60){c.moveTo(x,0);c.lineTo(x,H)}for(let y=-60+o;y<=H;y+=60){c.moveTo(0,y);c.lineTo(W,y)}c.stroke()}
 else if(kind==='stripes'){c.save();c.translate(W/2,H/2);c.rotate(-Math.PI/5);c.fillStyle=mix(p,a,.1);const o=(t*70)%200;for(let x=-2200+o;x<2200;x+=200)c.fillRect(x,-1800,90,3600);c.restore()}
 else if(kind==='rings'){c.save();c.translate(W*.5,H*.42);for(let i=1;i<9;i++){c.rotate(t*.05*(i%2?1:-1));c.strokeStyle=i%3?fgA(p,.07):mix(a,p,.4);c.lineWidth=i%3?2:4;c.setLineDash(i%2?[20,18]:[]);c.beginPath();c.arc(0,0,i*130,0,Math.PI*2);c.stroke()}c.setLineDash([]);c.restore()}
 else if(kind==='dots'){for(let y=40;y<H;y+=60)for(let x=40;x<W;x+=60){const d=Math.hypot(x-W/2,y-H*.45);const s=2+3*Math.max(0,Math.sin(d/120-t*2.4));c.fillStyle=s>3.5?mix(a,p,.3):fgA(p,.12);c.beginPath();c.arc(x,y,s,0,Math.PI*2);c.fill()}}
 else if(kind==='split'){const k=eio(prog(t,0,1.2));c.fillStyle=mix(p,a,.16);c.beginPath();c.moveTo(0,H*(1-.55*k));c.lineTo(W,H*(1-.85*k));c.lineTo(W,H);c.lineTo(0,H);c.closePath();c.fill()}
 else{const g=c.createRadialGradient(W*.5,H*.3,10,W*.5,H*.3,1100);g.addColorStop(0,mix(p,a,.18));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,W,H)}
 if(lum(p)<.45)vign(c,.35)}
function hFont(st,size){return st.pair===1?font(900,size*1.3,COND):st.pair===2?font(500,size*1.1,SERIF).replace('500','italic 500'):st.pair===3?font(800,size,BODY):font(700,size,DISP)}
function hCase(st,s){return st.pair===1?String(s).toLocaleUpperCase('tr'):String(s)}
function gTxt(c,str,x,y,size,t0,t,st,col,o={}){const align=o.align||st.align;c.font=hFont(st,size);const s=hCase(st,str);{const mw=o.w||920;let ww=Math.max(...s.split(/\s+/).map(w=>c.measureText(w).width));while(ww>mw&&size>40){size=Math.floor(size*.92);c.font=hFont(st,size);ww=Math.max(...s.split(/\s+/).map(w=>c.measureText(w).width))}}const lines=wrap(c,s,o.w||920,o.l||3);const lh=(st.pair===1?size*1.3*.95:size*1.14);const mode=o.anim||st.anim;c.textAlign=align;c.textBaseline='alphabetic';
 const total=lines.join('').length;lines.forEach((ln,i)=>{const yy=y+i*lh;const p=eo(prog(t,t0+i*.13,t0+.7+i*.13));c.fillStyle=col;
  if(mode==='mask'){c.save();c.beginPath();c.rect(0,yy-lh*.92,W,lh*1.12);c.clip();c.fillText(ln,x,yy+(1-p)*lh);c.restore()}
  else if(mode==='slide'){c.globalAlpha=p;c.fillText(ln,x+(1-p)*(align==='center'?(i%2?140:-140):-160),yy);c.globalAlpha=1}
  else if(mode==='scale'){const k=clamp(eback(prog(t,t0+i*.13,t0+.6+i*.13)),0,1.15);c.save();c.translate(x,yy-lh*.35);c.scale(.6+.4*k,.6+.4*k);c.globalAlpha=clamp(k*1.5);c.fillText(ln,0,lh*.35);c.restore();c.globalAlpha=1}
  else if(mode==='blur'){if('filter' in c&&p<1)c.filter=`blur(${(1-p)*16}px)`;c.globalAlpha=p;c.fillText(ln,x,yy);c.filter='none';c.globalAlpha=1}
  else if(mode==='letter'){const w=c.measureText(ln).width;let cx=align==='center'?x-w/2:align==='right'?x-w:x;c.textAlign='left';[...ln].forEach((ch,j)=>{const q=eo(prog(t,t0+i*.15+j*.025,t0+.45+i*.15+j*.025));c.globalAlpha=q;c.fillText(ch,cx,yy+(1-q)*lh*.5);cx+=c.measureText(ch).width});c.globalAlpha=1;c.textAlign=align}
  else{const before=lines.slice(0,i).join('').length;const n=Math.floor(clamp((t-t0)/(total*.032))*total)-before;if(n>0){const part=ln.slice(0,n);c.fillText(part,x,yy);if(n<ln.length&&Math.floor(t*4)%2===0){const w=c.measureText(part).width;c.fillRect((align==='center'?x-c.measureText(ln).width/2:x)+w+4,yy-size*.8,5,size*.9)}}}});
 c.textAlign='left';return y+lines.length*lh}
function gSmall(c,str,x,y,size,t0,t,col,align,w=900,l=2,weight=600){c.font=font(weight,size,BODY);c.fillStyle=col;c.textAlign=align;const e=eo(prog(t,t0,t0+.6));c.globalAlpha=e;const L=wrap(c,str,w,l);L.forEach((s,i)=>c.fillText(s,x,y+i*size*1.3+(1-e)*24));c.globalAlpha=1;c.textAlign='left';return y+L.length*size*1.3}
function gPill(c,txt,x,y,t0,t,f,align,solid=true){const e=eo(prog(t,t0,t0+.6));if(e<=0||!txt)return;c.globalAlpha=e;const fg=fgOf(f.p);pill(c,txt,x,y+(1-e)*30,solid?f.a:fgA(f.p,.12),solid?onColor(f.a):fg,40,align==='center'?'center':'left');c.globalAlpha=1}
const AX=st=>st.align==='center'?W/2:80;
const ARCH={
duyuru:{n:'Duyuru',dur:6,map:(x)=>({d1:x[0],title:x[1],sub:x[2],cta:x[3]}),labels:{d1:'Üst etiket',title:'Başlık',sub:'Alt metin',cta:'Çağrı'},tracks:[['Zemin',0,6,1],['Etiket',.2,.8],['Başlık',.5,1.6],['Alt metin',1.4,2],['Çağrı',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p),x=AX(st);const e=eo(prog(t,.2,.8));c.globalAlpha=e;pill(c,f.d1,x,560,f.a,onColor(f.a),32,st.align==='center'?'center':'left',30,70);c.globalAlpha=1;
  const y=gTxt(c,f.title,x,760,104,.5,t,st,fg);c.fillStyle=f.a;const lw=220*eo(prog(t,1.2,1.8));c.fillRect(st.align==='center'?W/2-lw/2:80,y-30,lw,8);gSmall(c,f.sub,x,y+60,46,1.4,t,fgA(f.p,.8),st.align);gPill(c,f.cta,x,H-260,2.2,t,f,st.align)}},
indirim:{n:'İndirim',dur:6,map:x=>({d1:x[0],title:x[1],sub:x[2],cta:x[3]}),labels:{d1:'Büyük rakam',title:'Başlık',sub:'Tarih / koşul',cta:'Çağrı'},tracks:[['Zemin',0,6,1],['Başlık',.2,1.1],['Rakam',.5,1.3],['Tarih',1.4,2],['Çağrı',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.textAlign='center';gTxt(c,f.title,W/2,430,80,.2,t,st,fg,{align:'center',l:2});const sz=fitFont(c,String(f.d1),980,560,200);const s=clamp(eback(prog(t,.5,1.3)),0,1.2);c.save();c.translate(W/2,1080);c.scale(s,s);c.rotate((1-clamp(s))*-.2);c.font=font(900,sz,COND);c.textAlign='center';
  c.fillStyle=mix(f.a,f.p,.5);c.fillText(f.d1,14,14);c.fillStyle=f.a;c.fillText(f.d1,0,0);c.restore();gSmall(c,f.sub,W/2,1250,48,1.4,t,fgA(f.p,.85),'center');gPill(c,f.cta,W/2,H-280,2.2,t,f,'center');c.textAlign='left'}},
urun:{n:'Ürün Tanıtımı',dur:7,map:x=>({title:x[0],sub:x[1],d1:x[2],d2:x[3],d3:x[4]}),labels:{title:'Ürün / hizmet',sub:'Açıklama',d1:'Fiyat',d2:'Özellik 1',d3:'Özellik 2'},tracks:[['Zemin',0,7,1],['Görsel',.1,.9],['İsim',.8,1.7],['Açıklama',1.5,2.1],['Fiyat',1.9,2.5],['Özellikler',2.3,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.1,.9));const fw=840,fh=820,fx=(W-fw)/2,fy=170+(1-e)*80;c.globalAlpha=e;c.save();rr(c,fx,fy,fw,fh,48);c.clip();c.translate(fx,fy);c.scale(fw/W,fw/W);c.translate(0,-(H*fw/W-fh)/2*W/fw);if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.05+.05*t/7)}else if(this.sector==='Emlak & İnşaat')scene(c,mix(f.p,f.a,.3),f.a,t,false);else absScene(c,{p:mix(f.p,f.a,.25),a:f.a},t);c.restore();
  c.strokeStyle=fgA(f.p,.18);c.lineWidth=3;rr(c,fx,fy,fw,fh,48);c.stroke();c.globalAlpha=1;const x=AX(st);const y=gTxt(c,f.title,x,1130,78,.8,t,st,fg,{l:2});gSmall(c,f.sub,x,y+10,42,1.5,t,fgA(f.p,.75),st.align);
  const q=eo(prog(t,1.9,2.5));c.globalAlpha=q;c.font=font(800,84,BODY);c.fillStyle=f.a;c.textAlign=st.align;c.fillText(f.d1,x,1560);c.textAlign='left';c.globalAlpha=1;
  const ch=[f.d2,f.d3].filter(Boolean);c.font=font(600,36,BODY);const ws=ch.map(s=>c.measureText(s).width+60);let cx=st.align==='center'?W/2-(ws.reduce((a,b)=>a+b,0)+16*(ws.length-1))/2:80;ch.forEach((s,i)=>{const k=eo(prog(t,2.3+i*.15,2.8+i*.15));c.globalAlpha=k;rr(c,cx,1640,ws[i],74,37);c.strokeStyle=fgA(f.p,.3);c.lineWidth=2;c.stroke();c.fillStyle=fg;c.textBaseline='middle';c.fillText(s,cx+30,1678);c.textBaseline='alphabetic';cx+=ws[i]+16});c.globalAlpha=1}},
liste:{n:'3 Madde',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3]}),labels:{title:'Başlık',d1:'Madde 1',d2:'Madde 2',d3:'Madde 3'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.2],['Madde 1',1.2,1.8],['Madde 2',1.7,2.3],['Madde 3',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);gTxt(c,f.title,80,420,96,.2,t,st,fg,{align:'left',l:3});[f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const y=900+i*270;const e=eo(prog(t,1.2+i*.5,1.8+i*.5));c.globalAlpha=e;c.save();c.translate((1-e)*-100,0);
  c.fillStyle=fgA(f.p,.06);rr(c,70,y-110,W-140,210,36);c.fill();const k=clamp(eback(prog(t,1.3+i*.5,1.8+i*.5)),0,1.2);c.save();c.translate(170,y-5);c.scale(k,k);c.beginPath();c.arc(0,0,64,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(900,80,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(String(i+1),0,6);c.restore();c.textBaseline='alphabetic';c.textAlign='left';
  c.font=font(700,52,BODY);c.fillStyle=fg;const L=wrap(c,s,680,2);L.forEach((l,j)=>c.fillText(l,280,L.length>1?y-14+j*62:y+18));c.restore()});c.globalAlpha=1}},
menu:{n:'Fiyat Menüsü',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3]}),labels:{title:'Başlık',d1:'Satır 1 (ad · fiyat)',d2:'Satır 2',d3:'Satır 3'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.2],['Satırlar',1.1,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.textAlign='center';gTxt(c,f.title,W/2,520,100,.2,t,st,fg,{align:'center',l:2});const lw=eo(prog(t,.9,1.4));c.fillStyle=f.a;c.fillRect(W/2-120*lw,640,240*lw,6);
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const pr=String(s).split('·').map(x=>x.trim());const y=900+i*230;const e=eo(prog(t,1.1+i*.4,1.7+i*.4));c.globalAlpha=e;c.font=font(700,58,BODY);c.fillStyle=fg;c.textAlign='left';c.fillText(pr[0],90,y);const nw=c.measureText(pr[0]).width;
   c.font=font(800,58,BODY);c.textAlign='right';c.fillStyle=f.a;c.fillText(pr[1]||'',W-90,y);const pw=c.measureText(pr[1]||'').width;c.fillStyle=fgA(f.p,.35);const k=eio(prog(t,1.3+i*.4,1.9+i*.4));for(let x=110+nw;x<(W-110-pw)*k+(110+nw)*(1-k)&&x<W-110-pw;x+=24){c.beginPath();c.arc(x,y-14,4,0,Math.PI*2);c.fill()}c.textAlign='left'});c.globalAlpha=1;logoCorner(c,A,t,2.6,W/2,H-200,150)}},
yorum:{n:'Müşteri Yorumu',dur:7,map:x=>({title:x[0],sub:x[1],d1:x[2]}),labels:{title:'Yorum',sub:'İsim',d1:'Unvan'},max:{title:120},tracks:[['Zemin',0,7,1],['Tırnak',.1,.8],['Yorum',.5,2.6],['Yıldızlar',2.4,3.2],['İsim',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const q=clamp(eback(prog(t,.1,.8)),0,1.2);c.save();c.translate(st.align==='center'?W/2:150,560);c.scale(q,q);c.font=font(700,480,SERIF);c.fillStyle=f.a;c.textAlign='center';c.fillText('“',0,260);c.restore();c.textAlign='left';
  const x=AX(st);const y=gTxt(c,'"'+f.title+'"',x,860,70,.5,t,{...st,pair:st.pair===1?3:st.pair},fg,{l:6});for(let i=0;i<5;i++){const p=clamp(eback(prog(t,2.4+i*.1,2.8+i*.1)),0,1.2);if(p<=0)continue;const sx=(st.align==='center'?W/2-2*84:110)+i*84;c.save();c.translate(sx,y+50);c.scale(p,p);star(c,0,0,32);c.fillStyle=f.a;c.fill();c.restore()}
  gSmall(c,f.sub,x,y+200,50,3,t,fg,st.align,900,1,800);gSmall(c,f.d1,x,y+260,34,3.2,t,fgA(f.p,.6),st.align,900,1,600);logoCorner(c,A,t,3.2,W-150,H-170,120)}},
rakam:{n:'Rakamlarla',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3]}),labels:{title:'Başlık',d1:'Rakam 1 (sayı + açıklama)',d2:'Rakam 2',d3:'Rakam 3'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Rakam 1',.9,2.4],['Rakam 2',1.2,2.7],['Rakam 3',1.5,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x=AX(st);gTxt(c,f.title,x,360,86,.2,t,st,fg,{l:2});[f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const m=String(s).match(/^([^\d]*)([\d.,]+)([KMBkmb]?\+?%?)(?=\s|$)\s*(.*)$/);const y=760+i*380;const p=eo(prog(t,.9+i*.3,2.4+i*.3));
  c.globalAlpha=clamp(p*3);c.textAlign=st.align;if(m){const dec=/[.,]\d{1,2}$/.test(m[2])?1:0;const n=(dec?parseFloat(m[2].replace(',','.')):parseFloat(m[2].replace(/[.,]/g,'')))||0;const v=(n*p).toLocaleString('tr-TR',{maximumFractionDigits:dec,minimumFractionDigits:dec});c.font=font(900,210,COND);c.fillStyle=i===0?f.a:fg;c.fillText(m[1]+v+m[3],x,y);c.font=font(600,44,BODY);c.fillStyle=fgA(f.p,.7);c.fillText(m[4],x,y+70)}else{c.font=font(800,90,BODY);c.fillStyle=fg;c.fillText(s,x,y)}c.textAlign='left';c.globalAlpha=1});logoCorner(c,A,t,3,W-150,H-170,120)}},
etkinlik:{n:'Etkinlik',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],sub:x[3],cta:x[4]}),labels:{title:'Etkinlik adı',d1:'Gün',d2:'Ay',sub:'Yer · saat',cta:'Çağrı'},tracks:[['Zemin',0,7,1],['Takvim',.2,1],['Başlık',1,1.9],['Yer ve saat',1.8,2.4],['Çağrı',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const s=clamp(eback(prog(t,.2,1)),0,1.15);const cx=st.align==='center'?W/2:330;c.save();c.translate(cx,640);c.scale(s,s);c.rotate((1-clamp(s))*.2-.04);c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=50;c.shadowOffsetY=24;rr(c,-240,-280,480,560,40);c.fillStyle='#FBF8F2';c.fill();c.shadowColor='transparent';
  c.save();rr(c,-240,-280,480,560,40);c.clip();c.fillStyle=f.a;c.fillRect(-240,-280,480,130);c.restore();c.font=font(500,40,MONO);c.fillStyle=onColor(f.a);c.textAlign='center';setLS(c,6);c.fillText(String(f.d2).toUpperCase(),0,-196);setLS(c,0);c.font=font(900,330,COND);c.fillStyle='#16110E';c.fillText(f.d1,0,200);c.restore();c.textAlign='left';
  const x=AX(st);const y=gTxt(c,f.title,x,1100,90,1,t,st,fg,{l:2});gSmall(c,f.sub,x,y+20,46,1.8,t,f.a,st.align,900,2,700);gPill(c,f.cta,x,H-240,2.6,t,f,st.align)}},
kanca:{n:'Kanca Soru',dur:6,map:x=>({title:x[0],sub:x[1]}),labels:{title:'Soru / kanca',sub:'Cevap'},max:{title:80,sub:90},tracks:[['Zemin',0,6,1],['Soru',.2,1.6],['Cevap kutusu',2,2.6],['Cevap',2.2,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x=AX(st);c.font=font(500,30,MONO);c.fillStyle=f.a;c.textAlign=st.align;c.globalAlpha=eo(prog(t,.1,.6));setLS(c,6);c.fillText('SORU',x,520);setLS(c,0);c.globalAlpha=1;c.textAlign='left';const y=gTxt(c,f.title,x,660,100,.2,t,st,fg,{l:4});
  const e=eo(prog(t,2,2.6));if(e>0){c.font=font(700,54,BODY);const L=wrap(c,f.sub,820,3);const bh=L.length*70+90;const by=Math.max(y+60,1150);c.globalAlpha=e;c.save();c.translate(0,(1-e)*60);rr(c,80,by,W-160,bh,40);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);L.forEach((l,i)=>c.fillText(l,130,by+90+i*70));c.restore();c.globalAlpha=1}logoCorner(c,A,t,2.6,W-150,H-170,120)}},
geri:{n:'Geri Sayım',dur:6,map:x=>({title:x[0],sub:x[1],d1:x[2]}),labels:{title:'Başlık',sub:'Tarih',d1:'Rozet'},tracks:[['3',0,.6],['2',.6,1.2],['1',1.2,1.8],['Başlık',1.9,2.8],['Tarih',2.6,3.2],['Rozet',2.9,3.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.textAlign='center';if(t<1.8){const k=Math.floor(t/.6),lt=(t%.6)/.6;const s=1.5-.5*eo(clamp(lt*2));c.save();c.translate(W/2,H*.47);c.scale(s,s);c.globalAlpha=lt<.8?1:1-(lt-.8)/.2;c.font=font(900,620,COND);c.fillStyle=k===2?f.a:fg;c.textBaseline='middle';c.fillText(String(3-k),0,40);c.restore();c.globalAlpha=1;c.textBaseline='alphabetic';
  c.strokeStyle=f.a;c.lineWidth=12;c.beginPath();c.arc(W/2,H*.47,420,-Math.PI/2,-Math.PI/2+Math.PI*2*lt);c.stroke()}
  else{const e=eo(prog(t,2.9,3.4));if(e>0&&f.d1){c.globalAlpha=e;pill(c,f.d1,W/2,620,f.a,onColor(f.a),34,'center',34,76);c.globalAlpha=1}c.textAlign='center';const y=gTxt(c,f.title,W/2,840,110,1.9,t,st,fg,{align:'center',l:3});gSmall(c,f.sub,W/2,y+40,52,2.6,t,fgA(f.p,.85),'center',900,2,700)}c.textAlign='left';logoCorner(c,A,t,2.4,W/2,H-200,150)}},
marka:{n:'Marka Açılışı',dur:5,map:x=>({title:x[0],sub:x[1]}),labels:{title:'Marka adı',sub:'Slogan'},tracks:[['Zemin',0,5,1],['Simge',.1,.9],['Marka',.7,1.8],['Slogan',1.6,2.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cy=H*.4;const s=clamp(eback(prog(t,.1,.9)),0,1.15);c.save();c.translate(W/2,cy);c.scale(s,s);c.rotate((1-clamp(s))*-1);if(A.logo){fitLogo(c,A.logo,0,0,320,1)}else{rr(c,-130,-130,260,260,st.pair===2?130:60);c.fillStyle=f.a;c.fill();c.font=font(900,220,st.pair===2?SERIF:COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(String(f.title).trim().charAt(0),0,14)}c.restore();c.textBaseline='alphabetic';
  c.strokeStyle=f.a;c.lineWidth=4;c.beginPath();c.arc(W/2,cy,210,-Math.PI/2,-Math.PI/2+Math.PI*2*eio(prog(t,.3,1.4)));c.stroke();c.textAlign='center';const sz=fitFont(c,hCase(st,f.title),940,st.pair===1?150:110,50,900,COND);
  const my=gTxt(c,f.title,W/2,cy+400,st.pair===1?sz/1.3:Math.min(110,sz),.7,t,st,fg,{align:'center',l:2,w:960});gSmall(c,f.sub,W/2,Math.max(cy+560,my+50),46,1.6,t,f.a,'center',900,2,600)}},
kapanis:{n:'İletişim Kapanışı',dur:6,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3]}),labels:{title:'Başlık',d1:'Web',d2:'Telefon / e-posta',d3:'Sosyal medya'},tracks:[['Zemin',0,6,1],['Başlık',.2,1.2],['Web',1.1,1.6],['Telefon',1.4,1.9],['Sosyal',1.7,2.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);if(A.logo)fitLogo(c,A.logo,W/2,330,200,prog(t,.1,.7));c.textAlign='center';const y=gTxt(c,f.title,W/2,620,100,.2,t,st,fg,{align:'center',l:3});
  [['web',f.d1],['tel',f.d2],['insta',f.d3]].filter(x=>x[1]).forEach(([ic,v],i)=>{const e=eo(prog(t,1.1+i*.3,1.6+i*.3));const yy=Math.max(y+120,1060)+i*180;c.globalAlpha=e;c.save();c.translate((1-e)*-60,0);c.fillStyle=fgA(f.p,.07);rr(c,90,yy-70,W-180,140,70);c.fill();c.beginPath();c.arc(170,yy,46,0,Math.PI*2);c.fillStyle=f.a;c.fill();icon(c,ic,170,yy,54,onColor(f.a),3.4);c.font=font(700,46,BODY);c.fillStyle=fg;c.textAlign='left';c.fillText(v,245,yy+16);c.restore()});c.globalAlpha=1;c.textAlign='left'}}
};
const ARCH_KEYS=Object.keys(ARCH);
const GEN=[];(function(){let n=0;SECTORS.forEach((sec,si)=>{ARCH_KEYS.forEach((ak,ai)=>{const AR=ARCH[ak];const nv=(ak==='marka')?2:3;for(let v=0;v<nv;v++){
  const h=k=>Math.floor(sr(si*131+ai*17+v*7+k*3.7)*1e6);const bgk=GBG[(h(1)+v*3+ai)%GBG.length];const anim=GANIM[(h(2)+v*2+si)%GANIM.length];const pair=(h(3)+v+ai)%4;const align=(h(4)+v)%2?'center':'left';
  let pal=v===0?['Marka',sec.p[0],sec.p[1]]:GPAL[(h(5)+v*5+si*3)%GPAL.length];if(bgk==='photo'&&lum(pal[1])>.45)pal=GPAL[(h(6)+v)%8];const st={bg:bgk,anim,pair,align};const fields={...AR.map(sec.c[ak]),p:pal[1],a:pal[2]};
  ['title','sub','d1','d2','d3','cta'].forEach(k=>{if(fields[k]==null)fields[k]=''});n++;
  GEN.push({id:'g'+String(n).padStart(3,'0'),name:`${AR.n} · ${pal[0]} ${GBGN[bgk]}`,cat:AR.n,sector:sec.n,dur:AR.dur,isNew:false,def:fields,labels:AR.labels,max:AR.max,tracks:AR.tracks,st,
   draw(c,t,f,A){gBg(c,t,f,A,this.st.bg,this.dur,this.sector==='Emlak & İnşaat');AR.draw.call(this,c,t,f,A,this.st)}})}})})})();
GEN.splice(420);
TEMPLATES.push(...GEN);
// ===== Sektör içerikleri 2 (11 yeni kurgu). Sıra SECTORS ile aynı. =====
const C2=[
{kupon:['Kahve severlere','KAHVE20','%20','30 Kasım\'a kadar geçerli'],paket:['Brunch paketleri','Klasik · ₺ 390','Keyif · ₺ 590','Aile · ₺ 1.290'],hizmet:['Bizde neler var?','Kahvaltı','Brunch','Tatlılar','Paket servis'],surec:['Siparişin 4 adımda','Menüden seç','Uygulamadan öde','Hazırlanmasını izle','Kapında teslim al'],
 cekilis:['2 kişilik akşam yemeği kazan','Çekiliş 1 Aralık\'ta'],sss:['Rezervasyon gerekli mi?','Hafta sonu için öneriyoruz.','Vegan seçenek var mı?','Menümüzde 8 vegan tabak var.'],konum:['Bizi burada bulun','Moda Cad. No:12, Kadıköy','Moda sahiline 2 dk','Otopark mevcut'],
 ekip:['Şef Kerem Aydın','Mutfak şefi','Her tabakta mevsimin en tazesini kullanıyoruz.'],once:['Mekânımız yenilendi','Yeni dekor, aynı lezzet','ÖNCE','SONRA'],sosyal:['25000','takipçimize teşekkürler','4.9'],yeni:['MENÜDE YENİ','Fıstıklı San Sebastian','Sadece hafta sonu','Tadına bak']},
{kupon:['İlk randevuna özel','GUZEL15','%15','Bu ay boyunca geçerli'],paket:['Bakım paketleri','Temel · ₺ 750','Premium · ₺ 1.450','Gelin · ₺ 4.900'],hizmet:['Hizmetlerimiz','Saç tasarımı','Cilt bakımı','Manikür','Makyaj'],surec:['Randevu süreci','Hizmeti seç','Uzmanını belirle','Saatini ayır','Keyfini çıkar'],
 cekilis:['Ücretsiz bakım seansı kazan','Çekiliş 20 Kasım\'da'],sss:['Randevumu nasıl alırım?','Instagram\'dan DM ya da telefonla.','Ürünleriniz vegan mı?','Çoğu ürünümüz vegan ve cruelty free.'],konum:['Salonumuz','Abdi İpekçi Cad. No:24, Nişantaşı','Metroya 3 dk','Vale hizmeti var'],
 ekip:['Ayşe Kaya','Kurucu & saç tasarımcısı','Doğru kesim, yüzünüzü anlatır.'],once:['Dönüşüm','Tek seansta yenilen','ÖNCE','SONRA'],sosyal:['8000','mutlu müşteri','4.9'],yeni:['YENİ HİZMET','Kirpik lifting','45 dakikada doğal görünüm','Randevu al']},
{kupon:['Sepette ekstra indirim','KIS25','%25','Pazar gece yarısına kadar'],paket:['Kargo seçenekleri','Standart · Ücretsiz','Hızlı · ₺ 49','Aynı gün · ₺ 99'],hizmet:['Neden biz?','Hızlı kargo','Kolay iade','Güvenli ödeme','Canlı destek'],surec:['Siparişin yolculuğu','Sepete ekle','Güvenle öde','Aynı gün kargola','Kapında'],
 cekilis:['500 ₺ hediye çeki kazan','Çekiliş 5 Aralık\'ta'],sss:['İade süresi ne kadar?','30 gün içinde ücretsiz iade.','Kargo kaç günde gelir?','İstanbul içi 1, diğer iller 2–3 gün.'],konum:['Mağazamız','Bağdat Cad. No:310, Kadıköy','Suadiye\'ye 5 dk','Hafta sonu açık'],
 ekip:['Elif Demir','Kurucu & tasarımcı','Her parçayı yıllarca giyilsin diye tasarlıyoruz.'],once:['Kombin önerisi','Aynı parça, iki stil','GÜNDÜZ','GECE'],sosyal:['50000','mutlu müşteri','4.8'],yeni:['YENİ GELENLER','Kaşmir triko serisi','Sınırlı sayıda','Hemen keşfet']},
{kupon:['Arkadaşını getir','FIT2','%30','İkinize de geçerli'],paket:['Üyelikler','Aylık · ₺ 1.900','3 aylık · ₺ 4.900','Yıllık · ₺ 14.900'],hizmet:['Derslerimiz','Fitness','Pilates','Boks','Yoga'],surec:['İlk günün','Ücretsiz ölçüm','Program hazırlığı','Eğitmenle tanışma','İlk antrenman'],
 cekilis:['3 aylık üyelik kazan','Çekiliş 15 Kasım\'da'],sss:['Deneme dersi var mı?','Evet, ilk ders ücretsiz.','Duş ve dolap var mı?','Tüm üyelere dahil.'],konum:['Salonumuz','Ataşehir Bulvarı No:8','Metroya 1 dk','Ücretsiz otopark'],
 ekip:['Can Yılmaz','Baş antrenör','Gerçek değişim küçük alışkanlıklarla başlar.'],once:['12 haftalık değişim','Disiplin kazanır','1. HAFTA','12. HAFTA'],sosyal:['1200','aktif üye','4.9'],yeni:['YENİ DERS','Sabah mobility seansları','Her gün 07:30','Yerini ayırt']},
{kupon:['Erken kayıt kodu','ERKEN20','%20','15 Kasım\'a kadar'],paket:['Kurs paketleri','Grup · ₺ 4.500','Mini grup · ₺ 7.900','Birebir · ₺ 14.000'],hizmet:['Programlar','İngilizce','Yazılım','Tasarım','Sınav hazırlık'],surec:['Kayıt süreci','Seviye testi','Grubunu seç','Ödemeni yap','Derse başla'],
 cekilis:['Ücretsiz kurs bursu kazan','Çekiliş 10 Aralık\'ta'],sss:['Dersler online mı?','Hem online hem yüz yüze.','Sertifika veriliyor mu?','Her kurs sonunda sertifika.'],konum:['Kampüsümüz','Kızılay Meydanı No:5, Ankara','Metroya 2 dk','Kütüphane 7/24'],
 ekip:['Zeynep Arslan','İngilizce eğitmeni','Dil, ezberle değil konuşarak öğrenilir.'],once:['Öğrenci gelişimi','6 ayda fark','BAŞLANGIÇ','6. AY'],sosyal:['3000','mezun','4.9'],yeni:['YENİ PROGRAM','Yapay zekâ ile kodlama','8 hafta · canlı','Kayıt ol']},
{kupon:['Servis kampanyası','BAKIM15','%15','Kasım boyunca'],paket:['Bakım paketleri','Temel · ₺ 2.900','Kapsamlı · ₺ 5.400','Premium · ₺ 8.900'],hizmet:['Hizmetlerimiz','Satış','Servis','Ekspertiz','Kiralama'],surec:['Araç alım süreci','Modeli seç','Test sürüşü yap','Finansmanı belirle','Anahtarını al'],
 cekilis:['Ücretsiz detaylı yıkama kazan','Çekiliş 30 Kasım\'da'],sss:['Takas yapıyor musunuz?','Evet, aracınız yerinde değerlenir.','Garanti süresi ne kadar?','Yeni araçlarda 5 yıl.'],konum:['Showroomumuz','E-5 Yan Yol No:120, Kartal','Otoyola 2 dk','Hafta sonu açık'],
 ekip:['Murat Şen','Servis müdürü','Aracınıza kendi aracımız gibi bakıyoruz.'],once:['Detaylı bakım','Fark ortada','ÖNCE','SONRA'],sosyal:['15000','teslimat','4.8'],yeni:['SHOWROOMDA','Yeni elektrikli SUV','520 km menzil','Test sürüşü al']},
{kupon:['Check-up kampanyası','SAGLIK10','%10','Aralık sonuna kadar'],paket:['Check-up paketleri','Temel · ₺ 2.400','Kapsamlı · ₺ 4.900','Premium · ₺ 8.500'],hizmet:['Bölümlerimiz','Diş sağlığı','Göz','Dermatoloji','Beslenme'],surec:['Randevu süreci','Bölümü seç','Hekimi seç','Saati onayla','Muayeneye gel'],
 cekilis:['Ücretsiz diş taşı temizliği kazan','Çekiliş 25 Kasım\'da'],sss:['Anlaşmalı sigortalar?','Tüm büyük özel sigortalar.','Online sonuç alabilir miyim?','Evet, e-postanıza gönderilir.'],konum:['Kliniğimiz','Barbaros Bulvarı No:40, Beşiktaş','Metrobüse 3 dk','Engelsiz erişim'],
 ekip:['Dr. Selin Aksoy','Diş hekimi','Sağlıklı gülüş düzenli kontrolle başlar.'],once:['Yeni kliniğimiz','Daha geniş, daha konforlu','ESKİ','YENİ'],sosyal:['20000','danışan','4.9'],yeni:['YENİ BÖLÜM','Çocuk diş hekimliği','Hafta içi her gün','Randevu al']},
{kupon:['Pro\'ya geçiş kodu','PRO50','%50','İlk 3 ay'],paket:['Planlar','Temel · Ücretsiz','Pro · ₺ 99 / ay','Takım · ₺ 299 / ay'],hizmet:['Özellikler','Otomatik takip','Akıllı bütçe','Raporlar','Ortak hesap'],surec:['Kurulum','İndir','Kaydol','Bankanı bağla','Hedef belirle'],
 cekilis:['1 yıllık Pro üyelik kazan','Çekiliş 1 Aralık\'ta'],sss:['Verilerim güvende mi?','Uçtan uca şifreleme kullanıyoruz.','İptal edebilir miyim?','Tek tıkla, istediğin zaman.'],konum:['Ofisimiz','Teknopark İstanbul, Pendik','Marmaray\'a 5 dk','Ziyaretler randevulu'],
 ekip:['Deniz Öztürk','Kurucu & ürün lideri','Teknoloji hayatı kolaylaştırmalı.'],once:['Yeni arayüz','Daha sade, daha hızlı','v2','v3'],sosyal:['250000','indirme','4.8'],yeni:['YENİ ÖZELLİK','Ortak bütçe','Aileyle birlikte yönet','Hemen dene']},
{kupon:['Erken rezervasyon','DUGUN26','%15','31 Aralık\'a kadar'],paket:['Organizasyon paketleri','Nikâh · ₺ 120.000','Kına · ₺ 180.000','Düğün · ₺ 450.000'],hizmet:['Hizmetlerimiz','Mekân','Süsleme','Fotoğraf','Müzik'],surec:['Planlama süreci','Tanışma','Konsept','Prova','Büyük gün'],
 cekilis:['Ücretsiz nişan çekimi kazan','Çekiliş 14 Şubat\'ta'],sss:['Kaç ay önce başlamalıyız?','En az 6 ay önce öneriyoruz.','Kendi mekânımızı seçebilir miyiz?','Elbette, her mekâna geliyoruz.'],konum:['Atölyemiz','Bebek Sahil Yolu No:3','Boğaz manzaralı','Vale hizmeti'],
 ekip:['Ece Yıldız','Düğün planlamacısı','Sizin hikâyenizi anlatan bir gün kuruyoruz.'],once:['Mekân dönüşümü','Boş salondan masal gibi bir geceye','ÖNCE','SONRA'],sosyal:['600','düğün','5.0'],yeni:['2026 KONSEPTİ','Boho kır düğünü','Doğal, sade, zarif','Konsepti incele']},
{kupon:['Hafta sonu kaçamağı','TATIL20','%20','Kasım hafta sonları'],paket:['Konaklama','Oda + kahvaltı · ₺ 4.200','Yarım pansiyon · ₺ 5.600','Her şey dahil · ₺ 7.900'],hizmet:['Otelimizde','Spa','Özel plaj','Restoran','Çocuk kulübü'],surec:['Rezervasyon','Tarih seç','Oda seç','Ön ödeme yap','Tatile başla'],
 cekilis:['2 gece konaklama kazan','Çekiliş 20 Aralık\'ta'],sss:['Havalimanı transferi var mı?','Evet, ücretsiz transfer.','Evcil hayvan kabul ediyor musunuz?','Belirli odalarda evet.'],konum:['Otelimiz','Gündoğan Koyu, Bodrum','Havalimanına 35 dk','Denize sıfır'],
 ekip:['Ahmet Kara','Genel müdür','Misafirimiz değil, evimizin konuğusunuz.'],once:['Yenilenen odalar','Aynı manzara, yeni konfor','ESKİ','YENİ'],sosyal:['40000','mutlu misafir','4.8'],yeni:['YENİ AÇILDI','Çatı katı barı','Gün batımı manzaralı','Yerini ayırt']},
{kupon:['Lansmana özel','LANSMAN','%10','Peşin alımlarda'],paket:['Daire tipleri','2+1 · ₺ 6.900.000','3+1 · ₺ 9.750.000','4+1 · ₺ 13.400.000'],hizmet:['Sosyal alanlar','Havuz','Spor salonu','Çocuk parkı','Kapalı otopark'],surec:['Satın alma süreci','Daireyi seç','Ödeme planı','Sözleşme','Anahtar teslim'],
 cekilis:['Beyaz eşya seti kazan','Ön satış alıcılarına özel'],sss:['Teslim ne zaman?','Haziran 2027.','Kredi kullanabilir miyim?','Tüm bankalarla çalışıyoruz.'],konum:['Projemiz','Ataşehir, İstanbul','Metroya 4 dk','Okula 3 dk'],
 ekip:['Deniz Kaya','Proje danışmanı','Size uygun daireyi birlikte bulalım.'],once:['İnşaat ilerliyor','Temelden kaba inşaata','MART','EKİM'],sosyal:['240','mutlu aile','4.9'],yeni:['YENİ ETAP','C Blok satışta','Sınırlı sayıda daire','Bilgi al']},
{kupon:['Yeni müşteri kodu','AJANS20','%20','İlk ay hizmette'],paket:['Sosyal medya paketleri','Başlangıç · ₺ 15.000','Büyüme · ₺ 28.000','Kurumsal · ₺ 55.000'],hizmet:['Ne yapıyoruz?','Strateji','İçerik','Reklam','Video'],surec:['Çalışma şeklimiz','Keşif görüşmesi','Strateji','Üretim','Raporlama'],
 cekilis:['Ücretsiz marka analizi kazan','Her ay 3 işletmeye'],sss:['Sözleşme süresi ne kadar?','En az 3 ay öneriyoruz.','Reklam bütçesi dahil mi?','Hayır, ayrı planlanır.'],konum:['Ofisimiz','Maslak, İstanbul','Metroya 2 dk','Randevuyla ziyaret'],
 ekip:['Elif Şahin','Kurucu · Kuzey Kreatif','İyi reklam, ilk 3 saniyede başlar.'],once:['Marka yenileme','Eski logo, yeni kimlik','ESKİ','YENİ'],sosyal:['120','marka ile çalıştık','5.0'],yeni:['YENİ HİZMET','Yapay zekâ destekli video','Haftada 10 Reels','Teklif al']}
];

// ===== Sektör motoru 2: 11 yeni kurgu + süsleme ve okunurluk iyileştirmeleri =====
ICO.foto='M8 15 H16 L19 10 H29 L32 15 H40 V38 H8 Z M17 26 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0';ICO.kalp='M24 40 C10 30 6 22 6 16 A9 9 0 0 1 24 12 A9 9 0 0 1 42 16 C42 22 38 30 24 40 Z';ICO.hediye='M8 18 H40 V26 H8 Z M11 26 V42 H37 V26 M24 18 V42 M24 18 C20 10 12 10 14 16 C15 18 24 18 24 18 C24 18 33 18 34 16 C36 10 28 10 24 18';
function slot(c,x,y,w,h,f,A,t,dur,emlak){c.save();rr(c,x,y,w,h,40);c.clip();c.translate(x,y);const s=Math.max(w/W,h/H);c.scale(s,s);c.translate((w/s-W)/2,(h/s-H)/2);
 if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.05+.05*t/dur)}else if(emlak)scene(c,mix(f.p,f.a,.3),f.a,t,false);else{absScene(c,{p:mix(f.p,f.a,.28),a:f.a},t);icon(c,'foto',W/2,H/2,260,'rgba(255,255,255,.35)',2.2)}c.restore()}
function deco(c,t,f,kind){const col=mix(f.a,f.p,.25);c.save();c.globalAlpha=.85*eo(prog(t,.3,1));
 if(kind===1){c.strokeStyle=col;c.lineWidth=5;const L=70,m=56;[[m,m,1,1],[W-m,m,-1,1],[m,H-m,1,-1],[W-m,H-m,-1,-1]].forEach(([x,y,sx,sy])=>{c.beginPath();c.moveTo(x,y+sy*L);c.lineTo(x,y);c.lineTo(x+sx*L,y);c.stroke()})}
 else if(kind===2){[[W-120,170,30],[110,H-260,18],[W-200,H-420,14]].forEach(([x,y,r],i)=>{c.save();c.translate(x,y+Math.sin(t*1.5+i)*10);c.rotate(t*.6+i);c.fillStyle=col;c.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4,rr2=k%2?r*.28:r;c.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}c.closePath();c.fill();c.restore()})}
 else if(kind===3){c.strokeStyle=fgA(f.p,.18);c.lineWidth=2;c.strokeRect(36,36,W-72,H-72);c.font=font(500,22,MONO);c.fillStyle=fgA(f.p,.45);setLS(c,4);c.fillText('ZODMOTIONS',60,H-56);c.textAlign='right';c.fillText(String(Math.floor(t*30)).padStart(4,'0'),W-60,H-56);c.textAlign='left';setLS(c,0)}
 c.restore()}
const ARCH2={
kupon:{n:'Kupon Kodu',dur:6,map:x=>({title:x[0],d1:x[1],d2:x[2],sub:x[3]}),labels:{title:'Başlık',d1:'Kupon kodu',d2:'İndirim',sub:'Geçerlilik'},tracks:[['Zemin',0,6,1],['Bilet',.2,1],['Başlık',.6,1.4],['İndirim',1,1.6],['Kod',1.6,2.2],['Geçerlilik',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eback(prog(t,.2,1));const cx=W/2,y0=380,w=880,h=1000;c.save();c.translate(cx,y0+h/2+(1-clamp(e))*500);c.rotate((1-clamp(e))*.25-.02);c.translate(-cx,-(y0+h/2));
  c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=50;c.shadowOffsetY=24;c.beginPath();const x0=cx-w/2,nY=y0+h*.62,r=46;c.moveTo(x0+40,y0);c.lineTo(x0+w-40,y0);c.arcTo(x0+w,y0,x0+w,y0+40,40);c.lineTo(x0+w,nY-r);c.arc(x0+w,nY,r,-Math.PI/2,Math.PI/2,true);c.lineTo(x0+w,y0+h-40);c.arcTo(x0+w,y0+h,x0+w-40,y0+h,40);c.lineTo(x0+40,y0+h);c.arcTo(x0,y0+h,x0,y0+h-40,40);c.lineTo(x0,nY+r);c.arc(x0,nY,r,Math.PI/2,-Math.PI/2,true);c.lineTo(x0,y0+40);c.arcTo(x0,y0,x0+40,y0,40);c.closePath();
  c.fillStyle=lum(f.p)>.45?'#15120C':'#FBF8F2';c.fill();c.shadowColor='transparent';const tc=lum(f.p)>.45?'#FBF8F2':'#15120C';const ka=Math.abs(lum(f.a)-(lum(f.p)>.45?.006:.94))<.35?(lum(f.p)>.45?'#FBF8F2':'#15120C'):f.a;
  c.setLineDash([18,14]);c.strokeStyle=lum(f.p)>.45?'rgba(255,255,255,.3)':'rgba(0,0,0,.25)';c.lineWidth=4;c.beginPath();c.moveTo(x0+70,nY);c.lineTo(x0+w-70,nY);c.stroke();c.setLineDash([]);
  c.textAlign='center';c.font=font(700,58,BODY);c.fillStyle=tc;c.globalAlpha=eo(prog(t,.6,1.2));wrap(c,f.title,760,2).forEach((l,i)=>c.fillText(l,cx,y0+130+i*70));c.globalAlpha=1;
  const s=clamp(eback(prog(t,1,1.6)),0,1.15);c.save();c.translate(cx,y0+470);c.scale(s,s);const sz=fitFont(c,String(f.d2),760,330,120);c.font=font(900,sz,COND);c.fillStyle=ka;c.fillText(f.d2,0,0);c.font=font(700,56,BODY);c.fillStyle=tc;c.fillText('İNDİRİM',0,80);c.restore();
  const q=eo(prog(t,1.6,2.2));c.globalAlpha=q;c.font=font(500,30,MONO);c.fillStyle=lum(f.p)>.45?'rgba(255,255,255,.6)':'rgba(0,0,0,.5)';setLS(c,6);c.fillText('KUPON KODU',cx,nY+110);setLS(c,0);c.font=font(700,96,MONO);const cw=c.measureText(f.d1).width+100;rr(c,cx-cw/2,nY+150,cw,150,24);c.strokeStyle=ka;c.lineWidth=5;c.setLineDash([12,10]);c.stroke();c.setLineDash([]);c.fillStyle=tc;c.fillText(f.d1,cx,nY+260);
  const sh=prog(t,2.2,3);if(sh>0&&sh<1){c.save();rr(c,cx-cw/2,nY+150,cw,150,24);c.clip();const sx=cx-cw/2+cw*sh;const g=c.createLinearGradient(sx-80,0,sx+80,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(sx-80,nY+150,160,150);c.restore()}c.globalAlpha=1;c.restore();
  gSmall(c,f.sub,W/2,1520,44,2.4,t,fgA(f.p,.8),'center',900,1,600);c.textAlign='left';logoCorner(c,A,t,2.6,W/2,H-190,140)}},
paket:{n:'Paket Fiyatları',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3]}),labels:{title:'Başlık',d1:'Paket 1 (ad · fiyat)',d2:'Paket 2 (öne çıkan)',d3:'Paket 3'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Paket 1',1,1.6],['Paket 2',1.3,1.9],['Paket 3',1.6,2.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.textAlign='center';gTxt(c,f.title,W/2,400,92,.2,t,st,fg,{align:'center',l:2});c.textAlign='left';[f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const pr=String(s).split('·').map(x=>x.trim());const hot=i===1;const y=640+i*330;const e=eback(prog(t,1+i*.3,1.6+i*.3));if(e<=0)return;
  c.save();c.translate(W/2,y+130);c.scale(clamp(e,0,1.06)*(hot?1.04:1),clamp(e,0,1.06)*(hot?1.04:1));c.translate(-W/2,-(y+130));rr(c,90,y,W-180,260,40);c.fillStyle=hot?f.a:fgA(f.p,.07);c.fill();if(!hot){c.strokeStyle=fgA(f.p,.16);c.lineWidth=2;c.stroke()}
  const tc=hot?onColor(f.a):fg;if(hot){c.font=font(500,24,MONO);const tw=c.measureText('EN ÇOK TERCİH EDİLEN').width+40;rr(c,W/2-tw/2,y-22,tw,46,23);c.fillStyle=lum(f.p)>.45?'#15120C':'#fff';c.fill();c.fillStyle=lum(f.p)>.45?'#fff':'#15120C';c.textAlign='center';c.fillText('EN ÇOK TERCİH EDİLEN',W/2,y+9);c.textAlign='left'}
  c.font=font(700,54,BODY);c.fillStyle=tc;c.fillText(pr[0]||'',150,y+120);c.font=font(500,28,MONO);c.globalAlpha=.65;c.fillText(['TEMEL','POPÜLER','KAPSAMLI'][i],152,y+175);c.globalAlpha=1;c.font=font(900,96,COND);c.textAlign='right';c.fillText(pr[1]||'',W-150,y+165);c.textAlign='left';c.restore()});logoCorner(c,A,t,2.4,W/2,H-170,130)}},
hizmet:{n:'Hizmetler',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3],cta:x[4]}),labels:{title:'Başlık',d1:'Hizmet 1',d2:'Hizmet 2',d3:'Hizmet 3',cta:'Hizmet 4'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Kartlar',1,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x=AX(st);gTxt(c,f.title,x,420,96,.2,t,st,fg,{l:2});const ics=['check','gunes','takvim','mesaj'];[f.d1,f.d2,f.d3,f.cta].forEach((s,i)=>{if(!s)return;const col=i%2,row=Math.floor(i/2);const cx=90+col*460,cy=640+row*500;const e=eback(prog(t,1+i*.25,1.6+i*.25));if(e<=0)return;
  c.save();c.translate(cx+215,cy+215);c.scale(clamp(e,0,1.06),clamp(e,0,1.06));c.translate(-215,-215);rr(c,0,0,430,450,40);c.fillStyle=i===0?f.a:fgA(f.p,.07);c.fill();const tc=i===0?onColor(f.a):fg;c.beginPath();c.arc(110,120,62,0,Math.PI*2);c.fillStyle=i===0?'rgba(0,0,0,.12)':mix(f.a,f.p,.75);c.fill();icon(c,ics[i],110,120,72,i===0?tc:f.a,3.4);
  c.font=font(500,26,MONO);c.fillStyle=tc;c.globalAlpha=.6;c.fillText('0'+(i+1),340,100);c.globalAlpha=1;c.font=font(800,52,BODY);c.fillStyle=tc;wrap(c,s,360,2).forEach((l,j)=>c.fillText(l,50,320+j*62));c.restore()});logoCorner(c,A,t,2.6,W/2,H-150,120)}},
surec:{n:'4 Adım',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3],cta:x[4]}),labels:{title:'Başlık',d1:'Adım 1',d2:'Adım 2',d3:'Adım 3',cta:'Adım 4'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Çizgi',.9,3.2],['Adımlar',1,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);gTxt(c,f.title,80,380,90,.2,t,st,fg,{align:'left',l:2});const x=150,y0=640,y1=1640;const L=eio(prog(t,.9,3.2));c.fillStyle=fgA(f.p,.12);c.fillRect(x-4,y0,8,y1-y0);c.fillStyle=f.a;c.fillRect(x-4,y0,8,(y1-y0)*L);
  [f.d1,f.d2,f.d3,f.cta].forEach((s,i)=>{if(!s)return;const y=y0+i*(y1-y0)/3;const on=L*(y1-y0)>=y-y0-2;const e=clamp(eback(prog(t,1+i*.55,1.5+i*.55)),0,1.2);c.save();c.translate(x,y);c.scale(e,e);c.beginPath();c.arc(0,0,58,0,Math.PI*2);c.fillStyle=on?f.a:f.p;c.fill();c.strokeStyle=f.a;c.lineWidth=5;c.stroke();if(i===3&&on)icon(c,'check',0,0,60,onColor(f.a),5);else{c.font=font(900,64,COND);c.fillStyle=on?onColor(f.a):f.a;c.textAlign='center';c.textBaseline='middle';c.fillText(String(i+1),0,4)}c.restore();c.textAlign='left';c.textBaseline='alphabetic';
   const q=eo(prog(t,1.1+i*.55,1.7+i*.55));c.globalAlpha=q;c.font=font(500,26,MONO);c.fillStyle=f.a;c.fillText('ADIM '+(i+1),250,y-22);c.font=font(800,58,BODY);c.fillStyle=fg;c.fillText(s,250+(1-q)*40,y+42);c.globalAlpha=1});logoCorner(c,A,t,3,W-150,H-150,120)}},
cekilis:{n:'Çekiliş',dur:7,map:x=>({title:x[0],sub:x[1]}),labels:{title:'Ödül',sub:'Tarih'},tracks:[['Zemin',0,7,1],['Hediye',.1,1],['Rozet',.6,1.1],['Ödül',1,1.8],['Kurallar',1.8,3.4],['Tarih',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);if(t>.9){for(let i=0;i<60;i++){const lt=t-.9;const x=W/2+Math.cos(i*2.4)*lt*(300+sr(i)*500),y=430+Math.sin(i*2.4)*lt*(300+sr(i)*400)+lt*lt*120;c.save();c.translate(x,y);c.rotate(lt*4+i);c.fillStyle=i%3?f.a:fg;c.globalAlpha=Math.max(0,1-lt/3);c.fillRect(-8,-4,16,8);c.restore()}c.globalAlpha=1}
  const b=clamp(eback(prog(t,.1,1)),0,1.15);const lid=t>.9?-Math.min(80,(t-.9)*400):0;c.save();c.translate(W/2,430);c.scale(b,b);c.fillStyle=f.a;rr(c,-170,-60,340,230,20);c.fill();c.fillStyle=mix(f.a,'#000000',.2);rr(c,-30,-60,60,230,6);c.fill();c.save();c.translate(0,lid);c.rotate(lid/600);c.fillStyle=mix(f.a,'#ffffff',.15);rr(c,-190,-130,380,80,18);c.fill();c.fillStyle=mix(f.a,'#000000',.2);c.fillRect(-30,-130,60,80);c.restore();c.restore();
  const s=clamp(eback(prog(t,.6,1.1)),0,1.2);c.save();c.translate(W/2,720);c.scale(s,s);c.rotate(Math.sin(t*2)*.03);pill(c,'ÇEKİLİŞ',0,0,fg,f.p,52,'center',50,110);c.restore();c.textAlign='center';gTxt(c,f.title,W/2,920,82,1,t,st,fg,{align:'center',l:2});
  [['insta','Hesabımızı takip et'],['kalp','Bu gönderiyi beğen'],['mesaj','2 arkadaşını etiketle']].forEach(([ic,txt],i)=>{const e=eo(prog(t,1.8+i*.4,2.3+i*.4));const y=1200+i*150;c.globalAlpha=e;c.save();c.translate((1-e)*-80,0);rr(c,120,y-58,W-240,116,58);c.fillStyle=fgA(f.p,.08);c.fill();c.beginPath();c.arc(190,y,40,0,Math.PI*2);c.fillStyle=f.a;c.fill();icon(c,ic,190,y,46,onColor(f.a),3.4);c.font=font(700,44,BODY);c.fillStyle=fg;c.textAlign='left';c.fillText(txt,255,y+15);c.restore()});c.globalAlpha=1;
  gSmall(c,f.sub,W/2,H-180,40,3.4,t,f.a,'center',900,1,700);c.textAlign='left'}},
sss:{n:'Sık Sorulanlar',dur:8,map:x=>({title:x[0],sub:x[1],d1:x[2],d2:x[3]}),labels:{title:'Soru 1',sub:'Cevap 1',d1:'Soru 2',d2:'Cevap 2'},max:{sub:80,d2:80},tracks:[['Zemin',0,8,1],['Başlık',.1,.6],['Soru 1',.4,1.2],['Cevap 1',1.2,1.8],['Soru 2',2.4,3.2],['Cevap 2',3.2,3.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.font=font(900,120,COND);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.1,.6));c.fillText('SSS',80,300);c.globalAlpha=1;c.font=font(500,28,MONO);c.fillStyle=fgA(f.p,.55);c.fillText('SIK SORULAN SORULAR',84,350);
  [[f.title,f.sub,.4,520],[f.d1,f.d2,2.4,1080]].forEach(([q,a,t0,y])=>{if(!q)return;const e=eo(prog(t,t0,t0+.5));c.globalAlpha=e;c.beginPath();c.arc(130,y-20,40,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(900,52,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText('S',130,-16+y);c.textBaseline='alphabetic';c.textAlign='left';c.globalAlpha=1;
   const qy=gTxt(c,q,200,y,64,t0,t,{...st,pair:st.pair===1?3:st.pair},fg,{align:'left',w:800,l:2});const ae=eo(prog(t,t0+.8,t0+1.4));c.globalAlpha=ae;c.fillStyle=f.a;c.fillRect(200,qy,6,110);c.font=font(500,44,BODY);c.fillStyle=fgA(f.p,.8);wrap(c,a,780,3).forEach((l,i)=>c.fillText(l,236,qy+44+i*56+(1-ae)*20));c.globalAlpha=1});logoCorner(c,A,t,3.6,W-150,H-170,120)}},
konum:{n:'Konum',dur:7,map:x=>({title:x[0],sub:x[1],d1:x[2],d2:x[3]}),labels:{title:'Başlık',sub:'Adres',d1:'Yakınlık 1',d2:'Yakınlık 2'},tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Harita',.4,1.6],['Pin',1.3,2],['Adres',2,2.6],['Yakınlıklar',2.4,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);gTxt(c,f.title,80,330,96,.2,t,st,fg,{align:'left',l:2});const mx=70,my=470,mw=W-140,mh=760;c.save();rr(c,mx,my,mw,mh,44);c.clip();c.fillStyle=mix(f.p,lum(f.p)>.45?'#000000':'#ffffff',.06);c.fillRect(mx,my,mw,mh);const g=eio(prog(t,.4,1.6));c.lineCap='round';
  for(let i=0;i<16;i++){const ang=sr(i+5)*.4-.2+(i%2?Math.PI/2:0);const cx=mx+sr(i+11)*mw,cy=my+sr(i+17)*mh;const L=1500*g;c.strokeStyle=fgA(f.p,i%5===0?.28:.14);c.lineWidth=i%5===0?16:7;c.beginPath();c.moveTo(cx-Math.cos(ang)*L/2,cy-Math.sin(ang)*L/2);c.lineTo(cx+Math.cos(ang)*L/2,cy+Math.sin(ang)*L/2);c.stroke()}
  c.fillStyle=mix(f.a,f.p,.82);c.beginPath();c.ellipse(mx+mw*.78,my+mh*.25,160*g,110*g,.3,0,Math.PI*2);c.fill();c.lineCap='butt';const px=W/2,py=my+mh*.55;for(let k=0;k<3;k++){const rp=((t-2+k*.6)%1.8)/1.8;if(t>2){c.strokeStyle=f.a;c.globalAlpha=(1-rp)*.7;c.lineWidth=5;c.beginPath();c.ellipse(px,py,30+rp*200,(30+rp*200)*.45,0,0,Math.PI*2);c.stroke();c.globalAlpha=1}}c.restore();
  const pb=prog(t,1.3,2);if(pb>0){const yy=py-(1-eback(pb))*420;c.save();c.translate(px,yy);c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=20;c.fillStyle=f.a;c.beginPath();c.arc(0,-100,60,Math.PI*.82,Math.PI*2.18);c.lineTo(0,0);c.closePath();c.fill();c.shadowColor='transparent';c.fillStyle=f.p;c.beginPath();c.arc(0,-100,24,0,Math.PI*2);c.fill();c.restore()}
  const e=eo(prog(t,2,2.6));c.globalAlpha=e;icon(c,'konum',115,1330,56,f.a,3.4);c.font=font(700,48,BODY);c.fillStyle=fg;wrap(c,f.sub,820,2).forEach((l,i)=>c.fillText(l,170,1346+i*60));c.globalAlpha=1;
  [f.d1,f.d2].filter(Boolean).forEach((s,i)=>{const q=eo(prog(t,2.4+i*.2,3+i*.2));c.globalAlpha=q;c.font=font(600,38,BODY);const w=c.measureText(s).width+60;const x=80+i*(w+20>520?0:0)+(i?Math.min(W-160-w,c.measureText(f.d1).width+80):0);rr(c,x,1500,w,80,40);c.fillStyle=fgA(f.p,.08);c.fill();c.fillStyle=fg;c.textBaseline='middle';c.fillText(s,x+30,1542);c.textBaseline='alphabetic'});c.globalAlpha=1;logoCorner(c,A,t,2.6,W-150,H-160,120)}},
ekip:{n:'Ekip Tanıtımı',dur:7,map:x=>({title:x[0],sub:x[1],d1:x[2]}),labels:{title:'İsim',sub:'Görev',d1:'Söz'},max:{d1:90},tracks:[['Zemin',0,7,1],['Portre',.1,.9],['İsim',.7,1.5],['Görev',1.3,1.8],['Söz',1.8,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const s=clamp(eback(prog(t,.1,.9)),0,1.12);const cy=620;c.save();c.translate(W/2,cy);c.scale(s,s);c.strokeStyle=f.a;c.lineWidth=8;c.beginPath();c.arc(0,0,290,-Math.PI/2,-Math.PI/2+Math.PI*2*eio(prog(t,.3,1.3)));c.stroke();c.save();c.beginPath();c.arc(0,0,260,0,Math.PI*2);c.clip();
  if(A.photo){c.translate(-260,-260);const sc=520/W;c.scale(sc,sc);c.translate(0,-(H-W)/2);c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.05)}else{const g=c.createLinearGradient(-260,-260,260,260);g.addColorStop(0,f.a);g.addColorStop(1,mix(f.a,f.p,.55));c.fillStyle=g;c.fillRect(-260,-260,520,520);c.font=font(700,200);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText(String(f.title).replace(/^(Dr\.|Şef)\s*/,'').split(' ').map(w=>w[0]).join('').slice(0,2),0,12)}c.restore();c.restore();c.textAlign='left';c.textBaseline='alphabetic';
  c.textAlign='center';const y=gTxt(c,f.title,W/2,1060,84,.7,t,st,fg,{align:'center',l:2});c.font=font(500,30,MONO);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,1.3,1.8));setLS(c,5);c.fillText(String(f.sub).toLocaleUpperCase('tr'),W/2,y+10);setLS(c,0);c.globalAlpha=1;
  c.textAlign='center';c.font=font(500,52,SERIF).replace('500','italic 500');c.fillStyle=fgA(f.p,.85);const L=wrap(c,'“'+f.d1+'”',880,3);L.forEach((l,i)=>{const q=eo(prog(t,1.8+i*.25,2.4+i*.25));c.globalAlpha=q;c.fillText(l,W/2,y+150+i*70)});c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.6,W/2,H-170,130)}},
once:{n:'Önce / Sonra',dur:7,map:x=>({title:x[0],sub:x[1],d1:x[2],d2:x[3]}),labels:{title:'Başlık',sub:'Alt metin',d1:'Sol etiket',d2:'Sağ etiket'},tracks:[['Önce',0,1.2,1],['Perde',1.2,3.8],['Sonra',1.2,7,1],['Başlık',3.6,4.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const before=()=>{if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);if('filter' in c){c.filter='grayscale(1) brightness(.8)';cover(c,A.photo,1.04);c.filter='none'}else cover(c,A.photo,1.04)}else absScene(c,{p:'#3A3D42',a:'#8A8F96'},0)};
  const after=()=>{if(A.photo){c.fillStyle='#000';c.fillRect(0,0,W,H);cover(c,A.photo,1.04)}else absScene(c,{p:mix(f.p,f.a,.2),a:f.a},t)};const x=W*(1-eio(prog(t,1.2,3.8)));before();c.save();c.beginPath();c.rect(x,0,W-x,H);c.clip();after();c.restore();
  if(x>2&&x<W-2){c.fillStyle='#fff';c.fillRect(x-3,0,6,H);c.beginPath();c.arc(x,H*.45,46,0,Math.PI*2);c.fill();c.strokeStyle='#111';c.lineWidth=5;c.beginPath();c.moveTo(x-12,H*.45-14);c.lineTo(x-24,H*.45);c.lineTo(x-12,H*.45+14);c.moveTo(x+12,H*.45-14);c.lineTo(x+24,H*.45);c.lineTo(x+12,H*.45+14);c.stroke()}
  if(x>400&&t<3.6)pill(c,f.d1,80,200,'rgba(0,0,0,.55)','#fff',34,'left',28,72);if(x<W-400)pill(c,f.d2,W-80-(c.measureText?0:0)-((()=>{c.font=font(700,34,BODY);return c.measureText(f.d2).width+56})()),200,f.a,onColor(f.a),34,'left',28,72);
  const g=c.createLinearGradient(0,H*.6,0,H);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');c.globalAlpha=prog(t,3.4,4);c.fillStyle=g;c.fillRect(0,H*.6,W,H*.4);c.globalAlpha=1;const y=gTxt(c,f.title,80,1560,84,3.6,t,st,'#fff',{align:'left',l:2});gSmall(c,f.sub,80,y+10,42,4.2,t,'rgba(255,255,255,.85)','left',900,2,600);logoCorner(c,A,t,4,W-150,170,120)}},
sosyal:{n:'Sosyal Kanıt',dur:6,map:x=>({d1:x[0],title:x[1],sub:x[2]}),labels:{d1:'Sayı',title:'Açıklama',sub:'Puan'},tracks:[['Zemin',0,6,1],['Sayaç',.2,2],['Avatarlar',1.2,2.2],['Puan',2,2.6],['Kalp',2.4,6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const n=numOf(f.d1);const p=eio(prog(t,.2,2));c.textAlign='center';const v=Math.round(n*p).toLocaleString('tr-TR')+(n>=100?'+':'');const sz=fitFont(c,v,960,330,140);c.font=font(900,sz,COND);c.fillStyle=fg;const bump=1+.05*Math.max(0,1-Math.abs(t-2)*5);c.save();c.translate(W/2,820);c.scale(bump,bump);c.fillText(v,0,0);c.restore();
  c.font=font(700,60,BODY);c.fillStyle=f.a;c.globalAlpha=eo(prog(t,.8,1.4));c.fillText(f.title,W/2,920);c.globalAlpha=1;const cols=[f.a,mix(f.a,'#ffffff',.4),mix(f.a,f.p,.4),'#7C93FF','#FF8A5B'];
  for(let i=0;i<5;i++){const e=clamp(eback(prog(t,1.2+i*.1,1.7+i*.1)),0,1.15);if(e<=0)continue;const x=W/2-200+i*100;c.save();c.translate(x,1110);c.scale(e,e);c.beginPath();c.arc(0,0,62,0,Math.PI*2);c.fillStyle=f.p;c.fill();c.beginPath();c.arc(0,0,54,0,Math.PI*2);c.fillStyle=cols[i];c.fill();c.font=font(700,44,BODY);c.fillStyle=onColor(cols[i]);c.textBaseline='middle';c.fillText('ABCDE'[i],0,4);c.restore()}c.textBaseline='alphabetic';
  const q=eo(prog(t,2,2.6));c.globalAlpha=q;for(let i=0;i<5;i++){c.save();c.translate(W/2-170+i*85,1320);star(c,0,0,32);c.fillStyle=f.a;c.fill();c.restore()}c.font=font(900,90,COND);c.fillStyle=fg;c.fillText(f.sub,W/2,1470);c.globalAlpha=1;
  if(t>2.4){const k=(t-2.4)%1.2/1.2;c.save();c.translate(W/2,1640-k*80);c.globalAlpha=1-k;c.scale(1+k*.3,1+k*.3);c.fillStyle=f.a;c.fill(ipath('kalp'));c.restore();c.globalAlpha=1;c.save();c.translate(W/2-48,1600);c.scale(2,2);c.fillStyle=f.a;c.fill(ipath('kalp'));c.restore()}c.textAlign='left';logoCorner(c,A,t,.4,W/2,220,130)}},
yeni:{n:'Yeni Ürün',dur:6,map:x=>({d1:x[0],title:x[1],sub:x[2],cta:x[3]}),labels:{d1:'Üst etiket',title:'Ürün adı',sub:'Alt metin',cta:'Çağrı'},tracks:[['Zemin',0,6,1],['Kart dönüşü',.2,1.6],['Etiket',1.3,1.8],['İsim',1.5,2.3],['Alt metin',2.1,2.7],['Çağrı',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const k=eio(prog(t,.2,1.6));const ang=Math.PI*(1-k);const sx=Math.cos(ang);const cw=700,ch=860,cx=W/2,cy=640;c.save();c.translate(cx,cy);c.scale(Math.abs(sx)*.98+.02,1);c.rotate(0);
  if(sx<0){rr(c,-cw/2,-ch/2,cw,ch,44);c.fillStyle=f.a;c.fill();c.font=font(900,180,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.textBaseline='middle';c.fillText('?',0,10);c.textBaseline='alphabetic';c.restore()}else{c.restore();c.save();c.translate(cx,cy);c.scale(Math.abs(sx)*.98+.02,1);c.translate(-cx,-cy);c.shadowColor='rgba(0,0,0,.4)';c.shadowBlur=50;rr(c,cx-cw/2,cy-ch/2,cw,ch,44);c.fillStyle=f.p;c.fill();c.shadowColor='transparent';slot(c,cx-cw/2,cy-ch/2,cw,ch,f,A,t,6,this.sector==='Emlak & İnşaat');c.restore()}
  c.textAlign='center';const e=eo(prog(t,1.3,1.8));c.globalAlpha=e;pill(c,f.d1,W/2,1150,f.a,onColor(f.a),32,'center',30,70);c.globalAlpha=1;c.textAlign='center';const y=gTxt(c,f.title,W/2,1310,88,1.5,t,st,fg,{align:'center',l:2});gSmall(c,f.sub,W/2,y+10,44,2.1,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,H-200,2.6,t,f,'center',false);c.textAlign='left'}}
};
// ---- mevcut sektör şablonlarına süsleme + fotoğraflı zeminde yazı gölgesi ----
GEN.forEach((g,i)=>{g.st.deco=Math.floor(sr(i*7+3)*4);const AR=ARCH[ARCH_KEYS.find(k=>ARCH[k].n===g.cat)];if(!AR)return;g.draw=function(c,t,f,A){gBg(c,t,f,A,this.st.bg,this.dur,this.sector==='Emlak & İnşaat');deco(c,t,f,this.st.deco);if(this.st.bg==='photo'){c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=24}AR.draw.call(this,c,t,f,A,this.st);c.shadowColor='transparent';c.shadowBlur=0}});
// ---- ürün kartında boş görsel alanı: soyut sahne + fotoğraf simgesi ----
ARCH.urun.draw=function(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.1,.9));const fw=840,fh=820,fx=(W-fw)/2,fy=170+(1-e)*80;c.globalAlpha=e;slot(c,fx,fy,fw,fh,f,A,t,7,this.sector==='Emlak & İnşaat');c.strokeStyle=fgA(f.p,.18);c.lineWidth=3;rr(c,fx,fy,fw,fh,40);c.stroke();c.globalAlpha=1;
 const x=AX(st);const y=gTxt(c,f.title,x,1130,78,.8,t,st,fg,{l:2});gSmall(c,f.sub,x,y+10,42,1.5,t,fgA(f.p,.75),st.align);const q=eo(prog(t,1.9,2.5));c.globalAlpha=q;c.font=font(800,84,BODY);c.fillStyle=f.a;c.textAlign=st.align;c.fillText(f.d1,x,Math.max(1560,y+150));c.textAlign='left';c.globalAlpha=1;
 const ch=[f.d2,f.d3].filter(Boolean);c.font=font(600,36,BODY);const ws=ch.map(s=>c.measureText(s).width+60);let cx=st.align==='center'?W/2-(ws.reduce((a,b)=>a+b,0)+16*(ws.length-1))/2:80;ch.forEach((s,i)=>{const k=eo(prog(t,2.3+i*.15,2.8+i*.15));c.globalAlpha=k;rr(c,cx,Math.max(1640,y+230),ws[i],74,37);c.strokeStyle=fgA(f.p,.3);c.lineWidth=2;c.stroke();c.fillStyle=fg;c.textBaseline='middle';c.fillText(s,cx+30,Math.max(1640,y+230)+38);c.textBaseline='alphabetic';cx+=ws[i]+16});c.globalAlpha=1};
// ---- yeni kurguları üret ----
const GEN2=[];(function(){let n=GEN.length;const keys=Object.keys(ARCH2);SECTORS.forEach((sec,si)=>{keys.forEach((ak,ai)=>{const AR=ARCH2[ak];for(let v=0;v<3;v++){const h=k=>Math.floor(sr(si*197+ai*29+v*11+k*5.3+900)*1e6);
  const bgk=ak==='once'?'solid':GBG[(h(1)+v*3+ai)%GBG.length];const anim=GANIM[(h(2)+v*2+si+ai)%GANIM.length];const pair=(h(3)+v+ai)%4;const align=(h(4)+v)%2?'center':'left';
  let pal=v===0?['Marka',sec.p[0],sec.p[1]]:GPAL[(h(5)+v*7+si*3+ai)%GPAL.length];if(bgk==='photo'&&lum(pal[1])>.45)pal=GPAL[(h(6)+v)%8];const st={bg:bgk,anim,pair,align,deco:(h(7)+v)%4};
  const fields={...AR.map(C2[si][ak]),p:pal[1],a:pal[2]};['title','sub','d1','d2','d3','cta'].forEach(k=>{if(fields[k]==null)fields[k]=''});n++;
  GEN2.push({id:'g'+String(n).padStart(3,'0'),name:`${AR.n} · ${pal[0]} ${GBGN[bgk]}`,cat:AR.n,sector:sec.n,dur:AR.dur,isNew:true,def:fields,labels:AR.labels,max:AR.max,tracks:AR.tracks,st,
   draw(c,t,f,A){gBg(c,t,f,A,this.st.bg,this.dur,this.sector==='Emlak & İnşaat');if(ak!=='once')deco(c,t,f,this.st.deco);if(this.st.bg==='photo'){c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=24}AR.draw.call(this,c,t,f,A,this.st);c.shadowColor='transparent';c.shadowBlur=0}})}})})})();
TEMPLATES.push(...GEN2);
// ===== Sektör içerikleri 3: 9 yeni reklam türü (12 sektör, SECTORS sırasıyla) =====
const C3=[
{saat:['Çalışma saatlerimiz','Hafta içi · 08:00 – 23:00','Cumartesi · 09:00 – 00:00','Pazar · 09:00 – 22:00','Mutfak kapanışa 30 dk kala kapanır'],kiyas:['Neden Cafe Luna?','Günlük taze ekmek','Yerel üreticiden süt','Ücretsiz Wi-Fi ve priz','CAFE LUNA'],flas:['%40','Tüm tatlılarda flaş indirim','SADECE BUGÜN','Hemen gel'],anket:['Hangisi senin favorin?','Latte','Türk kahvesi','Yorumlarda yaz'],takip:['@cafeluna','Bizi takip et','Her gün yeni lezzetler','480','25B'],ozel:['Yeni yılınız kutlu olsun','2027','CAFE LUNA'],teslim:['Paket servis','30 dakikada kapında','Kapıda kartla ödeme','Memnun kalmazsan iade'],slogan:['İyi kahve iyi gün demek','CAFE LUNA'],randevu:['Masanı ayırt','18','KASIM','19:00 · 20:30 · 22:00','Rezervasyon yap']},
{saat:['Salon saatlerimiz','Hafta içi · 10:00 – 20:00','Cumartesi · 09:00 – 21:00','Pazar · Kapalı','Randevusuz da gelebilirsiniz'],kiyas:['Neden Studio Rose?','Vegan ve cruelty free ürünler','Tek kullanımlık hijyen seti','Uzman kadro','STUDIO ROSE'],flas:['%30','Cilt bakımında flaş indirim','48 SAAT','Randevu al'],anket:['Bu sezon hangisi?','Bakır kahve','Küllü sarı','Yorumlarda yaz'],takip:['@studiorose','Dönüşümleri kaçırma','Her hafta yeni önce ve sonra','860','42B'],ozel:['Dünya Kadınlar Günü kutlu olsun','8 MART','STUDIO ROSE'],teslim:['Randevu kolaylığı','Online randevu 7/24','Kartla ya da nakit ödeme','İptal ücretsiz'],slogan:['Kendine ayırdığın zaman en güzel yatırım','STUDIO ROSE'],randevu:['Randevunu seç','22','KASIM','11:00 · 14:30 · 17:00','Hemen ayır']},
{saat:['Mağaza saatleri','Hafta içi · 10:00 – 22:00','Cumartesi · 10:00 – 22:00','Pazar · 11:00 – 21:00','Online mağaza 7/24 açık'],kiyas:['Neden Norde?','Organik pamuk kumaş','Ücretsiz iade','Türkiye\'de üretim','NORDE'],flas:['%50','Sezon sonu flaş indirim','SON 24 SAAT','Alışverişe başla'],anket:['Hangi kombin?','Bej trençkot','Siyah deri ceket','Yorumlarda yaz'],takip:['@nordewear','Stil ilhamı için takip et','Her gün yeni kombin','1.2B','88B'],ozel:['Efsane Cuma başladı','%60','NORDE'],teslim:['Teslimat ve iade','750 TL üzeri ücretsiz kargo','9 taksit imkânı','14 gün içinde ücretsiz iade'],slogan:['Az ama iyi giyin','NORDE'],randevu:['Stil danışmanlığı','25','KASIM','12:00 · 15:00 · 18:00','Randevu al']},
{saat:['Salon saatleri','Hafta içi · 06:00 – 23:00','Cumartesi · 08:00 – 22:00','Pazar · 09:00 – 20:00','Bayramlarda da açığız'],kiyas:['Neden Pulse Gym?','Sınırsız grup dersi','Kişisel antrenman programı','Ücretsiz otopark','PULSE GYM'],flas:['%35','Yıllık üyelikte flaş indirim','SON 3 GÜN','Hemen üye ol'],anket:['Sabah mı akşam mı?','Sabah antrenmanı','Akşam antrenmanı','Yorumlarda yaz'],takip:['@pulsegym','Motivasyon için takip et','Her gün yeni antrenman','620','31B'],ozel:['Yeni yıl, yeni sen','2027','PULSE GYM'],teslim:['Üyelik kolaylığı','5 dakikada online üyelik','12 aya varan taksit','İlk ders ücretsiz'],slogan:['Bahane değil sonuç üret','PULSE GYM'],randevu:['Deneme dersini ayır','20','KASIM','07:00 · 12:30 · 19:00','Ücretsiz dene']},
{saat:['Kurs saatleri','Hafta içi · 09:00 – 21:00','Cumartesi · 10:00 – 18:00','Pazar · 10:00 – 16:00','Online dersler 7/24'],kiyas:['Neden Akademi Plus?','En fazla 8 kişilik sınıflar','Ücretsiz seviye testi','Sertifikalı eğitmenler','AKADEMİ PLUS'],flas:['%25','Erken kayıtta flaş indirim','SON 48 SAAT','Kaydını yap'],anket:['Hangi dili öğrenmek istersin?','İngilizce','Almanca','Yorumlarda yaz'],takip:['@akademiplus','Günün kelimesi için takip et','Her gün 1 yeni kelime','350','18B'],ozel:['Öğretmenler Günü kutlu olsun','24 KASIM','AKADEMİ PLUS'],teslim:['Kayıt kolaylığı','Online kayıt','6 taksit imkânı','İlk hafta memnun kalmazsan iade'],slogan:['Öğrenmek için asla geç değil','AKADEMİ PLUS'],randevu:['Seviye testini planla','19','KASIM','10:00 · 14:00 · 18:30','Yerini ayırt']},
{saat:['Servis saatleri','Hafta içi · 08:30 – 19:00','Cumartesi · 09:00 – 17:00','Pazar · Kapalı','7/24 yol yardım hattı'],kiyas:['Neden Rota Oto?','Ekspertiz raporlu araçlar','Takas imkânı','2 yıl garanti','ROTA OTO'],flas:['%20','Periyodik bakımda flaş indirim','BU HAFTA','Randevu al'],anket:['Hangisini seçerdin?','SUV','Sedan','Yorumlarda yaz'],takip:['@rotaoto','Yeni gelen araçlar için takip et','Her hafta yeni ilan','290','14B'],ozel:['İyi yolculuklar dileriz','2027','ROTA OTO'],teslim:['Satın alma kolaylığı','Kapına teslim','Krediye uygun araçlar','7 gün koşulsuz iade'],slogan:['Yol senin, güven bizden','ROTA OTO'],randevu:['Test sürüşü ayırt','21','KASIM','10:00 · 13:00 · 16:30','Hemen ayır']},
{saat:['Klinik saatleri','Hafta içi · 08:00 – 20:00','Cumartesi · 09:00 – 15:00','Pazar · Acil hat açık','Online randevu 7/24'],kiyas:['Neden Medika?','Aynı gün sonuç','Anlaşmalı sigortalar','Uzman hekim kadrosu','MEDİKA'],flas:['%30','Check-up paketlerinde kampanya','BU AY','Randevu al'],anket:['Check-up sıklığın?','Yılda 1 kez','Hiç yaptırmadım','Yorumlarda yaz'],takip:['@medikaklinik','Sağlık ipuçları için takip et','Her hafta uzman önerileri','210','9.8B'],ozel:['Tıp Bayramı kutlu olsun','14 MART','MEDİKA KLİNİK'],teslim:['Hasta kolaylıkları','Online randevu','Sigorta ile ödeme','Sonuçlar e-postanda'],slogan:['Erken tanı hayat kurtarır','MEDİKA KLİNİK'],randevu:['Randevunu planla','26','KASIM','09:00 · 11:30 · 15:00','Randevu al']},
{saat:['Destek saatleri','Hafta içi · 09:00 – 22:00','Cumartesi · 10:00 – 18:00','Pazar · 10:00 – 18:00','Uygulama içi canlı destek'],kiyas:['Neden Fluxa?','Reklamsız deneyim','Verilerin şifreli','Tüm cihazlarda senkron','FLUXA'],flas:['%60','Pro planda flaş indirim','SON 12 SAAT','Hemen yükselt'],anket:['Hangi özelliği istersin?','Karanlık mod','Takvim entegrasyonu','Yorumlarda yaz'],takip:['@fluxaapp','İpuçları için takip et','Her gün bir kısayol','150','12B'],ozel:['2 yaşındayız!','2','FLUXA'],teslim:['Abonelik','7 gün ücretsiz deneme','Apple Pay ve kartla ödeme','İstediğin an iptal'],slogan:['Daha az uğraş, daha çok yaşa','FLUXA'],randevu:['Demo görüşmesi ayır','27','KASIM','10:00 · 14:00 · 17:00','Demo iste']},
{saat:['Ofis saatleri','Hafta içi · 10:00 – 19:00','Cumartesi · 11:00 – 17:00','Pazar · Randevuyla','Mekân gezileri hafta sonu'],kiyas:['Neden Atelier?','Tek elden organizasyon','Özel tasarım dekor','Sabit fiyat garantisi','ATELİER'],flas:['%15','2027 düğünlerinde erken rezervasyon','SON 5 GÜN','Teklif al'],anket:['Kır düğünü mü salon mu?','Kır düğünü','Salon düğünü','Yorumlarda yaz'],takip:['@atelierevents','İlham için takip et','Her hafta yeni organizasyon','540','27B'],ozel:['Mutluluğunuz daim olsun','♥','ATELİER EVENTS'],teslim:['Organizasyon süreci','Ücretsiz mekân keşfi','Taksitli ödeme','Sözleşmeli hizmet'],slogan:['En güzel gününüz kusursuz olsun','ATELİER EVENTS'],randevu:['Ön görüşme ayır','23','KASIM','11:00 · 14:00 · 17:30','Randevu al']},
{saat:['Resepsiyon ve restoran','Resepsiyon · 7/24','Kahvaltı · 07:30 – 11:00','Akşam · 19:00 – 23:00','Havalimanı transferi mevcut'],kiyas:['Neden Azure Bay?','Denize sıfır konum','Her şey dahil','Ücretsiz transfer','AZURE BAY'],flas:['%35','Erken rezervasyonda flaş indirim','SON 72 SAAT','Yerini ayırt'],anket:['Tatilde hangisi?','Deniz','Havuz','Yorumlarda yaz'],takip:['@azurebayhotel','Mavi için takip et','Her gün yeni manzara','720','64B'],ozel:['Yeni yılı denizde karşılayın','2027','AZURE BAY'],teslim:['Rezervasyon kolaylığı','Ücretsiz iptal','9 taksit imkânı','En iyi fiyat garantisi'],slogan:['Mavi burada başlar','AZURE BAY'],randevu:['Tarihini seç','15','HAZİRAN','3 gece · 5 gece · 7 gece','Rezervasyon yap']},
{saat:['Satış ofisi saatleri','Hafta içi · 09:00 – 19:00','Cumartesi · 10:00 – 18:00','Pazar · 11:00 – 17:00','Örnek daire hafta sonu açık'],kiyas:['Neden Mavi Vadi?','Deprem yönetmeliğine uygun','Sosyal tesis ve havuz','120 aya varan vade','MAVİ VADİ'],flas:['%10','Peşin alımda indirim','BU AY','Bilgi al'],anket:['Hangisi sizin için?','2+1 bahçe katı','3+1 manzaralı','Yorumlarda yazın'],takip:['@mavivadi','İnşaat sürecini takip edin','Her hafta şantiyeden haber','190','11B'],ozel:['Yeni evinizde mutluluklar','2027','MAVİ VADİ'],teslim:['Satın alma kolaylığı','Banka kredisine uygun','%25 peşinat','Tapu teslimde'],slogan:['Ev değil yaşam inşa ediyoruz','MAVİ VADİ'],randevu:['Örnek daireyi gezin','30','KASIM','11:00 · 14:00 · 16:30','Randevu al']},
{saat:['Ofis saatlerimiz','Hafta içi · 09:30 – 18:30','Cumartesi · Randevuyla','Pazar · Kapalı','Toplantılar online da yapılır'],kiyas:['Neden Kuzey Kreatif?','Aylık performans raporu','Sabit ekip, tek muhatap','Şeffaf fiyat','KUZEY'],flas:['%20','Yıllık anlaşmada indirim','BU AY','Teklif al'],anket:['Hangisi daha etkili?','Reels','Carousel','Yorumlarda yaz'],takip:['@kuzeykreatif','Pazarlama ipuçları için takip et','Her hafta yeni içerik','410','22B'],ozel:['10. yılımızı kutluyoruz','10','KUZEY KREATİF'],teslim:['Çalışma şekli','Ücretsiz ilk görüşme','Aylık faturalandırma','Taahhütsüz deneme ayı'],slogan:['İyi reklam ilk 3 saniyede başlar','KUZEY KREATİF'],randevu:['Tanışma toplantısı','24','KASIM','10:00 · 13:00 · 16:00','Toplantı ayarla']}
];

// ===== Sektör sözlükleri (SECTORS sırasıyla) — reklam türleri bu sözlükten metin üretir =====
const LEX=[
{brand:'Cafe Luna',handle:'@cafeluna',web:'cafeluna.com',phone:'0 216 000 00 00',area:'Moda, Kadıköy',addr:'Moda Cad. No:12',
 items:[['Flat white','₺110'],['San Sebastian','₺220'],['Trüflü risotto','₺420'],['Avokado tost','₺260'],['Cold brew','₺125'],['Brunch tabağı','₺390']],
 feats:['Günlük taze ekmek','Yerel üreticiden süt','Ev yapımı tatlılar','Bahçede oturma','Ücretsiz Wi-Fi','Paket servis'],
 tips:['Kahveyi taze çekin','Suyu 93°C\'de kullanın','Fincanı önceden ısıtın','Sütü kaynatmayın','Çekirdeği ışıksız saklayın'],donts:['Kahveyi buzdolabında saklamak','Kaynar su kullanmak','Eski çekirdek kullanmak'],
 myth:['Koyu kavrum daha sert kahvedir','Kafein oranı kavrumla değil çekirdek türüyle ilgilidir'],faq:['Rezervasyon gerekli mi?','Hafta sonu için öneriyoruz.'],
 reviews:[['Kahveleri şehirdeki en iyisi.','Selin A.'],['Brunch tabağı efsane!','Mert K.'],['Çalışmak için harika bir yer.','Deniz Y.']],
 stats:{n:'12.000+',nl:'mutlu misafir',yr:'8',rt:'4.9',rv:'1.240'},hist:[['2018','İlk şubemiz Moda\'da'],['2020','Kendi kavurma atölyemiz'],['2023','Brunch menüsü'],['2026','Kadıköy\'de 2. şube']],
 week:[['Pzt','Kahve tadımı'],['Çar','Canlı akustik'],['Cum','Tatlı günü'],['Cmt','Brunch'],['Paz','Aile kahvaltısı']],
 ev:['Latte Art Atölyesi','16 KASIM','Moda şubesi · 14:00'],off:'%20',offT:'İlk siparişe özel',code:'LUNA20',
 prize:['Bedava kahve','Tatlı ikramı','%10 indirim','2 kişilik brunch','Kupa hediye','Tekrar dene'],team:[['Kerem A.','Şef'],['Elif T.','Barista'],['Can D.','Pastacı'],['Zeynep K.','Müdür']],
 clients:['Moda Ofis','Kadıköy Kitap','Yeldeğirmeni Sanat','Bahariye Kulüp','Sahil Yoga','Fenerbahçe Koşu'],words:['kahve','tatlı','brunch','sohbet'],
 route:['Moda İskelesi','Cafe Luna','4 dk yürüme'],hook:'Kahven hâlâ hazır kahve mi?',prod:'Cold brew',loyal:'6. kahve bizden',big:'KAHVE',weather:'Soğuk günlere sıcak çikolata',cat:'Kafe'},
{brand:'Studio Rose',handle:'@studiorose',web:'studiorose.com',phone:'0 212 000 00 00',area:'Nişantaşı',addr:'Abdi İpekçi Cad. No:24',
 items:[['Keratin bakım','₺2.400'],['Fön','₺350'],['Manikür','₺450'],['Cilt bakımı','₺1.250'],['Kalıcı oje','₺600'],['Gelin paketi','₺4.900']],
 feats:['Vegan ürünler','Hijyen seti','Uzman kadro','Online randevu','Ücretsiz çay ikramı','Vale hizmeti'],
 tips:['Saçı ılık suyla yıkayın','Isı koruyucu kullanın','6 haftada uç kesimi','Haftada bir maske','İpek yastık kılıfı'],donts:['Islak saçı taramak','Her gün düzleştirici','Sıcak suyla yıkamak'],
 myth:['Sık kesilen saç daha hızlı uzar','Saç kökten uzar; kesim yalnızca uçları sağlıklı tutar'],faq:['Randevumu nasıl alırım?','DM ya da telefonla.'],
 reviews:[['Saçım hiç bu kadar parlak olmamıştı.','Ayşe B.'],['Gelin makyajım kusursuzdu.','Merve S.'],['Çok ilgili bir ekip.','Gizem T.']],
 stats:{n:'8.000+',nl:'mutlu müşteri',yr:'10',rt:'4.9',rv:'860'},hist:[['2016','Nişantaşı salonu'],['2019','Cilt bakım bölümü'],['2022','Gelin stüdyosu'],['2026','Vegan ürün serisi']],
 week:[['Pzt','Saç bakım günü'],['Sal','Manikür %15'],['Per','Cilt bakımı'],['Cum','Gelin provası'],['Cmt','Fön günü']],
 ev:['Gelin Saçı Günleri','8 MART','Nişantaşı salonu · 10:00'],off:'%15',offT:'İlk randevuya özel',code:'ROSE15',
 prize:['Ücretsiz fön','Manikür','%20 indirim','Cilt bakımı','Bakım seti','Tekrar dene'],team:[['Deniz K.','Saç tasarımcısı'],['Selin M.','Cilt uzmanı'],['Ece B.','Manikürist'],['Lale T.','Makyöz']],
 clients:['Gelin Atölyesi','Nişantaşı Moda','Rose Event','Bebek Butik','Maçka Spa','Teşvikiye Foto'],words:['saç','cilt','tırnak','makyaj'],
 route:['Osmanbey Metro','Studio Rose','3 dk yürüme'],hook:'Saçların yazdan yorgun mu çıktı?',prod:'Keratin bakım',loyal:'5. fön bizden',big:'GÜZEL',weather:'Nemli havada kabarmaya son',cat:'Kuaför'},
{brand:'Norde',handle:'@nordewear',web:'norde.com.tr',phone:'0 850 000 00 00',area:'Online mağaza',addr:'norde.com.tr',
 items:[['Keten gömlek','₺890'],['Bej trençkot','₺2.490'],['Deri ceket','₺4.990'],['Basic tişört','₺390'],['Kargo pantolon','₺1.290'],['Triko kazak','₺1.190']],
 feats:['Organik pamuk','Ücretsiz iade','Türkiye\'de üretim','Hızlı kargo','9 taksit','Sınırlı üretim'],
 tips:['Rengi 3 tonla sınırla','Bir parçayı öne çıkar','Katmanlı giyin','Aksesuarı az kullan','Ayakkabıyla bitir'],donts:['Logo üstüne logo','Bol üstüne bol','Sezona uymayan kumaş'],
 myth:['Siyah herkese yakışır','Ten rengine göre lacivert ya da antrasit daha iyi durabilir'],faq:['İade süresi ne kadar?','14 gün içinde ücretsiz.'],
 reviews:[['Kumaş kalitesi beklediğimden iyi.','Ece T.'],['Kargo ertesi gün geldi.','Burak S.'],['Kalıpları tam oturuyor.','Nil A.']],
 stats:{n:'50.000+',nl:'mutlu müşteri',yr:'5',rt:'4.8',rv:'3.400'},hist:[['2021','İlk koleksiyon'],['2022','Online mağaza'],['2024','Organik seri'],['2026','İlk showroom']],
 week:[['Pzt','Yeni gelenler'],['Çar','Kombin önerisi'],['Cum','Hafta sonu indirimi'],['Cmt','Canlı yayın'],['Paz','Stil sorularınız']],
 ev:['Sonbahar Lansmanı','12 EKİM','Showroom · 19:00'],off:'%30',offT:'Sepette ekstra',code:'NORDE30',
 prize:['%30 indirim','Ücretsiz kargo','Tişört hediye','₺250 çek','Çanta hediye','Tekrar dene'],team:[['Nil A.','Tasarımcı'],['Emre K.','Stilist'],['Duru Y.','Müşteri ilişkileri'],['Can B.','Depo']],
 clients:['Stil Dergisi','Moda Haftası','Karaköy Fotoğraf','Kumaş Atölyesi','Butik Otel','Şehir Pazarı'],words:['sade','kaliteli','zamansız','senin'],
 route:['Depomuz','Kapın','24 saatte'],hook:'Dolabın dolu ama giyecek bir şey yok mu?',prod:'Keten gömlek',loyal:'5. siparişte kargo bedava',big:'STİL',weather:'Yağmura trençkot',cat:'Moda'},
{brand:'Pulse Gym',handle:'@pulsegym',web:'pulsegym.com',phone:'0 216 000 00 00',area:'Ataşehir',addr:'Barbaros Mah. No:5',
 items:[['Aylık üyelik','₺1.490'],['Yıllık üyelik','₺11.900'],['PT seansı','₺900'],['Pilates','₺650'],['Boks dersi','₺550'],['Öğrenci üyeliği','₺990']],
 feats:['Sınırsız grup dersi','Kişisel program','Ücretsiz otopark','Sauna','06:00\'da açık','Diyetisyen desteği'],
 tips:['Isınmayı atlamayın','Haftada 3 gün yeter','Protein alın','Uykuya dikkat','Suyu ihmal etmeyin'],donts:['Isınmadan ağırlık','Her gün aynı bölge','Aç karnına HIIT'],
 myth:['Ağırlık kadınları iriltir','Doğru programla sıkı ve fit bir görünüm sağlar'],faq:['Deneme dersi var mı?','İlk ders ücretsiz.'],
 reviews:[['3 ayda 8 kilo verdim.','Burak T.'],['Hocalar çok ilgili.','Ceren D.'],['Salon hep tertemiz.','Onur K.']],
 stats:{n:'2.500+',nl:'aktif üye',yr:'6',rt:'4.8',rv:'720'},hist:[['2020','Ataşehir salonu'],['2022','Pilates stüdyosu'],['2024','Boks alanı'],['2026','2. salon']],
 week:[['Pzt','HIIT 19:00'],['Sal','Pilates 18:00'],['Çar','Boks 20:00'],['Per','Yoga 19:00'],['Cmt','Crossfit 10:00']],
 ev:['30 Günlük Challenge','1 KASIM','Tüm salonlar'],off:'%35',offT:'Yıllık üyelikte',code:'PULSE35',
 prize:['1 ay ücretsiz','PT seansı','Shaker','%20 indirim','Havlu seti','Tekrar dene'],team:[['Mert Y.','Baş antrenör'],['Ceren D.','Pilates'],['Ali K.','Boks'],['Ece S.','Diyetisyen']],
 clients:['Ataşehir Koşu','Spor Lisesi','Kurumsal Wellness','Bisiklet Kulübü','Yoga Kampı','Maraton Grubu'],words:['güç','denge','enerji','disiplin'],
 route:['Ataşehir Metro','Pulse Gym','5 dk yürüme'],hook:'Pazartesi başlayacağım deme.',prod:'PT seansı',loyal:'10. derse 1 ders hediye',big:'GÜÇ',weather:'Yağmurda da antrenman',cat:'Spor'},
{brand:'Akademi Plus',handle:'@akademiplus',web:'akademiplus.com',phone:'0 312 000 00 00',area:'Çankaya',addr:'Tunalı Hilmi Cad. No:40',
 items:[['İngilizce A1','₺4.500'],['IELTS hazırlık','₺7.900'],['Almanca','₺5.200'],['Birebir ders','₺900'],['Yaz okulu','₺3.900'],['Online paket','₺2.900']],
 feats:['8 kişilik sınıf','Seviye testi','Sertifika','Online destek','Konuşma kulübü','Esnek saatler'],
 tips:['Her gün 15 dakika','Dizi izleyin altyazılı','Sesli okuyun','Kelime defteri tutun','Hata yapmaktan korkmayın'],donts:['Sadece gramer çalışmak','Ezberlemek','Ara vermek'],
 myth:['Yetişkinler dil öğrenemez','Düzenli pratikle her yaşta öğrenilir'],faq:['Seviye testi ücretli mi?','Hayır, ücretsiz.'],
 reviews:[['IELTS\'ten 7.5 aldım.','Zeynep A.'],['Konuşmaya cesaret ettim.','Kaan B.'],['Hocalar çok sabırlı.','Melis D.']],
 stats:{n:'3.200+',nl:'mezun',yr:'12',rt:'4.9',rv:'540'},hist:[['2014','İlk sınıf'],['2018','IELTS merkezi'],['2021','Online kampüs'],['2026','Almanca bölümü']],
 week:[['Pzt','Gramer'],['Sal','Konuşma'],['Çar','Yazma'],['Per','Dinleme'],['Cmt','Film kulübü']],
 ev:['Ücretsiz Deneme Dersi','19 KASIM','Çankaya · 18:00'],off:'%25',offT:'Erken kayıtta',code:'PLUS25',
 prize:['Ücretsiz ders','Kitap seti','%20 indirim','Sertifika','Defter','Tekrar dene'],team:[['Ayşe D.','İngilizce'],['Hans M.','Almanca'],['Elif K.','IELTS'],['Okan T.','Koordinatör']],
 clients:['Tekno Üniversite','Kariyer Merkezi','Kent Lisesi','Yazılım AŞ','Dil Kulübü','Öğrenci Konseyi'],words:['konuş','anla','yaz','başar'],
 route:['Kızılay Metro','Akademi Plus','6 dk yürüme'],hook:'Yıllardır İngilizce çalışıp konuşamıyor musun?',prod:'Birebir ders',loyal:'Arkadaşını getir %10',big:'ÖĞREN',weather:'Yağmurlu günlere online ders',cat:'Eğitim'},
{brand:'Rota Oto',handle:'@rotaoto',web:'rotaoto.com',phone:'0 850 000 00 00',area:'Maslak',addr:'Oto Center No:8',
 items:[['Kompakt SUV','₺1.890.000'],['Sedan dizel','₺1.450.000'],['Periyodik bakım','₺4.900'],['Lastik değişimi','₺650'],['Detaylı yıkama','₺1.200'],['Ekspertiz','₺2.500']],
 feats:['Ekspertiz raporlu','Takas imkânı','2 yıl garanti','Kredi desteği','Yol yardım','Ücretsiz test sürüşü'],
 tips:['Lastik basıncını ayda bir ölçün','Yağı zamanında değiştirin','Kışa antifriz','Aküyü kontrol ettirin','Silecekleri yenileyin'],donts:['Uyarı ışığını görmezden gelmek','Bakımı ertelemek','Yarım depo kışta'],
 myth:['Dizel araç ısınmadan çalışmaz','Modern dizeller 30 saniyede yola çıkabilir'],faq:['Takas yapıyor musunuz?','Evet, ekspertizle.'],
 reviews:[['Aracı 1 günde teslim aldım.','Kerem B.'],['Servis çok şeffaf.','Hakan T.'],['Takas çok kolay oldu.','Sevgi A.']],
 stats:{n:'15.000+',nl:'teslimat',yr:'25',rt:'4.8',rv:'1.980'},hist:[['2001','İlk galeri'],['2010','Servis merkezi'],['2018','Ekspertiz birimi'],['2026','Elektrikli araçlar']],
 week:[['Pzt','Bakım kampanyası'],['Çar','Yeni ilanlar'],['Cum','Test sürüşü'],['Cmt','Açık galeri'],['Paz','Kapalı']],
 ev:['Test Sürüşü Günleri','23 KASIM','Showroom · 10:00'],off:'%0',offT:'12 ay vade farksız',code:'ROTA0',
 prize:['Ücretsiz bakım','Yıkama','Lastik','%10 indirim','Yakıt kartı','Tekrar dene'],team:[['Hakan Y.','Satış'],['Murat K.','Servis şefi'],['Selin A.','Finans'],['Okan T.','Ekspertiz']],
 clients:['Filo Kiralama','Taksi Kooperatifi','Kurumsal Filo','Lojistik AŞ','Oto Kulübü','Sürücü Kursu'],words:['güven','konfor','hız','yol'],
 route:['Maslak Metro','Rota Oto','7 dk'],hook:'Aracının değerini biliyor musun?',prod:'Kompakt SUV',loyal:'5. bakımda yağ bizden',big:'YOL',weather:'Kışa hazırlık paketi',cat:'Otomotiv'},
{brand:'Medika Klinik',handle:'@medikaklinik',web:'medikaklinik.com',phone:'0 212 000 00 00',area:'Şişli',addr:'Halaskargazi Cad. No:100',
 items:[['Check-up','₺2.400'],['Diş temizliği','₺1.500'],['Göz muayenesi','₺1.100'],['Kan tahlili','₺650'],['Diyet danışmanlığı','₺900'],['Kapsamlı check-up','₺4.900']],
 feats:['Aynı gün sonuç','Anlaşmalı sigortalar','Uzman hekimler','Online randevu','Otopark','E-sonuç'],
 tips:['Yılda bir check-up','Günde 2 litre su','30 dakika yürüyüş','Şekeri azaltın','7 saat uyku'],donts:['Doktorsuz antibiyotik','Belirtiyi ertelemek','İnternetten teşhis'],
 myth:['Kolesterol sadece kilolularda olur','Zayıf kişilerde de yüksek kolesterol görülebilir'],faq:['Sigortanızla anlaşmalı mıyız?','Tüm büyük özel sigortalarla.'],
 reviews:[['Sonuçlarım aynı gün geldi.','Ahmet Y.'],['Hekimim çok ilgiliydi.','Fatma S.'],['Bekleme yok, çok düzenli.','Cem T.']],
 stats:{n:'40.000+',nl:'hasta',yr:'15',rt:'4.9',rv:'2.100'},hist:[['2011','Şişli kliniği'],['2015','Diş bölümü'],['2020','Online randevu'],['2026','Göz merkezi']],
 week:[['Pzt','Check-up'],['Sal','Diş'],['Çar','Göz'],['Per','Diyet'],['Cmt','Çocuk sağlığı']],
 ev:['Ücretsiz Göz Taraması','26 KASIM','Şişli · 09:00'],off:'%30',offT:'Check-up paketinde',code:'SAGLIK30',
 prize:['Ücretsiz tahlil','Diş temizliği','%20 indirim','Göz muayenesi','Diyet seansı','Tekrar dene'],team:[['Dr. Selin A.','Dahiliye'],['Dr. Mert K.','Diş'],['Dr. Ece T.','Göz'],['Dyt. Can B.','Diyet']],
 clients:['Kurumsal Sağlık','Okul Taraması','Spor Kulübü','Fabrika İSG','Sigorta Ortağı','Belediye'],words:['güven','özen','hız','sağlık'],
 route:['Osmanbey Metro','Medika Klinik','2 dk yürüme'],hook:'En son ne zaman check-up yaptırdın?',prod:'Check-up',loyal:'Aile paketi %15',big:'SAĞLIK',weather:'Grip mevsimine aşı',cat:'Sağlık'},
{brand:'Fluxa',handle:'@fluxaapp',web:'fluxa.app',phone:'App Store · Google Play',area:'Uygulama',addr:'fluxa.app',
 items:[['Ücretsiz plan','₺0'],['Pro aylık','₺149'],['Pro yıllık','₺1.190'],['Takım','₺490'],['Kurumsal','Teklif'],['Öğrenci','₺79']],
 feats:['Reklamsız','Şifreli veri','Senkronizasyon','Karanlık mod','Akıllı hatırlatıcı','Takvim entegrasyonu'],
 tips:['Günü 3 göreve böl','Sabah planla','Bildirimleri grupla','Haftalık gözden geçir','Tek ekranda başla'],donts:['20 görevlik liste','Her bildirime bakmak','Planı kâğıtta bırakmak'],
 myth:['Çoklu görev verimlidir','Beyin tek seferde tek işe odaklanır'],faq:['Verilerim güvende mi?','Uçtan uca şifreli.'],
 reviews:[['Günüm artık daha düzenli.','Ali R.'],['Arayüzü çok sade.','Ece K.'],['Pro\'ya değdi.','Mert D.']],
 stats:{n:'250.000+',nl:'indirme',yr:'2',rt:'4.8',rv:'12.400'},hist:[['2024','Beta sürüm'],['2025','100 bin indirme'],['2025','Pro plan'],['2026','Takım planı']],
 week:[['Pzt','Yeni özellik'],['Çar','İpucu'],['Cum','Kullanıcı hikâyesi'],['Cmt','Canlı yayın'],['Paz','Haftalık özet']],
 ev:['Fluxa Lansman Canlı Yayını','27 KASIM','Online · 20:00'],off:'%60',offT:'Pro planda',code:'FLUX60',
 prize:['1 ay Pro','3 ay Pro','Tişört','%50 indirim','Sticker','Tekrar dene'],team:[['Ali R.','Kurucu'],['Ece K.','Tasarım'],['Mert D.','Yazılım'],['Naz T.','Destek']],
 clients:['Startup Hub','Freelance Kulübü','Kod Okulu','Ajans Ağı','Tasarım Stüdyosu','Üniversite'],words:['planla','odaklan','bitir','dinlen'],
 route:['İndir','Kaydol','30 saniye'],hook:'Gününü uygulaman mı yönetiyor, sen mi?',prod:'Pro plan',loyal:'Arkadaşını davet et 1 ay Pro',big:'ODAK',weather:'Yağmurlu günlere odak modu',cat:'Teknoloji'},
{brand:'Atelier Events',handle:'@atelierevents',web:'atelierevents.com',phone:'0 532 000 00 00',area:'İstanbul',addr:'Bebek, İstanbul',
 items:[['Kır düğünü','₺180.000'],['Nişan','₺65.000'],['Kına gecesi','₺45.000'],['Doğum günü','₺25.000'],['Kurumsal davet','Teklif'],['Evlilik teklifi','₺18.000']],
 feats:['Tek elden organizasyon','Özel dekor','Sabit fiyat','Mekân keşfi','Fotoğraf dahil','Taksit imkânı'],
 tips:['Tarihi 8 ay önce seçin','Davetli listesini erken yapın','Yedek plan hazırlayın','Müziği önceden seçin','Bütçeye %10 pay bırakın'],donts:['Son ana bırakmak','Her şeyi kendiniz yapmak','Sözleşmesiz çalışmak'],
 myth:['Kır düğünü her zaman ucuzdur','Çadır, ses ve ulaşım maliyeti salonu geçebilir'],faq:['Kaç ay önce rezervasyon?','En az 6 ay önce.'],
 reviews:[['Hayalimizdeki düğün oldu.','Elif & Can'],['Her detay düşünülmüştü.','Seda K.'],['Misafirler hâlâ konuşuyor.','Burak T.']],
 stats:{n:'420+',nl:'organizasyon',yr:'9',rt:'5.0',rv:'310'},hist:[['2017','İlk düğün'],['2019','Kır düğünü konsepti'],['2023','Kurumsal birim'],['2026','Yurt dışı düğünler']],
 week:[['Pzt','Mekân gezisi'],['Çar','Prova'],['Cum','Kına'],['Cmt','Düğün'],['Paz','Brunch davet']],
 ev:['Düğün Fuarı','7 ŞUBAT','Bebek · 11:00'],off:'%15',offT:'2027 düğünlerine',code:'ATELIER15',
 prize:['Ücretsiz dekor','Pasta','Fotoğraf çekimi','%10 indirim','Çiçek','Tekrar dene'],team:[['Seda K.','Kurucu'],['Burak T.','Dekor'],['Naz A.','Planlama'],['Emre Y.','Fotoğraf']],
 clients:['Bebek Otel','Bahçe Mekân','Çiçekçi Lale','Pasta Atölyesi','Müzik Grubu','Foto Stüdyo'],words:['aşk','zarafet','kutlama','hatıra'],
 route:['Bebek Sahili','Atelier Events','5 dk'],hook:'Düğün planı uykularını mı kaçırıyor?',prod:'Kır düğünü',loyal:'Nişan + düğün paketinde %10',big:'AŞK',weather:'Yağmura karşı şeffaf çadır',cat:'Etkinlik'},
{brand:'Azure Bay',handle:'@azurebayhotel',web:'azurebay.com',phone:'0 252 000 00 00',area:'Bodrum',addr:'Gündoğan Koyu',
 items:[['Standart oda','₺4.200'],['Deluxe oda','₺6.100'],['Suit','₺8.900'],['Spa paketi','₺2.500'],['Tekne turu','₺1.800'],['Akşam yemeği','₺1.400']],
 feats:['Denize sıfır','Her şey dahil','Ücretsiz transfer','Spa','Çocuk kulübü','Özel plaj'],
 tips:['Erken rezervasyon yapın','Güneş kremini unutmayın','Gün batımını kaçırmayın','Tekne turuna katılın','Yerel lezzetleri deneyin'],donts:['Öğlen güneşinde yürümek','Son dakika rezervasyon','Su içmeyi unutmak'],
 myth:['Her şey dahil pahalıdır','Ekstraları hesaplayınca çoğu zaman daha ekonomiktir'],faq:['Evcil hayvan kabul ediyor musunuz?','Küçük ırklar için evet.'],
 reviews:[['Manzara inanılmaz.','Ahmet & Elif'],['Personel çok güler yüzlü.','Ceren T.'],['Çocuklar çok eğlendi.','Murat K.']],
 stats:{n:'18.000+',nl:'misafir',yr:'14',rt:'4.9',rv:'2.800'},hist:[['2012','Otel açıldı'],['2016','Spa merkezi'],['2021','Özel plaj'],['2026','Yeni villalar']],
 week:[['Pzt','Tekne turu'],['Sal','Yoga'],['Çar','Barbekü'],['Cum','Canlı müzik'],['Cmt','Gala yemeği']],
 ev:['Yılbaşı Galası','31 ARALIK','Ana salon · 21:00'],off:'%35',offT:'Erken rezervasyonda',code:'AZURE35',
 prize:['1 gece konaklama','Spa','Tekne turu','%15 indirim','Akşam yemeği','Tekrar dene'],team:[['Murat K.','Genel müdür'],['Ceren T.','Misafir ilişkileri'],['Can E.','Şef'],['Lale A.','Spa']],
 clients:['Tatil Ajansı','Düğün Planlayıcı','Kurumsal Kamp','Yoga Retreat','Dalış Kulübü','Yat Kulübü'],words:['mavi','huzur','güneş','tatil'],
 route:['Bodrum Havalimanı','Azure Bay','35 dk'],hook:'Bu yaz hâlâ tatil planın yok mu?',prod:'Deluxe oda',loyal:'3. konaklamada 1 gece hediye',big:'MAVİ',weather:'Güneşli günler burada',cat:'Turizm'},
{brand:'Mavi Vadi',handle:'@mavivadi',web:'mavivadi.com',phone:'0 216 000 00 00',area:'Çekmeköy',addr:'Mavi Vadi Satış Ofisi',
 items:[['1+1','₺4.900.000'],['2+1','₺6.900.000'],['3+1','₺9.750.000'],['4+1 dubleks','₺13.400.000'],['Bahçe katı','₺7.800.000'],['Ofis','₺3.900.000']],
 feats:['Deprem yönetmeliği','Havuz','Kapalı otopark','7/24 güvenlik','Çocuk parkı','120 ay vade'],
 tips:['Zemin etüdünü sorun','Tapu durumunu kontrol edin','Aidatı öğrenin','Ulaşımı deneyin','Teslim tarihini yazılı alın'],donts:['Sözleşmesiz kapora','Sadece fiyata bakmak','Etüt raporu sormamak'],
 myth:['Yeni bina her zaman depreme dayanıklıdır','Dayanıklılık zemin etüdü ve denetimle kanıtlanır'],faq:['Teslim ne zaman?','Haziran 2027.'],
 reviews:[['Satış süreci çok şeffaftı.','Ayşe K.'],['Örnek daire çok etkileyici.','Okan T.'],['Vade seçenekleri harika.','Derya S.']],
 stats:{n:'1.200+',nl:'teslim edilen konut',yr:'26',rt:'4.8',rv:'380'},hist:[['2000','İlk proje'],['2012','500. konut'],['2020','Mavi Vadi 1. etap'],['2027','3. etap teslim']],
 week:[['Pzt','Örnek daire'],['Çar','Şantiye turu'],['Cum','Kredi günü'],['Cmt','Aile günü'],['Paz','Örnek daire']],
 ev:['Açık Ev Günü','30 KASIM','Örnek daire · 11:00'],off:'%10',offT:'Peşin alımda',code:'VADI10',
 prize:['Beyaz eşya','Mobilya çeki','%2 indirim','Aidat 1 yıl','Klima','Tekrar dene'],team:[['Okan T.','Proje müdürü'],['Derya S.','Satış'],['Ayşe K.','Mimar'],['Cem Y.','Mühendis']],
 clients:['Yapı Denetim','Kredi Bankası','Mimarlık Ofisi','Peyzaj Stüdyosu','Asansör AŞ','Beton Firması'],words:['huzur','güven','doğa','yaşam'],
 route:['Çekmeköy Metro','Mavi Vadi','6 dk'],hook:'Kiraya mı ödüyorsun, evine mi?',prod:'3+1',loyal:'Arkadaşını getir 1 yıl aidat bizden',big:'EV',weather:'Her mevsim yeşil',cat:'Emlak'},
{brand:'Kuzey Kreatif',handle:'@kuzeykreatif',web:'kuzeykreatif.com',phone:'info@kuzeykreatif.com',area:'Levent',addr:'Levent Ofis No:3',
 items:[['Sosyal medya','₺15.000'],['Reklam yönetimi','₺12.000'],['Logo & kimlik','₺45.000'],['Video prodüksiyon','₺25.000'],['Web sitesi','₺60.000'],['SEO','₺9.000']],
 feats:['Aylık rapor','Tek muhatap','Şeffaf fiyat','Hızlı teslim','Strateji dahil','Taahhütsüz'],
 tips:['İlk 3 saniyeyi düşünün','Tek mesaj verin','Altyazı ekleyin','Düzenli paylaşın','Yorumlara cevap verin'],donts:['Her gün aynı format','Satış dili dolu metin','Rapor bakmadan bütçe'],
 myth:['Çok takipçi çok satış demektir','Doğru kitle küçük olsa da daha çok satış getirir'],faq:['Sözleşme süresi?','En az 3 ay öneriyoruz.'],
 reviews:[['Satışlarımız 2 katına çıktı.','Okan T.'],['Raporlar çok net.','Esra B.'],['Hızlı ve yaratıcı ekip.','Cem A.']],
 stats:{n:'120+',nl:'marka',yr:'9',rt:'5.0',rv:'140'},hist:[['2017','Kuruluş'],['2019','Video stüdyosu'],['2022','50. marka'],['2026','Yapay zekâ birimi']],
 week:[['Pzt','Strateji'],['Sal','Çekim'],['Çar','Kurgu'],['Per','Yayın'],['Cum','Rapor']],
 ev:['Dijital Pazarlama Atölyesi','21 KASIM','Levent · 14:00'],off:'%20',offT:'Yıllık anlaşmada',code:'KUZEY20',
 prize:['Ücretsiz analiz','Logo revizyon','%15 indirim','Reels çekimi','Danışmanlık','Tekrar dene'],team:[['Esra B.','Kreatif direktör'],['Cem A.','Video'],['Deniz K.','Reklam'],['Nil T.','Tasarım']],
 clients:['Cafe Luna','Studio Rose','Pulse Gym','Norde','Rota Oto','Azure Bay'],words:['strateji','içerik','reklam','büyüme'],
 route:['Levent Metro','Kuzey Kreatif','3 dk'],hook:'Reklamına para verip sonuç alamıyor musun?',prod:'Sosyal medya',loyal:'Referansınla 1 ay %50',big:'MARKA',weather:'Her havada kampanya',cat:'Ajans'}
];

// ===== Reklam türleri 4A: sayaç, karusel, etiket, puan, mesajlar, DM, bildirim, arama, sepet, rota, grafik, halka =====
const SP=s=>String(s||'').split('·').map(z=>z.trim()).filter(Boolean);
function tx(c,s,x,y,o={}){const size=o.size||48;c.font=font(o.wt||700,size,o.fam||BODY);c.fillStyle=o.col||'#fff';c.textAlign=o.al||'left';const L=wrap(c,String(s||''),o.w||900,o.l||2);const lh=size*(o.lh||1.2);L.forEach((l,i)=>c.fillText(l,x,y+i*lh));c.textAlign='left';return L.length*lh}
function TT(c,f,t,st,y=380,size=90,l=2,al){const a=al||st.align;return gTxt(c,f.title,a==='center'?W/2:80,y,size,.2,t,{...st,align:a},fgOf(f.p),{align:a,l})}
function ini(s){return String(s||'').replace(/[^A-Za-zÇĞİÖŞÜçğıöşü ]/g,'').split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toLocaleUpperCase('tr')||'Z'}
const LJ=(a,k)=>a.map(x=>Array.isArray(x)?x.join(' · '):x).slice(0,k).join('\n');
const ARCH4={
sayac:{n:'Geri Sayım Saati',dur:6,map:L=>({title:L.ev[0],sub:L.ev[1]+' · '+L.ev[2],d1:'03:12:45',cta:'Hatırlatıcı kur'}),labels:{title:'Etkinlik',sub:'Tarih ve yer',d1:'Kalan süre (GG:SS:DD)',cta:'Çağrı'},max:{d1:8},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['Sayaç',.8,6],['Bilgi',1.8,2.4],['Çağrı',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,420,86,2,'center');const parts=String(f.d1||'00:00:00').split(':').map(x=>parseInt(x)||0);while(parts.length<3)parts.unshift(0);
  let sec=parts[0]*3600*24+parts[1]*3600+parts[2]*60-Math.floor(t);if(sec<0)sec=0;const vals=[Math.floor(sec/86400),Math.floor(sec%86400/3600),Math.floor(sec%3600/60)];const labs=['GÜN','SAAT','DAKİKA'];const sec2=59-Math.floor(t*1)%60;
  const tw=230,gap=40,x0=W/2-(tw*3+gap*2)/2,y0=720;const e=eback(prog(t,.8,1.4));
  vals.forEach((v,i)=>{const x=x0+i*(tw+gap);const k=clamp(e,0,1.1);c.save();c.translate(x+tw/2,y0+150);c.scale(k,k);c.translate(-tw/2,-150);rr(c,0,0,tw,300,30);c.fillStyle=mix(f.p,fg,.1);c.fill();c.fillStyle=fgA(f.p,.12);c.fillRect(0,148,tw,4);
   const flip=i===2?(t%1):0;c.font=font(900,190,COND);c.textAlign='center';c.fillStyle=f.a;c.save();if(i===2&&flip<.18){c.translate(tw/2,150);c.scale(1,1-flip/.18*.9+.1);c.translate(-tw/2,-150)}c.fillText(String(v).padStart(2,'0'),tw/2,218);c.restore();
   c.font=font(500,26,MONO);c.fillStyle=fgA(f.p,.6);c.fillText(labs[i],tw/2,350);c.restore()});
  c.font=font(500,30,MONO);c.textAlign='center';c.fillStyle=fgA(f.p,.5);c.globalAlpha=eo(prog(t,1.4,1.8));c.fillText(String(sec2).padStart(2,'0')+' SANİYE',W/2,1150);c.globalAlpha=1;
  gSmall(c,f.sub,W/2,1300,46,1.8,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1480,2.4,t,f,'center');logoCorner(c,A,t,2.6,W/2,H-180,120)}},
karusel:{n:'Ürün Karuseli',dur:7,map:L=>({title:'Bu haftanın favorileri',d1:L.items[0].join(' · '),d2:L.items[1].join(' · '),d3:L.items[3].join(' · '),cta:'Hepsini gör'}),labels:{title:'Başlık',d1:'Ürün 1 (ad · fiyat)',d2:'Ürün 2',d3:'Ürün 3',cta:'Çağrı'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Kartlar',.8,7],['Çağrı',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,380,88,2,'center');const P=[f.d1,f.d2,f.d3].map(SP);const step=1.6;const ph=Math.max(0,t-.8)/step;const cur=Math.floor(ph),fr=eio(clamp((ph-cur-.6)/.4));const pos=cur+fr;
  const ent=eo(prog(t,.6,1.3));for(let k=-2;k<=2;k++){const i=((Math.floor(pos)+k)%3+3)%3;const off=k-(pos-Math.floor(pos));const x=W/2+off*560+(1-ent)*800,y=1000;const s=1-Math.min(1,Math.abs(off))*.22;const w=600,h=760;
   c.save();c.globalAlpha=clamp(1-Math.abs(off)*.55)*ent;c.translate(x,y);c.scale(s,s);rr(c,-w/2,-h/2,w,h,48);c.fillStyle=Math.abs(off)<.5?f.a:mix(f.p,fg,.1);c.fill();const tc=Math.abs(off)<.5?onColor(f.a):fg;
   c.save();rr(c,-w/2+30,-h/2+30,w-60,420,32);c.clip();c.fillStyle=Math.abs(off)<.5?'rgba(0,0,0,.14)':fgA(f.p,.08);c.fillRect(-w/2,-h/2,w,h);icon(c,'foto',0,-h/2+240,140,tc,3);c.restore();
   c.textAlign='center';c.font=font(800,52,BODY);c.fillStyle=tc;wrap(c,P[i][0]||'',w-80,2).forEach((l,j)=>c.fillText(l,0,140+j*60));c.font=font(900,92,COND);c.fillText(P[i][1]||'',0,320);c.restore()}
  [0,1,2].forEach(i=>{c.beginPath();c.arc(W/2+(i-1)*40,1460,i===((Math.round(pos)%3)+3)%3?12:8,0,Math.PI*2);c.fillStyle=i===((Math.round(pos)%3)+3)%3?f.a:fgA(f.p,.3);c.fill()});
  gPill(c,f.cta,W/2,1600,3,t,f,'center');c.textAlign='left';logoCorner(c,A,t,3,W-150,170,110)}},
etiket:{n:'Fiyat Etiketi',dur:6,map:L=>({title:L.items[2][0],d1:L.items[2][1],sub:L.feats[0],cta:'Hemen sipariş ver'}),labels:{title:'Ürün',d1:'Fiyat',sub:'Özellik',cta:'Çağrı'},max:{d1:14},
 tracks:[['Zemin',0,6,1],['Etiket',.1,1.2],['Ürün',1,1.6],['Özellik',1.6,2.2],['Çağrı',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const sw=Math.sin(t*2.2)*.12*Math.exp(-t*.35)+(1-eo(prog(t,.1,1.1)))*.6;const px=W/2,py=180;
  c.strokeStyle=fgA(f.p,.5);c.lineWidth=4;c.beginPath();c.moveTo(px,0);c.lineTo(px,py);c.stroke();c.beginPath();c.arc(px,py,16,0,Math.PI*2);c.fillStyle=fg;c.fill();
  c.save();c.translate(px,py);c.rotate(sw);const w=620,h=900,y=120;c.beginPath();c.moveTo(-w/2+120,y);c.lineTo(w/2-120,y);c.lineTo(w/2,y+150);c.lineTo(w/2,y+h);c.lineTo(-w/2,y+h);c.lineTo(-w/2,y+150);c.closePath();c.fillStyle=f.a;c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=40;c.shadowOffsetY=20;c.fill();c.shadowColor='transparent';
  c.beginPath();c.arc(0,y+110,30,0,Math.PI*2);c.fillStyle=f.p;c.fill();c.strokeStyle=onColor(f.a);c.lineWidth=2;c.setLineDash([10,8]);rr(c,-w/2+30,y+190,w-60,h-220,24);c.globalAlpha=.4;c.stroke();c.globalAlpha=1;c.setLineDash([]);
  const tc=onColor(f.a);c.textAlign='center';c.font=font(500,28,MONO);c.fillStyle=tc;c.globalAlpha=.7;setLS(c,6);c.fillText('FİYAT',0,y+290);setLS(c,0);c.globalAlpha=1;const sz=fitFont(c,String(f.d1),w-100,190,80);c.font=font(900,sz,COND);c.fillText(f.d1,0,y+290+sz*.95);
  c.globalAlpha=eo(prog(t,1,1.6));c.font=font(800,54,BODY);wrap(c,f.title,w-110,2).forEach((l,i)=>c.fillText(l,0,y+620+i*64));c.globalAlpha=1;c.restore();
  gSmall(c,f.sub,W/2,1340,46,1.6,t,fgA(f.p,.85),'center',900,1,700);gPill(c,f.cta,W/2,1500,2.2,t,f,'center');c.textAlign='left';logoCorner(c,A,t,2.4,W/2,H-170,120)}},
puan:{n:'Yıldız Puanı',dur:6,map:L=>({title:'Google puanımız',d1:L.stats.rt,d2:L.stats.rv+' yorum',sub:'“'+L.reviews[0][0]+'”',cta:L.reviews[0][1]}),labels:{title:'Başlık',d1:'Puan',d2:'Yorum sayısı',sub:'Öne çıkan yorum',cta:'Yorumu yapan'},max:{d1:4},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['Puan',.6,1.8],['Yıldızlar',1,2.2],['Yorum',2.2,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,380,84,2,'center');const target=parseFloat(String(f.d1).replace(',','.'))||5;const v=target*eo(prog(t,.6,1.8));
  c.textAlign='center';c.font=font(900,330,COND);c.fillStyle=fg;c.fillText(v.toFixed(1).replace('.',','),W/2,860);c.font=font(500,40,MONO);c.fillStyle=fgA(f.p,.55);c.fillText('/ 5',W/2+250,860);
  for(let i=0;i<5;i++){const k=clamp(eback(prog(t,1+i*.15,1.4+i*.15)),0,1.2);const fill=clamp(target-i);c.save();c.translate(W/2+(i-2)*150,1010);c.scale(k,k);star(c,0,0,62);c.fillStyle=fgA(f.p,.15);c.fill();if(fill>0){c.save();c.beginPath();c.rect(-62,-62,124*fill,124);c.clip();star(c,0,0,62);c.fillStyle=f.a;c.fill();c.restore()}c.restore()}
  c.globalAlpha=eo(prog(t,1.6,2.1));c.font=font(700,40,BODY);c.fillStyle=fgA(f.p,.75);c.fillText(f.d2,W/2,1140);c.globalAlpha=1;
  const q=eo(prog(t,2.2,2.9));if(q>0){c.globalAlpha=q;rr(c,110,1240+(1-q)*40,W-220,330,40);c.fillStyle=fgA(f.p,.08);c.fill();c.font=font(500,46,SERIF).replace('500','italic 500');c.fillStyle=fg;wrap(c,f.sub,W-320,3).forEach((l,i)=>c.fillText(l,W/2,1340+(1-q)*40+i*58));c.font=font(700,32,BODY);c.fillStyle=f.a;c.fillText('— '+f.cta,W/2,1530+(1-q)*40);c.globalAlpha=1}c.textAlign='left';logoCorner(c,A,t,2.6,W/2,H-150,110)}},
mesajlar:{n:'Müşteri Mesajları',dur:7,map:L=>({title:'Sizden gelenler',d1:L.reviews[0].join(' · '),d2:L.reviews[1].join(' · '),d3:L.reviews[2].join(' · ')}),labels:{title:'Başlık',d1:'Mesaj 1 (metin · isim)',d2:'Mesaj 2',d3:'Mesaj 3'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Mesaj 1',1,1.5],['Mesaj 2',1.8,2.3],['Mesaj 3',2.6,3.1]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,90,2);[f.d1,f.d2,f.d3].forEach((s,i)=>{const p=SP(s);const tt=1+i*.8;const k=eback(prog(t,tt,tt+.45));if(k<=0)return;const right=i%2===1;const y=620+i*360;c.font=font(600,46,BODY);const L=wrap(c,p[0]||'',620,3);const bw=Math.max(...L.map(l=>c.measureText(l).width))+80,bh=L.length*58+70;const x=right?W-80-bw:80;
   if(t<tt+.15){c.fillStyle=fgA(f.p,.12);rr(c,x,y,180,90,45);c.fill();for(let d=0;d<3;d++){c.beginPath();c.arc(x+50+d*40,y+45,9+3*Math.sin(t*12+d),0,Math.PI*2);c.fillStyle=fgA(f.p,.5);c.fill()}return}
   c.save();c.translate(right?x+bw:x,y+bh);c.scale(clamp(k,0,1.05),clamp(k,0,1.05));c.translate(right?-(x+bw):-x,-(y+bh));rr(c,x,y,bw,bh,40);c.fillStyle=right?f.a:fgA(f.p,.1);c.fill();c.beginPath();if(right){c.moveTo(x+bw-30,y+bh-4);c.lineTo(x+bw+14,y+bh+18);c.lineTo(x+bw-70,y+bh-4)}else{c.moveTo(x+30,y+bh-4);c.lineTo(x-14,y+bh+18);c.lineTo(x+70,y+bh-4)}c.fill();
   c.fillStyle=right?onColor(f.a):fg;c.font=font(600,46,BODY);L.forEach((l,j)=>c.fillText(l,x+40,y+75+j*58));c.restore();c.font=font(500,28,MONO);c.fillStyle=fgA(f.p,.6);c.textAlign=right?'right':'left';c.fillText((p[1]||'').toLocaleUpperCase('tr'),right?x+bw:x,y+bh+60);c.textAlign='left'});logoCorner(c,A,t,3,W/2,H-150,110)}},
dm:{n:'DM Sohbeti',dur:7,map:L=>({title:L.handle,d1:L.faq[0],d2:L.faq[1],sub:'Sorularınız için DM\'den yazın'}),labels:{title:'Hesap adı',d1:'Müşteri sorusu',d2:'Cevabınız',sub:'Alt not'},
 tracks:[['Zemin',0,7,1],['Ekran',.1,.8],['Soru',.9,1.4],['Yazıyor',1.6,2.6],['Cevap',2.6,3.2],['Not',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.1,.8));const x0=120,y0=230,w=W-240,h=1300;c.save();c.globalAlpha=e;c.translate(0,(1-e)*120);rr(c,x0,y0,w,h,60);c.fillStyle=mix(f.p,fg,.06);c.fill();c.strokeStyle=fgA(f.p,.15);c.lineWidth=3;c.stroke();
  c.beginPath();c.arc(x0+90,y0+90,44,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(900,44,COND);c.textAlign='center';c.fillStyle=onColor(f.a);c.fillText(ini(String(f.title).replace('@','')),x0+90,y0+106);c.textAlign='left';c.font=font(800,40,BODY);c.fillStyle=fg;c.fillText(f.title,x0+160,y0+88);c.font=font(500,24,MONO);c.fillStyle=OKC;c.fillText('● ÇEVRİMİÇİ',x0+160,y0+124);
  c.fillStyle=fgA(f.p,.1);c.fillRect(x0,y0+180,w,2);
  const bub=(txt,y,right,k)=>{c.font=font(600,44,BODY);const L=wrap(c,txt,w-260,4);const bw=Math.max(...L.map(l=>c.measureText(l).width))+70,bh=L.length*56+56;const x=right?x0+w-40-bw:x0+40;c.save();c.globalAlpha*=k;c.translate(0,(1-k)*30);rr(c,x,y,bw,bh,36);c.fillStyle=right?f.a:fgA(f.p,.12);c.fill();c.fillStyle=right?onColor(f.a):fg;L.forEach((l,j)=>c.fillText(l,x+35,y+66+j*56));c.restore();return bh};
  const q=eo(prog(t,.9,1.4));let y=y0+240;if(q>0)y+=bub(f.d1,y,false,q)+40;if(t>1.6&&t<2.6){rr(c,x0+w-220,y,180,84,42);c.fillStyle=fgA(f.p,.15);c.fill();for(let d=0;d<3;d++){c.beginPath();c.arc(x0+w-170+d*40,y+42,9+3*Math.sin(t*12+d),0,Math.PI*2);c.fillStyle=fg;c.fill()}}
  const a=eo(prog(t,2.6,3.1));if(a>0)bub(f.d2,y,true,a);c.restore();gSmall(c,f.sub,W/2,1680,40,3.4,t,fgA(f.p,.75),'center',900,1,600);logoCorner(c,A,t,3.6,W/2,H-120,100)}},
bildirim:{n:'Bildirimler',dur:6,map:L=>({title:L.brand,d1:L.offT+' '+L.off+' indirim',d2:L.items[0][0]+' stokta',d3:'Siparişin yolda',sub:L.hook}),labels:{title:'Uygulama/marka adı',d1:'Bildirim 1',d2:'Bildirim 2',d3:'Bildirim 3',sub:'Alt başlık'},
 tracks:[['Zemin',0,6,1],['Bildirim 1',.3,.8],['Bildirim 2',1.1,1.6],['Bildirim 3',1.9,2.4],['Başlık',2.6,3.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.font=font(200,240,BODY);c.textAlign='center';c.fillStyle=fgA(f.p,.12);const hh=new Date(2026,9,24,9,41+Math.floor(t/3));c.fillText('09:4'+(1+Math.floor(t/3)),W/2,400);c.font=font(500,36,BODY);c.fillText('Cumartesi, 24 Ekim',W/2,470);c.textAlign='left';
  [f.d1,f.d2,f.d3].forEach((s,i)=>{const tt=.3+i*.8;const k=eback(prog(t,tt,tt+.5));if(k<=0)return;const y=560+i*230+(1-clamp(k))*-260;c.save();c.globalAlpha=clamp(k);rr(c,70,y,W-140,200,44);c.fillStyle=lum(f.p)>.45?'rgba(255,255,255,.85)':'rgba(255,255,255,.1)';c.fill();c.strokeStyle=fgA(f.p,.12);c.lineWidth=2;c.stroke();
   rr(c,110,y+40,120,120,30);c.fillStyle=f.a;c.fill();c.font=font(900,64,COND);c.textAlign='center';c.fillStyle=onColor(f.a);c.fillText(ini(f.title),170,y+122);c.textAlign='left';
   c.font=font(800,34,BODY);c.fillStyle=fg;c.fillText(String(f.title).toLocaleUpperCase('tr'),270,y+78);c.font=font(500,26,MONO);c.fillStyle=fgA(f.p,.5);c.textAlign='right';c.fillText(i===0?'şimdi':i+' dk önce',W-110,y+78);c.textAlign='left';c.font=font(600,40,BODY);c.fillStyle=fg;c.fillText(wrap(c,s,W-420,1)[0]||'',270,y+140);c.restore()});
  c.textAlign='center';gTxt(c,f.sub,W/2,1420,74,2.6,t,{...st,align:'center'},fg,{align:'center',l:3});c.textAlign='left';logoCorner(c,A,t,3,W/2,H-160,110)}},
arama:{n:'Arama Çubuğu',dur:7,map:L=>({d1:'en iyi '+L.cat.toLocaleLowerCase('tr')+' '+L.area.split(',')[0],title:L.brand,sub:L.stats.rt+' ★ · '+L.stats.rv+' yorum',d2:L.area,cta:L.web}),labels:{d1:'Arama metni',title:'Marka',sub:'Puan satırı',d2:'Konum',cta:'Web'},
 tracks:[['Zemin',0,7,1],['Arama',.3,2.2],['Sonuç',2.4,3],['Diğerleri',2.8,3.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.1,.6));c.globalAlpha=e;rr(c,80,360,W-160,130,65);c.fillStyle=lum(f.p)>.45?'#FFFFFF':fgA(f.p,.1);c.fill();c.strokeStyle=f.a;c.lineWidth=4;c.stroke();
  c.strokeStyle=fg;c.lineWidth=6;c.beginPath();c.arc(170,420,24,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(188,438);c.lineTo(206,456);c.stroke();
  const q=String(f.d1||'');const n=Math.floor(clamp((t-.5)/1.5)*q.length);c.font=font(600,46,BODY);c.fillStyle=fg;c.fillText(q.slice(0,n),240,440);if(n<q.length||Math.floor(t*2.4)%2===0){c.fillRect(244+c.measureText(q.slice(0,n)).width,395,4,58)}c.globalAlpha=1;
  const r=eo(prog(t,2.4,3));if(r>0){c.save();c.globalAlpha=r;c.translate(0,(1-r)*60);rr(c,80,560,W-160,420,40);c.fillStyle=f.a;c.fill();const tc=onColor(f.a);c.font=font(500,26,MONO);c.fillStyle=tc;c.globalAlpha=r*.7;c.fillText('1. SONUÇ',130,630);c.globalAlpha=r;c.font=font(900,96,COND);c.fillText(f.title,130,740);c.font=font(700,40,BODY);c.fillText(f.sub,130,810);c.font=font(500,34,BODY);c.fillText(f.d2,130,870);c.font=font(700,34,MONO);c.fillText(f.cta+' ↗',130,930);c.restore()}
  for(let i=0;i<3;i++){const k=eo(prog(t,2.8+i*.15,3.3+i*.15));if(k<=0)continue;c.globalAlpha=k*.6;const y=1030+i*190;rr(c,80,y,W-160,160,32);c.fillStyle=fgA(f.p,.08);c.fill();c.fillStyle=fgA(f.p,.25);rr(c,130,y+45,360,28,14);c.fill();rr(c,130,y+95,560,22,11);c.fill();c.globalAlpha=1}logoCorner(c,A,t,3,W/2,H-170,110)}},
sepet:{n:'Sepet',dur:7,map:L=>({title:'Sepetin hazır',d1:L.items[0].join(' · '),d2:L.items[1].join(' · '),d3:L.code+' · '+L.off,cta:'Siparişi tamamla'}),labels:{title:'Başlık',d1:'Ürün 1 (ad · fiyat)',d2:'Ürün 2',d3:'Kupon (kod · indirim)',cta:'Çağrı'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Ürünler',.9,2],['Kupon',2.2,2.8],['Toplam',2.8,3.4],['Çağrı',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,90,2);const rows=[SP(f.d1),SP(f.d2)];const num=s=>parseFloat(String(s||'').replace(/[^\d,]/g,'').replace(/\./g,'').replace(',','.'))||0;
  rows.forEach((p,i)=>{const k=eback(prog(t,.9+i*.4,1.4+i*.4));if(k<=0)return;const y=520+i*230;c.save();c.translate(W/2,y+90);c.scale(clamp(k,0,1.04),clamp(k,0,1.04));c.translate(-W/2,-(y+90));rr(c,80,y,W-160,180,36);c.fillStyle=fgA(f.p,.08);c.fill();rr(c,110,y+30,120,120,24);c.fillStyle=mix(f.a,f.p,.6);c.fill();icon(c,'foto',170,y+90,70,f.a,3);
   c.font=font(700,46,BODY);c.fillStyle=fg;c.fillText(wrap(c,p[0]||'',480,1)[0]||'',260,y+80);c.font=font(500,28,MONO);c.fillStyle=fgA(f.p,.5);c.fillText('ADET 1',260,y+130);c.font=font(900,64,COND);c.textAlign='right';c.fillText(p[1]||'',W-120,y+110);c.textAlign='left';c.restore()});
  const cp=SP(f.d3);const ck=eo(prog(t,2.2,2.8));if(ck>0){c.globalAlpha=ck;c.setLineDash([12,10]);rr(c,80,1010,W-160,120,30);c.strokeStyle=f.a;c.lineWidth=4;c.stroke();c.setLineDash([]);c.font=font(700,40,MONO);c.fillStyle=f.a;c.fillText('✓ '+(cp[0]||''),120,1084);c.textAlign='right';c.font=font(900,60,COND);c.fillText('-'+(cp[1]||''),W-120,1090);c.textAlign='left';c.globalAlpha=1}
  const tot=num(rows[0][1])+num(rows[1][1]);const pc=num(cp[1]);const fin=tot*(1-pc/100);const tk=eo(prog(t,2.8,3.4));if(tk>0){c.globalAlpha=tk;c.fillStyle=fgA(f.p,.15);c.fillRect(80,1180,W-160,3);c.font=font(700,44,BODY);c.fillStyle=fg;c.fillText('Toplam',90,1270);c.textAlign='right';c.font=font(900,96,COND);c.fillStyle=f.a;c.fillText('₺'+Math.round(fin*clamp(tk)).toLocaleString('tr-TR'),W-90,1285);c.textAlign='left';c.globalAlpha=1}
  gPill(c,f.cta,W/2,1440,3.4,t,f,'center');logoCorner(c,A,t,3.6,W/2,H-170,110)}},
rota:{n:'Rota',dur:6,map:L=>({title:'Bize nasıl gelinir?',d1:L.route[0],d2:L.route[1],d3:L.route[2],sub:L.addr}),labels:{title:'Başlık',d1:'Başlangıç',d2:'Varış',d3:'Süre',sub:'Adres'},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['Harita',.4,1],['Rota',1,2.6],['Süre',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,88,2);const mx=80,my=520,mw=W-160,mh=900;const e=eo(prog(t,.4,1));c.globalAlpha=e;rr(c,mx,my,mw,mh,44);c.fillStyle=mix(f.p,fg,.06);c.fill();c.save();rr(c,mx,my,mw,mh,44);c.clip();
  c.strokeStyle=fgA(f.p,.1);c.lineWidth=18;for(let i=0;i<6;i++){c.beginPath();c.moveTo(mx,my+120+i*150+sr(i)*40);c.lineTo(mx+mw,my+60+i*150+sr(i+9)*80);c.stroke()}for(let i=0;i<5;i++){c.beginPath();c.moveTo(mx+80+i*200,my);c.lineTo(mx+60+i*210+sr(i+3)*60,my+mh);c.stroke()}
  c.fillStyle=mix(f.a,f.p,.8);c.beginPath();c.ellipse(mx+mw*.75,my+mh*.25,150,90,.3,0,Math.PI*2);c.fill();c.restore();
  const pts=[[mx+120,my+mh-120],[mx+300,my+mh-260],[mx+260,my+420],[mx+560,my+360],[mx+mw-160,my+180]];const L=eio(prog(t,1,2.6));const seg=pts.length-1;const lp=L*seg;
  c.strokeStyle=f.a;c.lineWidth=14;c.lineCap='round';c.lineJoin='round';c.setLineDash([2,26]);c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<=seg;i++){if(i-1>lp)break;const k=clamp(lp-(i-1));c.lineTo(lerp(pts[i-1][0],pts[i][0],k),lerp(pts[i-1][1],pts[i][1],k))}c.stroke();c.setLineDash([]);c.lineCap='butt';
  const pin=(x,y,lab,col,k)=>{if(k<=0)return;c.save();c.translate(x,y);c.scale(k,k);icon(c,'konum',0,-40,90,col,5);c.restore();c.font=font(700,32,BODY);c.fillStyle=fg;c.fillText(lab,x+50,y-30)};
  pin(...pts[0],f.d1,fg,clamp(eback(prog(t,.8,1.2))));pin(...pts[seg],f.d2,f.a,clamp(eback(prog(t,2.5,2.9))));c.globalAlpha=1;
  const q=eback(clamp(prog(t,2.6,3.2)));if(q>0){c.save();c.translate(W/2,1540);c.scale(q,q);c.font=font(900,64,COND);const tw=c.measureText(f.d3).width+120;rr(c,-tw/2,-60,tw,120,60);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d3,0,22);c.restore()}
  gSmall(c,f.sub,W/2,1700,40,3,t,fgA(f.p,.75),'center',900,1,600);logoCorner(c,A,t,3,W-150,170,110)}},
grafik:{n:'Büyüme Grafiği',dur:7,map:L=>({title:'Yıllar içinde büyüdük',d1:L.hist.map(h=>h[0]).join(' · '),sub:L.stats.n+' '+L.stats.nl,cta:'Teşekkürler!'}),labels:{title:'Başlık',d1:'Yıllar (· ile ayır)',sub:'Alt metin',cta:'Kapanış'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Eksen',.8,1.2],['Çubuklar',1.2,3],['Metin',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,88,2);const Y=SP(f.d1).slice(0,5);const n=Y.length||4;const x0=120,y0=1350,w=W-240,h=720;const ax=eo(prog(t,.8,1.2));
  c.strokeStyle=fgA(f.p,.25);c.lineWidth=3;c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+w*ax,y0);c.stroke();for(let g=1;g<=3;g++){c.strokeStyle=fgA(f.p,.07);c.beginPath();c.moveTo(x0,y0-g*h/3);c.lineTo(x0+w*ax,y0-g*h/3);c.stroke()}
  const bw=w/n*.58;Y.forEach((yr,i)=>{const v=(i+1)/n*.9+.08;const k=eback(clamp(prog(t,1.2+i*.3,1.9+i*.3)));const bh=h*v*clamp(k,0,1.05);const x=x0+w/n*i+(w/n-bw)/2;const last=i===n-1;
   rr(c,x,y0-bh,bw,bh,18);c.fillStyle=last?f.a:fgA(f.p,.2);c.fill();c.font=font(700,34,MONO);c.fillStyle=fgA(f.p,.7);c.textAlign='center';c.fillText(yr,x+bw/2,y0+56);if(last&&k>.6){c.font=font(900,60,COND);c.fillStyle=f.a;c.fillText('▲',x+bw/2,y0-bh-30)}c.textAlign='left'});
  gSmall(c,f.sub,W/2,1530,52,3,t,fg,'center',900,1,800);gPill(c,f.cta,W/2,1680,3.4,t,f,'center');logoCorner(c,A,t,3.4,W-150,170,110)}},
halka:{n:'Memnuniyet Halkası',dur:6,map:L=>({d1:'%96',title:'müşterimiz bizi tavsiye ediyor',sub:L.stats.rv+' değerlendirmeden',cta:L.brand}),labels:{d1:'Yüzde',title:'Açıklama',sub:'Kaynak',cta:'Marka'},max:{d1:5},
 tracks:[['Zemin',0,6,1],['Halka',.3,2.2],['Yüzde',.3,2.2],['Metin',1.8,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const pc=(parseFloat(String(f.d1).replace(/[^\d.,]/g,'').replace(',','.'))||0)/100;const k=eio(prog(t,.3,2.2));const cx=W/2,cy=780,r=330;
  c.lineWidth=60;c.strokeStyle=fgA(f.p,.1);c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.stroke();c.strokeStyle=f.a;c.lineCap='round';c.beginPath();c.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*pc*k);c.stroke();c.lineCap='butt';
  for(let i=0;i<60;i++){const a=i/60*Math.PI*2;c.strokeStyle=fgA(f.p,i%5?.1:.25);c.lineWidth=3;c.beginPath();c.moveTo(cx+Math.cos(a)*(r+50),cy+Math.sin(a)*(r+50));c.lineTo(cx+Math.cos(a)*(r+(i%5?62:72)),cy+Math.sin(a)*(r+(i%5?62:72)));c.stroke()}
  c.textAlign='center';c.font=font(900,230,COND);c.fillStyle=fg;c.fillText('%'+Math.round(pc*100*k),cx,cy+80);
  c.textAlign='center';gTxt(c,f.title,W/2,1300,70,1.8,t,{...st,align:'center'},fg,{align:'center',l:2});gSmall(c,f.sub,W/2,1520,40,2.3,t,fgA(f.p,.7),'center',900,1,600);kick(c,f.cta,W/2,1700,f.a,t,2.6,'center');c.textAlign='left';logoCorner(c,A,t,2.6,W-150,170,110)}}
};
const OKC='#3FCF8E';

// ===== Reklam türleri 4B: stok, kontrol listesi, haftalık program, tarihçe, biliyor muydunuz, efsane/gerçek, yap/yapma, hatalar, ipucu kartları, top 5, ürün detayı, kolaj =====
Object.assign(ARCH4,{
stok:{n:'Stok Alarmı',dur:6,map:L=>({title:L.prod,d1:'5',sub:'Bu fiyattan son ürünler',cta:'Kaçırma'}),labels:{title:'Ürün',d1:'Kalan adet',sub:'Alt metin',cta:'Çağrı'},max:{d1:3},
 tracks:[['Zemin',0,6,1],['Uyarı',.1,.7],['Sayaç',.6,2.4],['Çubuk',.8,2.4],['Çağrı',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const bl=Math.floor(t*3)%2===0;const e=eback(clamp(prog(t,.1,.7)));c.save();c.translate(W/2,330);c.scale(e,e);c.font=font(800,36,MONO);setLS(c,8);const tw=c.measureText('STOK ALARMI').width+120;rr(c,-tw/2,-50,tw,100,50);c.fillStyle=bl?'#E5383B':mix('#E5383B',f.p,.4);c.fill();c.fillStyle='#fff';c.textAlign='center';c.fillText('⚠ STOK ALARMI',0,13);setLS(c,0);c.restore();
  c.textAlign='center';gTxt(c,f.title,W/2,560,84,.3,t,{...st,align:'center'},fg,{align:'center',l:2});const target=parseInt(f.d1)||5;const start=target+37;const v=Math.round(lerp(start,target,eio(prog(t,.6,2.4))));
  c.font=font(900,420,COND);c.textAlign='center';c.fillStyle=f.a;c.fillText(String(v),W/2,1140);c.font=font(700,46,BODY);c.fillStyle=fg;c.fillText('ADET KALDI',W/2,1220);
  const bx=140,bw=W-280,by=1300;rr(c,bx,by,bw,40,20);c.fillStyle=fgA(f.p,.12);c.fill();const fr=v/start;rr(c,bx,by,Math.max(40,bw*fr),40,20);c.fillStyle=fr<.3?'#E5383B':f.a;c.fill();
  gSmall(c,f.sub,W/2,1430,44,2,t,fgA(f.p,.8),'center',900,1,600);gPill(c,f.cta,W/2,1580,2.6,t,f,'center');c.textAlign='left';logoCorner(c,A,t,2.8,W/2,H-150,110)}},
kontrol:{n:'Kontrol Listesi',dur:7,map:L=>({title:'Bu hafta yapılacaklar',d1:L.tips.slice(0,5).join(' · '),sub:L.brand}),labels:{title:'Başlık',d1:'Maddeler (· ile ayır, en fazla 5)',sub:'Marka'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Maddeler',.9,3.5],['Marka',3.6,4.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,90,2);const it=SP(f.d1).slice(0,5);const y0=560;
  rr(c,70,y0-40,W-140,it.length*190+60,40);c.fillStyle=lum(f.p)>.45?'rgba(255,255,255,.7)':fgA(f.p,.05);c.fill();
  it.forEach((s,i)=>{const y=y0+50+i*190;const a=eo(prog(t,.9+i*.45,1.3+i*.45));const chk=prog(t,1.2+i*.45,1.5+i*.45);c.globalAlpha=.25+.75*a;
   rr(c,120,y-10,90,90,22);c.lineWidth=5;c.strokeStyle=chk>0?f.a:fgA(f.p,.3);c.stroke();if(chk>0){c.fillStyle=f.a;rr(c,120,y-10,90,90,22);c.fill();icon(c,'check',165,y+35,70,onColor(f.a),6,chk)}
   c.font=font(700,50,BODY);c.fillStyle=fg;c.fillText(wrap(c,s,W-400,1)[0]||'',250,y+52);if(chk>=1){c.fillStyle=fgA(f.p,.5);const w=c.measureText(wrap(c,s,W-400,1)[0]||'').width;c.fillRect(250,y+36,w*eo(prog(t,1.5+i*.45,1.8+i*.45)),4)}c.globalAlpha=1});
  kick(c,f.sub,W/2,H-170,f.a,t,3.6,'center');logoCorner(c,A,t,3.6,W-150,170,110)}},
haftalik:{n:'Haftalık Program',dur:7,map:L=>({title:'Bu hafta neler var?',d1:L.week.map(w=>w.join(' · ')).join('\n'),sub:L.brand}),labels:{title:'Başlık',d1:'Günler (her satır: gün · etkinlik)',sub:'Marka'},max:{d1:200},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Günler',.9,3.2],['Marka',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,90,2);const rows=String(f.d1||'').split('\n').map(SP).filter(r=>r.length).slice(0,5);const today=Math.min(rows.length-1,Math.floor(Math.max(0,t-3.2)/.8)%Math.max(1,rows.length));
  rows.forEach((r,i)=>{const y=540+i*215;const k=eo(prog(t,.9+i*.3,1.4+i*.3));if(k<=0)return;const hot=t>3.2&&i===today;c.save();c.globalAlpha=k;c.translate((1-k)*(i%2?120:-120),0);rr(c,80,y,W-160,180,36);c.fillStyle=hot?f.a:fgA(f.p,.08);c.fill();
   const tc=hot?onColor(f.a):fg;rr(c,110,y+30,170,120,24);c.fillStyle=hot?'rgba(0,0,0,.15)':mix(f.a,f.p,.75);c.fill();c.font=font(900,70,COND);c.fillStyle=hot?tc:f.a;c.textAlign='center';c.fillText(String(r[0]).toLocaleUpperCase('tr'),195,y+116);c.textAlign='left';
   c.font=font(800,54,BODY);c.fillStyle=tc;c.fillText(wrap(c,r[1]||'',W-460,1)[0]||'',320,y+108);c.restore()});kick(c,f.sub,W/2,H-150,f.a,t,3.4,'center');logoCorner(c,A,t,3.4,W-150,170,110)}},
tarihce:{n:'Tarihçemiz',dur:8,map:L=>({title:'Hikâyemiz',d1:L.hist.map(h=>h.join(' · ')).join('\n'),sub:L.brand+' · '+L.stats.yr+' yıl'}),labels:{title:'Başlık',d1:'Dönüm noktaları (her satır: yıl · olay)',sub:'Alt satır'},max:{d1:200},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1],['Zaman çizgisi',.8,4.6],['Alt satır',4.6,5.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,92,2);const rows=String(f.d1||'').split('\n').map(SP).filter(r=>r.length).slice(0,5);const n=rows.length;const x=210,y0=560,y1=1620;const L=eio(prog(t,.8,1+n*.9));
  c.fillStyle=fgA(f.p,.12);c.fillRect(x-3,y0,6,y1-y0);c.fillStyle=f.a;c.fillRect(x-3,y0,6,(y1-y0)*L);
  rows.forEach((r,i)=>{const y=y0+40+i*(y1-y0-80)/Math.max(1,n-1);const on=prog(t,1+i*.9,1.5+i*.9);if(on<=0)return;const k=clamp(eback(on),0,1.2);c.save();c.translate(x,y);c.scale(k,k);c.beginPath();c.arc(0,0,26,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.beginPath();c.arc(0,0,44,0,Math.PI*2);c.strokeStyle=f.a;c.lineWidth=3;c.globalAlpha=.4;c.stroke();c.restore();
   c.globalAlpha=eo(on);c.font=font(900,90,COND);c.fillStyle=f.a;c.fillText(r[0]||'',x+80,y+10);c.font=font(700,46,BODY);c.fillStyle=fg;c.fillText(wrap(c,r[1]||'',W-x-160,1)[0]||'',x+80,y+70);c.globalAlpha=1});
  kick(c,f.sub,W/2,H-120,fgA(f.p,.6),t,4.6,'center');logoCorner(c,A,t,4.6,W-150,170,110)}},
bilgi:{n:'Biliyor muydunuz?',dur:7,map:L=>({title:'Biliyor muydunuz?',d1:L.myth[0]+'?',d2:L.myth[1],sub:L.brand}),labels:{title:'Başlık',d1:'Soru (ön yüz)',d2:'Cevap (arka yüz)',sub:'Marka'},max:{d1:80,d2:110},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Kart ön',.8,2.6],['Çevirme',2.6,3.4],['Cevap',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,330,88,2,'center');const fl=eio(prog(t,2.6,3.4));const sx=Math.cos(fl*Math.PI);const back=fl>.5;const e=eback(clamp(prog(t,.8,1.4)));const w=820,h=1020,cy=1060;
  c.save();c.translate(W/2,cy);c.scale(Math.abs(sx)*clamp(e,0,1.05),clamp(e,0,1.05));c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=50;c.shadowOffsetY=20;rr(c,-w/2,-h/2,w,h,56);c.fillStyle=back?f.a:mix(f.p,fg,.1);c.fill();c.shadowColor='transparent';
  const tc=back?onColor(f.a):fg;c.textAlign='center';if(!back){c.font=font(900,260,COND);c.fillStyle=f.a;c.fillText('?',0,-140);c.font=font(700,54,BODY);c.fillStyle=tc;wrap(c,f.d1,w-140,4).forEach((l,i)=>c.fillText(l,0,60+i*66))}
  else{c.font=font(500,30,MONO);c.fillStyle=tc;c.globalAlpha=.7;setLS(c,6);c.fillText('CEVAP',0,-300);setLS(c,0);c.globalAlpha=1;icon(c,'ampul',0,-170,140,tc,4);c.font=font(800,56,BODY);wrap(c,f.d2,w-140,5).forEach((l,i)=>c.fillText(l,0,10+i*68))}c.restore();
  kick(c,f.sub,W/2,H-130,fgA(f.p,.6),t,3.4,'center');c.textAlign='left';logoCorner(c,A,t,3.6,W-150,170,110)}},
efsane:{n:'Efsane mi Gerçek mi?',dur:8,map:L=>({d1:L.myth[0],d2:L.myth[1],title:'Efsane mi, gerçek mi?',sub:L.brand}),labels:{title:'Başlık',d1:'Efsane',d2:'Gerçek',sub:'Marka'},max:{d1:80,d2:110},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1],['Efsane',1,1.6],['Damga',2,2.4],['Gerçek',3.2,3.8],['Damga',4,4.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,330,86,2,'center');const box=(y,txt,lab,col,t0,ts)=>{const e=eo(prog(t,t0,t0+.6));if(e<=0)return;c.save();c.globalAlpha=e;c.translate(0,(1-e)*60);rr(c,90,y,W-180,460,40);c.fillStyle=fgA(f.p,.07);c.fill();c.font=font(500,28,MONO);c.fillStyle=fgA(f.p,.55);setLS(c,6);c.fillText(lab==='EFSANE'?'İDDİA':'AÇIKLAMA',140,y+70);setLS(c,0);
   c.font=font(700,54,BODY);c.fillStyle=fg;wrap(c,txt,W-300,4).forEach((l,i)=>c.fillText(l,140,y+190+i*66));c.restore();const s=prog(t,ts,ts+.35);if(s>0){const k=lerp(2.2,1,eo(s));c.save();c.translate(W-250,y+60);c.rotate(-.12);c.scale(k*.8,k*.8);c.globalAlpha=clamp(s*2);c.strokeStyle=col;c.lineWidth=8;c.font=font(900,72,COND);const tw=c.measureText(lab).width+60;rr(c,-tw/2,-55,tw,110,14);c.stroke();c.fillStyle=col;c.textAlign='center';c.fillText(lab,0,26);c.restore()}};
  box(520,f.d1,'EFSANE','#E5383B',1,2);box(1060,f.d2,'GERÇEK','#2BB673',3.2,4);kick(c,f.sub,W/2,H-150,fgA(f.p,.6),t,4.4,'center');logoCorner(c,A,t,4.4,W-150,170,110)}},
yapyapma:{n:'Yap / Yapma',dur:7,map:L=>({title:'Doğru bilinen yanlışlar',d1:L.tips[0]+' · '+L.tips[1],d2:L.donts[0]+' · '+L.donts[1],sub:L.brand}),labels:{title:'Başlık',d1:'Yap (2 madde, · ile)',d2:'Yapma (2 madde)',sub:'Marka'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Yap',1,2.2],['Yapma',2.2,3.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,340,86,2,'center');const col=(x,lab,items,good,t0)=>{const e=eo(prog(t,t0,t0+.5));if(e<=0)return;c.save();c.globalAlpha=e;c.translate(0,(1-e)*80);const w=440;rr(c,x,520,w,1100,40);c.fillStyle=good?mix('#2BB673',f.p,.82):mix('#E5383B',f.p,.82);c.fill();
   c.beginPath();c.arc(x+w/2,650,70,0,Math.PI*2);c.fillStyle=good?'#2BB673':'#E5383B';c.fill();c.strokeStyle='#fff';c.lineWidth=10;c.lineCap='round';c.beginPath();if(good){c.moveTo(x+w/2-30,650);c.lineTo(x+w/2-6,676);c.lineTo(x+w/2+34,626)}else{c.moveTo(x+w/2-26,624);c.lineTo(x+w/2+26,676);c.moveTo(x+w/2+26,624);c.lineTo(x+w/2-26,676)}c.stroke();c.lineCap='butt';
   c.font=font(900,64,COND);c.fillStyle=fg;c.textAlign='center';c.fillText(lab,x+w/2,800);c.textAlign='left';SP(items).slice(0,2).forEach((s,i)=>{const q=eo(prog(t,t0+.4+i*.3,t0+.8+i*.3));c.globalAlpha=e*q;c.font=font(700,44,BODY);c.fillStyle=fg;wrap(c,s,w-80,3).forEach((l,j)=>c.fillText(l,x+40,900+i*300+j*54))});c.restore()};
  col(80,'YAP',f.d1,true,1);col(W-80-440,'YAPMA',f.d2,false,2.2);kick(c,f.sub,W/2,H-130,fgA(f.p,.6),t,3.4,'center');logoCorner(c,A,t,3.4,W-150,170,110)}},
hatalar:{n:'3 Yaygın Hata',dur:7,map:L=>({title:'En sık yapılan 3 hata',d1:L.donts[0],d2:L.donts[1],d3:L.donts[2],sub:'Kaydet, sonra bakarsın'}),labels:{title:'Başlık',d1:'Hata 1',d2:'Hata 2',d3:'Hata 3',sub:'Alt not'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Hatalar',1,3.4],['Not',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,92,2);[f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const y=620+i*330;const k=eo(prog(t,1+i*.7,1.5+i*.7));if(k<=0)return;c.save();c.globalAlpha=k;c.font=font(900,240,COND);c.fillStyle=fgA(f.p,.08);c.fillText(String(i+1),60,y+150);
   const xs=clamp(eback(prog(t,1.2+i*.7,1.6+i*.7)),0,1.3);c.save();c.translate(170,y+70);c.scale(xs,xs);c.beginPath();c.arc(0,0,58,0,Math.PI*2);c.fillStyle='#E5383B';c.fill();c.strokeStyle='#fff';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(-22,-22);c.lineTo(22,22);c.moveTo(22,-22);c.lineTo(-22,22);c.stroke();c.restore();
   c.font=font(800,56,BODY);c.fillStyle=fg;wrap(c,s,W-380,2).forEach((l,j)=>c.fillText(l,280,y+60+j*66));c.fillStyle=fgA(f.p,.1);c.fillRect(80,y+220,W-160,2);c.restore()});gSmall(c,f.sub,W/2,1660,40,3.4,t,f.a,'center',900,1,700);logoCorner(c,A,t,3.4,W-150,170,110)}},
ipucu:{n:'İpucu Kartları',dur:8,map:L=>({title:'3 hızlı ipucu',d1:L.tips[0],d2:L.tips[2],d3:L.tips[3],sub:L.handle}),labels:{title:'Başlık',d1:'İpucu 1',d2:'İpucu 2',d3:'İpucu 3',sub:'Hesap'},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1],['Kart 1',1,2.8],['Kart 2',2.8,4.6],['Kart 3',4.6,6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,330,86,2,'center');const tips=[f.d1,f.d2,f.d3];const cy=1060,w=800,h=900;
  for(let i=2;i>=0;i--){const out=eio(prog(t,2.6+i*1.8,3.1+i*1.8));if(i<2&&out>=1)continue;const depth=Math.max(0,i-Math.min(2,Math.floor(Math.max(0,t-2.6)/1.8)));const enter=eback(clamp(prog(t,.9+i*.15,1.4+i*.15)));
   c.save();c.translate(W/2+out*-1300+depth*24,cy+depth*36);c.rotate(out*-.4+(i-1)*.03);c.scale(clamp(enter,0,1.05)*(1-depth*.05),clamp(enter,0,1.05)*(1-depth*.05));rr(c,-w/2,-h/2,w,h,56);c.fillStyle=i===0?f.a:i===1?mix(f.a,f.p,.35):mix(f.a,f.p,.6);c.fill();
   const tc=onColor(i===0?f.a:f.a);c.font=font(900,200,COND);c.fillStyle=tc;c.globalAlpha=.25;c.textAlign='left';c.fillText('0'+(i+1),-w/2+60,-h/2+220);c.globalAlpha=1;c.font=font(500,30,MONO);c.fillStyle=tc;c.fillText('İPUCU '+(i+1)+' / 3',-w/2+60,-h/2+300);
   c.font=font(800,70,BODY);wrap(c,tips[i]||'',w-120,5).forEach((l,j)=>c.fillText(l,-w/2+60,-40+j*82));c.restore()}
  kick(c,f.sub,W/2,H-130,f.a,t,1.4,'center');logoCorner(c,A,t,1.4,W-150,170,110)}},
top5:{n:'Top 5',dur:8,map:L=>({title:'En çok tercih edilen 5',d1:L.items.slice(0,5).map(x=>x[0]).join(' · '),sub:L.brand}),labels:{title:'Başlık',d1:'5 madde (· ile, 1. en sonda değil başta)',sub:'Marka'},
 tracks:[['Zemin',0,8,1],['Başlık',.2,1],['5 → 1',1,4.6],['Marka',4.8,5.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,340,88,2);const it=SP(f.d1).slice(0,5);const n=it.length;
  it.forEach((s,i)=>{const rank=i+1;const ord=n-1-i;const tt=1+ord*.75;const k=eo(prog(t,tt,tt+.5));if(k<=0)return;const y=520+i*230;const first=rank===1;c.save();c.globalAlpha=k;c.translate((1-k)*300,0);
   rr(c,80,y,W-160,200,40);c.fillStyle=first?f.a:fgA(f.p,.07);c.fill();const tc=first?onColor(f.a):fg;c.font=font(900,150,COND);c.fillStyle=first?tc:f.a;c.fillText(String(rank),120,y+160);
   c.font=font(800,first?66:56,BODY);c.fillStyle=tc;c.fillText(wrap(c,s,W-480,1)[0]||'',290,y+122);if(first){c.font=font(500,26,MONO);c.fillText('★ NUMARA 1',290,y+60)}c.restore()});
  kick(c,f.sub,W/2,H-110,fgA(f.p,.6),t,4.8,'center');logoCorner(c,A,t,4.8,W-150,170,110)}},
detay:{n:'Ürün Detayı',dur:7,map:L=>({title:L.prod,d1:L.feats[0],d2:L.feats[1],d3:L.feats[2],cta:L.items[0][1]}),labels:{title:'Ürün',d1:'Özellik 1',d2:'Özellik 2',d3:'Özellik 3',cta:'Fiyat'},
 tracks:[['Zemin',0,7,1],['Görsel',.2,1],['Başlık',.6,1.4],['Çağrılar',1.4,3.2],['Fiyat',3.2,3.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eback(clamp(prog(t,.2,1)));c.save();c.translate(W/2,900);c.scale(e,e);c.beginPath();c.arc(0,0,330,0,Math.PI*2);c.clip();c.translate(-W/2,-900);slot(c,W/2-330,570,660,660,f,A,t,this.dur,this.sector==='Emlak & İnşaat');c.restore();
  c.beginPath();c.arc(W/2,900,330*e,0,Math.PI*2);c.strokeStyle=f.a;c.lineWidth=8;c.stroke();
  c.textAlign='center';gTxt(c,f.title,W/2,360,84,.6,t,{...st,align:'center'},fg,{align:'center',l:2});
  const C=[[f.d1,[W/2-250,700],[90,580],'left'],[f.d2,[W/2+290,960],[W-90,1290],'right'],[f.d3,[W/2-230,1130],[90,1420],'left']];
  C.forEach(([s,a,b,al],i)=>{if(!s)return;const p=eio(prog(t,1.4+i*.5,1.9+i*.5));if(p<=0)return;c.beginPath();c.arc(a[0],a[1],14,0,Math.PI*2);c.fillStyle=f.a;c.fill();const mx=lerp(a[0],b[0],p),my=lerp(a[1],b[1],p);c.strokeStyle=f.a;c.lineWidth=4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(a[0],my);c.lineTo(mx,my);c.stroke();
   const q=eo(prog(t,1.8+i*.5,2.2+i*.5));c.globalAlpha=q;c.font=font(800,44,BODY);c.fillStyle=fg;c.textAlign=al;c.fillText(wrap(c,s,420,1)[0]||'',b[0],b[1]-20);c.globalAlpha=1;c.textAlign='left'});
  const pq=eback(clamp(prog(t,3.2,3.8)));if(pq>0&&f.cta){c.save();c.translate(W/2,1600);c.scale(pq,pq);c.font=font(900,110,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.cta,0,40);c.restore()}logoCorner(c,A,t,3.4,W-150,170,110)}},
kolaj:{n:'Kolaj',dur:7,map:L=>({title:'Yeni sezon',d1:L.items[0][0],d2:L.items[1][0],d3:L.items[3][0],cta:L.items[4][0],sub:L.handle}),labels:{title:'Başlık',d1:'Kare 1',d2:'Kare 2',d3:'Kare 3',cta:'Kare 4',sub:'Hesap'},
 tracks:[['Zemin',0,7,1],['Kareler',.2,2],['Başlık',1.6,2.4],['Hesap',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const P=[[90,300,440,560,-.04],[W-90-440,380,440,560,.05],[90,920,440,560,.03],[W-90-440,1000,440,560,-.05]];const labs=[f.d1,f.d2,f.d3,f.cta];
  P.forEach(([x,y,w,h,r],i)=>{const k=eback(clamp(prog(t,.2+i*.25,.8+i*.25)));if(k<=0)return;c.save();c.translate(x+w/2,y+h/2);c.rotate(r*(2-clamp(k)));c.scale(clamp(k,0,1.05),clamp(k,0,1.05));c.translate(-w/2,-h/2);c.fillStyle='#fff';c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=30;c.fillRect(-14,-14,w+28,h+28);c.shadowColor='transparent';
   slot(c,0,0,w,h,f,A,t+i,this.dur,this.sector==='Emlak & İnşaat');c.font=font(800,34,BODY);const tw=c.measureText(labs[i]||'').width+40;rr(c,20,h-80,tw,56,28);c.fillStyle='rgba(0,0,0,.6)';c.fill();c.fillStyle='#fff';c.fillText(labs[i]||'',40,h-41);c.restore()});
  const b=eo(prog(t,1.6,2.4));if(b>0){c.save();c.translate(W/2,1700);c.rotate(-.04);c.font=hFont(st,120);const s=hCase(st,f.title);const tw=c.measureText(s).width+120;c.fillStyle=f.a;c.fillRect(-tw/2*b,-110,tw*b,170);c.fillStyle=onColor(f.a);c.textAlign='center';c.globalAlpha=b;c.fillText(s,0,20);c.restore()}
  kick(c,f.sub,W/2,H-60,fgA(f.p,.7),t,2.6,'center');logoCorner(c,A,t,2.6,W-150,170,110)}}
});

// ===== Reklam türleri 4C: polaroid, film şeridi, bilet, davetiye, hediye kartı, sadakat kartı, arkadaşını getir, eski/yeni fiyat, kutu, neon, dev yazı, dönen kelimeler =====
Object.assign(ARCH4,{
polaroid:{n:'Polaroid',dur:7,map:L=>({title:L.brand+' anları',d1:L.feats[0],d2:L.feats[3],d3:L.feats[4],sub:L.handle}),labels:{title:'Başlık',d1:'Not 1',d2:'Not 2',d3:'Not 3',sub:'Hesap'},
 tracks:[['Zemin',0,7,1],['Fotoğraflar',.3,2.4],['Başlık',2.2,3],['Hesap',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const P=[[W/2-180,640,-.14],[W/2+170,900,.1],[W/2-120,1180,.05]];const labs=[f.d1,f.d2,f.d3];
  P.forEach(([x,y,r],i)=>{const k=eo(prog(t,.3+i*.6,.9+i*.6));if(k<=0)return;const w=520,h=600;c.save();c.translate(x,y-(1-k)*900);c.rotate(r+(1-k)*.6);c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=40;c.shadowOffsetY=18;c.fillStyle='#FBFAF6';c.fillRect(-w/2,-h/2,w,h);c.shadowColor='transparent';
   slot(c,-w/2+30,-h/2+30,w-60,w-60,f,A,t+i,this.dur,this.sector==='Emlak & İnşaat');const dev=clamp(prog(t,.9+i*.6,2+i*.6));c.fillStyle=`rgba(251,250,246,${1-dev})`;c.fillRect(-w/2+30,-h/2+30,w-60,w-60);
   c.font=font(500,44,SERIF).replace('500','italic 500');c.fillStyle='#2A2A2A';c.textAlign='center';c.fillText(wrap(c,labs[i]||'',w-60,1)[0]||'',0,h/2-40);c.restore()});
  c.textAlign='center';gTxt(c,f.title,W/2,215,72,2.2,t,{...st,align:'center'},fg,{align:'center',l:2,w:760});kick(c,f.sub,W/2,H-120,f.a,t,3,'center');c.textAlign='left';logoCorner(c,A,t,3,W-150,170,110)}},
film:{n:'Film Şeridi',dur:7,map:L=>({title:L.hook,d1:L.brand,sub:L.web}),labels:{title:'Başlık',d1:'Marka',sub:'Web'},
 tracks:[['Zemin',0,7,1],['Şerit',0,7],['Başlık',1,2],['Marka',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const sy=560,sh=560;c.save();c.translate(W/2,sy+sh/2);c.rotate(-.05);c.translate(-W/2,-(sy+sh/2));c.fillStyle='#111';c.fillRect(-200,sy,W+400,sh);
  const o=(t*180)%380;for(let x=-400+o;x<W+400;x+=380){c.save();rr(c,x,sy+70,340,sh-140,10);c.clip();slot(c,x,sy+70,340,sh-140,f,A,t+x/400,this.dur,this.sector==='Emlak & İnşaat');c.restore()}
  c.fillStyle='#EEE';for(let x=-200+(t*180)%60;x<W+200;x+=60){rr(c,x,sy+18,34,30,6);c.fill();rr(c,x,sy+sh-48,34,30,6);c.fill()}c.restore();
  c.textAlign='center';gTxt(c,f.title,W/2,1300,78,1,t,{...st,align:'center'},fg,{align:'center',l:3});const k=eo(prog(t,2.4,3));c.globalAlpha=k;c.textAlign='center';c.font=font(900,90,COND);c.fillStyle=f.a;c.fillText(String(f.d1).toLocaleUpperCase('tr'),W/2,1720);c.font=font(500,30,MONO);c.fillStyle=fgA(f.p,.6);c.fillText(f.sub,W/2,1780);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.6,W/2,300,120)}},
bilet:{n:'Etkinlik Bileti',dur:6,map:L=>({title:L.ev[0],d1:L.ev[1],d2:L.ev[2],d3:'SIRA 7 · KOLTUK 12',cta:'Biletini al'}),labels:{title:'Etkinlik',d1:'Tarih',d2:'Yer · saat',d3:'Ek bilgi',cta:'Çağrı'},
 tracks:[['Zemin',0,6,1],['Bilet',.2,1.2],['Koçan',1.6,2.4],['Çağrı',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eback(clamp(prog(t,.2,1.2)));const w=860,h=1180,x0=W/2-w/2,y0=300;c.save();c.translate(W/2,y0+h/2);c.rotate((1-clamp(e))*.3-.03);c.scale(clamp(e,0,1.04),clamp(e,0,1.04));c.translate(-W/2,-(y0+h/2));
  const cut=y0+840;c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=50;c.shadowOffsetY=20;c.beginPath();c.moveTo(x0+40,y0);c.lineTo(x0+w-40,y0);c.arcTo(x0+w,y0,x0+w,y0+40,40);c.lineTo(x0+w,cut-40);c.arc(x0+w,cut,40,-Math.PI/2,Math.PI/2,true);c.lineTo(x0+w,y0+h-40);c.arcTo(x0+w,y0+h,x0+w-40,y0+h,40);c.lineTo(x0+40,y0+h);c.arcTo(x0,y0+h,x0,y0+h-40,40);c.lineTo(x0,cut+40);c.arc(x0,cut,40,Math.PI/2,-Math.PI/2,true);c.lineTo(x0,y0+40);c.arcTo(x0,y0,x0+40,y0,40);c.closePath();c.fillStyle=f.a;c.fill();c.shadowColor='transparent';
  const tc=onColor(f.a);c.font=font(500,28,MONO);c.fillStyle=tc;c.globalAlpha=.7;setLS(c,8);c.fillText('ETKİNLİK BİLETİ',x0+60,y0+90);setLS(c,0);c.globalAlpha=1;c.font=font(900,104,COND);wrap(c,String(f.title).toLocaleUpperCase('tr'),w-120,3).forEach((l,i)=>c.fillText(l,x0+60,y0+220+i*100));
  c.font=font(500,26,MONO);c.globalAlpha=.65;c.fillText('TARİH',x0+60,y0+560);c.fillText('YER',x0+420,y0+560);c.globalAlpha=1;c.font=font(800,52,BODY);c.fillText(f.d1,x0+60,y0+620);c.font=font(700,38,BODY);wrap(c,f.d2,w-480,2).forEach((l,i)=>c.fillText(l,x0+420,y0+615+i*46));c.font=font(500,30,MONO);c.fillText(f.d3,x0+60,y0+740);
  c.setLineDash([16,12]);c.strokeStyle=tc;c.globalAlpha=.4;c.lineWidth=3;c.beginPath();c.moveTo(x0+60,cut);c.lineTo(x0+w-60,cut);c.stroke();c.setLineDash([]);c.globalAlpha=1;
  const bc=prog(t,1.6,2.4);for(let i=0;i<46;i++){if(i/46>bc)break;const bw=sr(i*3)>.6?10:5;c.fillStyle=tc;c.fillRect(x0+70+i*16,cut+90,bw,200)}c.restore();
  gPill(c,f.cta,W/2,1650,2.6,t,f,'center');logoCorner(c,A,t,2.8,W/2,H-120,100)}},
davetiye:{n:'Davetiye',dur:7,map:L=>({d1:'Davetlisiniz',title:L.ev[0],sub:L.ev[1],d2:L.ev[2],cta:L.brand}),labels:{d1:'Üst yazı',title:'Etkinlik',sub:'Tarih',d2:'Yer · saat',cta:'Davet eden'},
 tracks:[['Zemin',0,7,1],['Çerçeve',.2,1.6],['Metin',1,3],['İmza',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const fr=eio(prog(t,.2,1.6));const x0=110,y0=240,w=W-220,h=H-480;c.strokeStyle=f.a;c.lineWidth=3;c.globalAlpha=.9;const per=2*(w+h);c.setLineDash([per*fr,per]);c.strokeRect(x0,y0,w,h);c.setLineDash([per*fr,per]);c.strokeRect(x0+24,y0+24,w-48,h-48);c.setLineDash([]);c.globalAlpha=1;
  [[x0+24,y0+24],[x0+w-24,y0+24],[x0+24,y0+h-24],[x0+w-24,y0+h-24]].forEach(([x,y])=>{c.save();c.translate(x,y);c.rotate(Math.PI/4);c.fillStyle=f.a;c.globalAlpha=fr;c.fillRect(-12,-12,24,24);c.restore()});c.globalAlpha=1;
  c.textAlign='center';const q=(t0)=>eo(prog(t,t0,t0+.7));c.globalAlpha=q(1);c.font=font(500,60,SERIF).replace('500','italic 500');c.fillStyle=f.a;c.fillText(f.d1,W/2,520);
  c.globalAlpha=q(1.4);c.strokeStyle=f.a;c.lineWidth=2;c.beginPath();c.moveTo(W/2-160,580);c.lineTo(W/2-30,580);c.moveTo(W/2+30,580);c.lineTo(W/2+160,580);c.stroke();c.beginPath();c.arc(W/2,580,8,0,Math.PI*2);c.fillStyle=f.a;c.fill();
  c.globalAlpha=q(1.6);c.font=font(500,104,SERIF);c.fillStyle=fg;wrap(c,f.title,w-160,3).forEach((l,i)=>c.fillText(l,W/2,760+i*120));c.globalAlpha=q(2.2);c.font=font(500,30,MONO);setLS(c,10);c.fillStyle=fgA(f.p,.7);c.fillText(String(f.sub).toLocaleUpperCase('tr'),W/2,1180);setLS(c,0);c.font=font(600,44,BODY);c.fillStyle=fg;c.fillText(f.d2,W/2,1260);
  c.globalAlpha=q(3);c.font=font(500,48,SERIF).replace('500','italic 500');c.fillStyle=f.a;c.fillText(f.cta,W/2,1480);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,3,W/2,1580,110)}},
hediye:{n:'Hediye Kartı',dur:6,map:L=>({title:'Sevdiklerine hediye kartı',d1:'₺500',d2:L.brand,sub:'Tüm şubelerde ve online geçerli',cta:'Hemen al'}),labels:{title:'Başlık',d1:'Tutar',d2:'Kart üstündeki marka',sub:'Alt metin',cta:'Çağrı'},max:{d1:10},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['Kart',.6,2.4],['Alt metin',2.4,3],['Çağrı',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,88,2,'center');const rot=(1-eio(prog(t,.6,2.2)))*Math.PI*1.5;const sx=Math.cos(rot);const w=860,h=540;const e=eo(prog(t,.6,1));
  c.save();c.translate(W/2,900+Math.sin(t*1.5)*12);c.scale(sx*e,e);c.rotate(-.06);c.shadowColor='rgba(0,0,0,.4)';c.shadowBlur=60;c.shadowOffsetY=30;const g=c.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,f.a);g.addColorStop(1,mix(f.a,f.p,.45));rr(c,-w/2,-h/2,w,h,44);c.fillStyle=g;c.fill();c.shadowColor='transparent';
  const tc=onColor(f.a);if(sx>0){c.font=font(900,46,COND);c.fillStyle=tc;c.fillText(String(f.d2).toLocaleUpperCase('tr'),-w/2+60,-h/2+90);c.font=font(500,24,MONO);c.globalAlpha=.7;c.fillText('HEDİYE KARTI',-w/2+60,-h/2+130);c.globalAlpha=1;c.textAlign='right';const sz=fitFont(c,String(f.d1),500,200,80);c.font=font(900,sz,COND);c.fillText(f.d1,w/2-60,h/2-60);c.textAlign='left';
   rr(c,-w/2+60,-20,110,80,14);c.fillStyle=mix('#E8C07D','#ffffff',.3);c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;c.beginPath();c.moveTo(-w/2+60,20);c.lineTo(-w/2+170,20);c.moveTo(-w/2+115,-20);c.lineTo(-w/2+115,60);c.stroke()}
  else{c.fillStyle='rgba(0,0,0,.6)';c.fillRect(-w/2,-h/2+70,w,90)}c.restore();
  const sh=prog(t,2.2,2.9);if(sh>0&&sh<1){c.save();c.translate(W/2,900);c.rotate(-.06);rr(c,-w/2,-h/2,w,h,44);c.clip();const x=lerp(-w,w,sh);const gg=c.createLinearGradient(x-120,0,x+120,0);gg.addColorStop(0,'rgba(255,255,255,0)');gg.addColorStop(.5,'rgba(255,255,255,.5)');gg.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gg;c.fillRect(-w,-h,w*2,h*2);c.restore()}
  gSmall(c,f.sub,W/2,1340,44,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1520,3,t,f,'center');logoCorner(c,A,t,3,W/2,H-150,110)}},
sadakat:{n:'Sadakat Kartı',dur:7,map:L=>({title:L.loyal,d1:'6',sub:'Her ziyarette bir damga',cta:L.brand}),labels:{title:'Başlık',d1:'Damga sayısı (4–8)',sub:'Alt metin',cta:'Marka'},max:{d1:1},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Kart',.6,1.2],['Damgalar',1.2,3.6],['Hediye',3.6,4.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,360,88,2,'center');const n=clamp(parseInt(f.d1)||6,4,8);const e=eo(prog(t,.6,1.2));const w=900,h=760,x0=W/2-w/2,y0=560;c.globalAlpha=e;rr(c,x0,y0,w,h,48);c.fillStyle=lum(f.p)>.45?'#FFFFFF':mix(f.p,fg,.08);c.fill();c.strokeStyle=fgA(f.p,.15);c.lineWidth=3;c.stroke();
  c.font=font(900,52,COND);c.fillStyle=fg;c.fillText(String(f.cta).toLocaleUpperCase('tr'),x0+60,y0+100);c.font=font(500,24,MONO);c.fillStyle=fgA(f.p,.5);c.fillText('SADAKAT KARTI',x0+60,y0+140);
  const cols=n>6?4:3,rows=Math.ceil(n/cols);const cw=(w-120)/cols;for(let i=0;i<n;i++){const cx=x0+60+cw*(i%cols)+cw/2,cy=y0+280+Math.floor(i/cols)*200+(rows===2?0:0);const last=i===n-1;const s=prog(t,1.2+i*.3,1.45+i*.3);
   c.beginPath();c.arc(cx,cy,74,0,Math.PI*2);c.setLineDash([10,8]);c.strokeStyle=fgA(f.p,.3);c.lineWidth=4;c.stroke();c.setLineDash([]);
   if(s>0){const k=lerp(1.8,1,eo(s));c.save();c.translate(cx,cy);c.scale(k,k);c.rotate(-.2+i*.1);c.globalAlpha=e*clamp(s*2);c.beginPath();c.arc(0,0,66,0,Math.PI*2);c.fillStyle=last?f.a:mix(f.a,f.p,.25);c.fill();if(last)icon(c,'hediye',0,0,80,onColor(f.a),4);else icon(c,'check',0,0,70,onColor(f.a),6);c.restore()}}c.globalAlpha=1;
  gSmall(c,f.sub,W/2,1440,44,3.6,t,fgA(f.p,.85),'center',900,1,700);logoCorner(c,A,t,3.6,W/2,H-170,110)}},
arkadas:{n:'Arkadaşını Getir',dur:6,map:L=>({title:'Arkadaşını getir',d1:L.off,sub:'İkinize de indirim',d2:'SEN',d3:'ARKADAŞIN',cta:L.code}),labels:{title:'Başlık',d1:'İndirim',sub:'Alt metin',d2:'Sol etiket',d3:'Sağ etiket',cta:'Kod'},max:{d1:8},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['Kişiler',.8,1.6],['Bağlantı',1.4,2.2],['İndirim',2.2,2.8],['Kod',2.8,3.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,380,92,2,'center');const P=[[260,880,f.d2],[W-260,880,f.d3]];const ln=eio(prog(t,1.4,2.2));
  c.setLineDash([4,22]);c.lineCap='round';c.strokeStyle=f.a;c.lineWidth=10;c.beginPath();c.moveTo(380,880);c.lineTo(380+(W-760)*ln,880);c.stroke();c.setLineDash([]);c.lineCap='butt';
  P.forEach(([x,y,lab],i)=>{const k=eback(clamp(prog(t,.8+i*.2,1.3+i*.2)));if(k<=0)return;c.save();c.translate(x,y);c.scale(k,k);c.beginPath();c.arc(0,0,120,0,Math.PI*2);c.fillStyle=i?mix(f.a,f.p,.4):f.a;c.fill();c.fillStyle=onColor(f.a);c.beginPath();c.arc(0,-28,40,0,Math.PI*2);c.fill();c.beginPath();c.arc(0,62,66,Math.PI,0);c.fill();c.restore();c.font=font(700,30,MONO);c.textAlign='center';c.fillStyle=fgA(f.p,.7);c.fillText(lab,x,y+180);c.textAlign='left'});
  const g=eback(clamp(prog(t,2,2.5)));if(g>0){c.save();c.translate(W/2,880);c.scale(g,g);c.beginPath();c.arc(0,0,80,0,Math.PI*2);c.fillStyle=f.p;c.fill();icon(c,'hediye',0,0,90,f.a,4);c.restore()}
  const d=eback(clamp(prog(t,2.2,2.8)));if(d>0){c.save();c.translate(W/2,1270);c.scale(d,d);c.font=font(900,240,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1,0,80);c.restore()}
  gSmall(c,f.sub,W/2,1430,48,2.4,t,fg,'center',900,1,800);const q=eo(prog(t,2.8,3.4));if(q>0&&f.cta){c.globalAlpha=q;c.font=font(700,56,MONO);const tw=c.measureText(f.cta).width+90;c.setLineDash([12,10]);rr(c,W/2-tw/2,1520,tw,110,24);c.strokeStyle=f.a;c.lineWidth=4;c.stroke();c.setLineDash([]);c.fillStyle=fg;c.textAlign='center';c.fillText(f.cta,W/2,1595);c.textAlign='left';c.globalAlpha=1}logoCorner(c,A,t,3,W-150,170,110)}},
eskiyeni:{n:'Eski / Yeni Fiyat',dur:6,map:L=>({title:L.items[1][0],d1:'₺'+Math.round(parseFloat(String(L.items[1][1]).replace(/[^\d]/g,''))*1.3).toLocaleString('tr-TR'),d2:L.items[1][1],sub:'Bu hafta sonuna kadar',cta:'Fırsatı yakala'}),labels:{title:'Ürün',d1:'Eski fiyat',d2:'Yeni fiyat',sub:'Süre',cta:'Çağrı'},max:{d1:14,d2:14},
 tracks:[['Zemin',0,6,1],['Ürün',.2,1],['Eski fiyat',.8,1.4],['Çizgi',1.6,2],['Yeni fiyat',2.1,2.7],['Çağrı',2.8,3.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,400,92,2,'center');const o=eo(prog(t,.8,1.4));c.textAlign='center';c.globalAlpha=o*(t>2?.45:1);const sz1=fitFont(c,String(f.d1),860,170,80);c.font=font(900,sz1,COND);c.fillStyle=fg;c.fillText(f.d1,W/2,820);const tw=c.measureText(f.d1).width;c.globalAlpha=1;
  const s=eio(prog(t,1.6,2));if(s>0){c.save();c.translate(W/2,770);c.rotate(-.12);c.fillStyle='#E5383B';c.fillRect(-tw/2-30,-10,(tw+60)*s,20);c.restore()}
  const n=eback(clamp(prog(t,2.1,2.7)));if(n>0){c.save();c.translate(W/2,1120);c.scale(n,n);const sz=fitFont(c,String(f.d2),900,280,100);c.font=font(900,sz,COND);c.fillStyle=f.a;c.fillText(f.d2,0,sz*.35);c.restore();
   const a=parseFloat(String(f.d1).replace(/[^\d]/g,'')),b=parseFloat(String(f.d2).replace(/[^\d]/g,''));if(a&&b&&a>b){const pc=Math.round((1-b/a)*100);c.save();c.translate(W-230,960);c.rotate(.2);c.scale(n,n);c.beginPath();for(let i=0;i<24;i++){const ang=i*Math.PI/12,r=i%2?90:110;c.lineTo(Math.cos(ang)*r,Math.sin(ang)*r)}c.closePath();c.fillStyle='#E5383B';c.fill();c.fillStyle='#fff';c.font=font(900,64,COND);c.fillText('-%'+pc,0,22);c.restore()}}
  gSmall(c,f.sub,W/2,1340,44,2.6,t,fgA(f.p,.8),'center',900,1,600);gPill(c,f.cta,W/2,1500,2.8,t,f,'center');c.textAlign='left';logoCorner(c,A,t,3,W/2,H-170,110)}},
kutu:{n:'Kutu Açılışı',dur:6,map:L=>({title:'Sürpriz var!',d1:L.off,sub:L.offT,cta:L.code}),labels:{title:'Başlık',d1:'Kutudan çıkan',sub:'Alt metin',cta:'Kod'},max:{d1:10},
 tracks:[['Zemin',0,6,1],['Kutu',.1,.8],['Sallanma',.8,1.6],['Kapak',1.6,2.2],['Sürpriz',2,2.8],['Kod',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,330,92,2,'center');const cx=W/2,by=1150,bw=520,bh=380;const sh=t>.8&&t<1.6?Math.sin(t*40)*.05*(1.6-t):0;const lid=eio(prog(t,1.6,2.2));
  if(t>2){for(let i=0;i<40;i++){const lt=t-2;const a=-Math.PI/2+(sr(i)-.5)*2.2;const sp=500+sr(i+7)*500;const x=cx+Math.cos(a)*sp*lt,y=by-bh/2+Math.sin(a)*sp*lt+lt*lt*500;c.save();c.translate(x,y);c.rotate(lt*6+i);c.globalAlpha=clamp(1-lt/2);c.fillStyle=i%3?f.a:fg;c.fillRect(-10,-5,20,10);c.restore()}c.globalAlpha=1}
  const r=eback(clamp(prog(t,2,2.8)));if(r>0){c.save();c.translate(cx,by-bh/2-r*360);c.scale(r,r);c.font=font(900,230,COND);c.textAlign='center';c.fillStyle=f.a;c.fillText(f.d1,0,80);c.restore()}
  const e=eback(clamp(prog(t,.1,.8)));c.save();c.translate(cx,by);c.rotate(sh);c.scale(e,e);c.fillStyle=f.a;c.fillRect(-bw/2,-bh/2,bw,bh);c.fillStyle='rgba(0,0,0,.15)';c.fillRect(-bw/2,-bh/2,bw,40);c.fillStyle=onColor(f.a);c.globalAlpha=.85;c.fillRect(-35,-bh/2,70,bh);c.globalAlpha=1;
  c.save();c.globalAlpha=1-lid;c.translate(-bw/2-20,-bh/2-lid*520);c.translate(bw/2+20,0);c.rotate(-lid*.35);c.translate(-(bw/2+20),0);c.fillStyle=mix(f.a,'#000000',.1);c.fillRect(0,-90,bw+40,90);c.fillStyle=onColor(f.a);c.globalAlpha=.85;c.fillRect(bw/2-15,-90,70,90);c.globalAlpha=1;if(lid<.3){c.beginPath();c.ellipse(bw/2+20-60,-110,70,40,-.4,0,Math.PI*2);c.ellipse(bw/2+20+60,-110,70,40,.4,0,Math.PI*2);c.strokeStyle=onColor(f.a);c.lineWidth=18;c.stroke()}c.restore();c.restore();
  gSmall(c,f.sub,W/2,1470,48,2.6,t,fg,'center',900,1,700);const q=eo(prog(t,3,3.6));if(q>0&&f.cta){c.globalAlpha=q;c.font=font(700,56,MONO);c.textAlign='center';c.fillStyle=f.a;c.fillText('KOD: '+f.cta,W/2,1600);c.textAlign='left';c.globalAlpha=1}logoCorner(c,A,t,3,W/2,H-140,100)}},
neon:{n:'Neon Tabela',dur:6,map:L=>({title:L.brand,d1:L.off+' İNDİRİM',sub:L.offT,cta:'Açığız'}),labels:{title:'Tabela yazısı',d1:'Neon kampanya',sub:'Alt metin',cta:'Küçük tabela'},max:{title:16,d1:16},
 tracks:[['Zemin',0,6,1],['Tabela 1',.3,1.4],['Tabela 2',1.2,2.2],['Alt metin',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,0,W,H);c.strokeStyle='rgba(255,255,255,.04)';c.lineWidth=2;for(let y=0;y<H;y+=60){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();for(let x=(y/60)%2?0:60;x<W;x+=120){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+60);c.stroke()}}
  const neonCol=lum(f.a)<.2?'#FF4FD8':f.a;const fl=(t0,i)=>{if(t<t0)return 0;const lt=t-t0;if(lt<.8)return sr(Math.floor(lt*20)+i*7)>.45?1:.15;return .92+.08*Math.sin(t*9+i)};
  const tube=(txt,y,size,col,k,fam)=>{if(k<=0)return;c.save();c.font=fam;c.textAlign='center';c.globalAlpha=k;c.shadowColor=col;c.shadowBlur=60;c.strokeStyle=col;c.lineWidth=size*.07;c.strokeText(txt,W/2,y);c.shadowBlur=20;c.strokeStyle='#FFFFFF';c.lineWidth=size*.025;c.strokeText(txt,W/2,y);c.restore()};
  const s1=fitFont(c,String(f.title),900,220,90,900,COND);tube(String(f.title).toLocaleUpperCase('tr'),720,s1,neonCol,fl(.3,1),font(900,s1,COND));
  const s2=fitFont(c,String(f.d1),860,150,70,900,COND);tube(String(f.d1),1080,s2,'#7CF7FF',fl(1.2,2),font(900,s2,COND));
  c.save();c.translate(W/2,1400);c.rotate(-.06);const k3=fl(2,3);c.globalAlpha=k3;c.font=font(500,110,SERIF).replace('500','italic 500');c.textAlign='center';c.shadowColor='#FFD166';c.shadowBlur=40;c.strokeStyle='#FFD166';c.lineWidth=6;c.strokeText(f.cta,0,0);c.restore();
  c.globalAlpha=eo(prog(t,2.4,3));c.font=font(600,44,BODY);c.fillStyle='rgba(255,255,255,.85)';c.textAlign='center';c.fillText(f.sub,W/2,1640);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2.6,W/2,300,110)}},
bantlar:{n:'Dev Yazı Bantları',dur:6,map:L=>({title:L.big,d1:L.off+' '+L.offT.toLocaleLowerCase('tr'),sub:L.brand}),labels:{title:'Dev kelime',d1:'Orta mesaj',sub:'Marka'},max:{title:12},
 tracks:[['Zemin',0,6,1],['Bantlar',0,6],['Mesaj',1,1.8],['Marka',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const word=String(f.title).toLocaleUpperCase('tr')+' ';const e=eo(prog(t,0,.8));c.font=font(900,300,COND);const ww=c.measureText(word).width;
  for(let r=0;r<7;r++){const y=160+r*280;const dir=r%2?1:-1;const o=((t*(180+r*30)*dir)%ww+ww)%ww;const filled=r%2===0;c.globalAlpha=e*(filled?.95:1);for(let x=-ww+o-ww;x<W+ww;x+=ww){if(filled){c.fillStyle=r===2||r===4?f.a:fgA(f.p,.14);c.fillText(word,x,y)}else{c.strokeStyle=fgA(f.p,.3);c.lineWidth=3;c.strokeText(word,x,y)}}}c.globalAlpha=1;
  const k=eback(clamp(prog(t,1,1.8)));if(k>0){c.save();c.translate(W/2,H/2);c.rotate(-.05);c.scale(k,k);c.font=font(800,64,BODY);const lines=wrap(c,f.d1,760,2);const bw=Math.max(...lines.map(l=>c.measureText(l).width))+120,bh=lines.length*80+90;rr(c,-bw/2,-bh/2,bw,bh,40);c.fillStyle=fg;c.fill();c.fillStyle=f.p;c.textAlign='center';lines.forEach((l,i)=>c.fillText(l,0,-bh/2+105+i*80));c.restore()}
  kick(c,f.sub,W/2,H-90,fg,t,2.2,'center');logoCorner(c,A,t,2.4,W-150,170,110)}},
donen:{n:'Dönen Kelimeler',dur:7,map:L=>({title:'Bizde her şey',d1:L.words.join(' · '),sub:L.brand,cta:L.web}),labels:{title:'Sabit başlık',d1:'Dönen kelimeler (· ile)',sub:'Marka',cta:'Web'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Kelimeler',1,5.4],['Marka',5.2,5.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const ws=SP(f.d1);const n=ws.length||1;c.textAlign='center';gTxt(c,f.title,W/2,700,96,.2,t,{...st,align:'center'},fgA(f.p,.8),{align:'center',l:2});
  const per=1.1;const lt=Math.max(0,t-1);const i=Math.min(n-1,Math.floor(lt/per));const ph=lt-i*per;const spin=ph<.35&&i>0?eio(ph/.35):1;const fin=t>1+n*per-.2;
  c.save();c.beginPath();c.rect(0,820,W,360);c.clip();c.textAlign='center';c.font=hFont(st,180);const draw=(w,dy)=>{const s=hCase(st,w);let sz=180;while(c.measureText(s).width>940&&sz>80){sz-=10;c.font=hFont(st,sz)}c.fillStyle=f.a;c.fillText(s,W/2,1060+dy);c.font=hFont(st,180)};
  if(t>=1){if(i>0&&spin<1)draw(ws[i-1],-spin*320);draw(ws[i],(1-spin)*320)}c.restore();c.fillStyle=f.a;c.fillRect(W/2-200,1140,400*(fin?1:spin),10);
  kick(c,f.sub,W/2,1450,fg,t,1+n*per-.2,'center');c.globalAlpha=eo(prog(t,1+n*per,1.6+n*per));c.textAlign='center';c.font=font(500,34,MONO);c.fillStyle=fgA(f.p,.6);c.fillText(f.cta,W/2,1520);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,2,W/2,300,110)}}
});

// ===== Reklam türleri 4D: sizden gelen soru, megafon, hava durumu, kilometre taşı, şans çarkı, kazı kazan, QR, ekip, bize güvenenler, uygulama ekranı, garanti rozeti, bülten =====
Object.assign(ARCH4,{
soru:{n:'Sizden Gelen Soru',dur:7,map:L=>({d1:L.faq[0],d2:L.faq[1],title:'Sizden gelen soru',sub:L.handle}),labels:{title:'Başlık',d1:'Soru',d2:'Cevap',sub:'Hesap'},max:{d1:80,d2:120},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Soru kartı',.8,1.4],['Cevap',1.8,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,330,84,2);const k=eback(clamp(prog(t,.8,1.4)));if(k>0){c.save();c.translate(W/2,700);c.scale(clamp(k,0,1.04),clamp(k,0,1.04));c.rotate(-.02);rr(c,-440,-200,880,400,44);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#F6F3EE';c.fill();
   c.fillStyle=f.a;rr(c,-440,-200,880,90,44);c.fill();c.fillRect(-440,-150,880,40);c.font=font(700,36,BODY);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText('Bana bir soru sor',0,-138);c.font=font(700,50,BODY);c.fillStyle='#15120C';wrap(c,f.d1,780,3).forEach((l,i)=>c.fillText(l,0,-20+i*62));c.restore()}
  const mic=eo(prog(t,1.6,2));if(mic>0){c.save();c.globalAlpha=mic;c.translate(160,1080);rr(c,-30,-60,60,100,30);c.fillStyle=f.a;c.fill();c.strokeStyle=f.a;c.lineWidth=6;c.beginPath();c.arc(0,0,48,0,Math.PI);c.moveTo(0,48);c.lineTo(0,80);c.stroke();for(let i=1;i<4;i++){c.globalAlpha=mic*Math.max(0,Math.sin(t*6-i));c.beginPath();c.arc(0,-10,60+i*24,-.6,.6);c.stroke()}c.restore()}
  const ans=String(f.d2||'');const n=Math.floor(clamp((t-1.8)/1.8)*ans.length);c.font=font(700,56,BODY);c.fillStyle=fg;const L=wrap(c,ans.slice(0,n),W-360,6);L.forEach((l,i)=>c.fillText(l,270,1060+i*70));if(n<ans.length&&t>1.8&&Math.floor(t*4)%2===0){const lw=c.measureText(L[L.length-1]||'').width;c.fillStyle=f.a;c.fillRect(276+lw,1010+(L.length-1)*70,5,60)}
  kick(c,f.sub,W/2,H-140,f.a,t,3.6,'center');logoCorner(c,A,t,3.6,W-150,170,110)}},
megafon:{n:'Duyuru Megafonu',dur:6,map:L=>({d1:'DUYURU',title:L.ev[0],sub:L.ev[1]+' · '+L.ev[2],cta:'Kaydol'}),labels:{d1:'Üst etiket',title:'Duyuru',sub:'Detay',cta:'Çağrı'},
 tracks:[['Zemin',0,6,1],['Megafon',.1,1],['Dalgalar',.8,6],['Duyuru',1,2],['Detay',2,2.6],['Çağrı',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eback(clamp(prog(t,.1,1)));const mx=300,my=560;c.save();c.translate(mx,my);c.rotate(-.25);c.scale(e,e);c.fillStyle=f.a;c.beginPath();c.moveTo(-120,-50);c.lineTo(80,-150);c.lineTo(80,150);c.lineTo(-120,50);c.closePath();c.fill();rr(c,-190,-60,80,120,20);c.fill();rr(c,70,-160,40,320,20);c.fill();c.fillStyle=fg;rr(c,-170,50,50,110,16);c.fill();
  c.strokeStyle=f.a;c.lineWidth=12;c.lineCap='round';for(let i=0;i<3;i++){const ph=((t*1.4+i/3)%1);c.globalAlpha=1-ph;c.beginPath();c.arc(110,0,80+ph*260,-.6,.6);c.stroke()}c.lineCap='butt';c.restore();c.globalAlpha=1;
  const p=eo(prog(t,.8,1.2));c.globalAlpha=p;pill(c,f.d1,80,900,f.a,onColor(f.a),36,'left');c.globalAlpha=1;gTxt(c,f.title,80,1100,104,1,t,{...st,align:'left'},fg,{align:'left',l:3});
  gSmall(c,f.sub,80,1460,46,2,t,fgA(f.p,.85),'left',900,2,700);gPill(c,f.cta,80,1620,2.6,t,f,'left');logoCorner(c,A,t,2.8,W-150,H-170,110)}},
hava:{n:'Hava Durumu',dur:6,map:L=>({d1:'12°',title:L.weather,sub:L.offT+' '+L.off,cta:L.brand}),labels:{d1:'Derece',title:'Kampanya başlığı',sub:'Teklif',cta:'Marka'},max:{d1:5},
 tracks:[['Zemin',0,6,1],['Hava kartı',.2,1],['Bulut / yağmur',.6,6],['Başlık',1.4,2.2],['Teklif',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.2,1));c.save();c.globalAlpha=e;c.translate(0,(1-e)*60);rr(c,80,240,W-160,620,50);const g=c.createLinearGradient(0,240,0,860);g.addColorStop(0,mix(f.a,'#ffffff',.25));g.addColorStop(1,f.a);c.fillStyle=g;c.fill();const tc=onColor(f.a);
  c.font=font(900,260,COND);c.fillStyle=tc;c.fillText(f.d1,140,560);c.font=font(700,40,BODY);c.fillText('Bugün · '+String(f.cta),140,640);c.font=font(500,30,MONO);c.globalAlpha=e*.75;c.fillText('NEM %78  ·  RÜZGÂR 14 KM/S',140,780);c.globalAlpha=e;
  const cx=W-300,cy=470;c.fillStyle='#FFD166';c.beginPath();c.arc(cx+60,cy-60,90,0,Math.PI*2);c.fill();c.fillStyle='#FFFFFF';const bx=Math.sin(t*.8)*20;[[0,0,110],[110,10,90],[-100,20,80],[40,-60,90]].forEach(([x,y,r])=>{c.beginPath();c.arc(cx+x+bx,cy+y,r,0,Math.PI*2);c.fill()});
  c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=7;c.lineCap='round';for(let i=0;i<9;i++){const x=cx-160+i*40+bx;const y=cy+110+((t*700+i*90)%260);c.globalAlpha=e*.9;c.beginPath();c.moveTo(x,y);c.lineTo(x-14,y+36);c.stroke()}c.lineCap='butt';c.restore();c.globalAlpha=1;
  gTxt(c,f.title,AX(st),1060,90,1.4,t,st,fg,{l:3});const k=eback(clamp(prog(t,2.4,3)));if(k>0){c.save();c.translate(AX(st)===80?80:W/2,1480);c.scale(k,k);c.font=font(900,90,COND);c.fillStyle=f.a;c.textAlign=st.align==='center'?'center':'left';c.fillText(f.sub,0,0);c.restore()}logoCorner(c,A,t,2.6,W/2,H-150,110)}},
kilometre:{n:'Kilometre Taşı',dur:6,map:L=>({d1:L.stats.n,title:L.stats.nl,sub:'Hepinize teşekkürler',cta:L.brand}),labels:{d1:'Sayı',title:'Neyin sayısı',sub:'Teşekkür',cta:'Marka'},max:{d1:10},
 tracks:[['Zemin',0,6,1],['Sayaç',.3,2.4],['Konfeti',2.4,6],['Metin',1.6,2.4],['Teşekkür',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const raw=String(f.d1);const num=parseFloat(raw.replace(/\./g,'').replace(',','.'))||0;const suf=raw.replace(/[\d.,]/g,'');const k=eio(prog(t,.3,2.4));
  if(t>2.4){for(let i=0;i<80;i++){const lt=t-2.4;const x=(sr(i)*W+Math.sin(lt*2+i)*40);const y=-40+lt*(400+sr(i+3)*500)-(sr(i+5)*400);if(y<0||y>H)continue;c.save();c.translate(x,y);c.rotate(lt*5+i);c.fillStyle=i%3===0?f.a:i%3===1?fg:mix(f.a,'#ffffff',.4);c.fillRect(-12,-6,24,12);c.restore()}}
  c.textAlign='center';const v=Math.round(num*k).toLocaleString('tr-TR')+suf;const sz=fitFont(c,v,960,300,120);c.font=font(900,sz,COND);c.fillStyle=f.a;const pop=t>2.4&&t<2.7?1+.06*Math.sin((t-2.4)/.3*Math.PI):1;c.save();c.translate(W/2,940);c.scale(pop,pop);c.fillText(v,0,0);c.restore();
  gTxt(c,f.title,W/2,1100,80,1.6,t,{...st,align:'center'},fg,{align:'center',l:2});const q=eo(prog(t,2.6,3.2));c.globalAlpha=q;c.textAlign='center';c.font=font(500,64,SERIF).replace('500','italic 500');c.fillStyle=fg;c.fillText(f.sub,W/2,1400);c.globalAlpha=1;kick(c,f.cta,W/2,1560,f.a,t,2.8,'center');c.textAlign='left';logoCorner(c,A,t,2.8,W/2,330,120)}},
cark:{n:'Şans Çarkı',dur:7,map:L=>({title:'Çarkı çevir, kazan',d1:L.prize.slice(0,6).join(' · '),sub:'Her alışverişte bir çevirme hakkı',cta:L.brand}),labels:{title:'Başlık',d1:'6 ödül (· ile)',sub:'Kural',cta:'Marka'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Çark',.6,4.2],['Kazanılan',4.2,4.8],['Kural',4.8,5.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,300,84,2,'center');const P=SP(f.d1).slice(0,6);const n=P.length||6;const cx=W/2,cy=950,r=420;const win=0;const total=Math.PI*2*5+(Math.PI*2-(win+.5)*Math.PI*2/n)-Math.PI/2;const ang=total*eo(prog(t,.8,4.2))*1;const e=eback(clamp(prog(t,.4,1)));
  c.save();c.translate(cx,cy);c.scale(e,e);c.rotate(ang);for(let i=0;i<n;i++){const a0=i*Math.PI*2/n,a1=(i+1)*Math.PI*2/n;c.beginPath();c.moveTo(0,0);c.arc(0,0,r,a0,a1);c.closePath();c.fillStyle=i%2?f.a:mix(f.p,fg,.12);c.fill();c.strokeStyle=f.p;c.lineWidth=6;c.stroke();
   c.save();c.rotate((a0+a1)/2);c.font=font(800,34,BODY);c.fillStyle=i%2?onColor(f.a):fg;c.textAlign='right';c.fillText(wrap(c,P[i]||'',r-120,1)[0]||'',r-40,12);c.restore()}
  c.beginPath();c.arc(0,0,70,0,Math.PI*2);c.fillStyle=fg;c.fill();c.restore();for(let i=0;i<24;i++){const a=i/24*Math.PI*2;c.beginPath();c.arc(cx+Math.cos(a)*(r+30)*e,cy+Math.sin(a)*(r+30)*e,9,0,Math.PI*2);c.fillStyle=(Math.floor(t*6)+i)%2?f.a:fg;c.fill()}
  c.fillStyle=fg;c.beginPath();c.moveTo(cx,cy-r-10);c.lineTo(cx-40,cy-r-80);c.lineTo(cx+40,cy-r-80);c.closePath();c.fill();
  const w=eback(clamp(prog(t,4.2,4.8)));if(w>0){c.save();c.translate(W/2,1530);c.scale(w,w);c.font=font(900,90,COND);const s='KAZANDIN: '+String(P[win]||'').toLocaleUpperCase('tr');const tw=Math.min(980,c.measureText(s).width+100);rr(c,-tw/2,-80,tw,140,70);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.font=font(900,fitFont(c,s,tw-80,90,40),COND);c.fillText(s,0,26);c.restore()}
  gSmall(c,f.sub,W/2,1700,40,4.8,t,fgA(f.p,.75),'center',900,1,600);logoCorner(c,A,t,4.8,W-150,170,110)}},
kazi:{n:'Kazı Kazan',dur:7,map:L=>({title:'Kazı, kazan!',d1:L.off+' İNDİRİM',d2:L.code,sub:L.offT,cta:L.brand}),labels:{title:'Başlık',d1:'Ödül',d2:'Kod',sub:'Alt metin',cta:'Marka'},max:{d1:16},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Kart',.6,1.2],['Kazıma',1.4,3.8],['Kod',4,4.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,340,92,2,'center');const e=eo(prog(t,.6,1.2));const x0=120,y0=560,w=W-240,h=700;c.globalAlpha=e;rr(c,x0,y0,w,h,50);c.fillStyle=f.a;c.fill();const tc=onColor(f.a);c.textAlign='center';c.font=font(500,30,MONO);c.fillStyle=tc;c.fillText('TEBRİKLER',W/2,y0+180);const sz=fitFont(c,String(f.d1),w-120,170,70);c.font=font(900,sz,COND);c.fillText(f.d1,W/2,y0+180+sz);c.font=font(700,54,MONO);c.fillText(f.d2,W/2,y0+h-100);
  const pr=prog(t,1.4,3.8);const cv=this._sc||(this._sc=document.createElement('canvas'));cv.width=w/2;cv.height=h/2;const o=cv.getContext('2d');o.fillStyle='#B9BEC6';o.fillRect(0,0,cv.width,cv.height);o.fillStyle='rgba(255,255,255,.25)';for(let i=0;i<40;i++)o.fillRect(sr(i)*cv.width,sr(i+3)*cv.height,40,4);o.font=font(800,30,BODY);o.fillStyle='#7E848C';o.textAlign='center';o.fillText('KAZI',cv.width/2,cv.height/2+10);
  o.globalCompositeOperation='destination-out';o.lineCap='round';o.lineWidth=70;o.beginPath();const steps=Math.floor(pr*60);for(let i=0;i<=steps;i++){const s=i/60;const x=cv.width*(.1+.8*((Math.floor(s*6)%2)?1-(s*6%1):(s*6%1)));const y=cv.height*(.12+.76*s);if(i===0)o.moveTo(x,y);else o.lineTo(x,y)}o.stroke();if(pr>=1){o.fillRect(0,0,cv.width,cv.height)}
  c.save();rr(c,x0,y0,w,h,50);c.clip();c.drawImage(cv,x0,y0,w,h);c.restore();c.globalAlpha=1;
  if(pr>0&&pr<1){const s=pr;const x=x0+w*(.1+.8*((Math.floor(s*6)%2)?1-(s*6%1):(s*6%1))),y=y0+h*(.12+.76*s);c.save();c.translate(x,y);c.rotate(.5);rr(c,-30,-60,60,120,14);c.fillStyle='#D4A72C';c.fill();c.restore()}
  gSmall(c,f.sub,W/2,1400,46,4,t,fg,'center',900,1,700);kick(c,f.cta,W/2,1560,f.a,t,4.2,'center');c.textAlign='left';logoCorner(c,A,t,4.2,W/2,H-150,100)}},
qr:{n:'QR Menü',dur:6,map:L=>({title:'Tara, menüyü gör',d1:L.web,sub:'Masadaki QR kodu okutun',cta:L.brand}),labels:{title:'Başlık',d1:'Adres',sub:'Alt metin',cta:'Marka'},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['QR',.6,1.6],['Tarama',1.6,3.2],['Adres',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,340,92,2,'center');const s=640,x0=W/2-s/2,y0=560;const e=eback(clamp(prog(t,.6,1.3)));c.save();c.translate(W/2,y0+s/2);c.scale(e,e);c.translate(-W/2,-(y0+s/2));rr(c,x0-40,y0-40,s+80,s+80,40);c.fillStyle='#FFFFFF';c.fill();
  const N=25,cs=s/N;const seed=String(f.d1).length;const fin=(x,y)=>(x<7&&y<7)||(x>=N-7&&y<7)||(x<7&&y>=N-7);c.fillStyle='#111';for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(fin(x,y))continue;if(sr(x*31+y*17+seed)>.52)c.fillRect(x0+x*cs,y0+y*cs,cs+.5,cs+.5)}
  [[0,0],[N-7,0],[0,N-7]].forEach(([x,y])=>{c.fillStyle='#111';c.fillRect(x0+x*cs,y0+y*cs,7*cs,7*cs);c.fillStyle='#fff';c.fillRect(x0+(x+1)*cs,y0+(y+1)*cs,5*cs,5*cs);c.fillStyle=f.a;c.fillRect(x0+(x+2)*cs,y0+(y+2)*cs,3*cs,3*cs)});
  rr(c,W/2-70,y0+s/2-70,140,140,30);c.fillStyle=f.a;c.fill();c.font=font(900,80,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(ini(f.cta),W/2,y0+s/2+28);c.restore();
  const sc=prog(t,1.6,3.2);if(sc>0&&sc<1){const yy=y0+s*((Math.sin(sc*Math.PI*2-Math.PI/2)+1)/2);const g=c.createLinearGradient(0,yy-60,0,yy);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,mix(f.a,'#ffffff',.2));c.fillStyle=g;c.globalAlpha=.6;c.fillRect(x0-20,yy-60,s+40,60);c.globalAlpha=1;c.fillStyle=f.a;c.fillRect(x0-20,yy-3,s+40,6)}
  c.strokeStyle=f.a;c.lineWidth=10;const m=70;[[x0-70,y0-70,1,1],[x0+s+70,y0-70,-1,1],[x0-70,y0+s+70,1,-1],[x0+s+70,y0+s+70,-1,-1]].forEach(([x,y,sx,sy])=>{c.beginPath();c.moveTo(x,y+sy*m);c.lineTo(x,y);c.lineTo(x+sx*m,y);c.stroke()});
  gSmall(c,f.sub,W/2,1420,44,2,t,fgA(f.p,.8),'center',900,1,600);const q=eo(prog(t,3,3.6));c.globalAlpha=q;c.font=font(700,52,MONO);c.textAlign='center';c.fillStyle=f.a;c.fillText(f.d1,W/2,1560);c.globalAlpha=1;c.textAlign='left';logoCorner(c,A,t,3,W/2,H-150,100)}},
ekip4:{n:'Ekibimiz',dur:7,map:L=>({title:'Ekibimizle tanışın',d1:L.team.map(x=>x.join(' · ')).join('\n'),sub:L.brand}),labels:{title:'Başlık',d1:'Ekip (her satır: isim · görev)',sub:'Marka'},max:{d1:200},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Kişiler',.9,3],['Marka',3.2,3.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,340,92,2,'center');const rows=String(f.d1||'').split('\n').map(SP).filter(r=>r.length).slice(0,4);
  rows.forEach((r,i)=>{const col=i%2,row=Math.floor(i/2);const cx=W/2+(col?250:-250),cy=760+row*560;const k=eback(clamp(prog(t,.9+i*.35,1.4+i*.35)));if(k<=0)return;c.save();c.translate(cx,cy);c.scale(clamp(k,0,1.05),clamp(k,0,1.05));
   rr(c,-220,-200,440,500,44);c.fillStyle=fgA(f.p,.07);c.fill();c.beginPath();c.arc(0,-40,120,0,Math.PI*2);const g=c.createLinearGradient(-120,-160,120,80);g.addColorStop(0,f.a);g.addColorStop(1,mix(f.a,f.p,.5));c.fillStyle=g;c.fill();c.font=font(900,100,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(ini(r[0]),0,-4);
   c.font=font(800,44,BODY);c.fillStyle=fg;c.fillText(wrap(c,r[0]||'',400,1)[0]||'',0,170);c.font=font(500,26,MONO);c.fillStyle=fgA(f.p,.6);c.fillText(String(r[1]||'').toLocaleUpperCase('tr'),0,220);c.restore()});kick(c,f.sub,W/2,H-110,f.a,t,3.2,'center');logoCorner(c,A,t,3.2,W-150,170,110)}},
guven:{n:'Bize Güvenenler',dur:7,map:L=>({title:'Bize güvenenler',d1:L.clients.join(' · '),sub:L.stats.n+' '+L.stats.nl,cta:L.brand}),labels:{title:'Başlık',d1:'İsimler (· ile, en fazla 6)',sub:'Alt metin',cta:'Marka'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['İsimler',.9,3.2],['Alt metin',3.2,3.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,340,92,2,'center');const N=SP(f.d1).slice(0,6);N.forEach((s,i)=>{const col=i%2,row=Math.floor(i/2);const x=90+col*460,y=540+row*280;const k=eo(prog(t,.9+i*.3,1.4+i*.3));if(k<=0)return;c.save();c.globalAlpha=k;c.translate(0,(1-k)*40);rr(c,x,y,440,240,32);c.fillStyle=fgA(f.p,.06);c.fill();c.strokeStyle=fgA(f.p,.14);c.lineWidth=2;c.stroke();
   const sty=i%3;c.textAlign='center';if(sty===0){c.font=font(900,54,COND);c.fillStyle=fg;c.fillText(String(s).toLocaleUpperCase('tr'),x+220,y+140)}else if(sty===1){c.font=font(500,50,SERIF).replace('500','italic 500');c.fillStyle=fg;c.fillText(s,x+220,y+138)}else{c.beginPath();c.arc(x+90,y+120,34,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(800,36,BODY);c.fillStyle=fg;c.textAlign='left';c.fillText(wrap(c,s,280,1)[0]||'',x+140,y+132)}c.restore()});
  c.textAlign='center';const q=eo(prog(t,3.2,3.8));c.globalAlpha=q;c.font=font(900,90,COND);c.fillStyle=f.a;c.fillText(f.sub,W/2,1440);c.globalAlpha=1;kick(c,f.cta,W/2,1540,fgA(f.p,.6),t,3.4,'center');c.textAlign='left';logoCorner(c,A,t,3.4,W-150,170,110)}},
uygulama:{n:'Uygulama Ekranı',dur:7,map:L=>({title:L.brand,d1:L.items.slice(0,4).map(x=>x.join(' · ')).join('\n'),sub:'Online sipariş ver',cta:'Şimdi dene'}),labels:{title:'Uygulama adı',d1:'Liste (her satır: ad · fiyat)',sub:'Başlık',cta:'Çağrı'},max:{d1:200},
 tracks:[['Zemin',0,7,1],['Telefon',.1,.9],['Liste',.9,3],['Dokunma',3,3.6],['Başlık',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.1,.9));const pw=600,ph=1140,px=W/2-pw/2,py=180+(1-e)*500;c.save();c.globalAlpha=e;rr(c,px-20,py-20,pw+40,ph+40,90);c.fillStyle='#0E0E12';c.fill();rr(c,px,py,pw,ph,72);c.save();c.clip();c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#16161C';c.fillRect(px,py,pw,ph);const ifg=lum(f.p)>.45?'#15120C':'#F6F3EE';
  c.fillStyle=f.a;c.fillRect(px,py,pw,240);c.font=font(900,64,COND);c.fillStyle=onColor(f.a);c.fillText(String(f.title).toLocaleUpperCase('tr'),px+50,py+170);c.font=font(500,22,MONO);c.fillText('9:41',px+50,py+70);
  const rows=String(f.d1||'').split('\n').map(SP).filter(r=>r.length).slice(0,4);const sc=eio(prog(t,2,3))*60;rows.forEach((r,i)=>{const y=py+290+i*200-sc;const k=eo(prog(t,.9+i*.25,1.3+i*.25));c.globalAlpha=e*k;rr(c,px+30,y,pw-60,170,30);c.fillStyle=lum(f.p)>.45?'#F3F1EC':'#222229';c.fill();rr(c,px+50,y+20,130,130,24);c.fillStyle=mix(f.a,'#ffffff',.6);c.fill();icon(c,'foto',px+115,y+85,60,f.a,3);
   c.font=font(700,34,BODY);c.fillStyle=ifg;c.fillText(wrap(c,r[0]||'',260,1)[0]||'',px+210,y+75);c.font=font(900,44,COND);c.fillStyle=f.a;c.fillText(r[1]||'',px+210,y+130);c.beginPath();c.arc(px+pw-90,y+85,32,0,Math.PI*2);c.fill();c.fillStyle=onColor(f.a);c.font=font(800,44,BODY);c.textAlign='center';c.fillText('+',px+pw-90,y+100);c.textAlign='left'});c.globalAlpha=e;
  const tp=prog(t,3,3.6);if(tp>0&&tp<1){c.beginPath();c.arc(px+pw-90,py+290+85-sc,32+tp*80,0,Math.PI*2);c.strokeStyle=f.a;c.lineWidth=6;c.globalAlpha=1-tp;c.stroke();c.globalAlpha=e}
  rr(c,px+30,py+ph-150,pw-60,110,55);c.fillStyle=f.a;c.fill();c.font=font(800,40,BODY);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.cta,W/2,py+ph-82);c.textAlign='left';c.restore();c.restore();
  c.textAlign='center';gTxt(c,f.sub,W/2,1560,84,3.4,t,{...st,align:'center'},fg,{align:'center',l:2});c.textAlign='left';logoCorner(c,A,t,3.6,W/2,H-110,100)}},
rozet:{n:'Garanti Rozeti',dur:6,map:L=>({d1:L.stats.yr+' YIL',title:L.feats[2],sub:L.brand+' güvencesiyle',cta:'Detaylı bilgi'}),labels:{d1:'Rozet ortası',title:'Başlık',sub:'Alt metin',cta:'Çağrı'},max:{d1:8},
 tracks:[['Zemin',0,6,1],['Rozet',.2,1.2],['Dönme',.2,6],['Başlık',1.2,2],['Çağrı',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eback(clamp(prog(t,.2,1.2)));const cx=W/2,cy=760,r=330;c.save();c.translate(cx,cy);c.scale(e,e);c.rotate(t*.25);c.beginPath();for(let i=0;i<48;i++){const a=i*Math.PI/24,rr2=i%2?r:r+28;c.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}c.closePath();c.fillStyle=f.a;c.fill();
  c.font=font(700,34,MONO);c.fillStyle=onColor(f.a);const txt=(' ★ '+String(f.sub).toLocaleUpperCase('tr')).repeat(3);const arc=Math.PI*2/txt.length;[...txt].forEach((ch,i)=>{c.save();c.rotate(i*arc);c.translate(0,-r+70);c.textAlign='center';c.fillText(ch,0,0);c.restore()});c.rotate(-t*.25);
  c.beginPath();c.arc(0,0,r-120,0,Math.PI*2);c.strokeStyle=onColor(f.a);c.lineWidth=4;c.stroke();const sz=fitFont(c,String(f.d1),(r-150)*2,140,60);c.font=font(900,sz,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d1,0,sz*.35);icon(c,'check',0,-sz*.65,60,onColor(f.a),5);c.restore();
  c.textAlign='center';gTxt(c,f.title,W/2,1300,92,1.2,t,{...st,align:'center'},fg,{align:'center',l:2});gPill(c,f.cta,W/2,1560,2.4,t,f,'center');c.textAlign='left';logoCorner(c,A,t,2.6,W-150,170,110)}},
bulten:{n:'Bültene Kayıt',dur:7,map:L=>({title:'Kampanyaları ilk sen duy',d1:'ornek@mail.com',sub:'Abone ol, '+L.off+' indirim kazan',cta:'Abone ol'}),labels:{title:'Başlık',d1:'Örnek e-posta',sub:'Alt metin',cta:'Düğme'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Zarf',.6,1.4],['Yazma',1.6,3],['Düğme',3,3.6],['Onay',3.6,4.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);TT(c,f,t,st,330,90,2,'center');const e=eback(clamp(prog(t,.6,1.4)));const done=t>3.5;c.save();c.translate(W/2,790);c.scale(e,e);const fly=done?eio(prog(t,3.5,4.2)):0;c.translate(fly*700,-fly*300);c.rotate(fly*.4);c.fillStyle=f.a;rr(c,-220,-150,440,300,24);c.fill();c.strokeStyle=onColor(f.a);c.lineWidth=8;c.lineJoin='round';c.beginPath();c.moveTo(-200,-130);c.lineTo(0,20);c.lineTo(200,-130);c.stroke();c.restore();
  if(done){const k=eback(clamp(prog(t,3.8,4.3)));c.save();c.translate(W/2,790);c.scale(k,k);c.beginPath();c.arc(0,0,110,0,Math.PI*2);c.fillStyle='#2BB673';c.fill();icon(c,'check',0,0,120,'#fff',8);c.restore()}
  const y=1110;rr(c,90,y,W-180,130,65);c.fillStyle=lum(f.p)>.45?'#FFFFFF':fgA(f.p,.1);c.fill();c.strokeStyle=fgA(f.p,.2);c.lineWidth=3;c.stroke();const m=String(f.d1);const n=Math.floor(clamp((t-1.6)/1.4)*m.length);c.font=font(600,46,BODY);c.fillStyle=fg;c.fillText(n?m.slice(0,n):'',150,y+82);if(!n){c.fillStyle=fgA(f.p,.4);c.fillText('E-posta adresin',150,y+82)}if(t>1.6&&t<3.2&&Math.floor(t*3)%2===0){c.fillStyle=f.a;c.fillRect(154+c.measureText(m.slice(0,n)).width,y+36,4,60)}
  const bp=t>3.2&&t<3.4?.94:1;c.save();c.translate(W/2,1340);c.scale(bp,bp);rr(c,-W/2+90,-65,W-180,130,65);c.fillStyle=done?'#2BB673':f.a;c.fill();c.font=font(800,48,BODY);c.fillStyle=done?'#fff':onColor(f.a);c.textAlign='center';c.fillText(done?'Abone oldun ✓':f.cta,0,16);c.restore();
  gSmall(c,f.sub,W/2,1530,44,2,t,fgA(f.p,.85),'center',900,2,700);logoCorner(c,A,t,3,W/2,H-150,100)}}
});

// ===== Yeni meslekler: tek profilden tüm reklam türlerinin metinlerini üretir =====
function addSector(P){const B=String(P.brand).toLocaleUpperCase('tr');const j=a=>a.join(' · ');const num=String(P.stats.n).replace(/[^\d]/g,'');
 SECTORS.push({n:P.n,p:P.p,c:{duyuru:P.news,indirim:P.disc,urun:P.star,liste:[P.tipsT,P.tips[0],P.tips[1],P.tips[2]],menu:[P.menuT,j(P.items[0]),j(P.items[1]),j(P.items[2])],
  yorum:[P.reviews[0][0],P.reviews[0][1],P.reviews[0][2]||'Müşterimiz'],rakam:[P.rakamT,P.stats.n+' '+P.stats.nl,P.stats.x,String(P.stats.rt).replace('.',',')+' Google puanı'],
  etkinlik:P.ev,kanca:P.hook,geri:P.soon,marka:[B,P.slogan],kapanis:[P.close,P.web,P.phone,P.handle]}});
 C2.push({kupon:[P.offT,P.code,P.off,P.validity],paket:P.pk,hizmet:P.svc,surec:P.steps,cekilis:P.draw,sss:P.faq,konum:['Bizi burada bulun',P.addr+', '+P.area,P.near[0],P.near[1]],
  ekip:[P.team[0][0],P.team[0][1],P.quote],once:[P.once[0],P.once[1],'ÖNCE','SONRA'],sosyal:[num,P.stats.nl,String(P.stats.rt)],yeni:P.yeni});
 C3.push({saat:P.hours,kiyas:['Neden '+P.brand+'?',P.feats[0],P.feats[1],P.feats[2],B],flas:[P.off,P.flasT,P.flasD||'BU HAFTA',P.flasC||'Kaçırma'],anket:[P.anket[0],P.anket[1],P.anket[2],'Yorumlarda yaz'],
  takip:[P.handle,P.follow[0],P.follow[1],P.follow[2],P.follow[3]],ozel:[P.ozel[0],P.ozel[1],B],teslim:P.teslim,slogan:[P.slogan,B],randevu:P.randevu});
 LEX.push({brand:P.brand,handle:P.handle,web:P.web,phone:P.phone,area:P.area,addr:P.addr,items:P.items,feats:P.feats,tips:P.tips,donts:P.donts,myth:P.myth,faq:[P.faq[0],P.faq[1]],
  reviews:P.reviews.map(r=>[r[0],r[1]]),stats:{n:P.stats.n,nl:P.stats.nl,yr:P.stats.yr,rt:String(P.stats.rt).replace('.',','),rv:P.stats.rv},hist:P.hist,week:P.week,ev:[P.ev[0],P.ev[1]+' '+P.ev[2],P.ev[3]],
  off:P.off,offT:P.offT,code:P.code,prize:P.prize,team:P.team,clients:P.clients,words:P.words,route:P.route,hook:P.hook[0],prod:P.prod,loyal:P.loyal,big:P.big,weather:P.weather,cat:P.cat})}

// ===== Yeni meslekler A: fırın, kuyumcu, çiçekçi, market, veteriner, mobilya, temizlik, berber =====
addSector({n:'Fırın & Pastane',p:['#2A1C12','#F2C14E'],brand:'Altın Başak',slogan:'Her sabah taze, her gün sıcak',handle:'@altinbasakfirin',web:'altinbasak.com',phone:'0 216 000 00 00',area:'Üsküdar',addr:'Çarşı Cad. No:8',cat:'Fırın',
 news:['YENİ ÇIKTI','Ekşi mayalı köy ekmeği','Sabah 7\'de fırından çıkıyor','Sıcak sıcak al'],disc:['%20','Doğum günü pastalarında indirim','Bu hafta sipariş verenlere','Pastanı seç'],
 star:['Fıstıklı Baklava','Antep fıstığıyla, günlük','₺ 950 / kg','Tereyağlı','Günlük'],tipsT:'Ekmeğiniz için 3 öneri',tips:['Bez torbada saklayın','Buzdolabına koymayın','Bayatı fırında canlandırın','Dilimleyip dondurun','Ilık yiyin'],donts:['Ekmeği naylonda saklamak','Buzdolabına koymak','Sıcakken dilimlemek'],
 menuT:'Fırından bugün',items:[['Köy ekmeği','₺45'],['Simit','₺20'],['Poğaça','₺25'],['Fıstıklı baklava','₺950'],['Doğum günü pastası','₺1.200'],['Açma','₺25']],
 reviews:[['Ekmeği her sabah buradan alıyoruz.','Ayşe K.'],['Pasta hem güzel hem lezzetliydi.','Burak T.'],['Simitleri hâlâ sıcak geliyor.','Elif S.']],rakamT:'Rakamlarla fırınımız',stats:{n:'2.000+',nl:'günlük ekmek',yr:'32',rt:4.9,rv:'680',x:'32 yıllık usta'},
 ev:['Pasta Süsleme Atölyesi','16','KASIM','Üsküdar şubesi · 14:00','Yerini ayırt'],hook:['Ekmeğin neden çabuk bayatlıyor?','Çünkü katkı maddeli. Bizimki 3 gün taze.'],soon:['Yeni şubemiz açılıyor','Kadıköy · 1 Aralık','YAKINDA'],close:'Afiyet olsun!',
 offT:'İlk pasta siparişine',code:'BASAK15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Kahvaltı kutuları','2 kişilik · ₺ 390','Aile · ₺ 690','Ofis · ₺ 1.490'],svc:['Neler yapıyoruz?','Ekmek','Pasta','Baklava','Catering'],
 steps:['Pasta siparişi 4 adımda','Tasarımı seç','Boyutu belirle','Mesajını yaz','Kapına gelsin'],draw:['1 aylık ücretsiz ekmek kazan','Çekiliş 1 Aralık\'ta'],faq:['Pasta siparişi kaç gün önce?','En az 2 gün önce.','Glutensiz ürün var mı?','Evet, her gün 3 çeşit.'],
 near:['Çarşıya 1 dk','Sabah 6\'da açık'],team:[['Usta Hasan','Ekmek ustası'],['Zeynep A.','Pasta şefi'],['Mert D.','Baklava ustası'],['Elif K.','Mağaza']],quote:'Hamuru acele ettirirseniz ekmek size küser.',
 once:['Vitrinimiz yenilendi','Aynı lezzet, yeni görünüm'],yeni:['VİTRİNDE YENİ','Frambuazlı cheesecake','Sadece hafta sonu','Tadına bak'],hours:['Açık olduğumuz saatler','Hafta içi · 06:00 – 21:00','Cumartesi · 06:00 – 22:00','Pazar · 07:00 – 20:00','İlk ekmek 06:30\'da çıkar'],
 feats:['Her sabah taze','Tereyağlı hamur','Katkısız ekşi maya','Pastaya isim yazımı','Kapıya teslim','Glutensiz seçenek'],flasT:'Saat 20:00\'den sonra tüm ekmeklerde indirim',anket:['Kahvaltıda hangisi?','Simit','Poğaça'],
 follow:['Fırından taze kareler','Her sabah yeni çıkanlar','620','18B'],ozel:['Bayramınız tatlı olsun','BAYRAM'],teslim:['Sipariş kolaylığı','Mahalleye ücretsiz teslim','Kapıda kartla ödeme','Beğenmezsen değiştiririz'],
 randevu:['Pastanı ayırt','22','KASIM','10:00 · 14:00 · 18:00','Sipariş ver'],myth:['Kepekli ekmek her zaman daha sağlıklıdır','Önemli olan unun tam buğday olması, rengi değil'],
 hist:[['1994','İlk fırınımız'],['2005','Pastane bölümü'],['2018','Ekşi maya'],['2026','2. şube']],week:[['Pzt','Köy ekmeği'],['Çar','Baklava günü'],['Cum','Pasta indirimi'],['Cmt','Kahvaltı kutusu'],['Paz','Sıcak açma']],
 prize:['Bedava ekmek','Pasta','%10 indirim','Kahvaltı kutusu','Baklava','Tekrar dene'],clients:['Mahalle Kafe','Okul Kantini','Ofis Kahvaltı','Düğün Salonu','Otel Kahvaltı','Spor Kulübü'],words:['taze','sıcak','çıtır','ev yapımı'],
 route:['Üsküdar Meydanı','Altın Başak','3 dk yürüme'],prod:'Ekşi mayalı köy ekmeği',loyal:'10. ekmek bizden',big:'TAZE',weather:'Soğuk sabahlara sıcak simit'});
addSector({n:'Kuyumcu',p:['#14110B','#E8C07D'],brand:'Lale Kuyumculuk',slogan:'Değerinizi taşıyan ışıltı',handle:'@lalekuyum',web:'lalekuyum.com',phone:'0 212 000 00 00',area:'Kapalıçarşı',addr:'Kalpakçılar Cad. No:22',cat:'Kuyumcu',
 news:['YENİ KOLEKSİYON','Pırlanta tektaş koleksiyonu','Sertifikalı taşlar, ömür boyu bakım','Randevu al'],disc:['%20','Alyans çiftlerinde işçilik indirimi','Kasım boyunca','Mağazaya gel'],
 star:['Pırlanta Tektaş','0,30 ct · 14 ayar beyaz altın','₺ 48.000','Sertifikalı','Ömür boyu bakım'],tipsT:'Takılarınız için 3 öneri',tips:['Parfümü takıdan önce sıkın','Ayrı kutularda saklayın','Yılda bir temizletin','Denize girmeden çıkarın','Yumuşak bezle silin'],donts:['Takıyla duş almak','Hepsini aynı kutuda saklamak','Çamaşır suyuna değdirmek'],
 menuT:'Bugünkü fiyatlar',items:[['Çeyrek altın','₺11.200'],['Gram altın','₺4.350'],['Alyans çifti','₺18.500'],['Pırlanta tektaş','₺48.000'],['Bileklik','₺22.000'],['Kolye','₺9.800']],
 reviews:[['Alyanslarımız tam hayal ettiğimiz gibi.','Seda & Can'],['Çok güvenilir bir esnaf.','Hakan B.'],['Eski takımı yeniledik, harika oldu.','Nur Y.']],rakamT:'Rakamlarla Lale',stats:{n:'25.000+',nl:'mutlu çift',yr:'40',rt:4.9,rv:'1.120',x:'3 kuşak usta'},
 ev:['Alyans Günleri','14','ŞUBAT','Kapalıçarşı · 10:00','Randevu al'],hook:['Alyansın sana gerçekten uyuyor mu?','Parmak ölçün mevsime göre değişir. Ücretsiz ölçelim.'],soon:['Nişantaşı mağazamız açılıyor','Nişantaşı · 1 Aralık','YAKINDA'],close:'Mutlu günlerde yanınızdayız',
 offT:'İlk alyans alışverişinde',code:'LALE5',off:'%5',validity:'Yıl sonuna kadar geçerli',pk:['Takı setleri','Nişan seti · ₺ 32.000','Söz seti · ₺ 24.000','Düğün seti · ₺ 85.000'],svc:['Hizmetlerimiz','Alyans','Pırlanta','Tamir','Özel tasarım'],
 steps:['Özel alyans 4 adımda','Modeli seç','Ölçünü al','İsim yazdır','Teslim al'],draw:['Gram altın kazan','Çekiliş 31 Aralık\'ta'],faq:['Sertifika veriyor musunuz?','Her pırlantada uluslararası sertifika.','Taksit var mı?','Kredi kartına 6 taksit.'],
 near:['Beyazıt tramvayına 3 dk','Otopark anlaşmalı'],team:[['Lale Usta','Kurucu'],['Kerem T.','Tasarımcı'],['Ayten K.','Satış'],['Ali R.','Atölye']],quote:'Bir yüzük, bir ömrün hikâyesini taşır.',
 once:['Eski takınız yeniden doğsun','Atölyemizde yenileme'],yeni:['VİTRİNDE YENİ','Zümrüt taşlı yüzük','Sınırlı sayıda','İncele'],hours:['Mağaza saatleri','Hafta içi · 09:00 – 19:00','Cumartesi · 09:00 – 19:00','Pazar · Kapalı','Randevuyla özel görüşme'],
 feats:['Sertifikalı pırlanta','Ücretsiz ölçü','Ömür boyu temizlik','Özel tasarım','Takas imkânı','6 taksit'],flasT:'Alyans işçiliğinde hafta sonu fırsatı',anket:['Hangi alyans?','Sarı altın','Beyaz altın'],
 follow:['Yeni tasarımları ilk gör','Her hafta yeni koleksiyon','340','21B'],ozel:['Sevgililer Günü kutlu olsun','14 ŞUBAT'],teslim:['Alışveriş güvencesi','Sigortalı kargo','Kredi kartına 6 taksit','Faturalı ve sertifikalı'],
 randevu:['Özel görüşme ayırt','20','KASIM','11:00 · 14:00 · 17:00','Randevu al'],myth:['Beyaz altın aslında gümüştür','Beyaz altın, altının beyaz metallerle alaşımıdır'],
 hist:[['1986','Kapalıçarşı dükkânı'],['2001','Atölye'],['2015','Pırlanta bölümü'],['2026','Nişantaşı mağazası']],week:[['Pzt','Ücretsiz temizlik'],['Çar','Alyans ölçümü'],['Cum','Yeni gelenler'],['Cmt','Çift günü'],['Paz','Kapalı']],
 prize:['Gram altın','Takı temizliği','%5 indirim','Gümüş kolye','Hediye kutusu','Tekrar dene'],clients:['Gelin Evi','Düğün Salonu','Nişan Organizasyon','Fotoğraf Stüdyosu','Çiçekçi Lale','Butik Otel'],words:['zarif','değerli','kalıcı','ışıltılı'],
 route:['Beyazıt Tramvay','Lale Kuyumculuk','3 dk yürüme'],prod:'Pırlanta tektaş',loyal:'Alyansa ücretsiz isim yazımı',big:'ALTIN',weather:'Kış düğünlerine özel set'});
addSector({n:'Çiçekçi',p:['#1F1418','#F49AC1'],brand:'Lavanta Çiçek',slogan:'Söyleyemediklerinizi çiçekler söylesin',handle:'@lavantacicek',web:'lavantacicek.com',phone:'0 232 000 00 00',area:'Alsancak',addr:'Kıbrıs Şehitleri Cad. No:40',cat:'Çiçekçi',
 news:['YENİ GELDİ','Kurutulmuş çiçek buketleri','Aylarca solmayan zarafet','Sipariş ver'],disc:['%20','Haftalık çiçek aboneliğinde indirim','İlk ay için','Abone ol'],
 star:['Kırmızı Gül Buketi','21 adet Ekvador gülü','₺ 1.450','Aynı gün teslim','Not kartı'],tipsT:'Çiçeğiniz uzun yaşasın',tips:['Sapları çapraz kesin','Suyu 2 günde değiştirin','Güneşten uzak tutun','Meyveden uzak tutun','Serin yerde saklayın'],donts:['Güneşe koymak','Suyu değiştirmemek','Kaloriferin yanında tutmak'],
 menuT:'Çiçek fiyatları',items:[['Gül buketi','₺1.450'],['Orkide','₺950'],['Papatya buketi','₺450'],['Söz çiçeği','₺2.500'],['Kurutulmuş buket','₺750'],['Saksı bitkisi','₺350']],
 reviews:[['Buket fotoğraftakinden de güzeldi.','Ceren A.'],['Aynı gün teslim etmeleri hayat kurtardı.','Emre K.'],['Söz çiçeğimiz muhteşemdi.','Selin & Ozan']],rakamT:'Rakamlarla Lavanta',stats:{n:'30.000+',nl:'teslim edilen buket',yr:'11',rt:4.9,rv:'1.480',x:'90 dk içinde teslim'},
 ev:['Buket Yapım Atölyesi','23','KASIM','Alsancak · 15:00','Yerini ayırt'],hook:['En son ne zaman çiçek aldın?','Sebep gerekmez. Bugün birini mutlu et.'],soon:['Bornova şubemiz açılıyor','Bornova · 1 Aralık','YAKINDA'],close:'Sevgiyle gönderin',
 offT:'İlk siparişe özel',code:'LAVANTA15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Abonelik paketleri','Haftalık · ₺ 1.600','Ofis · ₺ 2.900','Premium · ₺ 4.800'],svc:['Neler yapıyoruz?','Buket','Söz çiçeği','Ofis çiçeği','Düğün süslemesi'],
 steps:['Çiçek göndermek 4 adımda','Buketi seç','Notunu yaz','Saati seç','Kapıya teslim'],draw:['1 ay ücretsiz çiçek kazan','Çekiliş 14 Şubat\'ta'],faq:['Aynı gün teslim var mı?','Saat 16:00\'ya kadar verilen siparişlerde.','Not kartı ekleniyor mu?','Evet, el yazısıyla.'],
 near:['Alsancak Garı\'na 4 dk','Şehir içi 90 dk teslim'],team:[['Lale Y.','Çiçek tasarımcısı'],['Okan D.','Kurye'],['Ece S.','Düğün süsleme'],['Naz K.','Sipariş']],quote:'Her buket bir duyguyu taşır, biz sadece şekil veriyoruz.',
 once:['Masanız çiçekle başka','Ofis çiçeği aboneliği'],yeni:['SEZONDA YENİ','Şakayık buketi','Sadece bu ay','Sipariş ver'],hours:['Çalışma saatlerimiz','Hafta içi · 08:00 – 21:00','Cumartesi · 08:00 – 22:00','Pazar · 09:00 – 20:00','Online sipariş 7/24'],
 feats:['Aynı gün teslim','Taze çiçek garantisi','El yazısı not','Fotoğraflı teslim','Abonelik','Kurumsal fatura'],flasT:'Hafta sonu tüm buketlerde indirim',anket:['Hangisini seçerdin?','Kırmızı gül','Beyaz orkide'],
 follow:['Her gün yeni buket','Kurulumdan teslime','910','36B'],ozel:['Anneler Günü kutlu olsun','ANNEM'],teslim:['Teslimat','Şehir içi 90 dakikada','Kapıda kartla ödeme','Solarsa yenisini gönderiyoruz'],
 randevu:['Söz çiçeğini planla','29','KASIM','11:00 · 14:00 · 17:00','Sipariş ver'],myth:['Kesme çiçeğe şeker koymak ömrünü uzatır','Şeker bakteriyi artırır, temiz su daha etkilidir'],
 hist:[['2015','İlk dükkân'],['2018','Online sipariş'],['2022','Düğün birimi'],['2026','Bornova şubesi']],week:[['Pzt','Ofis çiçekleri'],['Çar','Orkide günü'],['Cum','Gül indirimi'],['Cmt','Atölye'],['Paz','Kurutulmuş buket']],
 prize:['Gül buketi','Orkide','%10 indirim','Saksı bitkisi','Not kartı','Tekrar dene'],clients:['Butik Otel','Düğün Salonu','Ofis Merkezi','Restoran Zeytin','Klinik Medika','Organizasyon Evi'],words:['sevgi','özlem','teşekkür','kutlama'],
 route:['Alsancak Garı','Lavanta Çiçek','4 dk yürüme'],prod:'Kırmızı gül buketi',loyal:'5. buket bizden',big:'ÇİÇEK',weather:'Yağmurlu günlere renkli buket'});
addSector({n:'Market & Şarküteri',p:['#0F1F17','#7BD389'],brand:'Bereket Market',slogan:'Mahallenin taze marketi',handle:'@bereketmarket',web:'bereketmarket.com',phone:'0 312 000 00 00',area:'Bahçelievler',addr:'7. Cadde No:15',cat:'Market',
 news:['YENİ GELDİ','Köyden günlük süt ve yoğurt','Her sabah çiftlikten','Hemen gel'],disc:['%25','Meyve ve sebzede hafta sonu indirimi','Cumartesi ve pazar','Sepetini doldur'],
 star:['Köy Peyniri','Tam yağlı, 6 ay olgunlaştırılmış','₺ 420 / kg','Katkısız','Yerel üretici'],tipsT:'Alışverişte 3 öneri',tips:['Liste yaparak gelin','Mevsim sebzesi seçin','Etiketi okuyun','Aç karnına alışverişe çıkmayın','Bez çanta getirin'],donts:['Liste yapmadan gelmek','Son kullanma tarihine bakmamak','Mevsim dışı sebze almak'],
 menuT:'Bu haftanın fiyatları',items:[['Köy peyniri','₺420'],['Domates','₺35'],['Köy yumurtası (30)','₺210'],['Zeytin','₺280'],['Bal','₺650'],['Tereyağı','₺480']],
 reviews:[['Sebzeleri hep taze.','Fatma Y.'],['Eve servisleri çok hızlı.','Murat B.'],['Peynirleri çok lezzetli.','Gül A.']],rakamT:'Rakamlarla Bereket',stats:{n:'4.000+',nl:'ürün çeşidi',yr:'18',rt:4.8,rv:'540',x:'40 yerel üretici'},
 ev:['Yerel Üretici Pazarı','30','KASIM','Market önü · 10:00','Uğra'],hook:['Domatesin neden tatsız?','Mevsiminde değilse. Bizdekiler köyden.'],soon:['Yeni şubemiz açılıyor','Çankaya · 1 Aralık','YAKINDA'],close:'Afiyet olsun!',
 offT:'İlk online siparişe',code:'BEREKET10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Haftalık sepet','Temel · ₺ 890','Aile · ₺ 1.690','Kahvaltı · ₺ 990'],svc:['Neler var?','Şarküteri','Manav','Kasap','Eve servis'],
 steps:['Online sipariş 4 adımda','Ürünleri seç','Saat belirle','Kapıda öde','Kapına gelsin'],draw:['1 aylık alışveriş çeki kazan','Çekiliş 1 Aralık\'ta'],faq:['Eve servis ücretli mi?','300 TL üzeri ücretsiz.','Kapıda kartla ödenir mi?','Evet.'],
 near:['Durağa 1 dk','Otopark var'],team:[['Hüseyin A.','Kurucu'],['Ayşe T.','Şarküteri'],['Kemal D.','Manav'],['Oğuz K.','Kurye']],quote:'Kendi soframa koymadığımı rafıma koymam.',
 once:['Reyonlarımız yenilendi','Daha ferah, daha düzenli'],yeni:['RAFLARDA YENİ','Organik zeytinyağı','Ege\'den, soğuk sıkım','İncele'],hours:['Açık olduğumuz saatler','Hafta içi · 07:00 – 23:00','Cumartesi · 07:00 – 23:00','Pazar · 08:00 – 22:00','Eve servis 21:00\'e kadar'],
 feats:['Günlük taze ürün','Yerel üretici','Eve servis','Kapıda ödeme','Uygun fiyat','Temiz reyon'],flasT:'Akşam 20:00\'den sonra ekmek ve pastada indirim',anket:['Kahvaltıda hangisi?','Beyaz peynir','Kaşar'],
 follow:['Günün fırsatlarını kaçırma','Her gün yeni indirim','280','9.400'],ozel:['Ramazan Bayramınız kutlu olsun','BAYRAM'],teslim:['Eve servis','30 dakikada kapında','Kapıda kart veya nakit','Beğenmezsen iade'],
 randevu:['Bayram siparişini ayırt','28','MART','10:00 · 14:00 · 18:00','Sipariş ver'],myth:['Kahverengi yumurta daha besleyicidir','Kabuk rengi tavuğun cinsiyle ilgilidir, besinle değil'],
 hist:[['2008','İlk market'],['2014','Şarküteri reyonu'],['2020','Eve servis'],['2026','2. şube']],week:[['Pzt','Manav indirimi'],['Çar','Şarküteri günü'],['Cum','Et indirimi'],['Cmt','Üretici pazarı'],['Paz','Kahvaltı sepeti']],
 prize:['₺500 çek','Kahvaltı sepeti','%10 indirim','Bal','Zeytinyağı','Tekrar dene'],clients:['Mahalle Kafe','Apartman Yönetimi','Okul Kantini','Ofis Mutfağı','Restoran Lezzet','Spor Kulübü'],words:['taze','yerel','uygun','yakın'],
 route:['7. Cadde Durağı','Bereket Market','1 dk'],prod:'Köy peyniri',loyal:'10. alışverişte %10',big:'TAZE',weather:'Soğuk günlere çorbalık sebze'});
addSector({n:'Veteriner & Pet Shop',p:['#0B1E2D','#5EC2F2'],brand:'Pati Klinik',slogan:'Can dostunuz emin ellerde',handle:'@patiklinik',web:'patiklinik.com',phone:'0 216 000 00 00',area:'Ataşehir',addr:'Atatürk Mah. No:12',cat:'Veteriner',
 news:['YENİ HİZMET','Evde veteriner hizmeti','Can dostunuz yerinden kalkmasın','Randevu al'],disc:['%20','Aşı paketinde indirim','Kasım boyunca','Randevu al'],
 star:['Kedi Kuru Maması','Tahılsız, somonlu, 2 kg','₺ 890','Veteriner önerisi','Tahılsız'],tipsT:'Kediniz için 3 öneri',tips:['Aşı takvimini aksatmayın','Taze su bulundurun','Tüylerini haftada taraın','Yılda bir check-up','Kumu temiz tutun'],donts:['İnsan ilacı vermek','Çikolata vermek','Aşıyı ertelemek'],
 menuT:'Muayene ve aşı',items:[['Muayene','₺750'],['Karma aşı','₺900'],['Kuduz aşısı','₺600'],['Kısırlaştırma','₺4.500'],['Tıraş & bakım','₺850'],['Mama (2 kg)','₺890']],
 reviews:[['Kedimize çok şefkatli davrandılar.','Ezgi T.'],['Gece acilde bile ilgilendiler.','Can B.'],['Pet shop çeşitleri çok iyi.','Selin A.']],rakamT:'Rakamlarla Pati',stats:{n:'9.000+',nl:'mutlu can dost',yr:'12',rt:4.9,rv:'960',x:'7/24 acil hattı'},
 ev:['Ücretsiz Sahiplendirme Günü','23','KASIM','Pati Klinik · 12:00','Katıl'],hook:['Kedin neden su içmiyor?','Çeşme şeklinde akan su dene. Daha çok içer.'],soon:['Pet otelimiz açılıyor','Ataşehir · 1 Aralık','YAKINDA'],close:'Patileriniz sağlıklı olsun',
 offT:'İlk muayenede',code:'PATI15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Sağlık paketleri','Yavru · ₺ 2.400','Yetişkin · ₺ 1.900','Yaşlı dost · ₺ 2.900'],svc:['Hizmetlerimiz','Muayene','Aşı','Cerrahi','Bakım & tıraş'],
 steps:['Randevu 4 adımda','Hizmeti seç','Saati ayır','Kliniğe gel','Takibi al'],draw:['1 yıllık mama kazan','Çekiliş 1 Aralık\'ta'],faq:['Acil hizmet var mı?','7/24 acil hattımız açık.','Evde muayene yapıyor musunuz?','Ataşehir ve çevresinde evet.'],
 near:['Metroya 5 dk','Otopark var'],team:[['Vet. Hek. Deniz A.','Veteriner hekim'],['Vet. Hek. Can T.','Cerrah'],['Elif K.','Bakım uzmanı'],['Mert S.','Pet shop']],quote:'Konuşamayan hastalarımızı gözlerinden anlamaya çalışıyoruz.',
 once:['Tüyleri pırıl pırıl','Bakım ve tıraş'],yeni:['RAFLARDA YENİ','Doğal köpek ödülleri','Katkısız, kurutulmuş','İncele'],hours:['Çalışma saatlerimiz','Hafta içi · 09:00 – 20:00','Cumartesi · 10:00 – 18:00','Pazar · Acil hat','Acil hattımız 7/24 açık'],
 feats:['7/24 acil hat','Evde muayene','Aşı takibi hatırlatma','Uzman hekimler','Pet otel','Online randevu'],flasT:'Mama ve kumda hafta sonu fırsatı',anket:['Sen hangisisin?','Kedi insanı','Köpek insanı'],
 follow:['Minik hastalarımızı gör','Her gün yeni pati','720','44B'],ozel:['Dünya Hayvanları Günü kutlu olsun','4 EKİM'],teslim:['Pet shop siparişi','Aynı gün teslim','Kapıda kartla ödeme','Açılmamış ürüne iade'],
 randevu:['Aşı randevusu al','21','KASIM','10:00 · 13:00 · 16:00','Randevu al'],myth:['Kediler süt içmeli','Çoğu kedi laktozu sindiremez, su yeterli'],
 hist:[['2014','Klinik açıldı'],['2018','Cerrahi ünite'],['2022','Pet shop'],['2026','Pet otel']],week:[['Pzt','Aşı günü'],['Çar','Bakım & tıraş'],['Cum','Mama indirimi'],['Cmt','Sahiplendirme'],['Paz','Acil hat']],
 prize:['Ücretsiz muayene','Mama','%10 indirim','Oyuncak','Tıraş','Tekrar dene'],clients:['Barınak Dostları','Pet Kafe','Köpek Okulu','Kedi Kulübü','Hayvan Hakları','Belediye Barınağı'],words:['sevgi','sağlık','şefkat','güven'],
 route:['Ataşehir Metro','Pati Klinik','5 dk yürüme'],prod:'Tahılsız kedi maması',loyal:'5. bakım bizden',big:'PATİ',weather:'Soğuk günlerde patileri koruyun'});
addSector({n:'Mobilya & Dekorasyon',p:['#1C1D21','#D9A86C'],brand:'Ahşap Ev',slogan:'Evinize karakter katan mobilyalar',handle:'@ahsapevmobilya',web:'ahsapev.com',phone:'0 224 000 00 00',area:'İnegöl',addr:'Mobilya Kenti No:20',cat:'Mobilya',
 news:['YENİ KOLEKSİYON','Masif meşe yemek takımı','El işçiliği, ömürlük','Showroom\'u gez'],disc:['%30','Köşe takımlarında sezon sonu indirimi','Stoklarla sınırlı','Hemen incele'],
 star:['Meşe Yemek Masası','6 kişilik, masif meşe','₺ 28.900','El yapımı','10 yıl garanti'],tipsT:'Küçük salona 3 öneri',tips:['Açık renk seçin','Ayaklı mobilya kullanın','Ayna ile genişletin','Duvara raf asın','Halıyı büyük seçin'],donts:['Odayı mobilyayla doldurmak','Koyu ve büyük perde','Ölçmeden almak'],
 menuT:'Öne çıkanlar',items:[['Köşe takımı','₺34.900'],['Yemek masası','₺28.900'],['Yatak odası','₺49.900'],['Berjer','₺9.900'],['TV ünitesi','₺12.400'],['Sehpa','₺4.900']],
 reviews:[['Masamız tam ölçümüze yapıldı.','Derya & Kaan'],['Kurulumu çok temiz yaptılar.','Hakan T.'],['Kalitesi fiyatına değer.','Sevgi B.']],rakamT:'Rakamlarla Ahşap Ev',stats:{n:'15.000+',nl:'döşenen ev',yr:'28',rt:4.8,rv:'1.050',x:'10 yıl garanti'},
 ev:['Showroom Açık Ev Günü','30','KASIM','İnegöl · 11:00','Gezmeye gel'],hook:['Salonun neden küçük görünüyor?','Mobilyan yerden kalkmıyorsa. Ayaklı modelleri dene.'],soon:['İstanbul showroom\'umuz açılıyor','Maslak · 1 Aralık','YAKINDA'],close:'Evinize hayırlı olsun',
 offT:'Peşin alımda ek',code:'AHSAP5',off:'%5',validity:'Yıl sonuna kadar geçerli',pk:['Ev paketleri','Salon · ₺ 59.000','Yatak odası · ₺ 49.900','Komple ev · ₺ 149.000'],svc:['Hizmetlerimiz','Özel ölçü','Ücretsiz montaj','İç mimari','Döşeme yenileme'],
 steps:['Özel ölçü mobilya 4 adımda','Ölçü al','Modeli seç','Kumaşı seç','Montajla teslim'],draw:['Berjer kazan','Çekiliş 31 Aralık\'ta'],faq:['Montaj ücretli mi?','Türkiye geneli ücretsiz.','Taksit var mı?','Kredi kartına 12 taksit.'],
 near:['Otogara 10 dk','Geniş otopark'],team:[['Ahmet Usta','Marangoz'],['Elif D.','İç mimar'],['Can K.','Satış'],['Murat B.','Montaj']],quote:'İyi mobilya, torunlarınıza kalacak mobilyadır.',
 once:['Salonunuzu yeniledik','Aynı ev, yeni yaşam'],yeni:['SHOWROOMDA YENİ','Keten kumaşlı kanepe','Yıkanabilir kumaş','İncele'],hours:['Showroom saatleri','Hafta içi · 09:00 – 20:00','Cumartesi · 09:00 – 20:00','Pazar · 10:00 – 19:00','Online sipariş 7/24'],
 feats:['Masif ahşap','Özel ölçü','Ücretsiz montaj','10 yıl garanti','12 taksit','Türkiye geneli teslim'],flasT:'Sezon sonu stok ürünlerinde indirim',anket:['Hangisi senin tarzın?','Doğal ahşap','Modern beyaz'],
 follow:['Ev ilhamı için takip et','Her gün yeni dekor','530','39B'],ozel:['Yeni evinizde mutluluklar','YUVA'],teslim:['Teslimat ve montaj','Türkiye geneli teslim','12 taksit imkânı','Ücretsiz montaj'],
 randevu:['İç mimar görüşmesi ayırt','24','KASIM','11:00 · 14:00 · 17:00','Randevu al'],myth:['Masif ahşap çatlar, bakımı zordur','Doğru kurutulmuş masif ahşap yıllarca dayanır'],
 hist:[['1998','Marangoz atölyesi'],['2008','İlk showroom'],['2018','Online satış'],['2026','İstanbul showroom']],week:[['Pzt','Yeni gelenler'],['Çar','İç mimar günü'],['Cum','Stok indirimi'],['Cmt','Açık ev'],['Paz','Showroom açık']],
 prize:['Berjer','Sehpa','%10 indirim','Kırlent seti','Halı','Tekrar dene'],clients:['Butik Otel','Kafe Zeytin','Ofis Merkezi','Mimarlık Ofisi','Yazlık Sitesi','Restoran Ahşap'],words:['doğal','sağlam','şık','ömürlük'],
 route:['İnegöl Otogarı','Ahşap Ev','10 dk'],prod:'Meşe yemek masası',loyal:'Komple evde perde hediye',big:'YUVA',weather:'Kışa sıcak ahşap dokular'});
addSector({n:'Temizlik & Ev Hizmetleri',p:['#06282A','#2DD4BF'],brand:'Pırıl Temizlik',slogan:'Siz dinlenin, evinizi biz parlatalım',handle:'@piriltemizlik',web:'piriltemizlik.com',phone:'0 850 000 00 00',area:'İstanbul geneli',addr:'Kozyatağı Ofis No:4',cat:'Temizlik',
 news:['YENİ HİZMET','Taşınma sonrası derin temizlik','Yeni evinize tertemiz girin','Teklif al'],disc:['%20','İlk ev temizliğinde indirim','Bu ay boyunca','Hemen ayırt'],
 star:['Detaylı Ev Temizliği','3+1 ev, 2 kişilik ekip','₺ 3.200','Ekipman dahil','Sigortalı ekip'],tipsT:'Temiz ev için 3 öneri',tips:['Her gün 10 dakika toparlayın','Yukarıdan aşağıya silin','Mikrofiber bez kullanın','Camı bulutlu havada silin','Haftalık plan yapın'],donts:['Çamaşır suyunu karıştırmak','Ahşabı ıslak silmek','Camı güneşte silmek'],
 menuT:'Hizmet fiyatları',items:[['Ev temizliği','₺3.200'],['Ofis temizliği','₺4.500'],['Cam silme','₺1.200'],['Koltuk yıkama','₺1.800'],['İnşaat sonrası','₺6.900'],['Ütü hizmeti','₺900']],
 reviews:[['Ev hiç bu kadar temiz olmamıştı.','Aylin K.'],['Ekip çok güvenilir.','Burak S.'],['Taşınmamızı kolaylaştırdılar.','Gizem & Onur']],rakamT:'Rakamlarla Pırıl',stats:{n:'18.000+',nl:'temizlenen ev',yr:'9',rt:4.8,rv:'1.320',x:'Sigortalı ekipler'},
 ev:['Bahar Temizliği Kampanyası','1','MART','İstanbul geneli','Ayırt'],hook:['Evini temizlemek hafta sonunu mu yiyor?','Hafta sonu senin. Temizlik bizden.'],soon:['Ankara\'ya geliyoruz','Ankara · 1 Ocak','YAKINDA'],close:'Tertemiz günler',
 offT:'İlk randevuya özel',code:'PIRIL20',off:'%20',validity:'Ay sonuna kadar geçerli',pk:['Abonelik paketleri','Haftalık · ₺ 10.900','2 haftada bir · ₺ 5.900','Aylık · ₺ 3.000'],svc:['Hizmetlerimiz','Ev temizliği','Ofis','Koltuk yıkama','İnşaat sonrası'],
 steps:['Temizlik 4 adımda','Hizmeti seç','Günü ayır','Ekip gelsin','Keyfini çıkar'],draw:['1 ay ücretsiz temizlik kazan','Çekiliş 1 Aralık\'ta'],faq:['Malzemeyi siz mi getiriyorsunuz?','Evet, tüm ekipman bizden.','Ekip sigortalı mı?','Tüm personelimiz sigortalı.'],
 near:['İstanbul geneli hizmet','Aynı gün randevu'],team:[['Sema A.','Ekip lideri'],['Hasan K.','Koltuk yıkama'],['Ayşe D.','Ofis ekibi'],['Mert T.','Operasyon']],quote:'Sizin evinizi kendi evimiz gibi temizliyoruz.',
 once:['Koltuğunuz ilk günkü gibi','Koltuk yıkama'],yeni:['YENİ HİZMET','Buharlı yatak temizliği','Akarlara son','Teklif al'],hours:['Çalışma saatlerimiz','Hafta içi · 08:00 – 20:00','Cumartesi · 09:00 – 18:00','Pazar · 10:00 – 16:00','Online randevu 7/24'],
 feats:['Sigortalı ekip','Ekipman dahil','Aynı gün randevu','Çevre dostu ürün','Memnuniyet garantisi','Kurumsal fatura'],flasT:'Hafta içi randevularda indirim',anket:['En sevmediğin iş hangisi?','Cam silmek','Ütü yapmak'],
 follow:['Önce ve sonra videoları','Her gün yeni dönüşüm','410','27B'],ozel:['Bayramınız kutlu olsun','BAYRAM'],teslim:['Güvence','Sigortalı ve eğitimli ekip','Kartla veya havaleyle ödeme','Beğenmezsen tekrar geliyoruz'],
 randevu:['Temizlik gününü seç','22','KASIM','09:00 · 13:00 · 16:00','Ayırt'],myth:['Sirke her şeyi temizler','Mermer ve doğal taşa zarar verir'],
 hist:[['2017','İlk ekip'],['2019','Kurumsal birim'],['2023','Koltuk yıkama'],['2026','Ankara']],week:[['Pzt','Ofis günü'],['Çar','Cam silme'],['Cum','Koltuk yıkama'],['Cmt','Ev temizliği'],['Paz','Acil temizlik']],
 prize:['Ücretsiz temizlik','Cam silme','%10 indirim','Koltuk yıkama','Ütü','Tekrar dene'],clients:['Site Yönetimi','Ofis Plaza','Butik Otel','Kafe Zeytin','Klinik Medika','Emlak Ofisi'],words:['temiz','hızlı','güvenilir','pırıl pırıl'],
 route:['Kozyatağı Metro','Pırıl Temizlik','5 dk'],prod:'Detaylı ev temizliği',loyal:'5. temizlik %50',big:'TEMİZ',weather:'Yağmurlu günlerde cam silme'});
addSector({n:'Berber & Erkek Bakım',p:['#121410','#D4FF3D'],brand:'Usta Berber',slogan:'Klasik usul, modern tarz',handle:'@ustaberber',web:'ustaberber.com',phone:'0 232 000 00 00',area:'Karşıyaka',addr:'Kemalpaşa Cad. No:30',cat:'Berber',
 news:['YENİ HİZMET','Sıcak havlu ile sakal ritüeli','Klasik ustura tıraşı','Randevu al'],disc:['%20','Öğrencilere saç kesiminde indirim','Hafta içi 10:00 – 16:00','Randevu al'],
 star:['Damat Paketi','Saç, sakal, cilt bakımı','₺ 1.500','90 dakika','İkram dahil'],tipsT:'Sakalın için 3 öneri',tips:['Sakal yağı kullanın','Haftada bir şekillendirin','Ilık suyla yıkayın','Tarakla yönlendirin','Ustaya ayda bir uğrayın'],donts:['Sakalı sabunla yıkamak','Evde ustura denemek','Kesimi 2 aydan fazla ertelemek'],
 menuT:'Fiyat listesi',items:[['Saç kesimi','₺350'],['Sakal','₺200'],['Saç + sakal','₺500'],['Cilt bakımı','₺450'],['Çocuk kesimi','₺250'],['Damat paketi','₺1.500']],
 reviews:[['Yıllardır başka berbere gitmiyorum.','Murat K.'],['Damat tıraşım kusursuzdu.','Emre T.'],['Randevuya tam zamanında aldılar.','Can D.']],rakamT:'Rakamlarla Usta',stats:{n:'40.000+',nl:'tıraş',yr:'22',rt:4.9,rv:'1.640',x:'4 usta berber'},
 ev:['Damat Tıraşı Günleri','29','KASIM','Karşıyaka · 10:00','Randevu al'],hook:['Sakalın neden düzgün durmuyor?','Yönü ters taranıyorsa. Ustan göstersin.'],soon:['Bornova şubemiz açılıyor','Bornova · 1 Aralık','YAKINDA'],close:'Yakışıklı günler',
 offT:'İlk randevuna özel',code:'USTA15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Bakım paketleri','Klasik · ₺ 500','Premium · ₺ 900','Damat · ₺ 1.500'],svc:['Hizmetlerimiz','Saç kesimi','Sakal','Cilt bakımı','Damat tıraşı'],
 steps:['Randevu 4 adımda','Ustanı seç','Hizmeti seç','Saati ayır','Gel, otur, rahatla'],draw:['1 yıllık ücretsiz tıraş kazan','Çekiliş 1 Aralık\'ta'],faq:['Randevusuz gelebilir miyim?','Boşluk varsa evet, randevu daha hızlı.','Çocuk kesimi var mı?','Evet, 12 yaş altına özel fiyat.'],
 near:['İskeleye 3 dk','Otopark anlaşmalı'],team:[['Usta Kemal','Kurucu'],['Ali R.','Berber'],['Serkan T.','Sakal uzmanı'],['Burak D.','Cilt bakımı']],quote:'İyi tıraş, adamın günü güzel geçsin diyedir.',
 once:['Saç ve sakal dönüşümü','Aynı adam, yeni tarz'],yeni:['YENİ ÜRÜN','Usta Berber sakal yağı','Sedir ve bergamot','İncele'],hours:['Çalışma saatlerimiz','Hafta içi · 09:00 – 21:00','Cumartesi · 08:00 – 22:00','Pazar · 10:00 – 18:00','Randevuyla geç saat'],
 feats:['Usta berberler','Sıcak havlu','Online randevu','Steril ekipman','İkram','Çocuk dostu'],flasT:'Hafta içi sabah saatlerinde indirim',anket:['Hangisi sana daha çok yakışır?','Sakallı','Sinek kaydı'],
 follow:['Yeni kesimleri gör','Her gün yeni stil','860','52B'],ozel:['Babalar Günü kutlu olsun','BABAM'],teslim:['Randevu kolaylığı','Online randevu 7/24','Kartla ödeme','Beğenmezsen düzeltiriz'],
 randevu:['Ustanı ayırt','22','KASIM','10:00 · 14:30 · 19:00','Randevu al'],myth:['Sık tıraş sakalı sıklaştırır','Sakal sıklığı genetiktir, tıraş etkilemez'],
 hist:[['2004','İlk dükkân'],['2012','Ustura ritüeli'],['2020','Online randevu'],['2026','Bornova şubesi']],week:[['Pzt','Öğrenci günü'],['Çar','Sakal bakımı'],['Cum','Damat provası'],['Cmt','Yoğun gün'],['Paz','Çocuk kesimi']],
 prize:['Ücretsiz tıraş','Sakal yağı','%10 indirim','Cilt bakımı','Tarak seti','Tekrar dene'],clients:['Düğün Salonu','Damat Evi','Spor Kulübü','Ofis Merkezi','Fotoğraf Stüdyosu','Gelinlik Evi'],words:['klasik','keskin','temiz','tarz'],
 route:['Karşıyaka İskelesi','Usta Berber','3 dk yürüme'],prod:'Damat paketi',loyal:'10. tıraş bizden',big:'TARZ',weather:'Kışa sakal bakımı'});

// ===== Yeni meslekler B: elektronik, teknik servis, kırtasiye, oyuncak, optik, kozmetik, spa, kreş =====
addSector({n:'Elektronik & Telefon',p:['#0B0F1F','#38BDF8'],brand:'Volt Elektronik',slogan:'Teknoloji, doğru fiyatla',handle:'@voltelektronik',web:'voltelektronik.com',phone:'0 850 000 00 00',area:'Kadıköy',addr:'Bahariye Cad. No:55',cat:'Elektronik mağazası',
 news:['YENİ GELDİ','Yeni nesil kablosuz kulaklıklar','Aktif gürültü engelleme','Mağazada dene'],disc:['%25','Akıllı saatlerde hafta sonu indirimi','Stoklarla sınırlı','Hemen incele'],
 star:['Kablosuz Kulaklık','40 saat pil, gürültü engelleme','₺ 3.490','2 yıl garanti','Hızlı şarj'],tipsT:'Telefonunun pili için 3 öneri',tips:['Şarjı %20–80 arasında tutun','Orijinal şarj aleti kullanın','Telefonu sıcakta bırakmayın','Gece şarjda unutmayın','Ekran parlaklığını azaltın'],donts:['Telefonu güneşte bırakmak','Taklit şarj aleti kullanmak','Kılıfla aşırı ısıtmak'],
 menuT:'Bu haftanın fiyatları',items:[['Kablosuz kulaklık','₺3.490'],['Akıllı saat','₺5.990'],['Powerbank','₺990'],['Telefon kılıfı','₺390'],['Ekran koruyucu','₺290'],['Bluetooth hoparlör','₺2.190']],
 reviews:[['Fiyatları gerçekten uygun.','Kaan T.'],['Kurulumu mağazada yaptılar.','Elif D.'],['Garanti süreci çok hızlıydı.','Onur S.']],rakamT:'Rakamlarla Volt',stats:{n:'60.000+',nl:'mutlu müşteri',yr:'14',rt:4.8,rv:'2.300',x:'2 yıl garanti'},
 ev:['Teknoloji Günleri','27','KASIM','Kadıköy mağazası · 10:00','Uğra'],hook:['Telefonun neden çabuk ısınıyor?','Arka planda açık uygulamalar. Mağazada ücretsiz kontrol edelim.'],soon:['Yeni mağazamız açılıyor','Ataşehir · 1 Aralık','YAKINDA'],close:'Teknoloji burada',
 offT:'İlk alışverişe',code:'VOLT10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Aksesuar paketleri','Temel · ₺ 690','Koruma · ₺ 1.190','Tam set · ₺ 2.490'],svc:['Hizmetlerimiz','Satış','Kurulum','Veri aktarımı','Takas'],
 steps:['Takas 4 adımda','Eski cihazı getir','Ücretsiz değerleme','Yenisini seç','Farkı öde'],draw:['Kablosuz kulaklık kazan','Çekiliş 1 Aralık\'ta'],faq:['Takas yapıyor musunuz?','Evet, ücretsiz değerleme.','Taksit var mı?','Kredi kartına 9 taksit.'],
 near:['Metroya 4 dk','Otopark anlaşmalı'],team:[['Emre K.','Mağaza müdürü'],['Selin T.','Satış'],['Burak D.','Teknik'],['Naz A.','Müşteri ilişkileri']],quote:'Size gerçekten gereken ürünü öneririz, en pahalısını değil.',
 once:['Eski telefon, yeni hayat','Takas kampanyası'],yeni:['RAFLARDA YENİ','Katlanabilir telefon kılıfı','Darbe korumalı','İncele'],hours:['Mağaza saatleri','Hafta içi · 10:00 – 21:00','Cumartesi · 10:00 – 22:00','Pazar · 11:00 – 20:00','Online sipariş 7/24'],
 feats:['2 yıl garanti','Ücretsiz kurulum','Takas imkânı','9 taksit','Aynı gün teslim','Orijinal ürün'],flasT:'Kulaklık ve saatlerde 48 saatlik fırsat',anket:['Hangisi daha önemli?','Pil ömrü','Kamera'],
 follow:['Yeni ürünleri ilk gör','Her gün yeni inceleme','480','31B'],ozel:['Efsane Cuma başladı','%40'],teslim:['Teslimat','Aynı gün kargo','9 taksit imkânı','14 gün iade'],
 randevu:['Kurulum randevusu al','21','KASIM','11:00 · 15:00 · 18:00','Randevu al'],myth:['Telefonu sıfıra kadar bitirmek pile iyi gelir','Lityum piller kısmi şarjı daha çok sever'],
 hist:[['2012','İlk mağaza'],['2016','Teknik servis'],['2021','Online satış'],['2026','Ataşehir mağazası']],week:[['Pzt','Yeni gelenler'],['Çar','Aksesuar günü'],['Cum','Takas günü'],['Cmt','Canlı demo'],['Paz','Online fırsat']],
 prize:['Kulaklık','Powerbank','%10 indirim','Kılıf','Ekran koruyucu','Tekrar dene'],clients:['Ofis Merkezi','Yazılım AŞ','Okul Bilişim','Kafe Bağlantı','Oyun Kulübü','Ajans Ağı'],words:['hızlı','akıllı','uygun','güvenilir'],
 route:['Kadıköy Metro','Volt Elektronik','4 dk yürüme'],prod:'Kablosuz kulaklık',loyal:'5. alışverişte kılıf hediye',big:'TEKNO',weather:'Soğukta pilinizi koruyun'});
addSector({n:'Teknik Servis & Tamir',p:['#1A1012','#FF7A59'],brand:'Hızlı Tamir',slogan:'Bozulan her şey bir gün düzelir, bizde aynı gün',handle:'@hizlitamir',web:'hizlitamir.com',phone:'0 850 000 00 00',area:'Mecidiyeköy',addr:'Büyükdere Cad. No:70',cat:'Teknik servis',
 news:['YENİ HİZMET','Yerinde bilgisayar tamiri','Ofisinize geliyoruz','Teklif al'],disc:['%20','Ekran değişiminde indirim','Bu ay boyunca','Hemen getir'],
 star:['Ekran Değişimi','Orijinal parça, 1 saatte','₺ 2.900','6 ay garanti','Aynı gün'],tipsT:'Cihazın için 3 öneri',tips:['Yazılımı güncel tutun','Fanı yılda bir temizletin','Yedek almayı unutmayın','Kılıf ve koruyucu kullanın','Sıvıdan uzak tutun'],donts:['Islanınca şarja takmak','Pirince koyup beklemek','Yetkisiz parçayla tamir'],
 menuT:'Tamir fiyatları',items:[['Ekran değişimi','₺2.900'],['Batarya değişimi','₺1.400'],['Şarj soketi','₺900'],['Bilgisayar bakımı','₺1.200'],['Veri kurtarma','₺2.500'],['Sıvı temas','₺1.800']],
 reviews:[['Telefonumu 1 saatte teslim ettiler.','Can Y.'],['Fiyatı önceden net söylediler.','Derya K.'],['Kaybettiğim fotoğrafları kurtardılar.','Murat A.']],rakamT:'Rakamlarla Hızlı Tamir',stats:{n:'35.000+',nl:'tamir edilen cihaz',yr:'10',rt:4.8,rv:'1.870',x:'1 saatte teslim'},
 ev:['Ücretsiz Arıza Tespiti Günü','23','KASIM','Mecidiyeköy · 10:00','Cihazını getir'],hook:['Telefonun ıslandı mı?','Şarja takma, pirince koyma. Hemen getir.'],soon:['Kadıköy şubemiz açılıyor','Kadıköy · 1 Aralık','YAKINDA'],close:'Cihazınız emin ellerde',
 offT:'İlk tamire özel',code:'TAMIR15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Bakım paketleri','Telefon · ₺ 690','Laptop · ₺ 1.200','Ofis · ₺ 4.900'],svc:['Ne tamir ediyoruz?','Telefon','Bilgisayar','Tablet','Konsol'],
 steps:['Tamir 4 adımda','Cihazı getir','Ücretsiz tespit','Onayını al','Aynı gün teslim'],draw:['Ücretsiz batarya değişimi kazan','Çekiliş 1 Aralık\'ta'],faq:['Arıza tespiti ücretli mi?','Hayır, ücretsiz.','Garanti veriyor musunuz?','Tüm işlemlerde 6 ay.'],
 near:['Metrobüse 3 dk','Kuryeyle alım var'],team:[['Okan T.','Kurucu'],['Ali K.','Telefon uzmanı'],['Seda B.','Bilgisayar'],['Kerem D.','Kurye']],quote:'Önce sorunu buluruz, sonra fiyat söyleriz. Sürpriz yok.',
 once:['Kırık ekran, yeni gibi','Ekran değişimi'],yeni:['YENİ HİZMET','Konsol temizliği ve bakımı','Isınma sorununa son','Randevu al'],hours:['Çalışma saatlerimiz','Hafta içi · 09:00 – 20:00','Cumartesi · 10:00 – 18:00','Pazar · Kapalı','Kuryeyle alım 7/24 kayıt'],
 feats:['Ücretsiz arıza tespiti','Orijinal parça','6 ay garanti','Aynı gün teslim','Kuryeyle alım','Veri gizliliği'],flasT:'Batarya değişiminde 3 günlük fırsat',anket:['En çok neyin bozuluyor?','Ekran','Şarj soketi'],
 follow:['Tamir videolarımızı izle','Her gün yeni kurtarma','390','24B'],ozel:['Yeni yılda cihazlarınız sorunsuz olsun','2027'],teslim:['Kurye ve garanti','Kapından alıp getiriyoruz','Kartla ödeme','6 ay garanti'],
 randevu:['Tamir randevusu al','20','KASIM','10:00 · 13:00 · 17:00','Randevu al'],myth:['Islanan telefon pirinçte kurur','Pirinç nemi çekmez, oksitlenme devam eder'],
 hist:[['2016','İlk dükkân'],['2019','Bilgisayar birimi'],['2023','Kurye hizmeti'],['2026','Kadıköy şubesi']],week:[['Pzt','Ekran günü'],['Çar','Batarya indirimi'],['Cum','Laptop bakımı'],['Cmt','Konsol bakımı'],['Paz','Kapalı']],
 prize:['Batarya değişimi','Ekran koruyucu','%10 indirim','Bakım','Kılıf','Tekrar dene'],clients:['Ofis Plaza','Okul Bilişim','Muhasebe Ofisi','Kafe Ağ','Klinik Medika','Ajans Ağı'],words:['hızlı','şeffaf','garantili','uzman'],
 route:['Mecidiyeköy Metrobüs','Hızlı Tamir','3 dk yürüme'],prod:'Ekran değişimi',loyal:'İkinci tamirde %20',big:'TAMİR',weather:'Yağmurda telefonunuzu koruyun'});
addSector({n:'Kırtasiye & Kitapçı',p:['#132036','#FFC857'],brand:'Sayfa Kitabevi',slogan:'Her sayfada yeni bir dünya',handle:'@sayfakitabevi',web:'sayfakitabevi.com',phone:'0 312 000 00 00',area:'Kızılay',addr:'Sakarya Cad. No:18',cat:'Kitabevi',
 news:['YENİ ÇIKTI','Ayın romanı raflarda','İmzalı ilk baskı','Hemen ayırt'],disc:['%30','Okula dönüş setlerinde indirim','Eylül boyunca','Setini seç'],
 star:['Okula Dönüş Seti','Defter, kalem, çanta','₺ 1.290','12 parça','Hediye paketli'],tipsT:'Daha çok okumak için 3 öneri',tips:['Günde 20 sayfa hedefleyin','Yanınızda kitap taşıyın','Telefonu yatağa sokmayın','Okuma kulübüne katılın','Not alarak okuyun'],donts:['Aynı anda 5 kitap','Sadece ekrandan okumak','Bitirme baskısı'],
 menuT:'Bu haftanın fiyatları',items:[['Roman','₺290'],['Defter seti','₺190'],['Kalem seti','₺240'],['Okul çantası','₺890'],['Ajanda 2027','₺350'],['Boyama kitabı','₺150']],
 reviews:[['Çocuğumun tüm listesini tek seferde aldık.','Aylin T.'],['İmza günleri harika.','Kaan B.'],['Kitap önerileri hep isabetli.','Defne Y.']],rakamT:'Rakamlarla Sayfa',stats:{n:'45.000+',nl:'kitap çeşidi',yr:'27',rt:4.9,rv:'1.240',x:'Haftada 2 etkinlik'},
 ev:['Yazar İmza Günü','29','KASIM','Kızılay · 15:00','Katıl'],hook:['Bu yıl kaç kitap okudun?','Okuma kulübümüze katıl, birlikte 24 kitap okuyalım.'],soon:['Kafe köşemiz açılıyor','Kızılay · 1 Aralık','YAKINDA'],close:'İyi okumalar',
 offT:'İlk alışverişe',code:'SAYFA10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Okul paketleri','İlkokul · ₺ 990','Ortaokul · ₺ 1.290','Lise · ₺ 1.590'],svc:['Neler var?','Kitap','Kırtasiye','Fotokopi','Hediyelik'],
 steps:['Okul listesi 4 adımda','Listeyi gönder','Hazırlayalım','Paketleyelim','Kapına gelsin'],draw:['10 kitaplık set kazan','Çekiliş 1 Aralık\'ta'],faq:['Okul listesini hazırlıyor musunuz?','Fotoğrafını gönderin yeter.','Kitap ayırtılır mı?','Evet, 3 gün.'],
 near:['Kızılay Metro\'ya 2 dk','Kafe köşesi'],team:[['Ayşe D.','Kitapçı'],['Emre T.','Kırtasiye'],['Melis K.','Çocuk kitapları'],['Ozan B.','Etkinlik']],quote:'Doğru kitap, doğru zamanda hayat değiştirir.',
 once:['Rafa yeni bölüm','Çocuk kitapları köşesi'],yeni:['RAFLARDA YENİ','2027 ajandaları','Kişiye özel isim baskısı','İncele'],hours:['Açık olduğumuz saatler','Hafta içi · 09:00 – 21:00','Cumartesi · 10:00 – 21:00','Pazar · 11:00 – 20:00','Online sipariş 7/24'],
 feats:['Geniş kitap seçkisi','Okul listesi hazırlama','İmza günleri','Hediye paketi','Kitap ayırtma','Okuma kulübü'],flasT:'Tüm romanlarda hafta sonu fırsatı',anket:['Hangisini seçerdin?','Basılı kitap','E-kitap'],
 follow:['Kitap önerileri için takip et','Her gün bir öneri','720','28B'],ozel:['Öğretmenler Günü kutlu olsun','24 KASIM'],teslim:['Teslimat','Aynı gün kargo','Kapıda ödeme','14 gün iade'],
 randevu:['Okul listeni ayırt','2','EYLÜL','10:00 · 14:00 · 18:00','Listeni gönder'],myth:['Hızlı okumak anlamayı azaltır','Pratikle hız ve anlama birlikte artar'],
 hist:[['1999','İlk kitabevi'],['2008','Kırtasiye bölümü'],['2018','Okuma kulübü'],['2026','Kafe köşesi']],week:[['Pzt','Yeni çıkanlar'],['Çar','Çocuk saati'],['Cum','Okuma kulübü'],['Cmt','İmza günü'],['Paz','Masal saati']],
 prize:['Kitap seti','Ajanda','%10 indirim','Kalem seti','Ayraç','Tekrar dene'],clients:['Kent Lisesi','Kitap Kulübü','Yazar Derneği','Kafe Sayfa','Kreş Papatya','Üniversite Kulübü'],words:['merak','hayal','bilgi','keşif'],
 route:['Kızılay Metro','Sayfa Kitabevi','2 dk yürüme'],prod:'Ayın romanı',loyal:'10. kitap bizden',big:'KİTAP',weather:'Yağmurlu günlere iyi bir roman'});
addSector({n:'Oyuncak & Bebek',p:['#17122A','#FF9F1C'],brand:'Minik Dünya',slogan:'Oyun, büyümenin en güzel hali',handle:'@minikdunya',web:'minikdunya.com',phone:'0 216 000 00 00',area:'Bostancı',addr:'Bağdat Cad. No:300',cat:'Oyuncakçı',
 news:['YENİ GELDİ','Ahşap eğitici oyuncaklar','Doğal boya, güvenli','Mağazaya gel'],disc:['%30','Bebek arabalarında indirim','Stoklarla sınırlı','Hemen incele'],
 star:['Ahşap Yapboz Seti','3 yaş üstü, 6 parça','₺ 590','Doğal boya','Eğitici'],tipsT:'Oyuncak seçerken 3 öneri',tips:['Yaş etiketine bakın','Küçük parçaya dikkat edin','Açık uçlu oyuncak seçin','Az ama nitelikli alın','Birlikte oynayın'],donts:['Yaşa uygun olmayan oyuncak','Sertifikasız ürün','Her gün yeni oyuncak'],
 menuT:'Öne çıkanlar',items:[['Ahşap yapboz','₺590'],['Bebek arabası','₺12.900'],['Peluş ayı','₺450'],['Lego seti','₺1.890'],['Oto koltuğu','₺6.900'],['Oyun halısı','₺990']],
 reviews:[['Kızım yapbozdan kalkmıyor.','Elif A.'],['Bebek arabasını kurup teslim ettiler.','Can & Merve'],['Doğum günü hediyesi bulmak çok kolay.','Selin T.']],rakamT:'Rakamlarla Minik Dünya',stats:{n:'20.000+',nl:'mutlu çocuk',yr:'15',rt:4.9,rv:'980',x:'Sertifikalı ürünler'},
 ev:['Çocuk Oyun Atölyesi','30','KASIM','Bostancı · 14:00','Kayıt ol'],hook:['Çocuğun oyuncaklardan çabuk mu sıkılıyor?','Açık uçlu oyuncaklar daha uzun oynatır.'],soon:['Yeni mağazamız açılıyor','Ataşehir · 1 Aralık','YAKINDA'],close:'Mutlu oyunlar',
 offT:'İlk alışverişe',code:'MINIK10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Hediye kutuları','Bebek · ₺ 990','Okul öncesi · ₺ 1.290','Doğum günü · ₺ 1.590'],svc:['Neler var?','Oyuncak','Bebek ürünleri','Hediye paketi','Doğum listesi'],
 steps:['Doğum listesi 4 adımda','Listeyi oluştur','Paylaş','Hediyeler gelsin','Teslim al'],draw:['Bebek arabası kazan','Çekiliş 1 Aralık\'ta'],faq:['Hediye paketi ücretli mi?','Hayır, ücretsiz.','Değişim süresi ne kadar?','30 gün.'],
 near:['Bostancı Marmaray 5 dk','Otopark var'],team:[['Ayla K.','Kurucu'],['Burak T.','Bebek ürünleri'],['Ece D.','Oyun uzmanı'],['Mert A.','Satış']],quote:'Oyuncak çocuğun ilk öğretmenidir.',
 once:['Oyun köşesi yenilendi','Çocuklar için deneme alanı'],yeni:['RAFLARDA YENİ','Duyusal oyun seti','6 ay üstü','İncele'],hours:['Mağaza saatleri','Hafta içi · 10:00 – 21:00','Cumartesi · 10:00 – 22:00','Pazar · 11:00 – 20:00','Online sipariş 7/24'],
 feats:['Sertifikalı ürün','Ücretsiz hediye paketi','30 gün değişim','Doğum listesi','Oyun alanı','Kurulum desteği'],flasT:'Peluş ve yapbozlarda hafta sonu fırsatı',anket:['Hangisi daha eğlenceli?','Lego','Yapboz'],
 follow:['Oyun fikirleri için takip et','Her hafta yeni oyun','520','33B'],ozel:['23 Nisan kutlu olsun','23 NİSAN'],teslim:['Teslimat','Aynı gün kargo','Kapıda ödeme','30 gün değişim'],
 randevu:['Doğum listeni oluştur','25','KASIM','11:00 · 14:00 · 17:00','Randevu al'],myth:['Pahalı oyuncak daha eğiticidir','Basit ve açık uçlu oyuncaklar hayal gücünü daha çok geliştirir'],
 hist:[['2011','İlk mağaza'],['2015','Bebek bölümü'],['2021','Online satış'],['2026','Ataşehir mağazası']],week:[['Pzt','Yeni gelenler'],['Çar','Masal saati'],['Cum','Peluş indirimi'],['Cmt','Oyun atölyesi'],['Paz','Aile günü']],
 prize:['Peluş ayı','Yapboz','%10 indirim','Boyama seti','Balon','Tekrar dene'],clients:['Kreş Papatya','Anaokulu Güneş','Çocuk Kafe','Doğum Kliniği','Parti Evi','Masal Kulübü'],words:['oyun','merak','neşe','keşif'],
 route:['Bostancı Marmaray','Minik Dünya','5 dk'],prod:'Ahşap yapboz seti',loyal:'5. alışverişte peluş hediye',big:'OYUN',weather:'Yağmurlu günlere ev oyunları'});
addSector({n:'Optik',p:['#0F1B3D','#FFC857'],brand:'Net Optik',slogan:'Dünyaya net bakın',handle:'@netoptik',web:'netoptik.com',phone:'0 232 000 00 00',area:'Konak',addr:'Kemeraltı Cad. No:21',cat:'Optik',
 news:['YENİ KOLEKSİYON','2027 güneş gözlüğü koleksiyonu','Polarize camlar','Mağazada dene'],disc:['%30','Çerçevelerde sezon indirimi','Stoklarla sınırlı','Hemen dene'],
 star:['Mavi Işık Filtreli Cam','Ekran başında çalışanlara','₺ 1.890','Çizilmez kaplama','2 yıl garanti'],tipsT:'Gözlüğün için 3 öneri',tips:['Mikrofiber bezle silin','Kutusunda saklayın','İki elle takıp çıkarın','Yılda bir ayar yaptırın','Sıcak arabada bırakmayın'],donts:['Tişörtle silmek','Kafaya takmak','Camı aşağı koymak'],
 menuT:'Fiyatlar',items:[['Çerçeve + cam','₺2.900'],['Güneş gözlüğü','₺3.490'],['Mavi ışık camı','₺1.890'],['Lens (aylık)','₺690'],['Çocuk gözlüğü','₺1.490'],['Gözlük ayarı','Ücretsiz']],
 reviews:[['Yüzüme en uygun çerçeveyi buldular.','Gizem A.'],['Gözlüğüm 1 günde hazırdı.','Okan T.'],['Ayarı ücretsiz yaptılar.','Fatma K.']],rakamT:'Rakamlarla Net Optik',stats:{n:'22.000+',nl:'mutlu müşteri',yr:'19',rt:4.8,rv:'860',x:'1 günde hazır'},
 ev:['Güneş Gözlüğü Günleri','14','MAYIS','Konak mağazası · 10:00','Uğra'],hook:['Gözlüğün sürekli kayıyor mu?','Ücretsiz ayarla 5 dakikada düzelir.'],soon:['Bornova mağazamız açılıyor','Bornova · 1 Aralık','YAKINDA'],close:'Net günler',
 offT:'İkinci gözlüğe',code:'NET50',off:'%50',validity:'Ay sonuna kadar geçerli',pk:['Gözlük paketleri','Temel · ₺ 2.490','Mavi ışık · ₺ 3.490','Premium · ₺ 5.900'],svc:['Hizmetlerimiz','Çerçeve','Cam','Lens','Ücretsiz ayar'],
 steps:['Gözlük 4 adımda','Reçeteni getir','Çerçeveni seç','Camını seç','Ertesi gün teslim'],draw:['Güneş gözlüğü kazan','Çekiliş 1 Aralık\'ta'],faq:['Reçete gerekli mi?','Numaralı gözlük için evet.','Ayar ücretli mi?','Ömür boyu ücretsiz.'],
 near:['Konak Metro\'ya 3 dk','Kemeraltı girişi'],team:[['Can Y.','Optisyen'],['Elif D.','Çerçeve danışmanı'],['Murat K.','Cam atölyesi'],['Seda A.','Lens']],quote:'Doğru gözlük, yüzünüze ve hayatınıza uyandır.',
 once:['Yüzüne uygun çerçeve','Ücretsiz stil danışmanlığı'],yeni:['VİTRİNDE YENİ','Titanyum hafif çerçeve','Sadece 9 gram','Dene'],hours:['Mağaza saatleri','Hafta içi · 09:30 – 19:30','Cumartesi · 10:00 – 19:00','Pazar · Kapalı','Randevuyla lens denemesi'],
 feats:['1 günde hazır','Ömür boyu ayar','Çizilmez kaplama','2 yıl garanti','Stil danışmanlığı','Lens deneme'],flasT:'Güneş gözlüklerinde hafta sonu fırsatı',anket:['Hangisi daha şık?','Yuvarlak çerçeve','Köşeli çerçeve'],
 follow:['Yeni çerçeveleri gör','Her hafta yeni model','260','12B'],ozel:['Yaz geldi, gözlerini koru','YAZ'],teslim:['Güvence','Ertesi gün teslim','Kartla 6 taksit','Ömür boyu ayar'],
 randevu:['Lens denemesi ayırt','22','KASIM','10:00 · 13:00 · 16:00','Randevu al'],myth:['Gözlük kullanmak gözü tembelleştirir','Doğru numaralı gözlük gözü yormaz, rahatlatır'],
 hist:[['2007','İlk mağaza'],['2013','Cam atölyesi'],['2020','Lens bölümü'],['2026','Bornova mağazası']],week:[['Pzt','Yeni çerçeveler'],['Çar','Lens günü'],['Cum','Güneş gözlüğü'],['Cmt','Çocuk gözlüğü'],['Paz','Kapalı']],
 prize:['Güneş gözlüğü','Temizlik seti','%10 indirim','Gözlük kılıfı','Lens solüsyonu','Tekrar dene'],clients:['Ofis Merkezi','Okul Kent','Sürücü Kursu','Spor Kulübü','Kafe Ekran','Yazılım AŞ'],words:['net','şık','hafif','rahat'],
 route:['Konak Metro','Net Optik','3 dk yürüme'],prod:'Mavi ışık filtreli cam',loyal:'İkinci gözlük %50',big:'NET',weather:'Güneşli günlere polarize cam'});
addSector({n:'Kozmetik & Parfümeri',p:['#2A0E14','#F6C1C7'],brand:'Nar Kozmetik',slogan:'Kendine iyi bak',handle:'@narkozmetik',web:'narkozmetik.com',phone:'0 212 000 00 00',area:'Şişli',addr:'Rumeli Cad. No:44',cat:'Kozmetik mağazası',
 news:['YENİ GELDİ','Vegan cilt bakım serisi','Hassas ciltlere uygun','Mağazada dene'],disc:['%30','Parfümlerde hafta sonu indirimi','Stoklarla sınırlı','Hemen incele'],
 star:['Nemlendirici Krem','Hyaluronik asitli, 50 ml','₺ 690','Vegan','Parfümsüz'],tipsT:'Cilt bakımında 3 adım',tips:['Temizleyin','Nemlendirin','Güneş kremi sürün','Haftada bir maske','Makyajla uyumayın'],donts:['Makyajla uyumak','Güneş kremini atlamak','Her gün peeling'],
 menuT:'Öne çıkanlar',items:[['Nemlendirici','₺690'],['Güneş kremi','₺590'],['Parfüm 50 ml','₺2.490'],['Ruj','₺390'],['Serum','₺890'],['Bakım seti','₺1.490']],
 reviews:[['Cildime uygun ürünü sabırla buldular.','Ece T.'],['Parfüm numunesi vermeleri harika.','Damla K.'],['Fiyatlar internetten bile iyi.','Nil A.']],rakamT:'Rakamlarla Nar',stats:{n:'3.500+',nl:'ürün çeşidi',yr:'8',rt:4.8,rv:'1.090',x:'Ücretsiz cilt analizi'},
 ev:['Ücretsiz Cilt Analizi Günü','29','KASIM','Şişli mağazası · 11:00','Randevu al'],hook:['Cildin neden kuruyor?','Kışın nem bariyeri zayıflar. Rutinini değiştir.'],soon:['Kadıköy mağazamız açılıyor','Kadıköy · 1 Aralık','YAKINDA'],close:'Kendine iyi bak',
 offT:'İlk alışverişe',code:'NAR15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Bakım setleri','Temel · ₺ 990','Kış bakımı · ₺ 1.490','Lüks · ₺ 2.990'],svc:['Neler var?','Cilt bakımı','Parfüm','Makyaj','Hediye seti'],
 steps:['Cilt rutini 4 adımda','Cilt tipini öğren','Ürünleri seç','Deneme boyu al','Rutinini kur'],draw:['Bakım seti kazan','Çekiliş 1 Aralık\'ta'],faq:['Numune veriyor musunuz?','Parfüm ve kremde evet.','Ürünler orijinal mi?','Hepsi faturalı ve orijinal.'],
 near:['Osmanbey Metro\'ya 3 dk','Otopark anlaşmalı'],team:[['Nur K.','Kurucu'],['Ece T.','Cilt danışmanı'],['Selin D.','Parfüm uzmanı'],['Aslı B.','Makyaj']],quote:'Pahalı ürün değil, doğru ürün güzelleştirir.',
 once:['Rutin değişti, cilt değişti','Kişiye özel bakım'],yeni:['RAFLARDA YENİ','C vitaminli serum','Aydınlık görünüm','Dene'],hours:['Mağaza saatleri','Hafta içi · 10:00 – 21:00','Cumartesi · 10:00 – 22:00','Pazar · 11:00 – 20:00','Online sipariş 7/24'],
 feats:['Orijinal ürün','Ücretsiz cilt analizi','Numune','Hediye paketi','Vegan seçenek','14 gün iade'],flasT:'Parfümlerde 48 saatlik fırsat',anket:['Hangisi senin?','Çiçeksi koku','Odunsu koku'],
 follow:['Bakım ipuçları için takip et','Her gün yeni rutin','640','47B'],ozel:['Kadınlar Günü kutlu olsun','8 MART'],teslim:['Teslimat','Aynı gün kargo','Kapıda ödeme','Açılmamış ürüne iade'],
 randevu:['Cilt analizi ayırt','29','KASIM','11:00 · 14:00 · 17:00','Randevu al'],myth:['Yağlı cilt nemlendirici istemez','Yağlı cilt de neme ihtiyaç duyar, hafif formül yeterli'],
 hist:[['2018','İlk mağaza'],['2020','Online satış'],['2023','Vegan seri'],['2026','Kadıköy mağazası']],week:[['Pzt','Yeni gelenler'],['Çar','Cilt analizi'],['Cum','Parfüm indirimi'],['Cmt','Makyaj atölyesi'],['Paz','Online fırsat']],
 prize:['Bakım seti','Parfüm','%10 indirim','Ruj','Numune seti','Tekrar dene'],clients:['Güzellik Salonu','Gelin Evi','Spa Merkezi','Fotoğraf Stüdyosu','Butik Otel','Moda Butik'],words:['ışıltı','bakım','zarafet','özgüven'],
 route:['Osmanbey Metro','Nar Kozmetik','3 dk yürüme'],prod:'Nemlendirici krem',loyal:'5. alışverişte ruj hediye',big:'BAKIM',weather:'Soğukta cildine nem'});
addSector({n:'Spa & Masaj',p:['#0F1F17','#B7E4C7'],brand:'Sükûn Spa',slogan:'Bir saatlik huzur',handle:'@sukunspa',web:'sukunspa.com',phone:'0 252 000 00 00',area:'Bodrum',addr:'Yalıkavak Marina',cat:'Spa',
 news:['YENİ RİTÜEL','Sıcak taş masajı','90 dakikalık derin rahatlama','Randevu al'],disc:['%25','Çift masajında indirim','Hafta içi','Randevu al'],
 star:['Aromaterapi Masajı','60 dakika, doğal yağlarla','₺ 2.400','Bitki çayı ikramı','Sauna dahil'],tipsT:'Masaj sonrası 3 öneri',tips:['Bol su için','Sıcak duşu erteleyin','Hafif yemek yiyin','Kısa bir yürüyüş yapın','Dinlenmeye vakit ayırın'],donts:['Hemen ağır spor','Ağır yemek','Alkol'],
 menuT:'Ritüel fiyatları',items:[['Aromaterapi','₺2.400'],['Sıcak taş','₺3.200'],['Hamam & kese','₺1.800'],['Çift masajı','₺4.400'],['Yüz bakımı','₺1.900'],['Ayak masajı','₺1.200']],
 reviews:[['Kendimi yeniden doğmuş gibi hissettim.','Deniz A.'],['Çift masajı yıldönümümüze çok yakıştı.','Ece & Kaan'],['Ortam çok huzurlu.','Gül T.']],rakamT:'Rakamlarla Sükûn',stats:{n:'14.000+',nl:'mutlu misafir',yr:'9',rt:4.9,rv:'1.010',x:'12 ritüel'},
 ev:['Hamam Günü','20','KASIM','Yalıkavak · 11:00','Randevu al'],hook:['En son ne zaman kendine 1 saat ayırdın?','Bugün tam zamanı.'],soon:['Türkbükü şubemiz açılıyor','Türkbükü · 1 Mayıs','YAKINDA'],close:'Huzurla kalın',
 offT:'İlk ritüele',code:'SUKUN15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Ritüel paketleri','Rahatla · ₺ 2.400','Yenilen · ₺ 3.900','Çift · ₺ 5.900'],svc:['Ritüellerimiz','Masaj','Hamam','Yüz bakımı','Sauna'],
 steps:['Spa günü 4 adımda','Ritüelini seç','Saatini ayır','Bitki çayıyla başla','Huzurla çık'],draw:['Çift masajı kazan','Çekiliş 14 Şubat\'ta'],faq:['Çift masajı var mı?','Evet, özel odada.','Hediye çeki var mı?','Tüm ritüeller için.'],
 near:['Marinaya 2 dk','Vale hizmeti'],team:[['Ayşe K.','Spa müdürü'],['Lina T.','Masaj terapisti'],['Mehmet D.','Hamam ustası'],['Seda B.','Cilt bakımı']],quote:'Burada saat yok, sadece siz varsınız.',
 once:['Yorgun gelin, hafif çıkın','90 dakikalık ritüel'],yeni:['YENİ RİTÜEL','Bambu masajı','Derin kas rahatlaması','Dene'],hours:['Açık olduğumuz saatler','Hafta içi · 10:00 – 22:00','Cumartesi · 09:00 – 23:00','Pazar · 09:00 – 22:00','Otel misafirlerine öncelik'],
 feats:['Uzman terapistler','Doğal yağlar','Özel çift odası','Sauna dahil','Hediye çeki','Vale hizmeti'],flasT:'Hafta içi gündüz ritüellerinde fırsat',anket:['Hangisi seni dinlendirir?','Masaj','Hamam'],
 follow:['Huzur için takip et','Her hafta yeni ritüel','290','19B'],ozel:['Sevgililer Günü kutlu olsun','14 ŞUBAT'],teslim:['Rezervasyon','Online randevu 7/24','Kartla ödeme','24 saat öncesine kadar ücretsiz iptal'],
 randevu:['Ritüelini ayırt','22','KASIM','11:00 · 15:00 · 19:00','Randevu al'],myth:['Masaj sadece lüks bir keyiftir','Düzenli masaj stresi azaltıp dinlenmeye yardımcı olur'],
 hist:[['2017','Spa açıldı'],['2019','Hamam bölümü'],['2023','Çift suiti'],['2026','Türkbükü']],week:[['Pzt','Aromaterapi'],['Çar','Hamam günü'],['Cum','Çift masajı'],['Cmt','Spa günü'],['Paz','Yüz bakımı']],
 prize:['Masaj','Hamam','%10 indirim','Yüz bakımı','Bitki çayı seti','Tekrar dene'],clients:['Butik Otel','Yoga Kampı','Düğün Planlayıcı','Yat Kulübü','Kurumsal Kamp','Gelin Evi'],words:['huzur','denge','rahatlık','yenilenme'],
 route:['Yalıkavak Marina','Sükûn Spa','2 dk yürüme'],prod:'Aromaterapi masajı',loyal:'5. ritüel bizden',big:'HUZUR',weather:'Soğuk günlere sıcak taş'});
addSector({n:'Kreş & Anaokulu',p:['#0C2A3A','#FFD166'],brand:'Papatya Anaokulu',slogan:'Oyunla öğrenen mutlu çocuklar',handle:'@papatyaanaokulu',web:'papatyaanaokulu.com',phone:'0 312 000 00 00',area:'Çayyolu',addr:'Ümitköy Cad. No:9',cat:'Anaokulu',
 news:['KAYITLAR BAŞLADI','2027 dönemi kayıtları açık','Sınırlı kontenjan','Ziyaret ayırt'],disc:['%15','Kardeş kaydında indirim','2027 dönemi için','Bilgi al'],
 star:['Tam Gün Program','08:00 – 17:30, 3 öğün','₺ 18.500 / ay','İngilizce','Bahçe oyunları'],tipsT:'Uyum haftası için 3 öneri',tips:['Vedalaşmayı kısa tutun','Sevdiği oyuncağı getirin','Her gün aynı saatte gelin','Öğretmenle konuşun','Sabırlı olun'],donts:['Gizlice gitmek','Uzun vedalaşma','İlk haftayı uzatmak'],
 menuT:'Programlar',items:[['Tam gün','₺18.500'],['Yarım gün','₺11.900'],['Yaz okulu','₺9.900'],['İngilizce','Dahil'],['Servis','₺3.500'],['Hafta sonu atölyesi','₺1.500']],
 reviews:[['Kızım okula koşarak gidiyor.','Zeynep A.'],['Öğretmenler çok ilgili.','Murat K.'],['Bahçesi harika.','Ayşe T.']],rakamT:'Rakamlarla Papatya',stats:{n:'1.200+',nl:'mezun',yr:'13',rt:4.9,rv:'340',x:'Sınıf başına 12 çocuk'},
 ev:['Açık Kapı Günü','7','ARALIK','Çayyolu kampüsü · 10:00','Ziyaret ayırt'],hook:['Çocuğun okula hazır mı?','Ücretsiz deneme gününe gel, birlikte görelim.'],soon:['Yeni sınıflarımız açılıyor','Çayyolu · Eylül 2027','YAKINDA'],close:'Mutlu çocuklar, mutlu aileler',
 offT:'Erken kayıtta',code:'PAPATYA10',off:'%10',validity:'Ocak sonuna kadar geçerli',pk:['Programlar','Yarım gün · ₺ 11.900','Tam gün · ₺ 18.500','Tam gün + servis · ₺ 21.900'],svc:['Neler öğreniyoruz?','İngilizce','Sanat','Müzik','Doğa'],
 steps:['Kayıt 4 adımda','Okulu gez','Deneme günü','Formu doldur','Uyum haftası'],draw:['1 aylık ücretsiz eğitim kazan','Çekiliş 1 Aralık\'ta'],faq:['Sınıflar kaç kişilik?','En fazla 12 çocuk.','Yemekler nerede hazırlanıyor?','Kendi mutfağımızda.'],
 near:['Ana caddeye 1 dk','Servis tüm Çayyolu'],team:[['Ayşe D.','Okul müdürü'],['Elif T.','Okul öncesi öğretmeni'],['Sarah M.','İngilizce'],['Can K.','Müzik']],quote:'Her çocuk kendi hızında çiçek açar.',
 once:['Bahçemiz yenilendi','Yeni oyun parkı'],yeni:['YENİ ATÖLYE','Bilim atölyesi','4–6 yaş için','Kayıt ol'],hours:['Okul saatleri','Hafta içi · 07:30 – 18:00','Cumartesi · Atölye 10:00','Pazar · Kapalı','Uzatılmış saat seçeneği'],
 feats:['12 kişilik sınıf','İngilizce','Kendi mutfağı','Bahçe','Kamera ile izleme','Servis'],flasT:'Erken kayıtta son hafta',anket:['Çocuğun en çok neyi sever?','Boyama','Müzik'],
 follow:['Okulumuzdan kareler','Her gün yeni etkinlik','410','6.800'],ozel:['23 Nisan kutlu olsun','23 NİSAN'],teslim:['Kayıt kolaylığı','Online ön kayıt','Taksitli ödeme','Deneme günü ücretsiz'],
 randevu:['Okul ziyareti ayırt','7','ARALIK','10:00 · 13:00 · 15:30','Ziyaret ayırt'],myth:['Okul öncesi sadece oyundur','Oyun, çocuğun dil ve sosyal becerisini geliştirir'],
 hist:[['2013','Okul açıldı'],['2017','İngilizce programı'],['2022','Yeni bahçe'],['2026','Bilim atölyesi']],week:[['Pzt','Sanat'],['Sal','İngilizce'],['Çar','Müzik'],['Per','Doğa'],['Cum','Bilim']],
 prize:['1 ay eğitim','Atölye','%5 indirim','Kitap seti','Boyama seti','Tekrar dene'],clients:['Çocuk Kütüphanesi','Bilim Merkezi','Müzik Okulu','Spor Kulübü','Masal Evi','Doğa Kampı'],words:['oyun','merak','sevgi','keşif'],
 route:['Çayyolu Metro','Papatya Anaokulu','6 dk'],prod:'Tam gün program',loyal:'Kardeşe %15',big:'OYUN',weather:'Yağmurlu günlere iç mekân oyunları'});

// ===== Yeni meslekler C: sürücü kursu, müzik/sanat, dans, fotoğraf, nakliyat, halı yıkama, terzi, usta hizmetleri, peyzaj =====
addSector({n:'Sürücü Kursu',p:['#101114','#FFD60A'],brand:'Direksiyon Sürücü Kursu',slogan:'Güvenle direksiyona',handle:'@direksiyonkurs',web:'direksiyonkurs.com',phone:'0 312 000 00 00',area:'Keçiören',addr:'Kızlarpınarı Cad. No:30',cat:'Sürücü kursu',
 news:['KAYITLAR AÇIK','B sınıfı ehliyet kursu','Teori ve direksiyon bir arada','Kayıt ol'],disc:['%15','Öğrencilere kurs indirimi','Bu dönem için','Kayıt ol'],
 star:['B Sınıfı Ehliyet','Teori + 16 saat direksiyon','₺ 22.900','Otomatik araç','Taksit'],tipsT:'Direksiyon sınavı için 3 öneri',tips:['Aynaları her zaman kontrol edin','Sinyal vermeyi unutmayın','Sakin kalın','Park alıştırması yapın','Sınavdan önce iyi uyuyun'],donts:['Aynasız şerit değiştirmek','Sinyalsiz dönmek','Panik freni'],
 menuT:'Kurs ücretleri',items:[['B sınıfı','₺22.900'],['A2 motosiklet','₺14.900'],['Ek direksiyon dersi','₺1.200'],['Otomatik araç','₺24.900'],['Sınav harcı','Ayrı'],['Online teori','Dahil']],
 reviews:[['İlk sınavda geçtim!','Burak T.'],['Hocalar çok sabırlı.','Elif K.'],['Otomatik araçla öğrenmek çok kolaydı.','Ayşe D.']],rakamT:'Rakamlarla Direksiyon',stats:{n:'12.000+',nl:'ehliyet sahibi',yr:'21',rt:4.8,rv:'760',x:'%86 ilk seferde başarı'},
 ev:['Ücretsiz Deneme Dersi','30','KASIM','Keçiören · 10:00','Kayıt ol'],hook:['Paralel park korkutuyor mu?','3 derste korkun biter. Deneme dersine gel.'],soon:['Yeni şubemiz açılıyor','Etimesgut · 1 Aralık','YAKINDA'],close:'Yolunuz açık olsun',
 offT:'Arkadaşınla gelirsen',code:'DIREKSIYON10',off:'%10',validity:'Dönem sonuna kadar geçerli',pk:['Kurs paketleri','Standart · ₺ 22.900','Otomatik · ₺ 24.900','Hızlı · ₺ 27.900'],svc:['Kurslarımız','B sınıfı','A2 motosiklet','Ek ders','Online teori'],
 steps:['Ehliyet 4 adımda','Kayıt ol','Teori dersleri','Direksiyon dersleri','Sınav ve ehliyet'],draw:['Kurs ücreti iadesi kazan','Çekiliş 1 Aralık\'ta'],faq:['Kurs kaç hafta sürüyor?','Ortalama 6 hafta.','Taksit var mı?','Kredi kartına 9 taksit.'],
 near:['Metroya 5 dk','Ücretsiz servis'],team:[['Hakan Hoca','Direksiyon eğitmeni'],['Selin Hoca','Teori'],['Murat Hoca','Motosiklet'],['Ayten K.','Kayıt']],quote:'Ehliyet değil, güvenli sürücülük öğretiyoruz.',
 once:['Korkuyla başladı, ehliyetle bitti','Öğrencimizin yolculuğu'],yeni:['YENİ','Otomatik vitesli araç filosu','Daha kolay öğrenme','Bilgi al'],hours:['Kurs saatleri','Hafta içi · 08:00 – 21:00','Cumartesi · 08:00 – 18:00','Pazar · 09:00 – 16:00','Akşam dersleri mevcut'],
 feats:['%86 ilk seferde başarı','Otomatik araç','Akşam dersleri','Online teori','9 taksit','Ücretsiz servis'],flasT:'Bu haftaki kayıtlara ek ders hediye',anket:['Hangisi daha zor?','Paralel park','Rampa kalkışı'],
 follow:['Sınav ipuçları için takip et','Her hafta yeni ipucu','180','8.900'],ozel:['Yeni ehliyetiniz hayırlı olsun','TEBRİKLER'],teslim:['Kayıt kolaylığı','Online ön kayıt','9 taksit imkânı','Deneme dersi ücretsiz'],
 randevu:['Deneme dersi ayırt','30','KASIM','10:00 · 13:00 · 16:00','Randevu al'],myth:['Otomatik araçla öğrenen manuel kullanamaz','Kısa bir ek dersle manuel araca kolayca geçilir'],
 hist:[['2005','Kurs açıldı'],['2012','Motosiklet sınıfı'],['2020','Online teori'],['2026','Otomatik filo']],week:[['Pzt','Teori'],['Sal','Direksiyon'],['Çar','Park eğitimi'],['Per','Trafik'],['Cmt','Deneme sınavı']],
 prize:['Ek ders','Kurs indirimi','%5 indirim','Araç kokusu','Anahtarlık','Tekrar dene'],clients:['Kent Lisesi','Üniversite','Kargo Şirketi','Belediye','Lojistik AŞ','Taksi Durağı'],words:['güven','dikkat','özgüven','özgürlük'],
 route:['Keçiören Metro','Direksiyon Kursu','5 dk'],prod:'B sınıfı ehliyet',loyal:'Arkadaşını getir %10',big:'YOL',weather:'Kış sürüşü eğitimi'});
addSector({n:'Müzik & Sanat Kursu',p:['#17122A','#B794F4'],brand:'Nota Sanat',slogan:'İçindeki sanatçıyı keşfet',handle:'@notasanat',web:'notasanat.com',phone:'0 216 000 00 00',area:'Moda',addr:'Moda Cad. No:60',cat:'Müzik kursu',
 news:['YENİ DÖNEM','Piyano ve gitar kayıtları açık','Her yaşa birebir ders','Deneme dersi al'],disc:['%20','Kardeş kaydında indirim','Bu dönem için','Kayıt ol'],
 star:['Piyano Dersi','Birebir, haftada 1 saat','₺ 3.200 / ay','Her yaş','Konser fırsatı'],tipsT:'Enstrümana başlarken 3 öneri',tips:['Her gün 15 dakika çalışın','Sevdiğiniz şarkıyla başlayın','Metronom kullanın','Kendinizi kaydedin','Sabırlı olun'],donts:['Haftada bir uzun çalışmak','Ritmi önemsememek','Isınmadan çalmak'],
 menuT:'Ders ücretleri',items:[['Piyano','₺3.200'],['Gitar','₺2.800'],['Şan','₺3.000'],['Resim','₺2.400'],['Keman','₺3.200'],['Bateri','₺3.000']],
 reviews:[['Oğlum ilk konserini verdi.','Ayşe K.'],['40 yaşında gitara başladım, iyi ki.','Murat T.'],['Hocalar çok ilham verici.','Defne A.']],rakamT:'Rakamlarla Nota',stats:{n:'2.800+',nl:'öğrenci',yr:'11',rt:4.9,rv:'420',x:'Yılda 4 konser'},
 ev:['Öğrenci Konseri','20','ARALIK','Moda Sahnesi · 19:00','Ücretsiz gel'],hook:['Hep gitar çalmak isteyip başlayamadın mı?','İlk ders ücretsiz. Bahane bitti.'],soon:['Resim atölyemiz açılıyor','Moda · 1 Aralık','YAKINDA'],close:'Sanatla kalın',
 offT:'İlk aya özel',code:'NOTA15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Ders paketleri','4 ders · ₺ 3.200','8 ders · ₺ 5.900','Grup · ₺ 1.900'],svc:['Derslerimiz','Piyano','Gitar','Şan','Resim'],
 steps:['Kayıt 4 adımda','Enstrümanını seç','Deneme dersi','Programı belirle','İlk konser'],draw:['1 aylık ücretsiz ders kazan','Çekiliş 1 Aralık\'ta'],faq:['Enstrümanım yok, sorun mu?','Kursta çalışabilirsin.','Kaç yaşından başlanır?','5 yaştan itibaren.'],
 near:['Moda iskelesine 5 dk','Çalışma odaları açık'],team:[['Selin K.','Piyano'],['Emre D.','Gitar'],['Duru A.','Şan'],['Kaan T.','Resim']],quote:'Yetenek başlangıçtır, gerisi keyifli bir alışkanlık.',
 once:['İlk dersten ilk konsere','Öğrencimizin 6 ayı'],yeni:['YENİ DERS','Ukulele','Çocuklar için harika','Deneme al'],hours:['Kurs saatleri','Hafta içi · 10:00 – 21:00','Cumartesi · 10:00 – 19:00','Pazar · 11:00 – 17:00','Çalışma odası rezervasyonu'],
 feats:['Birebir ders','Her yaşa uygun','Konser fırsatı','Çalışma odası','Esnek saatler','Deneme dersi'],flasT:'Bu hafta kayıtlarda kitap hediye',anket:['Hangisini öğrenmek istersin?','Piyano','Gitar'],
 follow:['Öğrenci performansları','Her hafta yeni video','520','15B'],ozel:['Dünya Müzik Günü kutlu olsun','21 HAZİRAN'],teslim:['Kayıt kolaylığı','Online kayıt','Taksitli ödeme','Deneme dersi ücretsiz'],
 randevu:['Deneme dersi ayırt','23','KASIM','11:00 · 15:00 · 18:00','Randevu al'],myth:['Müzik için yetenek şarttır','Düzenli pratikle herkes çalmayı öğrenebilir'],
 hist:[['2015','Kurs açıldı'],['2018','Konser salonu'],['2022','Resim bölümü'],['2026','Ukulele dersleri']],week:[['Pzt','Piyano'],['Sal','Gitar'],['Çar','Şan'],['Per','Resim'],['Cmt','Grup provası']],
 prize:['Ücretsiz ders','Nota defteri','%10 indirim','Konser bileti','Pena seti','Tekrar dene'],clients:['Kent Lisesi','Kafe Sahne','Kreş Papatya','Belediye Kültür','Koro Derneği','Sanat Galerisi'],words:['ritim','melodi','renk','ilham'],
 route:['Moda İskelesi','Nota Sanat','5 dk yürüme'],prod:'Piyano dersi',loyal:'Kardeşe %20',big:'MÜZİK',weather:'Yağmurlu günlere gitar'});
addSector({n:'Dans Okulu',p:['#2A0E14','#FF5C7A'],brand:'Ritim Dans',slogan:'Hayat, dans etmeye değer',handle:'@ritimdans',web:'ritimdans.com',phone:'0 232 000 00 00',area:'Bornova',addr:'Kazımdirik Mah. No:14',cat:'Dans okulu',
 news:['YENİ GRUP','Salsa başlangıç grubu','Partnerli ya da partnersiz','Kayıt ol'],disc:['%25','Çift kayıtlarında indirim','Bu dönem için','Kayıt ol'],
 star:['Düğün Dansı Paketi','6 özel ders, koreografi','₺ 7.900','Şarkınıza özel','Prova dahil'],tipsT:'Dansa başlarken 3 öneri',tips:['Rahat ayakkabı giyin','Ritmi dinleyin','Ayna karşısında tekrar edin','Haftada 2 ders yeter','Eğlenin'],donts:['İlk derste mükemmel olmak','Isınmayı atlamak','Kayan ayakkabı'],
 menuT:'Ders ücretleri',items:[['Salsa','₺1.900'],['Bachata','₺1.900'],['Tango','₺2.400'],['Hip hop','₺1.700'],['Düğün dansı','₺7.900'],['Çocuk dansı','₺1.500']],
 reviews:[['Düğün dansımız herkesi büyüledi.','Seda & Can'],['Partnersiz geldim, çok eğlendim.','Elif T.'],['Hocalar harika enerjili.','Burak K.']],rakamT:'Rakamlarla Ritim',stats:{n:'3.500+',nl:'dansçı',yr:'10',rt:4.9,rv:'610',x:'150 düğün dansı'},
 ev:['Salsa Gecesi','29','KASIM','Bornova stüdyo · 21:00','Katıl'],hook:['İki sol ayağın mı var?','Herkes öyle başlar. İlk ders ücretsiz.'],soon:['Yeni stüdyomuz açılıyor','Alsancak · 1 Aralık','YAKINDA'],close:'Dans etmeye devam',
 offT:'İlk aya özel',code:'RITIM15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Ders paketleri','4 ders · ₺ 1.900','8 ders · ₺ 3.400','Sınırsız · ₺ 4.900'],svc:['Dans türleri','Salsa','Bachata','Tango','Hip hop'],
 steps:['Düğün dansı 4 adımda','Şarkını seç','Koreografi','Provalar','Büyük gün'],draw:['Düğün dansı paketi kazan','Çekiliş 14 Şubat\'ta'],faq:['Partnerim yok, gelebilir miyim?','Elbette, rotasyonla dans ediyoruz.','Kaç yaşından itibaren?','6 yaştan itibaren çocuk grubu.'],
 near:['Metroya 4 dk','Otopark var'],team:[['Deniz A.','Salsa'],['Lucas M.','Tango'],['Ece K.','Hip hop'],['Burak T.','Düğün dansı']],quote:'Adımları biz öğretiriz, gülümseme sizden.',
 once:['İlk dersten sahneye','Öğrencimizin 3 ayı'],yeni:['YENİ DERS','Heels dans','Kendine güven','Deneme al'],hours:['Stüdyo saatleri','Hafta içi · 17:00 – 23:00','Cumartesi · 11:00 – 20:00','Pazar · 12:00 – 18:00','Özel ders sabah saatlerinde'],
 feats:['Partnersiz katılım','Düğün dansı','Her seviyeye grup','Sosyal geceler','Özel ders','Deneme dersi'],flasT:'Bu hafta kayıtlara dans ayakkabısı hediye',anket:['Hangisini öğrenmek istersin?','Salsa','Tango'],
 follow:['Dans videoları için takip et','Her hafta yeni koreografi','780','41B'],ozel:['Dünya Dans Günü kutlu olsun','29 NİSAN'],teslim:['Kayıt kolaylığı','Online kayıt','Taksitli ödeme','Deneme dersi ücretsiz'],
 randevu:['Deneme dersi ayırt','22','KASIM','18:00 · 19:30 · 21:00','Randevu al'],myth:['Dans için esnek olmak gerekir','Esneklik dans ettikçe gelir'],
 hist:[['2016','Stüdyo açıldı'],['2018','Tango bölümü'],['2022','Düğün dansı'],['2026','Alsancak stüdyosu']],week:[['Pzt','Salsa'],['Sal','Bachata'],['Çar','Tango'],['Per','Hip hop'],['Cmt','Sosyal gece']],
 prize:['Ücretsiz ders','Dans ayakkabısı','%10 indirim','Sosyal gece bileti','Tişört','Tekrar dene'],clients:['Düğün Salonu','Otel Sahne','Spor Kulübü','Üniversite','Festival Ekibi','Kafe Ritim'],words:['ritim','tutku','enerji','özgürlük'],
 route:['Bornova Metro','Ritim Dans','4 dk yürüme'],prod:'Düğün dansı paketi',loyal:'5. ders bizden',big:'DANS',weather:'Kış akşamlarına salsa'});
addSector({n:'Fotoğraf Stüdyosu',p:['#1C1D21','#F5F5F0'],brand:'Kare Stüdyo',slogan:'Anılarınızı karelere sığdırıyoruz',handle:'@karestudyo',web:'karestudyo.com',phone:'0 216 000 00 00',area:'Kadıköy',addr:'Moda Cad. No:12',cat:'Fotoğraf stüdyosu',
 news:['YENİ HİZMET','Yenidoğan fotoğraf çekimi','Evinizde, güvenle','Randevu al'],disc:['%20','Aile çekimlerinde indirim','Kasım boyunca','Randevu al'],
 star:['Dış Mekân Çekimi','2 saat, 40 düzenlenmiş kare','₺ 6.900','Albüm dahil','Konum seçimi'],tipsT:'Çekim öncesi 3 öneri',tips:['Düz renk kıyafet seçin','Logo ve yazıdan kaçının','İyi uyuyun','Su için','Rahat olun, gerisi bizde'],donts:['Çizgili kıyafet','Aşırı makyaj','Son dakika saç kesimi'],
 menuT:'Çekim fiyatları',items:[['Vesikalık','₺350'],['Aile çekimi','₺4.900'],['Düğün hikâyesi','₺24.900'],['Yenidoğan','₺5.900'],['Ürün çekimi','₺3.500'],['Kurumsal portre','₺2.900']],
 reviews:[['Düğün fotoğraflarımız rüya gibi.','Merve & Kaan'],['Bebeğimizin ilk günleri ölümsüz oldu.','Elif A.'],['Ürün fotoğraflarımız satışı artırdı.','Norde Moda']],rakamT:'Rakamlarla Kare',stats:{n:'2.400+',nl:'çekim',yr:'12',rt:4.9,rv:'530',x:'1 haftada teslim'},
 ev:['Mini Çekim Günü','6','ARALIK','Kadıköy stüdyo · 10:00','Randevu al'],hook:['Telefonunda 10 bin fotoğraf var, tek albüm yok mu?','Bu yıl bir albüm yaptıralım.'],soon:['Dış çekim paketlerimiz geliyor','Mart 2027','YAKINDA'],close:'Anılarınız bizde güvende',
 offT:'İlk çekime özel',code:'KARE15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Çekim paketleri','Mini · ₺ 2.900','Aile · ₺ 4.900','Premium · ₺ 8.900'],svc:['Çekimlerimiz','Düğün','Aile','Yenidoğan','Ürün'],
 steps:['Çekim 4 adımda','Paketi seç','Tarihi ayır','Çekim günü','1 haftada teslim'],draw:['Aile çekimi kazan','Çekiliş 1 Aralık\'ta'],faq:['Fotoğraflar ne zaman teslim?','1 hafta içinde.','Ham fotoğrafları veriyor musunuz?','Seçtikleriniz düzenlenmiş teslim edilir.'],
 near:['Moda Caddesi üzeri','Otopark anlaşmalı'],team:[['Emre K.','Fotoğrafçı'],['Selin D.','Yenidoğan'],['Can T.','Video'],['Naz A.','Rötuş']],quote:'İyi fotoğraf, sizin olduğunuz andır.',
 once:['Ham kareden albüme','Rötuşun gücü'],yeni:['YENİ PAKET','Çift hikâyesi çekimi','Nişan öncesi','Randevu al'],hours:['Stüdyo saatleri','Hafta içi · 10:00 – 19:00','Cumartesi · 09:00 – 20:00','Pazar · 10:00 – 18:00','Dış çekim randevuyla'],
 feats:['1 haftada teslim','Profesyonel rötuş','Albüm dahil','Dış çekim','Stüdyo ışığı','Video seçeneği'],flasT:'Vesikalıkta bu hafta 2 adet hediye',anket:['Hangisi daha güzel?','Siyah beyaz','Renkli'],
 follow:['Çekimlerimizi gör','Her gün yeni kare','1.100','62B'],ozel:['Anneler Günü kutlu olsun','ANNEM'],teslim:['Teslim','Online galeri','Taksitli ödeme','Beğenmezseniz yeniden çekim'],
 randevu:['Çekim gününü seç','6','ARALIK','10:00 · 13:00 · 16:00','Randevu al'],myth:['İyi fotoğraf için pahalı kamera yeter','Işık ve doğru an kameradan daha önemlidir'],
 hist:[['2014','Stüdyo açıldı'],['2017','Düğün ekibi'],['2021','Video birimi'],['2026','Yenidoğan stüdyosu']],week:[['Pzt','Vesikalık'],['Çar','Ürün çekimi'],['Cum','Aile çekimi'],['Cmt','Düğün'],['Paz','Dış çekim']],
 prize:['Aile çekimi','Albüm','%10 indirim','Vesikalık','Çerçeve','Tekrar dene'],clients:['Norde Moda','Cafe Luna','Gelin Evi','Düğün Salonu','Butik Otel','Kreş Papatya'],words:['an','ışık','hikâye','hatıra'],
 route:['Kadıköy İskelesi','Kare Stüdyo','6 dk yürüme'],prod:'Aile çekimi',loyal:'İkinci çekimde %20',big:'AN',weather:'Sonbahar yapraklarında dış çekim'});
addSector({n:'Nakliyat',p:['#0F1B3D','#FF9F1C'],brand:'Taşıma Ustası',slogan:'Eşyanız bizim emanetimiz',handle:'@tasimaustasi',web:'tasimaustasi.com',phone:'0 850 000 00 00',area:'Türkiye geneli',addr:'Esenyurt Depo No:3',cat:'Nakliyat',
 news:['YENİ HİZMET','Asansörlü taşımacılık','Yüksek katlara güvenli taşıma','Teklif al'],disc:['%20','Hafta içi taşınmalarda indirim','Bu ay boyunca','Teklif al'],
 star:['Ev Taşıma','3+1 ev, paketleme dahil','₺ 18.900','Sigortalı','Montaj dahil'],tipsT:'Taşınmadan önce 3 öneri',tips:['Kutuları oda oda etiketleyin','Değerlileri yanınızda taşıyın','Sayaçları kapattırın','Gereksizleri bağışlayın','Tarihi 2 hafta önce ayırtın'],donts:['Son gün paketlemek','Kutuyu aşırı doldurmak','Sigortasız taşınmak'],
 menuT:'Taşıma fiyatları',items:[['1+1 ev','₺9.900'],['2+1 ev','₺13.900'],['3+1 ev','₺18.900'],['Ofis taşıma','₺24.900'],['Asansörlü','₺3.500'],['Eşya depolama','₺2.900']],
 reviews:[['Tek bir bardak bile kırılmadı.','Ayşe K.'],['Ekip çok hızlı ve düzenliydi.','Murat T.'],['Ofisimizi hafta sonu taşıdılar.','Kuzey Kreatif']],rakamT:'Rakamlarla Taşıma Ustası',stats:{n:'11.000+',nl:'taşınan ev',yr:'16',rt:4.8,rv:'890',x:'Tam sigortalı'},
 ev:['Ücretsiz Ekspertiz Haftası','25','KASIM','İstanbul geneli','Teklif al'],hook:['Taşınmak gözünde büyüyor mu?','Paketleme, taşıma ve montaj tek ekipte.'],soon:['Ankara\'ya da taşıyoruz','Ankara · 1 Ocak','YAKINDA'],close:'Yeni evinize hayırlı olsun',
 offT:'İlk taşınmaya',code:'TASI10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Taşıma paketleri','Ekonomik · ₺ 9.900','Standart · ₺ 13.900','Anahtar teslim · ₺ 18.900'],svc:['Hizmetlerimiz','Ev taşıma','Ofis taşıma','Asansör','Depolama'],
 steps:['Taşınma 4 adımda','Ücretsiz ekspertiz','Paketleme','Güvenli taşıma','Montaj'],draw:['Ücretsiz paketleme kazan','Çekiliş 1 Aralık\'ta'],faq:['Sigorta var mı?','Tüm eşyalar sigortalı.','Paketleme malzemesi dahil mi?','Evet.'],
 near:['Türkiye geneli hizmet','7/24 çağrı'],team:[['Hasan U.','Operasyon'],['Kemal D.','Ekip lideri'],['Ali T.','Montaj'],['Seda K.','Müşteri ilişkileri']],quote:'Eşyanız, sizin hatıralarınız. Öyle taşıyoruz.',
 once:['Dağınık evden düzenli eve','Anahtar teslim taşıma'],yeni:['YENİ HİZMET','Eşya depolama','Güvenli, kameralı depo','Teklif al'],hours:['Çalışma saatlerimiz','Hafta içi · 07:00 – 21:00','Cumartesi · 07:00 – 21:00','Pazar · 08:00 – 18:00','Çağrı merkezi 7/24'],
 feats:['Tam sigorta','Ücretsiz ekspertiz','Paketleme dahil','Montaj','Asansörlü taşıma','Depolama'],flasT:'Ay ortası taşınmalarda indirim',anket:['Taşınmada en zor kısım?','Paketlemek','Yerleşmek'],
 follow:['Taşınma ipuçları için takip et','Her hafta yeni ipucu','210','7.200'],ozel:['Yeni yuvanız kutlu olsun','YUVA'],teslim:['Güvence','Tam sigortalı taşıma','Taksitli ödeme','Hasarda tam tazmin'],
 randevu:['Ekspertiz günü ayırt','25','KASIM','09:00 · 13:00 · 17:00','Teklif al'],myth:['Nakliyatçı kutuları siz hazırlamalısınız','Paketleme hizmeti çoğu pakete dahildir'],
 hist:[['2010','İlk kamyon'],['2015','Ofis taşıma'],['2020','Depolama'],['2026','Ankara']],week:[['Pzt','Ekspertiz'],['Sal','Ofis taşıma'],['Çar','Paketleme'],['Cmt','Ev taşıma'],['Paz','Depolama']],
 prize:['Ücretsiz paketleme','Asansör','%10 indirim','Kutu seti','Depolama 1 ay','Tekrar dene'],clients:['Kuzey Kreatif','Emlak Ofisi','Site Yönetimi','Ofis Plaza','Üniversite Yurdu','Mavi Vadi'],words:['güvenli','hızlı','özenli','sigortalı'],
 route:['Mevcut eviniz','Yeni eviniz','Aynı gün'],prod:'Ev taşıma',loyal:'Referansınla %10',big:'TAŞI',weather:'Yağmurda da güvenli taşıma'});
addSector({n:'Halı Yıkama & Kuru Temizleme',p:['#06282A','#7CE7D9'],brand:'Pak Halı',slogan:'Halınız ilk günkü gibi',handle:'@pakhali',web:'pakhali.com',phone:'0 312 000 00 00',area:'Etimesgut',addr:'Eryaman Sanayi No:6',cat:'Halı yıkama',
 news:['YENİ HİZMET','Yorgan ve battaniye yıkama','Kış öncesi temizlik','Randevu al'],disc:['%25','Kış öncesi halı yıkama indirimi','Kasım boyunca','Hemen ayırt'],
 star:['Halı Yıkama','Makinede, m² başına','₺ 60 / m²','Ücretsiz alım','3 günde teslim'],tipsT:'Halınız için 3 öneri',tips:['Haftada iki kez süpürün','Lekeye hemen müdahale edin','Yılda bir yıkatın','Güneşe ters çevirin','Altına kaydırmaz koyun'],donts:['Lekeyi ovmak','Çamaşır suyu dökmek','Islak halıyı sermek'],
 menuT:'Fiyat listesi',items:[['Halı (m²)','₺60'],['Koltuk','₺1.200'],['Yorgan','₺450'],['Perde (m)','₺90'],['Takım elbise','₺350'],['Gelinlik','₺1.900']],
 reviews:[['Halımız rengini geri kazandı.','Fatma K.'],['Aldıkları gün gibi kokuyor.','Ahmet T.'],['Kapıdan alıp getirmeleri harika.','Zeynep A.']],rakamT:'Rakamlarla Pak',stats:{n:'45.000+',nl:'yıkanan halı',yr:'14',rt:4.8,rv:'1.210',x:'3 günde teslim'},
 ev:['Bahar Temizliği Kampanyası','1','MART','Ankara geneli','Randevu al'],hook:['Halın gerçekten temiz mi?','Gözle görünmeyen toz akarını yıkamak gerekir.'],soon:['Çankaya şubemiz açılıyor','Çankaya · 1 Aralık','YAKINDA'],close:'Tertemiz bir yuva',
 offT:'İlk siparişe',code:'PAK15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Ev paketleri','Salon · ₺ 1.900','Tüm ev · ₺ 3.900','Ev + koltuk · ₺ 5.900'],svc:['Hizmetlerimiz','Halı','Koltuk','Yorgan','Kuru temizleme'],
 steps:['Halı yıkama 4 adımda','Randevu al','Kapından alalım','Makinede yıkayalım','3 günde getirelim'],draw:['Tüm ev halı yıkama kazan','Çekiliş 1 Aralık\'ta'],faq:['Alım ve teslim ücretli mi?','Hayır, ücretsiz.','Halı ne zaman gelir?','3 iş günü içinde.'],
 near:['Ankara geneli alım','Aynı gün alım'],team:[['Recep U.','Kurucu'],['Ayşe D.','Kuru temizleme'],['Kemal T.','Halı ustası'],['Ozan K.','Kurye']],quote:'Halıyı yıkamak değil, yuvayı ferahlatmak bizim işimiz.',
 once:['Lekeli halı, yeni gibi','Makine yıkama'],yeni:['YENİ HİZMET','Gelinlik kuru temizleme','Özenli el işçiliği','Randevu al'],hours:['Çalışma saatlerimiz','Hafta içi · 08:00 – 20:00','Cumartesi · 08:00 – 19:00','Pazar · Kapalı','Online randevu 7/24'],
 feats:['Ücretsiz alım ve teslim','Makine yıkama','3 günde teslim','Antialerjik','Hijyen garantisi','Kapıda ödeme'],flasT:'Bu hafta koltuk yıkamada indirim',anket:['Halın kaç yılda bir yıkanıyor?','Her yıl','Hiç'],
 follow:['Önce ve sonra videoları','Her gün yeni dönüşüm','260','12B'],ozel:['Bayramınız mübarek olsun','BAYRAM'],teslim:['Teslimat','Ücretsiz alım ve teslim','Kapıda ödeme','Memnun kalmazsan yeniden yıkarız'],
 randevu:['Alım gününü seç','22','KASIM','09:00 · 13:00 · 17:00','Randevu al'],myth:['Halıyı evde şampuanlamak yeterli','Derin kirler ve akarlar ancak makine yıkamayla çıkar'],
 hist:[['2012','İlk tesis'],['2016','Kuru temizleme'],['2021','Online randevu'],['2026','Çankaya şubesi']],week:[['Pzt','Halı alımı'],['Çar','Koltuk yıkama'],['Cum','Teslim günü'],['Cmt','Kuru temizleme'],['Paz','Kapalı']],
 prize:['Halı yıkama','Yorgan yıkama','%10 indirim','Koltuk yıkama','Perde','Tekrar dene'],clients:['Site Yönetimi','Otel Ankara','Kreş Papatya','Cami Derneği','Ofis Plaza','Restoran Lezzet'],words:['temiz','ferah','hijyenik','hızlı'],
 route:['Kapınız','Tesisimiz','3 günde geri'],prod:'Halı yıkama',loyal:'5. yıkamada %20',big:'PAK',weather:'Kış öncesi halı yıkama'});
addSector({n:'Terzi & Tadilat',p:['#14110B','#C9A227'],brand:'İğne İplik Terzi',slogan:'Tam size göre',handle:'@igneipliktezi',web:'igneiplik.com',phone:'0 212 000 00 00',area:'Bakırköy',addr:'İstanbul Cad. No:40',cat:'Terzi',
 news:['YENİ HİZMET','Ölçüye özel takım elbise','Kumaşını seç, tam ölçüne dikelim','Randevu al'],disc:['%20','Paça ve bel tadilatında indirim','Bu hafta','Uğra'],
 star:['Ölçüye Özel Takım','Yün kumaş, 3 prova','₺ 14.900','El işçiliği','3 hafta teslim'],tipsT:'Kıyafetiniz için 3 öneri',tips:['Takımı askıda saklayın','Etikete göre yıkayın','Sezon sonu kuru temizleme','Düğmeyi hemen diktirin','Paçayı ayakkabıyla ölçtürün'],donts:['Takımı katlayarak saklamak','Ütüyü doğrudan yünlüye basmak','Yırtığı büyütmek'],
 menuT:'Tadilat fiyatları',items:[['Paça','₺150'],['Bel daraltma','₺250'],['Fermuar değişimi','₺200'],['Gelinlik tadilatı','₺2.500'],['Ceket kol','₺350'],['Ölçüye takım','₺14.900']],
 reviews:[['Takımım tam üstüme oturdu.','Kerem T.'],['Gelinliğimi kusursuz daralttılar.','Ece A.'],['Aynı gün paça yaptılar.','Murat K.']],rakamT:'Rakamlarla İğne İplik',stats:{n:'30.000+',nl:'tadilat',yr:'35',rt:4.9,rv:'640',x:'Aynı gün tadilat'},
 ev:['Damatlık Günleri','29','KASIM','Bakırköy · 10:00','Randevu al'],hook:['En sevdiğin pantolon artık olmuyor mu?','Atmayın, getirin. Yeniden size göre olsun.'],soon:['Ataköy şubemiz açılıyor','Ataköy · 1 Aralık','YAKINDA'],close:'Tam size göre',
 offT:'İlk tadilata',code:'IGNE15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Damat paketleri','Klasik · ₺ 12.900','Premium · ₺ 18.900','Tam set · ₺ 24.900'],svc:['Hizmetlerimiz','Tadilat','Ölçüye dikim','Gelinlik','Perde dikimi'],
 steps:['Ölçüye takım 4 adımda','Kumaşı seç','Ölçü al','2 prova','Teslim al'],draw:['Ölçüye özel gömlek kazan','Çekiliş 1 Aralık\'ta'],faq:['Tadilat ne kadar sürer?','Paça aynı gün.','Kendi kumaşımı getirebilir miyim?','Elbette.'],
 near:['Bakırköy Marmaray 3 dk','Otopark anlaşmalı'],team:[['Usta Hüseyin','Terzi'],['Nermin K.','Gelinlik'],['Ali D.','Tadilat'],['Ece T.','Kumaş danışmanı']],quote:'Kıyafet size uymaz, biz kıyafeti size uydururuz.',
 once:['Bol ceketten tam kalıba','Tadilatın gücü'],yeni:['YENİ KUMAŞLAR','İtalyan yün koleksiyonu','Kış damatlıkları için','İncele'],hours:['Dükkân saatleri','Hafta içi · 09:00 – 20:00','Cumartesi · 09:00 – 20:00','Pazar · Kapalı','Prova randevuyla'],
 feats:['Aynı gün tadilat','Ölçüye dikim','El işçiliği','Gelinlik uzmanlığı','Kumaş danışmanlığı','Garantili iş'],flasT:'Bu hafta paça tadilatı aynı fiyata iki adet',anket:['Hangisi daha şık?','Tek düğme','Çift düğme'],
 follow:['Dikim süreçlerini izle','Her hafta yeni iş','230','8.400'],ozel:['Mutluluklar dileriz','DAMAT'],teslim:['Teslim','Aynı gün tadilat','Kartla ödeme','Ücretsiz düzeltme'],
 randevu:['Prova günü ayırt','22','KASIM','10:00 · 14:00 · 18:00','Randevu al'],myth:['Ölçüye dikim çok pahalıdır','Kaliteli hazır takımla benzer fiyata ölçüye dikim mümkün'],
 hist:[['1991','Dükkân açıldı'],['2005','Gelinlik bölümü'],['2018','Ölçüye dikim'],['2026','Ataköy şubesi']],week:[['Pzt','Paça günü'],['Çar','Gelinlik'],['Cum','Damat provası'],['Cmt','Ölçü günü'],['Paz','Kapalı']],
 prize:['Ölçüye gömlek','Paça tadilatı','%10 indirim','Kravat','Askı seti','Tekrar dene'],clients:['Gelinlik Evi','Damat Evi','Düğün Salonu','Kuru Temizleme','Moda Butik','Okul Kıyafet'],words:['ölçü','zarafet','özen','kalıp'],
 route:['Bakırköy Marmaray','İğne İplik Terzi','3 dk yürüme'],prod:'Ölçüye özel takım',loyal:'5. tadilat bizden',big:'ÖLÇÜ',weather:'Kış montlarına fermuar değişimi'});
addSector({n:'Usta Hizmetleri',p:['#101114','#FF6B1A'],brand:'Usta Burada',slogan:'Evdeki her işe bir usta',handle:'@ustaburada',web:'ustaburada.com',phone:'0 850 000 00 00',area:'İstanbul geneli',addr:'Ümraniye Ofis No:2',cat:'Tamir ustası',
 news:['YENİ HİZMET','Kombi bakımı kampanyası','Kış öncesi güvenli ısınma','Randevu al'],disc:['%20','Kombi bakımında indirim','Kasım boyunca','Randevu al'],
 star:['Kombi Bakımı','Temizlik, gaz kontrolü','₺ 1.400','Sertifikalı usta','6 ay garanti'],tipsT:'Kışa hazırlık için 3 öneri',tips:['Kombiye yıllık bakım yaptırın','Petekleri havalandırın','Su basıncını kontrol edin','Termostatı 21°C\'de tutun','Kapı altlarını kapatın'],donts:['Basıncı ihmal etmek','Kombiyi kendin açmak','Kaçak elektrik tesisatı'],
 menuT:'Hizmet fiyatları',items:[['Kombi bakımı','₺1.400'],['Petek temizliği','₺2.500'],['Priz/anahtar','₺350'],['Musluk değişimi','₺600'],['Tıkanıklık açma','₺900'],['Klima bakımı','₺1.200']],
 reviews:[['Kombim yeni gibi çalışıyor.','Ayşe T.'],['Usta tam saatinde geldi.','Kerem B.'],['Fiyatı en baştan net söylediler.','Fatma D.']],rakamT:'Rakamlarla Usta Burada',stats:{n:'28.000+',nl:'tamamlanan iş',yr:'8',rt:4.8,rv:'2.040',x:'Aynı gün usta'},
 ev:['Kombi Bakım Haftası','15','KASIM','İstanbul geneli','Randevu al'],hook:['Kombin neden ses yapıyor?','Bakım zamanı gelmiş olabilir. Aynı gün usta gönderelim.'],soon:['Ankara\'ya geliyoruz','Ankara · 1 Ocak','YAKINDA'],close:'Eviniz emin ellerde',
 offT:'İlk randevuya',code:'USTA10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Ev bakım paketleri','Temel · ₺ 1.900','Kış · ₺ 3.400','Yıllık · ₺ 6.900'],svc:['Hizmetlerimiz','Elektrik','Tesisat','Kombi','Klima'],
 steps:['Usta çağırmak 4 adımda','İşi seç','Fiyatı gör','Saati ayır','Usta kapında'],draw:['Ücretsiz kombi bakımı kazan','Çekiliş 1 Aralık\'ta'],faq:['Ustalar sertifikalı mı?','Tüm ustalarımız belgeli.','Garanti var mı?','Tüm işlerde 6 ay.'],
 near:['İstanbul geneli','Aynı gün usta'],team:[['Hakan U.','Kombi ustası'],['Mehmet K.','Elektrikçi'],['Ali D.','Tesisatçı'],['Seda T.','Müşteri hizmetleri']],quote:'İşi bir kere, doğru yaparız.',
 once:['Paslı musluk, yeni batarya','Tesisat yenileme'],yeni:['YENİ HİZMET','Akıllı termostat kurulumu','Faturada tasarruf','Randevu al'],hours:['Çalışma saatlerimiz','Hafta içi · 08:00 – 20:00','Cumartesi · 08:00 – 18:00','Pazar · Acil hat','Acil arıza hattı 7/24'],
 feats:['Belgeli usta','Aynı gün hizmet','Net fiyat','6 ay garanti','Acil hat','Kartla ödeme'],flasT:'Petek temizliğinde bu hafta fırsat',anket:['Evde en çok ne bozuluyor?','Musluk','Priz'],
 follow:['Ev ipuçları için takip et','Her hafta yeni ipucu','300','11B'],ozel:['Yeni yılda eviniz sıcacık olsun','2027'],teslim:['Güvence','Belgeli ve sigortalı usta','Kartla ödeme','6 ay işçilik garantisi'],
 randevu:['Usta randevusu al','21','KASIM','09:00 · 13:00 · 17:00','Randevu al'],myth:['Kombiyi kapatıp açmak tasarruf sağlar','Sabit sıcaklık çoğu zaman daha az yakıt harcar'],
 hist:[['2018','İlk ekip'],['2020','Online randevu'],['2023','Klima birimi'],['2026','Ankara']],week:[['Pzt','Kombi'],['Sal','Elektrik'],['Çar','Tesisat'],['Per','Klima'],['Cmt','Acil işler']],
 prize:['Kombi bakımı','Priz değişimi','%10 indirim','Petek temizliği','Termostat','Tekrar dene'],clients:['Site Yönetimi','Emlak Ofisi','Ofis Plaza','Kafe Zeytin','Kreş Papatya','Mavi Vadi'],words:['hızlı','güvenli','garantili','dürüst'],
 route:['Bulunduğunuz yer','Usta Burada','Ortalama 90 dk'],prod:'Kombi bakımı',loyal:'Yıllık pakette 2 ay bedava',big:'USTA',weather:'Soğuklar gelmeden kombi bakımı'});
addSector({n:'Bahçe & Peyzaj',p:['#0F1F17','#A3E635'],brand:'Yeşil Avlu',slogan:'Bahçeniz yaşasın',handle:'@yesilavlu',web:'yesilavlu.com',phone:'0 232 000 00 00',area:'Urla',addr:'İskele Mah. No:18',cat:'Peyzaj',
 news:['YENİ HİZMET','Otomatik sulama sistemi','Tatildeyken bile yeşil bahçe','Keşif iste'],disc:['%20','Bahçe bakım aboneliğinde indirim','İlk 3 ay','Abone ol'],
 star:['Çim Serimi','Hazır rulo çim, m² başına','₺ 180 / m²','Toprak hazırlığı','Sulama dahil'],tipsT:'Bahçeniz için 3 öneri',tips:['Sabah erken sulayın','Çimi 5 cm\'den kısa biçmeyin','Mevsime göre gübreleyin','Kuru yaprağı toplayın','Yerel bitki seçin'],donts:['Öğlen sulamak','Çimi dibinden biçmek','Fazla gübre'],
 menuT:'Hizmet fiyatları',items:[['Çim serimi','₺180'],['Bahçe bakımı','₺2.900'],['Ağaç budama','₺1.500'],['Sulama sistemi','₺12.900'],['Bitki dikimi','₺350'],['Peyzaj projesi','Teklif']],
 reviews:[['Bahçemiz hiç bu kadar güzel olmamıştı.','Ayşe & Murat'],['Sulama sistemi hayatımızı kolaylaştırdı.','Can T.'],['Otelimizin bahçesini harika yaptılar.','Azure Bay']],rakamT:'Rakamlarla Yeşil Avlu',stats:{n:'1.500+',nl:'bahçe',yr:'12',rt:4.9,rv:'410',x:'120 bitki çeşidi'},
 ev:['Ücretsiz Bahçe Keşfi Haftası','1','MART','Urla ve çevresi','Keşif iste'],hook:['Bahçen yazın neden sararıyor?','Yanlış saatte sulanıyor olabilir.'],soon:['Çeşme şubemiz açılıyor','Çeşme · 1 Nisan','YAKINDA'],close:'Yeşil kalın',
 offT:'İlk projeye',code:'AVLU10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Bakım paketleri','Aylık · ₺ 2.900','Sezonluk · ₺ 7.900','Yıllık · ₺ 24.900'],svc:['Hizmetlerimiz','Peyzaj tasarımı','Çim','Sulama','Budama'],
 steps:['Bahçe projesi 4 adımda','Ücretsiz keşif','3B tasarım','Uygulama','Bakım'],draw:['Ücretsiz bahçe bakımı kazan','Çekiliş 1 Mart\'ta'],faq:['Keşif ücretli mi?','Hayır, ücretsiz.','Bakım ne sıklıkla?','Yazın haftada bir.'],
 near:['Urla merkeze 5 dk','Fidanlık ziyareti'],team:[['Ece D.','Peyzaj mimarı'],['Hasan U.','Bahçıvan'],['Kemal T.','Sulama'],['Naz A.','Fidanlık']],quote:'Her bahçe, sahibinin yaşam tarzını yansıtmalı.',
 once:['Boş arsadan yeşil avluya','Peyzaj dönüşümü'],yeni:['FİDANLIKTA YENİ','Akdeniz bitkileri','Az su, çok renk','İncele'],hours:['Çalışma saatlerimiz','Hafta içi · 08:00 – 18:00','Cumartesi · 08:00 – 16:00','Pazar · Fidanlık açık','Keşif randevuyla'],
 feats:['Ücretsiz keşif','3B tasarım','Otomatik sulama','Yerel bitkiler','Bakım aboneliği','Garantili çim'],flasT:'Bahar dikimlerinde erken rezervasyon fırsatı',anket:['Hangisi daha güzel?','Çim bahçe','Taş bahçe'],
 follow:['Bahçe dönüşümlerini gör','Her hafta yeni proje','350','14B'],ozel:['Dünya Çevre Günü kutlu olsun','5 HAZİRAN'],teslim:['Güvence','Ücretsiz keşif','Taksitli ödeme','Tutmayan bitkiyi yenileriz'],
 randevu:['Keşif gününü seç','1','MART','09:00 · 12:00 · 15:00','Keşif iste'],myth:['Çim her gün sulanmalı','Seyrek ama derin sulama kökleri güçlendirir'],
 hist:[['2014','Fidanlık açıldı'],['2017','Peyzaj tasarımı'],['2022','Sulama birimi'],['2026','Çeşme şubesi']],week:[['Pzt','Keşif'],['Sal','Çim'],['Çar','Budama'],['Per','Sulama'],['Cmt','Fidanlık']],
 prize:['Bahçe bakımı','Fidan','%10 indirim','Saksı bitkisi','Gübre','Tekrar dene'],clients:['Azure Bay','Butik Otel','Site Yönetimi','Kafe Bahçe','Okul Kent','Mavi Vadi'],words:['yeşil','doğal','huzur','yaşam'],
 route:['Urla Merkez','Yeşil Avlu','5 dk'],prod:'Otomatik sulama',loyal:'Yıllık bakımda 1 ay bedava',big:'YEŞİL',weather:'Bahar öncesi budama zamanı'});

// ===== Yeni meslekler D: mimarlık, matbaa, catering, gelinlik, araç kiralama, seyahat, hırdavat, kasap =====
addSector({n:'Mimarlık & İç Tasarım',p:['#1A1714','#D4B48C'],brand:'Çizgi Mimarlık',slogan:'Yaşadığınız alan, hikâyeniz',handle:'@cizgimimarlik',web:'cizgimimarlik.com',phone:'0 212 000 00 00',area:'Nişantaşı',addr:'Abdi İpekçi Cad. No:22',cat:'İç mimarlık',
 news:['YENİ HİZMET','Anahtar teslim ev yenileme','Tasarımdan uygulamaya tek ekip','Görüşme ayarla'],disc:['%15','Proje çiziminde indirim','Kasım boyunca','Görüşme ayarla'],
 star:['Salon Tasarımı','3B görsel, malzeme listesi','₺ 24.900','2 revizyon','Uygulama desteği'],tipsT:'Evi yenilerken 3 öneri',tips:['Önce ışığı planlayın','Depolamayı unutmayın','Az ama nitelikli mobilya','Doğal malzeme seçin','Bütçenin %10\'unu yedekte tutun'],donts:['Ölçüsüz mobilya almak','Tek tavan lambası','Plansız yıkım'],
 menuT:'Proje ücretleri',items:[['Danışmanlık','₺4.900'],['Tek oda','₺14.900'],['Salon','₺24.900'],['Tüm daire','₺69.900'],['Ofis','Teklif'],['Uygulama','Teklif']],
 reviews:[['Evimiz dergi sayfası gibi oldu.','Selin & Kaan'],['Bütçemizi hiç aşmadılar.','Murat T.'],['Ofisimizde verim arttı.','Kuzey Kreatif']],rakamT:'Rakamlarla Çizgi',stats:{n:'420+',nl:'proje',yr:'14',rt:4.9,rv:'190',x:'3 tasarım ödülü'},
 ev:['Açık Ofis Günü','5','ARALIK','Nişantaşı · 14:00','Katıl'],hook:['Evin geniş ama sıkışık mı hissettiriyor?','Sorun metrekare değil, plan olabilir.'],soon:['Bodrum ofisimiz açılıyor','Bodrum · Nisan 2027','YAKINDA'],close:'Alanınız size benzesin',
 offT:'İlk projeye',code:'CIZGI10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Tasarım paketleri','Danışmanlık · ₺ 4.900','Oda · ₺ 14.900','Daire · ₺ 69.900'],svc:['Hizmetlerimiz','İç mimarlık','Mimari proje','Uygulama','Danışmanlık'],
 steps:['Proje 4 adımda','Tanışma','Konsept ve 3B','Malzeme seçimi','Uygulama'],draw:['Ücretsiz danışmanlık kazan','Çekiliş 1 Aralık\'ta'],faq:['Uygulamayı da yapıyor musunuz?','Evet, anahtar teslim.','Proje ne kadar sürer?','Oda için 3 hafta.'],
 near:['Nişantaşı merkez','Showroom ziyareti'],team:[['Defne Ç.','Kurucu mimar'],['Emre K.','İç mimar'],['Naz A.','3B görselleştirme'],['Ali T.','Şantiye şefi']],quote:'İyi tasarım fark edilmez, hissedilir.',
 once:['Eski salondan ferah bir yaşam alanına','Yenileme projesi'],yeni:['YENİ HİZMET','Online iç mimarlık','Türkiye\'nin her yerine','Bilgi al'],hours:['Ofis saatleri','Hafta içi · 09:00 – 19:00','Cumartesi · 10:00 – 16:00','Pazar · Kapalı','Görüşmeler randevuyla'],
 feats:['3B görselleştirme','Anahtar teslim','Bütçe kontrolü','Ödüllü ekip','Online tasarım','Malzeme danışmanlığı'],flasT:'Bu ay danışmanlık ücretsiz',anket:['Hangisi daha güzel?','Minimal','Sıcak ahşap'],
 follow:['Projelerimizi keşfet','Her hafta yeni proje','280','19B'],ozel:['Dünya Mimarlık Günü kutlu olsun','MİMARLIK'],teslim:['Güvence','Sözleşmeli süreç','Aşamalı ödeme','Bütçe garantisi'],
 randevu:['Tanışma görüşmesi ayarla','5','ARALIK','10:00 · 14:00 · 17:00','Randevu al'],myth:['İç mimar sadece zenginler içindir','İyi plan, yanlış alışverişleri önleyerek para kazandırır'],
 hist:[['2012','Ofis kuruldu'],['2017','İlk ödül'],['2021','Uygulama ekibi'],['2026','Online tasarım']],week:[['Pzt','Tanışmalar'],['Sal','Çizim'],['Çar','Şantiye'],['Per','Malzeme'],['Cum','Teslim']],
 prize:['Danışmanlık','3B çizim','%10 indirim','Renk kartelası','Dekor kitabı','Tekrar dene'],clients:['Kuzey Kreatif','Butik Otel','Cafe Luna','Diş Kliniği','Mavi Vadi','Ofis Plaza'],words:['ışık','denge','doku','huzur'],
 route:['Nişantaşı','Çizgi Mimarlık','Showroom'],prod:'Salon tasarımı',loyal:'Referansla %10',big:'ALAN',weather:'Kışa sıcak ışık planı'});
addSector({n:'Matbaa & Baskı',p:['#0D0D12','#FF2E88'],brand:'Renk Matbaa',slogan:'Fikriniz kâğıda dökülsün',handle:'@renkmatbaa',web:'renkmatbaa.com',phone:'0 212 000 00 00',area:'Topkapı',addr:'Matbaacılar Sitesi No:18',cat:'Matbaa',
 news:['YENİ HİZMET','Aynı gün kartvizit','Sabah sipariş, akşam teslim','Sipariş ver'],disc:['%25','Broşür baskısında indirim','Bu hafta','Sipariş ver'],
 star:['1000 Kartvizit','350 gr, selofanlı','₺ 690','Aynı gün','Ücretsiz tasarım'],tipsT:'Baskı öncesi 3 öneri',tips:['Dosyayı CMYK hazırlayın','3 mm taşma payı bırakın','Yazıları kenardan uzak tutun','Logoyu vektör gönderin','Prova isteyin'],donts:['RGB dosya göndermek','Düşük çözünürlük','Taşmasız tasarım'],
 menuT:'Baskı fiyatları',items:[['Kartvizit (1000)','₺690'],['Broşür (1000)','₺1.900'],['Afiş (A2)','₺120'],['Etiket (1000)','₺850'],['Katalog','Teklif'],['Branda (m²)','₺220']],
 reviews:[['Kartvizitler aynı gün geldi.','Kafe Zeytin'],['Renkler ekrandakiyle aynı.','Norde Moda'],['Katalog baskımız kusursuzdu.','Ahşap Ev']],rakamT:'Rakamlarla Renk',stats:{n:'9.000+',nl:'firma',yr:'24',rt:4.8,rv:'620',x:'Aynı gün baskı'},
 ev:['Kurumsal Kimlik Haftası','25','KASIM','Topkapı','Teklif al'],hook:['Kartvizitin seni doğru anlatıyor mu?','İlk izlenim kâğıtta başlar.'],soon:['Online sipariş sitemiz geliyor','1 Aralık','YAKINDA'],close:'Baskı bizden, başarı sizden',
 offT:'İlk siparişe',code:'RENK15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Açılış paketleri','Başlangıç · ₺ 1.900','Esnaf · ₺ 3.900','Kurumsal · ₺ 7.900'],svc:['Hizmetlerimiz','Kartvizit','Broşür','Etiket','Branda'],
 steps:['Baskı 4 adımda','Dosyanı gönder','Prova onayı','Baskı','Kapına teslim'],draw:['1000 kartvizit kazan','Çekiliş 1 Aralık\'ta'],faq:['Tasarımım yok, ne yapmalıyım?','Ücretsiz tasarlıyoruz.','Kargo var mı?','Türkiye geneli kargo.'],
 near:['Topkapı tramvaya 3 dk','Kurye hizmeti'],team:[['Selim R.','Kurucu'],['Ece T.','Grafik tasarım'],['Hasan K.','Baskı ustası'],['Ozan D.','Kurye']],quote:'Her baskı, bir markanın ilk izlenimidir.',
 once:['Fikirden baskıya','Kurumsal kimlik'],yeni:['YENİ MAKİNE','Kabartma lak baskı','Dokunulası kartvizitler','Örnek iste'],hours:['Matbaa saatleri','Hafta içi · 08:00 – 19:00','Cumartesi · 09:00 – 15:00','Pazar · Kapalı','Online sipariş 7/24'],
 feats:['Aynı gün baskı','Ücretsiz tasarım','Renk garantisi','Kargo','Kurye','Prova onayı'],flasT:'Bu hafta etiket baskısında fırsat',anket:['Hangisi daha şık?','Mat','Parlak'],
 follow:['Baskı işlerimizi gör','Her gün yeni iş','400','9.600'],ozel:['Yeni işiniz hayırlı olsun','AÇILIŞ'],teslim:['Teslimat','Kurye ve kargo','Kartla ödeme','Hatalı baskı yeniden basılır'],
 randevu:['Teslim gününü seç','25','KASIM','10:00 · 14:00 · 18:00','Sipariş ver'],myth:['Dijital çağda basılı malzemeye gerek yok','Basılı kartvizit hâlâ en güçlü ilk izlenimdir'],
 hist:[['2002','İlk makine'],['2010','Ofset baskı'],['2019','Dijital baskı'],['2026','Lak baskı']],week:[['Pzt','Kartvizit'],['Sal','Broşür'],['Çar','Etiket'],['Per','Katalog'],['Cum','Branda']],
 prize:['1000 kartvizit','Etiket','%10 indirim','Afiş','Not defteri','Tekrar dene'],clients:['Kafe Zeytin','Norde Moda','Ahşap Ev','Diş Kliniği','Emlak Ofisi','Kreş Papatya'],words:['renk','kalite','hız','iz'],
 route:['Topkapı Tramvay','Renk Matbaa','3 dk'],prod:'1000 kartvizit',loyal:'5. siparişte %20',big:'BASKI',weather:'Yılbaşı takvimleri baskıda'});
addSector({n:'Catering & Ev Yemekleri',p:['#1E120A','#F4A259'],brand:'Anne Eli Catering',slogan:'Ev yemeği tadında',handle:'@anneelicatering',web:'anneeli.com',phone:'0 216 000 00 00',area:'Ataşehir',addr:'Barbaros Mah. No:9',cat:'Catering',
 news:['YENİ MENÜ','Haftalık ofis yemekleri','Her gün taze, her gün farklı','Teklif al'],disc:['%15','Ofis aboneliğinde indirim','İlk ay','Teklif al'],
 star:['Ofis Öğle Menüsü','Çorba, ana yemek, salata','₺ 240 / kişi','Günlük taze','Kapına teslim'],tipsT:'Davet planlarken 3 öneri',tips:['Misafir sayısını netleştirin','Alerjileri sorun','Vejetaryen seçenek ekleyin','Tatlıyı unutmayın','Bir hafta önce sipariş verin'],donts:['Son gün sipariş','Tek tip menü','Sıcak servisi unutmak'],
 menuT:'Menü fiyatları',items:[['Ofis menüsü','₺240'],['Kokteyl (kişi)','₺390'],['Doğum günü','₺450'],['Mantı (kg)','₺380'],['Sarma (kg)','₺420'],['Börek tepsisi','₺650']],
 reviews:[['Ofiste herkes yemeği bekliyor.','Kuzey Kreatif'],['Kızımın doğum günü çok lezzetliydi.','Ayşe K.'],['Sarmaları annemin ki gibi.','Murat T.']],rakamT:'Rakamlarla Anne Eli',stats:{n:'250.000+',nl:'porsiyon',yr:'9',rt:4.9,rv:'740',x:'Her gün taze'},
 ev:['Tadım Günü','29','KASIM','Ataşehir mutfak · 12:00','Katıl'],hook:['Ofiste her gün aynı fast food mu?','Ev yemeği masanıza gelsin.'],soon:['Diyet menümüz geliyor','1 Aralık','YAKINDA'],close:'Afiyet olsun',
 offT:'İlk siparişe',code:'ANNE10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Davet paketleri','20 kişi · ₺ 7.900','50 kişi · ₺ 17.900','100 kişi · ₺ 32.900'],svc:['Hizmetlerimiz','Ofis yemeği','Davet','Kokteyl','Ev yemekleri'],
 steps:['Sipariş 4 adımda','Menüyü seç','Kişi sayısı','Tarihi ayır','Sıcak teslim'],draw:['20 kişilik davet menüsü kazan','Çekiliş 1 Aralık\'ta'],faq:['Minimum sipariş var mı?','10 kişi.','Servis personeli var mı?','Evet, istek üzerine.'],
 near:['Ataşehir merkez','Anadolu yakası teslim'],team:[['Hatice A.','Aşçıbaşı'],['Zeynep K.','Pastacı'],['Ali T.','Lojistik'],['Seda D.','Sipariş']],quote:'Kendi sofranıza ne koyarsak, size de onu koyuyoruz.',
 once:['Boş masadan dolu sofraya','Davet hazırlığı'],yeni:['YENİ','Vegan menü','Bitkisel ve doyurucu','Tadım iste'],hours:['Sipariş saatleri','Hafta içi · 08:00 – 20:00','Cumartesi · 09:00 – 18:00','Pazar · Davetler için açık','Online sipariş 7/24'],
 feats:['Günlük taze','Ev usulü','Kapına teslim','Servis ekibi','Vegan seçenek','Hijyen belgesi'],flasT:'Bu hafta börek tepsisinde fırsat',anket:['Hangisi favorin?','Mantı','Sarma'],
 follow:['Günün menüsünü gör','Her gün yeni menü','620','24B'],ozel:['Ramazan Bayramınız mübarek olsun','BAYRAM'],teslim:['Teslimat','Sıcak teslim','Kapıda ödeme','Memnun kalmazsan iade'],
 randevu:['Davet tarihini seç','29','KASIM','12:00 · 15:00 · 19:00','Sipariş ver'],myth:['Catering yemeği ev yemeği gibi olmaz','Küçük partilerle pişen yemek ev tadını korur'],
 hist:[['2017','Ev mutfağı'],['2019','Ofis menüsü'],['2022','Profesyonel mutfak'],['2026','Vegan menü']],week:[['Pzt','Kuru fasulye'],['Sal','Mantı'],['Çar','Karnıyarık'],['Per','Etli dolma'],['Cum','Balık']],
 prize:['Davet menüsü','Börek tepsisi','%10 indirim','Tatlı','Sarma 1 kg','Tekrar dene'],clients:['Kuzey Kreatif','Ofis Plaza','Kreş Papatya','Düğün Salonu','Spor Kulübü','Diş Kliniği'],words:['taze','sıcak','ev usulü','bereket'],
 route:['Mutfağımız','Masanız','Sıcak teslim'],prod:'Ofis öğle menüsü',loyal:'10. siparişte tatlı bizden',big:'SOFRA',weather:'Soğuk günlere sıcak çorba'});
addSector({n:'Gelinlik & Abiye',p:['#1B1418','#F2C6D2'],brand:'Beyaz Masal Gelinlik',slogan:'Hayalinizdeki o gün',handle:'@beyazmasal',web:'beyazmasal.com',phone:'0 212 000 00 00',area:'Fatih',addr:'Laleli Gelinlik Sokağı No:5',cat:'Gelinlik',
 news:['YENİ KOLEKSİYON','2027 gelinlik koleksiyonu','Zarif, hafif, sizin için','Prova ayarla'],disc:['%20','Sezon sonu abiye indirimi','Bu ay','Uğra'],
 star:['Prenses Gelinlik','Tül, el işlemesi','₺ 39.900','Ölçüye uyarlama','Kiralama seçeneği'],tipsT:'Gelinlik seçerken 3 öneri',tips:['6 ay önceden başlayın','Mekâna uygun model seçin','Rahat edeceğinizden emin olun','Ayakkabıyla prova yapın','Az kişiyle gidin'],donts:['Son ay gelinlik aramak','Trend için konforsuzluk','Çok fikir almak'],
 menuT:'Fiyat listesi',items:[['Gelinlik satış','₺39.900'],['Gelinlik kiralama','₺14.900'],['Abiye','₺6.900'],['Nişanlık','₺9.900'],['Duvak','₺2.400'],['Tadilat','Dahil']],
 reviews:[['Gelinliğimde kendimi prenses gibi hissettim.','Ece & Kaan'],['Tadilat kusursuzdu.','Merve A.'],['Nişanlığım herkesin dilindeydi.','Selin K.']],rakamT:'Rakamlarla Beyaz Masal',stats:{n:'6.000+',nl:'mutlu gelin',yr:'18',rt:4.9,rv:'880',x:'Ölçüye uyarlama dahil'},
 ev:['Gelin Günleri','6','ARALIK','Fatih showroom · 11:00','Prova ayarla'],hook:['Gelinliği hâlâ bulamadın mı?','Doğru gelinlik provada belli olur.'],soon:['Nişantaşı mağazamız açılıyor','Ocak 2027','YAKINDA'],close:'Mutluluklar dileriz',
 offT:'İlk provaya',code:'MASAL10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Gelin paketleri','Kiralama · ₺ 14.900','Satış · ₺ 39.900','Tam set · ₺ 49.900'],svc:['Koleksiyonlarımız','Gelinlik','Nişanlık','Abiye','Aksesuar'],
 steps:['Gelinlik 4 adımda','Prova randevusu','Model seçimi','Ölçü ve uyarlama','Teslim'],draw:['Duvak ve taç seti kazan','Çekiliş 1 Aralık\'ta'],faq:['Kiralama mümkün mü?','Evet, tüm modellerde.','Tadilat ücretli mi?','Hayır, dahil.'],
 near:['Laleli tramvaya 2 dk','Otopark anlaşmalı'],team:[['Nermin K.','Tasarımcı'],['Ayla T.','Prova uzmanı'],['Usta Rıza','Terzi'],['Defne A.','Stil danışmanı']],quote:'Her gelin, kendi masalının kahramanıdır.',
 once:['İlk provadan büyük güne','Gelinimizin yolculuğu'],yeni:['YENİ KOLEKSİYON','Minimal saten gelinlikler','Modern gelinler için','Prova ayarla'],hours:['Mağaza saatleri','Hafta içi · 10:00 – 20:00','Cumartesi · 10:00 – 20:00','Pazar · 11:00 – 18:00','Provalar randevuyla'],
 feats:['Ölçüye uyarlama','Kiralama','Özel tasarım','Stil danışmanlığı','Aksesuar','Taksit'],flasT:'Bu hafta abiyelerde indirim',anket:['Hangisi daha güzel?','Prenses','Balık'],
 follow:['Gelinlerimizi gör','Her gün yeni gelin','900','58B'],ozel:['Sevgililer Günü kutlu olsun','14 ŞUBAT'],teslim:['Güvence','Ücretsiz tadilat','Taksitli ödeme','Düğün gününe kadar destek'],
 randevu:['Prova günü ayarla','6','ARALIK','11:00 · 14:00 · 17:00','Randevu al'],myth:['Kiralık gelinlik özel hissettirmez','Ölçüye uyarlanan kiralık gelinlik size özel olur'],
 hist:[['2008','Atölye açıldı'],['2014','Abiye koleksiyonu'],['2020','Özel tasarım'],['2026','Nişantaşı']],week:[['Pzt','Kapalı prova'],['Sal','Gelinlik'],['Çar','Abiye'],['Per','Nişanlık'],['Cmt','Gelin günü']],
 prize:['Duvak','Taç','%10 indirim','Gelin buketi','Kuaför çeki','Tekrar dene'],clients:['Kare Stüdyo','Düğün Salonu','Lavanta Çiçek','Gelin Kuaförü','Otel Balo','Organizasyon Evi'],words:['zarafet','hayal','ışıltı','an'],
 route:['Laleli Tramvay','Beyaz Masal','2 dk'],prod:'Prenses gelinlik',loyal:'Gelinliğe abiye %20',big:'GELİN',weather:'Kış gelinlerine uzun kollu modeller'});
addSector({n:'Araç Kiralama',p:['#0A1426','#3DDC97'],brand:'Yolcu Rent a Car',slogan:'Yola çıkmanın kolay yolu',handle:'@yolcurent',web:'yolcurent.com',phone:'0 850 000 00 00',area:'Havalimanı',addr:'Sabiha Gökçen Dış Hatlar',cat:'Araç kiralama',
 news:['YENİ FİLO','2026 model elektrikli araçlar','Sessiz, ekonomik, temiz','Rezervasyon yap'],disc:['%20','Haftalık kiralamada indirim','Bu ay','Rezervasyon yap'],
 star:['Ekonomik Sınıf','Dizel, manuel, klimalı','₺ 1.290 / gün','Kasko dahil','Sınırsız km'],tipsT:'Araç kiralarken 3 öneri',tips:['Teslimde fotoğraf çekin','Yakıt seviyesini kontrol edin','Sigortayı okuyun','Erken rezervasyon yapın','Bebek koltuğunu önceden isteyin'],donts:['Hasarı kayda geçirmemek','Boş depoyla iade','Başkasına kullandırmak'],
 menuT:'Günlük fiyatlar',items:[['Ekonomik','₺1.290'],['Orta sınıf','₺1.790'],['SUV','₺2.690'],['Elektrikli','₺2.290'],['Minivan','₺2.990'],['Bebek koltuğu','₺150']],
 reviews:[['Havalimanında 5 dakikada teslim aldım.','Kerem T.'],['Araç tertemiz ve yeniydi.','Ayşe D.'],['Fiyat şeffaf, sürpriz yok.','Murat K.']],rakamT:'Rakamlarla Yolcu',stats:{n:'38.000+',nl:'kiralama',yr:'12',rt:4.8,rv:'2.300',x:'7/24 yol yardımı'},
 ev:['Yılbaşı Erken Rezervasyon','31','ARALIK','Tüm şubeler','Rezervasyon yap'],hook:['Tatilde araç kiralamak pahalı mı?','Erken rezervasyonla değil.'],soon:['İzmir Havalimanı şubesi','Ocak 2027','YAKINDA'],close:'İyi yolculuklar',
 offT:'İlk kiralamaya',code:'YOLCU10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Kiralama paketleri','Hafta sonu · ₺ 3.490','Haftalık · ₺ 7.900','Aylık · ₺ 24.900'],svc:['Araç sınıfları','Ekonomik','SUV','Elektrikli','Minivan'],
 steps:['Kiralama 4 adımda','Aracı seç','Tarihleri gir','Online öde','Teslim al'],draw:['Hafta sonu ücretsiz araç kazan','Çekiliş 1 Aralık\'ta'],faq:['Depozito alıyor musunuz?','Kredi kartına provizyon.','Kaç yaşında kiralanır?','21 yaş, 2 yıl ehliyet.'],
 near:['Havalimanında karşılama','Otele teslim'],team:[['Hakan Y.','Operasyon'],['Seda K.','Rezervasyon'],['Ali T.','Teslimat'],['Can D.','Yol yardımı']],quote:'Anahtarı verdiğimiz an, tatiliniz başlar.',
 once:['Kuyruktan 5 dakikalık teslime','Online check-in'],yeni:['YENİ','Elektrikli araç filosu','Ücretsiz şarj kartı','Rezervasyon yap'],hours:['Şube saatleri','Havalimanı · 7/24','Şehir ofisi · 08:00 – 22:00','Pazar · 09:00 – 20:00','Online rezervasyon 7/24'],
 feats:['Kasko dahil','Sınırsız km','7/24 yol yardımı','Havalimanı teslim','Elektrikli araç','Şeffaf fiyat'],flasT:'Bu hafta SUV kiralamada fırsat',anket:['Hangisini seçerdin?','SUV','Elektrikli'],
 follow:['Yol rotaları için takip et','Her hafta yeni rota','260','15B'],ozel:['Bayramda iyi yolculuklar','BAYRAM'],teslim:['Güvence','Kasko dahil','Online ödeme','Ücretsiz iptal'],
 randevu:['Teslim gününü seç','31','ARALIK','08:00 · 12:00 · 18:00','Rezervasyon yap'],myth:['Kiralık araçta gizli ücret çoktur','Tüm ücretler rezervasyonda net görünür'],
 hist:[['2014','İlk 10 araç'],['2018','Havalimanı şubesi'],['2022','Online rezervasyon'],['2026','Elektrikli filo']],week:[['Pzt','İş seyahati'],['Çar','Şehir içi'],['Cum','Hafta sonu kaçamağı'],['Cmt','Tatil'],['Paz','İade günü']],
 prize:['Hafta sonu araç','Bebek koltuğu','%10 indirim','Yakıt kartı','Navigasyon','Tekrar dene'],clients:['Seyahat Acentesi','Butik Otel','Ofis Plaza','Fuar Merkezi','Düğün Salonu','Yatçılık'],words:['özgürlük','yol','konfor','güven'],
 route:['Havalimanı','Yolcu Rent a Car','5 dk teslim'],prod:'SUV kiralama',loyal:'5. kiralamada 1 gün bedava',big:'YOL',weather:'Kış lastikli araçlar hazır'});
addSector({n:'Seyahat Acentesi',p:['#062A3D','#FFC857'],brand:'Pusula Turizm',slogan:'Dünyayı birlikte keşfedelim',handle:'@pusulaturizm',web:'pusulaturizm.com',phone:'0 850 000 00 00',area:'Şişli',addr:'Halaskargazi Cad. No:110',cat:'Seyahat acentesi',
 news:['YENİ TUR','Kapadokya balon turu','2 gece, rehberli','Yer ayırt'],disc:['%20','Erken rezervasyon indirimi','31 Aralık\'a kadar','Yer ayırt'],
 star:['Kapadokya Turu','2 gece otel, rehber','₺ 8.900 / kişi','Kahvaltı dahil','Ulaşım dahil'],tipsT:'Tatil planlarken 3 öneri',tips:['Erken rezervasyon yapın','Pasaport süresini kontrol edin','Seyahat sigortası alın','Hafif çanta hazırlayın','Yerel yemekleri deneyin'],donts:['Son dakika vize başvurusu','Sigortasız seyahat','Pasaportu bavula koymak'],
 menuT:'Tur fiyatları',items:[['Kapadokya','₺8.900'],['Karadeniz','₺11.900'],['Roma','€690'],['Balkanlar','€590'],['Mısır','€790'],['Vize hizmeti','₺1.500']],
 reviews:[['Her şey dakikası dakikasına planlıydı.','Ayşe & Murat'],['Rehberimiz harikaydı.','Elif T.'],['Balayımızı kusursuz organize ettiler.','Selin & Kaan']],rakamT:'Rakamlarla Pusula',stats:{n:'60.000+',nl:'mutlu gezgin',yr:'20',rt:4.8,rv:'1.640',x:'40 ülke'},
 ev:['Balayı Fuarı','14','ŞUBAT','Şişli ofis · 11:00','Katıl'],hook:['Bu yıl da tatili erteledin mi?','Erken rezervasyonla bütçen yeter.'],soon:['Japonya turu geliyor','Nisan 2027','YAKINDA'],close:'Yolunuz açık olsun',
 offT:'İlk turuna',code:'PUSULA10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Tatil paketleri','Hafta sonu · ₺ 4.900','Yurt içi · ₺ 11.900','Yurt dışı · €690'],svc:['Hizmetlerimiz','Yurt içi tur','Yurt dışı tur','Balayı','Vize'],
 steps:['Tatil 4 adımda','Rotanı seç','Tarihi ayır','Vize ve evrak','Yola çık'],draw:['2 kişilik Kapadokya turu kazan','Çekiliş 1 Aralık\'ta'],faq:['Vizeyi siz mi hallediyorsunuz?','Evet, danışmanlık veriyoruz.','Taksit var mı?','9 taksit.'],
 near:['Şişli metroya 2 dk','Online görüşme'],team:[['Emre P.','Kurucu'],['Defne K.','Tur planlama'],['Can A.','Rehber'],['Seda T.','Vize']],quote:'Biz bilet değil, hatıra satıyoruz.',
 once:['Hayalden pasaport damgasına','Gezginimizin rotası'],yeni:['YENİ ROTA','Kuzey ışıkları turu','Norveç · Şubat','Yer ayırt'],hours:['Ofis saatleri','Hafta içi · 09:00 – 19:00','Cumartesi · 10:00 – 17:00','Pazar · Kapalı','Acil hat 7/24'],
 feats:['Rehberli turlar','Vize danışmanlığı','9 taksit','Seyahat sigortası','Balayı paketleri','7/24 destek'],flasT:'Bu hafta Balkan turlarında fırsat',anket:['Hangisi daha cazip?','Deniz','Şehir turu'],
 follow:['Rotalar için takip et','Her hafta yeni rota','480','33B'],ozel:['Dünya Turizm Günü kutlu olsun','27 EYLÜL'],teslim:['Güvence','TÜRSAB belgeli','Taksitli ödeme','Ücretsiz iptal seçeneği'],
 randevu:['Tatil görüşmesi ayarla','14','ŞUBAT','11:00 · 14:00 · 17:00','Randevu al'],myth:['Acenteyle gitmek daha pahalıdır','Toplu anlaşmalar çoğu zaman daha uygun fiyat sağlar'],
 hist:[['2006','Acente kuruldu'],['2012','Yurt dışı turlar'],['2019','Balayı birimi'],['2026','Japonya']],week:[['Pzt','Vize başvuruları'],['Sal','Yurt içi'],['Çar','Yurt dışı'],['Per','Balayı'],['Cum','Hafta sonu turları']],
 prize:['Kapadokya turu','Valiz','%10 indirim','Seyahat yastığı','Pasaport kılıfı','Tekrar dene'],clients:['Kuzey Kreatif','Okul Kent','Üniversite','Emekliler Derneği','Ofis Plaza','Spor Kulübü'],words:['keşif','macera','huzur','hatıra'],
 route:['İstanbul','Kapadokya','1 saat uçuş'],prod:'Kapadokya turu',loyal:'3. turda %15',big:'GEZ',weather:'Kış güneşine Mısır turu'});
addSector({n:'Hırdavat & Yapı Market',p:['#1A1A1A','#FFB703'],brand:'Usta Yapı Market',slogan:'Her işe doğru malzeme',handle:'@ustayapimarket',web:'ustayapi.com',phone:'0 224 000 00 00',area:'Nilüfer',addr:'Sanayi Cad. No:44',cat:'Yapı market',
 news:['YENİ REYON','Akülü el aletleri','Dünya markaları bir arada','Mağazaya gel'],disc:['%25','Boya ürünlerinde indirim','Bu hafta','Mağazaya gel'],
 star:['Akülü Matkap Seti','18V, 2 akü, çanta','₺ 3.490','2 yıl garanti','Ücretsiz kargo'],tipsT:'Boya yaparken 3 öneri',tips:['Duvarı önce zımparalayın','Astar kullanın','Kenarları bantlayın','İki kat sürün','Havalandırın'],donts:['Astarsız boya','Nemli duvara boya','Tek kat bırakmak'],
 menuT:'Haftanın fiyatları',items:[['Akülü matkap','₺3.490'],['Duvar boyası 15 L','₺1.290'],['Vida seti','₺190'],['Silikon','₺85'],['Merdiven','₺1.490'],['Alet çantası','₺690']],
 reviews:[['Aradığım her şey tek yerde.','Hakan U.'],['Personel çok bilgili.','Ayşe T.'],['Fiyatlar internetle aynı.','Kemal D.']],rakamT:'Rakamlarla Usta Yapı',stats:{n:'25.000+',nl:'ürün',yr:'30',rt:4.7,rv:'1.120',x:'Aynı gün teslim'},
 ev:['Usta Günleri','30','KASIM','Nilüfer mağaza · 10:00','Gel'],hook:['Bir vida için 3 dükkân mı geziyorsun?','25.000 ürün tek çatı altında.'],soon:['Osmangazi mağazamız açılıyor','Ocak 2027','YAKINDA'],close:'Kolay gelsin',
 offT:'İlk alışverişe',code:'USTA15',off:'%15',validity:'Ay sonuna kadar geçerli',pk:['Usta paketleri','Boya seti · ₺ 1.900','Tadilat seti · ₺ 3.900','Atölye seti · ₺ 7.900'],svc:['Reyonlarımız','El aletleri','Boya','Tesisat','Bahçe'],
 steps:['Sipariş 4 adımda','Ürünü seç','Sepete ekle','Öde','Aynı gün teslim'],draw:['Akülü matkap seti kazan','Çekiliş 1 Aralık\'ta'],faq:['Kargo var mı?','Bursa içi aynı gün.','Kurumsal fatura?','Evet.'],
 near:['Otopark ücretsiz','Kurye teslimat'],team:[['Kemal U.','Kurucu'],['Hasan D.','Boya uzmanı'],['Ayşe T.','Tesisat'],['Ozan K.','Kasa']],quote:'Doğru malzeme, işin yarısıdır.',
 once:['Eski balkon, yeni hayat','Kendin yap projesi'],yeni:['YENİ GELDİ','Akıllı ev ürünleri','Priz, lamba, kamera','İncele'],hours:['Mağaza saatleri','Hafta içi · 08:00 – 20:00','Cumartesi · 08:00 – 20:00','Pazar · 10:00 – 18:00','Online sipariş 7/24'],
 feats:['25.000 ürün','Uzman personel','Aynı gün teslim','Kurumsal fatura','Ücretsiz otopark','2 yıl garanti'],flasT:'Bu hafta boyada büyük indirim',anket:['Hangisi daha kullanışlı?','Akülü','Kablolu'],
 follow:['Kendin yap videoları','Her hafta yeni proje','310','12B'],ozel:['Babalar Günü kutlu olsun','BABAM'],teslim:['Teslimat','Aynı gün teslim','Kapıda ödeme','14 gün iade'],
 randevu:['Teslim gününü seç','30','KASIM','10:00 · 14:00 · 18:00','Sipariş ver'],myth:['Pahalı boya her zaman daha iyidir','Doğru astar ve uygulama daha çok fark yaratır'],
 hist:[['1996','Hırdavat dükkânı'],['2008','Yapı market'],['2020','Online satış'],['2026','Osmangazi']],week:[['Pzt','Boya günü'],['Sal','El aletleri'],['Çar','Tesisat'],['Per','Elektrik'],['Cmt','Bahçe']],
 prize:['Akülü matkap','Alet çantası','%10 indirim','Vida seti','Metre','Tekrar dene'],clients:['Usta Burada','Ahşap Ev','Site Yönetimi','İnşaat AŞ','Peyzaj Ekibi','Belediye'],words:['sağlam','pratik','usta','kalite'],
 route:['Nilüfer Sanayi','Usta Yapı Market','Ücretsiz otopark'],prod:'Akülü matkap seti',loyal:'Usta kartında %10',big:'USTA',weather:'Kışa hazırlık: izolasyon ürünleri'});
addSector({n:'Kasap & Et Ürünleri',p:['#220A0A','#E63946'],brand:'Bereket Kasabı',slogan:'Güvenilir et, helal kazanç',handle:'@bereketkasabi',web:'bereketkasap.com',phone:'0 322 000 00 00',area:'Seyhan',addr:'Kuruköprü Mah. No:7',cat:'Kasap',
 news:['YENİ ÜRÜN','Kuru dinlendirilmiş antrikot','21 gün dinlendirildi','Sipariş ver'],disc:['%15','Kıyma çeşitlerinde indirim','Bu hafta','Uğra'],
 star:['Dana Antrikot','Kuru dinlendirilmiş','₺ 1.290 / kg','Yerli besi','Aynı gün kesim'],tipsT:'Et pişirirken 3 öneri',tips:['Eti oda sıcaklığına getirin','Tavayı iyice ısıtın','Pişince 5 dk dinlendirin','Tuzu pişmeden önce atın','Lif yönüne ters kesin'],donts:['Soğuk eti tavaya atmak','Sık çevirmek','Hemen kesmek'],
 menuT:'Günün fiyatları',items:[['Dana kıyma','₺690'],['Kuzu pirzola','₺1.190'],['Antrikot','₺1.290'],['Kuşbaşı','₺790'],['Köfte','₺650'],['Sucuk','₺890']],
 reviews:[['Etin kalitesi ilk lokmada belli.','Mehmet K.'],['Köfteleri efsane.','Ayşe D.'],['Mangal için hep buradan alıyoruz.','Burak T.']],rakamT:'Rakamlarla Bereket',stats:{n:'15.000+',nl:'aile',yr:'40',rt:4.9,rv:'980',x:'Yerli besi'},
 ev:['Mangal Sezonu Açılışı','1','MAYIS','Seyhan dükkân','Gel'],hook:['Kıymanın içinde ne olduğunu biliyor musun?','Biz gözünüzün önünde çekiyoruz.'],soon:['Çukurova şubemiz açılıyor','Ocak 2027','YAKINDA'],close:'Afiyet olsun',
 offT:'İlk siparişe',code:'BEREKET10',off:'%10',validity:'Ay sonuna kadar geçerli',pk:['Mangal paketleri','2 kişilik · ₺ 1.490','4 kişilik · ₺ 2.790','8 kişilik · ₺ 5.290'],svc:['Ürünlerimiz','Dana','Kuzu','Şarküteri','Mangal'],
 steps:['Sipariş 4 adımda','Ürünü seç','Kesimi belirle','Paketleme','Kapına teslim'],draw:['Mangal paketi kazan','Çekiliş 1 Aralık\'ta'],faq:['Etler yerli mi?','Evet, yerli besi.','Eve teslim var mı?','Seyhan içi aynı gün.'],
 near:['Kuruköprü\'ye 3 dk','Otopark var'],team:[['Usta Halil','Kasap'],['Mehmet B.','Şarküteri'],['Ali K.','Kesim'],['Zeynep T.','Sipariş']],quote:'Dedemden kalan terazi, hâlâ doğru tartar.',
 once:['Bütün parçadan tabağa','Ustalık işi kesim'],yeni:['YENİ','Ev yapımı sucuk','Katkısız, baharatlı','Tadına bak'],hours:['Dükkân saatleri','Hafta içi · 07:30 – 20:00','Cumartesi · 07:30 – 20:00','Pazar · 08:00 – 14:00','Telefonla sipariş'],
 feats:['Yerli besi','Gözünüz önünde kıyma','Aynı gün teslim','Kesim isteğe göre','Hijyen belgeli','40 yıllık usta'],flasT:'Bu hafta mangal paketlerinde fırsat',anket:['Mangalda favorin?','Köfte','Pirzola'],
 follow:['Ustanın tarifleri','Her hafta yeni tarif','240','16B'],ozel:['Kurban Bayramınız mübarek olsun','BAYRAM'],teslim:['Teslimat','Aynı gün teslim','Kapıda ödeme','Soğuk zincir paketleme'],
 randevu:['Teslim gününü seç','30','KASIM','10:00 · 14:00 · 18:00','Sipariş ver'],myth:['Et ne kadar kırmızıysa o kadar tazedir','Dinlendirilmiş et daha koyu ama daha lezzetlidir'],
 hist:[['1986','Dükkân açıldı'],['2001','Şarküteri bölümü'],['2018','Eve teslim'],['2026','Dinlendirme dolabı']],week:[['Pzt','Kıyma günü'],['Çar','Kuzu'],['Per','Köfte'],['Cum','Mangal'],['Cmt','Sucuk']],
 prize:['Mangal paketi','1 kg köfte','%10 indirim','Sucuk','Baharat seti','Tekrar dene'],clients:['Ocakbaşı Lezzet','Restoran Adana','Otel Seyhan','Catering','Düğün Salonu','Kafe Zeytin'],words:['taze','helal','usta','lezzet'],
 route:['Kuruköprü','Bereket Kasabı','3 dk'],prod:'Dana antrikot',loyal:'10. siparişte köfte bizden',big:'ET',weather:'Soğuk günlere kemik suyu'});

// [yeni-meslekler-son]
// ===== Sektör motoru 3: 9 yeni reklam türü + her şablona birbirinden belirgin farklı 4 stil =====
// Stiller: Gece (koyu, marka rengi) · Açık (kâğıt tonları) · Canlı (doygun renk, sıkışık büyük harf) · Kart (çerçeveli poster)
const DARKP=[['Gece','#0D0E12','#FF5C7A'],['Altın','#14110B','#E8C07D'],['Okyanus','#0B1E2D','#38BDF8'],['Orman','#0F1F17','#7BD389'],['Lila','#17122A','#B794F4'],['Mercan','#1A1012','#FF7A59'],['Limon','#121410','#D4FF3D'],['Bordo','#2A0E14','#F6C1C7'],['Lacivert','#0F1B3D','#FFC857'],['Grafit','#1C1D21','#F5F5F0'],['Turkuaz','#06282A','#2DD4BF'],['Patlıcan','#1E0F24','#FF9F1C']];
const LIGHTP=[['Kâğıt','#F2EEE6','#1F2A44'],['Krem','#F6F0E4','#C2410C'],['Buz','#EEF3F8','#2563EB'],['Pudra','#FCE7EF','#BE185D'],['Kum','#EFE6D8','#7C5A3A'],['Kar','#FAFAF7','#111111'],['Nane','#E8F5EE','#0F766E'],['Lavanta','#F1EEFB','#6D28D9']];
const VIVIDP=[['Portakal','#FF6B1A','#111111'],['Güneş','#FFD60A','#111111'],['Kırmızı','#D7263D','#FFFFFF'],['Elektrik','#2F3BFF','#FFE14D'],['Zümrüt','#0E9F6E','#FFFFFF'],['Fuşya','#E11D74','#FFF1F6'],['Mor','#6D28D9','#FDE68A'],['Gök','#0EA5E9','#0B1220']];
const STN=['Gece','Açık','Canlı','Kart'];
const DUO=[['Mavi','#2F3BFF','#0B1020'],['Turuncu','#FF6B1A','#1A0B05'],['Yeşil','#14C38E','#06130D'],['Pembe','#E11D74','#14050C'],['Altın','#E8B04B','#140F05'],['Mor','#7C5CFF','#0B0716']];
function duoWrap(c,t,f,duo,inner,self){const cw=c.canvas.width,ch=c.canvas.height;if(!self._oc||self._oc.width!==cw||self._oc.height!==ch){self._oc=document.createElement('canvas');self._oc.width=cw;self._oc.height=ch}const o=self._oc.getContext('2d');
 o.setTransform(1,0,0,1,0,0);o.clearRect(0,0,cw,ch);o.setTransform(c.getTransform());o.globalAlpha=1;o.textAlign='left';o.textBaseline='alphabetic';const save=c;
 inner(o);c.save();c.setTransform(1,0,0,1,0,0);c.fillStyle=duo[2];c.fillRect(0,0,cw,ch);if('filter' in c)c.filter='grayscale(1) contrast(1.25) brightness(1.05)';c.drawImage(self._oc,0,0);c.filter='none';
 c.globalCompositeOperation='multiply';c.fillStyle=duo[1];c.fillRect(0,0,cw,ch);c.globalCompositeOperation='screen';c.globalAlpha=.18;c.fillStyle=duo[1];c.fillRect(0,0,cw,ch);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.restore()}

function cardWrap(c,t,f,inner){const k=.86,cw=W*k,ch=H*k,x0=(W-cw)/2,y0=(H-ch)/2;const oc=onColor(f.a);
 c.fillStyle=f.a;c.fillRect(0,0,W,H);c.save();c.globalAlpha=.09;c.strokeStyle=oc;c.lineWidth=2;const o=(t*30)%48;c.beginPath();for(let x=-H+o;x<W+H;x+=48){c.moveTo(x,0);c.lineTo(x+H*.6,H)}c.stroke();c.restore();
 [[x0+30,y0-38],[x0+70,y0-38],[x0+110,y0-38]].forEach(([x,y],i)=>{c.beginPath();c.arc(x,y,9,0,Math.PI*2);c.fillStyle=oc;c.globalAlpha=i===0?.8:.35;c.fill()});c.globalAlpha=1;
 const e=eback(clamp(prog(t,0,.7)));const s=.9+.1*clamp(e,0,1.05);c.save();c.translate(W/2,H/2);c.scale(s,s);c.rotate((1-clamp(e))*-.04);c.translate(-W/2,-H/2);
 c.save();c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=60;c.shadowOffsetY=24;rr(c,x0,y0,cw,ch,64);c.fillStyle=f.p;c.fill();c.restore();
 c.save();rr(c,x0,y0,cw,ch,64);c.clip();c.translate(x0,y0);c.scale(k,k);inner();c.restore();
 rr(c,x0,y0,cw,ch,64);c.strokeStyle=lum(f.a)>.45?'rgba(0,0,0,.25)':'rgba(255,255,255,.3)';c.lineWidth=3;c.stroke();c.restore()}
function deco4(c,t,f){const col=fgA(f.p,.22);c.save();c.globalAlpha=eo(prog(t,.2,1));c.strokeStyle=col;c.lineWidth=2;c.strokeRect(44,44,W-88,H-88);c.strokeRect(58,58,W-116,H-116);c.fillStyle=f.a;[[44,44],[W-44,44],[44,H-44],[W-44,H-44]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,7,0,Math.PI*2);c.fill()});c.restore()}

const ARCH3={
saat:{n:'Çalışma Saatleri',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3],sub:x[4]}),labels:{title:'Başlık',d1:'Satır 1 (gün · saat)',d2:'Satır 2',d3:'Satır 3',sub:'Not'},max:{d1:40,d2:40,d3:40,sub:60},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Satırlar',1,2.2],['Saat',1.6,7],['Not',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p),x=AX(st);gTxt(c,f.title,x,380,92,.2,t,st,fg,{l:2});
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const pr=String(s).split('·').map(z=>z.trim());const y=700+i*190;const e=eo(prog(t,1+i*.22,1.6+i*.22));if(e<=0)return;c.globalAlpha=e;const dx=(1-e)*-80;
   c.font=font(700,50,BODY);c.fillStyle=fg;c.textAlign='left';c.fillText(pr[0],90+dx,y);const lw=c.measureText(pr[0]).width;
   const tm=pr[1]||'';const kapali=/kapal/i.test(tm);c.font=font(900,84,COND);c.textAlign='right';c.fillStyle=kapali?fgA(f.p,.45):f.a;c.fillText(tm,W-90-dx,y+8);const tw=c.measureText(tm).width;c.textAlign='left';
   c.fillStyle=fgA(f.p,.3);for(let xx=110+lw;xx<W-110-tw;xx+=22){c.beginPath();c.arc(xx,y-14,3,0,Math.PI*2);c.fill()}
   c.fillStyle=fgA(f.p,.1);c.fillRect(90,y+50,W-180,2);c.globalAlpha=1});
  const ce=eback(clamp(prog(t,1.6,2.2)));if(ce>0){const cx=W/2,cy=1500,r=130;c.save();c.translate(cx,cy);c.scale(ce,ce);c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fillStyle=fgA(f.p,.06);c.fill();c.strokeStyle=f.a;c.lineWidth=8;c.stroke();
   for(let i=0;i<12;i++){const a=i*Math.PI/6;c.fillStyle=fg;c.beginPath();c.arc(Math.cos(a)*(r-26),Math.sin(a)*(r-26),i%3?3:6,0,Math.PI*2);c.fill()}
   const hm=t*1.4,hh=t*.12;c.lineCap='round';c.strokeStyle=fg;c.lineWidth=10;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(hh)*62,-Math.cos(hh)*62);c.stroke();c.strokeStyle=f.a;c.lineWidth=6;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(hm)*98,-Math.cos(hm)*98);c.stroke();c.beginPath();c.arc(0,0,12,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.lineCap='butt';c.restore()}
  gSmall(c,f.sub,W/2,1730,40,2.4,t,fgA(f.p,.75),'center',900,1,600);logoCorner(c,A,t,2.6,W-150,170,120)}},
kiyas:{n:'Biz ve Diğerleri',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3],sub:x[4]}),labels:{title:'Başlık',d1:'Fark 1',d2:'Fark 2',d3:'Fark 3',sub:'Marka adı (sütun başlığı)'},max:{sub:14},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Sütunlar',.9,1.4],['Farklar',1.3,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p),x=AX(st);gTxt(c,f.title,x,380,90,.2,t,st,fg,{l:2});const c1=700,c2=930,hy=640;
  const he=eo(prog(t,.9,1.4));c.globalAlpha=he;const nm=String(f.sub||'BİZ').toLocaleUpperCase('tr');c.font=font(800,30,BODY);const nw=Math.min(240,c.measureText(nm).width+44);rr(c,c1-nw/2,hy-44,nw,64,32);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.font=font(800,fitFont(c,nm,nw-30,30,18,800,BODY),BODY);c.fillText(nm,c1,hy-2);
  c.font=font(700,26,MONO);c.fillStyle=fgA(f.p,.55);c.fillText('DİĞERLERİ',c2,hy-2);c.textAlign='left';c.globalAlpha=1;
  c.fillStyle=mix(f.a,f.p,.85);c.globalAlpha=.6*he;rr(c,c1-110,hy+40,220,3*230+20,30);c.fill();c.globalAlpha=1;
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const y=hy+150+i*230;const e=eo(prog(t,1.3+i*.4,1.9+i*.4));if(e<=0)return;c.globalAlpha=e;c.font=font(700,46,BODY);c.fillStyle=fg;wrap(c,s,480,2).forEach((l,j)=>c.fillText(l,80+(1-e)*-40,y+j*56-(wrap(c,s,480,2).length-1)*28));
   const k=clamp(eback(prog(t,1.5+i*.4,2+i*.4)),0,1.2);c.save();c.translate(c1,y-14);c.scale(k,k);c.beginPath();c.arc(0,0,46,0,Math.PI*2);c.fillStyle=f.a;c.fill();icon(c,'check',0,0,56,onColor(f.a),5);c.restore();
   c.save();c.translate(c2,y-14);c.strokeStyle=fgA(f.p,.4);c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(-22,-22);c.lineTo(22,22);c.moveTo(22,-22);c.lineTo(-22,22);c.stroke();c.restore();c.globalAlpha=1;
   c.fillStyle=fgA(f.p,.08);c.fillRect(80,y+80,W-160,2)});logoCorner(c,A,t,2.6,W/2,H-150,120)}},
flas:{n:'Flaş İndirim',dur:6,map:x=>({d1:x[0],title:x[1],d2:x[2],cta:x[3]}),labels:{d1:'İndirim',title:'Başlık',d2:'Süre',cta:'Çağrı'},max:{d1:6,d2:16},
 tracks:[['Zemin',0,6,1],['Şeritler',0,6],['Başlık',.4,1.2],['İndirim',.9,1.5],['Süre',1.6,2.2],['Çağrı',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const band=(y,rot,dir,colB,colT)=>{c.save();c.translate(W/2,y);c.rotate(rot);c.fillStyle=colB;c.fillRect(-W,-62,W*2,124);c.font=font(900,74,COND);c.fillStyle=colT;c.textBaseline='middle';const word='FLAŞ İNDİRİM  ✦  ';const ww=c.measureText(word).width;const o=((t*260*dir)%ww+ww)%ww;for(let x=-W-ww+o;x<W+ww;x+=ww)c.fillText(word,x,4);c.textBaseline='alphabetic';c.restore()};
  const be=eio(prog(t,0,.6));c.save();c.globalAlpha=be;band(250,-.09,1,f.a,onColor(f.a));band(H-250,.07,-1,fg,f.p);c.restore();
  c.textAlign='center';gTxt(c,f.title,W/2,560,76,.4,t,{...st,align:'center'},fg,{align:'center',l:2});
  const s=clamp(eback(prog(t,.9,1.5)),0,1.15);c.save();c.translate(W/2,1080);c.scale(s,s);c.rotate(-.05);const sz=fitFont(c,String(f.d1),940,420,160);c.font=font(900,sz,COND);c.textAlign='center';c.fillStyle=f.a;c.fillText(f.d1,0,sz*.35);c.lineWidth=6;c.strokeStyle=fg;c.globalAlpha=.25;c.strokeText(f.d1,14,sz*.35+14);c.restore();c.globalAlpha=1;
  const q=eo(prog(t,1.6,2.2));if(q>0&&f.d2){c.globalAlpha=q;c.font=font(700,34,MONO);setLS(c,6);const tw=c.measureText(f.d2).width+80;rr(c,W/2-tw/2,1330,tw,76,38);c.strokeStyle=fg;c.lineWidth=3;c.stroke();c.fillStyle=fg;c.textAlign='center';c.fillText(f.d2,W/2,1381);setLS(c,0);c.globalAlpha=1}
  gPill(c,f.cta,W/2,1470,2.2,t,f,'center');c.textAlign='left';logoCorner(c,A,t,2.6,W/2,H-420,110)}},
anket:{n:'Hangisi?',dur:6,map:x=>({title:x[0],d1:x[1],d2:x[2],sub:x[3]}),labels:{title:'Soru',d1:'Seçenek A',d2:'Seçenek B',sub:'Alt not'},max:{d1:22,d2:22},
 tracks:[['Zemin',0,6,1],['Soru',.2,1],['A',.9,1.4],['B',1.1,1.6],['Oylar',2,3.4],['Not',3.2,3.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.textAlign='center';gTxt(c,f.title,W/2,400,86,.2,t,{...st,align:'center'},fg,{align:'center',l:2});const pct=[58,42];
  [f.d1,f.d2].forEach((s,i)=>{const x0=80+i*480,y0=640,w=440,h=640;const e=eback(prog(t,.9+i*.2,1.4+i*.2));if(e<=0)return;c.save();c.translate(x0+w/2,y0+h/2);c.scale(clamp(e,0,1.05),clamp(e,0,1.05));c.rotate((i?1:-1)*.02);c.translate(-w/2,-h/2);
   rr(c,0,0,w,h,44);c.fillStyle=i===0?f.a:fgA(f.p,.08);c.fill();if(i){c.strokeStyle=fgA(f.p,.2);c.lineWidth=3;c.stroke()}const tc=i===0?onColor(f.a):fg;
   c.beginPath();c.arc(w/2,170,90,0,Math.PI*2);c.fillStyle=i===0?'rgba(0,0,0,.14)':mix(f.a,f.p,.75);c.fill();c.font=font(900,120,COND);c.fillStyle=i===0?tc:f.a;c.textAlign='center';c.fillText(i?'B':'A',w/2,212);
   c.font=font(800,52,BODY);c.fillStyle=tc;wrap(c,s,w-60,2).forEach((l,j)=>c.fillText(l,w/2,370+j*62));
   const v=eio(prog(t,2+i*.15,3.2));if(v>0){rr(c,40,h-120,w-80,30,15);c.fillStyle=i===0?'rgba(0,0,0,.18)':fgA(f.p,.12);c.fill();rr(c,40,h-120,(w-80)*pct[i]/100*v,30,15);c.fillStyle=i===0?tc:f.a;c.fill();c.font=font(900,56,COND);c.fillStyle=tc;c.fillText('%'+Math.round(pct[i]*v),w/2,h-140)}c.restore()});
  const vs=eback(clamp(prog(t,1.3,1.8)));if(vs>0){c.save();c.translate(W/2,960);c.scale(vs,vs);c.beginPath();c.arc(0,0,64,0,Math.PI*2);c.fillStyle=f.p;c.fill();c.strokeStyle=fg;c.lineWidth=4;c.stroke();c.font=font(900,56,COND);c.fillStyle=fg;c.textAlign='center';c.fillText('VS',0,20);c.restore()}
  gSmall(c,f.sub,W/2,1440,46,3.2,t,fgA(f.p,.8),'center',900,1,700);c.textAlign='left';logoCorner(c,A,t,3,W/2,H-200,120)}},
takip:{n:'Takip Et',dur:6,map:x=>({d1:x[0],title:x[1],sub:x[2],d2:x[3],d3:x[4]}),labels:{d1:'Kullanıcı adı',title:'Başlık',sub:'Alt metin',d2:'Gönderi sayısı',d3:'Takipçi sayısı'},max:{d1:24,d2:8,d3:8},
 tracks:[['Zemin',0,6,1],['Başlık',.2,1],['Profil kartı',.8,1.4],['Sayılar',1.4,2.2],['Takip düğmesi',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.textAlign='center';gTxt(c,f.title,W/2,380,84,.2,t,{...st,align:'center'},fg,{align:'center',l:2});
  const e=eback(prog(t,.8,1.4));if(e>0){const x0=110,y0=560,w=W-220,h=820;c.save();c.translate(W/2,y0+h/2);c.scale(clamp(e,0,1.04),clamp(e,0,1.04));c.translate(-W/2,-(y0+h/2));rr(c,x0,y0,w,h,48);c.fillStyle=fgA(f.p,.07);c.fill();c.strokeStyle=fgA(f.p,.16);c.lineWidth=2;c.stroke();
   const ini=String(f.d1||'@').replace('@','').slice(0,2).toLocaleUpperCase('tr');const g=c.createLinearGradient(W/2-110,y0+60,W/2+110,y0+280);g.addColorStop(0,f.a);g.addColorStop(1,mix(f.a,f.p,.45));c.beginPath();c.arc(W/2,y0+170,118,0,Math.PI*2);c.strokeStyle=g;c.lineWidth=10;c.stroke();
   if(A.logo){fitLogo(c,A.logo,W/2,y0+170,170,1)}else{c.beginPath();c.arc(W/2,y0+170,100,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(900,96,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(ini,W/2,y0+204)}
   c.textAlign='center';c.font=font(800,54,BODY);c.fillStyle=fg;c.fillText(f.d1,W/2,y0+370);
   [[f.d2,'gönderi'],[f.d3,'takipçi']].forEach(([n,l],i)=>{const q=eo(prog(t,1.4+i*.2,2+i*.2));c.globalAlpha=q;const cx=W/2+(i?170:-170);c.font=font(900,80,COND);c.fillStyle=fg;c.fillText(n||'',cx,y0+500);c.font=font(500,28,MONO);c.fillStyle=fgA(f.p,.6);c.fillText(l.toLocaleUpperCase('tr'),cx,y0+545);c.globalAlpha=1});
   const on=t>2.7;const bp=t>2.6&&t<2.8?.94:1;c.save();c.translate(W/2,y0+680);c.scale(bp,bp);rr(c,-280,-56,560,112,56);if(on){c.strokeStyle=fg;c.lineWidth=3;c.stroke();c.fillStyle=fg}else{c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a)}c.font=font(800,44,BODY);c.fillText(on?'Takip ediliyor ✓':'Takip et',0,16);c.restore();
   if(t>2.6&&t<3.3){const r=(t-2.6)*500;c.globalAlpha=1-(t-2.6)/.7;c.strokeStyle=f.a;c.lineWidth=5;c.beginPath();c.arc(W/2,y0+680,r,0,Math.PI*2);c.stroke();c.globalAlpha=1}
   c.restore()}
  if(t>3){for(let i=0;i<6;i++){const lt=(t-3-i*.35);if(lt<0||lt>2)continue;const x=W/2+Math.sin(i*2.1)*300,y=1350-lt*360;c.globalAlpha=Math.max(0,1-lt/2);icon(c,'kalp',x,y,60,f.a,4);c.globalAlpha=1}}
  gSmall(c,f.sub,W/2,1530,46,2.6,t,fgA(f.p,.8),'center',900,1,600);c.textAlign='left'}},
ozel:{n:'Özel Gün',dur:6,map:x=>({title:x[0],d1:x[1],sub:x[2]}),labels:{title:'Kutlama mesajı',d1:'Büyük yazı (yıl, tarih)',sub:'Marka adı'},max:{d1:10,sub:24},
 tracks:[['Zemin',0,6,1],['Havai fişek',.3,6],['Büyük yazı',.6,1.4],['Mesaj',1.4,2.4],['Marka',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const bursts=[[.3,W*.25,520],[.9,W*.78,420],[1.6,W*.55,300],[2.6,W*.2,380],[3.4,W*.8,560]];
  bursts.forEach(([t0,bx,by],k)=>{const lt=t-t0;if(lt<0||lt>2.2)return;for(let i=0;i<36;i++){const a=i/36*Math.PI*2;const sp=260+sr(i+k*40)*160;const x=bx+Math.cos(a)*sp*eo(clamp(lt/1.2)),y=by+Math.sin(a)*sp*eo(clamp(lt/1.2))+lt*lt*60;c.globalAlpha=Math.max(0,1-lt/2.2);c.fillStyle=i%3?f.a:fg;c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fill()}});c.globalAlpha=1;
  const s=clamp(eback(prog(t,.6,1.4)),0,1.1);c.save();c.translate(W/2,1000);c.scale(s,s);const sz=fitFont(c,String(f.d1),920,400,140);c.font=font(900,sz,COND);c.textAlign='center';const g=c.createLinearGradient(0,-sz*.6,0,sz*.3);g.addColorStop(0,mix(f.a,'#FFFFFF',.35));g.addColorStop(1,f.a);c.fillStyle=g;c.fillText(f.d1,0,sz*.33);c.restore();
  c.textAlign='center';gTxt(c,f.title,W/2,1260,78,1.4,t,{...st,align:'center'},fg,{align:'center',l:3});
  kick(c,f.sub,W/2,1700,fgA(f.p,.7),t,2.4,'center');c.textAlign='left';logoCorner(c,A,t,2.6,W/2,300,140)}},
teslim:{n:'Teslimat ve Ödeme',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3]}),labels:{title:'Başlık',d1:'Madde 1',d2:'Madde 2',d3:'Madde 3'},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1.1],['Madde 1',1,1.6],['Madde 2',1.4,2],['Madde 3',1.8,2.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p),x=AX(st);gTxt(c,f.title,x,400,94,.2,t,st,fg,{l:2});
  const ico=[(cx,cy,col,p)=>{c.save();c.translate(cx,cy);c.strokeStyle=col;c.lineWidth=6;c.lineJoin='round';const dx=(1-p)*-60;c.translate(dx,0);c.strokeRect(-56,-30,70,52);c.beginPath();c.moveTo(14,-14);c.lineTo(40,-14);c.lineTo(56,6);c.lineTo(56,22);c.lineTo(14,22);c.stroke();c.beginPath();c.arc(-34,30,10,0,Math.PI*2);c.arc(34,30,10,0,Math.PI*2);c.stroke();c.restore()},
   (cx,cy,col,p)=>{c.save();c.translate(cx,cy);c.rotate((1-p)*.4);c.strokeStyle=col;c.lineWidth=6;rr(c,-56,-36,112,72,12);c.stroke();c.fillStyle=col;c.fillRect(-56,-18,112,12);c.fillRect(-40,14,30,8);c.restore()},
   (cx,cy,col,p)=>{c.save();c.translate(cx,cy);c.strokeStyle=col;c.lineWidth=6;c.lineCap='round';c.beginPath();c.arc(0,0,40,-.3,-.3+Math.PI*1.6*p+.2);c.stroke();const a=-.3;c.beginPath();c.moveTo(Math.cos(a)*40-14,Math.sin(a)*40-10);c.lineTo(Math.cos(a)*40,Math.sin(a)*40);c.lineTo(Math.cos(a)*40+12,Math.sin(a)*40-14);c.stroke();c.restore()}];
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const y=720+i*270;const e=eo(prog(t,1+i*.4,1.6+i*.4));if(e<=0)return;c.globalAlpha=e;const bx=80+(1-e)*-60;rr(c,bx,y-90,180,180,44);c.fillStyle=i===0?f.a:fgA(f.p,.08);c.fill();ico[i](bx+90,y,i===0?onColor(f.a):f.a,e);
   c.font=font(800,54,BODY);c.fillStyle=fg;const L=wrap(c,s,W-400,2);L.forEach((l,j)=>c.fillText(l,bx+230,y+18+j*64-(L.length-1)*32));c.globalAlpha=1});logoCorner(c,A,t,2.6,W/2,H-170,120)}},
slogan:{n:'Slogan',dur:6,map:x=>({title:x[0],sub:x[1]}),labels:{title:'Slogan',sub:'Marka adı'},max:{title:60,sub:24},
 tracks:[['Zemin',0,6,1],['Kelimeler',.2,2.6],['Vurgu',1.6,2.4],['Marka',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const words=hCase(st,f.title).split(/\s+/).filter(Boolean);let size=st.pair===1?190:st.pair===2?150:132;c.font=hFont(st,size);
  let lines;for(;;){lines=[];let cur='';words.forEach(w=>{const tt=cur?cur+' '+w:w;if(c.measureText(tt).width>900&&cur){lines.push(cur);cur=w}else cur=tt});if(cur)lines.push(cur);if((lines.length<=5&&Math.max(...lines.map(l=>c.measureText(l).width))<=940)||size<70)break;size-=10;c.font=hFont(st,size)}
  const lh=size*(st.pair===1?1.0:1.12);const y0=H/2-(lines.length-1)*lh/2+size*.3;const al=st.align==='center'?'center':'left';const x=al==='center'?W/2:80;let wi=0;const hi=Math.max(0,lines.length-1);
  lines.forEach((ln,i)=>{const y=y0+i*lh;const p=eo(prog(t,.2+i*.28,.8+i*.28));c.save();c.beginPath();c.rect(0,y-lh*.95,W,lh*1.15);c.clip();
   if(i===hi){const hw=c.measureText(ln).width;const hk=eio(prog(t,1.6,2.3));const hx=al==='center'?W/2-hw/2:x;c.fillStyle=f.a;c.fillRect(hx-18,y-size*.78,(hw+36)*hk,size*.98)}
   c.textAlign=al;c.fillStyle=i===hi&&t>1.9?onColor(f.a):fg;c.fillText(ln,x,y+(1-p)*lh);c.restore()});
  c.textAlign='left';kick(c,f.sub,al==='center'?W/2:80,H-230,f.a,t,2.6,al);logoCorner(c,A,t,2.8,W-150,170,120)}},
randevu:{n:'Randevu Takvimi',dur:7,map:x=>({title:x[0],d1:x[1],d2:x[2],d3:x[3],cta:x[4]}),labels:{title:'Başlık',d1:'Gün',d2:'Ay',d3:'Saatler (· ile ayır)',cta:'Çağrı'},max:{d1:2,d2:10,d3:30},
 tracks:[['Zemin',0,7,1],['Başlık',.2,1],['Takvim',.8,1.6],['Gün seçimi',1.8,2.4],['Saatler',2.4,3.4],['Çağrı',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p),x=AX(st);gTxt(c,f.title,x,360,88,.2,t,st,fg,{l:2});
  const e=eo(prog(t,.8,1.5));const x0=90,y0=520,w=W-180,h=700;c.globalAlpha=e;c.save();c.translate(0,(1-e)*80);rr(c,x0,y0,w,h,40);c.fillStyle=fgA(f.p,.07);c.fill();c.strokeStyle=fgA(f.p,.15);c.lineWidth=2;c.stroke();
  c.font=font(900,58,COND);c.fillStyle=fg;c.textAlign='left';c.fillText(String(f.d2).toLocaleUpperCase('tr'),x0+50,y0+90);c.font=font(500,26,MONO);c.fillStyle=fgA(f.p,.5);c.textAlign='right';c.fillText('2026',x0+w-50,y0+86);
  const days=['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];const cw=(w-100)/7;c.textAlign='center';days.forEach((d,i)=>{c.font=font(500,24,MONO);c.fillStyle=fgA(f.p,.5);c.fillText(d,x0+50+cw*i+cw/2,y0+160)});
  const sel=parseInt(f.d1)||18;for(let d=1;d<=30;d++){const i=(d+5)%7,r=Math.floor((d+5)/7);const cx=x0+50+cw*i+cw/2,cy=y0+235+r*92;if(d===sel){const k=clamp(eback(prog(t,1.8,2.3)),0,1.15);if(k>0){c.beginPath();c.arc(cx,cy-12,44*k,0,Math.PI*2);c.fillStyle=f.a;c.fill()}c.font=font(800,36,BODY);c.fillStyle=k>.5?onColor(f.a):fg}else{c.font=font(600,34,BODY);c.fillStyle=d<sel?fgA(f.p,.3):fgA(f.p,.8)}c.fillText(String(d),cx,cy)}
  c.restore();c.globalAlpha=1;
  const slots=String(f.d3||'').split('·').map(z=>z.trim()).filter(Boolean).slice(0,3);c.font=font(800,40,BODY);const sw=slots.map(s=>c.measureText(s).width+70);const tot=sw.reduce((a,b)=>a+b,0)+(slots.length-1)*24;let sx=W/2-tot/2;
  slots.forEach((s,i)=>{const q=eback(clamp(prog(t,2.4+i*.2,2.9+i*.2)));if(q<=0){sx+=sw[i]+24;return}c.save();c.translate(sx+sw[i]/2,1330);c.scale(q,q);rr(c,-sw[i]/2,-46,sw[i],92,46);const hot=i===1&&t>3.3;if(hot){c.fillStyle=f.a;c.fill()}else{c.strokeStyle=fgA(f.p,.35);c.lineWidth=3;c.stroke()}c.fillStyle=hot?onColor(f.a):fg;c.textAlign='center';c.fillText(s,0,14);c.restore();sx+=sw[i]+24});
  gPill(c,f.cta,W/2,1480,3.4,t,f,'center');c.textAlign='left';logoCorner(c,A,t,3.6,W/2,H-170,120)}}
};

// ---- tüm sektör şablonlarını 4 stille yeniden üret ----
(function(){const isGen=t=>/^g\d/.test(t.id);for(let i=TEMPLATES.length-1;i>=0;i--)if(isGen(TEMPLATES[i]))TEMPLATES.splice(i,1);
 const SETS=[[ARCH,ARCH_KEYS,si=>SECTORS[si].c,false],[ARCH2,Object.keys(ARCH2),si=>C2[si],false],[ARCH3,Object.keys(ARCH3),si=>C3[si],false],[ARCH4,Object.keys(ARCH4),si=>null,true]];
 const OUT=[];let n=0;let gai=0;
 SECTORS.forEach((sec,si)=>{SETS.forEach(([AS,keys,src,nw],set)=>{keys.forEach((ak,ai)=>{const AR=AS[ak];const data=set===3?LEX[si]:src(si)[ak];if(!data)return;gai=set*20+ai;
  const brandDark=lum(sec.p[0])<.45;
  for(let v=0;v<4;v++){let pal,bgk,pair,anim,align,dk,card=false;
   if(v===0){pal=brandDark?['Marka',sec.p[0],sec.p[1]]:DARKP[(si+gai)%DARKP.length];bgk=['mesh','rings','dots','grid'][(gai+si)%4];pair=0;anim='mask';align=gai%2?'center':'left';dk=1}
   else if(v===1){pal=LIGHTP[(si*3+gai)%LIGHTP.length];bgk=['grid','split','solid','dots'][(gai+si+1)%4];pair=3;anim='slide';align=gai%2?'left':'center';dk=4}
   else if(v===2){pal=VIVIDP[(si*5+gai*3)%VIVIDP.length];bgk=['stripes','split','rings','solid'][(gai+si+2)%4];pair=1;anim='scale';align='center';dk=2}
   else{let k=(si*7+gai*5+3)%DARKP.length;if(DARKP[k][2]===sec.p[1])k=(k+1)%DARKP.length;pal=DARKP[k];bgk=['photo','mesh','rings'][(gai+si)%3];pair=2;anim=['letter','blur','type'][(gai+si)%3];align='left';dk=-1;card=true}
   if(ak==='once'){bgk='solid';dk=-1}
   if(bgk==='photo'&&lum(pal[1])>.45)bgk='mesh';
   const st={bg:bgk,anim,pair,align,deco:dk,card};const fields={...AR.map(data),p:pal[1],a:pal[2]};['title','sub','d1','d2','d3','cta'].forEach(k=>{if(fields[k]==null)fields[k]=''});n++;
   OUT.push({id:'g'+String(n).padStart(4,'0'),name:`${AR.n} · ${STN[v]}`,style:STN[v],cat:AR.n,sector:sec.n,grp:sec.n+'|'+AR.n,dur:AR.dur,isNew:nw,def:fields,labels:AR.labels,max:AR.max,tracks:AR.tracks,st,
    draw(c,t,f,A){const S=this.st;const inner=()=>{gBg(c,t,f,A,S.bg,this.dur,this.sector==='Emlak & İnşaat');if(S.deco===4)deco4(c,t,f);else if(S.deco>0)deco(c,t,f,S.deco);if(S.bg==='photo'){c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=24}AR.draw.call(this,c,t,f,A,S);c.shadowColor='transparent';c.shadowBlur=0;c.textAlign='left';c.globalAlpha=1};
     if(S.card)cardWrap(c,t,f,inner);else inner()}})}})})});
 // el yapımı şablonlara da 3 ek stil (renk teması + kart çerçeve)
 const ORIG=TEMPLATES.filter(t=>!isGen(t));const EXTRA=[];
 ORIG.forEach((tpl,i)=>{tpl.grp=tpl.id;tpl.style='Özgün';const safe=!String(tpl.draw).includes('setTransform');
  const alt1=DARKP[(i*5+2)%DARKP.length],alt2=DARKP[(i*7+6)%DARKP.length];
  const mk=(sfx,stName,pal,card,duo)=>({...tpl,id:tpl.id+'_'+sfx,name:tpl.name+' · '+stName,style:stName,grp:tpl.id,def:{...tpl.def,...(pal?{p:pal[1],a:pal[2]}:{})},_base:tpl,_card:card&&safe,_duo:duo,
    draw(c,t,f,A){if(this._duo)duoWrap(c,t,f,this._duo,(ctx)=>this._base.draw.call(this,ctx,t,f,A),this);else if(this._card)cardWrap(c,t,f,()=>this._base.draw.call(this,c,t,f,A));else this._base.draw.call(this,c,t,f,A)}});
  const duo=DUO[i%DUO.length];EXTRA.push(mk('b','Duo '+duo[0],null,false,duo),mk('c','Kart',safe?null:alt2,true),mk('d','Kart '+alt1[0],alt1,true))});
 // sıralama: el yapımları + varyasyonları yan yana, sonra sektör şablonları
 const ordered=[];ORIG.forEach(o=>{ordered.push(o);EXTRA.filter(e=>e.grp===o.id).forEach(e=>ordered.push(e))});
 TEMPLATES.length=0;TEMPLATES.push(...ordered,...OUT)})();






// [imza-bas]
// ===== İmza motionlar: her sektörün kendi nesnesiyle hareket eden, başka sektörde kullanılamayan tasarımlar =====
const SIG={};
const sp=(t,a,b)=>eback(clamp(prog(t,a,b)));
function glow(c,x,y,r,col,a=.5){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col.replace('A',a));g.addColorStop(1,col.replace('A',0));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}
function sparkle(c,x,y,s,a,col='#FFFFFF'){if(a<=0)return;c.save();c.globalAlpha=a;c.translate(x,y);c.fillStyle=col;c.beginPath();c.moveTo(0,-s);c.quadraticCurveTo(s*.12,-s*.12,s,0);c.quadraticCurveTo(s*.12,s*.12,0,s);c.quadraticCurveTo(-s*.12,s*.12,-s,0);c.quadraticCurveTo(-s*.12,-s*.12,0,-s);c.fill();c.restore()}
function goldGrad(c,x0,y0,x1,y1){const g=c.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,'#7A5410');g.addColorStop(.25,'#F7D774');g.addColorStop(.5,'#B98516');g.addColorStop(.75,'#FFE9A3');g.addColorStop(1,'#8A5F12');return g}
function sigHead(c,t,f,st,y=300,size=88,t0=.2){const fg=fgOf(f.p);gTxt(c,f.title,AX(st),y,size,t0,t,st,fg,{l:2})}
function priceTag(c,s,x,y,t,t0,f,rot=-.06){const e=sp(t,t0,t0+.5);if(e<=0||!s)return;c.save();c.translate(x,y);c.rotate(rot+Math.sin(t*2.2)*.03*(1-clamp((t-t0-1)/2)));c.scale(e,e);c.font=font(900,64,COND);const w=c.measureText(s).width+110;
  rr(c,-w/2,-54,w,108,22);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.beginPath();c.arc(-w/2+34,0,11,0,Math.PI*2);c.fill();c.textAlign='center';c.fillText(s,18,22);c.restore();c.textAlign='left'}

/* ---------------- KUYUMCU ---------------- */
SIG['Kuyumcu']=[
{k:'yuzuk',n:'Dönen Yüzük',dur:7,def:{title:'Tektaş koleksiyonu',sub:'Sertifikalı pırlanta, ömür boyu bakım',d1:'₺ 24.900\'den',cta:'Mağazaya gel'},labels:{title:'Başlık',sub:'Açıklama',d1:'Fiyat',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Yüzük',.1,1.2],['Başlık',.9,1.8],['Fiyat',2,2.6],['Buton',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=860;const e=eo(prog(t,.05,1.2));
  glow(c,cx,cy,520,'rgba(255,214,120,A)',.28*e);
  // dönen halka: yatay genişlik cos ile değişir
  const ang=t*1.25+.6;const rx=250*(.35+.65*Math.abs(Math.cos(ang))),ry=250;c.save();c.translate(cx,cy+40+(1-e)*300);c.globalAlpha=e;
  const back=Math.cos(ang)<0;c.lineWidth=58;c.strokeStyle=goldGrad(c,-rx,-ry,rx,ry);c.beginPath();c.ellipse(0,0,rx,ry,0,0,Math.PI*2);c.stroke();
  c.lineWidth=10;c.strokeStyle='rgba(255,248,220,.55)';c.beginPath();c.ellipse(0,0,rx-18,ry-18,0,Math.PI*1.05,Math.PI*1.6);c.stroke();
  // taş yuvası + pırlanta
  const dy=-ry-30;c.fillStyle=goldGrad(c,-60,dy-20,60,dy+40);c.beginPath();c.moveTo(-70,dy+40);c.lineTo(70,dy+40);c.lineTo(40,dy-10);c.lineTo(-40,dy-10);c.closePath();c.fill();
  const g=c.createLinearGradient(-90,dy-150,90,dy);g.addColorStop(0,'#FFFFFF');g.addColorStop(.4,'#CFE8FF');g.addColorStop(.7,'#8FB8E8');g.addColorStop(1,'#E8F4FF');c.fillStyle=g;
  c.beginPath();c.moveTo(-95,dy-40);c.lineTo(-55,dy-110);c.lineTo(55,dy-110);c.lineTo(95,dy-40);c.lineTo(0,dy+30);c.closePath();c.fill();
  c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=3;c.beginPath();c.moveTo(-95,dy-40);c.lineTo(95,dy-40);c.moveTo(-55,dy-110);c.lineTo(-25,dy-40);c.lineTo(0,dy+30);c.moveTo(55,dy-110);c.lineTo(25,dy-40);c.lineTo(0,dy+30);c.moveTo(-25,dy-40);c.lineTo(0,dy-110);c.lineTo(25,dy-40);c.stroke();c.restore();
  // ışık süpürmesi + pırıltılar
  const sw=((t*.55)%1.6)-.3;if(sw>0&&sw<1&&t>1){c.save();c.globalAlpha=.16*e;c.translate(cx-400+sw*800,cy);c.rotate(.5);c.fillStyle='#FFFFFF';c.fillRect(-30,-500,60,1000);c.restore()}
  [[cx-60,cy-400,38,1.2],[cx+170,cy-300,26,1.6],[cx-230,cy+80,22,2],[cx+250,cy+200,30,2.4],[cx+90,cy-470,18,2.9]].forEach(([x,y,s,t0])=>sparkle(c,x,y,s*(.6+.4*Math.sin(t*4+t0)),clamp(prog(t,t0,t0+.3))*e));
  sigHead(c,t,f,st,300,84,.9);gSmall(c,f.sub,AX(st),470,38,1.3,t,fgA(f.p,.75),st.align,900,2,600);
  priceTag(c,f.d1,W/2,1320,t,2,f);gPill(c,f.cta,W/2,1500,2.6,t,f,'center');logoCorner(c,A,t,2.6,W-150,170,120)}},
{k:'altin',n:'Altın Fiyat Panosu',dur:8,def:{title:'Günün altın fiyatları',d1:'Gram · ₺ 3.150',d2:'Çeyrek · ₺ 5.180',d3:'Yarım · ₺ 10.350',sub:'Temsili fiyatlar · güncel fiyat için mağazaya sorun',cta:'Hemen ara'},labels:{title:'Başlık',d1:'Satır 1 (ad · fiyat)',d2:'Satır 2',d3:'Satır 3',sub:'Not',cta:'Buton'},max:{sub:70},
 tracks:[['Zemin',0,8,1],['Külçe',.1,1],['Başlık',.6,1.4],['Fiyatlar',1.2,3.4],['Not',3.4,4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=sp(t,.05,.8);
  // altın külçe (izometrik)
  c.save();c.translate(W/2,470);c.scale(e,e);c.rotate(-.05);const w=360,h=120,d=90;c.fillStyle=goldGrad(c,-w/2,-h,w/2,h);
  c.beginPath();c.moveTo(-w/2,0);c.lineTo(-w/2+50,-h);c.lineTo(w/2-50,-h);c.lineTo(w/2,0);c.closePath();c.fill();
  c.fillStyle='#A3740F';c.beginPath();c.moveTo(-w/2,0);c.lineTo(w/2,0);c.lineTo(w/2-10,d*.5);c.lineTo(-w/2+10,d*.5);c.closePath();c.fill();
  c.fillStyle='rgba(255,250,225,.7)';c.font=font(800,30,MONO);c.textAlign='center';c.fillText('999.9',0,-h/2+10);c.restore();
  sparkle(c,W/2+150,400,30*(.7+.3*Math.sin(t*5)),clamp(prog(t,.8,1.1)));
  const fgT=fg;sigHead(c,t,f,{...st,align:'center'},740,74,.6);
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const [nm,pr]=String(s).split('·').map(z=>z.trim());const y=900+i*170;const tk=1.2+i*.45;const e2=eo(prog(t,tk,tk+.4));if(e2<=0)return;
   c.save();c.globalAlpha=e2;rr(c,90,y,W-180,138,26);c.fillStyle=fgA(f.p,.07);c.fill();c.strokeStyle=fgA(f.p,.16);c.lineWidth=2;c.stroke();c.font=font(700,46,BODY);c.fillStyle=fgT;c.textAlign='left';c.fillText(nm||'',130,y+86);
   // döner sayı (bölünmüş pano)
   const txt=pr||'';c.font=font(900,72,COND);c.textAlign='right';const settle=clamp((t-tk)/1.1);const shown=txt.split('').map((ch,j)=>/\d/.test(ch)&&settle<1&&j/txt.length>settle?String(Math.floor((t*30+j*7)%10)):ch).join('');
   c.fillStyle=f.a;c.fillText(shown,W-130,y+94);const up=i!==1;c.fillStyle=up?'#22C55E':'#EF4444';c.beginPath();const ax=W-130-c.measureText(shown).width-46,ay=y+62;if(up){c.moveTo(ax,ay+14);c.lineTo(ax+14,ay-8);c.lineTo(ax+28,ay+14)}else{c.moveTo(ax,ay-8);c.lineTo(ax+14,ay+14);c.lineTo(ax+28,ay-8)}c.fill();c.restore()});
  gSmall(c,f.sub,W/2,1470,30,3.4,t,fgA(f.p,.6),'center',880,2,600);gPill(c,f.cta,W/2,1600,3.6,t,f,'center');logoCorner(c,A,t,3.6,W-150,170,120)}},
{k:'kutu',n:'Mücevher Kutusu',dur:7,def:{title:'Yeni koleksiyon geldi',sub:'El işçiliği 14 ayar altın kolyeler',cta:'Koleksiyonu gör'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kutu',.1,.8],['Kapak',.9,1.8],['Kolye',1.4,2.4],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=1000;const e=sp(t,.05,.7);const open=eio(prog(t,.9,1.8));
  c.save();c.translate(cx,cy);c.scale(e*1.3,e*1.3);const bw=560,bh=220;
  glow(c,0,-40,520,'rgba(255,220,150,A)',.4*open);
  // kutu: gövde (0..bh), iç kısım (-lh..0), kapak menteşesi -lh'de
  const lh=210;const vg=c.createLinearGradient(0,0,0,bh);vg.addColorStop(0,mix(f.a,'#000000',.5));vg.addColorStop(1,mix(f.a,'#000000',.78));c.fillStyle=vg;rr(c,-bw/2,0,bw,bh,26);c.fill();
  c.fillStyle='rgba(255,255,255,.07)';rr(c,-bw/2+16,12,bw-32,10,5);c.fill();
  const cg=c.createLinearGradient(0,-lh,0,0);cg.addColorStop(0,'#E9DCCF');cg.addColorStop(1,'#BFA996');c.fillStyle=mix(f.a,'#000000',.6);rr(c,-bw/2,-lh,bw,lh+20,26);c.fill();c.fillStyle=cg;rr(c,-bw/2+22,-lh+18,bw-44,lh-6,20);c.fill();c.fillStyle='rgba(0,0,0,.14)';c.fillRect(-3,-lh+20,6,lh-10);
  // kolye: yastığın üstünde
  if(open>.25){const k=clamp((open-.25)/.6);c.save();c.globalAlpha=k;c.strokeStyle=goldGrad(c,-220,-lh,220,0);c.lineWidth=6;c.beginPath();c.moveTo(-210,-lh+40);c.bezierCurveTo(-180,-30,180,-30,210,-lh+40);c.stroke();
   for(let i=0;i<14;i++){const u=i/13;const x=lerpN(-200,200,u),y=-lh+40+Math.sin(u*Math.PI)*(lh-70);c.fillStyle='#F7D774';c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill()}
   c.fillStyle=goldGrad(c,-20,-60,20,-30);c.beginPath();c.arc(0,-52,13,0,Math.PI*2);c.fill();const dg=c.createLinearGradient(-30,-50,30,20);dg.addColorStop(0,'#FFE4E9');dg.addColorStop(1,'#D63A76');c.fillStyle=dg;c.beginPath();c.moveTo(0,-44);c.quadraticCurveTo(40,-6,0,34);c.quadraticCurveTo(-40,-6,0,-44);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(-10,-14,6,12,-.4,0,Math.PI*2);c.fill();c.restore()}
  // kapak
  const ang=open*Math.PI*.88;const chh=Math.cos(ang)*lh;if(chh>0){const lg=c.createLinearGradient(0,-lh,0,-lh+chh);lg.addColorStop(0,mix(f.a,'#000000',.4));lg.addColorStop(1,mix(f.a,'#000000',.62));c.fillStyle=lg;rr(c,-bw/2,-lh,bw,chh+2,26);c.fill();c.fillStyle=goldGrad(c,-40,-lh+chh-20,40,-lh+chh);rr(c,-36,-lh+chh-16,72,16,4);c.fill()}
  else{const hh=-chh;c.fillStyle=mix(f.a,'#000000',.55);rr(c,-bw/2,-lh-hh,bw,hh,26);c.fill();const sg=c.createLinearGradient(0,-lh-hh,0,-lh);sg.addColorStop(0,'#F7EEE6');sg.addColorStop(1,'#D9C6B8');c.fillStyle=sg;rr(c,-bw/2+20,-lh-hh+14,bw-40,Math.max(0,hh-24),18);c.fill()}
  c.restore();
  [[cx-160,cy-60,26,1.9],[cx+190,cy-10,30,2.1],[cx+20,cy-200,22,2.4]].forEach(([x,y,s,t0])=>sparkle(c,x,y,s*(.6+.4*Math.sin(t*5+t0)),clamp(prog(t,t0,t0+.3))));
  sigHead(c,t,f,st,300,86,2);gSmall(c,f.sub,AX(st),1400,40,2.4,t,fgA(f.p,.75),st.align,900,2,600);gPill(c,f.cta,W/2,1560,2.8,t,f,'center');logoCorner(c,A,t,2.8,W-150,170,120)}}
];

/* ---------------- FIRIN & PASTANE ---------------- */
function bread(c,x,y,w,h,shade=0){const g=c.createLinearGradient(x,y-h,x,y+h);g.addColorStop(0,mix('#E9A24B','#FFFFFF',.15));g.addColorStop(.6,'#C47A2C');g.addColorStop(1,'#8A4E1A');c.fillStyle=g;c.beginPath();c.ellipse(x,y,w,h,0,0,Math.PI*2);c.fill();
  c.strokeStyle='rgba(255,236,200,.75)';c.lineWidth=7;c.lineCap='round';for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(x+i*w*.42-w*.12,y-h*.55);c.quadraticCurveTo(x+i*w*.42,y-h*.1,x+i*w*.42+w*.12,y+h*.35);c.stroke()}c.lineCap='butt'}
function steam(c,x,y,t,a,n=3,hgt=260){c.save();c.globalAlpha=a;c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=10;c.lineCap='round';for(let i=0;i<n;i++){c.beginPath();for(let k=0;k<=20;k++){const yy=y-k*hgt/20;const xx=x+(i-(n-1)/2)*46+Math.sin(k*.45+t*3+i)*18*(k/20);if(!k)c.moveTo(xx,yy);else c.lineTo(xx,yy)}c.globalAlpha=a*(.5+.5*Math.sin(t*2+i));c.stroke()}c.restore();c.lineCap='butt'}
SIG['Fırın & Pastane']=[
{k:'firin',n:'Fırından Sıcak',dur:7,def:{title:'Ekşi mayalı köy ekmeği',sub:'Her sabah 07:00\'de fırından',d1:'Sıcak çıktı',cta:'Yerini ayırt'},labels:{title:'Ürün',sub:'Saat / açıklama',d1:'Rozet',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Fırın',.1,.8],['Tepsi',.8,2],['Buhar',1.8,7],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2;const e=eo(prog(t,.05,.8));
  // fırın ağzı
  c.save();c.globalAlpha=e;c.translate(0,90);c.fillStyle=mix(f.p,'#000000',.45);rr(c,90,520,W-180,560,60);c.fill();c.fillStyle='#2A1408';c.beginPath();c.moveTo(170,1020);c.lineTo(170,760);c.arc(cx,760,cx-170,Math.PI,0);c.lineTo(W-170,1020);c.closePath();c.fill();
  const fl=.55+.15*Math.sin(t*7)+.1*Math.sin(t*13);const gg=c.createRadialGradient(cx,960,20,cx,900,420);gg.addColorStop(0,`rgba(255,170,60,${fl})`);gg.addColorStop(1,'rgba(120,40,0,0)');c.fillStyle=gg;c.fillRect(170,600,W-340,420);
  for(let i=0;i<9;i++){c.fillStyle=`rgba(255,${120+i*10},40,${.5+.4*Math.sin(t*9+i*1.7)})`;c.beginPath();c.ellipse(220+i*80,1000-Math.abs(Math.sin(t*6+i))*30,22,40+Math.sin(t*8+i)*14,0,0,Math.PI*2);c.fill()}c.restore();
  // tepsi dışarı kayar ve büyür
  const tk=eio(prog(t,.8,2));const ty=lerpN(990,1220,tk),sc=.6+.42*tk;c.save();c.translate(cx,ty);c.scale(sc,sc);c.fillStyle='#6B6F76';rr(c,-420,40,840,34,12);c.fill();c.fillStyle='#4A4D52';c.fillRect(-460,52,40,10);c.fillRect(420,52,40,10);
  bread(c,-250,0,150,70);bread(c,0,-10,170,78);bread(c,250,0,150,70);c.restore();
  steam(c,cx,ty-60,t,clamp(prog(t,1.8,2.4))*.9,3,300);
  // rozet
  const be=sp(t,2.2,2.7);if(be>0&&f.d1){c.save();c.translate(W-200,600);c.rotate(.12+Math.sin(t*3)*.03);c.scale(be,be);c.beginPath();for(let i=0;i<24;i++){const r=i%2?118:140,a=i*Math.PI/12;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.font=font(900,fitFont(c,f.d1.toLocaleUpperCase('tr'),190,46,24,900,COND),COND);c.fillText(f.d1.toLocaleUpperCase('tr'),0,14);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,270,80,2);gSmall(c,f.sub,AX(st),1440,40,2.5,t,fgA(f.p,.78),st.align,900,2,600);gPill(c,f.cta,W/2,1600,2.9,t,f,'center');logoCorner(c,A,t,2.9,150,170,110)}},
{k:'pasta',n:'Pasta Katları',dur:7,def:{title:'Doğum günü pastası',sub:'İsme özel, 2 gün önceden sipariş',d1:'₺ 1.450',cta:'Sipariş ver'},labels:{title:'Başlık',sub:'Açıklama',d1:'Fiyat',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Katlar',.1,1.8],['Mumlar',1.8,2.6],['Başlık',2.2,3],['Fiyat',2.8,3.4]],
 draw(c,t,f,A,st){const cx=W/2,base=1260;c.save();c.translate(cx,base);c.scale(1.3,1.3);c.translate(-cx,-base);const T=[[440,150,mix(f.a,'#FFFFFF',.55)],[340,140,mix(f.a,'#FFFFFF',.35)],[240,130,mix(f.a,'#FFFFFF',.15)]];let y=base;
  c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(cx,base+20,330,40,0,0,Math.PI*2);c.fill();c.fillStyle=fgA(f.p,.25);rr(c,cx-300,base,600,24,12);c.fill();
  T.forEach(([w,h,col],i)=>{const t0=.15+i*.45;const k=prog(t,t0,t0+.5);if(k<=0){y-=h;return}const bounce=k<1?eback(k):1;const yy=y-h-(1-bounce)*700;
   c.fillStyle=col;rr(c,cx-w/2,yy,w,h,18);c.fill();c.fillStyle='rgba(0,0,0,.08)';c.fillRect(cx-w/2,yy+h-26,w,26);
   // krema damlaları
   c.fillStyle='#FFF7EE';c.beginPath();c.moveTo(cx-w/2,yy+10);for(let x=0;x<=w;x+=w/9){const dd=26+((x*37+i*11)%40);c.quadraticCurveTo(cx-w/2+x-w/36,yy+dd,cx-w/2+x,yy+18)}c.lineTo(cx+w/2,yy);c.lineTo(cx-w/2,yy);c.fill();
   for(let x=-w/2+30;x<w/2-20;x+=46){c.fillStyle=i%2?'#E0457B':f.a;c.beginPath();c.arc(cx+x,yy+h*.62,7,0,Math.PI*2);c.fill()}y-=h});
  // mumlar
  const top=base-150-140-130;[-60,0,60].forEach((dx,i)=>{const k=sp(t,1.8+i*.15,2.2+i*.15);if(k<=0)return;c.save();c.translate(cx+dx,top);c.scale(1,k);c.fillStyle=['#38BDF8','#FDE047','#F472B6'][i];rr(c,-9,-110,18,110,6);c.fill();c.restore();
   if(k>=1){const fl=1+.12*Math.sin(t*14+i*2);glow(c,cx+dx,top-130,70,'rgba(255,190,80,A)',.55);c.fillStyle='#FFB020';c.beginPath();c.ellipse(cx+dx,top-130,12*fl,24*fl,0,0,Math.PI*2);c.fill();c.fillStyle='#FFF2B0';c.beginPath();c.ellipse(cx+dx,top-124,5,11,0,0,Math.PI*2);c.fill()}});c.restore();
  sigHead(c,t,f,st,300,84,2.2);gSmall(c,f.sub,AX(st),470,38,2.5,t,fgA(f.p,.75),st.align,900,2,600);priceTag(c,f.d1,W-240,1080,t,2.8,f,.08);gPill(c,f.cta,W/2,1560,3.2,t,f,'center');logoCorner(c,A,t,3.2,W-150,170,110)}},
{k:'un',n:'Un Serpme',dur:7,def:{title:'TAZE',sub:'Mahallenin fırını, 1998\'den beri',cta:'Bugün uğra'},labels:{title:'Kelime (kısa)',sub:'Alt yazı',cta:'Buton'},max:{title:10},
 tracks:[['Zemin',0,7,1],['Un',.1,2.4],['Kelime',1.2,2.6],['Alt yazı',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const word=String(f.title||'TAZE').toLocaleUpperCase('tr').slice(0,10);
  if(this._w!==word){this._w=word;const oc=document.createElement('canvas');oc.width=540;oc.height=300;const o=oc.getContext('2d');o.fillStyle='#000';o.font=font(900,fitFont(o,word,500,260,80,900,COND),COND);o.textAlign='center';o.textBaseline='middle';o.fillText(word,270,150);
   const d=o.getImageData(0,0,540,300).data;const pts=[];for(let y=0;y<300;y+=6)for(let x=0;x<540;x+=6)if(d[(y*540+x)*4+3]>128)pts.push([x*2-540,y*2-300]);this._p=pts}
  const P=this._p||[];const cy=880;const flour=mix('#FFFFFF',f.p,.06);
  // tahta zemin
  c.save();c.fillStyle=lum(f.p)>.45?'rgba(120,80,40,.12)':'rgba(255,255,255,.05)';rr(c,70,560,W-140,660,40);c.fill();c.restore();
  P.forEach(([x,y],i)=>{const r=(Math.sin(i*12.9898)*43758.5453)%1;const rr_=Math.abs(r);const t0=.1+rr_*1.2;const k=eio(prog(t,t0,t0+1.1));const sx=W/2+(rr_-.5)*700,sy=-50-rr_*400;const px=lerpN(sx,W/2+x,k),py=lerpN(sy,cy+y,k)+Math.sin(t*2+i)*1.5*(1-k);
   c.fillStyle=flour;c.globalAlpha=.55+.45*k;c.beginPath();c.arc(px,py,4.2+rr_*2.6,0,Math.PI*2);c.fill()});c.globalAlpha=1;
  // dağınık un tozu
  for(let i=0;i<70;i++){const r=Math.abs((Math.sin(i*78.233)*12543.12)%1);const x=120+r*(W-240),y=600+((i*97)%600);c.globalAlpha=.18*clamp(prog(t,.6,1.6));c.fillStyle=flour;c.beginPath();c.arc(x,y,2+r*5,0,Math.PI*2);c.fill()}c.globalAlpha=1;
  // oklava geçişi
  const rp=prog(t,2.2,3.1);if(rp>0&&rp<1){const x=lerpN(-300,W+300,eio(rp));c.save();c.translate(x,cy+240);c.rotate(-.08);c.fillStyle='#C8935A';rr(c,-240,-34,480,68,34);c.fill();c.fillStyle='#8A5A2E';rr(c,-340,-16,100,32,16);c.fill();rr(c,240,-16,100,32,16);c.fill();c.restore()}
  gSmall(c,f.sub,W/2,1340,44,2.6,t,fg,'center',900,2,700);gPill(c,f.cta,W/2,1520,3,t,f,'center');logoCorner(c,A,t,3,W/2,300,150)}}
];

/* ---------------- RESTORAN & KAFE ---------------- */
function plate(c,x,y,r,f){c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x+14,y+22,r,r,0,0,Math.PI*2);c.fill();const g=c.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,'#FFFFFF');g.addColorStop(1,'#DADCE0');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.strokeStyle='rgba(0,0,0,.08)';c.lineWidth=3;c.beginPath();c.arc(x,y,r*.74,0,Math.PI*2);c.stroke()}
SIG['Restoran & Kafe']=[
{k:'tabak',n:'Buharı Tüten Tabak',dur:7,def:{title:'Trüflü mantarlı risotto',sub:'Taze parmesan ve tereyağıyla',d1:'₺ 420',cta:'Rezervasyon yap'},labels:{title:'Yemek',sub:'Açıklama',d1:'Fiyat',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Tabak',.1,1],['Yemek',.6,1.6],['Buhar',1.4,7],['Başlık',1.6,2.4],['Fiyat',2.4,3]],
 draw(c,t,f,A,st){const cx=W/2,cy=900;const e=eo(prog(t,.05,1));const rot=(1-e)*-1.4+t*.05;
  c.save();c.translate(cx+(1-e)*-700,cy);c.rotate(rot);plate(c,0,0,360,f);
  // risotto: krem tonlu taneler + mantar + yeşillik
  const fk=eo(prog(t,.6,1.6));c.globalAlpha=fk;const rg=c.createRadialGradient(-40,-40,10,0,0,230);rg.addColorStop(0,'#F3E3B8');rg.addColorStop(1,'#D9B46A');c.fillStyle=rg;c.beginPath();for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,r=210+Math.sin(i*1.7)*14;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.fill();
  for(let i=0;i<120;i++){const a=i*2.399,r=Math.sqrt(i/120)*200;c.fillStyle=i%3?'rgba(255,250,230,.8)':'rgba(190,150,80,.6)';c.beginPath();c.ellipse(Math.cos(a)*r,Math.sin(a)*r,9,5,a,0,Math.PI*2);c.fill()}
  [[-80,-50],[60,-90],[90,60],[-40,90],[10,0]].forEach(([x,y],i)=>{c.fillStyle='#7A5232';c.beginPath();c.ellipse(x,y,34,24,i,0,Math.PI*2);c.fill();c.fillStyle='#A9784F';c.beginPath();c.ellipse(x,y-4,26,14,i,0,Math.PI*2);c.fill()});
  for(let i=0;i<14;i++){const a=i*1.9,r=60+(i*37)%140;c.fillStyle='#3F8A3A';c.beginPath();c.ellipse(Math.cos(a)*r,Math.sin(a)*r,10,4,a,0,Math.PI*2);c.fill()}
  c.fillStyle='rgba(255,255,255,.9)';for(let i=0;i<30;i++){const a=i*2.7,r=(i*29)%190;c.fillRect(Math.cos(a)*r,Math.sin(a)*r,10,4)}c.restore();c.globalAlpha=1;
  steam(c,cx,cy-160,t,clamp(prog(t,1.4,2))*.8,3,320);
  // çatal-bıçak
  const ce=eo(prog(t,.7,1.3));c.save();c.globalAlpha=ce;c.fillStyle=fgA(f.p,.55);rr(c,cx-470,cy-200+(1-ce)*80,22,420,11);c.fill();rr(c,cx+450,cy-200+(1-ce)*80,22,420,11);c.fill();c.restore();
  sigHead(c,t,f,st,300,80,1.6);gSmall(c,f.sub,AX(st),1360,40,2,t,fgA(f.p,.78),st.align,900,2,600);priceTag(c,f.d1,W-260,1150,t,2.4,f,-.1);gPill(c,f.cta,W/2,1560,2.8,t,f,'center');logoCorner(c,A,t,2.8,W-150,170,110)}},
{k:'latte',n:'Latte Art',dur:7,def:{title:'Günün kahvesi: Lavanta latte',sub:'Bu hafta tüm sıcak kahvelerde %20',d1:'İKİNCİ KAHVE %50 · ',cta:'Uğra'},labels:{title:'Başlık',sub:'Açıklama',d1:'Fincan çevresi yazı',cta:'Buton'},max:{d1:28},
 tracks:[['Zemin',0,7,1],['Fincan',.1,.8],['Döküm',.8,2.6],['Yazı halkası',2.4,7],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const cx=W/2,cy=880;const e=sp(t,.05,.7);c.save();c.translate(cx,cy);c.scale(e,e);
  c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.arc(18,26,380,0,Math.PI*2);c.fill();plate(c,0,0,380,f);
  c.fillStyle='#FFFFFF';c.beginPath();c.arc(0,0,250,0,Math.PI*2);c.fill();c.strokeStyle='rgba(0,0,0,.1)';c.lineWidth=4;c.stroke();c.lineWidth=46;c.strokeStyle='#F4F4F4';c.beginPath();c.arc(330,0,60,-.9,.9);c.stroke();
  const cg=c.createRadialGradient(-40,-40,10,0,0,215);cg.addColorStop(0,'#C58A55');cg.addColorStop(.75,'#8C5427');cg.addColorStop(1,'#5E3415');c.fillStyle=cg;c.beginPath();c.arc(0,0,215,0,Math.PI*2);c.fill();
  // döküm akışı ve kalp
  const p=prog(t,.8,2.6);if(p>0){const k=eio(p);c.save();c.beginPath();c.arc(0,0,212,0,Math.PI*2);c.clip();c.fillStyle='#F6E6CF';
   const s=lerpN(.1,1,k);c.beginPath();c.moveTo(0,110*s);c.bezierCurveTo(170*s,-10*s,120*s,-150*s,0,-70*s);c.bezierCurveTo(-120*s,-150*s,-170*s,-10*s,0,110*s);c.fill();
   for(let i=0;i<3;i++){const ri=(150-i*38)*s;c.strokeStyle=`rgba(140,84,39,${.35+i*.1})`;c.lineWidth=6;c.beginPath();c.ellipse(0,-10*s+i*12*s,ri*.55,ri*.35,0,Math.PI*.15,Math.PI*.85);c.stroke()}
   c.strokeStyle='rgba(140,84,39,.55)';c.lineWidth=5;c.beginPath();c.moveTo(0,-70*s);c.lineTo(0,108*s);c.stroke();c.restore();
   if(p<.92){c.strokeStyle='#F6E6CF';c.lineWidth=18;c.lineCap='round';c.beginPath();c.moveTo(0,-600);c.quadraticCurveTo(10,-300,0,-80*s);c.stroke();c.lineCap='butt'}}
  c.restore();
  // fincan çevresinde dönen yazı
  const ra=eo(prog(t,2.4,3));if(ra>0&&f.d1){const txt=String(f.d1).toLocaleUpperCase('tr');c.save();c.translate(cx,cy);c.rotate(t*.35);c.font=font(800,34,MONO);c.fillStyle=fgOf(f.p);c.globalAlpha=ra;const R=440,n=txt.length;const rep=Math.max(1,Math.floor((2*Math.PI*R)/(c.measureText(txt).width+20)));const full=txt.repeat(rep);const step=2*Math.PI/full.length;
   for(let i=0;i<full.length;i++){c.save();c.rotate(i*step);c.translate(0,-R);c.fillText(full[i],-10,0);c.restore()}c.restore()}
  sigHead(c,t,f,st,300,74,2.4);gSmall(c,f.sub,AX(st),1420,40,2.8,t,fgA(f.p,.78),st.align,900,2,600);gPill(c,f.cta,W/2,1590,3.1,t,f,'center');logoCorner(c,A,t,3.1,W-150,170,110)}},
{k:'tahta',n:'Kara Tahta Menü',dur:8,def:{title:'Bugünün menüsü',d1:'Mercimek çorbası · ₺ 90',d2:'Fırın tavuk · ₺ 260',d3:'Kazandibi · ₺ 120',sub:'Öğle 12:00 – 15:00',cta:'Paket servis'},labels:{title:'Başlık',d1:'Satır 1 (yemek · fiyat)',d2:'Satır 2',d3:'Satır 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Tahta',.1,.8],['Başlık',.8,1.8],['Satırlar',1.8,4.4],['Not',4.4,5]],
 draw(c,t,f,A,st){const e=sp(t,.05,.7);const bx=90,by=330,bw=W-180,bh=1080;c.save();c.translate(W/2,by+bh/2);c.scale(e,e);c.translate(-W/2,-(by+bh/2));
  c.fillStyle='#7A4E2A';rr(c,bx-26,by-26,bw+52,bh+52,26);c.fill();c.fillStyle='#5C391D';rr(c,bx-10,by-10,bw+20,bh+20,14);c.fill();
  const bg=c.createLinearGradient(bx,by,bx+bw,by+bh);bg.addColorStop(0,'#2E3B33');bg.addColorStop(1,'#1D2620');c.fillStyle=bg;c.fillRect(bx,by,bw,bh);
  c.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<40;i++){const r=Math.abs((Math.sin(i*91.7)*733.1)%1);c.beginPath();c.ellipse(bx+r*bw,by+((i*131)%bh),90+r*120,18,r*3,0,Math.PI*2);c.fill()}
  const chalk='rgba(245,245,238,.94)';
  const write=(s,x,y,size,t0,dur,fam,align='left',col=chalk)=>{const k=clamp((t-t0)/dur);if(k<=0||!s)return;c.font=font(700,size,fam);c.textAlign=align;const w=c.measureText(s).width;const x0=align==='center'?x-w/2:align==='right'?x-w:x;
   c.save();c.beginPath();c.rect(x0-10,y-size,w*k+20,size*1.4);c.clip();c.fillStyle=col;c.fillText(s,x,y);c.restore();if(k<1){c.fillStyle='#FFFFFF';c.beginPath();c.arc(x0+w*k,y-size*.3,6,0,Math.PI*2);c.fill()}c.textAlign='left'};
  write(f.title,W/2,by+170,86,.8,1,SERIF,'center');
  c.strokeStyle='rgba(245,245,238,.5)';c.lineWidth=3;const ul=eio(prog(t,1.6,2));c.beginPath();c.moveTo(W/2-200*ul,by+210);c.lineTo(W/2+200*ul,by+210);c.stroke();
  [f.d1,f.d2,f.d3].forEach((s,i)=>{if(!s)return;const [nm,pr]=String(s).split('·').map(z=>z.trim());const y=by+380+i*190;const t0=1.9+i*.75;write(nm,bx+70,y,52,t0,.55,BODY);write(pr||'',bx+bw-70,y,58,t0+.5,.3,COND,'right','#F9D98A');
   c.save();c.globalAlpha=.35*clamp(prog(t,t0+.4,t0+.7));c.setLineDash([4,14]);c.strokeStyle=chalk;c.lineWidth=3;c.beginPath();c.moveTo(bx+70,y+34);c.lineTo(bx+bw-70,y+34);c.stroke();c.restore()});
  write(f.sub,W/2,by+bh-80,40,4.4,.5,BODY,'center','rgba(245,245,238,.7)');c.restore();
  gPill(c,f.cta,W/2,1560,4.8,t,f,'center');logoCorner(c,A,t,4.8,W-150,170,110)}}
];
const lerpN=(a,b,k)=>a+(b-a)*k;
// ===== İmza motionlar 2: kuaför, berber, emlak, spor, klinik, otomotiv, moda =====
function headSil(c,x,y,s,hair,skin='#E6B497',beard=null){c.save();c.translate(x,y);c.scale(s,s);
  c.fillStyle='#2E2A33';c.beginPath();c.moveTo(-210,420);c.bezierCurveTo(-200,250,-110,200,0,200);c.bezierCurveTo(110,200,200,250,210,420);c.fill();
  c.fillStyle=skin;c.fillRect(-45,90,90,130);c.beginPath();c.ellipse(0,0,120,155,0,0,Math.PI*2);c.fill();
  if(hair){c.fillStyle=hair;c.beginPath();c.moveTo(-128,10);c.bezierCurveTo(-140,-150,-60,-185,0,-185);c.bezierCurveTo(70,-185,145,-150,128,10);c.bezierCurveTo(110,-80,40,-110,0,-105);c.bezierCurveTo(-50,-110,-110,-80,-128,10);c.fill()}
  if(beard==='full'){c.fillStyle=hair||'#3B2418';c.beginPath();c.moveTo(-118,20);c.bezierCurveTo(-120,150,-50,190,0,192);c.bezierCurveTo(50,190,120,150,118,20);c.bezierCurveTo(80,90,40,70,0,72);c.bezierCurveTo(-40,70,-80,90,-118,20);c.fill()}
  else if(beard==='goatee'){c.fillStyle=hair||'#3B2418';c.beginPath();c.ellipse(0,105,40,52,0,0,Math.PI*2);c.fill();c.fillRect(-55,52,110,16)}
  else if(beard==='stubble'){c.fillStyle='rgba(60,36,24,.35)';c.beginPath();c.moveTo(-118,20);c.bezierCurveTo(-110,140,-50,170,0,172);c.bezierCurveTo(50,170,110,140,118,20);c.bezierCurveTo(80,80,40,62,0,64);c.bezierCurveTo(-40,62,-80,80,-118,20);c.fill()}
  c.restore()}
function scissors(c,x,y,s,open,rot=0,col='#D9DDE3'){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);const a=open*.35;
  [1,-1].forEach(sg=>{c.save();c.rotate(sg*a);const g=c.createLinearGradient(0,-20,260,20);g.addColorStop(0,'#9AA1AA');g.addColorStop(.5,col);g.addColorStop(1,'#7D848E');c.fillStyle=g;c.beginPath();c.moveTo(0,-14*sg);c.lineTo(270,-2*sg);c.lineTo(270,4*sg);c.lineTo(0,18*sg);c.closePath();c.fill();
   c.strokeStyle='#1F2328';c.lineWidth=16;c.beginPath();c.ellipse(-90,34*sg,50,34,sg*.3,0,Math.PI*2);c.stroke();c.fillStyle='#1F2328';c.beginPath();c.moveTo(0,-10*sg);c.lineTo(-48,24*sg);c.lineTo(-40,34*sg);c.lineTo(10,8*sg);c.fill();c.restore()});
  c.fillStyle='#C9CDD3';c.beginPath();c.arc(0,0,12,0,Math.PI*2);c.fill();c.restore()}
function chkTick(c,x,y,s,k,col='#22C55E'){if(k<=0)return;c.save();c.translate(x,y);c.scale(k,k);c.beginPath();c.arc(0,0,s,0,Math.PI*2);c.fillStyle=col;c.fill();c.strokeStyle='#fff';c.lineWidth=s*.22;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(-s*.42,0);c.lineTo(-s*.1,s*.32);c.lineTo(s*.45,-s*.3);c.stroke();c.restore()}

SIG['Güzellik & Kuaför']=[
{k:'makas',n:'Makas Kesimi',dur:7,def:{d1:'Eski görünümüne veda',title:'Yeni sezon, yeni sen',sub:'Kesim + fön ₺ 650 · Aura Studio',cta:'Randevu al'},labels:{d1:'Kesilen yazı',title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kart',.1,.6],['Makas',.6,1.9],['Ayrılma',1.9,2.6],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cy=900;const cut=prog(t,.6,1.9);const sep=eio(prog(t,1.9,2.6));
  const card=(clip)=>{c.save();if(clip==='top'){c.beginPath();c.rect(0,0,W,cy);c.clip();c.translate(0,-sep*700);c.rotate(-sep*.05)}else{c.beginPath();c.rect(0,cy,W,H);c.clip();c.translate(0,sep*800);c.rotate(sep*.04)}
   c.globalAlpha=1-sep*.6;rr(c,110,620,W-220,560,40);c.fillStyle=mix(f.p,f.a,.25);c.fill();c.font=font(800,fitFont(c,f.d1||'',W-320,84,40,800,DISP),DISP);c.fillStyle=fg;c.textAlign='center';c.fillText(f.d1||'',W/2,cy+28);c.textAlign='left';c.restore()};
  if(sep<1){c.save();c.globalAlpha=eo(prog(t,.1,.6));card('top');card('bottom');c.restore()}
  if(cut>0&&cut<1){c.save();c.setLineDash([18,14]);c.strokeStyle=f.a;c.lineWidth=4;c.beginPath();c.moveTo(80,cy);c.lineTo(80+(W-160)*cut,cy);c.stroke();c.restore()}
  if(t<2.3){const x=lerpN(-180,W+200,eio(prog(t,.5,2.1)));scissors(c,x,cy,1.05,.5+.5*Math.sin(t*16),0)}
  const e=eo(prog(t,2.3,3));if(e>0){sigHead(c,t,f,{...st,align:'center'},860,96,2.4);gSmall(c,f.sub,W/2,1150,42,2.8,t,fgA(f.p,.78),'center',900,2,600);gPill(c,f.cta,W/2,1340,3.1,t,f,'center')}
  logoCorner(c,A,t,3.1,W-150,170,110)}},
{k:'ayna',n:'Ayna Önce / Sonra',dur:7,def:{title:'Renk değişimi',sub:'Balyaj + bakım · 3 saat',d1:'ÖNCE',d2:'SONRA',cta:'Randevu al'},labels:{title:'Başlık',sub:'Açıklama',d1:'Önce etiketi',d2:'Sonra etiketi',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Ayna',.1,.8],['Dönüşüm',1.4,2.6],['Başlık',2.2,3]],
 draw(c,t,f,A,st){const cx=W/2,cy=860,rx=300,ry=400;const e=sp(t,.05,.8);const k=eio(prog(t,1.4,2.6));
  c.save();c.translate(cx,cy);c.scale(e,e);c.lineWidth=34;c.strokeStyle=goldGrad(c,-rx,-ry,rx,ry);c.beginPath();c.ellipse(0,0,rx+20,ry+20,0,0,Math.PI*2);c.stroke();
  c.beginPath();c.ellipse(0,0,rx,ry,0,0,Math.PI*2);c.clip();const bg=c.createLinearGradient(0,-ry,0,ry);bg.addColorStop(0,'#F2E6E0');bg.addColorStop(1,'#CDB4AA');c.fillStyle=bg;c.fillRect(-rx,-ry,2*rx,2*ry);
  if(A.photo){cover(c,A.photo,1.05)}else{const hc=mix('#4A3A30','#B5552E',clamp((k-.2)*1.4));headSil(c,0,40,1.2,hc)}
  if(k<1){c.save();c.beginPath();c.rect(-rx+2*rx*k,-ry,2*rx,2*ry);c.clip();if('filter' in c){}c.fillStyle='rgba(120,120,120,.55)';c.globalCompositeOperation='saturation';c.fillRect(-rx,-ry,2*rx,2*ry);c.globalCompositeOperation='source-over';c.fillStyle='rgba(255,255,255,.18)';c.fillRect(-rx,-ry,2*rx,2*ry);c.restore();
   c.fillStyle='rgba(255,255,255,.9)';c.fillRect(-rx+2*rx*k-3,-ry,6,2*ry)}
  c.restore();
  sparkle(c,cx+200,cy-300,36*(.7+.3*Math.sin(t*5)),clamp(prog(t,2.6,2.9)));sparkle(c,cx-230,cy+120,24,clamp(prog(t,2.8,3.1)));
  const lab=k<.5?f.d1:f.d2;c.save();c.font=font(800,34,MONO);const lw=c.measureText(lab).width+50;rr(c,cx-lw/2,cy+ry-10,lw,62,31);c.fillStyle=k<.5?'#111418':f.a;c.globalAlpha=e;c.fill();c.fillStyle=k<.5?'#FFFFFF':onColor(f.a);c.textAlign='center';c.fillText(lab,cx,cy+ry+32);c.restore();
  sigHead(c,t,f,st,250,80,2.2);gSmall(c,f.sub,W/2,1420,40,2.6,t,fgA(f.p,.78),'center',900,2,600);gPill(c,f.cta,W/2,1580,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'oje',n:'Renk Paleti',dur:7,def:{title:'Sonbahar oje renkleri',d1:'Bordo',d2:'Toprak',d3:'Nude',sub:'Kalıcı oje ₺ 450',cta:'Rengini seç'},labels:{title:'Başlık',d1:'Renk 1',d2:'Renk 2',d3:'Renk 3',sub:'Fiyat / not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Şişeler',.1,1.2],['Fırça',1.2,2.6],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cols=['#7A1E2C','#A0522D','#E3B8A0'];const names=[f.d1,f.d2,f.d3];
  names.forEach((nm,i)=>{const x=W/2+(i-1)*290,y=820;const e=sp(t,.1+i*.15,.6+i*.15);if(e<=0)return;c.save();c.translate(x,y);c.scale(e,e);
   c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(10,250,110,22,0,0,Math.PI*2);c.fill();
   const g=c.createLinearGradient(-100,0,100,0);g.addColorStop(0,mix(cols[i],'#000000',.3));g.addColorStop(.35,cols[i]);g.addColorStop(.5,mix(cols[i],'#FFFFFF',.35));g.addColorStop(.65,cols[i]);g.addColorStop(1,mix(cols[i],'#000000',.35));c.fillStyle=g;rr(c,-100,20,200,230,42);c.fill();
   c.fillStyle='rgba(255,255,255,.35)';rr(c,-70,40,26,180,13);c.fill();const lift=i===0?eio(prog(t,1.2,1.6))*(1-eio(prog(t,2.5,2.9)))*120:0;c.fillStyle='#1B1B1F';rr(c,-34,-150-lift,68,180,16);c.fill();c.fillStyle='#2A2A30';rr(c,-50,10-lift,100,24,8);c.fill();c.restore();
   c.font=font(700,36,BODY);c.fillStyle=fg;c.textAlign='center';c.globalAlpha=e;c.fillText(nm||'',x,y+330);c.globalAlpha=1;c.textAlign='left'});
  // fırça darbesi
  const p=eio(prog(t,1.6,2.5));if(p>0){c.save();c.beginPath();c.rect(90,1260,(W-180)*p,150);c.clip();c.fillStyle=cols[0];c.beginPath();c.moveTo(90,1290);for(let x=90;x<=W-90;x+=30)c.lineTo(x,1280+Math.sin(x*.05)*10);for(let x=W-90;x>=90;x-=30)c.lineTo(x,1395+Math.sin(x*.07)*12);c.fill();
   c.font=font(800,52,BODY);c.fillStyle='#FFFFFF';c.textAlign='center';c.fillText(f.sub||'',W/2,1355);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,84,.6);gPill(c,f.cta,W/2,1560,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}}
];

SIG['Berber & Erkek Bakım']=[
{k:'direk',n:'Berber Direği',dur:7,def:{title:'Usta Berber',sub:'Saç + sakal ₺ 450',d1:'Pzt–Cmt · 09:00–21:00',cta:'Sıranı ayırt'},labels:{title:'Başlık',sub:'Fiyat',d1:'Saatler',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Direk',.1,.9],['Başlık',.8,1.6],['Bilgi',1.6,2.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x=W/2-230,y0=430,h=900,r=90;const e=eo(prog(t,.1,.9));c.save();c.translate(0,(1-e)*-1200);
  // krom başlıklar
  const chrome=(yy,hh)=>{const g=c.createLinearGradient(x-r-20,0,x+r+20,0);g.addColorStop(0,'#6B7078');g.addColorStop(.4,'#F2F4F7');g.addColorStop(.6,'#B8BEC6');g.addColorStop(1,'#5C6168');c.fillStyle=g;rr(c,x-r-20,yy,2*r+40,hh,24);c.fill()};
  chrome(y0-90,90);c.beginPath();c.arc(x,y0-110,55,Math.PI,0);c.fillStyle='#D8DCE2';c.fill();chrome(y0+h,90);
  c.save();c.beginPath();c.rect(x-r,y0,2*r,h);c.clip();c.fillStyle='#FFFFFF';c.fillRect(x-r,y0,2*r,h);const off=(t*160)%240;
  for(let k=-6;k<10;k++){const yy=y0+k*240+off;[[0,'#D7263D'],[120,'#2F3BFF']].forEach(([d,col])=>{c.fillStyle=col;c.beginPath();c.moveTo(x-r,yy+d);c.lineTo(x+r,yy+d-140);c.lineTo(x+r,yy+d-80);c.lineTo(x-r,yy+d+60);c.fill()})}
  const sh=c.createLinearGradient(x-r,0,x+r,0);sh.addColorStop(0,'rgba(0,0,0,.35)');sh.addColorStop(.35,'rgba(255,255,255,.35)');sh.addColorStop(.55,'rgba(255,255,255,0)');sh.addColorStop(1,'rgba(0,0,0,.4)');c.fillStyle=sh;c.fillRect(x-r,y0,2*r,h);c.restore();c.restore();
  const tx=W/2-60;const k1=eo(prog(t,.8,1.5));c.globalAlpha=k1;c.font=font(900,fitFont(c,String(f.title).toLocaleUpperCase('tr'),460,120,50,900,COND),COND);c.fillStyle=fg;
  wrap(c,String(f.title).toLocaleUpperCase('tr'),460,3).forEach((l,i)=>c.fillText(l,tx+(1-k1)*60,620+i*120));c.globalAlpha=1;
  const k2=eo(prog(t,1.6,2.2));c.globalAlpha=k2;c.font=font(800,56,BODY);c.fillStyle=f.a;c.fillText(f.sub||'',tx,1000);c.font=font(600,36,BODY);c.fillStyle=fgA(f.p,.75);wrap(c,f.d1||'',440,2).forEach((l,i)=>c.fillText(l,tx,1080+i*46));c.globalAlpha=1;
  gPill(c,f.cta,tx,1300,2.4,t,f,'left');logoCorner(c,A,t,2.4,W-150,170,110)}},
{k:'ustura',n:'Ustura Çizgisi',dur:7,def:{title:'Sıcak havlu tıraş',sub:'Ustura ile klasik tıraş ₺ 300',cta:'Hemen gel'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Köpük',.1,.8],['Ustura',.9,2.6],['Başlık',1,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const y0=560,h=700;const p=eio(prog(t,.9,2.6));
  // yazı altta hazır
  c.save();c.font=font(900,fitFont(c,String(f.title).toLocaleUpperCase('tr'),900,150,60,900,COND),COND);c.fillStyle=fg;c.textAlign='center';wrap(c,String(f.title).toLocaleUpperCase('tr'),900,2).forEach((l,i,a)=>c.fillText(l,W/2,y0+h/2+40+(i-(a.length-1)/2)*150));c.restore();
  // köpük: henüz silinmemiş alan
  c.save();c.beginPath();c.rect(0,y0,W,h);c.clip();const edge=lerpN(-200,W+200,p);c.beginPath();c.moveTo(edge,y0);c.lineTo(W+400,y0);c.lineTo(W+400,y0+h);c.lineTo(edge-260,y0+h);c.closePath();c.clip();
  const fk=eo(prog(t,.1,.8));c.globalAlpha=fk;c.fillStyle='#F8F8F6';c.fillRect(0,y0,W,h);for(let i=0;i<160;i++){const r=Math.abs((Math.sin(i*12.9)*4375.5)%1);const x=r*W,y=y0+((i*53)%h);c.fillStyle=i%2?'#FFFFFF':'#E6E8EA';c.beginPath();c.arc(x,y,12+r*34,0,Math.PI*2);c.fill()}c.restore();
  // ustura
  if(p>0&&p<1){const ex=edge-130,ey=y0+h/2;c.save();c.translate(ex,ey);c.rotate(.36);const g=c.createLinearGradient(0,-60,0,60);g.addColorStop(0,'#F2F4F7');g.addColorStop(1,'#9AA1AA');c.fillStyle=g;rr(c,-50,-380,100,520,18);c.fill();c.fillStyle='#E9EDF2';c.fillRect(40,-380,10,520);c.fillStyle='#2B2B2F';rr(c,-40,140,80,320,30);c.fill();c.restore()}
  gSmall(c,f.sub,W/2,1400,42,2.6,t,fgA(f.p,.8),'center',900,2,700);gPill(c,f.cta,W/2,1560,2.9,t,f,'center');logoCorner(c,A,t,2.9,W/2,330,150)}},
{k:'sakal',n:'Sakal Stili',dur:8,def:{title:'Hangi sakal senin?',d1:'Dolgun',d2:'Keçi',d3:'Kirli sakal',sub:'Yüz şekline göre ücretsiz danışmanlık',cta:'Ustana sor'},labels:{title:'Başlık',d1:'Stil 1',d2:'Stil 2',d3:'Stil 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Yüz',.1,.8],['Stiller',.8,4.4],['Not',4.4,5]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const kinds=['full','goatee','stubble'];const names=[f.d1,f.d2,f.d3];const i=Math.min(2,Math.max(0,Math.floor((t-.8)/1.2)));const lt=t-.8-i*1.2;
  const e=sp(t,.05,.7);c.save();c.globalAlpha=e;c.beginPath();c.arc(W/2,900,360,0,Math.PI*2);c.fillStyle=fgA(f.p,.06);c.fill();c.restore();
  if(e>0){c.save();c.beginPath();c.arc(W/2,900,360,0,Math.PI*2);c.clip();headSil(c,W/2,830,1.45,'#2B1D14','#E2AE8E',t>.8?kinds[i]:null);c.restore()}
  // sayfa çevirme hissi: stil değişirken parlama
  if(t>.8&&lt<.25){c.fillStyle=`rgba(255,255,255,${(1-lt/.25)*.35})`;c.beginPath();c.arc(W/2,900,360,0,Math.PI*2);c.fill()}
  names.forEach((nm,j)=>{const x=W/2+(j-1)*300,y=1380;const on=j===i&&t>.8;c.save();c.font=font(800,38,BODY);const w=Math.max(220,c.measureText(nm||'').width+60);rr(c,x-w/2,y-48,w,96,48);c.fillStyle=on?f.a:fgA(f.p,.08);c.fill();c.fillStyle=on?onColor(f.a):fg;c.textAlign='center';c.fillText(nm||'',x,y+12);c.restore()});
  sigHead(c,t,f,st,300,84,.3);gSmall(c,f.sub,W/2,1520,36,4.4,t,fgA(f.p,.75),'center',900,2,600);gPill(c,f.cta,W/2,1660,4.6,t,f,'center');logoCorner(c,A,t,4.6,W-150,170,110)}}
];

SIG['Emlak & İnşaat']=[
{k:'cizim',n:'Çizimden Eve',dur:7,def:{title:'Bahçeli müstakil villa',sub:'4+1 · 220 m² · Beykoz',d1:'SATILIK',cta:'Detayları gör'},labels:{title:'Başlık',sub:'Özellikler',d1:'Etiket',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çizim',.1,1.8],['Boya',1.8,2.8],['Işıklar',2.6,3.2],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,by=1150;const draw_=prog(t,.1,1.8),paint=eio(prog(t,1.8,2.8)),lit=prog(t,2.6,3.2);
  const P=[[[-360,0],[360,0]],[[-320,0],[-320,-380]],[[320,0],[320,-380]],[[-380,-360],[0,-620],[380,-360]],[[-90,0],[-90,-210],[90,-210],[90,0]],[[-250,-300],[-140,-300],[-140,-190],[-250,-190],[-250,-300]],[[140,-300],[250,-300],[250,-190],[140,-190],[140,-300]],[[180,-470],[180,-560],[250,-560],[250,-430]]];
  c.save();c.translate(cx,by);
  if(paint>0){c.globalAlpha=paint;c.fillStyle=mix('#F1E7DA',f.p,.1);c.fillRect(-320,-380,640,380);c.fillStyle=mix(f.a,'#7A3B2E',.4);c.beginPath();c.moveTo(-380,-360);c.lineTo(0,-620);c.lineTo(380,-360);c.closePath();c.fill();c.fillStyle='#6B4A35';c.fillRect(-90,-210,180,210);c.fillStyle='#9C6B4A';c.fillRect(180,-560,70,130);
   const win=lit>0?mix('#5C7A99','#FFD27A',lit):'#5C7A99';c.fillStyle=win;c.fillRect(-250,-300,110,110);c.fillRect(140,-300,110,110);if(lit>0){glow(c,-195,-245,170,'rgba(255,210,122,A)',.45*lit);glow(c,195,-245,170,'rgba(255,210,122,A)',.45*lit)}c.fillStyle='#4C7A3A';c.fillRect(-420,0,840,26);c.globalAlpha=1}
  // çizgiler (eskiz)
  c.strokeStyle=paint>.5?'rgba(40,30,20,.6)':fg;c.lineWidth=6;c.lineJoin='round';c.lineCap='round';let total=0;P.forEach(seg=>{for(let i=1;i<seg.length;i++)total+=Math.hypot(seg[i][0]-seg[i-1][0],seg[i][1]-seg[i-1][1])});let budget=total*draw_;
  P.forEach(seg=>{c.beginPath();c.moveTo(...seg[0]);for(let i=1;i<seg.length;i++){const L=Math.hypot(seg[i][0]-seg[i-1][0],seg[i][1]-seg[i-1][1]);if(budget<=0)break;const k=Math.min(1,budget/L);c.lineTo(seg[i-1][0]+(seg[i][0]-seg[i-1][0])*k,seg[i-1][1]+(seg[i][1]-seg[i-1][1])*k);budget-=L}c.stroke()});c.restore();c.lineCap='butt';
  const te=sp(t,2.6,3.1);if(te>0&&f.d1){c.save();c.translate(cx+300,by-650);c.rotate(.08+Math.sin(t*2)*.03);c.scale(te,te);c.strokeStyle=fgA(f.p,.6);c.lineWidth=3;c.beginPath();c.moveTo(-60,-120);c.lineTo(-60,-40);c.moveTo(60,-120);c.lineTo(60,-40);c.stroke();rr(c,-150,-40,300,110,14);c.fillStyle='#D7263D';c.fill();c.fillStyle='#FFFFFF';c.font=font(900,60,COND);c.textAlign='center';c.fillText(f.d1,0,34);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,84,2.4);gSmall(c,f.sub,W/2,1300,42,2.7,t,fgA(f.p,.8),'center',900,2,700);gPill(c,f.cta,W/2,1480,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'pin',n:'Konum Pini',dur:7,def:{title:'Her şeye yürüme mesafesinde',d1:'Metro · 5 dk',d2:'Okul · 3 dk',d3:'Park · 2 dk',sub:'Mavi Vadi Evleri · Ataşehir',cta:'Konumu gör'},labels:{title:'Başlık',d1:'Yakın yer 1',d2:'Yakın yer 2',d3:'Yakın yer 3',sub:'Proje / semt',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Harita',.1,.8],['Pin',.8,1.4],['Mesafeler',1.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=860;const e=eo(prog(t,.1,.8));
  c.save();c.globalAlpha=e;c.beginPath();c.arc(cx,cy,430,0,Math.PI*2);c.clip();c.fillStyle=mix(f.p,lum(f.p)>.45?'#000000':'#FFFFFF',.06);c.fillRect(0,cy-430,W,860);c.strokeStyle=fgA(f.p,.16);c.lineWidth=22;
  [[-430,-140,430,-60],[-430,120,430,200],[-160,-430,-80,430],[150,-430,230,430],[-430,330,430,-330]].forEach(([a,b,cc,d])=>{c.beginPath();c.moveTo(cx+a,cy+b);c.lineTo(cx+cc,cy+d);c.stroke()});
  c.fillStyle='rgba(76,160,90,.3)';c.beginPath();c.ellipse(cx-260,cy+260,120,80,.3,0,Math.PI*2);c.fill();c.fillStyle='rgba(56,140,220,.25)';c.beginPath();c.ellipse(cx+300,cy-280,160,70,-.4,0,Math.PI*2);c.fill();c.restore();
  c.strokeStyle=fgA(f.p,.25);c.lineWidth=3;c.beginPath();c.arc(cx,cy,430*e,0,Math.PI*2);c.stroke();
  for(let i=0;i<3;i++){const q=((t-1.2)*.6+i/3)%1;if(t>1.2){c.strokeStyle=f.a;c.globalAlpha=(1-q)*.6;c.lineWidth=4;c.beginPath();c.arc(cx,cy,q*300,0,Math.PI*2);c.stroke();c.globalAlpha=1}}
  const pe=prog(t,.8,1.4);if(pe>0){const py=cy-lerpN(500,0,eback(pe));c.save();c.translate(cx,py);c.fillStyle=f.a;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-30,-50,-80,-90,-80,-140);c.arc(0,-140,80,Math.PI,0);c.bezierCurveTo(80,-90,30,-50,0,0);c.fill();c.fillStyle=onColor(f.a);c.beginPath();c.arc(0,-140,32,0,Math.PI*2);c.fill();c.restore()}
  const spots=[[f.d1,-300,-200],[f.d2,290,90],[f.d3,-250,280]];spots.forEach(([s,dx,dy],i)=>{if(!s)return;const k=sp(t,1.5+i*.4,1.9+i*.4);if(k<=0)return;c.save();c.setLineDash([8,10]);c.strokeStyle=fgA(f.p,.6);c.lineWidth=4;c.beginPath();c.moveTo(cx,cy-60);c.lineTo(cx+dx*k,cy+dy*k);c.stroke();c.restore();
   c.save();c.translate(cx+dx,cy+dy);c.scale(k,k);c.font=font(800,34,BODY);const w=c.measureText(s).width+48;rr(c,-w/2,-36,w,72,36);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#111418';c.fill();c.strokeStyle=f.a;c.lineWidth=3;c.stroke();c.fillStyle=lum(f.p)>.45?'#111418':'#FFFFFF';c.textAlign='center';c.fillText(s,0,12);c.restore()});
  sigHead(c,t,f,st,270,80,.4);gSmall(c,f.sub,W/2,1400,42,3,t,fgA(f.p,.8),'center',900,2,700);gPill(c,f.cta,W/2,1560,3.2,t,f,'center');logoCorner(c,A,t,3.2,W-150,170,110)}},
{k:'kapi',n:'Kapı Açılışı',dur:7,def:{title:'Anahtar teslim 3+1',d1:'3+1',d2:'145 m²',d3:'₺ 9.750.000',sub:'Lansmana özel ödeme planı',cta:'Randevu al'},labels:{title:'Başlık',d1:'Oda',d2:'Alan',d3:'Fiyat',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kapı',.1,.7],['Açılış',.9,2],['İlan',1.8,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,dy=420,dw=520,dh=880;const op=eio(prog(t,.9,2));const e=eo(prog(t,.1,.7));c.save();c.globalAlpha=e;
  c.fillStyle=mix(f.p,'#000000',.3);rr(c,cx-dw/2-46,dy-46,dw+92,dh+46,20);c.fill();
  const ins=c.createLinearGradient(0,dy,0,dy+dh);ins.addColorStop(0,'#FFF4DC');ins.addColorStop(1,'#F2C98A');c.fillStyle=ins;c.fillRect(cx-dw/2,dy,dw,dh);glow(c,cx,dy+dh*.4,520,'rgba(255,230,170,A)',.6*op);
  // içerideki ilan kartı
  const ke=eo(prog(t,1.8,2.6));if(ke>0){c.save();c.globalAlpha=ke;c.translate(cx,dy+dh*.48+(1-ke)*60);[[f.d1,-140],[f.d2,0],[f.d3,140]].forEach(([s,y],i)=>{c.font=font(900,i===2?72:80,COND);c.fillStyle=i===2?'#B8460E':'#3A2A1A';c.textAlign='center';c.fillText(s||'',0,y)});c.restore()}
  // kapı kanadı: menteşe solda
  const w=dw*Math.cos(op*Math.PI*.46);c.fillStyle='#5A3A26';c.fillRect(cx-dw/2,dy,w,dh);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=6;[[.12,.06,.76,.4],[.12,.52,.76,.4]].forEach(([a,b,cc,d])=>{c.strokeRect(cx-dw/2+w*a,dy+dh*b,w*cc,dh*d)});c.fillStyle=goldGrad(c,0,0,30,30);c.beginPath();c.arc(cx-dw/2+w*.88,dy+dh*.52,14,0,Math.PI*2);c.fill();c.restore();
  sigHead(c,t,f,st,300,80,2);gSmall(c,f.sub,W/2,1440,42,2.6,t,fgA(f.p,.8),'center',900,2,700);gPill(c,f.cta,W/2,1600,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}}
];

SIG['Spor & Fitness']=[
{k:'halter',n:'Halter Plakaları',dur:7,def:{title:'30 günlük dönüşüm',d1:'30',sub:'Kişisel program + beslenme planı',cta:'Hemen başla'},labels:{title:'Başlık',d1:'Gün sayısı',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Bar',.1,.6],['Plakalar',.6,2.2],['Sayı',1,2.4],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cy=900;const e=eo(prog(t,.1,.6));c.save();c.globalAlpha=e;const g=c.createLinearGradient(0,cy-16,0,cy+16);g.addColorStop(0,'#E5E7EB');g.addColorStop(.5,'#9CA3AF');g.addColorStop(1,'#4B5563');c.fillStyle=g;rr(c,60,cy-14,W-120,28,14);c.fill();c.restore();
  const plates=[[150,380,'#111418'],[120,320,f.a],[100,260,'#374151']];[[1,-1]].forEach(()=>{});
  [-1,1].forEach(sg=>{let off=0;plates.forEach(([w,h,col],i)=>{const k=eback(clamp(prog(t,.6+i*.3,.95+i*.3)));const x=W/2+sg*(250+off+w/2)+sg*(1-k)*700;c.fillStyle=col;rr(c,x-w/2+10*sg,cy-h/2,w-20,h,18);c.fill();c.fillStyle='rgba(255,255,255,.12)';rr(c,x-w/2+10*sg+8,cy-h/2+10,10,h-20,5);c.fill();off+=w-10});
   c.fillStyle='#6B7280';rr(c,W/2+sg*(230)-14,cy-60,28,120,8);c.fill()});
  const n=parseInt(f.d1)||30;const cnt=Math.round(n*eio(prog(t,1,2.4)));c.font=font(900,260,COND);c.textAlign='center';c.fillStyle=fg;c.globalAlpha=eo(prog(t,1,1.4));c.fillText(String(cnt),W/2,cy-260);c.font=font(800,48,MONO);c.fillStyle=f.a;c.fillText('GÜN',W/2,cy-200);c.globalAlpha=1;c.textAlign='left';
  sigHead(c,t,f,{...st,align:'center'},1180,88,2);gSmall(c,f.sub,W/2,1380,40,2.4,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1540,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'nabiz',n:'Nabız Çizgisi',dur:7,def:{title:'Kardiyo haftası',d1:'%30',sub:'Tüm grup derslerinde bu hafta',cta:'Derse katıl'},labels:{title:'Başlık',d1:'Büyük sayı',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çizgi',.1,2],['Sayı',1.9,2.6],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cy=900;const p=prog(t,.1,2);const N=60;const pts=[];for(let i=0;i<=N;i++){const x=60+(W-120)*i/N;let y=cy;const m=i%15;if(m===6)y-=60;if(m===7)y+=40;if(m===8)y-=260;if(m===9)y+=120;if(m===10)y-=30;pts.push([x,y])}
  c.save();c.strokeStyle=fgA(f.p,.12);c.lineWidth=2;for(let x=60;x<W;x+=60){c.beginPath();c.moveTo(x,cy-360);c.lineTo(x,cy+260);c.stroke()}c.restore();
  const upto=Math.floor(N*p);c.save();c.strokeStyle=f.a;c.lineWidth=10;c.lineJoin='round';c.shadowColor=f.a;c.shadowBlur=24;c.beginPath();pts.slice(0,upto+1).forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.restore();
  if(p<1&&upto>0){const [x,y]=pts[upto];c.fillStyle='#FFFFFF';c.beginPath();c.arc(x,y,14,0,Math.PI*2);c.fill()}
  const bpm=Math.round(68+60*eio(prog(t,.1,2)));c.font=font(700,40,MONO);c.fillStyle=fgA(f.p,.6);c.fillText(`♥ ${bpm} BPM`,80,cy+220);
  const k=sp(t,1.9,2.5);if(k>0){c.save();c.translate(W/2,cy+40);c.scale(k,k);c.font=font(900,300,COND);c.textAlign='center';c.fillStyle=fg;c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,90,.6);gSmall(c,f.sub,W/2,1380,42,2.4,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1540,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'sise',n:'Hedef Şişesi',dur:7,def:{title:'Kampanya kontenjanı',d1:'80',sub:'Yıllık üyelikte 2 ay hediye · son 20 kişi',cta:'Yerini al'},labels:{title:'Başlık',d1:'Doluluk %',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Şişe',.1,.7],['Dolum',.7,2.6],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,y0=520,bw=300,bh=760;const target=clamp((parseInt(f.d1)||80)/100);const lv=target*eio(prog(t,.7,2.6));const e=sp(t,.1,.7);c.save();c.translate(cx,y0+bh/2);c.scale(e,e);c.translate(-cx,-(y0+bh/2));
  const body=()=>{c.beginPath();c.moveTo(cx-bw/2,y0+160);c.quadraticCurveTo(cx-bw/2,y0+90,cx-70,y0+60);c.lineTo(cx-70,y0);c.lineTo(cx+70,y0);c.lineTo(cx+70,y0+60);c.quadraticCurveTo(cx+bw/2,y0+90,cx+bw/2,y0+160);c.lineTo(cx+bw/2,y0+bh-30);c.quadraticCurveTo(cx+bw/2,y0+bh,cx+bw/2-30,y0+bh);c.lineTo(cx-bw/2+30,y0+bh);c.quadraticCurveTo(cx-bw/2,y0+bh,cx-bw/2,y0+bh-30);c.closePath()};
  c.save();body();c.clip();c.fillStyle=fgA(f.p,.08);c.fillRect(0,y0,W,bh);const wy=y0+bh-(bh-60)*lv;c.fillStyle=f.a;c.beginPath();c.moveTo(cx-bw,wy);for(let x=-bw;x<=bw;x+=10)c.lineTo(cx+x,wy+Math.sin(x*.03+t*5)*12);c.lineTo(cx+bw,y0+bh);c.lineTo(cx-bw,y0+bh);c.fill();
  for(let i=0;i<12;i++){const r=Math.abs((Math.sin(i*7.1)*99.3)%1);const by=y0+bh-((t*120+i*90)%((bh-60)*lv+1));if(by>wy){c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.arc(cx-bw/2+30+r*(bw-60),by,5+r*8,0,Math.PI*2);c.fill()}}c.restore();
  body();c.strokeStyle=fg;c.lineWidth=8;c.stroke();c.fillStyle=fg;rr(c,cx-80,y0-60,160,70,14);c.fill();c.restore();
  c.font=font(900,150,COND);c.fillStyle=fg;c.textAlign='left';c.fillText('%'+Math.round(lv*100),cx+bw/2+40,y0+bh-(bh-60)*lv+50);c.font=font(700,30,MONO);c.fillStyle=fgA(f.p,.6);c.fillText('DOLDU',cx+bw/2+46,y0+bh-(bh-60)*lv+90);
  sigHead(c,t,f,st,300,84,.5);gSmall(c,f.sub,W/2,1420,40,2.6,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1580,2.8,t,f,'center');logoCorner(c,A,t,2.8,W-150,170,110)}}
];

SIG['Sağlık & Klinik']=[
{k:'dis',n:'Parlayan Diş',dur:7,def:{title:'Diş beyazlatma',sub:'Ön muayene ve kişiye özel plan',cta:'Randevu al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Diş',.1,.8],['Parlama',1,2.2],['Başlık',.8,1.6]],
 draw(c,t,f,A,st){const cx=W/2,cy=860;const e=sp(t,.1,.8);const wh=eio(prog(t,1,2.2));c.save();c.translate(cx,cy);c.scale(e*1.25,e*1.25);
  c.beginPath();c.moveTo(-170,-150);c.bezierCurveTo(-200,-260,-60,-280,0,-220);c.bezierCurveTo(60,-280,200,-260,170,-150);c.bezierCurveTo(150,-40,140,40,110,180);c.bezierCurveTo(95,250,50,250,40,180);c.bezierCurveTo(30,110,-30,110,-40,180);c.bezierCurveTo(-50,250,-95,250,-110,180);c.bezierCurveTo(-140,40,-150,-40,-170,-150);c.closePath();
  const g=c.createLinearGradient(-170,-260,170,250);g.addColorStop(0,mix('#E8D9B0','#FFFFFF',wh));g.addColorStop(1,mix('#C9B78C','#E9F1F7',wh));c.fillStyle=g;c.fill();c.strokeStyle='rgba(0,0,0,.08)';c.lineWidth=6;c.stroke();
  c.save();c.clip();c.globalAlpha=.6;c.fillStyle='#FFFFFF';c.beginPath();c.ellipse(-80,-140,40,90,-.5,0,Math.PI*2);c.fill();const swp=lerpN(-400,400,prog(t,1.2,2));c.globalAlpha=.5*(1-Math.abs(prog(t,1.2,2)-.5)*2);c.translate(swp,0);c.rotate(.4);c.fillRect(-30,-400,60,800);c.restore();c.restore();
  [[cx+230,cy-260,44,2],[cx-250,cy-140,30,2.2],[cx+200,cy+160,26,2.4]].forEach(([x,y,s,t0])=>sparkle(c,x,y,s*(.7+.3*Math.sin(t*5+t0)),clamp(prog(t,t0,t0+.3))));
  sigHead(c,t,f,st,300,88,.8);gSmall(c,f.sub,W/2,1340,42,2.2,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1500,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'steto',n:'Stetoskop Kalp',dur:7,def:{title:'Check-up günleri',sub:'Kapsamlı paket · tek gün, tek randevu',cta:'Bilgi al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Hortum',.1,2],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=800;const p=eio(prog(t,.1,2));const N=120;const P=[];for(let i=0;i<=N;i++){const a=i/N*Math.PI*2;const x=16*Math.pow(Math.sin(a),3),y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a));P.push([cx+x*22,cy+y*22])}
  // kulaklık kısmı
  c.save();c.strokeStyle='#4B5563';c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(cx-120,cy-520);c.quadraticCurveTo(cx-130,cy-380,cx,cy-320);c.moveTo(cx+120,cy-520);c.quadraticCurveTo(cx+130,cy-380,cx,cy-320);c.stroke();c.fillStyle='#9CA3AF';[cx-120,cx+120].forEach(x=>{c.beginPath();c.arc(x,cy-530,20,0,Math.PI*2);c.fill()});
  c.strokeStyle=f.a;c.lineWidth=18;c.beginPath();c.moveTo(cx,cy-320);c.lineTo(cx,cy-260);const up=Math.floor(N*p);for(let i=0;i<=up;i++){const j=(i+N/2)%N;const [x,y]=P[j];c.lineTo(x,y)}c.stroke();
  if(up>0){const [x,y]=P[(up+N/2)%N];c.fillStyle='#D1D5DB';c.beginPath();c.arc(x,y,46,0,Math.PI*2);c.fill();c.fillStyle='#9CA3AF';c.beginPath();c.arc(x,y,30,0,Math.PI*2);c.fill()}c.restore();c.lineCap='butt';
  sigHead(c,t,f,{...st,align:'center'},1320,90,1.6);gSmall(c,f.sub,W/2,1460,42,2.2,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1610,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'sira',n:'Sıra Numarası',dur:7,def:{title:'Sırada bekleme',d1:'042',sub:'Online randevu al, saatinde muayene ol',cta:'Randevu al'},labels:{title:'Başlık',d1:'Sıra no',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Ekran',.1,.7],['Numara',.8,2],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=sp(t,.1,.7);c.save();c.translate(W/2,820);c.scale(e,e);rr(c,-400,-260,800,500,40);c.fillStyle='#0B0F14';c.fill();c.strokeStyle='#2B3340';c.lineWidth=12;c.stroke();
  c.font=font(700,40,MONO);c.fillStyle='#7DD3FC';c.textAlign='center';c.fillText('SIRA NO',0,-160);const tgt=parseInt(f.d1)||42;const n=Math.round(lerpN(tgt-6,tgt,eio(prog(t,.8,2))));const s=String(n).padStart(3,'0');
  c.font=font(900,280,COND);c.fillStyle='#F87171';c.shadowColor='#F87171';c.shadowBlur=30;c.fillText(s,0,130);c.shadowBlur=0;const bl=t>2&&Math.floor(t*2.5)%2===0;if(bl){c.fillStyle='#22C55E';c.beginPath();c.arc(330,-180,16,0,Math.PI*2);c.fill()}c.restore();c.textAlign='left';
  const ke=sp(t,2.2,2.7);if(ke>0){c.save();c.translate(W/2,1160);c.rotate(-.04);c.scale(ke,ke);c.font=font(800,44,BODY);const w=c.measureText('Online randevuyla sıra yok').width+80;rr(c,-w/2,-48,w,96,48);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText('Online randevuyla sıra yok',0,14);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,90,2);gSmall(c,f.sub,W/2,1340,40,2.6,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1500,2.8,t,f,'center');logoCorner(c,A,t,2.8,W-150,170,110)}}
];

SIG['Otomotiv']=[
{k:'gosterge',n:'Hız Göstergesi',dur:7,def:{title:'Sıfır km fırsatı',d1:'%0',sub:'12 ay faiz · seçili modellerde',cta:'Test sürüşü'},labels:{title:'Başlık',d1:'Merkezdeki değer',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Gösterge',.1,.8],['İbre',.8,2.4],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=980,R=380;const e=sp(t,.1,.8);c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle='#0B0F14';c.beginPath();c.arc(0,0,R+30,0,Math.PI*2);c.fill();c.strokeStyle='#2B3340';c.lineWidth=14;c.stroke();
  const a0=Math.PI*.75,a1=Math.PI*2.25;for(let i=0;i<=24;i++){const a=a0+(a1-a0)*i/24;c.strokeStyle=i>18?'#F87171':'#E5E7EB';c.lineWidth=i%4?4:9;c.beginPath();c.moveTo(Math.cos(a)*(R-10),Math.sin(a)*(R-10));c.lineTo(Math.cos(a)*(R-(i%4?36:60)),Math.sin(a)*(R-(i%4?36:60)));c.stroke();
   if(i%4===0){c.fillStyle='#E5E7EB';c.font=font(700,36,MONO);c.textAlign='center';c.fillText(String(i*10),Math.cos(a)*(R-100),Math.sin(a)*(R-100)+12)}}
  const sw=eback(clamp(prog(t,.8,2.4)))*.82+Math.sin(t*9)*.004*(t>2.4?1:0);const na=a0+(a1-a0)*sw;c.strokeStyle=f.a;c.lineWidth=12;c.lineCap='round';c.shadowColor=f.a;c.shadowBlur=24;c.beginPath();c.moveTo(-Math.cos(na)*40,-Math.sin(na)*40);c.lineTo(Math.cos(na)*(R-70),Math.sin(na)*(R-70));c.stroke();c.shadowBlur=0;c.lineCap='butt';
  c.fillStyle='#1F2937';c.beginPath();c.arc(0,0,36,0,Math.PI*2);c.fill();c.font=font(900,120,COND);c.fillStyle='#FFFFFF';c.textAlign='center';c.globalAlpha=eo(prog(t,2,2.5));c.fillText(f.d1||'',0,230);c.globalAlpha=1;c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,90,.4);gSmall(c,f.sub,W/2,1470,40,2.4,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1620,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'far',n:'Anahtar ve Farlar',dur:7,def:{title:'Anahtarını bugün al',sub:'Takas + kredi · aynı gün teslim',cta:'Galeriye gel'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Anahtar',.1,1.2],['Farlar',1.3,2.2],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const on=eio(prog(t,1.3,1.9));
  // farlar: iki ışık konisi
  [[W/2-250],[W/2+250]].forEach(([x])=>{if(on<=0)return;c.save();c.globalAlpha=on*.85;const g=c.createLinearGradient(0,620,0,1500);g.addColorStop(0,'rgba(255,248,220,.9)');g.addColorStop(1,'rgba(255,248,220,0)');c.fillStyle=g;c.beginPath();c.moveTo(x-60,640);c.lineTo(x+60,640);c.lineTo(x+330,1520);c.lineTo(x-330,1520);c.closePath();c.fill();c.restore()});
  [W/2-250,W/2+250].forEach(x=>{c.save();c.fillStyle='#1F2937';rr(c,x-110,580,220,90,40);c.fill();c.fillStyle=on>0?mix('#6B7280','#FFF8DC',on):'#6B7280';rr(c,x-90,596,180,58,28);c.fill();if(on>0)glow(c,x,625,200,'rgba(255,248,220,A)',.7*on);c.restore()});
  // anahtar
  const kr=eio(prog(t,.1,1.2));const press=t>1.1&&t<1.3;c.save();c.translate(W/2,960);c.rotate((1-kr)*2.4);c.scale(press?.94:1,press?.94:1);c.fillStyle='#111418';rr(c,-110,-170,220,300,90);c.fill();c.strokeStyle='#374151';c.lineWidth=6;c.stroke();
  [[-50,-60],[50,-60],[0,40]].forEach(([x,y],i)=>{c.fillStyle=i===0&&t>1.1?f.a:'#374151';c.beginPath();c.arc(x,y,30,0,Math.PI*2);c.fill()});c.fillStyle='#9CA3AF';rr(c,-26,-270,52,110,10);c.fill();c.beginPath();c.arc(0,-280,26,0,Math.PI*2);c.lineWidth=10;c.strokeStyle='#9CA3AF';c.stroke();c.restore();
  if(press){c.strokeStyle=f.a;c.lineWidth=5;[60,110,160].forEach(r=>{c.globalAlpha=.6;c.beginPath();c.arc(W/2-50,900,r,-1.2,-.3);c.stroke()});c.globalAlpha=1}
  sigHead(c,t,f,st,300,90,1.8);gSmall(c,f.sub,W/2,1340,42,2.2,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1500,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'ekspertiz',n:'Ekspertiz Kontrolü',dur:8,def:{title:'Ekspertiz raporlu araçlar',d1:'Motor',d2:'Fren',d3:'Kaporta',sub:'Lastik · Elektrik · Şanzıman',cta:'Raporu iste'},labels:{title:'Başlık',d1:'Kontrol 1',d2:'Kontrol 2',d3:'Kontrol 3',sub:'Diğer kontroller',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Araç',.1,.8],['Kontroller',.9,3.4],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=900;const e=sp(t,.1,.8);c.save();c.translate(cx,cy);c.scale(e,e);
  // üstten araç
  c.fillStyle=fgA(f.p,.14);rr(c,-190,-400,380,800,150);c.fill();c.strokeStyle=fg;c.lineWidth=8;rr(c,-190,-400,380,800,150);c.stroke();c.fillStyle=fgA(f.p,.3);rr(c,-150,-250,300,170,40);c.fill();rr(c,-150,170,300,140,40);c.fill();
  [[-200,-250],[200,-250],[-200,250],[200,250]].forEach(([x,y])=>{c.fillStyle='#111418';rr(c,x-26,y-70,52,140,16);c.fill()});
  // tarama çizgisi
  const sc=((t-.9)*.9)%1;if(t>.9&&t<3.6){c.fillStyle=f.a;c.globalAlpha=.6;c.fillRect(-240,-420+sc*840,480,6);c.globalAlpha=1}c.restore();
  const pts=[[f.d1,-260,-280,'L'],[f.d2,260,0,'R'],[f.d3,-260,260,'L']];pts.forEach(([s,dx,dy,side],i)=>{if(!s)return;const k=sp(t,1+i*.7,1.4+i*.7);if(k<=0)return;const x=cx+dx,y=cy+dy;c.save();c.strokeStyle=fgA(f.p,.5);c.lineWidth=3;c.beginPath();c.moveTo(cx+dx*.45,y);c.lineTo(x,y);c.stroke();
   c.font=font(800,40,BODY);const w=c.measureText(s).width+120;const bx=side==='L'?x-w+40:x-40;c.translate(bx+w/2,y);c.scale(k,k);rr(c,-w/2,-44,w,88,44);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#111418';c.fill();c.fillStyle=lum(f.p)>.45?'#111418':'#FFFFFF';c.textAlign='left';c.fillText(s,-w/2+80,14);c.restore();chkTick(c,bx+38,y,24,k)});
  sigHead(c,t,f,st,270,82,.4);gSmall(c,f.sub,W/2,1430,38,3.4,t,fgA(f.p,.75),'center',900,2,600);gPill(c,f.cta,W/2,1580,3.6,t,f,'center');logoCorner(c,A,t,3.6,W-150,170,110)}}
];

SIG['Moda & E-ticaret']=[
{k:'aski',n:'Askıdaki Elbise',dur:7,def:{title:'Yeni sezon elbiseler',sub:'4 renk · S–XL beden',cta:'Koleksiyonu gör'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Askı',.1,.9],['Renkler',1.2,4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cols=[f.a,'#E11D74','#0EA5E9','#16A34A'];const ci=Math.floor(Math.max(0,t-1.2)/.9)%4;const swing=Math.sin(t*2.2)*.06*Math.exp(-Math.max(0,t-1)*.25)+(1-eo(prog(t,.1,.9)))*.5;
  c.strokeStyle=fgA(f.p,.5);c.lineWidth=10;c.beginPath();c.moveTo(80,520);c.lineTo(W-80,520);c.stroke();
  c.save();c.translate(W/2,520);c.rotate(swing);c.strokeStyle='#9CA3AF';c.lineWidth=8;c.beginPath();c.arc(0,-24,24,Math.PI*.9,Math.PI*2.1);c.stroke();c.lineWidth=10;c.beginPath();c.moveTo(0,0);c.lineTo(-170,90);c.lineTo(170,90);c.closePath();c.stroke();
  const g=c.createLinearGradient(-260,90,260,800);g.addColorStop(0,mix(cols[ci],'#FFFFFF',.15));g.addColorStop(1,mix(cols[ci],'#000000',.25));c.fillStyle=g;c.beginPath();c.moveTo(-120,90);c.quadraticCurveTo(0,140,120,90);c.lineTo(150,300);c.quadraticCurveTo(110,330,100,360);c.bezierCurveTo(200,520,260,700,280,820);c.quadraticCurveTo(0,880,-280,820);c.bezierCurveTo(-260,700,-200,520,-100,360);c.quadraticCurveTo(-110,330,-150,300);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.15)';c.fillRect(-110,340,220,22);c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=4;[-120,-40,40,120].forEach(x=>{c.beginPath();c.moveTo(x*.4,380);c.quadraticCurveTo(x,600,x*1.6,840);c.stroke()});c.restore();
  cols.forEach((col,i)=>{const x=W/2+(i-1.5)*120,y=1460;c.beginPath();c.arc(x,y,40,0,Math.PI*2);c.fillStyle=col;c.fill();if(i===ci&&t>1.2){c.strokeStyle=fg;c.lineWidth=6;c.beginPath();c.arc(x,y,52,0,Math.PI*2);c.stroke()}});
  sigHead(c,t,f,st,270,84,.6);gSmall(c,f.sub,W/2,1570,38,1.4,t,fgA(f.p,.75),'center',900,2,600);gPill(c,f.cta,W/2,1700,2,t,f,'center');logoCorner(c,A,t,2,W-150,170,110)}},
{k:'kargo',n:'Kargo Kutusu',dur:7,def:{title:'Siparişin yolda',sub:'Ücretsiz kargo · 30 gün kolay iade',d1:'ÜCRETSİZ KARGO',cta:'Alışverişe başla'},labels:{title:'Başlık',sub:'Açıklama',d1:'Bant yazısı',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kutu',.1,.8],['Kapaklar',1,1.8],['Ürün',1.6,2.4],['Başlık',2.2,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=1000,bw=520,bh=380;const e=sp(t,.1,.8);const op=eio(prog(t,1,1.8));const rise=eback(clamp(prog(t,1.6,2.4)));c.save();c.translate(cx,cy);c.scale(e,e);
  // ürün (tişört) kutudan yükselir
  if(rise>0){c.save();c.translate(0,-rise*330);c.fillStyle=f.a;c.beginPath();c.moveTo(-90,-110);c.lineTo(-200,-50);c.lineTo(-150,30);c.lineTo(-110,10);c.lineTo(-110,150);c.lineTo(110,150);c.lineTo(110,10);c.lineTo(150,30);c.lineTo(200,-50);c.lineTo(90,-110);c.quadraticCurveTo(0,-60,-90,-110);c.fill();c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-110,40,220,10);c.restore()}
  // kapaklar
  const fl=op*Math.PI*.8;[[-1],[1]].forEach(([sg])=>{c.save();c.translate(sg*bw/2,-bh/2);c.rotate(-sg*fl);c.fillStyle='#B98A57';c.fillRect(sg>0?-bw/2:0,-150*Math.cos(Math.min(fl,Math.PI/2))*0,bw/2*sg,-120);c.restore()});
  c.fillStyle='#C99A63';c.fillRect(-bw/2,-bh/2,bw,bh);c.fillStyle='rgba(0,0,0,.08)';c.fillRect(-bw/2,-bh/2,bw,40);
  c.fillStyle=mix(f.a,'#FFFFFF',.15);c.fillRect(-bw/2,-30,bw,70);c.font=font(900,44,COND);c.fillStyle=onColor(mix(f.a,'#FFFFFF',.15));c.textAlign='center';c.fillText(f.d1||'',0,20);c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,88,2.2);gSmall(c,f.sub,W/2,1340,40,2.6,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1500,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'etiket',n:'Düşen Fiyat Etiketi',dur:7,def:{title:'Sezon sonu',d1:'₺ 1.899',d2:'₺ 949',sub:'Tüm triko ve ceketlerde %50',cta:'Fırsatı yakala'},labels:{title:'Başlık',d1:'Eski fiyat',d2:'Yeni fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Etiket',.1,1],['Çizgi',1.2,1.6],['Yeni fiyat',1.6,2.4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=900;const e=prog(t,.1,1);const drop=(1-eback(e))*-900;const sw=Math.sin(t*3)*.08*Math.exp(-Math.max(0,t-1)*.6);c.save();c.translate(cx,500);c.strokeStyle=fgA(f.p,.6);c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(Math.sin(sw)*160,140+drop);c.stroke();
  c.translate(Math.sin(sw)*160,140+drop);c.rotate(sw);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#F6F3EE';c.beginPath();c.moveTo(0,0);c.lineTo(220,90);c.lineTo(220,640);c.lineTo(-220,640);c.lineTo(-220,90);c.closePath();c.fill();c.fillStyle=f.p;c.beginPath();c.arc(0,60,22,0,Math.PI*2);c.fill();
  c.textAlign='center';c.font=font(800,70,COND);c.fillStyle='#6B7280';c.fillText(f.d1||'',0,260);const ls=eio(prog(t,1.2,1.6));if(ls>0){c.strokeStyle='#D7263D';c.lineWidth=10;c.beginPath();c.moveTo(-140,238);c.lineTo(-140+280*ls,238);c.stroke()}
  const ne=sp(t,1.6,2.2);if(ne>0){c.save();c.translate(0,440);c.scale(ne,ne);c.font=font(900,150,COND);c.fillStyle='#D7263D';c.fillText(f.d2||'',0,40);c.restore()}c.restore();c.textAlign='left';
  sigHead(c,t,f,{...st},300,96,.6);gSmall(c,f.sub,W/2,1400,42,2.2,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1560,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}}
];


// ===== İmza motionlar 3: eğitim, teknoloji, etkinlik, turizm, ajans, çiçekçi, market, veteriner, mobilya =====
function boardBox(c,x,y,w,h,bg='#2E3B33'){c.fillStyle='#7A4E2A';rr(c,x-20,y-20,w+40,h+40,22);c.fill();const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,bg);g.addColorStop(1,mix(bg,'#000000',.35));c.fillStyle=g;c.fillRect(x,y,w,h)}
function chalkWrite(c,s,x,y,size,k,fam,align='left',col='rgba(245,245,238,.94)'){if(k<=0||!s)return;c.font=font(700,size,fam);c.textAlign=align;const w=c.measureText(s).width;const x0=align==='center'?x-w/2:align==='right'?x-w:x;c.save();c.beginPath();c.rect(x0-10,y-size,w*k+20,size*1.4);c.clip();c.fillStyle=col;c.fillText(s,x,y);c.restore();c.textAlign='left'}
function phoneFrame(c,x,y,w,h,scr){c.fillStyle='#0B0F14';rr(c,x-14,y-14,w+28,h+28,w*.14);c.fill();c.fillStyle=scr||'#111827';rr(c,x,y,w,h,w*.1);c.fill();c.fillStyle='#0B0F14';rr(c,x+w/2-50,y+14,100,26,13);c.fill()}
function flower(c,x,y,r,col,k,rot=0){if(k<=0)return;c.save();c.translate(x,y);c.rotate(rot);c.scale(k,k);for(let i=0;i<6;i++){c.save();c.rotate(i*Math.PI/3);const g=c.createLinearGradient(0,0,0,-r);g.addColorStop(0,mix(col,'#000000',.15));g.addColorStop(1,mix(col,'#FFFFFF',.25));c.fillStyle=g;c.beginPath();c.ellipse(0,-r*.55,r*.36,r*.6,0,0,Math.PI*2);c.fill();c.restore()}c.fillStyle='#F7C948';c.beginPath();c.arc(0,0,r*.28,0,Math.PI*2);c.fill();c.restore()}
function paw(c,x,y,s,col,a=1){c.save();c.globalAlpha=a;c.fillStyle=col;c.translate(x,y);c.scale(s,s);c.beginPath();c.ellipse(0,18,26,22,0,0,Math.PI*2);c.fill();[[-30,-12],[-11,-30],[11,-30],[30,-12]].forEach(([px,py])=>{c.beginPath();c.ellipse(px,py,10,13,0,0,Math.PI*2);c.fill()});c.restore()}

SIG['Eğitim & Kurs']=[
{k:'tahta',n:'Tahtaya Yazı',dur:7,def:{title:'YKS hazırlık',d1:'Haftada 12 saat ders',d2:'Deneme sınavları',d3:'Birebir koçluk',sub:'Kayıtlar 30 Kasım\'a kadar',cta:'Ön kayıt'},labels:{title:'Başlık',d1:'Madde 1',d2:'Madde 2',d3:'Madde 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Tahta',.1,.6],['Yazı',.7,3.6],['Not',3.6,4.2]],
 draw(c,t,f,A,st){const e=sp(t,.1,.6);c.save();c.translate(W/2,860);c.scale(e,e);c.translate(-W/2,-860);boardBox(c,90,420,W-180,880,'#1F3A2E');
  chalkWrite(c,f.title,W/2,580,96,clamp((t-.7)/.9),SERIF,'center');[f.d1,f.d2,f.d3].forEach((s,i)=>{const t0=1.7+i*.6;chalkWrite(c,'✓  '+(s||''),170,760+i*150,54,clamp((t-t0)/.5),BODY)});
  // tebeşir tozu ve silgi
  c.fillStyle='#E8E2D0';rr(c,W-330,1220,180,44,8);c.fill();c.fillStyle='#F4F1E6';rr(c,W-470,1236,100,18,9);c.fill();c.restore();
  gSmall(c,f.sub,W/2,1440,40,3.6,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1590,3.8,t,f,'center');logoCorner(c,A,t,3.8,W-150,170,110)}},
{k:'kitap',n:'Sayfa Çevirme',dur:7,def:{title:'İngilizce konuşma kulübü',sub:'Her cumartesi · 6 kişilik gruplar',d1:'Ünite 1',d2:'Ünite 2',cta:'Deneme dersi'},labels:{title:'Başlık',sub:'Açıklama',d1:'Sol sayfa',d2:'Sağ sayfa',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kitap',.1,.8],['Sayfalar',1,2.6],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=900,pw=380,ph=520;const e=sp(t,.1,.8);c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle=mix(f.a,'#000000',.4);rr(c,-pw-24,-ph/2-20,2*pw+48,ph+40,18);c.fill();
  c.fillStyle='#FBF8F1';c.fillRect(-pw,-ph/2,pw,ph);c.fillRect(0,-ph/2,pw,ph);c.fillStyle='rgba(0,0,0,.08)';c.fillRect(-20,-ph/2,40,ph);
  const lines=(x0,lab)=>{c.font=font(800,34,BODY);c.fillStyle='#1F2937';c.fillText(lab||'',x0+40,-ph/2+70);c.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<9;i++)c.fillRect(x0+40,-ph/2+120+i*40,pw-80-(i%3)*40,10)};lines(-pw,f.d1);lines(0,f.d2);
  for(let k=0;k<3;k++){const p=clamp(prog(t,1+k*.5,1.5+k*.5));if(p<=0||p>=1)continue;const ang=p*Math.PI;const sx=Math.cos(ang);c.save();c.fillStyle=sx>0?'#FFFFFF':'#F2EDE2';c.beginPath();c.moveTo(0,-ph/2);c.lineTo(pw*sx,-ph/2-40*Math.sin(ang));c.lineTo(pw*sx,ph/2-40*Math.sin(ang));c.lineTo(0,ph/2);c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.1)';c.stroke();c.restore()}c.restore();
  sigHead(c,t,f,st,300,84,.6);gSmall(c,f.sub,W/2,1300,40,2.4,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1460,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'kep',n:'Kep Fırlatma',dur:7,def:{title:'2026 mezunlarımız',d1:'%92',sub:'öğrencimiz hedeflediği okula yerleşti (temsili)',cta:'Sen de katıl'},labels:{title:'Başlık',d1:'Büyük oran',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kepler',.1,1.8],['Oran',1.2,2.4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);for(let i=0;i<7;i++){const r=Math.abs((Math.sin(i*31.7)*91.3)%1);const p=prog(t,.1+i*.08,1.6+i*.08);if(p<=0)continue;const x=120+r*(W-240)+Math.sin(p*3+i)*40;const y=1500-Math.sin(p*Math.PI*.9)*900;const rot=p*6*(i%2?1:-1);c.save();c.translate(x,y);c.rotate(rot);c.scale(1,.55);
  c.fillStyle='#111418';c.beginPath();c.moveTo(0,-90);c.lineTo(110,0);c.lineTo(0,90);c.lineTo(-110,0);c.closePath();c.fill();c.restore();c.save();c.translate(x,y+30);c.fillStyle='#111418';rr(c,-50,-10,100,50,10);c.fill();c.strokeStyle=f.a;c.lineWidth=5;c.beginPath();c.moveTo(0,-20);c.quadraticCurveTo(60,10,50,70);c.stroke();c.restore()}
  const k=sp(t,1.2,1.8);if(k>0){c.save();c.translate(W/2,1000);c.scale(k,k);c.font=font(900,320,COND);c.textAlign='center';c.fillStyle=fg;c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,88,.6);gSmall(c,f.sub,W/2,1120,40,1.8,t,fgA(f.p,.85),'center',860,2,700);gPill(c,f.cta,W/2,1600,2.4,t,f,'center');logoCorner(c,A,t,2.4,W-150,170,110)}}
];

SIG['Teknoloji & Uygulama']=[
{k:'bildirim',n:'Bildirim Yağmuru',dur:7,def:{title:'Siparişlerin tek ekranda',d1:'Yeni sipariş · ₺ 1.250',d2:'Ödeme alındı',d3:'Kargoya verildi',sub:'Ücretsiz 14 gün dene',cta:'İndir'},labels:{title:'Başlık',d1:'Bildirim 1',d2:'Bildirim 2',d3:'Bildirim 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Telefon',.1,.7],['Bildirimler',.8,2.8],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const px=W/2-230,py=560,pw=460,ph=880;const e=sp(t,.1,.7);c.save();c.translate(W/2,py+ph/2);c.scale(e,e);c.translate(-W/2,-(py+ph/2));const g=c.createLinearGradient(px,py,px+pw,py+ph);g.addColorStop(0,mix(f.a,'#000000',.3));g.addColorStop(1,mix(f.a,'#000000',.75));phoneFrame(c,px,py,pw,ph,g);
  c.font=font(300,120,BODY);c.fillStyle='#FFFFFF';c.textAlign='center';c.fillText('09:41',W/2,py+200);c.textAlign='left';
  [f.d1,f.d2,f.d3,f.d1].forEach((s,i)=>{const t0=.8+i*.5;const k=eback(clamp(prog(t,t0,t0+.4)));if(k<=0||!s)return;const y=py+280+i*130-(t>t0+.4?0:0);c.save();c.translate(W/2,y+50);c.scale(k,k);c.fillStyle='rgba(255,255,255,.88)';rr(c,-pw/2+24,-50,pw-48,104,24);c.fill();c.fillStyle=f.a;rr(c,-pw/2+44,-30,64,64,14);c.fill();c.font=font(800,28,BODY);c.fillStyle='#111418';c.fillText(String(s).slice(0,22),-pw/2+124,-4);c.font=font(500,22,BODY);c.fillStyle='#6B7280';c.fillText('şimdi',-pw/2+124,28);c.restore()});c.restore();
  sigHead(c,t,f,st,300,84,.5);gSmall(c,f.sub,W/2,1560,38,2.6,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1690,2.8,t,f,'center');logoCorner(c,A,t,2.8,W-150,170,110)}},
{k:'ikon',n:'Zıplayan Uygulama',dur:7,def:{title:'Bütçe takibi artık kolay',d1:'4,8',sub:'App Store ve Google Play\'de',cta:'Ücretsiz indir'},labels:{title:'Başlık',d1:'Puan',sub:'Mağaza notu',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['İkon',.1,1.4],['Puan',1.4,2.2],['Başlık',1,1.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2;const b=t<1.6?Math.abs(Math.sin(t*Math.PI*2.2))*Math.exp(-t*1.4)*420:0;const sq=t<1.6&&b<20?1.15:1;const y=860-b;
  c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(cx,1080,180*(1-b/600),26,0,0,Math.PI*2);c.fill();
  c.save();c.translate(cx,y);c.scale(sq,2-sq);const g=c.createLinearGradient(-160,-160,160,160);g.addColorStop(0,mix(f.a,'#FFFFFF',.25));g.addColorStop(1,mix(f.a,'#000000',.25));c.fillStyle=g;rr(c,-160,-160,320,320,72);c.fill();c.fillStyle=onColor(f.a);c.font=font(900,180,COND);c.textAlign='center';c.fillText('₺',0,64);c.restore();c.textAlign='left';
  const k=eo(prog(t,1.4,2));if(k>0){c.globalAlpha=k;c.font=font(900,120,COND);c.fillStyle=fg;c.textAlign='center';c.fillText(f.d1||'',cx-120,1280);for(let i=0;i<5;i++){c.fillStyle=i<Math.round(5*k)?'#FBBF24':fgA(f.p,.2);const sx=cx+20+i*58,sy=1240;c.beginPath();for(let j=0;j<10;j++){const r=j%2?11:26,a=-Math.PI/2+j*Math.PI/5;c.lineTo(sx+Math.cos(a)*r,sy+Math.sin(a)*r)}c.fill()}c.globalAlpha=1;c.textAlign='left'}
  sigHead(c,t,f,st,300,84,1);gSmall(c,f.sub,W/2,1400,38,2,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1560,2.3,t,f,'center');logoCorner(c,A,t,2.3,W-150,170,110)}},
{k:'terminal',n:'Koddan Ürüne',dur:7,def:{title:'Yeni sürüm yayında',d1:'v2.4',sub:'Karanlık mod · çevrimdışı çalışma · hızlı arama',cta:'Güncelle'},labels:{title:'Başlık',d1:'Sürüm',sub:'Yenilikler',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Terminal',.1,2.2],['Ürün',2.2,3],['Başlık',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const L=['$ npm run build','✓ derlendi (1,2 sn)','$ deploy --prod','✓ yayında: '+(f.d1||'')];const x=110,y=500,w=W-220,h=600;const morph=eio(prog(t,2.2,3));
  c.save();c.globalAlpha=1-morph*.85;c.fillStyle='#0B0F14';rr(c,x,y,w,h,24);c.fill();['#FF5F57','#FEBC2E','#28C840'].forEach((col,i)=>{c.fillStyle=col;c.beginPath();c.arc(x+40+i*34,y+36,10,0,Math.PI*2);c.fill()});
  c.font=font(500,36,MONO);L.forEach((s,i)=>{const k=clamp((t-.3-i*.45)/.35);if(k<=0)return;c.fillStyle=s.startsWith('✓')?'#4ADE80':'#E5E7EB';c.fillText(s.slice(0,Math.ceil(s.length*k)),x+40,y+130+i*70)});if(Math.floor(t*2.5)%2)c.fillRect(x+40,y+430,20,40);c.restore();
  if(morph>0){c.save();c.globalAlpha=morph;c.translate(W/2,y+h/2);c.scale(.8+.2*morph,.8+.2*morph);c.fillStyle=f.a;rr(c,-200,-200,400,400,90);c.fill();c.font=font(900,140,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d1||'',0,50);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,84,2.6);gSmall(c,f.sub,W/2,1300,38,2.9,t,fgA(f.p,.8),'center',880,2,600);gPill(c,f.cta,W/2,1460,3.1,t,f,'center');logoCorner(c,A,t,3.1,W-150,170,110)}}
];

SIG['Etkinlik & Düğün']=[
{k:'zarf',n:'Zarf Davetiye',dur:7,def:{title:'Ece & Kaan',sub:'Hayatımızın en güzel gününde sizi de aramızda görmek isteriz',d1:'14 Haziran 2027 · 19:00',cta:'Katılımını bildir'},labels:{title:'İsimler',sub:'Davet cümlesi',d1:'Tarih · saat',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Zarf',.1,.7],['Kapak',.8,1.4],['Kart',1.3,2.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=1050,ew=760,eh=480;const e=sp(t,.1,.7);const fl=eio(prog(t,.8,1.4));const up=eio(prog(t,1.3,2.4));c.save();c.translate(cx,cy);c.scale(e,e);
  c.fillStyle=mix(f.a,'#FFFFFF',.55);c.fillRect(-ew/2,-eh/2,ew,eh);
  // kart
  c.save();c.translate(0,-up*480);c.fillStyle='#FFFDF8';c.shadowColor='rgba(0,0,0,.18)';c.shadowBlur=30;c.fillRect(-ew/2+50,-eh/2+20,ew-100,eh+120);c.shadowBlur=0;c.textAlign='center';c.fillStyle='#3A2F2A';c.font=font(500,80,SERIF);c.fillText(f.title||'',0,-eh/2+170);c.font=font(600,30,BODY);c.fillStyle='#7A6A60';wrap(c,f.sub||'',ew-200,3).forEach((l,i)=>c.fillText(l,0,-eh/2+250+i*42));c.font=font(800,34,MONO);c.fillStyle=mix(f.a,'#000000',.2);c.fillText(f.d1||'',0,-eh/2+430);c.restore();
  // ön cepler
  c.fillStyle=mix(f.a,'#FFFFFF',.35);c.beginPath();c.moveTo(-ew/2,-eh/2);c.lineTo(0,40);c.lineTo(ew/2,-eh/2);c.lineTo(ew/2,eh/2);c.lineTo(-ew/2,eh/2);c.closePath();c.fill();c.fillStyle=mix(f.a,'#FFFFFF',.45);c.beginPath();c.moveTo(-ew/2,eh/2);c.lineTo(0,0);c.lineTo(ew/2,eh/2);c.closePath();c.fill();
  // kapak
  const sy=Math.cos(fl*Math.PI);c.save();c.translate(0,-eh/2);c.scale(1,sy);c.fillStyle=mix(f.a,'#FFFFFF',sy>0?.25:.6);c.beginPath();c.moveTo(-ew/2,0);c.lineTo(0,300);c.lineTo(ew/2,0);c.closePath();c.fill();c.restore();
  if(fl<.5){c.fillStyle='#B91C1C';c.beginPath();c.arc(0,-eh/2+300*sy-10,40,0,Math.PI*2);c.fill()}c.restore();c.textAlign='left';
  gPill(c,f.cta,W/2,1620,2.6,t,f,'center');logoCorner(c,A,t,2.6,W-150,170,110)}},
{k:'konfeti',n:'Konfetili Sayaç',dur:7,def:{title:'Yılbaşı gecesi',d1:'10',sub:'31 Aralık · canlı müzik · sınırlı masa',cta:'Masanı ayırt'},labels:{title:'Başlık',d1:'Sayaçın başladığı sayı',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Sayaç',.2,3],['Konfeti',3,7],['Başlık',3,3.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const n0=parseInt(f.d1)||10;const cnt=Math.max(0,Math.ceil(n0*(1-prog(t,.2,3))));const pulse=1+.15*Math.exp(-((t*n0/2.8)%1)*6);
  if(t<3.1){c.save();c.translate(W/2,900);c.scale(pulse,pulse);c.font=font(900,460,COND);c.textAlign='center';c.fillStyle=fg;c.fillText(String(cnt),0,150);c.restore();c.textAlign='left'}
  const cf=prog(t,3,6);if(cf>0){const cols=[f.a,'#F472B6','#60A5FA','#FBBF24','#34D399'];for(let i=0;i<120;i++){const r=Math.abs((Math.sin(i*12.9898)*43758.5)%1),r2=Math.abs((Math.sin(i*78.2)*1234.5)%1);const vx=(r-.5)*1400,vy=-800-r2*900;const tt=(t-3);const x=W/2+vx*tt*.6,y=900+vy*tt+900*tt*tt;if(y>H+40)continue;c.save();c.translate(x,y);c.rotate(tt*8*r);c.fillStyle=cols[i%5];c.fillRect(-10,-5,20,10);c.restore()}
   const k=sp(t,3,3.5);c.save();c.translate(W/2,900);c.scale(k,k);c.font=font(900,200,COND);c.textAlign='center';c.fillStyle=f.a;c.fillText('2027',0,70);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,90,.2);gSmall(c,f.sub,W/2,1340,40,3.3,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1500,3.5,t,f,'center');logoCorner(c,A,t,3.5,W-150,170,110)}},
{k:'masa',n:'Masa Düzeni',dur:7,def:{title:'Kır düğünü organizasyonu',d1:'120 kişilik',sub:'Süsleme · ses · ışık · ikram tek elden',cta:'Teklif al'},labels:{title:'Başlık',d1:'Kapasite',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Masalar',.2,2],['Işıklar',1.8,2.6],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const pos=[[0,0],[-260,-200],[260,-200],[-260,200],[260,200],[0,-380],[0,380]];const cx=W/2,cy=900;
  const li=prog(t,1.8,2.6);if(li>0){c.strokeStyle=fgA(f.p,.35);c.lineWidth=3;for(let k=0;k<3;k++){c.beginPath();c.moveTo(80,500+k*40);c.quadraticCurveTo(W/2,620+k*40,W-80,500+k*40);c.stroke();for(let i=0;i<12;i++){const u=i/11;const x=80+(W-160)*u,y=500+k*40+Math.sin(u*Math.PI)*120;glow(c,x,y,30,'rgba(255,220,140,A)',.8*li*(.6+.4*Math.sin(t*6+i+k)));c.fillStyle='#FFE8A8';c.globalAlpha=li;c.beginPath();c.arc(x,y,6,0,Math.PI*2);c.fill();c.globalAlpha=1}}}
  pos.forEach(([dx,dy],i)=>{const k=sp(t,.2+i*.2,.6+i*.2);if(k<=0)return;c.save();c.translate(cx+dx,cy+dy+180);c.scale(k,k);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#F6F3EE';c.beginPath();c.arc(0,0,92,0,Math.PI*2);c.fill();c.strokeStyle=f.a;c.lineWidth=6;c.stroke();
   for(let j=0;j<8;j++){const a=j*Math.PI/4;c.fillStyle=fgA(f.p,.4);c.beginPath();c.arc(Math.cos(a)*126,Math.sin(a)*126,18,0,Math.PI*2);c.fill()}flower(c,0,0,30,f.a,1,t);c.restore()});
  const k=sp(t,2.2,2.6);if(k>0)priceTag(c,f.d1,W/2,1520,t,2.2,f,-.04);
  sigHead(c,t,f,st,300,84,.6);gSmall(c,f.sub,W/2,1640,36,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1760,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}}
];

SIG['Turizm & Otel']=[
{k:'kart',n:'Oda Kartı',dur:7,def:{title:'Odanız hazır',d1:'Deniz manzaralı suit',sub:'Erken rezervasyonda %20 · kahvaltı dahil',cta:'Rezervasyon yap'},labels:{title:'Başlık',d1:'Oda tipi',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kapı',.1,.6],['Kart',.7,1.6],['Işık',1.6,2.2],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2;const ok=t>1.6;c.save();c.globalAlpha=eo(prog(t,.1,.6));c.fillStyle='#3F2A1E';rr(c,cx-300,420,600,1000,12);c.fill();c.fillStyle='rgba(255,255,255,.06)';rr(c,cx-250,470,500,420,10);c.fill();rr(c,cx-250,930,500,420,10);c.fill();
  c.fillStyle='#1F2937';rr(c,cx+140,820,110,220,18);c.fill();c.fillStyle=ok?'#22C55E':'#EF4444';c.beginPath();c.arc(cx+195,860,12,0,Math.PI*2);c.fill();if(ok)glow(c,cx+195,860,80,'rgba(34,197,94,A)',.6);c.restore();
  const k=eio(prog(t,.7,1.6));const kx=lerpN(cx-500,cx+195,k),ky=lerpN(1500,930,k);c.save();c.translate(kx,ky);c.rotate((1-k)*-.6);c.fillStyle=f.a;rr(c,-120,-76,240,152,16);c.fill();c.fillStyle=onColor(f.a);c.font=font(800,26,MONO);c.fillText('ROOM 1207',-100,-30);c.fillRect(-100,30,200,10);c.restore();
  const tc=sp(t,1.9,2.4);if(tc>0){c.save();c.translate(cx-60,700);c.scale(tc,tc);c.font=font(800,42,BODY);const w=c.measureText(f.d1||'').width+60;rr(c,-w/2,-44,w,88,44);c.fillStyle='#FFFFFF';c.fill();c.fillStyle='#111418';c.textAlign='center';c.fillText(f.d1||'',0,14);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,92,1.8);gSmall(c,f.sub,W/2,1530,38,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1680,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'perde',n:'Perde ve Manzara',dur:7,def:{title:'Güne denizle uyanın',sub:'Azure Bay Otel · Bodrum',cta:'Müsaitliği gör'},labels:{title:'Başlık',sub:'Otel · yer',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Pencere',.1,.6],['Perde',.8,2],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const x=140,y=420,w=W-280,h=900;const op=eio(prog(t,.8,2));c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const sky=c.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,'#7CC4F5');sky.addColorStop(.55,'#CFEAFB');sky.addColorStop(.56,'#1E7FB8');sky.addColorStop(1,'#0E4F7A');c.fillStyle=sky;c.fillRect(x,y,w,h);
  glow(c,x+w*.72,y+h*.3,200,'rgba(255,240,200,A)',.9);c.fillStyle='#FFF4D6';c.beginPath();c.arc(x+w*.72,y+h*.3,60,0,Math.PI*2);c.fill();
  for(let i=0;i<6;i++){c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;c.beginPath();for(let xx=0;xx<=w;xx+=20)c.lineTo(x+xx,y+h*.6+i*55+Math.sin(xx*.03+t*2+i)*6);c.stroke()}
  c.fillStyle='#2F5D3A';c.beginPath();c.moveTo(x,y+h*.56);c.quadraticCurveTo(x+w*.2,y+h*.46,x+w*.4,y+h*.56);c.fill();
  // perdeler
  [-1,1].forEach(sg=>{const pw=(w/2)*(1-op*.82);c.fillStyle=mix(f.a,'#FFFFFF',.55);const x0=sg<0?x:x+w-pw;c.fillRect(x0,y,pw,h);c.fillStyle='rgba(0,0,0,.08)';for(let k=0;k<pw;k+=36)c.fillRect(x0+k,y,10,h)});c.restore();
  c.strokeStyle='#FFFFFF';c.lineWidth=20;c.strokeRect(x,y,w,h);c.fillStyle='#E5E7EB';c.fillRect(x-40,y-30,w+80,24);
  sigHead(c,t,f,st,300,88,1.8);gSmall(c,f.sub,W/2,1440,40,2.2,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1600,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'valiz',n:'Valiz Etiketi',dur:7,def:{title:'Hafta sonu kaçamağı',d1:'BODRUM',sub:'2 gece konaklama + spa · kişi başı ₺ 8.900',cta:'Yerini ayırt'},labels:{title:'Başlık',d1:'Varış yeri',sub:'Paket',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Valiz',.1,.8],['Etiket',.9,1.8],['Başlık',1.4,2.2]],
 draw(c,t,f,A,st){const cx=W/2,cy=980;const e=sp(t,.1,.8);c.save();c.translate(cx,cy+(1-e)*400);c.rotate(Math.sin(t*2)*.01);
  c.fillStyle='#374151';rr(c,-90,-460,180,60,20);c.fill();c.fillStyle='#111418';rr(c,-60,-430,120,40,10);c.fill();
  const g=c.createLinearGradient(-280,0,280,0);g.addColorStop(0,mix(f.a,'#000000',.3));g.addColorStop(.5,f.a);g.addColorStop(1,mix(f.a,'#000000',.35));c.fillStyle=g;rr(c,-280,-400,560,720,60);c.fill();c.fillStyle='rgba(0,0,0,.15)';[-150,0,150].forEach(x=>rr(c,x-12,-380,24,680,12));c.fill();
  [-180,180].forEach(x=>{c.fillStyle='#111418';c.beginPath();c.arc(x,340,30,0,Math.PI*2);c.fill()});
  // etiket sallanır
  const k=sp(t,.9,1.5);if(k>0){c.save();c.translate(160,-300);c.rotate(.5+Math.sin(t*3)*.15*Math.exp(-Math.max(0,t-1.5)*.5));c.scale(k,k);c.strokeStyle='#92400E';c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(0,100);c.stroke();c.fillStyle='#FDF6E3';rr(c,-120,100,240,150,14);c.fill();c.fillStyle='#92400E';c.font=font(700,22,MONO);c.textAlign='center';c.fillText('VARIŞ',0,145);c.font=font(900,64,COND);c.fillStyle='#111418';c.fillText(f.d1||'',0,215);c.restore()}c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,88,1.4);gSmall(c,f.sub,W/2,1480,38,2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1630,2.3,t,f,'center');logoCorner(c,A,t,2.3,W-150,170,110)}}
];

SIG['Ajans & Kurumsal']=[
{k:'grafik',n:'Yükselen Grafik',dur:7,def:{title:'Takipçin 3 ayda 2 katı',d1:'×2',sub:'Strateji + içerik + reklam yönetimi (örnek sonuç)',cta:'Ücretsiz analiz'},labels:{title:'Başlık',d1:'Büyük sonuç',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çubuklar',.2,1.8],['Ok',1.6,2.4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const bx=140,by=1300,bw=W-280;const V=[.22,.3,.28,.42,.5,.66,.82,1];c.strokeStyle=fgA(f.p,.2);c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(bx,by-i*160);c.lineTo(bx+bw,by-i*160);c.stroke()}
  V.forEach((v,i)=>{const k=eback(clamp(prog(t,.2+i*.15,.6+i*.15)));const h=640*v*k;const w=bw/V.length-24;const x=bx+i*(bw/V.length)+12;c.fillStyle=i===V.length-1?f.a:fgA(f.p,.3);rr(c,x,by-h,w,h,10);c.fill()});
  const ak=eio(prog(t,1.6,2.4));if(ak>0){c.save();c.strokeStyle=fg;c.lineWidth=10;c.lineCap='round';const pts=V.map((v,i)=>[bx+i*(bw/V.length)+bw/V.length/2,by-640*v-40]);const n=Math.max(1,Math.floor((pts.length-1)*ak));c.beginPath();pts.slice(0,n+1).forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();const [ex,ey]=pts[n];c.fillStyle=fg;c.beginPath();c.arc(ex,ey,16,0,Math.PI*2);c.fill();c.restore();c.lineCap='butt'}
  const k=sp(t,2.2,2.6);if(k>0){c.save();c.translate(W-260,620);c.rotate(-.08);c.scale(k,k);c.font=font(900,180,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,60);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,84,.6);gSmall(c,f.sub,W/2,1420,36,2.4,t,fgA(f.p,.75),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.6,t,f,'center');logoCorner(c,A,t,2.6,W-150,170,110)}},
{k:'kartvizit',n:'Dönen Kartvizit',dur:7,def:{title:'Kuzey Kreatif',d1:'Marka · Web · Sosyal medya',sub:'kuzeykreatif.com · 0 212 000 00 00',cta:'Tanışalım'},labels:{title:'Marka',d1:'Hizmetler',sub:'İletişim',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kart',.1,2.4],['Buton',2.6,3.2]],
 draw(c,t,f,A,st){const cx=W/2,cy=860,cw=760,ch=440;const a=eio(prog(t,.4,2.2))*Math.PI+(1-eo(prog(t,.1,.6)))*-1;const sx=Math.cos(a);const back=sx<0;c.save();c.translate(cx,cy);c.scale(Math.abs(sx)*.98+.02,1);
  c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=50;c.shadowOffsetY=24;rr(c,-cw/2,-ch/2,cw,ch,24);c.fillStyle=back?'#F7F5F0':f.a;c.fill();c.shadowColor='transparent';
  if(!back){c.fillStyle=onColor(f.a);c.font=font(900,96,COND);c.textAlign='center';c.fillText(String(f.title||'').toLocaleUpperCase('tr'),0,24)}
  else{c.textAlign='left';c.fillStyle='#111418';c.font=font(800,54,BODY);c.fillText(f.title||'',-cw/2+60,-ch/2+110);c.font=font(600,30,BODY);c.fillStyle='#4B5563';c.fillText(f.d1||'',-cw/2+60,-ch/2+170);c.fillStyle=f.a;c.fillRect(-cw/2+60,-ch/2+210,90,8);c.font=font(600,28,MONO);c.fillStyle='#111418';wrap(c,f.sub||'',cw-120,2).forEach((l,i)=>c.fillText(l,-cw/2+60,ch/2-90+i*40))}c.restore();c.textAlign='left';
  gPill(c,f.cta,W/2,1420,2.6,t,f,'center');logoCorner(c,A,t,2.6,W-150,170,110)}},
{k:'slayt',n:'Sunum Akışı',dur:8,def:{title:'Nasıl çalışıyoruz?',d1:'Keşif',d2:'Strateji',d3:'Üretim',sub:'Ölçüm ve aylık rapor',cta:'Toplantı ayarla'},labels:{title:'Başlık',d1:'Adım 1',d2:'Adım 2',d3:'Adım 3',sub:'Son adım',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Slaytlar',.4,3.6],['Başlık',.2,1]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const S=[f.d1,f.d2,f.d3,f.sub];const i=Math.min(3,Math.floor(Math.max(0,t-.6)/.8));const lt=Math.max(0,t-.6)-i*.8;
  for(let j=3;j>=0;j--){const d=j-i;if(d<0)continue;const k=d===0?1:1-d*.08;const y=900+d*46,x=W/2;c.save();c.translate(x,y);c.scale(k,k);c.globalAlpha=d>2?0:1-d*.25;rr(c,-380,-260,760,520,28);c.fillStyle=d===0?(lum(f.p)>.45?'#FFFFFF':'#16181D'):fgA(f.p,.12);c.fill();
   if(d===0){c.font=font(700,30,MONO);c.fillStyle=f.a;c.fillText(`0${j+1}`,-320,-170);const sj=String(S[j]||'').toLocaleUpperCase('tr');c.font=font(900,fitFont(c,sj,640,110,50,900,COND),COND);c.fillStyle=lum(f.p)>.45?'#111418':'#FFFFFF';c.fillText(sj,-320,10);c.fillStyle=fgA(f.p,.2);[0,1,2].forEach(r=>rr(c,-320,70+r*44,560-r*120,20,10));c.fill()}c.restore()}
  if(lt<.25&&t>1.4){c.fillStyle=`rgba(255,255,255,${(1-lt/.25)*.15})`;c.fillRect(0,0,W,H)}
  for(let j=0;j<4;j++){c.fillStyle=j<=i?f.a:fgA(f.p,.2);rr(c,W/2-150+j*80,1300,60,10,5);c.fill()}
  sigHead(c,t,f,st,300,88,.2);gPill(c,f.cta,W/2,1480,3.6,t,f,'center');logoCorner(c,A,t,3.6,W-150,170,110)}}
];

SIG['Çiçekçi']=[
{k:'buket',n:'Açan Buket',dur:7,def:{title:'Sevgiliye kırmızı güller',sub:'Aynı gün teslim · el yazısı kart hediye',d1:'₺ 990',cta:'Sipariş ver'},labels:{title:'Başlık',sub:'Açıklama',d1:'Fiyat',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Saplar',.1,.9],['Çiçekler',.8,2.4],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2,by=1240;const F=[[-150,-520,'#E11D48'],[0,-600,'#F43F5E'],[150,-520,'#BE123C'],[-80,-420,'#FB7185'],[90,-430,'#E11D48'],[-210,-380,'#F9A8D4'],[220,-380,'#FDA4AF']];
  F.forEach(([dx,dy],i)=>{const k=eo(prog(t,.1+i*.05,.9+i*.05));c.strokeStyle='#3F7D3A';c.lineWidth=10;c.beginPath();c.moveTo(cx,by);c.quadraticCurveTo(cx+dx*.3,by+dy*.5,cx+dx*k,by+dy*k);c.stroke();if(i<4){c.fillStyle='#4C9A45';c.beginPath();c.ellipse(cx+dx*.5,by+dy*.45,40,16,-.6*Math.sign(dx||1),0,Math.PI*2);c.fill()}});
  F.forEach(([dx,dy,col],i)=>{const k=eback(clamp(prog(t,.8+i*.18,1.3+i*.18)));flower(c,cx+dx,by+dy,90,col,k,i)});
  // kağıt sargı
  c.fillStyle=mix(f.a,'#FFFFFF',.6);c.beginPath();c.moveTo(cx-260,by-180);c.lineTo(cx+260,by-180);c.lineTo(cx+80,by+300);c.lineTo(cx-80,by+300);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.08)';c.beginPath();c.moveTo(cx,by-180);c.lineTo(cx+260,by-180);c.lineTo(cx+80,by+300);c.closePath();c.fill();
  c.fillStyle=f.a;c.beginPath();c.ellipse(cx,by+60,90,30,0,0,Math.PI*2);c.fill();
  priceTag(c,f.d1,W-230,by+120,t,2.4,f,.1);sigHead(c,t,f,st,300,84,1.8);gSmall(c,f.sub,W/2,1640,36,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1770,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'kurdele',n:'Kurdele',dur:7,def:{title:'Anneler Günü hazır',sub:'Özel kutularda çiçek + çikolata',cta:'Hediyeni seç'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kutu',.1,.7],['Kurdele',.8,2.2],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2,cy=960,s=420;const e=sp(t,.1,.7);c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#F4EEE8';rr(c,-s/2,-s/2,s,s,24);c.fill();c.fillStyle='rgba(0,0,0,.06)';c.fillRect(-s/2,-s/2,s,40);
  for(let i=0;i<5;i++){flower(c,-120+i*60,-s/2-30,46,['#F472B6','#FB7185','#FDBA74','#F9A8D4','#E11D48'][i],1,i)}
  const p=eio(prog(t,.8,1.6));c.fillStyle=f.a;c.fillRect(-18,-s/2,36,s*p);c.fillRect(-s/2,-18,s*clamp((p-.2)/.8),36);
  const bk=sp(t,1.6,2.2);if(bk>0){c.save();c.scale(bk,bk);[-1,1].forEach(sg=>{c.beginPath();c.moveTo(0,0);c.bezierCurveTo(sg*140,-120,sg*190,40,0,0);c.fill()});[-1,1].forEach(sg=>{c.beginPath();c.moveTo(0,0);c.lineTo(sg*70,140);c.lineTo(sg*30,150);c.closePath();c.fill()});c.beginPath();c.arc(0,0,30,0,Math.PI*2);c.fillStyle=mix(f.a,'#000000',.2);c.fill();c.restore()}c.restore();
  sigHead(c,t,f,st,300,88,1.8);gSmall(c,f.sub,W/2,1390,40,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1550,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'saksi',n:'Büyüyen Saksı',dur:7,def:{title:'Ofisinize yeşil dokunuş',sub:'Bakımı kolay saksı bitkileri · ₺ 290\'dan',cta:'Bitkileri gör'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Saksı',.1,.6],['Büyüme',.6,2.6],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2,by=1180;const g=eio(prog(t,.6,2.6));c.fillStyle=f.a;c.beginPath();c.moveTo(cx-200,by);c.lineTo(cx+200,by);c.lineTo(cx+150,by+300);c.lineTo(cx-150,by+300);c.closePath();c.fill();c.fillStyle=mix(f.a,'#000000',.2);rr(c,cx-220,by-30,440,60,14);c.fill();
  c.strokeStyle='#3F7D3A';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(cx,by-20);c.quadraticCurveTo(cx-40,by-300*g,cx,by-620*g);c.stroke();
  for(let i=0;i<8;i++){const u=(i+1)/9;if(u>g)continue;const y=by-20-600*u;const sg=i%2?1:-1;const k=clamp((g-u)*4);c.save();c.translate(cx+(sg*10),y);c.rotate(sg*.7);c.scale(k,k);const lg=c.createLinearGradient(0,0,sg*180,0);lg.addColorStop(0,'#2F6B2A');lg.addColorStop(1,'#6CC062');c.fillStyle=lg;c.beginPath();c.ellipse(sg*90,0,100,38,0,0,Math.PI*2);c.fill();c.restore()}
  if(g>.95)flower(c,cx,by-640,70,'#F9A8D4',sp(t,2.4,2.8),t*.2);c.lineCap='butt';
  sigHead(c,t,f,st,300,84,1.8);gSmall(c,f.sub,W/2,1580,36,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1720,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}}
];

SIG['Market & Şarküteri']=[
{k:'sepet',n:'Dolan Sepet',dur:7,def:{title:'Haftalık alışverişin',d1:'₺ 742',sub:'500 TL üzeri kapıya ücretsiz teslim',cta:'Sipariş ver'},labels:{title:'Başlık',d1:'Toplam',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Sepet',.1,.6],['Ürünler',.7,2.6],['Toplam',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=1060;const items=[['#E11D48','elma'],['#FBBF24','peynir'],['#16A34A','salatalık'],['#F97316','portakal'],['#F5F5F4','süt'],['#92400E','ekmek']];
  items.forEach(([col,n],i)=>{const k=prog(t,.7+i*.3,1.1+i*.3);if(k<=0)return;const fall=eback(k);const tx=cx-200+(i%3)*200,ty=cy-140+Math.floor(i/3)*-90;const y=lerpN(380,ty,fall);c.save();c.translate(tx,y);c.rotate((1-fall)*2);
   c.fillStyle=col;if(n==='süt'){rr(c,-55,-110,110,190,16);c.fill();c.fillStyle='#2563EB';c.fillRect(-55,-40,110,40)}else if(n==='ekmek'){c.beginPath();c.ellipse(0,0,110,55,0,0,Math.PI*2);c.fill()}else if(n==='peynir'){c.beginPath();c.moveTo(-80,40);c.lineTo(80,40);c.lineTo(60,-50);c.closePath();c.fill()}else if(n==='salatalık'){c.beginPath();c.ellipse(0,0,110,32,.5,0,Math.PI*2);c.fill()}else{c.beginPath();c.arc(0,0,64,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.arc(-20,-20,18,0,Math.PI*2);c.fill()}c.restore()});
  // sepet
  c.save();c.translate(cx,cy);c.fillStyle=mix(f.a,'#000000',.1);c.beginPath();c.moveTo(-340,-60);c.lineTo(340,-60);c.lineTo(280,240);c.lineTo(-280,240);c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=6;for(let i=-4;i<=4;i++){c.beginPath();c.moveTo(i*70,-60);c.lineTo(i*58,240);c.stroke()}
  c.strokeStyle=mix(f.a,'#000000',.4);c.lineWidth=16;c.beginPath();c.moveTo(-300,-60);c.quadraticCurveTo(0,-420,300,-60);c.stroke();c.restore();
  const tot=parseInt(String(f.d1).replace(/\D/g,''))||742;const n=Math.round(tot*eio(prog(t,.7,2.6)));c.font=font(900,120,COND);c.fillStyle=fg;c.textAlign='center';c.fillText('₺ '+n.toLocaleString('tr-TR'),cx,cy+400);c.textAlign='left';
  sigHead(c,t,f,st,300,84,.4);gSmall(c,f.sub,W/2,1590,36,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1720,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'barkod',n:'Barkod Okuma',dur:7,def:{title:'Haftanın fırsatı',d1:'Zeytinyağı 1 L',d2:'₺ 279',sub:'Stoklarla sınırlı · Bereket Market',cta:'Markete gel'},labels:{title:'Başlık',d1:'Ürün',d2:'Fiyat',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Barkod',.1,.6],['Tarama',.7,1.6],['Fiyat',1.6,2.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=860;const e=sp(t,.1,.6);c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle='#FFFFFF';rr(c,-340,-200,680,400,26);c.fill();
  for(let i=0;i<46;i++){const w=[3,6,9,4][(i*7)%4];c.fillStyle='#111418';c.fillRect(-280+i*12.2,-150,w,230)}c.font=font(600,30,MONO);c.fillStyle='#111418';c.textAlign='center';c.fillText('8 690000 123456',0,140);
  const sc=prog(t,.7,1.6);if(sc>0&&sc<1){const y=-150+230*((Math.sin(sc*Math.PI*2)+1)/2);c.fillStyle='rgba(239,68,68,.85)';c.shadowColor='#EF4444';c.shadowBlur=20;c.fillRect(-320,y,640,6);c.shadowBlur=0}c.restore();
  if(t>1.6&&t<1.75){c.fillStyle='rgba(34,197,94,.25)';c.fillRect(0,0,W,H)}
  const k=sp(t,1.6,2.2);if(k>0){c.save();c.translate(cx,1240);c.scale(k,k);c.font=font(800,48,BODY);c.fillStyle=fg;c.textAlign='center';c.fillText(f.d1||'',0,-70);c.font=font(900,170,COND);c.fillStyle=f.a;c.fillText(f.d2||'',0,90);c.restore()}c.textAlign='left';
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.sub,W/2,1520,36,2.4,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1660,2.6,t,f,'center');logoCorner(c,A,t,2.6,W-150,170,110)}},
{k:'raf',n:'Raf Etiketi',dur:7,def:{title:'Sadece bu hafta',d1:'Çay 1 kg',d2:'₺ 389',d3:'₺ 299',sub:'Bereket Market · tüm şubelerde',cta:'Hemen gel'},labels:{title:'Başlık',d1:'Ürün',d2:'Eski fiyat',d3:'Yeni fiyat',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Raf',.1,.8],['Etiket',.9,2.2],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const ry=1080;const e=eo(prog(t,.1,.8));c.save();c.globalAlpha=e;for(let i=0;i<5;i++){const x=120+i*180;c.fillStyle=['#B45309','#DC2626','#065F46','#B45309','#1D4ED8'][i];rr(c,x,ry-330,150,320,16);c.fill();c.fillStyle='rgba(255,255,255,.85)';rr(c,x+20,ry-240,110,90,10);c.fill()}
  c.fillStyle='#9CA3AF';c.fillRect(80,ry,W-160,30);c.fillStyle='#6B7280';c.fillRect(80,ry+30,W-160,14);c.restore();
  const flip=eio(prog(t,1.2,1.8));c.save();c.translate(W/2,ry+130);c.scale(1,Math.abs(Math.cos(flip*Math.PI)));const yellow=flip>.5;rr(c,-300,-90,600,180,12);c.fillStyle=yellow?'#FDE047':'#FFFFFF';c.fill();c.strokeStyle='#111418';c.lineWidth=4;c.stroke();
  c.textAlign='left';c.font=font(700,30,BODY);c.fillStyle='#111418';c.fillText(f.d1||'',-270,-30);c.textAlign='right';if(!yellow){c.font=font(900,90,COND);c.fillText(f.d2||'',270,60)}else{c.font=font(700,40,COND);c.fillStyle='#6B7280';c.fillText(f.d2||'',270,-20);c.strokeStyle='#DC2626';c.lineWidth=5;c.beginPath();c.moveTo(130,-32);c.lineTo(270,-32);c.stroke();c.font=font(900,96,COND);c.fillStyle='#DC2626';c.fillText(f.d3||'',270,70);c.textAlign='left';c.font=font(900,36,BODY);c.fillStyle='#111418';c.fillText('İNDİRİM',-270,60)}c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,96,.5);gSmall(c,f.sub,W/2,1520,36,2.2,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1660,2.4,t,f,'center');logoCorner(c,A,t,2.4,W-150,170,110)}}
];

SIG['Veteriner & Pet Shop']=[
{k:'pati',n:'Pati İzleri',dur:7,def:{title:'Patili dostlarımıza',sub:'Aşı + genel kontrol · ₺ 650',cta:'Randevu al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['İzler',.1,2.4],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);for(let i=0;i<12;i++){const u=i/11;const x=W/2+Math.sin(u*Math.PI*1.6)*260+(i%2?70:-70),y=1700-u*1350;const k=clamp(prog(t,.1+i*.18,.3+i*.18));if(k<=0)continue;paw(c,x,y,1.4*k,i>=10?f.a:fgA(f.p,.45),1)}
  sigHead(c,t,f,{...st,align:'center'},860,110,1.8);gSmall(c,f.sub,W/2,1100,44,2.2,t,fgA(f.p,.85),'center',860,2,700);gPill(c,f.cta,W/2,1260,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'mama',n:'Mama Kabı',dur:7,def:{title:'Mamada %20 indirim',sub:'Tüm kuru mamalarda · aynı gün teslim',cta:'Sipariş ver'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kap',.1,.6],['Mama',.7,2.4],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2,cy=1080;const fill=eio(prog(t,.7,2.4));for(let i=0;i<60;i++){const r=Math.abs((Math.sin(i*41.3)*997.1)%1);const t0=.7+r*1.4;const k=prog(t,t0,t0+.45);if(k<=0)continue;const x=cx-120+r*240+Math.sin(i)*40,yEnd=cy-40-((i*13)%60)*fill;const y=lerpN(380,yEnd,Math.min(1,k*k));c.fillStyle=i%3?'#92400E':'#B45309';c.beginPath();c.ellipse(x,y,14,10,i,0,Math.PI*2);c.fill()}
  c.fillStyle=mix('#7C2D12','#92400E',.5);c.beginPath();c.ellipse(cx,cy-40,260*.95,40*fill+4,0,0,Math.PI*2);c.fill();
  const g=c.createLinearGradient(cx-320,0,cx+320,0);g.addColorStop(0,mix(f.a,'#000000',.3));g.addColorStop(.5,f.a);g.addColorStop(1,mix(f.a,'#000000',.35));c.fillStyle=g;c.beginPath();c.moveTo(cx-300,cy-40);c.lineTo(cx+300,cy-40);c.lineTo(cx+240,cy+150);c.lineTo(cx-240,cy+150);c.closePath();c.fill();c.fillStyle=mix(f.a,'#FFFFFF',.3);c.beginPath();c.ellipse(cx,cy-40,300,50,0,0,Math.PI*2);c.lineWidth=14;c.strokeStyle=mix(f.a,'#FFFFFF',.2);c.stroke();paw(c,cx,cy+60,1,onColor(f.a),.6);
  sigHead(c,t,f,st,300,92,1.8);gSmall(c,f.sub,W/2,1400,40,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1560,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'karne',n:'Aşı Karnesi',dur:8,def:{title:'Aşı takvimi hatırlatması',d1:'Karma aşı',d2:'Kuduz aşısı',d3:'İç-dış parazit',sub:'Pati Klinik · hatırlatma SMS\'i ücretsiz',cta:'Randevu al'},labels:{title:'Başlık',d1:'Aşı 1',d2:'Aşı 2',d3:'Aşı 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Karne',.1,.7],['Damgalar',1,3.2],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,y0=460;const e=sp(t,.1,.7);c.save();c.translate(cx,y0+450);c.scale(e,e);c.translate(-cx,-(y0+450));c.fillStyle='#FDF6E3';rr(c,140,y0,W-280,900,20);c.fill();c.fillStyle=f.a;rr(c,140,y0,W-280,110,20);c.fill();c.fillRect(140,y0+60,W-280,50);
  c.font=font(800,40,BODY);c.fillStyle=onColor(f.a);c.fillText('AŞI KARNESİ',190,y0+72);paw(c,W-220,y0+56,.8,onColor(f.a),.8);
  [f.d1,f.d2,f.d3].forEach((s,i)=>{const y=y0+230+i*220;c.font=font(700,44,BODY);c.fillStyle='#1F2937';c.fillText(s||'',200,y);c.fillStyle='rgba(0,0,0,.1)';c.fillRect(200,y+40,W-400,3);
   const k=sp(t,1+i*.7,1.3+i*.7);if(k>0){c.save();c.translate(W-290,y-10);c.rotate(-.2);c.scale(1.6-.6*k,1.6-.6*k);c.globalAlpha=clamp(k);c.strokeStyle='#16A34A';c.lineWidth=6;c.beginPath();c.arc(0,0,70,0,Math.PI*2);c.stroke();c.font=font(900,32,COND);c.fillStyle='#16A34A';c.textAlign='center';c.fillText('YAPILDI',0,12);c.restore();c.textAlign='left'}});c.restore();
  sigHead(c,t,f,st,300,80,.5);gSmall(c,f.sub,W/2,1480,36,3.2,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1620,3.4,t,f,'center');logoCorner(c,A,t,3.4,W-150,170,110)}}
];

SIG['Mobilya & Dekorasyon']=[
{k:'oda',n:'Dolan Oda',dur:7,def:{title:'Salonun 3 adımda yenilensin',sub:'Koltuk takımı + sehpa + halı · ₺ 39.900',cta:'Showroom\'a gel'},labels:{title:'Başlık',sub:'Paket',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Oda',.1,.6],['Eşyalar',.7,2.6],['Başlık',2.2,3]],
 draw(c,t,f,A,st){const cx=W/2,fy=1260;c.save();c.globalAlpha=eo(prog(t,.1,.6));c.fillStyle=mix('#EDE6DA',f.p,.1);c.fillRect(80,480,W-160,fy-480);c.fillStyle=mix('#C9B79C',f.p,.1);c.beginPath();c.moveTo(80,fy);c.lineTo(W-80,fy);c.lineTo(W-20,fy+200);c.lineTo(20,fy+200);c.closePath();c.fill();
  c.fillStyle='#D1C7B8';c.fillRect(W-330,560,180,240);c.fillStyle='#8FB8D8';c.fillRect(W-315,575,150,210);c.restore();
  const drop=(i,fn)=>{const k=eback(clamp(prog(t,.7+i*.45,1.15+i*.45)));if(k<=0)return;c.save();c.translate(0,(1-k)*-700);fn();c.restore()};
  drop(0,()=>{c.fillStyle=mix(f.a,'#000000',.1);rr(c,cx-200,fy+60,400,90,40);c.fill()});
  drop(1,()=>{c.fillStyle=f.a;rr(c,cx-330,fy-230,660,170,40);c.fill();c.fillStyle=mix(f.a,'#000000',.15);rr(c,cx-360,fy-120,720,150,30);c.fill();rr(c,cx-380,fy-200,80,220,30);c.fill();rr(c,cx+300,fy-200,80,220,30);c.fill();c.fillStyle='#3F2A1E';c.fillRect(cx-320,fy+30,20,40);c.fillRect(cx+300,fy+30,20,40)});
  drop(2,()=>{c.fillStyle='#6B4A35';rr(c,cx-150,fy+90,300,30,10);c.fill();c.fillRect(cx-130,fy+120,16,60);c.fillRect(cx+114,fy+120,16,60);c.fillStyle='#16A34A';c.beginPath();c.arc(cx+60,fy+60,34,0,Math.PI*2);c.fill()});
  drop(3,()=>{c.fillStyle='#E5E7EB';c.fillRect(cx-420,fy-560,6,330);c.fillStyle=mix(f.a,'#FFFFFF',.5);c.beginPath();c.moveTo(cx-470,fy-560);c.lineTo(cx-360,fy-560);c.lineTo(cx-390,fy-480);c.lineTo(cx-440,fy-480);c.closePath();c.fill();glow(c,cx-415,fy-470,180,'rgba(255,220,150,A)',.5*clamp(prog(t,2.4,2.8)))});
  sigHead(c,t,f,st,300,84,2.2);gSmall(c,f.sub,W/2,1560,36,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1690,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'kumas',n:'Kumaş Seçici',dur:8,def:{title:'Kumaşını sen seç',d1:'Kadife',d2:'Keten',d3:'Bukle',sub:'40 renk · ölçüye özel üretim',cta:'Numune iste'},labels:{title:'Başlık',d1:'Kumaş 1',d2:'Kumaş 2',d3:'Kumaş 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Koltuk',.1,.7],['Kumaşlar',.8,4],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cols=['#6D28D9','#A8A29E','#F5F0E6'];const nm=[f.d1,f.d2,f.d3];const i=Math.min(2,Math.max(0,Math.floor((t-.8)/1.1)));const lt=t-.8-i*1.1;const col=t<.8?'#9CA3AF':cols[i];
  const cx=W/2,cy=920;c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.7)),eo(prog(t,.1,.7)));c.fillStyle=mix(col,'#000000',.15);rr(c,-360,-140,720,220,60);c.fill();c.fillStyle=col;rr(c,-300,-60,600,150,40);c.fill();rr(c,-400,-80,110,250,50);c.fill();rr(c,290,-80,110,250,50);c.fill();
  if(i===0&&t>.8){c.fillStyle='rgba(255,255,255,.12)';for(let k=-300;k<300;k+=30)c.fillRect(k,-60,12,150)}if(i===2){c.fillStyle='rgba(0,0,0,.06)';for(let k=0;k<80;k++){c.beginPath();c.arc(-280+(k*53)%560,-50+(k*29)%130,6,0,Math.PI*2);c.fill()}}
  c.fillStyle='#3F2A1E';c.fillRect(-330,170,24,60);c.fillRect(306,170,24,60);c.restore();if(lt<.3&&t>.8){c.fillStyle=`rgba(255,255,255,${(1-lt/.3)*.2})`;c.fillRect(0,0,W,H)}
  cols.forEach((cl,j)=>{const x=W/2+(j-1)*280,y=1330;const on=j===i&&t>.8;c.save();c.translate(x,y);c.rotate((j-1)*.06);rr(c,-110,-80,220,160,18);c.fillStyle=cl;c.fill();if(on){c.strokeStyle=fg;c.lineWidth=8;c.stroke()}c.font=font(800,32,BODY);c.fillStyle=fg;c.textAlign='center';c.fillText(nm[j]||'',0,130);c.restore()});c.textAlign='left';
  sigHead(c,t,f,st,300,90,.4);gSmall(c,f.sub,W/2,1560,36,4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1690,4.2,t,f,'center');logoCorner(c,A,t,4.2,W-150,170,110)}},
{k:'metre',n:'Ölçü Bandı',dur:7,def:{title:'Evine tam oturan dolap',d1:'240 cm',sub:'Ücretsiz ölçü · 4 haftada montaj',cta:'Ölçü randevusu'},labels:{title:'Başlık',d1:'Ölçü',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Bant',.3,2],['Ölçü',1.8,2.4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x0=120,y=900;const p=eio(prog(t,.3,2));const L=(W-260)*p;
  c.fillStyle='#FACC15';rr(c,x0,y-40,L+20,80,6);c.fill();c.fillStyle='#111418';for(let k=0;k*20<L;k++){const h=k%10===0?44:k%5===0?30:16;c.fillRect(x0+20+k*20,y-40,3,h);if(k%10===0&&k>0){c.font=font(700,22,MONO);c.fillText(String(k*2),x0+24+k*20,y+28)}}
  c.fillStyle='#374151';rr(c,x0-120,y-120,200,240,40);c.fill();c.fillStyle='#FACC15';c.beginPath();c.arc(x0-20,y,70,0,Math.PI*2);c.fill();c.fillStyle='#374151';c.beginPath();c.arc(x0-20,y,30,0,Math.PI*2);c.fill();c.fillStyle='#9CA3AF';c.fillRect(x0+L+10,y-60,14,120);
  const k=sp(t,1.8,2.3);if(k>0){c.save();c.translate(x0+L-60,y-170);c.scale(k,k);c.font=font(900,110,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  c.strokeStyle=fgA(f.p,.3);c.lineWidth=4;c.strokeRect(120,1040,W-240,300);for(let i=1;i<4;i++){c.beginPath();c.moveTo(120+i*(W-240)/4,1040);c.lineTo(120+i*(W-240)/4,1340);c.stroke()}
  sigHead(c,t,f,st,300,90,.6);gSmall(c,f.sub,W/2,1460,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1600,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}}
];

// ===== İmza motionlar 4: temizlik, elektronik, teknik servis, kırtasiye, oyuncak, optik, kozmetik, spa, kreş, sürücü kursu, müzik, dans, fotoğraf =====
function star5(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let j=0;j<10;j++){const rr_=j%2?r*.42:r,a=-Math.PI/2+j*Math.PI/5;c.lineTo(x+Math.cos(a)*rr_,y+Math.sin(a)*rr_)}c.fill()}
function bubble(c,x,y,r,a=1){c.save();c.globalAlpha=a;c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=3;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();c.fillStyle='rgba(255,255,255,.18)';c.fill();c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.arc(x-r*.35,y-r*.35,r*.18,0,Math.PI*2);c.fill();c.restore()}
function phoneShape(c,x,y,w,h,scr){c.fillStyle='#0B0F14';rr(c,x-w/2,y-h/2,w,h,w*.15);c.fill();c.fillStyle=scr;rr(c,x-w/2+12,y-h/2+12,w-24,h-24,w*.12);c.fill()}

SIG['Temizlik & Ev Hizmetleri']=[
{k:'silecek',n:'Silinen Kir',dur:7,def:{title:'Tertemiz bir ev',sub:'3+1 ev temizliği · ₺ 2.400 · sigortalı ekip',cta:'Teklif al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kir',.1,.6],['Silecek',.8,2.4],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x0=110,y0=480,w=W-220,h=760;const p=eio(prog(t,.8,2.4));
  c.save();rr(c,x0,y0,w,h,30);c.clip();c.fillStyle='#BFE3F5';c.fillRect(x0,y0,w,h);c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.moveTo(x0,y0+h*.6);c.lineTo(x0+w*.6,y0);c.lineTo(x0+w*.75,y0);c.lineTo(x0,y0+h*.8);c.fill();
  // kir katmanı: silecek geçmeyen kısım
  c.save();const ex=x0+w*p;c.beginPath();c.rect(ex,y0,w,h);c.clip();c.fillStyle='rgba(120,100,70,.75)';c.fillRect(x0,y0,w,h);for(let i=0;i<60;i++){const r=Math.abs((Math.sin(i*17.3)*99.1)%1);c.fillStyle='rgba(70,55,35,.5)';c.beginPath();c.arc(x0+r*w,y0+((i*61)%h),10+r*40,0,Math.PI*2);c.fill()}c.restore();
  if(p>0&&p<1){c.fillStyle='#111418';rr(c,ex-14,y0-10,28,h+20,10);c.fill();c.fillStyle=f.a;rr(c,ex-30,y0+h/2-160,60,320,20);c.fill()}c.restore();
  c.strokeStyle=fg;c.lineWidth=14;rr(c,x0,y0,w,h,30);c.stroke();
  if(p>=1)[[x0+w*.8,y0+120,40],[x0+w*.2,y0+h-160,30],[x0+w*.55,y0+260,24]].forEach(([x,y,s],i)=>sparkle(c,x,y,s*(.7+.3*Math.sin(t*5+i)),clamp(prog(t,2.4+i*.15,2.7+i*.15))));
  sigHead(c,t,f,st,300,92,1.6);gSmall(c,f.sub,W/2,1390,38,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1540,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'kopuk',n:'Köpük Baloncukları',dur:7,def:{title:'Koltuk yıkama',d1:'%25',sub:'Kış öncesi kampanya · yerinde yıkama',cta:'Randevu al'},labels:{title:'Başlık',d1:'İndirim',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Baloncuklar',.1,7],['İndirim',1,1.8],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);for(let i=0;i<34;i++){const r=Math.abs((Math.sin(i*12.9)*437.5)%1),r2=Math.abs((Math.sin(i*7.7)*91.1)%1);const rad=20+r*80;const y=H+100-((t*(80+r2*120)+i*140)%(H+300));const x=80+r*(W-160)+Math.sin(t*1.5+i)*30;bubble(c,x,y,rad,.55+.45*r2)}
  const k=sp(t,1,1.6);if(k>0){c.save();c.translate(W/2,960);c.scale(k,k);c.beginPath();c.arc(0,0,260,0,Math.PI*2);c.fillStyle=f.a;c.fill();bubble(c,0,0,260,.6);c.font=font(900,220,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d1||'',0,76);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,96,.6);gSmall(c,f.sub,W/2,1360,40,1.8,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1520,2.1,t,f,'center');logoCorner(c,A,t,2.1,W-150,170,110)}},
{k:'ev',n:'Parlayan Ev',dur:7,def:{title:'Taşınma sonrası temizlik',d1:'Mutfak',d2:'Banyo',d3:'Camlar',sub:'Tek ekip, tek gün',cta:'Hemen ara'},labels:{title:'Başlık',d1:'Oda 1',d2:'Oda 2',d3:'Oda 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Ev',.1,.7],['Odalar',.9,3],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=980;c.save();c.globalAlpha=eo(prog(t,.1,.7));c.strokeStyle=fg;c.lineWidth=10;c.lineJoin='round';c.beginPath();c.moveTo(cx-360,cy-160);c.lineTo(cx,cy-460);c.lineTo(cx+360,cy-160);c.lineTo(cx+360,cy+300);c.lineTo(cx-360,cy+300);c.closePath();c.stroke();c.beginPath();c.moveTo(cx-360,cy+60);c.lineTo(cx+360,cy+60);c.moveTo(cx,cy-160);c.lineTo(cx,cy+300);c.stroke();c.restore();
  const R=[[f.d1,cx-180,cy-40],[f.d2,cx+180,cy-40],[f.d3,cx,cy+180]];R.forEach(([s,x,y],i)=>{const k=clamp(prog(t,.9+i*.6,1.3+i*.6));if(k<=0)return;c.save();c.globalAlpha=k*.25;c.fillStyle=f.a;if(i<2)c.fillRect(i?cx+5:cx-355,cy-155,350,210);else c.fillRect(cx-355,cy+65,710,230);c.restore();chkTick(c,x,y-30,36,eback(k));c.font=font(800,40,BODY);c.fillStyle=fg;c.textAlign='center';c.globalAlpha=k;c.fillText(s||'',x,y+50);c.globalAlpha=1;c.textAlign='left';sparkle(c,x+80,y-80,26*(.7+.3*Math.sin(t*6+i)),k)});
  sigHead(c,t,f,st,300,84,.5);gSmall(c,f.sub,W/2,1420,40,3,t,fgA(f.p,.85),'center',900,2,700);gPill(c,f.cta,W/2,1570,3.2,t,f,'center');logoCorner(c,A,t,3.2,W-150,170,110)}}
];

SIG['Elektronik & Telefon']=[
{k:'kutu',n:'Kutudan Çıkış',dur:7,def:{title:'Yeni model geldi',d1:'₺ 54.999',sub:'12 taksit · eski telefonunla takas',cta:'Mağazada dene'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kutu',.1,.7],['Kapak',.8,1.4],['Telefon',1.3,2.4],['Fiyat',2.4,3]],
 draw(c,t,f,A,st){const cx=W/2,cy=1120;const lid=eio(prog(t,.8,1.4));const up=eback(clamp(prog(t,1.3,2.2)));c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.7)),eo(prog(t,.1,.7)));
  c.fillStyle='#F3F4F6';rr(c,-260,-60,520,300,20);c.fill();c.fillStyle='#E5E7EB';rr(c,-240,-60,480,40,10);c.fill();
  const g=c.createLinearGradient(-150,0,150,0);g.addColorStop(0,'#1F2937');g.addColorStop(.5,mix(f.a,'#111418',.5));g.addColorStop(1,'#111418');c.save();c.translate(0,-up*420);phoneShape(c,0,-120,280,560,g);c.fillStyle='rgba(255,255,255,.18)';c.beginPath();c.moveTo(-110,-380);c.lineTo(20,-380);c.lineTo(-110,60);c.closePath();c.fill();c.fillStyle='#0B0F14';c.beginPath();c.arc(-80,-340,16,0,Math.PI*2);c.fill();c.restore();
  c.save();c.translate(0,-60-lid*560);c.rotate(lid*.25);c.fillStyle='#FFFFFF';rr(c,-270,-120,540,120,20);c.fill();c.font=font(800,34,BODY);c.fillStyle='#111418';c.textAlign='center';c.fillText('NEW',0,-48);c.restore();c.restore();c.textAlign='left';
  priceTag(c,f.d1,W-250,700,t,2.4,f,.08);sigHead(c,t,f,st,300,92,1.6);gSmall(c,f.sub,W/2,1520,38,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1660,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'sarj',n:'Şarj Dolumu',dur:7,def:{title:'Hızlı şarj aleti',d1:'30 dakikada %70',sub:'65W · tüm modellerle uyumlu · ₺ 899',cta:'Hemen al'},labels:{title:'Başlık',d1:'Vurgu',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Pil',.1,.6],['Dolum',.6,2.6],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=900,bw=320,bh=560;const lv=eio(prog(t,.6,2.6));c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.6)),eo(prog(t,.1,.6)));c.strokeStyle=fg;c.lineWidth=16;rr(c,-bw/2,-bh/2,bw,bh,44);c.stroke();c.fillStyle=fg;rr(c,-60,-bh/2-46,120,40,12);c.fill();
  const col=lv<.2?'#EF4444':lv<.5?'#F59E0B':'#22C55E';const fh=(bh-44)*lv;c.fillStyle=col;rr(c,-bw/2+22,bh/2-22-fh,bw-44,fh,24);c.fill();
  c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(20,-120);c.lineTo(-60,30);c.lineTo(0,30);c.lineTo(-20,140);c.lineTo(60,-10);c.lineTo(0,-10);c.closePath();c.globalAlpha=.5+.5*Math.sin(t*8);c.fill();c.globalAlpha=1;c.restore();
  c.font=font(900,150,COND);c.fillStyle=fg;c.textAlign='center';c.fillText('%'+Math.round(lv*100),cx,cy+bh/2+170);c.textAlign='left';
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.d1,W/2,460,48,1.4,t,f.a,'center',900,1,800);gSmall(c,f.sub,W/2,1520,36,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1650,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'takas',n:'Eskiden Yeniye',dur:7,def:{title:'Eski telefonunu getir',d1:'₺ 12.000\'e kadar',sub:'takas desteği · aynı gün veri aktarımı',cta:'Değerini öğren'},labels:{title:'Başlık',d1:'Takas değeri',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Eski',.1,.6],['Dönüşüm',.9,2.2],['Değer',2.2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=880;const m=eio(prog(t,.9,2.2));c.save();c.translate(cx,cy);c.rotate((1-m)*-.12+m*.0);c.scale(eo(prog(t,.1,.6)),eo(prog(t,.1,.6)));
  const w=lerpN(240,300,m),h=lerpN(440,600,m);phoneShape(c,0,0,w,h,m<.5?'#4B5563':mix(f.a,'#111418',.45));
  if(m<.5){c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.beginPath();c.moveTo(-60,-120);c.lineTo(10,-20);c.lineTo(-30,40);c.lineTo(60,140);c.moveTo(10,-20);c.lineTo(80,-60);c.stroke()}else{c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.moveTo(-w/2+20,-h/2+20);c.lineTo(0,-h/2+20);c.lineTo(-w/2+20,h/4);c.closePath();c.fill()}
  if(m>0&&m<1){c.fillStyle=`rgba(255,255,255,${(1-Math.abs(m-.5)*2)*.9})`;rr(c,-w/2-20,-h/2-20,w+40,h+40,50);c.fill()}c.restore();
  const k=sp(t,2.2,2.7);if(k>0){c.save();c.translate(cx,cy+420);c.scale(k,k);c.font=font(900,96,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,30);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,90,.4);gSmall(c,f.sub,W/2,1480,38,2.5,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1620,2.8,t,f,'center');logoCorner(c,A,t,2.8,W-150,170,110)}}
];

SIG['Teknik Servis & Tamir']=[
{k:'ekran',n:'Kırık Ekran Onarımı',dur:7,def:{title:'Ekranın kırıldı mı?',d1:'1 saatte',sub:'orijinal parça · 6 ay garanti',cta:'Hemen getir'},labels:{title:'Başlık',d1:'Süre',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kırık',.1,.6],['Onarım',1,2.4],['Süre',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=900;const fix=eio(prog(t,1,2.4));c.save();c.translate(cx,cy);phoneShape(c,0,0,360,700,mix('#1E3A5F','#0EA5E9',fix*.6));
  c.save();c.beginPath();rr(c,-168,-338,336,676,40);c.clip();c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=3;const cr=[[[0,-40],[-150,-300]],[[0,-40],[160,-200]],[[0,-40],[-130,250]],[[0,-40],[120,300]],[[0,-40],[170,60]],[[-70,-150],[-170,-120]],[[60,110],[170,170]]];
  const sweep=lerpN(-360,360,fix);c.beginPath();c.rect(-180,sweep,360,800);c.clip();cr.forEach(([[a,b],[x,y]])=>{c.beginPath();c.moveTo(a,b);c.lineTo((a+x)/2+12,(b+y)/2-8);c.lineTo(x,y);c.stroke()});c.restore();
  if(fix>0&&fix<1){c.fillStyle=f.a;c.shadowColor=f.a;c.shadowBlur=24;c.fillRect(-170,sweep-4,340,8);c.shadowBlur=0}if(fix>=1){chkTick(c,0,-20,70,sp(t,2.4,2.8))}c.restore();
  const k=sp(t,2.4,2.9);if(k>0){c.save();c.translate(W-230,560);c.rotate(.1);c.scale(k,k);c.beginPath();c.arc(0,0,120,0,Math.PI*2);c.fillStyle=f.a;c.fill();c.font=font(900,48,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(String(f.d1||'').toLocaleUpperCase('tr'),0,16);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,92,.3);gSmall(c,f.sub,W/2,1420,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'vida',n:'İçini Açalım',dur:7,def:{title:'Ücretsiz arıza tespiti',sub:'Telefon · tablet · bilgisayar',cta:'Cihazını getir'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Vidalar',.3,1.6],['Kapak',1.6,2.4],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=920,w=420,h=760;const op=eio(prog(t,1.6,2.4));c.save();c.translate(cx,cy);
  c.fillStyle='#0F172A';rr(c,-w/2,-h/2,w,h,50);c.fill();c.fillStyle='#14532D';rr(c,-w/2+30,-h/2+40,w-60,h*.45,14);c.fill();c.strokeStyle='#FBBF24';c.lineWidth=3;for(let i=0;i<8;i++){c.beginPath();c.moveTo(-w/2+50,-h/2+70+i*36);c.lineTo(-w/2+50+(i%3+1)*90,-h/2+70+i*36);c.lineTo(-w/2+50+(i%3+1)*90,-h/2+90+i*36);c.stroke()}
  c.fillStyle='#374151';rr(c,-80,-h/2+80,160,120,10);c.fill();c.fillStyle='#9CA3AF';c.font=font(700,24,MONO);c.textAlign='center';c.fillText('CPU',0,-h/2+150);c.fillStyle='#1E40AF';rr(c,-w/2+40,40,w-80,h/2-90,24);c.fill();c.fillStyle='#FFFFFF';c.font=font(800,40,BODY);c.fillText('BATARYA',0,170);c.textAlign='left';
  c.save();c.translate(op*(w+80),0);c.rotate(op*.25);c.fillStyle=mix(f.a,'#111418',.35);rr(c,-w/2,-h/2,w,h,50);c.fill();c.restore();
  [[-w/2+40,-h/2+40],[w/2-40,-h/2+40],[-w/2+40,h/2-40],[w/2-40,h/2-40]].forEach(([x,y],i)=>{const k=prog(t,.3+i*.3,.6+i*.3);if(op>0)return;c.save();c.translate(x,y-k*60);c.rotate(k*8);c.globalAlpha=1-k;c.fillStyle='#D1D5DB';c.beginPath();c.arc(0,0,16,0,Math.PI*2);c.fill();c.strokeStyle='#4B5563';c.lineWidth=4;c.beginPath();c.moveTo(-9,0);c.lineTo(9,0);c.moveTo(0,-9);c.lineTo(0,9);c.stroke();c.restore()});c.restore();
  sigHead(c,t,f,st,300,90,.4);gSmall(c,f.sub,W/2,1440,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'batarya',n:'Batarya Sağlığı',dur:7,def:{title:'Batarya değişimi',d1:'%62',d2:'%100',sub:'45 dakikada, orijinal batarya',cta:'Randevu al'},labels:{title:'Başlık',d1:'Eski sağlık',d2:'Yeni sağlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Gösterge',.2,1.4],['Değişim',1.6,2.6],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=900,R=300;const a0=parseInt(f.d1)/100||.62,a1=parseInt(f.d2)/100||1;const v=lerpN(0,a0,eio(prog(t,.2,1.4)))+(a1-a0)*eio(prog(t,1.6,2.6));
  c.lineWidth=46;c.lineCap='round';c.strokeStyle=fgA(f.p,.12);c.beginPath();c.arc(cx,cy,R,Math.PI*.75,Math.PI*2.25);c.stroke();c.strokeStyle=v<.7?'#F59E0B':'#22C55E';c.beginPath();c.arc(cx,cy,R,Math.PI*.75,Math.PI*.75+Math.PI*1.5*v);c.stroke();c.lineCap='butt';
  c.font=font(900,200,COND);c.fillStyle=fg;c.textAlign='center';c.fillText('%'+Math.round(v*100),cx,cy+60);c.font=font(700,32,MONO);c.fillStyle=fgA(f.p,.6);c.fillText('BATARYA SAĞLIĞI',cx,cy+130);c.textAlign='left';
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.sub,W/2,1380,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1530,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}}
];

SIG['Kırtasiye & Kitapçı']=[
{k:'kalem',n:'Kalemle Yazı',dur:7,def:{title:'Okula dönüş',sub:'Tüm kırtasiye setlerinde %15',cta:'Listeni getir'},labels:{title:'Kelime (kısa)',sub:'Açıklama',cta:'Buton'},max:{title:14},
 tracks:[['Zemin',0,7,1],['Kalem',.2,2.4],['Alt yazı',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);c.save();c.fillStyle='#FFFEF8';rr(c,90,500,W-180,820,20);c.fill();c.fillStyle='rgba(37,99,235,.15)';for(let y=580;y<1300;y+=60)c.fillRect(90,y,W-180,3);c.fillStyle='rgba(239,68,68,.35)';c.fillRect(170,500,3,820);c.restore();
  const word=String(f.title||'');c.font=font(500,fitFont(c,word,800,170,70,500,SERIF),SERIF);const w=c.measureText(word).width;const x0=W/2-w/2,y=900;const p=eio(prog(t,.2,2.4));c.save();c.beginPath();c.rect(x0-10,y-200,w*p+20,280);c.clip();c.fillStyle='#1E3A8A';c.fillText(word,x0,y);c.restore();
  const px=x0+w*p,py=y-30+Math.sin(t*20)*8*(p<1?1:0);c.save();c.translate(px,py);c.rotate(-.7);c.fillStyle='#FBBF24';rr(c,0,-20,360,40,6);c.fill();c.fillStyle='#F9D99A';c.beginPath();c.moveTo(0,-20);c.lineTo(-50,0);c.lineTo(0,20);c.fill();c.fillStyle='#111418';c.beginPath();c.moveTo(-34,-7);c.lineTo(-50,0);c.lineTo(-34,7);c.fill();c.fillStyle='#F472B6';rr(c,330,-20,50,40,6);c.fill();c.restore();
  gSmall(c,f.sub,W/2,1120,46,2.4,t,fg,'center',900,2,700);gPill(c,f.cta,W/2,1290,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'raf',n:'Kitap Rafı',dur:7,def:{title:'Haftanın çok satanları',d1:'İmza günü cumartesi 14:00',sub:'Sayfa Kitabevi',cta:'Kitabını ayırt'},labels:{title:'Başlık',d1:'Etkinlik',sub:'Mağaza',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Raf',.1,2],['Etkinlik',2,2.8],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const ry=1080;const off=(1-eio(prog(t,.1,2)))*-900;c.fillStyle=mix('#8B5E3C',f.p,.1);c.fillRect(60,ry,W-120,34);c.save();c.beginPath();c.rect(60,ry-480,W-120,480);c.clip();let x=80+off;const cols=['#B91C1C','#1D4ED8','#065F46','#F59E0B','#6D28D9','#0F766E','#BE185D','#374151'];
  for(let i=0;i<16;i++){const w=60+((i*37)%50),h=300+((i*53)%140);c.fillStyle=cols[i%8];rr(c,x,ry-h,w,h,6);c.fill();c.fillStyle='rgba(255,255,255,.7)';c.fillRect(x+10,ry-h+30,w-20,6);c.fillRect(x+10,ry-60,w-20,4);if(i===6){c.save();c.translate(x+w/2,ry-h-20);c.fillStyle=f.a;star5(c,0,0,34,f.a);c.restore()}x+=w+8}c.restore();
  const k=sp(t,2,2.6);if(k>0){c.save();c.translate(W/2,1260);c.scale(k,k);c.font=font(800,40,BODY);const w=c.measureText(f.d1||'').width+80;rr(c,-w/2,-48,w,96,48);c.fillStyle=f.a;c.fill();c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d1||'',0,14);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,90,.6);gSmall(c,f.sub,W/2,1420,40,2.4,t,fgA(f.p,.75),'center',900,1,700);gPill(c,f.cta,W/2,1560,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'liste',n:'Okul Listesi',dur:8,def:{title:'Okul listen hazır mı?',d1:'Defter seti',d2:'Boya kalemleri',d3:'Okul çantası',sub:'Listeni fotoğrafla gönder, biz hazırlayalım',cta:'WhatsApp\'tan gönder'},labels:{title:'Başlık',d1:'Madde 1',d2:'Madde 2',d3:'Madde 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Kağıt',.1,.7],['Tikler',1,3.2],['Not',3.2,3.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x0=170,y0=480;c.save();c.translate(W/2,y0+400);c.rotate(-.03);c.scale(eo(prog(t,.1,.7)),eo(prog(t,.1,.7)));c.translate(-W/2,-(y0+400));c.fillStyle='#FFFEF8';c.fillRect(x0,y0,W-2*x0,800);c.fillStyle='rgba(37,99,235,.18)';for(let y=y0+120;y<y0+800;y+=70)c.fillRect(x0,y,W-2*x0,2);c.fillStyle='rgba(239,68,68,.4)';c.fillRect(x0+80,y0,3,800);
  c.font=font(700,46,SERIF);c.fillStyle='#1E3A8A';c.fillText('Liste',x0+110,y0+90);[f.d1,f.d2,f.d3].forEach((s,i)=>{const y=y0+250+i*170;c.strokeStyle='#1E3A8A';c.lineWidth=4;c.strokeRect(x0+110,y-46,56,56);c.font=font(600,48,BODY);c.fillStyle='#1F2937';c.fillText(s||'',x0+200,y);const k=eio(prog(t,1+i*.7,1.3+i*.7));if(k>0){c.strokeStyle='#16A34A';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(x0+118,y-20);c.lineTo(x0+118+18*k,y-20+20*k);if(k>.5)c.lineTo(x0+136+(k-.5)*2*50,y-(k-.5)*2*60);c.stroke();c.lineCap='butt'}});c.restore();
  sigHead(c,t,f,st,300,84,.5);gSmall(c,f.sub,W/2,1440,36,3.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,3.4,t,f,'center');logoCorner(c,A,t,3.4,W-150,170,110)}}
];

SIG['Oyuncak & Bebek']=[
{k:'blok',n:'Blok Kulesi',dur:7,def:{title:'Hayal gücü yükselsin',d1:'OYUN',sub:'3 yaş ve üzeri ahşap bloklar · ₺ 690',cta:'Mağazaya gel'},labels:{title:'Başlık',d1:'Bloklardaki kelime',sub:'Açıklama',cta:'Buton'},max:{d1:6},
 tracks:[['Zemin',0,7,1],['Bloklar',.1,2.4],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const word=String(f.d1||'OYUN').toLocaleUpperCase('tr').slice(0,6).split('');const cols=['#EF4444','#F59E0B','#22C55E','#3B82F6','#A855F7','#EC4899'];const s=Math.min(200,(W-200)/word.length-14),base=1260;
  word.forEach((ch,i)=>{const k=prog(t,.1+i*.35,.55+i*.35);if(k<=0)return;const b=eback(clamp(k));const x=W/2+(i-(word.length-1)/2)*(s+14);const y=base-s/2-(i%2)*40-(1-b)*900;c.save();c.translate(x,y);c.rotate((1-b)*.6);c.fillStyle=cols[i%6];rr(c,-s/2,-s/2,s,s,18);c.fill();c.fillStyle='rgba(255,255,255,.25)';rr(c,-s/2+10,-s/2+10,s-20,24,10);c.fill();c.font=font(900,s*.65,COND);c.fillStyle='#FFFFFF';c.textAlign='center';c.fillText(ch,0,s*.24);c.restore()});c.textAlign='left';
  c.fillStyle='rgba(0,0,0,.15)';c.beginPath();c.ellipse(W/2,base+10,320,24,0,0,Math.PI*2);c.fill();
  sigHead(c,t,f,st,300,90,2);gSmall(c,f.sub,W/2,1430,38,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1580,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'surpriz',n:'Sürpriz Kutusu',dur:7,def:{title:'Doğum günü hediyesi',sub:'Ücretsiz hediye paketi · aynı gün teslim',cta:'Hediyeni seç'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kutu',.1,.8],['Fırlama',1,1.6],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=1120;const shake=t<1?Math.sin(t*40)*6*prog(t,.4,1):0;const pop=eback(clamp(prog(t,1,1.6)));c.save();c.translate(cx+shake,cy);c.fillStyle=f.a;rr(c,-220,-200,440,400,20);c.fill();c.fillStyle=mix(f.a,'#FFFFFF',.4);c.fillRect(-25,-200,50,400);
  // yaylı oyuncak
  if(pop>0){c.strokeStyle='#9CA3AF';c.lineWidth=10;c.beginPath();for(let i=0;i<=40;i++){const y=-200-i/40*380*pop;c.lineTo(Math.sin(i*1.2)*40,y)}c.stroke();c.save();c.translate(0,-200-380*pop-90);c.rotate(Math.sin(t*6)*.15);c.fillStyle='#FDE68A';c.beginPath();c.arc(0,0,100,0,Math.PI*2);c.fill();c.fillStyle='#111418';c.beginPath();c.arc(-34,-14,12,0,Math.PI*2);c.arc(34,-14,12,0,Math.PI*2);c.fill();c.strokeStyle='#111418';c.lineWidth=8;c.beginPath();c.arc(0,16,40,.2,Math.PI-.2);c.stroke();c.fillStyle='#EF4444';c.beginPath();c.arc(0,4,16,0,Math.PI*2);c.fill();c.fillStyle='#3B82F6';c.beginPath();c.moveTo(-60,-80);c.lineTo(0,-200);c.lineTo(60,-80);c.fill();c.restore()}
  c.save();c.translate(-220,-200-pop*40);c.rotate(-pop*1.2);c.fillStyle=mix(f.a,'#000000',.15);rr(c,0,-40,460,50,10);c.fill();c.restore();c.restore();
  sigHead(c,t,f,st,300,88,1.6);gSmall(c,f.sub,W/2,1460,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1610,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'balon',n:'Uçan Balonlar',dur:7,def:{title:'Minik Dünya 5 yaşında',d1:'%20',sub:'Tüm oyuncaklarda doğum günü indirimi',cta:'Kutlamaya gel'},labels:{title:'Başlık',d1:'İndirim',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Balonlar',.1,3],['İndirim',1.2,1.8]],
 draw(c,t,f,A,st){const cols=['#EF4444','#F59E0B','#22C55E','#3B82F6','#A855F7','#EC4899'];for(let i=0;i<9;i++){const r=Math.abs((Math.sin(i*19.3)*773.1)%1);const y=H+200-(t*(140+r*80)+i*120)%(H+500);const x=120+r*(W-240)+Math.sin(t*1.4+i)*30;c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;c.beginPath();c.moveTo(x,y+110);c.quadraticCurveTo(x+20,y+200,x,y+300);c.stroke();const g=c.createRadialGradient(x-30,y-40,10,x,y,110);g.addColorStop(0,mix(cols[i%6],'#FFFFFF',.4));g.addColorStop(1,cols[i%6]);c.fillStyle=g;c.beginPath();c.ellipse(x,y,90,110,0,0,Math.PI*2);c.fill()}
  const k=sp(t,1.2,1.8);if(k>0){c.save();c.translate(W/2,960);c.scale(k,k);c.beginPath();c.arc(0,0,240,0,Math.PI*2);c.fillStyle='#FFFFFF';c.fill();c.font=font(900,200,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,70);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,90,.4);gSmall(c,f.sub,W/2,1340,40,1.8,t,fgOf(f.p),'center',900,2,700);gPill(c,f.cta,W/2,1500,2.1,t,f,'center');logoCorner(c,A,t,2.1,W-150,170,110)}}
];

SIG['Optik']=[
{k:'tablo',n:'Göz Tablosu',dur:7,def:{title:'NET GÖR',sub:'Ücretsiz göz ölçümü · yeni sezon çerçeveler',cta:'Ölçüm randevusu'},labels:{title:'Son satır (kısa)',sub:'Açıklama',cta:'Buton'},max:{title:10},
 tracks:[['Zemin',0,7,1],['Tablo',.1,.6],['Netleşme',1,2.4],['Alt yazı',2.4,3]],
 draw(c,t,f,A,st){const fg='#111418';const x0=170,y0=440;c.fillStyle='#FFFFFF';rr(c,x0,y0,W-2*x0,920,20);c.fill();const rows=['E','F P','T O Z','L P E D','P E C F D',String(f.title||'NET GÖR').toLocaleUpperCase('tr')];const blur=Math.max(0,1-eio(prog(t,1,2.4)));
  rows.forEach((r,i)=>{const sz=[150,110,84,66,52,i===5?80:40][i];const y=y0+170+[0,150,270,370,460,620][i];c.save();if('filter' in c&&blur>.02)c.filter=`blur(${(blur*(i/2+1)*6).toFixed(1)}px)`;c.font=font(800,sz,BODY);c.fillStyle=i===5?f.a:fg;c.textAlign='center';try{c.letterSpacing=(i===5?'8px':'14px')}catch(e){}c.fillText(r,W/2,y);c.restore()});c.textAlign='left';
  // gözlük çerçevesi kayarak gelir
  const g=eio(prog(t,.6,1.4));c.save();c.translate(W/2,y0+580+(1-g)*600);c.strokeStyle='#111418';c.lineWidth=14;c.globalAlpha=g;c.beginPath();c.ellipse(-170,0,140,110,0,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(170,0,140,110,0,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(-30,-10);c.quadraticCurveTo(0,-40,30,-10);c.stroke();c.restore();
  gSmall(c,f.sub,W/2,1480,38,2.4,t,fgOf(f.p),'center',900,2,700);gPill(c,f.cta,W/2,1630,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'cam',n:'Bulanıktan Nete',dur:7,def:{title:'Mavi ışık filtreli cam',sub:'Ekran başında göz yorgunluğuna konfor · ₺ 1.290',cta:'Hemen dene'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Gözlük',.4,1.6],['Başlık',.1,.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const k=eio(prog(t,.4,1.6));const gy=920;
  // arka plan şehir/yazı bulanık, cam içi net
  const scene=(blur)=>{c.save();if('filter' in c&&blur)c.filter='blur(10px)';c.fillStyle=fgA(f.p,.15);for(let i=0;i<8;i++){c.fillRect(100+i*115,gy-120-((i*67)%180),90,400)}c.font=font(900,120,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText('NET',W/2,gy+60);c.restore()};scene(true);
  const cx=W/2,lens=[[cx-200,gy],[cx+200,gy]];c.save();c.beginPath();lens.forEach(([x,y])=>{c.moveTo(x+170,y);c.ellipse(x,y+(1-k)*500,170,140,0,0,Math.PI*2)});c.clip();c.fillStyle=f.p;c.fillRect(0,0,W,H);scene(false);c.fillStyle='rgba(120,180,255,.08)';c.fillRect(0,0,W,H);c.restore();
  c.save();c.translate(0,(1-k)*500);c.strokeStyle=fg;c.lineWidth=16;lens.forEach(([x,y])=>{c.beginPath();c.ellipse(x,y,170,140,0,0,Math.PI*2);c.stroke()});c.beginPath();c.moveTo(cx-30,gy-20);c.quadraticCurveTo(cx,gy-50,cx+30,gy-20);c.stroke();c.beginPath();c.moveTo(cx-370,gy-30);c.lineTo(cx-460,gy-60);c.moveTo(cx+370,gy-30);c.lineTo(cx+460,gy-60);c.stroke();c.restore();
  sigHead(c,t,f,st,300,84,.1);gSmall(c,f.sub,W/2,1300,38,1.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1460,2.1,t,f,'center');logoCorner(c,A,t,2.1,W-150,170,110)}},
{k:'gunes',n:'Güneş Gözlüğü Yansıması',dur:7,def:{title:'Yaz koleksiyonu',d1:'%30',sub:'Polarize güneş gözlüklerinde',cta:'Modelleri gör'},labels:{title:'Başlık',d1:'İndirim',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Gözlük',.1,.8],['Yansıma',.8,7],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,gy=900;const e=sp(t,.1,.8);c.save();c.translate(cx,gy);c.scale(e,e);[-1,1].forEach(sg=>{c.save();c.translate(sg*210,0);c.beginPath();c.moveTo(-190,-110);c.lineTo(190,-110);c.quadraticCurveTo(200,120,0,140);c.quadraticCurveTo(-200,120,-190,-110);c.closePath();const g=c.createLinearGradient(0,-110,0,140);g.addColorStop(0,'#1F2937');g.addColorStop(1,mix(f.a,'#111418',.5));c.fillStyle=g;c.fill();c.clip();
   // yansıma: gökyüzü + güneş + kıyı
   c.fillStyle='rgba(255,180,90,.35)';c.beginPath();c.arc(60+Math.sin(t)*20,-30,50,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,255,255,.12)';c.fillRect(-200,30,400,6);c.fillRect(-200,60,400,4);const sw=((t*.6)%2)-1;c.fillStyle='rgba(255,255,255,.25)';c.save();c.rotate(.5);c.fillRect(sw*300-20,-300,40,600);c.restore();c.restore();c.strokeStyle='#111418';c.lineWidth=12;c.beginPath();c.moveTo(sg*210-190,-110);c.lineTo(sg*210+190,-110);c.stroke()});c.strokeStyle='#111418';c.lineWidth=12;c.beginPath();c.moveTo(-20,-100);c.quadraticCurveTo(0,-130,20,-100);c.stroke();c.restore();
  const k=sp(t,1.4,1.9);if(k>0){c.save();c.translate(W/2,1240);c.scale(k,k);c.font=font(900,180,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,96,.6);gSmall(c,f.sub,W/2,1340,40,1.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1500,2.1,t,f,'center');logoCorner(c,A,t,2.1,W-150,170,110)}}
];

SIG['Kozmetik & Parfümeri']=[
{k:'parfum',n:'Parfüm Bulutu',dur:7,def:{title:'Yeni imza koku',sub:'50 ml · hediye paketiyle ₺ 2.490',cta:'Mağazada kokla'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Şişe',.1,.8],['Sıkma',1,1.4],['Bulut',1.2,4],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2-60,cy=1000;const e=sp(t,.1,.8);const press=t>1&&t<1.3?1:0;c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle='rgba(255,255,255,.18)';rr(c,-170,-140,340,420,60);c.fill();const g=c.createLinearGradient(-170,0,170,0);g.addColorStop(0,mix(f.a,'#FFFFFF',.2));g.addColorStop(.5,mix(f.a,'#FFFFFF',.55));g.addColorStop(1,mix(f.a,'#000000',.1));c.fillStyle=g;rr(c,-150,-100,300,360,50);c.fill();
  c.fillStyle='rgba(255,255,255,.4)';rr(c,-120,-80,30,300,15);c.fill();c.fillStyle='#D4AF37';rr(c,-50,-190,100,90,10);c.fill();c.fillStyle='#111418';rr(c,-40,-250+press*20,80,70,14);c.fill();c.fillStyle=onColor(f.a);c.font=font(500,30,SERIF);c.textAlign='center';c.fillText('N°1',0,90);c.restore();c.textAlign='left';
  const n=prog(t,1.1,4.5);if(n>0){for(let i=0;i<80;i++){const r=Math.abs((Math.sin(i*31.7)*517.3)%1),r2=Math.abs((Math.sin(i*11.1)*97.7)%1);const tt=clamp(n*1.4-r*.4);if(tt<=0)continue;const x=cx+40+tt*(260+r2*260),y=cy-230-tt*(r-.5)*400-tt*tt*60;c.globalAlpha=(1-tt)*.7;c.fillStyle=mix(f.a,'#FFFFFF',.6);c.beginPath();c.arc(x,y,4+tt*20*r2,0,Math.PI*2);c.fill()}c.globalAlpha=1}
  sigHead(c,t,f,st,300,92,1.8);gSmall(c,f.sub,W/2,1440,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'ruj',n:'Ruj Swatch',dur:7,def:{title:'Mat ruj serisi',d1:'Gül',d2:'Kiremit',d3:'Vişne',sub:'3 al 2 öde',cta:'Rengini bul'},labels:{title:'Başlık',d1:'Renk 1',d2:'Renk 2',d3:'Renk 3',sub:'Kampanya',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Rujlar',.1,1],['Sürme',1,2.8],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cols=['#D9768C','#C2410C','#7F1D1D'];const nm=[f.d1,f.d2,f.d3];cols.forEach((col,i)=>{const y=640+i*240;const p=eio(prog(t,1+i*.5,1.6+i*.5));
  c.save();c.fillStyle=col;c.beginPath();c.moveTo(220,y);for(let x=0;x<=600*p;x+=20)c.lineTo(220+x,y-26+Math.sin(x*.03+i)*6);for(let x=600*p;x>=0;x-=20)c.lineTo(220+x,y+40+Math.sin(x*.04+i)*8);c.fill();c.restore();
  const rx=220+600*p;const e=sp(t,.1+i*.2,.6+i*.2);c.save();c.translate(rx,y);c.rotate(-.5);c.scale(e,e);c.fillStyle='#D4AF37';rr(c,-30,10,60,120,8);c.fill();c.fillStyle='#111418';rr(c,-34,120,68,140,10);c.fill();c.fillStyle=col;c.beginPath();c.moveTo(-24,10);c.lineTo(-24,-50);c.lineTo(24,-70);c.lineTo(24,10);c.fill();c.restore();
  c.font=font(800,40,BODY);c.fillStyle=fg;c.globalAlpha=p;c.fillText(nm[i]||'',220,y+110);c.globalAlpha=1});
  sigHead(c,t,f,st,300,92,.5);gSmall(c,f.sub,W/2,1440,48,2.8,t,f.a,'center',900,1,800);gPill(c,f.cta,W/2,1590,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'krem',n:'Krem Kavanozu',dur:7,def:{title:'Kış cilt bakımı',sub:'Nemlendirici krem + serum seti · ₺ 1.190',cta:'Seti incele'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kavanoz',.1,.7],['Kapak',.9,1.6],['Krem',1.4,2.4],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2,cy=1040;const op=eio(prog(t,.9,1.6));const e=sp(t,.1,.7);c.save();c.translate(cx,cy);c.scale(e,e);
  const g=c.createLinearGradient(-260,0,260,0);g.addColorStop(0,mix(f.a,'#FFFFFF',.3));g.addColorStop(.5,mix(f.a,'#FFFFFF',.6));g.addColorStop(1,mix(f.a,'#000000',.1));c.fillStyle=g;rr(c,-260,-80,520,280,40);c.fill();c.fillStyle='#FFFFFF';c.beginPath();c.ellipse(0,-80,260,60,0,0,Math.PI*2);c.fill();
  c.fillStyle='#FDFBF7';c.beginPath();c.ellipse(0,-84,230,48,0,0,Math.PI*2);c.fill();if(op>.5){c.strokeStyle='rgba(0,0,0,.06)';c.lineWidth=6;for(let i=0;i<3;i++){c.beginPath();c.ellipse(Math.sin(t+i)*20,-84,160-i*50,30-i*9,t*.2+i,0,Math.PI*1.4);c.stroke()}}
  c.save();c.translate(op*360,-120-op*260);c.rotate(op*.6);c.fillStyle='#D4AF37';rr(c,-270,-70,540,90,30);c.fill();c.restore();
  c.fillStyle=onColor(f.a);c.font=font(500,40,SERIF);c.textAlign='center';c.fillText('hydra',0,90);c.restore();c.textAlign='left';
  [[cx-300,cy-360,30,1.8],[cx+280,cy-280,24,2],[cx-200,cy+260,20,2.2]].forEach(([x,y,s,t0])=>sparkle(c,x,y,s,clamp(prog(t,t0,t0+.3))));
  sigHead(c,t,f,st,300,92,1.8);gSmall(c,f.sub,W/2,1440,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}}
];

SIG['Spa & Masaj']=[
{k:'halka',n:'Su Halkaları',dur:8,def:{title:'Bir nefes al',sub:'60 dk aromaterapi masajı · ₺ 1.800',cta:'Randevu al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Damla',.2,1],['Halkalar',1,8],['Başlık',1.4,2.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=960;const d=prog(t,.2,1);if(d<1){c.fillStyle=fgA(f.p,.6);c.beginPath();c.ellipse(cx,lerpN(300,cy,d*d),14,22,0,0,Math.PI*2);c.fill()}
  for(let i=0;i<5;i++){const q=((t-1)*.35+i/5);if(t<1||q<0)continue;const qq=q%1;c.strokeStyle=fgA(f.p,.5*(1-qq));c.lineWidth=4;c.beginPath();c.ellipse(cx,cy,qq*520,qq*170,0,0,Math.PI*2);c.stroke()}
  const k=eo(prog(t,1.4,2.4));c.globalAlpha=k;c.font=font(500,110,SERIF);c.fillStyle=fg;c.textAlign='center';c.fillText(f.title||'',cx,cy-260);c.globalAlpha=1;c.textAlign='left';
  gSmall(c,f.sub,W/2,1340,40,2.4,t,fgA(f.p,.8),'center',900,2,600);gPill(c,f.cta,W/2,1500,2.8,t,f,'center');logoCorner(c,A,t,2.8,W/2,300,140)}},
{k:'taslar',n:'Sıcak Taşlar',dur:7,def:{title:'Sıcak taş terapisi',sub:'Kaslarınız gevşesin · 75 dk',cta:'Yerini ayırt'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Taşlar',.1,2],['Buhar',2,7],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const S=[[0,1180,300,110],[10,1060,250,95],[-6,950,200,80],[4,860,150,64]];S.forEach(([dx,y,w,h],i)=>{const k=eback(clamp(prog(t,.1+i*.4,.5+i*.4)));if(k<=0)return;const yy=y-(1-k)*700;const g=c.createRadialGradient(W/2+dx-w*.3,yy-h*.4,10,W/2+dx,yy,w);g.addColorStop(0,'#6B7280');g.addColorStop(1,'#1F2937');c.fillStyle=g;c.beginPath();c.ellipse(W/2+dx,yy,w/2,h/2,0,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.ellipse(W/2+dx-w*.15,yy-h*.18,w*.18,h*.12,0,0,Math.PI*2);c.fill()});
  flower(c,W/2+140,1150,50,'#F9A8D4',sp(t,1.8,2.2),.3);steam(c,W/2,800,t,clamp(prog(t,2,2.6))*.7,3,260);
  sigHead(c,t,f,st,300,92,1.6);gSmall(c,f.sub,W/2,1400,40,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1560,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'mum',n:'Nefes Mumu',dur:8,def:{title:'4 saniye nefes al, 4 saniye ver',sub:'Sükûn Spa · çift masajında %15',cta:'Rahatla'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Mum',.1,.7],['Nefes',.8,8],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=1120;const br=(Math.sin((t-.8)*Math.PI/4)+1)/2;glow(c,cx,cy-260,340+br*160,'rgba(255,190,90,A)',.35+.25*br);
  c.fillStyle='#FDF6E3';rr(c,cx-110,cy-200,220,340,20);c.fill();c.fillStyle='rgba(0,0,0,.06)';c.fillRect(cx+40,cy-200,70,340);c.strokeStyle='#111418';c.lineWidth=5;c.beginPath();c.moveTo(cx,cy-200);c.lineTo(cx,cy-232);c.stroke();
  const fl=1+.15*Math.sin(t*9)+.2*br;c.fillStyle='#FFB020';c.beginPath();c.ellipse(cx,cy-280,20*fl,46*fl,0,0,Math.PI*2);c.fill();c.fillStyle='#FFF2B0';c.beginPath();c.ellipse(cx,cy-266,9,20,0,0,Math.PI*2);c.fill();
  c.strokeStyle=fgA(f.p,.4);c.lineWidth=4;c.beginPath();c.arc(cx,cy-280,140+br*120,0,Math.PI*2);c.stroke();c.font=font(700,34,MONO);c.fillStyle=fgA(f.p,.7);c.textAlign='center';c.fillText(br>.5?'NEFES AL':'NEFES VER',cx,cy+240);c.textAlign='left';
  sigHead(c,t,f,st,300,76,.6);gSmall(c,f.sub,W/2,1480,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1630,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}}
];

SIG['Kreş & Anaokulu']=[
{k:'harf',n:'Harf Blokları',dur:7,def:{title:'Kayıtlar başladı',d1:'ABC',sub:'2–6 yaş · İngilizce destekli program',cta:'Okulu gez'},labels:{title:'Başlık',d1:'Blok harfleri',sub:'Açıklama',cta:'Buton'},max:{d1:4},
 tracks:[['Zemin',0,7,1],['Bloklar',.1,1.8],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const L=String(f.d1||'ABC').toLocaleUpperCase('tr').slice(0,4).split('');const cols=['#F87171','#FBBF24','#34D399','#60A5FA'];const s=200;L.forEach((ch,i)=>{const k=eback(clamp(prog(t,.1+i*.3,.6+i*.3)));if(k<=0)return;const x=W/2+(i-(L.length-1)/2)*(s+20);const y=950-(1-k)*800;c.save();c.translate(x,y);c.rotate(Math.sin(t*2+i)*.04);
  c.fillStyle=cols[i%4];rr(c,-s/2,-s/2,s,s,24);c.fill();c.fillStyle=mix(cols[i%4],'#000000',.15);c.beginPath();c.moveTo(s/2,-s/2+24);c.lineTo(s/2+30,-s/2+4);c.lineTo(s/2+30,s/2-20);c.lineTo(s/2,s/2);c.fill();c.font=font(900,140,'"Unbounded",sans-serif');c.fillStyle='#FFFFFF';c.textAlign='center';c.fillText(ch,0,50);c.restore()});c.textAlign='left';
  sigHead(c,t,f,st,300,92,1.6);gSmall(c,f.sub,W/2,1300,40,2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1460,2.3,t,f,'center');logoCorner(c,A,t,2.3,W-150,170,110)}},
{k:'boya',n:'Boya Kalemi Çizimi',dur:7,def:{title:'Her gün yeni bir keşif',sub:'Sanat, müzik ve doğa saatleri',cta:'Bilgi al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çizim',.1,2.6],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const p=prog(t,.1,2.6);c.fillStyle='#FFFFFF';rr(c,110,480,W-220,820,24);c.fill();c.lineCap='round';c.lineJoin='round';
  const seg=(k0,k1,fn)=>{const k=clamp((p-k0)/(k1-k0));if(k>0)fn(k)};
  seg(0,.25,k=>{c.strokeStyle='#FBBF24';c.lineWidth=16;c.beginPath();c.arc(W-280,640,70,0,Math.PI*2*k);c.stroke();for(let i=0;i<8*k;i++){const a=i*Math.PI/4;c.beginPath();c.moveTo(W-280+Math.cos(a)*100,640+Math.sin(a)*100);c.lineTo(W-280+Math.cos(a)*140,640+Math.sin(a)*140);c.stroke()}});
  seg(.25,.55,k=>{c.strokeStyle='#EF4444';c.lineWidth=16;c.beginPath();const pts=[[300,1100],[300,880],[460,760],[620,880],[620,1100],[300,1100]];let tot=pts.length-1;const n=k*tot;pts.forEach(([x,y],i)=>{if(i===0)c.moveTo(x,y);else if(i<=n)c.lineTo(x,y);else if(i-1<n){const u=n-(i-1);const [px,py]=pts[i-1];c.lineTo(px+(x-px)*u,py+(y-py)*u)}});c.stroke()});
  seg(.55,.8,k=>{c.strokeStyle='#22C55E';c.lineWidth=14;c.beginPath();c.moveTo(150,1180);for(let x=0;x<=(W-300)*k;x+=20)c.lineTo(150+x,1180+Math.sin(x*.05)*14);c.stroke()});
  seg(.8,1,k=>{c.strokeStyle='#3B82F6';c.lineWidth=12;c.beginPath();c.arc(800,960,60*k,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo(800,1020);c.lineTo(800,1020+100*k);c.stroke()});c.lineCap='butt';
  sigHead(c,t,f,st,300,88,2);gSmall(c,f.sub,W/2,1420,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'gun',n:'Gün Saati',dur:8,def:{title:'Bir günümüz',d1:'09:00 · Kahvaltı',d2:'11:00 · Sanat atölyesi',d3:'14:00 · Bahçe oyunu',sub:'Papatya Anaokulu',cta:'Okulu gez'},labels:{title:'Başlık',d1:'Saat · etkinlik 1',d2:'Saat · etkinlik 2',d3:'Saat · etkinlik 3',sub:'Okul adı',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Saat',.1,.7],['Etkinlikler',.8,3.6],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=780,R=230;const e=sp(t,.1,.7);c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle='#FFFFFF';c.beginPath();c.arc(0,0,R,0,Math.PI*2);c.fill();c.strokeStyle=f.a;c.lineWidth=22;c.stroke();
  const cols=['#F87171','#FBBF24','#34D399','#60A5FA'];for(let i=0;i<12;i++){const a=i*Math.PI/6;c.fillStyle=cols[i%4];c.beginPath();c.arc(Math.cos(a)*(R-40),Math.sin(a)*(R-40),12,0,Math.PI*2);c.fill()}
  const hr=[9,11,14];const i=Math.min(2,Math.max(0,Math.floor((t-.8)/.9)));const target=hr[i];const ha=(target%12)/12*Math.PI*2-Math.PI/2;c.strokeStyle='#111418';c.lineWidth=14;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(ha)*120,Math.sin(ha)*120);c.stroke();c.lineWidth=8;const ma=t*3;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(ma)*170,Math.sin(ma)*170);c.stroke();c.lineCap='butt';c.restore();
  [f.d1,f.d2,f.d3].forEach((s,j)=>{const k=eo(prog(t,.8+j*.9,1.2+j*.9));if(k<=0)return;const y=1140+j*120;c.globalAlpha=k*(j===i?1:.5);c.fillStyle=j===i?f.a:fgA(f.p,.1);rr(c,140,y-60,W-280,96,48);c.fill();c.font=font(800,40,BODY);c.fillStyle=j===i?onColor(f.a):fg;c.textAlign='center';c.fillText(s||'',W/2,y+2);c.globalAlpha=1;c.textAlign='left'});
  sigHead(c,t,f,st,300,90,.4);gPill(c,f.cta,W/2,1600,3.6,t,f,'center');logoCorner(c,A,t,3.6,W-150,170,110)}}
];

SIG['Sürücü Kursu']=[
{k:'isik',n:'Trafik Işığı',dur:7,def:{title:'Hazır mısın?',sub:'Yeni dönem kayıtları açık · 9 taksit',cta:'Kayıt ol'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Işık',.1,.6],['Geri sayım',.8,2.6],['Başlık',2.4,3]],
 draw(c,t,f,A,st){const cx=W/2,y0=420;const s=eo(prog(t,.1,.6));c.save();c.translate(cx,y0+380);c.scale(s,s);c.translate(-cx,-(y0+380));c.fillStyle='#111418';rr(c,cx-150,y0,300,760,40);c.fill();c.fillStyle='#374151';c.fillRect(cx-20,y0+760,40,300);
  const ph=t<1.4?0:t<2.1?1:2;[['#EF4444',0],['#F59E0B',1],['#22C55E',2]].forEach(([col,i])=>{const on=ph===i;const y=y0+130+i*250;c.fillStyle=on?col:mix(col,'#111418',.75);c.beginPath();c.arc(cx,y,95,0,Math.PI*2);c.fill();if(on)glow(c,cx,y,260,col.length===7?`rgba(${parseInt(col.slice(1,3),16)},${parseInt(col.slice(3,5),16)},${parseInt(col.slice(5,7),16)},A)`:'rgba(255,255,255,A)',.6)});c.restore();
  if(ph===2){sigHead(c,t,f,{...st,align:'center'},1310,110,2.1);gSmall(c,f.sub,W/2,1450,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1600,2.6,t,f,'center')}logoCorner(c,A,t,2.6,W-150,170,110)}},
{k:'park',n:'Paralel Park',dur:7,def:{title:'Paralel park korkusu bitti',sub:'3 ek derste garanti · Direksiyon Kursu',cta:'Deneme dersi'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Yol',.1,.6],['Park',.8,2.8],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const ry=900;c.fillStyle='#374151';c.fillRect(0,ry-220,W,440);c.fillStyle='#FDE047';for(let x=-((t*80)%120);x<W;x+=120)c.fillRect(x,ry-6,70,12);c.fillStyle='#9CA3AF';c.fillRect(0,ry+220,W,40);
  const car=(x,y,col,rot=0)=>{c.save();c.translate(x,y);c.rotate(rot);c.fillStyle=col;rr(c,-130,-62,260,124,30);c.fill();c.fillStyle='rgba(255,255,255,.4)';rr(c,-60,-50,90,100,14);c.fill();c.fillStyle='#111418';[[-80,-66],[80,-66],[-80,54],[80,54]].forEach(([a,b])=>rr(c,a-24,b,48,12,4));c.fill();c.restore()};
  car(170,ry+140,'#6B7280');car(W-170,ry+140,'#6B7280');const p=eio(prog(t,.8,2.8));const x=lerpN(W+200,W/2,Math.min(1,p*1.3)),y=ry-90+Math.max(0,p-.4)/.6*230;const rot=Math.sin(Math.max(0,p-.4)/.6*Math.PI)*-.35;car(x,y,f.a,rot);
  if(p>=1)chkTick(c,W/2,ry-120,50,sp(t,2.8,3.2));
  sigHead(c,t,f,st,300,84,2.4);gSmall(c,f.sub,W/2,1340,38,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1490,3.1,t,f,'center');logoCorner(c,A,t,3.1,W-150,170,110)}},
{k:'ehliyet',n:'Ehliyet Kartı',dur:7,def:{title:'Ehliyetin cebinde',d1:'B SINIFI',sub:'%86 ilk seferde başarı (2025, kurum verisi)',cta:'Kayıt ol'},labels:{title:'Başlık',d1:'Sınıf',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kart',.1,1.4],['Başlık',1.2,2]],
 draw(c,t,f,A,st){const cx=W/2,cy=900;const a=eio(prog(t,.1,1.4));c.save();c.translate(cx,cy+(1-a)*500);c.rotate((1-a)*-.8+Math.sin(t*1.5)*.02);c.scale(.6+.4*a,.6+.4*a);
  const g=c.createLinearGradient(-380,-240,380,240);g.addColorStop(0,'#F9C8D4');g.addColorStop(1,'#C7D2FE');c.fillStyle=g;rr(c,-380,-240,760,480,30);c.fill();c.fillStyle='#1E3A8A';c.font=font(800,34,BODY);c.fillText('SÜRÜCÜ BELGESİ',-330,-170);
  c.fillStyle='#E5E7EB';rr(c,-330,-120,200,250,14);c.fill();headSil(c,-230,0,.45,'#3B2418');c.fillStyle='rgba(30,58,138,.3)';[0,1,2,3].forEach(i=>rr(c,-90,-100+i*56,360-i*60,20,10));c.fill();
  c.font=font(900,64,COND);c.fillStyle='#1E3A8A';c.fillText(f.d1||'',-90,180);const sw=((t*.5)%2)-1;c.save();c.beginPath();rr(c,-380,-240,760,480,30);c.clip();c.rotate(.4);c.fillStyle='rgba(255,255,255,.35)';c.fillRect(sw*600-40,-600,80,1200);c.restore();c.restore();
  sigHead(c,t,f,st,300,92,1.2);gSmall(c,f.sub,W/2,1340,36,1.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1490,2.1,t,f,'center');logoCorner(c,A,t,2.1,W-150,170,110)}}
];

SIG['Müzik & Sanat Kursu']=[
{k:'plak',n:'Dönen Plak',dur:7,def:{title:'Öğrenci konseri',d1:'20 Aralık · 19:00',sub:'Moda Sahnesi · giriş ücretsiz',cta:'Yerini ayırt'},labels:{title:'Başlık',d1:'Tarih',sub:'Yer',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Plak',.1,.8],['Ekolayzer',.8,7],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=860;const e=sp(t,.1,.8);c.save();c.translate(cx,cy);c.scale(e,e);c.rotate(t*2.2);c.fillStyle='#0B0B0D';c.beginPath();c.arc(0,0,330,0,Math.PI*2);c.fill();c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=2;for(let r=150;r<320;r+=12){c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke()}
  c.fillStyle='rgba(255,255,255,.1)';c.beginPath();c.moveTo(0,0);c.arc(0,0,320,-.6,-.2);c.fill();c.fillStyle=f.a;c.beginPath();c.arc(0,0,110,0,Math.PI*2);c.fill();c.fillStyle='#0B0B0D';c.beginPath();c.arc(0,0,12,0,Math.PI*2);c.fill();c.restore();
  for(let i=0;i<16;i++){const h=30+Math.abs(Math.sin(t*6+i*1.3)*Math.sin(t*2.3+i))*170*clamp(prog(t,.8,1.2));const x=140+i*(W-280)/15;c.fillStyle=i%2?f.a:fgA(f.p,.5);rr(c,x-14,1340-h,28,h,8);c.fill()}
  sigHead(c,t,f,st,300,92,.6);gSmall(c,f.d1,W/2,1420,46,1.4,t,fg,'center',900,1,800);gSmall(c,f.sub,W/2,1480,36,1.6,t,fgA(f.p,.75),'center',900,1,600);gPill(c,f.cta,W/2,1620,2,t,f,'center');logoCorner(c,A,t,2,W-150,170,110)}},
{k:'piyano',n:'Piyano Tuşları',dur:7,def:{title:'Piyanoya 30 yaşında başla',sub:'Birebir ders · haftada 1 saat · ilk ders ücretsiz',cta:'Deneme dersi'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Tuşlar',.1,.8],['Melodi',1,4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x0=60,y0=820,kw=(W-120)/10,kh=520;const seq=[0,2,4,5,4,2,0,7,9];const cur=t>1?seq[Math.floor((t-1)*3)%seq.length]:-1;
  for(let i=0;i<10;i++){const on=i===cur;c.fillStyle=on?mix(f.a,'#FFFFFF',.4):'#FFFFFF';rr(c,x0+i*kw+3,y0+(on?10:0),kw-6,kh,12);c.fill()}
  [0,1,3,4,5,7,8].forEach(i=>{c.fillStyle='#111418';rr(c,x0+(i+1)*kw-kw*.3,y0,kw*.6,kh*.6,8);c.fill()});
  for(let k=0;k<6;k++){const q=((t-1)*1.2+k/6)%1;if(t<1)break;c.save();c.globalAlpha=1-q;c.fillStyle=f.a;c.font=font(900,80,SERIF);c.fillText(k%2?'♪':'♫',x0+((k*3+2)%10)*kw,y0-40-q*300);c.restore()}
  sigHead(c,t,f,st,300,84,.6);gSmall(c,f.sub,W/2,1470,38,1.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1620,2,t,f,'center');logoCorner(c,A,t,2,W-150,170,110)}},
{k:'firca',n:'Fırça Darbesi',dur:7,def:{title:'RESİM',sub:'Yetişkinler için yağlı boya atölyesi · cumartesi',cta:'Kayıt ol'},labels:{title:'Kelime (kısa)',sub:'Açıklama',cta:'Buton'},max:{title:10},
 tracks:[['Zemin',0,7,1],['Fırça',.2,1.8],['Alt yazı',1.8,2.4]],
 draw(c,t,f,A,st){const cols=['#EF4444','#F59E0B','#3B82F6'];cols.forEach((col,i)=>{const p=eio(prog(t,.2+i*.3,1+i*.3));if(p<=0)return;const y=760+i*150;c.fillStyle=col;c.beginPath();c.moveTo(90,y);for(let x=0;x<=(W-180)*p;x+=16)c.lineTo(90+x,y-50+Math.sin(x*.04+i*2)*14+((x*7)%5));for(let x=(W-180)*p;x>=0;x-=16)c.lineTo(90+x,y+60+Math.sin(x*.05+i)*16);c.fill();c.fillStyle='rgba(255,255,255,.15)';for(let k=0;k<12;k++)c.fillRect(90,y-40+k*8,(W-180)*p,2)});
  const k=eo(prog(t,1.2,1.8));c.globalAlpha=k;c.font=font(900,fitFont(c,String(f.title).toLocaleUpperCase('tr'),860,220,80,900,COND),COND);c.fillStyle='#FFFFFF';c.textAlign='center';c.fillText(String(f.title).toLocaleUpperCase('tr'),W/2,980);c.globalAlpha=1;c.textAlign='left';
  gSmall(c,f.sub,W/2,1300,40,1.8,t,fgOf(f.p),'center',900,2,700);gPill(c,f.cta,W/2,1460,2.1,t,f,'center');logoCorner(c,A,t,2.1,W/2,330,150)}}
];

SIG['Dans Okulu']=[
{k:'adim',n:'Ritim Adımları',dur:8,def:{title:'Salsa başlangıç grubu',sub:'Partnerli ya da partnersiz · çarşamba 20:00',cta:'Deneme dersi'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Adımlar',.2,4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const pts=[[-120,0],[120,-60],[-40,-200],[160,-260],[-140,-380],[60,-440],[-80,-560],[140,-620]];const beat=Math.floor((t-.2)*2.5);
  pts.forEach(([x,y],i)=>{const on=i<=beat&&t>.2;if(!on)return;const age=beat-i;c.save();c.translate(W/2+x,1300+y);c.rotate(i%2?.2:-.2);c.globalAlpha=Math.max(.25,1-age*.12);c.fillStyle=i===beat%8?f.a:fgA(f.p,.6);c.beginPath();c.ellipse(0,0,38,70,0,0,Math.PI*2);c.fill();c.beginPath();c.ellipse(0,92,30,34,0,0,Math.PI*2);c.fill();c.restore()});
  c.font=font(700,40,MONO);c.fillStyle=f.a;c.textAlign='center';const cnt=['1','2','3','·','5','6','7','·'][Math.max(0,beat)%8];c.fillText(cnt,W/2,1500);c.textAlign='left';
  sigHead(c,t,f,st,300,90,.6);gSmall(c,f.sub,W/2,1580,36,1.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1720,1.8,t,f,'center');logoCorner(c,A,t,1.8,W-150,170,110)}},
{k:'disko',n:'Disko Işıkları',dur:7,def:{title:'Salsa gecesi',d1:'CUMARTESİ',sub:'21:00 · Bornova stüdyo · herkes davetli',cta:'Katıl'},labels:{title:'Başlık',d1:'Gün',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Küre',.1,.8],['Işıklar',.8,7],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=560;const cols=[f.a,'#F472B6','#60A5FA','#FBBF24'];if(t>.8)for(let i=0;i<8;i++){const a=t*.8+i*Math.PI/4;c.save();c.globalAlpha=.18;c.fillStyle=cols[i%4];c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a-.08)*2000,cy+Math.sin(a-.08)*2000);c.lineTo(cx+Math.cos(a+.08)*2000,cy+Math.sin(a+.08)*2000);c.closePath();c.fill();c.restore()}
  c.strokeStyle=fgA(f.p,.5);c.lineWidth=4;c.beginPath();c.moveTo(cx,0);c.lineTo(cx,cy-150);c.stroke();const e=sp(t,.1,.8);c.save();c.translate(cx,cy);c.scale(e,e);c.beginPath();c.arc(0,0,150,0,Math.PI*2);c.clip();c.fillStyle='#9CA3AF';c.fillRect(-150,-150,300,300);for(let y=-150;y<150;y+=26)for(let x=-150;x<150;x+=26){const v=(Math.sin(x*.3+y*.2+t*6)+1)/2;c.fillStyle=`rgba(255,255,255,${.2+v*.7})`;c.fillRect(x+2,y+2,22,22)}c.restore();
  const k=sp(t,1,1.5);if(k>0){c.save();c.translate(W/2,1000);c.scale(k,k);c.font=font(900,150,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  sigHead(c,t,f,{...st,align:'center'},1180,96,.6);gSmall(c,f.sub,W/2,1360,38,1.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1510,1.9,t,f,'center');logoCorner(c,A,t,1.9,W-150,170,110)}},
{k:'silu',n:'Dönen Silüet',dur:7,def:{title:'Düğün dansınız hazır',sub:'6 özel ders · şarkınıza koreografi',cta:'Paketi gör'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Silüet',.1,7],['Başlık',1,1.8]],
 draw(c,t,f,A,st){const cx=W/2,cy=960;const a=t*1.6;const sx=Math.cos(a);c.save();c.translate(cx,cy);c.scale(sx*1.3,1.3);c.fillStyle=fgA(f.p,.85);
  c.beginPath();c.arc(-60,-380,46,0,Math.PI*2);c.arc(70,-360,44,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(-100,-320);c.quadraticCurveTo(-160,-120,-120,40);c.lineTo(-40,40);c.quadraticCurveTo(-20,-140,-20,-320);c.fill();
  c.beginPath();c.moveTo(20,-310);c.quadraticCurveTo(120,-200,90,-60);c.quadraticCurveTo(230,220,140,320);c.lineTo(-60,320);c.quadraticCurveTo(0,180,40,-60);c.fill();c.lineWidth=22;c.strokeStyle=fgA(f.p,.85);c.lineCap='round';c.beginPath();c.moveTo(-40,-280);c.quadraticCurveTo(20,-330,60,-280);c.stroke();c.beginPath();c.moveTo(-120,-260);c.lineTo(-220,-380);c.stroke();c.lineCap='butt';c.restore();
  c.fillStyle=f.a;c.globalAlpha=.6;c.beginPath();c.ellipse(cx,cy+340,300,40,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
  sigHead(c,t,f,st,300,90,1);gSmall(c,f.sub,W/2,1460,38,1.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1610,1.8,t,f,'center');logoCorner(c,A,t,1.8,W-150,170,110)}}
];

SIG['Fotoğraf Stüdyosu']=[
{k:'diyafram',n:'Diyafram ve Flaş',dur:7,def:{title:'Aile çekimi günü',sub:'40 düzenlenmiş kare · 1 haftada teslim',cta:'Tarihini seç'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Diyafram',.2,1.4],['Flaş',1.4,1.7],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=900;const op=t<1.4?1-eio(prog(t,.2,1.2)):eio(prog(t,1.5,2.2));c.save();c.translate(cx,cy);c.fillStyle='#111418';c.beginPath();c.arc(0,0,380,0,Math.PI*2);c.fill();
  c.save();c.beginPath();c.arc(0,0,340,0,Math.PI*2);c.clip();if(A.photo)cover(c,A.photo,1.05);else{const g=c.createLinearGradient(0,-340,0,340);g.addColorStop(0,'#FDE68A');g.addColorStop(1,'#F472B6');c.fillStyle=g;c.fillRect(-340,-340,680,680);headSil(c,-110,60,.7,'#4A2E1C');headSil(c,120,80,.6,'#2B1D14');headSil(c,10,160,.45,'#6B4423')}
  for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4+(1-op)*.6);c.fillStyle='#1F2937';c.beginPath();c.moveTo(340*op,-400);c.lineTo(400,-400);c.lineTo(400,400);c.lineTo(340*op*.7,0);c.closePath();c.fill();c.restore()}c.restore();c.strokeStyle='#4B5563';c.lineWidth=16;c.beginPath();c.arc(0,0,350,0,Math.PI*2);c.stroke();c.restore();
  if(t>1.4&&t<1.75){c.fillStyle=`rgba(255,255,255,${1-(t-1.4)/.35})`;c.fillRect(0,0,W,H)}
  sigHead(c,t,f,st,300,92,1.6);gSmall(c,f.sub,W/2,1420,40,2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.3,t,f,'center');logoCorner(c,A,t,2.3,W-150,170,110)}},
{k:'polaroid',n:'Gelişen Polaroid',dur:7,def:{title:'Anılar kağıda dökülsün',sub:'Polaroid köşesi · düğün ve davetlerde',cta:'Teklif al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Baskı',.1,1],['Gelişme',1,3.2],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=920;const out=eio(prog(t,.1,1));const dev=eio(prog(t,1,3.2));c.save();c.translate(cx,cy-(1-out)*300);c.rotate(-.05+Math.sin(t*1.4)*.02);c.fillStyle='#FBFAF6';c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=40;rr(c,-300,-340,600,700,8);c.fill();c.shadowBlur=0;
  c.save();rr(c,-260,-300,520,520,4);c.clip();if(A.photo)cover(c,A.photo,1.05);else{const g=c.createLinearGradient(0,-300,0,220);g.addColorStop(0,'#93C5FD');g.addColorStop(.6,'#FDE68A');g.addColorStop(.61,'#86EFAC');g.addColorStop(1,'#16A34A');c.fillStyle=g;c.fillRect(-260,-300,520,520);headSil(c,-60,40,.55,'#3B2418');headSil(c,90,60,.5,'#5A3A26')}
  c.fillStyle=`rgba(30,32,40,${1-dev})`;c.fillRect(-260,-300,520,520);c.fillStyle=`rgba(255,240,200,${(1-dev)*.15})`;c.fillRect(-260,-300,520,520);c.restore();c.font=font(500,40,SERIF);c.fillStyle=`rgba(40,40,40,${dev})`;c.textAlign='center';c.fillText('♥',0,300);c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,88,.6);gSmall(c,f.sub,W/2,1420,38,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'kontakt',n:'Kontakt Baskı',dur:8,def:{title:'Favori karelerini seç',sub:'Online galeriden seç, albümün basılsın',cta:'Galeriyi gör'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Kareler',.1,1.6],['Seçim',1.8,3.6],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const x0=120,y0=500,cw=(W-240)/3,ch=cw*1.1;const cols=['#FDE68A','#FCA5A5','#93C5FD','#86EFAC','#C4B5FD','#F9A8D4','#FDBA74','#A7F3D0','#BFDBFE'];c.fillStyle='#0B0B0D';rr(c,x0-30,y0-30,W-2*x0+60,3*ch+60,16);c.fill();
  for(let i=0;i<9;i++){const k=eo(prog(t,.1+i*.12,.5+i*.12));if(k<=0)continue;const x=x0+(i%3)*cw+8,y=y0+Math.floor(i/3)*ch+8;c.globalAlpha=k;const g=c.createLinearGradient(x,y,x,y+ch);g.addColorStop(0,cols[i]);g.addColorStop(1,mix(cols[i],'#000000',.35));c.fillStyle=g;c.fillRect(x,y,cw-16,ch-16);c.save();c.beginPath();c.rect(x,y,cw-16,ch-16);c.clip();headSil(c,x+(cw-16)/2,y+ch*.55,.38,['#3B2418','#5A3A26','#2B1D14'][i%3]);c.restore();c.globalAlpha=1;
   const sel=[1,4,8].indexOf(i);if(sel>=0){const s=eback(clamp(prog(t,1.8+sel*.6,2.2+sel*.6)));if(s>0){c.strokeStyle=f.a;c.lineWidth=10;c.globalAlpha=clamp(s);c.beginPath();c.ellipse(x+(cw-16)/2,y+(ch-16)/2,(cw-16)/2+10,(ch-16)/2+10,0,0,Math.PI*2*clamp(s));c.stroke();c.globalAlpha=1;chkTick(c,x+cw-40,y+20,24,s)}}}
  sigHead(c,t,f,st,300,84,.6);gSmall(c,f.sub,W/2,1500,38,3.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1650,3.6,t,f,'center');logoCorner(c,A,t,3.6,W-150,170,110)}}
];

// ===== İmza motionlar 5: nakliyat, halı yıkama, terzi, usta, bahçe, mimarlık, matbaa, catering, gelinlik, araç kiralama, seyahat, hırdavat, kasap =====
function truck(c,x,y,s,col){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle=col;rr(c,-200,-150,280,170,14);c.fill();c.fillStyle='#E5E7EB';rr(c,90,-100,110,120,18);c.fill();c.fillStyle='#93C5FD';rr(c,110,-84,64,46,8);c.fill();c.fillStyle='#111418';[-130,10,150].forEach(px=>{c.beginPath();c.arc(px,30,32,0,Math.PI*2);c.fill()});c.fillStyle='#9CA3AF';[-130,10,150].forEach(px=>{c.beginPath();c.arc(px,30,12,0,Math.PI*2);c.fill()});c.restore()}
function box3(c,x,y,w,h,lab){c.fillStyle='#C99A63';c.fillRect(x-w/2,y-h,w,h);c.fillStyle='#B98A57';c.fillRect(x-w/2,y-h,w,16);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(x-6,y-h,12,h);if(lab){c.fillStyle='#FFFFFF';rr(c,x-w*.32,y-h*.55,w*.64,h*.28,6);c.fill();c.font=font(800,Math.min(26,h*.16),MONO);c.fillStyle='#111418';c.textAlign='center';c.fillText(lab,x,y-h*.37);c.textAlign='left'}}

SIG['Nakliyat']=[
{k:'kamyon',n:'Rotadaki Kamyon',dur:7,def:{title:'Evden eve, sigortalı',d1:'Kadıköy',d2:'Ataşehir',sub:'Paketleme + taşıma + montaj · aynı gün',cta:'Ücretsiz ekspertiz'},labels:{title:'Başlık',d1:'Çıkış',d2:'Varış',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Harita',.1,.7],['Rota',.8,2.8],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const P=[[180,1240],[300,1000],[560,1080],[720,820],[900,700]];const p=eio(prog(t,.8,2.8));c.save();c.globalAlpha=eo(prog(t,.1,.7));c.strokeStyle=fgA(f.p,.1);c.lineWidth=26;[[100,900,980,900],[400,560,400,1360],[100,1150,980,700]].forEach(([a,b,cc,d])=>{c.beginPath();c.moveTo(a,b);c.lineTo(cc,d);c.stroke()});
  c.setLineDash([22,16]);c.strokeStyle=fgA(f.p,.35);c.lineWidth=8;c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.setLineDash([]);c.restore();
  const seg=P.length-1,u=p*seg,i=Math.min(seg-1,Math.floor(u)),k=u-i;const [x0,y0]=P[i],[x1,y1]=P[i+1];c.strokeStyle=f.a;c.lineWidth=10;c.beginPath();P.slice(0,i+1).forEach(([x,y],j)=>j?c.lineTo(x,y):c.moveTo(x,y));c.lineTo(x0+(x1-x0)*k,y0+(y1-y0)*k);c.stroke();
  truck(c,x0+(x1-x0)*k,y0+(y1-y0)*k-40,.55,f.a);
  [[f.d1,P[0]],[f.d2,P[seg]]].forEach(([s,[x,y]],j)=>{const e=sp(t,j?2.6:.8,j?3:1.2);if(e<=0)return;c.save();c.translate(x,y);c.scale(e,e);c.fillStyle=j?f.a:fg;c.beginPath();c.arc(0,0,22,0,Math.PI*2);c.fill();c.font=font(800,36,BODY);const w=c.measureText(s||'').width+40;rr(c,-w/2,-110,w,64,32);c.fillStyle=lum(f.p)>.45?'#111418':'#FFFFFF';c.fill();c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#111418';c.textAlign='center';c.fillText(s||'',0,-66);c.restore();c.textAlign='left'});
  sigHead(c,t,f,st,300,88,.5);gSmall(c,f.sub,W/2,1460,38,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1610,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'kutular',n:'Etiketli Kutular',dur:7,def:{title:'Paketlemeyi biz yaparız',d1:'MUTFAK',d2:'SALON',d3:'YATAK ODASI',sub:'Kutular oda oda etiketlenir, hiçbir şey kaybolmaz',cta:'Teklif al'},labels:{title:'Başlık',d1:'Etiket 1',d2:'Etiket 2',d3:'Etiket 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kutular',.2,2.2],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const B=[[W/2-210,1300,360,260,f.d1],[W/2+190,1300,320,240,f.d2],[W/2-10,1040,340,240,f.d3],[W/2+260,1060,220,180,'']];B.forEach(([x,y,w,h,l],i)=>{const k=eback(clamp(prog(t,.2+i*.4,.6+i*.4)));if(k<=0)return;c.save();c.translate(0,(1-k)*-900);box3(c,x,y,w,h,l);c.restore()});
  c.fillStyle='rgba(0,0,0,.15)';c.beginPath();c.ellipse(W/2,1310,440,26,0,0,Math.PI*2);c.fill();
  sigHead(c,t,f,st,300,88,.5);gSmall(c,f.sub,W/2,1440,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'evden',n:'Evden Eve',dur:7,def:{title:'Taşınmak kolay olsun',sub:'Tam sigortalı · 16 yıllık ekip',cta:'Tarih ayırt'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Evler',.1,.8],['Taşıma',.9,2.6],['Başlık',2,2.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const house=(x,col,lit)=>{c.fillStyle=col;c.fillRect(x-150,820,300,260);c.beginPath();c.moveTo(x-190,830);c.lineTo(x,660);c.lineTo(x+190,830);c.closePath();c.fill();c.fillStyle=lit?'#FDE68A':'rgba(0,0,0,.25)';c.fillRect(x-100,880,70,70);c.fillRect(x+30,880,70,70);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(x-30,980,60,100)};
  c.globalAlpha=eo(prog(t,.1,.8));house(220,fgA(f.p,.3),false);house(W-220,f.a,t>2.6);c.globalAlpha=1;const p=eio(prog(t,.9,2.6));c.save();c.setLineDash([16,14]);c.strokeStyle=fgA(f.p,.5);c.lineWidth=6;c.beginPath();c.moveTo(220,1150);c.quadraticCurveTo(W/2,1320,W-220,1150);c.stroke();c.restore();
  const bx=lerpN(220,W-220,p),by=1150+Math.sin(p*Math.PI)*120-60;truck(c,bx,by,.45,f.a);
  sigHead(c,t,f,st,300,90,2);gSmall(c,f.sub,W/2,1440,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}}
];

SIG['Halı Yıkama & Kuru Temizleme']=[
{k:'hali',n:'Açılan Halı',dur:7,def:{title:'Halın ilk günkü gibi',sub:'Ücretsiz alım ve teslim · 3 günde geri',cta:'Randevu al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Açılış',.2,1.4],['Temizlik',1.6,2.8],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const x0=110,y0=520,w=W-220,h=800;const open=eio(prog(t,.2,1.4));const cl=eio(prog(t,1.6,2.8));const hh=h*open;c.save();c.beginPath();c.rect(x0,y0,w,hh);c.clip();
  const drawRug=()=>{c.fillStyle='#9F1239';c.fillRect(x0,y0,w,h);c.strokeStyle='#FDE68A';c.lineWidth=14;c.strokeRect(x0+30,y0+30,w-60,h-60);c.strokeStyle='#1E3A8A';c.lineWidth=10;c.strokeRect(x0+60,y0+60,w-120,h-120);c.save();c.translate(W/2,y0+h/2);for(let i=0;i<4;i++){c.rotate(Math.PI/2);c.fillStyle=i%2?'#FDE68A':'#1E3A8A';c.beginPath();c.moveTo(0,-200);c.lineTo(80,0);c.lineTo(0,200);c.lineTo(-80,0);c.closePath();c.fill()}c.fillStyle='#FDE68A';c.beginPath();c.arc(0,0,50,0,Math.PI*2);c.fill();c.restore()};drawRug();
  c.save();c.beginPath();c.rect(x0+w*cl,y0,w,h);c.clip();c.fillStyle='rgba(90,70,50,.6)';c.fillRect(x0,y0,w,h);for(let i=0;i<40;i++){const r=Math.abs((Math.sin(i*13.3)*77.7)%1);c.fillStyle='rgba(60,45,30,.45)';c.beginPath();c.arc(x0+r*w,y0+((i*71)%h),20+r*50,0,Math.PI*2);c.fill()}c.restore();c.restore();
  if(open<1){c.fillStyle='#881337';c.beginPath();c.ellipse(W/2,y0+hh,w/2,40,0,0,Math.PI*2);c.fill()}
  if(cl>0&&cl<1){c.fillStyle='rgba(255,255,255,.85)';c.fillRect(x0+w*cl-6,y0,12,h);for(let i=0;i<8;i++)bubble(c,x0+w*cl+Math.sin(i+t*5)*30,y0+i*100+40,18+i%3*6,.8)}
  sigHead(c,t,f,st,300,88,2.4);gSmall(c,f.sub,W/2,1450,40,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1600,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'firca',n:'Köpüklü Fırça',dur:7,def:{title:'Leke kalmadı',d1:'Kahve',d2:'Çamur',d3:'Mürekkep',sub:'Makine yıkama + leke uzmanı',cta:'Hemen ara'},labels:{title:'Başlık',d1:'Leke 1',d2:'Leke 2',d3:'Leke 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Lekeler',.1,.6],['Fırça',.8,3],['Başlık',2.6,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const S=[[f.d1,W/2-240,760,'#78350F'],[f.d2,W/2+220,960,'#57534E'],[f.d3,W/2-120,1180,'#1E3A8A']];c.fillStyle='#E7E1D7';rr(c,110,560,W-220,800,30);c.fill();c.fillStyle='rgba(0,0,0,.04)';for(let i=0;i<40;i++)c.fillRect(110,560+i*20,W-220,6);
  S.forEach(([s,x,y,col],i)=>{const cl=eio(prog(t,.8+i*.7,1.4+i*.7));c.save();c.globalAlpha=1-cl;c.fillStyle=col;c.beginPath();for(let j=0;j<=16;j++){const a=j/16*Math.PI*2,r=90+Math.sin(j*2.7+i)*28;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r*.7)}c.fill();c.restore();
   if(cl>0&&cl<1){for(let k=0;k<6;k++)bubble(c,x+Math.sin(k*2+t*6)*80,y+Math.cos(k*1.7+t*5)*50,14+k*3,.9);c.save();c.translate(x+60,y-50+Math.sin(t*14)*16);c.rotate(.4);c.fillStyle=f.a;rr(c,-30,-150,60,150,14);c.fill();c.fillStyle='#F5F5F4';rr(c,-60,0,120,40,10);c.fill();c.restore()}
   c.font=font(700,30,MONO);c.fillStyle=cl>=1?'#16A34A':'#6B7280';c.textAlign='center';c.fillText(cl>=1?'✓ '+s:s,x,y+130);c.textAlign='left'});
  sigHead(c,t,f,st,300,92,2.6);gSmall(c,f.sub,W/2,1460,40,3,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1610,3.2,t,f,'center');logoCorner(c,A,t,3.2,W-150,170,110)}},
{k:'poset',n:'Askıdaki Takım',dur:7,def:{title:'Kuru temizleme',d1:'₺ 350',sub:'Takım elbise · aynı gün hazır',cta:'Bırak, al'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Askı',.1,.8],['Poşet',1,2],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const cx=W/2;const sw=Math.sin(t*2)*.04;c.save();c.translate(cx,500);c.rotate(sw);c.strokeStyle='#9CA3AF';c.lineWidth=8;c.beginPath();c.arc(0,-24,24,Math.PI*.9,Math.PI*2.1);c.stroke();c.lineWidth=10;c.beginPath();c.moveTo(0,0);c.lineTo(-210,90);c.lineTo(210,90);c.closePath();c.stroke();
  c.fillStyle='#1F2937';c.beginPath();c.moveTo(-200,90);c.lineTo(-60,90);c.lineTo(0,320);c.lineTo(60,90);c.lineTo(200,90);c.lineTo(230,820);c.lineTo(-230,820);c.closePath();c.fill();c.fillStyle='#F9FAFB';c.beginPath();c.moveTo(-60,90);c.lineTo(0,320);c.lineTo(60,90);c.fill();c.fillStyle=f.a;c.beginPath();c.moveTo(-16,110);c.lineTo(16,110);c.lineTo(24,300);c.lineTo(0,330);c.lineTo(-24,300);c.closePath();c.fill();
  c.fillStyle='#D1D5DB';[420,540].forEach(y=>{c.beginPath();c.arc(30,y,9,0,Math.PI*2);c.fill()});
  const pk=eio(prog(t,1,2));if(pk>0){c.fillStyle='rgba(220,235,255,.35)';c.beginPath();c.moveTo(-240,60);c.lineTo(240,60);c.lineTo(250,60+780*pk);c.lineTo(-250,60+780*pk);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.stroke();c.fillStyle='rgba(255,255,255,.5)';c.fillRect(-200,100,16,700*pk)}c.restore();
  priceTag(c,f.d1,W-230,1100,t,2,f,.1);sigHead(c,t,f,st,300,92,.5);gSmall(c,f.sub,W/2,1440,40,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.4,t,f,'center');logoCorner(c,A,t,2.4,W-150,170,110)}}
];

SIG['Terzi & Tadilat']=[
{k:'mezura',n:'Mezura',dur:7,def:{title:'Tam ölçünüze',d1:'102 cm',sub:'Ölçüye özel takım · 3 prova · 3 haftada teslim',cta:'Prova randevusu'},labels:{title:'Başlık',d1:'Ölçü',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Mezura',.2,2],['Ölçü',2,2.6],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=920;const p=eio(prog(t,.2,2));c.save();c.translate(cx,cy);c.fillStyle=fgA(f.p,.12);c.beginPath();c.moveTo(-220,-300);c.quadraticCurveTo(-280,0,-200,300);c.lineTo(200,300);c.quadraticCurveTo(280,0,220,-300);c.quadraticCurveTo(0,-360,-220,-300);c.fill();
  c.strokeStyle='#FDE047';c.lineWidth=46;c.beginPath();c.ellipse(0,-60,260,70,0,Math.PI*.5,Math.PI*.5+Math.PI*2*p);c.stroke();c.fillStyle='#111418';for(let i=0;i<60*p;i++){const a=Math.PI*.5+i/60*Math.PI*2;c.save();c.translate(Math.cos(a)*260,-60+Math.sin(a)*70);c.rotate(a+Math.PI/2);c.fillRect(-1.5,-20,3,i%5?12:22);c.restore()}c.restore();
  const k=sp(t,2,2.5);if(k>0){c.save();c.translate(cx+280,cy-220);c.rotate(.1);c.scale(k,k);rr(c,-130,-56,260,112,56);c.fillStyle=f.a;c.fill();c.font=font(900,64,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d1||'',0,22);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,96,.5);gSmall(c,f.sub,W/2,1400,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1550,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'dikis',n:'Dikiş Çizgisi',dur:7,def:{title:'Aynı gün paça',sub:'Paça · bel · fermuar · kol tadilatı',cta:'Uğra'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Dikiş',.2,2.6],['Alt yazı',2.4,3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const word=String(f.title||'').toLocaleUpperCase('tr');const y=900;const p=prog(t,.2,2.6);
  c.fillStyle='#1E3A5F';c.fillRect(0,y-230,W,330);c.fillStyle='rgba(255,255,255,.05)';for(let i=0;i<60;i++){c.fillRect(i*20,y-230,6,330)}
  c.font=font(900,fitFont(c,word,860,170,70,900,COND),COND);const w=c.measureText(word).width;const x0=W/2-w/2;
  c.save();c.beginPath();c.rect(0,y-240,x0+w*p,360);c.clip();c.fillStyle=f.a;c.fillText(word,x0,y+40);c.strokeStyle='#FDE68A';c.lineWidth=5;c.setLineDash([22,14]);[y-195,y+70].forEach(yy=>{c.beginPath();c.moveTo(40,yy);c.lineTo(W-40,yy);c.stroke()});c.setLineDash([]);c.restore();
  const nx=Math.min(W-60,Math.max(60,x0+w*p));const bob=p<1?Math.abs(Math.sin(t*26))*40:0;c.save();c.translate(nx,0);
  c.fillStyle=lum(f.p)>.45?'#E5E7EB':'#F3F4F6';rr(c,-130,y-560,260,170,30);c.fill();c.fillStyle=f.a;rr(c,-130,y-430,260,26,8);c.fill();c.fillStyle='#9CA3AF';c.fillRect(-14,y-390+bob,28,90);c.fillStyle='#D1D5DB';c.fillRect(-4,y-300+bob,8,70);c.fillStyle='#6B7280';c.beginPath();c.moveTo(-4,y-230+bob);c.lineTo(4,y-230+bob);c.lineTo(0,y-205+bob);c.fill();c.restore();
  gSmall(c,f.sub,W/2,1200,42,2.4,t,fg,'center',900,2,700);gPill(c,f.cta,W/2,1380,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'igne',n:'İğne İplik',dur:7,def:{title:'Gelinlik tadilatı',sub:'Ücretsiz düzeltme · prova randevuyla',cta:'Randevu al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['İplik',.2,1.8],['Başlık',1.6,2.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=900;const p=eio(prog(t,.2,1.8));c.save();c.translate(cx,cy);c.rotate(.6);const g=c.createLinearGradient(-12,0,12,0);g.addColorStop(0,'#9CA3AF');g.addColorStop(.5,'#F3F4F6');g.addColorStop(1,'#6B7280');c.fillStyle=g;c.beginPath();c.moveTo(-12,-320);c.lineTo(12,-320);c.lineTo(10,280);c.lineTo(0,360);c.lineTo(-10,280);c.closePath();c.fill();c.fillStyle=f.p;rr(c,-5,-300,10,60,5);c.fill();c.restore();
  c.strokeStyle=f.a;c.lineWidth=8;c.lineCap='round';c.beginPath();const N=80;for(let i=0;i<=N*p;i++){const u=i/N;const x=lerpN(-500,0,u)+cx,y=cy-400+Math.sin(u*8)*80*(1-u)+u*140;const r=.6;const ex=cx+Math.cos(r)*0,ey=y;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
  if(p>=1){c.beginPath();c.moveTo(cx+Math.sin(.6)*270,cy-Math.cos(.6)*270);c.quadraticCurveTo(cx+300,cy+60,cx+120,cy+420);c.stroke()}c.lineCap='butt';
  sigHead(c,t,f,st,300,96,1.6);gSmall(c,f.sub,W/2,1440,40,2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.3,t,f,'center');logoCorner(c,A,t,2.3,W-150,170,110)}}
];

SIG['Usta Hizmetleri']=[
{k:'basinc',n:'Kombi Göstergesi',dur:7,def:{title:'Kombin kışa hazır mı?',d1:'1,5 bar',sub:'Bakım + petek kontrolü · ₺ 1.400 · aynı gün',cta:'Usta çağır'},labels:{title:'Başlık',d1:'Hedef basınç',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Gösterge',.1,.7],['İbre',.8,2.4],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=920,R=290;const e=sp(t,.1,.7);c.save();c.translate(cx,cy);c.scale(e,e);c.fillStyle='#E5E7EB';c.beginPath();c.arc(0,0,R+40,0,Math.PI*2);c.fill();c.fillStyle='#FFFFFF';c.beginPath();c.arc(0,0,R,0,Math.PI*2);c.fill();
  const a0=Math.PI*.8,a1=Math.PI*2.2;c.lineWidth=36;[['#EF4444',0,.3],['#22C55E',.3,.7],['#F59E0B',.7,1]].forEach(([col,u0,u1])=>{c.strokeStyle=col;c.beginPath();c.arc(0,0,R-50,a0+(a1-a0)*u0,a0+(a1-a0)*u1);c.stroke()});
  c.font=font(700,34,MONO);c.fillStyle='#111418';c.textAlign='center';['0','1','2','3','4'].forEach((s,i)=>{const a=a0+(a1-a0)*i/4;c.fillText(s,Math.cos(a)*(R-120),Math.sin(a)*(R-120)+12)});c.fillText('bar',0,140);
  const v=.08+.37*eback(clamp(prog(t,.8,2.4)))+Math.sin(t*10)*.004;const na=a0+(a1-a0)*v;c.strokeStyle='#111418';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(na)*(R-70),Math.sin(na)*(R-70));c.stroke();c.lineCap='butt';c.fillStyle='#111418';c.beginPath();c.arc(0,0,24,0,Math.PI*2);c.fill();c.restore();c.textAlign='left';
  const k=sp(t,2.4,2.9);if(k>0)chkTick(c,cx+300,cy-260,46,k);
  sigHead(c,t,f,st,300,84,.4);gSmall(c,f.sub,W/2,1400,38,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1550,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'canta',n:'Alet Çantası',dur:7,def:{title:'Her işe bir usta',d1:'Elektrik',d2:'Tesisat',d3:'Klima',sub:'Belgeli usta · 6 ay garanti',cta:'Randevu al'},labels:{title:'Başlık',d1:'Hizmet 1',d2:'Hizmet 2',d3:'Hizmet 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çanta',.1,.7],['Açılış',.8,1.4],['Aletler',1.3,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=1120;const op=eio(prog(t,.8,1.4));c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.7)),eo(prog(t,.1,.7)));c.fillStyle=f.a;rr(c,-320,-120,640,300,28);c.fill();c.fillStyle=mix(f.a,'#000000',.25);rr(c,-320,-120,640,50,20);c.fill();
  c.save();c.translate(0,-120);c.scale(1,Math.cos(op*Math.PI*.9));c.fillStyle=mix(f.a,'#000000',.15);rr(c,-320,-120,640,120,20);c.fill();c.fillStyle='#111418';rr(c,-90,-170,180,50,24);c.fill();c.restore();c.restore();
  const T=[[f.d1,-280,'tornavida'],[f.d2,0,'anahtar'],[f.d3,280,'çekiç']];T.forEach(([s,dx,kind],i)=>{const k=eback(clamp(prog(t,1.3+i*.3,1.8+i*.3)));if(k<=0)return;const x=cx+dx,y=cy-200-k*240;c.save();c.translate(x,y);c.rotate((i-1)*.2);
   if(kind==='tornavida'){c.fillStyle='#EF4444';rr(c,-22,-10,44,130,18);c.fill();c.fillStyle='#9CA3AF';c.fillRect(-7,-170,14,160)}else if(kind==='anahtar'){c.strokeStyle='#9CA3AF';c.lineWidth=26;c.beginPath();c.moveTo(0,-140);c.lineTo(0,120);c.stroke();c.lineWidth=18;c.beginPath();c.arc(0,-160,40,.6,Math.PI*2-.6);c.stroke()}else{c.fillStyle='#92400E';rr(c,-14,-60,28,200,10);c.fill();c.fillStyle='#4B5563';rr(c,-80,-100,160,56,12);c.fill()}c.restore();
   c.font=font(800,38,BODY);c.fillStyle=fg;c.textAlign='center';c.globalAlpha=clamp(k);c.fillText(s||'',x,cy-200-240+280);c.globalAlpha=1;c.textAlign='left'});
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.sub,W/2,1450,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1600,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'kesit',n:'Ev Kesiti',dur:8,def:{title:'Arıza nerede?',d1:'Sızıntı',d2:'Sigorta',d3:'Petek',sub:'Ücretsiz keşif · net fiyat · aynı gün',cta:'Usta çağır'},labels:{title:'Başlık',d1:'Nokta 1',d2:'Nokta 2',d3:'Nokta 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Ev',.1,.7],['Noktalar',1,3.2],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,y0=560;c.save();c.globalAlpha=eo(prog(t,.1,.7));c.strokeStyle=fg;c.lineWidth=10;c.beginPath();c.moveTo(cx-380,y0+200);c.lineTo(cx,y0-60);c.lineTo(cx+380,y0+200);c.stroke();c.strokeRect(cx-340,y0+200,680,620);c.beginPath();c.moveTo(cx-340,y0+510);c.lineTo(cx+340,y0+510);c.moveTo(cx,y0+200);c.lineTo(cx,y0+820);c.stroke();
  c.strokeStyle='#60A5FA';c.lineWidth=8;c.beginPath();c.moveTo(cx-300,y0+800);c.lineTo(cx-300,y0+560);c.lineTo(cx-60,y0+560);c.stroke();c.strokeStyle='#FBBF24';c.beginPath();c.moveTo(cx+300,y0+240);c.lineTo(cx+300,y0+470);c.lineTo(cx+60,y0+470);c.stroke();c.restore();
  const P=[[f.d1,cx-180,y0+620],[f.d2,cx+180,y0+340],[f.d3,cx+170,y0+700]];P.forEach(([s,x,y],i)=>{const k=sp(t,1+i*.7,1.4+i*.7);if(k<=0)return;for(let r=0;r<2;r++){const q=((t*1.2+r*.5)%1);c.strokeStyle=`rgba(239,68,68,${(1-q)*.7})`;c.lineWidth=4;c.beginPath();c.arc(x,y,20+q*60,0,Math.PI*2);c.stroke()}
   c.fillStyle='#EF4444';c.beginPath();c.arc(x,y,22*k,0,Math.PI*2);c.fill();c.font=font(800,34,BODY);const w=c.measureText(s||'').width+40;c.save();c.translate(x,y-60);c.scale(k,k);rr(c,-w/2,-30,w,60,30);c.fillStyle=lum(f.p)>.45?'#111418':'#FFFFFF';c.fill();c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#111418';c.textAlign='center';c.fillText(s||'',0,12);c.restore();c.textAlign='left'});
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.sub,W/2,1520,38,3.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1660,3.4,t,f,'center');logoCorner(c,A,t,3.4,W-150,170,110)}}
];

SIG['Bahçe & Peyzaj']=[
{k:'fidan',n:'Büyüyen Fidan',dur:7,def:{title:'Bahar dikimi başladı',sub:'Ücretsiz keşif · 3B bahçe tasarımı',cta:'Keşif iste'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Toprak',.1,.6],['Büyüme',.6,3],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const cx=W/2,gy=1300;const g=eio(prog(t,.6,3));c.fillStyle='#78350F';c.beginPath();c.ellipse(cx,gy,420,70,0,0,Math.PI*2);c.fill();c.fillStyle='#92400E';c.beginPath();c.ellipse(cx,gy-10,380,50,0,0,Math.PI*2);c.fill();
  const tr=(x,y,len,ang,d)=>{if(d>5||len<14)return;const k=clamp(g*6-d);if(k<=0)return;const ex=x+Math.cos(ang)*len*k,ey=y+Math.sin(ang)*len*k;c.strokeStyle=d<2?'#6B4423':'#4D7C0F';c.lineWidth=Math.max(3,26-d*5);c.beginPath();c.moveTo(x,y);c.lineTo(ex,ey);c.stroke();if(k<1)return;if(d>=3){c.fillStyle=d%2?'#65A30D':'#84CC16';c.beginPath();c.ellipse(ex,ey,30,16,ang,0,Math.PI*2);c.fill()}tr(ex,ey,len*.72,ang-.45+Math.sin(t+d)*.03,d+1);tr(ex,ey,len*.72,ang+.42,d+1)};
  c.lineCap='round';tr(cx,gy-20,260,-Math.PI/2,0);c.lineCap='butt';if(g>=1)for(let i=0;i<7;i++)flower(c,cx-260+((i*97)%520),gy-460-((i*131)%300),24,['#F472B6','#FBBF24','#F87171'][i%3],sp(t,3+i*.1,3.3+i*.1),i);
  sigHead(c,t,f,st,300,92,2.4);gSmall(c,f.sub,W/2,1470,40,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1620,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'cim',n:'Çim Biçme',dur:7,def:{title:'Haftalık bahçe bakımı',d1:'₺ 2.900/ay',sub:'Biçme · budama · gübre · sulama kontrolü',cta:'Abone ol'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çim',.1,.5],['Biçme',.6,2.8],['Fiyat',2.6,3.2]],
 draw(c,t,f,A,st){const x0=90,y0=560,w=W-180,h=760;c.fillStyle='#4D7C0F';rr(c,x0,y0,w,h,30);c.fill();const rows=5,rh=h/rows;const p=prog(t,.6,2.8)*rows;
  for(let r=0;r<rows;r++){const k=clamp(p-r);const ltr=r%2===0;const y=y0+r*rh;c.fillStyle=r%2?'#65A30D':'#84CC16';if(k>0){const xs=ltr?x0:x0+w-w*k;c.fillRect(xs,y,w*k,rh)}
   if(k<1){c.strokeStyle='#3F6212';c.lineWidth=3;for(let i=0;i<60;i++){const gx=x0+((i*37+r*11)%w);if(ltr?gx<x0+w*k:gx>x0+w-w*k)continue;c.beginPath();c.moveTo(gx,y+rh-6);c.lineTo(gx+6,y+rh*.3+Math.sin(t*3+i)*4);c.stroke()}}
   if(k>0&&k<1){const mx=ltr?x0+w*k:x0+w-w*k;c.fillStyle='#DC2626';rr(c,mx-70,y+rh/2-40,140,80,16);c.fill();c.fillStyle='#111418';c.beginPath();c.arc(mx-46,y+rh/2+40,18,0,Math.PI*2);c.arc(mx+46,y+rh/2+40,18,0,Math.PI*2);c.fill()}}
  priceTag(c,f.d1,W/2,1260,t,2.6,f,-.04);sigHead(c,t,f,st,300,88,.2);gSmall(c,f.sub,W/2,1450,38,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1600,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'sulama',n:'Damla Sulama',dur:7,def:{title:'Tatildeyken bile yeşil',d1:'%40',sub:'su tasarrufu · akıllı otomatik sulama (kurulum örneği)',cta:'Teklif al'},labels:{title:'Başlık',d1:'Tasarruf',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Hat',.1,.8],['Damlalar',.8,7],['Oran',2,2.6]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const y=800;const e=eo(prog(t,.1,.8));c.strokeStyle='#111418';c.lineWidth=18;c.beginPath();c.moveTo(80,y);c.lineTo(80+(W-160)*e,y);c.stroke();
  for(let i=0;i<6;i++){const x=150+i*(W-300)/5;c.fillStyle='#111418';c.fillRect(x-10,y,20,22);if(t>.8){const q=((t-.8)*1.3+i*.17)%1;c.fillStyle='#38BDF8';c.beginPath();const dy=y+30+q*300;c.moveTo(x,dy-18);c.quadraticCurveTo(x+12,dy,x,dy+10);c.quadraticCurveTo(x-12,dy,x,dy-18);c.fill()}
   const gk=clamp(prog(t,1.2+i*.2,2.4+i*.2));c.strokeStyle='#4D7C0F';c.lineWidth=8;c.beginPath();c.moveTo(x,1180);c.lineTo(x,1180-120*gk);c.stroke();c.fillStyle='#65A30D';c.beginPath();c.ellipse(x-24,1180-90*gk,26*gk,12*gk,-.5,0,Math.PI*2);c.ellipse(x+24,1170-110*gk,26*gk,12*gk,.5,0,Math.PI*2);c.fill()}
  c.fillStyle='#78350F';c.fillRect(60,1180,W-120,40);const k=sp(t,2,2.5);if(k>0){c.save();c.translate(W/2,1400);c.scale(k,k);c.font=font(900,150,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,88,.4);gSmall(c,f.sub,W/2,1480,34,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1620,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}}
];

SIG['Mimarlık & İç Tasarım']=[
{k:'mavi',n:'Mavi Baskı',dur:7,def:{title:'Hayalindeki ev, önce kâğıtta',sub:'Konsept + 3B görsel · 3 hafta',cta:'Tanışalım'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kâğıt',.1,.6],['Çizim',.7,3],['Başlık',2.6,3.2]],
 draw(c,t,f,A,st){const x0=110,y0=480,w=W-220,h=860;c.fillStyle='#1E40AF';c.fillRect(x0,y0,w,h);c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;for(let x=x0;x<x0+w;x+=40){c.beginPath();c.moveTo(x,y0);c.lineTo(x,y0+h);c.stroke()}for(let y=y0;y<y0+h;y+=40){c.beginPath();c.moveTo(x0,y);c.lineTo(x0+w,y);c.stroke()}
  const L=[[200,600,880,600],[880,600,880,1220],[880,1220,200,1220],[200,1220,200,600],[540,600,540,900],[540,900,880,900],[200,960,420,960],[420,960,420,1220],[620,1220,620,1060],[620,1060,880,1060]];const p=prog(t,.7,3)*L.length;c.strokeStyle='#FFFFFF';c.lineWidth=6;c.lineCap='round';
  L.forEach(([a,b,cc,d],i)=>{const k=clamp(p-i);if(k<=0)return;c.beginPath();c.moveTo(a,b);c.lineTo(a+(cc-a)*k,b+(d-b)*k);c.stroke()});c.lineCap='butt';
  if(p>4){c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=2;c.beginPath();c.arc(540,900,90,Math.PI,Math.PI*1.5);c.stroke();c.font=font(500,24,MONO);c.fillStyle='rgba(255,255,255,.8)';c.fillText('SALON 32 m²',600,760);c.fillText('MUTFAK',240,1100);c.fillText('BANYO',650,1150)}
  c.save();c.globalAlpha=clamp(p/2);c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=2;c.beginPath();c.moveTo(200,560);c.lineTo(880,560);c.stroke();c.font=font(600,24,MONO);c.fillStyle='#FFFFFF';c.textAlign='center';c.fillText('12,40 m',540,550);c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,80,2.6);gSmall(c,f.sub,W/2,1440,40,3,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,3.2,t,f,'center');logoCorner(c,A,t,3.2,W-150,170,110)}},
{k:'eskiz',n:'Eskizden Renge',dur:7,def:{title:'Salonun yeni hali',sub:'Önce eskiz, sonra gerçek · Çizgi Mimarlık',cta:'Projeyi gör'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Eskiz',.1,1.4],['Renk',1.6,2.8],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const x0=110,y0=520,w=W-220,h=760;const col=eio(prog(t,1.6,2.8));c.fillStyle='#FAF8F3';c.fillRect(x0,y0,w,h);
  c.save();c.beginPath();c.rect(x0,y0,w*col,h);c.clip();c.fillStyle='#E7DCCB';c.fillRect(x0,y0,w,h*.65);c.fillStyle='#B08968';c.fillRect(x0,y0+h*.65,w,h*.35);c.fillStyle='#8FB8D8';c.fillRect(x0+60,y0+80,260,300);c.fillStyle=f.a;rr(c,x0+300,y0+h*.48,460,170,30);c.fill();c.fillStyle='#4D7C0F';c.beginPath();c.arc(x0+820,y0+h*.48,60,0,Math.PI*2);c.fill();c.fillStyle='#78350F';c.fillRect(x0+800,y0+h*.48,40,150);c.fillStyle='#F3E8D2';c.beginPath();c.ellipse(x0+w/2,y0+h*.86,280,50,0,0,Math.PI*2);c.fill();c.restore();
  const p=prog(t,.1,1.4);c.strokeStyle='#1F2937';c.lineWidth=4;c.lineCap='round';const sk=[[x0,y0+h*.65,x0+w,y0+h*.65],[x0+60,y0+80,x0+320,y0+80],[x0+320,y0+80,x0+320,y0+380],[x0+320,y0+380,x0+60,y0+380],[x0+60,y0+380,x0+60,y0+80],[x0+300,y0+h*.48,x0+760,y0+h*.48],[x0+760,y0+h*.48,x0+760,y0+h*.48+170],[x0+300,y0+h*.48+170,x0+760,y0+h*.48+170],[x0+300,y0+h*.48,x0+300,y0+h*.48+170]];sk.forEach(([a,b,cc,d],i)=>{const k=clamp(p*sk.length-i);if(k<=0)return;c.globalAlpha=1-col*.7;c.beginPath();c.moveTo(a+Math.sin(i)*3,b);c.lineTo(a+(cc-a)*k,b+(d-b)*k+Math.cos(i)*3);c.stroke()});c.globalAlpha=1;c.lineCap='butt';
  if(col>0&&col<1){c.fillStyle='#FFFFFF';c.fillRect(x0+w*col-3,y0,6,h)}c.strokeStyle=fgOf(f.p);c.lineWidth=10;c.strokeRect(x0,y0,w,h);
  sigHead(c,t,f,st,300,92,2.4);gSmall(c,f.sub,W/2,1420,40,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'kesit',n:'Patlatılmış Katlar',dur:7,def:{title:'Dubleks projesi',d1:'Çatı katı',d2:'Yaşam katı',d3:'Bahçe katı',sub:'Mimari + iç mimari tek ekipte',cta:'Görüşme ayarla'},labels:{title:'Başlık',d1:'Kat 1',d2:'Kat 2',d3:'Kat 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Katlar',.2,2.4],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const ex=eio(prog(t,.6,2.4));const L=[[f.d1,0],[f.d2,1],[f.d3,2]];L.forEach(([s,i])=>{const y=1150-i*(110+ex*150);const k=eo(prog(t,.2+i*.2,.6+i*.2));c.save();c.globalAlpha=k;c.translate(W/2,y);
  c.fillStyle=[mix(f.a,'#FFFFFF',.2),mix(f.a,'#FFFFFF',.45),mix(f.a,'#FFFFFF',.65)][i];c.beginPath();c.moveTo(-340,0);c.lineTo(0,-150);c.lineTo(340,0);c.lineTo(0,150);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.moveTo(-340,0);c.lineTo(0,150);c.lineTo(0,186);c.lineTo(-340,36);c.closePath();c.fill();c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.moveTo(340,0);c.lineTo(0,150);c.lineTo(0,186);c.lineTo(340,36);c.closePath();c.fill();
  c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=3;c.beginPath();c.moveTo(-120,-90);c.lineTo(80,10);c.moveTo(60,-120);c.lineTo(-60,-60);c.stroke();c.restore();
  c.globalAlpha=ex;c.font=font(800,34,BODY);c.fillStyle=fg;c.fillText(s||'',W/2+360,y+10);c.fillStyle=fgA(f.p,.4);c.fillRect(W/2+200,y+2,150,3);c.globalAlpha=1});
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.sub,W/2,1450,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1600,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}}
];

SIG['Matbaa & Baskı']=[
{k:'cmyk',n:'CMYK Katmanları',dur:7,def:{title:'Renkler ekrandaki gibi',sub:'Ofset ve dijital baskı · renk garantisi',cta:'Teklif al'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Katmanlar',.2,2.4],['Başlık',2.2,3]],
 draw(c,t,f,A,st){const cx=W/2,cy=900;const C=[['#00AEEF',-120,-80],['#EC008C',120,-80],['#FFF200',0,110],['#111418',0,0]];c.save();c.globalAlpha=eo(prog(t,0,.4));c.fillStyle='#FFFFFF';c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=30;rr(c,cx-420,cy-420,840,840,20);c.fill();c.restore();c.save();c.globalCompositeOperation='multiply';C.forEach(([col,dx,dy],i)=>{const k=eo(prog(t,.2+i*.5,.8+i*.5));if(k<=0)return;const conv=eio(prog(t,2,2.6));c.globalAlpha=i===3?.0+conv*.0:.9;c.fillStyle=col;c.beginPath();c.arc(cx+dx*(1-conv*.0),cy+dy,(i===3?0:220)*k,0,Math.PI*2);c.fill()});c.restore();
  c.font=font(700,30,MONO);['C','M','Y','K'].forEach((s,i)=>{c.fillStyle=['#00AEEF','#EC008C','#D4C400','#111418'][i];c.fillText(s,W/2-120+i*80,1260)});
  sigHead(c,t,f,st,300,90,2.2);gSmall(c,f.sub,W/2,1400,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1560,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'deste',n:'Kartvizit Destesi',dur:7,def:{title:'1000 kartvizit',d1:'₺ 690',sub:'350 gr selofanlı · aynı gün',cta:'Sipariş ver'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Deste',.1,.8],['Yelpaze',.9,2.2],['Fiyat',2.2,2.8]],
 draw(c,t,f,A,st){const cx=W/2,cy=1000;const fan=eio(prog(t,.9,2.2));for(let i=0;i<9;i++){const a=(i-4)*.12*fan;c.save();c.translate(cx,cy+200);c.rotate(a);c.translate(0,-200-(1-eo(prog(t,.1+i*.05,.6+i*.05)))*800);c.fillStyle=i%2?'#FFFFFF':'#F3F4F6';c.shadowColor='rgba(0,0,0,.2)';c.shadowBlur=12;rr(c,-260,-150,520,300,14);c.fill();c.shadowBlur=0;
  if(i===8){c.fillStyle=f.a;c.fillRect(-260,-150,24,300);c.font=font(800,40,BODY);c.fillStyle='#111418';c.fillText('Renk Matbaa',-200,-60);c.font=font(500,24,MONO);c.fillStyle='#6B7280';c.fillText('Selim R. · Kurucu',-200,-20);c.fillText('0 212 000 00 00',-200,80)}c.restore()}
  priceTag(c,f.d1,W-240,640,t,2.2,f,.1);sigHead(c,t,f,st,300,96,.4);gSmall(c,f.sub,W/2,1440,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'giyotin',n:'Kâğıt Kesimi',dur:7,def:{title:'Broşür, afiş, etiket',d1:'BASKI',sub:'Tasarım ücretsiz · kurye ile teslim',cta:'Dosyanı gönder'},labels:{title:'Başlık',d1:'Kâğıttaki yazı',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kâğıt',.1,.8],['Kesim',1,2],['Başlık',1.8,2.6]],
 draw(c,t,f,A,st){const cx=W/2,cy=980;const cut=eio(prog(t,1,1.5));const sep=eio(prog(t,1.5,2.2));c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.8)),eo(prog(t,.1,.8)));
  [-1,1].forEach(sg=>{c.save();c.translate(sg*sep*60,sep*20*sg);c.rotate(sg*sep*.04);c.beginPath();c.rect(sg<0?-400:0,-500,400,1000);c.clip();for(let i=0;i<6;i++){c.fillStyle=i%2?'#FFFFFF':'#F5F5F4';c.fillRect(-340+i*3,-260-i*6,680,520)}c.fillStyle=f.a;c.fillRect(-320,-240,640,480);c.font=font(900,180,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(f.d1||'',0,60);c.restore()});
  const by=lerpN(-600,0,cut)-(t>1.5?eio(prog(t,1.5,2))*600:0);c.beginPath();c.rect(-500,-400,1000,900);c.clip();c.fillStyle='#9CA3AF';c.beginPath();c.moveTo(-14,by-500);c.lineTo(14,by-500);c.lineTo(10,by+300);c.lineTo(-10,by+300);c.closePath();c.fill();c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,90,1.8);gSmall(c,f.sub,W/2,1440,40,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}}
];

SIG['Catering & Ev Yemekleri']=[
{k:'klos',n:'Kalkan Kloş',dur:7,def:{title:'Davetinizde ev yemeği',d1:'₺ 390 / kişi',sub:'Kokteyl menüsü · servis ekibi dahil',cta:'Menüyü iste'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kloş',.1,.8],['Açılış',1,1.8],['Buhar',1.6,7]],
 draw(c,t,f,A,st){const cx=W/2,cy=1040;const up=eio(prog(t,1,1.8));plate(c,cx,cy+20,330,f);
  if(up>0){c.fillStyle='#C2410C';c.beginPath();c.ellipse(cx,cy,190,100,0,0,Math.PI*2);c.fill();c.fillStyle='#EA580C';c.beginPath();c.ellipse(cx-40,cy-20,90,46,-.3,0,Math.PI*2);c.fill();for(let i=0;i<10;i++){c.fillStyle='#16A34A';c.beginPath();c.ellipse(cx-140+i*30,cy-60+Math.sin(i)*30,14,6,i,0,Math.PI*2);c.fill()}steam(c,cx,cy-90,t,clamp(prog(t,1.6,2.2))*.8,3,320)}
  c.save();c.translate(cx+up*330,cy-up*230);c.rotate(up*.45);c.scale(1-up*.4,1-up*.4);const g=c.createLinearGradient(-300,0,300,0);g.addColorStop(0,'#9CA3AF');g.addColorStop(.4,'#F3F4F6');g.addColorStop(1,'#6B7280');c.fillStyle=g;c.beginPath();c.ellipse(0,0,300,250,0,Math.PI,0);c.fill();c.fillStyle='#D1D5DB';c.fillRect(-310,-10,620,24);c.fillStyle='#4B5563';c.beginPath();c.arc(0,-260,26,0,Math.PI*2);c.fill();c.restore();
  priceTag(c,f.d1,W-260,1300,t,2.2,f,-.08);sigHead(c,t,f,st,300,90,2);gSmall(c,f.sub,W/2,1470,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1620,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'tabaklar',n:'Sıralanan Tabaklar',dur:7,def:{title:'Ofis öğle menüsü',d1:'Çorba',d2:'Ana yemek',d3:'Salata',sub:'₺ 240 / kişi · her gün taze · kapıya teslim',cta:'Teklif al'},labels:{title:'Başlık',d1:'Tabak 1',d2:'Tabak 2',d3:'Tabak 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Tabaklar',.2,2],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const P=[[f.d1,'#D97706'],[f.d2,'#B45309'],[f.d3,'#16A34A']];P.forEach(([s,col],i)=>{const k=eo(prog(t,.2+i*.5,.8+i*.5));if(k<=0)return;const x=W/2+(i-1)*310,y=900;c.save();c.translate(x+(1-k)*W,y);plate(c,0,0,140,f);c.fillStyle=col;c.beginPath();c.arc(0,0,92,0,Math.PI*2);c.fill();c.fillStyle='rgba(255,255,255,.25)';for(let j=0;j<8;j++){c.beginPath();c.arc(Math.cos(j*2.4)*50,Math.sin(j*2.4)*50,10,0,Math.PI*2);c.fill()}c.restore();
  c.font=font(800,38,BODY);c.fillStyle=fg;c.textAlign='center';c.globalAlpha=k;c.fillText(s||'',x,y+220);c.globalAlpha=1;c.textAlign='left'});
  c.fillStyle=fgA(f.p,.15);rr(c,100,1140,W-200,10,5);c.fill();
  sigHead(c,t,f,st,300,92,.5);gSmall(c,f.sub,W/2,1340,40,2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1490,2.3,t,f,'center');logoCorner(c,A,t,2.3,W-150,170,110)}},
{k:'menu',n:'Haftalık Menü Kartları',dur:8,def:{title:'Bu haftanın menüsü',d1:'Pzt · Mantı',d2:'Çar · Karnıyarık',d3:'Cum · Fırın balık',sub:'Anne Eli Catering',cta:'Siparişini ver'},labels:{title:'Başlık',d1:'Gün · yemek 1',d2:'Gün · yemek 2',d3:'Gün · yemek 3',sub:'Marka',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Kartlar',.4,3],['Başlık',.2,1]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);[f.d1,f.d2,f.d3].forEach((s,i)=>{const [d,y_]=String(s||'').split('·').map(z=>z.trim());const k=eback(clamp(prog(t,.4+i*.6,.9+i*.6)));if(k<=0)return;c.save();c.translate(W/2+(i-1)*24,660+i*230);c.rotate((i-1)*.03);c.scale(k,k);
  rr(c,-400,-90,800,180,24);c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#FAF7F2';c.fill();c.fillStyle=f.a;rr(c,-400,-90,170,180,24);c.fill();c.fillRect(-250,-90,20,180);c.font=font(900,64,COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText((d||'').toLocaleUpperCase('tr'),-315,22);c.font=font(800,52,SERIF);c.fillStyle='#1F2937';c.textAlign='left';c.fillText(y_||'',-190,18);c.restore()});
  sigHead(c,t,f,st,300,92,.2);gSmall(c,f.sub,W/2,1420,40,2.4,t,fgA(f.p,.75),'center',900,1,700);gPill(c,f.cta,W/2,1560,2.6,t,f,'center');logoCorner(c,A,t,2.6,W-150,170,110)}}
];

SIG['Gelinlik & Abiye']=[
{k:'duvak',n:'Dalgalanan Duvak',dur:7,def:{title:'Hayalinizdeki o gün',sub:'2027 gelinlik koleksiyonu · prova randevuyla',cta:'Prova ayarla'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Duvak',.1,7],['Başlık',1,1.8]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const e=eo(prog(t,.1,1.2));c.save();c.globalAlpha=.85*e;for(let L=0;L<3;L++){c.fillStyle=`rgba(255,255,255,${.22-L*.05})`;c.beginPath();c.moveTo(W/2-60,360);for(let x=0;x<=1;x+=.02){const px=W/2-60-x*(420+L*60),py=360+x*1180+Math.sin(x*6+t*1.8+L)*60*x;c.lineTo(px,py)}for(let x=1;x>=0;x-=.02){const px=W/2+60+x*(420+L*60),py=360+x*1180+Math.sin(x*6+t*1.8+L+1)*60*x;c.lineTo(px,py)}c.closePath();c.fill()}
  c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=2;for(let i=0;i<14;i++){const u=i/13;c.beginPath();for(let x=0;x<=1;x+=.05){const px=W/2+(u-.5)*2*(60+x*480),py=360+x*1180+Math.sin(x*6+t*1.8+u*3)*60*x;x?c.lineTo(px,py):c.moveTo(px,py)}c.stroke()}c.restore();
  c.fillStyle=goldGrad(c,W/2-90,330,W/2+90,380);c.beginPath();c.ellipse(W/2,350,100,26,0,0,Math.PI*2);c.fill();for(let i=0;i<5;i++)sparkle(c,W/2-80+i*40,340,10,1);
  const k=eo(prog(t,1,1.8));c.globalAlpha=k;c.font=font(500,100,SERIF);c.fillStyle=fg;c.textAlign='center';wrap(c,f.title||'',900,2).forEach((l,i)=>c.fillText(l,W/2,980+i*110));c.globalAlpha=1;c.textAlign='left';
  gSmall(c,f.sub,W/2,1300,40,1.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1460,1.9,t,f,'center');logoCorner(c,A,t,1.9,W-150,170,110)}},
{k:'elbise',n:'Elbise Silüeti',dur:7,def:{title:'Prenses gelinlik',d1:'Kiralama ₺ 14.900',sub:'ölçüye uyarlama dahil',cta:'Modeli dene'},labels:{title:'Başlık',d1:'Fiyat / seçenek',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Çizim',.1,2],['Dolgu',1.8,2.8],['Başlık',2.4,3.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2;const p=prog(t,.1,2);const fill=eo(prog(t,1.8,2.8));const path=()=>{c.beginPath();c.moveTo(cx-70,440);c.quadraticCurveTo(cx,470,cx+70,440);c.lineTo(cx+90,620);c.quadraticCurveTo(cx+60,660,cx+70,700);c.bezierCurveTo(cx+260,900,cx+380,1200,cx+400,1330);c.quadraticCurveTo(cx,1380,cx-400,1330);c.bezierCurveTo(cx-380,1200,cx-260,900,cx-70,700);c.quadraticCurveTo(cx-60,660,cx-90,620);c.closePath()};
  if(fill>0){c.save();c.globalAlpha=fill;path();const g=c.createLinearGradient(0,440,0,1380);g.addColorStop(0,'#FFFFFF');g.addColorStop(1,'#F3E8EE');c.fillStyle=g;c.fill();c.globalAlpha=fill*.5;c.strokeStyle='rgba(200,170,190,.6)';c.lineWidth=3;for(let i=-4;i<=4;i++){c.beginPath();c.moveTo(cx+i*10,720);c.quadraticCurveTo(cx+i*50,1050,cx+i*90,1350);c.stroke()}c.restore();for(let i=0;i<12;i++)sparkle(c,cx-60+((i*37)%120),480+((i*53)%200),8,fill*(.5+.5*Math.sin(t*5+i)))}
  c.save();c.setLineDash([3000]);c.lineDashOffset=3000*(1-p);path();c.strokeStyle=fg;c.lineWidth=5;c.stroke();c.restore();
  priceTag(c,f.d1,W-260,1450,t,2.6,f,-.05);sigHead(c,t,f,st,300,92,2.4);gSmall(c,f.sub,W/2,1590,36,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1720,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}},
{k:'prova',n:'Prova Takvimi',dur:8,def:{title:'Prova günlerinizi planlayın',d1:'1. prova · model seçimi',d2:'2. prova · ölçü',d3:'3. prova · son dokunuş',sub:'Düğüne 3 ay kala başlayın',cta:'Randevu al'},labels:{title:'Başlık',d1:'Adım 1',d2:'Adım 2',d3:'Adım 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Takvim',.1,.7],['Adımlar',.9,3.2],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x0=140,y0=470,cw=(W-280)/7;c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#16181D';rr(c,x0-20,y0-20,W-240,560,24);c.fill();for(let i=0;i<28;i++){const x=x0+(i%7)*cw,y=y0+Math.floor(i/7)*130;const marks=[4,15,26];const mi=marks.indexOf(i);const on=mi>=0&&t>.9+mi*.8;c.fillStyle=on?f.a:fgA(f.p,.06);rr(c,x+6,y+6,cw-12,118,14);c.fill();c.font=font(700,30,MONO);c.fillStyle=on?onColor(f.a):fgA(f.p,.6);c.fillText(String(i+1),x+18,y+44);if(on){c.save();c.translate(x+cw/2,y+84);c.fillStyle=onColor(f.a);c.beginPath();c.moveTo(0,10);c.bezierCurveTo(-24,-10,-14,-30,0,-16);c.bezierCurveTo(14,-30,24,-10,0,10);c.fill();c.restore()}}
  [f.d1,f.d2,f.d3].forEach((s,i)=>{const k=eo(prog(t,.9+i*.8,1.3+i*.8));if(k<=0)return;c.globalAlpha=k;c.font=font(700,40,BODY);c.fillStyle=fg;c.fillText('♥ '+(s||''),150,1140+i*70);c.globalAlpha=1});
  sigHead(c,t,f,st,300,82,.4);gSmall(c,f.sub,W/2,1440,38,3.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1590,3.6,t,f,'center');logoCorner(c,A,t,3.6,W-150,170,110)}}
];

SIG['Araç Kiralama']=[
{k:'kart',n:'Anahtar Teslim',dur:7,def:{title:'Havalimanında 5 dakikada',d1:'₺ 1.290 / gün',sub:'Kasko dahil · sınırsız km',cta:'Rezervasyon yap'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Araç',.1,1.4],['Anahtar',1.4,2.2],['Fiyat',2.2,2.8]],
 draw(c,t,f,A,st){const cx=W/2,cy=960;const k=eio(prog(t,.1,1.4));c.save();c.translate(cx+(1-k)*-W,cy);const g=c.createLinearGradient(0,-150,0,120);g.addColorStop(0,mix(f.a,'#FFFFFF',.2));g.addColorStop(1,mix(f.a,'#000000',.3));c.fillStyle=g;c.beginPath();c.moveTo(-420,60);c.lineTo(-400,-40);c.quadraticCurveTo(-300,-70,-200,-80);c.lineTo(-120,-170);c.quadraticCurveTo(0,-200,140,-170);c.lineTo(240,-80);c.quadraticCurveTo(380,-70,420,-20);c.lineTo(430,60);c.closePath();c.fill();
  c.fillStyle='rgba(200,230,255,.7)';c.beginPath();c.moveTo(-180,-80);c.lineTo(-110,-155);c.lineTo(0,-170);c.lineTo(0,-80);c.closePath();c.fill();c.beginPath();c.moveTo(20,-80);c.lineTo(20,-170);c.lineTo(130,-158);c.lineTo(210,-80);c.closePath();c.fill();
  [-260,260].forEach(x=>{c.fillStyle='#111418';c.beginPath();c.arc(x,70,76,0,Math.PI*2);c.fill();c.fillStyle='#9CA3AF';c.beginPath();c.arc(x,70,34,0,Math.PI*2);c.fill();c.save();c.translate(x,70);c.rotate(t*(k<1?20:0));c.fillStyle='#4B5563';c.fillRect(-4,-30,8,60);c.restore()});c.fillStyle='#FDE68A';c.beginPath();c.ellipse(400,-30,26,14,0,0,Math.PI*2);c.fill();c.restore();
  const kk=sp(t,1.4,1.9);if(kk>0){c.save();c.translate(cx,cy-360);c.rotate(Math.sin(t*3)*.2);c.scale(kk,kk);c.strokeStyle='#9CA3AF';c.lineWidth=10;c.beginPath();c.arc(0,-60,30,0,Math.PI*2);c.stroke();c.fillStyle='#111418';rr(c,-60,-30,120,170,40);c.fill();c.fillStyle=f.a;c.beginPath();c.arc(0,40,22,0,Math.PI*2);c.fill();c.restore()}
  priceTag(c,f.d1,W/2,1240,t,2.2,f,-.04);sigHead(c,t,f,st,300,88,1.4);gSmall(c,f.sub,W/2,1420,40,2.4,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.7,t,f,'center');logoCorner(c,A,t,2.7,W-150,170,110)}},
{k:'takvim',n:'Tarih Aralığı',dur:8,def:{title:'Haftalık kiralamada %20',d1:'7 gün',sub:'Yılbaşı için erken rezervasyon',cta:'Tarihini seç'},labels:{title:'Başlık',d1:'Süre',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Takvim',.1,.7],['Seçim',1,2.6],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const x0=140,y0=500,cw=(W-280)/7,chh=120;c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#16181D';rr(c,x0-20,y0-80,W-240,720,24);c.fill();['P','S','Ç','P','C','C','P'].forEach((d,i)=>{c.font=font(700,26,MONO);c.fillStyle=fgA(f.p,.5);c.textAlign='center';c.fillText(d,x0+i*cw+cw/2,y0-30)});
  const s0=9,len=7;const sel=Math.floor(eio(prog(t,1,2.6))*len);for(let i=0;i<35;i++){const x=x0+(i%7)*cw,y=y0+Math.floor(i/7)*chh;const d=i-2;if(d<1||d>31)continue;const inR=d>=s0&&d<s0+sel+1&&t>1;const edge=d===s0||d===s0+sel;if(inR){c.fillStyle=edge?f.a:mix(f.a,lum(f.p)>.45?'#FFFFFF':'#16181D',.7);rr(c,x+4,y+10,cw-8,chh-20,edge?40:8);c.fill()}c.font=font(700,36,BODY);c.fillStyle=inR&&edge?onColor(f.a):fg;c.fillText(String(d),x+cw/2,y+chh/2+12)}c.textAlign='left';
  const k=sp(t,2.6,3);if(k>0){c.save();c.translate(W/2,1290);c.scale(k,k);c.font=font(900,120,COND);c.fillStyle=f.a;c.textAlign='center';c.fillText(f.d1||'',0,0);c.restore();c.textAlign='left'}
  sigHead(c,t,f,st,300,84,.4);gSmall(c,f.sub,W/2,1420,40,3,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,3.2,t,f,'center');logoCorner(c,A,t,3.2,W-150,170,110)}},
{k:'yol',n:'Yol Haritası',dur:7,def:{title:'Rotanı sen çiz',d1:'İzmir',d2:'Çeşme',sub:'Tek yön kiralama · farklı şubeye iade',cta:'Aracını seç'},labels:{title:'Başlık',d1:'Başlangıç',d2:'Varış',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Yol',.2,2.6],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const p=eio(prog(t,.2,2.6));const P=[];for(let i=0;i<=60;i++){const u=i/60;P.push([140+u*(W-280),1300-u*600+Math.sin(u*Math.PI*2.4)*140])}
  c.strokeStyle=fgA(f.p,.15);c.lineWidth=60;c.lineCap='round';c.beginPath();P.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.setLineDash([24,20]);c.strokeStyle=fgA(f.p,.4);c.lineWidth=5;c.stroke();c.setLineDash([]);
  const n=Math.floor(60*p);c.strokeStyle=f.a;c.lineWidth=14;c.beginPath();P.slice(0,n+1).forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();c.lineCap='butt';const [cx_,cy_]=P[n];c.fillStyle=f.a;c.beginPath();c.arc(cx_,cy_,26,0,Math.PI*2);c.fill();c.fillStyle='#FFFFFF';c.beginPath();c.arc(cx_,cy_,10,0,Math.PI*2);c.fill();
  [[f.d1,P[0],0],[f.d2,P[60],2.4]].forEach(([s,[x,y],t0])=>{const k=sp(t,t0,t0+.4);if(k<=0)return;c.save();c.translate(x,y-70);c.scale(k,k);c.font=font(800,38,BODY);const w=c.measureText(s||'').width+44;rr(c,-w/2,-32,w,64,32);c.fillStyle=lum(f.p)>.45?'#111418':'#FFFFFF';c.fill();c.fillStyle=lum(f.p)>.45?'#FFFFFF':'#111418';c.textAlign='center';c.fillText(s||'',0,13);c.restore();c.textAlign='left'});
  sigHead(c,t,f,st,300,96,.4);gSmall(c,f.sub,W/2,1470,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1620,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}}
];

SIG['Seyahat Acentesi']=[
{k:'binis',n:'Biniş Kartı',dur:7,def:{title:'Kapadokya turu',d1:'IST',d2:'NAV',sub:'2 gece · balon turu dahil · kişi başı ₺ 8.900',cta:'Yerini ayırt'},labels:{title:'Başlık',d1:'Kalkış kodu',d2:'Varış kodu',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Kart',.1,.8],['Yırtma',1.6,2.4],['Başlık',.6,1.4]],
 draw(c,t,f,A,st){const cx=W/2,cy=920;const tear=eio(prog(t,1.6,2.4));c.save();c.translate(cx,cy);c.rotate(-.04);c.scale(eo(prog(t,.1,.8)),eo(prog(t,.1,.8)));
  const body=()=>{rr(c,-420,-230,640,460,26);c.fillStyle='#FFFFFF';c.fill();c.fillStyle=f.a;rr(c,-420,-230,640,90,26);c.fill();c.fillRect(-420,-170,640,30);c.font=font(800,28,MONO);c.fillStyle=onColor(f.a);c.fillText('BİNİŞ KARTI · BOARDING',-380,-170);
   c.font=font(900,120,COND);c.fillStyle='#111418';c.fillText(f.d1||'',-380,40);c.textAlign='right';c.fillText(f.d2||'',180,40);c.textAlign='left';c.strokeStyle='#9CA3AF';c.lineWidth=4;c.setLineDash([10,10]);c.beginPath();c.moveTo(-180,0);c.lineTo(-30,0);c.stroke();c.setLineDash([]);c.save();c.translate(-100,-4);c.fillStyle=f.a;c.beginPath();c.moveTo(30,0);c.lineTo(-20,-24);c.lineTo(-10,0);c.lineTo(-20,24);c.closePath();c.fill();c.restore();
   c.font=font(600,26,MONO);c.fillStyle='#6B7280';['KAPI B12','KOLTUK 14A','GRUP 2'].forEach((s,i)=>c.fillText(s,-380+i*200,140))};body();
  c.save();c.translate(tear*80,tear*120);c.rotate(tear*.25);rr(c,230,-230,190,460,26);c.fillStyle='#FFFFFF';c.fill();for(let i=0;i<22;i++){c.fillStyle='#111418';c.fillRect(260+i*6,-120,i%3?2:4,240)}c.restore();
  c.strokeStyle='#D1D5DB';c.lineWidth=4;c.setLineDash([8,10]);c.beginPath();c.moveTo(226,-220);c.lineTo(226,220);c.stroke();c.setLineDash([]);c.restore();
  sigHead(c,t,f,st,300,92,.6);gSmall(c,f.sub,W/2,1340,38,2.2,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1490,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'dunya',n:'Dünya Rotası',dur:7,def:{title:'Kuzey ışıkları turu',d1:'Şubat 2027',sub:'Norveç · 5 gece · rehberli',cta:'Bilgi al'},labels:{title:'Başlık',d1:'Tarih',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Küre',.1,.8],['Uçuş',.8,2.6],['Başlık',.4,1.2]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=900,R=360;c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.8)),eo(prog(t,.1,.8)));c.fillStyle=mix(f.a,f.p,.6);c.beginPath();c.arc(0,0,R,0,Math.PI*2);c.fill();c.save();c.beginPath();c.arc(0,0,R,0,Math.PI*2);c.clip();
  for(let i=0;i<400;i++){const la=Math.asin(2*((i*.618)%1)-1),lo=i*2.399+t*.3;const x=Math.cos(la)*Math.sin(lo),y=Math.sin(la),z=Math.cos(la)*Math.cos(lo);if(z<0)continue;const land=Math.sin(lo*3+la*2)>.2;if(!land)continue;c.fillStyle=`rgba(255,255,255,${.25+.5*z})`;c.beginPath();c.arc(x*R,y*R,4,0,Math.PI*2);c.fill()}c.restore();
  const p=eio(prog(t,.8,2.6));const a0=[-200,120],a1=[120,-260];c.strokeStyle='#FFFFFF';c.lineWidth=5;c.setLineDash([14,12]);c.beginPath();c.moveTo(...a0);const mx=(a0[0]+a1[0])/2,my=(a0[1]+a1[1])/2-200;c.quadraticCurveTo(mx,my,a1[0],a1[1]);c.stroke();c.setLineDash([]);
  const bx=(1-p)*(1-p)*a0[0]+2*(1-p)*p*mx+p*p*a1[0],by=(1-p)*(1-p)*a0[1]+2*(1-p)*p*my+p*p*a1[1];c.save();c.translate(bx,by);c.rotate(Math.atan2(a1[1]-my+(my-a0[1])*(1-p),a1[0]-mx+(mx-a0[0])*(1-p)));c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(30,0);c.lineTo(-20,-12);c.lineTo(-10,0);c.lineTo(-20,12);c.closePath();c.fill();c.fillRect(-8,-30,10,60);c.restore();
  [a0,a1].forEach(([x,y],i)=>{c.fillStyle=i?'#FBBF24':'#FFFFFF';c.beginPath();c.arc(x,y,14,0,Math.PI*2);c.fill()});c.restore();
  if(t>2.4){for(let i=0;i<3;i++){c.save();c.globalAlpha=.25;c.strokeStyle=['#34D399','#A78BFA','#22D3EE'][i];c.lineWidth=30;c.beginPath();for(let x=0;x<=W;x+=40)c.lineTo(x,420+i*30+Math.sin(x*.01+t*2+i)*40);c.stroke();c.restore()}}
  sigHead(c,t,f,st,300,90,.4);gSmall(c,f.d1,W/2,1360,48,2.4,t,f.a,'center',900,1,800);gSmall(c,f.sub,W/2,1430,38,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1580,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'damga',n:'Pasaport Damgası',dur:7,def:{title:'Vize işlemlerin bizde',d1:'ROMA',d2:'PARİS',d3:'TOKYO',sub:'Evrak hazırlığı + randevu takibi',cta:'Danış'},labels:{title:'Başlık',d1:'Damga 1',d2:'Damga 2',d3:'Damga 3',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Pasaport',.1,.8],['Damgalar',1,2.8],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const cx=W/2,cy=920;c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.8)),eo(prog(t,.1,.8)));c.fillStyle='#7F1D1D';rr(c,-400,-300,800,600,24);c.fill();c.fillStyle='#FDF6E3';rr(c,-370,-270,740,540,12);c.fill();c.fillStyle='rgba(0,0,0,.08)';c.fillRect(-6,-270,12,540);
  const S=[[f.d1,-200,-120,'#1D4ED8',-.2],[f.d2,180,-40,'#B91C1C',.15],[f.d3,-120,150,'#047857',.1]];S.forEach(([s,x,y,col,rot],i)=>{const k=prog(t,1+i*.6,1.25+i*.6);if(k<=0)return;const sc=1.6-.6*eback(clamp(k));c.save();c.translate(x,y);c.rotate(rot);c.scale(sc,sc);c.globalAlpha=clamp(k*1.5)*.85;c.strokeStyle=col;c.lineWidth=6;rr(c,-130,-70,260,140,20);c.stroke();c.lineWidth=2;rr(c,-118,-58,236,116,14);c.stroke();c.font=font(900,56,COND);c.fillStyle=col;c.textAlign='center';c.fillText(s||'',0,18);c.font=font(600,18,MONO);c.fillText('2027 · VİZE',0,48);c.restore()});c.restore();c.textAlign='left';
  sigHead(c,t,f,st,300,90,.5);gSmall(c,f.sub,W/2,1340,40,2.8,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1490,3,t,f,'center');logoCorner(c,A,t,3,W-150,170,110)}}
];

SIG['Hırdavat & Yapı Market']=[
{k:'pano',n:'Alet Panosu',dur:7,def:{title:'Usta reyonu yenilendi',sub:'25.000 ürün · aynı gün teslim',cta:'Mağazaya gel'},labels:{title:'Başlık',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Pano',.1,.6],['Aletler',.7,2.6],['Başlık',2.2,3]],
 draw(c,t,f,A,st){const x0=110,y0=480,w=W-220,h=820;c.fillStyle='#D6B98C';c.fillRect(x0,y0,w,h);c.fillStyle='rgba(0,0,0,.15)';for(let y=y0+30;y<y0+h;y+=50)for(let x=x0+30;x<x0+w;x+=50){c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fill()}
  const T=[[x0+160,y0+180,'cekic'],[x0+430,y0+180,'anahtar'],[x0+690,y0+200,'tornavida'],[x0+160,y0+520,'testere'],[x0+460,y0+520,'metre'],[x0+700,y0+560,'pense']];
  T.forEach(([x,y,k_],i)=>{const k=eback(clamp(prog(t,.7+i*.3,1.1+i*.3)));if(k<=0)return;c.save();c.translate(x,y);c.scale(k,k);c.fillStyle='rgba(0,0,0,.18)';
   if(k_==='cekic'){c.fillStyle='#92400E';rr(c,-14,-40,28,240,10);c.fill();c.fillStyle='#374151';rr(c,-90,-80,180,60,12);c.fill()}
   else if(k_==='anahtar'){c.strokeStyle='#9CA3AF';c.lineWidth=28;c.beginPath();c.moveTo(0,-100);c.lineTo(0,160);c.stroke();c.lineWidth=20;c.beginPath();c.arc(0,-130,44,.6,Math.PI*2-.6);c.stroke()}
   else if(k_==='tornavida'){c.fillStyle=f.a;rr(c,-24,-120,48,140,20);c.fill();c.fillStyle='#9CA3AF';c.fillRect(-8,20,16,180)}
   else if(k_==='testere'){c.fillStyle='#D1D5DB';c.beginPath();c.moveTo(-120,0);c.lineTo(120,-30);c.lineTo(120,60);c.lineTo(-120,60);c.closePath();c.fill();c.fillStyle='#DC2626';rr(c,100,-60,90,120,20);c.fill()}
   else if(k_==='metre'){c.fillStyle='#FACC15';rr(c,-80,-80,160,160,30);c.fill();c.fillStyle='#111418';c.beginPath();c.arc(0,0,30,0,Math.PI*2);c.fill()}
   else{c.strokeStyle='#DC2626';c.lineWidth=26;c.beginPath();c.moveTo(-30,120);c.lineTo(0,-20);c.lineTo(30,120);c.stroke();c.fillStyle='#4B5563';c.beginPath();c.moveTo(-14,-20);c.lineTo(0,-130);c.lineTo(14,-20);c.fill()}c.restore()});
  sigHead(c,t,f,st,300,90,2.2);gSmall(c,f.sub,W/2,1420,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'vida',n:'Dönen Vida',dur:7,def:{title:'Akülü matkap seti',d1:'₺ 3.490',sub:'18V · 2 akü · 2 yıl garanti',cta:'Hemen al'},labels:{title:'Başlık',d1:'Fiyat',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Vida',.2,2],['Fiyat',2,2.6],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const cx=W/2,y0=600;const p=eio(prog(t,.2,2));const depth=p*360;c.fillStyle='#A16207';c.fillRect(100,y0+400,W-200,500);c.fillStyle='rgba(0,0,0,.1)';for(let i=0;i<8;i++){c.beginPath();c.ellipse(W/2+((i*97)%400)-200,y0+500+i*50,180,10,0,0,Math.PI*2);c.fill()}
  c.save();c.translate(cx,y0+depth);const g=c.createLinearGradient(-40,0,40,0);g.addColorStop(0,'#6B7280');g.addColorStop(.5,'#E5E7EB');g.addColorStop(1,'#6B7280');c.fillStyle=g;c.beginPath();c.moveTo(-36,0);c.lineTo(36,0);c.lineTo(36,320);c.lineTo(0,400);c.lineTo(-36,320);c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=5;for(let y=20;y<320;y+=30){const o=(t*200)%30;c.beginPath();c.moveTo(-36,y+o-10);c.lineTo(36,y+o+10);c.stroke()}
  c.fillStyle='#9CA3AF';c.beginPath();c.ellipse(0,-10,90,30,0,0,Math.PI*2);c.fill();c.strokeStyle='#4B5563';c.lineWidth=8;c.save();c.rotate(0);c.scale(1,.33);c.rotate(t*12*(p<1?1:0));c.beginPath();c.moveTo(-50,0);c.lineTo(50,0);c.moveTo(0,-50);c.lineTo(0,50);c.stroke();c.restore();c.restore();
  priceTag(c,f.d1,W-240,y0+150,t,2,f,.1);sigHead(c,t,f,st,300,92,.5);gSmall(c,f.sub,W/2,1440,40,2.2,t,'#FFFFFF','center',900,2,700);gPill(c,f.cta,W/2,1590,2.5,t,f,'center');logoCorner(c,A,t,2.5,W-150,170,110)}},
{k:'rulo',n:'Boya Rulosu',dur:7,def:{title:'BOYA HAFTASI',sub:'Tüm iç cephe boyalarında %25',cta:'Rengini seç'},labels:{title:'Kelime',sub:'Açıklama',cta:'Buton'},max:{title:14},
 tracks:[['Zemin',0,7,1],['Rulo',.2,2.2],['Alt yazı',2,2.6]],
 draw(c,t,f,A,st){const word=String(f.title||'').toLocaleUpperCase('tr');const p=eio(prog(t,.2,2.2));const x0=80,y0=640,w=W-160,h=420;c.save();c.beginPath();c.rect(x0,y0,w*p,h);c.clip();c.fillStyle=f.a;c.fillRect(x0,y0,w,h);c.fillStyle='rgba(255,255,255,.08)';for(let i=0;i<30;i++)c.fillRect(x0,y0+i*14,w,4);c.font=font(900,fitFont(c,word,w-80,200,70,900,COND),COND);c.fillStyle=onColor(f.a);c.textAlign='center';c.fillText(word,W/2,y0+h/2+70);c.restore();c.textAlign='left';
  const rx=x0+w*p;c.save();c.translate(rx,y0+h/2);c.fillStyle=mix(f.a,'#FFFFFF',.15);rr(c,-50,-220,100,440,30);c.fill();c.strokeStyle='#9CA3AF';c.lineWidth=12;c.beginPath();c.moveTo(0,220);c.lineTo(0,300);c.lineTo(120,340);c.lineTo(120,560);c.stroke();c.fillStyle='#111418';rr(c,94,560,52,200,16);c.fill();c.restore();
  gSmall(c,f.sub,W/2,1300,44,2,t,fgOf(f.p),'center',900,2,700);gPill(c,f.cta,W/2,1460,2.3,t,f,'center');logoCorner(c,A,t,2.3,W/2,330,150)}}
];

SIG['Kasap & Et Ürünleri']=[
{k:'terazi',n:'Terazi',dur:7,def:{title:'Dana antrikot',d1:'1,250 kg',d2:'₺ 1.612',sub:'Kuru dinlendirilmiş · yerli besi',cta:'Sipariş ver'},labels:{title:'Ürün',d1:'Ağırlık',d2:'Tutar',sub:'Açıklama',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Terazi',.1,.7],['Et',.8,1.4],['Ekran',1.4,2.6]],
 draw(c,t,f,A,st){const cx=W/2,cy=1000;c.save();c.globalAlpha=eo(prog(t,.1,.7));c.fillStyle='#D1D5DB';rr(c,cx-360,cy+60,720,220,30);c.fill();c.fillStyle='#E5E7EB';rr(c,cx-340,cy+20,680,60,20);c.fill();c.fillStyle='#0B0F14';rr(c,cx-260,cy+110,520,130,16);c.fill();
  const k=eio(prog(t,1.4,2.6));const wgt=String(f.d1||'').replace(/[^\d,]/g,'');c.font=font(700,30,MONO);c.fillStyle='#4ADE80';c.fillText('KG',cx-230,cy+150);c.fillText('TL',cx+20,cy+150);c.font=font(900,64,COND);c.fillText(k<1?(Math.random()*0+k*1.25).toFixed(3).replace('.',','):wgt,cx-230,cy+220);c.fillText(k<1?'—':String(f.d2||'').replace('₺','').trim(),cx+20,cy+220);c.restore();
  const drop=eback(clamp(prog(t,.8,1.4)));c.save();c.translate(cx,cy-20-(1-drop)*600);c.fillStyle='#F5F5F4';c.beginPath();c.ellipse(0,0,280,40,0,0,Math.PI*2);c.fill();const g=c.createRadialGradient(-60,-90,10,0,-60,240);g.addColorStop(0,'#E25B5B');g.addColorStop(1,'#8B1E1E');c.fillStyle=g;c.beginPath();c.moveTo(-230,-20);c.bezierCurveTo(-240,-150,-60,-190,60,-170);c.bezierCurveTo(200,-150,250,-80,230,-20);c.closePath();c.fill();
  c.strokeStyle='rgba(255,240,230,.75)';c.lineWidth=7;[[-150,-120,-60,-60],[-40,-150,40,-90],[60,-140,150,-80],[-120,-70,-10,-40]].forEach(([a,b,cc,d])=>{c.beginPath();c.moveTo(a,b);c.quadraticCurveTo((a+cc)/2,b-20,cc,d);c.stroke()});c.fillStyle='#FFF4E6';c.beginPath();c.ellipse(-200,-60,30,46,.3,0,Math.PI*2);c.fill();c.restore();
  sigHead(c,t,f,st,300,92,1.4);gSmall(c,f.sub,W/2,1420,40,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1570,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}},
{k:'sema',n:'Kesim Şeması',dur:8,def:{title:'Hangi parçayı istersin?',d1:'Antrikot',d2:'Kuşbaşı',d3:'Kıymalık',sub:'Kesimi istediğin gibi yapalım',cta:'Ustana sor'},labels:{title:'Başlık',d1:'Parça 1',d2:'Parça 2',d3:'Parça 3',sub:'Not',cta:'Buton'},
 tracks:[['Zemin',0,8,1],['Şema',.1,.8],['Parçalar',1,3.6],['Başlık',.5,1.3]],
 draw(c,t,f,A,st){const fg=fgOf(f.p);const cx=W/2,cy=880;const i=Math.min(2,Math.max(0,Math.floor((t-1)/.9)));c.save();c.translate(cx,cy);c.scale(eo(prog(t,.1,.8)),eo(prog(t,.1,.8)));
  const out=()=>{c.beginPath();c.moveTo(-380,-60);c.quadraticCurveTo(-360,-200,-200,-210);c.lineTo(260,-200);c.quadraticCurveTo(380,-190,400,-80);c.lineTo(420,40);c.quadraticCurveTo(400,120,330,120);c.lineTo(300,300);c.lineTo(250,300);c.lineTo(230,140);c.lineTo(-200,140);c.lineTo(-230,300);c.lineTo(-280,300);c.lineTo(-300,120);c.quadraticCurveTo(-400,80,-380,-60);c.closePath()};
  c.fillStyle=fgA(f.p,.08);c.strokeStyle=fg;c.lineWidth=6;c.beginPath();c.moveTo(-370,-90);c.quadraticCurveTo(-470,-150,-500,-60);c.quadraticCurveTo(-520,40,-450,40);c.quadraticCurveTo(-410,30,-380,0);c.fill();c.stroke();c.beginPath();c.moveTo(-430,-130);c.lineTo(-470,-200);c.moveTo(-400,-120);c.lineTo(-400,-200);c.moveTo(400,-90);c.quadraticCurveTo(470,0,440,160);c.stroke();c.fillStyle=fg;c.beginPath();c.arc(-470,-70,8,0,Math.PI*2);c.fill();out();c.fillStyle=fgA(f.p,.08);c.fill();c.strokeStyle=fg;c.lineWidth=6;c.stroke();const parts=[[-60,-210,180,200],[120,-210,160,340],[-300,-180,240,320]];
  parts.forEach(([x,y,w,h],j)=>{c.save();out();c.clip();const on=j===i&&t>1;c.fillStyle=on?f.a:'transparent';c.globalAlpha=on?.85:1;c.fillRect(x,y,w,h);c.restore();c.strokeStyle=fgA(f.p,.5);c.lineWidth=3;c.setLineDash([10,8]);c.beginPath();c.moveTo(x,y);c.lineTo(x,y+h);c.stroke();c.setLineDash([])});c.restore();
  [f.d1,f.d2,f.d3].forEach((s,j)=>{const x=W/2+(j-1)*300,y=1300;const on=j===i&&t>1;c.save();c.font=font(800,38,BODY);const w=Math.max(220,c.measureText(s||'').width+60);rr(c,x-w/2,y-46,w,92,46);c.fillStyle=on?f.a:fgA(f.p,.08);c.fill();c.fillStyle=on?onColor(f.a):fg;c.textAlign='center';c.fillText(s||'',x,y+13);c.restore()});
  sigHead(c,t,f,st,300,88,.5);gSmall(c,f.sub,W/2,1460,38,3.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1610,3.8,t,f,'center');logoCorner(c,A,t,3.8,W-150,170,110)}},
{k:'mangal',n:'Mangal Ateşi',dur:7,def:{title:'Mangal paketi hazır',d1:'4 kişilik · ₺ 2.790',sub:'Köfte · pirzola · kanat · sucuk',cta:'Paketini al'},labels:{title:'Başlık',d1:'Paket · fiyat',sub:'İçerik',cta:'Buton'},
 tracks:[['Zemin',0,7,1],['Mangal',.1,.7],['Ateş',.6,7],['Etler',1.2,2.4]],
 draw(c,t,f,A,st){const cx=W/2,gy=1040;c.fillStyle='#111418';c.beginPath();c.moveTo(cx-380,gy);c.lineTo(cx+380,gy);c.lineTo(cx+320,gy+200);c.lineTo(cx-320,gy+200);c.closePath();c.fill();c.fillRect(cx-300,gy+200,14,160);c.fillRect(cx+286,gy+200,14,160);
  const fi=clamp(prog(t,.6,1.4));for(let i=0;i<20;i++){const x=cx-330+i*35;const h=(60+Math.abs(Math.sin(t*7+i*1.7))*90)*fi;const g=c.createLinearGradient(0,gy,0,gy-h);g.addColorStop(0,'#F97316');g.addColorStop(.6,'#FBBF24');g.addColorStop(1,'rgba(254,240,138,0)');c.fillStyle=g;c.beginPath();c.moveTo(x-20,gy);c.quadraticCurveTo(x-10,gy-h*.6,x+Math.sin(t*5+i)*8,gy-h);c.quadraticCurveTo(x+10,gy-h*.6,x+20,gy);c.fill()}glow(c,cx,gy-40,500,'rgba(249,115,22,A)',.35*fi);
  c.strokeStyle='#9CA3AF';c.lineWidth=5;for(let x=cx-360;x<=cx+360;x+=40){c.beginPath();c.moveTo(x,gy-70);c.lineTo(x,gy-60);c.stroke()}c.beginPath();c.moveTo(cx-370,gy-70);c.lineTo(cx+370,gy-70);c.stroke();
  [[-240,'kofte'],[-80,'pirzola'],[80,'kofte'],[240,'sucuk']].forEach(([dx,k_],i)=>{const k=eback(clamp(prog(t,1.2+i*.25,1.6+i*.25)));if(k<=0)return;c.save();c.translate(cx+dx,gy-100-(1-k)*500);if(k_==='kofte'){c.fillStyle='#7C2D12';rr(c,-60,-26,120,52,26);c.fill();c.strokeStyle='#1C0A03';c.lineWidth=5;[-30,0,30].forEach(x=>{c.beginPath();c.moveTo(x-8,-20);c.lineTo(x+8,20);c.stroke()})}else if(k_==='pirzola'){c.fillStyle='#9A3412';c.beginPath();c.ellipse(0,0,62,40,.3,0,Math.PI*2);c.fill();c.fillStyle='#FFF4E6';rr(c,40,-8,70,16,8);c.fill()}else{c.fillStyle='#991B1B';rr(c,-70,-20,140,40,20);c.fill()}c.restore()});
  steam(c,cx-100,gy-160,t,clamp(prog(t,2,2.6))*.6,2,240);
  sigHead(c,t,f,st,300,92,.4);gSmall(c,f.d1,W/2,1450,48,2.4,t,f.a,'center',900,1,800);gSmall(c,f.sub,W/2,1520,36,2.6,t,fgA(f.p,.85),'center',900,2,600);gPill(c,f.cta,W/2,1660,2.9,t,f,'center');logoCorner(c,A,t,2.9,W-150,170,110)}}
];

// ---- imza motionları 4 stille ekle (sektör şablonlarından sonra, ayrı grup) ----
(function(){let n=0;const OUT=[];
 Object.entries(SIG).forEach(([secName,list])=>{const si=SECTORS.findIndex(s=>s.n===secName);if(si<0)return;const sec=SECTORS[si];const brandDark=lum(sec.p[0])<.45;
  list.forEach((AR,ai)=>{const gai=60+ai*3;for(let v=0;v<4;v++){let pal,bgk,pair,anim,align,dk,card=false;
   if(v===0){pal=brandDark?['Marka',sec.p[0],sec.p[1]]:DARKP[(si+gai)%DARKP.length];bgk=['mesh','rings','dots'][(ai+si)%3];pair=0;anim='mask';align='center';dk=1}
   else if(v===1){pal=LIGHTP[(si*3+gai)%LIGHTP.length];bgk=['solid','dots','grid'][(ai+si)%3];pair=3;anim='slide';align='center';dk=4}
   else if(v===2){pal=VIVIDP[(si*5+gai*3)%VIVIDP.length];bgk=['solid','rings','split'][(ai+si)%3];pair=1;anim='scale';align='center';dk=-1}
   else{let k=(si*7+gai*5+3)%DARKP.length;pal=DARKP[k];bgk='mesh';pair=2;anim='blur';align='center';dk=-1;card=true}
   const st={bg:bgk,anim,pair,align,deco:dk,card};const fields={...AR.def,p:pal[1],a:pal[2]};['title','sub','d1','d2','d3','cta'].forEach(k=>{if(fields[k]==null)fields[k]=''});n++;
   OUT.push({id:'s'+String(n).padStart(4,'0'),name:`${AR.n} · ${STN[v]}`,style:STN[v],cat:AR.n,sector:sec.n,grp:sec.n+'|imza|'+AR.k,imza:true,dur:AR.dur,isNew:true,def:fields,labels:AR.labels,max:AR.max,tracks:AR.tracks,st,
    draw(c,t,f,A){const S=this.st;const inner=()=>{gBg(c,t,f,A,S.bg,this.dur,false);if(S.deco===4)deco4(c,t,f);else if(S.deco>0)deco(c,t,f,S.deco);AR.draw.call(this,c,t,f,A,S);c.shadowColor='transparent';c.shadowBlur=0;c.textAlign='left';c.globalAlpha=1};
     if(S.card)cardWrap(c,t,f,inner);else inner()}})}})});
 TEMPLATES.push(...OUT)})();

// [imza-son]
function watermark(c){c.save();c.globalAlpha=.2;c.fillStyle='#fff';c.font=font(700,64);c.translate(W/2,H/2);c.rotate(-Math.PI/5);c.textAlign='center';for(let y=-1400;y<=1400;y+=300)c.fillText('ZODMOTIONS · ÖNİZLEME',(y/300%2)*200,y);c.restore();
  c.save();rr(c,W-330,40,290,70,35);c.fillStyle='rgba(0,0,0,.5)';c.fill();c.fillStyle='#fff';c.font=font(700,30,BODY);c.textBaseline='middle';c.fillText('ZodMotions ile yapıldı',W-306,77);c.restore()}
function renderFrame(c,tpl,t,f,A,wm){c.save();c.setTransform(c.canvas.width/W,0,0,c.canvas.height/H,0,0);c.globalAlpha=1;c.textAlign='left';c.textBaseline='alphabetic';setLS(c,0);c.lineCap='butt';
  tpl.draw(c,t,f,A);const out=prog(t,tpl.dur-.5,tpl.dur);if(out>0){c.globalAlpha=out;c.fillStyle='#000';c.fillRect(0,0,W,H);c.globalAlpha=1}if(wm)watermark(c);c.restore()}
const NOIMG={photo:null,logo:null};
// --- ZodMotions tanıtım filmi (birkaç motiondan montaj) ---
function nightBg(c,t){const g=c.createRadialGradient(W/2,H*.62,40,W/2,H*.62,1300);g.addColorStop(0,'#3A1830');g.addColorStop(.55,'#120E1C');g.addColorStop(1,'#07080B');c.fillStyle=g;c.fillRect(0,0,W,H);
  for(let i=0;i<140;i++){const x=((i*9301+49297)%233280)/233280*W,y=((i*4993+7919)%233280)/233280*H*.9,r=((i*37)%10)/10*2.6+.8;c.globalAlpha=.25+.45*(Math.sin(t*2+i)+1)/2;c.fillStyle='#fff';c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}c.globalAlpha=1}
function sunGrad(c,x0,x1){const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#FFB547');g.addColorStop(1,'#FF5C7A');return g}
function introDraw(c,t){nightBg(c,t);
  const sy=H*.66+(1-eo(prog(t,0,1.6)))*360;c.globalAlpha=eo(prog(t,0,1));c.fillStyle=sunGrad(c,W/2-280,W/2+280);c.beginPath();c.arc(W/2,sy,280,0,Math.PI*2);c.fill();
  c.fillStyle='#07080B';c.fillRect(0,H*.66+40,W,H);c.fillStyle='rgba(255,181,71,.5)';c.fillRect(0,H*.66+40,W*eo(prog(t,.6,1.6)),4);c.globalAlpha=1;
  const word='ZODMOTIONS';c.font=font(900,210,COND);c.textBaseline='alphabetic';const tw=c.measureText(word).width;let x=(W-tw)/2;
  [...word].forEach((ch,i)=>{const p=eo(prog(t,.3+i*.06,.85+i*.06));c.globalAlpha=p;c.fillStyle='#F3F0E8';c.fillText(ch,x,H*.38+(1-p)*80);x+=c.measureText(ch).width});c.globalAlpha=1;
  c.textAlign='center';c.font=font(700,62,BODY);c.globalAlpha=eo(prog(t,1.2,1.8));c.fillStyle='#F3F0E8';c.fillText('Markan için hareket.',W/2,H*.38+120);
  c.font=font(500,32,MONO);c.fillStyle='#FFB547';c.globalAlpha=eo(prog(t,1.7,2.3));c.fillText('REELS · TIKTOK · SHORTS',W/2,H-190);c.globalAlpha=1;c.textAlign='left'}
function outroDraw(c,t){nightBg(c,t+3);const cy=H*.34;const s=clamp(eback(prog(t,.1,.7)),0,1.2);
  if(s>0){c.save();c.translate(W/2,cy);c.scale(s,s);rr(c,-140,-140,280,280,70);c.fillStyle=sunGrad(c,-140,140);c.fill();c.fillStyle='#160A06';c.font=font(900,230,COND);c.textAlign='center';c.textBaseline='middle';c.fillText('Z',0,12);c.restore()}
  c.textAlign='center';c.textBaseline='alphabetic';c.font=font(900,170,COND);c.fillStyle='#F3F0E8';c.globalAlpha=eo(prog(t,.5,1.1));c.fillText('ZODMOTIONS',W/2,cy+330);
  c.font=font(600,50,BODY);c.globalAlpha=eo(prog(t,.8,1.4));c.fillStyle='rgba(243,240,232,.8)';c.fillText('Şablonu seç, markanı ekle, paylaş.',W/2,cy+420);
  const e=eo(prog(t,1.2,1.8));const pulse=t>1.8?1+.025*Math.sin(t*5):1;c.font=font(700,50,BODY);const bw=c.measureText('Ücretsiz dene').width+120;
  c.save();c.globalAlpha=e;c.translate(W/2,cy+590);c.scale(pulse,pulse);rr(c,-bw/2,-62,bw,124,62);c.fillStyle=sunGrad(c,-bw/2,bw/2);c.fill();c.fillStyle='#160A06';c.textBaseline='middle';c.fillText('Ücretsiz dene',0,3);c.restore();
  c.globalAlpha=eo(prog(t,1.6,2.2));c.font=font(500,36,MONO);c.fillStyle='#FFB547';c.fillText('info@zodiacwebdesign.com',W/2,H-250);c.font=font(600,36,BODY);c.fillStyle='rgba(243,240,232,.65)';c.fillText('Zodiac Web Design · Mert Yardımcı',W/2,H-190);c.globalAlpha=1;c.textAlign='left'}
const PSEG=[
 {len:3.6,draw:introDraw},
 {tpl:'villa',from:.2,len:4.6},
 {tpl:'oncesonra',from:.9,len:4.4,f:{title:'Şablonu markana uyarla',sub:'Renk · logo · fotoğraf',d1:'ŞABLON',d2:'SENİN MARKAN'}},
 {tpl:'plan',from:.2,len:4.4},
 {tpl:'rakam',from:0,len:4.4,f:{title:'Rakamlarla ZodMotions',sub:'DİKEY VİDEO',d1:'99+ hazır motion',d2:'6 sektör kategorisi',d3:'30 kare / saniye',cta:'Zodiac Web Design',p:'#2A1630',a:'#FFB547'}},
 {len:4.4,draw:outroDraw}];
PSEG.forEach(sg=>{if(sg.tpl){sg.T=TEMPLATES.find(t=>t.id===sg.tpl);sg.F={...sg.T.def,...(sg.f||{})}}});
function drawSeg(c,sg,lt){if(sg.draw)sg.draw(c,lt);else sg.T.draw(c,sg.from+lt,sg.F,NOIMG);c.globalAlpha=1;c.textAlign='left';c.textBaseline='alphabetic';setLS(c,0);c.lineCap='butt';c.setLineDash([]);if('filter' in c)c.filter='none'}
const PROMO={id:'promo',name:'Tanıtım filmi',cat:'ZodMotions',dur:PSEG.reduce((a,s)=>a+s.len,0),
 draw(c,t){let st=0,i=0;while(i<PSEG.length-1&&t>=st+PSEG[i].len){st+=PSEG[i].len;i++}const lt=t-st,TR=.5;
  if(i>0&&lt<TR){drawSeg(c,PSEG[i-1],PSEG[i-1].len);const r=eio(lt/TR)*1150;c.save();c.beginPath();c.arc(W/2,H/2,Math.max(1,r),0,Math.PI*2);c.clip();drawSeg(c,PSEG[i],lt);c.restore();
    c.strokeStyle=sunGrad(c,W/2-r,W/2+r);c.lineWidth=14;c.beginPath();c.arc(W/2,H/2,Math.max(1,r),0,Math.PI*2);c.stroke()}
  else drawSeg(c,PSEG[i],lt)}};
const MOT=[["Y22","Neon parıltı","pro",3.0],["M25","Holografik panel","pro",3.2],["A13","Piksel dolgu","yeni",3.4],["A15","Kurdele yazı","yeni",3.4],["A16","Şehir silueti","yeni",3.4],["A20","Holografik bina","pro",3.4],["A21","Patlatılmış katlar","pro",3.4],["A23","Yırtık kağıt şerit","pro",3.4],["G19","Işık sızıntısı","pro",3.2],["S10","Işık izi logo","pro",3.2]].map(([k,ad,set,d])=>({k,ad,set,d}));
const MCAT={Y:'Yazı',M:'Madde',A:'Ara sahne',G:'Geçiş',S:'Son kart',K:'Künye'};
const FEAT=['A20','A16','A21','A13','A15','A23','M25','G19','Y22','S10'];
const secOf=t=>t.sector||({Emlak:'Emlak & İnşaat','İnşaat':'Emlak & İnşaat',Mimari:'Emlak & İnşaat'})[t.cat]||'Genel';
window.ZM={W,H,TEMPLATES,SECTORS,renderFrame,PROMO,NOIMG,MOT,MCAT,FEAT,secOf,clamp,prog,eo};
})();
