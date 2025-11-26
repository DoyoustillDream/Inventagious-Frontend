'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import GuideHero from './GuideHero';
import GuideStepSidebar from './GuideStepSidebar';
import GettingStartedStep from './steps/GettingStartedStep';
import BasicInfoStep from './steps/BasicInfoStep';
import FundingInfoStep from './steps/FundingInfoStep';
import MediaStep from './steps/MediaStep';
import ReviewLaunchStep from './steps/ReviewLaunchStep';

export interface GuideStepData {
  number: number;
  title: string;
  description: string;
  component: React.ReactNode;
}

const guideSteps: GuideStepData[] = [
  {
    number: 1,
    title: 'Getting Started',
    description: 'Set up your account and prepare to launch',
    component: <GettingStartedStep />,
  },
  {
    number: 2,
    title: 'Basic Information',
    description: 'Tell the world about your project',
    component: <BasicInfoStep />,
  },
  {
    number: 3,
    title: 'Funding Information',
    description: 'Set your goals and payment details',
    component: <FundingInfoStep />,
  },
  {
    number: 4,
    title: 'Media & Visuals',
    description: 'Make your project stand out',
    component: <MediaStep />,
  },
  {
    number: 5,
    title: 'Review & Launch',
    description: 'Final checks before going live',
    component: <ReviewLaunchStep />,
  },
];

export default function StartProjectGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    if (contentRef.current) {
      const offset = 100; // Offset from top for better visibility
      const elementPosition = contentRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    // Small delay to ensure state update and DOM render
    setTimeout(() => {
      scrollToContent();
    }, 50);
  };

  const handleNext = () => {
    if (currentStep < guideSteps.length) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        scrollToContent();
      }, 50);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => {
        scrollToContent();
      }, 50);
    }
  };

  const currentStepData = guideSteps[currentStep - 1];

  return (
    <div className="container mx-auto px-4">
      <GuideHero />
      
      <div className="max-w-7xl mx-auto mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <GuideStepSidebar
              steps={guideSteps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3" ref={contentRef}>
            <div className="browser-window bg-white sticky top-4">
              <div className="browser-header">
                <div className="browser-controls">
                  <div className="browser-dot red" />
                  <div className="browser-dot yellow" />
                  <div className="browser-dot green" />
                </div>
                <div className="flex-1" />
                <div className="yellow-highlight hand-drawn text-xs font-bold">
                  STEP {currentStep} OF {guideSteps.length}
                </div>
                <div className="flex-1" />
              </div>

              <div className="p-6 md:p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="hand-drawn text-sm font-bold text-gray-700">
                      Progress: {Math.round((currentStep / guideSteps.length) * 100)}%
                    </span>
                    <span className="hand-drawn text-sm font-bold text-gray-700">
                      {currentStep} / {guideSteps.length}
                    </span>
                  </div>
                  <div className="w-full h-3 border-2 border-black bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${(currentStep / guideSteps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Step Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-shrink-0 w-12 h-12 border-4 border-black bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="hand-drawn text-2xl font-bold text-black">{currentStep}</span>
                    </div>
                    <div>
                      <h2 className="hand-drawn text-2xl md:text-3xl font-bold text-black">
                        {currentStepData.title}
                      </h2>
                      <p className="hand-drawn text-base font-semibold text-gray-700 mt-1">
                        {currentStepData.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="border-t-4 border-black pt-6 mb-8">
                  {currentStepData.component}
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-4 border-black">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="hand-drawn flex-1 border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:scale-100"
                  >
                    ← Previous
                  </button>
                  {currentStep < guideSteps.length ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="hand-drawn flex-1 border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
                    >
                      Next →
                    </button>
                  ) : (
                    <Link
                      href="/projects/create"
                      className="hand-drawn flex-1 border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white text-center transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
                    >
                      Create Your Project →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-5xl mx-auto mt-16 mb-8">
        <div className="browser-window bg-yellow-50">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot red" />
              <div className="browser-dot yellow" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <div className="yellow-highlight hand-drawn text-xs font-bold">
              READY TO START?
            </div>
            <div className="flex-1" />
          </div>
          <div className="p-8 text-center">
            <p className="hand-drawn text-xl font-bold text-black mb-6">
              Now that you know the steps, it's time to create your project!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/projects/create"
                className="hand-drawn border-4 border-black bg-black px-8 py-4 text-lg font-bold text-white transition-all hover:bg-yellow-400 hover:border-yellow-600 hover:text-black hover:scale-105 active:scale-95"
              >
                Create Your Project
              </Link>
              <Link
                href="/help/tips"
                className="hand-drawn border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
              >
                Fundraising Tips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
