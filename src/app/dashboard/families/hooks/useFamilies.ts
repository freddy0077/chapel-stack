import { useQuery } from '@apollo/client';
import { GET_FAMILIES_LIST, GET_FAMILIES_COUNT, Family } from '@/graphql/queries/familyQueries';

interface UseFamiliesOptions {
  skip?: number;
  take?: number;
}

interface UseFamiliesResult {
  families: Family[];
  totalCount: number;
  loading: boolean;
  error: any;
  refetch: () => void;
  refetchCount: () => void;
}

export const useFamilies = ({ skip = 0, take = 12 }: UseFamiliesOptions = {}): UseFamiliesResult => {
  const {
    data: familiesData,
    loading: familiesLoading,
    error: familiesError,
    refetch: refetchFamilies,
  } = useQuery(GET_FAMILIES_LIST, {
    variables: { skip, take },
    fetchPolicy: 'cache-and-network',
  });

  const {
    data: countData,
    loading: countLoading,
    error: countError,
    refetch: refetchCount,
  } = useQuery(GET_FAMILIES_COUNT, {
    fetchPolicy: 'cache-and-network',
  });

  const refetch = () => {
    refetchFamilies();
    refetchCount();
  };

  return {
    families: familiesData?.families || [],
    totalCount: countData?.familiesCount || 0,
    loading: familiesLoading || countLoading,
    error: familiesError || countError,
    refetch,
    refetchCount,
  };
};
