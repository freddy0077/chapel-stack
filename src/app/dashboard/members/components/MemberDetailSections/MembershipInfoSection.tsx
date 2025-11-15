"use client";

import React from "react";
import {
  HomeIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  ShieldCheckIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import {
  Member,
  MemberStatus,
} from "../../types/member.types";

interface MembershipInfoSectionProps {
  member: Member;
}

const MembershipInfoSection: React.FC<MembershipInfoSectionProps> = ({
  member,
}) => {
  // Get member status color and label - simplified to use only MemberStatus
  const getStatusInfo = (status?: MemberStatus) => {
    if (!status) {
      // Default status when none is set
      return {
        color: "bg-blue-100 text-blue-800",
        label: "Active", // Default to Active
      };
    }

    const statusMap = {
      [MemberStatus.ACTIVE]: {
        color: "bg-green-100 text-green-800",
        label: "Active",
      },
      [MemberStatus.INACTIVE]: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Inactive",
      },
      [MemberStatus.SUSPENDED]: {
        color: "bg-orange-100 text-orange-800",
        label: "Suspended",
      },
      [MemberStatus.TRANSFERRED]: {
        color: "bg-blue-100 text-blue-800",
        label: "Transferred",
      },
      [MemberStatus.DECEASED]: {
        color: "bg-gray-100 text-gray-800",
        label: "Deceased",
      },
      [MemberStatus.REMOVED]: {
        color: "bg-red-100 text-red-800",
        label: "Removed",
      },
    };
    return statusMap[status];
  };

  const statusInfo = getStatusInfo(member.status);

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
        <h3 className="ml-3 text-lg font-semibold text-gray-900">
          Membership Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Member Status & Zone */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Member Status</h4>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Current Status
            </label>
            <div className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>

          {member.isRegularAttendee !== undefined && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Regular Attendee
              </label>
              <div className="flex items-center">
                <CheckCircleIcon
                  className={`w-4 h-4 mr-2 ${member.isRegularAttendee ? "text-green-500" : "text-gray-400"}`}
                />
                <p className="text-sm text-gray-900">
                  {member.isRegularAttendee ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}

          {member.zoneId && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Zone ID
              </label>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900 font-mono">{member.zoneId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Important Dates */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Important Dates</h4>

          {member.joinDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Join Date
              </label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">
                  {formatDate(member.joinDate)}
                </p>
              </div>
            </div>
          )}

          {member.membershipDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Membership Date
              </label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">
                  {formatDate(member.membershipDate)}
                </p>
              </div>
            </div>
          )}

          {member.lastAttendanceDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Attendance
              </label>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">
                  {formatDate(member.lastAttendanceDate)}
                </p>
              </div>
            </div>
          )}

          {member.statusChangeDate && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status Change Date
              </label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">
                  {formatDate(member.statusChangeDate)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spiritual Milestones */}
      {(member.baptismDate ||
        member.confirmationDate ||
        member.salvationDate) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 text-indigo-500 mr-2" />
            Spiritual Milestones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {member.salvationDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Salvation Date
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">
                    {formatDate(member.salvationDate)}
                  </p>
                </div>
              </div>
            )}

            {member.baptismDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Baptism Date
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">
                    {formatDate(member.baptismDate)}
                  </p>
                </div>
              </div>
            )}

            {member.confirmationDate && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Confirmation Date
                </label>
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">
                    {formatDate(member.confirmationDate)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {member.baptismLocation && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-500">
                Baptism Location
              </label>
              <p className="text-sm text-gray-900">{member.baptismLocation}</p>
            </div>
          )}
        </div>
      )}

      {/* Location Information */}
      {(member.address ||
        member.city ||
        member.state ||
        member.country ||
        member.landmark) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 text-indigo-500 mr-2" />
            Location Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.address && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="text-sm text-gray-900">{member.address}</p>
              </div>
            )}

            {member.addressLine2 && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Address Line 2
                </label>
                <p className="text-sm text-gray-900">{member.addressLine2}</p>
              </div>
            )}

            {member.city && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  City
                </label>
                <p className="text-sm text-gray-900">{member.city}</p>
              </div>
            )}

            {member.state && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  State/Province
                </label>
                <p className="text-sm text-gray-900">{member.state}</p>
              </div>
            )}

            {member.postalCode && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Postal Code
                </label>
                <p className="text-sm text-gray-900">{member.postalCode}</p>
              </div>
            )}

            {member.country && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Country
                </label>
                <p className="text-sm text-gray-900">{member.country}</p>
              </div>
            )}

            {member.district && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  District
                </label>
                <p className="text-sm text-gray-900">{member.district}</p>
              </div>
            )}

            {member.region && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Region
                </label>
                <p className="text-sm text-gray-900">{member.region}</p>
              </div>
            )}

            {member.landmark && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Landmark
                </label>
                <p className="text-sm text-gray-900">{member.landmark}</p>
              </div>
            )}

            {member.digitalAddress && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">
                  Digital Address
                </label>
                <p className="text-sm text-gray-900 font-mono">{member.digitalAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Change Reason */}
      {member.statusChangeReason && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-2">
            Status Change Reason
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {member.statusChangeReason}
          </p>
        </div>
      )}
    </div>
  );
};

export default MembershipInfoSection;
