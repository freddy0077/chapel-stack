"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CalendarIcon, 
  UsersIcon, 
  ArrowDownTrayIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CreditCardIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import AttendanceReportModal from "./components/AttendanceReportModal";
import NewEventModal, { NewEventInput } from "./components/NewEventModal";
import AttendanceSessionDetailsModal from "./components/AttendanceSessionDetailsModal";
import { AttendanceRecord } from "./types";
import { useFilteredAttendanceSessions } from "@/graphql/hooks/useAttendance";
import { useAuth } from "@/graphql/hooks/useAuth";
import { useMutation } from "@apollo/client";
import { CREATE_ATTENDANCE_SESSION } from "@/graphql/queries/attendanceQueries";
import DashboardHeader from "@/components/DashboardHeader";
import { useOrganizationBranchFilter } from '@/hooks';

export default function AttendanceDashboard() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsModalSessionId, setDetailsModalSessionId] = useState<string | null>(null);
  const [detailsModalSessionName, setDetailsModalSessionName] = useState<string>("");
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  // Get current branch from auth context
  const { user } = useAuth();
  const orgBranchFilter = useOrganizationBranchFilter();

  // Apollo mutation for creating attendance session
  const [createAttendanceSession] = useMutation(CREATE_ATTENDANCE_SESSION);

  // Handler for creating a new event
  const handleCreateNewEvent = async (event: NewEventInput) => {
    setCreatingEvent(true);
    setCreateError(null);

    // For SUPER_ADMIN users, we need to ensure we have either branchId or organisationId
    if (!orgBranchFilter.branchId && !orgBranchFilter.organisationId) {
      setCreatingEvent(false);
      setCreateError("No branch or organization selected. Cannot create attendance event.");
      return;
    }

    try {
      // Prepare input object, combining date and time fields into valid Date objects
      const { date, startTime, endTime, ...rest } = event;
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      const input: any = {
        ...rest,
        date: startDateTime,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      // Only add branchId if it exists
      if (orgBranchFilter.branchId) {
        input.branchId = orgBranchFilter.branchId;
      }

      // The organisationId is passed from the modal, but we ensure it's correctly set
      if (orgBranchFilter.organisationId) {
        input.organisationId = orgBranchFilter.organisationId;
      } else {
        delete input.organisationId;
      }

      await createAttendanceSession({
        variables: { input },
      });

      setCreatingEvent(false);
      setIsNewEventModalOpen(false);
      // Refetch attendance sessions for latest data
      if (refetch) refetch();
    } catch (err: any) {
      setCreatingEvent(false);
      setCreateError(err?.message || "Failed to create event.");
    }
  };

  // Fetch attendance sessions using the organization-branch filter
  const { sessions, loading, error, refetch } = useFilteredAttendanceSessions(orgBranchFilter);

  // Map attendance sessions for UI (each row is a session, not a record)
  type AttendanceSessionUIItem = {
    id: string;
    name: string;
    type: string;
    date: string;
    time: string;
    totalAttendees: string | number;
    childrenCount: string | number;
    youthCount: string | number;
    adultsCount: string | number;
    volunteers: string | number;
    firstTimeVisitors: string | number;
    raw: any;
  };

  const filteredAttendance: AttendanceSessionUIItem[] = sessions
    .map((session: any): AttendanceSessionUIItem => {
      return {
        id: session.id,
        name: session.name || "Attendance Session",
        type: session.type || "other",
        date: session.startTime ? new Date(session.startTime).toISOString() : session.date || "",
        time: session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
        totalAttendees: '--', // No record-level data available
        childrenCount: '--',
        youthCount: '--',
        adultsCount: '--',
        volunteers: '--',
        firstTimeVisitors: '--',
        raw: session,
      };
    })
    .filter((item) => {
      // Filter by search term
      const matchesSearch = searchTerm === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Filter by type
      const matchesType = filterType === null || item.type === filterType;
      // Filter by date range
      let matchesDateRange = true;
      if (dateRange.start && dateRange.end) {
        const itemDate = new Date(item.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        matchesDateRange = itemDate >= startDate && itemDate <= endDate;
      }
      return matchesSearch && matchesType && matchesDateRange;
    });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredAttendance.length / pageSize);

  // Sort by date (most recent first)
  const sortedAttendance = [...filteredAttendance].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const paginatedAttendance = sortedAttendance.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Calculate overall stats
  const totalAttendees = sortedAttendance.length; // Each record is one attendee
  const averageAttendance = sortedAttendance.length > 0
    ? Math.round(totalAttendees / sortedAttendance.length)
    : 0;
  const totalFirstTimeVisitors = sortedAttendance.reduce((sum, item) => sum + item.firstTimeVisitors, 0);

  // Show loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-gray-500">Loading attendance records...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-lg text-red-500">Error loading attendance records: {error.message}</span>
      </div>
    );
  }

  // Helpers for displaying event information
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "service": return "Service";
      case "small_group": return "Small Group";
      case "event": return "Event";
      default: return "Other";
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "service": return "bg-blue-100 text-blue-800";
      case "small_group": return "bg-green-100 text-green-800";
      case "event": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
    <DashboardHeader title="Attendance Dashboard" subtitle="Monitor attendance for services, events, and small groups" />
    <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[80vh]">
      {/* Centered content wrapper start */}
      <div className="w-full max-w-6xl">
        {/* Header section with stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <UsersIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Attendees</h3>
                  <p className="text-2xl font-semibold text-gray-900">{totalAttendees}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <CalendarIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Average Attendance</h3>
                  <p className="text-2xl font-semibold text-gray-900">{averageAttendance}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <UsersIcon className="h-6 w-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">First-time Visitors</h3>
                  <p className="text-2xl font-semibold text-gray-900">{totalFirstTimeVisitors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions and filters section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <label htmlFor="search" className="sr-only">Search</label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="block w-full rounded-md border-gray-300 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="type" className="sr-only">Filter by Type</label>
                  <select
                    id="type"
                    name="type"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value === "" ? null : e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="service">Services</option>
                    <option value="small_group">Small Groups</option>
                    <option value="event">Events</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div>
                    <label htmlFor="start-date" className="sr-only">Start Date</label>
                    <input
                      type="date"
                      id="start-date"
                      name="start-date"
                      className="block w-full rounded-md border-gray-300 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <div>
                    <label htmlFor="end-date" className="sr-only">End Date</label>
                    <input
                      type="date"
                      id="end-date"
                      name="end-date"
                      className="block w-full rounded-md border-gray-300 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="flex items-center space-x-2 mr-4">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md ${viewMode === "list" 
                      ? "bg-gray-100 text-gray-900" 
                      : "text-gray-400 hover:text-gray-500"}`}
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md ${viewMode === "grid" 
                      ? "bg-gray-100 text-gray-900" 
                      : "text-gray-400 hover:text-gray-500"}`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    href="/dashboard/attendance/card-scanning"
                    className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <CreditCardIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Card Scanning System
                  </Link>
                  
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
                  >
                    <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance records */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Records</h2>
          
          {sortedAttendance.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
              <p className="mt-1 text-sm text-gray-500">Adjust your filters or try a different search term.</p>
            </div>
          ) : viewMode === "list" ? (
            <>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedAttendance.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md border border-indigo-100 p-6 flex flex-col justify-between hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getTypeColor(item.type)}`}>{getTypeLabel(item.type)}</span>
                      <time className="text-xs text-gray-500">{formatDate(item.date)}</time>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-900 mb-1 truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-500">{item.time}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                        <span className="text-xs text-gray-500">Total</span>
                        <span className="text-xl font-bold text-indigo-800">{item.totalAttendees}</span>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm flex flex-col items-center">
                        <span className="text-xs text-gray-500">New Visitors</span>
                        <span className="text-xl font-bold text-indigo-800">{item.firstTimeVisitors}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      <span>{item.adultsCount} adults</span>, <span>{item.youthCount} youth</span>, <span>{item.childrenCount} children</span>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900 transition"
                        onClick={() => {
                          setDetailsModalSessionId(item.id);
                          setDetailsModalSessionName(item.name);
                          setDetailsModalOpen(true);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <button
                    className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span className="mx-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedAttendance.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <time className="text-xs text-gray-500">{formatDate(item.date)}</time>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.time}</p>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-xl font-semibold text-gray-900">{item.totalAttendees}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <p className="text-xs text-gray-500">New Visitors</p>
                      <p className="text-xl font-semibold text-gray-900">{item.firstTimeVisitors}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      onClick={() => {
                        setDetailsModalSessionId(item.id);
                        setDetailsModalSessionName(item.name);
                        setDetailsModalOpen(true);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick action buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              <p className="mt-1 text-sm text-gray-500">Manage attendance activities</p>
            </div>
            <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none transition"
                onClick={() => setIsNewEventModalOpen(true)}
              >
                <CalendarIcon className="w-5 h-5 mr-2 -ml-1" />
                Add New Event
              </button>
              <Link
                href="/dashboard/attendance/take"
                className="inline-flex items-center justify-center rounded-md border border-indigo-500 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 focus:outline-none"
              >
                <CheckIcon className="w-5 h-5 mr-2 -ml-1" />
                Take Attendance
              </Link>
              <Link
                href="/dashboard/attendance/reports"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                View All Reports
              </Link>
            </div>
          </div>
        </div>

        {/* New Event Modal */}
        <NewEventModal
          isOpen={isNewEventModalOpen}
          onClose={() => setIsNewEventModalOpen(false)}
          onCreate={handleCreateNewEvent}
          loading={creatingEvent}
          error={createError || undefined}
        />

        {detailsModalOpen && detailsModalSessionId && (
          <AttendanceSessionDetailsModal
            isOpen={detailsModalOpen}
            onClose={() => {
              setDetailsModalOpen(false);
              setDetailsModalSessionId(null);
            }}
            sessionId={detailsModalSessionId}
            sessionName={detailsModalSessionName}
          />
        )}

        {/* Report modal */}
        <AttendanceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          attendanceData={sortedAttendance}
        />
      </div>
      {/* Centered content wrapper end */}
    </div>
    </>
  );
}
