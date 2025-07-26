"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useExpenseReferenceData } from "../../../../../graphql/hooks/useExpenseReferenceData";
import { useExpenseMutations } from "../../../../../graphql/hooks/useExpenseMutations";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useBudgetReferenceData } from "../../../../../graphql/hooks/useBudgetReferenceData";
import { useFinanceReferenceData } from "../../../../../graphql/hooks/useFinanceReferenceData";
import {
  CurrencyDollarIcon,
  TagIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

export default function NewExpense() {
  const { user } = useAuth();
  const branchId =
    user?.userBranches && user.userBranches.length > 0
      ? user.userBranches[0].branch.id
      : undefined;

  const { categories, paymentMethods, departments, loading: referenceLoading } =
    useExpenseReferenceData(branchId) as {
      categories: { id: string; name: string }[];
      paymentMethods: { id: string; name: string }[];
      departments: { id: string; name: string }[];
      loading: boolean;
    };

  const { funds, loading: fundsLoading } = useFinanceReferenceData(branchId);
  const { budgets, loading: budgetsLoading } = useBudgetReferenceData(branchId);
  const { createExpense, loading: mutationLoading } = useExpenseMutations();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [expenseData, setExpenseData] = useState({
    amount: "",
    description: "",
    category: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    department: "",
    vendor: "",
    receiptAvailable: true,
    recurring: false,
    frequency: "monthly",
    approvedBy: "",
    notes: "",
    budgeted: true,
    reimbursable: false,
    reimburseTo: "",
    // New required fields
    receiptNumber: "",
    invoiceNumber: "",
    fundId: "",
    vendorId: "",
    vendorName: "",
    vendorContact: "",
    budgetId: "",
  });

  useEffect(() => {
    if (!referenceLoading) {
      setExpenseData((prev) => ({
        ...prev,
        category: prev.category || categories[0]?.name || "",
        paymentMethod: prev.paymentMethod || paymentMethods[0]?.name || "",
        department: prev.department || departments[0]?.name || "",
      }));
    }
  }, [referenceLoading, categories, paymentMethods, departments]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setExpenseData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setExpenseData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const selectedCategory = categories.find(
        (c) => c.name === expenseData.category
      );
      const selectedPaymentMethod = paymentMethods.find(
        (m) => m.name === expenseData.paymentMethod
      );
      const selectedDepartment = departments.find(
        (d) => d.name === expenseData.department
      );
      const input = {
        amount: parseFloat(expenseData.amount),
        description: expenseData.description,
        date: expenseData.date,
        notes: expenseData.notes,
        categoryId: selectedCategory ? selectedCategory.id : undefined,
        paymentMethodId: selectedPaymentMethod
          ? selectedPaymentMethod.id
          : undefined,
        departmentId: selectedDepartment ? selectedDepartment.id : undefined,
        vendor: expenseData.vendor,
        receiptAvailable: expenseData.receiptAvailable,
        recurring: expenseData.recurring,
        frequency: expenseData.recurring ? expenseData.frequency : undefined,
        approvedBy: expenseData.approvedBy,
        budgeted: expenseData.budgeted,
        reimbursable: expenseData.reimbursable,
        reimburseTo: expenseData.reimbursable
          ? expenseData.reimburseTo
          : undefined,
        branchId,
        // New required fields for mutation
        receiptNumber: expenseData.receiptNumber,
        invoiceNumber: expenseData.invoiceNumber,
        fundId: expenseData.fundId,
        vendorId: expenseData.vendorId,
        vendorName: expenseData.vendorName,
        vendorContact: expenseData.vendorContact,
        budgetId: expenseData.budgetId,
      };
      const response = await createExpense({ variables: { input } });
      if (response.errors) {
        setErrorMsg("Failed to record expense.");
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/finances");
        }, 2000);
      }
    } catch (error) {
      setErrorMsg("Error submitting expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon
              className="h-6 w-6 text-green-600"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">
            Expense Recorded Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            The expense has been successfully recorded in the system.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => router.push("/dashboard/finances")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Finance Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      {/* Sticky header with navigation */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-2 shadow-sm">
        <Link
          href="/dashboard/finances"
          className="mr-2 rounded-md bg-white p-1 text-gray-400 hover:text-gray-500"
        >
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Record New Expense</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Expense Details Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 shadow-sm border border-indigo-100 mb-6">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
              Expense Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-indigo-800 mb-1">Amount <span className="text-red-500">*</span></label>
                <input type="number" name="amount" id="amount" min="0.01" step="0.01" required value={expenseData.amount} onChange={handleInputChange} className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" placeholder="0.00" />
              </div>
              {/* Date Paid */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-indigo-800 mb-1">Date Paid <span className="text-red-500">*</span></label>
                <input type="date" name="date" id="date" required value={expenseData.date} onChange={handleInputChange} className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-indigo-800 mb-1">Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  required
                  value={expenseData.description}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Brief description of expense"
                />
              </div>
              {/* Receipt Number */}
              <div>
                <label htmlFor="receiptNumber" className="block text-sm font-medium text-indigo-800 mb-1">Receipt Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="receiptNumber"
                  id="receiptNumber"
                  required
                  value={expenseData.receiptNumber}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Receipt Number"
                />
              </div>
              {/* Invoice Number */}
              <div>
                <label htmlFor="invoiceNumber" className="block text-sm font-medium text-indigo-800 mb-1">Invoice Number <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="invoiceNumber"
                  id="invoiceNumber"
                  required
                  value={expenseData.invoiceNumber}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Invoice Number"
                />
              </div>
              {/* Fund Dropdown */}
              <div>
                <label htmlFor="fundId" className="block text-sm font-medium text-indigo-800 mb-1">Fund <span className="text-red-500">*</span></label>
                {fundsLoading ? (
                  <div className="text-gray-400 text-sm">Loading funds...</div>
                ) : (
                  <select
                    id="fundId"
                    name="fundId"
                    value={expenseData.fundId}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="">Select Fund</option>
                    {funds && funds.length > 0 && funds.map((fund: any) => (
                      <option key={fund.id} value={fund.id}>{fund.name}</option>
                    ))}
                  </select>
                )}
              </div>
              {/* Budget Dropdown */}
              <div>
                <label htmlFor="budgetId" className="block text-sm font-medium text-indigo-800 mb-1">Budget <span className="text-red-500">*</span></label>
                {budgetsLoading ? (
                  <div className="text-gray-400 text-sm">Loading budgets...</div>
                ) : (
                  <select
                    id="budgetId"
                    name="budgetId"
                    value={expenseData.budgetId}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="">Select Budget</option>
                    {budgets && budgets.length > 0 && budgets.map((budget: any) => (
                      <option key={budget.id} value={budget.id}>{budget.name} ({budget.fiscalYear})</option>
                    ))}
                  </select>
                )}
              </div>
              {/* Vendor ID */}
              <div>
                <label htmlFor="vendorId" className="block text-sm font-medium text-indigo-800 mb-1">Vendor ID</label>
                <input
                  type="text"
                  name="vendorId"
                  id="vendorId"
                  value={expenseData.vendorId}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Vendor ID"
                />
              </div>
              {/* Vendor Name */}
              <div>
                <label htmlFor="vendorName" className="block text-sm font-medium text-indigo-800 mb-1">Vendor Name</label>
                <input
                  type="text"
                  name="vendorName"
                  id="vendorName"
                  value={expenseData.vendorName}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Vendor Name"
                />
              </div>
              {/* Vendor Contact */}
              <div>
                <label htmlFor="vendorContact" className="block text-sm font-medium text-indigo-800 mb-1">Vendor Contact</label>
                <input
                  type="text"
                  name="vendorContact"
                  id="vendorContact"
                  value={expenseData.vendorContact}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Vendor Contact"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-indigo-800 mb-1">Category <span className="text-red-500">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={expenseData.category}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  {categories && categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-indigo-800 mb-1">Department <span className="text-red-500">*</span></label>
                <select
                  id="department"
                  name="department"
                  value={expenseData.department}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  {departments && departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              {/* Payment Method */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-indigo-800 mb-1">Payment Method <span className="text-red-500">*</span></label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={expenseData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                >
                  {paymentMethods && paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.name}>{pm.name}</option>
                  ))}
                </select>
              </div>
              {/* Vendor (free text) */}
              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-indigo-800 mb-1">Vendor</label>
                <input
                  type="text"
                  name="vendor"
                  id="vendor"
                  value={expenseData.vendor}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Vendor Name"
                />
              </div>
              {/* Receipt Available */}
              <div className="flex items-center mt-2">
                <input
                  id="receiptAvailable"
                  name="receiptAvailable"
                  type="checkbox"
                  checked={expenseData.receiptAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="receiptAvailable" className="ml-2 block text-sm text-indigo-800">Receipt Available</label>
              </div>
              {/* Recurring */}
              <div className="flex items-center mt-2">
                <input
                  id="recurring"
                  name="recurring"
                  type="checkbox"
                  checked={expenseData.recurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="recurring" className="ml-2 block text-sm text-indigo-800">Recurring</label>
              </div>
              {/* Frequency (show if recurring) */}
              {expenseData.recurring && (
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-indigo-800 mb-1">Frequency</label>
                  <select
                    id="frequency"
                    name="frequency"
                    value={expenseData.frequency}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
              {/* Approved By */}
              <div>
                <label htmlFor="approvedBy" className="block text-sm font-medium text-indigo-800 mb-1">Approved By</label>
                <input
                  type="text"
                  name="approvedBy"
                  id="approvedBy"
                  value={expenseData.approvedBy}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Approver Name"
                />
              </div>
              {/* Notes */}
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-indigo-800 mb-1">Notes</label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={2}
                  value={expenseData.notes}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  placeholder="Additional notes (optional)"
                />
              </div>
              {/* Budgeted */}
              <div className="flex items-center mt-2">
                <input
                  id="budgeted"
                  name="budgeted"
                  type="checkbox"
                  checked={expenseData.budgeted}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="budgeted" className="ml-2 block text-sm text-indigo-800">Budgeted</label>
              </div>
              {/* Reimbursable */}
              <div className="flex items-center mt-2">
                <input
                  id="reimbursable"
                  name="reimbursable"
                  type="checkbox"
                  checked={expenseData.reimbursable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="reimbursable" className="ml-2 block text-sm text-indigo-800">Reimbursable</label>
              </div>
              {/* Reimburse To (show if reimbursable) */}
              {expenseData.reimbursable && (
                <div>
                  <label htmlFor="reimburseTo" className="block text-sm font-medium text-indigo-800 mb-1">Reimburse To</label>
                  <input
                    type="text"
                    name="reimburseTo"
                    id="reimburseTo"
                    value={expenseData.reimburseTo}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="Person to reimburse"
                  />
                </div>
              )}

              {/* Form Action Buttons */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => router.push("/dashboard/finances")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || mutationLoading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || mutationLoading ? "Submitting..." : "Submit Expense"}
                </button>
              </div>
            </div>
          </div>
          {/* ... (rest of your form: Additional Information, buttons, etc.) */}
        </form>
      </div>
    </div>
  );
}