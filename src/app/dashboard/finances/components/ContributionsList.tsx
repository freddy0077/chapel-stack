"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Placeholder data
const mockContributions = [
  {
    id: 1,
    date: "2025-06-01",
    member: "John Smith",
    category: "Tithe",
    amount: "$100",
    method: "Cash",
    reference: "TXN123",
  },
  {
    id: 2,
    date: "2025-06-02",
    member: "Mary Jones",
    category: "Offering",
    amount: "$50",
    method: "Card",
    reference: "TXN124",
  },
  {
    id: 3,
    date: "2025-06-03",
    member: "Paul Lee",
    category: "Building Fund",
    amount: "$200",
    method: "Momo",
    reference: "TXN125",
  },
];

const categories = ["All", "Tithe", "Offering", "Building Fund"];
const methods = ["All", "Cash", "Card", "Momo"];

export default function ContributionsList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [method, setMethod] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // TODO: Filtering logic

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8">
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-indigo-500 mb-1 ml-1">
            Date From
          </label>
          <input
            type="date"
            className="rounded-xl border border-indigo-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-indigo-500 mb-1 ml-1">
            Date To
          </label>
          <input
            type="date"
            className="rounded-xl border border-indigo-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-indigo-500 mb-1 ml-1">
            Category
          </label>
          <select
            className="rounded-xl border border-indigo-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-indigo-500 mb-1 ml-1">
            Payment Method
          </label>
          <select
            className="rounded-xl border border-indigo-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            {methods.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-indigo-500 mb-1 ml-1">
            Member
          </label>
          <div className="relative">
            <input
              type="text"
              className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300 pl-10"
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-300 pointer-events-none" />
          </div>
        </div>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-50 to-white py-2 px-5 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-indigo-100 border border-indigo-100 transition mt-2">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export CSV
        </button>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-50 to-white py-2 px-5 text-sm font-semibold text-indigo-700 shadow-lg hover:bg-indigo-100 border border-indigo-100 transition mt-2">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-white">
              <th className="px-4 py-3 text-left font-bold text-indigo-700">
                Date
              </th>
              <th className="px-4 py-3 text-left font-bold text-indigo-700">
                Member
              </th>
              <th className="px-4 py-3 text-left font-bold text-indigo-700">
                Category
              </th>
              <th className="px-4 py-3 text-left font-bold text-indigo-700">
                Amount
              </th>
              <th className="px-4 py-3 text-left font-bold text-indigo-700">
                Method
              </th>
              <th className="px-4 py-3 text-left font-bold text-indigo-700">
                Reference
              </th>
              <th className="px-4 py-3 text-center font-bold text-indigo-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockContributions.map((c) => (
              <tr
                key={c.id}
                className="border-b border-indigo-50 hover:bg-indigo-50/40"
              >
                <td className="px-4 py-2">{c.date}</td>
                <td className="px-4 py-2">{c.member}</td>
                <td className="px-4 py-2">{c.category}</td>
                <td className="px-4 py-2 font-bold text-emerald-600">
                  {c.amount}
                </td>
                <td className="px-4 py-2">{c.method}</td>
                <td className="px-4 py-2">{c.reference}</td>
                <td className="px-4 py-2 text-center">
                  <button className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-2">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="inline-flex items-center text-rose-500 hover:text-rose-700">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
