// src/graphql/queries/onboardingQueries.ts
import { gql } from '@apollo/client'; // Assuming Apollo Client

export const GET_ONBOARDING_PROGRESS = gql`
  query OnboardingProgress($branchId: ID!) {
    onboardingProgress(branchId: $branchId) {
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

export const GENERATE_MEMBER_IMPORT_TEMPLATE = gql`
  query GenerateMemberImportTemplate {
    generateMemberImportTemplate
  }
`;

export const GENERATE_FUNDS_IMPORT_TEMPLATE = gql`
  query GenerateFundsImportTemplate {
    generateFundsImportTemplate
  }
`;
