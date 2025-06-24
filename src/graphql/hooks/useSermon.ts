import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SERMONS,
  GET_SERMON
} from '../queries/sermonQueries';
import {
  Sermon,
  Speaker,
  Series
} from '../types/sermon';
import {
  CREATE_SERMON,
  UPDATE_SERMON,
  DELETE_SERMON,
  UPLOAD_SERMON_MEDIA
} from '../mutations/sermonMutations';

/**
 * Hook for fetching paginated sermons with filtering options
 */
export const useSermons = (customOptions = {}) => {
  const [filters, setFilters] = useState({ branchId: undefined, search: '', status: '' });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  // Use the updated GET_SERMONS query
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_SERMONS, {
    variables: { ...filters },
    fetchPolicy: 'cache-and-network',
    ...customOptions,
  });

  // Compose enrichedSermons for UI (no speaker/series enrichment for now)
  const enrichedSermons = () => {
    return data?.findAll || [];
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return {
    loading,
    error,
    data: enrichedSermons(),
    refetch,
    fetchMore,
    filters,
    pagination,
    setFilters: handleFilterChange,
    setPagination: handlePageChange
  };
};

/**
 * Hook for fetching a single sermon by ID
 */
export const useSermon = (id: string) => {
  const { loading, error, data } = useQuery(GET_SERMON, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network'
  });

  return {
    loading,
    error,
    sermon: data?.findOne || null,
  };
};

/**
 * Hook for sermon mutations (create, update, delete)
 */
export const useSermonMutations = () => {
  const [createSermon, { loading: creating }] = useMutation(CREATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }]
  });

  const [updateSermon, { loading: updating }] = useMutation(UPDATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }]
  });

  const [deleteSermon, { loading: deleting }] = useMutation(DELETE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }]
  });

  const [uploadMedia, { loading: uploading }] = useMutation(UPLOAD_SERMON_MEDIA);

  return {
    createSermon,
    updateSermon,
    deleteSermon,
    uploadMedia,
    loading: creating || updating || deleting || uploading
  };
};

/**
 * Hook for fetching series data
 */
export const useSeries = (customOptions = {}) => {
  const [filters, setFilters] = useState<{ search?: string; isActive?: boolean }>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    page: 1,
    pageSize: 10
  });

  const { loading, error, data } = useQuery(GET_SERIES, {
    variables: {
      filter: filters,
      pagination
    },
    fetchPolicy: 'cache-and-network',
    ...customOptions
  });

  return {
    loading,
    error,
    series: data?.paginatedSeries?.items || [],
    totalCount: data?.paginatedSeries?.totalCount || 0,
    filters,
    setFilters,
    pagination,
    setPagination
  };
};

/**
 * Hook for fetching speakers data
 */
export const useSpeakers = (customOptions = {}) => {
  const [filters, setFilters] = useState<{ search?: string; isActive?: boolean }>({});
  const [pagination, setPagination] = useState<PaginationInput>({
    page: 1,
    pageSize: 10
  });

  const { loading, error, data } = useQuery(GET_SPEAKERS, {
    variables: {
      filter: filters,
      pagination
    },
    fetchPolicy: 'cache-and-network',
    ...customOptions
  });

  return {
    loading,
    error,
    speakers: data?.paginatedSpeakers?.items || [],
    totalCount: data?.paginatedSpeakers?.totalCount || 0,
    filters,
    setFilters,
    pagination,
    setPagination
  };
};
