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
  const [showFacsimile, setShowFacsimile] = useState(false);

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
    router.push('/checkout/dati');
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
  const priceWithIVA = service.price * 1.22;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow w-full pt-20 pb-12">
        {/* Title row with breadcrumb */}
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

        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left: Form */}
            <div className="lg:col-span-2">
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
                  Inserisci i dati
                </h2>

                <form className="space-y-6" onSubmit={handleBuyNow}>
                  {/* Search Type Toggle (for Visura) */}
                  {hasSearchTypeToggle && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Modalita di Ricerca
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {([
                          { value: 'immobile' as const, label: 'Per Immobile', icon: 'home' },
                          { value: 'soggetto' as const, label: 'Per Soggetto', icon: 'person' },
                          { value: 'soggetto-giuridico' as const, label: 'Sogg. Giuridico', icon: 'business' },
                        ]).map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setSearchType(opt.value)}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 border rounded-lg transition-all text-xs font-bold ${
                              searchType === opt.value
                                ? 'border-[#002147] bg-[#002147] text-white'
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">{opt.icon}</span>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.fields.map(field => renderField(field))}
                  </div>

                  {/* Delegate Warning */}
                  {service.requiresDelegate && (
                    <div className="border-l-4 border-orange-400 bg-orange-50 rounded-r-lg p-3">
                      <p className="text-xs text-orange-900">
                        <strong>Nota:</strong> Questo servizio richiede una delega firmata dal proprietario. Dopo il pagamento, riceverai le istruzioni per completare la procedura.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-5 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    <button
                      type="submit"
                      className="flex-grow bg-[#4463EE] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#002147] transition-all text-sm flex items-center justify-center gap-2"
                    >
                      Acquista ora — {formatPrice(service.price)} + IVA
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="md:w-auto bg-white border border-slate-200 text-[#002147] font-medium py-3 px-5 rounded-xl hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">shopping_cart</span>
                      Aggiungi al carrello
                    </button>
                  </div>
                </form>
              </section>
            </div>

            {/* Right: Summary sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-4">
                {/* Cost Summary */}
                <section className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
                  <h2 className="text-lg font-bold text-[#002147] mb-5 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <span className="material-symbols-outlined text-[#4463ee]">receipt_long</span>
                    Riepilogo
                  </h2>

                  <div className="py-3 border-b border-slate-100">
                    <p className="text-sm text-[#191c1d] font-medium">{service.name}</p>
                    <p className="text-xs text-[#74777f] mt-0.5">Qty: 1</p>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm text-[#44474e]">
                      <span>Prezzo</span>
                      <span className="font-medium text-[#191c1d]">{formatPrice(service.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#44474e]">
                      <span>IVA (22%)</span>
                      <span className="font-medium text-[#191c1d]">{formatPrice(service.price * 0.22)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                      <span className="text-base font-bold text-[#002147]">Totale</span>
                      <span className="text-xl font-extrabold text-[#002147]">{formatPrice(priceWithIVA)}</span>
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-[#44474e]">
                      <span className="material-symbols-outlined text-base text-[#28a428]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                      Documenti consegnati entro 60 minuti
                    </div>
                  </div>
                </section>

                {/* Fac-simile button */}
                <button
                  type="button"
                  onClick={() => setShowFacsimile(true)}
                  className="w-full bg-white rounded-2xl p-4 border border-slate-200/50 shadow-sm flex items-center justify-between hover:border-[#4463ee]/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#4463ee]">description</span>
                    <span className="text-sm font-semibold text-[#002147]">Visualizza fac-simile</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 text-base">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fac-simile Modal */}
      {showFacsimile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowFacsimile(false)}>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4463ee]">description</span>
                <h3 className="text-base font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Fac-simile — {service.name}</h3>
              </div>
              <button onClick={() => setShowFacsimile(false)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <iframe
                src="/facsimile/visura-catastale.pdf"
                className="w-full rounded-lg"
                style={{ height: '75vh' }}
                title="Fac-simile documento"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
