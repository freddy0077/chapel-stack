"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "@heroicons/react/24/outline";
import {
  PastoralVisit,
  CounselingSession,
  CareRequest,
} from "../../../graphql/hooks/usePastoralCare";

type EntityType = "visit" | "session" | "request";
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
    case "visit":
      return DocumentTextIcon;
    case "session":
      return ChatBubbleLeftRightIcon;
    case "request":
      return HeartIcon;
    default:
      return DocumentTextIcon;
  }
};

const getEntityTitle = (type: EntityType) => {
  switch (type) {
    case "visit":
      return "Pastoral Visit Details";
    case "session":
      return "Counseling Session Details";
    case "request":
      return "Care Request Details";
    default:
      return "Details";
  }
};

const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "RESCHEDULED":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-800";
    case "PENDING":
      return "bg-orange-100 text-orange-800";
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "OPEN":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority?.toUpperCase()) {
    case "LOW":
      return "bg-gray-100 text-gray-800";
    case "MEDIUM":
      return "bg-blue-100 text-blue-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "URGENT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Visit Information
          </h4>
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-xl">
              <span className="text-sm font-semibold text-gray-700 block mb-1">Visit Type:</span>
              <p className="text-sm font-medium text-gray-900">
                {visit.visitType?.replace("_", " ")}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <span className="text-sm font-semibold text-gray-700 block mb-2">Status:</span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold ${getStatusColor(visit.status)} shadow-sm`}
              >
                {visit.status}
              </span>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl">
              <span className="text-sm font-semibold text-gray-700 block mb-2">Scheduled Date:</span>
              <p className="text-sm font-medium text-gray-900 flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-indigo-500" />
                {formatDate(visit.scheduledDate)}
              </p>
            </div>
            {visit.completedDate && (
              <div>
                <span className="text-sm text-gray-500">Completed Date:</span>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(visit.completedDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            People Involved
          </h4>
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
              <p className="text-sm font-medium text-gray-900">
                {visit.pastorId}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created By:</span>
              <p className="text-sm font-medium text-gray-900">
                {visit.createdBy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {visit.description && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Description
          </h4>
          <p className="text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-2xl border border-gray-100 leading-relaxed">
            {visit.description}
          </p>
        </div>
      )}

      {visit.notes && (
        <div className="mt-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
          <p className="text-sm text-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100 leading-relaxed">
            {visit.notes}
          </p>
        </div>
      )}
    </>
  );

  const renderSessionDetails = (session: CounselingSession) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Session Information
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Session Type:</span>
              <p className="text-sm font-medium text-gray-900">
                {session.sessionType?.replace("_", " ")}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
              >
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
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(session.completedDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            People Involved
          </h4>
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
              <p className="text-sm font-medium text-gray-900">
                {session.counselorId}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created By:</span>
              <p className="text-sm font-medium text-gray-900">
                {session.createdBy}
              </p>
            </div>
          </div>
        </div>
      </div>

      {session.description && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Description
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {session.description}
          </p>
        </div>
      )}

      {session.notes && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Session Notes
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {session.notes}
          </p>
        </div>
      )}
    </>
  );

  const renderRequestDetails = (request: CareRequest) => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Request Information
          </h4>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Request Type:</span>
              <p className="text-sm font-medium text-gray-900">
                {request.requestType?.replace("_", " ")}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Priority:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}
              >
                {request.priority}
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
              >
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
                <p className="text-sm font-medium text-gray-900">
                  {formatDateOnly(request.completionDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            People Involved
          </h4>
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
              <p className="text-sm font-medium text-gray-900">
                {request.assignedPastorId || "Not assigned"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Requester:</span>
              <p className="text-sm font-medium text-gray-900">
                {request.requesterId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {request.description && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Description
          </h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {request.description}
          </p>
        </div>
      )}

      {request.notes && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {request.notes}
          </p>
        </div>
      )}
    </>
  );

  const renderEntityDetails = () => {
    switch (entityType) {
      case "visit":
        return renderVisitDetails(entity as PastoralVisit);
      case "session":
        return renderSessionDetails(entity as CounselingSession);
      case "request":
        return renderRequestDetails(entity as CareRequest);
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="inline-block align-bottom bg-white/95 backdrop-blur-xl rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-2xl border border-white/20 transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-8"
          >
          {/* Modern Glassmorphism Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 -mx-8 -mt-5 px-8 py-8 mb-8">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mr-4">
                  <EntityIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {title}
                  </h3>
                  <p className="text-white/90 text-sm mt-1">View and manage details</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.button>
            </div>
          </div>

          {/* Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {entity.title}
            </h2>
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-indigo-50 px-4 py-3 rounded-xl border border-gray-100">
              <ClockIcon className="h-5 w-5 mr-3 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">
                Created {formatDate(entity.createdAt)}
                {entity.updatedAt !== entity.createdAt && (
                  <span className="ml-2 text-indigo-600">
                    • Updated {formatDate(entity.updatedAt)}
                  </span>
                )}
              </span>
            </div>
          </motion.div>

          {/* Entity-specific details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            {renderEntityDetails()}
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center pt-8 border-t border-gray-200"
          >
            <div className="flex space-x-3">
              {/* Status change buttons */}
              {entity.status !== "COMPLETED" &&
                entity.status !== "RESOLVED" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleStatusChange(
                        entityType === "request" ? "RESOLVED" : "COMPLETED",
                      )
                    }
                    className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Mark {entityType === "request" ? "Resolved" : "Complete"}
                  </motion.button>
                )}
            </div>

            <div className="flex space-x-3">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onEdit}
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-indigo-700 bg-indigo-100 border-2 border-indigo-200 rounded-xl hover:bg-indigo-200 hover:border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Edit
                </motion.button>
              )}

              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-red-700 bg-red-100 border-2 border-red-200 rounded-xl hover:bg-red-200 hover:border-red-300 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-200"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-200"
              >
                Close
              </motion.button>
            </div>
          </motion.div>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md"
                >
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-2xl mr-4">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Confirm Delete
                    </h4>
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    Are you sure you want to delete this {entityType}? This action
                    cannot be undone and all associated data will be permanently removed.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/20 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
