import { createClient } from '@/lib/supabase/server';
import ContoEconomicoClient from './conto-economico-client';

export const metadata = {
  title: 'Conto Economico — Prospettiva',
  description: 'Calcola gratuitamente costi, ricavi, utile, ROI e ROE di un\'operazione immobiliare.',
};

export default async function ContoEconomicoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <ContoEconomicoClient userEmail={user?.email ?? null} isLogged={!!user} />;
}
