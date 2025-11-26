'use client';

import Link from 'next/link';
import { categories } from '@/lib/categories';
import CategoryCard from './CategoryCard';
import CategoriesHero from './CategoriesHero';
import WhyCategories from './WhyCategories';
import HowToChoose from './HowToChoose';

export default function CategoriesGuide() {
  return (
    <div className="container mx-auto px-4">
      <CategoriesHero />
      
      {/* Full-width categories showcase */}
      <div className="max-w-7xl mx-auto mt-12 mb-12">
        <div className="browser-window bg-white mb-8">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              ALL CATEGORIES
            </div>
            <div className="flex-1" />
          </div>
          <div className="p-6 md:p-8">
            <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-6 text-center">
              Browse All Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Categories - Full Width */}
      <div className="max-w-5xl mx-auto mb-12">
        <WhyCategories />
      </div>

      {/* How to Choose - Full Width */}
      <div className="max-w-5xl mx-auto mb-12">
        <HowToChoose />
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="browser-window bg-yellow-50">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              READY TO START?
            </div>
            <div className="flex-1" />
          </div>
          <div className="p-8 text-center">
            <p className="hand-drawn text-xl font-bold text-black mb-6">
              Found the right category? Create your project now!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects/create"
                className="hand-drawn border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
              >
                Create Your Project
              </Link>
              <Link
                href="/help/start-project"
                className="hand-drawn border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
              >
                How to Start a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
