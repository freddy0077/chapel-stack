import { gql, useMutation } from "@apollo/client";

export const REGISTER = gql`
  mutation Register($input: SignUpDto!) {
    register(input: $input) {
      id
      email
      firstName
      lastName
      organisationId
      createdAt
      updatedAt
    }
  }
`;

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  branchInviteCode?: string | null;
}

export function useRegister() {
  const [mutate, state] = useMutation(REGISTER);
  const register = async (input: RegisterInput) => {
    const { data } = await mutate({ variables: { input } });
    return data?.register;
    
  };
  return { register, ...state };
}
