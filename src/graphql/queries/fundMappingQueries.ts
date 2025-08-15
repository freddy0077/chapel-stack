import { gql } from '@apollo/client';

export const GET_FUND_MAPPING_CONFIGURATION = gql`
  query GetFundMappingConfiguration($branchId: ID!, $organisationId: ID!) {
    fundMappingConfiguration(branchId: $branchId, organisationId: $organisationId) {
      branchId
      organisationId
      lastUpdated
      mappings {
        id
        contributionTypeId
        fundId
        isActive
        createdAt
        updatedAt
        contributionType {
          id
          name
          description
          isActive
        }
        fund {
          id
          name
          description
          isActive
        }
      }
      availableContributionTypes {
        id
        name
        description
        isActive
      }
      availableFunds {
        id
        name
        description
        isActive
      }
    }
  }
`;

export const GET_CONTRIBUTION_TYPE_FUND_MAPPINGS = gql`
  query GetContributionTypeFundMappings($filter: ContributionTypeFundMappingFilterInput!) {
    contributionTypeFundMappings(filter: $filter) {
      total
      mappings {
        id
        contributionTypeId
        fundId
        branchId
        organisationId
        isActive
        createdAt
        updatedAt
        createdBy
        updatedBy
        contributionType {
          id
          name
          description
          isActive
        }
        fund {
          id
          name
          description
          isActive
        }
      }
    }
  }
`;

export const CREATE_CONTRIBUTION_TYPE_FUND_MAPPING = gql`
  mutation CreateContributionTypeFundMapping($input: CreateContributionTypeFundMappingInput!) {
    createContributionTypeFundMapping(input: $input) {
      id
      contributionTypeId
      fundId
      branchId
      organisationId
      isActive
      createdAt
      contributionType {
        id
        name
        description
      }
      fund {
        id
        name
        description
      }
    }
  }
`;

export const UPDATE_CONTRIBUTION_TYPE_FUND_MAPPING = gql`
  mutation UpdateContributionTypeFundMapping($input: UpdateContributionTypeFundMappingInput!) {
    updateContributionTypeFundMapping(input: $input) {
      id
      contributionTypeId
      fundId
      branchId
      organisationId
      isActive
      updatedAt
      contributionType {
        id
        name
        description
      }
      fund {
        id
        name
        description
      }
    }
  }
`;

export const DELETE_CONTRIBUTION_TYPE_FUND_MAPPING = gql`
  mutation DeleteContributionTypeFundMapping($id: ID!) {
    deleteContributionTypeFundMapping(id: $id)
  }
`;

export const CREATE_DEFAULT_FUND_MAPPINGS = gql`
  mutation CreateDefaultFundMappings($branchId: ID!, $organisationId: ID!) {
    createDefaultFundMappings(branchId: $branchId, organisationId: $organisationId) {
      id
      contributionTypeId
      fundId
      isActive
      contributionType {
        id
        name
        description
      }
      fund {
        id
        name
        description
      }
    }
  }
`;

export const GET_FUND_FOR_CONTRIBUTION_TYPE = gql`
  query GetFundForContributionType($contributionTypeId: ID!, $branchId: ID!, $organisationId: ID!) {
    getFundForContributionType(
      contributionTypeId: $contributionTypeId
      branchId: $branchId
      organisationId: $organisationId
    )
  }
`;

export const GET_FUND_FOR_CONTRIBUTION_TYPE_NAME = gql`
  query GetFundForContributionTypeName($contributionTypeName: String!, $branchId: ID!, $organisationId: ID!) {
    getFundForContributionTypeName(
      contributionTypeName: $contributionTypeName
      branchId: $branchId
      organisationId: $organisationId
    )
  }
`;
