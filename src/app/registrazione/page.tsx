'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AddressAutocomplete from '@/components/AddressAutocomplete';

type AccountType = 'professionista' | 'privato' | 'impresa';

export default function RegistrationPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>('professionista');
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    confirmPassword: '',
    ragioneSociale: '',
    partitaIva: '',
    codiceFiscale: '',
    ruolo: '',
    codiceSdi: '',
    pec: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
  });
  // Per impresa: traccia se l'utente ha toccato il CF manualmente.
  // Finché è false, il CF mostra il valore della P.IVA (mirror automatico).
  const [cfManuallyEdited, setCfManuallyEdited] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // CF per impresa: si autocompila con la P.IVA finché non viene toccato.
  const cfDisplayValue =
    accountType === 'impresa' && !cfManuallyEdited
      ? formData.partitaIva
      : formData.codiceFiscale;

  const handleCfFocus = () => {
    if (accountType === 'impresa' && !cfManuallyEdited) {
      // Primo click sul CF auto-fillato: lo svuota per permettere edit manuale.
      setCfManuallyEdited(true);
      setFormData(prev => ({ ...prev, codiceFiscale: '' }));
    }
  };

  const handleCfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCfManuallyEdited(true);
    setFormData(prev => ({ ...prev, codiceFiscale: e.target.value }));
  };

  const handleAccountTypeChange = (next: AccountType) => {
    setAccountType(next);
    // Reset stato CF quando si cambia tipo account.
    setCfManuallyEdited(false);
    setFormData(prev => ({ ...prev, codiceFiscale: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!acceptTerms) {
      setError('Devi accettare i Termini e Condizioni.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          nome: formData.nome,
          cognome: formData.cognome,
          account_type: accountType,
          ragione_sociale: formData.ragioneSociale,
          partita_iva: formData.partitaIva,
          codice_fiscale:
            accountType === 'impresa' && !cfManuallyEdited
              ? formData.partitaIva
              : formData.codiceFiscale,
          ruolo: formData.ruolo,
          codice_sdi: formData.codiceSdi,
          pec: formData.pec,
          marketing: acceptMarketing,
          indirizzo: formData.indirizzo,
          citta: formData.citta,
          cap: formData.cap,
          provincia: formData.provincia,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        setError('Questa email è già registrata. Prova ad accedere.');
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
    if (signInError) {
      setError('Account creato. Controlla la tua email per confermare, poi accedi.');
      setLoading(false);
      return;
    }

    if (localStorage.getItem('pendingOrderAfterAuth')) {
      const orders = JSON.parse(localStorage.getItem('pendingOrder') || '[]');
      const orderEmail = localStorage.getItem('checkoutEmail') || '';
      const emailDocumenti = localStorage.getItem('checkoutEmailDocumenti') || '';
      localStorage.removeItem('pendingOrderAfterAuth');
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('checkoutEmail');
      localStorage.removeItem('checkoutEmailDocumenti');
      await fetch('/api/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders, email: orderEmail, emailDocumenti }),
      });
    }

    router.push('/');
    router.refresh();
  };

  const accountTypes = [
    { value: 'professionista' as const, label: 'Professionista', icon: 'corporate_fare' },
    { value: 'impresa' as const, label: 'Impresa', icon: 'business' },
    { value: 'privato' as const, label: 'Privato', icon: 'home' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-grow pt-[120px] pb-16 px-6">
        <div className="max-w-xl mx-auto">

          <div className="text-center mb-8">
            <div className="text-[0.625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-3">
              Registrazione
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-bold text-[#002147] mb-3">
              Crea il tuo account.
            </h1>
            <p className="text-on-surface-variant text-sm">
              Inizia oggi a utilizzare gli strumenti di Prospettiva.io.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3" style={{ borderRadius: '5px' }}>
                {error}
              </div>
            )}

            {/* Account Type */}
            <section>
              <h2 className="text-xs font-bold text-[#002147] uppercase tracking-widest mb-4 text-center">
                Seleziona il tipo di account
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {accountTypes.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAccountTypeChange(opt.value)}
                    style={{ borderRadius: '5px' }}
                    className={`relative flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-2.5 p-3 border transition-all min-w-0 cursor-pointer ${
                      accountType === opt.value ? 'border-[#002147] bg-[#002147]/5' : 'border-slate-200 hover:border-[#002147]/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      accountType === opt.value ? 'bg-[#002147] text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{opt.icon}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#002147] text-center sm:text-left leading-tight">{opt.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Dati Personali */}
            <section className="bg-white border border-slate-300/80 p-6 space-y-5" style={{ borderRadius: '5px' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#002147] text-white text-xs font-bold flex items-center justify-center">1</div>
                <h3 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'var(--font-headline)' }}>Dati Personali</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Nome</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Giuseppe" required />
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Cognome</label>
                  <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Verdi" required />
                </div>
              </div>
              <div>
                <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="giuseppe.verdi@email.it" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Conferma Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                </div>
              </div>
            </section>

            {/* Dati Professionali */}
            {accountType === 'professionista' && (
              <section className="bg-white border border-slate-300/80 p-6 space-y-5" style={{ borderRadius: '5px' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#002147] text-white text-xs font-bold flex items-center justify-center">2</div>
                  <h3 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'var(--font-headline)' }}>Dati Professionali</h3>
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Ragione Sociale *</label>
                  <input type="text" name="ragioneSociale" value={formData.ragioneSociale} onChange={handleChange} placeholder="Studio Immobiliare Verdi S.r.l." required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Partita IVA *</label>
                    <input type="text" name="partitaIva" value={formData.partitaIva} onChange={handleChange} placeholder="11 cifre" required />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Codice Fiscale *</label>
                    <input
                      type="text"
                      name="codiceFiscale"
                      value={formData.codiceFiscale}
                      onChange={handleChange}
                      placeholder="RSSMRA85L01H501Z"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Ruolo</label>
                    <div className="relative">
                      <select name="ruolo" value={formData.ruolo} onChange={handleChange} className="appearance-none">
                        <option value="">Seleziona ruolo</option>
                        <option>Agente Immobiliare</option>
                        <option>Mediatore Immobiliare</option>
                        <option>Sviluppatore Immobiliare</option>
                        <option>Costruttore / Developer</option>
                        <option>Architetto / Ingegnere</option>
                        <option>Geometra</option>
                        <option>Notaio</option>
                        <option>Avvocato Immobiliarista</option>
                        <option>Consulente Finanziario / Mutui</option>
                        <option>Investitore Immobiliare</option>
                        <option>Property Manager</option>
                        <option>Amministratore di Condominio</option>
                        <option>Perito / Valutatore Immobiliare</option>
                        <option>Altro</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Codice SDI</label>
                    <input type="text" name="codiceSdi" value={formData.codiceSdi} onChange={handleChange} placeholder="0000000" maxLength={7} />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">PEC</label>
                  <input type="email" name="pec" value={formData.pec} onChange={handleChange} placeholder="studio@pec.it" />
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Indirizzo *</label>
                  <AddressAutocomplete
                    value={formData.indirizzo}
                    onChange={(val) => setFormData(prev => ({ ...prev, indirizzo: val }))}
                    onSelect={(s) => setFormData(prev => ({
                      ...prev,
                      indirizzo: s.address,
                      citta: s.city,
                      cap: s.postcode,
                      provincia: s.region || prev.provincia,
                    }))}
                    placeholder="Inizia a digitare l'indirizzo..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Comune *</label>
                    <input type="text" name="citta" value={formData.citta} onChange={handleChange} placeholder="Roma" required />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">CAP *</label>
                    <input type="text" name="cap" value={formData.cap} onChange={handleChange} placeholder="00100" required />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Provincia *</label>
                    <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} placeholder="RM" required />
                  </div>
                </div>
              </section>
            )}

            {/* Dati Aziendali (Impresa) */}
            {accountType === 'impresa' && (
              <section className="bg-white border border-slate-300/80 p-6 space-y-5" style={{ borderRadius: '5px' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#002147] text-white text-xs font-bold flex items-center justify-center">2</div>
                  <h3 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'var(--font-headline)' }}>Dati Aziendali</h3>
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Denominazione / Ragione Sociale *</label>
                  <input type="text" name="ragioneSociale" value={formData.ragioneSociale} onChange={handleChange} placeholder="Rossi S.r.l." required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Partita IVA *</label>
                    <input type="text" name="partitaIva" value={formData.partitaIva} onChange={handleChange} placeholder="11 cifre" required />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Codice Fiscale *</label>
                    <input
                      type="text"
                      name="codiceFiscale"
                      value={cfDisplayValue}
                      onFocus={handleCfFocus}
                      onChange={handleCfChange}
                      placeholder="Uguale alla P.IVA, clicca per modificare"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Codice SDI</label>
                    <input type="text" name="codiceSdi" value={formData.codiceSdi} onChange={handleChange} placeholder="0000000" maxLength={7} />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">PEC</label>
                    <input type="email" name="pec" value={formData.pec} onChange={handleChange} placeholder="azienda@pec.it" />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Indirizzo Sede Legale *</label>
                  <AddressAutocomplete
                    value={formData.indirizzo}
                    onChange={(val) => setFormData(prev => ({ ...prev, indirizzo: val }))}
                    onSelect={(s) => setFormData(prev => ({
                      ...prev,
                      indirizzo: s.address,
                      citta: s.city,
                      cap: s.postcode,
                      provincia: s.region || prev.provincia,
                    }))}
                    placeholder="Inizia a digitare l'indirizzo..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Comune *</label>
                    <input type="text" name="citta" value={formData.citta} onChange={handleChange} placeholder="Roma" required />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">CAP *</label>
                    <input type="text" name="cap" value={formData.cap} onChange={handleChange} placeholder="00100" required />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-[#516169] uppercase tracking-widest mb-2">Provincia *</label>
                    <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} placeholder="RM" required />
                  </div>
                </div>
              </section>
            )}

            {/* Termini */}
            <section className="bg-slate-100 border border-slate-200 p-6 space-y-4" style={{ borderRadius: '5px' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]"
                />
                <span className="text-xs text-[#44474e]">
                  Accetto i <a href="#" className="text-[#002147] font-bold hover:underline">Termini e Condizioni</a> e la <a href="#" className="text-[#002147] font-bold hover:underline">Privacy Policy</a>.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]"
                />
                <span className="text-xs text-[#44474e]">
                  Desidero ricevere analisi di mercato esclusive e aggiornamenti via email. (Opzionale)
                </span>
              </label>
            </section>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                style={{ borderRadius: '5px' }}
                className="w-full bg-[#002147] text-white font-bold py-3.5 cursor-pointer hover:bg-[#4463EE] hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-[0.18em]"
              >
                {loading ? 'Creazione account…' : 'Crea il mio account'}
              </button>
              <p className="text-center text-[#44474e] text-xs mt-6">
                Hai già un account?{' '}
                <Link href="/login" className="text-[#002147] font-bold hover:underline">Accedi qui</Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
