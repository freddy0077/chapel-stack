import { useState, useCallback } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import {
  GET_DEATH_REGISTERS,
  GET_DEATH_REGISTER,
  GET_DEATH_REGISTER_BY_MEMBER,
  GET_DEATH_REGISTER_STATS,
  GET_MEMORIAL_CALENDAR,
  CREATE_DEATH_REGISTER,
  UPDATE_DEATH_REGISTER,
  DELETE_DEATH_REGISTER,
  UPLOAD_DEATH_DOCUMENT,
  MARK_FAMILY_NOTIFIED,
} from '../graphql/queries/deathRegisterQueries';
import {
  DeathRegister,
  DeathRegisterStats,
  MemorialDate,
  CreateDeathRegisterInput,
  UpdateDeathRegisterInput,
  DeathRegisterFilterInput,
  UploadDeathDocumentInput,
  UseDeathRegistersResult,
  UseDeathRegisterResult,
  UseDeathRegisterStatsResult,
  UseMemorialCalendarResult,
  UseDeathRegisterMutationsResult,
} from '../types/deathRegister';

// Hook for fetching multiple death registers
export const useDeathRegisters = (
  filter?: DeathRegisterFilterInput
): UseDeathRegistersResult => {
  const [hasMore, setHasMore] = useState(true);
  
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_DEATH_REGISTERS, {
    variables: { filter },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const handleFetchMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    const currentLength = data?.deathRegisters?.length || 0;
    fetchMore({
      variables: {
        filter: {
          ...filter,
          skip: currentLength,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.deathRegisters?.length) {
          setHasMore(false);
          return prev;
        }
        
        return {
          deathRegisters: [
            ...(prev.deathRegisters || []),
            ...fetchMoreResult.deathRegisters,
          ],
        };
      },
    });
  }, [data, filter, fetchMore, hasMore, loading]);

  return {
    deathRegisters: data?.deathRegisters || [],
    loading,
    error,
    refetch,
    fetchMore: handleFetchMore,
    hasMore,
  };
};

// Hook for fetching a single death register
export const useDeathRegister = (id: string): UseDeathRegisterResult => {
  const { data, loading, error, refetch } = useQuery(GET_DEATH_REGISTER, {
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
  });

  return {
    deathRegister: data?.deathRegister,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching death register by member ID
export const useDeathRegisterByMember = (memberId: string): UseDeathRegisterResult => {
  const { data, loading, error, refetch } = useQuery(GET_DEATH_REGISTER_BY_MEMBER, {
    variables: { memberId },
    skip: !memberId,
    errorPolicy: 'all',
  });

  return {
    deathRegister: data?.deathRegisterByMember,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching death register statistics
export const useDeathRegisterStats = (
  organisationId?: string,
  branchId?: string
): UseDeathRegisterStatsResult => {
  const { data, loading, error, refetch } = useQuery(GET_DEATH_REGISTER_STATS, {
    variables: { organisationId, branchId },
    errorPolicy: 'all',
  });

  return {
    stats: data?.deathRegisterStats,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching memorial calendar
export const useMemorialCalendar = (
  year: number,
  organisationId?: string,
  branchId?: string
): UseMemorialCalendarResult => {
  const { data, loading, error, refetch } = useQuery(GET_MEMORIAL_CALENDAR, {
    variables: { year, organisationId, branchId },
    errorPolicy: 'all',
  });

  return {
    memorialDates: data?.memorialCalendar || [],
    loading,
    error,
    refetch,
  };
};

// Hook for death register mutations
export const useDeathRegisterMutations = (): UseDeathRegisterMutationsResult => {
  const client = useApolloClient();
  
  const [createMutation, { loading: createLoading }] = useMutation(CREATE_DEATH_REGISTER);
  const [updateMutation, { loading: updateLoading }] = useMutation(UPDATE_DEATH_REGISTER);
  const [deleteMutation, { loading: deleteLoading }] = useMutation(DELETE_DEATH_REGISTER);
  const [uploadMutation, { loading: uploadLoading }] = useMutation(UPLOAD_DEATH_DOCUMENT);
  const [notifyMutation, { loading: notifyLoading }] = useMutation(MARK_FAMILY_NOTIFIED);

  const createDeathRegister = useCallback(
    async (input: CreateDeathRegisterInput): Promise<DeathRegister> => {
      try {
        const { data } = await createMutation({
          variables: { input },
          refetchQueries: [GET_DEATH_REGISTERS, GET_DEATH_REGISTER_STATS],
          awaitRefetchQueries: true,
        });
        return data.createDeathRegister;
      } catch (error) {
        console.error('Error creating death register:', error);
        throw error;
      }
    },
    [createMutation]
  );

  const updateDeathRegister = useCallback(
    async (input: UpdateDeathRegisterInput): Promise<DeathRegister> => {
      try {
        const { data } = await updateMutation({
          variables: { input },
          refetchQueries: [
            { query: GET_DEATH_REGISTER, variables: { id: input.id } },
            GET_DEATH_REGISTERS,
            GET_DEATH_REGISTER_STATS,
          ],
          awaitRefetchQueries: true,
        });
        return data.updateDeathRegister;
      } catch (error) {
        console.error('Error updating death register:', error);
        throw error;
      }
    },
    [updateMutation]
  );

  const deleteDeathRegister = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const { data } = await deleteMutation({
          variables: { id },
          refetchQueries: [GET_DEATH_REGISTERS, GET_DEATH_REGISTER_STATS],
          awaitRefetchQueries: true,
        });
        
        // Remove from cache
        client.cache.evict({ id: `DeathRegister:${id}` });
        client.cache.gc();
        
        return data.deleteDeathRegister;
      } catch (error) {
        console.error('Error deleting death register:', error);
        throw error;
      }
    },
    [deleteMutation, client]
  );

  const uploadDocument = useCallback(
    async (input: UploadDeathDocumentInput): Promise<DeathRegister> => {
      try {
        const { data } = await uploadMutation({
          variables: { input },
          refetchQueries: [
            { query: GET_DEATH_REGISTER, variables: { id: input.deathRegisterId } },
          ],
          awaitRefetchQueries: true,
        });
        return data.uploadDeathDocument;
      } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
      }
    },
    [uploadMutation]
  );

  const markFamilyNotified = useCallback(
    async (id: string): Promise<DeathRegister> => {
      try {
        const { data } = await notifyMutation({
          variables: { id },
          refetchQueries: [
            { query: GET_DEATH_REGISTER, variables: { id } },
            GET_DEATH_REGISTERS,
            GET_DEATH_REGISTER_STATS,
          ],
          awaitRefetchQueries: true,
        });
        return data.markFamilyNotified;
      } catch (error) {
        console.error('Error marking family notified:', error);
        throw error;
      }
    },
    [notifyMutation]
  );

  return {
    createDeathRegister,
    updateDeathRegister,
    deleteDeathRegister,
    uploadDocument,
    markFamilyNotified,
    loading: createLoading || updateLoading || deleteLoading || uploadLoading || notifyLoading,
    error: undefined, // Individual error handling in each function
  };
};

// Combined hook for all death register operations
export const useDeathRegisterManagement = (filter?: DeathRegisterFilterInput) => {
  const deathRegistersResult = useDeathRegisters(filter);
  const mutations = useDeathRegisterMutations();
  const statsResult = useDeathRegisterStats(filter?.organisationId, filter?.branchId);

  return {
    ...deathRegistersResult,
    ...mutations,
    stats: statsResult.stats,
    statsLoading: statsResult.loading,
    statsError: statsResult.error,
    refetchStats: statsResult.refetch,
  };
};
