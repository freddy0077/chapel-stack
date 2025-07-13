import { useQuery, gql } from '@apollo/client';

const GET_BRANCH_EVENTS = gql`
  query GetBranchEvents($branchId: String!, $organisationId: String) {
    events(branchId: $branchId, organisationId: $organisationId) {
      id
      title
      startDate
      endDate
      description
    }
  }
`;

export function useBranchEvents(branchId?: string, organisationId?: string) {
  // Add validation to ensure we have at least one parameter
  const hasValidParams = branchId || organisationId;
  
  // Debug parameters
  console.log('useBranchEvents params:', { branchId, organisationId, hasValidParams });
  
  const { data, loading, error, refetch } = useQuery(GET_BRANCH_EVENTS, {
    variables: {
      branchId: branchId || '', // Ensure we always send a string
      organisationId: organisationId || undefined,
    },
    skip: !hasValidParams,
    fetchPolicy: 'network-only', // Force network fetch to ensure fresh data
  });
  
  // Debug query results
  console.log('useBranchEvents result:', { 
    hasData: !!data, 
    events: data?.events || [], 
    loading, 
    hasError: !!error 
  });

  return {
    events: data?.events || [],
    loading,
    error,
    refetch
  };
}
