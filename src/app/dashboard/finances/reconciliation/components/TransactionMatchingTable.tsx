"use client";

import { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Types
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

interface TransactionMatchingTableProps {
  bankTransactions: BankTransaction[];
  churchTransactions: ChurchTransaction[];
  onMatch: (bankTxId: string, churchTxId: string) => void;
  onUnmatch: (bankTxId: string, churchTxId: string) => void;
  onAddNotes: (txId: string, notes: string) => void;
}

// Component
const TransactionMatchingTable: React.FC<TransactionMatchingTableProps> = ({
  bankTransactions,
  churchTransactions,
  onMatch,
  onUnmatch,
  onAddNotes,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBankTx, setSelectedBankTx] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [editingNotesFor, setEditingNotesFor] = useState<string | null>(null);

  // Filter transactions by search term
  const filteredBankTransactions = bankTransactions.filter((tx) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      tx.description.toLowerCase().includes(searchLower) ||
      tx.reference?.toLowerCase().includes(searchLower) ||
      tx.date.includes(searchTerm) ||
      tx.amount.toString().includes(searchTerm)
    );
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status icon
  const getStatusIcon = (isMatched: boolean) => {
    if (isMatched) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    return <QuestionMarkCircleIcon className="h-5 w-5 text-yellow-500" />;
  };

  // Handle transaction selection
  const handleSelectBankTx = (txId: string) => {
    setSelectedBankTx(txId === selectedBankTx ? null : txId);
  };

  // Handle match
  const handleMatch = (bankTxId: string, churchTxId: string) => {
    onMatch(bankTxId, churchTxId);
    setSelectedBankTx(null);
  };

  // Handle unmatch
  const handleUnmatch = (bankTxId: string, churchTxId: string) => {
    onUnmatch(bankTxId, churchTxId);
  };

  // Handle notes editing
  const startEditingNotes = (txId: string, currentNotes?: string) => {
    setEditingNotesFor(txId);
    setNotesInput(currentNotes || "");
  };

  // Save notes
  const saveNotes = () => {
    if (editingNotesFor) {
      onAddNotes(editingNotesFor, notesInput);
      setEditingNotesFor(null);
      setNotesInput("");
    }
  };

  // Find matching church transaction
  const findMatchedChurchTx = (bankTx: BankTransaction) => {
    if (!bankTx.isMatched || !bankTx.matchedToId) return null;
    return churchTransactions.find((tx) => tx.id === bankTx.matchedToId);
  };

  // Get potential matches
  const getPotentialMatches = (bankTx: BankTransaction) => {
    if (bankTx.isMatched) return [];

    // Find church transactions with similar amount and date and not already matched
    return churchTransactions.filter((tx) => {
      // Must not be already matched
      if (tx.isMatched) return false;

      // Amount should match (bank credits match church income, bank debits match church expenses)
      const amountMatches = Math.abs(tx.amount) === Math.abs(bankTx.amount);
      if (!amountMatches) return false;

      // Type should match (bank credit = church income, bank debit = church expense)
      const typeMatches =
        (bankTx.type === "credit" && tx.type === "income") ||
        (bankTx.type === "debit" && tx.type === "expense");
      if (!typeMatches) return false;

      // Dates should be close (within 3 days)
      const bankDate = new Date(bankTx.date).getTime();
      const churchDate = new Date(tx.date).getTime();
      const dayDiff = Math.abs(bankDate - churchDate) / (1000 * 60 * 60 * 24);

      return dayDiff <= 3;
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Bank Transactions
          </h3>
          <div className="relative mt-1 rounded-md shadow-sm max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search transactions..."
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Notes
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBankTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No bank transactions found
                </td>
              </tr>
            ) : (
              filteredBankTransactions.map((transaction) => {
                const matchedChurchTx = findMatchedChurchTx(transaction);

                return (
                  <tr
                    key={transaction.id}
                    className={`hover:bg-gray-50 ${selectedBankTx === transaction.id ? "bg-indigo-50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.isMatched)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
                        {transaction.description}
                      </div>
                      {transaction.reference && (
                        <div className="text-xs text-gray-500 mt-1">
                          Ref: {transaction.reference}
                        </div>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {transaction.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {editingNotesFor === transaction.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Add notes..."
                          />
                          <button
                            type="button"
                            onClick={saveNotes}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center group">
                          <span className="max-w-xs truncate mr-2">
                            {transaction.notes || "No notes"}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              startEditingNotes(
                                transaction.id,
                                transaction.notes,
                              )
                            }
                            className="invisible group-hover:visible p-1 text-gray-400 hover:text-gray-500"
                          >
                            <PencilIcon
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {transaction.isMatched ? (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">
                            Matched to:{" "}
                            {matchedChurchTx?.description || "Unknown"}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleUnmatch(
                                transaction.id,
                                transaction.matchedToId as string,
                              )
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Unmatch
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectBankTx(transaction.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Find Match
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Potential Matches Panel */}
      {selectedBankTx && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Potential Matches
          </h3>

          {(() => {
            const selectedTransaction = bankTransactions.find(
              (tx) => tx.id === selectedBankTx,
            );
            if (!selectedTransaction) return null;

            const potentialMatches = getPotentialMatches(selectedTransaction);

            if (potentialMatches.length === 0) {
              return (
                <div className="text-sm text-gray-500 py-2">
                  No potential matches found.
                  <span className="ml-2 text-indigo-600">
                    You may need to create a corresponding church transaction.
                  </span>
                </div>
              );
            }

            return (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
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
                    {potentialMatches.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate">
                            {tx.description}
                          </div>
                          {tx.reference && (
                            <div className="text-xs text-gray-500 mt-1">
                              Ref: {tx.reference}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.category}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {tx.type === "income" ? "+" : "-"}
                          {formatCurrency(Math.abs(tx.amount))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {tx.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() =>
                              handleMatch(selectedBankTx as string, tx.id)
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Match
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TransactionMatchingTable;
