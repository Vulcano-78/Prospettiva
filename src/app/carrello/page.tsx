'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CartItemRow from '@/components/CartItemRow';
import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/services';

export default function CartPage() {
  const router = useRouter();
  const { items, getSubtotal, getIVA, getTotal, clearCart } = useCart();

  const handleProceed = () => {
    router.push('/checkout/dati');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_cart</span>
            <h1 className="text-2xl font-bold text-[#002147] mb-2">Il tuo carrello e vuoto</h1>
            <p className="text-[#44474e] mb-6">Aggiungi servizi dal catalogo per iniziare.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#002147] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Torna al catalogo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Progress Bar — full width, centered on page */}
      <div className="w-full pt-20 mb-4 md:mb-6">
        <ProgressBar currentStep={1} />
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Carrello
          </h1>
          <p className="text-[#44474e] text-sm">
            Verifica gli elementi nel carrello prima di completare l&apos;acquisto.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
              <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">{items.length}</span>
                {items.length === 1 ? 'Servizio selezionato' : 'Servizi selezionati'}
              </h2>

              <div className="space-y-4">
                {items.map(item => (
                  <CartItemRow key={item.id} item={item} />
                ))}
              </div>
            </section>

            <div className="flex justify-center">
              <button
                onClick={clearCart}
                className="text-[#44474e] hover:text-[#ba1a1a] text-sm font-medium transition-colors cursor-pointer"
              >
                Svuota carrello
              </button>
            </div>

            {/* Action — aligned to left column, centered */}
            <div className="mt-2 flex flex-col items-center gap-3">
              <button
                onClick={handleProceed}
                className="w-full max-w-xs bg-[#4463ee] text-white font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Continua</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
              <div className="flex items-center gap-2 text-xs text-[#44474e] font-medium">
                <span className="material-symbols-outlined text-sm text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                Pagamento sicuro con crittografia SSL
              </div>
            </div>
          </div>

          {/* Right: Order Summary + Actions */}
          <div className="lg:col-span-1 space-y-4">
            <section className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm lg:sticky lg:top-24">
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
