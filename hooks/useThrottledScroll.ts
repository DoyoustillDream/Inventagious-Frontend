'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook for throttled scroll event handling using requestAnimationFrame
 * Provides optimal performance for scroll-based UI updates
 */
export function useThrottledScroll(
  callback: () => void,
  options: {
    enabled?: boolean;
    passive?: boolean;
  } = {}
) {
  const { enabled = true, passive = true } = options;
  const rafIdRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      // Schedule callback for next animation frame
      rafIdRef.current = requestAnimationFrame(() => {
        callbackRef.current();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive });
    handleScroll(); // Initial call

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [enabled, passive]);
}

/**
 * Hook that returns throttled scroll position values
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useThrottledScroll(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;
    
    setScrollY(scrollTop);
    setScrollProgress(scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0);
  });

  return { scrollY, scrollProgress };
}

