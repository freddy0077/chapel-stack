import { useQuery, useMutation } from '@apollo/client';
import { GET_OFFERING_BATCHES, GET_OFFERING_BATCH_BY_ID } from '@/graphql/finance/queries';
import {
  CREATE_OFFERING_BATCH,
  VERIFY_OFFERING_BATCH,
  APPROVE_OFFERING_BATCH,
  POST_OFFERING_TO_GL,
} from '@/graphql/finance/mutations';
import { useToast } from '@/hooks/use-toast';
import { useConflictDialog } from '@/components/finance/ConflictDialog';

interface UseOfferingBatchesProps {
  organisationId: string;
  branchId: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  take?: number;
}

export const useOfferingBatches = ({
  organisationId,
  branchId,
  status,
  startDate,
  endDate,
  skip = 0,
  take = 50,
}: UseOfferingBatchesProps) => {
  const { toast } = useToast();
  const { showConflict, isConflictError } = useConflictDialog();

  // Query offering batches
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_OFFERING_BATCHES, {
    variables: {
      organisationId,
      branchId,
      status,
      startDate,
      endDate,
      skip,
      take,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Create offering batch mutation
  const [createOfferingBatchMutation, { loading: creating }] = useMutation(CREATE_OFFERING_BATCH, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId, status, startDate, endDate, skip, take } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Offering batch created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create offering batch',
        variant: 'destructive',
      });
    },
  });

  // Verify offering batch mutation
  const [verifyOfferingBatchMutation, { loading: verifying }] = useMutation(VERIFY_OFFERING_BATCH, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId, status, startDate, endDate, skip, take } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Offering batch verified successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify offering batch',
        variant: 'destructive',
      });
    },
  });

  // Approve offering batch mutation with optimistic locking
  const [approveOfferingBatchMutation, { loading: approving }] = useMutation(APPROVE_OFFERING_BATCH, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId, status, startDate, endDate, skip, take } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Offering batch approved successfully',
      });
    },
    onError: (error) => {
      if (isConflictError(error)) {
        showConflict(error.message, 'Offering Batch');
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to approve offering batch',
          variant: 'destructive',
        });
      }
    },
  });

  // Post offering to GL mutation with optimistic locking
  const [postOfferingToGLMutation, { loading: posting }] = useMutation(POST_OFFERING_TO_GL, {
    refetchQueries: [
      { query: GET_OFFERING_BATCHES, variables: { organisationId, branchId, status, startDate, endDate, skip, take } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: 'Success',
        description: 'Offering posted to General Ledger successfully',
      });
    },
    onError: (error) => {
      if (isConflictError(error)) {
        showConflict(error.message, 'Offering Batch');
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to post offering to GL',
          variant: 'destructive',
        });
      }
    },
  });

  // offeringBatches returns JSON, so we need to parse it
  const batchesResponse = data?.offeringBatches || {};
  const batches = batchesResponse?.items || [];
  const totalCount = batchesResponse?.totalCount || 0;

  return {
    batches,
    totalCount,
    loading,
    error,
    refetch,
    createOfferingBatch: (input: any) => createOfferingBatchMutation({ variables: { input } }),
    verifyOfferingBatch: (input: any) => verifyOfferingBatchMutation({ variables: { input } }),
    approveOfferingBatch: (id: string, version?: number) => 
      approveOfferingBatchMutation({ variables: { id, version } }),
    postOfferingToGL: (input: any, version?: number) => 
      postOfferingToGLMutation({ variables: { input, version } }),
    creating,
    verifying,
    approving,
    posting,
  };
};

export const useOfferingBatch = (id: string) => {
  const { data, loading, error, refetch } = useQuery(GET_OFFERING_BATCH_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    batch: data?.offeringBatch || null,
    loading,
    error,
    refetch,
  };
};
