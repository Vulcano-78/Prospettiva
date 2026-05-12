import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  fetchOrders,
  fetchUsersWithActivity,
  totalsForPeriod,
  fmtEur,
  fmtDate,
} from '@/lib/admin/stats';
import { PageHeader, Kpi, Card, Badge } from './ui';

export const dynamic = 'force-dynamic';

export default async function AdminPanoramicaPage() {
  const admin = createAdminClient();
  const [orders, users, notifsRes, suggsRes, ceCountRes] = await Promise.all([
    fetchOrders(),
    fetchUsersWithActivity(),
    admin.from('email_notifications').select('id, slug, email, created_at').order('created_at', { ascending: false }).limit(10),
    admin.from('suggestions').select('id, email, message, created_at').order('created_at', { ascending: false }).limit(5),
    admin.from('conti_economici').select('id', { count: 'exact', head: true }),
  ]);

  const totals30 = totalsForPeriod(orders, '30d');
  const totalsMtd = totalsForPeriod(orders, 'mtd');
  const totalsAll = totalsForPeriod(orders, 'all');

  const usersByStatus = {
    attivo: users.filter(u => u.status === 'attivo').length,
    inattivo: users.filter(u => u.status === 'inattivo').length,
    dormiente: users.filter(u => u.status === 'dormiente').length,
  };

  const recentNotifs = (notifsRes.data || []) as Array<{ id: string; slug: string; email: string; created_at: string }>;
  const recentSuggs = (suggsRes.data || []) as Array<{ id: string; email: string | null; message: string; created_at: string }>;
  const ceCount = ceCountRes.count ?? 0;

  return (
    <>
      <PageHeader title="Panoramica" subtitle="Stato sintetico di Prospettiva" />

      {/* Incassi */}
      <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Incassi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Mese corrente" value={fmtEur(totalsMtd.gross, { decimals: 0 })} hint={`${totalsMtd.orders} ordini · IVA ${fmtEur(totalsMtd.vat, { decimals: 0 })}`} accent="emerald" icon="trending_up" />
        <Kpi label="Ultimi 30 giorni" value={fmtEur(totals30.gross, { decimals: 0 })} hint={`${totals30.orders} ordini`} icon="calendar_month" />
        <Kpi label="Totale storico" value={fmtEur(totalsAll.gross, { decimals: 0 })} hint={`${totalsAll.orders} ordini totali`} icon="account_balance_wallet" />
        <Kpi label="IVA accantonata (storica)" value={fmtEur(totalsAll.vat, { decimals: 0 })} hint="Stima al 22%" accent="amber" icon="percent" />
      </div>

      {/* Utenti */}
      <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-3">Utenti</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Totale" value={String(users.length)} icon="group" />
        <Kpi label="Attivi (≤30g)" value={String(usersByStatus.attivo)} accent="emerald" icon="bolt" />
        <Kpi label="Inattivi (31-90g)" value={String(usersByStatus.inattivo)} accent="amber" icon="schedule" />
        <Kpi label="Dormienti (>90g)" value={String(usersByStatus.dormiente)} accent="rose" icon="bedtime" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Ultime notifiche «avvisami»"
          action={<Link href="/admin/notifiche" className="text-xs text-[#4463EE] font-bold hover:underline">Tutte →</Link>}
        >
          {recentNotifs.length === 0 ? (
            <p className="text-sm text-slate-500 p-5">Nessuna notifica.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentNotifs.map(n => (
                <li key={n.id} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-[#002147] font-semibold truncate">{n.email}</p>
                    <p className="text-xs text-slate-500 truncate">{n.slug}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{fmtDate(n.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="Ultimi suggerimenti"
          action={<Link href="/admin/suggerimenti" className="text-xs text-[#4463EE] font-bold hover:underline">Tutti →</Link>}
        >
          {recentSuggs.length === 0 ? (
            <p className="text-sm text-slate-500 p-5">Nessun suggerimento.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentSuggs.map(s => (
                <li key={s.id} className="px-5 py-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#002147] font-semibold text-xs">{s.email || 'Anonimo'}</span>
                    <span className="text-xs text-slate-400">{fmtDate(s.created_at)}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-xs">{s.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Strumenti gratuiti">
          <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Badge tone="sky">Conto economico</Badge>
              <span className="text-sm text-slate-600">
                <strong className="text-[#002147] text-base font-extrabold">{ceCount}</strong> calcoli salvati
              </span>
            </div>
            <Link href="/admin/strumenti" className="text-xs text-[#4463EE] font-bold hover:underline">Dettagli →</Link>
          </div>
        </Card>
      </div>
    </>
  );
}
