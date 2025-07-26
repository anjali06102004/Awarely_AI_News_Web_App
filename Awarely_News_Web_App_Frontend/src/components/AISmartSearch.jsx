import { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon,
  MicrophoneIcon,
  SparklesIcon,
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import aiService from '../services/aiService';

const AISmartSearch = ({ articles, onSearchResults, onClose }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [smartFilters, setSmartFilters] = useState({
    sentiment: 'all',
    timeframe: 'all',
    complexity: 'all'
  });
  const recognition = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }

    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history.slice(0, 5));

    // Generate smart suggestions
    generateSmartSuggestions();
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      generateRealTimeSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const generateSmartSuggestions = () => {
    const smartSuggestions = [
      'Latest AI breakthroughs',
      'Climate change solutions',
      'Quantum computing advances',
      'Space exploration news',
      'Biotechnology innovations',
      'Renewable energy trends',
      'Cybersecurity threats',
      'Financial market analysis'
    ];
    setSuggestions(smartSuggestions);
  };

  const generateRealTimeSuggestions = (searchQuery) => {
    const relatedSuggestions = [
      `${searchQuery} latest news`,
      `${searchQuery} analysis`,
      `${searchQuery} trends`,
      `${searchQuery} expert opinions`,
      `${searchQuery} market impact`
    ];
    setSuggestions(relatedSuggestions);
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    try {
      // Perform AI-enhanced search
      const results = await aiService.enhancedSearch(searchQuery, articles);
      
      // Apply smart filters
      const filteredResults = applySmartFilters(results);
      
      // Save to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // Return results to parent component
      onSearchResults(filteredResults, searchQuery);
      
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const applySmartFilters = (results) => {
    let filtered = results;

    // Sentiment filter
    if (smartFilters.sentiment !== 'all') {
      filtered = filtered.filter(article => 
        (article.sentiment || 'neutral') === smartFilters.sentiment
      );
    }

    // Timeframe filter
    if (smartFilters.timeframe !== 'all') {
      const now = new Date();
      const timeframeDays = {
        '24h': 1,
        '7d': 7,
        '30d': 30
      };
      
      const days = timeframeDays[smartFilters.timeframe];
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(article => 
          new Date(article.publishedAt) > cutoff
        );
      }
    }

    return filtered;
  };

  const startVoiceSearch = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopVoiceSearch = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectSuggestion = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-white/20 rounded-lg mr-3">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">AI Smart Search</h3>
                <p className="text-sm opacity-90">Intelligent news discovery</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center bg-white/10 rounded-xl p-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-white/70 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the news..."
                className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
              />
              <button
                onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                className={`p-2 rounded-lg ml-2 transition-colors ${
                  isListening 
                    ? 'bg-red-500/20 text-red-200' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <MicrophoneIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleSearch()}
                disabled={isSearching || !query.trim()}
                className="bg-white/20 hover:bg-white/30 disabled:opacity-50 px-4 py-2 rounded-lg ml-2 transition-colors"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {isListening && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                <div className="flex items-center text-red-200 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></div>
                  Listening... Speak now
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {/* Smart Filters */}
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Smart Filters</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500">Sentiment</label>
                <select
                  value={smartFilters.sentiment}
                  onChange={(e) => setSmartFilters({...smartFilters, sentiment: e.target.value})}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Timeframe</label>
                <select
                  value={smartFilters.timeframe}
                  onChange={(e) => setSmartFilters({...smartFilters, timeframe: e.target.value})}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Complexity</label>
                <select
                  value={smartFilters.complexity}
                  onChange={(e) => setSmartFilters({...smartFilters, complexity: e.target.value})}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="simple">Simple</option>
                  <option value="moderate">Moderate</option>
                  <option value="complex">Complex</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(historyItem)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-600 transition-colors"
                  >
                    {historyItem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smart Suggestions */}
          <div className="p-6">
            <div className="flex items-center mb-3">
              <LightBulbIcon className="h-4 w-4 text-yellow-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">
                {query.length > 2 ? 'Related Searches' : 'Trending Topics'}
              </h4>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 group-hover:text-blue-700">
                      {suggestion}
                    </span>
                    <ArrowTrendingUpIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISmartSearch;
