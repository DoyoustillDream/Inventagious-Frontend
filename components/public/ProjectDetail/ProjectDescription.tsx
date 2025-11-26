'use client';

import { useState } from 'react';
import { Project } from '@/lib/api/projects';

interface ProjectDescriptionProps {
  project: Project;
}

export default function ProjectDescription({ project }: ProjectDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const description = project.description || 'No description provided.';
  const shouldTruncate = description.length > 300;

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
          STORY
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6">
        <div className="mb-4">
          {shouldTruncate && !isExpanded ? (
            <>
              <p className="text-base font-semibold text-gray-800 leading-relaxed">
                {description.substring(0, 300)}...
              </p>
              <button
                onClick={() => setIsExpanded(true)}
                className="hand-drawn mt-2 text-sm font-bold text-black underline"
              >
                Read more
              </button>
            </>
          ) : (
            <p className="text-base font-semibold text-gray-800 leading-relaxed whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

