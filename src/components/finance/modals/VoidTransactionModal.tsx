"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { VOID_TRANSACTION } from "@/graphql/mutations/transactionAuditMutations";
import SharedModal from "./SharedModal";
import { formatCurrency, formatDate } from "@/utils/financeHelpers";

interface VoidTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onSuccess?: () => void;
}

export default function VoidTransactionModal({
  isOpen,
  onClose,
  transaction,
  onSuccess,
}: VoidTransactionModalProps) {
  const [voidReason, setVoidReason] = useState("");
  const [createReversal, setCreateReversal] = useState(true);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const [voidTransaction, { loading }] = useMutation(VOID_TRANSACTION, {
    refetchQueries: ['GetTransactions', 'TransactionStats'],
    awaitRefetchQueries: true,
  });

  const handleVoid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (confirmText !== "VOID") {
      setError("Please type VOID to confirm");
      return;
    }

    if (!voidReason.trim()) {
      setError("Please provide a reason for voiding this transaction");
      return;
    }

    try {
      console.log('Voiding transaction:', {
        transactionId: transaction.id,
        reason: voidReason,
        createReversal,
      });

      const result = await voidTransaction({
        variables: {
          input: {
            transactionId: transaction.id,
            reason: voidReason,
            createReversal,
          },
        },
      });

      console.log('Void transaction result:', result);

      // Success
      alert('Transaction voided successfully!');
      if (onSuccess) onSuccess();
      onClose();
      
      // Reset form
      setVoidReason("");
      setConfirmText("");
      setCreateReversal(true);
    } catch (err: any) {
      console.error('Void transaction error:', err);
      setError(err.message || "Failed to void transaction");
    }
  };

  const handleClose = () => {
    setVoidReason("");
    setConfirmText("");
    setCreateReversal(true);
    setError("");
    onClose();
  };

  if (!transaction) return null;

  return (
    <SharedModal
      open={isOpen}
      title="Void Transaction"
      onClose={handleClose}
      maxWidth="lg"
    >
      <form onSubmit={handleVoid} className="space-y-6">
        {/* Warning Alert */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Warning: This action cannot be undone
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This will void the transaction and
                  {createReversal && " create a reversal entry"}.
                  The transaction will remain in the system for audit purposes
                  but will be marked as voided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Transaction Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-900">Transaction Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="ml-2 font-medium text-gray-900">
                {transaction.type}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Amount:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="ml-2 font-medium text-gray-900">
                {formatDate(transaction.date)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Fund:</span>
              <span className="ml-2 font-medium text-gray-900">
                {transaction.fund?.name || "N/A"}
              </span>
            </div>
          </div>
          <div>
            <span className="text-gray-500">Description:</span>
            <p className="mt-1 text-gray-900">{transaction.description}</p>
          </div>
        </div>

        {/* Reversal Option */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="createReversal"
              type="checkbox"
              checked={createReversal}
              onChange={(e) => setCreateReversal(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="createReversal" className="font-medium text-gray-700">
              Create reversal transaction
            </label>
            <p className="text-gray-500">
              Recommended: Creates a negative transaction to balance the books
              and maintain accurate financial records.
            </p>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="voidReason"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for Voiding *
          </label>
          <textarea
            id="voidReason"
            value={voidReason}
            onChange={(e) => setVoidReason(e.target.value)}
            rows={3}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="Explain why this transaction is being voided (e.g., entered in error, duplicate entry, etc.)"
          />
        </div>

        {/* Confirmation */}
        <div>
          <label
            htmlFor="confirmText"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Type <span className="font-bold text-red-600">VOID</span> to confirm *
          </label>
          <input
            id="confirmText"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="VOID"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !voidReason || confirmText !== "VOID"}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Voiding..." : "Void Transaction"}
          </button>
        </div>
      </form>
    </SharedModal>
  );
}
