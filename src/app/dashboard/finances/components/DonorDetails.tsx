"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Placeholder data
const donor = {
  name: "John Smith",
  photo: "https://randomuser.me/api/portraits/men/1.jpg",
  contact: "john.smith@email.com",
  phone: "+233 555 123 456",
  totalYear: "$2,500",
  avgMonth: "$208",
  history: [
    { date: "2025-06-01", category: "Tithe", amount: "$100" },
    { date: "2025-05-15", category: "Offering", amount: "$50" },
    { date: "2025-04-20", category: "Building Fund", amount: "$200" },
  ],
};

export default function DonorDetails() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center w-full max-w-xs">
        <img src={donor.photo} alt={donor.name} className="w-24 h-24 rounded-full shadow mb-4 object-cover" />
        <h2 className="text-xl font-bold text-indigo-900 mb-1">{donor.name}</h2>
        <div className="text-indigo-500 text-sm mb-1">{donor.contact}</div>
        <div className="text-gray-500 text-xs mb-4">{donor.phone}</div>
        <div className="w-full bg-gradient-to-r from-emerald-50 to-white rounded-xl p-4 mb-2">
          <div className="text-xs text-gray-500">Total This Year</div>
          <div className="text-lg font-bold text-emerald-600">{donor.totalYear}</div>
        </div>
        <div className="w-full bg-gradient-to-r from-indigo-50 to-white rounded-xl p-4">
          <div className="text-xs text-gray-500">Avg Per Month</div>
          <div className="text-lg font-bold text-indigo-600">{donor.avgMonth}</div>
        </div>
        <button className="mt-6 inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:from-indigo-600 hover:to-purple-600 transition">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
          Generate PDF Statement
        </button>
      </div>
      {/* Giving History Table */}
      <div className="flex-1 bg-white/80 rounded-2xl shadow-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-indigo-900">Giving History</h3>
          <input type="text" placeholder="Search..." className="rounded-xl border border-indigo-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-50 to-white">
                <th className="px-4 py-3 text-left font-bold text-indigo-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-indigo-700">Category</th>
                <th className="px-4 py-3 text-left font-bold text-indigo-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {donor.history.map((h, i) => (
                <tr key={i} className="border-b border-indigo-50 hover:bg-indigo-50/40">
                  <td className="px-4 py-2">{h.date}</td>
                  <td className="px-4 py-2">{h.category}</td>
                  <td className="px-4 py-2 font-bold text-emerald-600">{h.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
