"use client";

import { useState } from "react";
import { XMarkIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function ImportFromExcelModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-xl font-bold text-indigo-900 mb-6">
          Import Contributions from Excel
        </h2>
        <div className="mb-4 text-sm text-indigo-700 bg-indigo-50 rounded-lg p-3">
          <p>
            Upload a .xlsx or .csv file. Make sure your columns match the
            template. Only new contributions will be imported.
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-indigo-500 mb-1">
              Select File
            </label>
            <input
              type="file"
              accept=".xlsx,.csv"
              className="rounded-xl border border-indigo-100 px-3 py-2 w-full bg-white/90 shadow focus:ring-2 focus:ring-indigo-300"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </form>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            disabled={!file}
            className="flex-1 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 py-2 text-white font-semibold shadow-lg hover:from-emerald-600 hover:to-green-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ArrowUpTrayIcon className="h-5 w-5" /> Import
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 py-2 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
