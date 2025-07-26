"use client";

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useOrganizationBranchFilter } from '@/hooks';
import {
  useGenerateMemberReport,
  useMemberStats,
  MemberReportType,
  MemberReportGroupBy,
  MemberReportFormat,
  MemberReportInput,
  MemberReport,
  getDefaultMemberReportConfig,
  getMemberReportTypeLabel,
  getMemberReportGroupByLabel,
  getMemberReportFormatLabel,
} from '@/graphql/hooks/useMemberReports';

// UI Components
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  MapPinIcon,
  HeartIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

interface MemberReportsProps {
  className?: string;
}

const MemberReports: React.FC<MemberReportsProps> = ({ className = '' }) => {
  const { state } = useAuth();
  const user = state.user;
  const orgBranchFilter = useOrganizationBranchFilter();
  const { generateReport, loading: reportLoading, error: reportError } = useGenerateMemberReport();
  const { memberStats, loading: statsLoading } = useMemberStats(
    orgBranchFilter.organisationId,
    orgBranchFilter.branchId
  );

  // State
  const [reportConfig, setReportConfig] = useState<MemberReportInput>({
    type: MemberReportType.SUMMARY,
    ...getDefaultMemberReportConfig(),
  });
  const [generatedReport, setGeneratedReport] = useState<MemberReport | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Report type configurations
  const reportTypes = [
    {
      type: MemberReportType.SUMMARY,
      label: 'Summary Report',
      description: 'Overview of member statistics and key metrics',
      icon: ChartBarIcon,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      type: MemberReportType.DETAILED,
      label: 'Detailed Report',
      description: 'Comprehensive member data and analytics',
      icon: DocumentArrowDownIcon,
      color: 'bg-green-50 text-green-600 border-green-200',
    },
    {
      type: MemberReportType.DEMOGRAPHICS,
      label: 'Demographics',
      description: 'Age, gender, and demographic breakdowns',
      icon: ChartPieIcon,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      type: MemberReportType.GROWTH_TRENDS,
      label: 'Growth Trends',
      description: 'Member growth patterns and trends over time',
      icon: ArrowTrendingUpIcon,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      type: MemberReportType.ENGAGEMENT,
      label: 'Engagement',
      description: 'Member participation and engagement metrics',
      icon: HeartIcon,
      color: 'bg-pink-50 text-pink-600 border-pink-200',
    },
    {
      type: MemberReportType.RETENTION,
      label: 'Retention',
      description: 'Member retention and churn analysis',
      icon: ClockIcon,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    {
      type: MemberReportType.GEOGRAPHIC,
      label: 'Geographic',
      description: 'Geographic distribution of members',
      icon: MapPinIcon,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
    },
  ];

  const groupByOptions = [
    { value: MemberReportGroupBy.DAY, label: 'Daily' },
    { value: MemberReportGroupBy.WEEK, label: 'Weekly' },
    { value: MemberReportGroupBy.MONTH, label: 'Monthly' },
    { value: MemberReportGroupBy.QUARTER, label: 'Quarterly' },
    { value: MemberReportGroupBy.YEAR, label: 'Yearly' },
  ];

  const formatOptions = [
    { value: MemberReportFormat.JSON, label: 'JSON', extension: 'json' },
    { value: MemberReportFormat.CSV, label: 'CSV', extension: 'csv' },
    { value: MemberReportFormat.PDF, label: 'PDF', extension: 'pdf' },
    { value: MemberReportFormat.EXCEL, label: 'Excel', extension: 'xlsx' },
  ];

  // Handlers
  const handleConfigChange = useCallback((field: keyof MemberReportInput, value: any) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleGenerateReport = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Apply organization/branch filter
      const input: MemberReportInput = {
        ...reportConfig,
        organisationId: orgBranchFilter.organisationId,
        branchId: orgBranchFilter.branchId,
      };

      const report = await generateReport(input);
      if (report) {
        setGeneratedReport(report);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error generating member report:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [reportConfig, orgBranchFilter, generateReport]);

  const handleDownload = useCallback(async (format: MemberReportFormat) => {
    if (!generatedReport) return;

    try {
      const input: MemberReportInput = {
        ...reportConfig,
        format,
        organisationId: orgBranchFilter.organisationId,
        branchId: orgBranchFilter.branchId,
      };

      const report = await generateReport(input);
      if (report?.downloadUrl) {
        // Create download link
        const link = document.createElement('a');
        link.href = report.downloadUrl;
        link.download = `member-report-${format.toLowerCase()}-${new Date().toISOString().split('T')[0]}.${formatOptions.find(f => f.value === format)?.extension || 'json'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback to JSON download
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `member-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  }, [generatedReport, reportConfig, orgBranchFilter, generateReport, formatOptions]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-600" />
              Member Reports
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate comprehensive reports about your members and their engagement
            </p>
          </div>
          {memberStats && (
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{memberStats.totalMembers}</div>
              <div className="text-sm text-gray-500">Total Members</div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {memberStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Members</p>
                <p className="text-2xl font-semibold text-gray-900">{memberStats.activeMembers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Growth Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{memberStats.growthRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-pink-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Retention Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{memberStats.retentionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Average Age</p>
                <p className="text-2xl font-semibold text-gray-900">{memberStats.averageAge.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Configuration */}
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Configuration</h3>
        
        {/* Report Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.type}
                  onClick={() => handleConfigChange('type', type.type)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    reportConfig.type === type.type
                      ? type.color
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <Icon className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={reportConfig.startDate}
              onChange={(e) => handleConfigChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={reportConfig.endDate}
              onChange={(e) => handleConfigChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Group By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Group By</label>
          <select
            value={reportConfig.groupBy}
            onChange={(e) => handleConfigChange('groupBy', e.target.value as MemberReportGroupBy)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {groupByOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Include Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Include Options</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reportConfig.includeInactive}
                onChange={(e) => handleConfigChange('includeInactive', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Inactive Members</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reportConfig.includeVisitors}
                onChange={(e) => handleConfigChange('includeVisitors', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Visitors</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reportConfig.includeDemographics}
                onChange={(e) => handleConfigChange('includeDemographics', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Demographics</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reportConfig.includeEngagement}
                onChange={(e) => handleConfigChange('includeEngagement', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Engagement Data</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={reportConfig.includePersonalInfo}
                onChange={(e) => handleConfigChange('includePersonalInfo', e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include Personal Info</span>
            </label>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || reportLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating || reportLoading ? (
              <>
                <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Generating...
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Preview Modal */}
      {showPreview && generatedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {generatedReport.summary.title}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{generatedReport.summary.totalMembers}</div>
                  <div className="text-sm text-gray-500">Total Members</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{generatedReport.summary.activeMembers}</div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{generatedReport.summary.newMembers}</div>
                  <div className="text-sm text-gray-500">New Members</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{generatedReport.summary.growthRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Growth Rate</div>
                </div>
              </div>

              {/* Data Table */}
              {generatedReport.data && generatedReport.data.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Report Data</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visitors</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {generatedReport.data.slice(0, 10).map((row, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.period}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.totalMembers}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.activeMembers}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.newMembers}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.visitors}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Download Options */}
              <div className="flex flex-wrap gap-2 justify-end">
                {formatOptions.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => handleDownload(format.value)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    Download {format.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberReports;
