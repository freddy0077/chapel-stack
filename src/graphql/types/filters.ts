/**
 * Common filter interface for queries that can filter by either branch or organization
 * Used for consistent filtering across different entity types
 */
export interface OrganizationBranchFilterInput {
  branchId?: string;
  organisationId?: string;
}
