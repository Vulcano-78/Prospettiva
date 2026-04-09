'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useCart } from '@/context/CartContext';

export default function ConfirmationPage() {
  const { clearCart, items } = useCart();

  useEffect(() => {
    if (items.length > 0) {
      clearCart();
    }
  }, [clearCart, items.length]);

  const orderId = `PRSP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow flex flex-col items-center px-6 py-12 md:py-16">
        <div className="max-w-4xl w-full">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <span className="block text-xs font-bold uppercase tracking-widest text-[#516169] mb-4">
              Ordine Confermato
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#002147] tracking-tight leading-tight mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              La tua richiesta e in elaborazione.
            </h1>
            <p className="text-lg text-[#44474e] max-w-xl mx-auto">
              I nostri sistemi stanno elaborando i dati catastali aggiornati. Riceverai il documento direttamente nella tua casella email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Order Details Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#516169] mb-1">
                      Tempo Stimato
                    </p>
                    <p className="text-3xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      15-30 min
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[#002147]">schedule</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#4463ee]">mail</span>
                    <p className="text-sm text-[#44474e]">
                      Controlla la tua email per il download. Ti avviseremo appena il file sara pronto.
                    </p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#516169]">verified_user</span>
                    <p className="text-sm text-[#44474e]">
                      Documento estratto dai database ufficiali dell&apos;Agenzia delle Entrate.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs text-[#516169] italic">ID Ordine: #{orderId}</p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-[#002147] text-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Il tuo Archivio Documentale
              </h2>
              <p className="text-[#708ab5] mb-6 text-sm leading-relaxed">
                Non perdere mai piu una visura. Con l&apos;archivio digitale puoi conservare, organizzare e consultare tutti i tuoi documenti acquistati in un unico posto sicuro.
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#4463ee]">folder_shared</span>
                  Accesso immediato allo storico ordini
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#4463ee]">cloud_download</span>
                  Download illimitati dei tuoi PDF
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <span className="material-symbols-outlined text-[#4463ee]">security</span>
                  Protezione crittografata dei dati
                </li>
              </ul>

              <Link
                href="/registrazione"
                className="block w-full bg-[#4463ee] text-white text-center font-extrabold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                Accedi o crea il tuo Archivio
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all"
            >
              Esplora altri strumenti
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {/* Support Box */}
          <div className="mt-12 bg-white border border-slate-100 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-[#4463ee] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
              help
            </span>
            <h3 className="font-bold text-[#002147] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Serve aiuto?
            </h3>
            <p className="text-sm text-[#44474e] mb-3">
              Il nostro supporto tecnico e a tua disposizione per qualsiasi chiarimento.
            </p>
            <a
              href="mailto:info@prospettiva.io"
              className="text-[#002147] font-bold text-sm hover:underline"
            >
              Contatta assistenza
            </a>
          </div>
        </div>
      </main>

    </div>
  );
}
