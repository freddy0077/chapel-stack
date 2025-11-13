import { gql } from '@apollo/client';

export const GET_MESSAGE_TEMPLATES = gql`
  query GetMessageTemplates($filters: MessageTemplateFiltersInput) {
    messageTemplates(filters: $filters) {
      id
      name
      description
      category
      type
      subject
      bodyText
      bodyHtml
      variables
      isActive
      isSystem
      usageCount
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_MESSAGE_TEMPLATE = gql`
  query GetMessageTemplate($id: ID!) {
    messageTemplate(id: $id) {
      id
      name
      description
      category
      type
      subject
      bodyText
      bodyHtml
      variables
      isActive
      isSystem
      usageCount
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_MESSAGE_TEMPLATE = gql`
  mutation CreateMessageTemplate($input: CreateMessageTemplateInput!) {
    createMessageTemplate(input: $input) {
      id
      name
      description
      category
      type
      subject
      bodyText
      bodyHtml
      variables
      isActive
      isSystem
      usageCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_MESSAGE_TEMPLATE = gql`
  mutation UpdateMessageTemplate($input: UpdateMessageTemplateInput!) {
    updateMessageTemplate(input: $input) {
      id
      name
      description
      category
      type
      subject
      bodyText
      bodyHtml
      variables
      isActive
      isSystem
      usageCount
      updatedAt
    }
  }
`;

export const DELETE_MESSAGE_TEMPLATE = gql`
  mutation DeleteMessageTemplate($id: ID!) {
    deleteMessageTemplate(id: $id) {
      success
      message
    }
  }
`;

export const DUPLICATE_MESSAGE_TEMPLATE = gql`
  mutation DuplicateMessageTemplate($id: ID!) {
    duplicateMessageTemplate(id: $id) {
      id
      name
      description
      category
      type
      subject
      bodyText
      bodyHtml
      variables
      isActive
      isSystem
      usageCount
      createdAt
      updatedAt
    }
  }
`;
