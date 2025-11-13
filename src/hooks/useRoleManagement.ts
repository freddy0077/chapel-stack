'use client';

import { useQuery, useMutation, ApolloError } from '@apollo/client';
import {
  GOD_MODE_GET_ROLES,
  GOD_MODE_GET_ROLE,
  GOD_MODE_GET_ROLE_HIERARCHY,
  GOD_MODE_GET_ROLE_USERS,
  GOD_MODE_GET_USER_ROLES,
} from '@/graphql/queries/roleQueries';
import {
  GOD_MODE_CREATE_ROLE,
  GOD_MODE_UPDATE_ROLE,
  GOD_MODE_DELETE_ROLE,
  GOD_MODE_ASSIGN_ROLE_TO_USER,
  GOD_MODE_REMOVE_ROLE_FROM_USER,
} from '@/graphql/mutations/roleMutations';

export interface RoleFilter {
  search?: string;
  level?: number;
  skip?: number;
  take?: number;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  level: number;
  permissions?: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  level?: number;
  permissions?: string[];
}

/**
 * Hook to fetch all roles with optional filtering
 */
export function useRoles(filter?: RoleFilter) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_ROLES, {
    variables: {
      search: filter?.search,
      level: filter?.level,
      skip: filter?.skip || 0,
      take: filter?.take || 50,
    },
    skip: !filter,
  });

  return {
    roles: data?.godModeRoles?.roles || [],
    total: data?.godModeRoles?.total || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a single role by ID
 */
export function useRole(roleId?: string) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_ROLE, {
    variables: { id: roleId },
    skip: !roleId,
  });

  return {
    role: data?.godModeRole,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch role hierarchy
 */
export function useRoleHierarchy() {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_ROLE_HIERARCHY);

  return {
    hierarchy: data?.godModeRoleHierarchy,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch users with a specific role
 */
export function useRoleUsers(roleId?: string, skip?: number, take?: number) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_ROLE_USERS, {
    variables: {
      roleId,
      skip: skip || 0,
      take: take || 20,
    },
    skip: !roleId,
  });

  return {
    users: data?.godModeRoleUsers?.roles || [],
    total: data?.godModeRoleUsers?.total || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch user's roles
 */
export function useUserRoles(userId?: string) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_USER_ROLES, {
    variables: { userId },
    skip: !userId,
  });

  return {
    roles: data?.godModeUserRoles || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to create a new role
 */
export function useCreateRole() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_CREATE_ROLE, {
    refetchQueries: [{ query: GOD_MODE_GET_ROLES }],
  });

  const createRole = async (input: CreateRoleInput) => {
    try {
      const { data } = await mutate({
        variables: { input },
      });
      return data?.godModeCreateRole;
    } catch (err) {
      console.error('Error creating role:', err);
      throw err;
    }
  };

  return {
    createRole,
    loading,
    error,
  };
}

/**
 * Hook to update an existing role
 */
export function useUpdateRole() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_UPDATE_ROLE, {
    refetchQueries: [{ query: GOD_MODE_GET_ROLES }],
  });

  const updateRole = async (id: string, input: UpdateRoleInput) => {
    try {
      const { data } = await mutate({
        variables: { id, input },
      });
      return data?.godModeUpdateRole;
    } catch (err) {
      console.error('Error updating role:', err);
      throw err;
    }
  };

  return {
    updateRole,
    loading,
    error,
  };
}

/**
 * Hook to delete a role
 */
export function useDeleteRole() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_DELETE_ROLE, {
    refetchQueries: [{ query: GOD_MODE_GET_ROLES }],
  });

  const deleteRole = async (id: string) => {
    try {
      const { data } = await mutate({
        variables: { id },
      });
      return data?.godModeDeleteRole;
    } catch (err) {
      console.error('Error deleting role:', err);
      throw err;
    }
  };

  return {
    deleteRole,
    loading,
    error,
  };
}

/**
 * Hook to assign a role to a user
 */
export function useAssignRoleToUser() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_ASSIGN_ROLE_TO_USER, {
    refetchQueries: [{ query: GOD_MODE_GET_ROLES }],
  });

  const assignRoleToUser = async (userId: string, roleId: string) => {
    try {
      const { data } = await mutate({
        variables: { userId, roleId },
      });
      return data?.godModeAssignRoleToUser;
    } catch (err) {
      console.error('Error assigning role to user:', err);
      throw err;
    }
  };

  return {
    assignRoleToUser,
    loading,
    error,
  };
}

/**
 * Hook to remove a role from a user
 */
export function useRemoveRoleFromUser() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_REMOVE_ROLE_FROM_USER, {
    refetchQueries: [{ query: GOD_MODE_GET_ROLES }],
  });

  const removeRoleFromUser = async (userId: string, roleId: string) => {
    try {
      const { data } = await mutate({
        variables: { userId, roleId },
      });
      return data?.godModeRemoveRoleFromUser;
    } catch (err) {
      console.error('Error removing role from user:', err);
      throw err;
    }
  };

  return {
    removeRoleFromUser,
    loading,
    error,
  };
}
