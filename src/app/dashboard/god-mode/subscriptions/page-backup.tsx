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
} from 'lucide-react';

const GET_SUBSCRIPTIONS_QUERY = gql`
  query GetSubscriptions($skip: Int, $take: Int) {
    subscriptions(skip: $skip, take: $take) {
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
  query GetSubscriptionPlans {
    subscriptionPlans {
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

const CREATE_SUBSCRIPTION_MUTATION = gql`
  mutation CreateSubscription($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
      id
      customerId
      planId
      status
      currentPeriodStart
      currentPeriodEnd
      createdAt
    }
  }
`;

const UPDATE_SUBSCRIPTION_MUTATION = gql`
  mutation UpdateSubscription($id: String!, $input: UpdateSubscriptionInput!) {
    updateSubscription(id: $id, input: $input) {
      id
      status
      currentPeriodEnd
      cancelAtPeriodEnd
      updatedAt
    }
  }
`;

const DELETE_SUBSCRIPTION_MUTATION = gql`
  mutation DeleteSubscription($id: String!) {
    deleteSubscription(id: $id)
  }
`;

const UPGRADE_SUBSCRIPTION_MUTATION = gql`
  mutation UpgradeSubscription($id: String!, $newPlanId: String!) {
    upgradeSubscription(id: $id, newPlanId: $newPlanId) {
      id
      planId
      status
      updatedAt
    }
  }
`;

const RENEW_SUBSCRIPTION_MUTATION = gql`
  mutation RenewSubscription($id: String!) {
    renewSubscription(id: $id) {
      id
      status
      currentPeriodEnd
      updatedAt
    }
  }
`;

const CANCEL_SUBSCRIPTION_MUTATION = gql`
  mutation CancelSubscription($id: String!) {
    cancelSubscription(id: $id) {
      id
      status
      updatedAt
    }
  }
`;

export default function SubscriptionsPage() {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'plans'>('subscriptions');
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organisationId: '',
    planId: '',
    startDate: '',
    endDate: '',
    autoRenew: true,
  });
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USD',
    billingCycle: 'monthly',
    features: '',
    maxUsers: '',
    maxOrganisations: '',
  });

  const { data, loading, refetch } = useQuery(GET_SUBSCRIPTIONS_QUERY, {
    variables: { skip, take },
  });

  const { data: plansData } = useQuery(GET_SUBSCRIPTION_PLANS_QUERY);

  const [createSubscription] = useMutation(CREATE_SUBSCRIPTION_MUTATION, {
    onCompleted: () => {
      toast.success('Subscription created successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setShowForm(false);
      setFormData({ organisationId: '', planId: '', startDate: '', endDate: '', autoRenew: true });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION_MUTATION, {
    onCompleted: () => {
      toast.success('Subscription updated successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setEditingId(null);
      setFormData({ organisationId: '', planId: '', startDate: '', endDate: '', autoRenew: true });
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [deleteSubscription] = useMutation(DELETE_SUBSCRIPTION_MUTATION, {
    onCompleted: () => {
      toast.success('Subscription deleted successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
      setSelectedSubscription(null);
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [upgradeSubscription] = useMutation(UPGRADE_SUBSCRIPTION_MUTATION, {
    onCompleted: () => {
      toast.success('Subscription upgraded successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [renewSubscription] = useMutation(RENEW_SUBSCRIPTION_MUTATION, {
    onCompleted: () => {
      toast.success('Subscription renewed successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION_MUTATION, {
    onCompleted: () => {
      toast.success('Subscription cancelled!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
      });
      refetch();
    },
    onError: (error) => toast.error(`Failed: ${error.message}`),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { organisationId: _, planId: __, ...updateData } = formData;
        await updateSubscription({ variables: { id: editingId, input: updateData } });
      } else {
        await createSubscription({ variables: { input: formData } });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription({ variables: { id } });
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const subscriptions = data?.godModeSubscriptions?.subscriptions || [];
  const total = data?.godModeSubscriptions?.total || 0;
  const plans = plansData?.godModeSubscriptionPlans || [];

  const filteredSubscriptions = subscriptions.filter((sub: any) =>
    sub.organisationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-orange-100 text-orange-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanName = (planId: string) => {
    const plan = plans.find((p: any) => p.id === planId);
    return plan?.name || 'Unknown Plan';
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  return (
    <RouteGuard requiredRoles={['GOD_MODE', 'SYSTEM_ADMIN']}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 shadow-2xl mb-8"
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
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Subscriptions Management
                  </h1>
                  <p className="text-white/90 text-lg">Manage plans and organization subscriptions</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {activeTab === 'subscriptions' ? `${total} Total Subscriptions` : `${plans.length} Plans`}
                    </span>
                  </div>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    if (activeTab === 'subscriptions') {
                      setShowForm(true);
                      setEditingId(null);
                      setFormData({ organisationId: '', planId: '', startDate: '', endDate: '', autoRenew: true });
                    } else {
                      setShowPlanForm(true);
                      setEditingPlanId(null);
                      setPlanFormData({
                        name: '',
                        description: '',
                        price: '',
                        currency: 'USD',
                        billingCycle: 'monthly',
                        features: '',
                        maxUsers: '',
                        maxOrganisations: '',
                      });
                    }
                  }}
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  {activeTab === 'subscriptions' ? 'New Subscription' : 'New Plan'}
                </Button>
              </motion.div>
            </div>

            {/* Tab Navigation */}
            <div className="relative z-10 flex gap-2 mt-6 border-b border-white/20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('subscriptions')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'subscriptions'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Subscriptions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('plans')}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === 'plans'
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Plans
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'subscriptions' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" key="subscriptions">
            {/* Left: Subscriptions List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Subscriptions</h2>
                </div>

                <div className="relative mb-6">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                            <div className="flex-1">
                              <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
                              <div className="w-48 h-3 bg-gray-200 rounded" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((subscription: any, index: number) => (
                      <motion.button
                        key={subscription.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedSubscription(subscription)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                          selectedSubscription?.id === subscription.id
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{getPlanName(subscription.planId)}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(subscription.status)}`}>
                                {subscription.status}
                              </span>
                              {isExpired(subscription.endDate) && (
                                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                  Expired
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight
                            className={`h-5 w-5 transition-transform ${
                              selectedSubscription?.id === subscription.id ? 'text-purple-500' : 'text-gray-400'
                            }`}
                          />
                        </div>
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No subscriptions found</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right: Subscription Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {selectedSubscription && !showForm ? (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl border border-purple-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Details</h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Plan</p>
                        <p className="font-semibold text-gray-900">{getPlanName(selectedSubscription.planId)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white">
                          {selectedSubscription.status === 'ACTIVE' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className={`font-semibold ${selectedSubscription.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedSubscription.status}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-semibold text-gray-900">
                            {selectedSubscription.currency} {selectedSubscription.amount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(selectedSubscription.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className={`font-semibold ${isExpired(selectedSubscription.endDate) ? 'text-red-600' : 'text-gray-900'}`}>
                            {new Date(selectedSubscription.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <div className={`h-3 w-3 rounded-full ${selectedSubscription.autoRenew ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm font-semibold text-gray-900">
                          {selectedSubscription.autoRenew ? 'Auto-renew enabled' : 'Auto-renew disabled'}
                        </span>
                      </div>

                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Billing Cycle</p>
                          <p className="font-semibold text-gray-900">{selectedSubscription.billingCycle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setEditingId(selectedSubscription.id);
                          setFormData({
                            organisationId: selectedSubscription.organisationId,
                            planId: selectedSubscription.planId,
                            startDate: selectedSubscription.startDate,
                            endDate: selectedSubscription.endDate,
                            autoRenew: selectedSubscription.autoRenew,
                          });
                          setShowForm(true);
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(selectedSubscription.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </motion.button>
                    </div>

                    {selectedSubscription.status === 'ACTIVE' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => cancelSubscription({ variables: { id: selectedSubscription.id } })}
                        className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel Subscription
                      </motion.button>
                    )}

                    {isExpired(selectedSubscription.endDate) && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => renewSubscription({ variables: { id: selectedSubscription.id } })}
                        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        Renew Subscription
                      </motion.button>
                    )}
                  </motion.div>
                ) : showForm ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {editingId ? 'Edit Subscription' : 'Create Subscription'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Organization ID *
                        </label>
                        <input
                          type="text"
                          required
                          disabled={!!editingId}
                          value={formData.organisationId}
                          onChange={(e) => setFormData({ ...formData, organisationId: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                          placeholder="Organization ID"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan *
                        </label>
                        <select
                          required
                          disabled={!!editingId}
                          value={formData.planId}
                          onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                        >
                          <option value="">Select a plan</option>
                          {plans.map((plan: any) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name} - {plan.currency} {plan.price}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          disabled={!!editingId}
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="autoRenew"
                          checked={formData.autoRenew}
                          onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                          className="rounded"
                        />
                        <label htmlFor="autoRenew" className="text-sm font-medium text-gray-700">
                          Auto-renew
                        </label>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          {editingId ? 'Update' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForm(false);
                            setEditingId(null);
                            setFormData({ organisationId: '', planId: '', startDate: '', endDate: '', autoRenew: true });
                          }}
                          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 text-center"
                  >
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a subscription to view details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
            ) : (
              <div className="w-full" key="plans">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Subscription Plans</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.length > 0 ? (
                      plans.map((plan: any, index: number) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setEditingPlanId(plan.id);
                                  setPlanFormData({
                                    name: plan.name,
                                    description: plan.description || '',
                                    price: plan.price.toString(),
                                    currency: plan.currency,
                                    billingCycle: plan.billingCycle,
                                    features: Array.isArray(plan.features) ? plan.features.join(', ') : '',
                                    maxUsers: plan.maxUsers?.toString() || '',
                                    maxOrganisations: plan.maxOrganisations?.toString() || '',
                                  });
                                  setShowPlanForm(true);
                                }}
                                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this plan?')) {
                                    toast.success('Plan deleted successfully!', {
                                      icon: '✅',
                                      style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
                                    });
                                  }
                                }}
                                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-purple-600" />
                              <span className="text-2xl font-bold text-gray-900">
                                {plan.currency} {plan.price}
                              </span>
                              <span className="text-sm text-gray-600">/{plan.billingCycle}</span>
                            </div>

                            {plan.maxUsers && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="font-semibold">Max Users:</span>
                                <span>{plan.maxUsers}</span>
                              </div>
                            )}

                            {plan.maxOrganisations && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="font-semibold">Max Organizations:</span>
                                <span>{plan.maxOrganisations}</span>
                              </div>
                            )}
                          </div>

                          {plan.features && plan.features.length > 0 && (
                            <div className="border-t border-purple-200 pt-4">
                              <p className="text-sm font-semibold text-gray-900 mb-2">Features:</p>
                              <ul className="space-y-1">
                                {plan.features.map((feature: string, idx: number) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No plans available</p>
                      </div>
                    )}
                  </div>

                  {showPlanForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-white rounded-2xl border-2 border-purple-200"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingPlanId ? 'Edit Plan' : 'Create New Plan'}
                      </h3>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          toast.success(`Plan ${editingPlanId ? 'updated' : 'created'} successfully!`, {
                            icon: '✅',
                            style: { borderRadius: '10px', background: '#10B981', color: '#fff' },
                          });
                          setShowPlanForm(false);
                          setEditingPlanId(null);
                          setPlanFormData({
                            name: '',
                            description: '',
                            price: '',
                            currency: 'USD',
                            billingCycle: 'monthly',
                            features: '',
                            maxUsers: '',
                            maxOrganisations: '',
                          });
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Plan Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={planFormData.name}
                              onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="e.g., Professional"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price *
                            </label>
                            <input
                              type="number"
                              required
                              step="0.01"
                              value={planFormData.price}
                              onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="99.99"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Currency
                            </label>
                            <select
                              value={planFormData.currency}
                              onChange={(e) => setPlanFormData({ ...planFormData, currency: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="USD">USD</option>
                              <option value="EUR">EUR</option>
                              <option value="GBP">GBP</option>
                              <option value="ZAR">ZAR</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Billing Cycle
                            </label>
                            <select
                              value={planFormData.billingCycle}
                              onChange={(e) => setPlanFormData({ ...planFormData, billingCycle: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={planFormData.description}
                              onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Plan description"
                              rows={2}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Users
                            </label>
                            <input
                              type="number"
                              value={planFormData.maxUsers}
                              onChange={(e) => setPlanFormData({ ...planFormData, maxUsers: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Leave empty for unlimited"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Organizations
                            </label>
                            <input
                              type="number"
                              value={planFormData.maxOrganisations}
                              onChange={(e) => setPlanFormData({ ...planFormData, maxOrganisations: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="Leave empty for unlimited"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Features (comma-separated)
                            </label>
                            <textarea
                              value={planFormData.features}
                              onChange={(e) => setPlanFormData({ ...planFormData, features: e.target.value })}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="e.g., API Access, Priority Support, Advanced Analytics"
                              rows={3}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <button
                            type="submit"
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            {editingPlanId ? 'Update Plan' : 'Create Plan'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPlanForm(false);
                              setEditingPlanId(null);
                              setPlanFormData({
                                name: '',
                                description: '',
                                price: '',
                                currency: 'USD',
                                billingCycle: 'monthly',
                                features: '',
                                maxUsers: '',
                                maxOrganisations: '',
                              });
                            }}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </RouteGuard>
  );
}
