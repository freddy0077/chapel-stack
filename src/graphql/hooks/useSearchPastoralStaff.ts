import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

// GraphQL query to search for pastoral staff users using the existing users query
const SEARCH_PASTORAL_STAFF = gql`
  query SearchPastoralStaff($organisationId: ID!, $branchId: ID, $search: String) {
    findAllUsers(
      filter: {
        organisationId: $organisationId
        branchId: $branchId
        search: $search
      }
      pagination: { skip: 0, take: 20 }
    ) {
      items {
        id
        firstName
        lastName
        email
        phoneNumber
        userBranches {
          branch {
            id
            name
          }
          role {
            id
            name
          }
        }
      }
    }
  }
`;

export interface PastoralStaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userBranches: Array<{
    branch: {
      id: string;
      name: string;
    };
    role: {
      id: string;
      name: string;
    };
  }>;
}

export function useSearchPastoralStaff(
  search: string,
  organisationId: string,
  branchId?: string
) {
  const { data, loading, error } = useQuery<{ 
    findAllUsers: { 
      items: PastoralStaffUser[] 
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

  // Filter to only include pastoral staff (users with PASTOR, BRANCH_ADMIN, or STAFF roles)
  const pastoralStaff = (data?.findAllUsers?.items || []).filter(user => 
    user.userBranches.some(ub => 
      ['PASTOR', 'BRANCH_ADMIN', 'STAFF'].includes(ub.role.name)
    )
  );

  return {
    pastoralStaff,
    loading,
    error,
  };
}
