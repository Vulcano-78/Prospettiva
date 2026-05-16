'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import type { Service } from '@/data/services';

/**
 * Sheet laterale per dettaglio servizio.
 * Slide-in da destra, backdrop scuro, chiusura via X / backdrop / Esc.
 */
export default function ServiceDetailSheet({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const open = service !== null;

  // Esc per chiudere + lock scroll body
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleAdd = () => {
    if (!service) return;
    addItem(service);
    onClose();
  };
  const handleBuy = () => {
    if (!service) return;
    addItem(service);
    router.push('/carrello');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[100] bg-[#001229]/55 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={service ? `Dettagli ${service.name}` : 'Dettagli servizio'}
        className={`fixed top-0 right-0 bottom-0 z-[101] w-full sm:max-w-[520px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {service && (
          <>
            {/* Header */}
            <header className="flex items-start justify-between gap-4 px-6 md:px-8 pt-6 pb-5 border-b border-slate-200">
              <div className="min-w-0">
                <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-slate-400 mb-1.5">
                  {service.category}
                </div>
                <h2 className="text-xl md:text-2xl font-headline text-[#002147] leading-tight">
                  {service.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi"
                className="flex-shrink-0 h-8 w-8 flex items-center justify-center text-slate-400 hover:text-[#002147] hover:bg-slate-100 transition"
                style={{ borderRadius: '5px' }}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </header>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
              {/* Descrizione */}
              <section>
                <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-2">
                  Che cos'è
                </div>
                <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">
                  {service.longDescription || service.description}
                </p>
              </section>

              {/* Fac-simile */}
              <section>
                <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-2">
                  Fac-simile del documento
                </div>
                <div className="aspect-[3/4] bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden">
                  {/* Linee finte di documento */}
                  <div className="absolute inset-x-0 top-0 bottom-0 p-8 opacity-30">
                    <div className="h-3 w-2/3 bg-slate-300 mb-4" />
                    <div className="h-2 w-full bg-slate-200 mb-2" />
                    <div className="h-2 w-5/6 bg-slate-200 mb-2" />
                    <div className="h-2 w-3/4 bg-slate-200 mb-6" />
                    <div className="h-2 w-full bg-slate-200 mb-2" />
                    <div className="h-2 w-full bg-slate-200 mb-2" />
                    <div className="h-2 w-1/2 bg-slate-200" />
                  </div>
                  <div className="relative z-10 text-center px-6">
                    <span className="material-symbols-outlined text-4xl text-slate-300 mb-2 block">
                      description
                    </span>
                    <p className="text-[0.625rem] font-mono uppercase tracking-[0.18em] text-slate-400">
                      Anteprima in arrivo
                    </p>
                  </div>
                </div>
              </section>

              {/* Cosa ti serve */}
              {service.fields.length > 0 && (
                <section>
                  <div className="text-[0.5625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-3">
                    Cosa ti serve per ordinarla
                  </div>
                  <ul className="divide-y divide-slate-100 border border-slate-200" style={{ borderRadius: '5px' }}>
                    {service.fields.map((f) => (
                      <li key={f.name} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="text-[#002147]">{f.label}</span>
                        {f.required && (
                          <span className="text-[0.5625rem] font-mono uppercase tracking-[0.18em] text-slate-400">
                            obbligatorio
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Footer sticky con prezzo + CTA */}
            <footer className="border-t border-slate-200 bg-white px-6 md:px-8 py-4 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[0.5625rem] font-mono uppercase tracking-wider text-slate-400">
                  prezzo
                </span>
                <span className="text-lg font-semibold text-[#002147] leading-none">
                  € {service.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  aria-label="Aggiungi al carrello"
                  className="h-10 w-12 border border-slate-300 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-[#002147] transition"
                  style={{ borderRadius: '5px' }}
                >
                  <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuy}
                  className="bg-[#002147] text-white text-xs font-bold h-10 px-4 hover:brightness-110 uppercase tracking-[0.18em] transition whitespace-nowrap"
                  style={{ borderRadius: '5px' }}
                >
                  Acquista
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
