'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email o password non corretti.');
      setLoading(false);
      return;
    }

    // Processa ordine pendente dalla pagina conferma (se presente)
    if (localStorage.getItem('pendingOrderAfterAuth')) {
      const orders = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
      const orderEmail = localStorage.getItem('checkoutEmail') || '';
      const emailDocumenti = localStorage.getItem('checkoutEmailDocumenti') || '';
      localStorage.removeItem('pendingOrderAfterAuth');
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('checkoutEmail');
      localStorage.removeItem('checkoutEmailDocumenti');
      await fetch('/api/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders, email: orderEmail, emailDocumenti }),
      });
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <main className="flex-grow flex flex-col items-center px-6 pt-20 pb-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
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
