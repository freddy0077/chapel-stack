"use client";

import React, { useState, useEffect } from "react";
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CalendarDaysIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface AdvancedFiltersProps {
  entityType: "visits" | "sessions" | "requests" | "reminders";
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onFiltersChange?: (filters: FilterState) => void;
  onSearchChange?: (searchTerm: string) => void;
  memberOptions?: FilterOption[];
  pastorOptions?: FilterOption[];
  className?: string;
}

export interface FilterState {
  searchTerm: string;
  status: string[];
  type: string[];
  priority: string[];
  assignedTo: string[];
  member: string[];
  dateRange: DateRange | null;
  showCompleted: boolean;
}

const defaultFilters: FilterState = {
  searchTerm: "",
  status: [],
  type: [],
  priority: [],
  assignedTo: [],
  member: [],
  dateRange: null,
  showCompleted: true,
};

// Filter options for different entity types
const getStatusOptions = (entityType: string): FilterOption[] => {
  switch (entityType) {
    case "visits":
    case "sessions":
      return [
        { value: "SCHEDULED", label: "Scheduled" },
        { value: "COMPLETED", label: "Completed" },
        { value: "CANCELLED", label: "Cancelled" },
        { value: "RESCHEDULED", label: "Rescheduled" },
      ];
    case "requests":
      return [
        { value: "OPEN", label: "Open" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "RESOLVED", label: "Resolved" },
        { value: "CLOSED", label: "Closed" },
      ];
    case "reminders":
      return [
        { value: "PENDING", label: "Pending" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "COMPLETED", label: "Completed" },
        { value: "OVERDUE", label: "Overdue" },
      ];
    default:
      return [];
  }
};

const getTypeOptions = (entityType: string): FilterOption[] => {
  switch (entityType) {
    case "visits":
      return [
        { value: "HOME_VISIT", label: "Home Visit" },
        { value: "HOSPITAL_VISIT", label: "Hospital Visit" },
        { value: "OFFICE_VISIT", label: "Office Visit" },
        { value: "PHONE_CALL", label: "Phone Call" },
        { value: "OTHER", label: "Other" },
      ];
    case "sessions":
      return [
        { value: "INDIVIDUAL", label: "Individual" },
        { value: "COUPLE", label: "Couple" },
        { value: "FAMILY", label: "Family" },
        { value: "GROUP", label: "Group" },
        { value: "CRISIS", label: "Crisis" },
        { value: "FOLLOW_UP", label: "Follow-up" },
      ];
    case "requests":
      return [
        { value: "PASTORAL_CARE", label: "Pastoral Care" },
        { value: "COUNSELING", label: "Counseling" },
        { value: "PRAYER_REQUEST", label: "Prayer Request" },
        { value: "HOSPITAL_VISIT", label: "Hospital Visit" },
        { value: "BEREAVEMENT", label: "Bereavement" },
        { value: "OTHER", label: "Other" },
      ];
    case "reminders":
      return [
        { value: "FOLLOW_UP_VISIT", label: "Follow-up Visit" },
        { value: "PHONE_CALL", label: "Phone Call" },
        { value: "EMAIL", label: "Email" },
        { value: "PRAYER_REQUEST", label: "Prayer Request" },
        { value: "COUNSELING_SESSION", label: "Counseling Session" },
        { value: "PASTORAL_VISIT", label: "Pastoral Visit" },
        { value: "OTHER", label: "Other" },
      ];
    default:
      return [];
  }
};

const priorityOptions: FilterOption[] = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

export default function AdvancedFilters({
  entityType,
  filters,
  onChange,
  onFiltersChange,
  onSearchChange,
  memberOptions = [],
  pastorOptions = [],
  className = "",
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(searchTerm);
      }
      onChange({ ...filters, searchTerm });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearchChange, filters, onChange]);

  // Notify parent of filter changes
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  const handleFilterChange = (
    filterType: keyof FilterState,
    value: string | boolean | DateRange | null,
  ) => {
    onChange({ ...filters, [filterType]: value });
  };

  const clearAllFilters = () => {
    onChange(defaultFilters);
    setSearchTerm("");
  };

  const getActiveFilterCount = () => {
    return (
      filters.status.length +
      filters.type.length +
      filters.priority.length +
      filters.assignedTo.length +
      filters.member.length +
      (filters.dateRange ? 1 : 0) +
      (filters.searchTerm ? 1 : 0)
    );
  };

  const statusOptions = getStatusOptions(entityType);
  const typeOptions = getTypeOptions(entityType);
  const activeFilterCount = getActiveFilterCount();

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Search ${entityType}...`}
          />
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-700">
              Advanced Filters
            </span>
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {activeFilterCount}
              </span>
            )}
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("status", option.value)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    filters.status.includes(option.value)
                      ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                  {option.count && (
                    <span className="ml-1 text-xs">({option.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {entityType === "visits"
                ? "Visit Type"
                : entityType === "sessions"
                  ? "Session Type"
                  : entityType === "requests"
                    ? "Request Type"
                    : "Reminder Type"}
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("type", option.value)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    filters.type.includes(option.value)
                      ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter (for requests and reminders) */}
          {(entityType === "requests" || entityType === "reminders") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange("priority", option.value)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      filters.priority.includes(option.value)
                        ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarDaysIcon className="h-4 w-4 inline mr-1" />
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={filters.dateRange?.startDate || ""}
                  onChange={(e) =>
                    handleFilterChange("dateRange", {
                      startDate: e.target.value,
                      endDate: filters.dateRange?.endDate || "",
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={filters.dateRange?.endDate || ""}
                  onChange={(e) =>
                    handleFilterChange("dateRange", {
                      startDate: filters.dateRange?.startDate || "",
                      endDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Member Filter */}
          {memberOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="h-4 w-4 inline mr-1" />
                Members
              </label>
              <select
                multiple
                value={filters.member}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );
                  onChange({ ...filters, member: values });
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                size={Math.min(5, memberOptions.length)}
              >
                {memberOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pastor/Assigned To Filter */}
          {pastorOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>
              <select
                multiple
                value={filters.assignedTo}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );
                  onChange({ ...filters, assignedTo: values });
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                size={Math.min(5, pastorOptions.length)}
              >
                {pastorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count && `(${option.count})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show Completed Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(e) =>
                handleFilterChange("showCompleted", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Show completed items
            </label>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
