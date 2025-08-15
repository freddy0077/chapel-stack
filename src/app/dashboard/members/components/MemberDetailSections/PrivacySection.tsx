'use client';

import React from 'react';
import { 
  ShieldCheckIcon,
  BellIcon,
  EyeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Member, PrivacyLevel, CommunicationPreferences } from '../../types/member.types';

interface PrivacySectionProps {
  member: Member;
}

const PrivacySection: React.FC<PrivacySectionProps> = ({ member }) => {
  const hasPrivacyInfo = member.privacyLevel || member.consentDate || member.consentVersion || member.dataRetentionDate;
  const hasCommunicationPrefs = member.communicationPrefs;
  const hasDeactivationInfo = member.isDeactivated || member.deactivatedAt || member.deactivationReason;

  if (!hasPrivacyInfo && !hasCommunicationPrefs && !hasDeactivationInfo) {
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

  const getPrivacyLevelColor = (level: PrivacyLevel | undefined) => {
    switch (level) {
      case 'PUBLIC':
        return 'bg-green-100 text-green-800';
      case 'STANDARD':
        return 'bg-blue-100 text-blue-800';
      case 'RESTRICTED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PRIVATE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrivacyLevelIcon = (level: PrivacyLevel | undefined) => {
    switch (level) {
      case 'PUBLIC':
        return <EyeIcon className="w-4 h-4 text-green-600" />;
      case 'STANDARD':
        return <ShieldCheckIcon className="w-4 h-4 text-blue-600" />;
      case 'RESTRICTED':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
      case 'PRIVATE':
        return <ShieldCheckIcon className="w-4 h-4 text-red-600" />;
      default:
        return <ShieldCheckIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
          <ShieldCheckIcon className="w-5 h-5 text-teal-600" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-gray-900">Privacy & Communication</h3>
      </div>

      <div className="space-y-6">
        {/* Privacy Level */}
        {member.privacyLevel && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Privacy Settings</h4>
            <div>
              <label className="text-sm font-medium text-gray-500">Privacy Level</label>
              <div className="flex items-center mt-1">
                {getPrivacyLevelIcon(member.privacyLevel)}
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPrivacyLevelColor(member.privacyLevel)}`}>
                  {member.privacyLevel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* GDPR Compliance */}
        {(member.consentDate || member.consentVersion || member.dataRetentionDate) && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <DocumentTextIcon className="w-5 h-5 text-blue-500 mr-2" />
              GDPR Compliance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {member.consentDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Consent Date</label>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{formatDate(member.consentDate)}</p>
                  </div>
                </div>
              )}

              {member.consentVersion && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Consent Version</label>
                  <p className="text-sm text-gray-900">{member.consentVersion}</p>
                </div>
              )}

              {member.dataRetentionDate && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Data Retention Until</label>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-sm text-gray-900">{formatDate(member.dataRetentionDate)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Communication Preferences */}
        {hasCommunicationPrefs && member.communicationPrefs && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <BellIcon className="w-5 h-5 text-purple-500 mr-2" />
              Communication Preferences
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${member.communicationPrefs.emailNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Email</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${member.communicationPrefs.smsNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">SMS</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${member.communicationPrefs.phoneCallsAllowed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Phone Calls</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${member.communicationPrefs.mailNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Mail</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${member.communicationPrefs.pushNotifications ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Push</span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${member.communicationPrefs.eventReminders ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className="text-sm text-gray-700">Events</span>
              </div>
            </div>

            {/* Special Preferences */}
            <div className="mt-4 space-y-2">
              {member.communicationPrefs.doNotDisturb && (
                <div className="flex items-center p-2 bg-red-50 rounded-md">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm text-red-700 font-medium">Do Not Disturb</span>
                </div>
              )}
              
              {member.communicationPrefs.emergencyContactOnly && (
                <div className="flex items-center p-2 bg-yellow-50 rounded-md">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500 mr-2" />
                  <span className="text-sm text-yellow-700 font-medium">Emergency Contact Only</span>
                </div>
              )}

              {member.communicationPrefs.preferredContactTime && (
                <div className="text-sm text-gray-600">
                  <strong>Preferred Contact Time:</strong> {member.communicationPrefs.preferredContactTime}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deactivation Information */}
        {hasDeactivationInfo && (
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
              Account Status
            </h4>
            {member.isDeactivated && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-sm font-medium text-red-800">Account Deactivated</span>
                </div>
                
                {member.deactivatedAt && (
                  <div className="mb-2">
                    <label className="text-xs font-medium text-red-600">Deactivated On</label>
                    <p className="text-sm text-red-700">{formatDate(member.deactivatedAt)}</p>
                  </div>
                )}
                
                {member.deactivatedBy && (
                  <div className="mb-2">
                    <label className="text-xs font-medium text-red-600">Deactivated By</label>
                    <p className="text-sm text-red-700">{member.deactivatedBy}</p>
                  </div>
                )}
                
                {member.deactivationReason && (
                  <div>
                    <label className="text-xs font-medium text-red-600">Reason</label>
                    <p className="text-sm text-red-700">{member.deactivationReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySection;
