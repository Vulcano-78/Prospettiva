'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/services';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ─── Payment Form (inside <Elements>) ─── */
function PaymentForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/conferma`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Errore durante il pagamento.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Stripe Payment Element */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
        <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
          Metodo di pagamento
        </h2>

        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
            <p className="text-sm text-[#ba1a1a]">{error}</p>
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-white border border-slate-200 text-[#002147] font-medium py-3 px-5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-sm"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Indietro
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-[#4463ee] text-white font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Elaborazione...</span>
            </>
          ) : (
            <>
              <span>Effettua pagamento</span>
              <span className="material-symbols-outlined text-base">lock</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
}

/* ─── Main Page ─── */
export default function PaymentPage() {
  const router = useRouter();
  const { items, getSubtotal, getIVA, getTotal } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: getTotal(),
        items: items.map(i => ({ name: i.service.name, price: i.service.price })),
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setInitError(data.error);
        } else {
          setClientSecret(data.clientSecret);
        }
      })
      .catch(() => setInitError('Impossibile inizializzare il pagamento. Riprova.'));
  }, [items, getTotal]);

  if (items.length === 0) {
    router.push('/carrello');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Progress Bar — full width, centered on page */}
      <div className="w-full pt-20 mb-4 md:mb-6">
        <ProgressBar currentStep={3} />
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Pagamento sicuro
          </h1>
          <p className="text-[#44474e] text-sm">
            Completa il pagamento per ricevere i tuoi documenti.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Section — 2 cols */}
          <div className="lg:col-span-2">
            {initError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
                <div>
                  <p className="text-sm font-bold text-[#ba1a1a] mb-1">Errore</p>
                  <p className="text-sm text-[#ba1a1a]">{initError}</p>
                </div>
              </div>
            )}

            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#4463EE',
                      colorBackground: '#ffffff',
                      colorText: '#191c1d',
                      colorTextSecondary: '#44474e',
                      colorDanger: '#ba1a1a',
                      fontFamily: 'Inter, sans-serif',
                      borderRadius: '12px',
                      spacingUnit: '4px',
                    },
                    rules: {
                      '.Input': {
                        border: '1px solid #c4c6cf',
                        boxShadow: 'none',
                        padding: '12px 14px',
                      },
                      '.Input:focus': {
                        border: '1px solid #002147',
                        boxShadow: '0 0 0 3px rgba(0, 33, 71, 0.1)',
                      },
                      '.Tab': {
                        border: '1px solid #c4c6cf',
                        boxShadow: 'none',
                      },
                      '.Tab--selected': {
                        borderColor: '#4463EE',
                        boxShadow: '0 0 0 1px #4463EE',
                      },
                      '.Label': {
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#516169',
                      },
                    },
                  },
                }}
              >
                <PaymentForm total={getTotal()} />
              </Elements>
            ) : !initError ? (
              /* Loading skeleton */
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-48" />
                  <div className="h-12 bg-slate-100 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 bg-slate-100 rounded-xl" />
                    <div className="h-12 bg-slate-100 rounded-xl" />
                  </div>
                  <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
              </section>
            ) : null}
          </div>

          {/* Order Summary — 1 col */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-3">
            <section className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
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

              {/* Delivery info + SSL */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#44474e]">
                  <span className="material-symbols-outlined text-base text-[#28a428]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  Documenti consegnati entro 60 minuti
                </div>
              </div>
            </section>

            <div className="flex items-center justify-center gap-2 text-xs text-[#44474e] mt-3">
              <span className="material-symbols-outlined text-sm text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              Pagamento sicuro con crittografia SSL
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
