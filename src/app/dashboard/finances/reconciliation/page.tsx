"use client";

import React, { useState } from "react";
import {
  BuildingOfficeIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Mock Data Types
interface Branch {
  id: string;
  name: string;
}
interface BankAccount {
  id: string;
  branchId: string;
  name: string;
  accountNumber: string;
  bankName: string;
  currentBalance: number;
}
interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  isMatched: boolean;
  matchedToId?: string;
  reference?: string;
  notes?: string;
}
interface ChurchTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  isMatched: boolean;
  matchedToId?: string;
  branchId: string;
  reference?: string;
}
interface ReconciliationSummary {
  totalBankTransactions: number;
  matchedTransactions: number;
  unmatchedTransactions: number;
  totalAmount: number;
  matchedAmount: number;
  unmatchedAmount: number;
}

// Mock Data
const mockBranches: Branch[] = [
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" },
];
const mockBankAccounts: BankAccount[] = [
  {
    id: "ba1",
    branchId: "b1",
    name: "Main Operating Account",
    accountNumber: "****1234",
    bankName: "First National Bank",
    currentBalance: 58750.25,
  },
  {
    id: "ba2",
    branchId: "b1",
    name: "Building Fund",
    accountNumber: "****5678",
    bankName: "First National Bank",
    currentBalance: 125430.15,
  },
  {
    id: "ba3",
    branchId: "b2",
    name: "East Side Operating",
    accountNumber: "****9012",
    bankName: "Community Credit Union",
    currentBalance: 25430.15,
  },
  {
    id: "ba4",
    branchId: "b3",
    name: "West End Operating",
    accountNumber: "****3456",
    bankName: "First National Bank",
    currentBalance: 18925.75,
  },
  {
    id: "ba5",
    branchId: "b4",
    name: "South Chapel Operating",
    accountNumber: "****7890",
    bankName: "Community Credit Union",
    currentBalance: 12450.8,
  },
];
const generateMockBankTransactions = (accountId: string): BankTransaction[] => {
  const transactions: BankTransaction[] = [
    {
      id: `${accountId}-btx-1`,
      date: "2025-04-05",
      description: "Deposit - Sunday offering",
      amount: 3750.5,
      type: "credit",
      isMatched: true,
      matchedToId: `${accountId}-ctx-1`,
      reference: "REF-1234",
    },
    {
      id: `${accountId}-btx-2`,
      date: "2025-04-06",
      description: "ACH Payment - Utility Bill",
      amount: 825.42,
      type: "debit",
      isMatched: true,
      matchedToId: `${accountId}-ctx-2`,
      reference: "REF-5678",
    },
    {
      id: `${accountId}-btx-3`,
      date: "2025-04-07",
      description: "Deposit - Youth fundraiser",
      amount: 1250.0,
      type: "credit",
      isMatched: true,
      matchedToId: `${accountId}-ctx-3`,
      reference: "REF-9012",
    },
    {
      id: `${accountId}-btx-4`,
      date: "2025-04-08",
      description: "ACH Deposit - Online Donation",
      amount: 500.0,
      type: "credit",
      isMatched: false,
      reference: "REF-3456",
    },
    {
      id: `${accountId}-btx-5`,
      date: "2025-04-08",
      description: "Check #1234 - Office Supplies",
      amount: 125.38,
      type: "debit",
      isMatched: false,
      reference: "REF-7890",
    },
  ];
  return transactions;
};
const generateMockChurchTransactions = (
  accountId: string,
  branchId: string,
): ChurchTransaction[] => {
  const transactions: ChurchTransaction[] = [
    {
      id: `${accountId}-ctx-1`,
      date: "2025-04-05",
      description: "Sunday morning offering",
      amount: 3750.5,
      category: "Tithes & Offerings",
      type: "income",
      isMatched: true,
      matchedToId: `${accountId}-btx-1`,
      branchId,
      reference: "REF-C-1234",
    },
    {
      id: `${accountId}-ctx-2`,
      date: "2025-04-06",
      description: "Monthly utilities payment",
      amount: 825.42,
      category: "Utilities",
      type: "expense",
      isMatched: true,
      matchedToId: `${accountId}-btx-2`,
      branchId,
      reference: "REF-C-5678",
    },
    {
      id: `${accountId}-ctx-3`,
      date: "2025-04-07",
      description: "Youth ministry fundraiser",
      amount: 1250.0,
      category: "Youth Ministry",
      type: "income",
      isMatched: true,
      matchedToId: `${accountId}-btx-3`,
      branchId,
      reference: "REF-C-9012",
    },
    {
      id: `${accountId}-ctx-4`,
      date: "2025-04-08",
      description: "Special missions offering",
      amount: 750.0,
      category: "Missions",
      type: "income",
      isMatched: false,
      branchId,
      reference: "REF-C-3456",
    },
    {
      id: `${accountId}-ctx-5`,
      date: "2025-04-08",
      description: "Children's ministry supplies",
      amount: 175.25,
      category: "Children's Ministry",
      type: "expense",
      isMatched: false,
      branchId,
      reference: "REF-C-7890",
    },
  ];
  return transactions;
};

export default function BankReconciliationPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(
    [],
  );
  const [churchTransactions, setChurchTransactions] = useState<
    ChurchTransaction[]
  >([]);

  // Filter accounts by branch
  const availableAccounts = selectedBranch
    ? mockBankAccounts.filter((account) => account.branchId === selectedBranch)
    : [];

  // Load transactions for selected account
  const loadTransactions = () => {
    if (!selectedAccount) return;
    const account = mockBankAccounts.find((acc) => acc.id === selectedAccount);
    if (!account) return;
    setBankTransactions(generateMockBankTransactions(selectedAccount));
    setChurchTransactions(
      generateMockChurchTransactions(selectedAccount, account.branchId),
    );
  };

  // Handle branch selection
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
    setSelectedAccount("");
    setBankTransactions([]);
    setChurchTransactions([]);
  };
  // Handle account selection
  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    setBankTransactions([]);
    setChurchTransactions([]);
  };

  // Match transactions
  const handleMatchTransactions = (bankTxId: string, churchTxId: string) => {
    setBankTransactions((prev) =>
      prev.map((tx) =>
        tx.id === bankTxId
          ? { ...tx, isMatched: true, matchedToId: churchTxId }
          : tx,
      ),
    );
    setChurchTransactions((prev) =>
      prev.map((tx) =>
        tx.id === churchTxId
          ? { ...tx, isMatched: true, matchedToId: bankTxId }
          : tx,
      ),
    );
  };
  // Unmatch transactions
  const handleUnmatchTransactions = (bankTxId: string, churchTxId: string) => {
    setBankTransactions((prev) =>
      prev.map((tx) =>
        tx.id === bankTxId
          ? { ...tx, isMatched: false, matchedToId: undefined }
          : tx,
      ),
    );
    setChurchTransactions((prev) =>
      prev.map((tx) =>
        tx.id === churchTxId
          ? { ...tx, isMatched: false, matchedToId: undefined }
          : tx,
      ),
    );
  };
  // Add notes
  const handleAddNotes = (txId: string, notes: string) => {
    setBankTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, notes } : tx)),
    );
  };

  // Summary
  const calculateSummary = (): ReconciliationSummary => {
    const totalBankTransactions = bankTransactions.length;
    const matchedTransactions = bankTransactions.filter(
      (tx) => tx.isMatched,
    ).length;
    const unmatchedTransactions = totalBankTransactions - matchedTransactions;
    const totalAmount = bankTransactions.reduce(
      (sum, tx) => sum + (tx.type === "credit" ? tx.amount : -tx.amount),
      0,
    );
    const matchedAmount = bankTransactions
      .filter((tx) => tx.isMatched)
      .reduce(
        (sum, tx) => sum + (tx.type === "credit" ? tx.amount : -tx.amount),
        0,
      );
    const unmatchedAmount = totalAmount - matchedAmount;
    return {
      totalBankTransactions,
      matchedTransactions,
      unmatchedTransactions,
      totalAmount,
      matchedAmount,
      unmatchedAmount,
    };
  };
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  const currentAccount = selectedAccount
    ? mockBankAccounts.find((acc) => acc.id === selectedAccount)
    : null;
  const summary = bankTransactions.length > 0 ? calculateSummary() : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Sticky header with navigation */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-2 shadow-sm">
        <a
          href="/dashboard/finances"
          className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
        >
          <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
        </a>
        <h1 className="text-2xl font-bold text-gray-900">
          Bank Reconciliation
        </h1>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="p-6">
          {/* Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label
                htmlFor="branch-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Branch
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <BuildingOfficeIcon className="h-4 w-4" />
                </span>
                <select
                  id="branch-select"
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
                  <option value="">Select Branch</option>
                  {mockBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="account-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Bank Account
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <BanknotesIcon className="h-4 w-4" />
                </span>
                <select
                  id="account-select"
                  value={selectedAccount}
                  onChange={(e) => handleAccountChange(e.target.value)}
                  disabled={!selectedBranch}
                  className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Account</option>
                  {availableAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - {account.bankName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={loadTransactions}
                disabled={!selectedAccount}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                Load Transactions
              </button>
            </div>
          </div>
          {/* Account Info */}
          {currentAccount && (
            <div className="bg-white shadow rounded-xl p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Name
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {currentAccount.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bank</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {currentAccount.bankName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Number
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {currentAccount.accountNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Current Balance
                  </p>
                  <p className="mt-1 text-base font-semibold text-gray-900">
                    {formatCurrency(currentAccount.currentBalance)}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Reconciliation Summary */}
          {summary && (
            <div className="bg-white shadow rounded-xl p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Reconciliation Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Transaction Status
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {summary.totalBankTransactions}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-700">Matched</p>
                      <p className="text-xl font-semibold text-green-800">
                        {summary.matchedTransactions}
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-700">Unmatched</p>
                      <p className="text-xl font-semibold text-yellow-800">
                        {summary.unmatchedTransactions}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Amount Status
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {formatCurrency(summary.totalAmount)}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-700">Matched</p>
                      <p className="text-xl font-semibold text-green-800">
                        {formatCurrency(summary.matchedAmount)}
                      </p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-700">Unmatched</p>
                      <p className="text-xl font-semibold text-yellow-800">
                        {formatCurrency(summary.unmatchedAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center">
                  {summary.unmatchedTransactions === 0 ? (
                    <>
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                      <span className="text-green-700 font-medium">
                        All transactions are matched!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="h-6 w-6 text-yellow-500 mr-2" />
                      <span className="text-yellow-700 font-medium">
                        {summary.unmatchedTransactions} transaction
                        {summary.unmatchedTransactions !== 1 ? "s" : ""} still
                        need{summary.unmatchedTransactions === 1 ? "s" : ""} to
                        be matched.
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Transaction Matching Table */}
          {bankTransactions.length > 0 && (
            <div className="mb-6">
              {/* Replace this with your actual matching table component */}
              <div className="bg-white rounded-xl shadow p-4">
                <p className="font-medium text-indigo-700 mb-2">
                  Transaction Matching Table Placeholder
                </p>
                <p className="text-gray-500 text-sm">
                  Integrate your TransactionMatchingTable component here for
                  full functionality.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
