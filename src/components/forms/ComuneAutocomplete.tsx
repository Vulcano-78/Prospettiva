'use client';

import { useState, useRef, useEffect } from 'react';
import comuniList from '@/data/comuni-italiani.json';

const labelClass = 'block text-[0.625rem] font-bold uppercase tracking-widest text-[#516169]';
const inputClass = 'w-full bg-white border border-slate-200 px-3 py-2 text-sm';

interface Props {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
}

export default function ComuneAutocomplete({ value, onChange, required = true, label = 'Comune *' }: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep query in sync when parent resets value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (q: string) => {
    setQuery(q);
    onChange('');
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const upper = q.toUpperCase();
    const matches = (comuniList as string[])
      .filter(c => c.startsWith(upper))
      .slice(0, 8);
    setSuggestions(matches);
    setOpen(matches.length > 0);
  };

  const handleSelect = (comune: string) => {
    setQuery(comune);
    onChange(comune);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <input
          type="text"
          className={inputClass}
          placeholder="Es. ROMA"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          required={required && !value}
          autoComplete="off"
        />
        {open && (
          <ul className="absolute z-50 top-full left-0 right-0 bg-white border border-slate-200 shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map(c => (
              <li
                key={c}
                className="px-3 py-2 text-sm text-[#002147] cursor-pointer hover:bg-slate-50"
                onMouseDown={() => handleSelect(c)}
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
