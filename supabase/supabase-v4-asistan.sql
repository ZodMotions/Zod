-- ZodMotions Asistan — günlük mesaj sayacı.
-- Supabase → SQL Editor → bunu yapıştır → "Run".

create table if not exists public.asistan_kullanim (
  user_id uuid not null references auth.users on delete cascade,
  gun     date not null,
  n       integer not null default 0,
  primary key (user_id, gun)
);

alter table public.asistan_kullanim enable row level security;

-- Kullanıcı sadece kendi sayacını görebilir; yazma yalnızca sunucu fonksiyonundan (service role) yapılır.
drop policy if exists "kendi sayaci" on public.asistan_kullanim;
create policy "kendi sayaci" on public.asistan_kullanim for select using (auth.uid() = user_id);
