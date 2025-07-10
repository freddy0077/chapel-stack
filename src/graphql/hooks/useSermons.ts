import { useQuery } from '@apollo/client';
import { GET_SERMONS } from '../queries/sermonQueries';

interface UseSermonsFilters {
  branchId?: string;
  speakerId?: string;
  seriesId?: string;
  status?: string;
}

const useSermons = (filters: UseSermonsFilters = {}) => {
  // Only pass supported arguments: branchId
  const supportedFilters: { branchId?: string } = {};
  if (filters.branchId) supportedFilters.branchId = filters.branchId;

  const { data, error, loading, refetch } = useQuery(GET_SERMONS, {
    variables: supportedFilters,
  });

  return {
    sermons: data?.findAll || [],
    loading,
    error,
    refetch,
  };
};

export default useSermons;
