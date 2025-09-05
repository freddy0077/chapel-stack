"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarDaysIcon,
  HeartIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { MemorialDate } from "../../types/deathRegister";

interface MemorialCalendarViewProps {
  upcomingMemorials: MemorialDate[];
  loading: boolean;
  year?: number;
  onYearChange?: (year: number) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  memorials: MemorialDate[];
}

const MemorialCalendarView: React.FC<MemorialCalendarViewProps> = ({
  upcomingMemorials,
  loading,
  year = new Date().getFullYear(),
  onYearChange,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedMemorial, setSelectedMemorial] = useState<MemorialDate | null>(
    null,
  );

  // Generate calendar days for the selected month
  const calendarDays = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map((date) => {
      const dayMemorials = (upcomingMemorials || []).filter((memorial) =>
        isSameDay(new Date(memorial.dateOfDeath), date),
      );

      return {
        date,
        isCurrentMonth: isSameMonth(date, selectedMonth),
        isToday: isToday(date),
        memorials: dayMemorials,
      };
    });
  }, [selectedMonth, upcomingMemorials]);

  // Get upcoming memorials for the next 30 days
  const upcomingAnniversaries = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    return (upcomingMemorials || [])
      .filter((memorial) => {
        const memorialDate = new Date(memorial.dateOfDeath);
        return memorialDate >= today && memorialDate <= thirtyDaysFromNow;
      })
      .sort(
        (a, b) =>
          new Date(a.dateOfDeath).getTime() - new Date(b.dateOfDeath).getTime(),
      )
      .slice(0, 5);
  }, [upcomingMemorials]);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => addMonths(prev, 1));
  };

  const handleYearChange = (newYear: number) => {
    setSelectedMonth((prev) => new Date(newYear, prev.getMonth(), 1));
    onYearChange?.(newYear);
  };

  const getMemorialColor = (yearsAgo: number) => {
    if (yearsAgo <= 1) return "bg-red-100 border-red-300 text-red-800";
    if (yearsAgo <= 5) return "bg-orange-100 border-orange-300 text-orange-800";
    if (yearsAgo <= 10)
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-purple-100 border-purple-300 text-purple-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading memorial calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Year Selection */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <HeartSolidIcon className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-purple-900">
                Memorial Calendar
              </h2>
              <p className="text-purple-700">
                Honoring the memory of our departed members
              </p>
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleYearChange(year - 1)}
              className="p-2 rounded-lg bg-white border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 text-purple-600" />
            </button>
            <span className="px-4 py-2 bg-white rounded-lg border border-purple-200 font-semibold text-purple-900">
              {year}
            </span>
            <button
              onClick={() => handleYearChange(year + 1)}
              className="p-2 rounded-lg bg-white border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              <ChevronRightIcon className="h-4 w-4 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Memorial Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <HeartIcon className="h-6 w-6 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Total Memorials</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(upcomingMemorials || []).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <ClockIcon className="h-6 w-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    (upcomingMemorials || []).filter((m) =>
                      isSameMonth(new Date(m.dateOfDeath), selectedMonth),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <CalendarDaysIcon className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Next 30 Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingAnniversaries.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
              </button>

              <h3 className="text-lg font-semibold text-gray-900">
                {format(selectedMonth, "MMMM yyyy")}
              </h3>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-gray-500"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      relative p-2 min-h-[60px] border border-gray-100 rounded-lg cursor-pointer
                      transition-colors hover:bg-gray-50
                      ${day.isToday ? "bg-blue-50 border-blue-200" : ""}
                      ${!day.isCurrentMonth ? "opacity-50" : ""}
                    `}
                    onClick={() => {
                      if (day.memorials.length > 0) {
                        setSelectedMemorial(day.memorials[0]);
                      }
                    }}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {format(day.date, "d")}
                    </div>

                    {/* Memorial Indicators */}
                    {day.memorials.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="flex flex-wrap gap-1">
                          {day.memorials.slice(0, 3).map((memorial, idx) => (
                            <div
                              key={idx}
                              className={`
                                w-2 h-2 rounded-full
                                ${getMemorialColor(memorial.yearsAgo).split(" ")[0]}
                              `}
                              title={`${memorial.memberName} - ${memorial.yearsAgo} years ago`}
                            />
                          ))}
                          {day.memorials.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{day.memorials.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Anniversaries Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Anniversaries */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ClockIcon className="h-5 w-5 text-orange-500 mr-2" />
                Upcoming Anniversaries
              </h3>
            </div>

            <div className="p-4">
              {upcomingAnniversaries.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAnniversaries.map((memorial, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedMemorial(memorial)}
                    >
                      {memorial.photoUrl ? (
                        <img
                          src={memorial.photoUrl}
                          alt={memorial.memberName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {memorial.memberName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(memorial.dateOfDeath), "MMM d")} •{" "}
                          {memorial.yearsAgo} years ago
                        </p>
                      </div>

                      <div
                        className={`
                        px-2 py-1 rounded-full text-xs font-medium border
                        ${getMemorialColor(memorial.yearsAgo)}
                      `}
                      >
                        {memorial.yearsAgo}y
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CalendarDaysIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No upcoming anniversaries
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Memorial Legend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Memorial Legend
              </h3>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-100 border border-red-300"></div>
                <span className="text-sm text-gray-700">Recent (≤1 year)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-orange-100 border border-orange-300"></div>
                <span className="text-sm text-gray-700">2-5 years ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-300"></div>
                <span className="text-sm text-gray-700">6-10 years ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-100 border border-purple-300"></div>
                <span className="text-sm text-gray-700">10+ years ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memorial Detail Modal */}
      {selectedMemorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Memorial Details
                </h3>
                <button
                  onClick={() => setSelectedMemorial(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="text-center">
                {selectedMemorial.photoUrl ? (
                  <img
                    src={selectedMemorial.photoUrl}
                    alt={selectedMemorial.memberName}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="h-10 w-10 text-gray-500" />
                  </div>
                )}

                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedMemorial.memberName}
                </h4>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Date of Passing:</span>{" "}
                    {format(
                      new Date(selectedMemorial.dateOfDeath),
                      "MMMM d, yyyy",
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Years Since:</span>{" "}
                    {selectedMemorial.yearsAgo} years
                  </p>
                </div>

                <div
                  className={`
                  inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-4
                  ${getMemorialColor(selectedMemorial.yearsAgo)}
                `}
                >
                  <HeartIcon className="h-4 w-4 mr-1" />
                  Memorial Anniversary
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemorialCalendarView;
