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

  return (
    <div className="mt-16 pt-12 border-t border-slate-200/70 max-w-2xl mx-auto">
      {!open ? (
        <div className="flex flex-col items-center text-center gap-3">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Stai cercando qualcosa che non c&apos;è?</p>
          <h3 className="text-2xl font-bold text-primary-container" style={{ fontFamily: 'var(--font-headline)' }}>
            Dicci di cosa hai bisogno
          </h3>
          <p className="text-sm text-on-surface-variant max-w-md">
            Lavoriamo per costruire gli strumenti che usate davvero. Se ti manca un servizio, faccelo sapere — lo valuteremo.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-2 inline-flex items-center gap-2 bg-white border border-slate-300 text-primary-container px-6 py-3 text-xs font-bold uppercase tracking-widest hover:border-secondary hover:text-secondary transition-colors"
          >
            Scrivi un messaggio
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      ) : status === 'success' ? (
        <div className="bg-green-50 border border-green-200 p-6 text-center">
          <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          <p className="mt-2 text-sm text-green-800 font-semibold">Grazie! Abbiamo ricevuto il tuo messaggio.</p>
          <p className="text-xs text-green-700/70 mt-1">Lo valuteremo e, se ci hai lasciato l&apos;email, ti risponderemo.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 text-left space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-primary-container">Dicci di cosa hai bisogno</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Servizio, funzione, integrazione — quello che ti serve</p>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); setStatus('idle'); }}
              className="text-slate-400 hover:text-slate-700 -mt-1"
              aria-label="Chiudi"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <textarea
            autoFocus
            className="w-full border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary min-h-[110px] resize-y"
            placeholder="Es. Vorrei poter ordinare un certificato di destinazione urbanistica direttamente da qui..."
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
              className="flex-grow border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-secondary"
              placeholder="Email (opzionale, se vuoi una risposta)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || message.trim().length < 3}
              className="bg-primary-container text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-secondary transition-colors disabled:opacity-50"
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
