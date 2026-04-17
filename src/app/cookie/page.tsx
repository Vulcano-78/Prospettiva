import Link from 'next/link';

export default function CookiePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="w-full pt-20 px-8 max-w-[1440px] mx-auto">
        <nav className="mb-4">
          <ol className="flex items-center gap-1.5 text-[11px] text-[#74777f]">
            <li><Link href="/" className="hover:text-[#002147] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="font-bold text-[#002147]">Cookie Policy</li>
          </ol>
        </nav>
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-3xl mx-auto w-full">

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Cookie Policy
          </h1>
          <p className="text-[#44474e] text-sm">Ultimo aggiornamento: 14 aprile 2026</p>
        </header>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
              Cosa sono i cookie
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell&apos;utente quando visita un sito web. Sono ampiamente utilizzati per far funzionare i siti web in modo piu efficiente, nonche per fornire informazioni ai proprietari del sito. I cookie possono essere &quot;persistenti&quot; o &quot;di sessione&quot;: i primi rimangono sul dispositivo fino alla loro scadenza o cancellazione, i secondi vengono eliminati alla chiusura del browser.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">2</span>
              Cookie utilizzati da Prospettiva.io
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              Il nostro sito utilizza le seguenti tipologie di cookie:
            </p>

            <div className="space-y-4">
              <div className="bg-[#f8f9fa] rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#002147] mb-1">Cookie tecnici (necessari)</h3>
                <p className="text-sm text-[#44474e]">
                  Indispensabili per il funzionamento del sito. Includono cookie di sessione, preferenze di navigazione e gestione del carrello. Non richiedono il consenso dell&apos;utente.
                </p>
              </div>

              <div className="bg-[#f8f9fa] rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#002147] mb-1">Cookie analitici</h3>
                <p className="text-sm text-[#44474e]">
                  Utilizzati per raccogliere informazioni in forma aggregata sul numero di utenti e su come visitano il sito. Ci aiutano a migliorare le prestazioni e l&apos;esperienza di navigazione.
                </p>
              </div>

              <div className="bg-[#f8f9fa] rounded-xl p-4">
                <h3 className="text-sm font-bold text-[#002147] mb-1">Cookie di terze parti</h3>
                <p className="text-sm text-[#44474e]">
                  Il sito utilizza servizi di terze parti (come Stripe per i pagamenti) che possono installare propri cookie. Il Titolare non ha controllo diretto su questi cookie; si invita l&apos;utente a consultare le rispettive informative.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">3</span>
              Come gestire i cookie
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              L&apos;utente puo gestire le preferenze relative ai cookie direttamente dal proprio browser. Di seguito le istruzioni per i browser piu comuni:
            </p>
            <ul className="list-disc list-inside text-sm text-[#44474e] space-y-2 pl-2">
              <li>Google Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>
              <li>Mozilla Firefox: Impostazioni → Privacy e sicurezza → Cookie e dati dei siti web</li>
              <li>Safari: Preferenze → Privacy → Gestisci dati dei siti web</li>
              <li>Microsoft Edge: Impostazioni → Cookie e autorizzazioni del sito</li>
            </ul>
            <p className="text-sm text-[#44474e] leading-relaxed mt-4">
              La disabilitazione dei cookie tecnici potrebbe compromettere il funzionamento di alcune sezioni del sito.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">4</span>
              Aggiornamenti alla Cookie Policy
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed">
              La presente Cookie Policy puo essere soggetta a modifiche. Eventuali aggiornamenti saranno pubblicati su questa pagina con indicazione della data di ultimo aggiornamento. Si consiglia di consultare periodicamente questa sezione per restare informati su come utilizziamo i cookie.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
