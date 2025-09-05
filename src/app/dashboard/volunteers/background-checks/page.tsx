"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Types
interface BackgroundCheck {
  id: string;
  volunteerId: string;
  volunteerName: string;
  email: string;
  type: "Standard" | "Enhanced" | "Children & Youth";
  status: "Completed" | "Pending" | "Expired" | "Rejected";
  submittedDate: string;
  completedDate?: string;
  expirationDate?: string;
  branch: string;
  teams: string[];
  notes?: string;
}

// Mock branches
const BRANCHES = [
  { id: "all", name: "All Branches" },
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" },
];

// Mock background check data
const MOCK_BACKGROUND_CHECKS: BackgroundCheck[] = [
  {
    id: "bg1",
    volunteerId: "v1",
    volunteerName: "Michael Smith",
    email: "michael.smith@example.com",
    type: "Standard",
    status: "Completed",
    submittedDate: "2024-01-15",
    completedDate: "2024-01-20",
    expirationDate: "2027-01-20",
    branch: "Main Campus",
    teams: ["Worship Team", "Tech Team"],
    notes: "Completed without issues",
  },
  {
    id: "bg2",
    volunteerId: "v2",
    volunteerName: "Sarah Davis",
    email: "sarah.davis@example.com",
    type: "Children & Youth",
    status: "Completed",
    submittedDate: "2024-02-10",
    completedDate: "2024-02-18",
    expirationDate: "2027-02-18",
    branch: "East Side",
    teams: ["Children's Ministry", "Nursery"],
    notes: "Fingerprinting completed at local police station",
  },
  {
    id: "bg3",
    volunteerId: "v3",
    volunteerName: "James Wilson",
    email: "james.wilson@example.com",
    type: "Enhanced",
    status: "Expired",
    submittedDate: "2021-06-01",
    completedDate: "2021-06-12",
    expirationDate: "2024-06-12",
    branch: "Main Campus",
    teams: ["Elder Board", "Finance Committee"],
    notes: "Needs renewal",
  },
  {
    id: "bg4",
    volunteerId: "v4",
    volunteerName: "Rachel Thompson",
    email: "rachel.thompson@example.com",
    type: "Children & Youth",
    status: "Pending",
    submittedDate: "2025-04-05",
    branch: "West End",
    teams: ["Youth Ministry"],
    notes: "Awaiting results from background check provider",
  },
  {
    id: "bg5",
    volunteerId: "v5",
    volunteerName: "David Anderson",
    email: "david.anderson@example.com",
    type: "Children & Youth",
    status: "Rejected",
    submittedDate: "2025-03-01",
    completedDate: "2025-03-10",
    branch: "South Chapel",
    teams: ["Children's Ministry"],
    notes: "Prior conviction found - referred to pastoral team for review",
  },
  {
    id: "bg6",
    volunteerId: "v6",
    volunteerName: "Jennifer Miller",
    email: "jennifer.miller@example.com",
    type: "Standard",
    status: "Completed",
    submittedDate: "2024-11-15",
    completedDate: "2024-11-22",
    expirationDate: "2027-11-22",
    branch: "Main Campus",
    teams: ["Hospitality Team", "Welcome Team"],
    notes: "",
  },
  {
    id: "bg7",
    volunteerId: "v7",
    volunteerName: "Robert Garcia",
    email: "robert.garcia@example.com",
    type: "Standard",
    status: "Pending",
    submittedDate: "2025-04-01",
    branch: "East Side",
    teams: ["Audio/Visual Team"],
    notes: "Application submitted",
  },
];

export default function BackgroundChecksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [backgroundChecks, setBackgroundChecks] = useState(
    MOCK_BACKGROUND_CHECKS,
  );

  // Filter background checks based on search, branch, and status
  const filteredChecks = backgroundChecks.filter((check) => {
    // Branch filter
    if (
      selectedBranch !== "all" &&
      check.branch !== BRANCHES.find((b) => b.id === selectedBranch)?.name
    ) {
      return false;
    }

    // Status filter
    if (
      selectedStatus !== "all" &&
      check.status.toLowerCase() !== selectedStatus.toLowerCase()
    ) {
      return false;
    }

    // Search term filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      return (
        check.volunteerName.toLowerCase().includes(search) ||
        check.email.toLowerCase().includes(search) ||
        check.teams.some((team) => team.toLowerCase().includes(search))
      );
    }

    return true;
  });

  // Get counts for dashboard stats
  const totalChecks = backgroundChecks.length;
  const pendingChecks = backgroundChecks.filter(
    (check) => check.status === "Pending",
  ).length;
  const expiredChecks = backgroundChecks.filter(
    (check) => check.status === "Expired",
  ).length;
  const compliantChecks = backgroundChecks.filter(
    (check) => check.status === "Completed",
  ).length;
  const complianceRate = Math.round((compliantChecks / totalChecks) * 100);

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "rejected":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <CheckCircleIcon
            className="h-5 w-5 text-green-500"
            aria-hidden="true"
          />
        );
      case "pending":
        return (
          <ClockIcon className="h-5 w-5 text-yellow-500" aria-hidden="true" />
        );
      case "expired":
        return (
          <ExclamationTriangleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        );
      case "rejected":
        return (
          <XCircleIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        );
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Renew background check
  const handleRenew = (id: string) => {
    const updatedChecks = backgroundChecks.map((check) => {
      if (check.id === id) {
        return {
          ...check,
          status: "Pending" as const,
          submittedDate: new Date().toISOString().split("T")[0],
          completedDate: undefined,
          expirationDate: undefined,
          notes: "Renewal submitted",
        };
      }
      return check;
    });
    setBackgroundChecks(updatedChecks);
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Background Checks
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Track and manage volunteer background checks across all branches
          </p>
        </div>
        <Link
          href="/dashboard/volunteers/background-checks/new"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Request New Check
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-6 w-6 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Compliance Rate
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {complianceRate}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon
                  className="h-6 w-6 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Checks
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {pendingChecks}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Expired Checks
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {expiredChecks}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon
                  className="h-6 w-6 text-indigo-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Volunteers
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {totalChecks}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search volunteers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 md:max-w-xs">
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {BRANCHES.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 md:max-w-xs">
          <select
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Background Checks List */}
      <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
        {filteredChecks.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Volunteer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dates
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Branch / Teams
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChecks.map((check) => (
                <tr key={check.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {check.volunteerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {check.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{check.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(check.status)}
                      <span
                        className={`ml-1.5 inline-flex px-2 text-xs font-semibold rounded-full ${getStatusBadgeColor(check.status)}`}
                      >
                        {check.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Submitted: {formatDate(check.submittedDate)}</div>
                    {check.completedDate && (
                      <div>Completed: {formatDate(check.completedDate)}</div>
                    )}
                    {check.expirationDate && (
                      <div>Expires: {formatDate(check.expirationDate)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{check.branch}</div>
                    <div className="text-xs text-gray-400">
                      {check.teams.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/dashboard/volunteers/background-checks/${check.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </Link>
                      {check.status === "Expired" && (
                        <button
                          onClick={() => handleRenew(check.id)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <ArrowPathIcon className="h-4 w-4 mr-1" />
                          Renew
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No background checks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Documentation and Resources */}
      <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Policy & Resources
          </h3>
          <div className="space-y-4">
            <Link
              href="/dashboard/volunteers/resources/background-policy"
              className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">
                    Background Check Policy Document
                  </span>
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </Link>

            <Link
              href="/dashboard/volunteers/resources/faq"
              className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">
                    Frequently Asked Questions
                  </span>
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </Link>

            <Link
              href="/dashboard/volunteers/resources/training"
              className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  </svg>
                  <span className="ml-3 text-gray-900 font-medium">
                    Safety Training Resources
                  </span>
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
