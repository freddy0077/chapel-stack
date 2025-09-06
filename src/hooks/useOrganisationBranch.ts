import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";

/**
 * Custom hook to centralize organisationId and branchId logic
 * This eliminates the need to define these values repeatedly across components
 */
export function useOrganisationBranch() {
  const { state } = useAuth();
  const user = state.user;

  const values = useMemo(() => {

    if (!user) {
      return {
        organisationId: undefined,
        branchId: undefined,
        hasAccess: false,
      };
    }

    const organisationId = user.organisationId || undefined;
    const branchId = user.userBranches?.[0]?.branch?.id || undefined;


    return {
      organisationId,
      branchId,
      hasAccess: !!(organisationId && branchId),
      user,
    };
  }, [user]);

  return values;
}

/**
 * Hook variant that throws an error if user doesn't have access
 * Use this when organisationId and branchId are required
 */
export function useRequiredOrganisationBranch() {
  const { organisationId, branchId, hasAccess, user } = useOrganisationBranch();

  if (!hasAccess) {
    throw new Error("User must have access to an organisation and branch");
  }

  return {
    organisationId: organisationId!,
    branchId: branchId!,
    user: user!,
  };
}

/**
 * Hook to get all user branches (for multi-branch scenarios)
 */
export function useUserBranches() {
  const { user } = useAuth();

  const branches = useMemo(() => {
    if (!user?.userBranches) {
      return [];
    }

    return user.userBranches.map((userBranch) => ({
      id: userBranch.branch.id,
      name: userBranch.branch.name,
      role: userBranch.role,
    }));
  }, [user?.userBranches]);

  return {
    branches,
    primaryBranch: branches[0] || null,
    hasBranches: branches.length > 0,
  };
}
