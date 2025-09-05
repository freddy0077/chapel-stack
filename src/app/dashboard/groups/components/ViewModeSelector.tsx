import React from "react";
import {
  ListBulletIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

export type ViewMode = "list" | "grid" | "table";

interface ViewModeSelectorProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewModeSelector({
  currentView,
  onViewChange,
}: ViewModeSelectorProps) {
  const viewModes = [
    {
      id: "list" as ViewMode,
      name: "List View",
      icon: ListBulletIcon,
      description: "Detailed list with full information",
    },
    {
      id: "grid" as ViewMode,
      name: "Grid View",
      icon: Squares2X2Icon,
      description: "Card-based grid layout",
    },
    {
      id: "table" as ViewMode,
      name: "Table View",
      icon: TableCellsIcon,
      description: "Compact table format",
    },
  ];

  return (
    <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
      {viewModes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onViewChange(mode.id)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${
              currentView === mode.id
                ? "bg-indigo-100 text-indigo-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }
          `}
          title={mode.description}
          aria-label={mode.name}
        >
          <mode.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{mode.name}</span>
        </button>
      ))}
    </div>
  );
}
