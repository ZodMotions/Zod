// ZodMotions stok görsel araması — Pexels (ücretsiz, kart gerekmez).
// Anahtar (PEXELS_KEY) sadece Supabase gizli ayarlarında durur; tarayıcıya hiç gitmez.
// İstek: POST { action:'ara', q, sayfa, yon:'portrait'|'landscape'|'square'|'' }  →  { ok, fotolar:[...], devam }
//        POST { action:'indir', url }  →  görselin kendisi (yalnızca images.pexels.com)
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ ok: false, error: "Yalnızca POST." }, 405);
  const KEY = Deno.env.get("PEXELS_KEY") || Deno.env.get("pexels_key");
  if (!KEY) return json({ ok: false, error: "Stok görsel araması henüz ayarlanmadı." }, 503);
  const URL_ = Deno.env.get("SUPABASE_URL")!, ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  const asUser = createClient(URL_, ANON, { global: { headers: { Authorization: req.headers.get("Authorization") || "" } } });
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return json({ ok: false, error: "Stok görsel aramak için giriş yap." }, 401);

  let b: any; try { b = await req.json(); } catch { return json({ ok: false, error: "Geçersiz istek." }, 400); }

  if (b.action === "indir") {
    let u: URL; try { u = new URL(String(b.url)); } catch { return json({ ok: false, error: "Geçersiz adres." }, 400); }
    if (u.protocol !== "https:" || u.hostname !== "images.pexels.com") return json({ ok: false, error: "Bu adres indirilemez." }, 400);
    const r = await fetch(u.toString());
    if (!r.ok) return json({ ok: false, error: "Görsel indirilemedi." }, 502);
    return new Response(r.body, { headers: { ...cors, "Content-Type": r.headers.get("Content-Type") || "image/jpeg", "Cache-Control": "public, max-age=86400" } });
  }

  if (b.action === "ara") {
    const q = String(b.q || "").trim().slice(0, 80);
    const sayfa = Math.max(1, Math.min(50, Number(b.sayfa) || 1));
    const yon = ["portrait", "landscape", "square"].includes(b.yon) ? b.yon : "";
    const u = q
      ? `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=24&page=${sayfa}&locale=tr-TR${yon ? "&orientation=" + yon : ""}`
      : `https://api.pexels.com/v1/curated?per_page=24&page=${sayfa}`;
    const r = await fetch(u, { headers: { Authorization: KEY } });
    if (r.status === 429) return json({ ok: false, error: "Stok arama şu an çok yoğun. Biraz sonra tekrar dene." }, 429);
    if (!r.ok) return json({ ok: false, error: "Stok arama şu an çalışmıyor." }, 502);
    const d = await r.json();
    const fotolar = (d.photos || []).map((p: any) => ({
      id: p.id, w: p.width, h: p.height, renk: p.avg_color, alt: p.alt || "",
      kucuk: p.src?.medium, buyuk: p.src?.large2x || p.src?.original, dikey: p.src?.portrait,
      kim: p.photographer, kimLink: p.photographer_url, link: p.url,
    }));
    return json({ ok: true, fotolar, devam: !!d.next_page });
  }
  return json({ ok: false, error: "Bilinmeyen işlem." }, 400);
});
