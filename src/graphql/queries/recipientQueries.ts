import { gql } from "@apollo/client";

export const GET_RECIPIENT_GROUPS = gql`
  query RecipientGroups {
    recipientGroups {
      id
      name
      type
    }
  }
`;

export const MEMBER_SEARCH = gql`
  query MemberSearch($query: String!) {
    memberSearch(query: $query) {
      id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

export const FILTERED_MEMBERS = gql`
  query FilteredMembers($filter: MemberFilterInput) {
    filteredMembers(filter: $filter) {
      id
      firstName
      lastName
      email
      phoneNumber
      gender
      status
    }
  }
`;

export const BIRTHDAY_MEMBERS = gql`
  query BirthdayMembers($range: BirthdayRangeEnum!) {
    birthdayMembers(range: $range) {
      id
      firstName
      lastName
      dateOfBirth
    }
  }
`;

export const GET_RECIPIENT_FILTER_COUNTS = gql`
  query RecipientFilterCounts($input: RecipientCountInput!) {
    recipientFilterCounts(input: $input) {
      filter
      count
    }
  }
`;
