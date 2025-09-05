"use client";

import { useState } from "react";
import {
  CalendarDaysIcon,
  EnvelopeIcon,
  BellIcon,
  BellSlashIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useUpcomingSacramentAnniversaries } from "@/graphql/hooks/useUpcomingSacramentAnniversaries";
import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";

interface Anniversary {
  id: string;
  type: "Baptism" | "FirstCommunion" | "Confirmation" | "Marriage";
  memberId: string;
  memberName: string;
  spouse2Id?: string;
  spouse2Name?: string;
  eventDate: string;
  originalDate: string;
  years: number;
  notificationSent: boolean;
  notificationDate?: string;
  notificationType: "Email" | "SMS" | "Both" | "None";
  specialMilestone: boolean;
}

export function AnniversaryTracker() {
  const [filter, setFilter] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<string>("upcoming");
  const [showSettings, setShowSettings] = useState(false);

  // Get branchId for filtering
  const { branchId } = useOrganizationBranchFilter();
  // Fetch real anniversaries from backend
  const { anniversaries, loading, error } = useUpcomingSacramentAnniversaries(
    undefined,
    branchId,
  );

  // Transform backend data to Anniversary UI shape (add missing fields as needed)
  const mappedAnniversaries = anniversaries.map((a, idx) => ({
    id: `ann-${idx}`,
    type: a.sacramentType,
    memberId: "", // Not available from backend, so left blank
    memberName: a.name,
    spouse2Id: undefined,
    spouse2Name: undefined,
    eventDate: a.date,
    originalDate: a.date, // No original date from backend, fallback to event date
    years: parseInt(a.anniversaryType), // Try to extract years from anniversaryType string if possible
    notificationSent: false,
    notificationDate: undefined,
    notificationType: "None",
    specialMilestone: a.isSpecial,
  }));

  // Use mappedAnniversaries for filtering/sorting
  const filteredAnniversaries = mappedAnniversaries
    .filter((anniversary) => {
      if (
        filter !== "all" &&
        anniversary.type.toLowerCase() !== filter.toLowerCase()
      ) {
        return false;
      }
      const today = new Date();
      const eventDate = new Date(anniversary.eventDate);
      const daysDifference = Math.floor(
        (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (timeframe === "upcoming" && daysDifference > 90) {
        return false;
      } else if (
        timeframe === "thisMonth" &&
        (daysDifference < 0 || daysDifference > 30)
      ) {
        return false;
      } else if (
        timeframe === "nextMonth" &&
        (daysDifference < 30 || daysDifference > 60)
      ) {
        return false;
      } else if (timeframe === "past" && daysDifference >= 0) {
        return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
    );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const daysDifference = Math.floor(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDifference < 0) {
      return `${Math.abs(daysDifference)} days ago`;
    } else if (daysDifference === 0) {
      return "Today!";
    } else if (daysDifference === 1) {
      return "Tomorrow";
    } else {
      return `In ${daysDifference} days`;
    }
  };

  const toggleNotification = (id: string) => {
    // No-op for now, as notification state is not persisted in backend
  };

  const sendAllNotifications = () => {
    // No-op for now, as notification state is not persisted in backend
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        Loading anniversaries...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center py-4">
        Failed to load anniversaries.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-lg font-medium text-gray-900">
          Anniversary Tracker
        </h2>
        <div className="flex flex-wrap gap-2">
          <select
            id="filter"
            name="filter"
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Sacraments</option>
            <option value="baptism">Baptism Only</option>
            <option value="firstcommunion">First Communion Only</option>
            <option value="confirmation">Confirmation Only</option>
            <option value="marriage">Marriage Only</option>
          </select>
          <select
            id="timeframe"
            name="timeframe"
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="upcoming">Next 90 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="nextMonth">Next Month</option>
            <option value="past">Past Anniversaries</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setShowSettings(!showSettings)}
          >
            <ChevronDownIcon
              className="-ml-0.5 mr-1.5 h-5 w-5"
              aria-hidden="true"
            />
            Settings
          </button>
        </div>
      </div>
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Notification Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="notifyDays"
                className="block text-sm font-medium text-gray-700"
              >
                Send notifications before (days)
              </label>
              <select
                id="notifyDays"
                name="notifyDays"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                defaultValue="14"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {filteredAnniversaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No anniversaries found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No anniversaries match your current filter and timeframe settings.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setTimeframe("upcoming");
              }}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <ArrowPathIcon
                className="-ml-0.5 mr-1.5 h-5 w-5"
                aria-hidden="true"
              />
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {filteredAnniversaries.map((anniversary) => (
            <div
              key={anniversary.id}
              className={`p-6 hover:bg-gray-50 ${anniversary.specialMilestone ? "bg-yellow-50" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {anniversary.memberName}
                    </h3>
                    {anniversary.specialMilestone && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        <GiftIcon className="-ml-0.5 mr-1 h-4 w-4" />
                        Special
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">
                      {anniversary.type} Anniversary:
                    </span>
                    {formatDate(anniversary.eventDate)} (
                    {getDaysUntil(anniversary.eventDate)})
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="mr-4 text-sm">
                      Notification:
                      <span
                        className={`ml-1 font-medium ${anniversary.notificationType === "None" ? "text-gray-400" : "text-gray-900"}`}
                      >
                        {anniversary.notificationType}
                      </span>
                    </div>
                    <span className="inline-flex items-center text-xs text-gray-500">
                      <BellSlashIcon className="mr-1 h-4 w-4" />
                      Not sent yet
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    type="button"
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500`}
                    onClick={() => toggleNotification(anniversary.id)}
                    disabled={true}
                  >
                    <EnvelopeIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5"
                      aria-hidden="true"
                    />
                    Send Notification
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
