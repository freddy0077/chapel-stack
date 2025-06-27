import { useQuery } from "@apollo/client";
import { 
  GET_FILTERED_BAPTISM_RECORDS,
  GET_FILTERED_COMMUNION_RECORDS,
  GET_FILTERED_CONFIRMATION_RECORDS,
  GET_FILTERED_MARRIAGE_RECORDS
} from "@/graphql/queries/sacramentalRecordsQueries";

export interface SacramentalRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  officiantName: string;
  locationOfSacrament: string;
  certificateUrl?: string;
  certificateNumber?: string;
  witness1Name?: string;
  witness2Name?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SacramentalRecordFilter {
  branchId?: string;
  organisationId?: string;
}

export function useFilteredBaptismRecords(filter: SacramentalRecordFilter) {
  // Prepare variables, omitting properties with empty values
  const variables: { branchId?: string; organisationId?: string } = {};
  
  if (filter.branchId) {
    variables.branchId = filter.branchId;
  }
  
  if (filter.organisationId) {
    variables.organisationId = filter.organisationId;
  }
  
  const { data, loading, error } = useQuery<{ sacramentalRecords: SacramentalRecord[] }>(
    GET_FILTERED_BAPTISM_RECORDS,
    {
      variables,
      skip: !filter.branchId && !filter.organisationId,
      fetchPolicy: "cache-and-network",
    }
  );
  
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}

export function useFilteredCommunionRecords(filter: SacramentalRecordFilter) {
  // Prepare variables, omitting properties with empty values
  const variables: { branchId?: string; organisationId?: string } = {};
  
  if (filter.branchId) {
    variables.branchId = filter.branchId;
  }
  
  if (filter.organisationId) {
    variables.organisationId = filter.organisationId;
  }
  
  const { data, loading, error } = useQuery<{ sacramentalRecords: SacramentalRecord[] }>(
    GET_FILTERED_COMMUNION_RECORDS,
    {
      variables,
      skip: !filter.branchId && !filter.organisationId,
      fetchPolicy: "cache-and-network",
    }
  );
  
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}

export function useFilteredConfirmationRecords(filter: SacramentalRecordFilter) {
  // Prepare variables, omitting properties with empty values
  const variables: { branchId?: string; organisationId?: string } = {};
  
  if (filter.branchId) {
    variables.branchId = filter.branchId;
  }
  
  if (filter.organisationId) {
    variables.organisationId = filter.organisationId;
  }
  
  const { data, loading, error } = useQuery<{ sacramentalRecords: SacramentalRecord[] }>(
    GET_FILTERED_CONFIRMATION_RECORDS,
    {
      variables,
      skip: !filter.branchId && !filter.organisationId,
      fetchPolicy: "cache-and-network",
    }
  );
  
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}

export function useFilteredMarriageRecords(filter: SacramentalRecordFilter) {
  // Prepare variables, omitting properties with empty values
  const variables: { branchId?: string; organisationId?: string } = {};
  
  if (filter.branchId) {
    variables.branchId = filter.branchId;
  }
  
  if (filter.organisationId) {
    variables.organisationId = filter.organisationId;
  }
  
  const { data, loading, error } = useQuery<{ sacramentalRecords: SacramentalRecord[] }>(
    GET_FILTERED_MARRIAGE_RECORDS,
    {
      variables,
      skip: !filter.branchId && !filter.organisationId,
      fetchPolicy: "cache-and-network",
    }
  );
  
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}
