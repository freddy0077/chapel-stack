import React from "react";

export const FilterBar = () => (
  <div className="flex flex-wrap gap-4 items-center mb-6 bg-white/60 backdrop-blur-lg rounded-xl px-5 py-3 shadow border border-white/40">
    <input
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/60"
      type="text"
      placeholder="Search..."
    />
    <select className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/60">
      <option>All Branches</option>
      <option>Branch 1</option>
      <option>Branch 2</option>
    </select>
    <input
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white/60"
      type="date"
    />
  </div>
);

export default FilterBar;
