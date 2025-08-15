'use client';

import React from 'react';
import { 
  UserIcon,
  CalendarIcon,
  IdentificationIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { Member } from '../../types/member.types';

interface PersonalInfoSectionProps {
  member: Member;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ member }) => {
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string | Date | undefined): number | null => {
    if (!dateOfBirth) return null;
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  };

  const age = calculateAge(member.dateOfBirth);
  const fullName = [member.firstName, member.middleName, member.lastName].filter(Boolean).join(' ');
  const displayName = member.preferredName || fullName;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-sm text-gray-900">{fullName}</p>
          </div>
          
          {member.preferredName && (
            <div>
              <label className="text-sm font-medium text-gray-500">Preferred Name</label>
              <p className="text-sm text-gray-900">{member.preferredName}</p>
            </div>
          )}

          {member.title && (
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-sm text-gray-900">{member.title}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Gender</label>
            <p className="text-sm text-gray-900">{member.gender || 'Not specified'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Marital Status</label>
            <p className="text-sm text-gray-900">{member.maritalStatus || 'Not specified'}</p>
          </div>
        </div>

        {/* Birth & Identity Info */}
        <div className="space-y-3">
          {member.dateOfBirth && (
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">
                  {new Date(member.dateOfBirth).toLocaleDateString()} 
                  {age && ` (${age} years old)`}
                </p>
              </div>
            </div>
          )}

          {member.placeOfBirth && (
            <div>
              <label className="text-sm font-medium text-gray-500">Place of Birth</label>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{member.placeOfBirth}</p>
              </div>
            </div>
          )}

          {member.nationality && (
            <div>
              <label className="text-sm font-medium text-gray-500">Nationality</label>
              <p className="text-sm text-gray-900">{member.nationality}</p>
            </div>
          )}

          {member.nlbNumber && (
            <div>
              <label className="text-sm font-medium text-gray-500">NLB Number</label>
              <div className="flex items-center">
                <IdentificationIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{member.nlbNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Education & Occupation */}
      {(member.education || member.occupation || member.employerName) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Education & Career</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.education && (
              <div>
                <label className="text-sm font-medium text-gray-500">Education</label>
                <div className="flex items-center">
                  <AcademicCapIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{member.education}</p>
                </div>
              </div>
            )}

            {member.occupation && (
              <div>
                <label className="text-sm font-medium text-gray-500">Occupation</label>
                <div className="flex items-center">
                  <BriefcaseIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-sm text-gray-900">{member.occupation}</p>
                </div>
              </div>
            )}

            {member.employerName && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Employer</label>
                <p className="text-sm text-gray-900">{member.employerName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;
