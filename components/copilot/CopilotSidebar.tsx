'use client';

import { ChecklistItem, StepGuidance } from '@/hooks/useCampaignCopilot';
import { CopilotResponse, CopilotUrgency, CopilotActionTarget, CreatorState } from '@/lib/copilot/types';

interface CopilotSidebarProps {
  advice: CopilotResponse | null;
  creatorState: CreatorState;
  checklist?: ChecklistItem[];
  stepGuidance?: StepGuidance;
  currentStep?: number;
  isLoading?: boolean;
  onActionClick?: (target: string) => void;
  onRefresh?: () => void;
}

// Map action targets to icons
const targetIcons: Record<string, string> = {
  [CopilotActionTarget.TITLE]: '✏️',
  [CopilotActionTarget.DESCRIPTION]: '📝',
  [CopilotActionTarget.CATEGORY]: '🏷️',
  [CopilotActionTarget.FUNDING_GOAL]: '💰',
  [CopilotActionTarget.DEADLINE]: '⏰',
  [CopilotActionTarget.IMAGE]: '🖼️',
  [CopilotActionTarget.VIDEO]: '🎬',
  [CopilotActionTarget.SOCIAL_LINKS]: '🔗',
  [CopilotActionTarget.PROFILE]: '👤',
  [CopilotActionTarget.MARKETING]: '📣',
  [CopilotActionTarget.MILESTONES]: '🎯',
  [CopilotActionTarget.BACKERS]: '👥',
};

// Creator state display names
const stateLabels: Record<CreatorState, { label: string; color: string }> = {
  [CreatorState.ONBOARDING]: { label: 'Getting Started', color: 'text-blue-600' },
  [CreatorState.IDEA_DEFINED]: { label: 'Idea Defined', color: 'text-purple-600' },
  [CreatorState.DRAFTING]: { label: 'Building Campaign', color: 'text-yellow-600' },
  [CreatorState.PRE_LAUNCH]: { label: 'Almost Ready', color: 'text-orange-600' },
  [CreatorState.READY_TO_LAUNCH]: { label: 'Ready to Launch!', color: 'text-green-600' },
  [CreatorState.LAUNCHED]: { label: 'Live', color: 'text-green-600' },
  [CreatorState.STALLED]: { label: 'Needs Attention', color: 'text-red-600' },
  [CreatorState.GROWING]: { label: 'Growing', color: 'text-green-600' },
  [CreatorState.FAILED]: { label: 'Ended', color: 'text-gray-600' },
  [CreatorState.FUNDED]: { label: 'Funded!', color: 'text-green-600' },
  [CreatorState.COMPLETED]: { label: 'Completed', color: 'text-gray-600' },
};

export default function CopilotSidebar({
  advice,
  creatorState,
  checklist = [],
  stepGuidance,
  currentStep = 1,
  isLoading = false,
  onActionClick,
  onRefresh,
}: CopilotSidebarProps) {
  const stateInfo = stateLabels[creatorState] || stateLabels[CreatorState.DRAFTING];
  const readinessScore = advice?.readinessScore ?? 0;
  
  // Get items for current step
  const currentStepItems = checklist.filter((item) => item.step === currentStep);
  const completedStepItems = currentStepItems.filter((item) => item.isComplete);
  const stepProgress = currentStepItems.length > 0 
    ? Math.round((completedStepItems.length / currentStepItems.length) * 100)
    : 0;
  
  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className="browser-window">
        <div className="browser-header">
          <div className="browser-controls">
            <div className={`browser-dot ${readinessScore >= 80 ? 'green' : readinessScore >= 50 ? 'yellow' : 'red'}`} />
            <div className={`browser-dot ${readinessScore >= 80 ? 'green' : readinessScore >= 50 ? 'yellow' : 'red'}`} />
            <div className={`browser-dot ${readinessScore >= 80 ? 'green' : readinessScore >= 50 ? 'yellow' : 'red'}`} />
          </div>
          <div className="flex-1" />
          <span className="hand-drawn text-xs font-bold">🤖 COPILOT</span>
          <div className="flex-1" />
        </div>
        
        <div className="p-4">
          {/* State Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`hand-drawn text-sm font-bold ${stateInfo.color}`}>
              {stateInfo.label}
            </span>
            <span className={`hand-drawn text-2xl font-bold ${
              readinessScore >= 80 ? 'text-green-600' :
              readinessScore >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {readinessScore}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-3 bg-white border-4 border-black rounded-full overflow-hidden mb-3">
            <div
              className={`h-full transition-all duration-500 ${
                readinessScore >= 80 ? 'bg-green-400' :
                readinessScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${readinessScore}%` }}
            />
          </div>
          
          {/* Summary */}
          {advice?.summary && (
            <p className="hand-drawn text-sm font-semibold text-gray-700">
              {advice.summary}
            </p>
          )}
          
          {/* Encouragement */}
          {advice?.encouragement && (
            <p className="hand-drawn text-xs font-bold text-green-600 mt-2">
              ✨ {advice.encouragement}
            </p>
          )}
        </div>
      </div>
      
      {/* Current Step Focus */}
      {stepGuidance && (
        <div className="browser-window">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot yellow" />
              <div className="browser-dot yellow" />
              <div className="browser-dot yellow" />
            </div>
            <div className="flex-1" />
            <span className="hand-drawn text-xs font-bold">STEP {currentStep}</span>
            <div className="flex-1" />
          </div>
          
          <div className="p-4">
            <h4 className="hand-drawn text-base font-bold text-black mb-2">
              {stepGuidance.title}
            </h4>
            
            {/* Step Progress */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${stepProgress}%` }}
                />
              </div>
              <span className="hand-drawn text-xs font-bold text-gray-600">
                {stepProgress}%
              </span>
            </div>
            
            {/* Current Focus */}
            <p className="hand-drawn text-sm font-semibold text-gray-700 mb-3">
              👉 {stepGuidance.currentFocus}
            </p>
            
            {/* Tips */}
            {stepGuidance.tips.length > 0 && (
              <div className="space-y-2 mt-3 pt-3 border-t-2 border-gray-200">
                <span className="hand-drawn text-xs font-bold text-gray-500">PRO TIPS:</span>
                {stepGuidance.tips.slice(0, 2).map((tip, idx) => (
                  <p key={idx} className="hand-drawn text-xs font-semibold text-gray-600 flex items-start gap-1">
                    <span className="text-yellow-500">✦</span>
                    {tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Checklist */}
      {checklist.length > 0 && (
        <div className="browser-window">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot green" />
              <div className="browser-dot green" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <span className="hand-drawn text-xs font-bold">✓ CHECKLIST</span>
            <div className="flex-1" />
          </div>
          
          <div className="p-4">
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li 
                  key={item.id}
                  className={`flex items-center gap-2 hand-drawn text-sm font-semibold ${
                    item.isComplete ? 'text-gray-400' : item.isRequired ? 'text-black' : 'text-gray-600'
                  }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center text-xs ${
                    item.isComplete 
                      ? 'border-green-500 bg-green-100 text-green-600' 
                      : item.isRequired
                        ? 'border-black bg-white'
                        : 'border-gray-400 bg-white'
                  }`}>
                    {item.isComplete ? '✓' : ''}
                  </span>
                  <span className={item.isComplete ? 'line-through' : ''}>
                    {item.label}
                    {item.isRequired && !item.isComplete && (
                      <span className="text-red-500 text-xs ml-1">*</span>
                    )}
                  </span>
                  {!item.isComplete && onActionClick && (
                    <button
                      type="button"
                      onClick={() => onActionClick(item.target)}
                      className="ml-auto text-xs text-yellow-600 hover:text-yellow-700 underline"
                    >
                      Fix →
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Next Action (if no checklist) */}
      {advice?.primaryAction && checklist.length === 0 && (
        <div className="browser-window">
          <div className="browser-header">
            <div className="browser-controls">
              <div className="browser-dot green" />
              <div className="browser-dot green" />
              <div className="browser-dot green" />
            </div>
            <div className="flex-1" />
            <span className="hand-drawn text-xs font-bold">👉 NEXT</span>
            <div className="flex-1" />
          </div>
          
          <div className="p-4">
            <p className="hand-drawn text-sm font-bold text-black mb-2">
              {targetIcons[advice.primaryAction.target] || '📌'} {advice.primaryAction.message}
            </p>
            
            {onActionClick && (
              <button
                type="button"
                onClick={() => onActionClick(advice.primaryAction.target)}
                className="hand-drawn mt-2 w-full border-2 border-black bg-yellow-400 px-3 py-2 text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:scale-105 active:scale-95"
              >
                Go to this section →
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <span className="hand-drawn text-sm font-bold text-gray-500 animate-pulse">
            🤖 Analyzing...
          </span>
        </div>
      )}
    </div>
  );
}
