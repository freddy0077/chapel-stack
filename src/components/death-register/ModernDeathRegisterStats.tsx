"use client";

import React from "react";
import {
  UserMinusIcon,
  ClockIcon,
  HeartIcon,
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarDaysIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface ModernDeathRegisterStatsProps {
  stats?: {
    total?: number;
    thisYear?: number;
    thisMonth?: number;
    averageAge?: number;
    burialCount?: number;
    cremationCount?: number;
    familyNotifiedCount?: number;
    funeralServicesHeld?: number;
    pendingNotifications?: number;
    lastYearComparison?: number; // percentage change from last year
    averageAgeChange?: number; // change in average age
  };
  loading?: boolean;
}

export const ModernDeathRegisterStats: React.FC<
  ModernDeathRegisterStatsProps
> = ({ stats, loading = false }) => {
  const statsData = [
    {
      title: "Total Deaths",
      value: stats?.total || 0,
      subtitle: "All time records",
      icon: UserMinusIcon,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      textColor: "text-blue-600",
      valueColor: "text-blue-900",
      trend: null,
    },
    {
      title: "This Year",
      value: stats?.thisYear || 0,
      subtitle: `${stats?.thisMonth || 0} this month`,
      icon: CalendarDaysIcon,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-500",
      textColor: "text-emerald-600",
      valueColor: "text-emerald-900",
      trend: stats?.lastYearComparison,
      trendLabel: "vs last year",
    },
    {
      title: "Average Age",
      value: Math.round(stats?.averageAge || 0),
      subtitle: "Years at passing",
      icon: HeartIcon,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
      textColor: "text-purple-600",
      valueColor: "text-purple-900",
      trend: stats?.averageAgeChange,
      trendLabel: "age change",
    },
    {
      title: "Pending Notifications",
      value: stats?.pendingNotifications || 0,
      subtitle: "Require attention",
      icon: BellIcon,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-500",
      textColor: "text-amber-600",
      valueColor: "text-amber-900",
      trend: null,
      urgent: (stats?.pendingNotifications || 0) > 0,
    },
  ];

  const formatTrend = (trend: number | null | undefined, label?: string) => {
    if (trend === null || trend === undefined) return null;

    const isPositive = trend > 0;
    const isNegative = trend < 0;
    const TrendIcon = isPositive ? ArrowUpIcon : ArrowDownIcon;
    const trendColor = isPositive
      ? "text-red-600"
      : isNegative
        ? "text-green-600"
        : "text-gray-500";

    return (
      <div className={`flex items-center space-x-1 ${trendColor}`}>
        <TrendIcon className="h-3 w-3" />
        <span className="text-xs font-medium">
          {Math.abs(trend)}% {label}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div
          key={stat.title}
          className={`group relative overflow-hidden bg-white rounded-2xl border ${stat.borderColor} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            stat.urgent ? "ring-2 ring-amber-400 ring-opacity-50" : ""
          }`}
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
          ></div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

          {/* Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>

              {stat.urgent && (
                <div className="flex items-center space-x-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  <BellIcon className="h-3 w-3" />
                  <span>Urgent</span>
                </div>
              )}
            </div>

            {/* Value */}
            <div className="mb-2">
              <div
                className={`text-3xl font-bold ${stat.valueColor} leading-none`}
              >
                {stat.value.toLocaleString()}
              </div>
              {stat.trend && (
                <div className="mt-1">
                  {formatTrend(stat.trend, stat.trendLabel)}
                </div>
              )}
            </div>

            {/* Title and subtitle */}
            <div>
              <h3 className={`text-sm font-semibold ${stat.textColor} mb-1`}>
                {stat.title}
              </h3>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>

            {/* Hover effect indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
