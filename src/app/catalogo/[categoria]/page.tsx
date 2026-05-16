'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { services, getServicesByCategory } from '@/data/services';
import Breadcrumb from '@/components/Breadcrumb';
import ServiceDetailSheet from '@/components/ServiceDetailSheet';

const categoryConfig: Record<string, { title: string; description: string; icon: string; number: string }> = {
  'documenti-catastali': {
    title: 'Catasto',
    description: 'Visure e planimetrie ufficiali in tempo reale.',
    icon: 'description',
    number: '01',
  },
  'verifiche-ipotecarie': {
    title: 'Conservatoria',
    description: 'Analisi gravami e trascrizioni pregiudizievoli.',
    icon: 'account_balance',
    number: '02',
  },
  'urbanistica': {
    title: 'Urbanistica',
    description: 'Conformità e titoli abilitativi comunali.',
    icon: 'architecture',
    number: '03',
  },
  'utility-gratuite': {
    title: 'Utility Gratuite',
    description: 'Strumenti gratuiti per l\'attività quotidiana.',
    icon: 'construction',
    number: '04',
  },
};

const categoryToDataKey: Record<string, string> = {
  'documenti-catastali': 'documenti-catastali',
  'verifiche-ipotecarie': 'verifiche-ipotecarie',
  'urbanistica': 'urbanistica',
  'utility-gratuite': 'strumenti-gratuiti',
};

const categoryServiceOrder: Record<string, string[]> = {
  'documenti-catastali': [
    'visura-catastale',
    'visura-catastale-storica',
    'estratto-mappa',
    'elaborato-planimetrico',
    'prospetto-catastale',
    'ricerca-persona',
    'ricerca-nazionale',
    'ricerca-indirizzo',
  ],
  'utility-gratuite': [
    'conto-economico',
    'calcolatore-costi-compravendita',
    'esposizione-solare',
    'calcolatore-imu',
  ],
  // 'ispezione-ipotecaria' è la voce unificata (immobile/soggetto scelti in carrello).
  // 'ispezione-ipotecaria-immobile' resta in services.ts come slug legacy, escluso dal catalogo.
  'verifiche-ipotecarie': [
    'ispezione-ipotecaria',
    'ispezione-ipotecaria-nazionale',
    'elenco-note-ipotecarie',
  ],
};

export default function CatalogoCategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = use(params);
  const { addItem } = useCart();

  const config = categoryConfig[categoria];
  if (!config) {
    notFound();
  }

  const dataCategory = categoryToDataKey[categoria];
  const orderList = categoryServiceOrder[categoria];
  const categoryServices = orderList
    ? orderList.map(slug => services.find(s => s.slug === slug)).filter((s): s is NonNullable<typeof s> => !!s)
    : getServicesByCategory(dataCategory);

  // For Urbanistica, also include Marketing AI items? No, keep it strictly per category.
  // For utility-gratuite, the data category is 'strumenti-gratuiti'

  const router = useRouter();
  const [detailSlug, setDetailSlug] = useState<string | null>(null);
  const detailService = detailSlug ? services.find(s => s.slug === detailSlug) ?? null : null;

  const handleAddToCart = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) addItem(service);
  };

  const handleBuyNow = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) addItem(service);
    router.push('/carrello');
  };
  const handleShowDetails = (slug: string) => setDetailSlug(slug);

  const rail = 'absolute top-0 bottom-0 w-px bg-slate-200/80 pointer-events-none';

  return (
    <main className="bg-white min-h-screen text-[#002147]">
      {/* HERO — titolo categoria nella stessa grammatica del catalogo home */}
      <section className="relative pt-[96px] md:pt-[112px] pb-10 md:pb-12">
        <div className={rail} style={{ left: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />
        <div className={rail} style={{ right: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: config.title },
          ]} />
          <div className="mt-6 max-w-2xl">
            <div className="text-[0.625rem] font-mono uppercase tracking-[0.2em] text-[#4463EE] mb-3">
              Categoria {config.number}
            </div>
            <h1 className="text-3xl md:text-4xl font-headline leading-[1.1] text-[#002147] mb-4">{config.title}</h1>
            <p className="text-on-surface-variant text-base md:text-lg">
              {config.description}
            </p>
          </div>
        </div>
      </section>

      {/* Servizi — card stessa estetica del home-lab CategoryCard */}
      <section className="relative bg-white pb-24 md:pb-32">
        <div className={rail} style={{ left: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />
        <div className={rail} style={{ right: 'max(1.5rem, calc((100% - 80rem) / 2))' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
          <div className="border border-slate-300/80 bg-white">
            <div className="px-6 py-4 border-b border-slate-300/80">
              <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400 mb-1">
                Categoria {config.number}
              </div>
              <h2 className="text-xl font-headline text-[#002147]">{config.title}</h2>
              <p className="text-xs text-on-surface-variant mt-1">{config.description}</p>
            </div>

            <div className="px-6">
              {/* Intestazione colonne (md+) */}
              <div className="hidden md:grid grid-cols-[1fr_5rem_2.5rem_10rem] items-center gap-x-4 py-3 border-b border-slate-200 text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400">
                <span>Servizio</span>
                <span className="text-right">Prezzo</span>
                <span />
                <span className="text-right">Azioni</span>
              </div>

              <div className="divide-y divide-slate-100">
                {categoryServices.map((service) => {
                  const isActive = service.isActive;
                  const isFree = service.price === 0;

                  return (
                    <div
                      key={service.id}
                      className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_5rem_2.5rem_10rem] items-center gap-x-4 gap-y-3 py-4"
                    >
                      {/* Nome + descrizione */}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#002147]">{service.shortName}</div>
                        <div className="text-[0.625rem] font-mono uppercase tracking-[0.18em] text-slate-400 mt-0.5">
                          {service.description}
                        </div>
                      </div>

                      {/* Prezzo (md+) */}
                      <div className="hidden md:block text-right">
                        {isFree ? (
                          <div className="text-sm font-semibold text-[#4463EE] leading-none">Gratis</div>
                        ) : (
                          <>
                            <div className="text-sm font-semibold text-[#002147] leading-none">
                              €{service.price.toFixed(2)}
                            </div>
                            <div className="text-[0.5rem] font-mono uppercase tracking-wider text-slate-400 mt-1">
                              escl. IVA
                            </div>
                          </>
                        )}
                      </div>

                      {/* Spacer (md+) */}
                      <span aria-hidden className="hidden md:block" />

                      {/* Azioni */}
                      <div className="flex items-center justify-end gap-2 col-span-2 md:col-span-1">
                        {/* Prezzo inline su mobile */}
                        {!isFree && (
                          <div className="md:hidden mr-auto text-left">
                            <div className="text-sm font-semibold text-[#002147] leading-none">
                              €{service.price.toFixed(2)}
                            </div>
                            <div className="text-[0.5rem] font-mono uppercase tracking-wider text-slate-400 mt-1">
                              escl. IVA
                            </div>
                          </div>
                        )}

                        {isActive ? (
                          isFree ? (
                            <Link
                              href={service.href ?? `/coming-soon/${service.slug}`}
                              className="bg-[#002147] text-white text-[0.5625rem] font-bold h-8 px-3 min-w-[5.5rem] cursor-pointer hover:bg-[#4463EE] hover:shadow-md uppercase tracking-[0.15em] transition-all flex items-center justify-center"
                              style={{ borderRadius: '5px' }}
                            >
                              Apri
                            </Link>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleShowDetails(service.slug)}
                                aria-label={`Dettagli ${service.shortName}`}
                                className="text-slate-400 hover:text-[#002147] hover:underline underline-offset-4 cursor-pointer text-[0.5625rem] font-mono uppercase tracking-[0.18em] transition-colors"
                              >
                                Dettagli
                              </button>
                              <button
                                onClick={() => handleAddToCart(service.slug)}
                                aria-label="Aggiungi al carrello"
                                className="h-8 w-11 border border-slate-300 text-slate-500 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-[#002147] hover:text-[#002147] transition flex-shrink-0"
                                style={{ borderRadius: '5px' }}
                              >
                                <span className="material-symbols-outlined text-[0.75rem]">add_shopping_cart</span>
                              </button>
                              <button
                                onClick={() => handleBuyNow(service.slug)}
                                className="bg-[#002147] text-white text-[0.5625rem] font-bold h-8 px-3 cursor-pointer hover:bg-[#4463EE] hover:shadow-md uppercase tracking-[0.15em] transition-all flex-shrink-0"
                                style={{ borderRadius: '5px' }}
                              >
                                Acquista
                              </button>
                            </>
                          )
                        ) : (
                          <Link
                            href={`/coming-soon/${service.slug}`}
                            className="border border-slate-300 text-slate-400 text-[0.5625rem] font-bold h-8 px-3 min-w-[5.5rem] uppercase tracking-[0.15em] flex items-center justify-center"
                            style={{ borderRadius: '5px' }}
                          >
                            In arrivo
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceDetailSheet service={detailService} onClose={() => setDetailSlug(null)} />
    </main>
  );
}
