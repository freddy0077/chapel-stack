"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { LIST_MINISTRIES } from "../../../../graphql/queries/ministryQueries";
import { useOrganizationBranchFilter } from "../../../../hooks/useOrganizationBranchFilter";
import Link from "next/link";
import { usePermissions } from "../../../../hooks/usePermissions";

interface Ministry {
  id: string;
  name: string;
  type: string;
  status: string;
  branchId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  members: { id: string; memberId: string; role: string; status: string }[];
  subMinistries: { id: string; name: string }[];
  parent?: { id: string; name: string };
}

interface BranchMinistriesPanelProps {
  branchId: string;
}

export default function BranchMinistriesPanel({ branchId }: BranchMinistriesPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { canManageMinistries } = usePermissions();
  
  // Get organization/branch filter
  const filter = useOrganizationBranchFilter();

  // Clean filter object to remove any undefined values or string "undefined"
  // Also remove branchId from filter since we want to use the parameter branchId
  const cleanFilter = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== "undefined" && value !== null && key !== 'branchId') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  // Query ministries data
  const { data, loading, error, refetch } = useQuery(LIST_MINISTRIES, {
    variables: {
      filters: {
        branchId, // Use the parameter branchId, not the one from filter
        ...cleanFilter, // Include organization ID but exclude branchId from filter
      },
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      console.error("Error fetching ministries:", error);
    },
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Local filtering since the API doesn't support search parameter
    // The actual filtering happens in the filteredMinistries calculation
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get ministries and filter by search term if provided
  const ministries = data?.ministries || [];
  const filteredMinistries = searchTerm
    ? ministries.filter((ministry: Ministry) =>
        ministry.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : ministries;

  // Group ministries by type for better organization
  const groupedMinistries: Record<string, Ministry[]> = {};
  filteredMinistries.forEach((ministry: Ministry) => {
    if (!ministry.parentId) { // Only show top-level ministries in the main list
      const type = ministry.type || "Other";
      if (!groupedMinistries[type]) {
        groupedMinistries[type] = [];
      }
      groupedMinistries[type].push(ministry);
    }
  });

  // Get ministry types for grouping
  const ministryTypes = Object.keys(groupedMinistries).sort();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Branch Ministries</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage all ministries associated with this branch
          </p>
        </div>
        {canManageMinistries && (
          <Link 
            href={`/dashboard/ministries/new?branchId=${branchId}`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Add Ministry
          </Link>
        )}
      </div>
      
      {/* Search bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search ministries..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Ministries list */}
      <div className="p-4">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Loading ministries...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>Error loading ministries. Please try again.</p>
          </div>
        ) : filteredMinistries.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p>No ministries found{searchTerm ? ` matching "${searchTerm}"` : ""}</p>
            {canManageMinistries && (
              <Link 
                href={`/dashboard/ministries/new?branchId=${branchId}`}
                className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Create Your First Ministry
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {ministryTypes.map((type) => (
              <div key={type} className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {type} Ministries
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedMinistries[type].map((ministry: Ministry) => (
                    <div 
                      key={ministry.id} 
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {ministry.name}
                          </h5>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ministry.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {ministry.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>{ministry.members?.length || 0} members</span>
                          </div>
                          
                          {ministry.subMinistries?.length > 0 && (
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <span>{ministry.subMinistries.length} sub-ministries</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-2">
                          <Link 
                            href={`/dashboard/ministries/${ministry.id}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          {canManageMinistries && (
                            <Link 
                              href={`/dashboard/ministries/${ministry.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
