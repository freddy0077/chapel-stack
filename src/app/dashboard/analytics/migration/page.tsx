"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  MapPinIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import MemberMigrationPatterns from "../components/MemberMigrationPatterns";
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Select,
  SelectItem,
  Flex,
  Subtitle,
  DateRangePicker,
} from "@tremor/react";

// Mock branch data
const branches = [
  { id: "all", name: "All Branches" },
  { id: "main", name: "Main Campus" },
  { id: "east", name: "East Side" },
  { id: "west", name: "West End" },
  { id: "south", name: "South Chapel" },
];

// Mock migration summary data
const migrationSummary = [
  {
    title: "Total Migrations",
    value: "97",
    change: "+12.8% from last quarter",
    color: "indigo",
  },
  {
    title: "Net Branch Changes",
    value: "53",
    change: "+8.5% from last quarter",
    color: "emerald",
  },
  {
    title: "Average Distance",
    value: "8.3 mi",
    change: "-2.1 from last quarter",
    color: "amber",
  },
  {
    title: "Most Common Reason",
    value: "Relocated",
    change: "44% of all migrations",
    color: "rose",
  },
];

export default function MemberMigrationPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("quarter");

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
              Member Migration Patterns
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and analyze how members move between branches
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
            <DocumentChartBarIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            <option value="month">Last 30 Days</option>
            <option value="quarter">Current Quarter</option>
            <option value="year">Last 12 Months</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {selectedTimeframe === "custom" && (
          <div className="sm:max-w-md sm:flex-1">
            <label
              htmlFor="date-range"
              className="block text-sm font-medium text-gray-700"
            >
              Date Range
            </label>
            <DateRangePicker
              className="mt-1"
              enableDropdown={true}
              placeholder="Select date range"
            />
          </div>
        )}
      </div>

      {/* Migration Summary Stats */}
      <div className="mt-6">
        <Grid numItems={1} numItemsMd={2} numItemsLg={4} className="gap-6">
          {migrationSummary.map((stat, idx) => (
            <Card key={idx} decoration="top" decorationColor={stat.color}>
              <Text>{stat.title}</Text>
              <Flex
                justifyContent="start"
                alignItems="baseline"
                className="space-x-2"
              >
                <Title>{stat.value}</Title>
                <Text className="text-xs text-gray-500">{stat.change}</Text>
              </Flex>
            </Card>
          ))}
        </Grid>
      </div>

      {/* Migration Patterns Chart */}
      <div className="mt-6">
        <MemberMigrationPatterns />
      </div>

      {/* Migration Details */}
      <div className="mt-8">
        <Card>
          <Title>Recent Member Migrations</Title>
          <Subtitle>Member branch changes in the past 30 days</Subtitle>

          <div className="mt-4 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Member
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    From Branch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    To Branch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Primary Reason
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Sarah Johnson
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Main Campus
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    East Side
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 8, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Relocated/Moved
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Michael Williams
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    West End
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Main Campus
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 5, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Program Offerings
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Jennifer Lopez
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    South Chapel
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Main Campus
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Apr 2, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Preferred Service Style
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    David Smith
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Main Campus
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    West End
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 29, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Closer to Home
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Amanda Lee
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    East Side
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    South Chapel
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 26, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Relocated/Moved
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            <Link
              href="/dashboard/analytics/migration/history"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View complete migration history →
            </Link>
          </div>
        </Card>
      </div>

      {/* Location Impact Analysis */}
      <div className="mt-8">
        <Card>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <Title>Location Impact Analysis</Title>
              <Subtitle>
                Geographical factors affecting member migrations
              </Subtitle>
            </div>
            <div className="mt-4 sm:mt-0">
              <MapPinIcon className="h-6 w-6 text-gray-400" />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-md">
              <Text className="font-medium">Relocation Patterns</Text>
              <Text className="text-sm text-gray-600">
                44% of all branch migrations are due to members relocating, with
                most movement occurring between Main Campus and East Side (urban
                to suburban transition). Consider strategic branch placement to
                accommodate population shifts.
              </Text>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <Text className="font-medium">Distance Factor</Text>
              <Text className="text-sm text-gray-600">
                Members who travel more than 15 miles to attend service are 3.2x
                more likely to switch to a closer branch within 6 months. The
                average commute distance for stable members is 8.3 miles,
                suggesting this as an optimal radius for member retention.
              </Text>
            </div>

            <div className="bg-amber-50 p-4 rounded-md">
              <Text className="font-medium">Growth Opportunity Zones</Text>
              <Text className="text-sm text-gray-600">
                Analysis of migration patterns reveals three high-potential
                areas for new branch development: North Ridge (12 miles from
                Main Campus), Westlake District (18 miles from West End), and
                River Valley (14 miles from East Side).
              </Text>
            </div>
          </div>
        </Card>
      </div>

      {/* Member Migration Survey */}
      <div className="mt-8">
        <Card className="bg-indigo-50">
          <Flex justifyContent="between" alignItems="center">
            <div>
              <Title className="text-indigo-900">
                Migration Experience Survey
              </Title>
              <Text className="text-indigo-700">
                Understand the member experience during branch transitions
              </Text>
            </div>
            <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-500" />
          </Flex>

          <div className="mt-4">
            <Text className="text-indigo-700">
              Last updated April 5, 2025 | 76 responses
            </Text>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="bg-white p-4 rounded-md">
                <Text className="font-medium">Member Satisfaction</Text>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold text-indigo-700">
                    86%
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    reported a smooth transition between branches
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md">
                <Text className="font-medium">Improved Experience</Text>
                <div className="flex items-center mt-2">
                  <span className="text-3xl font-bold text-indigo-700">
                    62%
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    reported improved engagement after changing branches
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/dashboard/analytics/migration/survey-results"
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View Full Survey Results
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
