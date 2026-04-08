'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated login - no backend
    alert('Funzionalita di login non implementata (demo).');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Bentornato
            </h1>
            <p className="text-[#44474e]">
              Accedi al tuo account Prospettiva.io
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                Email
              </label>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                Password
              </label>
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
              <a href="#" className="text-[#002147] font-semibold hover:underline">
                Password dimenticata?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#002147] text-white font-extrabold py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Accedi
            </button>
          </form>

          <p className="text-center text-[#44474e] text-sm mt-6">
            Non hai ancora un account?{' '}
            <Link href="/registrazione" className="text-[#002147] font-bold hover:underline">
              Registrati qui
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
