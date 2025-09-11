"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  CreditCardIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Member, ViewMode, MemberStatus } from "../types/member.types";

interface MemberCardProps {
  member: Member;
  selected?: boolean;
  onSelect?: (memberId: string) => void;
  onEdit?: (member: Member) => void;
  onView?: (member: Member) => void;
  onManageFamily?: (member: Member) => void;
  viewMode?: ViewMode;
  showActions?: boolean;
  compact?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  selected = false,
  onSelect,
  onEdit,
  onView,
  onManageFamily,
  viewMode = "card",
  showActions = true,
  compact = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get member's full name
  const fullName = [member.lastName, member.middleName, member.firstName]
    .filter(Boolean)
    .join(" ");

  // Base display name prefers preferredName over constructed full name
  const baseDisplayName = fullName;
  // If title exists, always prepend it to the display name
  const displayName = member.title
    ? `${member.title}. ${baseDisplayName}`
    : baseDisplayName;

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

  // Calculate age if date of birth is available
  const getAge = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = getAge(member.dateOfBirth);

  // Determine styling based on life events
  const getLifeEventStyling = () => {
    // Death registry connection - deceased members
    if (member.status === MemberStatus.DECEASED) {
      return {
        background: "bg-gray-100 border border-gray-300",
        opacity: "opacity-75",
        grayscale: "grayscale",
        textColor: "text-gray-600",
        isDeceased: true
      };
    }
    
    // Birth registry connection - newborns under 1 year
    if (age !== null && age < 1) {
      return {
        background: "bg-pink-50 border border-pink-200",
        opacity: "",
        grayscale: "",
        textColor: "",
        isDeceased: false
      };
    }
    
    // Default styling - no special treatment
    return {
      background: "bg-white",
      opacity: "",
      grayscale: "",
      textColor: "",
      isDeceased: false
    };
  };

  const lifeEventStyling = getLifeEventStyling();

  // Handle selection
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(member.id);
  };

  // Handle card click
  const handleCardClick = () => {
    onView?.(member);
  };

  // Handle menu actions
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(member);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onView?.(member);
  };

  const handleManageFamily = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onManageFamily?.(member);
  };

  // Different layouts based on view mode
  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`${lifeEventStyling.background} ${lifeEventStyling.opacity} ${lifeEventStyling.grayscale} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
          selected ? "ring-2 ring-blue-500 bg-blue-50" : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="p-4">
          <div className="flex items-center space-x-4">
            {/* Selection Checkbox */}
            {onSelect && (
              <div className="flex-shrink-0">
                <button
                  onClick={handleSelect}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {selected && <CheckCircleIcon className="w-3 h-3" />}
                </button>
              </div>
            )}

            {/* Avatar */}
            <div className="flex-shrink-0">
              {member.profileImageUrl ? (
                <img
                  src={member.profileImageUrl}
                  alt={displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {member.firstName.charAt(0)}
                    {member.lastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Member Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`text-lg font-semibold truncate ${lifeEventStyling.textColor || "text-gray-900"}`}>
                  {displayName}
                  {lifeEventStyling.isDeceased && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (Deceased)
                    </span>
                  )}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
                {member.memberId && (
                  <div
                    className="flex items-center space-x-1"
                    title={`Member ID: ${member.memberId}${member.cardIssued ? ` | Card: ${member.cardType || "Unknown"}` : ""}`}
                  >
                    <CreditCardIcon
                      className={`w-4 h-4 ${member.cardIssued ? "text-green-600" : "text-blue-600"}`}
                    />
                    <span className="text-xs text-gray-600 font-mono">
                      {member.memberId}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                {member.email && (
                  <div className="flex items-center space-x-1">
                    <EnvelopeIcon className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phoneNumber && (
                  <div className="flex items-center space-x-1">
                    <PhoneIcon className="w-4 h-4" />
                    <span>{member.phoneNumber}</span>
                  </div>
                )}
                {age && (
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{age} years</span>
                  </div>
                )}
                {member.memberId && member.cardIssued && (
                  <div
                    className="flex items-center space-x-1"
                    title={`Card issued: ${member.cardIssuedAt ? new Date(member.cardIssuedAt).toLocaleDateString() : "Unknown"}`}
                  >
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {member.cardType || "Card"} Issued
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <div className="flex-shrink-0 relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10">
                    <div className="py-1">
                      <button
                        onClick={handleView}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <EyeIcon className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span>Edit Member</span>
                      </button>
                      {onManageFamily && (
                        <button
                          onClick={handleManageFamily}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <UserGroupIcon className="w-4 h-4" />
                          <span>Family Relationships</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Card view (default)
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${lifeEventStyling.background} ${lifeEventStyling.opacity} ${lifeEventStyling.grayscale} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
        selected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={handleCardClick}
    >
      {/* Header with selection and menu */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between">
          {onSelect && (
            <button
              onClick={handleSelect}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              {selected && <CheckCircleIcon className="w-3 h-3" />}
            </button>
          )}

          {showActions && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <EllipsisVerticalIcon className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleView}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={handleEdit}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit Member</span>
                    </button>
                    {onManageFamily && (
                      <button
                        onClick={handleManageFamily}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UserGroupIcon className="w-4 h-4" />
                        <span>Family Relationships</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Avatar and Name */}
      <div className="px-4 pb-4">
        <div className="flex flex-col items-center text-center">
          {member.profileImageUrl ? (
            <img
              src={member.profileImageUrl}
              alt={displayName}
              className="w-20 h-20 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-3">
              <span className="text-white font-semibold text-2xl">
                {member.firstName.charAt(0)}
                {member.lastName?.charAt(0)}
              </span>
            </div>
          )}

          <h3 className={`text-lg font-semibold mb-1 ${lifeEventStyling.textColor || "text-gray-900"}`}>
            {displayName}
            {lifeEventStyling.isDeceased && (
              <span className="block text-xs text-gray-500 font-normal mt-1">
                (Deceased)
              </span>
            )}
          </h3>

          <div className="flex items-center justify-center space-x-2 mb-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
            {member.memberId && (
              <div
                className="flex items-center space-x-1"
                title={`Member ID: ${member.memberId}${member.cardIssued ? ` | Card: ${member.cardType || "Unknown"}` : ""}`}
              >
                <CreditCardIcon
                  className={`w-4 h-4 ${member.cardIssued ? "text-green-600" : "text-blue-600"}`}
                />
                <span className="text-xs text-gray-600 font-mono">
                  {member.memberId}
                </span>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-2 text-sm text-gray-600 w-full">
            {member.email && (
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
            {member.phoneNumber && (
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 flex-shrink-0" />
                <span>{member.phoneNumber}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                <span>{age} years old</span>
              </div>
            )}
            {(member.city || member.state) && (
              <div className="flex items-center space-x-2">
                <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {[member.city, member.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {member.memberId && member.cardIssued && (
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {member.cardType || "Card"} Issued
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemberCard;
