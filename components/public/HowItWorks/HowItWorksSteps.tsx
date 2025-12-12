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

// SVG Icons - Step 1: Create Project
const IconCreateProject = ({ className = 'h-24 w-24' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Lightbulb */}
    <path
      d="M60 20C45 20 33 32 33 47C33 55 36 62 41 68V78C41 82 44 85 48 85H52C56 85 59 82 59 78V68C64 62 67 55 67 47C67 32 75 20 60 20Z"
      fill="currentColor"
      opacity="0.9"
    />
    {/* Lightbulb base */}
    <rect x="48" y="85" width="24" height="4" rx="2" fill="currentColor" opacity="0.9" />
    <rect x="52" y="89" width="16" height="2" rx="1" fill="currentColor" opacity="0.7" />
    {/* Document */}
    <path
      d="M25 35H45V95H25C23 95 21 93 21 91V39C21 37 23 35 25 35Z"
      fill="white"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Document lines */}
    <line x1="28" y1="45" x2="42" y2="45" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="28" y1="52" x2="42" y2="52" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    <line x1="28" y1="59" x2="38" y2="59" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    {/* Pen/Pencil */}
    <path
      d="M75 30L90 45L85 50L70 35L75 30Z"
      fill="currentColor"
      opacity="0.9"
    />
    <path
      d="M70 35L85 50L80 55L65 40L70 35Z"
      fill="white"
    />
    <circle cx="92" cy="47" r="3" fill="currentColor" opacity="0.9" />
    {/* Gear icon */}
    <circle cx="95" cy="75" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" />
    <circle cx="95" cy="75" r="6" fill="currentColor" opacity="0.8" />
    <rect x="93" y="65" width="4" height="6" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="93" y="79" width="4" height="6" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="88" y="73" width="6" height="4" rx="1" fill="currentColor" opacity="0.8" />
    <rect x="101" y="73" width="6" height="4" rx="1" fill="currentColor" opacity="0.8" />
  </svg>
);

// SVG Icons - Step 2: Share and Reach
const IconShareReach = ({ className = 'h-24 w-24' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Central node */}
    <circle cx="60" cy="60" r="18" fill="currentColor" opacity="0.9" />
    <circle cx="60" cy="60" r="12" fill="white" />
    
    {/* Connection lines */}
    <line x1="60" y1="42" x2="60" y2="20" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="60" y1="78" x2="60" y2="100" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="78" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="42" y1="60" x2="20" y2="60" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="72" y1="48" x2="88" y2="32" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="48" y1="72" x2="32" y2="88" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="72" y1="72" x2="88" y2="88" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    <line x1="48" y1="48" x2="32" y2="32" stroke="currentColor" strokeWidth="3" opacity="0.7" />
    
    {/* Outer nodes */}
    <circle cx="60" cy="20" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="60" cy="100" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="100" cy="60" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="20" cy="60" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="88" cy="32" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="32" cy="88" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="88" cy="88" r="8" fill="currentColor" opacity="0.8" />
    <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.8" />
    
    {/* Share arrows */}
    <path
      d="M55 15L60 10L65 15M55 105L60 110L65 105M105 55L110 60L105 65M15 55L10 60L15 65"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

// SVG Icons - Step 3: Receive Funds
const IconReceiveFunds = ({ className = 'h-24 w-24' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wallet */}
    <rect x="25" y="50" width="70" height="50" rx="4" fill="currentColor" opacity="0.9" />
    <rect x="25" y="50" width="70" height="20" rx="4" fill="white" opacity="0.3" />
    <rect x="30" y="55" width="60" height="10" rx="2" fill="white" opacity="0.5" />
    
    {/* Wallet flap */}
    <path
      d="M25 50L60 40L95 50"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
      opacity="0.9"
    />
    <path
      d="M25 50L60 40L95 50L95 70L25 70Z"
      fill="currentColor"
      opacity="0.7"
    />
    
    {/* Solana logo/S symbol - stylized S */}
    <path
      d="M60 58C62.5 58 64.5 59 64.5 61C64.5 62.5 63 63.5 61 64M60 64C57.5 64 55.5 65 55.5 67C55.5 69 57.5 70 60 70C62.5 70 64.5 69 64.5 67"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="60" cy="64" r="1.5" fill="white" />
    
    {/* Lightning bolt */}
    <path
      d="M50 25L45 45L55 45L50 65L65 35L55 35L60 25Z"
      fill="currentColor"
      opacity="0.9"
    />
    
    {/* Coins/Money symbols */}
    <circle cx="35" cy="85" r="8" fill="white" opacity="0.9" />
    <circle cx="35" cy="85" r="5" fill="currentColor" opacity="0.7" />
    <path d="M35 82L33 84L35 86L37 84Z" fill="white" opacity="0.9" />
    <line x1="35" y1="80" x2="35" y2="90" stroke="white" strokeWidth="1.5" opacity="0.9" />
    
    <circle cx="55" cy="90" r="8" fill="white" opacity="0.9" />
    <circle cx="55" cy="90" r="5" fill="currentColor" opacity="0.7" />
    <path d="M55 87L53 89L55 91L57 89Z" fill="white" opacity="0.9" />
    <line x1="55" y1="85" x2="55" y2="95" stroke="white" strokeWidth="1.5" opacity="0.9" />
    
    <circle cx="75" cy="85" r="8" fill="white" opacity="0.9" />
    <circle cx="75" cy="85" r="5" fill="currentColor" opacity="0.7" />
    <path d="M75 82L73 84L75 86L77 84Z" fill="white" opacity="0.9" />
    <line x1="75" y1="80" x2="75" y2="90" stroke="white" strokeWidth="1.5" opacity="0.9" />
    
    {/* Sparkles */}
    <circle cx="40" cy="30" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="80" cy="30" r="2" fill="currentColor" opacity="0.8" />
    <circle cx="70" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`browser-window transition-all duration-300 hover:scale-105 ${
                  index === activeStep
                    ? 'border-4 border-yellow-400 shadow-lg bg-yellow-50'
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
                  <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {index === 0 && <IconCreateProject className="h-24 w-24 text-black opacity-90" />}
                      {index === 1 && <IconShareReach className="h-24 w-24 text-black opacity-90" />}
                      {index === 2 && <IconReceiveFunds className="h-24 w-24 text-black opacity-90" />}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="inline-block border-2 border-black bg-white px-2 py-1 hand-drawn text-xs font-bold text-black">
                        {step.highlight}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="hand-drawn mb-3 text-xl font-bold text-black">
                      {step.title}
                    </h3>
                    <p className="mb-3 text-sm font-semibold text-gray-800 leading-relaxed line-clamp-3">
                      {step.description}
                    </p>
                    {step.helpText && step.helpLink && (
                      <Link
                        href={step.helpLink}
                        className="text-sm font-bold text-yellow-600 underline hover:text-yellow-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {step.helpText} →
                      </Link>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="h-3 border-2 border-black bg-gray-200">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs font-bold text-black">
              <span>Step {activeStep + 1} of {steps.length}</span>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="hand-drawn border-2 border-black bg-white px-3 py-1 hover:bg-yellow-400 transition-colors flex items-center gap-1"
                aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
              >
                {isPaused ? <IconPlay className="h-3 w-3" /> : <IconPause className="h-3 w-3" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
