'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import ImageModal from './ImageModal';
import { isYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '@/lib/utils/videoUtils';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  embedUrl?: string;
  thumbnail?: string;
}

interface ImageSlideshowProps {
  images: string[];
  videoUrl?: string;
  alt?: string;
  className?: string;
}

export default function ImageSlideshow({ 
  images, 
  videoUrl,
  alt = 'Project images',
  className = '' 
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine images and video into a single media array
  const mediaItems: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = [];
    
    // Add images
    if (images && images.length > 0) {
      images.forEach((image) => {
        items.push({ type: 'image', url: image });
      });
    }
    
    // Add video if it's a YouTube URL
    if (videoUrl && isYouTubeUrl(videoUrl)) {
      const embedUrl = getYouTubeEmbedUrl(videoUrl);
      const thumbnail = getYouTubeThumbnailUrl(videoUrl);
      if (embedUrl) {
        items.push({
          type: 'video',
          url: videoUrl,
          embedUrl,
          thumbnail: thumbnail || undefined,
        });
      }
    }
    
    return items;
  }, [images, videoUrl]);

  if (mediaItems.length === 0) {
    return (
      <div className={`relative h-64 md:h-96 w-full bg-gradient-to-br from-yellow-400 to-yellow-200 flex items-center justify-center ${className}`}>
        <span className="text-6xl">💡</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentMedia = mediaItems[currentIndex];
  const isVideo = currentMedia?.type === 'video';

  return (
    <>
      <div className={`relative w-full ${className}`}>
        {/* Main Media Display */}
        <div 
          className="relative h-64 md:h-96 w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200 cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          {isVideo && currentMedia.thumbnail ? (
            <>
              <Image
                src={currentMedia.thumbnail}
                alt={`${alt} - Video thumbnail`}
                fill
                className="object-cover"
                priority={currentIndex === 0}
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                <div className="bg-red-600 rounded-full p-4 md:p-6 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 md:w-12 md:h-12 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <Image
              src={currentMedia.url}
              alt={`${alt} - ${currentMedia.type === 'image' ? 'Image' : 'Media'} ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          )}

          {/* Click indicator */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            Click to expand
          </div>

          {/* Navigation Arrows */}
          {mediaItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
                aria-label="Previous media"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
                aria-label="Next media"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Media Counter */}
          {mediaItems.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">
              {currentIndex + 1} / {mediaItems.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {mediaItems.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 relative w-20 h-20 md:w-24 md:h-24 border-4 transition-all ${
                  index === currentIndex
                    ? 'border-yellow-400 scale-105'
                    : 'border-gray-300 opacity-70 hover:opacity-100'
                }`}
                aria-label={`Go to ${item.type} ${index + 1}`}
              >
                {item.type === 'video' && item.thumbnail ? (
                  <>
                    <Image
                      src={item.thumbnail}
                      alt={`${alt} video thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </>
                ) : (
                  <Image
                    src={item.url}
                    alt={`${alt} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal for expanded view */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        src={isVideo ? (currentMedia.thumbnail || '') : currentMedia.url}
        alt={`${alt} - ${isVideo ? 'Video' : 'Image'} ${currentIndex + 1}`}
        isVideo={isVideo}
        videoUrl={isVideo ? currentMedia.embedUrl : undefined}
      />
    </>
  );
}

