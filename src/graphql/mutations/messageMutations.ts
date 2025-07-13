import { gql } from '@apollo/client';

export const SEND_EMAIL = gql`
  mutation SendEmail($input: SendEmailInput!) {
    sendEmail(input: $input)
  }
`;

export const SEND_SMS = gql`
  mutation SendSms($input: SendSmsInput!) {
    sendSms(input: $input)
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input)
  }
`;

export const CREATE_EMAIL_TEMPLATE = gql`
  mutation CreateEmailTemplate($input: CreateEmailTemplateInput!) {
    createEmailTemplate(input: $input) {
      id
      name
      description
      subject
      bodyHtml
      bodyText
      category
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL_TEMPLATE = gql`
  mutation UpdateEmailTemplate($id: ID!, $input: UpdateEmailTemplateInput!) {
    updateEmailTemplate(id: $id, input: $input) {
      id
      name
      description
      subject
      bodyHtml
      bodyText
      category
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EMAIL_TEMPLATE = gql`
  mutation DeleteEmailTemplate($id: ID!) {
    deleteEmailTemplate(id: $id)
  }
`;

export const SCHEDULE_MESSAGE = gql`
  mutation ScheduleMessage($input: ScheduleMessageInput!) {
    scheduleMessage(input: $input) {
      id
      scheduledFor
      status
    }
  }
`;

export const CANCEL_SCHEDULED_MESSAGE = gql`
  mutation CancelScheduledMessage($id: ID!) {
    cancelScheduledMessage(id: $id)
  }
`;
