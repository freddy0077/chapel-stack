import { useMutation } from "@apollo/client";
import { CREATE_ROLE_WITH_PERMISSIONS } from "../mutations/roleMutations";

export interface CreateRoleWithPermissionsInput {
  name: string;
  description: string;
  permissionIds: string[];
}

export function useCreateRoleWithPermissions() {
  const [createRoleWithPermissions, { data, loading, error, reset }] =
    useMutation(CREATE_ROLE_WITH_PERMISSIONS);

  return {
    createRoleWithPermissions,
    data,
    loading,
    error,
    reset,
  };
}
