'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import ProgressBar from '@/components/ProgressBar';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/services';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { createClient } from '@/lib/supabase/client';

type AccountType = 'privato' | 'impresa' | 'professionista';

export default function CheckoutDataPage() {
  const router = useRouter();
  const { items, getSubtotal, getIVA, getTotal } = useCart();

  const [accountType, setAccountType] = useState<AccountType>('privato');
  const [richiedifattura, setRichiedifattura] = useState(false);
  const [cfManuallyEdited, setCfManuallyEdited] = useState(false);
  const [emailDocumentiManuallyEdited, setEmailDocumentiManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    emailDocumenti: '',
    emailDocumentiAlt: '',
    codiceFiscale: '',
    indirizzo: '',
    citta: '',
    cap: '',
    provincia: '',
    ragioneSociale: '',
    partitaIva: '',
    pec: '',
    codiceDestinatario: '',
    sedeLegaleIndirizzo: '',
    sedeLegaleCap: '',
    sedeLegaleComune: '',
    sedeLegaleProvincia: '',
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const meta = user.user_metadata ?? {};
      const email = user.email ?? '';
      const accountT: AccountType =
        meta.account_type === 'professionista' ? 'professionista' : 'privato';
      setAccountType(accountT);
      setFormData(prev => ({
        ...prev,
        nome: meta.nome ?? prev.nome,
        cognome: meta.cognome ?? prev.cognome,
        email,
        emailDocumenti: email,
        ragioneSociale: meta.ragione_sociale ?? prev.ragioneSociale,
        partitaIva: meta.partita_iva ?? prev.partitaIva,
        codiceFiscale: meta.partita_iva ?? prev.codiceFiscale,
        codiceDestinatario: meta.codice_sdi ?? prev.codiceDestinatario,
        // Indirizzo per privato
        indirizzo: meta.indirizzo ?? prev.indirizzo,
        citta: meta.citta ?? prev.citta,
        cap: meta.cap ?? prev.cap,
        provincia: meta.provincia ?? prev.provincia,
        // Sede legale per professionista/impresa
        sedeLegaleIndirizzo: meta.indirizzo ?? prev.sedeLegaleIndirizzo,
        sedeLegaleComune: meta.citta ?? prev.sedeLegaleComune,
        sedeLegaleCap: meta.cap ?? prev.sedeLegaleCap,
        sedeLegaleProvincia: meta.provincia ?? prev.sedeLegaleProvincia,
      }));
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'partitaIva' && !cfManuallyEdited) {
        next.codiceFiscale = value;
      }
      if (name === 'codiceFiscale') {
        setCfManuallyEdited(true);
      }
      if (name === 'email' && !emailDocumentiManuallyEdited) {
        next.emailDocumenti = value;
      }
      if (name === 'emailDocumenti') {
        setEmailDocumentiManuallyEdited(true);
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveSdi = accountType === 'privato'
      ? '0000000'
      : (formData.codiceDestinatario || (!formData.pec ? '0000000' : ''));
    try {
      localStorage.setItem('checkoutEmail', formData.email);
      localStorage.setItem('checkoutSdi', effectiveSdi);
      if (formData.emailDocumenti) {
        localStorage.setItem('checkoutEmailDocumenti', formData.emailDocumenti);
      }
      if (formData.emailDocumentiAlt) {
        localStorage.setItem('checkoutEmailDocumentiAlt', formData.emailDocumentiAlt);
      }
    } catch {}
    router.push('/checkout/pagamento');
  };

  if (items.length === 0) {
    router.push('/carrello');
    return null;
  }

  const needsDelegate = items.some(item => item.service.requiresDelegate);

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
            Inserisci i dati di fatturazione e per la consegna dei documenti.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} id="dati-form" className="space-y-8">

              {/* Dati per la fatturazione */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">1</span>
                  {accountType === 'privato' ? 'Dati per il pagamento' : 'Dati per la fatturazione'}
                </h2>

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
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" placeholder="mario.rossi@email.it" required />
                    </div>

                    {/* Campi facoltativi — obbligatori solo se richiedi fattura */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        Indirizzo{richiedifattura ? ' *' : ''}
                      </label>
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
                        required={richiedifattura}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        Comune{richiedifattura ? ' *' : ''}
                      </label>
                      <input type="text" name="citta" value={formData.citta} onChange={handleChange} className="w-full" placeholder="Roma" required={richiedifattura} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        CAP{richiedifattura ? ' *' : ''}
                      </label>
                      <input type="text" name="cap" value={formData.cap} onChange={handleChange} className="w-full" placeholder="00100" required={richiedifattura} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        Provincia{richiedifattura ? ' *' : ''}
                      </label>
                      <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} className="w-full" placeholder="RM" required={richiedifattura} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">
                        Codice Fiscale{richiedifattura ? ' *' : ''}
                      </label>
                      <input type="text" name="codiceFiscale" value={formData.codiceFiscale} onChange={handleChange} className="w-full" placeholder="RSSMRA85L01H501Z" required={richiedifattura} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">PEC</label>
                      <input type="email" name="pec" value={formData.pec} onChange={handleChange} className="w-full" placeholder="mario@pec.it" />
                    </div>

                    {/* Toggle richiedi fattura */}
                    <div className="md:col-span-2 pt-2 border-t border-slate-100">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="text-sm font-semibold text-[#002147]">Richiedi fattura</p>
                          <p className="text-xs text-slate-400">Inserisci indirizzo e codice fiscale per ricevere la fattura</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRichiedifattura(v => !v)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${richiedifattura ? 'bg-[#4463ee]' : 'bg-slate-200'}`}
                        >
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${richiedifattura ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </label>
                    </div>
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
                    <div className="md:col-span-2">
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
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Partita IVA *</label>
                      <input type="text" name="partitaIva" value={formData.partitaIva} onChange={handleChange} className="w-full" placeholder="12345678901" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Codice Fiscale *</label>
                      <input
                        type="text"
                        name="codiceFiscale"
                        value={formData.codiceFiscale}
                        onChange={handleChange}
                        onFocus={() => {
                          if (!cfManuallyEdited) {
                            setCfManuallyEdited(true);
                            setFormData(prev => ({ ...prev, codiceFiscale: '' }));
                          }
                        }}
                        className="w-full"
                        placeholder="12345678901"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Codice Destinatario (SDI)</label>
                      <input type="text" name="codiceDestinatario" value={formData.codiceDestinatario} onChange={handleChange} className="w-full" placeholder="0000000" maxLength={7} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">PEC</label>
                      <input type="email" name="pec" value={formData.pec} onChange={handleChange} className="w-full" placeholder="azienda@pec.it" />
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-[#c4c6cf]">Se non inserisci nulla, troverai la fattura nel tuo Cassetto Fiscale</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full" placeholder="info@azienda.it" required />
                    </div>
                  </div>
                )}
              </section>

              {/* Dati per l'invio della documentazione */}
              <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-sm">
                <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <span className="w-6 h-6 rounded-full bg-[#002147] text-white text-xs flex items-center justify-center">2</span>
                  Dati per l&apos;invio della documentazione
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Email *</label>
                    <input
                      type="email"
                      name="emailDocumenti"
                      value={formData.emailDocumenti}
                      onChange={handleChange}
                      onFocus={() => {
                        if (!emailDocumentiManuallyEdited) {
                          setEmailDocumentiManuallyEdited(true);
                          setFormData(prev => ({ ...prev, emailDocumenti: '' }));
                        }
                      }}
                      className="w-full"
                      placeholder="mario.rossi@email.it"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#516169] mb-2">Email aggiuntiva</label>
                    <input
                      type="email"
                      name="emailDocumentiAlt"
                      value={formData.emailDocumentiAlt}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="altra.email@esempio.it"
                    />
                  </div>
                </div>
              </section>

              {/* Delegate Section */}
              {needsDelegate && (
                <section className="bg-white rounded-2xl p-6 md:p-8 border border-amber-200/50 shadow-sm">
                  <h2 className="text-lg font-bold text-[#002147] mb-6 flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center">3</span>
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
              <button type="button" onClick={() => router.push('/carrello')} className="bg-white border border-slate-200 text-[#002147] font-medium py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-sm">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Torna al carrello
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
