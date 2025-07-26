import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  UserIcon, 
  Cog6ToothIcon, 
  BellIcon, 
  GlobeAltIcon,
  ChartBarIcon,
  BookOpenIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const ProfilePage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    digest: true,
    trending: true
  })

  const [preferences, setPreferences] = useState({
    language: user?.preferences?.language || 'en',
    theme: user?.preferences?.theme || 'light',
    autoPlay: false,
    readingLevel: 'intermediate'
  })

  const readingHistory = [
    {
      id: 1,
      title: "AI Breakthrough: New Language Model Shows Human-Level Understanding",
      category: "Technology",
      readAt: "2024-01-15T10:30:00Z",
      timeSpent: "3 min"
    },
    {
      id: 2,
      title: "Global Markets React to Central Bank Policy Changes",
      category: "Business",
      readAt: "2024-01-15T09:15:00Z",
      timeSpent: "4 min"
    },
    {
      id: 3,
      title: "Climate Summit Yields Historic Agreement on Carbon Reduction",
      category: "World",
      readAt: "2024-01-15T08:45:00Z",
      timeSpent: "5 min"
    }
  ]

  const stats = {
    articlesRead: 127,
    timeSpent: "8h 23m",
    categories: user?.preferences?.categories?.length || 6,
    bookmarks: 23
  }

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const formatReadDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <UserIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your preferences and view your reading history
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'profile', name: 'Profile', icon: UserIcon },
              { id: 'preferences', name: 'Preferences', icon: Cog6ToothIcon },
              { id: 'notifications', name: 'Notifications', icon: BellIcon },
              { id: 'history', name: 'Reading History', icon: ClockIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-blue-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'User'}</h3>
                <p className="text-gray-600">{user?.email || user?.phone || 'No contact info'}</p>
                <p className="text-sm text-gray-500">Member since January 2024</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.articlesRead}</div>
                <div className="text-sm text-gray-600">Articles Read</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.timeSpent}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.categories}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.bookmarks}</div>
                <div className="text-sm text-gray-600">Bookmarks</div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Reading Pattern</p>
                    <p className="text-sm text-blue-700">
                      You prefer {user?.preferences?.categories?.join(', ') || 'technology and business'} articles
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HeartIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Interests</p>
                    <p className="text-sm text-green-700">
                      {user?.preferences?.categories?.join(', ') || 'AI, Finance, Climate Change'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reading Preferences</h3>
            
            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex space-x-4">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <label key={theme} className="flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={preferences.theme === theme}
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reading Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Level
                </label>
                <select
                  value={preferences.readingLevel}
                  onChange={(e) => handlePreferenceChange('readingLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Auto-play */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Auto-play audio</p>
                  <p className="text-sm text-gray-500">Automatically play text-to-speech when opening articles</p>
                </div>
                <button
                  onClick={() => handlePreferenceChange('autoPlay', !preferences.autoPlay)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    preferences.autoPlay ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.autoPlay ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
          
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 capitalize">
                    {key === 'email' ? 'Email notifications' :
                     key === 'push' ? 'Push notifications' :
                     key === 'digest' ? 'Daily digest' :
                     'Trending alerts'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {key === 'email' ? 'Receive notifications via email' :
                     key === 'push' ? 'Receive push notifications in browser' :
                     key === 'digest' ? 'Get a daily summary of top stories' :
                     'Get notified about trending topics'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    value ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reading History</h3>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </button>
            </div>
            
            <div className="space-y-4">
              {readingHistory.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatReadDate(article.readAt)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {article.timeSpent} read
                      </span>
                    </div>
                  </div>
                  <BookOpenIcon className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage 