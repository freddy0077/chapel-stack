"use client";

import { useState } from "react";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

export default function GivingStatementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [member, setMember] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statementLoaded, setStatementLoaded] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}>
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-indigo-900 mb-6">View Giving Statement</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">Member</label>
            <input
              type="text"
              className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
              placeholder="Search by name or ID..."
              value={member}
              onChange={e => setMember(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-indigo-500 mb-1">Start Date</label>
              <input
                type="date"
                className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-indigo-500 mb-1">End Date</label>
              <input
                type="date"
                className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </form>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            disabled={!member || !startDate || !endDate}
            className="flex-1 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 py-2 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50"
            onClick={() => setStatementLoaded(true)}
          >
            View Statement
          </button>
          <button
            type="button"
            disabled={!statementLoaded}
            className="flex-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 py-2 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <DocumentArrowDownIcon className="h-5 w-5" /> Download PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 py-2 text-white font-semibold shadow-lg hover:from-gray-500 hover:to-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
