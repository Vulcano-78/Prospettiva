'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderSimplified from '@/components/HeaderSimplified';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/services';

export default function CheckoutDataPage() {
  const router = useRouter();
  const { items, getTotal } = useCart();

  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    codiceFiscale: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/conferma');
  };

  if (items.length === 0) {
    router.push('/carrello');
    return null;
  }

  const needsDelegate = items.some(item => item.service.requiresDelegate);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HeaderSimplified />

      <main className="flex-grow pt-8 pb-24 px-4 md:px-6 max-w-3xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-8 md:mb-12">
          <ProgressBar currentStep={2} />
        </div>

        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Dati per la lavorazione
          </h1>
          <p className="text-[#44474e] text-sm">
            Inserisci i dati necessari per elaborare la tua richiesta.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Data */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
              Dati Intestatario
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Mario"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  name="cognome"
                  value={formData.cognome}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Rossi"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="mario.rossi@email.it"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="+39 333 1234567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                  Codice Fiscale *
                </label>
                <input
                  type="text"
                  name="codiceFiscale"
                  value={formData.codiceFiscale}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="RSSMRA85L01H501Z"
                  required
                />
              </div>
            </div>
          </section>

          {/* Delegate Section */}
          {needsDelegate && (
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-amber-200/50 shadow-sm">
              <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">2</span>
                Delega Proprietario
              </h2>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-amber-900">
                  <strong>Attenzione:</strong> Per richiedere planimetrie e altri documenti riservati e necessaria una delega firmata dal proprietario dell&apos;immobile.
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

          {/* Order Summary */}
          <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
            <h2 className="text-lg font-bold text-[#002147] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Riepilogo Ordine
            </h2>

            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-[#191c1d]">{item.service.name}</span>
                  <span className="text-sm font-bold text-[#002147]">{formatPrice(item.service.price)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-base font-bold text-[#002147]">Totale</span>
              <span className="text-2xl font-extrabold text-[#002147]">{formatPrice(getTotal())}</span>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className="w-full bg-[#4463ee] text-white font-extrabold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
            >
              <span>Procedi al pagamento — {formatPrice(getTotal())}</span>
              <span className="material-symbols-outlined">payments</span>
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="w-full bg-white border border-slate-200 text-[#002147] font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Torna al carrello
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
