"use client";

import { useState } from "react";
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
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Schedule Delivery</h3>
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
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="scheduled-date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="date"
                id="scheduled-date"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={scheduledDate}
                onChange={(e) => onChangeScheduledDate(e.target.value)}
                min={today}
                required={scheduled}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="scheduled-time" className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="time"
                id="scheduled-time"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={scheduledTime}
                onChange={(e) => onChangeScheduledTime(e.target.value)}
                required={scheduled}
              />
            </div>
          </div>
        </div>
      )}
      
      {scheduled && (
        <p className="mt-2 text-xs text-gray-500">
          Your message will be sent on {scheduledDate} at {scheduledTime} local time.
        </p>
      )}
    </div>
  );
}
