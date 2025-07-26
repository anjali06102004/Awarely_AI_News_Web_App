import React, { useState, useEffect } from 'react'
import { useNotification } from '../context/NotificationContext'
import { 
  XMarkIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline'

const ToastNotification = () => {
  const { notifications } = useNotification()
  const [visibleToasts, setVisibleToasts] = useState([])

  useEffect(() => {
    // Show new notifications as toasts
    const newNotifications = notifications
      .filter(n => !n.read && !visibleToasts.find(t => t.id === n.id))
      .slice(0, 3) // Limit to 3 visible toasts

    if (newNotifications.length > 0) {
      setVisibleToasts(prev => [...prev, ...newNotifications])

      // Auto-remove toasts after delay
      newNotifications.forEach(notification => {
        const delay = notification.priority === 'high' ? 8000 : 
                     notification.priority === 'medium' ? 5000 : 3000

        setTimeout(() => {
          setVisibleToasts(prev => prev.filter(t => t.id !== notification.id))
        }, delay)
      })
    }
  }, [notifications, visibleToasts])

  const removeToast = (id) => {
    setVisibleToasts(prev => prev.filter(t => t.id !== id))
  }

  const getToastIcon = (type) => {
    switch (type) {
      case 'breaking':
        return <FireIcon className="w-5 h-5 text-red-500" />
      case 'trending':
        return <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
      case 'ai-insight':
        return <SparklesIcon className="w-5 h-5 text-purple-500" />
      case 'recommendation':
        return <StarIcon className="w-5 h-5 text-green-500" />
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getToastStyles = (type, priority) => {
    let baseStyles = "transform transition-all duration-300 ease-in-out"
    
    if (priority === 'high') {
      baseStyles += " ring-2 ring-red-200 shadow-lg"
    }

    switch (type) {
      case 'breaking':
        return `${baseStyles} bg-red-50 border-l-4 border-red-500 text-red-800`
      case 'trending':
        return `${baseStyles} bg-blue-50 border-l-4 border-blue-500 text-blue-800`
      case 'ai-insight':
        return `${baseStyles} bg-purple-50 border-l-4 border-purple-500 text-purple-800`
      case 'recommendation':
        return `${baseStyles} bg-green-50 border-l-4 border-green-500 text-green-800`
      case 'success':
        return `${baseStyles} bg-green-50 border-l-4 border-green-500 text-green-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-l-4 border-red-500 text-red-800`
      default:
        return `${baseStyles} bg-blue-50 border-l-4 border-blue-500 text-blue-800`
    }
  }

  if (visibleToasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {visibleToasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type, toast.priority)} p-4 rounded-lg shadow-md backdrop-blur-sm animate-slide-in-right`}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: `translateY(${index * 4}px)`,
            zIndex: 50 - index
          }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getToastIcon(toast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1 truncate">
                    {toast.title}
                  </h4>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {toast.message}
                  </p>
                  {toast.category && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                      {toast.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Progress bar for auto-dismiss */}
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-current opacity-40 animate-progress"
              style={{
                animationDuration: toast.priority === 'high' ? '8s' : 
                                 toast.priority === 'medium' ? '5s' : '3s'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastNotification
