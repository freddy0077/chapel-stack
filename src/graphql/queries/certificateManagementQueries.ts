import { gql } from '@apollo/client';

// Template fragments for reusability
const TEMPLATE_FRAGMENT = gql`
  fragment TemplateFragment on CertificateTemplate {
    id
    name
    description
    denomination
    sacramentType
    liturgicalElements {
      type
      content
      position
    }
    customFields {
      id
      type
      required
      defaultValue
    }
    styling {
      primaryColor
      secondaryColor
      fontFamily
      borderStyle
      backgroundPattern
    }
    language
    isDefault
    previewUrl
    createdAt
    updatedAt
  }
`;

const GENERATION_FRAGMENT = gql`
  fragment GenerationFragment on CertificateGeneration {
    id
    certificateNumber
    templateId
    sacramentalRecordId
    status
    format
    fileUrl
    downloadUrl
    previewUrl
    errorMessage
    generatedBy
    generatedAt
    downloadedAt
    expiresAt
    createdAt
    updatedAt
  }
`;

const RECENT_CERTIFICATE_FRAGMENT = gql`
  fragment RecentCertificateFragment on RecentCertificate {
    id
    certificateNumber
    memberName
    sacramentType
    templateName
    status
    generatedAt
    downloadUrl
  }
`;

// Get all templates
export const GET_CERTIFICATE_TEMPLATES = gql`
  query GetCertificateTemplates($denomination: ChurchDenomination, $sacramentType: CertificateSacramentType) {
    certificateTemplates(denomination: $denomination, sacramentType: $sacramentType) {
      ...TemplateFragment
    }
  }
  ${TEMPLATE_FRAGMENT}
`;

// Search templates
export const SEARCH_CERTIFICATE_TEMPLATES = gql`
  query SearchCertificateTemplates($searchTerm: String!, $denomination: ChurchDenomination, $sacramentType: CertificateSacramentType) {
    searchCertificateTemplates(searchTerm: $searchTerm, denomination: $denomination, sacramentType: $sacramentType) {
      ...TemplateFragment
    }
  }
  ${TEMPLATE_FRAGMENT}
`;

// Get default templates
export const GET_DEFAULT_TEMPLATES = gql`
  query GetDefaultTemplates($denomination: ChurchDenomination!, $sacramentType: CertificateSacramentType!) {
    defaultCertificateTemplate(denomination: $denomination, sacramentType: $sacramentType) {
      ...TemplateFragment
    }
  }
  ${TEMPLATE_FRAGMENT}
`;

// Get recommended templates
export const GET_RECOMMENDED_TEMPLATES = gql`
  query GetRecommendedTemplates($branchId: ID!, $sacramentType: CertificateSacramentType, $limit: Float) {
    recommendedCertificateTemplates(branchId: $branchId, sacramentType: $sacramentType, limit: $limit) {
      ...TemplateFragment
    }
  }
  ${TEMPLATE_FRAGMENT}
`;

// Get supported denominations
export const GET_SUPPORTED_DENOMINATIONS = gql`
  query GetSupportedDenominations {
    supportedDenominations
  }
`;

// Get supported sacrament types
export const GET_SUPPORTED_SACRAMENT_TYPES = gql`
  query GetSupportedSacramentTypes {
    supportedCertificateSacramentTypes
  }
`;

// Get template preview URL
export const GET_TEMPLATE_PREVIEW_URL = gql`
  query GetTemplatePreviewUrl($templateId: ID!, $sacramentalRecordId: ID!) {
    certificateTemplatePreview(templateId: $templateId, sacramentalRecordId: $sacramentalRecordId)
  }
`;

// Certificate generation stats
export const GET_CERTIFICATE_GENERATION_STATS = gql`
  query GetCertificateGenerationStats($branchId: ID) {
    certificateGenerationStats(branchId: $branchId) {
      totalGenerated
      thisMonth
      pending
      completed
      failed
      monthlyGrowth
      averageGenerationTime
      mostUsedTemplate
      totalDownloads
    }
  }
`;

// Recent certificates
export const GET_RECENT_CERTIFICATES = gql`
  query GetRecentCertificates($limit: Float, $branchId: ID) {
    recentCertificates(limit: $limit, branchId: $branchId) {
      ...RecentCertificateFragment
    }
  }
  ${RECENT_CERTIFICATE_FRAGMENT}
`;

// Certificate Generation Mutations
export const GENERATE_CERTIFICATE = gql`
  mutation GenerateCertificate($input: GenerateCertificateInput!) {
    generateCertificate(input: $input) {
      ...GenerationFragment
    }
  }
  ${GENERATION_FRAGMENT}
`;

export const BULK_GENERATE_CERTIFICATES = gql`
  mutation BulkGenerateCertificates($input: BulkCertificateGenerationInput!) {
    bulkGenerateCertificates(input: $input) {
      batchId
      totalRecords
      successCount
      failureCount
      certificates {
        ...GenerationFragment
      }
      errors
      startedAt
      completedAt
    }
  }
  ${GENERATION_FRAGMENT}
`;
