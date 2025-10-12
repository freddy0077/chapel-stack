"use client";

import React from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Fund } from "@/types/finance";
import { formatCurrency } from "@/utils/financeHelpers";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const GET_FUND_BALANCE = gql`
  query GetFundBalance($organisationId: String!, $fundId: String!) {
    fundBalance(organisationId: $organisationId, fundId: $fundId)
  }
`;

const REMOVE_FUND = gql`
  mutation RemoveFund($id: String!) {
    removeFund(id: $id) {
      id
    }
  }
`;

const GET_FUNDS = gql`
  query GetFunds($organisationId: String!, $branchId: String) {
    funds(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      branchId
    }
  }
`;

interface FundBalanceRowProps {
  organisationId: string;
  branchId: string;
  fund: Fund;
  onEdit: (fund: Fund) => void;
}

function FundBalanceRow({ organisationId, branchId, fund, onEdit }: FundBalanceRowProps) {
  const { data, loading, error } = useQuery(GET_FUND_BALANCE, {
    variables: { organisationId, fundId: fund.id },
    skip: !organisationId || !fund.id,
  });

  const balance = data?.fundBalance || 0;

  const [removeFund, { loading: deleting }] = useMutation(REMOVE_FUND, {
    refetchQueries: [
      {
        query: GET_FUNDS,
        variables: { organisationId, branchId },
      },
    ],
    onCompleted: () => {
      toast.success("Fund deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete fund: ${error.message}`);
    },
  });

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${fund.name}"? This action cannot be undone.`)) {
      try {
        await removeFund({ variables: { id: fund.id } });
      } catch (err) {
        console.error("Error deleting fund:", err);
      }
    }
  };

  if (loading) {
    return (
      <tr className="animate-pulse">
        <td className="px-4 py-3 text-sm text-gray-900">{fund.name}</td>
        <td className="px-4 py-3 text-sm text-right">
          <div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div>
        </td>
        <td className="px-4 py-3"></td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td className="px-4 py-3 text-sm text-gray-900">{fund.name}</td>
        <td className="px-4 py-3 text-sm text-right text-red-600">Error</td>
        <td className="px-4 py-3"></td>
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
      <td className="px-4 py-3 text-sm text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(fund)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit fund"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete fund"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

interface FundBalancesProps {
  organisationId: string;
  branchId: string;
  funds: Fund[];
  onEditFund: (fund: Fund) => void;
}

export default function FundBalances({
  organisationId,
  branchId,
  funds,
  onEditFund,
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
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {funds.map((fund) => (
              <FundBalanceRow
                key={fund.id}
                organisationId={organisationId}
                branchId={branchId}
                fund={fund}
                onEdit={onEditFund}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
