'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    // TODO: Implement video playback logic
    // This could open a modal with the video or play inline
  };

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
            <picture>
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
                onError={(e) => {
                  // Fallback to gradient if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </picture>

            {/* Fallback gradient if image doesn't exist */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-200" />

            {/* Play Button Overlay */}
            {!isPlaying && (
              <button
                onClick={handlePlay}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border-4 border-black bg-yellow-400 px-8 py-4 shadow-lg transition-all hover:scale-110 hover:bg-yellow-500 active:scale-95"
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
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center text-white">
                  <p className="hand-drawn mb-4 text-xl font-bold">
                    Video Player Placeholder
                  </p>
                  <p className="text-sm">
                    Video integration coming soon. Replace this with your video player
                    component.
                  </p>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="mt-4 rounded border-2 border-white px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Close
                  </button>
                </div>
              </div>
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

