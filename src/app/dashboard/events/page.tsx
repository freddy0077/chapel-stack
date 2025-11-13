"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import Link from "next/link";
import {
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Card, Metric, Text, Flex, Badge, AreaChart, DonutChart } from "@tremor/react";
import DashboardHeader from "@/components/DashboardHeader";
import Loading from "@/components/ui/Loading";
import { GET_EVENT_STATISTICS, GET_RECENT_REGISTRATIONS } from "@/graphql/queries/eventQueries";

export default function EventsDashboard() {
  const [dateRange, setDateRange] = useState("30"); // Last 30 days

  // Fetch event statistics
  const { data, loading, error } = useQuery(GET_EVENT_STATISTICS, {
    variables: { days: parseInt(dateRange) },
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <Loading />;
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {error.message}</p>
        </div>
      </div>
    );
  }

  const stats = data?.eventStatistics || {
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    confirmedRegistrations: 0,
    averageAttendanceRate: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Event Management"
        subtitle="Manage registrations, attendees, and payments"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/events/registrations"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserGroupIcon className="h-5 w-5 mr-2" />
            View All Registrations
          </Link>
          <Link
            href="/dashboard/events/registrations/pending-approval"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Pending Approvals
            {stats.pendingApprovals > 0 && (
              <Badge className="ml-2 bg-white text-orange-600">
                {stats.pendingApprovals}
              </Badge>
            )}
          </Link>
          <Link
            href="/dashboard/events/payments"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            Payment Tracking
          </Link>
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Event Calendar
          </Link>
        </div>

        {/* Date Range Filter */}
        <div className="mb-6 flex justify-end">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Events */}
          <Card decoration="top" decorationColor="blue">
            <Flex alignItems="start">
              <div>
                <Text>Total Events</Text>
                <Metric>{stats.totalEvents}</Metric>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </Flex>
            <Flex className="mt-4">
              <Text className="text-sm text-gray-600">
                Active events in selected period
              </Text>
            </Flex>
          </Card>

          {/* Total Registrations */}
          <Card decoration="top" decorationColor="purple">
            <Flex alignItems="start">
              <div>
                <Text>Total Registrations</Text>
                <Metric>{stats.totalRegistrations}</Metric>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-purple-600" />
              </div>
            </Flex>
            <Flex className="mt-4">
              <Text className="text-sm text-gray-600">
                All event registrations
              </Text>
            </Flex>
          </Card>

          {/* Total Revenue */}
          <Card decoration="top" decorationColor="green">
            <Flex alignItems="start">
              <div>
                <Text>Total Revenue</Text>
                <Metric>GHS {stats.totalRevenue?.toFixed(2) || "0.00"}</Metric>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </Flex>
            <Flex className="mt-4">
              <Text className="text-sm text-gray-600">
                From paid events
              </Text>
            </Flex>
          </Card>

          {/* Pending Approvals */}
          <Card decoration="top" decorationColor="orange">
            <Flex alignItems="start">
              <div>
                <Text>Pending Approvals</Text>
                <Metric>{stats.pendingApprovals}</Metric>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
            </Flex>
            <Flex className="mt-4">
              <Link
                href="/dashboard/events/registrations/pending-approval"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Review pending →
              </Link>
            </Flex>
          </Card>

          {/* Confirmed Registrations */}
          <Card decoration="top" decorationColor="emerald">
            <Flex alignItems="start">
              <div>
                <Text>Confirmed</Text>
                <Metric>{stats.confirmedRegistrations}</Metric>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </Flex>
            <Flex className="mt-4">
              <Text className="text-sm text-gray-600">
                Approved registrations
              </Text>
            </Flex>
          </Card>

          {/* Average Attendance Rate */}
          <Card decoration="top" decorationColor="indigo">
            <Flex alignItems="start">
              <div>
                <Text>Avg. Attendance Rate</Text>
                <Metric>{stats.averageAttendanceRate}%</Metric>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
              </div>
            </Flex>
            <Flex className="mt-4">
              <Text className="text-sm text-gray-600">
                Registered vs attended
              </Text>
            </Flex>
          </Card>
        </div>

        {/* Recent Registrations */}
        <Card className="mb-8">
          <Flex>
            <div>
              <Text className="text-lg font-semibold">Recent Registrations</Text>
              <Text className="text-sm text-gray-600">Last 10 registrations</Text>
            </div>
            <Link
              href="/dashboard/events/registrations"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all →
            </Link>
          </Flex>

          <div className="mt-6">
            <RecentRegistrationsList />
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLinkCard
            href="/dashboard/events/attendees"
            icon={UserGroupIcon}
            title="Attendee Management"
            description="View and manage attendees"
            color="blue"
          />
          <QuickLinkCard
            href="/dashboard/events/attendees/check-in"
            icon={CheckCircleIcon}
            title="Check-In System"
            description="Check in event attendees"
            color="green"
          />
          <QuickLinkCard
            href="/dashboard/events/analytics"
            icon={ChartBarIcon}
            title="Analytics & Reports"
            description="View event insights"
            color="purple"
          />
          <QuickLinkCard
            href="/dashboard/events/communications"
            icon={EnvelopeIcon}
            title="Communications"
            description="Email/SMS to registrants"
            color="orange"
          />
        </div>
      </div>
    </div>
  );
}

// Recent Registrations List Component
function RecentRegistrationsList() {
  const { data, loading } = useQuery(GET_RECENT_REGISTRATIONS, {
    variables: { limit: 10 },
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  const registrations = data?.recentRegistrations || [];

  if (registrations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserGroupIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p>No recent registrations</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {registrations.map((registration: any) => (
            <tr key={registration.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {registration.member
                    ? `${registration.member.firstName} ${registration.member.lastName}`
                    : registration.guestName}
                </div>
                <div className="text-sm text-gray-500">
                  {registration.member ? "Member" : "Guest"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {registration.event?.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(registration.registrationDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  color={
                    registration.status === "CONFIRMED"
                      ? "green"
                      : registration.status === "PENDING"
                        ? "yellow"
                        : "gray"
                  }
                >
                  {registration.status}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  color={
                    registration.paymentStatus === "completed"
                      ? "green"
                      : registration.paymentStatus === "pending"
                        ? "yellow"
                        : "gray"
                  }
                >
                  {registration.paymentStatus || "N/A"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Quick Link Card Component
interface QuickLinkCardProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: "blue" | "green" | "purple" | "orange";
}

function QuickLinkCard({ href, icon: Icon, title, description, color }: QuickLinkCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
  };

  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <div className={`p-3 rounded-lg inline-block mb-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <Text className="font-semibold mb-1">{title}</Text>
        <Text className="text-sm text-gray-600">{description}</Text>
      </Card>
    </Link>
  );
}
