import { useQuery } from "@apollo/client";
import { GET_MINISTRY } from "@/graphql/queries/ministryQueries";

export function useMinistry(id: string | undefined) {
  const { data, loading, error, refetch } = useQuery(GET_MINISTRY, {
    variables: { id },
    skip: !id,
    fetchPolicy: "cache-and-network",
  });
  return {
    ministry: data?.ministry || null,
    loading,
    error,
    refetch,
  };
}
