import { useMutation } from "@apollo/client";
import { ASSIGN_ROLE_TO_USER } from "../mutations/assignRoleMutations";

export function useAssignRoleToUser() {
  const [assignRoleToUser, { data, loading, error }] =
    useMutation(ASSIGN_ROLE_TO_USER);
  return { assignRoleToUser, data, loading, error };
}
