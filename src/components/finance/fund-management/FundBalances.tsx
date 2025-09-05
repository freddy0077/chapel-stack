"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Fund } from "@/types/finance";
import { formatCurrency } from "@/utils/financeHelpers";

const GET_FUND_BALANCE = gql`
  query GetFundBalance($organisationId: String!, $fundId: String!) {
    fundBalance(organisationId: $organisationId, fundId: $fundId)
  }
`;

interface FundBalanceRowProps {
  organisationId: string;
  fund: Fund;
}

function FundBalanceRow({ organisationId, fund }: FundBalanceRowProps) {
  const { data, loading, error } = useQuery(GET_FUND_BALANCE, {
    variables: { organisationId, fundId: fund.id },
    skip: !organisationId || !fund.id,
  });

  const balance = data?.fundBalance || 0;

  if (loading) {
    return (
      <tr className="animate-pulse">
        <td className="px-4 py-3 text-sm text-gray-900">{fund.name}</td>
        <td className="px-4 py-3 text-sm text-right">
          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td className="px-4 py-3 text-sm text-gray-900">{fund.name}</td>
        <td className="px-4 py-3 text-sm text-right text-red-600">Error</td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {fund.name}
        {fund.description && (
          <p className="text-xs text-gray-500 mt-1">{fund.description}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
        {formatCurrency(balance)}
      </td>
    </tr>
  );
}

interface FundBalancesProps {
  organisationId: string;
  funds: Fund[];
}

export default function FundBalances({
  organisationId,
  funds,
}: FundBalancesProps) {
  if (!funds || funds.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Fund Balances
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No funds available.</p>
          <p className="text-sm mt-1">
            Create a fund to start tracking balances.
          </p>
        </div>
      </div>
    );
  }

  const totalBalance = funds.reduce((total, fund) => {
    // This would need to be calculated properly with actual balance data
    return total;
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Fund Balances</h3>
        <span className="text-sm text-gray-500">
          {funds.length} fund{funds.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fund Name
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {funds.map((fund) => (
              <FundBalanceRow
                key={fund.id}
                organisationId={organisationId}
                fund={fund}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
