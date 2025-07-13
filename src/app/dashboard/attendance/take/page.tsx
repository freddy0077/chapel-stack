"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganizationBranchFilter } from '@/hooks';
import { useFilteredAttendanceSessions } from '@/graphql/hooks/useAttendance';
import { useMembers } from '@/graphql/hooks/useMember';
import { useAttendanceRecordsForSession } from '@/graphql/hooks/useAttendance';
import { gql, useMutation } from "@apollo/client";
import { AttendanceRecord } from "../types";
import Link from "next/link";

// Use the correct mutation as defined in the backend schema
const RECORD_ATTENDANCE = gql`
  mutation RecordAttendance($input: RecordAttendanceInput!) {
    recordAttendance(input: $input) {
      id
      checkInTime
      checkOutTime
      checkInMethod
      notes
      session { id name }
      member { id firstName lastName }
      visitorName
      visitorEmail
      visitorPhone
      recordedBy { id }
      createdAt
      updatedAt
    }
  }
`;

export default function TakeAttendancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgBranchFilter = useOrganizationBranchFilter();

  // Session selection
  const { sessions, loading: loadingSessions } = useFilteredAttendanceSessions(orgBranchFilter);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(searchParams.get("sessionId") || null);

  // Members for this branch
  const { members, loading: loadingMembers } = useMembers({ branchId: orgBranchFilter.branchId });

  // Fetch attendance records for the selected session
  const { attendanceRecords } = useAttendanceRecordsForSession({ sessionId: selectedSessionId || '' });

  // Attendance marking state
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordAttendance] = useMutation(RECORD_ATTENDANCE);

  // Member search state
  const [search, setSearch] = useState("");
  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    const s = search.trim().toLowerCase();
    return members.filter((m: any) =>
      m.firstName?.toLowerCase().includes(s) ||
      m.lastName?.toLowerCase().includes(s)
    );
  }, [search, members]);

  // Handle attendance checkbox
  const toggleAttendance = (memberId: string) => {
    setAttendance(prev => ({ ...prev, [memberId]: !prev[memberId] }));
  };

  // Save attendance for all checked members
  const handleSave = async () => {
    if (!selectedSessionId) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Prevent marking attendance for members already marked
      const alreadyMarkedIds = new Set((attendanceRecords || []).map(r => r.member?.id));
      const toMark = Object.entries(attendance)
        .filter(([memberId, present]) => present && !alreadyMarkedIds.has(memberId));
      if (toMark.length === 0) {
        setError('All selected members have already been marked for this session.');
        setSaving(false);
        return;
      }
      const promises = toMark.map(([memberId]) =>
        recordAttendance({
          variables: {
            input: {
              sessionId: selectedSessionId,
              memberId,
            },
          },
        })
      );
      await Promise.all(promises);
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white/90 rounded-2xl shadow-xl p-0 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-500">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Take Attendance</h1>
            <p className="text-indigo-100 mt-1 text-base">Mark members present for a session quickly and easily.</p>
          </div>
          <Link href="/dashboard/attendance" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-700 font-semibold shadow hover:bg-indigo-50 transition border border-indigo-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Attendance
          </Link>
        </div>
        {/* Session Selector */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white/80">
          <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
          <select
            className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-base px-3 py-2"
            value={selectedSessionId || ''}
            onChange={e => setSelectedSessionId(e.target.value)}
          >
            <option value="">-- Choose a session --</option>
            {sessions.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name} ({new Date(s.startTime).toLocaleString()})</option>
            ))}
          </select>
        </div>
        {/* Members List Modernized */}
        <div className="px-8 py-6 bg-white/70">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Members</h2>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="ml-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white shadow-sm"
              style={{ minWidth: 180 }}
            />
          </div>
          {loadingMembers ? (
            <div className="flex items-center justify-center py-8 text-gray-400 text-lg">Loading members...</div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[52vh] overflow-y-auto rounded-lg border border-gray-100 bg-white/60">
              {filteredMembers.map((member: any) => (
                <li key={member.id} className="flex items-center px-4 py-3 hover:bg-indigo-50 transition">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-indigo-600 rounded mr-4 focus:ring-indigo-500"
                    checked={!!attendance[member.id]}
                    onChange={() => toggleAttendance(member.id)}
                    disabled={saving || (attendanceRecords || []).some(r => r.member?.id === member.id)}
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-lg">
                      {member.firstName?.[0] || ''}{member.lastName?.[0] || ''}
                    </div>
                    <span className="text-gray-900 font-medium text-base">{member.firstName} {member.lastName}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Actions Modernized */}
        <div className="px-8 py-6 bg-white/80 border-t border-gray-100 flex flex-col md:flex-row items-center gap-4 justify-between">
          <button
            className="w-full md:w-auto px-8 py-3 rounded-lg bg-indigo-600 text-white font-bold text-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
            onClick={handleSave}
            disabled={saving || !selectedSessionId}
          >
            {saving ? (
              <span className="flex items-center gap-2"><svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Saving...</span>
            ) : (
              <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Save Attendance</span>
            )}
          </button>
          <div className="flex-1 flex items-center justify-end gap-4">
            {success && <span className="text-green-600 text-base flex items-center gap-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Attendance saved!</span>}
            {error && <span className="text-red-600 text-base flex items-center gap-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>{error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
