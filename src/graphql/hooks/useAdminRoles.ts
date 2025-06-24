import { useQuery } from '@apollo/client';
import { GET_ADMIN_ROLES } from '../queries/adminRoleQueries';

export interface Permission {
  id: string;
  action: string;
  subject: string;
  description: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface AdminRolesData {
  adminRoles: AdminRole[];
}

export const useAdminRoles = () => {
  const { data, loading, error } = useQuery<AdminRolesData>(GET_ADMIN_ROLES);
  return {
    roles: data?.adminRoles || [],
    loading,
    error,
  };
};
