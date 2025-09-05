"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_FILTERED_BAPTISM_RECORDS,
  GET_FILTERED_COMMUNION_RECORDS,
  GET_FILTERED_CONFIRMATION_RECORDS,
  GET_FILTERED_MARRIAGE_RECORDS,
} from "@/graphql/queries/sacramentalRecordsQueries";
import { GET_SACRAMENT_STATS } from "@/graphql/queries/sacramentStatsQueries";
import { useOrganizationBranchFilter } from "@/hooks/useOrganizationBranchFilter";
import {
  PlusIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface BranchSacramentsPanelProps {
  branchId: string;
}

interface SacramentalRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  officiantName: string;
  locationOfSacrament?: string;
  certificateUrl?: string;
  witness1Name?: string;
  witness2Name?: string;
  certificateNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const BranchSacramentsPanel: React.FC<BranchSacramentsPanelProps> = ({
  branchId,
}) => {
  const [activeTab, setActiveTab] = useState<
    "baptism" | "communion" | "confirmation" | "marriage"
  >("baptism");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { organisationId } = useOrganizationBranchFilter();

  // Queries for different sacrament types
  const { data: baptismData, loading: baptismLoading } = useQuery(
    GET_FILTERED_BAPTISM_RECORDS,
    {
      variables: { branchId, organisationId },
      errorPolicy: "all",
    },
  );

  const { data: communionData, loading: communionLoading } = useQuery(
    GET_FILTERED_COMMUNION_RECORDS,
    {
      variables: { branchId, organisationId },
      errorPolicy: "all",
    },
  );

  const { data: confirmationData, loading: confirmationLoading } = useQuery(
    GET_FILTERED_CONFIRMATION_RECORDS,
    {
      variables: { branchId, organisationId },
      errorPolicy: "all",
    },
  );

  const { data: marriageData, loading: marriageLoading } = useQuery(
    GET_FILTERED_MARRIAGE_RECORDS,
    {
      variables: { branchId, organisationId },
      errorPolicy: "all",
    },
  );

  // Sacrament statistics
  const { data: statsData, loading: statsLoading } = useQuery(
    GET_SACRAMENT_STATS,
    {
      variables: { branchId, period: "year" },
      errorPolicy: "all",
    },
  );

  const baptismRecords: SacramentalRecord[] =
    baptismData?.sacramentalRecords || [];
  const communionRecords: SacramentalRecord[] =
    communionData?.sacramentalRecords || [];
  const confirmationRecords: SacramentalRecord[] =
    confirmationData?.sacramentalRecords || [];
  const marriageRecords: SacramentalRecord[] =
    marriageData?.sacramentalRecords || [];
  const stats = statsData?.sacramentStats || [];

  const getSacramentIcon = (type: string) => {
    switch (type) {
      case "baptism":
        return (
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            💧
          </div>
        );
      case "communion":
        return (
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
            🍞
          </div>
        );
      case "confirmation":
        return (
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            ✝️
          </div>
        );
      case "marriage":
        return (
          <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
            💒
          </div>
        );
      default:
        return <DocumentTextIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  const getCurrentRecords = () => {
    switch (activeTab) {
      case "baptism":
        return baptismRecords;
      case "communion":
        return communionRecords;
      case "confirmation":
        return confirmationRecords;
      case "marriage":
        return marriageRecords;
      default:
        return [];
    }
  };

  const isLoading =
    baptismLoading ||
    communionLoading ||
    confirmationLoading ||
    marriageLoading ||
    statsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const currentRecords = getCurrentRecords();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sacraments
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage sacramental records for this branch
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Record
        </button>
      </div>

      {/* Statistics Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat: any) => (
            <div
              key={stat.sacramentType}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center">
                {getSacramentIcon(stat.sacramentType.toLowerCase())}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {stat.sacramentType.replace("_", " ")}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.count}
                  </p>
                  {stat.trend && (
                    <p
                      className={`text-xs ${stat.trend > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.trend > 0 ? "+" : ""}
                      {stat.trend}% from last period
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              key: "baptism",
              label: "Baptisms",
              count: baptismRecords.length,
              icon: "💧",
            },
            {
              key: "communion",
              label: "First Communion",
              count: communionRecords.length,
              icon: "🍞",
            },
            {
              key: "confirmation",
              label: "Confirmations",
              count: confirmationRecords.length,
              icon: "✝️",
            },
            {
              key: "marriage",
              label: "Marriages",
              count: marriageRecords.length,
              icon: "💒",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.key
                  ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {currentRecords.length === 0 ? (
          <div className="text-center py-12">
            {getSacramentIcon(activeTab)}
            <div className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No {activeTab} records yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start tracking {activeTab} ceremonies by adding your first record.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add First Record
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {currentRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getSacramentIcon(activeTab)}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                          {record.sacramentType.replace("_", " ")} Record
                        </h3>
                        {record.certificateNumber && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            #{record.certificateNumber}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(record.dateOfSacrament),
                              "MMMM d, yyyy",
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span>Officiant: {record.officiantName}</span>
                        </div>

                        {record.locationOfSacrament && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{record.locationOfSacrament}</span>
                          </div>
                        )}

                        {(record.witness1Name || record.witness2Name) && (
                          <div className="flex items-center gap-2">
                            <HeartIcon className="h-4 w-4" />
                            <span>
                              Witnesses:{" "}
                              {[record.witness1Name, record.witness2Name]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {record.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Notes:</strong> {record.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {record.certificateUrl && (
                      <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                        <DocumentTextIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
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
};

export default BranchSacramentsPanel;
