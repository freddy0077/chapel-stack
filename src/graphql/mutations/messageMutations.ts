import { gql } from '@apollo/client';

export const SEND_EMAIL_MUTATION = gql`
  mutation SendEmail($input: SendEmailInput!) {
    sendEmail(input: $input)
  }
`;

export const SEND_SMS_MUTATION = gql`
  mutation SendSms($input: SendSmsInput!) {
    sendSms(input: $input)
  }
`;

export const CREATE_NOTIFICATION_MUTATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input)
  }
`;
