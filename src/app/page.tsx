'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { services } from '@/data/services';
import SuggestionForm from '@/components/SuggestionForm';
import NotifyMeInline from '@/components/NotifyMeInline';
import HeaderLab from '@/components/HeaderLab';
import ServiceDetailSheet from '@/components/ServiceDetailSheet';

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [detailSlug, setDetailSlug] = useState<string | null>(null);
  const detailService = detailSlug ? services.find(x => x.slug === detailSlug) ?? null : null;

  const handleAddToCart = (slug: string) => {
    const s = services.find(x => x.slug === slug);
    if (s) addItem(s);
  };
  const handleBuyNow = (slug: string) => {
    handleAddToCart(slug);
    router.push('/carrello');
  };
  const handleShowDetails = (slug: string) => setDetailSlug(slug);
  const rail = 'absolute top-0 bottom-0 w-px bg-slate-200/80 pointer-events-none';
  const hline = 'absolute left-0 right-0 h-px bg-slate-200/80 pointer-events-none';

  return (
    <>
      <HeaderLab />
      <main className="bg-white text-[#002147]">
      {/* ===========================================================
          HERO con cornice a griglia (stile Stripe, interpretato)
          pt include l'altezza dell'header fisso (72px).
      =========================================================== */}
      <section className="relative pt-32 md:pt-40 pb-20 md:pb-28">
        {/* Rails verticali — su desktop appaiono come margini laterali della pagina */}
        <div className={rail} style={{ left: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />
        <div className={rail} style={{ right: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />

        {/* Linea orizzontale sotto l'hero */}
        <div className={hline} style={{ bottom: 0 }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-7">
            {/* Eyebrow tecnico — etichetta in font mono come marker della griglia */}
            <div className="flex items-center gap-3 mb-6 text-[0.625rem] font-mono uppercase tracking-[0.2em] text-slate-500">
              <span className="w-6 h-px bg-[#4463EE]" />
              Catasto · Conservatoria · Urbanistica
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl mb-6 leading-[1.05] font-headline">
              <span className="text-[#002147]">L&apos;immobiliare,</span>
              <br />
              <span className="text-[#4463EE]">senza burocrazia.</span>
            </h1>
            <p className="text-on-surface-variant text-base md:text-xl mb-10 max-w-xl">
              Documenti ufficiali, verifiche ipotecarie e strumenti AI. Tutto automatizzato, tutto in un posto solo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#catalog"
                className="bg-[#4463EE] text-white px-6 py-3 text-base font-medium hover:brightness-110 transition flex items-center justify-center"
                style={{ borderRadius: '5px' }}
              >
                Esplora i servizi <span className="ml-2">→</span>
              </Link>
              <Link
                href="/registrazione"
                className="bg-white border border-slate-300 text-[#002147] px-6 py-3 text-base font-medium hover:bg-slate-50 transition text-center"
                style={{ borderRadius: '5px' }}
              >
                Crea account
              </Link>
            </div>
          </div>

          {/* Lato destro — "scheda pratica" tecnica, integrata nella griglia.
              Nessuna chrome di finestra, nessun effetto vetro. Sembra un
              estratto di documento, in linea con le linee della pagina. */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="border border-slate-300/80 bg-white">
              {/* Intestazione tipo "scheda" */}
              <div className="px-6 py-4 border-b border-slate-300/80 flex items-baseline justify-between">
                <div className="flex flex-col">
                  <span className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400">
                    Scheda pratica
                  </span>
                  <span className="text-sm font-headline text-[#002147] mt-0.5">
                    Nº 2847 · Milano, Via Brera 14
                  </span>
                </div>
                <span className="flex items-center gap-1.5 text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-[#4463EE]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4463EE] animate-pulse" />
                  live
                </span>
              </div>

              {/* Corpo — tabella senza decorazioni superflue */}
              <div className="px-6 py-5">
                <table className="w-full text-[0.8125rem]">
                  <thead>
                    <tr className="text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-slate-400 border-b border-slate-200">
                      <th className="text-left py-2 font-medium w-8">#</th>
                      <th className="text-left py-2 font-medium">Servizio</th>
                      <th className="text-left py-2 font-medium">Stato</th>
                      <th className="text-right py-2 font-medium">Tempo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-mono text-[0.625rem] text-slate-400">01</td>
                      <td className="py-3 pr-3 text-[#002147]">Visura Catastale</td>
                      <td className="py-3 text-emerald-600 text-xs">✓ completata</td>
                      <td className="py-3 text-right text-slate-400 font-mono text-xs">2m 14s</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[0.625rem] text-slate-400">02</td>
                      <td className="py-3 pr-3 text-[#002147]">Verifica Ipotecaria</td>
                      <td className="py-3 text-emerald-600 text-xs">✓ completata</td>
                      <td className="py-3 text-right text-slate-400 font-mono text-xs">4m 02s</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[0.625rem] text-slate-400">03</td>
                      <td className="py-3 pr-3 text-[#002147] font-medium">Virtual Staging AI</td>
                      <td className="py-3 text-[#4463EE] text-xs">⟳ in corso…</td>
                      <td className="py-3 text-right text-slate-400 font-mono text-xs">—</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-[0.625rem] text-slate-400">04</td>
                      <td className="py-3 pr-3 text-slate-400">Certificato Urbanistico</td>
                      <td className="py-3 text-slate-400 text-xs">◌ in coda</td>
                      <td className="py-3 text-right text-slate-400 font-mono text-xs">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Piè di scheda — barra di stato segmentata + protocollo */}
              <div className="px-6 py-3 border-t border-slate-300/80 flex justify-between items-center text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="block w-5 h-0.5 bg-emerald-500" />
                    <span className="block w-5 h-0.5 bg-emerald-500" />
                    <span className="block w-5 h-0.5 bg-[#4463EE]" />
                    <span className="block w-5 h-0.5 bg-slate-200" />
                  </span>
                  2 / 4 evase
                </span>
                <span>Prot. 2026/05/13</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          RIPROVA SOCIALE — banda unica con i brand in evidenza.
          Una riga sola: micro-claim sopra, loghi in fila sotto.
      =========================================================== */}
      <section className="relative bg-white border-y border-slate-200/80">
        <div className={rail} style={{ left: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />
        <div className={rail} style={{ right: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 relative">
          <p className="text-center text-[0.6875rem] font-mono uppercase tracking-[0.22em] text-slate-500 mb-8 md:mb-10">
            Fonti ufficiali · Infrastruttura · Pagamenti sicuri
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-10 md:gap-x-14 lg:gap-x-20 gap-y-6 text-slate-600">
            {/* Agenzia delle Entrate */}
            <span className="inline-flex flex-col items-center leading-none">
              <span className="text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-slate-400 mb-1">
                Dati ufficiali
              </span>
              <span className="text-[1.0625rem] font-headline font-bold text-[#002147] tracking-tight">
                Agenzia delle Entrate
              </span>
            </span>

            {/* Conservatoria */}
            <span className="inline-flex flex-col items-center leading-none">
              <span className="text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-slate-400 mb-1">
                Registri
              </span>
              <span className="text-[1.0625rem] font-headline font-bold text-[#002147] tracking-tight">
                Conservatoria
              </span>
            </span>

            {/* Stripe */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brands/stripe.png" alt="Stripe" className="h-8 w-auto" />

            {/* Supabase */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brands/supabase.svg" alt="Supabase" className="h-9 w-auto" />


            {/* Vercel */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brands/vercel.png" alt="Vercel" className="h-6 w-auto" />
          </div>

          <p className="text-center text-[0.75rem] text-slate-500 mt-8 md:mt-10 max-w-2xl mx-auto">
            Documenti rilasciati dagli enti ufficiali. Pagamenti, hosting e dati su infrastruttura europea conforme al GDPR.
          </p>
        </div>
      </section>

      {/* ===========================================================
          CATALOGO — 4 schede servizio, stesso linguaggio dell'hero
      =========================================================== */}
      <section id="catalog" className="relative bg-white">
        <div className={rail} style={{ left: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />
        <div className={rail} style={{ right: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-20 md:pb-28 relative">
          <div className={hline} style={{ bottom: 0 }} />

          {/* Intestazione sezione */}
          <div className="max-w-2xl mb-6 md:mb-8">
            <div className="text-[0.625rem] font-mono uppercase tracking-[0.2em] text-[#4463EE] mb-3">
              03 · Catalogo
            </div>
            <h2 className="text-3xl md:text-4xl font-headline leading-[1.1] text-[#002147] mb-4">
              Scegli il servizio.{' '}
              <span className="text-[#4463EE]">Noi facciamo il resto.</span>
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg">
              Ogni documento che serve per una compravendita, un&apos;istruttoria o una perizia.
              Online, ufficiale, immediato.
            </p>
          </div>

          {/* Griglia 2×2 di schede servizio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 01 Catasto */}
            <CategoryCard
              num="01"
              title="Catasto"
              desc="Visure e planimetrie ufficiali in tempo reale."
              href="/catalogo/documenti-catastali"
              rows={[
                { name: 'Visura Catastale', desc: 'Per immobile o soggetto', price: '€5.90', slug: 'visura-catastale' },
                { name: 'Visura Catastale Storica', desc: 'Tutte le variazioni nel tempo', price: '€8.90', slug: 'visura-catastale-storica' },
              ]}
              onAdd={handleAddToCart}
              onBuy={handleBuyNow}
              onShowDetails={handleShowDetails}
            />

            {/* 02 Conservatoria */}
            <CategoryCard
              num="02"
              title="Conservatoria"
              desc="Analisi gravami e trascrizioni pregiudizievoli."
              href="/catalogo/verifiche-ipotecarie"
              rows={[
                { name: 'Ispezione Ipotecaria', desc: 'Formalità per soggetto o immobile', price: '€29.90', slug: 'ispezione-ipotecaria' },
                { name: 'Ispezione Nazionale', desc: 'Formalità a livello nazionale', price: '€36.90', slug: 'ispezione-ipotecaria-nazionale' },
              ]}
              onAdd={handleAddToCart}
              onBuy={handleBuyNow}
              onShowDetails={handleShowDetails}
            />

            {/* 03 Urbanistica — coming soon */}
            <div className="border border-slate-300/80 bg-white p-6 flex flex-col">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400 mb-1">
                    Categoria 03
                  </div>
                  <h3 className="text-xl font-headline text-[#002147]">Urbanistica</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Conformità e titoli abilitativi comunali.
                  </p>
                </div>
                <span className="text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-[#4463EE] border border-[#4463EE]/30 px-2 py-1">
                  Coming Soon
                </span>
              </div>
              <div className="flex-grow flex flex-col items-start justify-center py-8 border-t border-slate-100">
                <p className="text-sm text-on-surface-variant max-w-md mb-6">
                  Stiamo lavorando ai servizi di urbanistica: accesso agli atti, certificati di
                  destinazione urbanistica e altre pratiche comunali.
                </p>
                <Link
                  href="/coming-soon/urbanistica"
                  className="inline-flex items-center gap-2 text-[#4463EE] text-xs font-bold uppercase tracking-[0.18em] hover:gap-3 transition-all"
                >
                  Avvisami quando disponibile →
                </Link>
              </div>
            </div>

            {/* 04 Utility Gratuite */}
            <div className="border border-slate-300/80 bg-white p-6 flex flex-col">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400 mb-1">
                    Categoria 04
                  </div>
                  <h3 className="text-xl font-headline text-[#002147]">Utility Gratuite</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Strumenti per l&apos;attività quotidiana.
                  </p>
                </div>
                <span className="text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-emerald-600 border border-emerald-600/30 px-2 py-1">
                  Gratis
                </span>
              </div>
              <div className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
                <Link
                  href="/utility/conto-economico"
                  className="flex items-center justify-between py-3 group"
                >
                  <div>
                    <div className="text-sm font-medium text-[#002147]">Conto Economico</div>
                    <div className="text-[0.625rem] font-mono uppercase tracking-[0.18em] text-slate-400 mt-0.5">
                      Costi · Ricavi · ROI
                    </div>
                  </div>
                  <span className="text-[#4463EE] text-xs font-bold uppercase tracking-[0.18em] group-hover:translate-x-0.5 transition-transform">
                    Calcola →
                  </span>
                </Link>
                <Link
                  href="/utility/calcolatore-costi-compravendita"
                  className="flex items-center justify-between py-3 group"
                >
                  <div>
                    <div className="text-sm font-medium text-[#002147]">Costi Compravendita</div>
                    <div className="text-[0.625rem] font-mono uppercase tracking-[0.18em] text-slate-400 mt-0.5">
                      Imposte · IVA · Registro
                    </div>
                  </div>
                  <span className="text-[#4463EE] text-xs font-bold uppercase tracking-[0.18em] group-hover:translate-x-0.5 transition-transform">
                    Calcola →
                  </span>
                </Link>
              </div>
              <div className="pt-4 mt-auto text-center border-t border-slate-100">
                <Link
                  href="/catalogo/utility-gratuite"
                  className="text-[0.625rem] font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-[#4463EE]"
                >
                  Vedi tutte le utility →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          STRUMENTI AI — sezione "altra Prospettiva".
          Rompe la grammatica geometrica del resto della pagina.
          Niente rails, niente bordi. Navy full-bleed + aurora.
      =========================================================== */}
      <section className="relative overflow-hidden bg-[#001229] text-white">
        {/* Aurora — tre blob radiali, lentissimi, fanno da "anima" */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-[20%] -left-[15%] w-[70%] h-[80%] rounded-full blur-3xl opacity-70"
            style={{
              background:
                'radial-gradient(circle at center, rgba(68,99,238,0.55) 0%, rgba(68,99,238,0) 65%)',
            }}
          />
          <div
            className="absolute top-[10%] -right-[20%] w-[75%] h-[90%] rounded-full blur-3xl opacity-60"
            style={{
              background:
                'radial-gradient(circle at center, rgba(167,139,250,0.45) 0%, rgba(167,139,250,0) 65%)',
            }}
          />
          <div
            className="absolute -bottom-[25%] left-[20%] w-[65%] h-[70%] rounded-full blur-3xl opacity-50"
            style={{
              background:
                'radial-gradient(circle at center, rgba(34,211,238,0.40) 0%, rgba(34,211,238,0) 65%)',
            }}
          />
        </div>

        {/* Linea sottilissima in alto per uscire dalla sezione precedente senza cesura brusca */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />

        <div className="relative max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Colonna testo — asimmetrica, niente center */}
          <div className="md:col-span-8">
            <p className="text-[0.6875rem] uppercase tracking-[0.4em] text-white/45 mb-4">
              04 · Strumenti AI
            </p>
            <h2 className="font-headline text-2xl md:text-3xl lg:text-[2.25rem] leading-[1.15] tracking-tight mb-4">
              <span className="text-white/85">Dove finisce la burocrazia, </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(110deg, #C7D2FE 0%, #DDD6FE 30%, #A5F3FC 70%, #C7D2FE 100%)',
                }}
              >
                comincia il racconto.
              </span>
            </h2>
            <p className="text-sm md:text-base text-white/65 max-w-xl leading-relaxed">
              Virtual staging, descrizioni che vendono, render fotorealistici.
              Lo studio creativo che parte dove i documenti si fermano.
            </p>
          </div>

          {/* Colonna CTA */}
          <div className="md:col-span-4 flex md:justify-end">
            <div className="flex flex-col md:items-end gap-2">
              <NotifyMeInline slug="virtual-staging" />
              <p className="text-[0.625rem] uppercase tracking-[0.25em] text-white/35">
                In arrivo · Beta a posti limitati
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===========================================================
          CTA FINALE
      =========================================================== */}
      <section className="relative bg-slate-50">
        <div className={rail} style={{ left: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />
        <div className={rail} style={{ right: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-[0.625rem] font-mono uppercase tracking-[0.2em] text-[#4463EE] mb-3">
              05 · Inizia
            </div>
            <h2 className="text-3xl md:text-5xl font-headline leading-[1.1] text-[#002147] mb-5">
              Non è un servizio.{' '}
              <span className="text-[#4463EE]">È un nuovo modo di lavorare.</span>
            </h2>
            <p className="text-on-surface-variant text-base md:text-lg mb-10">
              Documenti, marketing AI, strumenti professionali — in un&apos;unica piattaforma
              costruita per chi lavora ogni giorno nell&apos;immobiliare. Siamo agli inizi, e la
              strada è già tracciata.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/registrazione"
                className="bg-[#4463EE] text-white px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] hover:brightness-110 transition"
                style={{ borderRadius: '5px' }}
              >
                Registrati gratis →
              </Link>
              <a
                href="#catalog"
                className="bg-white border border-slate-300 text-[#002147] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] hover:bg-slate-100 transition"
                style={{ borderRadius: '5px' }}
              >
                Esplora il catalogo →
              </a>
            </div>
            <div className="mt-14 pt-10 border-t border-slate-200">
              <SuggestionForm />
            </div>
          </div>
        </div>
      </section>
      </main>
      <ServiceDetailSheet service={detailService} onClose={() => setDetailSlug(null)} />
    </>
  );
}

/* ============================================================
   Scheda servizio — usata per Catasto e Conservatoria
============================================================ */
type Row = { name: string; desc: string; price: string; slug: string };

function CategoryCard({
  num,
  title,
  desc,
  href,
  rows,
  onAdd,
  onBuy,
  onShowDetails,
}: {
  num: string;
  title: string;
  desc: string;
  href: string;
  rows: Row[];
  onAdd: (slug: string) => void;
  onBuy: (slug: string) => void;
  onShowDetails: (slug: string) => void;
}) {
  return (
    <div className="border border-slate-300/80 bg-white flex flex-col">
      <div className="px-6 py-4 border-b border-slate-300/80">
        <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400 mb-1">
          Categoria {num}
        </div>
        <h3 className="text-xl font-headline text-[#002147]">{title}</h3>
        <p className="text-xs text-on-surface-variant mt-1">{desc}</p>
      </div>
      <div className="flex-grow px-6">
        {/* Intestazione colonne — dà l'ordine "Servizio · Prezzo · Azioni" */}
        <div className="grid grid-cols-[1fr_5rem_2.5rem_10rem] items-center gap-x-4 py-3 border-b border-slate-200 text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400">
          <span>Servizio</span>
          <span className="text-right">Prezzo</span>
          <span />
          <span className="text-right">Azioni</span>
        </div>
        <div className="divide-y divide-slate-100">
          {rows.map(r => (
            <div
              key={r.slug}
              className="grid grid-cols-[1fr_5rem_2.5rem_10rem] items-center gap-x-4 py-4"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#002147]">{r.name}</div>
                <div className="text-[0.625rem] font-mono uppercase tracking-[0.18em] text-slate-400 mt-0.5">
                  {r.desc}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-[#002147] leading-none">{r.price}</div>
                <div className="text-[0.5rem] font-mono uppercase tracking-wider text-slate-400 mt-1">
                  escl. IVA
                </div>
              </div>
              <span aria-hidden />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onShowDetails(r.slug)}
                  aria-label={`Dettagli ${r.name}`}
                  className="text-slate-400 hover:text-[#002147] hover:underline underline-offset-4 cursor-pointer text-[0.5625rem] font-mono uppercase tracking-[0.18em] transition-colors"
                >
                  Dettagli
                </button>
                <button
                  onClick={() => onAdd(r.slug)}
                  aria-label="Aggiungi al carrello"
                  className="h-8 w-11 border border-slate-300 text-slate-500 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-[#002147] hover:text-[#002147] transition flex-shrink-0"
                  style={{ borderRadius: '5px' }}
                >
                  <span className="material-symbols-outlined text-[0.75rem]">add_shopping_cart</span>
                </button>
                <button
                  onClick={() => onBuy(r.slug)}
                  className="bg-[#002147] text-white text-[0.5625rem] font-bold h-8 px-3 cursor-pointer hover:bg-[#4463EE] hover:shadow-md uppercase tracking-[0.15em] transition-all flex-shrink-0"
                  style={{ borderRadius: '5px' }}
                >
                  Acquista
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 py-3 border-t border-slate-100 text-center">
        <Link
          href={href}
          className="text-[0.625rem] font-mono uppercase tracking-[0.2em] text-slate-500 hover:text-[#4463EE]"
        >
          Visualizza tutti →
        </Link>
      </div>
    </div>
  );
}
