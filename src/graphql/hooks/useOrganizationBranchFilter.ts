"use client";

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useSearchParams } from 'next/navigation';

export const useOrganizationBranchFilter = () => {
  const { state } = useAuth();
  const { user } = state;
  const searchParams = useSearchParams();

  const organisationIdFromQuery = searchParams.get('organisationId');
  const branchIdFromQuery = searchParams.get('branchId');

  console.log('🏢 useOrganizationBranchFilter - User data:', {
    user: user ? {
      id: user.id,
      email: user.email,
      primaryRole: user.primaryRole,
      organisationId: user.organisationId,
      userBranches: user.userBranches?.length || 0
    } : null,
    organisationIdFromQuery,
    branchIdFromQuery
  });

  let organisationId = '';
  let branchId = '';

  if (user?.primaryRole === 'SUBSCRIPTION_MANAGER') {
    organisationId = organisationIdFromQuery || user.organisationId || '';
    branchId = branchIdFromQuery || '';
  } else if (user?.primaryRole === 'super_admin') {
    organisationId = organisationIdFromQuery || user.organisationId || '';
    branchId = branchIdFromQuery || '';
  } else {
    organisationId = user?.organisationId || '';
    branchId = branchIdFromQuery || user?.userBranches?.[0]?.branch?.id || '';
  }

  console.log('🏢 useOrganizationBranchFilter - Result:', { organisationId, branchId });

  return { organisationId, branchId };
};
