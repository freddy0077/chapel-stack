"use client";

import React from "react";
import {
  XMarkIcon,
  PencilIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { Member } from "../types/member.types";
import {
  PersonalInfoSection,
  ContactInfoSection,
  FamilyInfoSection,
  MembershipInfoSection,
  MemberIdSection,
  PrivacySection,
  SystemInfoSection,
  FamilyRelationshipsSection,
  GroupMembershipsSection,
  ActivitiesSection,
  SacramentsSection,
} from "./MemberDetailSections";

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (member: Member) => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
  onEdit,
}) => {
  console.log("MemberDetailModal render:", { member, isOpen });

  if (!member) {
    console.log("MemberDetailModal: No member data provided");
    return null;
  }

  const fullName = [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(" ");
  const displayName = member.preferredName || fullName;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="flex items-start justify-center min-h-screen px-4 pt-4 pb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-6xl bg-white rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    {/* Profile Image or Avatar */}
                    <div className="flex-shrink-0">
                      {member.profileImageUrl ? (
                        <img
                          src={member.profileImageUrl}
                          alt={displayName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {displayName}
                      </h2>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          {member.membershipStatus}
                        </span>
                        {member.memberId && (
                          <span className="text-sm font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            ID: {member.memberId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(member)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edit Member
                      </button>
                    )}

                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <PersonalInfoSection member={member} />
                    <ContactInfoSection member={member} />
                    <FamilyInfoSection member={member} />
                    <FamilyRelationshipsSection member={member} />
                    <GroupMembershipsSection member={member} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <MembershipInfoSection member={member} />
                    <MemberIdSection member={member} />
                    <SacramentsSection member={member} />
                    <PrivacySection member={member} />
                    <ActivitiesSection member={member} />
                    <SystemInfoSection member={member} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 rounded-b-xl p-4">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(member)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Member
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MemberDetailModal;
