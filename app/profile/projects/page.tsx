'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ProfileHeader from '@/components/profile/ProfileHeader/ProfileHeader';
import { profileApi, Profile } from '@/lib/api/profile';
import { projectsApi, Project } from '@/lib/api/projects';
import { useAuth } from '@/components/auth/AuthProvider';
import Image from 'next/image';

export default function ProfileProjectsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileData, projectsData] = await Promise.all([
        profileApi.getMyProfile().catch(() => null),
        projectsApi.getMyProjects().catch(() => []),
      ]);

      setProfile(profileData);
      setProjects(projectsData || []);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const formatSolanaAmount = (lamports: number) => {
    return (lamports / 1e9).toFixed(2);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ProfileHeader profile={profile || undefined} />
      <main id="main-content" className="flex-1 bg-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <div className="mb-6 pb-4 border-b-4 border-black">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h1 className="hand-drawn text-3xl md:text-4xl font-bold text-black">
                My Projects
              </h1>
              <Link
                href="/projects/create"
                className="hand-drawn px-6 py-3 border-4 border-black bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-base text-black transition"
              >
                + Create New Project
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin mx-auto w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-4"></div>
                <p className="text-sm font-bold text-gray-700">Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-4 border-red-500 rounded-lg p-6">
              <p className="text-sm font-bold text-red-800">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border-4 border-black rounded-lg shadow-lg p-12 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto w-24 h-24 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2 className="hand-drawn text-2xl font-bold text-black mb-4">
                No projects yet
              </h2>
              <p className="text-gray-700 font-semibold mb-6">
                Start your first project and bring your innovation to life!
              </p>
              <Link
                href="/projects/create"
                className="hand-drawn inline-block px-6 py-3 border-4 border-black bg-yellow-400 hover:bg-yellow-500 rounded-lg font-bold text-base text-black transition"
              >
                Create Your First Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const projectHref = project.type === 'crowdfunding' 
                  ? `/campaigns/${project.slug}` 
                  : `/projects/${project.id}`;
                const progress = project.fundingGoal > 0 
                  ? (project.amountRaised / project.fundingGoal) * 100 
                  : 0;

                return (
                  <Link
                    key={project.id}
                    href={projectHref}
                    className="bg-white border-4 border-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    {/* Project Image */}
                    <div className="relative w-full h-48 bg-gradient-to-br from-yellow-400 to-yellow-300">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-6xl font-bold text-black opacity-20">
                            {project.title[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="hand-drawn px-3 py-1 bg-white border-3 border-black rounded-full text-xs font-bold text-black">
                          {project.type === 'crowdfunding' ? 'Crowdfunding' : 'Private'}
                        </span>
                      </div>
                    </div>

                    {/* Project Info */}
                    <div className="p-6">
                      <h3 className="hand-drawn text-xl font-bold text-black mb-3 line-clamp-2">
                        {project.title}
                      </h3>
                      
                      {project.description && (
                        <p className="text-sm text-gray-700 font-semibold mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-black">
                            {formatSolanaAmount(project.amountRaised)} SOL
                          </span>
                          <span className="text-sm font-bold text-gray-600">
                            of {formatSolanaAmount(project.fundingGoal)} SOL
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 border-2 border-black rounded-full h-4 overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span className="text-black">
                          {project.backersCount} {project.backersCount === 1 ? 'backer' : 'backers'}
                        </span>
                        <span className={`px-3 py-1 rounded-full ${
                          project.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-2 border-green-600' 
                            : 'bg-gray-100 text-gray-800 border-2 border-gray-600'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

