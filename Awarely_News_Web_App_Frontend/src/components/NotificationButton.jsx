import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid'
import { useNotification } from '../context/NotificationContext'

const NotificationButton = ({ onClick }) => {
  const { unreadCount } = useNotification()

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      title="Notifications"
    >
      {unreadCount > 0 ? (
        <BellSolidIcon className="w-6 h-6 text-blue-600 animate-pulse" />
      ) : (
        <BellIcon className="w-6 h-6" />
      )}
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 animate-bounce">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export default NotificationButton
