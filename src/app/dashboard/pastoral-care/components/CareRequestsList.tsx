"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExclamationTriangleIcon,
  UserIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  FunnelIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { CareRequest } from "@/graphql/hooks/usePastoralCare";

interface CareRequestsListProps {
  requests?: CareRequest[];
  loading: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onCreateRequest?: () => void;
  onUpdateRequest?: (id: string, updates: any) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "urgent":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "assigned":
      return "bg-purple-100 text-purple-800";
    case "pending":
    case "submitted":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getTypeIcon(type: string) {
  switch (type.toLowerCase()) {
    case "pastoral_visit":
      return "🏠";
    case "counseling":
      return "💬";
    case "prayer_request":
      return "🙏";
    case "hospital_visit":
      return "🏥";
    case "bereavement_support":
      return "💐";
    case "marriage_counseling":
      return "💒";
    case "spiritual_guidance":
      return "✝️";
    case "emergency_support":
      return "🚨";
    default:
      return "📋";
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CareRequestCard({
  request,
  onUpdate,
}: {
  request: CareRequest;
  onUpdate?: (id: string, updates: any) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    if (onUpdate) {
      onUpdate(request.id, { status: newStatus });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 shadow-lg hover:scale-[1.02] transform"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-3xl p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">{getTypeIcon(request.requestType)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-3">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {request.title}
              </h4>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border-2 ${getPriorityColor(request.priority)} shadow-sm`}
              >
                {request.priority}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                {request.requestType.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
              <div className="flex flex-wrap gap-2">
                {request.requester && (
                  <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                    <UserIcon className="h-4 w-4 mr-2 text-indigo-500" />
                    {request.requester.firstName} {request.requester.lastName}
                  </span>
                )}
                <span className="flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                  <CalendarDaysIcon className="h-4 w-4 mr-2 text-indigo-500" />
                  Requested: {formatDate(request.requestDate)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.assignedPastor && (
                  <span className="flex items-center bg-indigo-50 px-3 py-1 rounded-lg text-indigo-700">
                    Pastor: {request.assignedPastor.firstName}{" "}
                    {request.assignedPastor.lastName}
                  </span>
                )}
                {request.assignedDate && (
                  <span className="flex items-center bg-green-50 px-3 py-1 rounded-lg text-green-700">
                    Assigned: {formatDate(request.assignedDate)}
                  </span>
                )}
                {request.responseDate && (
                  <span className="flex items-center bg-purple-50 px-3 py-1 rounded-lg text-purple-700">
                    Responded: {formatDate(request.responseDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Urgent Notes - Always visible if present */}
            {request.urgentNotes && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-1">
                  <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-sm font-semibold text-red-800">Urgent Notes</span>
                </div>
                <p className="text-sm text-red-700">{request.urgentNotes}</p>
              </div>
            )}

            {/* Contact Information - Always visible if present */}
            {(request.contactInfo || request.preferredContactMethod) && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-1">
                  <UserIcon className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-semibold text-blue-800">Contact Information</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  {request.contactInfo && <p>Contact: {request.contactInfo}</p>}
                  {request.preferredContactMethod && (
                    <p>Preferred Method: {request.preferredContactMethod}</p>
                  )}
                </div>
              </div>
            )}

            {/* Expanded Details */}
            {isExpanded && (
              <div className="space-y-3 animate-fade-in">
                {request.description && (
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border border-gray-100">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Description</h5>
                    <p className="text-sm text-gray-700">{request.description}</p>
                  </div>
                )}

                {request.responseNotes && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <h5 className="text-sm font-semibold text-green-800 mb-2">Response Notes</h5>
                    <p className="text-sm text-green-700">{request.responseNotes}</p>
                  </div>
                )}

                {request.actionsTaken && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                    <h5 className="text-sm font-semibold text-purple-800 mb-2">Actions Taken</h5>
                    <p className="text-sm text-purple-700">{request.actionsTaken}</p>
                  </div>
                )}

                {request.resolutionNotes && (
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                    <h5 className="text-sm font-semibold text-amber-800 mb-2">Resolution Notes</h5>
                    <p className="text-sm text-amber-700">{request.resolutionNotes}</p>
                  </div>
                )}

                {/* Additional metadata when expanded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="space-y-2 text-xs text-gray-600">
                    <p><span className="font-medium">Created:</span> {formatDate(request.createdAt)}</p>
                    <p><span className="font-medium">Updated:</span> {formatDate(request.updatedAt)}</p>
                    {request.creator && (
                      <p><span className="font-medium">Created by:</span> {request.creator.firstName} {request.creator.lastName}</p>
                    )}
                  </div>
                  <div className="space-y-2 text-xs text-gray-600">
                    <p><span className="font-medium">Request ID:</span> {request.id.slice(0, 8)}...</p>
                    <p><span className="font-medium">Member:</span> {request.requester ? `${request.requester.firstName} ${request.requester.lastName}` : 'Unknown Member'}</p>
                    {request.requester?.memberId && (
                      <p><span className="font-medium">Member ID:</span> {request.requester.memberId}</p>
                    )}
                    {request.assistantId && (
                      <p><span className="font-medium">Assistant ID:</span> {request.assistantId.slice(0, 8)}...</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {request.completionDate && (
              <p className="text-xs text-gray-500">
                Completed: {formatDate(request.completionDate)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 ml-4">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold shadow-sm ${getStatusColor(request.status)}`}
          >
            {request.status.replace("_", " ")}
          </span>

          {request.status !== "COMPLETED" && request.status !== "CANCELLED" && (
            <div className="flex space-x-2">
              {request.status === "SUBMITTED" && (
                <button
                  onClick={() => handleStatusChange("ASSIGNED")}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                  title="Assign"
                >
                  <ClockIcon className="h-5 w-5" />
                </button>
              )}
              {(request.status === "ASSIGNED" ||
                request.status === "IN_PROGRESS") && (
                <button
                  onClick={() => handleStatusChange("COMPLETED")}
                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                  title="Mark Complete"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => handleStatusChange("CANCELLED")}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 transform"
                title="Cancel"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {request.description && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-4 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-all duration-200 hover:scale-105 active:scale-95 transform"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function CareRequestSkeleton() {
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

export default function CareRequestsList({
  requests,
  loading,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onCreateRequest,
  onUpdateRequest,
  onPageChange,
  onPageSizeChange,
}: CareRequestsListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");

  // Since we're using server-side pagination, we don't need client-side filtering/sorting
  // The filtering and sorting should be handled by the parent component via GraphQL variables
  const displayRequests = requests || [];

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  const handlePageChange = (newPage: number) => {
    if (onPageChange && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
      // Reset to first page when changing page size
      if (onPageChange) {
        onPageChange(1);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Care Requests
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <CareRequestSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Care Requests</h3>
          <p className="text-gray-600">Manage and track pastoral care requests from members</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="text-sm bg-transparent border-none focus:ring-0 focus:outline-none text-gray-700 font-medium"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {onCreateRequest && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCreateRequest}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Request
            </motion.button>
          )}
        </div>
      </div>

      {displayRequests.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No care requests found</h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Care requests will appear here when members submit them
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {displayRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <CareRequestCard
                  request={request}
                  onUpdate={onUpdateRequest}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-between"
        >
          {/* Pagination Info */}
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <span className="text-sm font-medium text-gray-700">
                Showing {startItem} to {endItem} of {totalCount} requests
              </span>
            </div>
          </div>

          {/* Pagination Buttons */}
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage <= 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage >= totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                }`}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
