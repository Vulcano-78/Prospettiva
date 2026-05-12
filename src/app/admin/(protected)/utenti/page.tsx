import { fetchUsersWithActivity, fmtDate, fmtDateOnly } from '@/lib/admin/stats';
import { PageHeader, Kpi, Card, Badge } from '../ui';

export const dynamic = 'force-dynamic';

export default async function AdminUtentiPage() {
  const users = await fetchUsersWithActivity();
  const counts = {
    attivo: users.filter(u => u.status === 'attivo').length,
    inattivo: users.filter(u => u.status === 'inattivo').length,
    dormiente: users.filter(u => u.status === 'dormiente').length,
  };

  return (
    <>
      <PageHeader title="Utenti" subtitle={`${users.length} utenti registrati`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Totale" value={String(users.length)} icon="group" />
        <Kpi label="Attivi (≤30g)" value={String(counts.attivo)} accent="emerald" icon="bolt" />
        <Kpi label="Inattivi (31-90g)" value={String(counts.inattivo)} accent="amber" icon="schedule" />
        <Kpi label="Dormienti (>90g)" value={String(counts.dormiente)} accent="rose" icon="bedtime" />
      </div>

      <Card title="Elenco utenti">
        {users.length === 0 ? (
          <p className="text-sm text-slate-500 p-5">Nessun utente.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[0.625rem] uppercase tracking-widest text-slate-500 font-bold">
                <tr>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-3 py-3">Stato</th>
                  <th className="text-left px-3 py-3">Ultima core action</th>
                  <th className="text-right px-3 py-3">Ordini</th>
                  <th className="text-right px-3 py-3">CE</th>
                  <th className="text-right px-5 py-3">Registrato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-[#002147] truncate max-w-[280px]">{u.email || '—'}</td>
                    <td className="px-3 py-3">
                      {u.status === 'attivo' && <Badge tone="emerald">Attivo</Badge>}
                      {u.status === 'inattivo' && <Badge tone="amber">Inattivo</Badge>}
                      {u.status === 'dormiente' && <Badge tone="rose">Dormiente</Badge>}
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {u.lastCoreAction ? fmtDate(u.lastCoreAction) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-700">{u.ordersCount}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-slate-700">{u.contiEconomiciCount}</td>
                    <td className="px-5 py-3 text-right text-slate-500 text-xs">{fmtDateOnly(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="text-xs text-slate-400 mt-4">
        Una core action è qualsiasi azione utente esclusa l&apos;area account (registrazione, login, recupero password). Attualmente sono tracciati: ordini pagati e salvataggi del conto economico.
      </p>
    </>
  );
}
