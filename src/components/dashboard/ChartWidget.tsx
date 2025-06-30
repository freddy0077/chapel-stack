import React from "react";

// Simple SVG line chart for demonstration, theme-aware
export const ChartWidget = ({ title }: { title?: string }) => (
  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-7 flex flex-col min-h-[240px] justify-center items-center border border-white/40 dark:border-black/40">
    {title && <div className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg w-full text-left">{title}</div>}
    {/* SVG chart */}
    <svg width="220" height="80" viewBox="0 0 220 80" fill="none">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed"/>
          <stop offset="1" stopColor="#38bdf8"/>
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#chartGradient)"
        strokeWidth="4"
        points="0,60 30,20 60,35 90,10 120,40 150,25 180,55 210,20"
      />
      <circle cx="90" cy="10" r="4" fill="#7c3aed"/>
      <circle cx="210" cy="20" r="4" fill="#38bdf8"/>
    </svg>
    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">Last 7 days</div>
  </div>
);

export default ChartWidget;
