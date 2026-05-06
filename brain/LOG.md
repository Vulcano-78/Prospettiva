# LOG

## 2026-05-05 — Ottimizzazione performance Supabase + refactor dashboard

- Diagnosticata la lentezza: Vercel girava su `iad1` (Washington) mentre Supabase è su `eu-central-1` (Frankfurt) → ~100ms RTT extra per ogni chiamata
- Spostata la Function Region di Vercel su `fra1` (Frankfurt)
- Aggiunto indice su `orders(user_id, created_at DESC)` in Supabase — mancava completamente
- Refactor `dashboard/page.tsx`: da Client Component con 2 round-trip sequenziali a Server Component con `Promise.all` (user + orders in parallelo)
- Creato `dashboard/dashboard-client.tsx` per la parte interattiva (filtri, edit profilo, download, delete)
- Browser client Supabase reso singleton in `lib/supabase/client.ts`
- Rimosso bordo blu (`border-[#4463ee]`) dalla sidebar dashboard, hover reso neutro (`bg-white/60`)
- Tutto pushato su `main` (commit `6de350e`, `7d0f26b`)

## 2026-05-06 — Riorganizzazione n8n + allineamento conservatoria sito↔workflow

- Confronto OpenAPI.it ↔ servizi attuali: identificati 5 nuovi servizi candidati (ispezione ipotecaria nazionale, visura protesti persona, DURC, quotazioni immobiliari, compravendite)
- Decisione: in n8n un workflow per servizio (eccetto Servizi Minori che restano unificati)
- Creati 4 JSON visura catastale sul Desktop: ordinaria/storica × immobile/soggetto, webhook path dedicati
- Letta documentazione Catasto OpenAPI per la sezione "VISURA IPOTECARIA" (pp. 57-72): individuati gli endpoint `/ipotecarie-ispezione_nazionale`, `/ipotecarie-elenco-note`, `/ipotecarie-dettaglio-nota`, polling su `/ipotecarie/{id}`, documento su `/ipotecarie/{id}/documento`
- Creati 5 JSON conservatoria sul Desktop (cartella `json n8n NUOVI/`):
  - Nazionale, Soggetto, Immobile (elenco note), Singola Nota Soggetto, Singola Nota Immobile
- Tutti i 9 nuovi JSON usano lo stesso pattern Webhook→Crea→Poll→PDF→Storage→Supabase→Merge→Gmail. `active: false`, da importare/attivare manualmente in n8n
- Aggiornato sito per allineare la conservatoria ai 5 nuovi workflow:
  - `src/app/carrello/page.tsx`: nuovi componenti `IspezioneIpotecariaFields` (sogg/imm) e `SingolaNotaFields` (sogg/imm + anno + registro_generale + tipo_restrizione). Estratti helper `useConservatorie`, `ModeSwitch`, `ImmobileFieldsBlock`. `ConservatoriaSelect` con fallback a input testuale
  - `src/app/api/process-order/route.ts`: routing su 5 webhook (`ispezione-ipotecaria-nazionale`, `-soggetto`, `-immobile`, `-singola-nota-soggetto`, `-singola-nota-immobile`); rimosso vecchio handler unico `/webhook/elenco-note-ipotecarie`
- Scoperto: endpoint `/api/territorio/conservatorie` non esiste (bug pre-esistente, dead fetch nel cart). Per ora fallback a text input
- Scoperto: `Servizi minori` workflow ha 3 bug di doppio `=` segnalati da correggere manualmente in n8n
- Typecheck OK. Niente push, niente test browser


## 2026-05-06 (pomeriggio) — Test end-to-end workflow n8n

- Attivati e testati workflow n8n nuovi in sandbox
- Visura catastale soggetto ordinaria: funzionante end-to-end dopo aver attivato workflow
- Elaborato planimetrico: bloccato per credito sandbox insufficiente (wallet 4.4 < costo 6.9) → ricarica wallet sandbox OpenAPI.it
- Servizi minori: bug nei nodi "Update a row" e "HTTP Request Storage" — i campi avevano {{ ... }} ma senza = iniziale. n8n li trattava come stringa letterale, non espressione → 0 righe trovate → workflow si fermava silenziosamente. Fix: aggiungere = davanti alle espressioni {{ }} nei campi interessati
- Causa "Succeeded senza email": Update a row trova 0 righe → n8n ferma esecuzione, Merge non riceve input, Send a message non parte. Nessun errore esplicito
- Lezione: in n8n, campo con {{ }} senza = davanti = stringa letterale, non espressione. Sempre verificare che i campi dinamici abbiano = iniziale
