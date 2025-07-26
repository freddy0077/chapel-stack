"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isToday, getDay } from "date-fns";
import { 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  FunnelIcon
} from "@heroicons/react/24/outline";
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

// Event type options for filter dropdown
const eventTypeOptions = [
  { id: "all", name: "All Events" },
  { id: "SERVICE", name: "Services" },
  { id: "MEETING", name: "Meetings" },
  { id: "CONFERENCE", name: "Conferences" },
  { id: "WORKSHOP", name: "Workshops" },
  { id: "RETREAT", name: "Retreats" },
  { id: "OUTREACH", name: "Outreach" },
  { id: "SOCIAL", name: "Social Events" },
  { id: "OTHER", name: "Other" }
];

// Custom styles added through inline global CSS below

export default function Calendar() {
  // Add dashboard header at the top
  // Icon: CalendarIcon
  // Title: Calendar
  // Subtitle: View and manage all your church events
  // No action button for now
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader
        title="Calendar"
        subtitle="View and manage all your church events"
        icon={<CalendarIcon className="h-10 w-10 text-white" />}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CalendarContent />
      </div>
    </div>
  );
}

// Move the main calendar logic into a CalendarContent component for clarity
function CalendarContent() {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const { canManageEvents, isBranchAdmin } = usePermissions();

  // FAB: floating action button for new event
  // Always visible at bottom right
  // On click, opens NewEventModal
  // Modal disables background scroll and blurs background when open

  const { state } = useAuth();
  const user = state.user;
  
  // Get all events to extract branch and location data
  const orgBranchFilter = useOrganisationBranch();
  
  // Debug logging to understand the data
  console.log('Calendar Debug:', {
    user: user,
    userBranches: user?.userBranches,
    firstBranch: user?.userBranches?.[0],
    branchId: orgBranchFilter.branchId,
    orgBranchFilter: orgBranchFilter,
    canManageEvents: canManageEvents,
    isBranchAdmin: isBranchAdmin,
    userRole: user?.primaryRole
  });

  // State for current date and filter selections
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  // Get branchId from user data
  const userBranchId = orgBranchFilter.branchId;
  
  // Decide which filter to use for API: prioritize branchId if available, otherwise use organisationId
  const apiFilter = userBranchId
    ? { branchId: userBranchId, startDate: firstDayOfMonth, endDate: lastDayOfMonth, category: selectedType !== "all" ? selectedType : undefined }
    : { organisationId: orgBranchFilter.organisationId, startDate: firstDayOfMonth, endDate: lastDayOfMonth, category: selectedType !== "all" ? selectedType : undefined };

  // Use the correct filtered events hook
  const { events, loading, error, refetch } = useFilteredEvents(apiFilter);

  // Dynamically extract branches from all events
  const branchOptions = useMemo(() => {
    const uniqueBranches = new Map<string, {id: string, name: string}>();
    uniqueBranches.set("all", { id: "all", name: "All Branches" });
    
    events.forEach((event: Event) => {
      if (event.branchId) {
        uniqueBranches.set(event.branchId, {
          id: event.branchId,
          name: event.branchId
        });
      }
    });
    
    return Array.from(uniqueBranches.values());
  }, [events]);
  
  // Dynamically extract locations from all events
  const locationOptions = useMemo(() => {
    const uniqueLocations = new Map<string, {id: string, name: string}>();
    uniqueLocations.set("all", { id: "all", name: "All Locations" });
    
    events.forEach((event: Event) => {
      if (event.location) {
        uniqueLocations.set(event.location, {
          id: event.location,
          name: event.location
        });
      }
    });
    
    return Array.from(uniqueLocations.values());
  }, [events]);
  
  // Navigate to previous/next month
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
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
    // Filter by event type
    if (selectedType !== "all" && event.category !== selectedType) {
      return false;
    }
    
    // Filter by branch
    if (selectedBranch !== "all" && event.branchId !== selectedBranch) {
      return false;
    }
    
    // Filter by location
    if (selectedLocation !== "all" && event.location !== selectedLocation) {
      return false;
    }
    
    return true;
  });

  // Convert API events to calendar-friendly format
  const calendarEvents = filteredEvents;

  // Calendar grid generation
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = getDay(startOfMonth(currentDate)); // Day of week for the 1st (0 = Sunday)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Create the calendar grid with blank spaces for days before the 1st
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

  // Format date for display
  const formatEventDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  // Get event time range
  const getEventTimeRange = (event: Event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };
  
  // Get background color for event type
  const getEventTypeColor = (category: string) => {
    switch(category?.toUpperCase()) {
      case "SERVICE": return 'bg-blue-500';
      case "MEETING": return 'bg-amber-500';
      case "CONFERENCE": return 'bg-purple-600';
      case "WORKSHOP": return 'bg-emerald-500';
      case "RETREAT": return 'bg-indigo-600';
      case "OUTREACH": return 'bg-rose-500';
      case "SOCIAL": return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeTextColor = (category: string) => {
    switch(category?.toUpperCase()) {
      case "SERVICE": return 'text-blue-700';
      case "MEETING": return 'text-amber-700';
      case "CONFERENCE": return 'text-purple-700';
      case "WORKSHOP": return 'text-emerald-700';
      case "RETREAT": return 'text-indigo-700';
      case "OUTREACH": return 'text-rose-700';
      case "SOCIAL": return 'text-pink-700';
      default: return 'text-gray-700';
    }
  };

  if (loading && !isClient) return <Loading message="Loading calendar events..." />;
  
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading events</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message || "An unknown error occurred"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50">
          <div className="flex items-start">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl mr-4 shadow-lg">
              <CalendarIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar & Events</h1>
              <p className="mt-2 text-lg text-gray-600">
                Schedule and manage church events, services, and meetings.
              </p>
            </div>
          </div>
          {canManageEvents && (
            <div className="mt-4 sm:mt-0 self-start">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all duration-200"
                onClick={() => setShowNewEventModal(true)}
              >
                <span className="flex items-center gap-1.5">
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Event</span>
                </span>
              </Button>
            </div>
          )}
        </div>

        {/* Event Statistics */}
        <Grid numItemsSm={2} numItemsLg={4} className="gap-6 mb-6">
          <Card decoration="top" decorationColor="blue" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Text>Total Events</Text>
                <Metric className="text-blue-600">{events.length}</Metric>
              </div>
            </div>
          </Card>
          <Card decoration="top" decorationColor="green" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <Text>Events This Month</Text>
                <Metric className="text-green-600">{calendarEvents.length}</Metric>
              </div>
            </div>
          </Card>
          <Card decoration="top" decorationColor="amber" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <UserGroupIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <Text>Upcoming Services</Text>
                <Metric className="text-amber-600">
                  {calendarEvents.filter(event => (event.category || 'OTHER') === 'SERVICE').length}
                </Metric>
              </div>
            </div>
          </Card>
          <Card decoration="top" decorationColor="indigo" className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <ClockIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <Text>Upcoming Meetings</Text>
                <Metric className="text-indigo-600">
                  {calendarEvents.filter(event => (event.category || 'OTHER') === 'MEETING').length}
                </Metric>
              </div>
            </div>
          </Card>
        </Grid>

        {/* Filters */}
        {canManageEvents && !isBranchAdmin && (
          <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Filter Events</h2>
              </div>
              <Button 
                size="xs" 
                variant="secondary"
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200 flex items-center gap-1.5"
              >
                <ArrowPathIcon className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Event Type Filter */}
              <div className="relative p-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-blue-600 text-white mr-3 shadow-md">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                      Event Type
                    </label>
                  </div>
                  <Select 
                    id="type-filter"
                    value={selectedType}
                    onValueChange={setSelectedType}
                    className="mt-1 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm" 
                    style={{ backgroundColor: "white" }}
                  >
                    {eventTypeOptions.map((type, idx) => (
                      <SelectItem key={type.id || idx} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              {/* Branch Filter */}
              <div className="relative p-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-purple-600 text-white mr-3 shadow-md">
                      <UserGroupIcon className="h-4 w-4" />
                    </div>
                    <label htmlFor="branch-filter" className="block text-sm font-medium text-gray-700">
                      Branch
                    </label>
                  </div>
                  <Select 
                    id="branch-filter"
                    value={selectedBranch}
                    onValueChange={setSelectedBranch}
                    className="mt-1 border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm" 
                    style={{ backgroundColor: "white" }}
                  >
                    {branchOptions.map((branch, idx) => (
                      <SelectItem key={branch.id || idx} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
              {/* Location Filter */}
              <div className="relative p-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md bg-gradient-to-br from-green-50 to-teal-50 border border-green-100">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 opacity-50"></div>
                <div className="relative">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-green-600 text-white mr-3 shadow-md">
                      <MapPinIcon className="h-4 w-4" />
                    </div>
                    <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                  </div>
                  <Select 
                    id="location-filter"
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                    className="mt-1 border-gray-200 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm" 
                    style={{ backgroundColor: "white" }}
                  >
                    {locationOptions.map((location, idx) => (
                      <SelectItem key={location.id || idx} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white shadow-lg overflow-hidden rounded-2xl border border-gray-200">
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            <div className="px-6 py-6 relative flex items-center justify-between text-white">
              <h2 className="text-2xl font-bold tracking-wide">{format(currentDate, 'MMMM yyyy')}</h2>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigateMonth('prev')}
                  className="inline-flex items-center justify-center p-2 w-9 h-9 rounded-full shadow-lg text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateMonth('next')}
                  className="inline-flex items-center justify-center p-2 w-9 h-9 rounded-full shadow-lg text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 bg-gray-50 text-center text-gray-700 font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {calendarGrid.map((day, i) => {
              const events = getEventsForDay(day);
              const isToday = isDayToday(day);
              const displayEvents = events.slice(0, 3);
              
              return (
                <div 
                  key={i} 
                  className={`min-h-[120px] p-2 transition-all duration-200 ${day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'} ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                >
                  {day && (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center justify-center h-7 w-7 rounded-full">
                          {isToday ? (
                            <span className="bg-blue-500 text-white font-bold">{day}</span>
                          ) : (
                            <span className="text-gray-700">{day}</span>
                          )}
                        </div>
                        {events.length > 0 && (
                          <div className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full text-gray-600 font-medium">
                            {events.length}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5 mt-1 flex-1">
                        {displayEvents.length > 0 ? (
                          displayEvents.map((event, idx) => (
                            <Link 
                              key={idx} 
                              href={`/dashboard/calendar/${event.id}`}
                              className={`
                                block px-2 py-1.5 rounded-md text-xs font-medium truncate shadow-sm
                                ${getEventTypeColor(event.category || 'OTHER')} text-white hover:opacity-90 transition-all duration-150
                              `}
                              title={event.title}
                            >
                              <div className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"></span>
                                <span className="truncate">{event.title}</span>
                              </div>
                            </Link>
                          ))
                        ) : day ? (
                          <div className="h-6"></div>
                        ) : null}
                        
                        {events.length > 3 && (
                          <div className="text-xs px-2 py-1 mt-1 text-gray-500 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                            +{events.length - 3} more event{events.length - 3 > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-200">
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <div className="bg-indigo-50 p-4 rounded-full inline-flex mx-auto mb-4">
                  <InformationCircleIcon className="h-16 w-16 text-indigo-500" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No events found</h3>
                <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                  Try adjusting your filters or create a new event to start organizing your church activities.
                </p>
                <div className="mt-6">
                {canManageEvents && (
                  <Button icon={PlusIcon} size="md" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200" onClick={() => setShowNewEventModal(true)}>
                    Create New Event
                  </Button>
                )}
              </div>
              </div>
            ) : (
              <ul role="list" className="divide-y divide-gray-100">
                {filteredEvents.map((event) => {
                  const bgColor = getEventTypeColor(event.category || 'OTHER').replace('bg-', 'bg-').replace('500', '100').replace('600', '100');
                  const textColor = getEventTypeTextColor(event.category || 'OTHER');
                  const borderColor = getEventTypeColor(event.category || 'OTHER').replace('bg-', 'border-').replace('500', '200').replace('600', '200');
                  
                  return (
                    <li key={event.id} className={`hover:bg-gray-50 transition-colors duration-150 ${bgColor} border-l-4 ${borderColor.replace('border-', 'border-l-')}`}>
                      <div className="px-6 py-5">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className={`text-lg font-semibold ${textColor}`}>{event.title}</p>
                            <div className="sm:ml-4 flex items-center text-sm text-gray-600">
                              <CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500" />
                              <p className="font-medium">{formatEventDate(event.startDate)}</p>
                            </div>
                          </div>
                          <Link href={`/dashboard/calendar/${event.id}`}>
                            <Button size="xs" className="rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                              View Details
                            </Button>
                          </Link>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="bg-gray-100 p-1.5 rounded-full mr-2">
                              <ClockIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <p>{getEventTimeRange(event)}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="bg-gray-100 p-1.5 rounded-full mr-2">
                              <MapPinIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <p>{event.location || "No location specified"}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              color={(event.color as "blue" | "amber" | "purple" | "emerald" | "indigo" | "rose" | "pink" | "gray") || "gray"} 
                              className="rounded-full"
                            >
                              {event.category || 'OTHER'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
        {/* Floating Action Button and Modal */}
        {canManageEvents && (
          <button
            aria-label="Create New Event"
            className="fixed z-40 bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl p-4 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
            onClick={() => setShowNewEventModal(true)}
            style={{ boxShadow: '0 10px 32px rgba(80, 62, 255, 0.15)' }}
          >
            <PlusIcon className="h-6 w-6" />
            <span className="hidden md:inline font-semibold">New Event</span>
          </button>
        )}
        <NewEventModal 
          open={showNewEventModal} 
          onClose={() => setShowNewEventModal(false)}
          onEventCreated={refetch} // Add this prop to trigger refetch after creation
        />
      </div>
    </div>
  );
}
