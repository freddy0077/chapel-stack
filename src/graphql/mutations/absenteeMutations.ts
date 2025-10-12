import { gql } from '@apollo/client';

export const SEND_ABSENTEE_MESSAGE = gql`
  mutation SendAbsenteeMessage($input: SendAbsenteeMessageInput!) {
    sendAbsenteeMessage(input: $input) {
      id
      recipientCount
      deliveredCount
      failedCount
      sentAt
    }
  }
`;
