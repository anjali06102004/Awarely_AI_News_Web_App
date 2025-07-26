import { useState, useEffect } from 'react'
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'

const OnThisDay = () => {
  const [historicalEvents, setHistoricalEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [visibleCount, setVisibleCount] = useState(3);


  useEffect(() => {
    const fetchHistoricalEvents = async () => {
      const today = new Date();
      const month = today.getMonth() + 1;
      const day = today.getDate();
  
      try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`);
        const data = await res.json();
  
        // Format data to match your card structure
        const formatted = data.events.slice(0, 5).map((event, index) => ({
          id: index,
          year: event.year,
          title: event.text,
          description: event.pages[0]?.extract || '',
          category: event.pages[0]?.description || 'History',
          image: event.pages[0]?.thumbnail?.source || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
        }));
  
        setHistoricalEvents(formatted);
      } catch (err) {
        console.error('Failed to fetch On This Day events:', err);
      }
    };
  
    fetchHistoricalEvents();
  }, []);
  

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <CalendarIcon className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">On This Day</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {formatDate(currentDate)} in history
        </p>
      </div>

      <div className="space-y-4">
      {historicalEvents.slice(0, visibleCount).map((event) => (
          <div key={event.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
            <div className="relative">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                  {event.year}
                </span>
              </div>
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                  {event.category}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {event.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {event.description}
              </p>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3" />
                  <span>{event.year} years ago</span>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Read more
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
      {visibleCount < historicalEvents.length && (
        <button
           onClick={() => setVisibleCount((prev) => prev + 3)}
           className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
            View more historical events
        </button>
      )}
      
    {visibleCount >= historicalEvents.length && (
     <button
       onClick={() => setVisibleCount(3)}
       className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
     >
         Show fewer
     </button>
    )}


      </div>
    </div>
  )
}

export default OnThisDay 