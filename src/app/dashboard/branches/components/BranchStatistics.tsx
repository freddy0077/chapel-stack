"use client";

import {
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowUpIcon
} from "@heroicons/react/24/outline";

interface BranchStatisticsProps {
  statistics: {
    totalMembers: number;
    activeMembersLastMonth: number;
    totalFamilies: number;
    averageWeeklyAttendance: number;
    totalMinistries: number;
    baptismsYTD: number;
    firstCommunionsYTD: number;
    confirmationsYTD: number;
    marriagesYTD: number;
    annualBudget?: number;
    ytdIncome?: number;
    ytdExpenses?: number;
  };
  branchName: string;
}

export default function BranchStatistics({ statistics, branchName }: BranchStatisticsProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Branch Statistics</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Key metrics and statistics for {branchName}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <button className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <CalendarIcon className="-ml-0.5 mr-1.5 h-3.5 w-3.5" />
            Last Month
          </button>
          <button className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <ChartBarIcon className="-ml-0.5 mr-1.5 h-3.5 w-3.5" />
            View Report
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-sm">
              <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Members</dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statistics.totalMembers.toLocaleString()}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 mr-2">
                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
                {(typeof statistics.activeMembersLastMonth === 'number' && typeof statistics.totalMembers === 'number' ? ((statistics.activeMembersLastMonth / statistics.totalMembers) * 100).toFixed(1) : '-')}%
              </div>
              {(typeof statistics.activeMembersLastMonth === 'number' ? statistics.activeMembersLastMonth.toLocaleString() : '-')} active in the last month
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-sm">
              <CalendarIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Attendance</dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(typeof statistics.averageWeeklyAttendance === 'number' ? statistics.averageWeeklyAttendance.toLocaleString() : '-')}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 mr-2">
                {((statistics.averageWeeklyAttendance / statistics.totalMembers) * 100).toFixed(0)}%
              </div>
              Average over the past 3 months
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-sm">
              <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Total Families</dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(typeof statistics.totalFamilies === 'number' ? statistics.totalFamilies.toLocaleString() : '-')}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">
                {(statistics.totalMembers / statistics.totalFamilies).toFixed(1)}
              </span>
              members per family on average
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-sm">
              <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">Sacraments (YTD)</dt>
                <dd>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(statistics.baptismsYTD + statistics.firstCommunionsYTD + 
                      statistics.confirmationsYTD + statistics.marriagesYTD).toLocaleString()}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-pink-400 mr-2"></span>
                Baptisms: {statistics.baptismsYTD}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                First Communions: {statistics.firstCommunionsYTD}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                Confirmations: {statistics.confirmationsYTD}
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                Marriages: {statistics.marriagesYTD}
              </div>
            </div>
          </div>
        </div>
        
        {statistics.annualBudget && (
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-amber-500 p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Annual Budget</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      ${statistics.annualBudget.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            {statistics.ytdIncome && statistics.ytdExpenses && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500">
                  <div>YTD Income: ${statistics.ytdIncome.toLocaleString()}</div>
                  <div>YTD Expenses: ${statistics.ytdExpenses.toLocaleString()}</div>
                  <div className="col-span-2">
                    Balance: ${(statistics.ytdIncome - statistics.ytdExpenses).toLocaleString()}
                    <span className={statistics.ytdIncome >= statistics.ytdExpenses ? " text-green-600" : " text-red-600"}>
                      ({statistics.ytdIncome >= statistics.ytdExpenses ? "+" : ""}
                      {((statistics.ytdIncome - statistics.ytdExpenses) / statistics.annualBudget * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-md bg-rose-500 p-3">
              <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">Active Ministries</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {statistics.totalMinistries}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              Click to view all ministries and their leaders
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
