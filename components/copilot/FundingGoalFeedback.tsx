'use client';

import { FundingGoalAnalysisResult } from '@/lib/copilot/types';

interface FundingGoalFeedbackProps {
  result: FundingGoalAnalysisResult | null;
  currentGoal?: number;
  isLoading?: boolean;
}

export default function FundingGoalFeedback({
  result,
  currentGoal = 0,
  isLoading = false,
}: FundingGoalFeedbackProps) {
  if (isLoading) {
    return (
      <div className="mt-3 border-4 border-gray-300 bg-gray-50 p-3">
        <span className="hand-drawn text-xs font-bold text-gray-500 animate-pulse">
          💰 Analyzing your funding goal...
        </span>
      </div>
    );
  }
  
  if (!result) {
    return null;
  }
  
  const riskColors = {
    low: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600' },
    high: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600' },
  };
  
  const colors = riskColors[result.riskLevel];
  
  return (
    <div className={`mt-3 border-4 ${colors.border} ${colors.bg} p-3`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="hand-drawn text-xs font-bold text-gray-700">
          💰 GOAL ANALYSIS
        </span>
        <span className={`hand-drawn text-sm font-bold ${colors.text}`}>
          {result.isRealistic ? '✓ Realistic' : '⚠️ Ambitious'}
        </span>
      </div>
      
      {/* Comparison with category average */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="hand-drawn font-semibold text-gray-600">
            Category Average
          </span>
          <span className="hand-drawn font-bold text-gray-700">
            ${result.categoryAverage.toLocaleString()}
          </span>
        </div>
        
        {result.percentAboveAverage !== 0 && (
          <p className={`hand-drawn text-xs font-semibold ${
            result.percentAboveAverage > 50 ? 'text-red-600' :
            result.percentAboveAverage > 0 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {result.percentAboveAverage > 0 
              ? `${Math.round(result.percentAboveAverage)}% above average`
              : `${Math.abs(Math.round(result.percentAboveAverage))}% below average`}
          </p>
        )}
      </div>
      
      {/* Recommended range */}
      {result.recommendedRange && (
        <div className="bg-white border-2 border-gray-200 p-2 mb-3">
          <span className="hand-drawn text-xs font-bold text-gray-600">
            Recommended Range:
          </span>
          <p className="hand-drawn text-sm font-bold text-black">
            ${result.recommendedRange.min.toLocaleString()} - ${result.recommendedRange.max.toLocaleString()}
          </p>
        </div>
      )}
      
      {/* Reasoning */}
      <p className="hand-drawn text-xs font-semibold text-gray-600 mb-2">
        {result.reasoning}
      </p>
      
      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="pt-2 border-t-2 border-gray-200">
          <span className="hand-drawn text-xs font-bold text-gray-500">TIPS: </span>
          <ul className="mt-1 space-y-1">
            {result.suggestions.slice(0, 2).map((suggestion, idx) => (
              <li key={idx} className="hand-drawn text-xs font-semibold text-gray-600 flex items-start gap-1">
                <span className="text-yellow-500">✦</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
