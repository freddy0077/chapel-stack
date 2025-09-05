"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  DocumentTextIcon,
  FunnelIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import DashboardHeader from "@/components/DashboardHeader";
import { useFilteredMarriageRecords } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";
import { format } from "date-fns";
import CreateMarriageModal from "../components/CreateMarriageModal";

export default function MarriageRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error, refetch } =
    useFilteredMarriageRecords(orgBranchFilter);

  // Filter records based on search and filters
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      !searchTerm ||
      record.groomName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.officiant?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate =
      !dateFilter || record.marriageDate?.includes(dateFilter);

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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <DashboardHeader
          title="Marriage Records"
          subtitle="Sacred union of two hearts in love"
          icon={HeartIcon}
          action={{
            label: "New Marriage",
            onClick: () => setIsCreateModalOpen(true),
            icon: PlusIcon,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <HeartIconSolid className="h-8 w-8 text-rose-500 animate-spin" />
              <p className="text-gray-600">Loading marriage records...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
        <DashboardHeader
          title="Marriage Records"
          subtitle="Sacred union of two hearts in love"
          icon={HeartIcon}
          action={{
            label: "New Marriage",
            onClick: () => setIsCreateModalOpen(true),
            icon: PlusIcon,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <HeartIcon className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error Loading Records
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Unable to load marriage records. Please try again later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <DashboardHeader
        title="Marriage Records"
        subtitle="Sacred union of two hearts in love"
        icon={HeartIcon}
        action={{
          label: "New Marriage",
          onClick: () => setIsCreateModalOpen(true),
          icon: PlusIcon,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-rose-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIconSolid className="h-8 w-8 text-rose-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Marriages
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {records.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-rose-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-rose-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    records.filter((r) =>
                      r.marriageDate?.includes(
                        new Date().getFullYear().toString(),
                      ),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-rose-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-rose-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {
                    records.filter((r) => {
                      const recordDate = new Date(r.marriageDate || "");
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

          <div className="bg-white rounded-lg shadow-sm border border-rose-100 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DocumentTextIcon className="h-8 w-8 text-rose-200" />
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
                Search Couples
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by bride, groom, or officiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        {/* Records Grid */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Marriage Records Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || dateFilter || locationFilter
                ? "No records match your current filters."
                : "Get started by creating your first marriage record."}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create First Marriage Record
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
                <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <HeartIconSolid className="h-6 w-6 text-white" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {record.groomName} & {record.brideName}
                        </h3>
                        <p className="text-rose-100 text-sm">Marriage</p>
                      </div>
                    </div>
                    {record.marriageDate && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-white text-xs font-medium">
                          {format(new Date(record.marriageDate), "MMM yyyy")}
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
                      {record.marriageDate
                        ? format(new Date(record.marriageDate), "MMMM d, yyyy")
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

                  {record.witnesses && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Witnesses:</span>{" "}
                      {record.witnesses}
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

                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateMarriageModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
