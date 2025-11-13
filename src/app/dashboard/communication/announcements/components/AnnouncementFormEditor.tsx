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

interface AnnouncementFormEditorProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, string>;
}

export default function AnnouncementFormEditor({
  formData,
  setFormData,
  errors,
}: AnnouncementFormEditorProps) {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter announcement title"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Enter announcement content (supports HTML)"
          rows={12}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm ${
            errors.content ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          💡 Tip: You can use HTML tags for formatting. Basic tags like &lt;b&gt;,
          &lt;i&gt;, &lt;p&gt;, &lt;br&gt;, &lt;a&gt;, &lt;img&gt; are supported.
        </p>
      </div>

      {/* Content Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preview
        </label>
        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.content || "<p className='text-gray-500'>No content yet</p>" }}
          />
        </div>
      </div>
    </div>
  );
}
