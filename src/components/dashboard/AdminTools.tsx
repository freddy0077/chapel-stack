import React from "react";

const tools = [
  {
    label: "Add/View Branches",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="#2563eb" />
        <text x="12" y="17" textAnchor="middle" fontSize="14" fill="#fff">
          +
        </text>
      </svg>
    ),
  },
  {
    label: "Approve Reports",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="#eab308" />
        <text x="12" y="17" textAnchor="middle" fontSize="14" fill="#fff">
          ✔
        </text>
      </svg>
    ),
  },
  {
    label: "View Logs",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="#38bdf8" />
        <text x="12" y="17" textAnchor="middle" fontSize="14" fill="#fff">
          📝
        </text>
      </svg>
    ),
  },
];

export function AdminTools() {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
      <h2 className="font-semibold text-xl mb-6 text-blue-800">Admin Tools</h2>
      <div className="flex gap-8 flex-wrap">
        {tools.map((tool) => (
          <button
            key={tool.label}
            className="flex flex-col items-center gap-3 px-6 py-5 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-xl hover:bg-blue-100 transition border border-blue-100 min-w-[140px] shadow group"
          >
            <span className="group-hover:scale-110 transition-transform">
              {tool.icon}
            </span>
            <span className="text-base font-semibold text-blue-900">
              {tool.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
