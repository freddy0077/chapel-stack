"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckIcon,
  CreditCardIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../types/member.types";

interface MemberGridViewProps {
  members: Member[];
  selectedMembers: string[];
  onSelectMember: (memberId: string) => void;
  onMemberClick?: (member: Member) => void;
}

const MemberGridView: React.FC<MemberGridViewProps> = ({
  members,
  selectedMembers,
  onSelectMember,
  onMemberClick,
}) => {
  const getStatusColor = (status: string) => {
    const statusColors = {
      ACTIVE: "border-green-400 bg-green-50",
      INACTIVE: "border-gray-400 bg-gray-50",
      VISITOR: "border-blue-400 bg-blue-50",
      MEMBER: "border-purple-400 bg-purple-50",
      DEACTIVATED: "border-red-400 bg-red-50",
      TRANSFERRED: "border-orange-400 bg-orange-50",
    };
    return (
      statusColors[status as keyof typeof statusColors] || statusColors.ACTIVE
    );
  };

  const handleMemberClick = (member: Member) => {
    onMemberClick?.(member);
  };

  const handleSelect = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation();
    onSelectMember(memberId);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {members.map((member, index) => {
        const isSelected = selectedMembers.includes(member.id);
        const fullName = [member.firstName, member.middleName, member.lastName]
          .filter(Boolean)
          .join(" ");
        const displayName = member.preferredName || fullName;
        const statusColor = getStatusColor(member.membershipStatus);

        return (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden aspect-square ${
              isSelected ? "ring-2 ring-blue-500" : ""
            } ${statusColor}`}
            onClick={() => handleMemberClick(member)}
          >
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2 z-10">
              <button
                onClick={(e) => handleSelect(e, member.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 hover:border-blue-400"
                }`}
              >
                {isSelected && <CheckIcon className="w-3 h-3" />}
              </button>
            </div>

            {/* RFID Indicator */}
            {member.rfidCardId && (
              <div className="absolute top-2 right-2 z-10">
                <CreditCardIcon
                  className="w-4 h-4 text-green-600 bg-white rounded p-0.5"
                  title="Has RFID Card"
                />
              </div>
            )}

            {/* Member Content */}
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              {/* Avatar */}
              <div className="mb-3">
                {member.profileImageUrl ? (
                  <img
                    src={member.profileImageUrl}
                    alt={displayName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                    <span className="text-white font-semibold text-lg">
                      {member.firstName.charAt(0)}
                      {member.lastName?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                {displayName}
              </h3>

              {/* Status Badge */}
              <div className="text-xs">
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    member.membershipStatus === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : member.membershipStatus === "INACTIVE"
                        ? "bg-gray-100 text-gray-800"
                        : member.membershipStatus === "VISITOR"
                          ? "bg-blue-100 text-blue-800"
                          : member.membershipStatus === "MEMBER"
                            ? "bg-purple-100 text-purple-800"
                            : member.membershipStatus === "DEACTIVATED"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {member.membershipStatus?.toLowerCase().replace("_", " ") ||
                    "Unknown"}
                </span>
              </div>

              {/* Additional Info */}
              <div className="mt-2 flex items-center justify-center space-x-1">
                {member.isRegularAttendee && (
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    title="Regular Attendee"
                  />
                )}
                {member.headOfHousehold && (
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    title="Head of Household"
                  />
                )}
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="text-white text-xs font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                Click to view
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MemberGridView;
