import { fetchOrders, bucketRevenue, totalsForPeriod, fmtEur } from '@/lib/admin/stats';
import { PageHeader, Kpi, Card } from '../ui';

export const dynamic = 'force-dynamic';

export default async function AdminIncassiPage() {
  const orders = await fetchOrders();

  const mtd = totalsForPeriod(orders, 'mtd');
  const ytd = totalsForPeriod(orders, 'ytd');
  const d7 = totalsForPeriod(orders, '7d');
  const d30 = totalsForPeriod(orders, '30d');
  const all = totalsForPeriod(orders, 'all');

  const byMonth = bucketRevenue(orders, 'month').slice(-12);
  const maxMonthGross = Math.max(1, ...byMonth.map(b => b.gross));

  return (
    <>
      <PageHeader title="Incassi" subtitle="Stima basata sui prezzi di catalogo · IVA al 22%" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Mese corrente · Lordo" value={fmtEur(mtd.gross, { decimals: 0 })} hint={`${mtd.orders} ordini`} accent="emerald" icon="trending_up" />
        <Kpi label="Mese corrente · Netto" value={fmtEur(mtd.net, { decimals: 0 })} hint="Imponibile escl. IVA" icon="payments" />
        <Kpi label="Mese corrente · IVA" value={fmtEur(mtd.vat, { decimals: 0 })} hint="22% stimata" accent="amber" icon="percent" />
        <Kpi label="Anno corrente · Lordo" value={fmtEur(ytd.gross, { decimals: 0 })} hint={`${ytd.orders} ordini YTD`} accent="sky" icon="calendar_today" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Kpi label="Ultimi 7 giorni" value={fmtEur(d7.gross, { decimals: 0 })} hint={`${d7.orders} ordini`} />
        <Kpi label="Ultimi 30 giorni" value={fmtEur(d30.gross, { decimals: 0 })} hint={`${d30.orders} ordini`} />
        <Kpi label="Totale storico · Lordo" value={fmtEur(all.gross, { decimals: 0 })} hint={`${all.orders} ordini totali`} accent="navy" icon="account_balance_wallet" />
        <Kpi label="Totale IVA storica" value={fmtEur(all.vat, { decimals: 0 })} hint="Stima al 22%" accent="amber" />
      </div>

      <Card title="Andamento ultimi 12 mesi">
        {byMonth.length === 0 ? (
          <p className="text-sm text-slate-500 p-5">Nessun ordine.</p>
        ) : (
          <div className="p-5 space-y-3">
            {byMonth.map(b => {
              const pct = (b.gross / maxMonthGross) * 100;
              return (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between text-xs mb-1">
                    <span className="text-slate-600 font-semibold">{formatMonthLabel(b.label)}</span>
                    <span className="text-[#002147] font-bold tabular-nums">{fmtEur(b.gross, { decimals: 0 })}</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-[#4463EE] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[0.625rem] text-slate-400 mt-1">
                    <span>{b.orders} ordini · Netto {fmtEur(b.net, { decimals: 0 })} · IVA {fmtEur(b.vat, { decimals: 0 })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
        Gli importi sono calcolati moltiplicando il prezzo di listino di ogni servizio (catalogo) per ciascun item dell&apos;ordine. Le tabelle <code className="bg-slate-100 px-1 rounded">orders</code> non salvano oggi l&apos;importo effettivamente pagato; per cifre identiche allo storico Stripe servirebbe aggiungere una colonna <code className="bg-slate-100 px-1 rounded">amount_total</code>.
      </p>
    </>
  );
}

function formatMonthLabel(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString('it-IT', { month: 'short', year: 'numeric' });
}
