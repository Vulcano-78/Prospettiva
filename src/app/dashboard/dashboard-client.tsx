'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import type { User } from '@supabase/supabase-js';

export type Order = {
  id: string;
  order_ref: string;
  email: string;
  items: { slug: string; formData: Record<string, string> }[];
  file_url: string | null;
  created_at: string;
};

export type ContoEconomico = {
  id: string;
  titolo: string;
  regime: 'persona_fisica' | 'societa';
  data: {
    descrizione?: string;
    mq?: string;
    unita?: string;
    voci?: Record<string, string>;
    rivendita1?: string;
    rivendita2?: string;
    esposizione?: string;
  };
  created_at: string;
};

function ceNum(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(v.replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

function ceTotali(c: ContoEconomico) {
  const voci = c.data.voci ?? {};
  const totaleCosti = Object.values(voci).reduce((s, v) => s + ceNum(v), 0);
  const totaleRivendita = ceNum(c.data.rivendita1) + ceNum(c.data.rivendita2);
  const utile = totaleRivendita - totaleCosti;
  const expo = ceNum(c.data.esposizione);
  const roi = totaleCosti > 0 ? (utile / totaleCosti) * 100 : NaN;
  const roe = expo > 0 ? (utile / expo) * 100 : NaN;
  return { totaleCosti, totaleRivendita, utile, roi, roe };
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(1).replace('.', ',')}%`;
}

const slugToName: Record<string, string> = {
  'visura-catastale': 'Visura Catastale Ordinaria',
  'visura-catastale-storica': 'Visura Catastale Storica',
  'visura-per-soggetto': 'Visura per Soggetto',
  'estratto-mappa': 'Estratto Mappa Catastale',
  'ricerca-nazionale': 'Ricerca Nazionale',
  'ricerca-persona': 'Ricerca Persona',
  'ricerca-indirizzo': 'Ricerca per Indirizzo',
  'prospetto-catastale': 'Prospetto Catastale',
  'elenco-immobili': 'Elenco degli Immobili',
  'planimetria': 'Planimetria Catastale',
  'elaborato-planimetrico': 'Elaborato Planimetrico',
  'ispezione-ipotecaria-nazionale': 'Ispezione Ipotecaria Nazionale',
  'ispezione-ipotecaria': 'Ispezione Ipotecaria',
  'elenco-note-ipotecarie': 'Singola Nota Ipotecaria',
  'certificato-urbanistico': 'Certificato Urbanistico',
  'attestato-ape': 'Attestato APE',
  'virtual-staging': 'Virtual Staging AI',
};

const searchTypeLabel: Record<string, string> = {
  'immobile': 'per Immobile',
  'soggetto': 'per Soggetto',
  'soggetto-giuridico': 'per Soggetto Giuridico',
};

const modeLabel: Record<string, string> = {
  'immobile': 'per Immobile',
  'soggetto': 'per Soggetto',
};

function itemLabel(item: { slug: string; formData: Record<string, string> }): string {
  const base = slugToName[item.slug] ?? item.slug;
  const fd = item.formData ?? {};

  if (item.slug === 'visura-catastale' || item.slug === 'visura-catastale-storica') {
    const suffix = searchTypeLabel[fd._searchType] ?? '';
    return suffix ? `${base} ${suffix}` : base;
  }

  if (item.slug === 'ispezione-ipotecaria' || item.slug === 'elenco-note-ipotecarie') {
    const suffix = modeLabel[fd._mode] ?? '';
    return suffix ? `${base} ${suffix}` : base;
  }

  return base;
}

function orderLabel(order: Order): string {
  const items = order.items ?? [];
  if (items.length === 0) return 'Documento';
  const first = itemLabel(items[0]);
  return items.length > 1 ? `${first} + altri ${items.length - 1}` : first;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

const supabase = createClient();

type Props = {
  initialUser: User;
  initialOrders: Order[];
  initialConti: ContoEconomico[];
};

export default function DashboardClient({ initialUser, initialOrders, initialConti }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User>(initialUser);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [conti, setConti] = useState<ContoEconomico[]>(initialConti);
  const [activeSection, setActiveSection] = useState<'documenti' | 'conti' | 'profilo'>('documenti');
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing'>('all');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const meta0 = initialUser.user_metadata ?? {};
  const [editData, setEditData] = useState<Record<string, string>>({
    nome: meta0.nome ?? '',
    cognome: meta0.cognome ?? '',
    indirizzo: meta0.indirizzo ?? '',
    citta: meta0.citta ?? '',
    cap: meta0.cap ?? '',
    provincia: meta0.provincia ?? '',
    ragione_sociale: meta0.ragione_sociale ?? '',
    partita_iva: meta0.partita_iva ?? '',
    codice_sdi: meta0.codice_sdi ?? '',
    ruolo: meta0.ruolo ?? '',
    sito: meta0.sito ?? '',
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    const { data, error } = await supabase.auth.updateUser({ data: editData });
    if (error) {
      setSaveError('Errore nel salvataggio. Riprova.');
    } else {
      setUser(data.user);
      setEditing(false);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'ready') return !!o.file_url;
    if (filter === 'processing') return !o.file_url;
    return true;
  });

  const meta = user.user_metadata ?? {};
  const nome = meta.nome ?? '';
  const cognome = meta.cognome ?? '';
  const nomeCompleto = [nome, cognome].filter(Boolean).join(' ') || '—';

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="flex flex-1 pt-14">

        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col py-8 px-6 bg-gradient-to-b from-white to-slate-50 border-r border-slate-100">
          <div className="mb-10">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area Personale</span>
            {nomeCompleto !== '—' && (
              <p className="mt-2 text-sm font-bold text-[#002147] truncate">{nomeCompleto}</p>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            <button
              onClick={() => setActiveSection('documenti')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors ${activeSection === 'documenti' ? 'text-[#002147] font-semibold bg-white shadow-sm' : 'text-slate-500 font-medium hover:text-[#002147] hover:bg-white/60'}`}
            >
              <span className="material-symbols-outlined">description</span>
              <span className="text-sm font-semibold">Documenti</span>
            </button>
            <button
              onClick={() => setActiveSection('conti')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors ${activeSection === 'conti' ? 'text-[#002147] font-semibold bg-white shadow-sm' : 'text-slate-500 font-medium hover:text-[#002147] hover:bg-white/60'}`}
            >
              <span className="material-symbols-outlined">calculate</span>
              <span className="text-sm font-semibold">Conti Economici</span>
            </button>
            <button
              onClick={() => setActiveSection('profilo')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-colors ${activeSection === 'profilo' ? 'text-[#002147] font-semibold bg-white shadow-sm' : 'text-slate-500 font-medium hover:text-[#002147] hover:bg-white/60'}`}
            >
              <span className="material-symbols-outlined">person</span>
              <span className="text-sm font-semibold">Dati Personali</span>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 text-slate-500 font-medium hover:text-red-600 transition-colors w-full"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-sm">Esci</span>
            </button>
            <Link href="/" className="mt-4 block w-full bg-[#4463ee] text-white font-bold py-3 rounded-xl text-center text-sm hover:brightness-110 transition-all">
              Nuovo Ordine
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10 max-w-5xl">

          {/* Documenti */}
          {activeSection === 'documenti' && <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#002147] tracking-tight mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  I miei documenti
                </h2>
                <p className="text-slate-500 text-sm">Storico degli ordini e download dei documenti.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(['all', 'ready', 'processing'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                      filter === f ? 'bg-white shadow-sm text-[#002147]' : 'text-slate-500 hover:text-[#002147]'
                    }`}
                  >
                    {{ all: 'Tutti', ready: 'Pronti', processing: 'In elaborazione' }[f]}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">folder_open</span>
                <p className="font-bold text-[#002147] mb-1">Nessun documento</p>
                <p className="text-sm text-slate-500 mb-6">
                  {filter === 'all'
                    ? 'I tuoi prossimi acquisti appariranno qui.'
                    : 'Nessun documento in questo stato.'}
                </p>
                {filter === 'all' && (
                  <Link href="/" className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all text-sm">
                    Esplora i servizi
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map(order => {
                  const ready = !!order.file_url;
                  return (
                    <div key={order.id} className="bg-white p-5 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ready ? 'bg-blue-50 text-[#002147]' : 'bg-amber-50 text-amber-600'}`}>
                          <span className="material-symbols-outlined">{ready ? 'description' : 'pending_actions'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#002147]">{orderLabel(order)}</h3>
                          <p className="text-xs text-slate-500">#{order.order_ref} · {formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Stato</p>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${ready ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {ready ? 'Pronto' : 'In elaborazione'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ready ? (
                            <button
                              onClick={async () => {
                                const { data } = await supabase.storage
                                  .from('documenti')
                                  .createSignedUrl(order.file_url!, 3600)
                                if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                              }}
                              className="p-2 rounded-lg bg-slate-100 text-[#002147] hover:bg-[#002147] hover:text-white transition-colors"
                            >
                              <span className="material-symbols-outlined">download</span>
                            </button>
                          ) : (
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-300 cursor-not-allowed">
                              <span className="material-symbols-outlined">download</span>
                            </div>
                          )}
                          <button
                            onClick={async () => {
                              if (!confirm('Sei sicuro di voler eliminare questo ordine?')) return
                              if (order.file_url) {
                                await supabase.storage.from('documenti').remove([order.file_url])
                              }
                              await supabase.from('orders').delete().eq('id', order.id)
                              setOrders(prev => prev.filter(o => o.id !== order.id))
                            }}
                            className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>}

          {/* Conti Economici */}
          {activeSection === 'conti' && <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#002147] tracking-tight mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Conti Economici
                </h2>
                <p className="text-slate-500 text-sm">Calcoli salvati dall&apos;utility gratuita.</p>
              </div>
              <Link href="/utility/conto-economico" className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-5 py-3 rounded-xl hover:brightness-110 transition-all text-sm">
                <span className="material-symbols-outlined text-base">add</span>
                Nuovo CE
              </Link>
            </div>

            {conti.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">calculate</span>
                <p className="font-bold text-[#002147] mb-1">Nessun conto economico salvato</p>
                <p className="text-sm text-slate-500 mb-6">Calcola e salva la prima operazione.</p>
                <Link href="/utility/conto-economico" className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all text-sm">
                  Apri utility
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {conti.map(ce => {
                  const t = ceTotali(ce);
                  return (
                    <div key={ce.id} className="bg-white p-5 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-[#002147] shrink-0">
                          <span className="material-symbols-outlined">calculate</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#002147] truncate">{ce.titolo}</h3>
                          <p className="text-xs text-slate-500">
                            {ce.regime === 'societa' ? 'Società' : 'Persona Fisica'} · {formatDate(ce.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-5 text-right">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Utile</p>
                            <p className={`text-sm font-bold ${t.utile >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtEur(t.utile)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">ROI</p>
                            <p className="text-sm font-bold text-[#002147]">{fmtPct(t.roi)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">ROE</p>
                            <p className="text-sm font-bold text-[#002147]">{fmtPct(t.roe)}</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!confirm('Eliminare questo conto economico?')) return;
                            const res = await fetch(`/api/conti-economici?id=${ce.id}`, { method: 'DELETE' });
                            if (res.ok) setConti(prev => prev.filter(x => x.id !== ce.id));
                          }}
                          className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>}

          {/* Dati Personali */}
          {activeSection === 'profilo' && <section className="bg-white rounded-xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati Personali</h2>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#4463ee] border border-[#4463ee] rounded-lg hover:bg-[#4463ee] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Modifica
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#4463ee] text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-60"
                  >
                    {saving ? 'Salvataggio…' : 'Salva'}
                  </button>
                </div>
              )}
            </div>

            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{saveError}</div>
            )}

            {editing ? (
              <form ref={formRef} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nome</label>
                    <input
                      type="text"
                      value={editData.nome}
                      onChange={e => setEditData(p => ({ ...p, nome: e.target.value }))}
                      placeholder="Giuseppe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cognome</label>
                    <input
                      type="text"
                      value={editData.cognome}
                      onChange={e => setEditData(p => ({ ...p, cognome: e.target.value }))}
                      placeholder="Verdi"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Indirizzo</label>
                  <AddressAutocomplete
                    value={editData.indirizzo}
                    onChange={val => setEditData(p => ({ ...p, indirizzo: val }))}
                    onSelect={s => setEditData(p => ({
                      ...p,
                      indirizzo: s.address,
                      citta: s.city,
                      cap: s.postcode,
                      provincia: s.region || p.provincia,
                    }))}
                    placeholder="Inizia a digitare l'indirizzo…"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Comune</label>
                    <input
                      type="text"
                      value={editData.citta}
                      onChange={e => setEditData(p => ({ ...p, citta: e.target.value }))}
                      placeholder="Roma"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">CAP</label>
                    <input
                      type="text"
                      value={editData.cap}
                      onChange={e => setEditData(p => ({ ...p, cap: e.target.value }))}
                      placeholder="00100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Provincia</label>
                    <input
                      type="text"
                      value={editData.provincia}
                      onChange={e => setEditData(p => ({ ...p, provincia: e.target.value }))}
                      placeholder="RM"
                    />
                  </div>
                </div>
                {meta.account_type === 'professionista' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ragione Sociale</label>
                      <input
                        type="text"
                        value={editData.ragione_sociale}
                        onChange={e => setEditData(p => ({ ...p, ragione_sociale: e.target.value }))}
                        placeholder="Studio Verdi S.r.l."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Partita IVA</label>
                        <input
                          type="text"
                          value={editData.partita_iva}
                          onChange={e => setEditData(p => ({ ...p, partita_iva: e.target.value }))}
                          placeholder="11 cifre"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Codice SDI / PEC</label>
                        <input
                          type="text"
                          value={editData.codice_sdi}
                          onChange={e => setEditData(p => ({ ...p, codice_sdi: e.target.value }))}
                          placeholder="Codice SDI o PEC"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ruolo</label>
                        <div className="relative">
                          <select
                            value={editData.ruolo}
                            onChange={e => setEditData(p => ({ ...p, ruolo: e.target.value }))}
                            className="appearance-none"
                          >
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
                    </div>
                  </>
                )}
              </form>
            ) : (
              <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Nome e Cognome</p>
                  <p className="font-semibold text-[#002147]">{nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Email</p>
                  <p className="font-semibold text-[#002147]">{user.email ?? '—'}</p>
                </div>
                {(meta.indirizzo || meta.citta) && (
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Indirizzo</p>
                    <p className="font-semibold text-[#002147]">
                      {[meta.indirizzo, meta.citta, meta.cap, meta.provincia].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {meta.account_type && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Tipo Account</p>
                    <p className="font-semibold text-[#002147] capitalize">{meta.account_type}</p>
                  </div>
                )}
                {meta.ragione_sociale && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ragione Sociale</p>
                    <p className="font-semibold text-[#002147]">{meta.ragione_sociale}</p>
                  </div>
                )}
                {meta.partita_iva && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Partita IVA</p>
                    <p className="font-semibold text-[#002147]">{meta.partita_iva}</p>
                  </div>
                )}
                {meta.ruolo && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ruolo</p>
                    <p className="font-semibold text-[#002147]">{meta.ruolo}</p>
                  </div>
                )}
              </div>
            )}
          </section>}

        </main>
      </div>
    </div>
  );
}
