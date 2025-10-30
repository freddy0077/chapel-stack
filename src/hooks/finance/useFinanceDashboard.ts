import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS, GET_RECENT_TRANSACTIONS, GET_PENDING_APPROVALS } from '@/graphql/finance/queries';

interface UseFinanceDashboardProps {
  organisationId: string;
  branchId: string;
  startDate?: Date;
  endDate?: Date;
}

export const useFinanceDashboard = ({
  organisationId,
  branchId,
  startDate,
  endDate,
}: UseFinanceDashboardProps) => {
  // Get dashboard stats
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery(GET_DASHBOARD_STATS, {
    variables: {
      organisationId,
      branchId,
      dateRange: startDate && endDate ? {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      } : undefined,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Get recent transactions
  const {
    data: transactionsData,
    loading: transactionsLoading,
    error: transactionsError,
  } = useQuery(GET_RECENT_TRANSACTIONS, {
    variables: {
      organisationId,
      branchId,
      take: 5,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Get pending approvals
  const {
    data: approvalsData,
    loading: approvalsLoading,
    error: approvalsError,
  } = useQuery(GET_PENDING_APPROVALS, {
    variables: {
      organisationId,
      branchId,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  const loading = statsLoading || transactionsLoading || approvalsLoading;
  const error = statsError || transactionsError || approvalsError;

  // Map transactionStats to dashboard stats format
  const transactionStats = statsData?.transactionStats;
  const mappedStats = transactionStats ? {
    income: transactionStats.totalIncome || 0,
    expenses: transactionStats.totalExpenses || 0,
    balance: transactionStats.netBalance || 0,
    offerings: transactionStats.totalOfferings || 0,
    // Calculate change percentages (would need previous period data for accurate calculation)
    incomeChange: 0,
    expensesChange: 0,
    balanceChange: 0,
    offeringsChange: 0,
  } : null;

  // Map transactions to expected format
  const recentTransactions = (transactionsData?.transactions?.items || []).map((t: any) => ({
    id: t.id,
    description: t.description || t.reference || 'Transaction',
    entryDate: t.date,
    totalDebit: t.type === 'EXPENSE' ? t.amount : 0,
    totalCredit: t.type === 'CONTRIBUTION' ? t.amount : 0,
  }));

  return {
    stats: mappedStats,
    recentTransactions,
    pendingJournalEntries: [],  // Will be populated when backend schema is updated
    pendingOfferings: [],  // Will be populated when backend schema is updated
    pendingCount: 0,
    loading,
    error,
    refetch: refetchStats,
  };
};
