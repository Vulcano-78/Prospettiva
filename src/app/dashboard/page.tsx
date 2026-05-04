'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type Order = {
  id: string;
  order_ref: string;
  email: string;
  items: { slug: string; formData: Record<string, string> }[];
  file_url: string | null;
  created_at: string;
};

const slugToName: Record<string, string> = {
  'visura-catastale': 'Visura Catastale',
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
  'ispezione-ipotecaria-nazionale': 'Ispezione Ipotecaria',
  'elenco-note-ipotecarie': 'Elenco Note Ipotecarie',
  'certificato-urbanistico': 'Certificato Urbanistico',
  'attestato-ape': 'Attestato APE',
  'virtual-staging': 'Virtual Staging AI',
};

function orderLabel(order: Order): string {
  const items = order.items ?? [];
  if (items.length === 0) return 'Documento';
  const first = slugToName[items[0].slug] ?? items[0].slug;
  return items.length > 1 ? `${first} + altri ${items.length - 1}` : first;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ready' | 'processing'>('all');

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return; }
      setUser(user);

      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setOrders(data ?? []);
          setLoading(false);
        });
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'ready') return !!o.file_url;
    if (filter === 'processing') return !o.file_url;
    return true;
  });

  const meta = user?.user_metadata ?? {};
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
            <a href="#documenti" className="flex items-center gap-3 px-4 py-3 text-[#002147] font-semibold bg-white shadow-sm rounded-xl border-r-2 border-[#4463ee]">
              <span className="material-symbols-outlined">description</span>
              <span className="text-sm font-semibold">Documenti</span>
            </a>
            <a href="#profilo" className="flex items-center gap-3 px-4 py-3 text-slate-500 font-medium hover:text-[#002147] hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">person</span>
              <span className="text-sm font-semibold">Dati Personali</span>
            </a>
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
          <section id="documenti" className="mb-12">
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

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 animate-pulse h-20" />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
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
                        <div>
                          {ready ? (
                            <button
                              onClick={async () => {
                                const supabase = createClient()
                                const { data } = await supabase.storage
                                  .from('documenti')
                                  .createSignedUrl(order.file_url!, 3600)
                                if (data?.signedUrl) window.open(data.signedUrl, '_blank')
                              }}
                              className="p-2 rounded-lg bg-slate-100 text-[#002147] hover:bg-[#002147] hover:text-white transition-colors block"
                            >
                              <span className="material-symbols-outlined">download</span>
                            </button>
                          ) : (
                            <div className="p-2 rounded-lg bg-slate-50 text-slate-300 cursor-not-allowed">
                              <span className="material-symbols-outlined">download</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Dati Personali */}
          <section id="profilo" className="bg-white rounded-xl p-6 border border-slate-100">
            <h2 className="text-lg font-extrabold text-[#002147] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>Dati Personali</h2>
            <div className="grid grid-cols-2 gap-y-5 gap-x-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Nome e Cognome</p>
                <p className="font-semibold text-[#002147]">{nomeCompleto}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Email</p>
                <p className="font-semibold text-[#002147]">{user?.email ?? '—'}</p>
              </div>
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
          </section>

        </main>
      </div>
    </div>
  );
}
