'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const VOCI_DEFAULTS_KEY = 'ce_voci_defaults_v1';
const RISTR_MQ_KEY = 'ce_ristr_mq_v1';

type Voci = {
  acquisto: string;
  ristrutturazione: string;
  rendering_home_staging: string;
  imposte: string;
  notaio: string;
  avvocato: string;
  geometra: string;
  agibilita: string;
  cambio_dest_uso: string;
  agenzia_in: string;
  agenzia_out: string;
  condom_riscald: string;
  pulizia_cantiere: string;
  utenze: string;
  imprevisti: string;
  altro: string;
};

const VOCI_CONFIG: { key: keyof Voci; label: string }[] = [
  { key: 'ristrutturazione', label: 'Ristrutturazione' },
  { key: 'rendering_home_staging', label: 'Rendering / Home Staging' },
  { key: 'imposte', label: 'Imposte' },
  { key: 'notaio', label: 'Notaio' },
  { key: 'avvocato', label: 'Avvocato' },
  { key: 'geometra', label: 'Geometra' },
  { key: 'agibilita', label: 'Agibilità' },
  { key: 'cambio_dest_uso', label: 'Cambio destinazione d\'uso' },
  { key: 'agenzia_in', label: 'Agenzia (acquisto)' },
  { key: 'agenzia_out', label: 'Agenzia (vendita)' },
  { key: 'condom_riscald', label: 'Condominio / Riscaldamento' },
  { key: 'pulizia_cantiere', label: 'Pulizia cantiere' },
  { key: 'utenze', label: 'Utenze' },
  { key: 'imprevisti', label: 'Imprevisti' },
  { key: 'altro', label: 'Altro' },
];

const VOCI_INIT: Voci = {
  acquisto: '', ristrutturazione: '', rendering_home_staging: '',
  imposte: '', notaio: '', avvocato: '', geometra: '', agibilita: '',
  cambio_dest_uso: '', agenzia_in: '', agenzia_out: '', condom_riscald: '',
  pulizia_cantiere: '', utenze: '', imprevisti: '', altro: '',
};

function num(v: string): number {
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function fmtInput(v: string): string {
  const cleaned = v.replace(/[^\d,]/g, '');
  const [intRaw, ...decRest] = cleaned.split(',');
  const intPart = (intRaw || '').replace(/^0+(?=\d)/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (decRest.length === 0) return intPart;
  const dec = decRest.join('').slice(0, 2);
  return `${intPart || '0'},${dec}`;
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(n);
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(2).replace('.', ',')} %`;
}

export default function ContoEconomicoClient({ isLogged }: { userEmail: string | null; isLogged: boolean }) {
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [mq, setMq] = useState('');
  const [unita, setUnita] = useState('');
  const [voci, setVoci] = useState<Voci>(VOCI_INIT);
  const [ristrMq, setRistrMq] = useState('');
  const [lastRistrEdit, setLastRistrEdit] = useState<'mq' | 'tot' | null>(null);
  const [rivendita1, setRivendita1] = useState('');
  const [rivendita2, setRivendita2] = useState('');
  const [esposizione, setEsposizione] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VOCI_DEFAULTS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Voci>;
        setVoci(p => ({ ...p, ...saved, acquisto: '', ristrutturazione: '' }));
      }
      const rm = localStorage.getItem(RISTR_MQ_KEY);
      if (rm) setRistrMq(rm);
    } catch {}
    setDefaultsLoaded(true);
  }, []);

  useEffect(() => {
    if (!defaultsLoaded) return;
    const { acquisto: _a, ristrutturazione: _r, ...rest } = voci;
    void _a; void _r;
    try {
      localStorage.setItem(VOCI_DEFAULTS_KEY, JSON.stringify(rest));
    } catch {}
  }, [voci, defaultsLoaded]);

  useEffect(() => {
    if (!defaultsLoaded) return;
    try { localStorage.setItem(RISTR_MQ_KEY, ristrMq); } catch {}
  }, [ristrMq, defaultsLoaded]);

  // Recompute Ristrutturazione when mq changes, based on last-edited side
  useEffect(() => {
    const m = num(mq);
    if (m <= 0) return;
    if (lastRistrEdit === 'mq') {
      const tot = num(ristrMq) * m;
      setVoci(p => ({ ...p, ristrutturazione: tot > 0 ? fmtInput(String(Math.round(tot))) : '' }));
    } else if (lastRistrEdit === 'tot') {
      const tot = num(voci.ristrutturazione);
      const per = tot / m;
      setRistrMq(per > 0 ? fmtInput(String(Math.round(per))) : '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mq]);

  const handleRistrMq = (raw: string) => {
    const f = fmtInput(raw);
    setRistrMq(f);
    setLastRistrEdit('mq');
    const m = num(mq);
    if (m > 0) {
      const tot = num(f) * m;
      setVoci(p => ({ ...p, ristrutturazione: tot > 0 ? fmtInput(String(Math.round(tot))) : '' }));
    }
  };

  const handleRistrTot = (raw: string) => {
    const f = fmtInput(raw);
    setVoci(p => ({ ...p, ristrutturazione: f }));
    setLastRistrEdit('tot');
    const m = num(mq);
    if (m > 0) {
      const per = num(f) / m;
      setRistrMq(per > 0 ? fmtInput(String(Math.round(per))) : '');
    }
  };

  const handleSvuota = () => {
    setTitolo('');
    setDescrizione('');
    setMq('');
    setUnita('');
    setVoci(VOCI_INIT);
    setRistrMq('');
    setLastRistrEdit(null);
    setRivendita1('');
    setRivendita2('');
    setEsposizione('');
    try {
      localStorage.removeItem(VOCI_DEFAULTS_KEY);
      localStorage.removeItem(RISTR_MQ_KEY);
    } catch {}
  };

  const calc = useMemo(() => {
    const acquisto = num(voci.acquisto);
    const altriCosti = VOCI_CONFIG
      .filter(v => v.key !== 'acquisto')
      .reduce((sum, v) => sum + num(voci[v.key]), 0);
    const totaleCosti = acquisto + altriCosti;
    const totaleRivendita = num(rivendita1) + num(rivendita2);
    const utile = totaleRivendita - totaleCosti;
    const expo = num(esposizione);
    const roi = totaleCosti > 0 ? (utile / totaleCosti) * 100 : NaN;
    const roe = expo > 0 ? (utile / expo) * 100 : NaN;
    return { acquisto, altriCosti, totaleCosti, totaleRivendita, utile, roi, roe };
  }, [voci, rivendita1, rivendita2, esposizione]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSavedMsg('');
    const res = await fetch('/api/conti-economici', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titolo: titolo || `CE ${new Date().toLocaleDateString('it-IT')}`,
        regime: 'persona_fisica',
        data: { descrizione, mq, unita, voci, rivendita1, rivendita2, esposizione },
      }),
    });
    if (!res.ok) {
      setSaveError('Errore nel salvataggio. Riprova.');
    } else {
      setSavedMsg('Salvato in dashboard.');
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-2">Utility gratuita</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] mb-2" style={{ fontFamily: 'var(--font-headline)' }}>
            Conto Economico
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl">
            Calcola costi, ricavi, utile, ROI e ROE di un&apos;operazione immobiliare.
            {isLogged ? ' Puoi salvare il calcolo nella tua dashboard.' : ' Accedi per salvarlo nella tua dashboard.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Form */}
          <div className="space-y-6">

            {/* Intestazione */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-sm font-extrabold text-[#002147] mb-4 uppercase tracking-widest">Operazione</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Titolo</label>
                  <input type="text" value={titolo} onChange={e => setTitolo(e.target.value)} placeholder="Es. Via Roma 12" />
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Descrizione</label>
                  <input type="text" value={descrizione} onChange={e => setDescrizione(e.target.value)} placeholder="Breve descrizione" />
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Metri quadri</label>
                  <input type="text" inputMode="decimal" value={mq} onChange={e => setMq(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Unità da creare</label>
                  <input type="text" inputMode="numeric" value={unita} onChange={e => setUnita(e.target.value)} placeholder="0" />
                </div>
              </div>
            </section>

            {/* Acquisto */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Acquisto</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={voci.acquisto}
                  onChange={e => setVoci(p => ({ ...p, acquisto: fmtInput(e.target.value) }))}
                  placeholder="0"
                  className="pr-8"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
              </div>
            </section>

            {/* Costi */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="text-sm font-extrabold text-[#002147] uppercase tracking-widest">Costi</h2>
                <button
                  type="button"
                  onClick={handleSvuota}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[0.6875rem] font-bold text-slate-500 uppercase tracking-wider transition-colors"
                >
                  Svuota campi
                </button>
              </div>
              <p className="text-[0.6875rem] text-slate-400 mb-4">I costi restano memorizzati per il prossimo conto economico.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Ristrutturazione: €/mq + totale auto-sincronizzati */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Ristrutturazione (€/mq)</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={ristrMq}
                        onChange={e => handleRistrMq(e.target.value)}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Ristrutturazione (totale)</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={voci.ristrutturazione}
                        onChange={e => handleRistrTot(e.target.value)}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                    </div>
                  </div>
                </div>

                {VOCI_CONFIG.filter(v => v.key !== 'ristrutturazione').map(v => (
                  <div key={v.key}>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">{v.label}</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={voci[v.key]}
                        onChange={e => setVoci(p => ({ ...p, [v.key]: fmtInput(e.target.value) }))}
                        placeholder="0"
                        className="pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ricavi */}
            <section className="bg-white rounded-xl border border-slate-100 p-6">
              <h2 className="text-sm font-extrabold text-[#002147] mb-4 uppercase tracking-widest">Ricavi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Rivendita 1</label>
                  <div className="relative">
                    <input type="text" inputMode="decimal" value={rivendita1} onChange={e => setRivendita1(fmtInput(e.target.value))} placeholder="0" className="pr-8" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Rivendita 2</label>
                  <div className="relative">
                    <input type="text" inputMode="decimal" value={rivendita2} onChange={e => setRivendita2(fmtInput(e.target.value))} placeholder="0" className="pr-8" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Esposizione finanziaria
                    <span className="text-slate-400 font-normal normal-case tracking-normal ml-1">(capitale realmente impegnato)</span>
                  </label>
                  <div className="relative">
                    <input type="text" inputMode="decimal" value={esposizione} onChange={e => setEsposizione(fmtInput(e.target.value))} placeholder="0" className="pr-8" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Riepilogo sticky */}
          <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
            <div className="bg-[#002147] text-white rounded-xl p-6">
              <p className="text-[0.625rem] uppercase tracking-widest font-bold text-white/50 mb-4">Riepilogo</p>

              <div className="space-y-3 text-sm">
                <Row label="Costi (escluso acquisto)" value={fmtEur(calc.altriCosti)} />
                <Row label="Acquisto" value={fmtEur(calc.acquisto)} />
                <div className="border-t border-white/10 pt-3">
                  <Row label="Totale costi" value={fmtEur(calc.totaleCosti)} bold />
                </div>
                <Row label="Totale rivendita" value={fmtEur(calc.totaleRivendita)} bold />
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-[0.625rem] uppercase tracking-widest font-bold text-white/50">Utile lordo</span>
                  <span className={`text-2xl font-extrabold ${calc.utile >= 0 ? 'text-emerald-300' : 'text-red-300'}`} style={{ fontFamily: 'var(--font-headline)' }}>
                    {fmtEur(calc.utile)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-white/50">ROI</p>
                    <p className="text-lg font-bold mt-1">{fmtPct(calc.roi)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-white/50">ROE</p>
                    <p className="text-lg font-bold mt-1">{fmtPct(calc.roe)}</p>
                  </div>
                </div>
              </div>
            </div>

            {isLogged ? (
              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-[#4463ee] text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 text-sm"
                >
                  {saving ? 'Salvataggio…' : 'Salva in dashboard'}
                </button>
                {savedMsg && <p className="text-xs text-emerald-600 text-center">{savedMsg}</p>}
                {saveError && <p className="text-xs text-red-600 text-center">{saveError}</p>}
                <Link href="/dashboard" className="block text-center text-xs text-slate-500 hover:text-[#002147]">
                  Vai alla dashboard
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Accedi per salvare i tuoi conti economici e ritrovarli nella dashboard.
                </p>
                <Link href="/login" className="block w-full bg-[#4463ee] text-white font-bold py-3 rounded-xl text-center text-sm hover:brightness-110 transition-all">
                  Accedi
                </Link>
                <Link href="/registrazione" className="block text-center text-xs text-slate-500 hover:text-[#002147] py-1">
                  Non hai un account? Registrati
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/70">{label}</span>
      <span className={bold ? 'font-bold' : ''}>{value}</span>
    </div>
  );
}
