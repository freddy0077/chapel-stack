"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  Title,
  Text,
  Grid,
  Select,
  SelectItem,
  Button,
} from "@tremor/react";

// Widget types
const WIDGET_TYPES = [
  {
    id: "membership_growth",
    name: "Membership Growth Chart",
    category: "membership",
  },
  {
    id: "attendance_trends",
    name: "Attendance Trends",
    category: "attendance",
  },
  { id: "giving_summary", name: "Giving Summary", category: "financial" },
  { id: "new_members", name: "New Members", category: "membership" },
  {
    id: "volunteer_participation",
    name: "Volunteer Participation",
    category: "volunteer",
  },
  {
    id: "ministry_engagement",
    name: "Ministry Engagement",
    category: "ministry",
  },
  { id: "branch_comparison", name: "Branch Comparison", category: "branch" },
  { id: "member_migration", name: "Member Migration", category: "membership" },
  {
    id: "financial_overview",
    name: "Financial Overview",
    category: "financial",
  },
  {
    id: "attendance_summary",
    name: "Attendance Summary",
    category: "attendance",
  },
  {
    id: "sacramental_records",
    name: "Sacramental Records",
    category: "sacraments",
  },
  { id: "branch_performance", name: "Branch Performance", category: "branch" },
];

// Pre-defined dashboard layouts
const DASHBOARD_PRESETS = [
  {
    id: "leadership",
    name: "Leadership Overview",
    widgets: [
      "membership_growth",
      "financial_overview",
      "branch_comparison",
      "volunteer_participation",
      "member_migration",
    ],
  },
  {
    id: "branch_admin",
    name: "Branch Administration",
    widgets: [
      "attendance_summary",
      "giving_summary",
      "ministry_engagement",
      "new_members",
    ],
  },
  {
    id: "finance",
    name: "Financial Focus",
    widgets: ["financial_overview", "giving_summary", "branch_comparison"],
  },
  {
    id: "membership",
    name: "Membership Focus",
    widgets: [
      "membership_growth",
      "new_members",
      "member_migration",
      "sacramental_records",
    ],
  },
];

// User roles for permissions
const USER_ROLES = [
  { id: "admin", name: "Organization Admin" },
  { id: "branch_admin", name: "Branch Admin" },
  { id: "pastor", name: "Pastor/Minister" },
  { id: "ministry_leader", name: "Ministry Leader" },
  { id: "staff", name: "Staff Member" },
];

export default function DashboardSettings() {
  const [selectedPreset, setSelectedPreset] = useState("custom");
  const [selectedLayout, setSelectedLayout] = useState("grid");
  const [activeWidgets, setActiveWidgets] = useState([
    "membership_growth",
    "financial_overview",
    "branch_comparison",
    "volunteer_participation",
  ]);
  const [availableWidgets, setAvailableWidgets] = useState(
    WIDGET_TYPES.filter((widget) => !activeWidgets.includes(widget.id)),
  );
  const [selectedRole, setSelectedRole] = useState("admin");
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  // Handle preset selection
  useEffect(() => {
    if (selectedPreset !== "custom") {
      const preset = DASHBOARD_PRESETS.find((p) => p.id === selectedPreset);
      if (preset) {
        setActiveWidgets([...preset.widgets]);
        setAvailableWidgets(
          WIDGET_TYPES.filter((widget) => !preset.widgets.includes(widget.id)),
        );
      }
    }
  }, [selectedPreset]);

  // Add widget to dashboard
  const addWidget = (widgetId) => {
    setActiveWidgets([...activeWidgets, widgetId]);
    setAvailableWidgets(availableWidgets.filter((w) => w.id !== widgetId));
    setSelectedPreset("custom");
  };

  // Remove widget from dashboard
  const removeWidget = (widgetId) => {
    const widget = WIDGET_TYPES.find((w) => w.id === widgetId);
    setActiveWidgets(activeWidgets.filter((id) => id !== widgetId));
    if (widget) {
      setAvailableWidgets([...availableWidgets, widget]);
    }
    setSelectedPreset("custom");
  };

  // Save dashboard settings
  const saveDashboard = () => {
    // In a real app, this would save to backend
    setSavedSuccessfully(true);
    setTimeout(() => {
      setSavedSuccessfully(false);
    }, 3000);
  };

  // Get widget name by ID
  const getWidgetName = (widgetId) => {
    const widget = WIDGET_TYPES.find((w) => w.id === widgetId);
    return widget ? widget.name : widgetId;
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/analytics" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Customize your analytics dashboard view
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0">
          <Button
            onClick={saveDashboard}
            color="indigo"
            className="flex items-center"
          >
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Save Settings
          </Button>

          {savedSuccessfully && (
            <div className="mt-2 text-sm text-green-600 flex items-center justify-end">
              <CheckIcon className="h-4 w-4 mr-1" />
              <span>Settings saved successfully!</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Dashboard Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <Title>Configuration</Title>

            <div className="mt-4 space-y-6">
              <div>
                <Text className="mb-2">Dashboard Preset</Text>
                <Select
                  value={selectedPreset}
                  onValueChange={setSelectedPreset}
                >
                  <SelectItem value="custom">Custom Dashboard</SelectItem>
                  {DASHBOARD_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <Text className="mb-2">Layout Style</Text>
                <Select
                  value={selectedLayout}
                  onValueChange={setSelectedLayout}
                >
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="list">List Layout</SelectItem>
                  <SelectItem value="cards">Card Layout</SelectItem>
                </Select>
              </div>

              <div>
                <Text className="mb-2">Access Role</Text>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </Select>
                <Text className="text-xs text-gray-500 mt-1">
                  This determines which data you can see across branches
                </Text>
              </div>

              <div>
                <Text className="mb-2">Add Widgets</Text>
                <div className="max-h-64 overflow-auto border border-gray-200 rounded-md divide-y">
                  {availableWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="p-3 flex justify-between items-center hover:bg-gray-50"
                    >
                      <div>
                        <Text className="font-medium">{widget.name}</Text>
                        <Text className="text-xs text-gray-500">
                          Category: {widget.category}
                        </Text>
                      </div>
                      <button
                        onClick={() => addWidget(widget.id)}
                        className="p-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  {availableWidgets.length === 0 && (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      All available widgets have been added
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <Title>Branch Data Filtering</Title>
            <div className="mt-4">
              <Text className="mb-2">Default Branch View</Text>
              <Select defaultValue="all">
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="main">Main Campus</SelectItem>
                <SelectItem value="east">East Side</SelectItem>
                <SelectItem value="west">West End</SelectItem>
                <SelectItem value="south">South Chapel</SelectItem>
              </Select>

              <div className="mt-4">
                <Text className="mb-2">Data Access Level</Text>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="all-access"
                      name="access-level"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label
                      htmlFor="all-access"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Full organization data
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="branch-access"
                      name="access-level"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label
                      htmlFor="branch-access"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Home branch + aggregate data
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="limited-access"
                      name="access-level"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label
                      htmlFor="limited-access"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Home branch only
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Dashboard Preview */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center">
              <Title>Dashboard Preview</Title>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ArrowsUpDownIcon className="h-4 w-4" />
                <span>Drag to rearrange</span>
              </div>
            </div>

            <div className="mt-6">
              {activeWidgets.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-md">
                  <Cog6ToothIcon className="h-12 w-12 text-gray-400" />
                  <Text className="mt-2 text-gray-500">
                    No widgets selected
                  </Text>
                  <Text className="text-sm text-gray-400">
                    Add widgets from the configuration panel
                  </Text>
                </div>
              ) : (
                <div
                  className={`grid ${selectedLayout === "list" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-4`}
                >
                  {activeWidgets.map((widgetId) => (
                    <div
                      key={widgetId}
                      className={`bg-gray-50 border border-gray-200 rounded-md p-4 ${
                        widgetId === "membership_growth" ||
                        widgetId === "financial_overview"
                          ? "lg:col-span-2"
                          : ""
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <Text className="font-medium">
                          {getWidgetName(widgetId)}
                        </Text>
                        <button
                          onClick={() => removeWidget(widgetId)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <XMarkIcon className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <div className="h-32 flex items-center justify-center border border-dashed border-gray-300 rounded bg-white">
                        <Text className="text-sm text-gray-400">
                          Widget Preview
                        </Text>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Dashboard Sharing */}
          <Card className="mt-6">
            <Title>Dashboard Sharing</Title>
            <Text className="mt-2 text-gray-600">
              Share your dashboard configuration with other staff members
            </Text>

            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="share-with"
                  className="block text-sm font-medium text-gray-700"
                >
                  Share with Role
                </label>
                <Select defaultValue="branch_admin">
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label
                  htmlFor="share-branches"
                  className="block text-sm font-medium text-gray-700"
                >
                  Target Branches
                </label>
                <Select defaultValue="all">
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="main">Main Campus</SelectItem>
                  <SelectItem value="east">East Side</SelectItem>
                  <SelectItem value="west">West End</SelectItem>
                  <SelectItem value="south">South Chapel</SelectItem>
                </Select>
              </div>

              <Button color="indigo" variant="secondary" className="w-full">
                Share Dashboard Configuration
              </Button>
            </div>
          </Card>

          {/* Save & Export */}
          <div className="mt-6 flex justify-end space-x-4">
            <Button color="gray" variant="secondary">
              Reset to Default
            </Button>
            <Button color="indigo" onClick={saveDashboard}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
