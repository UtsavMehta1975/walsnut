/**
 * Converts Google Drive URLs to direct image URLs that work with Next.js Image component
 */
export function convertGoogleDriveUrl(url: string): string {
  try {
    // Check if it's a Google Drive file URL
    if (url.includes('drive.google.com/file/d/')) {
      // Extract the file ID from the URL
      const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match) {
        const fileId = match[1];
        // Convert to direct image URL
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
    
    // If it's already a direct Google Drive URL, return as is
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
