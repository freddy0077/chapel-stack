"use client";

import React from "react";
import { Card, Text, Metric, Grid, Flex } from "@tremor/react";
import {
  UserMinusIcon,
  ClockIcon,
  HeartIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface DeathRegisterStatsProps {
  stats?: {
    totalDeaths?: number;
    thisYear?: number;
    averageAge?: number;
    pendingNotifications?: number;
  };
  loading?: boolean;
}

export const DeathRegisterStats: React.FC<DeathRegisterStatsProps> = ({
  stats,
  loading = false,
}) => {
  const statsData = [
    {
      title: "Total Deaths",
      value: stats?.totalDeaths || 0,
      icon: UserMinusIcon,
      gradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      textColor: "text-blue-600",
      valueColor: "text-blue-900",
    },
    {
      title: "This Year",
      value: stats?.thisYear || 0,
      icon: ClockIcon,
      gradient: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-500",
      textColor: "text-amber-600",
      valueColor: "text-amber-900",
    },
    {
      title: "Avg Age",
      value: Math.round(stats?.averageAge || 0),
      icon: HeartIcon,
      gradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-500",
      textColor: "text-purple-600",
      valueColor: "text-purple-900",
    },
    {
      title: "Pending Notifications",
      value: stats?.pendingNotifications || 0,
      icon: BellIcon,
      gradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
      textColor: "text-green-600",
      valueColor: "text-green-900",
    },
  ];

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      {statsData.map((stat) => (
        <Card
          key={stat.title}
          className={`bg-gradient-to-br ${stat.gradient} ${stat.borderColor} hover:shadow-lg transition-all duration-200`}
        >
          <Flex alignItems="center" className="space-x-3">
            <div className={`${stat.iconBg} rounded-lg p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <Text className={`${stat.textColor} font-medium`}>
                {stat.title}
              </Text>
              <Metric className={stat.valueColor}>
                {loading ? "..." : stat.value}
              </Metric>
            </div>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
};
