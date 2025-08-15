'use client';

import React from 'react';
import { 
  ClockIcon,
  DocumentIcon,
  InformationCircleIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Member } from '../../types/member.types';

interface SystemInfoSectionProps {
  member: Member;
}

const SystemInfoSection: React.FC<SystemInfoSectionProps> = ({ member }) => {
  const hasSystemInfo = member.lastActivityDate || member.affidavitUrl;
  
  if (!hasSystemInfo) {
    return null;
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return null;
    }
  };

  const formatDateTime = (date: string | Date | undefined) => {
    if (!date) return null;
    try {
      return new Date(date).toLocaleString();
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <InformationCircleIcon className="w-5 h-5 text-gray-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">System Information</h3>
      </div>

      <div className="space-y-6">
        {/* Activity Information */}
        {member.lastActivityDate && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Activity</h4>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Activity</label>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-sm text-gray-900">{formatDateTime(member.lastActivityDate)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {member.affidavitUrl && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Documents</h4>
            <div>
              <label className="text-sm font-medium text-gray-500">Affidavit</label>
              <div className="flex items-center">
                <DocumentIcon className="w-4 h-4 text-gray-400 mr-2" />
                <a 
                  href={member.affidavitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Affidavit Document
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Record Information */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Record Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Member ID</label>
              <p className="text-sm text-gray-900 font-mono">{member.id}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Organization ID</label>
              <p className="text-sm text-gray-900 font-mono">{member.organisationId}</p>
            </div>
            
            {member.branchId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Branch ID</label>
                <p className="text-sm text-gray-900 font-mono">{member.branchId}</p>
              </div>
            )}
            
            {member.spouseId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Spouse ID</label>
                <p className="text-sm text-gray-900 font-mono">{member.spouseId}</p>
              </div>
            )}
            
            {member.parentId && (
              <div>
                <label className="text-sm font-medium text-gray-500">Parent ID</label>
                <p className="text-sm text-gray-900 font-mono">{member.parentId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoSection;
