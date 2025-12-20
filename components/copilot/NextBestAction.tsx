'use client';

import { CopilotResponse, CopilotActionTarget, CopilotActionType, CopilotUrgency } from '@/lib/copilot/types';

interface NextBestActionProps {
  advice: CopilotResponse | null;
  onAction?: (target: CopilotActionTarget) => void;
}

// Map action types to styling
const actionStyles: Record<CopilotActionType, { bg: string; border: string; icon: string }> = {
  [CopilotActionType.EDIT]: { 
    bg: 'bg-yellow-50', 
    border: 'border-yellow-500',
    icon: '✏️'
  },
  [CopilotActionType.WARN]: { 
    bg: 'bg-red-50', 
    border: 'border-red-500',
    icon: '⚠️'
  },
  [CopilotActionType.BLOCK]: { 
    bg: 'bg-red-100', 
    border: 'border-red-600',
    icon: '🚫'
  },
  [CopilotActionType.SUGGEST]: { 
    bg: 'bg-blue-50', 
    border: 'border-blue-500',
    icon: '💡'
  },
  [CopilotActionType.CELEBRATE]: { 
    bg: 'bg-green-50', 
    border: 'border-green-500',
    icon: '🎉'
  },
};

// Map urgency to colors
const urgencyColors: Record<CopilotUrgency, string> = {
  [CopilotUrgency.HIGH]: 'text-red-600',
  [CopilotUrgency.MEDIUM]: 'text-yellow-600',
  [CopilotUrgency.LOW]: 'text-gray-600',
};

export default function NextBestAction({ advice, onAction }: NextBestActionProps) {
  if (!advice?.primaryAction) {
    return null;
  }
  
  const { primaryAction, urgency, canLaunch, nextBestAction } = advice;
  const style = actionStyles[primaryAction.type] || actionStyles[CopilotActionType.SUGGEST];
  const urgencyColor = urgencyColors[urgency] || urgencyColors[CopilotUrgency.LOW];
  
  // If ready to launch, show celebration
  if (canLaunch && primaryAction.type === CopilotActionType.CELEBRATE) {
    return (
      <div className={`browser-window ${style.border}`}>
        <div className="browser-header bg-green-100">
          <div className="browser-controls">
            <div className="browser-dot green" />
            <div className="browser-dot green" />
            <div className="browser-dot green" />
          </div>
          <div className="flex-1" />
          <span className="hand-drawn text-xs font-bold text-green-700">🎉 READY!</span>
          <div className="flex-1" />
        </div>
        
        <div className={`p-4 ${style.bg}`}>
          <p className="hand-drawn text-base font-bold text-green-700 mb-2">
            {primaryAction.message}
          </p>
          <p className="hand-drawn text-sm font-semibold text-green-600">
            Review your campaign and click "Create Campaign" when you're ready to go live!
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`browser-window ${style.border}`}>
      <div className={`browser-header ${style.bg}`}>
        <div className="browser-controls">
          <div className={`browser-dot ${urgency === CopilotUrgency.HIGH ? 'red' : urgency === CopilotUrgency.MEDIUM ? 'yellow' : 'green'}`} />
          <div className={`browser-dot ${urgency === CopilotUrgency.HIGH ? 'red' : urgency === CopilotUrgency.MEDIUM ? 'yellow' : 'green'}`} />
          <div className={`browser-dot ${urgency === CopilotUrgency.HIGH ? 'red' : urgency === CopilotUrgency.MEDIUM ? 'yellow' : 'green'}`} />
        </div>
        <div className="flex-1" />
        <span className={`hand-drawn text-xs font-bold ${urgencyColor}`}>
          {style.icon} NEXT ACTION
        </span>
        <div className="flex-1" />
      </div>
      
      <div className={`p-4 ${style.bg}`}>
        <p className="hand-drawn text-base font-bold text-black mb-2">
          {primaryAction.message}
        </p>
        
        {/* Show what's specifically needed */}
        {urgency === CopilotUrgency.HIGH && (
          <p className="hand-drawn text-xs font-bold text-red-600 mb-3">
            ⚠️ This is required before you can launch
          </p>
        )}
        
        {onAction && (
          <button
            type="button"
            onClick={() => onAction(primaryAction.target)}
            className="hand-drawn w-full border-2 border-black bg-black px-3 py-2 text-sm font-bold text-white transition-all hover:bg-yellow-400 hover:text-black hover:scale-105 active:scale-95"
          >
            Go Fix This →
          </button>
        )}
      </div>
    </div>
  );
}
