"use client";

import React from "react";
import { useBankAccounts } from "@/hooks/finance/useBankAccounts";

// Optionally, you can pass additional props for customizing the display
export default function BranchFinanceStats({
  organisationId,
  branchId,
}: {
  organisationId: string;
  branchId: string;
}) {

  // Bank accounts for balances KPI and list
  const {
    bankAccounts,
    loading: bankLoading,
    error: bankError,
  } = useBankAccounts({ organisationId, branchId });

  const totalBankBalance = bankAccounts?.reduce(
    (sum: number, acc: any) => sum + (acc.bankBalance || 0),
    0,
  ) || 0;
  const totalBookBalance = bankAccounts?.reduce(
    (sum: number, acc: any) => sum + (acc.bookBalance || 0),
    0,
  ) || 0;
  const reconciliationDelta = (totalBankBalance - totalBookBalance) || 0;

  return (
    <div className="space-y-6">
      {/* Bank Accounts KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl shadow">
          <div className="text-xs text-gray-500">Total Bank Balance</div>
          <div className="text-2xl font-semibold text-blue-700">
            {bankLoading ? 'Loading…' : `₵${totalBankBalance.toLocaleString()}`}
          </div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-xl shadow">
          <div className="text-xs text-gray-500">Total Book Balance</div>
          <div className="text-2xl font-semibold text-indigo-700">
            {bankLoading ? 'Loading…' : `₵${totalBookBalance.toLocaleString()}`}
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-xl shadow">
          <div className="text-xs text-gray-500">Reconciliation Delta</div>
          <div className={`text-2xl font-semibold ${reconciliationDelta === 0 ? 'text-gray-700' : reconciliationDelta > 0 ? 'text-green-700' : 'text-red-700' }`}>
            {bankLoading ? 'Loading…' : `₵${reconciliationDelta.toLocaleString()}`}
          </div>
        </div>
      </div>

      <BankAccountBalances
        bankAccounts={bankAccounts}
        loading={bankLoading}
        error={bankError}
      />
      <br />
    </div>
  );
}

// Helper component: Bank account balances grid
function BankAccountBalances({
  bankAccounts,
  loading,
  error,
}: {
  bankAccounts: any[];
  loading: boolean;
  error: any;
}) {

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Bank Account Balances</h3>
      {loading ? (
        <div className="text-gray-500">Loading bank accounts...</div>
      ) : error ? (
        <div className="text-red-500">Error loading bank accounts.</div>
      ) : bankAccounts?.length === 0 ? (
        <div className="text-gray-500">No bank accounts found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bankAccounts?.map((acc: any) => (
            <div
              key={acc.id}
              className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col gap-3 items-start hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-sm font-semibold text-blue-900">
                    {acc.accountName}
                  </div>
                  <div className="text-xs text-gray-500">{acc.bankName}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {acc.currency || "GHS"}
                </span>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 mt-2">
                <div>
                  <div className="text-xs text-gray-500">Book Balance</div>
                  <div className="text-lg font-bold text-blue-700">
                    {(acc.bookBalance ?? 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Bank Balance</div>
                  <div className="text-lg font-bold text-blue-700">
                    {(acc.bankBalance ?? 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 w-full text-right">
                {acc.accountNumber}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
