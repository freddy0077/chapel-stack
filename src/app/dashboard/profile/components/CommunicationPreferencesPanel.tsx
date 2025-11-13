'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import toast from 'react-hot-toast';
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  PhoneIcon,
  BellIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UPDATE_COMMUNICATION_PREFS } from '@/graphql/mutations/memberMutations';
import { GET_MEMBER } from '@/graphql/queries/memberQueries';

interface CommunicationPreferencesPanelProps {
  memberId: string;
  currentPreferences?: any;
  onUpdate?: () => void;
}

/**
 * CommunicationPreferencesPanel Component
 * 
 * Allows users to manage their communication preferences
 * including email, SMS, phone calls, and push notifications
 * 
 * @param memberId - ID of the member
 * @param currentPreferences - Current communication preferences
 * @param onUpdate - Callback after successful update
 */
export default function CommunicationPreferencesPanel({
  memberId,
  currentPreferences,
  onUpdate,
}: CommunicationPreferencesPanelProps) {
  const [preferences, setPreferences] = useState({
    emailEnabled: true,
    emailNewsletter: true,
    emailEvents: true,
    emailReminders: true,
    emailPrayer: true,
    smsEnabled: false,
    smsEvents: false,
    smsReminders: false,
    smsEmergency: true,
    phoneCallsEnabled: true,
    phoneEmergency: true,
    physicalMail: true,
    pushNotifications: true,
    preferredCallTime: '',
    doNotDisturbDays: [] as string[],
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Initialize preferences from current data
  useEffect(() => {
    if (currentPreferences) {
      setPreferences({
        emailEnabled: currentPreferences.emailEnabled ?? true,
        emailNewsletter: currentPreferences.emailNewsletter ?? true,
        emailEvents: currentPreferences.emailEvents ?? true,
        emailReminders: currentPreferences.emailReminders ?? true,
        emailPrayer: currentPreferences.emailPrayer ?? true,
        smsEnabled: currentPreferences.smsEnabled ?? false,
        smsEvents: currentPreferences.smsEvents ?? false,
        smsReminders: currentPreferences.smsReminders ?? false,
        smsEmergency: currentPreferences.smsEmergency ?? true,
        phoneCallsEnabled: currentPreferences.phoneCallsEnabled ?? true,
        phoneEmergency: currentPreferences.phoneEmergency ?? true,
        physicalMail: currentPreferences.physicalMail ?? true,
        pushNotifications: currentPreferences.pushNotifications ?? true,
        preferredCallTime: currentPreferences.preferredCallTime || '',
        doNotDisturbDays: currentPreferences.doNotDisturbDays || [],
      });
    }
  }, [currentPreferences]);

  const [updatePreferences, { loading }] = useMutation(UPDATE_COMMUNICATION_PREFS, {
    refetchQueries: [
      {
        query: GET_MEMBER,
        variables: { memberId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success('Communication preferences updated successfully!');
      setHasChanges(false);
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update preferences');
    },
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setHasChanges(true);
  };

  const handlePreferredTimeChange = (value: string) => {
    setPreferences((prev) => ({
      ...prev,
      preferredCallTime: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updatePreferences({
        variables: {
          memberId,
          prefsData: JSON.stringify(preferences),
        },
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const handleReset = () => {
    if (currentPreferences) {
      setPreferences({
        emailEnabled: currentPreferences.emailEnabled ?? true,
        emailNewsletter: currentPreferences.emailNewsletter ?? true,
        emailEvents: currentPreferences.emailEvents ?? true,
        emailReminders: currentPreferences.emailReminders ?? true,
        emailPrayer: currentPreferences.emailPrayer ?? true,
        smsEnabled: currentPreferences.smsEnabled ?? false,
        smsEvents: currentPreferences.smsEvents ?? false,
        smsReminders: currentPreferences.smsReminders ?? false,
        smsEmergency: currentPreferences.smsEmergency ?? true,
        phoneCallsEnabled: currentPreferences.phoneCallsEnabled ?? true,
        phoneEmergency: currentPreferences.phoneEmergency ?? true,
        physicalMail: currentPreferences.physicalMail ?? true,
        pushNotifications: currentPreferences.pushNotifications ?? true,
        preferredCallTime: currentPreferences.preferredCallTime || '',
        doNotDisturbDays: currentPreferences.doNotDisturbDays || [],
      });
    }
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BellIcon className="w-6 h-6 text-blue-600" />
          Communication Preferences
        </h2>
      </div>

      {/* Email Preferences */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <EnvelopeIcon className="w-5 h-5 text-blue-600" />
          Email Preferences
        </h3>

        <div className="space-y-3">
          <ToggleSwitch
            label="Enable Email Communications"
            checked={preferences.emailEnabled}
            onChange={() => handleToggle('emailEnabled')}
          />
          {preferences.emailEnabled && (
            <>
              <ToggleSwitch
                label="Newsletter & Updates"
                checked={preferences.emailNewsletter}
                onChange={() => handleToggle('emailNewsletter')}
                indent
              />
              <ToggleSwitch
                label="Event Notifications"
                checked={preferences.emailEvents}
                onChange={() => handleToggle('emailEvents')}
                indent
              />
              <ToggleSwitch
                label="Reminders"
                checked={preferences.emailReminders}
                onChange={() => handleToggle('emailReminders')}
                indent
              />
              <ToggleSwitch
                label="Prayer Requests"
                checked={preferences.emailPrayer}
                onChange={() => handleToggle('emailPrayer')}
                indent
              />
            </>
          )}
        </div>
      </div>

      {/* SMS Preferences */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <DevicePhoneMobileIcon className="w-5 h-5 text-green-600" />
          SMS Preferences
        </h3>

        <div className="space-y-3">
          <ToggleSwitch
            label="Enable SMS Communications"
            checked={preferences.smsEnabled}
            onChange={() => handleToggle('smsEnabled')}
          />
          {preferences.smsEnabled && (
            <>
              <ToggleSwitch
                label="Event Notifications"
                checked={preferences.smsEvents}
                onChange={() => handleToggle('smsEvents')}
                indent
              />
              <ToggleSwitch
                label="Reminders"
                checked={preferences.smsReminders}
                onChange={() => handleToggle('smsReminders')}
                indent
              />
            </>
          )}
          <ToggleSwitch
            label="Emergency Alerts (Always On)"
            checked={preferences.smsEmergency}
            onChange={() => handleToggle('smsEmergency')}
          />
        </div>
      </div>

      {/* Phone Call Preferences */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <PhoneIcon className="w-5 h-5 text-purple-600" />
          Phone Call Preferences
        </h3>

        <div className="space-y-3">
          <ToggleSwitch
            label="Enable Phone Calls"
            checked={preferences.phoneCallsEnabled}
            onChange={() => handleToggle('phoneCallsEnabled')}
          />
          <ToggleSwitch
            label="Emergency Calls (Always On)"
            checked={preferences.phoneEmergency}
            onChange={() => handleToggle('phoneEmergency')}
          />

          {preferences.phoneCallsEnabled && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="preferredCallTime">
                <ClockIcon className="w-4 h-4 inline mr-2" />
                Preferred Call Time
              </Label>
              <Select
                value={preferences.preferredCallTime}
                onValueChange={handlePreferredTimeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No preference</SelectItem>
                  <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                  <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Other Preferences */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900">Other Preferences</h3>

        <div className="space-y-3">
          <ToggleSwitch
            label="Physical Mail"
            checked={preferences.physicalMail}
            onChange={() => handleToggle('physicalMail')}
          />
          <ToggleSwitch
            label="Push Notifications"
            checked={preferences.pushNotifications}
            onChange={() => handleToggle('pushNotifications')}
          />
        </div>
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * ToggleSwitch Component
 * Simple toggle switch for preferences
 */
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  indent?: boolean;
}

function ToggleSwitch({ label, checked, onChange, indent = false }: ToggleSwitchProps) {
  return (
    <div className={`flex items-center justify-between ${indent ? 'ml-6' : ''}`}>
      <Label className="text-sm text-gray-700">{label}</Label>
      <button
        type="button"
        onClick={onChange}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}
