-- Estende public.profiles con i campi fiscali / di profilo che oggi vivono
-- solo in auth.users.raw_user_meta_data. Da eseguire UNA TANTUM nel SQL editor
-- di Supabase. Idempotente.

-- 1. Aggiunge le colonne mancanti
alter table public.profiles
  add column if not exists ragione_sociale text,
  add column if not exists partita_iva text,
  add column if not exists codice_fiscale text,
  add column if not exists ruolo text,
  add column if not exists codice_sdi text,
  add column if not exists pec text,
  add column if not exists indirizzo text,
  add column if not exists citta text,
  add column if not exists cap text,
  add column if not exists provincia text,
  add column if not exists accept_marketing boolean default false;

-- 2. Indici per le ricerche più probabili (admin/fattura)
create index if not exists profiles_partita_iva_idx
  on public.profiles (partita_iva)
  where partita_iva is not null;
create index if not exists profiles_codice_fiscale_idx
  on public.profiles (codice_fiscale)
  where codice_fiscale is not null;

-- 3. Aggiorna il trigger per copiare anche i nuovi campi al signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into profiles (
    id, nome, cognome, account_type,
    ragione_sociale, partita_iva, codice_fiscale,
    ruolo, codice_sdi, pec,
    indirizzo, citta, cap, provincia,
    accept_marketing
  )
  values (
    new.id,
    new.raw_user_meta_data->>'nome',
    new.raw_user_meta_data->>'cognome',
    new.raw_user_meta_data->>'account_type',
    new.raw_user_meta_data->>'ragione_sociale',
    new.raw_user_meta_data->>'partita_iva',
    new.raw_user_meta_data->>'codice_fiscale',
    new.raw_user_meta_data->>'ruolo',
    new.raw_user_meta_data->>'codice_sdi',
    new.raw_user_meta_data->>'pec',
    new.raw_user_meta_data->>'indirizzo',
    new.raw_user_meta_data->>'citta',
    new.raw_user_meta_data->>'cap',
    new.raw_user_meta_data->>'provincia',
    coalesce((new.raw_user_meta_data->>'marketing')::boolean, false)
  );
  return new;
end;
$function$;

-- 4. Backfill utenti esistenti (riempie solo i campi NULL,
-- non sovrascrive eventuali valori già presenti)
update public.profiles p
set
  ragione_sociale  = coalesce(p.ragione_sociale,  u.raw_user_meta_data->>'ragione_sociale'),
  partita_iva      = coalesce(p.partita_iva,      u.raw_user_meta_data->>'partita_iva'),
  codice_fiscale   = coalesce(p.codice_fiscale,   u.raw_user_meta_data->>'codice_fiscale'),
  ruolo            = coalesce(p.ruolo,            u.raw_user_meta_data->>'ruolo'),
  codice_sdi       = coalesce(p.codice_sdi,       u.raw_user_meta_data->>'codice_sdi'),
  pec              = coalesce(p.pec,              u.raw_user_meta_data->>'pec'),
  indirizzo        = coalesce(p.indirizzo,        u.raw_user_meta_data->>'indirizzo'),
  citta            = coalesce(p.citta,            u.raw_user_meta_data->>'citta'),
  cap              = coalesce(p.cap,              u.raw_user_meta_data->>'cap'),
  provincia        = coalesce(p.provincia,        u.raw_user_meta_data->>'provincia'),
  accept_marketing = coalesce(p.accept_marketing, (u.raw_user_meta_data->>'marketing')::boolean, false)
from auth.users u
where p.id = u.id;
