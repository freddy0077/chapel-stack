import { useMutation } from "@apollo/client";
import { CREATE_FIRST_COMMUNION_RECORD } from "../queries/sacramentalRecordsMutations";
import { GET_COMMUNION_RECORDS } from "../queries/sacramentalRecordsQueries";
import { GET_FILTERED_SACRAMENT_STATS } from "../queries/sacramentStatsQueries";

export function useCreateFirstCommunionRecord() {
  const [createFirstCommunionRecord, { data, loading, error }] = useMutation(
    CREATE_FIRST_COMMUNION_RECORD,
    {
      refetchQueries: [
        { query: GET_COMMUNION_RECORDS },
        { query: GET_FILTERED_SACRAMENT_STATS },
      ],
      awaitRefetchQueries: true,
    },
  );
  return { createFirstCommunionRecord, data, loading, error };
}
