"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_MEMBER_HISTORY,
  GET_MEMBER_HISTORY_COUNT,
} from "@/graphql/queries/memberQueries";
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface MemberHistorySectionProps {
  memberId: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: any;
  userId?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  branchId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

const MemberHistorySection: React.FC<MemberHistorySectionProps> = ({
  memberId,
}) => {
  const [page, setPage] = useState(0);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 20;

  const {
    data: historyData,
    loading,
    error,
    refetch,
  } = useQuery(GET_MEMBER_HISTORY, {
    variables: {
      memberId,
      skip: page * pageSize,
      take: pageSize,
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: countData } = useQuery(GET_MEMBER_HISTORY_COUNT, {
    variables: { memberId },
    fetchPolicy: "cache-and-network",
  });

  const history: HistoryEntry[] = historyData?.memberHistory || [];
  const totalCount = countData?.memberHistoryCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Filter history by action type
  const filteredHistory =
    filterAction === "all"
      ? history
      : history.filter((entry) => entry.action === filterAction);

  // Get unique action types for filter
  const actionTypes = Array.from(
    new Set(history.map((entry) => entry.action))
  ).sort();

  // Get action badge color
  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { color: string; label: string }> = {
      CREATE: { color: "bg-green-100 text-green-800", label: "Created" },
      UPDATE: { color: "bg-blue-100 text-blue-800", label: "Updated" },
      DELETE: { color: "bg-red-100 text-red-800", label: "Deleted" },
      DEACTIVATE: { color: "bg-orange-100 text-orange-800", label: "Deactivated" },
      ACTIVATE: { color: "bg-green-100 text-green-800", label: "Activated" },
      TRANSFER: { color: "bg-purple-100 text-purple-800", label: "Transferred" },
      ASSIGN_RFID: { color: "bg-indigo-100 text-indigo-800", label: "RFID Assigned" },
      REMOVE_RFID: { color: "bg-gray-100 text-gray-800", label: "RFID Removed" },
      STATUS_CHANGE: { color: "bg-yellow-100 text-yellow-800", label: "Status Changed" },
      PROFILE_UPDATE: { color: "bg-blue-100 text-blue-800", label: "Profile Updated" },
      PERMANENT_DELETE: { color: "bg-red-200 text-red-900", label: "Permanently Deleted" },
      bulk_update_status: { color: "bg-yellow-100 text-yellow-800", label: "Bulk Status Update" },
      bulk_transfer: { color: "bg-purple-100 text-purple-800", label: "Bulk Transfer" },
      bulk_deactivate: { color: "bg-orange-100 text-orange-800", label: "Bulk Deactivate" },
      bulk_assign_rfid: { color: "bg-indigo-100 text-indigo-800", label: "Bulk RFID Assign" },
      bulk_add_to_group: { color: "bg-teal-100 text-teal-800", label: "Added to Group" },
      bulk_remove_from_group: { color: "bg-gray-100 text-gray-800", label: "Removed from Group" },
      bulk_add_to_ministry: { color: "bg-teal-100 text-teal-800", label: "Added to Ministry" },
      bulk_remove_from_ministry: { color: "bg-gray-100 text-gray-800", label: "Removed from Ministry" },
    };

    return (
      actionMap[action] || {
        color: "bg-gray-100 text-gray-800",
        label: action.replace(/_/g, " "),
      }
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
    } catch {
      return dateString;
    }
  };

  // Get user display name
  const getUserName = (entry: HistoryEntry) => {
    if (!entry.user) return "System";
    const { firstName, lastName, email } = entry.user;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    return email || "Unknown User";
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-2">Error loading history</div>
        <button
          onClick={() => refetch()}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900">
            Complete Member History
          </h3>
          <span className="text-sm text-gray-500">({totalCount} entries)</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="Filter"
          >
            <FunnelIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Action:
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Actions</option>
              {actionTypes.map((action) => (
                <option key={action} value={action}>
                  {getActionBadge(action).label}
                </option>
              ))}
            </select>
            {filterAction !== "all" && (
              <button
                onClick={() => setFilterAction("all")}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* History Timeline */}
      {loading && page === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500">No history entries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((entry, index) => {
            const actionBadge = getActionBadge(entry.action);
            const isLast = index === filteredHistory.length - 1;

            return (
              <div
                key={entry.id}
                className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-l-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-white border-2 border-indigo-500"></div>

                {/* Content */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${actionBadge.color}`}
                      >
                        {actionBadge.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-900 mb-2">
                    {entry.description}
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-3 w-3" />
                      <span>{getUserName(entry)}</span>
                    </div>
                    {entry.ipAddress && (
                      <div className="flex items-center space-x-1">
                        <span>IP:</span>
                        <span className="font-mono">{entry.ipAddress}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                    <details className="mt-2">
                      <summary className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800">
                        View Details
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {page + 1} of {totalPages} ({totalCount} total entries)
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0 || loading}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberHistorySection;
