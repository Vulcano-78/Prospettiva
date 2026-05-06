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

Fatto oggi nel carrello e in `process-order/route.ts`:
- `ispezione-ipotecaria`: switch Soggetto/Immobile + Conservatoria + (CF/PIVA | comune+tipo_catasto+foglio+particella)
- `ispezione-ipotecaria-nazionale`: solo CF/PIVA
- `elenco-note-ipotecarie` (= "Singola Nota"): switch Soggetto/Immobile + Conservatoria + Anno + Registro Generale + (tipo_restrizione+CF/PIVA | campi immobile)

Routing verso 5 webhook distinti (`/webhook/ispezione-ipotecaria-*`).

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

- I 9 workflow n8n nuovi (4 visura + 5 conservatoria) sono `active: false`: vanno importati e attivati su n8n
- URL webhook visura usa ancora path `-test` in `process-order` → cambiare in produzione
- Endpoint `/api/territorio/conservatorie` non esiste (bug pre-esistente): al momento il campo Conservatoria nel carrello è input testuale come fallback. Va creata l'API quando si individua una fonte dati
- Servizi Minori workflow: ha 3 bug di doppio `=` (`=={{`, `==https://`) da correggere manualmente in n8n
- Process-order: routing visura usa `_searchType` in un solo webhook generico; coi nuovi 4 workflow va aggiornato per puntare ai webhook specifici (ordinaria/storica × immobile/soggetto)
- Test end-to-end del flusso conservatoria nuovo non ancora fatto (browser + ordine reale)
