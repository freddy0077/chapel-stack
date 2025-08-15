"use client";

import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  UserIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { CareRequest } from '@/graphql/hooks/usePastoralCare';

interface CareRequestsListProps {
  requests?: CareRequest[];
  loading: boolean;
  onCreateRequest?: () => void;
  onUpdateRequest?: (id: string, updates: any) => void;
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'assigned':
      return 'bg-purple-100 text-purple-800';
    case 'pending':
    case 'submitted':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'pastoral_visit':
      return '🏠';
    case 'counseling':
      return '💬';
    case 'prayer_request':
      return '🙏';
    case 'hospital_visit':
      return '🏥';
    case 'bereavement_support':
      return '💐';
    case 'marriage_counseling':
      return '💒';
    case 'spiritual_guidance':
      return '✝️';
    case 'emergency_support':
      return '🚨';
    default:
      return '📋';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function CareRequestCard({ request, onUpdate }: { request: CareRequest; onUpdate?: (id: string, updates: any) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    if (onUpdate) {
      onUpdate(request.id, { status: newStatus });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl">{getTypeIcon(request.requestType)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {request.title}
              </h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center">
                <UserIcon className="h-3 w-3 mr-1" />
                {request.memberName || `Member ID: ${request.memberId}`}
              </span>
              <span className="flex items-center">
                <CalendarDaysIcon className="h-3 w-3 mr-1" />
                {formatDate(request.requestDate)}
              </span>
              {request.assignedPastorName && (
                <span className="flex items-center">
                  Pastor: {request.assignedPastorName}
                </span>
              )}
            </div>

            {request.description && isExpanded && (
              <p className="text-sm text-gray-600 mb-2">
                {request.description}
              </p>
            )}

            {request.completionDate && (
              <p className="text-xs text-gray-500">
                Completed: {formatDate(request.completionDate)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {request.status.replace('_', ' ')}
          </span>
          
          {request.status !== 'COMPLETED' && request.status !== 'CANCELLED' && (
            <div className="flex space-x-1">
              {request.status === 'SUBMITTED' && (
                <button
                  onClick={() => handleStatusChange('ASSIGNED')}
                  className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  title="Assign"
                >
                  <ClockIcon className="h-4 w-4" />
                </button>
              )}
              {(request.status === 'ASSIGNED' || request.status === 'IN_PROGRESS') && (
                <button
                  onClick={() => handleStatusChange('COMPLETED')}
                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                  title="Mark Complete"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => handleStatusChange('CANCELLED')}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Cancel"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {request.description && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-indigo-600 hover:text-indigo-500 mt-2"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

function CareRequestSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

export default function CareRequestsList({ requests, loading, onCreateRequest, onUpdateRequest }: CareRequestsListProps) {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const filteredRequests = requests?.filter(request => {
    if (filter === 'all') return true;
    return request.status.toLowerCase() === filter.toLowerCase();
  }) || [];

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
               (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'date':
      default:
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Requests</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <CareRequestSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Care Requests</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="status">Sort by Status</option>
          </select>

          {onCreateRequest && (
            <button
              onClick={onCreateRequest}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              New Request
            </button>
          )}
        </div>
      </div>

      {sortedRequests.length === 0 ? (
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No care requests found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filter === 'all' 
              ? 'Care requests will appear here when members submit them'
              : `No requests with status: ${filter}`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRequests.map((request) => (
            <CareRequestCard 
              key={request.id} 
              request={request} 
              onUpdate={onUpdateRequest}
            />
          ))}
        </div>
      )}

      {sortedRequests.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {sortedRequests.length} of {requests?.length || 0} requests
        </div>
      )}
    </div>
  );
}
