'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
    // Play the video when button is clicked
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Reset video when it ends
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleEnded = () => {
        setIsPlaying(false);
        video.currentTime = 0;
      };
      video.addEventListener('ended', handleEnded);
      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="hand-drawn text-4xl md:text-5xl font-bold text-black">
            How Inventagious works
          </h2>
          <Link
            href="/about"
            className="hand-drawn inline-flex items-center rounded-lg border-4 border-black bg-white px-6 py-3 text-base font-bold text-black transition hover:bg-yellow-400 sm:w-auto"
          >
            <span>Learn more</span>
          </Link>
        </header>

        {/* Video Preview Container */}
        <div className="relative mb-8 overflow-hidden rounded-lg border-4 border-black bg-gray-200">
          <div className="relative aspect-video w-full">
            {/* Video Thumbnail/Preview Image */}
            {!isPlaying && (
              <>
                {/* Fallback gradient - only shows if image fails to load */}
                {imageError && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200 z-0" />
                )}
                
                <picture className="absolute inset-0 z-0">
                  <source
                    media="(max-width: 360px)"
                    srcSet="/images/video-thumbnail-mobile.jpg"
                  />
                  <source
                    media="(min-width: 361px)"
                    srcSet="/images/video-thumbnail-desktop.jpg"
                  />
                  <Image
                    src="/images/video-thumbnail-desktop.jpg"
                    alt="How Inventagious works video preview"
                    fill
                    className="object-cover"
                    loading="lazy"
                    onError={() => {
                      // Show gradient fallback if image doesn't exist
                      setImageError(true);
                    }}
                  />
                </picture>
              </>
            )}

            {/* Subtle overlay for better play button visibility */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            )}

            {/* Play Button Overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-10 rounded-lg border-4 border-black bg-yellow-400 px-8 py-4 shadow-2xl transition-all hover:scale-110 hover:bg-yellow-500 hover:shadow-3xl active:scale-95"
                type="button"
                aria-label="Play video: How Inventagious works"
              >
                <div className="flex items-center gap-3">
                  <svg
                    aria-hidden="true"
                    className="h-8 w-8 fill-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" fill="currentColor" />
                  </svg>
                  <span className="hand-drawn text-lg font-bold text-black">
                    Play 1 min video
                  </span>
                </div>
              </button>
            )}

            {/* Video Player (when playing) */}
            {isPlaying && (
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                onPause={handlePause}
                onEnded={handlePause}
              >
                <source src="/videos/Trailers-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>

        {/* Bottom Learn More Button */}
        <div className="text-center">
          <Link
            href="/about"
            className="hand-drawn inline-flex items-center rounded-lg border-4 border-black bg-white px-8 py-4 text-lg font-bold text-black transition hover:bg-yellow-400"
          >
            <span>Learn more</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

