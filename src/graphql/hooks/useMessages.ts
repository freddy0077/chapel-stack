import { useQuery } from '@apollo/client';
import { ALL_MESSAGES_QUERY } from '../queries/messageQueries';
import { useAuth } from './useAuth';

export function useMessages(branchId?: string) {
  const { user } = useAuth();
  const effectiveBranchId = branchId ?? (user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined);
  const { data, loading, error, refetch } = useQuery(ALL_MESSAGES_QUERY, {
    variables: { filter: { branchId: effectiveBranchId } },
    skip: !effectiveBranchId,
  });
  return {
    messages: data?.allMessages || [],
    loading,
    error,
    refetch,
  };
}
