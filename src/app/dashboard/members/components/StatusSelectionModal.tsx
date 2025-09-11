"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { MemberStatus } from "../types/member.types";

interface StatusSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: MemberStatus) => void;
  selectedCount: number;
}

const statusOptions = [
  {
    value: MemberStatus.ACTIVE,
    label: "Active",
    description: "Member is currently active and participating",
    color: "green",
  },
  {
    value: MemberStatus.INACTIVE,
    label: "Inactive",
    description: "Member is temporarily inactive",
    color: "yellow",
  },
  {
    value: MemberStatus.SUSPENDED,
    label: "Suspended",
    description: "Member is suspended from activities",
    color: "orange",
  },
  {
    value: MemberStatus.TRANSFERRED,
    label: "Transferred",
    description: "Member has been transferred to another branch",
    color: "blue",
  },
  {
    value: MemberStatus.DECEASED,
    label: "Deceased",
    description: "Member has passed away",
    color: "gray",
  },
  {
    value: MemberStatus.REMOVED,
    label: "Removed",
    description: "Member has been removed from the organization",
    color: "red",
  },
];

const StatusSelectionModal: React.FC<StatusSelectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<MemberStatus | null>(null);

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(selectedStatus);
      setSelectedStatus(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStatus(null);
    onClose();
  };

  const getStatusColorClasses = (color: string, isSelected: boolean) => {
    const baseClasses = "border-2 transition-all duration-200";
    const colorMap = {
      green: isSelected
        ? "border-green-500 bg-green-50 text-green-700"
        : "border-green-200 hover:border-green-300 hover:bg-green-50",
      yellow: isSelected
        ? "border-yellow-500 bg-yellow-50 text-yellow-700"
        : "border-yellow-200 hover:border-yellow-300 hover:bg-yellow-50",
      orange: isSelected
        ? "border-orange-500 bg-orange-50 text-orange-700"
        : "border-orange-200 hover:border-orange-300 hover:bg-orange-50",
      blue: isSelected
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-blue-200 hover:border-blue-300 hover:bg-blue-50",
      gray: isSelected
        ? "border-gray-500 bg-gray-50 text-gray-700"
        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
      red: isSelected
        ? "border-red-500 bg-red-50 text-red-700"
        : "border-red-200 hover:border-red-300 hover:bg-red-50",
    };
    return `${baseClasses} ${colorMap[color as keyof typeof colorMap] || colorMap.gray}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Update Member Status
                </h3>
                <p className="text-sm text-gray-600">
                  Select a new status for {selectedCount} selected member
                  {selectedCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-3">
              {statusOptions.map((status) => (
                <motion.button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`w-full p-4 rounded-xl text-left ${getStatusColorClasses(
                    status.color,
                    selectedStatus === status.value
                  )}`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-lg">{status.label}</h4>
                        {selectedStatus === status.value && (
                          <CheckCircleIcon className="w-5 h-5 text-current" />
                        )}
                      </div>
                      <p className="text-sm opacity-75 mt-1">
                        {status.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedStatus}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Update Status
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatusSelectionModal;
