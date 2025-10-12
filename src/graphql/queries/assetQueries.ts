import { gql } from '@apollo/client';

// ============================================
// ASSET TYPE QUERIES
// ============================================

export const GET_ASSET_TYPES = gql`
  query GetAssetTypes($organisationId: String!) {
    assetTypes(organisationId: $organisationId) {
      id
      name
      description
      defaultDepreciationRate
      category
      icon
      color
      customFields
      assetCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_ASSET_TYPE = gql`
  query GetAssetType($id: String!) {
    assetType(id: $id) {
      id
      name
      description
      defaultDepreciationRate
      category
      icon
      color
      customFields
      assetCount
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// ASSET QUERIES
// ============================================

export const GET_ASSETS = gql`
  query GetAssets($filters: AssetFilterInput!) {
    assets(filters: $filters) {
      id
      assetCode
      name
      description
      assetTypeId
      assetType {
        id
        name
        category
        icon
        color
      }
      purchaseDate
      purchasePrice
      currentValue
      depreciationRate
      location
      assignedToMemberId
      assignedToMember {
        id
        firstName
        lastName
        email
      }
      assignedToDepartment
      status
      condition
      warrantyExpiryDate
      supplier
      serialNumber
      modelNumber
      photos
      attachments
      notes
      customData
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ASSET = gql`
  query GetAsset($id: String!) {
    asset(id: $id) {
      id
      assetCode
      name
      description
      assetTypeId
      assetType {
        id
        name
        category
        icon
        color
      }
      purchaseDate
      purchasePrice
      currentValue
      depreciationRate
      location
      assignedToMemberId
      assignedToMember {
        id
        firstName
        lastName
        email
      }
      assignedToDepartment
      status
      condition
      warrantyExpiryDate
      supplier
      serialNumber
      modelNumber
      photos
      attachments
      notes
      customData
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ASSET_STATISTICS = gql`
  query GetAssetStatistics($organisationId: String!, $branchId: String) {
    assetStatistics(organisationId: $organisationId, branchId: $branchId) {
      totalAssets
      activeAssets
      disposedAssets
      inMaintenanceAssets
      totalValue
      totalPurchaseValue
      totalDepreciation
    }
  }
`;

// ============================================
// ASSET DISPOSAL QUERIES
// ============================================

export const GET_ASSET_DISPOSALS = gql`
  query GetAssetDisposals($filters: AssetDisposalFilterInput!) {
    assetDisposals(filters: $filters) {
      id
      assetId
      asset {
        id
        assetCode
        name
        assetType {
          id
          name
        }
      }
      disposalDate
      disposalMethod
      disposalReason
      salePrice
      buyerRecipient
      approvedByMemberId
      approvedByMember {
        id
        firstName
        lastName
      }
      disposalNotes
      bookValueAtDisposal
      gainLossOnDisposal
      documents
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

// ============================================
// ASSET MUTATIONS
// ============================================

export const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      assetCode
      name
      description
      assetTypeId
      assetType {
        id
        name
      }
      purchaseDate
      purchasePrice
      currentValue
      status
      condition
      location
      createdAt
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset($input: UpdateAssetInput!) {
    updateAsset(input: $input) {
      id
      assetCode
      name
      description
      assetTypeId
      assetType {
        id
        name
      }
      purchaseDate
      purchasePrice
      currentValue
      status
      condition
      location
      updatedAt
    }
  }
`;

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: String!) {
    deleteAsset(id: $id)
  }
`;

export const RECALCULATE_ASSET_VALUES = gql`
  mutation RecalculateAssetValues($organisationId: String!) {
    recalculateAssetValues(organisationId: $organisationId)
  }
`;

// ============================================
// ASSET TYPE MUTATIONS
// ============================================

export const CREATE_ASSET_TYPE = gql`
  mutation CreateAssetType($input: CreateAssetTypeInput!) {
    createAssetType(input: $input) {
      id
      name
      description
      defaultDepreciationRate
      category
      icon
      color
      customFields
      createdAt
    }
  }
`;

export const UPDATE_ASSET_TYPE = gql`
  mutation UpdateAssetType($input: UpdateAssetTypeInput!) {
    updateAssetType(input: $input) {
      id
      name
      description
      defaultDepreciationRate
      category
      icon
      color
      customFields
      updatedAt
    }
  }
`;

export const DELETE_ASSET_TYPE = gql`
  mutation DeleteAssetType($id: String!) {
    deleteAssetType(id: $id)
  }
`;

// ============================================
// ASSET DISPOSAL MUTATIONS
// ============================================

export const DISPOSE_ASSET = gql`
  mutation DisposeAsset($input: CreateAssetDisposalInput!) {
    disposeAsset(input: $input) {
      id
      assetId
      asset {
        id
        assetCode
        name
      }
      disposalDate
      disposalMethod
      disposalReason
      salePrice
      buyerRecipient
      gainLossOnDisposal
      createdAt
    }
  }
`;
