'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import {
  useGenerateAttendanceReport,
  useAttendanceStats,
  AttendanceReportType,
  AttendanceReportFormat,
  AttendanceReportGroupBy,
  AttendanceReportInput,
  getReportTypeDisplayName,
  getDefaultReportConfig,
  formatNumber,
  formatPercentage,
} from '../../graphql/hooks/useAttendanceReports';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { toast } from 'react-hot-toast';

interface AttendanceReportsProps {
  className?: string;
}

const AttendanceReports: React.FC<AttendanceReportsProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { generateReport, loading: reportLoading, error: reportError, report } = useGenerateAttendanceReport();
  const { getStats, loading: statsLoading, error: statsError, stats } = useAttendanceStats();

  const [selectedReportType, setSelectedReportType] = useState<AttendanceReportType>(AttendanceReportType.SUMMARY);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0], // today
  });
  const [groupBy, setGroupBy] = useState<AttendanceReportGroupBy>(AttendanceReportGroupBy.WEEK);
  const [format, setFormat] = useState<AttendanceReportFormat>(AttendanceReportFormat.JSON);
  const [includeOptions, setIncludeOptions] = useState({
    includeVisitors: true,
    includeMemberDetails: false,
    includeSessionDetails: false,
    includeEventDetails: false,
    includeStatistics: true,
    includeCharts: true,
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);

  const branchId = user?.userBranches?.[0]?.branch?.id;
  const organisationId = user?.userBranches?.[0]?.branch?.organisationId;

  const reportTypes = [
    {
      type: AttendanceReportType.SUMMARY,
      name: 'Summary Report',
      description: 'Overview of attendance metrics',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
    },
    {
      type: AttendanceReportType.DETAILED,
      name: 'Detailed Report',
      description: 'Comprehensive attendance analysis',
      icon: DocumentTextIcon,
      color: 'bg-green-500',
    },
    {
      type: AttendanceReportType.COMPARATIVE,
      name: 'Comparative Report',
      description: 'Compare periods and trends',
      icon: ArrowTrendingUpIcon,
      color: 'bg-purple-500',
    },
    {
      type: AttendanceReportType.TRENDS,
      name: 'Trends Report',
      description: 'Attendance trends over time',
      icon: ArrowTrendingUpIcon,
      color: 'bg-orange-500',
    },
    {
      type: AttendanceReportType.MEMBER_ANALYSIS,
      name: 'Member Analysis',
      description: 'Individual member attendance',
      icon: UsersIcon,
      color: 'bg-indigo-500',
    },
    {
      type: AttendanceReportType.SESSION_ANALYSIS,
      name: 'Session Analysis',
      description: 'Session-specific insights',
      icon: CalendarIcon,
      color: 'bg-pink-500',
    },
    {
      type: AttendanceReportType.EVENT_ANALYSIS,
      name: 'Event Analysis',
      description: 'Event attendance analysis',
      icon: CalendarIcon,
      color: 'bg-teal-500',
    },
  ];

  const handleGenerateReport = async () => {
    if (!branchId || !organisationId) {
      toast.error('Branch or organization information is missing');
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

      const generatedReport = await generateReport(reportInput, user?.email || 'user');
      
      if (generatedReport) {
        setCurrentReport(generatedReport);
        setShowReportModal(true);
        toast.success('Report generated successfully!');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleDownloadReport = () => {
    if (currentReport?.downloadUrl) {
      window.open(currentReport.downloadUrl, '_blank');
    } else {
      // For JSON format, create a downloadable file
      const dataStr = JSON.stringify(currentReport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `attendance-report-${currentReport?.id || 'report'}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const updateIncludeOption = (key: keyof typeof includeOptions, value: boolean) => {
    setIncludeOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Attendance Reports</h2>
            <p className="text-sm text-gray-600 mt-1">Generate comprehensive attendance analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reportLoading ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((reportType) => {
              const Icon = reportType.icon;
              return (
                <button
                  key={reportType.type}
                  onClick={() => setSelectedReportType(reportType.type)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    selectedReportType === reportType.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${reportType.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-sm font-medium text-gray-900">{reportType.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{reportType.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Group By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as AttendanceReportGroupBy)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={AttendanceReportGroupBy.DAY}>Day</option>
              <option value={AttendanceReportGroupBy.WEEK}>Week</option>
              <option value={AttendanceReportGroupBy.MONTH}>Month</option>
              <option value={AttendanceReportGroupBy.QUARTER}>Quarter</option>
              <option value={AttendanceReportGroupBy.YEAR}>Year</option>
            </select>
          </div>
        </div>

        {/* Include Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Include in Report</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(includeOptions).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => updateIncludeOption(key as keyof typeof includeOptions, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
          <div className="flex space-x-4">
            {Object.values(AttendanceReportFormat).map((formatOption) => (
              <label key={formatOption} className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value={formatOption}
                  checked={format === formatOption}
                  onChange={(e) => setFormat(e.target.value as AttendanceReportFormat)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{formatOption}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {(reportError || statsError) && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              {reportError?.message || statsError?.message || 'An error occurred'}
            </p>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && currentReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">{currentReport.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadReport}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {/* Report Summary */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Total Attendance</p>
                    <p className="text-xl font-semibold text-blue-900">
                      {formatNumber(currentReport.summary.totalAttendance)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600">Unique Members</p>
                    <p className="text-xl font-semibold text-green-900">
                      {formatNumber(currentReport.summary.uniqueMembers)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-600">Total Visitors</p>
                    <p className="text-xl font-semibold text-purple-900">
                      {formatNumber(currentReport.summary.totalVisitors)}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-600">Growth Rate</p>
                    <p className="text-xl font-semibold text-orange-900">
                      {formatPercentage(currentReport.summary.overallGrowthRate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Data Preview */}
              {currentReport.data && currentReport.data.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Data Preview</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Period
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Attendance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unique Members
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Visitors
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentReport.data.slice(0, 5).map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(item.totalAttendance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(item.uniqueMembers)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatNumber(item.visitors)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {currentReport.data.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Showing 5 of {currentReport.data.length} records. Download the full report to see all data.
                    </p>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-500">
                Generated on {new Date(currentReport.generatedAt).toLocaleString()} by {currentReport.generatedBy}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReports;
