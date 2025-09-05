"use client";

import { useState } from "react";
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const mockBudgets = [
  { category: "Tithe", budgeted: 5000, actual: 4800 },
  { category: "Offering", budgeted: 2500, actual: 2900 },
  { category: "Building Fund", budgeted: 3000, actual: 2100 },
];

export default function BudgetsPage() {
  const [editing, setEditing] = useState<number | null>(null);
  const [budgets, setBudgets] = useState(mockBudgets);

  function handleEdit(i: number, value: number) {
    setBudgets((budgets) =>
      budgets.map((b, idx) => (idx === i ? { ...b, budgeted: value } : b)),
    );
    setEditing(null);
  }

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {budgets.map((b, i) => {
          const over = b.actual > b.budgeted;
          const percent = Math.round((b.actual / b.budgeted) * 100);
          return (
            <div
              key={b.category}
              className={`rounded-2xl p-6 shadow-lg bg-gradient-to-br from-indigo-50 to-white flex flex-col gap-2 border ${over ? "border-rose-300" : "border-emerald-100"}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <ChartBarIcon className="h-5 w-5 text-indigo-400" />
                <span className="font-bold text-indigo-900">{b.category}</span>
                {over && (
                  <ExclamationTriangleIcon
                    className="h-5 w-5 text-rose-400 ml-2"
                    title="Over budget"
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Budgeted:</span>
                {editing === i ? (
                  <input
                    type="number"
                    className="w-20 rounded bg-white border px-2 py-1 text-xs"
                    value={b.budgeted}
                    onChange={(e) => handleEdit(i, Number(e.target.value))}
                    autoFocus
                    onBlur={() => setEditing(null)}
                  />
                ) : (
                  <span
                    className="font-semibold text-indigo-700 cursor-pointer"
                    onClick={() => setEditing(i)}
                  >
                    {b.budgeted}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Actual:</span>
                <span className="font-semibold text-emerald-700">
                  {b.actual}
                </span>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-3 mt-2">
                <div
                  className={`h-3 rounded-full ${over ? "bg-rose-400" : "bg-emerald-400"}`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {percent}% of budget
              </div>
              {over && (
                <div className="text-xs text-rose-500 mt-1">Over budget!</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
