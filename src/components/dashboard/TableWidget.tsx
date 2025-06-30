import React from "react";

export const TableWidget = () => (
  <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-7 min-h-[200px] border border-white/40">
    <table className="w-full text-sm text-left text-gray-700">
      <thead>
        <tr>
          <th className="py-2 px-3 font-semibold">Name</th>
          <th className="py-2 px-3 font-semibold">Status</th>
          <th className="py-2 px-3 font-semibold">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-primary/10 transition">
          <td className="py-2 px-3">John Doe</td>
          <td className="py-2 px-3">Active</td>
          <td className="py-2 px-3">2025-06-29</td>
        </tr>
        <tr className="hover:bg-primary/10 transition">
          <td className="py-2 px-3">Jane Smith</td>
          <td className="py-2 px-3">Inactive</td>
          <td className="py-2 px-3">2025-06-28</td>
        </tr>
        <tr className="hover:bg-primary/10 transition">
          <td className="py-2 px-3">Samuel Lee</td>
          <td className="py-2 px-3">Active</td>
          <td className="py-2 px-3">2025-06-27</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default TableWidget;
