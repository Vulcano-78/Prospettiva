'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const meta = user?.user_metadata ?? {};
  const nome = meta.nome as string | undefined;
  const displayName = nome || user?.email?.split('@')[0] || 'Account';
  const isAdmin = (user?.email || '').toLowerCase() === 'profili.vulcano@gmail.com';

  return (
    <div className="fixed top-0 w-full z-50 px-2 pt-1">
      <nav className="w-full bg-white border border-slate-200 max-w-[1440px] mx-auto" style={{ borderRadius: '6px' }}>
        <div className="flex items-center px-8 h-14 relative">
          {/* Logo */}
          <Link href="/" className="text-xl font-[800] tracking-[-0.02em] text-[#002147] brand-logo flex-shrink-0">
            prospettiva<span className="text-[#4463EE]">.io</span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <div className="relative" onMouseEnter={() => setCatalogOpen(true)} onMouseLeave={() => setCatalogOpen(false)}>
              <button className="text-[#002147] font-medium hover:text-[#4463EE] transition-colors duration-200 text-sm flex items-center gap-1">
                Catalogo <span className="material-symbols-outlined text-base">expand_more</span>
              </button>

              {catalogOpen && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 pt-10 z-50 w-[860px]">
                  <div className="bg-white border border-slate-200 shadow-xl p-8" style={{ borderRadius: '6px', position: 'fixed', left: '50%', transform: 'translateX(-50%)', width: '720px' }}>
                    <div className="grid grid-cols-5 gap-6">
                      <div>
                        <Link href="/catalogo/documenti-catastali" className="inline-block">
                          <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">Catasto</h4>
                        </Link>
                        <div className="h-px mb-3" style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}></div>
                        <div className="flex flex-col gap-3">
                          <div><div className="text-sm font-semibold text-[#002147]">Visura Catastale</div><div className="text-[0.625rem] text-slate-400">Per immobile o soggetto</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Estratto Mappa</div><div className="text-[0.625rem] text-slate-400">Confini e particelle</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Planimetria</div><div className="text-[0.625rem] text-slate-400">Copia conforme</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Ricerca Nazionale</div><div className="text-[0.625rem] text-slate-400">Proprietà su tutto il territorio</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Elaborato Planimetrico</div><div className="text-[0.625rem] text-slate-400">Grafico catastale completo</div></div>
                        </div>
                      </div>
                      <div>
                        <Link href="/catalogo/verifiche-ipotecarie" className="inline-block">
                          <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">Conservatoria</h4>
                        </Link>
                        <div className="h-px mb-3" style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}></div>
                        <div className="flex flex-col gap-3">
                          <div><div className="text-sm font-semibold text-[#002147]">Ispezione Ipotecaria Nazionale</div><div className="text-[0.625rem] text-slate-400">Tutte le conservatorie</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Ispezione Ipotecaria</div><div className="text-[0.625rem] text-slate-400">Per soggetto o immobile</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Singola Nota Ipotecaria</div><div className="text-[0.625rem] text-slate-400">Dettaglio nota specifica</div></div>
                        </div>
                      </div>
                      <div>
                        <Link href="/catalogo/urbanistica" className="inline-block">
                          <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">Urbanistica</h4>
                        </Link>
                        <div className="h-px mb-3" style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}></div>
                        <div className="flex flex-col gap-3">
                          <div><div className="text-sm font-semibold text-[#002147]">Certificato C.D.U.</div><div className="text-[0.625rem] text-slate-400">Destinazione urbanistica</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Attestato APE</div><div className="text-[0.625rem] text-slate-400">Prestazione energetica</div></div>
                        </div>
                      </div>
                      <div>
                        <Link href="/coming-soon/virtual-staging" className="inline-block">
                          <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">Marketing AI</h4>
                        </Link>
                        <div className="h-px mb-3" style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}></div>
                        <div className="flex flex-col gap-3">
                          <div><div className="text-sm font-semibold text-[#002147]">Virtual Staging AI</div><div className="text-[0.625rem] text-slate-400">Arredamento fotorealistico</div></div>
                        </div>
                      </div>
                      <div>
                        <Link href="/catalogo/utility-gratuite" className="inline-block">
                          <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">Utility Gratuite</h4>
                        </Link>
                        <div className="h-px mb-3" style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}></div>
                        <div className="flex flex-col gap-3">
                          <div><div className="text-sm font-semibold text-[#002147]">Calcolatore IMU</div><div className="text-[0.625rem] text-slate-400">Simulatore imposte</div></div>
                          <div><div className="text-sm font-semibold text-[#002147]">Checklist Mutuo</div><div className="text-[0.625rem] text-slate-400">Documenti finanziamento</div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-auto">
            <Link href="/carrello" className="relative text-[#002147] hover:text-[#4463EE] transition-colors mr-1">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#4463EE] text-white text-[0.5625rem] font-black w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium text-[#002147]"
                  style={{ borderRadius: '6px' }}
                >
                  <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                  {displayName}
                  <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#002147] font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">dashboard</span>
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#4463EE] font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">shield_person</span>
                        Admin
                      </Link>
                    )}
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors w-full text-left"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Esci
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="px-5 py-2 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors" style={{ borderRadius: '6px' }}>Accedi</Link>
                <Link href="/registrazione" className="px-5 py-2 bg-[#4463EE] text-white text-sm font-medium hover:bg-[#002147] transition-colors" style={{ borderRadius: '6px' }}>Registrati</Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <Link href="/carrello" className="relative p-2 text-[#002147]">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4463EE] text-white text-[0.5625rem] font-black w-4 h-4 flex items-center justify-center">
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
            {user ? (
              <>
                <Link href="/dashboard" className="block text-[#002147] font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                {isAdmin && (
                  <Link href="/admin" className="block text-[#4463EE] font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                )}
                <button onClick={handleLogout} className="block text-red-500 font-medium py-2 w-full text-left">Esci</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-[#002147] font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Accedi</Link>
                <Link href="/registrazione" className="block bg-[#4463EE] text-white font-bold px-4 py-3 text-center" style={{ borderRadius: '6px' }} onClick={() => setMobileMenuOpen(false)}>Registrati</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
