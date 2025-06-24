"use client";

import { useState } from "react";
import { LinkIcon } from "@heroicons/react/24/outline";

// Mock notification templates
const notificationTemplates = [
  { id: 1, name: "New Announcement", title: "New Announcement", content: "There's a new announcement from the church leadership. Please check the announcements section.", link: "/dashboard/announcements" },
  { id: 2, name: "Event Reminder", title: "Event Reminder", content: "Don't forget about the upcoming event: [Event Name]", link: "/dashboard/events" },
  { id: 3, name: "Prayer Request", title: "Prayer Request", content: "A new prayer request has been submitted that needs your attention.", link: "/dashboard/prayer-requests" },
];

interface NotificationEditorProps {
  title: string;
  content: string;
  link: string;
  onChangeTitle: (title: string) => void;
  onChangeContent: (content: string) => void;
  onChangeLink: (link: string) => void;
}

export default function NotificationEditor({ 
  title, 
  content, 
  link,
  onChangeTitle,
  onChangeContent,
  onChangeLink
}: NotificationEditorProps) {
  
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = parseInt(e.target.value);
    if (templateId) {
      const template = notificationTemplates.find(t => t.id === templateId);
      if (template) {
        onChangeTitle(template.title);
        onChangeContent(template.content);
        onChangeLink(template.link);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Template selector */}
      <div>
        <label htmlFor="notification-template" className="block text-sm font-medium text-gray-700">
          Notification Template
        </label>
        <select
          id="notification-template"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          onChange={handleTemplateSelect}
          defaultValue=""
        >
          <option value="">Select a template</option>
          {notificationTemplates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Notification title */}
      <div>
        <label htmlFor="notification-title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="notification-title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Notification title"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          required
        />
      </div>
      
      {/* Notification content */}
      <div>
        <label htmlFor="notification-content" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="notification-content"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[100px]"
          placeholder="Type your notification message here..."
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          required
        />
      </div>
      
      {/* Notification link */}
      <div>
        <label htmlFor="notification-link" className="block text-sm font-medium text-gray-700">
          Link (Optional)
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
            <LinkIcon className="h-4 w-4" />
          </span>
          <input
            type="text"
            id="notification-link"
            className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="/dashboard/page or https://example.com"
            value={link}
            onChange={(e) => onChangeLink(e.target.value)}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Add a link to direct users when they click the notification
        </p>
      </div>
    </div>
  );
}
