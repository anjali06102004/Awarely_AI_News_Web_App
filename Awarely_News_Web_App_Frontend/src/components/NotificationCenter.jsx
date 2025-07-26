import React, { useState, useEffect } from 'react'
import { useNotification } from '../context/NotificationContext'
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon, 
  TrashIcon,
  CogIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid'

const NotificationCenter = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotification()

  const [filter, setFilter] = useState('all') // all, unread, breaking, trending, ai
  const [showSettings, setShowSettings] = useState(false)

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'breaking':
        return <FireIcon className="w-5 h-5 text-red-500" />
      case 'trending':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
      case 'ai-insight':
        return <SparklesIcon className="w-5 h-5 text-purple-500" />
      case 'recommendation':
        return <StarIcon className="w-5 h-5 text-green-500" />
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50'
    switch (type) {
      case 'breaking':
        return 'border-l-red-500 bg-red-50'
      case 'trending':
        return 'border-l-blue-500 bg-blue-50'
      case 'ai-insight':
        return 'border-l-purple-500 bg-purple-50'
      case 'recommendation':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-300 bg-gray-50'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const formatTime = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Notification Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BellSolidIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Settings"
            >
              <CogIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'breaking', label: 'Breaking', count: notifications.filter(n => n.type === 'breaking').length },
            { key: 'trending', label: 'Trending', count: notifications.filter(n => n.type === 'trending').length },
            { key: 'ai-insight', label: 'AI', count: notifications.filter(n => n.type === 'ai-insight').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                filter === tab.key
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Actions Bar */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <BellIcon className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`relative p-4 border-l-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                    getNotificationColor(notification.type, notification.priority)
                  } ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-900'}`}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id)
                    if (notification.action) notification.action()
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.timestamp)}
                        </span>
                        {notification.category && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                            {notification.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 z-10">
            <NotificationSettings onClose={() => setShowSettings(false)} />
          </div>
        )}
      </div>
    </div>
  )
}

// Notification Settings Component
const NotificationSettings = ({ onClose }) => {
  const { notificationSettings, updateSettings } = useNotification()

  const handleToggle = (key, value) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      updateSettings({
        [parent]: {
          ...notificationSettings[parent],
          [child]: value
        }
      })
    } else {
      updateSettings({ [key]: value })
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Notification Settings
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* General Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">General</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Push Notifications</span>
              <input
                type="checkbox"
                checked={notificationSettings.pushEnabled}
                onChange={(e) => handleToggle('pushEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
              <input
                type="checkbox"
                checked={notificationSettings.emailEnabled}
                onChange={(e) => handleToggle('emailEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Notification Types</h4>
          <div className="space-y-3">
            {[
              { key: 'breakingNews', label: 'Breaking News', icon: '🚨' },
              { key: 'trendingAlerts', label: 'Trending Alerts', icon: '📈' },
              { key: 'aiInsights', label: 'AI Insights', icon: '🤖' },
              { key: 'dailyDigest', label: 'Daily Digest', icon: '📰' }
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings[item.key]}
                  onChange={(e) => handleToggle(item.key, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(notificationSettings.categories).map(([category, enabled]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{category}</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => handleToggle(`categories.${category}`, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quiet Hours</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Enable Quiet Hours</span>
              <input
                type="checkbox"
                checked={notificationSettings.quietHours.enabled}
                onChange={(e) => handleToggle('quietHours.enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            {notificationSettings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Start</label>
                  <input
                    type="time"
                    value={notificationSettings.quietHours.start}
                    onChange={(e) => handleToggle('quietHours.start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">End</label>
                  <input
                    type="time"
                    value={notificationSettings.quietHours.end}
                    onChange={(e) => handleToggle('quietHours.end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter
