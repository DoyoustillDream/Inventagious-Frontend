'use client';

import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete?: () => void;
}

export default function SuccessAnimation({ onComplete }: SuccessAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Success checkmark animation */}
      <div
        className={`relative w-24 h-24 mb-6 transition-all duration-500 ${
          isAnimating ? 'scale-100' : 'scale-90'
        }`}
      >
        {/* Circle */}
        <div
          className={`absolute inset-0 border-4 border-green-500 rounded-full transition-all duration-500 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
          }`}
        />
        
        {/* Checkmark */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={4}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Success message */}
      <h2 className="hand-drawn text-2xl font-bold text-black mb-2">
        Success!
      </h2>
      <p className="hand-drawn text-base font-bold text-gray-700 text-center">
        Your wallet is connected and ready to use
      </p>
    </div>
  );
}

