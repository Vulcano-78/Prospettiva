'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { services, categories, formatPrice } from '@/data/services';

const packages = [
  { id: 'dossier-base', name: 'Dossier Catastale Base', description: 'Visura e planimetria aggiornata', price: 19.90, services: ['Visura Catastale', 'Planimetria Catastale'] },
  { id: 'dossier-completo', name: 'Dossier Catastale Completo', description: 'Storico, planimetrie e report conformita', price: 45.50, services: ['Visura Storica', 'Planimetria', 'Elaborato Planimetrico'] },
];

export default function PreparaOrdinePage() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('documenti-catastali');

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddPackage = (pkg: typeof packages[0]) => {
    const serviceIds = services.filter(s => pkg.services.some(ps => s.name.includes(ps))).map(s => s.id);
    setSelectedServices(prev => [...new Set([...prev, ...serviceIds])]);
  };

  const getTotal = () => {
    return selectedServices.reduce((sum, id) => {
      const service = services.find(s => s.id === id);
      return sum + (service?.price || 0);
    }, 0);
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      router.push('/pro/riepilogo-invio');
    }
  };

  const categoryServices = services.filter(s => s.category === activeTab && s.isActive);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] tracking-tight leading-tight mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Prepara un ordine per il tuo cliente
              </h1>
              <p className="text-base text-[#44474e]">
                Seleziona i documenti necessari per la pratica. Scegli tra pacchetti pronti o componi l&apos;ordine con servizi singoli.
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-xl">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#4463ee] text-white flex items-center justify-center font-bold text-sm mb-1">1</div>
                <span className="text-[10px] font-bold uppercase tracking-tight text-[#002147]">Prepari il pacchetto</span>
              </div>
              <div className="w-12 h-[2px] bg-slate-300 mb-4"></div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm mb-1">2</div>
                <span className="text-[10px] font-bold uppercase tracking-tight">Riepilogo</span>
              </div>
              <div className="w-12 h-[2px] bg-slate-300 mb-4"></div>
              <div className="flex flex-col items-center opacity-40">
                <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center font-bold text-sm mb-1">3</div>
                <span className="text-[10px] font-bold uppercase tracking-tight">Invio</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-12">
          {/* Sidebar */}
          <aside className="w-1/4 hidden lg:block">
            <div className="sticky top-28 space-y-2">
              <h3 className="text-[11px] font-black text-[#002147] uppercase tracking-widest mb-4 px-4">Esplora</h3>

              <Link
                href="#packages"
                className="flex items-center gap-3 px-4 py-3 bg-[#4463ee] text-white font-bold rounded-xl shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">inventory_2</span>
                <span className="text-sm">Pacchetti preconfezionati</span>
              </Link>

              <Link
                href="#services"
                className="flex items-center gap-3 px-4 py-3 text-[#44474e] hover:bg-slate-100 rounded-xl font-medium"
              >
                <span className="material-symbols-outlined text-xl">grid_view</span>
                <span className="text-sm">Servizi singoli</span>
              </Link>

              <div className="mt-12 p-6 bg-[#002147] rounded-2xl text-white">
                <p className="font-bold text-base mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Hai bisogno di aiuto?</p>
                <p className="text-xs text-blue-200 mb-4">Un nostro esperto e pronto ad assisterti nella scelta.</p>
                <button className="bg-white/10 hover:bg-white/20 w-full py-2 rounded-lg text-sm font-bold border border-white/20 transition-all">
                  Contatta Supporto
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* Packages */}
            <section id="packages">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Pacchetti preconfezionati</h2>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Soluzioni veloci</span>
              </div>

              <div className="space-y-3">
                {packages.map(pkg => (
                  <div key={pkg.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#002147]/5 flex items-center justify-center text-[#002147]">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#002147]">{pkg.name}</h4>
                        <p className="text-xs text-[#44474e]">{pkg.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-lg font-bold text-[#002147]">{formatPrice(pkg.price)}</span>
                      <button
                        onClick={() => handleAddPackage(pkg)}
                        className="bg-[#002147] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#002147]/90 transition-colors"
                      >
                        Aggiungi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* Individual Services */}
            <section id="services">
              <h2 className="text-xl font-bold text-[#002147] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Servizi singoli</h2>

              {/* Category Tabs */}
              <div className="flex items-center border-b border-slate-200 mb-8 overflow-x-auto">
                {categories.slice(0, 4).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                      activeTab === cat.id
                        ? 'border-[#4463ee] text-[#002147] font-bold'
                        : 'border-transparent text-slate-500 hover:text-[#002147]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-50">
                {categoryServices.map(service => (
                  <div
                    key={service.id}
                    className={`p-5 flex items-center gap-5 transition-colors ${
                      selectedServices.includes(service.id) ? 'bg-[#4463ee]/5' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#002147]/5 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#002147]">{service.categoryIcon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-[#002147]">{service.name}</h4>
                        {service.requiresDelegate && (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                            Delega richiesta
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#44474e]">{service.description}</p>
                    </div>
                    <div className="text-right px-6 shrink-0">
                      <span className="text-lg font-bold text-[#002147]">{formatPrice(service.price)}</span>
                    </div>
                    <button
                      onClick={() => handleToggleService(service.id)}
                      className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                        selectedServices.includes(service.id)
                          ? 'bg-[#002147] text-white'
                          : 'bg-white border border-[#002147]/10 text-[#002147] hover:bg-[#002147] hover:text-white'
                      }`}
                    >
                      {selectedServices.includes(service.id) ? 'Selezionato' : 'Aggiungi'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <section className="sticky bottom-0 bg-white border-t border-slate-200 py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div>
                <span className="text-2xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {selectedServices.length} servizi selezionati
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                  La tua configurazione
                </span>
              </div>
              <div className="hidden md:block h-12 w-[1px] bg-slate-200"></div>
              <div>
                <span className="text-3xl font-extrabold text-[#002147]">{formatPrice(getTotal())}</span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
                  Totale + IVA
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {selectedServices.length > 0 && (
                <button
                  onClick={() => setSelectedServices([])}
                  className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <span className="material-symbols-outlined">delete</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Svuota tutto</span>
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={selectedServices.length === 0}
                className="bg-[#4463ee] text-white px-10 py-4 rounded-2xl font-extrabold flex items-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-[#4463ee]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">Continua all&apos;invio</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
