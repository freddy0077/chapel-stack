"use client";

import Image from "next/image";

import { AnnouncementsWidget as AnnouncementsWidgetType } from "@/hooks/useDashboardData";

interface AnnouncementsWidgetProps {
  widget: AnnouncementsWidgetType;
}

export default function AnnouncementsWidget({
  widget,
}: AnnouncementsWidgetProps) {
  if (!widget || !widget.announcements || widget.announcements.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">
          {widget.title || "Announcements"}
        </h3>
      </div>
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {widget.announcements.map((announcement) => (
            <li key={announcement.id} className="py-4">
              <div className="flex space-x-3">
                {announcement.imageUrl ? (
                  <div className="flex-shrink-0">
                    <Image
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {announcement.title}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="mt-1 flex items-center">
                    {announcement.author && (
                      <span className="text-xs text-gray-500 mr-2">
                        by {announcement.author}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(announcement.date).toLocaleDateString()}
                    </span>
                    {announcement.priority && announcement.priority > 1 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Priority
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {widget.announcements.length > 3 && (
          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all announcements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
