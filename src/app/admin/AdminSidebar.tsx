'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = { href: string; label: string; icon: string };

const NAV: NavItem[] = [
  { href: '/admin', label: 'Panoramica', icon: 'dashboard' },
  { href: '/admin/utenti', label: 'Utenti', icon: 'group' },
  { href: '/admin/incassi', label: 'Incassi', icon: 'payments' },
  { href: '/admin/ordini', label: 'Ordini', icon: 'receipt_long' },
  { href: '/admin/strumenti', label: 'Strumenti', icon: 'calculate' },
  { href: '/admin/notifiche', label: 'Notifiche', icon: 'notifications' },
  { href: '/admin/suggerimenti', label: 'Suggerimenti', icon: 'lightbulb' },
];

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-[4.5rem] left-4 z-30 bg-white rounded-[5px] shadow-md border border-slate-200 w-10 h-10 inline-flex items-center justify-center text-[#002147]"
        aria-label="Apri menu admin"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-50 w-64 h-screen lg:h-[calc(100vh-4rem)] bg-[#002147] text-white flex flex-col transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 pt-6 pb-5 border-b border-white/10 flex items-start justify-between">
          <div>
            <p className="text-[0.625rem] uppercase tracking-widest text-white/40 font-bold">Prospettiva</p>
            <p className="text-lg font-extrabold mt-0.5" style={{ fontFamily: 'var(--font-headline)' }}>Admin</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
            aria-label="Chiudi"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const active = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[5px] text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[1.25rem]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[0.625rem] uppercase tracking-widest text-white/40 font-bold mb-1">Account</p>
          <p className="text-xs text-white/80 truncate">{email}</p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Esci dall&apos;admin
          </Link>
        </div>
      </aside>
    </>
  );
}
