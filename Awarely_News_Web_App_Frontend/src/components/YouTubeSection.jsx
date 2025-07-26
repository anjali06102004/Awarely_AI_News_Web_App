import React, { useState, useEffect } from 'react';
import { PlayIcon, TvIcon, MicrophoneIcon, FunnelIcon } from '@heroicons/react/24/outline';
import YouTubeVideoCard from './YouTubeVideoCard';
import youtubeService from '../services/youtubeService';

const YouTubeSection = ({ category = 'all', searchQuery = '' }) => {
  const [videos, setVideos] = useState([]);
  const [educationalContent, setEducationalContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'news', 'educational'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    fetchYouTubeContent();
  }, [category, searchQuery]);

  const fetchYouTubeContent = async () => {
    try {
      setLoading(true);
      
      if (searchQuery) {
        // Search for specific content
        const searchResults = await youtubeService.searchNewsVideos(searchQuery, 20);
        setVideos(searchResults);
        setEducationalContent([]);
      } else {
        // Get content by category
        const [newsContent, educationalContentData] = await Promise.all([
          youtubeService.getContentByCategory(category, 'news'),
          youtubeService.getEducationalContent(10)
        ]);
        
        setVideos(newsContent);
        setEducationalContent(educationalContentData);
      }
    } catch (error) {
      console.error('Error fetching YouTube content:', error);
      // Use mock data as fallback
      setVideos(youtubeService.getMockYouTubeContent());
      setEducationalContent(youtubeService.getMockEducationalContent());
    } finally {
      setLoading(false);
    }
  };

  const handleVideoPlay = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  const getFilteredContent = () => {
    switch (activeTab) {
      case 'news':
        return videos;
      case 'educational':
        return educationalContent;
      default:
        return [...videos, ...educationalContent].sort((a, b) => 
          new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt)
        );
    }
  };

  const filteredContent = getFilteredContent();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <PlayIcon className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Video & Podcast News
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-600 aspect-video rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <PlayIcon className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Video & Educational News
          </h2>
          <span className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs px-2 py-1 rounded-full">
            {filteredContent.length} items
          </span>
          <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full">
            Copyright Safe
          </span>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All ({videos.length + educationalContent.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center ${
              activeTab === 'news'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TvIcon className="h-4 w-4 mr-1" />
            News ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('educational')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center ${
              activeTab === 'educational'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MicrophoneIcon className="h-4 w-4 mr-1" />
            Educational ({educationalContent.length})
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContent.map((item, index) => (
            <YouTubeVideoCard
              key={`${item.id.videoId || item.id}-${index}`}
              video={item}
              onPlay={handleVideoPlay}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PlayIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No videos found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or category filters.
          </p>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedVideo.snippet.title}
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id.videoId || selectedVideo.id}?autoplay=1`}
                title={selectedVideo.snippet.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  {selectedVideo.channelName ? selectedVideo.channelName.charAt(0) : 'Y'}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedVideo.channelName || 'YouTube'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedVideo.snippet.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSection;
