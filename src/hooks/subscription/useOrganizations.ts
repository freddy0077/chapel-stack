import { useQuery, useMutation } from '@apollo/client';
import { useState, useMemo } from 'react';
import {
  GET_SUBSCRIPTION_ORGANIZATIONS,
  GET_ORGANIZATION_SUBSCRIPTION_DETAILS,
  GET_ORGANIZATION_STATS,
  ENABLE_ORGANIZATION,
  DISABLE_ORGANIZATION,
  OrganizationWithSubscription,
  OrganizationStats,
} from '../../graphql/subscription-management';

interface OrganizationFilter {
  state?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const useOrganizations = (filter?: OrganizationFilter) => {
  // Clean the filter to remove empty/invalid values
  const cleanFilter = useMemo(() => {
    if (!filter) return undefined;
    
    const cleaned: any = {};
    
    // Only include state if it's a valid enum value
    if (filter.state && filter.state !== '' && filter.state !== 'ALL') {
      cleaned.state = filter.state;
    }
    
    // Only include search if it's not empty
    if (filter.search && filter.search.trim() !== '') {
      cleaned.search = filter.search.trim();
    }
    
    // Include pagination parameters
    if (filter.limit) {
      cleaned.limit = filter.limit;
    }
    
    if (filter.offset) {
      cleaned.offset = filter.offset;
    }
    
    // Return undefined if no valid filters
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }, [filter]);

  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
  } = useQuery<{ subscriptionOrganizations: OrganizationWithSubscription[] }>(
    GET_SUBSCRIPTION_ORGANIZATIONS,
    {
      variables: { filter: cleanFilter },
      errorPolicy: 'all',
    }
  );

  const [enableOrganization, { loading: enableLoading }] = useMutation(
    ENABLE_ORGANIZATION,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const [disableOrganization, { loading: disableLoading }] = useMutation(
    DISABLE_ORGANIZATION,
    {
      onCompleted: () => {
        refetch();
      },
    }
  );

  const handleEnableOrganization = async (id: string) => {
    try {
      const result = await enableOrganization({
        variables: { id },
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Failed to enable organization:', error);
      return { success: false, error };
    }
  };

  const handleDisableOrganization = async (input: { id: string; reason: string }) => {
    try {
      const result = await disableOrganization({
        variables: { input },
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Failed to disable organization:', error);
      return { success: false, error };
    }
  };

  const loadMore = () => {
    if (data?.subscriptionOrganizations) {
      return fetchMore({
        variables: {
          filter: {
            ...cleanFilter,
            offset: data.subscriptionOrganizations.length,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            subscriptionOrganizations: [
              ...prev.subscriptionOrganizations,
              ...fetchMoreResult.subscriptionOrganizations,
            ],
          };
        },
      });
    }
  };

  return {
    organizations: data?.subscriptionOrganizations || [],
    loading,
    error,
    refetch,
    loadMore,
    enableOrganization: handleEnableOrganization,
    disableOrganization: handleDisableOrganization,
    enableLoading,
    disableLoading,
  };
};

export const useOrganizationDetails = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{
    organizationSubscriptionDetails: OrganizationWithSubscription;
  }>(GET_ORGANIZATION_SUBSCRIPTION_DETAILS, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
  });

  return {
    organization: data?.organizationSubscriptionDetails,
    loading,
    error,
    refetch,
  };
};

export const useOrganizationStats = () => {
  const { data, loading, error, refetch } = useQuery<{
    organizationStats: OrganizationStats;
  }>(GET_ORGANIZATION_STATS, {
    errorPolicy: 'all',
  });

  return {
    stats: data?.organizationStats,
    loading,
    error,
    refetch,
  };
};

export const useOrganizationFilters = () => {
  const [filters, setFilters] = useState<OrganizationFilter>({
    limit: 50,
    offset: 0,
  });

  const updateFilter = (key: keyof OrganizationFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset offset when filter changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      limit: 50,
      offset: 0,
    });
  };

  return {
    filters,
    updateFilter,
    resetFilters,
  };
};
