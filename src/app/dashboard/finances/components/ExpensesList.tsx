"use client";

import { useState } from "react";
import { MagnifyingGlassIcon, ArrowDownTrayIcon, PaperClipIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const mockExpenses = [
  { id: 1, date: "2025-06-01", payee: "Power Company", category: "Utilities", amount: "$120", method: "Momo", notes: "June bill", receipt: true },
  { id: 2, date: "2025-06-02", payee: "Staff Payroll", category: "Staff Salaries", amount: "$2,100", method: "Bank", notes: "June salaries", receipt: false },
  { id: 3, date: "2025-06-03", payee: "Outreach Team", category: "Outreach", amount: "$800", method: "Cash", notes: "Event support", receipt: true },
];
const categories = ["All", "Utilities", "Staff Salaries", "Outreach"];

export default function ExpensesList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [payee, setPayee] = useState("");
  const [date, setDate] = useState("");

  // TODO: Filtering logic

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8">
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-rose-500 mb-1 ml-1">Date</label>
          <input type="date" className="rounded-xl border border-rose-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-rose-300" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-rose-500 mb-1 ml-1">Category</label>
          <select className="rounded-xl border border-rose-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-rose-300" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="flex flex-col flex-1 min-w-[160px]">
          <label className="text-xs font-semibold text-rose-500 mb-1 ml-1">Payee</label>
          <div className="relative">
            <input type="text" className="rounded-xl border border-rose-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-rose-300 pl-10" placeholder="Search payee..." value={payee} onChange={e => setPayee(e.target.value)} />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-rose-300 pointer-events-none" />
          </div>
        </div>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-rose-50 to-white py-2 px-5 text-sm font-semibold text-rose-700 shadow-lg hover:bg-rose-100 border border-rose-100 transition mt-2">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-rose-50 to-white">
              <th className="px-4 py-3 text-left font-bold text-rose-700">Date</th>
              <th className="px-4 py-3 text-left font-bold text-rose-700">Payee</th>
              <th className="px-4 py-3 text-left font-bold text-rose-700">Category</th>
              <th className="px-4 py-3 text-left font-bold text-rose-700">Amount</th>
              <th className="px-4 py-3 text-left font-bold text-rose-700">Payment Method</th>
              <th className="px-4 py-3 text-left font-bold text-rose-700">Notes</th>
              <th className="px-4 py-3 text-center font-bold text-rose-700">Receipt</th>
              <th className="px-4 py-3 text-center font-bold text-rose-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockExpenses.map((e) => (
              <tr key={e.id} className="border-b border-rose-50 hover:bg-rose-50/40">
                <td className="px-4 py-2">{e.date}</td>
                <td className="px-4 py-2">{e.payee}</td>
                <td className="px-4 py-2">{e.category}</td>
                <td className="px-4 py-2 font-bold text-rose-600">{e.amount}</td>
                <td className="px-4 py-2">{e.method}</td>
                <td className="px-4 py-2">{e.notes}</td>
                <td className="px-4 py-2 text-center">{e.receipt && <PaperClipIcon className="h-5 w-5 text-rose-400 inline" />}</td>
                <td className="px-4 py-2 text-center">
                  <button className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-2"><PencilIcon className="h-4 w-4" /></button>
                  <button className="inline-flex items-center text-rose-500 hover:text-rose-700"><TrashIcon className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
