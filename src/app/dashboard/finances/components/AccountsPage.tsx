"use client";

import { useState } from "react";
import { PlusIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

const mockAccounts = [
  { id: 1, type: "Bank", name: "Main Bank", balance: "$10,000" },
  { id: 2, type: "Cash", name: "Cash on Hand", balance: "$2,500" },
  { id: 3, type: "Momo", name: "MTN Momo", balance: "$1,200" },
];

export default function AccountsPage() {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8">
      <div className="flex flex-wrap gap-4 mb-6">
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform">
          <PlusIcon className="h-5 w-5 mr-2" /> Add Account
        </button>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform">
          <ArrowsRightLeftIcon className="h-5 w-5 mr-2" /> Transfer Funds
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-white">
              <th className="px-4 py-3 text-left font-bold text-blue-700">Type</th>
              <th className="px-4 py-3 text-left font-bold text-blue-700">Name</th>
              <th className="px-4 py-3 text-left font-bold text-blue-700">Balance</th>
              <th className="px-4 py-3 text-center font-bold text-blue-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAccounts.map((a) => (
              <tr key={a.id} className="border-b border-blue-50 hover:bg-blue-50/40">
                <td className="px-4 py-2">{a.type}</td>
                <td className="px-4 py-2">{a.name}</td>
                <td className="px-4 py-2 font-bold text-blue-600">{a.balance}</td>
                <td className="px-4 py-2 text-center">
                  <button className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                  <button className="inline-flex items-center text-rose-500 hover:text-rose-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
