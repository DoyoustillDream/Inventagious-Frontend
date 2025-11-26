'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projectsApi, type Project } from '@/lib/api/projects';
import { getFirstImage } from '@/lib/utils/imageUtils';

const filterOptions = [
  { value: 'all', label: 'All Projects' },
  { value: 'worldwide', label: 'Happening worldwide' },
  { value: 'web3', label: 'Web3 & Blockchain' },
  { value: 'hardware', label: 'Hardware Inventions' },
  { value: 'software', label: 'Software Solutions' },
];

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const projectsPerPage = 4;

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Fetch projects when filter changes
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const category = selectedFilter === 'all' ? undefined : selectedFilter;
        const data = await projectsApi.getRecommended(category);
        setProjects(data);
        setCurrentPage(0); // Reset to first page when filter changes
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
        console.error('Error fetching recommended projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [selectedFilter]);

  const featuredProject = projects.length > 0 ? projects[0] : null;
  const otherProjects = projects.slice(1);
  const totalPages = Math.ceil(otherProjects.length / projectsPerPage);
  const startIndex = currentPage * projectsPerPage;
  const displayedProjects = otherProjects.slice(startIndex, startIndex + projectsPerPage);

  const formatBackers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const progress = (amountRaised: number, fundingGoal: number) => {
    return Math.min((amountRaised / fundingGoal) * 100, 100);
  };

  if (loading) {
    return (
      <section className="halftone-gray py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
              Discover projects inspired by what you care about
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="hand-drawn text-xl font-bold text-black">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="halftone-gray py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
              Discover projects inspired by what you care about
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="hand-drawn text-xl font-bold text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="halftone-gray py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
              Discover projects inspired by what you care about
            </h2>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="hand-drawn flex items-center gap-2 rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400"
                  type="button"
                >
                  {filterOptions.find((opt) => opt.value === selectedFilter)?.label ||
                    'All Projects'}
                  <span className="text-sm">▼</span>
                </button>
                {isFilterOpen && (
                  <div className="absolute left-0 top-full z-20 mt-2 w-64 border-4 border-black bg-white">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`hand-drawn w-full px-6 py-3 text-left text-base font-bold transition ${
                          selectedFilter === option.value
                            ? 'bg-yellow-400 text-black'
                            : 'text-black hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="hand-drawn text-xl font-bold text-black">
              No projects found. Check back later for new projects!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="halftone-gray py-20">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
            Discover projects inspired by what you care about
          </h2>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Filter Selector */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="hand-drawn flex items-center gap-2 rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400"
                type="button"
              >
                {filterOptions.find((opt) => opt.value === selectedFilter)?.label ||
                  'All Projects'}
                <span className="text-sm">▼</span>
              </button>
              {isFilterOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-64 border-4 border-black bg-white">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedFilter(option.value);
                        setIsFilterOpen(false);
                      }}
                      className={`hand-drawn w-full px-6 py-3 text-left text-base font-bold transition ${
                        selectedFilter === option.value
                          ? 'bg-yellow-400 text-black'
                          : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {otherProjects.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="border-4 border-black bg-white px-4 py-2 hand-drawn text-sm font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  type="button"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                  className="border-4 border-black bg-white px-4 py-2 hand-drawn text-sm font-bold text-black transition hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  type="button"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
          {/* Featured Project - Large Card */}
          {featuredProject && (
            <div className="lg:col-span-1">
              <Link href={featuredProject.type === 'crowdfunding' ? `/campaigns/${featuredProject.slug}` : `/projects/${featuredProject.id}`}>
                <div className="browser-window overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                  <div className="browser-header">
                    <div className="browser-controls">
                      <div className="browser-dot red" />
                      <div className="browser-dot yellow" />
                      <div className="browser-dot green" />
                    </div>
                  </div>
                  <div className="relative h-96 w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200">
                    {featuredProject.imageUrl ? (
                      <Image
                        src={featuredProject.imageUrl}
                        alt={featuredProject.title}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="yellow-highlight hand-drawn inline-block px-4 py-2 text-base font-bold">
                        {formatBackers(featuredProject.backersCount || 0)} supporters
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="hand-drawn mb-3 block text-sm font-bold text-gray-600 md:hidden">
                      {formatBackers(featuredProject.backersCount || 0)} supporters
                    </span>
                    <h3 className="hand-drawn mb-4 text-2xl md:text-3xl font-bold text-black">
                      {featuredProject.title}
                    </h3>
                    <div className="mb-4">
                      <div className="mb-3 h-3 overflow-hidden border-2 border-black bg-gray-200">
                        <div
                          className="h-full bg-yellow-400 transition-all"
                          style={{
                            width: `${progress(
                              featuredProject.amountRaised || 0,
                              featuredProject.fundingGoal || 1,
                            )}%`,
                          }}
                        />
                      </div>
                      <label className="hand-drawn text-base font-bold text-black">
                        {formatAmount(featuredProject.amountRaised || 0)} SOL raised
                      </label>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Other Projects - Grid */}
          {displayedProjects.length > 0 ? (
            <div className="lg:col-span-2">
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {displayedProjects.map((project) => (
                  <li key={project.id}>
                    <Link href={project.type === 'crowdfunding' ? `/campaigns/${project.slug}` : `/projects/${project.id}`}>
                      <div className="browser-window overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
                        <div className="browser-header">
                          <div className="browser-controls">
                            <div className="browser-dot red" />
                            <div className="browser-dot yellow" />
                            <div className="browser-dot green" />
                          </div>
                        </div>
                        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200">
                          {getFirstImage(project.imageUrl) ? (
                            <Image
                              src={getFirstImage(project.imageUrl)!}
                              alt={project.title}
                              fill
                              className="object-cover"
                            />
                          ) : null}
                          <div className="absolute bottom-3 left-3 right-3">
                            <span className="yellow-highlight hand-drawn inline-block px-2 py-1 text-xs font-bold">
                              {formatBackers(project.backersCount || 0)} supporters
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <span className="hand-drawn mb-2 block text-xs font-bold text-gray-600 md:hidden">
                            {formatBackers(project.backersCount || 0)} supporters
                          </span>
                          <h3 className="hand-drawn mb-3 text-lg font-bold text-black line-clamp-2">
                            {project.title}
                          </h3>
                          <div className="mb-2">
                            <div className="mb-1 h-2 overflow-hidden border-2 border-black bg-gray-200">
                              <div
                                className="h-full bg-yellow-400 transition-all"
                                style={{
                                  width: `${progress(
                                    project.amountRaised || 0,
                                    project.fundingGoal || 1,
                                  )}%`,
                                }}
                              />
                            </div>
                            <label className="hand-drawn text-xs font-bold text-black">
                              {formatAmount(project.amountRaised || 0)} SOL raised
                            </label>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : featuredProject ? (
            <div className="lg:col-span-2" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
