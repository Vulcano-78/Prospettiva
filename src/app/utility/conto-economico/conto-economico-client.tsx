'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const VOCI_DEFAULTS_KEY = 'ce_voci_defaults_v1';
const RISTR_MQ_KEY = 'ce_ristr_mq_v1';
const AGENZIA_IN_PCT_KEY = 'ce_agenzia_in_pct_v1';
const AGENZIA_OUT_PCT_KEY = 'ce_agenzia_out_pct_v1';

// Voci i cui valori vengono memorizzati come default per il prossimo CE.
// (Esclude: acquisto, ristrutturazione totale, importi agenzia, voci specifiche
// del singolo immobile come imposte, agibilità, cambio d'uso, imprevisti, altro.)
const MEMORIZED_KEYS = new Set<keyof Voci>([
  'rendering_home_staging',
  'notaio',
  'avvocato',
  'geometra',
  'condom_riscald',
  'pulizia_cantiere',
  'utenze',
]);

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

function fmtPctInput(v: string): string {
  const cleaned = v.replace(/[^\d,]/g, '');
  const [intRaw, ...decRest] = cleaned.split(',');
  const intPart = (intRaw || '').replace(/^0+(?=\d)/, '');
  if (decRest.length === 0) return intPart;
  const dec = decRest.join('').slice(0, 2);
  return `${intPart || '0'},${dec}`;
}

function formatImportoEur(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '';
  return fmtInput(String(Math.round(n)));
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
  const [agenziaInPct, setAgenziaInPct] = useState('');
  const [agenziaOutPct, setAgenziaOutPct] = useState('');
  const [rivendita1, setRivendita1] = useState('');
  const [rivendita2, setRivendita2] = useState('');
  const [esposizione, setEsposizione] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [defaultsLoaded, setDefaultsLoaded] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const skipDirtyRef = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(VOCI_DEFAULTS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Voci>;
        const filtered: Partial<Voci> = {};
        for (const k of Object.keys(saved) as (keyof Voci)[]) {
          if (MEMORIZED_KEYS.has(k) && typeof saved[k] === 'string') {
            filtered[k] = saved[k];
          }
        }
        setVoci(p => ({ ...p, ...filtered }));
      }
      const rm = localStorage.getItem(RISTR_MQ_KEY);
      if (rm) setRistrMq(rm);
      const ain = localStorage.getItem(AGENZIA_IN_PCT_KEY);
      if (ain) setAgenziaInPct(ain);
      const aout = localStorage.getItem(AGENZIA_OUT_PCT_KEY);
      if (aout) setAgenziaOutPct(aout);
    } catch {}
    setDefaultsLoaded(true);
  }, []);

  useEffect(() => {
    if (!defaultsLoaded) return;
    const toSave: Partial<Voci> = {};
    for (const k of MEMORIZED_KEYS) toSave[k] = voci[k];
    try {
      localStorage.setItem(VOCI_DEFAULTS_KEY, JSON.stringify(toSave));
    } catch {}
  }, [voci, defaultsLoaded]);

  useEffect(() => {
    if (!defaultsLoaded) return;
    try { localStorage.setItem(RISTR_MQ_KEY, ristrMq); } catch {}
  }, [ristrMq, defaultsLoaded]);

  useEffect(() => {
    if (!defaultsLoaded) return;
    try { localStorage.setItem(AGENZIA_IN_PCT_KEY, agenziaInPct); } catch {}
  }, [agenziaInPct, defaultsLoaded]);

  useEffect(() => {
    if (!defaultsLoaded) return;
    try { localStorage.setItem(AGENZIA_OUT_PCT_KEY, agenziaOutPct); } catch {}
  }, [agenziaOutPct, defaultsLoaded]);

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
    setAgenziaInPct('');
    setAgenziaOutPct('');
    setRivendita1('');
    setRivendita2('');
    setEsposizione('');
    try {
      localStorage.removeItem(VOCI_DEFAULTS_KEY);
      localStorage.removeItem(RISTR_MQ_KEY);
      localStorage.removeItem(AGENZIA_IN_PCT_KEY);
      localStorage.removeItem(AGENZIA_OUT_PCT_KEY);
    } catch {}
    setCurrentId(null);
    setIsDirty(false);
    skipDirtyRef.current = true;
  };

  // Agenzia acquisto: importo = acquisto × pct
  useEffect(() => {
    const base = num(voci.acquisto);
    const pct = num(agenziaInPct);
    const imp = base > 0 && pct > 0 ? (base * pct) / 100 : 0;
    setVoci(p => ({ ...p, agenzia_in: formatImportoEur(imp) }));
  }, [voci.acquisto, agenziaInPct]);

  // Agenzia vendita: importo = totale rivendita × pct
  useEffect(() => {
    const base = num(rivendita1) + num(rivendita2);
    const pct = num(agenziaOutPct);
    const imp = base > 0 && pct > 0 ? (base * pct) / 100 : 0;
    setVoci(p => ({ ...p, agenzia_out: formatImportoEur(imp) }));
  }, [rivendita1, rivendita2, agenziaOutPct]);

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

  const hasContent = useMemo(() => {
    if (titolo.trim()) return true;
    if (num(voci.acquisto) > 0) return true;
    if (num(rivendita1) > 0 || num(rivendita2) > 0) return true;
    return false;
  }, [titolo, voci.acquisto, rivendita1, rivendita2]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setSaveError('');
    const payload = {
      titolo: titolo || `CE ${new Date().toLocaleDateString('it-IT')}`,
      regime: 'persona_fisica' as const,
      data: { descrizione, mq, unita, voci, rivendita1, rivendita2, esposizione },
    };
    try {
      const res = currentId
        ? await fetch('/api/conti-economici', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentId, ...payload }),
          })
        : await fetch('/api/conti-economici', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
      if (!res.ok) {
        setSaveError('Errore nel salvataggio.');
      } else {
        const json = await res.json().catch(() => null);
        if (!currentId && json?.item?.id) setCurrentId(json.item.id);
        setIsDirty(false);
      }
    } catch {
      setSaveError('Errore di rete.');
    } finally {
      setSaving(false);
    }
  }, [saving, currentId, titolo, descrizione, mq, unita, voci, rivendita1, rivendita2, esposizione]);

  // Mark dirty su ogni modifica utente (skip primo passaggio dopo load defaults)
  useEffect(() => {
    if (!defaultsLoaded) return;
    if (skipDirtyRef.current) {
      skipDirtyRef.current = false;
      return;
    }
    setIsDirty(true);
  }, [titolo, descrizione, mq, unita, voci, rivendita1, rivendita2, esposizione, defaultsLoaded]);

  // Autosave debounced ~5s dopo l'ultima modifica
  useEffect(() => {
    if (!isLogged || !isDirty || !hasContent || saving) return;
    const t = setTimeout(() => { handleSave(); }, 5000);
    return () => clearTimeout(t);
  }, [isLogged, isDirty, hasContent, saving, handleSave]);

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
              <p className="text-[0.6875rem] text-slate-400 mb-4">
                I costi contrassegnati con <span className="text-[#4463EE] font-bold">*</span> restano memorizzati per il prossimo conto economico.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Ristrutturazione: €/mq + totale auto-sincronizzati */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Ristrutturazione (€/mq) <span className="text-[#4463EE]">*</span>
                    </label>
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

                {VOCI_CONFIG.filter(v => v.key !== 'ristrutturazione').map(v => {
                  if (v.key === 'agenzia_in' || v.key === 'agenzia_out') {
                    const pct = v.key === 'agenzia_in' ? agenziaInPct : agenziaOutPct;
                    const setPct = v.key === 'agenzia_in' ? setAgenziaInPct : setAgenziaOutPct;
                    return (
                      <div key={v.key}>
                        <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          {v.label} <span className="text-[#4463EE]">*</span>
                        </label>
                        <div className="grid grid-cols-[5rem_1fr] gap-2">
                          <div className="relative">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={pct}
                              onChange={e => setPct(fmtPctInput(e.target.value))}
                              placeholder="0"
                              className="pr-7 text-center"
                              aria-label={`${v.label} percentuale`}
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">%</span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={voci[v.key]}
                              readOnly
                              tabIndex={-1}
                              placeholder="0"
                              className="pr-8"
                              aria-label={`${v.label} importo calcolato`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">€</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const isMemorized = MEMORIZED_KEYS.has(v.key);
                  return (
                    <div key={v.key}>
                      <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {v.label}
                        {isMemorized && <span className="text-[#4463EE] ml-1">*</span>}
                      </label>
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
                  );
                })}
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
              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-2">
                <button
                  onClick={handleSave}
                  disabled={saving || (!isDirty && !!currentId) || !hasContent}
                  aria-live="polite"
                  className={`w-full font-bold py-3 rounded-xl transition-all text-sm inline-flex items-center justify-center gap-2 ${
                    saving
                      ? 'bg-[#4463ee] text-white opacity-70 cursor-wait'
                      : isDirty || !currentId
                        ? 'bg-[#4463ee] text-white hover:brightness-110'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  } disabled:cursor-not-allowed`}
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      Salvataggio…
                    </>
                  ) : isDirty || !currentId ? (
                    <>
                      <span className="material-symbols-outlined text-base">save</span>
                      Salva
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      Salvato
                    </>
                  )}
                </button>
                {saveError && <p className="text-xs text-red-600 text-center">{saveError}</p>}
                <Link href="/dashboard" className="block text-center text-xs text-slate-500 hover:text-[#002147] pt-1">
                  Vai alla dashboard
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Accedi per salvare i tuoi conti economici e ritrovarli nella dashboard.
                </p>
                <Link href="/login" className="block w-full bg-[#4463ee] text-white font-bold py-3 rounded-xl text-center text-sm hover:brightness-110 transition-all">
                  Accedi
                </Link>
                <p className="text-center text-xs text-slate-500 pt-1">
                  Non hai un account?{' '}
                  <Link href="/registrazione" className="text-[#4463ee] font-bold underline underline-offset-2 hover:text-[#002147]">
                    Registrati
                  </Link>
                </p>
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
