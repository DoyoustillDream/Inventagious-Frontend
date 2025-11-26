'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '../ProjectCard';
import { projectsApi, type Project } from '@/lib/api/projects';

export default function FeaturedProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getFeatured();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load featured projects');
        console.error('Error fetching featured projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black">Loading featured projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="hand-drawn rounded-lg border-4 border-black bg-yellow-400 px-6 py-2 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <svg
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </div>
        <p className="hand-drawn text-xl font-bold text-black mb-2">
          No featured projects available yet
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Check back soon for exciting new featured projects!
        </p>
        <a
          href="/projects"
          className="hand-drawn inline-block rounded-lg border-4 border-black bg-yellow-400 px-6 py-2 text-base font-bold text-black transition-all duration-300 hover:bg-yellow-600 hover:scale-105 active:scale-95"
        >
          View All Projects
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}

