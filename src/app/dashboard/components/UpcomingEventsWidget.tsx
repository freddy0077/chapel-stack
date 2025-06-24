"use client";

import { UpcomingEventsWidget as UpcomingEventsWidgetType } from "@/hooks/useDashboardData";

interface UpcomingEventsWidgetProps {
  widget: UpcomingEventsWidgetType;
}

export default function UpcomingEventsWidget({ widget }: UpcomingEventsWidgetProps) {
  if (!widget || !widget.events || widget.events.length === 0) {
    return null;
  }

  // Format date nicely
  const formatEventDate = (dateString: Date | string | undefined) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">{widget.title || "Upcoming Events"}</h3>
      </div>
      <div className="p-4">
        <div className="divide-y divide-gray-200">
          {widget.events.map((event) => (
            <div key={event.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start space-x-4">
                {/* Date calendar icon */}
                <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                  <div className="bg-indigo-600 text-white text-center text-xs font-medium py-0.5">
                    {(event.dateTime || event.date) ? 
                      new Date(event.dateTime || event.date!).toLocaleString('default', { month: 'short' }) : 'N/A'}
                  </div>
                  <div className="text-center text-xl font-semibold">
                    {(event.dateTime || event.date) ? 
                      new Date(event.dateTime || event.date!).getDate() : '--'}
                  </div>
                </div>
                
                {/* Event details */}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  {event.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">{event.description}</p>
                  )}
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatEventDate(event.dateTime || event.date)}</span>
                    
                    {event.location && (
                      <>
                        <span className="mx-2">•</span>
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{event.location}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Category tag */}
                {event.category && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {widget.events.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all events
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
