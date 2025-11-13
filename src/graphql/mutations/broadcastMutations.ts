import { gql } from '@apollo/client';

export const CREATE_BROADCAST = gql`
  mutation CreateBroadcast($input: CreateBroadcastInput!) {
    createBroadcast(input: $input) {
      id
      title
      description
      scheduledStartTime
      status
      platforms {
        id
        platform
        status
      }
    }
  }
`;

export const UPDATE_BROADCAST = gql`
  mutation UpdateBroadcast($id: ID!, $input: UpdateBroadcastInput!) {
    updateBroadcast(id: $id, input: $input) {
      id
      title
      description
      scheduledStartTime
      scheduledEndTime
      status
    }
  }
`;

export const DELETE_BROADCAST = gql`
  mutation DeleteBroadcast($id: ID!) {
    deleteBroadcast(id: $id) {
      id
    }
  }
`;

export const START_BROADCAST = gql`
  mutation StartBroadcast($id: ID!) {
    startBroadcast(id: $id) {
      id
      status
      actualStartTime
      zoomStartUrl
      platforms {
        platform
        status
      }
    }
  }
`;

export const END_BROADCAST = gql`
  mutation EndBroadcast($id: ID!) {
    endBroadcast(id: $id) {
      id
      status
      actualEndTime
      recordingUrl
    }
  }
`;

export const CANCEL_BROADCAST = gql`
  mutation CancelBroadcast($id: ID!) {
    cancelBroadcast(id: $id) {
      id
      status
    }
  }
`;

export const CONNECT_PLATFORM = gql`
  mutation ConnectPlatform($broadcastId: ID!, $platform: String!) {
    connectPlatform(broadcastId: $broadcastId, platform: $platform) {
      id
      platform
      platformId
      status
    }
  }
`;

export const DISCONNECT_PLATFORM = gql`
  mutation DisconnectPlatform($broadcastId: ID!, $platform: String!) {
    disconnectPlatform(broadcastId: $broadcastId, platform: $platform)
  }
`;
