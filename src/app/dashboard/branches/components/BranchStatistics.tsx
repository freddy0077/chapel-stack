"use client";

import { useMemo } from "react";
import {
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  useBranchStatistics,
  BranchStatistics as BranchStatsType,
} from "../../../../hooks/useBranchStatistics";

interface BranchStatisticsProps {
  branchId: string;
  statistics?: BranchStatsType;
  branchName?: string;
}

export default function BranchStatistics({
  branchId,
  statistics: initialStatistics,
  branchName: initialBranchName,
}: BranchStatisticsProps) {
  // Use the hook to fetch statistics if not provided
  const {
    statistics: fetchedStatistics,
    branchName: fetchedBranchName,
    loading,
  } = useBranchStatistics({
    branchId,
  });

  // Use provided statistics or fetched ones
  const statistics = initialStatistics || fetchedStatistics;
  const branchName = initialBranchName || fetchedBranchName || "this branch";

  // Calculate growth rate (no longer using membershipGrowth array)
  const membershipGrowthRate = useMemo(() => {
    // Since we don't have membershipGrowth array anymore, we'll use newMembersInPeriod as a percentage of total
    if (!statistics?.totalMembers || statistics.totalMembers === 0) return 0;
    return (statistics.newMembersInPeriod / statistics.totalMembers) * 100;
  }, [statistics]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>No statistics available for this branch</p>
        </div>
      </div>
    );
  }

  // Define stat cards with updated field names
  const statCards = [
    {
      title: "Total Members",
      value: statistics.totalMembers,
      icon: UsersIcon,
      color: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Members",
      value: statistics.activeMembers,
      icon: UserGroupIcon,
      color: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Inactive Members",
      value: statistics.inactiveMembers,
      icon: UserGroupIcon,
      color: "bg-yellow-100 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "New Members",
      value: statistics.newMembersInPeriod,
      icon: ArrowUpIcon,
      color: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Weekly Attendance",
      value: statistics.averageWeeklyAttendance || 0,
      icon: CalendarIcon,
      color: "bg-indigo-100 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      title: "Total Families",
      value: statistics.totalFamilies || 0,
      icon: UserGroupIcon,
      color: "bg-pink-100 dark:bg-pink-900/20",
      iconColor: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Total Ministries",
      value: statistics.totalMinistries || 0,
      icon: ChartBarIcon,
      color: "bg-cyan-100 dark:bg-cyan-900/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      title: "Annual Budget",
      value: statistics.annualBudget
        ? `$${statistics.annualBudget.toLocaleString()}`
        : "N/A",
      icon: CurrencyDollarIcon,
      color: "bg-emerald-100 dark:bg-emerald-900/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      isMonetary: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Statistics for {branchName}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Overview of key metrics and performance indicators
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center space-x-4"
          >
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {typeof stat.value === "number" && !stat.isMonetary
                  ? stat.value.toLocaleString()
                  : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
