'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing video:', error);
        setIsPlaying(false);
      }
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Auto-play video on mount with optimized loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    const playVideo = async () => {
      if (!mounted) return;
      
      try {
        // Ensure video is muted for autoplay
        video.muted = true;
        
        // Wait for video to be ready (HAVE_CURRENT_DATA or higher)
        if (video.readyState >= 2) {
          await video.play();
          if (mounted) setIsPlaying(true);
        } else {
          // Wait for loadedmetadata event
          const handleLoadedMetadata = async () => {
            if (!mounted) return;
            try {
              await video.play();
              if (mounted) setIsPlaying(true);
            } catch (error) {
              console.error('Error auto-playing video:', error);
              if (mounted) setIsPlaying(false);
            }
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          };
          video.addEventListener('loadedmetadata', handleLoadedMetadata);
        }
      } catch (error) {
        console.error('Error auto-playing video:', error);
        if (mounted) setIsPlaying(false);
      }
    };

    // Try to play after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      playVideo();
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
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
                {imageError && !imageLoaded && (
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
                    onLoad={() => {
                      setImageLoaded(true);
                      setImageError(false);
                    }}
                    onError={() => {
                      // Show gradient fallback if image doesn't exist
                      setImageError(true);
                      setImageLoaded(false);
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

            {/* Video Player */}
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                isPlaying ? 'z-10 opacity-100' : 'z-0 opacity-0 pointer-events-none'
              }`}
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
              controls
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onPause={handlePause}
              onPlay={() => {
                setIsPlaying(true);
              }}
              onLoadedMetadata={() => {
                // Video metadata loaded - autoplay will be handled by useEffect
                // This handler is mainly for ensuring smooth loading
              }}
            >
              <source src="/videos/Trailers-1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
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

