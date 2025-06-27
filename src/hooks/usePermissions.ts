import { useAuth } from '@/lib/auth/authContext';
import { useMemo } from 'react';

// Define role constants for consistency
const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BRANCH_ADMIN: 'BRANCH_ADMIN',
  // Add other roles here as the application grows
};

/**
 * A custom hook to centralize and manage user permissions.
 * It provides boolean flags for specific roles and capabilities.
 *
 * @returns {object} An object containing user information and permission flags.
 * - `user`: The authenticated user object from useAuth.
 * - `role`: The user's primary role in uppercase.
 * - `isSuperAdmin`: True if the user is a SUPER_ADMIN.
 * - `isBranchAdmin`: True if the user is a BRANCH_ADMIN.
 * - `canManageEvents`: True if the user can manage calendar events (SUPER_ADMIN or BRANCH_ADMIN).
 * - `canCustomizeModules`: True if the user can customize modules (SUPER_ADMIN only).
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const role = useMemo(() => user?.primaryRole?.toUpperCase(), [user?.primaryRole]);

  const isSuperAdmin = useMemo(() => role === ROLES.SUPER_ADMIN, [role]);
  const isBranchAdmin = useMemo(() => role === ROLES.BRANCH_ADMIN, [role]);

  // --- Permission sets based on roles ---
  const canManageEvents = useMemo(() => isSuperAdmin || isBranchAdmin, [isSuperAdmin, isBranchAdmin]);
  const canCustomizeModules = useMemo(() => isSuperAdmin, [isSuperAdmin]);

  return {
    user,
    role,
    isSuperAdmin,
    isBranchAdmin,
    canManageEvents,
    canCustomizeModules,
  };
};
