"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isToday, getDay, isSameMonth, isSameDay, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameWeek, eachDayOfInterval, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  FunnelIcon,
  ArrowPathIcon,
  ViewColumnsIcon,
  Bars3Icon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import DashboardHeader from "@/components/DashboardHeader";
import CreateEventModal from "../../../components/events/CreateEventModal";
import EventRegistration from "../../../components/events/EventRegistration";
import EventRSVP from "../../../components/events/EventRSVP";
import EventAttendeesView from '../../../components/events/EventAttendeesView';
import { Card, Select, SelectItem, Button, Badge, Text, Grid, Metric } from "@tremor/react";
import { useFilteredEvents } from "@/graphql/hooks/useFilteredEvents";
import { useEventActions } from "@/graphql/hooks/useEventRegistrationRSVP";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { Event, EventStatus, RSVPStatus } from "@/graphql/types/event";
import Loading from "@/components/ui/Loading";
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from "@/contexts/AuthContextEnhanced";

const isClient = typeof window !== 'undefined';

// View modes
const VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week',
  LIST: 'list'
} as const;

type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];

// Event type options with colors
const eventTypeOptions = [
  { id: 'all', name: 'All Events', color: 'bg-gray-500' },
  { id: 'WORSHIP_SERVICE', name: 'Worship Service', color: 'bg-blue-500' },
  { id: 'WEDDING', name: 'Wedding', color: 'bg-pink-500' },
  { id: 'FUNERAL', name: 'Funeral', color: 'bg-gray-600' },
  { id: 'BAPTISM', name: 'Baptism', color: 'bg-cyan-500' },
  { id: 'GRADUATION', name: 'Graduation', color: 'bg-yellow-500' },
  { id: 'CONFERENCE', name: 'Conference', color: 'bg-purple-500' },
  { id: 'WORKSHOP', name: 'Workshop', color: 'bg-orange-500' },
  { id: 'RETREAT', name: 'Retreat', color: 'bg-green-500' },
  { id: 'FELLOWSHIP', name: 'Fellowship', color: 'bg-indigo-500' },
  { id: 'YOUTH_EVENT', name: 'Youth Event', color: 'bg-red-500' },
  { id: 'CHILDREN_EVENT', name: 'Children Event', color: 'bg-emerald-500' },
  { id: 'PRAYER_MEETING', name: 'Prayer Meeting', color: 'bg-violet-500' },
  { id: 'BIBLE_STUDY', name: 'Bible Study', color: 'bg-amber-500' },
  { id: 'COMMUNITY_SERVICE', name: 'Community Service', color: 'bg-teal-500' },
  { id: 'FUNDRAISER', name: 'Fundraiser', color: 'bg-lime-500' },
  { id: 'CELEBRATION', name: 'Celebration', color: 'bg-rose-500' },
  { id: 'MEETING', name: 'Meeting', color: 'bg-slate-500' },
  { id: 'OTHER', name: 'Other', color: 'bg-neutral-500' },
];

export default function Calendar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardHeader
        title="Calendar"
        subtitle="Manage your church events and schedule"
        icon={<CalendarIcon className="h-10 w-10 text-white" />}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CalendarContent />
      </div>
    </div>
  );
}

function CalendarContent() {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(VIEW_MODES.MONTH);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  const [showAttendeesView, setShowAttendeesView] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { canManageEvents, isBranchAdmin, isSuperAdmin } = usePermissions();

  const { state } = useAuth();
  const user = state.user;
  
  const orgBranchFilter = useOrganisationBranch();

  // Event registration handlers
  const handleEventRegistration = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const handleEventRSVP = (event: Event) => {
    setSelectedEvent(event);
    setShowRSVPModal(true);
  };

  const handleEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
  };

  const closeRegistrationModal = () => {
    setShowRegistrationModal(false);
    setSelectedEvent(null);
    refetch(); // Refresh events to show updated registration counts
  };

  const closeRSVPModal = () => {
    setShowRSVPModal(false);
    setSelectedEvent(null);
    refetch(); // Refresh events to show updated RSVP counts
  };

  const closeEventDetailsModal = () => {
    setShowEventDetailsModal(false);
    setSelectedEvent(null);
  };

  const closeAttendeesView = () => {
    setShowAttendeesView(false);
    setSelectedEvent(null);
  };

  // State for current date and filter selections
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Get events data based on view mode
  const firstDay = viewMode === VIEW_MODES.WEEK 
    ? startOfWeek(currentDate, { weekStartsOn: 0 }) // Sunday start
    : startOfMonth(currentDate);
  const lastDay = viewMode === VIEW_MODES.WEEK 
    ? endOfWeek(currentDate, { weekStartsOn: 0 })
    : endOfMonth(currentDate);
  
  const { 
    events = [], 
    loading, 
    error, 
    refetch 
  } = useFilteredEvents({
    startDate: firstDay,
    endDate: lastDay,
    ...orgBranchFilter
  });

  // Get unique branches and locations for filters
  const branchOptions = useMemo(() => {
    const branches = [{ id: 'all', name: 'All Branches' }];
    const uniqueBranches = Array.from(new Set(events.map(event => event.branchId).filter(Boolean)));
    uniqueBranches.forEach(branchId => {
      const event = events.find(e => e.branchId === branchId);
      if (event?.branch?.name) {
        branches.push({ id: branchId, name: event.branch.name });
      }
    });
    return branches;
  }, [events]);

  const locationOptions = useMemo(() => {
    const locations = [{ id: 'all', name: 'All Locations' }];
    const uniqueLocations = Array.from(new Set(events.map(event => event.location).filter(Boolean)));
    uniqueLocations.forEach(location => {
      locations.push({ id: location, name: location });
    });
    return locations;
  }, [events]);

  // Navigation functions
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (viewMode === VIEW_MODES.WEEK) {
      navigateWeek(direction);
    } else {
      navigateMonth(direction);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedType("all");
    setSelectedBranch("all");
    setSelectedLocation("all");
  };
  
  // Effect to refetch events when date or view mode changes
  useEffect(() => {
    const newFirstDay = viewMode === VIEW_MODES.WEEK 
      ? startOfWeek(currentDate, { weekStartsOn: 0 })
      : startOfMonth(currentDate);
    const newLastDay = viewMode === VIEW_MODES.WEEK 
      ? endOfWeek(currentDate, { weekStartsOn: 0 })
      : endOfMonth(currentDate);
    refetch({
      startDate: newFirstDay,
      endDate: newLastDay
    });
  }, [currentDate, viewMode, refetch]);
  
  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    if (selectedType !== "all" && event.category !== selectedType) {
      return false;
    }
    
    if (selectedBranch !== "all" && event.branchId !== selectedBranch) {
      return false;
    }
    
    if (selectedLocation !== "all" && event.location !== selectedLocation) {
      return false;
    }
    
    return true;
  });

  // Calendar grid generation
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Month view grid
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarGrid = [...Array(startDay).fill(null), ...days];

  // Week view grid
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 0 }),
    end: endOfWeek(currentDate, { weekStartsOn: 0 })
  });
  
  // Get events for a specific day (handles both number for month view and Date for week view)
  const getEventsForDay = (day: number | Date | null) => {
    if (day === null) return [];
    
    let targetDate: Date;
    if (typeof day === 'number') {
      // Month view - day is a number
      targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    } else {
      // Week view - day is already a Date object
      targetDate = day;
    }
    
    const eventsForDay = filteredEvents.filter(event => {
      const eventStart = startOfDay(new Date(event.startDate));
      const eventEnd = startOfDay(new Date(event.endDate));
      const targetDay = startOfDay(targetDate);
      
      // Check if the target day falls within the event's date range (inclusive)
      return isWithinInterval(targetDay, { start: eventStart, end: eventEnd }) ||
             isSameDay(targetDay, eventStart) ||
             isSameDay(targetDay, eventEnd);
    });
    
    return eventsForDay;
  };
  
  // Check if a day is today (handles both number for month view and Date for week view)
  const isDayToday = (day: number | Date | null) => {
    if (day === null) return false;
    
    let targetDate: Date;
    if (typeof day === 'number') {
      // Month view - day is a number
      targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    } else {
      // Week view - day is already a Date object
      targetDate = day;
    }
    
    return isToday(targetDate);
  };

  // Get event type color
  const getEventTypeColor = (category: string) => {
    const eventType = eventTypeOptions.find(type => type.id === category?.toUpperCase());
    return eventType?.color || 'bg-gray-500';
  };

  // Get event time range
  const getEventTimeRange = (event: Event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
          <Text className="text-red-800">Error loading events: {error.message}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => navigate('prev')}
                className="p-3 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md group"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div className="px-6 py-3 min-w-[220px] text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {viewMode === VIEW_MODES.WEEK 
                    ? `${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d, yyyy')}`
                    : format(currentDate, 'MMMM yyyy')
                  }
                </h2>
              </div>
              <button
                onClick={() => navigate('next')}
                className="p-3 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md group"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>
          </div>

          {/* View Toggle and Actions */}
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setViewMode(VIEW_MODES.MONTH)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  viewMode === VIEW_MODES.MONTH
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ViewColumnsIcon className="h-4 w-4 inline mr-2" />
                Month
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.WEEK)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  viewMode === VIEW_MODES.WEEK
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
                Week
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.LIST)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  viewMode === VIEW_MODES.LIST
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Bars3Icon className="h-4 w-4 inline mr-2" />
                List
              </button>
            </div>

            {/* Filter Toggle - Only show for Super Admin */}
            {isSuperAdmin && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm border ${
                  showFilters
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FunnelIcon className="h-4 w-4 inline mr-2" />
                Filters
              </button>
            )}

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 shadow-sm"
            >
              <ArrowPathIcon className="h-4 w-4 inline mr-2" />
              Refresh
            </button>

            {/* New Event Button */}
            {canManageEvents && (
              <button
                onClick={() => setShowNewEventModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="h-4 w-4 inline mr-2" />
                New Event
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel - Only show for Super Admin */}
        {showFilters && isSuperAdmin && (
          <div className="relative mt-6 pt-6 border-t border-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Event Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  {eventTypeOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${option.color} mr-2`}></div>
                        {option.name}
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  {branchOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  {locationOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid, Week View, or List View */}
      {viewMode === VIEW_MODES.MONTH ? (
        <MonthView 
          calendarGrid={calendarGrid}
          currentDate={currentDate}
          getEventsForDay={getEventsForDay}
          isDayToday={isDayToday}
          getEventTypeColor={getEventTypeColor}
          getEventTimeRange={getEventTimeRange}
          handleEventRegistration={handleEventRegistration}
          handleEventRSVP={handleEventRSVP}
          handleEventDetails={handleEventDetails}
          setSelectedEvent={setSelectedEvent}
          setShowAttendeesView={setShowAttendeesView}
          setShowRegistrationModal={setShowRegistrationModal}
          setShowRSVPModal={setShowRSVPModal}
          setShowEventDetailsModal={setShowEventDetailsModal}
        />
      ) : viewMode === VIEW_MODES.WEEK ? (
        <WeekView 
          weekDays={weekDays}
          getEventsForDay={getEventsForDay}
          isDayToday={isDayToday}
          getEventTypeColor={getEventTypeColor}
          getEventTimeRange={getEventTimeRange}
          handleEventRegistration={handleEventRegistration}
          handleEventRSVP={handleEventRSVP}
          handleEventDetails={handleEventDetails}
          setSelectedEvent={setSelectedEvent}
          setShowAttendeesView={setShowAttendeesView}
          setShowRegistrationModal={setShowRegistrationModal}
          setShowRSVPModal={setShowRSVPModal}
          setShowEventDetailsModal={setShowEventDetailsModal}
        />
      ) : (
        <ListView 
          events={filteredEvents}
          getEventTypeColor={getEventTypeColor}
          getEventTimeRange={getEventTimeRange}
          handleEventRegistration={handleEventRegistration}
          handleEventRSVP={handleEventRSVP}
          handleEventDetails={handleEventDetails}
        />
      )}

      {/* New Event Modal */}
      <CreateEventModal 
        open={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onSuccess={() => {
          setShowNewEventModal(false);
          refetch();
        }}
      />

      {/* Event Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <EventRegistration 
          event={selectedEvent}
          onClose={() => {
            setShowRegistrationModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            setShowRegistrationModal(false);
            setSelectedEvent(null);
            refetch();
          }}
        />
      )}

      {/* Event RSVP Modal */}
      {showRSVPModal && selectedEvent && (
        <EventRSVP 
          event={selectedEvent}
          onClose={() => {
            setShowRSVPModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            setShowRSVPModal(false);
            setSelectedEvent(null);
            refetch();
          }}
        />
      )}

      {/* Event Attendees View */}
      {showAttendeesView && selectedEvent && (
        <EventAttendeesView
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          eventDate={selectedEvent.startDate}
          onClose={() => {
            setShowAttendeesView(false);
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => {
            setShowEventDetailsModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
}

// MonthView Component
interface MonthViewProps {
  calendarGrid: (number | null)[];
  currentDate: Date;
  getEventsForDay: (day: number | null) => Event[];
  isDayToday: (day: number | null) => boolean;
  getEventTypeColor: (category: string) => string;
  getEventTimeRange: (event: Event) => string;
  handleEventRegistration: (event: Event) => void;
  handleEventRSVP: (event: Event) => void;
  handleEventDetails: (event: Event) => void;
  setSelectedEvent: (event: Event | null) => void;
  setShowAttendeesView: (show: boolean) => void;
  setShowRegistrationModal: (show: boolean) => void;
  setShowRSVPModal: (show: boolean) => void;
  setShowEventDetailsModal: (show: boolean) => void;
}

function MonthView({ 
  calendarGrid, 
  currentDate, 
  getEventsForDay, 
  isDayToday, 
  getEventTypeColor, 
  getEventTimeRange,
  handleEventRegistration,
  handleEventRSVP,
  handleEventDetails,
  setSelectedEvent,
  setShowAttendeesView,
  setShowRegistrationModal,
  setShowRSVPModal,
  setShowEventDetailsModal
}: MonthViewProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30"></div>
      
      {/* Day headers */}
      <div className="relative grid grid-cols-7 border-b border-gray-200/50">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
          <div key={day} className="p-4 text-center text-sm font-bold text-gray-700 bg-gradient-to-b from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 3)}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="relative grid grid-cols-7">
        {calendarGrid.map((day, i) => {
          const events = getEventsForDay(day);
          const isToday = isDayToday(day);
          const displayEvents = events.slice(0, 2);
          
          return (
            <div 
              key={i} 
              className={`min-h-[140px] p-4 border-r border-b border-gray-100/50 transition-all duration-300 relative group ${
                day ? 'bg-white/60 hover:bg-white/80 backdrop-blur-sm' : 'bg-gray-50/60'
              } ${isToday ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 ring-2 ring-blue-300/50 shadow-lg' : ''}`}
            >
              {day && (
                <div className="h-full flex flex-col relative">
                  <div className="flex justify-between items-center mb-3">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold transition-all duration-200 ${
                      isToday 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-110' 
                        : 'text-gray-700 hover:bg-gray-100 group-hover:scale-105'
                    }`}>
                      {day}
                    </div>
                    {events.length > 0 && (
                      <div className="text-xs px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full font-bold shadow-sm border border-blue-200/50">
                        {events.length}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    {displayEvents.map((event, idx) => (
                      <div key={idx} className="block px-3 py-2 rounded-lg text-xs font-semibold truncate transition-all duration-200 hover:shadow-md hover:scale-105 transform">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.category || 'OTHER')} mr-2 flex-shrink-0 shadow-sm`}></div>
                          <span className="truncate">{event.title}</span>
                        </div>
                        {event.requiresRegistration && (
                          <div className="flex items-center justify-between mt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowAttendeesView(true);
                              }}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              title="View Attendees"
                            >
                              👥 Attendees
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowRegistrationModal(true);
                              }}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                              title="Register for Event"
                            >
                              📝 Register
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowRSVPModal(true);
                              }}
                              className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                              title="RSVP for Event"
                            >
                              📣 RSVP
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {events.length > 2 && (
                      <div className="text-xs px-3 py-2 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium shadow-sm border border-gray-200">
                        +{events.length - 2} more events
                      </div>
                    )}
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// WeekView Component
interface WeekViewProps {
  weekDays: Date[];
  getEventsForDay: (day: Date) => Event[];
  isDayToday: (day: Date) => boolean;
  getEventTypeColor: (category: string) => string;
  getEventTimeRange: (event: Event) => string;
  handleEventRegistration: (event: Event) => void;
  handleEventRSVP: (event: Event) => void;
  handleEventDetails: (event: Event) => void;
  setSelectedEvent: (event: Event | null) => void;
  setShowAttendeesView: (show: boolean) => void;
  setShowRegistrationModal: (show: boolean) => void;
  setShowRSVPModal: (show: boolean) => void;
  setShowEventDetailsModal: (show: boolean) => void;
}

function WeekView({ 
  weekDays, 
  getEventsForDay, 
  isDayToday, 
  getEventTypeColor, 
  getEventTimeRange,
  handleEventRegistration,
  handleEventRSVP,
  handleEventDetails,
  setSelectedEvent,
  setShowAttendeesView,
  setShowRegistrationModal,
  setShowRSVPModal,
  setShowEventDetailsModal
}: WeekViewProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30"></div>
      
      {/* Week Header */}
      <div className="relative grid grid-cols-7 border-b border-gray-200/50">
        {weekDays.map((day, index) => (
          <div key={index} className="p-4 text-center border-r border-gray-200/50 last:border-r-0 bg-gradient-to-b from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              {format(day, 'EEE')}
            </div>
            <div className={`text-2xl font-bold mt-2 transition-all duration-200 ${
              isDayToday(day) 
                ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mx-auto shadow-lg transform scale-110' 
                : 'text-gray-900 hover:text-blue-600'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="relative grid grid-cols-7 min-h-[600px]">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isDayToday(day);
          
          return (
            <div 
              key={index} 
              className={`border-r border-gray-200/50 last:border-r-0 p-3 transition-all duration-300 ${
                isToday ? 'bg-gradient-to-br from-blue-50/60 to-indigo-50/60' : 'hover:bg-gray-50/40'
              }`}
            >
              <div className="space-y-2 h-full">
                {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`p-3 rounded-lg text-sm cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 transform ${getEventTypeColor(event.eventType || event.category || 'OTHER')} group relative overflow-hidden`}
                    onClick={() => handleEventDetails(event)}
                  >
                    {/* Event background pattern */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    
                    <div className="relative">
                      <div className="font-bold text-white truncate mb-1 group-hover:text-white">
                        {event.title}
                      </div>
                      <div className="text-white/90 text-xs font-medium">
                        {getEventTimeRange(event)}
                      </div>
                      {event.location && (
                        <div className="text-white/80 text-xs mt-1 truncate">
                          📍 {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Empty state for days with no events */}
                {dayEvents.length === 0 && (
                  <div className="text-center text-gray-400 text-sm mt-8 italic">
                    No events
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ListView Component
interface ListViewProps {
  events: Event[];
  getEventTypeColor: (category: string) => string;
  getEventTimeRange: (event: Event) => string;
  handleEventRegistration: (event: Event) => void;
  handleEventRSVP: (event: Event) => void;
  handleEventDetails: (event: Event) => void;
}

function ListView({ events, getEventTypeColor, getEventTimeRange, handleEventRegistration, handleEventRSVP, handleEventDetails }: ListViewProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
            <CalendarIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            There are no events matching your current filters. Try adjusting your filters or create a new event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <Link 
          key={event.id} 
          href={`/dashboard/calendar/${event.id}`}
          className="block group"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/20 p-6 transition-all duration-300 hover:scale-[1.02] transform relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-purple-50/10 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-start space-x-6">
              {/* Date Column */}
              <div className="flex-shrink-0 text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm border border-gray-200/50 group-hover:shadow-md transition-shadow duration-300">
                  <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    {format(new Date(event.startDate), 'MMM')}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 leading-none mt-1">
                    {format(new Date(event.startDate), 'd')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">
                    {format(new Date(event.startDate), 'EEE')}
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                        {event.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                        getEventTypeColor(event.category || 'OTHER')
                      }`}>
                        {event.category || 'Other'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="font-medium">{getEventTimeRange(event)}</span>
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                          <span className="font-medium truncate">{event.location}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <div className="flex items-start text-sm text-gray-600 mt-3">
                          <DocumentTextIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                          <p className="line-clamp-2 font-medium">{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Arrow */}
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shadow-sm">
                      <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom border accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${getEventTypeColor(event.category || 'OTHER')} opacity-30 group-hover:opacity-60 transition-opacity duration-300`}></div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// EventDetailsModal Component
interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 w-full max-w-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30"></div>
        
        <div className="relative flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Close
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">{format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-2 text-emerald-500 flex-shrink-0" />
                <span className="font-medium truncate">{event.location}</span>
              </div>
            )}
            
            {event.description && (
              <div className="flex items-start text-sm text-gray-600 mt-3">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="line-clamp-2 font-medium">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
