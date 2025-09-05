"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  ArrowsUpDownIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Select,
  SelectItem,
  Flex,
} from "@tremor/react";
import BranchPerformanceComparison from "../components/BranchPerformanceComparison";

// Mock branch data
const branches = [
  { id: "all", name: "All Branches" },
  { id: "main", name: "Main Campus" },
  { id: "east", name: "East Side" },
  { id: "west", name: "West End" },
  { id: "south", name: "South Chapel" },
];

// Mock branch performance metrics
const branchMetrics = [
  {
    id: "main",
    name: "Main Campus",
    metrics: {
      attendance: { value: 1250, trend: "+5.2%" },
      giving: { value: "$78,500", trend: "+7.8%" },
      newMembers: { value: 45, trend: "+15.3%" },
      volunteerRate: { value: "18.5%", trend: "+2.1%" },
      discipleshipGroups: { value: 42, trend: "+4.5%" },
      engagement: { value: "72.4%", trend: "+3.8%" },
    },
  },
  {
    id: "east",
    name: "East Side",
    metrics: {
      attendance: { value: 520, trend: "+8.3%" },
      giving: { value: "$35,750", trend: "+12.4%" },
      newMembers: { value: 28, trend: "+24.5%" },
      volunteerRate: { value: "22.0%", trend: "+5.8%" },
      discipleshipGroups: { value: 25, trend: "+13.6%" },
      engagement: { value: "76.2%", trend: "+6.4%" },
    },
  },
  {
    id: "west",
    name: "West End",
    metrics: {
      attendance: { value: 430, trend: "+3.5%" },
      giving: { value: "$28,900", trend: "+4.2%" },
      newMembers: { value: 18, trend: "+5.8%" },
      volunteerRate: { value: "15.8%", trend: "+1.2%" },
      discipleshipGroups: { value: 18, trend: "+2.8%" },
      engagement: { value: "65.8%", trend: "+1.5%" },
    },
  },
  {
    id: "south",
    name: "South Chapel",
    metrics: {
      attendance: { value: 305, trend: "+12.6%" },
      giving: { value: "$21,300", trend: "+15.3%" },
      newMembers: { value: 22, trend: "+26.8%" },
      volunteerRate: { value: "25.5%", trend: "+8.2%" },
      discipleshipGroups: { value: 14, trend: "+16.7%" },
      engagement: { value: "78.5%", trend: "+9.3%" },
    },
  },
];

export default function BranchPerformancePage() {
  const [selectedBranch, setSelectedBranch] = useState("all");

  // Get selected branch data
  const selectedBranchData =
    branchMetrics.find((b) => b.id === selectedBranch) || branchMetrics[0];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link href="/dashboard/analytics" className="mr-4">
            <ArrowLeftIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Branch Performance
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Compare metrics and benchmarks across all church branches
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            Export Report
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <AdjustmentsHorizontalIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            Customize Metrics
          </button>
        </div>
      </div>

      {/* Branch Performance Chart */}
      <div className="mt-6">
        <BranchPerformanceComparison />
      </div>

      {/* Branch Cards */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Branch Performance Cards
          </h2>
          <div className="flex space-x-2">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
            <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {branchMetrics.map((branch) => (
            <Card
              key={branch.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-2">
                <Title>{branch.name}</Title>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium 
                  ${branch.id === "east" || branch.id === "south" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                >
                  {branch.id === "east" || branch.id === "south"
                    ? "High Growth"
                    : "Stable"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Text className="text-xs text-gray-500">Attendance</Text>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-semibold">
                      {branch.metrics.attendance.value}
                    </span>
                    <span className="text-xs text-green-600">
                      {branch.metrics.attendance.trend}
                    </span>
                  </div>
                </div>

                <div>
                  <Text className="text-xs text-gray-500">Monthly Giving</Text>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-semibold">
                      {branch.metrics.giving.value}
                    </span>
                    <span className="text-xs text-green-600">
                      {branch.metrics.giving.trend}
                    </span>
                  </div>
                </div>

                <div>
                  <Text className="text-xs text-gray-500">New Members</Text>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-semibold">
                      {branch.metrics.newMembers.value}
                    </span>
                    <span className="text-xs text-green-600">
                      {branch.metrics.newMembers.trend}
                    </span>
                  </div>
                </div>

                <div>
                  <Text className="text-xs text-gray-500">Volunteer Rate</Text>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-lg font-semibold">
                      {branch.metrics.volunteerRate.value}
                    </span>
                    <span className="text-xs text-green-600">
                      {branch.metrics.volunteerRate.trend}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text className="text-xs text-gray-500">Discipleship</Text>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-semibold">
                        {branch.metrics.discipleshipGroups.value}
                      </span>
                      <span className="text-xs text-green-600">
                        {branch.metrics.discipleshipGroups.trend}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Text className="text-xs text-gray-500">Engagement</Text>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-semibold">
                        {branch.metrics.engagement.value}
                      </span>
                      <span className="text-xs text-green-600">
                        {branch.metrics.engagement.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/dashboard/analytics/performance/${branch.id}`}
                  className="inline-block text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View detailed report →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Benchmarks */}
      <div className="mt-8">
        <Card>
          <Title>Performance Benchmarks & Insights</Title>

          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <Text className="font-medium">Size vs. Engagement</Text>
              <Text className="text-sm text-gray-600">
                Smaller branches (South Chapel, East Side) show higher
                engagement rates than larger branches, demonstrating the
                effectiveness of intimate community connections.
              </Text>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <Text className="font-medium">Growth Leader: South Chapel</Text>
              <Text className="text-sm text-gray-600">
                South Chapel is experiencing the fastest percentage growth
                across multiple metrics, including new membership (+26.8%) and
                volunteer participation (+8.2%).
              </Text>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <Text className="font-medium">
                Resource Allocation Recommendation
              </Text>
              <Text className="text-sm text-gray-600">
                West End shows the lowest growth rates across most metrics.
                Consider implementing best practices from South Chapel and East
                Side, particularly in member engagement and volunteer
                recruitment.
              </Text>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <Text className="font-medium">Overall Organization Health</Text>
              <Text className="text-sm text-gray-600">
                The church network is experiencing healthy growth across all
                branches (average +7.4% in attendance), with smaller branches
                growing faster but Main Campus continuing to provide stability
                and leadership.
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
