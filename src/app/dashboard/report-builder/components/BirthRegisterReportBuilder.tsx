'use client';

import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EXECUTE_REPORT } from '@/graphql/mutations/reportMutations';
import { GET_ZONES } from '@/graphql/queries/zoneQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { ReportExporter } from '@/utils/reportExport';
import { toast } from 'react-hot-toast';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Shared components
import ReportFilterPanel from './shared/ReportFilterPanel';
import ReportSummaryCard from './shared/ReportSummaryCard';
import StatCard from './shared/StatCard';
import ReportTable from './shared/ReportTable';
import EmptyState from './shared/EmptyState';
import ReportLoadingSkeleton from './shared/LoadingSkeleton';

interface BirthRegisterFilters {
  startDate: string;
  endDate: string;
  gender: string;
  zoneId: string;
}

interface ReportResults {
  summary: {
    totalBirths: number;
    maleCount: number;
    femaleCount: number;
  };
  data: any[];
}

export default function BirthRegisterReportBuilder() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [showResults, setShowResults] = useState(false);
  const [reportResults, setReportResults] = useState<ReportResults | null>(null);

  const [filters, setFilters] = useState<BirthRegisterFilters>({
    startDate: '',
    endDate: '',
    gender: 'ALL',
    zoneId: 'ALL',
  });

  const { data: zonesData } = useQuery(GET_ZONES, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const zones = zonesData?.zones || [];

  const [executeReport, { loading }] = useMutation(EXECUTE_REPORT, {
    onCompleted: (data) => {
      setReportResults({
        summary: data.executeReport.summary.metrics,
        data: data.executeReport.data,
      });
      setShowResults(true);
      toast.success('Report generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate report');
    },
  });

  const handleFilterChange = (field: keyof BirthRegisterFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    executeReport({
      variables: {
        input: {
          category: 'BIRTH_REGISTER',
          filters,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleReset = () => {
    setFilters({
      startDate: '',
      endDate: '',
      gender: 'ALL',
      zoneId: 'ALL',
    });
    setShowResults(false);
    setReportResults(null);
  };

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    if (!reportResults) {
      toast.error('No report data to export');
      return;
    }

    const exportData = {
      title: 'Birth Register Report',
      summary: reportResults.summary,
      data: reportResults.data,
      filters,
      organisationName: 'Your Organization',
      branchName: 'Your Branch',
    };

    try {
      switch (format) {
        case 'PDF':
          ReportExporter.exportToPDF(exportData);
          toast.success('Report exported as PDF successfully!');
          break;
        case 'EXCEL':
          ReportExporter.exportToExcel(exportData);
          toast.success('Report exported as Excel successfully!');
          break;
        case 'CSV':
          ReportExporter.exportToCSV(exportData);
          toast.success('Report exported as CSV successfully!');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export report as ${format}`);
    }
  };

  if (loading) {
    return <ReportLoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <ReportFilterPanel
        title="Report Filters"
        colorScheme="from-pink-50 to-rose-50"
        onReset={handleReset}
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Range */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Birth Date Range
                  </Label>
                  <p className="text-xs text-gray-500">Filter records by birth date period</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300"
                  />
                </div>
                <div className="relative">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 hover:border-pink-300"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Gender
                  </Label>
                  <p className="text-xs text-gray-500">Filter by child gender</p>
                </div>
              </div>
              <Select
                value={filters.gender}
                onValueChange={(value) => handleFilterChange('gender', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-300">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">All Genders</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MALE" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-sm">Male</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="FEMALE" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span className="text-sm">Female</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zone */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Zone / Community
                  </Label>
                  <p className="text-xs text-gray-500">Filter by geographical zone</p>
                </div>
              </div>
              <Select
                value={filters.zoneId}
                onValueChange={(value) => handleFilterChange('zoneId', value)}
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 hover:border-purple-300">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2">
                  <SelectItem value="ALL" className="rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">All Zones</span>
                    </div>
                  </SelectItem>
                  {zones.map((zone: any) => (
                    <SelectItem key={zone.id} value={zone.id} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="text-sm">{zone.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t-2 border-gray-100">
          <Button
            onClick={handleGenerateReport}
            disabled={loading}
            className="h-12 px-8 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Generate Report
          </Button>
        </div>
      </ReportFilterPanel>

      {showResults && reportResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <ReportSummaryCard
            title="Birth Statistics"
            colorScheme="from-pink-50 to-rose-50"
            onExport={handleExport}
          >
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total Births"
                value={reportResults.summary.totalBirths}
                colorScheme="pink"
              />
              <StatCard
                label="Male"
                value={reportResults.summary.maleCount}
                colorScheme="blue"
              />
              <StatCard
                label="Female"
                value={reportResults.summary.femaleCount}
                colorScheme="rose"
              />
            </div>
          </ReportSummaryCard>

          <ReportTable
            title="Birth Records"
            columns={[
              { key: 'childName', label: 'Child Name' },
              { key: 'gender', label: 'Gender' },
              {
                key: 'birthDate',
                label: 'Birth Date',
                render: (value) => new Date(value).toLocaleDateString(),
              },
              {
                key: 'fatherName',
                label: 'Parents',
                render: (_, row) => `${row.fatherName} & ${row.motherName}`,
              },
            ]}
            data={reportResults.data}
            pageSize={50}
            emptyMessage="No birth records found"
          />
        </motion.div>
      )}

      {/* Empty State */}
      {!showResults && !loading && (
        <EmptyState
          title="Ready to Generate Report"
          message="Apply your filters above and click Generate Report to see birth statistics and records"
          actionLabel="Generate Report"
          onAction={handleGenerateReport}
        />
      )}
    </div>
  );
}
