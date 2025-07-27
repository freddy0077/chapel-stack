"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isToday, getDay, isSameMonth, isSameDay } from "date-fns";
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
} from '@heroicons/react/24/outline';
import DashboardHeader from "@/components/DashboardHeader";
import NewEventModal from "../../../components/NewEventModal";
import { Card, Select, SelectItem, Button, Badge, Text, Grid, Metric } from "@tremor/react";
import { useFilteredEvents } from "@/graphql/hooks/useFilteredEvents";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { Event } from "@/graphql/types/event";
import Loading from "@/components/ui/Loading";
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from "@/contexts/AuthContextEnhanced";

const isClient = typeof window !== 'undefined';

// View modes
const VIEW_MODES = {
  MONTH: 'month',
  LIST: 'list'
} as const;

type ViewMode = typeof VIEW_MODES[keyof typeof VIEW_MODES];

// Event type options with colors
const eventTypeOptions = [
  { id: 'all', name: 'All Events', color: 'bg-gray-500' },
  { id: 'SERVICE', name: 'Service', color: 'bg-blue-500' },
  { id: 'MEETING', name: 'Meeting', color: 'bg-green-500' },
  { id: 'CONFERENCE', name: 'Conference', color: 'bg-purple-500' },
  { id: 'WORKSHOP', name: 'Workshop', color: 'bg-yellow-500' },
  { id: 'SOCIAL', name: 'Social Event', color: 'bg-pink-500' },
  { id: 'OTHER', name: 'Other', color: 'bg-gray-500' },
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
  const { canManageEvents, isBranchAdmin } = usePermissions();

  const { state } = useAuth();
  const user = state.user;
  
  const orgBranchFilter = useOrganisationBranch();

  // State for current date and filter selections
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");

  // Get events data
  const firstDay = startOfMonth(currentDate);
  const lastDay = endOfMonth(currentDate);
  
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
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedType("all");
    setSelectedBranch("all");
    setSelectedLocation("all");
  };
  
  // Effect to refetch events when month changes
  useEffect(() => {
    const newFirstDay = startOfMonth(currentDate);
    const newLastDay = endOfMonth(currentDate);
    refetch({
      startDate: newFirstDay,
      endDate: newLastDay
    });
  }, [currentDate, refetch]);
  
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
  
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate));
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  const calendarGrid = [...Array(startDay).fill(null), ...days];
  
  // Get events for a specific day
  const getEventsForDay = (day: number | null) => {
    if (day === null) return [];
    
    const eventsForDay = filteredEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      return eventStart.getDate() === day && 
             eventStart.getMonth() === currentDate.getMonth() && 
             eventStart.getFullYear() === currentDate.getFullYear();
    });
    
    return eventsForDay;
  };
  
  // Check if a day is today
  const isDayToday = (day: number | null) => {
    if (day === null) return false;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return isToday(dayDate);
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
          {/* Month Navigation */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-3 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md group"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
              <div className="px-6 py-3 min-w-[220px] text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
              </div>
              <button
                onClick={() => navigateMonth('next')}
                className="p-3 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md group"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              </button>
            </div>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"
            >
              Today
            </button>
          </div>

          {/* View Controls and Actions */}
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-1 shadow-inner">
              <button
                onClick={() => setViewMode(VIEW_MODES.MONTH)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  viewMode === VIEW_MODES.MONTH
                    ? 'bg-white text-gray-900 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <ViewColumnsIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode(VIEW_MODES.LIST)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  viewMode === VIEW_MODES.LIST
                    ? 'bg-white text-gray-900 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border ${
                showFilters
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                  : 'bg-white/80 text-gray-700 hover:bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all duration-200 hover:shadow-md group"
            >
              <ArrowPathIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>

            {/* Create Event Button */}
            {canManageEvents && (
              <button
                onClick={() => setShowNewEventModal(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                New Event
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-8 pt-6 border-t border-gray-200/50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl -m-4"></div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-gray-900">Filter Events</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-gray-900 transition-colors">
                    <CalendarIcon className="h-4 w-4 inline mr-2 text-blue-500" />
                    Event Type
                  </label>
                  <div className="relative">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      {eventTypeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${option.color} mr-3 shadow-sm`} />
                            <span className="font-medium">{option.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-gray-900 transition-colors">
                    <UserGroupIcon className="h-4 w-4 inline mr-2 text-purple-500" />
                    Branch
                  </label>
                  <div className="relative">
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      {branchOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <span className="font-medium">{option.name}</span>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-gray-900 transition-colors">
                    <MapPinIcon className="h-4 w-4 inline mr-2 text-emerald-500" />
                    Location
                  </label>
                  <div className="relative">
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      {locationOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <span className="font-medium">{option.name}</span>
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <Text className="text-sm font-medium text-gray-700">
                    Showing <span className="font-bold text-gray-900">{filteredEvents.length}</span> of <span className="font-bold text-gray-900">{events.length}</span> events
                  </Text>
                </div>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Grid or List View */}
      {viewMode === VIEW_MODES.MONTH ? (
        <MonthView 
          calendarGrid={calendarGrid}
          currentDate={currentDate}
          getEventsForDay={getEventsForDay}
          isDayToday={isDayToday}
          getEventTypeColor={getEventTypeColor}
          getEventTimeRange={getEventTimeRange}
        />
      ) : (
        <ListView 
          events={filteredEvents}
          getEventTypeColor={getEventTypeColor}
          getEventTimeRange={getEventTimeRange}
        />
      )}

      {/* New Event Modal */}
      <NewEventModal 
        open={showNewEventModal}
        onClose={() => setShowNewEventModal(false)}
        onEventCreated={() => {
          setShowNewEventModal(false);
          refetch();
        }}
      />
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
}

function MonthView({ 
  calendarGrid, 
  currentDate, 
  getEventsForDay, 
  isDayToday, 
  getEventTypeColor, 
  getEventTimeRange 
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
                      <Link 
                        key={idx} 
                        href={`/dashboard/calendar/${event.id}`}
                        className={`block px-3 py-2 rounded-lg text-xs font-semibold truncate transition-all duration-200 hover:shadow-md hover:scale-105 transform ${
                          getEventTypeColor(event.category || 'OTHER')
                        } text-white shadow-sm border border-white/20`}
                        title={`${event.title} - ${getEventTimeRange(event)}`}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-white/90 mr-2 flex-shrink-0 shadow-sm" />
                          <span className="truncate">{event.title}</span>
                        </div>
                      </Link>
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

// ListView Component
interface ListViewProps {
  events: Event[];
  getEventTypeColor: (category: string) => string;
  getEventTimeRange: (event: Event) => string;
}

function ListView({ events, getEventTypeColor, getEventTimeRange }: ListViewProps) {
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
