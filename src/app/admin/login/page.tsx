'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrMsg(j?.error || 'Errore');
        setStatus('error');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setErrMsg('Errore di rete');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 pt-[72px]">
      <div
        className="w-full max-w-sm bg-white border border-slate-300/80 p-8"
        style={{ borderRadius: '5px' }}
      >
        <div className="mb-6">
          <p className="text-[0.625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-3">Admin</p>
          <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#002147] leading-tight">
            Accesso protetto.
          </h1>
          <p className="text-sm text-on-surface-variant mt-3">
            Inserisci la password admin per continuare.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border border-slate-300 px-3 py-2.5 text-sm text-[#002147] placeholder-slate-400 focus:outline-none focus:border-[#002147] transition-colors"
            style={{ borderRadius: '5px' }}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'loading'}
            autoFocus
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-[#002147] text-white text-xs font-bold uppercase tracking-[0.18em] px-6 py-3 cursor-pointer hover:bg-[#4463EE] hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ borderRadius: '5px' }}
          >
            {status === 'loading' ? 'Verifico...' : 'Entra →'}
          </button>
          {status === 'error' && <p className="text-xs text-red-600">{errMsg}</p>}
        </form>
      </div>
    </div>
  );
}
