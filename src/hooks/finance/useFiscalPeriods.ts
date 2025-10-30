import { useQuery, useMutation } from '@apollo/client';
import { GET_FISCAL_PERIODS, GET_CURRENT_FISCAL_PERIOD } from '@/graphql/finance/queries';
import {
  CREATE_FISCAL_YEAR,
  CLOSE_FISCAL_PERIOD,
  REOPEN_FISCAL_PERIOD,
  LOCK_FISCAL_PERIOD,
} from '@/graphql/finance/mutations';
import { useToast } from '@/hooks/use-toast';

interface UseFiscalPeriodsProps {
  organisationId: string;
  branchId: string;
  fiscalYear?: number;
}

export const useFiscalPeriods = ({
  organisationId,
  branchId,
  fiscalYear,
}: UseFiscalPeriodsProps) => {
  const { toast } = useToast();

  // Query fiscal periods
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_FISCAL_PERIODS, {
    variables: {
      organisationId,
      branchId,
      fiscalYear,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Query current fiscal period
  const {
    data: currentData,
    loading: currentLoading,
    error: currentError,
  } = useQuery(GET_CURRENT_FISCAL_PERIOD, {
    variables: {
      organisationId,
      branchId,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Create fiscal year mutation
  const [createFiscalYearMutation, { loading: creating }] = useMutation(CREATE_FISCAL_YEAR, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Fiscal year created successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create fiscal year',
        variant: 'destructive',
      });
    },
  });

  // Close fiscal period mutation
  const [closeFiscalPeriodMutation, { loading: closing }] = useMutation(CLOSE_FISCAL_PERIOD, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Fiscal period closed successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to close fiscal period',
        variant: 'destructive',
      });
    },
  });

  // Reopen fiscal period mutation
  const [reopenFiscalPeriodMutation, { loading: reopening }] = useMutation(REOPEN_FISCAL_PERIOD, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Fiscal period reopened successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reopen fiscal period',
        variant: 'destructive',
      });
    },
  });

  // Lock fiscal period mutation
  const [lockFiscalPeriodMutation, { loading: locking }] = useMutation(LOCK_FISCAL_PERIOD, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Fiscal period locked successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to lock fiscal period',
        variant: 'destructive',
      });
    },
  });

  return {
    periods: data?.fiscalPeriods || [],
    currentPeriod: currentData?.currentFiscalPeriod || null,
    loading: loading || currentLoading,
    error: error || currentError,
    refetch,
    createFiscalYear: (input: any) => createFiscalYearMutation({ variables: { input } }),
    closeFiscalPeriod: (input: any) => closeFiscalPeriodMutation({ variables: { input } }),
    reopenFiscalPeriod: (input: any) => reopenFiscalPeriodMutation({ variables: { input } }),
    lockFiscalPeriod: (input: any) => lockFiscalPeriodMutation({ variables: { input } }),
    creating,
    closing,
    reopening,
    locking,
  };
};
