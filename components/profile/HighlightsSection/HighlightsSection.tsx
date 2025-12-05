'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HighlightsEditModal from './HighlightsEditModal';
import { getFirstImage } from '@/lib/utils/imageUtils';

interface HighlightedProject {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  goal?: number;
  raised?: number;
  slug?: string;
}

interface HighlightsSectionProps {
  pinnedProject?: HighlightedProject;
  projects?: HighlightedProject[];
  isOwnProfile?: boolean;
  onUpdate?: (pinnedProject?: HighlightedProject, projects?: HighlightedProject[]) => void;
}

export default function HighlightsSection({
  pinnedProject,
  projects = [],
  isOwnProfile = false,
  onUpdate,
}: HighlightsSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasPinned = !!pinnedProject;
  const hasProjects = projects && projects.length > 0;

  // Helper function to extract the first image URL from various formats
  const getImageUrl = (imageUrl?: string | string[]): string | undefined => {
    if (!imageUrl) return undefined;
    if (typeof imageUrl === 'string') {
      return getFirstImage(imageUrl);
    }
    if (Array.isArray(imageUrl)) {
      return imageUrl[0];
    }
    return undefined;
  };

  const handleUpdate = (updatedPinned?: HighlightedProject, updatedProjects?: HighlightedProject[]) => {
    if (onUpdate) {
      onUpdate(updatedPinned, updatedProjects);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="hand-drawn text-xl sm:text-2xl font-bold text-black">Highlights</h2>
        {isOwnProfile && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1.5 border-2 border-black rounded-md hover:bg-yellow-200 transition-colors text-black flex-shrink-0"
            aria-label="Edit highlights"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Pinned Project */}
      {hasPinned ? (
        <Link
          href={`/projects/${pinnedProject.slug || pinnedProject.id}`}
          className="block border-2 border-black rounded-lg overflow-hidden mb-3 sm:mb-4 hover:shadow-lg transition-shadow"
        >
          <div className="relative h-40 sm:h-48 bg-yellow-100">
            {getImageUrl(pinnedProject.imageUrl) ? (
              <Image
                src={getImageUrl(pinnedProject.imageUrl)!}
                alt={pinnedProject.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-black rounded-full bg-yellow-200 flex items-center justify-center text-black">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="p-3 sm:p-4 bg-white">
            <h3 className="font-bold text-base sm:text-lg mb-1 break-words text-black">{pinnedProject.title}</h3>
            {pinnedProject.description && (
            <p className="text-xs sm:text-sm text-gray-800 mb-2 line-clamp-2 font-semibold">
              {pinnedProject.description}
            </p>
            )}
            {pinnedProject.goal && (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${Math.min(
                          ((pinnedProject.raised || 0) / pinnedProject.goal) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <svg
                  className="w-7 h-7 ml-2 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </Link>
      ) : (
        <div className={`mb-4 rounded-lg p-6 ${
          isOwnProfile 
            ? 'border-2 border-dashed border-gray-300 bg-gray-50' 
            : 'border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-3 ${
              isOwnProfile ? 'bg-yellow-200' : 'bg-white'
            } text-black`}>
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <p className={`text-sm font-bold mb-3 ${
              isOwnProfile ? 'text-gray-800' : 'text-gray-600'
            }`}>
              {isOwnProfile 
                ? 'Pin a project to feature it prominently on your profile.'
                : 'This creator hasn\'t pinned a project yet. Check back soon!'}
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm text-black"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                Pin Project
              </button>
            )}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {hasProjects ? (
        <div className="space-y-3 sm:space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug || project.id}`}
              className="block border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-yellow-100">
                  {getImageUrl(project.imageUrl) ? (
                    <Image
                      src={getImageUrl(project.imageUrl)!}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                      {project.title[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 p-3 sm:p-4 bg-white">
                  <h3 className="font-bold text-sm sm:text-base mb-1 break-words text-black">{project.title}</h3>
                  {project.description && (
                    <p className="text-xs sm:text-sm text-gray-800 mb-2 line-clamp-2 font-semibold">
                      {project.description}
                    </p>
                  )}
                  {project.goal && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{
                            width: `${Math.min(
                              ((project.raised || 0) / project.goal) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <svg
                        className="w-6 h-6 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={`rounded-lg p-6 ${
          isOwnProfile 
            ? 'border-2 border-dashed border-gray-300 bg-gray-50' 
            : 'border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex flex-col items-center text-center">
            {!isOwnProfile && (
              <div className="space-y-2 mb-4 opacity-40">
                <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300" />
                <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300 ml-8" />
                <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300" />
              </div>
            )}
            {isOwnProfile && (
              <div className="space-y-2 mb-4">
                <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300" />
                <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300 ml-8" />
                <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300" />
              </div>
            )}
            <p className={`text-sm font-bold mb-3 ${
              isOwnProfile ? 'text-gray-800' : 'text-gray-600'
            }`}>
              {isOwnProfile 
                ? 'Showcase your projects and campaigns here.'
                : 'This creator hasn\'t added any projects yet. Follow them to be notified when they launch something new!'}
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm text-black"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Manage Projects
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isOwnProfile && (
        <HighlightsEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pinnedProject={pinnedProject}
          projects={projects}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

