import React, { useState, useEffect } from 'react'
import { 
  ClockIcon, 
  EyeIcon, 
  HeartIcon, 
  ShareIcon, 
  BookmarkIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import advancedAI from '../services/advancedAI'

const AIEnhancedNewsCard = ({ article, onSelect, onBookmark, onShare }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [showFullSummary, setShowFullSummary] = useState(false)

  useEffect(() => {
    const analyzeArticle = async () => {
      try {
        setLoading(true)
        const [summary, quality, sentiment, category] = await Promise.all([
          advancedAI.summarizeArticle(article),
          advancedAI.assessContentQuality(article),
          advancedAI.analyzeSentiment(article.title + ' ' + (article.description || '')),
          advancedAI.categorizeNews(article)
        ])

        setAiAnalysis({
          summary,
          quality,
          sentiment,
          category,
          readingTime: summary.readingTime
        })
      } catch (error) {
        console.error('Error analyzing article:', error)
      } finally {
        setLoading(false)
      }
    }

    analyzeArticle()
  }, [article])

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getQualityBadge = (score) => {
    if (score > 0.8) return { text: 'High Quality', color: 'bg-green-500', icon: CheckBadgeIcon }
    if (score > 0.6) return { text: 'Good Quality', color: 'bg-blue-500', icon: CheckBadgeIcon }
    if (score > 0.4) return { text: 'Fair Quality', color: 'bg-yellow-500', icon: ExclamationTriangleIcon }
    return { text: 'Low Quality', color: 'bg-red-500', icon: ExclamationTriangleIcon }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInHours = Math.floor((now - publishedDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  const handleBookmark = (e) => {
    e.stopPropagation()
    setBookmarked(!bookmarked)
    if (onBookmark) onBookmark(article)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    if (onShare) onShare(article)
  }

  const qualityBadge = aiAnalysis ? getQualityBadge(aiAnalysis.quality.overallScore) : null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group">
      {/* Header with AI badges */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {article.source?.name && (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {article.source.name}
              </span>
            )}
            {aiAnalysis && (
              <span className={`px-2 py-1 text-xs rounded-full ${getSentimentColor(aiAnalysis.sentiment)}`}>
                {aiAnalysis.sentiment}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {qualityBadge && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-white text-xs ${qualityBadge.color}`}>
                <qualityBadge.icon className="w-3 h-3" />
                <span>{qualityBadge.text}</span>
              </div>
            )}
            {aiAnalysis?.readingTime && (
              <div className="flex items-center space-x-1 text-gray-500 text-xs">
                <ClockIcon className="w-3 h-3" />
                <span>{aiAnalysis.readingTime} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Article Image */}
        {article.urlToImage && (
          <div className="relative mb-4 rounded-lg overflow-hidden">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            {aiAnalysis?.category && (
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {aiAnalysis.category}
              </div>
            )}
          </div>
        )}

        {/* Title */}
        <h3 
          className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={() => onSelect && onSelect(article)}
        >
          {article.title}
        </h3>

        {/* AI Summary */}
        {aiAnalysis?.summary && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <SparklesIcon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Summary</span>
            </div>
            <p className={`text-sm text-gray-600 dark:text-gray-300 ${showFullSummary ? '' : 'line-clamp-2'}`}>
              {aiAnalysis.summary.summary}
            </p>
            {aiAnalysis.summary.summary.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFullSummary(!showFullSummary)
                }}
                className="text-blue-600 hover:text-blue-800 text-sm mt-1"
              >
                {showFullSummary ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Key Points */}
        {aiAnalysis?.summary?.keyPoints && aiAnalysis.summary.keyPoints.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Points:</h4>
            <ul className="space-y-1">
              {aiAnalysis.summary.keyPoints.slice(0, 3).map((point, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Original Description (fallback) */}
        {!aiAnalysis?.summary && article.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <span>{formatTimeAgo(article.publishedAt)}</span>
            {article.author && (
              <span>By {article.author}</span>
            )}
          </div>
          {aiAnalysis?.quality && (
            <div className="flex items-center space-x-1">
              <span>Quality:</span>
              <div className="w-12 bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${aiAnalysis.quality.overallScore * 100}%` }}
                />
              </div>
              <span>{Math.round(aiAnalysis.quality.overallScore * 100)}%</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              {liked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="text-sm">Like</span>
            </button>
            
            <button
              onClick={handleBookmark}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              {bookmarked ? (
                <BookmarkSolidIcon className="w-5 h-5 text-blue-500" />
              ) : (
                <BookmarkIcon className="w-5 h-5" />
              )}
              <span className="text-sm">Save</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
            >
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          <button
            onClick={() => onSelect && onSelect(article)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Read Full Article
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-blue-600">
            <SparklesIcon className="w-5 h-5 animate-spin" />
            <span className="text-sm">AI analyzing...</span>
          </div>
        </div>
      )}

      {/* Trending Indicator */}
      {aiAnalysis?.quality?.engagement > 0.8 && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <ArrowTrendingUpIcon className="w-3 h-3" />
          <span>Trending</span>
        </div>
      )}
    </div>
  )
}

export default AIEnhancedNewsCard
