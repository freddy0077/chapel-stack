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

import { useBranches } from "../../../graphql/hooks/useBranches";

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch real branches from API
  const { branches, loading } = useBranches();

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      <div className="mb-10">
        <DashboardHeader
          title="Branch Management"
          subtitle="A list of all branches and parishes in your church network with their details and status."
          action={
            <Link
              href="/dashboard/branches/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add Branch
            </Link>
          }
        />
      </div>
      
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

      {/* Search and Filters */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative mt-1 rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search branches by name, code, city or pastor"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-4">
          <div className="min-w-0 flex-1">
            <label htmlFor="region" className="sr-only">
              Region
            </label>
            <select
              id="region"
              name="region"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
          </div>
          
          <div className="min-w-0 flex-1">
            <label htmlFor="status" className="sr-only">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
            onClick={() => {
              setSearchQuery("");
              setRegionFilter("all");
              setStatusFilter("all");
            }}
          >
            <ArrowPathIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Branches Card Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white/90 rounded-lg shadow animate-pulse">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-200" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-gray-400">Loading branches…</h3>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white/90 rounded-lg shadow">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-semibold text-gray-700">No branches found</h3>
            <p className="mt-1 text-base text-gray-500">No branches match your current search and filter criteria.</p>
          </div>
        ) : (
          filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="relative flex flex-col rounded-xl shadow-lg bg-white border border-gray-100 hover:shadow-2xl transition-shadow duration-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BuildingOfficeIcon className="h-8 w-8 text-indigo-500" />
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                      <Link href={`/dashboard/branches/${branch.id}`} className="hover:underline">
                        {branch.name}
                      </Link>
                    </h2>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{branch.city}, {branch.state}</div>
                  </div>
                </div>
                {branch.isActive ? (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                    <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-green-400" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
                    <XCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-red-400" />
                    Inactive
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Address:</span> {branch.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {branch.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {branch.phoneNumber}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Established:</span> {branch.establishedAt ? new Date(branch.establishedAt).toLocaleDateString() : "-"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Members:</span> {branch.statistics?.totalMembers?.toLocaleString?.() ?? "-"}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Country:</span> {branch.country}
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/dashboard/branches/${branch.id}`}
                  className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/branches/${branch.id}/edit`}
                  className="inline-flex justify-center items-center px-4 py-2 rounded-md text-sm font-medium bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 shadow"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Branch Stats Summary */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Branches</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{branches.length}</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Active Branches</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {branches.filter(b => b.status === "active").length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Network Members</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {branches.reduce((sum, branch) => sum + branch.totalMembers, 0).toLocaleString()}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Avg Weekly Attendance</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {branches.reduce((sum, branch) => sum + branch.avgAttendance, 0).toLocaleString()}
          </dd>
        </div>
      </div>
    </div>
    </div>
  );
}
