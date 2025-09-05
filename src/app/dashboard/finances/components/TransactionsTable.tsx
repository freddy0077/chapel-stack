"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { Badge, Select, SelectItem } from "@tremor/react";

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: string;
  date: string;
  donor?: string;
  vendor?: string;
  status?: string;
  branchId?: string;
}

interface BranchInfo {
  id: string;
  name: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  branches: BranchInfo[];
}

const TransactionsTable = ({
  transactions,
  branches,
}: TransactionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  // Handle branch filter change
  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
  };

  // Handle sort change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      // Filter by type
      if (filter !== "all" && transaction.type.toLowerCase() !== filter) {
        return false;
      }

      // Filter by branch
      if (selectedBranch !== "all" && transaction.branchId !== selectedBranch) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.category.toLowerCase().includes(query) ||
          transaction.amount.toLowerCase().includes(query) ||
          transaction.date.toLowerCase().includes(query) ||
          (transaction.donor &&
            transaction.donor.toLowerCase().includes(query)) ||
          (transaction.vendor &&
            transaction.vendor.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort logic
      if (sortBy === "amount") {
        const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ""));
        const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g, ""));
        return sortDirection === "asc" ? amountA - amountB : amountB - amountA;
      } else if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        // Default string comparison
        const valA = a[sortBy as keyof Transaction]?.toString() || "";
        const valB = b[sortBy as keyof Transaction]?.toString() || "";
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
    });

  // Getter for transaction status badge color
  const getStatusColor = (type: string) => {
    return type === "Income" ? "emerald" : "rose";
  };

  // Getter for branch name
  const getBranchName = (branchId?: string) => {
    if (!branchId) return "Main Branch";

    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="p-6 border-b border-indigo-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <ArrowsUpDownIcon className="h-5 w-5 text-indigo-400" /> Recent
            Transactions
          </h2>
          {/* FILTERS: visually distinct, modern, and UX-focused */}
          <form className="flex gap-3 flex-wrap items-end w-full sm:w-auto bg-gradient-to-br from-indigo-50/60 to-white/80 rounded-2xl px-4 py-3 shadow-lg border border-indigo-100 backdrop-blur-xl">
            {/* Search input */}
            <div className="flex flex-col w-full sm:w-56">
              <label
                className="text-xs font-semibold text-indigo-500 mb-1 ml-1"
                htmlFor="transaction-search"
              >
                Search
              </label>
              <div className="relative">
                <input
                  id="transaction-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, category, amount..."
                  className="block w-full rounded-xl border-0 py-2 pl-12 pr-4 text-indigo-900 bg-white/80 shadow ring-2 ring-inset ring-indigo-100 placeholder:text-indigo-300 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6 transition-all duration-200 focus:bg-white"
                  aria-label="Search transactions"
                />
                <MagnifyingGlassIcon
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-300 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
            {/* Type filter chip group */}
            <div className="flex flex-col w-full sm:w-auto">
              <label
                htmlFor="transaction-type-filter"
                className="text-xs font-semibold text-indigo-500 mb-1 ml-1"
              >
                Type
              </label>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleFilterChange(opt.value)}
                    className={`px-4 py-1.5 rounded-full border text-xs font-semibold shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${filter === opt.value ? "bg-gradient-to-r from-indigo-500 to-purple-400 text-white border-indigo-500 shadow-lg" : "bg-white/80 text-indigo-700 border-indigo-200 hover:bg-indigo-50"}`}
                    aria-pressed={filter === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Branch filter */}
            <div className="flex flex-col w-full sm:w-44">
              <label
                htmlFor="transaction-branch-filter"
                className="text-xs font-semibold text-indigo-500 mb-1 ml-1"
              >
                Branch
              </label>
              <select
                id="transaction-branch-filter"
                className="block w-full rounded-xl border-0 py-2 pl-4 pr-8 text-indigo-900 bg-white/80 shadow ring-2 ring-inset ring-indigo-100 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm transition-all duration-200"
                value={selectedBranch}
                onChange={(e) => handleBranchChange(e.target.value)}
              >
                <option value="all">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-50 to-white py-2 px-5 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-indigo-100 border border-indigo-100 transition mt-2 sm:mt-6"
              tabIndex={0}
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              Export
            </button>
          </form>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-indigo-100">
          <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {sortBy === "date" && (
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                    />
                  )}
                  {sortBy !== "date" && (
                    <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-indigo-200" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  <span>Type</span>
                  {sortBy === "type" && (
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                    />
                  )}
                  {sortBy !== "type" && (
                    <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-indigo-200" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {sortBy === "category" && (
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                    />
                  )}
                  {sortBy !== "category" && (
                    <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-indigo-200" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition"
                onClick={() => handleSort("branchId")}
              >
                <div className="flex items-center">
                  <span>Branch</span>
                  {sortBy === "branchId" && (
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                    />
                  )}
                  {sortBy !== "branchId" && (
                    <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-indigo-200" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 transition"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  {sortBy === "amount" && (
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                    />
                  )}
                  {sortBy !== "amount" && (
                    <ArrowsUpDownIcon className="ml-1 h-4 w-4 text-indigo-200" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-indigo-400 uppercase tracking-wider"
              >
                Source/Recipient
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/70 divide-y divide-indigo-50">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-indigo-400"
                >
                  No transactions found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-indigo-50/60 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700 font-semibold">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      color={getStatusColor(transaction.type)}
                      size="sm"
                      className={`rounded-full px-3 py-1 text-xs font-bold shadow ${transaction.type === "Income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                    >
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-900 font-bold">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">
                    {getBranchName(transaction.branchId)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-extrabold ${transaction.type === "Income" ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-700">
                    {transaction.donor || transaction.vendor || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-indigo-700">
            Showing{" "}
            <span className="font-bold">{filteredTransactions.length}</span>{" "}
            transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium text-indigo-700 bg-white/80 border border-indigo-100 shadow hover:bg-indigo-50 transition">
            Previous
          </button>
          <button className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium text-indigo-700 bg-white/80 border border-indigo-100 shadow hover:bg-indigo-50 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
