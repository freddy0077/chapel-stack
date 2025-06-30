import React from "react";

export const ExportButton = ({ onExport }: { onExport: () => void }) => (
  <button
    className="px-4 py-2 bg-gradient-to-tr from-primary to-blue-400 text-white rounded-lg shadow hover:scale-105 transition-transform text-sm font-semibold focus:outline-none"
    onClick={onExport}
    aria-label="Export data"
  >
    <span className="mr-2">📤</span> Export
  </button>
);

export default ExportButton;
