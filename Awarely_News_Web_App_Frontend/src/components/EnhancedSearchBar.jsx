import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, MicrophoneIcon, PhotoIcon, MapPinIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline';
import newsApiService from '../services/newsApi';

const EnhancedSearchBar = ({ onSearchResults, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const countries = newsApiService.getAvailableCountries();
  const domains = newsApiService.getAvailableDomains();

  // Handle text search
  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await newsApiService.advancedSearch({
        textQuery: searchQuery,
        location: selectedLocation || null,
        domain: selectedDomain || null,
        dateRange: dateRange.start && dateRange.end ? dateRange : null
      });
      
      setSearchResults(results);
      onSearchResults(results, searchQuery);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle voice search
  const handleVoiceSearch = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice search is not supported in your browser');
      return;
    }

    if (isVoiceRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsVoiceRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          
          // For now, we'll use Web Speech API for demonstration
          if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = async (event) => {
              const transcript = event.results[0][0].transcript;
              setSearchQuery(transcript);
              
              // Automatically search with voice query
              setIsSearching(true);
              try {
                const results = await newsApiService.advancedSearch({
                  voiceQuery: transcript,
                  location: selectedLocation || null,
                  domain: selectedDomain || null,
                  dateRange: dateRange.start && dateRange.end ? dateRange : null
                });
                
                setSearchResults(results);
                onSearchResults(results, transcript);
              } catch (error) {
                console.error('Voice search error:', error);
              } finally {
                setIsSearching(false);
              }
            };
            
            recognition.onerror = (event) => {
              console.error('Speech recognition error:', event.error);
              alert('Voice recognition failed. Please try again.');
            };
            
            recognition.start();
          } else {
            // Fallback to service method
            const result = await newsApiService.voiceSearch(audioBlob);
            if (result.success) {
              setSearchQuery(result.query);
              setSearchResults({ articles: result.articles });
              onSearchResults({ articles: result.articles }, result.query);
            } else {
              alert(result.message);
            }
          }
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsVoiceRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Could not access microphone. Please check permissions.');
      }
    }
  };

  // Handle image search
  const handleImageSearch = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    setIsSearching(true);
    try {
      const result = await newsApiService.imageSearch(file);
      if (result.success) {
        setSearchQuery(result.keywords.join(' '));
        setSearchResults({ articles: result.articles });
        onSearchResults({ articles: result.articles }, result.keywords.join(' '));
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Image search error:', error);
      alert('Image search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTextSearch();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced News Search
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search Interface */}
        <div className="p-6 space-y-6">
          {/* Main Search Bar */}
          <div className="relative">
            <div className="flex items-center space-x-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for news, topics, or keywords..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
              />
              
              {/* Voice Search Button */}
              <button
                onClick={handleVoiceSearch}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isVoiceRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
                }`}
                title={isVoiceRecording ? 'Stop recording' : 'Voice search'}
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>

              {/* Image Search Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500"
                title="Image search"
              >
                <PhotoIcon className="h-5 w-5" />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSearch}
                className="hidden"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <MapPinIcon className="h-4 w-4 mr-1" />
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Locations</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Domain Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <TagIcon className="h-4 w-4 mr-1" />
                Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Domains</option>
                {domains.map(domain => (
                  <option key={domain} value={domain}>
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleTextSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  <span>Search News</span>
                </>
              )}
            </button>
          </div>

          {/* Search Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Search Tips:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use the microphone icon for voice search</li>
              <li>• Upload an image to search for related news</li>
              <li>• Filter by location and domain for specific results</li>
              <li>• Set date ranges to find historical news</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchBar;
