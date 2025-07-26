import React, { useState } from 'react';
import { PlayIcon, ClockIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { PlayIcon as PlayIconSolid } from '@heroicons/react/24/solid';

const YouTubeVideoCard = ({ video, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatTimeAgo = (publishedAt) => {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay(video);
    } else {
      // Open YouTube video in new tab
      const videoUrl = `https://www.youtube.com/watch?v=${video.id.videoId || video.id}`;
      window.open(videoUrl, '_blank');
    }
  };

  const getTypeIcon = () => {
    if (video.type === 'podcast') {
      return '🎙️';
    }
    return '📺';
  };

  const getTypeBadge = () => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    if (video.type === 'podcast') {
      return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
    }
    return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
  };

  const thumbnailUrl = imageError 
    ? 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=320&h=180&fit=crop'
    : video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Thumbnail Section */}
      <div 
        className="relative aspect-video bg-gray-200 dark:bg-gray-700 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <img
          src={thumbnailUrl}
          alt={video.snippet.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        
        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-red-600 hover:bg-red-700 rounded-full p-3 transform scale-100 hover:scale-110 transition-transform duration-200">
            <PlayIconSolid className="h-6 w-6 text-white ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={getTypeBadge()}>
            {getTypeIcon()} {video.type === 'podcast' ? 'Podcast' : 'News'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Channel Info */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
            {video.channelName ? video.channelName.charAt(0) : 'Y'}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {video.channelName || 'YouTube'}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
          {video.snippet.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {video.snippet.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {video.viewCount && (
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>{video.viewCount}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formatTimeAgo(video.snippet.publishedAt)}</span>
            </div>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full transition-colors duration-200"
          >
            <PlayIcon className="h-3 w-3" />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeVideoCard;
