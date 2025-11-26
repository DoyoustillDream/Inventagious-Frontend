'use client';

import { CreateProjectData } from '@/lib/api/projects';
import { categories } from '@/lib/categories';

interface ProjectBasicInfoProps {
  title: string;
  description: string;
  type: 'crowdfunding' | 'private_funding';
  category: string;
  onUpdate: <K extends keyof CreateProjectData>(
    field: K,
    value: CreateProjectData[K]
  ) => void;
}

export default function ProjectBasicInfo({
  title,
  description,
  type,
  category,
  onUpdate,
}: ProjectBasicInfoProps) {
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
              Project Type <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="hand-drawn flex items-center gap-3 cursor-pointer border-4 border-black bg-white px-6 py-3 transition-all hover:bg-yellow-400 hover:scale-105">
                <input
                  type="radio"
                  name="type"
                  value="crowdfunding"
                  checked={type === 'crowdfunding'}
                  onChange={(e) => onUpdate('type', e.target.value as 'crowdfunding' | 'private_funding')}
                  className="w-5 h-5 text-black border-4 border-black accent-yellow-400"
                />
                <span className="text-base font-bold text-black">Crowdfunding</span>
              </label>
              <label className="hand-drawn flex items-center gap-3 cursor-pointer border-4 border-black bg-white px-6 py-3 transition-all hover:bg-yellow-400 hover:scale-105">
                <input
                  type="radio"
                  name="type"
                  value="private_funding"
                  checked={type === 'private_funding'}
                  onChange={(e) => onUpdate('type', e.target.value as 'crowdfunding' | 'private_funding')}
                  className="w-5 h-5 text-black border-4 border-black accent-yellow-400"
                />
                <span className="text-base font-bold text-black">Private Funding</span>
              </label>
            </div>
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

