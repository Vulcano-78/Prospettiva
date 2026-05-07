'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ProgressBar from '@/components/ProgressBar';
import { useCart, CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/services';
import ProvinciaSelect from '@/components/forms/ProvinciaSelect';
import ComuneSelect from '@/components/forms/ComuneSelect';

function isVisura(slug: string) {
  return slug === 'visura-catastale' || slug === 'visura-catastale-storica';
}
function isEstrattoMappa(slug: string) {
  return slug === 'estratto-mappa' || slug === 'elaborato-planimetrico';
}
function isProspettoCatastale(slug: string) { return slug === 'prospetto-catastale'; }
function isRicercaPersona(slug: string) { return slug === 'ricerca-persona'; }
function isRicercaNazionale(slug: string) { return slug === 'ricerca-nazionale'; }
function isRicercaIndirizzo(slug: string) { return slug === 'ricerca-indirizzo'; }
function isIspezioneIpotecariaNazionale(slug: string) { return slug === 'ispezione-ipotecaria-nazionale'; }
function isIspezioneIpotecaria(slug: string) { return slug === 'ispezione-ipotecaria'; }
function isElencoNoteIpotecarie(slug: string) { return slug === 'elenco-note-ipotecarie'; }

const selectClass = 'w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none';
const inputClass = 'w-full bg-white border border-slate-200 px-3 py-2 text-sm';
const labelClass = 'block text-[10px] font-bold uppercase tracking-widest text-[#516169]';

function ProvinciaComune({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  return (
    <>
      <ProvinciaSelect value={data.provincia || ''} onChange={onProvinciaChange} />
      <ComuneSelect
        provincia={data.provincia || ''}
        value={data.comune || ''}
        onChange={(v) => onChange('comune', v)}
      />
    </>
  );
}

function TipoCatastoSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>Tipo Catasto *</label>
      <div className="relative">
        <select className={selectClass} value={value || 'F'} onChange={(e) => onChange(e.target.value)} required>
          <option value="F">Fabbricati</option>
          <option value="T">Terreni</option>
          <option value="TF">Entrambi</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
      </div>
    </div>
  );
}

function TipoCatastoFTSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>Tipo Catasto *</label>
      <div className="relative">
        <select className={selectClass} value={value || 'F'} onChange={(e) => onChange(e.target.value)} required>
          <option value="F">Fabbricati</option>
          <option value="T">Terreni</option>
        </select>
        <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
      </div>
    </div>
  );
}

function ProspettoCatastaleFields({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProvinciaComune data={data} onChange={onChange} onProvinciaChange={onProvinciaChange} />
      <div className="space-y-1.5">
        <label className={labelClass}>Foglio *</label>
        <input type="text" className={inputClass} placeholder="1" value={data.foglio || ''} onChange={(e) => onChange('foglio', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Particella *</label>
        <input type="text" className={inputClass} placeholder="1" value={data.particella || ''} onChange={(e) => onChange('particella', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Subalterno</label>
        <input type="text" className={inputClass} placeholder="Es. 1" value={data.subalterno || ''} onChange={(e) => onChange('subalterno', e.target.value)} />
      </div>
      <TipoCatastoSelect value={data.tipo_catasto} onChange={(v) => onChange('tipo_catasto', v)} />
    </div>
  );
}

function RicercaPersonaFields({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-1.5">
        <label className={labelClass}>Codice Fiscale o Partita IVA *</label>
        <input type="text" className={inputClass} placeholder="RSSMRA85L01H501Z / 12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
      </div>
      <TipoCatastoSelect value={data.tipo_catasto} onChange={(v) => onChange('tipo_catasto', v)} />
      <ProvinciaSelect value={data.provincia || ''} onChange={onProvinciaChange} />
    </div>
  );
}

function RicercaNazionaleFields({ data, onChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-1.5">
        <label className={labelClass}>Codice Fiscale o Partita IVA *</label>
        <input type="text" className={inputClass} placeholder="RSSMRA85L01H501Z / 12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
      </div>
      <TipoCatastoSelect value={data.tipo_catasto} onChange={(v) => onChange('tipo_catasto', v)} />
    </div>
  );
}

function RicercaIndirizzoFields({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProvinciaComune data={data} onChange={onChange} onProvinciaChange={onProvinciaChange} />
      <TipoCatastoSelect value={data.tipo_catasto} onChange={(v) => onChange('tipo_catasto', v)} />
      <div className="md:col-span-2 space-y-1.5">
        <label className={labelClass}>Indirizzo *</label>
        <input type="text" className={inputClass} placeholder="Via Roma 12" value={data.indirizzo || ''} onChange={(e) => onChange('indirizzo', e.target.value)} required />
      </div>
    </div>
  );
}

function EstrattoMappaFields({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ProvinciaComune data={data} onChange={onChange} onProvinciaChange={onProvinciaChange} />
      <div className="space-y-1.5">
        <label className={labelClass}>Foglio *</label>
        <input type="text" className={inputClass} placeholder="1" value={data.foglio || ''} onChange={(e) => onChange('foglio', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Particella *</label>
        <input type="text" className={inputClass} placeholder="1" value={data.particella || ''} onChange={(e) => onChange('particella', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Sezione</label>
        <input type="text" className={inputClass} placeholder="Es. A" value={data.sezione || ''} onChange={(e) => onChange('sezione', e.target.value)} />
      </div>
    </div>
  );
}

function VisuraFields({ item, data, onChange, onProvinciaChange }: {
  item: CartItem;
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  const [searchType, setSearchType] = useState<'immobile' | 'soggetto' | 'soggetto-giuridico'>(
    (data._searchType as 'immobile' | 'soggetto' | 'soggetto-giuridico') || 'immobile'
  );

  const handleSearchTypeChange = (type: typeof searchType) => {
    setSearchType(type);
    onChange('_searchType', type);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Modalita di ricerca</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'immobile' as const, label: 'Per Immobile', icon: 'home' },
            { value: 'soggetto' as const, label: 'Per Soggetto', icon: 'person' },
            { value: 'soggetto-giuridico' as const, label: 'Sogg. Giuridico', icon: 'business' },
          ]).map(opt => (
            <button key={opt.value} type="button" onClick={() => handleSearchTypeChange(opt.value)}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 border rounded-lg transition-all text-xs font-bold ${
                searchType === opt.value ? 'border-[#002147] bg-[#002147] text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
              <span className="material-symbols-outlined text-base">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searchType === 'immobile' && (
          <>
            <ProvinciaComune data={data} onChange={onChange} onProvinciaChange={onProvinciaChange} />
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className={labelClass}>Foglio *</label>
                <input type="text" className={inputClass} placeholder="1" value={data.foglio || ''} onChange={(e) => onChange('foglio', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Particella *</label>
                <input type="text" className={inputClass} placeholder="1" value={data.particella || ''} onChange={(e) => onChange('particella', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Subalterno</label>
                <input type="text" className={inputClass} placeholder="1" value={data.subalterno || ''} onChange={(e) => onChange('subalterno', e.target.value)} />
              </div>
            </div>
          </>
        )}
        {searchType === 'soggetto' && (
          <>
            <div className="space-y-1.5">
              <label className={labelClass}>Codice Fiscale *</label>
              <input type="text" className={inputClass} placeholder="RSSMRA85M01H501Z" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
            <ProvinciaSelect value={data.provincia || ''} onChange={(v) => onChange('provincia', v)} />
          </>
        )}
        {searchType === 'soggetto-giuridico' && (
          <>
            <div className="space-y-1.5">
              <label className={labelClass}>Partita IVA *</label>
              <input type="text" className={inputClass} placeholder="12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
            <ProvinciaSelect value={data.provincia || ''} onChange={(v) => onChange('provincia', v)} />
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Tipo Catasto</label>
          <div className="relative">
            <select className={selectClass} value={data.tipo_catasto || 'F'} onChange={(e) => onChange('tipo_catasto', e.target.value)}>
              <option value="F">Fabbricati</option>
              <option value="T">Terreni</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Tipo Dettaglio</label>
          <div className="relative">
            <select className={selectClass} value={data.tipo_dettaglio || 'sintetica'} onChange={(e) => onChange('tipo_dettaglio', e.target.value)}>
              <option value="sintetica">Sintetica</option>
              <option value="analitica">Analitica</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type Conservatoria = { id: string; conservatoria: string };

function ConservatoriaSelect({ value, onChange, conservatorie, loading }: {
  value: string;
  onChange: (value: string) => void;
  conservatorie: Conservatoria[];
  loading: boolean;
}) {
  if (!loading && conservatorie.length === 0) {
    return (
      <div className="space-y-1.5">
        <label className={labelClass}>Conservatoria *</label>
        <input
          type="text"
          className={inputClass}
          placeholder="Es. Roma o codice ufficio"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          required
        />
      </div>
    );
  }
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>Conservatoria *</label>
      <div className="relative">
        <select className={selectClass} value={value || ''} onChange={(e) => onChange(e.target.value)} required disabled={loading}>
          <option value="">{loading ? 'Caricamento...' : 'Seleziona...'}</option>
          {conservatorie.map(c => (
            <option key={c.id} value={c.conservatoria}>{c.conservatoria}</option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
      </div>
    </div>
  );
}

function IspezioneIpotecariaNazionaleFields({ data, onChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 space-y-1.5">
        <label className={labelClass}>Codice Fiscale o Partita IVA *</label>
        <input type="text" className={inputClass} placeholder="RSSMRA85L01H501Z / 12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
      </div>
    </div>
  );
}

function useConservatorie() {
  const [conservatorie, setConservatorie] = useState<Conservatoria[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/territorio/conservatorie')
      .then(r => r.json())
      .then(json => {
        if (cancelled) return;
        const list: Conservatoria[] = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);
        setConservatorie(list);
      })
      .catch(() => { if (!cancelled) setConservatorie([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);
  return { conservatorie, loading };
}

type IpotecariaMode = 'immobile' | 'soggetto' | 'soggetto-giuridico';

const IPOTECARIA_MODE_OPTIONS: Array<{ value: IpotecariaMode; label: string; icon: string }> = [
  { value: 'immobile', label: 'Per Immobile', icon: 'home' },
  { value: 'soggetto', label: 'Per Soggetto', icon: 'person' },
  { value: 'soggetto-giuridico', label: 'Sogg. Giuridico', icon: 'business' },
];

function ModeSwitch({ mode, onChange }: {
  mode: IpotecariaMode;
  onChange: (m: IpotecariaMode) => void;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>Modalita di ricerca</label>
      <div className="grid grid-cols-3 gap-2">
        {IPOTECARIA_MODE_OPTIONS.map(opt => (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 border rounded-lg transition-all text-xs font-bold ${
              mode === opt.value ? 'border-[#002147] bg-[#002147] text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            <span className="material-symbols-outlined text-base">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ImmobileFieldsBlock({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  return (
    <>
      <ProvinciaSelect value={data.provincia || ''} onChange={onProvinciaChange} />
      <ComuneSelect value={data.comune || ''} provincia={data.provincia || ''} onChange={(v) => onChange('comune', v)} />
      <TipoCatastoFTSelect value={data.tipo_catasto} onChange={(v) => onChange('tipo_catasto', v)} />
      <div className="space-y-1.5">
        <label className={labelClass}>Foglio *</label>
        <input type="number" className={inputClass} placeholder="1" value={data.foglio || ''} onChange={(e) => onChange('foglio', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Particella *</label>
        <input type="number" className={inputClass} placeholder="1" value={data.particella || ''} onChange={(e) => onChange('particella', e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Subalterno</label>
        <input type="number" className={inputClass} placeholder="Es. 1" value={data.subalterno || ''} onChange={(e) => onChange('subalterno', e.target.value)} />
      </div>
    </>
  );
}

function IspezioneIpotecariaFields({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<IpotecariaMode>(
    (data._mode as IpotecariaMode) || 'immobile'
  );
  const { conservatorie, loading } = useConservatorie();

  const handleModeChange = (m: IpotecariaMode) => {
    setMode(m);
    onChange('_mode', m);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConservatoriaSelect value={data.conservatoria || ''} onChange={(v) => onChange('conservatoria', v)} conservatorie={conservatorie} loading={loading} />
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-4">
        <ModeSwitch mode={mode} onChange={handleModeChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === 'immobile' && <ImmobileFieldsBlock data={data} onChange={onChange} onProvinciaChange={onProvinciaChange} />}
          {mode === 'soggetto' && (
            <div className="md:col-span-2 space-y-1.5">
              <label className={labelClass}>Codice Fiscale *</label>
              <input type="text" className={inputClass} placeholder="RSSMRA85L01H501Z" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
          )}
          {mode === 'soggetto-giuridico' && (
            <div className="md:col-span-2 space-y-1.5">
              <label className={labelClass}>Partita IVA *</label>
              <input type="text" className={inputClass} placeholder="12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SingolaNotaFields({ data, onChange, onProvinciaChange }: {
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onProvinciaChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<IpotecariaMode>(
    (data._mode as IpotecariaMode) || 'soggetto'
  );
  const { conservatorie, loading } = useConservatorie();

  const handleModeChange = (m: IpotecariaMode) => {
    setMode(m);
    onChange('_mode', m);
    const tipoRestrizione =
      m === 'immobile' ? 'immobile' :
      m === 'soggetto-giuridico' ? 'soggetto_giuridico' :
      'soggetto_fisico';
    onChange('tipo_restrizione', tipoRestrizione);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConservatoriaSelect value={data.conservatoria || ''} onChange={(v) => onChange('conservatoria', v)} conservatorie={conservatorie} loading={loading} />
        <div className="space-y-1.5">
          <label className={labelClass}>Anno *</label>
          <input type="number" className={inputClass} placeholder="2024" value={data.anno || ''} onChange={(e) => onChange('anno', e.target.value)} required />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className={labelClass}>Registro Generale *</label>
          <input type="number" className={inputClass} placeholder="Es. 12345" value={data.registro_generale || ''} onChange={(e) => onChange('registro_generale', e.target.value)} required />
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-4">
        <ModeSwitch mode={mode} onChange={handleModeChange} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mode === 'immobile' && <ImmobileFieldsBlock data={data} onChange={onChange} onProvinciaChange={onProvinciaChange} />}
          {mode === 'soggetto' && (
            <div className="md:col-span-2 space-y-1.5">
              <label className={labelClass}>Codice Fiscale *</label>
              <input type="text" className={inputClass} placeholder="RSSMRA85L01H501Z" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
          )}
          {mode === 'soggetto-giuridico' && (
            <div className="md:col-span-2 space-y-1.5">
              <label className={labelClass}>Partita IVA *</label>
              <input type="text" className={inputClass} placeholder="12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function CartPage() {
  const router = useRouter();
  const { items, updateItem, removeItem, getSubtotal, getIVA, getTotal, clearCart } = useCart();

  const handleItemFieldChange = (itemId: string, currentFormData: Record<string, string>, name: string, value: string) => {
    updateItem(itemId, { ...currentFormData, [name]: value });
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/checkout/dati');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-16">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_cart</span>
            <h1 className="text-2xl font-bold text-[#002147] mb-2">Il tuo carrello e vuoto</h1>
            <p className="text-[#44474e] mb-6">Aggiungi servizi dal catalogo per iniziare.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#002147] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">arrow_back</span>
              Torna al catalogo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  let sectionNum = 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="w-full pt-20 mb-4 md:mb-6">
        <ProgressBar currentStep={1} />
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-5xl mx-auto w-full">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Carrello
          </h1>
          <p className="text-[#44474e] text-sm">
            Inserisci i dati necessari per ogni servizio.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Service forms */}
          <div className="lg:col-span-2 space-y-6">
            <form id="carrello-form" onSubmit={handleProceed} className="space-y-6">
              {items.map(item => {
                sectionNum++;
                const sectionContent = isVisura(item.service.slug) ? (
                  <VisuraFields
                    item={item}
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value, comune: '' })}
                  />
                ) : isEstrattoMappa(item.service.slug) ? (
                  <EstrattoMappaFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value, comune: '' })}
                  />
                ) : isProspettoCatastale(item.service.slug) ? (
                  <ProspettoCatastaleFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value, comune: '' })}
                  />
                ) : isRicercaPersona(item.service.slug) ? (
                  <RicercaPersonaFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value })}
                  />
                ) : isRicercaNazionale(item.service.slug) ? (
                  <RicercaNazionaleFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                  />
                ) : isRicercaIndirizzo(item.service.slug) ? (
                  <RicercaIndirizzoFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value, comune: '' })}
                  />
                ) : isIspezioneIpotecariaNazionale(item.service.slug) ? (
                  <IspezioneIpotecariaNazionaleFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                  />
                ) : isIspezioneIpotecaria(item.service.slug) ? (
                  <IspezioneIpotecariaFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value, comune: '' })}
                  />
                ) : isElencoNoteIpotecarie(item.service.slug) ? (
                  <SingolaNotaFields
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                    onProvinciaChange={(value) => updateItem(item.id, { ...item.formData, provincia: value, comune: '' })}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.service.fields.map(field => {
                      if (field.name === 'provincia') {
                        return (
                          <ProvinciaSelect
                            key={field.name}
                            label={`${field.label} ${field.required ? '*' : ''}`.trim()}
                            value={item.formData[field.name] || ''}
                            onChange={(v) => updateItem(item.id, { ...item.formData, provincia: v, comune: '' })}
                            required={field.required}
                          />
                        );
                      }
                      if (field.name === 'comune') {
                        return (
                          <ComuneSelect
                            key={field.name}
                            label={`${field.label} ${field.required ? '*' : ''}`.trim()}
                            provincia={item.formData.provincia || ''}
                            value={item.formData[field.name] || ''}
                            onChange={(v) => handleItemFieldChange(item.id, item.formData, field.name, v)}
                            required={field.required}
                          />
                        );
                      }
                      return (
                        <div key={field.name} className="space-y-1.5">
                          <label className={labelClass}>{field.label} {field.required && '*'}</label>
                          {field.type === 'select' ? (
                            <div className="relative">
                              <select className={selectClass} value={item.formData[field.name] || ''} onChange={(e) => handleItemFieldChange(item.id, item.formData, field.name, e.target.value)} required={field.required}>
                                <option value="">Seleziona...</option>
                                {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                              <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
                            </div>
                          ) : (
                            <input type={field.type} className={inputClass} placeholder={field.placeholder} value={item.formData[field.name] || ''} onChange={(e) => handleItemFieldChange(item.id, item.formData, field.name, e.target.value)} required={field.required} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                );

                return (
                  <section key={item.id} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold text-[#002147] flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">{sectionNum}</span>
                        {item.service.name}
                      </h2>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#c4c6cf] hover:text-[#ba1a1a] transition-colors cursor-pointer p-1"
                        title="Rimuovi servizio"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                    {sectionContent}
                  </section>
                );
              })}
            </form>

            <div className="mt-2 flex flex-col items-center gap-3">
              <button
                type="submit"
                form="carrello-form"
                className="w-full max-w-xs bg-[#4463ee] text-white font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Continua</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="text-[#44474e] hover:text-[#ba1a1a] text-sm font-medium transition-colors cursor-pointer"
              >
                Svuota carrello
              </button>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-3">
            <section className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm">
              <h2 className="text-lg font-bold text-[#002147] mb-5 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                <span className="material-symbols-outlined text-[#4463ee]">receipt_long</span>
                Riepilogo
              </h2>
              <div className="space-y-3 mb-5">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#191c1d] font-medium truncate">{item.service.name}</p>
                      <p className="text-xs text-[#74777f]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#002147] whitespace-nowrap">{formatPrice(item.service.price)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm text-[#44474e]">
                  <span>Subtotale</span>
                  <span className="font-medium text-[#191c1d]">{formatPrice(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm text-[#44474e]">
                  <span>IVA (22%)</span>
                  <span className="font-medium text-[#191c1d]">{formatPrice(getIVA())}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-2">
                  <span className="text-base font-bold text-[#002147]">Totale</span>
                  <span className="text-xl font-extrabold text-[#002147]">{formatPrice(getTotal())}</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#44474e]">
                  <span className="material-symbols-outlined text-base text-[#28a428]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                  Documenti consegnati entro 60 minuti
                </div>
              </div>
            </section>
            <div className="flex items-center justify-center gap-2 text-xs text-[#44474e] mt-3">
              <span className="material-symbols-outlined text-sm text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              Pagamento sicuro con crittografia SSL
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
