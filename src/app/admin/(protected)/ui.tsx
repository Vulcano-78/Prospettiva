import React from 'react';

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-8 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="text-[0.625rem] font-mono uppercase tracking-[0.22em] text-[#4463EE] mb-3">Admin</p>
        <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#002147] leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-on-surface-variant mt-2">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function Kpi({
  label, value, hint, accent, icon,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: 'navy' | 'emerald' | 'amber' | 'rose' | 'sky';
  icon?: string;
}) {
  const colors: Record<NonNullable<typeof accent>, string> = {
    navy: 'text-[#002147]',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    sky: 'text-sky-600',
  };
  return (
    <div className="bg-white border border-slate-300/80 rounded-[5px] p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[0.625rem] uppercase tracking-widest text-slate-400 font-bold">{label}</p>
        {icon && <span className="material-symbols-outlined text-slate-300 text-lg">{icon}</span>}
      </div>
      <p className={`text-2xl font-extrabold ${colors[accent || 'navy']}`} style={{ fontFamily: 'var(--font-headline)' }}>
        {value}
      </p>
      {hint && <p className="text-[0.6875rem] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

export function Card({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-300/80 rounded-[5px] overflow-hidden">
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100">
          {title && <h2 className="text-sm font-extrabold text-[#002147] uppercase tracking-widest">{title}</h2>}
          {action}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}

export function Badge({ children, tone }: { children: React.ReactNode; tone: 'emerald' | 'amber' | 'rose' | 'slate' | 'sky' }) {
  const tones: Record<typeof tone, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
    sky: 'bg-sky-50 text-sky-700 border-sky-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.625rem] font-bold uppercase tracking-wider border ${tones[tone]}`}>
      {children}
    </span>
  );
}
