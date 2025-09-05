import { useMutation } from "@apollo/client";
import { CREATE_BAPTISM_RECORD } from "../queries/sacramentalRecordsMutations";
import { GET_BAPTISM_RECORDS } from "../queries/sacramentalRecordsQueries";
import { GET_FILTERED_SACRAMENT_STATS } from "../queries/sacramentStatsQueries";

export function useCreateBaptismRecord() {
  const [createBaptismRecord, { data, loading, error }] = useMutation(
    CREATE_BAPTISM_RECORD,
    {
      refetchQueries: [
        { query: GET_BAPTISM_RECORDS },
        { query: GET_FILTERED_SACRAMENT_STATS },
      ],
      awaitRefetchQueries: true,
    },
  );
  return { createBaptismRecord, data, loading, error };
}
