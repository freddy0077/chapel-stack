"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useExpenseMutations } from "@/graphql/hooks/useExpenseMutations";

const categories = ["Utilities", "Staff Salaries", "Outreach"];
const methods = ["Cash", "Momo", "Bank"];

export default function ExpenseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [method, setMethod] = useState(methods[0]);
  const [description, setDescription] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [date, setDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { createExpense, loading, error } = useExpenseMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      await createExpense({
        variables: {
          input: {
            payee,
            amount: parseFloat(amount),
            category,
            method,
            description,
            date,
            // Receipt upload handling would go here if API supports it
          },
        },
      });
      onClose();
      setPayee(""); setAmount(""); setCategory(categories[0]); setMethod(methods[0]); setDescription(""); setReceipt(null); setDate("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add expense");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-rose-900 mb-6">Add/Edit Expense</h2>
        <form id="expense-form" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Expense Category</label>
            <select className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Amount</label>
            <input type="number" className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Vendor / Payee</label>
            <input type="text" className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" placeholder="Vendor or Payee" value={payee} onChange={e => setPayee(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Payment Method</label>
            <select className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" value={method} onChange={e => setMethod(e.target.value)}>
              {methods.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Description</label>
            <textarea className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Upload Receipt</label>
            <input type="file" className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" onChange={e => setReceipt(e.target.files?.[0] || null)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-rose-500 mb-1">Date</label>
            <input type="date" className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </form>
        {errorMsg && <div className="mt-2 text-sm text-red-500">{errorMsg}</div>}
        {error && <div className="mt-2 text-sm text-red-500">{error.message}</div>}
        <div className="flex gap-3 mt-8">
          <button type="submit" form="expense-form" disabled={loading} className="flex-1 rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 py-2 text-white font-semibold shadow-lg hover:from-rose-600 hover:to-pink-500 transition disabled:opacity-50">
            {loading ? "Saving..." : "Save & Continue"}
          </button>
          <button type="button" disabled={loading} onClick={onClose} className="flex-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 py-2 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
