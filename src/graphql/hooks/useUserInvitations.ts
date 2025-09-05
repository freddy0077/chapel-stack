import { useMutation } from "@apollo/client";
import { CREATE_USERS_WITH_ROLE } from "../mutations/userMutations";

export interface InvitationUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface CreateUsersWithRoleResult {
  email: string;
  firstName: string;
  lastName: string;
  roleName: string;
  id: string;
  error?: string;
}

export interface CreateUsersWithRoleResponse {
  createUsersWithRole: CreateUsersWithRoleResult[];
}

export const useCreateUsersWithRole = () => {
  const [mutate, { data, loading, error }] = useMutation<
    CreateUsersWithRoleResponse,
    { input: { users: InvitationUserInput[] } }
  >(CREATE_USERS_WITH_ROLE);

  return {
    createUsersWithRole: mutate,
    result: data?.createUsersWithRole,
    loading,
    error,
  };
};
