import { useState, useEffect } from 'react'
import { BookmarkIcon, TrashIcon, PencilIcon, TagIcon } from '@heroicons/react/24/outline'
import NewsCard from '../components/NewsCard'

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState('all')
  const [showAnnotations, setShowAnnotations] = useState(false)

  useEffect(() => {
    const mockBookmarks = [
      {
        id: 1,
        title: "AI Breakthrough: New Language Model Shows Human-Level Understanding",
        summary: "Researchers at OpenAI have developed a new language model that demonstrates unprecedented understanding of context and nuance...",
        content: "The latest breakthrough in artificial intelligence has researchers excited about the potential for more human-like AI interactions. The new model, called GPT-5, shows remarkable improvements in understanding context, detecting sarcasm, and generating more coherent responses.",
        author: "Sarah Johnson",
        publishedAt: "2024-01-15T10:30:00Z",
        source: "Tech Daily",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        category: "Technology",
        sentiment: "positive",
        readTime: "3 min read",
        bookmarked: true,
        tags: ['AI', 'Technology', 'Research'],
        annotation: "Important development in AI. Need to follow up on the implications for our industry.",
        savedAt: "2024-01-15T11:00:00Z"
      },
      {
        id: 2,
        title: "Global Markets React to Central Bank Policy Changes",
        summary: "Major stock markets around the world showed mixed reactions as central banks announced coordinated policy adjustments...",
        content: "Financial markets experienced significant volatility as central banks from major economies announced coordinated policy changes. The Federal Reserve, European Central Bank, and Bank of Japan all signaled a shift toward more accommodative monetary policies.",
        author: "Michael Chen",
        publishedAt: "2024-01-15T09:15:00Z",
        source: "Business Times",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
        category: "Business",
        sentiment: "neutral",
        readTime: "4 min read",
        bookmarked: true,
        tags: ['Finance', 'Markets', 'Policy'],
        annotation: "Key development for investment strategy. Monitor market reactions.",
        savedAt: "2024-01-15T09:45:00Z"
      }
    ]
    
    setTimeout(() => {
      setBookmarks(mockBookmarks)
      setLoading(false)
    }, 1000)
  }, [])

  const allTags = ['all', ...new Set(bookmarks.flatMap(bookmark => bookmark.tags || []))]

  const filteredBookmarks = selectedTag === 'all' 
    ? bookmarks 
    : bookmarks.filter(bookmark => bookmark.tags?.includes(selectedTag))

  const handleRemoveBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  const formatSavedDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <BookmarkIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
        </div>
        <p className="text-gray-600">
          Your saved articles and personal annotations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookmarks</p>
              <p className="text-2xl font-bold text-gray-900">{bookmarks.length}</p>
            </div>
            <BookmarkIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">With Annotations</p>
              <p className="text-2xl font-bold text-gray-900">
                {bookmarks.filter(b => b.annotation).length}
              </p>
            </div>
            <PencilIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(bookmarks.map(b => b.category)).size}
              </p>
            </div>
            <TagIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Filter by tag:</span>
          <div className="flex space-x-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            showAnnotations
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showAnnotations ? 'Hide' : 'Show'} Annotations
        </button>
      </div>

      {/* Bookmarks */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks found</h3>
            <p className="text-gray-600">
              {selectedTag === 'all' 
                ? "You haven't saved any articles yet. Start bookmarking interesting stories!"
                : `No bookmarks found with the tag "${selectedTag}"`
              }
            </p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="relative">
              <NewsCard article={bookmark} />
              
              {/* Bookmark-specific controls */}
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Saved date */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Saved {formatSavedDate(bookmark.savedAt)}
                </div>
              </div>

              {/* Tags */}
              {bookmark.tags && bookmark.tags.length > 0 && (
                <div className="absolute bottom-4 left-4 z-10 flex space-x-1">
                  {bookmark.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Annotation */}
              {showAnnotations && bookmark.annotation && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <PencilIcon className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 mb-1">Your Note:</p>
                      <p className="text-sm text-yellow-700">{bookmark.annotation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BookmarksPage 