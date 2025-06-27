"use client";

import { useAuth } from '@/graphql/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

export const useOrganizationBranchFilter = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const organisationIdFromQuery = searchParams.get('organisationId');
  const branchIdFromQuery = searchParams.get('branchId');

  let organisationId = '';
  let branchId = '';

  if (user?.primaryRole === 'super_admin') {
    organisationId = organisationIdFromQuery || user.organisationId || '';
    branchId = branchIdFromQuery || '';
  } else {
    organisationId = user?.organisationId || '';
    branchId = branchIdFromQuery || user?.userBranches?.[0]?.branch?.id || '';
  }

  return { organisationId, branchId };
};
