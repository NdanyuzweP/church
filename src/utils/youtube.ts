/**
 * YouTube utility functions for extracting video IDs and generating thumbnails
 */

export interface YouTubeInfo {
  videoId: string;
  thumbnailUrl: string;
  embedUrl: string;
  watchUrl: string;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtu\.be\/([^?\n#]+)/,
    /youtube\.com\/embed\/([^?\n#]+)/,
    /youtube\.com\/v\/([^?\n#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Validate video ID format (11 characters, alphanumeric, hyphens, underscores)
      const videoId = match[1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
  }
  
  return null;
}

/**
 * Generate YouTube thumbnail URL from video ID
 */
export function generateYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  const qualities = {
    default: 'default.jpg',
    medium: 'mqdefault.jpg',
    high: 'hqdefault.jpg',
    maxres: 'maxresdefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualities[quality]}`;
}

/**
 * Generate YouTube embed URL from video ID
 */
export function generateYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Get complete YouTube information from URL
 */
export function getYouTubeInfo(url: string): YouTubeInfo | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  
  return {
    videoId,
    thumbnailUrl: generateYouTubeThumbnail(videoId),
    embedUrl: generateYouTubeEmbedUrl(videoId),
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
}

/**
 * Check if a URL is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Get fallback thumbnail URL if maxres is not available
 */
export function getFallbackThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
} 