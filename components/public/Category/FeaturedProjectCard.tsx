'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/api/projects';
import { getFirstImage } from '@/lib/utils/imageUtils';

interface FeaturedProjectCardProps {
  project: Project;
}

export default function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const progress = project.fundingGoal > 0 
    ? Math.min((project.amountRaised / project.fundingGoal) * 100, 100)
    : 0;
  const firstImage = getFirstImage(project.imageUrl);

  return (
    <Link
      href={project.type === 'crowdfunding' ? `/campaigns/${project.slug}` : `/projects/${project.id}`}
      className="block rounded-lg border-2 border-black bg-white transition-all duration-300 hover:bg-yellow-100 hover:scale-[1.02] active:scale-100 hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-300">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="hand-drawn mb-2 text-lg font-bold text-black line-clamp-2">
          {project.title}
        </h3>
        <div className="mt-3">
          <div className="mb-2">
            <div className="h-4 overflow-hidden border-2 border-black bg-gray-200">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
          <div className="hand-drawn text-sm font-bold text-black">
            {project.amountRaised.toLocaleString()} SOL raised
          </div>
        </div>
      </div>
    </Link>
  );
}

