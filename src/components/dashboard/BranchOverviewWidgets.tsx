import React from "react";

interface BranchOverviewWidgetsProps {
  branchName: string;
  memberStats: {
    total: number;
    newMembersThisMonth: number;
  };
  attendanceStats: {
    totalAttendance: number;
  };
  financeStats: {
    totalContributions: number;
    tithes: number;
    expenses: number;
    pledge: number;
    offering: number;
    donation: number;
    specialContribution: number;
  };
  activityStats: {
    recentEvents: Array<any>;
    upcomingEvents: Array<any>;
  };
}

export function BranchOverviewWidgets({
  branchName,
  memberStats,
  attendanceStats,
  financeStats,
  activityStats,
}: BranchOverviewWidgetsProps) {
  const widgets = [
    { label: "Active Members", value: memberStats.total },
    { label: "New Members This Month", value: memberStats.newMembersThisMonth },
    { label: "Total Attendance", value: attendanceStats.totalAttendance },
    { label: "Upcoming Events", value: activityStats.upcomingEvents.length },
    // { label: "Total Contributions", value: financeStats.totalContributions },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {widgets.map((w) => (
        <div
          key={w.label}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start gap-3 border border-blue-100 hover:shadow-2xl transition group cursor-pointer relative overflow-hidden"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-50 mb-2 shadow group-hover:scale-110 transition-transform">
            {/* Icon placeholder */}
            <span className="text-2xl text-blue-600 font-bold">{w.label[0]}</span>
          </div>
          <div className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">{w.value}</div>
          <div className="text-base text-gray-600 font-medium">{w.label}</div>
        </div>
      ))}
    </div>
  );
}
