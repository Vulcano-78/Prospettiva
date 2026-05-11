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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow flex flex-col items-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#002147] mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
              Bentornato
            </h1>
            <p className="text-[#44474e]">Accedi al tuo account Prospettiva.io</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.it"
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="La tua password"
                className="w-full"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]" />
                <span className="text-[#44474e]">Ricordami</span>
              </label>
              <a href="#" className="text-[#002147] font-semibold hover:underline">Password dimenticata?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002147] text-white font-extrabold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Accesso in corso…' : 'Accedi'}
            </button>
          </form>

          <p className="text-center text-[#44474e] text-sm mt-6">
            Non hai ancora un account?{' '}
            <Link href="/registrazione" className="text-[#002147] font-bold hover:underline">Registrati qui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
