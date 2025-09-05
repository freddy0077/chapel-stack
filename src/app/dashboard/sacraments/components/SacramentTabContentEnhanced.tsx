"use client";

import { useState, useMemo, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SparklesIcon,
  GiftIcon,
  HeartIcon,
  UserGroupIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

// Import existing record components
import { BaptismRecordsLoader } from "../BaptismRecordsLoader";
import type { BaptismRecord } from "@/graphql/hooks/useBaptismRecords";
import { CommunionRecordsLoader } from "../CommunionRecordsLoader";
import type { CommunionRecord } from "@/graphql/hooks/useCommunionRecords";
import { ConfirmationRecordsLoader } from "../ConfirmationRecordsLoader";
import type { ConfirmationRecord } from "@/graphql/hooks/useConfirmationRecords";
import { MarriageRecordsLoader } from "../MarriageRecordsLoader";
import type { MarriageRecord } from "@/graphql/hooks/useMarriageRecords";
import { UpcomingAnniversariesLoader } from "../UpcomingAnniversariesLoader";

// Import new components
import SacramentSearchFilters from "./SacramentSearchFilters";
import SacramentPagination from "./SacramentPagination";

// Import enhanced components and hooks
import BulkOperations from "@/components/sacraments/BulkOperations";
import { SacramentRecordSkeleton } from "@/components/ui/SkeletonLoader";
import { SacramentErrorBoundary } from "@/components/ErrorBoundary";
import {
  SACRAMENT_TYPES,
  type SacramentType,
} from "@/constants/sacramentTypes";
import { formatSacramentType } from "@/utils/sacramentHelpers";
import type { useSacramentLoading } from "@/hooks/useSacramentLoading";

// Define SearchFilters interface locally
interface SearchFilters {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  officiant: string;
  location: string;
  sacramentType: string;
}

// Selection state interface for bulk operations
interface SelectionState {
  selectedRecords: string[];
  isSelectAll: boolean;
}

// Enhanced record display component with pagination and search
const EnhancedRecordDisplay = ({
  records,
  loading,
  error,
  icon: Icon,
  title,
  description,
  color,
  sacramentType,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onGenerateCertificate,
  onViewMarriageAnalytics,
  onViewMemberMarriageHistory,
}: {
  records: any[];
  loading: boolean;
  error: unknown;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
  sacramentType: string;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  onDeleteRecord?: (recordId: string) => void;
  onGenerateCertificate?: (record: any) => void;
  onViewMarriageAnalytics?: () => void;
  onViewMemberMarriageHistory?: (memberId: string) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    officiant: "",
    location: "",
    sacramentType: "",
  });

  // Filter records based on search criteria
  const filteredRecords = useMemo<any[]>(() => {
    if (!records || !Array.isArray(records)) {
      return [];
    }

    return records.filter((record: any) => {
      const matchesSearch =
        !searchFilters.searchTerm ||
        record.memberId
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.officiantName
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.locationOfSacrament
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.groomName
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.brideName
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.godparent1Name
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.godparent2Name
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        record.sponsorName
          ?.toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase());

      const matchesDateRange =
        !searchFilters.dateFrom ||
        !searchFilters.dateTo ||
        (new Date(record.dateOfSacrament) >= new Date(searchFilters.dateFrom) &&
          new Date(record.dateOfSacrament) <= new Date(searchFilters.dateTo));

      const matchesOfficiant =
        !searchFilters.officiant ||
        record.officiantName
          ?.toLowerCase()
          .includes(searchFilters.officiant.toLowerCase());

      return matchesSearch && matchesDateRange && matchesOfficiant;
    });
  }, [records, searchFilters]);

  // Paginate filtered records
  const paginatedRecords = useMemo<any[]>(() => {
    if (
      !filteredRecords ||
      !Array.isArray(filteredRecords) ||
      filteredRecords.length === 0
    ) {
      return [];
    }

    try {
      const startIndex = (currentPage - 1) * recordsPerPage;
      const endIndex = startIndex + recordsPerPage;
      return filteredRecords.slice(startIndex, endIndex);
    } catch (error) {
      console.error("Error paginating records:", error);
      return filteredRecords; // Return all filtered records if pagination fails
    }
  }, [filteredRecords, currentPage, recordsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil((filteredRecords?.length || 0) / recordsPerPage),
  );

  // Handler functions for search filters
  const handleFiltersChange = (filters: Partial<SearchFilters>) => {
    setSearchFilters((prev) => ({ ...prev, ...filters }));
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically through useMemo
    console.log("Filters applied:", searchFilters);
  };

  const handleClearFilters = () => {
    setSearchFilters({
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      officiant: "",
      location: "",
      sacramentType: "",
    });
  };

  // Early return for loading state
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} px-6 py-4 border-b border-gray-100`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white bg-opacity-20">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-white text-opacity-90">
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2 text-gray-600">Loading records...</span>
          </div>
        </div>
      </div>
    );
  }

  // Early return for error state
  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div
          className={`bg-gradient-to-r ${color} px-6 py-4 border-b border-gray-100`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white bg-opacity-20">
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-sm text-white text-opacity-90">
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">
              Error loading records:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div
        className={`bg-gradient-to-r ${color} px-6 py-4 border-b border-gray-100`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>

          {/* Marriage Analytics Buttons - Only show for marriage records */}
          {sacramentType === "MATRIMONY" && (
            <div className="flex items-center gap-2">
              {onViewMarriageAnalytics && (
                <button
                  onClick={onViewMarriageAnalytics}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Marriage Analytics
                </button>
              )}
            </div>
          )}

          <SacramentSearchFilters
            filters={searchFilters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
            loading={loading}
            sacramentTypes={[sacramentType]}
          />
        </div>
      </div>

      {/* Records Content */}
      <div className="p-6">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <Icon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchFilters.searchTerm ||
              Object.values(searchFilters).some((v) => v)
                ? "No records match your search criteria"
                : `No ${title.toLowerCase()}`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchFilters.searchTerm ||
              Object.values(searchFilters).some((v) => v)
                ? "Try adjusting your search filters."
                : `Get started by creating a new ${title.toLowerCase().slice(0, -8)} record.`}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 ${
                        color.includes("blue")
                          ? "bg-blue-100"
                          : color.includes("amber")
                            ? "bg-amber-100"
                            : color.includes("purple")
                              ? "bg-purple-100"
                              : "bg-rose-100"
                      } rounded-full flex items-center justify-center`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          color.includes("blue")
                            ? "text-blue-600"
                            : color.includes("amber")
                              ? "text-amber-600"
                              : color.includes("purple")
                                ? "text-purple-600"
                                : "text-rose-600"
                        }`}
                      />
                    </div>
                    <div>
                      {/* Display relevant fields based on sacrament type */}
                      {sacramentType === "BAPTISM" && (
                        <>
                          <div className="flex items-center space-x-3">
                            {record.member?.profileImageUrl && (
                              <img
                                src={record.member.profileImageUrl}
                                alt={`${record.member.firstName} ${record.member.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {record.member
                                  ? `${record.member.firstName} ${record.member.middleName ? record.member.middleName + " " : ""}${record.member.lastName}`
                                  : `Member ID: ${record.memberId}`}
                              </p>
                              {record.member?.dateOfBirth && (
                                <p className="text-xs text-gray-400">
                                  Age:{" "}
                                  {new Date().getFullYear() -
                                    new Date(
                                      record.member.dateOfBirth,
                                    ).getFullYear()}{" "}
                                  • {record.member.gender}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            <p className="flex items-center">
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                record.dateOfSacrament,
                              ).toLocaleDateString()}{" "}
                              • {record.locationOfSacrament}
                            </p>
                            <p>
                              <span className="font-medium">Officiant:</span>{" "}
                              {record.officiantName}
                            </p>
                            {(record.godparent1Name ||
                              record.godparent2Name) && (
                              <p>
                                <span className="font-medium">Godparents:</span>{" "}
                                {[record.godparent1Name, record.godparent2Name]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                            {record.member?.email && (
                              <p className="text-xs">
                                <span className="font-medium">Contact:</span>{" "}
                                {record.member.email}
                              </p>
                            )}
                            {record.certificateNumber && (
                              <p className="text-xs">
                                <span className="font-medium">
                                  Certificate:
                                </span>{" "}
                                #{record.certificateNumber}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {sacramentType === "EUCHARIST_FIRST_COMMUNION" && (
                        <>
                          <div className="flex items-center space-x-3">
                            {record.member?.profileImageUrl && (
                              <img
                                src={record.member.profileImageUrl}
                                alt={`${record.member.firstName} ${record.member.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {record.member
                                  ? `${record.member.firstName} ${record.member.middleName ? record.member.middleName + " " : ""}${record.member.lastName}`
                                  : `Member ID: ${record.memberId}`}
                              </p>
                              {record.member?.dateOfBirth && (
                                <p className="text-xs text-gray-400">
                                  Age:{" "}
                                  {new Date().getFullYear() -
                                    new Date(
                                      record.member.dateOfBirth,
                                    ).getFullYear()}{" "}
                                  • {record.member.gender}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                record.dateOfSacrament,
                              ).toLocaleDateString()}{" "}
                              • {record.locationOfSacrament}
                            </p>
                            <p>
                              <span className="font-medium">Officiant:</span>{" "}
                              {record.officiantName}
                            </p>
                            {record.sponsorName && (
                              <p>
                                <span className="font-medium">Sponsor:</span>{" "}
                                {record.sponsorName}
                              </p>
                            )}
                            {record.member?.email && (
                              <p className="text-xs">
                                <span className="font-medium">Contact:</span>{" "}
                                {record.member.email}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {sacramentType === "CONFIRMATION" && (
                        <>
                          <div className="flex items-center space-x-3">
                            {record.member?.profileImageUrl && (
                              <img
                                src={record.member.profileImageUrl}
                                alt={`${record.member.firstName} ${record.member.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {record.member
                                  ? `${record.member.firstName} ${record.member.middleName ? record.member.middleName + " " : ""}${record.member.lastName}`
                                  : `Member ID: ${record.memberId}`}
                              </p>
                              {record.member?.dateOfBirth && (
                                <p className="text-xs text-gray-400">
                                  Age:{" "}
                                  {new Date().getFullYear() -
                                    new Date(
                                      record.member.dateOfBirth,
                                    ).getFullYear()}{" "}
                                  • {record.member.gender}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                record.dateOfSacrament,
                              ).toLocaleDateString()}{" "}
                              • {record.locationOfSacrament}
                            </p>
                            <p>
                              <span className="font-medium">Officiant:</span>{" "}
                              {record.officiantName}
                            </p>
                            {record.sponsorName && (
                              <p>
                                <span className="font-medium">Sponsor:</span>{" "}
                                {record.sponsorName}
                              </p>
                            )}
                            {record.member?.email && (
                              <p className="text-xs">
                                <span className="font-medium">Contact:</span>{" "}
                                {record.member.email}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {sacramentType === "MATRIMONY" && (
                        <>
                          <div className="flex items-center space-x-3">
                            {record.member?.profileImageUrl && (
                              <img
                                src={record.member.profileImageUrl}
                                alt={`${record.member.firstName} ${record.member.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {record.groomName && record.brideName
                                  ? `${record.groomName} & ${record.brideName}`
                                  : record.member
                                    ? `${record.member.firstName} ${record.member.middleName ? record.member.middleName + " " : ""}${record.member.lastName}`
                                    : `Member ID: ${record.memberId}`}
                              </p>
                              {record.member?.dateOfBirth && (
                                <p className="text-xs text-gray-400">
                                  Age:{" "}
                                  {new Date().getFullYear() -
                                    new Date(
                                      record.member.dateOfBirth,
                                    ).getFullYear()}{" "}
                                  • {record.member.gender}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                record.dateOfSacrament,
                              ).toLocaleDateString()}{" "}
                              • {record.locationOfSacrament}
                            </p>
                            <p>
                              <span className="font-medium">Officiant:</span>{" "}
                              {record.officiantName}
                            </p>
                            {(record.witness1Name || record.witness2Name) && (
                              <p>
                                <span className="font-medium">Witnesses:</span>{" "}
                                {[record.witness1Name, record.witness2Name]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                            {record.member?.email && (
                              <p className="text-xs">
                                <span className="font-medium">Contact:</span>{" "}
                                {record.member.email}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      {/* Default display for other sacrament types */}
                      {![
                        "BAPTISM",
                        "EUCHARIST_FIRST_COMMUNION",
                        "CONFIRMATION",
                        "MATRIMONY",
                      ].includes(sacramentType) && (
                        <>
                          <div className="flex items-center space-x-3">
                            {record.member?.profileImageUrl && (
                              <img
                                src={record.member.profileImageUrl}
                                alt={`${record.member.firstName} ${record.member.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {record.member
                                  ? `${record.member.firstName} ${record.member.middleName ? record.member.middleName + " " : ""}${record.member.lastName}`
                                  : `Member ID: ${record.memberId}`}
                              </p>
                              {record.member?.dateOfBirth && (
                                <p className="text-xs text-gray-400">
                                  Age:{" "}
                                  {new Date().getFullYear() -
                                    new Date(
                                      record.member.dateOfBirth,
                                    ).getFullYear()}{" "}
                                  • {record.member.gender}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1 mt-2">
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {new Date(
                                record.dateOfSacrament,
                              ).toLocaleDateString()}{" "}
                              • {record.locationOfSacrament}
                            </p>
                            <p>
                              <span className="font-medium">Officiant:</span>{" "}
                              {record.officiantName}
                            </p>
                            {record.member?.email && (
                              <p className="text-xs">
                                <span className="font-medium">Contact:</span>{" "}
                                {record.member.email}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewRecord?.(record)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditRecord?.(record)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Record"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord?.(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Record"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onGenerateCertificate?.(record)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Generate Certificate"
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                    </button>

                    {/* Marriage-specific actions */}
                    {sacramentType === "MATRIMONY" &&
                      onViewMemberMarriageHistory &&
                      record.memberId && (
                        <button
                          onClick={() =>
                            onViewMemberMarriageHistory(record.memberId)
                          }
                          className="p-2 text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                          title="View Marriage History"
                        >
                          <HeartIcon className="h-4 w-4" />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <SacramentPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={filteredRecords.length}
                  recordsPerPage={recordsPerPage}
                  onPageChange={setCurrentPage}
                  loading={loading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Individual tab content components with enhanced functionality
const BaptismRecords = ({
  refetch,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onGenerateCertificate,
}: {
  refetch?: React.MutableRefObject<(() => void) | null>;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  onDeleteRecord?: (recordId: string) => void;
  onGenerateCertificate?: (record: any) => void;
}) => (
  <BaptismRecordsLoader>
    {(
      records: BaptismRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => {
      // Store refetch function
      if (refetch && loaderRefetch) {
        refetch.current = loaderRefetch;
      }

      return (
        <EnhancedRecordDisplay
          records={records}
          loading={loading}
          error={error}
          icon={SparklesIcon}
          title="Baptism Records"
          description="Sacred water baptisms and initiations"
          color="from-blue-50 to-indigo-50"
          sacramentType="BAPTISM"
          onViewRecord={onViewRecord}
          onEditRecord={onEditRecord}
          onDeleteRecord={onDeleteRecord}
          onGenerateCertificate={onGenerateCertificate}
        />
      );
    }}
  </BaptismRecordsLoader>
);

const CommunionRecords = ({
  refetch,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onGenerateCertificate,
}: {
  refetch?: React.MutableRefObject<(() => void) | null>;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  onDeleteRecord?: (recordId: string) => void;
  onGenerateCertificate?: (record: any) => void;
}) => (
  <CommunionRecordsLoader>
    {(
      records: CommunionRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => {
      // Store refetch function
      if (refetch && loaderRefetch) {
        refetch.current = loaderRefetch;
      }

      return (
        <EnhancedRecordDisplay
          records={records}
          loading={loading}
          error={error}
          icon={GiftIcon}
          title="First Communion Records"
          description="First reception of the Eucharist"
          color="from-amber-50 to-yellow-50"
          sacramentType="EUCHARIST_FIRST_COMMUNION"
          onViewRecord={onViewRecord}
          onEditRecord={onEditRecord}
          onDeleteRecord={onDeleteRecord}
          onGenerateCertificate={onGenerateCertificate}
        />
      );
    }}
  </CommunionRecordsLoader>
);

const ConfirmationRecords = ({
  refetch,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onGenerateCertificate,
}: {
  refetch?: React.MutableRefObject<(() => void) | null>;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  onDeleteRecord?: (recordId: string) => void;
  onGenerateCertificate?: (record: any) => void;
}) => (
  <ConfirmationRecordsLoader>
    {(
      records: ConfirmationRecord[],
      loading: boolean,
      error: unknown,
      loaderRefetch: () => void,
    ) => {
      // Store refetch function
      if (refetch && loaderRefetch) {
        refetch.current = loaderRefetch;
      }

      return (
        <EnhancedRecordDisplay
          records={records}
          loading={loading}
          error={error}
          icon={HeartIcon}
          title="Confirmation Records"
          description="Strengthening of faith through the Spirit"
          color="from-purple-50 to-indigo-50"
          sacramentType="CONFIRMATION"
          onViewRecord={onViewRecord}
          onEditRecord={onEditRecord}
          onDeleteRecord={onDeleteRecord}
          onGenerateCertificate={onGenerateCertificate}
        />
      );
    }}
  </ConfirmationRecordsLoader>
);

const MarriageRecords = ({
  refetch,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onGenerateCertificate,
  onViewMarriageAnalytics,
  onViewMemberMarriageHistory,
}: {
  refetch?: React.MutableRefObject<(() => void) | null>;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  onDeleteRecord?: (recordId: string) => void;
  onGenerateCertificate?: (record: any) => void;
  onViewMarriageAnalytics?: () => void;
  onViewMemberMarriageHistory?: (memberId: string) => void;
}) => (
  <MarriageRecordsLoader>
    {(records, loading, error, marriageRefetch) => {
      // Store refetch function
      if (refetch && marriageRefetch) {
        refetch.current = marriageRefetch;
      }

      return (
        <EnhancedRecordDisplay
          records={records}
          loading={loading}
          error={error}
          icon={UserGroupIcon}
          title="Marriage Records"
          description="Sacred union ceremonies and celebrations"
          color="text-pink-600"
          sacramentType="MATRIMONY"
          onViewRecord={onViewRecord}
          onEditRecord={onEditRecord}
          onDeleteRecord={onDeleteRecord}
          onGenerateCertificate={onGenerateCertificate}
          onViewMarriageAnalytics={onViewMarriageAnalytics}
          onViewMemberMarriageHistory={onViewMemberMarriageHistory}
        />
      );
    }}
  </MarriageRecordsLoader>
);

const AnniversaryTracker = () => (
  <UpcomingAnniversariesLoader>
    {(anniversaries: any[], loading: boolean, error: unknown) => (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upcoming Anniversaries
                </h3>
                <p className="text-sm text-gray-600">
                  Celebrating spiritual milestones
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {anniversaries.length}
              </p>
              <p className="text-xs text-gray-500">This month</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load anniversaries</p>
            </div>
          ) : anniversaries.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No upcoming anniversaries
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for milestone celebrations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {anniversaries.slice(0, 10).map((anniversary, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Anniversary #{index + 1}
                      </p>
                      <p className="text-sm text-gray-500">
                        Details coming soon
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </UpcomingAnniversariesLoader>
);

interface SacramentTabContentEnhancedProps {
  baptismRefetchRef: React.MutableRefObject<(() => void) | null>;
  communionRefetchRef: React.MutableRefObject<(() => void) | null>;
  confirmationRefetchRef: React.MutableRefObject<(() => void) | null>;
  marriageRefetchRef: React.MutableRefObject<(() => void) | null>;
  onViewRecord?: (record: any) => void;
  onEditRecord?: (record: any) => void;
  onDeleteRecord?: (recordId: string) => void;
  onGenerateCertificate?: (record: any) => void;
  onViewMarriageAnalytics?: () => void;
  onViewMemberMarriageHistory?: (memberId: string) => void;
}

export default function SacramentTabContentEnhanced({
  baptismRefetchRef,
  communionRefetchRef,
  confirmationRefetchRef,
  marriageRefetchRef,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onGenerateCertificate,
  onViewMarriageAnalytics,
  onViewMemberMarriageHistory,
}: SacramentTabContentEnhancedProps) {
  return (
    <Tabs defaultValue="baptism" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-1">
        <TabsTrigger
          value="baptism"
          className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-lg transition-all"
        >
          <SparklesIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Baptism</span>
        </TabsTrigger>
        <TabsTrigger
          value="communion"
          className="flex items-center space-x-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 rounded-lg transition-all"
        >
          <GiftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Communion</span>
        </TabsTrigger>
        <TabsTrigger
          value="confirmation"
          className="flex items-center space-x-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 rounded-lg transition-all"
        >
          <HeartIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Confirmation</span>
        </TabsTrigger>
        <TabsTrigger
          value="marriage"
          className="flex items-center space-x-2 data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 rounded-lg transition-all"
        >
          <UserGroupIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Marriage</span>
        </TabsTrigger>
        <TabsTrigger
          value="anniversaries"
          className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 rounded-lg transition-colors"
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Anniversaries</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="baptism" className="mt-0">
          <BaptismRecords
            refetch={baptismRefetchRef}
            onViewRecord={onViewRecord}
            onEditRecord={onEditRecord}
            onDeleteRecord={onDeleteRecord}
            onGenerateCertificate={onGenerateCertificate}
          />
        </TabsContent>

        <TabsContent value="communion" className="mt-0">
          <CommunionRecords
            refetch={communionRefetchRef}
            onViewRecord={onViewRecord}
            onEditRecord={onEditRecord}
            onDeleteRecord={onDeleteRecord}
            onGenerateCertificate={onGenerateCertificate}
          />
        </TabsContent>

        <TabsContent value="confirmation" className="mt-0">
          <ConfirmationRecords
            refetch={confirmationRefetchRef}
            onViewRecord={onViewRecord}
            onEditRecord={onEditRecord}
            onDeleteRecord={onDeleteRecord}
            onGenerateCertificate={onGenerateCertificate}
          />
        </TabsContent>

        <TabsContent value="marriage" className="mt-0">
          <MarriageRecords
            refetch={marriageRefetchRef}
            onViewRecord={onViewRecord}
            onEditRecord={onEditRecord}
            onDeleteRecord={onDeleteRecord}
            onGenerateCertificate={onGenerateCertificate}
            onViewMarriageAnalytics={onViewMarriageAnalytics}
            onViewMemberMarriageHistory={onViewMemberMarriageHistory}
          />
        </TabsContent>

        <TabsContent value="anniversaries" className="mt-0">
          <AnniversaryTracker />
        </TabsContent>
      </div>
    </Tabs>
  );
}
