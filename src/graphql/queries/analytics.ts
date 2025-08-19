import { gql } from '@apollo/client';

// Cash Flow Analysis Query
export const CASH_FLOW_ANALYSIS = gql`
  query CashFlowAnalysis($input: CashFlowAnalysisInput!) {
    cashFlowAnalysis(input: $input) {
      branchId
      organisationId
      periodStart
      periodEnd
      periodType
      totalIncome
      totalExpenses
      totalNetFlow
      averageMonthlyIncome
      averageMonthlyExpenses
      data {
        period
        income
        expenses
        netFlow
        cumulativeFlow
        incomeBreakdown
        expenseBreakdown
      }
    }
  }
`;

// Comparative Period Analysis Query
export const COMPARATIVE_PERIOD_ANALYSIS = gql`
  query ComparativePeriodAnalysis($input: ComparativePeriodAnalysisInput!) {
    comparativePeriodAnalysis(input: $input) {
      branchId
      organisationId
      comparisonType
      averageIncomeGrowthRate
      averageExpenseGrowthRate
      averageNetGrowthRate
      trend
      insights
      data {
        period
        currentIncome
        previousIncome
        currentExpenses
        previousExpenses
        currentNet
        previousNet
        incomeGrowthRate
        expenseGrowthRate
        netGrowthRate
        incomeVariance
        expenseVariance
        netVariance
      }
    }
  }
`;

// Member Giving Analysis Query
export const MEMBER_GIVING_ANALYSIS = gql`
  query MemberGivingAnalysis($input: MemberGivingAnalysisInput!) {
    memberGivingAnalysis(input: $input) {
      memberId
      memberName
      memberEmail
      periodStart
      periodEnd
      totalGiving
      contributionCount
      averageGift
      firstGift
      lastGift
      yearOverYearChange
      givingRank
      percentileRank
      givingTrend {
        direction
        changePercent
        consistency
      }
      monthlyBreakdown {
        month
        amount
        contributionCount
        averageGift
      }
      fundBreakdown {
        fundId
        fundName
        totalAmount
        contributionCount
        percentage
      }
      recentContributions {
        id
        date
        amount
        fundName
        description
        reference
      }
    }
  }
`;

// TypeScript interfaces for the analytics data
export interface CashFlowData {
  period: string;
  income: number;
  expenses: number;
  netFlow: number;
  cumulativeFlow: number;
  incomeBreakdown?: any;
  expenseBreakdown?: any;
}

export interface CashFlowAnalysisResult {
  branchId: string;
  organisationId: string;
  periodStart: string;
  periodEnd: string;
  periodType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  totalIncome: number;
  totalExpenses: number;
  totalNetFlow: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  data: CashFlowData[];
}

export interface ComparativePeriodData {
  period: string;
  currentIncome: number;
  previousIncome: number;
  currentExpenses: number;
  previousExpenses: number;
  currentNet: number;
  previousNet: number;
  incomeGrowthRate: number;
  expenseGrowthRate: number;
  netGrowthRate: number;
  incomeVariance: number;
  expenseVariance: number;
  netVariance: number;
}

export interface ComparativePeriodAnalysisResult {
  branchId: string;
  organisationId: string;
  comparisonType: 'YEAR_OVER_YEAR' | 'MONTH_OVER_MONTH' | 'QUARTER_OVER_QUARTER';
  averageIncomeGrowthRate: number;
  averageExpenseGrowthRate: number;
  averageNetGrowthRate: number;
  trend: string;
  insights: string;
  data: ComparativePeriodData[];
}

export interface GivingTrend {
  direction: 'INCREASING' | 'DECREASING' | 'STABLE';
  changePercent: number;
  consistency: number;
}

export interface MonthlyGiving {
  month: string;
  amount: number;
  contributionCount: number;
  averageGift: number;
}

export interface FundGiving {
  fundId: string;
  fundName: string;
  totalAmount: number;
  contributionCount: number;
  percentage: number;
}

export interface ContributionDetail {
  id: string;
  date: string;
  amount: number;
  fundName?: string;
  description?: string;
  reference?: string;
}

export interface MemberGivingAnalysisResult {
  memberId: string;
  memberName: string;
  memberEmail?: string;
  periodStart: string;
  periodEnd: string;
  totalGiving: number;
  contributionCount: number;
  averageGift: number;
  firstGift?: string;
  lastGift?: string;
  yearOverYearChange: number;
  givingRank: number;
  percentileRank: number;
  givingTrend: GivingTrend;
  monthlyBreakdown: MonthlyGiving[];
  fundBreakdown: FundGiving[];
  recentContributions: ContributionDetail[];
}

// Input types for the queries
export interface CashFlowAnalysisInput {
  organisationId: string;
  branchId?: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  periodType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  fundId?: string;
}

export interface ComparativePeriodAnalysisInput {
  organisationId: string;
  branchId?: string;
  comparisonType: 'YEAR_OVER_YEAR' | 'MONTH_OVER_MONTH' | 'QUARTER_OVER_QUARTER';
  periods?: number;
  fundId?: string;
}

export interface MemberGivingAnalysisInput {
  memberId: string;
  organisationId: string;
  branchId?: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  includeRecentContributions?: boolean;
  recentContributionsLimit?: number;
}
