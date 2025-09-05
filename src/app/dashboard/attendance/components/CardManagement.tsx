"use client";

import React, { useState, useEffect } from "react";
import { MemberCard, Member, CardStatus } from "../types";
import {
  PlusCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  useMembersWithCardsAllFields,
  useAssignRfidCardToMember,
} from "@/graphql/hooks/useMember";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";
import Image from "next/image";
import MemberSearchCombobox from "./MemberSearchCombobox";
import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";

export default function CardManagement() {
  // ...existing state
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  // ...existing state

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const orgBranchFilter = useOrganizationBranchFilter();

  // Fetch members with RFID cards (live data)
  const {
    members: cards,
    loading: isLoading,
    error,
    refetch,
  } = useMembersWithCardsAllFields(orgBranchFilter, {
    take: pageSize,
    skip: (page - 1) * pageSize,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CardStatus | "all">("all");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [cardType, setCardType] = useState<"rfid" | "nfc" | "qr">("rfid");
  const [newCardNumber, setNewCardNumber] = useState("");

  // Assign RFID card mutation
  const {
    assignRfidCardToMember,
    loading: issuing,
    error: issueError,
    data: issueData,
  } = useAssignRfidCardToMember();
  const [issueMessage, setIssueMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // For member search in modal
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchedMembers, loading: searching } = useSearchMembers(
    searchQuery,
    orgBranchFilter.organisationId,
  );

  // For modal combobox: fallback to card fields if member not found
  const getMemberName = (memberId: string): string => {
    const card = cards.find((c) => c.id === memberId);
    return card ? `${card.firstName} ${card.lastName}` : "Unknown Member";
  };

  const getMemberPhoto = (memberId: string): string | undefined => {
    const card = cards.find((c) => c.id === memberId);
    return card?.profileImageUrl;
  };

  const handleIssueCard = async () => {
    if (!selectedMemberId || !newCardNumber) return;
    setIssueMessage(null);
    try {
      await assignRfidCardToMember({
        memberId: selectedMemberId,
        rfidCardId: newCardNumber,
      });
      setToast("Card issued successfully!");
      setTimeout(() => {
        setIsIssueModalOpen(false);
        setSelectedMemberId("");
        setNewCardNumber("");
        setCardType("rfid");
        setToast(null);
      }, 1200); // Show toast for 1.2 seconds before dismissing modal
    } catch (err: any) {
      setIssueMessage(err?.message || "Failed to issue card.");
    }
  };

  const handleStatusChange = (cardId: string, newStatus: CardStatus) => {
    const updatedCards = cards.map((card) =>
      card.id === cardId ? { ...card, status: newStatus } : card,
    );
    setCards(updatedCards);
  };

  // Not needed for new API-driven card list; kept for future use if needed
  const getMembersWithoutCards = () => [];

  const getStatusBadgeColor = (status: CardStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
        <span className="ml-2 text-gray-600">Loading card data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Member Card Management
        </h2>
        {/* Issue New Card button hidden for card scanning page */}
        {/*
        <button
          onClick={() => setIsIssueModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Issue New Card
        </button>
        */}
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              id="search"
              placeholder="Search members, card numbers, or IDs..."
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 shadow-sm transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search members, card numbers, or IDs"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status Filter
          </label>
          <select
            id="status-filter"
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as CardStatus | "all")
            }
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Member
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Card Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Issue Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Used
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cards.length > 0 ? (
              cards
                .filter((card) => {
                  if (!searchTerm) return true;
                  const memberName =
                    `${card.firstName} ${card.lastName}`.toLowerCase();
                  return (
                    (card.rfidCardId || "")
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    memberName.includes(searchTerm.toLowerCase())
                  );
                })
                .map((card) => (
                  <React.Fragment key={card.id}>
                    <tr
                      className="group hover:bg-gray-50 transition"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setExpandedRowId(
                          expandedRowId === card.id ? null : card.id,
                        )
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 relative rounded-full overflow-hidden">
                            {getMemberPhoto(card.id) ? (
                              <Image
                                src={getMemberPhoto(card.id) || ""}
                                alt={getMemberName(card.id)}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                                {card.firstName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {card.firstName + " " + card.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {card.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {card.cardNumber}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {card.cardType} Card
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Use createdAt as issue date fallback */}
                        {card.createdAt
                          ? new Date(card.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(card.status)}`}
                        >
                          {card.status.charAt(0).toUpperCase() +
                            card.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* No lastUsed in schema; show updatedAt as fallback */}
                        {card.updatedAt
                          ? new Date(card.updatedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRowId(
                              expandedRowId === card.id ? null : card.id,
                            );
                          }}
                          aria-label={
                            expandedRowId === card.id
                              ? "Collapse details"
                              : "Expand details"
                          }
                        >
                          {expandedRowId === card.id ? (
                            <ArrowPathIcon className="w-5 h-5 inline" />
                          ) : (
                            <PlusCircleIcon className="w-5 h-5 inline" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {/* Expandable row for details */}
                    {expandedRowId === card.id && (
                      <tr>
                        <td
                          colSpan={6}
                          className="bg-gray-50 px-6 py-6 border-b"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <div className="font-semibold text-gray-700 flex items-center mb-2">
                                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />{" "}
                                Card & Member Info
                              </div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>
                                  <span className="font-medium">
                                    Full Name:
                                  </span>{" "}
                                  {card.firstName + " " + card.lastName}
                                </li>
                                <li>
                                  <span className="font-medium">Email:</span>{" "}
                                  {card.email || "—"}
                                </li>
                                <li>
                                  <span className="font-medium">Phone:</span>{" "}
                                  {card.phoneNumber || "—"}
                                </li>
                                <li>
                                  <span className="font-medium">Gender:</span>{" "}
                                  {card.gender || "—"}
                                </li>
                                <li>
                                  <span className="font-medium">
                                    Date of Birth:
                                  </span>{" "}
                                  {card.dateOfBirth
                                    ? new Date(
                                        card.dateOfBirth,
                                      ).toLocaleDateString()
                                    : "—"}
                                </li>
                                <li>
                                  <span className="font-medium">
                                    Marital Status:
                                  </span>{" "}
                                  {card.maritalStatus || "—"}
                                </li>
                                <li>
                                  <span className="font-medium">
                                    Card Number:
                                  </span>{" "}
                                  {card.rfidCardId || "—"}
                                </li>
                                <li>
                                  <span className="font-medium">
                                    Membership Date:
                                  </span>{" "}
                                  {card.membershipDate
                                    ? new Date(
                                        card.membershipDate,
                                      ).toLocaleDateString()
                                    : "—"}
                                </li>
                              </ul>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-700 flex items-center mb-2">
                                <ArrowPathIcon className="w-4 h-4 mr-1 text-blue-500" />{" "}
                                Relationships & Branch
                              </div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>
                                  <span className="font-medium">Branch:</span>{" "}
                                  {card.branch?.name || "—"}
                                </li>
                                <li>
                                  <span className="font-medium">Spouse:</span>{" "}
                                  {card.spouse
                                    ? `${card.spouse.firstName} ${card.spouse.lastName}`
                                    : "—"}
                                </li>
                                <li>
                                  <span className="font-medium">Children:</span>{" "}
                                  {card.children && card.children.length > 0
                                    ? card.children
                                        .map(
                                          (child) =>
                                            `${child.firstName} ${child.lastName}`,
                                        )
                                        .join(", ")
                                    : "—"}
                                </li>
                                <li>
                                  <span className="font-medium">Parent:</span>{" "}
                                  {card.parent
                                    ? `${card.parent.firstName} ${card.parent.lastName}`
                                    : "—"}
                                </li>
                                <li>
                                  <span className="font-medium">Address:</span>{" "}
                                  {card.address || "—"}, {card.city || ""}{" "}
                                  {card.state || ""} {card.country || ""}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No cards found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page <span className="font-semibold">{page}</span>
        </span>
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page + 1)}
          disabled={cards.length < pageSize}
        >
          Next
        </button>
      </div>

      {/* Card Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Cards
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {cards.filter((card) => card.status === "active").length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-gray-100 rounded-md p-3">
                <XCircleIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inactive Cards
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        cards.filter((card) => card.status === "inactive")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Lost Cards
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {cards.filter((card) => card.status === "lost").length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <PlusCircleIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Members Without Cards
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {getMembersWithoutCards().length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Card Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Issue New Card
            </h3>
            {issueMessage && (
              <div className={`mb-4 p-2 rounded bg-red-100 text-red-700`}>
                {issueMessage}
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="member-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Member
              </label>
              <MemberSearchCombobox
                members={searchedMembers || []}
                value={selectedMemberId}
                onChange={setSelectedMemberId}
                query={searchQuery}
                onQueryChange={setSearchQuery}
                loading={searching}
                disabled={issuing}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="card-number"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Card Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="card-number"
                  placeholder="Enter card number"
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newCardNumber}
                  onChange={(e) => setNewCardNumber(e.target.value)}
                  disabled={issuing}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm text-xs font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                  disabled={issuing}
                  onClick={() => {
                    // Generate a random 10-digit number as card ID
                    const randomId = Math.floor(
                      1000000000 + Math.random() * 9000000000,
                    ).toString();
                    setNewCardNumber(randomId);
                  }}
                >
                  Generate
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                For RFID/NFC cards, enter the physical card number. For QR
                codes, provide a unique identifier.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={issuing}
              >
                Cancel
              </button>
              <button
                onClick={handleIssueCard}
                disabled={!selectedMemberId || !newCardNumber || issuing}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {issuing ? "Issuing..." : "Issue Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
