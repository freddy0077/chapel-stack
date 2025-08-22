'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, ShieldCheckIcon, BellIcon } from '@heroicons/react/24/outline';
import { WizardStepProps, ValidationError } from '../types/WizardTypes';
import { PrivacyLevel } from '../../../types/member.types';

const CommunicationPrefsStep: React.FC<WizardStepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isFirstStep,
  isLastStep
}) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validateStep = (): boolean => {
    const newErrors: ValidationError[] = [];

    // GDPR compliance - consent date is required
    if (!formData.consentDate) {
      newErrors.push({ field: 'consentDate', message: 'Consent date is required for GDPR compliance' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
    // Clear error for this field
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  // Initialize communication preferences if not set
  const communicationPrefs = formData.communicationPrefs || {
    emailNotifications: true,
    smsNotifications: false,
    phoneCallsAllowed: true,
    mailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    eventReminders: true,
    newsletterSubscription: true,
    emergencyContactOnly: false,
    doNotDisturb: false,
    preferredContactTime: 'ANYTIME',
    communicationFrequency: 'WEEKLY'
  };

  const updateCommunicationPref = (key: string, value: any) => {
    const updatedPrefs = { ...communicationPrefs, [key]: value };
    handleInputChange('communicationPrefs', updatedPrefs);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Communication Preferences</h3>
        <p className="text-gray-600 mt-2">How would you like us to communicate with you?</p>
      </div>

      {/* Communication Channels */}
      <div className="bg-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <BellIcon className="w-5 h-5 text-indigo-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Communication Channels</h4>
        </div>
        
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-xs text-gray-500">Receive church updates and announcements via email</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.emailNotifications}
              onChange={(e) => updateCommunicationPref('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
              <p className="text-xs text-gray-500">Receive text messages for urgent updates</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.smsNotifications}
              onChange={(e) => updateCommunicationPref('smsNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Phone Calls */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Phone Calls Allowed</label>
              <p className="text-xs text-gray-500">Allow church staff to contact you by phone</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.phoneCallsAllowed}
              onChange={(e) => updateCommunicationPref('phoneCallsAllowed', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Mail Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Physical Mail</label>
              <p className="text-xs text-gray-500">Receive printed newsletters and invitations</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.mailNotifications}
              onChange={(e) => updateCommunicationPref('mailNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Push Notifications</label>
              <p className="text-xs text-gray-500">Receive notifications through church mobile app</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.pushNotifications}
              onChange={(e) => updateCommunicationPref('pushNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Content Preferences */}
      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Content Preferences</h4>
        
        <div className="space-y-4">
          {/* Event Reminders */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Event Reminders</label>
              <p className="text-xs text-gray-500">Get reminders about upcoming church events</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.eventReminders}
              onChange={(e) => updateCommunicationPref('eventReminders', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Newsletter Subscription */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Newsletter Subscription</label>
              <p className="text-xs text-gray-500">Receive regular church newsletters</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.newsletterSubscription}
              onChange={(e) => updateCommunicationPref('newsletterSubscription', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Marketing Emails</label>
              <p className="text-xs text-gray-500">Receive promotional content and special offers</p>
            </div>
            <input
              type="checkbox"
              checked={communicationPrefs.marketingEmails}
              onChange={(e) => updateCommunicationPref('marketingEmails', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Communication Frequency */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Communication Frequency
            </label>
            <select
              value={communicationPrefs.communicationFrequency}
              onChange={(e) => updateCommunicationPref('communicationFrequency', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="EMERGENCY_ONLY">Emergency Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Contact Time
            </label>
            <select
              value={communicationPrefs.preferredContactTime}
              onChange={(e) => updateCommunicationPref('preferredContactTime', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value="ANYTIME">Anytime</option>
              <option value="MORNING">Morning (6AM - 12PM)</option>
              <option value="AFTERNOON">Afternoon (12PM - 6PM)</option>
              <option value="EVENING">Evening (6PM - 10PM)</option>
              <option value="WEEKENDS_ONLY">Weekends Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy & GDPR Compliance */}
      <div className="bg-yellow-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="w-5 h-5 text-yellow-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Privacy & Data Protection</h4>
        </div>
        
        <div className="space-y-4">
          {/* Privacy Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Privacy Level
            </label>
            <select
              value={formData.privacyLevel || PrivacyLevel.STANDARD}
              onChange={(e) => handleInputChange('privacyLevel', e.target.value as PrivacyLevel)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <option value={PrivacyLevel.PUBLIC}>Public - Information can be shared openly</option>
              <option value={PrivacyLevel.STANDARD}>Standard - Normal privacy protection</option>
              <option value={PrivacyLevel.PRIVATE}>Private - Restricted information sharing</option>
              <option value={PrivacyLevel.CONFIDENTIAL}>Confidential - Highest privacy protection</option>
            </select>
          </div>

          {/* GDPR Consent */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consent Date *
              </label>
              <input
                type="date"
                value={formData.consentDate ? new Date(formData.consentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('consentDate', e.target.value ? new Date(e.target.value) : new Date())}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  getFieldError('consentDate') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {getFieldError('consentDate') && (
                <p className="text-red-500 text-sm mt-1">{getFieldError('consentDate')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consent Version
              </label>
              <input
                type="text"
                value={formData.consentVersion || 'v1.0'}
                onChange={(e) => handleInputChange('consentVersion', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., v1.0"
              />
            </div>
          </div>

          {/* Data Retention */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Retention Until (Optional)
            </label>
            <input
              type="date"
              value={formData.dataRetentionDate ? new Date(formData.dataRetentionDate).toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('dataRetentionDate', e.target.value ? new Date(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank for indefinite retention according to church policy
            </p>
          </div>

          {/* Special Preferences */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emergencyContactOnly"
                checked={communicationPrefs.emergencyContactOnly}
                onChange={(e) => updateCommunicationPref('emergencyContactOnly', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="emergencyContactOnly" className="ml-2 text-sm font-medium text-gray-700">
                Emergency contact only
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="doNotDisturb"
                checked={communicationPrefs.doNotDisturb}
                onChange={(e) => updateCommunicationPref('doNotDisturb', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="doNotDisturb" className="ml-2 text-sm font-medium text-gray-700">
                Do not disturb (minimal contact)
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={isFirstStep}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Next Step
        </motion.button>
      </div>
    </div>
  );
};

export default CommunicationPrefsStep;
