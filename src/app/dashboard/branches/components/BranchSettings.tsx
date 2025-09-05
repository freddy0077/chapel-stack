"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import {
  CogIcon,
  ShareIcon,
  ChartPieIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useBranchSettings } from "../../../../hooks/useBranchSettings";
import { usePermissions } from "../../../../hooks/usePermissions";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export type VisibilityLevel = "full" | "limited" | "none";
export type ReportingLevel = "detailed" | "summary" | "none";

export interface BranchSettings {
  allowMemberTransfers: boolean;
  allowResourceSharing: boolean;
  visibilityToOtherBranches: VisibilityLevel;
  financialReportingLevel: ReportingLevel;
  attendanceReportingLevel: ReportingLevel;
  memberDataVisibility: VisibilityLevel;
  timezone: string;
  currency: string;
  language: string;
  brandingSettings: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    transferNotifications: boolean;
    financialNotifications: boolean;
  };
}

interface BranchSettingsProps {
  branchId: string;
  initialSettings?: BranchSettings; // Make initial settings optional
}

// Default settings to use if no settings are provided
const defaultSettings: BranchSettings = {
  allowMemberTransfers: true,
  allowResourceSharing: true,
  visibilityToOtherBranches: "limited",
  financialReportingLevel: "summary",
  attendanceReportingLevel: "summary",
  memberDataVisibility: "limited",
  timezone: "UTC",
  currency: "USD",
  language: "en",
  brandingSettings: {
    primaryColor: "#4f46e5",
    secondaryColor: "#9333ea",
    fontFamily: "Inter, sans-serif",
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: false,
    transferNotifications: true,
    financialNotifications: true,
  },
};

export default function BranchSettings({
  branchId,
  initialSettings,
}: BranchSettingsProps) {
  // Get permissions to check if user can edit settings
  const { canCustomizeModules, isBranchAdmin, isSuperAdmin } = usePermissions();
  const canEdit = canCustomizeModules || isBranchAdmin || isSuperAdmin;

  // Use the branch settings hook
  const {
    settings: fetchedSettings,
    loading,
    error,
    saveSettings,
  } = useBranchSettings({ branchId });

  // Initialize with either provided settings, fetched settings, or defaults
  const [currentSettings, setCurrentSettings] = useState<BranchSettings>(
    initialSettings || defaultSettings,
  );

  // Update settings when they're fetched from the API
  useEffect(() => {
    if (fetchedSettings) {
      setCurrentSettings(fetchedSettings);
    }
  }, [fetchedSettings]);

  const [isSaving, setIsSaving] = useState(false);

  // Handle saving settings
  const handleSave = async () => {
    if (!canEdit) return;

    setIsSaving(true);
    try {
      await saveSettings(currentSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggle changes
  const handleToggleChange = (field: keyof BranchSettings, value: boolean) => {
    if (!canEdit) return;

    setCurrentSettings({
      ...currentSettings,
      [field]: value,
    });
  };

  // Handle notification toggle changes
  const handleNotificationToggleChange = (
    field: keyof typeof currentSettings.notificationSettings,
    value: boolean,
  ) => {
    if (!canEdit) return;

    setCurrentSettings({
      ...currentSettings,
      notificationSettings: {
        ...currentSettings.notificationSettings,
        [field]: value,
      },
    });
  };

  // Handle select changes
  const handleSelectChange = (field: keyof BranchSettings, value: string) => {
    if (!canEdit) return;

    setCurrentSettings({
      ...currentSettings,
      [field]: value,
    });
  };

  const visibilityOptions = [
    { value: "full", label: "Full Visibility" },
    { value: "limited", label: "Limited Visibility" },
    { value: "none", label: "No Visibility" },
  ];

  const reportingOptions = [
    { value: "detailed", label: "Detailed Reports" },
    { value: "summary", label: "Summary Only" },
    { value: "none", label: "No Reporting" },
  ];

  return (
    <div className="mt-6 bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex items-center">
        <CogIcon className="h-6 w-6 text-gray-400 mr-3" aria-hidden="true" />
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Branch Settings
        </h3>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="space-y-6">
          {/* Data Sharing Settings */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <ShareIcon className="h-5 w-5 text-gray-400 mr-2" />
              Data Sharing Settings
            </h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="allowMemberTransfers"
                    className="text-sm font-medium text-gray-700"
                  >
                    Allow Member Transfers
                  </label>
                  <p className="text-xs text-gray-500">
                    Allow members to be transferred between this branch and
                    others
                  </p>
                </div>
                <Switch
                  checked={currentSettings.allowMemberTransfers}
                  onChange={(checked) =>
                    handleToggleChange("allowMemberTransfers", checked)
                  }
                  className={classNames(
                    currentSettings.allowMemberTransfers
                      ? "bg-indigo-600"
                      : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  )}
                >
                  <span className="sr-only">Allow Member Transfers</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      currentSettings.allowMemberTransfers
                        ? "translate-x-5"
                        : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    )}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="allowResourceSharing"
                    className="text-sm font-medium text-gray-700"
                  >
                    Allow Resource Sharing
                  </label>
                  <p className="text-xs text-gray-500">
                    Share resources (documents, media, etc.) with other branches
                  </p>
                </div>
                <Switch
                  checked={currentSettings.allowResourceSharing}
                  onChange={(checked) =>
                    handleToggleChange("allowResourceSharing", checked)
                  }
                  className={classNames(
                    currentSettings.allowResourceSharing
                      ? "bg-indigo-600"
                      : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  )}
                >
                  <span className="sr-only">Allow Resource Sharing</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      currentSettings.allowResourceSharing
                        ? "translate-x-5"
                        : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    )}
                  />
                </Switch>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                <label
                  htmlFor="visibilityToOtherBranches"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Branch Visibility
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="visibilityToOtherBranches"
                    name="visibilityToOtherBranches"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    value={currentSettings.visibilityToOtherBranches}
                    onChange={(e) =>
                      handleSelectChange(
                        "visibilityToOtherBranches",
                        e.target.value as VisibilityLevel,
                      )
                    }
                  >
                    {visibilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Controls how much information other branches can see about
                    this branch
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                <label
                  htmlFor="memberDataVisibility"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Member Data Visibility
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="memberDataVisibility"
                    name="memberDataVisibility"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    value={currentSettings.memberDataVisibility}
                    onChange={(e) =>
                      handleSelectChange(
                        "memberDataVisibility",
                        e.target.value as VisibilityLevel,
                      )
                    }
                  >
                    {visibilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Controls the visibility of member data to other branches
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reporting Settings */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <ChartPieIcon className="h-5 w-5 text-gray-400 mr-2" />
              Reporting Settings
            </h4>
            <div className="mt-4 space-y-4">
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                <label
                  htmlFor="financialReportingLevel"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Financial Reporting
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="financialReportingLevel"
                    name="financialReportingLevel"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    value={currentSettings.financialReportingLevel}
                    onChange={(e) =>
                      handleSelectChange(
                        "financialReportingLevel",
                        e.target.value as ReportingLevel,
                      )
                    }
                  >
                    {reportingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Determines how financial data is reported to the
                    diocese/organization
                  </p>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
                <label
                  htmlFor="attendanceReportingLevel"
                  className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Attendance Reporting
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <select
                    id="attendanceReportingLevel"
                    name="attendanceReportingLevel"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                    value={currentSettings.attendanceReportingLevel}
                    onChange={(e) =>
                      handleSelectChange(
                        "attendanceReportingLevel",
                        e.target.value as ReportingLevel,
                      )
                    }
                  >
                    {reportingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Controls how attendance data is shared with the
                    diocese/organization
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 flex items-center">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
              Notification Settings
            </h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="emailNotifications"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Send email notifications to branch administrators
                  </p>
                </div>
                <Switch
                  checked={
                    currentSettings.notificationSettings.emailNotifications
                  }
                  onChange={(checked) =>
                    handleNotificationToggleChange(
                      "emailNotifications",
                      checked,
                    )
                  }
                  className={classNames(
                    currentSettings.notificationSettings.emailNotifications
                      ? "bg-indigo-600"
                      : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  )}
                >
                  <span className="sr-only">Email Notifications</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      currentSettings.notificationSettings.emailNotifications
                        ? "translate-x-5"
                        : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    )}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="smsNotifications"
                    className="text-sm font-medium text-gray-700"
                  >
                    SMS Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Send text message notifications for important events
                  </p>
                </div>
                <Switch
                  checked={
                    currentSettings.notificationSettings.smsNotifications
                  }
                  onChange={(checked) =>
                    handleNotificationToggleChange("smsNotifications", checked)
                  }
                  className={classNames(
                    currentSettings.notificationSettings.smsNotifications
                      ? "bg-indigo-600"
                      : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  )}
                >
                  <span className="sr-only">SMS Notifications</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      currentSettings.notificationSettings.smsNotifications
                        ? "translate-x-5"
                        : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    )}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="transferNotifications"
                    className="text-sm font-medium text-gray-700"
                  >
                    Member Transfer Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Receive notifications when members are transferred to/from
                    this branch
                  </p>
                </div>
                <Switch
                  checked={
                    currentSettings.notificationSettings.transferNotifications
                  }
                  onChange={(checked) =>
                    handleNotificationToggleChange(
                      "transferNotifications",
                      checked,
                    )
                  }
                  className={classNames(
                    currentSettings.notificationSettings.transferNotifications
                      ? "bg-indigo-600"
                      : "bg-gray-200",
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                  )}
                >
                  <span className="sr-only">Transfer Notifications</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      currentSettings.notificationSettings.transferNotifications
                        ? "translate-x-5"
                        : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
