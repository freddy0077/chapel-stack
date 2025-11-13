"use client";

import React from "react";

interface FormData {
  title: string;
  content: string;
  category: string;
  priority: string;
  targetAudience: string;
  targetGroupIds: string[];
  imageUrl?: string;
  attachmentUrl?: string;
  sendEmail: boolean;
  sendPush: boolean;
  displayOnBoard: boolean;
  displayOnDashboard: boolean;
  scheduledFor?: Date;
  expiresAt?: Date;
}

interface TargetingSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

// Mock groups - in real app, fetch from API
const MOCK_GROUPS = [
  { id: "1", name: "Worship Team" },
  { id: "2", name: "Youth Group" },
  { id: "3", name: "Prayer Warriors" },
  { id: "4", name: "Volunteers" },
  { id: "5", name: "Leadership" },
];

const TARGET_AUDIENCES = [
  { value: "ALL", label: "All Members", description: "Send to all members" },
  {
    value: "STAFF_ONLY",
    label: "Staff Only",
    description: "Send to staff members only",
  },
  {
    value: "SPECIFIC_GROUPS",
    label: "Specific Groups",
    description: "Select specific groups to target",
  },
];

export default function TargetingSection({
  formData,
  setFormData,
  errors,
}: TargetingSectionProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Audience Targeting</h3>

      {/* Target Audience Selection */}
      <div className="space-y-3">
        {TARGET_AUDIENCES.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-all"
          >
            <input
              type="radio"
              name="targetAudience"
              value={option.value}
              checked={formData.targetAudience === option.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetAudience: e.target.value,
                  targetGroupIds: [],
                })
              }
              className="w-4 h-4 mt-1 text-violet-500"
            />
            <div>
              <p className="font-medium text-gray-900">{option.label}</p>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Group Selection */}
      {formData.targetAudience === "SPECIFIC_GROUPS" && (
        <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Groups *
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {MOCK_GROUPS.map((group) => (
              <label
                key={group.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.targetGroupIds.includes(group.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({
                        ...formData,
                        targetGroupIds: [...formData.targetGroupIds, group.id],
                      });
                    } else {
                      setFormData({
                        ...formData,
                        targetGroupIds: formData.targetGroupIds.filter(
                          (id) => id !== group.id
                        ),
                      });
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-violet-500"
                />
                <span className="text-sm text-gray-700">{group.name}</span>
              </label>
            ))}
          </div>
          {errors.targetGroups && (
            <p className="text-red-500 text-sm mt-2">{errors.targetGroups}</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Target:</span>{" "}
          {formData.targetAudience === "ALL"
            ? "All members"
            : formData.targetAudience === "STAFF_ONLY"
              ? "Staff members only"
              : `${formData.targetGroupIds.length} group(s) selected`}
        </p>
      </div>
    </div>
  );
}
