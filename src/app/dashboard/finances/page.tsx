"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CurrencyDollarIcon,
  PlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useTransactionMutations } from "@/graphql/hooks/useTransactionMutations";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { useSearchMembers } from "@/graphql/hooks/useSearchMembers";
import { useTransactionsQuery } from "@/graphql/hooks/useTransactionQueries";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import DashboardHeader from "@/components/DashboardHeader";
import { useFinanceReferenceData } from "@/graphql/hooks/useFinanceReferenceData";
import { useTransactionStatsQuery } from "@/graphql/hooks/useTransactionQueries";
import { useBranchEvents } from "@/hooks/useBranchEvents";
import { EXPORT_TRANSACTIONS } from "@/graphql/queries/exportTransactionQueries";
import { useBranches } from "../../../graphql/hooks/useBranches";

// Import analytics components
import CashFlowAnalysis from "@/components/finance/CashFlowAnalysis";
import ComparativePeriodAnalysis from "@/components/finance/ComparativePeriodAnalysis";
import MemberGivingHistory from "@/components/finance/MemberGivingHistory";
import DonorStatements from "@/components/finance/DonorStatements";

// Simple Modal component
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
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-2xl mx-2 p-0 relative animate-fadeIn">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-2xl bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="text-lg font-bold text-indigo-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-indigo-500 transition"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const GET_FUNDS = gql`
  query GetFunds($organisationId: String!, $branchId: String) {
    funds(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      branchId
    }
  }
`;

const CREATE_FUND = gql`
  mutation CreateFund($createFundInput: CreateFundInput!) {
    createFund(createFundInput: $createFundInput) {
      id
      name
      description
      organisationId
      branchId
    }
  }
`;

function AddFundModal({
  open,
  onClose,
  organisationId,
  onFundCreated,
  branchId,
}: {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  onFundCreated: () => void;
  branchId: string;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [createFund, { loading, error }] = useMutation(CREATE_FUND);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFund({
      variables: {
        createFundInput: {
          name,
          description,
          isActive,
          organisationId,
          branchId: branchId,
        },
      },
      refetchQueries: [
        {
          query: GET_FUNDS,
          variables: { organisationId, branchId },
        },
      ],
      awaitRefetchQueries: true,
    });
    setName("");
    setDescription("");
    setIsActive(true);
    onFundCreated();
    onClose();
  };
  return (
    <Modal open={open} title="Add Fund" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Fund Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            id="fund-active"
            className="mr-2"
          />
          <label htmlFor="fund-active">Active</label>
        </div>
        {error && <div className="text-red-500">{error.message}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Fund"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// --- Batch Offering Modal ---
function BatchOfferingModal({
  open,
  onClose,
  events,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  events: any[];
  onSubmit: (
    batch: { eventId: string; amount: string; note?: string }[],
  ) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState(() =>
    events.map((e: any) => ({ eventId: e.id, amount: "", note: "" })),
  );

  useEffect(() => {
    setForm(events.map((e: any) => ({ eventId: e.id, amount: "", note: "" })));
  }, [events, open]);

  const handleChange = (
    idx: number,
    field: "amount" | "note",
    value: string,
  ) => {
    setForm((f) =>
      f.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = form.filter(
      (row) =>
        row.amount && !isNaN(Number(row.amount)) && Number(row.amount) > 0,
    );
    if (batch.length > 0) onSubmit(batch);
  };

  return (
    <Modal open={open} title="Batch Offering for Events" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-50">
                <th className="px-3 py-2 text-left font-semibold">Event</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
                <th className="px-3 py-2 text-left font-semibold">Amount</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Note (optional)
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={event.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-3 py-2">{event.title || event.name}</td>
                  <td className="px-3 py-2">
                    {new Date(
                      event.startDate || event.date,
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form[idx].amount}
                      onChange={(e) =>
                        handleChange(idx, "amount", e.target.value)
                      }
                      className="w-28 px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={form[idx].note}
                      onChange={(e) =>
                        handleChange(idx, "note", e.target.value)
                      }
                      className="w-40 px-2 py-1 border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Offerings"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function FinancialHealthIndicator({
  balance,
  monthlyExpenses,
}: {
  balance: number;
  monthlyExpenses: number;
}) {
  let status = "Healthy";
  let color = "bg-green-100 text-green-800";
  let icon = (
    <svg
      className="h-4 w-4 mr-1 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
    </svg>
  );
  if (balance < monthlyExpenses) {
    status = "Critical";
    color = "bg-red-100 text-red-800";
    icon = (
      <svg
        className="h-4 w-4 mr-1 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01"
        />
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </svg>
    );
  } else if (balance < monthlyExpenses * 3) {
    status = "Warning";
    color = "bg-yellow-100 text-yellow-800";
    icon = (
      <svg
        className="h-4 w-4 mr-1 text-yellow-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01"
        />
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${color}`}
      title={`Balance: ₵${(balance ?? 0).toLocaleString()} | Monthly Expenses: ₵${(monthlyExpenses ?? 0).toLocaleString()}`}
    >
      {icon}
      {status}
    </span>
  );
}

export default function BranchFinancesPage({
  selectedBranch,
}: { selectedBranch?: string } = {}) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId: defaultBranchId } = useOrganisationBranch();
  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useBranches({ organisationId });
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("transactions"); // Add main tab state
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("all");

  const [openModal, setOpenModal] = useState<string | null>(null);

  const [modalForm, setModalForm] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
    contributionTypeId: "",
    fundId: "",
    paymentMethodId: "",
  });

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const [transactionForm, setTransactionForm] = useState({
    type: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    fundId: "",
    paymentMethodId: "",
    reference: "",
    contributionTypeId: "", // Only for CONTRIBUTION
    eventId: "", // Only for Offering contribution type
    batchMode: false,
    batchEvents: [],
  });

  const [memberSearch, setMemberSearch] = useState("");
  const isSuperAdmin = user?.roles?.some((role) => role.name === "SUPER_ADMIN");
  const branchId = isSuperAdmin
    ? selectedBranchId
    : selectedBranchId || defaultBranchId;

  const [addFundOpen, setAddFundOpen] = useState(false);
  const [fundsRefreshKey, setFundsRefreshKey] = useState(0);
  const handleFundCreated = () => setFundsRefreshKey((k) => k + 1);

  const {
    data: fundsData,
    loading: fundsLoading,
    error: fundsError,
  } = useQuery(GET_FUNDS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });
  const funds = fundsData?.funds || [];

  const { data: memberResults, loading: memberLoading } = useSearchMembers(
    memberSearch,
    organisationId,
    branchId,
  );

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string,
  ) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClearDateFilter = () => {
    setDateRange({
      startDate: "",
      endDate: "",
    });
    setSelectedEvent(null);
    // Reset pagination and refetch
    setCurrentPage(1);
    refetch();
  };

  const {
    loading: transactionsLoading,
    data: transactionsData,
    error: transactionsError,
    fetchMore,
    refetch,
  } = useTransactionsQuery({
    organisationId,
    branchId,
    type:
      transactionTypeFilter === "all"
        ? undefined
        : transactionTypeFilter === "contribution"
          ? "CONTRIBUTION"
          : transactionTypeFilter === "expense"
            ? "EXPENSE"
            : transactionTypeFilter === "transfer"
              ? "TRANSFER"
              : transactionTypeFilter === "fund_allocation"
                ? "FUND_ALLOCATION"
                : undefined,
    fundId: selectedFund || undefined,
    eventId: selectedEvent || undefined,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });

  const stats = transactionsData?.transactions?.stats;

  const transactions = transactionsData?.transactions?.items || [];
  const hasNextPage = transactionsData?.transactions?.hasNextPage || false;

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          paginationInput: {
            skip: transactions.length,
            take: 10,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            transactions: {
              ...fetchMoreResult.transactions,
              items: [
                ...prev.transactions.items,
                ...fetchMoreResult.transactions.items,
              ],
            },
          };
        },
      });
    }
  };

  const displayedTransactions = useMemo(() => {
    if (!transactionsData?.transactions) return [];
    let result = transactions;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          (tx.description && tx.description.toLowerCase().includes(query)) ||
          tx.type.toLowerCase().includes(query) ||
          tx.amount.toString().includes(query),
      );
    }
    return result;
  }, [transactionsData, searchQuery]);

  useEffect(() => {
    if (
      transactionForm.type !== "CONTRIBUTION" &&
      transactionForm.contributionTypeId
    ) {
      setTransactionForm((f) => ({ ...f, contributionTypeId: "" }));
    }
  }, [transactionForm.type]);

  const {
    createTransaction,
    loading: creating,
    error: createError,
  } = useTransactionMutations();

  const handleOpenModal = (typeName: string) => {
    // const contributionType = contributionTypes.find(ct => ct.name === typeName);
    setOpenModal(typeName);
    setModalForm({
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
      contributionTypeId: "",
      fundId: "",
      paymentMethodId: "",
    });
  };
  const handleCloseModal = () => setOpenModal(null);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      handleCloseModal();
    } catch (err) {
      console.error("Failed to create contribution", err);
    }
  };

  const handleOpenTransactionModal = () => setShowTransactionModal(true);
  const handleCloseTransactionModal = () => setShowTransactionModal(false);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle batch mode for offerings
    if (
      transactionForm.type === "CONTRIBUTION" &&
      transactionForm.contributionTypeId &&
      contributionTypes?.find(
        (ct: any) => ct.id === transactionForm.contributionTypeId,
      )?.name === "Offering" &&
      transactionForm.batchMode
    ) {
      // Filter only included events with valid amounts
      const batchItems = (transactionForm.batchEvents || []).filter(
        (item) =>
          item.included &&
          item.amount &&
          !isNaN(Number(item.amount)) &&
          Number(item.amount) > 0,
      );

      if (batchItems.length === 0) {
        alert("Please include at least one event with a valid amount.");
        return;
      }

      try {
        // Process each batch item
        for (const item of batchItems) {
          const input = {
            branchId,
            organisationId,
            fundId: transactionForm.fundId || null,
            userId: user.id,
            type: "CONTRIBUTION" as "CONTRIBUTION",
            amount: parseFloat(item.amount),
            date: transactionForm.date,
            description: transactionForm.description || `Offering for event`,
            reference: transactionForm.reference || null,
            eventId: item.eventId, // Move eventId to top-level
            metadata: {
              contributionTypeId: transactionForm.contributionTypeId,
              paymentMethodId: transactionForm.paymentMethodId || null,
            },
          };

          await createTransaction({
            variables: { createTransactionInput: input },
          });
        }

        // Refetch data after all transactions are created
        refetch();
        await refetchQueries();
        handleCloseTransactionModal();

        // Reset form
        setTransactionForm({
          type: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
          fundId: "",
          paymentMethodId: "",
          reference: "",
          contributionTypeId: "",
          eventId: "",
          batchMode: false,
          batchEvents: [],
        });

        setSelectedMemberId(null);
        setMemberSearch("");

        // Show success message
        alert(
          `Successfully recorded ${batchItems.length} offering transactions.`,
        );
      } catch (error) {
        console.error("Error creating batch transactions:", error);
        alert(
          "Failed to create batch transactions. Please check all required fields and try again.",
        );
      }

      return;
    }

    // Regular single transaction handling
    const input = {
      branchId,
      organisationId,
      fundId: transactionForm.fundId || null,
      userId: user.id,
      type: transactionForm.type as
        | "CONTRIBUTION"
        | "EXPENSE"
        | "TRANSFER"
        | "FUND_ALLOCATION",
      amount: parseFloat(transactionForm.amount),
      date: transactionForm.date,
      description: transactionForm.description,
      reference: transactionForm.reference || null,
      eventId: transactionForm.eventId, // Move eventId to top-level
      metadata: {},
    };
    // Double-check type is present
    if (!input.type) {
      alert("Transaction type is required.");
      return;
    }
    if (transactionForm.type === "CONTRIBUTION") {
      input.metadata = {
        contributionTypeId: transactionForm.contributionTypeId,
        paymentMethodId: transactionForm.paymentMethodId || null,
        memberId: selectedMemberId,
        // Remove eventId from metadata as it's now at top-level
        // eventId: transactionForm.eventId, // Add event ID for Offering contribution type
        // Add more fields as needed (e.g., isAnonymous)
      };
    } else {
      // For other transaction types, include paymentMethodId in metadata if present
      if (transactionForm.paymentMethodId) {
        input.metadata.paymentMethodId = transactionForm.paymentMethodId;
      }
    }

    try {
      await createTransaction({
        variables: { createTransactionInput: input },
        refetchQueries: [
          {
            query: GET_FUNDS,
            variables: { organisationId, branchId },
          },
        ],
        awaitRefetchQueries: true,
      });
      refetch();
      handleCloseTransactionModal();
      // Reset form
      setTransactionForm({
        type: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
        fundId: "",
        paymentMethodId: "",
        reference: "",
        contributionTypeId: "",
        eventId: "", // Reset event ID
        batchMode: false,
        batchEvents: [],
      });
      setSelectedMemberId(null);
      setMemberSearch("");
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert(
        "Failed to create transaction. Please check all required fields and try again.",
      );
    }
  };

  // Helper function to refetch all necessary queries
  const refetchQueries = async () => {
    try {
      await client.refetchQueries({
        include: [
          {
            query: GET_FUNDS,
            variables: { organisationId, branchId },
          },
          {
            query: GET_BRANCH_TRANSACTIONS,
            variables: {
              branchId,
              organisationId,
              skip: 0,
              take: 10,
              dateRange: {
                startDate: dateRange.startDate || undefined,
                endDate: dateRange.endDate || undefined,
              },
              searchTerm: searchQuery || undefined,
              eventId: selectedEvent || undefined,
              type:
                activeTab === "all"
                  ? undefined
                  : activeTab === "contribution"
                    ? "CONTRIBUTION"
                    : activeTab === "expense"
                      ? "EXPENSE"
                      : activeTab === "transfer"
                        ? "TRANSFER"
                        : activeTab === "fund_allocation"
                          ? "FUND_ALLOCATION"
                          : undefined,
              fundId: selectedFund || undefined,
            },
          },
          {
            query: GET_BRANCH_FINANCE_STATS,
            variables: {
              branchId,
              organisationId,
              eventId: selectedEvent || undefined,
              dateRange: {
                startDate: dateRange.startDate || undefined,
                endDate: dateRange.endDate || undefined,
              },
            },
          },
        ],
      });
    } catch (error) {
      console.error("Error refetching queries:", error);
    }
  };

  // Fetch events for the branch (recent/upcoming)
  const {
    events,
    loading: eventsLoading,
    refetch: refetchEvents,
  } = useBranchEvents(branchId, organisationId);

  // Debug events data

  // Refetch events when branch or organisation changes
  useEffect(() => {
    if (branchId && organisationId) {
      refetchEvents();
    }
  }, [branchId, organisationId, refetchEvents]);

  const {
    contributionTypes,
    paymentMethods,
    loading: refDataLoading,
  } = useFinanceReferenceData();

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  const monthlyExpenses = useMemo(() => {
    if (!transactions?.length) return 0;
    const now = new Date();
    const lastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate(),
    );
    return transactions
      .filter((t) => t.type === "EXPENSE" && new Date(t.date) >= lastMonth)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const balance = stats?.currentBalance || 0;

  const [exportLoading, setExportLoading] = useState(false);
  const client = useApolloClient();

  const handleExport = async (type: "excel" | "csv") => {
    setExportLoading(true);
    try {
      const variables: any = {
        organisationId,
        branchId: branchId || undefined,
        fundId: selectedFund || undefined,
        eventId: selectedEvent || undefined,
        type: activeTab !== "all" ? activeTab.toUpperCase() : undefined,
        dateRange:
          dateRange.startDate || dateRange.endDate
            ? {
                startDate: dateRange.startDate || null,
                endDate: dateRange.endDate || null,
              }
            : undefined,
        searchTerm: searchQuery || undefined,
        exportFormat: type,
      };
      const { data } = await client.query({
        query: EXPORT_TRANSACTIONS,
        variables,
        fetchPolicy: "no-cache",
      });
      const url = data?.exportTransactions;
      if (!url) throw new Error("Export failed");
      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions.${type === "excel" ? "xlsx" : type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Export failed: " + (e as Error).message);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Finances"
        subtitle="Manage your organisation financial transactions"
        icon={
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-tr from-green-400 to-emerald-500 shadow-md">
            <CurrencyDollarIcon className="h-7 w-7 text-white" />
          </span>
        }
        action={
          <div className="flex gap-2">
            <button
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleOpenTransactionModal}
              type="button"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Transaction
            </button>
            <button
              onClick={() => setAddFundOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Add Fund
            </button>
          </div>
        }
      />

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`${
                activeTab === "transactions"
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              } px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`${
                activeTab === "analytics"
                  ? "bg-indigo-100 text-indigo-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              } px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Analytics & Reports
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MODERN UNIFIED FILTER BAR */}
        <div className="relative z-10 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              {/* Date Range */}
              <div className="flex-1 min-w-[200px] flex flex-col">
                <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Date Range
                </label>
                <div className="flex gap-2 min-w-0">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition flex-1 min-w-0"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition flex-1 min-w-0"
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Transaction Type Filter - Only show on transactions tab */}
              {activeTab === "transactions" && (
                <div className="flex-1 min-w-[160px] flex flex-col">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    Type
                  </label>
                  <select
                    value={transactionTypeFilter}
                    onChange={(e) => setTransactionTypeFilter(e.target.value)}
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition w-full min-w-0 appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="contribution">Contributions</option>
                    <option value="expense">Expenses</option>
                    <option value="transfer">Transfers</option>
                    <option value="fund_allocation">Fund Allocations</option>
                  </select>
                </div>
              )}

              {/* Event Filter */}
              <div className="flex-1 min-w-[160px] flex flex-col">
                <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-pink-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 01-8 0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Event
                </label>
                <div className="relative min-w-0 overflow-hidden">
                  <select
                    value={selectedEvent || ""}
                    onChange={(e) => setSelectedEvent(e.target.value || null)}
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition w-full min-w-0 appearance-none"
                    disabled={eventsLoading}
                  >
                    <option value="">All Events</option>
                    {events && events.length > 0 ? (
                      events.map((event: any) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))
                    ) : (
                      <option disabled>
                        {eventsLoading
                          ? "Loading events..."
                          : "No events available"}
                      </option>
                    )}
                  </select>
                  {selectedEvent && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-pink-500"
                      onClick={() => setSelectedEvent(null)}
                      title="Clear"
                    >
                      <svg
                        className="w-4 h-4"
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
                  )}
                </div>
              </div>

              {/* Fund Filter */}
              <div className="flex-1 min-w-[160px] flex flex-col">
                <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Fund
                </label>
                <div className="relative min-w-0 overflow-hidden">
                  <select
                    value={selectedFund || ""}
                    onChange={(e) => setSelectedFund(e.target.value || null)}
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-green-400 focus:border-green-400 transition w-full min-w-0 appearance-none"
                    disabled={fundsLoading}
                  >
                    <option value="">All Funds</option>
                    {funds && funds.length > 0 ? (
                      funds.map((fund: any) => (
                        <option key={fund.id} value={fund.id}>
                          {fund.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>
                        {fundsLoading
                          ? "Loading funds..."
                          : "No funds available"}
                      </option>
                    )}
                  </select>
                  {selectedFund && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-green-500"
                      onClick={() => setSelectedFund(null)}
                      title="Clear"
                    >
                      <svg
                        className="w-4 h-4"
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
                  )}
                </div>
              </div>

              {/* Search Input */}
              <div className="flex-[2] min-w-[200px] md:ml-2 flex flex-col">
                <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </label>
                <div className="relative min-w-0 overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition w-full min-w-0 pr-8"
                    aria-label="Search transactions"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-indigo-500"
                      onClick={() => setSearchQuery("")}
                      title="Clear"
                    >
                      <svg
                        className="w-4 h-4"
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
                  )}
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-2 md:ml-2 md:w-auto w-full mt-2 md:mt-0">
                {/* Export Dropdown Button */}
                <div className="relative group">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-white/80 border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 shadow hover:bg-gray-50 transition w-full"
                  >
                    <svg
                      className="w-4 h-4 mr-1 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16"
                      />
                    </svg>
                    Export
                    <svg
                      className="w-3 h-3 ml-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 20 20"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition z-20">
                    {/*<button*/}
                    {/*  className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 rounded-t-lg"*/}
                    {/*  onClick={() => handleExport("pdf")}*/}
                    {/*>*/}
                    {/*  <span className="inline-flex items-center">*/}
                    {/*    <svg className="w-3 h-3 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 16V4a2 2 0 012-2h8a2 2 0 012 2v12M6 16h12M6 16l-2 2m2-2l2 2" /></svg>*/}
                    {/*    PDF*/}
                    {/*  </span>*/}
                    {/*</button>*/}
                    <button
                      className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50"
                      onClick={() => handleExport("excel")}
                    >
                      <span className="inline-flex items-center">
                        <svg
                          className="w-3 h-3 mr-2 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 8v8m-8-8v8m8-8H8m8 8h-8"
                          />
                        </svg>
                        Excel
                      </span>
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 rounded-b-lg"
                      onClick={() => handleExport("csv")}
                    >
                      <span className="inline-flex items-center">
                        <svg
                          className="w-3 h-3 mr-2 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4h16v16H4V4zm4 4h8v8H8V8z"
                          />
                        </svg>
                        CSV
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-white/80 border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 shadow hover:bg-gray-50 transition"
                  onClick={() => {
                    setDateRange({ startDate: "", endDate: "" });
                    setSelectedEvent(null);
                    setSelectedFund(null);
                    setTransactionTypeFilter("all");
                    setSearchQuery("");
                    setCurrentPage(1);
                    refetch();
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-1 text-gray-400"
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
                  Clear All
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    setCurrentPage(1);
                    refetch();
                  }}
                >
                  <svg
                    className="w-4 h-4 mr-1 text-white opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* SEARCH AND ADD TRANSACTION TOOLBAR */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleOpenTransactionModal}
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Transaction
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Income
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ₵{stats?.totalIncome?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6a2 2 0 002-2v-6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Expenses
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ₵{stats?.totalExpenses?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Net Balance Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  ₵{stats?.netBalance?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5 5 0 0114.458 4 17 17 0 013.276 3.268"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Tithes Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Tithes
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ₵{stats?.totalTithes?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pledges Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Pledges
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ₵{stats?.totalPledges?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div className="rounded-full bg-amber-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Offerings Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Offerings
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ₵{stats?.totalOfferings?.toLocaleString() ?? "0"}
                </p>
              </div>
              <div className="rounded-full bg-teal-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Fund Balances Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-indigo-100">
          <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
            <svg
              className="h-6 w-6 text-indigo-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Fund Balances
          </h2>
          {fundsLoading ? (
            <div className="text-gray-500">Loading funds...</div>
          ) : fundsError ? (
            <div className="text-red-500">Error loading funds.</div>
          ) : (
            organisationId && (
              <FundBalances organisationId={organisationId} funds={funds} />
            )
          )}
        </div>

        {/* TRANSACTIONS TABLE */}
        {activeTab === "transactions" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Event
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedTransactions.length === 0 &&
                    !transactionsLoading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-400"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  {transactionsLoading &&
                    displayedTransactions.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-400"
                        >
                          <div className="flex justify-center items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Loading transactions...
                          </div>
                        </td>
                      </tr>
                    )}
                  {displayedTransactions.map((transaction, idx) => (
                    <tr
                      key={transaction.id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.type === "CONTRIBUTION"
                          ? "Income"
                          : transaction.type === "EXPENSE"
                            ? "Expense"
                            : transaction.type === "TRANSFER"
                              ? "Transfer"
                              : "Fund Allocation"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {transaction.event?.title ? (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {transaction.event.title}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center rounded-md ${transaction.type === "CONTRIBUTION" ? "bg-green-50 text-green-700 ring-green-700/10" : "bg-red-50 text-red-700 ring-red-700/10"} px-2 py-1 text-xs font-medium ring-1 ring-inset`}
                        >
                          {transaction.type === "CONTRIBUTION" ? "+" : "-"} ₵
                          {transaction.amount}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {hasNextPage && (
              <div className="text-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={transactionsLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {transactionsLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Section */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Analytics Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Financial Analytics & Reports
              </h2>
              <p className="text-gray-600">
                Comprehensive financial insights and reporting for your
                organization.
              </p>
            </div>

            {/* Analytics Components */}
            <div className="space-y-8">
              <CashFlowAnalysis
                organisationId={organisationId}
                branchId={selectedBranchId || branchId}
                dateRange={{
                  startDate: dateRange.startDate
                    ? new Date(dateRange.startDate)
                    : new Date(new Date().getFullYear(), 0, 1),
                  endDate: dateRange.endDate
                    ? new Date(dateRange.endDate)
                    : new Date(),
                }}
              />

              <ComparativePeriodAnalysis
                organisationId={organisationId}
                branchId={selectedBranchId || branchId}
              />

              <MemberGivingHistory
                organisationId={organisationId}
                branchId={selectedBranchId || branchId}
              />

              <DonorStatements
                organisationId={organisationId}
                branchId={selectedBranchId || branchId}
                dateRange={{
                  startDate: dateRange.startDate
                    ? new Date(dateRange.startDate)
                    : new Date(new Date().getFullYear(), 0, 1),
                  endDate: dateRange.endDate
                    ? new Date(dateRange.endDate)
                    : new Date(),
                }}
              />
            </div>
          </div>
        )}

        {/* FLOATING ADD TRANSACTION BUTTON (MOBILE) */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <button
            onClick={handleOpenTransactionModal}
            className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Modals for each action */}
        <Modal
          open={!!openModal}
          title={`Record ${openModal}`}
          onClose={handleCloseModal}
        >
          <form onSubmit={handleModalSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Amount <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                value={modalForm.amount}
                onChange={(e) =>
                  setModalForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                value={modalForm.date}
                onChange={(e) =>
                  setModalForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Fund <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                value={modalForm.fundId}
                onChange={(e) =>
                  setModalForm((f) => ({ ...f, fundId: e.target.value }))
                }
              >
                <option value="">Select fund</option>
                {funds?.map((fund: any) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                value={modalForm.paymentMethodId}
                onChange={(e) =>
                  setModalForm((f) => ({
                    ...f,
                    paymentMethodId: e.target.value,
                  }))
                }
              >
                <option value="">Select payment method</option>
                {/* {paymentMethods?.map((pm: any) => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))} */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Note
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                value={modalForm.note}
                onChange={(e) =>
                  setModalForm((f) => ({ ...f, note: e.target.value }))
                }
                placeholder="Optional note"
              />
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition"
                disabled={false}
              >
                {false ? "Saving..." : `Save ${openModal}`}
              </button>
            </div>
          </form>
        </Modal>

        {showTransactionModal && (
          <Modal
            open={showTransactionModal}
            title="Add Transaction"
            onClose={handleCloseTransactionModal}
          >
            <form onSubmit={handleTransactionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.type}
                  onChange={(e) =>
                    setTransactionForm((f) => ({ ...f, type: e.target.value }))
                  }
                >
                  <option value="">Select type</option>
                  <option value="CONTRIBUTION">Contribution</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="FUND_ALLOCATION">Fund Allocation</option>
                </select>
                {!transactionForm.type && (
                  <div className="text-red-500 text-xs mt-1">
                    Transaction type is required.
                  </div>
                )}
              </div>
              {/* Show Contribution Type dropdown if type is CONTRIBUTION */}
              {transactionForm.type === "CONTRIBUTION" && (
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Contribution Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={transactionForm.contributionTypeId}
                    onChange={(e) =>
                      setTransactionForm((f) => ({
                        ...f,
                        contributionTypeId: e.target.value,
                      }))
                    }
                  >
                    <option value="">
                      {refDataLoading
                        ? "Loading..."
                        : "Select contribution type"}
                    </option>
                    {contributionTypes?.map((ct: any) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Member search for CONTRIBUTION type when not event-based offering */}
              {transactionForm.type === "CONTRIBUTION" &&
                transactionForm.contributionTypeId &&
                contributionTypes?.find(
                  (ct: any) => ct.id === transactionForm.contributionTypeId,
                )?.name !== "Offering" && (
                  <div className="mb-4">
                    <label
                      htmlFor="memberSearch"
                      className="block text-sm font-medium text-indigo-800 mb-1"
                    >
                      Member <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="memberSearch"
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                      placeholder="Search for member by name, email, or phone"
                      required
                    />
                    {memberLoading && (
                      <div className="text-xs text-gray-400 mt-1">
                        Searching...
                      </div>
                    )}
                    {memberResults && memberSearch && (
                      <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
                        {memberResults.length === 0 ? (
                          <li className="p-2 text-gray-500 text-sm">
                            No members found
                          </li>
                        ) : (
                          memberResults.map((m: any) => (
                            <li
                              key={m.id}
                              className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedMemberId === m.id ? "bg-indigo-100" : ""}`}
                              onClick={() => {
                                setSelectedMemberId(m.id);
                                setMemberSearch(`${m.firstName} ${m.lastName}`);
                              }}
                            >
                              {m.firstName} {m.lastName}{" "}
                              {m.email ? `(${m.email})` : ""}
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                    {/* Show selected member below the input if set */}
                    {selectedMemberId && memberResults && (
                      <div className="mt-1 text-xs text-indigo-700">
                        Selected:{" "}
                        {
                          memberResults.find(
                            (m: any) => m.id === selectedMemberId,
                          )?.firstName
                        }{" "}
                        {
                          memberResults.find(
                            (m: any) => m.id === selectedMemberId,
                          )?.lastName
                        }
                      </div>
                    )}
                  </div>
                )}
              {/* Event selection for Offering contribution type */}
              {transactionForm.type === "CONTRIBUTION" &&
                transactionForm.contributionTypeId &&
                contributionTypes?.find(
                  (ct: any) => ct.id === transactionForm.contributionTypeId,
                )?.name === "Offering" && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <label
                        htmlFor="eventSelect"
                        className="block text-sm font-medium text-indigo-800"
                      >
                        Event <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="batchMode"
                          checked={transactionForm.batchMode}
                          onChange={(e) =>
                            setTransactionForm((f) => ({
                              ...f,
                              batchMode: e.target.checked,
                              eventId: "",
                            }))
                          }
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor="batchMode"
                          className="text-sm text-gray-600"
                        >
                          Batch Mode
                        </label>
                      </div>
                    </div>

                    {!transactionForm.batchMode ? (
                      // Single event selection
                      <select
                        id="eventSelect"
                        required
                        className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                        value={transactionForm.eventId || ""}
                        onChange={(e) =>
                          setTransactionForm((f) => ({
                            ...f,
                            eventId: e.target.value,
                          }))
                        }
                      >
                        <option value="">
                          {eventsLoading ? "Loading events..." : "Select event"}
                        </option>
                        {events?.map((event: any) => (
                          <option key={event.id} value={event.id}>
                            {event.title} (
                            {new Date(event.startDate).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    ) : (
                      // Batch event selection with amounts
                      <div className="border rounded-lg border-indigo-200 p-3 bg-indigo-50 max-h-60 overflow-y-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-indigo-100 rounded-t-lg">
                              <th className="px-3 py-2 text-left font-semibold">
                                Event
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Date
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Amount
                              </th>
                              <th className="px-3 py-2 text-left font-semibold">
                                Include
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {events?.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="px-3 py-2 text-center text-gray-500"
                                >
                                  No events found
                                </td>
                              </tr>
                            ) : (
                              events?.map((event: any, idx) => (
                                <tr
                                  key={event.id}
                                  className="odd:bg-white even:bg-indigo-50 border-b border-indigo-100"
                                >
                                  <td className="px-3 py-2">{event.title}</td>
                                  <td className="px-3 py-2">
                                    {new Date(
                                      event.startDate,
                                    ).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 py-2">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={
                                        transactionForm.batchEvents?.find(
                                          (e) => e.eventId === event.id,
                                        )?.amount || ""
                                      }
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        setTransactionForm((f) => {
                                          const updatedBatch = [
                                            ...(f.batchEvents || []),
                                          ];
                                          const existingIdx =
                                            updatedBatch.findIndex(
                                              (item) =>
                                                item.eventId === event.id,
                                            );

                                          if (existingIdx >= 0) {
                                            updatedBatch[existingIdx] = {
                                              ...updatedBatch[existingIdx],
                                              amount: value,
                                              included:
                                                value.trim() !== "" &&
                                                Number(value) > 0,
                                            };
                                          } else {
                                            updatedBatch.push({
                                              eventId: event.id,
                                              amount: value,
                                              included:
                                                value.trim() !== "" &&
                                                Number(value) > 0,
                                            });
                                          }

                                          return {
                                            ...f,
                                            batchEvents: updatedBatch,
                                          };
                                        });
                                      }}
                                      className="w-24 px-2 py-1 border rounded"
                                      placeholder="0.00"
                                    />
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <input
                                      type="checkbox"
                                      checked={
                                        !!transactionForm.batchEvents?.find(
                                          (e) => e.eventId === event.id,
                                        )?.included
                                      }
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setTransactionForm((f) => {
                                          const updatedBatch = [
                                            ...(f.batchEvents || []),
                                          ];
                                          const existingIdx =
                                            updatedBatch.findIndex(
                                              (item) =>
                                                item.eventId === event.id,
                                            );
                                          const amount =
                                            existingIdx >= 0
                                              ? updatedBatch[existingIdx].amount
                                              : "";

                                          if (existingIdx >= 0) {
                                            updatedBatch[existingIdx] = {
                                              ...updatedBatch[existingIdx],
                                              included: checked,
                                            };
                                          } else if (checked) {
                                            updatedBatch.push({
                                              eventId: event.id,
                                              amount: "",
                                              included: true,
                                            });
                                          }

                                          return {
                                            ...f,
                                            batchEvents: updatedBatch,
                                          };
                                        });
                                      }}
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {events?.length === 0 && !eventsLoading && (
                      <div className="text-xs text-amber-600 mt-1">
                        No events found for this branch. Please create an event
                        first.
                      </div>
                    )}
                  </div>
                )}

              {/* Hide amount field in batch mode */}
              {!(
                transactionForm.type === "CONTRIBUTION" &&
                transactionForm.contributionTypeId &&
                contributionTypes?.find(
                  (ct: any) => ct.id === transactionForm.contributionTypeId,
                )?.name === "Offering" &&
                transactionForm.batchMode
              ) && (
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={transactionForm.amount}
                    onChange={(e) =>
                      setTransactionForm((f) => ({
                        ...f,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.date}
                  onChange={(e) =>
                    setTransactionForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.description}
                  onChange={(e) =>
                    setTransactionForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Fund
                </label>
                <select
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.fundId}
                  onChange={(e) =>
                    setTransactionForm((f) => ({
                      ...f,
                      fundId: e.target.value,
                    }))
                  }
                >
                  <option value="">Select fund</option>
                  {funds?.map((fund: any) => (
                    <option key={fund.id} value={fund.id}>
                      {fund.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Payment Method
                </label>
                <select
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.paymentMethodId}
                  onChange={(e) =>
                    setTransactionForm((f) => ({
                      ...f,
                      paymentMethodId: e.target.value,
                    }))
                  }
                >
                  <option value="">Select payment method</option>
                  {paymentMethods?.map((pm: any) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.reference}
                  onChange={(e) =>
                    setTransactionForm((f) => ({
                      ...f,
                      reference: e.target.value,
                    }))
                  }
                  placeholder="Reference number"
                />
              </div>
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  Error:{" "}
                  {createError.message ||
                    "Failed to create transaction. Please check all required fields."}
                </div>
              )}
              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={handleCloseTransactionModal}
                  className="flex-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 text-base shadow transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition flex justify-center items-center"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Transaction"
                  )}
                </button>
              </div>
            </form>
          </Modal>
        )}
        <AddFundModal
          open={addFundOpen}
          onClose={() => setAddFundOpen(false)}
          organisationId={organisationId}
          onFundCreated={handleFundCreated}
          branchId={branchId}
        />
        {/* Trends and Activity Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Trends Chart */}
          {/*<div className="md:col-span-2 bg-gradient-to-tr from-indigo-50 to-white rounded-2xl shadow-md p-6 border border-gray-100">*/}
          {/*  <h2 className="text-lg font-semibold mb-4 text-gray-900">Giving Trends <span className="text-xs text-gray-400 font-normal">(Coming Soon)</span></h2>*/}
          {/*  <div className="h-48 flex items-center justify-center text-gray-400">*/}
          {/*    [Trend Chart Placeholder]*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* Recent Activity Feed */}
          {/*<div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">*/}
          {/*  <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h2>*/}
          {/*  <div className="space-y-4">*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/*<FinancialHealthIndicator balance={balance} monthlyExpenses={monthlyExpenses} />*/}
        </div>
      </div>
    </div>
  );
}

function FundBalances({
  organisationId,
  funds,
}: {
  organisationId: string;
  funds: any[];
}) {
  if (!funds?.length)
    return <div className="text-gray-500">No funds found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Fund
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => (
            <FundBalanceRow
              key={fund.id}
              organisationId={organisationId}
              fund={fund}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FundBalanceRow({
  organisationId,
  fund,
}: {
  organisationId: string;
  fund: any;
}) {
  const { data, loading, error } = useTransactionStatsQuery({
    organisationId,
    fundId: fund.id,
    branchId: fund.branchId,
  });
  return (
    <tr>
      <td className="px-4 py-2 text-sm text-gray-900">{fund.name}</td>
      <td className="px-4 py-2 text-sm font-semibold text-indigo-700">
        {loading
          ? "Loading..."
          : error
            ? "Error"
            : `₵${data?.transactionStats?.netBalance?.toLocaleString?.() ?? "0"}`}
      </td>
    </tr>
  );
}
