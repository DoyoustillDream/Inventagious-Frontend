'use client';

import { CopilotPrimaryAction, CopilotUrgency, CopilotActionType } from '@/lib/copilot/types';

interface CopilotWarningProps {
  action: CopilotPrimaryAction;
  urgency: CopilotUrgency;
  onAction?: () => void;
  actionLabel?: string;
}

export default function CopilotWarning({
  action,
  urgency,
  onAction,
  actionLabel = 'Fix Now',
}: CopilotWarningProps) {
  // Only show for high urgency or blocking issues
  if (urgency !== CopilotUrgency.HIGH && action.type !== CopilotActionType.BLOCK) {
    return null;
  }
  
  const isBlocking = action.type === CopilotActionType.BLOCK;
  
  return (
    <div className={`browser-window ${isBlocking ? 'border-red-600' : 'border-yellow-500'}`}>
      <div className={`browser-header ${isBlocking ? 'bg-red-100' : 'bg-yellow-100'}`}>
        <div className="browser-controls">
          <div className={`browser-dot ${isBlocking ? 'red' : 'yellow'}`} />
          <div className={`browser-dot ${isBlocking ? 'red' : 'yellow'}`} />
          <div className={`browser-dot ${isBlocking ? 'red' : 'yellow'}`} />
        </div>
        <div className="flex-1" />
        <span className={`hand-drawn text-xs font-bold ${isBlocking ? 'text-red-700' : 'text-yellow-700'}`}>
          {isBlocking ? '🚫 REQUIRED' : '⚠️ IMPORTANT'}
        </span>
        <div className="flex-1" />
      </div>
      
      <div className={`p-4 ${isBlocking ? 'bg-red-50' : 'bg-yellow-50'}`}>
        <p className={`hand-drawn text-sm font-bold mb-3 ${isBlocking ? 'text-red-800' : 'text-yellow-800'}`}>
          {action.message}
        </p>
        
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className={`hand-drawn w-full border-2 px-3 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
              isBlocking 
                ? 'border-red-600 bg-red-600 text-white hover:bg-red-500'
                : 'border-black bg-black text-white hover:bg-yellow-400 hover:text-black'
            }`}
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
}
