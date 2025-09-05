"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

import { BranchLoader } from "./BranchLoader";
import { useOrganizationBranchFilter } from "@/hooks";

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const orgBranchFilter = useOrganizationBranchFilter();

  // Calculate pagination parameters
  const pagination = {
    take: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage,
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRegionFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Branches" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6 flex justify-end">
        <Button asChild variant="default">
          <Link href="/dashboard/branches/new">
            <span className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Branch
            </span>
          </Link>
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BranchLoader pagination={pagination}>
          {(branches, loading, error, refetch, totalCount, hasNextPage) => {
            // Defensive: fallback to [] if undefined
            const branchList = branches ?? [];

            // Filter branches based on search and filters
            const filteredBranches = branchList.filter((branch) => {
              const matchesSearch =
                branch.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                branch.city
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                branch.address
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                branch.email?.toLowerCase().includes(searchQuery.toLowerCase());

              // Region is not a standard field; use state or country for filtering
              const matchesRegion =
                regionFilter === "all" ||
                branch.state === regionFilter ||
                branch.country === regionFilter;
              // Status uses isActive boolean
              const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active"
                  ? branch.isActive
                  : !branch.isActive);

              return matchesSearch && matchesRegion && matchesStatus;
            });

            // Get unique regions for the filter dropdown (using state and country)
            const states = Array.from(
              new Set(branchList.map((branch) => branch.state).filter(Boolean)),
            );
            const countries = Array.from(
              new Set(
                branchList.map((branch) => branch.country).filter(Boolean),
              ),
            );
            const regions = ["all", ...states, ...countries];

            return (
              <>
                {/* Search and filter bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search branches..."
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        Filters
                        {(regionFilter !== "all" || statusFilter !== "all") && (
                          <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            {(regionFilter !== "all" ? 1 : 0) +
                              (statusFilter !== "all" ? 1 : 0)}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => refetch()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        aria-label="Refresh"
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable filters */}
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Region
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                          >
                            <option value="all">All Regions</option>
                            {regions
                              .filter((r) => r !== "all")
                              .map((region) => (
                                <option key={region} value={region}>
                                  {region}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                          >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={clearFilters}
                            className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 focus:outline-none"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Loading state */}
                {loading && (
                  <div className="flex flex-col items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    <p className="mt-4 text-gray-500">Loading branches...</p>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                      <XCircleIcon className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Failed to load branches
                    </h3>
                    <p className="text-gray-500 mb-4">
                      There was an error loading the branch data. Please try
                      again.
                    </p>
                    <button
                      onClick={() => refetch()}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      <ArrowPathIcon className="h-5 w-5 mr-2" />
                      Try Again
                    </button>
                  </div>
                )}

                {/* Empty state */}
                {!loading && !error && filteredBranches.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-50 mb-4">
                      <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No branches found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery ||
                      regionFilter !== "all" ||
                      statusFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by creating a new branch"}
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/dashboard/branches/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                        New Branch
                      </Link>
                    </div>
                  </div>
                )}

                {/* Branches list as modern UI cards */}
                {!loading && !error && filteredBranches.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBranches.map((branch) => (
                      <Link
                        key={branch.id}
                        href={`/dashboard/branches/${branch.id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 h-full flex flex-col overflow-hidden">
                          {/* Card header with branch name and status */}
                          <div className="p-6 pb-4 border-b border-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                  <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {branch.name}
                                  </h3>
                                  <p className="text-xs text-gray-500">
                                    {branch.establishedAt
                                      ? `Est. ${new Date(branch.establishedAt).toLocaleDateString()}`
                                      : "No establishment date"}
                                  </p>
                                </div>
                              </div>
                              <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                  branch.isActive
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                              >
                                {branch.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>

                          {/* Card body with branch details */}
                          <div className="p-6 flex-1 flex flex-col space-y-4">
                            <div className="flex items-start">
                              <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="ml-2 text-sm text-gray-600 line-clamp-2">
                                {[
                                  branch.address,
                                  branch.city,
                                  branch.state,
                                  branch.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "No address provided"}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <EnvelopeIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <span className="ml-2 text-sm text-gray-600 truncate">
                                {branch.email || "No email provided"}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <span className="ml-2 text-sm text-gray-600">
                                {branch.phoneNumber || "No phone provided"}
                              </span>
                            </div>

                            {branch.statistics && (
                              <div className="flex items-center">
                                <UserGroupIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <div className="ml-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        {branch.statistics.activeMembers}
                                      </span>{" "}
                                      active
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      •
                                    </span>
                                    <span className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        {branch.statistics.totalMembers}
                                      </span>{" "}
                                      total
                                    </span>
                                  </div>
                                  {branch.statistics.totalMembers > 0 && (
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                                      <div
                                        className="bg-indigo-500 h-1.5 rounded-full"
                                        style={{
                                          width: `${Math.min(100, (branch.statistics.activeMembers / branch.statistics.totalMembers) * 100)}%`,
                                        }}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Card footer with view details button */}
                          <div className="p-6 pt-4 border-t border-gray-50 bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                            <div className="text-sm font-medium text-indigo-600 flex items-center justify-center">
                              View Branch Details
                              <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!loading && !error && filteredBranches.length > 0 && (
                  <div className="mt-8 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                          {(currentPage - 1) * itemsPerPage + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalCount)}
                        </span>{" "}
                        of <span className="font-medium">{totalCount}</span>{" "}
                        branches
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-3 py-2 rounded-lg border ${
                          currentPage === 1
                            ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        }`}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                        <span className="ml-1">Previous</span>
                      </button>
                      <div className="text-sm font-medium text-gray-700 px-4 py-2 bg-white border border-gray-300 rounded-lg">
                        Page {currentPage}
                      </div>
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={!hasNextPage}
                        className={`relative inline-flex items-center px-3 py-2 rounded-lg border ${
                          !hasNextPage
                            ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        }`}
                      >
                        <span className="mr-1">Next</span>
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            );
          }}
        </BranchLoader>
      </div>
    </div>
  );
}
