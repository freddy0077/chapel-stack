"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from '@/components/DashboardHeader';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import { 
  CheckCircleIcon, 
  XCircleIcon 
} from "@heroicons/react/20/solid";

import { BranchLoader } from "./BranchLoader";
import { useOrganizationBranchFilter } from "@/hooks";

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const orgBranchFilter = useOrganizationBranchFilter();

  // Calculate pagination parameters
  const pagination = {
    take: itemsPerPage,
    skip: (currentPage - 1) * itemsPerPage
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Branches">
        <Link
          href="/dashboard/branches/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Branch
        </Link>
      </DashboardHeader>

      <div className="px-4 md:px-8 py-4 flex justify-end">
        <Link
          href="/dashboard/branches/new"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Branch
        </Link>
      </div>

      <BranchLoader pagination={pagination}>
        {(branches, loading, error, refetch, totalCount, hasNextPage) => {
          // Defensive: fallback to [] if undefined
          const branchList = branches ?? [];
          
          // Filter branches based on search and filters
          const filteredBranches = branchList.filter(branch => {
            const matchesSearch =
              branch.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              branch.email?.toLowerCase().includes(searchQuery.toLowerCase());

            // Region is not a standard field; use state or country for filtering
            const matchesRegion = regionFilter === "all" || branch.state === regionFilter || branch.country === regionFilter;
            // Status uses isActive boolean
            const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? branch.isActive : !branch.isActive);

            return matchesSearch && matchesRegion && matchesStatus;
          });

          // Get unique regions for the filter dropdown (using state and country)
          const states = Array.from(new Set(branchList.map(branch => branch.state).filter(Boolean)));
          const countries = Array.from(new Set(branchList.map(branch => branch.country).filter(Boolean)));
          const regions = ["all", ...states, ...countries];

          return (
            <>
              {/* Search and filters */}
              <div className="px-4 md:px-8 py-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search branches..."
                      className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={regionFilter}
                      onChange={(e) => setRegionFilter(e.target.value)}
                    >
                      <option value="all">All Regions</option>
                      {regions.filter(r => r !== "all").map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                    <select
                      className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <button
                      onClick={() => refetch()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-10">
                  <p className="text-red-500">Failed to load branches.</p>
                  <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && filteredBranches.length === 0 && (
                <div className="text-center py-10">
                  <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No branches found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery || regionFilter !== "all" || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by creating a new branch"}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/branches/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      New Branch
                    </Link>
                  </div>
                </div>
              )}

              {/* Branches list as modern UI cards */}
              {!loading && !error && filteredBranches.length > 0 && (
                <div className="px-4 md:px-8 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBranches.map((branch) => (
                      <div
                        key={branch.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col"
                      >
                        <div className="flex items-center gap-3 p-5 pb-2">
                          <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <BuildingOfficeIcon className="h-7 w-7 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-lg font-semibold text-gray-900 truncate">{branch.name}</div>
                            <div className="text-xs text-gray-500 truncate">
                              {branch.establishedAt ? `Est. ${new Date(branch.establishedAt).toLocaleDateString()}` : ''}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {branch.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="px-5 pb-4 flex-1 flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-medium">Location:</span>
                            <span className="truncate">{[branch.address, branch.city, branch.state, branch.country].filter(Boolean).join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-medium">Email:</span>
                            <span className="truncate">{branch.email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-medium">Phone:</span>
                            <span>{branch.phoneNumber || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-medium">Members:</span>
                            <span>
                              {branch.statistics ? `Active: ${branch.statistics.activeMembers}, Total: ${branch.statistics.totalMembers}` : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="px-5 pb-5 mt-auto flex gap-2">
                          <Link
                            href={`/dashboard/branches/${branch.id}`}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && filteredBranches.length > 0 && (
                <div className="px-4 md:px-8 py-4 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!hasNextPage}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        !hasNextPage
                          ? "bg-gray-100 text-gray-400"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalCount)}
                        </span>{" "}
                        of <span className="font-medium">{totalCount}</span> branches
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-300"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {/* Current page indicator */}
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600">
                          {currentPage}
                        </span>
                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!hasNextPage}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            !hasNextPage
                              ? "text-gray-300"
                              : "text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </BranchLoader>
    </div>
  );
}
