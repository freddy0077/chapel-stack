import { gql } from '@apollo/client';

export const GET_BROADCAST = gql`
  query GetBroadcast($id: ID!) {
    broadcast(id: $id) {
      id
      title
      description
      scheduledStartTime
      scheduledEndTime
      actualStartTime
      actualEndTime
      status
      zoomMeetingId
      zoomJoinUrl
      zoomStartUrl
      facebookLiveId
      instagramLiveId
      isRecorded
      isPublic
      maxAttendees
      thumbnailUrl
      recordingUrl
      viewerCount
      peakViewerCount
      organisationId
      branchId
      createdById
      platforms {
        id
        platform
        platformId
        streamUrl
        status
        viewerCount
        error
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_BROADCASTS = gql`
  query GetBroadcasts($filter: BroadcastFilterInput!) {
    broadcasts(filter: $filter) {
      id
      title
      description
      scheduledStartTime
      scheduledEndTime
      status
      viewerCount
      peakViewerCount
      thumbnailUrl
      platforms {
        platform
        status
        viewerCount
      }
      createdAt
    }
  }
`;

export const GET_UPCOMING_BROADCASTS = gql`
  query GetUpcomingBroadcasts($organisationId: ID!, $branchId: ID) {
    upcomingBroadcasts(organisationId: $organisationId, branchId: $branchId) {
      id
      title
      description
      scheduledStartTime
      scheduledEndTime
      status
      thumbnailUrl
      platforms {
        platform
        status
      }
      createdAt
    }
  }
`;

export const GET_LIVE_BROADCASTS = gql`
  query GetLiveBroadcasts($organisationId: ID!, $branchId: ID) {
    liveBroadcasts(organisationId: $organisationId, branchId: $branchId) {
      id
      title
      actualStartTime
      viewerCount
      peakViewerCount
      zoomJoinUrl
      platforms {
        platform
        status
        viewerCount
      }
    }
  }
`;
