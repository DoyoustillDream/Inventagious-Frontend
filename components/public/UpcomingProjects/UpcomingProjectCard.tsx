'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getFirstImage } from '@/lib/utils/imageUtils';
import { Project } from '@/lib/api/projects';
import { InterestButton } from '../ProjectInterest/index';

interface UpcomingProjectCardProps {
  project: Project;
}

export default function UpcomingProjectCard({ project }: UpcomingProjectCardProps) {
  const firstImage = getFirstImage(project.imageUrl);
  const launchDate = project.scheduledLaunchDate 
    ? new Date(project.scheduledLaunchDate)
    : null;
  
  const daysUntilLaunch = launchDate
    ? Math.ceil((launchDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const href = project.type === 'crowdfunding' 
    ? `/campaigns/${project.slug}` 
    : `/deals/${project.id}`;

  return (
    <div className="browser-window overflow-hidden transition hover:scale-105">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
      </div>
      
      {firstImage && (
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={firstImage}
            alt={project.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 px-3 py-1 bg-yellow-400 border-2 border-black rounded-full">
            <span className="hand-drawn text-sm font-bold text-black">Coming Soon</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="hand-drawn text-xl font-bold text-black flex-1">{project.title}</h3>
        </div>
        
        {project.description && (
          <p className="mb-4 line-clamp-2 text-sm font-semibold text-gray-800">
            {project.description}
          </p>
        )}
        
        {launchDate && (
          <div className="mb-4 p-3 bg-yellow-50 border-2 border-black rounded-lg">
            <p className="text-sm font-bold text-black mb-1">Launch Date</p>
            <p className="text-lg font-bold text-black">
              {launchDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            {daysUntilLaunch !== null && daysUntilLaunch > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {daysUntilLaunch} {daysUntilLaunch === 1 ? 'day' : 'days'} until launch
              </p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between gap-4">
          <Link
            href={href}
            className="hand-drawn flex-1 px-4 py-2 border-4 border-black bg-white hover:bg-yellow-200 rounded-lg font-bold text-black transition hover:scale-105 text-center"
          >
            Read More
          </Link>
          <InterestButton
            projectId={project.id}
            interestCount={project.interestCount}
            showCount={true}
          />
        </div>
      </div>
    </div>
  );
}

