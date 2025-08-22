import { useMutation } from "@apollo/client";
import { UPDATE_SACRAMENTAL_RECORD } from "@/graphql/queries/sacramentalRecordsMutations";
import { GET_BAPTISM_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { GET_COMMUNION_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { GET_CONFIRMATION_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { GET_MARRIAGE_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { GET_FILTERED_SACRAMENT_STATS } from "@/graphql/queries/sacramentStatsQueries";

export const useUpdateSacramentalRecord = () => {
  return useMutation(UPDATE_SACRAMENTAL_RECORD, {
    refetchQueries: [
      { query: GET_BAPTISM_RECORDS },
      { query: GET_COMMUNION_RECORDS },
      { query: GET_CONFIRMATION_RECORDS },
      { query: GET_MARRIAGE_RECORDS },
      { query: GET_FILTERED_SACRAMENT_STATS },
    ],
    awaitRefetchQueries: true,
  });
};
