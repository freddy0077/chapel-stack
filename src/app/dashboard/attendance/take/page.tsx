"use client";

import { useState, useMemo, useEffect } from "react";
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

  // Members for this branch
  const { members, loading: loadingMembers } = useMembers({
    branchId: orgBranchFilter.branchId,
  });

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

  // Member search state
  const [search, setSearch] = useState("");
  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    const s = search.trim().toLowerCase();
    return members.filter(
      (m: any) =>
        m.firstName?.toLowerCase().includes(s) ||
        m.lastName?.toLowerCase().includes(s),
    );
  }, [search, members]);

  // Handle attendance checkbox
  const toggleAttendance = (memberId: string) => {
    setAttendance((prev) => ({ ...prev, [memberId]: !prev[memberId] }));
  };

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

        {/* Session/Event Selector */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white/80">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {attendanceType === "session" ? "Session" : "Event"}
          </label>
          {attendanceType === "session" ? (
            <select
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-base px-3 py-2"
              value={selectedSessionId || ""}
              onChange={(e) => handleSessionChange(e.target.value)}
            >
              <option value="">-- Choose a session --</option>
              {sessions.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({new Date(s.startTime).toLocaleString()})
                </option>
              ))}
            </select>
          ) : (
            <select
              className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-base px-3 py-2"
              value={selectedEventId || ""}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              <option value="">-- Choose an event --</option>
              {events.map((e: any) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({new Date(e.startDate).toLocaleString()})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Members List */}
        <div className="px-8 py-6 bg-white/70">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Members</h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white shadow-sm"
              style={{ minWidth: 180 }}
            />
          </div>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8 text-gray-400 text-lg">
              Loading members...
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[52vh] overflow-y-auto rounded-lg border border-gray-100 bg-white/60">
              {filteredMembers.map((member: any) => {
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
