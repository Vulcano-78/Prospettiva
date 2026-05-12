import { requireAdmin } from '@/lib/admin/auth';
import AdminSidebar from '../AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-[#f3f4f6] flex pt-16">
      <AdminSidebar email={admin.email} />
      <main className="flex-1 min-w-0">
        <div className="px-5 sm:px-8 py-8 pt-20 lg:pt-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
