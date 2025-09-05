import { useQuery } from "@apollo/client";
import { ADMIN_USERS_QUERY } from "../queries/adminQueries";
import { useOrganizationBranchFilter } from "./useOrganizationBranchFilter";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: { id: string; name: string }[];
}

export interface AdminUsersData {
  adminUsers: {
    items: AdminUser[];
    totalCount: number;
  };
}

export interface AdminUsersVars {
  pagination: { skip: number; take: number };
  filter: { isActive?: boolean; organisationId?: string };
}

export function useAdminUsers(variables: AdminUsersVars) {
  const { organisationId: orgFromContext } = useOrganizationBranchFilter();

  // Always include organisationId in filter if available
  const mergedVariables = {
    ...variables,
    filter: {
      ...variables.filter,
      ...(orgFromContext ? { organisationId: orgFromContext } : {}),
    },
  };

  const { data, loading, error, refetch } = useQuery<
    AdminUsersData,
    AdminUsersVars
  >(ADMIN_USERS_QUERY, { variables: mergedVariables });
  return {
    adminUsers: data?.adminUsers.items || [],
    totalCount: data?.adminUsers.totalCount || 0,
    loading,
    error,
    refetch,
  };
}
