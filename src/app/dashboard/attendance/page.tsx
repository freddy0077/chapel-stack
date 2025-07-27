"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CalendarIcon, 
  UsersIcon, 
  ArrowDownTrayIcon,
  ListBulletIcon,
  Squares2X2Icon,
  CreditCardIcon,
  CheckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import AttendanceReportModal from "./components/AttendanceReportModal";
import NewEventModal, { NewEventInput } from "./components/NewEventModal";
import AttendanceSessionDetailsModal from "./components/AttendanceSessionDetailsModal";
import PaginatedAttendanceRecords from "./components/PaginatedAttendanceRecords";
import AttendanceReportDownloadModal from "@/components/attendance/AttendanceReportDownloadModal";
import { useFilteredAttendanceSessions, useAllAttendanceRecords } from "@/graphql/hooks/useAttendance";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useMutation, useQuery, gql } from "@apollo/client";
import { CREATE_ATTENDANCE_SESSION } from "@/graphql/queries/attendanceQueries";
import DashboardHeader from "@/components/DashboardHeader";
import { useOrganizationBranchFilter } from '@/hooks';
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";

// Query to get events for the dashboard with correct parameter types
const GET_EVENTS = gql`
  query GetEvents($branchId: String, $organisationId: String) {
    events(branchId: $branchId, organisationId: $organisationId) {
      id
      title
      startDate
      endDate
      location
      category
    }
  }
`;

export default function AttendanceDashboard() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [activeTab, setActiveTab] = useState<"sessions" | "events" | "all" | "records">("all");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
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
  const { state } = useAuth();
  const user = state.user;
  const orgBranchFilter = useOrganizationBranchFilter();

  // Apollo mutation for creating attendance session
  const [createAttendanceSession] = useMutation(CREATE_ATTENDANCE_SESSION);

  // Fetch attendance sessions and events
  const { sessions, loading: loadingSessions, error: sessionsError, refetch } = useFilteredAttendanceSessions(orgBranchFilter);
  const { data: eventsData, loading: loadingEvents } = useQuery(GET_EVENTS, {
    variables: {
      branchId: orgBranchFilter.branchId || null,
      organisationId: orgBranchFilter.organisationId || null,
    },
    skip: !orgBranchFilter.branchId || !orgBranchFilter.organisationId,
  });
  const events = eventsData?.events || [];

  // Fetch all attendance records for statistics
  const { attendanceRecords } = useAllAttendanceRecords({
    filter: {
      branchId: orgBranchFilter.branchId,
    }
  });

  // Handler for creating a new event
  const handleCreateNewEvent = async (event: NewEventInput) => {
    setCreatingEvent(true);
    setCreateError(null);

    if (orgBranchFilter.branchId && !orgBranchFilter.organisationId) {
      setCreatingEvent(false);
      setCreateError("No branch or organization selected. Cannot create attendance event.");
      return;
    }

    try {
      const { date, startTime, endTime, ...rest } = event;
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      const input: any = {
        ...rest,
        date: startDateTime,
        startTime: startDateTime,
        endTime: endDateTime,
      };

      if (orgBranchFilter.branchId) {
        input.branchId = orgBranchFilter.branchId;
      }

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
      if (refetch) refetch();
    } catch (err: any) {
      setCreatingEvent(false);
      setCreateError(err?.message || "Failed to create event.");
    }
  };

  // Combined data for sessions and events with pagination
  const combinedItems = useMemo(() => {
    const sessionItems = sessions.map((session) => ({
      id: session.id,
      title: session.name,
      type: "session" as const,
      date: new Date(session.date),
      location: session.location,
      category: session.category,
      attendanceCount: session.attendanceRecords?.length || 0,
    }));

    const eventItems = events.map((event) => ({
      id: event.id,
      title: event.title,
      type: "event" as const,
      date: new Date(event.startDate),
      location: event.location,
      category: event.category,
      attendanceCount: 0, // Events don't have direct attendance count in this query
    }));

    return [...sessionItems, ...eventItems];
  }, [sessions, events]);

  // Filter items based on active tab, search, and filters
  const filteredItems = useMemo(() => {
    return combinedItems.filter((item) => {
      // Tab filtering
      if (activeTab === "sessions" && item.type !== "session") return false;
      if (activeTab === "events" && item.type !== "event") return false;
      
      // Search filtering
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Date range filtering
      if (dateRange.start && item.date < new Date(dateRange.start)) return false;
      if (dateRange.end && item.date > new Date(dateRange.end)) return false;
      
      // Type filtering
      if (filterType && item.category !== filterType) return false;
      
      return true;
    });
  }, [combinedItems, activeTab, searchTerm, dateRange, filterType]);

  // Pagination for sessions and events
  const pagination = usePagination(filteredItems, {
    initialItemsPerPage: 12,
    totalItems: filteredItems.length,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAttendees = attendanceRecords.length;
    const uniqueMembers = new Set(attendanceRecords.map(r => r.member?.id).filter(Boolean)).size;
    const visitors = attendanceRecords.filter(r => r.visitorName).length;
    const recentAttendance = attendanceRecords.filter(r => {
      const recordDate = new Date(r.checkInTime);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDate >= thirtyDaysAgo;
    }).length;

    return {
      totalAttendees,
      uniqueMembers,
      visitors,
      recentAttendance,
      totalSessions: sessions.length,
      totalEvents: events.length,
    };
  }, [attendanceRecords, sessions, events]);

  const loading = loadingSessions || loadingEvents;
  const error = sessionsError;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <span className="text-lg text-gray-500">Loading attendance data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-lg text-red-500">Error loading attendance data: {error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader title="Attendance Dashboard" subtitle="Monitor attendance for sessions, events, and activities" />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Attendance</p>
                  <p className="text-3xl font-bold">{stats.totalAttendees}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                  <UsersIcon className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Unique Members</p>
                  <p className="text-3xl font-bold">{stats.uniqueMembers}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                  <UsersIcon className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Visitors</p>
                  <p className="text-3xl font-bold">{stats.visitors}</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                  <UsersIcon className="h-8 w-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Recent (30d)</p>
                  <p className="text-3xl font-bold">{stats.recentAttendance}</p>
                </div>
                <div className="bg-amber-400 bg-opacity-30 rounded-full p-3">
                  <ClockIcon className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Tab Navigation */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All ({combinedItems.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("sessions")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "sessions"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Sessions ({stats.totalSessions})
                  </button>
                  <button
                    onClick={() => setActiveTab("events")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "events"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Events ({stats.totalEvents})
                  </button>
                  <button
                    onClick={() => setActiveTab("records")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "records"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Records ({stats.totalAttendees})
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sessions and events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ListBulletIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Action Buttons */}
                <Link
                  href="/dashboard/attendance/take"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <CheckIcon className="h-5 w-5" />
                  Take Attendance
                </Link>

                <button
                  onClick={() => setIsNewEventModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <PlusIcon className="h-5 w-5" />
                  New Session
                </button>

                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download Report
                </button>
              </div>
            </div>
          </div>

          {/* Content Display */}
          {activeTab === "records" ? (
            <PaginatedAttendanceRecords
              records={attendanceRecords}
              loading={false}
              error={null}
              onViewRecord={(record) => {
                // Handle view record action
                console.log('View record:', record);
              }}
              onEditRecord={(record) => {
                // Handle edit record action
                console.log('Edit record:', record);
              }}
              onDeleteRecord={(record) => {
                // Handle delete record action
                console.log('Delete record:', record);
              }}
              viewMode={viewMode === "grid" ? "cards" : "table"}
              className="space-y-6"
            />
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <CalendarIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterType || dateRange.start
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating a new session or event."}
              </p>
              <button
                onClick={() => setIsNewEventModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create New Session
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagination.paginatedData.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === "session" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {item.type === "session" ? "Session" : "Event"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {item.date.toLocaleDateString()}
                          </div>
                          {item.location && (
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {item.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-600">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {item.attendanceCount} attendees
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (item.type === "session") {
                                setDetailsModalSessionId(item.id);
                                setDetailsModalSessionName(item.title);
                                setDetailsModalOpen(true);
                              }
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/dashboard/attendance/take?${item.type}Id=${item.id}`}
                            className="p-2 text-indigo-400 hover:text-indigo-600 transition-colors"
                            title="Take Attendance"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination for Grid View */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={pagination.goToPage}
                  onItemsPerPageChange={pagination.setItemsPerPage}
                  showItemsPerPage={true}
                  showInfo={true}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendees
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagination.paginatedData.map((item) => (
                        <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === "session" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-purple-100 text-purple-800"
                            }`}>
                              {item.type === "session" ? "Session" : "Event"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.date.toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.location || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.attendanceCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  if (item.type === "session") {
                                    setDetailsModalSessionId(item.id);
                                    setDetailsModalSessionName(item.title);
                                    setDetailsModalOpen(true);
                                  }
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <Link
                                href={`/dashboard/attendance/take?${item.type}Id=${item.id}`}
                                className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                                title="Take Attendance"
                              >
                                <CheckIcon className="h-4 w-4" />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination for Table View */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={pagination.goToPage}
                  onItemsPerPageChange={pagination.setItemsPerPage}
                  showItemsPerPage={true}
                  showInfo={true}
                />
              </div>
            </div>
          )}
          <Pagination pagination={pagination} />
        </div>

        {/* Modals */}
        <AttendanceReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

        <AttendanceReportDownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
        />

        <NewEventModal
          isOpen={isNewEventModalOpen}
          onClose={() => setIsNewEventModalOpen(false)}
          onSubmit={handleCreateNewEvent}
          loading={creatingEvent}
          error={createError}
        />

        <AttendanceSessionDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          sessionId={detailsModalSessionId}
          sessionName={detailsModalSessionName}
        />
      </div>
    </>
  );
}
