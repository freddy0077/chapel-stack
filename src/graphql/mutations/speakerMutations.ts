import { gql } from '@apollo/client';

export const CREATE_SPEAKER = gql`
  mutation CreateSpeaker($createSpeakerInput: CreateSpeakerInput!) {
    createSpeaker(createSpeakerInput: $createSpeakerInput) {
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

export const UPDATE_SPEAKER = gql`
  mutation UpdateSpeaker($updateSpeakerInput: UpdateSpeakerInput!) {
    updateSpeaker(updateSpeakerInput: $updateSpeakerInput) {
      id
      name
      title
      bio
      imageUrl
      isActive
      updatedAt
    }
  }
`;

export const REMOVE_SPEAKER = gql`
  mutation RemoveSpeaker($id: ID!) {
    remove(id: $id) {
      id
    }
  }
`;
