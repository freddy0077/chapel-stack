"use client";

import { useState } from 'react';
import { Song } from '../SongLibrary';

// Define types for CCLI reporting
interface ReportSong {
  title: string;
  author: string;
  ccli: string;
  count: number;
  lastUsed: string;
}

interface ReportData {
  period: {
    start: string;
    end: string;
  };
  church: {
    name: string;
    ccliNumber: string;
  };
  songs: ReportSong[];
  totalUsageCount: number;
  generatedDate: string;
}

interface CCLIReportingProps {
  songs: Song[];
}

// Utility function to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function CCLIReporting({ songs }: CCLIReportingProps) {
  const [reportPeriod, setReportPeriod] = useState<'current' | 'previous' | 'custom'>('current');
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [ccliNumber, setCcliNumber] = useState<string>('');
  const [reportGenerated, setReportGenerated] = useState<boolean>(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  // Generate CCLI report based on selected period
  const generateReport = () => {
    // Start with all songs that have CCLI numbers
    let filteredSongs = songs.filter((song) => song.ccli);
    
    // Set date range based on report period
    let reportStartDate: Date, reportEndDate: Date;
    
    if (reportPeriod === 'current') {
      reportStartDate = new Date();
      reportStartDate.setMonth(reportStartDate.getMonth() - 1);
      reportEndDate = new Date();
    } else if (reportPeriod === 'previous') {
      reportStartDate = new Date();
      reportStartDate.setMonth(reportStartDate.getMonth() - 2);
      reportEndDate = new Date();
      reportEndDate.setMonth(reportEndDate.getMonth() - 1);
    } else {
      reportStartDate = new Date(startDate);
      reportEndDate = new Date(endDate);
    }
    
    // Filter songs based on last used date
    // In a real application, this would filter based on actual usage data
    // For our mock data, we'll simulate usage based on the lastUsed field
    filteredSongs = filteredSongs.filter((song) => {
      const lastUsedDate = new Date(song.lastUsed);
      return lastUsedDate >= reportStartDate && lastUsedDate <= reportEndDate;
    });
    
    // Calculate usage statistics
    const songUsage = filteredSongs.map((song) => ({
      title: song.title,
      author: song.author,
      ccli: song.ccli,
      count: song.usageCount || 1,
      lastUsed: song.lastUsed
    }));
    
    // Generate report data
    const report = {
      period: {
        start: formatDate(reportStartDate),
        end: formatDate(reportEndDate)
      },
      church: {
        name: 'Grace Community Church',
        ccliNumber: ccliNumber || 'Not provided'
      },
      songs: songUsage,
      totalUsageCount: songUsage.reduce((sum, song) => sum + song.count, 0),
      generatedDate: formatDate(new Date())
    };
    
    setReportData(report);
    setReportGenerated(true);
  };

  // Export report as CSV
  const exportCsv = () => {
    if (!reportData) return;
    
    // Create CSV content
    const headers = ['Title', 'Author', 'CCLI #', 'Times Used', 'Last Used'];
    const rows = reportData.songs.map((song: ReportSong) => [
      song.title,
      song.author,
      song.ccli,
      song.count,
      song.lastUsed
    ]);
    
    const csvContent = [
      `CCLI Report for ${reportData.church.name}`,
      `CCLI License #: ${reportData.church.ccliNumber}`,
      `Reporting Period: ${reportData.period.start} to ${reportData.period.end}`,
      `Generated: ${reportData.generatedDate}`,
      '',
      headers.join(','),
      ...rows.map((row) => row.map(item => String(item)).join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCLI_Report_${reportData.period.start.replace(/\s/g, '')}_to_${reportData.period.end.replace(/\s/g, '')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">CCLI Reporting</h3>
      
      {!reportGenerated ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church CCLI License Number
            </label>
            <input
              type="text"
              value={ccliNumber}
              onChange={(e) => setCcliNumber(e.target.value)}
              placeholder="Enter your CCLI License #"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Report Period
            </label>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="current-month"
                  name="report-period"
                  type="radio"
                  checked={reportPeriod === 'current'}
                  onChange={() => setReportPeriod('current')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="current-month" className="ml-3 block text-sm font-medium text-gray-700">
                  Current Month
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="previous-month"
                  name="report-period"
                  type="radio"
                  checked={reportPeriod === 'previous'}
                  onChange={() => setReportPeriod('previous')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="previous-month" className="ml-3 block text-sm font-medium text-gray-700">
                  Previous Month
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="custom-period"
                  name="report-period"
                  type="radio"
                  checked={reportPeriod === 'custom'}
                  onChange={() => setReportPeriod('custom')}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="custom-period" className="ml-3 block text-sm font-medium text-gray-700">
                  Custom Period
                </label>
              </div>
            </div>
          </div>
          
          {reportPeriod === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={generateReport}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate Report
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">CCLI Usage Report</h4>
              <div className="text-sm text-gray-500">
                Generated: {reportData.generatedDate}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Reporting Period</p>
                <p className="font-medium">{reportData.period.start} to {reportData.period.end}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">CCLI License #</p>
                <p className="font-medium">{reportData.church.ccliNumber}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Usage Summary</h5>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Song Title</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">CCLI #</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Times Used</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Last Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {reportData.songs.map((song: ReportSong, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{song.title}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{song.author}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{song.ccli}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{song.count}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{song.lastUsed}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th scope="row" colSpan={3} className="pl-4 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Uses</th>
                      <td className="whitespace-nowrap px-3 py-3.5 text-sm font-medium text-gray-900">{reportData.totalUsageCount}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setReportGenerated(false)}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create New Report
            </button>
            
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Export as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
