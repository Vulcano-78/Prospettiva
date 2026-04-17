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

      {/* Trust badges */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#44474e] font-medium">
          <span className="material-symbols-outlined text-sm text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          Pagamento 100% sicuro protetto da crittografia SSL
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#74777f]">Powered by</span>
          <svg width="49" height="20" viewBox="0 0 49 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48.4 10.2c0-3.4-1.6-6-4.8-6-3.2 0-5 2.6-5 6 0 4 2.2 5.9 5.4 5.9 1.6 0 2.7-.3 3.6-.8v-2.6c-.9.4-1.9.7-3.2.7-1.3 0-2.4-.4-2.5-2h6.3c0-.2.2-.8.2-1.2zm-6.4-1.2c0-1.5.9-2.1 1.8-2.1.8 0 1.7.6 1.7 2.1h-3.5zM33.6 4.2c-1.3 0-2.1.6-2.5 1l-.2-.8h-2.8v15.2l3.2-.7v-3.7c.5.3 1.2.8 2.3.8 2.3 0 4.4-1.9 4.4-6-.1-3.8-2.2-5.8-4.4-5.8zm-.8 8.9c-.8 0-1.2-.3-1.5-.6V7.8c.4-.4.8-.6 1.5-.6 1.2 0 2 1.3 2 3s-.8 2.9-2 2.9zM24 3.5l3.2-.7V0L24 .7v2.8zM24 4.5h3.2v11.3H24V4.5zM20.5 5.4l-.2-1h-2.8v11.3h3.1V8.2c.8-1 2-0.8 2.4-.7V4.5c-.4-.2-2-.5-2.5 .9zM14.2 1.5L11.1 2.2l-.1 10.4c0 1.9 1.4 3.3 3.3 3.3 1.1 0 1.8-.2 2.3-.4v-2.6c-.4.2-2.5.8-2.5-1.2V7h2.5V4.5H14v-3zM5.6 7.9c0-.5.4-.7 1.1-.7.9 0 2.1.3 3 .8V5c-1-.4-2-.6-3-.6C4.2 4.4 2.3 5.8 2.3 8.1c0 3.6 4.9 3 4.9 4.5 0 .6-.5.8-1.2.8-1 0-2.4-.4-3.4-1v3.1c1.2.5 2.3.7 3.4.7 2.6 0 4.4-1.3 4.4-3.6-.1-3.8-5-3.1-4.8-4.7z" fill="#6772E5" />
          </svg>
        </div>
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

              {/* Security info */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#44474e]">
                    <span className="material-symbols-outlined text-base text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    Documenti consegnati entro un&apos;ora
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
