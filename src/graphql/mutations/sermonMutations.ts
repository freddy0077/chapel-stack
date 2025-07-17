import { gql } from '@apollo/client';

// Sermon Mutations
export const CREATE_SERMON = gql`
  mutation CreateSermon($createSermonInput: CreateSermonInput!) {
    createSermon(createSermonInput: $createSermonInput) {
      id
      title
      description
      datePreached
      mainScripture
      audioUrl
      videoUrl
      transcriptUrl
      transcriptText
      duration
      status
      notesUrl
      branchId
      organisationId
      speaker {
        id
        name
      }
      series {
        id
        title
      }
      tags {
        id
        name
      }
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SERMON = gql`
  mutation UpdateSermon($updateSermonInput: UpdateSermonInput!) {
    updateSermon(updateSermonInput: $updateSermonInput) {
      id
      title
      description
      datePreached
      mainScripture
      audioUrl
      videoUrl
      transcriptUrl
      transcriptText
      duration
      status
      notesUrl
      branchId
      organisationId
      speaker {
        id
        name
      }
      series {
        id
        title
      }
      tags {
        id
        name
      }
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SERMON = gql`
  mutation DeleteSermon($id: ID!) {
    removeSermon(id: $id) {
      id
      title
    }
  }
`;

export const UPDATE_SERMON_STATUS = gql`
  mutation UpdateSermonStatus($id: ID!, $status: ContentStatus!) {
    updateSermonStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// Speaker Mutations
export const CREATE_SPEAKER = gql`
  mutation createSpeaker($createSpeakerInput: CreateSpeakerInput!) {
    createSpeaker(createSpeakerInput: $createSpeakerInput) {
      id
      name
      bio
      imageUrl
      memberId
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SPEAKER = gql`
  mutation updateSpeaker($updateSpeakerInput: UpdateSpeakerInput!) {
    updateSpeaker(updateSpeakerInput: $updateSpeakerInput) {
      id
      name
      bio
      imageUrl
      memberId
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SPEAKER = gql`
  mutation removeSpeaker($id: ID!) {
    removeSpeaker(id: $id) {
      id
      name
      bio
      imageUrl
      memberId
      branchId
      createdAt
      updatedAt
    }
  }
`;

// Series Mutations
export const CREATE_SERIES = gql`
  mutation createSeries($createSeriesInput: CreateSeriesInput!) {
    createSeries(createSeriesInput: $createSeriesInput) {
      id
      title
      description
      startDate
      endDate
      imageUrl
      artworkUrl
      isActive
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SERIES = gql`
  mutation updateSeries($updateSeriesInput: UpdateSeriesInput!) {
    updateSeries(updateSeriesInput: $updateSeriesInput) {
      id
      title
      description
      startDate
      endDate
      imageUrl
      artworkUrl
      isActive
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SERIES = gql`
  mutation removeSeries($id: ID!) {
    removeSeries(id: $id) {
      id
      title
      description
      startDate
      endDate
      imageUrl
      artworkUrl
      isActive
      branchId
      createdAt
      updatedAt
    }
  }
`;

// Note: Category mutations are NOT available in the backend
// The CategoryResolver only has queries (categories, category)
// Categories must be managed through direct database access or admin interface

// Media Upload Mutation
export const UPLOAD_SERMON_MEDIA = gql`
  mutation UploadSermonMedia($file: Upload!, $sermonId: ID!, $mediaType: String!) {
    uploadSermonMedia(file: $file, sermonId: $sermonId, mediaType: $mediaType) {
      id
      url
      type
    }
  }
`;

// Category Mutations
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;
