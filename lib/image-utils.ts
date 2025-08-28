/**
 * Converts Google Drive URLs to direct image URLs that work with Next.js Image component
 */
export function convertGoogleDriveUrl(url: string): string {
  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com/file/d/')) {
    // Extract the file ID from the URL
    const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      const fileId = match[1];
      // Convert to direct image URL
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
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
}

/**
 * Checks if a URL is a Google Drive URL
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com');
}

/**
 * Gets the optimized image URL for Next.js Image component
 */
export function getOptimizedImageUrl(url: string): string {
  if (isGoogleDriveUrl(url)) {
    return convertGoogleDriveUrl(url);
  }
  return url;
}
