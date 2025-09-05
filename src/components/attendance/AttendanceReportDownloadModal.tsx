"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  useGenerateAttendanceReport,
  AttendanceReportType,
  AttendanceReportFormat,
  AttendanceReportGroupBy,
  AttendanceReportInput,
  getDefaultReportConfig,
} from "../../graphql/hooks/useAttendanceReports";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { toast } from "react-hot-toast";

interface AttendanceReportDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AttendanceReportDownloadModal: React.FC<
  AttendanceReportDownloadModalProps
> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { generateReport, loading, error } = useGenerateAttendanceReport();

  const [selectedReportType, setSelectedReportType] =
    useState<AttendanceReportType>(AttendanceReportType.SUMMARY);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [format, setFormat] = useState<AttendanceReportFormat>(
    AttendanceReportFormat.PDF,
  );
  const [groupBy, setGroupBy] = useState<AttendanceReportGroupBy>(
    AttendanceReportGroupBy.WEEK,
  );
  const [includeOptions, setIncludeOptions] = useState({
    includeVisitors: true,
    includeStatistics: true,
    includeCharts: true,
  });

  const branchId = user?.userBranches?.[0]?.branch?.id;
  const organisationId = user?.organisationId;

  const reportTypes = [
    {
      type: AttendanceReportType.SUMMARY,
      name: "Summary Report",
      description: "Quick overview with key metrics",
      icon: ChartBarIcon,
      color: "bg-blue-500",
      recommended: true,
    },
    {
      type: AttendanceReportType.DETAILED,
      name: "Detailed Report",
      description: "Comprehensive analysis with all data",
      icon: DocumentTextIcon,
      color: "bg-green-500",
      recommended: false,
    },
    {
      type: AttendanceReportType.TRENDS,
      name: "Trends Report",
      description: "Attendance patterns over time",
      icon: ArrowTrendingUpIcon,
      color: "bg-purple-500",
      recommended: false,
    },
    {
      type: AttendanceReportType.MEMBER_ANALYSIS,
      name: "Member Analysis",
      description: "Individual member attendance patterns",
      icon: UsersIcon,
      color: "bg-indigo-500",
      recommended: false,
    },
  ];

  const formatOptions = [
    {
      value: AttendanceReportFormat.PDF,
      label: "PDF Document",
      icon: DocumentTextIcon,
      recommended: true,
    },
    {
      value: AttendanceReportFormat.EXCEL,
      label: "Excel Spreadsheet",
      icon: DocumentTextIcon,
      recommended: false,
    },
    {
      value: AttendanceReportFormat.CSV,
      label: "CSV File",
      icon: DocumentTextIcon,
      recommended: false,
    },
  ];

  const handleDownloadReport = async () => {
    if (!branchId || !organisationId) {
      toast.error("Branch or organization information is missing");
      return;
    }

    try {
      const defaultConfig = getDefaultReportConfig(selectedReportType);

      const reportInput: AttendanceReportInput = {
        reportType: selectedReportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        branchId,
        organisationId,
        groupBy,
        format,
        ...includeOptions,
        ...defaultConfig,
      };

      const report = await generateReport(reportInput, user?.email || "user");

      if (report) {
        // Handle download based on the backend response
        if (report.downloadUrl) {
          // Backend provided a download URL - use it directly
          const link = document.createElement("a");
          link.href = report.downloadUrl;

          // Map format to correct file extension
          const getFileExtension = (format: AttendanceReportFormat): string => {
            switch (format) {
              case AttendanceReportFormat.PDF:
                return "pdf";
              case AttendanceReportFormat.CSV:
                return "csv";
              case AttendanceReportFormat.EXCEL:
                return "xlsx";
              default:
                return "json";
            }
          };

          link.download = `attendance-report-${report.id}.${getFileExtension(format)}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Fallback for JSON format - create downloadable file
          const dataStr = JSON.stringify(report, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);

          const linkElement = document.createElement("a");
          linkElement.setAttribute("href", url);
          linkElement.setAttribute(
            "download",
            `attendance-report-${report.id}.json`,
          );
          linkElement.click();

          URL.revokeObjectURL(url);
        }

        toast.success("Report downloaded successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const updateIncludeOption = (
    key: keyof typeof includeOptions,
    value: boolean,
  ) => {
    setIncludeOptions((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-0 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowDownTrayIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Download Attendance Report
              </h3>
              <p className="text-sm text-gray-600">
                Generate and download attendance analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Report Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              {reportTypes.map((reportType) => {
                const Icon = reportType.icon;
                return (
                  <button
                    key={reportType.type}
                    onClick={() => setSelectedReportType(reportType.type)}
                    className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                      selectedReportType === reportType.type
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${reportType.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {reportType.name}
                          </h4>
                          {reportType.recommended && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {reportType.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Download Format
            </label>
            <div className="space-y-2">
              {formatOptions.map((formatOption) => {
                const Icon = formatOption.icon;
                return (
                  <label key={formatOption.value} className="flex items-center">
                    <input
                      type="radio"
                      name="format"
                      value={formatOption.value}
                      checked={format === formatOption.value}
                      onChange={(e) =>
                        setFormat(e.target.value as AttendanceReportFormat)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formatOption.label}
                      </span>
                      {formatOption.recommended && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Recommended
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Quick Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include
            </label>
            <div className="space-y-2">
              {Object.entries(includeOptions).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      updateIncludeOption(
                        key as keyof typeof includeOptions,
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            Report generation may take a few moments
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadReport}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportDownloadModal;
