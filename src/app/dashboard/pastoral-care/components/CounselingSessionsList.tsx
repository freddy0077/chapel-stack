"use client";

import React, { useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon,
  UserIcon,
  AcademicCapIcon,
  EyeIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { CareRequest } from '@/graphql/hooks/usePastoralCare';
import CreateSessionForm from './forms/CreateSessionForm';
import EditSessionForm from './forms/EditSessionForm';
import DetailModal from './DetailModal';
import AdvancedFilters, { FilterState } from './AdvancedFilters';
import Pagination from './Pagination';

interface CounselingSessionsListProps {
  sessions?: CareRequest[];
  loading: boolean;
  onCreateSession?: () => void;
  onUpdateSession?: (id: string, updates: any) => void;
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    case 'cancelled':
      return <XCircleIcon className="h-4 w-4 text-red-600" />;
    case 'scheduled':
      return <CalendarDaysIcon className="h-4 w-4 text-blue-600" />;
    default:
      return <ClockIcon className="h-4 w-4 text-yellow-600" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

function getRequestTypeIcon(requestType: string) {
  switch (requestType.toLowerCase()) {
    case 'counseling':
      return '💬';
    case 'crisis':
      return '🚨';
    case 'spiritual':
      return '🙏';
    case 'family':
      return '👨‍👩‍👧‍👦';
    default:
      return '💬';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function CounselingSessionSkeleton() {
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

function CounselingSessionCard({ 
  session, 
  onUpdate, 
  onEdit, 
  onViewDetails 
}: { 
  session: CareRequest; 
  onUpdate?: (id: string, updates: any) => void;
  onEdit?: (session: CareRequest) => void;
  onViewDetails?: (session: CareRequest) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    if (onUpdate) {
      onUpdate(session.id, { status: newStatus });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl">{getRequestTypeIcon(session.requestType)}</div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{session.title}</h3>
            {session.requester && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <UserIcon className="h-4 w-4 mr-1" />
                <span>{session.requester.firstName} {session.requester.lastName}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              <span>Requested: {formatDate(session.requestDate)}</span>
            </div>
            {(session.assignedPastor || session.assistantId) && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <UserIcon className="h-4 w-4 mr-1" />
                {session.assignedPastor && (
                  <span>Assigned Pastor: {session.assignedPastor.firstName} {session.assignedPastor.lastName}</span>
                )}
                {session.assignedPastor && session.assistantId && (
                  <span className="mx-2">•</span>
                )}
                {session.assistantId && (
                  <span>Assistant: {session.assistantId}</span>
                )}
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                session.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                session.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                Priority: {session.priority}
              </span>
              {session.urgentNotes && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  🚨 Urgent
                </span>
              )}
            </div>
            {session.contactInfo && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span className="font-medium">Contact:</span>
                <span className="ml-1">{session.contactInfo}</span>
                {session.preferredContactMethod && (
                  <span className="ml-2 text-gray-500">({session.preferredContactMethod})</span>
                )}
              </div>
            )}
            {session.assignedDate && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                <span>Assigned: {formatDate(session.assignedDate)}</span>
              </div>
            )}
            {session.responseDate && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                <span>Response: {formatDate(session.responseDate)}</span>
              </div>
            )}
            {isExpanded && (
              <div className="mt-3 space-y-2">
                {session.requester && (session.requester.email || session.requester.phoneNumber) && (
                  <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-medium text-blue-900 mb-1">Member Contact</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      {session.requester.email && (
                        <div>Email: {session.requester.email}</div>
                      )}
                      {session.requester.phoneNumber && (
                        <div>Phone: {session.requester.phoneNumber}</div>
                      )}
                    </div>
                  </div>
                )}
                {session.description && (
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-sm text-gray-600">{session.description}</p>
                  </div>
                )}
                {session.urgentNotes && (
                  <div className="bg-orange-50 p-3 rounded border border-orange-200">
                    <h4 className="font-medium text-orange-900 mb-1">🚨 Urgent Notes</h4>
                    <p className="text-sm text-orange-800">{session.urgentNotes}</p>
                  </div>
                )}
                {session.responseNotes && (
                  <div className="bg-blue-50 p-3 rounded">
                    <h4 className="font-medium text-blue-900 mb-1">Response Notes</h4>
                    <p className="text-sm text-blue-800">{session.responseNotes}</p>
                  </div>
                )}
                {session.actionsTaken && (
                  <div className="bg-green-50 p-3 rounded">
                    <h4 className="font-medium text-green-900 mb-1">Actions Taken</h4>
                    <p className="text-sm text-green-800">{session.actionsTaken}</p>
                  </div>
                )}
                {session.resolutionNotes && (
                  <div className="bg-purple-50 p-3 rounded">
                    <h4 className="font-medium text-purple-900 mb-1">Resolution Notes</h4>
                    <p className="text-sm text-purple-800">{session.resolutionNotes}</p>
                  </div>
                )}
                {session.notes && (
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="font-medium text-gray-900 mb-1">Additional Notes</h4>
                    <p className="text-sm text-gray-600">{session.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
            {getStatusIcon(session.status)}
            <span className="ml-1 capitalize">{session.status}</span>
          </span>
          
          {/* Action buttons */}
          <div className="flex space-x-1">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(session)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="View Details"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => onEdit(session)}
                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                title="Edit Session"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
            
            {session.status !== 'COMPLETED' && session.status !== 'CANCELLED' && onUpdate && (
              <>
                <button
                  onClick={() => handleStatusChange('COMPLETED')}
                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                  title="Mark Complete"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleStatusChange('CANCELLED')}
                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  title="Cancel"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expand/Collapse button */}
      <div className="mt-3 flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CounselingSessionsList({ sessions, loading, onCreateSession, onUpdateSession }: CounselingSessionsListProps) {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  
  // New state for advanced features
  const [editingSession, setEditingSession] = useState<CareRequest | null>(null);
  const [selectedSession, setSelectedSession] = useState<CareRequest | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    status: [],
    type: [],
    priority: [],
    assignedTo: [],
    member: [],
    dateRange: null,
    showCompleted: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Apply advanced filtering
  const applyFilters = (sessions: CareRequest[]) => {
    return sessions.filter(session => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          session.title?.toLowerCase().includes(searchLower) ||
          session.description?.toLowerCase().includes(searchLower) ||
          session.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(session.status)) {
        return false;
      }

      // Type filter (using requestType for care requests)
      if (filters.type.length > 0 && !filters.type.includes(session.requestType)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(session.priority)) {
        return false;
      }

      // Date range filter (using requestDate for care requests)
      if (filters.dateRange) {
        const sessionDate = new Date(session.requestDate);
        if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          if (sessionDate < startDate) return false;
        }
        if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          if (sessionDate > endDate) return false;
        }
      }

      // Show completed filter
      if (!filters.showCompleted && session.status === 'COMPLETED') {
        return false;
      }

      return true;
    });
  };

  const filteredSessions = applyFilters(sessions || []);
  
  // Apply pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSessions = filteredSessions.slice(startIndex, startIndex + itemsPerPage);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleEditSession = (session: CounselingSession) => {
    setEditingSession(session);
  };

  const handleViewDetails = (session: CounselingSession) => {
    setSelectedSession(session);
  };

  const handleDeleteSession = (session: CounselingSession) => {
    // TODO: Implement delete functionality
    console.log('Delete session:', session.id);
  };

  const handleStatusChange = (sessionId: string, newStatus: string) => {
    // TODO: Implement status change
    console.log('Change status:', sessionId, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600 mr-2" />
              Counseling Sessions
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Schedule and manage counseling sessions with members
            </p>
          </div>
          
          {onCreateSession && (
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Session
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <AdvancedFilters 
            entityType="sessions"
            filters={filters} 
            onChange={handleFiltersChange} 
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <CounselingSessionSkeleton key={i} />
            ))}
          </div>
        ) : paginatedSessions.length === 0 ? (
          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No counseling sessions found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedSessions.map((session) => (
              <CounselingSessionCard 
                key={session.id} 
                session={session} 
                onUpdate={onUpdateSession}
                onEdit={handleEditSession}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {paginatedSessions.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {paginatedSessions.length} of {filteredSessions.length} sessions
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSessions.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        loading={loading}
      />

      {/* Modals */}
      {isCreateFormOpen && (
        <CreateSessionForm 
          onClose={() => setIsCreateFormOpen(false)}
          onSubmit={(newSession) => {
            onCreateSession?.();
            setIsCreateFormOpen(false);
          }}
        />
      )}

      {editingSession && (
        <EditSessionForm 
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSubmit={(updatedSession) => {
            onUpdateSession?.(updatedSession.id, updatedSession);
            setEditingSession(null);
          }}
        />
      )}

      {selectedSession && (
        <DetailModal 
          entity={selectedSession}
          entityType="session"
          onClose={() => setSelectedSession(null)}
          onEdit={() => {
            setEditingSession(selectedSession);
            setSelectedSession(null);
          }}
          onDelete={() => {
            handleDeleteSession(selectedSession);
            setSelectedSession(null);
          }}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedSession.id, newStatus);
            setSelectedSession(null);
          }}
        />
      )}
    </div>
  );
}
