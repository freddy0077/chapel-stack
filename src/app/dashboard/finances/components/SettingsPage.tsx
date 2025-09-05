"use client";

import { useState } from "react";
import {
  BanknotesIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const givingCategories = [
  {
    name: "Tithe",
    icon: <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-400" />,
  },
  {
    name: "Thanksgiving",
    icon: <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-400" />,
  },
  {
    name: "Building Fund",
    icon: <ClipboardDocumentCheckIcon className="h-5 w-5 text-indigo-400" />,
  },
];
const expenseCategories = [
  {
    name: "Utilities",
    icon: <BanknotesIcon className="h-5 w-5 text-rose-400" />,
  },
  {
    name: "Salaries",
    icon: <BanknotesIcon className="h-5 w-5 text-rose-400" />,
  },
  {
    name: "Outreach",
    icon: <BanknotesIcon className="h-5 w-5 text-rose-400" />,
  },
];

export default function SettingsPage() {
  const [roles, setRoles] = useState([
    { name: "Admin", permissions: ["View", "Add", "Edit", "Delete"] },
    { name: "Viewer", permissions: ["View"] },
  ]);

  return (
    <div className="flex flex-col gap-8 bg-white/70 rounded-3xl shadow-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold text-indigo-900 mb-2 tracking-tight">
        Settings & Permissions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Giving Categories Card */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white/80 to-purple-50 shadow-lg p-6 flex flex-col gap-4 backdrop-blur-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-indigo-400" />
            <h3 className="font-semibold text-indigo-700 text-lg">
              Giving Categories
            </h3>
            <button
              className="ml-auto p-2 rounded-full hover:bg-indigo-100 transition"
              disabled
            >
              <PencilSquareIcon className="h-5 w-5 text-indigo-400" />
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {givingCategories.map((cat) => (
              <span
                key={cat.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-indigo-700 font-semibold shadow border border-indigo-100 backdrop-blur-sm"
              >
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>
        </div>
        {/* Expense Categories Card */}
        <div className="rounded-2xl bg-gradient-to-br from-rose-50 via-white/80 to-pink-50 shadow-lg p-6 flex flex-col gap-4 backdrop-blur-xl border border-rose-100">
          <div className="flex items-center gap-2 mb-2">
            <BanknotesIcon className="h-6 w-6 text-rose-400" />
            <h3 className="font-semibold text-rose-700 text-lg">
              Expense Categories
            </h3>
            <button
              className="ml-auto p-2 rounded-full hover:bg-rose-100 transition"
              disabled
            >
              <PencilSquareIcon className="h-5 w-5 text-rose-400" />
            </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {expenseCategories.map((cat) => (
              <span
                key={cat.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 text-rose-700 font-semibold shadow border border-rose-100 backdrop-blur-sm"
              >
                {cat.icon} {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Roles & Permissions Card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 via-white/80 to-indigo-50 shadow-lg p-6 flex flex-col gap-4 backdrop-blur-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <UserGroupIcon className="h-6 w-6 text-blue-400" />
          <h3 className="font-semibold text-blue-700 text-lg">
            Roles & Permissions
          </h3>
          <button
            className="ml-auto p-2 rounded-full hover:bg-blue-100 transition"
            disabled
          >
            <PencilSquareIcon className="h-5 w-5 text-blue-400" />
          </button>
        </div>
        <table className="min-w-full text-sm mb-2">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-white">
              <th className="px-4 py-3 text-left font-bold text-blue-700">
                Role
              </th>
              <th className="px-4 py-3 text-left font-bold text-blue-700">
                Permissions
              </th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, idx) => (
              <tr key={idx} className="border-b border-blue-50">
                <td className="px-4 py-2 font-semibold text-indigo-600">
                  {role.name}
                </td>
                <td className="px-4 py-2">
                  {role.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold mr-2 mb-1 shadow"
                    >
                      {p}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
