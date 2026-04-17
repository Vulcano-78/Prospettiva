'use client';

import { CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/services';
import { useCart } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { removeItem } = useCart();

  const getItemDescription = () => {
    const parts: string[] = [];
    if (item.formData.provincia) parts.push(item.formData.provincia);
    if (item.formData.foglio) parts.push(`Foglio ${item.formData.foglio}`);
    if (item.formData.particella) parts.push(`Particella ${item.formData.particella}`);
    if (item.formData.codiceFiscale) parts.push(item.formData.codiceFiscale);
    return parts.length > 0 ? parts.join(' · ') : 'Dati da compilare';
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 transition-transform hover:scale-[1.01]">
      <div className="flex items-start gap-3 md:gap-5">
        <div className="bg-[#f3f4f5] p-2.5 md:p-3 rounded-lg text-[#002147] shrink-0">
          <span className="material-symbols-outlined text-xl md:text-2xl">{item.service.categoryIcon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm md:text-base text-[#002147] truncate">{item.service.name}</h3>
            <span className="font-bold text-sm text-[#002147] whitespace-nowrap">{formatPrice(item.service.price)}</span>
          </div>
          <p className="text-[11px] text-[#44474e] mt-1 truncate">{getItemDescription()}</p>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="text-[#44474e] hover:text-[#ba1a1a] transition-colors shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg md:text-xl">delete</span>
        </button>
      </div>
    </div>
  );
}
