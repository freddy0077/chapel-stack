"use client";

import { useState, useEffect } from "react";
import { Card, Title, Text, Button, Badge } from "@tremor/react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  loadModulePreferences,
  saveModulePreferences,
  resetModulePreferences,
  ChurchProfile,
} from "@/components/onboarding/ModulePreferences";
import ModuleSelection from "@/components/onboarding/ModuleSelection";

export default function ModuleSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [churchProfile, setChurchProfile] = useState<ChurchProfile | null>(
    null,
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Load existing module preferences
  useEffect(() => {
    const { selectedModules, churchProfile } = loadModulePreferences();
    setSelectedModules(selectedModules);
    setChurchProfile(churchProfile);
    setIsLoading(false);
  }, []);

  // Handle module selection update
  const handleModulesSelected = (modules: string[]) => {
    setSelectedModules(modules);
    // No auto-save or reload; explicit Save button will handle saving
  };

  // Handle reset module preferences
  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all module preferences? This will reset your church profile and require you to go through onboarding again.",
      )
    ) {
      setIsResetting(true);

      // Reset module preferences
      resetModulePreferences();

      // Redirect to onboarding page
      setTimeout(() => {
        window.location.href = "/onboarding";
      }, 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Title className="text-2xl font-bold">Module Settings</Title>
        <Text className="text-gray-600 mt-1">
          Customize which modules and features are available in your church
          management system.
        </Text>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
            <Text className="text-green-700">
              Your module preferences have been saved successfully. The
              navigation menu will update to reflect your changes.
            </Text>
          </div>
        </div>
      )}

      {/* Church Profile Info */}
      {churchProfile && (
        <Card className="mb-6">
          <Title className="text-xl mb-4">Church Profile</Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text className="text-gray-500 text-sm">Church Name</Text>
              <Text className="font-medium">{churchProfile.name}</Text>
            </div>
            <div>
              <Text className="text-gray-500 text-sm">Branches/Locations</Text>
              <Text className="font-medium">
                {churchProfile.branches === 1
                  ? "1 (Single Location)"
                  : churchProfile.branches > 10
                    ? "More than 10 Locations"
                    : `${churchProfile.branches} Locations`}
              </Text>
            </div>
            <div>
              <Text className="text-gray-500 text-sm">Congregation Size</Text>
              <Text className="font-medium">
                {churchProfile.size === "small" && "Small (Under 100 members)"}
                {churchProfile.size === "medium" && "Medium (100-500 members)"}
                {churchProfile.size === "large" && "Large (500-2000 members)"}
                {churchProfile.size === "mega" && "Mega (2000+ members)"}
              </Text>
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <Text className="text-sm text-gray-500">
              To change your church profile information, you&apos;ll need to
              reset your module preferences.
            </Text>
          </div>
        </Card>
      )}

      {/* Module Selection */}
      <div className="mb-6">
        <Card>
          <div className="mb-4 flex justify-between items-center">
            <Title>Active Modules</Title>
            <Badge color="indigo" size="sm">
              {selectedModules.length} Modules Selected
            </Badge>
          </div>

          <div className="mb-2">
            <Text className="text-gray-600">
              Select which modules you want to enable in your church management
              system. Changes will affect which features and menu items are
              available to users.
            </Text>
          </div>

          <div className="mt-6">
            <ModuleSelection
              onModulesSelected={handleModulesSelected}
              initialSelectedModules={selectedModules}
            />
          </div>
          <div className="mt-8 flex items-center gap-4">
            <button
              className={`relative inline-flex items-center px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              disabled={isLoading || isResetting || !churchProfile}
              onClick={async () => {
                if (!churchProfile) return;
                setSaveSuccess(false);
                setIsLoading(true);
                try {
                  await saveModulePreferences(selectedModules, churchProfile);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? (
                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
              ) : saveSuccess ? (
                <CheckIcon className="w-5 h-5 mr-2 text-green-400" />
              ) : null}
              {saveSuccess ? "Saved!" : "Save"}
            </button>
          </div>
        </Card>
      </div>

      {/* Reset Preferences */}
      <div className="border-t pt-6 mt-8">
        <div className="flex justify-between items-center">
          <div>
            <Title className="text-lg">Reset Module Preferences</Title>
            <Text className="text-gray-600 mt-1">
              Reset all module preferences and go through the onboarding process
              again.
            </Text>
          </div>
          <Button
            variant="secondary"
            color="red"
            icon={ArrowPathIcon}
            onClick={handleReset}
            loading={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset All Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}
