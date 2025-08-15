'use client';

import React from 'react';
import { 
  HomeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Member, MembershipStatus, MemberStatus } from '../../types/member.types';

interface MembershipInfoSectionProps {
  member: Member;
}

const MembershipInfoSection: React.FC<MembershipInfoSectionProps> = ({ member }) => {
  // Status badge colors
  const getStatusBadgeColor = (status: MembershipStatus | MemberStatus | undefined) => {
    switch (status) {
      case 'ACTIVE':
      case 'ACTIVE_MEMBER':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
      case 'INACTIVE_MEMBER':
        return 'bg-yellow-100 text-yellow-800';
      case 'VISITOR':
        return 'bg-blue-100 text-blue-800';
      case 'MEMBER':
      case 'REGULAR_ATTENDEE':
        return 'bg-purple-100 text-purple-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'TRANSFERRED':
        return 'bg-gray-100 text-gray-800';
      case 'DECEASED':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <HomeIcon className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Membership Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Status */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Status & Type</h4>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Membership Status</label>
            <div className="mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(member.membershipStatus)}`}>
                {member.membershipStatus}
              </span>
            </div>
          </div>

          {member.status && (
            <div>
              <label className="text-sm font-medium text-gray-500">Member Status</label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
            </div>
          )}

          {member.membershipType && (
            <div>
              <label className="text-sm font-medium text-gray-500">Membership Type</label>
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{member.membershipType}</p>
              </div>
            </div>
          )}

          {member.isRegularAttendee !== undefined && (
            <div>
              <label className="text-sm font-medium text-gray-500">Regular Attendee</label>
              <div className="flex items-center">
                <CheckCircleIcon className={`w-4 h-4 mr-2 ${member.isRegularAttendee ? 'text-green-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-900">
                  {member.isRegularAttendee ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Important Dates */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Important Dates</h4>
          
          {member.joinDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Join Date</label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{formatDate(member.joinDate)}</p>
              </div>
            </div>
          )}

          {member.membershipDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Membership Date</label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{formatDate(member.membershipDate)}</p>
              </div>
            </div>
          )}

          {member.lastAttendanceDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Last Attendance</label>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{formatDate(member.lastAttendanceDate)}</p>
              </div>
            </div>
          )}

          {member.statusChangeDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">Status Change Date</label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{formatDate(member.statusChangeDate)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spiritual Milestones */}
      {(member.baptismDate || member.confirmationDate || member.salvationDate) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 text-indigo-500 mr-2" />
            Spiritual Milestones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.salvationDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">Salvation Date</label>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{formatDate(member.salvationDate)}</p>
                </div>
              </div>
            )}

            {member.baptismDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">Baptism Date</label>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{formatDate(member.baptismDate)}</p>
                </div>
              </div>
            )}

            {member.confirmationDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">Confirmation Date</label>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{formatDate(member.confirmationDate)}</p>
                </div>
              </div>
            )}
          </div>

          {member.baptismLocation && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">Baptism Location</label>
              <p className="text-sm text-gray-900">{member.baptismLocation}</p>
            </div>
          )}
        </div>
      )}

      {/* Status Change Reason */}
      {member.statusChangeReason && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-2">Status Change Reason</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {member.statusChangeReason}
          </p>
        </div>
      )}
    </div>
  );
};

export default MembershipInfoSection;
