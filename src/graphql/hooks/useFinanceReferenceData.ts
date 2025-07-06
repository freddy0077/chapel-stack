import { useQuery } from "@apollo/client";
import { GET_FUNDS, GET_CONTRIBUTION_TYPES, GET_PAYMENT_METHODS } from "../queries/financeReferenceQueries";

export function useFinanceReferenceData(organisationId: string, branchId?: string) {
  const { data: fundsData, loading: fundsLoading, error: fundsError } = useQuery(GET_FUNDS, { variables: { branchId }, skip: !branchId });
  const { data: typesData, loading: typesLoading, error: typesError } = useQuery(GET_CONTRIBUTION_TYPES, { variables: { organisationId, branchId }, skip: !organisationId });
  const { data: methodsData, loading: methodsLoading, error: methodsError } = useQuery(GET_PAYMENT_METHODS, { variables: { organisationId }, skip: !organisationId });

  return {
    funds: fundsData?.funds ?? [],
    contributionTypes: typesData?.contributionTypes ?? [],
    paymentMethods: methodsData?.paymentMethods ?? [],
    loading: fundsLoading || typesLoading || methodsLoading,
    error: fundsError || typesError || methodsError,
  };
}
