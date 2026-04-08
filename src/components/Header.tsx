'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-[#c4c6cf]/20 sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <span className="text-[#002147]">Prospettiva</span>
          <span className="text-[#4463ee]">.io</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-[#002147] font-bold border-b-4 border-[#4463ee] pb-1">
            Catalogo Strumenti
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[#002147] font-bold px-4 py-2 hover:bg-black/5 rounded-xl transition-colors"
          >
            Accedi
          </Link>
          <Link
            href="/registrazione"
            className="bg-[#002147] text-white font-bold px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
          >
            Registrati
          </Link>
          <Link href="/carrello" className="relative p-2 text-[#002147] hover:bg-black/5 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4463ee] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/carrello" className="relative p-2 text-[#002147]">
            <span className="material-symbols-outlined text-2xl">shopping_cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4463ee] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#002147]"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#c4c6cf]/20 px-4 py-4 space-y-3">
          <Link
            href="/"
            className="block text-[#002147] font-bold py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Catalogo Strumenti
          </Link>
          <hr className="border-[#c4c6cf]/20" />
          <Link
            href="/login"
            className="block text-[#002147] font-semibold py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Accedi
          </Link>
          <Link
            href="/registrazione"
            className="block bg-[#002147] text-white font-bold px-4 py-3 rounded-xl text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Registrati
          </Link>
        </div>
      )}
    </header>
  );
}
