"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  UserPlusIcon,
  EyeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { useMemberStatistics } from "@/graphql/hooks/useMemberStatistics";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import type { MemberStatistics } from "@/graphql/queries/memberStatisticsQueries";

interface MemberStatsProps {
  isLoading?: boolean;
}

const MemberStats: React.FC<MemberStatsProps> = ({ isLoading = false }) => {
  // Get organization and branch context
  const { organisationId, branchId } = useOrganisationBranch();

  // Use the hook with proper parameters
  const {
    stats: memberStatistics,
    loading,
    error,
  } = useMemberStatistics(branchId, organisationId);

  console.log("stats", {
    memberStatistics,
    loading,
    error,
    branchId,
    organisationId,
  });

  // Calculate derived stats
  const activeMembers = memberStatistics?.activeMembers || 0;
  const inactiveMembers = memberStatistics?.inactiveMembers || 0;
  const newThisMonth = memberStatistics?.newMembersInPeriod || 0;
  const visitorsThisMonth = memberStatistics?.visitorsInPeriod || 0;
  const averageAge = memberStatistics?.averageAge || 0;
  const retentionRate = memberStatistics?.retentionRate || 0;
  const conversionRate = memberStatistics?.conversionRate || 0;

  // Calculate percentage changes
  const activePercentage =
    (memberStatistics?.totalMembers || 0) > 0
      ? Math.round(
          (activeMembers / (memberStatistics?.totalMembers || 1)) * 100,
        )
      : 0;
  const monthlyGrowth = memberStatistics?.growthRate || 0;
  const lastMonthNewMembers =
    memberStatistics?.lastMonth?.newMembersInPeriod || 0;

  const stats = [
    {
      title: "Total Members",
      value: loading
        ? "..."
        : (memberStatistics?.totalMembers || 0).toLocaleString(),
      icon: UsersIcon,
      change: `${activePercentage}% active`,
      changeType: "neutral" as const,
      color: "bg-blue-500",
    },
    {
      title: "Active Members",
      value: loading ? "..." : activeMembers.toLocaleString(),
      icon: UserPlusIcon,
      change: `${monthlyGrowth.toFixed(1)}% this month`,
      changeType: "positive" as const,
      color: "bg-green-500",
    },
    {
      title: "New This Month",
      value: loading ? "..." : newThisMonth.toLocaleString(),
      icon: ArrowTrendingUpIcon,
      change: `${lastMonthNewMembers} last month`,
      changeType: "positive" as const,
      color: "bg-purple-500",
    },
    {
      title: "Inactive Members",
      value: loading ? "..." : inactiveMembers.toLocaleString(),
      icon: ArrowTrendingDownIcon,
      change: `${Math.round((inactiveMembers / (memberStatistics?.totalMembers || 1)) * 100)}% of total`,
      changeType: "negative" as const,
      color: "bg-orange-500",
    },
    {
      title: "Visitors This Month",
      value: loading ? "..." : visitorsThisMonth.toLocaleString(),
      icon: EyeIcon,
      change: "",
      changeType: "neutral" as const,
      color: "bg-yellow-500",
    },
    {
      title: "Average Age",
      value: loading ? "..." : averageAge.toLocaleString(),
      icon: ChartBarIcon,
      change: "",
      changeType: "neutral" as const,
      color: "bg-blue-500",
    },
    {
      title: "Retention Rate",
      value: loading ? "..." : `${retentionRate.toFixed(1)}%`,
      icon: UserPlusIcon,
      change: "",
      changeType: "positive" as const,
      color: "bg-green-500",
    },
    {
      title: "Conversion Rate",
      value: loading ? "..." : `${conversionRate.toFixed(1)}%`,
      icon: ArrowTrendingUpIcon,
      change: "",
      changeType: "positive" as const,
      color: "bg-purple-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">
            Failed to load member statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              {stat.change && (
                <div className="flex items-center text-sm">
                  <span
                    className={`
                      ${stat.changeType === "positive" ? "text-green-600" : ""}
                      ${stat.changeType === "negative" ? "text-red-600" : ""}
                      ${stat.changeType === "neutral" ? "text-gray-600" : ""}
                    `}
                  >
                    {stat.change}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}

      {/* Additional Statistics Panel */}
      {memberStatistics && (
        <motion.div
          variants={itemVariants}
          className="xl:col-span-4 lg:col-span-4 md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4"
        >
          <div className="flex items-center gap-2 mb-6">
            <ChartBarIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Analytics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Gender Distribution */}
            {memberStatistics?.genderDistribution && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Gender Distribution
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Male:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {memberStatistics.genderDistribution.maleCount}
                      </span>
                      <span className="text-xs text-gray-500">
                        (
                        {memberStatistics.genderDistribution.malePercentage.toFixed(
                          1,
                        )}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Female:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {memberStatistics.genderDistribution.femaleCount}
                      </span>
                      <span className="text-xs text-gray-500">
                        (
                        {memberStatistics.genderDistribution.femalePercentage.toFixed(
                          1,
                        )}
                        %)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Other:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {memberStatistics.genderDistribution.otherCount}
                      </span>
                      <span className="text-xs text-gray-500">
                        (
                        {memberStatistics.genderDistribution.otherPercentage.toFixed(
                          1,
                        )}
                        %)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Age Distribution */}
            {memberStatistics?.ageGroups && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Age Groups
                </h4>
                <div className="space-y-2 text-sm">
                  {memberStatistics.ageGroups.map((group) => (
                    <div
                      key={group.range}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">{group.range}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {group.count}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({group.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Distribution */}
            {memberStatistics?.membersByStatus && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  Member Status
                </h4>
                <div className="space-y-2 text-sm">
                  {memberStatistics.membersByStatus.map((item) => (
                    <div
                      key={item.status}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">{item.status}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {item.count}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Membership Status Distribution */}
            {memberStatistics?.membersByMembershipStatus && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  Membership Type
                </h4>
                <div className="space-y-2 text-sm">
                  {memberStatistics.membersByMembershipStatus.map((item) => (
                    <div
                      key={item.status}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">{item.status}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {item.count}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Monthly Comparison */}
          {memberStatistics?.lastMonth && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-4">
                Monthly Comparison
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {memberStatistics.totalMembers}
                  </div>
                  <div className="text-xs text-gray-500">Current Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {memberStatistics.lastMonth.totalMembers}
                  </div>
                  <div className="text-xs text-gray-500">Last Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +{memberStatistics.newMembersInPeriod}
                  </div>
                  <div className="text-xs text-gray-500">New This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {memberStatistics.growthRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Growth Rate</div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MemberStats;
