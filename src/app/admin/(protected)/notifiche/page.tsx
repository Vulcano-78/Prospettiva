import { createAdminClient } from '@/lib/supabase/admin';
import { fmtDate } from '@/lib/admin/stats';
import { PageHeader, Card, Kpi, Badge } from '../ui';

export const dynamic = 'force-dynamic';

type Notif = { id: string; email: string; slug: string; created_at: string };

export default async function AdminNotifichePage() {
  const admin = createAdminClient();
  const { data } = await admin
    .from('email_notifications')
    .select('id, email, slug, created_at')
    .order('created_at', { ascending: false })
    .limit(1000);
  const notifs = (data || []) as Notif[];

  const bySlug = notifs.reduce((acc, n) => {
    acc[n.slug] = (acc[n.slug] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const slugCounts = Object.entries(bySlug).sort((a, b) => b[1] - a[1]);
  const uniqueEmails = new Set(notifs.map(n => n.email)).size;

  return (
    <>
      <PageHeader title="Notifiche «avvisami»" subtitle="Iscrizioni ai servizi non ancora attivi" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Kpi label="Iscrizioni totali" value={String(notifs.length)} icon="notifications" />
        <Kpi label="Email uniche" value={String(uniqueEmails)} icon="mail" />
        <Kpi label="Servizi richiesti" value={String(slugCounts.length)} icon="category" />
      </div>

      <Card title="Per servizio">
        {slugCounts.length === 0 ? (
          <p className="text-sm text-slate-500 p-5">Nessuna iscrizione.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {slugCounts.map(([slug, count]) => (
              <details key={slug} className="group">
                <summary className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-slate-50 list-none">
                  <span className="text-sm font-bold text-[#002147]">{slug}</span>
                  <Badge tone="sky">{count}</Badge>
                </summary>
                <ul className="bg-slate-50/40 px-5 py-3 space-y-1 text-xs">
                  {notifs.filter(n => n.slug === slug).map(n => (
                    <li key={n.id} className="flex justify-between items-center py-0.5">
                      <span className="text-[#002147] font-semibold">{n.email}</span>
                      <span className="text-slate-400">{fmtDate(n.created_at)}</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
