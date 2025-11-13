"use client";

import React from "react";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

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

interface SchedulingSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function SchedulingSection({
  formData,
  setFormData,
}: SchedulingSectionProps) {
  const formatDateTimeLocal = (date?: Date): string => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (
    value: string,
    field: "scheduledFor" | "expiresAt"
  ) => {
    if (!value) {
      setFormData({ ...formData, [field]: undefined });
      return;
    }
    const date = new Date(value);
    setFormData({ ...formData, [field]: date });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Scheduling & Expiration</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Schedule For */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Schedule For (Optional)
            </div>
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.scheduledFor)}
            onChange={(e) => handleDateTimeChange(e.target.value, "scheduledFor")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <p className="text-gray-500 text-xs mt-1">
            Leave empty to publish immediately
          </p>
        </div>

        {/* Expires At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              Expires At (Optional)
            </div>
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeLocal(formData.expiresAt)}
            onChange={(e) => handleDateTimeChange(e.target.value, "expiresAt")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <p className="text-gray-500 text-xs mt-1">
            Leave empty for no expiration
          </p>
        </div>
      </div>

      {/* Schedule Summary */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        {formData.scheduledFor ? (
          <p>
            <span className="font-semibold">Scheduled:</span> Will be published on{" "}
            {new Date(formData.scheduledFor).toLocaleString()}
          </p>
        ) : (
          <p>
            <span className="font-semibold">Publish:</span> Immediately upon creation
          </p>
        )}
        {formData.expiresAt && (
          <p className="mt-1">
            <span className="font-semibold">Expires:</span>{" "}
            {new Date(formData.expiresAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
