import { useQuery } from '@apollo/client';
import { GET_EMAIL_TEMPLATES } from '../queries/messageQueries';

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export function useEmailTemplates(organisationId: string, branchId?: string) {
  const { data, loading, error, refetch } = useQuery(GET_EMAIL_TEMPLATES, {
    variables: { 
      organisationId, 
      branchId 
    },
    skip: !organisationId,
  });
  
  return {
    templates: data?.emailTemplates || [],
    loading,
    error,
    refetch,
  };
}
