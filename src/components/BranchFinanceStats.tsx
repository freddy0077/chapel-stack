"use client";

import React from "react";
import { useTransactionsQuery } from "@/graphql/hooks/useTransactionQueries";

// Optionally, you can pass additional props for customizing the display
export default function BranchFinanceStats({ organisationId, branchId, funds = [], startDate, endDate, fundId }: {
  organisationId: string;
  branchId: string;
  funds: any[];
  startDate?: string;
  endDate?: string;
  fundId?: string;
}) {
  // Match branch finances page: useTransactionsQuery for summary stats
  const { data: transactionsData, loading: branchLoading, error: branchError } = useTransactionsQuery({
    organisationId,
    branchId,
    startDate,
    endDate,
    fundId,
    skip: 0,
    take: 1, // Only need stats
  });
  const stats = transactionsData?.transactions?.stats;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">Branch Financial Summary</h3>
        {branchLoading ? (
          <div className="text-gray-500">Loading summary...</div>
        ) : branchError ? (
          <div className="text-red-500">Error loading summary.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div className="p-4 bg-indigo-50 rounded-xl shadow">
              <div className="text-xs text-gray-500">Total Income</div>
              <div className="text-2xl font-semibold text-indigo-700">₵{stats?.totalIncome?.toLocaleString?.() ?? '0'}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl shadow">
              <div className="text-xs text-gray-500">Total Expenses</div>
              <div className="text-2xl font-semibold text-green-700">₵{stats?.totalExpenses?.toLocaleString?.() ?? '0'}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl shadow">
              <div className="text-xs text-gray-500">Net Balance</div>
              <div className="text-2xl font-semibold text-yellow-700">₵{stats?.netBalance?.toLocaleString?.() ?? '0'}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl shadow">
              <div className="text-xs text-gray-500">Total Tithes</div>
              <div className="text-2xl font-semibold text-blue-700">₵{stats?.totalTithes?.toLocaleString?.() ?? '0'}</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl shadow">
              <div className="text-xs text-gray-500">Total Pledges</div>
              <div className="text-2xl font-semibold text-pink-700">₵{stats?.totalPledges?.toLocaleString?.() ?? '0'}</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl shadow">
              <div className="text-xs text-gray-500">Total Offerings</div>
              <div className="text-2xl font-semibold text-orange-700">₵{stats?.totalOfferings?.toLocaleString?.() ?? '0'}</div>
            </div>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Fund Balances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {funds.length === 0 ? (
            <div className="col-span-full text-gray-500">No funds found.</div>
          ) : (
            funds.map(fund => <FundBalanceCard key={fund.id} organisationId={organisationId} fund={fund} startDate={startDate} endDate={endDate} />)
          )}
        </div>
      </div>
      <br/>
    </div>
  );
}

function FundBalanceCard({ organisationId, fund, startDate, endDate }: { organisationId: string, fund: any, startDate?: string, endDate?: string }) {
  const { data, loading, error } = useTransactionsQuery({
    organisationId,
    fundId: fund.id,
    branchId: fund.branchId,
    startDate,
    endDate,
    skip: 0,
    take: 1,
  });
  const stats = data?.transactions?.stats;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-3 items-start hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shadow">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-indigo-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <span className="text-lg font-bold text-indigo-900 truncate max-w-[120px]" title={fund.name}>{fund.name}</span>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <span className="text-xs text-gray-500">Net Balance</span>
        <span className="text-2xl font-extrabold text-indigo-700">
          {loading ? (
            <span className="animate-pulse text-gray-400">Loading...</span>
          ) : error ? (
            <span className="text-red-500">Error</span>
          ) : (
            `₵${stats?.netBalance?.toLocaleString?.() ?? '0'}`
          )}
        </span>
      </div>
      <div className="mt-2 w-full flex justify-end">
        <span className="inline-block px-3 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-600 font-semibold">Fund</span>
      </div>
    </div>
  );
}
