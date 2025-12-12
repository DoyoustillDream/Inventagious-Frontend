'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projectsApi, type Project } from '@/lib/api/projects';
import { getFirstImage } from '@/lib/utils/imageUtils';

interface ProjectCarouselProps {
  maxProjects?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function ProjectCarousel({
  maxProjects = 10,
  autoPlay = true,
  autoPlayInterval = 5000,
}: ProjectCarouselProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch featured projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const data = await projectsApi.getFeatured();
        // If no featured projects, fallback to recommended
        const projectsToShow = data.length > 0 ? data : await projectsApi.getRecommended();
        setProjects(projectsToShow.slice(0, maxProjects));
      } catch (err: any) {
        console.error('Error fetching projects for carousel:', err);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [maxProjects]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || projects.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, projects.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  }, [projects.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  }, [projects.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString();
  };

  const formatBackers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const progress = (amountRaised: number, fundingGoal: number) => {
    return Math.min((amountRaised / fundingGoal) * 100, 100);
  };

  if (loading || error || projects.length === 0) {
    return null;
  }

  const currentProject = projects[currentIndex];
  const projectImage = getFirstImage(currentProject.imageUrl);
  const projectHref =
    currentProject.type === 'crowdfunding'
      ? `/campaigns/${currentProject.slug}`
      : `/projects/${currentProject.id}`;

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Navigation Arrows */}
      {projects.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black hover:bg-gray-800 border-4 border-black p-3 rounded-full transition-all hand-drawn shadow-lg -translate-x-4 md:-translate-x-6"
            aria-label="Previous project"
            type="button"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black hover:bg-gray-800 border-4 border-black p-3 rounded-full transition-all hand-drawn shadow-lg translate-x-4 md:translate-x-6"
            aria-label="Next project"
            type="button"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Single Project Display */}
      <Link href={projectHref}>
        <div className="browser-window overflow-hidden transition-all hover:scale-105 hover:shadow-lg">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
          </div>
          <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200">
            {projectImage ? (
              <Image
                src={projectImage}
                alt={currentProject.title}
                fill
                className="object-cover transition-transform duration-500"
                priority={currentIndex === 0}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl">💡</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="yellow-highlight hand-drawn inline-block px-3 py-1 text-xs font-bold">
                {formatBackers(currentProject.backersCount || 0)} supporters
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="hand-drawn mb-4 text-2xl md:text-3xl font-bold text-black line-clamp-2">
              {currentProject.title}
            </h3>
            <div className="mb-3">
              <div className="mb-3 h-3 overflow-hidden border-2 border-black bg-gray-200">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{
                    width: `${progress(
                      currentProject.amountRaised || 0,
                      currentProject.fundingGoal || 1,
                    )}%`,
                  }}
                />
              </div>
              <p className="hand-drawn text-base font-bold text-black">
                {formatAmount(currentProject.amountRaised || 0)} SOL raised of{' '}
                {formatAmount(currentProject.fundingGoal || 0)} SOL
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Dots Indicator */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                goToSlide(index);
              }}
              className={`transition-all rounded-full border-2 border-black ${
                index === currentIndex
                  ? 'bg-yellow-400 w-8 h-3'
                  : 'bg-white w-3 h-3 hover:bg-yellow-200'
              }`}
              aria-label={`Go to project ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
}

