'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/services';

type AccountType = 'privato' | 'impresa' | 'professionista';

export default function CheckoutDataPage() {
  const router = useRouter();
  const { items, getSubtotal, getIVA, getTotal } = useCart();

  const [accountType, setAccountType] = useState<AccountType>('privato');
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    codiceFiscale: '',
    // Impresa / Professionista
    ragioneSociale: '',
    partitaIva: '',
    pec: '',
    codiceDestinatario: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/checkout/pagamento');
  };

  if (items.length === 0) {
    router.push('/carrello');
    return null;
  }

  const needsDelegate = items.some(item => item.service.requiresDelegate);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Progress Bar */}
      <div className="w-full pt-20 mb-8 md:mb-12">
        <ProgressBar currentStep={2} />
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Dati per la lavorazione
          </h1>
          <p className="text-[#44474e] text-sm">
            Inserisci i dati necessari per elaborare la tua richiesta.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} id="dati-form" className="space-y-8">
              {/* Account Type + Personal Data */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
                  Dati Intestatario
                </h2>

                {/* Account Type Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-3">
                    Tipo di intestatario
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'privato', label: 'Privato', icon: 'person' },
                      { value: 'impresa', label: 'Impresa', icon: 'business' },
                      { value: 'professionista', label: 'Professionista', icon: 'work' },
                    ] as const).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAccountType(opt.value)}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 border rounded-lg transition-all text-xs font-bold ${
                          accountType === opt.value
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Common fields for all types */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                      Nome *
                    </label>
                    <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full" placeholder="Mario" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                      Cognome *
                    </label>
                    <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} className="w-full" placeholder="Rossi" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                      Email *
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" placeholder="mario.rossi@email.it" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                      Telefono
                    </label>
                    <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="w-full" placeholder="+39 333 1234567" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                      Codice Fiscale *
                    </label>
                    <input type="text" name="codiceFiscale" value={formData.codiceFiscale} onChange={handleChange} className="w-full" placeholder="RSSMRA85L01H501Z" required />
                  </div>

                  {/* Impresa / Professionista fields */}
                  {accountType !== 'privato' && (
                    <>
                      <div className="md:col-span-2 pt-2 border-t border-slate-100">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                          {accountType === 'impresa' ? 'Ragione Sociale *' : 'Denominazione Studio *'}
                        </label>
                        <input type="text" name="ragioneSociale" value={formData.ragioneSociale} onChange={handleChange} className="w-full" placeholder={accountType === 'impresa' ? 'Rossi S.r.l.' : 'Studio Rossi'} required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                          Partita IVA *
                        </label>
                        <input type="text" name="partitaIva" value={formData.partitaIva} onChange={handleChange} className="w-full" placeholder="IT12345678901" required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                          PEC
                        </label>
                        <input type="email" name="pec" value={formData.pec} onChange={handleChange} className="w-full" placeholder="azienda@pec.it" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                          Codice Destinatario (SDI)
                        </label>
                        <input type="text" name="codiceDestinatario" value={formData.codiceDestinatario} onChange={handleChange} className="w-full" placeholder="0000000" />
                      </div>
                    </>
                  )}
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
            </form>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                form="dati-form"
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
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-[#002147] mb-5 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <span className="material-symbols-outlined text-[#4463ee]">receipt_long</span>
                Riepilogo
              </h2>

              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#191c1d] font-medium truncate">{item.service.name}</p>
                      <p className="text-xs text-[#74777f]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#002147] whitespace-nowrap">{formatPrice(item.service.price)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm text-[#44474e]">
                  <span>Subtotale</span>
                  <span className="font-medium text-[#191c1d]">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm text-[#44474e]">
                  <span>IVA (22%)</span>
                  <span className="font-medium text-[#191c1d]">{formatPrice(getIVA())}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                  <span className="text-base font-bold text-[#002147]">Totale</span>
                  <span className="text-xl font-extrabold text-[#002147]">{formatPrice(getTotal())}</span>
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
          </div>
        </div>
      </main>
    </div>
  );
}
