import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

// GraphQL query to search for pastoral staff using the new backend endpoint
const SEARCH_PASTORAL_STAFF = gql`
  query SearchPastoralStaff($organisationId: ID!, $branchId: ID, $search: String) {
    searchPastoralStaff(
      organisationId: $organisationId
      branchId: $branchId
      search: $search
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        roles
        isActive
      }
      totalCount
      hasNextPage
    }
  }
`;

// GraphQL query to search for pastors only using the new backend endpoint
const SEARCH_PASTORS = gql`
  query SearchPastors($organisationId: ID!, $branchId: ID, $search: String) {
    searchPastors(
      organisationId: $organisationId
      branchId: $branchId
      search: $search
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        roles
        isActive
      }
      totalCount
      hasNextPage
    }
  }
`;

export interface PastoralStaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  roles?: string[];
  isActive: boolean;
}

export function useSearchPastoralStaff(
  search: string,
  organisationId: string,
  branchId?: string,
  specificRoles?: string[]
) {
  const { data, loading, error } = useQuery<{ 
    searchPastoralStaff: { 
      items: PastoralStaffUser[];
      totalCount: number;
      hasNextPage: boolean;
    } 
  }>(
    SEARCH_PASTORAL_STAFF,
    {
      variables: {
        organisationId,
        branchId,
        search: search.trim(),
      },
      skip: !organisationId || search.trim().length < 2,
      fetchPolicy: "cache-and-network",
    }
  );

  // Get the pastoral staff from the new backend endpoint
  const pastoralStaff = data?.searchPastoralStaff?.items || [];

  // If specific roles are requested, filter on frontend (for backward compatibility)
  const filteredStaff = specificRoles 
    ? pastoralStaff.filter(user => 
        user.roles?.some(role => 
          specificRoles.includes(role)
        )
      )
    : pastoralStaff;

  return {
    pastoralStaff: filteredStaff,
    loading,
    error,
    totalCount: data?.searchPastoralStaff?.totalCount || 0,
    hasNextPage: data?.searchPastoralStaff?.hasNextPage || false,
  };
}

// Specialized hook for searching only pastors using dedicated backend endpoint
export function useSearchPastors(
  search: string,
  organisationId: string,
  branchId?: string
) {
  const { data, loading, error } = useQuery<{ 
    searchPastors: { 
      items: PastoralStaffUser[];
      totalCount: number;
      hasNextPage: boolean;
    } 
  }>(
    SEARCH_PASTORS,
    {
      variables: {
        organisationId,
        branchId,
        search: search.trim(),
      },
      skip: !organisationId || search.trim().length < 2,
      fetchPolicy: "cache-and-network",
    }
  );

  return {
    pastoralStaff: data?.searchPastors?.items || [],
    loading,
    error,
    totalCount: data?.searchPastors?.totalCount || 0,
    hasNextPage: data?.searchPastors?.hasNextPage || false,
  };
}
