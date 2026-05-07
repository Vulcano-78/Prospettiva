import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)
}

function expectedSessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw) return null
  return crypto.createHash('sha256').update(pw).digest('hex')
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admins = getAdminEmails()
  if (!user || !admins.includes((user.email || '').toLowerCase())) {
    redirect('/')
  }

  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  const expected = expectedSessionToken()
  if (!expected || session !== expected) {
    redirect('/admin/login')
  }

  const admin = createAdminClient()
  const [{ data: notifs }, { data: suggs }] = await Promise.all([
    admin.from('email_notifications').select('*').order('created_at', { ascending: false }).limit(500),
    admin.from('suggestions').select('*').order('created_at', { ascending: false }).limit(500),
  ])

  const notifications = (notifs || []) as Array<{ id: string; email: string; slug: string; created_at: string }>
  const suggestions = (suggs || []) as Array<{ id: string; email: string | null; message: string; created_at: string }>

  // Group notifications by slug
  const bySlug = notifications.reduce((acc, n) => {
    acc[n.slug] = (acc[n.slug] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const slugCounts = Object.entries(bySlug).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">Admin</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Loggato come {user.email}
          </p>
        </header>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200 p-5">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Notifiche totali</p>
            <p className="text-3xl font-extrabold text-[#002147]">{notifications.length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Suggerimenti totali</p>
            <p className="text-3xl font-extrabold text-[#002147]">{suggestions.length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5">
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2">Servizi richiesti</p>
            <p className="text-3xl font-extrabold text-[#002147]">{slugCounts.length}</p>
          </div>
        </div>

        {/* Notifiche per servizio */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">notifications</span>
            Notifiche &quot;avvisami&quot; — per servizio
          </h2>
          {slugCounts.length === 0 ? (
            <p className="text-sm text-on-surface-variant bg-white border border-slate-200 p-4">Nessuna notifica ancora.</p>
          ) : (
            <div className="bg-white border border-slate-200 divide-y divide-slate-100">
              {slugCounts.map(([slug, count]) => (
                <details key={slug} className="group">
                  <summary className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-slate-50 list-none">
                    <span className="font-bold text-sm text-[#002147]">{slug}</span>
                    <span className="bg-secondary/10 text-secondary text-xs font-bold px-2 py-0.5">{count}</span>
                  </summary>
                  <div className="bg-slate-50/50 px-5 py-3">
                    <ul className="space-y-1 text-sm">
                      {notifications.filter(n => n.slug === slug).map(n => (
                        <li key={n.id} className="flex justify-between items-center py-1 text-on-surface-variant">
                          <span className="text-[#002147]">{n.email}</span>
                          <span className="text-xs text-slate-400">{formatDate(n.created_at)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>

        {/* Suggerimenti */}
        <section>
          <h2 className="text-lg font-bold text-[#002147] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">lightbulb</span>
            Suggerimenti
          </h2>
          {suggestions.length === 0 ? (
            <p className="text-sm text-on-surface-variant bg-white border border-slate-200 p-4">Nessun suggerimento ancora.</p>
          ) : (
            <div className="space-y-3">
              {suggestions.map(s => (
                <article key={s.id} className="bg-white border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-[#002147] font-semibold">{s.email || 'Anonimo'}</span>
                    <span className="text-slate-400">{formatDate(s.created_at)}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{s.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
