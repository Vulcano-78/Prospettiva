-- Tabella conti economici (utility free Vaniglia)
-- Da eseguire nel SQL editor di Supabase

create table if not exists public.conti_economici (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titolo text not null default 'Conto Economico',
  regime text not null check (regime in ('persona_fisica', 'societa')),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conti_economici_user_created_idx
  on public.conti_economici (user_id, created_at desc);

alter table public.conti_economici enable row level security;

create policy "ce_select_own" on public.conti_economici
  for select using (auth.uid() = user_id);

create policy "ce_insert_own" on public.conti_economici
  for insert with check (auth.uid() = user_id);

create policy "ce_update_own" on public.conti_economici
  for update using (auth.uid() = user_id);

create policy "ce_delete_own" on public.conti_economici
  for delete using (auth.uid() = user_id);
