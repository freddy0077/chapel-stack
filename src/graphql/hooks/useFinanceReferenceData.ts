import { useQuery } from "@apollo/client";
import {
  GET_FUNDS,
  GET_CONTRIBUTION_TYPES,
  GET_PAYMENT_METHODS,
} from "../queries/financeReferenceQueries";

export function useFinanceReferenceData(
  organisationId: string,
  branchId?: string,
) {
  const {
    data: fundsData,
    loading: fundsLoading,
    error: fundsError,
  } = useQuery(GET_FUNDS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  // Contribution types and payment methods are now global (no filtering by org/branch)
  const {
    data: typesData,
    loading: typesLoading,
    error: typesError,
  } = useQuery(GET_CONTRIBUTION_TYPES);
  const {
    data: methodsData,
    loading: methodsLoading,
    error: methodsError,
  } = useQuery(GET_PAYMENT_METHODS);

  return {
    funds: fundsData?.funds ?? [],
    contributionTypes: typesData?.contributionTypes ?? [],
    paymentMethods: methodsData?.paymentMethods ?? [],
    loading: fundsLoading || typesLoading || methodsLoading,
    error: fundsError || typesError || methodsError,
  };
}
