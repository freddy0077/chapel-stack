import { gql } from '@apollo/client';

export const CONNECT_STREAMING_PLATFORM = gql`
  mutation ConnectStreamingPlatform($input: ConnectPlatformInput!) {
    connectStreamingPlatform(input: $input) {
      id
      platform
      platformUserId
      platformUserName
      tokenExpiresAt
      isActive
    }
  }
`;

export const DISCONNECT_STREAMING_PLATFORM = gql`
  mutation DisconnectStreamingPlatform($platform: String!) {
    disconnectStreamingPlatform(platform: $platform)
  }
`;
