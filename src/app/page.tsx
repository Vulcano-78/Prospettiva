'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { categories, services } from '@/data/services';

export default function HomePage() {
  const { addItem, itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".sidebar-link");
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
          current = section.getAttribute("id") || "";
        }
      });
      navLinks.forEach((link) => {
        link.classList.remove("active", "text-primary", "bg-tertiary-fixed-dim");
        link.classList.add("text-secondary");
        if (link.getAttribute("href")?.includes(current)) {
          link.classList.add("active", "text-primary", "bg-tertiary-fixed-dim");
          link.classList.remove("text-secondary");
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getServicesForCategory = (categoryId: string) =>
    services.filter(s => s.category === categoryId);

  return (
    <>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-outline-variant/10 sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
          <Link href="/" className="text-2xl font-extrabold text-primary font-headline tracking-tight">
            Prospettiva<span className="text-tertiary-fixed-dim">.</span><span className="text-tertiary-fixed-dim">io</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold border-b-2 border-tertiary-fixed-dim" href="#catalog-start">Catalogo Strumenti</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/carrello" className="relative text-primary hover:text-primary-container transition-all">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-tertiary-fixed-dim text-primary text-[9px] font-black w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link href="/login" className="text-primary font-bold px-4 py-2 hover:bg-black/5 btn-sq transition-colors text-sm">Accedi</Link>
            <Link href="/registrazione" className="bg-primary text-white font-bold px-6 py-2 btn-sq hover:opacity-90 transition-opacity text-sm">Registrati</Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-texture relative flex items-center overflow-hidden" style={{ height: '20vh', minHeight: '180px' }}>
        <div className="max-w-[1440px] mx-auto px-6 w-full py-8 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-4xl px-4">
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary leading-tight tracking-tight mb-4">
              L&apos;intelligenza digitale dietro ogni operazione immobiliare.
            </h1>
            <p className="font-body text-secondary text-sm md:text-lg max-w-2xl mx-auto leading-relaxed opacity-80">
              Documenti catastali, verifiche ipotecarie, marketing AI. Tutto in un&apos;unica piattaforma.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="max-w-[1440px] mx-auto px-6 py-12" id="catalog-start">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="sticky top-28 space-y-4">
              <h2 className="text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-4 px-2">Esplora Categorie</h2>
              <nav className="flex flex-col">
                {categories.map((cat) => (
                  <a
                    key={cat.id}
                    className={`sidebar-link flex items-center px-4 py-2.5 text-[13px] transition-all ${cat.id === categories[0].id ? 'active' : 'text-secondary'}`}
                    href={`#${cat.id}`}
                  >
                    <span className="font-semibold">{cat.name}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Categories Content */}
          <div className="flex-grow space-y-16">
            {categories.map((cat) => {
              const catServices = getServicesForCategory(cat.id);
              return (
                <section key={cat.id} className="scroll-mt-28 category-panel" id={cat.id}>
                  <div className="flex items-center gap-4 mb-6 pb-3 border-b border-outline-variant/10">
                    <div className="category-pill">
                      <span className="material-symbols-outlined text-primary text-[18px]">{cat.icon}</span>
                    </div>
                    <div>
                      <h2 className="font-headline text-xl font-extrabold text-primary">{cat.name}</h2>
                      <p className="text-secondary text-[11px] mt-0.5">{cat.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {catServices.map((service) => {
                      if (!service.isActive) {
                        return (
                          <div key={service.id} className="product-card-inactive">
                            <div className="flex flex-col flex-grow">
                              <div className="flex items-center justify-between mb-1.5">
                                <h3 className="font-bold text-sm text-primary opacity-60">{service.shortName}</h3>
                                <span className="bg-surface-variant text-on-surface-variant text-[7px] font-bold px-1 py-0.5 btn-sq uppercase">In arrivo</span>
                              </div>
                              <p className="text-on-surface-variant text-[10px] opacity-70 leading-relaxed">{service.description}</p>
                            </div>
                            <div className="mt-3 flex flex-col gap-1.5">
                              <input className="w-full bg-white border border-outline-variant/30 btn-sq px-2 py-1.5 text-[10px] focus:ring-1 focus:ring-tertiary-fixed-dim focus:border-tertiary-fixed-dim" placeholder="La tua email" type="email" />
                              <button className="w-full bg-primary/5 text-primary font-bold py-1.5 btn-sq text-[10px] border border-primary/5">Avvisami</button>
                            </div>
                          </div>
                        );
                      }

                      if (service.price === 0) {
                        return (
                          <div key={service.id} className="product-card border-dashed border-outline-variant/30">
                            <div className="flex items-center justify-between mb-1.5">
                              <h3 className="font-bold text-sm text-primary">{service.shortName}</h3>
                              <span className="text-outline/30 text-[7px] font-bold px-1 py-0.5 border border-outline-variant/20 uppercase">Gratuito</span>
                            </div>
                            <p className="text-on-surface-variant text-[10px] leading-relaxed flex-grow">{service.description}</p>
                            <div className="mt-4">
                              <Link href={`/servizio/${service.slug}`} className="inline-block max-w-[110px] w-full bg-tertiary-fixed-dim/20 text-primary font-bold py-2 btn-sq text-[10px] hover:bg-tertiary-fixed-dim/40 transition-all text-center">
                                Utilizza ora
                              </Link>
                            </div>
                          </div>
                        );
                      }

                      if (service.isFeatured) {
                        return (
                          <div key={service.id} className="product-card">
                            <div className="flex items-center justify-between mb-1.5">
                              <h3 className="font-bold text-sm text-primary">{service.shortName}</h3>
                              <span className="bg-tertiary-fixed-dim/30 text-primary text-[7px] font-black px-1 py-0.5 uppercase">In evidenza</span>
                            </div>
                            <p className="text-on-surface-variant text-[10px] leading-relaxed flex-grow">{service.description}</p>
                            <div className="mt-3 mb-3">
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-extrabold text-primary">€{service.price.toFixed(2).replace('.', ',')}</span>
                                <span className="text-[8px] text-outline/50 font-semibold uppercase tracking-tight">+ IVA</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link href={`/servizio/${service.slug}`} className="max-w-[110px] w-full bg-primary text-white font-bold py-2 btn-sq text-[10px] hover:bg-primary/90 transition-all text-center">
                                Acquista ora
                              </Link>
                              <button
                                onClick={() => addItem(service)}
                                className="text-primary hover:text-primary-container transition-all flex items-center gap-1 group"
                              >
                                <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                                <span className="text-[10px] font-bold">Aggiungi</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={service.id} className="product-card">
                          <h3 className="font-bold text-sm text-primary mb-1.5">{service.shortName}</h3>
                          <p className="text-on-surface-variant text-[10px] leading-relaxed flex-grow">{service.description}</p>
                          <div className="mt-3 mb-3">
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-extrabold text-primary">€{service.price.toFixed(2).replace('.', ',')}</span>
                              <span className="text-[8px] text-outline/50 font-semibold uppercase tracking-tight">+ IVA</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Link href={`/servizio/${service.slug}`} className="max-w-[110px] w-full bg-primary text-white font-bold py-2 btn-sq text-[10px] hover:bg-primary/90 transition-all text-center">
                              Acquista ora
                            </Link>
                            <button
                              onClick={() => addItem(service)}
                              className="text-primary hover:text-primary-container transition-all flex items-center gap-1 group"
                            >
                              <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                              <span className="text-[10px] font-bold">Aggiungi</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      {/* Partner Section */}
      <section className="bg-white py-12 border-t border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto px-6 text-center">
          <h2 className="font-headline text-[9px] font-black text-outline/60 mb-8 uppercase tracking-[0.3em]">Partner istituzionali e fonti dati ufficiali</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-20 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-headline font-extrabold text-sm">AGENZIA ENTRATE</span>
            <span className="font-headline font-extrabold text-sm">CONSIGLIO NOTARIATO</span>
            <span className="font-headline font-extrabold text-sm">CATASTO NAZIONALE</span>
            <span className="font-headline font-extrabold text-sm">REGISTRO IMPRESE</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-outline-variant/10">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-400 font-body text-[9px] font-bold tracking-widest uppercase">
              © 2024 PROSPETTIVA.IO • P.IVA 12345678901
            </div>
            <div className="flex gap-6">
              <Link className="text-slate-400 hover:text-tertiary-fixed-dim transition-colors text-[9px] font-bold tracking-widest uppercase" href="/privacy">Privacy</Link>
              <Link className="text-slate-400 hover:text-tertiary-fixed-dim transition-colors text-[9px] font-bold tracking-widest uppercase" href="/termini">Termini</Link>
              <Link className="text-slate-400 hover:text-tertiary-fixed-dim transition-colors text-[9px] font-bold tracking-widest uppercase" href="/cookie">Cookie</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
