'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

import { getServiceBySlug } from '@/data/services';

export default function ComingSoonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = getServiceBySlug(slug);

  const serviceName = service?.name || 'Nuovo Servizio';
  const serviceDescription = service?.description || 'Un nuovo strumento professionale sta per arrivare.';

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-widest uppercase">
                Prossimamente
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#002147] leading-tight tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {serviceName}
              </h1>
              <p className="text-lg text-[#44474e] leading-relaxed">
                {serviceDescription}
              </p>
            </div>

            {/* Email Signup */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
              <div>
                <p className="font-bold text-[#002147]">Saremo pronti a breve.</p>
                <p className="text-sm text-[#44474e]">Inserisci la tua email per essere avvisato quando sara disponibile.</p>
              </div>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  className="flex-grow"
                  placeholder="La tua email professionale"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#4463ee] text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  Avvisami
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </form>
            </div>

            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#002147] font-bold hover:text-[#4463ee] transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Torna agli strumenti attivi
            </Link>
          </div>

          {/* Visual */}
          <div className="order-1 lg:order-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-white/80 flex items-center justify-center mb-4 shadow-lg">
                <span className="material-symbols-outlined text-5xl text-[#4463ee]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {service?.categoryIcon || 'auto_awesome'}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">In Sviluppo</p>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
