'use client';

import { useState, useRef } from 'react';
import { CreateProjectData } from '@/lib/api/projects';
import ImageSlideshow from '@/components/shared/ImageSlideshow/ImageSlideshow';

interface ProjectMediaInfoProps {
  imageUrl: string;
  videoUrl: string;
  onUpdate: <K extends keyof CreateProjectData>(
    field: K,
    value: CreateProjectData[K]
  ) => void;
}

const MAX_IMAGES = 4;

export default function ProjectMediaInfo({
  imageUrl,
  videoUrl,
  onUpdate,
}: ProjectMediaInfoProps) {
  // Parse imageUrl - can be a single string or JSON array string
  const parseImages = (url: string): string[] => {
    if (!url) return [];
    try {
      const parsed = JSON.parse(url);
      return Array.isArray(parsed) ? parsed : [url];
    } catch {
      return url ? [url] : [];
    }
  };

  const [images, setImages] = useState<string[]>(() => parseImages(imageUrl));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    // Store as JSON array string for backend compatibility
    const imageValue = newImages.length === 0 ? '' : JSON.stringify(newImages);
    onUpdate('imageUrl', imageValue);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed the limit
    const filesToAdd = Array.from(files).slice(0, MAX_IMAGES - images.length);
    
    if (files.length > filesToAdd.length) {
      alert(`You can only upload up to ${MAX_IMAGES} images. Only the first ${filesToAdd.length} will be added.`);
    }

    if (filesToAdd.length === 0) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    setIsUploading(true);

    try {
      const newImagePromises = filesToAdd.map((file) => {
        return new Promise<string>((resolve, reject) => {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            reject(new Error('Please upload an image file'));
            return;
          }

          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            reject(new Error('Image size must be less than 5MB'));
            return;
          }

          // Convert to base64 data URL
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String);
          };
          reader.onerror = () => {
            reject(new Error('Failed to read image file'));
          };
          reader.readAsDataURL(file);
        });
      });

      const newImages = await Promise.all(newImagePromises);
      updateImages([...images, ...newImages]);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    updateImages(newImages);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Project Images <span className="text-red-600">*</span>
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({images.length}/{MAX_IMAGES})
          </span>
        </label>
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isUploading || images.length >= MAX_IMAGES}
            className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 file:mr-4 file:py-2 file:px-4 file:border-4 file:border-black file:bg-yellow-400 file:hand-drawn file:font-bold file:cursor-pointer hover:file:bg-yellow-500 disabled:opacity-50"
          />
          {isUploading && (
            <p className="hand-drawn text-sm font-semibold text-gray-700">
              Uploading images...
            </p>
          )}
          {images.length > 0 && (
            <div className="mt-4 space-y-4">
              <ImageSlideshow images={images} alt="Project preview" />
              <div className="space-y-2">
                <p className="hand-drawn text-sm font-semibold text-gray-700">
                  Click on an image below to remove it:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative w-full h-24 border-4 border-black overflow-hidden">
                        <img
                          src={image}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 border-2 border-black font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="hand-drawn mt-2 text-sm font-semibold text-gray-700">
          Upload up to {MAX_IMAGES} images that represent your project (max 5MB each)
        </p>
      </div>

      <div>
        <label className="hand-drawn block text-base font-bold mb-3 text-black">
          Video URL (Optional)
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => onUpdate('videoUrl', e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="hand-drawn w-full border-4 border-black bg-white px-4 py-3 text-base font-bold text-black focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />
        <p className="hand-drawn mt-2 text-sm font-semibold text-gray-700">
          URL to a video showcasing your project (YouTube, Vimeo, etc.)
        </p>
      </div>
    </div>
  );
}
