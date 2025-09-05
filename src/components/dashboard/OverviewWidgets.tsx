import React from "react";

interface OverviewWidgetsProps {
  branches?: number;
  members?: number;
  attendance?: number;
  newMembers?: number;
}

export function OverviewWidgets({
  branches,
  members,
  attendance,
  newMembers,
}: OverviewWidgetsProps) {
  const widgets = [
    {
      label: "Branches",
      value: branches ?? 0,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <rect x="4" y="4" width="8" height="8" rx="2" fill="#2563eb" />
          <rect x="16" y="4" width="8" height="8" rx="2" fill="#eab308" />
          <rect x="4" y="16" width="8" height="8" rx="2" fill="#38bdf8" />
          <rect x="16" y="16" width="8" height="8" rx="2" fill="#a3a3a3" />
        </svg>
      ),
    },
    {
      label: "Active Members",
      value: members ?? 0,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <circle cx="14" cy="10" r="5" fill="#2563eb" />
          <ellipse cx="14" cy="20" rx="9" ry="5" fill="#e0e7ef" />
        </svg>
      ),
    },
    {
      label: "Attendance (Sunday)",
      value: attendance ?? 0,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <rect width="28" height="28" rx="14" fill="#38bdf8" />
          <text x="14" y="18" textAnchor="middle" fontSize="12" fill="#fff">
            ⛪
          </text>
        </svg>
      ),
    },
    {
      label: "New Members This Month",
      value: newMembers,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="12" fill="#eab308" />
          <text x="14" y="18" textAnchor="middle" fontSize="12" fill="#fff">
            +
          </text>
        </svg>
      ),
    },
    {
      label: "Volunteers",
      value: 0,
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="12" fill="#a3a3a3" />
          <text x="14" y="18" textAnchor="middle" fontSize="12" fill="#fff">
            🤝
          </text>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {widgets.map((w) => (
        <div
          key={w.label}
          className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start gap-3 border border-blue-100 hover:shadow-2xl transition group cursor-pointer relative overflow-hidden"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-yellow-50 to-blue-50 mb-2 shadow group-hover:scale-110 transition-transform">
            {w.icon}
          </div>
          <div className="text-3xl font-extrabold text-blue-800 drop-shadow-sm">
            {w.value}
          </div>
          <div className="text-base text-gray-600 font-medium">{w.label}</div>
          <span className="absolute right-3 top-3 w-2 h-2 bg-yellow-400 rounded-full opacity-70 group-hover:opacity-100 transition" />
        </div>
      ))}
    </div>
  );
}
