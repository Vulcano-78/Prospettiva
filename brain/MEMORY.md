# Prospettiva — Stato attuale

## Cos'è

Prospettiva è un'app web che permette a privati, professionisti e imprese di ordinare documenti catastali e ipotecari (visure, planimetrie, estratti mappa, ispezioni ipotecarie, ecc.) online. L'utente sceglie il documento, compila i dati, paga, e riceve il PDF via email e nella dashboard.

Stack: Next.js 16, Supabase (auth + DB + Storage), Stripe (pagamenti), n8n (automazione workflow), Vercel (hosting).

## Stato del codice

Il flusso end-to-end funziona:
- Auth completa: registrazione (privato / professionista / impresa), login, auto-login post-registrazione
- Header con nome utente e dropdown Dashboard / Esci
- Checkout con prefill, guest checkout con `pendingOrderAfterAuth`
- `/api/process-order`: inserisce in `orders`, poi spara webhook a n8n tramite `after()` di Next.js 16
- Workflow n8n attivi: visura catastale (webhook → API → poll → PDF → Storage → email)
- Dashboard: tab Documenti / Dati Personali, signed URL, cestino, edit profilo

## n8n — riorganizzazione in corso

Direzione: un workflow per servizio (in passato erano 3 file ma 5 servizi visura, ora separati). Servizi minori restano in unico workflow.

JSON pronti sul Desktop in `json n8n NUOVI/` (ancora da importare/attivare):
- 4 visura catastale: ordinaria/storica × immobile/soggetto
- 5 conservatoria (ispezione ipotecaria):
  - Nazionale (`/ipotecarie-ispezione_nazionale`, solo `cf_piva`)
  - Per Soggetto (`/ipotecarie-elenco-note`, `entita=ispezione_soggetto`)
  - Per Immobile (`/ipotecarie-elenco-note`, `entita=ispezione_immobile`)
  - Singola Nota Soggetto (`/ipotecarie-dettaglio-nota`, `tipo_registro=generale`)
  - Singola Nota Immobile (`/ipotecarie-dettaglio-nota`, `tipo_restrizione=immobile`)

Tutti seguono il pattern: Webhook → Crea → Poll(If/Wait) → Scarica PDF → If(user_id) → Storage → Supabase update → Merge → Gmail.

## Allineamento sito ↔ n8n (conservatoria)

Layout carrello (definitivo dopo iterazioni 6 maggio sera):
- Conservatoria isolata in alto, divider visivo, sotto mode switch + dati
- 3 modalità: **Per Immobile** / **Per Soggetto** / **Sogg. Giuridico**
- CF e P.IVA hanno campi distinti (label/placeholder dedicati)
- Provincia e comune indipendenti dalla conservatoria (l'auto-set illudeva: una conservatoria copre solo certi comuni della sua provincia)

`ispezione-ipotecaria`: Conservatoria + (Immobile: prov+com+catasto+foglio+particella+sub | Soggetto: CF | Sogg.Giuridico: P.IVA)
`ispezione-ipotecaria-nazionale`: solo CF/PIVA
`elenco-note-ipotecarie` (= "Singola Nota"): Conservatoria + Anno + Registro Generale + (modalità come sopra)

Routing process-order:
- soggetto / soggetto-giuridico → stesso webhook `*-soggetto`, distinti dal campo `tipo_soggetto: 'fisico' | 'giuridico'` (per ispezione) o `tipo_restrizione: 'soggetto_fisico' | 'soggetto_giuridico'` (per singola nota)
- immobile → webhook `*-immobile`
- ConservatoriaSelect manda il NOME (es. "ROMA 1"), non l'id. OpenAPI valida sul nome

## Infrastruttura

- **Supabase**: `prospettiva-app`, regione `eu-central-1`
- **Vercel**: regione `fra1`
- **DB**: tabella `orders` con RLS, indice su `(user_id, created_at DESC)`
- **Storage**: bucket `documenti` (privato), signed URL

## Decisioni in vigore

- Dashboard come Server Component (`Promise.all` user + orders), client Supabase singleton
- Sidebar dashboard: hover neutro, niente blu
- Un workflow n8n per servizio (eccetto Servizi Minori che restano unificati)
- Lavorare sempre su `main`, niente branch intermedi

## Cose aperte / dubbi

- Workflow `ispezione-ipotecaria-immobile` testato OK con dati validi. Da attivare/testare gli altri 4 ipotecari: `-soggetto`, `-nazionale`, `-singola-nota-soggetto`, `-singola-nota-immobile`
- Workflow `ispezione-ipotecaria-soggetto` deve leggere il nuovo campo `tipo_soggetto: 'fisico' | 'giuridico'` per scegliere endpoint OpenAPI giusto (CF vs P.IVA)
- `estratto-mappa` in `process-order` (riga 87) punta ancora a `webhook-test/` invece di `webhook/`
- 4 webhook visura puntano ai path produzione corretti, da verificare/attivare lato n8n
- Servizi Minori: ricordarsi del fix `=` davanti alle espressioni `{{ ... }}` (vedi LOG 2026-05-06 pomeriggio)
- UX possibile per ipotecaria: filtrare i comuni in base alla giurisdizione effettiva della conservatoria (mappa conservatoria→comuni). Per ora utente sceglie liberamente, OpenAPI valida con errore 312 se mismatch
