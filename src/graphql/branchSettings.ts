import { gql } from "@apollo/client";

// Fragment for branch settings fields
export const BRANCH_SETTINGS_FRAGMENT = gql`
  fragment BranchSettingsFields on BranchSettings {
    id
    createdAt
    updatedAt
    allowMemberTransfers
    allowResourceSharing
    visibilityToOtherBranches
    financialReportingLevel
    attendanceReportingLevel
    memberDataVisibility
    timezone
    currency
    language
    brandingSettings {
      primaryColor
      secondaryColor
      fontFamily
    }
    notificationSettings {
      emailNotifications
      smsNotifications
      transferNotifications
      financialNotifications
    }
  }
`;

// Query to get branch settings
export const GET_BRANCH_SETTINGS = gql`
  query GetBranchSettings($id: String!) {
    branch(id: $id) {
      id
      name
      settings {
        ...BranchSettingsFields
      }
    }
  }
  ${BRANCH_SETTINGS_FRAGMENT}
`;

// Mutation to update branch settings
export const UPDATE_BRANCH_SETTINGS = gql`
  mutation UpdateBranchSettings(
    $branchId: String!
    $input: UpdateBranchSettingsInput!
  ) {
    updateBranchSettings(branchId: $branchId, input: $input) {
      id
      createdAt
      updatedAt
      allowMemberTransfers
      allowResourceSharing
      visibilityToOtherBranches
      financialReportingLevel
      attendanceReportingLevel
      memberDataVisibility
      timezone
      currency
      language
      brandingSettings {
        primaryColor
        secondaryColor
        fontFamily
      }
      notificationSettings {
        emailNotifications
        smsNotifications
        transferNotifications
        financialNotifications
      }
    }
  }
`;
