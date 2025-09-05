import React, { useState } from "react";

const widgets = [
  "Total Members",
  "Total Branches",
  "Total Staff",
  "Active Ministries",
  "Total Contributions",
  "Budget vs. Actual",
  "Charts",
  "Demographics",
  "Branch Table",
  "Activity Feed",
  "Map Widget",
  "Recent Table",
];

export const CustomizeDashboardModal = ({
  open,
  onClose,
  visibleWidgets,
  setVisibleWidgets,
}: {
  open: boolean;
  onClose: () => void;
  visibleWidgets: Record<string, boolean>;
  setVisibleWidgets: (v: Record<string, boolean>) => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100">
          Customize Dashboard
        </div>
        <div className="flex flex-col gap-2 mb-4">
          {widgets.map((w) => (
            <label
              key={w}
              className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-200"
            >
              <input
                type="checkbox"
                checked={visibleWidgets[w]}
                onChange={(e) =>
                  setVisibleWidgets({
                    ...visibleWidgets,
                    [w]: e.target.checked,
                  })
                }
                className="accent-primary"
                aria-label={`Toggle ${w}`}
              />
              {w}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeDashboardModal;
