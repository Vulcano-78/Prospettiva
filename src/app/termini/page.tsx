import Link from 'next/link';

export default function TerminiPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="w-full pt-20 px-8 max-w-[1440px] mx-auto">
        <nav className="mb-4">
          <ol className="flex items-center gap-1.5 text-[11px] text-[#74777f]">
            <li><Link href="/" className="hover:text-[#002147] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="font-bold text-[#002147]">Termini e Condizioni</li>
          </ol>
        </nav>
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-3xl mx-auto w-full">

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Termini e Condizioni
          </h1>
          <p className="text-[#44474e] text-sm">Ultimo aggiornamento: 14 aprile 2026</p>
        </header>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
              Premesse e definizioni
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              I presenti Termini e Condizioni (di seguito &quot;Termini&quot;) regolano l&apos;utilizzo della piattaforma Prospettiva.io, di proprieta di Nuvo S.r.l. con sede in Italia, P.IVA 17463031009 (di seguito &quot;il Fornitore&quot;). L&apos;accesso e l&apos;utilizzo del sito web e dei servizi offerti comportano l&apos;accettazione integrale dei presenti Termini. Per &quot;Utente&quot; si intende qualsiasi persona fisica o giuridica che accede alla piattaforma e/o acquista i servizi offerti.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">2</span>
              Servizi offerti
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              Prospettiva.io offre servizi digitali legati al settore immobiliare e catastale, tra cui:
            </p>
            <ul className="list-disc list-inside text-sm text-[#44474e] space-y-2 pl-2">
              <li>Rilascio di visure catastali aggiornate</li>
              <li>Richiesta di planimetrie catastali</li>
              <li>Verifica di conformita e documenti ipotecari</li>
              <li>Servizi di elaborazione dati e reportistica immobiliare</li>
            </ul>
            <p className="text-sm text-[#44474e] leading-relaxed mt-4">
              I documenti vengono elaborati a partire dai dati ufficiali dell&apos;Agenzia delle Entrate e consegnati via email entro i tempi indicati nella scheda del servizio.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">3</span>
              Ordini e pagamenti
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              L&apos;acquisto dei servizi avviene tramite la piattaforma online. I prezzi sono espressi in Euro e includono l&apos;IVA al 22% ove applicabile. Il pagamento viene elaborato in modo sicuro tramite Stripe. Il Fornitore non memorizza in alcun modo i dati della carta di credito dell&apos;Utente. L&apos;ordine si considera confermato al momento dell&apos;avvenuto pagamento. Il Fornitore si riserva il diritto di modificare i prezzi dei servizi in qualsiasi momento, fermo restando che le modifiche non si applicheranno agli ordini gia confermati.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">4</span>
              Diritto di recesso e rimborsi
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              In conformita al Codice del Consumo (D.Lgs. 206/2005), l&apos;Utente che rivesta la qualifica di consumatore ha diritto di recedere dal contratto entro 14 giorni dalla data dell&apos;ordine, senza dover fornire alcuna motivazione. Tuttavia, ai sensi dell&apos;art. 59 lett. a) del Codice del Consumo, il diritto di recesso e escluso per i servizi gia completamente eseguiti con l&apos;accordo espresso dell&apos;Utente. Per richiedere un rimborso, l&apos;Utente puo contattare il servizio clienti all&apos;indirizzo info@prospettiva.io.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">5</span>
              Responsabilita
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              Il Fornitore si impegna a fornire i servizi con la massima diligenza e professionalita. I documenti forniti riflettono i dati presenti nelle banche dati ufficiali al momento dell&apos;elaborazione. Il Fornitore non e responsabile per eventuali errori o incongruenze presenti nei dati di origine. La responsabilita del Fornitore e in ogni caso limitata all&apos;importo pagato dall&apos;Utente per il singolo servizio oggetto di contestazione.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">6</span>
              Legge applicabile e foro competente
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia derivante dall&apos;interpretazione o dall&apos;esecuzione dei presenti Termini, sara competente il Foro di Roma, salvo il caso in cui l&apos;Utente sia un consumatore, nel qual caso si applica il foro del luogo di residenza o domicilio del consumatore.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
