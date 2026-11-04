/* ZodMotions ortak site katmanı: üst menü, alt bilgi, canlı küçük önizlemeler, modal pencereler, kota */
// Uygulama içinde (ZodMotions masaüstü / /app/) açıldıysa site menüsünü ve alt bilgiyi gizle
(()=>{try{if(window.self!==window.top&&window.top.location.pathname.startsWith('/app')){document.documentElement.classList.add('in-app');const st=document.createElement('style');st.textContent='html.in-app #zh,html.in-app #zf,html.in-app .tc-ruler,html.in-app #ruler{display:none!important}html.in-app{--bg:#111113;--s1:#1c1c1f;--s2:#232327;--s3:#2c2c31;--line:#2A2A2F;--line2:#3A3A41;--fg:#ECECEF;--mute:#8E8E96;--acc:#4BA3FF;--acc-hi:#6DB6FF;--acc-soft:rgba(75,163,255,.14);--f-body:Inter,system-ui,sans-serif}html.in-app body{padding-top:0!important;font-size:14.5px;background:var(--bg)}html.in-app main h1{font-size:clamp(28px,3.2vw,40px)!important;line-height:1!important;letter-spacing:0!important}html.in-app main{padding-top:14px}html.in-app .big-n,html.in-app .eyebrow{display:none!important}html.in-app .page-h{margin-bottom:8px}';document.head.appendChild(st);const tl=document.createElement('link');tl.rel='stylesheet';tl.href='/theme/theme.css';document.head.appendChild(tl);const ts=document.createElement('script');ts.src='/theme/theme.js';document.head.appendChild(ts)}}catch(e){}})();
(()=>{
const Z=window.ZM;
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hoverCap=matchMedia('(hover: hover)').matches;
const MAIL='info@zodiacwebdesign.com';
const INSTA='https://www.instagram.com/zodiacmedya/';
const norm=t=>String(t).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
const slug=n=>norm(n).replace(/&/g,' ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const get=(k,d)=>{try{const v=localStorage.getItem('zm_'+k);return v==null?d:JSON.parse(v)}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem('zm_'+k,JSON.stringify(v))}catch(e){}};
const sget=(k)=>{try{return sessionStorage.getItem('zm_'+k)}catch(e){return null}};
const sset=(k,v)=>{try{sessionStorage.setItem('zm_'+k,v)}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

const PAGES=[['ai','ai-studyo.html','AI Stüdyo'],['sablonlar','sablonlar.html','Şablonlar'],['sektorler','sektorler.html','Sektörler'],['editor','editor.html','Editör'],['fiyatlar','fiyatlar.html','Fiyatlar'],['hakkimizda','hakkimizda.html','Hakkımızda']];
const LOGO=`<img class="zlogo" src="logo-z.png" width="40" height="40" alt="" decoding="async">`;
const PLAY='<svg viewBox="0 0 14 14" fill="#fff" aria-hidden="true"><path d="M3 1.5v11l9-5.5z"/></svg>';

const IG='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>';
const TAG='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.5"/></svg>';
const TABS=[['home','./','Ana sayfa','<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'],['sablonlar','sablonlar.html','Şablonlar','<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'],['ai','ai-studyo.html','Oluştur',''],['sektorler','sektorler.html','Sektörler','<path d="M3 21h18M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/>'],['editor','editor.html','Editör','<path d="M4 20h4L19 9l-4-4L4 16z"/>']];
function header(){const h=$('zh');if(!h)return;const page=document.body.dataset.page||'home';
  h.className='top';h.setAttribute('lang','tr');
  h.innerHTML=`<div class="wrap nav"><a class="brand" href="./" aria-label="ZodMotions ana sayfa">${LOGO}</a>
  <nav id="mainNav" aria-label="Ana menü">${PAGES.map(([k,u,n])=>`<a class="l" href="${u}"${k===page?' aria-current="page"':''}>${n}${k==='ai'?'<span class="nb">Yeni</span>':''}</a>`).join('')}</nav>
  <div class="hdr-r"><a class="ig" href="${INSTA}" target="_blank" rel="noopener" aria-label="Instagram @zodiacmedya">${IG}</a><a class="pp" href="fiyatlar.html">${TAG}<span>Fiyatlar</span><i>Deneme ₺299</i></a><a class="lgn" id="lgnLink" href="giris.html">Giriş</a><a class="btn pri sm" id="authBtn" href="giris.html?mode=kayit">Kayıt ol</a></div></div>`;
  if(window.ZMA)ZMA.onChange(u=>{const b=$('authBtn'),l=$('lgnLink');if(!b)return;if(u){b.outerHTML=`<a class="avt" id="authBtn" href="hesap.html" aria-label="Hesabım: ${esc(u.profile.ad||u.email)}" title="Hesabım">${esc(ZMA.initials(u))}</a>`;if(l)l.hidden=true}});
  const tb=document.createElement('nav');tb.className='tabbar';tb.setAttribute('aria-label','Alt menü');tb.setAttribute('lang','tr');
  tb.innerHTML=TABS.map(([k,u,n,ic])=>k==='ai'?`<a class="mid" href="${u}" aria-label="${n}"${k===page?' aria-current="page"':''}><svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 2.5l2.2 6.3 6.3 2.2-6.3 2.2L12 19.5l-2.2-6.3-6.3-2.2 6.3-2.2z" fill="currentColor"/></svg></a>`:`<a href="${u}"${k===page?' aria-current="page"':''}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round">${ic}</svg><span>${n}</span></a>`).join('');
  document.body.appendChild(tb)}

function footer(){const f=$('zf');if(!f)return;f.className='foot wrap';f.setAttribute('lang','tr');
  const secs=Z.SECTORS.slice(0,9).map(s=>`<li><a href="sablonlar.html#${slug(s.n)}">${esc(s.n)}</a></li>`).join('')+`<li><a href="sektorler.html">Tüm ${Z.SECTORS.length} sektör →</a></li>`;
  f.innerHTML=`<div class="big" lang="en" aria-hidden="true">ZodMotions</div>
  <div class="cols">
    <div style="display:grid;gap:14px;align-content:start;max-width:340px"><p style="color:var(--mute)">İşletmeler için AI reklam stüdyosu: yapay zekâ ile video üret, 99+ ZodClip motionı ve hazır şablonlarla bitmiş reklama dönüştür. 6 yıldır sosyal medya videosu üreten Zodiac Web Design'ın bir ürünüdür.</p>
      <div class="mono" style="color:var(--fg);user-select:all">${MAIL}</div>
      <a class="link" href="${INSTA}" target="_blank" rel="noopener">Instagram · @zodiacmedya ↗</a>
      <a class="link" href="https://www.google.com/maps/search/?api=1&amp;query=Zodiac+Web+Design" target="_blank" rel="noopener">Google Haritalar'da gör ↗</a></div>
    <div><h4>Sayfalar</h4><ul><li><a href="./">Ana sayfa</a></li>${PAGES.map(([k,u,n])=>`<li><a href="${u}">${n}</a></li>`).join('')}</ul></div>
    <div><h4>Sektörler</h4><ul style="grid-template-columns:1fr">${secs}</ul></div>
    <div><h4>Yasal</h4><ul><li><button data-doc="kvkk">KVKK Aydınlatma Metni</button></li><li><button data-doc="mss">Mesafeli Satış Sözleşmesi</button></li><li><button data-doc="cerez">Çerez Politikası</button></li><li><button data-doc="kosul">Kullanım Koşulları</button></li></ul></div>
  </div>
  <div class="base"><span>© 2026 ZodMotions · Zodiac Web Design · Mert Yardımcı</span><span>Prototip: şablon editörü çalışır; AI üretimi, üyelik ve ödeme yayın öncesinde bağlanacak. AI videolar MiniMax H3 ve Kling modelleriyle üretilir.</span></div>`;
  f.querySelectorAll('[data-doc]').forEach(b=>b.onclick=()=>openDoc(b.dataset.doc))}

/* --- yasal metinler --- */
const DOCS={kvkk:['KVKK Aydınlatma Metni',['Veri sorumlusu: Mert Yardımcı (Zodiac Web Design), info@zodiacwebdesign.com.','İşlenen veriler: ad, e-posta, fatura bilgisi, yüklenen görseller ve kullanım kayıtları.','Amaç: üyeliğin yürütülmesi, faturalandırma, destek ve hizmetin iyileştirilmesi.','Yüklediğin görseller yalnızca senin videonu oluşturmak için kullanılır ve üçüncü kişilerle paylaşılmaz.','Haklarını kullanmak için info@zodiacwebdesign.com adresine yazabilirsin.']],
 mss:['Mesafeli Satış Sözleşmesi',['Satıcı: Mert Yardımcı (Zodiac Web Design).','Hizmet: aylık veya yıllık dijital şablon aboneliği.','Ödeme: kartla, dönem başında; KDV dahil.','Cayma hakkı: dijital hizmetin anında ifasına onay verildiğinde 14 günlük cayma hakkı kullanılamaz; kullanılmamış dönemler için iade talebini değerlendiririz.','İptal: istediğin an; erişimin dönem sonuna kadar sürer.']],
 cerez:['Çerez Politikası',['Zorunlu çerezler: oturum ve güvenlik.','Analiz ve pazarlama çerezleri yalnızca onay verirsen çalışır.','Tercihlerini her zaman değiştirebilirsin.']],
 kosul:['Kullanım Koşulları',['Şablonların tasarım hakları ZodMotions\'a aittir.','Şablonlar yeniden satılamaz veya başka bir şablon sitesinde dağıtılamaz.','Yüklediğin görsellerin kullanım hakkı sende olmalıdır.','Ücretli planlarda üretilen videolar ticari olarak kullanılabilir.','AI stüdyosu 18 yaş ve üzeri kullanıcılara açıktır.','Gerçek kişilerin izinsiz görüntüsü veya sesiyle video üretmek, çıplaklık, şiddet ve yanıltıcı içerik yasaktır; bu tür üretimler engellenir ve hesap kapatılabilir.','AI videolar MiniMax H3 ve diğer üçüncü taraf modellerle üretilir; bu modellerin kullanım kuralları da geçerlidir.']]};
function dialog(id,html){let d=$(id);if(!d){d=document.createElement('dialog');d.id=id;document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d)close(d)})}d.innerHTML=html;try{d.showModal()}catch(e){d.setAttribute('open','')}return d}
function close(d){d.querySelectorAll('video').forEach(v=>v.pause());try{d.close()}catch(e){d.removeAttribute('open')}}
function openDoc(k){const[t,items]=DOCS[k];const d=dialog('docDlg',`<div class="dlg" lang="tr"><h3 style="font-size:24px">${t}</h3><p class="mono" style="color:var(--acc-hi)">Taslak · yayından önce avukat onayıyla kesinleşecek</p><ul style="color:var(--mute);display:grid;gap:8px;padding-left:20px;margin:0">${items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul><div style="text-align:right"><button class="btn" data-x>Kapat</button></div></div>`);d.querySelector('[data-x]').onclick=()=>close(d)}

/* --- gerçek ZodClip motionları --- */
const SETN={ilk:'Temel',yeni:'Yeni',pro:'Pro'};
function openMotion(m){const d=dialog('motDlg',`<div class="mdlg" lang="tr"><div class="mv"><video src="m/${m.k}.mp4" poster="m/${m.k}.jpg" muted loop playsinline autoplay controls></video></div>
  <div class="mi"><span class="eyebrow">${Z.MCAT[m.k[0]]} · ZodClip</span><h3 style="font-family:var(--f-disp);font-weight:800;font-size:34px;text-transform:uppercase;line-height:1">${esc(m.ad)}</h3>
  <div class="kv"><div><span>Kod</span><b>${m.k}</b></div><div><span>Süre</span><b>${m.d} sn</b></div><div><span>Set</span><b>${SETN[m.set]}</b></div><div><span>Format</span><b>1080 × 1920 · 30 fps</b></div></div>
  <p class="msg">Bu motion ajans hizmetimizle markana uyarlanır. Kodu bize yaz, videonu hazırlayalım.</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn pri" data-use href="hakkimizda.html#iletisim">Bu motionla video iste</a><button class="btn" data-copy>Kodu kopyala</button><button class="btn" data-x>Kapat</button></div></div></div>`);
  const v=d.querySelector('video');const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{});
  d.querySelector('[data-x]').onclick=()=>close(d);
  d.querySelector('[data-use]').onclick=()=>sset('msg',`Merhaba, ${m.k} (${m.ad}) motionuyla firmama video istiyorum.`);
  const cb=d.querySelector('[data-copy]');cb.onclick=()=>copy(m.k,()=>cb.textContent='Kopyalandı: '+m.k,()=>cb.textContent=m.k)}
const vPlay=v=>{if(!v.src)v.src=v.dataset.src;const p=v.play();if(p&&p.catch)p.catch(()=>{});v.classList.add('on')};
const vStop=v=>{if(!v.src)return;v.pause();v.classList.remove('on')};
const vio='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{const v=e.target.querySelector('video');if(!v)return;if(e.isIntersecting&&e.intersectionRatio>.5&&!reduce&&e.target.dataset.auto)vPlay(v);else vStop(v)}),{threshold:[0,.5]}):null;
let MCN=0;
function motionCard(m,auto){auto=(auto||!hoverCap)&&(MCN++)%2===0;const b=document.createElement('button');b.type='button';b.className='tc-card';b.setAttribute('aria-label',`${m.ad} motionunu büyüt`);if(auto)b.dataset.auto='1';
  b.innerHTML=`<div class="fr"><img src="m/${m.k}.jpg" alt="" loading="lazy"><video muted loop playsinline preload="none" data-src="m/${m.k}.mp4"></video><span class="badge dark">${m.k}</span>${m.set==='pro'?'<span class="badge r">PRO</span>':''}</div><div class="meta"><b>${esc(m.ad)}</b><span>${m.d.toFixed(1)} sn</span></div><div class="sub">${Z.MCAT[m.k[0]]} · ZodClip</div>`;
  const v=b.querySelector('video');if(!reduce&&!auto){b.onmouseenter=()=>vPlay(v);b.onmouseleave=()=>{vStop(v);v.currentTime=0}}
  b.onclick=()=>openMotion(m);if(vio)vio.observe(b);return b}

/* --- şablon grupları: aynı sektör + aynı reklam türü = tek şablon, farklı stilleri --- */
const GK=t=>t.grp||(t.sector?t.sector+'|'+t.cat:t.id);
const GROUPS=[];const GMAP={};Z.TEMPLATES.forEach(t=>{const k=GK(t);if(!GMAP[k]){GMAP[k]=[];GROUPS.push(GMAP[k])}GMAP[k].push(t)});
const groupOf=t=>GMAP[GK(t)];
/* --- canlı şablon önizlemeleri --- */
const TH=[];const vis=new Set();const FR=[];
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target)),{rootMargin:'80px'}):null;
function thumb(cv,tpl,o={}){const th={cv,ctx:cv.getContext('2d'),tpl,f:o.f||tpl.def,A:o.A||sampleFor(tpl),t:o.t!=null?o.t:tpl.dur*.55,hover:false,still:o.still!=null?!!o.still:(TH.length%2===1)};TH.push(th);if(io)io.observe(cv);else vis.add(cv);
  draw(th);return th}
function draw(th){try{Z.renderFrame(th.ctx,th.tpl,th.t,th.f,th.A,false)}catch(e){}}
function tplCard(tpl,o={}){const V=o.variants||[tpl];let cur=tpl;const a=document.createElement('a');a.className='tc-card';a.href='editor.html#'+tpl.id;a.setAttribute('aria-label',tpl.cat+' şablonunu editörde aç');
  a.innerHTML=`<div class="fr"><canvas width="270" height="480"></canvas>${tpl.imza?'<span class="badge imza">İMZA</span>':tpl.isNew?'<span class="badge">YENİ</span>':''}<span class="open-ed">Editörde aç →</span></div><div class="meta"><b>${esc(o.title||tpl.cat)}</b><span>${tpl.dur} sn</span></div><div class="sub">${o.sub===false?'':esc(o.sub||Z.secOf(tpl))}${V.length>1?`<span class="sty" role="group" aria-label="Stil seç">${V.map((v,i)=>`<button type="button" data-i="${i}" aria-label="Stil: ${esc(v.style||String(i+1))}" title="${esc(v.style||"")}" aria-pressed="${v===tpl}" style="--c1:${v.def.p};--c2:${v.def.a}"></button>`).join('')}</span>`:''}</div>`;
  a.onclick=e=>{if(e.target.closest('.sty'))return;sset('tpl',cur.id)};
  const th=thumb(a.querySelector('canvas'),tpl);a.onmouseenter=()=>th.hover=true;a.onmouseleave=()=>th.hover=false;
  a.querySelectorAll('.sty button').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();cur=V[+b.dataset.i];th.tpl=cur;th.f=cur.def;th.A=sampleFor(cur);th.t=cur.dur*.55;draw(th);a.href='editor.html#'+cur.id;a.querySelectorAll('.sty button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
  return a}
function onFrame(cb){FR.push(cb)}
let last=0,acc=0;
function loop(now){const dt=last?Math.min(.1,(now-last)/1000):0;last=now;
  FR.forEach(cb=>cb(dt));
  if(!reduce){acc+=dt;if(acc>1/15){for(let i=TH.length-1;i>=0;i--){const th=TH[i];if(!th.cv.isConnected){if(io)io.unobserve(th.cv);vis.delete(th.cv);TH.splice(i,1);continue}
      if(th.still&&!th.hover)continue;if(vis.has(th.cv)||th.hover){th.t=(th.t+acc)%th.tpl.dur;draw(th)}}acc=0}}
  requestAnimationFrame(loop)}

/* --- örnek ürün fotoğrafı: şablon önizlemelerinde boş "fotoğraf" kutusu yerine keskin, sade bir stüdyo görseli --- */
const PAL=[['#2b1a12','#c7864a','#f3d2a2'],['#2a1420','#c4587e','#f6c6d6'],['#101b2b','#3f7fd0','#bcd8ff'],['#12221b','#3f9b73','#c9ecd9'],['#221d10','#c9a33e','#f4e3a6'],['#1c1630','#7a5ad6','#d8ccff']];
const SAMPLES={};
function sampleFor(tpl){const key=tpl&&tpl.sector?[...tpl.sector].reduce((h,c)=>h+c.charCodeAt(0),0)%PAL.length:0;
  if(SAMPLES[key])return SAMPLES[key];const [d,m,l]=PAL[key];const cv=document.createElement('canvas');cv.width=1080;cv.height=1350;const c=cv.getContext('2d');
  let g=c.createLinearGradient(0,0,0,1350);g.addColorStop(0,m);g.addColorStop(1,d);c.fillStyle=g;c.fillRect(0,0,1080,1350);
  g=c.createRadialGradient(760,300,40,760,300,700);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,1080,1350);
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(540,1040,330,60,0,0,Math.PI*2);c.fill();
  g=c.createLinearGradient(300,500,780,1000);g.addColorStop(0,l);g.addColorStop(.55,m);g.addColorStop(1,d);c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(330,420,420,600,60):c.rect(330,420,420,600);c.fill();
  g=c.createLinearGradient(330,0,750,0);g.addColorStop(0,'rgba(255,255,255,.0)');g.addColorStop(.2,'rgba(255,255,255,.35)');g.addColorStop(.32,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(330,420,420,600,60):c.rect(330,420,420,600);c.fill();
  c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.roundRect?c.roundRect(420,560,240,34,17):c.rect(420,560,240,34);c.fill();c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.roundRect?c.roundRect(420,616,160,22,11):c.rect(420,616,160,22);c.fill();
  return SAMPLES[key]={photo:cv,logo:null}}

/* --- yardımcılar --- */
function copy(txt,ok,fail){try{navigator.clipboard.writeText(txt).then(ok,fail)}catch(e){fail()}}
function toast(t){const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
let readyP=null;
function ready(cb){if(!readyP){const fl=document.fonts&&document.fonts.load?Promise.all(['700 80px Unbounded','600 40px Manrope','700 40px Manrope','900 100px "Big Shoulders Display"','500 30px "JetBrains Mono"','italic 500 80px "Playfair Display"','800 40px Anybody'].map(f=>document.fonts.load(f))).catch(()=>{}):Promise.resolve();
  readyP=Promise.race([fl,new Promise(r=>setTimeout(r,1500))]);if(document.fonts)document.fonts.ready.then(()=>TH.forEach(draw))}
  readyP.then(cb)}

(()=>{try{const l=document.createElement('link');l.rel='icon';l.type='image/png';l.href='favicon.png';document.head.appendChild(l)}catch(e){}})();
header();footer();requestAnimationFrame(loop);
window.ZMS={sampleFor,$,reduce,hoverCap,MAIL,INSTA,GROUPS,groupOf,norm,slug,get,set,sget,sset,esc,thumb,tplCard,motionCard,openMotion,openDoc,onFrame,copy,toast,ready,draw};
})();
