"use client";

import React, { useState } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  CalendarIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import CashFlowAnalysis from './CashFlowAnalysis';
import ComparativePeriodAnalysis from './ComparativePeriodAnalysis';
import MemberGivingHistory from './MemberGivingHistory';
import FinancialStatements from './FinancialStatements';
import DonorStatements from './DonorStatements';
import BudgetVsActual from './BudgetVsActual';
import BudgetManagement from './BudgetManagement';

// Mock data interfaces (replace with actual GraphQL data)
interface CashFlowData {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  cumulativeFlow: number;
}

interface PeriodData {
  period: string;
  currentIncome: number;
  previousIncome: number;
  currentExpenses: number;
  previousExpenses: number;
  currentNet: number;
  previousNet: number;
}

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

interface DonorData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalGiving: number;
  transactionCount: number;
  firstGift: string;
  lastGift: string;
  averageGift: number;
  transactions: any[];
}

interface FinancialAnalyticsSectionProps {
  organisationId: string;
  branchId: string;
}

// Mock data generators (replace with actual data fetching)
const generateMockCashFlowData = (): CashFlowData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    period: month,
    income: Math.random() * 50000 + 30000,
    expenses: Math.random() * 40000 + 20000,
    netFlow: Math.random() * 20000 - 5000,
    cumulativeFlow: (index + 1) * (Math.random() * 15000 + 5000),
  }));
};

const generateMockComparativeData = (): PeriodData[] => {
  const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
  return periods.map(period => ({
    period,
    currentIncome: Math.random() * 150000 + 100000,
    previousIncome: Math.random() * 140000 + 90000,
    currentExpenses: Math.random() * 120000 + 80000,
    previousExpenses: Math.random() * 110000 + 70000,
    currentNet: Math.random() * 40000 + 10000,
    previousNet: Math.random() * 35000 + 5000,
  }));
};

const generateMockFinancialData = (): FinancialData => ({
  income: {
    tithes: 45000,
    offerings: 23000,
    donations: 15000,
    pledges: 12000,
    specialContributions: 8000,
    otherIncome: 5000,
    total: 108000,
  },
  expenses: {
    salaries: 35000,
    utilities: 8000,
    maintenance: 6000,
    programs: 12000,
    administration: 5000,
    missions: 10000,
    otherExpenses: 4000,
    total: 80000,
  },
  assets: {
    cash: 25000,
    bankAccounts: 85000,
    investments: 50000,
    property: 200000,
    equipment: 30000,
    otherAssets: 10000,
    total: 400000,
  },
  liabilities: {
    accountsPayable: 5000,
    loans: 15000,
    mortgages: 80000,
    otherLiabilities: 3000,
    total: 103000,
  },
  equity: {
    retainedEarnings: 269000,
    currentYearSurplus: 28000,
    total: 297000,
  },
});

const generateMockDonorData = (): DonorData[] => {
  const donors = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Wilson', 'David Brown'];
  return donors.map((name, index) => ({
    id: `donor-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
    phone: `+233 ${Math.floor(Math.random() * 900000000) + 100000000}`,
    totalGiving: Math.random() * 15000 + 5000,
    transactionCount: Math.floor(Math.random() * 20) + 5,
    firstGift: '2024-01-15',
    lastGift: '2024-12-01',
    averageGift: Math.random() * 1000 + 200,
    transactions: [], // Would contain actual transaction data
  }));
};

export default function FinancialAnalyticsSection({ organisationId, branchId }: FinancialAnalyticsSectionProps) {
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState<'cash-flow' | 'comparative' | 'statements' | 'budget' | 'budget-management' | 'donors'>('cash-flow');
  const [loading, setLoading] = useState(false);

  // Default date range for analytics (current year)
  const [dateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    endDate: new Date(), // Today
  });

  // Mock data (replace with actual data fetching hooks)
  const cashFlowData = generateMockCashFlowData();
  const comparativeData = generateMockComparativeData();
  const financialData = generateMockFinancialData();
  const donorData = generateMockDonorData();

  const tabs = [
    { id: 'cash-flow', name: 'Cash Flow', icon: ChartBarIcon },
    { id: 'comparative', name: 'Comparative Analysis', icon: CalendarIcon },
    { id: 'statements', name: 'Financial Statements', icon: DocumentTextIcon },
    { id: 'budget', name: 'Budget vs Actual', icon: FunnelIcon },
    { id: 'budget-management', name: 'Budget Management', icon: ArrowTrendingUpIcon },
    { id: 'donors', name: 'Donor Statements', icon: UserGroupIcon },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting as ${format}`);
    // Implement export functionality
  };

  const handlePrint = () => {
    console.log('Printing...');
    // Implement print functionality
  };

  const handleGenerateStatement = (donorId: string, format: 'pdf' | 'email') => {
    console.log(`Generating ${format} statement for donor ${donorId}`);
    // Implement statement generation
  };

  const handleBulkGenerate = (donorIds: string[], format: 'pdf' | 'email') => {
    console.log(`Bulk generating ${format} statements for ${donorIds.length} donors`);
    // Implement bulk statement generation
  };

  return (
    <div className="space-y-6">
      {/* Analytics Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Analytics & Reports</h2>
            <p className="text-gray-600 mt-1">Comprehensive financial insights and reporting tools</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAnalyticsTab(tab.id as any)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeAnalyticsTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Analytics Content */}
        <div className="space-y-8">
          {activeAnalyticsTab === 'cash-flow' && (
            <CashFlowAnalysis dateRange={dateRange} />
          )}
          
          {activeAnalyticsTab === 'comparative' && (
            <ComparativePeriodAnalysis />
          )}

          {activeAnalyticsTab === 'statements' && (
            <FinancialStatements 
              organisationId={organisationId}
              branchId={branchId}
              dateRange={dateRange}
            />
          )}

          {activeAnalyticsTab === 'budget' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <BudgetVsActual 
                organisationId={organisationId}
                branchId={branchId}
                dateRange={dateRange}
              />
            </div>
          )}

          {activeAnalyticsTab === 'budget-management' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <BudgetManagement 
                organisationId={organisationId}
                branchId={branchId}
              />
            </div>
          )}

          {activeAnalyticsTab === 'donors' && (
            <DonorStatements
              donors={donorData}
              loading={loading}
              onGenerateStatement={handleGenerateStatement}
              onBulkGenerate={handleBulkGenerate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
