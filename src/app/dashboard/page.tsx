"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OverviewWidgets } from "@/components/dashboard/OverviewWidgets";
import { FinancesSummary } from "@/components/dashboard/FinancesSummary";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchPerformance } from "@/components/dashboard/BranchPerformance";
import { AdminTools } from "@/components/dashboard/AdminTools";
import {useOrganizationBranchFilter} from "@/graphql/hooks/useOrganizationBranchFilter";
import {useQuery} from "@apollo/client";
import {GET_SUPER_ADMIN_DASHBOARD} from "@/graphql/queries/dashboardQueries";

export default function DashboardPage() {
  const { organisationId } = useOrganizationBranchFilter();
  const { data, loading, error } = useQuery(GET_SUPER_ADMIN_DASHBOARD, {
    variables: { organisationId }, // Pass organisationId if you want to filter, or omit if not needed
  });
  const dashboard = data?.superAdminDashboardData;

  console.log("dashboard data:", dashboard?.financialOverview?.topGivingBranches);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
      {/* Sidebar */}
      {/*<DashboardSidebar className="hidden lg:flex shadow-xl" />*/}
      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 drop-shadow-sm">Welcome back, {dashboard?.organisationOverview.organisations?.[0]?.name}</h1>
            <p className="text-gray-500 text-base">Here’s an overview of church operations across all branches.</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Notification bell placeholder */}
            <button className="relative p-2 rounded-full bg-white border shadow hover:bg-blue-100 transition">
              <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><path d="M11 3a5 5 0 0 1 5 5v2.5c0 .7.3 1.4.8 1.9l.2.2c.6.6.9 1.5.7 2.3-.3 1-1.2 1.6-2.2 1.6H6.5c-1 0-1.9-.6-2.2-1.6-.2-.8.1-1.7.7-2.3l.2-.2c.5-.5.8-1.2.8-1.9V8a5 5 0 0 1 5-5Z" stroke="#2563eb" strokeWidth="1.5"/><circle cx="11" cy="18" r="1.5" fill="#eab308"/></svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 border-2 border-white rounded-full animate-pulse" />
            </button>
          </div>
        </header>
        <OverviewWidgets
            branches={dashboard?.branchesSummary?.total}
            members={dashboard?.memberSummary?.total}
            attendance={dashboard?.attendanceOverview?.totalAttendance}
            newMembers={dashboard?.memberSummary?.newMembersThisMonth}
        />
        <FinancesSummary
          totalContributions={dashboard?.financialOverview?.totalContributions}
          topBranches={dashboard?.financialOverview?.topGivingBranches?.map(b => ({branchId: b?.branchId, branchName: b?.branchName, amount: b?.totalGiven })) ?? []}
          expensesVsIncome={dashboard?.financialOverview ? {
            labels: dashboard.financialOverview.expensesVsIncome?.map(e => e.label) ?? [],
            income: dashboard.financialOverview.expensesVsIncome?.map(e => e.income) ?? [],
            expenses: dashboard.financialOverview.expensesVsIncome?.map(e => e.expenses) ?? [],
          } : undefined}
          pendingApprovals={dashboard?.financialOverview?.pendingApprovals}
        />
        <UpcomingEvents
          events={dashboard?.activityEngagement?.upcomingEvents}
        />
        {/*<BranchPerformance />*/}
        <AdminTools />
      </main>
    </div>
  );
}
