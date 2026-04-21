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

export default function AddressAutocomplete({ value, onChange, onSelect, placeholder = 'Inizia a digitare...', required = false }: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef(crypto.randomUUID());

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
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      // Use Mapbox Search Box API (suggest endpoint)
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(query)}&country=IT&language=it&types=address&limit=5&session_token=${sessionTokenRef.current}&access_token=${token}`
      );
      const data = await res.json();

      if (data.suggestions) {
        const results: AddressSuggestion[] = data.suggestions.map((s: { name: string; full_address?: string; place_formatted?: string; context?: { place?: { name?: string }; postcode?: { name?: string }; region?: { name?: string }; locality?: { name?: string } } }) => ({
          full_address: s.full_address || s.place_formatted || s.name,
          address: s.name || '',
          city: s.context?.place?.name || s.context?.locality?.name || '',
          postcode: s.context?.postcode?.name || '',
          region: s.context?.region?.name || '',
        }));
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch {
      setSuggestions([]);
      setShowDropdown(false);
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
    sessionTokenRef.current = crypto.randomUUID();
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
              {(s.city || s.postcode) && (
                <span className="text-[#74777f] text-xs ml-2">
                  {[s.city, s.postcode].filter(Boolean).join(' — ')}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
