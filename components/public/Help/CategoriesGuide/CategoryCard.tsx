import Link from 'next/link';
import { CategoryInfo } from '@/lib/categories';

interface CategoryCardProps {
  category: CategoryInfo;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="block border-4 border-black bg-white p-4 transition-all hover:bg-yellow-50 hover:border-yellow-600 hover:scale-105 active:scale-95"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 border-4 border-black bg-yellow-400 rounded-lg flex items-center justify-center">
          <div className="text-black">
            {category.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="hand-drawn text-lg font-bold text-black mb-1">
            {category.name}
          </h3>
          <p className="text-sm font-semibold text-gray-700">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

