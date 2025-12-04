'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/api/projects';
import { type Profile } from '@/lib/api/profile';
import { apiClient } from '@/lib/api/client';

interface OrganizerSectionProps {
  project: Project;
}

// Helper function to format wallet address
function formatWalletAddress(address: string): string {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

export default function OrganizerSection({ project }: OrganizerSectionProps) {
  const [organizerProfile, setOrganizerProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      if (!project.userId) return;
      
      setIsLoadingProfile(true);
      try {
        // Try to fetch profile by userId (backend supports this)
        const profile = await apiClient.get<Profile>(`/profile/${project.userId}`).catch(() => null);
        if (profile) {
          setOrganizerProfile(profile);
        }
      } catch (error) {
        console.warn('Failed to fetch organizer profile:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchOrganizerProfile();
  }, [project.userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const creatorWalletAddress = project.userId || '';
  const organizerUsername = organizerProfile?.username;
  
  // Create mailto link - use project title in subject
  const getContactEmail = () => {
    const subject = encodeURIComponent(`Inquiry about ${project.title}`);
    const body = encodeURIComponent(`Hello,\n\nI'm interested in learning more about your project: ${project.title}\n\nBest regards`);
    // For now, we'll use a generic contact email. In the future, this could use organizerProfile data if available
    return `mailto:contact@inventagious.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="browser-window mb-6">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold text-center px-4">
          ORGANIZER
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6">
        <h2 className="hand-drawn text-xl font-bold text-black mb-4">Organizer</h2>
        
        <div className="flex items-start gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-gray-300 border-2 border-black flex items-center justify-center flex-shrink-0">
            {organizerProfile?.avatarUrl ? (
              <img
                src={organizerProfile.avatarUrl}
                alt={organizerProfile.displayName || organizerProfile.username}
                className="h-12 w-12 rounded-full border-2 border-black object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-2xl">👤</span>';
                  }
                }}
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>
          <div className="flex-1">
            {organizerUsername ? (
              <Link
                href={`/u/${organizerUsername}`}
                className="hand-drawn text-base font-bold text-black mb-1 hover:text-yellow-600 transition-colors cursor-pointer block"
                title={creatorWalletAddress}
              >
                {organizerProfile?.displayName || organizerProfile?.username || (creatorWalletAddress ? formatWalletAddress(creatorWalletAddress) : 'Unknown')}
              </Link>
            ) : (
              <div className="hand-drawn text-base font-bold text-black mb-1" title={creatorWalletAddress}>
                {creatorWalletAddress ? formatWalletAddress(creatorWalletAddress) : 'Unknown'}
              </div>
            )}
            <div className="text-sm text-gray-600 mb-1">Creator Wallet Address</div>
            {project.category && (
              <div className="text-sm text-gray-600">{project.category}</div>
            )}
          </div>
          <a
            href={getContactEmail()}
            className="hand-drawn rounded-lg border-4 border-black bg-white px-4 py-2 text-sm font-bold text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 active:scale-95"
          >
            Contact
          </a>
        </div>

        <div className="pt-4 border-t-2 border-gray-200">
          <ul className="space-y-2 text-sm text-gray-600 mb-4">
            <li>
              <span className="font-semibold">Created:</span>{' '}
              {formatDate(project.createdAt)}
            </li>
            {project.category && (
              <li>
                <span className="font-semibold">Category:</span>{' '}
                <a href={`/projects?category=${project.category}`} className="underline">
                  {project.category}
                </a>
              </li>
            )}
            <li>
              <span className="font-semibold">Type:</span>{' '}
              {project.type === 'crowdfunding' ? 'Crowdfunding' : 'Private Funding'}
            </li>
          </ul>
          
          {/* Social Media Links */}
          {(project.websiteUrl || project.twitterUrl || project.facebookUrl || 
            project.instagramUrl || project.linkedinUrl || project.youtubeUrl || 
            project.tiktokUrl) && (
            <div className="pt-3 border-t-2 border-gray-200">
              <h3 className="text-sm font-bold text-black mb-3">Connect & Follow</h3>
              <div className="flex flex-wrap gap-3">
                {project.websiteUrl && (
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="Website"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.797 3.556h2.94c-.124-1.414-.408-2.649-.797-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.97 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.033c.124 1.414.408 2.649.797 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.797-3.556zm-1.023 4c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946c-.124 1.414-.408 2.649-.797 3.556-.24.56-.5.948-.737 1.182-.233.23-.389.262-.465.262zm-2.003 2c.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.797-3.556h-1.946a6.004 6.004 0 00-.837 4.118c.454 1.147.748 2.572.837 4.118z" clipRule="evenodd" />
                    </svg>
                    <span>Website</span>
                  </a>
                )}
                
                {project.twitterUrl && (
                  <a
                    href={project.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="Twitter/X"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X</span>
                  </a>
                )}
                
                {project.facebookUrl && (
                  <a
                    href={project.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="Facebook"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </a>
                )}
                
                {project.instagramUrl && (
                  <a
                    href={project.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="Instagram"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </a>
                )}
                
                {project.linkedinUrl && (
                  <a
                    href={project.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="LinkedIn"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                )}
                
                {project.youtubeUrl && (
                  <a
                    href={project.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="YouTube"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>YouTube</span>
                  </a>
                )}
                
                {project.tiktokUrl && (
                  <a
                    href={project.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-sm font-bold text-black transition-all hover:bg-yellow-400 hover:scale-105 active:scale-95"
                    title="TikTok"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    <span>TikTok</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

