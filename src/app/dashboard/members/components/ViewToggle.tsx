"use client";

type ViewToggleProps = {
  viewMode: "grid" | "list";
  onChange: (mode: "grid" | "list") => void;
};

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="hidden sm:flex p-0.5 rounded-lg bg-gray-100">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`px-3 py-1.5 text-sm font-medium ${
          viewMode === "grid" 
            ? "bg-white shadow-sm rounded-md text-gray-800" 
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Grid
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`px-3 py-1.5 text-sm font-medium ${
          viewMode === "list" 
            ? "bg-white shadow-sm rounded-md text-gray-800" 
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        List
      </button>
    </div>
  );
}
