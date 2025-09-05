"use client";
import { gql, useQuery } from "@apollo/client";
import { RoleRoute } from "@/components/auth/RoleRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BranchOverviewWidgets } from "@/components/dashboard/BranchOverviewWidgets";
import { BranchAnalyticsTrends } from "@/components/dashboard/BranchAnalyticsTrends";
import { BranchActivityFeed } from "@/components/dashboard/BranchActivityFeed";
import { FinancialBreakdown } from "@/components/dashboard/FinancialBreakdown";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchAnnouncements } from "@/components/dashboard/BranchAnnouncements";
import { BranchAdminTools } from "@/components/dashboard/BranchAdminTools";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import BranchFinanceStats from "@/components/BranchFinanceStats";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const BRANCH_DASHBOARD_QUERY = gql`
  query BranchDashboard($branchId: ID!) {
    branchDashboard(branchId: $branchId) {
      branchInfo {
        id
        name
        organisation
        isActive
        admins {
          id
          name
        }
      }
      memberStats {
        total
        newMembersThisMonth
        growthRate
        monthlyTrends {
          month
          year
          totalMembers
          newMembers
        }
      }
      financeStats {
        totalContributions
        totalExpenses
        tithes
        pledge
        offering
        donation
        specialContribution
        growthRate
        netIncome
        monthlyTrends {
          month
          year
          contributions
          expenses
          netIncome
        }
      }
      attendanceStats {
        totalAttendance
        uniqueAttendeesThisMonth
        averageAttendance
        growthRate
        monthlyTrends {
          month
          year
          totalAttendance
          uniqueAttendees
        }
      }
      sacramentStats {
        totalSacraments
        breakdown {
          type
          count
        }
        monthlyTrends {
          month
          count
        }
      }
      activityStats {
        recentEvents {
          id
          title
          startDate
        }
        upcomingEvents {
          id
          title
          startDate
        }
        recentMembers {
          id
          name
          joinedAt
        }
        recentContributions {
          id
          amount
          date
          type
        }
        recentSacraments {
          id
          type
          date
          memberName
        }
        activitySummary {
          newMembersCount
          contributionsCount
          sacramentsCount
          attendanceRecordsCount
          totalActivities
        }
      }
      systemStatus {
        timestamp
        database {
          status
          latency
        }
        system {
          totalMemory
          freeMemory
          memoryUsage {
            rss
            heapTotal
            heapUsed
            external
          }
          cpuUsage {
            user
            system
          }
          systemUptime
          processUptime
          platform
          nodeVersion
        }
      }
      branchAnnouncements {
        announcements {
          id
          title
          startDate
        }
      }
    }
  }
`;

export default function BranchDashboardPage() {
  // Replace with actual branchId from context/auth/router
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId } = useOrganisationBranch();
  const userName = user?.firstName || user?.lastName;

  const { data, loading, error } = useQuery(BRANCH_DASHBOARD_QUERY, {
    variables: { branchId },
    skip: !branchId,
  });

  // Fetch funds for this branch for the finance stats component
  const {
    data: fundsData,
    loading: fundsLoading,
    error: fundsError,
  } = useQuery(
    gql`
      query GetFunds($organisationId: String!, $branchId: String) {
        funds(organisationId: $organisationId, branchId: $branchId) {
          id
          name
          description
          branchId
        }
      }
    `,
    {
      variables: { organisationId, branchId },
      skip: !organisationId || !branchId,
    },
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading branch dashboard...
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading branch dashboard.
      </div>
    );
  }
  const branchDashboard = data?.branchDashboard;
  if (!branchDashboard) {
    return (
      <div className="p-10 text-center">No data available for this branch.</div>
    );
  }

  return (
    <RoleRoute>
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
            sacramentStats={branchDashboard.sacramentStats}
            activityStats={branchDashboard.activityStats}
          />

          {/* Enhanced Analytics Trends */}
          <BranchAnalyticsTrends
            memberTrends={branchDashboard.memberStats.monthlyTrends}
            financeTrends={branchDashboard.financeStats.monthlyTrends}
            attendanceTrends={branchDashboard.attendanceStats.monthlyTrends}
            sacramentBreakdown={branchDashboard.sacramentStats.breakdown}
            sacramentTrends={branchDashboard.sacramentStats.monthlyTrends}
          />

          {/* Enhanced Activity Feed */}
          <BranchActivityFeed
            recentMembers={branchDashboard.activityStats.recentMembers || []}
            recentContributions={
              branchDashboard.activityStats.recentContributions || []
            }
            recentSacraments={
              branchDashboard.activityStats.recentSacraments || []
            }
            activitySummary={branchDashboard.activityStats.activitySummary}
          />

          {/* Financial Components */}
          <BranchFinanceStats
            organisationId={organisationId}
            branchId={branchId}
            funds={fundsData?.funds || []}
          />
          <FinancialBreakdown financeStats={branchDashboard.financeStats} />

          {/* Events and Admin */}
          <UpcomingEvents
            events={branchDashboard.activityStats.upcomingEvents}
          />
          <BranchAnnouncements
            branchAnnouncements={branchDashboard.branchAnnouncements}
          />
          <BranchAdminTools branchInfo={branchDashboard.branchInfo} />
        </main>
      </div>
    </RoleRoute>
  );
}
