'use client';

import { useState, useMemo } from 'react';
import { useThrottledScroll } from '@/hooks/useThrottledScroll';

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Memoize window height to avoid recalculating
  const windowHeight = useMemo(() => {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight;
  }, []);

  useThrottledScroll(() => {
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;
    const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
    
    setScrollProgress(progress);
    // Hide indicator after user scrolls down a bit
    setIsVisible(scrollTop < windowHeight * 0.5);
  });

  const scrollToNext = () => {
    const windowHeight = window.innerHeight;
    window.scrollTo({
      top: windowHeight * 0.8,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 animate-bounce">
      <button
        onClick={scrollToNext}
        className="flex flex-col items-center gap-2 px-6 py-4 bg-[#FFEB3B] text-black font-bold rounded-lg border-4 border-black hover:bg-[#FFF9C4] transition-all duration-200 hover:scale-105 active:scale-95 shadow-[6px_6px_0_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0_rgba(0,0,0,0.3)]"
        aria-label="Scroll down to see more"
      >
        <span className="text-sm">Scroll to explore</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>
  );
}

