'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { Card } from '@/components/ui/card';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { GET_AUDIT_LOGS } from './graphql/audit.queries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles?: Role[];
}

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  description: string;
  userId?: string;
  user?: User;
  branchId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: string;
}

interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  limit: number;
  offset: number;
}

export default function AuditsPage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    action: '',
    entityType: '',
    limit: 50,
    offset: 0,
  });

  const { data, loading, error, refetch } = useQuery<{ auditLogs: AuditLogsResponse }>(
    GET_AUDIT_LOGS,
    {
      variables: {
        organisationId,
        branchId,
        limit: filters.limit,
        offset: filters.offset,
        filters: {
          ...(filters.action && { action: filters.action }),
          ...(filters.entityType && { entityType: filters.entityType }),
        },
      },
      skip: !organisationId || !branchId,
    },
  );

  const logs: AuditLog[] = useMemo(() => {
    try {
      const auditLogsData = data?.auditLogs;
      if (!auditLogsData) return [];
      if (!Array.isArray(auditLogsData.logs)) return [];
      return auditLogsData.logs;
    } catch (err) {
      console.error('Error parsing logs:', err);
      return [];
    }
  }, [data]);

  const total = useMemo(() => {
    try {
      return data?.auditLogs?.total || 0;
    } catch (err) {
      console.error('Error getting total:', err);
      return 0;
    }
  }, [data]);

  const ActionIcon = React.memo(({ action }: { action?: string }) => {
    if (!action) {
      return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
    }
    
    switch (action) {
      case 'CREATE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'UPDATE':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'DELETE':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'LOGIN':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'LOGOUT':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
    }
  });
  
  ActionIcon.displayName = 'ActionIcon';

  const getActionColor = (action?: string) => {
    if (!action) return 'bg-gray-50 border-gray-200';
    
    switch (action) {
      case 'CREATE':
        return 'bg-green-50 border-green-200';
      case 'UPDATE':
        return 'bg-blue-50 border-blue-200';
      case 'DELETE':
        return 'bg-red-50 border-red-200';
      case 'LOGIN':
        return 'bg-green-50 border-green-200';
      case 'LOGOUT':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getRoleColor = (roleName?: string) => {
    if (!roleName) return 'bg-gray-100 text-gray-700';
    
    switch (roleName.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700';
      case 'SYSTEM_ADMIN':
        return 'bg-orange-100 text-orange-700';
      case 'BRANCH_ADMIN':
        return 'bg-blue-100 text-blue-700';
      case 'STAFF':
        return 'bg-green-100 text-green-700';
      case 'MEMBER':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatRoleName = (roleName?: string) => {
    if (!roleName) return 'Unknown';
    return roleName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handlePreviousPage = () => {
    if (filters.offset > 0) {
      setFilters({
        ...filters,
        offset: Math.max(0, filters.offset - filters.limit),
      });
    }
  };

  const handleNextPage = () => {
    if (filters.offset + filters.limit < total) {
      setFilters({
        ...filters,
        offset: filters.offset + filters.limit,
      });
    }
  };

  if (!organisationId || !branchId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading organisation and branch...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
          <p className="mt-1 text-gray-600">
            View all system activities and changes in your branch
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value, offset: 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
            </select>
          </div>

          {/* Entity Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entity Type
            </label>
            <select
              value={filters.entityType}
              onChange={(e) =>
                setFilters({ ...filters, entityType: e.target.value, offset: 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="USER">User</option>
              <option value="AUTOMATION">Automation</option>
              <option value="MEMBER">Member</option>
              <option value="TEMPLATE">Template</option>
              <option value="BRANCH">Branch</option>
            </select>
          </div>

          {/* Limit Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Results Per Page
            </label>
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters({ ...filters, limit: parseInt(e.target.value), offset: 0 })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <p className="text-red-700">
            Error loading audit logs: {error.message}
          </p>
        </Card>
      )}

      {/* Logs List */}
      {!loading && !error && logs && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => {
            if (!log || !log.id) return null;
            
            return (
              <Card
                key={log.id}
                className={`p-4 border-l-4 transition-all ${getActionColor(log?.action)}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <ActionIcon action={log?.action} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {log?.action || 'Unknown'}
                        </span>
                        <span className="text-sm text-gray-600">
                          {log?.entityType || 'Unknown'}
                        </span>
                        {log?.entityId && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {log.entityId}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mt-1">
                        {log?.description || 'No description'}
                      </p>
                      <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>{log?.createdAt ? formatDate(log.createdAt) : 'Unknown date'}</span>
                          {log?.ipAddress && <span>IP: {log.ipAddress}</span>}
                        </div>
                        {log?.user ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-900">
                                {log.user.firstName} {log.user.lastName}
                              </span>
                              <span className="text-gray-500 text-xs">({log.user.email})</span>
                            </div>
                            {log.user.roles && log.user.roles.length > 0 && (
                              <div className="flex items-center gap-1">
                                {log.user.roles.map((role) => (
                                  <span
                                    key={role.id}
                                    className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(role.name)}`}
                                  >
                                    {formatRoleName(role.name)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : log?.userId ? (
                          <span className="text-xs">User ID: {log.userId}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Expand Button */}
                  {log?.metadata && (
                    <button
                      onClick={() =>
                        setExpandedLogId(
                          expandedLogId === log.id ? null : log.id,
                        )
                      }
                      className="ml-4 p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${
                          expandedLogId === log.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedLogId === log.id && log?.metadata && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <pre className="p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-auto max-h-48 whitespace-pre-wrap break-words">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && logs.length === 0 && (
        <Card className="p-12 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No audit logs found</p>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your filters or check back later
          </p>
        </Card>
      )}

      {/* Pagination */}
      {!loading && !error && logs.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Showing {filters.offset + 1} to{' '}
            {Math.min(filters.offset + filters.limit, total)} of {total} logs
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={filters.offset === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={filters.offset + filters.limit >= total}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
