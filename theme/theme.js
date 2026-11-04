/* ZodMotions uygulama teması: seçim bu cihazda saklanır, açık olan tüm sekmelere (iframe'lere) anında uygulanır. */
(()=>{
const K='zod-theme',KB='zod-bar';
const THEMES=[
 {id:'grafit',n:'Grafit',d:'Şu anki sade koyu görünüm',c:['#111113','#1c1c1f','#4BA3FF','#DCE0E5']},
 {id:'ejderha',n:'Ejderha',d:'Kırmızı-altın, ejderha pulu desenli',c:['#0E0808','#251513','#F0523A','#E8B55A']},
 {id:'beyaz-altin',n:'Beyaz · Altın',d:'Fildişi beyaz, altın yaldız ayrıntılar',c:['#F6F2EA','#FFFFFF','#B8892F','#D9AE52']},
 {id:'siyah-altin',n:'Siyah · Altın',d:'Derin siyah, altın çizgi ve süsler',c:['#0A0A09','#1F1D19','#D9B44A','#E0B94E']},
 {id:'mor-siyah',n:'Mor · Siyah',d:'Gece siyahı, mor ışıltı',c:['#0C0A12','#1F1A2C','#A47BFF','#C2A6FF']},
 {id:'zumrut',n:'Zümrüt',d:'Koyu yeşil, zümrüt vurgular',c:['#08100D','#17261F','#3DD9A0','#7DE8BE']}];
const BARS=[{s:1,n:'Sade'},{s:2,n:'Logolu'},{s:3,n:'Sayfa adıyla'},{s:4,n:'Geniş harfli'},{s:5,n:'Rozet'}];
const ids=THEMES.map(t=>t.id);
const rd=(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}};
const wr=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const get=()=>{const v=rd(K,'grafit');return ids.includes(v)?v:'grafit'};
const bar=()=>{const v=parseInt(rd(KB,'1'));return v>=1&&v<=5?v:1};
let page='';
function native(){try{if(window.top===window&&window.zodNative&&window.zodNative.setChrome)window.zodNative.setChrome({theme:get(),style:bar(),page})}catch(e){}}
function apply(){const t=get();document.documentElement.dataset.theme=t;try{document.documentElement.classList.toggle('zt-framed',window.self!==window.top)}catch(e){document.documentElement.classList.add('zt-framed')}
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(document.documentElement).getPropertyValue('--p0').trim()||'#161618';native()}
apply();
addEventListener('storage',e=>{if(e.key===K||e.key===KB)apply()});
function open(){
  if(document.querySelector('.zt-panel'))return;
  const desk=!!(window.zodNative);
  const d=document.createElement('div');d.className='zt-panel';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Tema');
  d.innerHTML=`<div class="zt-box"><h2>Tema</h2><p>Temayı seç; uygulamanın tamamı anında değişir. Seçimin bu cihazda saklanır.</p>
   <div class="zt-grid">${THEMES.map(t=>`<button type="button" class="zt-t" data-t="${t.id}" aria-pressed="${t.id===get()}"><span class="zt-sw" style="background:${t.id==='ejderha'?`linear-gradient(90deg,${t.c[0]} 30%,transparent),url(/theme/ejderha-bg.webp) right center/cover,`:''}${t.c[0]}"><i style="background:${t.c[1]}"></i><span><em style="width:70%;background:${t.c[3]}"></em><em style="width:45%;background:${t.c[2]}"></em></span></span><b>${t.n}</b><small>${t.d}</small></button>`).join('')}</div>
   ${desk?`<h3>Pencere çubuğu</h3><div class="zt-bars">${BARS.map(b=>`<button type="button" class="zt-b" data-b="${b.s}" aria-pressed="${b.s===bar()}"><b>${b.n}</b><iframe tabindex="-1" title="" src="/theme/baslik.html?s=${b.s}&t=${get()}&p=Ana%20sayfa"></iframe></button>`).join('')}</div>`:''}
   <div class="zt-f"><small>${desk?'':'Pencere çubuğu seçenekleri masaüstü uygulamasında görünür.'}</small><button type="button" class="btn pri" data-x>Tamam</button></div></div>`;
  document.body.appendChild(d);
  const sync=()=>{d.querySelectorAll('.zt-t').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===get())));d.querySelectorAll('.zt-b').forEach(b=>{b.setAttribute('aria-pressed',String(+b.dataset.b===bar()));const f=b.querySelector('iframe');f.src=`/theme/baslik.html?s=${b.dataset.b}&t=${get()}&p=Ana%20sayfa`})};
  d.addEventListener('click',e=>{const t=e.target.closest('[data-t]'),b=e.target.closest('[data-b]');
    if(t){wr(K,t.dataset.t);apply();sync()}else if(b){wr(KB,b.dataset.b);native();sync()}else if(e.target===d||e.target.closest('[data-x]'))d.remove()});
  d.addEventListener('keydown',e=>{if(e.key==='Escape')d.remove()});
  const f=d.querySelector('[aria-pressed=true]');if(f)f.focus()}
window.ZodTheme={THEMES,BARS,get,set(t){if(ids.includes(t)){wr(K,t);apply()}},bar,setBar(s){wr(KB,String(s));native()},setPage(p){page=p;native()},open};
})();
