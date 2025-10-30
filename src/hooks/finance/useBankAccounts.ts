import { useQuery, useMutation } from '@apollo/client';
import { GET_BANK_ACCOUNTS, GET_BANK_ACCOUNT_BY_ID } from '@/graphql/finance/queries';
import {
  CREATE_BANK_ACCOUNT,
  UPDATE_BANK_BALANCE,
  DEACTIVATE_BANK_ACCOUNT,
} from '@/graphql/finance/mutations';
import { useToast } from '@/hooks/use-toast';

interface UseBankAccountsProps {
  organisationId: string;
  branchId: string;
}

export const useBankAccounts = ({
  organisationId,
  branchId,
}: UseBankAccountsProps) => {
  const { toast } = useToast();

  // Query bank accounts
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_BANK_ACCOUNTS, {
    variables: {
      organisationId,
      branchId,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Create bank account mutation
  const [createBankAccountMutation, { loading: creating }] = useMutation(CREATE_BANK_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Bank account created successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create bank account',
        variant: 'destructive',
      });
    },
  });

  // Update bank balance mutation
  const [updateBankBalanceMutation, { loading: updating }] = useMutation(UPDATE_BANK_BALANCE, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Bank balance updated successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update bank balance',
        variant: 'destructive',
      });
    },
  });

  // Deactivate bank account mutation
  const [deactivateBankAccountMutation, { loading: deactivating }] = useMutation(DEACTIVATE_BANK_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Bank account deactivated successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate bank account',
        variant: 'destructive',
      });
    },
  });

  const bankAccounts = data?.bankAccounts || [];

  // Calculate summary statistics
  const totalBalance = bankAccounts.reduce((sum: number, acc: any) => sum + (acc.bookBalance || 0), 0);
  const unreconciledCount = bankAccounts.filter((acc: any) => 
    Math.abs((acc.bankBalance || 0) - (acc.bookBalance || 0)) > 0.01
  ).length;
  const totalDifference = bankAccounts.reduce((sum: number, acc: any) => 
    sum + Math.abs((acc.bankBalance || 0) - (acc.bookBalance || 0)), 0
  );

  return {
    bankAccounts,
    totalBalance,
    unreconciledCount,
    totalDifference,
    loading,
    error,
    refetch,
    createBankAccount: (input: any) => createBankAccountMutation({ variables: { input } }),
    updateBankBalance: (id: string, bankBalance: number) => 
      updateBankBalanceMutation({ variables: { id, bankBalance } }),
    deactivateBankAccount: (id: string) => deactivateBankAccountMutation({ variables: { id } }),
    creating,
    updating,
    deactivating,
  };
};

export const useBankAccount = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_BANK_ACCOUNT_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    bankAccount: data?.bankAccount || null,
    loading,
    error,
    refetch,
  };
};
