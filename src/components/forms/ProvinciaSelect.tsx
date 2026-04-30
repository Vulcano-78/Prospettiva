'use client';

import { useMemo } from 'react';
import { useProvince } from '@/hooks/useTerritorio';

const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#516169]';
const selectClass =
  'w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none disabled:bg-slate-50 disabled:text-slate-400';

interface ProvinciaSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

export default function ProvinciaSelect({
  value,
  onChange,
  disabled,
  error,
  label = 'Provincia *',
  required = true,
}: ProvinciaSelectProps) {
  const { province, isLoading, error: fetchError, retry } = useProvince();

  const sorted = useMemo(
    () =>
      [...province].sort((a, b) =>
        a.nome_provincia.localeCompare(b.nome_provincia, 'it')
      ),
    [province]
  );

  if (fetchError) {
    return (
      <div className="space-y-1.5">
        {label && <label className={labelClass}>{label}</label>}
        <div className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 flex items-center justify-between gap-2">
          <span>Errore: impossibile caricare le province</span>
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

  return (
    <div className="space-y-1.5">
      {label && <label className={labelClass}>{label}</label>}
      <div className="relative">
        <select
          className={selectClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled || isLoading}
        >
          <option value="">{isLoading ? 'Caricamento province...' : 'Seleziona...'}</option>
          {sorted.map((p) => (
            <option key={p.provincia} value={p.provincia}>
              {p.nome_provincia} ({p.provincia})
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
