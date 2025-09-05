"use client";

import { ApolloError } from "@apollo/client";
import { DashboardData } from "@/hooks/useDashboardData";
import KpiCardGrid from "./KpiCardGrid";
import ChartContainer from "./ChartContainer";
import AnnouncementsWidget from "./AnnouncementsWidget";
import UpcomingEventsWidget from "./UpcomingEventsWidget";
import NotificationsWidget from "./NotificationsWidget";
import TasksWidget from "./TasksWidget";
import QuickLinksWidget from "./QuickLinksWidget";
import GroupsWidget from "./GroupsWidget";

interface DashboardContentProps {
  dashboardData: DashboardData | undefined;
  isLoading: boolean;
  error: ApolloError | undefined;
  refetch: () => void;
}

export default function DashboardContent({
  dashboardData,
  isLoading,
  error,
  refetch,
}: DashboardContentProps) {
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen justify-center items-center flex-col">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Loading Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen justify-center items-center flex-col">
          <div className="text-red-600 text-xl mb-4">
            Error loading dashboard data
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen justify-center items-center flex-col">
          <div className="text-gray-600 text-xl mb-4">
            No dashboard data available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 space-y-6">
      {/* Display branch name and dashboard type if available */}
      {dashboardData.branchName && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {dashboardData.branchName} Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            {dashboardData.dashboardType} View • Last updated:{" "}
            {new Date(dashboardData.generatedAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* KPI Cards Grid */}
      {dashboardData.kpiCards && dashboardData.kpiCards.length > 0 && (
        <KpiCardGrid cards={dashboardData.kpiCards} />
      )}

      {/* Charts Grid */}
      {dashboardData.charts && dashboardData.charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {dashboardData.charts.map((chart, index) => (
            <ChartContainer key={chart.id || `chart-${index}`} chart={chart} />
          ))}
        </div>
      )}

      {/* Widgets Section - 2 columns on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Announcements Widget */}
        {dashboardData.announcements && (
          <div className="col-span-1">
            <AnnouncementsWidget widget={dashboardData.announcements} />
          </div>
        )}

        {/* Upcoming Events Widget */}
        {dashboardData.upcomingEvents && (
          <div className="col-span-1">
            <UpcomingEventsWidget widget={dashboardData.upcomingEvents} />
          </div>
        )}

        {/* Tasks Widget */}
        {dashboardData.tasks && (
          <div className="col-span-1">
            <TasksWidget widget={dashboardData.tasks} />
          </div>
        )}

        {/* Notifications Widget */}
        {dashboardData.notifications && (
          <div className="col-span-1">
            <NotificationsWidget widget={dashboardData.notifications} />
          </div>
        )}

        {/* Groups Widget */}
        {dashboardData.myGroups && (
          <div className="col-span-1">
            <GroupsWidget widget={dashboardData.myGroups} />
          </div>
        )}

        {/* Quick Links Widget - Full width */}
        {dashboardData.quickLinks && (
          <div className="col-span-1 lg:col-span-2">
            <QuickLinksWidget widget={dashboardData.quickLinks} />
          </div>
        )}
      </div>
    </div>
  );
}
