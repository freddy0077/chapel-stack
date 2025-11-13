"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-hot-toast";
import {
  Squares2X2Icon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  MegaphoneIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  GET_MODULE_SETTINGS,
  UPDATE_MODULE_SETTINGS,
  TOGGLE_MODULE,
  type ModuleSettings as ModuleSettingsType,
} from "@/graphql/settings/moduleSettings";

interface Module {
  key: keyof Omit<ModuleSettingsType, 'id' | 'branchId' | 'createdAt' | 'updatedAt'>;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const modules: Module[] = [
  {
    key: "membersEnabled",
    name: "Members Management",
    description: "Manage church members, profiles, and relationships",
    icon: UserGroupIcon,
    color: "blue",
  },
  {
    key: "eventsEnabled",
    name: "Events Management",
    description: "Create and manage church events and registrations",
    icon: CalendarIcon,
    color: "purple",
  },
  {
    key: "donationsEnabled",
    name: "Donations & Contributions",
    description: "Track donations, pledges, and contributions",
    icon: CurrencyDollarIcon,
    color: "green",
  },
  {
    key: "financeEnabled",
    name: "Finance & Accounting",
    description: "Full accounting system with journal entries and reports",
    icon: ChartBarIcon,
    color: "indigo",
  },
  {
    key: "broadcastsEnabled",
    name: "Broadcasts & Messaging",
    description: "Send bulk messages via email and SMS",
    icon: MegaphoneIcon,
    color: "pink",
  },
  {
    key: "groupsEnabled",
    name: "Small Groups",
    description: "Manage small groups, ministries, and departments",
    icon: UsersIcon,
    color: "orange",
  },
  {
    key: "attendanceEnabled",
    name: "Attendance Tracking",
    description: "Track attendance for services and events",
    icon: ClipboardDocumentCheckIcon,
    color: "teal",
  },
  {
    key: "reportsEnabled",
    name: "Reports & Analytics",
    description: "Generate detailed reports and analytics",
    icon: ChartBarIcon,
    color: "cyan",
  },
  {
    key: "mobileAppEnabled",
    name: "Mobile App",
    description: "Enable mobile app access for members",
    icon: DevicePhoneMobileIcon,
    color: "violet",
  },
  {
    key: "smsEnabled",
    name: "SMS Notifications",
    description: "Send SMS notifications to members",
    icon: DevicePhoneMobileIcon,
    color: "blue",
  },
  {
    key: "emailEnabled",
    name: "Email Notifications",
    description: "Send email notifications to members",
    icon: EnvelopeIcon,
    color: "red",
  },
  {
    key: "certificatesEnabled",
    name: "Certificates",
    description: "Generate and manage certificates",
    icon: DocumentTextIcon,
    color: "amber",
  },
];

export default function ModuleSettings() {
  const { data, loading, refetch } = useQuery(GET_MODULE_SETTINGS);
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_MODULE_SETTINGS);
  const [toggleModule] = useMutation(TOGGLE_MODULE);

  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (data?.moduleSettings) {
      const settings: ModuleSettingsType = data.moduleSettings;
      const states: Record<string, boolean> = {};
      modules.forEach((module) => {
        states[module.key] = settings[module.key];
      });
      setModuleStates(states);
    }
  }, [data]);

  const handleToggle = async (moduleKey: string, enabled: boolean) => {
    try {
      // Optimistic update
      setModuleStates((prev) => ({ ...prev, [moduleKey]: enabled }));

      await toggleModule({
        variables: {
          input: {
            moduleName: moduleKey,
            enabled,
          },
        },
      });

      toast.success(
        `${modules.find((m) => m.key === moduleKey)?.name} ${
          enabled ? "enabled" : "disabled"
        }`
      );
      refetch();
    } catch (error: any) {
      // Revert on error
      setModuleStates((prev) => ({ ...prev, [moduleKey]: !enabled }));
      console.error("Error toggling module:", error);
      toast.error(error.message || "Failed to update module");
    }
  };

  const handleSaveAll = async () => {
    try {
      const input: any = {};
      modules.forEach((module) => {
        input[module.key] = moduleStates[module.key];
      });

      await updateSettings({
        variables: { input },
      });

      toast.success("Module settings updated successfully!");
      refetch();
    } catch (error: any) {
      console.error("Error updating module settings:", error);
      toast.error(error.message || "Failed to update module settings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const enabledCount = Object.values(moduleStates).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Squares2X2Icon className="h-7 w-7 text-indigo-600" />
          Module Settings
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enable or disable features for your church management system
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-900">Active Modules</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">
              {enabledCount} / {modules.length}
            </p>
          </div>
          <Squares2X2Icon className="h-16 w-16 text-indigo-300" />
        </div>
        <div className="mt-4 bg-white/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-500"
            style={{ width: `${(enabledCount / modules.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = module.icon;
          const isEnabled = moduleStates[module.key] || false;

          return (
            <div
              key={module.key}
              className={`bg-white rounded-lg border-2 transition-all duration-200 ${
                isEnabled
                  ? "border-indigo-300 shadow-md"
                  : "border-gray-200 opacity-75"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${
                      isEnabled
                        ? `bg-${module.color}-100`
                        : "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isEnabled
                          ? `text-${module.color}-600`
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => handleToggle(module.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {module.name}
                </h3>
                <p className="text-sm text-gray-600">{module.description}</p>

                {isEnabled && (
                  <div className="mt-4 flex items-center gap-1 text-xs text-green-600 font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Active
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={updating}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {updating ? "Saving..." : "Save All Changes"}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          ℹ️ About Module Settings
        </h4>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Disabled modules will be hidden from the navigation menu</li>
          <li>Existing data is preserved when modules are disabled</li>
          <li>Some modules may depend on others to function properly</li>
          <li>Changes take effect immediately after saving</li>
        </ul>
      </div>
    </div>
  );
}
