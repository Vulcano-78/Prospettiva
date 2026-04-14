import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-primary-container text-white">
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="text-lg font-[800] text-white mb-4 brand-logo">prospettiva<span className="text-[#4463EE]">.io</span></div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link className="text-white/60 text-xs hover:text-white transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="text-white/60 text-xs hover:text-white transition-colors" href="/cookie">Cookie Policy</Link>
          <Link className="text-white/60 text-xs hover:text-white transition-colors" href="/termini">Termini e Condizioni</Link>
          <Link className="text-white/60 text-xs hover:text-white transition-colors" href="/gdpr">GDPR</Link>
        </div>

        {/* Copyright + P.IVA */}
        <div className="text-white/40 text-[10px] font-body">
          © 2026 Nuvó S.r.l. - Tutti i diritti riservati. <span className="mx-1">|</span> P.IVA 17463031009
        </div>
      </div>
    </footer>
  );
}
