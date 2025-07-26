import { Link } from 'react-router-dom'
import { 
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  BookmarkIcon,
  UserIcon,
  GlobeAltIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  NewspaperIcon,
  TvIcon,
  MicrophoneIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  FireIcon,
  StarIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  BeakerIcon,
  MusicalNoteIcon,
  FilmIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'

const Sidebar = ({ isOpen, onClose }) => {
  // Main Navigation
  const navigation = [
    { name: 'Home', href: '/home', icon: HomeIcon, description: 'Latest news feed' },
    { name: 'Trending', href: '/trending', icon: FireIcon, description: 'What\'s hot now' },
    { name: 'Bookmarks', href: '/bookmarks', icon: BookmarkIcon, description: 'Saved articles' },
    { name: 'Profile', href: '/profile', icon: UserIcon, description: 'Your account' },
  ]

  // News Categories with icons
  const newsCategories = [
    { name: 'Breaking News', icon: NewspaperIcon, color: 'text-red-600', bgColor: 'bg-red-50', count: '24' },
    { name: 'Technology', icon: ComputerDesktopIcon, color: 'text-blue-600', bgColor: 'bg-blue-50', count: '156' },
    { name: 'Business', icon: BuildingOfficeIcon, color: 'text-green-600', bgColor: 'bg-green-50', count: '89' },
    { name: 'Politics', icon: GlobeAltIcon, color: 'text-purple-600', bgColor: 'bg-purple-50', count: '67' },
    { name: 'Sports', icon: StarIcon, color: 'text-orange-600', bgColor: 'bg-orange-50', count: '134' },
    { name: 'Entertainment', icon: FilmIcon, color: 'text-pink-600', bgColor: 'bg-pink-50', count: '78' },
    { name: 'Science', icon: BeakerIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-50', count: '45' },
    { name: 'Health', icon: HeartIcon, color: 'text-emerald-600', bgColor: 'bg-emerald-50', count: '92' },
    { name: 'World News', icon: GlobeAltIcon, color: 'text-cyan-600', bgColor: 'bg-cyan-50', count: '203' },
    { name: 'AI & Innovation', icon: LightBulbIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-50', count: '87' },
  ]

  // Regional/Location News
  const regions = [
    { name: 'United States', flag: '🇺🇸', count: '1.2k' },
    { name: 'United Kingdom', flag: '🇬🇧', count: '856' },
    { name: 'India', flag: '🇮🇳', count: '934' },
    { name: 'Canada', flag: '🇨🇦', count: '567' },
    { name: 'Australia', flag: '🇦🇺', count: '423' },
    { name: 'Germany', flag: '🇩🇪', count: '678' },
  ]

  // Quick Actions
  const quickActions = [
    { name: 'Live TV', icon: TvIcon, href: '/live', color: 'text-red-500' },
    { name: 'Podcasts', icon: MicrophoneIcon, href: '/podcasts', color: 'text-purple-500' },
    { name: 'Photo Stories', icon: CameraIcon, href: '/photos', color: 'text-blue-500' },
    { name: 'Weather', icon: MapPinIcon, href: '/weather', color: 'text-green-500' },
  ]

  const handleTopicClick = (topic) => {
    onClose()
    console.log(`Searching for topic: ${topic}`)
    // Add search functionality here
  }

  const handleCategoryClick = (category) => {
    onClose()
    console.log(`Filtering by category: ${category}`)
    // Add category filtering here
  }

  const handleRegionClick = (region) => {
    onClose()
    console.log(`Filtering by region: ${region}`)
    // Add region filtering here
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Awarely</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors group"
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    onClick={onClose}
                    className="flex flex-col items-center p-3 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <action.icon className={`h-6 w-6 ${action.color} mb-1`} />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* News Categories */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                {newsCategories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-left group"
                  >
                    <div className="flex items-center">
                      <div className={`p-1.5 rounded-md ${category.bgColor} mr-3`}>
                        <category.icon className={`h-4 w-4 ${category.color}`} />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Regional News */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Regional News
              </h3>
              <div className="space-y-1">
                {regions.map((region) => (
                  <button
                    key={region.name}
                    onClick={() => handleRegionClick(region.name)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{region.flag}</span>
                      <span className="font-medium">{region.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {region.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Trending Now
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center">
                    <FireIcon className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">AI Revolution</span>
                  </div>
                  <span className="text-xs text-red-600 dark:text-red-400">🔥 Hot</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <ChartBarIcon className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Market Update</span>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400">📈 Rising</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Climate News</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">🌱 Growing</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              <Link
                to="/settings"
                onClick={onClose}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Cog6ToothIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                Settings
              </Link>
              <Link
                to="/help"
                onClick={onClose}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <QuestionMarkCircleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar