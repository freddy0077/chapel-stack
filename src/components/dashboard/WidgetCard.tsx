import React from "react";

interface WidgetCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down";
  accent?: string; 
}

export const WidgetCard = ({ title, value, icon, trend, trendType, accent }: WidgetCardProps) => (
  <div className="bg-white/70 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-xl p-6 flex items-center gap-5 min-w-[220px] border border-white/40 dark:border-black/40 hover:scale-[1.03] transition-transform">
    <div className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-lg ${accent || "bg-gradient-to-tr from-primary to-purple-400 dark:from-primary dark:to-purple-600"}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-gray-500 dark:text-gray-300 text-xs font-semibold mb-1 uppercase tracking-wide">{title}</div>
      <div className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow">{value}</div>
      {trend && (
        <div className={`text-xs flex items-center mt-1 font-semibold ${trendType === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {trendType === "up" ? (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12l5-5 5 5"/></svg>
          ) : (
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12l-5 5-5-5"/></svg>
          )}
          {trend}
        </div>
      )}
    </div>
  </div>
);

export default WidgetCard;
