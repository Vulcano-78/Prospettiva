import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-[#c4c6cf]/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Copyright and Info */}
          <div className="text-slate-400 text-[10px] font-bold tracking-widest uppercase text-center md:text-left">
            &copy; 2026 PROSPETTIVA.IO &bull; P.IVA DA DEFINIRE &bull; INFO@PROSPETTIVA.IO
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-[#4463ee] transition-colors text-[10px] font-bold tracking-widest uppercase"
            >
              Privacy Policy
            </Link>
            <Link
              href="/termini"
              className="text-slate-400 hover:text-[#4463ee] transition-colors text-[10px] font-bold tracking-widest uppercase"
            >
              Termini e Condizioni
            </Link>
            <Link
              href="/cookie"
              className="text-slate-400 hover:text-[#4463ee] transition-colors text-[10px] font-bold tracking-widest uppercase"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
