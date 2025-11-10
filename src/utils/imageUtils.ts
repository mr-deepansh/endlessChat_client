// src/utils/imageUtils.ts

/**
 * Image utility functions for handling broken images and fallbacks
 */

export interface ImageFallbackOptions {
  width?: number;
  height?: number;
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Creates a fallback SVG image for broken images
 */
export const createFallbackImage = (options: ImageFallbackOptions = {}): string => {
  const {
    width = 400,
    height = 300,
    text = 'Image unavailable',
    backgroundColor = '#f3f4f6',
    textColor = '#9ca3af',
  } = options;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="sans-serif" font-size="16" fill="${textColor}">
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Enhanced image error handler with logging and fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  originalSrc: string,
  fallbackOptions?: ImageFallbackOptions
) => {
  const target = event.target as HTMLImageElement;

  // Prevent infinite loop
  if (target.dataset.errorHandled) return;
  target.dataset.errorHandled = 'true';
  target.onerror = null;

  // Log the error for debugging
  console.warn(`⚠️ Image failed to load: ${originalSrc}`);

  // Try alternative Cloudinary transformations first
  if (isCloudinaryUrl(originalSrc) && !target.dataset.fallbackAttempted) {
    target.dataset.fallbackAttempted = 'true';
    // Try with different quality/format
    const fallbackUrl = originalSrc.replace('/upload/', '/upload/q_auto,f_auto/');
    if (fallbackUrl !== originalSrc) {
      target.src = fallbackUrl;
      target.onerror = e => handleImageError(e as any, fallbackUrl, fallbackOptions);
      return;
    }
  }

  // Set fallback image
  target.src = createFallbackImage(fallbackOptions);

  // Update cursor to indicate it's not clickable
  target.style.cursor = 'default';

  // Add error class for styling
  target.classList.add('image-error');
};

/**
 * Validates image URL and returns a safe URL
 */
export const validateImageUrl = (url: string | undefined | null): string | null => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Check if it's a valid URL
  try {
    new URL(url);
    return url;
  } catch {
    console.warn(`⚠️ Invalid image URL: ${url}`);
    return null;
  }
};

/**
 * Processes image array and filters out invalid URLs
 */
export const processImageArray = (
  images: (string | { url: string; publicId: string })[] | undefined
): (string | { url: string; publicId: string })[] => {
  if (!images || !Array.isArray(images)) {
    return [];
  }

  return images.filter(image => {
    if (typeof image === 'string') {
      return validateImageUrl(image) !== null;
    } else if (image && typeof image === 'object' && image.url) {
      return validateImageUrl(image.url) !== null;
    }
    return false;
  });
};

/**
 * Gets the actual URL from image object or string
 */
export const getImageUrl = (image: string | { url: string; publicId: string }): string => {
  if (typeof image === 'string') {
    return image;
  }
  return image.url;
};

/**
 * Checks if an image URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url: string): boolean => {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
};

/**
 * Logs image loading statistics
 */
export const logImageStats = (totalImages: number, failedImages: number) => {
  const successRate = totalImages > 0 ? ((totalImages - failedImages) / totalImages) * 100 : 0;

  console.log(`📊 Image Loading Stats:`);
  console.log(`   Total images: ${totalImages}`);
  console.log(`   Failed images: ${failedImages}`);
  console.log(`   Success rate: ${successRate.toFixed(1)}%`);

  if (failedImages > 0) {
    console.warn(
      `⚠️ ${failedImages} images failed to load. Check network connectivity and image URLs.`
    );
  }
};
