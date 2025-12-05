'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64: string) => void;
  label: string;
  aspectRatio?: { width: number; height: number };
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  previewClassName?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  aspectRatio,
  maxSizeMB = 5,
  maxWidth,
  maxHeight,
  previewClassName = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessImage = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
          reject(new Error(`Image size must be less than ${maxSizeMB}MB`));
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          reject(new Error('File must be an image'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            // Check dimensions if specified
            // Allow exactly maxWidth/maxHeight (add small tolerance for floating point precision)
            const widthTolerance = 0.5; // Allow 0.5px tolerance for precision issues
            const heightTolerance = 0.5;
            
            if (maxWidth && img.width > maxWidth + widthTolerance) {
              reject(new Error(`Image width must be at most ${maxWidth}px (current: ${Math.round(img.width)}px)`));
              return;
            }
            if (maxHeight && img.height > maxHeight + heightTolerance) {
              reject(new Error(`Image height must be at most ${maxHeight}px (current: ${Math.round(img.height)}px)`));
              return;
            }

            // Check aspect ratio if specified
            if (aspectRatio) {
              const imageAspectRatio = img.width / img.height;
              const targetAspectRatio = aspectRatio.width / aspectRatio.height;
              const tolerance = 0.1; // 10% tolerance

              if (Math.abs(imageAspectRatio - targetAspectRatio) > tolerance) {
                reject(
                  new Error(
                    `Image aspect ratio must be ${aspectRatio.width}:${aspectRatio.height} (±10%)`,
                  ),
                );
                return;
              }
            }

            // Create canvas to resize if needed
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Resize if dimensions exceed limits
            if (maxWidth && width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            if (maxHeight && height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Failed to process image'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);
            const resizedDataUrl = canvas.toDataURL(file.type, 0.9);
            resolve(resizedDataUrl);
          };
          img.onerror = () => {
            reject(new Error('Failed to load image'));
          };
          img.src = e.target?.result as string;
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
      });
    },
    [aspectRatio, maxSizeMB, maxWidth, maxHeight],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);
      setIsUploading(true);

      try {
        const base64 = await validateAndProcessImage(file);
        setPreview(base64);
        onChange(base64);
      } catch (err: any) {
        setError(err.message || 'Failed to process image');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setIsUploading(false);
      }
    },
    [validateAndProcessImage, onChange],
  );

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="hand-drawn block text-sm font-bold mb-2 text-black">{label}</label>

      {preview ? (
        <div className="relative">
          <div className={`relative ${previewClassName}`}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg border-4 border-black"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 border-3 border-black rounded-full text-white font-bold transition hover:scale-110"
              aria-label="Remove image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-black bg-gray-50 hover:bg-gray-100 rounded-lg p-8 text-center cursor-pointer transition"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div>
              <p className="text-sm font-bold text-gray-700">Processing...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <svg
                className="mx-auto w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm font-bold text-black">Click to upload image</p>
              <p className="text-xs text-gray-600">
                Max {maxSizeMB}MB
                {aspectRatio && ` • ${aspectRatio.width}:${aspectRatio.height} ratio`}
                {maxWidth && maxHeight && ` • Max ${maxWidth}×${maxHeight}px`}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border-3 border-red-500 rounded-lg">
          <p className="text-sm font-bold text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}

