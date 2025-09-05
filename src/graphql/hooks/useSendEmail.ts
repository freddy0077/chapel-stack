import { useMutation } from "@apollo/client";
import { SEND_EMAIL_MUTATION } from "../mutations/messageMutations";

export function useSendEmail() {
  const [sendEmail, { data, loading, error }] =
    useMutation(SEND_EMAIL_MUTATION);
  return { sendEmail, data, loading, error };
}
