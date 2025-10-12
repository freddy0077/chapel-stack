import React, { useState, useEffect } from "react";
import {
  BuildingLibraryIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";
import { useMemberGroupMemberships } from "@/graphql/hooks/useMemberGroupMemberships";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

interface GroupMembership {
  id: string;
  memberId: string;
  ministryId?: string;
  ministryName?: string;
  smallGroupId?: string;
  smallGroupName?: string;
  role: string;
  joinDate: string;
  leaveDate?: string;
  leaveReason?: string;
  isActive: boolean;
  responsibilities: string[];
}

interface GroupMembershipsSectionProps {
  member: Member;
}

const GroupMembershipsSection: React.FC<GroupMembershipsSectionProps> = ({
  member,
}) => {
  const { organisationId, branchId } = useOrganisationBranch();
  const { groupMemberships, loading, error } = useMemberGroupMemberships(
    member.id,
    branchId,
    organisationId,
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "MEMBER":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "CO_LEADER":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "LEADER":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "MEMBER":
        return <StarIcon className="h-3 w-3" />;
      case "CO_LEADER":
        return <UserGroupIcon className="h-3 w-3" />;
      case "LEADER":
        return <BuildingLibraryIcon className="h-3 w-3" />;
      default:
        return <StarIcon className="h-3 w-3" />;
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case "MEMBER":
        return "Member";
      case "CO_LEADER":
        return "Co-Leader";
      case "LEADER":
        return "Leader";
      default:
        return "Member";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    switch (isActive) {
      case true:
        return "bg-green-100 text-green-700 border-green-300";
      case false:
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-green-100 text-green-700 border-green-300";
    }
  };

  const formatStatus = (isActive: boolean) => {
    switch (isActive) {
      case true:
        return "Active";
      case false:
        return "Inactive";
      default:
        return "Active";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UserGroupIcon className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Small Group Memberships
          </h3>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <UserGroupIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading group memberships...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <XCircleIcon className="h-12 w-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-600 text-sm">
            Error loading group memberships
          </p>
        </div>
      ) : (
        <div>
          {/* Active Memberships */}
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-green-600" />
            Active Small Groups (
            {
              groupMemberships.filter(
                (membership) => membership.smallGroupId && membership.isActive
              ).length
            }
            )
          </h4>

          {groupMemberships.filter(
            (membership) => membership.smallGroupId && membership.isActive
          ).length > 0 ? (
            <div className="space-y-3 mb-6">
              {groupMemberships
                .filter(
                  (membership) => membership.smallGroupId && membership.isActive
                )
                .map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-gray-900">
                          {membership.smallGroupName}
                        </h5>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(membership.role)}`}
                        >
                          {getRoleIcon(membership.role)}
                          {formatRole(membership.role)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(membership.isActive)}`}
                        >
                          {formatStatus(membership.isActive)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          Joined{" "}
                          {new Date(membership.joinDate).toLocaleDateString()}
                        </span>
                        {membership.leaveDate && (
                          <span className="flex items-center gap-1 text-red-600">
                            <ClockIcon className="h-3 w-3" />
                            Left{" "}
                            {new Date(membership.leaveDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {membership.leaveReason && (
                        <div className="mt-2 text-xs text-gray-600 italic">
                          Reason: {membership.leaveReason}
                        </div>
                      )}
                      {membership.leaveDate && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          Duration: {membership.joinDate && membership.leaveDate
                            ? `${Math.floor(
                                (new Date(membership.leaveDate).getTime() -
                                  new Date(membership.joinDate).getTime()) /
                                  (1000 * 60 * 60 * 24 * 30)
                              )} months`
                            : "N/A"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-200 mb-6">
              <UserGroupIcon className="h-8 w-8 text-blue-300 mx-auto mb-2" />
              <p className="text-blue-600 text-sm">
                No active small group memberships
              </p>
            </div>
          )}

          {/* Historical/Past Memberships */}
          {groupMemberships.filter(
            (membership) => membership.smallGroupId && !membership.isActive
          ).length > 0 && (
            <>
              <h4 className="text-md font-medium text-gray-900 mb-3 mt-6 flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-gray-600" />
                Past Small Groups (
                {
                  groupMemberships.filter(
                    (membership) =>
                      membership.smallGroupId && !membership.isActive
                  ).length
                }
                )
              </h4>

              <div className="space-y-3">
                {groupMemberships
                  .filter(
                    (membership) =>
                      membership.smallGroupId && !membership.isActive
                  )
                  .map((membership) => (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-75"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-700">
                            {membership.smallGroupName}
                          </h5>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(membership.role)}`}
                          >
                            {getRoleIcon(membership.role)}
                            {formatRole(membership.role)}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-300">
                            Past Member
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            Joined{" "}
                            {new Date(membership.joinDate).toLocaleDateString()}
                          </span>
                          {membership.leaveDate && (
                            <span className="flex items-center gap-1 text-red-600">
                              <ClockIcon className="h-3 w-3" />
                              Left{" "}
                              {new Date(
                                membership.leaveDate
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {membership.leaveReason && (
                          <div className="mt-2 text-xs text-gray-600 italic">
                            Reason: {membership.leaveReason}
                          </div>
                        )}
                        {membership.leaveDate && (
                          <div className="mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Duration:{" "}
                            {membership.joinDate && membership.leaveDate
                              ? `${Math.floor(
                                  (new Date(membership.leaveDate).getTime() -
                                    new Date(membership.joinDate).getTime()) /
                                    (1000 * 60 * 60 * 24 * 30)
                                )} months`
                              : "N/A"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Summary */}
      {groupMemberships.filter((membership) => membership.smallGroupId).length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {
                  groupMemberships.filter(
                    (membership) => membership.smallGroupId && membership.isActive
                  ).length
                }
              </div>
              <div className="text-green-700 text-sm">Active Groups</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-600">
                {
                  groupMemberships.filter(
                    (membership) => membership.smallGroupId && !membership.isActive
                  ).length
                }
              </div>
              <div className="text-gray-700 text-sm">Past Groups</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMembershipsSection;
