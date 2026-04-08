'use client';

import Link from 'next/link';

interface HeaderSimplifiedProps {
  showBackToShop?: boolean;
}

export default function HeaderSimplified({ showBackToShop = true }: HeaderSimplifiedProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-[#c4c6cf]/20 sticky top-0 z-50">
      <nav className="flex justify-between items-center px-4 md:px-6 py-4 max-w-4xl mx-auto">
        <Link href="/" className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <span className="text-[#002147]">Prospettiva</span>
          <span className="text-[#4463ee]">.io</span>
        </Link>

        <div className="flex items-center gap-4 md:gap-6">
          {showBackToShop && (
            <Link
              href="/"
              className="text-sm font-medium text-[#516169] hover:text-[#002147] transition-colors"
            >
              Torna allo shop
            </Link>
          )}
          <Link
            href="#"
            className="text-sm font-medium text-[#516169] hover:text-[#002147] transition-colors"
          >
            Aiuto
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#516169] hover:text-[#002147] transition-colors hidden md:inline"
          >
            Cos&apos;e Prospettiva?
          </Link>
        </div>
      </nav>
    </header>
  );
}
