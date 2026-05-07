import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardClient, { type Order, type ContoEconomico } from './dashboard-client';

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: { user } }, { data: orders }, { data: conti }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('conti_economici')
      .select('id, titolo, regime, data, created_at')
      .order('created_at', { ascending: false }),
  ]);

  if (!user) redirect('/login');

  return (
    <DashboardClient
      initialUser={user}
      initialOrders={(orders ?? []) as Order[]}
      initialConti={(conti ?? []) as ContoEconomico[]}
    />
  );
}
