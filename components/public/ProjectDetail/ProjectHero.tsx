'use client';

import { Project } from '@/lib/api/projects';
import ImageSlideshow from '@/components/shared/ImageSlideshow/ImageSlideshow';
import { parseImages } from '@/lib/utils/imageUtils';

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const images = parseImages(project.imageUrl);

  return (
    <div className="browser-window mb-6">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
      </div>

      <ImageSlideshow images={images} videoUrl={project.videoUrl} alt={project.title} />

      <div className="p-6">
        <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black mb-4">
          {project.title}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hand-drawn inline-flex items-center gap-2 rounded-lg border-4 border-black bg-black px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:bg-gray-800"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
        </div>
      </div>
    </div>
  );
}

