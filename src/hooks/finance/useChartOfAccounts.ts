import { useQuery, useMutation } from '@apollo/client';
import { GET_CHART_OF_ACCOUNTS, GET_ACCOUNT_BALANCE } from '@/graphql/finance/queries';
import { CREATE_ACCOUNT, UPDATE_ACCOUNT, DEACTIVATE_ACCOUNT } from '@/graphql/finance/mutations';
import { useToast } from '@/hooks/use-toast';

interface UseChartOfAccountsProps {
  organisationId: string;
  branchId: string;
  accountType?: string;
}

export const useChartOfAccounts = ({
  organisationId,
  branchId,
  accountType,
}: UseChartOfAccountsProps) => {
  const { toast } = useToast();

  // Query accounts
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_CHART_OF_ACCOUNTS, {
    variables: {
      organisationId,
      branchId,
      accountType,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Create account mutation
  const [createAccountMutation, { loading: creating }] = useMutation(CREATE_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });

  // Update account mutation
  const [updateAccountMutation, { loading: updating }] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Account updated successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update account',
        variant: 'destructive',
      });
    },
  });

  // Deactivate account mutation
  const [deactivateAccountMutation, { loading: deactivating }] = useMutation(DEACTIVATE_ACCOUNT, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Account deactivated successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate account',
        variant: 'destructive',
      });
    },
  });

  // Helper function to build account hierarchy
  const buildAccountHierarchy = (accounts: any[]) => {
    const accountMap = new Map();
    const rootAccounts: any[] = [];

    // First pass: create map
    accounts.forEach((account) => {
      accountMap.set(account.id, { ...account, subAccounts: [] });
    });

    // Second pass: build hierarchy
    accounts.forEach((account) => {
      const accountWithSubs = accountMap.get(account.id);
      if (account.parentAccountId) {
        const parent = accountMap.get(account.parentAccountId);
        if (parent) {
          parent.subAccounts.push(accountWithSubs);
        } else {
          rootAccounts.push(accountWithSubs);
        }
      } else {
        rootAccounts.push(accountWithSubs);
      }
    });

    return rootAccounts;
  };

  const accounts = data?.chartOfAccounts || [];
  const accountsWithHierarchy = buildAccountHierarchy(accounts);

  return {
    accounts: accountsWithHierarchy,
    flatAccounts: accounts,
    loading,
    error,
    refetch,
    createAccount: (input: any) => createAccountMutation({ variables: { input } }),
    updateAccount: (id: string, input: any) => updateAccountMutation({ variables: { id, input } }),
    deactivateAccount: (id: string) => deactivateAccountMutation({ variables: { id } }),
    creating,
    updating,
    deactivating,
  };
};

export const useAccountBalance = (accountId: string, asOfDate?: Date) => {
  const { data, loading, error } = useQuery(GET_ACCOUNT_BALANCE, {
    variables: {
      accountId,
      asOfDate,
    },
    skip: !accountId,
  });

  return {
    balance: data?.accountBalance || null,
    loading,
    error,
  };
};
