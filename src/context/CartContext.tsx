'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Service } from '@/data/services';

export interface CartItem {
  id: string;
  service: Service;
  formData: Record<string, string>;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (service: Service, formData?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, formData: Record<string, string>) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getIVA: () => number;
  getTotal: () => number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((service: Service, formData: Record<string, string> = {}) => {
    const newItem: CartItem = {
      id: `${service.id}-${Date.now()}`,
      service,
      formData,
      quantity: 1
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateItem = useCallback((itemId: string, formData: Record<string, string>) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, formData } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  }, [items]);

  const getIVA = useCallback(() => {
    return getSubtotal() * 0.22;
  }, [getSubtotal]);

  const getTotal = useCallback(() => {
    return getSubtotal() + getIVA();
  }, [getSubtotal, getIVA]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      getSubtotal,
      getIVA,
      getTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
