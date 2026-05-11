'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';

type PageState = 'loading' | 'deciding' | 'processing' | 'done'

const BEACON_TIMEOUT = 90

export default function ConfirmationPage() {
  const { clearCart, items } = useCart();
  const router = useRouter();
  const processed = useRef(false);
  const [pageState, setPageState] = useState<PageState>('loading');
  const [orderRef, setOrderRef] = useState('');
  const [savedToDashboard, setSavedToDashboard] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(BEACON_TIMEOUT);

  // Pulisci il carrello una sola volta (i dati dell'ordine sono in Stripe).
  useEffect(() => {
    if (items.length > 0) clearCart();
  }, [clearCart, items.length]);

  const processOrder = useCallback(async () => {
    if (processed.current) return;
    processed.current = true;
    setPageState('processing');

    // Stripe mette payment_intent come query param sul return_url.
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get('payment_intent');

    localStorage.removeItem('pendingOrder');
    localStorage.removeItem('checkoutEmail');
    localStorage.removeItem('checkoutEmailDocumenti');

    if (!paymentIntentId) {
      // Nessun PI: niente da confermare. Probabilmente l'utente è arrivato qui
      // senza passare dal flusso Stripe. Mostra solo "done" senza orderRef.
      setPageState('done');
      return;
    }

    try {
      const res = await fetch('/api/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      });
      const json = await res.json();
      setOrderRef(json.orderRef || '');
      setSavedToDashboard(json.saved || false);
    } catch {
      setOrderRef('');
    }
    setPageState('done');
  }, []);

  // Determina stato auth e procede
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        processOrder();
      } else {
        setPageState('deciding');
      }
    });
  }, [processOrder]);

  // Timer conto alla rovescia per i guest
  useEffect(() => {
    if (pageState !== 'deciding') return;
    if (secondsLeft <= 0) {
      processOrder();
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [pageState, secondsLeft, processOrder]);

  // Safety net pagamento → fulfillment: ora è il webhook Stripe server-side
  // (vedi /api/stripe-webhook), quindi non serve più sendBeacon su unload.

  const handleGuestChoice = () => processOrder();

  const handleAuthChoice = (destination: 'login' | 'registrazione') => {
    localStorage.setItem('pendingOrderAfterAuth', 'true');
    router.push(`/${destination}`);
  };

  // --- STATI UI ---

  if (pageState === 'loading') return null;

  if (pageState === 'deciding') {
    const pct = (secondsLeft / BEACON_TIMEOUT) * 100;
    return (
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full">
            <div className="text-center mb-8">
              <span className="material-symbols-outlined text-[#28a428] mb-4 block" style={{ fontSize: '4rem', fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="block text-xs font-bold uppercase tracking-widest text-[#516169] mb-2">
                Pagamento confermato
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#002147] tracking-tight mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Il tuo ordine è in elaborazione
              </h1>
              <p className="text-sm text-[#44474e]">
                Riceverai il documento via email. Vuoi trovarlo anche nella tua dashboard?
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#4463ee]/10 rounded-xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#4463ee]" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#002147] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Salva nella tua dashboard
                    </h2>
                    <p className="text-sm text-[#44474e]">
                      Registrandoti, questo e tutti i prossimi documenti saranno sempre disponibili per il download dalla tua area personale.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleAuthChoice('registrazione')}
                    className="w-full bg-[#4463ee] text-white font-extrabold py-4 rounded-xl hover:brightness-110 transition-all shadow"
                  >
                    Registrati e salva il documento
                  </button>
                  <button
                    onClick={() => handleAuthChoice('login')}
                    className="w-full bg-[#002147] text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Accedi al tuo account
                  </button>
                  <button
                    onClick={handleGuestChoice}
                    className="w-full text-[#516169] text-sm font-medium py-3 hover:text-[#002147] transition-colors"
                  >
                    No grazie, inviamelo solo via email
                  </button>
                </div>
              </div>

              {/* Timer bar */}
              <div className="px-8 pb-6">
                <div className="flex items-center justify-between text-xs text-[#516169] mb-1.5">
                  <span>Invio automatico senza account tra</span>
                  <span className="font-bold tabular-nums">{secondsLeft}s</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4463ee] rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (pageState === 'processing') {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
        <main className="flex-grow flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4463ee] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="font-bold text-[#002147] text-lg">Stiamo elaborando il tuo ordine…</p>
          </div>
        </main>
      </div>
    );
  }

  // --- DONE ---
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow flex flex-col items-center px-6 pt-20 pb-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <span className="material-symbols-outlined text-[#28a428] mb-4 block" style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontVariationSettings: "'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48" }}>
              check
            </span>
            <span className="block text-xs font-bold uppercase tracking-widest text-[#516169] mb-4">
              Ordine Confermato
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] tracking-tight leading-tight mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
              La tua richiesta è in elaborazione.
            </h1>
            <p className="text-base text-[#44474e] max-w-xl mx-auto">
              I nostri sistemi stanno elaborando i dati catastali aggiornati. Riceverai il documento direttamente nella tua casella email.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Order Details */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#516169] mb-1">Tempo Stimato</p>
                    <p className="text-3xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Entro 60 minuti</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-[#002147]">schedule</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#4463ee]">speed</span>
                    <p className="text-sm text-[#44474e]">La maggior parte degli ordini viene evasa in pochi minuti.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#4463ee]">mail</span>
                    <p className="text-sm text-[#44474e]">Controlla la tua email per il download.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="material-symbols-outlined text-[#516169]">verified_user</span>
                    <p className="text-sm text-[#44474e]">Documento estratto dai database ufficiali dell&apos;Agenzia delle Entrate.</p>
                  </div>
                </div>
                {orderRef && (
                  <div className="pt-6 border-t border-slate-100">
                    <p className="text-xs text-[#516169] italic">ID Ordine: #{orderRef}</p>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Card */}
            {savedToDashboard ? (
              <div className="bg-[#002147] text-white rounded-2xl p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-[#4463ee] text-4xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
                  <h2 className="text-2xl font-extrabold mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Documento salvato
                  </h2>
                  <p className="text-[#708ab5] text-sm leading-relaxed mb-6">
                    Questo documento sarà disponibile nella tua dashboard non appena elaborato.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full bg-[#4463ee] text-white text-center font-extrabold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg"
                >
                  Vai alla Dashboard
                </Link>
              </div>
            ) : (
              <div className="bg-[#002147] text-white rounded-2xl p-8 shadow-xl">
                <h2 className="text-2xl font-extrabold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Il tuo Archivio Documentale
                </h2>
                <p className="text-[#708ab5] mb-6 text-sm leading-relaxed">
                  Registrati per trovare questo e tutti i prossimi documenti sempre disponibili nella tua dashboard personale.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-[#4463ee]">folder_shared</span>
                    Storico completo dei tuoi ordini
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-[#4463ee]">cloud_download</span>
                    Download illimitati dei tuoi PDF
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-[#4463ee]">security</span>
                    Archiviazione sicura e crittografata
                  </li>
                </ul>
                <Link
                  href="/registrazione"
                  className="block w-full bg-[#4463ee] text-white text-center font-extrabold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg"
                >
                  Crea il tuo account gratuito
                </Link>
              </div>
            )}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/" className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all">
              Esplora altri strumenti
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="mt-12 bg-white border border-slate-100 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-[#4463ee] mb-2 block" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
            <h3 className="font-bold text-[#002147] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>Serve aiuto?</h3>
            <p className="text-sm text-[#44474e] mb-3">Il nostro supporto tecnico è a tua disposizione per qualsiasi chiarimento.</p>
            <a href="mailto:info@prospettiva.io" className="text-[#002147] font-bold text-sm hover:underline">
              Contatta assistenza
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
