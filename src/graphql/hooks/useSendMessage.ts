import { useMutation } from "@apollo/client";
import {
  SEND_EMAIL_MUTATION,
  SEND_SMS_MUTATION,
  SEND_NOTIFICATION_MUTATION,
} from "../queries/messageQueries";

export function useSendEmail() {
  const [sendEmail, { data, loading, error }] =
    useMutation(SEND_EMAIL_MUTATION);
  return { sendEmail, data, loading, error };
}

export function useSendSms() {
  const [sendSms, { data, loading, error }] = useMutation(SEND_SMS_MUTATION);
  return { sendSms, data, loading, error };
}

export function useSendNotification() {
  const [sendNotification, { data, loading, error }] = useMutation(
    SEND_NOTIFICATION_MUTATION,
  );
  return { sendNotification, data, loading, error };
}
