import React, { useState, useCallback } from "react";
import {
  TrashIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import {
  SACRAMENT_TYPES,
  type SacramentType,
} from "@/constants/sacramentTypes";
import { formatSacramentType } from "@/utils/sacramentHelpers";

interface BulkOperationsProps {
  selectedRecords: string[];
  sacramentType: SacramentType;
  onClearSelection: () => void;
  onBulkDelete: (recordIds: string[]) => Promise<void>;
  onBulkExport: (
    recordIds: string[],
    format: "csv" | "pdf" | "excel",
  ) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Bulk operations component for sacrament records
 */
export const BulkOperations: React.FC<BulkOperationsProps> = ({
  selectedRecords,
  sacramentType,
  onClearSelection,
  onBulkDelete,
  onBulkExport,
  isLoading = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleBulkDelete = useCallback(async () => {
    if (selectedRecords.length === 0) return;

    setIsDeleting(true);
    try {
      await onBulkDelete(selectedRecords);
      toast.success(
        `${selectedRecords.length} ${formatSacramentType(sacramentType)} record(s) deleted successfully`,
      );
      onClearSelection();
      setShowDeleteConfirm(false);
    } catch (error: any) {
      console.error("Bulk delete error:", error);
      toast.error(error.message || "Failed to delete selected records");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedRecords, sacramentType, onBulkDelete, onClearSelection]);

  const handleBulkExport = useCallback(
    async (format: "csv" | "pdf" | "excel") => {
      if (selectedRecords.length === 0) return;

      setIsExporting(true);
      try {
        await onBulkExport(selectedRecords, format);
        toast.success(
          `${selectedRecords.length} record(s) exported as ${format.toUpperCase()}`,
        );
        setShowExportOptions(false);
      } catch (error: any) {
        console.error("Bulk export error:", error);
        toast.error(error.message || "Failed to export selected records");
      } finally {
        setIsExporting(false);
      }
    },
    [selectedRecords, onBulkExport],
  );

  if (selectedRecords.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Operations Bar */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
              <CheckIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-indigo-900">
                {selectedRecords.length} record
                {selectedRecords.length !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-indigo-600">
                {formatSacramentType(sacramentType)} records
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={isLoading || isExporting}
                className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export"}
              </button>

              {/* Export Options Dropdown */}
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleBulkExport("csv")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleBulkExport("excel")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as Excel
                    </button>
                    <button
                      onClick={() => handleBulkExport("pdf")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Export as PDF
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isLoading || isDeleting}
              className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>

            {/* Clear Selection Button */}
            <button
              onClick={onClearSelection}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Selected Records
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete {selectedRecords.length}{" "}
                {formatSacramentType(sacramentType)} record
                {selectedRecords.length !== 1 ? "s" : ""}? This action cannot be
                undone.
              </p>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    "Delete Records"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {showExportOptions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setShowExportOptions(false);
          }}
        />
      )}
    </>
  );
};

export default BulkOperations;
