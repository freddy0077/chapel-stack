"use client";

import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";

interface MessageSchedulerProps {
  scheduled: boolean;
  scheduledDate: string;
  scheduledTime: string;
  onToggleSchedule: (scheduled: boolean) => void;
  onChangeScheduledDate: (date: string) => void;
  onChangeScheduledTime: (time: string) => void;
}

export default function MessageScheduler({
  scheduled,
  scheduledDate,
  scheduledTime,
  onToggleSchedule,
  onChangeScheduledDate,
  onChangeScheduledTime
}: MessageSchedulerProps) {
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <label htmlFor="schedule-toggle" className="text-sm font-medium text-gray-900">
            Schedule Delivery
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="schedule-toggle"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={scheduled}
            onChange={(e) => onToggleSchedule(e.target.checked)}
          />
          <label htmlFor="schedule-toggle" className="ml-2 text-sm text-gray-600">
            Send later
          </label>
        </div>
      </div>
      
      {scheduled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-gray-50 p-4 rounded-md border border-gray-100">
          <div className="space-y-2">
            <label htmlFor="scheduled-date" className="block text-sm text-gray-600 flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              Date
            </label>
            <div className="relative">
              <input
                id="scheduled-date"
                type="date"
                min={today}
                value={scheduledDate}
                onChange={(e) => onChangeScheduledDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required={scheduled}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="scheduled-time" className="block text-sm text-gray-600 flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              Time
            </label>
            <div className="relative">
              <input
                id="scheduled-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => onChangeScheduledTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required={scheduled}
              />
            </div>
          </div>
          
          {scheduledDate && scheduledTime && (
            <div className="col-span-1 sm:col-span-2 text-sm text-gray-600 flex items-center gap-2 mt-1">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span>
                Message will be sent on {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} at {scheduledTime}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
