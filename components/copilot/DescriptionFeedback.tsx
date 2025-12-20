'use client';

import { DescriptionQualityResult } from '@/lib/copilot/types';

interface DescriptionFeedbackProps {
  result: DescriptionQualityResult | null;
  isLoading?: boolean;
}

export default function DescriptionFeedback({ result, isLoading }: DescriptionFeedbackProps) {
  if (isLoading) {
    return (
      <div className="mt-3 border-4 border-gray-300 bg-gray-50 p-3">
        <span className="hand-drawn text-xs font-bold text-gray-500 animate-pulse">
          🤖 Analyzing your description...
        </span>
      </div>
    );
  }
  
  if (!result) {
    return null;
  }
  
  const qualityColors = {
    high: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600' },
    medium: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600' },
    low: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600' },
  };
  
  const colors = qualityColors[result.quality];
  
  // Check marks for each element
  const elements = [
    { key: 'problem', label: 'Problem', check: result.hasProblemClarity, tip: 'What problem do you solve?' },
    { key: 'audience', label: 'Audience', check: result.hasTargetAudience, tip: 'Who is this for?' },
    { key: 'unique', label: 'Unique', check: result.hasDifferentiation, tip: 'What makes you different?' },
    { key: 'cta', label: 'Call to Action', check: result.hasCallToAction, tip: 'Why support now?' },
  ];
  
  const completedCount = elements.filter((e) => e.check).length;
  
  return (
    <div className={`mt-3 border-4 ${colors.border} ${colors.bg} p-3`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="hand-drawn text-xs font-bold text-gray-700">
          ✨ COPILOT ANALYSIS
        </span>
        <div className="flex items-center gap-2">
          <span className="hand-drawn text-xs font-bold text-gray-600">
            {result.wordCount} words
          </span>
          <span className={`hand-drawn text-sm font-bold ${colors.text}`}>
            {result.score}/100
          </span>
        </div>
      </div>
      
      {/* Element checks */}
      <div className="flex flex-wrap gap-2 mb-2">
        {elements.map((el) => (
          <span
            key={el.key}
            className={`hand-drawn text-xs font-bold px-2 py-1 border-2 ${
              el.check
                ? 'border-green-500 bg-green-100 text-green-700'
                : 'border-gray-300 bg-white text-gray-500'
            }`}
            title={el.tip}
          >
            {el.check ? '✓' : '○'} {el.label}
          </span>
        ))}
      </div>
      
      {/* Feedback message */}
      {result.quality === 'high' ? (
        <p className="hand-drawn text-xs font-bold text-green-600">
          ✓ Great description! You've covered all the key elements.
        </p>
      ) : result.quality === 'medium' ? (
        <p className="hand-drawn text-xs font-bold text-yellow-600">
          Good start! Add more detail about: {result.missingElements.slice(0, 2).join(', ')}
        </p>
      ) : (
        <p className="hand-drawn text-xs font-bold text-red-600">
          Needs work: {result.missingElements.slice(0, 2).join(', ')}
        </p>
      )}
      
      {/* Suggestions */}
      {result.suggestions && result.suggestions.length > 0 && result.quality !== 'high' && (
        <div className="mt-2 pt-2 border-t-2 border-gray-200">
          <span className="hand-drawn text-xs font-bold text-gray-500">TIP: </span>
          <span className="hand-drawn text-xs font-semibold text-gray-600">
            {result.suggestions[0]}
          </span>
        </div>
      )}
    </div>
  );
}
