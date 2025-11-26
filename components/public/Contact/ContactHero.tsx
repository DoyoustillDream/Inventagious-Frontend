'use client';

import { useEffect, useRef } from 'react';

export default function ContactHero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 },
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="bg-yellow-400 halftone-bg py-16 md:py-24">
      <div
        ref={contentRef}
        className="container mx-auto px-4 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hand-drawn mb-6 text-4xl md:text-6xl font-bold text-black">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
            Have questions? We're here to help. Reach out to our support team.
          </p>
        </div>
      </div>
    </section>
  );
}

