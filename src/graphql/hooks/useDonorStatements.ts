import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import {
  GET_DONOR_STATEMENTS_DATA,
  GENERATE_DONOR_STATEMENT,
  BULK_GENERATE_DONOR_STATEMENTS,
  EMAIL_DONOR_STATEMENT,
} from '../queries/donorStatementsQueries';

export interface DonorTransaction {
  id: string;
  date: string;
  amount: number;
  fund: {
    id: string;
    name: string;
  };
  type: string;
  description?: string;
  reference?: string;
}

export interface DonorData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalGiving: number;
  transactionCount: number;
  firstGift: string;
  lastGift: string;
  averageGift: number;
  transactions: DonorTransaction[];
}

export interface DonorStatementsData {
  donors: DonorData[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface DateRangeInput {
  startDate?: Date;
  endDate?: Date;
}

export interface UseDonorStatementsProps {
  organisationId: string;
  branchId: string;
  dateRange?: DateRangeInput;
  search?: string;
  skip?: number;
  take?: number;
}

export const useDonorStatements = ({
  organisationId,
  branchId,
  dateRange,
  search,
  skip = 0,
  take = 50,
}: UseDonorStatementsProps) => {
  const { data, loading, error, refetch } = useQuery<{
    donorStatements: DonorStatementsData;
  }>(GET_DONOR_STATEMENTS_DATA, {
    variables: {
      organisationId,
      branchId,
      dateRange,
      search,
      skip,
      take,
    },
    skip: !organisationId || !branchId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  return {
    donors: data?.donorStatements?.donors || [],
    totalCount: data?.donorStatements?.totalCount || 0,
    hasNextPage: data?.donorStatements?.hasNextPage || false,
    loading,
    error,
    refetch,
  };
};

export const useDonorStatementMutations = () => {
  const [generateStatement] = useMutation(GENERATE_DONOR_STATEMENT);
  const [bulkGenerateStatements] = useMutation(BULK_GENERATE_DONOR_STATEMENTS);
  const [emailStatement] = useMutation(EMAIL_DONOR_STATEMENT);

  const handleGenerateStatement = async (
    donorId: string,
    format: 'pdf' | 'email',
    organisationId: string,
    branchId: string,
    dateRange?: DateRangeInput
  ) => {
    try {
      if (format === 'email') {
        const result = await emailStatement({
          variables: {
            input: {
              donorId,
              organisationId,
              branchId,
              dateRange,
            },
          },
        });
        return result.data?.emailDonorStatement;
      } else {
        const result = await generateStatement({
          variables: {
            input: {
              donorId,
              organisationId,
              branchId,
              dateRange,
              format: 'PDF',
            },
          },
        });
        return result.data?.generateDonorStatement;
      }
    } catch (error) {
      console.error('Error generating donor statement:', error);
      throw error;
    }
  };

  const handleBulkGenerate = async (
    donorIds: string[],
    format: 'pdf' | 'email',
    organisationId: string,
    branchId: string,
    dateRange?: DateRangeInput
  ) => {
    try {
      const result = await bulkGenerateStatements({
        variables: {
          input: {
            donorIds,
            organisationId,
            branchId,
            dateRange,
            format: format.toUpperCase(),
            deliveryMethod: format === 'email' ? 'EMAIL' : 'DOWNLOAD',
          },
        },
      });
      return result.data?.bulkGenerateDonorStatements;
    } catch (error) {
      console.error('Error bulk generating donor statements:', error);
      throw error;
    }
  };

  return {
    generateStatement: handleGenerateStatement,
    bulkGenerate: handleBulkGenerate,
  };
};
