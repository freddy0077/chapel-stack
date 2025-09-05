"use client";

import React from "react";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { PastoralCareStats as StatsType } from "@/graphql/hooks/usePastoralCare";

interface PastoralCareStatsProps {
  stats?: StatsType;
  loading: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
        <div className="ml-4 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}

export default function PastoralCareStats({
  stats,
  loading,
}: PastoralCareStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(8)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="text-center text-gray-500">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Unable to load pastoral care statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Pastoral Care Overview
      </h2>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Pastoral Visits */}
        <StatCard
          title="Total Visits"
          value={stats.totalVisits}
          icon={<HomeIcon className="h-8 w-8" />}
          color="text-blue-600"
          subtitle={`${stats.completedVisits} completed, ${stats.upcomingVisits} upcoming`}
        />

        {/* Counseling Sessions */}
        <StatCard
          title="Counseling Sessions"
          value={stats.totalSessions}
          icon={<ChatBubbleLeftRightIcon className="h-8 w-8" />}
          color="text-green-600"
          subtitle={`${stats.completedSessions} completed, ${stats.upcomingSessions} upcoming`}
        />

        {/* Care Requests */}
        <StatCard
          title="Care Requests"
          value={stats.totalCareRequests}
          icon={<ExclamationTriangleIcon className="h-8 w-8" />}
          color="text-orange-600"
          subtitle={`${stats.openCareRequests} open, ${stats.resolvedCareRequests} resolved`}
        />

        {/* Follow-up Reminders */}
        <StatCard
          title="Reminders"
          value={stats.totalReminders}
          icon={<BellIcon className="h-8 w-8" />}
          color="text-purple-600"
          subtitle={`${stats.pendingReminders} pending, ${stats.overdueReminders} overdue`}
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visits Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
            <HomeIcon className="h-5 w-5 text-blue-600 mr-2" />
            Pastoral Visits
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                Completed
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.completedVisits}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 text-blue-500 mr-2" />
                Upcoming
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.upcomingVisits}
              </span>
            </div>
          </div>
        </div>

        {/* Sessions Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600 mr-2" />
            Counseling Sessions
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                Completed
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.completedSessions}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 text-blue-500 mr-2" />
                Upcoming
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.upcomingSessions}
              </span>
            </div>
          </div>
        </div>

        {/* Care Requests & Reminders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
            <BellIcon className="h-5 w-5 text-purple-600 mr-2" />
            Active Items
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 mr-2" />
                Open Requests
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.openCareRequests}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 flex items-center">
                <ClockIcon className="h-4 w-4 text-red-500 mr-2" />
                Overdue Reminders
              </span>
              <span className="text-sm font-medium text-gray-900">
                {stats.overdueReminders}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
