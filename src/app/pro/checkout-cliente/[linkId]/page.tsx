'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import HeaderSimplified from '@/components/HeaderSimplified';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ProgressBar';
import { formatPrice } from '@/data/services';

// Simulated order data - in a real app, this would come from the backend based on linkId
const mockOrder = {
  studioName: 'Studio Valeri & Associati',
  services: [
    { id: '1', name: 'Visura Catastale', details: 'Roma, F:123, P:456', price: 15.00 },
    { id: '2', name: 'Planimetria Catastale', details: 'Roma, F:123, P:456', price: 18.50, requiresDelegate: true },
    { id: '3', name: 'Estratto Mappa', details: 'Roma, F:123, P:456', price: 12.01 },
  ],
  clientName: 'Mario Rossi',
  clientEmail: 'mario.rossi@email.it'
};

export default function CheckoutClientePage() {
  const params = useParams();
  const router = useRouter();
  const linkId = params.linkId as string;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: mockOrder.clientName,
    cognome: '',
    email: mockOrder.clientEmail,
    telefono: '',
    codiceFiscale: ''
  });

  const subtotal = mockOrder.services.reduce((sum, s) => sum + s.price, 0);
  const iva = subtotal * 0.22;
  const total = subtotal + iva;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/conferma');
    }
  };

  const needsDelegate = mockOrder.services.some(s => s.requiresDelegate);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HeaderSimplified showBackToShop={false} />

      {/* Studio Banner */}
      <div className="bg-[#002147] text-white py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-[#4463ee]">storefront</span>
          <span className="text-sm">
            <strong>{mockOrder.studioName}</strong> ti ha preparato un ordine
          </span>
        </div>
      </div>

      <main className="flex-grow pt-8 pb-24 px-4 md:px-6 max-w-2xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar currentStep={currentStep} />
        </div>

        {/* Step 1: Review Order */}
        {currentStep === 1 && (
          <>
            <header className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Riepilogo Ordine
              </h1>
              <p className="text-[#44474e] text-sm">
                Verifica i servizi inclusi nel tuo ordine.
              </p>
            </header>

            <div className="space-y-4 mb-8">
              {mockOrder.services.map(service => (
                <div
                  key={service.id}
                  className={`bg-white rounded-xl p-5 shadow-sm border flex items-center justify-between ${
                    service.requiresDelegate ? 'border-l-4 border-l-amber-400 border-slate-100' : 'border-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-[#002147]">{service.name}</h3>
                      {service.requiresDelegate && (
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          Delega richiesta
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#44474e]">{service.details}</p>
                  </div>
                  <span className="font-bold text-[#002147]">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-slate-50 rounded-xl p-6 border border-dashed border-slate-200 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-[#44474e]">
                  <span>Subtotale</span>
                  <span className="font-medium text-[#191c1d]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#44474e]">
                  <span>IVA (22%)</span>
                  <span className="font-medium text-[#191c1d]">{formatPrice(iva)}</span>
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-base font-bold text-[#002147]">Totale</span>
                  <span className="text-2xl font-extrabold tracking-tight text-[#002147]">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-[#4463ee] text-white font-extrabold py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
            >
              Continua
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </>
        )}

        {/* Step 2: Data Entry */}
        {currentStep === 2 && (
          <>
            <header className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                I tuoi dati
              </h1>
              <p className="text-[#44474e] text-sm">
                Inserisci i dati necessari per completare l&apos;ordine.
              </p>
            </header>

            <form className="space-y-8">
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
                  Dati Personali
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nome</label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Cognome</label>
                    <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} required />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Telefono</label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Codice Fiscale</label>
                    <input type="text" name="codiceFiscale" value={formData.codiceFiscale} onChange={handleChange} required />
                  </div>
                </div>
              </section>

              {needsDelegate && (
                <section className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm space-y-5">
                  <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">2</span>
                    Delega Proprietario
                  </h2>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-900">
                      <strong>Attenzione:</strong> Per alcuni documenti di questo ordine e necessaria una delega firmata.
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#4463ee] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">upload_file</span>
                    <p className="text-sm font-medium text-[#002147]">Carica il documento di delega</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </section>
              )}

              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-[#4463ee] text-white font-extrabold py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
              >
                Procedi al pagamento
                <span className="material-symbols-outlined">payments</span>
              </button>
            </form>
          </>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <>
            <header className="mb-8 text-center">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Pagamento
              </h1>
              <p className="text-[#44474e] text-sm">
                Completa il pagamento in modo sicuro.
              </p>
            </header>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <span className="font-bold text-[#002147]">Totale da pagare</span>
                <span className="text-3xl font-extrabold text-[#002147]">{formatPrice(total)}</span>
              </div>

              {/* Simulated Payment Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Numero carta
                  </label>
                  <input type="text" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Scadenza
                    </label>
                    <input type="text" placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      CVV
                    </label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-[#4463ee] text-white font-extrabold py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
            >
              Paga {formatPrice(total)}
              <span className="material-symbols-outlined">lock</span>
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Pagamento sicuro con crittografia SSL
            </div>
          </>
        )}

        {/* Back Button */}
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full mt-4 bg-white border border-slate-200 text-[#002147] font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Indietro
          </button>
        )}
      </main>

      <Footer />
    </div>
  );
}
