"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { gql, useQuery } from "@apollo/client";
import {
  BellIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  publishedAt?: string;
  creator: {
    firstName: string;
    lastName: string;
  };
  _count?: {
    reads: number;
    deliveries: number;
  };
}

interface AnnouncementsResponse {
  announcements: Announcement[];
  total: number;
}

const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements($branchId: ID!, $filters: AnnouncementFiltersInput, $limit: Int, $offset: Int) {
    announcements(branchId: $branchId, filters: $filters, limit: $limit, offset: $offset) {
      announcements {
        id
        title
        content
        category
        priority
        status
        publishedAt
        creator {
          firstName
          lastName
        }
        _count {
          reads
          deliveries
        }
      }
      total
      limit
      offset
    }
  }
`;

export default function AnnouncementsPage() {
  const router = useRouter();
  const { branchId } = useOrganisationBranch();
  const [statusFilter, setStatusFilter] = useState<string>("PUBLISHED");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_ANNOUNCEMENTS, {
    variables: {
      branchId,
      filters: { status: statusFilter },
      limit,
      offset,
    },
    skip: !branchId,
  });

  const announcements: Announcement[] = data?.announcements?.announcements || [];
  const total = data?.announcements?.total || 0;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckIcon className="w-5 h-5 text-green-500" />;
      case "SCHEDULED":
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case "DRAFT":
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const truncateContent = (content: string, length: number = 100) => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (!branchId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
          <p className="text-gray-600 mt-1">
            Create and manage announcements for your branch
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/communication/announcements/create")}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <PlusIcon className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setOffset(0);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === status
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading announcements: {error.message}
        </div>
      )}

      {/* Announcements List */}
      {!loading && !error && announcements.length > 0 && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(announcement.status)}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {announcement.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {truncateContent(announcement.content)}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Category: {announcement.category}</span>
                    <span>
                      By: {announcement.creator.firstName}{" "}
                      {announcement.creator.lastName}
                    </span>
                    {announcement._count && (
                      <>
                        <span>Reads: {announcement._count.reads}</span>
                        <span>Deliveries: {announcement._count.deliveries}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/dashboard/communication/announcements/${announcement.id}`)}
                    className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && announcements.length === 0 && (
        <div className="text-center py-12">
          <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No announcements found</p>
          <p className="text-gray-500 text-sm mt-1">
            Create your first announcement to get started
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && announcements.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {offset + 1} to {Math.min(offset + limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
