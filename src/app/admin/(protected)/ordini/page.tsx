import { fetchOrders, fmtDate, fmtEur, orderGrossAmount, orderNetAmount } from '@/lib/admin/stats';
import { PageHeader, Card, Kpi } from '../ui';

export const dynamic = 'force-dynamic';

export default async function AdminOrdiniPage() {
  const orders = await fetchOrders();
  const totalNet = orders.reduce((s, o) => s + orderNetAmount(o), 0);
  const totalGross = orders.reduce((s, o) => s + orderGrossAmount(o), 0);

  return (
    <>
      <PageHeader title="Ordini" subtitle={`${orders.length} ordini totali`} />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Kpi label="Ordini totali" value={String(orders.length)} icon="receipt_long" />
        <Kpi label="Lordo cumulato" value={fmtEur(totalGross, { decimals: 0 })} accent="emerald" />
        <Kpi label="Netto cumulato" value={fmtEur(totalNet, { decimals: 0 })} />
      </div>

      <Card title="Ultimi ordini">
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500 p-5">Nessun ordine.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[0.625rem] uppercase tracking-widest text-slate-500 font-bold">
                <tr>
                  <th className="text-left px-5 py-3">Ref</th>
                  <th className="text-left px-3 py-3">Email</th>
                  <th className="text-left px-3 py-3">Servizi</th>
                  <th className="text-right px-3 py-3">Netto</th>
                  <th className="text-right px-3 py-3">Lordo</th>
                  <th className="text-right px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 200).map(o => {
                  const net = orderNetAmount(o);
                  const gross = orderGrossAmount(o);
                  const labels = (o.items || []).map(i => i.tipo_servizio_label || i.slug).join(', ');
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/60 align-top">
                      <td className="px-5 py-3 font-mono text-xs text-[#002147]">{o.order_ref}</td>
                      <td className="px-3 py-3 text-[#002147] font-semibold truncate max-w-[220px]">{o.email}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs max-w-[320px]">
                        <span className="line-clamp-2">{labels || '—'}</span>
                        <span className="text-slate-400">{(o.items || []).length} item</span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{fmtEur(net, { decimals: 2 })}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-semibold text-[#002147]">{fmtEur(gross, { decimals: 2 })}</td>
                      <td className="px-5 py-3 text-right text-slate-500 text-xs whitespace-nowrap">{fmtDate(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length > 200 && (
              <p className="text-xs text-slate-400 p-4 text-center border-t border-slate-100">Mostrati i primi 200 ordini.</p>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
