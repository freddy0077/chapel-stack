"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { BranchOverviewWidgets } from "@/components/dashboard/BranchOverviewWidgets";
import { BranchFinancesSummary } from "@/components/dashboard/BranchFinancesSummary";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchPerformance } from "@/components/dashboard/BranchPerformance";
import { BranchAdminTools } from "@/components/dashboard/BranchAdminTools";

export default function BranchDashboardPage() {
  // Replace with actual branch name and user from context/auth
  const branchName = "Tema Central";
  const userName = "Rev. Mensah";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
      {/* Sidebar (reuse, but could highlight branch context) */}
      {/* <DashboardSidebar className="hidden lg:flex shadow-xl" /> */}
      <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 drop-shadow-sm">Welcome back, {userName}</h1>
            <p className="text-gray-500 text-base">Branch Overview: {branchName}</p>
          </div>
        </header>
        <BranchOverviewWidgets branchName={branchName} />
        <BranchFinancesSummary branchName={branchName} />
        <UpcomingEvents branchName={branchName} />
        <BranchPerformance branchName={branchName} />
        <BranchAdminTools branchName={branchName} />
      </main>
    </div>
  );
}
