'use client';

import { useState, useEffect, useMemo } from 'react';
import ProjectCard from '../ProjectCard';
import ExploreFilters, { ProjectTypeFilter, ProjectStatusFilter } from './ExploreFilters';
import ExploreEmptyState from './ExploreEmptyState';
import { projectsApi, type Project } from '@/lib/api/projects';

export default function ExploreProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ProjectTypeFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const typeParam = selectedType !== 'all' ? selectedType : undefined;
        const statusParam = selectedStatus !== 'all' ? selectedStatus : undefined;
        const data = await projectsApi.getAll(typeParam, statusParam);
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [selectedType, selectedStatus]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Apply search filter
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
    return (
      <div className="text-center py-12">
        <p className="hand-drawn text-xl font-bold text-black">Loading projects...</p>
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

  return (
    <>
      <ExploreFilters
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        searchQuery={searchQuery}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        onSearchChange={setSearchQuery}
        totalCount={projects.length}
        filteredCount={filteredProjects.length}
      />
      {filteredProjects.length === 0 ? (
        <ExploreEmptyState
          selectedType={selectedType}
          selectedStatus={selectedStatus}
          searchQuery={searchQuery}
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </>
  );
}

