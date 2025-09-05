import React from "react";

const branches = [
  {
    name: "Central Chapel",
    members: 1200,
    contributions: "₵3,200",
    status: "Active",
  },
  {
    name: "Grace Branch",
    members: 950,
    contributions: "₵2,100",
    status: "Active",
  },
  {
    name: "Hope Center",
    members: 600,
    contributions: "₵1,400",
    status: "Inactive",
  },
];

export const BranchTable = () => (
  <div className="bg-white/80 dark:bg-black/40 backdrop-blur-lg rounded-2xl shadow-xl p-7 border border-white/40 dark:border-black/40">
    <div className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-lg">
      Top Performing Branches
    </div>
    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
      <thead>
        <tr>
          <th className="py-2 px-3 font-semibold">Branch</th>
          <th className="py-2 px-3 font-semibold">Members</th>
          <th className="py-2 px-3 font-semibold">Contributions</th>
          <th className="py-2 px-3 font-semibold">Status</th>
          <th className="py-2 px-3 font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {branches.map((b) => (
          <tr
            key={b.name}
            className="hover:bg-primary/10 dark:hover:bg-primary/20 transition"
          >
            <td className="py-2 px-3">{b.name}</td>
            <td className="py-2 px-3">{b.members}</td>
            <td className="py-2 px-3">{b.contributions}</td>
            <td className="py-2 px-3">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${b.status === "Active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}
              >
                {b.status}
              </span>
            </td>
            <td className="py-2 px-3">
              <button className="text-primary hover:underline mr-2">
                View
              </button>
              <button className="text-blue-500 hover:underline">Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default BranchTable;
