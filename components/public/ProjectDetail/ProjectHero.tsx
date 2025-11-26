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
        <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
          PROJECT HERO
        </div>
        <div className="flex-1" />
      </div>

      <ImageSlideshow images={images} alt={project.title} />

      <div className="p-6">
        <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black mb-4">
          {project.title}
        </h1>
      </div>
    </div>
  );
}

