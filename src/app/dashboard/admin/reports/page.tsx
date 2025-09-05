"use client";

import { useState } from "react";
import Link from "next/link";
import { ChartBarIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import AttendanceReportSection from "./components/AttendanceReportSection";
import SacramentalsReportSection from "./components/SacramentalsReportSection";
import MembershipReportSection from "./components/MembershipReportSection";
import ReportFilters from "./components/ReportFilters";

export default function ConsolidatedReports() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [activeReportType, setActiveReportType] = useState("attendance");

  // Handle report type selection
  const handleReportTypeChange = (reportType: string) => {
    setActiveReportType(reportType);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center justify-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Consolidated Reports
          </h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Analyze data across all branches with branch filtering and comparison
        </p>
      </header>

      <ReportFilters
        selectedBranches={selectedBranches}
        setSelectedBranches={setSelectedBranches}
        dateRange={dateRange}
        setDateRange={setDateRange}
        activeReportType={activeReportType}
        onReportTypeChange={handleReportTypeChange}
      />

      <div className="mt-6">
        {activeReportType === "attendance" && (
          <AttendanceReportSection
            selectedBranches={selectedBranches}
            dateRange={dateRange}
          />
        )}

        {activeReportType === "membership" && (
          <MembershipReportSection
            selectedBranches={selectedBranches}
            dateRange={dateRange}
          />
        )}

        {activeReportType === "sacramentals" && (
          <SacramentalsReportSection
            selectedBranches={selectedBranches}
            dateRange={dateRange}
          />
        )}
      </div>
    </div>
  );
}
