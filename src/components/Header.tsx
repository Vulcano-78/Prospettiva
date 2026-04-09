'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Header() {
  const { itemCount } = useCart();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 w-full z-50 px-2 pt-1">
      <nav className="w-full bg-white border border-slate-200 max-w-[1440px] mx-auto" style={{ borderRadius: '6px' }}>
        <div className="flex items-center px-8 h-14 relative">
          {/* Logo - left */}
          <Link href="/" className="text-xl font-[800] tracking-[-0.02em] text-[#002147] brand-logo flex-shrink-0">
            prospettiva<span className="text-[#4463EE]">.io</span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <div className="relative" onMouseEnter={() => setCatalogOpen(true)} onMouseLeave={() => setCatalogOpen(false)}>
              <button className="text-[#002147] font-medium hover:text-[#4463EE] transition-colors duration-200 text-sm flex items-center gap-1">
                Catalogo <span className="material-symbols-outlined text-base">expand_more</span>
              </button>

              {/* Mega Menu bridge + panel */}
              {catalogOpen && (
                <>
                <div className="fixed top-[50px] left-1/2 -translate-x-1/2 z-50" onMouseEnter={() => setCatalogOpen(true)} onMouseLeave={() => setCatalogOpen(false)}>
                  <div className="bg-white border border-slate-200 shadow-xl p-8 w-[720px]" style={{ borderRadius: '6px' }}>
                    <div className="grid grid-cols-4 gap-8">
                      {/* Documenti Catastali */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-4">Documenti Catastali</h4>
                        <div className="flex flex-col gap-3">
                          <Link href="/servizio/visura-catastale" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Visura Catastale</div>
                            <div className="text-[10px] text-slate-400">Per immobile o soggetto</div>
                          </Link>
                          <Link href="/servizio/estratto-mappa" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Estratto Mappa</div>
                            <div className="text-[10px] text-slate-400">Confini e particelle</div>
                          </Link>
                          <Link href="/servizio/planimetria" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Planimetria</div>
                            <div className="text-[10px] text-slate-400">Copia conforme</div>
                          </Link>
                          <Link href="/servizio/ricerca-nazionale" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Ricerca Nazionale</div>
                            <div className="text-[10px] text-slate-400">Proprietà su tutto il territorio</div>
                          </Link>
                          <Link href="/servizio/elaborato-planimetrico" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Elaborato Planimetrico</div>
                            <div className="text-[10px] text-slate-400">Grafico catastale completo</div>
                          </Link>
                        </div>
                      </div>

                      {/* Verifiche Ipotecarie */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-4">Verifiche Ipotecarie</h4>
                        <div className="flex flex-col gap-3">
                          <Link href="/servizio/visura-ipotecaria" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Visura Ipotecaria</div>
                            <div className="text-[10px] text-slate-400">Gravami e trascrizioni</div>
                          </Link>
                          <Link href="/coming-soon/ispezione-nazionale" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Ispezione Nazionale</div>
                            <div className="text-[10px] text-slate-400">Tutte le conservatorie</div>
                          </Link>
                        </div>
                      </div>

                      {/* Urbanistica */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-4">Urbanistica</h4>
                        <div className="flex flex-col gap-3">
                          <Link href="/coming-soon/certificato-urbanistico" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Certificato C.D.U.</div>
                            <div className="text-[10px] text-slate-400">Destinazione urbanistica</div>
                          </Link>
                          <Link href="/coming-soon/attestato-ape" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Attestato APE</div>
                            <div className="text-[10px] text-slate-400">Prestazione energetica</div>
                          </Link>
                        </div>

                        <h4 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-4 mt-8">Marketing AI</h4>
                        <div className="flex flex-col gap-3">
                          <Link href="/coming-soon/virtual-staging" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Virtual Staging AI</div>
                            <div className="text-[10px] text-slate-400">Arredamento fotorealistico</div>
                          </Link>
                        </div>
                      </div>

                      {/* Utility */}
                      <div>
                        <h4 className="text-[10px] font-black text-[#002147] uppercase tracking-widest mb-4">Utility</h4>
                        <div className="flex flex-col gap-3">
                          <Link href="/servizio/calcolatore-imu" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Calcolatore IMU</div>
                            <div className="text-[10px] text-slate-400">Simulatore imposte</div>
                          </Link>
                          <Link href="/servizio/checklist-mutuo" className="group">
                            <div className="text-sm font-semibold text-[#4463EE] group-hover:text-[#002147] transition-colors">Checklist Mutuo</div>
                            <div className="text-[10px] text-slate-400">Documenti finanziamento</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
            <Link className="text-[#002147] hover:text-[#4463EE] transition-colors duration-200 text-sm font-medium" href="/#come-funziona">Come funziona</Link>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-auto">
            <Link href="/carrello" className="relative text-[#002147] hover:text-[#4463EE] transition-colors mr-1">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#4463EE] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/login" className="px-5 py-2 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors" style={{ borderRadius: '6px' }}>Accedi</Link>
            <Link href="/registrazione" className="px-5 py-2 bg-[#4463EE] text-white text-sm font-medium hover:bg-[#002147] transition-colors" style={{ borderRadius: '6px' }}>Registrati</Link>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Link href="/carrello" className="relative p-2 text-[#002147]">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4463EE] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#002147]">
              <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3">
            <Link href="/" className="block text-[#002147] font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Catalogo</Link>
            <Link href="/login" className="block text-[#002147] font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Accedi</Link>
            <Link href="/registrazione" className="block bg-[#4463EE] text-white font-bold px-4 py-3 text-center" style={{ borderRadius: '6px' }} onClick={() => setMobileMenuOpen(false)}>Registrati</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
