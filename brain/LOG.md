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

## 2026-05-06 (sera) — Bugfix conservatoria + ridisegno layout ipotecaria

- Creato `/api/territorio/conservatorie` (proxy OpenAPI con cache 24h, env `OPENAPI_TOKEN`+`OPENAPI_BASE_URL`) e `src/data/conservatoria-provincia.ts` (mappa statica 130 voci)
- Bug 1 — `ConservatoriaSelect` mandava `c.id` (MongoDB ObjectId) → OpenAPI rispondeva 406 "conservatoria not valid". Fix: `value={c.conservatoria}` (il nome)
- Bug 2 — stale closure in `handleConservatoriaChange`: 3 `onChange` sequenziali con stesso snapshot di `formData`, l'ultima vinceva e azzerava `conservatoria`. Fix iniziale: prop `onConservatoriaChange` con singolo `updateItem` batched
- Bug 3 — default `_mode` mismatch: form mostrava "Per Immobile" ma `_mode` non veniva scritto in `formData` finché l'utente non cliccava il toggle. `process-order` defaultava a 'soggetto' → ordini routati al webhook sbagliato con `cf_piva` vuoto. Fix: default a 'immobile' in `process-order`
- Decisione UX: rimosso auto-set provincia da conservatoria (illudeva che bastasse un comune qualsiasi della provincia mostrata; in realtà una conservatoria copre solo alcuni comuni — es. Bassano del Grappa serve pochi comuni in VI, gli altri vanno a Vicenza). Provincia e comune ora indipendenti
- Ridisegno layout `IspezioneIpotecariaFields` e `SingolaNotaFields` (ispirato a tuttovisure): conservatoria isolata in alto, divider, sotto mode switch + dati. Aggiunta terza modalità **Sogg. Giuridico** accanto a Immobile/Soggetto. Campi CF e P.IVA distinti (label/placeholder dedicati)
- Backend aggiornato: `ispezione-ipotecaria` con `soggetto-giuridico` → webhook soggetto + `tipo_soggetto: 'giuridico'`; `singola-nota` con giuridico → `tipo_restrizione: 'soggetto_giuridico'`
- Errore residuo OpenAPI 312 "comune not valid" è validazione corretta lato API (giurisdizione conservatoria non copre il comune scelto), non bug
- Casino con `git add -A`: ho committato `.claude/worktrees/*` come submoduli + `README 2.md`. Rimossi subito. Aggiunto `.claude/` e `README 2.md` a `.gitignore`
- Commit principali: `0aed16f` (stale closure), `7c447b7` (default mode), `20385e4` (no auto-provincia), `e8b009f` (layout 3-modalità + backend), `b7f96fa` (cleanup gitignore)
- Lezione: mai `git add -A` in questo progetto — i worktree `.claude/` finiscono nel commit. Stagiare sempre file specifici


## 2026-05-07 — Ipotecaria: filtro comuni da conservatoria + decoding API singola nota

- Sessione partita per fix bug provincia non si seleziona in conservatoria → era la stessa stale closure di ieri (`ImmobileFieldsBlock` faceva due `onChange` sequenziali). Fix: prop `onProvinciaChange` atomico
- Decisione UX: rimuovere completamente provincia per ipotecaria. Creato endpoint `/api/territorio/conservatorie/[id]` che proxia OpenAPI e ritorna i comuni della conservatoria. Hook `useComuniConservatoria`. ImmobileFieldsBlock ora popola il dropdown comuni dalla conservatoria scelta. Layout: conservatoria + comune side-by-side
- Ispezione ipotecaria nazionale dava errore 293 "document file missing" → scoperto che l'endpoint NON genera PDF, restituisce JSON in `risultato.soggetti`. Riscritto workflow nazionale per chiamare `/api/genera-report` (come servizi minori), con renderer specializzato `ispezione_ipotecaria_nazionale` aggiunto a `genera-report/route.ts` (header soggetto + tabella conservatorie con trascrizioni/iscrizioni/annotazioni)
- Singola nota: aggiunto al form `tipo_registro` (Generale/Particolare) + `tipo_nota` select (6 opzioni: trascrizioni, iscrizioni, annotazioni, privilegi_agrari/speciali/minerali). process-order manda i campi giusti
- ODISSEA `tipo_restrizione`: speso ~3 ore tra interpretazioni del PDF. Risolto solo con curl diretto a sandbox: l'API `/ipotecarie-dettaglio-nota` accetta SOLO `tipo_restrizione: "soggetto"` o `"immobile"` (NIENTE `_fisico`/`_giuridico`!). Il PDF è fuorviante. La distinzione fisico/giuridico la fa OpenAPI dal formato CF/P.IVA. Tutti i campi richiedono underscore. Risposta API restituisce `soggetto_fisico`/`soggetto_giuridico` come dato derivato
- Lezione: prima di girare in tondo a interpretare error message ambigui, fare un curl diretto all'API per scoprire i valori validi. Il sandbox è la fonte autoritativa
- Workflow JSON aggiornati sul Desktop: nazionale, singola-nota-soggetto, singola-nota-immobile. Body template diretto (no Code node, no IIFE che n8n non valutava bene)
- Test confermato: singola nota soggetto registro generale ✅ funziona. Da testare: nazionale, immobile, particolare
- Commit principali: `0c4f91e` (stale closure), `4691a6f` (filtro comuni da conservatoria), `6974164` (fix data array + layout), `bc28b4f` (renderer nazionale in genera-report), `2e15a7b` (singola nota: tipo_registro+tipo_nota), `b05e7bc` (tipo_restrizione = soggetto/immobile, fine odissea)

## 2026-05-11 — Allineamento prezzi home + nuovo calcolatore compravendita
- Home (`src/app/page.tsx`): allineati i prezzi mostrati alle pagine di catalogo / Excel listino. Visura €9.90→€5.90, Visura storica €12.90→€8.90, Ispezione Ipotecaria (soggetto) €19.90→€29.90, Ispezione Ipotecaria Nazionale €12.90→€36.90.
- Visura Catastale: rimosso "(ordinari o storici)" dalla description in `services.ts`.
- Nuovo tool gratuito: `/utility/calcolatore-costi-compravendita`. Calcola imposte (registro, ipo, cat), IVA quando venditore=impresa, range notaio €2k–€3.5k, totale accessori. Categorie lusso (A/1, A/8, A/9) non beneficiano dell'agevolazione prima casa.
- File nuovi: `src/lib/calcoli/costi-compravendita.ts` (logica pura, 5 test case in commento), `src/components/tools/CostiCompravenditaCalculator.tsx` (client), `src/app/utility/calcolatore-costi-compravendita/page.tsx` (server + JSON-LD WebApplication).
- Aggiunto al catalogo `strumenti-gratuiti` in `services.ts`. CTA visura nel calcolatore = addItem('visura-catastale') + /carrello (no route `/prodotti/` esistente).
- Bundle Compravendita Pro non esiste ancora in `services.ts` → CTA finale punta a `/catalogo/documenti-catastali`. Da creare quando ci sarà il prodotto bundle.
- Tracking: `window.dataLayer.push` (GTM-ready), eventi `calcolo_completato`, `click_cta_visura`, `click_cta_bundle`.
- Niente modifiche a Supabase: tool client-side puro.

## 2026-05-11 — Email refactor n8n: tipo_servizio_label persistente
- Estratto `buildTipoServizioLabel` in `src/lib/tipo-servizio-label.ts`. Mapping completo dei 14 servizi del listino + 2 extra (planimetria, elenco-immobili). Tiene conto di `_searchType`/`_mode` per le varianti immobile/soggetto/giuridico.
- `/api/process-order` ora arricchisce ogni item di `items[]` con `tipo_servizio_label` PRIMA di INSERT su `orders`. Così quando n8n rilegge da Supabase post-PDF, ogni item porta la sua label. Multi-servizio safe: niente colonna a livello riga, label dentro JSONB.
- Webhook payload invariato (continua a portare `tipo_servizio_label` al root).
- Bundle: non implementati. Quando arriveranno → espansione lato server in `/api/process-order` (un webhook per servizio nel bundle).
- Niente backfill: gli ordini esistenti sono di test, vanno via al lancio.
