'use client';

import { CreateProjectData } from '@/lib/api/projects';
import { categories } from '@/lib/categories';

interface DealBasicInfoProps {
  title: string;
  description: string;
  category: string;
  onUpdate: <K extends keyof CreateProjectData>(
    field: K,
    value: CreateProjectData[K]
  ) => void;
}

export default function DealBasicInfo({
  title,
  description,
  category,
  onUpdate,
}: DealBasicInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Project Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate('title', e.target.value)}
          required
          placeholder="Enter your project title"
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Description <span className="text-red-600">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          required
          rows={6}
          placeholder="Describe your project, its goals, and what makes it unique..."
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 resize-none"
        />
      </div>

      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Category <span className="text-red-600">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => onUpdate('category', e.target.value)}
          required
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

