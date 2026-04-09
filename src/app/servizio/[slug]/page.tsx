'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { getServiceBySlug, formatPrice, provinces, Service } from '@/data/services';
import { useCart } from '@/context/CartContext';

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const service = getServiceBySlug(slug);
  const { addItem } = useCart();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [searchType, setSearchType] = useState<'immobile' | 'soggetto'>('immobile');

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#002147] mb-4">Servizio non trovato</h1>
            <Link href="/" className="text-[#4463ee] font-semibold hover:underline">
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
          <div key={field.name} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#516169]">
              {field.label}
            </label>
            <div className="relative">
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#002147] focus:border-[#002147] outline-none transition-all appearance-none"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              >
                <option value="">Seleziona...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3 pointer-events-none text-slate-400">
                expand_more
              </span>
            </div>
          </div>
        );

      case 'file':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#516169]">
              {field.label}
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#4463ee] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">upload_file</span>
              <p className="text-sm text-[#44474e]">Clicca per caricare o trascina qui</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#516169]">
              {field.label}
            </label>
            <input
              type={field.type}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#002147] focus:border-[#002147] outline-none transition-all"
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
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold tracking-widest uppercase mb-4 border border-blue-100">
            Servizio Professionale
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#002147] tracking-tight mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {service.name}
          </h1>
          <p className="text-lg text-[#44474e] max-w-2xl mx-auto">
            {service.longDescription || service.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Form Section */}
          <div className="w-full lg:w-2/3 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10">
            <form className="space-y-8" onSubmit={handleBuyNow}>
              {/* Search Type Toggle (for Visura) */}
              {hasSearchTypeToggle && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                    Modalita di Ricerca
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSearchType('immobile')}
                      className={`flex items-center justify-center gap-2 py-4 px-4 border-2 rounded-xl cursor-pointer transition-all font-bold ${
                        searchType === 'immobile'
                          ? 'border-[#002147] bg-[#002147] text-white'
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">home</span>
                      Per Immobile
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('soggetto')}
                      className={`flex items-center justify-center gap-2 py-4 px-4 border-2 rounded-xl cursor-pointer transition-all font-bold ${
                        searchType === 'soggetto'
                          ? 'border-[#002147] bg-[#002147] text-white'
                          : 'border-slate-100 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">person</span>
                      Per Soggetto
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.fields.map(field => renderField(field))}
              </div>

              {/* Delegate Warning */}
              {service.requiresDelegate && (
                <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                  <p className="text-sm text-orange-900">
                    <strong>Nota:</strong> Questo servizio richiede una delega firmata dal proprietario. Dopo il pagamento, riceverai le istruzioni per completare la procedura.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                <button
                  type="submit"
                  className="flex-grow bg-[#4463ee] text-white font-extrabold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all text-lg flex items-center justify-center gap-3"
                >
                  Scarica Ora — {formatPrice(service.price)}
                  <span className="material-symbols-outlined">payments</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="md:w-auto bg-white border-2 border-slate-200 text-[#002147] font-bold py-4 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-base flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">shopping_cart</span>
                  Aggiungi al carrello
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-24">
            {/* Document Preview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden">
              <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
                <span className="text-white text-xs font-bold uppercase tracking-widest">
                  Fac-simile Documento
                </span>
                <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                  Anteprima PDF
                </span>
              </div>
              <div className="p-6 relative">
                <div className="bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 space-y-4 opacity-90 blur-[1px] select-none pointer-events-none">
                  <div className="flex justify-between items-start border-b border-slate-300 pb-2">
                    <div className="w-20 h-4 bg-slate-200 rounded"></div>
                    <div className="w-12 h-12 bg-slate-100 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-slate-100 rounded"></div>
                    <div className="w-4/5 h-3 bg-slate-100 rounded"></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-8 bg-slate-50 rounded border border-slate-200"></div>
                    <div className="h-8 bg-slate-50 rounded border border-slate-200"></div>
                    <div className="h-8 bg-slate-50 rounded border border-slate-200"></div>
                    <div className="h-8 bg-slate-50 rounded border border-slate-200"></div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 border border-slate-200 shadow-lg px-4 py-3 rounded-xl flex flex-col items-center gap-1">
                    <span className="material-symbols-outlined text-[#002147]">verified</span>
                    <span className="text-sm font-bold text-slate-900">Visura Ufficiale</span>
                    <span className="text-[10px] text-slate-500 text-center leading-tight">
                      I dati reali saranno quelli dell&apos;Agenzia delle Entrate
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-emerald-600 bg-emerald-50 p-2 rounded-lg">speed</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Velocita estrema</p>
                  <p className="text-xs text-slate-500">Consegna media: 12 minuti</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-2 rounded-lg">verified_user</span>
                <div>
                  <p className="text-sm font-bold text-slate-900">Dati Garantiti</p>
                  <p className="text-xs text-slate-500">Direttamente dai database AdE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
