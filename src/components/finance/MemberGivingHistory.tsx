"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_MEMBERS_LIST } from "@/graphql/queries/memberQueries";
import {
  MEMBER_GIVING_ANALYSIS,
  MemberGivingAnalysisInput,
  MemberGivingAnalysisResult,
} from "../../graphql/queries/analytics";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import {
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface MemberGivingHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

// Simple Modal component for member giving history
function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-6xl mx-4 p-0 relative animate-fadeIn max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-2xl bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="text-lg font-bold text-indigo-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-indigo-500 transition"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="px-6 py-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function MemberGivingHistory({
  isOpen,
  onClose,
}: MemberGivingHistoryProps) {
  const { organisationId, branchId } = useOrganisationBranch();
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0], // Start of current year
    endDate: new Date().toISOString().split("T")[0], // Today
  });

  // Fetch members for selection
  const { data: memberResults, loading: membersLoading } = useQuery(
    GET_MEMBERS_LIST,
    {
      variables: {
        organisationId,
        branchId,
        search: memberSearch || undefined,
        skip: 0,
        take: 50,
      },
      skip: !organisationId,
    },
  );

  // Prepare member giving analysis input
  const memberGivingInput: MemberGivingAnalysisInput | null =
    selectedMemberId &&
    organisationId &&
    dateRange.startDate &&
    dateRange.endDate
      ? {
          memberId: selectedMemberId,
          organisationId,
          branchId: branchId || undefined,
          dateRange: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
          includeRecentContributions: true,
          recentContributionsLimit: 10,
        }
      : null;

  // Fetch member giving analysis
  const {
    data: givingAnalysisData,
    loading: analysisLoading,
    error: analysisError,
  } = useQuery<{ memberGivingAnalysis: MemberGivingAnalysisResult }>(
    MEMBER_GIVING_ANALYSIS,
    {
      variables: { input: memberGivingInput },
      skip:
        !memberGivingInput ||
        !selectedMemberId ||
        !organisationId ||
        !dateRange.startDate ||
        !dateRange.endDate,
      errorPolicy: "all",
      onError: (error) => {
        console.error("Member giving analysis error:", error);
        console.error("Input variables:", { input: memberGivingInput });
      },
    },
  );

  const members = memberResults?.members || [];
  const filteredMembers = useMemo(() => {
    if (!memberSearch) return members.slice(0, 10);
    return members
      .filter(
        (member: any) =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(memberSearch.toLowerCase()) ||
          member.email?.toLowerCase().includes(memberSearch.toLowerCase()),
      )
      .slice(0, 10);
  }, [members, memberSearch]);

  const handleMemberSelect = (member: any) => {
    setSelectedMember(member);
    setSelectedMemberId(member.id);
    setMemberSearch(`${member.firstName} ${member.lastName}`);
  };

  const clearMemberSelection = () => {
    setSelectedMember(null);
    setSelectedMemberId("");
    setMemberSearch("");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get trend icon and color
  const getTrendDisplay = (direction: string, changePercent: number) => {
    const isPositive = direction === "INCREASING";
    const isNegative = direction === "DECREASING";

    return {
      icon: isPositive
        ? ArrowTrendingUpIcon
        : isNegative
          ? ArrowTrendingDownIcon
          : ChartBarIcon,
      color: isPositive
        ? "text-green-600"
        : isNegative
          ? "text-red-600"
          : "text-gray-600",
      bgColor: isPositive
        ? "bg-green-50"
        : isNegative
          ? "bg-red-50"
          : "bg-gray-50",
      text: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(1)}%`,
    };
  };

  const analysisData = givingAnalysisData?.memberGivingAnalysis;

  return (
    <Modal
      open={isOpen}
      title="Member Giving History & Analytics"
      onClose={onClose}
    >
      <div className="space-y-6">
        {/* Member Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-indigo-600" />
            Select Member
          </h4>

          <div className="relative">
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            {memberSearch && !selectedMember && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {membersLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Loading members...
                  </div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map((member: any) => (
                    <button
                      key={member.id}
                      onClick={() => handleMemberSelect(member)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      {member.email && (
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No members found
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedMember && (
            <div className="mt-3 p-3 bg-indigo-50 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium text-indigo-900">
                  {selectedMember.firstName} {selectedMember.lastName}
                </div>
                {selectedMember.email && (
                  <div className="text-sm text-indigo-600">
                    {selectedMember.email}
                  </div>
                )}
              </div>
              <button
                onClick={clearMemberSelection}
                className="text-indigo-400 hover:text-indigo-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Date Range Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            Date Range
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Member Giving Analytics */}
        {selectedMember && (
          <>
            {analysisLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading giving analytics...</p>
              </div>
            )}

            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <InformationCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Error loading analytics</span>
                </div>
                <p className="text-red-700 text-sm">
                  {analysisError.message ||
                    "Unable to load member giving analytics. Please try again."}
                </p>
              </div>
            )}

            {analysisData && (
              <div className="space-y-6">
                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Total Giving
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {formatCurrency(analysisData.totalGiving)}
                        </p>
                      </div>
                      <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Contributions
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {analysisData.contributionCount}
                        </p>
                        <p className="text-xs text-blue-600">
                          Avg: {formatCurrency(analysisData.averageGift)}
                        </p>
                      </div>
                      <ChartBarIcon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-800">
                          Giving Rank
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          #{analysisData.givingRank}
                        </p>
                        <p className="text-xs text-purple-600">
                          {analysisData.percentileRank.toFixed(0)}th percentile
                        </p>
                      </div>
                      <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          YoY Change
                        </p>
                        <p className="text-2xl font-bold text-orange-900">
                          {analysisData.yearOverYearChange >= 0 ? "+" : ""}
                          {analysisData.yearOverYearChange.toFixed(1)}%
                        </p>
                      </div>
                      {analysisData.yearOverYearChange >= 0 ? (
                        <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Giving Trend Analysis */}
                {analysisData.givingTrend && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Giving Trend Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${getTrendDisplay(analysisData.givingTrend.direction, analysisData.givingTrend.changePercent).bgColor}`}
                        >
                          {React.createElement(
                            getTrendDisplay(
                              analysisData.givingTrend.direction,
                              analysisData.givingTrend.changePercent,
                            ).icon,
                            {
                              className: `h-4 w-4 ${getTrendDisplay(analysisData.givingTrend.direction, analysisData.givingTrend.changePercent).color}`,
                            },
                          )}
                          <span
                            className={`text-sm font-medium ${getTrendDisplay(analysisData.givingTrend.direction, analysisData.givingTrend.changePercent).color}`}
                          >
                            {analysisData.givingTrend.direction}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Trend Direction
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">
                          {
                            getTrendDisplay(
                              analysisData.givingTrend.direction,
                              analysisData.givingTrend.changePercent,
                            ).text
                          }
                        </p>
                        <p className="text-xs text-gray-500">Change Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">
                          {analysisData.givingTrend.consistency.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          Consistency Score
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fund Breakdown */}
                {analysisData.fundBreakdown.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Giving by Fund
                    </h4>
                    <div className="space-y-3">
                      {analysisData.fundBreakdown.map((fund, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {fund.fundName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {fund.contributionCount} contributions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {formatCurrency(fund.totalAmount)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {fund.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Contributions */}
                {analysisData.recentContributions.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Recent Contributions
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-900">
                              Date
                            </th>
                            <th className="text-right py-2 font-medium text-gray-900">
                              Amount
                            </th>
                            <th className="text-left py-2 font-medium text-gray-900">
                              Fund
                            </th>
                            <th className="text-left py-2 font-medium text-gray-900">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysisData.recentContributions.map(
                            (contribution, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-100"
                              >
                                <td className="py-2 text-gray-900">
                                  {formatDate(contribution.date)}
                                </td>
                                <td className="py-2 text-right font-medium text-gray-900">
                                  {formatCurrency(contribution.amount)}
                                </td>
                                <td className="py-2 text-gray-600">
                                  {contribution.fundName || "General"}
                                </td>
                                <td className="py-2 text-gray-600">
                                  {contribution.description || "-"}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!selectedMember && (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a Member
            </h3>
            <p className="text-gray-500">
              Choose a member from the search above to view their detailed
              giving history and analytics.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
