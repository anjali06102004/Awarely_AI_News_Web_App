import { useState, useEffect } from 'react'
import TrendingChart from '../components/TrendingChart'
import NewsCard from '../components/NewsCard'
import TrendingTopics from '../components/TrendingTopics'
import OnThisDay from '../components/OnThisDay'
import AIInsights from '../components/AIInsights'
import AIChatAssistant from '../components/AIChatAssistant'
import AITrendPredictor from '../components/AITrendPredictor'
import AISmartSearch from '../components/AISmartSearch'
import FloatingActionButton from '../components/FloatingActionButton'
import ThemeToggle from '../components/ThemeToggle'
import EnhancedNavBar from '../components/EnhancedNavBar'
import EnhancedSearchBar from '../components/EnhancedSearchBar'
import PublisherPortal from '../components/PublisherPortal'
import YouTubeSection from '../components/YouTubeSection'
import newsApiService from '../services/newsApi'
import aiService from '../services/aiService'
import { MapPinIcon, TagIcon, FunnelIcon, GlobeAltIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const HomePage = ({ searchQuery }) => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem('selectedCategory') || 'all'
  )
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showAIInsights, setShowAIInsights] = useState(false)
  const [showChatAssistant, setShowChatAssistant] = useState(false)
  const [showSmartSearch, setShowSmartSearch] = useState(false)
  const [showTrendPredictor, setShowTrendPredictor] = useState(false)
  const [showEnhancedSearch, setShowEnhancedSearch] = useState(false)
  const [showPublisherPortal, setShowPublisherPortal] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [aiRecommendations, setAIRecommendations] = useState([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [newsStats, setNewsStats] = useState({ totalSources: 0, countries: 0, domains: 0 })
  const [showAllNews, setShowAllNews] = useState(false)

  // Define categories, countries, and domains arrays
  const categories = [
    { id: 'all', name: 'All News', icon: '📰' },
    { id: 'trending', name: 'Trending', icon: '📈' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'politics', name: 'Politics', icon: '🏛️' },
    { id: 'sports', name: 'Sports', icon: '🏅' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'health', name: 'Health', icon: '🧬' },
    { id: 'world', name: 'World', icon: '🌍' },
    { id: 'environment', name: 'Environment', icon: '🌱' },
    { id: 'education', name: 'Education', icon: '📚' }
  ]

  const countries = [
    { code: 'us', name: 'United States' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'ca', name: 'Canada' },
    { code: 'au', name: 'Australia' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'jp', name: 'Japan' },
    { code: 'in', name: 'India' },
    { code: 'br', name: 'Brazil' },
    { code: 'mx', name: 'Mexico' },
    { code: 'it', name: 'Italy' },
    { code: 'es', name: 'Spain' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'se', name: 'Sweden' },
    { code: 'no', name: 'Norway' }
  ]

  const domains = ['technology', 'business', 'politics', 'sports', 'entertainment', 'science', 'health', 'world', 'general']

  // Fetch Enhanced Global News
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        let newsData
        
        // Use enhanced global news fetching with filters
        if (selectedCategory === 'technology' || selectedCategory === 'all') {
          newsData = await newsApiService.fetchGlobalNews({
            category: selectedCategory === 'all' ? 'general' : selectedCategory,
            country: selectedLocation || null,
            domain: selectedDomain || null,
            pageSize: 30
          })
        } else {
          newsData = await newsApiService.fetchNewsByCategory(
            selectedCategory, 
            1, 
            30, 
            selectedLocation || null, 
            selectedDomain || null
          )
        }
        
        setNews(newsData.articles || [])
        
        // Update news stats
        setNewsStats({
          totalSources: newsData.sources || 0,
          countries: newsApiService.getAvailableCountries().length,
          domains: newsApiService.getAvailableDomains().length
        })
      } catch (error) {
        console.error('Error fetching news:', error)
        // Fallback to mock data if API fails
        const fallbackData = await newsApiService.getMockNewsByCategory(selectedCategory)
        setNews(fallbackData.articles || [])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [selectedCategory, selectedLocation, selectedDomain])

  // Fetch AI recommendations
  useEffect(() => {
    const getAIRecommendations = async () => {
      if (news.length > 0) {
        try {
          const recommendations = await aiService.getRecommendations(
            { categories: [selectedCategory] },
            [],
            news[0]
          )
          setAIRecommendations(recommendations || [])
        } catch (error) {
          console.error('Error fetching AI recommendations:', error)
          setAIRecommendations([]) // Set empty array on error
        }
      }
    }

    getAIRecommendations()
  }, [news, selectedCategory])

  // Enhanced event handlers with error handling
  const handleSearchResults = (results, query) => {
    try {
      setSearchResults({ results: results?.articles || [], query })
    } catch (error) {
      console.error('Error handling search results:', error)
      setSearchResults(null)
    }
  }

  const handleArticleSelect = (article) => {
    if (article && article.id) {
      setSelectedArticle(article)
      setShowAIInsights(true)
    }
  }

  const handleNewsSubmitted = (newArticle) => {
    try {
      if (newArticle && newArticle.title) {
        // Add the new article to the top of the news list
        setNews(prevNews => [newArticle, ...prevNews])
        setShowPublisherPortal(false)
      }
    } catch (error) {
      console.error('Error handling news submission:', error)
    }
  }

  const handleLocationChange = (location) => {
    try {
      setSelectedLocation(location)
      if (location) {
        localStorage.setItem('selectedLocation', location)
      } else {
        localStorage.removeItem('selectedLocation')
      }
    } catch (error) {
      console.error('Error handling location change:', error)
    }
  }

  const handleDomainChange = (domain) => {
    try {
      setSelectedDomain(domain)
      if (domain) {
        localStorage.setItem('selectedDomain', domain)
      } else {
        localStorage.removeItem('selectedDomain')
      }
    } catch (error) {
      console.error('Error handling domain change:', error)
    }
  }

  const clearFilters = () => {
    try {
      setSelectedLocation('')
      setSelectedDomain('')
      localStorage.removeItem('selectedLocation')
      localStorage.removeItem('selectedDomain')
    } catch (error) {
      console.error('Error clearing filters:', error)
    }
  }

  const closeAllModals = () => {
    try {
      setShowAIInsights(false)
      setShowChatAssistant(false)
      setShowSmartSearch(false)
      setShowTrendPredictor(false)
      setShowEnhancedSearch(false)
      setShowPublisherPortal(false)
    } catch (error) {
      console.error('Error closing modals:', error)
    }
  }

  // Filter news based on search query and selected filters
  const filteredNews = searchResults 
    ? searchResults.results 
    : news.filter(article => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'trending') {
            // For trending, we can use engagement metrics or just return recent articles
            return true // For now, show all articles for trending
          }
          // Check if article category matches selected category
          const articleCategory = article.category?.toLowerCase() || 'general'
          if (articleCategory !== selectedCategory) return false
        }

        // Search query filter
        if (searchQuery && searchQuery.trim()) {
          const term = searchQuery.trim().toLowerCase()
          const title = article.title?.toLowerCase() || ''
          const description = article.description?.toLowerCase() || ''
          const content = article.content?.toLowerCase() || ''
          
          if (!title.includes(term) && !description.includes(term) && !content.includes(term)) {
            return false
          }
        }

        return true
      })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Navigation Bar */}
      <EnhancedNavBar 
        onSearchResults={handleSearchResults}
        onNewsSubmitted={handleNewsSubmitted}
      />

      {/* Main Content */}
      <div className="pt-20 sm:pt-24 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-7xl mx-auto">
        {/* Header Section with Stats */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Global News On Your FingerTips!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Stay updated with the latest news from around the world
              </p>
            </div>
            
            {/* Stats Cards - Responsive */}
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <GlobeAltIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
                  {newsStats.countries} Countries
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TagIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">
                  {newsStats.domains} Domains
                </span>
              </div>
            </div>
          </div>

          {/* Category Tabs - Responsive */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Filters Section - Mobile Optimized */}
          <div className="space-y-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              <FunnelIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({(selectedLocation ? 1 : 0) + (selectedDomain ? 1 : 0)} active)
              </span>
            </button>

            {showFilters && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MapPinIcon className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">All Countries</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Domain Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <TagIcon className="h-4 w-4 inline mr-1" />
                      Domain
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => handleDomainChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="">All Domains</option>
                      {domains.map((domain) => (
                        <option key={domain} value={domain}>
                          {domain.charAt(0).toUpperCase() + domain.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {(selectedLocation || selectedDomain) && (
                  <button
                    onClick={clearFilters}
                    className="w-full sm:w-auto px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}

                {/* Active Filters Display */}
                {(selectedLocation || selectedDomain) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                    {selectedLocation && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                        📍 {countries.find(c => c.code === selectedLocation)?.name}
                      </span>
                    )}
                    {selectedDomain && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                        🏷️ {selectedDomain.charAt(0).toUpperCase() + selectedDomain.slice(1)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* News Feed - Takes full width on mobile/tablet, 3/4 on desktop */}
          <div className="xl:col-span-3">
            {loading ? (
              <div className="space-y-4 sm:space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 h-40 sm:h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* News Articles Section */}
                <div className="space-y-4">
                  {/* Display limited news initially */}
                  {filteredNews.slice(0, showAllNews ? filteredNews.length : 6).map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                  
                  {/* Read More / Show Less Button */}
                  {filteredNews.length > 6 && (
                    <div className="text-center py-6">
                      <button
                        onClick={() => setShowAllNews(!showAllNews)}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        {showAllNews ? (
                          <>
                            <ChevronUpIcon className="h-5 w-5 mr-2" />
                            Show Less News
                          </>
                        ) : (
                          <>
                            <ChevronDownIcon className="h-5 w-5 mr-2" />
                            Read More News ({filteredNews.length - 6} more articles)
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  
                  {filteredNews.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">📰</div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Try adjusting your filters or search terms
                      </p>
                    </div>
                  )}
                </div>

                {/* YouTube Videos & Podcasts Section */}
                <div className="mt-8">
                  <YouTubeSection 
                    category={selectedCategory} 
                    searchQuery={searchResults?.query || ''} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stacked on mobile/tablet, sidebar on desktop */}
          <div className="xl:col-span-1">
            <div className="space-y-4 sm:space-y-6">
              {/* Mobile: Show sidebar components in a horizontal scroll or grid */}
              <div className="xl:space-y-6 xl:block">
                {/* On mobile/tablet: horizontal scroll for sidebar components */}
                <div className="xl:hidden">
                  <div className="flex space-x-4 overflow-x-auto pb-4">
                    <div className="flex-shrink-0 w-72">
                      <TrendingTopics />
                    </div>
                    <div className="flex-shrink-0 w-72">
                      <AITrendPredictor articles={news} />
                    </div>
                    <div className="flex-shrink-0 w-72">
                      <TrendingChart articles={news} />
                    </div>
                    <div className="flex-shrink-0 w-72">
                      <OnThisDay />
                    </div>
                  </div>
                </div>

                {/* On desktop: normal vertical stack */}
                <div className="hidden xl:block space-y-6">
                  <TrendingTopics />
                  <AITrendPredictor articles={news} />
                  <TrendingChart articles={news} />
                  <OnThisDay />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Responsive positioning */}
      <FloatingActionButton
        onOpenChat={() => setShowChatAssistant(true)}
        onOpenSearch={() => setShowSmartSearch(true)}
        onOpenTrends={() => setShowTrendPredictor(true)}
        onOpenAI={() => setShowAIInsights(true)}
      />

      {/* AI Modals - Responsive */}
      {showChatAssistant && (
        <AIChatAssistant
          articles={searchResults ? searchResults.results : filteredNews}
          onClose={() => setShowChatAssistant(false)}
        />
      )}

      {showSmartSearch && (
        <AISmartSearch
          articles={news}
          onSearchResults={handleSearchResults}
          onClose={() => setShowSmartSearch(false)}
        />
      )}

      {showAIInsights && selectedArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">AI Article Analysis</h3>
                <button
                  onClick={() => setShowAIInsights(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <AIInsights article={selectedArticle} />
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Search Modal */}
      {showEnhancedSearch && (
        <EnhancedSearchBar
          onSearchResults={handleSearchResults}
          onClose={() => setShowEnhancedSearch(false)}
        />
      )}

      {/* Publisher Portal Modal */}
      {showPublisherPortal && (
        <PublisherPortal
          onClose={() => setShowPublisherPortal(false)}
          onNewsSubmitted={handleNewsSubmitted}
        />
      )}
    </div>
  )
}

export default HomePage
