"use client";

import React, { useState } from 'react';
import { 
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  PrinterIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

interface FinancialData {
  income: {
    tithes: number;
    offerings: number;
    donations: number;
    pledges: number;
    specialContributions: number;
    otherIncome: number;
    total: number;
  };
  expenses: {
    salaries: number;
    utilities: number;
    maintenance: number;
    programs: number;
    administration: number;
    missions: number;
    otherExpenses: number;
    total: number;
  };
  assets: {
    cash: number;
    bankAccounts: number;
    investments: number;
    property: number;
    equipment: number;
    otherAssets: number;
    total: number;
  };
  liabilities: {
    accountsPayable: number;
    loans: number;
    mortgages: number;
    otherLiabilities: number;
    total: number;
  };
  equity: {
    retainedEarnings: number;
    currentYearSurplus: number;
    total: number;
  };
}

interface FinancialStatementsProps {
  data: FinancialData;
  period: string;
  loading?: boolean;
  onExport?: (format: 'pdf' | 'excel') => void;
  onPrint?: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const StatementRow = ({ 
  label, 
  amount, 
  isSubtotal = false, 
  isTotal = false, 
  indent = false 
}: { 
  label: string; 
  amount: number; 
  isSubtotal?: boolean; 
  isTotal?: boolean; 
  indent?: boolean; 
}) => (
  <tr className={`${isTotal ? 'border-t-2 border-gray-400 font-bold bg-gray-50' : isSubtotal ? 'border-t border-gray-300 font-semibold bg-gray-25' : 'hover:bg-gray-50'}`}>
    <td className={`py-2 px-4 ${indent ? 'pl-8' : ''} ${isTotal ? 'font-bold text-gray-900' : isSubtotal ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
      {label}
    </td>
    <td className={`py-2 px-4 text-right ${isTotal ? 'font-bold text-gray-900' : isSubtotal ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
      {formatCurrency(amount)}
    </td>
  </tr>
);

export default function FinancialStatements({ 
  data, 
  period, 
  loading = false, 
  onExport,
  onPrint 
}: FinancialStatementsProps) {
  const [activeStatement, setActiveStatement] = useState<'income' | 'balance'>('income');

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const netIncome = data.income.total - data.expenses.total;
  const totalEquity = data.assets.total - data.liabilities.total;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
            Financial Statements
          </h3>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            Period: {period}
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onPrint && (
            <button
              onClick={onPrint}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
            >
              <PrinterIcon className="h-4 w-4" />
              Print
            </button>
          )}
          {onExport && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onExport('pdf')}
                className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                PDF
              </button>
              <button
                onClick={() => onExport('excel')}
                className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statement Type Selector */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveStatement('income')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeStatement === 'income'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Income Statement
        </button>
        <button
          onClick={() => setActiveStatement('balance')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeStatement === 'balance'
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Balance Sheet
        </button>
      </div>

      {/* Income Statement */}
      {activeStatement === 'income' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
            <h4 className="text-lg font-bold text-indigo-900 mb-4">Income Statement</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Account</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Income Section */}
                  <tr className="bg-green-50">
                    <td colSpan={2} className="py-3 px-4 font-bold text-green-800 text-lg">
                      INCOME
                    </td>
                  </tr>
                  <StatementRow label="Tithes" amount={data.income.tithes} indent />
                  <StatementRow label="Offerings" amount={data.income.offerings} indent />
                  <StatementRow label="Donations" amount={data.income.donations} indent />
                  <StatementRow label="Pledges" amount={data.income.pledges} indent />
                  <StatementRow label="Special Contributions" amount={data.income.specialContributions} indent />
                  <StatementRow label="Other Income" amount={data.income.otherIncome} indent />
                  <StatementRow label="Total Income" amount={data.income.total} isSubtotal />
                  
                  {/* Expenses Section */}
                  <tr className="bg-red-50">
                    <td colSpan={2} className="py-3 px-4 font-bold text-red-800 text-lg">
                      EXPENSES
                    </td>
                  </tr>
                  <StatementRow label="Salaries & Benefits" amount={data.expenses.salaries} indent />
                  <StatementRow label="Utilities" amount={data.expenses.utilities} indent />
                  <StatementRow label="Maintenance & Repairs" amount={data.expenses.maintenance} indent />
                  <StatementRow label="Programs & Ministry" amount={data.expenses.programs} indent />
                  <StatementRow label="Administration" amount={data.expenses.administration} indent />
                  <StatementRow label="Missions & Outreach" amount={data.expenses.missions} indent />
                  <StatementRow label="Other Expenses" amount={data.expenses.otherExpenses} indent />
                  <StatementRow label="Total Expenses" amount={data.expenses.total} isSubtotal />
                  
                  {/* Net Income */}
                  <StatementRow label="NET INCOME" amount={netIncome} isTotal />
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Ratios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-2">Expense Ratio</h5>
              <p className="text-2xl font-bold text-blue-900">
                {data.income.total > 0 ? ((data.expenses.total / data.income.total) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-blue-700">Expenses to Income</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2">Net Margin</h5>
              <p className="text-2xl font-bold text-green-900">
                {data.income.total > 0 ? ((netIncome / data.income.total) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-green-700">Net Income to Total Income</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-2">Program Efficiency</h5>
              <p className="text-2xl font-bold text-purple-900">
                {data.expenses.total > 0 ? ((data.expenses.programs / data.expenses.total) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-purple-700">Program Expenses to Total</p>
            </div>
          </div>
        </div>
      )}

      {/* Balance Sheet */}
      {activeStatement === 'balance' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-100">
            <h4 className="text-lg font-bold text-purple-900 mb-4">Balance Sheet</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">Account</th>
                    <th className="text-right py-3 px-4 font-bold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Assets Section */}
                  <tr className="bg-blue-50">
                    <td colSpan={2} className="py-3 px-4 font-bold text-blue-800 text-lg">
                      ASSETS
                    </td>
                  </tr>
                  <StatementRow label="Cash" amount={data.assets.cash} indent />
                  <StatementRow label="Bank Accounts" amount={data.assets.bankAccounts} indent />
                  <StatementRow label="Investments" amount={data.assets.investments} indent />
                  <StatementRow label="Property" amount={data.assets.property} indent />
                  <StatementRow label="Equipment" amount={data.assets.equipment} indent />
                  <StatementRow label="Other Assets" amount={data.assets.otherAssets} indent />
                  <StatementRow label="Total Assets" amount={data.assets.total} isSubtotal />
                  
                  {/* Liabilities Section */}
                  <tr className="bg-red-50">
                    <td colSpan={2} className="py-3 px-4 font-bold text-red-800 text-lg">
                      LIABILITIES
                    </td>
                  </tr>
                  <StatementRow label="Accounts Payable" amount={data.liabilities.accountsPayable} indent />
                  <StatementRow label="Loans" amount={data.liabilities.loans} indent />
                  <StatementRow label="Mortgages" amount={data.liabilities.mortgages} indent />
                  <StatementRow label="Other Liabilities" amount={data.liabilities.otherLiabilities} indent />
                  <StatementRow label="Total Liabilities" amount={data.liabilities.total} isSubtotal />
                  
                  {/* Equity Section */}
                  <tr className="bg-green-50">
                    <td colSpan={2} className="py-3 px-4 font-bold text-green-800 text-lg">
                      NET ASSETS (EQUITY)
                    </td>
                  </tr>
                  <StatementRow label="Retained Earnings" amount={data.equity.retainedEarnings} indent />
                  <StatementRow label="Current Year Surplus" amount={data.equity.currentYearSurplus} indent />
                  <StatementRow label="Total Net Assets" amount={totalEquity} isTotal />
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance Sheet Ratios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h5 className="font-semibold text-indigo-800 mb-2">Debt Ratio</h5>
              <p className="text-2xl font-bold text-indigo-900">
                {data.assets.total > 0 ? ((data.liabilities.total / data.assets.total) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-indigo-700">Liabilities to Assets</p>
            </div>
            
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <h5 className="font-semibold text-teal-800 mb-2">Equity Ratio</h5>
              <p className="text-2xl font-bold text-teal-900">
                {data.assets.total > 0 ? ((totalEquity / data.assets.total) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-sm text-teal-700">Equity to Assets</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h5 className="font-semibold text-orange-800 mb-2">Liquidity</h5>
              <p className="text-2xl font-bold text-orange-900">
                {formatCurrency(data.assets.cash + data.assets.bankAccounts)}
              </p>
              <p className="text-sm text-orange-700">Available Cash</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
