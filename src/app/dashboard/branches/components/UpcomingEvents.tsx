import { useQuery } from '@apollo/client';
import { GET_BRANCH_UPCOMING_EVENTS } from '@/graphql/queries/branchQueries';
import { format, isPast, isSameDay } from 'date-fns';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { usePermissions } from '@/hooks/usePermissions';
import Link from 'next/link';

interface UpcomingEventsProps {
  branchId: string;
  limit?: number;
}

interface EventAttendee {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  attendees: EventAttendee[];
}

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'worship':
      return 'bg-purple-100 text-purple-800';
    case 'prayer':
      return 'bg-blue-100 text-blue-800';
    case 'outreach':
      return 'bg-green-100 text-green-800';
    case 'fellowship':
      return 'bg-yellow-100 text-yellow-800';
    case 'meeting':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-indigo-100 text-indigo-800';
  }
};

export default function UpcomingEvents({ branchId, limit = 3 }: UpcomingEventsProps) {
  const { canManageEvents } = usePermissions();
  const { loading, error, data, refetch } = useQuery(GET_BRANCH_UPCOMING_EVENTS, {
    variables: { branchId, limit },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-3"></div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-100 rounded w-1/4"></div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              <div className="h-3 bg-gray-100 rounded w-2/5"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p>Failed to load upcoming events</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 text-sm text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const events = data?.branchUpcomingEvents || [];

  if (events.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p>No upcoming events scheduled</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {events.map((event: Event) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          const isPastEvent = isPast(endDate);
          const isToday = isSameDay(startDate, new Date());
          
          return (
            <li 
              key={event.id} 
              className={`bg-white border rounded-lg p-4 transition-all ${
                isPastEvent ? 'opacity-60' : 'hover:border-indigo-200 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900 mb-1">
                  {event.title}
                  {canManageEvents && (
                    <Link 
                      href={`/dashboard/events/${event.id}`}
                      className="ml-2 text-xs text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                  )}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>
              
              {event.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    {isToday ? 'Today, ' : ''}
                    {format(startDate, 'MMM d, h:mm a')}
                    {!isSameDay(startDate, endDate) && ` - ${format(endDate, 'MMM d, h:mm a')}`}
                  </span>
                </div>
                
                {event.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                
                {event.attendees?.length > 0 && (
                  <div className="flex items-center text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {event.attendees.slice(0, 3).map((attendee) => (
                          <div 
                            key={attendee.id} 
                            className="h-6 w-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center overflow-hidden"
                          >
                            {attendee.name ? (
                              <span className="text-xs font-medium text-indigo-600">
                                {attendee.name[0]}
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-indigo-600">
                                {attendee.firstName[0]}{attendee.lastName[0]}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs">
                        {event.attendees.length > 3 ? 
                          `${event.attendees.slice(0, 3).length}+ attending` : 
                          `${event.attendees.length} attending`}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      
      {canManageEvents && (
        <div className="mt-4 text-center">
          <Link 
            href={`/dashboard/events/new?branchId=${branchId}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Event
          </Link>
        </div>
      )}
    </div>
  );
}
