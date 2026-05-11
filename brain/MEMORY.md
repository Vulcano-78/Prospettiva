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

Layout carrello (definitivo 7 maggio):
- Mode switch in cima, poi grid con conservatoria + comune side-by-side (modalità immobile)
- 3 modalità: **Per Immobile** / **Per Soggetto** / **Sogg. Giuridico**
- CF e P.IVA hanno campi distinti (label/placeholder dedicati)
- NIENTE provincia in modalità immobile: i comuni sono filtrati direttamente dalla conservatoria selezionata via `/api/territorio/conservatorie/{id}`

`ispezione-ipotecaria`: Conservatoria + (Immobile: comune+catasto+foglio+particella+sub | Soggetto: CF | Sogg.Giuridico: P.IVA)
`ispezione-ipotecaria-nazionale`: solo CF/PIVA
`elenco-note-ipotecarie` (= "Singola Nota"): Anno + Tipo Registro (Generale/Particolare) + (Generale: registro_generale | Particolare: registro_particolare + tipo_nota) + Conservatoria + (modalità come sopra)

Routing process-order:
- soggetto / soggetto-giuridico → stesso webhook `*-soggetto`, distinti dal campo `tipo_soggetto: 'fisico' | 'giuridico'` (per ispezione) o `tipo_restrizione: 'soggetto'` con CF/P.IVA che fa la differenza (per singola nota)
- immobile → webhook `*-immobile` con `tipo_restrizione: 'immobile'`
- ConservatoriaSelect manda il NOME (es. "ROMA 1"), non l'id. OpenAPI valida sul nome
- Tutti i campi a OpenAPI: con underscore (`tipo_restrizione`, `tipo_registro`, `cf_piva`, ecc.)

## Infrastruttura

- **Supabase**: `prospettiva-app`, regione `eu-central-1`
- **Vercel**: regione `fra1`
- **DB**: tabella `orders` con RLS, indice su `(user_id, created_at DESC)`
- **Storage**: bucket `documenti` (privato), signed URL
- **Stripe**: PaymentIntent dinamico, prezzo SEMPRE ricalcolato server-side da `services.ts`. Webhook `payment_intent.succeeded` su `/api/stripe-webhook` è la sorgente autoritativa del fulfillment. Logica condivisa in `src/lib/order-fulfillment.ts` (`fulfillOrder` idempotente). Idempotenza via UNIQUE su `orders.stripe_payment_intent_id`

## Decisioni in vigore

- Dashboard come Server Component (`Promise.all` user + orders), client Supabase singleton
- Sidebar dashboard: hover neutro, niente blu
- Un workflow n8n per servizio (eccetto Servizi Minori che restano unificati)
- Lavorare sempre su `main`, niente branch intermedi

## OpenAPI Catasto — vincoli importanti

- `/ipotecarie-dettaglio-nota`: `tipo_restrizione` accetta SOLO `"soggetto"` o `"immobile"` (NON `soggetto_fisico`/`soggetto_giuridico` come dice il PDF). L'API distingue fisico/giuridico automaticamente dal formato CF/P.IVA. Tutti i campi con underscore (`tipo_restrizione`, `tipo_registro`, `registro_generale`, `cf_piva`)
- `/ipotecarie-ispezione_nazionale`: NON genera PDF (`documento: null`). Restituisce dati JSON in `risultato.soggetti[]`. Per ottenere un PDF serve generarlo via `/api/genera-report`
- `/territorio/conservatorie/{id}`: ritorna lista comuni associati alla conservatoria. Risposta: `data` è ARRAY (`data[0].comuni`), non oggetto
- Errore 312 "comune not valid" = comune scelto non rientra nella giurisdizione della conservatoria (validazione corretta lato API). Mitigato lato sito filtrando i comuni mostrati in base alla conservatoria selezionata

## Da fare al lancio (switch test → live)

1. **Stripe Dashboard**: toggle in alto a destra → **Live mode** (esci dal sandbox)
2. **Crea webhook in Live mode**:
   - URL: `https://prospettiva.io/api/stripe-webhook` (NON più `.vercel.app`)
   - Eventi: `payment_intent.succeeded` + `payment_intent.payment_failed`
   - Copia il nuovo `whsec_...` (sarà DIVERSO da quello di test)
3. **Stripe Dashboard → API keys** (in modalità Live): copia `pk_live_...` e `sk_live_...`
4. **Vercel → Settings → Environment Variables (Production)**: sovrascrivi le 3 env:
   - `STRIPE_SECRET_KEY` ← `sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ← `pk_live_...`
   - `STRIPE_WEBHOOK_SECRET` ← nuovo `whsec_...` live
   - Le env Preview/Development restano con le test keys (così i deploy preview continuano a funzionare in sandbox)
5. **Vercel → Deployments**: Redeploy della production (senza Build Cache)
6. **Test live**: fai un acquisto vero con €0,50 di tasca tua per verificare il flusso completo
7. **Dominio**: verifica che `prospettiva.io` sia collegato a Vercel come custom domain prima di tutto questo

## Cose aperte / dubbi

- Workflow ispezione ipotecaria nazionale (PDF via genera-report): testato `risultato.soggetti` con renderer specializzato in `genera-report`, JSON pronto sul Desktop, da attivare/testare in n8n
- Da attivare/testare in n8n: `-soggetto` (per soggetto), `-immobile` (elenco note), `-nazionale`. `-singola-nota-soggetto` ✅ funziona, `-singola-nota-immobile` da testare
- Bundle Compravendita Pro: presente nel listino Excel a €45,90 ma NON ancora in `services.ts`. La CTA del nuovo calcolatore costi compravendita punta provvisoriamente a `/catalogo/documenti-catastali`. Quando si attiva, l'espansione sarà lato server in `/api/process-order` (N webhook).
- `tipo_servizio_label` (mapping slug → label IT) è in `src/lib/tipo-servizio-label.ts`. Viene scritto in `orders.items[i]` come campo JSONB (no schema change) e nel payload webhook al root. n8n può leggerlo dal Webhook trigger (per workflow nuovi) oppure da `items[].tipo_servizio_label` dopo rilettura da Supabase.
- `estratto-mappa` in `process-order` (riga 87) punta ancora a `webhook-test/` invece di `webhook/`
- 4 webhook visura puntano ai path produzione corretti, da verificare/attivare lato n8n
- Servizi Minori: ricordarsi del fix `=` davanti alle espressioni `{{ ... }}` (vedi LOG 2026-05-06 pomeriggio)
