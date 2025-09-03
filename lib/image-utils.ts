/**
 * Converts Google Drive URLs to direct image URLs that work with Next.js Image component
 */
export function convertGoogleDriveUrl(url: string): string {
  try {
    if (!url) {
      return '/web-banner.png';
    }

    // Check if it's a Google Drive file URL (new format)
    if (url.includes('drive.google.com/file/d/')) {
      // Extract the file ID from the URL
      const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        const fileId = match[1];
        // Convert to direct image URL (old format that works)
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    
    // Check if it's a Google Drive folder URL
    if (url.includes('drive.google.com/drive/folders/')) {
      // Extract the folder ID from the URL
      const match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
      if (match) {
        const folderId = match[1];
        // For folders, we can't convert to a single image, so return a placeholder
        return '/web-banner.png';
      }
    }
    
    // If it's already a direct Google Drive URL (old format), return as is
    if (url.includes('drive.google.com/uc?export=view&id=')) {
      return url;
    }
    
    // Handle other Google Drive URL formats
    if (url.includes('drive.google.com/uc?id=')) {
      return url;
    }
    
    // If it's not a Google Drive URL, return the original URL
    return url;
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
    // Return a fallback image if conversion fails
    return '/web-banner.png';
  }
}

/**
 * Checks if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return Boolean(url && url.includes('drive.google.com'));
}

/**
 * Gets the optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(url: string): string {
  try {
    if (!url) {
      return '/web-banner.png';
    }
    
    if (isGoogleDriveUrl(url)) {
      return convertGoogleDriveUrl(url);
    }
    
    // Check if the URL is valid
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    
    // Return fallback for invalid URLs
    return '/web-banner.png';
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return '/web-banner.png';
  }
}

/**
 * Gets the product image URL with proper fallbacks
 */
export function getProductImageUrl(product: any): string {
  try {
    // If product has images array, get the primary image
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img: any) => img.isPrimary) || product.images[0];
      if (primaryImage && primaryImage.imageUrl) {
        return convertGoogleDriveUrl(primaryImage.imageUrl);
      }
    }
    
    // Fallback to product.imageUrl if it exists
    if (product.imageUrl) {
      return convertGoogleDriveUrl(product.imageUrl);
    }
    
    // Final fallback
    return '/web-banner.png';
  } catch (error) {
    console.error('Error getting product image URL:', error);
    return '/web-banner.png';
  }
}

/**
 * Auto-corrects and validates image URLs before saving
 * This function ensures URLs are properly formatted for display
 */
export function sanitizeImageUrl(url: string): string {
  try {
    if (!url || typeof url !== 'string') {
      return '/web-banner.png';
    }

    // Trim whitespace
    url = url.trim();

    // If it's already a relative path, return as is
    if (url.startsWith('/')) {
      return url;
    }

    // If it's a data URL, return as is
    if (url.startsWith('data:')) {
      return url;
    }

    // Handle Google Drive URLs
    if (url.includes('drive.google.com')) {
      return convertGoogleDriveUrl(url);
    }

    // Validate HTTP/HTTPS URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        new URL(url);
        return url;
      } catch {
        return '/web-banner.png';
      }
    }

    // If it's not a valid URL format, return fallback
    return '/web-banner.png';
  } catch (error) {
    console.error('Error sanitizing image URL:', error);
    return '/web-banner.png';
  }
}

/**
 * Gets a thumbnail URL for admin panel display
 * This ensures admin tiles show images properly
 */
export function getThumbnailUrl(url: string, size: number = 64): string {
  try {
    const sanitizedUrl = sanitizeImageUrl(url);
    
    // For Google Drive URLs, we can't resize, so return as is
    if (sanitizedUrl.includes('drive.google.com')) {
      return sanitizedUrl;
    }
    
    // For other URLs, return as is (admin panel will handle sizing)
    return sanitizedUrl;
  } catch (error) {
    console.error('Error getting thumbnail URL:', error);
    return '/web-banner.png';
  }
}
