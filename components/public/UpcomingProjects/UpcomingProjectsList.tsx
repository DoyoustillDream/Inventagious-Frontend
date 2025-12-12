'use client';

import { useState, useEffect, useMemo } from 'react';
import { projectsApi, Project } from '@/lib/api/projects';
import UpcomingProjectCard from './UpcomingProjectCard';
import UpcomingProjectsSkeleton from './UpcomingProjectsSkeleton';

export default function UpcomingProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchUpcomingProjects() {
      try {
        setLoading(true);
        setError(null);
        const category = selectedCategory !== 'all' ? selectedCategory : undefined;
        const data = await projectsApi.getUpcoming(undefined, category);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load upcoming projects');
        console.error('Error fetching upcoming projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingProjects();
  }, [selectedCategory]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [projects, searchQuery]);

  if (loading) {
    return <UpcomingProjectsSkeleton />;
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

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black mb-4">No upcoming projects</p>
        <p className="text-gray-600">Check back soon for new projects launching!</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search upcoming projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border-4 border-black rounded-lg font-bold text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <UpcomingProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}

