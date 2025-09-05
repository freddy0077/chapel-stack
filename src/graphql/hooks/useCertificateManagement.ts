import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CERTIFICATE_TEMPLATES,
  SEARCH_CERTIFICATE_TEMPLATES,
  GET_DEFAULT_TEMPLATES,
  GET_RECOMMENDED_TEMPLATES,
  GET_SUPPORTED_DENOMINATIONS,
  GET_SUPPORTED_SACRAMENT_TYPES,
  GET_TEMPLATE_PREVIEW_URL,
  GET_CERTIFICATE_GENERATION_STATS,
  GET_RECENT_CERTIFICATES,
  GENERATE_CERTIFICATE,
  BULK_GENERATE_CERTIFICATES,
} from "../queries/certificateManagementQueries";

// Hook for getting certificate templates
export const useCertificateTemplates = (
  denomination?: string,
  sacramentType?: string,
) => {
  return useQuery(GET_CERTIFICATE_TEMPLATES, {
    variables: { denomination, sacramentType },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
};

// Hook for searching certificate templates
export const useSearchCertificateTemplates = (
  searchTerm: string,
  denomination?: string,
  sacramentType?: string,
) => {
  return useQuery(SEARCH_CERTIFICATE_TEMPLATES, {
    variables: { searchTerm, denomination, sacramentType },
    skip: !searchTerm || searchTerm.length < 2,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
};

// Hook for getting default templates
export const useDefaultTemplates = (
  denomination: string,
  sacramentType: string,
) => {
  return useQuery(GET_DEFAULT_TEMPLATES, {
    variables: { denomination, sacramentType },
    skip: !denomination || !sacramentType,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
};

// Hook for getting recommended templates
export const useRecommendedTemplates = (
  branchId: string,
  sacramentType?: string,
  limit?: number,
) => {
  return useQuery(GET_RECOMMENDED_TEMPLATES, {
    variables: { branchId, sacramentType, limit },
    skip: !branchId,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
};

// Hook for getting supported denominations
export const useSupportedDenominations = () => {
  return useQuery(GET_SUPPORTED_DENOMINATIONS, {
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });
};

// Hook for getting supported sacrament types
export const useSupportedSacramentTypes = () => {
  return useQuery(GET_SUPPORTED_SACRAMENT_TYPES, {
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });
};

// Hook for getting template preview URL
export const useTemplatePreviewUrl = (
  templateId: string,
  sacramentalRecordId: string,
) => {
  return useQuery(GET_TEMPLATE_PREVIEW_URL, {
    variables: { templateId, sacramentalRecordId },
    skip: !templateId || !sacramentalRecordId,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });
};

// Hook for certificate generation stats
export const useCertificateGenerationStats = (branchId?: string) => {
  return useQuery(GET_CERTIFICATE_GENERATION_STATS, {
    variables: { branchId },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    pollInterval: 30000, // Poll every 30 seconds for real-time updates
  });
};

// Hook for recent certificates
export const useRecentCertificates = (limit?: number, branchId?: string) => {
  return useQuery(GET_RECENT_CERTIFICATES, {
    variables: { limit, branchId },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    pollInterval: 15000, // Poll every 15 seconds for real-time updates
  });
};

// Hook for generating a certificate
export const useGenerateCertificate = () => {
  return useMutation(GENERATE_CERTIFICATE, {
    errorPolicy: "all",
    refetchQueries: ["GetCertificateGenerationStats", "GetRecentCertificates"],
  });
};

// Hook for bulk generating certificates
export const useBulkGenerateCertificates = () => {
  return useMutation(BULK_GENERATE_CERTIFICATES, {
    errorPolicy: "all",
    refetchQueries: ["GetCertificateGenerationStats", "GetRecentCertificates"],
  });
};

// Combined hook for certificate management dashboard data
export const useCertificateManagementDashboard = (branchId?: string) => {
  const statsQuery = useCertificateGenerationStats(branchId);
  const recentCertificatesQuery = useRecentCertificates(10, branchId);
  const denominationsQuery = useSupportedDenominations();
  const sacramentTypesQuery = useSupportedSacramentTypes();

  return {
    stats: {
      data: statsQuery.data?.certificateGenerationStats,
      loading: statsQuery.loading,
      error: statsQuery.error,
      refetch: statsQuery.refetch,
    },
    recentCertificates: {
      data: recentCertificatesQuery.data?.recentCertificates || [],
      loading: recentCertificatesQuery.loading,
      error: recentCertificatesQuery.error,
      refetch: recentCertificatesQuery.refetch,
    },
    denominations: {
      data: denominationsQuery.data?.supportedDenominations || [],
      loading: denominationsQuery.loading,
      error: denominationsQuery.error,
    },
    sacramentTypes: {
      data: sacramentTypesQuery.data?.supportedCertificateSacramentTypes || [],
      loading: sacramentTypesQuery.loading,
      error: sacramentTypesQuery.error,
    },
    loading:
      statsQuery.loading ||
      recentCertificatesQuery.loading ||
      denominationsQuery.loading ||
      sacramentTypesQuery.loading,
    refetch: () => {
      statsQuery.refetch();
      recentCertificatesQuery.refetch();
    },
  };
};

// Combined hook for template management
export const useTemplateManagement = (
  searchTerm?: string,
  denomination?: string,
  sacramentType?: string,
) => {
  const templatesQuery = useCertificateTemplates(denomination, sacramentType);
  const searchQuery = useSearchCertificateTemplates(
    searchTerm || "",
    denomination,
    sacramentType,
  );
  const denominationsQuery = useSupportedDenominations();
  const sacramentTypesQuery = useSupportedSacramentTypes();

  // Use search results if search term is provided, otherwise use all templates
  const activeQuery =
    searchTerm && searchTerm.length >= 2 ? searchQuery : templatesQuery;

  return {
    templates: {
      data:
        activeQuery.data?.certificateTemplates ||
        activeQuery.data?.searchCertificateTemplates ||
        [],
      loading: activeQuery.loading,
      error: activeQuery.error,
      refetch: activeQuery.refetch,
    },
    denominations: {
      data: denominationsQuery.data?.supportedDenominations || [],
      loading: denominationsQuery.loading,
      error: denominationsQuery.error,
    },
    sacramentTypes: {
      data: sacramentTypesQuery.data?.supportedCertificateSacramentTypes || [],
      loading: sacramentTypesQuery.loading,
      error: sacramentTypesQuery.error,
    },
    loading:
      activeQuery.loading ||
      denominationsQuery.loading ||
      sacramentTypesQuery.loading,
  };
};
