'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi, CreateProjectData } from '@/lib/api/projects';
import { useCampaign } from '@/lib/solana/hooks/useCampaign';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import CampaignBasicInfo from './CampaignBasicInfo';
import ProjectFundingInfo from '../CreateProjectForm/ProjectFundingInfo';
import ProjectMediaInfo from '../CreateProjectForm/ProjectMediaInfo';

const TOTAL_STEPS = 3;

export default function CreateCampaignForm() {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { authenticateWallet } = useWalletAuth();
  const { initializeCampaign, isLoading: isInitializing } = useCampaign();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    type: 'crowdfunding', // Always crowdfunding for campaigns
    fundingGoal: 0,
    category: '',
    imageUrl: '',
    videoUrl: '',
    deadline: '',
    solanaAddress: '',
    isPublic: true,
  });

  const validateStep = (step: number): boolean => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          setError('Campaign title is required');
          return false;
        }
        if (!formData.description?.trim()) {
          setError('Campaign description is required');
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
        // Note: Detailed validation with dynamic limits is handled in ProjectFundingInfo component
        // This is a basic check to ensure a value is provided
        // Wallet address is automatically taken from connected wallet
        return true;
      
      case 3:
        if (!formData.imageUrl?.trim()) {
          setError('At least one campaign image is required');
          return false;
        }
        // Validate that imageUrl is not an empty JSON array
        try {
          const parsed = JSON.parse(formData.imageUrl);
          if (Array.isArray(parsed) && parsed.length === 0) {
            setError('At least one campaign image is required');
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

    // Check if wallet is connected
    if (!connected || !publicKey) {
      setError('Please connect your wallet to create a campaign on-chain');
      return;
    }

    // Check if user is authenticated with backend
    if (!isAuthenticated) {
      setError('Please sign the authentication message with your wallet to continue. If you see a wallet popup, please approve it.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up empty optional fields
      const submitData: CreateProjectData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        type: 'crowdfunding', // Always crowdfunding
        fundingGoal: formData.fundingGoal,
        category: formData.category || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
        videoUrl: formData.videoUrl?.trim() || undefined,
        deadline: formData.deadline || undefined,
        solanaAddress: publicKey?.toBase58() || '',
        isPublic: formData.isPublic ?? true,
      };

      // Step 1: Create project in database first (we need the ID for the PDA)
      const project = await projectsApi.create(submitData);
      
      // Step 2: Initialize campaign on-chain using the project ID
      // Calculate deadline: if not provided, set to max duration from now (default 30 days)
      // Backend will validate and enforce max deadline duration
      const deadline = formData.deadline
        ? Math.floor(new Date(formData.deadline).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // Default to 30 days from now

      try {
        // This will:
        // 1. Create the campaign on-chain using the project ID
        // 2. Call projectsApi.publish() which updates the project with the campaign PDA
        await initializeCampaign(
          project.id,
          formData.fundingGoal,
          deadline,
        );
      } catch (onChainError: any) {
        console.error('Failed to create campaign on-chain:', onChainError);
        // Don't redirect - show error and let user try again
        // The project exists in database but is unpublished (draft state)
        setError(
          `Failed to create campaign on-chain: ${onChainError.message}. ` +
          'The project was created but not published. Please ensure your wallet is connected and has sufficient SOL, then try again from the project page.'
        );
        setIsSubmitting(false);
        return;
      }
      
      // Redirect to the campaign page only if on-chain creation succeeded
      router.push(`/campaigns/${project.slug}`);
    } catch (err: any) {
      console.error('Error creating campaign:', err);
      setError(err.message || 'Failed to create campaign. Please try again.');
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
        return 'Create Campaign';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return 'Tell us about your campaign';
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

        {!connected && (
          <div className="mb-6 browser-window border-yellow-500 bg-yellow-50">
            <div className="p-4">
              <p className="hand-drawn text-base font-bold text-yellow-800">
                ⚠️ Please connect your wallet to create a campaign on-chain
              </p>
            </div>
          </div>
        )}

        {connected && !isAuthenticated && !authLoading && (
          <div className="mb-6 browser-window border-yellow-500 bg-yellow-50">
            <div className="p-4">
              <p className="hand-drawn text-base font-bold text-yellow-800 mb-3">
                ⚠️ Please authenticate with your wallet to continue. You'll need to sign a message to verify ownership.
              </p>
              <button
                type="button"
                onClick={async () => {
                  setIsAuthenticating(true);
                  try {
                    await authenticateWallet();
                  } catch (err: any) {
                    setError(err.message || 'Failed to authenticate. Please try again.');
                  } finally {
                    setIsAuthenticating(false);
                  }
                }}
                disabled={isAuthenticating}
                className="hand-drawn border-4 border-black bg-black px-6 py-2 text-sm font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isAuthenticating ? 'Authenticating...' : 'Authenticate Wallet'}
              </button>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <CampaignBasicInfo
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
              solanaAddress={publicKey?.toBase58() || ''}
              isPublic={formData.isPublic ?? true}
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
                disabled={isSubmitting || isInitializing}
                className="hand-drawn border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:border-black disabled:hover:text-white disabled:hover:scale-100"
              >
                {isSubmitting || isInitializing
                  ? isInitializing
                    ? 'Creating on-chain...'
                    : 'Creating Campaign...'
                  : 'Create Campaign'}
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

