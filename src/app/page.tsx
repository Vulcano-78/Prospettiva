'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".sidebar-link");
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute("id") || "";
        }
      });
      navLinks.forEach((link) => {
        link.classList.remove("active", "text-primary", "bg-tertiary-fixed-dim", "border-black");
        link.classList.add("text-secondary", "border-transparent");
        if (link.getAttribute("href")?.includes(current)) {
          link.classList.add("active", "text-primary", "bg-tertiary-fixed-dim", "border-black");
          link.classList.remove("text-secondary", "border-transparent");
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-black sticky top-0 z-50">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-[1440px] mx-auto">
          <div className="text-2xl font-extrabold text-primary font-headline tracking-tighter">
            PROSPETTIVA<span className="text-tertiary-fixed-dim">.</span>IO
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary font-bold text-sm tracking-tight border-b-2 border-black" href="#">CATALOGO STRUMENTI</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-primary font-bold px-4 py-2 hover:bg-black/5 btn-sq transition-colors text-sm">Accedi</button>
            <button className="bg-primary text-white font-bold px-6 py-2 btn-sq hover:bg-black transition-colors text-sm">Registrati</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden h-[460px] md:h-[640px]">
        <img
          alt="Sleek futuristic cityscape at twilight with digital interfaces and data overlays"
          className="absolute inset-0 w-full h-full object-cover object-center"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUYe7U1Yr0-FDqC3rKSEXaXaKIWTYpLoMTFdmgysXYGk8bCLCZTDcUPfFqszhFIy1v68Ce-4L486PRRiv_q816Ec54kmlh7yBh3ZNahRyH-ivGUx3E9Yu183uj6dj29Ceql-l6ronrm_QWPlFlVPo6UweuB6zXBhPcjfbg6HscCdalCxBxdJ5gLGCRPhpKO4FLTq4EW6UKqJMzyIxPIrI230WjzqnB1Na0JKiAJcvKjp89mWga9saCx6MTnN0f0dLIp7c_24MAImc"
        />
        <div className="hero-overlay absolute inset-0"></div>
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 flex flex-col justify-center">
          <div className="max-w-4xl">
            <h1 className="font-headline font-bold text-white text-[32px] md:text-[52px] xl:text-[64px] leading-[1.05] mb-8 tracking-tight">
              L&apos;intelligenza digitale per il professionista immobiliare.
            </h1>
            <p className="font-body text-[17px] md:text-[22px] text-white/95 mb-14 max-w-3xl leading-relaxed">
              Documenti catastali, verifiche ipotecarie, marketing AI per i tuoi immobili — e questo è solo l&apos;inizio.
            </p>
            <div className="font-body text-[14px] text-white/60 font-semibold tracking-wide uppercase">
              Dati da: Agenzia delle Entrate · Catasto Nazionale · Conservatoria RR.II.
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="max-w-[1440px] mx-auto px-6 py-16" id="catalog-start">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
              <h2 className="text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4">Indice Categorie</h2>
              <nav className="flex flex-col border-l border-black/10">
                <a className="sidebar-link active flex items-center px-4 py-3 text-[12px] transition-all -ml-[1px] border-l-2" href="#documenti-catastali">
                  <span className="font-bold uppercase tracking-tight">Documenti Catastali</span>
                </a>
                <a className="sidebar-link flex items-center px-4 py-3 text-[12px] text-secondary transition-all -ml-[1px] border-l-2 border-transparent" href="#verifiche-ipotecarie">
                  <span className="font-bold uppercase tracking-tight">Verifiche Ipotecarie</span>
                </a>
                <a className="sidebar-link flex items-center px-4 py-3 text-[12px] text-secondary transition-all -ml-[1px] border-l-2 border-transparent" href="#urbanistica">
                  <span className="font-bold uppercase tracking-tight">Urbanistica</span>
                </a>
                <a className="sidebar-link flex items-center px-4 py-3 text-[12px] text-secondary transition-all -ml-[1px] border-l-2 border-transparent" href="#marketing-ai">
                  <span className="font-bold uppercase tracking-tight">Marketing AI</span>
                </a>
                <a className="sidebar-link flex items-center px-4 py-3 text-[12px] text-secondary transition-all -ml-[1px] border-l-2 border-transparent" href="#strumenti-gratuiti">
                  <span className="font-bold uppercase tracking-tight">Utility</span>
                </a>
              </nav>
            </div>
          </aside>

          {/* Categories Content */}
          <div className="flex-grow space-y-20">
            {/* Documenti Catastali */}
            <section className="scroll-mt-28 category-panel" id="documenti-catastali">
              <div className="mb-8 pb-4 border-b border-black flex justify-between items-end">
                <div>
                  <h2 className="font-headline text-xl font-black text-primary uppercase tracking-tight">Documenti Catastali</h2>
                  <p className="text-secondary text-[10px] mt-1 uppercase tracking-widest">Database Nazionale Ufficiale</p>
                </div>
              </div>
              <div className="grid-product-layout">
                <div className="product-card">
                  <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">Visura Catastale</h3>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Accesso immediato ai dati tecnici ufficiali per soggetti o immobili.</p>
                  <div className="mt-2 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary">€9,90</span>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-tighter">IVA ESCL.</span>
                    </div>
                  </div>
                  <hr className="border-black/10 mb-3" />
                  <div className="flex items-center justify-between">
                    <button className="w-1/2 bg-black text-white font-bold py-2 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim hover:text-black transition-colors">Acquista</button>
                    <button className="text-black hover:text-tertiary-fixed-dim transition-all flex items-center gap-1.5 group">
                      <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                      <span className="text-[10px] font-bold uppercase">Carrello</span>
                    </button>
                  </div>
                </div>
                <div className="product-card">
                  <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">Estratto Mappa</h3>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Rappresentazione grafica certificata dei confini e delle particelle.</p>
                  <div className="mt-2 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary">€12,50</span>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-tighter">IVA ESCL.</span>
                    </div>
                  </div>
                  <hr className="border-black/10 mb-3" />
                  <div className="flex items-center justify-between">
                    <button className="w-1/2 bg-black text-white font-bold py-2 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim hover:text-black transition-colors">Acquista</button>
                    <button className="text-black hover:text-tertiary-fixed-dim transition-all flex items-center gap-1.5 group">
                      <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                      <span className="text-[10px] font-bold uppercase">Carrello</span>
                    </button>
                  </div>
                </div>
                <div className="product-card">
                  <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">Ricerca Nazionale</h3>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Indagine su scala nazionale per l&apos;individuazione di proprietà intestate.</p>
                  <div className="mt-2 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary">€18,00</span>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-tighter">IVA ESCL.</span>
                    </div>
                  </div>
                  <hr className="border-black/10 mb-3" />
                  <div className="flex items-center justify-between">
                    <button className="w-1/2 bg-black text-white font-bold py-2 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim hover:text-black transition-colors">Acquista</button>
                    <button className="text-black hover:text-tertiary-fixed-dim transition-all flex items-center gap-1.5 group">
                      <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                      <span className="text-[10px] font-bold uppercase">Carrello</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Verifiche Ipotecarie */}
            <section className="scroll-mt-28 category-panel" id="verifiche-ipotecarie">
              <div className="mb-8 pb-4 border-b border-black">
                <h2 className="font-headline text-xl font-black text-primary uppercase tracking-tight">Verifiche Ipotecarie</h2>
                <p className="text-secondary text-[10px] mt-1 uppercase tracking-widest">Trascrizioni e Pregiudizievoli</p>
              </div>
              <div className="grid-product-layout">
                <div className="product-card">
                  <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">Ispezione Ipotecaria</h3>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Verifica gravami, ipoteche volontarie e giudiziali su base locale.</p>
                  <div className="mt-2 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary">€19,90</span>
                      <span className="text-[9px] text-secondary font-bold uppercase tracking-tighter">IVA ESCL.</span>
                    </div>
                  </div>
                  <hr className="border-black/10 mb-3" />
                  <div className="flex items-center justify-between">
                    <button className="w-1/2 bg-black text-white font-bold py-2 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim hover:text-black transition-colors">Acquista</button>
                    <button className="text-black hover:text-tertiary-fixed-dim transition-all flex items-center gap-1.5 group">
                      <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                      <span className="text-[10px] font-bold uppercase">Carrello</span>
                    </button>
                  </div>
                </div>
                <div className="product-card-inactive">
                  <div className="flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-black text-sm text-primary uppercase tracking-tight">Audit Nazionale</h3>
                      <span className="text-[8px] font-black border border-black px-1 py-0.5 uppercase">Preview</span>
                    </div>
                    <p className="text-on-surface-variant text-[11px] leading-tight">Analisi consolidata su tutte le conservatorie del territorio nazionale.</p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <input className="w-full bg-transparent border border-black btn-sq px-2 py-1.5 text-[10px] focus:ring-0 focus:border-tertiary-fixed-dim uppercase placeholder:text-black/30" placeholder="Inserisci email" type="email" />
                    <button className="w-full bg-transparent text-black font-black py-1.5 btn-sq text-[10px] border border-black uppercase hover:bg-black hover:text-white transition-all">Avvisami</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Urbanistica */}
            <section className="scroll-mt-28 category-panel" id="urbanistica">
              <div className="mb-8 pb-4 border-b border-black">
                <h2 className="font-headline text-xl font-black text-primary uppercase tracking-tight">Urbanistica</h2>
                <p className="text-secondary text-[10px] mt-1 uppercase tracking-widest">Conformità e Certificazioni</p>
              </div>
              <div className="grid-product-layout">
                <div className="product-card-inactive">
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">CDU Digitale</h3>
                    <p className="text-on-surface-variant text-[11px] leading-tight">Certificato di destinazione urbanistica per atti notarili e compravendite.</p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <input className="w-full bg-transparent border border-black btn-sq px-2 py-1.5 text-[10px] focus:ring-0 focus:border-tertiary-fixed-dim uppercase" placeholder="Email" type="email" />
                    <button className="w-full bg-transparent text-black font-black py-1.5 btn-sq text-[10px] border border-black uppercase hover:bg-black hover:text-white transition-all">Coming Soon</button>
                  </div>
                </div>
                <div className="product-card-inactive">
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">APE Espresso</h3>
                    <p className="text-on-surface-variant text-[11px] leading-tight">Attestato di Prestazione Energetica con sopralluogo tecnico certificato.</p>
                  </div>
                  <div className="mt-2 flex flex-col gap-2">
                    <input className="w-full bg-transparent border border-black btn-sq px-2 py-1.5 text-[10px] focus:ring-0 focus:border-tertiary-fixed-dim uppercase" placeholder="Email" type="email" />
                    <button className="w-full bg-transparent text-black font-black py-1.5 btn-sq text-[10px] border border-black uppercase hover:bg-black hover:text-white transition-all">Coming Soon</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Marketing AI */}
            <section className="scroll-mt-28 category-panel" id="marketing-ai">
              <div className="mb-8 pb-4 border-b border-black">
                <h2 className="font-headline text-xl font-black text-primary uppercase tracking-tight">Marketing AI</h2>
                <p className="text-secondary text-[10px] mt-1 uppercase tracking-widest">Visual Engagement</p>
              </div>
              <div className="grid-product-layout">
                <div className="product-card">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-black text-sm text-primary uppercase tracking-tight">Virtual Staging AI</h3>
                    <span className="bg-black text-white text-[8px] font-black px-1.5 py-0.5 uppercase">Beta</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Renderizzazione fotorealistica automatizzata per valorizzare ogni ambiente.</p>
                  <div className="mt-2 mb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-primary uppercase">Free Tier</span>
                    </div>
                  </div>
                  <hr className="border-black/10 mb-3" />
                  <div className="flex flex-col gap-2">
                    <input className="w-full bg-transparent border border-black btn-sq px-2 py-1.5 text-[10px] focus:ring-0 focus:border-tertiary-fixed-dim uppercase" placeholder="Email professionista" type="email" />
                    <button className="w-full bg-black text-white font-black py-1.5 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim hover:text-black transition-colors">Accesso Beta</button>
                  </div>
                </div>
              </div>
            </section>

            {/* Utility */}
            <section className="scroll-mt-28 category-panel" id="strumenti-gratuiti">
              <div className="mb-8 pb-4 border-b border-black">
                <h2 className="font-headline text-xl font-black text-primary uppercase tracking-tight">Utility</h2>
                <p className="text-secondary text-[10px] mt-1 uppercase tracking-widest">Risorse Gratuite</p>
              </div>
              <div className="grid-product-layout">
                <div className="product-card border-dashed">
                  <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">Calcolo IMU</h3>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Tool rapido per il calcolo dell&apos;imposta municipale su rendita catastale.</p>
                  <div className="mt-4">
                    <button className="w-1/2 border border-black text-black font-black py-2 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim transition-colors">Esegui</button>
                  </div>
                </div>
                <div className="product-card border-dashed">
                  <h3 className="font-black text-sm text-primary mb-1 uppercase tracking-tight">Checklist Rogito</h3>
                  <p className="text-on-surface-variant text-[11px] leading-tight flex-grow">Documentazione completa pre-stipula per venditore e acquirente.</p>
                  <div className="mt-4">
                    <button className="w-1/2 border border-black text-black font-black py-2 btn-sq text-[10px] uppercase hover:bg-tertiary-fixed-dim transition-colors">Scarica</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Data Sources Section */}
      <section className="bg-black py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="font-headline text-[10px] font-black text-white/40 mb-10 text-center uppercase tracking-[0.4em]">Infrastruttura Dati Certificata</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <span className="font-headline font-black text-white text-[10px] tracking-tighter uppercase">Agenzia Entrate</span>
            <span className="font-headline font-black text-white text-[10px] tracking-tighter uppercase">Notariato Nazionale</span>
            <span className="font-headline font-black text-white text-[10px] tracking-tighter uppercase">Sistema Catastale</span>
            <span className="font-headline font-black text-white text-[10px] tracking-tighter uppercase">Registro Imprese</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black">
        <div className="max-w-[1440px] mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-black font-black text-[9px] tracking-widest uppercase">
              © 2024 PROSPETTIVA.IO — INTELLIGENZA IMMOBILIARE
            </div>
            <div className="flex gap-8">
              <a className="text-black font-black hover:text-tertiary-fixed-dim transition-colors text-[9px] tracking-widest uppercase" href="#">Privacy</a>
              <a className="text-black font-black hover:text-tertiary-fixed-dim transition-colors text-[9px] tracking-widest uppercase" href="#">Termini</a>
              <a className="text-black font-black hover:text-tertiary-fixed-dim transition-colors text-[9px] tracking-widest uppercase" href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
