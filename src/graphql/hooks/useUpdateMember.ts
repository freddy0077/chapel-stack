import { useMutation } from "@apollo/client";
import { UPDATE_MEMBER } from "../mutations/memberMutations";

export interface UpdateMemberInput {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  occupation?: string;
  employerName?: string;
  status?: string;
  membershipDate?: string;
  baptismDate?: string;
  confirmationDate?: string | null;
  notes?: string;
  branchId?: string;
}

export function useUpdateMember() {
  const [updateMemberMutation, { loading, error, data }] = useMutation(UPDATE_MEMBER);

  const updateMember = async (id: string, input: UpdateMemberInput) => {
    const result = await updateMemberMutation({
      variables: { id, updateMemberInput: { ...input, id } },
    });
    return result.data?.updateMember;
  };

  return { updateMember, loading, error, data };
}
