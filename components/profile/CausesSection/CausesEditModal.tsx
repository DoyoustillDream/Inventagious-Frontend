'use client';

import { useEffect, useState } from 'react';
import { profileApi, Cause } from '@/lib/api/profile';
import { useToast } from '@/components/shared/Toast';

interface CausesEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCauses?: Cause[];
  onUpdate: (causes: Cause[]) => void;
}

export default function CausesEditModal({
  isOpen,
  onClose,
  currentCauses = [],
  onUpdate,
}: CausesEditModalProps) {
  const [selectedCauses, setSelectedCauses] = useState<Set<string>>(
    new Set(currentCauses.map((c) => c.id))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [availableCauses, setAvailableCauses] = useState<Cause[]>([]);
  const [isLoadingCauses, setIsLoadingCauses] = useState(false);
  const { showSuccess, showError } = useToast();

  // Load available causes on mount
  useEffect(() => {
    const loadCauses = async () => {
      setIsLoadingCauses(true);
      try {
        const causes = await profileApi.getAvailableCauses();
        setAvailableCauses(causes);
      } catch (error) {
        console.error('Error loading causes:', error);
        showError('Failed to load available causes');
      } finally {
        setIsLoadingCauses(false);
      }
    };

    if (isOpen) {
      loadCauses();
    }
  }, [isOpen, showError]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCauses(new Set(currentCauses.map((c) => c.id)));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentCauses]);

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

  const handleToggleCause = (causeId: string) => {
    setSelectedCauses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(causeId)) {
        newSet.delete(causeId);
      } else {
        newSet.add(causeId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const causeIds = Array.from(selectedCauses);
      const updatedCauses = await profileApi.updateUserCauses(causeIds);
      
      onUpdate(updatedCauses);
      showSuccess('Causes updated successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error saving causes:', error);
      showError(error?.message || 'Failed to save causes');
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
      <div className="browser-window max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="browser-header">
          <div className="browser-controls">
            <div className="browser-dot red" />
            <div className="browser-dot yellow" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <h2 className="hand-drawn text-lg font-bold text-black">Edit Causes</h2>
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
          <p className="text-xs sm:text-sm text-gray-700 mb-4">
            Select the causes you support. These will be displayed on your profile.
          </p>

          {/* Causes Grid */}
          {isLoadingCauses ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-600">Loading causes...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6 max-h-96 overflow-y-auto">
              {availableCauses.map((cause) => {
              const isSelected = selectedCauses.has(cause.id);
              return (
                <button
                  key={cause.id}
                  onClick={() => handleToggleCause(cause.id)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 border-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'border-black bg-yellow-200 text-black'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {isSelected && (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-black"
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
                    )}
                    <span>{cause.name}</span>
                  </div>
                </button>
              );
            })}
            </div>
          )}

          {/* Selected Count */}
          <div className="mb-4 p-3 bg-gray-50 border-2 border-gray-200 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700 font-bold text-center">
              {selectedCauses.size === 0
                ? 'No causes selected'
                : `${selectedCauses.size} cause${selectedCauses.size === 1 ? '' : 's'} selected`}
            </p>
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

