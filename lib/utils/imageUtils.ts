/**
 * Parse imageUrl - can be a single string or JSON array string
 * Returns an array of image URLs
 */
export function parseImages(imageUrl?: string): string[] {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) ? parsed : [imageUrl];
  } catch {
    return imageUrl ? [imageUrl] : [];
  }
}

/**
 * Get the first image from imageUrl
 * Useful for cards and thumbnails
 */
export function getFirstImage(imageUrl?: string): string | undefined {
  const images = parseImages(imageUrl);
  return images[0];
}

