import { gql } from '@apollo/client';

/**
 * Create a new announcement
 */
export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      content
      category
      priority
      status
      publishedAt
      scheduledFor
      expiresAt
      targetAudience
      targetGroupIds
      imageUrl
      attachmentUrl
      sendEmail
      sendPush
      displayOnBoard
      displayOnDashboard
      createdBy
      creator {
        id
        firstName
        lastName
        email
      }
      branchId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Update an announcement
 */
export const UPDATE_ANNOUNCEMENT = gql`
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      title
      content
      category
      priority
      status
      publishedAt
      scheduledFor
      expiresAt
      targetAudience
      targetGroupIds
      imageUrl
      attachmentUrl
      sendEmail
      sendPush
      displayOnBoard
      displayOnDashboard
      createdBy
      creator {
        id
        firstName
        lastName
        email
      }
      branchId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Delete an announcement
 */
export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`;

/**
 * Publish an announcement
 */
export const PUBLISH_ANNOUNCEMENT = gql`
  mutation PublishAnnouncement($id: ID!) {
    publishAnnouncement(id: $id) {
      id
      title
      status
      publishedAt
      creator {
        id
        firstName
        lastName
        email
      }
      _count {
        reads
        deliveries
      }
      updatedAt
    }
  }
`;

/**
 * Schedule an announcement
 */
export const SCHEDULE_ANNOUNCEMENT = gql`
  mutation ScheduleAnnouncement($id: ID!, $scheduledFor: DateTime!) {
    scheduleAnnouncement(id: $id, scheduledFor: $scheduledFor) {
      id
      title
      status
      scheduledFor
      updatedAt
    }
  }
`;

/**
 * Archive an announcement
 */
export const ARCHIVE_ANNOUNCEMENT = gql`
  mutation ArchiveAnnouncement($id: ID!) {
    archiveAnnouncement(id: $id) {
      id
      title
      status
      updatedAt
    }
  }
`;

/**
 * Mark announcement as read
 */
export const MARK_ANNOUNCEMENT_AS_READ = gql`
  mutation MarkAnnouncementAsRead($id: ID!) {
    markAnnouncementAsRead(id: $id)
  }
`;

/**
 * Create an announcement template
 */
export const CREATE_ANNOUNCEMENT_TEMPLATE = gql`
  mutation CreateAnnouncementTemplate($input: CreateAnnouncementTemplateInput!) {
    createAnnouncementTemplate(input: $input) {
      id
      name
      description
      content
      category
      isSystem
      branchId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Delete an announcement template
 */
export const DELETE_ANNOUNCEMENT_TEMPLATE = gql`
  mutation DeleteAnnouncementTemplate($id: ID!) {
    deleteAnnouncementTemplate(id: $id)
  }
`;

/**
 * Retry failed deliveries for an announcement
 */
export const RETRY_ANNOUNCEMENT_DELIVERIES = gql`
  mutation RetryAnnouncementDeliveries($id: ID!) {
    retryAnnouncementDeliveries(id: $id)
  }
`;

/**
 * Track email open
 */
export const TRACK_ANNOUNCEMENT_EMAIL_OPEN = gql`
  mutation TrackAnnouncementEmailOpen($announcementId: ID!) {
    trackAnnouncementEmailOpen(announcementId: $announcementId)
  }
`;

/**
 * Track link click
 */
export const TRACK_ANNOUNCEMENT_LINK_CLICK = gql`
  mutation TrackAnnouncementLinkClick($announcementId: ID!) {
    trackAnnouncementLinkClick(announcementId: $announcementId)
  }
`;
