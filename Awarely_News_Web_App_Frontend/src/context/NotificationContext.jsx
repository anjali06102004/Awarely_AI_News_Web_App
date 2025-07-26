import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    breakingNews: true,
    dailyDigest: true,
    trendingAlerts: true,
    aiInsights: true,
    categories: {
      technology: true,
      business: true,
      politics: false,
      sports: true,
      entertainment: false,
      science: true,
      health: true,
      world: true
    },
    frequency: 'immediate', // immediate, hourly, daily
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  })
  const [unreadCount, setUnreadCount] = useState(0)

  // Initialize notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings))
    }

    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed)
      setUnreadCount(parsed.filter(n => !n.read).length)
    }
  }, [])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
  }, [notificationSettings])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  const isQuietHours = useCallback(() => {
    if (!notificationSettings.quietHours.enabled) return false
    
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const startTime = parseInt(notificationSettings.quietHours.start.split(':')[0]) * 60 + 
                     parseInt(notificationSettings.quietHours.start.split(':')[1])
    const endTime = parseInt(notificationSettings.quietHours.end.split(':')[0]) * 60 + 
                   parseInt(notificationSettings.quietHours.end.split(':')[1])
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime
    } else {
      return currentTime >= startTime || currentTime <= endTime
    }
  }, [notificationSettings.quietHours])

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 99)]) // Keep last 100
    setUnreadCount(prev => prev + 1)

    // Show browser notification if enabled and not in quiet hours
    if (notificationSettings.pushEnabled && 
        'Notification' in window && 
        Notification.permission === 'granted' &&
        !isQuietHours()) {
      
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'high',
        silent: notification.priority === 'low'
      })

      browserNotification.onclick = () => {
        window.focus()
        if (notification.action) {
          notification.action()
        }
        browserNotification.close()
      }

      // Auto close after 5 seconds for non-high priority
      if (notification.priority !== 'high') {
        setTimeout(() => browserNotification.close(), 5000)
      }
    }

    return newNotification.id
  }, [notificationSettings.pushEnabled, isQuietHours])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      const removedNotification = prev.find(n => n.id === id)
      if (removedNotification && !removedNotification.read) {
        setUnreadCount(count => Math.max(0, count - 1))
      }
      return updated
    })
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  const updateSettings = useCallback((newSettings) => {
    setNotificationSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  // AI-powered notification helpers
  const sendBreakingNewsAlert = useCallback((article) => {
    if (!notificationSettings.breakingNews) return

    addNotification({
      type: 'breaking',
      title: '🚨 Breaking News',
      message: article.title,
      priority: 'high',
      category: article.category,
      action: () => window.location.hash = `#article-${article.id}`,
      data: { articleId: article.id }
    })
  }, [addNotification, notificationSettings.breakingNews])

  const sendTrendingAlert = useCallback((topic) => {
    if (!notificationSettings.trendingAlerts) return

    addNotification({
      type: 'trending',
      title: '📈 Trending Now',
      message: `"${topic}" is trending in your area`,
      priority: 'medium',
      category: 'trending'
    })
  }, [addNotification, notificationSettings.trendingAlerts])

  const sendAIInsight = useCallback((insight) => {
    if (!notificationSettings.aiInsights) return

    addNotification({
      type: 'ai-insight',
      title: '🤖 AI Insight',
      message: insight.summary,
      priority: 'low',
      category: 'ai'
    })
  }, [addNotification, notificationSettings.aiInsights])

  const sendPersonalizedRecommendation = useCallback((articles) => {
    addNotification({
      type: 'recommendation',
      title: '✨ Personalized for You',
      message: `${articles.length} new articles match your interests`,
      priority: 'medium',
      category: 'recommendation',
      data: { articles }
    })
  }, [addNotification])

  const value = {
    notifications,
    unreadCount,
    notificationSettings,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    updateSettings,
    sendBreakingNewsAlert,
    sendTrendingAlert,
    sendAIInsight,
    sendPersonalizedRecommendation
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
