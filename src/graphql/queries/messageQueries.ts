import { gql } from '@apollo/client';

export const ALL_MESSAGES_QUERY = gql`
  query AllMessages($filter: AllMessagesFilterInput) {
    allMessages(filter: $filter) {
      ... on EmailMessageDto {
        id
        subject
        branchId
        bodyHtml
        bodyText
        senderEmail
        recipients
        sentAt
        status
        templateId
        createdAt
        updatedAt
      }
      ... on SmsMessageDto {
        id
        body
        branchId
        senderNumber
        recipients
        sentAt
        status
        createdAt
        updatedAt
      }
      ... on NotificationDto {
        id
        title
        branchId
        message
        isRead
        readAt
        link
        type
        memberId
        createdAt
        updatedAt
      }
    }
    messageCounts {
      total
      email
      sms
      notification
    }
  }
`;

export const GET_MESSAGE_BY_ID = gql`
  query GetMessageById($id: ID!, $type: String!) {
    messageById(id: $id, type: $type) {
      ... on EmailMessageDto {
        id
        subject
        branchId
        bodyHtml
        bodyText
        senderEmail
        recipients
        sentAt
        status
        templateId
        createdAt
        updatedAt
      }
      ... on SmsMessageDto {
        id
        body
        branchId
        senderNumber
        recipients
        sentAt
        status
        createdAt
        updatedAt
      }
      ... on NotificationDto {
        id
        title
        branchId
        message
        isRead
        readAt
        link
        type
        memberId
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_EMAIL_TEMPLATES = gql`
  query GetEmailTemplates($organisationId: String!, $branchId: String) {
    emailTemplates(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      bodyHtml
      bodyText
      subject
      category
      createdAt
      updatedAt
    }
  }
`;

export const GET_MESSAGE_ANALYTICS = gql`
  query GetMessageAnalytics($filter: CommunicationStatsFilterInput!) {
    messagePerformanceMetrics(filter: $filter) {
      overallDeliveryRate
      overallOpenRate
      overallResponseRate
      templates {
        templateName
        sent
        delivered
        deliveryRate
        opened
        openRate
        clicked
        clickRate
        responded
        responseRate
        averageResponseTime
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($filter: MessageFilterInput) {
    messages(filter: $filter) {
      items {
        id
        type
        subject
        content
        recipientCount
        status
        createdAt
        scheduledFor
        stats {
          openRate
          clickRate
          deliveryRate
        }
      }
      totalCount
    }
  }
`;

export const GET_MESSAGE_STATS = gql`
  query GetMessageStats {
    messageStats {
      totalSent
      emailStats {
        sent
        opened
        clicked
      }
      smsStats {
        sent
        delivered
      }
      notificationStats {
        sent
        opened
      }
    }
  }
`;
