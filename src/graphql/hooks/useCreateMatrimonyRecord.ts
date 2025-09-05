import { useMutation } from "@apollo/client";
import { CREATE_MATRIMONY_RECORD } from "../queries/sacramentalRecordsMutations";
import { GET_MARRIAGE_RECORDS } from "../queries/sacramentalRecordsQueries";
import { GET_FILTERED_SACRAMENT_STATS } from "../queries/sacramentStatsQueries";

export function useCreateMatrimonyRecord() {
  const [createMatrimonyRecord, { data, loading, error }] = useMutation(
    CREATE_MATRIMONY_RECORD,
    {
      refetchQueries: [
        { query: GET_MARRIAGE_RECORDS },
        { query: GET_FILTERED_SACRAMENT_STATS },
      ],
      awaitRefetchQueries: true,
    },
  );
  return { createMatrimonyRecord, data, loading, error };
}
