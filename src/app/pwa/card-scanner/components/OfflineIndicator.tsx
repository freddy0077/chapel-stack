"use client";

import { WifiIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline";

interface OfflineIndicatorProps {
  pendingCount: number;
}

export default function OfflineIndicator({
  pendingCount,
}: OfflineIndicatorProps) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <WifiIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Offline Mode Active
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You are currently working offline. Attendance records will be
              saved locally and synced when internet connection is restored.
            </p>
            {pendingCount > 0 && (
              <div className="mt-2 flex items-center text-sm">
                <CloudArrowUpIcon className="h-4 w-4 mr-1 text-yellow-600" />
                <span className="font-medium">
                  {pendingCount} pending records
                </span>{" "}
                waiting to be synced
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
