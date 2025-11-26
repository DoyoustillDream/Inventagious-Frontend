'use client';

import Link from 'next/link';
import { categories } from '@/lib/categories';

export default function CategoryButtons() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="hand-drawn mb-6 text-3xl font-bold text-black">
          Browse Project Categories
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/category/${category.slug}`}
                className="block p-4 rounded-lg border-2 border-black bg-white transition-all duration-300 hover:bg-yellow-100 hover:scale-[1.02] active:scale-100 hover:shadow-lg"
                data-element-id={`category-${category.slug}`}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="flex-shrink-0 text-gray-700">
                    {category.icon}
                  </div>
                  <div className="text-base font-bold text-black hand-drawn">
                    {category.name}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

