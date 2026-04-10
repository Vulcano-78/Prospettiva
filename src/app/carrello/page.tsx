'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CartItemRow from '@/components/CartItemRow';
import ProgressBar from '@/components/ProgressBar';
import Breadcrumb from '@/components/Breadcrumb';
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
      <main className="flex-grow pt-20 pb-24 px-4 md:px-6 max-w-2xl mx-auto w-full">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Carrello' },
        ]} />
        {/* Progress Bar */}
        <div className="mb-8 md:mb-12">
          <ProgressBar currentStep={1} />
        </div>

        {/* Header */}
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Revisione Ordine
          </h1>
          <p className="text-[#44474e] text-sm">
            Verifica gli elementi nel carrello prima di completare l&apos;acquisto.
          </p>
        </header>

        {/* Cart Items */}
        <div className="space-y-4">
          {items.map(item => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </div>

        {/* Totals */}
        <div className="mt-8 bg-[#f3f4f5]/50 rounded-xl p-6 border border-dashed border-[#c4c6cf]">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[#44474e]">
              <span>Subtotale</span>
              <span className="font-medium text-[#191c1d]">{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm text-[#44474e]">
              <span>IVA (22%)</span>
              <span className="font-medium text-[#191c1d]">{formatPrice(getIVA())}</span>
            </div>
            <div className="pt-4 border-t border-[#c4c6cf]/30 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-[#002147]">Totale dell&apos;ordine</span>
                <span className="text-2xl font-extrabold tracking-tight text-[#002147]">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 space-y-4">
          <button
            onClick={handleProceed}
            className="w-full bg-[#4463ee] text-white font-extrabold py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg group"
          >
            <span>Procedi alla compilazione dei dati</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>

          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-[#44474e] font-medium">
              <span className="material-symbols-outlined text-sm text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              Pagamento 100% sicuro protetto da crittografia SSL
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={clearCart}
              className="text-[#44474e] hover:text-[#ba1a1a] text-sm font-medium transition-colors"
            >
              Svuota carrello
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#c4c6cf]/20 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#44474e]">Totale</p>
            <p className="text-xl font-extrabold text-[#002147]">{formatPrice(getTotal())}</p>
          </div>
          <button
            onClick={handleProceed}
            className="flex-1 bg-[#4463ee] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            Continua
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

    </div>
  );
}
