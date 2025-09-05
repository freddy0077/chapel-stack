import React from "react";

export default function LoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-sm text-gray-500">Loading groups...</p>
      </div>
    </div>
  );
}
