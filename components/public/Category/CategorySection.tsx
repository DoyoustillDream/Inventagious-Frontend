'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '../ProjectCard';
import { projectsApi } from '@/lib/api/projects';
import type { Project } from '@/lib/api/projects';

interface CategorySectionProps {
  categoryName: string;
  categorySlug: string;
  limit?: number;
}

export default function CategorySection({ 
  categoryName, 
  categorySlug,
  limit = 3 
}: CategorySectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await projectsApi.getAll();
        // Filter by category (case-insensitive)
        const filtered = data
          .filter(p => p.category?.toLowerCase() === categorySlug.toLowerCase())
          .slice(0, limit);
        setProjects(filtered);
      } catch (err) {
        console.error(`Error fetching ${categoryName} projects:`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [categorySlug, categoryName, limit]);

  if (loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="hand-drawn mb-6 text-3xl font-bold text-black">
            {categoryName} Projects
          </h2>
          <div className="text-center py-8">
            <p className="hand-drawn text-lg font-bold text-gray-600">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="hand-drawn mb-6 text-3xl font-bold text-black">
          {categoryName} Projects
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
        <div className="flex justify-end">
          <Link
            href={`/explore?category=${categorySlug}`}
            className="hand-drawn inline-flex items-center gap-2 rounded-lg border-2 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
            data-element-id={`see-more-${categorySlug}`}
          >
            See more
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

