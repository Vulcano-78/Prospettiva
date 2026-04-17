'use client';

import { CartItem } from '@/context/CartContext';

import { useCart } from '@/context/CartContext';

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { removeItem } = useCart();

  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-[#c4c6cf]/30 transition-transform hover:scale-[1.01]">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="bg-[#f3f4f5] p-2 md:p-2.5 rounded-lg text-[#002147] shrink-0">
          <span className="material-symbols-outlined text-lg md:text-xl">{item.service.categoryIcon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm md:text-lg text-[#002147] truncate">{item.service.name}</h3>
        </div>

        <button
          onClick={() => removeItem(item.id)}
          className="text-[#c4c6cf] hover:text-[#ba1a1a] transition-colors cursor-pointer p-1 shrink-0"
        >
          <span className="material-symbols-outlined text-lg md:text-xl">delete</span>
        </button>
      </div>
    </div>
  );
}
