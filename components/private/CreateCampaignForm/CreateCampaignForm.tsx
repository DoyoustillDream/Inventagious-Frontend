'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi, CreateProjectData } from '@/lib/api/projects';
import { usePhantomWallet } from '@/hooks/usePhantomWallet';
import { useAuth } from '@/components/auth/AuthProvider';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { useCampaignCopilot, CampaignFormData } from '@/hooks/useCampaignCopilot';
import CampaignBasicInfo from './CampaignBasicInfo';
import ProjectFundingInfo from '../CreateProjectForm/ProjectFundingInfo';
import ProjectMediaInfo from '../CreateProjectForm/ProjectMediaInfo';
import { CopilotSidebar, CopilotWarning, NextBestAction } from '@/components/copilot';
import { CopilotActionTarget, CopilotUrgency } from '@/lib/copilot/types';

const TOTAL_STEPS = 3;

export default function CreateCampaignForm() {
  const router = useRouter();
  const { publicKey, connected } = usePhantomWallet();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { authenticateWallet } = useWalletAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    type: 'crowdfunding',
    fundingGoal: 0,
    category: '',
    imageUrl: '',
    videoUrl: '',
    deadline: '',
    scheduledLaunchDate: '',
    solanaAddress: '',
    isPublic: true,
    websiteUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
  });

  // Prepare form data for copilot
  const copilotFormData = useMemo((): CampaignFormData => ({
    title: formData.title,
    description: formData.description || '',
    category: formData.category || '',
    fundingGoal: formData.fundingGoal,
    imageUrl: formData.imageUrl || '',
    videoUrl: formData.videoUrl || '',
    deadline: formData.deadline || '',
    websiteUrl: formData.websiteUrl || '',
    twitterUrl: formData.twitterUrl || '',
  }), [formData]);

  // Use the campaign copilot hook
  const {
    advice,
    isLoading: copilotLoading,
    descriptionAnalysis,
    readinessScore,
    canLaunch,
    creatorState,
    checklist,
    launchBlockers,
    getStepGuidance,
    primaryAction,
    urgency,
  } = useCampaignCopilot(copilotFormData);

  // Get guidance for current step
  const stepGuidance = getStepGuidance(currentStep);

  // Navigate to target based on copilot action
  const handleCopilotAction = (target: CopilotActionTarget | string) => {
    const targetStr = String(target).toLowerCase();
    if (targetStr === 'title' || targetStr === 'description' || targetStr === 'category' || targetStr === 'social_links') {
      setCurrentStep(1);
    } else if (targetStr === 'funding_goal' || targetStr === 'deadline') {
      setCurrentStep(2);
    } else if (targetStr === 'image' || targetStr === 'video') {
      setCurrentStep(3);
    }
  };

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
        return true;
      
      case 3:
        if (!formData.imageUrl?.trim()) {
          setError('At least one campaign image is required');
          return false;
        }
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

    if (!isAuthenticated) {
      setError('Please sign the authentication message with your wallet to continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData: CreateProjectData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        type: 'crowdfunding',
        fundingGoal: formData.fundingGoal,
        category: formData.category || undefined,
        imageUrl: formData.imageUrl?.trim() || undefined,
        videoUrl: formData.videoUrl?.trim() || undefined,
        deadline: formData.deadline || undefined,
        scheduledLaunchDate: formData.scheduledLaunchDate || undefined,
        solanaAddress: publicKey?.toBase58() || '',
        isPublic: formData.isPublic ?? true,
        websiteUrl: formData.websiteUrl?.trim() || undefined,
        twitterUrl: formData.twitterUrl?.trim() || undefined,
        facebookUrl: formData.facebookUrl?.trim() || undefined,
        instagramUrl: formData.instagramUrl?.trim() || undefined,
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
        youtubeUrl: formData.youtubeUrl?.trim() || undefined,
        tiktokUrl: formData.tiktokUrl?.trim() || undefined,
      };

      const project = await projectsApi.create(submitData);
      
      try {
        await projectsApi.publish(project.id, publicKey?.toBase58());
      } catch (publishError: any) {
        console.error('Failed to publish campaign:', publishError);
        setError(
          `Failed to publish campaign: ${publishError.message}. ` +
          'The project was created but not published. Please try again from the project page.'
        );
        setIsSubmitting(false);
        return;
      }
      
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
      case 1: return 'Basic Information';
      case 2: return 'Funding Details';
      case 3: return 'Media & Visuals';
      default: return 'Create Campaign';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Tell us about your campaign';
      case 2: return 'Set your funding goals';
      case 3: return 'Add images and videos';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* Main Form */}
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
                      step <= currentStep ? 'bg-yellow-400' : 'bg-white'
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

          {/* Mobile Copilot Warning */}
          {primaryAction && urgency === CopilotUrgency.HIGH && (
            <div className="lg:hidden mb-6">
              <CopilotWarning
                action={primaryAction}
                urgency={urgency}
                onAction={() => handleCopilotAction(primaryAction.target)}
                actionLabel="Go Fix"
              />
            </div>
          )}

          {connected && !isAuthenticated && !authLoading && (
            <div className="mb-6 browser-window border-yellow-500 bg-yellow-50">
              <div className="p-4">
                <p className="hand-drawn text-base font-bold text-yellow-800 mb-3">
                  ⚠️ Please authenticate with your wallet to continue.
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
                websiteUrl={formData.websiteUrl || ''}
                twitterUrl={formData.twitterUrl || ''}
                facebookUrl={formData.facebookUrl || ''}
                instagramUrl={formData.instagramUrl || ''}
                linkedinUrl={formData.linkedinUrl || ''}
                youtubeUrl={formData.youtubeUrl || ''}
                tiktokUrl={formData.tiktokUrl || ''}
                descriptionAnalysis={descriptionAnalysis}
                isAnalyzing={copilotLoading}
                onUpdate={updateField}
              />
            )}

            {currentStep === 2 && (
              <ProjectFundingInfo
                fundingGoal={formData.fundingGoal}
                deadline={formData.deadline || ''}
                scheduledLaunchDate={formData.scheduledLaunchDate}
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

          {/* Readiness Indicator - shown on final step */}
          {currentStep === 3 && (
            <div className={`mb-6 browser-window ${canLaunch ? 'border-green-500' : 'border-yellow-500'}`}>
              <div className={`p-4 ${canLaunch ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="hand-drawn text-base font-bold text-black">
                    ✨ Campaign Readiness
                  </span>
                  <span className={`hand-drawn text-2xl font-bold ${
                    readinessScore >= 80 ? 'text-green-600' :
                    readinessScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {readinessScore}%
                  </span>
                </div>
                <div className="h-4 bg-white border-4 border-black rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      readinessScore >= 80 ? 'bg-green-400' :
                      readinessScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
                {launchBlockers.length > 0 && (
                  <p className="mt-3 hand-drawn text-sm font-bold text-red-700">
                    ⚠️ {launchBlockers[0]}
                  </p>
                )}
                {canLaunch && (
                  <p className="mt-3 hand-drawn text-sm font-bold text-green-700">
                    ✓ Your campaign looks ready to launch! 🚀
                  </p>
                )}
              </div>
            </div>
          )}

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
                  className="hand-drawn border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {/* Copilot Sidebar */}
      <div className="hidden lg:block space-y-4">
        {/* Next Best Action */}
        <NextBestAction 
          advice={advice}
          onAction={handleCopilotAction}
        />
        
        {/* Copilot Sidebar with Checklist */}
        <CopilotSidebar
          advice={advice}
          creatorState={creatorState}
          checklist={checklist}
          stepGuidance={stepGuidance}
          currentStep={currentStep}
          isLoading={copilotLoading}
          onActionClick={handleCopilotAction}
        />
        
        {/* Quick Tips */}
        <div className="browser-window">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot green" />
              <div className="browser-dot green" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <span className="hand-drawn text-xs font-bold">💡 SUCCESS TIPS</span>
            <div className="flex-1" />
          </div>
          <div className="p-4">
            <ul className="space-y-3">
              <li className="flex items-start gap-2 hand-drawn text-sm font-semibold text-gray-700">
                <span className="text-yellow-500">✦</span>
                <span>Campaigns with videos raise 3x more</span>
              </li>
              <li className="flex items-start gap-2 hand-drawn text-sm font-semibold text-gray-700">
                <span className="text-yellow-500">✦</span>
                <span>Set a realistic first goal, use stretch goals later</span>
              </li>
              <li className="flex items-start gap-2 hand-drawn text-sm font-semibold text-gray-700">
                <span className="text-yellow-500">✦</span>
                <span>Share before launch to build momentum</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
