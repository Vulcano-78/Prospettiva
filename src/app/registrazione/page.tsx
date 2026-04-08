'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type AccountType = 'professionista' | 'privato';

export default function RegistrationPage() {
  const [accountType, setAccountType] = useState<AccountType>('professionista');
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Professional fields
    ragioneSociale: '',
    partitaIva: '',
    ruolo: 'Agente Immobiliare',
    codiceSdi: '',
    sito: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('Devi accettare i Termini e Condizioni.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Le password non coincidono.');
      return;
    }
    alert('Registrazione simulata (demo). Nessun dato inviato.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <Header />

      <main className="flex-grow py-12 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-[#002147] tracking-tight mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Crea il tuo account
            </h1>
            <p className="text-[#44474e]">
              Inizia oggi a utilizzare gli strumenti di Prospettiva.io per il mercato immobiliare.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Type Selection */}
            <section>
              <h2 className="text-xs font-bold text-[#002147] uppercase tracking-widest mb-4 text-center">
                Seleziona il tipo di account
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAccountType('professionista')}
                  className={`relative flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all ${
                    accountType === 'professionista'
                      ? 'border-[#002147] bg-[#002147]/5 ring-4 ring-[#002147]/10'
                      : 'border-slate-200 hover:border-[#002147]/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    accountType === 'professionista' ? 'bg-[#002147] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
                  </div>
                  <span className="font-bold text-[#002147]">Professionista / Azienda</span>
                  <span className="text-[10px] text-[#44474e] mt-1">Agenti, architetti e consulenti</span>
                  {accountType === 'professionista' && (
                    <div className="absolute top-3 right-3">
                      <span className="material-symbols-outlined text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('privato')}
                  className={`relative flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all ${
                    accountType === 'privato'
                      ? 'border-[#002147] bg-[#002147]/5 ring-4 ring-[#002147]/10'
                      : 'border-slate-200 hover:border-[#002147]/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                    accountType === 'privato' ? 'bg-[#002147] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                  </div>
                  <span className="font-bold text-[#002147]">Privato</span>
                  <span className="text-[10px] text-[#44474e] mt-1">Per chi cerca o vende casa</span>
                  {accountType === 'privato' && (
                    <div className="absolute top-3 right-3">
                      <span className="material-symbols-outlined text-[#002147]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                </button>
              </div>
            </section>

            {/* Personal Data */}
            <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#002147] text-white text-xs font-bold flex items-center justify-center">1</div>
                <h3 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati Personali</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Nome</label>
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Giuseppe" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Cognome</label>
                  <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Verdi" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">
                  Email {accountType === 'professionista' ? 'Professionale' : ''}
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="giuseppe.verdi@email.it" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Conferma Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                </div>
              </div>
            </section>

            {/* Professional Data */}
            {accountType === 'professionista' && (
              <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full bg-[#002147] text-white text-xs font-bold flex items-center justify-center">2</div>
                  <h3 className="text-lg font-bold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati Professionali</h3>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Ragione Sociale</label>
                  <input type="text" name="ragioneSociale" value={formData.ragioneSociale} onChange={handleChange} placeholder="Studio Immobiliare Verdi S.r.l." />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Partita IVA</label>
                    <input type="text" name="partitaIva" value={formData.partitaIva} onChange={handleChange} placeholder="11 cifre" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Ruolo</label>
                    <div className="relative">
                      <select name="ruolo" value={formData.ruolo} onChange={handleChange} className="appearance-none">
                        <option>Agente Immobiliare</option>
                        <option>Architetto / Ingegnere</option>
                        <option>Consulente Finanziario</option>
                        <option>Sviluppatore Immobiliare</option>
                        <option>Altro</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-3 pointer-events-none text-slate-400">expand_more</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Codice SDI / PEC (Opzionale)</label>
                  <input type="text" name="codiceSdi" value={formData.codiceSdi} onChange={handleChange} placeholder="Codice SDI o indirizzo PEC" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#516169] uppercase tracking-widest mb-2">Sito Web (Opzionale)</label>
                  <input type="url" name="sito" value={formData.sito} onChange={handleChange} placeholder="https://www.studioverdi.it" />
                </div>
              </section>
            )}

            {/* Terms */}
            <section className="bg-slate-50 rounded-xl p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]"
                  required
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
                className="w-full bg-[#4463ee] text-white font-extrabold py-4 rounded-xl hover:brightness-110 transition-all shadow-lg"
              >
                Crea il mio account
              </button>

              <p className="text-center text-[#44474e] text-xs mt-6">
                Hai gia un account?{' '}
                <Link href="/login" className="text-[#002147] font-bold hover:underline">
                  Accedi qui
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
