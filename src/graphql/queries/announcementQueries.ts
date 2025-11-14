import { gql } from '@apollo/client';

/**
 * Get all announcements for a branch with optional filters and pagination
 */
export const GET_ANNOUNCEMENTS = gql`
  query GetAnnouncements(
    $branchId: ID!
    $filters: AnnouncementFiltersInput
    $limit: Int
    $offset: Int
  ) {
    announcements(
      branchId: $branchId
      filters: $filters
      limit: $limit
      offset: $offset
    ) {
      announcements {
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
        _count {
          reads
          deliveries
        }
        createdAt
        updatedAt
      }
      total
      limit
      offset
    }
  }
`;

/**
 * Get a single announcement by ID
 */
export const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($id: ID!) {
    announcement(id: $id) {
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
      _count {
        reads
        deliveries
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get published announcements for notice board
 */
export const GET_PUBLISHED_ANNOUNCEMENTS = gql`
  query GetPublishedAnnouncements(
    $branchId: ID!
    $limit: Int
    $offset: Int
  ) {
    publishedAnnouncements(
      branchId: $branchId
      limit: $limit
      offset: $offset
    ) {
      announcements {
        id
        title
        content
        category
        priority
        status
        publishedAt
        targetAudience
        imageUrl
        creator {
          id
          firstName
          lastName
          email
        }
        branchId
        _count {
          reads
          deliveries
        }
        createdAt
      }
      total
      limit
      offset
    }
  }
`;

/**
 * Get delivery status for an announcement
 */
export const GET_ANNOUNCEMENT_DELIVERY_STATUS = gql`
  query GetAnnouncementDeliveryStatus($id: ID!) {
    announcementDeliveryStatus(id: $id) {
      totalRecipients
      successfulDeliveries
      failedDeliveries
      pendingDeliveries
      emailDeliveries
      pushDeliveries
      lastDeliveryAttempt
    }
  }
`;

/**
 * Get engagement metrics for an announcement
 */
export const GET_ANNOUNCEMENT_METRICS = gql`
  query GetAnnouncementMetrics($id: ID!) {
    announcementMetrics(id: $id) {
      totalReads
      readRate
      totalClicks
      clickRate
      emailOpens
      emailOpenRate
      pushOpens
      pushOpenRate
      engagementScore
    }
  }
`;

/**
 * Get announcement templates
 */
export const GET_ANNOUNCEMENT_TEMPLATES = gql`
  query GetAnnouncementTemplates($branchId: ID!) {
    announcementTemplates(branchId: $branchId) {
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
 * Get a single announcement template
 */
export const GET_ANNOUNCEMENT_TEMPLATE = gql`
  query GetAnnouncementTemplate($id: ID!) {
    announcementTemplate(id: $id) {
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
