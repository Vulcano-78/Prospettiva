'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { services, getServicesByCategory } from '@/data/services';
import Breadcrumb from '@/components/Breadcrumb';

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
    'calcolatore-imu',
    'checklist-mutuo',
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

  const handleAddToCart = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) addItem(service);
  };

  const handleBuyNow = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) addItem(service);
    router.push('/carrello');
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Header section with title */}
      <section className="hero-gradient pt-20 pb-6 px-8"><div className="max-w-[1440px] mx-auto">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: config.title },
        ]} />
        <div className="text-center mb-4">
          <h1 className="text-[2.625rem] md:text-5xl text-[#002147] mb-4">{config.title}</h1>
          <p className="text-on-surface-variant text-lg md:text-xl font-normal max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            {config.description}
          </p>
        </div>
        </div>
      </section>

      {/* Services Box */}
      <section className="pb-24 px-4 md:px-8" style={{ background: 'linear-gradient(180deg, transparent 0%, #eef0ff40 15%, #eef0ff60 50%, #eef0ff40 85%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="workflow-box p-5 md:p-8 flex flex-col bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div>
                <h2 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">{config.icon}</span> {config.title}
                </h2>
                <p className="text-xs text-on-surface-variant">{config.description}</p>
              </div>
            </div>

            {/* MOBILE: tre zone fisse — titolo+prezzo / descrizione / CTA */}
            <ul className="md:hidden divide-y divide-slate-100">
              {categoryServices.map((service) => {
                const isActive = service.isActive;
                const isFree = service.price === 0;
                return (
                  <li key={service.id} className="py-5 flex flex-col gap-3">
                    {/* Zona 1: titolo + prezzo (allineamento fisso) */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[0.9375rem] font-bold text-primary-container leading-tight flex-1 min-w-0">
                        {service.shortName}
                      </h3>
                      {!isFree && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-[0.9375rem] font-extrabold text-primary-container leading-none">€{service.price.toFixed(2)}</div>
                          <div className="text-[0.5625rem] text-on-surface-variant/60 mt-1 uppercase tracking-wider">escl. IVA</div>
                        </div>
                      )}
                    </div>

                    {/* Zona 2: descrizione (min-height fisso, line-clamp 2 righe) */}
                    <p
                      className="text-xs text-on-surface-variant leading-snug min-h-[2.6em] overflow-hidden"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                    >
                      {service.description}
                    </p>

                    {/* Zona 3: azioni compatte a destra */}
                    <div className="flex justify-end items-center gap-2">
                      {isActive ? (
                        isFree ? (
                          <Link
                            href={service.href ?? `/coming-soon/${service.slug}`}
                            className="inline-flex items-center gap-1.5 h-10 px-4 bg-[#002147] text-white text-[0.6875rem] font-bold uppercase tracking-widest rounded-md hover:brightness-110 transition-all"
                          >
                            Apri <span className="material-symbols-outlined text-base">arrow_forward</span>
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAddToCart(service.slug)}
                              aria-label="Aggiungi al carrello"
                              className="inline-flex items-center justify-center h-10 w-12 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>add_shopping_cart</span>
                            </button>
                            <button
                              onClick={() => handleBuyNow(service.slug)}
                              className="inline-flex items-center gap-1.5 h-10 px-4 bg-[#002147] text-white text-[0.6875rem] font-bold uppercase tracking-widest rounded-md hover:brightness-110 transition-all cursor-pointer"
                            >
                              Acquista <span className="material-symbols-outlined text-base">arrow_forward</span>
                            </button>
                          </>
                        )
                      ) : (
                        <span className="inline-flex items-center h-10 px-4 bg-slate-100 text-slate-400 text-[0.6875rem] font-bold uppercase tracking-widest rounded-md">
                          In arrivo
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* DESKTOP: tabella */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[0.625rem] text-on-surface-variant uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 font-bold">Servizio</th>
                    <th className="py-3 font-bold text-right pr-4">Prezzo</th>
                    <th className="py-3 font-bold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoryServices.map((service) => (
                    <tr key={service.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="text-sm font-bold text-primary-container">{service.shortName}</div>
                        <div className="text-[0.6875rem] text-on-surface-variant">{service.description}</div>
                      </td>
                      <td className="py-4 text-right pr-4">
                        {service.price > 0 ? (
                          <>
                            <span className="text-sm font-semibold text-primary-container">€{service.price.toFixed(2)}</span>
                            <span className="text-[0.5625rem] text-on-surface-variant/60 block">escl. IVA</span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-[#4463EE]">Gratis</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {service.isActive ? (
                            service.price > 0 ? (
                              <>
                                <button
                                  onClick={() => handleAddToCart(service.slug)}
                                  className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50 cursor-pointer"
                                >
                                  <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                                </button>
                                <button onClick={() => handleBuyNow(service.slug)} className="bg-slate-200 text-slate-600 text-[0.625rem] font-bold h-8 px-3 hover:bg-slate-300 uppercase flex items-center cursor-pointer">Acquista</button>
                              </>
                            ) : (
                              <Link href={service.href ?? `/coming-soon/${service.slug}`} className="bg-slate-200 text-slate-600 text-[0.625rem] font-bold h-8 px-3 hover:bg-slate-300 uppercase flex items-center">Apri</Link>
                            )
                          ) : (
                            <>
                              <Link href={`/coming-soon/${service.slug}`} className="text-slate-400 hover:text-slate-700 text-[0.625rem] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                              <Link href={`/coming-soon/${service.slug}`} className="bg-slate-100 text-slate-400 text-[0.625rem] font-bold h-8 px-3 uppercase flex items-center">In arrivo</Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
