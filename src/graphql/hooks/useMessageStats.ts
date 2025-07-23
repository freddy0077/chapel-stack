import { useQuery } from '@apollo/client';
import { GET_MESSAGE_STATS } from '../queries/messageQueries';
import { useAuth } from '@/contexts/AuthContext';

export function useMessageStats() {
  const { user } = useAuth();
  const organisationId = user?.organisationId;
  const branchId = user?.userBranches?.[0]?.branch?.id;

  const { data, loading, error, refetch } = useQuery(GET_MESSAGE_STATS, {
    variables: {
      filter: {
        organisationId,
        branchId,
      }
    },
    fetchPolicy: 'network-only',
    skip: !organisationId,
  });

  return {
    stats: data?.communicationStats || null,
    loading,
    error,
    refetch,
  };
}
