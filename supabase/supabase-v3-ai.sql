-- ZodMotions — AI video üretimi (v3)
-- Supabase → SQL Editor'a yapıştırıp "Run" de. Bir kez çalıştırman yeterli.

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model text not null,              -- 'std' (MiniMax H3) veya 'pre' (Kling 3.0 Pro)
  duration integer not null,
  cost integer not null,            -- düşülen kredi
  prompt text,
  provider_id text,                 -- fal.ai istek numarası
  status_url text,
  response_url text,
  status text not null default 'kuyrukta',   -- kuyrukta / uretiliyor / hazir / hata
  video_url text,
  error text,
  refunded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ai_jobs_user_idx on public.ai_jobs(user_id, created_at desc);
alter table public.ai_jobs enable row level security;
drop policy if exists "kendi isleri" on public.ai_jobs;
create policy "kendi isleri" on public.ai_jobs for select using (auth.uid() = user_id);
-- yazma sadece sunucu fonksiyonundan (service role); kullanıcı doğrudan ekleyemez/değiştiremez

-- başarısız üretimde krediyi iade et (sadece sunucu çağırabilir)
create or replace function public.ai_refund(job uuid) returns void
language plpgsql security definer set search_path = public as $$
declare j public.ai_jobs;
begin
  select * into j from public.ai_jobs where id = job for update;
  if not found or j.refunded then return; end if;
  update public.profiles set kredi = kredi + j.cost where id = j.user_id;
  update public.ai_jobs set refunded = true, updated_at = now() where id = job;
end $$;
revoke all on function public.ai_refund(uuid) from public, anon, authenticated;
