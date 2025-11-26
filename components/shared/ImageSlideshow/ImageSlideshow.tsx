'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageSlideshowProps {
  images: string[];
  alt?: string;
  className?: string;
}

export default function ImageSlideshow({ 
  images, 
  alt = 'Project images',
  className = '' 
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`relative h-64 md:h-96 w-full bg-gradient-to-br from-yellow-400 to-yellow-200 flex items-center justify-center ${className}`}>
        <span className="text-6xl">💡</span>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Display */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-200">
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          fill
          className="object-cover"
          priority={currentIndex === 0}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
              aria-label="Previous image"
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
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
              aria-label="Next image"
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

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative w-20 h-20 md:w-24 md:h-24 border-4 transition-all ${
                index === currentIndex
                  ? 'border-yellow-400 scale-105'
                  : 'border-gray-300 opacity-70 hover:opacity-100'
              }`}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

