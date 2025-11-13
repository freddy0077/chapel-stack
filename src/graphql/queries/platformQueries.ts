import { gql } from '@apollo/client';

export const GET_CONNECTED_PLATFORMS = gql`
  query GetConnectedPlatforms {
    connectedPlatforms {
      id
      platform
      platformUserId
      platformUserName
      tokenExpiresAt
      isActive
      isExpired
      createdAt
    }
  }
`;

export const GET_PLATFORM_STATUS = gql`
  query GetPlatformStatus($platform: String!) {
    platformStatus(platform: $platform) {
      connected
      platform
      platformUserId
      platformUserName
      tokenExpiresAt
      isExpired
      status
    }
  }
`;
