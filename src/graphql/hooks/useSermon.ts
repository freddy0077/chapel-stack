import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SERMONS,
  GET_SERMON,
  GET_SPEAKERS,
  GET_SERIES,
  GET_CATEGORIES,
} from '../queries/sermonQueries';
import {
  CREATE_SERMON,
  UPDATE_SERMON,
  DELETE_SERMON,
  UPLOAD_SERMON_MEDIA
} from '../mutations/sermonMutations';


/**
 * Hook for fetching sermons with filtering options
 */
export function useSermons(branchId?: string) {
  const { data, loading, error, refetch } = useQuery(GET_SERMONS, {
    variables: { branchId },
  });

  const sermons = useMemo(() => {
    return data?.sermons || [];
  }, [data]);

  return {
    sermons,
    totalCount: sermons.length,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for fetching a single sermon by ID
 */
export const useSermon = (id: string, customOptions = {}) => {
  const { data, loading, error, refetch } = useQuery(GET_SERMON, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
    ...customOptions,
  });
  return {
    sermon: data?.sermon || null,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook for fetching speakers
 */
export function useSpeakers(branchId?: string) {
  const { data, loading, error } = useQuery(GET_SPEAKERS, {
    variables: { branchId },
    skip: !branchId,
  });

  const speakers = useMemo(() => {
    return data?.members?.map(member => ({ ...member, name: `${member.firstName} ${member.lastName}` })) || [];
  }, [data]);

  return { speakers, loading, error };
}

/**
 * Hook for fetching series
 */
export function useSeries(branchId?: string) {
  const { data, loading, error } = useQuery(GET_SERIES, {
    variables: { branchId },
    skip: !branchId,
  });

  return { series: data?.series || [], loading, error };
};

/**
 * Hook for fetching categories
 */
export function useCategories(branchId?: string) {
  const { data, loading, error } = useQuery(GET_CATEGORIES, {
    variables: { branchId },
  });

  return { categories: data?.categories || [], loading, error };
}

/**
 * Hook for sermon mutations (create, update, delete)
 */
export function useSermonMutations() {
  const [createSermon, { loading: createLoading, error: createError }] = useMutation(CREATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }]
  });

  const [updateSermon, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }]
  });

  const [deleteSermon, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }]
  });

  const [uploadMedia, { loading: uploadLoading, error: uploadError }] = useMutation(UPLOAD_SERMON_MEDIA);

  return {
    createSermon,
    updateSermon,
    deleteSermon,
    uploadMedia,
    loading: createLoading || updateLoading || deleteLoading || uploadLoading,
    error: createError || updateError || deleteError || uploadError
  };
};
