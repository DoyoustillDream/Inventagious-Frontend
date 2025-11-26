'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '../ProjectCard';
import ProjectFilters from './ProjectFilters';
import EmptyState from './EmptyState';
import { projectsApi, type Project } from '@/lib/api/projects';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'crowdfunding' | 'private_funding'>('all');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getAll();
        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.type === selectedType));
    }
  }, [selectedType, projects]);

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
      <ProjectFilters 
        selectedType={selectedType} 
        onTypeChange={setSelectedType}
        totalCount={projects.length}
        filteredCount={filteredProjects.length}
      />
      {filteredProjects.length === 0 ? (
        <EmptyState selectedType={selectedType} />
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

