"use client";

import React, { useState } from "react";
import {
  ArrowLeftIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

// Mock data
const mockBranches = [
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" },
];
const mockFunds = [
  { id: "f1", name: "General Fund" },
  { id: "f2", name: "Building Fund" },
  { id: "f3", name: "Missions Fund" },
  { id: "f4", name: "Youth Ministry Fund" },
  { id: "f5", name: "Benevolence Fund" },
];
const mockMembers = [
  { id: "m1", name: "John Doe" },
  { id: "m2", name: "Jane Smith" },
  { id: "m3", name: "Samuel Lee" },
  { id: "m4", name: "Grace Kim" },
];
const mockCurrentUser = {
  userBranches: [{ branch: { id: "b2", name: "East Side" } }],
};
const mockPaymentMethods = [
  { id: "pm1", name: "Cash" },
  { id: "pm2", name: "Bank Transfer" },
  { id: "pm3", name: "Cheque" },
  { id: "pm4", name: "Mobile Money" },
];
const mockCategories = {
  Income: ["Tithe", "Offering", "Donation", "Fundraiser"],
  Expense: ["Utilities", "Supplies", "Maintenance", "Payroll", "Missions"],
  Transfer: ["Branch Transfer", "Fund Transfer"],
};
const mockVendors = [
  { id: "v1", name: "Power Company" },
  { id: "v2", name: "Office Store" },
  { id: "v3", name: "Cleaning Service" },
];
const mockDonors = mockMembers;

export default function NewTransactionPage() {
  const router = useRouter();
  const [type, setType] = useState<"Income" | "Expense" | "Transfer">("Income");
  const [form, setForm] = useState({
    amount: "",
    branchId: mockCurrentUser.userBranches[0]?.branch.id || "",
    fundId: "",
    category: "",
    paymentMethod: "",
    memberId: "",
    vendorId: "",
    date: "",
    notes: "",
    attachment: undefined as File | undefined,
    transferSource: "",
    transferDestination: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  type TransactionHistoryItem = {
    id: number;
    type: "Income" | "Expense" | "Transfer";
    amount: string;
    branchId: string;
    fundId: string;
    category: string;
    paymentMethod: string;
    memberId: string;
    vendorId: string;
    date: string;
    notes: string;
    attachment?: File;
    attachmentName?: string;
    transferSource: string;
    transferDestination: string;
  };
  const [history, setHistory] = useState<TransactionHistoryItem[]>([]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, attachment: e.target.files[0] });
      setErrors((prev) => ({ ...prev, attachment: "" }));
    }
  }
  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setType(e.target.value as "Income" | "Expense" | "Transfer");
    setForm((f) => ({
      ...f,
      category: "",
      memberId: "",
      vendorId: "",
      transferSource: "",
      transferDestination: "",
    }));
    setErrors({});
  }
  function validate() {
    const errs: { [key: string]: string } = {};
    if (
      !form.amount ||
      isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      errs.amount = "Please enter a valid amount.";
    }
    if (!form.date) errs.date = "Date is required.";
    if (!form.branchId && type !== "Transfer")
      errs.branchId = "Branch is required.";
    if (!form.fundId) errs.fundId = "Fund is required.";
    if (!form.category) errs.category = "Category is required.";
    if (!form.paymentMethod) errs.paymentMethod = "Payment method is required.";
    if (type === "Income" && !form.memberId)
      errs.memberId = "Donor is required.";
    if (type === "Expense" && !form.vendorId)
      errs.vendorId = "Vendor is required.";
    if (type === "Transfer") {
      if (!form.transferSource)
        errs.transferSource = "Source branch is required.";
      if (!form.transferDestination)
        errs.transferDestination = "Destination branch is required.";
      if (
        form.transferSource &&
        form.transferDestination &&
        form.transferSource === form.transferDestination
      ) {
        errs.transferDestination = "Source and destination cannot be the same.";
      }
    }
    return errs;
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setHistory((h) => [
        {
          ...form,
          type,
          id: Date.now(),
          date: form.date,
          attachmentName: form.attachment?.name || undefined,
        },
        ...h,
      ]);
      setForm({
        amount: "",
        branchId: mockCurrentUser.userBranches[0]?.branch.id || "",
        fundId: "",
        category: "",
        paymentMethod: "",
        memberId: "",
        vendorId: "",
        date: "",
        notes: "",
        attachment: undefined,
        transferSource: "",
        transferDestination: "",
      });
      setTimeout(() => setSuccess(false), 1200);
    }, 1200);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl mx-auto">
      {/* Sticky header with back arrow */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-3 shadow-sm">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Back to Finances"
          onClick={() => router.push("/dashboard/finances")}
        >
          <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">New Transaction</h1>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Transaction Type
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={handleTypeChange}
              className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
            >
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
            >
              <option value="">Select Category</option>
              {mockCategories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <div className="text-red-600 text-xs mt-1">{errors.category}</div>
            )}
          </div>
          {/* Payment Method */}
          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
            >
              <option value="">Select Payment Method</option>
              {mockPaymentMethods.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <div className="text-red-600 text-xs mt-1">
                {errors.paymentMethod}
              </div>
            )}
          </div>
          {/* Conditional fields by type */}
          {type === "Income" && (
            <div>
              <label
                htmlFor="memberId"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Donor
              </label>
              <select
                id="memberId"
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
              >
                <option value="">Select Donor</option>
                {mockDonors.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.memberId && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.memberId}
                </div>
              )}
            </div>
          )}
          {type === "Expense" && (
            <div>
              <label
                htmlFor="vendorId"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Vendor
              </label>
              <select
                id="vendorId"
                name="vendorId"
                value={form.vendorId}
                onChange={handleChange}
                className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
              >
                <option value="">Select Vendor</option>
                {mockVendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
              {errors.vendorId && (
                <div className="text-red-600 text-xs mt-1">
                  {errors.vendorId}
                </div>
              )}
            </div>
          )}
          {type === "Transfer" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="transferSource"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Source Branch
                </label>
                <select
                  id="transferSource"
                  name="transferSource"
                  value={form.transferSource}
                  onChange={handleChange}
                  className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
                  <option value="">Select Source Branch</option>
                  {mockBranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {errors.transferSource && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.transferSource}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="transferDestination"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Destination Branch
                </label>
                <select
                  id="transferDestination"
                  name="transferDestination"
                  value={form.transferDestination}
                  onChange={handleChange}
                  className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
                  <option value="">Select Destination Branch</option>
                  {mockBranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {errors.transferDestination && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.transferDestination}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Amount
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                <CurrencyDollarIcon className="h-4 w-4" />
              </span>
              <input
                type="number"
                name="amount"
                id="amount"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={handleChange}
                required
                className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <div className="text-red-600 text-xs mt-1">{errors.amount}</div>
            )}
          </div>
          {/* Branch/Fund */}
          {type !== "Transfer" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="branchId"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Branch
                </label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    <BuildingOfficeIcon className="h-4 w-4" />
                  </span>
                  <select
                    name="branchId"
                    id="branchId"
                    value={form.branchId}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                  >
                    <option value="">Select Branch</option>
                    {mockBranches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.branchId && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.branchId}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="fundId"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Fund
                </label>
                <div className="flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    <CurrencyDollarIcon className="h-4 w-4" />
                  </span>
                  <select
                    name="fundId"
                    id="fundId"
                    value={form.fundId}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                  >
                    <option value="">Select Fund</option>
                    {mockFunds.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.fundId && (
                  <div className="text-red-600 text-xs mt-1">
                    {errors.fundId}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Date
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                <CalendarIcon className="h-4 w-4" />
              </span>
              <input
                type="date"
                name="date"
                id="date"
                value={form.date}
                onChange={handleChange}
                required
                className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
              />
            </div>
            {errors.date && (
              <div className="text-red-600 text-xs mt-1">{errors.date}</div>
            )}
          </div>
          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Notes
            </label>
            <div className="flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                <PencilSquareIcon className="h-4 w-4" />
              </span>
              <textarea
                name="notes"
                id="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                placeholder="Add any notes (optional)"
              />
            </div>
          </div>
          {/* Attachment */}
          <div>
            <label
              htmlFor="attachment"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Attachment (Receipt/Document)
            </label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {errors.attachment && (
              <div className="text-red-600 text-xs mt-1">
                {errors.attachment}
              </div>
            )}
            {form.attachment && (
              <div className="text-xs text-gray-500 mt-1">
                Selected: {form.attachment.name}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
            >
              {submitting ? "Saving..." : "Create Transaction"}
            </button>
          </div>
          {success && (
            <div className="text-green-700 text-center font-medium">
              Transaction created!
            </div>
          )}
        </form>
        {/* Transaction History (Audit Trail) */}
        <div className="p-6 border-t mt-8">
          <h2 className="text-lg font-semibold text-indigo-800 mb-4">
            Transaction History (Audit Trail)
          </h2>
          {history.length === 0 ? (
            <div className="text-gray-500 text-sm">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-indigo-100">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Branch
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Fund
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                      Attachment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-indigo-50">
                  {history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-indigo-50/50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {tx.date}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {tx.type}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {tx.category}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {tx.amount}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {tx.type === "Transfer"
                          ? `${mockBranches.find((b) => b.id === tx.transferSource)?.name || "-"} → ${mockBranches.find((b) => b.id === tx.transferDestination)?.name || "-"}`
                          : mockBranches.find((b) => b.id === tx.branchId)
                              ?.name || "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {mockFunds.find((f) => f.id === tx.fundId)?.name || "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {mockPaymentMethods.find(
                          (pm) => pm.id === tx.paymentMethod,
                        )?.name || "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                        {tx.attachmentName || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
