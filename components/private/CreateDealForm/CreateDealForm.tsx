'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi, CreateProjectData } from '@/lib/api/projects';
import DealBasicInfo from './DealBasicInfo';
import ProjectFundingInfo from '../CreateProjectForm/ProjectFundingInfo';
import ProjectMediaInfo from '../CreateProjectForm/ProjectMediaInfo';

const TOTAL_STEPS = 3;

export default function CreateDealForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    type: 'private_funding', // Always private_funding for deals
    fundingGoal: 0,
    category: '',
    imageUrl: '',
    videoUrl: '',
    deadline: '',
    solanaAddress: '',
    isPublic: false, // Private funding is typically not public
  });

  const validateStep = (step: number): boolean => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          setError('Project title is required');
          return false;
        }
        if (!formData.description?.trim()) {
          setError('Project description is required');
          return false;
        }
        if (!formData.category) {
          setError('Category is required');
          return false;
        }
        return true;
      
      case 2:
        if (formData.fundingGoal <= 0) {
          setError('Funding goal must be greater than 0');
          return false;
        }
        if (!formData.solanaAddress?.trim()) {
          setError('Solana wallet address is required');
          return false;
        }
        return true;
      
      case 3:
        if (!formData.imageUrl?.trim()) {
          setError('At least one project image is required');
          return false;
        }
        // Validate that imageUrl is not an empty JSON array
        try {
          const parsed = JSON.parse(formData.imageUrl);
          if (Array.isArray(parsed) && parsed.length === 0) {
            setError('At least one project image is required');
            return false;
          }
        } catch {
          // Not a JSON array, single image is fine
        }
        return true;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up empty optional fields
      const submitData: CreateProjectData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        type: 'private_funding', // Always private_funding
        fundingGoal: formData.fundingGoal,
        category: formData.category || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
        videoUrl: formData.videoUrl?.trim() || undefined,
        deadline: formData.deadline || undefined,
        solanaAddress: formData.solanaAddress?.trim() || undefined,
        isPublic: formData.isPublic ?? false, // Default to private
      };

      const project = await projectsApi.create(submitData);
      
      // Redirect to the deal page
      router.push(`/deals/${project.id}`);
    } catch (err: any) {
      console.error('Error creating private funding project:', err);
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof CreateProjectData>(
    field: K,
    value: CreateProjectData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Basic Information';
      case 2:
        return 'Funding Details';
      case 3:
        return 'Media & Visuals';
      default:
        return 'Create Private Funding Project';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Tell us about your project';
      case 2:
        return 'Set your funding goals';
      case 3:
        return 'Add images and videos';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="browser-window">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          STEP {currentStep} OF {TOTAL_STEPS}
        </div>
        <div className="flex-1" />
      </div>

      <div className="p-6 md:p-8 lg:p-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4 max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex-shrink-0 w-12 h-12 border-4 border-black rounded-full flex items-center justify-center transition-all ${
                    step <= currentStep
                      ? 'bg-yellow-400'
                      : 'bg-white'
                  }`}
                >
                  <span className="hand-drawn text-xl font-bold text-black">
                    {step < currentStep ? '✓' : step}
                  </span>
                </div>
                {step < TOTAL_STEPS && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-yellow-400' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mb-6">
            <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black mb-2">
              {getStepTitle()}
            </h2>
            <p className="hand-drawn text-base font-semibold text-gray-700">
              {getStepDescription()}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 browser-window border-red-500 bg-red-50">
            <div className="p-4">
              <p className="hand-drawn text-base font-bold text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <DealBasicInfo
              title={formData.title}
              description={formData.description || ''}
              category={formData.category || ''}
              onUpdate={updateField}
            />
          )}

          {currentStep === 2 && (
            <ProjectFundingInfo
              fundingGoal={formData.fundingGoal}
              deadline={formData.deadline || ''}
              solanaAddress={formData.solanaAddress || ''}
              isPublic={formData.isPublic ?? false}
              onUpdate={updateField}
            />
          )}

          {currentStep === 3 && (
            <ProjectMediaInfo
              imageUrl={formData.imageUrl || ''}
              videoUrl={formData.videoUrl || ''}
              onUpdate={updateField}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t-4 border-black">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="hand-drawn border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              ← Previous
            </button>
          )}

          <div className="flex-1" />

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="hand-drawn border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              Next →
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="hand-drawn border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="hand-drawn border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:border-black disabled:hover:text-white disabled:hover:scale-100"
              >
                {isSubmitting ? 'Creating Project...' : 'Create Private Funding Project'}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
