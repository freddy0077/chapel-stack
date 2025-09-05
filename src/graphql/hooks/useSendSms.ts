import { useMutation } from "@apollo/client";
import { SEND_SMS_MUTATION } from "../mutations/messageMutations";

export function useSendSms() {
  const [sendSms, { data, loading, error }] = useMutation(SEND_SMS_MUTATION);
  return { sendSms, data, loading, error };
}
