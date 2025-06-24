"use client";

import React from "react";


export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`sticky top-0 z-10 -mx-6 mb-10 pb-4 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg backdrop-blur-md rounded-b-3xl ${className}`}

    >
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2 tracking-tight flex items-center gap-3">
            {icon}
            {title}
          </h1>
          {subtitle && (
            <p className="text-indigo-100/90 text-lg font-medium">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

export default DashboardHeader;
