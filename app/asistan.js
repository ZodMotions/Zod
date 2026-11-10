/* ZodMotions Asistan — sağ altta açılan yapay zekâ yardımcısı.
   Mesajlar Supabase "asistan" fonksiyonuna gider; cevaptaki [[...]] satırları tıklanabilir butona dönüşür. */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const KEY='zod-asistan';
const SECS=['Restoran & Kafe','Güzellik & Kuaför','Moda & E-ticaret','Spor & Fitness','Eğitim & Kurs','Otomotiv','Sağlık & Klinik','Teknoloji & Uygulama','Etkinlik & Düğün','Turizm & Otel','Emlak & İnşaat','Ajans & Kurumsal'];
const norm=t=>String(t).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
const slug=n=>norm(n).replace(/&/g,' ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const ONERI={
  home:['Kafem için 15 saniyelik Reels fikri ver','ZodMotions ile ilk reklamımı nasıl yaparım?','Hangi paket bana uygun?','Videoma otomatik altyazı nasıl eklerim?'],
  clip:['Sessiz yerleri nasıl keserim?','Altyazıyı nasıl düzenlerim?','Videoya motion nasıl eklerim?','Filigransız nasıl indiririm?'],
  motion:['Emlak için hangi şablonu seçeyim?','İndirim duyurusu için metin yaz','Şablonda renkleri nasıl değiştiririm?','Restoran için şablon öner'],
  ai:['Burger fotoğrafım için sahne yaz','Hangi model daha iyi, kaç kredi gider?','Fotoğrafım nasıl olmalı?','Kuaför salonu için AI reklam fikri'],
  hesap:['Kredim nasıl yüklenir?','Paketler arasındaki fark ne?','Paket nasıl satın alınır?','Faturamı nasıl alırım?']
};
let hist=[];try{hist=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){hist=[]}
if(!Array.isArray(hist))hist=[];
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(hist.slice(-30)))}catch(e){}};
let busy=false,kalan=null;

/* ---------- arayüz ---------- */
const fab=document.createElement('button');fab.className='zas-fab';fab.type='button';fab.title='Zod asistan';fab.setAttribute('aria-label','Asistanı aç');
fab.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="currentColor"/></svg><span>Asistan</span>';
const box=document.createElement('section');box.className='zas';box.hidden=true;box.setAttribute('aria-label','Zod asistan');
box.innerHTML=`<header><span class="zas-av" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" fill="currentColor"/></svg></span>
  <div class="zas-t"><b>Zod</b><small id="zas-sub">Yapay zekâ asistanın</small></div>
  <button type="button" class="zas-ib" id="zas-new" title="Yeni sohbet" aria-label="Yeni sohbet"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg></button>
  <button type="button" class="zas-ib" id="zas-x" title="Kapat" aria-label="Kapat"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg></button></header>
 <div class="zas-log" id="zas-log" aria-live="polite"></div>
 <form class="zas-in" id="zas-f"><textarea id="zas-q" rows="1" maxlength="1500" placeholder="Bir şey sor ya da iste… (örn. kafem için Reels metni yaz)" aria-label="Mesajın"></textarea>
  <button type="submit" id="zas-send" aria-label="Gönder"><svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2-7z" fill="currentColor"/></svg></button></form>
 <p class="zas-note">Zod hata yapabilir; önemli bilgileri kontrol et.</p>`;
document.body.append(fab,box);
const log=$('#zas-log',box),q=$('#zas-q',box);

function ekran(){const h=(location.hash||'#home').slice(1);return h in ONERI?h:'home'}
function auth(){try{const r=window.ZAPP&&ZAPP.auth&&ZAPP.auth();if(r)return r}catch(e){}try{if(window.ZMA&&ZMA.user())return{u:ZMA.user(),z:ZMA}}catch(e){}return null}

/* sade markdown: kalın, italik, kod, listeler, satır sonları */
function md(t){
  const inl=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g,'$1<i>$2</i>').replace(/`([^`]+)`/g,'<code>$1</code>');
  const out=[];let list=null;
  for(const raw of String(t).split('\n')){const l=raw.trimEnd();
    let m;
    if((m=l.match(/^\s*[-*•]\s+(.*)/))){if(list!=='ul'){if(list)out.push(`</${list}>`);out.push('<ul>');list='ul'}out.push(`<li>${inl(m[1])}</li>`);continue}
    if((m=l.match(/^\s*\d+[.)]\s+(.*)/))){if(list!=='ol'){if(list)out.push(`</${list}>`);out.push('<ol>');list='ol'}out.push(`<li>${inl(m[1])}</li>`);continue}
    if(list){out.push(`</${list}>`);list=null}
    if(!l.trim()){out.push('<br>');continue}
    out.push(`<p>${inl(l.replace(/^#+\s*/,''))}</p>`)}
  if(list)out.push(`</${list}>`);
  return out.join('').replace(/(<br>)+/g,'')}

/* cevaptaki [[eylem]] satırlarını ayıkla */
const AD={home:'Ana sayfayı aç',clip:"ZodClip'i aç",motion:"Motionlar'ı aç",ai:"AI Stüdyo'yu aç",hesap:'Hesabımı aç',fiyatlar:'Paketleri gör'};
const ARAC={altyazi:'Otomatik altyazıyı aç',klip:'Klip çıkarmayı aç',medya:'Sessizlik kesmeyi aç'};
function parse(t){
  const acts=[];
  const text=String(t).replace(/\[\[\s*([a-zçğıöşü]+)\s*(?::\s*([^\]]*?))?\s*\]\]/gi,(all,k,v)=>{k=k.toLowerCase();v=(v||'').trim();
    if(k==='git'&&AD[v])acts.push({k,v,ad:AD[v]});
    else if(k==='sektor'){const s=SECS.find(x=>norm(x)===norm(v));if(s)acts.push({k,v:s,ad:s+' şablonları'})}
    else if(k==='arac'&&ARAC[v])acts.push({k,v,ad:ARAC[v]});
    else if(k==='sahne'&&v)acts.push({k,v:v.slice(0,700),ad:"Bu sahneyi AI Stüdyo'ya yaz"});
    else if(k==='tema')acts.push({k,v:'',ad:'Tema panelini aç'});
    return ''}).replace(/\n{3,}/g,'\n\n').trim();
  return{text,acts:acts.slice(0,3)}}

function run(a){
  const go=(v,o)=>window.ZAPP&&ZAPP.go(v,o||{});
  if(a.k==='git'){if(a.v==='fiyatlar')go('hesap',{url:'/zodmotionsBeta/fiyatlar.html'});else go(a.v)}
  else if(a.k==='sektor')go('motion',{url:'/zodmotionsBeta/sablonlar.html#'+slug(a.v)});
  else if(a.k==='arac')go('clip',{tab:a.v});
  else if(a.k==='tema'){window.ZodTheme&&ZodTheme.open()}
  else if(a.k==='sahne'){go('ai');let n=0;const t=setInterval(()=>{n++;let el=null;
    try{const f=document.querySelector('#v-ai iframe');el=f&&f.contentDocument&&f.contentDocument.getElementById('scn')}catch(e){}
    if(el){clearInterval(t);el.value=a.v;el.dispatchEvent(new Event('input',{bubbles:true}));try{el.focus()}catch(e){}}else if(n>60)clearInterval(t)},200)}
  if(innerWidth<760)close()}

function bubble(m,i){
  if(m.rol==='kullanici')return `<div class="zas-m me"><div class="zas-b">${esc(m.metin).replace(/\n/g,'<br>')}</div></div>`;
  if(m.rol==='hata')return `<div class="zas-m err"><div class="zas-b">${esc(m.metin)}${m.login?'<button type="button" class="zas-act" data-login>Giriş yap</button>':''}${m.tekrar?'<button type="button" class="zas-act" data-retry>Tekrar dene</button>':''}</div></div>`;
  const p=parse(m.metin);
  return `<div class="zas-m ai"><div class="zas-b">${md(p.text)}</div>${p.acts.length?`<div class="zas-acts">${p.acts.map((a,j)=>`<button type="button" class="zas-act" data-i="${i}" data-j="${j}">${esc(a.ad)}</button>`).join('')}</div>`:''}
    <div class="zas-tools"><button type="button" class="zas-cp" data-cp="${i}">Kopyala</button></div></div>`}

function render(){
  if(!hist.length){const r=auth();const ad=r&&r.u.profile&&r.u.profile.ad?r.u.profile.ad.split(' ')[0]:'';
    log.innerHTML=`<div class="zas-hi"><b>Merhaba${ad?' '+esc(ad):''}, ben Zod.</b><p>Uygulamayı kullanmanda, reklam fikrinde, metinde, AI sahnesinde yardım ederim. Ne yapmak istiyorsun?</p>
      <div class="zas-sug">${ONERI[ekran()].map(s=>`<button type="button" data-s="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`}
  else log.innerHTML=hist.map(bubble).join('')+(busy?'<div class="zas-m ai"><div class="zas-b zas-dots"><i></i><i></i><i></i></div></div>':'');
  $('#zas-sub',box).textContent=kalan!=null?`Bugün kalan: ${kalan} mesaj`:'Yapay zekâ asistanın';
  log.scrollTop=log.scrollHeight}

async function send(text){
  text=String(text||'').trim();if(!text||busy)return;
  const r=auth();
  hist=hist.filter(m=>m.rol!=='hata');
  hist.push({rol:'kullanici',metin:text});q.value='';fit();
  if(!r){hist.push({rol:'hata',metin:'Asistanı kullanmak için giriş yapman gerekiyor. Ücretsiz hesap açabilirsin.',login:true});save();render();return}
  busy=true;render();
  const res=await r.z.asistan({mesajlar:hist.filter(m=>m.rol!=='hata').slice(-14),ekran:ekran()});
  busy=false;
  if(res&&res.ok){hist.push({rol:'asistan',metin:res.metin});if(res.kalan!=null)kalan=res.kalan}
  else if(res&&res.error==='login')hist.push({rol:'hata',metin:'Asistanı kullanmak için giriş yapman gerekiyor.',login:true});
  else{hist.push({rol:'hata',metin:(res&&res.error)||'Asistan şu an cevap veremedi.',tekrar:!(res&&res.kalan===0)});if(res&&res.kalan===0)kalan=0}
  save();render()}

function fit(){q.style.height='auto';q.style.height=Math.min(140,q.scrollHeight)+'px'}
function open(){box.hidden=false;fab.classList.add('on');document.body.classList.add('zas-open');render();setTimeout(()=>q.focus(),30)}
function close(){box.hidden=true;fab.classList.remove('on');document.body.classList.remove('zas-open')}

fab.addEventListener('click',()=>box.hidden?open():close());
$('#zas-x',box).onclick=close;
$('#zas-new',box).onclick=()=>{hist=[];save();render();q.focus()};
$('#zas-f',box).addEventListener('submit',e=>{e.preventDefault();send(q.value)});
q.addEventListener('input',fit);
q.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();send(q.value)}});
log.addEventListener('click',e=>{
  const s=e.target.closest('[data-s]');if(s){send(s.dataset.s);return}
  const a=e.target.closest('.zas-act[data-i]');if(a){const m=hist[+a.dataset.i];if(m){const p=parse(m.metin);const x=p.acts[+a.dataset.j];if(x)run(x)}return}
  if(e.target.closest('[data-login]')){window.ZAPP&&ZAPP.go('hesap',{url:'/zodmotionsBeta/giris.html'});if(innerWidth<760)close();return}
  if(e.target.closest('[data-retry]')){const last=[...hist].reverse().find(m=>m.rol==='kullanici');hist=hist.filter(m=>m.rol!=='hata');if(last){hist.splice(hist.lastIndexOf(last),1);send(last.metin)}return}
  const c=e.target.closest('[data-cp]');if(c){const m=hist[+c.dataset.cp];if(m){const t=parse(m.metin).text.replace(/\*\*/g,'');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{c.textContent='Kopyalandı';setTimeout(()=>c.textContent='Kopyala',1500)}).catch(()=>{})}}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden)close();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='j'){e.preventDefault();box.hidden?open():close()}});
window.addEventListener('hashchange',()=>{if(!box.hidden&&!hist.length)render()});
window.ZodAsistan={open,close,send};
})();
