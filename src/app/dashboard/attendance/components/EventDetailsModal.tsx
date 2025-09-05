import React from "react";
import { format } from "date-fns";
import {
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  date?: Date; // For transformed items from attendance page
  location?: string;
  category?: string;
  attendanceRecords?: { id: string }[];
  attendanceCount?: number; // For transformed items from attendance page
}

interface EventDetailsModalProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export default function EventDetailsModal({
  event,
  isOpen,
  onClose,
}: EventDetailsModalProps) {
  if (!isOpen) return null;

  // Use pre-calculated attendanceCount if available, otherwise calculate from attendanceRecords
  const attendanceCount =
    event.attendanceCount ?? event.attendanceRecords?.length ?? 0;

  // Helper function to safely parse and format dates
  const formatEventDate = (
    dateValue: string | Date | undefined,
    formatStr: string,
  ) => {
    try {
      if (!dateValue) return "No date";

      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return format(date, formatStr);
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get the primary date - prefer startDate, fallback to date
  const primaryDate = event.startDate || event.date;
  const endDate = event.endDate;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full max-w-2xl relative overflow-hidden mx-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-blue-50/20 to-indigo-50/30"></div>

        <div className="relative flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {event.title}
              </h2>
              {event.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                  {event.category}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date and Time */}
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatEventDate(primaryDate, "EEEE, MMMM d, yyyy")}
                </span>
                <span className="text-xs text-gray-500">
                  {formatEventDate(primaryDate, "h:mm a")}
                  {endDate && ` - ${formatEventDate(endDate, "h:mm a")}`}
                </span>
              </div>
            </div>

            {/* Location */}
            {event.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 mr-3 text-emerald-500 flex-shrink-0" />
                <span className="font-medium">{event.location}</span>
              </div>
            )}

            {/* Attendance Count */}
            <div className="flex items-center text-sm text-gray-600">
              <UserGroupIcon className="h-4 w-4 mr-3 text-indigo-500 flex-shrink-0" />
              <span className="font-medium">
                {attendanceCount}{" "}
                {attendanceCount === 1 ? "attendee" : "attendees"}
              </span>
            </div>

            {/* Description */}
            {event.description && (
              <div className="flex items-start text-sm text-gray-600 mt-4">
                <DocumentTextIcon className="h-4 w-4 mr-3 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <a
              href={`/dashboard/attendance/take?eventId=${event.id}`}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Take Attendance
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
