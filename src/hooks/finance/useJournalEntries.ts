import { useQuery, useMutation } from '@apollo/client';
import { GET_JOURNAL_ENTRIES, GET_JOURNAL_ENTRY_BY_ID } from '@/graphql/finance/queries';
import {
  CREATE_JOURNAL_ENTRY,
  POST_JOURNAL_ENTRY,
  VOID_JOURNAL_ENTRY,
  REVERSE_JOURNAL_ENTRY,
} from '@/graphql/finance/mutations';
import { useToast } from '@/hooks/use-toast';
import { useConflictDialog } from '@/components/finance/ConflictDialog';

interface UseJournalEntriesProps {
  organisationId: string;
  branchId: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  take?: number;
}

export const useJournalEntries = ({
  organisationId,
  branchId,
  status,
  startDate,
  endDate,
  skip = 0,
  take = 50,
}: UseJournalEntriesProps) => {
  const { toast } = useToast();
  const { showConflict, isConflictError } = useConflictDialog();

  // Query journal entries
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_JOURNAL_ENTRIES, {
    variables: {
      organisationId,
      branchId,
      status,
      startDate,
      endDate,
      skip,
      take,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Create journal entry mutation
  const [createJournalEntryMutation, { loading: creating }] = useMutation(CREATE_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Journal entry created successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create journal entry',
        variant: 'destructive',
      });
    },
  });

  // Post journal entry mutation with optimistic locking
  const [postJournalEntryMutation, { loading: posting }] = useMutation(POST_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Journal entry posted successfully',
      });
      refetch();
    },
    onError: (error) => {
      // Check if it's a conflict error
      if (isConflictError(error)) {
        showConflict(error.message, 'Journal Entry');
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to post journal entry',
          variant: 'destructive',
        });
      }
    },
  });

  // Void journal entry mutation with optimistic locking
  const [voidJournalEntryMutation, { loading: voiding }] = useMutation(VOID_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Journal entry voided successfully',
      });
      refetch();
    },
    onError: (error) => {
      // Check if it's a conflict error
      if (isConflictError(error)) {
        showConflict(error.message, 'Journal Entry');
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to void journal entry',
          variant: 'destructive',
        });
      }
    },
  });

  // Reverse journal entry mutation
  const [reverseJournalEntryMutation, { loading: reversing }] = useMutation(REVERSE_JOURNAL_ENTRY, {
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Reversing entry created successfully',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create reversing entry',
        variant: 'destructive',
      });
    },
  });

  return {
    entries: data?.journalEntries?.items || [],
    totalCount: data?.journalEntries?.totalCount || 0,
    loading,
    error,
    refetch,
    createJournalEntry: (input: any) => createJournalEntryMutation({ variables: { input } }),
    postJournalEntry: (id: string, version?: number) => 
      postJournalEntryMutation({ variables: { id, version } }),
    voidJournalEntry: (input: any, version?: number) => 
      voidJournalEntryMutation({ variables: { input, version } }),
    reverseJournalEntry: (input: any) => reverseJournalEntryMutation({ variables: { input } }),
    creating,
    posting,
    voiding,
    reversing,
  };
};

export const useJournalEntry = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_JOURNAL_ENTRY_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    entry: data?.journalEntry || null,
    loading,
    error,
    refetch,
  };
};
