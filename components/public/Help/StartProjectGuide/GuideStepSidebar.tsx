'use client';

import { GuideStepData } from './StartProjectGuide';
import { IconCheck } from './icons';

interface GuideStepSidebarProps {
  steps: GuideStepData[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}

export default function GuideStepSidebar({
  steps,
  currentStep,
  onStepClick,
}: GuideStepSidebarProps) {
  return (
    <div className="browser-window bg-yellow-50 sticky top-4">
      <div className="browser-header">
        <div className="browser-controls">
          <div className="browser-dot red" />
          <div className="browser-dot yellow" />
          <div className="browser-dot green" />
        </div>
        <div className="flex-1" />
        <div className="yellow-highlight hand-drawn text-xs font-bold">
          GUIDE STEPS
        </div>
        <div className="flex-1" />
      </div>
      <div className="p-4">
        <nav className="space-y-2" aria-label="Guide steps">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            
            return (
              <button
                key={step.number}
                onClick={() => onStepClick(step.number)}
                className={`w-full text-left p-4 rounded-lg border-4 transition-all ${
                  isActive
                    ? 'border-black bg-yellow-400 shadow-lg scale-105'
                    : isCompleted
                    ? 'border-gray-400 bg-white hover:border-yellow-300 hover:bg-yellow-50'
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 border-4 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'border-black bg-black'
                        : isCompleted
                        ? 'border-gray-400 bg-gray-200'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <IconCheck className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`hand-drawn text-lg font-bold ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`hand-drawn text-sm font-bold mb-1 ${
                        isActive ? 'text-black' : 'text-gray-700'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs font-semibold line-clamp-2 ${
                        isActive ? 'text-gray-800' : 'text-gray-600'
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t-4 border-black">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="hand-drawn text-sm font-bold text-gray-700">
                Progress
              </span>
              <span className="hand-drawn text-sm font-bold text-black">
                {Math.round((currentStep / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 border-2 border-black bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

