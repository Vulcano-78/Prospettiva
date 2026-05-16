'use client';

import { useState } from 'react';

export default function NotifyMeInline({ slug, label = 'Entra in lista d’attesa' }: { slug: string; label?: string }) {
  const [open, setOpen] = useState(false);
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

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-block whitespace-nowrap bg-secondary text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all"
        style={{ borderRadius: '6px' }}
      >
        {label} <span aria-hidden>→</span>
      </button>
    );
  }

  if (status === 'success') {
    return (
      <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-4 text-sm font-medium" style={{ borderRadius: '6px' }}>
        <span className="material-symbols-outlined text-lg">check_circle</span>
        Sei in lista. Ti avviseremo appena disponibile.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <input
        type="email"
        autoFocus
        className="flex-grow min-w-0 sm:min-w-[260px] bg-white/10 border border-white/30 text-white placeholder-white/50 px-4 py-3 text-sm focus:outline-none focus:border-white"
        placeholder="nome@email.it"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        required
        style={{ borderRadius: '6px' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-secondary text-white px-6 py-3 text-sm font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-60"
        style={{ borderRadius: '6px' }}
      >
        {status === 'loading' ? 'Invio...' : 'Avvisami'}
      </button>
      {status === 'error' && <p className="text-xs text-red-200 sm:hidden">{errMsg}</p>}
    </form>
  );
}
