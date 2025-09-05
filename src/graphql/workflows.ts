import { gql } from "@apollo/client";

// Workflow Template Queries
export const GET_WORKFLOW_TEMPLATES = gql`
  query GetWorkflowTemplates($organisationId: String!, $branchId: String) {
    workflowTemplates(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      type
      status
      triggerType
      triggerConfig
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      actions {
        id
        actionType
        actionConfig
        stepNumber
        delayMinutes
        conditions
      }
    }
  }
`;

export const GET_WORKFLOW_TEMPLATE = gql`
  query GetWorkflowTemplate(
    $id: String!
    $organisationId: String!
    $branchId: String
  ) {
    workflowTemplate(
      id: $id
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      name
      description
      type
      status
      triggerType
      triggerConfig
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      actions {
        id
        actionType
        actionConfig
        stepNumber
        delayMinutes
        conditions
      }
    }
  }
`;

export const GET_WORKFLOW_EXECUTIONS = gql`
  query GetWorkflowExecutions(
    $organisationId: String!
    $branchId: String
    $workflowId: String
    $limit: Float
  ) {
    workflowExecutions(
      organisationId: $organisationId
      branchId: $branchId
      workflowId: $workflowId
      limit: $limit
    ) {
      id
      workflowId
      status
      triggeredBy
      triggerData
      targetMemberId
      targetEventId
      targetData
      startedAt
      completedAt
      errorMessage
      organisationId
      branchId
      createdAt
      updatedAt
      workflow {
        id
        name
        description
      }
    }
  }
`;

export const GET_WORKFLOW_STATS = gql`
  query GetWorkflowStats($organisationId: String!, $branchId: String) {
    workflowStats(organisationId: $organisationId, branchId: $branchId) {
      totalWorkflows
      activeWorkflows
      totalExecutions
      successfulExecutions
      failedExecutions
      averageExecutionTime
      executionsToday
      executionsThisWeek
      executionsThisMonth
    }
  }
`;

// Workflow Template Mutations
export const CREATE_WORKFLOW_TEMPLATE = gql`
  mutation CreateWorkflowTemplate(
    $input: CreateWorkflowTemplateInput!
    $organisationId: String!
    $branchId: String
  ) {
    createWorkflowTemplate(
      input: $input
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      name
      description
      type
      status
      triggerType
      triggerConfig
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      actions {
        id
        actionType
        actionConfig
        stepNumber
        delayMinutes
        conditions
      }
    }
  }
`;

export const UPDATE_WORKFLOW_TEMPLATE = gql`
  mutation UpdateWorkflowTemplate(
    $id: String!
    $input: UpdateWorkflowTemplateInput!
    $organisationId: String!
    $branchId: String
  ) {
    updateWorkflowTemplate(
      id: $id
      input: $input
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      name
      description
      type
      status
      triggerType
      triggerConfig
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      actions {
        id
        actionType
        actionConfig
        stepNumber
        delayMinutes
        conditions
      }
    }
  }
`;

export const DELETE_WORKFLOW_TEMPLATE = gql`
  mutation DeleteWorkflowTemplate(
    $id: String!
    $organisationId: String!
    $branchId: String
  ) {
    deleteWorkflowTemplate(
      id: $id
      organisationId: $organisationId
      branchId: $branchId
    )
  }
`;

export const TRIGGER_WORKFLOW = gql`
  mutation TriggerWorkflow($input: TriggerWorkflowInput!) {
    triggerWorkflow(input: $input) {
      id
      workflowId
      status
      triggeredBy
      triggerData
      targetMemberId
      targetEventId
      targetData
      startedAt
      completedAt
      errorMessage
      organisationId
      branchId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PREDEFINED_WORKFLOWS = gql`
  mutation CreatePredefinedWorkflows(
    $organisationId: String
    $branchId: String
  ) {
    createPredefinedWorkflows(
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      name
      description
      type
      status
      triggerType
    }
  }
`;

// Type definitions for TypeScript
export interface WorkflowAction {
  id?: string;
  actionType: "EMAIL" | "SMS" | "NOTIFICATION" | "TASK" | "WEBHOOK";
  actionConfig: Record<string, any>;
  stepNumber: number;
  delayMinutes?: number;
  conditions?: Record<string, any>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  type: "AUTOMATED" | "MANUAL" | "SCHEDULED";
  status: "ACTIVE" | "INACTIVE" | "DRAFT";
  triggerType:
    | "MEMBER_CREATED"
    | "MEMBER_UPDATED"
    | "EVENT_CREATED"
    | "DONATION_RECEIVED"
    | "ATTENDANCE_RECORDED"
    | "MEMBERSHIP_EXPIRING"
    | "SCHEDULED";
  triggerConfig?: Record<string, any>;
  organisationId: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  actions: WorkflowAction[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  triggeredBy: string;
  triggerData?: Record<string, any>;
  targetMemberId?: string;
  targetEventId?: string;
  targetData?: Record<string, any>;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
  organisationId: string;
  branchId?: string;
  createdAt: string;
  updatedAt: string;
  workflow?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface CreateWorkflowTemplateInput {
  name: string;
  description?: string;
  type: "AUTOMATED" | "MANUAL" | "SCHEDULED";
  triggerType:
    | "MEMBER_CREATED"
    | "MEMBER_UPDATED"
    | "EVENT_CREATED"
    | "DONATION_RECEIVED"
    | "ATTENDANCE_RECORDED"
    | "MEMBERSHIP_EXPIRING"
    | "SCHEDULED";
  triggerConfig?: Record<string, any>;
  actions: Omit<WorkflowAction, "id">[];
  organisationId: string;
  branchId?: string;
}

export interface UpdateWorkflowTemplateInput {
  id: string;
  name?: string;
  description?: string;
  type?: "AUTOMATED" | "MANUAL" | "SCHEDULED";
  status?: "ACTIVE" | "INACTIVE" | "DRAFT";
  triggerType?:
    | "MEMBER_CREATED"
    | "MEMBER_UPDATED"
    | "EVENT_CREATED"
    | "DONATION_RECEIVED"
    | "ATTENDANCE_RECORDED"
    | "MEMBERSHIP_EXPIRING"
    | "SCHEDULED";
  triggerConfig?: Record<string, any>;
  actions?: Omit<WorkflowAction, "id">[];
}

export interface TriggerWorkflowInput {
  workflowId: string;
  triggeredBy: string;
  targetMemberId?: string;
  targetEventId?: string;
  triggerData?: Record<string, any>;
}
