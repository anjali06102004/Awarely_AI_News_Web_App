import { useState, useEffect } from 'react'
import { FireIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import NewsCard from '../components/NewsCard'

const TrendingPage = () => {
  const [trendingNews, setTrendingNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('24h')

  useEffect(() => {
    const mockTrendingNews = [
      {
        id: 1,
        title: "Viral: AI Creates Realistic Human Faces That Don't Exist",
        summary: "A new AI system has generated photorealistic human faces that are completely synthetic, raising questions about digital identity...",
        content: "The latest breakthrough in generative AI has created a sensation across social media. The system, developed by researchers at a leading tech company, can generate photorealistic human faces that are completely synthetic but indistinguishable from real photographs.",
        author: "Alex Thompson",
        publishedAt: "2024-01-15T12:00:00Z",
        source: "Tech Viral",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
        category: "Technology",
        sentiment: "positive",
        readTime: "4 min read",
        bookmarked: false,
        viralScore: 95,
        shares: 12500,
        views: 250000
      },
      {
        id: 2,
        title: "Breaking: Major Social Media Platform Announces Revolutionary Changes",
        summary: "In a surprise announcement, the platform revealed plans to completely redesign its algorithm and user interface...",
        content: "One of the world's largest social media platforms has announced sweeping changes to its algorithm and user interface. The changes, which will roll out over the next six months, aim to prioritize meaningful content over viral engagement.",
        author: "Maria Garcia",
        publishedAt: "2024-01-15T11:30:00Z",
        source: "Digital News",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=250&fit=crop",
        category: "Technology",
        sentiment: "neutral",
        readTime: "3 min read",
        bookmarked: true,
        viralScore: 88,
        shares: 8900,
        views: 180000
      },
      {
        id: 3,
        title: "Scientists Discover New Species in Amazon Rainforest",
        summary: "A team of researchers has identified a previously unknown species of butterfly with unique wing patterns...",
        content: "In a remarkable discovery, scientists have identified a new species of butterfly in the Amazon rainforest. The butterfly, named Morpho amazonicus, features unique wing patterns that have never been documented before.",
        author: "Dr. Sarah Chen",
        publishedAt: "2024-01-15T10:15:00Z",
        source: "Science Daily",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
        category: "Science",
        sentiment: "positive",
        readTime: "5 min read",
        bookmarked: false,
        viralScore: 82,
        shares: 6700,
        views: 145000
      }
    ]
    
    setTimeout(() => {
      setTrendingNews(mockTrendingNews)
      setLoading(false)
    }, 1000)
  }, [])

  const timeFilters = [
    { id: '1h', name: '1 Hour' },
    { id: '24h', name: '24 Hours' },
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <FireIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-900">Trending Now</h1>
        </div>
        <p className="text-gray-600">
          The most viral and talked-about stories across the web
        </p>
      </div>

      {/* Time Filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Time period:</span>
          <div className="flex space-x-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  timeFilter === filter.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">2.4M</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">+12% from yesterday</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Viral Stories</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
            <FireIcon className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-sm text-orange-600 mt-2">+8 new today</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-sm text-blue-600 mt-2">+5% from yesterday</p>
        </div>
      </div>

      {/* Trending News */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          trendingNews.map((article) => (
            <div key={article.id} className="relative">
              <NewsCard article={article} />
              {/* Viral Score Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  🔥 {article.viralScore}
                </div>
              </div>
              {/* Stats */}
              <div className="absolute top-4 right-4 z-10 flex space-x-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                  👁 {article.views.toLocaleString()}
                </div>
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                  📤 {article.shares.toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TrendingPage 