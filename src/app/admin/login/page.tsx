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
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-slate-200 p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Admin</p>
          <h1 className="text-2xl font-extrabold text-[#002147]" style={{ fontFamily: 'var(--font-headline)' }}>
            Accesso protetto
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Inserisci la password admin per continuare.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary"
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
            className="w-full bg-[#002147] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {status === 'loading' ? 'Verifico...' : 'Entra'}
          </button>
          {status === 'error' && <p className="text-xs text-red-600">{errMsg}</p>}
        </form>
      </div>
    </div>
  );
}
