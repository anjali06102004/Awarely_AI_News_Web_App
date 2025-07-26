import { useState } from 'react'
import { speakText, stopSpeaking } from '../utils/textTospeech';

import { 
  PlayIcon, 
  BookmarkIcon, 
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

const NewsCard = ({ article }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(article.bookmarked)
  const [showFullContent, setShowFullContent] = useState(false)

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(article.content)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 0.8
        
        utterance.onend = () => setIsPlaying(false)
        utterance.onerror = () => setIsPlaying(false)
        
        window.speechSynthesis.speak(utterance)
        setIsPlaying(true)
      }
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically make an API call to save/unsave the bookmark
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${article.title}\n\n${article.summary}`)
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      case 'neutral': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
            {article.sentiment}
          </span>
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleTextToSpeech}
            className={`p-2 rounded-full ${
              isPlaying 
                ? 'bg-red-100 text-red-600' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            {isPlaying ? <SpeakerXMarkIcon className="h-4 w-4" /> : <SpeakerWaveIcon className="h-4 w-4" />}
          </button>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-full ${
              isBookmarked 
                ? 'bg-blue-100 text-blue-600' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            {isBookmarked ? <BookmarkSolidIcon className="h-4 w-4" /> : <BookmarkIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span>{article.source}</span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <span className="text-xs font-medium text-blue-600">{article.category}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {article.title}
        </h2>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.summary}
        </p>

        {/* Author */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {article.author.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-600">{article.author}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <HeartIcon className="h-4 w-4" />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span>Comment</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ShareIcon className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Expand content button */}
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showFullContent ? 'Show less' : 'Read more'}
        </button>

        {/* Full content (expandable) */}
        {showFullContent && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {article.content}
            </p>
          </div>
        )}
      </div>
    </article>
  )
}

export default NewsCard 