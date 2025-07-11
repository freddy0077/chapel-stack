import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { useMemberTransactions } from "@/graphql/hooks/useMemberTransactions";
import useAuth from "@/graphql/hooks/useAuth";

interface MemberContributionsTabProps {
  memberId: string;
}

export default function MemberContributionsTab({ memberId }: MemberContributionsTabProps) {
  const { organisationId } = useOrganizationBranchFilter();
  const {user} = useAuth();
  const { transactions, loading, error } = useMemberTransactions({ organisationId, userId: user?.id });

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h4 className="text-xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
        <CurrencyDollarIcon className="h-6 w-6 text-indigo-400" /> Contributions
      </h4>
      {loading ? (
        <div className="text-gray-400 py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500 py-8 text-center">Error loading contributions.</div>
      ) : transactions.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Type</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Fund</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {transactions.map((txn: any) => (
              <tr key={txn.id}>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(txn.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{txn.type}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {txn.fund?.name || txn.fundId || '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap font-bold text-indigo-700">GHS {txn.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-400 py-8 text-center">No contributions found.</div>
      )}
    </div>
  );
}
