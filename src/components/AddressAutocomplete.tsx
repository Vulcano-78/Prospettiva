'use client';

import { useState, useRef, useEffect } from 'react';

interface AddressSuggestion {
  full_address: string;
  address: string;
  city: string;
  postcode: string;
  region: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  required?: boolean;
}

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder = 'Via Roma 1', required = false }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!token || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(query)}&country=IT&language=it&types=address&limit=5&access_token=${token}`
      );
      const data = await res.json();

      const results: AddressSuggestion[] = (data.features || []).map((f: { properties: { full_address?: string; name?: string; context?: { place?: { name?: string }; postcode?: { name?: string }; region?: { name?: string }; locality?: { name?: string } } } }) => {
        const props = f.properties;
        const ctx = props.context || {};
        return {
          full_address: props.full_address || props.name || '',
          address: props.name || '',
          city: ctx.place?.name || ctx.locality?.name || '',
          postcode: ctx.postcode?.name || '',
          region: ctx.region?.name || '',
        };
      });

      setSuggestions(results);
      setShowDropdown(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (val: string) => {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (s: AddressSuggestion) => {
    onChange(s.address);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect(s);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        className="w-full bg-white border border-slate-200 px-3 py-2 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        required={required}
        autoComplete="off"
      />
      {loading && (
        <span className="absolute right-3 top-2.5 material-symbols-outlined text-slate-300 text-base animate-spin">progress_activity</span>
      )}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-3 py-2.5 text-sm text-[#191c1d] hover:bg-[#f8f9fa] transition-colors cursor-pointer border-b border-slate-50 last:border-0"
            >
              <span className="font-medium">{s.address}</span>
              {s.city && <span className="text-[#74777f] text-xs ml-2">{s.city}{s.postcode ? ` — ${s.postcode}` : ''}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
