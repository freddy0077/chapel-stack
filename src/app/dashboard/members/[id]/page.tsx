"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ArrowLeftIcon,
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon
} from "@heroicons/react/24/outline";
import MessageModal from "../components/MessageModal";
import { useMember } from "@/graphql/hooks/useMember";

export default function MemberDetailPage() {
  const { id } = useParams();
  // Updated to use memberId parameter instead of id to match the updated GET_MEMBER query
  const { member, loading, error } = useMember(id as string);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Show loading state
  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading member details...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-red-600">Error Loading Member</h2>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <Link href="/dashboard/members" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
          <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Members
        </Link>
      </div>
    );
  }

  // Show not found state
  if (!member) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Member Not Found</h2>
        <p className="mt-2 text-gray-600">The member you are looking for does not exist or has been removed.</p>
        <Link href="/dashboard/members" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500">
          <ArrowLeftIcon className="h-5 w-5 mr-1" aria-hidden="true" />
          Back to Members
        </Link>
      </div>
    );
  }

  // Helper functions
  const formatMemberSince = () => {
    if (!member.membershipDate) return 'N/A';
    return new Date(member.membershipDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  return (
    <div className="px-2 sm:px-4 lg:px-8 py-8 max-w-6xl mx-auto">
      {/* Back Arrow */}
      <div className="mb-4">
        <Link 
          href="/dashboard/members" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-white/80 rounded-full px-3 py-1 shadow transition"
        >
          <ArrowLeftIcon className="mr-2 h-5 w-5" aria-hidden="true" />
          Back to Members
        </Link>
      </div>
      {/* Hero Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 h-48 w-full bg-gradient-to-r from-indigo-400/80 via-indigo-600/60 to-indigo-800/80 blur-[2px] rounded-3xl" aria-hidden="true"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 px-6 py-8 md:py-10 rounded-3xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 shadow-2xl border border-indigo-100 dark:border-slate-800">
          <div className="relative flex flex-col items-center md:items-start">
            <div className="h-28 w-28 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg border-4 border-white dark:border-slate-900">
              {getInitials()}
            </div>
            <span className={`absolute bottom-2 right-2 h-6 w-6 rounded-full ring-2 ring-white ${getStatusColor(member.status)}`}></span>
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">{member.firstName} {member.lastName}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeClasses(member.status)}`}>{formatStatus(member.status)}</span>
              <span className="inline-flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-300 bg-white/70 rounded-full px-2 py-0.5">
                Member since {formatMemberSince()}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsMessageModalOpen(true)}
                className="inline-flex items-center px-5 py-2 rounded-full shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5 mr-2 text-white" />
                Message
              </button>
              <Link
                href={`/dashboard/members/${member.id}/edit`}
                className="inline-flex items-center px-5 py-2 rounded-full shadow-md text-sm font-semibold text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="h-5 w-5 mr-2 text-indigo-500" />
                Edit
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-transparent">
        <nav className="flex space-x-8 justify-center md:justify-start mb-8" aria-label="Tabs">
          {[
            { key: "info", label: "Info" },
            { key: "ministries", label: "Ministries" },
            { key: "groups", label: "Groups" },
            { key: "attendance", label: "Attendance" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative whitespace-nowrap py-3 px-4 font-semibold text-base capitalize transition-all duration-200
                ${activeTab === tab.key ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-500 hover:text-indigo-600'}`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute left-0 -bottom-1 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-700 rounded-full animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact</h3>
            <div className="flex flex-col gap-4">
              {member.email && (
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{member.phone}</span>
                </div>
              )}
              {member.address && (
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{member.address}</span>
                </div>
              )}
              {member.dateOfBirth && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{new Date(member.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              {member.branch && (
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="h-5 w-5 text-indigo-400" />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{member.branch.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Family Card */}
          {(member.spouse || (member.children && member.children.length > 0) || member.parent) && (
            <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Family</h3>
              <div className="flex flex-col gap-4">
                {member.spouse && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
                      {`${member.spouse.firstName?.charAt(0) || ''}${member.spouse.lastName?.charAt(0) || ''}`}
                    </div>
                    <Link href={`/dashboard/members/${member.spouse.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      {member.spouse.firstName} {member.spouse.lastName}
                    </Link>
                  </div>
                )}
                {member.children && member.children.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white mb-1">Children</div>
                    <div className="flex flex-wrap gap-2">
                      {member.children.map(child => (
                        <Link key={child.id} href={`/dashboard/members/${child.id}`} className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold">
                          <span className="h-7 w-7 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                            {`${child.firstName?.charAt(0) || ''}${child.lastName?.charAt(0) || ''}`}
                          </span>
                          {child.firstName} {child.lastName}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {member.parent && (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
                      {`${member.parent.firstName?.charAt(0) || ''}${member.parent.lastName?.charAt(0) || ''}`}
                    </div>
                    <Link href={`/dashboard/members/${member.parent.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      {member.parent.firstName} {member.parent.lastName}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Details Card */}
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8 flex flex-col gap-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Personal Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Member ID</div>
                <div className="font-semibold text-gray-900 dark:text-white">{member.membershipNumber || member.id}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase">Join Date</div>
                <div className="font-semibold text-gray-900 dark:text-white">{formatMemberSince()}</div>
              </div>
              {member.gender && (
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Gender</div>
                  <span className="inline-block rounded-full px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs">
                    {member.gender === 'MALE' ? 'Male' :
                      member.gender === 'FEMALE' ? 'Female' :
                      member.gender === 'OTHER' ? 'Other' :
                      member.gender === 'PREFER_NOT_TO_SAY' ? 'Prefer not to say' :
                      member.gender}
                  </span>
                </div>
              )}
              {member.maritalStatus && (
                <div>
                  <div className="text-xs font-medium text-gray-500 uppercase">Marital Status</div>
                  <span className="inline-block rounded-full px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs">
                    {member.maritalStatus === 'SINGLE' ? 'Single' :
                      member.maritalStatus === 'MARRIED' ? 'Married' :
                      member.maritalStatus === 'DIVORCED' ? 'Divorced' :
                      member.maritalStatus === 'WIDOWED' ? 'Widowed' :
                      member.maritalStatus === 'SEPARATED' ? 'Separated' :
                      member.maritalStatus === 'OTHER' ? 'Other' :
                      member.maritalStatus}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "ministries" && (
        <div className="mt-8">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ministry Memberships</h3>
            {member.ministryMemberships && member.ministryMemberships.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {member.ministryMemberships.map((membership: any) => (
                  <li key={membership.ministry.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{membership.ministry.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Role: {membership.role}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">Joined: {new Date(membership.joinDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ministry memberships.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "groups" && (
        <div className="mt-8">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Memberships</h3>
            {member.groupMemberships && member.groupMemberships.length > 0 ? (
              <p className="text-gray-500 italic">Group memberships data structure not yet implemented.</p>
            ) : (
              <p className="text-gray-500 italic">No group memberships.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="mt-8">
          <div className="backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-12 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Attendance History</h3>
            <p className="text-gray-500 italic">Attendance data not available yet.</p>
          </div>
        </div>
      )}

      {/* Message Modal */}
      <MessageModal 
        isOpen={isMessageModalOpen} 
        onClose={() => setIsMessageModalOpen(false)}
        memberName={`${member.firstName} ${member.lastName}`}
        memberEmail={member.email || ''}
      />
    </div>
  );
}