// src/graphql/mutations/onboardingMutations.ts
import { gql } from "@apollo/client"; // Assuming Apollo Client

export const CREATE_SUPER_ADMIN_USER = gql`
  mutation CreateSuperAdminUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $branchId: ID
    $organisationId: ID!
  ) {
    createSuperAdminUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      branchId: $branchId
      organisationId: $organisationId
    )
  }
`;

export const INITIALIZE_ONBOARDING = gql`
  mutation InitializeOnboarding($branchId: ID!) {
    initializeOnboarding(branchId: $branchId) {
      id
      branchId
      completedSteps
      currentStep
      isCompleted
      importedMembers
      importedFinances
      startedAt
      completedAt
      lastUpdatedAt
    }
  }
`;

export const COMPLETE_ONBOARDING_STEP = gql`
  mutation CompleteOnboardingStep($input: CompleteOnboardingStepInput!) {
    completeOnboardingStep(input: $input) {
      id
      branchId
      completedSteps
      currentStep
      isCompleted
      importedMembers
      importedFinances
      startedAt
      completedAt
      lastUpdatedAt
    }
  }
`;

export const RESET_ONBOARDING = gql`
  mutation ResetOnboarding($branchId: ID!) {
    resetOnboarding(branchId: $branchId) {
      id
      branchId
      completedSteps
      currentStep
      isCompleted
      importedMembers
      importedFinances
      startedAt
      completedAt
      lastUpdatedAt
    }
  }
`;

export const INITIATE_BRANCH_SETUP = gql`
  mutation InitiateBranchSetup($input: InitialBranchSetupInput!) {
    initiateBranchSetup(input: $input)
  }
`;

export const CONFIGURE_INITIAL_SETTINGS = gql`
  mutation ConfigureInitialSettings(
    $branchId: ID!
    $input: InitialSettingsInput!
  ) {
    configureInitialSettings(branchId: $branchId, input: $input)
  }
`;

export const IMPORT_MEMBER_DATA = gql`
  mutation ImportMemberData($branchId: ID!, $file: Upload!, $mapping: String!) {
    importMemberData(branchId: $branchId, file: $file, mapping: $mapping) {
      success
      totalRecords
      importedRecords
      errors {
        row
        column
        message
      }
      message
    }
  }
`;

export const IMPORT_FINANCIAL_DATA = gql`
  mutation ImportFinancialData(
    $branchId: ID!
    $file: Upload!
    $mapping: String!
    $type: String!
  ) {
    importFinancialData(
      branchId: $branchId
      file: $file
      mapping: $mapping
      type: $type
    ) {
      success
      totalRecords
      importedRecords
      errors {
        row
        column
        message
      }
      message
    }
  }
`;
