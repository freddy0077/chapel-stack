import { useMutation } from "@apollo/client";
import { CREATE_CONFIRMATION_RECORD } from "../queries/sacramentalRecordsMutations";
import { GET_CONFIRMATION_RECORDS } from "../queries/sacramentalRecordsQueries";
import { GET_FILTERED_SACRAMENT_STATS } from "../queries/sacramentStatsQueries";

export function useCreateConfirmationRecord() {
  const [createConfirmationRecord, { data, loading, error }] = useMutation(
    CREATE_CONFIRMATION_RECORD,
    {
      refetchQueries: [
        { query: GET_CONFIRMATION_RECORDS },
        { query: GET_FILTERED_SACRAMENT_STATS },
      ],
      awaitRefetchQueries: true,
    },
  );
  return { createConfirmationRecord, data, loading, error };
}
