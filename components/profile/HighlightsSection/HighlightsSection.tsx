'use client';

import Link from 'next/link';
import Image from 'next/image';

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
}

export default function HighlightsSection({
  pinnedProject,
  projects = [],
  isOwnProfile = false,
}: HighlightsSectionProps) {
  const hasPinned = !!pinnedProject;
  const hasProjects = projects && projects.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="hand-drawn text-2xl font-bold text-black">Highlights</h2>
        {isOwnProfile && (
          <Link
            href="/profile/edit/highlights"
            className="p-1.5 border-2 border-black rounded-md hover:bg-yellow-200 transition-colors"
            aria-label="Edit highlights"
          >
            <svg
              className="w-5 h-5"
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
          </Link>
        )}
      </div>

      {/* Pinned Project */}
      {hasPinned ? (
        <Link
          href={`/projects/${pinnedProject.slug || pinnedProject.id}`}
          className="block border-2 border-black rounded-lg overflow-hidden mb-4 hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 bg-yellow-100">
            {pinnedProject.imageUrl ? (
              <Image
                src={pinnedProject.imageUrl}
                alt={pinnedProject.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-black rounded-full bg-yellow-200 flex items-center justify-center">
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
          <div className="p-4 bg-white">
            <h3 className="font-bold text-lg mb-1">{pinnedProject.title}</h3>
            {pinnedProject.description && (
            <p className="text-sm text-gray-800 mb-2 line-clamp-2 font-semibold">
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
        <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 border-2 border-black rounded-full bg-yellow-200 flex items-center justify-center mb-3">
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
            <p className="text-sm text-gray-800 font-bold mb-3">
              Highlight a project or campaign by <br /> pinning it here.
            </p>
            {isOwnProfile && (
              <Link
                href="/profile/edit/highlights"
                className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm"
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
                Add pin
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Other Projects */}
      {hasProjects ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug || project.id}`}
              className="block border-2 border-black rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                <div className="relative w-32 h-32 flex-shrink-0 bg-yellow-100">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
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
                <div className="flex-1 p-4 bg-white">
                  <h3 className="font-bold text-base mb-1">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-800 mb-2 line-clamp-2 font-semibold">
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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="flex flex-col items-center text-center">
            <div className="space-y-2 mb-4">
              <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300" />
              <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300 ml-8" />
              <div className="w-24 h-16 bg-gray-200 rounded border-2 border-gray-300" />
            </div>
            <p className="text-sm text-gray-800 font-bold mb-3">
              Start adding projects and campaigns that matter to you.
            </p>
            {isOwnProfile && (
              <Link
                href="/profile/edit/highlights"
                className="inline-flex items-center px-3 py-1.5 border-2 border-black bg-white hover:bg-yellow-200 transition-colors rounded-md font-bold text-sm"
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
                Add links
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

