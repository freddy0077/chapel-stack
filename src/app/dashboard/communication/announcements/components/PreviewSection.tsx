"use client";

import React from "react";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

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

interface PreviewSectionProps {
  formData: FormData;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-blue-100 text-blue-700";
    case "LOW":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function PreviewSection({ formData }: PreviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Email Preview */}
      {formData.sendEmail && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Email Preview</span>
          </div>
          <div className="bg-white p-6">
            <div className="max-w-2xl mx-auto">
              {/* Email Header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.title || "Announcement Title"}
                </h2>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      formData.priority
                    )}`}
                  >
                    {formData.priority}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formData.category}
                  </span>
                </div>
              </div>

              {/* Email Image */}
              {formData.imageUrl && (
                <div className="mb-6">
                  <img
                    src={formData.imageUrl}
                    alt="Announcement"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}

              {/* Email Content */}
              <div className="mb-6 prose prose-sm max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content ||
                      "<p className='text-gray-500'>No content</p>",
                  }}
                />
              </div>

              {/* Email Footer */}
              <div className="pt-6 border-t border-gray-200 text-center text-xs text-gray-600">
                <p>This is a preview of how your announcement will appear in email</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Preview */}
      {formData.sendPush && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300 flex items-center gap-2">
            <EnvelopeIcon className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">
              Push Notification Preview
            </span>
          </div>
          <div className="bg-white p-6">
            <div className="max-w-sm mx-auto">
              {/* Mobile Phone Frame */}
              <div className="bg-black rounded-3xl p-3 shadow-lg">
                <div className="bg-gray-900 rounded-2xl p-4 text-white">
                  {/* Status Bar */}
                  <div className="text-xs mb-4 flex justify-between">
                    <span>9:41</span>
                    <span>📶 📡 🔋</span>
                  </div>

                  {/* Notification */}
                  <div className="bg-gray-800 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <EnvelopeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {formData.title || "Announcement"}
                        </p>
                        <p className="text-xs text-gray-300 line-clamp-2">
                          {formData.content.replace(/<[^>]*>/g, "") ||
                            "No content"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Other Notifications */}
                  <div className="text-xs text-gray-500 text-center">
                    2 more notifications
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notice Board Preview */}
      {formData.displayOnBoard && (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <span className="font-semibold text-gray-900">
              Notice Board Preview
            </span>
          </div>
          <div className="bg-white p-6">
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg p-6 border border-violet-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {formData.title || "Announcement Title"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.category}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    formData.priority
                  )}`}
                >
                  {formData.priority}
                </span>
              </div>

              {formData.imageUrl && (
                <div className="mb-4">
                  <img
                    src={formData.imageUrl}
                    alt="Announcement"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none mb-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.content ||
                      "<p className='text-gray-500'>No content</p>",
                  }}
                />
              </div>

              <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                Read More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-3">Settings Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-700">
              <span className="font-semibold">Target:</span>{" "}
              {formData.targetAudience === "ALL"
                ? "All members"
                : formData.targetAudience === "STAFF_ONLY"
                  ? "Staff only"
                  : `${formData.targetGroupIds.length} group(s)`}
            </p>
          </div>
          <div>
            <p className="text-blue-700">
              <span className="font-semibold">Distribution:</span>{" "}
              {[
                formData.sendEmail && "Email",
                formData.sendPush && "Push",
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
          <div>
            <p className="text-blue-700">
              <span className="font-semibold">Display:</span>{" "}
              {[
                formData.displayOnBoard && "Notice Board",
                formData.displayOnDashboard && "Dashboard",
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
          <div>
            <p className="text-blue-700">
              <span className="font-semibold">Schedule:</span>{" "}
              {formData.scheduledFor
                ? new Date(formData.scheduledFor).toLocaleDateString()
                : "Immediate"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
