"use client";

import React, { useState } from "react";
import {
  BellIcon,
  CalendarDaysIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useFollowUpReminders } from "@/graphql/hooks/usePastoralCare";
import { FollowUpReminder } from "@/graphql/hooks/usePastoralCare";
import CreateReminderForm from "./forms/CreateReminderForm";

interface FollowUpRemindersListProps {
  reminders?: FollowUpReminder[];
  loading?: boolean;
  onCreateReminder?: () => void;
  onUpdateReminder?: (id: string, updates: any) => void;
}

const reminderStatuses = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: ClockIcon,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: ClockIcon,
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircleIcon,
  },
  {
    value: "OVERDUE",
    label: "Overdue",
    color: "bg-red-100 text-red-800",
    icon: ExclamationTriangleIcon,
  },
];

const reminderTypes = [
  { value: "FOLLOW_UP_VISIT", label: "Follow-up Visit" },
  { value: "PHONE_CALL", label: "Phone Call" },
  { value: "EMAIL", label: "Email" },
  { value: "PRAYER_REQUEST", label: "Prayer Request" },
  { value: "COUNSELING_SESSION", label: "Counseling Session" },
  { value: "PASTORAL_VISIT", label: "Pastoral Visit" },
  { value: "OTHER", label: "Other" },
];

export default function FollowUpRemindersList() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [expandedReminders, setExpandedReminders] = useState<Set<string>>(
    new Set(),
  );
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const { followUpReminders, loading, error } = useFollowUpReminders();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "COMPLETED";
  };

  const getStatusInfo = (status: string, dueDate: string) => {
    if (isOverdue(dueDate, status)) {
      return (
        reminderStatuses.find((s) => s.value === "OVERDUE") ||
        reminderStatuses[0]
      );
    }
    return (
      reminderStatuses.find((s) => s.value === status) || reminderStatuses[0]
    );
  };

  const filteredReminders =
    followUpReminders?.filter((reminder) => {
      if (statusFilter && reminder.status !== statusFilter) return false;
      if (typeFilter && reminder.followUpType !== typeFilter) return false;
      return true;
    }) || [];

  const sortedReminders = [...filteredReminders].sort((a, b) => {
    let aValue = a[sortBy as keyof FollowUpReminder];
    let bValue = b[sortBy as keyof FollowUpReminder];

    if (sortBy === "dueDate") {
      aValue = new Date(a.dueDate).getTime();
      bValue = new Date(b.dueDate).getTime();
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });

  const toggleExpanded = (reminderId: string) => {
    const newExpanded = new Set(expandedReminders);
    if (newExpanded.has(reminderId)) {
      newExpanded.delete(reminderId);
    } else {
      newExpanded.add(reminderId);
    }
    setExpandedReminders(newExpanded);
  };

  const handleStatusUpdate = (reminderId: string, newStatus: string) => {
    // TODO: Implement status update
    console.log("Update reminder status:", reminderId, newStatus);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading reminders
            </h3>
            <p className="text-sm text-red-700 mt-1">
              There was an error loading the follow-up reminders. Please try
              again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BellIcon className="h-5 w-5 mr-2 text-indigo-600" />
            Follow-up Reminders
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {sortedReminders.length} reminders
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Statuses</option>
              {reminderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Types</option>
              {reminderTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order as "asc" | "desc");
            }}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="dueDate-asc">Due Date (Earliest)</option>
            <option value="dueDate-desc">Due Date (Latest)</option>
            <option value="createdAt-desc">Created (Newest)</option>
            <option value="createdAt-asc">Created (Oldest)</option>
          </select>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Reminder
          </button>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {sortedReminders.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No reminders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter || typeFilter
                ? "Try adjusting your filters to see more reminders."
                : "Get started by creating a new follow-up reminder."}
            </p>
          </div>
        ) : (
          sortedReminders.map((reminder) => {
            const isExpanded = expandedReminders.has(reminder.id);
            const statusInfo = getStatusInfo(reminder.status, reminder.dueDate);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={reminder.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {reminder.title}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            <span>Due: {formatDate(reminder.dueDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            <span>Assigned to: {reminder.assignedToId}</span>
                          </div>
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">Type:</span>{" "}
                          {reminderTypes.find(
                            (t) => t.value === reminder.followUpType,
                          )?.label || reminder.followUpType}
                        </div>

                        {reminder.description && isExpanded && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                            {reminder.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {/* Status Update Buttons */}
                      {reminder.status !== "COMPLETED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(reminder.id, "COMPLETED")
                          }
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Complete
                        </button>
                      )}

                      {/* Expand/Collapse */}
                      {reminder.description && (
                        <button
                          onClick={() => toggleExpanded(reminder.id)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="h-5 w-5" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {reminder.description && (
                    <button
                      onClick={() => toggleExpanded(reminder.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-500 mt-2"
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CreateReminderForm modal */}
      {isCreateFormOpen && (
        <CreateReminderForm
          onClose={() => setIsCreateFormOpen(false)}
          onCreateReminder={(reminder) => {
            // TODO: Refresh reminders list or add to local state
            console.log("New reminder created:", reminder);
            setIsCreateFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
