"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  BellIcon,
  CalendarDaysIcon,
  UserIcon,
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { toast } from "react-hot-toast";

interface Anniversary {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberPhone?: string;
  sacramentType: string;
  originalDate: string;
  anniversaryDate: string;
  yearsAgo: number;
  notificationSent: boolean;
  notificationScheduled: boolean;
}

interface AnniversaryNotificationsProps {
  className?: string;
}

const getSacramentIcon = (type: string) => {
  switch (type) {
    case "BAPTISM":
      return SparklesIcon;
    case "EUCHARIST_FIRST_COMMUNION":
      return GiftIcon;
    case "CONFIRMATION":
      return HeartIcon;
    case "MARRIAGE":
      return UserGroupIcon;
    default:
      return SparklesIcon;
  }
};

const getSacramentColor = (type: string) => {
  switch (type) {
    case "BAPTISM":
      return "blue";
    case "EUCHARIST_FIRST_COMMUNION":
      return "amber";
    case "CONFIRMATION":
      return "purple";
    case "MARRIAGE":
      return "rose";
    default:
      return "blue";
  }
};

const formatSacramentType = (type: string) => {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const getOrdinalSuffix = (num: number) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return num + "st";
  if (j === 2 && k !== 12) return num + "nd";
  if (j === 3 && k !== 13) return num + "rd";
  return num + "th";
};

// Mock data for demonstration
const mockAnniversaries: Anniversary[] = [
  {
    id: "1",
    memberId: "M001",
    memberName: "John Smith",
    memberEmail: "john.smith@email.com",
    memberPhone: "+233123456789",
    sacramentType: "BAPTISM",
    originalDate: "2019-03-15",
    anniversaryDate: "2024-03-15",
    yearsAgo: 5,
    notificationSent: false,
    notificationScheduled: true,
  },
  {
    id: "2",
    memberId: "M002",
    memberName: "Mary Johnson",
    memberEmail: "mary.johnson@email.com",
    sacramentType: "MARRIAGE",
    originalDate: "2014-06-20",
    anniversaryDate: "2024-06-20",
    yearsAgo: 10,
    notificationSent: true,
    notificationScheduled: true,
  },
  {
    id: "3",
    memberId: "M003",
    memberName: "David Wilson",
    memberPhone: "+233987654321",
    sacramentType: "CONFIRMATION",
    originalDate: "2021-04-10",
    anniversaryDate: "2024-04-10",
    yearsAgo: 3,
    notificationSent: false,
    notificationScheduled: false,
  },
];

export default function AnniversaryNotifications({
  className = "",
}: AnniversaryNotificationsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("upcoming");
  const [anniversaries, setAnniversaries] =
    useState<Anniversary[]>(mockAnniversaries);
  const [isScheduling, setIsScheduling] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<string | null>(null);

  const { organisationId, branchId } = useOrganisationBranch();

  // In a real implementation, this would fetch from GraphQL
  const loading = false;
  const error = null;

  const filteredAnniversaries = anniversaries.filter((anniversary) => {
    const today = new Date();
    const anniversaryDate = new Date(anniversary.anniversaryDate);
    const daysDiff = Math.ceil(
      (anniversaryDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );

    switch (selectedPeriod) {
      case "upcoming":
        return daysDiff >= 0 && daysDiff <= 30;
      case "this_week":
        return daysDiff >= 0 && daysDiff <= 7;
      case "this_month":
        return daysDiff >= 0 && daysDiff <= 30;
      case "overdue":
        return daysDiff < 0 && !anniversary.notificationSent;
      case "sent":
        return anniversary.notificationSent;
      default:
        return true;
    }
  });

  const handleScheduleNotification = async (anniversaryId: string) => {
    setIsScheduling(anniversaryId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAnniversaries((prev) =>
        prev.map((ann) =>
          ann.id === anniversaryId
            ? { ...ann, notificationScheduled: true }
            : ann,
        ),
      );

      toast.success("Notification scheduled successfully");
    } catch (error) {
      toast.error("Failed to schedule notification");
    } finally {
      setIsScheduling(null);
    }
  };

  const handleSendNotification = async (
    anniversaryId: string,
    method: "email" | "sms",
  ) => {
    setIsSending(anniversaryId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAnniversaries((prev) =>
        prev.map((ann) =>
          ann.id === anniversaryId
            ? { ...ann, notificationSent: true, notificationScheduled: true }
            : ann,
        ),
      );

      toast.success(
        `${method === "email" ? "Email" : "SMS"} notification sent successfully`,
      );
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setIsSending(null);
    }
  };

  const handleCancelScheduled = async (anniversaryId: string) => {
    try {
      setAnniversaries((prev) =>
        prev.map((ann) =>
          ann.id === anniversaryId
            ? { ...ann, notificationScheduled: false }
            : ann,
        ),
      );

      toast.success("Scheduled notification cancelled");
    } catch (error) {
      toast.error("Failed to cancel notification");
    }
  };

  const getDaysUntilAnniversary = (anniversaryDate: string) => {
    const today = new Date();
    const anniversary = new Date(anniversaryDate);
    const daysDiff = Math.ceil(
      (anniversary.getTime() - today.getTime()) / (1000 * 3600 * 24),
    );

    if (daysDiff < 0) return `${Math.abs(daysDiff)} days overdue`;
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Tomorrow";
    return `In ${daysDiff} days`;
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
      >
        <div className="text-center py-8">
          <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to Load Notifications
          </h3>
          <p className="text-gray-600">
            Unable to fetch anniversary notifications.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BellIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Anniversary Notifications
              </h2>
              <p className="text-sm text-gray-600">
                Manage sacrament anniversary reminders
              </p>
            </div>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md max-w-xs"
          >
            <option value="upcoming">Upcoming (30 days)</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="overdue">Overdue</option>
            <option value="sent">Sent</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {filteredAnniversaries.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Anniversaries
            </h3>
            <p className="text-gray-600">
              No anniversaries found for the selected period.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnniversaries.map((anniversary) => {
              const Icon = getSacramentIcon(anniversary.sacramentType);
              const color = getSacramentColor(anniversary.sacramentType);
              const isOverdue =
                new Date(anniversary.anniversaryDate) < new Date() &&
                !anniversary.notificationSent;

              return (
                <div
                  key={anniversary.id}
                  className={`border rounded-lg p-4 ${
                    isOverdue
                      ? "border-red-200 bg-red-50"
                      : anniversary.notificationSent
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-full ${
                          color === "blue"
                            ? "bg-blue-100"
                            : color === "amber"
                              ? "bg-amber-100"
                              : color === "purple"
                                ? "bg-purple-100"
                                : "bg-rose-100"
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 ${
                            color === "blue"
                              ? "text-blue-600"
                              : color === "amber"
                                ? "text-amber-600"
                                : color === "purple"
                                  ? "text-purple-600"
                                  : "text-rose-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {anniversary.memberName}
                          </h4>
                          {anniversary.notificationSent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Sent
                            </span>
                          )}
                          {anniversary.notificationScheduled &&
                            !anniversary.notificationSent && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Scheduled
                              </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {getOrdinalSuffix(anniversary.yearsAgo)}{" "}
                          {formatSacramentType(anniversary.sacramentType)}{" "}
                          Anniversary
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <CalendarDaysIcon className="h-4 w-4" />
                            <span>
                              {new Date(
                                anniversary.anniversaryDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <UserIcon className="h-4 w-4" />
                            <span>Member ID: {anniversary.memberId}</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <span
                            className={`text-sm font-medium ${
                              isOverdue ? "text-red-600" : "text-blue-600"
                            }`}
                          >
                            {getDaysUntilAnniversary(
                              anniversary.anniversaryDate,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!anniversary.notificationSent && (
                        <>
                          {anniversary.memberEmail && (
                            <button
                              onClick={() =>
                                handleSendNotification(anniversary.id, "email")
                              }
                              disabled={isSending === anniversary.id}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <EnvelopeIcon className="h-3 w-3 mr-1" />
                              {isSending === anniversary.id
                                ? "Sending..."
                                : "Email"}
                            </button>
                          )}

                          {anniversary.memberPhone && (
                            <button
                              onClick={() =>
                                handleSendNotification(anniversary.id, "sms")
                              }
                              disabled={isSending === anniversary.id}
                              className="inline-flex items-center px-3 py-1.5 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <DevicePhoneMobileIcon className="h-3 w-3 mr-1" />
                              {isSending === anniversary.id
                                ? "Sending..."
                                : "SMS"}
                            </button>
                          )}

                          {!anniversary.notificationScheduled ? (
                            <button
                              onClick={() =>
                                handleScheduleNotification(anniversary.id)
                              }
                              disabled={isScheduling === anniversary.id}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {isScheduling === anniversary.id
                                ? "Scheduling..."
                                : "Schedule"}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleCancelScheduled(anniversary.id)
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100"
                            >
                              <XMarkIcon className="h-3 w-3 mr-1" />
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
