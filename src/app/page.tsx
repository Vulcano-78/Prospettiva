'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { services } from '@/data/services';

export default function HomePage() {
  const { addItem, itemCount } = useCart();

  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname);
      window.scrollTo(0, 0);
    }
  }, []);

  const getService = (slug: string) => services.find(s => s.slug === slug);

  const handleAddToCart = (slug: string) => {
    const service = getService(slug);
    if (service) addItem(service);
  };

  return (
    <>
      {/* Hero */}
      <header className="hero-gradient pt-24 md:pt-40 pb-10 md:pb-28 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <h1 className="text-4xl md:text-5xl xl:text-6xl mb-6 leading-[1.1]">
              <span className="text-[#002147]">L&apos;immobiliare,</span><br />
              <span className="text-[#4463EE]">senza burocrazia.</span>
            </h1>
            <p className="text-on-surface-variant text-base md:text-xl mb-6 md:mb-10 max-w-xl font-body">
              Documenti ufficiali, verifiche ipotecarie e strumenti AI. Tutto automatizzato, tutto in un posto solo.
            </p>

            {/* Mobile hero image */}
            <div className="lg:hidden mb-6">
              <div className="glass-code-box flex flex-col overflow-hidden text-[10px]">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/20 bg-white/30">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                  </div>
                  <span className="ml-auto text-[8px] font-mono text-slate-500 uppercase tracking-tight font-semibold">prospettiva.io — pratica #2847</span>
                </div>
                <div className="p-4 font-mono leading-relaxed text-slate-700 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-200/50">
                        <th className="text-left py-1.5 font-medium">SERVIZIO</th>
                        <th className="text-left py-1.5 font-medium">STATO</th>
                        <th className="text-right py-1.5 font-medium">TEMPO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      <tr>
                        <td className="py-2 pr-3">Visura Catastale</td>
                        <td className="py-2 text-emerald-600">✓ completata</td>
                        <td className="py-2 text-right text-slate-400">2m 14s</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3">Verifica Ipotecaria</td>
                        <td className="py-2 text-emerald-600">✓ completata</td>
                        <td className="py-2 text-right text-slate-400">4m 02s</td>
                      </tr>
                      <tr className="bg-[#EEF1FD]">
                        <td className="py-2 px-1.5 pr-3 font-semibold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-sm">auto_awesome</span>
                          Virtual Staging AI
                        </td>
                        <td className="py-2 text-[#4463EE] animate-pulse">⟳ in corso...</td>
                        <td className="py-2 text-right text-slate-400">—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalog" className="bg-secondary text-white px-6 py-3 text-base font-medium hover:bg-primary-container transition-all flex items-center justify-center" style={{ borderRadius: '6px' }}>
                Esplora i servizi <span className="ml-2">→</span>
              </a>
              <Link href="/registrazione" className="bg-white border border-outline-variant text-primary-container px-6 py-3 text-base font-medium hover:bg-surface-container-low transition-all text-center" style={{ borderRadius: '6px' }}>
                Crea account
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 hidden lg:block">
            <div className="glass-code-box flex flex-col overflow-hidden">
              <div className="flex items-center gap-1.5 px-6 py-4 border-b border-white/20 bg-white/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <span className="ml-auto text-[10px] font-mono text-slate-500 uppercase tracking-tight font-semibold">prospettiva.io — pratica #2847 — Milano, Via Brera 14</span>
              </div>
              <div className="p-6 font-mono text-[11px] leading-relaxed text-slate-700 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-200/50">
                      <th className="text-left py-2 font-medium">SERVIZIO</th>
                      <th className="text-left py-2 font-medium">STATO</th>
                      <th className="text-right py-2 font-medium">TEMPO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    <tr>
                      <td className="py-3 pr-4">Visura Catastale</td>
                      <td className="py-3 text-emerald-600">✓ completata</td>
                      <td className="py-3 text-right text-slate-400">2 min 14s</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Verifica Ipotecaria</td>
                      <td className="py-3 text-emerald-600">✓ completata</td>
                      <td className="py-3 text-right text-slate-400">4 min 02s</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Estratto di Mappa</td>
                      <td className="py-3 text-emerald-600">✓ completata</td>
                      <td className="py-3 text-right text-slate-400">1 min 38s</td>
                    </tr>
                    <tr className="bg-[#EEF1FD]">
                      <td className="py-3 px-2 pr-4 font-semibold flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-base">auto_awesome</span>
                        Virtual Staging AI
                      </td>
                      <td className="py-3 text-[#4463EE] animate-pulse">⟳ in corso...</td>
                      <td className="py-3 text-right text-slate-400">—</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">Certificato Urbanistico</td>
                      <td className="py-3 text-slate-400">◌ in coda</td>
                      <td className="py-3 text-right text-slate-400">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-white/40 backdrop-blur-md px-6 py-3 flex justify-between items-center border-t border-white/20">
                <span className="text-slate-500 text-[10px] font-mono tracking-wider">3 / 5 pratiche evase</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4463EE]"></div>
                  <span className="text-[#4463EE] text-[10px] font-mono uppercase font-bold">● live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rapid Procurement Dashboard */}
      <section id="catalog" className="bg-white">
      <div className="pt-2 md:pt-16 pb-16 px-8 max-w-7xl mx-auto">
        <div className="text-left md:text-center mb-14">
          <h2 className="text-4xl md:text-5xl text-[#002147] mb-4 leading-[1.1] md:leading-tight">Scegli il servizio. <span className="text-[#4463EE]">Noi facciamo il resto.</span></h2>
          <p className="text-on-surface-variant text-base md:text-lg font-normal max-w-2xl md:mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Ogni documento che ti serve per una compravendita, un&apos;istruttoria o una perizia. Online, ufficiale, immediato.
          </p>
        </div>
        <div className="relative">
        <div className="absolute inset-0 -mb-16" style={{ background: 'linear-gradient(180deg, transparent 0%, #eef0ff40 15%, #eef0ff60 50%, #eef0ff40 85%, transparent 100%)', left: '50%', transform: 'translateX(-50%)', width: '100vw' }}></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 01 - Documenti Catastali */}
          <div className="workflow-box p-6 flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">description</span> Catasto
                </h3>
                <p className="text-xs text-on-surface-variant">Visure e planimetrie ufficiali in tempo reale.</p>
              </div>
            </div>
            <div className="flex-grow overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2 font-bold">Servizio</th>
                    <th className="py-2 font-bold text-right pr-4">Prezzo</th>
                    <th className="py-2 font-bold text-center w-16">Qtà</th>
                    <th className="py-2 font-bold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="group hover:bg-white transition-colors">
                    <td className="py-4">
                      <div className="text-sm font-bold text-primary-container">Visura Catastale</div>
                      <div className="text-[10px] text-on-surface-variant">Storica o per immobile</div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-xs font-semibold text-primary-container">€9.90</span>
                      <span className="text-[8px] text-on-surface-variant/60 block">escl. IVA</span>
                    </td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/servizio/visura-catastale" className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                        <button onClick={() => handleAddToCart('visura-catastale')} className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/visura-catastale" className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-2 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                  <tr className="group hover:bg-white transition-colors">
                    <td className="py-4">
                      <div className="text-sm font-bold text-primary-container">Planimetria</div>
                      <div className="text-[10px] text-on-surface-variant">Copia conforme depositata</div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-xs font-semibold text-primary-container">€14.90</span>
                      <span className="text-[8px] text-on-surface-variant/60 block">escl. IVA</span>
                    </td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/servizio/planimetria" className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                        <button onClick={() => handleAddToCart('planimetria')} className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/planimetria" className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-2 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center">
              <Link className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="/catalogo/documenti-catastali">
                VISUALIZZA TUTTI <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* 02 - Verifiche Ipotecarie */}
          <div className="workflow-box p-6 flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">account_balance</span> Conservatoria
                </h3>
                <p className="text-xs text-on-surface-variant">Analisi gravami e trascrizioni pregiudizievoli.</p>
              </div>
            </div>
            <div className="flex-grow overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2 font-bold">Servizio</th>
                    <th className="py-2 font-bold text-right pr-4">Prezzo</th>
                    <th className="py-2 font-bold text-center w-16">Qtà</th>
                    <th className="py-2 font-bold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="group hover:bg-white transition-colors">
                    <td className="py-4">
                      <div className="text-sm font-bold text-primary-container">Ispezione Ipotecaria</div>
                      <div className="text-[10px] text-on-surface-variant">Elenco sintetico formalità</div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-xs font-semibold text-primary-container">€19.90</span>
                      <span className="text-[8px] text-on-surface-variant/60 block">escl. IVA</span>
                    </td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/servizio/visura-ipotecaria" className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                        <button onClick={() => handleAddToCart('visura-ipotecaria')} className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/visura-ipotecaria" className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-2 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                  <tr className="group hover:bg-white transition-colors">
                    <td className="py-4">
                      <div className="text-sm font-bold text-primary-container">Note e Titoli</div>
                      <div className="text-[10px] text-on-surface-variant">Sviluppo formalità</div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-xs font-semibold text-primary-container">€12.90</span>
                      <span className="text-[8px] text-on-surface-variant/60 block">escl. IVA</span>
                    </td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/servizio/visura-ipotecaria" className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                        <button onClick={() => handleAddToCart('visura-ipotecaria')} className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/visura-ipotecaria" className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-2 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center">
              <Link className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="/catalogo/verifiche-ipotecarie">
                VISUALIZZA TUTTI <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* 03 - Urbanistica */}
          <div className="workflow-box p-6 flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">architecture</span> Urbanistica
                </h3>
                <p className="text-xs text-on-surface-variant">Conformità e titoli abilitativi comunali.</p>
              </div>
            </div>
            <div className="flex-grow overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant uppercase tracking-wider border-b border-slate-200">
                    <th className="py-2 font-bold">Servizio</th>
                    <th className="py-2 font-bold text-right pr-4">Prezzo</th>
                    <th className="py-2 font-bold text-center w-16">Qtà</th>
                    <th className="py-2 font-bold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="group hover:bg-white transition-colors">
                    <td className="py-4">
                      <div className="text-sm font-bold text-primary-container">Accesso agli Atti</div>
                      <div className="text-[10px] text-on-surface-variant">Pratiche edilizie</div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-xs font-semibold text-primary-container">€45.00</span>
                      <span className="text-[8px] text-on-surface-variant/60 block">escl. IVA</span>
                    </td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/coming-soon/certificato-urbanistico" className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                        <Link href="/coming-soon/certificato-urbanistico" className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </Link>
                        <Link href="/coming-soon/certificato-urbanistico" className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-2 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                  <tr className="group hover:bg-white transition-colors">
                    <td className="py-4">
                      <div className="text-sm font-bold text-primary-container">Certificato C.D.U.</div>
                      <div className="text-[10px] text-on-surface-variant">Destinazione urbanistica</div>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <span className="text-xs font-semibold text-primary-container">€35.00</span>
                      <span className="text-[8px] text-on-surface-variant/60 block">escl. IVA</span>
                    </td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/coming-soon/certificato-urbanistico" className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                        <Link href="/coming-soon/certificato-urbanistico" className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </Link>
                        <Link href="/coming-soon/certificato-urbanistico" className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-2 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center">
              <Link className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="/catalogo/urbanistica">
                VISUALIZZA TUTTI <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* 04 - Utility Gratuite */}
          <div className="workflow-box p-6 flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">construction</span> Utility Gratuite
                </h3>
                <p className="text-xs text-on-surface-variant">Strumenti per l&apos;attività quotidiana.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/servizio/calcolatore-imu" className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:shadow-lg hover:border-secondary/20 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary/5 group-hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined">calculate</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary-container">Calcolo IMU/TARI</div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Simulatore imposte</div>
                  </div>
                </div>
                <span className="text-secondary text-[10px] font-bold flex items-center gap-1">CALCOLA <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
              </Link>
              <Link href="/servizio/checklist-mutuo" className="flex items-center justify-between p-4 bg-white border border-slate-100 hover:shadow-lg hover:border-secondary/20 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary/5 group-hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary-container">Modelli Contrattuali</div>
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Download legali</div>
                  </div>
                </div>
                <span className="text-secondary text-[10px] font-bold flex items-center gap-1">SCARICA <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
              </Link>
            </div>
            <div className="pt-6 text-center mt-auto">
              <Link className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="/catalogo/utility-gratuite">
                VEDI TUTTE LE UTILITY <span className="material-symbols-outlined text-xs">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
      </section>

      {/* Marketing AI Section */}
      <section className="navy-glow py-24 px-8 overflow-hidden" id="come-funziona">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-secondary text-white text-[10px] font-bold tracking-widest px-3 py-1 mb-6 uppercase">Nuovo · Marketing AI</span>
            <h2 className="text-4xl md:text-5xl text-white mb-6 leading-tight">Esplora in totale libertà.</h2>
            <p className="text-white/60 text-lg mb-10 max-w-md">
              Trasforma schizzi tecnici e stanze vuote in ambienti arredati da designer professionisti. Carica la planimetria e lascia che l&apos;AI faccia la magia istantaneamente.
            </p>
            <div className="text-center md:text-left">
              <Link href="/coming-soon/virtual-staging" className="inline-block bg-secondary text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-primary-container transition-all" style={{ borderRadius: '6px' }}>
                Entra in lista d&apos;attesa →
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-slate-900 border border-white/10 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 blueprint-lines bg-slate-950 flex items-center justify-center">
                <svg className="w-full h-full p-16 opacity-40" viewBox="0 0 100 60">
                  <path className="wall-stroke" d="M10 50 L10 20 L40 10 L80 10 L90 20 L90 50 Z"></path>
                  <path className="wall-stroke" d="M10 20 L40 30 L80 30 L90 20"></path>
                  <path className="wall-stroke" d="M40 10 L40 30 M80 10 L80 30"></path>
                  <rect className="wall-stroke" height="15" width="20" x="25" y="35"></rect>
                  <line className="wall-stroke" x1="25" x2="45" y1="35" y2="50"></line>
                  <line className="wall-stroke" x1="45" x2="25" y1="35" y2="50"></line>
                </svg>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-700" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000&auto=format&fit=crop')" }}></div>
              <div className="absolute top-[25%] left-[30%] w-3 h-3 bg-secondary rounded-full ai-marker animate-pulse z-40"></div>
              <div className="absolute top-[45%] right-[25%] w-3 h-3 bg-secondary rounded-full ai-marker animate-pulse z-40" style={{ animationDelay: '500ms' }}></div>
              <div className="absolute bottom-[30%] left-[50%] w-3 h-3 bg-secondary rounded-full ai-marker animate-pulse z-40" style={{ animationDelay: '1000ms' }}></div>
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-primary-container/30 backdrop-blur-[1px] p-6">
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 w-full max-w-sm text-center">
                  <div className="mb-6">
                    <span className="material-symbols-outlined text-white text-5xl mb-4">upload_file</span>
                    <h4 className="text-white text-xl font-bold mb-2">Upload Your Floor Plan</h4>
                    <p className="text-white/60 text-sm">PDF, JPEG, or DWG supported</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:ring-0 cursor-pointer" placeholder="Select file..." readOnly type="text" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 text-lg">attach_file</span>
                    </div>
                    <button className="bg-secondary text-white py-3 px-6 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-primary-container transition-all flex items-center justify-center gap-2">
                      Start AI Magic <span className="material-symbols-outlined text-base">auto_awesome</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-4 z-40">
                <span className="text-[9px] text-secondary font-mono uppercase tracking-[0.2em] bg-slate-900/80 px-2 py-1 border border-secondary/30">AI_ACTIVE_OVERLAY</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden md:block z-50">
              <div className="bg-secondary p-8 w-48 h-48 flex flex-col justify-end shadow-2xl border border-white/10">
                <span className="text-white text-4xl font-bold">94%</span>
                <span className="text-white/80 text-[10px] leading-tight uppercase font-medium">Conversione media annunci stagizzati</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="bg-white border-y border-slate-100 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-40 grayscale">
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">AGENZIA DELLE ENTRATE</span>
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">CATASTO NAZIONALE</span>
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">CONSIGLIO NOTARIATO</span>
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">REGISTRO IMPRESE</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface-container-low py-24 px-8 text-center" id="cta">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl text-primary-container mb-6">Prospettiva non è un servizio. È un nuovo modo di lavorare.</h2>
          <p className="text-on-surface-variant mb-10 text-lg">
            Documenti, marketing AI, strumenti professionali. Tutto in un&apos;unica piattaforma, costruita per chi lavora ogni giorno nell&apos;immobiliare.<br />Siamo agli inizi — e la strada è già tracciata.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/registrazione" className="bg-primary-container text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-secondary transition-all text-center" style={{ borderRadius: '6px' }}>
              Registrati gratis<span className="hidden md:inline"> →</span>
            </Link>
            <a href="#come-funziona" className="bg-white border border-outline-variant text-primary-container px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-surface transition-all" style={{ borderRadius: '6px' }}>
              Scopri cosa sta arrivando<span className="hidden md:inline"> →</span>
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
