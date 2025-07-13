"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BranchOverviewWidgets } from "@/components/dashboard/BranchOverviewWidgets";
import { BranchFinancesSummary } from "@/components/dashboard/BranchFinancesSummary";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchPerformance } from "@/components/dashboard/BranchPerformance";
import { BranchAdminTools } from "@/components/dashboard/BranchAdminTools";
import useAuth from "@/graphql/hooks/useAuth";
import BranchFinanceStats from "@/components/BranchFinanceStats";
import { useQuery as useApolloQuery } from "@apollo/client";

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
  const {user} = useAuth();
  const branchId = user?.userBranches?.[0]?.branch?.id;
  const userName = user?.firstName || user?.lastName;

  const { data, loading, error } = useQuery(BRANCH_DASHBOARD_QUERY, {
    variables: { branchId },
    skip: !branchId,
  });

  // Fetch funds for this branch for the finance stats component
  const { data: fundsData, loading: fundsLoading, error: fundsError } = useApolloQuery(gql`
    query GetFunds($organisationId: String!, $branchId: String) {
      funds(organisationId: $organisationId, branchId: $branchId) {
        id
        name
        description
        branchId
      }
    }
  `, {
    variables: { organisationId: user?.organisationId, branchId },
    skip: !user?.organisationId || !branchId,
  });

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading branch dashboard...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-500">Error loading branch dashboard.</div>;
  }
  const branchDashboard = data?.branchDashboard;
  if (!branchDashboard) {
    return <div className="p-10 text-center">No data available for this branch.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
      {/* Sidebar */}
      {/*<DashboardSidebar className="hidden lg:flex shadow-xl" />*/}
      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 drop-shadow-sm">
              Welcome back, {userName} ({branchDashboard.branchInfo.name})
            </h1>
            <p className="text-gray-500 text-base">
              Here’s an overview of branch operations and stats.
            </p>
          </div>
        </header>
        <BranchOverviewWidgets
          branchName={branchDashboard.branchInfo.name}
          memberStats={branchDashboard.memberStats}
          attendanceStats={branchDashboard.attendanceStats}
          financeStats={branchDashboard.financeStats}
          activityStats={branchDashboard.activityStats}
        />
        {/* Add more widgets as needed, e.g. finances, events, etc. */}
        {/*<BranchFinancesSummary financeStats={branchDashboard.financeStats} />*/}
        {/* BranchFinanceStats: Real-time branch and fund stats */}
        <BranchFinanceStats
          organisationId={user?.organisationId}
          branchId={branchId}
          funds={fundsData?.funds || []}
        />
        {/* Recent Events Section */}
        <section className="my-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Recent Events</h2>
          {branchDashboard.activityStats.recentEvents.length === 0 ? (
            <div className="text-gray-500">No recent events.</div>
          ) : (
            <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white/80 shadow-sm">
              {branchDashboard.activityStats.recentEvents.map((event: any) => (
                <li key={event.id} className="flex items-center px-6 py-4 hover:bg-blue-50 transition">
                  <div className="flex-1">
                    <div className="font-semibold text-blue-900">{event.title}</div>
                    <div className="text-gray-500 text-sm">{new Date(event.startDate).toLocaleString()}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <UpcomingEvents events={branchDashboard.activityStats.upcomingEvents} />
        {/*<BranchPerformance />*/}
        <BranchAdminTools branchInfo={branchDashboard.branchInfo} />
      </main>
    </div>
  );
}
