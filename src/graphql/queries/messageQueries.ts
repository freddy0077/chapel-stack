import { gql } from "@apollo/client";

export const ALL_MESSAGES_QUERY = gql`
  query AllMessages($filter: AllMessagesFilterInput) {
    allMessages(filter: $filter) {
      ... on EmailMessageDto {
        id
        subject
        organisationId
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
        organisationId
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
        organisationId
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
  query GetMessageStats($filter: CommunicationStatsFilterInput) {
    communicationStats(filter: $filter) {
      totalEmailsSent
      totalSmsSent
      totalNotifications
      emailStatusCounts {
        status
        count
      }
      smsStatusCounts {
        status
        count
      }
      messagesByDate {
        date
        count
      }
      activeTemplates
      deliveryRate
      averageResponseTime
    }
  }
`;

export const SEND_EMAIL_MUTATION = gql`
  mutation SendEmail($input: SendEmailInput!) {
    sendEmail(input: $input)
  }
`;

export const SEND_EMAIL_WITH_TRACKING_MUTATION = gql`
  mutation SendEmailWithTracking($input: SendEmailInput!) {
    sendEmailWithTracking(input: $input) {
      success
      messageId
      recipientCount
      scheduledFor
      status
      estimatedDelivery
      message
    }
  }
`;

export const SEND_SMS_MUTATION = gql`
  mutation SendSms($input: SendSmsInput!) {
    sendSms(input: $input)
  }
`;

export const SEND_SMS_WITH_TRACKING_MUTATION = gql`
  mutation SendSmsWithTracking($input: SendSmsInput!) {
    sendSmsWithTracking(input: $input) {
      success
      messageId
      recipientCount
      scheduledFor
      status
      estimatedDelivery
      message
    }
  }
`;

export const SEND_NOTIFICATION_MUTATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
      title
      message
      createdAt
    }
  }
`;

export const GET_RECIPIENT_COUNT_QUERY = gql`
  query GetRecipientCount($input: GetRecipientCountInput!) {
    getRecipientCount(input: $input) {
      totalMembers
      uniqueMembers
      duplicateCount
      breakdown {
        source
        name
        count
        id
      }
      message
    }
  }
`;
