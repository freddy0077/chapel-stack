import { useMutation } from "@apollo/client";
import { CREATE_NOTIFICATION_MUTATION } from "../mutations/messageMutations";

export function useCreateNotification() {
  const [createNotification, { data, loading, error }] = useMutation(
    CREATE_NOTIFICATION_MUTATION,
  );
  return { createNotification, data, loading, error };
}
