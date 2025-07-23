'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  GET_SUBSCRIPTION_PLANS, 
  CREATE_SUBSCRIPTION_PLAN, 
  UPDATE_SUBSCRIPTION_PLAN,
  DELETE_SUBSCRIPTION_PLAN 
} from '@/graphql/subscription-management';

interface PlanFormData {
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'MONTHLY' | 'YEARLY';
  intervalCount: number;
  trialPeriodDays: number;
  features: string[];
  isActive: boolean;
}

const DEFAULT_PLAN_DATA: PlanFormData = {
  name: '',
  description: '',
  amount: 0,
  currency: 'GHS',
  interval: 'MONTHLY',
  intervalCount: 1,
  trialPeriodDays: 0,
  features: [],
  isActive: true,
};

export default function PlansManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState<PlanFormData>(DEFAULT_PLAN_DATA);
  const [newFeature, setNewFeature] = useState('');

  // GraphQL queries and mutations
  const { data: plansData, loading, refetch } = useQuery(GET_SUBSCRIPTION_PLANS, {
    variables: { filter: { isActive: undefined } }, // Get all plans (active and inactive)
  });

  const [createPlan, { loading: createLoading }] = useMutation(CREATE_SUBSCRIPTION_PLAN, {
    onCompleted: () => {
      setShowCreateModal(false);
      setFormData(DEFAULT_PLAN_DATA);
      refetch();
    },
    onError: (error) => {
      console.error('Failed to create plan:', error);
    }
  });

  const [updatePlan, { loading: updateLoading }] = useMutation(UPDATE_SUBSCRIPTION_PLAN, {
    onCompleted: () => {
      setEditingPlan(null);
      setFormData(DEFAULT_PLAN_DATA);
      refetch();
    },
    onError: (error) => {
      console.error('Failed to update plan:', error);
    }
  });

  const [deletePlan, { loading: deleteLoading }] = useMutation(DELETE_SUBSCRIPTION_PLAN, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Failed to delete plan:', error);
    }
  });

  const plans = plansData?.subscriptionPlans || [];
  const filteredPlans = plans.filter((plan: any) =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePlan = () => {
    setFormData(DEFAULT_PLAN_DATA);
    setEditingPlan(null);
    setShowCreateModal(true);
  };

  const handleEditPlan = (plan: any) => {
    setFormData({
      name: plan.name,
      description: plan.description || '',
      amount: plan.amount,
      currency: plan.currency,
      interval: plan.interval,
      intervalCount: plan.intervalCount,
      trialPeriodDays: plan.trialPeriodDays || 0,
      features: plan.features || [],
      isActive: plan.isActive,
    });
    setEditingPlan(plan);
    setShowCreateModal(true);
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      await deletePlan({ variables: { id: planId } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
    };

    if (editingPlan) {
      await updatePlan({
        variables: {
          id: editingPlan.id,
          input: planData
        }
      });
    } else {
      await createPlan({
        variables: { input: planData }
      });
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
          <p className="text-gray-600">Create and manage subscription plans for organizations</p>
        </div>
        <Button onClick={handleCreatePlan} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan: any) => (
          <Card key={plan.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {plan.activeSubscriptionsCount || 0} subscriptions
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPlan(plan)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePlan(plan.id)}
                  disabled={deleteLoading}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(plan.amount, plan.currency)}
                </div>
                <div className="text-sm text-gray-500">
                  per {plan.interval.toLowerCase()}
                  {plan.intervalCount > 1 && ` (${plan.intervalCount}x)`}
                </div>
              </div>

              {plan.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
              )}

              {plan.trialPeriodDays > 0 && (
                <div className="text-sm text-green-600">
                  {plan.trialPeriodDays} days free trial
                </div>
              )}

              {plan.features && plan.features.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Features:</div>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {plan.features.slice(0, 3).map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-xs text-gray-400">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No plans found</div>
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm('')}
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingPlan ? 'Edit Plan' : 'Create New Plan'}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Professional Plan"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="GHS">GHS (Ghana Cedis)</option>
                    <option value="USD">USD (US Dollars)</option>
                    <option value="NGN">NGN (Nigerian Naira)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Billing Interval
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value as 'MONTHLY' | 'YEARLY' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trial Period (Days)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.trialPeriodDays}
                    onChange={(e) => setFormData(prev => ({ ...prev, trialPeriodDays: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active Plan
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the plan..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature}>
                      Add
                    </Button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="space-y-1">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <span className="text-sm">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createLoading || updateLoading}
                >
                  {createLoading || updateLoading ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
