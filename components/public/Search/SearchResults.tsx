'use client';

import { useEffect, useState } from 'react';
import ProjectCard from '../ProjectCard';
import { projectsApi, type Project } from '@/lib/api/projects';

interface SearchResultsProps {
  query: string;
  activeTab: 'trending' | 'near-you';
}

export default function SearchResults({ query, activeTab }: SearchResultsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function searchProjects() {
      if (!query.trim()) {
        // If no query, show all projects
        try {
          setLoading(true);
          setError(null);
          const data = await projectsApi.getAll();
          setProjects(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
          console.error('Error fetching projects:', err);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.search(query.trim());
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search projects');
        console.error('Error searching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    searchProjects();
  }, [query]);

  // For "Near you" tab, you could filter by location
  // For "Trending" tab, you could sort by popularity/trending metrics
  const displayProjects =
    activeTab === 'trending'
      ? [...projects].sort((a, b) => b.backersCount - a.backersCount)
      : projects;

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black">Searching projects...</p>
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

  if (displayProjects.length === 0) {
    return (
      <div className="browser-window bg-white">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <div className="yellow-highlight hand-drawn text-xs font-bold">
            NO RESULTS
          </div>
          <div className="flex-1" />
        </div>
        <div className="p-8 md:p-12 text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-20 w-20 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-3">
            No projects found
          </p>
          <p className="hand-drawn text-base font-semibold text-gray-700 mb-8">
            {query.trim() 
              ? `No results for "${query}". Try adjusting your search terms.`
              : 'Try searching for campaigns, projects, or categories.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/campaigns"
              className="hand-drawn border-4 border-black bg-yellow-400 px-6 py-3 text-base font-bold text-black transition-all hover:bg-yellow-600 hover:scale-105 active:scale-95"
            >
              Browse Campaigns
            </a>
            <a
              href="/deals"
              className="hand-drawn border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
            >
              Browse Private Funding
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {/* Show More Button */}
      {displayProjects.length >= 6 && (
        <div className="mt-8 text-center">
          <button className="hand-drawn rounded-lg border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400">
            Show more
          </button>
        </div>
      )}
    </div>
  );
}

