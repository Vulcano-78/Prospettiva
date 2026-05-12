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
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
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

  const visibleSelectedCount = filteredOrders.filter(o => selectedIds.has(o.id)).length;
  const allVisibleSelected = filteredOrders.length > 0 && visibleSelectedCount === filteredOrders.length;

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (const o of filteredOrders) next.delete(o.id);
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        for (const o of filteredOrders) next.add(o.id);
        return next;
      });
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDeleteOne = async (order: Order) => {
    if (!confirm('Sei sicuro di voler eliminare questo ordine?')) return;
    if (order.file_url) {
      await supabase.storage.from('documenti').remove([order.file_url]);
    }
    await supabase.from('orders').delete().eq('id', order.id);
    setOrders(prev => prev.filter(o => o.id !== order.id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(order.id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`Eliminare ${ids.length} ${ids.length === 1 ? 'documento' : 'documenti'}? L'operazione non è reversibile.`)) return;
    setDeleting(true);
    try {
      const toDelete = orders.filter(o => selectedIds.has(o.id));
      const filePaths = toDelete.map(o => o.file_url).filter((p): p is string => !!p);
      if (filePaths.length > 0) {
        await supabase.storage.from('documenti').remove(filePaths);
      }
      await supabase.from('orders').delete().in('id', ids);
      setOrders(prev => prev.filter(o => !selectedIds.has(o.id)));
      setSelectedIds(new Set());
    } finally {
      setDeleting(false);
    }
  };

  const meta = user.user_metadata ?? {};
  const nome = meta.nome ?? '';
  const cognome = meta.cognome ?? '';
  const nomeCompleto = [nome, cognome].filter(Boolean).join(' ') || '—';

  const sectionMeta = {
    documenti: { title: 'I miei documenti', subtitle: 'Storico degli ordini e download dei documenti.' },
    conti: { title: 'Conti Economici', subtitle: 'Calcoli salvati dall’utility gratuita.' },
    profilo: { title: 'Dati Personali', subtitle: 'Le informazioni del tuo profilo.' },
  } as const;

  const navItems: { key: typeof activeSection; label: string; icon: string }[] = [
    { key: 'documenti', label: 'Documenti', icon: 'description' },
    { key: 'conti', label: 'Conti Economici', icon: 'calculate' },
    { key: 'profilo', label: 'Dati Personali', icon: 'person' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6]">
      <div className="flex flex-1 pt-14 relative">

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-[4.5rem] left-4 z-30 bg-white rounded-lg shadow-md border border-slate-200 w-10 h-10 inline-flex items-center justify-center text-[#002147]"
          aria-label="Apri menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 lg:top-14 left-0 z-50 w-64 h-screen lg:h-[calc(100vh-3.5rem)] bg-[#002147] text-white flex flex-col transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="px-5 pt-6 pb-5 border-b border-white/10 flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-[0.625rem] uppercase tracking-widest text-white/40 font-bold">Area Personale</p>
              {nomeCompleto !== '—' && (
                <p className="mt-1 text-base font-extrabold text-white truncate" style={{ fontFamily: 'var(--font-headline)' }}>{nomeCompleto}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
              aria-label="Chiudi"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const active = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActiveSection(item.key); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full ${
                    active
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[1.25rem]">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-2">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="block w-full bg-[#4463ee] text-white font-bold py-2.5 rounded-lg text-center text-sm hover:brightness-110 transition-all"
            >
              Nuovo ordine
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-white/60 hover:text-white text-xs transition-colors w-full"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Esci
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-5 sm:px-8 py-8 pt-16 lg:pt-8 max-w-7xl">
          {/* Header coerente con admin */}
          <header className="mb-8">
            <p className="text-[0.625rem] uppercase tracking-widest text-slate-400 font-bold mb-1">Area personale</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#002147]" style={{ fontFamily: 'var(--font-headline)' }}>
              {sectionMeta[activeSection].title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{sectionMeta[activeSection].subtitle}</p>
          </header>

          {/* Documenti */}
          {activeSection === 'documenti' && <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-6">
              <div className="flex bg-white border border-slate-200 p-1 rounded-xl">
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

              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
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
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      ref={el => { if (el) el.indeterminate = visibleSelectedCount > 0 && !allVisibleSelected; }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147]"
                    />
                    <span className="text-sm font-semibold text-[#002147]">
                      {visibleSelectedCount > 0 ? `${visibleSelectedCount} selezionat${visibleSelectedCount === 1 ? 'o' : 'i'}` : 'Seleziona tutto'}
                    </span>
                  </label>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.size === 0 || deleting}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40 disabled:hover:bg-red-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    {deleting ? 'Eliminazione…' : `Elimina selezionati`}
                  </button>
                </div>
                {filteredOrders.map(order => {
                  const ready = !!order.file_url;
                  const isSelected = selectedIds.has(order.id);
                  return (
                    <div key={order.id} className={`bg-white p-5 rounded-xl border flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow ${isSelected ? 'border-[#4463ee]' : 'border-slate-100'}`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(order.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#002147] focus:ring-[#002147] cursor-pointer"
                          aria-label={`Seleziona ${orderLabel(order)}`}
                        />
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
                          <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Stato</p>
                          <span className={`px-3 py-1 rounded-full text-[0.625rem] font-bold ${ready ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
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
                            onClick={() => handleDeleteOne(order)}
                            className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            aria-label="Elimina ordine"
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
            <div className="flex justify-end mb-6">
              <Link href="/utility/conto-economico" className="inline-flex items-center gap-2 bg-[#4463ee] text-white font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all text-sm">
                <span className="material-symbols-outlined text-base">add</span>
                Nuovo CE
              </Link>
            </div>

            {conti.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
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
                    <div key={ce.id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow">
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
                            <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400">Utile</p>
                            <p className={`text-sm font-bold ${t.utile >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtEur(t.utile)}</p>
                          </div>
                          <div>
                            <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400">ROI</p>
                            <p className="text-sm font-bold text-[#002147]">{fmtPct(t.roi)}</p>
                          </div>
                          <div>
                            <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400">ROE</p>
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
          {activeSection === 'profilo' && <section className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-end mb-6">
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
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Nome</label>
                    <input
                      type="text"
                      value={editData.nome}
                      onChange={e => setEditData(p => ({ ...p, nome: e.target.value }))}
                      placeholder="Giuseppe"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Cognome</label>
                    <input
                      type="text"
                      value={editData.cognome}
                      onChange={e => setEditData(p => ({ ...p, cognome: e.target.value }))}
                      placeholder="Verdi"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Indirizzo</label>
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
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Comune</label>
                    <input
                      type="text"
                      value={editData.citta}
                      onChange={e => setEditData(p => ({ ...p, citta: e.target.value }))}
                      placeholder="Roma"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">CAP</label>
                    <input
                      type="text"
                      value={editData.cap}
                      onChange={e => setEditData(p => ({ ...p, cap: e.target.value }))}
                      placeholder="00100"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Provincia</label>
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
                      <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Ragione Sociale</label>
                      <input
                        type="text"
                        value={editData.ragione_sociale}
                        onChange={e => setEditData(p => ({ ...p, ragione_sociale: e.target.value }))}
                        placeholder="Studio Verdi S.r.l."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Partita IVA</label>
                        <input
                          type="text"
                          value={editData.partita_iva}
                          onChange={e => setEditData(p => ({ ...p, partita_iva: e.target.value }))}
                          placeholder="11 cifre"
                        />
                      </div>
                      <div>
                        <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Codice SDI / PEC</label>
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
                        <label className="block text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Ruolo</label>
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
                  <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Nome e Cognome</p>
                  <p className="font-semibold text-[#002147]">{nomeCompleto}</p>
                </div>
                <div>
                  <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Email</p>
                  <p className="font-semibold text-[#002147]">{user.email ?? '—'}</p>
                </div>
                {(meta.indirizzo || meta.citta) && (
                  <div className="col-span-2">
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Indirizzo</p>
                    <p className="font-semibold text-[#002147]">
                      {[meta.indirizzo, meta.citta, meta.cap, meta.provincia].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
                {meta.account_type && (
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Tipo Account</p>
                    <p className="font-semibold text-[#002147] capitalize">{meta.account_type}</p>
                  </div>
                )}
                {meta.ragione_sociale && (
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Ragione Sociale</p>
                    <p className="font-semibold text-[#002147]">{meta.ragione_sociale}</p>
                  </div>
                )}
                {meta.partita_iva && (
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Partita IVA</p>
                    <p className="font-semibold text-[#002147]">{meta.partita_iva}</p>
                  </div>
                )}
                {meta.ruolo && (
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-widest font-bold text-slate-400 mb-1">Ruolo</p>
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
