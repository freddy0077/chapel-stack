"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BranchOverviewWidgets } from "@/components/dashboard/BranchOverviewWidgets";
import { BranchFinancesSummary } from "@/components/dashboard/BranchFinancesSummary";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchPerformance } from "@/components/dashboard/BranchPerformance";
import { BranchAdminTools } from "@/components/dashboard/BranchAdminTools";

const BRANCH_DASHBOARD_QUERY = gql`
  query BranchDashboard($branchId: String!) {
    branchDashboard(branchId: $branchId) {
      branchInfo {
        id
        name
        organisation
        isActive
        admins { id name }
      }
      memberStats { total newMembersThisMonth }
      financeStats {
        totalContributions tithes expenses pledge offering donation specialContribution
      }
      attendanceStats { totalAttendance }
      sacramentStats { totalSacraments }
      activityStats {
        recentEvents { id title startDate }
        upcomingEvents { id title startDate }
      }
      systemStatus {
        timestamp
        database { status latency }
        system {
          totalMemory freeMemory
          memoryUsage { rss heapTotal heapUsed external }
          cpuUsage { user system }
          systemUptime processUptime platform nodeVersion
        }
      }
      branchAnnouncements {
        announcements { id title startDate }
      }
    }
  }
`;

export default function BranchDashboardPage() {
  // Replace with actual branchId from context/auth/router
  const branchId = "BRANCH_ID_HERE";
  const userName = "Rev. Mensah";

  const { data, loading, error } = useQuery(BRANCH_DASHBOARD_QUERY, {
    variables: { branchId },
    skip: !branchId,
  });

  if (loading) return <div className="p-10">Loading branch dashboard...</div>;
  if (error) return <div className="p-10 text-red-600">Error: {error.message}</div>;

  const dashboard = data?.branchDashboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
      {/* Sidebar (reuse, but could highlight branch context) */}
      {/* <DashboardSidebar className="hidden lg:flex shadow-xl" /> */}
      <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 drop-shadow-sm">
              Welcome back, {userName}
            </h1>
            <p className="text-gray-500 text-base">
              Branch Overview: {dashboard?.branchInfo?.name || "-"}
            </p>
          </div>
        </header>
        <BranchOverviewWidgets branchName={dashboard?.branchInfo?.name || "-"} data={dashboard} />
        <BranchFinancesSummary branchName={dashboard?.branchInfo?.name || "-"} data={dashboard?.financeStats} />
        <UpcomingEvents events={dashboard?.activityStats?.upcomingEvents || []} />
        <BranchPerformance branchName={dashboard?.branchInfo?.name || "-"} data={dashboard} />
        <BranchAdminTools branchName={dashboard?.branchInfo?.name || "-"} />
      </main>
    </div>
  );
}
