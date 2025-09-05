import React from "react";

export const AlertBanner = ({ message }: { message: string }) => (
  <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border-l-4 border-yellow-400 text-yellow-900 p-4 rounded-xl mb-6 shadow flex items-center gap-3 animate-fade-in">
    <svg
      className="w-6 h-6 text-yellow-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
    </svg>
    <span className="font-semibold text-base">{message}</span>
  </div>
);

export default AlertBanner;
