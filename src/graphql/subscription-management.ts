import { gql } from "@apollo/client";

// Organization Management Queries
export const GET_SUBSCRIPTION_ORGANIZATIONS = gql`
  query GetSubscriptionOrganizations($filter: OrganizationFilterInput) {
    subscriptionOrganizations(filter: $filter) {
      id
      name
      email
      status
      suspensionReason
      suspendedAt
      suspendedBy
      createdAt
      updatedAt
      subscription {
        id
        status
        planName
        currentPeriodStart
        currentPeriodEnd
        amount
      }
      _count {
        branches
        users
        members
      }
    }
  }
`;

export const GET_ORGANIZATION_SUBSCRIPTION_DETAILS = gql`
  query GetOrganizationSubscriptionDetails($id: String!) {
    organizationSubscriptionDetails(id: $id) {
      id
      name
      email
      status
      suspensionReason
      suspendedAt
      suspendedBy
      createdAt
      updatedAt
      subscription {
        id
        status
        planName
        currentPeriodStart
        currentPeriodEnd
        amount
      }
      _count {
        branches
        users
        members
      }
    }
  }
`;

export const GET_ORGANIZATION_STATS = gql`
  query GetOrganizationStats {
    organizationStats {
      total
      active
      suspended
      trial
      cancelled
      inactive
    }
  }
`;

// Organization Management Mutations
export const ENABLE_ORGANIZATION = gql`
  mutation EnableOrganization($id: String!) {
    enableOrganization(id: $id) {
      id
      name
      status
      suspensionReason
      suspendedAt
      updatedAt
    }
  }
`;

export const DISABLE_ORGANIZATION = gql`
  mutation DisableOrganization($input: DisableOrganizationInput!) {
    disableOrganization(input: $input) {
      id
      name
      status
      suspensionReason
      suspendedAt
      suspendedBy
      updatedAt
    }
  }
`;

// Subscription Analytics Queries
export const GET_SUBSCRIPTION_ANALYTICS = gql`
  query GetSubscriptionAnalytics($period: String!) {
    subscriptionAnalytics(period: $period) {
      totalRevenue
      monthlyRecurringRevenue
      churnRate
      newSubscriptions
      cancelledSubscriptions
      revenueGrowth
      customerLifetimeValue
      averageRevenuePerUser
    }
  }
`;

export const GET_SUBSCRIPTION_PAYMENTS = gql`
  query GetSubscriptionPayments($filter: PaymentFilterInput) {
    subscriptionPayments(filter: $filter) {
      id
      amount
      currency
      status
      paystackReference
      authorizationCode
      paidAt
      failedAt
      failureReason
      createdAt
      subscription {
        id
        organisation {
          id
          name
          state
        }
        plan {
          name
        }
      }
    }
  }
`;

export const GET_FAILED_PAYMENTS = gql`
  query GetFailedPayments($filter: PaymentFilterInput) {
    failedPayments(filter: $filter) {
      id
      amount
      currency
      status
      paymentMethod
      paystackReference
      createdAt
      failureReason
      subscription {
        id
        organisation {
          id
          name
          state
        }
        plan {
          name
        }
      }
    }
  }
`;

// Subscription Analytics and Dashboard Queries
export const GET_RECENT_SUBSCRIPTIONS = gql`
  query GetRecentSubscriptions($filter: SubscriptionFilterInput) {
    getSubscriptions(filter: $filter) {
      id
      status
      createdAt
      currentPeriodStart
      currentPeriodEnd
      customer {
        id
        name
        email
        state
      }
      plan {
        id
        name
        amount
        currency
        interval
      }
      organisation {
        id
        name
        state
      }
    }
  }
`;

// Payment Management Mutations
export const RETRY_FAILED_PAYMENT = gql`
  mutation RetryFailedPayment($paymentId: String!) {
    retryFailedPayment(paymentId: $paymentId) {
      id
      status
      paystackReference
    }
  }
`;

export const REFUND_PAYMENT = gql`
  mutation RefundPayment($paymentId: String!, $reason: String) {
    refundPayment(paymentId: $paymentId, reason: $reason) {
      id
      status
      refundAmount
      refundReference
    }
  }
`;

// Subscription Management Mutations
export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      id
      customerId
      planId
      status
      paystackSubscriptionCode
      paystackCustomerCode
      currentPeriodStart
      currentPeriodEnd
      trialStart
      trialEnd
      nextBillingDate
      lastPaymentDate
      failedPaymentCount
      metadata
      createdAt
      updatedAt
      customer {
        id
        name
        email
        state
      }
      plan {
        id
        name
        description
        amount
        currency
        interval
        intervalCount
        features
      }
    }
  }
`;

// Subscription Plans Queries
export const GET_SUBSCRIPTION_PLANS = gql`
  query GetSubscriptionPlans($filter: PlanFilterInput) {
    subscriptionPlans(filter: $filter) {
      id
      name
      description
      amount
      currency
      interval
      intervalCount
      isActive
      paystackPlanCode
      features
      trialPeriodDays
      createdAt
      updatedAt
      activeSubscriptionsCount
    }
  }
`;

export const GET_SUBSCRIPTION_PLAN = gql`
  query GetSubscriptionPlan($id: ID!) {
    subscriptionPlan(id: $id) {
      id
      name
      description
      amount
      currency
      interval
      intervalCount
      isActive
      paystackPlanCode
      features
      trialPeriodDays
      createdAt
      updatedAt
      activeSubscriptionsCount
    }
  }
`;

// Members Query for Subscription Creation
export const GET_MEMBERS_FOR_SUBSCRIPTION = gql`
  query GetMembersForSubscription($filter: MemberFilterInput) {
    members(filter: $filter) {
      id
      firstName
      lastName
      email
      phoneNumber
      status
      createdAt
    }
  }
`;

// Subscriptions Query
export const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions($filter: SubscriptionFilterInput) {
    getSubscriptions(filter: $filter) {
      id
      customerId
      planId
      status
      paystackSubscriptionCode
      paystackCustomerCode
      currentPeriodStart
      currentPeriodEnd
      trialStart
      trialEnd
      nextBillingDate
      lastPaymentDate
      failedPaymentCount
      metadata
      createdAt
      updatedAt
      customer {
        id
        name
        email
        state
      }
      organisation {
        id
        name
        email
        state
      }
      plan {
        id
        name
        description
        amount
        currency
        interval
        intervalCount
        features
      }
    }
  }
`;

// Subscription Plan Management
export const CREATE_SUBSCRIPTION_PLAN = gql`
  mutation CreateSubscriptionPlan($input: CreatePlanInput!) {
    createSubscriptionPlan(input: $input) {
      id
      name
      description
      amount
      currency
      interval
      intervalCount
      isActive
      paystackPlanCode
      features
      trialPeriodDays
      createdAt
      updatedAt
      activeSubscriptionsCount
    }
  }
`;

export const UPDATE_SUBSCRIPTION_PLAN = gql`
  mutation UpdateSubscriptionPlan($id: ID!, $input: UpdatePlanInput!) {
    updateSubscriptionPlan(id: $id, input: $input) {
      id
      name
      description
      amount
      currency
      interval
      intervalCount
      isActive
      paystackPlanCode
      features
      trialPeriodDays
      createdAt
      updatedAt
      activeSubscriptionsCount
    }
  }
`;

export const DELETE_SUBSCRIPTION_PLAN = gql`
  mutation DeleteSubscriptionPlan($id: ID!) {
    deleteSubscriptionPlan(id: $id) {
      id
      name
    }
  }
`;

// Organization-Centric Subscription Management
export const CREATE_ORGANIZATION_SUBSCRIPTION = gql`
  mutation CreateOrganizationSubscription(
    $organizationId: ID!
    $planId: ID!
    $input: CreateOrganizationSubscriptionInput!
  ) {
    createOrganizationSubscription(
      organizationId: $organizationId
      planId: $planId
      input: $input
    ) {
      id
      status
      currentPeriodStart
      currentPeriodEnd
      trialStart
      trialEnd
      nextBillingDate
      plan {
        id
        name
        amount
        currency
        interval
      }
      organisation {
        id
        name
        state
      }
      createdAt
    }
  }
`;

export const GET_ORGANIZATION_SUBSCRIPTION_STATUS = gql`
  query GetOrganizationSubscriptionStatus($organizationId: String!) {
    organizationSubscriptionStatus(organizationId: $organizationId) {
      hasActiveSubscription
      daysUntilExpiry
      isInGracePeriod
      subscription {
        id
        status
        currentPeriodStart
        currentPeriodEnd
        trialStart
        trialEnd
        nextBillingDate
        plan {
          id
          name
          amount
          currency
          interval
          features
        }
        organisation {
          id
          name
          state
        }
        payments {
          id
          amount
          status
          paidAt
          createdAt
        }
      }
    }
  }
`;

export const GET_SUBSCRIPTION_LIFECYCLE_STATS = gql`
  query GetSubscriptionLifecycleStats {
    subscriptionLifecycleStats {
      totalSubscriptions
      activeSubscriptions
      trialSubscriptions
      pastDueSubscriptions
      cancelledSubscriptions
      expiringIn7Days
      expiringIn30Days
    }
  }
`;

export const TRIGGER_SUBSCRIPTION_LIFECYCLE_CHECK = gql`
  mutation TriggerSubscriptionLifecycleCheck {
    triggerSubscriptionLifecycleCheck {
      expiredCount
      cancelledCount
      warningsCount
    }
  }
`;

// TypeScript interfaces for the responses
export interface OrganizationWithSubscription {
  id: string;
  name: string;
  email?: string;
  status: string;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
  createdAt: string;
  updatedAt: string;
  subscription?: {
    id: string;
    status: string;
    planName: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    amount: number;
  };
  _count: {
    branches: number;
    users: number;
    members: number;
  };
}

export interface OrganizationStats {
  total: number;
  active: number;
  suspended: number;
  trial: number;
  cancelled: number;
  inactive: number;
}

export interface SubscriptionPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paystackReference: string;
  authorizationCode: string;
  paidAt: string;
  failedAt: string;
  failureReason: string;
  createdAt: string;
  subscription: {
    id: string;
    organisation: {
      id: string;
      name: string;
      state: string;
    };
    plan: {
      name: string;
    };
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  isActive: boolean;
  paystackPlanCode?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
  activeSubscriptionsCount: number;
}

export interface CreateSubscriptionInput {
  customerId: string;
  planId: string;
  authorizationCode?: string;
  startDate?: string;
  metadata?: Record<string, any>;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: string;
  paystackSubscriptionCode?: string;
  paystackCustomerCode?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart?: string;
  trialEnd?: string;
  nextBillingDate?: string;
  lastPaymentDate?: string;
  failedPaymentCount: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    state: string;
  };
  organisation?: {
    id: string;
    name: string;
    email: string;
    state: string;
  };
  plan?: SubscriptionPlan;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  status: string;
  createdAt: string;
}

export interface PlanFilterInput {
  isActive?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface SubscriptionFilterInput {
  organisationId?: string;
  branchId?: string;
  customerId?: string;
  planId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  skip?: number;
  take?: number;
}

export interface MemberFilterInput {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PaymentFilterInput {
  status?: string;
  subscriptionId?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

export interface CreateOrganizationSubscriptionInput {
  startDate?: string;
  authorizationCode?: string;
  metadata?: any;
}

export interface OrganizationSubscriptionStatus {
  hasActiveSubscription: boolean;
  daysUntilExpiry?: number;
  isInGracePeriod?: boolean;
  subscription?: Subscription;
}

export interface SubscriptionLifecycleStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  pastDueSubscriptions: number;
  cancelledSubscriptions: number;
  expiringIn7Days: number;
  expiringIn30Days: number;
}

export interface SubscriptionLifecycleResult {
  expiredCount: number;
  cancelledCount: number;
  warningsCount: number;
}

// Dashboard Statistics Types
export interface SubscriptionDashboardStats {
  totalOrganizations: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  expiringSoon: number;
  monthlyRevenue: number;
  totalRevenue: number;
  organizationGrowthRate: number;
  subscriptionGrowthRate: number;
  revenueGrowthRate: number;
  trialSubscriptions: number;
  gracePeriodSubscriptions: number;
}

export interface SubscriptionActivityItem {
  id: string;
  type: string;
  description: string;
  organizationName: string;
  timestamp: string;
  metadata?: any;
}

export interface SubscriptionTabCounts {
  activeSubscriptions: number;
  expiredSubscriptions: number;
  trialSubscriptions: number;
  gracePeriodSubscriptions: number;
  pendingRenewals: number;
  cancelledSubscriptions: number;
}

// Dashboard GraphQL Queries
export const GET_SUBSCRIPTION_DASHBOARD_STATS = gql`
  query GetSubscriptionDashboardStats {
    subscriptionDashboardStats {
      totalOrganizations
      activeSubscriptions
      expiredSubscriptions
      expiringSoon
      monthlyRevenue
      totalRevenue
      organizationGrowthRate
      subscriptionGrowthRate
      revenueGrowthRate
      trialSubscriptions
      gracePeriodSubscriptions
    }
  }
`;

export const GET_SUBSCRIPTION_RECENT_ACTIVITY = gql`
  query GetSubscriptionRecentActivity($limit: Int) {
    subscriptionRecentActivity(limit: $limit) {
      id
      type
      description
      organizationName
      timestamp
      metadata
    }
  }
`;

export const GET_SUBSCRIPTION_TAB_COUNTS = gql`
  query GetSubscriptionTabCounts {
    subscriptionTabCounts {
      activeSubscriptions
      expiredSubscriptions
      trialSubscriptions
      gracePeriodSubscriptions
      pendingRenewals
      cancelledSubscriptions
    }
  }
`;
