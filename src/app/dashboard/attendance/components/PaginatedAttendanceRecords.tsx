"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Pagination from "@/components/ui/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { AttendanceRecord } from "@/graphql/hooks/useAttendance";

export interface PaginatedAttendanceRecordsProps {
  records: AttendanceRecord[];
  loading?: boolean;
  error?: Error | null;
  onViewRecord?: (record: AttendanceRecord) => void;
  onEditRecord?: (record: AttendanceRecord) => void;
  onDeleteRecord?: (record: AttendanceRecord) => void;
  viewMode?: "table" | "cards";
  showActions?: boolean;
  className?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

const PaginatedAttendanceRecords: React.FC<PaginatedAttendanceRecordsProps> = ({
  records,
  loading = false,
  error = null,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  viewMode = "table",
  showActions = true,
  className = "",
  emptyMessage = "No attendance records found",
  emptyDescription = "There are no attendance records to display.",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] =
    useState<keyof AttendanceRecord>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;

    // Apply search filter
    if (searchTerm) {
      filtered = records.filter(
        (record) =>
          record.member?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          record.member?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          record.visitorName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          record.session?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          record.event?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply sorting (create a copy to avoid mutating read-only array)
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return sorted;
  }, [records, searchTerm, sortField, sortDirection]);

  // Pagination
  const pagination = usePagination(filteredAndSortedRecords, {
    initialItemsPerPage: 10,
    totalItems: filteredAndSortedRecords.length,
  });

  const handleSort = (field: keyof AttendanceRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const getAttendeeDisplayName = (record: AttendanceRecord) => {
    if (record.member) {
      return `${record.member.firstName} ${record.member.lastName}`;
    }
    return record.visitorName || "Unknown";
  };

  const getEventOrSessionName = (record: AttendanceRecord) => {
    if (record.session) {
      return record.session.name;
    }
    if (record.event) {
      return record.event.title;
    }
    return "Unknown";
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
      >
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center">
          <XMarkIcon className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-red-800">
            Error loading attendance records: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, session, or event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredAndSortedRecords.length} record
              {filteredAndSortedRecords.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Records Display */}
      {filteredAndSortedRecords.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <UsersIcon className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500">{emptyDescription}</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Date & Time
                      {sortField === "createdAt" && (
                        <span className="ml-1">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attendee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Session/Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check-in Method
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  {showActions && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagination.paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatDateTime(record.checkInTime)}
                          </div>
                          {record.checkOutTime && (
                            <div className="text-xs text-gray-500">
                              Out: {formatDateTime(record.checkOutTime)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getAttendeeDisplayName(record)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {record.member ? "Member" : "Visitor"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getEventOrSessionName(record)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.session ? "Session" : "Event"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.checkInMethod || "Manual"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          record.checkOutTime
                            ? "bg-gray-100 text-gray-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {record.checkOutTime ? "Checked Out" : "Present"}
                      </span>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          {onViewRecord && (
                            <button
                              onClick={() => onViewRecord(record)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          )}
                          {onEditRecord && (
                            <button
                              onClick={() => onEditRecord(record)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded transition-colors"
                              title="Edit Record"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                          {onDeleteRecord && (
                            <button
                              onClick={() => onDeleteRecord(record)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Delete Record"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagination.paginatedData.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {getAttendeeDisplayName(record)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {getEventOrSessionName(record)}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDateTime(record.checkInTime)}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      record.member
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {record.member ? "Member" : "Visitor"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <TagIcon className="h-4 w-4 mr-2" />
                    {record.checkInMethod || "Manual"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckIcon className="h-4 w-4 mr-2" />
                    {record.checkOutTime ? "Checked Out" : "Present"}
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    {onViewRecord && (
                      <button
                        onClick={() => onViewRecord(record)}
                        className="p-2 text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onEditRecord && (
                      <button
                        onClick={() => onEditRecord(record)}
                        className="p-2 text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Edit Record"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    )}
                    {onDeleteRecord && (
                      <button
                        onClick={() => onDeleteRecord(record)}
                        className="p-2 text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Record"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredAndSortedRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.goToPage}
            onItemsPerPageChange={pagination.setItemsPerPage}
            showItemsPerPage={true}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
};

export default PaginatedAttendanceRecords;
