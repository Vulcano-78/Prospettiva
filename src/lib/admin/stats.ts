import { createAdminClient } from '@/lib/supabase/admin';
import { getServiceBySlug } from '@/data/services';

const IVA_RATE = 0.22;

export type OrderRow = {
  id: string;
  order_ref: string;
  email: string;
  user_id: string | null;
  items: Array<{ slug: string; formData?: Record<string, string>; tipo_servizio_label?: string }>;
  stripe_payment_intent_id: string | null;
  created_at: string;
};

export type ConfigEconomicoRow = {
  id: string;
  user_id: string;
  titolo: string;
  created_at: string;
  updated_at: string | null;
};

export type AuthUserLite = {
  id: string;
  email: string | null;
  created_at: string;
};

/** Prezzo netto (escl. IVA) di un ordine, calcolato dal catalogo via slug. */
export function orderNetAmount(o: OrderRow): number {
  return (o.items || []).reduce((sum, it) => {
    const svc = getServiceBySlug(it.slug);
    return sum + (svc?.price ?? 0);
  }, 0);
}

export function orderGrossAmount(o: OrderRow): number {
  return orderNetAmount(o) * (1 + IVA_RATE);
}

export function periodRange(period: '7d' | '30d' | '90d' | 'mtd' | 'ytd' | 'all'): { from: Date | null; to: Date } {
  const to = new Date();
  if (period === 'all') return { from: null, to };
  const from = new Date();
  if (period === '7d') from.setDate(to.getDate() - 7);
  else if (period === '30d') from.setDate(to.getDate() - 30);
  else if (period === '90d') from.setDate(to.getDate() - 90);
  else if (period === 'mtd') { from.setDate(1); from.setHours(0, 0, 0, 0); }
  else if (period === 'ytd') { from.setMonth(0, 1); from.setHours(0, 0, 0, 0); }
  return { from, to };
}

export type UserActivityStatus = 'attivo' | 'inattivo' | 'dormiente';

export function activityStatus(lastCoreActionAt: Date | null): UserActivityStatus {
  if (!lastCoreActionAt) return 'dormiente';
  const diffDays = (Date.now() - lastCoreActionAt.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 30) return 'attivo';
  if (diffDays <= 90) return 'inattivo';
  return 'dormiente';
}

export type UserWithActivity = {
  id: string;
  email: string | null;
  created_at: string;
  lastCoreAction: Date | null;
  status: UserActivityStatus;
  ordersCount: number;
  contiEconomiciCount: number;
};

export async function fetchAllUsers(): Promise<AuthUserLite[]> {
  const admin = createAdminClient();
  const all: AuthUserLite[] = [];
  // Paginate through auth admin list (default 1000 per page).
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) break;
    const list = data?.users ?? [];
    for (const u of list) {
      all.push({ id: u.id, email: u.email ?? null, created_at: u.created_at });
    }
    if (list.length < 1000) break;
    page += 1;
    if (page > 20) break; // safety
  }
  return all;
}

export async function fetchUsersWithActivity(): Promise<UserWithActivity[]> {
  const admin = createAdminClient();
  const [users, ordersRes, ceRes] = await Promise.all([
    fetchAllUsers(),
    admin.from('orders').select('user_id, created_at, email'),
    admin.from('conti_economici').select('user_id, updated_at, created_at'),
  ]);

  const lastOrderByUser = new Map<string, Date>();
  const ordersCountByUser = new Map<string, number>();
  for (const o of (ordersRes.data || []) as Array<{ user_id: string | null; created_at: string }>) {
    if (!o.user_id) continue;
    const d = new Date(o.created_at);
    ordersCountByUser.set(o.user_id, (ordersCountByUser.get(o.user_id) || 0) + 1);
    const cur = lastOrderByUser.get(o.user_id);
    if (!cur || d > cur) lastOrderByUser.set(o.user_id, d);
  }

  const lastCeByUser = new Map<string, Date>();
  const ceCountByUser = new Map<string, number>();
  for (const r of (ceRes.data || []) as Array<{ user_id: string; updated_at: string | null; created_at: string }>) {
    const d = new Date(r.updated_at || r.created_at);
    ceCountByUser.set(r.user_id, (ceCountByUser.get(r.user_id) || 0) + 1);
    const cur = lastCeByUser.get(r.user_id);
    if (!cur || d > cur) lastCeByUser.set(r.user_id, d);
  }

  return users
    .map(u => {
      const lo = lastOrderByUser.get(u.id) || null;
      const lc = lastCeByUser.get(u.id) || null;
      let last: Date | null = null;
      if (lo && lc) last = lo > lc ? lo : lc;
      else last = lo || lc;
      // Per gli utenti senza core action conosciuta, conto dal momento della registrazione:
      // un utente registrato ieri non è "dormiente" anche se non ha mai usato il prodotto.
      const reference = last ?? new Date(u.created_at);
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        lastCoreAction: last,
        status: activityStatus(reference),
        ordersCount: ordersCountByUser.get(u.id) || 0,
        contiEconomiciCount: ceCountByUser.get(u.id) || 0,
      };
    })
    .sort((a, b) => {
      const ta = a.lastCoreAction?.getTime() ?? 0;
      const tb = b.lastCoreAction?.getTime() ?? 0;
      return tb - ta;
    });
}

export async function fetchOrders(): Promise<OrderRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('orders')
    .select('id, order_ref, email, user_id, items, stripe_payment_intent_id, created_at')
    .order('created_at', { ascending: false })
    .limit(2000);
  return (data || []) as OrderRow[];
}

export async function fetchContiEconomici(): Promise<ConfigEconomicoRow[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from('conti_economici')
    .select('id, user_id, titolo, created_at, updated_at')
    .order('updated_at', { ascending: false, nullsFirst: false })
    .limit(2000);
  return (data || []) as ConfigEconomicoRow[];
}

export type RevenueBucket = {
  label: string;
  net: number;
  vat: number;
  gross: number;
  orders: number;
};

export function bucketRevenue(orders: OrderRow[], by: 'day' | 'month'): RevenueBucket[] {
  const map = new Map<string, RevenueBucket>();
  for (const o of orders) {
    const d = new Date(o.created_at);
    const key = by === 'month'
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const net = orderNetAmount(o);
    const gross = net * (1 + IVA_RATE);
    const cur = map.get(key) || { label: key, net: 0, vat: 0, gross: 0, orders: 0 };
    cur.net += net;
    cur.gross += gross;
    cur.vat += gross - net;
    cur.orders += 1;
    map.set(key, cur);
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

export function totalsForPeriod(orders: OrderRow[], period: Parameters<typeof periodRange>[0]) {
  const { from } = periodRange(period);
  const filtered = from ? orders.filter(o => new Date(o.created_at) >= from) : orders;
  let net = 0;
  for (const o of filtered) net += orderNetAmount(o);
  const gross = net * (1 + IVA_RATE);
  const vat = gross - net;
  return { net, vat, gross, orders: filtered.length };
}

export const IVA_RATE_DEFAULT = IVA_RATE;

export function fmtEur(n: number, opts: { decimals?: number } = {}): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: opts.decimals ?? 2,
    maximumFractionDigits: opts.decimals ?? 2,
  }).format(n);
}

export function fmtDate(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function countWithinDays<T>(items: T[], getDate: (it: T) => string | Date | null, days: number): number {
  const now = Date.now();
  const ms = days * 86400000;
  let count = 0;
  for (const it of items) {
    const d = getDate(it);
    if (!d) continue;
    const t = (typeof d === 'string' ? new Date(d) : d).getTime();
    if (now - t <= ms) count += 1;
  }
  return count;
}

export function fmtDateOnly(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}
