"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  IdentificationIcon,
  UserGroupIcon,
  CakeIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  HeartIcon,
  UsersIcon,
  BellIcon,
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import MessageModal from "./MessageModal";
import { useMember } from "@/graphql/hooks/useMember";
import { useAllSmallGroups, useSmallGroupMutations, SmallGroupMemberRole, SmallGroupMemberStatus } from "@/graphql/hooks/useSmallGroups";
import { useMutation, gql } from "@apollo/client";
import { useProcessCardScan } from "@/graphql/hooks/useAttendance";
import { useAttendanceSessionsByBranch } from "@/graphql/hooks/useAttendance";
import { useAuth } from "@/graphql/hooks/useAuth";
import AddToSacraments from './AddToSacraments';
import MemberPrayerRequestsTab from './MemberPrayerRequestsTab';
import MemberContributionsTab from './MemberContributionsTab';
import MemberActivityTimeline from "./MemberActivityTimeline";

const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup($groupId: ID!, $memberId: ID!, $roleInGroup: String!) {
    addMemberToGroup(groupId: $groupId, memberId: $memberId, roleInGroup: $roleInGroup) {
      id
      member { id firstName lastName }
      smallGroup { id name }
      role
      status
      joinDate
    }
  }
`;

const ADD_FAMILY_MEMBER = gql`
  mutation AddFamilyConnection($memberId: ID!, $relativeId: ID!, $relationship: String!) {
    addFamilyConnection(memberId: $memberId, relativeId: $relativeId, relationship: $relationship) {
      id
      member { id firstName lastName }
      relative { id firstName lastName }
      relationship
      status
    }
  }
`;

function AddToAttendance({ memberId, rfidCardId, onSuccess }: { memberId: string; rfidCardId?: string; onSuccess?: () => void }) {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const { sessions, loading: sessionsLoading } = useAttendanceSessionsByBranch(branchId);
  const { processCardScan, loading: adding, error } = useProcessCardScan();
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const handleAdd = async () => {
    if (!selectedSession || !rfidCardId) return;
    try {
      await processCardScan({
        sessionId: selectedSession,
        cardId: rfidCardId,
        scanMethod: "MANUAL", // must be uppercase for backend
        recordedById: user?.id,
        branchId,
      });
      setSuccessMsg("Member added to attendance session!");
      if (onSuccess) onSuccess();
      if (typeof window !== 'undefined') {
        window.location.reload(); // Simple way to refresh modal data (can be replaced with a smarter refetch if available)
      }
    } catch (e) {
      setSuccessMsg("");
    }
  };

  // Only enable if session selected, rfidCardId exists, and not loading
  const canAdd = !!selectedSession && !!rfidCardId && !adding;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 p-4 bg-indigo-50 rounded-xl mb-6 border border-indigo-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
        <label className="font-medium text-gray-700 mr-2 whitespace-nowrap">Add to Attendance Session:</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition w-full md:w-64 bg-white"
          value={selectedSession}
          onChange={e => setSelectedSession(e.target.value)}
          disabled={sessionsLoading}
        >
          <option value="">Select Session</option>
          {sessions && sessions.map((s: any) => (
            <option key={s.id} value={s.id}>{s.name} ({s.date ? new Date(s.date).toLocaleDateString() : "No date"})</option>
          ))}
        </select>
      </div>
      <button
        className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!canAdd}
        onClick={handleAdd}
      >
        <PlusIcon className="h-5 w-5" /> Add
      </button>
      {successMsg && <span className="text-green-600 text-sm font-medium ml-2">{successMsg}</span>}
      {error && <span className="text-red-600 text-sm font-medium ml-2">{error.message}</span>}
    </div>
  );
}

export default function MemberDetailsModal({ memberId, onClose }: { memberId: string; onClose: () => void }) {
  const { member, loading, error } = useMember(memberId);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("activity");
  const tabs = [
    { key: "activity", label: "Activity" },
    { key: "info", label: "Info" },
    { key: "family", label: "Family" },
    { key: "groups", label: "Groups" },
    { key: "attendance", label: "Attendance" },
    { key: "sacraments", label: "Sacraments" },
    { key: "prayer", label: "Prayer Requests" },
    { key: "contributions", label: "Contributions" },
    { key: "notifications", label: "Notifications" },
    { key: "custom", label: "Custom Fields" },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error Loading Member</h2>
          <p className="mt-2 text-gray-600">{error ? error.message : "Member not found."}</p>
          <button onClick={onClose} className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
            <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const formatMemberSince = () => {
    if (!member.membershipDate) return 'N/A';
    return new Date(member.membershipDate).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };
  const getInitials = () => {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
  };
  const formatStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Active';
      case 'INACTIVE': return 'Inactive';
      case 'VISITOR': return 'Visitor';
      case 'PENDING': return 'Pending';
      default: return status;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'INACTIVE': return 'bg-red-500';
      case 'VISITOR': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-red-100 text-red-800';
      case 'VISITOR': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activityTimeline = [];
  if (member.membershipDate) {
    activityTimeline.push({
      type: "Membership",
      date: member.membershipDate,
      summary: `Became a member`,
      details: `Official member since ${new Date(member.membershipDate).toLocaleDateString()}`,
      icon: "CalendarIcon",
    });
  }
  if (member.dateOfBirth) {
    activityTimeline.push({
      type: "Birth",
      date: member.dateOfBirth,
      summary: `Date of Birth`,
      details: `${new Date(member.dateOfBirth).toLocaleDateString()}`,
      icon: "CakeIcon",
    });
  }
  if (member.groupMemberships) {
    member.groupMemberships.forEach(gm => {
      if (gm.joinDate) {
        activityTimeline.push({
          type: `Joined Group` + (gm.smallGroup?.name ? `: ${gm.smallGroup.name}` : ""),
          date: gm.joinDate,
          summary: `Joined group as ${gm.role}`,
          details: gm.smallGroup?.name ? `Group: ${gm.smallGroup.name}` : "",
          icon: "UserGroupIcon",
        });
      }
    });
  }
  if (member.attendanceRecords) {
    member.attendanceRecords.forEach(ar => {
      if (ar.checkInTime) {
        activityTimeline.push({
          type: "Attendance",
          date: ar.checkInTime,
          summary: `Checked in (${ar.checkInMethod})`,
          details: ar.notes || "",
          icon: "ClipboardDocumentCheckIcon",
        });
      }
    });
  }
  if (member.sacramentalRecords) {
    member.sacramentalRecords.forEach(sr => {
      if (sr.dateOfSacrament) {
        activityTimeline.push({
          type: `Sacrament: ${sr.sacramentType}`,
          date: sr.dateOfSacrament,
          summary: `Received ${sr.sacramentType}`,
          details: sr.locationOfSacrament ? `At ${sr.locationOfSacrament}` : "",
          icon: "SparklesIcon",
        });
      }
    });
  }
  activityTimeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-0 relative overflow-hidden">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
        {/* Modal Header */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6 border-b border-gray-100">
          <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg mb-2">
            {getInitials()}
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">{member.firstName} {member.lastName}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-1 justify-center">
            <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-semibold ${getStatusBadgeClasses(member.status)}`}>{formatStatus(member.status)}</span>
            <span className="inline-flex items-center text-xs text-gray-600 bg-white rounded-full px-2 py-0.5">
              Member since {formatMemberSince()}
            </span>
          </div>
        </div>
        {/* Redesigned Tabs */}
        <div className="bg-gray-50 px-8 pt-4 pb-2 border-b border-gray-100">
          <nav className="flex flex-wrap gap-3 justify-center" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative whitespace-nowrap py-2 px-5 text-base font-medium rounded-lg transition-all duration-200
                  ${activeTab === tab.key ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-indigo-50'}`}
                style={{ minWidth: '130px', letterSpacing: '0.01em' }}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-10 h-1 rounded bg-indigo-600" />
                )}
              </button>
            ))}
          </nav>
        </div>
        {/* Redesigned Tab Content */}
        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          {activeTab === "activity" && (
            <MemberActivityTimeline activities={activityTimeline} />
          )}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
                  <span className="truncate">{member.email || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <PhoneIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.phoneNumber || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPinIcon className="h-5 w-5 text-indigo-400" />
                  <span>{typeof member.address === 'object' ? member.address?.fullAddress : member.address || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BuildingOfficeIcon className="h-5 w-5 text-indigo-400" />
                  <span>{typeof member.branch === 'object' ? member.branch?.name : member.branch || <span className='text-gray-400'>Not provided</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <IdentificationIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.rfidCardId || <span className='text-gray-400'>Not assigned</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <UserIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.gender || <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CakeIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <HeartIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.maritalStatus || <span className='text-gray-400'>Not specified</span>}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.occupation || member.employerName || <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <InformationCircleIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.notes || <span className='text-gray-400'>None</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckBadgeIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.statusChangeDate ? new Date(member.statusChangeDate).toLocaleDateString() : <span className='text-gray-400'>No change</span>}</span>
                  <span>{member.statusChangeReason && <span className="text-xs text-gray-500">({member.statusChangeReason})</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.baptismDate ? new Date(member.baptismDate).toLocaleDateString() : <span className='text-gray-400'>Not specified</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <DocumentTextIcon className="h-5 w-5 text-indigo-400" />
                  <span>{member.confirmationDate ? new Date(member.confirmationDate).toLocaleDateString() : <span className='text-gray-400'>Not specified</span>}</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === "family" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddFamilyConnection memberId={member.id} onSuccess={() => {/* TODO: refetch member data */}} />
              <div className="flex items-center gap-2 text-gray-700">
                <HeartIcon className="h-5 w-5 text-indigo-400" />
                <span className="font-semibold">Spouse:</span> {member.spouse ? `${member.spouse.firstName} ${member.spouse.lastName}` : <span className='text-gray-400'>None</span>}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <UserIcon className="h-5 w-5 text-indigo-400" />
                <span className="font-semibold">Parent:</span> {member.parent ? `${member.parent.firstName} ${member.parent.lastName}` : <span className='text-gray-400'>None</span>}
              </div>
              <div className="flex items-center gap-2 text-gray-700 col-span-2">
                <UsersIcon className="h-5 w-5 text-indigo-400" />
                <span className="font-semibold">Children:</span> {member.children && member.children.length > 0 ? member.children.map(child => `${child.firstName} ${child.lastName}`).join(", ") : <span className='text-gray-400'>None</span>}
              </div>
              {/* --- Family Relationships --- */}
              {member.familyRelationships && member.familyRelationships.length > 0 && (
                <div className="mt-4 col-span-2">
                  <div className="font-semibold text-indigo-700 mb-1 flex items-center"><UsersIcon className="h-5 w-5 mr-1" />Family Relationships</div>
                  <ul className="divide-y divide-gray-100">
                    {member.familyRelationships.map(rel => (
                      <li key={rel.id} className="py-2 flex items-center gap-3">
                        <IdentificationIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                        <div>
                          <div className="text-sm">Relationship: <span className="font-semibold">{rel.relationshipType}</span></div>
                          <div className="text-xs text-gray-500">Family ID: <span className="font-mono">{rel.familyId}</span></div>
                          <div className="text-xs text-gray-500">Member ID: <span className="font-mono">{rel.memberId}</span></div>
                          <div className="text-xs text-gray-400">Created: {rel.createdAt ? new Date(rel.createdAt).toLocaleDateString() : '—'}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {activeTab === "groups" && (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm bg-white">
              {/* Add to Group Button & Search */}
              <AddToGroup memberId={member.id} />
              {member.groupMemberships && member.groupMemberships.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm mt-4">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Group Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Role</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Joined</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {member.groupMemberships.map((gm, idx) => (
                      <tr key={gm.id || idx} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{gm.smallGroup?.name || gm.ministry?.name || <span className='text-gray-400'>Unnamed Group</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.role}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.status}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.joinDate ? new Date(gm.joinDate).toLocaleDateString() : <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.smallGroup?.type || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{gm.smallGroup?.location || <span className='text-gray-400'>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 px-4 py-6 text-center">No group memberships.</div>
              )}
            </div>
          )}
          {activeTab === "attendance" && (
            <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm bg-white">
              <AddToAttendance memberId={member.id} rfidCardId={member.rfidCardId} onSuccess={() => { /* Optionally refetch attendance */ }} />
              {member.attendanceRecords && member.attendanceRecords.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Event Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Location</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Check-in Method</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {member.attendanceRecords.map((rec, idx) => (
                      <tr key={rec.id || idx} className="hover:bg-indigo-50 transition">
                        <td className="px-4 py-2 whitespace-nowrap">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{rec.session?.name || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{rec.session?.location || <span className='text-gray-400'>—</span>}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{rec.checkInMethod || <span className='text-gray-400'>—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-400 px-4 py-6 text-center">No attendance records.</div>
              )}
            </div>
          )}
          {activeTab === "sacraments" && (
            <div className="overflow-x-auto rounded-2xl border border-indigo-100 shadow-xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-0 py-8 flex flex-col items-center">
              <div className="w-full max-w-xl mb-6">
                <h4 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center">Add Sacramental Record</h4>
                <AddToSacraments memberId={member.id} onSuccess={() => { /* Optionally refetch sacramental records */ }} />
              </div>
              <div className="w-full max-w-xl">
                <h5 className="text-lg font-bold text-gray-700 mb-2 mt-6">Existing Sacramental Records</h5>
                {member.sacramentalRecords && member.sacramentalRecords.length > 0 ? (
                  <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
                    {member.sacramentalRecords.map((rec, idx) => (
                      <li key={rec.id || idx} className="py-4 px-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <div className="flex-1">
                          <div className="flex gap-3 items-center mb-1">
                            <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 uppercase tracking-wide">{rec.sacramentType || <span className='text-gray-400'>—</span>}</span>
                            <span className="text-xs text-gray-400">{rec.dateOfSacrament ? new Date(rec.dateOfSacrament).toLocaleDateString() : <span className='text-gray-400'>—</span>}</span>
                          </div>
                          <div className="text-sm text-gray-700">Location: <span className="font-semibold">{rec.locationOfSacrament || <span className='text-gray-400'>—</span>}</span></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-400 px-4 py-6 text-center bg-white rounded-xl shadow-sm">No sacramental records.</div>
                )}
              </div>
            </div>
          )}
          {activeTab === "prayer" && (
            <MemberPrayerRequestsTab memberId={member.id} />
          )}
          {activeTab === "contributions" && (
            <MemberContributionsTab memberId={member.id} />
          )}
          {activeTab === "notifications" && (
            <div className="space-y-2">
              {member.notifications && member.notifications.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {member.notifications.map((note, idx) => (
                    <li key={note.id || idx} className="py-2 flex items-center gap-3">
                      <BellIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">{note.message || <span className='text-gray-400'>—</span>}</div>
                        <div className="text-xs text-gray-500">{note.date ? new Date(note.date).toLocaleDateString() : <span className='text-gray-400'>—</span>}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <div className="text-gray-400">No notifications.</div>}
            </div>
          )}
          {activeTab === "custom" && (
            <div className="space-y-2">
              {member.customFields && Object.keys(member.customFields).length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {Object.entries(member.customFields).map(([key, value]) => (
                    <li key={key} className="py-2 flex items-center gap-3">
                      <InformationCircleIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                      <span className="font-semibold">{key}:</span> <span className="text-gray-700">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              ) : <div className="text-gray-400">No custom fields.</div>}
            </div>
          )}
        </div>
        {/* Modal Actions */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={() => setIsMessageModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2 text-white" />
            Message
          </button>
          <a
            href={`/dashboard/members/${member.id}/edit`}
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Edit
          </a>
        </div>
        {isMessageModalOpen && (
          <MessageModal memberId={member.id} onClose={() => setIsMessageModalOpen(false)} />
        )}
      </div>
    </div>
  );
}

function AddToGroup({ memberId }: { memberId: string }) {
  const { smallGroups, loading } = useAllSmallGroups();
  const [addMemberToGroupMutation] = useMutation(ADD_MEMBER_TO_GROUP);

  const [showInput, setShowInput] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [role, setRole] = useState("MEMBER");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredGroups = smallGroups.filter((g: any) => g.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!selectedGroup) return;
    setAdding(true);
    setError(null);
    try {
      await addMemberToGroupMutation({
        variables: {
          groupId: selectedGroup.id,
          memberId,
          roleInGroup: role
        }
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowInput(false);
        setSelectedGroup(null);
        setSearch("");
      }, 1200);
    } catch (e: any) {
      setError(e.message || "Failed to add to group");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mb-4">
      {!showInput && (
        <button
          className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold shadow-sm"
          onClick={() => setShowInput(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add to Group
        </button>
      )}
      {showInput && (
        <div className="flex flex-col gap-2 bg-indigo-50 p-3 rounded-md border border-indigo-100 mt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="flex-1 rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              placeholder="Search group..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSelectedGroup(null);
              }}
            />
            <select
              className="rounded border-gray-300 text-xs px-2 py-1"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="LEADER">Leader</option>
              <option value="CO_LEADER">Co-Leader</option>
              <option value="VISITOR">Visitor</option>
            </select>
          </div>
          <div className="max-h-32 overflow-auto border border-gray-100 rounded mt-1 bg-white">
            {filteredGroups.length === 0 && <div className="p-2 text-xs text-gray-400">No groups found</div>}
            {filteredGroups.map((g: any) => (
              <button
                key={g.id}
                className={`block w-full text-left px-3 py-1 text-sm hover:bg-indigo-100 ${selectedGroup?.id === g.id ? 'bg-indigo-200 font-semibold' : ''}`}
                onClick={() => setSelectedGroup(g)}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="inline-flex items-center px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-sm disabled:opacity-50"
              onClick={handleAdd}
              disabled={!selectedGroup || adding}
            >
              {adding ? "Adding..." : "Add to Group"}
            </button>
            <button
              className="inline-flex items-center px-2 py-1 rounded text-xs border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
            {success && <span className="text-green-600 text-xs ml-2">Added!</span>}
            {error && <span className="text-red-600 text-xs ml-2">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function AddFamilyConnection({ memberId, onSuccess }: { memberId: string, onSuccess?: () => void }) {
  const [showInput, setShowInput] = useState(false);
  const [cardId, setCardId] = useState("");
  const [relationship, setRelationship] = useState("Sibling");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addFamilyConnection] = useMutation(ADD_FAMILY_MEMBER);

  const handleAdd = async () => {
    if (!cardId) return;
    setAdding(true);
    setError(null);
    try {
      await addFamilyConnection({ variables: { memberId, relativeId: cardId, relationship } });
      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        setShowInput(false);
        setCardId("");
      }, 1200);
    } catch (e: any) {
      setError(e.message || "Failed to add family connection");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mb-4">
      {!showInput && (
        <button
          className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold shadow-sm"
          onClick={() => setShowInput(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" /> Add Family Connection
        </button>
      )}
      {showInput && (
        <div className="flex flex-col gap-2 bg-indigo-50 p-3 rounded-md border border-indigo-100 mt-2">
          <input
            type="text"
            className="rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            placeholder="Relative Card ID (RFID)..."
            value={cardId}
            onChange={e => setCardId(e.target.value)}
          />
          <select
            className="rounded border-gray-300 text-xs px-2 py-1"
            value={relationship}
            onChange={e => setRelationship(e.target.value)}
          >
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Grandparent">Grandparent</option>
            <option value="Grandchild">Grandchild</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex gap-2 mt-2">
            <button
              className="inline-flex items-center px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-sm disabled:opacity-50"
              onClick={handleAdd}
              disabled={!cardId || adding}
            >
              {adding ? "Adding..." : "Add"}
            </button>
            <button
              className="inline-flex items-center px-2 py-1 rounded text-xs border border-gray-300 text-gray-600 hover:bg-gray-100"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
            {success && <span className="text-green-600 text-xs ml-2">Added!</span>}
            {error && <span className="text-red-600 text-xs ml-2">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
