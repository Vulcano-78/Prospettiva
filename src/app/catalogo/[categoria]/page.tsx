'use client';

import { useState, use } from 'react';
import Link from 'next/link';
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

export default function CatalogoCategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = use(params);
  const { addItem } = useCart();

  const config = categoryConfig[categoria];
  if (!config) {
    notFound();
  }

  const dataCategory = categoryToDataKey[categoria];
  const categoryServices = getServicesByCategory(dataCategory);

  // For Urbanistica, also include Marketing AI items? No, keep it strictly per category.
  // For utility-gratuite, the data category is 'strumenti-gratuiti'

  const handleAddToCart = (slug: string) => {
    const service = services.find(s => s.slug === slug);
    if (service) addItem(service);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Header section with title */}
      <section className="hero-gradient pt-24 pb-12 px-8"><div className="max-w-7xl mx-auto">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: config.title },
        ]} />
        <div className="text-center mb-12">
          <h1 className="text-[42px] md:text-5xl text-[#002147] mb-4">{config.title}</h1>
          <p className="text-on-surface-variant text-lg md:text-xl font-normal max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            {config.description}
          </p>
        </div>
        </div>
      </section>

      {/* Services Box */}
      <section className="pb-24 px-8" style={{ background: 'linear-gradient(180deg, transparent 0%, #eef0ff40 15%, #eef0ff60 50%, #eef0ff40 85%, transparent 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="workflow-box p-8 flex flex-col bg-white">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <span className="w-10 h-10 flex-shrink-0 border border-primary-container flex items-center justify-center font-bold text-sm text-primary-container bg-white">{config.number}</span>
              <div>
                <h2 className="text-xl text-primary-container leading-none mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-xl">{config.icon}</span> {config.title}
                </h2>
                <p className="text-xs text-on-surface-variant">{config.description}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-on-surface-variant uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 font-bold">Servizio</th>
                    <th className="py-3 font-bold text-right pr-4">Prezzo</th>
                    <th className="py-3 font-bold text-center w-16">Qtà</th>
                    <th className="py-3 font-bold text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categoryServices.map((service) => (
                    <tr key={service.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="text-sm font-bold text-primary-container">{service.shortName}</div>
                        <div className="text-[11px] text-on-surface-variant">{service.description}</div>
                      </td>
                      <td className="py-4 text-right pr-4">
                        {service.price > 0 ? (
                          <>
                            <span className="text-sm font-semibold text-primary-container">€{service.price.toFixed(2)}</span>
                            <span className="text-[9px] text-on-surface-variant/60 block">escl. IVA</span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-[#4463EE]">Gratis</span>
                        )}
                      </td>
                      <td className="py-4 px-1">
                        {service.isActive && service.price > 0 ? (
                          <input className="qty-input w-full h-8 border border-slate-200 text-center text-xs focus:ring-0 focus:border-secondary" min="1" type="number" defaultValue="1" />
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {service.isActive ? (
                            service.price > 0 ? (
                              <>
                                <Link href={`/servizio/${service.slug}`} className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                                <button
                                  onClick={() => handleAddToCart(service.slug)}
                                  className="border border-slate-300 text-slate-500 h-8 w-[60px] flex items-center justify-center hover:bg-slate-100 bg-slate-50"
                                >
                                  <span className="material-symbols-outlined !text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>add_shopping_cart</span>
                                </button>
                                <Link href={`/servizio/${service.slug}`} className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-3 hover:bg-slate-300 uppercase flex items-center">Acquista</Link>
                              </>
                            ) : (
                              <>
                                <Link href={`/servizio/${service.slug}`} className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                                <Link href={`/servizio/${service.slug}`} className="bg-slate-200 text-slate-600 text-[10px] font-bold h-8 px-3 hover:bg-slate-300 uppercase flex items-center">Apri</Link>
                              </>
                            )
                          ) : (
                            <>
                              <Link href={`/coming-soon/${service.slug}`} className="text-slate-400 hover:text-slate-700 text-[10px] uppercase tracking-wide transition-colors mr-1">Dettagli</Link>
                              <Link href={`/coming-soon/${service.slug}`} className="bg-slate-100 text-slate-400 text-[10px] font-bold h-8 px-3 uppercase flex items-center">In arrivo</Link>
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
