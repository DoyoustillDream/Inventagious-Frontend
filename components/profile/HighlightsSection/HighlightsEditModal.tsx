'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/api/projects';
import { useToast } from '@/components/shared/Toast/ToastProvider';
import { getFirstImage } from '@/lib/utils/imageUtils';

interface HighlightedProject {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  goal?: number;
  raised?: number;
  slug?: string;
}

interface HighlightsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedProject?: HighlightedProject;
  projects?: HighlightedProject[];
  onUpdate: (pinnedProject?: HighlightedProject, projects?: HighlightedProject[]) => void;
}

export default function HighlightsEditModal({
  isOpen,
  onClose,
  pinnedProject,
  projects = [],
  onUpdate,
}: HighlightsEditModalProps) {
  // Helper function to extract the first image URL from various formats
  const getImageUrl = (imageUrl?: string | string[]): string | undefined => {
    if (!imageUrl) return undefined;
    if (typeof imageUrl === 'string') {
      return getFirstImage(imageUrl);
    }
    if (Array.isArray(imageUrl)) {
      return imageUrl[0];
    }
    return undefined;
  };

  const [selectedPinned, setSelectedPinned] = useState<string | null>(
    pinnedProject?.id || null
  );
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(projects.map((p) => p.id))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedPinned(pinnedProject?.id || null);
      setSelectedProjects(new Set(projects.map((p) => p.id)));
      document.body.style.overflow = 'hidden';
      loadProjects();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, pinnedProject, projects]);

  const loadProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const userProjects = await projectsApi.getMyProjects();
      setAvailableProjects(userProjects);
    } catch (err: any) {
      console.error('Error loading projects:', err);
      showError('Failed to load projects');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleTogglePinned = (projectId: string) => {
    if (selectedPinned === projectId) {
      setSelectedPinned(null);
    } else {
      setSelectedPinned(projectId);
      // If pinning a project, also add it to the list if not already there
      setSelectedProjects((prev) => new Set([...prev, projectId]));
    }
  };

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
        // If unpinning, also remove from pinned
        if (selectedPinned === projectId) {
          setSelectedPinned(null);
        }
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API calls
      // For now, we'll simulate the update
      const updatedPinned = selectedPinned
        ? { id: selectedPinned, title: 'Project', description: '', imageUrl: '' }
        : undefined;
      const updatedProjects = Array.from(selectedProjects).map((id) => ({
        id,
        title: 'Project',
        description: '',
        imageUrl: '',
      }));

      onUpdate(updatedPinned as HighlightedProject, updatedProjects as HighlightedProject[]);
      onClose();
    } catch (error) {
      console.error('Error saving highlights:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="browser-window max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">Edit Highlights</h2>
          <div className="flex-1" />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold transition-colors hover:bg-gray-200 rounded px-1 py-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-white overflow-y-auto flex-1">
          {/* Pinned Project Section */}
          <div className="mb-6">
            <h3 className="hand-drawn text-base sm:text-lg font-bold text-black mb-3">
              Pinned Project
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-4">
              Select one project to feature prominently at the top of your highlights.
            </p>
            {availableProjects.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
                <p className="text-sm text-gray-600 font-bold">
                  No projects available. Create a project first to pin it.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleTogglePinned(project.id)}
                    className={`w-full border-2 rounded-lg overflow-hidden transition-all text-left ${
                      selectedPinned === project.id
                        ? 'border-black bg-yellow-100'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-yellow-100 rounded">
                        {getImageUrl(project.imageUrl) ? (
                          <Image
                            src={getImageUrl(project.imageUrl)!}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl font-bold text-black">
                            {project.title[0]?.toUpperCase() || 'P'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-black truncate">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {selectedPinned === project.id ? (
                          <div className="w-6 h-6 border-2 border-black rounded-full bg-yellow-400 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-black"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Other Projects Section */}
          <div className="mb-6">
            <h3 className="hand-drawn text-base sm:text-lg font-bold text-black mb-3">
              Other Highlights
            </h3>
            <p className="text-xs sm:text-sm text-gray-700 mb-4">
              Select additional projects to showcase in your highlights section.
            </p>
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-gray-600">Loading projects...</div>
              </div>
            ) : availableProjects.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 text-center">
                <p className="text-sm text-gray-600 font-bold mb-3">
                  No projects available. Create projects to add them here.
                </p>
                <Link
                  href="/projects/create"
                  className="inline-flex items-center px-4 py-2 border-2 border-black bg-yellow-200 hover:bg-yellow-300 rounded-md font-bold text-sm text-black transition"
                >
                  Create Project
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleToggleProject(project.id)}
                    className={`w-full border-2 rounded-lg overflow-hidden transition-all text-left ${
                      selectedProjects.has(project.id)
                        ? 'border-black bg-yellow-100'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-yellow-100 rounded">
                        {getImageUrl(project.imageUrl) ? (
                          <Image
                            src={getImageUrl(project.imageUrl)!}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-black">
                            {project.title[0]?.toUpperCase() || 'P'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-black truncate">
                          {project.title}
                        </h4>
                        {project.description && (
                          <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {selectedProjects.has(project.id) ? (
                          <div className="w-5 h-5 border-2 border-black rounded bg-yellow-400 flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-black"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t-2 border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border-2 border-black bg-white hover:bg-gray-100 rounded-md font-bold text-sm sm:text-base text-black transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 border-2 border-black bg-yellow-400 hover:bg-yellow-500 rounded-md font-bold text-sm sm:text-base text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

