'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Step {
  id: string;
  title: string;
  description: string;
  highlight: string;
  helpText?: string;
  helpLink?: string;
}

const steps: Step[] = [
  {
    id: 'step1',
    title: 'Create your project',
    description: 'Set up your crowdfunding or private fundraising project with guided prompts. Add your invention details, set your Solana funding goal, and upload media. Choose public crowdfunding or private investor tools.',
    highlight: 'Zero Equity Required',
    helpText: 'Get tips for starting your project',
    helpLink: '/tips/starting',
  },
  {
    id: 'step2',
    title: 'Share and reach supporters',
    description: 'Share your project link and use our dashboard tools to gain momentum. Connect with the Web3 community, Solana ecosystem, and potential investors worldwide.',
    highlight: 'Solana Speed',
  },
  {
    id: 'step3',
    title: 'Receive funds instantly',
    description: 'Connect your Solana wallet and start receiving funds instantly with lightning-fast transactions. Cash out, stake to earn, or build on Solana—all with zero equity given up.',
    highlight: 'Instant Transactions',
  },
];

// SVG Icons
const IconRocket = ({ className = 'h-16 w-16' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L8 4v6c0 4.5 2.5 8.5 6 9.5 3.5-1 6-5 6-9.5V4l-4-2z" />
    <circle cx="12" cy="8" r="1.5" fill="white" />
    <path d="M7 20l3-2 1 2M17 20l-3-2-1 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const IconPlay = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const IconPause = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
);

export default function HowItWorksSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <section className="bg-yellow-400 halftone-bg py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h2 className="hand-drawn mb-4 text-4xl md:text-5xl font-bold text-black">
            From Idea to Market in Three Simple Steps
          </h2>
          <p className="text-lg font-semibold text-gray-700 max-w-3xl mx-auto">
            Built specifically for <span className="text-yellow-600 font-bold">Inventors & Innovators</span> using{' '}
            <span className="text-yellow-600 font-bold">Solana</span> blockchain technology. 
            No equity required. Instant transactions. Full ownership.
          </p>
        </div>

        {/* Steps Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Visual Preview */}
            <div className="relative order-2 lg:order-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="absolute top-4 right-4 z-10 border-4 border-black bg-yellow-400 px-4 py-2 hand-drawn text-sm font-bold text-black hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-lg"
                aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
              >
                {isPaused ? <IconPlay className="h-4 w-4 text-black" /> : <IconPause className="h-4 w-4 text-black" />}
                <span className="text-black">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <div className="browser-window relative h-[600px] bg-white flex flex-col overflow-hidden">
                <div className="browser-header flex-shrink-0">
                  <div className="browser-controls">
                    <div className="browser-dot red" />
                    <div className="browser-dot yellow" />
                    <div className="browser-dot green" />
                  </div>
                </div>
                <div className="relative flex-1 w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                        index === activeStep ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <div className="text-center px-4 py-6 max-w-md w-full mx-auto">
                        <p className="hand-drawn text-xl md:text-2xl font-bold text-black mb-2">
                          {step.title}
                        </p>
                        <div className="inline-block border-4 border-black bg-white px-3 py-1.5 hand-drawn text-xs font-bold text-black mb-3">
                          {step.highlight}
                        </div>
                        <p className="text-sm font-semibold text-black leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-2 border-2 border-black bg-gray-200">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Steps List */}
            <div className="order-1 lg:order-2">
              <ol className="space-y-6">
                {steps.map((step, index) => (
                  <li
                    key={step.id}
                    id={step.id}
                    className={`browser-window transition-all duration-300 ${
                      index === activeStep
                        ? 'border-4 border-yellow-400 shadow-lg scale-105 bg-yellow-50'
                        : 'border-2 border-gray-300 bg-white'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveStep(index);
                        setIsPaused(true);
                      }}
                      className="w-full text-left"
                      aria-label={`Show step ${index + 1}: ${step.title}`}
                    >
                      <div className="browser-header">
                        <div className="browser-controls">
                          <div className="browser-dot red" />
                          <div className="browser-dot yellow" />
                          <div className="browser-dot green" />
                        </div>
                        <div className="flex-1" />
                        <div className="yellow-highlight hand-drawn text-xs font-bold text-black">
                          STEP {index + 1}
                        </div>
                        <div className="flex-1" />
                      </div>
                      <div className="p-6">
                        <div className="mb-2">
                        <span className="inline-block border-2 border-black bg-yellow-400 px-3 py-1 hand-drawn text-xs font-bold text-black mb-2">
                          {step.highlight}
                        </span>
                      </div>
                      <h3 className="hand-drawn mb-2 text-xl font-bold text-black">
                        {step.title}
                      </h3>
                      <p className="mb-2 text-base font-semibold text-gray-800 leading-relaxed">
                        {step.description}
                      </p>
                      {step.helpText && step.helpLink && (
                        <p className="text-sm font-bold text-gray-600">
                          {step.helpText}{' '}
                          <Link
                            href={step.helpLink}
                            className="text-yellow-600 underline hover:text-yellow-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            here
                          </Link>
                          .
                        </p>
                      )}
                      </div>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
