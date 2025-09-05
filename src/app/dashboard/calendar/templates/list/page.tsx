"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ArrowPathIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useEventTemplates } from "@/graphql/hooks/useEventTemplates";
import { useBranches } from "@/graphql/hooks/useEvents";
import { EventType } from "@/graphql/types/event";

// Map event types to human-readable names
const eventTypeNames: Record<string, string> = {
  [EventType.SERVICE]: "Service",
  [EventType.MEETING]: "Meeting",
  [EventType.CONFERENCE]: "Conference",
  [EventType.WORKSHOP]: "Workshop",
  [EventType.RETREAT]: "Retreat",
  [EventType.OUTREACH]: "Outreach",
  [EventType.SOCIAL]: "Social",
  [EventType.OTHER]: "Other",
};

export default function TemplatesList() {
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    eventType: "",
    branch: "",
    includeInactive: false,
  });

  // State for expanded template details
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);

  // Fetch templates from API
  const { templates, loading, error, refetch } = useEventTemplates(filters);

  // Fetch branches for filter
  const { branches } = useBranches();

  // Handle filter changes
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      setFilters((prev) => ({
        ...prev,
        [name]: checkbox.checked,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle template details
  const toggleTemplateDetails = (id: string) => {
    if (expandedTemplate === id) {
      setExpandedTemplate(null);
    } else {
      setExpandedTemplate(id);
    }
  };

  // Format duration to human-readable string
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return hours === 1 ? "1 hour" : `${hours} hours`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Event Templates
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage event templates to speed up event creation.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:flex-none">
          <Link href="/dashboard/calendar/templates/new">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Template
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-base font-semibold leading-6 text-gray-900 mb-4">
            Filters
          </h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700"
              >
                Search
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search templates"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="eventType"
                className="block text-sm font-medium text-gray-700"
              >
                Event Type
              </label>
              <select
                id="eventType"
                name="eventType"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={filters.eventType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                {Object.entries(eventTypeNames).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700"
              >
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={filters.branch}
                onChange={handleFilterChange}
              >
                <option value="">All Branches</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="includeInactive"
                    name="includeInactive"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={filters.includeInactive}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="includeInactive"
                    className="font-medium text-gray-700"
                  >
                    Include Inactive
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <ArrowPathIcon className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Loading templates...
          </h3>
        </div>
      )}

      {error && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Error loading templates
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error.message}</p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              onClick={() => refetch()}
            >
              <ArrowPathIcon
                className="-ml-0.5 mr-1.5 h-5 w-5"
                aria-hidden="true"
              />
              Retry
            </button>
          </div>
        </div>
      )}

      {!loading && !error && templates.length === 0 && (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No templates found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.eventType || filters.branch
              ? "No event templates matching your filter criteria."
              : "Get started by creating a new event template."}
          </p>
          <div className="mt-6">
            <Link href="/dashboard/calendar/templates/new">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                <PlusIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Create Template
              </button>
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div
              className="px-6 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleTemplateDetails(template.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2 text-indigo-600">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <ClockIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{formatDuration(template.duration)}</span>
                      {template.isRecurring && (
                        <>
                          <span className="mx-2">•</span>
                          <ArrowPathIcon
                            className="h-4 w-4 mr-1"
                            aria-hidden="true"
                          />
                          <span>
                            {template.recurrenceType === "WEEKLY"
                              ? "Weekly"
                              : template.recurrenceType === "MONTHLY"
                                ? "Monthly"
                                : template.recurrenceType === "YEARLY"
                                  ? "Yearly"
                                  : "Daily"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-500 mr-4">
                    Used{" "}
                    <span className="font-medium">
                      {template.usageCount || 0}
                    </span>{" "}
                    times
                  </div>
                  <div className="flex-shrink-0">
                    {expandedTemplate === template.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {expandedTemplate === template.id && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {template.description || "No description provided."}
                    </p>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Required Resources
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.resources && template.resources.length > 0 ? (
                        template.resources.map((resource, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                          >
                            {resource}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No resources specified
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Applicable Branches
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.applicableBranches &&
                      template.applicableBranches.length > 0 ? (
                        template.applicableBranches.map((branchId) => (
                          <span
                            key={branchId}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                          >
                            {branches?.find((b) => b.id === branchId)?.name ||
                              branchId}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          All branches
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Volunteer Roles
                    </h4>
                    <ul className="space-y-2 mb-4">
                      {template.volunteerRoles &&
                      template.volunteerRoles.length > 0 ? (
                        template.volunteerRoles.map((role, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">{role.role}</span>
                            <span className="text-gray-500">
                              {role.count} needed
                            </span>
                          </li>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No volunteer roles specified
                        </span>
                      )}
                    </ul>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Setup Requirements
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                      {template.requiredSetup ||
                        "No setup requirements specified."}
                    </p>

                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Template Information
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                      <li>
                        Created:{" "}
                        {new Date(template.createdAt).toLocaleDateString()}
                      </li>
                      <li>
                        Last used:{" "}
                        {template.lastUsed
                          ? new Date(template.lastUsed).toLocaleDateString()
                          : "Never"}
                      </li>
                      <li>
                        Recurrence:{" "}
                        {template.isRecurring ? (
                          <span>
                            {template.recurrenceType === "WEEKLY"
                              ? `Weekly`
                              : template.recurrenceType === "MONTHLY"
                                ? `Monthly`
                                : template.recurrenceType === "YEARLY"
                                  ? `Yearly`
                                  : `Daily`}
                          </span>
                        ) : (
                          "None"
                        )}
                      </li>
                      <li>
                        Status:{" "}
                        {template.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-3">
                  <Link
                    href={`/dashboard/calendar/templates/edit/${template.id}`}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Edit Template
                    </button>
                  </Link>
                  <Link
                    href={`/dashboard/calendar/new?template=${template.id}`}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      <DocumentDuplicateIcon
                        className="-ml-0.5 mr-1.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      Use Template
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
