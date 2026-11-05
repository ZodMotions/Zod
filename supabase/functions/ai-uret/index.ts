// ZodMotions AI Stüdyo — fal.ai üzerinden fotoğraftan video üretir.
// API anahtarı (FAL_KEY) sadece burada, Supabase'in gizli ayarlarında durur; tarayıcıya hiç gitmez.
// İstek: POST { action:'start', model:'std'|'pre', duration, prompt, image(dataURI) }  veya  { action:'status', id }
import { createClient } from "jsr:@supabase/supabase-js@2";

const h3 = (res: string) => (prompt: string, img: string, d: number) => ({ prompt, image_url: img, duration: d, resolution: res, prompt_expansion_mode: "balanced" });
const kling = (prompt: string, img: string, d: number) => ({ prompt, start_image_url: img, duration: String(d), generate_audio: false, negative_prompt: "blur, distort, low quality, text, watermark" });
// kredi / saniye: önizleme 1, standart 2, premium 720p 3, premium 1080p 4
const MODELS: Record<string, { endpoint: string; rate: number; premium: boolean; body: (p: string, img: string, d: number) => Record<string, unknown> }> = {
  prev: { endpoint: "minimax/h3-max/image-to-video", rate: 1, premium: false, body: h3("480P") },
  std: { endpoint: "minimax/h3-max/image-to-video", rate: 2, premium: false, body: h3("768P") },
  pre720: { endpoint: "fal-ai/kling-video/v3/standard/image-to-video", rate: 3, premium: true, body: kling },
  pre1080: { endpoint: "fal-ai/kling-video/v3/pro/image-to-video", rate: 4, premium: true, body: kling },
  // eski ad (geriye uyumluluk)
  pre: {
    endpoint: "fal-ai/kling-video/v3/pro/image-to-video", rate: 4, premium: true, body: kling,
  },
};
const DURS = [5, 10, 15];
const STYLE = " Vertical 9:16 commercial shot, realistic, cinematic lighting, smooth camera motion, high detail, no text, no watermark.";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "Yalnızca POST." }, 405);
  const FAL = Deno.env.get("FAL_KEY") || Deno.env.get("fal_key");
  const URL_ = Deno.env.get("SUPABASE_URL")!, ANON = Deno.env.get("SUPABASE_ANON_KEY")!, SRV = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  if (!FAL) return json({ ok: false, error: "AI servisi henüz ayarlanmadı (FAL_KEY eksik)." }, 503);
  const auth = req.headers.get("Authorization") || "";
  const asUser = createClient(URL_, ANON, { global: { headers: { Authorization: auth } } });
  const admin = createClient(URL_, SRV);
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return json({ ok: false, error: "Önce giriş yap." }, 401);
  let b: any; try { b = await req.json(); } catch { return json({ ok: false, error: "Geçersiz istek." }, 400); }

  if (b.action === "start") {
    const m = MODELS[b.model]; const d = Number(b.duration);
    if (!m || !DURS.includes(d)) return json({ ok: false, error: "Geçersiz model ya da süre." }, 400);
    const prompt = String(b.prompt || "").trim().slice(0, 800);
    if (prompt.length < 3) return json({ ok: false, error: "Sahneyi bir cümleyle anlat." }, 400);
    const img = String(b.image || "");
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(img) || img.length > 6_000_000) return json({ ok: false, error: "Fotoğraf JPG/PNG/WEBP olmalı ve 4 MB'tan küçük olmalı." }, 400);
    const cost = d * m.rate;
    // kredi kullanıcının kendi oturumuyla düşülür: abonelik / premium / bakiye kuralları veritabanında kontrol edilir
    const { data: c, error: ce } = await asUser.rpc("use_credits", { n: cost, premium: m.premium });
    if (ce) return json({ ok: false, error: "Kredi düşülemedi: " + ce.message }, 500);
    if (!c?.ok) return json({ ok: false, error: c?.error || "Kredi yetersiz." }, 402);
    const { data: job, error: je } = await admin.from("ai_jobs").insert({ user_id: user.id, model: b.model, duration: d, cost, prompt }).select().single();
    if (je) { return json({ ok: false, error: "İş kaydedilemedi." }, 500); }
    try {
      const r = await fetch(`https://queue.fal.run/${m.endpoint}`, { method: "POST", headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" }, body: JSON.stringify(m.body(prompt + STYLE, img, d)) });
      const q = await r.json();
      if (!r.ok || !q.request_id) throw new Error(q?.detail ? JSON.stringify(q.detail).slice(0, 200) : `fal ${r.status}`);
      await admin.from("ai_jobs").update({ provider_id: q.request_id, status_url: q.status_url, response_url: q.response_url, status: "kuyrukta", updated_at: new Date().toISOString() }).eq("id", job.id);
      return json({ ok: true, id: job.id, kredi: c.kredi, cost });
    } catch (e) {
      await admin.from("ai_jobs").update({ status: "hata", error: String(e).slice(0, 300) }).eq("id", job.id);
      await admin.rpc("ai_refund", { job: job.id });
      return json({ ok: false, error: "Video servisi isteği almadı; kredin iade edildi. Biraz sonra tekrar dene." }, 502);
    }
  }

  if (b.action === "status") {
    const { data: j } = await admin.from("ai_jobs").select("*").eq("id", b.id).eq("user_id", user.id).single();
    if (!j) return json({ ok: false, error: "İş bulunamadı." }, 404);
    if (j.status === "hazir" || j.status === "hata") return json({ ok: true, status: j.status, video: j.video_url, error: j.error, refunded: j.refunded });
    const r = await fetch(j.status_url, { headers: { Authorization: `Key ${FAL}` } }); const s = await r.json();
    if (s.status !== "COMPLETED") {
      const st = s.status === "IN_PROGRESS" ? "uretiliyor" : "kuyrukta";
      if (st !== j.status) await admin.from("ai_jobs").update({ status: st, updated_at: new Date().toISOString() }).eq("id", j.id);
      return json({ ok: true, status: st, queue: s.queue_position ?? null });
    }
    const rr = await fetch(j.response_url, { headers: { Authorization: `Key ${FAL}` } }); const out = await rr.json();
    const url = out?.video?.url;
    if (!rr.ok || !url) {
      const msg = String(out?.detail ? JSON.stringify(out.detail) : s.error || "Üretim başarısız").slice(0, 300);
      await admin.from("ai_jobs").update({ status: "hata", error: msg, updated_at: new Date().toISOString() }).eq("id", j.id);
      await admin.rpc("ai_refund", { job: j.id });
      return json({ ok: true, status: "hata", error: "Video üretilemedi; kredin iade edildi.", refunded: true });
    }
    await admin.from("ai_jobs").update({ status: "hazir", video_url: url, updated_at: new Date().toISOString() }).eq("id", j.id);
    return json({ ok: true, status: "hazir", video: url });
  }
  return json({ ok: false, error: "Bilinmeyen işlem." }, 400);
});
