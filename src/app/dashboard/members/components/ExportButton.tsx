"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function ExportButton() {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
      onClick={() => {
        // In a real app, this would trigger an export process
        console.log("Export members data");
      }}
    >
      <ArrowDownTrayIcon className="h-5 w-5 text-gray-500 mr-1.5" aria-hidden="true" />
      Export
    </button>
  );
}
