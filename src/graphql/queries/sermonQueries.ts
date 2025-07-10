import { gql } from '@apollo/client';

// Get all sermons (with optional branchId filter)
export const GET_SERMONS = gql`
  query Sermons(
    $branchId: String
    $speakerId: String
    $seriesId: String
    $status: String
  ) {
    sermons(
      branchId: $branchId
      speakerId: $speakerId
      seriesId: $seriesId
      status: $status
    ) {
      id
      title
      description
      datePreached
      mainScripture
      duration
      status
      createdAt
      updatedAt
      speaker {
        id
        name
      }
      series {
        id
        title
      }
      category {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

// Get a single sermon by ID
export const GET_SERMON = gql`
  query GetSermon($id: String!) {
    sermon(id: $id) {
      id
      title
      description
      datePreached
      speaker {
        id
        name
      }
      series {
        id
        title
      }
      category {
        id
        name
      }
      tags {
        id
        name
      }
      videoUrl
      audioUrl
      notesUrl
    }
  }
`;

// Get recent sermons
export const GET_RECENT_SERMONS = gql`
  query GetRecentSermons($limit: Int, $branchId: String) {
    recentSermons(limit: $limit, branchId: $branchId) {
      id
      title
      datePreached
      status
      speaker {
        id
        name
      }
    }
  }
`;

// Search sermons
export const SEARCH_SERMONS = gql`
  query SearchSermons($query: String!, $branchId: String) {
    searchSermons(query: $query, branchId: $branchId) {
      id
      title
      description
      datePreached
      speaker {
        id
        name
      }
    }
  }
`;

// Create a new sermon
export const CREATE_SERMON = gql`
  mutation CreateSermon($input: CreateSermonInput!) {
    createSermon(createSermonInput: $input) {
      id
      title
    }
  }
`;

// Update an existing sermon
export const UPDATE_SERMON = gql`
  mutation UpdateSermon($input: UpdateSermonInput!) {
    updateSermon(updateSermonInput: $input) {
      id
      title
      description
      datePreached
      speaker {
        id
        name
      }
      series {
        id
        title
      }
      category {
        id
        name
      }
      tags {
        id
        name
      }
    }
  }
`;

// Delete a sermon
export const DELETE_SERMON = gql`
  mutation DeleteSermon($id: ID!) {
    deleteSermon(id: $id) {
      id
      title
    }
  }
`;

// Update sermon status
export const UPDATE_SERMON_STATUS = gql`
  mutation UpdateSermonStatus($id: ID!, $status: String!) {
    updateSermonStatus(id: $id, status: $status) {
      id
      title
      status
    }
  }
`;

// Get speakers
export const GET_SPEAKERS = gql`
  query GetSpeakers($branchId: String) {
    members(branchId: $branchId) {
      id
      firstName
      lastName
    }
  }
`;

// Get series
export const GET_SERIES = gql`
  query GetSeries($branchId: String) {
    series(branchId: $branchId) {
      id
      title
    }
  }
`;

// Get categories
export const GET_CATEGORIES = gql`
  query GetCategories($branchId: String) {
    categories(branchId: $branchId) {
      id
      name
    }
  }
`;
