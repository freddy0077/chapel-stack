import { gql } from '@apollo/client';

export const BUDGET_VS_ACTUAL_QUERY = gql`
  query BudgetVsActual($input: BudgetVsActualInput!) {
    budgetVsActual(input: $input) {
      organisationId
      branchId
      periodStart
      periodEnd
      periodType
      generatedAt
      notes
      
      summary {
        totalBudgeted
        totalActual
        totalVariance
        totalVariancePercent
        budgetUtilization
        overallStatus
      }
      
      revenueItems {
        category
        description
        budgetedAmount
        actualAmount
        variance
        variancePercent
        status
        fundName
        period
      }
      
      expenseItems {
        category
        description
        budgetedAmount
        actualAmount
        variance
        variancePercent
        status
        fundName
        period
      }
    }
  }
`;

export interface BudgetLineItem {
  category: string;
  description: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  status: 'over_budget' | 'under_budget' | 'on_target';
  fundName?: string;
  period?: string;
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalActual: number;
  totalVariance: number;
  totalVariancePercent: number;
  budgetUtilization: number;
  overallStatus: string;
}

export interface BudgetVsActual {
  organisationId: string;
  branchId?: string;
  periodStart: string;
  periodEnd: string;
  periodType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  generatedAt: string;
  notes?: string;
  summary: BudgetSummary;
  revenueItems: BudgetLineItem[];
  expenseItems: BudgetLineItem[];
}

export interface BudgetVsActualInput {
  organisationId: string;
  branchId?: string;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  periodType?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  fundId?: string;
}
