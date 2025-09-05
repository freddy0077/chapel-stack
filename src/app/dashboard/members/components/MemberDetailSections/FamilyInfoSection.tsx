"use client";

import React from "react";
import {
  UserGroupIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";

interface FamilyInfoSectionProps {
  member: Member;
}

const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({ member }) => {
  const hasParentInfo =
    member.fatherName ||
    member.motherName ||
    member.fatherOccupation ||
    member.motherOccupation;
  const hasEmergencyContact =
    member.emergencyContactName ||
    member.emergencyContactPhone ||
    member.emergencyContactRelation;
  const hasFamilyStatus =
    member.headOfHousehold !== undefined || member.familyId;

  if (!hasParentInfo && !hasEmergencyContact && !hasFamilyStatus) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <UserGroupIcon className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">
          Family Information
        </h3>
      </div>

      <div className="space-y-6">
        {/* Family Status */}
        {hasFamilyStatus && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Family Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.headOfHousehold !== undefined && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Head of Household
                  </label>
                  <div className="flex items-center">
                    <HeartIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {member.headOfHousehold ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              )}

              {member.familyId && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Family ID
                  </label>
                  <p className="text-sm text-gray-900">{member.familyId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Parent Information */}
        {hasParentInfo && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Parent Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.fatherName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Father's Name
                  </label>
                  <p className="text-sm text-gray-900">{member.fatherName}</p>
                </div>
              )}

              {member.motherName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Mother's Name
                  </label>
                  <p className="text-sm text-gray-900">{member.motherName}</p>
                </div>
              )}

              {member.fatherOccupation && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Father's Occupation
                  </label>
                  <div className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {member.fatherOccupation}
                    </p>
                  </div>
                </div>
              )}

              {member.motherOccupation && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Mother's Occupation
                  </label>
                  <div className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">
                      {member.motherOccupation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        {hasEmergencyContact && (
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.emergencyContactName && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Contact Name
                  </label>
                  <p className="text-sm text-gray-900">
                    {member.emergencyContactName}
                  </p>
                </div>
              )}

              {member.emergencyContactRelation && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Relationship
                  </label>
                  <p className="text-sm text-gray-900">
                    {member.emergencyContactRelation}
                  </p>
                </div>
              )}

              {member.emergencyContactPhone && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Contact Phone
                  </label>
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <a
                      href={`tel:${member.emergencyContactPhone}`}
                      className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium"
                    >
                      {member.emergencyContactPhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyInfoSection;
