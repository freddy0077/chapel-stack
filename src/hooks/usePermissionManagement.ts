'use client';

import { useQuery, useMutation } from '@apollo/client';
import {
  GOD_MODE_GET_PERMISSIONS,
  GOD_MODE_GET_PERMISSION,
  GOD_MODE_GET_PERMISSION_MATRIX,
  GOD_MODE_GET_ROLE_PERMISSIONS,
  GOD_MODE_GET_PERMISSION_ROLES,
  GOD_MODE_GET_PERMISSION_CATEGORIES,
  GOD_MODE_VALIDATE_PERMISSION_HIERARCHY,
} from '@/graphql/queries/permissionQueries';
import {
  GOD_MODE_CREATE_PERMISSION,
  GOD_MODE_UPDATE_PERMISSION,
  GOD_MODE_DELETE_PERMISSION,
  GOD_MODE_ASSIGN_PERMISSION_TO_ROLE,
  GOD_MODE_REMOVE_PERMISSION_FROM_ROLE,
} from '@/graphql/mutations/permissionMutations';

export interface PermissionFilter {
  search?: string;
  category?: string;
  skip?: number;
  take?: number;
}

export interface CreatePermissionInput {
  action: string;
  subject: string;
  description?: string;
  category?: string;
}

export interface UpdatePermissionInput {
  action?: string;
  subject?: string;
  description?: string;
  category?: string;
}

/**
 * Hook to fetch all permissions with optional filtering
 */
export function usePermissions(filter?: PermissionFilter) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_PERMISSIONS, {
    variables: {
      search: filter?.search,
      category: filter?.category,
      skip: filter?.skip || 0,
      take: filter?.take || 100,
    },
    skip: !filter,
  });

  return {
    permissions: data?.godModePermissions?.permissions || [],
    total: data?.godModePermissions?.total || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch a single permission by ID
 */
export function usePermission(permissionId?: string) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_PERMISSION, {
    variables: { id: permissionId },
    skip: !permissionId,
  });

  return {
    permission: data?.godModePermission,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch permission matrix (roles vs permissions)
 */
export function usePermissionMatrix() {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_PERMISSION_MATRIX);

  return {
    matrix: data?.godModePermissionMatrix,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch permissions for a role
 */
export function useRolePermissions(roleId?: string) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_ROLE_PERMISSIONS, {
    variables: { roleId },
    skip: !roleId,
  });

  return {
    permissions: data?.godModeRolePermissions || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch roles for a permission
 */
export function usePermissionRoles(permissionId?: string) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_PERMISSION_ROLES, {
    variables: { permissionId },
    skip: !permissionId,
  });

  return {
    roleIds: data?.godModePermissionRoles || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to fetch permission categories
 */
export function usePermissionCategories() {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_GET_PERMISSION_CATEGORIES);

  return {
    categories: data?.godModePermissionCategories || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to validate permission hierarchy
 */
export function useValidatePermissionHierarchy(roleId?: string) {
  const { data, loading, error, refetch } = useQuery(GOD_MODE_VALIDATE_PERMISSION_HIERARCHY, {
    variables: { roleId },
    skip: !roleId,
  });

  return {
    isValid: data?.godModeValidatePermissionHierarchy || false,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to create a new permission
 */
export function useCreatePermission() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_CREATE_PERMISSION, {
    refetchQueries: [{ query: GOD_MODE_GET_PERMISSIONS }],
  });

  const createPermission = async (input: CreatePermissionInput) => {
    try {
      const { data } = await mutate({
        variables: { input },
      });
      return data?.godModeCreatePermission;
    } catch (err) {
      console.error('Error creating permission:', err);
      throw err;
    }
  };

  return {
    createPermission,
    loading,
    error,
  };
}

/**
 * Hook to update an existing permission
 */
export function useUpdatePermission() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_UPDATE_PERMISSION, {
    refetchQueries: [{ query: GOD_MODE_GET_PERMISSIONS }],
  });

  const updatePermission = async (id: string, input: UpdatePermissionInput) => {
    try {
      const { data } = await mutate({
        variables: { id, input },
      });
      return data?.godModeUpdatePermission;
    } catch (err) {
      console.error('Error updating permission:', err);
      throw err;
    }
  };

  return {
    updatePermission,
    loading,
    error,
  };
}

/**
 * Hook to delete a permission
 */
export function useDeletePermission() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_DELETE_PERMISSION, {
    refetchQueries: [{ query: GOD_MODE_GET_PERMISSIONS }],
  });

  const deletePermission = async (id: string) => {
    try {
      const { data } = await mutate({
        variables: { id },
      });
      return data?.godModeDeletePermission;
    } catch (err) {
      console.error('Error deleting permission:', err);
      throw err;
    }
  };

  return {
    deletePermission,
    loading,
    error,
  };
}

/**
 * Hook to assign a permission to a role
 */
export function useAssignPermissionToRole() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_ASSIGN_PERMISSION_TO_ROLE, {
    refetchQueries: [{ query: GOD_MODE_GET_PERMISSION_MATRIX }],
  });

  const assignPermissionToRole = async (roleId: string, permissionId: string) => {
    try {
      const { data } = await mutate({
        variables: { roleId, permissionId },
      });
      return data?.godModeAssignPermissionToRole;
    } catch (err) {
      console.error('Error assigning permission to role:', err);
      throw err;
    }
  };

  return {
    assignPermissionToRole,
    loading,
    error,
  };
}

/**
 * Hook to remove a permission from a role
 */
export function useRemovePermissionFromRole() {
  const [mutate, { loading, error }] = useMutation(GOD_MODE_REMOVE_PERMISSION_FROM_ROLE, {
    refetchQueries: [{ query: GOD_MODE_GET_PERMISSION_MATRIX }],
  });

  const removePermissionFromRole = async (roleId: string, permissionId: string) => {
    try {
      const { data } = await mutate({
        variables: { roleId, permissionId },
      });
      return data?.godModeRemovePermissionFromRole;
    } catch (err) {
      console.error('Error removing permission from role:', err);
      throw err;
    }
  };

  return {
    removePermissionFromRole,
    loading,
    error,
  };
}
