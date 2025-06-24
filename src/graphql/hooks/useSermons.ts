import { useQuery } from '@apollo/client';
import { GET_SERMONS } from '../queries/sermonQueries';

interface UseSermonsFilters {
  branchId?: string;
  speakerId?: string;
  seriesId?: string;
  status?: string;
}

const useSermons = (filters: UseSermonsFilters = {}) => {
  const { data, error, loading, refetch } = useQuery(GET_SERMONS, {
    variables: filters,
  });

  return {
    sermons: data?.findAll || [],
    loading,
    error,
    refetch,
  };
};

export default useSermons;
