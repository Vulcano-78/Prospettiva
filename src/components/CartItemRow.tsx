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
    return parts.length > 0 ? parts.join(' • ') : 'Dati da compilare';
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#c4c6cf]/30 flex items-center gap-5 transition-transform hover:scale-[1.01]">
      <div className="bg-[#f3f4f5] p-3 rounded-lg text-[#002147] shrink-0">
        <span className="material-symbols-outlined text-2xl">{item.service.categoryIcon}</span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-[#002147]">{item.service.name}</h3>
            <p className="text-xs text-[#44474e] mt-1">{getItemDescription()}</p>
          </div>
          <span className="font-bold text-[#002147]">{formatPrice(item.service.price)}</span>
        </div>
      </div>

      <button
        onClick={() => removeItem(item.id)}
        className="text-[#44474e] hover:text-[#ba1a1a] transition-colors"
      >
        <span className="material-symbols-outlined text-xl">delete</span>
      </button>
    </div>
  );
}
