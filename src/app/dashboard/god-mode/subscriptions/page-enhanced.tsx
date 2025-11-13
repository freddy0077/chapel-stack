'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { RouteGuard } from '@/components/RouteGuard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  BarChart3,
  Activity,
  Clock,
  Users,
  Percent,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Settings,
} from 'lucide-react';

// ============ GRAPHQL QUERIES ============

const GET_SUBSCRIPTIONS_QUERY = gql`
  query GetSubscriptions($filter: SubscriptionFilterInput) {
    godModeSubscriptions(filter: $filter) {
      id
      customerId
      planId
      status
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
      organisationId
      createdAt
      updatedAt
      plan {
        id
        name
        amount
        currency
        interval
      }
    }
  }
`;

const GET_SUBSCRIPTION_PLANS_QUERY = gql`
  query GetSubscriptionPlans($filter: PlanFilterInput) {
    godModeSubscriptionPlans(filter: $filter) {
      id
      name
      description
      amount
      currency
      interval
      intervalCount
      trialPeriodDays
      features
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_DASHBOARD_STATS_QUERY = gql`
  query GetDashboardStats {
    godModeSubscriptionDashboardStats {
      totalSubscriptions
      activeSubscriptions
      expiredSubscriptions
      totalRevenue
      monthlyRecurringRevenue
      churnRate
      averageLifetime
    }
  }
`;

const GET_RECENT_ACTIVITY_QUERY = gql`
  query GetRecentActivity($limit: Int) {
    godModeSubscriptionRecentActivity(limit: $limit) {
      id
      type
      description
      subscriptionId
      userId
      timestamp
    }
  }
`;

const GET_TAB_COUNTS_QUERY = gql`
  query GetTabCounts {
    godModeSubscriptionTabCounts {
      active
      expired
      cancelled
      pending
      total
    }
  }
`;

const GET_LIFECYCLE_STATS_QUERY = gql`
  query GetLifecycleStats {
    godModeSubscriptionLifecycleStats {
      totalSubscriptions
      activeCount
      expiredCount
      cancelledCount
      pendingCount
      averageLifetime
      churnRate
    }
  }
`;

const GET_PAYMENTS_QUERY = gql`
  query GetPayments($filter: PaymentFilterInput) {
    godModeSubscriptionPayments(filter: $filter) {
      id
      subscriptionId
      amount
      status
      paymentDate
      paymentReference
    }
  }
`;

const GET_ORG_STATUS_QUERY = gql`
  query GetOrgStatus($organizationId: String!) {
    godModeOrganizationSubscriptionStatus(organizationId: $organizationId) {
      hasActiveSubscription
      daysUntilExpiry
      isInGracePeriod
      subscription {
        id
        status
        currentPeriodEnd
      }
    }
  }
`;

// ============ MUTATIONS ============

const CREATE_SUBSCRIPTION_MUTATION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    godModeCreateSubscription(input: $input) {
      id
      status
      createdAt
    }
  }
`;

const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation UpdateSubscription($id: String!, $input: UpdateSubscriptionInput!) {
    godModeUpdateSubscription(id: $id, input: $input) {
      id
      status
      updatedAt
    }
  }
`;

const CANCEL_SUBSCRIPTION_MUTATION = gql`
  mutation CancelSubscription($id: String!, $reason: String) {
    godModeCancelSubscription(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

const CREATE_PLAN_MUTATION = gql`
  mutation CreatePlan($input: CreatePlanInput!) {
    godModeCreateSubscriptionPlan(input: $input) {
      id
      name
      amount
      createdAt
    }
  }
`;

const UPDATE_PLAN_MUTATION = gql`
  mutation UpdatePlan($id: String!, $input: UpdatePlanInput!) {
    godModeUpdateSubscriptionPlan(id: $id, input: $input) {
      id
      name
      updatedAt
    }
  }
`;

const DELETE_PLAN_MUTATION = gql`
  mutation DeletePlan($id: String!) {
    godModeDeleteSubscriptionPlan(id: $id) {
      id
    }
  }
`;

const TRIGGER_LIFECYCLE_CHECK_MUTATION = gql`
  mutation TriggerLifecycleCheck {
    godModeTriggerSubscriptionLifecycleCheck {
      processed
      updated
      expired
    }
  }
`;

// ============ COMPONENT ============

export default function GodModeSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'plans' | 'analytics' | 'payments'>('overview');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // Queries
  const { data: subscriptionsData, loading: subsLoading, refetch: refetchSubs } = useQuery(GET_SUBSCRIPTIONS_QUERY);
  const { data: plansData, loading: plansLoading, refetch: refetchPlans } = useQuery(GET_SUBSCRIPTION_PLANS_QUERY);
  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS_QUERY);
  const { data: activityData } = useQuery(GET_RECENT_ACTIVITY_QUERY, { variables: { limit: 10 } });
  const { data: countsData } = useQuery(GET_TAB_COUNTS_QUERY);
  const { data: lifecycleData } = useQuery(GET_LIFECYCLE_STATS_QUERY);
  const { data: paymentsData } = useQuery(GET_PAYMENTS_QUERY);

  // Mutations
  const [triggerLifecycleCheck] = useMutation(TRIGGER_LIFECYCLE_CHECK_MUTATION, {
    onCompleted: (data) => {
      toast.success(`Processed ${data.godModeTriggerSubscriptionLifecycleCheck.processed} subscriptions`, {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
    },
  });

  const subscriptions = subscriptionsData?.godModeSubscriptions || [];
  const plans = plansData?.godModeSubscriptionPlans || [];
  const stats = statsData?.godModeSubscriptionDashboardStats;
  const activity = activityData?.godModeSubscriptionRecentActivity || [];
  const counts = countsData?.godModeSubscriptionTabCounts;
  const lifecycle = lifecycleData?.godModeSubscriptionLifecycleStats;
  const payments = paymentsData?.godModeSubscriptionPayments || [];

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Subscriptions Management</h1>
                <p className="text-purple-200 mt-1">System-wide subscription and billing management</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => triggerLifecycleCheck()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <RefreshCw className="h-5 w-5" />
              Trigger Lifecycle Check
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8 border-b border-purple-500/30"
        >
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
            { id: 'plans', label: 'Plans', icon: Settings },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'payments', label: 'Payments', icon: DollarSign },
          ].map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                activeTab === id
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Subscriptions', value: stats?.totalSubscriptions, icon: Users, color: 'from-blue-500 to-cyan-500' },
                  { label: 'Active', value: stats?.activeSubscriptions, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
                  { label: 'Expired', value: stats?.expiredSubscriptions, icon: XCircle, color: 'from-red-500 to-pink-500' },
                  { label: 'MRR', value: `$${stats?.monthlyRecurringRevenue?.toLocaleString()}`, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-xl`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <stat.icon className="h-12 w-12 text-white/30" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-purple-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {activity.slice(0, 5).map((item: any, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium">{item.description}</p>
                          <p className="text-white/60 text-sm">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-white/40" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'subscriptions' && (
            <motion.div
              key="subscriptions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Active Subscriptions</h2>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Plus className="h-5 w-5" />
                  New Subscription
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {subscriptions.map((sub: any, i) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white">{sub.plan?.name}</h3>
                        <p className="text-white/60 text-sm mt-1">ID: {sub.id.slice(0, 8)}...</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            sub.status === 'ACTIVE' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="text-white/80 text-sm">
                            ${sub.plan?.amount} / {sub.plan?.interval}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'plans' && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Subscription Plans</h2>
                <Button
                  onClick={() => setShowPlanForm(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Plus className="h-5 w-5" />
                  New Plan
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan: any, i) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/50 hover:border-purple-400 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                        <p className="text-white/60 text-sm mt-1">{plan.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.isActive ? 'bg-green-500/30 text-green-200' : 'bg-gray-500/30 text-gray-200'
                      }`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-purple-400" />
                        <span className="text-2xl font-bold text-white">${plan.amount}</span>
                        <span className="text-white/60">/{plan.interval}</span>
                      </div>
                      {plan.trialPeriodDays > 0 && (
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-400" />
                          <span className="text-white/80">{plan.trialPeriodDays} days trial</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 text-white border-white/30 hover:bg-white/10">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-red-400 border-red-400/30 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lifecycle Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Lifecycle Statistics</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Active', value: lifecycle?.activeCount, color: 'text-green-400' },
                      { label: 'Expired', value: lifecycle?.expiredCount, color: 'text-red-400' },
                      { label: 'Cancelled', value: lifecycle?.cancelledCount, color: 'text-yellow-400' },
                      { label: 'Pending', value: lifecycle?.pendingCount, color: 'text-blue-400' },
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center justify-between p-2">
                        <span className="text-white/80">{stat.label}</span>
                        <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Revenue Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-lg font-bold text-white mb-4">Revenue Metrics</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <p className="text-white/60 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-white">${stats?.totalRevenue?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <p className="text-white/60 text-sm">Monthly Recurring Revenue</p>
                      <p className="text-2xl font-bold text-white">${stats?.monthlyRecurringRevenue?.toLocaleString()}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white">Payment History</h2>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/20">
                      <tr>
                        <th className="px-6 py-3 text-left text-white font-semibold">Payment ID</th>
                        <th className="px-6 py-3 text-left text-white font-semibold">Amount</th>
                        <th className="px-6 py-3 text-left text-white font-semibold">Status</th>
                        <th className="px-6 py-3 text-left text-white font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment: any, i) => (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="border-b border-white/10 hover:bg-white/5 transition-all"
                        >
                          <td className="px-6 py-3 text-white">{payment.id.slice(0, 8)}...</td>
                          <td className="px-6 py-3 text-white font-semibold">${payment.amount}</td>
                          <td className="px-6 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'SUCCESS' ? 'bg-green-500/30 text-green-200' : 'bg-red-500/30 text-red-200'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-white/60">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RouteGuard>
  );
}
