"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeftIcon, 
  ChartBarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

// Define types for our data models
interface Branch {
  id: string;
  name: string;
  location: string;
  region: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  branchId: string;
  branchName: string;
  attendeeCount: number;
  visitorCount: number;
  childrenCount: number;
  youthCount: number;
  adultsCount: number;
  eventType: "SundayService" | "BibleStudy" | "PrayerMeeting" | "SpecialEvent" | "Other";
  eventName?: string;
}

interface VisitorFlow {
  visitorId: string;
  visitorName: string;
  fromBranchId: string;
  fromBranchName: string;
  toBranchId: string;
  toBranchName: string;
  date: string;
  status: "First Visit" | "Return Visit" | "Transferred" | "Occasional";
}

// Mock data for branches
const mockBranches: Branch[] = [];

// Mock attendance data with branch information
const mockAttendanceRecords: AttendanceRecord[] = [];

// Mock visitor flow data
const mockVisitorFlows: VisitorFlow[] = [];

export default function AttendanceReportsDashboard() {
  const [activeTab, setActiveTab] = useState<"consolidated" | "branch-comparison" | "visitor-flow">("consolidated");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Filter attendance data based on selected branch and date range
  const filteredAttendance = mockAttendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    const matchesBranch = selectedBranch === "" || record.branchId === selectedBranch;
    const matchesDateRange = recordDate >= startDate && recordDate <= endDate;
    
    return matchesBranch && matchesDateRange;
  });

  // Get total values for consolidated report
  const totalAttendees = filteredAttendance.reduce((sum, record) => sum + record.attendeeCount, 0);
  const totalVisitors = filteredAttendance.reduce((sum, record) => sum + record.visitorCount, 0);
  const totalServices = filteredAttendance.length;
  
  const averageAttendance = totalServices > 0 ? Math.round(totalAttendees / totalServices) : 0;
  const averageVisitors = totalServices > 0 ? Math.round(totalVisitors / totalServices) : 0;
  
  // Calculate attendance by branch
  const attendanceByBranch = mockBranches.map(branch => {
    const branchRecords = filteredAttendance.filter(record => record.branchId === branch.id);
    const totalAttendees = branchRecords.reduce((sum, record) => sum + record.attendeeCount, 0);
    const totalServices = branchRecords.length;
    const averageAttendance = totalServices > 0 ? Math.round(totalAttendees / totalServices) : 0;

    return {
      branchId: branch.id,
      branchName: branch.name,
      totalAttendees,
      totalServices,
      averageAttendance
    };
  }).sort((a, b) => b.totalAttendees - a.totalAttendees);

  // Helper to format date strings nicely
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center">
          <Link 
            href="/dashboard/attendance" 
            className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          View consolidated reports, branch comparisons, and visitor flow data
        </p>
      </div>

      {/* Filters section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Report Filters</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              id="branch"
              name="branch"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {mockBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              name="start-date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              name="end-date"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
          >
            <option value="consolidated">Consolidated Report</option>
            <option value="branch-comparison">Branch Comparison</option>
            <option value="visitor-flow">Visitor Flow</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("consolidated")}
                className={`${
                  activeTab === "consolidated"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <DocumentChartBarIcon className={`${
                  activeTab === "consolidated" ? "text-indigo-500" : "text-gray-400"
                } -ml-0.5 mr-2 h-5 w-5`} />
                Consolidated Report
              </button>
              <button
                onClick={() => setActiveTab("branch-comparison")}
                className={`${
                  activeTab === "branch-comparison"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <ChartBarIcon className={`${
                  activeTab === "branch-comparison" ? "text-indigo-500" : "text-gray-400"
                } -ml-0.5 mr-2 h-5 w-5`} />
                Branch Comparison
              </button>
              <button
                onClick={() => setActiveTab("visitor-flow")}
                className={`${
                  activeTab === "visitor-flow"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <MapIcon className={`${
                  activeTab === "visitor-flow" ? "text-indigo-500" : "text-gray-400"
                } -ml-0.5 mr-2 h-5 w-5`} />
                Visitor Flow
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Consolidated Report Tab */}
        {activeTab === "consolidated" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Consolidated Attendance Report</h3>
            
            {/* Summary stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Services</h4>
                <p className="text-2xl font-semibold text-gray-900">{totalServices}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Attendees</h4>
                <p className="text-2xl font-semibold text-gray-900">{totalAttendees}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Average Attendance</h4>
                <p className="text-2xl font-semibold text-gray-900">{averageAttendance}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Total Visitors</h4>
                <p className="text-2xl font-semibold text-gray-900">{totalVisitors}</p>
              </div>
            </div>
            
            {/* Attendance records */}
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-700 mb-2">Attendance Records</h4>
              <div className="mt-4 overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Event
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitors
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Demographics
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAttendance.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(record.date)}</div>
                          <div className="text-sm text-gray-500">
                            {record.eventType === "SundayService" ? "Sunday Service" : record.eventType}
                            {record.eventName && ` - ${record.eventName}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.branchName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.attendeeCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.visitorCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {record.adultsCount} adults, {record.youthCount} youth, {record.childrenCount} children
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Branch Comparison Tab */}
        {activeTab === "branch-comparison" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Branch Comparison</h3>
            
            {/* Branch comparison cards */}
            <div className="space-y-4">
              {attendanceByBranch.map((branch) => (
                <div key={branch.branchId} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-900">{branch.branchName}</h4>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {branch.totalServices} service{branch.totalServices !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Attendance</p>
                      <p className="text-2xl font-semibold text-gray-900">{branch.totalAttendees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Attendance</p>
                      <p className="text-2xl font-semibold text-gray-900">{branch.averageAttendance}</p>
                    </div>
                  </div>
                  
                  {/* Progress bar representing branch's contribution to total attendance */}
                  {totalAttendees > 0 && (
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              {Math.round((branch.totalAttendees / totalAttendees) * 100)}% of total
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                          <div 
                            style={{ width: `${(branch.totalAttendees / totalAttendees) * 100}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visitor Flow Tab */}
        {activeTab === "visitor-flow" && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Visitor Flow Between Branches</h3>
            
            {/* Visitor flow cards */}
            <div className="space-y-4">
              {mockVisitorFlows.map((flow) => (
                <div key={flow.visitorId} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-md font-medium text-gray-900">{flow.visitorName}</h4>
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      flow.status === "First Visit" ? "bg-green-50 text-green-700" :
                      flow.status === "Return Visit" ? "bg-blue-50 text-blue-700" :
                      flow.status === "Transferred" ? "bg-purple-50 text-purple-700" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>
                      {flow.status}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Date: {formatDate(flow.date)}</p>
                    
                    <div className="mt-3 flex items-center">
                      {flow.fromBranchName ? (
                        <>
                          <div className="flex-shrink-0 text-center px-2">
                            <p className="text-sm font-medium text-gray-900">{flow.fromBranchName}</p>
                            <p className="text-xs text-gray-500">From</p>
                          </div>
                          <div className="flex-grow px-4">
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="h-0.5 w-full bg-gray-200"></div>
                              </div>
                              <div className="relative flex justify-center">
                                <span className="bg-white px-2">
                                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex-shrink-0 text-center px-2">
                          <p className="text-sm font-medium text-green-600">New Visitor</p>
                        </div>
                      )}
                      
                      <div className="flex-shrink-0 text-center px-2">
                        <p className="text-sm font-medium text-gray-900">{flow.toBranchName}</p>
                        <p className="text-xs text-gray-500">To</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
