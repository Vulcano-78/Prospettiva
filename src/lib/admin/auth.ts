import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
}

function expectedSessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash('sha256').update(pw).digest('hex');
}

export type AdminUser = { id: string; email: string };

export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admins = getAdminEmails();
  if (!user || !admins.includes((user.email || '').toLowerCase())) {
    redirect('/');
  }
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const expected = expectedSessionToken();
  if (!expected || session !== expected) {
    redirect('/admin/login');
  }
  return { id: user.id, email: user.email || '' };
}
