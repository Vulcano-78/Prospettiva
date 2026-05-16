'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError('Email o password non corretti.');
        setLoading(false);
        return;
      }

      // Pulizia stato pendente del checkout.
      // L'associazione ordine-utente (per chi paga da guest e poi si logga) viene
      // gestita dal webhook Stripe / process-order al ritorno su /conferma:
      // se l'utente è loggato a quel punto, l'orders.user_id viene aggiornato.
      localStorage.removeItem('pendingOrderAfterAuth');
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('checkoutEmail');
      localStorage.removeItem('checkoutEmailDocumenti');

      // Hard navigation: forza il reload completo così che il middleware
      // legga subito il cookie di sessione e il dashboard server-side veda l'utente.
      // Evita lo stato "in corso..." quando router.push non rinegozia i cookie.
      window.location.assign('/dashboard');
    } catch (err) {
      console.error('login failed', err);
      setError('Errore di rete. Riprova tra qualche secondo.');
      setLoading(false);
    }
  };

  const inputClass = 'w-full bg-white border border-slate-300 px-3 py-2.5 text-sm text-[#002147] placeholder-slate-400 focus:outline-none focus:border-[#002147] transition-colors';
  const labelClass = 'block text-[0.625rem] font-mono uppercase tracking-[0.18em] text-slate-500 mb-2';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-grow flex flex-col items-center px-6 pt-[120px] pb-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-[0.625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-3">
              Accedi
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-[#002147] mb-3">
              Bentornato.
            </h1>
            <p className="text-on-surface-variant text-sm">
              Accedi al tuo account Prospettiva.io
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-300/80 p-8 space-y-5"
            style={{ borderRadius: '5px' }}
          >
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3"
                style={{ borderRadius: '5px' }}
              >
                {error}
              </div>
            )}

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.it"
                className={inputClass}
                style={{ borderRadius: '5px' }}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="La tua password"
                className={inputClass}
                style={{ borderRadius: '5px' }}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 border-slate-300 text-[#002147] focus:ring-[#002147]" style={{ borderRadius: '3px' }} />
                <span className="text-on-surface-variant">Ricordami</span>
              </label>
              <a href="#" className="text-[#002147] font-semibold hover:text-[#4463EE] transition-colors">Password dimenticata?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002147] text-white font-bold py-3 cursor-pointer hover:bg-[#4463EE] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm uppercase tracking-[0.18em]"
              style={{ borderRadius: '5px' }}
            >
              {loading ? 'Accesso in corso…' : 'Accedi →'}
            </button>
          </form>

          <p className="text-center text-on-surface-variant text-sm mt-6">
            Non hai ancora un account?{' '}
            <Link href="/registrazione" className="text-[#002147] font-bold hover:text-[#4463EE] transition-colors">
              Registrati qui
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
