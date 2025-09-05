"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  PencilIcon,
} from "@heroicons/react/24/outline";
import { PastoralVisit } from "@/graphql/hooks/usePastoralCare";
import CreateVisitForm from "./forms/CreateVisitForm";
import EditVisitForm from "./forms/EditVisitForm";
import DetailModal from "./DetailModal";
import AdvancedFilters, { FilterState } from "./AdvancedFilters";
import Pagination from "./Pagination";

interface PastoralVisitsListProps {
  visits?: PastoralVisit[];
  loading: boolean;
  onCreateVisit?: () => void;
  onUpdateVisit?: (id: string, updates: any) => void;
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
    case "cancelled":
      return <XCircleIcon className="h-4 w-4 text-red-600" />;
    case "scheduled":
      return <CalendarDaysIcon className="h-4 w-4 text-blue-600" />;
    default:
      return <ClockIcon className="h-4 w-4 text-yellow-600" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
}

function getVisitTypeIcon(visitType: string) {
  switch (visitType.toLowerCase()) {
    case "home_visit":
      return "🏠";
    case "hospital_visit":
      return "🏥";
    case "counseling":
      return "💬";
    case "prayer":
      return "🙏";
    default:
      return "👥";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PastoralVisitSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 animate-pulse shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded-lg w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded-xl w-20"></div>
      </div>
    </div>
  );
}

function PastoralVisitCard({
  visit,
  onUpdate,
  onEdit,
  onViewDetails,
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
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-[1.02] transform"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-3xl p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">{getVisitTypeIcon(visit.visitType)}</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{visit.title}</h3>
            <div className="flex items-center bg-indigo-50 px-3 py-2 rounded-lg mb-2">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">Scheduled: {formatDate(visit.scheduledDate)}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                <UserIcon className="h-4 w-4 mr-2 text-indigo-500" />
                Member ID: {visit.memberId}
              </span>
              <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                Pastor ID: {visit.pastorId}
              </span>
            </div>
            {visit.description && isExpanded && (
              <p className="text-sm text-gray-700 mt-4 bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-xl border border-gray-100 animate-fade-in">
                {visit.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${getStatusColor(visit.status)}`}
          >
            {getStatusIcon(visit.status)}
            <span className="ml-2 capitalize">{visit.status}</span>
          </span>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails(visit)}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                title="View Details"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(visit)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                title="Edit Visit"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            )}

            {visit.status !== "COMPLETED" &&
              visit.status !== "CANCELLED" &&
              onUpdate && (
                <>
                  <button
                    onClick={() => handleStatusChange("COMPLETED")}
                    className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                    title="Mark Complete"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleStatusChange("CANCELLED")}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                    title="Cancel"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </>
              )}
          </div>
        </div>
      </div>

      {/* Expand/Collapse button */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center px-3 py-1 rounded-lg hover:bg-indigo-50 transition-all duration-200 hover:scale-105 active:scale-95 transform"
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

export default function PastoralVisitsList({
  visits,
  loading,
  onCreateVisit,
  onUpdateVisit,
}: PastoralVisitsListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("scheduledDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedVisits, setExpandedVisits] = useState<Set<string>>(new Set());
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  // New state for advanced features
  const [editingVisit, setEditingVisit] = useState<PastoralVisit | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<PastoralVisit | null>(
    null,
  );
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
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
    return visits.filter((visit) => {
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
      if (!filters.showCompleted && visit.status === "COMPLETED") {
        return false;
      }

      return true;
    });
  };

  const filteredVisits = applyFilters(visits || []);

  // Apply pagination
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisits = filteredVisits.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
    console.log("Delete visit:", visit.id);
  };

  const handleStatusChange = (visitId: string, newStatus: string) => {
    // TODO: Implement status change
    console.log("Change status:", visitId, newStatus);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
      {/* Header */}
      <div className="p-8 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-2">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mr-4">
                <HomeIcon className="h-6 w-6 text-white" />
              </div>
              Pastoral Visits
            </h2>
            <p className="text-gray-600">
              Schedule and manage pastoral visits to members
            </p>
          </div>

          {onCreateVisit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateFormOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Schedule Visit
            </motion.button>
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
      <div className="p-8">
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <PastoralVisitSkeleton key={i} />
            ))}
          </div>
        ) : paginatedVisits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
              <HomeIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No pastoral visits found
            </h4>
            <p className="text-gray-600">Visits will appear here when scheduled</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <AnimatePresence>
              {paginatedVisits.map((visit, index) => (
                <motion.div
                  key={visit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PastoralVisitCard
                    visit={visit}
                    onUpdate={onUpdateVisit}
                    onEdit={handleEditVisit}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {paginatedVisits.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <span className="text-sm font-medium text-gray-700">
                Showing {paginatedVisits.length} of {filteredVisits.length} visits
              </span>
            </div>
          </motion.div>
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
