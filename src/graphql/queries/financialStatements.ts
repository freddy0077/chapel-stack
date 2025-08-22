import { gql } from '@apollo/client';

export const FINANCIAL_STATEMENTS_QUERY = gql`
  query FinancialStatements($input: FinancialStatementsInput!) {
    financialStatements(input: $input) {
      branchId
      organisationId
      statementType
      periodStart
      periodEnd
      generatedAt
      notes
      
      incomeStatement {
        branchId
        organisationId
        periodStart
        periodEnd
        totalRevenue
        totalExpenses
        netIncome
        previousTotalRevenue
        previousTotalExpenses
        previousNetIncome
        revenue {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
          subItems {
            category
            description
            currentPeriod
            previousPeriod
            variance
            variancePercent
          }
        }
        expenses {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
          subItems {
            category
            description
            currentPeriod
            previousPeriod
            variance
            variancePercent
          }
        }
      }
      
      balanceSheet {
        branchId
        organisationId
        asOfDate
        totalAssets
        totalLiabilities
        totalNetAssets
        assets {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
          subItems {
            category
            description
            currentPeriod
            previousPeriod
            variance
            variancePercent
          }
        }
        liabilities {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
          subItems {
            category
            description
            currentPeriod
            previousPeriod
            variance
            variancePercent
          }
        }
        netAssets {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
          subItems {
            category
            description
            currentPeriod
            previousPeriod
            variance
            variancePercent
          }
        }
      }
      
      cashFlowStatement {
        branchId
        organisationId
        periodStart
        periodEnd
        netCashFromOperating
        netCashFromInvesting
        netCashFromFinancing
        netChangeInCash
        beginningCashBalance
        endingCashBalance
        operatingActivities {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
        }
        investingActivities {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
        }
        financingActivities {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
        }
      }
      
      statementOfNetAssets {
        branchId
        organisationId
        periodStart
        periodEnd
        totalUnrestricted
        totalTemporarilyRestricted
        totalPermanentlyRestricted
        totalNetAssets
        unrestricted {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
        }
        temporarilyRestricted {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
        }
        permanentlyRestricted {
          category
          description
          currentPeriod
          previousPeriod
          variance
          variancePercent
        }
      }
    }
  }
`;

export interface FinancialLineItem {
  category: string;
  description: string;
  currentPeriod: number;
  previousPeriod?: number;
  variance?: number;
  variancePercent?: number;
  subItems?: FinancialLineItem[];
}

export interface IncomeStatement {
  branchId: string;
  organisationId: string;
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  previousTotalRevenue?: number;
  previousTotalExpenses?: number;
  previousNetIncome?: number;
  revenue: FinancialLineItem[];
  expenses: FinancialLineItem[];
}

export interface BalanceSheet {
  branchId: string;
  organisationId: string;
  asOfDate: string;
  totalAssets: number;
  totalLiabilities: number;
  totalNetAssets: number;
  assets: FinancialLineItem[];
  liabilities: FinancialLineItem[];
  netAssets: FinancialLineItem[];
}

export interface CashFlowStatement {
  branchId: string;
  organisationId: string;
  periodStart: string;
  periodEnd: string;
  netCashFromOperating: number;
  netCashFromInvesting: number;
  netCashFromFinancing: number;
  netChangeInCash: number;
  beginningCashBalance: number;
  endingCashBalance: number;
  operatingActivities: FinancialLineItem[];
  investingActivities: FinancialLineItem[];
  financingActivities: FinancialLineItem[];
}

export interface StatementOfNetAssets {
  branchId: string;
  organisationId: string;
  periodStart: string;
  periodEnd: string;
  totalUnrestricted: number;
  totalTemporarilyRestricted: number;
  totalPermanentlyRestricted: number;
  totalNetAssets: number;
  unrestricted: FinancialLineItem[];
  temporarilyRestricted: FinancialLineItem[];
  permanentlyRestricted: FinancialLineItem[];
}

export interface FinancialStatements {
  branchId: string;
  organisationId: string;
  statementType: 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW_STATEMENT' | 'STATEMENT_OF_NET_ASSETS';
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  notes?: string;
  incomeStatement?: IncomeStatement;
  balanceSheet?: BalanceSheet;
  cashFlowStatement?: CashFlowStatement;
  statementOfNetAssets?: StatementOfNetAssets;
}

export interface FinancialStatementsInput {
  organisationId: string;
  branchId?: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  statementType: 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW_STATEMENT' | 'STATEMENT_OF_NET_ASSETS';
  fundId?: string;
  includeComparative?: boolean;
}
