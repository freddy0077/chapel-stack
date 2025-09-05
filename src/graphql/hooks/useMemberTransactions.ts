import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_MEMBER_TRANSACTIONS = gql`
  query GetMemberTransactions(
    $organisationId: String!
    $userId: String!
    $skip: Int
    $take: Int
  ) {
    transactions(
      organisationId: $organisationId
      userId: $userId
      paginationInput: { skip: $skip, take: $take }
    ) {
      items {
        id
        type
        amount
        date
        description
        fundId
        branchId
        organisationId
        userId
        metadata
        createdAt
        updatedAt
        fund {
          id
          name
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export function useMemberTransactions({
  organisationId,
  userId,
  skip = 0,
  take = 20,
}) {
  const { data, loading, error, refetch } = useQuery(GET_MEMBER_TRANSACTIONS, {
    variables: { organisationId, userId, skip, take },
    skip: !organisationId || !userId,
    fetchPolicy: "cache-and-network",
  });

  return {
    transactions: data?.transactions?.items || [],
    totalCount: data?.transactions?.totalCount || 0,
    hasNextPage: data?.transactions?.hasNextPage || false,
    loading,
    error,
    refetch,
  };
}
