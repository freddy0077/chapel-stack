"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BoltIcon, 
  EnvelopeIcon, 
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { AutomationStats } from '../types/automation.types';

interface AutomationDashboardProps {
  stats: AutomationStats;
  onCreateAutomation: () => void;
  onManageTemplates: () => void;
  onViewLogs: () => void;
}

export default function AutomationDashboard({
  stats,
  onCreateAutomation,
  onManageTemplates,
  onViewLogs,
}: AutomationDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automation Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Manage automated messages and triggers for your church
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Automations */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Active Automations</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {stats.activeAutomations}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                of {stats.totalAutomations} total
              </p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <BoltIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Messages Sent */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Messages Sent</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {stats.totalMessagesSent.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 mt-1">
                all time
              </p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <EnvelopeIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Success Rate */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Success Rate</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {stats.successRate.toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 mt-1">
                delivery success
              </p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <CheckCircleIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Recent Runs</p>
              <p className="text-3xl font-bold text-amber-900 mt-2">
                {stats.recentRuns.length}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                in last 24 hours
              </p>
            </div>
            <div className="p-3 bg-amber-500 rounded-full">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onCreateAutomation}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <PlusIcon className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">New Automation</p>
              <p className="text-xs text-blue-100">Create a new trigger</p>
            </div>
          </button>

          <button
            onClick={onManageTemplates}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <DocumentTextIcon className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">Manage Templates</p>
              <p className="text-xs text-purple-100">Edit message templates</p>
            </div>
          </button>

          <button
            onClick={onViewLogs}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            <ChartBarIcon className="h-6 w-6" />
            <div className="text-left">
              <p className="font-semibold">View Logs</p>
              <p className="text-xs text-gray-100">See automation history</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Recent Automation Runs */}
      {stats.recentRuns.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentRuns.slice(0, 5).map((run) => (
              <div
                key={run.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    run.status === 'SUCCESS' ? 'bg-green-100' :
                    run.status === 'FAILED' ? 'bg-red-100' :
                    'bg-yellow-100'
                  }`}>
                    {run.status === 'SUCCESS' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : run.status === 'FAILED' ? (
                      <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{run.automationName}</p>
                    <p className="text-sm text-gray-600">
                      {run.successCount} of {run.recipientCount} sent successfully
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(run.executedAt).toLocaleTimeString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(run.executedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
