// Zodiac Web Design — ortak davranışlar
(() => {
  // mobil menü
  const b = document.querySelector('.menu-btn');
  if (b) b.addEventListener('click', () => {
    const o = document.body.classList.toggle('mopen');
    b.setAttribute('aria-expanded', String(o));
  });
  document.querySelectorAll('.mnav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('mopen')));

  // görünür olunca oynayan sessiz videolar
  const red = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const vs = [...document.querySelectorAll('video[data-auto]')];
  if (!red && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else v.pause();
    }), { rootMargin: '120px' });
    vs.forEach(v => io.observe(v));
  }

  // sesli izle düğmeleri
  document.querySelectorAll('[data-snd]').forEach(btn => btn.addEventListener('click', () => {
    const v = btn.closest('.v').querySelector('video');
    document.querySelectorAll('video').forEach(o => { if (o !== v) o.muted = true; });
    v.muted = !v.muted; if (!v.muted) { v.currentTime = 0; v.play(); }
    btn.setAttribute('aria-label', v.muted ? 'Sesi aç' : 'Sesi kapat');
    btn.innerHTML = v.muted ? btn.dataset.off : btn.dataset.on;
  }));

  // işler filtresi
  const fs = document.querySelectorAll('.filters button');
  fs.forEach(f => f.addEventListener('click', () => {
    fs.forEach(x => x.setAttribute('aria-pressed', String(x === f)));
    const k = f.dataset.f;
    document.querySelectorAll('[data-cat]').forEach(s => { s.hidden = !(k === 'all' || s.dataset.cat === k); });
  }));

  // iletişim / erken erişim formu → e-posta uygulaması
  document.querySelectorAll('form[data-mail]').forEach(fm => fm.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(fm), lines = [];
    const ihtiyac = d.getAll('ihtiyac');
    for (const [k, v] of d.entries()) if (k !== 'ihtiyac' && String(v).trim()) lines.push(`${fm.querySelector(`[name="${k}"]`).dataset.l}: ${v}`);
    if (ihtiyac.length) lines.push('İhtiyaç: ' + ihtiyac.join(', '));
    const msg = fm.querySelector('.note');
    if (!String(d.get('ad') || '').trim()) { msg.textContent = 'Adını yazar mısın?'; return; }
    location.href = `mailto:info@zodiacwebdesign.com?subject=${encodeURIComponent(fm.dataset.mail)}&body=${encodeURIComponent(lines.join('\n'))}`;
    msg.textContent = 'E-posta uygulaman açıldı. Göndere basman yeterli.';
  }));
})();
