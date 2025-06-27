import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/graphql/hooks/useAuth';

// GraphQL Fragments
const CONTRIBUTION_FIELDS = gql`
  fragment ContributionFields on Contribution {
    id
    amount
    date
    notes
    contributionType {
      id
      name
    }
    fund {
      id
      name
    }
    member {
      id
      firstName
      lastName
    }
  }
`;

// GraphQL Queries
const GET_FINANCIAL_DATA = gql`
  query GetFinancialData($organisationId: String!) {
    contributions(organisationId: $organisationId) {
      ...ContributionFields
    }
    funds(organisationId: $organisationId) {
      id
      name
    }
    contributionTypes(organisationId: $organisationId) {
      id
      name
    }
    paymentMethods(organisationId: $organisationId) {
      id
      name
    }
  }
  ${CONTRIBUTION_FIELDS}
`;

// GraphQL Mutations
const CREATE_CONTRIBUTION = gql`
  mutation CreateContribution($createContributionInput: CreateContributionInput!) {
    createContribution(createContributionInput: $createContributionInput) {
      ...ContributionFields
    }
  }
  ${CONTRIBUTION_FIELDS}
`;

export const useBranchFinances = () => {
  const { user } = useAuth();
  const organisationId = user?.organisationId;

  const { data, loading, error, refetch } = useQuery(GET_FINANCIAL_DATA, {
    variables: { organisationId },
    skip: !organisationId,
  });

  const [createContribution, { loading: creationLoading, error: creationError }] = useMutation(CREATE_CONTRIBUTION, {
    update(cache, { data: { createContribution } }) {
      const existingData = cache.readQuery({
        query: GET_FINANCIAL_DATA,
        variables: { organisationId },
      });

      if (existingData && createContribution) {
        cache.writeQuery({
          query: GET_FINANCIAL_DATA,
          variables: { organisationId },
          data: {
            ...existingData,
            contributions: [...existingData.contributions, createContribution],
          },
        });
      }
    },
  });

  // Process data for summary
  const summary = data?.contributions.reduce(
    (acc, contribution) => {
      acc.totalTransactions += 1;
      acc.totalAmount += contribution.amount;
      const typeName = contribution.contributionType?.name || 'Other';
      switch (typeName) {
        case 'Collection':
          acc.collections += contribution.amount;
          break;
        case 'Tithe':
          acc.tithes += contribution.amount;
          break;
        case 'Pledge':
          acc.pledges += contribution.amount;
          break;
        default:
          acc.other += contribution.amount;
          break;
      }
      return acc;
    },
    { collections: 0, tithes: 0, pledges: 0, other: 0, totalTransactions: 0, totalAmount: 0 }
  );

  return {
    summary,
    transactions: data?.contributions || [],
    funds: data?.funds || [],
    contributionTypes: data?.contributionTypes || [],
    paymentMethods: data?.paymentMethods || [],
    loading,
    error,
    refetch,
    createContribution,
    creationLoading,
    creationError,
  };
};
