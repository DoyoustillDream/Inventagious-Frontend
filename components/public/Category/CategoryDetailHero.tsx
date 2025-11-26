'use client';

import { getCategoryBySlug } from '@/lib/categories';

interface CategoryDetailHeroProps {
  categorySlug: string;
}

export default function CategoryDetailHero({ categorySlug }: CategoryDetailHeroProps) {
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return null;
  }

  return (
    <section className="bg-yellow-400 halftone-bg py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-black text-yellow-400">
              {category.icon}
            </div>
          </div>
          <h1 className="hand-drawn mb-6 text-5xl md:text-6xl font-bold text-black">
            {category.name} Projects
          </h1>
          <p className="mb-8 text-lg md:text-xl font-bold text-black max-w-3xl mx-auto leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>
    </section>
  );
}

