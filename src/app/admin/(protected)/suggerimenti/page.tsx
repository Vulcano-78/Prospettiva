import { createAdminClient } from '@/lib/supabase/admin';
import { fmtDate, countWithinDays } from '@/lib/admin/stats';
import { PageHeader, Card, Kpi } from '../ui';

export const dynamic = 'force-dynamic';

type Sugg = { id: string; email: string | null; message: string; created_at: string };

export default async function AdminSuggerimentiPage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('suggestions')
    .select('id, email, message, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);
  const suggs = (data || []) as Sugg[];

  const last30 = countWithinDays(suggs, s => s.created_at, 30);
  const withEmail = suggs.filter(s => !!s.email).length;

  return (
    <>
      <PageHeader title="Suggerimenti" subtitle="Feedback ricevuti dagli utenti" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Kpi label="Totali" value={String(suggs.length)} icon="lightbulb" />
        <Kpi label="Ultimi 30g" value={String(last30)} accent="emerald" icon="schedule" />
        <Kpi label="Con email contatto" value={String(withEmail)} icon="mail" />
      </div>

      <Card title="Tutti i suggerimenti">
        {suggs.length === 0 ? (
          <p className="text-sm text-slate-500 p-5">Nessun suggerimento.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {suggs.map(s => (
              <li key={s.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-xs text-[#002147] font-semibold">{s.email || 'Anonimo'}</span>
                  <span className="text-xs text-slate-400">{fmtDate(s.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{s.message}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
