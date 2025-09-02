// Default dimensions for YouTube videos
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 360;
const ASPECT_RATIO = 16 / 9;

// Get default dimensions maintaining aspect ratio
export const getDefaultDimensions = (width?: number, height?: number) => {
  if (width && height) {
    return { width, height };
  }
  
  if (width) {
    return {
      width,
      height: Math.round(width / ASPECT_RATIO)
    };
  }
  
  if (height) {
    return {
      width: Math.round(height * ASPECT_RATIO),
      height
    };
  }
  
  return {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  };
};

// Extract video ID from YouTube URL
const getYouTubeVideoId = (url: string): string | null => {
  try {
    // Handle youtu.be URLs
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split(/[#?]/)[0];
      return id || null;
    }
    
    // Handle youtube.com URLs
    if (url.includes('youtube.com/')) {
      const urlObj = new URL(url);
      // Handle watch URLs
      if (url.includes('/watch')) {
        return urlObj.searchParams.get('v');
      }
      // Handle embed URLs
      if (url.includes('/embed/')) {
        return url.split('/embed/')[1]?.split(/[#?]/)[0] || null;
      }
    }
    
    // Handle direct video IDs
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }
    
    return null;
  } catch {
    return null;
  }
};

// Check if URL is a valid YouTube URL
export const isValidYouTubeUrl = (url: string): boolean => {
  return !!getYouTubeVideoId(url);
};

// Get YouTube embed URL
export const getYouTubeEmbedUrl = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};
