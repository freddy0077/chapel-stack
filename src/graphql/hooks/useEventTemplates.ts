import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { EventType } from '../types/event';
import { 
  GET_EVENT_TEMPLATES, 
  GET_EVENT_TEMPLATE,
  CREATE_EVENT_TEMPLATE,
  UPDATE_EVENT_TEMPLATE,
  DELETE_EVENT_TEMPLATE,
  CREATE_EVENT_FROM_TEMPLATE
} from '../queries/eventTemplateQueries';

// Type definitions for templates
export interface VolunteerRoleRequirement {
  role: string;
  count: number;
  description?: string;
}

export interface EventTemplate {
  id: string;
  title: string;
  description?: string;
  eventType: EventType;
  duration: number; // in minutes
  isRecurring: boolean;
  recurrenceType?: string;
  recurrenceRule?: string;
  resources?: string[];
  volunteerRoles?: VolunteerRoleRequirement[];
  applicableBranches: string[];
  requiredSetup?: string;
  customFields?: Record<string, unknown>;
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    username: string;
  };
}

// GraphQL response types


interface EventTemplatesData {
  eventTemplates: EventTemplate[];
}

interface EventTemplateData {
  eventTemplate: EventTemplate;
}

interface CreateEventTemplateData {
  createEventTemplate: EventTemplate;
}

interface UpdateEventTemplateData {
  updateEventTemplate: EventTemplate;
}

interface DeleteEventTemplateData {
  deleteEventTemplate: boolean;
}

interface CreateEventFromTemplateData {
  createEventFromTemplate: {
    id: string;
    title: string;
    description?: string;
    eventType?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    branch?: {
      id: string;
      name: string;
    };
    visibility?: string;
    status?: string;
  };
}

export interface CreateEventTemplateInput {
  title: string;
  description?: string;
  eventType: EventType;
  duration: number;
  isRecurring: boolean;
  recurrenceType?: string;
  recurrenceRule?: string;
  resources?: string[];
  volunteerRoles?: VolunteerRoleRequirement[];
  applicableBranches: string[];
  requiredSetup?: string;
  customFields?: any;
  isActive?: boolean;
}

export interface UpdateEventTemplateInput {
  title?: string;
  description?: string;
  eventType?: EventType;
  duration?: number;
  isRecurring?: boolean;
  recurrenceType?: string;
  recurrenceRule?: string;
  resources?: string[];
  volunteerRoles?: VolunteerRoleRequirement[];
  applicableBranches?: string[];
  requiredSetup?: string;
  customFields?: any;
  isActive?: boolean;
}

export interface CreateEventFromTemplateInput {
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isOnline?: boolean;
  onlineUrl?: string;
  branchId: string;
  visibility?: string;
  capacity?: number;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  waitlistEnabled?: boolean;
  fee?: number;
  currency?: string;
  featuredImage?: string;
  calendarId: string;
  ministryId?: string;
  customFields?: any;
}

export interface TemplateFilters {
  search?: string;
  eventType?: EventType;
  branch?: string;
  includeInactive?: boolean;
}

/**
 * Hook to fetch event templates with optional filtering
 */
export const useEventTemplates = () => {
  const { data, loading, error, refetch } = useQuery<EventTemplatesData>(GET_EVENT_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    templates: data?.eventTemplates || [],
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch a single event template by ID
 */
export const useEventTemplate = (id?: string) => {
  const [getTemplate, { data, loading, error }] = useLazyQuery<EventTemplateData, { id: string }>(GET_EVENT_TEMPLATE, {
    variables: { id: id || '' },
    fetchPolicy: 'cache-and-network'
  });

  const { data: queryData, loading: queryLoading, error: queryError } = useQuery<EventTemplateData, { id: string }>(GET_EVENT_TEMPLATE, {
    variables: { id: id || '' },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    template: data?.eventTemplate || queryData?.eventTemplate,
    loading: loading || queryLoading,
    error: error || queryError,
    getTemplate,
  };
};

/**
 * Hook for event template mutations
 */
export const useEventTemplateMutations = () => {
  // Create template mutation
  const [createTemplateMutation, { loading: createLoading, error: createError }] = 
    useMutation<CreateEventTemplateData, { input: CreateEventTemplateInput }>(CREATE_EVENT_TEMPLATE);

  // Update template mutation
  const [updateTemplateMutation, { loading: updateLoading, error: updateError }] = 
    useMutation<UpdateEventTemplateData, { id: string, input: UpdateEventTemplateInput }>(UPDATE_EVENT_TEMPLATE);

  // Delete template mutation
  const [deleteTemplateMutation, { loading: deleteLoading, error: deleteError }] = 
    useMutation<DeleteEventTemplateData, { id: string }>(DELETE_EVENT_TEMPLATE);

  // Create event from template mutation
  const [createEventFromTemplateMutation, { loading: createEventLoading, error: createEventError }] = 
    useMutation<CreateEventFromTemplateData, { templateId: string, input: CreateEventFromTemplateInput }>(CREATE_EVENT_FROM_TEMPLATE);

  const createTemplate = async (input: CreateEventTemplateInput) => {
    try {
      const { data } = await createTemplateMutation({
        variables: { input },
        refetchQueries: [{ query: GET_EVENT_TEMPLATES }],
      });
      return data?.createEventTemplate;
    } catch (error) {
      console.error('Error creating event template:', error);
      throw error;
    }
  };

  const updateTemplate = async (id: string, input: UpdateEventTemplateInput) => {
    try {
      const { data } = await updateTemplateMutation({
        variables: { id, input },
        refetchQueries: [
          { query: GET_EVENT_TEMPLATES },
          { query: GET_EVENT_TEMPLATE, variables: { id } },
        ],
      });
      return data?.updateEventTemplate;
    } catch (error) {
      console.error('Error updating event template:', error);
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { data } = await deleteTemplateMutation({
        variables: { id },
        refetchQueries: [{ query: GET_EVENT_TEMPLATES }],
      });
      return data?.deleteEventTemplate;
    } catch (error) {
      console.error('Error deleting event template:', error);
      throw error;
    }
  };

  const createEventFromTemplate = async (templateId: string, input: CreateEventFromTemplateInput) => {
    try {
      const { data } = await createEventFromTemplateMutation({
        variables: { templateId, input },
      });
      return data?.createEventFromTemplate;
    } catch (error) {
      console.error('Error creating event from template:', error);
      throw error;
    }
  };

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createEventFromTemplate,
    loading: {
      create: createLoading,
      update: updateLoading,
      delete: deleteLoading,
      createEvent: createEventLoading,
    },
    error: {
      create: createError,
      update: updateError,
      delete: deleteError,
      createEvent: createEventError,
    },
  };
};
