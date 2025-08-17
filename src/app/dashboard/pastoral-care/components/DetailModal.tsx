'use client';

import React, { useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  CalendarDaysIcon,
  ClockIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { PastoralVisit, CounselingSession, CareRequest } from '../../../graphql/hooks/usePastoralCare';

type EntityType = 'visit' | 'session' | 'request';
type EntityData = PastoralVisit | CounselingSession | CareRequest;

interface DetailModalProps {
  entityType: EntityType;
  entity: EntityData;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (newStatus: string) => void;
}

const getEntityIcon = (type: EntityType) => {
  switch (type) {
    case 'visit':
      return DocumentTextIcon;
    case 'session':
      return ChatBubbleLeftRightIcon;
    case 'request':
      return HeartIcon;
    default:
      return DocumentTextIcon;
  }
};

const getEntityTitle = (type: EntityType) => {
  switch (type) {
    case 'visit':
      return 'Pastoral Visit Details';
    case 'session':
      return 'Counseling Session Details';
    case 'request':
      return 'Care Request Details';
    default:
      return 'Details';
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'RESCHEDULED':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-purple-100 text-purple-800';
    case 'PENDING':
      return 'bg-orange-100 text-orange-800';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800';
    case 'OPEN':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case 'LOW':
      return 'bg-gray-100 text-gray-800';
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800';
    case 'URGENT':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function DetailModal({
  entityType,
  entity,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: DetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const EntityIcon = getEntityIcon(entityType);
  const title = getEntityTitle(entityType);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
  };

  const renderVisitDetails = (visit: PastoralVisit) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Visit Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Visit Type:</span>
              <p className="text-sm font-medium text-gray-900">{visit.visitType?.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                {visit.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Scheduled Date:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(visit.scheduledDate)}
              </p>
            </div>
            {visit.completedDate && (
              <div>
                <span className="text-sm text-gray-500">Completed Date:</span>
                <p className="text-sm font-medium text-gray-900">{formatDate(visit.completedDate)}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">People Involved</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Member:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                {visit.memberId}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Pastor:</span>
              <p className="text-sm font-medium text-gray-900">{visit.pastorId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created By:</span>
              <p className="text-sm font-medium text-gray-900">{visit.createdBy}</p>
            </div>
          </div>
        </div>
      </div>

      {visit.description && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{visit.description}</p>
        </div>
      )}

      {visit.notes && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{visit.notes}</p>
        </div>
      )}
    </>
  );

  const renderSessionDetails = (session: CounselingSession) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Session Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Session Type:</span>
              <p className="text-sm font-medium text-gray-900">{session.sessionType?.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Scheduled Date:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(session.scheduledDate)}
              </p>
            </div>
            {session.completedDate && (
              <div>
                <span className="text-sm text-gray-500">Completed Date:</span>
                <p className="text-sm font-medium text-gray-900">{formatDate(session.completedDate)}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">People Involved</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Member:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                {session.memberId}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Counselor:</span>
              <p className="text-sm font-medium text-gray-900">{session.counselorId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created By:</span>
              <p className="text-sm font-medium text-gray-900">{session.createdBy}</p>
            </div>
          </div>
        </div>
      </div>

      {session.description && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{session.description}</p>
        </div>
      )}

      {session.notes && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Session Notes</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{session.notes}</p>
        </div>
      )}
    </>
  );

  const renderRequestDetails = (request: CareRequest) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Request Information</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Request Type:</span>
              <p className="text-sm font-medium text-gray-900">{request.requestType?.replace('_', ' ')}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Priority:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Request Date:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                {formatDateOnly(request.requestDate)}
              </p>
            </div>
            {request.completionDate && (
              <div>
                <span className="text-sm text-gray-500">Completion Date:</span>
                <p className="text-sm font-medium text-gray-900">{formatDateOnly(request.completionDate)}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">People Involved</h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Member:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <UserIcon className="h-4 w-4 mr-1 text-gray-400" />
                {request.memberId}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Assigned Pastor:</span>
              <p className="text-sm font-medium text-gray-900">{request.assignedPastorId || 'Not assigned'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Requester:</span>
              <p className="text-sm font-medium text-gray-900">{request.requesterId}</p>
            </div>
          </div>
        </div>
      </div>

      {request.description && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{request.description}</p>
        </div>
      )}

      {request.notes && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{request.notes}</p>
        </div>
      )}
    </>
  );

  const renderEntityDetails = () => {
    switch (entityType) {
      case 'visit':
        return renderVisitDetails(entity as PastoralVisit);
      case 'session':
        return renderSessionDetails(entity as CounselingSession);
      case 'request':
        return renderRequestDetails(entity as CareRequest);
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <EntityIcon className="h-5 w-5 mr-2 text-indigo-600" />
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{entity.title}</h2>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              Created {formatDate(entity.createdAt)}
              {entity.updatedAt !== entity.createdAt && (
                <span className="ml-2">• Updated {formatDate(entity.updatedAt)}</span>
              )}
            </div>
          </div>

          {/* Entity-specific details */}
          <div className="mb-8">
            {renderEntityDetails()}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex space-x-2">
              {/* Status change buttons */}
              {entity.status !== 'COMPLETED' && entity.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleStatusChange(entityType === 'request' ? 'RESOLVED' : 'COMPLETED')}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 border border-green-300 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Mark {entityType === 'request' ? 'Resolved' : 'Complete'}
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-300 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  Delete
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-md">
                <div className="flex items-center mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Confirm Delete</h4>
                </div>
                <p className="text-sm text-gray-700 mb-6">
                  Are you sure you want to delete this {entityType}? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
