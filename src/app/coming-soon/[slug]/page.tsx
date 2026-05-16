'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { getServiceBySlug } from '@/data/services';
import Breadcrumb from '@/components/Breadcrumb';

export default function ComingSoonPage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = getServiceBySlug(slug);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, slug }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrMsg(j?.error || 'Errore');
        setStatus('error');
        return;
      }
      setStatus('success');
      setEmail('');
    } catch {
      setErrMsg('Errore di rete');
      setStatus('error');
    }
  };

  const serviceName = service?.name || 'Nuovo Servizio';
  const serviceDescription = service?.description || 'Un nuovo strumento professionale sta per arrivare.';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="w-full pt-[96px] md:pt-[112px] px-6 md:px-12 max-w-7xl mx-auto">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: serviceName },
        ]} />
      </div>

      <main className="flex-grow px-6 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="text-[0.625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE]">
                Prossimamente
              </div>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-[#002147] leading-tight tracking-tight">
                {serviceName}
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {serviceDescription}
              </p>
            </div>

            {/* Email Signup */}
            <div className="bg-slate-50 p-6 rounded-[5px] border border-slate-100 space-y-4">
              <div>
                <p className="font-bold text-[#002147]">Saremo pronti a breve.</p>
                <p className="text-sm text-[#44474e]">Inserisci la tua email per essere avvisato quando sara disponibile.</p>
              </div>
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-[5px] text-sm">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Ti avviseremo non appena disponibile.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    className="flex-grow border border-slate-200 rounded-[5px] px-4 py-3 text-sm focus:outline-none focus:border-[#4463ee]"
                    placeholder="La tua email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'loading'}
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-[#4463ee] text-white font-bold px-6 py-3 rounded-[5px] hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Invio...' : 'Avvisami'}
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
              )}
              {status === 'error' && <p className="text-xs text-red-600">{errMsg}</p>}
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
          <div className="order-1 lg:order-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[5px] p-8 flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
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
