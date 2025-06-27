import { useQuery } from '@apollo/client';
import { GET_PRAYER_REQUESTS } from '../queries/prayer-requests';

export function usePrayerRequests(organisationId?: string, branchId?: string) {
  const skip = !organisationId;
  const { data, loading, error, refetch } = useQuery(GET_PRAYER_REQUESTS, {
    variables: { organisationId, branchId },
    skip,
    fetchPolicy: 'cache-and-network',
  });

  return {
    prayerRequests: data?.prayerRequests || [],
    loading,
    error,
    refetch,
  };
}
