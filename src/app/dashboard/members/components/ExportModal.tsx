"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { MemberFilters } from "../types/member.types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportOptions) => Promise<void>;
  filters: MemberFilters;
  selectedCount?: number;
  totalFilteredCount: number;
  loading?: boolean;
}

export interface ExportOptions {
  format: "CSV" | "EXCEL" | "PDF";
  scope: "selected" | "filtered" | "all";
  fields: string[];
  includeHeaders: boolean;
  includeImages: boolean;
}

interface ExportField {
  key: string;
  label: string;
  category: string;
  description?: string;
}

const exportFields: ExportField[] = [
  // Basic Information
  {
    key: "firstName",
    label: "First Name",
    category: "Basic",
    description: "Member first name",
  },
  {
    key: "middleName",
    label: "Middle Name",
    category: "Basic",
    description: "Member middle name",
  },
  {
    key: "lastName",
    label: "Last Name",
    category: "Basic",
    description: "Member last name",
  },
  {
    key: "preferredName",
    label: "Preferred Name",
    category: "Basic",
    description: "Preferred name or nickname",
  },
  {
    key: "title",
    label: "Title",
    category: "Basic",
    description: "Title (Mr, Mrs, Dr, etc.)",
  },
  {
    key: "memberId",
    label: "Member ID",
    category: "Basic",
    description: "Unique member identifier",
  },

  // Contact Information
  {
    key: "email",
    label: "Email",
    category: "Contact",
    description: "Primary email address",
  },
  {
    key: "phoneNumber",
    label: "Phone Number",
    category: "Contact",
    description: "Primary phone number",
  },
  {
    key: "alternativeEmail",
    label: "Alternative Email",
    category: "Contact",
    description: "Secondary email address",
  },
  {
    key: "alternativePhone",
    label: "Alternative Phone",
    category: "Contact",
    description: "Secondary phone number",
  },

  // Address Information
  {
    key: "address",
    label: "Address",
    category: "Address",
    description: "Street address",
  },
  { key: "city", label: "City", category: "Address", description: "City" },
  {
    key: "state",
    label: "State/Region",
    category: "Address",
    description: "State or region",
  },
  {
    key: "postalCode",
    label: "Postal Code",
    category: "Address",
    description: "ZIP or postal code",
  },
  {
    key: "country",
    label: "Country",
    category: "Address",
    description: "Country",
  },
  {
    key: "digitalAddress",
    label: "Digital Address",
    category: "Address",
    description: "Ghana Post GPS address",
  },

  // Personal Information
  {
    key: "dateOfBirth",
    label: "Date of Birth",
    category: "Personal",
    description: "Birth date",
  },
  {
    key: "gender",
    label: "Gender",
    category: "Personal",
    description: "Gender",
  },
  {
    key: "maritalStatus",
    label: "Marital Status",
    category: "Personal",
    description: "Marital status",
  },
  {
    key: "nationality",
    label: "Nationality",
    category: "Personal",
    description: "Nationality",
  },
  {
    key: "occupation",
    label: "Occupation",
    category: "Personal",
    description: "Job or profession",
  },
  {
    key: "education",
    label: "Education",
    category: "Personal",
    description: "Education level",
  },

  // Church Information
  {
    key: "membershipStatus",
    label: "Membership Status",
    category: "Church",
    description: "Current membership status",
  },
  {
    key: "membershipType",
    label: "Membership Type",
    category: "Church",
    description: "Type of membership",
  },
  {
    key: "membershipDate",
    label: "Membership Date",
    category: "Church",
    description: "Date became member",
  },
  {
    key: "joinDate",
    label: "Join Date",
    category: "Church",
    description: "Date first joined church",
  },
  {
    key: "baptismDate",
    label: "Baptism Date",
    category: "Church",
    description: "Date of baptism",
  },
  {
    key: "confirmationDate",
    label: "Confirmation Date",
    category: "Church",
    description: "Date of confirmation",
  },
  {
    key: "lastAttendanceDate",
    label: "Last Attendance",
    category: "Church",
    description: "Last attendance date",
  },

  // Family Information
  {
    key: "fatherName",
    label: "Father Name",
    category: "Family",
    description: "Father's name",
  },
  {
    key: "motherName",
    label: "Mother Name",
    category: "Family",
    description: "Mother's name",
  },
  {
    key: "emergencyContactName",
    label: "Emergency Contact",
    category: "Family",
    description: "Emergency contact name",
  },
  {
    key: "emergencyContactPhone",
    label: "Emergency Phone",
    category: "Family",
    description: "Emergency contact phone",
  },

  // Additional Information
  {
    key: "specialGifts",
    label: "Special Gifts",
    category: "Additional",
    description: "Special talents or gifts",
  },
  {
    key: "notes",
    label: "Notes",
    category: "Additional",
    description: "Additional notes",
  },
  {
    key: "createdAt",
    label: "Created Date",
    category: "System",
    description: "Record creation date",
  },
  {
    key: "updatedAt",
    label: "Updated Date",
    category: "System",
    description: "Last update date",
  },
];

const formatOptions = [
  {
    value: "CSV",
    label: "CSV",
    description:
      "Comma-separated values - Compatible with Excel, Google Sheets",
    icon: "📊",
  },
  {
    value: "EXCEL",
    label: "Excel",
    description: "Microsoft Excel format with formatting and multiple sheets",
    icon: "📈",
  },
  {
    value: "PDF",
    label: "PDF",
    description: "Portable document format - Good for printing and sharing",
    icon: "📄",
  },
];

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  filters,
  selectedCount = 0,
  totalFilteredCount,
  loading = false,
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "CSV",
    scope: selectedCount > 0 ? "selected" : "filtered",
    fields: [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "membershipStatus",
      "membershipDate",
    ],
    includeHeaders: true,
    includeImages: false,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Basic");

  const categories = Array.from(
    new Set(exportFields.map((field) => field.category)),
  );
  const fieldsInCategory = exportFields.filter(
    (field) => field.category === selectedCategory,
  );

  const handleFieldToggle = (fieldKey: string) => {
    setExportOptions((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldKey)
        ? prev.fields.filter((key) => key !== fieldKey)
        : [...prev.fields, fieldKey],
    }));
  };

  const handleSelectAllInCategory = () => {
    const categoryFields = fieldsInCategory.map((field) => field.key);
    const allSelected = categoryFields.every((key) =>
      exportOptions.fields.includes(key),
    );

    setExportOptions((prev) => ({
      ...prev,
      fields: allSelected
        ? prev.fields.filter((key) => !categoryFields.includes(key))
        : [...new Set([...prev.fields, ...categoryFields])],
    }));
  };

  const handleExport = async () => {
    try {
      await onExport(exportOptions);
      // Only close the modal if export was successful
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      // Don't close the modal on error so user can try again
      // The error will be handled by the parent component and shown via toast
    }
  };

  const getScopeDescription = () => {
    switch (exportOptions.scope) {
      case "selected":
        return `Export ${selectedCount} selected member${selectedCount !== 1 ? "s" : ""}`;
      case "filtered":
        return `Export ${totalFilteredCount} member${totalFilteredCount !== 1 ? "s" : ""} matching current filters`;
      case "all":
        return "Export all members in the database";
      default:
        return "";
    }
  };

  const hasActiveFilters = Object.keys(filters).some((key) => {
    const value = filters[key as keyof MemberFilters];
    return (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true)
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <DocumentArrowDownIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Export Members
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Choose export format and fields
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Left Panel - Options */}
            <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
              {/* Export Scope */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Export Scope
                </h3>
                <div className="space-y-3">
                  {selectedCount > 0 && (
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="scope"
                        value="selected"
                        checked={exportOptions.scope === "selected"}
                        onChange={(e) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            scope: e.target.value as any,
                          }))
                        }
                        className="mt-1 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          Selected Members
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedCount} member{selectedCount !== 1 ? "s" : ""}{" "}
                          selected
                        </div>
                      </div>
                    </label>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="filtered"
                      checked={exportOptions.scope === "filtered"}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          scope: e.target.value as any,
                        }))
                      }
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        Filtered Results
                      </div>
                      <div className="text-sm text-gray-600">
                        {totalFilteredCount} member
                        {totalFilteredCount !== 1 ? "s" : ""} matching filters
                        {hasActiveFilters && (
                          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            Filtered
                          </span>
                        )}
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="scope"
                      value="all"
                      checked={exportOptions.scope === "all"}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          scope: e.target.value as any,
                        }))
                      }
                      className="mt-1 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        All Members
                      </div>
                      <div className="text-sm text-gray-600">
                        Export entire member database
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Export Format
                </h3>
                <div className="space-y-2">
                  {formatOptions.map((format) => (
                    <label
                      key={format.value}
                      className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={exportOptions.format === format.value}
                        onChange={(e) =>
                          setExportOptions((prev) => ({
                            ...prev,
                            format: e.target.value as any,
                          }))
                        }
                        className="mt-1 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{format.icon}</span>
                          <span className="font-medium text-gray-900">
                            {format.label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {format.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Options
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeHeaders}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeHeaders: e.target.checked,
                        }))
                      }
                      className="text-blue-600 rounded"
                    />
                    <span className="text-gray-900">
                      Include column headers
                    </span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeImages}
                      onChange={(e) =>
                        setExportOptions((prev) => ({
                          ...prev,
                          includeImages: e.target.checked,
                        }))
                      }
                      className="text-blue-600 rounded"
                      disabled={exportOptions.format === "CSV"}
                    />
                    <span
                      className={`${exportOptions.format === "CSV" ? "text-gray-400" : "text-gray-900"}`}
                    >
                      Include profile images
                      {exportOptions.format === "CSV" && (
                        <span className="text-xs text-gray-400 block">
                          Not available for CSV
                        </span>
                      )}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Panel - Field Selection */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Fields to Export
                </h3>
                <span className="text-sm text-gray-600">
                  {exportOptions.fields.length} field
                  {exportOptions.fields.length !== 1 ? "s" : ""} selected
                </span>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Select All Button */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleSelectAllInCategory}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {fieldsInCategory.every((field) =>
                    exportOptions.fields.includes(field.key),
                  )
                    ? `Deselect All ${selectedCategory}`
                    : `Select All ${selectedCategory}`}
                </button>
              </div>

              {/* Fields List */}
              <div className="space-y-2">
                {fieldsInCategory.map((field) => (
                  <label
                    key={field.key}
                    className="flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={exportOptions.fields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                      className="mt-1 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {field.label}
                      </div>
                      {field.description && (
                        <div className="text-sm text-gray-600">
                          {field.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <InformationCircleIcon className="w-4 h-4" />
              <span>{getScopeDescription()}</span>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={loading || exportOptions.fields.length === 0}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="w-4 h-4" />
                    <span>Export {exportOptions.format}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportModal;
