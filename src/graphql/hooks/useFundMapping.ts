import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useState } from 'react';
import {
  GET_FUND_MAPPING_CONFIGURATION,
  GET_CONTRIBUTION_TYPE_FUND_MAPPINGS,
  CREATE_CONTRIBUTION_TYPE_FUND_MAPPING,
  UPDATE_CONTRIBUTION_TYPE_FUND_MAPPING,
  DELETE_CONTRIBUTION_TYPE_FUND_MAPPING,
  CREATE_DEFAULT_FUND_MAPPINGS,
  GET_FUND_FOR_CONTRIBUTION_TYPE,
  GET_FUND_FOR_CONTRIBUTION_TYPE_NAME,
} from '../queries/fundMappingQueries';

// Types
export interface ContributionTypeInfo {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface FundInfo {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ContributionTypeFundMapping {
  id: string;
  contributionTypeId: string;
  fundId: string;
  branchId?: string;
  organisationId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  contributionType?: ContributionTypeInfo;
  fund?: FundInfo;
}

export interface FundMappingConfiguration {
  branchId: string;
  organisationId: string;
  lastUpdated: string;
  mappings: ContributionTypeFundMapping[];
  availableContributionTypes: ContributionTypeInfo[];
  availableFunds: FundInfo[];
}

export interface CreateContributionTypeFundMappingInput {
  contributionTypeId: string;
  fundId: string;
  branchId?: string;
  organisationId?: string;
  isActive?: boolean;
}

export interface UpdateContributionTypeFundMappingInput {
  id: string;
  fundId?: string;
  isActive?: boolean;
}

export interface ContributionTypeFundMappingFilterInput {
  branchId?: string;
  organisationId?: string;
  contributionTypeId?: string;
  fundId?: string;
  isActive?: boolean;
}

// Hook for getting fund mapping configuration
export function useFundMappingConfiguration(branchId: string, organisationId: string) {
  const { data, loading, error, refetch } = useQuery(GET_FUND_MAPPING_CONFIGURATION, {
    variables: { branchId, organisationId },
    skip: !branchId || !organisationId,
  });

  return {
    configuration: data?.fundMappingConfiguration as FundMappingConfiguration | undefined,
    loading,
    error,
    refetch,
  };
}

// Hook for getting fund mappings with filtering
export function useFundMappings(filter: ContributionTypeFundMappingFilterInput) {
  const { data, loading, error, refetch } = useQuery(GET_CONTRIBUTION_TYPE_FUND_MAPPINGS, {
    variables: { filter },
    skip: !filter.branchId && !filter.organisationId,
  });

  return {
    mappings: data?.contributionTypeFundMappings?.mappings as ContributionTypeFundMapping[] | undefined,
    total: data?.contributionTypeFundMappings?.total as number | undefined,
    loading,
    error,
    refetch,
  };
}

// Hook for creating fund mappings
export function useCreateFundMapping() {
  const [createMapping, { loading, error }] = useMutation(CREATE_CONTRIBUTION_TYPE_FUND_MAPPING);
  const client = useApolloClient();

  const create = async (input: CreateContributionTypeFundMappingInput) => {
    try {
      const result = await createMapping({
        variables: { input },
        refetchQueries: [
          {
            query: GET_FUND_MAPPING_CONFIGURATION,
            variables: { branchId: input.branchId, organisationId: input.organisationId },
          },
        ],
      });

      // Invalidate related queries
      await client.refetchQueries({
        include: [GET_CONTRIBUTION_TYPE_FUND_MAPPINGS],
      });

      return result.data?.createContributionTypeFundMapping;
    } catch (err) {
      console.error('Error creating fund mapping:', err);
      throw err;
    }
  };

  return { create, loading, error };
}

// Hook for updating fund mappings
export function useUpdateFundMapping() {
  const [updateMapping, { loading, error }] = useMutation(UPDATE_CONTRIBUTION_TYPE_FUND_MAPPING);
  const client = useApolloClient();

  const update = async (input: UpdateContributionTypeFundMappingInput) => {
    try {
      const result = await updateMapping({
        variables: { input },
      });

      // Invalidate related queries
      await client.refetchQueries({
        include: [GET_FUND_MAPPING_CONFIGURATION, GET_CONTRIBUTION_TYPE_FUND_MAPPINGS],
      });

      return result.data?.updateContributionTypeFundMapping;
    } catch (err) {
      console.error('Error updating fund mapping:', err);
      throw err;
    }
  };

  return { update, loading, error };
}

// Hook for deleting fund mappings
export function useDeleteFundMapping() {
  const [deleteMapping, { loading, error }] = useMutation(DELETE_CONTRIBUTION_TYPE_FUND_MAPPING);
  const client = useApolloClient();

  const deleteFundMapping = async (id: string) => {
    try {
      const result = await deleteMapping({
        variables: { id },
      });

      // Invalidate related queries
      await client.refetchQueries({
        include: [GET_FUND_MAPPING_CONFIGURATION, GET_CONTRIBUTION_TYPE_FUND_MAPPINGS],
      });

      return result.data?.deleteContributionTypeFundMapping;
    } catch (err) {
      console.error('Error deleting fund mapping:', err);
      throw err;
    }
  };

  return { delete: deleteFundMapping, loading, error };
}

// Hook for creating default fund mappings
export function useCreateDefaultFundMappings() {
  const [createDefaults, { loading, error }] = useMutation(CREATE_DEFAULT_FUND_MAPPINGS);
  const client = useApolloClient();

  const createDefaultMappings = async (branchId: string, organisationId: string) => {
    try {
      const result = await createDefaults({
        variables: { branchId, organisationId },
        refetchQueries: [
          {
            query: GET_FUND_MAPPING_CONFIGURATION,
            variables: { branchId, organisationId },
          },
        ],
      });

      // Invalidate related queries
      await client.refetchQueries({
        include: [GET_CONTRIBUTION_TYPE_FUND_MAPPINGS],
      });

      return result.data?.createDefaultFundMappings;
    } catch (err) {
      console.error('Error creating default fund mappings:', err);
      throw err;
    }
  };

  return { createDefaultMappings, loading, error };
}

// Hook for getting fund for a specific contribution type
export function useFundForContributionType(
  contributionTypeId: string,
  branchId: string,
  organisationId: string,
) {
  const { data, loading, error } = useQuery(GET_FUND_FOR_CONTRIBUTION_TYPE, {
    variables: { contributionTypeId, branchId, organisationId },
    skip: !contributionTypeId || !branchId || !organisationId,
  });

  return {
    fundId: data?.getFundForContributionType as string | null,
    loading,
    error,
  };
}

// Hook for getting fund for a contribution type by name
export function useFundForContributionTypeName(
  contributionTypeName: string,
  branchId: string,
  organisationId: string,
) {
  const { data, loading, error } = useQuery(GET_FUND_FOR_CONTRIBUTION_TYPE_NAME, {
    variables: { contributionTypeName, branchId, organisationId },
    skip: !contributionTypeName || !branchId || !organisationId,
  });

  return {
    fundId: data?.getFundForContributionTypeName as string | null,
    loading,
    error,
  };
}

// Combined hook for all fund mapping operations
export function useFundMappingManager(branchId: string, organisationId: string) {
  const [selectedMapping, setSelectedMapping] = useState<ContributionTypeFundMapping | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const configuration = useFundMappingConfiguration(branchId, organisationId);
  const createMapping = useCreateFundMapping();
  const updateMapping = useUpdateFundMapping();
  const deleteMapping = useDeleteFundMapping();
  const createDefaults = useCreateDefaultFundMappings();

  const handleCreate = async (input: CreateContributionTypeFundMappingInput) => {
    const result = await createMapping.create({
      ...input,
      branchId,
      organisationId,
    });
    setIsCreateModalOpen(false);
    return result;
  };

  const handleUpdate = async (input: UpdateContributionTypeFundMappingInput) => {
    const result = await updateMapping.update(input);
    setIsEditModalOpen(false);
    setSelectedMapping(null);
    return result;
  };

  const handleDelete = async (id: string) => {
    const result = await deleteMapping.delete(id);
    setSelectedMapping(null);
    return result;
  };

  const handleCreateDefaults = async () => {
    return await createDefaults.createDefaultMappings(branchId, organisationId);
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (mapping: ContributionTypeFundMapping) => {
    setSelectedMapping(mapping);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedMapping(null);
  };

  return {
    // Data
    configuration: configuration.configuration,
    loading: configuration.loading,
    error: configuration.error,
    
    // Selected state
    selectedMapping,
    setSelectedMapping,
    
    // Modal state
    isCreateModalOpen,
    isEditModalOpen,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    
    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateDefaults,
    refetch: configuration.refetch,
    
    // Loading states
    creating: createMapping.loading,
    updating: updateMapping.loading,
    deleting: deleteMapping.loading,
    creatingDefaults: createDefaults.loading,
  };
}
