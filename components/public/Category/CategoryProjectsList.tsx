'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '../ProjectCard/ProjectCard';
import { projectsApi } from '@/lib/api/projects';
import type { Project } from '@/lib/api/projects';
import { getCategoryName } from '@/lib/categories';

interface CategoryProjectsListProps {
  categorySlug: string;
}

export default function CategoryProjectsList({ categorySlug }: CategoryProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getRecommended(categorySlug);
        setProjects(data);
      } catch (err) {
        console.error(`Error fetching ${categorySlug} projects:`, err);
        setError('Failed to load projects. Please try again later.');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [categorySlug]);

  const categoryName = getCategoryName(categorySlug);

  if (loading) {
    return (
      <section className="halftone-gray py-12">
        <div className="container mx-auto px-4">
          <h2 className="hand-drawn mb-6 text-3xl font-bold text-black">
            {categoryName} Projects
          </h2>
          <div className="text-center py-12">
            <p className="hand-drawn text-lg font-bold text-gray-600">
              Loading projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="halftone-gray py-12">
        <div className="container mx-auto px-4">
          <h2 className="hand-drawn mb-6 text-3xl font-bold text-black">
            {categoryName} Projects
          </h2>
          <div className="text-center py-12">
            <p className="hand-drawn text-lg font-bold text-red-600 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="hand-drawn rounded-lg border-2 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="halftone-gray py-12">
        <div className="container mx-auto px-4">
          <h2 className="hand-drawn mb-6 text-3xl font-bold text-black">
            {categoryName} Projects
          </h2>
          <div className="text-center py-12">
            <p className="hand-drawn text-lg font-bold text-gray-600 mb-4">
              No {categoryName.toLowerCase()} projects available yet.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Check back soon for exciting new projects in this category!
            </p>
            <Link
              href="/category"
              className="hand-drawn inline-block rounded-lg border-2 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
            >
              Browse All Categories
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="halftone-gray py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="hand-drawn text-3xl font-bold text-black">
            {categoryName} Projects
          </h2>
          <span className="hand-drawn text-lg font-bold text-gray-600">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Link
            href="/explore"
            className="hand-drawn inline-block rounded-lg border-2 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
          >
            Explore All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}

