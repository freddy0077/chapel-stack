"use client";

import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import Modal from '@/components/ui/Modal';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { GET_AUTOMATION_LOGS } from '../graphql/automation.mutations';

interface AutomationLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AutomationLog {
  id: string;
  automationId: string;
  automationName: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'PARTIAL';
  executedAt: string;
  completedAt?: string;
  recipientCount: number;
  successCount: number;
  failureCount: number;
  errorMessage?: string;
  details?: string;
}

export default function AutomationLogsModal({
  isOpen,
  onClose,
}: AutomationLogsModalProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  const { data, loading, error } = useQuery(GET_AUTOMATION_LOGS, {
    skip: !isOpen,
    fetchPolicy: 'cache-and-network',
  });

  const logs: AutomationLog[] = useMemo(() => {
    return data?.automationLogs?.logs || [];
  }, [data]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'FAILED':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'PARTIAL':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-50 border-green-200';
      case 'FAILED':
        return 'bg-red-50 border-red-200';
      case 'PARTIAL':
        return 'bg-yellow-50 border-yellow-200';
      case 'PENDING':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (startDate: string, endDate?: string) => {
    if (!endDate) return 'In progress...';
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const duration = Math.floor((end - start) / 1000);

    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Automation Logs"
      description="View execution history and logs for all automations"
      size="lg"
    >
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading logs...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Error loading logs: {error.message}
            </p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-600">No automation logs yet</p>
            <p className="text-sm text-gray-500">
              Logs will appear here as automations are executed
            </p>
          </div>
        )}

        {!loading && !error && logs.length > 0 && (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card
                key={log.id}
                className={`p-4 border ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(log.status)}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {log.automationName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(log.executedAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusBadgeColor(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Recipients</p>
                        <p className="font-semibold text-gray-900">
                          {log.recipientCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Successful</p>
                        <p className="font-semibold text-green-600">
                          {log.successCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Failed</p>
                        <p className="font-semibold text-red-600">
                          {log.failureCount}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    {log.completedAt && (
                      <p className="text-xs text-gray-600 mt-2">
                        Duration:{' '}
                        {formatDuration(log.executedAt, log.completedAt)}
                      </p>
                    )}

                    {/* Error Message */}
                    {log.errorMessage && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                        {log.errorMessage}
                      </div>
                    )}

                    {/* Details */}
                    {log.details && (
                      <div className="mt-2">
                        <button
                          onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <ChevronDownIcon
                            className={`h-4 w-4 transition-transform ${
                              expandedLogId === log.id ? 'rotate-180' : ''
                            }`}
                          />
                          View Details
                        </button>
                        {expandedLogId === log.id && (
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32 whitespace-pre-wrap break-words">
                            {typeof log.details === 'string' ? log.details : JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
