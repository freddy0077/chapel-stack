"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ChartPieIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  Cog6ToothIcon,
  CalendarIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

// Types for branch data
interface Branch {
  id: string;
  name: string;
  location: string;
}

// Mock data
const BRANCHES: Branch[] = [
  { id: "all", name: "All Branches", location: "Organization-wide" },
  { id: "b1", name: "Main Campus", location: "123 Main St, Cityville" },
  { id: "b2", name: "East Side", location: "456 East Blvd, Cityville" },
  { id: "b3", name: "West End", location: "789 West Ave, Cityville" },
  { id: "b4", name: "South Chapel", location: "321 South Rd, Cityville" },
];

export default function AnalyticsDashboard() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [timeframe, setTimeframe] = useState("year");

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Church Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Comprehensive reports and analytics across all branches
          </p>
        </div>
        <Link
          href="/dashboard/analytics/settings"
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Cog6ToothIcon
            className="-ml-1 mr-2 h-5 w-5 text-gray-500"
            aria-hidden="true"
          />
          Dashboard Settings
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="sm:max-w-xs">
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
        <div className="sm:max-w-xs">
          <label
            htmlFor="timeframe"
            className="block text-sm font-medium text-gray-700"
          >
            Timeframe
          </label>
          <select
            id="timeframe"
            name="timeframe"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Analytics Modules Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Membership Growth Module */}
        <Link
          href="/dashboard/analytics/membership"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-indigo-500 p-3">
              <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Membership Growth
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track and analyze membership trends across branches
              </p>
            </div>
          </div>
        </Link>

        {/* Attendance Reports Module */}
        <Link
          href="/dashboard/analytics/attendance"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
              <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Attendance Reports
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Analyze service and event attendance patterns
              </p>
            </div>
          </div>
        </Link>

        {/* Financial Analytics Module */}
        <Link
          href="/dashboard/analytics/financial"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
              <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Financial Analytics
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Comprehensive financial reporting and analysis
              </p>
            </div>
          </div>
        </Link>

        {/* Branch Performance Module */}
        <Link
          href="/dashboard/analytics/performance"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-purple-500 p-3">
              <ArrowTrendingUpIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Branch Performance
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Compare metrics and benchmarks across branches
              </p>
            </div>
          </div>
        </Link>

        {/* Ministry Engagement Module */}
        <Link
          href="/dashboard/analytics/engagement"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-amber-500 p-3">
              <ChartPieIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ministry Engagement
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Track participation across ministries and branches
              </p>
            </div>
          </div>
        </Link>

        {/* Member Migration Module */}
        <Link
          href="/dashboard/analytics/migration"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-rose-500 p-3">
              <ArrowsRightLeftIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Member Migration
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Analyze patterns of members moving between branches
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Overview Stats */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Organization Overview
          </h3>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Members
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                4,287
              </dd>
              <dd className="mt-2 text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span>+5.2% from last year</span>
              </dd>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Average Attendance
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                1,856
              </dd>
              <dd className="mt-2 text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span>+3.8% from last month</span>
              </dd>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                YTD Giving
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                $758,245
              </dd>
              <dd className="mt-2 text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span>+12.1% from last year</span>
              </dd>
            </div>

            <div className="bg-gray-50 overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Active Volunteers
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">623</dd>
              <dd className="mt-2 text-sm text-green-600 flex items-center">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                <span>+8.5% from last quarter</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Reports
          </h3>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              <li>
                <Link
                  href="/dashboard/analytics/reports/q1-financial"
                  className="block hover:bg-gray-50"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="truncate text-sm font-medium text-indigo-600">
                            Q1 2025 Financial Summary
                          </p>
                          <p className="mt-1 truncate text-sm text-gray-500">
                            Generated on April 5, 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics/reports/march-attendance"
                  className="block hover:bg-gray-50"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="truncate text-sm font-medium text-indigo-600">
                            March 2025 Attendance Report
                          </p>
                          <p className="mt-1 truncate text-sm text-gray-500">
                            Generated on April 2, 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics/reports/membership-growth"
                  className="block hover:bg-gray-50"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <UsersIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="truncate text-sm font-medium text-indigo-600">
                            Annual Membership Growth Analysis
                          </p>
                          <p className="mt-1 truncate text-sm text-gray-500">
                            Generated on March 31, 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/analytics/reports/sacramental-trends"
                  className="block hover:bg-gray-50"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center">
                      <div className="flex-shrink-0">
                        <BookOpenIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <p className="truncate text-sm font-medium text-indigo-600">
                            Sacramental Records Yearly Analysis
                          </p>
                          <p className="mt-1 truncate text-sm text-gray-500">
                            Generated on March 25, 2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
