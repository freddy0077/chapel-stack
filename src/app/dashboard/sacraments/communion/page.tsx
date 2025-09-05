"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GiftIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  DocumentTextIcon,
  FunnelIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { GiftIcon as GiftIconSolid } from "@heroicons/react/24/solid";
import DashboardHeader from "@/components/DashboardHeader";
import { useFilteredCommunionRecords } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";
import { format } from "date-fns";
import CreateCommunionModal from "../components/CreateCommunionModal";

export default function CommunionRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error, refetch } =
    useFilteredCommunionRecords(orgBranchFilter);

  // Filter records based on search and filters
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      record.member?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.member?.lastName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      record.officiant?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !dateFilter || record.communionDate?.includes(dateFilter);

    const matchesLocation =
      !locationFilter ||
      record.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesDate && matchesLocation;
  });

  const handleCreateSuccess = () => {
    refetch?.();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        <DashboardHeader
          title="First Communion Records"
          subtitle="First reception of the Holy Eucharist"
          icon={GiftIcon}
          action={{
            label: "New Communion",
            onClick: () => setIsCreateModalOpen(true),
            icon: PlusIcon,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <GiftIconSolid className="h-8 w-8 text-amber-500 animate-spin" />
              <p className="text-gray-600">Loading communion records...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
        <DashboardHeader
          title="First Communion Records"
          subtitle="First reception of the Holy Eucharist"
          icon={GiftIcon}
          action={{
            label: "New Communion",
            onClick: () => setIsCreateModalOpen(true),
            icon: PlusIcon,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <GiftIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Records
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Unable to load communion records. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50">
      <DashboardHeader
        title="First Communion Records"
        subtitle="First reception of the Holy Eucharist"
        icon={GiftIcon}
        action={{
          label: "New Communion",
          onClick: () => setIsCreateModalOpen(true),
          icon: PlusIcon,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GiftIconSolid className="h-8 w-8 text-amber-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Communions
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {records.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    records.filter((r) =>
                      r.communionDate?.includes(
                        new Date().getFullYear().toString(),
                      ),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-amber-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    records.filter((r) => {
                      const recordDate = new Date(r.communionDate || "");
                      const now = new Date();
                      return (
                        recordDate.getMonth() === now.getMonth() &&
                        recordDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-amber-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-amber-200" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  With Certificates
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {records.filter((r) => r.certificate).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Members
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or officiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="text"
                placeholder="e.g., 2024"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <GiftIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Communion Records Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || dateFilter || locationFilter
                ? "No records match your current filters."
                : "Get started by creating your first communion record."}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create First Communion Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GiftIconSolid className="h-6 w-6 text-white" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {record.member?.firstName} {record.member?.lastName}
                        </h3>
                        <p className="text-amber-100 text-sm">
                          First Communion
                        </p>
                      </div>
                    </div>
                    {record.communionDate && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-xs font-medium">
                          {format(new Date(record.communionDate), "MMM yyyy")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span>
                      {record.communionDate
                        ? format(new Date(record.communionDate), "MMMM d, yyyy")
                        : "Date not specified"}
                    </span>
                  </div>

                  {record.location && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span>{record.location}</span>
                    </div>
                  )}

                  {record.officiant && (
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span>Officiant: {record.officiant}</span>
                    </div>
                  )}

                  {record.sponsors && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Sponsors:</span>{" "}
                      {record.sponsors}
                    </div>
                  )}

                  {record.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {record.notes}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {record.certificate && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <DocumentTextIcon className="h-3 w-3 mr-1" />
                        Certificate Available
                      </span>
                    )}
                  </div>

                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateCommunionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
