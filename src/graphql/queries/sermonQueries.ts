import { gql } from '@apollo/client';

// Sermon Queries
export const GET_SERMONS = gql`
  query GetSermons($branchId: String, $speakerId: String, $seriesId: String, $status: String) {
    sermons(branchId: $branchId, speakerId: $speakerId, seriesId: $seriesId, status: $status) {
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
      notesUrl
      categoryId
      branchId
      status
      createdAt
      updatedAt
      speaker {
        id
        name
        bio
        imageUrl
      }
      series {
        id
        title
        description
        artworkUrl
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
      notesUrl
      categoryId
      branchId
      status
      createdAt
      updatedAt
      speaker {
        id
        name
        bio
        imageUrl
      }
      series {
        id
        title
        description
        artworkUrl
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

// Speaker Queries
export const GET_SPEAKERS = gql`
  query speakers($branchId: String) {
    speakers(branchId: $branchId) {
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

export const GET_SPEAKER = gql`
  query speaker($id: ID!) {
    speaker(id: $id) {
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

export const GET_SPEAKER_BY_MEMBER = gql`
  query findByMember($memberId: ID!) {
    findByMember(memberId: $memberId) {
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

// Series Queries
export const GET_SERIES = gql`
  query series($branchId: String) {
    series(branchId: $branchId) {
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

export const GET_SERIES_BY_ID = gql`
  query seriesById($id: ID!) {
    seriesById(id: $id) {
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

export const GET_ACTIVE_SERIES = gql`
  query getActiveSeries($branchId: String) {
    getActiveSeries(branchId: $branchId) {
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

// Category Queries (Note: No mutations available in backend)
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const GET_CATEGORY = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

// Additional Sermon Queries
export const GET_RECENT_SERMONS = gql`
  query GetRecentSermons($limit: Int, $branchId: String) {
    findRecent(limit: $limit, branchId: $branchId) {
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
      notesUrl
      categoryId
      branchId
      status
      createdAt
      updatedAt
      speaker {
        id
        name
        bio
        imageUrl
      }
      series {
        id
        title
        description
        artworkUrl
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

export const SEARCH_SERMONS = gql`
  query SearchSermons($query: String!, $branchId: String) {
    search(query: $query, branchId: $branchId) {
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
      notesUrl
      categoryId
      branchId
      status
      createdAt
      updatedAt
      speaker {
        id
        name
        bio
        imageUrl
      }
      series {
        id
        title
        description
        artworkUrl
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

// Tags Query (if available)
export const GET_TAGS = gql`
  query GetTags {
    tags {
      id
      name
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
      speakerId
      seriesId
      mainScripture
      audioUrl
      videoUrl
      transcriptUrl
      transcriptText
      duration
      notesUrl
      categoryId
      branchId
      status
      createdAt
      updatedAt
      speaker {
        id
        name
        bio
        imageUrl
      }
      series {
        id
        title
        description
        artworkUrl
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
