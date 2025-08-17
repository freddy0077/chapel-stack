"use client";

import React, { useState } from 'react';
import { 
  HomeIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon,
  UserIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { PastoralVisit } from '@/graphql/hooks/usePastoralCare';
import CreateVisitForm from './forms/CreateVisitForm';
import EditVisitForm from './forms/EditVisitForm';
import DetailModal from './DetailModal';
import AdvancedFilters, { FilterState } from './AdvancedFilters';
import Pagination from './Pagination';

interface PastoralVisitsListProps {
  visits?: PastoralVisit[];
  loading: boolean;
  onCreateVisit?: () => void;
  onUpdateVisit?: (id: string, updates: any) => void;
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

function getVisitTypeIcon(visitType: string) {
  switch (visitType.toLowerCase()) {
    case 'home_visit':
      return '🏠';
    case 'hospital_visit':
      return '🏥';
    case 'counseling':
      return '💬';
    case 'prayer':
      return '🙏';
    default:
      return '👥';
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function PastoralVisitSkeleton() {
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

function PastoralVisitCard({ 
  visit, 
  onUpdate, 
  onEdit, 
  onViewDetails 
}: { 
  visit: PastoralVisit; 
  onUpdate?: (id: string, updates: any) => void;
  onEdit?: (visit: PastoralVisit) => void;
  onViewDetails?: (visit: PastoralVisit) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    if (onUpdate) {
      onUpdate(visit.id, { status: newStatus });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl">{getVisitTypeIcon(visit.visitType)}</div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{visit.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <CalendarDaysIcon className="h-4 w-4 mr-1" />
              <span>Scheduled: {formatDate(visit.scheduledDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>Member ID: {visit.memberId}</span>
              <span className="mx-2">•</span>
              <span>Pastor ID: {visit.pastorId}</span>
            </div>
            {visit.description && isExpanded && (
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                {visit.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
            {getStatusIcon(visit.status)}
            <span className="ml-1 capitalize">{visit.status}</span>
          </span>
          
          {/* Action buttons */}
          <div className="flex space-x-1">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(visit)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="View Details"
              >
                <EyeIcon className="h-4 w-4" />
              </button>
            )}
            
            {onEdit && (
              <button
                onClick={() => onEdit(visit)}
                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                title="Edit Visit"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            )}
            
            {visit.status !== 'COMPLETED' && visit.status !== 'CANCELLED' && onUpdate && (
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

export default function PastoralVisitsList({ visits, loading, onCreateVisit, onUpdateVisit }: PastoralVisitsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('scheduledDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  
  // New state for advanced features
  const [editingVisit, setEditingVisit] = useState<PastoralVisit | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<PastoralVisit | null>(null);
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

  const applyFilters = (visits: PastoralVisit[]) => {
    return visits.filter(visit => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          visit.title.toLowerCase().includes(searchLower) ||
          visit.description?.toLowerCase().includes(searchLower) ||
          visit.notes?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(visit.status)) {
        return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(visit.visitType)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const visitDate = new Date(visit.scheduledDate);
        if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          if (visitDate < startDate) return false;
        }
        if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          if (visitDate > endDate) return false;
        }
      }

      // Show completed filter
      if (!filters.showCompleted && visit.status === 'COMPLETED') {
        return false;
      }

      return true;
    });
  };

  const filteredVisits = applyFilters(visits || []);
  
  // Apply pagination
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisits = filteredVisits.slice(startIndex, startIndex + itemsPerPage);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (searchTerm: string) => {
    // Search is handled through filters
  };

  const handleEditVisit = (visit: PastoralVisit) => {
    setEditingVisit(visit);
  };

  const handleViewDetails = (visit: PastoralVisit) => {
    setSelectedVisit(visit);
  };

  const handleDeleteVisit = (visit: PastoralVisit) => {
    // TODO: Implement delete functionality
    console.log('Delete visit:', visit.id);
  };

  const handleStatusChange = (visitId: string, newStatus: string) => {
    // TODO: Implement status change
    console.log('Change status:', visitId, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <HomeIcon className="h-5 w-5 text-indigo-600 mr-2" />
              Pastoral Visits
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Schedule and manage pastoral visits to members
            </p>
          </div>
          
          {onCreateVisit && (
            <button
              onClick={() => setIsCreateFormOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Schedule Visit
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <AdvancedFilters 
            entityType="visits"
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
              <PastoralVisitSkeleton key={i} />
            ))}
          </div>
        ) : paginatedVisits.length === 0 ? (
          <div className="text-center py-8">
            <HomeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">
              No pastoral visits found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedVisits.map((visit) => (
              <PastoralVisitCard 
                key={visit.id} 
                visit={visit} 
                onUpdate={onUpdateVisit}
                onEdit={handleEditVisit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {paginatedVisits.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {paginatedVisits.length} of {filteredVisits.length} visits
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredVisits.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
        loading={loading}
      />

      {isCreateFormOpen && (
        <CreateVisitForm 
          onClose={() => setIsCreateFormOpen(false)}
          onSubmit={onCreateVisit}
        />
      )}

      {editingVisit && (
        <EditVisitForm 
          visit={editingVisit}
          onClose={() => setEditingVisit(null)}
          onSubmit={(updatedVisit) => {
            onUpdateVisit?.(updatedVisit);
            setEditingVisit(null);
          }}
        />
      )}

      {selectedVisit && (
        <DetailModal 
          entity={selectedVisit}
          entityType="visit"
          onClose={() => setSelectedVisit(null)}
          onEdit={() => {
            setEditingVisit(selectedVisit);
            setSelectedVisit(null);
          }}
          onDelete={() => {
            handleDeleteVisit(selectedVisit);
            setSelectedVisit(null);
          }}
          onStatusChange={(newStatus) => {
            handleStatusChange(selectedVisit.id, newStatus);
            setSelectedVisit(null);
          }}
        />
      )}
    </div>
  );
}
