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
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  Zap,
  CheckCircle,
  AlertCircle,
  DollarSign,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
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
      paystackPlanCode
      metadata
      createdAt
      updatedAt
    }
  }
`;

const GET_DASHBOARD_STATS_QUERY = gql`
  query GetDashboardStats {
    godModeSubscriptionDashboardStats {
      totalOrganizations
      activeSubscriptions
      expiredSubscriptions
      totalRevenue
      monthlyRevenue
      organizationGrowthRate
      subscriptionGrowthRate
      revenueGrowthRate
      trialSubscriptions
      gracePeriodSubscriptions
      expiringSoon
    }
  }
`;

const GET_RECENT_ACTIVITY_QUERY = gql`
  query GetRecentActivity($limit: Int) {
    godModeSubscriptionRecentActivity(limit: $limit) {
      id
      type
      description
      timestamp
      severity
    }
  }
`;

const GET_TAB_COUNTS_QUERY = gql`
  query GetTabCounts {
    godModeSubscriptionTabCounts {
      activeSubscriptions
      inactiveSubscriptions
      expiredSubscriptions
      cancelledSubscriptions
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
      trialingCount
      gracePeriodCount
      churnRate
      retentionRate
    }
  }
`;

const GET_PAYMENTS_QUERY = gql`
  query GetPayments($filter: PaymentFilterInput) {
    godModeSubscriptionPayments(filter: $filter) {
      id
      subscriptionId
      amount
      currency
      status
      paymentDate
      nextRetryDate
    }
  }
`;

const GET_ORGANISATIONS_QUERY = gql`
  query GetOrganisations {
    organisations {
      id
      name
    }
  }
`;

// ============ MUTATIONS ============
const CREATE_PLAN_MUTATION = gql`
  mutation CreatePlan($input: CreatePlanInput!) {
    godModeCreateSubscriptionPlan(input: $input) {
      id
      name
      amount
      currency
      interval
      createdAt
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
      expiredCount
      cancelledCount
      warningsCount
    }
  }
`;

// ============ COMPONENT ============
export default function GodModeSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subscriptions' | 'plans' | 'analytics' | 'payments'>('overview');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planFormData, setPlanFormData] = useState({ name: '', amount: '', currency: 'GHS', interval: 'MONTHLY', intervalCount: 1, trialPeriodDays: 0 });
  const [isCreating, setIsCreating] = useState(false);

  // Queries
  const { data: subscriptionsData, loading: subsLoading, refetch: refetchSubs } = useQuery(GET_SUBSCRIPTIONS_QUERY);
  const { data: plansData, loading: plansLoading, refetch: refetchPlans } = useQuery(GET_SUBSCRIPTION_PLANS_QUERY);
  const { data: organisationsData } = useQuery(GET_ORGANISATIONS_QUERY);
  const { data: statsData, loading: statsLoading } = useQuery(GET_DASHBOARD_STATS_QUERY);
  const { data: activityData } = useQuery(GET_RECENT_ACTIVITY_QUERY, { variables: { limit: 10 } });
  const { data: countsData } = useQuery(GET_TAB_COUNTS_QUERY);
  const { data: lifecycleData } = useQuery(GET_LIFECYCLE_STATS_QUERY);
  const { data: paymentsData } = useQuery(GET_PAYMENTS_QUERY);

  const subscriptions = subscriptionsData?.godModeSubscriptions || [];
  const plans = plansData?.godModeSubscriptionPlans || [];
  const stats = statsData?.godModeSubscriptionDashboardStats;
  const activity = activityData?.godModeSubscriptionRecentActivity || [];
  const counts = countsData?.godModeSubscriptionTabCounts;
  const lifecycle = lifecycleData?.godModeSubscriptionLifecycleStats;
  const payments = paymentsData?.godModeSubscriptionPayments || [];

  // Mutations
  const [createPlan] = useMutation(CREATE_PLAN_MUTATION, {
    onCompleted: () => {
      toast.success('Plan created successfully!', { icon: '✅', style: { borderRadius: '10px', background: '#10B981', color: '#fff' } });
      refetchPlans();
      setShowPlanForm(false);
      setPlanFormData({ name: '', amount: '', currency: 'GHS', interval: 'MONTHLY', intervalCount: 1, trialPeriodDays: 0 });
      setIsCreating(false);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, { icon: '❌', style: { borderRadius: '10px', background: '#EF4444', color: '#fff' } });
      setIsCreating(false);
    },
  });

  const [triggerLifecycleCheck] = useMutation(TRIGGER_LIFECYCLE_CHECK_MUTATION, {
    onCompleted: (data) => {
      const result = data.godModeTriggerSubscriptionLifecycleCheck;
      toast.success(`Lifecycle check: ${result.expiredCount} expired, ${result.cancelledCount} cancelled`, {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
    },
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard, count: counts?.activeSubscriptions || 0 },
    { id: 'plans', name: 'Plans', icon: Zap, count: plans.length },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'payments', name: 'Payments', icon: DollarSign, count: payments.length },
  ];

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Modern Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 shadow-2xl"
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Subscriptions Management</h1>
                  <p className="text-white/90 text-lg">Manage plans, subscriptions, and revenue</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {stats?.activeSubscriptions || 0} Active
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      GHS {(stats?.monthlyRevenue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowPlanForm(true)}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Plan
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {[
              { label: 'Total Orgs', value: stats?.totalOrganizations ?? 0, icon: Users, color: 'from-purple-500 to-purple-600', trend: stats?.organizationGrowthRate },
              { label: 'Active Subs', value: stats?.activeSubscriptions ?? 0, icon: CheckCircle, color: 'from-green-500 to-green-600', trend: stats?.subscriptionGrowthRate },
              { label: 'Expired', value: stats?.expiredSubscriptions ?? 0, icon: AlertCircle, color: 'from-red-500 to-red-600' },
              { label: 'Trial', value: stats?.trialSubscriptions ?? 0, icon: Zap, color: 'from-yellow-500 to-yellow-600' },
              { label: 'Revenue', value: `GHS ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-blue-500 to-blue-600', trend: stats?.revenueGrowthRate },
              { label: 'Monthly', value: `GHS ${(stats?.monthlyRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'from-indigo-500 to-indigo-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-600">{stat.label}</div>
                      <div className="text-lg font-bold text-gray-900">
                        {statsLoading ? <div className="w-12 h-6 bg-gray-200 rounded animate-pulse" /> : stat.value}
                      </div>
                    </div>
                  </div>
                  {stat.trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      {Math.abs(stat.trend || 0).toFixed(1)}%
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">Lifecycle Stats</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: 'Total', value: lifecycle?.totalSubscriptions },
                            { label: 'Active', value: lifecycle?.activeCount, color: 'text-green-600' },
                            { label: 'Expired', value: lifecycle?.expiredCount, color: 'text-red-600' },
                            { label: 'Retention', value: `${(lifecycle?.retentionRate || 0).toFixed(1)}%`, color: 'text-blue-600' },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between">
                              <span className="text-sm text-gray-600">{item.label}</span>
                              <span className={`font-semibold ${item.color || 'text-gray-900'}`}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {activity.length > 0 ? activity.map((item: any, idx: number) => (
                            <div key={idx} className="text-sm border-l-2 border-purple-300 pl-3 py-1">
                              <p className="text-gray-700">{item.description}</p>
                              <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                          )) : <p className="text-sm text-gray-500">No recent activity</p>}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => triggerLifecycleCheck()}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Trigger Lifecycle Check
                    </motion.button>
                  </motion.div>
                )}

                {activeTab === 'subscriptions' && (
                  <motion.div key="subscriptions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {subsLoading ? <div className="text-center py-8 text-gray-500">Loading...</div> : subscriptions.length > 0 ? (
                      <div className="grid gap-4">
                        {subscriptions.map((sub: any) => (
                          <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-4 border border-gray-200 hover:shadow-lg transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{sub.plan?.name}</h4>
                                <p className="text-sm text-gray-600">Org: {sub.organisationId}</p>
                                <p className="text-sm text-gray-500">Status: <span className={`font-semibold ${sub.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>{sub.status}</span></p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">GHS {sub.plan?.amount?.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{sub.plan?.interval}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : <div className="text-center py-8 text-gray-500">No subscriptions found</div>}
                  </motion.div>
                )}

                {activeTab === 'plans' && (
                  <motion.div key="plans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {plansLoading ? <div className="text-center py-8 text-gray-500">Loading...</div> : plans.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {plans.map((plan: any) => (
                          <motion.div key={plan.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl p-6 border-2 transition-all ${plan.isActive ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300'}`}>
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">{plan.name}</h4>
                                <p className="text-sm text-gray-600">{plan.description}</p>
                              </div>
                              {plan.isActive && <CheckCircle className="h-5 w-5 text-green-600" />}
                            </div>
                            <div className="space-y-2">
                              <p className="text-2xl font-bold text-gray-900">GHS {plan.amount?.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">per {plan.interval?.toLowerCase()}</p>
                              {plan.trialPeriodDays > 0 && <p className="text-xs text-blue-600 font-semibold">{plan.trialPeriodDays} days trial</p>}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : <div className="text-center py-8 text-gray-500">No plans found</div>}
                  </motion.div>
                )}

                {activeTab === 'analytics' && (
                  <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Subscription Metrics</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Churn Rate', value: `${(lifecycle?.churnRate || 0).toFixed(2)}%`, color: 'text-red-600' },
                          { label: 'Retention', value: `${(lifecycle?.retentionRate || 0).toFixed(2)}%`, color: 'text-green-600' },
                          { label: 'Growth', value: `${(stats?.subscriptionGrowthRate || 0).toFixed(2)}%`, color: 'text-blue-600' },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between">
                            <span className="text-gray-600">{item.label}</span>
                            <span className={`font-semibold ${item.color}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Revenue Metrics</h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Total', value: `GHS ${(stats?.totalRevenue || 0).toLocaleString()}` },
                          { label: 'Monthly', value: `GHS ${(stats?.monthlyRevenue || 0).toLocaleString()}` },
                          { label: 'Growth', value: `${(stats?.revenueGrowthRate || 0).toFixed(2)}%`, color: 'text-purple-600' },
                        ].map((item) => (
                          <div key={item.label} className="flex justify-between">
                            <span className="text-gray-600">{item.label}</span>
                            <span className={`font-semibold ${item.color || 'text-gray-900'}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'payments' && (
                  <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {payments.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Subscription</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment: any) => (
                              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-gray-900">{payment.subscriptionId.slice(0, 8)}...</td>
                                <td className="py-3 px-4 font-semibold text-gray-900">GHS {payment.amount?.toLocaleString()}</td>
                                <td className="py-3 px-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${payment.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{payment.status}</span></td>
                                <td className="py-3 px-4 text-sm text-gray-600">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <div className="text-center py-8 text-gray-500">No payments found</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </RouteGuard>
  );
}
