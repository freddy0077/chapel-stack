"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganizationBranchFilter } from "@/hooks";
import {
  useFilteredAttendanceSessions,
  useRecordAttendance,
  useAttendanceRecordsForSession,
  useAttendanceRecordsForEvent,
} from "@/graphql/hooks/useAttendance";
import { useMembers } from "@/graphql/hooks/useMember";
import { useQuery, gql } from "@apollo/client";
import { AttendanceRecord } from "../types";
import Link from "next/link";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/pagination";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UsersIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon 
} from "@heroicons/react/24/outline";
import { useFilteredSmallGroups } from "@/graphql/hooks/useSmallGroups";

// Query to get events for the branch/organization
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

export default function TakeAttendancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgBranchFilter = useOrganizationBranchFilter();

  // Get URL parameters
  const urlSessionId = searchParams.get("sessionId");
  const urlEventId = searchParams.get("eventId");

  // Attendance type selection (session or event)
  // Auto-detect type based on URL parameters
  const [attendanceType, setAttendanceType] = useState<"session" | "event">(
    urlEventId ? "event" : urlSessionId ? "session" : "session",
  );

  // Session selection
  const { sessions, loading: loadingSessions } =
    useFilteredAttendanceSessions(orgBranchFilter);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    searchParams.get("sessionId") || null,
  );

  // Event selection
  const { data: eventsData, loading: loadingEvents } = useQuery(GET_EVENTS, {
    variables: {
      branchId: orgBranchFilter.branchId || null,
      organisationId: orgBranchFilter.organisationId || null,
    },
    skip: !orgBranchFilter.branchId || !orgBranchFilter.organisationId,
  });
  const events = eventsData?.events || [];
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    urlEventId || null,
  );

  // Member search state with debouncing (declare before using in useMembers)
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Pagination state for members
  const [memberPage, setMemberPage] = useState(1);
  const [memberItemsPerPage, setMemberItemsPerPage] = useState(10);

  // Debounce search input to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      // Reset to first page when search changes
      setMemberPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Group selection dropdown state
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string | null>(null);

  // Members for this branch - fetch all members when group filter is active, otherwise use pagination
  const shouldFetchAll = selectedGroupFilter !== null;
  const memberSkip = shouldFetchAll ? 0 : (memberPage - 1) * memberItemsPerPage;
  const memberTake = shouldFetchAll ? 1000 : memberItemsPerPage; // Fetch up to 1000 members when filtering by group
  
  const { members: allMembers, loading: loadingMembers, totalCount: membersTotalCount } = useMembers({
    branchId: orgBranchFilter.branchId,
    organisationId: orgBranchFilter.organisationId,
    search: debouncedSearch, // Pass debounced search to backend
  }, {
    skip: memberSkip,
    take: memberTake,
  });

  // Fetch groups for group-based selection
  const { smallGroups, loading: loadingGroups, error: groupsError } = useFilteredSmallGroups({
    branchId: orgBranchFilter.branchId,
    organisationId: orgBranchFilter.organisationId,
    status: "ACTIVE", // Only get active groups
  });

  // Filter members by selected group and apply client-side pagination
  const { members, filteredTotalCount, paginatedMembers } = useMemo(() => {
    // Ensure allMembers is always an array
    const safeAllMembers = Array.isArray(allMembers) ? allMembers : [];
    const safeSmallGroups = Array.isArray(smallGroups) ? smallGroups : [];
    
    if (!selectedGroupFilter || safeSmallGroups.length === 0) {
      // Show all members if no group filter selected - use backend pagination
      return {
        members: safeAllMembers,
        filteredTotalCount: membersTotalCount || 0,
        paginatedMembers: safeAllMembers
      };
    }

    const selectedGroup = safeSmallGroups.find((group: any) => group.id === selectedGroupFilter);
    if (!selectedGroup) {
      return {
        members: safeAllMembers,
        filteredTotalCount: membersTotalCount || 0,
        paginatedMembers: safeAllMembers
      };
    }

    const groupMemberIds = selectedGroup.members?.map((member: any) => member.memberId) || [];
    const filteredMembers = safeAllMembers.filter((member: any) => groupMemberIds.includes(member.id));
    
    // Apply client-side pagination to filtered members
    const startIndex = (memberPage - 1) * memberItemsPerPage;
    const endIndex = startIndex + memberItemsPerPage;
    const paginatedFilteredMembers = filteredMembers.slice(startIndex, endIndex);
    
    return {
      members: filteredMembers, // Keep full filtered list for calculations
      filteredTotalCount: filteredMembers.length, // Actual count of filtered members
      paginatedMembers: paginatedFilteredMembers // Paginated subset for display
    };
  }, [allMembers, selectedGroupFilter, smallGroups, membersTotalCount, memberPage, memberItemsPerPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showGroupDropdown && !target.closest('[data-group-dropdown]')) {
        setShowGroupDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGroupDropdown]);

  // Fetch attendance records based on type
  const { attendanceRecords: sessionAttendanceRecords } =
    useAttendanceRecordsForSession({
      sessionId: selectedSessionId || "",
    });
  const {
    attendanceRecords: eventAttendanceRecords,
    refetch: refetchEventAttendance,
  } = useAttendanceRecordsForEvent({
    eventId: selectedEventId || undefined,
  });

  const attendanceRecords =
    attendanceType === "session"
      ? sessionAttendanceRecords
      : eventAttendanceRecords;

  // Handle URL parameter changes and preselection
  useEffect(() => {
    // If eventId is provided in URL, switch to event mode and preselect the event
    if (urlEventId && events.length > 0) {
      const eventExists = events.some((event: any) => event.id === urlEventId);
      if (eventExists && selectedEventId !== urlEventId) {
        setAttendanceType("event");
        setSelectedEventId(urlEventId);
        // Clear any session selection
        setSelectedSessionId(null);
        // Clear previous attendance selections
        setAttendance({});
        setError(null);
        setSuccess(false);
      }
    }
    // If sessionId is provided in URL, switch to session mode and preselect the session
    else if (urlSessionId && sessions.length > 0) {
      const sessionExists = sessions.some((session: any) => session.id === urlSessionId);
      if (sessionExists && selectedSessionId !== urlSessionId) {
        setAttendanceType("session");
        setSelectedSessionId(urlSessionId);
        // Clear any event selection
        setSelectedEventId(null);
        // Clear previous attendance selections
        setAttendance({});
        setError(null);
        setSuccess(false);
      }
    }
  }, [urlEventId, urlSessionId, events, sessions, selectedEventId, selectedSessionId]);

  // Attendance marking state
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { recordAttendance } = useRecordAttendance();

  // Session/Event search and pagination state
  const [sessionSearch, setSessionSearch] = useState("");
  const [eventSearch, setEventSearch] = useState("");

  // Filter sessions and events based on search
  const filteredSessions = useMemo(() => {
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    if (!sessionSearch.trim()) return safeSessions;
    const s = sessionSearch.trim().toLowerCase();
    return safeSessions.filter((session: any) =>
      session.name?.toLowerCase().includes(s) ||
      session.location?.toLowerCase().includes(s)
    );
  }, [sessionSearch, sessions]);

  const filteredEvents = useMemo(() => {
    const safeEvents = Array.isArray(events) ? events : [];
    if (!eventSearch.trim()) return safeEvents;
    const s = eventSearch.trim().toLowerCase();
    return safeEvents.filter((event: any) =>
      event.title?.toLowerCase().includes(s) ||
      event.location?.toLowerCase().includes(s)
    );
  }, [eventSearch, events]);

  // Pagination for sessions and events
  const sessionPagination = usePagination(filteredSessions, {
    initialItemsPerPage: 6,
    totalItems: filteredSessions.length,
  });

  const eventPagination = usePagination(filteredEvents, {
    initialItemsPerPage: 6,
    totalItems: filteredEvents.length,
  });

  // Handle attendance checkbox
  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  // Select All / Deselect All functionality (works on current page)
  const handleSelectAll = () => {
    const newAttendance = { ...attendance };
    const safePaginatedMembersLocal = Array.isArray(paginatedMembers) ? paginatedMembers : [];
    const safeAttendanceRecordsLocal = Array.isArray(attendanceRecords) ? attendanceRecords : [];
    
    const availableMembersOnPage = safePaginatedMembersLocal.filter((member: any) => {
      // Don't include members who already have attendance marked
      return !safeAttendanceRecordsLocal.some((r: any) => r.member?.id === member.id);
    });

    const allSelected = availableMembersOnPage.every((member: any) => attendance[member.id]);
    
    if (allSelected) {
      // Deselect all available members on current page
      availableMembersOnPage.forEach((member: any) => {
        newAttendance[member.id] = false;
      });
    } else {
      // Select all available members on current page
      availableMembersOnPage.forEach((member: any) => {
        newAttendance[member.id] = true;
      });
    }
    
    setAttendance(newAttendance);
  };

  // Handle group filter selection
  const handleGroupFilter = (groupId: string | null) => {
    setSelectedGroupFilter(groupId);
    setShowGroupDropdown(false);
    // Reset to first page when group filter changes
    setMemberPage(1);
    // Clear any current attendance selections when switching groups
    setAttendance({});
  };

  // Calculate selection state for the select all checkbox (use paginated members for current page)
  const safePaginatedMembers = Array.isArray(paginatedMembers) ? paginatedMembers : [];
  const safeAttendanceRecords = Array.isArray(attendanceRecords) ? attendanceRecords : [];
  
  const availableMembers = safePaginatedMembers.filter((member: any) => {
    return !safeAttendanceRecords.some((r: any) => r.member?.id === member.id);
  });
  const selectedCount = availableMembers.filter((member: any) => attendance[member.id]).length;
  const isAllSelected = availableMembers.length > 0 && selectedCount === availableMembers.length;
  const isPartiallySelected = selectedCount > 0 && selectedCount < availableMembers.length;

  // Handle attendance type change
  const handleAttendanceTypeChange = (type: "session" | "event") => {
    setAttendanceType(type);
    setSelectedSessionId(null);
    setSelectedEventId(null);
    setAttendance({});
    setError(null);
    setSuccess(false);
  };

  // Handle event selection change
  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    setAttendance({});
    setError(null);
    setSuccess(false);
    // Refetch attendance records for the new event
    if (eventId && refetchEventAttendance) {
      refetchEventAttendance();
    }
  };

  // Handle session selection change
  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setAttendance({});
    setError(null);
    setSuccess(false);
  };

  // Save attendance for all checked members
  const handleSave = async () => {
    const selectedId =
      attendanceType === "session" ? selectedSessionId : selectedEventId;
    if (!selectedId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Get current attendance records and ensure they're loaded
      const currentRecords = attendanceRecords || [];

      // Prevent marking attendance for members already marked
      const alreadyMarkedIds = new Set(
        currentRecords.map((r: any) => r.member?.id).filter(Boolean),
      );

      const toMark = Object.entries(attendance).filter(
        ([memberId, present]) => {
          const isPresent = present === true;
          const isAlreadyMarked = alreadyMarkedIds.has(memberId);
          return isPresent && !isAlreadyMarked;
        },
      );

      if (toMark.length === 0) {
        const selectedCount = Object.values(attendance).filter(Boolean).length;
        if (selectedCount > 0) {
          setError(
            `All selected members have already been marked for this ${attendanceType}.`,
          );
        } else {
          setError(`Please select members to mark attendance for.`);
        }
        setSaving(false);
        return;
      }

      const promises = toMark.map(([memberId]) =>
        recordAttendance({
          ...(attendanceType === "session"
            ? { sessionId: selectedId }
            : { eventId: selectedId }),
          memberId,
        }),
      );

      await Promise.all(promises);

      // Refetch attendance records after successful save
      if (attendanceType === "event" && refetchEventAttendance) {
        await refetchEventAttendance();
      }

      setSuccess(true);
      setAttendance({}); // Clear selections after successful save

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      console.error("Error saving attendance:", e);
      setError(e.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Get current selection info
  const getCurrentSelection = () => {
    if (attendanceType === "session" && selectedSessionId) {
      const session = sessions.find((s: any) => s.id === selectedSessionId);
      return session
        ? `${session.name} (${new Date(session.startTime).toLocaleString()})`
        : "";
    }
    if (attendanceType === "event" && selectedEventId) {
      const event = events.find((e: any) => e.id === selectedEventId);
      return event
        ? `${event.title} (${new Date(event.startDate).toLocaleString()})`
        : "";
    }
    return "";
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-xl p-0 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-500">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Take Attendance
            </h1>
            <p className="text-indigo-100 mt-1 text-base">
              Mark members present for sessions or events quickly and easily.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/attendance/absentees"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white font-semibold shadow hover:bg-white/20 transition border border-white/30"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Message Absentees
            </Link>
            <Link
              href="/dashboard/attendance"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow hover:bg-indigo-50 transition border border-indigo-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Attendance
            </Link>
          </div>
        </div>

        {/* Current Selection Info */}
        {getCurrentSelection() && (
          <div className="px-8 py-4 bg-indigo-50 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-700">
                  Selected {attendanceType}:
                </p>
                <p className="text-base text-indigo-900 font-semibold">
                  {getCurrentSelection()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-indigo-700">
                  Attendance Summary:
                </p>
                <p className="text-base text-indigo-900">
                  <span className="font-semibold">
                    {(attendanceRecords || []).length}
                  </span>{" "}
                  already present,
                  <span className="font-semibold ml-1">
                    {Object.values(attendance).filter(Boolean).length}
                  </span>{" "}
                  newly selected
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Type Selector */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white/80">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Attendance Type
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => handleAttendanceTypeChange("session")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                attendanceType === "session"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Session
            </button>
            <button
              onClick={() => handleAttendanceTypeChange("event")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                attendanceType === "event"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Event
            </button>
          </div>
        </div>

        {/* Session/Event Selector with Pagination */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white/80">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select {attendanceType === "session" ? "Session" : "Event"}
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${attendanceType === "session" ? "sessions" : "events"}...`}
                value={attendanceType === "session" ? sessionSearch : eventSearch}
                onChange={(e) => 
                  attendanceType === "session" 
                    ? setSessionSearch(e.target.value)
                    : setEventSearch(e.target.value)
                }
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
          </div>

          {attendanceType === "session" ? (
            <div className="space-y-4">
              {loadingSessions ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  Loading sessions...
                </div>
              ) : sessionPagination.paginatedData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {sessionSearch ? "No sessions found matching your search." : "No sessions available."}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sessionPagination.paginatedData.map((session: any) => (
                      <div
                        key={session.id}
                        onClick={() => handleSessionChange(session.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedSessionId === session.id
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{session.name}</h3>
                          {selectedSessionId === session.id && (
                            <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          {session.location && (
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span className="truncate">{session.location}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {session.attendanceRecords?.length || 0} attendees
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sessionPagination.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={sessionPagination.currentPage}
                        totalPages={sessionPagination.totalPages}
                        totalItems={sessionPagination.totalItems}
                        itemsPerPage={sessionPagination.itemsPerPage}
                        onPageChange={sessionPagination.goToPage}
                        onItemsPerPageChange={sessionPagination.setItemsPerPage}
                        showItemsPerPage={true}
                        showInfo={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {loadingEvents ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  Loading events...
                </div>
              ) : eventPagination.paginatedData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {eventSearch ? "No events found matching your search." : "No events available."}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {eventPagination.paginatedData.map((event: any) => (
                      <div
                        key={event.id}
                        onClick={() => handleEventChange(event.id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedEventId === event.id
                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                          {selectedEventId === event.id && (
                            <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(event.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          {event.location && (
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 mr-1" />
                            {event.attendanceRecords?.length || 0} attendees
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {eventPagination.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={eventPagination.currentPage}
                        totalPages={eventPagination.totalPages}
                        totalItems={eventPagination.totalItems}
                        itemsPerPage={eventPagination.itemsPerPage}
                        onPageChange={eventPagination.goToPage}
                        onItemsPerPageChange={eventPagination.setItemsPerPage}
                        showItemsPerPage={true}
                        showInfo={true}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="px-8 py-6 bg-white/70">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Members ({filteredTotalCount})
                {selectedGroupFilter && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (filtered from {membersTotalCount || 0} total)
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4">
                {/* Group Filter Dropdown - Always visible */}
                {smallGroups && smallGroups.length > 0 && (
                  <div className="relative" data-group-dropdown>
                    <button
                      onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      disabled={loadingGroups}
                    >
                      <UsersIcon className="h-4 w-4" />
                      {selectedGroupFilter 
                        ? `Group: ${smallGroups.find((g: any) => g.id === selectedGroupFilter)?.name || 'Unknown'}`
                        : 'All Members'
                      }
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${showGroupDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showGroupDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48 max-h-64 overflow-y-auto">
                        <div className="py-1">
                          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                            Filter Members by Group
                          </div>
                          
                          {/* All Members Option */}
                          <button
                            onClick={() => handleGroupFilter(null)}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                              selectedGroupFilter === null 
                                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>All Members</span>
                              <span className="text-xs text-gray-500">
                                {allMembers.length} total
                              </span>
                            </div>
                          </button>
                          
                          {/* Individual Groups */}
                          {smallGroups.map((group: any) => {
                            const groupMemberIds = group.members?.map((member: any) => member.memberId) || [];
                            const groupMemberCount = allMembers.filter((member: any) => 
                              groupMemberIds.includes(member.id)
                            ).length;
                            
                            return (
                              <button
                                key={group.id}
                                onClick={() => handleGroupFilter(group.id)}
                                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                  selectedGroupFilter === group.id 
                                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{group.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {groupMemberCount} members
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                          
                          {smallGroups.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              No groups available
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Select All Checkbox - Only show when there are available members */}
                {availableMembers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isPartiallySelected;
                      }}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-600 cursor-pointer" onClick={handleSelectAll}>
                      {isAllSelected ? 'Deselect All' : 'Select All'} ({availableMembers.length} available)
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
          </div>
          
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8 text-gray-400 text-lg">
              Loading members...
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {debouncedSearch ? "No members found matching your search." : "No members available."}
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white/60 mb-4">
                {paginatedMembers.map((member: any) => {
                  const isAlreadyMarked = (attendanceRecords || []).some(
                    (r: any) => r.member?.id === member.id,
                  );
                  const isCurrentlySelected = !!attendance[member.id];

                  return (
                    <li
                      key={member.id}
                      className={`flex items-center px-4 py-3 transition ${
                        isAlreadyMarked
                          ? "bg-green-50 border-l-4 border-green-400"
                          : "hover:bg-indigo-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded mr-4 focus:ring-indigo-500 disabled:opacity-50"
                        checked={isCurrentlySelected}
                        onChange={() => toggleAttendance(member.id)}
                        disabled={saving || isAlreadyMarked}
                        title={
                          isAlreadyMarked
                            ? "Attendance already marked for this member"
                            : "Mark attendance for this member"
                        }
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-semibold text-lg ${
                            isAlreadyMarked
                              ? "bg-green-100 text-green-700"
                              : "bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {member.firstName?.[0] || ""}
                          {member.lastName?.[0] || ""}
                        </div>
                        <span
                          className={`font-medium text-base ${
                            isAlreadyMarked ? "text-green-900" : "text-gray-900"
                          }`}
                        >
                          {member.firstName} {member.lastName}
                        </span>
                        {isAlreadyMarked && (
                          <div className="flex items-center gap-1">
                            <svg
                              className="h-4 w-4 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-green-600 text-sm font-medium">
                              Already Present
                            </span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Member Pagination Controls */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>
                    Showing {((memberPage - 1) * memberItemsPerPage) + 1} to {Math.min(memberPage * memberItemsPerPage, filteredTotalCount)} of {filteredTotalCount} members
                    {selectedGroupFilter && (
                      <span className="text-gray-500"> (filtered)</span>
                    )}
                  </span>
                  {Math.ceil(filteredTotalCount / memberItemsPerPage) > 1 && (
                    <span>Page {memberPage} of {Math.ceil(filteredTotalCount / memberItemsPerPage)}</span>
                  )}
                </div>
                <Pagination
                  currentPage={memberPage}
                  totalPages={Math.ceil(filteredTotalCount / memberItemsPerPage)}
                  totalItems={filteredTotalCount}
                  itemsPerPage={memberItemsPerPage}
                  onPageChange={setMemberPage}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setMemberItemsPerPage(newItemsPerPage);
                    setMemberPage(1); // Reset to first page when changing items per page
                  }}
                  showItemsPerPage={true}
                  showInfo={false}
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-8 py-6 bg-white/80 border-t border-gray-100 flex flex-col md:flex-row items-center gap-4 justify-between">
          <button
            className="w-full md:w-auto px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold text-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
            onClick={handleSave}
            disabled={saving || (!selectedSessionId && !selectedEventId)}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Attendance
              </span>
            )}
          </button>
          <div className="flex-1 flex items-center justify-end gap-4">
            {success && (
              <span className="text-green-600 text-base flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Attendance saved!
              </span>
            )}
            {error && (
              <span className="text-red-600 text-base flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {error}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
