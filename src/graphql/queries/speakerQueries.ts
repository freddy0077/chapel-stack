import { gql } from '@apollo/client';

// Get all speakers (optionally by branch)
export const GET_SPEAKERS = gql`
  query GetSpeakers($branchId: String) {
    speakers(branchId: $branchId) {
      id
      name
      title
      bio
      imageUrl
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Get a single speaker by ID
export const GET_SPEAKER = gql`
  query GetSpeaker($id: ID!) {
    speaker(id: $id) {
      id
      name
      title
      bio
      imageUrl
      isActive
      createdAt
      updatedAt
    }
  }
`;

// Get speaker by memberId
export const GET_SPEAKER_BY_MEMBER = gql`
  query GetSpeakerByMember($memberId: ID!) {
    findByMember(memberId: $memberId) {
      id
      name
      title
      bio
      imageUrl
      isActive
      createdAt
      updatedAt
    }
  }
`;
