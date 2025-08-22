import { useMutation } from '@apollo/client';
import { CREATE_SACRAMENTAL_RECORD } from '@/graphql/queries/sacramentalRecordsMutations';
import { 
  GET_FILTERED_BAPTISM_RECORDS,
  GET_FILTERED_COMMUNION_RECORDS,
  GET_FILTERED_CONFIRMATION_RECORDS,
  GET_FILTERED_MARRIAGE_RECORDS
} from '@/graphql/queries/sacramentalRecordsQueries';
import { GET_FILTERED_SACRAMENT_STATS } from '@/graphql/queries/sacramentStatsQueries';

export function useCreateSacramentalRecord() {
  return useMutation(CREATE_SACRAMENTAL_RECORD, {
    refetchQueries: [
      { query: GET_FILTERED_BAPTISM_RECORDS },
      { query: GET_FILTERED_COMMUNION_RECORDS },
      { query: GET_FILTERED_CONFIRMATION_RECORDS },
      { query: GET_FILTERED_MARRIAGE_RECORDS },
      { query: GET_FILTERED_SACRAMENT_STATS },
    ],
    awaitRefetchQueries: true,
  });
}
