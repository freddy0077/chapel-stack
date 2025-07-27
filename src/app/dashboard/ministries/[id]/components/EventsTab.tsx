"use client";

import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  MapPinIcon,
  ClockIcon,
  PlusIcon,
  UsersIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
// Mock authentication context for demo purposes
// In a real implementation, this would use the actual AuthContext from the security system
const useAuth = () => {
  return {
    hasPermission: (permission: string) => {
      // For demo purposes, just return true to show admin controls
      // In a real implementation, this would check against the user's actual permissions
      return true;
    }
  };
};

// Types
interface MinistryEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  isRecurring: boolean;
  recurringPattern?: string;
  attendees: number;
  maxAttendees?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  type: 'rehearsal' | 'service' | 'meeting' | 'outreach' | 'other';
}

// Mock data
const MOCK_EVENTS: MinistryEvent[] = [
  {
    id: 'e1',
    title: 'Weekly Rehearsal',
    description: 'Regular worship team practice session',
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 2) + 2 * 60 * 60 * 1000),
    location: 'Sanctuary',
    isRecurring: true,
    recurringPattern: 'Weekly on Wednesday',
    attendees: 15,
    maxAttendees: 20,
    status: 'upcoming',
    type: 'rehearsal'
  },
  {
    id: 'e2',
    title: 'Sunday Service',
    description: 'Main worship service',
    startDate: new Date(new Date().setDate(new Date().getDate() + 4)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 4) + 2 * 60 * 60 * 1000),
    location: 'Main Hall',
    isRecurring: true,
    recurringPattern: 'Weekly on Sunday',
    attendees: 28,
    maxAttendees: 30,
    status: 'upcoming',
    type: 'service'
  },
  {
    id: 'e3',
    title: 'Team Building Retreat',
    description: 'A weekend retreat for team bonding and spiritual growth',
    startDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 16)),
    location: 'Mountain Retreat Center',
    isRecurring: false,
    attendees: 12,
    maxAttendees: 25,
    status: 'upcoming',
    type: 'other'
  },
  {
    id: 'e4',
    title: 'Leadership Meeting',
    description: 'Monthly planning and vision casting',
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 5) + 1.5 * 60 * 60 * 1000),
    location: 'Conference Room',
    isRecurring: true,
    recurringPattern: 'Monthly on first Monday',
    attendees: 8,
    maxAttendees: 10,
    status: 'completed',
    type: 'meeting'
  }
];

// Calculate date ranges for display
const formatDateRange = (start: Date, end: Date): string => {
  const startDate = start.toLocaleDateString();
  const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endDate = end.toLocaleDateString();
  const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  if (startDate === endDate) {
    return `${startDate}, ${startTime} - ${endTime}`;
  } else {
    return `${startDate} ${startTime} - ${endDate} ${endTime}`;
  }
};

interface EventsTabProps {
  ministryId: string;
  ministryName: string; // Used for display and header context
}

export default function EventsTab({ ministryId }: EventsTabProps) {
  const { hasPermission } = useAuth();
  const [events, setEvents] = useState<MinistryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Check permissions for audit logging integration
  const canManageEvents = hasPermission(`ministry:${ministryId}:manage_events`);
  
  // Fetch events (would connect to API in real implementation)
  useEffect(() => {
    const fetchEvents = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setEvents(MOCK_EVENTS);
        setLoading(false);
        
        // Audit logging integration
      }, 600);
    };
    
    fetchEvents();
  }, [ministryId]);
  
  // Filter events based on status
  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(event => event.status === activeFilter);
  
  // Group events by month for calendar view
  const getMonthYear = (date: Date) => {
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };
  
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const monthYear = getMonthYear(event.startDate);
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {} as Record<string, MinistryEvent[]>);
  
  // Sort groups chronologically
  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = new Date(groupedEvents[a][0].startDate);
    const dateB = new Date(groupedEvents[b][0].startDate);
    return dateA.getTime() - dateB.getTime();
  });
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with filters */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-3 sm:mb-0">
            Ministry Events <span className="text-gray-500 text-sm">({filteredEvents.length})</span>
          </h3>
          
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeFilter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeFilter === 'upcoming' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeFilter === 'ongoing' 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('ongoing')}
            >
              Ongoing
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeFilter === 'completed' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </button>
            
            {/* Add Event button (conditionally rendered based on permissions) */}
            {canManageEvents && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Event
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Calendar View */}
      <div className="px-4 py-5 sm:p-6">
        {filteredEvents.length > 0 ? (
          <div className="flow-root">
            {sortedMonths.map(monthYear => (
              <div key={monthYear} className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">{monthYear}</h4>
                <div className="space-y-4">
                  {groupedEvents[monthYear].map(event => (
                    <div 
                      key={event.id} 
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:px-6 flex items-start justify-between">
                        <div>
                          <h5 className="text-lg font-medium text-gray-900">{event.title}</h5>
                          <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                          
                          <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap gap-y-2 gap-x-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {formatDateRange(event.startDate, event.endDate)}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <UsersIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                              {event.attendees} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attendees
                            </div>
                            {event.isRecurring && (
                              <div className="flex items-center text-sm text-gray-500">
                                <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {event.recurringPattern}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      
                      {canManageEvents && (
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
                              onClick={() => {
                                // Would open event details in real implementation
                              }}
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                              onClick={() => {
                                // Would edit event in real implementation
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === 'all' 
                ? 'There are no events scheduled for this ministry.' 
                : `There are no ${activeFilter} events at this time.`}
            </p>
            {canManageEvents && (
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Schedule New Event
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
