"use client";

import React from "react";
import SharedModal from "./SharedModal";
import { ModalFormData } from "@/types/finance";
import { useFinanceReferenceData } from "@/graphql/hooks/useFinanceReferenceData";
import { formatDate } from "@/utils/financeHelpers";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalForm: ModalFormData;
  setModalForm: (form: ModalFormData) => void;
  onSubmit: (formData: ModalFormData) => Promise<void>;
  members: any[];
  funds: any[];
  events: any[];
  memberSearch: string;
  setMemberSearch: (search: string) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  submitAttempted: boolean;
  formMessage: { type: "success" | "error" | null; text: string };
  organisationId: string;
  branchId: string;
}

export default function TransactionModal({
  isOpen,
  onClose,
  modalForm,
  setModalForm,
  onSubmit,
  members,
  funds,
  events,
  memberSearch,
  setMemberSearch,
  selectedMemberId,
  setSelectedMemberId,
  submitAttempted,
  formMessage,
  organisationId,
  branchId,
}: TransactionModalProps) {
  const { contributionTypes, paymentMethods } = useFinanceReferenceData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(modalForm);
  };

  const handleInputChange = (field: keyof ModalFormData, value: any) => {
    setModalForm({
      ...modalForm,
      [field]: value,
    });
  };

  const handleMemberSelect = (member: any) => {
    setSelectedMemberId(member.id);
    handleInputChange("memberId", member.id);
    setMemberSearch(`${member.firstName} ${member.lastName}`);
  };

  return (
    <SharedModal
      open={isOpen}
      title="New Transaction"
      onClose={onClose}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Message */}
        {formMessage.type && (
          <div
            className={`p-4 rounded-lg ${
              formMessage.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {formMessage.text}
          </div>
        )}

        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type *
          </label>
          <select
            value={modalForm.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          >
            <option value="">Select Type</option>
            <option value="CONTRIBUTION">Contribution</option>
            <option value="EXPENSE">Expense</option>
            <option value="TRANSFER">Transfer</option>
            <option value="FUND_ALLOCATION">Fund Allocation</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <input
            type="number"
            step="0.01"
            value={modalForm.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="0.00"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={modalForm.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={modalForm.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            rows={3}
            placeholder="Enter transaction description"
            required
          />
        </div>

        {/* Fund Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fund *
          </label>
          <select
            value={modalForm.fundId}
            onChange={(e) => handleInputChange("fundId", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            required
          >
            <option value="">Select Fund</option>
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>

        {/* Member Selection (for contributions) */}
        {modalForm.type === "CONTRIBUTION" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Search for member..."
              />
              {memberSearch.length >= 2 && members.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {members.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleMemberSelect(member)}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.email}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event Selection (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event (Optional)
          </label>
          <select
            value={modalForm.eventId}
            onChange={(e) => handleInputChange("eventId", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title} ({formatDate(event.startDate || event.date)})
              </option>
            ))}
          </select>
        </div>

        {/* Contribution Type (for contributions) */}
        {modalForm.type === "CONTRIBUTION" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Type (Optional)
            </label>
            <select
              value={modalForm.contributionTypeId}
              onChange={(e) =>
                handleInputChange("contributionTypeId", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select Contribution Type</option>
              {contributionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Method (for contributions) */}
        {modalForm.type === "CONTRIBUTION" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method (Optional)
            </label>
            <select
              value={modalForm.paymentMethodId}
              onChange={(e) =>
                handleInputChange("paymentMethodId", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select Payment Method</option>
              {paymentMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference (Optional)
          </label>
          <input
            type="text"
            value={modalForm.reference}
            onChange={(e) => handleInputChange("reference", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Transaction reference"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create Transaction
          </button>
        </div>
      </form>
    </SharedModal>
  );
}
