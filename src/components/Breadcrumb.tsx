import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-4 text-[11px] flex items-center gap-1.5 text-on-surface-variant flex-wrap">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#4463EE] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-[#002147] font-semibold' : ''}>{item.label}</span>
            )}
            {!isLast && <span className="text-slate-300">&gt;</span>}
          </span>
        );
      })}
    </nav>
  );
}
