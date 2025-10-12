import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SERMONS,
  GET_SERMON,
  GET_RECENT_SERMONS,
  SEARCH_SERMONS,
  GET_SPEAKERS,
  GET_SPEAKER,
  GET_SPEAKER_BY_MEMBER,
  GET_SERIES,
  GET_SERIES_BY_ID,
  GET_ACTIVE_SERIES,
  GET_CATEGORIES,
  GET_CATEGORY,
  GET_TAGS,
} from "../queries/sermonQueries";
import {
  CREATE_SERMON,
  UPDATE_SERMON,
  DELETE_SERMON,
  UPDATE_SERMON_STATUS,
  CREATE_SPEAKER,
  UPDATE_SPEAKER,
  DELETE_SPEAKER,
  CREATE_SERIES,
  UPDATE_SERIES,
  DELETE_SERIES,
  UPLOAD_SERMON_MEDIA,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "../mutations/sermonMutations";

// TypeScript interfaces
export interface SermonEntity {
  id: string;
  title: string;
  description?: string;
  datePreached: string;
  speakerId: string;
  seriesId?: string;
  mainScripture?: string;
  audioUrl?: string;
  videoUrl?: string;
  transcriptUrl?: string;
  transcriptText?: string;
  duration?: number;
  notesUrl?: string;
  branchId: string;
  organisationId?: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  speaker?: SpeakerEntity;
  series?: SeriesEntity;
  category?: CategoryEntity;
  tags?: TagEntity[];
}

export interface SpeakerEntity {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  memberId?: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeriesEntity {
  id: string;
  title: string;
  description?: string;
  artworkUrl?: string;
  startDate?: string;
  endDate?: string;
  branchId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryEntity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagEntity {
  id: string;
  name: string;
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface CreateSermonInput {
  title: string;
  description?: string;
  datePreached: string;
  speakerId: string;
  seriesId?: string;
  mainScripture?: string;
  audioUrl?: string;
  videoUrl?: string;
  transcriptUrl?: string;
  transcriptText?: string;
  duration?: number;
  notesUrl?: string;
  branchId: string;
  organisationId?: string;
  status?: ContentStatus;
  tags?: string[];
  categoryId?: string;
}

export interface UpdateSermonInput {
  id: string;
  title?: string;
  description?: string;
  datePreached?: string;
  speakerId?: string;
  seriesId?: string;
  mainScripture?: string;
  audioUrl?: string;
  videoUrl?: string;
  transcriptUrl?: string;
  transcriptText?: string;
  duration?: number;
  notesUrl?: string;
  branchId?: string;
  organisationId?: string;
  status?: ContentStatus;
  tags?: string[];
}

export interface CreateSpeakerInput {
  name: string;
  bio?: string;
  imageUrl?: string;
  memberId?: string;
  branchId: string;
}

export interface UpdateSpeakerInput {
  id: string;
  name?: string;
  bio?: string;
  imageUrl?: string;
  memberId?: string;
}

export interface CreateSeriesInput {
  title: string;
  description?: string;
  artworkUrl?: string;
  startDate?: string;
  endDate?: string;
  branchId: string;
  isActive?: boolean;
}

export interface UpdateSeriesInput {
  id: string;
  title?: string;
  description?: string;
  artworkUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  id: string;
  name?: string;
}

// Sermon Hooks
export const useSermons = (filters?: {
  branchId?: string;
  organisationId?: string;
  speakerId?: string;
  seriesId?: string;
  status?: ContentStatus;
}) => {
  return useQuery<{ sermons: SermonEntity[] }>(GET_SERMONS, {
    variables: filters,
    errorPolicy: "all",
  });
};

export const useSermon = (id: string) => {
  return useQuery<{ findOne: SermonEntity }>(GET_SERMON, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
};

export const useRecentSermons = (limit?: number, branchId?: string) => {
  return useQuery<{ findRecent: SermonEntity[] }>(GET_RECENT_SERMONS, {
    variables: { limit, branchId },
    errorPolicy: "all",
  });
};

export const useSearchSermons = (query: string, branchId?: string) => {
  return useQuery<{ search: SermonEntity[] }>(SEARCH_SERMONS, {
    variables: { query, branchId },
    skip: !query,
    errorPolicy: "all",
  });
};

// Speaker Hooks
export const useGetSpeakers = (branchId?: string) => {
  return useQuery(GET_SPEAKERS, {
    variables: { branchId },
    errorPolicy: "all",
  });
};

export const useGetSpeaker = (id: string) => {
  return useQuery(GET_SPEAKER, {
    variables: { id },
    errorPolicy: "all",
  });
};

export const useGetSpeakerByMember = (memberId: string) => {
  return useQuery(GET_SPEAKER_BY_MEMBER, {
    variables: { memberId },
    errorPolicy: "all",
  });
};

export const useCreateSpeaker = () => {
  return useMutation(CREATE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
    errorPolicy: "all",
  });
};

export const useUpdateSpeaker = () => {
  return useMutation(UPDATE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
    errorPolicy: "all",
  });
};

export const useDeleteSpeaker = () => {
  return useMutation(DELETE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
    errorPolicy: "all",
  });
};

// Series Hooks
export const useGetSeries = (branchId?: string) => {
  return useQuery(GET_SERIES, {
    variables: { branchId },
    errorPolicy: "all",
  });
};

export const useGetSeriesById = (id: string) => {
  return useQuery(GET_SERIES_BY_ID, {
    variables: { id },
    errorPolicy: "all",
  });
};

export const useGetActiveSeries = (branchId?: string) => {
  return useQuery(GET_ACTIVE_SERIES, {
    variables: { branchId },
    errorPolicy: "all",
  });
};

export const useCreateSeries = () => {
  return useMutation(CREATE_SERIES, {
    refetchQueries: [{ query: GET_SERIES }, { query: GET_ACTIVE_SERIES }],
    errorPolicy: "all",
  });
};

export const useUpdateSeries = () => {
  return useMutation(UPDATE_SERIES, {
    refetchQueries: [{ query: GET_SERIES }, { query: GET_ACTIVE_SERIES }],
    errorPolicy: "all",
  });
};

export const useDeleteSeries = () => {
  return useMutation(DELETE_SERIES, {
    refetchQueries: [{ query: GET_SERIES }, { query: GET_ACTIVE_SERIES }],
    errorPolicy: "all",
  });
};

// Individual Sermon Mutation Hooks
export const useCreateSermon = () => {
  return useMutation(CREATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }, { query: GET_RECENT_SERMONS }],
    errorPolicy: "all",
  });
};

export const useUpdateSermon = () => {
  return useMutation(UPDATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }, { query: GET_RECENT_SERMONS }],
    errorPolicy: "all",
  });
};

export const useDeleteSermon = () => {
  return useMutation(DELETE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }, { query: GET_RECENT_SERMONS }],
    errorPolicy: "all",
  });
};

// Category Hooks
export const useCategories = () => {
  return useQuery<{ categories: CategoryEntity[] }>(GET_CATEGORIES, {
    errorPolicy: "all",
  });
};

export const useCategory = (id: string) => {
  return useQuery<{ category: CategoryEntity }>(GET_CATEGORY, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
};

export const useCreateCategory = () => {
  return useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });
};

export const useUpdateCategory = () => {
  return useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });
};

export const useDeleteCategory = () => {
  return useMutation(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });
};

// Tags Hook
export const useTags = () => {
  return useQuery<{ tags: TagEntity[] }>(GET_TAGS, {
    errorPolicy: "all",
  });
};

// Mutation Hooks
export const useSermonMutations = () => {
  const [createSermon] = useMutation<
    { createSermon: SermonEntity },
    { createSermonInput: CreateSermonInput }
  >(CREATE_SERMON, {
    refetchQueries: [{ query: GET_SERMONS }, { query: GET_RECENT_SERMONS }],
    awaitRefetchQueries: true,
  });

  const [updateSermon] = useMutation<
    { update: SermonEntity },
    { updateSermonInput: UpdateSermonInput }
  >(UPDATE_SERMON, {
    refetchQueries: [
      { query: GET_SERMONS },
      { query: GET_SERMON },
      { query: GET_RECENT_SERMONS },
    ],
    awaitRefetchQueries: true,
  });

  const [deleteSermon] = useMutation<{ remove: SermonEntity }, { id: string }>(
    DELETE_SERMON,
    {
      refetchQueries: [{ query: GET_SERMONS }, { query: GET_RECENT_SERMONS }],
      awaitRefetchQueries: true,
    },
  );

  const [updateSermonStatus] = useMutation<
    { updateSermonStatus: SermonEntity },
    { id: string; status: ContentStatus }
  >(UPDATE_SERMON_STATUS, {
    refetchQueries: [{ query: GET_SERMONS }, { query: GET_SERMON }],
    awaitRefetchQueries: true,
  });

  const [uploadSermonMedia] = useMutation(UPLOAD_SERMON_MEDIA);

  return {
    createSermon,
    updateSermon,
    deleteSermon,
    updateSermonStatus,
    uploadSermonMedia,
  };
};

export const useSpeakerMutations = () => {
  const [createSpeaker] = useMutation<
    { create: SpeakerEntity },
    { createSpeakerInput: CreateSpeakerInput }
  >(CREATE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
    awaitRefetchQueries: true,
  });

  const [updateSpeaker] = useMutation<
    { update: SpeakerEntity },
    { updateSpeakerInput: UpdateSpeakerInput }
  >(UPDATE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
    awaitRefetchQueries: true,
  });

  const [deleteSpeaker] = useMutation<
    { remove: SpeakerEntity },
    { id: string }
  >(DELETE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }, { query: GET_SERMONS }],
    awaitRefetchQueries: true,
  });

  return {
    createSpeaker,
    updateSpeaker,
    deleteSpeaker,
  };
};

export const useSeriesMutations = () => {
  const [createSeries] = useMutation<
    { create: SeriesEntity },
    { createSeriesInput: CreateSeriesInput }
  >(CREATE_SERIES, {
    refetchQueries: [{ query: GET_SERIES }],
    awaitRefetchQueries: true,
  });

  const [updateSeries] = useMutation<
    { update: SeriesEntity },
    { updateSeriesInput: UpdateSeriesInput }
  >(UPDATE_SERIES, {
    refetchQueries: [{ query: GET_SERIES }],
    awaitRefetchQueries: true,
  });

  const [deleteSeries] = useMutation<{ remove: SeriesEntity }, { id: string }>(
    DELETE_SERIES,
    {
      refetchQueries: [{ query: GET_SERIES }, { query: GET_SERMONS }],
      awaitRefetchQueries: true,
    },
  );

  return {
    createSeries,
    updateSeries,
    deleteSeries,
  };
};
