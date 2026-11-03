/* ZodMotions üyelik modülü
   - zm-config.js içinde Supabase adresi ve anahtarı varsa gerçek hesap sistemi (Supabase Auth + profiles tablosu) kullanılır.
   - Yoksa "önizleme modu": hesaplar bu tarayıcıda saklanır (yatırımcı demosu ve test için).
   Dışarıya window.ZMA verir; tüm sayfalar aynı API'yi kullanır. */
(()=>{
const CFG=window.ZM_CONFIG||{};
const LIVE=!!(CFG.supabaseUrl&&CFG.supabaseAnonKey);
const PLANS={
  free:{n:'Ücretsiz',kredi:0,motion:3,premium:false},
  deneme:{n:'Deneme',kredi:50,motion:3,premium:false},
  baslangic:{n:'Başlangıç',kredi:80,motion:50,premium:false},
  pro:{n:'Pro',kredi:250,motion:200,premium:true},
  ajans:{n:'Ajans',kredi:700,motion:null,premium:true}
};
const OWNER='info@zodiacwebdesign.com';
/* aktif abonelik: Başlangıç/Pro/Ajans ve süresi dolmamış (sahip hesabı her zaman aktif) */
function isActive(p){if(!p)return false;if(String(p.email||'').toLowerCase()===OWNER)return true;return ['baslangic','pro','ajans'].includes(p.plan)&&!!p.period_end&&new Date(p.period_end)>new Date()}
const listeners=new Set();let current=null;
const emit=()=>listeners.forEach(f=>{try{f(current)}catch(e){}});
const err=m=>({ok:false,error:m});
const okr=(x={})=>Object.assign({ok:true},x);
const emailOk=e=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e||'').trim());
const TR_ERR={'Invalid login credentials':'E-posta veya şifre hatalı.','User already registered':'Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.','Email not confirmed':'E-postanı henüz doğrulamadın. Gelen kutundaki bağlantıya tıkla.','Password should be at least 8 characters':'Şifre en az 8 karakter olmalı.'};
const trErr=m=>TR_ERR[m]||m||'Bir şeyler ters gitti, tekrar dene.';
function validate({email,password,ad},signup){
  if(!emailOk(email))return 'Geçerli bir e-posta adresi yaz.';
  if(!password||password.length<8)return 'Şifre en az 8 karakter olmalı.';
  if(signup&&(!ad||ad.trim().length<2))return 'Adını ve soyadını yaz.';
  return null}

/* ---------- Önizleme modu (tarayıcıda) ---------- */
const LS={get(k,d){try{const v=localStorage.getItem('zma_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('zma_'+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem('zma_'+k)}catch(e){}}};
async function hash(pw,salt){try{const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
  const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},k,256);return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
  catch(e){let h=0;for(const c of salt+pw)h=(h*31+c.charCodeAt(0))|0;return 'x'+h}}
const rid=()=>([...crypto.getRandomValues(new Uint8Array(12))].map(x=>x.toString(16).padStart(2,'0')).join(''));
function newProfile(id,email,ad,firma){return{id,email,ad:ad.trim(),firma:(firma||'').trim(),plan:'free',kredi:0,motion_left:3,clean_left:1,period_end:null,created_at:new Date().toISOString(),kvkk_onay:new Date().toISOString()}}
const local={
  async init(){const e=LS.get('session',null);const u=e&&LS.get('users',{})[e];current=u?{id:u.profile.id,email:e,profile:u.profile}:null;emit()},
  save(p){const us=LS.get('users',{});if(us[p.email]){us[p.email].profile=p;LS.set('users',us)}current={id:p.id,email:p.email,profile:p};emit()},
  async signUp({email,password,ad,firma,ileti}){const v=validate({email,password,ad},true);if(v)return err(v);email=email.trim().toLowerCase();
    const us=LS.get('users',{});if(us[email])return err('Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.');
    const salt=rid(),id=rid();us[email]={salt,h:await hash(password,salt),profile:Object.assign(newProfile(id,email,ad,firma),{ileti_onay:!!ileti})};LS.set('users',us);LS.set('session',email);await local.init();return okr()},
  async signIn({email,password}){const v=validate({email,password});if(v)return err(v);email=email.trim().toLowerCase();const u=LS.get('users',{})[email];
    if(!u||u.h!==await hash(password,u.salt))return err('E-posta veya şifre hatalı.');LS.set('session',email);await local.init();return okr()},
  async google(){return err('Google ile giriş, site yayına alınıp hesap sistemi bağlandığında açılacak. Şimdilik e-postayla kayıt olabilirsin.')},
  async signOut(){LS.del('session');current=null;emit();return okr()},
  async resetPassword(email){if(!emailOk(email))return err('Geçerli bir e-posta adresi yaz.');return okr({note:'Önizleme modunda e-posta gönderilmez. Yayında bu adrese şifre sıfırlama bağlantısı gider.'})},
  async changePassword(oldPw,newPw){if(!current)return err('Önce giriş yap.');if(!newPw||newPw.length<8)return err('Yeni şifre en az 8 karakter olmalı.');
    const us=LS.get('users',{}),u=us[current.email];if(u.h!==await hash(oldPw||'',u.salt))return err('Mevcut şifren hatalı.');u.salt=rid();u.h=await hash(newPw,u.salt);LS.set('users',us);return okr()},
  async updateProfile({ad,firma}){if(!current)return err('Önce giriş yap.');if(!ad||ad.trim().length<2)return err('Adını yaz.');const p={...current.profile,ad:ad.trim(),firma:(firma||'').trim()};local.save(p);return okr()},
  async deleteAccount(){if(!current)return err('Önce giriş yap.');const us=LS.get('users',{});delete us[current.email];LS.set('users',us);LS.del('session');current=null;emit();return okr()},
  async useMotion(){if(!current)return err('login');const p={...current.profile};
    if(isActive(p)&&(p.motion_left===null||p.motion_left>0)){if(p.motion_left!==null)p.motion_left--;local.save(p);return okr({wm:false})}
    return okr({wm:true,reason:isActive(p)?'Bu ayki damgasız motion hakkın bitti; video filigranlı oluşur.':'Aktif aboneliğin yok; motion videoların filigranlı oluşur.'})},
  async useCredits(n,premium){if(!current)return err('login');const p={...current.profile};
    if(premium&&!PLANS[p.plan].premium)return err('Premium model (Kling 3.0 Pro) Pro ve Ajans paketlerinde açık.');
    if(p.kredi<n)return err(`Bakiyen yetmiyor: ${n} kredi gerekli, ${p.kredi} kredin var.`);p.kredi-=n;local.save(p);return okr({kredi:p.kredi})},
  async demoSetPlan(plan){if(!current)return err('Önce giriş yap.');const P=PLANS[plan];if(!P)return err('Paket bulunamadı.');const p={...current.profile};
    if(plan==='deneme'){p.kredi+=P.kredi;if(p.plan==='free')p.plan='deneme'}
    else{p.plan=plan;p.kredi=P.kredi;p.motion_left=P.motion;p.clean_left=0;const d=new Date();d.setMonth(d.getMonth()+1);p.period_end=d.toISOString()}
    local.save(p);return okr()}
};

/* ---------- Yayın modu (Supabase) ---------- */
let sb=null;
const live={
  async init(){const m=window.supabase&&window.supabase.createClient?window.supabase:await import('https://esm.sh/@supabase/supabase-js@2');sb=m.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,detectSessionInUrl:true}});
    sb.auth.onAuthStateChange(()=>live.load());await live.load()},
  async load(){const {data:{user}}=await sb.auth.getUser();if(!user){current=null;emit();return}
    const {data:p}=await sb.from('profiles').select('*').eq('id',user.id).single();current={id:user.id,email:user.email,profile:p||newProfile(user.id,user.email,'','')};emit()},
  async signUp({email,password,ad,firma,ileti}){const v=validate({email,password,ad},true);if(v)return err(v);
    const {data,error}=await sb.auth.signUp({email:email.trim(),password,options:{data:{ad:ad.trim(),firma:(firma||'').trim(),ileti:!!ileti},emailRedirectTo:location.origin+location.pathname.replace(/[^/]*$/,'')+'hesap.html'}});
    if(error)return err(trErr(error.message));await live.load();return okr({confirm:!data.session})},
  async signIn({email,password}){const v=validate({email,password});if(v)return err(v);const {error}=await sb.auth.signInWithPassword({email:email.trim(),password});if(error)return err(trErr(error.message));await live.load();return okr()},
  async google(){const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname.replace(/[^/]*$/,'')+'hesap.html'}});return error?err(trErr(error.message)):okr()},
  async signOut(){await sb.auth.signOut();current=null;emit();return okr()},
  async resetPassword(email){if(!emailOk(email))return err('Geçerli bir e-posta adresi yaz.');const {error}=await sb.auth.resetPasswordForEmail(email.trim(),{redirectTo:location.origin+location.pathname.replace(/[^/]*$/,'')+'hesap.html#sifre'});return error?err(trErr(error.message)):okr({note:'Şifre sıfırlama bağlantısı e-postana gönderildi.'})},
  async changePassword(oldPw,newPw){if(!newPw||newPw.length<8)return err('Yeni şifre en az 8 karakter olmalı.');const {error}=await sb.auth.updateUser({password:newPw});return error?err(trErr(error.message)):okr()},
  async updateProfile({ad,firma}){if(!ad||ad.trim().length<2)return err('Adını yaz.');const {error}=await sb.from('profiles').update({ad:ad.trim(),firma:(firma||'').trim()}).eq('id',current.id);if(error)return err(trErr(error.message));await live.load();return okr()},
  async deleteAccount(){const {error}=await sb.rpc('delete_account');if(error)return err(trErr(error.message));await sb.auth.signOut();current=null;emit();return okr()},
  async useMotion(){if(!current)return err('login');const {data,error}=await sb.rpc('use_motion');if(error)return err(trErr(error.message));await live.load();return data.ok?okr({wm:data.wm}):err(data.error)},
  async useCredits(n,premium){if(!current)return err('login');const {data,error}=await sb.rpc('use_credits',{n,premium:!!premium});if(error)return err(trErr(error.message));await live.load();return data.ok?okr({kredi:data.kredi}):err(data.error)},
  async demoSetPlan(){return err('Paketler ödeme sayfasından alınır.')}
};

const B=LIVE?live:local;
const ready=B.init().catch(e=>{console.error('ZMA',e);current=null;emit()});
window.ZMA={mode:LIVE?'live':'preview',PLANS,ready,
  user:()=>current,
  onChange(f){listeners.add(f);ready.then(()=>f(current));return()=>listeners.delete(f)},
  signUp:a=>B.signUp(a),signIn:a=>B.signIn(a),google:()=>B.google(),signOut:()=>B.signOut(),
  resetPassword:e=>B.resetPassword(e),changePassword:(o,n)=>B.changePassword(o,n),updateProfile:a=>B.updateProfile(a),deleteAccount:()=>B.deleteAccount(),
  useMotion:()=>B.useMotion(),
  isActive:u=>isActive(u&&u.profile),
  // ZodClip erişimi: sadece aktif abonelik
  async zodclipAccess(){if(!current)return{ok:false,reason:'login'};if(isActive(current.profile))return{ok:true};
    if(LIVE&&sb){try{const {data,error}=await sb.rpc('zodclip_access');if(!error&&data)return data}catch(e){}}
    return{ok:false,reason:'plan'}},useCredits:(n,p)=>B.useCredits(n,p),demoSetPlan:p=>B.demoSetPlan(p),
  initials(u){const s=(u&&u.profile&&u.profile.ad)||(u&&u.email)||'?';return s.split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0].toLocaleUpperCase('tr')).join('')},
  // giriş gerekiyorsa kayıt sayfasına yönlendirir; geri dönülecek sayfayı hatırlar
  requireLogin(next){if(current)return true;location.href='giris.html?mode=kayit&next='+encodeURIComponent(next||location.pathname.split('/').pop()+location.hash);return false}
};
})();
