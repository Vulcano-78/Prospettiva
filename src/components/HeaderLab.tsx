'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

/**
 * Header in stile Stripe per la /home-lab.
 * Full width, fisso, trasparente sull'hero, solid bianco con border-bottom dopo scroll.
 * Proporzioni: container ~1080px, h-[72px], logo a sinistra, nav vicino al logo, azioni a destra.
 */
export default function HeaderLab() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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

  const navLinkClass =
    'text-[#002147] hover:text-[#4463EE] transition-colors duration-150 text-[0.9375rem] font-medium flex items-center gap-1';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-[72px] flex items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-[1.375rem] font-[800] tracking-[-0.02em] text-[#002147] brand-logo flex-shrink-0 mr-10"
        >
          prospettiva<span className="text-[#4463EE]">.io</span>
        </Link>

        {/* Nav (a sinistra, vicino al logo — come Stripe) */}
        <nav className="hidden md:flex items-center gap-8">
          <div
            className="relative"
            onMouseEnter={() => setCatalogOpen(true)}
            onMouseLeave={() => setCatalogOpen(false)}
          >
            <button className={navLinkClass}>
              Catalogo
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
            {catalogOpen && (
              <div className="absolute top-full left-0 pt-4 z-50">
                <div
                  className="bg-white border border-slate-200 shadow-xl p-8 w-[720px]"
                  style={{ borderRadius: '8px' }}
                >
                  <div className="grid grid-cols-3 gap-8">
                    <div>
                      <Link href="/catalogo/documenti-catastali" className="inline-block">
                        <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">
                          Catasto
                        </h4>
                      </Link>
                      <div
                        className="h-px mb-3"
                        style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}
                      />
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Visura Catastale</div>
                          <div className="text-[0.625rem] text-slate-400">Sintetica o analitica</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Visura Storica</div>
                          <div className="text-[0.625rem] text-slate-400">Variazioni nel tempo</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Estratto Mappa</div>
                          <div className="text-[0.625rem] text-slate-400">Confini e particelle</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Planimetria</div>
                          <div className="text-[0.625rem] text-slate-400">Disegno tecnico</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link href="/catalogo/verifiche-ipotecarie" className="inline-block">
                        <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">
                          Conservatoria
                        </h4>
                      </Link>
                      <div
                        className="h-px mb-3"
                        style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}
                      />
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Ispezione Ipotecaria</div>
                          <div className="text-[0.625rem] text-slate-400">Per soggetto o immobile</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Ispezione Nazionale</div>
                          <div className="text-[0.625rem] text-slate-400">Tutte le conservatorie</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Singola Nota</div>
                          <div className="text-[0.625rem] text-slate-400">Dettaglio formalità</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link href="/catalogo/utility-gratuite" className="inline-block">
                        <h4 className="text-[0.625rem] font-black text-[#4463EE] uppercase tracking-widest mb-2 hover:text-[#002147] transition-colors">
                          Strumenti Gratuiti
                        </h4>
                      </Link>
                      <div
                        className="h-px mb-3"
                        style={{ background: 'linear-gradient(to right, #c4c6cf, transparent)' }}
                      />
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Conto Economico</div>
                          <div className="text-[0.625rem] text-slate-400">Costi, ricavi, ROI</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#002147]">Costi Compravendita</div>
                          <div className="text-[0.625rem] text-slate-400">Imposte e notaio</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/catalogo/verifiche-ipotecarie" className={navLinkClass}>
            Conservatoria
          </Link>
          <Link href="/utility/conto-economico" className={navLinkClass}>
            Strumenti
          </Link>
          <Link href="/pro" className={navLinkClass}>
            Professionisti
          </Link>
        </nav>

        {/* Azioni a destra */}
        <div className="hidden md:flex items-center gap-5 ml-auto">
          <Link
            href="/carrello"
            className="relative text-[#002147] hover:text-[#4463EE] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#4463EE] text-white text-[0.5625rem] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 text-[#002147] hover:text-[#4463EE] transition-colors text-[0.9375rem] font-medium"
              >
                <span
                  className="material-symbols-outlined text-base"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_circle
                </span>
                {displayName}
                <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
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
              <Link
                href="/login"
                className="text-[#002147] hover:text-[#4463EE] transition-colors text-[0.9375rem] font-medium"
              >
                Accedi
              </Link>
              <Link
                href="/registrazione"
                className="bg-[#002147] text-white px-4 py-2 text-[0.9375rem] font-medium hover:bg-[#4463EE] transition-colors inline-flex items-center gap-1"
                style={{ borderRadius: '5px' }}
              >
                Registrati <span aria-hidden>→</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3 ml-auto">
          <Link href="/carrello" className="relative p-2 text-[#002147]">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4463EE] text-white text-[0.5625rem] font-black w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#002147]"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-3">
          <Link
            href="/catalogo/documenti-catastali"
            className="block text-[#002147] font-bold py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Catalogo
          </Link>
          <Link
            href="/pro"
            className="block text-[#002147] font-medium py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Professionisti
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block text-[#002147] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block text-[#4463EE] font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block text-red-500 font-medium py-2 w-full text-left"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-[#002147] font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accedi
              </Link>
              <Link
                href="/registrazione"
                className="block bg-[#002147] text-white font-bold px-4 py-3 text-center"
                style={{ borderRadius: '5px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Registrati →
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
