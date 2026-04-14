import Link from 'next/link';

export default function GdprPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow pt-20 pb-24 px-4 md:px-6 max-w-3xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-1.5 text-[11px] text-[#74777f]">
            <li><Link href="/" className="hover:text-[#002147] transition-colors">Home</Link></li>
            <li>/</li>
            <li className="font-bold text-[#002147]">GDPR</li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Informativa GDPR
          </h1>
          <p className="text-[#44474e] text-sm">Regolamento (UE) 2016/679 — Ultimo aggiornamento: 14 aprile 2026</p>
        </header>

        <div className="space-y-8">
          {/* Intro */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <span className="material-symbols-outlined text-[#4463ee] text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              <div>
                <h2 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Il tuo diritto alla protezione dei dati
                </h2>
                <p className="text-sm text-[#44474e] mt-1 leading-relaxed">
                  Prospettiva.io si impegna a garantire la protezione dei dati personali dei propri utenti in conformita al Regolamento Generale sulla Protezione dei Dati (GDPR). Questa pagina descrive come esercitiamo i principi del GDPR e come puoi far valere i tuoi diritti.
                </p>
              </div>
            </div>
          </section>

          {/* Section 1 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
              Principi del trattamento
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              In ottemperanza all&apos;art. 5 del GDPR, i dati personali sono trattati nel rispetto dei seguenti principi:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { icon: 'check_circle', title: 'Liceita e trasparenza', desc: 'I dati sono trattati in modo lecito, corretto e trasparente nei confronti dell\'interessato.' },
                { icon: 'filter_list', title: 'Limitazione delle finalita', desc: 'I dati sono raccolti per finalita determinate, esplicite e legittime.' },
                { icon: 'compress', title: 'Minimizzazione', desc: 'Raccogliamo solo i dati strettamente necessari alle finalita del trattamento.' },
                { icon: 'verified', title: 'Esattezza', desc: 'I dati sono mantenuti aggiornati e rettificati tempestivamente se inesatti.' },
                { icon: 'timer', title: 'Limitazione della conservazione', desc: 'I dati sono conservati solo per il tempo necessario alle finalita dichiarate.' },
                { icon: 'lock', title: 'Integrita e riservatezza', desc: 'I dati sono protetti con misure tecniche e organizzative adeguate.' },
              ].map((item) => (
                <div key={item.title} className="bg-[#f8f9fa] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-base text-[#4463ee]">{item.icon}</span>
                    <h3 className="text-sm font-bold text-[#002147]">{item.title}</h3>
                  </div>
                  <p className="text-xs text-[#44474e] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">2</span>
              I tuoi diritti
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              Ai sensi degli articoli 15-22 del GDPR, in qualita di interessato hai i seguenti diritti:
            </p>
            <ul className="space-y-3">
              {[
                { right: 'Diritto di accesso (art. 15)', desc: 'Ottenere conferma dell\'esistenza di un trattamento e accedere ai propri dati personali.' },
                { right: 'Diritto di rettifica (art. 16)', desc: 'Ottenere la correzione dei dati personali inesatti o l\'integrazione di quelli incompleti.' },
                { right: 'Diritto alla cancellazione (art. 17)', desc: 'Ottenere la cancellazione dei propri dati personali nei casi previsti dal regolamento.' },
                { right: 'Diritto alla limitazione (art. 18)', desc: 'Ottenere la limitazione del trattamento quando ricorrono determinate condizioni.' },
                { right: 'Diritto alla portabilita (art. 20)', desc: 'Ricevere i propri dati in un formato strutturato, di uso comune e leggibile da dispositivo automatico.' },
                { right: 'Diritto di opposizione (art. 21)', desc: 'Opporsi al trattamento dei propri dati personali per motivi legittimi.' },
              ].map((item) => (
                <li key={item.right} className="flex items-start gap-3 text-sm">
                  <span className="material-symbols-outlined text-green-600 text-base mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <span className="font-bold text-[#002147]">{item.right}</span>
                    <p className="text-[#44474e] mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">3</span>
              Misure di sicurezza
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              Adottiamo misure tecniche e organizzative appropriate per garantire un livello di sicurezza adeguato al rischio, tra cui:
            </p>
            <ul className="list-disc list-inside text-sm text-[#44474e] space-y-2 pl-2">
              <li>Crittografia SSL/TLS per tutte le comunicazioni</li>
              <li>Elaborazione dei pagamenti tramite Stripe (certificato PCI-DSS Level 1)</li>
              <li>Accesso ai dati limitato al personale autorizzato</li>
              <li>Backup regolari e procedure di disaster recovery</li>
              <li>Monitoraggio continuo delle vulnerabilita</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">4</span>
              Contatti e reclami
            </h2>
            <p className="text-sm text-[#44474e] leading-relaxed mb-4">
              Per esercitare i tuoi diritti o per qualsiasi richiesta relativa al trattamento dei dati personali, puoi contattarci:
            </p>
            <div className="bg-[#f8f9fa] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#44474e]">
                <span className="material-symbols-outlined text-base text-[#002147]">mail</span>
                <span>privacy@prospettiva.io</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#44474e]">
                <span className="material-symbols-outlined text-base text-[#002147]">business</span>
                <span>Nuvo S.r.l. — P.IVA 17463031009</span>
              </div>
            </div>
            <p className="text-sm text-[#44474e] leading-relaxed mt-4">
              Hai inoltre il diritto di proporre reclamo all&apos;autorita di controllo competente: Garante per la protezione dei dati personali (www.garanteprivacy.it).
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
