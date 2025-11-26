'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FeaturedProjectCard from './FeaturedProjectCard';
import { projectsApi } from '@/lib/api/projects';
import type { Project } from '@/lib/api/projects';

interface CategoryConfig {
  name: string;
  slug: string;
  displayName: string;
}

const featuredCategories: CategoryConfig[] = [
  { name: 'Web3', slug: 'web3', displayName: 'Web3 Projects' },
  { name: 'Solana', slug: 'solana', displayName: 'Solana Projects' },
  { name: 'Hardware', slug: 'hardware', displayName: 'Hardware Projects' },
  { name: 'Software', slug: 'software', displayName: 'Software Projects' },
  { name: 'Blockchain', slug: 'blockchain', displayName: 'Blockchain Projects' },
  { name: 'Innovation', slug: 'innovation', displayName: 'Innovation Projects' },
];

interface CategoryProjects {
  category: CategoryConfig;
  projects: Project[];
}

export default function FeaturedProjectsByCategory() {
  const [categoryProjects, setCategoryProjects] = useState<CategoryProjects[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    async function fetchProjectsByCategory() {
      try {
        setLoading(true);
        const allProjects = await projectsApi.getAll();
        
        const projectsByCategory: CategoryProjects[] = featuredCategories.map((category) => {
          const filtered = allProjects
            .filter(
              (p) =>
                p.category?.toLowerCase() === category.slug.toLowerCase() &&
                p.status === 'active'
            )
            .slice(0, 3); // Show max 3 projects per category
          
          return {
            category,
            projects: filtered,
          };
        });

        setCategoryProjects(projectsByCategory);
      } catch (err) {
        console.error('Error fetching projects by category:', err);
        setCategoryProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectsByCategory();
  }, []);

  const displayedCategories = showAllCategories
    ? categoryProjects
    : categoryProjects.filter((cp) => cp.projects.length > 0).slice(0, 3);

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="hand-drawn text-lg font-bold text-gray-600">
              Loading featured projects...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if there are no projects at all
  if (categoryProjects.every((cp) => cp.projects.length === 0)) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="hand-drawn text-lg font-bold text-gray-600 mb-4">
              No featured projects available yet.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon for exciting new projects!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        {displayedCategories.map(({ category, projects }) => {
          // Skip categories with no projects
          if (projects.length === 0) return null;

          return (
            <div key={category.slug} className="mb-12 last:mb-0">
              <h2 className="hand-drawn mb-6 text-2xl font-bold text-black">
                {category.displayName}
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-4">
                {projects.map((project) => (
                  <FeaturedProjectCard key={project.id} project={project} />
                ))}
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/explore?category=${category.slug}`}
                  className="hand-drawn inline-flex items-center gap-2 rounded-lg border-2 border-black bg-white px-6 py-2 text-base font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
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
          );
        })}

        {categoryProjects.filter((cp) => cp.projects.length > 0).length > 3 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="hand-drawn rounded-lg border-2 border-black bg-white px-8 py-3 text-base font-bold text-black transition hover:bg-yellow-400 hover:scale-105 active:scale-95"
              type="button"
            >
              {showAllCategories ? 'Show less categories' : 'Show more categories'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

