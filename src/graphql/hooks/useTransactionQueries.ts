import { gql, useQuery } from '@apollo/client';

const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $organisationId: String!
    $branchId: String
    $type: TransactionType
    $fundId: String
    $paginationInput: PaginationInput
    $dateRange: DateRangeInput
  ) {
    transactions(
      organisationId: $organisationId
      branchId: $branchId
      type: $type
      fundId: $fundId
      paginationInput: $paginationInput
      dateRange: $dateRange
    ) {
      items {
        id
        type
        amount
        date
        description
        reference
        fundId
        branchId
        organisationId
        userId
        metadata
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
      stats {
        totalIncome
        totalExpenses
        totalTithes
        totalPledges
        totalOfferings
        netBalance
      }
    }
  }
`;

const GET_TRANSACTION_STATS = gql`
  query GetTransactionStats(
    $organisationId: String!
    $fundId: String
    $dateRange: DateRangeInput
  ) {
    transactionStats(
      organisationId: $organisationId
      fundId: $fundId
      dateRange: $dateRange
    ) {
      totalIncome
      totalExpenses
      totalTithes
      totalPledges
      totalOfferings
      netBalance
    }
  }
`;

export const useTransactionsQuery = (variables: {
  organisationId: string;
  branchId?: string;
  type?: string;
  fundId?: string;
  skip?: number;
  take?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const { organisationId, branchId, type, fundId, skip = 0, take = 10, startDate, endDate } = variables;
  
  // Create dateRange object if dates are provided, converting string dates to Date objects
  const dateRange = (startDate || endDate) 
    ? { 
        startDate: startDate ? new Date(startDate).toISOString() : null, 
        endDate: endDate ? new Date(endDate).toISOString() : null 
      } 
    : undefined;
  
  return useQuery(GET_TRANSACTIONS, {
    variables: {
      organisationId,
      ...(branchId && { branchId }),
      ...(type && { type }),
      ...(fundId && { fundId }),
      paginationInput: { skip, take },
      ...(dateRange && { dateRange }),
    },
    notifyOnNetworkStatusChange: true,
  });
};

export const useTransactionStatsQuery = (variables: {
  organisationId: string;
  fundId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { organisationId, fundId, startDate, endDate } = variables;
  
  // Create dateRange object if dates are provided, converting string dates to Date objects
  const dateRange = (startDate || endDate) 
    ? { 
        startDate: startDate ? new Date(startDate).toISOString() : null, 
        endDate: endDate ? new Date(endDate).toISOString() : null 
      } 
    : undefined;
  
  return useQuery(GET_TRANSACTION_STATS, {
    variables: {
      organisationId,
      ...(fundId && { fundId }),
      ...(dateRange && { dateRange }),
    },
  });
};
