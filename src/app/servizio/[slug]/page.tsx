'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { getServiceBySlug, formatPrice, Service } from '@/data/services';
import { useCart } from '@/context/CartContext';
import Breadcrumb from '@/components/Breadcrumb';

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const service = getServiceBySlug(slug);
  const { addItem } = useCart();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [searchType, setSearchType] = useState<'immobile' | 'soggetto' | 'soggetto-giuridico'>('immobile');

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#002147] mb-4">Servizio non trovato</h1>
            <Link href="/" className="text-[#4463EE] font-semibold hover:underline">
              Torna al catalogo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!service.isActive) {
    router.push(`/coming-soon/${service.slug}`);
    return null;
  }

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    addItem(service, formData);
    router.push('/carrello');
  };

  const handleBuyNow = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(service, formData);
    router.push('/checkout');
  };

  const renderField = (field: Service['fields'][0]) => {
    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {field.label}
            </label>
            <div className="relative">
              <select
                className="w-full bg-white border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-[#4463EE] focus:border-[#4463EE] outline-none transition-all appearance-none"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Seleziona...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">
                expand_more
              </span>
            </div>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-1.5 md:col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {field.label}
            </label>
            <div className="border border-dashed border-slate-300 p-4 text-center hover:border-[#4463EE] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-3xl text-slate-300 mb-1">upload_file</span>
              <p className="text-xs text-on-surface-variant">Clicca per caricare o trascina qui</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PDF, JPG, PNG (max 10MB)</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              {field.label}
            </label>
            <input
              type={field.type}
              className="w-full bg-white border border-slate-200 px-3 py-2 text-sm focus:ring-1 focus:ring-[#4463EE] focus:border-[#4463EE] outline-none transition-all"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          </div>
        );
    }
  };

  const hasSearchTypeToggle = service.slug === 'visura-catastale' || service.slug === 'visura-catastale-storica';

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow w-full pt-20 pb-12">
        {/* Title row with breadcrumb aligned to logo (max-w-[1440px] px-8) */}
        {(() => {
          const categoryToUrl: Record<string, { url: string; label: string }> = {
            'documenti-catastali': { url: '/catalogo/documenti-catastali', label: 'Catasto' },
            'verifiche-ipotecarie': { url: '/catalogo/verifiche-ipotecarie', label: 'Conservatoria' },
            'urbanistica': { url: '/catalogo/urbanistica', label: 'Urbanistica' },
            'marketing-ai': { url: '/#catalog', label: 'Marketing AI' },
            'strumenti-gratuiti': { url: '/catalogo/utility-gratuite', label: 'Utility Gratuite' },
          };
          const cat = categoryToUrl[service.category] || { url: '/#catalog', label: 'Catalogo' };
          return (
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 md:relative mb-8">
              <div className="mb-4 md:mb-0 md:absolute md:left-8 md:top-4">
                <Breadcrumb className="" items={[
                  { label: 'Home', href: '/' },
                  { label: cat.label, href: cat.url },
                  { label: service.name },
                ]} />
              </div>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] tracking-tight mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {service.name}
                </h1>
                <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto">
                  {service.longDescription || service.description}
                </p>
              </div>
            </div>
          );
        })()}

        <div className="w-full max-w-7xl mx-auto px-4 md:px-6">

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Form Section */}
          <div className="w-full lg:w-2/3 workflow-box bg-white p-6 md:p-8" style={{ borderRadius: '6px' }}>
            <form className="space-y-6" onSubmit={handleBuyNow}>
              {/* Search Type Toggle (for Visura) */}
              {hasSearchTypeToggle && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Modalità di Ricerca
                  </label>
                  <div className="flex flex-col md:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => setSearchType('immobile')}
                      className={`flex items-center gap-2 py-2.5 px-4 border transition-all text-xs font-bold ${
                        searchType === 'immobile'
                          ? 'border-[#002147] bg-[#002147] text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{ borderRadius: '6px' }}
                    >
                      <span className="material-symbols-outlined text-base">home</span>
                      Per Immobile
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('soggetto')}
                      className={`flex items-center gap-2 py-2.5 px-4 border transition-all text-xs font-bold ${
                        searchType === 'soggetto'
                          ? 'border-[#002147] bg-[#002147] text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{ borderRadius: '6px' }}
                    >
                      <span className="material-symbols-outlined text-base">person</span>
                      Per Soggetto
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('soggetto-giuridico')}
                      className={`flex items-center gap-2 py-2.5 px-4 border transition-all text-xs font-bold ${
                        searchType === 'soggetto-giuridico'
                          ? 'border-[#002147] bg-[#002147] text-white'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{ borderRadius: '6px' }}
                    >
                      <span className="material-symbols-outlined text-base">business</span>
                      Per Soggetto Giuridico
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.fields.map(field => renderField(field))}
              </div>

              {/* Delegate Warning */}
              {service.requiresDelegate && (
                <div className="border-l-4 border-orange-400 bg-orange-50 p-3">
                  <p className="text-xs text-orange-900">
                    <strong>Nota:</strong> Questo servizio richiede una delega firmata dal proprietario. Dopo il pagamento, riceverai le istruzioni per completare la procedura.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-5 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <button
                  type="submit"
                  className="flex-grow bg-[#4463EE] text-white font-bold py-3 px-6 hover:bg-[#002147] transition-all text-sm flex items-center justify-center gap-2"
                  style={{ borderRadius: '6px' }}
                >
                  Acquista ora — {formatPrice(service.price)} + IVA
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="md:w-auto bg-white border border-slate-200 text-[#002147] font-medium py-3 px-5 hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: '6px' }}
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  Aggiungi al carrello
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-4 lg:sticky lg:top-24">
            {/* Document Preview */}
            <div className="workflow-box bg-white overflow-hidden" style={{ borderRadius: '6px' }}>
              <div className="bg-[#002147] px-4 py-2.5 flex items-center justify-between">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                  Fac-simile Documento
                </span>
                <span className="bg-white/20 text-white text-[9px] px-2 py-0.5">
                  Anteprima PDF
                </span>
              </div>
              <div className="p-5 relative">
                <div className="bg-slate-50 border border-slate-200 p-3 space-y-3 opacity-90 blur-[1px] select-none pointer-events-none">
                  <div className="flex justify-between items-start border-b border-slate-300 pb-2">
                    <div className="w-20 h-3 bg-slate-200"></div>
                    <div className="w-10 h-10 bg-slate-100"></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-slate-100"></div>
                    <div className="w-4/5 h-2.5 bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="h-6 bg-slate-50 border border-slate-200"></div>
                    <div className="h-6 bg-slate-50 border border-slate-200"></div>
                    <div className="h-6 bg-slate-50 border border-slate-200"></div>
                    <div className="h-6 bg-slate-50 border border-slate-200"></div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white border border-slate-200 shadow-md px-3 py-2 flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[#002147]">verified</span>
                    <span className="text-xs font-bold text-[#002147]">Visura Ufficiale</span>
                    <span className="text-[9px] text-slate-500 text-center leading-tight">
                      Dati reali dall&apos;Agenzia delle Entrate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3 workflow-box bg-white p-3" style={{ borderRadius: '6px' }}>
                <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-1.5 text-lg">speed</span>
                <div>
                  <p className="text-xs font-bold text-[#002147]">Velocità estrema</p>
                  <p className="text-[10px] text-slate-500">Consegna media: 12 minuti</p>
                </div>
              </div>
              <div className="flex items-center gap-3 workflow-box bg-white p-3" style={{ borderRadius: '6px' }}>
                <span className="material-symbols-outlined text-[#4463EE] bg-blue-50 p-1.5 text-lg">verified_user</span>
                <div>
                  <p className="text-xs font-bold text-[#002147]">Dati Garantiti</p>
                  <p className="text-[10px] text-slate-500">Direttamente dai database AdE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
