import React from "react";

export const MapWidget = () => (
  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-7 border border-white/40 dark:border-black/40 flex flex-col items-center min-h-[220px]">
    <div className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg w-full text-left">Branch Locations</div>
    <div className="w-full flex items-center justify-center h-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl">
      <span className="text-gray-400 dark:text-gray-500">[Map Placeholder]</span>
    </div>
  </div>
);

export default MapWidget;
