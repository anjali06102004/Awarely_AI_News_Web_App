import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  MicrophoneIcon, 
  PhotoIcon, 
  DocumentTextIcon,
  GlobeAltIcon,
  MapPinIcon,
  TagIcon,
  UserPlusIcon,
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import EnhancedSearchBar from './EnhancedSearchBar';
import PublisherPortal from './PublisherPortal';
import Sidebar from './Sidebar';

const EnhancedNavBar = ({ onSearchResults, onNewsSubmitted, onMenuClick, searchQuery, setSearchQuery }) => {
  const [showEnhancedSearch, setShowEnhancedSearch] = useState(false);
  const [showPublisherPortal, setShowPublisherPortal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fallback function if onMenuClick is not provided
  const handleMenuClick = onMenuClick || (() => {
    console.log('Using fallback menu click handler');
    setSidebarOpen(true);
  });

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery.trim()) {
      // Trigger quick search with current searchQuery
      onSearchResults({ query: searchQuery }, searchQuery);
      setShowMobileSearch(false); // Close mobile search after search
    }
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Menu and Logo */}
            <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
              {/* Burger Menu Icon - Always visible */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Burger menu clicked!');
                  console.log('onMenuClick function:', typeof onMenuClick);
                  console.log('handleMenuClick function:', typeof handleMenuClick);
                  handleMenuClick();
                }}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-200 flex-shrink-0 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer"
                aria-label="Open menu"
                title="Open navigation menu"
                type="button"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <Link to="/home" className="flex items-center space-x-2 min-w-0">
                <span className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">📰 Awarely</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden lg:block whitespace-nowrap">
                  Global News Platform
                </span>
              </Link>
            </div>

            {/* Center Section - Enhanced Search (Desktop & Tablet) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6">
              <form onSubmit={handleQuickSearch} className="relative w-full">
                <div className="flex items-center space-x-2 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-gray-50 dark:bg-gray-700">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news, topics, or ask AI..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-base"
                  />
                  
                  {/* Voice Search Button */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                      isListening 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Voice Search"
                  >
                    <MicrophoneIcon className="h-4 w-4" />
                  </button>

                  {/* Advanced Search Button */}
                  <button
                    type="button"
                    onClick={() => setShowEnhancedSearch(true)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                    title="Advanced Search with Image & Filters"
                  >
                    <PhotoIcon className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Section - Action Buttons and User Menu */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              {/* Mobile Search Button */}
              <button
                onClick={() => setShowMobileSearch(true)}
                className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Search"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              {/* Publisher Portal Button */}
              <button
                onClick={() => setShowPublisherPortal(true)}
                className="hidden sm:flex items-center space-x-1 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors text-sm"
                title="Publisher Portal - Submit News"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span className="hidden lg:inline">Publish</span>
              </button>

              {/* Mobile Publisher Button */}
              <button
                onClick={() => setShowPublisherPortal(true)}
                className="sm:hidden p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Publisher Portal"
                aria-label="Publisher Portal"
              >
                <DocumentTextIcon className="h-5 w-5" />
              </button>

              {/* Global Coverage Indicator (Desktop only) */}
              <div className="hidden xl:flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <GlobeAltIcon className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Global</span>
              </div>

              {/* Notifications */}
              <button className="hidden sm:block p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <BellIcon className="h-5 w-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)} 
                  className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-6 w-6 rounded-full" />
                  ) : (
                    <UserCircleIcon className="h-6 w-6" />
                  )}
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      onClick={() => setShowUserMenu(false)} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setShowUserMenu(false)} 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    {/* Mobile-only links */}
                    <Link 
                      to="/bookmarks" 
                      onClick={() => setShowUserMenu(false)} 
                      className="sm:hidden block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Bookmarks
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-4">
              <form onSubmit={handleQuickSearch} className="relative">
                <div className="flex items-center space-x-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-gray-50 dark:bg-gray-700">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery || ''}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news, topics, or ask AI..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-base"
                    autoFocus
                  />
                  
                  {/* Voice Search Button */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                      isListening 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title="Voice Search"
                  >
                    <MicrophoneIcon className="h-4 w-4" />
                  </button>

                  {/* Advanced Search Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowEnhancedSearch(true);
                      setShowMobileSearch(false);
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors flex-shrink-0"
                    title="Advanced Search"
                  >
                    <PhotoIcon className="h-4 w-4" />
                  </button>

                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setShowMobileSearch(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0"
                    title="Close search"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Feature Highlights Bar (Responsive) */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center justify-center py-1 space-x-2 sm:space-x-4 lg:space-x-6 text-xs overflow-x-auto">
              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 whitespace-nowrap">
                <MicrophoneIcon className="h-3 w-3" />
                <span className="hidden xs:inline">Voice Search</span>
                <span className="xs:hidden">Voice</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400 whitespace-nowrap">
                <PhotoIcon className="h-3 w-3" />
                <span className="hidden xs:inline">Image Search</span>
                <span className="xs:hidden">Image</span>
              </div>
              <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400 whitespace-nowrap">
                <MapPinIcon className="h-3 w-3" />
                <span className="hidden sm:inline">15 Countries</span>
                <span className="sm:hidden">Global</span>
              </div>
              <div className="flex items-center space-x-1 text-orange-600 dark:text-orange-400 whitespace-nowrap">
                <TagIcon className="h-3 w-3" />
                <span className="hidden sm:inline">15+ Domains</span>
                <span className="sm:hidden">Topics</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Search Modal */}
      {showEnhancedSearch && (
        <EnhancedSearchBar
          onSearchResults={onSearchResults}
          onClose={() => setShowEnhancedSearch(false)}
        />
      )}

      {/* Publisher Portal Modal */}
      {showPublisherPortal && (
        <PublisherPortal
          onClose={() => setShowPublisherPortal(false)}
          onNewsSubmitted={onNewsSubmitted}
        />
      )}

      {/* Fallback Sidebar - only render if using internal state */}
      {!onMenuClick && (
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
    </>
  );
};

export default EnhancedNavBar;
