import { useState } from 'react';
import { 
  PlusIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const FloatingActionButton = ({ onOpenChat, onOpenSearch, onOpenTrends, onOpenAI }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: ChatBubbleLeftRightIcon,
      label: 'AI Chat',
      onClick: onOpenChat,
      color: 'bg-purple-500 hover:bg-purple-600',
      delay: 'delay-75'
    },
    {
      icon: MagnifyingGlassIcon,
      label: 'Smart Search',
      onClick: onOpenSearch,
      color: 'bg-blue-500 hover:bg-blue-600',
      delay: 'delay-100'
    },
    {
      icon: ChartBarIcon,
      label: 'Trends',
      onClick: onOpenTrends,
      color: 'bg-green-500 hover:bg-green-600',
      delay: 'delay-150'
    },
    {
      icon: SparklesIcon,
      label: 'AI Insights',
      onClick: onOpenAI,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      delay: 'delay-200'
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action Buttons */}
      <div className={`flex flex-col-reverse space-y-reverse space-y-3 mb-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={`transform transition-all duration-300 ${action.delay} ${
              isOpen ? 'scale-100 translate-x-0' : 'scale-0 translate-x-8'
            }`}
          >
            <div className="flex items-center">
              <span className="bg-black/75 text-white px-3 py-1 rounded-lg text-sm mr-3 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`group w-12 h-12 ${action.color} rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-xl`}
              >
                <action.icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <PlusIcon className="h-8 w-8" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
