import { useMutation, useQuery } from "@apollo/client";
import {
  REGISTER_MUTATION,
  CHECK_EMAIL_FOR_MEMBER_LINKING,
} from "../mutations/auth";

/**
 * useRegisterUser Hook
 * Handles user registration via GraphQL mutation
 * @returns Object with registerUser function, loading state, and error
 */
export const useRegisterUser = () => {
  const [registerUser, { loading, error, data }] = useMutation(
    REGISTER_MUTATION
  );

  return {
    registerUser,
    loading,
    error,
    data,
  };
};

/**
 * useCheckEmailForMember Hook
 * Checks if an email exists in the members database and can be linked
 * @param email - Email address to check
 * @param organisationId - Organization ID to scope the search
 * @returns Object with member info, loading state, and error
 */
export const useCheckEmailForMember = (
  email: string,
  organisationId: string
) => {
  const { data, loading, error, refetch } = useQuery(
    CHECK_EMAIL_FOR_MEMBER_LINKING,
    {
      variables: { email, organisationId },
      skip: !email || !organisationId, // Don't query if email or org is empty
      errorPolicy: "all", // Return data even if there are errors
    }
  );

  return {
    memberInfo: data?.checkEmailForMemberLinking,
    loading,
    error,
    refetch,
  };
};
