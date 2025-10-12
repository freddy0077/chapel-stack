"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import SharedModal from "./SharedModal";
import { formatCurrency, formatDate } from "@/utils/financeHelpers";
import { GET_TRANSACTION_AUDIT_HISTORY } from "@/graphql/queries/transactionAuditQueries";
import VoidTransactionModal from "./VoidTransactionModal";

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onVoidSuccess?: () => void;
}

export default function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  onVoidSuccess,
}: TransactionDetailModalProps) {
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [showAuditHistory, setShowAuditHistory] = useState(false);

  const { data: auditData, loading: auditLoading } = useQuery(
    GET_TRANSACTION_AUDIT_HISTORY,
    {
      variables: { transactionId: transaction?.id },
      skip: !transaction?.id || !showAuditHistory,
    }
  );

  if (!transaction) return null;

  const isVoided = transaction.status === "VOIDED";

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CONTRIBUTION":
        return "bg-green-100 text-green-800";
      case "EXPENSE":
        return "bg-red-100 text-red-800";
      case "TRANSFER":
        return "bg-blue-100 text-blue-800";
      case "FUND_ALLOCATION":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SharedModal
      open={isOpen}
      title="Transaction Details"
      onClose={onClose}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Transaction Type Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(transaction.type)}`}
          >
            {transaction.type}
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {transaction.type === "CONTRIBUTION" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        {/* Transaction Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Date
            </label>
            <p className="text-base text-gray-900">
              {formatDate(transaction.date)}
            </p>
          </div>

          {/* Fund */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Fund
            </label>
            <p className="text-base text-gray-900">
              {transaction.fund?.name || "N/A"}
            </p>
          </div>

          {/* Reference */}
          {transaction.reference && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Reference
              </label>
              <p className="text-base text-gray-900">{transaction.reference}</p>
            </div>
          )}

          {/* Member */}
          {transaction.member && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Member
              </label>
              <p className="text-base text-gray-900">
                {transaction.member.firstName} {transaction.member.lastName}
              </p>
            </div>
          )}

          {/* Event */}
          {transaction.event && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Event
              </label>
              <p className="text-base text-gray-900">
                {transaction.event.title}
              </p>
            </div>
          )}

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Created At
            </label>
            <p className="text-base text-gray-900">
              {new Date(transaction.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Description
          </label>
          <p className="text-base text-gray-900 bg-gray-50 rounded-lg p-3">
            {transaction.description || "No description provided"}
          </p>
        </div>

        {/* Metadata */}
        {transaction.metadata && (
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Additional Information
            </label>
            <pre className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3 overflow-auto">
              {JSON.stringify(transaction.metadata, null, 2)}
            </pre>
          </div>
        )}

        {/* Void Information */}
        {isVoided && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Transaction Voided
            </h4>
            <div className="text-sm text-red-700 space-y-1">
              <p>
                <span className="font-medium">Voided by:</span> {transaction.voidedBy}
              </p>
              <p>
                <span className="font-medium">Voided at:</span>{" "}
                {new Date(transaction.voidedAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Reason:</span> {transaction.voidReason}
              </p>
            </div>
          </div>
        )}

        {/* Audit History Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAuditHistory(!showAuditHistory)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showAuditHistory ? "Hide" : "Show"} Audit History
          </button>

          {showAuditHistory && (
            <div className="mt-4 space-y-3">
              {auditLoading ? (
                <p className="text-sm text-gray-500">Loading audit history...</p>
              ) : auditData?.transactionAuditHistory?.length > 0 ? (
                <div className="space-y-3">
                  {auditData.transactionAuditHistory.map((log: any) => (
                    <div
                      key={log.id}
                      className="bg-gray-50 rounded-lg p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {log.action}
                        </span>
                        <span className="text-gray-500">
                          {new Date(log.performedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-600">by {log.performedBy}</p>
                      {log.reason && (
                        <p className="text-gray-600 italic mt-1">
                          Reason: {log.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No audit history available</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div className="flex gap-3">
            {!isVoided && (
              <button
                type="button"
                onClick={() => setShowVoidModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Void Transaction
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>

      {/* Void Modal */}
      <VoidTransactionModal
        isOpen={showVoidModal}
        onClose={() => setShowVoidModal(false)}
        transaction={transaction}
        onSuccess={() => {
          setShowVoidModal(false);
          if (onVoidSuccess) {
            onVoidSuccess();
          } else {
            onClose();
          }
        }}
      />
    </SharedModal>
  );
}
