import React, { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { getYouTubeInfo, getFallbackThumbnail } from '../utils/youtube';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onClose }) => {
  const [thumbnailError, setThumbnailError] = useState(false);
  const youtubeInfo = getYouTubeInfo(videoUrl);

  if (!youtubeInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-lg font-semibold mb-4">Invalid Video URL</h3>
          <p className="text-gray-600 mb-4">The provided URL is not a valid YouTube video.</p>
          <button
            onClick={onClose}
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleGoToYouTube = () => {
    window.open(youtubeInfo.watchUrl, '_blank');
  };

  const handleThumbnailError = () => {
    setThumbnailError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-4xl mx-4">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
        
        {/* Video Player */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`${youtubeInfo.embedUrl}?autoplay=1&rel=0`}
            title={title}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        
        {/* Video Title and YouTube Button */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <button
            onClick={handleGoToYouTube}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Watch on YouTube</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 