"use client";

import { useState } from "react";
import { XMarkIcon, WalletIcon } from "@heroicons/react/24/outline";

export default function AddBudgetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Budget name is required");
      return;
    }
    if (!amount.trim() || isNaN(Number(amount))) {
      setError("Valid budget amount is required");
      return;
    }
    // Here you would call the mutation to add the budget
    onClose();
    setName(""); setAmount(""); setPeriod("Monthly"); setNotes("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <WalletIcon className="h-7 w-7 text-indigo-500" />
          <h2 className="text-xl font-bold text-indigo-900">Add Budget</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Budget Name</label>
            <input type="text" className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" placeholder="e.g. Missions Fund" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Amount</label>
            <input type="number" className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" placeholder="e.g. 5000" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Period</label>
            <select className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" value={period} onChange={e => setPeriod(e.target.value)}>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Notes</label>
            <textarea className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" placeholder="Optional" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </form>
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 mt-8">
          <button type="submit" form="add-budget-form" className="flex-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 py-2 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-500 transition">Add Budget</button>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 py-2 text-white font-semibold shadow-lg hover:from-gray-500 hover:to-gray-700 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
