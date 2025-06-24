import { gql } from '@apollo/client';

// Get all sermons (with optional filters)
export const GET_SERMONS = gql`
  query GetSermons($branchId: String, $speakerId: String, $seriesId: String, $status: ContentStatus) {
    findAll(branchId: $branchId, speakerId: $speakerId, seriesId: $seriesId, status: $status) {
      id
      title
      description
      datePreached
      speakerId
      seriesId
      mainScripture
      audioUrl
      videoUrl
      transcriptUrl
      transcriptText
      duration
      branchId
      status
      createdAt
      updatedAt
    }
  }
`;

// Get a single sermon by ID
export const GET_SERMON = gql`
  query GetSermon($id: ID!) {
    findOne(id: $id) {
      id
      title
      description
      datePreached
      speakerId
      seriesId
      mainScripture
      audioUrl
      videoUrl
      transcriptUrl
      transcriptText
      duration
      branchId
      status
      createdAt
      updatedAt
    }
  }
`;

// Get recent sermons
export const GET_RECENT_SERMONS = gql`
  query GetRecentSermons($limit: Int, $branchId: String) {
    findRecent(limit: $limit, branchId: $branchId) {
      id
      title
      description
      datePreached
      speakerId
      status
    }
  }
`;

// Search sermons
export const SEARCH_SERMONS = gql`
  query SearchSermons($query: String!, $branchId: String) {
    search(query: $query, branchId: $branchId) {
      id
      title
      description
      datePreached
      speakerId
    }
  }
`;

// Create a new sermon
export const CREATE_SERMON = gql`
  mutation CreateSermon($input: CreateSermonInput!) {
    create(createSermonInput: $input) {
      id
      title
      description
      datePreached
      speakerId
      seriesId
      mainScripture
      audioUrl
      videoUrl
      transcriptUrl
      transcriptText
      duration
      branchId
      status
      createdAt
      updatedAt
    }
  }
`;

// Update an existing sermon
export const UPDATE_SERMON = gql`
  mutation UpdateSermon($input: UpdateSermonInput!) {
    update(updateSermonInput: $input) {
      id
      title
      description
      datePreached
      # Add other fields as needed
    }
  }
`;

// Delete a sermon
export const DELETE_SERMON = gql`
  mutation DeleteSermon($id: ID!) {
    remove(id: $id) {
      id
      title
    }
  }
`;

// Update sermon status
export const UPDATE_SERMON_STATUS = gql`
  mutation UpdateSermonStatus($id: ID!, $status: ContentStatus!) {
    updateSermonStatus(id: $id, status: $status) {
      id
      title
      status
    }
  }
`;
