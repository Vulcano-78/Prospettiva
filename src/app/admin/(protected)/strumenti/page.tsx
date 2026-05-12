import { fetchContiEconomici, fmtDate, countWithinDays } from '@/lib/admin/stats';
import { PageHeader, Kpi, Card } from '../ui';

export const dynamic = 'force-dynamic';

export default async function AdminStrumentiPage() {
  const ce = await fetchContiEconomici();

  const last30 = countWithinDays(ce, r => r.updated_at || r.created_at, 30);

  const byUser = new Map<string, number>();
  for (const r of ce) byUser.set(r.user_id, (byUser.get(r.user_id) || 0) + 1);
  const topUsers = Array.from(byUser.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <>
      <PageHeader title="Strumenti gratuiti" subtitle="Utilizzo del conto economico" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Kpi label="Calcoli salvati totali" value={String(ce.length)} icon="calculate" accent="sky" />
        <Kpi label="Aggiornati ultimi 30g" value={String(last30)} accent="emerald" icon="trending_up" />
        <Kpi label="Utenti che hanno salvato" value={String(byUser.size)} icon="group" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Ultimi conti economici">
          {ce.length === 0 ? (
            <p className="text-sm text-slate-500 p-5">Nessun calcolo salvato.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {ce.slice(0, 12).map(r => (
                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-[#002147] font-semibold truncate">{r.titolo || 'Senza titolo'}</p>
                    <p className="text-xs text-slate-500 truncate">user {r.user_id.slice(0, 8)}…</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{fmtDate(r.updated_at || r.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Top utilizzatori">
          {topUsers.length === 0 ? (
            <p className="text-sm text-slate-500 p-5">—</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {topUsers.map(([uid, count]) => (
                <li key={uid} className="px-5 py-3 flex items-center justify-between text-sm">
                  <span className="text-[#002147] font-mono text-xs">{uid.slice(0, 12)}…</span>
                  <span className="font-extrabold text-[#002147] tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
