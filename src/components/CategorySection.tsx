'use client';

import { Category } from '@/data/services';
import { services } from '@/data/services';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  category: Category;
}

export default function CategorySection({ category }: CategorySectionProps) {
  const categoryServices = services.filter(s => s.category === category.id);

  if (categoryServices.length === 0) return null;

  return (
    <section className="scroll-mt-28 category-panel" id={category.id}>
      <div className="flex items-center gap-5 mb-8 pb-2">
        <div className="category-pill shadow-sm">
          <span className="material-symbols-outlined text-[#002147] text-[20px]">{category.icon}</span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#002147]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {category.name}
          </h2>
          <p className="text-[#516169] text-xs mt-1">{category.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {categoryServices.map(service => (
          <ProductCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
