'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrello');
    } else {
      router.push('/checkout/dati');
    }
  }, [items, router]);

  return null;
}
