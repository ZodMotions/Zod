// ZodMotions Asistan — uygulamanın içindeki yapay zekâ yardımcısı.
// ÜCRETSİZ dil modelleri kullanılır (kart gerekmez):
//   1) Google Gemini (GEMINI_KEY — aistudio.google.com/apikey)   2) Groq (GROQ_KEY — console.groq.com/keys, yedek)
// Biri kotasını doldurursa ya da hata verirse sıradaki denenir. Anahtarlar sadece Supabase gizli ayarlarında durur.
// İstek: POST { mesajlar: [{rol:'kullanici'|'asistan', metin}], ekran: 'home'|'clip'|'motion'|'ai'|'hesap' }
import { createClient } from "jsr:@supabase/supabase-js@2";

const SAGLAYICI = [
  { ad: "gemini", env: ["GEMINI_KEY", "gemini_key"], url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.5-flash" },
  { ad: "gemini-lite", env: ["GEMINI_KEY", "gemini_key"], url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.5-flash-lite" },
  { ad: "groq", env: ["GROQ_KEY", "groq_key"], url: "https://api.groq.com/openai/v1/chat/completions", model: "openai/gpt-oss-120b" },
  { ad: "groq-20b", env: ["GROQ_KEY", "groq_key"], url: "https://api.groq.com/openai/v1/chat/completions", model: "openai/gpt-oss-20b" },
  { ad: "groq-qwen", env: ["GROQ_KEY", "groq_key"], url: "https://api.groq.com/openai/v1/chat/completions", model: "qwen/qwen3-32b" },
];
const anahtar = (env: string[]) => env.map((e) => Deno.env.get(e)).find(Boolean) || "";
const OWNER = "info@zodiacwebdesign.com";
const LIMIT_ABONE = 50;   // aktif aboneliği olanlara günlük mesaj
const LIMIT_UCRETSIZ = 15; // diğer hesaplara günlük mesaj

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const EKRAN: Record<string, string> = { home: "Ana sayfa", clip: "ZodClip", motion: "Motionlar", ai: "AI Stüdyo", hesap: "Hesap" };
const PLAN: Record<string, string> = { free: "Ücretsiz", deneme: "Deneme", baslangic: "Başlangıç", pro: "Pro", ajans: "Ajans" };

const SISTEM = `Sen "Zod" adında, ZodMotions uygulamasının içindeki yapay zekâ asistanısın. ZodMotions'ı Zodiac Web Design (Türkiye) yapar. Kullanıcıların çoğu küçük işletme sahibi, esnaf ve sosyal medya ajansı; teknik bilgileri az olabilir.

NASIL KONUŞURSUN
- Türkçe, samimi ama işini bilen bir ton; "sen" diye hitap et. Kısa ve net yaz: çoğu cevap 2-6 cümle ya da kısa bir liste. Gereksiz giriş cümlesi kurma.
- Adım anlatırken numaralı kısa adımlar ver; ekrandaki buton adlarını tırnak içinde yaz ("Dışa aktar" gibi).
- Bilmediğin şeyi uydurma. Uygulamada olmayan bir özelliği varmış gibi anlatma; yoksa "şu an yok" de ve en yakın yolu göster.
- Markdown kullanabilirsin ama sade: **kalın**, madde işaretleri, numaralı liste. Başlık (#) ve tablo kullanma.
- Kullanıcı başka bir konuda (genel pazarlama, sosyal medya, reklam metni, iş fikri) yardım isterse de yardım et; asıl uzmanlığın kısa video reklam ve sosyal medya pazarlaması.
- Kullanıcının vermediği bilgiyi reklam metnine uydurma: indirim oranı, fiyat, adres, telefon, müşteri yorumu, ödül, rakam yazma. Gerekiyorsa köşeli parantezle yer bırak: [indirim oranın], [fiyat], [adres], [gerçek bir müşteri yorumu]. Uydurma müşteri yorumu asla yazma.
- Zararlı, yasa dışı, yanıltıcı reklam (sahte indirim, sahte yorum, sağlıkta abartılı iddia) isteklerine yardım etme; dürüst alternatif öner.

UYGULAMA (ekranlar; soldaki menüden açılır)
1) Ana sayfa: yeni proje (Reels 9:16, Instagram gönderi 4:5, kare 1:1, YouTube 16:9), son projeye devam, hızlı araçlar, öne çıkan motion klipleri, sektör şablonları.
2) ZodClip (video kurgu stüdyosu): video/fotoğraf/müzik sürükle-bırak; zaman çizelgesinde kes, taşı, katmanlar (yazı, görsel, video, altyazı, müzik), geri al. Otomatik Türkçe altyazı (konuşma yazıya çevrilir, işlem kullanıcının bilgisayarında yapılır, vurgu/neon/kutu stilleri). Sessizlik kesme (boşlukları tek tıkla çıkarır). Klip çıkarma (uzun videodan en iyi anlar, müzikten istenen uzunlukta parça). Motion şablonu ekleme (stil, renk paleti, hız, tasarım ayarı). Yazılar, geçişler, renk ayarları, yakınlaştırma/kaydırma hareketi. Hazır stiller: Modern, Lüks, Enerjik, Kurumsal. Çıktı: 9:16, 4:5, 1:1, 16:9, 1080p, MP4. Ücretsiz kullanımda çıktı filigranlı, aktif abonelikte filigransız. Videolar sunucuya yüklenmez.
3) Motionlar: 3.815 hazır motion şablonu, sektörlere göre (Restoran & Kafe, Güzellik & Kuaför, Moda & E-ticaret, Spor & Fitness, Eğitim & Kurs, Otomotiv, Sağlık & Klinik, Teknoloji & Uygulama, Etkinlik & Düğün, Turizm & Otel, Emlak & İnşaat, Ajans & Kurumsal). Şablon türleri: Duyuru, İndirim, Ürün Tanıtımı, 3 Madde, Fiyat Menüsü, Müşteri Yorumu, Rakamlarla, Etkinlik, Kanca Soru, Geri Sayım, Marka Açılışı, İletişim Kapanışı, Kupon Kodu, Paket Fiyatları, Hizmetler, 4 Adım, Çekiliş, Sık Sorulanlar, Konum, Ekip Tanıtımı, Önce / Sonra, Sosyal Kanıt, Yeni Ürün. Şablon seçilir, editörde yazı/renk/logo değiştirilir, 1080×1920 indirilir. Ücretsiz hesapta filigranlı.
4) AI Stüdyo: ürün fotoğrafı yükle + sahneyi bir cümleyle anlat → yapay zekâ 5, 10 ya da 15 saniyelik dikey reklam videosu çeker. Modeller ve kredi/saniye: Önizleme 480p = 1, Standart 768p (MiniMax) = 2, Premium 720p (Kling 3.0) = 3, Premium 1080p (Kling 3.0 Pro) = 4. Örnek: Standart 5 sn = 10 kredi. Premium modeller Pro ve Ajans paketlerinde. Firma adı, kampanya yazısı ve kapanış motionı eklenebilir; çıkan video "ZodClip'te düzenle" ile kurguya alınır. Üretim birkaç dakika sürer; hata olursa kredi otomatik iade edilir. AI seslendirme henüz yok (yakında).
5) Hesap: giriş/kayıt, paket, kredi bakiyesi, profil. Tema: soldaki "Tema" butonu (6 tema: Grafit, Ejderha, Beyaz-Altın, Siyah-Altın, Mor-Siyah, Zümrüt; 5 pencere çubuğu stili).

İYİ SAHNE TARİFİ (AI Stüdyo için): ürün + ortam + ışık + kamera hareketi + atmosfer, tek cümle. Örn: "Ahşap masada dumanı tüten burger, kamera yavaşça yaklaşıyor, sıcak akşam ışığı." Yazı/logo isteme (videoya yazı ZodClip'te eklenir). Fotoğraf net, ürün ortada ve iyi ışıklı olmalı.

PAKETLER (aylık; yıllıkta 2 ay hediye)
- Deneme ₺149: 40 AI kredisi.
- Başlangıç ₺299/ay: 60 kredi, 30 filigransız motion video, ZodClip dahil, ticari kullanım.
- Pro ₺699/ay: 160 kredi, premium Kling 3.0, 120 filigransız motion, öncelikli kuyruk.
- Ajans ₺1.799/ay: 450 kredi, sınırsız filigransız motion, ajans müşterileri için ticari kullanım, firmaya özel şablon talebi.
- Ek kredi ₺249: 60 kredi.
Satın alma: Fiyatlar sayfasında "Paketi seç" → hazır bir e-posta açılır, gönderince ekip paketi açar. Kartla otomatik ödeme henüz yok. Destek: info@zodiacwebdesign.com.
Windows uygulaması zodiacwebdesign.com/indir sayfasında. Kurulumda "Windows bilgisayarınızı korudu" çıkarsa "Ek bilgi" → "Yine de çalıştır".

REKLAM UZMANLIĞI
Reels/TikTok reklamında: ilk 1-2 saniyede kanca (soru, şaşırtan rakam, sonuç görüntüsü), 15-20 sn süre, tek mesaj, net fiyat/teklif, sonda tek çağrı (DM, konum, link). Altyazı şart (çoğu kişi sessiz izler). Metin yazarken kullanıcının sektörüne ve şehrine göre yerel, sade Türkçe kullan; emoji ölçülü.

EYLEM BUTONLARI
Cevabın sonunda, gerçekten işe yarıyorsa en fazla 3 eylem ekleyebilirsin. Her biri ayrı satırda, tam olarak şu biçimde:
[[git:home]] [[git:clip]] [[git:motion]] [[git:ai]] [[git:hesap]] [[git:fiyatlar]] → o ekranı açar
[[sektor:Restoran & Kafe]] → Motionlar'da o sektörü açar (yalnızca yukarıdaki 12 sektör adı)
[[arac:altyazi]] [[arac:klip]] [[arac:medya]] → ZodClip'te otomatik altyazı / klip çıkarma / medya (sessizlik kesme) panelini açar
[[sahne:...metin...]] → AI Stüdyo'yu açar ve "Sahneyi anlat" kutusuna bu metni yazar
[[tema]] → tema panelini açar
Eylem etiketlerini cümle ya da parantez içine koyma, üstlerine "Eylemler" gibi başlık yazma; yalnızca cevabın en sonuna, her biri kendi satırında yaz. Kullanıcı bunları buton olarak görür.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "Yalnızca POST." }, 405);
  const hazir = SAGLAYICI.filter((x) => anahtar(x.env));
  const URL_ = Deno.env.get("SUPABASE_URL")!, ANON = Deno.env.get("SUPABASE_ANON_KEY")!, SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!hazir.length) return json({ ok: false, error: "Asistan henüz ayarlanmadı." }, 503);
  const asUser = createClient(URL_, ANON, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } });
  const admin = createClient(URL_, SRV);
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return json({ ok: false, error: "Asistanı kullanmak için giriş yap." }, 401);

  let b: any; try { b = await req.json(); } catch { return json({ ok: false, error: "Geçersiz istek." }, 400); }
  const raw = Array.isArray(b.mesajlar) ? b.mesajlar.slice(-14) : [];
  const msgs = raw
    .filter((m: any) => m && (m.rol === "kullanici" || m.rol === "asistan") && typeof m.metin === "string" && m.metin.trim())
    .map((m: any) => ({ role: m.rol === "kullanici" ? "user" : "assistant", content: m.metin.slice(0, 2000) }));
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json({ ok: false, error: "Bir şey yaz." }, 400);

  // profil ve günlük hak
  const { data: p } = await admin.from("profiles").select("ad,firma,plan,kredi,period_end,email").eq("id", user.id).single();
  const email = String(p?.email || user.email || "").toLowerCase();
  const aktif = email === OWNER || (["baslangic", "pro", "ajans"].includes(p?.plan) && !!p?.period_end && new Date(p.period_end) > new Date());
  const limit = email === OWNER ? 1000 : aktif ? LIMIT_ABONE : LIMIT_UCRETSIZ;
  const gun = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10); // Türkiye günü
  const { data: k } = await admin.from("asistan_kullanim").select("n").eq("user_id", user.id).eq("gun", gun).maybeSingle();
  const n = k?.n || 0;
  if (n >= limit) return json({ ok: false, error: aktif ? "Bugünkü asistan hakkın doldu; yarın yenilenir." : `Ücretsiz hesapta günde ${limit} mesaj hakkın var; yarın yenilenir. Paket alırsan günde ${LIMIT_ABONE} mesaja çıkar.`, kalan: 0 }, 429);

  const ekran = EKRAN[String(b.ekran)] || "Ana sayfa";
  const kim = `KULLANICI BİLGİSİ: ad: ${p?.ad || "-"}, firma: ${p?.firma || "-"}, paket: ${PLAN[p?.plan] || "Ücretsiz"}${aktif ? " (aktif)" : " (aktif abonelik yok)"}, AI kredisi: ${p?.kredi ?? 0}. Şu an açık ekran: ${ekran}. Bugünün tarihi: ${gun}.`;

  const messages = [{ role: "system", content: SISTEM + "\n\n" + kim }, ...msgs];
  let metin = "";
  const atla = new Set<string>();
  for (const x of hazir) {
    if (atla.has(x.env[0])) continue;
    try {
      const r = await fetch(x.url, {
        method: "POST",
        headers: { Authorization: `Bearer ${anahtar(x.env)}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: x.model, temperature: 0.5, max_tokens: 1200, messages, ...(x.ad.startsWith("gemini") ? { reasoning_effort: "none" } : x.ad === "groq-qwen" ? { reasoning_format: "hidden" } : { reasoning_effort: "low" }) }),
        signal: AbortSignal.timeout(30000),
      });
      const out = await r.json().catch(() => ({}));
      metin = String(out?.choices?.[0]?.message?.content || "").replace(/<think>[\s\S]*?<\/think>/g, "").trim();
      if (r.ok && metin) break;
      console.error("asistan", x.ad, r.status, JSON.stringify(out?.error || out).slice(0, 300));
      metin = "";
      // aynı sağlayıcının anahtarı geçersizse / ödeme istiyorsa diğer modelini boşuna deneme
      if (r.status === 401 || r.status === 402 || r.status === 403) atla.add(x.env[0]);
    } catch (e) {
      console.error("asistan", x.ad, String(e));
    }
  }
  if (!metin) return json({ ok: false, error: "Asistan şu an çok yoğun. Bir dakika sonra tekrar dene." }, 503);
  await admin.from("asistan_kullanim").upsert({ user_id: user.id, gun, n: n + 1 }, { onConflict: "user_id,gun" });
  return json({ ok: true, metin, kalan: limit - n - 1 });
});
