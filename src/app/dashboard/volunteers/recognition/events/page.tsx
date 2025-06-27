"use client";

import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  TrophyIcon,
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock authentication context
const useAuth = () => {
  return {
    hasPermission: (permission: string) => {
      // For demo purposes, just return true to show admin controls
      // In a real implementation, this would check against the user's actual permissions
      console.log(`[AUDIT] Permission check: ${permission}`);
      return true;
    },
    user: {
      name: 'Admin User',
      role: 'admin'
    }
  };
};

// Types
interface Volunteer {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string;
  totalHours: number;
  branch: string;
  ministry: string;
}

interface RecognitionEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'award_ceremony' | 'appreciation_dinner' | 'special_recognition' | 'volunteer_spotlight';
  attendees: Volunteer[];
  maxAttendees?: number;
  awards?: Award[];
  organizer: string;
  imageUrl?: string;
}

interface Award {
  id: string;
  name: string;
  description: string;
  criteria: string;
  recipient?: Volunteer;
  imageUrl?: string;
}

// Mock Data
const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Worship Team',
    totalHours: 87,
    branch: 'Main Campus',
    ministry: 'Worship'
  },
  {
    id: 'v2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Children\'s Ministry',
    totalHours: 124,
    branch: 'North Campus',
    ministry: 'Children'
  },
  {
    id: 'v3',
    name: 'Michael Williams',
    email: 'michael.williams@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Ushers',
    totalHours: 156,
    branch: 'Main Campus',
    ministry: 'Hospitality'
  },
  {
    id: 'v4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Youth Leader',
    totalHours: 142,
    branch: 'East Campus',
    ministry: 'Youth'
  },
  {
    id: 'v5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Tech Team',
    totalHours: 93,
    branch: 'Main Campus',
    ministry: 'Technical'
  }
];

const MOCK_AWARDS: Award[] = [
  {
    id: 'a1',
    name: 'Volunteer of the Year',
    description: 'Awarded to the volunteer who has shown exceptional dedication and service',
    criteria: 'Minimum 100 hours of service, leadership qualities, and positive impact',
    imageUrl: '/images/awards/volunteer-year.png'
  },
  {
    id: 'a2',
    name: 'Faithful Service',
    description: 'Recognizes volunteers with consistent attendance and reliability',
    criteria: 'Minimum 50 hours of service with at least 90% attendance rate',
    imageUrl: '/images/awards/faithful-service.png'
  },
  {
    id: 'a3',
    name: 'Ministry Impact',
    description: 'Celebrates volunteers who have made a significant impact in their ministry area',
    criteria: 'Demonstrated initiative and innovation in ministry service',
    imageUrl: '/images/awards/ministry-impact.png'
  },
  {
    id: 'a4',
    name: 'Leadership Excellence',
    description: 'Honors volunteers who have shown exceptional leadership qualities',
    criteria: 'Effectively led others, developed team members, and advanced ministry goals',
    imageUrl: '/images/awards/leadership.png'
  },
  {
    id: 'a5',
    name: 'Community Builder',
    description: 'Recognizes volunteers who foster community and relationships',
    criteria: 'Created inclusive environment and strengthened church community bonds',
    imageUrl: '/images/awards/community.png'
  }
];

const MOCK_EVENTS: RecognitionEvent[] = [
  {
    id: 'e1',
    title: 'Annual Volunteer Appreciation Dinner',
    description: 'A special evening to honor our dedicated volunteers with dinner, awards, and entertainment',
    date: new Date('2025-05-15T18:00:00'),
    location: 'Main Campus Fellowship Hall',
    status: 'upcoming',
    type: 'appreciation_dinner',
    attendees: MOCK_VOLUNTEERS.slice(0, 3),
    maxAttendees: 200,
    awards: [MOCK_AWARDS[0], MOCK_AWARDS[3]],
    organizer: 'Volunteer Coordination Team',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'e2',
    title: 'Quarterly Volunteer Spotlight',
    description: 'Recognizing outstanding volunteers from each ministry area for their exceptional service',
    date: new Date('2025-04-30T19:30:00'),
    location: 'North Campus Community Room',
    status: 'upcoming',
    type: 'volunteer_spotlight',
    attendees: MOCK_VOLUNTEERS.slice(2, 5),
    awards: [MOCK_AWARDS[2], MOCK_AWARDS[4]],
    organizer: 'Ministry Leaders Council',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74ec9c7e14c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'e3',
    title: 'Service Milestone Celebration',
    description: 'Honoring volunteers who have reached significant service milestones',
    date: new Date('2025-03-12T18:00:00'),
    location: 'East Campus Auditorium',
    status: 'completed',
    type: 'special_recognition',
    attendees: MOCK_VOLUNTEERS.slice(1, 4),
    awards: [MOCK_AWARDS[1]],
    organizer: 'Volunteer Relations Committee',
    imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'e4',
    title: 'Leadership Recognition Breakfast',
    description: 'A morning gathering to acknowledge our volunteer team leaders',
    date: new Date('2024-12-08T09:00:00'),
    location: 'Main Campus Café',
    status: 'completed',
    type: 'special_recognition',
    attendees: MOCK_VOLUNTEERS.slice(0, 2),
    awards: [MOCK_AWARDS[3]],
    organizer: 'Pastor of Volunteer Ministries',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 'e5',
    title: 'Year-End Awards Ceremony',
    description: 'Celebrating our volunteers\' achievements throughout the year',
    date: new Date('2024-12-18T19:00:00'),
    location: 'Main Campus Sanctuary',
    status: 'completed',
    type: 'award_ceremony',
    attendees: MOCK_VOLUNTEERS,
    awards: MOCK_AWARDS,
    organizer: 'Senior Leadership Team',
    imageUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  }
];

export default function VolunteerRecognitionEventsPage() {
  const { hasPermission } = useAuth();
  const [events, setEvents] = useState<RecognitionEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Check permissions for audit logging integration
  const canManageEvents = hasPermission('volunteers:recognition:manage_events');
  
  useEffect(() => {
    const fetchEvents = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        setEvents(MOCK_EVENTS);
        setLoading(false);
        
        // Audit logging integration
        console.log('[AUDIT] User viewed volunteer recognition events');
      }, 600);
    };
    
    fetchEvents();
  }, []);
  
  // Filter events based on filters and search term
  const filteredEvents = events.filter(event => {
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    const matchesSearch = searchTerm === '' || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });
  
  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ArrowPathIcon className="h-12 w-12 text-indigo-500 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <Link 
                href="/dashboard/volunteers/recognition"
                className="mr-2 text-indigo-600 hover:text-indigo-800"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Volunteer Recognition Events</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Celebrate and honor our dedicated volunteers with special events and awards.
            </p>
          </div>
          
          {canManageEvents && (
            <div className="mt-4 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  console.log('[AUDIT] User initiated creating new recognition event');
                  alert('Create new recognition event - Feature coming soon');
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Event
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3 sm:gap-x-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="sr-only">
                Search Events
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search events"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Type Filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Event Type
              </label>
              <select
                id="type"
                name="type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="award_ceremony">Award Ceremony</option>
                <option value="appreciation_dinner">Appreciation Dinner</option>
                <option value="special_recognition">Special Recognition</option>
                <option value="volunteer_spotlight">Volunteer Spotlight</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Events List */}
      {sortedEvents.length > 0 ? (
        <div className="space-y-6">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="sm:flex">
                {/* Event image */}
                {event.imageUrl && (
                  <div className="sm:flex-shrink-0">
                    <div className="h-48 sm:h-full w-full sm:w-48 relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-0 right-0 m-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.status === 'upcoming'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'completed'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {event.status === 'upcoming' && <CalendarIcon className="h-3 w-3 mr-1" />}
                          {event.status === 'completed' && <CheckCircleIcon className="h-3 w-3 mr-1" />}
                          {event.status === 'cancelled' && <XCircleIcon className="h-3 w-3 mr-1" />}
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Event details */}
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800`}
                    >
                      {event.type === 'award_ceremony' && 'Award Ceremony'}
                      {event.type === 'appreciation_dinner' && 'Appreciation Dinner'}
                      {event.type === 'special_recognition' && 'Special Recognition'}
                      {event.type === 'volunteer_spotlight' && 'Volunteer Spotlight'}
                    </span>
                  </div>
                  
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>
                          {formatDate(event.date)}
                          <span className="ml-2">{formatTime(event.date)}</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <div className="mt-1 flex items-center text-sm text-gray-900">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <p>{event.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attendees & Awards */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {event.attendees.length > 0 && (
                      <div className="flex -space-x-2 mr-4">
                        {event.attendees.slice(0, 3).map((attendee) => (
                          <div key={attendee.id} className="relative z-0 inline-block h-8 w-8 rounded-full ring-2 ring-white tooltip" title={attendee.name}>
                            <img
                              src={attendee.imageUrl}
                              alt={attendee.name}
                              className="h-full w-full rounded-full"
                            />
                          </div>
                        ))}
                        {event.attendees.length > 3 && (
                          <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500 ring-2 ring-white">
                            +{event.attendees.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {event.awards && event.awards.length > 0 && (
                      <div className="flex items-center">
                        <TrophyIcon className="h-5 w-5 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{event.awards.length} {event.awards.length === 1 ? 'Award' : 'Awards'}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      onClick={() => {
                        console.log(`[AUDIT] User viewed details for event: ${event.id}`);
                        alert(`View details for: ${event.title}`);
                      }}
                    >
                      View Details
                    </button>
                    
                    {canManageEvents && event.status === 'upcoming' && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        onClick={() => {
                          console.log(`[AUDIT] User initiated editing event: ${event.id}`);
                          alert(`Edit event: ${event.title}`);
                        }}
                      >
                        Edit Event
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recognition events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating a new volunteer recognition event.'}
          </p>
          {canManageEvents && (
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                onClick={() => {
                  console.log('[AUDIT] User initiated creating new recognition event');
                  alert('Create new recognition event - Feature coming soon');
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Event
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
