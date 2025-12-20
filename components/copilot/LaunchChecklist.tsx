'use client';

import { ChecklistItem } from '@/hooks/useCampaignCopilot';
import { LaunchReadinessResult, CopilotActionTarget } from '@/lib/copilot/types';

interface LaunchChecklistProps {
  checklist?: ChecklistItem[];
  readiness?: LaunchReadinessResult | null;
  onActionClick?: (target: CopilotActionTarget | string) => void;
}

export default function LaunchChecklist({
  checklist = [],
  readiness,
  onActionClick,
}: LaunchChecklistProps) {
  // If using the new checklist format
  if (checklist.length > 0) {
    const requiredItems = checklist.filter((item) => item.isRequired);
    const optionalItems = checklist.filter((item) => !item.isRequired);
    const completedRequired = requiredItems.filter((item) => item.isComplete).length;
    const completedOptional = optionalItems.filter((item) => item.isComplete).length;
    
    return (
      <div className="space-y-4">
        {/* Required Items */}
        <div className="browser-window">
          <div className="browser-header">
            <div className="browser-controls">
              <div className={`browser-dot ${completedRequired === requiredItems.length ? 'green' : 'red'}`} />
              <div className={`browser-dot ${completedRequired === requiredItems.length ? 'green' : 'red'}`} />
              <div className={`browser-dot ${completedRequired === requiredItems.length ? 'green' : 'red'}`} />
            </div>
            <div className="flex-1" />
            <span className="hand-drawn text-xs font-bold">
              ✓ REQUIRED ({completedRequired}/{requiredItems.length})
            </span>
            <div className="flex-1" />
          </div>
          
          <div className="p-4">
            <ul className="space-y-2">
              {requiredItems.map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <span className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center text-xs ${
                    item.isComplete 
                      ? 'border-green-500 bg-green-100 text-green-600' 
                      : 'border-red-500 bg-red-50'
                  }`}>
                    {item.isComplete ? '✓' : '!'}
                  </span>
                  <div className="flex-1">
                    <span className={`hand-drawn text-sm font-semibold ${
                      item.isComplete ? 'text-gray-500 line-through' : 'text-black'
                    }`}>
                      {item.label}
                    </span>
                    {!item.isComplete && (
                      <p className="hand-drawn text-xs text-gray-600 mt-1">
                        {item.message}
                      </p>
                    )}
                  </div>
                  {!item.isComplete && onActionClick && (
                    <button
                      type="button"
                      onClick={() => onActionClick(item.target)}
                      className="hand-drawn text-xs font-bold text-yellow-600 hover:text-yellow-700 underline"
                    >
                      Fix →
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Optional Items */}
        {optionalItems.length > 0 && (
          <div className="browser-window border-gray-300">
            <div className="browser-header bg-gray-100">
              <div className="browser-controls">
                <div className="browser-dot yellow" />
                <div className="browser-dot yellow" />
                <div className="browser-dot yellow" />
              </div>
              <div className="flex-1" />
              <span className="hand-drawn text-xs font-bold text-gray-600">
                💡 RECOMMENDED ({completedOptional}/{optionalItems.length})
              </span>
              <div className="flex-1" />
            </div>
            
            <div className="p-4">
              <ul className="space-y-2">
                {optionalItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <span className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center text-xs ${
                      item.isComplete 
                        ? 'border-green-500 bg-green-100 text-green-600' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {item.isComplete ? '✓' : ''}
                    </span>
                    <div className="flex-1">
                      <span className={`hand-drawn text-sm font-semibold ${
                        item.isComplete ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Legacy format using LaunchReadinessResult
  if (!readiness) {
    return null;
  }
  
  const { isReady, score, blockers, warnings, suggestions } = readiness;
  
  return (
    <div className="browser-window">
      <div className="browser-header">
        <div className="browser-controls">
          <div className={`browser-dot ${isReady ? 'green' : 'red'}`} />
          <div className={`browser-dot ${isReady ? 'green' : 'yellow'}`} />
          <div className={`browser-dot ${isReady ? 'green' : 'yellow'}`} />
        </div>
        <div className="flex-1" />
        <span className="hand-drawn text-xs font-bold">
          {isReady ? '✓ READY TO LAUNCH' : '⚠️ NOT READY'}
        </span>
        <div className="flex-1" />
      </div>
      
      <div className="p-4">
        {/* Score */}
        <div className="flex items-center justify-between mb-3">
          <span className="hand-drawn text-sm font-bold text-black">
            Readiness Score
          </span>
          <span className={`hand-drawn text-xl font-bold ${
            score >= 80 ? 'text-green-600' :
            score >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}%
          </span>
        </div>
        
        <div className="h-3 bg-white border-4 border-black rounded-full overflow-hidden mb-4">
          <div
            className={`h-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-400' :
              score >= 50 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        {/* Blockers */}
        {blockers.length > 0 && (
          <div className="mb-4">
            <h4 className="hand-drawn text-sm font-bold text-red-600 mb-2">
              🚫 Must Fix Before Launch:
            </h4>
            <ul className="space-y-1">
              {blockers.map((blocker, idx) => (
                <li key={idx} className="hand-drawn text-sm font-semibold text-red-700 flex items-start gap-2">
                  <span>•</span>
                  <span>{blocker.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-4">
            <h4 className="hand-drawn text-sm font-bold text-yellow-600 mb-2">
              ⚠️ Recommended Improvements:
            </h4>
            <ul className="space-y-1">
              {warnings.map((warning, idx) => (
                <li key={idx} className="hand-drawn text-sm font-semibold text-yellow-700 flex items-start gap-2">
                  <span>•</span>
                  <span>{warning.message}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Success message */}
        {isReady && (
          <p className="hand-drawn text-sm font-bold text-green-600">
            ✓ Your campaign meets all requirements. Ready to launch! 🚀
          </p>
        )}
      </div>
    </div>
  );
}
