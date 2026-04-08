'use client';

import { useState } from 'react';
import Link from 'next/link';
import HeaderSimplified from '@/components/HeaderSimplified';
import Footer from '@/components/Footer';
import { formatPrice } from '@/data/services';

const mockSelectedServices = [
  { id: '1', name: 'Visura Catastale', details: 'Roma, F:123, P:456', price: 15.00 },
  { id: '2', name: 'Planimetria Catastale', details: 'Roma, F:123, P:456', price: 18.50, requiresDelegate: true },
  { id: '3', name: 'Estratto Mappa', details: 'Roma, F:123, P:456', price: 12.01 },
];

export default function RiepilogoInvioPage() {
  const [clientData, setClientData] = useState({
    nome: '',
    email: '',
    telefono: ''
  });
  const [sendMethod, setSendMethod] = useState<'both' | 'email' | 'whatsapp'>('both');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const subtotal = mockSelectedServices.reduce((sum, s) => sum + s.price, 0);
  const iva = subtotal * 0.22;
  const total = subtotal + iva;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Ordine inviato al cliente ${clientData.nome} via ${sendMethod === 'both' ? 'Email e WhatsApp' : sendMethod}.\n\nTotale: ${formatPrice(total)}\n\n(Demo - nessun dato reale inviato)`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <HeaderSimplified />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="text-[#002147]">Selezione</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[#002147] bg-blue-50 px-3 py-1 rounded-full">Riepilogo dell&apos;ordine</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span>Invio</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#002147] tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Rivedi e Invia
                </h1>
                <p className="text-[#44474e] mt-1">Controlla i dettagli prima di procedere con l&apos;invio al cliente.</p>
              </div>
              <Link
                href="/pro/prepara-ordine"
                className="inline-flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider hover:text-[#002147] bg-slate-100 px-4 py-2 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Torna alla selezione
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Order Details */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-sm">1</span>
                  <h2 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dettagli Ordine</h2>
                </div>

                <div className="bg-slate-50 rounded-2xl p-1 border border-slate-100 space-y-2">
                  {mockSelectedServices.map(service => (
                    <div
                      key={service.id}
                      className={`bg-white rounded-xl border border-slate-100 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm ${
                        service.requiresDelegate ? 'border-l-4 border-l-amber-400' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className="font-bold text-[#002147]">{service.name}</h4>
                          {service.requiresDelegate && (
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Delega richiesta
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded italic">
                          {service.details}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-[#002147]">{formatPrice(service.price)}</span>
                        <div className="flex items-center gap-2">
                          <button type="button" className="text-xs font-bold text-[#002147] hover:bg-[#002147]/5 px-3 py-1.5 rounded-lg transition-colors border border-[#002147]/10">
                            Modifica
                          </button>
                          <button type="button" className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Client Data */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-sm">2</span>
                  <h2 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati Destinatario</h2>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        Nome e Cognome cliente
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={clientData.nome}
                        onChange={handleChange}
                        placeholder="Mario Rossi"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        Email di ricezione
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={clientData.email}
                        onChange={handleChange}
                        placeholder="cliente@email.it"
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                        Cellulare (WhatsApp)
                      </label>
                      <input
                        type="tel"
                        name="telefono"
                        value={clientData.telefono}
                        onChange={handleChange}
                        placeholder="+39 345..."
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Total & Send */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-8 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold text-sm">3</span>
                  <h2 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Totale &amp; Invio</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Totals */}
                  <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex justify-between text-sm text-slate-500 border-b border-slate-200 pb-3">
                      <span>Imponibile</span>
                      <span className="font-bold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 border-b border-slate-200 pb-3">
                      <span>IVA (22%)</span>
                      <span className="font-bold">{formatPrice(iva)}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-base font-bold text-[#002147]">Totale Ordine</span>
                      <span className="text-3xl font-extrabold text-[#002147] tracking-tight">{formatPrice(total)}</span>
                    </div>
                    <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                      <span className="material-symbols-outlined text-emerald-600">info</span>
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        Il cliente ricevera un link sicuro per il pagamento. L&apos;ordine verra processato immediatamente dopo la transazione.
                      </p>
                    </div>
                  </div>

                  {/* Send Buttons */}
                  <div className="lg:col-span-7 space-y-4">
                    <button
                      type="submit"
                      className="w-full bg-[#002147] text-white font-extrabold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#002147]/90 transition-all hover:shadow-xl group"
                    >
                      <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                      <span className="text-lg uppercase tracking-wider">Invia Riepilogo e Link Pagamento</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSendMethod('email')}
                        className={`bg-white border-2 text-[#002147] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${
                          sendMethod === 'email' ? 'border-[#002147]' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">mail</span>
                        Solo Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setSendMethod('whatsapp')}
                        className={`bg-white border-2 text-[#002147] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs ${
                          sendMethod === 'whatsapp' ? 'border-[#002147]' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                        Solo WhatsApp
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                      <div className="flex items-center text-emerald-600 gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Protocollo Sicuro</span>
                      </div>
                      <span className="text-[10px] text-slate-500 max-w-[180px] leading-tight">
                        Pagamenti gestiti tramite crittografia 256-bit
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
              Prospettiva.io Pro - Servizi Catastali Evoluti
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
