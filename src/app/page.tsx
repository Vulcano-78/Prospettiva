'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { services } from '@/data/services';

export default function HomePage() {
  const { addItem, itemCount } = useCart();

  const getService = (slug: string) => services.find(s => s.slug === slug);

  const handleAddToCart = (slug: string) => {
    const service = getService(slug);
    if (service) addItem(service);
  };

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-white border-b border-slate-200">
        <Link href="/" className="text-xl font-[800] tracking-[-0.02em] text-[#002147] brand-logo">
          Prospettiva.io
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-[#4463EE] font-semibold hover:text-[#4463EE] transition-colors duration-200 text-sm" href="#catalog">Catalogo</a>
          <a className="text-[#002147] hover:text-[#4463EE] transition-colors duration-200 text-sm font-medium" href="#come-funziona">Come funziona</a>
          <a className="text-[#002147] hover:text-[#4463EE] transition-colors duration-200 text-sm font-medium" href="#cta">Prezzi</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/carrello" className="relative text-[#002147] hover:text-[#4463EE] transition-colors mr-1">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#4463EE] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="px-5 py-2 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">Accedi</Link>
          <Link href="/registrazione" className="px-5 py-2 bg-[#4463EE] text-white text-sm font-medium hover:bg-[#002147] transition-colors">Registrati gratis</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero-gradient pt-32 pb-24 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <h1 className="text-5xl md:text-6xl mb-6 text-primary-container leading-[1.1]">
              Tutto quello che serve per lavorare nell&apos;immobiliare, <br />
              <span className="text-secondary">in un unico posto.</span>
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl mb-10 max-w-xl font-body">
              Documenti catastali ufficiali, verifiche ipotecarie, marketing AI e API robuste per sviluppatori.
              Automatizzati, veloci, certificati.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#catalog" className="bg-secondary text-white px-8 py-4 text-lg font-medium hover:bg-primary-container transition-all flex items-center justify-center">
                Esplora gli strumenti <span className="ml-2">→</span>
              </a>
              <button className="bg-white border border-outline-variant text-primary-container px-8 py-4 text-lg font-medium hover:bg-surface-container-low transition-all">
                Documentazione API
              </button>
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
                <span className="ml-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">prospettiva_api_client.js</span>
              </div>
              <div className="p-8 font-mono text-[13px] leading-relaxed text-slate-700">
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">1</span><p><span className="text-indigo-400">import</span> Prospettiva <span className="text-indigo-400">from</span> <span className="text-emerald-400/80">&apos;@prospettiva/sdk&apos;</span>;</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">2</span><p><span className="text-indigo-400">const</span> api = <span className="text-indigo-400">new</span> Prospettiva(<span className="text-emerald-400/80">&apos;pk_live_88a2...&apos;</span>);</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">3</span><p> </p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">4</span><p><span className="text-indigo-400">const</span> property = <span className="text-indigo-400">await</span> api.fetch({'{'}  </p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">5</span><p>  type: <span className="text-sky-400/80">&apos;visura_catastale&apos;</span>,</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">6</span><p>  address: {'{'}</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">7</span><p>    city: <span className="text-rose-400/70">&apos;Milano&apos;</span>,</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">8</span><p>    street: <span className="text-rose-400/70">&apos;Via della Spiga, 5&apos;</span></p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">9</span><p>  {'}'},</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">10</span><p>  enrichment: [<span className="text-amber-400/80">&apos;map_data&apos;</span>, <span className="text-amber-400/80">&apos;history&apos;</span>]</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">11</span><p>{'}'});</p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">12</span><p> </p></div>
                <div className="flex gap-4"><span className="text-slate-400/40 select-none w-4">13</span><p><span className="text-slate-400/60">// Returns certified property object</span></p></div>
              </div>
              <div className="bg-white/40 backdrop-blur-md px-6 py-3 flex justify-between items-center border-t border-white/20">
                <span className="text-slate-400 text-[10px] font-mono tracking-wider">RESPONSE: 200 SUCCESS</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60"></div>
                  <span className="text-slate-400 text-[10px] font-mono uppercase">connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rapid Procurement Dashboard */}
      <section className="pt-24 pb-16 px-8 max-w-7xl mx-auto bg-white" id="catalog">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-primary-container mb-4">Rapid Procurement Dashboard</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-sm">
            Ottimizzato per ordini multipli veloci e flussi di lavoro ad alta efficienza.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 01 - Documenti Catastali */}
          <div className="workflow-box p-6 flex flex-col h-full bg-slate-50/30">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <span className="w-10 h-10 flex-shrink-0 border border-primary-container flex items-center justify-center font-bold text-sm text-primary-container bg-white">01</span>
              <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">description</span> Documenti Catastali
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
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleAddToCart('visura-catastale')} className="border border-slate-200 text-slate-400 h-8 w-[60px] flex items-center justify-center hover:bg-slate-50">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/visura-catastale" className="bg-slate-100 text-slate-500 text-[10px] font-bold h-8 px-2 hover:bg-slate-200 uppercase flex items-center">Acquista</Link>
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
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleAddToCart('planimetria')} className="border border-slate-200 text-slate-400 h-8 w-[60px] flex items-center justify-center hover:bg-slate-50">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/planimetria" className="bg-slate-100 text-slate-500 text-[10px] font-bold h-8 px-2 hover:bg-slate-200 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center">
              <a className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="#documenti-catastali">
                VISUALIZZA TUTTI <span className="material-symbols-outlined text-xs">chevron_right</span>
              </a>
            </div>
          </div>

          {/* 02 - Verifiche Ipotecarie */}
          <div className="workflow-box p-6 flex flex-col h-full bg-slate-50/30">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <span className="w-10 h-10 flex-shrink-0 border border-primary-container flex items-center justify-center font-bold text-sm text-primary-container bg-white">02</span>
              <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">account_balance</span> Verifiche Ipotecarie
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
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleAddToCart('visura-ipotecaria')} className="border border-slate-200 text-slate-400 h-8 w-[60px] flex items-center justify-center hover:bg-slate-50">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/visura-ipotecaria" className="bg-slate-100 text-slate-500 text-[10px] font-bold h-8 px-2 hover:bg-slate-200 uppercase flex items-center">Acquista</Link>
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
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleAddToCart('visura-ipotecaria')} className="border border-slate-200 text-slate-400 h-8 w-[60px] flex items-center justify-center hover:bg-slate-50">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </button>
                        <Link href="/servizio/visura-ipotecaria" className="bg-slate-100 text-slate-500 text-[10px] font-bold h-8 px-2 hover:bg-slate-200 uppercase flex items-center">Acquista</Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center">
              <a className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="#verifiche-ipotecarie">
                VISUALIZZA TUTTI <span className="material-symbols-outlined text-xs">chevron_right</span>
              </a>
            </div>
          </div>

          {/* 03 - Urbanistica */}
          <div className="workflow-box p-6 flex flex-col h-full bg-slate-50/30">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <span className="w-10 h-10 flex-shrink-0 border border-primary-container flex items-center justify-center font-bold text-sm text-primary-container bg-white">03</span>
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
                  <tr className="group hover:bg-white transition-all duration-200 border-l-2 border-transparent hover:border-secondary">
                    <td className="py-4 pl-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-secondary text-lg">folder_open</span>
                        <div>
                          <div className="text-sm font-bold text-primary-container">Accesso agli Atti</div>
                          <div className="text-[10px] text-on-surface-variant">Pratiche edilizie</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right pr-4"><span className="text-xs font-semibold text-primary-container">€45.00</span></td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href="/coming-soon/certificato-urbanistico" className="border border-slate-200 text-slate-400 h-8 w-[60px] flex items-center justify-center hover:bg-slate-50">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <tr className="group hover:bg-white transition-all duration-200 border-l-2 border-transparent hover:border-secondary">
                    <td className="py-4 pl-3">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 group-hover:text-secondary text-lg">map</span>
                        <div>
                          <div className="text-sm font-bold text-primary-container">Certificato C.D.U.</div>
                          <div className="text-[10px] text-on-surface-variant">Destinazione urbanistica</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right pr-4"><span className="text-xs font-semibold text-primary-container">€35.00</span></td>
                    <td className="py-4 px-1">
                      <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href="/coming-soon/certificato-urbanistico" className="border border-slate-200 text-slate-400 h-8 w-[60px] flex items-center justify-center hover:bg-slate-50">
                          <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="pt-6 text-center">
              <a className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="#urbanistica">
                VISUALIZZA TUTTI <span className="material-symbols-outlined text-xs">chevron_right</span>
              </a>
            </div>
          </div>

          {/* 04 - Utility Professionali */}
          <div className="workflow-box p-6 flex flex-col h-full bg-slate-50/30">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <span className="w-10 h-10 flex-shrink-0 border border-primary-container flex items-center justify-center font-bold text-sm text-primary-container bg-white">04</span>
              <div>
                <h3 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">construction</span> Utility Professionali
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
              <a className="text-on-surface-variant text-[11px] font-bold flex items-center justify-center gap-1 hover:text-secondary" href="#strumenti-gratuiti">
                VEDI TUTTE LE UTILITY <span className="material-symbols-outlined text-xs">chevron_right</span>
              </a>
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
            <Link href="/coming-soon/virtual-staging" className="inline-block bg-secondary text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-primary-container transition-all">
              Entra in lista d&apos;attesa →
            </Link>
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
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale">
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">AGENZIA ENTRATE</span>
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">CATASTO NAZIONALE</span>
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">CONSIGLIO NOTARIATO</span>
            <span className="text-primary-container font-[800] text-sm tracking-[0.15em] font-headline">REGISTRO IMPRESE</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface-container-low py-24 px-8 text-center" id="cta">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl text-primary-container mb-6">Inizia oggi, gratis.</h2>
          <p className="text-on-surface-variant mb-10 text-lg">
            Non serve una carta di credito. Registrati in meno di 2 minuti e ottieni accesso a tutti gli strumenti di base.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/registrazione" className="bg-primary-container text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-secondary transition-all text-center">
              Registrati Ora
            </Link>
            <button className="bg-white border border-outline-variant text-primary-container px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-surface transition-all">
              Parla con un esperto
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center bg-primary-container text-white">
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="text-lg font-[800] text-white mb-2 brand-logo">Prospettiva.io</div>
          <div className="text-slate-300 text-sm font-body">© 2024 Prospettiva.io. Tutti i diritti riservati.</div>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          <Link className="text-slate-300 text-sm hover:text-white transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="text-slate-300 text-sm hover:text-white transition-colors" href="/cookie">Cookie Policy</Link>
          <Link className="text-slate-300 text-sm hover:text-white transition-colors" href="/termini">Termini e Condizioni</Link>
        </div>
      </footer>
    </>
  );
}
