/* ZodMotions uygulaması — ana ekran ve alt menü.
   Sekmeler kendi sayfalarını iframe içinde açar; sekme değiştirince çalışma kaybolmaz. */
(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const VIEWS={
  home:null,
  motion:'/zodmotionsBeta/sablonlar.html',
  clip:'/zodclipBeta/',
  ai:'/zodmotionsBeta/ai-studyo.html',
  hesap:'/zodmotionsBeta/hesap.html'
};
// bir sayfa adresinin hangi sekmeye ait olduğu
function viewOf(path){
  if(path.startsWith('/zodclipBeta'))return 'clip';
  if(/\/zodmotionsBeta\/(ai-studyo)\.html/.test(path))return 'ai';
  if(/\/zodmotionsBeta\/(hesap|giris|fiyatlar)\.html/.test(path))return 'hesap';
  if(path.startsWith('/zodmotionsBeta'))return 'motion';
  return null}
const frames={};let cur='home';

function frame(v,url){
  if(frames[v]){if(url&&frames[v].dataset.src!==url){frames[v].dataset.src=url;frames[v].contentWindow.location.href=url}return frames[v]}
  const box=$('#v-'+v);box.innerHTML='<div class="loading">Yükleniyor…</div>';
  const f=document.createElement('iframe');f.title=v;f.allow='autoplay; clipboard-write; fullscreen';f.src=url||VIEWS[v];f.dataset.src=f.src;
  f.addEventListener('load',()=>{const l=box.querySelector('.loading');if(l)l.remove();hook(f,v)});
  box.appendChild(f);frames[v]=f;return f}
function go(v,opt={}){
  if(!(v in VIEWS))v='home';cur=v;
  $$('.view').forEach(x=>x.classList.toggle('on',x.id==='v-'+v));
  $$('.nav button').forEach(b=>{if(b.dataset.go===v)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  if(v!=='home'){const f=frame(v,opt.url);if(opt.tab||opt.mot||opt.fmt){const send=()=>{try{const w=f.contentWindow;if(opt.fmt)w.postMessage({zc:'fmt',v:opt.fmt},location.origin);if(opt.mot)w.postMessage({zc:'mot',k:opt.mot},location.origin);else if(opt.tab)w.postMessage({zc:'tab',name:opt.tab},location.origin)}catch(e){}};
      if(f.contentWindow&&f.contentWindow.ZC)send();else{let n=0;const t=setInterval(()=>{n++;if((f.contentWindow&&f.contentWindow.ZC)||n>60){clearInterval(t);send()}},250)}}
    try{f.contentWindow.focus()}catch(e){}}
  else renderHome();
  try{history.replaceState(null,'','#'+v)}catch(e){}
}
// iframe içindeki bağlantıları doğru sekmeye yönlendir
function hook(f,v){
  let doc;try{doc=f.contentDocument}catch(e){return}
  if(!doc||doc._zHooked)return;doc._zHooked=true;
  doc.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a[href]');if(!a||e.defaultPrevented)return;
    let u;try{u=new URL(a.getAttribute('href'),doc.location.href)}catch(err){return}
    if(u.origin!==location.origin){if(window.zodNative){e.preventDefault();window.zodNative.openExternal(u.href)}return}
    if(a.target==='_blank'||a.hasAttribute('download'))return;
    const tv=viewOf(u.pathname);
    if(u.pathname==='/'||u.pathname==='/index.html'||u.pathname.startsWith('/app')){e.preventDefault();go('home');return}
    if(tv&&tv!==v){e.preventDefault();go(tv,{url:u.pathname+u.search+u.hash})}
  },true);
}

/* ---------- ana sayfa ---------- */
const MOT=[['A20','Holografik bina'],['A16','Şehir silueti'],['A21','Patlatılmış katlar'],['A13','Piksel dolgu'],['A15','Kurdele yazı'],['A23','Yırtık kağıt şerit'],['M25','Holografik panel'],['G19','Işık sızıntısı'],['Y22','Neon parıltı'],['S10','Işık izi logo']];
const SECS=['Emlak & İnşaat','Mimarlık & İç Tasarım','Restoran & Kafe','Güzellik & Kuaför','Moda & E-ticaret','Spor & Fitness','Otomotiv','Sağlık & Klinik','Eğitim & Kurs','Kuyumcu','Mobilya & Dekorasyon','Turizm & Otel','Etkinlik & Düğün','Teknoloji & Uygulama'];
const norm=t=>String(t).toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ı/g,'i');
const slug=n=>norm(n).replace(/&/g,' ').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
$('#mots').innerHTML=MOT.map(([k,n])=>`<button class="mot" type="button" data-mot="${k}"><img src="/zodmotionsBeta/m/${k}.jpg" alt="" loading="lazy"><span>${esc(n)}</span></button>`).join('');
$('#cats').innerHTML=SECS.map(s=>`<button type="button" data-sec="${esc(slug(s))}">${esc(s)}</button>`).join('');
$('#mots').addEventListener('click',e=>{const b=e.target.closest('.mot');if(b)go('clip',{mot:b.dataset.mot})});
$('#cats').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go('motion',{url:'/zodmotionsBeta/sablonlar.html#'+b.dataset.sec})});

function user(){for(const f of Object.values(frames)){try{const z=f.contentWindow.ZMA;if(z&&z.user&&z.user())return{u:z.user(),z}}catch(e){}}try{if(window.ZMA&&ZMA.user())return{u:ZMA.user(),z:ZMA}}catch(e){}return null}
function renderAcct(){
  const r=user();const box=$('#acct');
  if(!r){document.body.classList.add('nosub');box.innerHTML='<button class="btn pri" data-go="hesap" type="button">Giriş yap</button>';$('#hello').textContent='Hoş geldin';return}
  const p=r.u.profile||{};const act=r.z.isActive?r.z.isActive(r.u):false;document.body.classList.toggle('nosub',!act);const P=(r.z.PLANS||{})[p.plan]||{n:'Ücretsiz'};
  const first=(p.ad||'').split(' ')[0];$('#hello').textContent=first?`Merhaba ${first}`:'Hoş geldin';
  box.innerHTML=`<span class="chip${act?' on':''}"><i></i>${act?esc(P.n)+' paketi aktif':'Abonelik yok'}</span>${act?'':'<a class="btn pri" href="/zodmotionsBeta/fiyatlar.html" data-go="hesap">Paketleri gör</a>'}`;
}
function lastProject(){
  try{const r=indexedDB.open('zodclip',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');
    r.onsuccess=()=>{const db=r.result;try{const q=db.transaction('kv').objectStore('kv').get('project');q.onsuccess=()=>{const p=q.result;let n=0;try{n=JSON.parse(p.snap).items.length}catch(e){}
      if(p&&n){let nm='ZodClip projesi';try{nm=JSON.parse(p.snap).cfg.name||nm}catch(e){}$('#last').hidden=false;$('#last-n').textContent=nm;$('#last-t').textContent=`${n} parça · ${new Date(p.savedAt).toLocaleString('tr-TR',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'})}`;
        const id=(p.srcIds||[])[0];if(id){try{const q2=db.transaction('kv').objectStore('kv').get('src:'+id);q2.onsuccess=()=>{const r2=q2.result;if(r2&&r2.thumb){$('#last-th').style.backgroundImage=`url('${r2.thumb}')`;$('#last-th').innerHTML=''}}}catch(e){}}}else $('#last').hidden=true}}catch(e){}}}catch(e){}
}
function renderHome(){renderAcct();lastProject()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;e.preventDefault();go(b.dataset.go,{tab:b.dataset.tab,fmt:b.dataset.fmt})});
window.addEventListener('online',()=>$('#offline').hidden=true);window.addEventListener('offline',()=>$('#offline').hidden=false);
if(!navigator.onLine)$('#offline').hidden=false;
if(window.zodNative&&window.zodNative.version)$('#ver').textContent='Masaüstü sürüm '+window.zodNative.version;else $('#ver').textContent='Web sürüm';
if(window.ZMA&&ZMA.onChange)ZMA.onChange(()=>{if(cur==='home')renderAcct()});
window.addEventListener('storage',()=>{if(cur==='home')renderAcct()});
const start=(location.hash||'').slice(1);go(start in VIEWS?start:'home');
window.ZAPP={go};
})();
