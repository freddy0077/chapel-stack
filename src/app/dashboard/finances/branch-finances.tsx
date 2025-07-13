"use client";

import React from "react";
import BranchFinancesPage from "../branch-finances/page";
import { useBranches } from "../../../graphql/hooks/useBranches";

export default function BranchFinancesWithBranchFilter() {
  // Fetch all branches
  const { branches, loading, error } = useBranches();
  const [selectedBranch, setSelectedBranch] = React.useState<string>("all");

  if (loading) return <div>Loading branches...</div>;
  if (error) return <div>Error loading branches.</div>;

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xs"
          value={selectedBranch}
          onChange={e => setSelectedBranch(e.target.value)}
        >
          <option value="all">All Branches</option>
          {branches.map((branch: any) => (
            <option key={branch.id} value={branch.id}>{branch.name}</option>
          ))}
        </select>
      </div>
      <BranchFinancesPage selectedBranch={selectedBranch} />
    </div>
  );
}
