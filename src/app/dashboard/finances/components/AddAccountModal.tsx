"use client";

import { useState } from "react";
import { XMarkIcon, BanknotesIcon } from "@heroicons/react/24/outline";

const accountTypes = ["Cash", "Bank", "Mobile Money", "Other"];

export default function AddAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState(accountTypes[0]);
  const [balance, setBalance] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Account name is required");
      return;
    }
    if (!balance.trim() || isNaN(Number(balance))) {
      setError("Valid starting balance is required");
      return;
    }
    // Here you would call the mutation to add the account
    onClose();
    setName(""); setType(accountTypes[0]); setBalance(""); setNotes("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <BanknotesIcon className="h-7 w-7 text-blue-500" />
          <h2 className="text-xl font-bold text-blue-900">Add Account</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-blue-500 mb-1">Account Name</label>
            <input type="text" className="rounded-xl border border-blue-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-blue-300" placeholder="e.g. Main Bank Account" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-500 mb-1">Account Type</label>
            <select className="rounded-xl border border-blue-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-blue-300" value={type} onChange={e => setType(e.target.value)}>
              {accountTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-500 mb-1">Starting Balance</label>
            <input type="number" className="rounded-xl border border-blue-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-blue-300" placeholder="e.g. 1000" value={balance} onChange={e => setBalance(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-blue-500 mb-1">Description/Notes</label>
            <textarea className="rounded-xl border border-blue-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-blue-300" placeholder="Optional" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </form>
        {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 mt-8">
          <button type="submit" form="add-account-form" className="flex-1 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 py-2 text-white font-semibold shadow-lg hover:from-blue-600 hover:to-sky-500 transition">Add Account</button>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 py-2 text-white font-semibold shadow-lg hover:from-gray-500 hover:to-gray-700 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
