import { gql } from '@apollo/client';

export const GET_BROADCAST_HEALTH = gql`
  query GetBroadcastHealth($broadcastId: ID!) {
    broadcastHealth(broadcastId: $broadcastId) {
      score
      platforms {
        platform
        isHealthy
        latency
        error
        timestamp
      }
    }
  }
`;

export const GET_PLATFORM_HEALTH_HISTORY = gql`
  query GetPlatformHealthHistory($platformId: ID!, $hours: Int) {
    platformHealthHistory(platformId: $platformId, hours: $hours) {
      timestamp
      isHealthy
      latency
      error
    }
  }
`;

export const GET_STREAM_QUALITY = gql`
  query GetStreamQuality($platformId: ID!) {
    streamQuality(platformId: $platformId) {
      bitrate
      fps
      resolution
      droppedFrames
      bufferHealth
      latency
      jitter
      packetLoss
      score
      alerts {
        type
        severity
        message
        timestamp
      }
      recommendations
    }
  }
`;

export const GET_QUALITY_HISTORY = gql`
  query GetQualityHistory($platformId: ID!, $hours: Int) {
    qualityHistory(platformId: $platformId, hours: $hours) {
      timestamp
      bitrate
      fps
      latency
      packetLoss
      bufferHealth
    }
  }
`;

export const FORCE_HEALTH_CHECK = gql`
  mutation ForceHealthCheck($broadcastId: ID!) {
    forceHealthCheck(broadcastId: $broadcastId) {
      platform
      isHealthy
      latency
      error
      timestamp
    }
  }
`;
