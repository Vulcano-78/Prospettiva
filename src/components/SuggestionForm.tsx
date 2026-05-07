'use client';

import { useState } from 'react';

export default function SuggestionForm() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || undefined, message }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrMsg(j?.error || 'Errore');
        setStatus('error');
        return;
      }
      setStatus('success');
      setMessage('');
      setEmail('');
    } catch {
      setErrMsg('Errore di rete');
      setStatus('error');
    }
  };

  if (!open) {
    return (
      <div className="mt-12 max-w-xl mx-auto">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-base">lightbulb</span>
          <span className="border-b border-dashed border-current">Hai un&apos;idea? Suggeriscici un servizio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-xl mx-auto bg-white border border-slate-200 p-6 text-left shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary-container font-bold">
          <span className="material-symbols-outlined text-secondary">lightbulb</span>
          Suggerisci un servizio
        </div>
        <button
          type="button"
          onClick={() => { setOpen(false); setStatus('idle'); }}
          className="text-slate-400 hover:text-slate-700"
          aria-label="Chiudi"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 text-sm">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Grazie! Abbiamo ricevuto il tuo suggerimento.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="w-full border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary min-h-[100px] resize-y"
            placeholder="Descrivi il servizio o la funzionalità che vorresti vedere su Prospettiva..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={status === 'loading'}
            required
            minLength={3}
            maxLength={2000}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              className="flex-grow border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-secondary"
              placeholder="La tua email (opzionale, se vuoi una risposta)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-secondary text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? 'Invio...' : 'Invia'}
            </button>
          </div>
          {status === 'error' && <p className="text-xs text-red-600">{errMsg}</p>}
        </form>
      )}
    </div>
  );
}
