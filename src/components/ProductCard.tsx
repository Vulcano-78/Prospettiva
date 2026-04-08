'use client';

import Link from 'next/link';
import { Service, formatPrice } from '@/data/services';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  service: Service;
}

export default function ProductCard({ service }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(service);
  };

  if (!service.isActive) {
    return (
      <div className="product-box-inactive">
        <div className="flex-grow flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base text-[#002147] opacity-70 leading-tight">
                {service.name}
              </h3>
              <span className="bg-[#e1e3e4] text-[#44474e] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                In arrivo
              </span>
            </div>
            <p className="text-[#44474e] text-xs mt-1 opacity-70">{service.description}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto items-center">
          <input
            className="w-full sm:w-48 bg-[#f8f9fa] border border-[#c4c6cf]/30 rounded-xl px-3 py-2 text-[10px] focus:ring-[#4463ee] focus:border-[#4463ee]"
            placeholder="La tua email"
            type="email"
          />
          <button className="w-full sm:w-auto whitespace-nowrap bg-[#002147]/5 text-[#002147] font-bold px-6 py-2 rounded-xl text-[10px] hover:bg-[#4463ee]/20 transition-all border border-[#002147]/10">
            Avvisami
          </button>
        </div>
      </div>
    );
  }

  // Free tools (gratuiti)
  if (service.price === 0) {
    return (
      <div className="product-box-inactive hover:bg-[#4463ee]/10 group cursor-default">
        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-[#002147] leading-tight">{service.name}</h3>
            <span className="bg-[#e1e3e4] text-[#44474e] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
              Gratuito
            </span>
          </div>
          <p className="text-[#44474e] text-xs mt-1">{service.description}</p>
        </div>
        <div className="w-full md:w-auto">
          <Link
            href={`/servizio/${service.slug}`}
            className="block w-full md:w-auto whitespace-nowrap bg-[#4463ee]/30 text-[#002147] font-bold px-8 py-2 rounded-xl text-[11px] hover:bg-[#4463ee]/50 transition-all text-center"
          >
            Utilizza ora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-box">
      <div className="flex-grow">
        <h3 className="font-bold text-base text-[#002147] leading-tight">{service.name}</h3>
        <p className="text-[#44474e] text-xs mt-1">{service.description}</p>
      </div>

      <div className="flex items-baseline gap-1.5 min-w-[100px] justify-end md:justify-center">
        <span className="text-xl font-extrabold text-[#002147]">{formatPrice(service.price)}</span>
        <span className="text-[10px] text-[#74777f]/60 font-semibold uppercase tracking-tight">+ IVA</span>
      </div>

      <div className="flex flex-row gap-2 w-full md:w-auto">
        <Link
          href={`/servizio/${service.slug}`}
          className="flex-1 md:flex-none whitespace-nowrap bg-[#002147] text-white font-bold px-4 py-2 rounded-xl text-[11px] hover:bg-[#002147]/90 transition-all text-center"
        >
          Acquista subito
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 md:flex-none whitespace-nowrap border border-[#002147]/10 text-[#002147] font-bold px-4 py-2 rounded-xl text-[11px] hover:bg-[#4463ee]/20 transition-all"
        >
          Carrello
        </button>
      </div>
    </div>
  );
}
