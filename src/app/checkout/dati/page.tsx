'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ProgressBar from '@/components/ProgressBar';
import { useCart, CartItem } from '@/context/CartContext';
import { formatPrice } from '@/data/services';
import { province, comuniPerProvincia } from '@/data/comuni';
import AddressAutocomplete from '@/components/AddressAutocomplete';

type AccountType = 'privato' | 'impresa' | 'professionista';

function isVisura(slug: string) {
  return slug === 'visura-catastale' || slug === 'visura-catastale-storica';
}

/* ─── Visura-specific fields ─── */
function VisuraFields({ item, data, onChange }: {
  item: CartItem;
  data: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  const [searchType, setSearchType] = useState<'immobile' | 'soggetto' | 'soggetto-giuridico'>(
    (data._searchType as 'immobile' | 'soggetto' | 'soggetto-giuridico') || 'immobile'
  );

  const handleSearchTypeChange = (type: typeof searchType) => {
    setSearchType(type);
    onChange('_searchType', type);
  };

  const handleProvinciaChange = (value: string) => {
    onChange('provincia', value);
    onChange('comune', '');
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
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Provincia *</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={data.provincia || ''} onChange={(e) => handleProvinciaChange(e.target.value)} required>
                  <option value="">Seleziona...</option>
                  {province.map(p => <option key={p.sigla} value={p.sigla}>{p.sigla} — {p.nome}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Comune *</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={data.comune || ''} onChange={(e) => onChange('comune', e.target.value)} required disabled={!data.provincia}>
                  <option value="">{data.provincia ? 'Seleziona comune...' : 'Seleziona prima la provincia'}</option>
                  {(comuniPerProvincia[data.provincia] || []).map(c => <option key={c.nome} value={c.nome.toUpperCase()}>{c.nome}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Foglio *</label>
                <input type="text" className="w-full bg-white border border-slate-200 px-3 py-2 text-sm" placeholder="1" value={data.foglio || ''} onChange={(e) => onChange('foglio', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Particella *</label>
                <input type="text" className="w-full bg-white border border-slate-200 px-3 py-2 text-sm" placeholder="1" value={data.particella || ''} onChange={(e) => onChange('particella', e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Subalterno</label>
                <input type="text" className="w-full bg-white border border-slate-200 px-3 py-2 text-sm" placeholder="1" value={data.subalterno || ''} onChange={(e) => onChange('subalterno', e.target.value)} />
              </div>
            </div>
          </>
        )}
        {searchType === 'soggetto' && (
          <>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Codice Fiscale *</label>
              <input type="text" className="w-full bg-white border border-slate-200 px-3 py-2 text-sm" placeholder="RSSMRA85M01H501Z" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Provincia *</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={data.provincia || ''} onChange={(e) => onChange('provincia', e.target.value)} required>
                  <option value="">Seleziona...</option>
                  {province.map(p => <option key={p.sigla} value={p.sigla}>{p.sigla} — {p.nome}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
              </div>
            </div>
          </>
        )}
        {searchType === 'soggetto-giuridico' && (
          <>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Partita IVA *</label>
              <input type="text" className="w-full bg-white border border-slate-200 px-3 py-2 text-sm" placeholder="12345678901" value={data.cf_piva || ''} onChange={(e) => onChange('cf_piva', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Provincia *</label>
              <div className="relative">
                <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={data.provincia || ''} onChange={(e) => onChange('provincia', e.target.value)} required>
                  <option value="">Seleziona...</option>
                  {province.map(p => <option key={p.sigla} value={p.sigla}>{p.sigla} — {p.nome}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Tipo Catasto</label>
          <div className="relative">
            <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={data.tipo_catasto || 'F'} onChange={(e) => onChange('tipo_catasto', e.target.value)}>
              <option value="F">Fabbricati</option>
              <option value="T">Terreni</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">Tipo Dettaglio</label>
          <div className="relative">
            <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={data.tipo_dettaglio || 'sintetica'} onChange={(e) => onChange('tipo_dettaglio', e.target.value)}>
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

/* ─── Main Page ─── */
export default function CheckoutDataPage() {
  const router = useRouter();
  const { items, updateItem, removeItem, getSubtotal, getIVA, getTotal } = useCart();

  const [accountType, setAccountType] = useState<AccountType>('privato');
  const [showAltEmail, setShowAltEmail] = useState(false);
  const [cfManuallyEdited, setCfManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    emailDocumenti: '',
    codiceFiscale: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
    // Impresa / Professionista
    ragioneSociale: '',
    partitaIva: '',
    pec: '',
    codiceDestinatario: '',
    sedeLegaleIndirizzo: '',
    sedeLegaleCap: '',
    sedeLegaleComune: '',
    sedeLegaleProvincia: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      // Auto-copy P.IVA to CF unless CF was manually edited
      if (name === 'partitaIva' && !cfManuallyEdited) {
        next.codiceFiscale = value;
      }
      if (name === 'codiceFiscale') {
        setCfManuallyEdited(true);
      }
      return next;
    });
  };

  const handleItemFieldChange = (itemId: string, currentFormData: Record<string, string>, name: string, value: string) => {
    updateItem(itemId, { ...currentFormData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try { localStorage.setItem('checkoutEmail', formData.email); } catch {}
    router.push('/checkout/pagamento');
  };

  if (items.length === 0) {
    router.push('/carrello');
    return null;
  }

  const needsDelegate = items.some(item => item.service.requiresDelegate);
  let sectionNum = 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="w-full pt-20 mb-4 md:mb-6">
        <ProgressBar currentStep={2} />
      </div>

      <main className="flex-grow pb-24 px-4 md:px-6 max-w-5xl mx-auto w-full">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#002147] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Dati
          </h1>
          <p className="text-[#44474e] text-sm">
            Inserisci i dati necessari per elaborare la tua richiesta.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} id="dati-form" className="space-y-8">
              {/* Service-specific fields for each cart item */}
              {items.map(item => {
                sectionNum++;
                const sectionContent = isVisura(item.service.slug) ? (
                  <VisuraFields
                    item={item}
                    data={item.formData}
                    onChange={(name, value) => handleItemFieldChange(item.id, item.formData, name, value)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.service.fields.map(field => (
                      <div key={field.name} className="space-y-1.5">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#516169]">
                          {field.label} {field.required && '*'}
                        </label>
                        {field.type === 'select' ? (
                          <div className="relative">
                            <select className="w-full bg-white border border-slate-200 px-3 py-2 text-sm appearance-none" value={item.formData[field.name] || ''} onChange={(e) => handleItemFieldChange(item.id, item.formData, field.name, e.target.value)} required={field.required}>
                              <option value="">Seleziona...</option>
                              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-2 pointer-events-none text-slate-400 text-base">expand_more</span>
                          </div>
                        ) : (
                          <input type={field.type} className="w-full bg-white border border-slate-200 px-3 py-2 text-sm" placeholder={field.placeholder} value={item.formData[field.name] || ''} onChange={(e) => handleItemFieldChange(item.id, item.formData, field.name, e.target.value)} required={field.required} />
                        )}
                      </div>
                    ))}
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

              {/* Dati per la fatturazione */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">{items.length + 1}</span>
                  Dati per la fatturazione
                </h2>

                {/* Account Type Selector */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-3">Tipo di intestatario</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'privato', label: 'Privato', icon: 'person' },
                      { value: 'impresa', label: 'Impresa', icon: 'business' },
                      { value: 'professionista', label: 'Professionista', icon: 'work' },
                    ] as const).map(opt => (
                      <button key={opt.value} type="button" onClick={() => { setAccountType(opt.value); setCfManuallyEdited(false); }}
                        className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 border rounded-lg transition-all text-xs font-bold ${
                          accountType === opt.value ? 'border-[#002147] bg-[#002147] text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}>
                        <span className="material-symbols-outlined text-base">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Privato ── */}
                {accountType === 'privato' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Nome *</label>
                      <input type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full" placeholder="Mario" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Cognome *</label>
                      <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} className="w-full" placeholder="Rossi" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Indirizzo *</label>
                      <AddressAutocomplete
                        value={formData.indirizzo}
                        onChange={(val) => setFormData(prev => ({ ...prev, indirizzo: val }))}
                        onSelect={(s) => {
                          setFormData(prev => ({
                            ...prev,
                            indirizzo: s.address,
                            citta: s.city,
                            cap: s.postcode,
                            provincia: s.region || prev.provincia,
                          }));
                        }}
                        placeholder="Inizia a digitare l'indirizzo..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Comune *</label>
                      <input type="text" name="citta" value={formData.citta} onChange={handleChange} className="w-full" placeholder="Roma" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">CAP *</label>
                      <input type="text" name="cap" value={formData.cap} onChange={handleChange} className="w-full" placeholder="00100" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Provincia *</label>
                      <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} className="w-full" placeholder="RM" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Codice Fiscale *</label>
                      <input type="text" name="codiceFiscale" value={formData.codiceFiscale} onChange={handleChange} className="w-full" placeholder="RSSMRA85L01H501Z" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        Email *
                        <span className="font-normal normal-case tracking-normal text-[#74777f] ml-2">Riceverai qui la ricevuta e i documenti</span>
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" placeholder="mario.rossi@email.it" required />
                    </div>
                    {!showAltEmail ? (
                      <div className="md:col-span-2">
                        <button type="button" onClick={() => setShowAltEmail(true)} className="text-[#4463ee] text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                          <span className="material-symbols-outlined text-sm">add</span>
                          Invia i documenti a un&apos;altra email
                        </button>
                      </div>
                    ) : (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                          Email per i documenti
                          <button type="button" onClick={() => { setShowAltEmail(false); setFormData(prev => ({ ...prev, emailDocumenti: '' })); }} className="font-normal normal-case tracking-normal text-[#ba1a1a] ml-2 hover:underline">rimuovi</button>
                        </label>
                        <input type="email" name="emailDocumenti" value={formData.emailDocumenti} onChange={handleChange} className="w-full" placeholder="altra.email@esempio.it" />
                      </div>
                    )}
                  </div>
                )}

                {/* ── Impresa / Professionista ── */}
                {accountType !== 'privato' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        {accountType === 'impresa' ? 'Denominazione / Ragione Sociale *' : 'Denominazione Studio *'}
                      </label>
                      <input type="text" name="ragioneSociale" value={formData.ragioneSociale} onChange={handleChange} className="w-full" placeholder={accountType === 'impresa' ? 'Rossi S.r.l.' : 'Studio Rossi'} required />
                    </div>

                    {/* Sede legale */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Indirizzo sede legale *</label>
                      <AddressAutocomplete
                        value={formData.sedeLegaleIndirizzo}
                        onChange={(val) => setFormData(prev => ({ ...prev, sedeLegaleIndirizzo: val }))}
                        onSelect={(s) => {
                          setFormData(prev => ({
                            ...prev,
                            sedeLegaleIndirizzo: s.address,
                            sedeLegaleComune: s.city,
                            sedeLegaleCap: s.postcode,
                            sedeLegaleProvincia: s.region || prev.sedeLegaleProvincia,
                          }));
                        }}
                        placeholder="Inizia a digitare l'indirizzo..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Comune *</label>
                      <input type="text" name="sedeLegaleComune" value={formData.sedeLegaleComune} onChange={handleChange} className="w-full" placeholder="Roma" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">CAP *</label>
                      <input type="text" name="sedeLegaleCap" value={formData.sedeLegaleCap} onChange={handleChange} className="w-full" placeholder="00100" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Provincia *</label>
                      <input type="text" name="sedeLegaleProvincia" value={formData.sedeLegaleProvincia} onChange={handleChange} className="w-full" placeholder="RM" required />
                    </div>

                    {/* P.IVA e CF */}
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#516169]">Partita IVA *</label>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#516169]">Codice Fiscale *</label>
                          <button
                            type="button"
                            onClick={() => {
                              if (!cfManuallyEdited) {
                                setCfManuallyEdited(true);
                                setFormData(prev => ({ ...prev, codiceFiscale: '' }));
                              } else {
                                setCfManuallyEdited(false);
                                setFormData(prev => ({ ...prev, codiceFiscale: prev.partitaIva }));
                              }
                            }}
                            className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                              !cfManuallyEdited
                                ? 'border-[#28a428]/30 bg-[#28a428]/8 text-[#28a428]'
                                : 'border-orange-200 bg-orange-50 text-orange-600'
                            }`}
                          >
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                              {!cfManuallyEdited ? 'link' : 'link_off'}
                            </span>
                            {!cfManuallyEdited ? 'Uguale' : 'Diverso'}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="partitaIva" value={formData.partitaIva} onChange={handleChange} className="w-full" placeholder="12345678901" required />
                        <input
                          type="text"
                          name="codiceFiscale"
                          value={formData.codiceFiscale}
                          onChange={handleChange}
                          className="w-full"
                          placeholder={!cfManuallyEdited ? 'Autocompilato' : '12345678901'}
                          required
                          readOnly={!cfManuallyEdited}
                        />
                      </div>
                    </div>

                    {/* SDI o PEC */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Codice Destinatario (SDI)</label>
                      <input type="text" name="codiceDestinatario" value={formData.codiceDestinatario} onChange={handleChange} className="w-full" placeholder="0000000" maxLength={7} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">oppure PEC</label>
                      <input type="email" name="pec" value={formData.pec} onChange={handleChange} className="w-full" placeholder="azienda@pec.it" />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        Email *
                        <span className="font-normal normal-case tracking-normal text-[#74777f] ml-2">Riceverai qui la ricevuta e i documenti</span>
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" placeholder="info@azienda.it" required />
                    </div>
                    {!showAltEmail ? (
                      <div className="md:col-span-2">
                        <button type="button" onClick={() => setShowAltEmail(true)} className="text-[#4463ee] text-xs font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                          <span className="material-symbols-outlined text-sm">add</span>
                          Invia i documenti a un&apos;altra email
                        </button>
                      </div>
                    ) : (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                          Email per i documenti
                          <button type="button" onClick={() => { setShowAltEmail(false); setFormData(prev => ({ ...prev, emailDocumenti: '' })); }} className="font-normal normal-case tracking-normal text-[#ba1a1a] ml-2 hover:underline">rimuovi</button>
                        </label>
                        <input type="email" name="emailDocumenti" value={formData.emailDocumenti} onChange={handleChange} className="w-full" placeholder="altra.email@esempio.it" />
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Delegate Section */}
              {needsDelegate && (
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-amber-200/50 shadow-sm">
                  <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">{items.length + 2}</span>
                    Delega Proprietario
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-amber-900">
                      <strong>Attenzione:</strong> Per richiedere planimetrie e altri documenti riservati e necessaria una delega firmata dal proprietario dell&apos;immobile.
                    </p>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-[#4463ee] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-5xl text-slate-300 mb-3">upload_file</span>
                    <p className="text-sm font-medium text-[#002147]">Carica il documento di delega</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (max 10MB)</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                  </div>
                </section>
              )}
            </form>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button type="button" onClick={() => router.back()} className="bg-white border border-slate-200 text-[#002147] font-medium py-3 px-5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-sm">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Indietro
              </button>
              <button type="submit" form="dati-form" className="flex-1 bg-[#4463ee] text-white font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm">
                <span>Continua</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
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
              <div className="mt-5 pt-4 border-t border-slate-100">
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
