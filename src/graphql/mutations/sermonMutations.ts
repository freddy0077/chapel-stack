import { gql } from '@apollo/client';

export const CREATE_SERMON = gql`
  mutation CreateSermon($input: CreateSermonInput!) {
    createSermon(input: $input) {
      id
      title
      description
      date
      status
      speakerId
      seriesId
      mediaUrl
      thumbnailUrl
      duration
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SERMON = gql`
  mutation UpdateSermon($id: ID!, $input: UpdateSermonInput!) {
    updateSermon(id: $id, input: $input) {
      id
      title
      description
      date
      status
      speakerId
      seriesId
      mediaUrl
      thumbnailUrl
      duration
      branchId
      updatedAt
    }
  }
`;

export const DELETE_SERMON = gql`
  mutation DeleteSermon($id: ID!) {
    deleteSermon(id: $id) {
      id
      title
    }
  }
`;

export const UPLOAD_SERMON_MEDIA = gql`
  mutation UploadSermonMedia($file: Upload!, $type: String!, $sermonId: ID) {
    uploadSermonMedia(file: $file, type: $type, sermonId: $sermonId) {
      url
      type
      filename
      mimetype
      encoding
      size
    }
  }
`;

export const CREATE_SERIES = gql`
  mutation CreateSeries($input: CreateSeriesInput!) {
    createSeries(input: $input) {
      id
      title
      description
      imageUrl
      isActive
    }
  }
`;

export const CREATE_SPEAKER = gql`
  mutation CreateSpeaker($input: CreateSpeakerInput!) {
    createSpeaker(input: $input) {
      id
      name
      title
      bio
      imageUrl
      isActive
    }
  }
`;

export const INCREMENT_VIEW_COUNT = gql`
  mutation IncrementViewCount($id: ID!) {
    incrementViewCount(id: $id) {
      id
      viewCount
    }
  }
`;

export const TOGGLE_LIKE = gql`
  mutation ToggleLike($id: ID!) {
    toggleLike(id: $id) {
      id
      likeCount
      isLiked
    }
  }
`;
