import React from "react";
import { 
  UsersIcon, 
  UserPlusIcon, 
  CalendarDaysIcon, 
  ChartBarIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from "@heroicons/react/24/outline";
import { formatCurrencyWhole } from "@/utils/currency";

interface MemberMonthlyTrend {
  month: number;
  year: number;
  totalMembers: number;
  newMembers: number;
}

interface MemberStats {
  total: number;
  newMembersThisMonth: number;
  growthRate: number;
  monthlyTrends: MemberMonthlyTrend[];
}

interface AttendanceMonthlyTrend {
  month: number;
  year: number;
  totalAttendance: number;
  uniqueAttendees: number;
}

interface AttendanceStats {
  totalAttendance: number;
  uniqueAttendeesThisMonth: number;
  averageAttendance: number;
  growthRate: number;
  monthlyTrends: AttendanceMonthlyTrend[];
}

interface FinanceMonthlyTrend {
  month: number;
  year: number;
  contributions: number;
  expenses: number;
  netIncome: number;
}

interface FinanceStats {
  totalContributions: number;
  tithes: number;
  offering: number;
  donation: number;
  pledge: number;
  specialContribution: number;
  expenses: number;
  growthRate: number;
  netIncome: number;
  monthlyTrends: FinanceMonthlyTrend[];
}

interface SacramentBreakdown {
  type: string;
  count: number;
}

interface SacramentMonthlyTrend {
  month: number;
  count: number;
}

interface SacramentStats {
  totalSacraments: number;
  breakdown: SacramentBreakdown[];
  monthlyTrends: SacramentMonthlyTrend[];
}

interface ActivitySummary {
  newMembersCount: number;
  contributionsCount: number;
  sacramentsCount: number;
  attendanceRecordsCount: number;
  totalActivities: number;
}

interface ActivityStats {
  recentEvents: Array<{ id: string; title: string; startDate: string }>;
  upcomingEvents: Array<{ id: string; title: string; startDate: string }>;
  activitySummary: ActivitySummary;
}

interface BranchOverviewWidgetsProps {
  branchName: string;
  memberStats: MemberStats;
  attendanceStats: AttendanceStats;
  financeStats: FinanceStats;
  sacramentStats: SacramentStats;
  activityStats: ActivityStats;
}

// Helper function to format growth rate with appropriate styling
const formatGrowthRate = (rate: number) => {
  const isPositive = rate >= 0;
  const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  const colorClass = isPositive ? "text-green-600" : "text-red-600";
  const bgColorClass = isPositive ? "bg-green-50" : "bg-red-50";
  
  return {
    text: `${isPositive ? '+' : ''}${rate.toFixed(1)}%`,
    Icon,
    colorClass,
    bgColorClass,
    isPositive
  };
};

const renderGrowthIndicator = (growthRate: number) => {
  if (growthRate > 0) {
    return (
      <div className="flex items-center text-green-600">
        <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">+{growthRate}%</span>
      </div>
    );
  } else if (growthRate < 0) {
    return (
      <div className="flex items-center text-red-600">
        <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
        <span className="text-sm font-medium">{growthRate}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center text-gray-500">
      <span className="text-sm font-medium">0%</span>
    </div>
  );
};

export function BranchOverviewWidgets({
  branchName,
  memberStats,
  attendanceStats,
  financeStats,
  sacramentStats,
  activityStats,
}: BranchOverviewWidgetsProps) {
  const memberGrowth = formatGrowthRate(memberStats.growthRate);
  const attendanceGrowth = formatGrowthRate(attendanceStats.growthRate);
  const financeGrowth = formatGrowthRate(financeStats.growthRate);

  const widgets = [
    { 
      label: "Active Members", 
      value: memberStats.total,
      subValue: `${memberStats.newMembersThisMonth} new this month`,
      growth: memberGrowth,
      icon: UsersIcon,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    { 
      label: "Monthly Attendance", 
      value: attendanceStats.totalAttendance,
      subValue: `${attendanceStats.uniqueAttendeesThisMonth} unique attendees`,
      growth: attendanceGrowth,
      icon: ChartBarIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    { 
      label: "Monthly Contributions", 
      value: formatCurrencyWhole(financeStats.totalContributions),
      subValue: `Net: ${formatCurrencyWhole(financeStats.netIncome)}`,
      growth: financeGrowth,
      icon: CurrencyDollarIcon,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100"
    },
    { 
      label: "Total Sacraments", 
      value: sacramentStats.totalSacraments,
      subValue: `${sacramentStats.breakdown.length} types recorded`,
      icon: HeartIcon,
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100"
    },
    { 
      label: "Recent Activities", 
      value: activityStats.activitySummary.totalActivities,
      subValue: `${activityStats.activitySummary.newMembersCount} new members, ${activityStats.activitySummary.contributionsCount} contributions`,
      icon: ArrowTrendingUpIcon,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    { 
      label: "Upcoming Events", 
      value: activityStats.upcomingEvents.length,
      subValue: `${activityStats.recentEvents.length} recent events`,
      icon: CalendarDaysIcon,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {widgets.map((widget) => {
        const IconComponent = widget.icon;

        return (
          <div
            key={widget.label}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start gap-3 border border-gray-100 hover:shadow-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            {/* Background gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${widget.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            {/* Icon */}
            <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${widget.color} mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            
            {/* Value */}
            <div className="text-3xl font-extrabold text-gray-800 drop-shadow-sm relative z-10">
              {widget.value}
            </div>
            
            {/* Sub Value */}
            {widget.subValue && (
              <div className="text-sm text-gray-600 font-medium relative z-10">
                {widget.subValue}
              </div>
            )}
            
            {/* Growth Rate */}
            {widget.growth && (
              <div className="flex items-center gap-1">
                {renderGrowthIndicator(widget.growth.isPositive ? parseFloat(widget.growth.text.slice(1)) : parseFloat(widget.growth.text))}
              </div>
            )}
            
            {/* Label */}
            <div className="text-sm text-gray-600 font-medium relative z-10">
              {widget.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
