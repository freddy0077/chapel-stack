"use client";
import React, { useState, useEffect } from "react";
import { ChatBubbleLeftEllipsisIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import NewPrayerRequestModal from "./NewPrayerRequestModal";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { usePrayerRequests } from "@/graphql/hooks/usePrayerRequests";
import { format } from "date-fns";
import { useOrganizationBranchFilter } from "@/hooks";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface PrayerRequest {
  id: string;
  requestText: string;
  status: 'NEW' | 'IN_PROGRESS' | 'ANSWERED';
  createdAt: string;
  member: Member;
}

// Status configuration for consistent styling
const statusConfig = {
  NEW: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <ClockIcon className="h-5 w-5 text-blue-500 mr-1" />,
    text: "New"
  },
  IN_PROGRESS: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: <ClockIcon className="h-5 w-5 text-yellow-500 mr-1" />,
    text: "In Progress"
  },
  ANSWERED: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />,
    text: "Answered"
  }
};

export default function PrayerRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Get organization and branch filters
  const { organisationId, branchId } = useOrganizationBranchFilter();
  
  // Fetch prayer requests
  const { prayerRequests: allRequests, loading, error, refetch } = usePrayerRequests(organisationId, branchId);
  
  // Filter prayer requests based on search term and status
  const filteredRequests = allRequests.filter((prayer: PrayerRequest) => {
    const matchesSearch = searchTerm === "" || 
      prayer.requestText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${prayer.member?.firstName} ${prayer.member?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === null || prayer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get counts for each status
  const statusCounts = {
    all: allRequests.length,
    new: allRequests.filter((p: PrayerRequest) => p.status === 'NEW').length,
    inProgress: allRequests.filter((p: PrayerRequest) => p.status === 'IN_PROGRESS').length,
    answered: allRequests.filter((p: PrayerRequest) => p.status === 'ANSWERED').length
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Prayer Requests"
        subtitle="View and manage all prayer requests from your community."
        icon={<ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-white" />}
        action={
          <button
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-indigo-700 font-semibold px-6 py-2 rounded-lg shadow transition text-base border border-indigo-200"
            onClick={() => setModalOpen(true)}
          >
            + Add Prayer Request
          </button>
        }
      />
      
      <NewPrayerRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refetch()}
      />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Filters and Search */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Status Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-full md:w-auto">
              <button
                onClick={() => setStatusFilter(null)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  statusFilter === null 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All ({statusCounts.all})
              </button>
              <button
                onClick={() => setStatusFilter("NEW")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  statusFilter === "NEW" 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                New ({statusCounts.new})
              </button>
              <button
                onClick={() => setStatusFilter("IN_PROGRESS")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  statusFilter === "IN_PROGRESS" 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                In Progress ({statusCounts.inProgress})
              </button>
              <button
                onClick={() => setStatusFilter("ANSWERED")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  statusFilter === "ANSWERED" 
                    ? "bg-white shadow text-indigo-700" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Answered ({statusCounts.answered})
              </button>
            </div>
            
            {/* Search and View Toggle */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Search requests or members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* View Toggle */}
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-indigo-50 text-indigo-600" : "bg-white text-gray-500"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-indigo-50 text-indigo-600" : "bg-white text-gray-500"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-500">Loading prayer requests...</p>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="flex justify-center items-center p-6 bg-red-50 text-red-700 rounded-xl shadow-sm border border-red-100">
            <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
            <p>Error loading prayer requests: {error.message}</p>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredRequests.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
            <ChatBubbleLeftEllipsisIcon className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No prayer requests found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter ? "Try adjusting your filters" : "Start by adding a new prayer request"}
            </p>
            <button
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition text-base"
              onClick={() => setModalOpen(true)}
            >
              + Add Prayer Request
            </button>
          </div>
        )}
        
        {/* Prayer Requests - Grid View */}
        {!loading && !error && filteredRequests.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((prayer: PrayerRequest) => (
              <div
                key={prayer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-indigo-700 text-lg">
                        {prayer.member?.firstName || "-"} {prayer.member?.lastName || ""}
                      </h3>
                      <span className="text-xs text-gray-500">{formatDate(prayer.createdAt)}</span>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${statusConfig[prayer.status].color}`}>
                      {statusConfig[prayer.status].icon}
                      {statusConfig[prayer.status].text}
                    </span>
                  </div>
                  <p className="text-gray-700 text-base line-clamp-4 mb-4">
                    {prayer.requestText}
                  </p>
                </div>
                <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50 flex justify-end">
                  <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Prayer Requests - List View */}
        {!loading && !error && filteredRequests.length > 0 && viewMode === "list" && (
          <div className="space-y-4">
            {filteredRequests.map((prayer: PrayerRequest) => (
              <div
                key={prayer.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-indigo-700 text-lg truncate">
                        {prayer.member?.firstName || "-"} {prayer.member?.lastName || ""}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold ${statusConfig[prayer.status].color}`}>
                        {statusConfig[prayer.status].icon}
                        {statusConfig[prayer.status].text}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(prayer.createdAt)}</span>
                    </div>
                    <div className="text-gray-700 text-base whitespace-pre-line break-words">
                      {prayer.requestText}
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
