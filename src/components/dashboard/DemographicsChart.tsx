import React from "react";

// Simple donut chart SVG for gender demographics
export const DemographicsChart = () => (
  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-7 flex flex-col items-center border border-white/40 dark:border-black/40 min-h-[240px]">
    <div className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg w-full text-left">Member Demographics</div>
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle r="48" cx="60" cy="60" fill="#e0e7ff" />
      <path d="M60 12 a48 48 0 0 1 41.57 24" fill="none" stroke="#7c3aed" strokeWidth="16" />
      <path d="M101.57 36 a48 48 0 1 1 -83.14 0" fill="none" stroke="#38bdf8" strokeWidth="16" />
      <path d="M18.43 36 a48 48 0 0 1 41.57 -24" fill="none" stroke="#fbbf24" strokeWidth="16" />
    </svg>
    <div className="flex gap-4 mt-4 text-xs">
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block"></span> Female (48%)</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-sky-400 inline-block"></span> Male (44%)</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span> Other (8%)</span>
    </div>
  </div>
);

export default DemographicsChart;
