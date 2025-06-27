"use client";

import { ProgressBar } from "@tremor/react";
import { UsersIcon, UserPlusIcon, UserMinusIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react"; // Tooltip removed, not available in Headless UI


interface StatsCardProps {
  title: string;
  metric: string;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "amber" | "rose";
  percentage?: number;
  trend?: string;
}

const AnimatedMetric = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    let start: number | null = null;
    const duration = 800;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplay(Math.floor(progress * (value - 0) + 0));
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
};

const StatsCard = ({ title, metric, icon, color, percentage, trend }: StatsCardProps) => {
  const isPositive = percentage !== undefined && percentage >= 0;
  const isNegative = percentage !== undefined && percentage < 0;
  return (
    <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 transition hover:scale-[1.025] hover:shadow-2xl duration-200 min-w-[230px]">
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-base">
          {icon}
          {title}
        </span>
        {percentage !== undefined && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700' : isNegative ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'}`}
            title={trend}
          >
            {isPositive ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1 text-emerald-400" /> : isNegative ? <ArrowTrendingDownIcon className="h-4 w-4 mr-1 text-rose-400" /> : null}
            {percentage >= 0 ? '+' : ''}{percentage}%
          </span>
        )}
      </div>
      <div className="flex items-end gap-2 mt-2">
        <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          <AnimatedMetric value={parseInt(metric, 10)} />
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar color={color} value={percentage !== undefined ? Math.abs(percentage) : 0} className="rounded-full h-2 bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        {trend}
      </div>
    </div>
  );
};

interface MembersStatsProps {
  totalMembers: number;
  activeMembers: number;
  newMembersInPeriod?: number;
  newMembersThisMonth?: number;  // Legacy property name
  inactiveMembers: number;
  percentageChanges?: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersInPeriod: number;
  };
}

export default function MembersStats({ 
  totalMembers,
  activeMembers,
  newMembersInPeriod,
  newMembersThisMonth,
  inactiveMembers,
  percentageChanges
}: MembersStatsProps) {
  // Use newMembersInPeriod as primary, fall back to newMembersThisMonth for backward compatibility
  const newMembersCount = newMembersInPeriod ?? newMembersThisMonth ?? 0;
  
  // Use percentage changes from API if available, otherwise use default values
  const totalMembersChange = percentageChanges?.totalMembers ?? 0;
  const activeMembersChange = percentageChanges?.activeMembers ?? 0;
  const newMembersChange = percentageChanges?.newMembersInPeriod ?? 0;
  const inactiveMembersChange = percentageChanges?.inactiveMembers ?? 0;
  
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <StatsCard
        title="Total Members"
        metric={totalMembers.toString()}
        icon={<UsersIcon className="h-6 w-6 text-indigo-600" />}
        color="indigo"
        percentage={totalMembersChange}
        trend="vs last month"
      />
      <StatsCard
        title="Active Members"
        metric={activeMembers.toString()}
        icon={<ChartBarIcon className="h-6 w-6 text-emerald-600" />}
        color="emerald"
        percentage={activeMembersChange}
        trend="vs last month"
      />
      <StatsCard
        title="New This Month"
        metric={newMembersCount.toString()}
        icon={<UserPlusIcon className="h-6 w-6 text-amber-600" />}
        color="amber"
        percentage={newMembersChange}
        trend="vs last month"
      />
      <StatsCard
        title="Inactive Members"
        metric={inactiveMembers?.toString()}
        icon={<UserMinusIcon className="h-6 w-6 text-rose-600" />}
        color="rose"
        percentage={inactiveMembersChange}
        trend="vs last month"
      />
    </div>
  );
}
