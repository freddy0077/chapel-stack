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
  }
`;
