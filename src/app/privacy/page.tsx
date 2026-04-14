import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow pt-20 pb-24 px-4 md:px-6 max-w-3xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-1.5 text-[11px] text-[#74777f]">
            <li><Link href="/" className="hover:text-[#002147] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="font-bold text-[#002147]">Privacy Policy</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="text-[#44474e] text-sm">Ultimo aggiornamento: 14 aprile 2026</p>
        </header>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
              Titolare del trattamento
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              Il titolare del trattamento dei dati personali e Nuvo S.r.l., con sede legale in Italia, P.IVA 17463031009 (di seguito &quot;Prospettiva.io&quot; o &quot;il Titolare&quot;). Per qualsiasi comunicazione relativa al trattamento dei dati personali, e possibile contattare il Titolare all&apos;indirizzo email: privacy@prospettiva.io.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">2</span>
              Tipologie di dati raccolti
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              Il Titolare raccoglie, direttamente o tramite terze parti, le seguenti categorie di dati personali:
            </p>
            <ul className="list-disc list-inside text-sm text-[#44474e] space-y-2 pl-2">
              <li>Dati identificativi: nome, cognome, codice fiscale</li>
              <li>Dati di contatto: indirizzo email, numero di telefono</li>
              <li>Dati di navigazione: indirizzo IP, tipo di browser, pagine visitate</li>
              <li>Dati di pagamento: elaborati tramite Stripe, il Titolare non memorizza i dati della carta di credito</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">3</span>
              Finalita del trattamento
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              I dati personali degli utenti sono trattati per le seguenti finalita:
            </p>
            <ul className="list-disc list-inside text-sm text-[#44474e] space-y-2 pl-2">
              <li>Erogazione dei servizi richiesti (documenti catastali, visure, planimetrie)</li>
              <li>Gestione degli ordini e dei pagamenti</li>
              <li>Adempimento di obblighi di legge e regolamentari</li>
              <li>Invio di comunicazioni informative e promozionali, previo consenso dell&apos;utente</li>
              <li>Miglioramento dell&apos;esperienza di navigazione e analisi statistiche aggregate</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">4</span>
              Base giuridica del trattamento
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              Il trattamento dei dati personali si fonda sulle seguenti basi giuridiche: esecuzione di un contratto di cui l&apos;utente e parte o di misure precontrattuali adottate su richiesta dello stesso; adempimento di obblighi legali a cui il Titolare e soggetto; consenso espresso dell&apos;utente per le finalita di marketing; legittimo interesse del Titolare per analisi statistiche e miglioramento dei servizi.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">5</span>
              Conservazione dei dati
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              I dati personali sono conservati per il tempo necessario al raggiungimento delle finalita per cui sono stati raccolti, e comunque non oltre i termini previsti dalla normativa vigente. I dati relativi agli ordini sono conservati per 10 anni ai fini fiscali. I dati di navigazione vengono cancellati entro 24 mesi dalla raccolta.
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">6</span>
              Diritti dell&apos;interessato
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              In conformita al GDPR, l&apos;utente ha il diritto di:
            </p>
            <ul className="list-disc list-inside text-sm text-[#44474e] space-y-2 pl-2">
              <li>Accedere ai propri dati personali</li>
              <li>Richiederne la rettifica o la cancellazione</li>
              <li>Limitare od opporsi al trattamento</li>
              <li>Richiedere la portabilita dei dati</li>
              <li>Revocare il consenso in qualsiasi momento</li>
              <li>Proporre reclamo all&apos;autorita di controllo (Garante per la protezione dei dati personali)</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
