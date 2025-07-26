import { useAuth } from '@/contexts/AuthContextEnhanced';

import { useMemo } from 'react';

/**
 * Interface for filter objects that can use either branchId or organisationId
 */
export interface OrganizationBranchFilter {
  branchId?: string;
  organisationId?: string;
}

/**
 * Hook to determine whether to filter by organization ID or branch ID based on user role
 * For SUPER_ADMIN users with an organisationId, it will return a filter with organisationId
 * For all other users, it will return a filter with branchId
 */
export const useOrganizationBranchFilter = (): OrganizationBranchFilter => {
  const { state } = useAuth();
  const user = state.user;
  
  return useMemo(() => {
    const filter: OrganizationBranchFilter = {};
    
    // Get the default branchId from user's branches
    const defaultBranchId = user?.userBranches && user.userBranches.length > 0 
      ? user.userBranches[0]?.branch?.id
      : undefined;
    
    // For SUPER_ADMIN with organisationId, filter by organisation instead of branch
    if (user?.primaryRole === 'super_admin' && user?.organisationId) {
      filter.organisationId = String(user.organisationId);
      console.log('SUPER_ADMIN with organisationId detected - using organisationId:', user.organisationId);
    } else {
      // For all other users, filter by branchId and only include organisationId if it's valid
      if (user?.organisationId) {
        filter.organisationId = String(user.organisationId);
      }
      filter.branchId = defaultBranchId;
    }
    
    return filter;
  }, [user]);
};
