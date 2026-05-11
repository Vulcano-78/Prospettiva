'use client';

import { useEffect } from 'react';
import { useComuni } from '@/hooks/useTerritorio';

const labelClass = 'block text-[0.625rem] font-bold uppercase tracking-widest text-[#516169]';
const selectClass =
  'w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none disabled:bg-slate-50 disabled:text-slate-400';

interface ComuneSelectProps {
  provincia: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export default function ComuneSelect({
  provincia,
  value,
  onChange,
  disabled,
  error,
  label = 'Comune *',
  required = true,
}: ComuneSelectProps) {
  const { comuni, isLoading, error: fetchError, retry } = useComuni(provincia || null);

  // Reset selected value if it no longer exists in the new comuni list
  useEffect(() => {
    if (!provincia || !value) return;
    if (comuni.length === 0 || isLoading) return;
    if (!comuni.some((c) => c.comune === value)) {
      onChange('');
    }
  }, [provincia, comuni, isLoading, value, onChange]);

  if (fetchError) {
    return (
      <div className="space-y-1.5">
        {label && <label className={labelClass}>{label}</label>}
        <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center justify-between gap-2">
          <span>Errore: impossibile caricare i comuni</span>
          <button
            type="button"
            onClick={retry}
            className="text-[#4463ee] font-semibold hover:underline whitespace-nowrap"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  const isDisabled = disabled || !provincia || isLoading;

  return (
    <div className="space-y-1.5">
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        <select
          className={selectClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={isDisabled}
        >
          <option value="">
            {!provincia
              ? 'Seleziona prima la provincia'
              : isLoading
              ? 'Caricamento comuni...'
              : 'Seleziona comune...'}
          </option>
          {comuni.map((c) => (
            <option key={c.comune} value={c.comune}>
              {c.comune}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">
          expand_more
        </span>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
    </div>
  );
}
