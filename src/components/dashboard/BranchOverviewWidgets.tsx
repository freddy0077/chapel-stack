import React from "react";
import { 
  UsersIcon, 
  UserPlusIcon, 
  CalendarDaysIcon, 
  ChartBarIcon,
  HeartIcon,
  CurrencyDollarIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { formatCurrencyWhole } from "@/utils/currency";

interface MemberStats {
  total: number;
  newMembersThisMonth: number;
}

interface AttendanceStats {
  totalAttendance: number;
}

interface FinanceStats {
  totalContributions: number;
  tithes: number;
  offering: number;
  donation: number;
  pledge: number;
  specialContribution: number;
  expenses: number;
}

interface SacramentStats {
  totalSacraments: number;
}

interface ActivityStats {
  recentEvents: Array<{ id: string; title: string; startDate: string }>;
  upcomingEvents: Array<{ id: string; title: string; startDate: string }>;
}

interface BranchOverviewWidgetsProps {
  branchName: string;
  memberStats: MemberStats;
  attendanceStats: AttendanceStats;
  financeStats: FinanceStats;
  sacramentStats: SacramentStats;
  activityStats: ActivityStats;
}

export function BranchOverviewWidgets({
  branchName,
  memberStats,
  attendanceStats,
  financeStats,
  sacramentStats,
  activityStats,
}: BranchOverviewWidgetsProps) {
  const widgets = [
    { 
      label: "Active Members", 
      value: memberStats.total,
      icon: UsersIcon,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    { 
      label: "New Members This Month", 
      value: memberStats.newMembersThisMonth,
      icon: UserPlusIcon,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    { 
      label: "Total Attendance", 
      value: attendanceStats.totalAttendance,
      icon: ChartBarIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    { 
      label: "Total Sacraments", 
      value: sacramentStats.totalSacraments,
      icon: HeartIcon,
      color: "from-pink-500 to-pink-600",
      bgColor: "from-pink-50 to-pink-100"
    },
    { 
      label: "Total Contributions", 
      value: formatCurrencyWhole(financeStats.totalContributions),
      icon: CurrencyDollarIcon,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100"
    },
    { 
      label: "Upcoming Events", 
      value: activityStats.upcomingEvents.length,
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
